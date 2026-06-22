import { describe, expect, test } from "vitest";
import type { Question, ScoreRecord } from "@jiku/contracts";
import { mapQuestionDetailToViewModel } from "./questionDetailViewModel";

const question: Question = {
  id: "typescript-structural-typing",
  title: "Explain TypeScript structural typing.",
  category: "TypeScript",
  topic: "Type System",
  tags: ["typescript", "type-system"],
  difficulty: "medium",
  frequency: "high",
  accessLevel: "free",
  products: ["web"],
  question: "Why does TypeScript use structural typing?",
  standardAnswer: "TypeScript compares values by shape.",
  keyPoints: [
    { text: "Mentions shape-based compatibility", weight: 4 },
    { text: "Explains assignability", weight: 6 }
  ],
  followUps: ["When would nominal typing be useful?"],
  commonMistakes: ["Confusing structural typing with inheritance."],
  scoring: {
    totalScore: 10,
    passScore: 6,
    dimensions: [
      { name: "Concept", score: 4, description: "Defines structural typing." },
      { name: "Tradeoff", score: 6, description: "Explains JavaScript ergonomics." }
    ]
  }
};

const record: ScoreRecord = {
  questionId: "typescript-structural-typing",
  latestScore: 7,
  bestScore: 8.5,
  attempts: 2,
  status: "learning",
  weakPoints: ["Tradeoff"],
  lastFeedback: "Add tradeoff details.",
  lastPracticedAt: "2026-06-21T09:00:00.000Z"
};

describe("mapQuestionDetailToViewModel", () => {
  test("maps question answer and scoring details into display data", () => {
    expect(mapQuestionDetailToViewModel(question, record)).toEqual({
      id: "typescript-structural-typing",
      to: "/questions/typescript-structural-typing",
      title: "Explain TypeScript structural typing.",
      prompt: "Why does TypeScript use structural typing?",
      category: "TypeScript",
      topic: "Type System",
      tagLabels: ["typescript", "type-system"],
      difficultyLabel: "中等",
      frequencyLabel: "高频",
      frequencyTagType: "success",
      accessLevelLabel: "免费",
      latestScoreLabel: "7.0/10",
      bestScoreLabel: "8.5/10",
      attemptsLabel: "2 次",
      statusLabel: "学习中",
      statusTagType: "warning",
      standardAnswer: "TypeScript compares values by shape.",
      keyPoints: [
        { text: "Mentions shape-based compatibility", weightLabel: "4 分" },
        { text: "Explains assignability", weightLabel: "6 分" }
      ],
      followUps: ["When would nominal typing be useful?"],
      commonMistakes: ["Confusing structural typing with inheritance."],
      scoring: {
        totalScoreLabel: "总分 10",
        passScoreLabel: "通过 6",
        dimensions: [
          {
            name: "Concept",
            scoreLabel: "4 分",
            description: "Defines structural typing."
          },
          {
            name: "Tradeoff",
            scoreLabel: "6 分",
            description: "Explains JavaScript ergonomics."
          }
        ]
      }
    });
  });
});
