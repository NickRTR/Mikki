import { redirect } from "@sveltejs/kit";
import { baseApi } from "$lib/api";
import * as cookie from "cookie";

export async function load({ parent }) {
	const { user } = await parent();
	if (user) {
		throw redirect(307, "/");
	}
}

// export const prerender = false;

export async function POST({ request, setHeaders }) {
	const form = await request.formData();
	const email = form.get("email");
	const password = form.get("password");

	if (typeof email !== "string" || typeof password !== "string") {
		return {
			errors: {
				message: "Enter a valid email and password."
			}
		};
	}

	if (!email || !password) {
		return {
			errors: {
				message: "Email and password are required."
			}
		};
	}

	const result = await fetch(baseApi + "/acc/login", {
		body: JSON.stringify({ username: email, password }),
		method: "POST"
	});

	const data = await result.json();

	if (data.error) {
		return {
			errors: {
				message: data.error
			}
		};
	} else {
		setHeaders({
			"set-cookie": cookie.serialize("auth", data.token, {
				// send cookie for every page
				path: "/",
				// server side only cookie so you can"t use `document.cookie`
				httpOnly: true,
				// only requests from same site can send cookies
				// and serves to protect from CSRF
				// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
				sameSite: "strict",
				// only sent over HTTPS
				secure: process.env.NODE_ENV === "production",
				// set cookie to expire after two weeks
				maxAge: 60 * 60 * 24 * 12
			})
		});
		throw redirect(307, "/");
	}
}
