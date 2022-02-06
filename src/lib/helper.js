// export function dateToString(date) {
// 	const date_obj = new Date(date);
// 	const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
// 	return date_obj.toLocaleDateString('de-DE', options);
// }

export function dateToString(date) {
	const date_obj = new Date(date);
	const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	return date_obj.toLocaleDateString('de-DE', options);
}

export const copyToClipboard = (text) => {
	if (window.__TAURI__) {
		console.log("Running in tauri...");
		window.__TAURI__.clipboard.writeText(text);
	} else {
		navigator.clipboard.writeText(text);
	}
}