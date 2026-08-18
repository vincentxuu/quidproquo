---
title: "Full Cycle of a DL Project: You Get Two Days to Collect Data"
date: 2026-08-16
category: ai
type: guide
tags: [machine-learning, data-centric-ai, mlops, error-analysis, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 3
tldr: "Andrew Ng walks a face-recognition door system through the entire project lifecycle, and the whole lecture has one thesis: speed. He gives teams a two-day deadline, on the reasoning that 'time spent preparing data should be commensurate with the time it takes to train the model once.' It closes on a line: my job is to build something that actually works, and that is not the same as building something that works on the test set."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 3: why AI projects differ from traditional software, using speed as the frame for data collection, error analysis and data-centric AI, the VAD cascade deployment decision, and monitoring for data drift."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-full-cycle-dl-project)

> [The previous post](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en) covered how embeddings get trained. This one zooms out to the whole project.

This post covers **[Lecture 3: Full Cycle of a DL Project](https://www.youtube.com/watch?v=MGqQuQEUXhk)** (2025/10/07, Andrew Ng, 1 hour 7 minutes). There are **no slides** for this one — it's whiteboard and Q&A throughout. Ng takes a single case (a face-recognition door system) through the entire lifecycle, putting every decision point to a class vote before giving his answer.

## Why AI projects aren't like traditional software

> "In a traditional software project you write code and you control your code. But an AI project involves code **and data**, and you almost never know what strange and wonderful things are in your data."

For face recognition, before you start you have no idea: is the lighting good, does long vs. short hair break it, does making a face break it, do glasses break it.

He extends the same logic to LLMs:

> "There's a lot of overhype, a bit of fear-mongering, about how LLMs are hard to control. The reason we don't know in advance how an LLM will behave is that it's trained on **more data than any human could ever read**. **So building an agentic application or an LLM application is equally empirical, equally experimental** — you build it, see what's good and what's bad, and use that to fix it."

And a harsher point: **you don't even control the data already on your disk, so you certainly can't control the data the world will hand you later.** (You deploy face recognition, winter comes, someone wraps a thick scarf over half their face — how would you have known?)

### Why most courses only teach the small middle piece

> "A lot of machine learning courses teach how to build models … because that's academia's focus: a model can be trained, evaluated, published, and benchmarked against other research groups' models. **But that's a small slice of the work needed to build a system that works.**"

The full pipeline:

```
scope the problem → get data → design the model → train →(iterate)→ deploy → monitor and maintain
                    └──────── fast development loop ────────┘
```

## The case: a face-recognition door

Ng says he built one of these commercially. One scenario he actually deployed: **badges get stolen**, so the system takes a photo at badge-swipe time, compares it, and immediately discards it — confirming the holder is the person on the badge and keeping badge thieves out of the office building.

The architecture is a **Siamese network**: two images in, "same person or not" out. Why not classification? Because **you can't retrain the network for every household.** Instead you enroll a few reference photos (you, roommates, family) and compare against them when someone shows up.

(This architecture is exactly what the triplet loss from [the previous post](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en) trains.)

## The main thread: framing data collection around speed

The class question: you're the CTO of a three-person startup, legal says no scraping, how do you get training data and how long does it take?

The students get creative: use a video service (Zoom), put a camera somewhere and let employees opt in, ask friends and their LinkedIn photos, write to Stanford for help. (Ng on the last one: "I love Stanford, Stanford is a great institution. **And that will take a while.**")

### His principle

> "Whether a startup succeeds — or whether a three-person innovation team inside a big company succeeds — **one of the strongest predictors is raw execution speed.** So when I brainstorm tactics, I bias toward the ones that get me a dataset **fast**, and fast usually means a day or two. **Even if the dataset I end up with is worse, smaller, lower quality.**"

The reason: you don't know what problems lurk in the data, so the sooner you have data, train a model, and see where it breaks, the sooner you know what to fix.

### Two ways to ask, very different outcomes

| The slow question | The fast question |
|---|---|
| "What data do we need? How long will that take?" | "**We have two days.** In that window, what's the most creative, respectful, responsible way to collect it?" |

He genuinely says things to teams like: "It's 11:52 on Tuesday, our deadline is **11:52 Thursday**."

### The commensurability principle

> **Time spent preparing data should be commensurate with the time it takes to train the model once.**

- Face recognition trains overnight or even in hours → so don't spend two months finding data, or data becomes the giant bottleneck
- Conversely, if you're training a foundation model that runs for two months, spending months getting the data right is reasonable
- The fast teams he's worked with **go around this loop once a day for small models**

**The exception**: if you've done this problem many times, or the literature tells you clearly how much you need (he knows some face-recognition systems need **at least fifty thousand images** to have a chance), then invest in volume up front.

### A cautionary story

A CEO spent **over a hundred million dollars** acquiring a company for its data, then asked Ng afterwards: "I paid all this money for this data, can you help me figure out how to monetize it?"

> "I looked at him thinking: **I kind of wish I hadn't done that.**"

**The value of data is extremely hard to judge in advance.** Will student ID photos be weird? Overly exaggerated expressions? Too much smiling? He says he doesn't know either — "my own Stanford ID photo looks pretty odd."

(**This figure is Ng's own recollection, and the company is unnamed.**)

### What he actually does

Go where campus foot traffic is highest (**the dining hall wins**) and, with full disclosure, ask people to consent to providing voice samples or photos. "Stanford's community is very international — it doesn't perfectly represent the world's population distribution, but people really do come from everywhere, and they're very willing to help."

## The same logic applied to prompts and responsible AI

- "You write a prompt and you have no idea in advance how well it'll perform, because none of us has seen its training data. So **rather than theorizing at length about what prompt to use, just try it** — trying is how you see the problems, then you focus on fixing them."
- Responsible AI: "You can only theorize so far. One of the best ways to build a safe AI system is to **build it and then experiment in a sandbox** — poke at it and probe it on your own laptop, don't put it out in the world affecting innocent third parties. Only by building it and poking at it do you learn where it goes wrong and where it says inappropriate things."

## Error analysis and data-centric AI

The system's broken, now what? Two paths: change the architecture, or **change the data**. **Data-centric AI** is systematically engineering your data.

Example: you find the system is much worse on people **wearing hats** → go collect hat data.

> "**Blindly grabbing more data everywhere is usually not a good strategy**, because there's too much data to grab."

Long hair or short? Beard or no beard? Scarf over the face? Glasses? Profile view? — without building the system and seeing where it breaks, you have no basis for deciding.

### Frontier models work the same way

> "Even looking at how frontier models are trained today, it's **not a game of grabbing data everywhere** — it's **identifying which subcategories are worth investing in to obtain high-quality data.**"

He names two clear value pools for LLMs: general Q&A, and **AI coding assistants** ("Claude was ahead for a while, but OpenAI and Gemini 2.5 Pro have improved a lot" — **this is an October 2025 statement**). To make a model better at coding, you don't scrape low-quality internet chatter and social posts, you find **high-quality, programming-related data**.

> "'More data is better' is entirely correct, and also **an oversimplification**. Data isn't one homogeneous thing — it has subcategories."

**Data quality**: low quality is random internet chatter; high quality is heavily edited, insightful professional books and articles, **where legally obtainable**. The face-recognition version: blurry photos are lower quality than sharply focused ones.

### How closely must training data match the test distribution?

A student asks: if you train on generic "are these two objects the same" data, does that drift too far from the target task?

> "It matters, but **not as much as most people think.**"

- Large neural networks absorb all kinds of data. **As long as the network is big enough, it's usually not harmful and might even help a bit**
- A water bottle and a marker might be too far; but **cartoon characters**, which look nothing like real people, he'd guess do no harm at all
- "Ten or fifteen years ago people were obsessed with the training distribution matching the test distribution exactly. **That's no longer the case today.** Back then models were small, compute was expensive, parameters were few, and you worried about irrelevant data distracting the model"
- The analogy: "**I learned to play piano, and that probably didn't make me worse at AI**, because my brain is big enough for both." Contrast with Sherlock Holmes's attic theory (finite brain capacity, learn something new and you must forget something old) — that doesn't hold when the network is large enough
- **The line**: wrong data is a problem; **irrelevant** data is far less damaging

## Deployment: the VAD cascade

Streaming 30fps video to the cloud 24/7 and classifying every frame is too expensive and too slow. So you put a **visual activity detection** layer in front.

| | Approach | Cost |
|---|---|---|
| **Option 1** | Non-ML: count changed pixels against a threshold epsilon | "About five lines of Python, **have an LLM write it, done in twenty minutes**" |
| **Option 2** | Train a tiny low-power network that decides "is there a person in front of the door" | At least hours, probably longer |

The student proposals are all decent: chain both, price it out first, run both on-device, ship option 1 now and swap to option 2 once you have enough data. Someone also spots option 1's weakness: **a tree swaying in the background, a car driving past, the neighbor's cat visiting** will all false-trigger it.

### Ng's answer is still speed

> "These insights — does a swaying tree in the background matter? **It turns out it really does** — are hard to know in advance, because you need cameras on a bunch of doorways and real data before you have confidence. The fastest way to get the answer is to **build a quick and dirty version and run it.**"

And he says it outright: **option 1 ultimately isn't good enough and everyone ends up at option 2. But building option 1 first gives you the insight you need to get to option 2.**

### Things you only discover by building

As a person walks toward the camera, **some frames are sharp and some are very blurry** — because the instantaneous speed of the face varies while walking.

> "If you can **pick the high-resolution, well-focused frames** to feed face recognition, the results are dramatically better."

What they ended up building wasn't just VAD — they recorded video and **deliberately selected five** sharply focused frames to send downstream, "a significant accuracy improvement."

> "That's the kind of discovery **you only get by actually building the system.**"

### Simple models resist drift

Option 1 has **exactly one parameter** (epsilon) and is very robust to distribution shift: everyone wears sunglasses in summer, and the fraction of changed pixels barely moves. Option 2, if nobody in its training data wore sunglasses, overfits, and once everyone starts wearing them you have to retrain.

> "One of the advantages of a simple non-ML system is that it's **less susceptible to data drift.**"

(Halloween, with everyone in giant costumes, might break even option 1.)

### Human-level performance as a baseline

Building a system is much easier when you have a reference point for "achievable accuracy," and **human expert performance is the usual reference** — it's also how you diagnose bias vs. variance.

Face recognition in controlled settings **passed humans long ago**: "the AI systems we build recognize faces far better than I do, and probably better than the vast majority of humans, maybe all of them." **Superhuman is actually harder**, because the baseline is gone. Tasks humans were never good at (recommending films) are also hard to baseline — "I think most people struggle to recommend a movie even to their best friend."

## Monitoring and maintenance

### Two kinds of drift

- **data drift**: the distribution of data the world gives you changes
- **concept drift**: the input-to-output mapping (X→Y) changes

The examples are all usable:

- California isn't cold right now → winter rain arrives and everyone wears scarves and rain gear; next summer everyone wears sunglasses
- Web search: a new politician gets elected, a new sport, a video goes viral, Taylor Swift releases an album → suddenly a lot of people search for entirely new things
- Factory inspection: "**there's a decent chance the phone in your pocket was inspected by software my team wrote.**" A new machine on the line produces a new kind of scratch
- **Self-driving**: a model trained in California doesn't work in Texas — **Texas traffic lights look very different** (horizontal vs. vertical; he thinks part of the reason is that some parts of Texas get high winds, so signals have to be hung to withstand them). "You and I can drive fine in California or Texas, but the model can't — you have to go collect data again."

### "My test-set numbers are good" is the wrong posture

This is the segment most worth quoting in full:

> "I've seen a cohort of AI engineers who think their job is **to do well on the test set**. I've been in this conversation several times: the ML person says 'my test set numbers are great, my job is done,' then the product or business person says 'no, your system doesn't work, look, it breaks here and here,' and the ML person says 'not my problem, I did well on the test set.' **That's not a constructive way to make progress.**
>
> I'd encourage you to think of your job as **building something that actually works**, which is not the same as building something that works on the test set. If someone tells you 'I know your test-set numbers are good, but your system doesn't work,' don't answer 'my job is the test set' — go figure out **why the test-set numbers didn't translate into performance users actually care about.**"

The most common reason is that the data distribution changed.

### Dashboard practice

1. **Get the team together and brainstorm, from diverse perspectives, everything that could go wrong.**

   > "I've built a fair number of ML systems, and after we sit down and brainstorm seriously, **I haven't yet hit a real-world problem that wasn't on the list we made.** I might be misremembering, but that's been true so far."

2. **Plot a lot, then delete.** "20, 30, 50, 100 dashboards is fine," because you can't know in advance which will be useful; after a few days to a few weeks you find most are boring (cloud deployment latency is basically constant) and cut them. The EDA analogy: "one more plot in a Jupyter notebook is cheap."

3. What face recognition actually tracks:
   - **Re-verification rate** (users who have to swipe twice to get in) → a **signal of user frustration**
   - Accept/reject ratio
   - Latency

4. Once you know the normal range, **set upper and lower alarm bounds** and page someone when they're breached.

---

## Beyond the classroom: reading this lecture for LLM applications

Ng makes this analogy himself throughout, but a few threads are worth pulling out:

**The "two-day deadline" applies to eval datasets too.** People spend a lot of time designing the perfect eval set, but you don't know where the model will break. **Build a crude one, run it, see what it catches** — that's far faster than thinking it through first.

**The commensurability principle in LLM form**: time spent preparing an eval should be commensurate with the time it takes to run one round of experiments. If an eval run takes ten minutes, don't spend two weeks designing it.

**"Blindly grabbing more data isn't a good strategy"** has a modern counterpart: blindly adding more context. The site's [context and memory](/posts/ai/2026-08-10-agent-context-memory-failure-en) post concludes that giving an LLM more information makes it dumber — that's the same principle as Ng's, showing up in a different place.

**The modern version of "my test-set numbers are good" is "my eval numbers are good."** The site's [shipping is where the work starts](/posts/ai/2026-08-10-enterprise-agent-case-studies-en) post is about exactly this: green evals don't mean the system works, and the gap is usually a distribution shift.

## References

- [Lecture 3: Full Cycle of a DL Project](https://www.youtube.com/watch?v=MGqQuQEUXhk) — 2025/10/07, Andrew Ng. Source for the speed framing, the commensurability principle, the VAD cascade, and the drift and dashboard practice. **There are no slides for this lecture**
- [CS230 syllabus](https://cs230.stanford.edu/syllabus/) — lecture dates and the online-module mapping
- [Context and memory: where agents actually fail](/posts/ai/2026-08-10-agent-context-memory-failure-en) — on-site post, the modern version of "more data/context isn't always better"
- [Shipping is where the work starts: enterprise agent case studies](/posts/ai/2026-08-10-enterprise-agent-case-studies-en) — on-site post, the gap between test-set numbers and real usability
