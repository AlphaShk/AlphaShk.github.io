---
title: Order-book spoofing-pattern detector
slug: orderbook-spoofing
summary: "Detector for a pattern consistent with spoofing on a crypto perpetual: over 14 h, about 97% of 4,961 large placements were cancelled essentially unfilled."
period: Jun 2026
role: "Solo project, built for traders: specification, architecture, analysis direction and deployment"
status: Private code · collection deployed June 2026
tracks:
  - quant_dev
  - quant_research
order: 4
featured: true
gated: false
stack:
  - Python 3.11+ (asyncio)
  - websockets, aiohttp
  - Polars
  - PyArrow / Parquet (zstd)
  - pydantic, structlog
  - pytest, mypy, ruff, uv
  - Docker Compose
metrics:
  - value: 14 h
    label: "overnight capture: 275,052 book snapshots, 32,871 trades and 16,704 open-interest samples"
  - value: 4,961
    label: large top-of-book placements rebuilt; about 97% cancelled essentially unfilled
  - value: 0.39–0.41 s
    label: median lifetime of a large placement (bid side, ask side)
  - value: 69% vs 13%
    label: of open-interest change within ±60 s of a 15-minute grid, against an even spread
links: []
hero: /assets/orderbook-spoofing/architecture.svg
visuals:
  - src: /assets/orderbook-spoofing/architecture.svg
    alt: "Architecture diagram. Venue feeds (the L2 order book and the trade stream over WebSocket, and open interest polled over REST every 3 s) enter a collector with one asyncio loop, reconnects and a gap log, which appends to a Parquet store partitioned by hour. A deterministic analyzer and a real-time monitor both read the store: the analyzer writes reports and an hourly digest, and the monitor's quiet/active state machine raises started, escalated and ended alerts, tested by replaying recorded data. A side panel lists the checks: 35 passing tests with replays of injected patterns and synthetic Poisson order flow, and a separate comparison run of about 50 minutes on a large-cap market."
    caption: A collector, an append-only store and two readers. The analyzer re-runs over the whole store and gives the same report for the same data; the monitor watches recent data and raises real-time alerts, so far tested by replay.
  - src: /assets/orderbook-spoofing/lifetimes.svg
    alt: "Histogram of the lifetimes of 1,290 large bid-side placements in bins of about 0.6 s: 846 (66%) were gone within 0.7 s, 190 within 0.7 to 1.3 s and 71 within 1.3 to 1.9 s, then fewer than 40 per bin. 45 placements that lasted 6 to 18 s are not drawn."
    caption: "How long large bid-side placements lasted, in the analysis report's 0.6 s bins: 66% were gone within 0.7 s, and the median was 0.39 s. The 3,671 ask-side placements look similar (median 0.41 s)."
  - src: /assets/orderbook-spoofing/side-alternation.svg
    alt: "Mirrored column chart, one column per 15-minute bucket over the 14-hour capture, bid-side placements above the line and ask-side below. Activity comes in one-sided bursts that switch sides: mostly ask side from about hour 3 to hour 7 of the capture (up to 288 per bucket), then bid side around hour 8, ask side around hour 9 (up to 304), bid side around hour 10 (up to 236), ask side just before hour 11, bid side from about hour 11 to hour 12, ask side around hour 13 and a last bid-side burst near hour 14."
    caption: "Large placements per 15 minutes, bid side above the line and ask side below: one-sided bursts that switch sides through the night. Rebuilt from the bucket table in the analysis report."
ai_note: I wrote the specification, set the research questions and directed the analysis; Claude Code agents worked out the detailed design, wrote the code and ran the analysis passes.
---

## The problem

Traders watching a perpetual on a crypto derivatives venue kept seeing large orders flash at the best price for about a second while open interest seemed to jump. They wanted to know if this was real and what it looked like. Public depth carries no order IDs, so every placement and removal has to be inferred from quantity changes.

## What I built

In two days in June 2026:

- a venue-agnostic collector that writes the L2 book (top 10 levels of a 100 ms depth stream, arriving every 100–200 ms), trades and open interest to an append-only Parquet store;
- a deterministic analyzer that rebuilds large top-of-book placements, labels how each ended, and writes reports and an hourly digest for traders;
- a real-time monitor that raises started, escalated and ended alerts, tested by replay;
- a findings log with the method behind every number.

I packaged it as four Docker Compose services. Collection and the hourly digest ran overnight on a server, and 35 automated tests pass.

## How it works

![Architecture diagram](/assets/orderbook-spoofing/architecture.svg)

- **Reconstruction.** A placement is a large quantity jump at the best price. The analyzer follows that price until the added quantity is gone, then labels it cancelled, filled or partly filled from the trade tape. Events overlapping a feed gap are dropped, not guessed.
- **Calibration.** Thresholds come from the market's own baseline and enter the config by hand, so a running detector never changes silently.
- **Score and monitor.** An explainable score shows each component next to the total. The monitor re-scores recent data through a quiet/active state machine with confirmation and cooldowns; its typical latency budget is 15–25 s from pattern to alert.

## Results

**A 14-hour overnight capture of one market in June 2026, no significance tests:** 275,052 book snapshots, 32,871 trades, 16,704 open-interest samples.

- **The pattern.** 1,290 bid-side and 3,671 ask-side large placements: about 97% cancelled essentially unfilled, about 85% gone within 2 s, median lifetime 0.39 s (bid) and 0.41 s (ask). This is a pattern consistent with spoofing; the data cannot show who placed the orders.

![Lifetime histogram](/assets/orderbook-spoofing/lifetimes.svg)

- **Two sides, shared sizes.** 87.5% of active 15-minute buckets were dominated by one side, with 12 switches overnight. The same exact sizes recurred on both sides; one size alone came up in 1,355 short-lived ask-side placements and 95 bid-side ones.

![Bid against ask placements overnight](/assets/orderbook-spoofing/side-alternation.svg)

- **A data artifact, found and fixed.** The venue's open-interest timestamp refreshed only about every 15 minutes (57 distinct stamps for 1,465 value changes), which had made one score component meaningless; the series was re-keyed to receive time. Of all open-interest change, 69% fell within ±60 s of a 15-minute grid (13% for an even spread), with no matching trade burst: the "spikes" look like batched, delayed prints.
- **What open interest tracked.** Over 55 grid-aligned quarter hours, open-interest change tracked volume (correlation +0.89) and net aggressor flow (−0.82); clock-aligned intervals give +0.52 and −0.29. Open interest tended to grow when aggressive sellers hit the bids, and shortly after bid-side placements it mostly fell (715 falls, 181 rises, of 1,202).
- **A rejected hypothesis.** Were large asks paired with small bids? A small bid appeared within seconds of 20.0% of large asks, against 26.0% at baseline, so not confirmed.
- **Tests and a comparison run.** The tests recover injected patterns exactly and score synthetic Poisson flow low. In a separate 50-minute run on a large-cap market, fast cancellation was just as common but exact sizes almost never repeated, though its finer lot sizes make exact repeats rarer anyway. The composite score alone did not separate the two markets.

## What I learned

- **Check the clock before the signal.** A stale exchange timestamp silently broke one score component; the open-interest "spikes" appear to be batched prints.
- **Calibration needs judgment.** One automatically suggested threshold would have cut the reported one-second pattern out of its own statistics; it was overridden and the reason recorded.
- **Test the story you are given.** Neither paired orders nor an open-interest push showed up; instead, activity alternated between the sides hour by hour.

## Notes

Venue and market are anonymized; code and raw data stay private. Events are inferred from aggregated depth: orders shorter than one 100–200 ms snapshot are invisible, and participants at one price can merge.
