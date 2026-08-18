---
title: "Introduction to Deep Learning: The Two Moments Prompting Stops Being Enough"
date: 2026-08-16
category: ai
type: guide
tags: [deep-learning, llm, prompt-engineering, fine-tuning, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 1
tldr: "CS230's first lecture is a course overview, but Andrew Ng spends most of it on three things: why scaling works, when prompting stops being enough, and why he thinks 'don't learn to code' is one of the worst pieces of career advice ever given."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 1: the flipped-classroom design, the scaling narrative, the abstraction-layer map and its two drill-down triggers, the five online modules, the two buckets of AI-assisted coding, and Ng's four-tier productivity ranking."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)

This is the first post in the [Reading Stanford CS230](/en/series/cs230) series.

First, which offering this is: **Stanford CS230 Deep Learning, Autumn 2025** — nine videos, roughly 13 hours ([playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X)). That run is over. The last lecture was 2025/12/02 and all videos were posted by 12/16. Autumn 2026 is already scheduled to start 2026/09/22 and will be a different playlist. **Every post in this series gives the lecture date.**

Also: **there is no Lecture 7.** November 4th was Democracy Day, class was cancelled, and the lecture numbering skips. This series skips with it.

This post covers **[Lecture 1: Introduction to Deep Learning](https://www.youtube.com/watch?v=_NLHFoVNlbg)** (2025/09/23, Andrew Ng, one hour). It's a course overview with no math, but Ng spends most of the hour on how he reads the industry and the job market.

## Why the flipped classroom is built this way

CS230's in-person sessions **do not repeat the online videos**. Ng's reasoning:

> "A lot of Stanford students would go watch the online videos anyway. Rather than teach the same class year after year, we'd rather **make the videos as good as we can** and save classroom time for richer, deeper discussion."

The slot is two hours; he uses about an hour and twenty. So the in-person track ends up being "advanced topics the online videos don't go deep on" plus industry guest speakers — which also explains why the later lectures change from year to year.

## Scaling: where the course's narrative starts

The first thing Ng draws on the board: data on the x-axis, performance on the y-axis.

- Traditional machine learning (logistic regression, decision trees) **plateaus** no matter how much data you give it. His example is speech recognition: feed the old algorithms tens of thousands of hours of audio and accuracy still stalls — "**it's as if they don't know what to do with all that data.**"
- A small neural net keeps climbing, a medium one goes higher, a large one keeps going.

> "The reason deep learning has dominated AI for the last ten to fifteen years is that we have a **recipe for training very large neural networks** — you can shove a lot of data in and get unusually good performance out."

Then predictability. Baidu published work showing the performance gains from scaling were predictable; OpenAI's scaling-laws paper popularized the idea. **And it's that predictability that drives data-center investment** — you can estimate in advance where performance lands if you buy this many GPUs and feed in this much compute and data.

He tells an aside along the way (**his own recollection, unverified**): the first GPU machine he used to train neural nets was built in a dorm room by a Stanford undergrad named Ian Goodfellow. He tells it to land a line: "sometimes the thing you do in a dorm room or a lab turns out, a few years later, to matter enormously."

## The abstraction-layer map

```
CS fundamentals → machine learning → deep learning → generative AI (transformers)
```

Each layer sits on the one below it. Ng is blunt about the bottom layer:

> "Even if you're using Claude Code, Gemini CLI, Codex, Cursor or Windsurf, **people who understand CS fundamentals just build better things** — as opposed to 'let me vibe-code this.'"

**Where this course sits**: it takes you to near-expert level on deep learning, dips down into machine learning (objective functions, optimization tricks), and reaches up into generative AI (transformer architecture).

Then the most-quoted line of the lecture:

> "I use LLMs every day, but **just prompting doesn't cut it** — there's a lot I can't build with prompting alone, so I frequently have to drop down a layer into deep learning."

### Which data types you can prompt your way through

| Data type | What people actually do |
|---|---|
| Text | Prompting takes you a long way; a huge number of applications are pure prompting |
| Audio | Often drop straight into deep learning |
| Images / video | Often drop straight into deep learning |
| Structured data (large tables) | Often drop straight into deep learning |

The reason isn't mysterious: generative AI grew out of text-in, text-out. Multimodality keeps filling in, but **the further you get from text, the sooner you hit the wall**.

### The two triggers that push you down a layer

**One: it won't budge.** "I've been part of plenty of teams that tuned prompts for a month and performance just wouldn't go up."

**Two: the bill.**

> "In the prototype phase, GenAI tools are relatively cheap — a few dollars per million tokens, you can do a lot. But sometimes you get lucky, your product finds product-market fit, and a lot of users show up — and then your team gets the 'delightful' surprise that **your AI bill starts skyrocketing.**"

He says what they pay LLM vendors is "far more than I'd like to be paying." Then:

> "Knowing how to use deep learning to **fine-tune a smaller model** — that's the skill that actually bends the cost curve back down."

Worth flagging now: in Lecture 8 of this series, Kian Katanforoosh spends a whole segment arguing you should **avoid fine-tuning wherever possible**. The two positions are really the two ends of one thing — don't touch it before you succeed, you can't escape it after you do — and what triggers the switch isn't technical taste, it's finance.

## The five online modules

The part the in-person class deliberately doesn't repeat:

1. **Neural networks and deep learning fundamentals** — implemented **by hand in pure Python**. Ng's reasoning: TensorFlow and PyTorch hide the details.
2. **Hyperparameter tuning**
3. **Structuring machine learning projects**
4. **Convolutional networks (CNNs)** — computer vision
5. **Sequence models** — time series and text, including transformers

### Two lines from the tuning module

> "Every PhD student I know who eventually got really good **was, at some point, tuning hyperparameters at two in the morning.**"
>
> "On some nights, how good I am at tuning is the difference between **going home to sleep at three** and **going home at seven.**"

(He adds: don't copy me, I'm not endorsing this.)

### The project-strategy module (a trailer for two later lectures)

The example is a face-recognition door system. Camera, background removal, face cropping, enrollment, matching, whether to take a second shot to defeat photo attacks — a lot of decision points.

> "Inexperienced teams often pick what to work on **almost at random**: they read a paper that says get more data, so they spend six months collecting data. A lot of the time, more data doesn't help your application at all."

He gives a counterexample: a family-business CTO bought a pile of GPUs, then pointed at his **nephew who was still an undergrad** and said "my nephew knows AI, I'm giving him the budget."

> "A disciplined development process is where **10x** speed differences come from. I've watched teams spend six to ten months going down a road an experienced engineer could have told them was a dead end six months earlier."

This thread becomes two entire lectures — 3 and 6.

## AI-assisted coding

Show of hands: nearly the whole class uses it.

> "Personally, I hope never to write code by hand again in my life."

(He mentions seeing someone hand-writing code in a coffee shop, politely asking, and learning it was homework from another school.)

**He splits software work into two buckets**: quick-and-dirty prototypes, and production-grade software. **AI assistance helps the prototype bucket most.**

He also gives a counterexample, and it happened **that morning**: a collaborator using an agentic coder **botched a database migration and wiped the records** — luckily a test app with five users. So he's more careful about production.

**The sandbox argument** (this one has practical consequences for how you think about AI safety):

> "If your prototype only runs on your own laptop and doesn't touch sensitive information, the security requirements can be lower — **unless you're planning to maliciously hack into your own laptop.**"

Inside a sandbox you can temporarily ignore scalability, security and reliability, and decisions get much faster.

**On the cost of failure**:

> "I know a lot of teams are anxious about proofs-of-concept not making it to production. **I see it differently. If a PoC is cheap enough, what's wrong with doing 20? That's the price of finding the one or two that actually work.**"

**On "move fast and break things"**:

> "Some teams took from that phrase that they shouldn't move fast, and I think that's wrong. What I say is **move fast and be responsible.**
>
> The most responsible teams I know are often the fastest teams — **because moving fast is how you actually build the thing, learn what's in the data and what users want, and that's the best way to find out what's going to go wrong.**"

## Why ML projects have to be built before you know

> "You control your code 100%, but you **don't control the data**."

He's done speech recognition many times and data still surprises him: more of some accent than expected, people who talk unusually fast, heavy in-car background noise. A recent project surprised him with **the number of people talking in the background** — a user talks to the system, turns to talk to someone next to them, turns back, and the system gets confused.

He applies the same logic directly to LLMs:

> "There's a lot of **overhype**, a bit of fear-mongering, about how LLMs are hard to control. The reason we don't know in advance how an LLM will behave is that it's trained on **more data than any human could ever read** — we can't actually go look at what's inside those tens of trillions of tokens."

So building agentic applications is empirical too: **build it, see what's good and what's bad, and use that to fix it.**

## Careers: the most widely shared part of this lecture

### "Don't learn to code"

> "**That's one of the worst pieces of career advice ever given.**"

The reasoning: when coding gets easier, **more** people should code, not fewer.

- Punch cards → keyboard terminals: more people learned to code
- Assembly → high-level languages: more people learned to code
- He went and dug up **articles from when COBOL was invented**, and people really did write "now that we have COBOL and programming is this easy, do we even need programmers?"

### How he reads rising CS-graduate unemployment

His account isn't "AI replaced them," it's:

> "A lot of school curricula **have barely changed since 2002** … and I would not hire a software engineer today who doesn't use AI-assisted coding, **the same way I wouldn't hire someone using punch cards instead of a keyboard.**"

He gives a first-hand case: he interviewed two people back to back — one not yet graduated but deep in the GenAI toolchain, one with ten years of full-stack experience whose skill set was the same as in 2002 and who hadn't touched AI assistance. **He picked the one who hadn't graduated.**

### The four-tier productivity ranking

Pushed on "doesn't industry say it wants the ten-year person," he gave a fuller ranking (stressing no disrespect to anyone personally):

1. No experience, doesn't know AI
2. Ten years of experience, **doesn't know AI**
3. New graduate, **knows AI**
4. **Ten years of experience and knows AI** ← strongest

> "Between the two factors, really knowing AI matters a lot, **but experience matters too**. The best developers I know are the ones who are very experienced and also very on top of the latest AI techniques."

### Why fundamentals are what let you control the tool

He uses a non-technical analogy: making online courses, he needed background images. His collaborator Tommy Nelson knows art history and could prompt Midjourney in the language of **movements, influences and palettes**, and got beautiful results; Ng could only type "please give me a nice robot picture" and never got that level of control. They ended up using the collaborator's assets throughout.

> "One of the most important skills going forward is **understanding how computers and AI work, so you can tell the computer precisely what you want in AI's own language.**"

### The toolkit he looks for when interviewing for GenAI roles

RAG, vector databases, **evals and error analysis**, guardrails, knowledge-graph integration, multimodal, fine-tuning, agentic workflows — **plus AI-assisted coding**.

(He adds: "a lot of employers haven't figured out how to interview for this either. If nobody at a company understands GenAI, how would they know what to test?")

## Two useful answers from the Q&A

**How much data is enough?** Hard to know. For problems you've done before or that exist in the literature you have a gut sense — for example, **training face recognition from scratch, fifty thousand distinct faces is decent**. For a genuinely new problem (blood data from a new medical device nobody has collected before), collect a little, train a model, and use how it does to calibrate what you need. "Sometimes a hundred examples is enough, sometimes a hundred billion still isn't."

**CS129 vs CS229 vs CS230?** 129 is the gentlest on-ramp; 229 is math-heavy, fast-paced and broad (supervised/unsupervised/decision trees/boosting/k-means); **230 is the most applied, deep-learning only, and almost proof-free**. The overlap between 229 and 230 is deliberately kept low, so you can take both at once.

---

## Beyond the classroom

**This course's syllabus is drifting.** I pulled the Autumn 2024 syllabus off the Wayback Machine and compared:

| Autumn 2024 | Autumn 2025 |
|---|---|
| L2 Full-cycle of a DL Project (no slides) | **L2 self-supervised / weakly-supervised learning** (all-new slides) |
| L4 Deep Learning Intuition | **Dropped entirely** |
| **L9 RAG and AI Agents** (a one-line title, no slides) | **L8 Beyond the model** (a full 110-minute lecture) |
| L10 closing remarks (**reusing fall_2021 slides**) | **L10 interpretability** (all-new slides) |

The direction is clear: **LLM and agent material grew from a footnote into core curriculum, foundational theory got compressed, and an entire lecture on opening up the model was added.** That L10 change is the interesting one — the old closing talk ran on 2021 slides, unchanged for three years running.

**The official syllabus entry for Lecture 6 is still stale**: it lists "career advice / paper reading / healthcare AI guest" with 2024 slides, but the class actually recorded that day is **AI Project Strategy**. Careers is Lecture 9. Going by the website will send you to the wrong place.

## References

- [Lecture 1: Introduction to Deep Learning](https://www.youtube.com/watch?v=_NLHFoVNlbg) — 2025/09/23, Andrew Ng. Source for the scaling narrative, the abstraction-layer map, "just prompting LLMs doesn't cut it," and the AI-assisted-coding and careers segments
- [Stanford CS230 Autumn 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — Stanford Online, the full nine-lecture list (no Lecture 7)
- [CS230 syllabus](https://cs230.stanford.edu/syllabus/) — still the Autumn 2025 version as of August 2026; the Lecture 6 entry is stale
- [The November 2024 syllabus snapshot](http://web.archive.org/web/20241113044952/http://cs230.stanford.edu/syllabus/) — Wayback Machine, the source for the syllabus-drift comparison (including the CNN and RAG lecture shifts)
