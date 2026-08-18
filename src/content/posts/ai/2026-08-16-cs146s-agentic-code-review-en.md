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

## Why the course treats review as high leverage

The matching Fall 2025 session was Week 7, "AI code review" ([slides](https://docs.google.com/presentation/d/1NkPzpuSQt6Esbnr2-EnxM9007TL6ebSPFwITyVY-QxU/edit), with Graphite CPO Tomas Reimers as guest). It opens with three sets of numbers, sourced to [Coding Horror](https://blog.codinghorror.com/code-reviews-just-do-it/) — itself an assigned reading for the course:

- Code review has a **55–60%** error detection rate, versus **25–45%** for various testing modes
- One study compared defect density without and with review: **4.5 → 0.82 errors per 100 lines**
- An AT&T study found review brought a **14% productivity increase and a 90% decrease in defects**

**All three are numbers for human review**, nothing to do with AI. The course uses them to establish a premise: review itself is enormously valuable, so the question is never whether to review, but who does it and how well.

The course sorts what review should catch into five categories: logic and correctness, readability and maintainability, performance, security, and best practices — including a codebase's own idioms and database access patterns (the slide's example: "use this service rather than a direct DB lookup").

It also gives four conditions for a good review comment: provide specific details, reference specific code or issues, **suggest a resolution**, and cite evidence or provide an explanation. The counterexample is a comment that says only "This won't work." Those same four work as a rubric for judging an AI reviewer's output.

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

The syllabus explicitly says "what AI review catches well, and what it misses." The Fall 2025 slides give a limitations list that is sharper than the boundary I would have drawn myself:

> - More configuration/setup
> - False positives — "Have to train the system → continuous learning"
> - **Can't yet catch the idioms and repo best practices**
> - Can't handle complex business logic and architecture decisions — "But that's where humans are still needed"
> - Must be extra cautious with security changes
> - Often misses edge cases

"Can't catch the idioms and repo best practices" is the one to sit with, because it **directly collides** with the fifth of the course's own five categories — internal conventions and best practices are exactly where a human reviewer adds the most, and exactly where AI is currently weakest.

The course adds two operational rules: **explicitly tell it what not to review**, and be especially careful with changes touching user input, authentication, file operations, and network requests.

The line between diff-only tools and tools that index the whole codebase falls here too — the former can't see how a change ripples through the rest of the system.

One caution: the "bug catch rate" comparisons circulating online (82% for this tool, 44% for that one) come almost entirely from tool-comparison and affiliate content **with no published test set or reproducible method**, so this post doesn't cite them. If you're picking a tool, running it over your own last twenty PRs beats any leaderboard.

## Three rules for the PR workflow

**One: the instance that wrote the code doesn't review it.** This appeared in [Week 2's RePPIT](/posts/ai/2026-08-16-cs146s-context-engineering-en) and is worth repeating: a model defends its initial implementation, "like proofreading your own writing and reading what you meant to type." Switch model families, or at minimum wipe the context.

**Two: rank findings, don't dump them.** RePPIT's Test step sorts findings into must-fix, should-fix, and nice-to-have. That ranking is the cheapest available defense against Google's "correct but low-value" problem — it doesn't delete comments, it tells people which ones they can skip.

**Three: a passing AI review is not permission to merge.** The biggest risk of a green checkmark isn't the bugs it missed; it's that human reviewers relax. Google's system ran for over two years and still lands around a 40% resolution rate.

The course puts it harder than I would, on the deck's final line:

> Code review is more important now than ever with AI coding systems — **You own the code that is merged and shipped, no blaming of the AI**

That single sentence answers both accountability and process design.

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
- [AI code review](https://docs.google.com/presentation/d/1NkPzpuSQt6Esbnr2-EnxM9007TL6ebSPFwITyVY-QxU/edit) — Fall 2025 Week 7 slides, with review effectiveness numbers and the course's limitations list
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, on the boundary between deterministic checks and model judgment
