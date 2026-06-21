import { describe, expect, test } from "vitest";
import { findArchitectureFailures } from "./guardArchitecture";

describe("findArchitectureFailures", () => {
  test("rejects duplicated app models and page DTO leakage", () => {
    const failures = findArchitectureFailures([
      {
        path: "apps/api/src/question.ts",
        content: "export interface Question { id: string }"
      },
      {
        path: "apps/miniapp/src/scorecard.ts",
        content: "export type Scorecard = { records: unknown[] }"
      },
      {
        path: "apps/web/src/pages/HomePage.vue",
        content: "const item = {} as QuestionDto"
      }
    ]);

    expect(failures).toEqual([
      "Question type must come from @jiku/contracts: apps/api/src/question.ts",
      "Scorecard type must come from @jiku/contracts: apps/miniapp/src/scorecard.ts",
      "QuestionDto must stay out of page components: apps/web/src/pages/HomePage.vue"
    ]);
  });

  test("rejects horizontal feature buckets in web source", () => {
    const failures = findArchitectureFailures([
      { path: "apps/web/src/components/QuestionCard.vue", content: "" },
      { path: "apps/web/src/stores/questions.ts", content: "" },
      { path: "apps/web/src/mappers/question.ts", content: "" },
      { path: "apps/web/src/models/question.ts", content: "" }
    ]);

    expect(failures).toEqual([
      "web source must use feature-first structure instead of horizontal buckets: apps/web/src/components/QuestionCard.vue",
      "web source must use feature-first structure instead of horizontal buckets: apps/web/src/stores/questions.ts",
      "web source must use feature-first structure instead of horizontal buckets: apps/web/src/mappers/question.ts",
      "web source must use feature-first structure instead of horizontal buckets: apps/web/src/models/question.ts"
    ]);
  });

  test("rejects scorecard and paid answer leaks in git-visible files", () => {
    const failures = findArchitectureFailures(
      [
        { path: "scorecard.json", content: "{}" },
        { path: "scorecards/session.json", content: "{}" },
        {
          path: "packages/content/src/public/paid-answer.ts",
          content: "export const paidAnswer = 'paid solution';"
        },
        {
          path: "packages/content/src/public/questions.ts",
          content: 'const question = { accessLevel: "paid" };'
        }
      ],
      []
    );

    expect(failures).toEqual([
      "scorecard data file must stay out of git-visible files: scorecard.json",
      "scorecard data file must stay out of git-visible files: scorecards/session.json",
      "paid answer content must stay out of git-visible files: packages/content/src/public/paid-answer.ts",
      "paid answer content must stay out of git-visible files: packages/content/src/public/questions.ts"
    ]);
  });

  test("rejects local scorecard and paid answer leaks in build output", () => {
    const failures = findArchitectureFailures(
      [],
      [],
      [
        {
          path: "apps/web/dist/assets/local.js",
          content: 'fetch(".local/scorecard.json");'
        },
        {
          path: "apps/web/dist/assets/scorecard.js",
          content: 'const file = "scorecard.json";'
        },
        {
          path: "apps/web/dist/assets/paid-answer.js",
          content: "const paidAnswer = 'paid solution';"
        }
      ]
    );

    expect(failures).toEqual([
      "build output references forbidden private/local path: apps/web/dist/assets/local.js",
      "build output references scorecard data: apps/web/dist/assets/scorecard.js",
      "build output references paid answer content: apps/web/dist/assets/paid-answer.js"
    ]);
  });
});
