<script>
	import { fetchEntry, fetchEntryDownload } from "$lib/api";
	import { dateToString, redirect, render_graph } from "$lib/helper.js";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import SvelteMarkdown from "svelte-markdown";

	let id = "";
	let pageData = {
		page_title: "",
		page_text: ""
	};

	onMount(async () => {
		id = window.location.hash.substr(1);
		pageData = await fetchEntry(id);
	});

	const deleteWiki = async () => {
		if (!$page.data.user) {
			alert("You need to login first!");
			return;
		}

		if (confirm("Seite löschen? Es gibt kein zurück mehr!")) {
			const res = await fetch("/api/deleteEntry", {
				method: "DELETE",
				body: JSON.stringify({ token: $page.data.user.token, id: pageData.page_id })
			});

			const data = await res.json();

			if (data.error) {
				alert(data.error);
			} else {
				window.location = "/";
			}
		}
	};

	const download = async () => {
		let res = await fetchEntryDownload(pageData.page_id);

		if (window.__TAURI__) {
			window.__TAURI__.shell.open(res.download_url);
		} else {
			window.open(res.download_url);
		}
	};
</script>

<svelte:head>
	<title>Mikki - {pageData.page_title}</title>
</svelte:head>

<body>
	<main>
		<nav>
			<div class="info">
				<h2>Titel: {pageData.page_title}</h2>
				<p>Erstellt: {dateToString(pageData.page_created)}</p>
				<p>Bearbeitet: {dateToString(pageData.page_edited)}</p>
			</div>

			<div class="buttons">
				<img
					src="/edit.svg"
					alt="edit"
					title="Editieren"
					on:click={() => {
						redirect("/wiki/edit#" + pageData.page_id);
					}}
				/>
				<img src="/trash.svg" alt="delete" on:click={deleteWiki} title="Löschen" />
			</div>
		</nav>
		<hr />
		{#if pageData.page_text}
			<div style="overflow-x: auto;">
				<SvelteMarkdown source={pageData.page_text} on:parsed={render_graph} />
			</div>
		{:else}
			<p>Fetching Data</p>
		{/if}
	</main>
	<button type="button" on:click={download}>Download</button>
</body>

<style>
	main {
		text-align: left;
		background-color: var(--light-background);
		border-radius: 1rem;
		color: white;
		margin: 0;
		padding: 1rem;
		margin: 1rem;
		margin-bottom: 0.5rem;
	}

	nav {
		justify-content: space-between;
		display: flex;
		align-items: center;
	}

	h2 {
		margin: 0;
	}

	p {
		margin: 0.5rem 0;
		margin-bottom: 0;
	}

	.buttons {
		display: flex;
		align-items: center;
	}

	.buttons img {
		width: 2rem;
		padding: 0.5rem;
		cursor: pointer;
	}
</style>
