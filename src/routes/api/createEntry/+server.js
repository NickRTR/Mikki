import { baseApi, encode } from "$lib/api";

export async function POST({ request }) {
	const { token, pageTitle, pageText } = await request.json();

	var pageTitleEncoded = encode(pageTitle);
	var pageTextEncoded = encode(pageText);

	const res = await fetch(
		baseApi + "/wiki/page/create?token=" + token + "&page_title=" + pageTitleEncoded,
		{
			method: "POST",
			body: pageTextEncoded
		}
	);

	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);

	if (data.error) {
		return new Response(JSON.stringify({ error: data.error }));
	}
}
