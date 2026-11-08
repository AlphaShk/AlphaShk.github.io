---
title: "QNN financial forecasting: BSc thesis code"
short_title: "QNN forecasting"
slug: qnn-financial-forecasting
tagline: "BSc thesis: quantum neural networks for forecasting"
summary: "BSc thesis, graded 1: quantum neural networks in Qiskit and PyTorch that forecast next-day returns and covariances of five assets, with a reproducible pipeline benchmarked on 121 held-out days against classical baselines."
period: "2026"
role: "Solo: BSc thesis in Mathematics, University of Vienna (written within the Bachelor seminar, graded 1)"
status: "Public repo · MIT"
code: public
tracks: [quant_research, ai]
order: 20
featured: false
page: project
stack: ["Python", "Qiskit and Qiskit Aer", "PyTorch", "Optuna", "pytest"]
card:
  result: "BSc thesis graded 1: Qiskit and PyTorch QNNs forecasting returns and covariances of five assets, with a pipeline that reproduces the thesis results bit for bit and is benchmarked on 121 held-out days."
  facts:
    - key: "Method"
      value: "Parametrized quantum circuits trained through PyTorch, 32 Optuna trials per target, exact and noisy Aer simulation"
    - key: "Data"
      value: "Daily bars of BNDX, GLD, IBM, NVDA and USO, split chronologically 359/119/121"
metrics:
  - value: "1"
    label: "grade of the BSc thesis, University of Vienna"
    kind: count
  - value: "121"
    label: "held-out test days, benchmarked against classical baselines"
    kind: count
  - value: "32"
    label: "offline tests, run in GitHub Actions CI"
    kind: count
links:
  - label: "Repository"
    href: "https://github.com/AlphaShk/qnn-financial-forecasting"
    kind: repo
  - label: "Thesis (PDF, on GitHub)"
    href: "https://github.com/AlphaShk/qnn-financial-forecasting/blob/main/docs/thesis.pdf"
    kind: thesis
    meta: "BSc thesis · PDF · 1.8 MB"
ai_note: "The thesis code is from my BSc thesis. This public edition (packaging, tests, CI, documentation and the noise-model correction) was prepared with Claude Code."
---

## The problem

Can a small quantum neural network forecast financial time series better than the naive baselines a forecaster has to beat anyway? My BSc thesis in Mathematics at the University of Vienna tested this on five assets, and the case study grew out of a WUTIS team project I led.

## What I built

- **Targets.** Next-day log returns of BNDX, GLD, IBM, NVDA and USO (5 outputs), and the upper triangle of their 4-day rolling covariance matrix one day ahead (15 outputs).
- **Models.** A ZZ feature map or RX-RZ data re-uploading, a RealAmplitudes ansatz and one Pauli-Z observable per target, run as a Qiskit `EstimatorQNN` inside a PyTorch `TorchConnector` with parameter-shift gradients and Adam.
- **Search.** 32 Optuna trials per target over qubits, layers, encoding, entanglement, angle scale, learning rate and more.
- **Backends.** Exact Aer simulation, Aer with noise models, and a Qiskit Runtime `EstimatorV2` path that is unit-tested but was not used for the reported results.
- **Reproduction.** One command retrains the published best configurations and reproduces the thesis test RMSEs bit for bit on the original data.

## Results

The pipeline is benchmarked on the untouched 121-day test split, with exact Aer simulation, against two classical baselines: a zero-return forecast for returns and the previous covariance matrix for covariances.

While preparing the repository I found that the local simulator path dropped the noise model, so the thesis's noisy rerun had sampling noise but no gate noise. I fixed it: with the noise model applied, a test-only evaluation of the trained checkpoints moves the test RMSE by +0.023% (returns) and +0.002% (covariance), and the README documents the correction. A full noisy retraining has not been rerun. No quantum-hardware result is reported.

## Notes

The thesis was supervised by Priv.-Doz. Dr. Lukas Exl.
