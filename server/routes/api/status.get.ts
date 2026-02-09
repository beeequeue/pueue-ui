import { useLogger } from "evlog"
import { defineHandler } from "nitro/h3"

import { transformTask } from "../../lib/pueue.utils.ts"
import { usePueued } from "../../lib/pueued.ts"
import { type StatusBody } from "../../types/api.types.ts"

export default defineHandler(async (event) => {
  const log = useLogger(event)
  const p = usePueued(event)

  const data = await p.getStatus()
  log.set({ tasks: Object.keys(data.tasks).length })

  return {
    tasks: Object.values(data.tasks).map(transformTask(false)),
    groups: data.groups,
  } satisfies StatusBody
})
