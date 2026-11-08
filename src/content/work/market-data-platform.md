---
title: Multi-exchange crypto market-data platform
slug: market-data-platform
summary: "Production crypto market-data platform, co-developed in a team of two: I implemented 19 of its 33 Rust exchange integrations and the shared normalization layer."
period: Feb 2026 – Sep 2026
role: Co-developer, two-person team
status: Private code · side project
tracks:
  - quant_dev
  - quant_research
order: 2
featured: true
gated: false
stack:
  - Rust (exchange collectors)
  - NATS (message bus)
  - Go (gateway, engine)
  - ClickHouse
  - PostgreSQL
  - Redis
  - Node.js (control-plane API)
  - React / TypeScript
metrics:
  - value: 19 of 33
    label: Rust exchange integrations I implemented
  - value: 101 of 131
    label: my pull requests merged
  - value: 2,634
    label: real-time Bybit deltas checked for continuity, with zero gaps
  - value: ~5,000/s
    label: normalized events in production (the platform measured)
links: []
hero: /assets/market-data-platform/architecture.svg
visuals:
  - src: /assets/market-data-platform/architecture.svg
    alt: "Data-flow diagram. Crypto exchanges, with order books from 31 venues, feed Rust collectors that hold 33 exchange integrations; 19 of them and the shared normalization layer are marked as mine. The collectors publish normalized events on a NATS message bus. Go services, a gateway and an engine, consume the events and read and write three stores: ClickHouse (analytical), PostgreSQL (relational) and Redis (in-memory). A Node API, which is also the platform's control plane, sits between the Go services and the React/TypeScript web clients."
    caption: "High-level data flow, simplified: from the exchanges through the Rust collectors and NATS to the Go services, then through the Node API to the web clients. Blue text marks my part of the collector layer."
ai_note: I owned my features end to end, from design to merged pull request; AI coding agents (Claude Code, Codex) helped write the code, under pull-request review and CI gates.
---

## The problem

Crypto liquidity is spread across dozens of exchanges. Each one publishes its market data in its own message format, with its own symbol conventions and its own rules for sequencing order-book updates. A local copy of an order book that misses an update, or applies one out of order, drifts away from the exchange without raising an error, and the trader sees liquidity that is not there.

The platform's job is to collect order books, trades and open interest from around 30 venues, bring them into one format and serve them to web clients in real time, with alerts on top.

## What I built

I co-developed this production market-data and signal platform with its owner as a side project in my free time. We were a team of two, and my active period ran from February to September 2026. My part:

- **Exchange integrations.** I implemented 19 of the platform's 33 Rust exchange integrations, covering order books, trades and open interest.
- **Normalization.** I implemented the shared instrument and trade normalization framework, so every venue reaches the rest of the system in one format.
- **Data integrity.** I ordered each market's order-book updates by (epoch, sequence, timestamp), which removed phantom liquidity from the trader UI. I added delta-continuity checks and verified them on the real feeds of three venues, and I made real-time alert delivery durable.
- **Across the stack.** I shipped features end to end, from a Rust collector through the Go engine and the Node API to the React UI.

## How it works

![High-level data flow of the platform](/assets/market-data-platform/architecture.svg)

1. **Collect.** Each Rust integration connects to one exchange and turns its feed into normalized events.
2. **Distribute.** The collectors publish those events on NATS, the message bus.
3. **Serve.** Go services, a gateway and an engine, consume the events; a Node API, which is also the platform's control plane, sits between them and the React/TypeScript web clients.
4. **Store.** The Go services work with three stores: ClickHouse (analytical), PostgreSQL (relational) and Redis (in-memory).

## Results

**My contribution**, from the repository history:

- 19 of 33 exchange integrations, plus the shared normalization framework.
- 131 pull requests opened and 101 merged; 489 of the 2,428 commits in the repository history (all branches, counted in November 2026).
- A continuity check on the real Bybit feed covered 2,634 deltas with zero gaps.

**Platform measurements.** My co-developer took these on 20–21 July 2026, before my batch of 19 exchange integrations landed, so they describe the platform as a whole.

| When | What the platform measured |
|---|---|
| In a 30-second production window | 5,054 normalized events/s; 716 L2 snapshots/s; 1 ms consumer lag |
| In a one-minute load test | 25/25 WebSocket clients received 506,700 messages and 13,058 HTTP requests were served, with 0 errors |
| In a one-hour soak test | 18,625,842 events (about 5.2k/s); zero restarts |

## What I learned

- **Sequencing is part of the data model.** The phantom liquidity came from the order in which updates were applied, so the fix belonged in how each market's updates are sequenced, not in the UI.
- **Check continuity on production traffic.** Tests show that a parser works; a gap check on real deltas shows whether updates were missed.
- **Normalize once, early.** With 33 integrations, the shared instrument and trade model matters more than any single venue, because everything after the collectors depends on it.

## Notes

The code is private and the platform is privately owned, so this page shows no code, parameters or feature details. I am happy to walk through the architecture and my integrations in an interview.
