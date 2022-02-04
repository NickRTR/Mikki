export function dateToString(date) {
	const date_obj = new Date(date);
	const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	return date_obj.toLocaleDateString('de-DE', options);
}

export const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text);
}