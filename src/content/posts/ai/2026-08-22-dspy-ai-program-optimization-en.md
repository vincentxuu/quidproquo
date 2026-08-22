---
title: "DSPy: Compiling AI Programs with Signatures, Metrics, and Optimizers"
date: 2026-08-22
category: ai
type: deep-dive
tags: [dspy, ai-agent, prompt-optimization, evaluation, machine-learning, python]
lang: en
tldr: "DSPy replaces handwritten prompt strings with task Signatures, execution Modules, and Optimizers that compile better instructions and examples against a dataset and metric."
description: "An introduction to DSPy Signatures, Modules, metrics, optimizers, ReAct, and its boundary with agent orchestration frameworks."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-dspy-ai-program-optimization)

[DSPy](https://dspy.ai/) is a Python framework for building and optimizing AI systems. It can implement ReAct agents, tools, and RAG, but its central question is not “which agent acts next?” It asks whether data and metrics can improve an AI program systematically instead of relying on manual prompt edits.

DSPy separates three concerns. A Signature declares inputs and outputs. A Module chooses a strategy such as Predict, ChainOfThought, or ReAct. An Optimizer compiles the program against a trainset and metric, turning prompts into evaluated artifacts rather than long strings embedded in source code.

## Signatures define task contracts

```python
import dspy

dspy.configure(lm=dspy.LM('openai/gpt-5-mini'))

class Triage(dspy.Signature):
    """Route a support ticket."""
    ticket: str = dspy.InputField()
    urgency: str = dspy.OutputField(desc='low or high')
    team: str = dspy.OutputField()

triage = dspy.Predict(Triage)
result = triage(ticket='Payment failed twice and the card was charged.')
```

The Signature says what to do; the Module says how. The same contract can move from `Predict` to `ChainOfThought` or tool-enabled `ReAct` without rewriting the task.

## Metrics define “better”

An optimizer does not know the business objective. It needs examples and a scoring function: correct classification, required fields, grounded answers, or correct tool use. A bad metric makes the optimizer pursue the wrong target more effectively.

Keep a test set outside compilation. Optimizing and reporting on the same examples confuses overfitting with progress. Record model, DSPy version, dataset, cost, and latency with every experiment.

## An optimizer is not a production runtime

The [official documentation](https://dspy.ai/) includes optimizers such as GEPA and BootstrapFewShot. They can select demonstrations and improve instructions, then save the compiled result. They do not provide checkpoints, scheduling, approval, RBAC, or idempotent side effects.

A DSPy module can live inside LangGraph, Mastra, or an ordinary worker: the outer runtime handles reliable execution, while DSPy improves one model-driven step. `dspy.ReAct` also accepts Python tools, making tool selection itself measurable and optimizable.

## Overall

DSPy fits classification, extraction, RAG, and agent components with representative examples and a computable metric. Without a dataset, collect failures first; without a metric, turn “good” into per-example checks before choosing an optimizer.

Start with a small dataset, split train and test, establish a baseline, compile once, then compare quality, cost, and latency on unseen examples. For orchestration alternatives, read the [agent framework guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en) and the [Stanford CS329Z guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en).

## References

- [DSPy documentation](https://dspy.ai/)
- [DSPy on GitHub](https://github.com/stanfordnlp/dspy)
- [On this site: choosing an agent framework in 2026](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
- [On this site: Stanford CS329Z Engineering AI Agents](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
