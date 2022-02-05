<script>
	import { wiki_cache } from "$lib/api";
	let progress = 0;
	let max = 10;

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
	<progress id="progressBar" value={progress} max={max} style="width:300px;"></progress>
	<button on:click={start_cache}>Cache wiki</button>

	<button on:click={() => {
		localStorage.setItem("auto_cache", "true");
	}}>Enable autocache</button>
	<button on:click={() => {
		localStorage.setItem("auto_cache", "false");
	}}>Disable autocache</button>
</body>