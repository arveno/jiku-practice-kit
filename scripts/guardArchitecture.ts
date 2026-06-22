import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { allQuestions } from "@jiku/content";

const root = process.cwd();
const scorecardStorageBoundary = "apps/web/src/features/scorecard/storage.ts";

export type ProjectFile = {
  path: string;
  content?: string;
};

type GuardQuestion = {
  id: string;
  accessLevel: string;
};

function gitFiles(args: string[]) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" })
      .split("\n")
      .map((file) => file.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function readProjectFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function isTypeScriptOrVue(file: string) {
  return file.endsWith(".ts") || file.endsWith(".vue");
}

function isTextContentFile(file: string) {
  return /\.(?:cjs|js|json|md|mjs|ts|tsx|vue)$/.test(file);
}

function isPaidAnswerScanTarget(file: string) {
  return (
    isTextContentFile(file) &&
    !file.startsWith("docs/") &&
    !file.startsWith("scripts/") &&
    !file.endsWith(".test.ts")
  );
}

function isScorecardDataFile(file: string) {
  const segments = file.split("/");
  const basename = segments[segments.length - 1] ?? file;

  return (
    file.startsWith("scorecards/") ||
    /^scorecard\.(?:json|md)$/.test(basename) ||
    /\.scorecard\.(?:json|md)$/.test(basename)
  );
}

function isLocalDatabaseFile(file: string) {
  return (
    file.startsWith(".jiku-practice-kit/") ||
    file.startsWith("jiku-study-data/") ||
    file.startsWith("database/sessions/") ||
    file.startsWith("database/attempts/") ||
    file.startsWith("database/question-progress/") ||
    file.startsWith("database/review-schedules/")
  );
}

function containsPaidAnswerLeak(content: string) {
  return (
    /\b(?:paid|vip|premium)(?:Answer|_answer)\b/i.test(content) ||
    /["']?accessLevel["']?\s*:\s*["'](?:paid|vip|premium)["']/.test(content)
  );
}

function referencesForbiddenPrivateLocalPath(content: string) {
  return (
    content.includes(".local/") ||
    content.includes("private/") ||
    content.includes("packages/content/src/private") ||
    content.includes("src/content/questions/private")
  );
}

function referencesScorecardData(content: string) {
  return (
    /(?:^|["'`/])scorecards\//.test(content) ||
    /(?:^|["'`/])(?:[^"'`/]*\.)?scorecard\.(?:json|md)\b/.test(content)
  );
}

function referencesLocalDatabaseData(content: string) {
  return (
    content.includes(".jiku-practice-kit/") ||
    content.includes("jiku-study-data/") ||
    /(?:^|["'`/])database\/(?:sessions|attempts|question-progress|review-schedules)\//.test(
      content
    )
  );
}

function parsePackageJson(content: string) {
  return JSON.parse(content) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

function listFilesRecursively(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory);
  const result: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      result.push(...listFilesRecursively(path));
    } else {
      result.push(path);
    }
  }

  return result;
}

function fileContent(file: ProjectFile) {
  return file.content ?? readProjectFile(file.path);
}

function isAppSource(file: string) {
  return /^apps\/(web|api|miniapp)\/src\//.test(file);
}

function isWebUiFile(file: string) {
  return /^apps\/web\/src\/(pages|features|shared\/ui)\//.test(file);
}

export function findArchitectureFailures(
  projectFiles: ProjectFile[],
  questions: GuardQuestion[] = allQuestions,
  distFiles: ProjectFile[] = []
) {
  const failures: string[] = [];

  for (const projectFile of projectFiles) {
    const file = projectFile.path;

    if (
      file.startsWith(".local/") ||
      file.startsWith("private/") ||
      file.startsWith("packages/content/src/private/") ||
      file.startsWith("src/content/questions/private/") ||
      file.endsWith(".local.json") ||
      file.endsWith(".local.md") ||
      file.endsWith(".tsbuildinfo")
    ) {
      failures.push(
        `forbidden generated/private/local file is visible to git: ${file}`
      );
    }

    if (isScorecardDataFile(file)) {
      failures.push(`scorecard data file must stay out of git-visible files: ${file}`);
    }

    if (isLocalDatabaseFile(file)) {
      failures.push(`local database file must stay out of git-visible files: ${file}`);
    }

    if (
      isPaidAnswerScanTarget(file) &&
      containsPaidAnswerLeak(fileContent(projectFile))
    ) {
      failures.push(`paid answer content must stay out of git-visible files: ${file}`);
    }

    if (file.endsWith("package.json")) {
      const packageJson = parsePackageJson(fileContent(projectFile));

      for (const dependencyBlock of [
        packageJson.dependencies ?? {},
        packageJson.devDependencies ?? {}
      ]) {
        for (const [name, version] of Object.entries(dependencyBlock)) {
          if (version === "latest") {
            failures.push(
              `pin dependency versions instead of using latest: ${file} ${name}`
            );
          }
        }
      }
    }

    if (isAppSource(file) && isTypeScriptOrVue(file)) {
      const content = fileContent(projectFile);

      if (content.includes("localStorage") && file !== scorecardStorageBoundary) {
        failures.push(
          `localStorage access must stay in ${scorecardStorageBoundary}: ${file}`
        );
      }

      if (/^\s*(?:export\s+)?(?:type|interface)\s+Question\b/m.test(content)) {
        failures.push(`Question type must come from @jiku/contracts: ${file}`);
      }

      if (/^\s*(?:export\s+)?(?:type|interface)\s+Scorecard\b/m.test(content)) {
        failures.push(`Scorecard type must come from @jiku/contracts: ${file}`);
      }

      if (/questionSchema\s*=\s*z\.object/.test(content)) {
        failures.push(
          `question schema must only be defined in packages/contracts: ${file}`
        );
      }

      if (/scorecardSchema\s*=\s*z\.object/.test(content)) {
        failures.push(
          `scorecard schema must only be defined in packages/contracts: ${file}`
        );
      }
    }

    if (file.startsWith("apps/web/src/") && isTypeScriptOrVue(file)) {
      const content = fileContent(projectFile);

      if (
        /categories\s*=\s*\[/.test(content) ||
        /topics\s*=\s*\[/.test(content) ||
        /tags\s*=\s*\[/.test(content)
      ) {
        failures.push(
          `filters must derive category/topic/tag values from data: ${file}`
        );
      }

      if (isWebUiFile(file) && /\bQuestionDto\b/.test(content)) {
        failures.push(`QuestionDto must stay out of page components: ${file}`);
      }
    }

    if (
      /^apps\/web\/src\/(components|stores|mappers|models)\//.test(file) &&
      !file.startsWith("node_modules/")
    ) {
      failures.push(
        `web source must use feature-first structure instead of horizontal buckets: ${file}`
      );
    }

    if (file.startsWith("apps/web/src/storage/")) {
      failures.push(
        `web source must use feature-first storage instead of apps/web/src/storage: ${file}`
      );
    }

    if (file.startsWith("packages/content/src/") && isTypeScriptOrVue(file)) {
      const content = fileContent(projectFile);

      if (/^\s*(?:export\s+)?(?:type|interface)\s+Question\b/m.test(content)) {
        failures.push(`content must import Question from @jiku/contracts: ${file}`);
      }

      if (/questionSchema\s*=\s*z\.object/.test(content)) {
        failures.push(
          `question schema must only be defined in packages/contracts: ${file}`
        );
      }

      if (/scorecardSchema\s*=\s*z\.object/.test(content)) {
        failures.push(
          `scorecard schema must only be defined in packages/contracts: ${file}`
        );
      }
    }

    if (file.startsWith("packages/domain/src/") && isTypeScriptOrVue(file)) {
      const content = fileContent(projectFile);

      if (
        /from\s+["'](vue|naive-ui|vue-router)["']/.test(content) ||
        content.includes("localStorage")
      ) {
        failures.push(
          `packages/domain must stay pure and not depend on UI/router/storage: ${file}`
        );
      }
    }

    if (
      (file.endsWith("/utils.ts") || file.includes("/common/")) &&
      !file.startsWith("node_modules/")
    ) {
      failures.push(`avoid common/utils dumping grounds: ${file}`);
    }
  }

  for (const question of questions) {
    if (question.accessLevel !== "free") {
      failures.push(`question content must be free only: ${question.id}`);
    }
  }

  for (const file of distFiles) {
    const content = fileContent(file);
    if (referencesForbiddenPrivateLocalPath(content)) {
      failures.push(
        `build output references forbidden private/local path: ${file.path}`
      );
      continue;
    }

    if (referencesScorecardData(content)) {
      failures.push(`build output references scorecard data: ${file.path}`);
    }

    if (referencesLocalDatabaseData(content)) {
      failures.push(`build output references local database data: ${file.path}`);
    }

    if (containsPaidAnswerLeak(content)) {
      failures.push(`build output references paid answer content: ${file.path}`);
    }
  }

  return failures;
}

function workspaceFiles(): ProjectFile[] {
  return Array.from(
    new Set([
      ...gitFiles(["ls-files"]),
      ...gitFiles(["ls-files", "--others", "--exclude-standard"])
    ])
  )
    .filter((path) => existsSync(join(root, path)))
    .map((path) => ({ path }));
}

function distFiles(): ProjectFile[] {
  const distPath = join(root, "apps/web/dist");

  if (!existsSync(distPath)) {
    return [];
  }

  return listFilesRecursively(distPath).map((path) => ({
    path,
    content: readFileSync(path, "utf8")
  }));
}

function runCli() {
  const failures = findArchitectureFailures(
    workspaceFiles(),
    allQuestions,
    distFiles()
  );

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure);
    }
    process.exitCode = 1;
    return;
  }

  console.log("architecture guard passed");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli();
}
