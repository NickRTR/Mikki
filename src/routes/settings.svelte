<script>
	import { wiki_cache } from "$lib/api";
	import { onMount } from "svelte";

	let autocache = true;
	let progress = 0;
	let max = 10;


	onMount(() => {
		autocache = localStorage.getItem("auto_cache");
	})

	const start_cache = () => {
		wiki_cache((p, m) => {
			progress = p + 1;
			max = m;
		}).then(() => {
			console.log("done");
		});
	}
</script>

<svelte:head>
    <title>Wikki - Einstellungen</title>
</svelte:head>

<body>
	<div class="cache">
		<h2>Caches</h2>

		<div class="cachenow">
			<h3>Cache jetzt erstellen</h3>

			<progress id="progressBar" value={progress} max={max} style="width:300px;"></progress>
			<button on:click={start_cache}>Cache erstellen</button>
		</div>

		<div class="autocache">
			<h3>Autocache</h3>

			{#if autocache}
				<p>Autocache ist aktiviert.</p>
				<button on:click={() => {localStorage.setItem("auto_cache", "false"); autocache = !autocache}}>deaktivieren</button>
			{:else}
				<p>Autocache ist deaktiviert.</p>
				<button on:click={() => {localStorage.setItem("auto_cache", "true"); autocache = !autocache}}>aktivieren</button>
			{/if}
		</div>
	</div>
</body>

<style>
	/* For Chrome or Safari */
	progress::-webkit-progress-bar {
		background-color: #eeeeee;
	}
	
	progress::-webkit-progress-value {
		background-color: blue !important;
	}

	/* For Firefox */
	progress {
		background-color: #eee;
	}

	progress::-moz-progress-bar {
		background-color: blue !important;
	}

	/* For IE10 */
	progress {
		background-color: #eee;
	}

	progress {
		background-color: blue;
	}
</style>