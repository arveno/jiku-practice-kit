import { allQuestions } from "@jiku/content";

const ids = new Set<string>();
const failures: string[] = [];

for (const question of allQuestions) {
  if (ids.has(question.id)) {
    failures.push(`duplicate question id: ${question.id}`);
  }
  ids.add(question.id);

  if (question.accessLevel !== "free") {
    failures.push(`${question.id}: Phase 1 only allows free questions`);
  }

  if (question.tags.length === 0) {
    failures.push(`${question.id}: at least one tag is required`);
  }

  if (question.keyPoints.length === 0) {
    failures.push(`${question.id}: at least one key point is required`);
  }

  const dimensionTotal = question.scoring.dimensions.reduce(
    (total, dimension) => total + dimension.score,
    0
  );

  if (dimensionTotal !== question.scoring.totalScore) {
    failures.push(`${question.id}: scoring dimensions do not total totalScore`);
  }

  if (question.scoring.passScore > question.scoring.totalScore) {
    failures.push(`${question.id}: passScore exceeds totalScore`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exitCode = 1;
} else {
  console.log(`validated ${allQuestions.length} free questions`);
}
