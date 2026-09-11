---
title: "Tool Pick | mcp-bi — One Set of Tool Calls to Read Dashboards Across Superset, Metabase, and Power BI"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source Rust MCP server that unifies dashboard queries across Apache Superset, Metabase, and five commercial BI platforms behind one tool interface, returning the underlying statistics alongside every chart instead of just a screenshot"
tldr: "mcp-bi is zavora-ai's open-source Business Intelligence MCP Server. Set BI_BACKEND to switch between Superset, Metabase, Power BI, Tableau, Looker, Qlik, and QuickSight while an agent calls the same tool set across all of them. Install: cargo run (ships with a seeded fixture, no setup needed). It addresses the problem of agents only seeing a dashboard screenshot and guessing at trends."
series:
  name: "AI Tool of the Day"
  order: 28
---

> 🌏 [中文版](/posts/daily/2026-09-12-tool-mcp-bi)

## Tool Info

| Field | Value |
|---|---|
| Name | mcp-bi (Business Intelligence MCP Server) |
| Type | MCP server |
| GitHub | [zavora-ai/mcp-bi](https://github.com/zavora-ai/mcp-bi) |
| Stars | 1 |
| Language | Rust |
| License | Apache-2.0 (per crates.io; the GitHub repo's license-detection field shows `Other/NOASSERTION`, suggesting no standard LICENSE file — verify before relying on it) |
| Install | `cargo run` (after clone, defaults to a zero-config fixture backend) |

## What Problem It Solves

Say you're building an operations agent that answers "how does this quarter's revenue compare to last quarter" or "which channel lost the most traffic." The data already lives in dashboards on your company's BI platform — but the agent either has to learn each platform's own query language (SQL for Superset, DAX for Power BI, explores for Looker), or it only gets handed a screenshot of a dashboard. The screenshot path is quietly dangerous: a model looking at an image will fluently "describe" a trend line it never actually measured, with numbers it made up.

mcp-bi collapses that platform difference into one environment variable, `BI_BACKEND`. The default is a `memory` mode seeded with three fixture dashboards — no credentials needed, so you can try the tool interface before wiring up anything real. Point it at `superset`, `metabase`, `powerbi`, `tableau`, `looker`, `qlik`, or `quicksight` instead, and the agent calls the same twelve tools (`bi_list_dashboards`, `bi_chart_data`, `bi_drill_down`, and so on) regardless of which platform sits behind them — swapping vendors doesn't touch the agent's own code. The design rule stated plainly in the README: "numbers are authoritative; pixels are for people." `bi_render_chart` returns a PNG and the statistics behind it in the same call; `bi_insights` computes direction, change, extremes, mean, and outliers on its own — the numbers actually worth citing — so narration has something real to point at.

Good fit for: teams already running Superset or Metabase who want an agent to query existing dashboards directly instead of re-wiring a database connection; a support or ops agent that needs to answer "what's the latest number for X"; anyone juggling several commercial BI platforms who wants one tool interface instead of writing a separate integration per vendor.

## Quick Start

### Install

```bash
# Zero-config trial: three seeded fixture dashboards
git clone https://github.com/zavora-ai/mcp-bi
cd mcp-bi
cargo run

# Or install the version published to crates.io
cargo install mcp-bi
```

### Basic Usage

```bash
# Point at a real Apache Superset (prefer username/password over a raw token, see below)
BI_BACKEND=superset \
  SUPERSET_URL=http://localhost:8088 \
  SUPERSET_USERNAME=admin SUPERSET_PASSWORD=admin \
  cargo run
```

Typical call sequence an agent follows:

```
1. bi_backend_info      # Confirm which platform is connected and what it supports
2. bi_list_dashboards   # List available dashboards
3. bi_get_dashboard     # See a dashboard's drillable dimensions
4. bi_chart_data        # Pull the raw rows behind one chart
5. bi_insights          # Compute direction/change/extremes/outliers to cite in the answer
```

### Advanced Usage

```bash
# Drilling down: narrow by filters, break down by a dimension, get row counts
# before/after (invoked by the agent through the bi_drill_down tool, not a CLI flag)

# Spin up a real Superset to verify against, instead of trusting the docs alone
docker run -d --name superset-bi -p 8088:8088 \
  -e SUPERSET_SECRET_KEY=local-only apache/superset:latest
docker exec superset-bi superset db upgrade
docker exec superset-bi superset init
docker exec superset-bi superset load_examples   # loads 9 real example dashboards
python3 scripts/verify-superset.py ./target/release/mcp-bi
```

## Comparison With Existing Approaches

| | mcp-bi | Handing an agent a dashboard screenshot | A single-platform BI MCP (e.g. Metabase-only) |
|---|---|---|---|
| Switch BI platforms without touching agent code | ✅ (12 unified tools) | — | ❌ (switching platforms means switching MCP servers) |
| Charts returned with underlying statistics | ✅ `bi_render_chart` returns PNG + numbers together | ❌ the model guesses from the image | Depends on the implementation |
| Try the tool interface without real credentials | ✅ default `memory` fixture | — | Usually requires a real account first |
| Real-world verification across commercial platforms | Partial: Superset tested against a live instance; the other 5 are implementation-from-docs only, untested against a real tenant | — | Usually just the one platform it targets, so verification is more concentrated |
| Read-only, no dashboard write/edit capability | ✅ (`writes_allowed = "none"`) | — | Depends on the implementation |

## Caveats

- **Only Superset has been verified live.** The README states Metabase is tested against recorded responses following its documented API, and the five commercial adapters (Power BI, Tableau, Looker, Qlik, QuickSight) have never run against a real tenant — the author's own words: "expect at least one surprise per platform." Verify one of these yourself before relying on it in production.
- **License claim is inconsistent.** crates.io lists the published crate as Apache-2.0, but GitHub's own license-detection field on the repo shows `Other/NOASSERTION`, suggesting there's no standard-format LICENSE file in the repository. Check the actual license file before adopting it, not just the badge.
- **One day old, one star.** The codebase isn't trivial (roughly 3,800 lines of Rust with 27 tests), but community validation is essentially nonexistent — expect to read the source yourself if you hit an issue.

## Today's Takeaway

The hard part of BI integration usually isn't reaching the API — it's whether the agent's answer is backed by an actual number. Hand a model a dashboard screenshot and it will fluently narrate a trend it never measured. mcp-bi makes "the chart" and "the statistics behind the chart" a pair that must be returned together, closing off the "narrate from a picture" path at the protocol level.

## References

- [zavora-ai/mcp-bi GitHub repo](https://github.com/zavora-ai/mcp-bi): full README — architecture, the 12-tool list, per-platform environment variables, the three findings from live Superset verification, and the "not yet verified" disclosure.
- [mcp-bi — crates.io](https://crates.io/api/v1/crates/mcp-bi): license (Apache-2.0), version (0.1.1), and line-count stats (3,857 lines Rust / 150 lines Python).
- GitHub API repo metadata (`zavora-ai/mcp-bi`): stars (1), language (Rust), creation date (2026-09-11), and the license-detection field (`Other/NOASSERTION`) via the GitHub REST API.
