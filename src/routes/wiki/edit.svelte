<script>
    import { get_api_token, has_valid_token, has_permission, wiki_edit, wiki_get } from "$lib/api.js";
    import { redirect, toBase64 } from "$lib/helper.js";
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

    // du musst in der load function bleiben
    const save = () => {
        if (page.page_title !== "") {
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
                    wiki_edit(get_api_token(), id, page.page_title, page.page_text).then(() => {
                    	disabled = "disabled";
                    	redirect("/");
					}).catch((e) => {
						alert("Something is wrong could not save! Maybe the file is too big?");
					});
                })
            })
        } else {
            alert("Der Titel darf nicht leer sein.")
        }
    }

	var picture_proggress = 0;
	var picture_proggress_show = false;

	function on_picture_upload() {
		var element = document.getElementById('uploaded_picture');

		if (element.files.length != 1) {
			alert("Flasche anzahl an dateien ausgewählt!");
			delete element.files;
		} else {
			toBase64(element.files[0], progress => {
				picture_proggress = progress;
				picture_proggress_show = true;
			}).then(res => {
				// console.log(res);
				picture_proggress_show = false;

				var textarea = document.getElementById("editor");

				var tmp = textarea.value.slice(0, textarea.selectionStart) + `![${element.files[0].name}](${res})\n` + textarea.value.slice(textarea.selectionStart);
				textarea.value = tmp;
				page.page_text = tmp;
				textarea.focus();

				delete element.files;
			});
		}
	}
</script>

<svelte:head>
    <title>Mikki - Bearbeiten</title>
</svelte:head>

<body>
    <h2>Edit Page</h2>
    <input type="text" placeholder="titel" bind:value={page.page_title}>
    <textarea id="editor" placeholder="text" resi bind:value={page.page_text} />
    <button type="submit" on:click={save} {disabled}>Speichern</button>
	<button onclick="document.getElementById('uploaded_picture').click();">Bild hohchladen</button>
	
	<input type="file" style="display:none;" id="uploaded_picture" name="file" on:change={on_picture_upload}/>

	{ #if picture_proggress_show }
		<progress max="100" value={picture_proggress}></progress>
	{ /if }
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
        width: 90%;
        margin: .5rem;
        border-radius: 1rem;
        padding: .5rem;
        margin-bottom: .5rem;
        border: none;
        font-size: large;
    }

    textarea {
        width: 90%;
        font-size: larger;
        height: 50vh;
        border-radius: 1rem;
        resize: none;
        padding: .5rem;
        border: none;
    }
</style>