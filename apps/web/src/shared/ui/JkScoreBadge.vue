<script setup lang="ts">
import JkTag from "./JkTag.vue";

type JkTagType = "default" | "primary" | "success" | "warning" | "error" | "info";

withDefaults(
  defineProps<{
    score: number;
    max?: number;
    label?: string | undefined;
    type?: JkTagType;
  }>(),
  {
    max: 10,
    label: undefined,
    type: "default"
  }
);
</script>

<template>
  <JkTag :type="type">{{ label ?? `${score}/${max}` }}</JkTag>
</template>
