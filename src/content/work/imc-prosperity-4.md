---
title: "IMC Prosperity 4: market making and trend carry"
slug: imc-prosperity-4
summary: "Team entry: I built the fair-value models, quoting logic and research tooling. My team reached Phase 2. Round-1 test-run PnL rose from 1,817 to 4,789 XIRECs."
period: Apr 2026
role: "Team entry: built the fair-value models and quoting logic; wrote the trading code and research tooling"
status: Private code · team entry
tracks:
  - quant_research
  - quant_dev
order: 5
featured: true
gated: false
stack:
  - Python 3.12
  - pandas, NumPy
  - SciPy (optimize), statsmodels
  - Jupyter, ipywidgets, Plotly
  - prosperity3bt (jmerle's open-source backtester)
  - uv
metrics:
  - value: Phase 2
    label: my team cleared the 200,000-XIREC qualifying bar over Rounds 1–2
    kind: outcome
  - value: 1,817 → 4,789
    label: Round-1 test-run PnL in XIRECs across 8 archived submissions on one fixed 1,000-tick test sample, about 2.6×
  - value: −254 → −56
    label: Round-1 test-run max drawdown in XIRECs, first vs last submission, same test sample
  - value: +6.1%
    label: local six-day backtest gain from wider ASH quotes under lenient fills (Round-2 position limits); strict fills never fill resting quotes, so they cannot test it
links: []
hero: /assets/imc-prosperity-4/regime-machine.svg
visuals:
  - src: /assets/imc-prosperity-4/regime-machine.svg
    alt: State diagram of the PEPPER regime machine. Each tick, a detrended fair value and short-horizon book signals become bearish and bullish evidence. The machine starts in trend on, which carries a near-full long. Persistent bearish evidence moves it to warning, which trims the long and bids less; confirmed bullish evidence moves it back. Stronger persistent bearish evidence moves warning to break, which stops buying and goes flat or slightly short. Confirmed bullish evidence moves break to recovery, which rebuilds the long; a strong bearish signal sends recovery back to break, and confirmed bullish evidence returns it to trend on. The state sets the target inventory band and how hard the engine bids and offers.
    caption: The PEPPER regime machine. In a replay of the public data, the settings of the last Round-1 test version switched state more than 200 times a day and reached break every day; the slower Round-2 settings never left trend on and warning, on any public day or in either Round-2 test run. Schematic.
  - src: /assets/imc-prosperity-4/r1-test-runs.svg
    alt: Stacked column chart of IMC website test-run PnL in XIRECs for eight Round-1 submissions, split into ASH (blue) and PEPPER (orange), with maximum drawdown below. 1 baseline 1,817; 2 trend in fair value 2,317; 3 split engines 4,369; 4 balanced inventory 3,102; 5 long floor 3,686; 6 same code as 5, 3,686; 7 max-long carry 4,739; 8 regime machine 4,789. ASH grows from 944 to 1,485 and PEPPER from 873 to 3,304. Maximum drawdown is −254 for the first version and between −52 and −58 for the rest, −56 for the last.
    caption: Round 1, IMC website test runs. All eight submissions ran on the same 1,000-tick sample, so they compare directly; version 6 resubmitted version 5's code and scored the same.
  - src: /assets/imc-prosperity-4/fill-model-check.svg
    alt: "Grouped column chart of ASH PnL over the six public days in a local backtest. Lenient matching: Round-2 v1 66,130 XIRECs, Round-2 final candidate with wider passive quotes 99,620, a gain of 33,490. Strict matching: 17,947 for both, no change."
    caption: Local backtest over the six public days (prosperity3bt, Round-2 position limits). PEPPER was identical in both versions, so only ASH is shown; the 33,490 gain is +6.1% of total six-day PnL and appears only under lenient matching.
ai_note: I used Claude Code as a coding assistant for the code and documentation.
---

## The problem

IMC Prosperity 4 (April 2026) is IMC's algorithmic-trading competition: each team uploads one Python file that trades simulated products tick by tick. Rounds 1 and 2 were qualifiers: reaching Phase 2 took at least 200,000 XIRECs, the game's currency, across both.

Both rounds traded two products. ASH_COATED_OSMIUM (ASH) stayed within about 20 of 10,000 on every public day; INTARIAN_PEPPER_ROOT (PEPPER) rose about 1,000 a day. Round 2 raised position limits from 50 to 80 and added two game-theory decisions.

## What I built

In this team entry I built the fair-value models and quoting logic and wrote the trading code and research tooling:

- **One trader, two engines**, one per product, replacing an early shared quote builder.
- **Research tooling**: notebooks for stationarity, mean-reversion and time-of-day checks; a prosperity3bt harness that runs each version under a lenient and a strict fill model; parsers that match local runs to IMC's website test runs.
- **A submission archive**: website test runs stored with their code and exports.

## How it works

**ASH: anchor/EMA market maker with inventory control.** The product stayed close to a fixed anchor, so the engine makes markets around an anchored, EMA-adjusted fair value and keeps its inventory in check.

**PEPPER: directional carry on a detrended fair value.** A four-state regime machine decides how much of the drift to carry:

![Regime machine](/assets/imc-prosperity-4/regime-machine.svg)

**Round 2's side decisions.** In the Market Access Fee auction, the top half of bids won 25% more quote flow. Because only the top half had to be beaten, my analysis favored a mid-range bid over a maximal one, and I tabulated its break-even against the expected gain from the extra flow. For Invest & Expand, a 50,000-XIREC budget split across three levers, one paid by rank against the field, I solved five field scenarios by exact integer grid search, cross-checked the base case with SciPy's trust-constr optimizer and weighted the pick toward speed-heavy fields.

## Results

**Round 1, IMC website test runs.** PnL rose from 1,817 to 4,789 XIRECs (about 2.6×) across eight archived submissions on the same 1,000-tick sample, while maximum drawdown shrank from 254 to 56 XIRECs. About 82% of the gain came from the PEPPER leg.

![Round-1 test runs](/assets/imc-prosperity-4/r1-test-runs.svg)

**Round 2, IMC website test runs.** 7,760.69 (v1) and 8,036.81 (final candidate) XIRECs. Each submission drew a new sample (the unchanged PEPPER leg moved by 180), so the pair cannot isolate the change.

**Local backtest: fill-model check.** Widening ASH's passive quotes added 33,490 XIRECs (+6.1%) over the six public days under lenient matching, and nothing under strict matching, where resting quotes never fill. The strict run therefore could not test the change, and the gain depends entirely on how the exchange fills resting quotes. The change became the Round-2 final candidate on the lenient result.

![Fill-model check](/assets/imc-prosperity-4/fill-model-check.svg)

**Qualification.** My team cleared the 200,000-XIREC bar and reached Phase 2, which IMC confirmed by e-mail on 22 April 2026.

## What I learned

- **The fill model can outweigh the strategy.** In local backtests the same ASH engine made 66,130 or 17,947 XIRECs over six days, depending only on the fill model.
- **Inventory was the biggest lever.** The one version that held a more balanced PEPPER inventory scored 1,267 XIRECs below its predecessor.
- **A fixed test sample is fair but small.** Eight runs on the same 1,000 ticks compare cleanly, but repeated tuning can fit that sample.
- **A regime filter is hard to test without a regime change.** In a replay of the public data, the last Round-1 test version switched state more than 200 times a day; the slower Round-2 settings never reached break. PEPPER's trend never broke, so the data could not decide between them.

## Notes

Local backtests use jmerle's open-source [prosperity3bt](https://github.com/jmerle/imc-prosperity-3-backtester). Ideas and workflow build on public Prosperity 3 write-ups by jmerle and the Frankfurt Hedgehogs.

Correction: my April notes said the wider quotes never fill. Re-running the backtests showed them filling about as often as the narrower quotes under lenient matching, at prices further from the mid.

The code stays private and my teammates stay unnamed. Research only; not investment advice.
