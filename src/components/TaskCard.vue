<template>
  <div class=":uno-taskcard: b-2 b-solid b-warmgray-700 rounded-lg px-3 py-2">
    <div class="mb-1 flex gap-1">
      <Tag prefix="ID" :color="statusColor">{{ task.id }}</Tag>
      <Tag v-if="task.group != null && task.group !== 'default'" prefix="G" color="blue">
        {{ task.group }}
      </Tag>
      <Tag v-if="task.label != null" prefix="L" color="yellow">{{ task.label }}</Tag>

      <span class="ml-auto flex gap-1">
        <!-- Running -->
        <Tag v-if="startedAt != null && endedAt == null" color="blue">
          <i class="i-svg-spinners:12-dots-scale-rotate mr-1" />
          <Time relativeTo hideAffix rounding="seconds" :datetime="startedAt" />
        </Tag>
        <!-- Done -->
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
import Tag from "./Tag.vue"
import { getTaskEnd, getTaskStart, isTaskDone } from "../utils.ts"
import Duration from "./Duration.vue"
import Time from "./Time.vue"
import type {
  Task,
  TaskResult,
  TaskStatusDone,
  TaskStatusName,
} from "../../server/types/api.types.ts"

const { task } = defineProps<{ task: Task }>()
const status = computed(() => task.status.type)
const result = computed<TaskResult | null>(() => (task.status as TaskStatusDone).result ?? null)

const statusColors = {
  Paused: "yellow" as const,
  Stashed: "yellow" as const,
  Running: "blue" as const,
  Success: "green" as const,
  Failed: "red" as const,
} satisfies { [key in TaskStatusName | TaskResult]?: string }
const statusColor = computed(
  () => statusColors[(result.value ?? status.value) as keyof typeof statusColors],
)

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
