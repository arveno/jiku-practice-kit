import type { Scorecard } from "@jiku/contracts";

function dateStamp(now: Date) {
  return now.toISOString().slice(0, 10);
}

export function createScorecardExport(scorecard: Scorecard, now = new Date()) {
  return {
    fileName: `scorecard-${dateStamp(now)}.json`,
    mimeType: "application/json",
    content: `${JSON.stringify(scorecard, null, 2)}\n`
  };
}
