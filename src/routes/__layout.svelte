<script>
    import {page} from "$app/stores";
    import { wiki_cache } from "$lib/api.js";
	import { onMount } from 'svelte';

    const nav = [
        {title: "Home", path: "/"},
        {title: "Erstellen", path: "/wiki/create"},
        {title: "Log", path: "/wiki/changes"},
        {title: "Einstellungen", path: "/settings"},
        {title: "Login", path: "/login"},
    ];

    onMount(async () => {
        if (localStorage.getItem("auto_cache") == "true") {
            if (navigator.onLine) {
                wiki_cache((p, m) => {
                    console.log(`Auto caching: ${p + 1} / ${m}`);
                }).then(() => {
                    console.log("Auto caching done");
                });
            }
        }
    });
</script>

<body>
    <nav>
        <a class="heading" href="/" sveltekit:prefetch>AssemblerWiki</a>
        <div class="links">
            {#each nav as link}
                <a href={link.path} class:active={$page.url.pathname === link.path} sveltekit:prefetch title={link.title}>{link.title}</a>
            {/each}
        </div>
    </nav>
    <main><slot></slot></main>
    <!-- <footer>
        <p>©2022 </p>
    </footer> -->
</body>

<style>
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
    }

    nav * {
        background-color: black;
    }

    .heading {
        text-decoration: none;
        margin-left: 0;
    }

    a {
        text-decoration: none;
        margin-left: .8rem;
        color: white;
    }

    .links a:hover {
        border-bottom: 3px solid var(--accent);
    }

    .links a:focus {
        border-bottom: 3px solid var(--accent);
        outline: none;
    }

    .active {
        border-bottom: 3px solid var(--accent);
    }

    main {
        max-width: 900px;
        margin: 0 auto;
    }
    
    /* variables */

    :global(:root) {
        --accent: #F6C90E;
        --background: #303841;
        --light-background: #3A4750;
    }

    :global(button) {
        margin-top: .5rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 1rem;
		padding: .25rem .5rem;
		border: none;
		font-weight: bold;
		background-color: var(--accent);
        color: black;
    }

    /* media queries */

    @media only screen and (max-width: 600px) {
        nav {
            font-size: .9rem;
            padding: 1rem .5rem;
        }
        
        a {
            margin-left: .3rem;
        }
    }
</style>
