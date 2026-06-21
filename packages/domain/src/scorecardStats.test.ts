import { describe, expect, test } from "vitest";
import type { Scorecard } from "@jiku/contracts";
import { createEmptyScorecard } from "@jiku/contracts";
import { getScorecardStats } from "./scorecardStats";

const timestamp = "2026-01-01T00:00:00.000Z";

const scorecard: Scorecard = {
  version: 1,
  updatedAt: timestamp,
  records: {
    "typescript-structural-typing": {
      questionId: "typescript-structural-typing",
      latestScore: 8,
      bestScore: 9,
      attempts: 2,
      status: "mastered",
      weakPoints: [],
      lastFeedback: "",
      lastPracticedAt: timestamp
    },
    "vue-computed-vs-watch": {
      questionId: "vue-computed-vs-watch",
      latestScore: 4,
      bestScore: 6,
      attempts: 1,
      status: "weak",
      weakPoints: ["Watch side effects"],
      lastFeedback: "Computed values are derived state.",
      lastPracticedAt: timestamp
    }
  }
};

describe("getScorecardStats", () => {
  test("returns zero stats for an empty scorecard", () => {
    expect(getScorecardStats(createEmptyScorecard(new Date(timestamp)))).toEqual({
      practicedCount: 0,
      masteredCount: 0,
      weakCount: 0,
      averageLatestScore: 0,
      averageBestScore: 0
    });
  });

  test("summarizes practiced scorecard records", () => {
    expect(getScorecardStats(scorecard)).toEqual({
      practicedCount: 2,
      masteredCount: 1,
      weakCount: 1,
      averageLatestScore: 6,
      averageBestScore: 7.5
    });
  });
});
