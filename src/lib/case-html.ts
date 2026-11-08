// Turns the rendered Markdown of a work page into the case-study layout: numbered
// sections, figures with captions from the frontmatter, booktabs tables, a metric
// strip at the top of "Results" and an errata panel for "Notes".
import { files } from './data';

type Visual = { src: string; alt: string; caption: string };
type Metric = { value: string; label: string; kind?: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const slugify = (s: string) => s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function metricStrip(metrics: Metric[]) {
  if (!metrics.length) return '';
  const n = metrics.length >= 4 ? 4 : metrics.length;
  const cells = metrics
    .map((m) => {
      const kind = m.kind ? `<dt class="label">${esc(m.kind)}</dt>` : `<dt class="vh">Figure</dt>`;
      const valCls = m.kind === 'finding' ? 'm-val m-val--finding' : 'm-val';
      return `<div>${kind}<dd><span class="${valCls}">${esc(m.value)}</span><span class="m-label">${esc(m.label)}</span></dd></div>`;
    })
    .join('');
  return `<dl class="metric-strip metric-strip--${n}">${cells}</dl>`;
}

export function transformCaseHtml(html: string, opts: { visuals: Visual[]; metrics: Metric[]; idPrefix: string }) {
  let fig = 0;
  const sections: { id: string; title: string }[] = [];

  // Figures: a paragraph that holds only an image.
  html = html.replace(/<p>\s*(<img\b[^>]*>)\s*<\/p>/g, (_m, img: string) => {
    const src = decode((img.match(/\bsrc="([^"]*)"/) || [])[1] || '');
    const altMd = decode((img.match(/\balt="([^"]*)"/) || [])[1] || '');
    const v = opts.visuals.find((x) => x.src === src);
    const dims = files.assets[src];
    fig += 1;
    const size = dims?.width && dims?.height ? ` width="${dims.width}" height="${dims.height}"` : '';
    const alt = v?.alt || altMd;
    const caption = v?.caption || altMd;
    return `<figure class="fig"><div class="fig__canvas fig__canvas--plate"><img src="${esc(src)}" alt="${esc(alt)}"${size} loading="lazy" decoding="async"></div><figcaption><span class="fig__no">Fig. ${fig}</span>${esc(caption)}</figcaption></figure>`;
  });

  // External links get the arrow icon; PDF links say so.
  html = html.replace(/<a href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (m, href: string, rest: string, text: string) => {
    const external = /^https?:\/\//.test(href) && !href.startsWith('https://alphashk.github.io/');
    const pdf = /\.pdf($|[?#])/i.test(href) && !/pdf/i.test(stripTags(text));
    if (!external && !pdf) return m;
    const icon = external ? '<span class="icon icon--ext" aria-hidden="true"></span>' : '';
    return `<a href="${href}"${rest}>${text}${pdf ? ' (PDF)' : ''}${icon}</a>`;
  });

  const parts = html.split(/(?=<h2\b)/);
  const out: string[] = [];
  if (parts[0] && !parts[0].startsWith('<h2')) {
    const intro = parts.shift() || '';
    if (stripTags(intro).trim()) out.push(`<div class="case-sec prose">${intro}</div>`);
  }
  parts.forEach((part) => {
    const m = part.match(/^<h2\b[^>]*>([\s\S]*?)<\/h2>/);
    if (!m) { out.push(part); return; }
    const titleHtml = m[1];
    const title = decode(stripTags(titleHtml)).trim();
    let body = part.slice(m[0].length);
    const id = `${opts.idPrefix}${slugify(title) || `section-${sections.length + 1}`}`;
    const lower = title.toLowerCase();
    let caption = title;
    body = body.replace(/<table>/g, () => `<div class="tbl-wrap"><table class="tbl tbl--prose"><caption class="vh">${esc(caption)}</caption>`).replace(/<\/table>/g, '</table></div>');
    if (lower === 'results' && opts.metrics.length) body = metricStrip(opts.metrics) + body;
    if (lower.startsWith('what i learned')) body = body.replace(/<ul>/, '<ul class="learned">');
    if (lower === 'notes') body = `<aside class="errata" aria-label="Notes"><span class="label">Notes</span>${body}</aside>`;
    sections.push({ id, title });
    const n = String(sections.length).padStart(2, '0');
    out.push(`<section class="case-sec prose" aria-labelledby="${id}"><h2 id="${id}"><span class="n" aria-hidden="true">${n}</span>${titleHtml}</h2>${body}</section>`);
    caption = title;
  });
  return { html: out.join('\n'), sections, figures: fig };
}
