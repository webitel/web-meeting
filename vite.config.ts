import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/meet',
  build: {
    chunkSizeWarningLimit: 20000,
    // rolldownOptions: {
    //   external: ['webitel-sdk'],
    // },
  },
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
      'lodash': 'lodash-es',
    },
    dedupe: ['vue'],
  },
  // fixes "has no export named "default" (or not default)
  optimizeDeps: {
    include: ['ee-ts', 'deepmerge', 'deep-copy', 'deep-equal', 'clipboard-copy', 'webitel-sdk'],
  },
})
