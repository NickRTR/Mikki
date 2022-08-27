import supabase from "$lib/supabase";
import * as cookie from "cookie";

export async function load() {
	await supabase.auth.signOut();

	return {
		status: 303,
		headers: {
			location: "/auth/login",
			"Set-Cookie": cookie.serialize("session", "", {
				path: "/",
				expires: new Date(0)
			})
		}
	};
}
