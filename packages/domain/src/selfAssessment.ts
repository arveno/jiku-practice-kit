import type { ScoreStatus, Scorecard } from "@jiku/contracts";

export type SelfAssessment = "mastered" | "partial" | "unclear" | "failed";

type ApplySelfAssessmentInput = {
  questionId: string;
  assessment: SelfAssessment;
};

const assessmentScores: Record<SelfAssessment, number> = {
  mastered: 10,
  partial: 7,
  unclear: 4,
  failed: 0
};

const assessmentStatuses: Record<SelfAssessment, ScoreStatus> = {
  mastered: "mastered",
  partial: "learning",
  unclear: "weak",
  failed: "weak"
};

export function applySelfAssessment(
  scorecard: Scorecard,
  input: ApplySelfAssessmentInput,
  now = new Date()
): Scorecard {
  const timestamp = now.toISOString();
  const previous = scorecard.records[input.questionId];
  const latestScore = assessmentScores[input.assessment];

  return {
    ...scorecard,
    updatedAt: timestamp,
    records: {
      ...scorecard.records,
      [input.questionId]: {
        questionId: input.questionId,
        latestScore,
        bestScore: Math.max(previous?.bestScore ?? latestScore, latestScore),
        attempts: (previous?.attempts ?? 0) + 1,
        status: assessmentStatuses[input.assessment],
        weakPoints: previous?.weakPoints ?? [],
        lastFeedback: input.assessment,
        lastPracticedAt: timestamp
      }
    }
  };
}
