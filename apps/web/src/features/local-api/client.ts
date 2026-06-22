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
