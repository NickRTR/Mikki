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
    import {dateToString} from "$lib/helper.js";

    export let data;
</script>

<body>
    <nav>
        <div class="info">
            <h2>Titel: {data.page_title}</h2>
            <p>Erstellt: {dateToString(data.page_created)}</p>
            <p>Bearbeitet: {dateToString(data.page_edited)}</p>
        </div>

        <div class="buttons">
            <img src="/edit.svg" alt="edit" on:click={() => {alert("edit is not available for now")}}>
            <img src="/trash.svg" alt="delete" on:click={() => {alert("delete is not available for now")}}>
        </div>
    </nav>

    <hr>

    <SvelteMarkdown source={data.page_text}/>
</body>

<style>
    body {
        background-color: white;
        border-radius: 1rem;
        color: black;
        margin: 0;
        padding: 1rem;   
        margin-top: 1rem;
    }

    nav {
        justify-content: space-between;
        display: flex;
        align-items: center;
    }

    h2 {
        margin: 0;
    }

    p {
        margin: .5rem 0;
        margin-bottom: 0;
    }

    .buttons {
        display: flex;
        align-items: center;
    }

    .buttons img {
        width: 2rem;
        padding: .5rem;
        cursor: pointer;
    }
</style>

