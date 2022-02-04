<script context="module">
    import { get_api_token, wiki_delete, wiki_get, has_valid_token, has_permission, wiki_get_download } from "$lib/api";

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
    import { dateToString, downloadFile } from "$lib/helper.js";

    export let data;

    const deleteWiki = async () => {
        has_valid_token().then(result => {
            if (!result) {
                alert("You need to login first!");
            }
            has_permission(get_api_token(), "wiki_delete").then(result => {
                if (result) {
                    if (confirm("Seite löschen? Es gibt kein zurück mehr!")) {
                        wiki_delete(get_api_token(), data.page_id).then(() => {
                            window.location.href = "/";
                        });
                    }
                } else {
                    alert("You don't have permission to delete this wiki page");
                }
            });
        });
    }

    const download = async () => {
        let res = await wiki_get_download(data.page_id);
        //document.location = res.download_url;
        downloadFile(res.download_url);
        // wiki_get_download(data.page_id).then(res => {
        //     document.location = res.download_url;
        // });
    }
</script>

<body>
    <nav>
        <div class="info">
            <h2>Titel: {data.page_title}</h2>
            <p>Erstellt: {dateToString(data.page_created)}</p>
            <p>Bearbeitet: {dateToString(data.page_edited)}</p>
        </div>

        <div class="buttons">
            <img src="/edit.svg" alt="edit" on:click={() => {window.open("/wiki/edit/" + data.page_id)}} title="Editieren">
            <img src="/trash.svg" alt="delete" on:click={deleteWiki} title="Löschen">
            <button type="button" on:click={download}>Download</button>
        </div>
    </nav>
    <hr>
    <SvelteMarkdown source={data.page_text}/>

</body>

<style>
    body {
        background-color: var(--light-background);
        border-radius: 1rem;
        color: white;
        margin: 0;
        padding: 1rem;   
        margin: 1rem;
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

