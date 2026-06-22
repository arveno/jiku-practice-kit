import { describe, expect, test } from "vitest";
import type {
  QuestionProgress,
  ReviewSchedule,
  StudyAttempt,
  StudySession
} from "@jiku/contracts";
import {
  readActiveStudySession,
  readDatabaseSummary,
  readLocalApiStatus,
  readQuestionProgress,
  readQuestionProgressList,
  readReviewSchedules,
  writeQuestionProgress,
  writeReviewSchedule,
  writeStudyAttempt,
  writeStudySession
} from "./client";

function createResponse(body: unknown, ok = true) {
  return {
    ok,
    json: () => Promise.resolve(body)
  } as Response;
}

describe("readLocalApiStatus", () => {
  test("maps a healthy local API response", async () => {
    await expect(
      readLocalApiStatus(() =>
        Promise.resolve(
          createResponse({
            ok: true,
            root: "/Users/me/.jiku-practice-kit",
            databasePath: "/Users/me/.jiku-practice-kit/database",
            corruptedCount: 0
          })
        )
      )
    ).resolves.toEqual({
      state: "connected",
      root: "/Users/me/.jiku-practice-kit",
      databasePath: "/Users/me/.jiku-practice-kit/database",
      corruptedCount: 0
    });
  });

  test("maps local API write errors and unavailable service", async () => {
    await expect(
      readLocalApiStatus(() =>
        Promise.resolve(
          createResponse({
            ok: false,
            root: "/Users/me/.jiku-practice-kit",
            databasePath: "/Users/me/.jiku-practice-kit/database",
            corruptedCount: 0,
            error: "permission denied"
          })
        )
      )
    ).resolves.toEqual({
      state: "unwritable",
      root: "/Users/me/.jiku-practice-kit",
      databasePath: "/Users/me/.jiku-practice-kit/database",
      corruptedCount: 0,
      message: "permission denied"
    });

    await expect(
      readLocalApiStatus(() => Promise.reject(new Error("fetch failed")))
    ).resolves.toEqual({
      state: "unavailable",
      message: "本地服务未连接"
    });
  });
});

describe("database summary API", () => {
  test("reads database summary", async () => {
    await expect(
      readDatabaseSummary(() =>
        Promise.resolve(
          createResponse({
            ok: true,
            root: "/Users/me/.jiku-practice-kit",
            databasePath: "/Users/me/.jiku-practice-kit/database",
            corruptedCount: 1,
            activeSession: {
              id: "session-1",
              schemaVersion: 1,
              status: "active",
              source: "question-filter",
              questionIds: ["typescript-structural-typing"],
              currentIndex: 0,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z"
            },
            totalAttempts: 2,
            questionProgressCount: 1,
            reviewScheduleCount: 1
          })
        )
      )
    ).resolves.toMatchObject({
      state: "connected",
      corruptedCount: 1,
      activeSession: { id: "session-1" },
      totalAttempts: 2,
      questionProgressCount: 1,
      reviewScheduleCount: 1
    });
  });
});

describe("study session API", () => {
  test("reads the active study session", async () => {
    await expect(
      readActiveStudySession(() =>
        Promise.resolve(
          createResponse({
            id: "session-1",
            schemaVersion: 1,
            status: "active",
            source: "question-filter",
            questionIds: ["typescript-structural-typing"],
            currentIndex: 0,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z"
          })
        )
      )
    ).resolves.toMatchObject({
      id: "session-1",
      status: "active"
    });

    await expect(
      readActiveStudySession(() =>
        Promise.resolve(createResponse({ error: "not found" }, false))
      )
    ).resolves.toBeNull();
  });

  test("writes a study session by id", async () => {
    const calls: { input: RequestInfo | URL; init: RequestInit | undefined }[] = [];
    const session: StudySession = {
      id: "session-1",
      schemaVersion: 1,
      status: "active",
      source: "question-filter",
      questionIds: ["typescript-structural-typing"],
      currentIndex: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    };

    await writeStudySession(session, (input, init) => {
      calls.push({ input, init });
      return Promise.resolve(createResponse({ ok: true }));
    });

    expect(calls).toEqual([
      {
        input: "/api/sessions/session-1",
        init: {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(session)
        }
      }
    ]);
  });
});

describe("study record API", () => {
  const progress: QuestionProgress = {
    schemaVersion: 1,
    questionId: "typescript-structural-typing",
    attempts: 1,
    latestScore: 7,
    bestScore: 7,
    wrongAttempts: 0,
    status: "learning",
    lastPracticedAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
  const attempt: StudyAttempt = {
    id: "attempt-1",
    schemaVersion: 1,
    sessionId: "session-1",
    questionId: progress.questionId,
    assessment: "partial",
    score: 7,
    answeredAt: "2026-01-01T00:00:00.000Z"
  };
  const schedule: ReviewSchedule = {
    schemaVersion: 1,
    questionId: progress.questionId,
    reason: "low-score",
    priority: 80,
    nextReviewAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };

  test("reads progress and review schedule lists", async () => {
    await expect(
      readQuestionProgressList(() => Promise.resolve(createResponse([progress])))
    ).resolves.toEqual([progress]);
    await expect(
      readQuestionProgress(progress.questionId, () =>
        Promise.resolve(createResponse(progress))
      )
    ).resolves.toEqual(progress);
    await expect(
      readReviewSchedules(() => Promise.resolve(createResponse([schedule])))
    ).resolves.toEqual([schedule]);
  });

  test("writes attempt progress and review schedule", async () => {
    const calls: { input: RequestInfo | URL; init: RequestInit | undefined }[] = [];
    const fetcher = (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ input, init });
      return Promise.resolve(createResponse({ ok: true }));
    };

    await writeStudyAttempt(attempt, fetcher);
    await writeQuestionProgress(progress, fetcher);
    await writeReviewSchedule(schedule, fetcher);

    expect(calls).toEqual([
      {
        input: "/api/attempts",
        init: {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(attempt)
        }
      },
      {
        input: "/api/question-progress/typescript-structural-typing",
        init: {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(progress)
        }
      },
      {
        input: "/api/review-schedules/typescript-structural-typing",
        init: {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(schedule)
        }
      }
    ]);
  });
});
