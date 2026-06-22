import { describe, expect, test } from "vitest";
import { advanceStudySession, createStudySession } from "./practiceSession";

describe("practiceSession", () => {
  test("creates an active question-filter session", () => {
    expect(
      createStudySession(
        [
          "typescript-structural-typing",
          "vue-computed-vs-watch",
          "typescript-structural-typing"
        ],
        new Date("2026-01-01T00:00:00.000Z"),
        "session-1"
      )
    ).toEqual({
      id: "session-1",
      schemaVersion: 1,
      status: "active",
      source: "question-filter",
      questionIds: ["typescript-structural-typing", "vue-computed-vs-watch"],
      currentIndex: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });

  test("rejects empty sessions", () => {
    expect(() =>
      createStudySession([], new Date("2026-01-01T00:00:00.000Z"), "session-1")
    ).toThrow("study session requires at least one question");
  });

  test("advances and completes a study session", () => {
    const session = createStudySession(
      ["typescript-structural-typing"],
      new Date("2026-01-01T00:00:00.000Z"),
      "session-1"
    );

    expect(
      advanceStudySession(session, 1, new Date("2026-01-02T00:00:00.000Z"))
    ).toMatchObject({
      status: "completed",
      currentIndex: 1,
      updatedAt: "2026-01-02T00:00:00.000Z"
    });
  });
});
