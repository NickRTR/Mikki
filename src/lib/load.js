export async function LoadAll() {
    const jsonWikiPosts = await fetch("https://x.glowman554.gq/api/v2/wikki/page/")
    const data = JSON.parse(jsonWikiPosts)


    data.forEach(element => {
        // write all links styled of course
        
    });
}