<script>
	import { wiki_cache } from "$lib/api";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

	let cacheDone = false;
	let autocache = true;
	let max = 10;

	let always_update_cache = false;

	onMount(() => {
		autocache = localStorage.getItem("auto_cache") == "true" ? true : false;
		always_update_cache = localStorage.getItem("page_last_cache") == "-1";
	});

	const start_cache = async () => {
		cacheDone = false;
		await wiki_cache((p, m) => {
			progress.set(p + 1);
			max = m;
		});
		cacheDone = true;
		progress.set(0);
	};
</script>

<svelte:head>
	<title>Mikki - Einstellungen</title>
</svelte:head>

<body>
	<div class="cache">
		<h2>Caches</h2>

		<div class="cachenow">
			<h3>Cache jetzt erstellen</h3>

			<div class="progress">
				{#if cacheDone}
					<p>Abgeschlossen!</p>
				{:else}
					<progress id="progressBar" value={$progress} {max} style="width:300px;" /><br />
				{/if}
				<button on:click={start_cache}>Cache erstellen</button>
			</div>
		</div>

		<div class="autocache">
			<h3>Autocache</h3>

			{#if autocache}
				<p>Autocache ist aktiviert.</p>
				<button
					on:click={() => {
						localStorage.setItem("auto_cache", "false");
						autocache = !autocache;
					}}>deaktivieren</button
				>
			{:else}
				<p>Autocache ist deaktiviert.</p>
				<button
					on:click={() => {
						localStorage.setItem("auto_cache", "true");
						autocache = !autocache;
					}}>aktivieren</button
				>
			{/if}

			<h3>Cache Intervall</h3>

			{#if always_update_cache}
				<p>Cache wird immer aktualisiert (Nicht empfohlen kann performance verschlechtern).</p>
				<button
					on:click={() => {
						localStorage.removeItem("page_last_cache");
						always_update_cache = !always_update_cache;
					}}>deaktivieren</button
				>
			{:else}
				<p>Cache wird nur alle 5 minuten aktualisiert.</p>
				<button
					on:click={() => {
						localStorage.setItem("page_last_cache", "-1");
						always_update_cache = !always_update_cache;
					}}>aktivieren</button
				>
			{/if}
		</div>
	</div>
</body>

<style>
	p {
		margin-bottom: 0.5rem;
	}

	.autocache button {
		margin-bottom: 1rem;
	}

	progress {
		margin-bottom: 0.7rem;
	}

	/* For Chrome or Safari */
	progress::-webkit-progress-bar {
		background-color: #eeeeee;
		border-radius: 1rem;
	}

	progress::-webkit-progress-value {
		background-color: var(--accent) !important;
		border-radius: 1rem;
	}

	/* For Firefox */
	progress {
		background-color: #eee;
		border-radius: 1rem;
	}

	progress::-moz-progress-bar {
		background-color: var(--accent) !important;
		border-radius: 1rem;
	}

	/* For IE10 */
	progress {
		background-color: #eee;
		border-radius: 1rem;
	}

	progress {
		background-color: var(--accent);
		border-radius: 1rem;
	}
</style>
