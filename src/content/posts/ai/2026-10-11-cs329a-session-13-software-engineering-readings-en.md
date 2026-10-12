---
title: "Software Engineering Agents: A Reading Guide | Stanford CS329A Lecture 13"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 9
description: "Use CodeMonkeys, KernelBench, and parallel-program interfaces to select patches and compare valid speedups."
tldr: "Program candidates need requirement-based counterexamples; speed matters only after correctness checks pass."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cs329a-session-13-software-engineering-readings)

Executable code may solve the wrong problem; faster code may simply skip required work. [CS329A](https://cs329a.stanford.edu/) Autumn 2025 session 13 pairs issue resolution with GPU optimization to separate correctness from performance. This is an explanation based on assigned papers, not a reconstruction of the spoken lecture. You should understand test results and know that a GPU kernel performs computation on a GPU; writing kernels is not a prerequisite.

Start with [Lecture 4 on tool and code feedback](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback-en) for the execution-feedback loop.

**Video status: The official schedule does not list a recording.** The nine public videos checked on 2026-10-11 did not include this session. That does not prove a recording is absent.

## CodeMonkeys: generation still needs selection

[CodeMonkeys](https://arxiv.org/abs/2501.14723) identifies relevant files, then generates parallel editing trajectories. Each trajectory develops a patch and testing script, using execution feedback to revise candidates. Generated tests and model-based selection help choose the final patch. More candidates can improve the chance that at least one is correct, but the selector can still discard it. Coverage is not the final solve rate.

Generated tests can share the patch generator's blind spots. If an issue requires handling empty inputs but every test uses a nonempty input, passing more tests does not demonstrate compliance. Translate requirements into independent checks rather than letting candidates define their own success.

## A complete selection example

This original example is not a reported experiment. An issue requires sorting while preserving duplicates and returning an empty list for empty input. A sorts after converting to a set; B sorts directly; C returns null for empty input. Initial generated tests use only `[3,1]`. All three return `[1,3]` and tie.

Add `[2,2,1]`: A returns `[1,2]`, losing a duplicate; B and C return `[1,2,2]`. Add `[]`: C returns null, while B returns `[]`. B satisfies these two explicit constraints; A and C each fail a distinguishing counterexample. This does not prove B correct for every type. It shows that selection used tests aligned with the requirements.

Selecting A first and asking the same model to explain why A is reasonable may yield post-hoc justification. Define the criteria before the competition so that the search budget explores different solutions rather than different explanations.

## KernelBench: correctness before speed

[KernelBench](https://arxiv.org/abs/2502.10517) asks models to generate GPU kernels for reference PyTorch computations, checks output correctness, and measures performance. Fusion can reduce intermediate tensors and memory traffic, but shapes, numerical tolerance, device synchronization, and measurement procedures affect the conclusion. Shorter code is not a speed measurement; one timed run is not stable performance evidence.

Continue the original example: the reference takes 10 milliseconds. X takes 2 but fails on duplicate inputs. Y takes 5 and passes the predefined correctness checks. X has a nominal speedup of 10/2=5 but is ineligible. Y's 10/5=2 speedup is a valid performance candidate. Apply the correctness gate before comparing speed to avoid selecting an incorrect shortcut.

## Interfaces shape the search

[Improving Parallel Program Performance with LLM Optimizers](https://arxiv.org/abs/2410.15625) studies expressing parallel-program mapping decisions through a domain-specific language and system interfaces. A constrained, checkable representation focuses the model on legal configurations. Compiler, test, and performance feedback guide subsequent changes. The title has changed across versions; this guide follows the method attached to this arXiv ID, not a universal guarantee for software projects.

All three approaches need feedback that identifies an actionable revision. A bare “failed” message without inputs, expected outputs, or compiler diagnostics encourages arbitrary changes. The tool interface defines which actions can be expressed and which errors become visible.

## Variation check and answer

Z passes the two original checks and takes 4 milliseconds, but supports only inputs shorter than eight elements. The requirement has no length limit. Can Z replace Y? **Not directly.** Add boundary and larger-input correctness tests, then compare speed on the same device, inputs, and measurement procedure. If short inputs were explicitly the entire supported domain, Z might qualify. Changing the requirement is distinct from fixing the code.

Tonight, add three columns to your candidate table: requirement counterexamples, correctness results, and performance after passing. Write independent tests for duplicates, empty inputs, and boundaries before increasing parallel candidates. Without selection criteria, extra generation increases review work.

## English reading and expression

Original practice sentences: *A faster candidate is useful only after it passes the correctness gate.* *Generated tests may share the patch's blind spots.* This is reading and expression practice, without audio shadowing.


## References

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [CodeMonkeys](https://arxiv.org/abs/2501.14723)
- [KernelBench](https://arxiv.org/abs/2502.10517)
- [LLM optimization of parallel-program interfaces](https://arxiv.org/abs/2410.15625)
