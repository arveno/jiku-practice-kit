import { createEmptyScorecard, parseScorecard, type Scorecard } from "@jiku/contracts";

const storageKey = "jiku.scorecard.v1";

export function loadScorecard(storage: Storage = localStorage): Scorecard {
  const rawScorecard = storage.getItem(storageKey);

  if (!rawScorecard) {
    return createEmptyScorecard();
  }

  return parseScorecard(JSON.parse(rawScorecard));
}

export function saveScorecard(
  scorecard: Scorecard,
  storage: Storage = localStorage
): void {
  storage.setItem(storageKey, JSON.stringify(scorecard));
}
