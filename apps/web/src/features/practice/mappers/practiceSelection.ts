import type { Question, Scorecard } from "@jiku/contracts";

export type PracticeScope =
  | "random"
  | "category"
  | "topic"
  | "tag"
  | "high-frequency"
  | "weak"
  | "unpracticed"
  | "low-score";

type PracticeSelectionInput = {
  scope: PracticeScope;
  value?: string;
  count: number;
  random?: () => number;
};

function shuffled<T>(items: T[], random: () => number) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const currentItem = nextItems[index];
    const swapItem = nextItems[swapIndex];

    if (currentItem !== undefined && swapItem !== undefined) {
      [nextItems[index], nextItems[swapIndex]] = [swapItem, currentItem];
    }
  }

  return nextItems;
}

function matchesScope(
  question: Question,
  scorecard: Scorecard,
  input: PracticeSelectionInput
) {
  const record = scorecard.records[question.id];

  switch (input.scope) {
    case "category":
      return question.category === input.value;
    case "topic":
      return question.topic === input.value;
    case "tag":
      return input.value ? question.tags.includes(input.value) : false;
    case "high-frequency":
      return question.frequency === "high";
    case "weak":
      return record?.status === "weak";
    case "unpracticed":
      return !record;
    case "low-score":
      return record ? record.latestScore < question.scoring.passScore : false;
    case "random":
      return true;
  }
}

export function selectPracticeQuestions(
  questions: Question[],
  scorecard: Scorecard,
  input: PracticeSelectionInput
): Question[] {
  const candidates = questions.filter((question) =>
    matchesScope(question, scorecard, input)
  );
  const orderedCandidates =
    input.scope === "random"
      ? shuffled(candidates, input.random ?? Math.random)
      : candidates;

  return orderedCandidates.slice(0, Math.max(0, input.count));
}
