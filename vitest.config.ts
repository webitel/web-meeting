import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// vite.config exports a callback (uses loadEnv(mode)), so resolve it with the
// current config env before merging — mergeConfig cannot merge a callback.
export default defineConfig((configEnv) =>
	mergeConfig(
		viteConfig(configEnv),
		defineConfig({
			test: {
				environment: 'jsdom',
				exclude: [
					...configDefaults.exclude,
					'e2e/**',
				],
				root: fileURLToPath(new URL('./', import.meta.url)),
				passWithNoTests: true,
			},
		}),
	),
);
