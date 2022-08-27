import { redirect } from "@sveltejs/kit";
import { create_account } from "$lib/api";
import * as cookie from "cookie";

export async function load({ parent }) {
	const { user } = await parent();
	console.log(user);
	if (user) {
		throw redirect(307, "/");
	}
}

export const prerender = false;

export async function POST({ request, setHeaders }) {
	const form = await request.formData();
	const email = form.get("email");
	const password = form.get("password");

	if (typeof email !== "string" || typeof password !== "string") {
		return {
			status: 400,
			errors: {
				error: "Enter a valid email and password."
			}
		};
	}

	if (!email || !password) {
		return {
			status: 400,
			errors: {
				error: "Email and password are required."
			}
		};
	}

	const response = await create_account({ username: email, password });
	console.log(response);

	if (response.error) {
		return {
			status: response.error.status,
			errors: {
				error: response.error.message
			}
		};
	}

	setHeaders({
		"set-cookie": cookie.serialize("auth", response.session.access_token, {
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
}
