---
title: "arXiv Paper Quality Assessment Guide: From Endorsement Mechanisms to a Practical Checklist"
date: 2026-05-28
category: ai
type: guide
tags: [arxiv, paper-reading, research-tools, reproducibility, llm]
lang: en
tldr: "arXiv does not perform peer review, and roughly 2% of submissions are rejected. Quality judgment relies on external signals: top venue acceptance > institution + open-source reproduction > citation quality. Includes a 20-item practical checklist and a 2026 toolbox (PWC has shut down)."
description: "Breaking down arXiv's endorsement and moderation mechanisms, organizing an external quality signal pyramid, red flag list, the ML reproducibility crisis, and paper evaluation tools and checklists applicable in 2026."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-28-arxiv-paper-quality-guide)

Over 1,000 papers are uploaded to arXiv every day. Everyone has heard that "arXiv is not peer review," but what exactly do its endorsement and moderation processes filter out -- and let through? This post covers arXiv's own quality mechanisms, how to interpret external signals, tools still usable in 2026, and a checklist to run through after reading a paper.

## arXiv's Two Gatekeepers

### Endorsement: A Trust Network, Not Quality Certification

Since 2004, arXiv has required first-time submitters to obtain endorsement. According to [arXiv's official documentation](https://info.arxiv.org/help/endorsement.html), an endorser's responsibility is:

> "You should not endorse the author if the author is unfamiliar with the basic facts of the field, or if the work is entirely disconnected with current work in the area."

In other words, the endorser confirms that "this person belongs to the scientific community," not that "this paper is correct." New authors from recognized academic institutions typically receive automatic endorsement and never encounter this barrier in practice.

### Moderation: Format Review, Not Content Review

According to [arXiv's moderation policy](https://info.arxiv.org/help/moderation/index.html), moderators are volunteer domain experts with terminal degrees. They can:

- **Reclassify**: Move to a more appropriate category (being moved to the `general` category is widely seen as a downgrade in the community)
- **Reject submissions**: Wrong format, non-research papers (coursework, research proposals), plagiarism, excessive submission frequency (limit of 3 per day)

According to [Scientific American's report](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning), about 6% of submissions are held and about 2% are rejected. Compared to Nature/Science's acceptance rates below 10%, arXiv's bar is clearly on a different level.

Once a paper is announced, it becomes a permanent academic record. arXiv only removes papers for licensing issues, and withdrawals for policy violations retain the metadata.

**Conclusion**: Getting on arXiv only means the format is acceptable and the author belongs to the academic community. Quality judgment must rely on external signals.

## External Quality Signal Pyramid

```
        ┌─────────────────────────┐
        │ Top Venue Acceptance    │  NeurIPS / ICML / ICLR / ACL / CVPR
        │       (Strongest)      │
        ├─────────────────────────┤
        │ Known Institution +    │  DeepMind / FAIR / runnable code
        │ Open-Source Reproduction│
        ├─────────────────────────┤
        │   Citation Quality     │  Highly Influential Citations > raw count
        ├─────────────────────────┤
        │ arXiv Only, No         │  Requires independent verification
        │ Corroboration          │
        └─────────────────────────┘
```

### Conference Acceptance: The Most Direct Endorsement

A paper's front page annotated with "Accepted at NeurIPS 2025" means it passed peer review by 3-4 reviewers. Major AI/ML conferences:

| Tier | Conference | Acceptance Rate |
|---|---|---|
| Tier 1 | NeurIPS, ICML, ICLR | ~20-25% |
| Tier 1 | ACL, EMNLP (NLP); CVPR, ICCV (CV) | ~20-25% |
| Tier 2 | AAAI, IJCAI, AISTATS, UAI | ~25-30% |

No conference annotation does not mean the paper is bad -- many industry technical reports and foundation model papers (e.g., GPT-4, Llama) choose not to submit to conferences. But if a paper claiming breakthrough results has neither conference acceptance nor backing from a well-known institution, extra caution is warranted.

### Citation Metrics: Quality Over Quantity

The [DORA Declaration](https://sfdora.org/read) explicitly opposes using Impact Factor as a proxy for individual paper quality. More meaningful approaches:

- **Semantic Scholar's "Highly Influential Citations"**: Distinguishes between "mentioned in passing in related work" and "method genuinely builds on this foundation"
- **Citation graphs**: Being extended by 30 independent teams is more valuable than being mentioned in 200 papers' related work sections
- **Citation counts are meaningless for new papers**: Within 6 months of publication, citations have not yet accumulated

### Open-Source Reproduction: No Code Is a Negative Signal

Since 2025, not including code has shifted from "neutral" to "negative signal." But beware: having a GitHub link with zero commits after the README is a known superficial pattern. What truly matters is a repo that actually runs, with clear seeds and environment configuration.

## The 2026 Paper Evaluation Toolbox

Papers With Code was shut down by Meta in July 2025, and the integrated experience that once tracked 79,817 papers, 9,327 benchmarks, and 5,628 datasets is gone ([CodeSOTA record](https://www.codesota.com/papers-with-code), [TIB-Blog report](https://blog.tib.eu/2025/10/02/papers-with-code-went-offline-the-knowledge-doesnt-have-to)). Here are the currently available alternatives:

| Tool | Purpose | Free |
|---|---|---|
| [Semantic Scholar](https://www.semanticscholar.org) | Citation quality analysis (Highly Influential Citations), TLDR summaries, 200M+ paper index | Yes |
| [Connected Papers](https://www.connectedpapers.com) | Visual exploration of related fields from a seed paper (similarity-based, not citation graph) | 5 graphs/month |
| [OpenReview](https://openreview.net) | Read reviewer comments and scores for ICLR and other conferences directly | Yes |
| [HF Daily Papers](https://huggingface.co/papers) | Daily trending AI papers, community voting | Yes |
| [CodeSOTA](https://www.codesota.com) | Spiritual successor to PWC, SOTA leaderboard (with reproduction verification) | Yes |
| [ar5iv](https://ar5iv.labs.arxiv.org) / arXiv HTML | HTML version of papers, easier to read and search than PDF | Yes |
| [DBLP](https://dblp.org) | Verify author publication records, browse conference paper lists | Yes |

### Recommended Workflow

```
Discovery ──→ HF Daily Papers / Semantic Scholar / X
  ↓
Screening ──→ Authors, institutions, conference acceptance tags
  ↓
Evaluation ──→ OpenReview reviewer comments / S2 citation quality
  ↓
Exploration ──→ Connected Papers related work / DBLP author records
  ↓
Verification ──→ CodeSOTA / GitHub / HF Models for implementations
```

## Red Flag List

### The Paper Itself

| Red Flag | Why It's a Problem |
|---|---|
| Related work cites non-existent papers | AI-generated artifact; entire paper's credibility drops to zero |
| Tested only on self-created datasets | Cannot fairly compare with other methods |
| No ablation study | Unknown which component actually contributes |
| Reports only the most favorable metric | Selective reporting |
| No error bars / confidence intervals | Results may be random fluctuation |
| Baselines over 2 years old | Unfair comparison |
| Claims to greatly surpass SOTA but no code | Cannot be verified |
| Large discrepancy between abstract and results table numbers | Over-packaging |

### arXiv-Specific Pitfalls

- **Version bombing**: Frequent version updates in a short period, possibly silently fixing discovered issues
- **Moved to general category**: Usually a moderator's downgrade action
- **Self-citation inflation**: Heavily citing one's own prior unreviewed arXiv papers
- **Citation cartels**: A group of authors mutually citing each other to inflate numbers -- according to a [arXiv 2509.07257](https://arxiv.org/html/2509.07257v2) investigation, citation cartels are already a systemic problem in academic publishing

## ML Reproducibility: 63.5% Success Rate

According to Raff (2019), the success rate of independently reproducing 255 papers was only 63.5% ([Princeton reproducibility crisis page](https://reproducible.cs.princeton.edu)). Main reasons: missing code, unreported hyperparameters, random seed effects, and framework version differences.

[arXiv 2407.12220](https://arxiv.org/pdf/2407.12220v1) lists 43 Questionable Research Practices (QRPs), the most common of which include:

- **Train/test leakage**: Training data contaminating the test set
- **Benchmark contamination**: LLM pre-training data may have already seen benchmark data
- **Unfair baseline comparisons**: Carefully tuning hyperparameters for one's own model while using defaults for baselines
- **Selective metric reporting**: Only reporting the best-performing metric

NeurIPS has adopted the [ML Reproducibility Checklist](https://arxiv.org/html/2605.17273v1), and the REFORMS framework provides a comprehensive checklist covering 8 modules and 32 items ([arXiv 2308.07832](https://arxiv.org/pdf/2308.07832v2.pdf)).

## Practical Checklist: What to Check After Reading an arXiv ML Paper

Synthesized from the REFORMS checklist, ML Reproducibility Checklist, and [CodeSOTA guide](https://www.codesota.com/guides/reading-ml-papers):

**Datasets**
- [ ] Uses standard benchmarks for the task
- [ ] Data preprocessing has sufficient detail to reproduce
- [ ] Train/val/test splits are standard or custom (and justified)

**Baselines**
- [ ] Baselines are recent (within 12-18 months)
- [ ] Baselines are run by the authors themselves, not copied from other papers
- [ ] Baselines use the same compute budget

**Metrics & Statistics**
- [ ] Reports all standard metrics for the task
- [ ] Includes error bars or confidence intervals
- [ ] Reports computational cost and inference speed

**Reproducibility**
- [ ] Code is publicly available
- [ ] Hyperparameters are fully listed
- [ ] Training hardware and duration are disclosed

**Integrity**
- [ ] Includes data leakage / contamination analysis
- [ ] Shows failure cases (not just successes)
- [ ] Limitations section honestly discusses constraints
- [ ] Ablation study tests all key components

Per CodeSOTA's recommendation: if more than 3 items are unchecked, treat the results as "preliminary and unverified."

## The Big Picture

Judging the quality of arXiv papers is a skill that requires practice. The core principle: **arXiv's threshold only filters format; quality judgment is up to you**.

The most efficient approach is to start screening with external signals (conference acceptance, institution, open source), then use the checklist to closely examine the experimental design of papers that pass initial screening. Tools will change (the shutdown of PWC is the best example), but the judgment logic of "checking whether baselines are fair, whether ablations are complete, and whether results are reproducible" will not.

## References

- [arXiv Endorsement System](https://info.arxiv.org/help/endorsement.html)
- [arXiv Moderation Policy](https://info.arxiv.org/help/moderation/index.html)
- [Scientific American -- ArXiv.org Reaches a Milestone and a Reckoning](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning)
- [DORA Declaration -- San Francisco Declaration on Research Assessment](https://sfdora.org/read)
- [Semantic Scholar Open Data Platform (arXiv 2301.10140)](https://ar5iv.labs.arxiv.org/html/2301.10140)
- [Connected Papers](https://www.connectedpapers.com)
- [OpenReview](https://openreview.net)
- [Hugging Face Daily Papers](https://huggingface.co/papers)
- [CodeSOTA -- Papers with Code Shutdown Record and Alternatives](https://www.codesota.com/papers-with-code)
- [CodeSOTA -- How to Read an ML Paper](https://www.codesota.com/guides/reading-ml-papers)
- [TIB-Blog -- Papers with Code went offline](https://blog.tib.eu/2025/10/02/papers-with-code-went-offline-the-knowledge-doesnt-have-to)
- [Questionable Practices in Machine Learning (arXiv 2407.12220)](https://arxiv.org/pdf/2407.12220v1)
- [REFORMS Checklist (arXiv 2308.07832)](https://arxiv.org/pdf/2308.07832v2.pdf)
- [State-of-the-Art Claims Require State-of-the-Art Evidence (arXiv 2605.17273)](https://arxiv.org/html/2605.17273v1)
- [Princeton -- Leakage and the Reproducibility Crisis in ML-based Science](https://reproducible.cs.princeton.edu)
- [How Not to Do Machine Learning (arXiv 2108.02497)](https://arxiv.org/pdf/2108.02497)
- [arXiv HTML Accessibility Announcement](https://blog.arxiv.org/2023/12/21/accessibility-update-arxiv-now-offers-papers-in-html-format)
- [Fraudulent Publishing in the Mathematical Sciences (arXiv 2509.07257)](https://arxiv.org/html/2509.07257v2)
