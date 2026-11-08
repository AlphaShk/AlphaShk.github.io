---
title: "Bass local volatility on SPX options"
short_title: "Bass local vol"
slug: bass-lv-calibration
tagline: "replication of Conze and Henry-Labordère on SPX"
summary: "A tested Python replication of Conze and Henry-Labordère (2021) on the SPX option chain of 15 Aug 2019: fixed-point calibration to three expiries, exact large-step Monte Carlo, Asian pricing and vega hedging."
period: "Summer 2026"
role: "Solo: MSc summer research project with Prof. Julio Backhoff-Veraguas"
status: "Public repo · MIT"
code: public
tracks: [quant_research, quant_dev]
order: 21
featured: false
page: project
stack: ["Python", "NumPy and SciPy", "Jupyter", "pytest"]
card:
  result: "An exact Gaussian convolution restored the martingale property that quadrature broke on the real smile (max |z| 17.8 → 1.8) and cut the fixed point from 254/499 to 10/12 iterations."
  facts:
    - key: "Data"
      value: "SPX close of 15 Aug 2019: 1,026 calls and puts, 246/65/67 cleaned OTM quotes for three expiries"
    - key: "Method"
      value: "Theorem 2.1 fixed point, exact large-step Monte Carlo, hat-bump vega Greeks checked against bump-and-revalue"
metrics:
  - value: "17.8 → 1.8"
    label: "max |z| of the conditional drift, quadrature vs exact convolution"
    kind: evidence
  - value: "10 and 12"
    label: "fixed-point iterations per interval, down from 254 and 499"
    kind: count
  - value: "55"
    label: "tests on synthetic inputs, including Black–Scholes recovery, in CI"
    kind: count
links:
  - label: "Repository"
    href: "https://github.com/AlphaShk/bass-lv-calibration"
    kind: repo
ai_note: "The summer-2026 notebook is mine. The package, the tests, the data script, the quadrature fix and the extra checks came out of the portfolio build and were done with Claude Code."
---

## The problem

The Bass local-volatility model is a martingale whose law at each listed expiry is a prescribed marginal, here read off the SPX smile. Conze and Henry-Labordère show how to calibrate it by a fixed point and simulate it with one Gaussian draw per expiry, with no time stepping. I implemented their paper, *Bass Construction with Multi-Marginals: Lightspeed Computation in a New Local Volatility Model* (2021), on real option data as an MSc summer research project at the University of Vienna.

## What I built

- **End to end.** Put–call-parity forwards, OTM smiles, Breeden–Litzenberger marginals, the Theorem 2.1 fixed point, local volatility, exact large-step Monte Carlo, Asian and forward-start pricing, hat-bump vega Greeks (Eqs. 9–15) with a nine-call vega hedge, and the Bass2 general-kernel operator (Theorem 6.1).
- **A numerical fix.** The original notebook used 24-node Gauss–Hermite quadrature for every heat-kernel convolution. On the kinked maps of a real smile this broke the martingale property (conditional drift up to 1.2% of the forward). An exact convolution of the piecewise-linear maps restores it.
- **Checks.** Greeks agree with bump-and-revalue within 0.2% (Asian) and 1.3% (calls); the 9×9 vanilla vega matrix has full rank.

## Results

One historical snapshot: SPX close of 15 Aug 2019 (spot 2847.60), expiries Sep 2019, Dec 2019 and Jun 2020; ± is one standard error.

| Check | Exact convolution | Original quadrature |
|---|---|---|
| Fixed-point iterations (two intervals) | 10 and 12 | 254 and 499 |
| 60,000-path repricing of 9 calls, max abs error | 1.89e-4 | 2.53e-4 |
| 3-fixing ATM Asian call, full smile (index points) | 106.02 ± 0.51 | 105.86 ± 0.51 |
| Martingale check, max abs z | 1.8 | 17.8 |

With the original numerics the package reproduces the original notebook bit for bit. It is a replication for research, not a production pricer.
