---
title: "Puppet Cube edge solver"
short_title: "Puppet Cube solver"
slug: puppet-cube-solver
tagline: "edge solver with BFS and meet-in-the-middle search"
summary: "Picks a verified Puppet Cube phase-3 algorithm for a requested edge swap, 3-cycle or flip, and builds one from the guide's macros with breadth-first and meet-in-the-middle search when no published case fits. Pure standard-library Python with a Tk window and a CLI."
period: "Aug 2026"
role: "Solo: cube model, search and app"
status: "Public repo · MIT"
code: public
tracks: [quant_dev]
order: 26
featured: false
page: project
stack: ["Python (standard library)", "Tkinter", "unittest", "ruff and mypy --strict"]
card:
  result: "On the 9 movable edges, every two-edge flip, single swap and unprotected 3-cycle is answered; the slowest request takes about 0.5 s."
  facts:
    - key: "Method"
      value: "Move tables derived from geometry; BFS up to 4 macros and a bidirectional search to 8"
metrics:
  - value: "34"
    label: "verified catalogue entries from 36 published algorithms, re-simulated before display"
    kind: count
  - value: "≈ 0.5 s"
    label: "slowest request, an 8-macro flip, on an Apple M5"
    kind: operations
  - value: "89"
    label: "unittest tests, with CI on Python 3.11–3.13"
    kind: count
links:
  - label: "Repository"
    href: "https://github.com/AlphaShk/puppet-cube-solver"
    kind: repo
ai_note: "The original app was built with OpenAI's Codex agent; this packaging and hardening pass (worker thread, CLI, tests, CI and documentation) was done with Claude Code."
---

## The problem

The Puppet Cube is a 3×3×3 shape mod in which several pieces are fused into larger blocks, so a face turn can drag hidden layers of the mechanism, and an algorithm only works from the grip it was designed for. A guide fixes the edges with 36 published phase-3 algorithms, but using them means knowing which one produces the effect in front of you, how to hold the cube, and what to do when none fits.

## What I built

- **An edge-only cube model.** Face turns are −90° Rodrigues rotations of integer face vectors, so no move table is typed by hand, and wide turns and regrips come from the same code.
- **A verified catalogue.** The 36 published algorithms are simulated in the guide's exact grips, with the Puppet blocks modelled as hidden wide turns, and de-duplicated into 34 verified entries.
- **A fallback search** over the 14 distinct macro effects: BFS up to 4 macros, and for exact flips a bidirectional meet-in-the-middle search that reaches 8 macros without the 3.8 million states a one-way search needs by 6.
- **Group-theory checks.** All macros are even permutations, so an odd number of swaps without two free edges is rejected up front.

## Results

Every two-edge flip, single swap and unprotected 3-cycle on the 9 movable edges is answered; the slowest request, an 8-macro flip, takes about 0.5 s on an Apple M5. Verification is against the simulation model.
