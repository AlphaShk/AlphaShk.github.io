---
title: Prediction-market matching and arbitrage
slug: prediction-markets
summary: An LLM contract-matching pipeline over ≈ 255k Kalshi and Polymarket markets, feeding a fee-aware arbitrage scanner. Built solo, with 529 automated tests.
period: Mar – Jun 2026, revived Oct 2026
role: Solo rebuild of a WUTIS student-team project
status: Private code · research system on public venue data
tracks:
  - ai
  - quant_dev
order: 3
featured: true
gated: false
stack:
  - Python 3.12
  - Polars
  - scikit-learn (TF-IDF)
  - sentence-transformers (MiniLM)
  - "LLM APIs: OpenAI, Anthropic, Gemini"
  - Apache Kafka
  - PostgreSQL 16
  - FastAPI + WebSockets
  - React + TypeScript
  - Docker Compose
metrics:
  - value: ≈ 255k
    label: "markets: 124,521 on Kalshi + 130,770 on Polymarket (Oct 2026)"
  - value: ≈ 340k
    label: estimated pairs left for LLM checks, of 355,143 candidates
  - value: $49–64
    label: modeled cost of a full LLM pass (small model, batch + caching)
  - value: "529"
    label: automated tests, all passing (Nov 2026)
links: []
hero: /assets/prediction-markets/architecture.svg
visuals:
  - src: /assets/prediction-markets/architecture.svg
    alt: Architecture diagram. Kalshi and Polymarket public REST APIs feed market crawlers (two fetchers and a normalizer) with every open market, and scanner replicas with order books. The crawlers publish to Apache Kafka, which has 8 topics. The matching funnel (retrieval, prefilters and a two-stage LLM check) reads normalised markets from Kafka, writes matched pairs to PostgreSQL 16 and publishes pair updates to Kafka. A scan scheduler reads the active pairs from PostgreSQL and scanner status and settings from Kafka, and publishes scan tasks keyed by match ID. Scanner replicas take the tasks, walk both order books, apply fees and publish arbitrage events, which a history writer stores in PostgreSQL. FastAPI serves REST and a WebSocket feed to a React dashboard.
    caption: System architecture. Eleven Docker Compose services; the workers exchange messages over eight Kafka topics, and the scanner replicas scale out as one consumer group. All venue access is public reads. Schematic.
  - src: /assets/prediction-markets/funnel.svg
    alt: Funnel diagram with five stages. About 16.3 billion possible pairs, computed as 124,521 Kalshi times 130,770 Polymarket markets. Retrieval, lexical only in this run, leaves 355,143 candidates (measured). Two prefilters remove 10,272 pairs, leaving 344,871 (measured). The last prefilter, measured on a 2,000-pair sample with 98.7% kept, gives an estimated 340,215 pairs bound for the LLM (95% interval 338,122 to 341,666). The last stage, a two-stage LLM check, is priced by a cost model.
    caption: Matching funnel from one offline run on 19 October 2026. Retrieval does almost all of the narrowing; prefilters remove only a few percent. Dense retrieval was off in this run, so the candidates are lexical only. Schematic, not to scale.
  - src: /assets/prediction-markets/llm-cost.svg
    alt: "Range bars of the modeled cost of one cold-start verification pass, standard pricing against Batch API with prompt caching, with tick marks at both ends of each range. Small model only (Claude Haiku 5.5): $120–156 and $49–64. Haiku triage plus Sonnet on 10% of pairs: $302–393 and $130–169. Haiku triage plus Sonnet on 30% of pairs: $781–1,015 and $328–426. Larger model only (Claude Sonnet 5.5): $2,393–3,110 and $987–1,283."
    caption: "Modeled cost of verifying every LLM-bound pair once, for four of the cost tool's set-ups, from its output of 19 October 2026. Each range runs from the base token estimate to 1.3 times it. A model, not a bill: later runs pay only for new or changed pairs."
  - src: /assets/prediction-markets/fee-curve.svg
    alt: "Line chart of the fees for taking both legs of a $1 pair against the price of the Kalshi leg. All curves peak at 50 cents: 3.5¢ at a Polymarket fee rate of 0.07, 3.0¢ at 0.05, 2.5¢ at 0.03, and 1.75¢ for the Kalshi leg alone."
    caption: "Fees for taking both legs of a $1 pair under the fee model the scanner implements: Kalshi 0.07 × C × P × (1 − P) at a series multiplier of 1, Polymarket rate × C × p(1 − p) at rates of 0.03–0.07. The Kalshi-only curve is the case of a fee-free Polymarket market. My arithmetic: it assumes the Polymarket leg is priced near the complement of the Kalshi leg and ignores Kalshi's rounding up to the cent per order, and slippage."
ai_note: I built it solo and directed the design and the evaluation; AI coding agents (Claude Code) wrote much of the code.
---

## The problem

Kalshi and Polymarket often list the same question (an election, a game, a price on a date) as separate contracts. If YES on one venue plus NO on the other costs less than the $1 the pair pays, after fees, the gap is a candidate arbitrage, real only if the contracts truly match and both legs fill at the quoted prices. Titles that read alike can differ in strike, date or settlement source, and a false match turns a hedge into an open position. The two venues' 124,521 and 130,770 markets make about 16.3 billion possible pairs.

## What I built

It started as a WUTIS student-team project in winter semester 2025/26. From April 2026 I rebuilt it alone as a new codebase: an event-driven Python system that crawls every open market on both venues, matches equivalent contracts with a retrieval and LLM funnel, and scans their order books for two-leg arbitrage after fees. In October I added an evaluation set and a cost model. It reads only public venue data.

## How it works

![System architecture](/assets/prediction-markets/architecture.svg)

Crawlers page through both venues' public APIs into Kafka, and a normalizer maps their markets into one binary-contract model.

The matcher runs a recall-first funnel. Lexical (TF-IDF) retrieval can be fused with dense (MiniLM) retrieval by reciprocal-rank fusion, and prefilters drop clear mismatches. A two-stage LLM check follows: by default a strict check runs first and a second model reviews confident approvals; an opt-in cascade runs a cheap triage first. Per-run caps on calls and dollars bound escalation; pairs over budget wait for the next run. Verdicts are cached under a key that includes the prompt's hash, and dropped candidates are logged so recall can be audited.

A scheduler turns matched pairs into scan tasks keyed by match ID, shared by scanner replicas in one consumer group. Each scanner fetches both order books, walks their depth for both constructions (Kalshi YES + Polymarket NO, and the reverse), applies each venue's fees and skips stale books. Kalshi charges 0.07 × C × P × (1 − P) to take C contracts at price P, times a per-series multiplier refreshed daily; Polymarket fees follow each market's own schedule.

## Results

The figures below are measured offline or modeled, and labeled as such.

**Funnel (measured, one offline run, 19 October 2026).** Retrieval gave 355,143 candidate pairs and two prefilters left 344,871, in 141 s. A 2,000-pair sample of the last prefilter kept 98.7%, which puts an estimated 340,215 pairs in front of the LLM. Dense retrieval was off.

![Matching funnel](/assets/prediction-markets/funnel.svg)

**Cost (modeled, not billed).** One cold-start pass over those pairs prices at $120–156 with a small model (Claude Haiku 5.5), or $49–64 with batching and prompt caching, against $2.4–3.1k with a larger model (Claude Sonnet 5.5) alone.

![Modeled LLM cost](/assets/prediction-markets/llm-cost.svg)

**Evaluation harness (built).** A 400-pair set from a May 2026 snapshot covers seven strata, from strike ladders to a random control, labeled from settlement: 100 hard negatives, 248 weak positives, 52 unlabeled. The harness reports false-approval rates with Wilson bounds.

**Fees and settlement (analysis).** Near 50¢, taking both legs costs 2.5–3.5¢ in fees per $1 pair at Polymarket rates of 0.03–0.07. Settlement divergence is the main tail risk: three verified cases show the venues settling what looked like the same event differently.

![Fees by price](/assets/prediction-markets/fee-curve.svg)

## What I learned

- **Retrieval narrows; the LLM sets the bill.** Prefilters removed only a few percent, so cost control comes from model choice, batching and caching, not from filters that would cost recall.
- **Price the pipeline before running it.** Across the four set-ups in the cost chart, one full pass is modeled at $49 to $3,110.
- **Settlement gives negative labels for free.** Opposite outcomes prove a false match; matching outcomes can be coincidence.
- **Fees and settlement rules decide** whether a gap survives costs and whether a hedge is a hedge.

## Notes

- Research only; not investment advice. The code is private; prompts, prefilter rules and parameters are withheld, and no venue data is redistributed.
- Thanks to the WUTIS team behind the original project.
