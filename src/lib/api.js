// DO NOT TOUCH AS LONG AS IT WORKS!!!!!!!!!!!!!!!!!!!

var base_api = "https://x.glowman554.gq/api/v2";

export async function start_login() {
	const res = await fetch(base_api + "/login/start");
	return await res.json();
}

export async function status_login(login_id) {
	const res = await fetch(base_api + "/login/status?login_id=" + login_id);
	return await res.json();
} 

export async function stop_login(login_id) {
	const res = await fetch(base_api + "/login/stop?login_id=" + login_id);
	return await res.json();
} 

export async function wiki_create(token, page_title, page_text) {
	var page_title_encoded = btoa(encodeURIComponent(page_title).replace(/%0[aA]/g, '\n'));
	var page_text_encoded = btoa(encodeURIComponent(page_text).replace(/%0[aA]/g, '\n'));

	const res = await fetch(base_api + "/wiki/page/create?token=" + token + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_get(page_id) {
	const res = await fetch(base_api + "/wiki/page/get?page_id=" + page_id);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_get_download(page_id) {
	const res = await fetch(base_api + "/wiki/page/get?page_id=" + page_id + "&download");
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);

	data.download_url = new URL(base_api).origin + "/files/" + data.file_id;

	return data;
}

export async function wiki_edit(token, page_id, page_title, page_text) {
	var page_title_encoded = btoa(encodeURIComponent(page_title).replace(/%0[aA]/g, '\n'));
	var page_text_encoded = btoa(encodeURIComponent(page_text).replace(/%0[aA]/g, '\n'));

	const res = await fetch(base_api + "/wiki/page/edit?token=" + token + "&page_id=" + page_id + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_list() {
	const res = await fetch(base_api + "/wiki/page/list");
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_delete(token, page_id) {
	const res = await fetch(base_api + "/wiki/page/delete?token=" + token + "&page_id=" + page_id);
	return await res.json();
}

export async function wiki_changelog() {
	//if (navigator.onLine) {
		const res = await fetch(base_api + "/wiki/page/changelog");
		let data = await res.text();
		data = decodeURIComponent(data);
		data = JSON.parse(data);
		return data;
	//} else {
	//	return JSON.parse(localStorage.getItem("page_changelog"));
	//}
}

// to edit: wiki_editor, to delete: wiki_delete
export async function has_permission(token, permission) {
	const res = await fetch(base_api + "/has_permission?token=" + token + "&permission=" + permission);
	return await res.text();
}

export async function wiki_cache(progress_callback) {
	let current_pages = await wiki_list();

	for (let i = 0; i < current_pages.length; i++) {
		progress_callback(i, current_pages.length );
		localStorage.setItem("page_" + current_pages[i].page_id, JSON.stringify(current_pages[i]));
		await new Promise(resolve => setTimeout(resolve, 1000));
	}

	localStorage.setItem("page_list", JSON.stringify(current_pages));
	localStorage.setItem("page_changelog", JSON.stringify(await wiki_changelog()));

}

export async function login() {
	let login_id = await start_login();

	let token = null;
	do {
		token = await status_login(login_id);

		if (token == null) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} while (token == null);

	return token;
}

export async function api_request(url) {
	var token = localStorage.getItem("token");

	if (token) {
		return await (await fetch(base_api + url + `${url.indexOf("?") != -1 ? "&" : "?"}token=${token}`)).text();
	} else {
		return await (await fetch(base_api + url)).text();
	}
}


export function has_valid_token() {
	return new Promise(async (resolve, reject) => {
		if (localStorage.getItem("token")) {
			api_request("/login/check").then(data => {
				data = JSON.parse(data);

				if (data.msg == "ok") {
					resolve(true);
				} else {
					localStorage.removeItem("token");
					resolve(false);
				}
			});
		} else {
			resolve(false);
		}
	});
}

export async function is_valid_token(token) {
	const res = await fetch(base_api + "/login/check?token=" + token);
	let data = await res.json();
	if (data.msg == "ok") {
		return true;
	} else {
		return false;
	}
}

export function get_api_token() {
	return localStorage.getItem("token");
}