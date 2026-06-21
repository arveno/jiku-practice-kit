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

export function saveScorecard(
  scorecard: Scorecard,
  storage: Storage = localStorage
): Scorecard {
  const parsedScorecard = parseScorecard(scorecard);
  storage.setItem(scorecardStorageKey, JSON.stringify(parsedScorecard));
  return parsedScorecard;
}

export function resetScorecard(
  storage: Storage = localStorage,
  now = new Date()
): Scorecard {
  const emptyScorecard = createEmptyScorecard(now);
  storage.setItem(scorecardStorageKey, JSON.stringify(emptyScorecard));
  return emptyScorecard;
}

export function importScorecard(
  input: unknown,
  storage: Storage = localStorage
): Scorecard {
  const scorecard = parseScorecard(input);
  storage.setItem(scorecardStorageKey, JSON.stringify(scorecard));
  return scorecard;
}
