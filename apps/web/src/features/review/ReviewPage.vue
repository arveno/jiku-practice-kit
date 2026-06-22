<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { allQuestions } from "@jiku/content";
import { useLocalApiStore } from "../local-api/store";
import { readQuestionProgressList, readReviewSchedules } from "../local-api/client";
import type { QuestionProgress, ReviewSchedule } from "@jiku/contracts";
import { JkCard, JkPage, JkPageHeader, JkStatCard } from "../../shared/ui";
import { mapReviewViewModel } from "./mappers/reviewViewModel";

const localApiStore = useLocalApiStore();
const progressRecords = ref<QuestionProgress[]>([]);
const reviewSchedules = ref<ReviewSchedule[]>([]);

const viewModel = computed(() =>
  mapReviewViewModel(allQuestions, progressRecords.value, reviewSchedules.value)
);
const localApiNotice = computed(() => {
  if (localApiStore.status.state === "connected") {
    return `本地服务已连接：${localApiStore.status.databasePath}`;
  }

  if (localApiStore.status.state === "unwritable") {
    return `本地数据库不可写：${localApiStore.status.message}`;
  }

  return localApiStore.status.message;
});

async function refreshReview() {
  const status = await localApiStore.refresh();

  if (status.state !== "connected") {
    progressRecords.value = [];
    reviewSchedules.value = [];
    return;
  }

  const [nextProgressRecords, nextReviewSchedules] = await Promise.all([
    readQuestionProgressList(),
    readReviewSchedules()
  ]);
  progressRecords.value = nextProgressRecords;
  reviewSchedules.value = nextReviewSchedules;
}

void refreshReview();
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Review"
      title="复盘"
      description="基于本地数据库查看弱项、低分和到期复习题。"
    />

    <p class="local-api-status" :data-state="localApiStore.status.state">
      {{ localApiNotice }}
    </p>

    <section class="review-stats" aria-label="复盘统计">
      <JkStatCard
        v-for="stat in viewModel.stats"
        :key="stat.id"
        :label="stat.label"
        :value="stat.value"
      />
    </section>

    <section class="review-grid" aria-label="复盘明细">
      <JkCard class="queue-card">
        <h2>复习队列</h2>
        <p v-if="viewModel.reviewQueue.length === 0" class="muted">暂无到期复习题。</p>
        <ul v-else class="item-list">
          <li v-for="question in viewModel.reviewQueue" :key="question.id">
            <RouterLink :to="question.to">{{ question.title }}</RouterLink>
            <span>
              {{ question.reasonLabel }} · {{ question.nextReviewAtLabel }} · 优先级
              {{ question.priorityLabel }}
            </span>
            <strong>{{ question.latestScoreLabel }}</strong>
          </li>
        </ul>
      </JkCard>

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

.queue-card,
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

.local-api-status {
  margin: 0 0 16px;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  background: #fafafa;
  color: #666666;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 12px;
}

.local-api-status[data-state="connected"] {
  border-color: #d3e5ff;
  background: #f5f9ff;
  color: #0761d1;
}

.local-api-status[data-state="unwritable"],
.local-api-status[data-state="unavailable"] {
  border-color: #f7d4d6;
  background: #fff7f8;
  color: #c50000;
}

.item-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding: 0;
  list-style: none;
}

.item-list li {
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

.item-list span {
  color: #666666;
  font-size: 14px;
  line-height: 20px;
}

.item-list strong {
  color: #171717;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

@media (max-width: 880px) {
  .review-stats,
  .review-grid {
    grid-template-columns: 1fr;
  }
}
</style>
