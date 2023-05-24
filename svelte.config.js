import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import preprocessReact from "svelte-preprocess-react/preprocessReact";

/** @type {import('@sveltejs/kit').Config} */
const config = {

	// preprocess: preprocessReact({
    preprocess: vitePreprocess(),
  // }),

	kit: {
		adapter: adapter()
	}
};

export default config;
