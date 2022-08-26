<script>
	import { get_api_token, has_valid_token, has_permission, wiki_create } from '$lib/api.js';
	import { redirect, toBase64 } from '$lib/helper.js';

	let title = '';
	let text = '';

	const save = () => {
		if (title !== '') {
			has_valid_token().then((result) => {
				if (!result) {
					alert('Sie müssen eingeloggt sein, um zu speichern.');
					return;
				}
				has_permission(get_api_token(), 'wiki_editor').then(async (result) => {
					if (!result) {
						alert('Sie müssen Wiki Editor sein um diese Seite zu bearbeiten.');
						return;
					}
					let res = await wiki_create(get_api_token(), title, text).catch((err) => {
						alert('Ups, die Datei konnte nicht gespeichert werden! Vielleicht ist sie zu groß?');
					});
					// window.location.href = "/wiki/view#" + res.page_id;
					redirect('/wiki/view#' + res.page_id);
				});
			});
		} else {
			alert('Der Titel darf nicht leer sein.');
		}
	};

	var picture_proggress = 0;
	var picture_proggress_show = false;

	function on_picture_upload() {
		var element = document.getElementById('uploaded_picture');

		if (element.files.length != 1) {
			alert('Flasche anzahl an dateien ausgewählt!');
			delete element.files;
		} else {
			toBase64(element.files[0], (progress) => {
				picture_proggress = progress;
				picture_proggress_show = true;
			}).then((res) => {
				// console.log(res);
				picture_proggress_show = false;

				var textarea = document.getElementById('editor');

				var tmp =
					textarea.value.slice(0, textarea.selectionStart) +
					`![${element.files[0].name}](${res})\n` +
					textarea.value.slice(textarea.selectionStart);
				textarea.value = tmp;
				text = tmp;
				textarea.focus();

				delete element.files;
			});
		}
	}
</script>

<svelte:head>
	<title>Mikki - Erstellen</title>
</svelte:head>

<body>
	<h2>Seite erstellen</h2>
	<input type="text" placeholder="titel" bind:value={title} />
	<textarea id="editor" placeholder="Markdown Text" bind:value={text} />
	<button type="submit" on:click={save}>Erstellen</button>

	<button onclick="document.getElementById('uploaded_picture').click();">Bild hochladen</button>

	<input
		type="file"
		style="display:none;"
		id="uploaded_picture"
		name="file"
		on:change={on_picture_upload}
	/>

	{#if picture_proggress_show}
		<progress max="100" value={picture_proggress} />
	{/if}
</body>

<style>
	input {
		width: 90%;
		border-radius: 1rem;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border: none;
		font-size: large;
	}

	textarea {
		width: 90%;
		height: 50vh;
		font-size: larger;
		border-radius: 1rem;
		resize: none;
		padding: 0.5rem;
		border: none;
	}

	button {
		margin-bottom: 1rem;
	}
</style>
