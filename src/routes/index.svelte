<script context="module">
    import { wiki_list } from "$lib/api.js";

    export async function load() {
        const res = await wiki_list();
        return {
            props: {
                data: res // array of objects containing page_id and page_title
            }
        }
    }
</script>

<script>
    import {wiki_get} from "$lib/api.js";
    import SvelteMarkdown from 'svelte-markdown';
    import {slide} from "svelte/transition";

    export let data;
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
</script>

<body>
    <form>
        <input type="text" placeholder="search" bind:value={searchInput}>
    </form>
    {#each data as page}
        <div class="wiki_post_urls">
            <input type="checkbox" class="toggle" id={page.page_id} on:change={() => {render(page.page_id)}}>
            <label for={page.page_id}>></label>
            <a href="/wiki/{page.page_id}" id={page.page_title} sveltekit:prefetch>{page.page_title} 🔗</a>
        </div>
        {#if page.text}
            <div class="text" in:slide out:slide>
                <SvelteMarkdown source={page.text}/>
            </div>
        {/if}
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
        margin-right: .5rem;
    }

	.wiki_post_urls {
        display: flex;
        border-radius: 5px;
        background-color: #203647;
        font-size: large;
        margin: 1rem 0;
        padding: .8rem 0;
        text-align: center;
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
    }

    .toggle:checked + label {
        transform: rotate(90deg);
    }

    .text {
        border: 2px solid white;
        padding: 0 .5rem;
        margin: 0 1rem;
    }
</style>