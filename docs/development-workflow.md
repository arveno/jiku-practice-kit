# 开发流程

本项目默认执行“先议题、再实现、先本地审核、再提交”的流程。

## 标准顺序

```text
1. 创建 GitHub Issue
2. 明确需求、边界和验收标准
3. 本地实现
4. 本地运行 pnpm run ci
5. 本地代码审核
6. 修复审核问题
7. 再次运行 pnpm run ci
8. 经确认后 commit
9. push 分支并创建 PR
10. GitHub CI + PR 审核
11. 审核通过后 merge
```

## 提交前规则

- 未经过本地审核的代码不提交。
- 未通过 `pnpm run ci` 的代码不提交。
- 每个功能都必须关联一个 Issue。
- PR 描述必须写明关联 Issue、变更范围、验证命令和已知限制。

## 审核重点

- 是否复用 `@jiku/contracts`
- 是否出现重复模型或多轨实现
- 是否绕过 Phase 1 遗留 scorecard storage 或 Phase 2 本地 API 边界
- 是否引入不必要抽象
- 是否违反 free-only 内容规则
- 是否把本地学习数据库记录放进 git 可见文件
