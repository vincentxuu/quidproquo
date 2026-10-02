---
title: "CMU 10-423 L23: Code Generation and Autonomous Agents — From pass@k to the Coding Agent Loop"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, code-generation, coding-agent, tool-use, agent-evaluation, computer-use-agent]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 21
tldr: "CMU 10-423 Lecture 23 has two halves. The first covers code generation: evaluation moved from BLEU to counting passed unit tests, benchmarks run from HumanEval and MBPP to SWE-Bench Verified and Terminal-Bench 2.0, models run from CodeBERT and Codex to FIM and StarCoder, and the code-specific trick is self-correction driven by unit test output. The second half covers agents: what tool calling is, how Kimi K2 synthesizes tool-use data, the five-step coding agent loop, and web and GUI agents such as Mind2Web, Set-of-Mark, and SeeClick. There is no homework for this lecture; only Quiz 6 tests it."
description: "A guide to Lecture 23 of CMU 10-423/623/723 Generative AI (Spring 2026): applications of code models, metrics and benchmarks (BLEU, CodeBLEU, pass@k, HumanEval, MBPP, SWE-Bench Verified, Terminal-Bench 2.0), representative code models (CodeBERT, Codex, CodeT5, InCoder/FIM, StarCoder, LongCoder), unit-test-driven self-refinement, tool calling and Kimi K2, the coding agent loop and its system prompts, and web/GUI agents including Mind2Web, Set-of-Mark, and SeeClick."
draft: false
glossary:
  - term: "pass@k"
    aliases: ["pass at k"]
    definition: "Sample k programs for the same problem; the problem counts as solved if any one of them passes every unit test. pass@k is the fraction of problems solved. In practice more samples are drawn and the metric is estimated to reduce variance."
    context: "The main metric CMU 10-423 Lecture 23 uses when introducing HumanEval."
    links:
      - label: "Chen et al. 2021 (Codex / HumanEval)"
        url: "https://arxiv.org/abs/2107.03374"
  - term: "FIM"
    aliases: ["fill-in-the-middle"]
    definition: "Split code into a prefix, a middle, and a suffix, and train on the order prefix, suffix, middle. A causal language model that only generates left to right can then fill in the span at the cursor."
    context: "CMU 10-423 Lecture 23 uses it to answer how a causally masked LM can fill in code in the middle of a file."
    links:
      - label: "Bavarian et al. 2022: Efficient Training of Language Models to Fill in the Middle"
        url: "https://arxiv.org/abs/2207.14255"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-code-generation-agents)

**This post is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 21 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and follows [L22 + L26: practical risks and the science of alignment](/posts/ai/2026-09-30-cmu10423-risks-alignment-en). It covers Lecture 23, "Code Generation / Autonomous Agents," given by Matt Gormley on April 8, 2026.

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf) (55 pages), and the [inked in-class version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code-ink.pdf) (55 pages). The inked version has the same text plus red pen marks from class. The schedule lists no readings for this lecture, and this post does not add any. The course's access grade is **A3** (definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)), but the recordings sit behind a CMU Panopto login, so this post is written entirely from the slides.

The lecture asks a practical question: **when a model writes code, or operates a computer on its own, how do you tell whether it did the right thing, and how do you wrap it in a system that can keep trying?** The deck has seven parts: applications, evaluation, code models, code-specific techniques, tool calling, coding agents, and autonomous agents. The first four are about the model. The last three are about the system around it.

## What code generation is for

The deck opens by contrasting two people pair programming with a person coding alongside an LLM, then lists applications of code models:

- Autocomplete in IDEs (for example GitHub Copilot)
- Writing functions or classes from a text prompt or a docstring
- Reading a large codebase and adding a feature
- Finding and fixing bugs, writing unit tests
- Translating code between languages, commenting existing code

On the data side, it gives two examples. [Dolma](https://allenai.github.io/dolma/) is a 3-trillion-token text dataset assembled from existing sources. [The Stack](https://arxiv.org/abs/2211.15533) is 3TB of permissively licensed code meant for LLMs. The point: most LLM training data already mixes in many programming languages, so coding ability falls out of ordinary pre-training rather than needing a model trained from scratch.

## Evaluating code: from "looks similar" to "actually runs"

### Three metrics

| Metric | What it measures | The deck's verdict |
|---|---|---|
| BLEU | n-gram overlap with a reference (borrowed from machine translation) | Codex paper results show it is not a good surrogate |
| [CodeBLEU](https://arxiv.org/abs/2009.10297) | A mix of n-gram, syntax tree, and data-flow matching | Still compares against a reference |
| Functional correctness | How many unit tests pass | Now the dominant metric |

The shift makes sense: two programs written completely differently can both be correct, and a program one character away from the reference can be completely wrong.

### Five benchmarks

| Benchmark | What it is | Scale noted on the slides |
|---|---|---|
| [HumanEval](https://arxiv.org/abs/2107.03374) | Released with Codex, scored by pass@k | 164 handwritten problems |
| [MBPP](https://arxiv.org/abs/2108.07732) | Python problems a novice could solve; each has a statement, 3 tests, and a solution | 974 problems, crowd-sourced |
| DS-1000 | Named only, not discussed | — |
| [SWE-Bench](https://arxiv.org/abs/2310.06770) Verified | Resolve real GitHub issues by producing a patch, scored with the repo's unit tests against the reference fix | The original filtered 90k PRs from 12 popular Python repos down to 2,294 tasks; Verified is a human-validated subset of 500 |
| [Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868) | Interactive command-line tasks, each with a Docker container, English instructions, tests on the final container state, and a reference solution | 89 tasks, each verified by 3 humans |

pass@k is the fraction of problems where at least one of k samples passes all tests. The slide notes that the actual estimate draws more samples to cut variance.

SWE-Bench's filters are worth remembering. A PR has to resolve an issue, has to touch tests, and has to flip at least one test from failing to passing. Together those rules give every task an executable acceptance check. Terminal-Bench 2.0's two example tasks show how varied it is. One asks the agent to build POV-Ray 2.2 from source, install it, and render a test scene to compare against a reference image. The other asks it to read a chessboard from an image and write White's best move to a file in algebraic notation.

## Six representative code models

| Model | What the slides highlight |
|---|---|
| [CodeBERT](https://arxiv.org/abs/2002.08155) | An early success: 125M parameters, same architecture as RoBERTa; pre-trained with masked LM plus replaced token detection; example use is natural-language code retrieval |
| [Codex](https://arxiv.org/abs/2107.03374) | The original model behind GitHub Copilot: a 12B GPT-3 fine-tuned on 159GB of Python. Starting from pre-trained GPT-3 did not improve final performance, but it converged faster |
| [CodeT5](https://arxiv.org/abs/2109.00859) | Built on the T5 encoder-decoder and, like T5, trained on many tasks at once |
| [InCoder](https://arxiv.org/abs/2204.05999) / [FIM](https://arxiv.org/abs/2207.14255) | Answers how a left-to-right model can fill in the middle; see below |
| StarCoder | Once one of the best open code models; pre-trained with FIM, 15.5B parameters, 1 trillion tokens |
| LongCoder | Targets large codebases with sparse attention over long inputs |

FIM is the idea in this section most worth understanding. InCoder (April 2022) places a mask token where the code should go. FIM (July 2022) splits code into prefix, middle, and suffix, and trains on:

```text
<PRE> prefix <SUF> suffix <MID> middle
```

At prediction time you stop at `<MID>` and the model generates the middle. Because the order is rearranged, the model has already "seen" the suffix before writing the middle, and the ordinary causal mask stays as it is. That is exactly what IDE completion needs: code on both sides of the cursor.

## A code-specific trick: unit tests as feedback

The deck first names a counterexample. On ordinary reasoning problems, asking an LLM to check and correct itself usually does not help. Code is different because the model can see unit test output. Feeding failing test messages back and refining at test time works very well.

This observation ties the two halves together. Being able to execute code and get objective feedback is what makes the code domain special, and the coding agents later in the lecture automate exactly that write, run, inspect, revise cycle.

## Tool calling: the model asks, the system acts

The slide defines tool calling in five points:

1. It lets an LLM choose and invoke external functions instead of only generating text.
2. A tool usually has a name, a description, and a schema for its arguments.
3. The model decides when a tool is needed, emits a structured call, gets the result back, and keeps reasoning.
4. It is useful for actions or grounded data, like checking weather, querying a database, sending email, or doing calculations.
5. The model does not perform the action itself. It asks the surrounding system to run the tool.

Point 5 is the one people skip. Permissions, review, and error handling all live on the system side; the model only makes requests.

The deck then uses [Kimi K2](https://arxiv.org/abs/2507.20534) to show how tool skills get trained into a model:

- **Synthetic SFT data**: build a large repository of tool specs (real MCP tools plus synthetic ones), then generate agents, tasks, and successful tool-calling trajectories.
- **Joint RL**: reinforcement learning in real and synthetic environments, so the model learns tool selection and sequencing from interaction outcomes rather than imitation alone.
- **At inference**: every request carries the list of available tools, and the model decides on its own when and how to call them.

## Coding agents: a loop that keeps trying

The deck uses a figure from [OpenHands](https://openhands.dev/blog/agent-control-plane) to show what a coding agent is and cites [CodeAct](https://arxiv.org/abs/2402.01030), where the agent's actions are executable code. The core is a five-step loop:

1. **Understand the goal**: read the task, the codebase, and the relevant files.
2. **Plan the next step**: pick a concrete action such as inspecting code, editing a file, running tests, or searching docs.
3. **Act**: change the code or call a tool.
4. **Observe feedback**: read compiler errors, test results, logs, or tool output.
5. **Revise**: update its understanding and decide what to try next.

The loop runs until the task is solved, the agent gets stuck, or a stopping condition hits. The slide's compact form: read → plan → edit/run → inspect results → repeat.

### What the system prompts look like

One slide reproduces the [OpenHands system prompt](https://github.com/OpenHands/OpenHands/blob/754a96e7f33c68f55e7323d37f83234846cef519/openhands/agenthub/codeact_agent/prompts/system_prompt.j2) in full, and the next shows the [Codex CLI base instructions](https://github.com/openai/codex/blob/d90a3488704c6a2d0a3f50c3a17c9e1a52a7ddd9/codex-rs/protocol/src/prompts/base_instructions/default.md). The OpenHands prompt is organized into role, efficiency, file system, code quality, version control, pull requests, and problem-solving workflow. A few concrete rules:

- If the user asks "why is X happening," answer the question and don't try to fix anything.
- Every action costs something, so combine commands where possible.
- Don't create multiple suffixed versions of the same file; edit the original.
- Don't push to a remote or open a PR unless explicitly asked.

Almost all of these rules deal with the agent doing things the user didn't ask for. It reads like a code of conduct more than a capability spec.

### Multiple agents and three hard problems

The multi-agent slide borrows a figure from Anthropic's [2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf), going from a single agent to coordinated teams of agents. Then the deck lists the key challenges in building a coding agent:

| Challenge | What the slide says |
|---|---|
| Code search | If you can't find a bug, you can't fix it; if you don't know where a feature belongs, it's hard to implement |
| Editing code | This is the fundamental code generation problem: once the right location is found, generate a patch |
| Training data | Two sources: RL rollouts of full solution trajectories, or synthetic trajectories (e.g. [SERA](https://arxiv.org/abs/2601.20789)); consider the latter if you're low on compute |

## Autonomous agents: operating the web and GUIs

The last part extends agents from code to web pages and graphical interfaces.

**[Mind2Web](https://arxiv.org/abs/2306.06070)** interacts with web pages by reading their HTML directly. It uses two models: a ranking LM narrows the page elements to candidates, and a prediction LLM decides which element to act on and how.

**VLM agents** look at screenshots instead. According to the slide, these systems usually have two parts: a visual grounding model that decides where to click or type next, and a GUI agent model that steers the whole interaction toward the goal.

**[Set-of-Mark prompting](https://arxiv.org/abs/2310.11441)** labels the semantically meaningful regions of an image with numbers, drawn directly into the pixels, so the prompt can refer to them. The slides then pose and answer two questions:

- How do you find the regions? Use an off-the-shelf segmentation model such as [Segment Anything](https://segment-anything.com/demo).
- Does it work with any VLM? Not necessarily. The paper found GPT-4V could interpret and ground itself in the marks, while LLaVA-1.5 and MiniGPT-v2 could not.

**[SeeClick](https://arxiv.org/abs/2401.10935)** trains an off-the-shelf VLM (Qwen-VL) to perform individual actions from the screenshot alone.

The final slide covers training agents with RL. There are many ways to complete a task, so imitating one human's attempt is a poor target. RL instead gives a positive reward at the end if the task succeeds.

## How the course tests this lecture

- **Quiz 6**: in class on April 20 per the schedule, covering L21–L24. The questions are not public.
- **Homework**: there are no programming assignments after L15, so nothing maps to this lecture.
- **Practice exam**: the [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) was released ahead of the March 30 exam. Its 13 sections stop at Scaling Laws and do not cover this lecture.
- **HW623**: the [paper list](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) for 10-623/723 students includes several papers tied to this lecture, such as [ToolLLM](https://arxiv.org/abs/2307.16789), [DeepSeek-Coder](https://arxiv.org/abs/2401.14196), [WebArena](https://arxiv.org/abs/2307.13854), [AutoGen](https://arxiv.org/abs/2308.08155), and [CRITIC](https://arxiv.org/abs/2305.11738). How HW623 works is in [part 23](/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en).

**Try this tonight**: pick three problems from [MBPP](https://arxiv.org/abs/2108.07732), have the model you use most generate 5 solutions for each, run the 3 bundled tests yourself, and compute pass@1 and pass@5. Then paste one failing solution back with its error message and ask for a single fix. You'll see whether the slides' "unit test feedback" claim holds in your hands.

## What this post can and cannot confirm

Confirmed: schedule dates and titles, the text of the slides and the inked version, and the papers and URLs the slides cite. Not confirmed: anything said aloud in class (Panopto requires a login), the Quiz 6 questions, and details that appear only in figures (for example the growth chart of LLM-based autonomous agents, the multi-agent architecture diagram, and the SWE-Bench Verified score trend). The slide says "In November 2024, Claude 2.0 only solved 1.96% of issues," but the SWE-Bench paper's arXiv ID dates it to October 2023 (2310.06770). The year looks like a slide typo, so this post keeps the 1.96% figure's source and drops the slide's date.

Further reading: on this site, [CME295 Lecture 7: Agentic LLMs](/posts/ai/2026-09-29-cme295-agentic-llms-en) goes from RAG and function calling to the agent loop, and [CME295 2026 Lecture 6: AI Agents](/posts/ai/2026-09-29-cme295-ai-agents-en) covers context management and harnesses. To read agents as a whole course, see [Reading CMU 11-768](/posts/ai/2026-09-29-cmu-11768-course-overview-en).

Series navigation: previous [L22 + L26: practical risks and the science of alignment](/posts/ai/2026-09-30-cmu10423-risks-alignment-en) | next [L24–L26: audio, video generation, and interactive world models](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (Lecture 23 and Quiz 6 scope)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 23 slides: Code Generation + LLMs / VLMs as Autonomous Agents](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf)
- [Lecture 23 slides (inked in-class version)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code-ink.pdf)
- [Chen et al. 2021: Evaluating Large Language Models Trained on Code (Codex, HumanEval)](https://arxiv.org/abs/2107.03374)
- [Austin et al. 2021: Program Synthesis with Large Language Models (MBPP)](https://arxiv.org/abs/2108.07732)
- [Jimenez et al. 2023: SWE-bench](https://arxiv.org/abs/2310.06770)
- [Merrill et al. 2026: Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/abs/2601.11868)
- [Ren et al. 2020: CodeBLEU](https://arxiv.org/abs/2009.10297)
- [Feng et al. 2020: CodeBERT](https://arxiv.org/abs/2002.08155)
- [Wang et al. 2021: CodeT5](https://arxiv.org/abs/2109.00859)
- [Fried et al. 2022: InCoder](https://arxiv.org/abs/2204.05999)
- [Bavarian et al. 2022: Efficient Training of Language Models to Fill in the Middle](https://arxiv.org/abs/2207.14255)
- [Wang et al. 2024: Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [Shen et al. 2026: SERA: Soft-Verified Efficient Repository Agents](https://arxiv.org/abs/2601.20789)
- [Kimi Team 2025: Kimi K2: Open Agentic Intelligence](https://arxiv.org/abs/2507.20534)
- [Kocetkov et al. 2022: The Stack](https://arxiv.org/abs/2211.15533)
- [Deng et al. 2023: Mind2Web](https://arxiv.org/abs/2306.06070)
- [Yang et al. 2023: Set-of-Mark Prompting](https://arxiv.org/abs/2310.11441)
- [Cheng et al. 2024: SeeClick](https://arxiv.org/abs/2401.10935)
- [OpenHands system prompt (version cited on the slides)](https://github.com/OpenHands/OpenHands/blob/754a96e7f33c68f55e7323d37f83234846cef519/openhands/agenthub/codeact_agent/prompts/system_prompt.j2)
- [Codex CLI base instructions (version cited on the slides)](https://github.com/openai/codex/blob/d90a3488704c6a2d0a3f50c3a17c9e1a52a7ddd9/codex-rs/protocol/src/prompts/base_instructions/default.md)
- [Anthropic: 2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [HW623 handout (paper list)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
