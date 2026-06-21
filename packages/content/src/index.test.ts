import { describe, expect, it } from "vitest";
import { allQuestions } from "./index";

describe("allQuestions", () => {
  it("loads only free public questions", () => {
    expect(allQuestions.length).toBeGreaterThanOrEqual(5);
    expect(allQuestions.every((question) => question.accessLevel === "free")).toBe(
      true
    );
  });

  it("uses globally unique ids", () => {
    const ids = allQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers the Phase 1 demo categories", () => {
    const categories = new Set(allQuestions.map((question) => question.category));

    for (const category of [
      "TypeScript",
      "JavaScript",
      "Vue",
      "React",
      "Cocos",
      "AI Agent"
    ]) {
      expect(categories.has(category)).toBe(true);
    }
  });
});
