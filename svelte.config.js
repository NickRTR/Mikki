import adapter from "@sveltejs/adapter-static";
//import node from "@sveltejs/adapter-node";

const dev = process.env.NODE_ENV == "development"

export default {
	kit: {

		//adapter: node()
		adapter: adapter({
			// fallback: '200.html'
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false
		}),

		vite: {
			compilerOptions: { dev },
		},
		prerender: {
			default: true,
			onError: ({ status, path, referrer, referenceType }) => {
				console.log(status, path, referrer, referenceType)
			}
		},
		trailingSlash: "always",
	}
};
