import supabase from "$lib/supabase";
import * as cookie from "cookie";

export async function POST({ request }) {
	const form = await request.formData();
	const email = form.get("email");
	const password = form.get("password");

	if (typeof email !== "string" || typeof password !== "string") {
		return {
			status: 400,
			body: {
				error: "Enter a valid email and password."
			}
		};
	}

	if (!email || !password) {
		return {
			status: 400,
			body: {
				error: "Email and password are required."
			}
		};
	}

	const response = await supabase.auth.signUp({ email, password });

	if (response.error) {
		return {
			status: response.error.status,
			body: {
				error: response.error.message
			}
		};
	}

	return {
		status: 200,
		body: {
			user: response.user,
			success: "Success."
		},
		headers: {
			"Set-Cookie": cookie.serialize("session", response.session.access_token, {
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
		}
	};
}
