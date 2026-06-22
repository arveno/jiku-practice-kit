import { describe, expect, test } from "vitest";
import type { Question, Scorecard } from "@jiku/contracts";
import { mapReviewViewModel } from "./reviewViewModel";

const timestamp = "2026-06-22T03:00:00.000Z";

function createQuestion(overrides: Partial<Question>): Question {
  return {
    id: "typescript-structural-typing",
    title: "Explain TypeScript structural typing.",
    category: "TypeScript",
    topic: "Type System",
    tags: ["typescript"],
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
  createQuestion({
    id: "typescript-structural-typing",
    category: "TypeScript",
    topic: "Type System"
  }),
  createQuestion({
    id: "javascript-event-loop",
    title: "Describe the JavaScript event loop.",
    category: "JavaScript",
    topic: "Runtime",
    tags: ["javascript"],
    question: "How do task and microtask queues cooperate?"
  }),
  createQuestion({
    id: "vue-computed-vs-watch",
    title: "Compare computed and watch in Vue.",
    category: "Vue",
    topic: "Reactivity",
    tags: ["vue"],
    question: "When should you use computed in Vue?"
  })
];

const scorecard: Scorecard = {
  version: 1,
  updatedAt: timestamp,
  records: {
    "typescript-structural-typing": {
      questionId: "typescript-structural-typing",
      latestScore: 4,
      bestScore: 7,
      attempts: 2,
      status: "weak",
      weakPoints: ["Assignability"],
      lastFeedback: "unclear",
      lastPracticedAt: "2026-06-22T03:00:00.000Z"
    },
    "javascript-event-loop": {
      questionId: "javascript-event-loop",
      latestScore: 8,
      bestScore: 8,
      attempts: 1,
      status: "mastered",
      weakPoints: [],
      lastFeedback: "mastered",
      lastPracticedAt: "2026-06-22T04:00:00.000Z"
    }
  }
};

describe("mapReviewViewModel", () => {
  test("summarizes local scorecard records against question content", () => {
    expect(mapReviewViewModel(questions, scorecard)).toEqual({
      stats: [
        { id: "practiced", label: "已练题数", value: "2" },
        { id: "average", label: "平均分", value: "6.0" },
        { id: "weak", label: "弱项题", value: "1" },
        { id: "low-score", label: "低分题", value: "1" }
      ],
      weakQuestions: [
        {
          id: "typescript-structural-typing",
          title: "Explain TypeScript structural typing.",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / Type System"
        }
      ],
      lowScoreQuestions: [
        {
          id: "typescript-structural-typing",
          title: "Explain TypeScript structural typing.",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / Type System"
        }
      ],
      categoryAverages: [
        { id: "JavaScript", label: "JavaScript", value: "8.0" },
        { id: "TypeScript", label: "TypeScript", value: "4.0" }
      ],
      topicAverages: [
        { id: "Runtime", label: "Runtime", value: "8.0" },
        { id: "Type System", label: "Type System", value: "4.0" }
      ],
      recentRecords: [
        {
          id: "javascript-event-loop",
          title: "Describe the JavaScript event loop.",
          to: "/questions/javascript-event-loop",
          latestScoreLabel: "8.0/10",
          meta: "JavaScript / Runtime",
          practicedAtLabel: "2026-06-22 04:00"
        },
        {
          id: "typescript-structural-typing",
          title: "Explain TypeScript structural typing.",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / Type System",
          practicedAtLabel: "2026-06-22 03:00"
        }
      ]
    });
  });
});
