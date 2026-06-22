import { createEmptyScorecard, parseScorecard, type Scorecard } from "@jiku/contracts";

export const scorecardStorageKey = "jiku.scorecard.v1";

export function loadScorecard(
  storage: Storage = localStorage,
  now = new Date()
): Scorecard {
  const rawScorecard = storage.getItem(scorecardStorageKey);

  if (!rawScorecard) {
    return createEmptyScorecard(now);
  }

  try {
    return parseScorecard(JSON.parse(rawScorecard));
  } catch {
    storage.removeItem(scorecardStorageKey);
    return createEmptyScorecard(now);
  }
}
