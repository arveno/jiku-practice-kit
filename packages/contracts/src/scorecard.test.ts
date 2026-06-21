import { describe, expect, it } from "vitest";
import { createEmptyScorecard, scorecardSchema } from "./scorecard";

describe("scorecardSchema", () => {
  it("creates an empty versioned scorecard", () => {
    const scorecard = createEmptyScorecard();

    expect(scorecardSchema.parse(scorecard).version).toBe(1);
    expect(scorecard.records).toEqual({});
  });

  it("rejects negative scores", () => {
    expect(() =>
      scorecardSchema.parse({
        version: 1,
        updatedAt: new Date().toISOString(),
        records: {
          "typescript-basic-types": {
            questionId: "typescript-basic-types",
            latestScore: -1,
            bestScore: 0,
            attempts: 1,
            status: "learning",
            weakPoints: [],
            lastFeedback: "",
            lastPracticedAt: new Date().toISOString()
          }
        }
      })
    ).toThrow();
  });
});
