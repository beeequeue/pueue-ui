import { createVaporApp } from "vue"

// @ts-ignore: tsgo doesnt support .vue
import App from "./App.vue"

createVaporApp(App).mount("#app")
