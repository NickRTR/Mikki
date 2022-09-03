import { baseApi } from "$lib/api";

export async function DELETE({ request }) {
	const { token, id } = await request.json();

	const res = await fetch(baseApi + "/wiki/page/delete?token=" + token + "&page_id=" + id);
	const data = await res.json();

	if (data.error) {
		return new Response(JSON.stringify({ error: data.error }));
	}

	return new Response(JSON.stringify({ success: "success" }));
}
