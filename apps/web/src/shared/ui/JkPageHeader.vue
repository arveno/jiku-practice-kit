<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
}>();
</script>

<template>
  <header class="jk-page-header">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <p v-if="description" class="lead">{{ description }}</p>
  </header>
</template>

<style scoped>
.jk-page-header {
  padding: 64px 0 48px;
}

.eyebrow {
  margin: 0;
  color: #666666;
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
}

h1 {
  max-width: 760px;
  margin: 12px 0 0;
  color: #171717;
  font-size: 64px;
  font-weight: 600;
  line-height: 0.95;
}

.lead {
  max-width: 620px;
  margin: 24px 0 0;
  color: #4d4d4d;
  font-size: 18px;
  line-height: 28px;
}

@media (max-width: 720px) {
  h1 {
    font-size: 40px;
  }
}
</style>
