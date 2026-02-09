<template>
  <div
    class=":uno-tag: flex-inline py-.5 b-1 b-solid text-#eee items-center justify-center rounded-lg px-1.5 text-sm"
    :class="colorClasses"
  >
    <span v-if="prefix" class="mr-1">{{ prefix }}</span>
    <slot />
  </div>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"

const { prefix, color } = defineProps<{
  prefix?: string
  color?: "red" | "blue" | "green" | "yellow"
}>()

const colorClasses = computed(() => ({
  ":uno-tag-gray: b-warmgray-700 bg-warmgray-900": color == null,
  ":uno-tag-red: b-red-700 bg-red-950": color === "red",
  ":uno-tag-blue: b-blue-700 bg-blue-950": color === "blue",
  ":uno-tag-green: b-green-700 bg-green-950": color === "green",
}))
</script>
