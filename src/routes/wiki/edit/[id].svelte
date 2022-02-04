<script context="module">
    export async function load (params) {
        return {
            props: {
                id: params.params.id
            }
        }
    }
</script>

<script>
    import {get_api_token, has_valid_token, has_permission, wiki_edit} from "$lib/api.js";

    export let id;
    let title = "";
    let text = "";

    const save = () => {
        if (title !== "") {
            has_valid_token().then(() => {
                has_permission(get_api_token(), "wiki_editor").then(result => {
                    wiki_edit(get_api_token(), id, title, text);
                })
            })
        } else {
            alert("Der Titel darf nicht leer sein.")
        }
    }
</script>

<body>
    <h2>Edit Page</h2>
    <input type="text" placeholder="titel" bind:value={title}>
    <textarea placeholder="text" resi bind:value={text}/>
    <button type="submit" on:click={save}>Speichern</button>
</body>

<style>
    body {
        text-align: center;
    }

    input {
        width: 100%;
        border-radius: 1rem;
        padding: .5rem;
        margin-bottom: .5rem;
        border: none;
        font-size: large;
    }

    textarea {
        width: 100%;
        height: 50vh;
        border-radius: 1rem;
        resize: none;
        padding: .5rem;
        border: none;
    }
</style>