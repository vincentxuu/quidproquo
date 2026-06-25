---
title: "How to Classify Code Review Comments? From Conventional Comments to AI Review Tool Taxonomies"
date: 2026-03-26
type: guide
category: tech
tags: [code-review, conventional-comments, ai-code-review, coderabbit, github-copilot, sonarqube, dx]
lang: en
tldr: "Three main classification systems dominate: Conventional Comments (label-based), Google's severity prefixes (Nit/Optional/FYI), and SonarQube's four quadrants (Bug/Vulnerability/Code Smell/Hotspot). AI review tools have each developed their own taxonomies, but the core dimensions consistently converge on four areas: correctness, security, performance, and maintainability."
description: "A structured overview of mainstream code review comment classification standards (Conventional Comments, Google Eng Practices, SonarQube), comparing the taxonomies and design philosophies of six major AI code review tools, with recommended classic articles and academic research."
draft: false
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-26-code-review-comment-classification)

The most common problem with code review comments: the reviewer thinks it's a blocking issue, but the author treats it as a suggestion and moves on. It's not anyone's fault — the comment itself carries no classification signal, so each side interprets it differently.

This post covers three things: the mainstream comment classification standards, how AI review tools each categorize feedback, and a curated list of classic articles and research worth reading.

## Three Mainstream Classification Standards

### Conventional Comments — The Most Widely Adopted Label System

From [conventionalcomments.org](https://conventionalcomments.org/), the format is `<label> [decorations]: <subject>`.

Seven core labels:

| Label | Description | Blocking? |
|-------|-------------|-----------|
| `praise` | Recognize something done well | N/A |
| `nitpick` | Minor, trivial changes | Non-blocking |
| `suggestion` | Concrete improvement proposals | Context-dependent |
| `issue` | Problems the user will encounter | Blocking |
| `question` | Unsure if there's an issue — asking first | Non-blocking |
| `thought` | Extended ideas worth considering | Non-blocking |
| `chore` | Tasks that must be done before merging | Blocking |

Decorations eliminate ambiguity: `(blocking)` means must fix, `(non-blocking)` means suggested but not required, `(if-minor)` means do it while you're at it if it's small.

```
suggestion (blocking): Please rewrite this SQL query as a parameterized query to prevent injection attacks.
```

The value of this system is that it forces reviewers to decide at the moment of writing whether something is actually blocking or not.

### Google Engineering Practices — Lightweight Severity Prefixes

Google's [eng-practices](https://google.github.io/eng-practices/review/reviewer/comments.html) uses three prefixes:

| Prefix | Meaning |
|--------|---------|
| `Nit:` | Technically should be fixed but not critical |
| `Optional:` / `Consider:` | Suggested but not required |
| `FYI:` | For reference; not expected to be addressed in this PR |

The core principle: reviews should ask "does this code improve the overall health of the codebase?" — not aim for perfection. Don't block a PR over nits. Google's review turnaround time is about 4 hours, achieved by keeping changes small (35%+ modify only one file).

### SonarQube — Rule-Driven Four-Quadrant Classification

With 6,500+ rules across 35+ languages, SonarQube is the most mature static analysis taxonomy in the industry.

| Type | Description | Target False-Positive Rate |
|------|-------------|---------------------------|
| **Bug** | Causes runtime errors | Near 0% |
| **Vulnerability** | Exploitable by attackers | <20% |
| **Security Hotspot** | Security-sensitive, requires human judgment | Needs review |
| **Code Smell** | Maintainability issues | Near 0% |

Five severity levels: BLOCKER → CRITICAL → MAJOR → MINOR → INFO.

SonarQube 10.3+ began transitioning toward Clean Code attributes and software quality dimensions (Reliability / Security / Maintainability), gradually replacing the older classification.

### Informal but Universally Understood Prefixes

| Prefix | Meaning |
|--------|---------|
| `nit:` | Cosmetic, not worth blocking over |
| `LGTM` | Looks Good To Me |
| `PTAL` | Please Take Another Look |
| `TODO:` | To be handled later |
| `FIXME:` | Something broken that needs immediate attention |
| `ACK` / `NAK` | Acknowledged / Not Acknowledged (common in the Linux kernel) |

## AI Code Review Tool Taxonomies

### Claude Code Review — Quality Over Quantity

Only three severity levels, with correctness-only as the default:

| Marker | Category | Description |
|--------|----------|-------------|
| 🔴 | Normal | Bugs that would affect production |
| 🟡 | Nit | Minor issues worth fixing but non-blocking |
| 🟣 | Pre-existing | Bugs that predate this PR |

Multiple agents analyze in parallel, a validation step filters out false positives, and comments are deduplicated and ranked before being posted. It doesn't touch formatting preferences or test coverage — unless you explicitly request it in a `REVIEW.md`. Every finding includes extended reasoning explaining why it was flagged.

### CodeRabbit — Comprehensive Coverage

Dual-axis classification: type × severity.

Three feedback types: ⚠️ Potential issue, 🛠️ Refactor suggestion, 🧹 Nitpick (Assertive mode only).

Four severity levels (agent layer): Critical → High → Medium → Low.

A distinctive feature is that it also generates positive feedback (praise), and integrates with Jira/Linear for ticket compliance checks. The tradeoff is noise — independent benchmarks found approximately 28% of comments to be noise or based on incorrect assumptions.

### GitHub Copilot Code Review — Zero Setup but Surface-Level

Five domains: Security, Performance, Code Quality, Architecture & Design, Testing & Documentation.

The advantage is zero configuration; the downside is limited depth. It tends toward surface-level suggestions (naming, formatting, common best practices). Research found it missed all security vulnerabilities across 117 files; another test showed that 31 of 47 suggestions were things ESLint would catch, and 7 were outright wrong.

### Qodo PR-Agent — Highly Configurable

Open-source core where every dimension can be toggled. Auto-labels include `possible security issue`, `review effort [1-5]`, and `ticket compliance`. Each issue is categorized by quality dimension (reliability / maintainability / security), with remediation prompts you can paste directly into an AI tool to fix.

Configurable review sections: PR score, whether tests are included, review effort estimation, and suggestions to split the PR.

### Greptile — High Signal-to-Noise Ratio

Its categories are similar to other tools (Critical Bugs / Refactoring / Performance / Validation / Nitpicks), but it deliberately limits the number of comments. Each comment carries a confidence score — it would rather say less than generate false positives. Full codebase indexing enables it to catch cross-layer issues.

## Review Dimension Coverage Comparison

| Dimension | Claude | CodeRabbit | Copilot | Qodo | SonarQube | Greptile |
|-----------|--------|-----------|---------|------|-----------|---------|
| Bug / Correctness | ✅ Core | ✅ | ✅ | ✅ | ✅ | ✅ |
| Security Vulnerabilities | ✅ | ✅ | ⚠️ Weak | ✅ | ✅ Strongest | ✅ |
| Performance | Extensible | ✅ | ✅ | ✅ | ✅ | ✅ |
| Maintainability | Extensible | ✅ | ✅ | ✅ | ✅ Core | ✅ |
| Style / Formatting | Off by default | Assertive mode | ✅ | Configurable | ✅ | Low priority |
| Test Coverage | Off by default | ❌ | ✅ | ✅ | ✅ | ❌ |
| Pre-existing Issue Flagging | ✅ 🟣 | ❌ | ❌ | ❌ | ✅ | ❌ |
| Positive Feedback | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ticket Compliance | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Design Philosophy Comparison

| Tool | Philosophy |
|------|------------|
| Claude Code Review | Precision over recall — defaults to correctness only, uses a validation step to filter false positives |
| CodeRabbit | Comprehensive coverage — deep multi-dimensional analysis at the cost of higher noise |
| Copilot | Low friction — zero-config GitHub integration, broad but shallow |
| Qodo | Configurable — open-source core, every dimension can be toggled and customized |
| SonarQube | Rule-driven — 6,500+ deterministic rules, AI as a supplement |
| Greptile | High signal-to-noise — prefers saying less over generating false positives, includes confidence scores |

Research from three major companies — Google (9 million reviews), Microsoft (50,000+ developers), and Meta experiments — all converge on the same conclusion: for code review to scale, the core value should be knowledge sharing, letting automation handle what doesn't require human judgment.

## Recommended Classic Articles and Research

### Academic Papers

- [Modern Code Review: A Case Study at Google (2018)](https://sback.it/publications/icse2018seip.pdf) — Analysis of 9 million reviews; primary value is knowledge transfer, not bug catching
- [Expectations, Outcomes, and Challenges of Modern Code Review](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ICSE202013-codereview.pdf) — The gap between expectations and actual outcomes
- [Characteristics of Useful Code Reviews at Microsoft](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/bosu2015useful.pdf) — What makes a review actually useful
- Code Reviews Do Not Find Bugs (2015) — Challenges conventional wisdom; the primary value of review isn't bug detection

### Engineering Practice

- [Google Engineering Practices](https://google.github.io/eng-practices/review/) — Google's official review guide
- [Good Code Reviews, Better Code Reviews](https://blog.pragmaticengineer.com/good-code-reviews-better-code-reviews/) — Real-world experience from Uber and Microsoft
- [How to Make Good Code Reviews Better](https://stackoverflow.blog/2019/09/30/how-to-make-good-code-reviews-better/) — Stack Overflow on empathy in reviews
- [How to Do Code Reviews Like a Human](https://mtlynch.io/human-code-reviews-1/) — Review is a social interaction, not just a technical process
- [30 Proven Code Review Best Practices from Microsoft](https://www.michaelagreiler.com/code-review-best-practices/) — Dr. Michaela Greiler's Microsoft research
- [Unlearning Toxic Behaviors in a Code Review Culture](https://medium.com/@sandya.sankarram/unlearning-toxic-behaviors-in-a-code-review-culture-b7c295571a2c) — Teaching good practices through counterexamples

### Resource Collections

- [awesome-code-review](https://github.com/joho/awesome-code-review) — The most comprehensive code review resource list
- [Conventional Comments](https://conventionalcomments.org/) — Structured comment standards
- [CHECK Framework](https://elijahmanor.com/blog/check-pull-request-review-comments) — Curious, Helpful, Exact, Clear, Kind — training review tone

## The Bottom Line

The classification system itself isn't the point. What matters is that the team has shared agreement on "does this comment need to be addressed."

The lowest-cost approach: use the `nit:` prefix to distinguish blocking from non-blocking — that alone solves 80% of the problem. For something more complete, adopt Conventional Comments. AI tool classifications are useful as reference, but don't expect them to replace your team's own judgment.

One interesting data point: CodeRabbit found that AI-generated code has 1.7x more issues per PR than human-written code, with 75% more logic errors. AI writing code and AI reviewing code is already reality — but the final line of defense for classification and judgment is still human.

## References

- [Conventional Comments](https://conventionalcomments.org/)
- [Google Engineering Practices — Review Comments](https://google.github.io/eng-practices/review/reviewer/comments.html)
- [SonarQube Documentation](https://docs.sonarsource.com/sonarqube/)
- [Claude Code Review Official Docs](https://docs.anthropic.com/en/docs/claude-code/github-actions#code-review)
- [CodeRabbit](https://coderabbit.ai/)
- [Qodo PR-Agent](https://github.com/Codium-ai/pr-agent)
- [Greptile](https://www.greptile.com/)
- [Modern Code Review: A Case Study at Google (2018)](https://sback.it/publications/icse2018seip.pdf)
- [awesome-code-review](https://github.com/joho/awesome-code-review)
