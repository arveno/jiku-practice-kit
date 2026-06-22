import { describe, expect, test } from "vitest";
import type { StudySession } from "@jiku/contracts";
import {
  readActiveStudySession,
  readLocalApiStatus,
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
