<template>
  <time :datetime="datetime.toString()">
    {{ formattedString }}
  </time>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"

import { globalNow, roundDuration } from "../utils/temporal.ts"

const { datetime, relativeTo, hideAffix, rounding } = defineProps<{
  datetime: Temporal.ZonedDateTime
  relativeTo?: Temporal.ZonedDateTime | boolean
  hideAffix?: boolean
  rounding?: Temporal.PluralizeUnit<Temporal.TimeUnit>
}>()

const converted = computed(() => {
  if (!relativeTo) {
    return datetime.round({ smallestUnit: "seconds" })
  }

  const relativeDate = relativeTo === true ? globalNow.value : relativeTo
  const until = relativeDate.until(datetime)
  return rounding ? until.round({ smallestUnit: rounding }) : roundDuration(until)
})
const formattedDate = computed(() => {
  if ("abs" in converted.value) {
    return converted.value.abs().toLocaleString("en-GB", {
      style: "narrow",
    })
  }

  return converted.value.toLocaleString("en-GB", {
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
