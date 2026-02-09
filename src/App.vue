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
import type { StatusBody } from "../server/types/api.types.ts"
import TaskCard from "./components/TaskCard.vue"
import { isTaskDone, isTaskRunning } from "./utils.ts"

const data = ref<StatusBody | null>(null)
setInterval(() => {
  fetch("/api/status")
    .then((res) => res.json())
    .then((json) => (data.value = json))
}, 2000)

const tasks = computed(() => data.value?.tasks ?? [])
const runningTasks = computed(() =>
  tasks.value
    .filter(isTaskRunning)
    .toSorted((a, b) => b.status.start.localeCompare(a.status.start)),
)
const doneTasks = computed(() =>
  tasks.value.filter(isTaskDone).toSorted((a, b) => b.status.start.localeCompare(a.status.start)),
)
</script>
