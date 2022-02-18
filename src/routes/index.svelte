<script>
    import { wiki_get, wiki_list } from "$lib/api.js";
    import { copyToClipboard, weburl, render_graph } from "$lib/helper";
    import SvelteMarkdown from "svelte-markdown";
    import { slide } from "svelte/transition";
    import { onMount } from "svelte"

    let data = [];
    let oldData = [];

    onMount(async () => {
        data = await wiki_list();
        oldData = data;
    })

    let searchInput = "";
    $: {  
        data = []
        if (searchInput !== "") {
            oldData.forEach(element => {
                if (element.page_title.toLowerCase().includes(searchInput.toLowerCase())) {
                    data = [...data, element]
                }
            });
        } else {
            data = oldData;
        }
    }

    const render = async (id) => {
        let checked = document.getElementById(id).checked;

        data.forEach(async element => {
            if (element.page_id === id) {
                if (checked) {
                    const res = await wiki_get(id, data);
                    element["text"] = res.page_text;
                } else {
                    delete element.text;
                }
                data = data;
            }
        });
    }
</script>

<svelte:head>
    <title>Mikki</title>
</svelte:head>

<body> 
    <h2>Wiki</h2>

    <form>
        <input style="" type="text" placeholder="search" bind:value={searchInput}>
    </form>
    {#each data as page}
        <div class="wiki_post_urls">
            <input type="checkbox" class="toggle" id={page.page_id} on:change={() => {render(page.page_id)}}>
            <label for={page.page_id}>▶︎</label>
            <a href="/wiki/view#{page.page_id}" id={page.page_title} sveltekit:prefetch>{page.page_title}</a>
            <span title="link kopieren" on:click={() => {copyToClipboard((window.__TAURI__ ? weburl : window.origin) + "/wiki/view#" + page.page_id)}}>📌</span>
        </div>
        {#if page.text}
            <div class="text" transition:slide|local>
                <SvelteMarkdown source={page.text} on:parsed={render_graph}/>
            </div>
        {/if}
    {:else}
        <p>Keine passenden Einträge vorhanden</p>
    {/each}
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

	.wiki_post_urls {
        display: flex;
        align-items: center;
        border-radius: .5rem;
        background-color: var(--light-background);
        font-size: 1.2rem;
        margin: 1rem 0;
        padding: .8rem 0;
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
        cursor: pointer;
        color: var(--accent);
    }

    .toggle:checked + label {
        transform: rotate(90deg);
    }

    .text {
        text-align: left;
        border: 2px solid white;
        background-color: var(--light-background);
        border-radius: .5rem;
        padding: 0 .5rem;
        margin: 0 1rem;
	    overflow-x: auto;
    }

    @media only screen and (max-width: 600px) {
        label {
            padding-bottom: 4px;
        }
    }
</style>
