const OPEN = `<section id="capabilities-case-studies-home">`;

/**
 * Returns HTML before / after the Capabilities + Case Studies block so we can replace it locally.
 */
export function extractAroundCapabilities(html: string): {
  before: string;
  after: string;
} {
  const start = html.indexOf(OPEN);
  if (start === -1) {
    return { before: html, after: "" };
  }

  let i = start + OPEN.length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    if (html.startsWith("<section", i)) {
      depth++;
      const gt = html.indexOf(">", i);
      if (gt === -1) break;
      i = gt + 1;
      continue;
    }
    if (html.startsWith("</section>", i)) {
      depth--;
      if (depth === 0) {
        const end = i + "</section>".length;
        return { before: html.slice(0, start), after: html.slice(end) };
      }
      i += "</section>".length;
      continue;
    }
    i++;
  }

  return { before: html, after: "" };
}
