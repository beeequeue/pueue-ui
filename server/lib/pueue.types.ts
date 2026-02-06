export type StatusDone = {
  Done: {
    enqueued_at: string
    start: string
    end: string
    result: "Success" | string
  }
}

export type Status = StatusDone

export type Task = {
  id: number
  priority: number
  group: string
  label: string | null
  status: Status
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
      status: "Running" | string
      parrallel_tasks: number
    }
  >
}
