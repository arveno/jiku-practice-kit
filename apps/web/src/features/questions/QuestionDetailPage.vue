<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { allQuestions } from "@jiku/content";
import { useScorecardStore } from "../scorecard/store";
import {
  JkCard,
  JkEmpty,
  JkPage,
  JkPageHeader,
  JkTag,
  JkToolbar
} from "../../shared/ui";
import { mapQuestionDetailToViewModel } from "./mappers/questionDetailViewModel";

const route = useRoute();
const scorecardStore = useScorecardStore();
const answerVisible = ref(false);
scorecardStore.load();

const questionId = computed(() => {
  const value = route.params.questionId;
  return Array.isArray(value) ? value[0] : value;
});

const question = computed(() =>
  allQuestions.find((item) => item.id === questionId.value)
);

const viewModel = computed(() => {
  if (!question.value) {
    return undefined;
  }

  return mapQuestionDetailToViewModel(
    question.value,
    scorecardStore.scorecard.records[question.value.id]
  );
});

watch(questionId, () => {
  answerVisible.value = false;
});
</script>

<template>
  <JkPage v-if="viewModel">
    <RouterLink class="back-link" to="/questions">返回题库</RouterLink>

    <JkPageHeader
      :eyebrow="`${viewModel.category} / ${viewModel.topic}`"
      :title="viewModel.title"
      description="题干、练习状态与评分参考。"
    />

    <section class="detail-layout" aria-label="题目详情">
      <JkCard>
        <div class="section-heading">
          <h2>题目</h2>
          <JkTag :type="viewModel.frequencyTagType">{{
            viewModel.frequencyLabel
          }}</JkTag>
        </div>
        <p class="question-text">{{ viewModel.prompt }}</p>
        <JkToolbar class="tag-list">
          <JkTag>{{ viewModel.difficultyLabel }}</JkTag>
          <JkTag>{{ viewModel.accessLevelLabel }}</JkTag>
          <JkTag v-for="tag in viewModel.tagLabels" :key="tag">{{ tag }}</JkTag>
        </JkToolbar>
      </JkCard>

      <JkCard>
        <h2>练习状态</h2>
        <dl class="status-grid">
          <div>
            <dt>最近得分</dt>
            <dd>{{ viewModel.latestScoreLabel }}</dd>
          </div>
          <div>
            <dt>最高分</dt>
            <dd>{{ viewModel.bestScoreLabel }}</dd>
          </div>
          <div>
            <dt>练习次数</dt>
            <dd>{{ viewModel.attemptsLabel }}</dd>
          </div>
          <div>
            <dt>掌握状态</dt>
            <dd>
              <JkTag :type="viewModel.statusTagType">{{ viewModel.statusLabel }}</JkTag>
            </dd>
          </div>
        </dl>
      </JkCard>

      <JkCard>
        <div class="section-heading">
          <h2>答案与评分</h2>
          <button type="button" @click="answerVisible = !answerVisible">
            {{ answerVisible ? "隐藏答案" : "显示答案" }}
          </button>
        </div>

        <div v-if="answerVisible" class="answer-content">
          <section>
            <h3>标准答案</h3>
            <p>{{ viewModel.standardAnswer }}</p>
          </section>

          <section>
            <h3>关键点</h3>
            <ul>
              <li v-for="keyPoint in viewModel.keyPoints" :key="keyPoint.text">
                <span>{{ keyPoint.text }}</span>
                <strong>{{ keyPoint.weightLabel }}</strong>
              </li>
            </ul>
          </section>

          <section v-if="viewModel.followUps.length > 0">
            <h3>追问</h3>
            <ul>
              <li v-for="followUp in viewModel.followUps" :key="followUp">
                {{ followUp }}
              </li>
            </ul>
          </section>

          <section v-if="viewModel.commonMistakes.length > 0">
            <h3>常见错误</h3>
            <ul>
              <li v-for="mistake in viewModel.commonMistakes" :key="mistake">
                {{ mistake }}
              </li>
            </ul>
          </section>

          <section>
            <h3>评分规则</h3>
            <p class="score-summary">
              {{ viewModel.scoring.totalScoreLabel }} /
              {{ viewModel.scoring.passScoreLabel }}
            </p>
            <ul>
              <li
                v-for="dimension in viewModel.scoring.dimensions"
                :key="dimension.name"
              >
                <span>{{ dimension.name }}：{{ dimension.description }}</span>
                <strong>{{ dimension.scoreLabel }}</strong>
              </li>
            </ul>
          </section>
        </div>
      </JkCard>
    </section>
  </JkPage>

  <JkPage v-else>
    <JkPageHeader eyebrow="Question detail" title="题目不存在" />
    <JkEmpty title="没有找到这道题" description="返回题库选择一个有效题目。" />
  </JkPage>
</template>

<style scoped>
.back-link {
  color: #666666;
  font-size: 14px;
  text-decoration: none;
}

.back-link:hover {
  color: #0070f3;
}

.detail-layout {
  display: grid;
  gap: 16px;
}

.section-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

h2,
h3,
p {
  margin: 0;
}

h2 {
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

h3 {
  color: #171717;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.question-text,
.answer-content p {
  margin-top: 14px;
  color: #4d4d4d;
  line-height: 24px;
}

.tag-list {
  margin-top: 16px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 0;
}

dt {
  color: #666666;
  font-size: 12px;
  line-height: 16px;
}

dd {
  margin: 4px 0 0;
  color: #171717;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

button {
  height: 32px;
  border: 0;
  border-radius: 6px;
  background: #171717;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  padding: 0 12px;
}

.answer-content {
  display: grid;
  gap: 24px;
  margin-top: 20px;
}

ul {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  color: #4d4d4d;
  line-height: 24px;
}

li strong {
  flex: 0 0 auto;
  color: #171717;
  font-size: 14px;
}

.score-summary {
  color: #666666;
  font-size: 14px;
}

@media (max-width: 720px) {
  .section-heading,
  li {
    display: grid;
  }

  .status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
