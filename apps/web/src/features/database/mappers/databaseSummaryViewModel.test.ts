import { describe, expect, test } from "vitest";
import type { LocalDatabaseSummary } from "../../local-api/client";
import { mapDatabaseSummaryViewModel } from "./databaseSummaryViewModel";

describe("mapDatabaseSummaryViewModel", () => {
  test("maps a connected local database summary", () => {
    const summary: LocalDatabaseSummary = {
      state: "connected",
      root: "/Users/me/.jiku-practice-kit",
      databasePath: "/Users/me/.jiku-practice-kit/database",
      corruptedCount: 1,
      activeSession: {
        id: "session-1",
        schemaVersion: 1,
        status: "active",
        source: "question-filter",
        questionIds: ["typescript-structural-typing", "javascript-event-loop"],
        currentIndex: 1,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:10:00.000Z"
      },
      totalAttempts: 3,
      questionProgressCount: 2,
      reviewScheduleCount: 1
    };

    expect(mapDatabaseSummaryViewModel(summary)).toEqual({
      stats: [
        { id: "attempts", label: "总作答", value: "3" },
        { id: "progress", label: "进度文件", value: "2" },
        { id: "review", label: "复习计划", value: "1" },
        { id: "corrupted", label: "异常文件", value: "1" }
      ],
      details: [
        { id: "state", label: "状态", value: "已连接" },
        { id: "root", label: "数据根目录", value: "/Users/me/.jiku-practice-kit" },
        {
          id: "databasePath",
          label: "数据库目录",
          value: "/Users/me/.jiku-practice-kit/database"
        },
        { id: "activeSession", label: "当前轮次", value: "session-1 · 第 2/2 题" }
      ]
    });
  });
});
