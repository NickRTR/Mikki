export function Render(jsonWikiPost) {
    const wikiPost = JSON.parse(jsonWikiPost)

    const pageId = wikiPost.page_id
    const pageTitle = wikiPost.page_title
    const pageText = wikiPost.page_text

    return pageText
    // Use <SvelteMarkdown {var_name} /> to actually render javascript
}
