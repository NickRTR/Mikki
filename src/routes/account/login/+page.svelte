<script>
	import { onMount } from "svelte";
	import { copyToClipboard } from "$lib/helper.js";
	import { login_account } from "$lib/api.js";

	onMount(() => {});
	let showPassword = false;

	async function login_submit() {
		console.log("login_submit()");
		var login = {
			username: document.getElementById("inputUsername").value,
			password: document.getElementById("inputPassword").value
		};
		console.log(login);
		login_account(login).then(console.log);
	}
</script>

<svelte:head>
	<title>Mikki - Login</title>
</svelte:head>

<body>
	<div>
		<p>Einloggen</p>
		<form>
			<input type="text" placeholder="username" id="inputUsername" />
			<input type="password" placeholder="password" id="inputPassword" />
			<input
				type="checkbox"
				id="togglePassword"
				bind:checked={showPassword}
				on:change={() => {
					document.querySelector("#inputPassword").type = showPassword ? "text" : "password";
				}}
			/>
			<label for="togglePassword"><img src="/showPassword.svg" alt="show" /></label>
		</form>
		<button type="submit" on:click|preventDefault={login_submit}>Submit</button>
	</div>
</body>

<style>
	button:hover {
		text-decoration: underline;
	}

	button {
		margin-bottom: 1rem;
	}

	input {
		border: none;
		margin-bottom: 0.6rem;
		padding: 0.4rem 1rem;
		border-radius: 1rem;
	}

	input[type="checkbox"] {
		display: none;
	}

	form {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	img {
		width: 2rem;
		margin-bottom: 0.2rem;
		cursor: pointer;
	}

	label {
		filter: brightness(0.5);
	}

	input[type="checkbox"]:checked + label {
		filter: brightness(1);
	}
</style>
