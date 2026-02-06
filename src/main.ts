import { VueQueryPlugin } from "@tanstack/vue-query"
import { createVaporApp } from "vue"

// @ts-ignore: tsgo doesnt support .vue
import App from "./App.vue"

const app = createVaporApp(App)
app.use(VueQueryPlugin)
app.mount("#app")
