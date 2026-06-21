import { parseQuestion } from "@jiku/contracts";
import { publicQuestions } from "./public/questions";

export const allQuestions = publicQuestions.map((question) => parseQuestion(question));

export function getQuestionById(questionId: string) {
  return allQuestions.find((question) => question.id === questionId);
}
