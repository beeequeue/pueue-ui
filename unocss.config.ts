import { presetIcons } from "@unocss/preset-icons"
import { presetWind3 } from "@unocss/preset-wind3"
import transformerCompileClass from "@unocss/transformer-compile-class"
import transformerDirectives from "@unocss/transformer-directives"
import { defineConfig } from "@unocss/vite"

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    // presetWebFonts({
    //   fonts: {
    //     sans: "Rubik:400",
    //     serif: "Alegreya:400,700,900",
    //   },
    // }),
  ],
  transformers: [
    transformerDirectives(),
    transformerCompileClass({
      alwaysHash: true,
      classPrefix: "u-",
    }),
  ],
  separators: [":"],
  rules: [
    [/^aspect-(\d+)\/(\d+)$/, (v) => ({ "aspect-ratio": `${v[1]}/${v[2]}` })],
    [/^stroke-(.+)$/, (v) => ({ "-webkit-text-stroke-color": v[1] })],
    [/^stroke-(\d+)$/, (v) => ({ "-webkit-text-stroke-width": `${v[1]}px` })],
    [/^underline-offset-(\d+)$/, (v) => ({ "text-underline-offset": `${v[1]}px` })],
  ],
  shortcuts: {
    "grayed-out": "filter brightness-50 grayscale-50 opacity-85",
    disabled: "grayed-out pointer-events-none",
    "flex-col": "flex flex-col",
    "flex-center": "flex justify-center items-center",
  },
  theme: {
    colors: {
      bsky: "oklch(0.6262 0.2026 255.39)",

      bg: {
        1: "oklch(0.20 0.015 260)",
        2: "oklch(0.25 0.024 255)",
        3: "oklch(0.27 0.025 260)",
        4: "oklch(0.32 0.033 262)",
        5: "oklch(0.48 0.0644 7.31)",
      },
      fg: {
        main: "oklch(0.78 0.1265 20.33)",
        small: "oklch(0.89 0.058 18.3)",
      },
      highlight: "oklch(0.65 0.2504 8.21)",
      trans: "transparent",
      current: "currentColor",
    },
    fontSize: {
      xs: ["0.7rem", "1rem"],
      sm: ["0.85rem", "1rem"],
      base: ["1rem", "1rem"],
      lg: ["1.25rem", "1.15rem"],
      xl: ["1.5rem", "1.25rem"],
      "2xl": ["1.75rem", "1.5rem"],
      "3xl": ["2rem", "1.5rem"],
      "4xl": ["2.5rem", "1.75rem"],
    },
  },
})
