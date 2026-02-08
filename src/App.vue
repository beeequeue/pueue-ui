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
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"
import type { StatusResponse } from "../server/lib/pueue.types.ts"
import TaskCard from "./components/TaskCard.vue"

const { data } = useQuery<StatusResponse>({
  queryKey: ["status"],
  queryFn: () => fetch("/api/status").then((r) => r.json()),
})

const tasks = computed(() => Object.values(data.value?.tasks ?? {}))
const runningTasks = computed(() => tasks.value.filter((j) => "Running" in j.status))
const doneTasks = computed(() => tasks.value.filter((j) => "Done" in j.status))
</script>

<style scoped></style>
