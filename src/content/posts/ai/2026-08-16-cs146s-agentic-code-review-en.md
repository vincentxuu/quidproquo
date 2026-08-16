---
title: "CS146S Week 6: To Make AI Review Useful, Google Deleted 17 Rules First"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - code-review
  - agentic-coding
  - ai-agent
  - developer-experience
  - code-quality
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 7
tldr: "Google deployed AutoCommenter to tens of thousands of engineers and published the whole tuning process: suppressing 17 'technically correct but low-value' rules raised the useful ratio from 54% to 66%, with 80% set as the bar for the next rollout stage. Final comment-resolution rate landed around 40%. The bottleneck in AI code review was never detection — it's volume."
description: "Stanford CS146S Fall 2026 Week 6, 'Agentic Code Review': what Google's AutoCommenter paper measured about signal-to-noise in AI review, what such review covers and doesn't, and how to fit it into a team's PR workflow."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agentic-code-review)

This is the seventh post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 6 of Fall 2026.

Three topics: what AI review catches well and what it misses, review architectures and custom rules, and fitting AI review into a team's PR workflow. The guest is Cognition's Silas Alberti — who also appeared in Fall 2025, then on AI IDEs, now on code review.

That shift is telling. A year ago the talk worth booking was about how to write. Now it's about who checks.

## The one public dataset with real scale

There is no shortage of numbers about AI code review, but nearly all of them come from tool vendors or affiliate-marketing sites with no reproducible methodology. The public data actually worth discussing is Google's [AI-Assisted Assessment of Coding Practices in Modern Code Review](https://arxiv.org/abs/2405.13565) (AIware '24, assigned in Fall 2025 Week 7) — they deployed an LLM system called AutoCommenter to "tens of thousands of developers" and wrote down every pothole.

All figures below come from that paper.

**Comment volume was deliberately suppressed.** The system first filters comments landing on unchanged lines, dropping the rate of comments in changed files to 1.3%; switching to beam search (n=4) "tripled the posting frequency to 3.9%." Diversity improved too: the ten most frequent rules fell from 80% of all comments to 41%.

**Then they deleted rules.** This is the passage worth copying:

> First, the rater study identified 17 non-actionable URLs, whose suppression increased the historical useful ratio from 54% to 66% on developer feedback, and from 60% to 74% on rater feedback.

Suppressing five more got them to "our target useful ratio of 80% for the next stage of deployment." In other words — **they made an 80% useful ratio the gate for wider rollout, and the way they hit it was turning features off, not adding them.**

Their explanation is clear:

> Correct but low-value comments: A missing period at the end of a sentence in a code comment is often allowed by human reviewers. While technically correct, asking the author to go back to their IDE and fix the issue may provide net negative value.

**Technically correct, net negative.** That sentence belongs on the wall of every team about to adopt AI review.

**The final numbers are honest too.** Using 6,000 snapshot pairs they estimate a comment-resolution rate around 40%. The system covers 330 distinct rules and "covers 68% of historical human comments with a best practice URL" — two-thirds of the best practices human reviewers actually cite, and "many of these are out of scope for traditional static analyses."

The rollout pacing matters as well: an A/B experiment with half of all developers in July 2023, and only after confirming no adverse effects, full deployment in October 2023.

## What follows from those numbers

**One: the bottleneck is signal-to-noise, not capability.** Making the model find more is easy. Making it shut up is hard. A reviewer that's useful 60% of the time gets skipped within two weeks — and the real bugs it finds get skipped along with it.

**Two: the rule set must be individually disableable.** Google could fix this because they could identify *which 17 rules* were generating noise and turn those off. If your AI reviewer is a black box with no concept of rules, your only options are all-on and all-off.

**Three: AI review complements static analysis, it doesn't replace it.** That 68% figure describes coverage of things humans cite that **traditional static analysis cannot catch**. Anything a linter catches shouldn't be handed to a model — that's the job of [Week 5's deterministic validation loops](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en), which are faster, cheaper, and don't drift.

## The class it misses

The syllabus explicitly says "what AI review catches well, and what it misses." The most defensible current boundary:

| Catches well | Catches poorly |
|---|---|
| Style and convention drift | Cross-file architectural regressions |
| Obvious null and boundary errors | Business logic errors (code right, requirement wrong) |
| Missing tests and docs | Race conditions and concurrency |
| Single-file readability | "This abstraction will rot in three months" |

The line between diff-only tools and tools that index the whole codebase falls here too — the former can't see how a change ripples through the rest of the system.

One caution: the "bug catch rate" comparisons circulating online (82% for this tool, 44% for that one) come almost entirely from tool-comparison and affiliate content **with no published test set or reproducible method**, so this post doesn't cite them. If you're picking a tool, running it over your own last twenty PRs beats any leaderboard.

## Three rules for the PR workflow

**One: the instance that wrote the code doesn't review it.** This appeared in [Week 2's RePPIT](/posts/ai/2026-08-16-cs146s-context-engineering-en) and is worth repeating: a model defends its initial implementation, "like proofreading your own writing and reading what you meant to type." Switch model families, or at minimum wipe the context.

**Two: rank findings, don't dump them.** RePPIT's Test step sorts findings into must-fix, should-fix, and nice-to-have. That ranking is the cheapest available defense against Google's "correct but low-value" problem — it doesn't delete comments, it tells people which ones they can skip.

**Three: a passing AI review is not permission to merge.** The biggest risk of a green checkmark isn't the bugs it missed; it's that human reviewers relax. Google's system ran for over two years and still lands around a 40% resolution rate.

## What will go stale

- AutoCommenter's numbers come from a 2023–2024 deployment and several model generations ago; they describe the **shape of the problem**, not today's absolute performance
- Fall 2026's materials and assignment for this week aren't published
- Tool capability boundaries move fast; the table above needs periodic re-testing

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 6 topics and guest
- [AI-Assisted Assessment of Coding Practices in Modern Code Review](https://arxiv.org/abs/2405.13565) — Vijayvergiya et al., AIware '24, Google's AutoCommenter deployment and evaluation
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric, on finding severity and the no-self-review rule
- [How to Review Code Effectively](https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/) — GitHub Blog, assigned in Fall 2025 Week 7
- [Code Reviews: Just Do It](https://blog.codinghorror.com/code-reviews-just-do-it/) — Coding Horror, assigned in Fall 2025 Week 7
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, on the boundary between deterministic checks and model judgment
