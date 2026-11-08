---
title: "WUTIS: leading student algorithmic-trading teams"
slug: wutis
summary: "Four semesters at WUTIS: led a 3-person CRNN volatility team and a 5-person QNN portfolio team, taught coding workshops and reported weak results plainly."
period: Oct 2024 – Summer 2026
role: Team member, then project lead of two teams; workshop leader and recruiter
status: Team projects · public pitch decks
code: none
tracks:
  - quant_research
  - quant_dev
  - ai
order: 6
featured: false
gated: false
stack:
  - Python
  - TensorFlow / Keras
  - Qiskit (qiskit-machine-learning)
  - PyTorch
  - Optuna
  - cvxpy
  - backtrader
  - NumPy / SciPy / pandas
  - Alpaca API (alpaca-py)
  - Git / GitHub pull requests
  - Docker, Google Cloud (workshops)
metrics:
  - value: "2"
    label: research teams led, of 3 and 5 people
  - value: "4"
    label: semesters, from Fellow Analyst to Senior Associate
  - value: 1.98 vs 2.30
    label: "Sharpe ratio: QNN portfolio below equal weight, 16-month out-of-time backtest"
    kind: finding
links:
  - label: "CRNN volatility forecasting: team pitch deck (WUTIS, June 2025)"
    href: https://wutis.at/wp-content/uploads/crnn_slides.pdf
  - label: "Quantum on Quantum: QNN portfolio team pitch deck (WUTIS, January 2026)"
    href: https://wutis.at/wp-content/uploads/WUTIS_QNN.pdf
  - label: "Follow-up: QNN forecasting in my bachelor thesis"
    href: https://github.com/AlphaShk/qnn-financial-forecasting
hero: /assets/wutis/timeline.svg
visuals:
  - src: /assets/wutis/timeline.svg
    alt: "Timeline of four semesters. Winter 2024/25: Fellow Analyst, member of a team of 4 on OU pairs trading with a likelihood fit, cost-aware entry and exit bands and an Alpaca streaming prototype. Summer 2025: Analyst / Project Lead of a team of 3 on CRNN volatility forecasting with a Keras CNN and GRU network, Optuna, a trading-window search and a backtrader backtest, plus an internal coding workshop in March 2025. Winter 2025/26: Associate / Project Lead of a team of 5 on a QNN portfolio with Qiskit QNN forecasts, a long-only Markowitz optimizer and weekly rebalancing. Summer 2026: Senior Associate, Workshop Leader and Recruiter, with workshops on advanced coding and on Docker and Google Cloud in March 2026 and a fellowship assignment."
    caption: "Four semesters in the Algorithmic Trading division: the title I held each semester and the project or teaching that went with it."
  - src: /assets/wutis/crnn-backtest.svg
    alt: "Two stacked line charts sharing an x-axis, the position in the test set in thousands of one-minute bars. Top: the VIXY price series the backtest trades sits near 11 to 14 dollars, jumps 3.84 times within 3 bars near bar 19,000 to about 44 dollars, and later ranges between about 40 and 89. Bottom: backtest P&L without costs stays near zero until the same point, steps up by about 25,000 dollars there, peaks near 50,000 and ends near 31,000. An orange line marks the jump; 240 long trades held across it make 79.7% of the summed P&L."
    caption: CRNN team backtest, re-plotted from the committed trade log (56,098 closed-trade records, no transaction costs). The backtest gives its bars synthetic timestamps, so the x-axis counts bars instead of dates. Backtest only; not evidence of an edge.
ai_note: ""
---

## The problem

WUTIS is a student investment society in Vienna. In its Algorithmic Trading division, small teams build and pitch a trading or forecasting project each semester. I joined in October 2024 after a case study and a Superday. Leading meant turning a proposal into code that three to five students could build in parallel, then reporting what the backtest showed.

## What I built

- **Winter 2024/25, Fellow Analyst.** In a four-person team I worked on the Python, strategy and project planning of an Ornstein–Uhlenbeck (OU) pairs-trading model.
- **Summer 2025, Analyst / Project Lead.** I proposed and led a three-person project forecasting volatility with a convolutional-recurrent network (CRNN). Code ownership was shared: I wrote the data pipeline and much of the model and trading code. In March 2025 I also ran an internal coding workshop.
- **Winter 2025/26, Associate / Project Lead.** I led "Quantum on Quantum", a five-person project where quantum-neural-network (QNN) forecasts drive a portfolio optimizer. I wrote the QNN core and most of the data pipeline and was the top code contributor; teammates built the optimizer and backtest.
- **Summer 2026, Senior Associate, Workshop Leader and Recruiter.** In March 2026 I taught "Introduction to Advanced Coding" (OOP, trading APIs, project structure, Git) and "Docker and Google Cloud" (running a containerized Alpaca data client on Google Cloud). I also ran applicant coffee chats (September 2025 to February 2026) and wrote the summer-2026 fellowship assignment and a Superday case study.

## How it works

![Roles and projects by semester](/assets/wutis/timeline.svg)

- **OU pairs.** A grid over the hedge ratio picks the spread with the highest OU likelihood (closed-form maximum-likelihood estimates). Cost-aware entry and exit bands follow an optimal mean-reversion rule (after Leung and Li), re-fitted on a rolling window; a prototype pipeline is written to submit paired Alpaca orders at the bands.
- **CRNN.** Alpaca minute bars for SPY and VIXY plus technical indicators feed a Keras network (convolutions, then GRUs) forecasting SPY's 60-minute rolling volatility one minute ahead. Optuna tunes it, a second Optuna search scores intraday trading windows, and a backtrader backtest trades VIXY on the forecast.
- **QNN.** Qiskit QNNs (EstimatorQNN via PyTorch's TorchConnector, tuned with Optuna) forecast next-week returns for 12 assets and the 78 entries of their covariance matrix. A classical long-only minimum-variance (Markowitz) optimizer in cvxpy rebalances weekly from the covariance forecast alone, against an equal-weight benchmark. The deck's QUBO slide is a next step; the code solves the convex problem.

## Results

**QNN: out-of-time backtest, negative result.** Over a 16-month out-of-time backtest the portfolio had a higher return than equal weight but also higher volatility, so it lost on Sharpe ratio (1.98 vs 2.30). Both ratios are high because the hand-picked 12-asset universe includes four quantum-computing stocks. The committed predictions show where the risk side failed: 323 of 792 forecast variances were zero or negative, and QUBT, the most volatile of the 12 assets, was the largest holding in 31 of 66 weekly rebalances.

**CRNN: backtest, not evidence of an edge.** 79.7% of the summed trade P&L comes from 240 long trades held across one 3.84× jump in the VIXY price series, which our pitch deck flagged. The deck's headline figures come from this backtest: no transaction costs, jump included.

![CRNN backtest: price jump and backtest P&L](/assets/wutis/crnn-backtest.svg)

**OU: in-sample backtest.** On GLD–SLV the model returned 6.11% a year at 13.01% volatility, but its re-fit interval and window were tuned on the same test period.

## What I learned

- **Structure lets a team work in parallel.** Separate modules, YAML configs and feature branches let three to five people build at once; my 2026 workshops taught exactly that.
- **Check the data and the target before the model.** One price jump made most of the CRNN profit, and the volatility target shared 59 of its 60 one-minute returns with the input window.
- **Read the holdings before the P&L.** The QNN portfolio's raw return hid its risk: its largest holding was often the most volatile stock. A covariance forecast should be valid by construction, for example a factor model.

## Notes

All three were team projects; this page describes my part. The linked decks list each team and its roles. The CRNN deck's live-data and trading stage describes the planned design; the committed code only backtests. Both projects I led won their semester pitches. Research only; not investment advice.
