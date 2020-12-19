import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { IonicVue } from '@ionic/vue';
import { auth } from './firebase';
import './ionic';

import BaseLayout from './components/BaseLayout.vue';

let app: any;
auth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App)
			.use(IonicVue)
			.use(router)
			.use(store, key)
			.component('base-layout', BaseLayout);

		router.isReady().then(() => {
			app.mount('#app');
		});
	}
});
