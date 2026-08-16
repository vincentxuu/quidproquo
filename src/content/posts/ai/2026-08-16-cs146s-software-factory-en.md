---
title: "CS146S Week 10: The Software Factory Isn't Automation — It's Handing Over the Feedback Loop"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - observability
  - multi-agent
  - orchestration
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 11
tldr: "The final session is 'self-running, self-improving software systems.' Read across the previous nine weeks, the parts are all already there: deterministic validation loops, skills that can be written back, background agents, centralized governance. What the syllabus never answers is who is accountable for what it produces — there is no slot for that in ten weeks."
description: "Stanford CS146S Fall 2026 Week 10, 'The Software Factory + The Future': the components of self-running and self-improving systems, running and observing agents post-deployment, and the questions ten weeks of syllabus leave unanswered."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-software-factory)

This is the final post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 10 of Fall 2026.

Three topics: self-running, self-improving software systems; running and securing agents post-deployment; where AI software engineering goes next. The session title is "The Software Factory: self-running, self-improving software systems."

"Software factory" also closes the course description: graduates should be able to "apply software-factory principles to building and evolving software at greater speed and scale." It is the course's terminal proposition.

## Unpacking the term

A factory's core isn't automation — it's that the process is repeatable, defects are traceable, and the line is adjustable. Translated to software, "self-running, self-improving" needs three things in place at once:

**One: machine-decidable acceptance.** Without it, "self-improving" has no direction to improve toward. This is [Week 5's deterministic validation loops](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en) — linters, type checkers, tests, scans, anything that passes or fails. Factory puts it directly: "A codebase with poor feedback loops will defeat any agent you throw at it."

**Two: process knowledge that can be written back.** What an agent learns from a task has to settle into something the next task uses. Anthropic names this direction explicitly at the end of its [Agent Skills post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):

> Looking further ahead, we hope to enable agents to create, edit, and evaluate Skills on their own, letting them codify their own patterns of behavior into reusable capabilities.

**Three: execution that doesn't need a human to start it.** That is [Week 8's background agents](/posts/ai/2026-08-16-cs146s-background-agents-en): issue arrives, agent works, PR emerges.

With all three, "self-improving" stops being rhetoric: agent runs → the validation loop returns pass or fail → the failure gets written back into a skill or instruction file → the next run succeeds more often. **The quality of that loop rests entirely on the first item.** A system with vague acceptance criteria just random-walks, however many rounds it runs.

## "Post-deployment" is the underrated half

"Running and securing agents post-deployment" was a full week in Fall 2025 (Week 9, "Agents Post-Deployment," with Resolve's CTO and technical staff as guests), assigning [Google's SRE Book](https://sre.google/sre-book/introduction/) and [observability basics](https://last9.io/blog/traces-spans-observability-basics/). Fall 2026 compresses it into the final week.

Compressed doesn't mean easier. Once agents are in production there are two layers to watch:

**The code the agent produced** — no different from any other service; standard SRE applies.

**The agent system itself** — this layer is new. The questions include: how long did this run take, how many tokens did it burn, which tools did it use, where did it stall, how many retries, did it meet the acceptance criteria. None of that appears on your existing APM dashboard, because none of it is request latency or error rate.

Without the second layer, you are managing a system that runs hundreds of times a day using the phrase "it feels less accurate lately."

## The shape of ten weeks

Laid out together, the argument is clear:

```
W1  agent skeleton        →  no magic; it's a while loop
W2  context engineering   →  the bottleneck is what you feed it
W3  skills                →  process knowledge, packaged and loaded on demand
W4  customizing agent/repo→  rules, gates, context isolation
W5  codebase readiness    →  the environment bounds autonomous run length
W6  code review           →  who checks the output
W7  security              →  the agent is itself an attack surface
W8  background agents     →  from watching it to handing it off
W9  team scale            →  from personal preference to org governance
W10 software factory      →  wire all of it into a self-reinforcing loop
```

**Weeks 1–4 are "how you use an agent"; weeks 5–10 are "how your environment and organization accommodate agents."** The dividing line falls at Week 5 — which is why Agent-Ready Codebases is the pivotal slot in the new syllabus.

Set against [the Fall 2025 version](/posts/ai/2026-08-16-cs146s-course-map-en) — a week on terminals, a week on UI generation, a week on prompting — the change is obvious. **In one year, this course went from a tool tour to systems design.**

## Three things this course doesn't answer

Eleven posts in, three gaps are worth naming. None is in the syllabus, and none is a technical problem:

**One: who is accountable for agent-authored code.** The grading breakdown has open source contributions and a final project; no slot addresses accountability. When a PR is written by an agent, reviewed by another agent, and merged by a background pipeline, where in the chain does a human sit? In regulated industries that isn't a philosophical question.

**Two: how junior engineers are trained.** The prerequisite is CS111/CS161-equivalent experience — that is, the course assumes you **already** know how to program. Those skills were historically built by doing exactly the work the course now assumes you're past. If agents absorb that work, where does the next generation get the judgment to know when an agent is confidently wrong? The course doesn't answer, because its prerequisites define the problem away.

**Three: the gap between claims and measurement.** This field is thick with multipliers that carry no reproducible method: "2-3X faster," "10x productivity," "82% catch rate." The sources in this series that actually published a method and a number are few — Google's [AutoCommenter paper](https://arxiv.org/abs/2405.13565) (~40% comment resolution), Sean Heelan's [o3 experiment](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) (8 hits and 28 false positives per 100 runs), Factory's [scoring variance](https://factory.ai/news/agent-readiness) (7% → 0.6%). **What they have in common is that all of them also reported their failure rates.**

That is the test I most want to keep after reading the whole syllabus: **when an AI development tool makes a claim, look for its failure rate. If you can't find one, treat the claim as unsaid.**

## End of the series

Eleven posts, done. Worth repeating: as of writing (August 2026) Fall 2026 hasn't started — this series reads **the syllabus**, not the classroom. After September 22, slides, readings, and assignments will appear, and it will be worth returning to check which topics became what, and which slots diverged from the plan.

To study on your own, [the complete Fall 2025 materials](https://themodernsoftware.dev/fall2025) remain the best starting point, and the [assignment repo](https://github.com/mihail911/modern-software-dev-assignments) is still up. Starting at `week2` and hand-rolling an agent will teach you more than eleven blog posts.

## What will go stale

- The Week 10 guest for Fall 2026 is unannounced
- "Software factory" is currently used mostly by this course and a few vendors, with no consensus definition
- The three gaps above are my assessment, not the course's own statement

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 10 topics and the course description
- [CS146S Fall 2025](https://themodernsoftware.dev/fall2025) — full reading list, slides, and the Agents Post-Deployment week
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering, on agents authoring their own skills
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, on feedback loops and scoring variance
- [Introduction to Site Reliability Engineering](https://sre.google/sre-book/introduction/) — Google SRE Book, assigned in Fall 2025 Week 9
- [Observability Basics You Should Know](https://last9.io/blog/traces-spans-observability-basics/) — assigned in Fall 2025 Week 9
- [The Build System](https://www.youtube.com/@modernsoftwaredeveloper) — the instructor's build video series
