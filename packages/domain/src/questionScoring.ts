import type { QuestionScoring } from "@jiku/contracts";

type PassingScoreInput = Pick<QuestionScoring, "passScore">;

export function isPassingScore(score: number, scoring: PassingScoreInput): boolean {
  return score >= scoring.passScore;
}
