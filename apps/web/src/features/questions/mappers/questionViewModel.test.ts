import { describe, expect, test } from "vitest";
import type { Question } from "@jiku/contracts";
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
    expect(mapQuestionToViewModel(question)).toEqual({
      id: "typescript-structural-typing",
      title: "Explain TypeScript structural typing.",
      prompt: "Why does TypeScript use structural typing?",
      categoryLabel: "TypeScript / Type System",
      scoreLabel: "6/10",
      tagLabels: ["typescript", "type-system"],
      frequencyLabel: "高频",
      frequencyTagType: "success"
    });
  });
});
