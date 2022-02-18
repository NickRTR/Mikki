<script>
    import { get_api_token, has_valid_token, has_permission, wiki_create } from "$lib/api.js";
    import { redirect } from "$lib/helper.js";
    
    let title = "";
    let text = "";

    const save = () => {
        if (title !== "") {
            has_valid_token().then(result => {
                if (!result) {
                    alert("You need to be logged in to save.");
                    return;
                }
                has_permission(get_api_token(), "wiki_editor").then(async result => {
                    if (!result) {
                        alert("You need to have wiki_editor permission to save.");
                        return;
                    }
                    let res = await wiki_create(get_api_token(), title, text);
                    // window.location.href = "/wiki/view#" + res.page_id;
                    redirect("/wiki/view#" + res.page_id);
                })
            })
        } else {
            alert("Der Titel darf nicht leer sein.");
        }
    }
</script>

<svelte:head>
    <title>Mikki - Erstellen</title>
</svelte:head>

<body>
    <h2>Seite erstellen</h2>
    <input type="text" placeholder="titel" bind:value={title}>
    <textarea placeholder="Markdown" resi bind:value={text}/>
    <button type="submit" on:click={save}>Erstellen</button>
</body>

<style>
    input {
        width: 90%;
        border-radius: 1rem;
        padding: .5rem;
        margin-bottom: .5rem;
        border: none;
        font-size: large;
    }

    textarea {
        width: 90%;
        height: 50vh;
        font-size: larger;
        border-radius: 1rem;
        resize: none;
        padding: .5rem;
        border: none;
    }

    button {
        margin-bottom: 1rem;
    }
</style>