import { describe, expect, test } from "vitest";
import { createEmptyScorecard, type Scorecard } from "@jiku/contracts";
import {
  importScorecard,
  loadScorecard,
  resetScorecard,
  saveScorecard,
  scorecardStorageKey
} from "./storage";

const timestamp = "2026-01-01T00:00:00.000Z";

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

function createPracticedScorecard(): Scorecard {
  return {
    version: 1,
    updatedAt: timestamp,
    records: {
      "typescript-structural-typing": {
        questionId: "typescript-structural-typing",
        latestScore: 6,
        bestScore: 8,
        attempts: 1,
        status: "learning",
        weakPoints: [],
        lastFeedback: "",
        lastPracticedAt: timestamp
      }
    }
  };
}

describe("scorecard storage", () => {
  test("loads an empty scorecard when local storage has no scorecard", () => {
    const now = new Date(timestamp);

    expect(loadScorecard(createMemoryStorage(), now)).toEqual(
      createEmptyScorecard(now)
    );
  });

  test("saves loads and resets scorecards", () => {
    const storage = createMemoryStorage();
    const scorecard = createPracticedScorecard();
    const now = new Date(timestamp);

    expect(saveScorecard(scorecard, storage)).toEqual(scorecard);
    expect(loadScorecard(storage)).toEqual(scorecard);
    expect(resetScorecard(storage, now)).toEqual(createEmptyScorecard(now));
    expect(loadScorecard(storage)).toEqual(createEmptyScorecard(now));
  });

  test("clears invalid stored scorecards instead of returning them", () => {
    const storage = createMemoryStorage();
    const now = new Date(timestamp);

    storage.setItem(
      scorecardStorageKey,
      JSON.stringify({
        version: 1,
        updatedAt: timestamp,
        records: {
          "typescript-structural-typing": {
            questionId: "typescript-structural-typing",
            latestScore: 8,
            bestScore: 6,
            attempts: 1,
            status: "learning",
            weakPoints: [],
            lastFeedback: "",
            lastPracticedAt: timestamp
          }
        }
      })
    );

    expect(loadScorecard(storage, now)).toEqual(createEmptyScorecard(now));
    expect(storage.getItem(scorecardStorageKey)).toBeNull();
  });

  test("rejects invalid scorecard imports without overwriting stored state", () => {
    const storage = createMemoryStorage();
    const scorecard = createPracticedScorecard();

    saveScorecard(scorecard, storage);

    expect(() =>
      importScorecard(
        {
          version: 1,
          updatedAt: timestamp,
          records: {
            "typescript-structural-typing": {
              questionId: "typescript-structural-typing",
              latestScore: 8,
              bestScore: 6,
              attempts: 1,
              status: "learning",
              weakPoints: [],
              lastFeedback: "",
              lastPracticedAt: timestamp
            }
          }
        },
        storage
      )
    ).toThrow();
    expect(loadScorecard(storage)).toEqual(scorecard);
  });
});
