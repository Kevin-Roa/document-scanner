import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

// define your typings for the store state
export interface State {
	user: object | null;
	token?: string;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state: {
		user: null,
		token: undefined
	},
	mutations: {
		setUser(state, payload) {
			state.user = payload;
		},
		setToken(state, payload) {
			state.token = payload;
		}
	}
});

// define your own `useStore` composition function
export function useStore() {
	return baseUseStore(key);
}
