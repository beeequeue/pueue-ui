import { useLogger } from "evlog"
import { defineHandler } from "nitro/h3"

import { usePueued } from "../../lib/pueued.ts"

export default defineHandler(async (event) => {
  const log = useLogger(event)
  const p = usePueued(event)

  const status = await p.getStatus()
  log.set({ tasks: Object.keys(status.tasks).length })

  return status
})
