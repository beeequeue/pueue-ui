export type TaskStatusStashed = {
  type: "Stashed"
  enqueued_at: string
}

export type TaskStatusQueued = {
  type: "Queued"
  enqueued_at: string
}

export type TaskStatusRunning = {
  type: "Running"
  enqueued_at: string
  start: string
}

export type TaskStatusPaused = {
  type: "Paused"
  enqueued_at: string
  start: string
}

export type TaskResult = "Success" | "Failed"

export type TaskStatusDone = {
  type: "Done"
  enqueued_at: string
  start: string
  end: string
  result: TaskResult
  exitCode: number
}

export type TaskStatus =
  | TaskStatusStashed
  | TaskStatusQueued
  | TaskStatusRunning
  | TaskStatusPaused
  | TaskStatusDone

export type TaskStatusName = TaskStatus["type"]

export type Task<Status extends TaskStatus = TaskStatus> = {
  id: number
  command: string
  original_command: string
  path: string
  group: string | null
  label: string | null
  priority: number
  dependencies: unknown[]
  envs?: Record<string, string>
  status: Status
  created_at: string
}

export type StatusBody = {
  tasks: Task[]
  groups: Record<
    string,
    {
      status: "Running" | "Paused" | string
      parrallel_tasks: number
    }
  >
}
