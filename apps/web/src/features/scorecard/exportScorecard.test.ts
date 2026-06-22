import { describe, expect, test } from "vitest";
import type { Scorecard } from "@jiku/contracts";
import { createScorecardExport } from "./exportScorecard";

const scorecard: Scorecard = {
  version: 1,
  updatedAt: "2026-06-21T09:00:00.000Z",
  records: {}
};

describe("createScorecardExport", () => {
  test("creates a dated JSON export", () => {
    expect(
      createScorecardExport(scorecard, new Date("2026-06-22T02:00:00.000Z"))
    ).toEqual({
      fileName: "scorecard-2026-06-22.json",
      mimeType: "application/json",
      content: `${JSON.stringify(scorecard, null, 2)}\n`
    });
  });
});
