import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createEmptyScorecard, type Scorecard } from "@jiku/contracts";
import { getScorecardStats } from "@jiku/domain";
import {
  importScorecard as importStoredScorecard,
  loadScorecard,
  resetScorecard as resetStoredScorecard,
  saveScorecard
} from "./storage";

export const useScorecardStore = defineStore("scorecard", () => {
  const scorecard = ref<Scorecard>(createEmptyScorecard());
  const stats = computed(() => getScorecardStats(scorecard.value));

  function load() {
    scorecard.value = loadScorecard();
    return scorecard.value;
  }

  function save(nextScorecard: Scorecard) {
    scorecard.value = saveScorecard(nextScorecard);
    return scorecard.value;
  }

  function reset() {
    scorecard.value = resetStoredScorecard();
    return scorecard.value;
  }

  function importFromJson(input: unknown) {
    scorecard.value = importStoredScorecard(input);
    return scorecard.value;
  }

  return {
    scorecard,
    stats,
    load,
    save,
    reset,
    importFromJson
  };
});
