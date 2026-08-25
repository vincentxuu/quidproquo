---
title: "Stanford CS224V Lecture 4: Task-Agent Evaluation Beyond Human-Like Answers"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, agent-evaluation, task-oriented-dialogue, genie]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS224V"
  order: 5
tldr: "CS224V splits task-agent evaluation into state updates and complete interaction: isolate the semantic parser, then test task completion, grounded queries, and valid actions with real users."
description: "CS224V Evaluation of Task-Oriented Agents: architecture comparison, Worksheets versus state machines, two-part evaluation, STARv2, and real-user testing."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-task-agent-evaluation)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 4 asks how “reliable” can be measured. Natural responses and accurate intent labels do not prove task completion; one successful conversation does not reveal whether the agent followed knowledge results or guessed correctly.

## Agenda: architecture before measurement

The deck revisits dialogue state machines, intent/dialogue-act systems, and Genie Worksheets. It compares flexibility, data-dependent fields, and formal state before covering two-part evaluation, STARv2, real-user interaction, and Homework 2. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

## Worksheets versus state machines

A state machine enumerates allowed paths as nodes and edges. Revisions, out-of-order fields, and database-dependent options multiply paths. A Worksheet fixes fields, types, dependencies, and actions while allowing the parser to update them in the order expressed by the user. Policy has not disappeared; it moved from sentence order to data and capability constraints. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

That changes the test unit. A state machine often tests an intent or next node. A Worksheet can compare the partial Worksheet and expected state update at every turn.

## Two-part evaluation

Part one isolates the semantic parser. Given the same Worksheet, history, and utterance, did it produce the correct field changes? STARv2 supplies offline dialogue data, but the lecture warns that simple slot filling can be too easy for modern LLMs. A high score alone does not prove real-task reliability. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Part two evaluates end-to-end interaction with people: task completion, response quality, faithful use of knowledge results, and action validity. Baselines need the same KB parser; otherwise the experiment compares tool access rather than architecture.

The real-user example exposes a distinct failure: a model can receive course-query results and still mention nonexistent courses. That is a violation for formal state and runtime constraints to catch, not something fluency scoring will reveal.

## Architecture determines measurement

The repeated comparison of state machines, dialogue acts, and Worksheets defines the unit of evaluation. State machines invite tests of node, intent, and legal transition. Worksheets invite tests of partial state, state diff, and runtime action. Intent accuracy alone misses utterances that simultaneously add constraints, select a candidate, and state a fallback. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Structured state is not task success either. Backend queries, confirmation, and effectful execution require end-to-end measurement. The two-part design prevents component and user outcomes from substituting for each other.

## A fair architecture comparison

State machines can be more reliable and cheaper for fixed paths. Worksheets matter when users provide fields out of order, revise choices, and use data-dependent candidates. A simple slot-filling dataset makes every modern system look similar and cannot test that claim. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Baselines also need equal data access. If a Worksheet uses a KB parser while function calling sees only prompt examples, the experiment measures tools. The lecture gives baselines the same KB parser to isolate state representation and policy.

## STARv2 is a parser test, not the world

STARv2 supplies repeatable annotated turns for comparing parser outputs. It is useful for regressions, but many examples are straightforward slot fills. Static replay also omits interaction: a mistaken question would change the user's next response, while the dataset keeps it fixed. Database contents can change too. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Break results down by phenomena—cross-turn reference, negation, revision, multiple values, missing fields, invalid entities, and confirmation. A mean score can rise while a safety-critical category falls.

## Stage one: canonical state diffs

Fix the Worksheet, pre-state, prior acts, and utterance, then compare parsed canonical updates: field, typed value, operation, and instance reference. Report field-level diagnostics and turn-level all-correct. The first helps debugging; the second reflects whether runtime can safely continue. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Invalid updates matter too. Unknown fields, arbitrary entities, and premature action readiness should be rejected by validation. Evaluation must measure correct generation and containment of incorrect generation.

## Stage two: complete human sessions

Session evaluation records completion, turns, clarifications, repairs, abandonment, query fidelity, and effectful-action correctness. A parser can be accurate while interaction remains slow or repetitive. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Knowledge-intensive tasks require entity grounding checks. A fluent response can mention a course absent from correct KB results. Every entity mention and action argument should trace to returned and confirmed state.

Recovery is another outcome. No-result constraints should invite a targeted relaxation; backend timeout should not become “no data”; uncertainty should produce clarification rather than guessing.

## Arrange metrics along the causal chain

Write the chain as utterance → state update → query/action decision → backend result → grounded response → user outcome. Parsing, state consistency, execution, action validity, grounding, completion, and satisfaction measure different links. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

This makes tradeoffs visible. Clarification can add turns while preventing a costly action error. Define unacceptable failure before optimizing brevity instead of averaging all metrics.

## Build a regression harness

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

**Author extension:** Start with twenty canonical conversations. Save Worksheet, initial state, expected turn diffs, allowed acts, and mock backend results. Test parser updates, validation, and runtime decisions. For responses, test required facts, prohibited mentions, and confirmation rather than exact prose.

Add variants for reordered fields, synonyms, negation, repeated revisions, references to previous candidates, irrelevant sentences, and unsupported capabilities. Convert every production incident into a minimal trace labeled by root layer.

Finally run a small human study with fixed goals and free wording. Preserve anonymized traces and expert judgments, not only satisfaction. Offline harnesses provide repeatability; human interaction supplies the missing distribution.

## Do not hide the denominator

Task success needs the number and types of attempts, exclusions, timeouts, and recovery turns. Report parser and state-diff metrics over their eligible sets, then show how many sessions reached human evaluation, so a polished subset cannot mask earlier failures. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

## Acceptance order after a model update

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Replay deterministic state transitions first, then tool and policy simulations, and only then complete human sessions. If the first layer regresses, later fluency scores cannot establish safety. This order turns evaluation into a release gate.

## What Homework 2 tests

The assignment first exercises Worksheet representation and updates, then builds a ride-request agent. The valuable cases are not only the happy path: changed destinations, missing fields, invalid options, and revisions after confirmation should preserve consistency between state and external action. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

## Build a minimal test set

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Write four conversations for one task: normal completion, midstream revision, no knowledge-base result, and a request for an undeclared action. Save the expected state diff at every turn, not only an ideal response. That test can detect boundary drift after a model change.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The slides summarize evaluation but do not publish complete user transcripts, annotation guidance, or statistical detail. This article therefore does not recompute or generalize the table values. No Fall 2025 recording is public.

## References

- [Lecture 4: Evaluation of Task-Oriented Agents](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)
- [Homework 2](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: Building a Task-Oriented Agent](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
