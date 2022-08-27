import { redirect } from "@sveltejs/kit";
import * as cookie from "cookie";

export async function load({ setHeaders }) {
	setHeaders({
		"set-cookie": cookie.serialize("auth", "", {
			path: "/",
			expires: new Date(0)
		})
	});

	throw redirect(307, "/auth/login");
}
