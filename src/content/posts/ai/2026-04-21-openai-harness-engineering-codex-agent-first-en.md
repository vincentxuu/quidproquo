---
title: "OpenAI Wrote 1 Million Lines of Code with Codex: Harness Engineering in Practice"
date: 2026-04-21
type: guide
category: ai
tags: [harness-engineering, codex, openai, agent-first, agents-md, agentic-coding]
lang: en
tldr: "An OpenAI internal team spent 5 months with 3 people and 0 lines of hand-written code, delivering a complete product using Codex. This article distills their core lessons on AGENTS.md design, repo-local knowledge bases, architecture enforcement, and entropy management."
description: "OpenAI's firsthand account of agent-first development with Codex: AGENTS.md should be a TOC not an encyclopedia, all knowledge must live in the repo, architecture invariants should be enforced by linters, and garbage collection agents combat code entropy."
draft: false
series:
  name: "AI Agent 實戰"
  order: 8
---

> 🌏 [中文版](/posts/ai/2026-04-21-openai-harness-engineering-codex-agent-first)

OpenAI engineer Ryan Lopopolo published a firsthand report in early 2026 describing how their internal team built a complete product using Codex: a 3-person team, 5 months, 0 lines of hand-written code, approximately 1 million lines of code produced, averaging 3.5 PRs merged per person per day. This wasn't a proof of concept — it was a real product that shipped. This article distills their core understanding of the agent-first development model from that experience.

## The Engineer's Role Is No Longer "Writing Code"

Traditionally, an engineer's job is to write code that solves problems. Under the agent-first model, this definition has changed.

Lopopolo describes it as: the engineer's job has become three things — designing an environment where the agent can succeed, clearly expressing intent, and building feedback loops so the agent can self-correct. Codex is the one actually writing code, while the human's responsibility is ensuring Codex has a good enough environment and information.

This shift introduces a critical mental reframe: when the agent gets stuck or produces incorrect output, you shouldn't ask "How can I prompt harder to make it succeed?" but rather "What capability does this task require? What is it currently missing?" The former works around the problem; the latter actually solves it. Adding the missing capability to the environment (tools, documentation, tests, linters) benefits all similar tasks going forward, rather than fixing just this one instance.

## AGENTS.md: Table of Contents, Not an Encyclopedia

AGENTS.md is the primary context file that Codex reads, telling the agent what this repo is and how it works. Many teams' instinct is to cram everything into it, but the Harness team's experience is: doing so actually makes it less effective.

The reasoning is straightforward: when the file gets too long, important information gets diluted. When an agent reads a 1,000-line AGENTS.md, the truly critical 10 lines carry the same weight as the other 990. Moreover, long files quickly become stale — every code change requires a corresponding update, and nobody can keep up with that.

Their solution was to keep AGENTS.md to around 100 lines, serving only one role: Table of Contents. It points to real knowledge rather than containing it. All technical details, design decisions, and architecture documentation live in the `docs/` directory as standalone design documents, execution plans, product specs, and similar artifacts. AGENTS.md simply tells the agent: "If you need to work on X, see `docs/X.md`."

The benefit is that each document has a clear scope, and updates only require changing the relevant file.

## Knowledge Must Live in the Repo

This is the most concrete and actionable principle in the entire approach: all knowledge the agent needs must be in the repo.

Slack messages are invisible to the agent. Google Docs are invisible to the agent. Tribal knowledge passed by word of mouth is even more invisible. If a design decision only lives in meeting notes or a chat thread, it doesn't exist as far as the agent is concerned. The result is the agent produces implementations that look reasonable but actually violate an important decision, and only the reviewer catches the problem.

The Harness team's approach was to systematically write all knowledge into the `docs/` directory, including architecture designs, technical debt explanations, known limitations, and rationales behind past decisions. They went further by building a CI linter for these documents to ensure cross-links don't go stale — if one document references another, CI verifies the target link actually exists.

They even have a doc-gardening agent that periodically scans documents, identifies outdated or inconsistent content, and automatically opens PRs to fix it. Document quality itself was brought into the automated pipeline.

## Architecture Constraints Rely on Linters, Not Documentation

Documentation alone saying "don't do this" is insufficient. The agent reads the documentation and might comply, or might ignore it amid complex tasks. The more fundamental problem is: documentation has no enforcement power.

The Harness team's solution was to convert architecture invariants into CI-enforced rules. Their codebase has a clear dependency direction: types → config → repo → service → runtime → UI, where each layer can only depend on layers beneath it, never in reverse. This rule exists as a custom linter — violations fail CI.

The linter itself was also written by Codex. This is a compelling demonstration: using an agent to build tools that constrain agent behavior. Once rules are expressed in code, they can't be forgotten, don't require humans to remember them, and don't depend on someone catching violations during code review.

## A Shift in Merge Philosophy: Trade-offs at High Throughput

When each person merges 3.5 PRs per day, traditional CI strategies start creating friction. Flaky tests at normal throughput are an annoying but tolerable problem; at high throughput, they become a real blocker.

The Harness team's approach: handle flaky tests with retries, don't block PRs. Their reasoning is that in this model, fixing bugs is cheaper than being blocked waiting because of flaky tests. This doesn't mean accepting unstable tests — it means adjusting the priority order. Let PRs merge first, then separately track and fix the unstable tests.

This is an example of recognizing that throughput has changed and making corresponding process adjustments.

## Code Entropy Generated by Agents

Agents are excellent at copying existing patterns. The problem is, they copy not just good patterns but bad ones too. A deprecated but not-yet-cleaned-up helper function looks the same to the agent as an actively used one. Old import paths, outdated API usage, inconsistent naming — all are sources of entropy that agents may copy and spread.

High throughput accelerates this problem. In a 1-million-line codebase, entropy accumulates far faster than 3 people can manually clean up.

Their solution was a garbage collection agent that periodically scans the codebase, identifies patterns that should be cleaned up, and automatically opens refactor PRs. Humans only need to spend less than a minute reviewing these PRs — confirm they look good and merge. The cleanup work itself is automated, rather than relying on engineers to remember to do it.

## Where Does Automation End?

Lopopolo described the degree of automation they've currently achieved: a prompt goes in, and the subsequent flow is — reproduce the bug, record the issue on video, implement the fix, record the fix on video, open a PR, respond to reviewer comments, and merge. Throughout the entire flow, only when genuine judgment is needed does it escalate to human intervention.

This isn't "AI helps me auto-complete some steps" — it's "the entire flow defaults to running via AI, with humans intervening only at critical checkpoints." The difference between these two is significant: the former is an assistive tool; the latter is a structural redesign of roles.

## The Big Picture

The core trade-off of Harness Engineering is: shifting engineers' time from "writing code" to "designing systems that enable agents to write good code." This requires upfront investment — building good documentation structure, writing linters, designing reliable feedback loops. These efforts don't produce immediately visible output, but they're the infrastructure that enables agents to maintain quality over the long term.

It also reveals a limitation: this approach demands far higher standards for repo health and knowledge management than traditional development. If docs are incomplete, architecture rules aren't CI-enforced, and knowledge is scattered outside the repo, agent output quality will decline rapidly, and the problems are hard to trace back to their root causes.

For teams wanting to adopt this approach, the most important preparation isn't choosing which agent tool to use — it's asking: "Does our repo have enough clearly documented knowledge for an agent to understand it?"

---

## References

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/de-DE/index/harness-engineering/) — Ryan Lopopolo, OpenAI (Feb 11, 2026)
- [OpenAI Codex CLI — Harness Engineering and AGENTS.md agent-first development foundation](https://github.com/openai/codex)
- [OpenAI introduces Codex: Agentic Coding and agent-first engineering model](https://openai.com/index/introducing-codex/)
- [Unrolling the Codex agent loop — Technical details of the Codex Harness Engineering agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
