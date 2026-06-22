import type { QuestionStats, ScorecardStats } from "@jiku/domain";
import type { HomeViewModel } from "../models/homeViewModel";

type HomeViewModelInput = {
  questionStats: QuestionStats;
  scorecardStats: ScorecardStats;
};

function formatAverageScore(value: number) {
  return value.toFixed(1);
}

export function mapHomeViewModel(input: HomeViewModelInput): HomeViewModel {
  return {
    productName: "极库刷题",
    eyebrow: "Contract-first free practice kit",
    description: "用免费公开题库、固定本地数据库和可审计合同推进刷题闭环。",
    navItems: [
      { id: "questions", label: "题库", to: "/questions" },
      { id: "practice", label: "练习", to: "/practice" },
      { id: "review", label: "复盘", to: "/review" },
      { id: "data", label: "数据", to: "/data" }
    ],
    stats: [
      {
        id: "question-total",
        label: "题库总数",
        value: String(input.questionStats.totalCount),
        caption: "free"
      },
      {
        id: "category-count",
        label: "分类数量",
        value: String(input.questionStats.categoryCount),
        caption: "自动推导"
      },
      {
        id: "high-frequency",
        label: "高频题",
        value: String(input.questionStats.highFrequencyCount),
        caption: "重点优先"
      },
      {
        id: "practiced-count",
        label: "已练题数",
        value: String(input.scorecardStats.practicedCount),
        caption: "本地记录"
      },
      {
        id: "average-score",
        label: "平均分",
        value: formatAverageScore(input.scorecardStats.averageLatestScore),
        caption: "latest"
      },
      {
        id: "weak-count",
        label: "弱项数量",
        value: String(input.scorecardStats.weakCount),
        caption: "待复盘"
      }
    ]
  };
}
