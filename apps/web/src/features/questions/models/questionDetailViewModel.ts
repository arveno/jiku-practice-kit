import type { QuestionViewModel } from "./questionViewModel";

export type QuestionDetailViewModel = QuestionViewModel & {
  standardAnswer: string;
  keyPoints: {
    text: string;
    weightLabel: string;
  }[];
  followUps: string[];
  commonMistakes: string[];
  scoring: {
    totalScoreLabel: string;
    passScoreLabel: string;
    dimensions: {
      name: string;
      scoreLabel: string;
      description: string;
    }[];
  };
};
