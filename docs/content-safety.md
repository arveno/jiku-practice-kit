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
- `.local/` 文件
- `packages/content/src/private/` 下的文件

本地忽略路径：

```text
.local/
private/
packages/content/src/private/
*.local.json
*.local.md
```

如果 private/local 文件进入 git 可见范围，CI 会失败。
