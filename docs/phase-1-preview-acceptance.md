# Phase 1 预览验收

日期：2026-06-22

Issue：#15

Pages URL：https://arveno.github.io/jiku-practice-kit/

验收 commit：`4f03224cf9f1fcac0fae608d94787f52e2385547`

## GitHub Pages

- GitHub Pages 已启用，`build_type` 为 `workflow`。
- Pages 源为 `main`，公开 URL 为 `https://arveno.github.io/jiku-practice-kit/`。
- `Deploy Pages` workflow 在 commit `4f03224` 上通过，run `27927268469`。
- `CI` workflow 在 commit `4f03224` 上通过，run `27927242078`。
- `curl -I -L https://arveno.github.io/jiku-practice-kit/` 返回 HTTP 200。

## 本地门禁

- `pnpm run ci` 通过。
- `git status --short --untracked-files=all` 无输出。
- `git ls-files` 未发现 `.local/`、`private/`、本地 scorecard 或生成物路径。
- `apps/web/dist` 未发现 private/local 路径、`scorecard.json`、付费/VIP 答案字段。

## 手动验收

- 首页可访问，导航包含题库、练习、复盘、导入导出。
- 题库列表可访问，`category=Vue` 筛选只显示 Vue 题，并保留题目详情链接。
- 题目详情可访问，答案默认隐藏，显示/隐藏按钮正常。
- 在题目详情页刷新后，hash 路由保持可用。
- 练习页可开始练习，自评保存后显示保存反馈。
- 复盘页在练习后更新已练题数、平均分、弱项题和低分题统计。
- 弱项、低分、最近练习记录均提供题目详情 hash 链接。
- 复盘页显示分类平均分和专题平均分。
- 导入导出页提供带日期的 JSON 下载链接。
- 非法 JSON 导入显示错误，页面统计保持不变。
- 390px 视口下无横向溢出。
- 浏览器控制台未出现 error。

## 排除项

- VIP 示例、后端、账号同步、小程序和商业化能力不属于 Phase 1。
