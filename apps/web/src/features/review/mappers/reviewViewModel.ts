import type { Question, ScoreRecord, Scorecard } from "@jiku/contracts";
import { getScorecardStats } from "@jiku/domain";

type ReviewStatViewModel = {
  id: string;
  label: string;
  value: string;
};

type ReviewQuestionItemViewModel = {
  id: string;
  title: string;
  to: string;
  latestScoreLabel: string;
  meta: string;
};

type ReviewAverageViewModel = {
  id: string;
  label: string;
  value: string;
};

type ReviewRecordViewModel = ReviewQuestionItemViewModel & {
  practicedAtLabel: string;
};

type ReviewViewModel = {
  stats: ReviewStatViewModel[];
  weakQuestions: ReviewQuestionItemViewModel[];
  lowScoreQuestions: ReviewQuestionItemViewModel[];
  categoryAverages: ReviewAverageViewModel[];
  topicAverages: ReviewAverageViewModel[];
  recentRecords: ReviewRecordViewModel[];
};

type PracticedQuestion = {
  question: Question;
  record: ScoreRecord;
};

function formatScore(score: number) {
  return `${score.toFixed(1)}/10`;
}

function formatAverage(score: number) {
  return score.toFixed(1);
}

function formatPracticedAt(timestamp: string) {
  return timestamp.slice(0, 16).replace("T", " ");
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function toQuestionItem({
  question,
  record
}: PracticedQuestion): ReviewQuestionItemViewModel {
  return {
    id: question.id,
    title: question.title,
    to: `/questions/${question.id}`,
    latestScoreLabel: formatScore(record.latestScore),
    meta: `${question.category} / ${question.topic}`
  };
}

function averageBy(
  practicedQuestions: PracticedQuestion[],
  key: (question: Question) => string
) {
  const grouped = new Map<string, number[]>();

  for (const { question, record } of practicedQuestions) {
    const id = key(question);
    grouped.set(id, [...(grouped.get(id) ?? []), record.latestScore]);
  }

  return Array.from(grouped, ([id, scores]) => ({
    id,
    label: id,
    value: formatAverage(average(scores))
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function mapReviewViewModel(
  questions: Question[],
  scorecard: Scorecard
): ReviewViewModel {
  const stats = getScorecardStats(scorecard);
  const practicedQuestions = questions
    .map((question) => ({ question, record: scorecard.records[question.id] }))
    .filter((item): item is PracticedQuestion => Boolean(item.record));
  const lowScoreQuestions = practicedQuestions.filter(
    ({ question, record }) => record.latestScore < question.scoring.passScore
  );

  return {
    stats: [
      { id: "practiced", label: "已练题数", value: String(stats.practicedCount) },
      {
        id: "average",
        label: "平均分",
        value: formatAverage(stats.averageLatestScore)
      },
      { id: "weak", label: "弱项题", value: String(stats.weakCount) },
      { id: "low-score", label: "低分题", value: String(lowScoreQuestions.length) }
    ],
    weakQuestions: practicedQuestions
      .filter(({ record }) => record.status === "weak")
      .map(toQuestionItem),
    lowScoreQuestions: lowScoreQuestions.map(toQuestionItem),
    categoryAverages: averageBy(practicedQuestions, (question) => question.category),
    topicAverages: averageBy(practicedQuestions, (question) => question.topic),
    recentRecords: [...practicedQuestions]
      .sort((a, b) => b.record.lastPracticedAt.localeCompare(a.record.lastPracticedAt))
      .map((item) => ({
        ...toQuestionItem(item),
        practicedAtLabel: formatPracticedAt(item.record.lastPracticedAt)
      }))
  };
}
