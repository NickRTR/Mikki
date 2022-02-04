<body>
    <nav>
        <a style="text-decoration: none;" href="/">AssemblerWiki</a>
        <div class="links">
            <a href="/">Home</a>
            <a href="/login">Login</a>
        </div>
    </nav>
    <main><slot></slot></main>
</body>

<style>
    * {
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300&display=swap");
        font-family: 'JetBrains Mono', monospace;
        scroll-behavior: smooth;
        background-color: #12232e;
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
    }

    main {
        max-width: 900px;
        margin: 0 auto;
    }
</style>
