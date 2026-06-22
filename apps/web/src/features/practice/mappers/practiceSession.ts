import type { StudySession } from "@jiku/contracts";

export function createStudySession(
  questionIds: string[],
  now = new Date(),
  id = `session-${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`
): StudySession {
  const timestamp = now.toISOString();
  const uniqueQuestionIds = Array.from(new Set(questionIds));

  if (uniqueQuestionIds.length === 0) {
    throw new Error("study session requires at least one question");
  }

  return {
    id,
    schemaVersion: 1,
    status: "active",
    source: "question-filter",
    questionIds: uniqueQuestionIds,
    currentIndex: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function advanceStudySession(
  session: StudySession,
  currentIndex: number,
  now = new Date()
): StudySession {
  const boundedIndex = Math.min(Math.max(0, currentIndex), session.questionIds.length);

  return {
    ...session,
    status: boundedIndex >= session.questionIds.length ? "completed" : "active",
    currentIndex: boundedIndex,
    updatedAt: now.toISOString()
  };
}
