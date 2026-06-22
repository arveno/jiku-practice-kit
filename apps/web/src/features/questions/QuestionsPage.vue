<script setup lang="ts">
import { JkEmpty, JkPage, JkPageHeader } from "../../shared/ui";
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Question bank"
      title="题库"
      description="按分类、专题和标签浏览 free 示例题。"
    />
    <JkEmpty title="题库列表即将接入" description="下一步会复用 domain 筛选能力。" />
  </JkPage>
</template>
