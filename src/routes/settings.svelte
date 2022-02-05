<script>
	import { wiki_cache } from "$lib/api";
	let progress = 0;
	let max = 10;

	const start_cahce = () => {
		wiki_cache((p, m) => {
			progress = p + 1;
			max = m;
			console.log(progress);
		}).then(() => {
			console.log("done");
		});
	}
</script>

<body>
	<progress id="progressBar" value={progress} max={max} style="width:300px;"></progress>
	<button on:click={start_cahce}>Cache wiki</button>
</body>