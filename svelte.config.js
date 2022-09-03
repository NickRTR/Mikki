// import adapter from "@sveltejs/adapter-static";
import node from "@sveltejs/adapter-node";

export default {
	kit: {
		//adapter: node()
		adapter: node({
			// fallback: '200.html'
			pages: "build",
			assets: "build",
			fallback: null,
			precompress: false
		}),
		trailingSlash: "always"
	}
};
