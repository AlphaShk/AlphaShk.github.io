---
title: "Pulse: crypto-perps research platform and paper"
slug: pulse
summary: "An always-on crypto-perps data platform on a Raspberry Pi 5, and a counted strategy search: 1,871 trials by 21 Oct 2026, no standalone edge found."
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
method: Pre-registration from 12 Oct 2026; CPCV with an embargo, HAC t-statistics, deflated Sharpe, placebo and leak controls, one look at a 2026 holdout
outcome: 0 of 11 strategy categories with a standalone edge after costs; one book passed, downgraded
card:
  result: No strategy category kept a standalone edge after costs; a short paper reports the search, the backtests and one downgraded pass.
  facts:
    - key: Search
      value: 1,871 trials counted by 21 Oct 2026, about 1,700 of them estimated
    - key: Method
      value: Each test logged before it ran from 12 Oct; CPCV, deflated Sharpe, placebo and leak controls, one-look 2026 holdout
    - key: Data
      value: Public Binance and Bybit exchange data, 2020–2026; no keys or private data
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
    label: trials counted by 21 Oct 2026, about 1,700 of them estimated
    kind: count
  - value: 0 of 11
    label: strategy categories with a standalone edge after costs
    kind: finding
  - value: "0.0047"
    label: deflated Sharpe ratio of the one book that passed, downgraded
    kind: evidence
  - value: 24/7
    label: designed to run unattended on one Raspberry Pi 5 (16 GB) under systemd; capture has gaps
    kind: operations
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
  - src: /assets/pulse/trials-by-category.svg
    alt: "Horizontal bar chart of registered trials per strategy category, coloured by verdict. Killed: order book 36, events 34, tree-based machine learning 16 plus 16 charged, momentum and flow 20, mean reversion 18, volatility overlays 6. Maker execution 10, passed as a cost saving. Transformers 8, inconclusive or void. The survivor chain 6 plus 1 charged, passed and downgraded. Pairs, arbitrage and carry had no registered trials."
    caption: Where the 154 registered and 17 charged trials went, ledger of 21 October 2026 (Figure 2 of the short paper). The estimated 1,700 earlier configurations are not drawn.
  - src: /assets/pulse/gross-vs-cost.svg
    alt: Range chart in basis points per round trip. For lead-lag, order-book imbalance, large sweeps, the July 2026 short-horizon signal engine, a 4-hour gradient-boosted model at 4.5 bp and pairs reversion, the best gross move falls short of the round-trip cost. Only a 24-hour model, at about 22 bp against 8.35 to 16.4 bp of cost, cleared it, with a net of +8.79 bp at t 1.33, which is inconclusive.
    caption: "Why most families died: the best gross move per round trip (blue) against the cost of trading it (orange). Only the 24-hour model beat its cost, and not significantly. Numbers from Sections 1.2 and 4 of the short paper."
  - src: /assets/pulse/survivor-by-year.svg
    alt: "Bar chart of the surviving book's net backtest return in basis points of capital per day, with HAC t-statistics: 2023 6.4 (t 1.79), 2024 7.8 (t 1.89), 2025 19.2 (t 3.98), the 2026 holdout from January to September 23.0 (t 2.61), and its clean July to September slice 9.1 (t 0.90)."
    caption: "The one surviving book by period, net of costs and funding: development years, the 2026 holdout and its clean third quarter. Backtest; Figure 4 of the short paper."
  - src: /assets/pulse/luck-penalty.svg
    alt: Line chart of the expected best t-statistic among N strategies with no edge, rising from about 0.5 at N = 2 to 2.5 at 100 and 3.43 at 1,871, far above the usual pass mark of 2.
    caption: "The luck penalty, from equation 1 of the short paper: with no real edge, the best of N tries is still expected to reach this t-statistic. At 1,871 counted trials it is about 3.4."
ai_note: Designed and directed by me; code, analyses and paper drafts produced with Claude Code agents; adversarial verifier agents rebuilt key results from raw data.
---

## The problem

Crypto-perps backtests mislead easily: try enough variants and one passes by luck, then fees and funding take the rest. I wanted cheap, always-on infrastructure and research whose "no" would hold up.

## What I built

Pulse started in July 2026 as a news-sentiment and indicator signal engine on a Raspberry Pi 5. Measured properly, its signals lost almost exactly their trading costs, so I retired them and rebuilt Pulse as:

- a market-data and paper-trading platform designed to run unattended on the Pi, with more than 500 automated tests;
- a research program, written up as a working paper (21 October 2026) and a short public edition.

## How it works

![Architecture](/assets/pulse/architecture.svg)

Two Rust daemons stream Bybit and Binance over sharded WebSockets, with REST polling for Binance bars, funding and open interest, into Redis Streams. Python services store Parquet bars and L2 snapshots, score headlines with FinBERT and CryptoBERT in INT8 ONNX, send a daily Telegram digest and serve a password-protected console that refuses trade- or withdraw-capable keys. A fail-closed gate blocks any signal without a certificate recomputed from forward outcomes; it has certified nothing.

Research safeguards, offline on public data:

- **Pre-registration.** From 12 October, each test's cells, costs and pass and kill bars were hashed into an append-only, hash-chained ledger before it ran.
- **Counting.** 1,871 trials counted by 21 October: 154 registered, 17 charged from diagnostics and about 1,700 estimated for the earlier, unlogged search.
- **Validation.** CPCV with purging and an embargo, HAC t-statistics, the deflated Sharpe ratio, placebo and leak controls, and one look at a 2026 holdout.

## Results

**Negative result.** No category produced a standalone edge that cleared its own rules; in most, the predicted move was smaller than the fee.

![Trials](/assets/pulse/trials-by-category.svg)

| Family | Verdict | Why |
|---|---|---|
| Short-horizon signals | retired | −16.18 bp net a trade; costs 13.5–16.5 bp |
| Order book, lead-lag | killed | 0.2–2.7 bp moves, 4–18 bp costs |
| Pairs, stat-arb | killed | 5–16 bp reversion, 16–51 bp costs |
| Event trades | killed | a placebo matched the best result |
| Funding carry | not alpha | about cash: 1.8% a year since 2022 |
| Maker execution | passed: cost saving | about 2.5 bp an order, simulated (BTC, Sep 2026) |

![Costs](/assets/pulse/gross-vs-cost.svg)

**Backtest on the 2026 holdout (one look, declared peeked).** One dollar-neutral cross-sectional book passed: +23.0 basis points of capital a day net of costs and funding, HAC t 2.61 against a bar of 2.0, worst drawdown 7.9%. My own verification review downgraded it: part of its design had already seen the window, the clean third quarter was not significant (t 0.90), five coins made 67% of its 2026 net return, and its deflated Sharpe ratio is 0.0047.

![By period](/assets/pulse/survivor-by-year.svg)

![Luck](/assets/pulse/luck-penalty.svg)

**Paper trading and operations.** A daily paper book runs on the Pi; weeks of paper returns are not a track record, so none are shown, and no real money is traded. Two batch jobs killed at about 14 GB of memory were rewritten to stream and peaked under 0.4 GB. Capture has gaps: a two-week stop in early October (cause unknown) and a five-day internet loss that led to reachability checks and a network watchdog.

## What I learned

- **Measure before tuning.** My first harnesses called t-statistics Sharpe ratios and counted echoes of one trade as many; measured properly, the gross edge was about zero.
- **Count every try.** After 1,871 trials, luck alone is expected to reach a best t of about 3.4; a pass means little until deflated.
- **Agents need guardrails.** Specs, the ledger and adversarial verifier agents kept agent-run research checkable; a re-audit overturned my own August carry result.

## Notes

**Corrections.** The short paper carries three corrections from a 30 October review of the working paper: development-period model scores were not a true walk-forward, so development figures are likely optimistic; a Bybit store called survivorship-free was not; and a Bybit loss belonged to a different, model-only book. The 2026 holdout result is unaffected.

Research only; not investment advice.
