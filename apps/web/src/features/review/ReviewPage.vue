<script setup lang="ts">
import { JkEmpty, JkPage, JkPageHeader } from "../../shared/ui";
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Review"
      title="复盘"
      description="基于本地 scorecard 查看弱项和练习反馈。"
    />
    <JkEmpty title="复盘视图即将接入" description="当前阶段先保留清晰入口。" />
  </JkPage>
</template>
