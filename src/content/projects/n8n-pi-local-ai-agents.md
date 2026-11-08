---
title: "Local-model n8n agents on a Raspberry Pi 5"
short_title: "n8n agents on a Pi"
slug: n8n-pi-local-ai-agents
tagline: "local-model agents on a Raspberry Pi 5"
summary: "Six self-hosted n8n workflows on a Raspberry Pi 5 that use only local models (Ollama with qwen3:8b), Qdrant memory and a private SearXNG: a market-news digest, a daily AI-engineering lesson in Notion, a retrieval chat agent and a weekly recap."
period: "Aug 2026"
role: "Solo: workflows, infrastructure, tests and operations"
status: "Public repo · MIT"
code: public
tracks: [ai]
order: 23
featured: false
page: project
stack: ["n8n", "Ollama (qwen3:8b, nomic-embed-text)", "Qdrant", "SearXNG", "Docker Compose", "Python tests"]
card:
  result: "Agent output is grounded and fail-closed: the scout may pick only numbered candidates, and nothing reaches Notion unless validation passes."
  facts:
    - key: "Scope"
      value: "2 production pipelines and 4 support workflows on one Raspberry Pi 5; no cloud LLM API keys"
metrics:
  - value: "6"
    label: "n8n workflows: 2 production pipelines plus 4 support workflows"
    kind: count
  - value: "≈ 2.0 tok/s"
    label: "qwen3:8b generation on the Pi 5 (about 7.7 tok/s ingest)"
    kind: operations
  - value: "3 min 43 s"
    label: "one full on-device validation run (Aug 2026, a single development run)"
    kind: operations
links:
  - label: "Repository"
    href: "https://github.com/AlphaShk/n8n-pi-local-ai-agents"
    kind: repo
ai_note: "The original Pi scripts were written with Codex under my direction; the curation for this repository (tests, import tooling, documentation) was done with Claude Code."
---

## The problem

I wanted useful daily agents that run on a small home server with local models only: no cloud LLM keys, no data leaving the machine, and output that can be trusted without reading every run.

## What I built

| Workflow | Trigger | Output |
|---|---|---|
| Market News Digest | 07:00 and 18:00 | e-mail with cited bullets and a watchlist |
| AI Engineering Learning Feed | 05:30 | up to 3 concept pages and a daily briefing in Notion |
| Ask the Library | n8n chat | answers from my concept library first, the web only when it has no answer |
| AI Weekly Recap | Sunday 18:00 | the week's concepts by category, with no model calls |

Two support workflows send failure alerts and serve the Notion backlog to the chat agent.

## How it works

- **Grounded selection.** The scout may pick only numbered candidates, never URLs. A parser validates the picks against the fetched items and recovers complete arrays from truncated JSON. Tests run the exact Code-node JavaScript.
- **Prompt budget.** On the Pi 5, qwen3:8b ingests about 7.7 tok/s and generates about 2.0 tok/s. A prompt-budget failure, where 55 candidates made a 3,641-token prompt and 320 output tokens truncated the JSON, was fixed with a 28-candidate cap and compact, source-indexed JSON.
- **Semantic dedupe.** Qdrant similarity scores were measured (identical 1.0, reworded 0.816, unrelated 0.454) to set the threshold, scoped per workflow and to a 7-day window.
- **Operations.** Images pinned by tag and digest, a nightly systemd backup with 30-day retention, no-write validation clones and an import tool that wires credentials and cross-workflow references.

## Results

A full validation run took 3 min 43 s on the device in August 2026, a single development run. Live-data testing shaped the design: the model now only adds to the lexicon's list of stories, so a small model can never remove a genuine one.
