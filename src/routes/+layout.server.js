export async function load({ request, setHeaders }) {
	return {
		// user: await db.getUser(request.headers.get("cookie"))
		user: "Test"
	};
}
