<script setup lang="ts">
import { NCard } from "naive-ui";
</script>

<template>
  <NCard class="jk-card" :bordered="true">
    <slot />
  </NCard>
</template>

<style scoped>
.jk-card {
  box-shadow:
    0 1px 1px #00000005,
    0 2px 2px #0000000a;
}
</style>
