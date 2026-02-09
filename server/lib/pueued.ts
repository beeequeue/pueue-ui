import { Buffer } from "node:buffer"
import { readFileSync } from "node:fs"
import path from "node:path"
import { connect, type TLSSocket } from "node:tls"

import { decode } from "cbor-x/decode-no-eval"
import { encode } from "cbor-x/encode"
import { useLogger } from "evlog"
import { type H3Event } from "nitro/h3"

import { type PueuedStatusResponse } from "../types/pueue.types.ts"

const PACKET_SIZE = 1280

const buildMessageParts = (data: Uint8Array): [Uint8Array, Uint8Array[]] => {
  const size = data.byteLength
  const header = Buffer.alloc(8)
  header.writeBigUInt64BE(BigInt(size))

  if (size < PACKET_SIZE) {
    return [header, [data]]
  }

  const packets: Uint8Array[] = []
  for (let i = 0; i < size; i += PACKET_SIZE) {
    packets.push(data.subarray(i, i + PACKET_SIZE))
  }
  return [header, packets]
}

const sendMessage = (socket: TLSSocket, message: Uint8Array) => {
  const { promise, resolve } = Promise.withResolvers<Uint8Array>()

  let incomingSize = -1
  let incomingData: Buffer | null = null
  let readSize = 0
  const handler = (incoming: Buffer) => {
    if (incomingSize === -1) {
      incomingSize = Number(incoming.readBigUInt64BE())
      incomingData = Buffer.alloc(incomingSize)
    } else {
      readSize += incoming.copy(incomingData!, readSize, 0, PACKET_SIZE)
    }

    if (readSize === incomingSize) {
      resolve(new Uint8Array(incomingData!))
      socket.removeListener("data", handler)
    }
  }
  socket.addListener("data", handler)

  const [header, parts] = buildMessageParts(message)
  socket.write(header)
  for (const part of parts) {
    socket.write(part)
  }

  return promise
}

const loadSharedSecret = () =>
  readFileSync(path.join(process.env.LOCALAPPDATA!, "pueue", "shared_secret"))
let sharedSecret: Buffer | undefined

let connection: Promise<TLSSocket> | null = null

const initConnection = async (event: H3Event) => {
  const logger = useLogger(event)

  const { promise, resolve, reject: _reject } = Promise.withResolvers<TLSSocket>()
  connection = promise

  const socket = connect(
    {
      host: "127.0.0.1",
      port: 6925,
      timeout: 1000, // TODO: make configurable
      rejectUnauthorized: false,
    },
    () => {
      logger.set({ pueued: { status: "connected" } })
    },
  )

  socket.on("close", async () => {
    ;(await connection)?.destroySoon()
    connection = null
    logger.set({ pueued: { status: "closed" } })
  })
  socket.on("error", async (error) => {
    ;(await connection)?.destroySoon()
    connection = null
    logger.set({ pueued: { status: "error" } })
    logger.error(error)
  })

  sharedSecret ??= loadSharedSecret()
  const versionBuffer = await sendMessage(socket, sharedSecret)
  logger.set({ pueued: { version: new TextDecoder().decode(versionBuffer) } })

  resolve(socket)
}

export const usePueued = (event: H3Event) => {
  // const logger = useLogger(event)

  if (connection == null) void initConnection(event)

  const getStatus = async () => {
    const data = await sendMessage(await connection!, encode("Status"))

    return decode(data).Status as PueuedStatusResponse
  }

  return { getStatus } as const
}
