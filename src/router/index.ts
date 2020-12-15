import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home/',
		component: Tabs,
		children: [
			{
				path: '',
				redirect: '/home/scan'
			},
			{
				path: 'scan',
				component: () => import('@/views/Home.vue')
			},
			{
				path: 'search',
				component: () => import('@/views/Search.vue')
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
