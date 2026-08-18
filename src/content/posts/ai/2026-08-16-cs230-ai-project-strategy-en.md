---
title: "AI Project Strategy: Three Hours in a Spreadsheet Buys Back Weeks"
date: 2026-08-16
category: ai
type: guide
tags: [error-analysis, ai-agent, evaluation, machine-learning, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 6
tldr: "Andrew Ng demonstrates error analysis on a deep researcher: columns are the pipeline stages, rows are 10 to 100 queries, you only look at the ones that went badly, and you mark each cell where something broke. The percentages don't have to sum to 100%. He says it takes three or four hours and saves weeks of going the wrong direction — and the fraction of people who actually do it is far below 100%."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 6: a string of walls hit while building trigger-word detection (zero test set, 97% accuracy that never detected anything, audio addition producing a voice activity detector), the one-bug-a-day rhythm, how training time dictates the shape of the work, and the error analysis spreadsheet for a deep researcher pipeline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-ai-project-strategy)

> [The previous post](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf-en) covered reinforcement learning and RLHF. This one returns to the most practical end.

This post covers **[Lecture 6: AI Project Strategy](https://www.youtube.com/watch?v=s6JVGzABKho)** (2025/10/28, Andrew Ng, 1 hour 15 minutes).

**One warning first**: the [official syllabus](https://cs230.stanford.edu/syllabus/) entry for Lecture 6 lists "career advice / paper reading / healthcare AI guest" with 2024 slides — **that's stale.** The class actually recorded is AI Project Strategy, and the first sentence is "continue our discussion on AI project strategy." Careers is Lecture 9.

The lecture uses two examples: the first half is **trigger-word detection for a voice-controlled lamp** (a single end-to-end model), the second is an **AI deep researcher** (a multi-component pipeline). That second half is the most directly portable content in the whole series for LLM applications.

## Why teach this

> "Understanding algorithms matters … but what really drives performance is a team's **ability to run an efficient development process.** How do you tune hyperparameters? How do you collect data? You tried once and it didn't work — and it usually doesn't — **what do you do next?** The skill of making those decisions often produces a literal **10x** productivity difference."
>
> "I've watched teams at well-known brand-name companies spend **a year** on a project a more capable team finishes in **a month.**"

**Why this is unusually hard to learn**:

> "At a company you might change projects once every year or two. So you spend one or two years of your life to accumulate one more project's worth of experience, and after ten years you've finally seen ten projects."

So the point of this class is to **compress experience accumulation** — one session walking you through simplified versions of several projects he lived through.

## First half: the voice-controlled lamp

The product idea: buy a lamp that already has a name (Robert), plug it in, and say "Robert, turn on" — **no Wi-Fi setup, no phone pairing, no cloud.** The play is a small IC sold to lamp manufacturers.

This is a startup idea he and a friend actually discussed years ago and passed on because they had two other ideas they were more excited about. His own office is full of named voice devices — even the standing desk has a name.

(An ironic aside: "I've built so many smart speakers, and for a long time my house had exactly **one** Wi-Fi-connected lightbulb, because setup was too annoying.")

### What he'd do first: literature search, not code

First, the domain knowledge: general speech recognition is still too heavy for a "few-dollar edge device," but **detecting one fixed phrase is doable with a fairly small network.**

Then:

> "If I were doing this for the first time, the first thing I'd actually do is a **literature search.**"

**A surprising fact**: smart speakers have existed for over a decade, and **there's still no consensus best wake-word architecture in the literature** — the papers still disagree.

**How to do a literature search** (concrete enough to copy directly):

❌ The wrong way: read paper one to 100%, then read paper two to 100%.

✅ His way: a few searches to pull up a pile of resources → **skim all of them** → notice citations while skimming and follow them → find the one that actually matters (it might be the seventh) → **only then invest in reading it properly.**

> "The number of resources you actually finish is very small, but you spend a lot of time **bouncing around** building rough understanding of a wider set of papers."

**Go find experts** (he says Stanford students badly underrate this): do your own homework first, then **write a polite email to the paper's authors.**

> "Rather than me being stuck for another four hours … a lot of people, seeing you've already done the work and aren't just bothering them having done nothing, are willing to help."
>
> "The email costs you ten minutes and maybe has a 50% chance of a reply. Not 100%, but the ROI is often very high."

### Data: no dataset of "someone saying Robert turn on" exists online

You have to collect it. Ng is blunt about privacy: "Privacy matters, consent matters. **Don't do anything sneaky or weird.** Explain clearly what you're doing, ask for consent, and it's fine if they say no."

**Synthetic data works, but not as step one** — and his reasons are good:

1. It's hard to know how accurate synthetic data is relative to real data
2. **TTS has a limited number of voices**, so getting enough vocal diversity is a hassle
3. Too many hyperparameters to tune
4. "There's always a voice at the back of your head asking: **is there something weird about this synthetic batch that I haven't thought of?**"

**The video-game car story** (a very usable counterexample): building self-driving means detecting vehicles, and a lot of people think "grab car images from a video game." But **a photorealistic game might contain only 20 car models total** — that's fine for a human player, because realism doesn't require a thousand cars; but the diversity of vehicles on a real road is orders of magnitude higher.

### The data split: zero test set

His team really did this: **100 training clips, 25 dev set, 0 test set.**

> "If my goal is just to build a working system rather than publish, I often **don't build a test set.** Just training and dev, and I tune the system on the dev set **without guilt.** You need a clean unbiased test set to publish a paper."

"Robert turn on" is about a second; slide a 3-second window over a 10-second clip, and when the window's end lands exactly at the moment the phrase finishes → label 1. **100 clips × 30 windows each = 3,000 binary examples.**

### Wall one: 97% accuracy, and it never detected anything

> "We trained a big neural network, and **I could get the exact same result with that one line of Python.**" (`print 0`)

The positive-to-negative ratio is **1:30**. His imbalance rules of thumb are useful:

| Ratio | His reaction |
|---|---|
| 1:2 | Not worried at all |
| Up to 1:10 | Starting to worry, might do some balancing |
| 1:30 (this case) | It blew up |

Student proposals: duplicate positives, weight positives higher, penalize false negatives, reduce negatives (Ng notes the downside: **it reduces the diversity of your negatives**), add noise.

**What his team actually did**: not duplicate the positives, but **widen the positive time window** — from "finished speaking within the last 100 milliseconds" out to "finished within the last half-second to second." The same clip then produces **several positive windows at different positions**, which has a bit more diversity than plain duplication.

He's honest about it: "I'm telling you this not because it's some clever technique I'm proud of, but because I want you to see **the kind of hack real commercial machine learning teams actually use.**"

### Wall two: 95% on training, 30% on dev

Overfitting → try regularization first, then add data.

**Here he detours into train/test distributions**, and it matters:

> "There was a long-standing obsession in early machine learning that training, dev and test should be the same distribution. I think that's because same-distribution makes theorems easier to prove — **from a publishing standpoint, life is much better.**
>
> But practically, **your training distribution is often just not the same as your test distribution. That's life.**"

Concretely here: TTS can generate an enormous training set, but the cost is — **"users don't speak in synthetic speech, they speak in real speech."** So the **test set must be real data.**

### The synthetic data that finally worked, and its trap

**Sound adds** — add two waveforms directly and it sounds like the phrase spoken over that background noise. So: background noise (abundant online, **check the license terms**) + a few clean recordings of "Robert turn on" → add → a lot of positives.

**⚠️ But there's a trap here, the most elegant insight in the lecture:**

> "If you do exactly what I just described, you **won't get a Robert-turn-on detector, you'll get a voice activity detector.** Because there's a lot of background noise, and the only time anyone speaks they're saying 'Robert turn on' — so the model only has to decide **whether someone is talking**, which is far easier than actually recognizing the phrase."

**The fix**: also synthesize plenty of samples of people saying **other words.**

(On background music, his answer is **diversity beats guessing right**: rather than bet on whether users listen to classical or EDM and pick narrowly, take everything — **provided the network is big enough.**)

## "The machine learning workflow feels more like debugging than developing"

> "When you write traditional software you control all the code, so you write a spec, follow it, and it roughly works; you still debug, but those bugs are **my own bugs.**
>
> By contrast, building an ML system is more like — **I don't know what's about to happen.** So the ML workflow feels more like **debugging** than developing."

And if the task is one humans can do, the "bugs" are usually **the things a human obviously handles and the AI system doesn't.**

### The daily rhythm

| Time | What happens |
|---|---|
| Morning | Look at last night's training results, do error analysis |
| Afternoon | Write code to fix what you found |
| Evening (before leaving) | **Kick off the training job** |
| Overnight | Training runs about 4 hours |

> "If you can **fix one problem a day**, that's actually pretty good."

The counter-picture is vividly drawn:

> "Some teams wake up thinking 'hmm, what should we do next? Oh, let's have a meeting this afternoon. Wait, where's the data? OK, we'll meet tomorrow to look at data.' And then 'oh, our infra is down.'"

### Training time dictates the whole process design

| Time per training run | Shape of the work |
|---|---|
| 10 minutes | Train → get coffee → come back and analyze. **The bottleneck becomes how fast you analyze and fetch data** |
| 4 hours | Too long to wait, but perfect overnight → the daily loop |
| 3 weeks | Kick it off and "pray." You monitor, you launch several jobs asynchronously, and you usually spend another 1–2 weeks analyzing before launching the next round |

Projects **migrate**: 10 minutes at first, 4 hours as data grows, then 3 weeks, "and later a month and a half."

**How checkpoints are used**: on a three-week job you expect to reach some level after a day or two; if it's way off, ask "is the learning rate obviously wrong" before burning the other two weeks. Actually killing a job "happens very rarely." **Transfer learning is a tool for shortening the loop.**

### Why he's so fixated on speed

Months on the x-axis, error rate on the y-axis. If a competitor takes twice as long as you on everything:

> "What the customer cares about **at a given moment** is — **you're much better than them.**
>
> You might think 'I take two days, they take one, what's the big deal?' **The big deal isn't the few days, it's that you're 2x slower.**"

## Second half: the AI deep researcher pipeline

From a single end-to-end model to a **multi-component pipeline.**

The early linear architecture:

```
query →(LLM generates search terms)→ web search engine →(LLM reads snippets, picks pages to fetch)→ fetch pages → writing → output
```

His observation: "**more and more web search engines are designed for AI rather than for humans**, which I find quite interesting." The analogy for the page-selection step: "just like a human, I don't click every link after a search — I scan and then decide which to click."

He explicitly flags this as **an early architecture**: "a more modern deep researcher lets the system **decide for itself** when to search again and when to fetch more pages — more autonomous, more agentic."

### The core question: which component do you fix?

| Component | Failure mode |
|---|---|
| Generate search terms | The terms are simply wrong |
| Web search | Not comprehensive enough; **or not fresh enough** — "when you need genuinely recent news, the providers differ a lot" |
| Page selection | Fetches `bobsbackyardastronomyblog.com` and **skips nasa.gov** |
| Writing | Has good sources and still writes a bad article |

### Experienced people have "surprisingly low variance"

> "Get a few experienced machine learning people to look at the same system and you'll find **the variance in our opinions about what to do next is surprisingly small.** Not that we agree 100%, but the variance is much lower than you'd think. To me that means **there is a methodology here.** Among less experienced engineers the variance is much higher."

### The error analysis spreadsheet

**It's manual, and he stresses nobody actually does it:**

> "I know I've said it and you probably agree it's a good idea, but **the fraction of people who actually do it when the time comes is, I find, far below 100%.**"
>
> "Error analysis is often a very **manual** process. Because fundamentally it's about finding **where a human does better than the AI system** and then injecting that human knowledge into the system. The AI doesn't have that knowledge yet, so you just need human time. I know people are talking about automating this, and maybe there'll be progress, **but so far, someone has to look.**"

How it works:

- **Columns** = each stage of the pipeline (search terms / web search / page fetch / writing)
- **Rows** = queries, **between 10 and 100** of them. "I usually still have patience at 100 examples."
- **Only look at queries that went badly** — he basically doesn't look at the ones that went well
- Inspect the intermediate output in each cell, and log a mark when it's not OK ("Bob instead of NASA")

The result looks like this:

| | Search terms | Web search | Page selection | Writing |
|---|---|---|---|---|
| Share of failures | 20% | 5% | **70%** | 20% |

> **"These don't have to sum to 100% — sometimes one query breaks in more than one column."**

The conclusion is obvious: go fix page selection.

- Cost-benefit: "this process sometimes takes us **three or four hours**, but it saves **weeks** of going the wrong direction."
- The counter-scenario: if the real problem is page selection, but somebody is pitching a new search service and the team spends **six months** switching search engines — "it's entirely possible overall performance **doesn't move at all.**"

---

## Beyond the classroom: the LLM-application version of that table

Ng's example is already an LLM pipeline, so almost no translation is needed. What's worth adding is three things:

**One: the columns of that table are your trace spans.** If you have LLM traces, each span is a column. The difference is that **traces tell you which span was slow or errored, not which span did worse than a human would.** Only a person can supply that.

**Two: "only look at the failures" is more counterintuitive than it sounds.** Most people run evals by computing an aggregate score and checking whether it improved. Ng's approach **ignores successes entirely**, puts all attention on 10–100 failures, and tallies which column they concentrate in. These two approaches lead to completely different actions.

**Three: "the percentages don't have to sum to 100%" is an important detail.** It means one query can break in three places at once — and if you do your analysis by attributing to a single root cause, you will systematically underestimate problems in upstream components.

The site's [common RAG failure modes](/posts/ai/2026-03-12-rag-failure-modes-en) post lists ten problems and their fixes; what this lecture adds is **how you know which one you have.** All ten fixes are good, but if your actual problem is at the page-selection step, no amount of retrieval-strategy switching will move anything.

As for the trigger-word half, one insight holds up perfectly today: **"you'll get a voice activity detector."** When you build an eval set with synthetic data and every positive shares some surface feature, the model (or your judge) learns to detect that feature rather than the thing you meant to test. That's the same mechanism as the gap described in the site's [shipping is where the work starts](/posts/ai/2026-08-10-enterprise-agent-case-studies-en) post, seen from the other end.

## References

- [Lecture 6: AI Project Strategy](https://www.youtube.com/watch?v=s6JVGzABKho) — 2025/10/28, Andrew Ng. Source for the trigger-word case, the one-bug-a-day rhythm, the deep researcher pipeline and the error analysis spreadsheet. **There are no dedicated slides for this lecture**
- [CS230 syllabus](https://cs230.stanford.edu/syllabus/) — **note the Lecture 6 entry is stale**: it says career guest speaker, the actual video is AI Project Strategy
- [Stanford CS230 Autumn 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — the full nine-lecture list
- [Common RAG failure modes: 10 problems and their fixes](/posts/ai/2026-03-12-rag-failure-modes-en) — on-site post; what this lecture adds is how you know which one you have
- [Shipping is where the work starts: enterprise agent case studies](/posts/ai/2026-08-10-enterprise-agent-case-studies-en) — on-site post
