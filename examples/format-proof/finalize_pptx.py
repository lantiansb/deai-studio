"""Remove only dangling slide-master content-type entries emitted by the generator."""
import json
import os
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(os.environ.get('FORMAT_PROOF_OUTPUT', Path(__file__).resolve().parent))
file = ROOT / 'pilot-review.pptx'
ns = 'http://schemas.openxmlformats.org/package/2006/content-types'
ET.register_namespace('', ns)
removed = []
with zipfile.ZipFile(file) as source:
    names = set(source.namelist())
    tree = ET.fromstring(source.read('[Content_Types].xml'))
    for node in list(tree):
        part = node.get('PartName', '').lstrip('/')
        if node.tag == '{'+ns+'}Override' and part not in names:
            if not re.fullmatch(r'ppt/slideMasters/slideMaster\d+\.xml', part):
                raise ValueError('Unexpected missing package part: ' + part)
            removed.append(part)
            tree.remove(node)
    if removed:
        temporary = ROOT / 'pilot-review.normalized.tmp'
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED) as target:
            for info in source.infolist():
                target.writestr(info, ET.tostring(tree, encoding='utf-8', xml_declaration=True)
                               if info.filename == '[Content_Types].xml' else source.read(info.filename))
if removed:
    os.replace(temporary, file)
(ROOT / 'generation-adjustments.json').write_text(json.dumps({
    'removed_dangling_slide_master_content_type_entries': removed,
    'other_package_parts_changed': False
}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'removed_entries': removed}, ensure_ascii=False))
