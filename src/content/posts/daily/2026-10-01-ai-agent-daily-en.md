---
title: "AI Daily — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, daily]
lang: en
description: "OpenAI is racing to re-price above Anthropic before either company goes public, while DeepSeek ports its entire training toolchain onto Huawei silicon — two moats, capital and chips, both cracked open on the same day"
tldr: "OpenAI is negotiating a bridge round of at least $30B targeting a $1.4T valuation that would surpass Anthropic's latest private valuation, with August run-rate revenue already at $40B; a leaked Anthropic IPO prospectus shows $7.33B in first-half operating expenses and a listing timeline that may slip past the November midterms; on 9/30 DeepSeek open-sourced its core training toolchain — TileLang, DeepGEMM, DeepEP, FlashMLA — ported one-to-one onto Huawei's Ascend platform; no Stage 1 Arxiv/GitHub Digest output today"
draft: false
series:
  name: "AI Daily"
  order: 47
---

> 🌏 [中文版](/posts/daily/2026-10-01-ai-agent-daily)

## The One-Line Take

**OpenAI is using private capital to re-price itself above Anthropic before either company's IPO lands, while DeepSeek quietly ported the training toolchain that used to lock China's model teams into Nvidia straight onto Huawei silicon — the capital-layer lead and the chip-layer lock-in are cracking open on the same day.**

## Deep Dive: Two Moats, Cracked Open on the Same Day

I think today's two seemingly unrelated stories are actually the same story: the lock-in mechanisms incumbents rely on to stay ahead are being actively pried open by rivals.

Evidence A (rivalry among incumbents): Bloomberg reports OpenAI is negotiating a bridge round of at least $30 billion, targeting a valuation of roughly $1.4 trillion — a 64% repricing above its March round, and enough to leapfrog Anthropic's most recent private-market valuation. The same report puts OpenAI's August run-rate revenue at $40 billion, up 70% since July. The timing is telling: this comes just as a leaked Anthropic IPO prospectus, obtained by Reuters, shows $7.33 billion in first-half operating expenses and a listing timeline that may now slip past the November US midterm elections. OpenAI is choosing to lock in the "who's actually on top" narrative with private capital before either company's public financials can be compared side by side.

Evidence B (supplier bargaining power): On 9/30, DeepSeek open-sourced the core toolchain it uses to train its V4-series models — TileLang, DeepGEMM, DeepEP, FlashMLA — onto Huawei's Ascend platform, with every component mapped one-to-one to the Nvidia versions it had already open-sourced, so developers can swap hardware backends without rewriting their code. The two companies also disclosed they're jointly building a 128-card supernode based on Ascend 950 chips. China's model teams were never locked into Nvidia purely on chip performance — the real barrier was the switching cost of leaving the CUDA ecosystem. DeepSeek just flattened that cost itself.

What this means for practitioners: if your roadmap assumes a given chip vendor or model lab will keep its pricing or performance edge indefinitely, both of today's stories are reason to re-check that assumption — viable alternatives are emerging at the chip layer, and the capital arms race at the model layer could well translate into more aggressive enterprise discounting. For Taiwan-based builders, the practical takeaway is procurement strategy: when evaluating AI infrastructure contracts, "are we locked into a single vendor" now deserves its own line item, rather than assuming Nvidia's, OpenAI's, or Anthropic's current position holds indefinitely.

## Today's Developments

### Vendor Moves

**OpenAI**: Negotiating a bridge round of at least $30 billion targeting a roughly $1.4 trillion valuation, as a bridge following its delayed IPO; Bloomberg reports August run-rate revenue at $40 billion, up 70% from July. ([source](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value))

**Anthropic**: A leaked IPO prospectus obtained by Reuters shows $7.33 billion in first-half operating expenses, with the listing timeline possibly slipping past the November midterms; launched Claude Sonnet 5.5 on 9/28 to round out its 5.5 lineup (Claude Opus 5.5 shipped 9/22). ([source](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html))

### Models & Infrastructure

**DeepSeek open-sources its full Ascend toolchain**: On 9/30, DeepSeek ported its core training components — TileLang, DeepGEMM, DeepEP, FlashMLA — onto Huawei's Ascend platform, each mapped one-to-one to the existing Nvidia versions; the two companies also disclosed a joint 128-card Ascend 950 supernode effort. See "Deep Dive" above for details. ([source](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex))

### Business Cases / Funding / M&A

**OpenAI bridge round**: See "Vendor Moves" above — if it closes, it would put OpenAI's private-market valuation back on top, ahead of either company's public listing. ([source](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value))

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| OpenAI target bridge round size | ≥$30B | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| OpenAI target valuation | ~$1.4T (64% above March) | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| OpenAI August run-rate revenue | $40B (+70% vs. July) | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| Anthropic H1 operating expenses | $7.33B | [CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html) |

## Today's Digest Roundup

Stage 1 routines (Arxiv Digest, GitHub Digest, etc.) haven't produced output yet today, so there's nothing to list.

## Watching Tomorrow

- Whether OpenAI's $30B bridge round actually closes, and whether the final valuation really clears $1.4T
- When independent performance validation of the DeepSeek–Huawei Ascend 128-card supernode shows up, and whether it can match Nvidia clusters
- Whether more detail leaks from Anthropic's IPO prospectus, and whether the listing timeline really does slip past the midterms

## Today's Update

I used to think the US-China AI supply chain split was mostly bottlenecked on chip capacity and export controls. Seeing DeepSeek port its entire training toolchain onto Ascend today made me realize the real bottleneck was software-ecosystem switching cost — once that cost gets flattened, chip capacity becomes the comparatively easier problem to solve. For Taiwan's semiconductor supply chain, that means pure process or capacity advantages may not be enough to sustain long-term bargaining power; software-ecosystem lock-in capability needs to be part of the evaluation too.

## References

- [OpenAI Targets $30 Billion in Funding at $1.4 Trillion Value — Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)
- [Anthropic's IPO prospectus shows sweeping AI vision, surging costs — CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)
- [Anthropic rolls out second Claude 5.5 model as it builds toward IPO — Reuters](https://www.reuters.com/technology/anthropic-rolls-out-second-claude-55-model-it-builds-toward-ipo-2026-09-28/)
- [DeepSeek Open-Sources Ascend Versions of TileLang, DeepGEMM and More — Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)
- [DeepSeek and Huawei release TileLang for Ascend chips, taking aim at CUDA](https://pasqualepillitteri.it/en/news/19580/tilelang-deepseek-huawei-ascend-cuda)
