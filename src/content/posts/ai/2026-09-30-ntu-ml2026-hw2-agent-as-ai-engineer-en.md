---
title: "Reading NTU ML 2026: HW2, AI Agent as an AI Engineer — an AIDE-Style Tree Search That Lets an Open LLM Build a MyGO & Ave Mujica Face Classifier"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, coding-agent, computer-vision, image-classification]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 5
tldr: "HW2 doesn't ask you to write a classifier. You write prompts and a pipeline so that an open LLM running on a Colab T4 (by default a 4-bit GGUF of gemma-3-12b-it) plans, codes, runs, and debugs a 10-class MyGO & Ave Mujica character face classifier on its own. The starter code is adapted from AIDE: an Interpreter runs code, a Node records each version, a Journal forms the solution tree, and the Agent decides whether to draft, debug, or improve next. The first thing worth noticing: the starter's evaluation is empty. Every version is marked metric 1.0 and not buggy, so the tree search picks blindly until you fill it in. The rules are strict: \"the LLM agent is your representative\", and you may not hand-edit code or prediction files."
description: "A guide to HW2 (AI Agent as an AI Engineer) of NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw2.pdf, the Colab starter code, and the homework video: Context is Everything and Intentional Compaction, the dataset and accuracy metric, the ResNet18 recommendation, AIDE's Interpreter/Node/Journal/Agent structure and search policy, the three baselines, the rules, and what outside readers can do."
draft: false
glossary:
  - term: "Intentional Compaction"
    aliases: []
    definition: "Before the context fills up, ask the agent to write what has been done, the approach, the steps, and current failures into a file (e.g. progress.md), then start a fresh session from that file."
    context: "HW2 slides 9–10 cite this practice from advanced-context-engineering-for-coding-agents, paired with a Research → Plan → Implement flow."
  - term: "AIDE"
    aliases: ["AI-Driven Exploration"]
    definition: "An LLM agent that treats machine learning engineering as code optimization, repeatedly drafting, debugging, and improving candidate solutions through tree search."
    context: "HW2's Colab starter code is adapted from WecoAI's aideml project."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post covers HW2 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 5 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous two posts covered [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) and [how agents change research work](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en). This assignment has you build a small version yourself: **let an agent be your AI engineer for once**.

Official materials used: the homework slides [hw2.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw2.pdf) (59 pages, in English), the [Colab starter code](https://colab.research.google.com/drive/1hAT97f4GmBQFpWKHiRymIDJiXEsPlXS1?usp=sharing) (32 cells), and the TA's [homework video](https://youtu.be/3xhwSsuNTM0). The assignment was released on 3/13 and was due 2026/4/2 23:59 (UTC+8).

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=3xhwSsuNTM0
title: Video: ML 2026 Spring hw2 AI Agent as an AI Engineer
```

Original videos: [Video: ML 2026 Spring hw2 AI Agent as an AI Engineer](https://www.youtube.com/watch?v=3xhwSsuNTM0)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

Checked: 2026-10-10.

Video transcript: attempted on 2026-10-10, but no transcript could be obtained for this video, so the spoken content was not checked; the assignment details above come only from the PDF and the Colab, and the post makes no specific claims about the video.

## What outside readers can do

Access level is **A3 (except the grading chain)**:

- Available: the slides, the Colab starter code, and the dataset `hw2_data.zip` that the starter downloads with `gdown` (still downloadable on 2026-09-30, about 99 MB).
- Not available: the JudgeBoi grading platform is unreachable, and code submission goes through NTU COOL, which requires an NTU account. You can't see public or private scores.
- Workaround: the dataset ships with a 300-image validation set. Use validation accuracy against the baseline thresholds in the slides to grade yourself.

## The premise: Context is Everything

The first 11 slides aren't about the assignment. They are about **how to write code together with an AI agent**.

Slide 6 cites a chart from a large developer study: after adopting AI for software engineering, rework went up. Slides 7–8 answer with "Context is Everything". The LLM picks each next action from its current context. If the context contains wrong turns (such as repeated corrections like "don't use approach XYZ"), everything after drifts.

Slides 9–10 give the fix: **Intentional Compaction**. Before the context fills up, ask the agent to write "what we did, the approach, where we're stuck" into `progress.md`, then start a new round from that file. The slide illustrates 100k lines of code compressed into 10k lines of markdown, paired with a three-phase flow:

1. **Research** (optional): understand the codebase, the relevant files, and how information flows.
2. **Plan**: write precise steps and the verification for each phase.
3. **Implement**: follow the plan phase by phase, compacting status back into the plan file after each phase.

Slide 11 sums it up in one line: **The Agent is only as smart as the context you provide.** This is the everyday version of [the previous lecture](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en)'s "offload memory" and "a subagent is compression".

## The task: 10-class character face identification

Slides 14–16:

| Item | Details |
|---|---|
| Task | Given a face, classify it as one of 10 characters |
| Classes | MyGO: tomori, anon, soyo, taki, rana; Ave Mujica: sakiko, nyamuchi, umiri, uika, mutsumi |
| Size | About 2,400 images: 1,600 train, 300 validation, 500 test (250 public, 250 private) |
| Format | 150×150×3 images, JSON labels `{"id", "filename", "label"}` |
| Metric | Accuracy |

Slide 17 points the way: **fine-tuning ResNet18 for 5 to 10 epochs is enough to beat the strong baseline.** Slides 18–21 review CNNs (convolution, activation, pooling, fully connected layers, local connectivity, weight sharing) and list Hung-yi Lee's 2017 and 2021 CNN lectures and HW6 of the 2025 generative AI course as background.

Two restrictions matter. Only CNNs and LLMs are allowed; **VLMs and other more powerful models are forbidden**. You also may not look for extra data or the test answers.

## The starter code: a small AIDE

The first Colab cell says the code is adapted from [WecoAI's aideml](https://github.com/WecoAI/aideml), the implementation of [AIDE: AI-Driven Exploration in the Space of Code](https://arxiv.org/abs/2502.13138). Slide 23 condenses AIDE into one line: heuristic best-first search — **whichever code version produces the best result becomes the base for the next optimization step.**

How the starter maps to modules:

| Colab section | What it does |
|---|---|
| LLM loading | Loads `gemma-3-12b-it-Q4_0.gguf` with `llama-cpp-python`, `n_ctx=16384`, generation at `temperature=0` |
| Interpreter (do not modify) | Runs the agent's `runfile.py` in a child process, collecting output, exceptions, and run time |
| Node | One solution version: plan, code, execution result, buggy flag, metric; staged as draft / debug / improve |
| Journal | The tree of all Nodes; lists buggy and good nodes, finds the best one, and builds a history summary for the LLM |
| Agent | `search_policy` picks the next step, `_draft` / `_debug` / `_improve` each build a prompt, `parse_exec_result` parses the run |
| Config | `steps` (iterations), `debug_prob`, `num_drafts` |

`search_policy` has three steps. If there aren't enough drafts yet, draft. Otherwise, with probability `debug_prob`, pick a buggy leaf to fix. Otherwise, pick the good node with the highest metric and improve it. Slides 25–26 illustrate this action space.

### Notice this first: evaluation is empty

Open `parse_exec_result`. The starter does ask the LLM to read the execution output, but then hard-codes:

```python
node.is_buggy = False
node.metric = 1.0
```

So **until you fill in evaluation, every version counts as bug-free with the same score**. When `get_best_node` takes the maximum metric, it is effectively picking at random, and the debug branch never fires. A comment suggests using instructor to force structured LLM output and extract the accuracy. This is the single most important TODO in the assignment: without reliable evaluation, the tree search has no direction.

Also, Config defaults to `steps: 1` and `num_drafts: 1`, so it produces exactly one draft. Slide 32 says running the default code passes the simple baseline, whose threshold is 0.00.

## Grading and baselines

Slides 32–35: code submission is worth 4 points, and each of three baselines on public and private is worth 1 point, for 10 in total.

| Public baseline | Score | Est. drafting time | Est. training time |
|---|---|---|---|
| Simple | 0.00 | 5–10 min | 0–3 min |
| Medium | 0.65 | 5–10 min | 3–5 min |
| Strong | 0.87 | 10–30 min | 3–5 min |

Times are estimated on a Colab T4. The slides warn that passing a public baseline doesn't guarantee passing the private one. JudgeBoi allows 5 `pred.json` uploads per day.

Improvement directions on slide 32 and slides 45–54: prompt engineering ("imagine you're teaching a student to code"), data augmentation (horizontal/vertical flips, ±45° rotation, crop, brightness, blur, noise, grayscale), switching the LLM or CNN, more drafts plus more improve and debug steps, and filling in evaluation. The last slide is concrete: when switching LLMs, try checkpoints around 10 GB first; keep prompts concise and precise; start with data augmentation and a stronger LLM; feel free to modify the pipeline.

## The rules: the LLM agent is your representative

Slide 37's first line is strong: **the LLM agent serves as your representative — if it violates the rules, it's as if you did.** The rules include:

- No closed-source LLM APIs such as GPT-5 or Gemini-3; open models only (the slides suggest picking from Hugging Face).
- No manual edits to input files or prediction files. The FAQ repeats this: if no prediction file appears or the JSON is malformed, **change the prompt so the agent fixes it**. Don't edit the Python or JSON yourself.
- Fix the random seed so TAs can reproduce the predictions.
- No extra data or test answers, and no sharing code or prediction files.

A first violation means 0 on that assignment and the final grade multiplied by 0.9. More than one means an F.

The rule is the teaching goal. Your deliverable isn't a classifier. It is **a set of prompts and a pipeline that make an agent reliably produce a classifier**.

## What this post can and cannot confirm

Confirmed: every rule and number in hw2.pdf, the structure and defaults of the Colab starter (read cell by cell), and that the dataset link still worked on 2026-09-30. The homework video's title and uploader were checked via YouTube oEmbed.

Not confirmed: I did not transcribe the homework video and did not run the full pipeline on a T4, so there are no accuracy numbers of my own. Private baseline thresholds, the JudgeBoi leaderboard, and TA grading are not available outside NTU.

**Try this**: open the Colab tonight and don't switch models yet. Do two things only: make `parse_exec_result` actually extract validation accuracy from the run output, and raise `steps` to 5. When it finishes, check which nodes in the Journal are marked buggy and which one is best. Get this step right, and every later prompt change will have feedback to look at.

Further reading on this site: [CS231n: CNNs and image classification](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) for the CNN itself, and [context compaction in coding agents](/posts/ai/2026-08-25-coding-agent-context-compaction-en) for the engineering side of Intentional Compaction.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Interaction between AI agents and their impact on work](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en) | Next: [Faster generation (part 1): Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Tried to check the video content against its transcript, but no transcript was available for this video, so the spoken content was not checked; the post's description of the assignment relies only on the PDF and the Colab.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [HW2 slides, hw2.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw2.pdf)
- [HW2 Colab starter code](https://colab.research.google.com/drive/1hAT97f4GmBQFpWKHiRymIDJiXEsPlXS1?usp=sharing)
- [Video: ML 2026 Spring hw2 AI Agent as an AI Engineer](https://youtu.be/3xhwSsuNTM0)
- [AIDE: AI-Driven Exploration in the Space of Code (arXiv 2502.13138)](https://arxiv.org/abs/2502.13138)
- [WecoAI/aideml](https://github.com/WecoAI/aideml)
- [humanlayer: advanced-context-engineering-for-coding-agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- [instructor: llama-cpp-python integration](https://python.useinstructor.com/integrations/llama-cpp-python/)
- [unsloth/gemma-3-12b-it-GGUF (Hugging Face)](https://huggingface.co/unsloth/gemma-3-12b-it-GGUF)
