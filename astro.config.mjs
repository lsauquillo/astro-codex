// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "static",
  adapter: netlify(),
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
});