---
title: "Twisty Lab: OLL workbench with an algorithm verifier"
short_title: "Twisty Lab"
slug: twisty-lab
tagline: "OLL workbench with an algorithm verifier"
summary: "A study workbench for the 57 OLL cases of the Rubik's Cube, with an animated 2D/3D cube and a simulator that checks every algorithm you type before you rely on it. React, TypeScript, cubing.js and Electron."
period: ""
role: "Solo: app, verifier and tests"
status: "Public repo · MIT · live demo"
code: public
tracks: [ai]
order: 25
featured: false
page: project
stack: ["TypeScript", "React", "cubing.js", "Vite", "Vitest", "Electron"]
card:
  result: "Every built-in algorithm passes a verifier that runs it on a cube model; the 57 case diagrams are generated from the algorithms, not drawn."
  facts:
    - key: "Evaluation"
      value: "303 Vitest tests; all 57 curated algorithms and all 98 JPerm listings pass the verifier"
metrics:
  - value: "57"
    label: "OLL cases in 15 recognition-shape groups, with 121 built-in algorithms"
    kind: count
  - value: "303"
    label: "Vitest tests, including the rejection paths"
    kind: count
  - value: "24"
    label: "whole-cube orientations the verifier normalizes across"
    kind: evidence
links:
  - label: "Live demo"
    href: "https://alphashk.github.io/twisty-lab/"
    kind: demo
  - label: "Repository"
    href: "https://github.com/AlphaShk/twisty-lab"
    kind: repo
ai_note: "Built under my direction: the original app with OpenAI's Codex agent, and the hardening passes (verifier coverage, tests, CI and documentation) with Claude Code."
---

## The problem

OLL is the third step of the CFOP speedsolving method: with the first two layers solved, one algorithm turns every top sticker to the top color. There are 57 cases. Cubers keep swapping in alternatives they find online, and a missing prime or cube rotation goes unnoticed until it wrecks a solve.

## What I built

- **Library and workbench.** A filterable case library, an animated 3D or top-view 2D cube for every algorithm, move phrases you can replay on their own, and per-case notes and learning status.
- **Verifier.** It rebuilds the case from the inverse of the reference algorithm on a cubing.js KPuzzle model, normalizes across the 24 whole-cube orientations, and accepts when the last layer is oriented and F2L is intact. A custom algorithm must pass before it can become the preferred one.
- **Generated diagrams.** A test proves the reference set covers all of OLL: 57 distinct orientation classes under U turns, and 216 last-layer states in 58 classes by Burnside's lemma, one of them solved.
- **One build, two targets.** GitHub Pages and an Electron shell with context isolation and sandboxing on.

## Results

303 Vitest tests pass, covering the rejection paths too: broken F2L, wrong case, syntax errors, unknown moves and empty input. The layout works from 375 to 1440 px wide.
