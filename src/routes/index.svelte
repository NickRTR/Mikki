<script context="module">
    export async function load() {
        // const res = await fetch("https://x.glowman554.gq/api/v2/wiki/page/list"); // real api
        // // const res = await fetch("https://api.adviceslip.com/advice"); // placeholer
        // const data = await res.json();

        const res = await wiki_get();

        return {
            props: {
                data: res // array of objects containing page_id and page_title
            }
        }
    }
</script>

<script>
    import SvelteMarkdown from 'svelte-markdown';
    import {Render} from "$lib/render.js"
    import { wiki_get } from "$lib/api.js"
    export let data;
    const test_json = `{"page_id": "73457834657", "page_title": "test_t", "page_text": "# h1 header rendered. Fuck yeah"}`
</script>

<!--test for style-->
<div class="wiki_post_urls">
    <a class="wiki_post_url" href="redirect to new _blank and render by id">Test Post</a>
</div>

<body>
    {#each data as page}
        <a href={`/wiki/${page.id}`>
    {/each}
</body>

<style>
    .wiki_post_urls {
        border: 5px solid lightgray;
        border-radius: 5px;
        background-color: lightgray;
        font-size: large;
        /* we need fucking jetbrains mono and apple font*/
        padding: 25px;
        margin-left: 10rem;
        margin-right: 10rem;
        text-align: center;
    }
    .wiki_post_urls a {
        padding-left: 25px;
        padding-right: 25px;
    }
</style>