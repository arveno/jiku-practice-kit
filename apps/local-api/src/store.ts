import {
  access,
  appendFile,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  writeFile
} from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, relative } from "node:path";
import {
  localDatabaseManifestSchema,
  questionProgressSchema,
  studyAttemptSchema,
  studySessionSchema,
  type LocalDatabaseManifest,
  type QuestionProgress,
  type StudyAttempt,
  type StudySession
} from "@jiku/contracts";

export type LocalDatabaseStatus =
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

export type LocalDatabaseStore = ReturnType<typeof createLocalDatabaseStore>;

type StoreOptions = {
  root?: string;
  now?: () => Date;
};

const manifestFile = "manifest.json";

export function defaultLocalDataRoot() {
  return join(homedir(), ".jiku-practice-kit");
}

export function createLocalDatabaseStore(options: StoreOptions = {}) {
  const root = options.root ?? defaultLocalDataRoot();
  const now = options.now ?? (() => new Date());
  const databasePath = join(root, "database");
  const corruptedPath = join(root, "corrupted");

  function timestamp() {
    return now().toISOString();
  }

  function databaseFile(...segments: string[]) {
    return join(databasePath, ...segments);
  }

  async function ensureReady(): Promise<LocalDatabaseStatus> {
    try {
      await mkdir(databaseFile("sessions"), { recursive: true });
      await mkdir(databaseFile("attempts"), { recursive: true });
      await mkdir(databaseFile("question-progress"), { recursive: true });
      await mkdir(join(root, "derived"), { recursive: true });
      await mkdir(join(root, "backups"), { recursive: true });
      await mkdir(corruptedPath, { recursive: true });
      await ensureManifest();

      return {
        ok: true,
        root,
        databasePath,
        corruptedCount: await countCorruptedFiles()
      };
    } catch (error) {
      return {
        ok: false,
        root,
        databasePath,
        corruptedCount: await countCorruptedFiles(),
        error: error instanceof Error ? error.message : "unknown local database error"
      };
    }
  }

  async function ensureManifest() {
    const path = databaseFile(manifestFile);

    if (!(await fileExists(path))) {
      await writeJson(path, createManifest());
      return;
    }

    const manifest = await readJson(path, localDatabaseManifestSchema);
    if (manifest === null) {
      await writeJson(path, createManifest());
    }
  }

  function createManifest(): LocalDatabaseManifest {
    const nowTimestamp = timestamp();

    return {
      schemaVersion: 1,
      appContentVersion: "phase-2",
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp
    };
  }

  async function writeSession(session: StudySession) {
    const parsed = studySessionSchema.parse(session);
    await ensureReadyOrThrow();
    await writeJson(databaseFile("sessions", `${safeName(parsed.id)}.json`), parsed);
  }

  async function readSession(id: string) {
    await ensureReadyOrThrow();
    return readJson(
      databaseFile("sessions", `${safeName(id)}.json`),
      studySessionSchema
    );
  }

  async function readActiveSession() {
    await ensureReadyOrThrow();
    const sessions = await Promise.all(
      (await readdir(databaseFile("sessions")))
        .filter((file) => file.endsWith(".json"))
        .map((file) => readJson(databaseFile("sessions", file), studySessionSchema))
    );

    return (
      sessions
        .filter((session): session is StudySession => session?.status === "active")
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null
    );
  }

  async function appendAttempt(attempt: StudyAttempt) {
    const parsed = studyAttemptSchema.parse(attempt);
    await ensureReadyOrThrow();
    await appendFile(
      databaseFile("attempts", `${safeName(parsed.sessionId)}.jsonl`),
      `${JSON.stringify(parsed)}\n`,
      "utf8"
    );
  }

  async function writeQuestionProgress(progress: QuestionProgress) {
    const parsed = questionProgressSchema.parse(progress);
    await ensureReadyOrThrow();
    await writeJson(
      databaseFile("question-progress", `${safeName(parsed.questionId)}.json`),
      parsed
    );
  }

  async function readQuestionProgress(questionId: string) {
    await ensureReadyOrThrow();
    return readJson(
      databaseFile("question-progress", `${safeName(questionId)}.json`),
      questionProgressSchema
    );
  }

  async function ensureReadyOrThrow() {
    const status = await ensureReady();
    if (!status.ok) {
      throw new Error(status.error);
    }
  }

  async function writeJson(path: string, value: unknown) {
    await mkdir(dirname(path), { recursive: true });
    const temporaryPath = `${path}.tmp`;

    if (await fileExists(path)) {
      await backupFile(path);
    }

    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await rename(temporaryPath, path);
  }

  async function readJson<T>(path: string, schema: { parse(input: unknown): T }) {
    if (!(await fileExists(path))) {
      return null;
    }

    try {
      return schema.parse(JSON.parse(await readFile(path, "utf8")));
    } catch {
      await isolateCorruptFile(path);
      return null;
    }
  }

  async function backupFile(path: string) {
    const backupName = `${relative(root, path).replace(/[\\/]/g, "__")}.${Date.now()}`;
    await copyFile(path, join(root, "backups", backupName));
  }

  async function isolateCorruptFile(path: string) {
    const corruptName = `${relative(root, path).replace(/[\\/]/g, "__")}.${Date.now()}`;
    await rename(path, join(corruptedPath, corruptName));
  }

  async function countCorruptedFiles() {
    try {
      return (await readdir(corruptedPath)).length;
    } catch {
      return 0;
    }
  }

  return {
    root,
    databasePath,
    ensureReady,
    writeSession,
    readSession,
    readActiveSession,
    appendAttempt,
    writeQuestionProgress,
    readQuestionProgress
  };
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function safeName(value: string) {
  return encodeURIComponent(value);
}
