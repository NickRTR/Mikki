import { toast } from "@zerodevx/svelte-toast";

export const baseApi = "https://mikki.deno.dev/api/v2";

function throwError(message) {
	toast.push(message, {
		theme: {
			"--toastBackground": "#3A4750",
			"--toastBarBackground": "#F6C90E"
		}
	});
	throw new Error(message);
}

const escapeMap = {
	"\\\\": "\\\\",
	'"': '\\"',
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\t": "\\t"
};

export function processEscapes(input) {
	for (let escape in escapeMap) {
		input = input.replace(new RegExp(escape, "g"), escapeMap[escape]);
	}
	return input;
}

export function encode(input) {
	return btoa(encodeURIComponent(processEscapes(input)).replace(/%0[aA]/g, "\n"));
}

export async function fetchEntries() {
	if (navigator.onLine) {
		const res = await fetch(baseApi + "/wiki/page/list");
		let data = await res.json();

		if (data.error) {
			throwError(data.error);
		} else {
			return data;
		}
	} else {
		return JSON.parse(localStorage.getItem("page_list")) || [];
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
			throwError(data.error);
		} else {
			return data;
		}
	} else {
		return JSON.parse(localStorage.getItem("page_" + pageId));
	}
}

export async function fetchEntryDownload(pageId) {
	const res = await fetch(baseApi + "/wiki/page/get?page_id=" + pageId + "&download");
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);

	if (data.error) {
		throwError(data.error);
	} else {
		data.download_url = new URL(baseApi).origin + "/files/" + data.file_id;
		return data;
	}
}

export async function fetchChangelog() {
	if (navigator.onLine) {
		const res = await fetch(baseApi + "/wiki/page/changelog");
		let data = await res.json();

		if (data.error) {
			throwError(data.error);
		} else {
			return data;
		}
	} else {
		return JSON.parse(localStorage.getItem("page_changelog")) || [];
	}
}

export async function wikiCache(progressCallback) {
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

	let current_pages = await fetchEntries();

	for (let i = 0; i < current_pages.length; i++) {
		progressCallback(i, current_pages.length);
		localStorage.setItem(
			"page_" + current_pages[i].page_id,
			JSON.stringify(await fetchEntry(current_pages[i].page_id))
		);
	}

	localStorage.setItem("page_list", JSON.stringify(current_pages));
	localStorage.setItem("page_changelog", JSON.stringify(await fetchChangelog()));
}

export async function send(form) {
	const res = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: "application/json" }
	});
	return await res.json();
}
