<script>
	// TODO: Make the style look good (not my responsibility i cant design very well)
	import { has_valid_token, is_valid_token, status_login, start_login, stop_login } from "$lib/api.js";
	import { onMount } from 'svelte';
	import { copyToClipboard } from "$lib/helper.js";

	let login_id = "";
	let stage = -1;

	onMount(() => {
		has_valid_token().then(result => {
			if (result) {
				stage = 0;
			} else {
				stage = 1;
			}
		});
	});

	let logout = () => {
		localStorage.setItem("token", null);
		stage = 1;
	}

	let login_start = async () => {
		let login_id_ = (await start_login()).id;

		login_id = login_id_;
		stage = 2;

		let token = null;
		do {
			token = (await status_login(login_id_)).token;

			if (token == null) {
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		} while (token == null && stage == 2);

		if (stage != 2) {
			return;
		}

		localStorage.setItem("token", token);
		stage = 0;
	}

	let login_token = () => {
		stage = 4;
	}

	let input = "";

	let login_token_submit = () => {
		is_valid_token(input).then(result => {
			if (result) {
				localStorage.setItem("token", input);
				stage = 0;
			} else {
				alert("Ungültiges Token");
				input = "";
			}
		});
	}
</script>

<body>
	<div class="middle">
		{#if stage == 0}
			<p>Sie sind bereits eingeloggt. Drücken Sie den unteren Button, um sich auszuloggen.</p>
			<button on:click={logout}>Ausloggen</button>
		{:else if stage == 1}
			<div id="satge1">
				<h2>Herzlich willkommen zum Login!</h2>
				<p>Folgen Sie den Anweisungen um sich einzuloggen.</p>
				<button id="next" on:click={login_start}>Weiter</button>
				<button id="token_login" on:click={login_token}>Mit Token einloggen</button>
			</div>
		{:else if stage == 2}
			<div id="stage2">
				<p>Bitte senden Sie "<em on:click={() => {copyToClipboard("-auth " + login_id)}}>-auth {login_id}</em>" an den Bot auf ihrer präferierten Platform (Discord, Telegram).</p>
				<p>Anschließend können Sie auf diese Seite zurückkehren und sind mit Ihren Berechtigungen eingeloggt.</p>
				<p class="copy" on:click={() => {copyToClipboard("-auth " + login_id)}}>Befehl kopieren</p>
				<button on:click={() => {
					stop_login(login_id).then(() => {
						stage = 1;
					});
				}}>Zurückkehren</button>
			</div>
		{:else if stage == 4}
			<div id="stage4">
				<p>Mit Token einloggen</p>
				<form>
					<input type="text" placeholder="token" bind:value={input}/>
				</form>
				<button on:click={() => {
					stage = 1;
				}}>Zurückkehren</button>
				<button type="submit" on:click|preventDefault={login_token_submit}>Submit</button>
			</div>	
		{/if}
	</div>
</body>

<style>
	body {
		text-align: center;
		display: flex;
		justify-content: center;
	}

	em {
		font-size: 1rem;
		font-weight: bold;
		font-style: normal;
		cursor: pointer;
	}

	.copy {
		text-decoration: underline;
		cursor: pointer;
	}

	.middle {
		margin: 0;
		position: absolute;
		top: 50%;
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
		border-radius: 1rem;
	}

	button:hover {
		text-decoration: underline;
	}

	input {
		border: none;
		margin-bottom: .6rem;
		padding: .4rem 1rem;
		border-radius: 1rem;
	}
</style>