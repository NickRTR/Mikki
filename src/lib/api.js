var base_api = 'https://mikki.deno.dev/api/v2';

const escape_map = {
	'\\\\': '\\\\',
	'"': '\\"',
	'\b': '\\b',
	'\f': '\\f',
	'\n': '\\n',
	'\t': '\\t'
};

export function process_escapes(input) {
	for (let escape in escape_map) {
		input = input.replace(new RegExp(escape, 'g'), escape_map[escape]);
	}
	return input;
}

export function process_response(data) {
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function start_login() {
	const res = await fetch(base_api + '/login/start');
	return await res.json();
}

export async function status_login(login_id) {
	const res = await fetch(base_api + '/login/status?login_id=' + login_id);
	return await res.json();
}

export async function stop_login(login_id) {
	const res = await fetch(base_api + '/login/stop?login_id=' + login_id);
	return await res.json();
}

export async function wiki_create(token, page_title, page_text) {
	var page_title_encoded = btoa(
		encodeURIComponent(process_escapes(page_title)).replace(/%0[aA]/g, '\n')
	);
	var page_text_encoded = btoa(
		encodeURIComponent(process_escapes(page_text)).replace(/%0[aA]/g, '\n')
	);

	const res = await fetch(
		base_api + '/wiki/page/create?token=' + token + '&page_title=' + page_title_encoded,
		{
			method: 'POST',
			body: page_text_encoded
		}
	);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_get(page_id, wiki_list = []) {
	if (navigator.onLine) {
		let maybe_cached = localStorage.getItem('page_' + page_id);
		if (maybe_cached) {
			maybe_cached = JSON.parse(maybe_cached);
			let wiki_list_entry = wiki_list.find((x) => x.page_id == page_id);
			if (wiki_list_entry) {
				if (wiki_list_entry.page_edited == maybe_cached.page_edited) {
					return maybe_cached;
				}
			}
		}
		const res = await fetch(base_api + '/wiki/page/get?page_id=' + page_id);
		let data = await res.text();
		return process_response(data);
	} else {
		return JSON.parse(localStorage.getItem('page_' + page_id));
	}
}

export async function wiki_get_download(page_id) {
	const res = await fetch(base_api + '/wiki/page/get?page_id=' + page_id + '&download');
	let data = await res.text();
	data = process_response(data);

	data.download_url = new URL(base_api).origin + '/files/' + data.file_id;

	return data;
}

export async function wiki_edit(token, page_id, page_title, page_text) {
	var page_title_encoded = btoa(
		encodeURIComponent(process_escapes(page_title)).replace(/%0[aA]/g, '\n')
	);
	var page_text_encoded = btoa(
		encodeURIComponent(process_escapes(page_text)).replace(/%0[aA]/g, '\n')
	);

	const res = await fetch(
		base_api +
			'/wiki/page/edit?token=' +
			token +
			'&page_id=' +
			page_id +
			'&page_title=' +
			page_title_encoded,
		{
			method: 'POST',
			body: page_text_encoded
		}
	);
	let data = await res.text();
	return process_response(data);
}

export async function wiki_list() {
	if (navigator.onLine) {
		const res = await fetch(base_api + '/wiki/page/list');
		let data = await res.text();
		return process_response(data);
	} else {
		return JSON.parse(localStorage.getItem('page_list')) || [];
	}
}

export async function wiki_delete(token, page_id) {
	const res = await fetch(base_api + '/wiki/page/delete?token=' + token + '&page_id=' + page_id);
	return await res.json();
}

export async function wiki_changelog() {
	if (navigator.onLine) {
		const res = await fetch(base_api + '/wiki/page/changelog');
		let data = await res.text();
		return process_response(data);
	} else {
		return JSON.parse(localStorage.getItem('page_changelog'));
	}
}

// to edit: wiki_editor, to delete: wiki_delete
export async function has_permission(token, permission) {
	const res = await fetch(
		base_api + '/has_permission?token=' + token + '&permission=' + permission
	);
	return await res.text();
}

export async function wiki_cache(progress_callback) {
	let last_sync = localStorage.getItem('page_last_cache');
	if (last_sync) {
		if (last_sync == '-1') {
			console.warn('Always running cache update (DEBUG ONLY)');
		} else {
			last_sync = new Date(parseInt(last_sync));
			let now = new Date();
			if (now.getTime() - last_sync.getTime() < 1000 * 60 * 5) {
				console.log('skipping cache update because last one was less than 5 minutes ago');
				return;
			}

			localStorage.setItem('page_last_cache', now.getTime());
		}
	} else {
		localStorage.setItem('page_last_cache', new Date().getTime());
	}

	for (let item in localStorage) {
		if (item.match(/page_[0-9]*_[0-9]*/g)) {
			localStorage.removeItem(item);
			console.log('removed ' + item);
		}
	}

	let current_pages = await wiki_list();

	for (let i = 0; i < current_pages.length; i++) {
		progress_callback(i, current_pages.length);
		localStorage.setItem(
			'page_' + current_pages[i].page_id,
			JSON.stringify(await wiki_get(current_pages[i].page_id))
		);
	}

	localStorage.setItem('page_list', JSON.stringify(current_pages));
	localStorage.setItem('page_changelog', JSON.stringify(await wiki_changelog()));
}

export async function login() {
	let login_id = await start_login();

	let token = null;
	do {
		token = await status_login(login_id);

		if (token == null) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	} while (token == null);

	return token;
}

export async function api_request(url) {
	var token = localStorage.getItem('token');

	if (token) {
		return await (
			await fetch(base_api + url + `${url.indexOf('?') != -1 ? '&' : '?'}token=${token}`)
		).text();
	} else {
		return await (await fetch(base_api + url)).text();
	}
}

export function has_valid_token() {
	return new Promise(async (resolve, reject) => {
		if (localStorage.getItem('token')) {
			api_request('/login/check').then((data) => {
				data = JSON.parse(data);

				if (data.msg == 'ok') {
					resolve(true);
				} else {
					localStorage.removeItem('token');
					resolve(false);
				}
			});
		} else {
			resolve(false);
		}
	});
}

export async function is_valid_token(token) {
	const res = await fetch(base_api + '/login/check?token=' + token);
	let data = await res.json();
	if (data.msg == 'ok') {
		return true;
	} else {
		return false;
	}
}

export function get_api_token() {
	return localStorage.getItem('token');
}
