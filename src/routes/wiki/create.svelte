<script>
    import {get_api_token, has_valid_token, has_permission, wiki_create} from "$lib/api.js";
    
    let title = "";
    let text = "";

    const save = () => {
        if (title !== "") {
            has_valid_token().then(() => {
                has_permission(get_api_token(), "wiki_editor").then(async result => {
                    let res = await wiki_create(get_api_token(), title, text);
                    window.location.href = "/wiki/" + res.page_id;
                })
            })
        } else {
            alert("Der Titel darf nicht leer sein.");
        }
    }
</script>

<body>
    <h2>Seite erstellen</h2>
    <input type="text" placeholder="titel" bind:value={title}>
    <textarea placeholder="Markup" resi bind:value={text}/>
    <button type="submit" on:click={save}>Erstellen</button>
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