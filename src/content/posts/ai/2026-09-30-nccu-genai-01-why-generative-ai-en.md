---
title: "NCCU Generative AI L01: Why Study Generative AI, Course Intro and Colab"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, generative-ai, colab, homework]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 1
tldr: "The first half of lecture 1 covers course rules and lightning talks. The middle answers \"why learn the principles?\": Yen-Lung Tsai splits the anxiety of learning AI into three kinds and argues that knowing the principles tells you a model's limits, so you stop chasing every new tool. The second half is a Colab primer, from magic commands and the four standard import lines to plt.plot, Markdown, and ipywidgets. Homework 1 is to plot a function in Colab. On the Chang Gung satellite rubric, a tweaked copy of the demo earns 6 points; a function not taught in class, with well-written Markdown notes, earns 10."
description: "Guide to lecture 1 of NCCU Yen-Lung Tsai's Generative AI course (semester 1132): course rules and the weekly stream format, three kinds of AI anxiety and \"understand the principles so you don't panic,\" AI as turning problems into functions, Colab and Jupyter basics (magic commands, standard imports, plt.plot, zip, TAB completion, Markdown, interact), and the week 1 homework deliverables and rubric."
draft: false
glossary:
  - term: "lightning talk"
    aliases: ["閃電秀"]
    definition: "A student sharing slot in the third session of each stream, at most 5 minutes per person, about their homework, takeaways, or a summary of the lecture."
    context: "At NCCU in 1132, giving a lightning talk added 2 points to the semester grade; the Chang Gung page also lists it as bonus credit."
  - term: "magic command"
    definition: "A special Jupyter/Colab command starting with %, such as %matplotlib inline or %timeit, that controls the notebook environment rather than being Python syntax."
    context: "Every course notebook starts with %matplotlib inline."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai)

**Series**: previous [Overview and self-study route](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | next [L02 Neural network concepts](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

> **Version note**: This post is based on the [recording](https://www.youtube.com/watch?v=4BRBxy0EMT8) (2 h 52 min, in Mandarin) of lecture 1 from NCCU semester 1132 (2025-02-18) and the [GenAI01 slides](https://yenlung.me/1132GenAI) (121 slides, in Chinese). The homework spec and rubric come from the [Chang Gung satellite page](https://yangchihyuan.github.io/courses/GenerativeAI2025), so they are the Chang Gung version. All facts were checked against the official materials on 2026-09-30.

Lecture 1 is titled "Why study generative AI?" It does three things. It explains how the course runs, it argues for spending time on principles, and it gets everyone to produce a first plot in Colab. For readers with little programming background, the third matters most, because all of the next 13 lectures' homework happens in Colab.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=4BRBxy0EMT8
title: recording
```

Original videos: [recording](https://www.youtube.com/watch?v=4BRBxy0EMT8)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this lecture sits

Going by the chapter list in the video description, the three sessions break down like this:

| Session | Content |
|---|---|
| 1 | Course logistics: stream links, NTU COOL, homework rules, grading, final project, lightning talks; instructor intro |
| 2 | Three kinds of AI anxiety, a test of ChatGPT Deep Research, learning goals, AI as turning problems into functions, today's generative AI, Colab hands-on, plotting a function, homework 1 |
| 3 | How to submit, lightning talks, TA intros, how to open Colab sharing permissions |

Slide 23 gives the fixed weekly format. The first 2 hours (4:10–6:00 pm) are Tsai's lecture. The last hour (6:10–7:00 pm) is lightning talks, hands-on work, and TA time, arranged by each school. Self-learners can watch just the first two sessions; the third is mostly logistics.

## Course rules: AI is encouraged, "one-prompt homework" is not

Slide 18 is blunt. You may of course use generative AI models, but direct copy-paste and similar plagiarism is strictly forbidden. Homework that generative AI can produce in one go is not acceptable.

Homework comes roughly weekly, due two weeks later, and mixes ideation, hands-on, and programming tasks (slide 22). The final project is open-ended. It can be a programming project, a plan for solving a problem with generative AI, or a tutorial on some generative AI topic (slide 20). Projects are shared at an online Gather Town conference, where each school sends its best.

**Lightning talks** are a signature of this course. Anyone can sign up to spend 5 minutes in the third session sharing their homework, takeaways, or a summary of the lecture. At NCCU in 1132, a lightning talk added 2 points to the semester grade (slide 116).

Grading weights differ by school; see the [overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en). NCCU 1132 was homework 70%, final project 25%, participation 5% (slide 115).

## Why insist on principles

The slides sum up the course in two phrases: emphasize principles, and practice by building. Slide 43 gives the reason: **understand the principles so you don't panic**, use AI well, and become a strong AI learner. A small note beside it adds that yes, the principles do include math.

He then splits the anxiety of learning AI into three kinds:

| Anxiety | How the slides put it |
|---|---|
| Will AI replace me? | Is AI better than me? We also hear "what replaces you is a person who uses AI" |
| Things move so fast; how do I learn? | New tools come out every day; which is best, which should I learn? |
| Learning AI feels hard | "10 prompt tricks you must know!" "That's nothing, I have 100!!" |

The slide for the third anxiety turns the prompt-trick arms race into one line of dialogue: you have 10, he has 100. The second session then tests ChatGPT's Deep Research. Slide 48 asks, "Is it really 'PhD-level'?", and the test results are at [yenlung.me/IVE_DR](https://yenlung.me/IVE_DR).

The learning goals on slide 49 answer those three anxieties:

- Know the principles and you know AI's limits, and can think about how to push past them
- In practice, you won't worry much about whether model A beats model B (or how to find a suitable model)
- You'll know why a given prompt helps
- You'll become a very capable absorber of new AI knowledge

This matches the starting point of the other course guides on this site: tools change fast, and the principles under them change slowly.

## AI is turning a problem into a function

This lecture plants an idea every later lecture uses. Slide 51 draws an AI model as a "function-learning machine" $f_\theta$, which Tsai calls a **dopey AI robot** (呆萌型 AI 機器人). All you need to know is what the input looks like and what the output looks like.

The example is birdwatching. You photograph a myna in the wild and want to know which species it is. The input is a photo; the output is the myna species.

Generative AI is the same kind of dopey robot, with different inputs and outputs:

| Type | Input | Output | Examples (from the slides) |
|---|---|---|---|
| Image-generating AI | A prompt, e.g. "a rabbit wearing a rabbit ear hat" | An image | Midjourney, Stable Diffusion, DALL·E |
| Text-generating AI | A prompt, e.g. "List five things to watch for when learning generative AI" | A passage of text | ChatGPT, Gemini, Claude, Llama |

So why did people start talking about generative AI in the first place? The slides give three reasons. It lets computers create. Turing asked in 1950 whether, talking through a wireless typewriter, we could tell a person from a machine. And Feynman's line: "What I cannot create, I do not understand." To really understand something, you have to be able to create it.

The next lecture opens up the function-learning machine and shows how neural networks build it.

## A Colab primer: the course's workbench

[Colab](https://colab.research.google.com/) is Google's cloud computing service. There is nothing to install, you log in with a Google account, and you get free GPU or TPU time. Think of it as a cloud version of [Jupyter Notebook](https://jupyter.org/). Jupyter started as the IPython Notebook, created by Fernando Pérez.

Slides 61–113 are a thorough Colab walkthrough. Here are the parts self-learners need most.

### Opening files and settings

- **Open the instructor's notebooks**: when opening a notebook, choose the GitHub tab and enter `yenlung` to find the demos in [AI-Demo](https://github.com/yenlung/AI-Demo). Then "save a copy in Drive" so that you edit your own version.
- **Turn off distracting autocomplete**: Tools > Settings > Editor; consider unchecking the code completion suggestions, and set indent width to 4. You don't lose completion, because the TAB key still works.
- **Feel-good settings**: Tools > Settings > Miscellaneous; check corgi mode, kitty mode, and crab mode.
- **Turn on a GPU**: Edit > Notebook settings, then choose GPU or TPU.
- **Run a cell**: Shift + Enter. The slides call this "the most important action."

### The four standard lines

Every assignment starts with these four lines. Slide 81 calls them "our standard start":

```python
%matplotlib inline

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

The first line is a **magic command** that makes plots show up inline on the page. The Chang Gung rubric says that leaving out the instructor's four fixed import lines costs 1 point.

Other useful magic commands include `%cd` (change directory), `%save`, `%run`, and `%timeit` (time execution). An exclamation mark in front, as in `!pwd`, runs a shell command directly.

### The workhorse: plt.plot

`plt.plot(X, Y)` joins points given as a list of x coordinates and a list of y coordinates. The slides' example:

```python
plt.plot([0.8, 1.2, 2.1, 2.8], [2, -5, 3.2, 5])
```

Points often come in two forms: a list of `(x, y)` pairs, or separate x and y lists. `zip` converts between them:

```python
X = [0.8, 1.2, 2.1, 2.8]
Y = [2, -5, 3.2, 5]
points = list(zip(X, Y))   # combine
X, Y = zip(*points)        # split (unzip is also just zip)
```

### Help, Markdown, and interaction

- Type half a function name and press Shift + Tab for its docs; press twice for the full docs
- `\pi` followed by TAB types a Greek letter, which you can use as a variable name
- Markdown cells support headings, lists, links, images, and LaTeX math
- `from ipywidgets import interact`: write a function with a parameter, hand it to `interact`, and you get a slider or dropdown

The final interaction example on the slides joins plotting and a slider:

```python
x = np.linspace(-5, 5, 1000)

def draw(n=1):
    y = np.sinc(n*x)
    plt.plot(x, y, lw=3)

interact(draw, n=(1., 10.))
```

## Week 1 homework: plot a function in Colab

This is the Chang Gung satellite version (due 3/10, 23:59). The task is one sentence: **plot a function in Colab.**

You must submit three things: a Colab link (with sharing turned on), a short explanation of the key points, and key screenshots.

The rubric is a scale from "copy of the demo" to "your own work":

| Points | Condition |
|---|---|
| 0 | Link won't open, and no screenshots |
| 1 | Notebook only imports the basic packages |
| 2 | Link won't open, but some screenshots |
| 3 | Unrelated to this week's topic |
| 6 | Base score: very close to the class demo, e.g. sin(x) changed to cos(x) or 2sin(x) |
| 8 | A common quadratic function |
| 9 | A creative plot (any function not taught this week counts) |
| 10 | A creative plot with well-written Markdown notes |

Two notes matter. Leaving out the four fixed import lines costs 1 point. "Link won't open" covers three cases: sharing not turned on, a file that isn't a Colab link, and code that doesn't run all the way through.

For a self-learner, the point of this assignment isn't the function itself. It's walking through the Colab workflow once: open from GitHub, save a copy, write Markdown, turn on sharing. You'll repeat that loop every week.

## Self-check

- You can run the four standard lines in a fresh Colab notebook without errors
- You can say how `%matplotlib inline` differs from `!pwd` (the first is a magic command, the second a shell command)
- You can split a list of points into X and Y with `zip(*points)`
- You can explain the "dopey AI robot" in one sentence: a function-learning machine where you only need to know the shape of the input and output
- Your first homework uses something other than a variation on sin, and it has Markdown notes

One thing to do tonight: pick a function the class didn't cover (say, a polar rose curve) and wrap it in `interact` so you can drag a slider to change its parameter.

## Lecture 1 in Fall 2026

Lecture 1 of semester 1151 streamed on 2026-09-08. The [recording](https://www.youtube.com/watch?v=oRPRnGJwA8c) is retitled "How to learn AI without anxiety: stand firm on principles, and use your expertise to direct AI." Going by the chapter list, the backbone is the same: using principles to reduce anxiety, myna classification, the Turing test, a Colab primer, and plotting functions. Two new segments appear: "How generative AI shifted from giving advice to doing tasks" and "From prompts to AI agents."

## Further reading

- Course ownership, grading versions, and the full homework table: [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)
- Another Taiwanese course that starts from zero in Colab: [Reading NTU Hung-yi Lee's Machine Learning 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)
- How open each school's courses are: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Generative AI 01: Why study generative AI? (course intro)](https://www.youtube.com/watch?v=4BRBxy0EMT8) (in Mandarin) — 1132 lecture 1 recording with chapter timeline (2025-02-18)
- [1132 slide folder (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI) (in Chinese) — GenAI01 course intro, 121 slides; this post cites slides 18, 20–23, 43–60, 62–113, 115–116
- [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese) — week 1 homework spec, deliverables, and rubric
- [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) — the demo repo opened in Colab under GitHub user `yenlung`
- [1132 YouTube playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Mandarin) — all 14 recordings of the semester
- [1151 lecture 1: How to learn AI without anxiety](https://www.youtube.com/watch?v=oRPRnGJwA8c) (in Mandarin) — chapter timeline for the Fall 2026 version
- [Google Colab](https://colab.research.google.com/) — the cloud notebook platform the course uses
