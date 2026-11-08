---
title: "Pulse: crypto-perps research platform and paper"
slug: pulse
summary: "A daily, market-neutral long/short book on liquid crypto perpetuals, built on an always-on Rust, Redis and Python platform on a Raspberry Pi 5: Sharpe 3.45 on a 2026 holdout (backtest) and +$1,124 on a simulated $500."
period: Jul 2026 – present
role: "Solo project (no other people), built with AI agents: design, research direction and write-up"
status: Private code · short working paper (not peer-reviewed)
tracks:
  - quant_research
  - quant_dev
  - ai
order: 1
featured: true
gated: false
page: case
code: private
stack_summary: Rust · Redis Streams · Python, on one Raspberry Pi 5
method: Counted search (1,871 trials), CPCV with an embargo, HAC t-statistics, deflated Sharpe, placebo and leak controls, one look at a 2026 holdout
outcome: Sharpe 3.45 on the 2026 holdout (backtest, after costs); +$1,124 on a fixed $500 over Jan 2023–Sep 2026 (simulation, after fees, slippage and funding)
card:
  result: A daily market-neutral book scored Sharpe 3.45 on a one-look 2026 holdout (backtest) and made +$1,124 on a simulated fixed $500 over 45 months, after fees, slippage and funding.
  facts:
    - key: Result
      value: Holdout Sharpe 3.45, +23.0 bp/day net, worst drawdown 7.9% (backtest); +$1,124 on Bybit and +$1,144 on Binance data over 45 months (simulation)
    - key: Search
      value: 1,871 trials counted by 21 Oct 2026, about 1,700 of them estimated; every new test logged before it ran from 12 Oct
    - key: Platform
      value: Rust, Redis Streams and Python on one Raspberry Pi 5; paper book tracked daily since 26 Oct 2026; execution layer verified on Bybit Demo
stack:
  - Rust (tokio, tokio-tungstenite)
  - Redis Streams (msgpack)
  - Python (uv workspace)
  - Polars, pandas, NumPy, SciPy
  - Parquet, SQLite
  - FastAPI
  - ONNX Runtime (FinBERT, CryptoBERT)
  - LightGBM, scikit-learn, PyTorch
  - systemd on Raspberry Pi 5
  - LaTeX
metrics:
  - value: "3.45"
    label: Sharpe ratio on the one-look 2026 holdout (backtest, after costs)
    kind: finding
  - value: +$1,124
    label: simulated profit on a fixed $500, Jan 2023–Sep 2026, after fees and funding (Bybit)
    kind: evidence
  - value: 1,871
    label: trials counted by 21 Oct 2026, about 1,700 of them estimated, and every result deflated for that count
    kind: count
  - value: 1.19–1.21
    label: simulated risk-adjusted score counting only half the historical profit, vs 0.66 for seven plain alternatives such as gold and Bitcoin
    kind: evidence
links:
  - label: Short paper (PDF)
    href: /papers/alpha-search-crypto-perps-2026-short.pdf
    kind: paper
    meta: 10 pp · PDF · 0.59 MB · working paper, not peer-reviewed
    public: true
hero: /assets/pulse/architecture.svg
visuals:
  - src: /assets/pulse/architecture.svg
    alt: "Architecture diagram. Bybit and Binance feeds, over WebSockets plus REST polling, enter two Rust ingest daemons, which publish to a Redis Streams bus. A news service and a sentiment service that scores headlines with local FinBERT and CryptoBERT models also use the bus. Python services consume it: storage writes Parquet and L2 order-book snapshots, a notifier sends a daily Telegram digest and failure pages, and a password-protected strategy console serves the results. A forward paper runner feeds the digest and the console. Everything runs on one Raspberry Pi 5."
    caption: Pulse on one Raspberry Pi 5. The research itself ran offline on public exchange data; the Pi captures market data, books the paper portfolios and serves the console. Schematic.
ai_note: Designed and directed by me; code, analyses and paper drafts produced with Claude Code agents; adversarial verifier agents rebuilt key results from raw data.
---

## The problem

Crypto-perps backtests mislead easily: try enough variants and one passes by luck, then fees and funding take the rest. I wanted cheap, always-on infrastructure and research whose results would hold up to that standard.

## What I built

Pulse started in July 2026 as a news-sentiment and indicator signal engine on a Raspberry Pi 5 and grew into:

- a market-data and paper-trading platform that runs unattended on the Pi, with more than 500 automated tests;
- a daily, market-neutral long/short book on liquid crypto perpetuals, researched offline on public Bybit and Binance data;
- a live execution layer, verified end to end on Bybit Demo, where the system placed the orders and the resting stops itself;
- a research program, written up as a working paper (21 October 2026) and a short public edition.

## Results

- **Holdout (backtest).** On the 2026 holdout, opened once, the book returned +23.0 basis points of capital a day net of costs and funding, with HAC t 2.61, Sharpe ratio 3.45 and a worst drawdown of 7.9%. On the 2023–2025 development years its Sharpe ratio was 2.44.
- **Simulation on $500.** On a fixed $500 from January 2023 to September 2026 (45 months), a simulation with each venue's own prices, fees, slippage and funding made +$1,124 on Bybit and +$1,144 on Binance data, at about 12 orders a day.
- **Against plain alternatives.** Counting only half of the historical profit, to be cautious, its risk-adjusted score is 1.19–1.21, against an average of 0.66 for seven plain alternatives such as gold and Bitcoin.
- **Forward paper trading.** A daily paper book has been tracked on the Pi since 26 October 2026. Weeks of paper returns are not a track record, so none are shown, and no real money is traded.

The backtest and simulation describe the past, and the strategy was chosen on 2023–2025 history, so they are not a forecast.

## How it works

![Architecture](/assets/pulse/architecture.svg)

Two Rust daemons stream Bybit and Binance over sharded WebSockets, with REST polling for Binance bars, funding and open interest, into Redis Streams. Python services store Parquet bars and L2 snapshots, score headlines with FinBERT and CryptoBERT in INT8 ONNX, send a daily digest and serve a password-protected console that refuses trade- or withdraw-capable keys. Two batch jobs that once hit about 14 GB of memory were rewritten to stream and now peak under 0.4 GB.

A separate live execution layer turns the daily targets into exchange orders with resting stops. It was verified end to end on Bybit Demo; real money is off.

## Rigour

Most of the work went into making the result trustworthy rather than merely large:

- **Counting.** 1,871 trials counted by 21 October: 154 registered, 17 charged from diagnostics and about 1,700 estimated for the earlier, unlogged search. Results are deflated for that count.
- **Logging.** From 12 October, each test's cells, costs and pass bars were hashed into an append-only, hash-chained ledger before it ran.
- **Validation.** CPCV with purging and an embargo, HAC t-statistics, the deflated Sharpe ratio, placebo and leak controls, and one look at a 2026 holdout.
- **Selection.** The cost-aware tests rejected most candidate strategy families, and one survived; that selectivity is the point of the process.

## What I learned

- **Measure before tuning.** My first harnesses called t-statistics Sharpe ratios; fixing the measurement was the base for everything after.
- **Count every try.** After 1,871 trials, luck alone is expected to reach a best t of about 3.4, so every result is read against the full count.
- **Agents need guardrails.** Specs, the ledger and adversarial verifier agents kept agent-run research checkable.

## Notes

The short paper lists its corrections. Research only; not investment advice.
