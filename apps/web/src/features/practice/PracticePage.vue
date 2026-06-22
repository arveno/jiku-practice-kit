<script setup lang="ts">
import { JkEmpty, JkPage, JkPageHeader } from "../../shared/ui";
</script>

<template>
  <JkPage>
    <JkPageHeader
      eyebrow="Practice"
      title="练习"
      description="从题库选择题目并记录本地得分。"
    />
    <JkEmpty
      title="练习入口即将接入"
      description="当前阶段先准备导航和本地状态边界。"
    />
  </JkPage>
</template>
