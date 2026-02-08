<template>
  <time :datetime="datetime.toString()">
    {{ formatted }}
  </time>
</template>

<script setup vapor lang="ts">
import { computed } from "vue"

const { datetime } = defineProps<{ datetime: Temporal.Duration }>()

const rounded = computed(() => datetime.round({ smallestUnit: "milliseconds" }))
const formatted = computed(() =>
  rounded.value.toLocaleString("en-GB", {
    style: "narrow",
    numeric: "always",
  }),
)
</script>
