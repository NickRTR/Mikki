import { baseApi, encode } from "$lib/api";

export async function PATCH({ request }) {
	const { token, id, pageTitle, pageText } = await request.json();

	var pageTitleEncoded = encode(pageTitle);
	var pageTextEncoded = encode(pageText);

	const res = await fetch(
		baseApi +
			"/wiki/page/edit?token=" +
			token +
			"&page_id=" +
			id +
			"&page_title=" +
			pageTitleEncoded,
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

	return new Response(JSON.stringify({ success: "success" }));
}
