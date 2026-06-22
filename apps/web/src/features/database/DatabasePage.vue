<script setup lang="ts">
import { computed, ref } from "vue";
import { JkCard, JkPage, JkPageHeader, JkStatCard } from "../../shared/ui";
import { readDatabaseSummary, type LocalDatabaseSummary } from "../local-api/client";
import { mapDatabaseSummaryViewModel } from "./mappers/databaseSummaryViewModel";

const summary = ref<LocalDatabaseSummary>({
  state: "unavailable",
  message: "本地服务未连接",
  activeSession: null,
  totalAttempts: 0,
  questionProgressCount: 0,
  reviewScheduleCount: 0
});

const viewModel = computed(() => mapDatabaseSummaryViewModel(summary.value));

async function refreshSummary() {
  summary.value = await readDatabaseSummary();
}

void refreshSummary();
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Database"
      title="数据"
      description="本地数据库状态、当前轮次和练习记录概览。"
    />

    <section class="stats-grid" aria-label="数据库统计">
      <JkStatCard
        v-for="stat in viewModel.stats"
        :key="stat.id"
        :label="stat.label"
        :value="stat.value"
      />
    </section>

    <JkCard>
      <div class="section-heading">
        <h2>本地数据库</h2>
        <button type="button" @click="void refreshSummary()">刷新</button>
      </div>
      <dl class="detail-list">
        <div v-for="detail in viewModel.details" :key="detail.id">
          <dt>{{ detail.label }}</dt>
          <dd>{{ detail.value }}</dd>
        </div>
      </dl>
    </JkCard>
  </JkPage>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stats-grid :deep(.jk-card) {
  min-width: 0;
}

.section-heading {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

h2,
dl,
dd {
  margin: 0;
}

h2 {
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
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

.detail-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.detail-list div {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  border-top: 1px solid #ebebeb;
  padding-top: 12px;
}

dt {
  color: #666666;
  font-size: 14px;
  line-height: 20px;
}

dd {
  overflow-wrap: anywhere;
  color: #171717;
  line-height: 20px;
}

@media (max-width: 880px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .detail-list div,
  .section-heading {
    grid-template-columns: 1fr;
  }

  .section-heading {
    display: grid;
  }
}
</style>
