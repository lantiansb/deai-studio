# 交互手记 / Interaction Lab

六种可直接操作的原创离线交互模式。用现代 Edge 或 Chrome 打开同目录的 `index.html`，无需服务器、CDN、账户或运行时依赖。示例内的项目、列表和结果都是演示数据；不会发出网络请求、保存文件或永久修改数据。

## 设计与实现约束

采用一页编辑手记的形式，用文字层次、分隔线、宽窄关系与少量蓝色反馈组织六段实验。这个视觉方向只属于本样例，不应变成所有客户项目的统一样式。已有品牌、实际内容和用户明确方向优先，常见字体、卡片或渐变不构成需要删除的证据。

实现分为四个可独立理解的文件：

- `index.html`：全部内容、原生交互语义、内联原创 SVG。没有脚本时仍能阅读三个项目预览、三个视图、清单与文章。
- `styles.css`：系统字体、布局、原创 CSS 几何图案、状态与媒体条件。没有外部素材。
- `lab.js`：六段独立增强。选项和业务状态立即生效；动效不决定操作是否完成。
- `verify.mjs`：使用已有本地 Playwright 的 Edge 行为验证，不是页面运行依赖。

制作顺序：先定义可检验的行为；建立无脚本内容；分别加入状态与焦点管理；再用 Edge 验证桌面、触屏、减少动态效果和无脚本模式。所有常规实现均属于已明确授权的离线样例范围。

## 六个模式

| 模式 | 实际行为 | 键盘 / 触屏 | 退化与减少动态效果 |
| --- | --- | --- | --- |
| 项目索引预览 | 经过、聚焦或点击同步预览，选中态用 `aria-pressed` 表达；不自动轮播 | Tab 聚焦；触屏点选 | 无 JS 显示全部预览与说明；减少动态效果后取消箭头过渡 |
| 分段切换 | 连续指示条随选项移动，关联内容立即替换 | Tab 进入；方向键循环，Home / End，空格；触屏点选 | 无 JS 为内容锚点，全部内容可读；减少动态效果后指示条立即到位 |
| 就地展开 | 原生 `details` / `summary`，主要结论始终可读 | Enter / 空格；点按 | 不依赖 JS；减少动态效果后取消加号旋转过渡 |
| 提交反馈 | 本地 900ms 模拟，idle → pending → success / error；防重复操作，保留按钮焦点 | 原生按钮与单选框；鼠标、键盘、触屏通用 | 无 JS 禁用运行按钮并保留说明；减少动态效果后用静态符号和文字反馈 |
| 隐藏与撤销 | 隐藏当前项，逐次反序撤销；无倒计时、无永久删除，刷新恢复 | 隐藏后聚焦邻项；清空后聚焦撤销；恢复后聚焦恢复项 | 无 JS 显示完整清单；操作本身不依赖动画 |
| 阅读区进度 | 只计算内部滚动区；章节点击移动到标题并转移焦点 | 聚焦滚动区使用原生滚动键；点击章节 | 无 JS 保留文章、滚动区和原生锚点；减少动态效果后章节即时定位 |

注意：模拟等待只用来展示状态，不是可复制到真实产品的强制延时。真实请求应由实际完成、错误或取消事件驱动。进度文本不是逐次播报的 live region，避免持续打断读屏；提交与撤销结果才使用温和的状态播报。

这些函数面向一次加载的静态页面。移植至 React、路由切换或重复挂载环境时，需要把事件监听、ResizeObserver、requestAnimationFrame 与定时器的清理放入组件生命周期；不能直接反复调用初始化函数。

## 可选的真实实现来源

以下链接是应用选择与进一步阅读，**本样例没有复制其组件、动画代码、图片或字体，也没有引入这些依赖**。按具体项目的框架、版本、许可和需求选择，已有方案优先。

- [Motion](https://motion.dev/docs/react-layout-animations)：React 的布局与共享元素过渡；核心库 [MIT](https://raw.githubusercontent.com/motiondivision/motion/main/LICENSE.md)。Motion+ 付费内容另核查。
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/guides/animation)：行为与视觉分离的 React 基础组件；[MIT](https://raw.githubusercontent.com/radix-ui/primitives/main/LICENSE)。仍需完成项目自己的标签、焦点与视觉检查。
- [React Aria](https://react-aria.adobe.com/quality)：鼠标、键盘、触摸与待处理状态；核心代码 [Apache-2.0](https://raw.githubusercontent.com/adobe/react-spectrum/main/LICENSE)。[官方 AI 文档](https://react-aria.adobe.com/ai)列出 Codex 接入，但此样例没有安装。
- [Floating UI](https://floating-ui.com/docs/react)：锚定定位、交互和焦点管理；[MIT](https://raw.githubusercontent.com/floating-ui/floating-ui/master/LICENSE)。需要完整浮层行为时再引入。
- [Anime.js](https://animejs.com/documentation/scope)：局部 DOM / SVG 时序、媒体条件和清理；[MIT](https://raw.githubusercontent.com/juliangarnier/anime/master/LICENSE.md)。
- [React Spring](https://www.react-spring.dev/docs/utilities/use-reduced-motion)：可中断的物理运动；[MIT](https://raw.githubusercontent.com/pmndrs/react-spring/next/LICENSE)。不必给所有界面添加弹性。
- [GSAP](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)：复杂时序的参考；使用[自定义许可](https://gsap.com/community/standard-license/)，插件仅索引，不附带运行库。
- [React Bits](https://reactbits.dev)：效果选型参考；[MIT + Commons Clause](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md)含组件再分发限制，插件仅索引，不收录组件。
- [Codrops](https://tympanus.net/codrops/licensing/)：阅读实验和演示；代码、图片、字体和依赖必须分别核查，不把整站视为统一开源素材包。

以上来源与许可于 2026-09-05 核查。作者或维护组织真实存在，不等于可以推断其完全没用过 AI；本页也不提供“人类原创来源鉴定”或 AI 检测分数。

## 本地验证

页面使用完全离线的相对文件路径。测试本身需要机器上已经存在 Node、Playwright 和 Microsoft Edge，不自动安装任何软件。

```powershell
$env:PLAYWRIGHT_MODULE = '你的本地 Playwright 包目录'
node ./verify.mjs
```

省略变量时，验证脚本通过 Node 的标准模块解析查找本机已有的 `playwright` 包。若包位于其他目录，使用环境变量指定该目录；不自动安装软件，也不依赖开发者机器的绝对路径。Playwright 不是离线页面的运行时要求。

验证会启动独立的无头 Edge，不接管用户浏览器会话。结果写到本目录 `test-results/results.json`，桌面与移动布局截图写到同目录。覆盖 file://、焦点与键盘、成功 / 失败 / 重试、连续隐藏与撤销、内部阅读进度、390px 触屏、reduced-motion、禁用 JavaScript，以及运行时错误和外发网络请求。

自动化不等于读屏或真实手机实测。复用到产品前，仍需结合实际文案、字号缩放、系统辅助技术和设备完成验证。

## 原创与许可

本目录 HTML、CSS、JavaScript、验证脚本和几何图案均为本插件原创实现，随 deai-studio 根目录 MIT 许可分发。README 中的外部链接只作索引；未将第三方许可套用于自己的作品，也未把第三方代码的许可转成插件的许可。
