# 内容安全

Phase 1 只做 free 内容。公开仓库可以包含：

- 代码
- schema
- 免费公开样例题
- 文档
- CI 门禁

公开仓库不能包含：

- 私有题库
- 付费/VIP 答案
- 本地 scorecard
- `scorecard.json`、`*.scorecard.json`、`scorecards/` 下的本地练习记录
- `.local/` 文件
- `packages/content/src/private/` 下的文件
- 任何 `paidAnswer`、`vipAnswer`、`premiumAnswer` 或 `accessLevel: "paid"` 形态的内容字段

本地忽略路径：

```text
.local/
private/
packages/content/src/private/
scorecard.json
scorecards/
*.scorecard.json
*.scorecard.md
*.local.json
*.local.md
```

如果 private/local 文件进入 git 可见范围，CI 会失败。

CI 门禁覆盖：

- git 可见文件里的 private/local 路径和本地 scorecard 数据文件
- Phase 1 非 free 题目
- 付费/VIP 答案字段
- Web 构建产物里的 private/local 路径、scorecard 数据引用和付费答案字段
