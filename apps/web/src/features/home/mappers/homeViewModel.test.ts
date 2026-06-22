import { describe, expect, test } from "vitest";
import { mapHomeViewModel } from "./homeViewModel";

describe("mapHomeViewModel", () => {
  test("maps public and personal stats into home display data", () => {
    expect(
      mapHomeViewModel({
        questionStats: {
          totalCount: 6,
          categoryCount: 6,
          highFrequencyCount: 4,
          freeCount: 6
        },
        scorecardStats: {
          practicedCount: 2,
          masteredCount: 1,
          weakCount: 1,
          averageLatestScore: 7.25,
          averageBestScore: 8
        }
      })
    ).toEqual({
      productName: "极库刷题",
      eyebrow: "Contract-first free practice kit",
      description: "用免费公开题库、浏览器本地练习记录和可审计合同推进刷题闭环。",
      navItems: [
        { id: "questions", label: "题库", to: "/questions" },
        { id: "practice", label: "练习", to: "/practice" },
        { id: "review", label: "复盘", to: "/review" },
        { id: "import-export", label: "导入导出", to: "/import-export" }
      ],
      stats: [
        { id: "question-total", label: "题库总数", value: "6", caption: "free" },
        { id: "category-count", label: "分类数量", value: "6", caption: "自动推导" },
        { id: "high-frequency", label: "高频题", value: "4", caption: "重点优先" },
        { id: "practiced-count", label: "已练题数", value: "2", caption: "本地记录" },
        { id: "average-score", label: "平均分", value: "7.3", caption: "latest" },
        { id: "weak-count", label: "弱项数量", value: "1", caption: "待复盘" }
      ]
    });
  });
});
