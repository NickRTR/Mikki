<script context="module">
    import { wiki_list, wiki_changelog } from "$lib/api.js";

    export async function load() {
        const res = await wiki_list();
		const changelog = await wiki_changelog();
        return {
            props: {
                data: res, // array of objects containing page_id, page_title, page_created and page_edited
				changelog: changelog
            }
        }
    }
</script>

<script>
    import {wiki_get} from "$lib/api.js";
    import { copyToClipboard, dateToString } from "$lib/helper";
    import SvelteMarkdown from "svelte-markdown";
    import {slide} from "svelte/transition";

    export let data;
	export let changelog;
    let oldData = data;

    let searchInput = "";

    $: {  
        data = []
        if (searchInput !== "") {
            for (let i in oldData) {
                if (oldData[i].page_title.toLowerCase().includes(searchInput.toLowerCase())) {
                    data = [...data, oldData[i]];
                }
            }
        } else {
            data = oldData;
        }
    }

    const render = async (id) => {
        let checked = document.getElementById(id).checked;

        for (let i in data) {
            if (data[i].page_id === id) {
                if (checked) {
                    Object.assign(data[i], {"text": "loading data"});
                    const res = await wiki_get(id);
                    Object.assign(data[i], {"text": res.page_text});
                } else {
                    delete data[i].text;
                }
                data = data;
            }
        }
    }

	let show_changelog = false;
</script>

<body> 
    <form>
        <input type="text" placeholder="search" style="text-align: center;" bind:value={searchInput}>
    </form>
    {#each data as page}
        <div class="wiki_post_urls">
            <input type="checkbox" class="toggle" id={page.page_id} on:change={() => {render(page.page_id)}}>
            <label for={page.page_id}>▶︎</label>
            <a href="/wiki/{page.page_id}" id={page.page_title} sveltekit:prefetch>{page.page_title}</a>
            <span on:click={(event) => {
                copyToClipboard(window.origin + "/wiki/" + page.page_id);
            }}>🔗</span>
        </div>
        {#if page.text}
            <div class="text" in:slide out:slide>
                <SvelteMarkdown source={page.text}/>
            </div>
        {/if}
    {:else}
        <p>Keine passenden Einträge vorhanden</p>
    {/each}

	<div class="changelog_list">
		<!-- TODO: fix the ▶︎ -->
		<input type="checkbox" class="toggle" id="changelog_toggle" on:change={() => {show_changelog = !show_changelog}}>
		<label for="changelog_toggle">▶︎</label>
		<a id="changelog">Wiki changes</a>

		<!-- TODO: fix the style i guess -->

		{#if show_changelog}			
			<ul in:slide out:slide>
				{#each changelog as entry}
					<li>
						<p>{entry.what} at {dateToString(entry.when)}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</body>

<style>
    body {
        margin: 0 1rem;
    }

    form {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

    input {
        border-radius: 1rem;
        padding: .3rem .5rem;
        border: none;
        font-size: 1.5rem;
    }

	.changelog_list {
        background-color: var(--light-background);
        border-radius: .5rem;
		margin: 1rem 0;
        padding: .8rem 0;
	}

	.changelog_list li {
		list-style: none;
        display: flex;
	}

	.changelog_list a {
		text-decoration: none;
        color: white;
	}


	.wiki_post_urls {
        display: flex;
        align-items: center;
        border-radius: .5rem;
        background-color: var(--light-background);
        font-size: 1.2rem;
        margin: 1rem 0;
        padding: .8rem 0;
        text-align: center;
    }

    .wiki_post_urls span {
        margin-left: auto;
        margin-right: .5rem;
        cursor: pointer;
    }

    .wiki_post_urls a {
        text-decoration: none;
        color: white;
    }
    
    .wiki_post_urls a:hover {
        text-decoration: underline;
    }

    .toggle {
        display: none;
    }

    label {
        margin: 0 .5rem;
        padding-top: .1rem;
        cursor: pointer;
        color: var(--accent);
    }

    .toggle:checked + label {
        transform: rotate(90deg);
    }

    .text {
        border: 2px solid white;
        border-radius: .5rem;
        padding: 0 .5rem;
        margin: 0 1rem;
    }

    p {
        text-align: center;
    }
</style>