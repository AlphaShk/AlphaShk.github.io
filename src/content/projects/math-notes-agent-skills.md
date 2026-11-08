---
title: "Math-notes agent skills"
slug: math-notes-agent-skills
tagline: "LaTeX notes to a dependency map, behind validation gates"
summary: "Two Agent Skills for Claude that turn mathematical notes into study material: an offline dependency map of every numbered result in a LaTeX document, and one-to-one LaTeX transcription of handwritten lecture PDFs, with deterministic scripts and fail-closed gates around the model steps."
period: "Aug 2026"
role: "Solo: design, skills, scripts and tests"
status: "Public repo · MIT · live demo"
code: public
tracks: [ai]
order: 22
featured: false
page: project
stack: ["JavaScript (Node)", "Python", "MathJax", "LaTeX", "Agent Skills"]
card:
  result: "A fail-closed gate between LLM extraction and the build refuses missing items, dangling edges, cycles and broken LaTeX; the live demo maps all 18 results of my BSc thesis."
  facts:
    - key: "Evaluation"
      value: "69 automated tests (46 pytest + 23 node:test) and a no-LLM fixture pipeline in CI"
metrics:
  - value: "18"
    label: "numbered results in the demo map, with 27 dependency edges that each carry a written reason"
    kind: count
  - value: "14"
    label: "refusal cases tested for the validation gate"
    kind: evidence
  - value: "69"
    label: "automated tests (46 pytest + 23 node:test)"
    kind: count
links:
  - label: "Live demo: a mind map of my BSc thesis"
    href: "https://alphashk.github.io/math-notes-agent-skills/"
    kind: demo
  - label: "Repository"
    href: "https://github.com/AlphaShk/math-notes-agent-skills"
    kind: repo
ai_note: "Designed, specified and verified by me; implemented with Claude Code."
---

## The problem

A language model that has read a section can write a precise statement, the key steps of a proof and why one result needs another. It is unreliable at the mechanical parts: matching the numbering of the PDF, covering every item, producing LaTeX that renders, and admitting when a proof is not in the source. Those failures don't crash anything; they produce a document that looks finished and is wrong.

## What I built

- **`latex-mindmap`** turns LaTeX notes, a textbook or a thesis into one offline HTML file: every numbered definition, theorem, lemma and example as a node in a dependency map, each edge with a written reason, plus statements, proof outlines and a searchable cheat sheet.
- **`handwritten-notes-to-latex`** transcribes handwritten lecture PDFs into a LaTeX document that matches them one to one: same numbering, titles, statements and proofs, in a fixed house style.

Each skill gives the mechanical work to deterministic scripts and puts fail-closed gates between the model's steps.

## How it works

- **Validation gate.** Between LLM extraction and the build, a merge step refuses missing or extra items, duplicate ids, dangling edges, dependency cycles, unbalanced `$`, braces or `\left`–`\right`, a bare `<` and LaTeX in labels.
- **Render gate.** MathJax's `noerrors` and `noundefined` packages are removed, so an undefined macro aborts the build and names the macro instead of shipping red text.
- **Provenance.** Reconstructed proofs and outlines are labelled “reconstructed (not in the notes)”.
- **Handwriting audits.** Page tiling for a vision model, verbatim lecturer numbering, and audits for duplicates, backwards numbering, gaps and coverage.

## Results

The live demo maps my BSc thesis: 18 numbered results and 27 dependency edges in one 0.39 MB offline HTML file. CI rebuilds it byte for byte from the committed sources, and a headless audit passes 17 of 17 checks.
