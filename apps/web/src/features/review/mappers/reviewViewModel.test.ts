import { describe, expect, test } from "vitest";
import type { Question, QuestionProgress, ReviewSchedule } from "@jiku/contracts";
import { mapReviewViewModel } from "./reviewViewModel";

const timestamp = "2026-06-22T03:00:00.000Z";

function createQuestion(overrides: Partial<Question>): Question {
  return {
    id: "typescript-structural-typing",
    title: "解释 TypeScript 结构化类型系统",
    category: "TypeScript",
    topic: "类型系统",
    tags: ["typescript"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "结构化类型系统如何影响赋值兼容性？",
    standardAnswer: "TypeScript 按结构比较类型兼容性。",
    keyPoints: [{ text: "说明按形状兼容", weight: 10 }],
    followUps: [],
    commonMistakes: [],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [{ name: "概念", score: 10, description: "解释模型。" }]
    },
    ...overrides
  };
}

function createProgress(
  questionId: string,
  overrides: Partial<QuestionProgress> = {}
): QuestionProgress {
  return {
    schemaVersion: 1,
    questionId,
    attempts: 1,
    latestScore: 7,
    bestScore: 7,
    wrongAttempts: 0,
    status: "learning",
    lastPracticedAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

function createSchedule(
  questionId: string,
  overrides: Partial<ReviewSchedule> = {}
): ReviewSchedule {
  return {
    schemaVersion: 1,
    questionId,
    reason: "low-score",
    priority: 80,
    nextReviewAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

const questions: Question[] = [
  createQuestion({
    id: "typescript-structural-typing",
    category: "TypeScript",
    topic: "类型系统"
  }),
  createQuestion({
    id: "javascript-event-loop",
    title: "描述 JavaScript 事件循环",
    category: "JavaScript",
    topic: "运行时",
    tags: ["javascript"],
    question: "任务队列和微任务队列如何协作？"
  })
];

describe("mapReviewViewModel", () => {
  test("summarizes database-backed progress and due review schedules", () => {
    expect(
      mapReviewViewModel(
        questions,
        [
          createProgress("typescript-structural-typing", {
            attempts: 2,
            latestScore: 4,
            bestScore: 7,
            wrongAttempts: 1,
            status: "weak",
            lastPracticedAt: "2026-06-22T03:00:00.000Z"
          }),
          createProgress("javascript-event-loop", {
            latestScore: 8,
            bestScore: 8,
            status: "mastered",
            lastPracticedAt: "2026-06-22T04:00:00.000Z"
          })
        ],
        [
          createSchedule("typescript-structural-typing", {
            reason: "wrong",
            priority: 100,
            nextReviewAt: "2026-06-22T03:00:00.000Z"
          }),
          createSchedule("javascript-event-loop", {
            reason: "stale",
            priority: 20,
            nextReviewAt: "2026-06-29T04:00:00.000Z"
          })
        ],
        new Date("2026-06-22T05:00:00.000Z")
      )
    ).toEqual({
      stats: [
        { id: "practiced", label: "已练题数", value: "2" },
        { id: "attempts", label: "总作答", value: "3" },
        { id: "due-review", label: "待复习", value: "1" },
        { id: "weak", label: "弱项题", value: "1" }
      ],
      reviewQueue: [
        {
          id: "typescript-structural-typing",
          title: "解释 TypeScript 结构化类型系统",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / 类型系统",
          reasonLabel: "错题",
          nextReviewAtLabel: "2026-06-22 03:00",
          priorityLabel: "100"
        }
      ],
      weakQuestions: [
        {
          id: "typescript-structural-typing",
          title: "解释 TypeScript 结构化类型系统",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / 类型系统"
        }
      ],
      lowScoreQuestions: [
        {
          id: "typescript-structural-typing",
          title: "解释 TypeScript 结构化类型系统",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / 类型系统"
        }
      ],
      recentRecords: [
        {
          id: "javascript-event-loop",
          title: "描述 JavaScript 事件循环",
          to: "/questions/javascript-event-loop",
          latestScoreLabel: "8.0/10",
          meta: "JavaScript / 运行时",
          practicedAtLabel: "2026-06-22 04:00"
        },
        {
          id: "typescript-structural-typing",
          title: "解释 TypeScript 结构化类型系统",
          to: "/questions/typescript-structural-typing",
          latestScoreLabel: "4.0/10",
          meta: "TypeScript / 类型系统",
          practicedAtLabel: "2026-06-22 03:00"
        }
      ]
    });
  });
});
