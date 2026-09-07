# Contributing

感谢你帮助改进 DeAI Studio。请把讨论和改动集中在可复现的问题上：具体输入、期望产物、实际结果，以及是否涉及某个宿主工具或文件格式。

## 修改原则

- 保留事实、品牌约束和用户明确选择；不要把“去 AI 味”写成规避检测或冒充真人创作。
- 技能入口保持简洁。媒介专用规则放在 `skills/deai/references/`，研究来源放在 `docs/research/`。
- 外部材料只链接或按其许可使用，不把第三方模板、字体、截图和作品直接打包进插件。
- 新增本地引用时，确保目标文件会进入发布包，并使用相对路径。

## 本地检查

需要 Python 3.10 或更高版本，不依赖第三方 Python 包。

```sh
python scripts/build_release.py --validate-only
python -m unittest discover -s tests
python scripts/build_release.py --out dist
```

提交前请确认没有 `.env`、令牌、客户资料、历史对话、绝对用户路径或未授权素材。
