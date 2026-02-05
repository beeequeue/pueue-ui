<template>
  <div>
    Running jobs:
    <div v-for="job in jobs" :key="job.id">
      {{ job.id }}
    </div>
  </div>
</template>

<script setup vapor lang="ts">
import { ref } from "vue"

const jobs = ref<{ id: string }[]>([])
</script>

<style scoped></style>
