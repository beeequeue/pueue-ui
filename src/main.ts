import { createVaporApp } from "vue"

if (!("Temporal" in globalThis)) {
  await import("temporal-polyfill/global")
}

// @ts-ignore: tsgo doesnt support .vue
import App from "./App.vue"

const app = createVaporApp(App)
app.mount("#app")
