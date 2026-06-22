<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allQuestions } from "@jiku/content";
import { getQuestionStats } from "@jiku/domain";
import { useScorecardStore } from "../scorecard/store";
import { JkCard, JkPage, JkPageHeader, JkStatCard } from "../../shared/ui";
import { mapHomeViewModel } from "./mappers/homeViewModel";

const questionStats = getQuestionStats(allQuestions);
const scorecardStore = useScorecardStore();
scorecardStore.load();

const viewModel = computed(() =>
  mapHomeViewModel({
    questionStats,
    scorecardStats: scorecardStore.stats
  })
);
</script>

<template>
  <JkPage>
    <JkPageHeader
      :eyebrow="viewModel.eyebrow"
      :title="viewModel.productName"
      :description="viewModel.description"
    />

    <nav class="home-nav" aria-label="应用导航">
      <RouterLink
        v-for="item in viewModel.navItems"
        :key="item.id"
        class="home-nav-link"
        :to="item.to"
      >
        <JkCard>
          <span>{{ item.label }}</span>
        </JkCard>
      </RouterLink>
    </nav>

    <section class="home-stats" aria-label="首页统计">
      <JkStatCard
        v-for="stat in viewModel.stats"
        :key="stat.id"
        :label="stat.label"
        :value="stat.value"
        :caption="stat.caption"
      />
    </section>
  </JkPage>
</template>

<style scoped>
.home-nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 24px;
}

.home-nav-link {
  color: inherit;
  text-decoration: none;
}

.home-nav-link span {
  color: #171717;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.home-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 880px) {
  .home-nav,
  .home-stats {
    grid-template-columns: 1fr;
  }
}
</style>
