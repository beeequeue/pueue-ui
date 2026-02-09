<template>
  <div class="p-4">
    <div>
      Running tasks:
      <TaskCard v-for="task in runningTasks" :key="task.id" :task="task" />
    </div>
    <div>
      Finished tasks:
      <TaskCard v-for="task in doneTasks" :key="task.id" :task="task" />
    </div>
  </div>
</template>

<script setup vapor lang="ts">
import { computed, ref } from "vue"
import TaskCard from "./components/TaskCard.vue"
import type { StatusBody } from "../server/types/api.types.ts"

const data = ref<StatusBody | null>(null)
fetch("/api/status")
  .then((res) => res.json())
  .then((json) => (data.value = json))

const tasks = computed(() => data.value?.tasks ?? [])
const runningTasks = computed(() => tasks.value.filter((j) => j.status.type === "Running"))
const doneTasks = computed(() => tasks.value.filter((j) => j.status.type === "Done"))
</script>
