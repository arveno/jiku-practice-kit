import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { createLocalDatabaseStore } from "./store";
import { createLocalApiServer } from "./server";

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
});
