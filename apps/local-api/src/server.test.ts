import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { StudySession } from "@jiku/contracts";
import { createLocalDatabaseStore } from "./store";
import { createLocalApiServer } from "./server";

const timestamp = "2026-01-01T00:00:00.000Z";

async function listen(server: ReturnType<typeof createLocalApiServer>) {
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("expected tcp server address");
  }

  return `http://127.0.0.1:${address.port}`;
}

function createSession(overrides: Partial<StudySession> = {}): StudySession {
  return {
    id: "session-1",
    schemaVersion: 1,
    status: "active",
    source: "question-filter",
    questionIds: ["typescript-basic-types"],
    currentIndex: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

describe("createLocalApiServer", () => {
  test("serves health and database status over localhost", async () => {
    const root = await mkdtemp(join(tmpdir(), "jiku-local-api-server-"));
    const store = createLocalDatabaseStore({
      root,
      now: () => new Date("2026-01-01T00:00:00.000Z")
    });
    const server = createLocalApiServer(store);

    try {
      const baseUrl = await listen(server);

      await expect(
        fetch(`${baseUrl}/health`).then((res) => res.json())
      ).resolves.toEqual({
        ok: true
      });
      await expect(
        fetch(`${baseUrl}/database/status`).then((res) => res.json())
      ).resolves.toMatchObject({
        ok: true,
        root
      });
    } finally {
      server.close();
    }
  });

  test("serves the latest active study session", async () => {
    const root = await mkdtemp(join(tmpdir(), "jiku-local-api-server-"));
    const store = createLocalDatabaseStore({
      root,
      now: () => new Date(timestamp)
    });
    const server = createLocalApiServer(store);

    try {
      const baseUrl = await listen(server);

      await fetch(`${baseUrl}/sessions/old-active`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          createSession({
            id: "old-active",
            updatedAt: "2026-01-01T00:00:00.000Z"
          })
        )
      });
      await fetch(`${baseUrl}/sessions/new-active`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          createSession({
            id: "new-active",
            updatedAt: "2026-01-02T00:00:00.000Z"
          })
        )
      });

      await expect(
        fetch(`${baseUrl}/sessions/active`).then((res) => res.json())
      ).resolves.toMatchObject({
        id: "new-active",
        status: "active"
      });
    } finally {
      server.close();
    }
  });
});
