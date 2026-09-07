# Codex 机制与图片模块的证据

核查日期：2026-09-05。

## Codex

技能可以显式选择，也可以由任务描述匹配；匹配不是强制接管。插件适合分发一组技能与资源。来源：[Build skills](https://learn.chatgpt.com/docs/build-skills)、[Build plugins](https://learn.chatgpt.com/docs/build-plugins)。这些是产品文档，本插件只引用链接和原创摘要，不复制工具或系统提示。

本版是技能与本地资产包，不需要 MCP 服务。以 marketplace 指向相对插件目录进行本地或仓库分发；公开目录上架是另一个实际提交过程。来源：[Package your plugin](https://developers.openai.com/plugins/build/plugins)。本机 CLI 0.145.0 的 `plugin add`、`plugin remove`、`plugin marketplace add` 帮助已实际读取；是否安装成功以验证记录为准。

## 图片

图片模块来自本项目先前的 image-deai-art-direction v0.3。方法来源包括 [官方 imagegen 提示规范](https://github.com/openai/skills/blob/main/skills/.system/imagegen/references/prompting.md)、[GPT Image 提示指南](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide) 和 [Image Evals](https://developers.openai.com/cookbook/examples/multimodal/image_evals)。本插件独立组织了主次、媒介、保留项与局部编辑规则，没有复制这些完整资料。

此前实际生成与参考图编辑表明：合并密集发丝、衣服碎亮条和背景高频纹理可以改变画面密度；不同画风效果不一致。部分图改善明显，另一些几乎不变，金属过度光滑、环境层次减少也可能是退步。用户确认过其中一个简洁动漫版本，并认可后续主流动漫对比的价值。这些是单项目偏好证据，不代表所有用户都喜欢平涂或低细节。

试验为“初图→参考图编辑”，没有相同 seed 的独立文生图控制，不能据此证明统一的单次生成成功率。插件首版采用的生成前简报还需跨题材持续验证。原始试验图片和客户截图不包含在可分发插件中。

经验上的有效约束：锁定用户更喜欢的版本；保留造型与必要结构；减少细节时不同时追加新材质、新光源或新一层塑形。细节被减少后仍检查原画风、材质差别和场景信息。JOJO 式结构排线、水彩边缘和合理照片纹理不能一概当作噪点。

“换新对话必然解决”“细节越少越像人工”没有在本项目得到支持，不作为插件规则。工具未公开具体模型、seed或内部状态时，不声称能够控制它们。
