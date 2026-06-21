<script setup lang="ts">
import { NEmpty } from "naive-ui";

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <NEmpty :description="description ?? title" />
</template>
