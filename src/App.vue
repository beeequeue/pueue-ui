<template>
  <div>
    Running jobs:
    <div v-for="job in runningJobs" :key="job.id">
      {{ job.id }} -
      <pre class="inline! w-auto">{{ job.command }}</pre>
    </div>
  </div>
  <div>
    Finished jobs:
    <div v-for="job in doneJobs" :key="job.id">
      {{ job.id }} -
      <pre class="inline! w-auto">{{ job.command }}</pre>
    </div>
  </div>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"
import type { StatusResponse } from "../server/lib/pueue.types.ts"

const { data } = useQuery<StatusResponse>({
  queryKey: ["status"],
  queryFn: () => fetch("/api/status").then((r) => r.json()),
})

const jobs = computed(() => Object.values(data.value?.tasks ?? {}))
const runningJobs = computed(() => jobs.value.filter((j) => "Running" in j.status))
const doneJobs = computed(() => jobs.value.filter((j) => "Done" in j.status))
</script>

<style scoped></style>
