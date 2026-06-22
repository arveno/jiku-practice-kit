import { describe, expect, test } from "vitest";
import { readLocalApiStatus } from "./client";

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
