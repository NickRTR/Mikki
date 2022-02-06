<script>
	import { wiki_cache } from "$lib/api";
	import { onMount } from "svelte";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

	let autocache = true;
	let max = 10;

	onMount(() => {
		autocache = localStorage.getItem("auto_cache");
	})

	const start_cache = async () => {
		await wiki_cache((p, m) => {
			progress.set(p + 1)
			max = m;
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

			{#if $progress !== max}
				<progress id="progressBar" value={$progress} max={max} style="width:300px;"></progress>			
			{:else}
				<div class="done">
					<progress id="progressBar" value={$progress} max={max} style="width:300px;"></progress>			
					<p>Abgeschlossen!</p>
				</div>
			{/if}
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
