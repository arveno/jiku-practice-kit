# 架构

极库刷题第一阶段是静态免费题库，但仓库结构从一开始就为未来前后端一致性服务。

```text
apps/web
packages/contracts
packages/content
scripts
docs
```

## 数据流

`packages/contracts` 定义 Zod schema 和 TypeScript 类型。

`packages/content` 导入这些合同，导出解析后的免费题库。如果内容结构漂移，会快速失败。

`apps/web` 导入解析后的内容并渲染静态前端。

未来后端代码也应该导入同一个 `@jiku/contracts` 包，不能重新创建一套 DTO。

## 当前范围

Phase 1 不做后端、登录、支付、VIP 授权、管理后台和私有商业题库内容。
