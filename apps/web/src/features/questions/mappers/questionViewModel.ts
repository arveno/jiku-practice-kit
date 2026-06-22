import type {
  Difficulty,
  Frequency,
  Question,
  QuestionAccessLevel,
  ScoreRecord,
  ScoreStatus
} from "@jiku/contracts";
import type {
  QuestionFrequencyTagType,
  QuestionStatusTagType,
  QuestionViewModel
} from "../models/questionViewModel";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难"
};

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

const accessLevelLabels: Record<QuestionAccessLevel, string> = {
  free: "免费"
};

const statusLabels: Record<ScoreStatus, string> = {
  new: "新题",
  learning: "学习中",
  weak: "弱项",
  mastered: "已掌握"
};

const statusTagTypes: Record<ScoreStatus, QuestionStatusTagType> = {
  new: "default",
  learning: "warning",
  weak: "warning",
  mastered: "success"
};

function formatScore(score: number) {
  return `${score.toFixed(1)}/10`;
}

export function mapQuestionDifficultyLabel(difficulty: Difficulty) {
  return difficultyLabels[difficulty];
}

export function mapQuestionFrequencyLabel(frequency: Frequency) {
  return frequencyLabels[frequency];
}

export function mapQuestionAccessLevelLabel(accessLevel: QuestionAccessLevel) {
  return accessLevelLabels[accessLevel];
}

export function mapQuestionToViewModel(
  question: Question,
  record?: ScoreRecord
): QuestionViewModel {
  return {
    id: question.id,
    title: question.title,
    prompt: question.question,
    category: question.category,
    topic: question.topic,
    tagLabels: question.tags,
    difficultyLabel: mapQuestionDifficultyLabel(question.difficulty),
    frequencyLabel: mapQuestionFrequencyLabel(question.frequency),
    frequencyTagType: frequencyTagTypes[question.frequency],
    accessLevelLabel: mapQuestionAccessLevelLabel(question.accessLevel),
    latestScoreLabel: record ? formatScore(record.latestScore) : "未练习",
    bestScoreLabel: record ? formatScore(record.bestScore) : "未练习",
    attemptsLabel: `${record?.attempts ?? 0} 次`,
    statusLabel: record ? statusLabels[record.status] : "未练习",
    statusTagType: record ? statusTagTypes[record.status] : "default"
  };
}
