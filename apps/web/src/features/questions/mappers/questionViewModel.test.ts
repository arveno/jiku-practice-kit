import { describe, expect, test } from "vitest";
import type { Question, ScoreRecord } from "@jiku/contracts";
import { mapQuestionToViewModel } from "./questionViewModel";

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
  keyPoints: [{ text: "Mentions shape-based compatibility", weight: 4 }],
  followUps: [],
  commonMistakes: [],
  scoring: {
    totalScore: 10,
    passScore: 6,
    dimensions: [{ name: "Concept", score: 10, description: "Explains the model." }]
  }
};

describe("mapQuestionToViewModel", () => {
  test("maps a contract question into UI-ready display fields", () => {
    const record: ScoreRecord = {
      questionId: "typescript-structural-typing",
      latestScore: 7.25,
      bestScore: 8,
      attempts: 3,
      status: "weak",
      weakPoints: ["Assignability"],
      lastFeedback: "Mention structural compatibility earlier.",
      lastPracticedAt: "2026-06-21T09:00:00.000Z"
    };

    expect(mapQuestionToViewModel(question, record)).toEqual({
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
      latestScoreLabel: "7.3/10",
      bestScoreLabel: "8.0/10",
      attemptsLabel: "3 次",
      statusLabel: "弱项",
      statusTagType: "warning"
    });
  });

  test("marks questions without score records as unpracticed", () => {
    expect(mapQuestionToViewModel(question)).toMatchObject({
      latestScoreLabel: "未练习",
      bestScoreLabel: "未练习",
      attemptsLabel: "0 次",
      statusLabel: "未练习",
      statusTagType: "default"
    });
  });
});
