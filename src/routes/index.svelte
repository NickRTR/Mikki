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
</script>

<!--test for style-->
<body>
    <form>
        <input type="text" placeholder="search" bind:value={searchInput}>
    </form>
    {#each data as page}
        <div class="wiki_post_urls">
            <button onclick="render lol">▶︎</button>
            <a href="/wiki/{page.page_id}" id={page.page_title} sveltekit:prefetch>{page.page_title} 🔗</a>
        </div>
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

    button {
        border-radius: 1rem;
        border: none;
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

    .wiki_post_urls button {
        background-color: #203647;
        color: white;
        font-size: larger;
        border: none;
        cursor: pointer;
        margin-left: .2rem;
        margin-right: .5rem;
    }

    .wiki_post_urls button:active:after {
        content: "▼";
        font-size: larger;
    }
</style>