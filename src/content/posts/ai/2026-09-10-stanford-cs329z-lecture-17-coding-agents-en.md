---
title: "For a Coding Agent, Build a Good IDE First | Stanford CS329Z Lecture 17"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 18
tldr: "Per the schedule, Lecture 17 covers how coding agents work end to end: the SWE-agent, Claude Code and OpenHands architectures, scaffolds as design decisions, SWE-bench and the 4-tuple framework in practice, and the future of software development. The readings cover SWE-agent's ACI, OpenHands's event-stream sandbox, Claude Code practice, long-running harnesses and SWE-bench."
description: "A preview of Stanford CS329Z Lecture 17, Coding & Software Agents: digests of SWE-agent's ACI design, OpenHands's event-stream sandbox, Claude Code practice, long-running harnesses and SWE-bench's task structure."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Give an agent a GitHub issue: can it fix it on its own? That is where Lecture 17 (Nov 18, Coding & Software Agents) begins. The end-to-end flow has five steps: understand the request, find the relevant code, write a reproduction script, change the code, and run the tests. The deliverable is a patch plus a passing test suite. HW2 is due Friday, Nov 20.

Think of it as an apprentice engineer who can use a computer: give it a task and tools, and it makes progress by trial and error in a sandbox. The assigned [SWE-agent](https://arxiv.org/abs/2405.15793) answers the interface question, what tools an agent needs to edit code effectively; [OpenHands](https://arxiv.org/abs/2407.16741) answers the platform question, how sandboxes, tool libraries and evaluation combine into a general base. The additional readings are Claude Code best practices, long-running harnesses and SWE-bench, all digested here. The Monday (Nov 16) guest lecture of the same week has no announced topic or readings; this series will add it once the course site does. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

## Follow one repair through interface, environment, patch, and verification

The [official schedule](https://cs329z.stanford.edu/) still marks November 16's guest lecture TBA and places Coding & Software Agents on November 18. As of October 23, 2026, no public slides are linked. This preparation path follows SWE-agent, OpenHands, and the assigned long-running harness article; it does not fill the unknown guest session with invented content.

### Interfaces determine what evidence the next decision receives

Imagine a bug that corrupts Traditional Chinese filenames during export. Have the agent search relevant code, inspect bounded excerpts, create a minimal reproduction, and then edit. [SWE-agent's ACI](https://arxiv.org/html/2405.15793) designs viewing, searching, and editing for model use. Truncated or noisy observations alter available evidence. The interface is part of the system, so comparing model names alone misses a major variable.

### Match actions and observations to the same execution

[OpenHands](https://arxiv.org/html/2407.16741) separates agent decisions from runtime execution through actions and observations. Preserve environment identity, commands, exit status, and output; otherwise a passing test may refer to an old artifact or another checkout. The encoding bug is an original exercise, not a claimed paper experiment.

### Reproduction, repair, and acceptance are distinct

Run a failing reproduction that captures the original behavior. After changing code, make it pass and check neighboring behavior instead of hard-coding a single input. Verify the patch in a clean environment. Separate the agent's development checks from independent harness tests. The [long-running harness guide](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) adds durable progress records and resumption across contexts.

**Check:** the agent changed the test until it passed. Is the bug fixed? **Answer criteria:** inspect the original requirement and whether the test was wrong. Acceptance checks observable behavior and protects independent conditions; deleting a failing case does not prove a repair.

## Reading 1 | SWE-agent

Source: [SWE-agent](https://arxiv.org/abs/2405.15793)

### TL;DR

The ACI provides bounded search, viewing, and editing tools and uses ablations to study interface effects.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Is a human shell necessarily the right interface for a model? |
| Evidence and scope | The 12.47% full and 18% Lite results use the paper's GPT-4 Turbo setup, not a current model-only comparison. |

### Domain background

Coding agents act from search, file observations, and execution results; interface information density shapes decisions.

### Intermediate guide

**Method.** Provide bounded file views, summarized search, and checked edits so each action yields usable observations.

The inspiration comes from human-computer interaction: humans got the IDE, so agents deserve an interface of their own. The paper names this layer the ACI, the interface sitting between agent and computer. Humans tune out noise for free, while models pay for every token and lose focus under clutter. So the design brief is concrete: readable state, compact history, reliable actions.

Four principles follow. Actions should be simple: short docs, few options, usable on sight. Actions should be compact: finding, viewing, and editing files each finish in one motion, never assembled across turns. Feedback should be lean: show the fresh content right after an edit, nothing extra. Finally guardrails: block a broken write on the spot and retry before errors snowball.

At the command level, search gets three commands: find a filename, find a string, search a directory. Overflowing results bounce back with a nudge to write a sharper query. The viewer shows one hundred lines at a time with scrolling and jumping. Each edit names a line range plus replacement text, backed by a syntax check: bad edits are discarded on the spot.

The ablations speak plainly. Strip away the file editor, and the Lite resolve rate falls nearly eight points. Remove the syntax check, and it falls three points. Iterative result-by-result search does worst of all: worse than giving the agent no search tools. The interface is not packaging; it is performance.

A typical trajectory splits in two. It opens with reproduction or localization: create a script that triggers the bug, or sweep the search commands to narrow the ground. From the middle onward it is nearly all edit-and-run loops: change code, execute, and localize again on fresh evidence.

```diagram
title: Tests guide the next edit
desc: Reproduce and locate first, then edit and test; failures inform another edit, while passing tests lead to patch submission.
caption: Development feedback from the text; hidden scoring tests run separately, and submission does not establish benchmark success.
---
<svg viewBox="0 0 440 592"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V248" marker-end="url(#arrow)"/><path class="dg-line" d="M220 344V392Q220 400 212 400H120Q112 400 112 408V496" marker-end="url(#arrow)"/><path class="dg-line" d="M380 296H400Q408 296 408 304V456Q408 464 400 464H340Q332 464 332 472V496" marker-end="url(#arrow)"/><path class="dg-line dg-line--dashed" d="M424 536H428Q432 536 432 532V168Q432 160 424 160H400" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">Reproduce / locate the bug</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">Edit the code</text><path class="dg-box" d="M220 248L380 296L220 344L60 296Z"/><text class="dg-label" x="220" y="296" text-anchor="middle" dominant-baseline="central">Local checks pass?</text><rect class="dg-box dg-box--accent" x="16" y="500" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="536.0" text-anchor="middle" dominant-baseline="central">Submit the patch</text><rect class="dg-box" x="240" y="500" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="536.0" text-anchor="middle" dominant-baseline="central">Read failures</text><text class="dg-edge" x="164" y="372" text-anchor="middle" dominant-baseline="central">Pass</text><text class="dg-edge" x="376" y="392" text-anchor="middle" dominant-baseline="central">Fail</text></svg>
```

Success has a timing signature: early submissions tend to be right. Resolved cases finish in a median of about twelve steps. Stuck cases average twenty-one steps. A solved instance costs roughly a dollar sixty in API spend. Each instance carries a four-dollar budget, and overruns auto-submit whatever exists.

Failure has a portrait too. About half the failures are wrong implementations: plausible patches that simply do not work. Over twenty percent more are cascading bad edits: one slip never recovered, everything after it skewed. More than half of all trajectories swallow at least one failed edit, and recovery odds shrink with each repeat.

**Evidence and result.** ACI ablations show that viewing windows, search, and editing feedback change repair outcomes, making interfaces research variables.

### Deeper points

- Lint feedback constrains invalid edits earlier than a final full test, shortening local repair loops.
- No-demo, shell-only, and full-ACI comparisons need the same model and tasks to isolate interface effects.

### Reviewer’s one-line verdict

The interface is part of capability, beyond the model alone.

### Your take-away

Keep a shell baseline and change observation windows or editing feedback separately, measuring complete repairs.

## Reading 2 | OpenHands

Source: [OpenHands](https://arxiv.org/abs/2407.16741)

### TL;DR

The platform connects agents and sandboxed runtimes through action-observation events with extensible skills and delegation.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can different software tasks share runtimes, tools, and evaluation? |
| Evidence and scope | The 26% and 22% use particular CodeActAgent/model setups;79.3% zero-shot versus 87.7% SWE-agent one-shot is not a same-system demonstration ablation. |

### Domain background

General software assistants need consistent runtimes and event records to share tools and evaluation across tasks.

### Intermediate guide

**Method.** Record actions and observations in an event stream, execute through isolated runtimes, and extend interfaces with skills or delegation.

OpenHands turns scaffolding into a platform. Formerly OpenDevin, it grew into a community-built open base with code on [GitHub](https://github.com/OpenHands/openhands). Its core is an event stream: actions and observations ordered into history, which the agent reads each step before choosing the next move.

Execution happens in an isolated Docker sandbox holding a shell, a Python interpreter, and a browser. Agent actions go through [CodeAct](https://arxiv.org/abs/2402.01030): whatever code can express needs no per-tool registration. The skill library admits only two kinds of tools: things the model cannot write itself, and things that call an outside model. Multi-agent work runs on delegation: the generalist hands browsing subtasks to a browsing specialist.

One generalist agent, prompt unchanged, runs software, browsing, and QA tasks alike. On the [Claude](https://www.anthropic.com/claude) family it resolves about twenty-six percent of Lite instances, matching specialist bug-fix systems of its generation. Swap in GPT-4o and the figure is about twenty-two percent. On the short bug-fix benchmark [HumanEvalFix](https://arxiv.org/abs/2308.07124), the same agent scores roughly seventy-nine percent with zero demonstrations. A separate SWE-agent system reaches 87.7% under a one-shot setup with a successful trajectory. These are different agents, models, and demonstration conditions; the comparison does not show that adding a demonstration raises the same OpenHands system from 79.3% to 87.7%.

**Evidence and result.** The platform supports repair, browsing, and QA, while each score still needs its model, agent version, and demonstration conditions.

### Deeper points

- Runtimes execute actions and agents choose from history, helping separate debugging responsibilities.
- Delegation adds handoffs and stop conditions; supporting it does not mean every task benefits.

### Reviewer’s one-line verdict

A platform makes experiments composable and version/environment records more necessary.

### Your take-away

Record environment identity, actions, observations, and exit status together to verify artifact provenance.

## Reading 3 | Claude Code Best Practices

Source: [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### TL;DR

The guide emphasizes executable verification, context management, and scoped work so agents can revise from observations.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can a coding agent know whether its change actually works? |
| Evidence and scope | This is product engineering advice, not a guaranteed success-rate experiment for every model or repository. |

### Domain background

Plausible code needs tests, reproduction, and inspected observations to establish requirement satisfaction.

### Intermediate guide

**Method.** Explore relevant code and define acceptance, implement, run checks, and revise from actual output.

**Evidence and result.** The guide emphasizes verifiable outcomes and context management, offering workflow advice rather than a universal success rate.

### Deeper points

- Reproduction commands and expected outputs expose failure; “fix it” alone lacks comparable feedback.
- Excessive scope crowds out observations; narrow work and preserve recoverable records when necessary.

### Reviewer’s one-line verdict

Useful autonomy starts with the ability to verify.

### Your take-away

Supply reproduction commands and success conditions and inspect their actual results.

## Reading 4 | Effective Harnesses for Long-Running Agents

Source: [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### TL;DR

An initializer prepares environment and feature lists; later sessions make incremental progress and hand off recoverable state through Git and progress records.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can an agent resume after its context resets? |
| Evidence and scope | Its web-development case is not a universal solution; resumption still requires checking environment and artifacts. |

### Domain background

Work can span sessions beyond a context window; state held only in conversation forces repeated exploration.

### Intermediate guide

**Method.** Initialize the environment and feature list, then let sessions read Git and progress files and advance a verifiable increment.

**Evidence and result.** A cross-context development case illustrates how initialization, progress records, and incremental commits reduce rediscovery.

### Deeper points

- Feature lists should separate pending work from verified completion rather than trust a session's self-report.
- Checking the environment at session start prevents building on a broken state left by the previous run.

### Reviewer’s one-line verdict

A reliable handoff must be replayable by the next session.

### Your take-away

Save completed work, pending work, and verification commands; begin the next session by replaying a minimal check.

## Reading 5 | SWE-bench

Source: [SWE-bench](https://arxiv.org/abs/2310.06770)

### TL;DR

The dataset links issues, base commits, and tests; systems submit patches checked for repair and preserved behavior.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can real GitHub issues become automatically verifiable repair tasks? |
| Evidence and scope | The original2294 tasks from 12 Python repositories and roughly2% historical model result do not describe current capability. |

### Domain background

A repair must solve a new problem and preserve existing behavior; real issues and tests make both inspectable.

### Intermediate guide

**Method.** Restore the base commit, apply a candidate patch, run target and regression tests in the specified environment, and aggregate resolved status.

The benchmark is a design act of its own. Each exam item is a four-tuple: the issue text, a repository snapshot at one commit, new tests that fail before the fix, and old tests that must pass throughout. The first pair is called `FAIL_TO_PASS`, the second `PASS_TO_PASS`. The agent sees the first two items and never the last two; only passing both suites counts as solved.

The full set mines over two thousand real issues. They come from twelve Python repositories. The [SWE-bench](https://arxiv.org/abs/2310.06770) Lite subset keeps three hundred instances to save money and time. SWE-agent on the [GPT-4](https://arxiv.org/abs/2303.08774) of its day resolves just over twelve percent of the full set. Lite lands near eighteen percent. A retrieval-only [RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en) baseline that never touches code stays under three percent on Lite.

**Evidence and result.** The dataset exposes models to real issues and repositories; early low results show that context, localization, and edits exceed single-turn generation.

### Deeper points

- Fail-to-pass tests check the repair; pass-to-pass tests check preserved behavior.
- Issue descriptions and tests have coverage limits; benchmark success does not establish every production requirement.

### Reviewer’s one-line verdict

Behavior and tests determine whether a patch works.

### Your take-away

Fix the base commit and clean environment and separately test the repair and behaviors that must not regress.

## What to do: set one exam for your own repo

**What to do**: take an already-fixed issue from your own repo and wrap it as a four-tuple: the issue text, the pinned commit, and the verification tests. The agent may see only the first two items and must redo the fix inside an isolated sandbox. A full green suite or it does not count; on failure, archive the trajectory as next round's lesson.

## Where it sits in the course

Coding agents tie the earlier lectures together: tools (Lecture 4), loops and context (Lecture 6), the evaluation 4-tuple (Lecture 13), and sandboxes and permissions (Lecture 15). The following week is the Thanksgiving recess, and then [Lecture 18](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en) asks when an agent should act first.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Assigned readings: Yang et al., "SWE-agent" (digested here); Wang et al., "OpenHands" (digested here)
- Additional readings: Anthropic, "Claude Code: Best Practices for Agentic Coding"; Young, "Effective Harnesses for Long-Running Agents"; Jimenez et al., "SWE-bench" (all digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 17 (Wed Nov 18), previously part of the "Week 9: build the coding agent a good IDE first" guide; earlier entries below predate the split.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 15: Agent Safety & Guardrails](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety-en), [Lecture 18: Proactive Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yang et al., SWE-agent](https://arxiv.org/abs/2405.15793), [Wang et al., OpenHands, ICLR 2025](https://arxiv.org/abs/2407.16741), [Jimenez et al., SWE-bench, ICLR 2024](https://arxiv.org/abs/2310.06770), [Wang et al., CodeAct, ICML 2024](https://arxiv.org/abs/2402.01030), [Muennighoff et al., OctoPack and HumanEvalPack](https://arxiv.org/abs/2308.07124)
- Tools: [OpenHands](https://github.com/OpenHands/openhands)
