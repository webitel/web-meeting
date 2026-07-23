import {
	createRouter,
	createWebHistory,
	type NavigationGuardWithThis,
	type Router,
	type RouteRecordRaw,
} from 'vue-router';
import TheApp from '../../the-app.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/:meetingId',
		name: 'meeting',
		component: TheApp,
	},
];

export let router: Router | null = null;

export const initRouter = async ({
	beforeEach = [],
}: {
	beforeEach?: NavigationGuardWithThis<undefined>[];
} = {}) => {
	const routerInstance = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes,
	});
	router = routerInstance;

	beforeEach.forEach((guard) => {
		routerInstance.beforeEach(guard);
	});

	return routerInstance;
};
