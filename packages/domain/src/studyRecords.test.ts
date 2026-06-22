import { describe, expect, test } from "vitest";
import type { Question, QuestionProgress } from "@jiku/contracts";
import {
  createReviewSchedule,
  createStudyAttempt,
  updateQuestionProgress
} from "./studyRecords";

const timestamp = "2026-06-22T03:00:00.000Z";

const question: Question = {
  id: "typescript-structural-typing",
  title: "解释 TypeScript 结构化类型系统",
  category: "TypeScript",
  topic: "类型系统",
  tags: ["typescript"],
  difficulty: "medium",
  frequency: "high",
  accessLevel: "free",
  products: ["web"],
  question: "结构化类型系统如何影响赋值兼容性？",
  standardAnswer: "TypeScript 按结构比较类型兼容性。",
  keyPoints: [{ text: "说明按形状兼容", weight: 10 }],
  followUps: [],
  commonMistakes: [],
  scoring: {
    totalScore: 10,
    passScore: 6,
    dimensions: [{ name: "概念", score: 10, description: "解释模型。" }]
  }
};

describe("studyRecords", () => {
  test("creates a traceable attempt from self assessment", () => {
    expect(
      createStudyAttempt(
        {
          sessionId: "session-1",
          questionId: question.id,
          assessment: "partial"
        },
        new Date(timestamp),
        "attempt-1"
      )
    ).toEqual({
      id: "attempt-1",
      schemaVersion: 1,
      sessionId: "session-1",
      questionId: question.id,
      assessment: "partial",
      score: 7,
      answeredAt: timestamp
    });
  });

  test("updates progress from attempts", () => {
    const previous: QuestionProgress = {
      schemaVersion: 1,
      questionId: question.id,
      attempts: 2,
      latestScore: 7,
      bestScore: 8,
      wrongAttempts: 1,
      status: "learning",
      lastPracticedAt: "2026-06-21T03:00:00.000Z",
      updatedAt: "2026-06-21T03:00:00.000Z"
    };

    const attempt = createStudyAttempt(
      {
        sessionId: "session-1",
        questionId: question.id,
        assessment: "failed"
      },
      new Date(timestamp),
      "attempt-1"
    );

    expect(updateQuestionProgress(question, attempt, previous)).toEqual({
      schemaVersion: 1,
      questionId: question.id,
      attempts: 3,
      latestScore: 0,
      bestScore: 8,
      wrongAttempts: 2,
      status: "weak",
      lastPracticedAt: timestamp,
      updatedAt: timestamp
    });
  });

  test("schedules wrong and mastered questions for review", () => {
    const failedAttempt = createStudyAttempt(
      {
        sessionId: "session-1",
        questionId: question.id,
        assessment: "failed"
      },
      new Date(timestamp),
      "attempt-1"
    );
    const failedProgress = updateQuestionProgress(question, failedAttempt);

    expect(createReviewSchedule(question, failedProgress, new Date(timestamp))).toEqual(
      {
        schemaVersion: 1,
        questionId: question.id,
        reason: "wrong",
        priority: 100,
        nextReviewAt: timestamp,
        updatedAt: timestamp
      }
    );

    const masteredAttempt = createStudyAttempt(
      {
        sessionId: "session-1",
        questionId: question.id,
        assessment: "mastered"
      },
      new Date(timestamp),
      "attempt-2"
    );
    const masteredProgress = updateQuestionProgress(question, masteredAttempt);

    expect(
      createReviewSchedule(question, masteredProgress, new Date(timestamp))
    ).toMatchObject({
      reason: "stale",
      priority: 20,
      nextReviewAt: "2026-06-29T03:00:00.000Z"
    });
  });
});
