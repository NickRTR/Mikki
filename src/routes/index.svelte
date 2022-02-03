<script context="module">
    export async function load() {
        // const res = await fetch("https://x.glowman554.gq/api/v2/wiki/page/"); // real api
        const res = await fetch("https://api.adviceslip.com/advice"); // placeholer
        const data = await res.json();
        
        if (res.ok) {
            return {
                props: {
                    data: data.slip.advice
                }
            }
        }

        return {
            error: new Error("Could not fetch the guides")
        }
    }
</script>

<script>
    export let data;
</script>

<body>
    <p>{data}</p>
</body>