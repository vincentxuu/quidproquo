---
title: "Loop Engineering: When AI No Longer Needs You to Write Prompts"
date: 2026-06-20
category: ai
type: deep-dive
tags: [loop-engineering, ai-agent, claude-code, prompt-engineering, harness-engineering, agentic-coding]
lang: en
tldr: "Loop Engineering is the practice of designing systems that automatically prompt AI agents, rather than prompting them manually. Boris Cherny runs hundreds of agents, Addy Osmani coined the term, and Blake Crosley identified verification cost as the real bottleneck — this article covers primary sources, the five building blocks, applicability boundaries, and criticisms."
description: "In June 2026, Loop Engineering became the hottest keyword in the developer community. This article compiles first-hand statements from Addy Osmani, Boris Cherny, and Peter Steinberger, analyzing the five building blocks, evolution timeline, applicability conditions, and known limitations."
draft: false
glossary:
  - term: "Loop Engineering"
    definition: "The engineering practice of designing automated feedback loops that let AI agents autonomously find work, execute, verify, and record state."
    context: "The main topic of this article. Formally named by Addy Osmani in June 2026."
  - term: "Harness Engineering"
    definition: "The practice of configuring a single agent's working environment (config files, hooks, skills) — one layer below Loop Engineering."
    links:
      - label: "Addy Osmani - Harness Engineering"
        url: "https://addyosmani.com/blog/harness-engineering/"
  - term: "Maker-Checker Split"
    aliases: ["Maker/Checker"]
    definition: "A design pattern that separates the executor (the agent writing code) from the verifier (the agent reviewing code)."
---

> 🌏 [中文版](/posts/ai/2026-06-20-loop-engineering)

In June 2026, three seemingly independent statements sent shockwaves through the developer community. [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) lead Boris Cherny said in his [Acquired Unplugged interview](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways): "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops." [OpenClaw](https://github.com/nicepkg/openclaw) creator Peter Steinberger posted: "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents." Google Chrome engineering lead [Addy Osmani](https://addyosmani.com/) then published an article that gave this pattern its name — [Loop Engineering](https://addyosmani.com/blog/loop-engineering/).

This article breaks down what Loop Engineering actually solves, what the five building blocks look like, when to use it, when not to, and the pitfalls practitioners have already discovered.

## From Prompt to Loop: Four Leaps in Abstraction

To understand why Loop Engineering erupted at this moment, trace how the developer-AI relationship has evolved:

| Year | Core Skill | Developer Role |
|------|-----------|----------------|
| 2023 | Prompt Engineering | Write precise prompts to get good AI responses |
| 2024 | Agent Orchestration | Orchestrate multiple agents for complex tasks |
| 2025 | [Harness Engineering](https://addyosmani.com/blog/harness-engineering/) | Configure agent environments via config files (CLAUDE.md, hooks) |
| 2026 | Loop Engineering | Design self-running feedback loops for autonomous agent work |

Each leap moves the developer one layer up. Cherny's own trajectory is the clearest example — per the [WorkOS interview summary](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways), he went from writing code in an IDE, to prompting Claude, to running 5-10 parallel Claude sessions, to "uninstalling his IDE in November 2024 because he hadn't opened it in a month," to now running hundreds of agents during the day and thousands at night.

Osmani positions Loop Engineering one floor above Harness Engineering in his [original article](https://addyosmani.com/blog/loop-engineering/):

> "Loop engineering sits one floor above the harness. The harness but it runs on a timer, it spawns little helpers, and it feeds itself."

The harness is a single agent's working environment; the loop adds a timer, sub-agents, and self-driving mechanisms on top.

## Defining Loop Engineering

Osmani provides a clear definition:

> "Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead."

A loop's operational logic:

```
Discover work → Assign to agent → Agent executes → Observe results → Verify correctness → Record state → Decide next step → Repeat
```

The loop runs continuously until the goal is met or a decision requiring human judgment is reached. The key distinction: a prompt is a one-shot trigger; a loop is a continuously self-driving system.

## Five Building Blocks + Memory Layer

Per Osmani's architecture, a complete loop comprises five components plus a memory layer. He specifically notes that both Claude Code and [OpenAI Codex](https://openai.com/index/codex/) now ship all five — "the shape is the same across products."

### 1. Scheduled Automations

The loop's trigger. Can be cron jobs, GitHub Actions, PR event webhooks, or product-native scheduling. Codex's Automations tab lets you configure project, prompt, frequency, and whether to run on a worktree; Claude Code's `/loop` and `/schedule` offer similar capabilities.

Osmani cites OpenAI's internal usage: daily issue triage, CI failure summaries, commit briefings, hunting bugs from the previous week.

### 2. Git Worktrees

Each agent works in an isolated git worktree — shared git history, no interference. This enables multiple agents to work in parallel on different tasks (one fixing bugs, one writing tests, one refactoring) without conflicts.

This is also why loops can run "while you sleep": worktree mode prevents agent work from being killed when you close your laptop.

### 3. Skills (Project Knowledge)

Through CLAUDE.md, AGENTS.md, and skill files, project conventions, standards, and workflows are encoded into agent-readable knowledge. Osmani references his earlier concept of [intent debt](https://addyosmani.com/blog/intent-debt/):

> "An agent starts every session cold and will fill any hole in your intent with a confident guess. A skill is intent written down."

Without skills, the agent re-derives your project conventions from scratch every cycle; with skills, knowledge compounds.

### 4. Plugins / MCP Connectors

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) connects agents to external tools: GitHub, Slack, databases, monitoring systems. Agents can interact with the entire development toolchain, not just read and write code.

### 5. Sub-agents

Separating the "maker" (executor) from the "checker" (verifier). This is the most critical design decision in a loop. Osmani explains why:

> "The reason it matters specifically inside a loop is the loop runs while you are not watching, so a verifier you actually trust is the only reason you can walk away."

Claude Code's `/goal` implements this — a separate model judges whether the loop is complete, rather than letting the executing agent judge itself.

### +1. Durable Memory

Cross-session state preservation. The agent itself is amnesiac, but the filesystem isn't — `progress.txt`, `AGENTS.md`, `prd.json` carry memory across sessions. Per Osmani's [long-running agents article](https://addyosmani.com/blog/long-running-agents/), this is the core design of the Ralph Wiggum loop (an early loop pattern popularized by Geoffrey Huntley and Ryan Carson):

> "The agent itself is amnesiac, but the filesystem isn't. Each iteration starts fresh and reads enough state from disk to keep going."

## Verification Cost Is the Real Bottleneck

Among all Loop Engineering discussions, [Blake Crosley's analysis](https://blakecrosley.com/blog/loops-win-where-verification-is-cheap) offers the sharpest insight:

> "Verification cost, not loop construction, decides what you can automate."

He pulled full transcripts from Cherny's three talks and found a pattern most people missed: every loop Cherny actually names has a machine-checkable success condition — CI repair, auto-rebasing, feedback clustering. Not open-ended feature development.

This isn't coincidental. When verification is automatable (test suite passes, lint is clean, type check clears), the loop can run indefinitely. When verification requires human judgment (is this UI good? is this architecture decision correct?), the loop degrades into "a production line generating output waiting for your review."

[AlphaSignal's analysis](https://alphasignalai.substack.com/p/most-developers-do-not-need-agent) distills this into four prerequisites:

1. **The task repeats**: not a one-off exploration
2. **Verification is automatable**: test suites, linters, type checkers exist
3. **Token budget absorbs waste**: loops retry and explore dead ends
4. **The agent has the tools it needs**: no human-operated external systems required

Miss one, and the loop costs more than it returns.

## Known Limitations and Criticisms

Loop Engineering is not a silver bullet. Even Osmani states upfront: "it's still early, I'm skeptical and you absolutely have to be careful about token costs." Here are the known major limitations:

### Token Costs

Loops re-read context, retry, and explore multiple paths — token consumption far exceeds single prompts. Osmani is direct: "usage patterns can vary wildly if you are token rich or poor." [Towards AI's critique](https://pub.towardsai.net/is-loop-engineering-really-what-we-need-77506986bf2a) calculated that a loop running both maker and checker agents "will burn through a limited plan before breakfast."

### Comprehension Debt

A more insidious problem than technical debt. Towards AI's Hamza Boulahia defines it as:

> "The gap between what exists in your codebase and what you actually understand about it."

Loop-generated code that you didn't write, may not have carefully reviewed, and don't fully understand. With technical debt, you at least know what you owe; with comprehension debt, you don't even know what you don't know.

### Cognitive Surrender

Osmani coined this term to describe a subtle risk:

> "When the loop runs itself it's very tempting to stop having an opinion and just take whatever it gives back. I called that cognitive surrender. Designing the loop is the cure when you do it with judgement and the accelerant when you do it to avoid thinking — same action, opposite result."

The same loop, used to accelerate work you deeply understand, is a lever; used to avoid understanding, it's poison.

### Early Exit Problem

A known bug in the Ralph Wiggum loop — the agent declares completion prematurely, and the loop exits on a half-finished job. This is why the maker-checker split isn't optional; it's a requirement.

### Review Becomes the New Bottleneck

[Mark Norgren's practice log](https://marknorgren.com/trackers/loop-engineering/) is candid:

> "Output piles up, and without the 'close the loop' part defined up front — that is acceptance criteria, validation, and verification — I become the bottleneck."

As loop output increases, human review bandwidth becomes the ceiling. How many loops you can run depends not on your token budget, but on how fast you can review output.

## Practical Scenarios

### Scenario 1: Automated PR Maintenance

```
Trigger: PR receives a review comment
  → Agent reads comment
  → Determines if it's machine-handleable
  → Modifies code and pushes
  → Waits for CI
  → CI fails → Analyzes error → Fixes → Pushes again
  → CI passes → Notifies developer for final confirmation
```

This is one of Cherny's own loops — babysitting PRs, auto-handling CI failures and rebases.

### Scenario 2: Overnight Task Decomposition

```
Developer defines goal + acceptance criteria
  → Planner agent decomposes into subtasks
  → Each subtask assigned to independent sub-agent (each in its own worktree)
  → Checker agent verifies each output
  → Fails → Feedback for revision
  → All pass → Merge, run full test suite, create PR
```

### Scenario 3: Continuous Quality Guardian

```
On every push to main:
  → Agent runs lint, typecheck, tests
  → Finds issues → Auto-creates fix branch
  → Fix complete → Opens PR tagged as auto-fix
```

## Three Things You Can Start Today

Loop Engineering's entry barrier is lower than expected, because the tools already ship the core capabilities.

### 1. Write Your CLAUDE.md / AGENTS.md

Document your project's conventions, standards, and "we don't do it this way because of that one incident" knowledge. This is the loop's most fundamental building block — without it, the agent guesses every time.

### 2. Run Your First Loop with /goal or /loop

No need to write your own bash orchestrator. Claude Code's `/goal` automatically implements the maker-checker split; `/loop` runs on a schedule. Start small — babysit a PR, run a lint check every hour.

### 3. Split Maker and Checker

Start using sub-agents for verification. Don't let the same agent check its own work. This simple separation is the core of loop quality assurance.

## The Bottom Line

Loop Engineering is a genuine engineering evolution, not hype. But it's harder than prompt engineering, not easier — because now you're designing not a piece of text, but a system that must run reliably unattended.

Osmani's closing is worth re-reading:

> "Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go."

[Pulumi's Engin Diri](https://www.pulumi.com/blog/stop-prompting-design-the-loop/) says it differently, but points to the same truth:

> "The loop will do the typing. The thinking is the work."

The loop won't replace your judgment. It will amplify it — provided you still have judgment worth amplifying.

## References

- [Addy Osmani - Loop Engineering](https://addyosmani.com/blog/loop-engineering/)
- [Addy Osmani - Loop Engineering (Substack version)](https://addyo.substack.com/p/loop-engineering)
- [Addy Osmani - Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/)
- [Addy Osmani - Long-running Agents](https://addyosmani.com/blog/long-running-agents/)
- [WorkOS - Boris Cherny Claude Code Interview Takeaways](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways)
- [Blake Crosley - Loops Win Where Verification Is Cheap](https://blakecrosley.com/blog/loops-win-where-verification-is-cheap)
- [The New Stack - Loop Engineering](https://thenewstack.io/loop-engineering/)
- [Pulumi - Stop Prompting. Design the Loop.](https://www.pulumi.com/blog/stop-prompting-design-the-loop/)
- [Peter Steinberger's original post (via Digg)](https://digg.com/ai/7ifyvmb9)
- [Towards AI - Is Loop Engineering Really What We Need?](https://pub.towardsai.net/is-loop-engineering-really-what-we-need-77506986bf2a)
- [AlphaSignal - Most Developers Do Not Need Agent Loops Yet](https://alphasignalai.substack.com/p/most-developers-do-not-need-agent)
- [Mark Norgren - Loop Engineering Tracker](https://marknorgren.com/trackers/loop-engineering/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
