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
	navigator.clipboard.writeText(text);
}

export function downloadFile(download_url) {
	let link = document.createElement("a");
	link.setAttribute("href", download_url);
	link.setAttribute("download", "file");
	link.setAttribute("target", "_blank");
	link.click();
}