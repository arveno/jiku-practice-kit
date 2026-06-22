# 产品事实源

## 产品名

极库刷题（Jiku Practice Kit）。

## 当前阶段

Phase 2：本地优先的个人刷题工具。当前目标是在 Phase 1 免费静态题库基础上，把个人学习数据迁向固定本地数据库目录和本地 Node API。

## 用户

- 练习用户：需要免费公开题目进行前端、游戏开发和 AI Agent 基础复习的人。
- 维护者：按 Issue 和 PR 增量实现功能、维护题库合同和内容安全的人。

## 当前做什么

- 使用 `packages/contracts` 作为 Question、Scorecard 和本地数据库合同的唯一事实源。
- 使用 `packages/content` 提供 free-only 公开题库。
- 使用 `apps/web` 渲染静态刷题体验。
- Phase 1 遗留 scorecard 只在 `apps/web/src/features/scorecard/storage.ts` 访问浏览器存储。
- Phase 2 新增个人学习数据目标目录为 `~/.jiku-practice-kit/database/`，由本地 Node API 读写。
- 用 `pnpm run ci` 作为提交和 PR 前的本地门禁。

## 当前不做什么

- 不做远程后端。
- 不做登录。
- 不做支付。
- 不做会员。
- 不做 VIP 内容。
- 不做云同步。
- 不提交私有题库、本地 scorecard、本地学习数据库或 `.local/` 内容。

## 后续 Issue 规则

每个 Issue 必须引用本文件和相关事实源，说明本次变更是否仍处于 free-only 内容范围。
