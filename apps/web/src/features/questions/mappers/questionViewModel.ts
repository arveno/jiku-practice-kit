import type { Frequency, Question } from "@jiku/contracts";
import type {
  QuestionFrequencyTagType,
  QuestionViewModel
} from "../models/questionViewModel";

const frequencyLabels: Record<Frequency, string> = {
  high: "高频",
  medium: "中频",
  low: "低频"
};

const frequencyTagTypes: Record<Frequency, QuestionFrequencyTagType> = {
  high: "success",
  medium: "warning",
  low: "default"
};

export function mapQuestionToViewModel(question: Question): QuestionViewModel {
  return {
    id: question.id,
    title: question.title,
    prompt: question.question,
    categoryLabel: `${question.category} / ${question.topic}`,
    scoreLabel: `${question.scoring.passScore}/${question.scoring.totalScore}`,
    tagLabels: question.tags,
    frequencyLabel: frequencyLabels[question.frequency],
    frequencyTagType: frequencyTagTypes[question.frequency]
  };
}
