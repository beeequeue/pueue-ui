import { type Task, type TaskStatus, type TaskStatusName } from "../types/api.types.ts"
import { type PueuedTask } from "../types/pueue.types.ts"

export const transformTask =
  (includeEnvs: boolean) =>
  (input: PueuedTask): Task => {
    const statusName = Object.keys(input.status)[0] as TaskStatusName
    const status = {
      type: statusName,
      ...(input.status as any)[statusName],
    } satisfies TaskStatus
    if (status.type === "Done") {
      status.exitCode = status.result === "Success" ? 0 : status.result.Failed
      status.result = status.result === "Success" ? "Success" : "Failed"
    }

    const task: Task = {
      id: input.id,
      command: input.command,
      original_command: input.original_command,
      path: input.path,
      group: input.group,
      label: input.label,
      priority: input.priority,
      dependencies: input.dependencies,
      status,
      created_at: input.created_at,
    }

    if (includeEnvs) {
      task.envs = structuredClone(input.envs)
      for (const name in task.envs) {
        if (task.envs[name] == null) continue

        const tooLong = task.envs[name].length > 10
        task.envs[name] = task.envs[name].slice(0, 10) + (tooLong ? "[...]" : "")
      }
    }

    return task
  }
