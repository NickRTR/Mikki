<body>
    <nav>
        <a style="text-decoration: none;" href="/" sveltekit:prefetch>AssemblerWiki</a>
        <div class="links">
            <a href="/" sveltekit:prefetch>Home</a>
            <a href="/wiki/create" sveltekit:prefetch>Erstellen</a>
            <a href="/login" sveltekit:prefetch>Login</a>
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
    }

    .links a {
        border-bottom: 3px solid gray;
    }

    .links a:hover {
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
