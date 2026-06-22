import { describe, expect, test } from "vitest";
import { mapQuestionIdsToPracticeRoute } from "./questionPracticeRoute";

describe("mapQuestionIdsToPracticeRoute", () => {
  test("links filtered question ids to the practice page", () => {
    expect(
      mapQuestionIdsToPracticeRoute([
        "typescript-structural-typing",
        "vue-computed-vs-watch"
      ])
    ).toEqual({
      name: "practice",
      query: {
        questionIds: "typescript-structural-typing,vue-computed-vs-watch"
      }
    });
  });
});
