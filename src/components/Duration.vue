<template>
  <time :datetime="duration.toString()">
    {{ formatted }}
  </time>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"

const { duration } = defineProps<{ duration: Temporal.Duration }>()

const rounded = computed(() => duration.round({ smallestUnit: "milliseconds" }))
const formatted = computed(() =>
  rounded.value.toLocaleString("en-GB", {
    style: "narrow",
    numeric: "always",
  }),
)
</script>
