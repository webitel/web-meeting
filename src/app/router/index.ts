import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from 'vue-router';
import { WtApplication } from '@webitel/ui-sdk/enums';
import TheApp from '../../the-app.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/:meetingId',
		name: 'meeting',
		component: TheApp,
		meta: {
			WtApplication: WtApplication.Meet,
		},
	},
];

export let router = null;

export const initRouter = async ({ beforeEach = [] } = {}) => {
	router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes,
	});

	beforeEach.forEach((guard) => {
		router.beforeEach(guard);
	});

	return router;
};
