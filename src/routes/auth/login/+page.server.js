import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
	console.log("hallooooo");
	const { user } = await parent();
	console.log(user);
	if (user) {
		throw redirect(307, "/");
	}
	// ...
}
