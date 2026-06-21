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
});
