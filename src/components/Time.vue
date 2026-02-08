<template>
  <time :datetime="datetime.toString()">
    {{ formattedString }}
  </time>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"

import { globalNow, roundDuration } from "../utils/temporal.ts"

const { datetime, relativeTo, hideAffix } = defineProps<{
  datetime: Temporal.ZonedDateTime
  relativeTo?: Temporal.ZonedDateTime | boolean
  hideAffix?: boolean
}>()

const converted = computed(() => {
  if (!relativeTo) {
    return datetime.round({ smallestUnit: "seconds" })
  }

  const relativeDate = relativeTo === true ? globalNow.value : relativeTo
  return roundDuration(relativeDate.until(datetime))
})
const formattedDate = computed(() => {
  const actualDate = relativeTo ? (converted.value as Temporal.Duration).abs() : converted.value
  return actualDate.toLocaleString("en-GB", {
    style: "narrow",
    dateStyle: "short",
    timeStyle: "short",
  })
})

const formattedString = computed(() => {
  if (hideAffix || !relativeTo) return formattedDate.value

  const { sign } = converted.value as Temporal.Duration
  return sign === 1 ? `in\xA0${formattedDate.value}` : `${formattedDate.value}\xA0ago`
})
</script>
