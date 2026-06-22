# 架构

极库刷题第一阶段是静态免费题库，但仓库结构从一开始就为未来前后端和小程序一致性服务。

```text
apps/web
apps/api        # 未来后端应用，只能复用 @jiku/contracts
apps/miniapp    # 未来小程序应用，只能复用 @jiku/contracts
packages/contracts
packages/content
packages/domain # 未来业务纯函数，不依赖 UI/router/storage
scripts
docs
```

## 数据流

`packages/contracts` 定义 Zod schema 和 TypeScript 类型。

`packages/content` 导入这些合同，导出解析后的免费题库。如果内容结构漂移，会快速失败。

`apps/web` 导入解析后的内容并渲染静态前端。

未来后端和小程序代码也应该导入同一个 `@jiku/contracts` 包，不能重新创建一套核心模型。

Phase 2 新增本地学习数据库合同，仍由 `packages/contracts` 定义。固定本地目录为
`~/.jiku-practice-kit/`：

```text
~/.jiku-practice-kit/
  database/   # 未来可落库的核心学习数据
  derived/    # 可重建索引
  backups/    # 写入前备份
  corrupted/  # 损坏文件隔离
```

内置题库仍随 `packages/content` 发布；本地学习数据只保存 `questionId` 和用户练习状
态，不复制题目正文或答案。

边界链路固定为：

```text
DTO / Raw Data
  -> Mapper
  -> Domain Model
  -> ViewModel Mapper
  -> UI Model
  -> Naive UI
```

DTO 只能停留在 API、DTO 和 mapper 边界，不能直接进入页面或 UI 组件。

## Web 结构

`apps/web/src/features` 是业务垂直切片入口。`apps/web/src/shared/ui` 是基于 Naive UI
的全局共享组件入口。不要新增 `components/`、`stores/`、`mappers/`、`models/` 作为主
结构。

Phase 1 Web 目录标准：

```text
apps/web/src/
  app/
  shared/
    ui/
    layout/
    format/
  features/
    questions/
    practice/
    scorecard/
    review/
    import-export/
```

每个 feature 默认结构：

```text
features/<feature>/
  pages/
  models/
  mappers/
  routes.ts
  store.ts      # 仅需要时
  components/  # 仅例外时
```

feature 内部 `components/` 是例外，不是默认。只有页面太长、某块只属于当前业务、
拆出来更易读时才允许。`Button`、`Card`、`Tag`、`StatCard` 这类通用组件必须放
`shared/ui`。

## UI 标准

- UI 框架固定为 Naive UI。
- 使用 `NConfigProvider`、`NMessageProvider`、`NDialogProvider` 建立 app providers。
- Naive UI 主题入口统一放在 `apps/web/src/app/naiveTheme.ts` 或等价 app 入口。
- 根目录 `DESIGN.md` 是 Vercel-inspired 视觉事实源。
- `shared/ui` 是全局设计系统，不知道 `Question`、`Scorecard` 等业务类型。
- 页面默认用 `shared/ui` 和 feature ViewModel 组装。
- 普通 `NInput`、`NSelect`、`NButton` 可以直接使用，除非需要统一语义。
- 不引入 Tailwind、Element Plus、Ant Design Vue 等第二套 UI 或样式框架。

## Mapper 和 ViewModel

固定链路仍然是：

```text
DTO / Raw Data
  -> Mapper
  -> Domain Model
  -> ViewModel Mapper
  -> UI Model
  -> Naive UI
```

- DTO 不允许直接进入 UI。
- Domain Model 来自 `packages/contracts`。
- 业务纯函数放 `packages/domain`。
- Feature mapper 负责 `Domain -> ViewModel`。
- ViewModel 可以包含展示文案、tag 类型、按钮禁用状态等 UI 所需字段。
- 页面不直接格式化 score、status、category 文案。
- 当前阶段不写假的后端 DTO，也不为未来后端提前生成 API client。

## 当前范围

Phase 2 只做本地运行能力，不做远程后端、登录、支付、VIP 授权、管理后台、云同步和
私有商业题库内容。
