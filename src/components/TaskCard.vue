<template>
  <div class="b-2 b-solid b-warmgray-700 rounded-lg px-3 py-2">
    <div class="mb-1 flex gap-1">
      <Tag prefix="ID" :color="statusColor">{{ task.id }}</Tag>
      <Tag v-if="task.group != null && task.group !== 'default'" prefix="G" color="blue">
        {{ task.group }}
      </Tag>
      <Tag v-if="task.label != null" prefix="L" color="yellow">{{ task.label }}</Tag>

      <span class="ml-auto flex gap-1">
        <Tag v-if="startedAt != null && endedAt == null">
          <Time relativeTo hideAffix :datetime="startedAt" />
        </Tag>
        <Tag v-if="duration" :color="statusColor">
          took&nbsp;
          <Duration :datetime="duration" />
        </Tag>
        <Tag v-if="endedAt">
          <Time relativeTo :datetime="endedAt" />
        </Tag>
      </span>
    </div>
    <pre class="inline! w-auto">{{ task.command }}</pre>
  </div>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"
import { type StatusString, type Task } from "../../server/lib/pueue.types.ts"
import Tag from "./Tag.vue"
import { getTaskEnd, getTaskStart, getTaskStatus, isTaskDone } from "../utils.ts"
import Duration from "./Duration.vue"
import Time from "./Time.vue"

const { task } = defineProps<{ task: Task }>()
const taskStatus = computed(() => getTaskStatus(task))

const statusColors = {
  Paused: "yellow",
  Running: "blue",
  Done: "green",
  Failed: "red",
} satisfies Record<StatusString, string>
const statusColor = computed(() => statusColors[taskStatus.value])

const startedAt = computed(() => getTaskStart(task))
const endedAt = computed(() => getTaskEnd(task))
const endedRelativeText = computed(() =>
  endedAt.value != null
    ? Temporal.Now.zonedDateTimeISO().until(endedAt.value).toLocaleString()
    : null,
)
const duration = computed(() =>
  isTaskDone(task) ? getTaskStart(task).until(endedAt.value!) : null,
)
</script>

<style scoped></style>
