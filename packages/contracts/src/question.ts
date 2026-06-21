import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export const frequencySchema = z.enum(["low", "medium", "high"]);
export const questionAccessLevelSchema = z.literal("free");

export const keyPointSchema = z
  .object({
    text: z.string().trim().min(1),
    weight: z.number().int().positive()
  })
  .strict();

export const scoringDimensionSchema = z
  .object({
    name: z.string().trim().min(1),
    score: z.number().int().positive(),
    description: z.string().trim().min(1)
  })
  .strict();

export const scoringSchema = z
  .object({
    totalScore: z.number().int().positive(),
    passScore: z.number().int().positive(),
    dimensions: z.array(scoringDimensionSchema).min(1)
  })
  .strict()
  .superRefine((scoring, context) => {
    const dimensionTotal = scoring.dimensions.reduce(
      (total, dimension) => total + dimension.score,
      0
    );

    if (scoring.totalScore !== dimensionTotal) {
      context.addIssue({
        code: "custom",
        message: "totalScore must equal the sum of dimension scores",
        path: ["totalScore"]
      });
    }

    if (scoring.passScore > scoring.totalScore) {
      context.addIssue({
        code: "custom",
        message: "passScore must be less than or equal to totalScore",
        path: ["passScore"]
      });
    }
  });

export const questionSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1),
    category: z.string().trim().min(1),
    topic: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    difficulty: difficultySchema,
    frequency: frequencySchema,
    accessLevel: questionAccessLevelSchema,
    products: z.array(z.string().trim().min(1)).min(1),
    question: z.string().trim().min(1),
    standardAnswer: z.string().trim().min(1),
    keyPoints: z.array(keyPointSchema).min(1),
    followUps: z.array(z.string().trim().min(1)),
    commonMistakes: z.array(z.string().trim().min(1)),
    scoring: scoringSchema
  })
  .strict();

export type Difficulty = z.infer<typeof difficultySchema>;
export type Frequency = z.infer<typeof frequencySchema>;
export type QuestionAccessLevel = z.infer<typeof questionAccessLevelSchema>;
export type KeyPoint = z.infer<typeof keyPointSchema>;
export type ScoringDimension = z.infer<typeof scoringDimensionSchema>;
export type QuestionScoring = z.infer<typeof scoringSchema>;
export type Question = z.infer<typeof questionSchema>;

export function parseQuestion(input: unknown): Question {
  return questionSchema.parse(input);
}
