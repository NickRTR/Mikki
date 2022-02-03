<body>
    <nav>
        <h2>AssemblerWiki</h2>
        <a href="/">Home</a>
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

    h2 {
        margin: 0;
        background-color: black;
    }

    a {
        font-size: 1.5rem;
        background-color: black;
    }

    main {
        max-width: 900px;
        margin: 0 auto;
    }
</style>
