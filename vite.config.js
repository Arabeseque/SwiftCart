import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), sentryVitePlugin({
    org: "other-sn",
    project: "business"
  })],

  build: {
    sourcemap: true
  }
})