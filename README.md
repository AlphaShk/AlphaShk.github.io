# alphashk.github.io

Source of my portfolio site, [alphashk.github.io](https://alphashk.github.io): case studies, project pages, research and CV.

- **Stack:** [Astro](https://astro.build) 7, static output, hand-written CSS with design tokens, self-hosted fonts (Newsreader, Inter, JetBrains Mono via Fontsource).
- **Client JavaScript:** only the theme toggle and the optional `?track=` preset of the work filter (the filter itself is CSS). No analytics, trackers or third-party requests.
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) builds with `withastro/action` and publishes with `actions/deploy-pages`. Pages source: *GitHub Actions*.

## Build

```sh
npm ci
npm run build     # runs `npm run sync` first, then `astro build` into dist/
npm run preview
```

## Content

Page text and figures live in `src/content/` and `public/`:

- `src/content/work/*.md` and `src/content/profile.json` are copied from my private content folder by `scripts/sync-content.mjs`, which strips provenance fields, skips unpublished entries and copies only the assets that published pages reference.
- `src/content/projects/*.md` are the pages for my public repositories.

When the private folder is not present (as on the CI runner), the sync step keeps the committed copies.

## License

The code (layouts, components, styles and scripts) is MIT licensed; see [LICENSE](LICENSE). The text, figures, CV and other documents are © Denys Shkola, all rights reserved.
