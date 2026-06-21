# 代码合同

本仓库围绕共享合同层构建，目的是防止前端、后端和未来小程序各自维护一套模型。

## 单一事实源

- Question schema：`packages/contracts/src/question.ts`
- Scorecard schema：`packages/contracts/src/scorecard.ts`
- 免费公开题库：`packages/content/src/public/questions.ts`
- 浏览器存储边界：`apps/web/src/storage`

Question 和 Scorecard 字段以 `packages/contracts/src/*.ts` 为唯一事实源，文档不重复列字段。

任何 app（当前 `apps/web`，未来 `apps/api`、`apps/miniapp`）都不能重新定义
`Question`、`Scorecard`、`questionSchema` 或 `scorecardSchema`.

## 架构标准

本仓库采用 `Contract-first + Domain Core + Feature-first Web`。

固定数据链路：

```text
DTO / Raw Data
  -> Mapper
  -> Domain Model
  -> ViewModel Mapper
  -> UI Model
  -> Naive UI
```

`QuestionDto` 只允许出现在 DTO、API 或 mapper 边界。页面组件和 UI 组件不能直接消费
DTO；进入 UI 前必须先转换成 Domain Model，再映射成 UI Model / ViewModel。

## 模块边界

`packages/contracts` 只能放 schema、共享类型和纯解析 helper。

`packages/content` 可以从 `@jiku/contracts` 导入，但不能定义 schema。它负责题库数据
和内容加载。

`apps/web` 可以从 `@jiku/contracts` 和 `@jiku/content` 导入。页面文件只负责组合 UI
和数据，不负责 storage、schema 或内容规则。

未来 `apps/api` 和 `apps/miniapp` 也只能引用 `@jiku/contracts`，不能维护自己的核心
DTO、schema 或字段副本。

`packages/domain` 只放业务纯函数。它不能依赖 Vue、Naive UI、router 或
`localStorage`。

`apps/web/src/features` 按业务垂直切片组织前端功能。`apps/web/src/shared/ui` 放基于
Naive UI 的全局共享组件。不要把主结构横向堆成 `components/`、`stores/`、
`mappers/`、`models/`。

`shared/ui` 不知道 `Question`、`Scorecard` 等业务类型；业务展示字段必须先由 feature
mapper 转成 ViewModel。

## 抽象规则

- 第一次出现：直接写。
- 第二次出现：允许重复，先观察差异。
- 第三次真实复用且接口稳定：再抽明确命名的抽象。
- 避免 `common/` 和 `utils.ts` 变成垃圾桶。
- 优先使用明确领域命名，例如 `QuestionCard`，不要用泛泛的名字。

## CI 强制规则

`scripts/guardArchitecture.ts` 检查：

- private/local 内容不能进入 git 可见文件
- Phase 1 内容必须是 free-only
- `localStorage` 只能出现在 `apps/web/src/storage`
- app/content 代码不能重新定义 `Question`、`Scorecard`
- app/content 代码不能定义第二套 question/scorecard schema
- `QuestionDto` 不能进入页面和 UI 组件
- category/topic/tag 不能在 app 源码里硬编码数组
- `packages/domain` 不能依赖 UI、router 或浏览器存储
- `apps/web/src` 不能新增横向主结构 `components/`、`stores/`、`mappers/`、`models/`
- 不能新增 `common/` 或 `utils.ts` 垃圾桶

## 风格

Prettier、ESLint、TypeScript strict mode、Vitest 和 GitHub Actions 是基础门禁。
本地能跑但 CI 不过，不算完成。
