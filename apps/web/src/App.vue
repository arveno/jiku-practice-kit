<script setup lang="ts">
import AppProviders from "./app/AppProviders.vue";
import AppShell from "./shared/layout/AppShell.vue";
</script>

<template>
  <AppProviders>
    <AppShell>
      <RouterView />
    </AppShell>
  </AppProviders>
</template>
