# Office 格式样例核验

核验日期：2026-09-05。全部内容为虚构测试场景，与 EEBadge 实际业务无关。本次按 deai 入口、演示、文档及验收参考制作；未阅读其他实验结果。

## 产物

- [pilot-review.pptx](pilot-review.pptx)：4 页内部试点汇报。正文为原生文本，第 2 页为原生表格，第 3 页为原生柱形图并附内嵌 XLSX 数据。
- [website-maintenance-scope.docx](website-maintenance-scope.docx)：原生正文和语义标题；**按 1 页设计，未渲染确认页数**。

## 工具及实际检查

使用现有工作区依赖：PptxGenJS 4.0.1、python-docx 1.2.0、lxml 6.1.1，以及 Python 标准库。源文件使用标准包导入，没有将本机依赖绝对路径写入生成脚本。未安装软件、启动服务或联网发布。

| 状态 | 本轮实际做过的检查 |
| --- | --- |
| 通过 | 两个文件均为真实 OOXML ZIP 包；CRC、XML 解析、内部关系目标及内容类型目标检查通过。 |
| 通过 | PPTX 有 4 个幻灯片部件；第 2 页有 1 个原生表格，第 3 页有 1 个原生图表，4 页均无图片对象代替正文。 |
| 通过 | 图表类别为“上线前／上线后”，值为 7／5；内嵌工作簿中的数值一致；值轴明确为 0—8。 |
| 通过 | 门店数 20、12、8 均保留；正文写明回复与使用门店的重合情况未知，没有做子集假设。 |
| 通过 | 2 周观察、无对照组、再观察 4 周申请均保留；2 分钟仅为 7−5 的算术差，没有推算总工时或声称因果。 |
| 通过 | DOCX 以 python-docx 重新读取；包含 4 个 Heading 1 标题；内容保留每月一次依赖检查、不含新功能开发、紧急故障优先排查且未承诺响应时间。未增加报价、签约日期或其他履约义务。 |
| 通过 | 随 presentations 技能提供的包完整性检查与几何检查均返回 0；16:9、4 页、原生表格和标题适配检查未报告问题。几何检查不等于视觉检查。 |
| 未验证 | PPTX、DOCX 的真实 Office/LibreOffice 页面渲染、字体替代、视觉溢出、Word 实际页数，以及目标应用内编辑、保存、重新打开。 |
| 未验证 | 读屏、完整可访问性、不同 Office 版本及 Google Slides/Docs 的兼容性。 |

本机依赖清单未提供 Office/LibreOffice 渲染器。现有 PDF 工具不能直接渲染这两个 Office 文件，因此本轮未执行渲染，也没有使用其他途径制作替代预览。可编辑性证据来自原生 OOXML 对象与内嵌数据结构，不代表已验证应用内交互。

PptxGenJS 的首次输出包含 3 条指向不存在母版的内容类型声明。`finalize_pptx.py` 仅移除这些失效声明，保留其余包部件；随后重新核验通过。此修正记录在 [generation-adjustments.json](generation-adjustments.json)。

详细证据：[OOXML 和内容检查](ooxml-checks.json)、[包完整性检查](package_integrity.json)、[几何检查](layout_geometry.json)。文件哈希在 OOXML 检查记录中。

## 重新生成

在本目录运行，使用已配置的 Node.js、Python，以及上述依赖：

```text
node build.cjs
python finalize_pptx.py
python build_docx.py
python verify.py
```

Node 的正常包解析路径中需要有 `pptxgenjs`；已有集中依赖目录时可通过 `NODE_PATH` 指定。四个脚本均可用 `FORMAT_PROOF_OUTPUT` 指定输出目录，默认使用脚本所在目录。

`verify.py` 默认执行随样例提供的 OOXML 与内容检查。若要重跑本轮额外使用的 presentations 检查器，将 `PRESENTATIONS_SKILL_DIR` 设为当地已安装的 presentations 技能目录；不设置时会跳过这两项，不能声称已重跑。

生成脚本可覆盖同名样例，应在保留需要的版本后运行。需要确认实际分页与视觉效果时，在具备本地 Office 渲染能力的环境打开最终文件并检查全部页面；本记录不预先判定该检查结果。
