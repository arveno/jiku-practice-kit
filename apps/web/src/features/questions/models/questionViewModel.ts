export type QuestionFrequencyTagType = "default" | "success" | "warning";
export type QuestionStatusTagType = "default" | "success" | "warning";

export type QuestionViewModel = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  topic: string;
  tagLabels: string[];
  difficultyLabel: string;
  frequencyLabel: string;
  frequencyTagType: QuestionFrequencyTagType;
  accessLevelLabel: string;
  latestScoreLabel: string;
  bestScoreLabel: string;
  attemptsLabel: string;
  statusLabel: string;
  statusTagType: QuestionStatusTagType;
};
