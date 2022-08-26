<script>
	import {
		get_api_token,
		wiki_delete,
		wiki_get,
		has_valid_token,
		wiki_get_download
	} from '$lib/api';
	import { dateToString, redirect, render_graph } from '$lib/helper.js';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';

	let id = '';
	let data = {
		page_title: '',
		page_text: ''
	};

	onMount(async () => {
		id = window.location.hash.substr(1);
		data = await wiki_get(id);
	});

	const deleteWiki = async () => {
		has_valid_token().then(async (result) => {
			if (!result) {
				alert('You need to login first!');
				return;
			}
			if (await confirm('Seite löschen? Es gibt kein zurück mehr!')) {
				if (result) {
					wiki_delete(get_api_token(), data.page_id).then(() => {
						window.location.href = '/';
					});
				} else {
					alert("You don't have permission to delete this wiki page");
				}
			}
		});
	};

	const download = async () => {
		let res = await wiki_get_download(data.page_id);

		if (window.__TAURI__) {
			window.__TAURI__.shell.open(res.download_url);
		} else {
			window.open(res.download_url);
		}
	};
</script>

<svelte:head>
	<title>Mikki - {data.page_title}</title>
</svelte:head>

<body>
	<main>
		<nav>
			<div class="info">
				<h2>Titel: {data.page_title}</h2>
				<p>Erstellt: {dateToString(data.page_created)}</p>
				<p>Bearbeitet: {dateToString(data.page_edited)}</p>
			</div>

			<div class="buttons">
				<img
					src="/edit.svg"
					alt="edit"
					title="Editieren"
					on:click={() => {
						redirect('/wiki/edit#' + data.page_id);
					}}
				/>
				<img src="/trash.svg" alt="delete" on:click={deleteWiki} title="Löschen" />
			</div>
		</nav>
		<hr />
		{#if data.page_text}
			<div style="overflow-x: auto;">
				<SvelteMarkdown source={data.page_text} on:parsed={render_graph} />
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
