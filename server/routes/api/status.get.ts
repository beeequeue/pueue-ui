import { defineHandler } from "nitro/h3"

import { usePueued } from "../../lib/pueued.ts"

export default defineHandler(async (event) => {
  const p = usePueued(event)

  return p.getStatus()
})
