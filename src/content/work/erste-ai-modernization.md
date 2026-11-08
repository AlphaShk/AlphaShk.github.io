---
title: AI-assisted legacy modernization at Erste Digital
slug: erste-ai-modernization
summary: "An AI pipeline that turns legacy Natural/Adabas banking code into as-is docs and review-ready Java/OSB integration code: 5 use cases, 10+ connectors delivered."
period: Ongoing · figures as of Aug 2026
role: Software Engineer
status: Employer work · confidential
code: none
tracks:
  - ai
  - quant_dev
order: 7
featured: false
gated: false
stack:
  - Natural / Adabas (mainframe)
  - Java
  - Oracle Service Bus (OSB)
  - GitHub Copilot CLI
  - Agents and reusable skills
  - MCP
  - Bash orchestration
  - CI/CD
  - Static analysis
metrics:
  - value: "5"
    label: complete use cases delivered with the pipeline
  - value: 10+
    label: Java/OSB integration connectors delivered
  - value: ">80%"
    label: "shorter typical use-case cycle time: months to under one work week (n = 5)"
links: []
hero: /assets/erste-ai-modernization/pipeline.svg
visuals:
  - src: /assets/erste-ai-modernization/pipeline.svg
    alt: "Schematic of the pipeline in four steps: legacy mainframe code, AI-assisted analysis, quality checks with human review, and documentation plus modern integration code delivered as pull requests."
    caption: The modernization pipeline at a high level. Schematic.
ai_note: ""
---

## The problem

The legacy banking code I work with is Natural/Adabas on the mainframe. Building a Java/OSB integration connector for it starts with working out what the old code does: which programs call which, what the screens show, which business rules apply. Before the pipeline, a typical use case took more than three monthly release cycles. In a regulated bank, generated code needs evidence before anyone merges it.

## What I built

I lead an internal AI accelerator team at Erste Digital, Erste Group's technology subsidiary. Our AI modernization pipeline for this code produces as-is documentation and Java/OSB integration connectors, delivered as a pull request with complete, usable code for human review. I orchestrate its tooling in CI/CD: GitHub Copilot CLI, agents and reusable skills, MCP, Bash and a deterministic code transpiler.

## How it works

![Modernization pipeline](/assets/erste-ai-modernization/pipeline.svg)

AI agents read the legacy Natural/Adabas code, explain what it does and draft the documentation and the modern Java/OSB integration code. Automated checks and a human reviewer sit between every generated change and the main branch, so nothing merges on the model's word.

## Results

As of August 2026 (my own figures):

- **5 complete use cases and 10+ connectors** delivered with the pipeline.
- **Typical use-case cycle time down by over 80%:** from more than three monthly release cycles to under one work week and a single release (n = 5).

## What I learned

- **The gates are part of the product.** In a bank, generated code is only useful if people trust it, so the checks and human review sit inside the pipeline.
- **Document before generating.** With the screens and business rules written down first, code and documentation can be checked against each other.
- **Name the metric precisely.** "Months to under a week" is cycle time; effort saved is a different claim, and I don't make it.

## Notes

- Alongside the pipeline, I maintain customer-data services and the OSB–Natural integration layer, introduced Kafka lifecycle events (mainframe to Kafka) for traceability and monitoring, and own production incidents.
- Intern from February 2024 (customer-database business logic in Natural/Adabas, internal analysis tooling); Software Engineer since September 2024.
- Text and one schematic only, by design: Erste's code, documents and internal tool names stay private.
