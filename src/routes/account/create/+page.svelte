<script>
	import { onMount } from 'svelte';
	import { create_account, get_api_token, has_valid_token } from '$lib/api.js';

	let emailInput;
	let passwordInput;

	let logged_in = false;

	onMount(async () => {
		if (get_api_token()) {
			if (!(await has_valid_token(get_api_token()))) {
				localStorage.removeItem('token');
				location.reload();
			} else {
				logged_in = true;
			}
		}
	});
	let showPassword = false;

	async function signup() {
		var login = {
			username: emailInput,
			password: passwordInput
		};
		console.log(login);
		create_account(login).then((r) => {
			window.location = '/';
		});
	}

	function logout() {
		localStorage.removeItem('token');
		location.reload();
	}

	async function _delete() {
		if (await confirm('Account löschen? Es gibt kein zurück mehr!')) {
			await delete_account();
			location.reload();
		}
	}
</script>

<svelte:head>
	<title>Mikki - Login</title>
</svelte:head>

<body>
	<h1>Registrieren</h1>
	{#if logged_in}
		<p>Sie sind bereits angemeldet. Drücken Sie den unteren Button, um sich auszuloggen.</p>
		<button on:click={logout}>Ausloggen</button>
		<button on:click={_delete}>Account löschen</button>
	{:else}
		<form on:submit|preventDefault={signup} autocomplete="off">
			<label for="email">E-mail: </label><br />
			<input
				type="email"
				id="email"
				name="email"
				placeholder="email@email.com"
				bind:value={emailInput}
			/><br />
			<label for="password">Passwort:</label><br />
			<div class="password">
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Passwort"
					bind:value={passwordInput}
				/>
				<input
					type="checkbox"
					id="togglePassword"
					class:show={showPassword}
					bind:checked={showPassword}
					on:change={() => {
						document.querySelector('#password').type = showPassword ? 'text' : 'password';
					}}
				/>
				<label class="viewPasswordLabel" for="togglePassword"
					><img src="/showPassword.svg" alt="show" /></label
				><br />
			</div>

			<button type="submit">Registrieren</button>
		</form>
	{/if}
</body>

<style>
	h1 {
		margin: 0;
		cursor: pointer;
	}

	form {
		margin-top: 1rem;
		font-weight: 600;
	}

	input {
		outline: none;
		border: 2px solid transparent;
		transition: all 0.1s ease-in-out;
		border-radius: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		padding: 0 0.5rem;
		margin: 0.5rem 0;
		height: 2rem;
	}

	input:hover,
	input:focus {
		border-color: var(--accent);
	}

	input[type='email'] {
		width: 300px;
	}

	input[type='password'] {
		width: 268px;
	}

	input::placeholder {
		font-size: 1rem;
	}

	.password {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type='checkbox'] {
		display: none;
	}

	.viewPasswordLabel {
		filter: opacity(50%);
		border-radius: 100%;
		margin-top: 0.5rem;
	}

	input[type='checkbox']:checked + .viewPasswordLabel {
		filter: opacity(100%);
	}

	img {
		width: 2rem;
		cursor: pointer;
	}

	button {
		font-size: 1rem;
		outline: none;
		border: 3px solid transparent;
		transition: all 0.1s ease-in-out;
		padding: 0.3rem 0.7rem;
		margin-top: 0.5rem;
		background-color: var(--accent);
		font-weight: 600;
		border-radius: 1rem;
	}

	button:hover,
	button:focus {
		border-color: var(--minor);
	}
</style>
