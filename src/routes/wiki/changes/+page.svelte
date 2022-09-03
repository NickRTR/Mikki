<script>
	import { dateToString } from "$lib/helper";
	import { baseApi } from "$lib/api";
	import { onMount } from "svelte";

	let changelog = [];

	onMount(async () => {
		if (navigator.onLine) {
			const res = await fetch(baseApi + "/wiki/page/changelog");
			let data = await res.json();

			if (data.error) {
				alert(data.error);
			} else {
				changelog = data;
			}
		} else {
			changelog = JSON.parse(localStorage.getItem("page_list")) || [];
		}
	});
</script>

<svelte:head>
	<title>Mikki - Log</title>
</svelte:head>

<body>
	<h2>Wiki Änderungen</h2>

	<div class="changelog_list">
		<table>
			<tr>
				<th>Änderungen</th>
				<th>Zeitpunkt</th>
			</tr>

			{#each changelog.reverse() as entry}
				<tr>
					<td>{entry.what}</td>
					<td>{dateToString(entry.when)}</td>
				</tr>
			{/each}
		</table>
	</div>
</body>

<style>
	body {
		margin: 0 1rem;
	}

	.changelog_list {
		background-color: var(--light-background);
		border-radius: 0.5rem;
		margin: 1rem 0;
		padding: 0.8rem 0;
		overflow-x: auto;
	}

	.changelog_list table {
		width: 100%;
		margin: 1rem 0;
		text-align: left;
		padding: 0 1rem;
	}

	th {
		font-weight: bold;
		font-size: 2rem;
	}

	.changelog_list td,
	th {
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: var(--background);
	}
</style>
