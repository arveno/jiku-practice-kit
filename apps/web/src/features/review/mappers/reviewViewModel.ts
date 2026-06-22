import type { Question, QuestionProgress, ReviewSchedule } from "@jiku/contracts";

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

type ReviewQueueItemViewModel = ReviewQuestionItemViewModel & {
  reasonLabel: string;
  nextReviewAtLabel: string;
  priorityLabel: string;
};

type ReviewRecordViewModel = ReviewQuestionItemViewModel & {
  practicedAtLabel: string;
};

type ReviewViewModel = {
  stats: ReviewStatViewModel[];
  reviewQueue: ReviewQueueItemViewModel[];
  weakQuestions: ReviewQuestionItemViewModel[];
  lowScoreQuestions: ReviewQuestionItemViewModel[];
  recentRecords: ReviewRecordViewModel[];
};

type PracticedQuestion = {
  question: Question;
  progress: QuestionProgress;
};

const reasonLabels: Record<ReviewSchedule["reason"], string> = {
  wrong: "错题",
  "low-score": "低分",
  stale: "久未练习"
};

function formatScore(score: number) {
  return `${score.toFixed(1)}/10`;
}

function formatTimestamp(timestamp: string) {
  return timestamp.slice(0, 16).replace("T", " ");
}

function toQuestionItem({
  question,
  progress
}: PracticedQuestion): ReviewQuestionItemViewModel {
  return {
    id: question.id,
    title: question.title,
    to: `/questions/${question.id}`,
    latestScoreLabel: formatScore(progress.latestScore),
    meta: `${question.category} / ${question.topic}`
  };
}

export function mapReviewViewModel(
  questions: Question[],
  progressRecords: QuestionProgress[],
  reviewSchedules: ReviewSchedule[],
  now = new Date()
): ReviewViewModel {
  const questionsById = new Map(questions.map((question) => [question.id, question]));
  const progressByQuestionId = new Map(
    progressRecords.map((progress) => [progress.questionId, progress])
  );
  const practicedQuestions = progressRecords
    .map((progress) => ({
      question: questionsById.get(progress.questionId),
      progress
    }))
    .filter((item): item is PracticedQuestion => Boolean(item.question));
  const lowScoreQuestions = practicedQuestions.filter(
    ({ question, progress }) => progress.latestScore < question.scoring.passScore
  );
  const dueReviewSchedules = reviewSchedules
    .filter((schedule) => schedule.nextReviewAt <= now.toISOString())
    .sort(
      (left, right) =>
        right.priority - left.priority ||
        left.nextReviewAt.localeCompare(right.nextReviewAt)
    );

  return {
    stats: [
      { id: "practiced", label: "已练题数", value: String(progressRecords.length) },
      {
        id: "attempts",
        label: "总作答",
        value: String(
          progressRecords.reduce((total, progress) => total + progress.attempts, 0)
        )
      },
      { id: "due-review", label: "待复习", value: String(dueReviewSchedules.length) },
      {
        id: "weak",
        label: "弱项题",
        value: String(
          progressRecords.filter((progress) => progress.status === "weak").length
        )
      }
    ],
    reviewQueue: dueReviewSchedules
      .map((schedule) => {
        const question = questionsById.get(schedule.questionId);
        const progress = progressByQuestionId.get(schedule.questionId);

        if (!question || !progress) {
          return null;
        }

        return {
          ...toQuestionItem({ question, progress }),
          reasonLabel: reasonLabels[schedule.reason],
          nextReviewAtLabel: formatTimestamp(schedule.nextReviewAt),
          priorityLabel: String(schedule.priority)
        };
      })
      .filter((item): item is ReviewQueueItemViewModel => item !== null),
    weakQuestions: practicedQuestions
      .filter(({ progress }) => progress.status === "weak")
      .map(toQuestionItem),
    lowScoreQuestions: lowScoreQuestions.map(toQuestionItem),
    recentRecords: [...practicedQuestions]
      .sort((a, b) =>
        b.progress.lastPracticedAt.localeCompare(a.progress.lastPracticedAt)
      )
      .map((item) => ({
        ...toQuestionItem(item),
        practicedAtLabel: formatTimestamp(item.progress.lastPracticedAt)
      }))
  };
}
