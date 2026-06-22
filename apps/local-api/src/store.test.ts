import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { QuestionProgress, StudyAttempt, StudySession } from "@jiku/contracts";
import { createLocalDatabaseStore } from "./store";

const timestamp = "2026-01-01T00:00:00.000Z";
const sessionId = "session-1";
const questionId = "typescript-basic-types";

async function createRoot() {
  return mkdtemp(join(tmpdir(), "jiku-local-api-"));
}

function createSession(overrides: Partial<StudySession> = {}): StudySession {
  return {
    id: sessionId,
    schemaVersion: 1,
    status: "active",
    source: "question-filter",
    questionIds: [questionId],
    currentIndex: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

function createAttempt(overrides: Partial<StudyAttempt> = {}): StudyAttempt {
  return {
    id: "attempt-1",
    schemaVersion: 1,
    sessionId,
    questionId,
    assessment: "partial",
    score: 7,
    answeredAt: timestamp,
    ...overrides
  };
}

function createProgress(overrides: Partial<QuestionProgress> = {}): QuestionProgress {
  return {
    schemaVersion: 1,
    questionId,
    attempts: 1,
    latestScore: 7,
    bestScore: 7,
    wrongAttempts: 0,
    status: "learning",
    lastPracticedAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

describe("createLocalDatabaseStore", () => {
  test("creates the fixed local data directory structure and manifest", async () => {
    const root = await createRoot();
    const store = createLocalDatabaseStore({ root, now: () => new Date(timestamp) });

    const status = await store.ensureReady();

    expect(status).toEqual({
      ok: true,
      root,
      databasePath: join(root, "database"),
      corruptedCount: 0
    });
    await expect(
      readFile(join(root, "database", "manifest.json"), "utf8")
    ).resolves.toContain('"schemaVersion": 1');
    await expect(readdir(join(root, "database", "sessions"))).resolves.toEqual([]);
    await expect(readdir(join(root, "database", "attempts"))).resolves.toEqual([]);
    await expect(readdir(join(root, "database", "question-progress"))).resolves.toEqual(
      []
    );
    await expect(readdir(join(root, "derived"))).resolves.toEqual([]);
    await expect(readdir(join(root, "backups"))).resolves.toEqual([]);
    await expect(readdir(join(root, "corrupted"))).resolves.toEqual([]);
  });

  test("writes sessions progress and append-only attempts", async () => {
    const root = await createRoot();
    const store = createLocalDatabaseStore({ root, now: () => new Date(timestamp) });

    await store.writeSession(createSession());
    await store.appendAttempt(createAttempt({ id: "attempt-1" }));
    await store.appendAttempt(createAttempt({ id: "attempt-2", score: 10 }));
    await store.writeQuestionProgress(createProgress({ bestScore: 10 }));

    expect(await store.readSession(sessionId)).toEqual(createSession());
    expect(await store.readQuestionProgress(questionId)).toEqual(
      createProgress({ bestScore: 10 })
    );

    const attempts = await readFile(
      join(root, "database", "attempts", `${sessionId}.jsonl`),
      "utf8"
    );
    expect(
      attempts
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
    ).toEqual([
      createAttempt({ id: "attempt-1" }),
      createAttempt({ id: "attempt-2", score: 10 })
    ]);
  });

  test("isolates corrupt JSON records instead of throwing", async () => {
    const root = await createRoot();
    const store = createLocalDatabaseStore({ root, now: () => new Date(timestamp) });
    await store.ensureReady();
    await writeFile(join(root, "database", "sessions", "broken.json"), "{", "utf8");

    await expect(store.readSession("broken")).resolves.toBeNull();
    await expect(readdir(join(root, "database", "sessions"))).resolves.toEqual([]);
    expect(await readdir(join(root, "corrupted"))).toHaveLength(1);
  });

  test("returns the latest active session", async () => {
    const root = await createRoot();
    const store = createLocalDatabaseStore({ root, now: () => new Date(timestamp) });

    await store.writeSession(
      createSession({
        id: "old-active",
        updatedAt: "2026-01-01T00:00:00.000Z"
      })
    );
    await store.writeSession(
      createSession({
        id: "done",
        status: "completed",
        currentIndex: 1,
        updatedAt: "2026-01-03T00:00:00.000Z"
      })
    );
    await store.writeSession(
      createSession({
        id: "new-active",
        updatedAt: "2026-01-02T00:00:00.000Z"
      })
    );

    await expect(store.readActiveSession()).resolves.toMatchObject({
      id: "new-active"
    });
  });
});
