---
title: "Pulse: crypto-perps research platform and paper"
slug: pulse
summary: "A solo research program on crypto perpetuals, run on an always-on Rust, Redis and Python platform on a Raspberry Pi 5: 1,871 counted trials, a hash-chained pre-registration ledger, and an adversarial review strict enough to downgrade my own best result (Sharpe 3.45 on the 2026 holdout, backtest)."
period: Jul 2026 – present
role: "Solo: design, research direction, verification and write-up, with AI coding agents for implementation"
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
method: Counted search (1,871 trials), hash-chained pre-registration, purged CPCV with an embargo, HAC t-statistics, deflated Sharpe, placebo and leak controls, adversarial review
outcome: "One surviving book: Sharpe 3.45 on the 2026 holdout (backtest, after costs), then downgraded by my own adversarial review; the paper reports both"
card:
  result: "A counted search of 1,871 trials, pre-registered in a hash-chained ledger from 12 Oct. The one surviving market-neutral book scored Sharpe 3.45 on the 2026 holdout (backtest, after costs), and my own adversarial review then downgraded it: the paper reports the result and the downgrade."
  facts:
    - key: Rigor
      value: Every result deflated for 1,871 counted trials; from 12 Oct 2026 every test hash-chained into a ledger, with its pass and kill bars, before it ran
    - key: Best result
      value: Holdout Sharpe 3.45, +23.0 bp/day net, HAC t 2.61, worst drawdown 7.9% (backtest); downgraded on my own review because part of its design had seen the window
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
  - value: 1,871
    label: strategy trials counted and every result deflated for that count; new tests pre-registered in a hash-chained ledger
    kind: count
  - value: "3.45"
    label: Sharpe ratio of the one surviving book on the 2026 holdout (backtest, after costs), downgraded by my own review
    kind: finding
  - value: "16"
    label: pipeline defects found and fixed by an adversarial review, among them an embargo that silently truncated to zero
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
ai_note: I designed the platform and the research protocol, set every pass bar and checked the results; Claude Code agents implemented the code, ran the analyses and drafted the paper under that protocol, and adversarial verifier agents rebuilt key results from raw data.
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

- **Search.** 1,871 trials counted by 21 October: 154 registered, 17 charged from diagnostics and about 1,700 estimated for the earlier, unlogged search. After that many tries, luck alone is expected to reach a best t of about 3.4, so every result is read against the full count.
- **Holdout (backtest).** One dollar-neutral, cross-sectional book that holds positions for about a week passed its look at the 2026 holdout: +23.0 basis points of capital a day net of costs and funding, HAC t 2.61, Sharpe ratio 3.45 and a worst drawdown of 7.9%. On the 2023–2025 development years: +11.1 bp/day, HAC t 4.46, Sharpe ratio 2.44.
- **Adversarial review.** A separate review that I ran then downgraded the pass: the book was registered after the same window had been opened to select a model book, so its look is declared peeked, and on the three cleanest months it earned +9.1 bp/day at t 0.90. The paper's verdict is "pass, downgraded": not a tradable result on backtest evidence alone.
- **Execution realism.** An in-sample simulation on a fixed $500 from January 2023 to September 2026, with each venue's own prices, fees, slippage and funding at about 12 orders a day, stayed profitable on both Bybit and Binance data.
- **Forward paper trading.** A daily paper book has been tracked on the Pi since 26 October 2026. Weeks of paper returns are not a track record, so none are shown, and no real money is traded.

The backtest and simulation describe the past and are not a forecast.

## How it works

![Architecture](/assets/pulse/architecture.svg)

Two Rust daemons stream Bybit and Binance over sharded WebSockets, with REST polling for Binance bars, funding and open interest, into Redis Streams. Python services store Parquet bars and L2 snapshots, score headlines with FinBERT and CryptoBERT in INT8 ONNX, send a daily digest and serve a password-protected console that refuses trade- or withdraw-capable keys. Two batch jobs that once hit about 14 GB of memory were rewritten to stream and now peak under 0.4 GB.

A separate live execution layer turns the daily targets into exchange orders with resting stops. It was verified end to end on Bybit Demo; real money is off.

## Rigor

Most of the work went into making results trustworthy rather than merely large:

- **Counting.** 1,871 trials counted by 21 October: 154 registered, 17 charged from diagnostics and about 1,700 estimated for the earlier, unlogged search. Results are deflated for that count.
- **Logging.** From 12 October, each test's cells, costs and pass bars were hashed into an append-only, hash-chained ledger before it ran.
- **Validation.** CPCV with purging and an embargo, HAC t-statistics, the deflated Sharpe ratio, placebo and leak controls, and holdouts opened once.
- **Review.** An adversarial review fixed 16 pipeline defects, among them an embargo that silently truncated to zero, and a second one downgraded the surviving book.
- **Selection.** The cost-aware tests rejected most candidate strategy families before any of them reached a holdout; that selectivity is the point of the process.

## What I learned

- **Measure before tuning.** An early audit of my own harnesses corrected how returns, costs and Sharpe ratios were measured; every later test builds on that rebuild.
- **Count every try.** After 1,871 trials, luck alone is expected to reach a best t of about 3.4, so every result is read against the full count.
- **Review the winner hardest.** The strongest result got the toughest review, and the paper reports what that review found.
- **Agents need guardrails.** Specs, the ledger and adversarial verifier agents kept agent-run research checkable.

## Notes

The short paper reports the full search accounting, the downgrade and its own corrections; it does not disclose how the surviving book is built. Research only; not investment advice.
