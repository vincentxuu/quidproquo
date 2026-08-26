---
title: "Tool Pick | Cairn — An Incident Analysis Copilot You Query in Plain English"
date: 2026-08-22
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "Open-source incident analysis Copilot: ask a natural-language question, and it cross-references your observability stack, deploy timeline, and runbooks to propose evidence-backed root causes — remediation actions require human approval before execution"
tldr: "Cairn is an incident analysis Copilot that connects to your observability stack, deploy records, and runbooks via MCP tool servers. Ask 'why did checkout latency spike at 3 AM?' and get an evidence-backed root-cause hypothesis. Install: `make install && make up` for a local environment. It solves the problem of SREs manually cross-referencing timelines across multiple systems and digging through runbooks during incidents — and remediation actions require human approval before execution by default."
series:
  name: "AI Tool of the Day"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-08-22-tool-cairn-incident)

## Tool Info

| Field | Value |
|---|---|
| Name | Cairn |
| Type | Agentic Incident Analysis Copilot (MCP tool servers + CLI + Dashboard) |
| GitHub | [Nouman-Amjad/Cairn](https://github.com/Nouman-Amjad/Cairn) (created 2026-08-21) |
| Stars | 2 |
| Language | Python |
| License | Apache-2.0 |
| Install | `make install && make up` |

## What Problem Does It Solve

It's 3 AM and checkout latency just spiked. As the on-call engineer, here's what you do: open Grafana to check the latency graph, dig through deploy logs to see if a new version just shipped, search the wiki for a relevant runbook, and finally piece together a "probably this" root cause. The entire process is your brain manually correlating timelines across multiple systems — slow, and heavily dependent on whether the on-call engineer happens to be familiar with the service.

Cairn wraps this triage workflow into an agent: you ask in natural language, "Why did checkout latency spike at 3 AM?", and it sequentially queries observability systems (metrics/logs), cross-references the deploy timeline, pulls relevant runbooks, and proposes an evidence-backed root-cause hypothesis. Architecturally, each capability is an independent MCP tool server (observability, runbooks, and actions each get their own), with a cost- and sensitivity-aware router in between that chooses between a local 8B model and a frontier model. If the agent decides a remediation action is needed (e.g., restarting a service, rolling back), it enters an "approval gate" state machine that requires human approval before actually executing — it won't touch anything on its own.

Best suited for: teams with a reasonably mature observability stack (Prometheus/Grafana, etc.) that want to automate the first step of on-call triage but aren't comfortable letting an agent directly modify production.

## Getting Started

### Installation

```bash
git clone https://github.com/Nouman-Amjad/Cairn.git
cd Cairn
make install     # Install deps with uv and npm
make up          # Start Postgres(pgvector) / Redis / MinIO / OPA
make migrate      # Database schema
make test         # 246 unit tests
make eval         # Run the full agent pipeline against 30 incident scenarios
```

No GPU required, and no API key needed to run the full local test and evaluation suite.

### Basic Usage

```bash
cairn ask "why did checkout latency spike at 3am?"
```

The bundled dashboard runs locally with no extra build step:

```bash
npx @nouman-amjad/cairn dashboard
```

### Advanced Usage

To enable real LLM inference (rather than local 8B model evaluation mode), set environment variables pointing to Anthropic / vLLM endpoints. `make mcp-stdio` lets you debug individual MCP server responses via stdio mode.

## Comparison with Existing Tools

Among open-source incident analysis agents, the most established is the CNCF Sandbox project [HolmesGPT](https://github.com/HolmesGPT/holmesgpt) (originally by Robusta.Dev, with Microsoft contributions):

| | Cairn | HolmesGPT | Manual Triage |
|---|---|---|---|
| Natural-language diagnosis | ✅ | ✅ | — |
| Remediation requires human approval | ✅ (approval state machine) | Requires wiring your own Slack/PR approval flow | ✅ (humans do it anyway) |
| Built-in cost-aware router | ✅ (local 8B ↔ frontier model) | Depends on your LLM provider config | — |
| 24/7 background watch mode | ❌ (currently query-based only) | ✅ (Operator mode) | ❌ |
| Requires Kubernetes | ❌ | ❌ | — |
| Evaluation suite | ✅ (30 scenarios + 7 threshold metrics included) | Yes (150+ scenarios comparing different LLMs) | — |

Cairn is younger and more narrowly scoped (focused on doing "query-based root cause analysis + approved remediation" well), while HolmesGPT has a more mature ecosystem and broader integration surface (ready-made integrations with Slack/Teams/PagerDuty/Jira). If you just want to evaluate locally whether "LLM reads metrics and identifies root causes" actually works, Cairn's evaluation suite has a lower barrier to entry.

## Caveats

- **Very early-stage project (created 2026-08-21), minimal stars**: Currently a single-contributor early project with unknown long-term maintenance — treat it as a proof of concept, not something to plug directly into your on-call workflow.
- **The README itself lists "not yet validated" items**: These include real-world LLM accuracy (not yet calibrated), Terraform deployment to AWS, chaos testing scenarios, and actual cost figures at scale — all of these have only passed local tests with no production data.
- **Local environment isn't lightweight**: `make up` spins up Postgres(pgvector), Redis, MinIO, and OPA — four services. It's not a single binary you install and run; expect to spend some time getting the dependencies up before evaluating.

## Takeaway

Most "AI incident triage" demo videos focus on the flashy moment of "AI found the root cause." Cairn's README, by contrast, spends the most effort on the "approval state machine" and "OPA policy validation" — that is, how to prevent the agent from approving its own actions and how to prevent the same remediation from executing twice. This highlights something important: getting an agent to read system state and generate root-cause hypotheses is far easier than getting it to safely turn those hypotheses into "actually modifying production." The latter is what determines whether a team will trust this kind of tool enough to integrate it into their on-call workflow.

## References

- [Nouman-Amjad/Cairn — GitHub](https://github.com/Nouman-Amjad/Cairn): Project overview, architecture, install commands, license (Apache-2.0), and the README's own "validated/not yet validated" item list all sourced from the official README.
- [HolmesGPT — GitHub](https://github.com/HolmesGPT/holmesgpt): CNCF Sandbox project, used for comparing integration scope and Operator mode among similar open-source incident analysis agents.
- [HolmesGPT Documentation](https://holmesgpt.dev/): Source for Operator mode and data-source integration list details.
