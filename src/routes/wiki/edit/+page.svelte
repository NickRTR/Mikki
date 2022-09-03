<script>
	import { wiki_get } from "$lib/api.js";
	import { toBase64 } from "$lib/helper.js";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	let id = "";
	let pageEntry = {
		page_title: "",
		page_text: ""
	};

	onMount(() => {
		id = window.location.hash.substr(1);
		wiki_get(id).then((res) => {
			pageEntry = res;
			console.log(pageEntry);
		});
	});

	let disabled = "";

	const save = async () => {
		if (pageEntry.page_title !== "") {
			const res = await fetch("/api/editEntry", {
				method: "PATCH",
				body: JSON.stringify({
					token: $page.data.user.token,
					id,
					pageTitle: pageEntry.page_title,
					pageText: pageEntry.page_text
				})
			});
			const data = await res.json();

			if (data.error) {
				alert("Ups, die Datei konnte nicht gespeichert werden!\nError: " + data.error);
			} else {
				window.location = "/";
			}
		} else {
			alert("Der Titel darf nicht leer sein.");
		}
	};

	var picture_proggress = 0;
	var picture_proggress_show = false;

	function on_picture_upload() {
		var element = document.getElementById("uploaded_picture");

		if (element.files.length !== 1) {
			alert("Bitte wählen sie nur eine Datei aus.");
			delete element.files;
		} else {
			toBase64(element.files[0], (progress) => {
				picture_proggress = progress;
				picture_proggress_show = true;
			}).then((res) => {
				// console.log(res);
				picture_proggress_show = false;

				var textarea = document.getElementById("editor");

				var tmp =
					textarea.value.slice(0, textarea.selectionStart) +
					`![${element.files[0].name}](${res})\n` +
					textarea.value.slice(textarea.selectionStart);
				textarea.value = tmp;
				pageEntry.page_text = tmp;
				textarea.focus();

				delete element.files;
			});
		}
	}
</script>

<svelte:head>
	<title>Mikki - Bearbeiten</title>
</svelte:head>

<body>
	<h2>Edit Page</h2>
	<input type="text" placeholder="titel" bind:value={pageEntry.page_title} />
	<textarea id="editor" placeholder="text" resi bind:value={pageEntry.page_text} />
	<button type="submit" on:click={save} {disabled}>Speichern</button>
	<button onclick="document.getElementById('uploaded_picture').click();">Bild hochladen</button>

	<input
		type="file"
		style="display: none"
		id="uploaded_picture"
		maxlength="1"
		name="file"
		on:change={on_picture_upload}
	/>

	{#if picture_proggress_show}
		<progress max="100" value={picture_proggress} />
	{/if}
</body>

<style>
	button {
		font-size: larger;
		background-color: var(--light-background);
		padding: 5px;
		color: white;
		text-decoration: underline;
		margin: 1rem;
		border: none;
		background: none;
		font-weight: bold;
	}

	button:hover {
		cursor: pointer;
	}

	input {
		width: 90%;
		margin: 0.5rem;
		border-radius: 1rem;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border: none;
		font-size: large;
	}

	textarea {
		width: 90%;
		font-size: larger;
		height: 50vh;
		border-radius: 1rem;
		resize: none;
		padding: 0.5rem;
		border: none;
	}
</style>
