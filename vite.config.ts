import unocss from "@unocss/vite"
import vue from "@vitejs/plugin-vue"
import { nitro } from "nitro/vite"
import sonda from "sonda/vite"
import { defineConfig } from "vite"
import vueRouter from "vue-router/vite"

export default defineConfig(() => ({
  experimental: { enableNativePlugin: true },

  build: {
    sourcemap: true,
  },

  nitro: {
    serverDir: "./server",
    runtimeConfig: {
      evlog: {
        include: ["/api/**"],
        env: { region: undefined },
      },
    },

    compatibilityDate: "2026-02-05" as const,
    minify: true,
    sourcemap: true,

    experimental: {
      openAPI: true,
    },

    plugins: ["./server/plugins/evlog.ts"],
  },

  plugins: [
    nitro(),
    unocss({
      mode: "per-module",
      inspector: false,
    }),
    vue({
      script: { vapor: true },
      template: { vapor: true },
      features: { optionsAPI: false },
    }),
    vueRouter({
      dts: "src/route-map.d.ts",
    }),
    sonda({ enabled: !!process.env.ANALYZE, deep: true, open: "html", sources: true }),
  ],
}))
