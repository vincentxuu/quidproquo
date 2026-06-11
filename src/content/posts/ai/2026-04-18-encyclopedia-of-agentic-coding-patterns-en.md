---
title: "A Book Written by AI Itself, Teaching You How to Build Software with AI"
date: 2026-04-18
type: guide
category: ai
tags: [agentic-coding, design-patterns, llm, ai-agent, software-engineering, claude-code]
lang: en
tldr: "Encyclopedia of Agentic Coding Patterns catalogues 190 patterns to help you make the right software decisions in the age of AI-written code — and the book itself is autonomously written and maintained by an AI agent."
description: "A deep introduction to Encyclopedia of Agentic Coding Patterns: a living document autonomously maintained by AI, cataloguing 190 design patterns for the agentic era, spanning the full knowledge spectrum from product judgment to agent governance."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-18-encyclopedia-of-agentic-coding-patterns)

In early 2025, Kenta Naruse, an ML engineer at Rakuten, gave a coding agent a task: implement a specific activation vector extraction method in vLLM. vLLM is an open-source inference library spanning multiple languages with over 12.5 million lines of code.

He typed the command, pressed Enter, and waited.

Seven hours later, the agent delivered a working implementation with numerical accuracy of 99.9%. Throughout the entire process, Naruse didn't write a single line of code. He only provided occasional guidance.

Two years earlier, this task would have taken weeks of manual work. Four years earlier, no AI tool could have even attempted it.

This is agentic coding.

## Agents Are Amplifiers, Not Replacements

*Encyclopedia of Agentic Coding Patterns* opens with a statement that I think is the book's most essential insight:

> *Think of an agent as an amplifier. It makes your decisions louder. Give it a clear architecture and well-defined boundaries, and it produces clean, maintainable work. Give it a vague prompt with no structure, and it produces a mess at speed. The mess compiles. The mess might even pass a few tests. But it won't hold up when requirements change, users arrive, or a second agent tries to build on top of it.*

Agents make bad decisions faster, bigger, and harder to clean up. This is a crucial realization, especially now that vibe coding is everywhere.

AI coding tools didn't appear overnight. They evolved through several layers:

- **Autocomplete (2021)**: Predicts the next token. No project awareness, no ability to recover from mistakes.
- **Chat (2023)**: Conversational Q&A. More flexible, but you still drive every step.
- **Agents (2025)**: Accept a goal, autonomously plan, execute, test, and iterate until done or stuck.

The significance of this evolution: **your job shifts from writing code to directing a system that writes code**. You're no longer typing — you're doing three things:

1. **Writing prompts**: Precision directly determines output quality. "Add input validation" vs. "Validate email format, minimum password length 12 characters, reject empty fields, every case must have a unit test" — the gap in what the agent produces is enormous.
2. **Reviewing output**: Agents misread requirements, choose wrong approaches, and write code that passes tests but is logically incorrect. You need to review their output like you'd review a colleague's PR.
3. **Verifying correctness**: Review is about whether it looks right; verification is confirming it does what it's supposed to do. Run tests, check against specs, test edge cases.

## Why We Need a Pattern Language

This is a pattern book. Before explaining the book, it's worth clarifying what patterns are and why they matter more in the agent era.

In 1977, architect Christopher Alexander published *A Pattern Language*. He discovered that certain design problems — how to place seating along a street, how to bring natural light indoors — recur across different buildings, and effective solutions follow consistent forms. He compiled 253 such problems and solutions into a book, each pattern containing context (under what circumstances), problem (what tensions are at play), and solution (how to resolve them).

His real contribution was the word "language": patterns aren't isolated — they interconnect. A solution at one scale creates the conditions for patterns at another scale to exist.

In 1994, Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides (the Gang of Four) applied this framework to software. Their 23 patterns gave an entire generation of engineers a shared vocabulary. When you say "use a factory here," the other person immediately understands what you mean.

*Encyclopedia of Agentic Coding Patterns* extends this tradition into the agentic era. But the book makes an explicit and compelling argument: **pattern language is more important in the agent era, not less**.

Here's why. Consider these two instructions to an agent:

> "Break this into smaller parts to make it easier to modify."

> "Use Decomposition to separate the data-fetching logic from the display logic, and keep Coupling between the two components low."

Both instructions ask for the same thing. But the second consistently produces better work — because it's precise. The agent knows what decomposition means structurally, knows what conditions low coupling requires. It doesn't have to guess.

What patterns give you is a faster path to judgment. You recognize the situation in front of you faster, recall effective solutions faster, and when the output has problems, you have language to articulate exactly what's wrong.

## A Map with 190 Entries

The book catalogues approximately 190 patterns, antipatterns, and concepts, from the highest-level product strategy down to the lowest-level agent control mechanisms, organized into 13 chapters. The chapter order is deliberately designed: each chapter establishes the vocabulary the next one needs.

**Product Judgment and What to Create** starts with the problem itself: what to build, for whom, and why it matters. The book puts it bluntly — "Skipping these questions is the most expensive mistake in software." Patterns in this chapter include Problem, Customer, Value Proposition, User Story, and Build-vs-Don't-Build Judgment.

**Intent, Scope, and Decision-Making** turns vague goals into executable tasks. Requirement, Acceptance Criteria, Spec-Driven Development, Architecture Decision Record. Without clear acceptance criteria, you can't tell an agent what "done" looks like, nor can you evaluate its output.

**Structure and Decomposition** covers Architecture, Boundary, Cohesion, Coupling, and Separation of Concerns. This is the skeleton of software construction. These concepts remain applicable in the agent era — even more so, because agents need tasks broken small enough and boundaries defined clearly enough to execute effectively.

**Data, State, and Truth** explains how information is represented, stored, and kept consistent. Source of Truth, DRY, Domain Model, Bounded Context. The book states: "Most bugs live here."

**Correctness, Testing, and Evolution** ranges from confirming the system does what it should, to evolving it without breaking existing behavior. TDD, Test Pyramid, Invariant, Regression, Technical Debt, Strangler Fig, Parallel Change.

**Security and Trust** is a chapter that deserves special attention. Beyond traditional security concepts (Threat Model, Least Privilege, Input Validation), it covers attack surfaces unique to the agentic era:

- **Prompt Injection**: Attackers embed instructions in content the agent reads, causing it to perform unintended operations.
- **Tool Poisoning**: Injecting malicious instructions into the descriptions of tools available to the agent.
- **RAG Poisoning**: Contaminating the knowledge base the agent retrieves from.
- **Adversarial Cloaking**: Hiding malicious content in ways invisible to humans but readable by LLMs.

**Agentic Software Construction** is the book's most distinctive chapter, describing concepts unique to agentic workflows: Context Window, Context Rot (context drifting as conversations grow longer), Context Engineering (actively managing context quality), Subagent, Parallelization, Worktree Isolation, Verification Loop, and Steering Loop.

**Agent Governance and Feedback** addresses a core question: when agents execute autonomously, what is the human's role? Approval Policy, Human in the Loop, Bounded Autonomy, along with several important antipatterns:

- **Approval Fatigue**: The agent frequently requests human confirmation, people start automatically clicking yes, and the safety mechanism becomes theater.
- **Dark Factory**: A fully autonomous agent system that requires no human intervention — sounds cool, but nobody knows what it's doing.
- **Agent Sprawl**: More and more agents are running, but no one has the full picture.

## Five Learning Tracks

The book provides five curated reading paths for people with different backgrounds:

**Track 1: Your First Day with an AI Agent** (8 entries) starts with Model, then Prompt, Context Window, Agent, Tool, Instruction File, Verification Loop, Human in the Loop. It builds a basic mental model of what agents are and how they work.

**Track 2: Building Things That Work** (12 entries) Problem → Requirement → Architecture → Component → Interface → Boundary → Cohesion → Coupling → Abstraction → Separation of Concerns → Decomposition → Test. For people who've never systematically studied software design fundamentals.

**Track 3: Keeping Software Honest** (10 entries) from Invariant to Sandbox, covering testing and security. "Correctness isn't just about bugs" is the key insight of this track.

**Track 4: Mastering the Agentic Workflow** (12 entries) for those who already have a foundation and want to use agents more effectively. Starting with Context Engineering (the book calls it "the single highest-leverage skill in agentic work"), through Compaction, Thread-per-Task, Subagent, Parallelization, Plan Mode, Skill, Hook, Memory, Worktree Isolation, to Approval Policy and Eval.

**Track 5: From Idea to Product** (10 entries) from Problem to Observability, cutting across the entire book, tracing the complete path from a raw idea to deployed software.

## The Book Itself Is a Demonstration

One thing makes this book stand apart: **it's built by the very patterns it describes**.

A self-improving engine handles researching topics, writing articles, editing existing content, and deploying updates to the live site — all running automatically in a continuous loop without anyone pressing a button.

The engine's architecture is exactly what the book teaches:

- **Steering Loop**: Each cycle observes the book's state, decides the most useful next step (research new topics, write articles, edit old ones, restructure, deploy), executes it, then continues.
- **Feedforward**: Before each cycle, the engine loads the latest style guide, article templates, and context relevant to the current task. It re-reads the rules every time rather than pulling from memory.
- **Feedback Sensor**: The engine tracks what work was done, what wasn't, and what hasn't been touched the longest, using this to determine priorities.
- **Verification Loop**: Before every deployment, it builds the site and checks for broken links. If the build fails, it fixes the issue before committing.
- **Instruction File + Memory**: Rules are recorded in version-controlled documents; knowledge is maintained across cycles via memory.
- **Eval**: The engine runs quality assessments on its own articles, using the same methods described in the book.

The most unusual part isn't that it writes and edits, but that **it evaluates its own process and then changes it**. The engine periodically reads its own activity log, checks whether work across categories is balanced, and identifies problems — research backlogs, articles that haven't been reviewed, task categories that have nothing left to do. When it finds a problem, it diagnoses the cause and rewrites the procedures its future cycles will follow.

The book documents several instances of this: early on, the engine spent too much time researching, with ideas accumulating faster than writing could keep up. It detected the imbalance, adjusted priorities, then overcorrected — the idea pipeline dried up. It evaluated again, rebalanced — it took two iterations to find equilibrium. In another case, it wrote a rule but the rule contained a mislabeled reference pointing to the wrong step. The rule never triggered correctly, but the next evaluation cycle found the error, traced it to the mislabel, rewrote the rule, and added a logging requirement to ensure such errors would be caught in the future.

This isn't a gimmick. It's treating the book itself as a proof of concept.

## Who This Book Is For

The book identifies three types of people converging on the same need:

**Nontraditional builders**: People who, for the first time, have the opportunity to participate in building software. You don't need to know how to write a for loop, but you need to understand why separation of concerns matters, what a test is, and how to evaluate whether what an agent delivers actually solves the problem you asked about.

**Developers whose role is shifting**: You already know most of this material. What's changing is the workflow — you're directing agents, designing systems at a higher level of abstraction, letting implementation happen beneath you. This book connects your existing foundations to agentic workflows and fills the gaps in things you learned on the job rather than from first principles.

**Team leads, product managers, founders**: You're directing and evaluating work. In an agent loop, the quality of direction directly determines the quality of output. A PM who can express requirements using terms like boundary, invariant, and acceptance criteria will get better results from an agent-augmented team.

## Overall

The book's core trade-off is breadth over depth. 190 entries means no single entry will have full implementation details — they lean more toward concept definitions, force analysis, and cross-references. Its value lies in giving you a map: knowing which questions are worth asking, which patterns are worth learning, and which antipatterns are worth avoiding.

Agents are amplifiers. This book's goal is to make sure what gets amplified is worth amplifying.

---

## References

- [Encyclopedia of Agentic Coding Patterns — Complete Guide to 190 Agentic Coding Design Patterns](https://aipatternbook.com/)
- [A Pattern Language — Christopher Alexander (1977)](https://en.wikipedia.org/wiki/A_Pattern_Language) — The design philosophy behind Agentic Coding Patterns
- [Design Patterns: Elements of Reusable Object-Oriented Software (GoF)](https://en.wikipedia.org/wiki/Design_Patterns) — The software engineering predecessor of Agentic Coding Pattern Language
- [Claude Code — Anthropic's Agentic Coding CLI Tool](https://docs.anthropic.com/en/docs/claude-code/overview)
