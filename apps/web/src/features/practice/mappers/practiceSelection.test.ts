import { describe, expect, test } from "vitest";
import type { Question, Scorecard } from "@jiku/contracts";
import { selectPracticeQuestions } from "./practiceSelection";

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
    category: "React",
    topic: "Rendering",
    tags: ["react", "rendering"],
    frequency: "medium"
  }),
  createQuestion({
    id: "vue-computed-vs-watch",
    category: "Vue",
    topic: "Reactivity",
    tags: ["vue", "reactivity"],
    frequency: "high"
  })
];

const scorecard: Scorecard = {
  version: 1,
  updatedAt: "2026-06-21T09:00:00.000Z",
  records: {
    "typescript-structural-typing": {
      questionId: "typescript-structural-typing",
      latestScore: 4,
      bestScore: 8,
      attempts: 2,
      status: "weak",
      weakPoints: [],
      lastFeedback: "unclear",
      lastPracticedAt: "2026-06-21T09:00:00.000Z"
    },
    "react-state-rerender": {
      questionId: "react-state-rerender",
      latestScore: 8,
      bestScore: 8,
      attempts: 1,
      status: "learning",
      weakPoints: [],
      lastFeedback: "partial",
      lastPracticedAt: "2026-06-21T09:00:00.000Z"
    }
  }
};

describe("selectPracticeQuestions", () => {
  test("selects questions by content-backed scopes", () => {
    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "category",
        value: "React",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["react-state-rerender"]);

    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "tag",
        value: "reactivity",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["vue-computed-vs-watch"]);

    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "high-frequency",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["typescript-structural-typing", "vue-computed-vs-watch"]);
  });

  test("selects questions by scorecard-backed scopes", () => {
    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "weak",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["typescript-structural-typing"]);

    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "unpracticed",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["vue-computed-vs-watch"]);

    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "low-score",
        count: 5
      }).map((question) => question.id)
    ).toEqual(["typescript-structural-typing"]);
  });

  test("limits the number of selected questions", () => {
    expect(
      selectPracticeQuestions(questions, scorecard, {
        scope: "random",
        count: 2,
        random: () => 0.9
      })
    ).toHaveLength(2);
  });
});
