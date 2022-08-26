import { sveltekit } from '@sveltejs/kit/vite';
const dev = process.env.NODE_ENV == 'development';

const config = {
	compilerOptions: { dev },
	plugins: [sveltekit()]
};

export default config;
