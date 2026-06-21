import { describe, expect, it } from "vitest";
import { questionSchema } from "./question";

const validQuestion = {
  id: "typescript-basic-types",
  title: "Explain TypeScript basic types.",
  category: "TypeScript",
  topic: "Types",
  tags: ["typescript", "types"],
  difficulty: "easy",
  frequency: "high",
  accessLevel: "free",
  products: ["web"],
  question: "What are primitive types in TypeScript?",
  standardAnswer: "TypeScript includes string, number, boolean, null, and undefined.",
  keyPoints: [{ text: "Names core primitive types", weight: 5 }],
  followUps: ["How does unknown differ from any?"],
  commonMistakes: ["Treating any as type safety."],
  scoring: {
    totalScore: 10,
    passScore: 6,
    dimensions: [
      { name: "Coverage", score: 5, description: "Mentions primitive types." },
      { name: "Clarity", score: 5, description: "Explains with examples." }
    ]
  }
};

describe("questionSchema", () => {
  it("accepts a complete free question", () => {
    expect(questionSchema.parse(validQuestion).id).toBe("typescript-basic-types");
  });

  it("rejects non-free content in phase 1", () => {
    expect(() =>
      questionSchema.parse({ ...validQuestion, accessLevel: "vip" })
    ).toThrow();
  });

  it("requires scoring total to match dimension scores", () => {
    expect(() =>
      questionSchema.parse({
        ...validQuestion,
        scoring: {
          ...validQuestion.scoring,
          totalScore: 11
        }
      })
    ).toThrow();
  });
});
