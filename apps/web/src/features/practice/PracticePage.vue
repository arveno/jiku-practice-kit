<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { allQuestions } from "@jiku/content";
import {
  applySelfAssessment,
  deriveQuestionFilterOptions,
  type SelfAssessment
} from "@jiku/domain";
import { useScorecardStore } from "../scorecard/store";
import { useLocalApiStore } from "../local-api/store";
import {
  JkCard,
  JkEmpty,
  JkPage,
  JkPageHeader,
  JkTag,
  JkToolbar
} from "../../shared/ui";
import { mapQuestionDetailToViewModel } from "../questions/mappers/questionDetailViewModel";
import {
  selectPracticeQuestions,
  type PracticeScope
} from "./mappers/practiceSelection";

type ScopeOption = {
  value: PracticeScope;
  label: string;
};

const scopeOptions: ScopeOption[] = [
  { value: "random", label: "随机题" },
  { value: "category", label: "按分类" },
  { value: "topic", label: "按专题" },
  { value: "tag", label: "按标签" },
  { value: "high-frequency", label: "高频题" },
  { value: "weak", label: "弱项题" },
  { value: "unpracticed", label: "未练习题" },
  { value: "low-score", label: "低分题" }
];

const assessments: {
  value: SelfAssessment;
  label: string;
  scoreLabel: string;
}[] = [
  { value: "mastered", label: "掌握", scoreLabel: "10" },
  { value: "partial", label: "部分掌握", scoreLabel: "7" },
  { value: "unclear", label: "不清楚", scoreLabel: "4" },
  { value: "failed", label: "不会", scoreLabel: "0" }
];

const filterOptions = deriveQuestionFilterOptions(allQuestions);
const route = useRoute();
const scorecardStore = useScorecardStore();
const localApiStore = useLocalApiStore();
scorecardStore.load();
void localApiStore.refresh();

const scope = ref<PracticeScope>("random");
const scopeValue = ref("");
const questionCount = ref(1);
const sessionQuestions = ref<typeof allQuestions>([]);
const currentIndex = ref(0);
const answerVisible = ref(false);
const sessionStarted = ref(false);
const sessionDone = ref(false);
const feedbackMessage = ref("");
const routeQuestionIds = computed(() => {
  const rawValue = route.query.questionIds;
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

  return typeof value === "string"
    ? value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
});

const scopeValueOptions = computed(() => {
  if (scope.value === "category") {
    return filterOptions.categories;
  }

  if (scope.value === "topic") {
    return filterOptions.topics;
  }

  if (scope.value === "tag") {
    return filterOptions.tags;
  }

  return [];
});

const needsScopeValue = computed(() => scopeValueOptions.value.length > 0);

const candidateQuestions = computed(() =>
  selectPracticeQuestions(allQuestions, scorecardStore.scorecard, {
    scope: scope.value,
    value: scopeValue.value,
    count: allQuestions.length,
    random: () => 0.5
  })
);

const currentQuestion = computed(() => sessionQuestions.value[currentIndex.value]);
const sessionDoneTitle = computed(() =>
  sessionQuestions.value.length === 0 ? "没有可练习题目" : "练习完成"
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

const currentViewModel = computed(() => {
  if (!currentQuestion.value) {
    return undefined;
  }

  return mapQuestionDetailToViewModel(
    currentQuestion.value,
    scorecardStore.scorecard.records[currentQuestion.value.id]
  );
});

watch(scope, () => {
  scopeValue.value = scopeValueOptions.value[0] ?? "";
});

function eventValue(event: unknown) {
  const value = (event as { target?: { value?: unknown } }).target?.value;
  return typeof value === "string" ? value : "";
}

function updateQuestionCount(value: string) {
  const nextCount = Number(value);
  questionCount.value = Number.isFinite(nextCount) ? Math.max(1, nextCount) : 1;
}

function startPractice() {
  sessionQuestions.value = selectPracticeQuestions(
    allQuestions,
    scorecardStore.scorecard,
    {
      scope: scope.value,
      value: scopeValue.value,
      count: questionCount.value
    }
  );
  currentIndex.value = 0;
  answerVisible.value = false;
  sessionStarted.value = true;
  sessionDone.value = sessionQuestions.value.length === 0;
  feedbackMessage.value =
    sessionQuestions.value.length === 0 ? "当前范围没有可练习题目。" : "";
}

function startPracticeFromQuestionIds(questionIds: string[]) {
  sessionQuestions.value = selectPracticeQuestions(
    allQuestions,
    scorecardStore.scorecard,
    {
      scope: "question-ids",
      questionIds,
      count: questionIds.length
    }
  );
  currentIndex.value = 0;
  answerVisible.value = false;
  sessionStarted.value = true;
  sessionDone.value = sessionQuestions.value.length === 0;
  feedbackMessage.value =
    sessionQuestions.value.length === 0 ? "当前筛选结果没有可练习题目。" : "";
}

function saveAssessment(assessment: SelfAssessment) {
  if (!currentQuestion.value) {
    return;
  }

  if (!localApiStore.connected) {
    feedbackMessage.value = "本地服务未连接，不能保存练习进度。";
    return;
  }

  scorecardStore.save(
    applySelfAssessment(scorecardStore.scorecard, {
      questionId: currentQuestion.value.id,
      assessment
    })
  );

  if (currentIndex.value >= sessionQuestions.value.length - 1) {
    sessionDone.value = true;
    feedbackMessage.value = "本轮练习已保存。";
    return;
  }

  currentIndex.value += 1;
  answerVisible.value = false;
  feedbackMessage.value = "已保存，进入下一题。";
}

if (routeQuestionIds.value.length > 0) {
  startPracticeFromQuestionIds(routeQuestionIds.value);
}
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Practice"
      title="练习"
      description="题干、答案与本地自评记录。"
    />

    <section class="practice-layout" aria-label="练习模式">
      <JkCard>
        <p class="local-api-status" :data-state="localApiStore.status.state">
          {{ localApiNotice }}
        </p>
        <div class="setup-grid">
          <label class="field">
            <span>练习范围</span>
            <select v-model="scope">
              <option
                v-for="option in scopeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label v-if="needsScopeValue" class="field">
            <span>范围值</span>
            <select v-model="scopeValue">
              <option v-for="option in scopeValueOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>题数</span>
            <input
              type="number"
              min="1"
              :max="Math.max(1, candidateQuestions.length)"
              :value="questionCount"
              @input="updateQuestionCount(eventValue($event))"
            />
          </label>

          <button type="button" class="start-button" @click="startPractice">
            开始练习
          </button>
        </div>
        <p class="candidate-count">当前范围 {{ candidateQuestions.length }} 道题</p>
      </JkCard>

      <JkEmpty
        v-if="sessionDone"
        :title="sessionDoneTitle"
        :description="feedbackMessage"
      />

      <JkCard v-else-if="sessionStarted && currentViewModel">
        <div class="section-heading">
          <div>
            <span class="meta">
              第 {{ currentIndex + 1 }} / {{ sessionQuestions.length }} 题
            </span>
            <h2>{{ currentViewModel.title }}</h2>
          </div>
          <JkTag :type="currentViewModel.frequencyTagType">
            {{ currentViewModel.frequencyLabel }}
          </JkTag>
        </div>

        <p class="prompt">{{ currentViewModel.prompt }}</p>

        <JkToolbar class="tag-list">
          <JkTag>{{ currentViewModel.difficultyLabel }}</JkTag>
          <JkTag>{{ currentViewModel.accessLevelLabel }}</JkTag>
          <JkTag v-for="tag in currentViewModel.tagLabels" :key="tag">{{ tag }}</JkTag>
        </JkToolbar>

        <div class="answer-panel">
          <button
            type="button"
            class="answer-button"
            @click="answerVisible = !answerVisible"
          >
            {{ answerVisible ? "隐藏答案" : "显示答案" }}
          </button>
          <div v-if="answerVisible" class="answer-content">
            <h3>标准答案</h3>
            <p>{{ currentViewModel.standardAnswer }}</p>
          </div>
        </div>

        <div class="assessment-grid" aria-label="自评">
          <button
            v-for="assessment in assessments"
            :key="assessment.value"
            type="button"
            :disabled="!localApiStore.connected"
            @click="saveAssessment(assessment.value)"
          >
            <span>{{ assessment.label }}</span>
            <strong>{{ assessment.scoreLabel }}</strong>
          </button>
        </div>
      </JkCard>
    </section>
  </JkPage>
</template>

<style scoped>
.practice-layout {
  display: grid;
  gap: 16px;
}

.setup-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
}

.field {
  display: grid;
  gap: 6px;
}

.field span,
.meta {
  color: #666666;
  font-size: 12px;
  line-height: 16px;
}

input,
select {
  width: 100%;
  height: 36px;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  background: #ffffff;
  color: #171717;
  font: inherit;
  padding: 0 10px;
}

button {
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
}

.start-button,
.answer-button {
  height: 36px;
  background: #171717;
  color: #ffffff;
  padding: 0 12px;
}

.candidate-count {
  margin: 12px 0 0;
  color: #666666;
  font-size: 14px;
}

.local-api-status {
  margin: 0 0 12px;
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
  margin-top: 6px;
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

h3 {
  color: #171717;
  font-size: 16px;
  font-weight: 600;
}

.prompt,
.answer-content p {
  margin-top: 14px;
  color: #4d4d4d;
  line-height: 24px;
}

.tag-list {
  margin-top: 16px;
}

.answer-panel {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.answer-button {
  justify-self: start;
}

.answer-content {
  border-top: 1px solid #ebebeb;
  padding-top: 16px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.assessment-grid button {
  display: grid;
  gap: 4px;
  border: 1px solid #ebebeb;
  background: #ffffff;
  color: #171717;
  padding: 12px;
  text-align: left;
}

.assessment-grid button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.assessment-grid strong {
  font-size: 20px;
  line-height: 28px;
}

@media (max-width: 880px) {
  .setup-grid,
  .assessment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .setup-grid,
  .assessment-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    display: grid;
  }
}
</style>
