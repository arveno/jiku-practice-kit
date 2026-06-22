import {
  questionProgressSchema,
  reviewScheduleSchema,
  studyAttemptSchema,
  studySessionSchema,
  type QuestionProgress,
  type ReviewSchedule,
  type StudyAttempt,
  type StudySession
} from "@jiku/contracts";

export type LocalApiStatus =
  | {
      state: "connected";
      root: string;
      databasePath: string;
      corruptedCount: number;
    }
  | {
      state: "unwritable";
      root: string;
      databasePath: string;
      corruptedCount: number;
      message: string;
    }
  | {
      state: "unavailable";
      message: string;
    };

type LocalDatabaseStatusResponse =
  | {
      ok: true;
      root: string;
      databasePath: string;
      corruptedCount: number;
    }
  | {
      ok: false;
      root: string;
      databasePath: string;
      corruptedCount: number;
      error: string;
    };

type LocalDatabaseSummaryResponse = LocalDatabaseStatusResponse & {
  activeSession: unknown;
  totalAttempts: number;
  questionProgressCount: number;
  reviewScheduleCount: number;
};

export type LocalDatabaseSummary = LocalApiStatus & {
  activeSession: StudySession | null;
  totalAttempts: number;
  questionProgressCount: number;
  reviewScheduleCount: number;
};

export type LocalApiFetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

export async function readLocalApiStatus(
  fetcher: LocalApiFetch = fetch
): Promise<LocalApiStatus> {
  try {
    const response = await fetcher("/api/database/status", {
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        state: "unavailable",
        message: "本地服务未连接"
      };
    }

    const status = (await response.json()) as LocalDatabaseStatusResponse;
    if (status.ok) {
      return {
        state: "connected",
        root: status.root,
        databasePath: status.databasePath,
        corruptedCount: status.corruptedCount
      };
    }

    return {
      state: "unwritable",
      root: status.root,
      databasePath: status.databasePath,
      corruptedCount: status.corruptedCount,
      message: status.error
    };
  } catch {
    return {
      state: "unavailable",
      message: "本地服务未连接"
    };
  }
}

export async function readDatabaseSummary(
  fetcher: LocalApiFetch = fetch
): Promise<LocalDatabaseSummary> {
  try {
    const response = await fetcher("/api/database/summary", {
      cache: "no-store"
    });

    if (!response.ok) {
      return unavailableSummary();
    }

    const summary = (await response.json()) as LocalDatabaseSummaryResponse;
    const activeSession =
      summary.activeSession === null
        ? null
        : studySessionSchema.parse(summary.activeSession);

    if (summary.ok) {
      return {
        state: "connected",
        root: summary.root,
        databasePath: summary.databasePath,
        corruptedCount: summary.corruptedCount,
        activeSession,
        totalAttempts: summary.totalAttempts,
        questionProgressCount: summary.questionProgressCount,
        reviewScheduleCount: summary.reviewScheduleCount
      };
    }

    return {
      state: "unwritable",
      root: summary.root,
      databasePath: summary.databasePath,
      corruptedCount: summary.corruptedCount,
      message: summary.error,
      activeSession,
      totalAttempts: summary.totalAttempts,
      questionProgressCount: summary.questionProgressCount,
      reviewScheduleCount: summary.reviewScheduleCount
    };
  } catch {
    return unavailableSummary();
  }
}

export async function readActiveStudySession(
  fetcher: LocalApiFetch = fetch
): Promise<StudySession | null> {
  const response = await fetcher("/api/sessions/active", {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return studySessionSchema.parse(await response.json());
}

export async function writeStudyAttempt(
  attempt: StudyAttempt,
  fetcher: LocalApiFetch = fetch
) {
  await writeJson("/api/attempts", studyAttemptSchema.parse(attempt), fetcher, "POST");
}

export async function readQuestionProgress(
  questionId: string,
  fetcher: LocalApiFetch = fetch
): Promise<QuestionProgress | null> {
  const response = await fetcher(
    `/api/question-progress/${encodeURIComponent(questionId)}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return null;
  }

  return questionProgressSchema.parse(await response.json());
}

export async function readQuestionProgressList(fetcher: LocalApiFetch = fetch) {
  const response = await fetcher("/api/question-progress", {
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  return questionProgressSchema.array().parse(await response.json());
}

export async function writeQuestionProgress(
  progress: QuestionProgress,
  fetcher: LocalApiFetch = fetch
) {
  const parsedProgress = questionProgressSchema.parse(progress);
  await writeJson(
    `/api/question-progress/${encodeURIComponent(parsedProgress.questionId)}`,
    parsedProgress,
    fetcher,
    "PUT"
  );
}

export async function readReviewSchedules(fetcher: LocalApiFetch = fetch) {
  const response = await fetcher("/api/review-schedules", {
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  return reviewScheduleSchema.array().parse(await response.json());
}

export async function writeReviewSchedule(
  schedule: ReviewSchedule,
  fetcher: LocalApiFetch = fetch
) {
  const parsedSchedule = reviewScheduleSchema.parse(schedule);
  await writeJson(
    `/api/review-schedules/${encodeURIComponent(parsedSchedule.questionId)}`,
    parsedSchedule,
    fetcher,
    "PUT"
  );
}

export async function writeStudySession(
  session: StudySession,
  fetcher: LocalApiFetch = fetch
) {
  const parsedSession = studySessionSchema.parse(session);
  await writeJson(
    `/api/sessions/${encodeURIComponent(parsedSession.id)}`,
    parsedSession,
    fetcher,
    "PUT"
  );
}

async function writeJson(
  path: string,
  value: unknown,
  fetcher: LocalApiFetch,
  method: "POST" | "PUT"
) {
  const response = await fetcher(path, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(value)
  });
  if (!response.ok) {
    throw new Error("failed to write local database record");
  }
}

function unavailableSummary(): LocalDatabaseSummary {
  return {
    state: "unavailable",
    message: "本地服务未连接",
    activeSession: null,
    totalAttempts: 0,
    questionProgressCount: 0,
    reviewScheduleCount: 0
  };
}
