import { useIntervalFn } from "@vueuse/core"
import { shallowRef } from "vue"

export const globalNow = shallowRef(Temporal.Now.zonedDateTimeISO())

useIntervalFn(() => {
  globalNow.value = Temporal.Now.zonedDateTimeISO()
}, 1000)

export const relativeToNow = (date: Temporal.ZonedDateTime): string =>
  date.until(Temporal.Now.zonedDateTimeISO()).toString()

export const roundDuration = (duration: Temporal.Duration) => {
  const absolute = duration.abs()
  let unit: Temporal.SmallestUnit<Temporal.TimeUnit | Temporal.DateUnit> = "milliseconds"

  if (absolute.total("seconds") > 10 && absolute.total("minutes") < 30) {
    unit = "seconds"
  } else if (absolute.total("minutes") > 30 && absolute.total("hours") < 24) {
    unit = "minutes"
  } else if (absolute.total("days") < 1.5) {
    unit = "hours"
  } else if (absolute.total({ unit: "weeks", relativeTo: Temporal.Now.zonedDateTimeISO() }) < 14) {
    unit = "days"
  } else if (absolute.total({ unit: "months", relativeTo: Temporal.Now.zonedDateTimeISO() }) < 2) {
    unit = "weeks"
  } else if (absolute.total({ unit: "years", relativeTo: Temporal.Now.zonedDateTimeISO() }) < 2) {
    unit = "months"
  } else if (absolute.total({ unit: "years", relativeTo: Temporal.Now.zonedDateTimeISO() }) >= 2) {
    unit = "years"
  }

  return duration.round({ smallestUnit: unit })
}
