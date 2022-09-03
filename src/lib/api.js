export const base_api = "https://mikki.deno.dev/api/v2";
export const baseApi = "https://mikki.deno.dev/api/v2";

const escape_map = {
	"\\\\": "\\\\",
	'"': '\\"',
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\t": "\\t"
};

export function process_escapes(input) {
	for (let escape in escape_map) {
		input = input.replace(new RegExp(escape, "g"), escape_map[escape]);
	}
	return input;
}

export function process_response(data) {
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export function encode(input) {
	return btoa(encodeURIComponent(process_escapes(input)).replace(/%0[aA]/g, "\n"));
}

function throw_if_error(json) {
	if (json.error) {
		alert(json.error);
		throw new Error(json.error);
	}
}

function throw_if_error_txt(txt) {
	var json;
	try {
		json = JSON.parse(txt);
	} catch (e) {}

	if (json) {
		throw_if_error(json);
	}
}

export async function fetchEntry(pageId, allEntries = []) {
	if (navigator.onLine) {
		let maybeCache = localStorage.getItem("page_" + pageId);
		if (maybeCache) {
			maybeCache = JSON.parse(maybeCache);
			let entry = allEntries.find((x) => x.pageId == pageId);
			if (entry) {
				if (entry.page_edited == maybeCache.page_edited) {
					return maybeCache;
				}
			}
		}
		const res = await fetch(baseApi + "/wiki/page/get?page_id=" + pageId);
		let data = await res.text();
		data = decodeURIComponent(data);
		data = JSON.parse(data);

		if (data.error) {
			alert(data.error);
		} else {
			return data;
		}
	} else {
		return JSON.parse(localStorage.getItem("page_" + pageId));
	}
}

export async function fetchEntry_download(pageId) {
	const res = await fetch(base_api + "/wiki/page/get?pageId=" + pageId + "&download");
	let data = await res.text();
	throw_if_error_txt(data);
	data = process_response(data);

	data.download_url = new URL(base_api).origin + "/files/" + data.file_id;

	return data;
}

export async function wiki_cache(progress_callback) {
	let last_sync = localStorage.getItem("page_last_cache");
	if (last_sync) {
		if (last_sync == "-1") {
			console.warn("Always running cache update (DEBUG ONLY)");
		} else {
			last_sync = new Date(parseInt(last_sync));
			let now = new Date();
			if (now.getTime() - last_sync.getTime() < 1000 * 60 * 5) {
				console.log("skipping cache update because last one was less than 5 minutes ago");
				return;
			}

			localStorage.setItem("page_last_cache", now.getTime());
		}
	} else {
		localStorage.setItem("page_last_cache", new Date().getTime());
	}

	for (let item in localStorage) {
		if (item.match(/page_[0-9]+_?[0-9]+/g)) {
			localStorage.removeItem(item);
			console.log("removed " + item);
		}
	}

	let current_pages = await wiki_list();

	for (let i = 0; i < current_pages.length; i++) {
		progress_callback(i, current_pages.length);
		localStorage.setItem(
			"page_" + current_pages[i].pageId,
			JSON.stringify(await fetchEntry(current_pages[i].pageId))
		);
	}

	localStorage.setItem("page_list", JSON.stringify(current_pages));
	localStorage.setItem("page_changelog", JSON.stringify(await wiki_changelog()));
}

export async function send(form) {
	const res = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: "application/json" }
	});
	// BUG: throws error: Uncaught (in promise) SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
	// Even though it works
	return await res.json();
}
