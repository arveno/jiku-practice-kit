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

## 当前范围

Phase 1 不做后端、登录、支付、VIP 授权、管理后台和私有商业题库内容。
