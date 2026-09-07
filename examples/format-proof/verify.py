"""Read-only Office package checks; writes only evidence next to these samples."""
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import posixpath
import re
import subprocess
import sys
import zipfile
from lxml import etree as ET
from docx import Document

ROOT = Path(os.environ.get('FORMAT_PROOF_OUTPUT', Path(__file__).resolve().parent))
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      's': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def package_check(file):
    result = {'file': file.name, 'bytes': file.stat().st_size,
              'sha256': hashlib.sha256(file.read_bytes()).hexdigest()}
    with zipfile.ZipFile(file) as z:
        assert z.testzip() is None, 'ZIP CRC failure'
        names = set(z.namelist())
        parsed = {}
        missing = []
        for name in names:
            if name.endswith(('.xml', '.rels')):
                parsed[name] = ET.fromstring(z.read(name))
            if name.endswith('.rels'):
                base = str(PurePosixPath(name).parent.parent)
                if base == '.': base = ''
                for rel in parsed[name]:
                    if rel.get('TargetMode') == 'External': continue
                    target = rel.get('Target', '').split('#')[0]
                    if not target: continue
                    resolved = posixpath.normpath(posixpath.join(base, target)).lstrip('/')
                    if resolved not in names: missing.append({'from': name, 'target': target})
        assert not missing, missing
        dangling_content_types = [node.get('PartName') for node in parsed['[Content_Types].xml']
                                  if node.get('PartName') and node.get('PartName').lstrip('/') not in names]
        assert not dangling_content_types, dangling_content_types
        result.update(zip_crc='pass', xml_parts_parsed=len(parsed), missing_internal_targets=missing)
        if file.suffix == '.pptx':
            slides = sorted([n for n in names if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)], key=lambda s: int(re.search(r'(\d+)\.xml', s)[1]))
            assert len(slides) == 4
            slide_data = []
            for n in slides:
                root = parsed[n]
                words = root.xpath('//a:t/text()', namespaces=NS)
                slide_data.append({'part': n, 'text': words,
                                   'native_text_runs': len(words),
                                   'native_tables': len(root.xpath('//a:tbl', namespaces=NS)),
                                   'native_charts': len(root.xpath('//c:chart', namespaces=NS)),
                                   'pictures': len(root.xpath('//p:pic', namespaces=NS))})
            assert slide_data[1]['native_tables'] == 1
            assert slide_data[2]['native_charts'] == 1
            assert all(s['pictures'] == 0 for s in slide_data)
            for required in ['20 家', '12 家', '8 家']:
                assert required in slide_data[1]['text'], required
            assert '重合情况未知' in '\n'.join(slide_data[1]['text'])
            assert '无对照组' in '\n'.join(slide_data[2]['text'])
            charts = [n for n in names if re.fullmatch(r'ppt/charts/chart\d+\.xml', n)]
            assert len(charts) == 1
            chart = parsed[charts[0]]
            values = chart.xpath('//c:ser/c:val//c:pt/c:v/text()', namespaces=NS)
            labels = chart.xpath('//c:ser/c:cat//c:pt/c:v/text()', namespaces=NS)
            assert list(map(float, values)) == [7, 5], values
            assert labels == ['上线前', '上线后'], labels
            assert chart.xpath('//c:valAx/c:scaling/c:min/@val', namespaces=NS) == ['0']
            assert chart.xpath('//c:valAx/c:scaling/c:max/@val', namespaces=NS) == ['8']
            embedded = [n for n in names if n.startswith('ppt/embeddings/') and n.endswith('.xlsx')]
            assert len(embedded) == 1
            with zipfile.ZipFile(io.BytesIO(z.read(embedded[0]))) as book:
                assert book.testzip() is None
                sheet = ET.fromstring(book.read('xl/worksheets/sheet1.xml'))
                workbook_numbers = sheet.xpath('//s:c[not(@t) or @t="n"]/s:v/text()', namespaces=NS)
                assert list(map(float, workbook_numbers)) == [7, 5], workbook_numbers
            result.update(slide_count=len(slides), slides=slide_data,
                          chart_categories=labels, chart_values=values,
                          embedded_workbooks=embedded, embedded_workbook_numbers=workbook_numbers,
                          native_chart_and_workbook_values_match=True)
        else:
            root = parsed['word/document.xml']
            paragraphs = root.xpath('//w:body/w:p', namespaces=NS)
            text = [''.join(p.xpath('.//w:t/text()', namespaces=NS)) for p in paragraphs]
            for required in ['内容更新。', '依赖检查：每月一次。', '新功能开发不在本维护范围内。',
                             '紧急故障优先排查，未承诺响应时间。', '本说明未列明报价和签约日期。']:
                assert required in text, required
            headings = root.xpath('//w:p[w:pPr/w:pStyle[@w:val="Heading1"]]', namespaces=NS)
            assert len(headings) == 4
            assert not root.xpath('//w:drawing|//w:pict|//w:documentProtection', namespaces=NS)
            styles = parsed['word/styles.xml']
            normal_font = styles.xpath('//w:style[@w:styleId="Normal"]/w:rPr/w:rFonts/@w:eastAsia', namespaces=NS)
            assert normal_font == ['Microsoft YaHei'], normal_font
            section = root.xpath('//w:sectPr/w:pgSz', namespaces=NS)[0]
            assert section.get('{'+NS['w']+'}w') == '12240'
            assert section.get('{'+NS['w']+'}h') == '15840'
            document = Document(file)
            assert [p.text for p in document.paragraphs] == text
            result.update(paragraphs=text, semantic_heading_count=len(headings),
                          native_body_paragraphs=len(paragraphs), inline_images=0,
                          python_docx_reopen='pass', page_size='Letter portrait',
                          designed_page_count=1, rendered_page_count=None,
                          actual_pagination='not verified; no document renderer used')
    return result

report = {'scope': 'Fictional test scenes, unrelated to EEBadge business',
          'pptx': package_check(ROOT / 'pilot-review.pptx'),
          'docx': package_check(ROOT / 'website-maintenance-scope.docx'),
          'rendering': {'status': 'not verified', 'reason': 'Bundled runtime has no Office/LibreOffice renderer. No substitute rendering route used.'},
          'office_application_edit_save_reopen': 'not verified'}
skill_dir = os.environ.get('PRESENTATIONS_SKILL_DIR')
if skill_dir:
    commands = {
      'package_integrity': ['inspect_presentation_package_integrity.py', str(ROOT / 'pilot-review.pptx'), '--fail-on-findings'],
      'layout_geometry': ['inspect_presentation_layout_geometry.py', str(ROOT / 'pilot-review.pptx'),
                          '--expected-aspect', '16:9', '--expected-slide-count', '4',
                          '--require-native-table-slide', '2', '--validate-heading-fit', '--fail-on-findings']}
    report['bundled_checks'] = {}
    for name, args in commands.items():
        command = [sys.executable, str(Path(skill_dir) / 'container_tools' / args[0]), *args[1:]]
        run = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
        output = {'exit_code': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr}
        (ROOT / f'{name}.json').write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
        report['bundled_checks'][name] = {'exit_code': run.returncode, 'evidence': f'{name}.json'}
(ROOT / 'ooxml-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'pptx_slides': report['pptx']['slide_count'],
                  'pptx_native_chart_workbook_match': True,
                  'docx_heading_count': report['docx']['semantic_heading_count'],
                  'docx_rendered_page_count': None,
                  'bundled_checks': report.get('bundled_checks', {})}, ensure_ascii=False, indent=2))
