import { redirect } from "@sveltejs/kit";
import { baseApi } from "$lib/api";

export async function load({ parent }) {
	const { user } = await parent();

	if (!user) {
		throw redirect(307, "/");
	}

	const res = await fetch(baseApi + "/acc/check", {
		body: user.token,
		method: "POST"
	});

	const data = await res.json();

	if (data !== true) {
		throw redirect(307, "/");
	}

	return {
		data
	};
}
