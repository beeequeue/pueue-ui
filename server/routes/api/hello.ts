import { useLogger } from "evlog"
import { defineHandler } from "nitro/h3"

export default defineHandler((event) => {
  const logger = useLogger(event)

  logger.set({ hello: "world" })

  return { hello: "world" }
})
