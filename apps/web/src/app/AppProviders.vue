<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NMessageProvider
} from "naive-ui";
import { naiveTheme } from "./naiveTheme";
</script>

<template>
  <NConfigProvider :theme-overrides="naiveTheme">
    <NGlobalStyle />
    <NDialogProvider>
      <NMessageProvider>
        <slot />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
