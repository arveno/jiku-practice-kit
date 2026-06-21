<script setup lang="ts">
import { NEmpty } from "naive-ui";

withDefaults(
  defineProps<{
    title: string;
    description?: string | undefined;
  }>(),
  {
    description: undefined
  }
);
</script>

<template>
  <div class="jk-empty">
    <NEmpty :description="title" />
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<style scoped>
.jk-empty {
  grid-column: 1 / -1;
  padding: 48px 0;
  text-align: center;
}

p {
  margin: 12px 0 0;
  color: #888888;
}
</style>
