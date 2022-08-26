<script>
	import { page } from '$app/stores';
	import { wiki_cache } from '$lib/api.js';
	import { run_update_notifier, copyToClipboard } from '$lib/helper';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	let innerWidth = 0;
	let showHamburger = false;

	let cacheRunning = true;

	const nav = [
		{ title: 'Home', path: '/' },
		{ title: 'Erstellen', path: '/wiki/create' },
		{ title: 'Log', path: '/wiki/changes' },
		{ title: 'Einstellungen', path: '/settings' },
		{ title: 'Login', path: '/account/login' },
		{ title: 'Account Erstellen', path: '/account/create' },
	];

	onMount(async () => {
		if (localStorage.getItem('auto_cache') == 'true') {
			if (navigator.onLine) {
				wiki_cache((p, m) => {
					cacheRunning = true;
					console.log(`Auto caching: ${p + 1} / ${m}`);
				}).then(() => {
					cacheRunning = false;
					console.log('Auto caching done');
				});
			}
		}

		run_update_notifier();
	});
</script>

<svelte:window bind:innerWidth />

<body>
	<SvelteToast />
	<nav>
		<a class="heading" class:running={cacheRunning} href="/" sveltekit:prefetch>AssemblerWiki</a>
		{#if innerWidth >= 850}
			<div class="links">
				{#each nav as link}
					<a
						href={link.path}
						class:active={$page.url.pathname === link.path}
						sveltekit:prefetch
						title={link.title}>{link.title}</a
					>
				{/each}
			</div>
		{:else}
			<input type="checkbox" id="toggle" bind:checked={showHamburger} />
			<label for="toggle"><img src="/menu.svg" alt="Menu" /></label>
		{/if}
	</nav>
	{#if showHamburger}
		<div class="hamburger" transition:slide>
			{#each nav as link}
				<a
					href={link.path}
					class:active={$page.url.pathname === link.path}
					sveltekit:prefetch
					title={link.title}
					on:click={() => {
						showHamburger = false;
					}}>{link.title}</a
				><br />
			{/each}
		</div>
	{/if}
	<main><slot /></main>
	<footer>
		<p>©2022 Janick Voss, Nick Reutlinger</p>
		<p
			class="copyError"
			title="application log kopieren"
			on:click={() => {
				var log = window.application_log.join('\n');
				copyToClipboard(log);
			}}
		>
			📑
		</p>
	</footer>
</body>

<style>
	body {
		font-family: 'JetBrains Mono', monospace;
		scroll-behavior: smooth;
		background-color: var(--background);
		margin: 0;
		color: white;
	}

	nav {
		position: sticky;
		top: 0;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: black;
		padding: 1rem 1.5rem;
		font-size: 1.5rem;
		z-index: 1;
	}

	nav * {
		background-color: black;
	}

	.heading {
		text-decoration: none;
		margin-left: 0;
		border-bottom: 3px solid greenyellow;
	}

	.running {
		border-bottom: 3px solid orange;
	}

	a {
		text-decoration: none;
		margin-left: 0.8rem;
		color: white;
	}

	img {
		width: 3rem;
		margin-bottom: -1rem;
		margin-top: -0.5rem;
	}

	.links a:hover,
	.hamburger a:hover {
		border-bottom: 3px solid var(--accent);
	}

	.links a:focus,
	.hamburger a:focus {
		border-bottom: 3px solid var(--accent);
		outline: none;
	}

	.active {
		border-bottom: 3px solid var(--accent);
	}

	#toggle {
		display: none;
	}

	#toggle + label {
		transition: 500ms ease all;
	}

	#toggle:checked + label {
		transform: rotate(-90deg);
		transition: 500ms ease all;
	}

	.hamburger {
		width: 100%;
		position: fixed;
		margin-top: -0.5rem;
		padding-left: 1.5rem;
		background-color: black;
		padding-bottom: 0.5rem;
	}

	.hamburger a {
		margin: 0;
		line-height: 1.8rem;
	}

	main {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	footer {
		align-items: center;
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	footer p {
		margin: 0;
	}

	.copyError {
		cursor: pointer;
		margin-left: 0.5rem;
	}

	/* variables */

	:global(:root) {
		--accent: #f6c90e;
		--background: #303841;
		--light-background: #3a4750;
	}

	/* Global styles */

	:global(button) {
		margin-top: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 1rem;
		padding: 0.25rem 0.5rem;
		border: none;
		font-weight: bold;
		background-color: var(--accent);
		color: black;
	}

	:global(a) {
		color: white;
	}

	/* Toast styles */
	:root {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 2rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}

	/* media queries */

	@media only screen and (max-width: 600px) {
		a {
			margin-left: 0.3rem;
		}
	}
</style>
