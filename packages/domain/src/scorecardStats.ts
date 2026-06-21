import type { Scorecard } from "@jiku/contracts";

export type ScorecardStats = {
  practicedCount: number;
  masteredCount: number;
  weakCount: number;
  averageLatestScore: number;
  averageBestScore: number;
};

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function getScorecardStats(scorecard: Scorecard): ScorecardStats {
  const records = Object.values(scorecard.records);

  return {
    practicedCount: records.length,
    masteredCount: records.filter((record) => record.status === "mastered").length,
    weakCount: records.filter((record) => record.status === "weak").length,
    averageLatestScore: average(records.map((record) => record.latestScore)),
    averageBestScore: average(records.map((record) => record.bestScore))
  };
}
