<template>
  <main class="jk-page">
    <slot />
  </main>
</template>

<style scoped>
.jk-page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 64px 0;
}
</style>
