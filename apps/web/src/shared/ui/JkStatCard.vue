<script setup lang="ts">
import JkCard from "./JkCard.vue";

defineProps<{
  label: string;
  value: string | number;
  caption?: string;
}>();
</script>

<template>
  <JkCard>
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <small v-if="caption">{{ caption }}</small>
  </JkCard>
</template>

<style scoped>
span {
  display: block;
  color: #666666;
  font-size: 14px;
}

strong {
  display: block;
  margin-top: 8px;
  font-size: 32px;
  font-weight: 600;
}

small {
  display: block;
  margin-top: 8px;
  color: #888888;
  font-size: 12px;
  line-height: 16px;
}
</style>
