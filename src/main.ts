import { createVaporApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { routes } from "vue-router/auto-routes"
// oxlint-disable-next-line import/no-unassigned-import
import "temporal-polyfill-lite/types/global"

if (!("Temporal" in globalThis)) {
  await import("temporal-polyfill-lite/global")
}

// @ts-ignore: tsgo doesnt support .vue
import App from "./App.vue"

// @ts-ignore: tsgo issue
const app = createVaporApp(App)
const router = createRouter({
  routes,
  history: createWebHistory(),
})
app.use(router)
app.mount("#app")
