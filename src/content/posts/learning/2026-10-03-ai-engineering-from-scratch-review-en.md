---
title: "AI Engineering from Scratch: A Guide to the Free Course That Builds Everything by Hand, from Linear Algebra to Multi-Agent Systems"
date: 2026-10-03
category: learning
type: deep-dive
tags: [ai-course, open-course, self-study, open-source, llm]
lang: en
tldr: "AI Engineering from Scratch is a free, MIT-licensed course on GitHub with about 63k stars: 20 phases and 523 lessons, running from linear algebra, classical ML, and deep learning to LLMs, agents, and AI safety. Each lesson builds the algorithm by hand, then repeats it with a framework. The early math and deep-learning-core phases are worth following step by step; skip the Phase 10 SFT/RLHF/DPO lessons, and treat the rest as a map of topics."
description: "A guide to rohitg00/ai-engineering-from-scratch, an open-source AI engineering course: how each lesson is structured, what the 20 phases teach, who it suits and how long it takes, one lesson (Phase 1 autodiff) walked through end to end, plus the limits to know before you start and what to pair it with."
draft: false
glossary:
  - term: "automatic differentiation"
    aliases: ["autodiff", "autograd"]
    definition: "The program records every operation, then applies the chain rule backward from the output to get the gradient of every parameter. PyTorch, TensorFlow, and JAX train networks this way."
    context: "Used here for the example lesson, Phase 1 lesson 5, which builds a miniature version in roughly a hundred lines of Python and trains XOR with it."
  - term: "gradient checking"
    aliases: []
    definition: "Compare the gradient from automatic differentiation with a numerical estimate (nudge the input a tiny step each way and divide) to confirm the backward pass is right."
    context: "Step 6 of Build It in the example lesson."
  - term: "adversarial verification"
    definition: "The checker starts by assuming the original claim is wrong and actively looks for counter-evidence; a claim stands only if it cannot be refuted."
    context: "Used here to describe how the most serious error claims were re-checked when the course was reviewed."
---

> 🌏 [中文版](/posts/learning/2026-10-03-ai-engineering-from-scratch-review)

[AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) is a free, MIT-licensed AI engineering course on GitHub. Its author, Rohit Ghumare, comes from developer relations; [his site](https://rohitghumare.com/) lists titles such as Docker Captain, CNCF Ambassador, and Google Developer Expert. The course has 20 phases and 523 lessons, running from linear algebra to multi-agent systems and AI safety, and the repo has about 63,000 stars (checked 2026-10-03).

Its method is "build it by hand, then use the framework." Each algorithm first gets a small version in NumPy or the standard library, then the same thing runs through a framework such as PyTorch. By the end you can do more than call an API: you can see what the framework does underneath.

The short verdict: **the early math and deep-learning-core phases are worth following step by step, the Phase 10 training lessons are not, and the other phases work best as a map of topics.** This post first covers the course's structure and contents, then walks one lesson from start to finish, and ends with the limits to know before you start.

## Who it is for, what you need first, how long it takes

The [README](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md) lists two prerequisites: you can write code (any language; Python helps), and you want to understand how AI actually works rather than just call APIs.

Where to start depends on your background. The table below is the README's "Where to start"; the hours are the author's own estimates:

| Background | Start at | README estimate |
|---|---|---|
| New to programming and AI | Phase 0, setup | about 306 hours |
| Know Python, new to ML | Phase 1, math foundations | about 270 hours |
| Know ML, new to deep learning | Phase 3, deep learning core | about 200 hours |
| Know deep learning, want LLMs and agents | Phase 10, LLMs from scratch | about 100 hours |
| Senior engineer, only want agent engineering | Phase 14, agent engineering | about 60 hours |

The README's opening says the whole course takes about 342 hours, which does not quite match the per-start estimates above, so treat both as orders of magnitude. If you want just one topic, the README also lists focused paths: about 23 hours for MCP and about 9.5 hours for Agent Skills.

## What a lesson looks like

Each lesson is a folder: notes in `docs/en.md`, code in `code/`, artifacts in `outputs/`, and usually a `quiz.json`. The notes follow a fixed shape from the [lesson template](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/LESSON_TEMPLATE.md):

1. **Motto**: one sentence with the core idea.
2. **The Problem**: where you get stuck without this.
3. **The Concept**: diagrams and intuition, no code yet.
4. **Build It**: a step-by-step implementation from scratch.
5. **Use It**: the same thing with a framework or library, compared against your hand-built version.
6. **Ship It**: a reusable artifact, such as a prompt, skill, agent, or MCP server.

Exercises, a key-terms table, and further reading follow.

## Content map: what the 20 phases teach

This is drawn from the repo's [phases directory](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases) and the README's lesson lists. The number in parentheses is the lesson count.

| Phase | Topic | What it mainly teaches |
|---|---|---|
| 0 | Setup & Tooling (12) | Dev environment, Git, GPU and cloud, API keys, Jupyter, Docker, terminal, debugging and profiling |
| 1 | Math Foundations (22) | Linear algebra, calculus, chain rule and autodiff, probability and Bayes, optimization, information theory, SVD, Fourier, graph theory |
| 2 | ML Fundamentals (18) | Linear and logistic regression, decision trees, SVM, kNN, feature engineering, model evaluation, ensembles, time series, anomaly detection |
| 3 | Deep Learning Core (13) | Perceptron, backpropagation, activations and losses, optimizers, regularization, a mini framework, PyTorch, JAX |
| 4 | Computer Vision (28) | Convolutions and CNNs, detection and segmentation, GANs and diffusion, ViT, CLIP, OCR, 3D (NeRF, Gaussian Splatting), world models |
| 5 | NLP (29) | Text processing, word embeddings, seq2seq and attention, translation and summarization, retrieval, structured output, RAG chunking, evaluation |
| 6 | Speech & Audio (17) | Spectrograms and mel features, ASR and Whisper, speaker recognition, TTS, music generation, real-time speech, neural codecs, watermarking |
| 7 | Transformers Deep Dive (16) | Self-attention, multi-head, positional encoding, BERT and GPT, MoE, KV cache and FlashAttention, scaling laws |
| 8 | Generative AI (15) | VAE, GAN, DDPM, latent diffusion, ControlNet and LoRA, video/audio/3D generation, flow matching |
| 9 | Reinforcement Learning (12) | MDPs, dynamic programming, Q-learning, DQN, policy gradients, actor-critic, PPO, reward modeling |
| 10 | LLMs from Scratch (24) | Tokenizers, data pipelines, pre-training a mini-GPT, SFT, RLHF, DPO, quantization, inference optimization, a DeepSeek-V3 walkthrough |
| 11 | LLM Engineering (17) | Prompting and few-shot, structured outputs, embeddings, context engineering, RAG, LoRA fine-tuning, guardrails, LangGraph |
| 12 | Multimodal AI (25) | CLIP, BLIP-2, LLaVA, Qwen-VL, Chameleon, any-to-any models, VLAs, ColPali, computer use |
| 13 | Tools & Protocols (31) | Function calling, tool schemas, MCP (servers, clients, transports, authorization, security), A2A, Agent Skills |
| 14 | Agent Engineering (54) | The agent loop, Reflexion, memory, agent frameworks and SDKs, benchmarks, observability, the agent workbench, product judgment |
| 15 | Autonomous Systems (22) | Long-horizon agents, AlphaEvolve, self-improvement, permission modes, durable execution, kill switches, safety frameworks |
| 16 | Multi-Agent & Swarms (25) | Communication protocols, supervisor and hierarchical designs, debate, handoffs, blackboards, consensus, MARL, failure modes |
| 17 | Infrastructure & Production (28) | vLLM and SGLang, GPU autoscaling, quantization, caching and routing, gateways, canary releases, SRE, FinOps |
| 18 | Ethics, Safety & Alignment (30) | Reward hacking, sycophancy, alignment faking, red teaming, jailbreaks, fairness, differential privacy, watermarking, regulation by region |
| 19 | Capstone Projects (85) | 17 end-to-end projects plus 9 deep-build tracks (tokenizer to GPT, distributed training, RAG, evals, safety gates) |

The split of Phase 19 into projects and tracks comes from the [README's Phase 19 description](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md). For a phase's full lesson list, open that phase's README.

## One lesson, start to finish: Phase 1 lesson 5, "Chain Rule & Automatic Differentiation"

The lesson lives in [`phases/01-math-foundations/05-chain-rule-and-autodiff`](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff). Its notes mark it as Type Build, language Python, prerequisite the previous lesson on derivatives and gradients, about 90 minutes. It sets four learning objectives:

- Build a minimal autograd engine that records operations and computes gradients with reverse-mode autodiff.
- Run forward and backward passes over a computation graph using a topological sort.
- Train a multi-layer perceptron on XOR using only that engine.
- Check the autodiff result against numerical finite differences.

**Motto.** One line: "The chain rule is the engine behind every neural network that learns."

**The Problem.** A neural network is hundreds of functions composed together, and training needs the gradient of the loss with respect to every weight. Doing that by hand is impossible, and numerical differentiation is too slow. The chain rule supplies the math and automatic differentiation supplies the algorithm; the notes say together they give exact gradients through arbitrary compositions in time proportional to a single forward pass.

**The Concept.** Mermaid diagrams draw the computation graph of `relu(x1*x2 + 1)`: values flow forward, gradients flow backward. The notes then compare forward and reverse mode. Forward mode suits few inputs and many outputs; a neural network has millions of weights and one loss, so backprop uses reverse mode. The notes also cover forward mode with dual numbers and what PyTorch's `autograd` does under the hood.

**Build It.** Seven steps:

1. Write a `Value` class that stores data, gradient, a backward function, and its child nodes.
2. Add `+`, `*`, and `relu`. Each operation carries a closure that knows its local gradient. Gradients accumulate with `+=`, because one value can feed several operations.
3. Write `backward()`: topologically sort the graph, set the seed gradient to 1.0, and walk it in reverse.
4. Add subtraction, power, division, `exp`, `log`, and `tanh`. Subtraction and division are built from existing operations, so their gradients come out right for free.
5. Assemble `Neuron`, `Layer`, and `MLP`, then train on XOR (2-4-1 network, learning rate 0.05, 100 steps).
6. Run gradient checking: compare `(f(x+h) - f(x-h)) / 2h` with the autodiff result.
7. Verify `relu(x1*x2 + 1)` by hand: `dy/dx1 = 3` and `dy/dx2 = 2`.

I ran `code/autodiff.py` in an environment without PyTorch. The XOR loss fell from 4.1491 at step 0 to 0.1783 at step 99. The four predictions were -0.853, +0.771, +0.801, and -0.753 against targets of -1, +1, +1, and -1, so every sign was right. The five gradient checks differed by between 1e-9 and 1e-10.

**Use It.** The same expression is redone in PyTorch: set `requires_grad=True` on `x1` and `x2`, call `backward()`, and the notes' comments give the same gradients, 3.0 and 2.0. I did not run this part because the environment has no PyTorch; `code/autodiff.py` is written to skip that step when PyTorch is missing.

**Ship It.** Two things come out: `code/autodiff.py`, an engine you can extend, and [`outputs/skill-autodiff.md`](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff/outputs/skill-autodiff.md). The latter is an agent skill with a checklist for debugging gradients: forgetting to zero gradients before each backward pass, in-place operations that break the graph, and `.item()` or `.detach()` taking a tensor off the graph. The notes close by saying this `Value` class is the base for the Phase 3 training loop.

The lesson ends with four exercises (for example, implement forward mode with dual numbers and check it against the reverse-mode engine) and a 5-question quiz.

## Limits to know before you start

I had AI agents read the notes lesson by lesson, run the code, and then adversarially re-check the most serious error claims. Both the reviewers and the re-checkers were AI, and the re-check covered only the most serious, directly checkable claims. Secondary dates, attributions, and benchmark numbers were not verified one by one, so the false-positive rate does not generalize. The conclusions below are good for relative usability, not for absolute scores.

- **The Phase 10 SFT, RLHF, and DPO lessons do not actually train.** The [SFT lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/06-instruction-tuning-sft/code/main.py#L157-L160) updates weights with `block.ffn.W1 -= lr * np.random.randn(*block.ffn.W1.shape) * 0.01`, which is random noise. The [RLHF lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/07-rlhf/code/main.py#L261-L266) and [DPO lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/08-dpo/code/main.py#L195-L201) follow the same pattern, with the noise scaled by a reward or preference-direction factor. The code runs to completion, yet the notes describe it as a gradient update, so a learner following along would conclude that adding noise to weights is training.
- **Strong early phases, thinner later ones.** Phase 1 is the most solid, and [autodiff](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff), [statistics](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/15-statistics-for-ml), and [linear systems](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/17-linear-systems) can be used directly. Phases 2–9 are hand-built early and lean on stubs later. The training lessons in Phases 10–12 are mostly not real and work only as a concept tour. None of the 54 lessons in Phase 14 calls a real LLM. Phases 15–18 read more like topic lists, and the Phase 19 capstones mostly do not import code from earlier phases.
- **Check the numbers and facts yourself.** The [KV cache lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md?plain=1#L41) drops the factor of 32 heads for a 7B model: it says 16 KB per token, and the real figure is 512 KB. The [music generation lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/06-speech-and-audio/09-music-generation/docs/en.md?plain=1#L24) labels MusicGen as MIT, but the [Hugging Face model card](https://huggingface.co/facebook/musicgen-large) says the code is MIT and the weights are CC-BY-NC 4.0. The [AI governance lesson](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/15-autonomous-systems/22-cais-caisi-societal-risk/docs/en.md?plain=1#L3) still says "California SB-53, if signed," while the [Governor's Office](https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry) announced the signing on 2025-09-29. Security claims deserve even less trust: [lesson 49](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/19-capstone-projects/49-lm-eval-harness/code/main.py#L209-L223) swaps out `__builtins__` and claims model output cannot reach the filesystem, yet during verification `().__class__.__base__.__subclasses__()` led to the `os` module and listed the root directory.
- **The rewritten Phase 13 lessons are usable.** Lessons 06–18 and 22–31 were rebuilt against the [MCP 2026-07-28 spec](https://blog.modelcontextprotocol.io/posts/2026-07-28) and come with tests, for example [Streamable HTTP](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/13-tools-and-protocols/09-mcp-transports) and [cancellation and flow control](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/13-tools-and-protocols/29-mcp-reliability-cancellation-and-flow-control). Lessons 01–05 and 19–21 still use the old template, so skip them for now.

## How to use it and what to pair it with

- **To fill in math and deep-learning basics**: start at Phase 1 or Phase 3 using the table above. Write each Build It yourself first, then compare with the notes; when they disagree, check before you doubt yourself.
- **To get a tutor walking you through it**: in an environment with Node.js and a coding agent, run `npx skills add rohitg00/ai-engineering-from-scratch`. In Claude Code, type `/start-learning`; in Codex, pick `start-learning` from `/skills`. The [README](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md) has the details.
- **To learn LLM training**: skip the Phase 10 SFT, RLHF, and DPO lessons and watch [Karpathy's Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) instead.
- **To learn agent frameworks**: pair it with the [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) or [Microsoft's ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners); both actually call LLMs.
- **To learn MCP**: read the rewritten Phase 13 lessons with the [official spec](https://modelcontextprotocol.io/specification/2026-07-28) open beside them.
- **To compare against university coursework and exam feedback**: see this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) and the [Berkeley CS189 version map](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en).

## Update log

- 2026-10-03: Rewritten as a course introduction. Added the course structure, a content map of every phase, who it suits and how long it takes, a Phase 1 lesson 5 walkthrough, and pairing advice. The audit findings shrank into "Limits to know before you start"; the audit flowchart, the claims-versus-reality table, and the long error list were removed. Star count updated to 63k.

## References

- [rohitg00/ai-engineering-from-scratch (revision 3be078b, used for this guide)](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b)
- [AI Engineering from Scratch README (revision 3be078b)](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md)
- [AI Engineering from Scratch lesson template, LESSON_TEMPLATE.md](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/LESSON_TEMPLATE.md)
- [Phase 1 lesson 5: Chain Rule & Automatic Differentiation](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff)
- [AI Engineering from Scratch website](https://aiengineeringfromscratch.com/)
- [Rohit Ghumare's personal site](https://rohitghumare.com/)
- [Model Context Protocol: The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28)
- [MCP 2026-07-28 specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [facebook/musicgen-large model card (Hugging Face)](https://huggingface.co/facebook/musicgen-large)
- [Governor Newsom signs SB 53 (California Governor's Office, 2025-09-29)](https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry)
- [Andrej Karpathy: Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)
- [Hugging Face AI Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction)
- [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners)
