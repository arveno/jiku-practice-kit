import { z } from "zod";

export const scoreStatusSchema = z.enum(["new", "learning", "weak", "mastered"]);

export const scoreRecordSchema = z
  .object({
    questionId: z.string().trim().min(1),
    latestScore: z.number().min(0).max(10),
    bestScore: z.number().min(0).max(10),
    attempts: z.number().int().min(1),
    status: scoreStatusSchema,
    weakPoints: z.array(z.string().trim().min(1)),
    lastFeedback: z.string(),
    lastPracticedAt: z.string().datetime()
  })
  .strict()
  .superRefine((record, context) => {
    if (record.bestScore < record.latestScore) {
      context.addIssue({
        code: "custom",
        message: "bestScore must be greater than or equal to latestScore",
        path: ["bestScore"]
      });
    }
  });

export const scorecardSchema = z
  .object({
    version: z.literal(1),
    updatedAt: z.string().datetime(),
    records: z.record(z.string().trim().min(1), scoreRecordSchema)
  })
  .strict()
  .superRefine((scorecard, context) => {
    for (const [recordId, record] of Object.entries(scorecard.records)) {
      if (record.questionId !== recordId) {
        context.addIssue({
          code: "custom",
          message: "record key must match questionId",
          path: ["records", recordId, "questionId"]
        });
      }
    }
  });

export type ScoreStatus = z.infer<typeof scoreStatusSchema>;
export type ScoreRecord = z.infer<typeof scoreRecordSchema>;
export type Scorecard = z.infer<typeof scorecardSchema>;

export function createEmptyScorecard(now = new Date()): Scorecard {
  return {
    version: 1,
    updatedAt: now.toISOString(),
    records: {}
  };
}

export function parseScorecard(input: unknown): Scorecard {
  return scorecardSchema.parse(input);
}
