import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isStagingEnv = !!env.VITE_STAGING_ENV;

	return defineConfig({
		base: '/meet',
		build: {
			sourcemap: isStagingEnv,
			minify: !isStagingEnv, // Disable minification for readable debugging
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
			// host: true,  // uncomment me to enable localhost access by IP (including from other devices in the network)
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
