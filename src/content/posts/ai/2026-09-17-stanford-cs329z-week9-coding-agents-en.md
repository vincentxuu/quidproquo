---
title: "Reading Stanford CS329Z Week 9: Coding Agents Need Their Own IDE First"
date: 2026-09-10
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 10
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 28
tldr: "Week nine turns to coding agents: SWE-agent shows interface is performance, OpenHands packs sandbox plus benchmarks into one general base, and the second homework is due Friday — ship one working bug-fix exam this week."
description: "A guided reading of Stanford CS329Z Week 9: SWE-agent's ACI design and ablation evidence, OpenHands' event-stream sandbox and multi-benchmark eval, the SWE-bench 4-tuple, and one hands-on packaging exercise."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents)

Week nine is coding week. Monday the sixteenth brings a guest session. Wednesday the eighteenth covers Coding and Software Agents. The second homework is due Friday the twentieth.

The week's question is simple: hand an agent a GitHub issue and see if it can fix the bug on its own. The end-to-end loop has five steps: read the request, find the relevant code, write a reproduction script, edit the code, and run the tests. What comes out is a patch plus a green test suite.

Think of the coding agent as an apprentice engineer with a computer: give it a task and tools, and let it fail and recover inside a sandbox. Two anchor readings carry the week. [SWE-agent](https://arxiv.org/abs/2405.15793) asks the interface question: what tools does an agent need before it can change code at all? [OpenHands](https://arxiv.org/abs/2407.16741) asks the platform question: how do sandboxes, tool libraries, and benchmarks snap into one general base? The guest lecture lists no required reading, so this guide skips it.

## ACI: the agent is a new kind of end user

The inspiration comes from human-computer interaction: humans got the IDE, so agents deserve an interface of their own. The paper names this layer the ACI, the interface sitting between agent and computer. Humans tune out noise for free, while models pay for every token and lose focus under clutter. So the design brief is concrete: readable state, compact history, reliable actions.

Four principles follow. Actions should be simple: short docs, few options, usable on sight. Actions should be compact: finding, viewing, and editing files each finish in one motion, never assembled across turns. Feedback should be lean: show the fresh content right after an edit, nothing extra. Finally guardrails: block a broken write on the spot and retry before errors snowball.

At the command level, search gets three commands: find a filename, find a string, search a directory. Overflowing results bounce back with a nudge to write a sharper query. The viewer shows one hundred lines at a time with scrolling and jumping. Each edit names a line range plus replacement text, backed by a syntax check: bad edits are discarded on the spot.

The ablations speak plainly. Strip away the file editor, and the Lite resolve rate falls nearly eight points. Remove the syntax check, and it falls three points. Iterative result-by-result search does worst of all: worse than giving the agent no search tools. The interface is not packaging; it is performance.

## Scaffolding is a design decision: OpenHands' event stream and sandbox

OpenHands turns scaffolding into a platform. Formerly OpenDevin, it grew into a community-built open base with code on [GitHub](https://github.com/OpenHands/openhands). Its core is an event stream: actions and observations ordered into history, which the agent reads each step before choosing the next move.

Execution happens in an isolated Docker sandbox holding a shell, a Python interpreter, and a browser. Agent actions go through [CodeAct](https://arxiv.org/abs/2402.01030): whatever code can express needs no per-tool registration. The skill library admits only two kinds of tools: things the model cannot write itself, and things that call an outside model. Multi-agent work runs on delegation: the generalist hands browsing subtasks to a browsing specialist.

One generalist agent, prompt unchanged, runs software, browsing, and QA tasks alike. On the [Claude](https://www.anthropic.com/claude) family it resolves about twenty-six percent of Lite instances, matching specialist bug-fix systems of its generation. Swap in GPT-4o and the figure is about twenty-two percent. On the short bug-fix benchmark [HumanEvalFix](https://arxiv.org/abs/2308.07124), the same agent scores roughly seventy-nine percent with zero demonstrations. SWE-agent, handed one successful trajectory as a demo, reaches nearly eighty-eight.

## Tests are feedback: reproduce first, then edit

A typical trajectory splits in two. It opens with reproduction or localization: create a script that triggers the bug, or sweep the search commands to narrow the ground. From the middle onward it is nearly all edit-and-run loops: change code, execute, and localize again on fresh evidence.

Success has a timing signature: early submissions tend to be right. Resolved cases finish in a median of about twelve steps. Stuck cases average twenty-one steps. A solved instance costs roughly a dollar sixty in API spend. Each instance carries a four-dollar budget, and overruns auto-submit whatever exists.

Failure has a portrait too. About half the failures are wrong implementations: plausible patches that simply do not work. Over twenty percent more are cascading bad edits: one slip never recovered, everything after it skewed. More than half of all trajectories swallow at least one failed edit, and recovery odds shrink with each repeat.

## The SWE-bench 4-tuple: what the exam looks like

The benchmark is a design act of its own. Each exam item is a four-tuple: the issue text, a repository snapshot at one commit, new tests that fail before the fix, and old tests that must pass throughout. The first pair is called `FAIL_TO_PASS`, the second `PASS_TO_PASS`. The agent sees the first two items and never the last two; only passing both suites counts as solved.

The full set mines over two thousand real issues. They come from twelve Python repositories. The [SWE-bench](https://arxiv.org/abs/2310.06770) Lite subset keeps three hundred instances to save money and time. SWE-agent on the [GPT-4](https://arxiv.org/abs/2303.08774) of its day resolves just over twelve percent of the full set. Lite lands near eighteen percent. A retrieval-only [RAG](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en) baseline that never touches code stays under three percent on Lite.

## What to do: set one exam for your own repo

**What to do**: take an already-fixed issue from your own repo and wrap it as a four-tuple: the issue text, the pinned commit, and the verification tests. The agent may see only the first two items and must redo the fix inside an isolated sandbox. A full green suite or it does not count; on failure, archive the trajectory as next round's lesson.

## Where it sits in the course

[Week 8's judges and guardrails](/en/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en) shipped the tooling; this week writes code with it: ACI for feel, sandbox for safety, tests for correctness. The second homework lands Friday, and project demos are near. A bug-fix agent makes a fine project: ready-made exams, automatic grading, and a demo anyone can read.

## Course material

Three further readings round out the week. [Anthropic's Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices) treats the context window as the scarcest resource and asks for an executable check before any edit. Next, [Young on harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) has an initializer agent lay out the environment, then each session advances in small steps while leaving progress notes behind. Finally, the [SWE-bench paper](https://arxiv.org/abs/2310.06770) is the source of the week's exam, with the strongest model at publication solving only about two percent.

- Monday 11/16 guest lecture: no required reading.
- Wednesday 11/18 Coding & Software Agents: anchors SWE-agent and OpenHands (covered above); further reading Anthropic's Claude Code best practices, Young on harnesses for long-running agents, Jimenez et al. on SWE-bench.
- Schedule: [CS329Z Week 9](https://cs329z.stanford.edu/)

## References

- On this site: [Week 8: model judges and safety guardrails](/en/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en), [Week 2: workflows and RAG](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yang et al., SWE-agent](https://arxiv.org/abs/2405.15793), [Wang et al., OpenHands, ICLR 2025](https://arxiv.org/abs/2407.16741), [Jimenez et al., SWE-bench, ICLR 2024](https://arxiv.org/abs/2310.06770), [Wang et al., CodeAct, ICML 2024](https://arxiv.org/abs/2402.01030), [Muennighoff et al., OctoPack and HumanEvalPack](https://arxiv.org/abs/2308.07124)
- Tools: [SWE-agent](https://swe-agent.com), [OpenHands](https://github.com/OpenHands/openhands)
