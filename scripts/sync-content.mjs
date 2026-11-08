#!/usr/bin/env node
// Copies the site content from the private content folder into this project.
//
// - Work pages: <content>/work/*.md  -> src/content/work/<slug>.md
// - Profile:    <content>/profile.json -> src/content/profile.json (sanitized)
// - Assets:     only the files that published work entries reference (an allowlist,
//               never the whole folder), plus the CV and any public paper edition.
//
// The content folder defaults to ../site-content next to this repository and can be
// set with SITE_CONTENT_DIR. When it is missing (for example on the CI runner), the
// script keeps the committed copies and exits without changes.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.env.SITE_CONTENT_DIR || join(root, '..', 'site-content'));

// Gates that the content owner has cleared. Entries with any other gate stay out.
const CLEARED_GATES = new Set(['roman', 'q20']);
// The public CV. The other CV variant in the content folder is never published.
const CV_SOURCE = 'assets/cv/Denys_Shkola_CV.pdf';
const CV_TARGET = 'public/cv/denys-shkola-cv.pdf';
// A paper is published only as a short public edition; longer builds stay private.
const PAPER_MAX_PAGES = 25;
// Keys that carry provenance and never ship.
const PRIVATE_KEYS = new Set(['_meta', 'sources', 'bullet_sources', 'confidence', 'source']);

const contentDir = join(root, 'src', 'content');
const manifestPath = join(contentDir, 'sync-manifest.json');

function log(msg) { console.log(`[sync] ${msg}`); }
function fail(msg) { console.error(`[sync] ERROR: ${msg}`); process.exit(1); }

if (!existsSync(source) || !existsSync(join(source, 'profile.json'))) {
  log(`content folder not found (${relative(root, source) || source}); keeping the committed copies.`);
  process.exit(0);
}

function strip(value) {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (PRIVATE_KEYS.has(k)) continue;
      out[k] = strip(v);
    }
    return out;
  }
  return value;
}

function isOpenGate(gated) {
  return gated !== undefined && gated !== null && gated !== false && gated !== '' && !CLEARED_GATES.has(String(gated));
}

function pdfInfo(file) {
  try {
    const out = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
    const pages = Number((out.match(/^Pages:\s+(\d+)/m) || [])[1]);
    return Number.isFinite(pages) && pages > 0 ? { pages } : null;
  } catch {
    return null;
  }
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function imageSize(file) {
  const buf = readFileSync(file);
  if (file.endsWith('.png') && buf.length > 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (file.endsWith('.svg')) {
    const head = buf.toString('utf8', 0, Math.min(buf.length, 4000));
    const tag = (head.match(/<svg\b[^>]*>/) || [''])[0];
    const vb = tag.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
    const w = tag.match(/\bwidth="([\d.]+)(px)?"/);
    const h = tag.match(/\bheight="([\d.]+)(px)?"/);
    if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
    if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
  }
  return null;
}

// ---- remove what the previous run wrote --------------------------------------
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { files: [] };
for (const rel of previous.files || []) {
  const abs = join(root, rel);
  const inManaged = ['src/content/work/', 'public/assets/', 'public/papers/', 'public/cv/']
    .some((p) => rel.startsWith(p));
  if (inManaged && existsSync(abs)) rmSync(abs);
}
const written = [];
function write(rel, data) {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, data);
  written.push(rel);
}
function copy(srcAbs, rel) {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  copyFileSync(srcAbs, abs);
  written.push(rel);
}

// ---- work entries -------------------------------------------------------------
const workSrc = join(source, 'work');
const blockedPrefixes = [];
const entries = [];
for (const name of readdirSync(workSrc).filter((f) => f.endsWith('.md')).sort()) {
  const text = readFileSync(join(workSrc, name), 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) fail(`${name}: no frontmatter`);
  const data = YAML.parse(m[1]);
  const slug = data.slug || name.replace(/\.md$/, '');
  if (isOpenGate(data.gated)) {
    blockedPrefixes.push(`/assets/${slug}/`);
    for (const p of [data.hero, ...(data.visuals || []).map((v) => v.src)]) if (p) blockedPrefixes.push(p);
    log(`skip ${slug} (gate '${data.gated}' is set)`);
    continue;
  }
  entries.push({ slug, data, body: m[2] });
}

const assetRefs = new Map(); // web path -> slug
for (const { slug, data, body } of entries) {
  const refs = [data.hero, ...(data.visuals || []).map((v) => v.src)];
  for (const match of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) refs.push(match[1]);
  for (const ref of refs) {
    if (!ref || !ref.startsWith('/assets/')) continue;
    assetRefs.set(ref, slug);
  }
}
for (const [ref, slug] of assetRefs) {
  if (blockedPrefixes.some((p) => ref === p || ref.startsWith(p))) fail(`${slug} references gated asset ${ref}`);
  const srcAbs = join(source, ref.slice(1));
  if (!existsSync(srcAbs)) fail(`${slug} references a missing asset: ${ref}`);
}

const assetMeta = {};
for (const [ref] of [...assetRefs].sort()) {
  const srcAbs = join(source, ref.slice(1));
  copy(srcAbs, posix.join('public', ref.slice(1)));
  const size = imageSize(srcAbs);
  assetMeta[ref] = { bytes: statSync(srcAbs).size, ...(size || {}) };
}

// ---- papers: a short public edition only ---------------------------------------
const papers = [];
const papersDir = join(source, 'assets', 'papers');
if (existsSync(papersDir)) {
  for (const name of readdirSync(papersDir).filter((f) => f.toLowerCase().endsWith('.pdf')).sort()) {
    const abs = join(papersDir, name);
    const info = pdfInfo(abs);
    if (!info) { log(`skip paper ${name} (page count unavailable)`); continue; }
    if (info.pages > PAPER_MAX_PAGES) { log(`skip paper ${name} (${info.pages} pages: not the short public edition)`); continue; }
    const rel = posix.join('public', 'papers', name);
    copy(abs, rel);
    papers.push({ href: `/papers/${name}`, file: name, pages: info.pages, bytes: statSync(abs).size, sha256: sha256(abs) });
  }
}

// ---- CV ----------------------------------------------------------------------------
const cvAbs = join(source, CV_SOURCE);
if (!existsSync(cvAbs)) fail(`missing ${CV_SOURCE}`);
copy(cvAbs, CV_TARGET);
const cvInfo = pdfInfo(cvAbs);
const cv = { href: '/cv/denys-shkola-cv.pdf', bytes: statSync(cvAbs).size, pages: cvInfo ? cvInfo.pages : null };

// ---- write work files ----------------------------------------------------------------
const paperHrefs = new Set(papers.map((p) => p.href));
for (const { slug, data, body } of entries) {
  const clean = strip(data);
  clean.slug = slug;
  clean.gated = false;
  clean.links = (clean.links || []).map((l) => {
    if (l.kind === 'paper' || (typeof l.href === 'string' && l.href.startsWith('/papers/'))) {
      const published = paperHrefs.has(l.href);
      return { ...l, kind: 'paper', public: published, href: published ? l.href : '' };
    }
    return l;
  });
  const fm = YAML.stringify(clean, { lineWidth: 0 }).trimEnd();
  write(posix.join('src', 'content', 'work', `${slug}.md`), `---\n${fm}\n---\n${body.startsWith('\n') ? body : `\n${body}`}`);
}

// ---- profile -----------------------------------------------------------------------
const rawProfile = JSON.parse(readFileSync(join(source, 'profile.json'), 'utf8'));
const profile = strip(rawProfile);
function dropGated(list) {
  return (list || []).filter((x) => !isOpenGate(x.gated)).map((x) => {
    const { gated, ...rest } = x;
    return rest;
  });
}
for (const key of ['experience', 'education', 'research', 'awards', 'competitions', 'credentials', 'skills']) {
  if (Array.isArray(profile[key])) profile[key] = dropGated(profile[key]);
}
// An award that was held behind a gate also appears as a plain competition entry;
// once the gate is cleared, the award replaces it.
const awardIds = new Set((profile.awards || []).map((a) => a.id));
profile.competitions = (profile.competitions || []).filter((c) => !awardIds.has(c.id));
// The MSc started in March 2026.
for (const e of profile.education || []) {
  if (e.id === 'msc-mathematics') {
    e.start = '2026-03';
    e.period = 'Mar 2026 – expected autumn 2027';
  }
}
// Paper links point to a published short edition, or nowhere.
const paper = papers[0] || null;
profile.links = { ...(profile.links || {}), paper_pdf: paper ? paper.href : null };
for (const r of profile.research || []) {
  if (r.id === 'alpha-search-crypto-perps') r.link = paper ? paper.href : null;
}
write('src/content/profile.json', `${JSON.stringify(profile, null, 2)}\n`);

// ---- manifests -----------------------------------------------------------------------
write('src/content/files.json', `${JSON.stringify({ assets: assetMeta, papers, cv }, null, 2)}\n`);
writeFileSync(manifestPath, `${JSON.stringify({ files: written.sort() }, null, 2)}\n`);

log(`work: ${entries.map((e) => e.slug).join(', ')}`);
log(`assets: ${assetRefs.size}; papers: ${papers.length ? papers.map((p) => `${p.file} (${p.pages} pp)`).join(', ') : 'none published'}; cv: ${cv.pages ?? '?'} page(s)`);
