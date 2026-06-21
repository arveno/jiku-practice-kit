<script setup lang="ts">
import JkCard from "./JkCard.vue";

defineProps<{
  label: string;
  value: string | number;
}>();
</script>

<template>
  <JkCard>
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
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
</style>
