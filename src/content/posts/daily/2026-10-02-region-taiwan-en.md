---
title: "Region Focus | Taiwan"
date: 2026-10-02
category: daily
tags: [ai-agent, region, daily, taiwan]
lang: en
type: deep-dive
description: "Appier's tool-creation research paper gets accepted at NeurIPS, Taiwan's Ministry of Digital Affairs signals a pivot toward private-sector-led AI infrastructure at DevDays Asia 2026, and the same week a ransomware report ranks Taiwan third in the Asia-Pacific — three threads that together sketch an asymmetry between Taiwan's offense and defense in AI"
tldr: "Appier (TSE: 4180) published SMITH, a reinforcement-learning framework that trains a single model to both build and use tools, with the paper accepted at NeurIPS; a 4B-parameter model trained with SMITH outperformed an untrained 30B-class model. Minister Lin Yi-Ching of the Ministry of Digital Affairs reiterated at a recent forum and at DevDays Asia 2026's public-sector track that government shouldn't lead AI industry development through budget spending, pivoting instead to guiding private capital into compute-center buildout (targeting over 10,000 GPUs by next March) and the AIEC model-evaluation center. Meanwhile, a Group-IB report ranked Taiwan third in the Asia-Pacific for August ransomware incidents (20, behind only India and Australia) — the first time this series covers Taiwan."
series:
  name: "AI Region Focus"
  order: 12
---

## Region: Taiwan

This is the first time this series covers Taiwan as a region — not because this is the first week Taiwan has had anything going on, but because three threads landed in the same week: a Taiwanese company's foundational research reaching a top global venue, a government policy pivot becoming official, and a security report quantifying Taiwan's exposure in the region. Offense, defense, and policy all showing up in the same week makes this a natural entry point for the series.

## Key Developments This Week

### Appier's "SMITH" Paper Accepted at NeurIPS, Putting a Taiwanese Company at the Frontier of Global Agentic AI Research

AI-native company Appier (TSE: 4180) published a paper, "Joint Optimization of Tool Creation and Use for Large Language Model Agents," introducing SMITH (Schema-grounded Multi-task Iterative Tool Honing), a reinforcement-learning framework that trains a single model to both build tools and use them correctly — rather than splitting the two jobs across separate models with no feedback loop between them, as prior approaches did. The paper has been accepted at NeurIPS, a top international AI conference. ([iThome](https://www.ithome.com.tw/pr/179293) · [arXiv:2608.24571](https://arxiv.org/abs/2608.24571))

The arXiv paper confirms the key numbers: a 4B-parameter Qwen3 model trained with SMITH reaches a macro-average accuracy of 79.8 on held-out tasks across 13 procedural reasoning benchmarks, beating an untrained 30B-class (30B-A3B) tool-writer model; it scores 42.6 on out-of-domain GQA, 7.6 points ahead of the best same-backbone baseline; and tools built by the 4B model also lift the performance of a 350M-parameter lightweight model (LFM-2.5-350M) as well as a 30B-class model. iThome separately cites Appier's own claim that output token count drops from roughly 3,206 (for traditional step-by-step reasoning) to about 100 — a roughly 32x efficiency gain — ⚠️ a figure from Appier's own measurement that still awaits independent reproduction.

### Ministry of Digital Affairs Lays Out a Public-Sector AI Path at DevDays Asia 2026, Confirming a Pivot Toward Private-Sector-Led Infrastructure

Microsoft's three-day DevDays Asia 2026 conference in Taipei added a new "Smart Public Sector" track this year, bringing together the Ministry of Digital Affairs' Administration for Digital Industries, the Civil Service Development Institute under the Executive Yuan's Directorate-General of Personnel Administration, and Microsoft Taiwan to discuss government cloud migration, data governance, and frontline AI adoption — using Hiroshima Prefecture's cloud-transformation journey in Japan as a reference point. ([Economic Daily News](https://money.udn.com/money/story/5635/9787888))

This direction echoes what Minister Lin Yi-Ching said at an earlier forum, "Toward a New AI Era: A Cross-Generational Dialogue on the Future": software and AI industries carry high uncertainty and risk, making them unsuitable for government-led, budget-concentrated development; government's role should instead be building institutions and setting rules, letting private capital and market mechanisms do the work. Concretely, this means guiding private capital into compute-center construction (targeting more than 10,000 GPUs by next March, 20,000 within a year), exploring letting insurance-industry capital participate, rolling out an "AI Industry Talent Certification Guide," and relying on the already-established AI Evaluation Center (AIEC), which uses locally developed test items to assess how well domestic models understand Taiwan's language and culture. National Taiwan University professor Liu Ching-Yi, speaking at the same forum, cautioned that sovereign AI still faces a gap around copyright and personal-data legality for training data, and that a largely declaratory law like the AI Basic Act isn't enough on its own to resolve it. ([AI Trend Hub](https://aihub.org.tw/taiwan-ai-policy-private-sector-gpu-2026) (in Mandarin))

### Asia-Pacific Ransomware Incidents Up Nearly 27% Month-on-Month, Taiwan Ranks Third

A regional threat report from cybersecurity firm Group-IB recorded 190 ransomware incidents across the Asia-Pacific in August 2026, up 26.7% from July. Taiwan had 20 incidents that month, ranking third among the countries and regions covered, behind only India (32) and Australia (24). The most active ransomware group that month, The Gentlemen, was linked to 37 incidents overall, 6 of them in Taiwan, concentrated in manufacturing, biotech/pharma, and construction. ([iThome](https://www.ithome.com.tw/news/179235))

## Deep Dive

I think these three stories fit well into Porter's National Diamond Model, because each lands on a different corner of the diamond — and the corners clearly don't line up with each other.

**Firm strategy and rivalry**: Appier's SMITH research shows that a Taiwanese company can now compete at the global research frontier of agentic AI — not merely "adopting fast" at the application layer, but contributing at the methodology layer (reinforcement-learning framework design). This is the corner of the diamond that's hardest to engineer through policy; it has to be earned by the firm itself.

**Government role and demand conditions**: The headline from the Ministry of Digital Affairs isn't "more subsidies" — it's a deliberate shift in the government's own role, from funder to rule-setter and capital-guide, shifting the financial risk of compute buildout onto private capital (even trying to bring insurance-industry money into the mix). This is a classic "government steps back, demand conditions driven by the market" playbook — distinct from China's "state-led, build-the-full-stack-yourself" approach or Singapore's "sovereign fund makes the big bet directly."

**A gap in factor conditions**: Ranking third for ransomware exposes exactly the kind of factor condition that's easy to overlook in the diamond model — cybersecurity resilience. Taiwan's traditional factor-condition strengths in semiconductors and hardware supply chains are well established, but with manufacturing and biotech/pharma as the primary targets of ransomware groups like The Gentlemen, and attack frequency still climbing 27% month-on-month, cybersecurity resilience is becoming a hidden factor-condition gap that will determine whether enterprises feel safe wiring AI agents into core systems. It's the same category of problem as the copyright and data-legality gap Professor Liu flagged: policy and corporate research are both moving forward, but the supporting institutions and infrastructure haven't caught up yet.

## Takeaways for Taiwanese Entrepreneurs

- **If you're building enterprise AI agent adoption**: the signal from the Ministry of Digital Affairs is "government won't foot the bill, but it will pave the road" — infrastructure-type resources like the AIEC evaluation center and the talent certification guide are worth actively connecting with, but your business model needs to stand on its own without government subsidy
- **If you're building tool layers or multi-agent orchestration frameworks**: Appier's SMITH shows that jointly training "tool creation" and "tool use" lets a small model outperform a much larger one — a direct, borrowable lesson for Taiwanese teams working on edge AI or cost-sensitive deployments. Don't default to a bigger model; invest in tool quality and a reusable tool library instead
- **If you're building security or governance tooling for AI agents**: manufacturing and biotech/pharma are both the sectors ransomware groups are targeting most heavily right now and among the sectors most actively adopting AI agents in Taiwan — a product that addresses that overlap, around security review or agent permission control, has a clear, data-backed market gap (Group-IB's 27% month-on-month increase, The Gentlemen's six Taiwan incidents)

## Key Insight

I used to think Taiwan's AI policy narrative was mostly the old script — government subsidies plus semiconductor supply-chain strength. Watching the Ministry of Digital Affairs' positioning this week changed that: the government is deliberately stepping away from being the capital-driving force, shifting more of the responsibility for shaping factor conditions onto the market. But the same week's ransomware ranking is a reminder — when government steps back from leading on capital, resilience-type factor conditions like cybersecurity need institutional backfill, or they become a hidden bottleneck on how confidently enterprises adopt AI agents. That's a more useful lens for Taiwanese entrepreneurs than simply comparing how much government subsidy is on offer.

## References

- [Appier — SMITH research press release (iThome)](https://www.ithome.com.tw/pr/179293)
- [arXiv:2608.24571 — Joint Optimization of Tool Creation and Use for Large Language Model Agents](https://arxiv.org/abs/2608.24571)
- [Economic Daily News — Microsoft's Asia-Pacific tech conference charts a public-sector AI and digital governance path](https://money.udn.com/money/story/5635/9787888) (in Mandarin)
- [AI Trend Hub — Taiwan's AI development pivots to private-sector leadership](https://aihub.org.tw/taiwan-ai-policy-private-sector-gpu-2026) (in Mandarin)
- [iThome — Asia-Pacific ransomware incidents up nearly 27% month-on-month, Taiwan ranks third](https://www.ithome.com.tw/news/179235) (in Mandarin)
