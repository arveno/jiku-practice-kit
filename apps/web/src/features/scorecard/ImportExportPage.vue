<script setup lang="ts">
import { computed, ref } from "vue";
import { JkCard, JkPage, JkPageHeader, JkStatCard } from "../../shared/ui";
import { createScorecardExport } from "./exportScorecard";
import { useScorecardStore } from "./store";

const scorecardStore = useScorecardStore();
scorecardStore.load();

const importText = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const scorecardExport = computed(() => createScorecardExport(scorecardStore.scorecard));
const scorecardExportHref = computed(
  () =>
    `data:${scorecardExport.value.mimeType};charset=utf-8,${encodeURIComponent(
      scorecardExport.value.content
    )}`
);

function clearMessages() {
  errorMessage.value = "";
  successMessage.value = "";
}

function announceExport() {
  clearMessages();
  successMessage.value = `已生成 ${scorecardExport.value.fileName}`;
}

function importScorecard() {
  clearMessages();

  try {
    scorecardStore.importFromJson(JSON.parse(importText.value));
    importText.value = "";
    successMessage.value = "导入成功。";
  } catch {
    errorMessage.value = "导入失败：JSON 格式或 scorecard 校验不通过。";
  }
}

function resetScorecard() {
  clearMessages();
  scorecardStore.reset();
  successMessage.value = "已清空本地评分。";
}
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Local scorecard"
      title="导入导出"
      description="本地练习记录的备份、恢复与清空。"
    />

    <section class="stats-grid" aria-label="scorecard 统计">
      <JkStatCard label="已练题数" :value="scorecardStore.stats.practicedCount" />
      <JkStatCard
        label="平均分"
        :value="scorecardStore.stats.averageLatestScore.toFixed(1)"
      />
      <JkStatCard label="弱项数量" :value="scorecardStore.stats.weakCount" />
    </section>

    <p v-if="successMessage" class="message success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>

    <section class="tool-grid" aria-label="scorecard 工具">
      <JkCard>
        <div class="section-heading">
          <h2>导出</h2>
          <a
            class="button-link"
            :href="scorecardExportHref"
            :download="scorecardExport.fileName"
            @click="announceExport"
          >
            下载 JSON
          </a>
        </div>
        <pre>{{ scorecardExport.content }}</pre>
      </JkCard>

      <JkCard>
        <div class="section-heading">
          <h2>导入</h2>
          <button type="button" @click="importScorecard">导入 JSON</button>
        </div>
        <textarea
          v-model="importText"
          rows="12"
          spellcheck="false"
          placeholder="粘贴 scorecard JSON"
        />
      </JkCard>

      <JkCard>
        <div class="section-heading">
          <h2>清空</h2>
          <button type="button" class="danger" @click="resetScorecard">清空评分</button>
        </div>
        <p class="muted">清空后会写入一个新的空 scorecard。</p>
      </JkCard>
    </section>
  </JkPage>
</template>

<style scoped>
.stats-grid,
.tool-grid {
  display: grid;
  gap: 16px;
}

.stats-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 16px;
}

.tool-grid {
  grid-template-columns: 1fr;
}

.stats-grid :deep(.jk-card),
.tool-grid :deep(.jk-card) {
  min-width: 0;
}

.section-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

h2,
p {
  margin: 0;
}

h2 {
  color: #171717;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

button,
.button-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
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

button.danger {
  background: #ee0000;
}

pre,
textarea {
  box-sizing: border-box;
  width: 100%;
  margin: 16px 0 0;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  background: #fafafa;
  color: #171717;
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 18px;
}

pre {
  overflow: auto;
  max-height: 320px;
  padding: 12px;
}

textarea {
  min-height: 220px;
  padding: 12px;
  resize: vertical;
}

.message {
  margin: 0 0 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 12px;
}

.success {
  background: #d3e5ff;
  color: #0761d1;
}

.error {
  background: #f7d4d6;
  color: #c50000;
}

.muted {
  margin-top: 12px;
  color: #666666;
  line-height: 24px;
}

@media (max-width: 720px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    display: grid;
  }
}
</style>
