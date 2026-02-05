import { readonly, shallowRef } from "vue"

const client = shallowRef<unknown>()
const isReady = shallowRef(false)

export const useClient = () => {
  return {
    isReady: readonly(isReady),
    client: readonly(client),
  } as const
}
