<template>
  <time :datetime="datetime.toString()">
    {{ formatted }}
    <span v-if="relative">ago</span>
  </time>
</template>

<script setup vapor lang="ts">
import { computed, watch } from "vue"

import { globalNow, roundDuration } from "../utils/temporal.ts"

const { datetime, relative } = defineProps<{
  datetime: Temporal.ZonedDateTime
  relative?: boolean
}>()

const converted = computed(() => {
  return relative
    ? roundDuration(globalNow.value.until(datetime)).abs()
    : datetime.round({ smallestUnit: "seconds" })
})
const formatted = computed(() =>
  converted.value.toLocaleString("en-GB", {
    style: "narrow",
    dateStyle: "short",
    timeStyle: "short",
  }),
)
</script>
