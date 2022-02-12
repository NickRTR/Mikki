import { toast } from "@zerodevx/svelte-toast";

export const weburl = "https://www.mikki.gq";

export function dateToString(date) {
	const date_obj = new Date(date);
	const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	return date_obj.toLocaleDateString('de-DE', options);
}

export const copyToClipboard = (text) => {
	toast.push("Kopiert!", {
		theme: {
			'--toastBackground': '#3A4750',
    		'--toastBarBackground': '#F6C90E'
		},
		duration: 2500
	});
	if (window.__TAURI__) {
		console.log("Running in tauri...");
		window.__TAURI__.clipboard.writeText(text);
	} else {
		navigator.clipboard.writeText(text);
	}
}

export function redirect(url) {
	// if (window.__TAURI__) {
	// 	console.log("Running in tauri...");
    //     var link = document.createElement('a');
    //     link.href = url;
    //     document.body.appendChild(link);
    //     link.click();
	// } else {
		window.location.href = url;
	// }
}