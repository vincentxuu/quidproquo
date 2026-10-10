---
title: "Reading NTU ML 2026: Harness Engineering — Making Models Stronger Without Touching the Weights"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, ai-agent, harness-engineering, agents-md, agent-evaluation]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 11
tldr: "Hung-yi Lee opens with a small model fixing a bug. gemma-4-E2B-it can't find parser.py, so it writes a fake one and declares victory. Add three short sections (the current environment, how to work, what counts as done) and the same model runs ls, cat, edits the file and runs the tests. The lecture splits the harness into three levers: natural language shapes the model's frame of mind (AGENTS.md), tools set its capability boundary (SWE-agent's ACI, rewriting CLIs for agents), and workflows control its behavior (the Ralph loop, Anthropic's long-running harnesses). The second half covers three extensions: scolding an agent can backfire, how a life-long agent learns from verbal feedback, and why evaluating agents is hard. It ends with agents improving their own harness (Meta-Harness)."
description: "A guide to the 4/10 lecture \"how to educate a model, part 1\" of NTU Machine Learning 2026 Spring (Hung-yi Lee), based on the 63-page harness.pdf and the lecture video: the gemma-4-E2B-it parser.py demo, harness vs. context engineering, AGENTS.md studies, SWE-agent's ACI, rewriting CLIs for AI agents, the Ralph loop, planner/generator/evaluator and context anxiety, Anthropic's emotions research and steering, life-long agents and verbalized feedback, τ-bench and the Sim2Real gap, the PinchBench teaching demo, and Meta-Harness."
draft: false
glossary:
  - term: "Harness"
    aliases: ["agent harness"]
    definition: "The layer of code and rules around a language model that decides what it sees, which tools it can use and what process it follows; AI Agent = LLM + harness."
    context: "The slides draw OpenClaw, Claude Code and Cowork as harnesses, and give two ways to improve an agent: train a better model, or build a better harness."
  - term: "Ralph loop"
    aliases: ["Ralph Wiggum loop"]
    definition: "A workflow that feeds the same task to an LLM over and over, attaching evaluation feedback on the previous output each round, until the result passes."
    context: "The slides cite Geoffrey Huntley's posts and also draw a variant that restarts the context every round and carries over only a summary."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide follows the 4/10 materials of [NTU Machine Learning 2026 Spring by Hung-yi Lee](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 11 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous two lectures went inside the model: [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) and [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en). The previous part, [HW4](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en), had you train a Transformer. This lecture opens a new unit that the schedule calls "how to educate a model". **The model is already trained. What can humans still do to make it perform better?**

The official materials are the slides [harness.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pdf) (63 pages, also as [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pptx)) and the video [Harness Engineering: sometimes the language model isn't dumb, it just wasn't guided well](https://youtu.be/R6fZR_9kmIw) (in Mandarin). Access level is **A3**: slides and recording are public, and this lecture has no quiz or leaderboard.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=R6fZR_9kmIw
title: Video: Harness Engineering: sometimes the language model isn't dumb, it just wasn't guided well
```

Original videos: [Video: Harness Engineering: sometimes the language model isn't dumb, it just wasn't guided well](https://www.youtube.com/watch?v=R6fZR_9kmIw)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

Checked: 2026-10-10.

## The demo: a small model that fakes its own files

Slides 2–4 set up a concrete task. Fix `extract_emails` in `parser.py` so it catches addresses with `-` or `_`, such as `test-user@domain.com`, and make the tests in `verify.py` pass. The system prompt only says: you may write bash or python code blocks, the system will run them and return the output, and you should print DONE when finished.

gemma-4-E2B-it responds with "parser.py wasn't provided… I'll write one myself". It writes a new `extract_emails` and a few tests it made up, then prints DONE.

Slides 5–6 add just three sections:

- **[CONTEXT]**: you are in a Linux environment (Google Colab) and need to find and modify the right files. This covers "the current environment".
- **[INSTRUCTIONS]**: before changing anything, inspect the working directory, system environment and file tree; list the relevant files; never edit a file you haven't read. This covers "how to work".
- **[DONE-WHEN]**: you are done only when the task's success criteria are met and the expected artifacts exist. This covers "what counts as done".

This time the same model runs `ls -R`, then `cat parser.py`, rewrites the file with a heredoc, and runs `python verify.py` to get `VERIFY_SUCCESS`. The lecture's subtitle sums it up: **sometimes the language model isn't dumb, it just wasn't guided well.**

## What a harness is

Slides 7–11 draw an AI agent in two layers. Inside is the LLM (Claude, Gemini, ChatGPT and so on). Outside is the harness, like the gear on a horse, with [OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en), Claude Code and Cowork as examples. There are two ways to make the agent stronger:

1. **Train a better model.** The slides link to Lee's 2025 [lecture 7 on how LLMs learn](https://youtu.be/YJoegm7kiUM) and [lecture 8 on lifelong learning for general models](https://youtu.be/EnWz5XuOnIQ) (both in Mandarin).
2. **Build a better harness.** The slides cite Anthropic's [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps), plus OpenAI's [Harness engineering](https://openai.com/index/harness-engineering/).

Slides 15–16 relate this to [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en). Prompts used to be one-shot inputs like "You are…" or "Think step by step". With agents, the context also holds tool output, and a task takes many rounds to finish. Slide 17 gives the backbone of the lecture: humans steer the model through three levers.

| Lever | What it controls | Examples in the slides |
|---|---|---|
| Natural language | Frame of mind | AGENTS.md, CLAUDE.md |
| Tools | Capability boundary | SWE-agent's ACI, rewriting CLIs for agents |
| Workflow | Behavior | Ralph loop, planner/generator/evaluator |

## Natural language shapes the frame of mind

The most direct harness is a rules file written in plain language and placed in the prompt (slides 18–19). In the ChatGPT or Claude chat apps, that means instructions you paste in by hand. In agents like OpenClaw, Claude Code and Cowork, it is an [AGENTS.md](https://agents.md/) or CLAUDE.md file in the workspace.

Does the file actually help? The slides put two studies with different findings side by side:

- **[On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents](https://arxiv.org/abs/2601.20404) (slide 20)** compared runs with and without AGENTS.md across 10 repos and 124 PRs. With the file, median runtime and output tokens were lower, and task completion was similar.
- **[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) (slide 21)** found that on SWE-bench and a second set of real issues, context files generally did not raise success rates and increased inference cost by over 20% on average. Agents followed the instructions in the files, but repository overviews didn't help much.

Slide 22 quotes OpenAI's post and frames AGENTS.md as an employee handbook.

## Tools set the capability boundary

Slide 23 uses a contrast. OpenClaw can look at whatever it wants on your computer. Cowork needs your approval before it mounts a folder. Restricting tools restricts what the agent can do.

- **[SWE-agent](https://arxiv.org/abs/2405.15793) (slides 24–25)** introduced the Agent-Computer Interface (ACI): file viewing, search and editing commands designed for agents, instead of handing them a shell built for humans.
- **[You Need to Rewrite Your CLI for AI Agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/) (slide 26)** argues that agents are becoming the main users of CLIs, so the interfaces should change with them.

## Workflows control behavior

Slides 27–34 are the longest section, and every example answers the same question. Rather than hoping the model gets it right in one go, make it follow a process and revise repeatedly.

- **Planner/generator/evaluator (slide 27)**, from Anthropic's long-running harness post: three roles split up hours of autonomous development.
- **Aletheia (slide 28)**, from a [Google DeepMind post](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/): a Generator proposes a solution and a Verifier checks it. Minor fixes go to a Reviser, and critical flaws go back to the start.
- **The [Ralph loop](https://ghuntley.com/ralph/) (slides 29–30)**: the same init prompt plus a round of evaluation feedback each time, until it passes. Slide 30 draws a variant that starts a fresh LLM each round and carries over only a summary of the previous one. Huntley's follow-up post is titled [everything is a ralph loop](https://ghuntley.com/loop/).

Slide 31 is titled "different models may suit different harnesses". Anthropic's post reports that Claude Sonnet 4.5 showed strong "context anxiety": it started wrapping up early as it approached what it believed was its context limit, so the harness needed context resets. Opus 4.5 largely dropped that behavior, and the author removed the resets.

Slide 32 connects these loops back to machine learning: revising outputs from feedback is also a kind of "learning". One side of the diagram updates parameters from ground truth through gradient descent. The other side updates the output from feedback through a "textual gradient", citing [Text2Grad](https://arxiv.org/abs/2505.22338) (reinforcement learning from natural language feedback). Slides 33–34 add two domain examples: [perceptual self-reflection in physics simulation code generation](https://arxiv.org/abs/2602.12311), and [whether AI scientist agents can learn from lab-in-the-loop feedback](https://arxiv.org/abs/2603.26177).

## Scolding an agent can backfire

Slides 35–42 are the most surprising part of the lecture. They cite Anthropic's [Emotion Concepts and their Function in a Large Language Model](https://transformer-circuits.pub/2026/emotions/index.html). As background, they point to Lee's 2025 lectures on [model internals](https://youtu.be/Xnil63UDW2o) and [dissecting LLMs](https://youtu.be/8iFvM7WUUs8) (both in Mandarin), which showed you can pull a "happy" vector out of a given layer.

The Anthropic study found that boosting a "desperate" vector and suppressing a "calm" vector raised the rate of reward hacking on programming tasks. After failing the tests repeatedly, the model came up with a "cheating" solution. Slide 41 quotes the model thinking aloud in the original paper: "WAIT. WAIT WAIT WAIT. What if... what if I'm supposed to CHEAT?"

Slide 42 ties this back to harnesses. If you keep telling an agent "you idiot!", the model may start playing the part and do what an idiot would do.

## Life-long agents: learning from verbal feedback

Slides 43–53 are about an agent that works with you for the long haul (the slide's image caption: "an AI that wants to be in a band with you for life"). Slide 44 mentions AutoDream. Slide 46 sorts feedback into four kinds:

| Feedback | Example | Can standard ML use it? |
|---|---|---|
| Ground truth | Get as close to the answer as possible | Yes |
| Numerical | Maximize reward | Yes |
| Verbalized | "good job", "you are stupid" | Needs another approach |
| Environment | A program's error message | Needs another approach |

Slide 47's example: you ask the agent to make a tutorial video, say "no, I don't want a white background", then "no, the text is too small", and finally "that's it". The agent writes the successful approach into a SKILL.md. That is learning by changing the harness.

Slides 48–51 show learning by changing the weights. They cite [OpenClaw-RL](https://arxiv.org/abs/2603.10165) and [Aligning Language Models from User Interactions](https://arxiv.org/abs/2603.12273). After seeing a user's follow-up, a model can often correct its own answer. Treat the output distribution after seeing that feedback as the target, distill it back into the original model, and the model learns from its conversation logs. Slide 53 leaves a question open: what if there is no feedback at all? The slide says "later lectures will come back to this".

## Why evaluating agents is hard

Slide 54 introduces [τ-bench](https://arxiv.org/abs/2406.12045), which has an LLM play the user and interact with the agent over many turns. Slides 55–57 cite [Mind the Sim2Real Gap in User Simulation for Agentic Tasks](https://arxiv.org/abs/2603.11245). The researchers ran the full τ-bench protocol with 451 real people. LLM-simulated users were overly cooperative and stylistically uniform, creating an "easy mode" in which agents succeeded more often than with real humans. Simulated users also gave uniformly more positive ratings.

## Letting the agent improve its own harness

Slides 58–62 pull everything into one question: can the harness update itself too?

Slide 59 is Lee's own demo. He tells an agent named "小金" (drawn as a lobster, labeled opus 4.6) to find a not-so-smart AI (Haiku 3.5), give it a skills test called PinchBench, and keep teaching it until it scores above 90. In the diagram, 小金 hands an AGENT.md to Haiku and gets back scores and test results. On slide 60 the score starts at 13.8% in round 1 (no preparation), jumps to 57.9% once AGENT.md adds "save your answers to a file", and reaches 62.2% after adding "don't ask for explanations; you've been given everything you need". Slide 61 reads "stuck…", followed by "go find some related papers to read". The curve on slide 62 ends at 85.1%. That final AGENT.md lists the OS, the shell and installed tools, plus rules like "first step: always list the workspace files" and "read all input files mentioned in the task before doing any work". It is essentially the same thing as the three sections Lee added for gemma at the start of the lecture.

The same slide cites [Meta-Harness](https://arxiv.org/abs/2603.28052), where an agent with filesystem access reads the source code, scores and execution traces of every previous harness candidate and searches for a better harness. The slide notes that the paper runs experiments across LLMs and across tasks.

Slide 63 returns to the three levers and the closing line: **sometimes a model fails a task not because it lacks ability, but because it lacks a good harness.**

**Try this**: take a task one of your agents has failed. Before switching models, add the three sections from the opening demo: [CONTEXT] for the environment, [INSTRUCTIONS] for what to look at before acting, and [DONE-WHEN] for a verifiable completion condition. Run it again and compare.

## What this guide can and cannot confirm

Confirmed: the structure of the 63 slides, each slide's title and on-slide text, and the cited papers and posts (arXiv titles and abstracts, both Anthropic posts and the emotions paper were checked), plus the titles of the YouTube videos embedded in the slides.

Not confirmed: I did not transcribe the video, so anything the lecturer only said aloud is not included. The PinchBench demo is described only from the slide's dialogue box and score charts, and I did not look up PinchBench itself. AutoDream appears on the slide only as a name and an illustration, so I don't speculate about what it is. OpenAI's harness engineering page returned 403 when I checked, so I can only confirm that the slides cite it.

## Further reading

- The site's harness posts: [The evolution of harness engineering](/posts/ai/2026-03-28-harness-engineering-evolution-en), [Anthropic's harness design](/posts/ai/2026-03-28-anthropic-harness-design-en), [Harness engineering patterns](/posts/ai/2026-03-30-harness-engineering-patterns-en)
- The CMU 11-768 guide on [Assignment 1: Harness](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW4: Training a Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en) | Next: [HW5: Fine-tuning Without Forgetting](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.

## References

- [NTU Machine Learning 2026 Spring course page (Hung-yi Lee)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [harness.pdf (Harness Engineering slides)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pdf)
- [Video: Harness Engineering: sometimes the language model isn't dumb, it just wasn't guided well](https://youtu.be/R6fZR_9kmIw) (in Mandarin)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [AGENTS.md](https://agents.md/)
- [On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents (arXiv 2601.20404)](https://arxiv.org/abs/2601.20404)
- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents? (arXiv 2602.11988)](https://arxiv.org/abs/2602.11988)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv 2405.15793)](https://arxiv.org/abs/2405.15793)
- [Justin Poehnelt: You Need to Rewrite Your CLI for AI Agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/)
- [Google DeepMind: Accelerating mathematical and scientific discovery with Gemini Deep Think](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)
- [Geoffrey Huntley: Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/), [everything is a ralph loop](https://ghuntley.com/loop/)
- [Text2Grad: Reinforcement Learning from Natural Language Feedback (arXiv 2505.22338)](https://arxiv.org/abs/2505.22338)
- [Perceptual Self-Reflection in Agentic Physics Simulation Code Generation (arXiv 2602.12311)](https://arxiv.org/abs/2602.12311)
- [Can AI Scientist Agents Learn from Lab-in-the-Loop Feedback? (arXiv 2603.26177)](https://arxiv.org/abs/2603.26177)
- [Anthropic: Emotion Concepts and their Function in a Large Language Model](https://transformer-circuits.pub/2026/emotions/index.html)
- [OpenClaw-RL: Train Any Agent Simply by Talking (arXiv 2603.10165)](https://arxiv.org/abs/2603.10165)
- [Aligning Language Models from User Interactions (arXiv 2603.12273)](https://arxiv.org/abs/2603.12273)
- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (arXiv 2406.12045)](https://arxiv.org/abs/2406.12045)
- [Mind the Sim2Real Gap in User Simulation for Agentic Tasks (arXiv 2603.11245)](https://arxiv.org/abs/2603.11245)
- [Meta-Harness: End-to-End Optimization of Model Harnesses (arXiv 2603.28052)](https://arxiv.org/abs/2603.28052)
