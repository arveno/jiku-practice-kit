# 极库刷题

极库刷题是一个本地优先的刷题练习项目。当前版本提供免费静态题库，适合用来浏览题目、按范围练习、保存练习进度，并根据答题记录复盘弱项。

在线预览：https://arveno.github.io/jiku-practice-kit/

## 当前能力

- 浏览免费题库，并按关键词、分类、专题、标签、难度和频率筛选。
- 查看题目详情，答案默认隐藏，需要时再展开对照。
- 按随机题、分类、专题、标签、高频题、弱项题、未练习题或低分题开始练习。
- 每题练完后用“掌握、部分掌握、不清楚、不会”做自评，并写入本地数据库。
- 练习轮次可恢复，刷新页面后可以继续当前进度。
- 在复盘页查看复习队列、弱项题、低分题和最近练习记录。
- 在数据页查看本地数据库状态、当前轮次、总作答数和异常文件数。

## 数据说明

- 题库内容只包含免费公开样例题。
- 练习记录保存在固定本地目录 `~/.jiku-practice-kit/database`，不需要账号。
- 仓库不提交私有题库、本地 scorecard、付费答案或生成物。
- 当前阶段不包含后端、登录、支付、VIP 权限、在线题库后台或 AI 自动评分。

## 本地运行

```bash
pnpm install
pnpm dev
```

`pnpm dev` 会同时启动 Web 页面和本地 Node API：

- Web 页面：http://localhost:5173
- 本地 API：http://127.0.0.1:8787

完整检查：

```bash
pnpm run ci
```

## 目录说明

```text
apps/web              Web 应用
apps/local-api        本地 Node API，负责读写固定本地数据库目录
packages/contracts   题目和练习记录的数据合同
packages/content     免费公开题库内容
packages/domain      刷题和统计相关的纯逻辑
docs                 产品、架构、代码合同和内容安全文档
```

## 相关文档

- `DESIGN.md`：界面视觉规范。
- `docs/product.md`：产品事实源。
- `docs/code-contract.md`：代码边界和数据合同规则。
- `docs/content-safety.md`：公开内容和本地数据安全规则。
