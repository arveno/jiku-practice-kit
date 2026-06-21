<script setup lang="ts">
import { computed } from "vue";
import { allQuestions } from "@jiku/content";

const categoryCount = computed(
  () => new Set(allQuestions.map((question) => question.category)).size
);

const highFrequencyCount = computed(
  () => allQuestions.filter((question) => question.frequency === "high").length
);
</script>

<template>
  <main class="app-shell">
    <section class="hero-band">
      <p class="eyebrow">Contract-first free question bank.</p>
      <h1>极库刷题.</h1>
      <p class="lead">一个先建立代码合同、内容合同和 CI 门禁的前端静态题库。</p>
    </section>

    <section class="stats-grid" aria-label="题库统计">
      <article class="stat-card">
        <span>Questions</span>
        <strong>{{ allQuestions.length }}</strong>
      </article>
      <article class="stat-card">
        <span>Categories</span>
        <strong>{{ categoryCount }}</strong>
      </article>
      <article class="stat-card">
        <span>High frequency</span>
        <strong>{{ highFrequencyCount }}</strong>
      </article>
    </section>

    <section class="question-list" aria-label="免费题目">
      <article
        v-for="question in allQuestions"
        :key="question.id"
        class="question-card"
      >
        <div>
          <span class="meta">{{ question.category }} / {{ question.topic }}</span>
          <h2>{{ question.title }}</h2>
        </div>
        <p>{{ question.question }}</p>
        <ul>
          <li v-for="tag in question.tags" :key="tag">{{ tag }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>
