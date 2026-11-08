import { getCollection, type CollectionEntry } from 'astro:content';
import profileJson from '../content/profile.json';
import filesJson from '../content/files.json';
import { extraLinks, tracks, trackOrder, type TrackKey } from '../site.config';

export type Profile = typeof profileJson;
export const profile: Profile = profileJson;
export const files = filesJson as {
  assets: Record<string, { bytes: number; width?: number; height?: number }>;
  papers: { href: string; file: string; pages: number; bytes: number }[];
  cv: { href: string; bytes: number; pages: number | null };
};

type Entry = CollectionEntry<'work'> | CollectionEntry<'projects'>;
export type Link = { label: string; href: string; kind?: string; public?: boolean; meta?: string };
export type Item = {
  slug: string;
  source: 'work' | 'projects';
  entry: Entry;
  data: Entry['data'];
  href: string;
  shortTitle: string;
  tracks: TrackKey[];
  isPublicCode: boolean;
  status: { kind: 'private' | 'competition'; text: string }[];
  links: Link[];
  paper: (Link & { published: boolean }) | null;
};

// Content files tag quant work as quant_dev, quant_research or quant_grad; the site shows one Quant track.
const normTrack = (t: string): TrackKey => (t.startsWith('quant') ? 'quant' : (t as TrackKey));

export function shortTitle(data: { title: string; short_title?: string }) {
  return data.short_title || data.title.split(':')[0].trim();
}

function paperMeta(href: string) {
  const p = files.papers.find((x) => x.href === href);
  if (!p) return undefined;
  return `${p.pages} pp · PDF · ${(p.bytes / 1e6).toFixed(p.bytes < 1e6 ? 2 : 1)} MB`;
}

function statusMarks(data: Entry['data'], isPublicCode: boolean) {
  const marks: Item['status'] = [];
  const s = (data.status || '').toLowerCase();
  if (!isPublicCode) {
    if (s.includes('confidential') || s.includes('employer')) marks.push({ kind: 'private', text: 'Employer work, confidential' });
    else if (s.includes('private code')) marks.push({ kind: 'private', text: 'Private code' });
  }
  if (s.includes('team entry') || s.includes('competition')) marks.push({ kind: 'competition', text: 'Competition, team entry' });
  return marks;
}

function toItem(entry: Entry, source: Item['source']): Item {
  const data = entry.data;
  const isPublicCode = data.code === 'public';
  const own: Link[] = (data.links || []).map((l) => ({ ...l }));
  const extra = (extraLinks[data.slug] || []).filter((x) => !own.some((l) => l.href === x.href));
  const all = [...own, ...extra];
  const paperLink = all.find((l) => l.kind === 'paper');
  const paper = paperLink
    ? {
        ...paperLink,
        published: Boolean(paperLink.href) && paperLink.public !== false && files.papers.some((p) => p.href === paperLink.href),
        meta: paperLink.href ? paperMeta(paperLink.href) : undefined,
      }
    : null;
  const links = all.filter((l) => l.kind !== 'paper' && l.href && l.public !== false);
  return {
    slug: data.slug,
    source,
    entry,
    data,
    href: `/work/${data.slug}/`,
    shortTitle: shortTitle(data),
    tracks: [...new Set((data.tracks || []).map(normTrack))].sort((a, b) => trackOrder.indexOf(a) - trackOrder.indexOf(b)),
    isPublicCode,
    status: statusMarks(data, isPublicCode),
    links,
    paper,
  };
}

let cache: Item[] | null = null;
export async function getItems(): Promise<Item[]> {
  if (cache) return cache;
  const work = await getCollection('work', ({ data }) => data.gated === false);
  const projects = await getCollection('projects');
  cache = [...work.map((e) => toItem(e, 'work')), ...projects.map((e) => toItem(e, 'projects'))]
    .sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order);
  return cache;
}

export async function getItem(slug: string) {
  return (await getItems()).find((i) => i.slug === slug);
}

export function trackLabel(t: TrackKey, form: 'long' | 'short' = 'short') {
  return tracks[t][form];
}

// Status text for a work entry, without any claim that a paper is public while it is not.
export function statusText(item: Item) {
  const parts = (item.data.status || '').split('·').map((s) => s.trim()).filter(Boolean);
  if (item.paper && !item.paper.published) {
    return parts.map((p) => (/public paper/i.test(p) ? 'working paper not yet public' : p)).join(' · ');
  }
  return parts.join(' · ');
}

export function metric(item: Item | undefined, value: string) {
  if (!item) return undefined;
  return (item.data.metrics || []).find((m) => m.value === value);
}

export function cardStack(item: Item) {
  if (item.data.stack_summary) return item.data.stack_summary;
  return (item.data.stack || []).slice(0, 4).map((s) => s.replace(/\s*\(.*\)\s*$/, '')).join(' · ');
}

export function cardFacts(item: Item) {
  if (item.data.card?.facts?.length) return item.data.card.facts.slice(0, 2);
  const facts: { key: string; value: string }[] = [];
  if (item.data.method) facts.push({ key: 'Method', value: item.data.method });
  if (item.data.role) facts.push({ key: 'Scope', value: item.data.role });
  return facts.slice(0, 2);
}

export function cardResult(item: Item) {
  return item.data.card?.result || item.data.summary;
}

export function experience(id: string) {
  return profile.experience.find((e) => e.id === id);
}

// Skills items that mention specific AI coding agents are listed on the about page only.
export function publicSkillItems(items: string[]) {
  return items.filter((s) => !/claude code|codex/i.test(s));
}

export function aiParagraphs() {
  const paras = profile.about_long.split(/\n\n+/);
  const last = paras[paras.length - 1] || '';
  const isAi = /AI coding agents|Claude Code|Codex/i.test(last);
  return { about: isAi ? paras.slice(0, -1) : paras, ai: isAi ? last : '' };
}

export function bytesLabel(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`;
}
