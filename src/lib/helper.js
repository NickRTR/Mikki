import { toast } from '@zerodevx/svelte-toast';

export const weburl = 'https://www.mikki.gq';

export function dateToString(date) {
	const date_obj = new Date(date);
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	};
	return date_obj.toLocaleDateString('de-DE', options);
}

export const copyToClipboard = (text) => {
	toast.push('Kopiert!', {
		theme: {
			'--toastBackground': '#3A4750',
			'--toastBarBackground': '#F6C90E'
		}
	});
	if (window.__TAURI__) {
		console.log('Running in tauri...');
		window.__TAURI__.clipboard.writeText(text);
	} else {
		navigator.clipboard.writeText(text);
	}
};

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

export function run_update_notifier() {
	// test alert:
	// window.commit_sha = "bla";
	if (window.__TAURI__ && window.commit_sha && navigator.onLine) {
		console.log('Checking for updates...');
		fetch('https://api.github.com/repos/NickRTR/Mikki/commits/master', {
			method: 'GET',
			headers: {
				accept: 'application/vnd.github.VERSION.sha'
			}
		}).then((res) =>
			res.text().then((res) => {
				window.remote_commit_sha = res;

				console.log('remote_commit_sha: ' + window.remote_commit_sha);
				console.log('local_commit_sha: ' + window.commit_sha);

				if (window.remote_commit_sha != window.commit_sha) {
					toast.push(
						"<a style='color: white; text-decoration: none;' href='https://github.com/Mik-Wiki/Mikki/releases'>Neue version verfügbar</a>",
						{
							theme: {
								'--toastBackground': 'red',
								'--toastBarBackground': '#F6C90E'
							},
							duration: 50000
						}
					);
				} else {
					console.log('No update available.');
				}

				delete window.remote_commit_sha;
				delete window.commit_sha;
			})
		);
	} else {
		console.warn('Not running in tauri. Not checking for updates.');
	}
}

export const render_graph = () => {
	// map all "pre.mermaid > code" to "div.mermaid"
	document.querySelectorAll('pre.mermaid > code').forEach((element) => {
		let div = document.createElement('div');
		div.classList.add('mermaid');
		div.innerHTML = element.innerHTML;
		element.parentNode.replaceChild(div, element);

		console.log('Rendering graph: ' + div.innerHTML);

		mermaid.init(undefined, div);
	});
};

export const toBase64 = (file, prg) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
		reader.onprogress = (progress) => prg((progress.loaded / progress.total) * 100);
	});
