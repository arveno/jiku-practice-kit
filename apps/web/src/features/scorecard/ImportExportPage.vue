<script setup lang="ts">
import { JkEmpty, JkPage, JkPageHeader } from "../../shared/ui";
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Local scorecard"
      title="导入导出"
      description="管理浏览器本地练习记录。"
    />
    <JkEmpty title="导入导出即将接入" description="storage 和校验边界已经就绪。" />
  </JkPage>
</template>
