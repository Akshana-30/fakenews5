// @tiptap/markdown's serializer (backed by `marked`) HTML-entity-encodes
// literal characters like `&`, `<`, `>` even when producing markdown output,
// where they don't need escaping (CommonMark treats a bare `&` as literal
// unless it starts a real entity/numeric reference). Left alone, every
// save/round-trip through the editor corrupts headings, list items, and body
// text like "Visuals & Layout" into "Visuals &amp; Layout". Run editor output
// through this before persisting or displaying it as markdown.
export function fixEditorMarkdownEscaping(markdown: string): string {
    return markdown
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
