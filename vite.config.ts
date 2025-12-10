import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return defineConfig({
		base: '/meet',
		define: {
			'process.env': JSON.stringify(env),
		},
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
};
