import importlib.util
import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('build_release', ROOT / 'scripts' / 'build_release.py')
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class ReleaseTests(unittest.TestCase):
    def fixture(self, root):
        (root / '.codex-plugin').mkdir()
        (root / '.codex-plugin/plugin.json').write_text(json.dumps({'name': 'deai-studio', 'version': '0.1.0', 'skills': './skills/'}))
        skill = root / 'skills/deai'
        skill.mkdir(parents=True)
        (skill / 'SKILL.md').write_text('---\nname: deai\ndescription: Create artifacts.\n---\nRead [guide](references/guide.md).\n')
        (skill / 'references').mkdir()
        (skill / 'references/guide.md').write_text('# Guide\n')
        (root / 'LICENSE').write_text('MIT\n')
        (root / 'README.md').write_text('# DeAI\n')
        (root / 'NOTICE.md').write_text('Original work.\n')

    def test_release_is_self_contained_and_excludes_unrelated_files(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td) / 'plugin'
            root.mkdir()
            self.fixture(root)
            (root / '.env').write_text('PRIVATE_TEST_SENTINEL')
            (root / 'private-notes.txt').write_text('PRIVATE_TEST_SENTINEL')
            archive = release.build(root, Path(td) / 'dist')
            with zipfile.ZipFile(archive) as z:
                names = z.namelist()
                self.assertIsNone(z.testzip())
                self.assertFalse(any('.env' in n or 'private-notes' in n for n in names))
                market_path = next(n for n in names if n.endswith('/.agents/plugins/marketplace.json'))
                market = json.loads(z.read(market_path))
                entry = market['plugins'][0]
                prefix = market_path.split('/.agents/')[0]
                manifest_path = prefix + '/' + entry['source']['path'].removeprefix('./') + '/.codex-plugin/plugin.json'
                self.assertIn(manifest_path, names)
                self.assertEqual(json.loads(z.read(manifest_path))['name'], entry['name'])
                self.assertTrue(any(n.endswith('/skills/deai/references/guide.md') for n in names))

    def test_missing_local_reference_is_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.fixture(root)
            (root / 'skills/deai/references/guide.md').unlink()
            with self.assertRaisesRegex(ValueError, 'reference'):
                release.validate(root)

    def test_developer_absolute_path_is_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.fixture(root)
            (root / 'skills/deai/references/guide.md').write_text('Read [private](C:/Users/Someone/Desktop/private.md).')
            with self.assertRaisesRegex(ValueError, 'absolute'):
                release.validate(root)

    def test_reference_cannot_escape_package(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td) / 'plugin'
            root.mkdir()
            self.fixture(root)
            (Path(td) / 'outside.md').write_text('not distributable')
            (root / 'skills/deai/references/guide.md').write_text('[outside](../../../../outside.md)')
            with self.assertRaisesRegex(ValueError, 'escape'):
                release.validate(root)

    def test_missing_runtime_asset_is_rejected(self):
        examples = {
            'index.html': '<link rel="stylesheet" href="missing.css"><script src="missing.js"></script>',
            'styles.css': '.hero { background-image: url("missing.png"); }',
            'module.js': 'import { run } from "./missing.js";',
        }
        for filename, content in examples.items():
            with self.subTest(filename=filename), tempfile.TemporaryDirectory() as td:
                root = Path(td)
                self.fixture(root)
                assets = root / 'skills/deai/assets'
                assets.mkdir()
                (assets / filename).write_text(content)
                with self.assertRaisesRegex(ValueError, 'reference'):
                    release.validate(root)

    def test_valid_runtime_references_and_external_modules(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.fixture(root)
            assets = root / 'skills/deai/assets'
            assets.mkdir()
            (assets / 'index.html').write_text('<link rel="stylesheet" href="styles.css?v=1"><script src="module.js"></script>')
            (assets / 'styles.css').write_text('.icon { background-image: url(data:image/svg+xml;base64,PHN2Zz4=); }')
            (assets / 'module.js').write_text('import { readFile } from "node:fs"; import thing from "some-package";')
            release.validate(root)

    def test_release_is_reproducible_across_build_times(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td) / 'plugin'
            root.mkdir()
            self.fixture(root)
            with patch.object(release.zipfile.time, 'localtime', return_value=(2025, 1, 2, 3, 4, 5, 3, 2, -1)):
                first = release.build(root, Path(td) / 'first')
            with patch.object(release.zipfile.time, 'localtime', return_value=(2026, 6, 7, 8, 9, 10, 6, 158, -1)):
                second = release.build(root, Path(td) / 'second')
            self.assertEqual(hashlib.sha256(first.read_bytes()).digest(), hashlib.sha256(second.read_bytes()).digest())


if __name__ == '__main__':
    unittest.main()
