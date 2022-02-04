<script context="module">
    import { wiki_get } from "$lib/api";

    export async function load(params) {
        const res = await wiki_get(params.params.id);
        return {
            props: {
                data: res // array of objects containing page_id and page_title
            }
        }
    }
</script>

<script>
    import SvelteMarkdown from 'svelte-markdown';
    export let data;
</script>

<body>
    <button><img src="button should go here"></button>
</body>

<SvelteMarkdown source={data.page_text}/>