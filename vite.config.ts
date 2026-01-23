import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

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
			lodash: 'lodash-es',
		},
		dedupe: [
			'vue',
		],
	},
	// fixes "has no export named "default" (or not default)
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern',
			},
		},
	},
	optimizeDeps: {
		include: [
			'ee-ts',
			'deepmerge',
			'deep-copy',
			'deep-equal',
			'clipboard-copy',
			'webitel-sdk',
		],
	},
});
