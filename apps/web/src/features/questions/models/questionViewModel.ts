export type QuestionFrequencyTagType = "default" | "success" | "warning";

export type QuestionViewModel = {
  id: string;
  title: string;
  prompt: string;
  categoryLabel: string;
  scoreLabel: string;
  tagLabels: string[];
  frequencyLabel: string;
  frequencyTagType: QuestionFrequencyTagType;
};
