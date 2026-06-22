import { z } from "zod";
import { scoreStatusSchema } from "./scorecard";

export const localDatabaseSchemaVersion = 1;

const schemaVersionSchema = z.literal(localDatabaseSchemaVersion);
const idSchema = z.string().trim().min(1);
const timestampSchema = z.string().datetime();
const scoreSchema = z.number().min(0).max(10);

export const localDatabaseManifestSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    appContentVersion: z.string().trim().min(1),
    createdAt: timestampSchema,
    updatedAt: timestampSchema
  })
  .strict();

export const studySessionStatusSchema = z.enum(["active", "completed"]);
export const studySessionSourceSchema = z.enum(["question-filter", "review"]);

export const studySessionSchema = z
  .object({
    id: idSchema,
    schemaVersion: schemaVersionSchema,
    status: studySessionStatusSchema,
    source: studySessionSourceSchema,
    questionIds: z.array(idSchema).min(1),
    currentIndex: z.number().int().min(0),
    createdAt: timestampSchema,
    updatedAt: timestampSchema
  })
  .strict()
  .superRefine((session, context) => {
    if (new Set(session.questionIds).size !== session.questionIds.length) {
      context.addIssue({
        code: "custom",
        message: "questionIds must be unique within a study session",
        path: ["questionIds"]
      });
    }

    if (
      (session.status === "active" &&
        session.currentIndex >= session.questionIds.length) ||
      (session.status === "completed" &&
        session.currentIndex > session.questionIds.length)
    ) {
      context.addIssue({
        code: "custom",
        message: "currentIndex must point inside the active session",
        path: ["currentIndex"]
      });
    }
  });

export const studyAssessmentSchema = z.enum([
  "mastered",
  "partial",
  "unclear",
  "failed"
]);

export const studyAttemptSchema = z
  .object({
    id: idSchema,
    schemaVersion: schemaVersionSchema,
    sessionId: idSchema,
    questionId: idSchema,
    assessment: studyAssessmentSchema,
    score: scoreSchema,
    answeredAt: timestampSchema
  })
  .strict();

export const questionProgressSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    questionId: idSchema,
    attempts: z.number().int().min(1),
    latestScore: scoreSchema,
    bestScore: scoreSchema,
    wrongAttempts: z.number().int().min(0),
    status: scoreStatusSchema,
    lastPracticedAt: timestampSchema,
    updatedAt: timestampSchema
  })
  .strict()
  .superRefine((progress, context) => {
    if (progress.bestScore < progress.latestScore) {
      context.addIssue({
        code: "custom",
        message: "bestScore must be greater than or equal to latestScore",
        path: ["bestScore"]
      });
    }

    if (progress.wrongAttempts > progress.attempts) {
      context.addIssue({
        code: "custom",
        message: "wrongAttempts must not exceed attempts",
        path: ["wrongAttempts"]
      });
    }
  });

export const reviewReasonSchema = z.enum(["wrong", "low-score", "stale"]);

export const reviewScheduleSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    questionId: idSchema,
    reason: reviewReasonSchema,
    priority: z.number().int().min(0).max(100),
    nextReviewAt: timestampSchema,
    updatedAt: timestampSchema
  })
  .strict();

export type LocalDatabaseManifest = z.infer<typeof localDatabaseManifestSchema>;
export type StudySessionStatus = z.infer<typeof studySessionStatusSchema>;
export type StudySessionSource = z.infer<typeof studySessionSourceSchema>;
export type StudySession = z.infer<typeof studySessionSchema>;
export type StudyAssessment = z.infer<typeof studyAssessmentSchema>;
export type StudyAttempt = z.infer<typeof studyAttemptSchema>;
export type QuestionProgress = z.infer<typeof questionProgressSchema>;
export type ReviewReason = z.infer<typeof reviewReasonSchema>;
export type ReviewSchedule = z.infer<typeof reviewScheduleSchema>;
