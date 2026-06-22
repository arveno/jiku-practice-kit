import { studySessionSchema, type StudySession } from "@jiku/contracts";

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

export async function writeStudySession(
  session: StudySession,
  fetcher: LocalApiFetch = fetch
) {
  const parsedSession = studySessionSchema.parse(session);
  const response = await fetcher(
    `/api/sessions/${encodeURIComponent(parsedSession.id)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsedSession)
    }
  );

  if (!response.ok) {
    throw new Error("failed to write study session");
  }
}
