export type StatusStashed = {
  Stashed: {
    enqueued_at: string
  }
}

export type StatusQueued = {
  Queued: {
    enqueued_at: string
  }
}

export type StatusRunning = {
  Running: {
    enqueued_at: string
    start: string
  }
}

export type StatusPaused = {
  Paused: {
    enqueued_at: string
    start: string
  }
}

export type StatusDone = {
  Done: {
    enqueued_at: string
    start: string
    end: string
    result: "Success" | string
  }
}

export type Status = StatusStashed | StatusQueued | StatusRunning | StatusPaused | StatusDone
export type StatusString = keyof (StatusStashed &
  StatusQueued &
  StatusRunning &
  StatusPaused &
  StatusDone)

export type Task<S extends Status = Status> = {
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

export type StatusResponse = {
  tasks: Record<`${number}`, Task>
  groups: Record<
    string,
    {
      status: "Running" | "Paused" | string
      parrallel_tasks: number
    }
  >
}
