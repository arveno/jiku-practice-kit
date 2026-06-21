import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { allQuestions } from "@jiku/content";

const root = process.cwd();
const failures: string[] = [];

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

function readJsonFile(path: string) {
  return JSON.parse(readProjectFile(path)) as {
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

const files = Array.from(
  new Set([
    ...gitFiles(["ls-files"]),
    ...gitFiles(["ls-files", "--others", "--exclude-standard"])
  ])
);

for (const file of files) {
  if (
    file.startsWith(".local/") ||
    file.startsWith("private/") ||
    file.startsWith("packages/content/src/private/") ||
    file.startsWith("src/content/questions/private/") ||
    file.endsWith(".local.json") ||
    file.endsWith(".local.md") ||
    file.endsWith(".tsbuildinfo")
  ) {
    failures.push(`forbidden generated/private/local file is visible to git: ${file}`);
  }

  if (file.endsWith("package.json")) {
    const packageJson = readJsonFile(file);

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

  if (file.startsWith("apps/web/src/") && isTypeScriptOrVue(file)) {
    const content = readProjectFile(file);

    if (content.includes("localStorage") && !file.startsWith("apps/web/src/storage/")) {
      failures.push(`localStorage access must stay in apps/web/src/storage: ${file}`);
    }

    if (/\b(type|interface)\s+Question\b/.test(content)) {
      failures.push(`Question type must come from @jiku/contracts: ${file}`);
    }

    if (/categories\s*=\s*\[/.test(content) || /topics\s*=\s*\[/.test(content)) {
      failures.push(`filters must derive category/topic values from data: ${file}`);
    }
  }

  if (file.startsWith("packages/content/src/") && isTypeScriptOrVue(file)) {
    const content = readProjectFile(file);

    if (/\b(type|interface)\s+Question\b/.test(content)) {
      failures.push(`content must import Question from @jiku/contracts: ${file}`);
    }

    if (/questionSchema\s*=\s*z\.object/.test(content)) {
      failures.push(
        `question schema must only be defined in packages/contracts: ${file}`
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

for (const question of allQuestions) {
  if (question.accessLevel !== "free") {
    failures.push(`Phase 1 content must be free only: ${question.id}`);
  }
}

const distPath = join(root, "apps/web/dist");
if (existsSync(distPath)) {
  for (const file of listFilesRecursively(distPath)) {
    const content = readFileSync(file, "utf8");

    if (
      content.includes("packages/content/src/private") ||
      content.includes("src/content/questions/private")
    ) {
      failures.push(`build output references private content path: ${file}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exitCode = 1;
} else {
  console.log("architecture guard passed");
}
