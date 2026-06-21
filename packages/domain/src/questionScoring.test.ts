import { describe, expect, test } from "vitest";
import { isPassingScore } from "./questionScoring";

describe("isPassingScore", () => {
  test("compares a score against the question pass score", () => {
    expect(isPassingScore(6, { passScore: 6 })).toBe(true);
    expect(isPassingScore(5, { passScore: 6 })).toBe(false);
  });
});
