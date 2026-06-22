<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { allQuestions } from "@jiku/content";
import { useScorecardStore } from "../scorecard/store";
import { JkCard, JkPage, JkPageHeader, JkStatCard } from "../../shared/ui";
import { mapReviewViewModel } from "./mappers/reviewViewModel";

const scorecardStore = useScorecardStore();
scorecardStore.load();

const viewModel = computed(() =>
  mapReviewViewModel(allQuestions, scorecardStore.scorecard)
);
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Review"
      title="复盘"
      description="基于本地 scorecard 查看弱项和练习反馈。"
    />

    <section class="review-stats" aria-label="复盘统计">
      <JkStatCard
        v-for="stat in viewModel.stats"
        :key="stat.id"
        :label="stat.label"
        :value="stat.value"
      />
    </section>

    <section class="review-grid" aria-label="复盘明细">
      <JkCard>
        <h2>弱项题</h2>
        <p v-if="viewModel.weakQuestions.length === 0" class="muted">暂无弱项题。</p>
        <ul v-else class="item-list">
          <li v-for="question in viewModel.weakQuestions" :key="question.id">
            <RouterLink :to="question.to">{{ question.title }}</RouterLink>
            <span>{{ question.meta }}</span>
            <strong>{{ question.latestScoreLabel }}</strong>
          </li>
        </ul>
      </JkCard>

      <JkCard>
        <h2>低分题</h2>
        <p v-if="viewModel.lowScoreQuestions.length === 0" class="muted">
          暂无低分题。
        </p>
        <ul v-else class="item-list">
          <li v-for="question in viewModel.lowScoreQuestions" :key="question.id">
            <RouterLink :to="question.to">{{ question.title }}</RouterLink>
            <span>{{ question.meta }}</span>
            <strong>{{ question.latestScoreLabel }}</strong>
          </li>
        </ul>
      </JkCard>

      <JkCard>
        <h2>分类平均分</h2>
        <p v-if="viewModel.categoryAverages.length === 0" class="muted">
          暂无分类数据。
        </p>
        <ul v-else class="average-list">
          <li v-for="item in viewModel.categoryAverages" :key="item.id">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        </ul>
      </JkCard>

      <JkCard>
        <h2>专题平均分</h2>
        <p v-if="viewModel.topicAverages.length === 0" class="muted">暂无专题数据。</p>
        <ul v-else class="average-list">
          <li v-for="item in viewModel.topicAverages" :key="item.id">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        </ul>
      </JkCard>

      <JkCard class="recent-card">
        <h2>最近练习</h2>
        <p v-if="viewModel.recentRecords.length === 0" class="muted">暂无练习记录。</p>
        <ul v-else class="item-list">
          <li v-for="record in viewModel.recentRecords" :key="record.id">
            <RouterLink :to="record.to">{{ record.title }}</RouterLink>
            <span>{{ record.practicedAtLabel }} · {{ record.meta }}</span>
            <strong>{{ record.latestScoreLabel }}</strong>
          </li>
        </ul>
      </JkCard>
    </section>
  </JkPage>
</template>

<style scoped>
.review-stats,
.review-grid {
  display: grid;
  gap: 16px;
}

.review-stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 16px;
}

.review-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.review-stats :deep(.jk-card),
.review-grid :deep(.jk-card) {
  min-width: 0;
}

.recent-card {
  grid-column: 1 / -1;
}

h2,
p,
ul {
  margin: 0;
}

h2 {
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.muted {
  margin-top: 12px;
  color: #888888;
  line-height: 24px;
}

.item-list,
.average-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding: 0;
  list-style: none;
}

.item-list li,
.average-list li {
  display: grid;
  gap: 4px;
  border-top: 1px solid #ebebeb;
  padding-top: 12px;
}

.item-list a {
  color: #171717;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
}

.item-list a:hover {
  color: #0070f3;
}

.item-list span,
.average-list span {
  color: #666666;
  font-size: 14px;
  line-height: 20px;
}

.item-list strong,
.average-list strong {
  color: #171717;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.average-list li {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

@media (max-width: 880px) {
  .review-stats,
  .review-grid {
    grid-template-columns: 1fr;
  }
}
</style>
