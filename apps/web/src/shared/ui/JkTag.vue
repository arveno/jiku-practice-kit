<script setup lang="ts">
import { NTag } from "naive-ui";

type JkTagType = "default" | "primary" | "success" | "warning" | "error" | "info";

withDefaults(
  defineProps<{
    type?: JkTagType;
  }>(),
  {
    type: "default"
  }
);
</script>

<template>
  <NTag :bordered="false" :type="type" round size="small">
    <slot />
  </NTag>
</template>
