---
title: "Stanford CS224V Lecture 3: Building Task-Oriented Agents with Genie Worksheets"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, task-oriented-dialogue, semantic-parsing, genie]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 4
tldr: "Genie Worksheets declare task capability as a form-like specification. A contextual semantic parser updates formal dialogue state while the runtime controls queries, actions, and responses."
description: "CS224V Building a Task-Oriented Agent, from dialogue state and the Worksheet language to semantic parsing, runtime composition, and evaluation."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-task-oriented-agent)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 3 addresses a concrete risk: a ride, course, or reservation agent must not invent unavailable options or execute an undeclared action. Genie Worksheets express task capability as an inspectable declarative specification. The LLM interprets language without freely deciding what the system can do.

## Agenda: from dialogue state to runtime

The deck compares finite-state machines, intent-and-slot systems, and LLM agents before defining formal dialogue state. It then develops the rationale and constructs of Genie Worksheets—task and knowledge-base worksheets, fields, confirmation, and actions. The final sections cover the contextual semantic parser, runtime, composition, and offline and real-user evaluation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

## A Worksheet is a specification, not a prompt template

A Worksheet resembles a web form: typed fields hold the information required for a task, with options and dependencies. Unlike a form, the user can provide values in any order. The semantic parser reads current state, previous agent acts, the Worksheet, and the new utterance, then emits changes to apply to state. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

The separation leaves control with the runtime. Knowledge-base Worksheets define queries, external actions must belong to the declared set, and responses follow from missing or confirmed fields. The model can interpret “move me to Friday afternoon” without fabricating a course.

## Formal state compresses conversation history

An ordinary agent repeatedly supplies the transcript and hopes the model recovers current constraints. A Worksheet compresses effective information into typed state: values proposed by the user, values awaiting confirmation, and completed queries. This reduces ambiguity and supports turn-level evaluation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Worksheets also compose. The result of one can populate a field in another, enabling flows such as finding a course before adding it to a plan. Composition remains specification-bound rather than handing every tool to a planner.

## Three layers in a traditional task agent

The lecture first draws the familiar architecture: utterance history enters a semantic parser; dialogue-state tracking updates the user's current needs; policy chooses an agent act; response generation realizes that act. One LLM call can collapse all layers, but then misunderstanding, stale state, and wrong action become indistinguishable. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Finite-state machines provide certainty for small fixed flows but explode when users provide fields out of order or revise choices. Intent-and-slot systems add linguistic flexibility while retaining hand-authored acts and policy. LLM function calling expands interpretation yet can invent parameter values, skip confirmation, or choose an undeclared operation. Worksheets assign language interpretation to the model while retaining specification and execution in the runtime.

## State includes more than slot values

Worksheet state represents partial information, confirmation, query results, and multiple instances. “The second course, but not on Friday” refers to an earlier result set and adds a constraint. It is not adequately represented by one `course=NLP` slot. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

State must distinguish user-provided, database-returned, and inferred values. Typed fields prevent a candidate name from silently becoming a confirmed choice. Formal history records state changes, while the transcript preserves wording. Execution follows formal state instead of re-deriving everything from text.

## The Worksheet language

Task Worksheets define fields and actions required to complete a task. Knowledge Base Worksheets define queryable records. Finding a course and enrolling in it have different permissions and failure modes, so the separation matters. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Fields carry types, allowed values, required status, dependencies, and confirmation rules. Data-dependent fields come from database results rather than prompt literals. The runtime executes a query and stores legal candidates before the parser resolves phrases such as “the first one.” Knowledge grounding is therefore part of the dialogue protocol.

## Contextual parsing emits state changes

The parser reads formal history, the Worksheet specification, partial state, previous agent acts, and the new utterance. “Move it to Tuesday” becomes meaningful only in that context. Its output is a set of Worksheet updates, not a response. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Every update can be schema-validated: field existence, type, entity membership, and write permission. Previous agent acts also make “yes,” “not that one,” and “either” precise confirm, reject, or update operations.

## Runtime policy and response generation

After an update, the runtime follows the specification. Missing required fields cause a question; sufficient query constraints trigger retrieval; multiple candidates require selection; effectful actions require confirmation; only validated complete state permits execution. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

An LLM may phrase responses naturally, but facts come from state and agent acts. An empty query must remain empty, and a failed action must not be described as complete. Typed Worksheet references compose capabilities without converting every subtask result back into prose.

## Discovering missing capabilities

The lecture closes with GenieWorksheet Wizard because specifications omit real user needs. Conversations reveal requests for cancellation, comparison, batch edits, and exceptions. Discovery must remain separate from authorization: evidence that users want cancellation does not grant the agent a cancellation action. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Out-of-spec requests belong in evaluation. A reliable agent can explicitly report that a capability is unavailable. Refusal is better than hallucinated completion and is a defining advantage of specification-bound behavior.

## From lecture to a deployable prototype

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Choose one narrow task with a real backend. Separate read-only knowledge operations from effectful actions. Give each action required fields, confirmation, and idempotency. Write canonical conversations covering ordered and unordered fields, revisions, references to earlier results, empty queries, API failure, and unsupported requests.

Save utterance, pre-state, expected diff, and allowed next acts per turn. Response wording can vary, so state and action assertions matter more than exact strings. Test effectful actions for at-most-once execution under retries.

Production signals should include parser-validation errors, clarification rate, empty results, rejected capabilities, and action failures. Each points to a different layer—schema, interpretation, data, or backend—and should not be collapsed into prompt tuning.

## The cost of the design

Worksheets and typed state require schema authoring, migration, and domain review. They reduce improvisation but expose unsupported goals as missing capabilities. The cost buys inspectability and safe failure through a maintained formal contract. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

## Questions for a specification review

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

For each field ask who may set it, how it is validated, whether users can correct or clear it, and whether it is sensitive. For each action ask its preconditions, external effect, confirmation, idempotency, and recovery path. This catches ambiguity before it becomes a prompt patch.

## What evaluation measures

The lecture separates semantic-parsing accuracy, dialogue-state correctness, task completion, and real-user outcomes. It argues that classic slot-filling datasets are too easy for knowledge-intensive tasks. A fair baseline needs the same knowledge-query capability, so differences reflect state and policy rather than data access. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Before coding, specify a room-booking Worksheet: typed fields, fields requiring confirmation, the only allowed external action, and three user turns that revise earlier choices. If a revision cannot be represented as a state update, the specification is incomplete.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

There is no public demo recording, and slide excerpts are not a complete language or API specification. This account does not use Autumn 2026 material to fill Fall 2025 gaps.

## References

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: Building a Task-Oriented Agent](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [Homework 2](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
- [Lecture 4: Evaluation of Task-Oriented Agents](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
