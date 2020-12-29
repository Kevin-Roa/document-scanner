import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { IonicVue } from '@ionic/vue';
import { auth } from './firebase';
import './ionic';
require('dotenv').config();

let app: any;
auth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App)
			.use(IonicVue)
			.use(router)
			.use(store, key);

		router.isReady().then(() => {
			app.mount('#app');
		});
	}
});
