---
title: "ECTS Ledger: semester planner for the MSc Mathematics"
short_title: "ECTS Ledger"
slug: ects-ledger
tagline: "semester planner fed by u:find data"
summary: "An unofficial semester planner for the University of Vienna MSc Mathematics: a static page with no build step, fed by a Python client for the XML backend behind u:find, with module caps, date-level clash detection and an exam backlog."
period: "2026"
role: "Solo: planner, u:find client, tests and deployment"
status: "Public repo · MIT · live site"
code: public
tracks: [ai]
order: 24
featured: false
page: project
stack: ["Vanilla JavaScript", "Python", "Beautiful Soup", "GitHub Actions and Pages", "pytest and node:test"]
card:
  result: "Clash detection works on real meeting dates, so interleaved fortnightly slots are not flagged; the catalogue rebuilds itself weekly from u:find."
  facts:
    - key: "Evaluation"
      value: "71 automated tests (45 pytest + 26 node:test) on saved u:find responses, in CI"
metrics:
  - value: "137"
    label: "course documents fetched by a full catalogue rebuild, in 3.1–5.3 s (seven local runs; network-bound)"
    kind: operations
  - value: "71"
    label: "automated tests: 45 pytest and 26 node:test"
    kind: count
  - value: "90%"
    label: "of course documents must arrive, or the generator refuses to write a catalogue"
    kind: evidence
links:
  - label: "Live planner"
    href: "https://alphashk.github.io/ects-ledger/"
    kind: demo
  - label: "Repository"
    href: "https://github.com/AlphaShk/ects-ledger"
    kind: repo
ai_note: "This curated copy (refactor, tests, CI, documentation and screenshots) was produced with Claude Code under my direction."
---

## The problem

The MSc Mathematics curriculum asks for 120 ECTS: 90 ECTS of coursework spread over four capped modules (ML1 30, ML2 30, MSE 8, MEL 22), the Master's thesis (27) and the Defensio (3). u:find lists each semester's courses, but it does not tell you how a selection fills those modules, whether two courses really clash when many slots run only every other week, or which exams are still open.

## What I built

- **Planner.** A static page with no framework that allocates ECTS into the module caps. Graded courses claim caps first, and overrides are limited to the course's own module or MEL. Your plan stays in your browser.
- **u:find client.** A Python client for the undocumented XML backend behind u:find, using the endpoints found in the web app's own scripts. No catalogue ECTS value, timetable slot or exam date is typed in by hand.
- **Clash detection.** Each slot stores its cadence and its real meeting dates, so fortnightly slots that interleave are not flagged.
- **Self-updating deployment.** GitHub Actions rebuilds and validates the catalogue weekly and redeploys GitHub Pages.

## Results

The catalogue of 8 Nov 2026 has 52 courses for 2026S and 57 for 2026W, and a fresh rebuild reproduced it exactly. The planner is unofficial and not affiliated with the University of Vienna.
