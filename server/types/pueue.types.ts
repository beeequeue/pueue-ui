export type PueuedStatusStashed = {
  Stashed: {
    enqueued_at: string
  }
}

export type PueuedStatusQueued = {
  Queued: {
    enqueued_at: string
  }
}

export type PueuedStatusRunning = {
  Running: {
    enqueued_at: string
    start: string
  }
}

export type PueuedStatusPaused = {
  Paused: {
    enqueued_at: string
    start: string
  }
}

export type PueuedStatusDone = {
  Done: {
    enqueued_at: string
    start: string
    end: string
    result: "Success" | { Failed: number }
  }
}

export type PueuedStatus =
  | PueuedStatusStashed
  | PueuedStatusQueued
  | PueuedStatusRunning
  | PueuedStatusPaused
  | PueuedStatusDone
export type PueuedStatusName = keyof (PueuedStatusStashed &
  PueuedStatusQueued &
  PueuedStatusRunning &
  PueuedStatusPaused &
  PueuedStatusDone)

export type PueuedTask<S extends PueuedStatus = PueuedStatus> = {
  id: number
  priority: number
  group: string | null
  label: string | null
  status: S
  command: string
  original_command: string
  dependencies: unknown[]
  created_at: string
  path: string
  envs: Record<string, string>
}

export type PueuedStatusResponse = {
  tasks: Record<`${number}`, PueuedTask>
  groups: Record<
    string,
    {
      status: "Running" | "Paused" | string
      parrallel_tasks: number
    }
  >
}
