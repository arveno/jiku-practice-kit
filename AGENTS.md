# 极库刷题 Agent 规则

本仓库采用 contract-first。写功能时先复用共享合同、内容包和现有应用结构，
再考虑新增抽象。

## 必读文件

1. `DESIGN.md` 定义 Vercel-inspired 的 UI 视觉语言。
2. `docs/code-contract.md` 定义仓库边界和代码规则。
3. `docs/content-safety.md` 定义哪些内容可以提交。

## Ponytail

如果当前 Codex 环境可安装插件，应按官方方式安装 Ponytail：

```bash
codex plugin marketplace add DietrichGebert/ponytail
```

然后在 `/plugins` 里安装，在 `/hooks` 里审核并信任 hooks，重启 Codex
desktop。写代码或审查代码时使用 `@ponytail` 或 `@ponytail-review`。

如果插件不可用，仍按同一套工程规则执行：

1. 不做当前阶段不需要的功能。
2. 优先使用平台能力和已有依赖。
3. 不为小问题新增依赖。
4. 不在第三次真实复用且接口稳定前抽象。
5. 非平凡逻辑必须有可运行测试或门禁脚本。

## 边界

- `packages/contracts` 是共享 schema 和核心类型的唯一来源。
- `packages/content` 负责免费题库内容和内容加载。
- `apps/web` 只能消费 contracts 和 content，不能重新定义核心模型。
- 浏览器存储访问只能放在 `apps/web/src/storage`。
- Phase 1 只允许 free 内容。
