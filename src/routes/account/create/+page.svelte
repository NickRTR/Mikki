<script>
	import { onMount } from 'svelte';
	import { create_account } from '$lib/api.js';


	onMount(() => {
	});
	let showPassword = false;

	async function create_submit() {
		console.log("create_submit()");
		var create = {
			username: document.getElementById("inputUsername").value,
			password: document.getElementById("inputPassword").value
		};
		console.log(create);
		create_account(create).then(console.log);
	}
</script>

<svelte:head>
	<title>Mikki - Create Account</title>
</svelte:head>

<body>
	<div>
		<p>Account erstellen</p>
		<form>
			<input type="text" placeholder="username" id="inputUsername" />
			<input type="password" placeholder="password" id="inputPassword" />
			<input
				type="checkbox"
				id="togglePassword"
				bind:checked={showPassword}
				on:change={() => {
					document.querySelector('#inputPassword').type = showPassword ? 'text' : 'password';
				}}
			/>
			<label for="togglePassword"><img src="/showPassword.svg" alt="show" /></label>
		</form>
		<button type="submit" on:click|preventDefault={create_submit}>Submit</button>
	</div>
</body>

<style>
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

	input[type='checkbox'] {
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

	input[type='checkbox']:checked + label {
		filter: brightness(1);
	}
</style>
