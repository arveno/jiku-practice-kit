import { describe, expect, it } from "vitest";
import {
  createEmptyScorecard,
  scorecardSchema,
  type ScoreRecord,
  type Scorecard
} from "./scorecard";

const timestamp = "2026-01-01T00:00:00.000Z";
const questionId = "typescript-basic-types";

function createRecord(overrides: Partial<ScoreRecord> = {}): ScoreRecord {
  return {
    questionId,
    latestScore: 6,
    bestScore: 8,
    attempts: 1,
    status: "learning",
    weakPoints: [],
    lastFeedback: "",
    lastPracticedAt: timestamp,
    ...overrides
  };
}

function createScorecard(record: ScoreRecord): Scorecard {
  return {
    version: 1,
    updatedAt: timestamp,
    records: {
      [record.questionId]: record
    }
  };
}

describe("scorecardSchema", () => {
  it("creates an empty versioned scorecard", () => {
    const scorecard = createEmptyScorecard();

    expect(scorecardSchema.parse(scorecard).version).toBe(1);
    expect(scorecard.records).toEqual({});
  });

  it("accepts a practiced question record", () => {
    const scorecard = scorecardSchema.parse(createScorecard(createRecord()));

    expect(scorecard.records[questionId]?.attempts).toBe(1);
  });

  it("rejects negative scores", () => {
    expect(() =>
      scorecardSchema.parse(createScorecard(createRecord({ latestScore: -1 })))
    ).toThrow();
  });

  it("rejects records whose best score is lower than the latest score", () => {
    expect(() =>
      scorecardSchema.parse(
        createScorecard(createRecord({ latestScore: 8, bestScore: 7 }))
      )
    ).toThrow();
  });

  it("rejects zero-attempt records because untouched questions stay absent", () => {
    expect(() =>
      scorecardSchema.parse(createScorecard(createRecord({ attempts: 0 })))
    ).toThrow();
  });

  it("rejects records whose map key does not match the question id", () => {
    expect(() =>
      scorecardSchema.parse({
        version: 1,
        updatedAt: timestamp,
        records: {
          "wrong-question-id": createRecord()
        }
      })
    ).toThrow();
  });
});
