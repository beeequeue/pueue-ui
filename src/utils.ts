import type {
  Status,
  StatusDone,
  StatusPaused,
  StatusQueued,
  StatusRunning,
  StatusStashed,
  StatusString,
  Task,
} from "../server/lib/pueue.types.ts"

const buildPredicate =
  <StatusName extends Status>(name: keyof StatusName) =>
  (task: Task): task is Task<StatusName> =>
    name in task.status

export const isTaskStashed = buildPredicate<StatusStashed>("Stashed")
export const isTaskQueued = buildPredicate<StatusQueued>("Queued")
export const isTaskRunning = buildPredicate<StatusRunning>("Running")
export const isTaskPaused = buildPredicate<StatusPaused>("Paused")
export const isTaskDone = buildPredicate<StatusDone>("Done")

export const getTaskStatus = (task: Task): StatusString =>
  Object.keys(task.status)[0] as StatusString

// TODO: use browser timezone
export const getTaskStart = <S extends Status>(
  task: Task<S>,
): S extends StatusDone | StatusRunning | StatusPaused
  ? Temporal.ZonedDateTime
  : Temporal.ZonedDateTime | null => {
  const start =
    (task.status as StatusDone)?.Done?.start ??
    (task.status as StatusRunning)?.Running?.start ??
    (task.status as StatusPaused)?.Paused?.start
  if (start == null) return null!

  return Temporal.Instant.from(start).toZonedDateTimeISO("Europe/Stockholm")
}
export const getTaskEnd = <S extends Status>(
  task: Task<S>,
): S extends StatusDone ? Temporal.ZonedDateTime : Temporal.ZonedDateTime | null => {
  const end = (task.status as StatusDone)?.Done?.end
  if (end == null) return null!

  return Temporal.Instant.from(end).toZonedDateTimeISO("Europe/Stockholm")
}
