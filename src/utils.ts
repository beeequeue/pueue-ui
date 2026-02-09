import type {
  Task,
  TaskStatus,
  TaskStatusDone,
  TaskStatusPaused,
  TaskStatusQueued,
  TaskStatusRunning,
  TaskStatusStashed,
} from "../server/types/api.types.ts"

const buildPredicate =
  <Status extends TaskStatus>(name: Status["type"]) =>
  (task: Task): task is Task<Status> =>
    task.status.type === name

export const isTaskStashed = buildPredicate<TaskStatusStashed>("Stashed")
export const isTaskQueued = buildPredicate<TaskStatusQueued>("Queued")
export const isTaskRunning = buildPredicate<TaskStatusRunning>("Running")
export const isTaskPaused = buildPredicate<TaskStatusPaused>("Paused")
export const isTaskDone = buildPredicate<TaskStatusDone>("Done")
export const isTaskSuccess = (task: Task) => (task.status as TaskStatusDone)?.result === "Success"
export const isTaskFailed = (task: Task) =>
  typeof (task.status as TaskStatusDone)?.result === "string" &&
  (task.status as TaskStatusDone)?.result === "Failed"

export const getTaskStart = <S extends TaskStatus>(
  task: Task<S>,
): S extends TaskStatusDone | TaskStatusRunning | TaskStatusPaused
  ? Temporal.ZonedDateTime
  : Temporal.ZonedDateTime | null => {
  if (!isTaskDone(task) && !isTaskRunning(task) && !isTaskPaused(task)) return null!

  return Temporal.Instant.from(task.status.start).toZonedDateTimeISO(Temporal.Now.timeZoneId())
}
export const getTaskEnd = <S extends TaskStatus>(
  task: Task<S>,
): S extends TaskStatusDone ? Temporal.ZonedDateTime : Temporal.ZonedDateTime | null => {
  if (!isTaskDone(task)) return null!

  return Temporal.Instant.from(task.status.end).toZonedDateTimeISO(Temporal.Now.timeZoneId())
}
