<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { allQuestions } from "@jiku/content";
import {
  deriveQuestionFilterOptions,
  filterQuestions,
  type QuestionFilters
} from "@jiku/domain";
import { useScorecardStore } from "../scorecard/store";
import {
  JkCard,
  JkEmpty,
  JkPage,
  JkPageHeader,
  JkTag,
  JkToolbar
} from "../../shared/ui";
import {
  mapQuestionAccessLevelLabel,
  mapQuestionDifficultyLabel,
  mapQuestionFrequencyLabel,
  mapQuestionToViewModel
} from "./mappers/questionViewModel";
import {
  mapQuestionFiltersToQuery,
  mapQueryToQuestionFilters
} from "./mappers/questionFilterQuery";

type SelectFilterKey = Exclude<keyof QuestionFilters, "keyword">;

type SelectFilterControl = {
  key: SelectFilterKey;
  label: string;
  allLabel: string;
  options: {
    value: string;
    label: string;
  }[];
};

const route = useRoute();
const router = useRouter();
const filterOptions = deriveQuestionFilterOptions(allQuestions);
const scorecardStore = useScorecardStore();
scorecardStore.load();

const filters = computed(() => mapQueryToQuestionFilters(route.query, filterOptions));

const selectFilters = computed<SelectFilterControl[]>(() => [
  {
    key: "category",
    label: "分类",
    allLabel: "全部分类",
    options: filterOptions.categories.map((value) => ({ value, label: value }))
  },
  {
    key: "topic",
    label: "专题",
    allLabel: "全部专题",
    options: filterOptions.topics.map((value) => ({ value, label: value }))
  },
  {
    key: "tag",
    label: "标签",
    allLabel: "全部标签",
    options: filterOptions.tags.map((value) => ({ value, label: value }))
  },
  {
    key: "difficulty",
    label: "难度",
    allLabel: "全部难度",
    options: filterOptions.difficulties.map((value) => ({
      value,
      label: mapQuestionDifficultyLabel(value)
    }))
  },
  {
    key: "frequency",
    label: "频率",
    allLabel: "全部频率",
    options: filterOptions.frequencies.map((value) => ({
      value,
      label: mapQuestionFrequencyLabel(value)
    }))
  },
  {
    key: "accessLevel",
    label: "访问级别",
    allLabel: "全部级别",
    options: filterOptions.accessLevels.map((value) => ({
      value,
      label: mapQuestionAccessLevelLabel(value)
    }))
  }
]);

const filteredQuestions = computed(() => filterQuestions(allQuestions, filters.value));

const questionCards = computed(() =>
  filteredQuestions.value.map((question) =>
    mapQuestionToViewModel(question, scorecardStore.scorecard.records[question.id])
  )
);

function updateFilter(key: keyof QuestionFilters, value: string) {
  const nextFilters = {
    ...filters.value,
    [key]: value.trim() || undefined
  };

  void router.replace({ query: mapQuestionFiltersToQuery(nextFilters) });
}

function filterValue(key: SelectFilterKey) {
  return filters.value[key] ?? "";
}

function eventValue(event: unknown) {
  const value = (event as { target?: { value?: unknown } }).target?.value;
  return typeof value === "string" ? value : "";
}
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Question bank"
      title="题库"
      description="浏览 free 示例题，并按分类、专题、标签和练习状态快速收窄范围。"
    />

    <section class="question-filters" aria-label="题库筛选">
      <label class="filter-field">
        <span>关键词</span>
        <input
          type="search"
          :value="filters.keyword ?? ''"
          placeholder="标题、题干、答案、标签"
          @input="updateFilter('keyword', eventValue($event))"
        />
      </label>

      <label v-for="control in selectFilters" :key="control.key" class="filter-field">
        <span>{{ control.label }}</span>
        <select
          :value="filterValue(control.key)"
          @change="updateFilter(control.key, eventValue($event))"
        >
          <option value="">{{ control.allLabel }}</option>
          <option
            v-for="option in control.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </section>

    <p class="result-summary">
      显示 {{ questionCards.length }} / {{ allQuestions.length }} 道 free 题
    </p>

    <section class="question-list" aria-label="题库列表">
      <JkEmpty
        v-if="questionCards.length === 0"
        title="没有匹配题目"
        description="清空筛选后再试。"
      />

      <template v-else>
        <JkCard v-for="question in questionCards" :key="question.id">
          <div class="question-card-header">
            <div>
              <span class="meta">{{ question.category }} / {{ question.topic }}</span>
              <h2>{{ question.title }}</h2>
            </div>
            <JkTag :type="question.frequencyTagType">{{
              question.frequencyLabel
            }}</JkTag>
          </div>

          <p class="prompt">{{ question.prompt }}</p>

          <JkToolbar class="tag-list">
            <JkTag>{{ question.difficultyLabel }}</JkTag>
            <JkTag>{{ question.accessLevelLabel }}</JkTag>
            <JkTag v-for="tag in question.tagLabels" :key="tag">{{ tag }}</JkTag>
          </JkToolbar>

          <dl class="score-grid">
            <div>
              <dt>最近得分</dt>
              <dd>{{ question.latestScoreLabel }}</dd>
            </div>
            <div>
              <dt>最高分</dt>
              <dd>{{ question.bestScoreLabel }}</dd>
            </div>
            <div>
              <dt>练习次数</dt>
              <dd>{{ question.attemptsLabel }}</dd>
            </div>
            <div>
              <dt>掌握状态</dt>
              <dd>
                <JkTag :type="question.statusTagType">{{ question.statusLabel }}</JkTag>
              </dd>
            </div>
          </dl>
        </JkCard>
      </template>
    </section>
  </JkPage>
</template>

<style scoped>
.question-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 16px;
}

.filter-field {
  display: grid;
  gap: 6px;
}

.filter-field span,
dt {
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

input:focus,
select:focus {
  border-color: #171717;
  outline: none;
}

.result-summary {
  margin: 0 0 16px;
  color: #666666;
  font-size: 14px;
  line-height: 20px;
}

.question-list {
  display: grid;
  gap: 16px;
}

.question-card-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.meta {
  color: #666666;
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
}

h2 {
  margin: 6px 0 0;
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.prompt {
  margin: 14px 0 0;
  color: #4d4d4d;
  line-height: 24px;
}

.tag-list {
  margin-top: 16px;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 0;
}

.score-grid div {
  min-width: 0;
}

dt,
dd {
  margin: 0;
}

dd {
  margin-top: 4px;
  color: #171717;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

@media (max-width: 880px) {
  .question-filters,
  .score-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .question-filters,
  .score-grid {
    grid-template-columns: 1fr;
  }

  .question-card-header {
    display: grid;
  }
}
</style>
