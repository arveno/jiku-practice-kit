import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createEmptyScorecard, type Scorecard } from "@jiku/contracts";
import { getScorecardStats } from "@jiku/domain";
import { loadScorecard } from "./storage";

export const useScorecardStore = defineStore("scorecard", () => {
  const scorecard = ref<Scorecard>(createEmptyScorecard());
  const stats = computed(() => getScorecardStats(scorecard.value));

  function load() {
    scorecard.value = loadScorecard();
    return scorecard.value;
  }

  function replace(nextScorecard: Scorecard) {
    scorecard.value = nextScorecard;
    return scorecard.value;
  }

  return {
    scorecard,
    stats,
    load,
    replace
  };
});
