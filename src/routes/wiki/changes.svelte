<script context="module">
    import { wiki_changelog } from "$lib/api.js";

    export async function load() {
		const changelog = await wiki_changelog();
        return {
            props: {
				changelog: changelog
            }
        }
    }
</script>

<script>
    import { dateToString } from "$lib/helper";

	export let changelog;
</script>

<body> 
    <h2>Wiki Änderungen</h2>

	<div class="changelog_list">
        <table>
            <tr>
                <th>Änderungen</th>
                <th>Zeitpunkt</th>
            </tr>

            {#each changelog as entry}
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

    h2 {
        text-align: center;
    }

	.changelog_list {
        background-color: var(--light-background);
        border-radius: .5rem;
		margin: 1rem 0;
        padding: .8rem 0;
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

    .changelog_list td, th {
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: var(--background);
    }
</style>