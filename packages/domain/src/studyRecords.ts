import type {
  Question,
  QuestionProgress,
  ReviewSchedule,
  StudyAssessment,
  StudyAttempt
} from "@jiku/contracts";

type CreateStudyAttemptInput = {
  sessionId: string;
  questionId: string;
  assessment: StudyAssessment;
};

const assessmentScores: Record<StudyAssessment, number> = {
  mastered: 10,
  partial: 7,
  unclear: 4,
  failed: 0
};

const assessmentStatuses: Record<StudyAssessment, QuestionProgress["status"]> = {
  mastered: "mastered",
  partial: "learning",
  unclear: "weak",
  failed: "weak"
};

export function createStudyAttempt(
  input: CreateStudyAttemptInput,
  now = new Date(),
  id = `attempt-${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`
): StudyAttempt {
  return {
    id,
    schemaVersion: 1,
    sessionId: input.sessionId,
    questionId: input.questionId,
    assessment: input.assessment,
    score: assessmentScores[input.assessment],
    answeredAt: now.toISOString()
  };
}

export function updateQuestionProgress(
  question: Question,
  attempt: StudyAttempt,
  previous?: QuestionProgress | null
): QuestionProgress {
  const isWrong = attempt.score < question.scoring.passScore;

  return {
    schemaVersion: 1,
    questionId: question.id,
    attempts: (previous?.attempts ?? 0) + 1,
    latestScore: attempt.score,
    bestScore: Math.max(previous?.bestScore ?? attempt.score, attempt.score),
    wrongAttempts: (previous?.wrongAttempts ?? 0) + (isWrong ? 1 : 0),
    status: assessmentStatuses[attempt.assessment],
    lastPracticedAt: attempt.answeredAt,
    updatedAt: attempt.answeredAt
  };
}

export function createReviewSchedule(
  question: Question,
  progress: QuestionProgress,
  now = new Date()
): ReviewSchedule {
  const timestamp = now.toISOString();

  if (progress.status === "weak") {
    return {
      schemaVersion: 1,
      questionId: question.id,
      reason: "wrong",
      priority: 100,
      nextReviewAt: timestamp,
      updatedAt: timestamp
    };
  }

  if (progress.latestScore < question.scoring.passScore) {
    return {
      schemaVersion: 1,
      questionId: question.id,
      reason: "low-score",
      priority: 80,
      nextReviewAt: timestamp,
      updatedAt: timestamp
    };
  }

  return {
    schemaVersion: 1,
    questionId: question.id,
    reason: "stale",
    priority: 20,
    nextReviewAt: addDays(now, 7).toISOString(),
    updatedAt: timestamp
  };
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
