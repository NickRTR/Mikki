import { parse } from "cookie";

export async function load({ request }) {
	const cookieString = request.headers.get("cookie");
	if (cookieString !== null) {
		const cookies = parse(request.headers.get("cookie"));
		if (cookies.auth) {
			return {
				user: {
					token: cookies.auth
				},
				displayLink: false
			};
		}
	}
}

// export const prerender = {
// 	default: true,
// 	onError: ({ status, path, referrer, referenceType }) => {
// 		console.log(status, path, referrer, referenceType);
// 	}
// };

export const prerender = true;
