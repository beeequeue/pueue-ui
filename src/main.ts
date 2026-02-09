import { createVaporApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { routes } from "vue-router/auto-routes"

if (!("Temporal" in globalThis)) {
  await import("temporal-polyfill/global")
}

// @ts-ignore: tsgo doesnt support .vue
import App from "./App.vue"

const app = createVaporApp(App)
const router = createRouter({
  routes,
  history: createWebHistory(),
})
app.use(router)
app.mount("#app")
