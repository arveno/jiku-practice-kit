<script setup lang="ts">
import { computed } from "vue";
import { allQuestions } from "@jiku/content";
import {
  JkCard,
  JkEmpty,
  JkPage,
  JkPageHeader,
  JkScoreBadge,
  JkStatCard,
  JkTag,
  JkToolbar
} from "../shared/ui";

const categoryCount = computed(
  () => new Set(allQuestions.map((question) => question.category)).size
);

const highFrequencyCount = computed(
  () => allQuestions.filter((question) => question.frequency === "high").length
);

const totalScore = computed(() =>
  allQuestions.reduce((total, question) => total + question.scoring.totalScore, 0)
);
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Contract-first free question bank."
      title="极库刷题."
      description="一个先建立代码合同、内容合同和 CI 门禁的前端静态题库。"
    />

    <section class="stats-grid" aria-label="题库统计">
      <JkStatCard label="Questions" :value="allQuestions.length" />
      <JkStatCard label="Categories" :value="categoryCount" />
      <JkStatCard label="High frequency" :value="highFrequencyCount" />
      <JkStatCard label="Total score" :value="totalScore" />
    </section>

    <section class="question-list" aria-label="免费题目">
      <JkEmpty
        v-if="allQuestions.length === 0"
        title="暂无免费题目"
        description="添加 free 题目后会显示在这里。"
      />
      <template v-else>
        <JkCard
          v-for="question in allQuestions"
          :key="question.id"
          class="question-card"
        >
          <div class="question-card-header">
            <span class="meta">{{ question.category }} / {{ question.topic }}</span>
            <h2>{{ question.title }}</h2>
            <JkScoreBadge
              type="info"
              :score="question.scoring.passScore"
              :max="question.scoring.totalScore"
            />
          </div>
          <p>{{ question.question }}</p>
          <JkToolbar class="tag-list">
            <JkTag v-for="tag in question.tags" :key="tag">{{ tag }}</JkTag>
          </JkToolbar>
        </JkCard>
      </template>
    </section>
  </JkPage>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0 0 24px;
}

.question-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.question-card-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 16px;
  align-items: start;
}

.meta {
  grid-column: 1 / -1;
  margin: 0;
  color: #666666;
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
}

h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

p {
  margin: 16px 0 0;
  color: #4d4d4d;
  line-height: 24px;
}

.tag-list {
  margin-top: 20px;
}

@media (max-width: 880px) {
  .stats-grid,
  .question-list {
    grid-template-columns: 1fr;
  }
}
</style>
