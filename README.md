# 极库刷题

合同优先的免费静态题库项目。技术栈是 Vue 3、TypeScript、Vite、pnpm、Zod、
Vitest、ESLint、Prettier 和 GitHub Actions。

## 当前阶段

Phase 1 只做前端静态题库，并且只做 free 题库：

- 不做后端
- 不做登录
- 不做支付
- 不做 VIP 内容
- 不把私有题库文件提交到 git

## 命令

```bash
pnpm install
pnpm dev
pnpm run ci
```

常用检查：

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm validate:contracts
pnpm validate:questions
pnpm guard:architecture
pnpm build
```

## 仓库结构

```text
apps/web              Vue 3 静态前端
packages/contracts   共享 Zod schema 和 TypeScript 类型
packages/content     免费公开题库内容
scripts              CI 门禁和校验脚本
docs                 架构、代码合同和内容安全文档
```

## 设计

根目录的 `DESIGN.md` 按 awesome-design-md 的官方方式放置：把设计文件放在项目
根目录，方便 coding agent 在做 UI 前读取。

来源：`VoltAgent/awesome-design-md` 的 Vercel-inspired `DESIGN.md`。

## 代码合同

核心数据合同位于 `@jiku/contracts`。前端和未来后端都必须从这个包导入共享 schema
和类型，不能各自复制一份模型。

See `docs/code-contract.md`.

## 内容安全

仓库只提交免费公开样例题。local scorecard 和私有题库内容会被 git 忽略。

See `docs/content-safety.md`.
