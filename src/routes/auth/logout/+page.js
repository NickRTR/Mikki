import { redirect } from "@sveltejs/kit";
import * as cookie from "cookie";

export async function load({ setHeaders }) {
	await supabase.auth.signOut();

	setHeaders({
		"set-cookie": cookie.serialize("session", "", {
			path: "/",
			expires: new Date(0)
		})
	});

	throw redirect(307, "/login");
}
