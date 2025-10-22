import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'cursor',
    }),
  ],
  server: {
    port: 8080,
    // https: true,
  },
  resolve: {
    alias: {
      '@aliasedDeps/api-services/axios': resolve(
        __dirname,
        'src/app/api/instance',
      ),
    },
    dedupe: ['vue'],
  },
  // fixes "has no export named "default" (or not default)
  // optimizeDeps: {
  //   include: ['ee-ts', 'webitel-sdk', 'deepmerge', 'deep-copy', 'lodash-es', 'lodash', '@webitel/ui-sdk'],
  // },
})
