<script>
	import { wiki_cache } from "$lib/api";
	import { onMount } from "svelte";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

	let cacheDone = false;
	let autocache = true;
	let max = 10;

	onMount(() => {
		autocache = localStorage.getItem("auto_cache");
	})

	const start_cache = async () => {
		cacheDone = false;
		await wiki_cache((p, m) => {
			progress.set(p + 1)
			max = m;
		});
		cacheDone = true;
		progress.set(0);
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

			<div class="progress">
				{#if cacheDone}
					<p>Abgeschlossen!</p>
				{:else}
					<progress id="progressBar" value={$progress} {max} style="width:300px;"></progress><br>	
				{/if}
				<button on:click={start_cache}>Cache erstellen</button>
			</div>
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
	p {
		margin-bottom: .5rem;
	}

	progress {
		margin-bottom: .7rem;
	}

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
