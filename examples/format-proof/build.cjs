// Run with Node.js and pptxgenjs available through normal resolution or NODE_PATH.
const fs = require('node:fs');
const path = require('node:path');
const pptxgen = require('pptxgenjs');
const out = path.resolve(process.env.FORMAT_PROOF_OUTPUT || __dirname);
fs.mkdirSync(out, { recursive: true });
const ppt = new pptxgen();
ppt.layout = 'LAYOUT_WIDE';
ppt.author = 'deai-studio format proof';
ppt.subject = '虚构测试场景，与 EEBadge 实际业务无关';
ppt.title = '新预约表内部试点汇报';
ppt.company = 'Fictional test scenario';
ppt.lang = 'zh-CN';
const FONT = 'Microsoft YaHei';
ppt.theme = { headFontFace: FONT, bodyFontFace: FONT, lang: 'zh-CN' };
const INK = '182D40', BLUE = '1658A6', MUTED = '4D5E6E';
function text(slide, content, x, y, w, h, size = 28, color = INK, bold = false) {
  slide.addText(content, { x: x/96, y: y/96, w: w/96, h: h/96,
    fontFace: FONT, fontSize: size*.75, color, bold, margin: 0,
    valign: 'top', breakLine: false, paraSpaceAfterPt: 0, lang: 'zh-CN' });
}
function page(title, number) {
  const s = ppt.addSlide();
  s.background = { color: 'FFFFFF' };
  text(s, title, 70, 48, 1140, 76, 44, INK, true);
  text(s, `虚构测试场景 · 内部试点汇报    ${number} / 4`, 70, 667, 1140, 28, 16, MUTED);
  s.addNotes('全部场景与数据为任务给定的虚构测试材料，与 EEBadge 实际业务无关。');
  return s;
}
{
  const s = page('新预约表：申请再观察 4 周', 1);
  text(s, '登记时长中位数', 70, 185, 1100, 44, 28, MUTED);
  text(s, '7 分钟 → 5 分钟', 70, 245, 1120, 105, 72, BLUE, true);
  text(s, '上线前与上线后的记录出现差异。', 70, 385, 1120, 50, 30);
  text(s, '目前仅观察 2 周，且无对照组。\n这些记录不能确定变化由新预约表引起。', 70, 480, 1120, 116, 30);
}
{
  const s = page('回复门店与使用门店分别记录', 2);
  const rows = [
    [{ text: '记录项目', options: { bold: true, fill: 'EAF0F5' } }, { text: '门店数', options: { bold: true, fill: 'EAF0F5' } }],
    ['试点涉及门店', '20 家'], ['已回复门店', '12 家'], ['使用新预约表的门店', '8 家']
  ];
  s.addTable(rows, { x: 70/96, y: 170/96, w: 1140/96, h: 340/96,
    colW: [880/96, 260/96], rowH: 85/96,
    fontFace: FONT, fontSize: 29*.75, color: INK, fill: 'FFFFFF',
    border: { type: 'solid', color: 'C4CFD8', pt: .75 },
    margin: [12, 18, 12, 18], valign: 'mid', autoPage: false });
  text(s, '12 家回复门店与 8 家使用门店的重合情况未知。', 70, 555, 1140, 52, 29, BLUE, true);
  s.addNotes('20、12、8 分别是给定的门店总数、回复数、使用数；不假定 8 家属于 12 家，不将两项作为互斥集合相加。');
}
{
  const s = page('单次登记中位数由 7 分钟变为 5 分钟', 3);
  s.addChart(ppt.ChartType.bar, [{ name: '登记时长中位数（分钟）', labels: ['上线前', '上线后'], values: [7, 5] }], {
    x: 70/96, y: 170/96, w: 740/96, h: 405/96,
    barDir: 'col', catName: '阶段', catAxisLabelFontFace: FONT, catAxisLabelFontSize: 19.5,
    valAxisLabelFontFace: FONT, valAxisLabelFontSize: 17.25,
    valAxisMinVal: 0, valAxisMaxVal: 8, valAxisMajorUnit: 2,
    showLegend: false, showTitle: false, showValue: true, showCatName: false,
    showBorder: false, showCatName: false, showValAxisTitle: true, valAxisTitle: '分钟',
    valAxisTitleFontFace: FONT, valAxisTitleFontSize: 18,
    chartColors: [BLUE], catAxisLabelColor: INK, valAxisLabelColor: MUTED,
    showMarker: false, showLine: false, gapSize: 160,
    showShadow: false, showSerName: false,
    dataLabelPosition: 'outEnd', dataLabelColor: INK, dataLabelFormatCode: '0',
    dataLabelBkgrdColor: 'FFFFFF', dataLabelFontFace: FONT, dataLabelFontSize: 22,
    catAxisLineShow: false, valAxisLineShow: false,
    catGridLine: { style: 'none' }, valGridLine: { color: 'D8E0E6', width: .75 }
  });
  text(s, '中位数相差', 885, 215, 315, 48, 27, MUTED);
  text(s, '2 分钟', 885, 285, 315, 82, 55, BLUE, true);
  text(s, '7 − 5 = 2\n仅描述数值差异。', 885, 390, 315, 100, 26);
  text(s, '观察仅 2 周，无对照组；登记样本量与测量口径未提供。', 70, 600, 1140, 50, 24, MUTED);
  s.addNotes('图表使用共同零点和 0 至 8 分钟范围。2 分钟为 7−5 的算术差；不推算总工时或因果效果。');
}
{
  const s = page('延长观察的申请', 4);
  text(s, '再观察 4 周', 70, 175, 1120, 100, 64, BLUE, true);
  text(s, '现有依据', 70, 340, 330, 50, 30, INK, true);
  text(s, '观察期只有 2 周，且无对照组。\n当前数据不足以确定变化原因。', 415, 332, 790, 110, 29);
  text(s, '建议补充的记录', 70, 485, 330, 50, 30, INK, true);
  text(s, '回复与使用门店的对应关系；\n登记时长的样本信息与测量口径。', 415, 477, 790, 110, 29);
  text(s, '延长观察本身也不能建立因果关系。', 70, 608, 1140, 45, 24, MUTED);
  s.addNotes('再观察 4 周是给定的申请，尚不是获批安排。补充记录明确标为建议，不代表新增已约定责任、预算或截止日期。');
}
ppt.writeFile({ fileName: path.join(out, 'pilot-review.pptx') });
