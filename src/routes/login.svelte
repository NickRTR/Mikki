<script>
	// TODO: Make the style look good (not my responsibility i cant design very well)
	import { has_valid_token, is_valid_token, status_login, start_login } from "$lib/api.js";
	import { onMount } from 'svelte'

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
		} while (token == null);

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
				stage = 5;
			}
		});
	}

</script>

<body>
	{#if stage == 0}
		<p>You are already logged in to log out please use the below button!</p>
		<button on:click={logout}>LogOut</button>
	{:else if stage == 1}
		<div id="satge1">
			<p>Hello and Welcome to the authentication page!</p>
			<p>I will guide you trough the whole process!</p>
			<button id="next" on:click={login_start}>Next</button>
			<button id="token_login" on:click={login_token}>Login with token</button>
		</div>
	{:else if stage == 2}
		<div id="stage2">
			<p style={{
				display: "inline"
			}}>Please send "<code>-auth {login_id}</code>" to the bot on your preferred platform!</p>
		</div>
	{:else if stage == 4}
		<div id="stage4">
			<p>Log in using token</p>
			<form>
				<input type="text" bind:value={input}/>
				<button type="submit" on:click|preventDefault={login_token_submit}>Submit</button>
			</form>
		</div>	
	{:else if stage == 5}
		<div id="stage5">
			<p>Invalid token</p>
			<button on:click={() => {
				stage = 4;
			}}>Go back</button>
		</div>
	{/if}
</body>