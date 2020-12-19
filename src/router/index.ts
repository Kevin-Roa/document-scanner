import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('@/views/Home.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/login',
		component: () => import('@/views/Login.vue'),
		meta: {
			requiresGuest: true
		}
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!auth.currentUser) {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			});
		} else {
			next();
		}
	} else if (to.matched.some((record) => record.meta.requiresGuest)) {
		if (auth.currentUser) {
			next({
				path: '/',
				query: { redirect: to.fullPath }
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
