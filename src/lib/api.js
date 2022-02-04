var base_api = "https://x.glowman554.gq/api/v2";

export function start_login() {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/login/start").then(response => response.json()).then(response => {
			resolve(response.id);
		});
	});
}

export function status_login(login_id) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/login/status?login_id=" + login_id).then(response => response.json()).then(response => {
			resolve(response.token);
		});
	});
} 

export function wiki_create(token, page_title, page_text) {
	var page_title_encoded = btoa(page_title);
	var page_text_encoded = btoa(page_text);

	return new Promise((resolve, reject) => {
		fetch(base_api + "/wiki/page/create?token=" + token + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded).then(response => response.json()).then(response => {
			resolve(response);
		});
	});
}

export function wiki_get(page_id) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/wiki/page/get?page_id=" + page_id).then(response => response.json()).then(response => {
			resolve(response);
		});
	});
}

export function wiki_edit(token, page_id, page_title, page_text) {
	var page_title_encoded = btoa(page_title);
	var page_text_encoded = btoa(page_text);

	return new Promise((resolve, reject) => {
		fetch(base_api + "/wiki/page/edit?token=" + token + "&page_id=" + page_id + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded).then(response => response.json()).then(response => {
			resolve(response);
		});
	});
}

export async function wiki_list() {
	// return new Promise((resolve, reject) => {
	// 	fetch(base_api + "/wiki/page/list").then(response => response.json()).then(response => {
	// 		resolve(response);
	// 	});
	// });
	const res = await fetch(base_api + "/wiki/page/list");
	return await res.json();
}

export function wiki_delete(token, page_id) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/wiki/page/delete?token=" + token + "&page_id=" + page_id).then(response => response.json()).then(response => {
			resolve(response);
		});
	});
}

// to edit: wiki_editor, to delete: wiki_delete
export function has_permission(token, permission) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/has_permission?token=" + token + "&permission=" + permission).then(response => response.text()).then(response => {
			resolve(response == "true");
		});
	});
}

export async function login() {
	let login_id = await start_login();

	console.log("-auth " + login_id)

	let token = null;
	do {
		token = await status_login(login_id);

		if (token == null) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} while (token == null);

	return token;
}