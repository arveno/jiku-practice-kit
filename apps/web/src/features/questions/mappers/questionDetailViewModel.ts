import type { Question, ScoreRecord } from "@jiku/contracts";
import type { QuestionDetailViewModel } from "../models/questionDetailViewModel";
import { mapQuestionToViewModel } from "./questionViewModel";

function scoreLabel(score: number) {
  return `${score} 分`;
}

export function mapQuestionDetailToViewModel(
  question: Question,
  record?: ScoreRecord
): QuestionDetailViewModel {
  return {
    ...mapQuestionToViewModel(question, record),
    standardAnswer: question.standardAnswer,
    keyPoints: question.keyPoints.map((keyPoint) => ({
      text: keyPoint.text,
      weightLabel: scoreLabel(keyPoint.weight)
    })),
    followUps: question.followUps,
    commonMistakes: question.commonMistakes,
    scoring: {
      totalScoreLabel: `总分 ${question.scoring.totalScore}`,
      passScoreLabel: `通过 ${question.scoring.passScore}`,
      dimensions: question.scoring.dimensions.map((dimension) => ({
        name: dimension.name,
        scoreLabel: scoreLabel(dimension.score),
        description: dimension.description
      }))
    }
  };
}
