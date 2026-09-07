"""Validate a self-contained skill bundle and build an installable local marketplace ZIP."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

DIRECTORIES = {'skills', 'assets', 'docs', 'examples', 'scripts', 'tests', '.codex-plugin'}
ROOT_FILES = {'README.md', 'README.en.md', 'LICENSE', 'NOTICE.md', 'CHANGELOG.md'}
EXTENSIONS = {'.md', '.json', '.yaml', '.yml', '.svg', '.html', '.css', '.js', '.mjs', '.cjs', '.py', '.txt', '.png', '.pptx', '.docx', '.pdf'}
ARCHIVE_TIMESTAMP = (1980, 1, 1, 0, 0, 0)


class HTMLReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and (key in {'src', 'href', 'poster'} or (tag == 'object' and key == 'data')):
                self.targets.append(value)


def references(path: Path, text: str):
    """Find direct local references, not arbitrary dynamically generated URLs."""
    suffix = path.suffix.lower()
    if suffix == '.md':
        return re.findall(r'\]\(([^)]+)\)', text)
    if suffix == '.html':
        parser = HTMLReferences()
        parser.feed(text)
        return parser.targets
    if suffix == '.css':
        return [match[1] for match in re.findall(r'url\(\s*([\'"]?)(.*?)\1\s*\)', text)]
    if suffix in {'.js', '.mjs', '.cjs'}:
        imports = re.findall(r'(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)[\'"]([^\'"]+)[\'"]', text)
        return [target for target in imports if target.startswith(('.', '/'))]
    return []


def files(root: Path):
    root = root.resolve()
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if any(part in {'.git', '__pycache__', 'node_modules', '.pytest_cache'} for part in relative.parts):
            continue
        if relative.parts[0] not in DIRECTORIES and str(relative) not in ROOT_FILES:
            continue
        if path.is_symlink():
            raise ValueError(f'Symlink cannot be distributed: {relative}')
        if not path.is_file():
            continue
        if path.name == 'LICENSE' or path.suffix.lower() in EXTENSIONS:
            if not path.resolve().is_relative_to(root):
                raise ValueError(f'Path escape: {relative}')
            yield path


def validate(root: Path):
    root = root.resolve()
    manifest = json.loads((root / '.codex-plugin/plugin.json').read_text(encoding='utf-8'))
    name, version = manifest['name'], manifest['version']
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name):
        raise ValueError('Invalid plugin name')
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?', version):
        raise ValueError('Invalid semantic version')
    required = ['LICENSE', 'README.md', 'NOTICE.md', 'skills']
    for item in required:
        if not (root / item).exists():
            raise ValueError(f'Missing required resource: {item}')
    if not list((root / 'skills').glob('*/SKILL.md')):
        raise ValueError('No skill entrypoint')
    paths = list(files(root))
    packaged = set(path.resolve() for path in paths)
    for path in paths:
        if path.suffix.lower() not in {'.md', '.json', '.yaml', '.yml', '.html', '.css', '.js', '.mjs', '.cjs', '.txt'}:
            continue
        text = path.read_text(encoding='utf-8')
        if re.search(r'(?<![A-Za-z])[A-Za-z]:[\\/](?:Users|Documents and Settings)[\\/]', text):
            raise ValueError(f'Developer absolute path in {path.relative_to(root)}')
        if '[TODO:' in text:
            raise ValueError(f'Unfinished scaffold in {path.relative_to(root)}')
        for target in references(path, text):
            target = target.strip().strip('<>')
            if re.match(r'^(?:https?://|mailto:|codex:|data:|tel:|#)', target):
                continue
            target = unquote(target.split('#', 1)[0].split('?', 1)[0])
            if not target:
                continue
            if re.match(r'^(?:[A-Za-z]:[\\/]|/|file:)', target):
                raise ValueError(f'absolute local reference in {path.relative_to(root)}: {target}')
            dest = (path.parent / target).resolve()
            if not dest.is_relative_to(root):
                raise ValueError(f'Local reference escape in {path.relative_to(root)}: {target}')
            if not dest.exists() or (dest.is_file() and dest not in packaged):
                raise ValueError(f'Missing distributable local reference in {path.relative_to(root)}: {target}')
    return manifest, paths


def write_entry(archive: zipfile.ZipFile, name: str, content: bytes | str):
    info = zipfile.ZipInfo(name, ARCHIVE_TIMESTAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.create_system = 3
    info.external_attr = 0o100644 << 16
    archive.writestr(info, content)


def build(root: Path, output: Path):
    manifest, paths = validate(root)
    root, output = root.resolve(), output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    name, version = manifest['name'], manifest['version']
    prefix = f'{name}-{version}'
    archive = output / f'{prefix}.zip'
    if archive.exists():
        raise FileExistsError(f'Release already exists: {archive}. Choose a new version or output folder.')
    market = {'name': name, 'interface': {'displayName': 'DeAI Studio'}, 'plugins': [{
        'name': name, 'source': {'source': 'local', 'path': f'./plugins/{name}'},
        'policy': {'installation': 'AVAILABLE', 'authentication': 'ON_INSTALL'}, 'category': 'Productivity'}]}
    installation = f'''# 安装 DeAI Studio

解压后，进入本文件所在目录（其中应有隐藏目录 `.agents` 与 `plugins`）。需要支持 `codex plugin` 的 Codex CLI。

```sh
codex plugin marketplace add .
codex plugin add {name}@{name}
```

这里添加的是解压包自己的本地 marketplace。它与 Codex 自动发现的个人 marketplace 不同。保留解压目录，之后更新时从新包目录刷新来源。不要覆盖同名的其他 marketplace。

安装后开启一个新任务，输入 `$deai 写一份产品介绍，依据当前目录的资料`。也可以从技能选择器选取去 AI 味技能，再输入简短需求。

完整用法、能力边界、卸载与分享说明见 `plugins/{name}/README.md`。此ZIP是本地可安装分发包，尚不表示已发布到公开插件目录。
'''
    with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED) as z:
        for path in paths:
            write_entry(z, f'{prefix}/plugins/{name}/{path.relative_to(root).as_posix()}', path.read_bytes())
        write_entry(z, f'{prefix}/.agents/plugins/marketplace.json', json.dumps(market, ensure_ascii=False, indent=2) + '\n')
        write_entry(z, f'{prefix}/INSTALL.md', installation)
    return archive


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--out', type=Path, default=Path.cwd() / 'dist')
    parser.add_argument('--validate-only', action='store_true')
    args = parser.parse_args()
    if args.validate_only:
        manifest, paths = validate(args.root)
        print(json.dumps({'plugin': manifest['name'], 'version': manifest['version'], 'files': len(paths), 'relative_references': 'passed'}))
    else:
        archive = build(args.root, args.out)
        print(json.dumps({'archive': str(archive), 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'bytes': archive.stat().st_size}))


if __name__ == '__main__':
    main()
