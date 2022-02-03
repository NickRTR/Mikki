<script context="module">
    export async function load() {
        // const res = await fetch("https://x.glowman554.gq/api/v2/wiki/page/"); // real api
        const res = await fetch("https://api.adviceslip.com/advice"); // placeholer
        const data = await res.json();
        
        if (res.ok) {
            return {
                props: {
                    data: data.slip.advice
                }
            }
        }

        return {
            error: new Error("Could not fetch the guides")
        }
    }
</script>
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

<script>
    import SvelteMarkdown from 'svelte-markdown';
    import {Render} from "$lib/render.js"
    export let data;
    const test_json = `{"page_id": "73457834657", "page_title": "test_t", "page_text": "# h1 header rendered. Fuck yeah"}`
</script>

<!--test for style-->
<div class="wiki_post_urls">
    <a class="wiki_post_url" href="redirect to new _blank and render by id">Test Post</a>
</div>

<SvelteMarkdown source={Render(test_json)} />

<body>
    <p>{data}</p>
</body>
