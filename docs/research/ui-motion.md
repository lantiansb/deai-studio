# deai-studio：前端、UI 与动画交互研究

核查日期：2026-09-05。以下结论来自作者或维护组织的官方仓库、文档与许可原文；未安装依赖，未下载运行外部脚本。研究目标是减少缺乏产品依据的通用模板，不能据此判断作品是否由 AI 生成，也不声称这些作者完全没有使用 AI。

“Codex 适配”分为上游明确支持和可移植两种，均不代表本次完成了安装或运行验证。许可描述限定于所链接的代码或文件；付费产品、第三方依赖、字体、图片与网站文章不自动继承仓库许可。正式纳入插件前应固定版本或提交，避免默认分支变化。

## 分发边界

- **MIT / Apache-2.0 的明确覆盖文件**可以按其条款纳入：保留版权与许可；Apache 文件还需标记修改，并处理适用的 NOTICE。优先提炼原创规则、声明依赖，避免搬入整个上游工具链。
- **GSAP 和 React Bits 只做索引**：前者使用自定义许可；后者附有 Commons Clause，不能当成普通 MIT 组件库打包。
- **Codrops 逐个演示核查**：演示代码默认 MIT，但设计素材、文章、图片与依赖可能另有条款。下列示例的 GSAP 依赖不能随其 MIT 代码一并视为宽松许可。
- Motion+、UI UX Pro Max Premium 等付费内容不在开源仓库许可推定范围内。插件不自动抓取或安装它们。
- Vaul 的 MIT 许可仍有效，但作者已明确暂停维护；适合作为交互研究，不应成为新项目默认依赖。

## 一、设计与审查技能

### 1. Impeccable — Paul Bakaus

- **官方与许可**：[仓库](https://github.com/pbakaus/impeccable)、[实际 SKILL](https://raw.githubusercontent.com/pbakaus/impeccable/main/.agent/skills/impeccable/SKILL.md)、[Apache-2.0 原文](https://raw.githubusercontent.com/pbakaus/impeccable/main/LICENSE)、[NOTICE](https://raw.githubusercontent.com/pbakaus/impeccable/main/NOTICE.md)。可复用被许可覆盖的文件；同时保留适用的第三方归属。核查时 SKILL 为 4.2.0。
- **Codex 适配**：上游明确列出 Codex，包含 provider、技能与 hooks 适配。这里只确认其声明；不直接复制 provider 配置，也不默认启用首次运行可能下载二进制的启动器。
- **值得借鉴的决策**：把产品事实与视觉方向分别记录；先确定当前页面的任务，再决定说服、阅读或操作界面的表现。区分诊断、精修与重设计，精修时保留已有产品身份和行为。明确允许 brief 覆盖通用反模式提示。
- **易误用**：把确定性检测规则当成“AI 生成鉴定”，或一发现渐变、卡片就全站改稿。适合纳入的是有上下文的审查流程，不是越多检测项越好的自动整改。

### 2. Anthropic frontend-design

- **官方与许可**：[技能目录](https://github.com/anthropics/skills/tree/main/skills/frontend-design)、[SKILL 原文](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)、[Apache-2.0 原文](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/LICENSE.txt)。许可结论仅针对此技能，不推广到 Anthropic 仓库内所有技能。
- **Codex 适配**：Markdown 指令可移植；此 SKILL 本身不是 Codex 安装器。迁移时使用目标环境实际可用的工具，不继承其他宿主的工具假设。
- **值得借鉴的决策**：以行业、材料、内容和真实产品动作决定视觉；首屏用最能说明对象的素材。字体、编号和标签要有角色，动画优先解释用户操作；把大胆选择集中在少数位置，让其他内容安静可读。
- **易误用**：把一种模板换成另一种模板，例如所有项目都改为奶油色、衬线体、细分隔线。原文也说明其列举的默认样式在某些 brief 中完全合理；不能把偏好清单变成禁令。

### 3. Taste Skill — Leonxlnx

- **官方与许可**：[仓库与使用说明](https://github.com/Leonxlnx/taste-skill)、[SKILL 原文](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md)、[MIT 原文](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/LICENSE)。代码和指令可依 MIT 复用并保留通知。核查时默认 v2 明确标为 experimental，v1 仍单独保留。
- **Codex 适配**：README 明确支持将技能用于 Codex，并提供面向 GPT/Codex 的变体；仍需选择一个适用入口，避免多个重叠技能同时规定样式。
- **值得借鉴的决策**：用视觉变化、动效、信息密度三个维度讨论取舍；先锁定已有品牌，再做页面映射；补齐 loading、empty、error 等真实状态，要求动画有理由。
- **易误用**：当前默认参数偏强（8/6/4），preserve 模式还会增加 motion，不能原样作为我们的默认值。强制不对称、双主题或一套滚动效果可能损害业务。其示例包含 GSAP；技能的 MIT 不会重新许可 GSAP 运行库。借鉴“可调节”，不继承自动加动效与全局硬禁令。

### 4. UI UX Pro Max — Next Level Builder

- **官方与许可**：[仓库](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)、[实际 SKILL](https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/.claude/skills/ui-ux-pro-max/SKILL.md)、[MIT 原文](https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/LICENSE)。开源仓库可依 MIT 复用；Premium 内容须另核查。
- **Codex 适配**：上游明确提供 Codex 初始化目标。搜索使用 Python 标准库；本次没有执行初始化。源 SKILL 含宿主路径变量，封装时必须改为插件自身可解析的路径，不能仅复制文件名便声称可运行。
- **值得借鉴的决策**：按产品与具体 UX 问题检索样式、排版和栈建议；保留全局设计系统与页面例外，检测项目实际技术栈，优先修正可访问性、触控和状态问题。
- **易误用**：搜索第一名不是量身定制的设计结论；不能根据行业标签直接套主题，也不能把“零时长过渡不好”之类条目用于否决 reduced-motion。字体、图标、外部资源仍逐项核查。适合做候选资料库，不代替设计判断。

## 二、交互实现与研究来源

### 5. Motion

- **官方与许可**：[仓库](https://github.com/motiondivision/motion)、[MIT 原文](https://raw.githubusercontent.com/motiondivision/motion/main/LICENSE.md)、[布局动画](https://motion.dev/docs/react-layout-animations)、[可访问性](https://motion.dev/docs/react-accessibility)。核心库可依 MIT 使用；Motion+、其付费示例和 AI Kit 不因核心库 MIT 自动可打包。
- **Codex 适配**：React 代码生成适配度高，属于实现库而非 Codex 插件。只在项目已有依赖或确有需要时选择。
- **值得借鉴的决策**：用状态驱动布局和共享元素转换，帮助理解项目移动到哪里；以 `MotionConfig` / `useReducedMotion` 适配用户偏好。全局减少动态效果并不自动消除所有透明度或颜色变化，仍需逐项判断。
- **易误用**：所有卡片都加弹簧、入场和布局测量；首屏内容等待 JS 动画才可见；布局缩放扭曲文字或子元素。过渡应解释一次真实变化，而非证明安装了动画库。

### 6. GSAP — GreenSock / Webflow

- **官方与许可**：[仓库](https://github.com/greensock/GSAP)、[Standard “No Charge” License 原文](https://gsap.com/community/standard-license/)、[matchMedia 文档](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)。这是自定义许可。允许多种商业网站和应用用途，但对与 Webflow 动画构建功能竞争的特定可视化创作工具设有限制；“免费”不等于 MIT。按本插件政策仅索引，不搬入代码或运行库。
- **Codex 适配**：可生成对应 JS 集成代码，但须由目标项目单独确认采用与许可范围，不自动列为插件依赖。
- **值得借鉴的决策**：复杂时序用统一时间线；按媒体条件建立并撤销动画；清理监听器与样式，避免断点变化后遗留状态。
- **易误用**：给普通落地页强加逐屏固定和滚动接管；多个引擎控制同一个属性；组件卸载或 reduced-motion 改变后仍运行。这里只借鉴编排思想，不能把第三方许可限制说成所有 Codex 用途都被禁止。

### 7. Anime.js — Julian Garnier

- **官方与许可**：[仓库](https://github.com/juliangarnier/anime)、[MIT 原文](https://raw.githubusercontent.com/juliangarnier/anime/master/LICENSE.md)、[Scope 文档](https://animejs.com/documentation/scope)。可依 MIT 使用并保留通知。
- **Codex 适配**：适合原生 JS、DOM 和 SVG；React 项目也可用，但须封装挂载、作用域与清理。当前 Scope API 与旧版教程不同，按实际安装版本生成代码。
- **值得借鉴的决策**：将动画限制在局部根节点，统一默认值和媒体条件，离开场景后一次撤销；适合说明图、步骤关系和短时序反馈。
- **易误用**：全局选择器影响别处、离屏持续循环，或将时长设为零却仍重复执行。语义状态必须独立于动画存在，撤销动画不能撤销用户已完成的业务操作。

### 8. React Spring — pmndrs

- **官方与许可**：[仓库](https://github.com/pmndrs/react-spring)、[MIT 原文](https://raw.githubusercontent.com/pmndrs/react-spring/next/LICENSE)、[useReducedMotion 文档](https://www.react-spring.dev/docs/utilities/use-reduced-motion)。可依 MIT 使用，保留作者与贡献者通知。
- **Codex 适配**：适合 React，尤其是可中断、不断改变目标值的直接操作；不是专用 Codex 技能。
- **值得借鉴的决策**：关注运动连续性与松手后的收敛；减少动态效果时直接到最终状态，不要求用户等视觉过程完成。
- **易误用**：弹簧长尾延迟操作反馈、每个按钮都过冲。文档方案使用全局跳过动画状态，封装时须明确影响范围，不能由一个局部控件随意切换全站运动策略。

### 9. React Bits — David Haz

- **官方与许可**：[仓库](https://github.com/DavidHDev/react-bits)、[演示站](https://reactbits.dev)、[MIT + Commons Clause 原文](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md)。实际许可附加条件限制将组件自身单独、成包或移植后再次分发；不能作为普通 MIT 组件合集塞进可分发插件。**仅索引参考。**
- **Codex 适配**：其 JS/TS、CSS/Tailwind 变体便于理解目标项目的实现方式；本插件不收录组件源码或移植版本。
- **值得借鉴的决策**：观察某一种效果如何与输入和参数关联，再判断它是否表达产品特征；适合研究少量视觉重点，而非整页照搬目录。
- **易误用**：极光、粒子、磁吸、模糊文字同时堆满页面，产生新的统一模板；忽略移动端 GPU、键盘焦点与触摸替代。能在网站中使用，不等于可再次分发组件库。

### 10. Codrops

- **官方与许可**：[许可总页](https://tympanus.net/codrops/licensing/)、[OnScrollTypographyAnimations 示例](https://github.com/codrops/OnScrollTypographyAnimations)、[该示例 MIT 原文](https://raw.githubusercontent.com/codrops/OnScrollTypographyAnimations/main/LICENSE)、[依赖清单](https://raw.githubusercontent.com/codrops/OnScrollTypographyAnimations/main/package.json)。下载演示通常 MIT，除非另有说明；设计 freebies 不允许再分发，文章和素材另受限制。
- **Codex 适配**：适合拆解实验，再转换成项目需要的生命周期和组件；并非现成生产规范。所核查示例含 GSAP、Lenis、Splitting 依赖，README 另列图片来源，因此初版插件只索引该完整演示。
- **值得借鉴的决策**：研究字形、遮挡、节奏与滚动位置如何建立阅读次序；抽象为原创编排，不复制成套视觉资产。
- **易误用**：把展示实验直接用于结算、管理后台或长文阅读；把仓库 MIT 当成图片、字体及所有依赖的总授权。旧演示能运行也不代表其依赖仍适合作为新项目默认值。

### 11. Vaul — Emil Kowalski

- **官方与许可**：[仓库及维护声明](https://github.com/emilkowalski/vaul)、[MIT 原文](https://raw.githubusercontent.com/emilkowalski/vaul/main/LICENSE.md)、[作者的抽屉交互文章](https://emilkowal.ski/ui/building-a-drawer-component)。仓库代码 MIT；文章本身没有据此获得 MIT 授权，只作阅读索引。当前 README 明确说明未维护。
- **Codex 适配**：React 技术适配容易，但维护状态不适合默认引入新项目。可研究其设计问题，再选择维护中的基础组件原创实现。
- **值得借鉴的决策**：区分内容滚动与拖拽关闭；考虑速度、阻尼、虚拟键盘、焦点和真正的移动设备表现。性能判断要看影响范围，不只看是否使用 transform。
- **易误用**：只有拖拽没有关闭按钮；滚到顶部便误关闭；键盘挡住提交；照搬移动系统的背景缩放而无业务需要。许可允许使用与依赖值得采用是两回事。

### 12. Radix Primitives — WorkOS

- **官方与许可**：[仓库](https://github.com/radix-ui/primitives)、[MIT 原文](https://raw.githubusercontent.com/radix-ui/primitives/main/LICENSE)、[动画指南](https://www.radix-ui.com/primitives/docs/guides/animation)。可依 MIT 使用并保留通知。
- **Codex 适配**：React 项目适配度高；先读取项目已有组件，避免并存两套 Dialog / Menu 行为。
- **值得借鉴的决策**：把焦点、键盘、开关状态等基础行为与品牌视觉分开；通过状态属性做 CSS 动画，必要时使用受控挂载完成退出过程。
- **易误用**：认为无样式组件自动产生有品位的界面；复制统一皮肤后宣称摆脱模板。关闭中的内容仍可聚焦、焦点丢失，不能被“退出动画很顺”掩盖。

### 13. Floating UI

- **官方与许可**：[仓库](https://github.com/floating-ui/floating-ui)、[MIT 原文](https://raw.githubusercontent.com/floating-ui/floating-ui/master/LICENSE)、[React 文档](https://floating-ui.com/docs/react)、[交互组合](https://floating-ui.com/docs/useinteractions)。核心代码可依 MIT 使用；文档图标等其他资产不作同一许可推定。
- **Codex 适配**：适合自定义锚定浮层，可按框架选包；定位库不等于一套完整可访问菜单。
- **值得借鉴的决策**：把定位、碰撞、打开方式、关闭方式、角色和焦点管理分别处理；跟随挂载建立和清理位置更新。
- **易误用**：仅靠 hover 暴露关键操作；浮层翻转时来回跳动；合并事件时覆盖已有处理；隐藏后仍持续测量。简单场景先评估原生 Popover / CSS，避免为一个提示引入整套复杂机制。

### 14. React Aria — Adobe

- **官方与许可**：[仓库](https://github.com/adobe/react-spectrum)、[Apache-2.0 原文](https://raw.githubusercontent.com/adobe/react-spectrum/main/LICENSE)、[交互质量说明](https://react-aria.adobe.com/quality)、[Button 状态](https://react-aria.adobe.com/Button)、[官方 AI / Codex 接入](https://react-aria.adobe.com/ai)。核心代码按 Apache-2.0 处理；具体打包文件的 NOTICE、字体和素材另查。
- **Codex 适配**：官方 AI 文档明确列出 Codex、Agent Skills 与 MCP 接入。本次仅核查文档；不安装 MCP，也不把核心仓库许可直接套到未经核查的服务包装代码。
- **值得借鉴的决策**：统一鼠标、触控和键盘的 press 语义；正确处理 focus-visible、触摸悬停、待处理状态及国际化。等待中的按钮仍可保留焦点并提供状态反馈。
- **易误用**：以为组件基础可访问就免除标签、对比度和流程检查；需要无样式行为却引入完整 Spectrum 视觉；照搬 Adobe 演示配色覆盖客户品牌。

## 三、可由我们原创实现的 8 种交互模式

以下是根据业务问题原创整理的模式，不是上述项目组件的复刻清单。优先用语义 HTML、CSS 与项目已有库实现；减少动态效果不取消必要的状态反馈和用户直接控制。

| 模式与适用业务 | 触发与状态 | 无脚本或能力不足时 | reduced-motion 方案 |
| --- | --- | --- | --- |
| **1. 真实前后对照**：图像编辑、清晰度处理、实物工艺 | 用户拖动范围控件或按左右键；显示当前分界和明确的前后标签，两个来源均可单独查看；加载失败分别提示 | 并排或上下显示两张图与文字说明，原图链接始终可用 | 保留直接拖动映射，取消自动扫动、弹簧与炫示入场；不自动偏向“后图” |
| **2. 选项驱动产品预览**：颜色、型号、外观配置 | 语义单选触发 idle → loading → ready / error；请求有序，取消或忽略过期结果；新素材就绪前保留上一张 | 原生表单提交或静态列出各配置，价格与库存不依赖动画呈现 | 直接替换已就绪图像，不飞入、不缩放；必要时用短淡变，并允许完全关闭 |
| **3. 逐层展开说明**：参数、费用构成、技术解释 | 点击或键盘切换 collapsed / open；保持焦点与输入内容；重要价格和限制默认可见 | 使用原生 details / summary 或跳到完整说明页 | 立即展开，不插入等待时间；布局变化后不强制平滑滚动 |
| **4. 提交与保存反馈**：设置、表单、上传 | idle → submitting → success / error；防止重复提交，失败保留输入并可重试；只显示真实可知的进度 | 原生表单与服务端结果页；保留返回和重试路径 | 用状态文字及静态图标，取消旋转、跳动和庆祝效果；成功不靠运动或颜色单独表达 |
| **5. 可撤销排序**：播放列表、内容优先级、配置顺序 | 拖拽手柄或“上移 / 下移”按钮；idle → moving → committed / cancelled；保持焦点，播报位置，提供撤销 | 按钮操作或服务器表单提交新顺序，不要求拖拽能力 | 直接拖动仍跟手，邻项即时换位；取消惯性、过冲和自动追赶动画 |
| **6. 上下文编辑面板**：素材库、日程、记录详情 | 选择对象打开面板；view / editing / dirty / saving / error；Esc 与显式关闭可用，关闭后归还焦点，处理未保存内容 | 跳转完整详情页，或在当前列表后呈现编辑区；窄屏和虚拟键盘下仍可提交 | 立即开关，取消背景缩放、弹簧和飞行动画；焦点与可操作范围按状态同步 |
| **7. 可核对的流程进度**：导入、裁切、传输、任务处理 | 用户启动后展示实际阶段及成功 / 失败 / 重试；每一步对应真实事件；未知百分比用不确定状态，演示明确标注 | 按顺序显示文字步骤、当前状态和操作入口；自动更新不可用时允许手动查询 | 阶段标签直接更新，停止流光和移动圆点；完成步骤保持可读，不自动折叠关键信息 |
| **8. 阅读位置与图示关联**：产品原理、工程文档、长篇说明 | 原生滚动或锚点导航改变当前章节；相关图示强调当前说明，但所有内容都能独立阅读 | 目录锚点和文内图正常排列，无遮挡、不锁滚动；无观察器也不影响阅读 | 取消视差、逐字入场和滚动驱动位移；锚点即时到位，保留静态章节标记 |

实施约束：比较图保持相同裁切、尺寸和展示条件；如果内容、角色设定或功能也改变，单独标注，不能全部计作“去 AI 感”的效果。以首图为参考的后续编辑应称为编辑前后对照，不能称为两次独立文生图实验。产品流程只展示已具备的能力，例如尚未实现的动画宠物不能伪装成真实完成步骤。

## 四、插件应采用的反模板规则

1. **已有品牌与用户方向优先。** 渐变、紫色、圆角卡片、居中首屏、常见字体都不是错误证据。先记录现有品牌、用户明确偏好与必须保留项；需要偏离时说明具体业务原因，不能凭反模式词表自动换风格。
2. **先找真实内容，再决定版式。** 以产品、使用过程、约束和可验证证据建立页面。没有客户、销售数据或奖项时，不为填满模板生成数字、徽章和证言；没有素材时说明素材需求。
3. **按当前页面任务选择密度与表现。** 操作频繁的界面可以标准、紧凑、可预测；阅读页可以安静；品牌宣传可以突出个性。不能把“独特”解释为所有界面都必须不对称、超大标题或复杂动效。
4. **限制同时争夺注意力的元素。** 选择能解释对象的少量重点；不要把所有收集到的效果一次用完。用户已有的强表现品牌可作为例外，但仍检查内容可读、输入可用和实际性能。
5. **每个动画写明触发、业务状态与退出条件。** 说不清动画帮助用户理解什么时，优先删减。禁止以虚假进度、强制等待、滚动接管替代内容；客户明确要求的叙事体验需保留自由退出和静态信息路径。
6. **完整状态比装饰数量更重要。** 检查键盘、触摸、错误、空态、等待、被打断和恢复；后台或复杂工具遵守熟悉的操作惯例，不为“去模板”改变已被用户理解的控件含义。
7. **去掉无依据的细节，不把全站磨平。** 可保留品牌纹理、插画笔触、结构性线条和有意义的层级；不能将“减少 AI 感”一律翻译成纯色、粗描边、低饱和度或极简页面。
8. **审查结论必须指向可见证据。** 用“多处无业务作用的入场遮住内容”“所有标题节奏相同”等观察，替代“看起来像 AI 所以删掉”。前后比较保留未改善和退步项，不声称检测器得分或作者身份得到证明。

## 五、封装建议与待验证项

- 初版以原创诊断和决策流程为核心；外部来源作为分层参考。不要同时加载四套上游技能的全部默认规则，以免出现品牌锁定与自动重设计、减少动效与默认加动效之间的冲突。
- 对实际纳入的文件记录仓库 URL、固定提交或版本、原路径、许可文件、版权、修改情况和第三方依赖；提供相应 LICENSE / NOTICE / THIRD_PARTY_NOTICES。仅链接阅读与复制代码分别登记。
- 自定义许可来源仅收录官方链接和原创点评；不附复制组件、截图素材包或自动下载器。MIT 技能中的第三方代码示例和链接依赖也逐项处理。
- 动画默认使用项目已有方案；普通状态转换可用 CSS，必要的时间控制可用 Web Animations API。引入新库应有明确的能力缺口，避免多个引擎争用同一属性。
- 本次未验证上游安装器、MCP 服务、运行时兼容性、浏览器性能或移动实机表现。进入实现阶段后，按项目实际版本验证键盘焦点、触控与虚拟键盘、reduced-motion、无脚本内容可见性和中断恢复；不能用研究文档代替这些检查。
