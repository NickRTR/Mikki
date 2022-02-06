<script>
    import {get_api_token, has_valid_token, has_permission, wiki_edit, wiki_get} from "$lib/api.js";
    import { onMount } from "svelte";

    let id = "";
    let page = {
        page_title: "",
        page_text: ""
    };
    
    onMount(() => {
		id = window.location.hash.substr(1);
        wiki_get(id).then(res => {
            page = res;
            console.log(page);
        });
    });

    let disabled = "";

    let title = page.page_title;
    let text = page.page_text;
    // du musst in der load function bleiben
    const save = () => {
        if (title !== "") {
            has_valid_token().then(result => {
                if (!result) {
                    alert("You need to be logged in to save.");
                    return;
                }
                has_permission(get_api_token(), "wiki_editor").then(result => {
                    if (!result) {
                        alert("You need to have the wiki_editor permission to save.");
                        return;
                    }
                    wiki_edit(get_api_token(), id, page.page_title, page.page_text);
                    disabled = "disabled";
                    window.location.href = "/";
                })
            })
        } else {
            alert("Der Titel darf nicht leer sein.")
        }
    }
</script>

<svelte:head>
    <title>Wikki - Bearbeiten</title>
</svelte:head>

<body>
    <h2>Edit Page</h2>
    <input type="text" placeholder="titel" bind:value={page.page_title}>
    <textarea placeholder="text" resi bind:value={page.page_text} />
    <button type="submit" on:click={save} {disabled}>Speichern</button>
</body>

<style>
    button {
        font-size: larger;
        background-color: var(--light-background);
        padding: 5px;
        color: white;
        text-decoration: underline;
        margin: 1rem;
        border: none;
        background: none;
        font-weight: bold;
    }
    
    button:hover {
        cursor: pointer;
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
        font-size: larger;
        height: 50vh;
        border-radius: 1rem;
        resize: none;
        padding: .5rem;
        border: none;
    }
</style>