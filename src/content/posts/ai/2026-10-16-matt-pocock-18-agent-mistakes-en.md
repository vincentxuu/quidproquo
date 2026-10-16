---
title: "You May Be Tired in the Wrong Place: How to Read Matt Pocock's 18 Agent Mistakes"
date: 2026-10-16
type: deep-dive
category: ai
tags: [coding-agent, agent-skills, harness-engineering, context-engineering, matt-pocock]
lang: en
tldr: "Matt Pocock posted 18 'mistakes you might be making' on X with no explanations. Grouped against his public skills and talks, they fall into five: verification, letting go, context, alignment, thinking. Six map directly onto /retro's check categories, so you can try one session tonight."
description: "Group Matt Pocock's October 13 list of 18 coding-agent mistakes into five clusters, map them to his skills, the Pragmatic Engineer interview and /retro, and get a self-diagnosis plus three steps for tonight."
draft: false
glossary:
  - term: "retro"
    aliases: ["/retro"]
    definition: "A skill in Matt Pocock's skills repo that reads a coding session and suggests improvements to the agent's environment (navigation, automated checks, coding standards, steering files, tool cost, information access). It only suggests; it never applies."
    context: "Used here to show how a mistake on the list becomes a check that stops it from happening again."
  - term: "tautological test"
    definition: "A test that passes however the code is written, for example the implementation sets a limit of 280 and the test asserts the limit is 280."
    context: "Used here to explain what 'your architecture allows bad tests to be written' means."
---

> 🌏 [中文版](/posts/ai/2026-10-16-matt-pocock-18-agent-mistakes)

If you work with a coding agent every day and still feel worn out, this post is a self-diagnosis sheet: how Matt Pocock's 18-item list groups, which of his public practices each group maps to, and which item to fix first tonight.

## What the list is

[Matt Pocock](https://x.com/mattpocockuk) wrote [Total TypeScript](https://www.totaltypescript.com/) and has spent the last year or so teaching people to work with coding agents. His [skills repo](https://github.com/mattpocock/skills) is MIT-licensed, was created in February 2026 and now has over 290,000 stars. Its README describes the skills as what he uses daily for "real engineering, not vibe coding."

On October 13 he posted [this list](https://x.com/mattpocockuk/status/2109973273924579720) on X: 18 lines, each starting "You're…" or "Your…", with no explanation. The grouping below is therefore my reading. The practices behind each group come from his skills repo, the [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), and a [secondhand write-up](https://finance.biggo.com/news/4884c941b185405c) of his AI Engineer talk.

| Group | Items on the list | In one line |
|---|---|---|
| Verification | Automated checks too lax; not enough automated review; agent can't verify its own work; architecture allows bad tests; not reviewing past sessions | The faster agents write, the more the bottleneck moves to checking |
| Letting go | Effort level too high; too much human review; not enough vibe-coded prototypes; babysitting the agent | Move from watching every line to designing the checks |
| Context | Skills too long; custom tooling wastes tokens; global steering files overloaded; codebase hard to navigate | Agent attention is a budget |
| Alignment | Not aligning before work; aligning too often and too hard | Heavy up front, light in the middle |
| Thinking | No shared language; not thinking strategically; not thinking enough | Agents take the tactics; spend your brain on the high level |

## Two easy misreadings

**The paired items are deliberately opposite.** "Not aligning before you start" sits next to "aligning too often," and "not enough automated review" next to "too much human review." The answer is not at either end; it is where in the process you spend the effort.

**"Effort level" and "not thinking enough" are about different people.** The post doesn't expand on that item. In agent tools, effort usually means the model's reasoning setting, so I read it that way: the agent doesn't need to think that long on every task, while you should think more. That is why the first and last items look contradictory but aren't.

## Verification: the bottleneck moves downstream

Five items sit here, and they are the center of the list. In his talk Pocock calls the problem a "slop cannon": agents produce PRs faster than anyone can read them. His answer is three brakes, cheapest first: automated checks cost only CPU, automated review catches what checks miss, and human review is reserved for changes that matter.

"Checks too lax" is more than having no linter. The write-up lists three kinds of bad agent-written tests: the implementation sets a limit of 280 and the test asserts 280 (tautological); a test reads source code and asserts the order of sections, so reformatting breaks it; a test stubs out `AudioContext` entirely and can never fail. The fix for "architecture allows bad tests" is Ousterhout's deep modules: a small interface over a deep implementation, with tests written at the interface, leaves fewer tests tied to structure.

"Agent can't verify its own work" is the third problem in the README: without feedback the agent flies blind, and he wants static types, browser access and automated tests. In the interview he also says he now more often asks agents to produce proof that the code works, with or without TDD.

The last item, reviewing past sessions, is [`/retro`](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md), which moved from in-progress to the engineering category on September 24.

## Letting go: swap watching for checks

In the talk he borrows AWS's one-way and two-way doors: most PRs can be reverted after merge, so a light read is enough; an email blast to 60,000 people, an expensive migration or data loss deserves a line-by-line read. Another claim from the same talk is that a reviewer agent should commit fixes rather than leave comments, because comments just hand the work back to a person.

"Not enough prototypes" maps to the [`prototype`](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md) skill: build a throwaway version to answer one design question. That doesn't conflict with the previous group; the line is whether it merges. Throwaway code doesn't need strict checks, code that reaches main does.

## Context: attention as a budget

`/retro` has a check category for each of the four items here: steering files, tool cost, navigation. Its text is blunt: `CLAUDE.md` and `AGENTS.md` are pushed into every agent's context and should be used "incredibly sparingly," usually only as pointers to other files. Coding standards go in a file read at review time, not into the implementing agent, which is already exploring, editing and debugging.

It is also why he keeps skills small; the README says "small, easy to adapt, composable."

## Alignment: heavy up front, light in the middle

The README lists "the agent didn't do what I want" as the first failure mode, and the fix is [`/grill-with-docs`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md), where the agent questions you one decision at a time; he recommends it for every change. For the other end, "aligning too often," see Daniel Mackay's [guide to choosing a workflow](https://www.dandoescode.com/blog/matt-pococks-skills-choosing-the-right-workflow): work that fits in one session doesn't need a spec added "for safety." Whether to add another round of alignment depends on whether the work fits in one context window.

## Thinking: a shared language is the cheapest compression

The README's example collapses "a lesson inside a section of a course is made 'real,' given a spot in the file system" into one term: materialization cascade. Terms live in `GLOSSARY.md`; naming becomes consistent, the codebase is easier to navigate, and the agent spends fewer thinking tokens. His analogy in the interview is *Memento*: the agent wakes up every day not remembering you, so optimize the codebase for a newcomer every time.

## A worked example: from a bad test to never seeing it again

Say you spot a test in review that asserts a limit of 280 because the implementation says 280.

1. Classify it: a mechanical, fixed-pattern error, or a judgement call? `/retro`'s rule is that mechanical errors always become deterministic checks (a custom lint rule, pre-commit hook or CI job), and only judgement calls go into `CODING_STANDARDS.md` for the reviewer to read.
2. A tautological test is hard to catch with lint, so write it as a standard: "assertions come from requirements, not copied from the implementation."
3. Next time the review agent catches it and you don't write the same comment twice. In Pocock's words, you never want to write the same comment twice.

## Limits

- The list has no explanations and no priority; it is a diagnostic, not a prescription. The grouping and reading of each item is mine, assembled from his public practices.
- For the talk I read a secondhand write-up, so treat quotes from it as the write-up's.
- `/retro` only suggests and never applies; Mackay warns that it can invent generic advice to fill categories, so drop anything you can't trace to a specific moment in the session.
- The skills change fast (Mackay's article is based on v1.3.1); command names and categories may move, so read the README before installing.

## How to use it: three steps tonight

1. Mark each of the 18 with a check or a cross and pick only the two that hurt most.
2. Take a session you just finished: install with `claude plugin install mattpocock-skills@claude-plugins-official`, run `/setup-matt-pocock-skills` once in the repo, then run `/retro`. Without Claude Code, ask the agent to read the session log through `/retro`'s seven categories.
3. Find a review comment you've written repeatedly and turn one into a check (lint, type or test) instead of reminding again.

If you want to systematize the verification half, there is an outside course on the same bottleneck: [GenAI 時代下的測試管理](https://agile3uncles.com/products/t004/) (Agile 3 Uncles, 2026/11/22, in Chinese), whose description centers on the bottleneck moving from writing code to verification and trust. It is another instructor's course, not Pocock's content.

Related on this site: [Poteto's Trust Ladder: Let the Agent Verify Itself Before You Let Go](/posts/ai/2026-10-07-poteto-trust-ladder-verification-first-en) and [How to use pstack](/posts/ai/2026-10-16-pstack-cursor-agent-skills-guide-en).

## References

- [Matt Pocock's 18-item list (X, 2026-10-13)](https://x.com/mattpocockuk/status/2109973273924579720)
- [mattpocock/skills (GitHub, MIT)](https://github.com/mattpocock/skills)
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md)
- [AI Skills with Matt Pocock (The Pragmatic Engineer, 2026-09-17)](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock)
- [Matt Pocock: The Fix for AI's 'Slop Cannon' Is Teaching Your Reviewer to Commit (BigGo Finance, secondhand write-up of the talk)](https://finance.biggo.com/news/4884c941b185405c)
- [Matt Pocock's Skills: Choosing The Right Workflow (Dan Does Code)](https://www.dandoescode.com/blog/matt-pococks-skills-choosing-the-right-workflow)
- [GenAI 時代下的測試管理 (Agile 3 Uncles, in Chinese)](https://agile3uncles.com/products/t004/)
