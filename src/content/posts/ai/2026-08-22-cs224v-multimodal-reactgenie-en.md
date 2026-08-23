---
title: "Stanford CS224V Lecture 13: ReactGenie Gives Voice and Native GUIs Shared State"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, multimodal, react, conversational-ui]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 14
tldr: "ReactGenie annotates React components to expose data, actions, and views, parses composite voice commands into a DSL, and renders native graphical output against shared UI context."
description: "CS224V Multimodal Applications: command composition, API exposure, simultaneous input/output, ReactGenie architecture, runtime, and evaluation."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-multimodal-reactgenie)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 13 uses “multimodal” for interaction, not merely a model that sees images. A user can speak while operating an app. “Right-align every occurrence of [ReactGenie](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf)” requires inspecting the canvas, selecting multiple objects, composing APIs, and displaying the result in the native GUI.

## Agenda: three problems and one framework

The lecture motivates multimodal interaction and separates command composition, API exposure, and interchangeable and simultaneous input/output. It then develops ReactGenie's annotations, DSL, dialogue state, runtime, and generated UI before evaluating expressiveness, developer usability, and user experience. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## Composite commands are more than one intent

GUIs expose fine-grained methods, while language combines filtering, selection, editing, and navigation. ReactGenie composes commands into a program rather than selecting one function. The result remains in application state, so a user can continue by clicking, dragging, or speaking. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

API discovery is the second problem. `@DataClass`, method, and view annotations identify data and actions available to the multimodal interface. Developers avoid a fully separate voice schema while retaining explicit control of the exposed surface.

## More than voice shortcuts

Multimodal interaction combines speech, GUI manipulation, and native graphical results in one session. Speech can reference visible objects and compose several operations; results remain clickable. Large result sets are better displayed as cards, tables, or maps than read serially. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## Three dependent problems

Command composition, API exposure, and interchangeable simultaneous I/O depend on one another. Composition without exposure requires a huge handwritten tool schema; exposure without shared state cannot resolve “these”; output without constrained commands can execute the wrong effect. Annotations, DSL, and declarative runtime connect all three. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## A compositional DSL

The DSL expresses collection queries, filters, mapping, navigation, and action sequences rather than one intent per combination. It bounds the parser to annotated, typed operations. Runtime validation separates arbitrary language from application effects. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

**Author extension:** Multi-step effects still need transaction and undo semantics. The lecture does not supply one universal protocol, so production frameworks must define partial failure explicitly.

## Annotations expose semantics

`@DataClass` identifies domain entities, annotated methods define typed actions, and views connect data to native rendering. Useful annotations include language descriptions, argument types, effects, confirmation, and visibility. Authorization belongs in runtime policy rather than descriptive prompts. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

> **Author extension:** Schema versioning and regression commands are production recommendations from this article, not a reported ReactGenie mechanism.

Schema versions and command regressions are necessary when methods or fields change.

## Resolving UI references

“Move this to the top” depends on selection, focus, visible view, and recent results. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

> **Author extension:** Stable-ID snapshots, selection-race handling, and target confirmation for high-impact batch actions are safety recommendations from this article.

Preserve stable IDs and snapshot context because selection can change while speech is being recognized. High-impact batch actions should show resolved targets before execution.

Structured React context can avoid transmitting an entire sensitive screenshot to a vision model.

## End-to-end architecture

Utterance and UI context become ReactGenieDSL. The runtime resolves entities, executes queries or actions, updates dialogue/UI state, and renders registered native components. Queries and effects require different confirmation and permission. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Speech and graphics should derive from the same result object so summaries and visible items remain consistent.

## Evaluate framework expressiveness

Food ordering, social, NDA, and timer applications test whether common query, manipulation, navigation, selection, and domain actions compose. Report total capabilities, annotated coverage, execution success, and custom-code gaps. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Function-calling comparisons need equal API and UI context, plus developer specification effort.

## Developer and user studies

Novice studies measure integration time, errors, assistance, and usability, not only eventual completion. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

> **Author extension:** Annotation linting, type-error reporting, and runtime diagnostics are engineering recommendations from this article, not conclusions of the novice study.

**Author extension:** User evaluation should permit modality choice. Completion, correction, discoverability, target visibility, privacy, environment, and accessibility all matter. Multimodal is not universally preferable to GUI-only interaction.

## User experience depends on task and modality

Voice helps when hands and eyes are occupied, while direct manipulation is often better for precise selection and correction. A fair comparison holds task, starting UI state, and actions constant, then records completion, recovery turns, and modality switches. Success means modalities share state coherently, not that speech replaces every click. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## Build a minimal prototype

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Annotate a todo `Task` with query, complete, and reschedule. Support filter, selection, and one action in the DSL. Preserve visible, selected, and last-result IDs.

Test single and composite commands, batch edits, “those,” click-after-speech repair, invalid targets, and undeclared deletion. Evaluate DSL, targets, state diff, and rendering. Then compare GUI-only, voice-only, and free multimodal use on fixed tasks, recording corrections, unsafe actions, and modality switches.

## React and the agent share declarative state

The deck aligns React's data/state/view architecture with a task agent. A semantic parser uses the utterance and UI context to produce ReactGenie DSL. The runtime executes queries or actions and updates dialogue/UI state; React renders native components. Output is an actual interface change, not a chat bubble claiming completion. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Shared state also supports simultaneous I/O. Speech can refer to an object just clicked; the GUI can expose manipulable results from a spoken query. Annotations and DSL bound reliability by preventing undeclared API calls.

## Evaluate the framework, not only the model

The lecture separately asks whether ReactGenie expresses diverse applications, whether novice developers can integrate it, and how generated multimodal UIs compare with GUI-only interaction. These study summaries do not imply voice improves every application. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Expose only add, complete, and due-date-filter actions in a todo app. Give each typed arguments, retain selected-item state across speech and clicks, then test a cross-modal reference such as “move those two to tomorrow.”

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public deck contains architecture and study summaries, not a full API reference, all demo source, raw study data, or a recording. Autumn 2026 material is not used to fill this Fall 2025 lecture.

## References

- [Lecture 13: Multimodal Applications](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf)
- [React](https://react.dev/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: task-agent architecture](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
