<script>
    import {page} from "$app/stores";

    const nav = [
        {title: "Home", path: "/"},
        {title: "Erstellen", path: "/wiki/create"},
        {title: "Login", path: "/login"},
    ];
</script>

<body>
    <nav>
        <a style="text-decoration: none;" href="/" sveltekit:prefetch>AssemblerWiki</a>
        <div class="links">
            {#each nav as link}
            <a href={link.path} class:active={$page.url.pathname === link.path} sveltekit:prefetch>{link.title}</a>
            {/each}
        </div>
    </nav>
    <main><slot></slot></main>
</body>

<style>
    * {
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300&display=swap");
        font-family: 'JetBrains Mono', monospace;
        scroll-behavior: smooth;
        background-color: var(--background);
        margin: 0;
        color: white;
    }

    nav {
        color: white;
        display: flex;
        justify-content: space-between;
        background-color: black;
        padding: 1rem;
    }

    nav * {
        background-color: black;
    }

    a {
        font-size: 1.5rem;
        text-decoration: none;
        margin-left: .8rem;
    }

    .links a:hover {
        border-bottom: 3px solid var(--accent);
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
    }

    :global(h2) {
		color: var(--accent);
    }
</style>
