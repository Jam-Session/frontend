import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export function makeLocalStore<T>(key: string, defaultValue: T) {
	const store = writable<T>(defaultValue);

	if (browser) {
		const storedValue = window.localStorage.getItem(key);
		if (storedValue) {
			try {
				store.set(JSON.parse(storedValue));
			} catch (e) {
				console.error(e);
				store.set(defaultValue);
			}
		}

		store.subscribe((value) => {
			window.localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export default makeLocalStore;
