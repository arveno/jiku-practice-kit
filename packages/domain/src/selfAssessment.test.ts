import { describe, expect, test } from "vitest";
import type { Scorecard } from "@jiku/contracts";
import { createEmptyScorecard } from "@jiku/contracts";
import { applySelfAssessment } from "./selfAssessment";

const firstTimestamp = "2026-06-21T09:00:00.000Z";
const nextTimestamp = "2026-06-21T10:00:00.000Z";

describe("applySelfAssessment", () => {
  test("creates a score record from a self assessment", () => {
    expect(
      applySelfAssessment(
        createEmptyScorecard(new Date(firstTimestamp)),
        {
          questionId: "typescript-structural-typing",
          assessment: "partial"
        },
        new Date(nextTimestamp)
      )
    ).toEqual({
      version: 1,
      updatedAt: nextTimestamp,
      records: {
        "typescript-structural-typing": {
          questionId: "typescript-structural-typing",
          latestScore: 7,
          bestScore: 7,
          attempts: 1,
          status: "learning",
          weakPoints: [],
          lastFeedback: "partial",
          lastPracticedAt: nextTimestamp
        }
      }
    });
  });

  test("updates latest score attempts status and keeps the best score", () => {
    const scorecard: Scorecard = {
      version: 1,
      updatedAt: firstTimestamp,
      records: {
        "typescript-structural-typing": {
          questionId: "typescript-structural-typing",
          latestScore: 8,
          bestScore: 8,
          attempts: 2,
          status: "mastered",
          weakPoints: ["Tradeoff"],
          lastFeedback: "mastered",
          lastPracticedAt: firstTimestamp
        }
      }
    };

    expect(
      applySelfAssessment(
        scorecard,
        {
          questionId: "typescript-structural-typing",
          assessment: "failed"
        },
        new Date(nextTimestamp)
      ).records["typescript-structural-typing"]
    ).toEqual({
      questionId: "typescript-structural-typing",
      latestScore: 0,
      bestScore: 8,
      attempts: 3,
      status: "weak",
      weakPoints: ["Tradeoff"],
      lastFeedback: "failed",
      lastPracticedAt: nextTimestamp
    });
  });
});
