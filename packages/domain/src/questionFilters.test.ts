import { describe, expect, test } from "vitest";
import type { Question } from "@jiku/contracts";
import {
  deriveQuestionFilterOptions,
  filterQuestions,
  getQuestionStats
} from "./questionFilters";

function createQuestion(overrides: Partial<Question>): Question {
  return {
    id: "typescript-structural-typing",
    title: "Explain TypeScript structural typing.",
    category: "TypeScript",
    topic: "Type System",
    tags: ["typescript", "types"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "How does structural typing affect assignability?",
    standardAnswer: "TypeScript compares values by shape.",
    keyPoints: [{ text: "Mentions shape-based compatibility", weight: 10 }],
    followUps: [],
    commonMistakes: [],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Concept",
          score: 10,
          description: "Explains the model."
        }
      ]
    },
    ...overrides
  };
}

const questions: Question[] = [
  createQuestion({ id: "typescript-structural-typing" }),
  createQuestion({
    id: "react-state-rerender",
    title: "Explain React state updates and re-rendering.",
    category: "React",
    topic: "Rendering",
    tags: ["react", "rendering"],
    question: "What happens when React schedules a state update?",
    standardAnswer: "React reconciles the next UI and commits host updates."
  }),
  createQuestion({
    id: "vue-computed-vs-watch",
    title: "Compare computed and watch in Vue.",
    category: "Vue",
    topic: "Reactivity",
    tags: ["vue", "reactivity"],
    difficulty: "easy",
    frequency: "medium",
    question: "When should you use computed in Vue?",
    standardAnswer: "Use computed for cached derived state."
  })
];

describe("deriveQuestionFilterOptions", () => {
  test("derives filter values from question data", () => {
    expect(deriveQuestionFilterOptions(questions)).toEqual({
      categories: ["React", "TypeScript", "Vue"],
      topics: ["Reactivity", "Rendering", "Type System"],
      tags: ["react", "reactivity", "rendering", "types", "typescript", "vue"],
      difficulties: ["easy", "medium"],
      frequencies: ["high", "medium"],
      accessLevels: ["free"]
    });
  });
});

describe("filterQuestions", () => {
  test("filters by category and tag", () => {
    expect(filterQuestions(questions, { category: "React" }).map((q) => q.id)).toEqual([
      "react-state-rerender"
    ]);
    expect(filterQuestions(questions, { tag: "reactivity" }).map((q) => q.id)).toEqual([
      "vue-computed-vs-watch"
    ]);
  });

  test("searches keyword across question text", () => {
    expect(filterQuestions(questions, { keyword: "shape" }).map((q) => q.id)).toEqual([
      "typescript-structural-typing"
    ]);
  });

  test("filters by topic difficulty frequency and access level", () => {
    expect(
      filterQuestions(questions, {
        topic: "Rendering",
        difficulty: "medium",
        frequency: "high",
        accessLevel: "free"
      }).map((q) => q.id)
    ).toEqual(["react-state-rerender"]);
  });
});

describe("getQuestionStats", () => {
  test("counts questions categories and high frequency questions", () => {
    expect(getQuestionStats(questions)).toEqual({
      totalCount: 3,
      categoryCount: 3,
      highFrequencyCount: 2,
      freeCount: 3
    });
  });
});
