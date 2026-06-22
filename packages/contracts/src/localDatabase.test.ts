import { describe, expect, it } from "vitest";
import {
  localDatabaseManifestSchema,
  questionProgressSchema,
  reviewScheduleSchema,
  studyAttemptSchema,
  studySessionSchema
} from "./localDatabase";

const timestamp = "2026-01-01T00:00:00.000Z";
const questionId = "typescript-basic-types";
const sessionId = "session-2026-01-01";

describe("local database contracts", () => {
  it("accepts the fixed local database manifest", () => {
    expect(
      localDatabaseManifestSchema.parse({
        schemaVersion: 1,
        appContentVersion: "phase-2",
        createdAt: timestamp,
        updatedAt: timestamp
      })
    ).toEqual({
      schemaVersion: 1,
      appContentVersion: "phase-2",
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });

  it("accepts a resumable study session", () => {
    const session = studySessionSchema.parse({
      id: sessionId,
      schemaVersion: 1,
      status: "active",
      source: "question-filter",
      questionIds: [questionId],
      currentIndex: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    expect(session.questionIds).toEqual([questionId]);
  });

  it("accepts attempt progress and review records", () => {
    expect(
      studyAttemptSchema.parse({
        id: "attempt-1",
        schemaVersion: 1,
        sessionId,
        questionId,
        assessment: "partial",
        score: 7,
        answeredAt: timestamp
      }).score
    ).toBe(7);

    expect(
      questionProgressSchema.parse({
        schemaVersion: 1,
        questionId,
        attempts: 2,
        latestScore: 7,
        bestScore: 10,
        wrongAttempts: 1,
        status: "learning",
        lastPracticedAt: timestamp,
        updatedAt: timestamp
      }).questionId
    ).toBe(questionId);

    expect(
      reviewScheduleSchema.parse({
        schemaVersion: 1,
        questionId,
        reason: "low-score",
        priority: 70,
        nextReviewAt: timestamp,
        updatedAt: timestamp
      }).reason
    ).toBe("low-score");
  });

  it("rejects inconsistent local database records", () => {
    expect(() =>
      studySessionSchema.parse({
        id: sessionId,
        schemaVersion: 1,
        status: "active",
        source: "question-filter",
        questionIds: [questionId],
        currentIndex: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      })
    ).toThrow();

    expect(() =>
      questionProgressSchema.parse({
        schemaVersion: 1,
        questionId,
        attempts: 1,
        latestScore: 9,
        bestScore: 7,
        wrongAttempts: 0,
        status: "learning",
        lastPracticedAt: timestamp,
        updatedAt: timestamp
      })
    ).toThrow();
  });
});
