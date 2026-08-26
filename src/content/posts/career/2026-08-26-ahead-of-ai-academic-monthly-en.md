---
title: "Ahead of AI: How a Scholar Built 200K Subscribers by Publishing Monthly, Not Daily"
date: 2026-08-26
category: career
type: deep-dive
tags: [newsletter, creator-economy, machine-learning, academia, substack, llm, content-creation]
lang: en
series:
  name: "一個人的媒體公司"
  order: 5
tldr: "Computational biology PhD turned UW-Madison professor Sebastian Raschka launched Ahead of AI on Substack in 2022, publishing monthly deep dives into LLM papers and architectures. Four years later: 200K+ subscribers, zero sponsorships, and a book-newsletter flywheel that proves low frequency and high depth can win in a crowded AI newsletter market."
description: "The complete growth story of Sebastian Raschka and Ahead of AI: from computational biology PhD and UW-Madison professor to Lightning AI research engineer and 200K-subscriber technical newsletter — timeline, content strategy, business model, and methodology."
draft: false
---

> 🌏 [中文版](/posts/career/2026-08-26-ahead-of-ai-academic-monthly)

Most successful AI newsletters compete on frequency — daily updates, five-minute digests, one visual per day. Sebastian Raschka went the opposite direction: one to two issues per month, each taking 30–90 minutes to read, focused on deep dives into LLM architecture papers. Four years in, Ahead of AI has 200K+ subscribers. He has never accepted a single sponsorship.

## Background: From Molecular Recognition to Large Language Models

Sebastian Raschka's academic starting point wasn't AI. His PhD at Michigan State focused on computational biology — specifically, using statistical data mining to uncover hidden patterns in molecular recognition. The turning point came in 2012, when he took Andrew Ng's pioneering Coursera ML course.

In 2015, he published his first book, *Python Machine Learning* (Packt), which eventually went through three editions and became a bestselling textbook. That book established his reputation in the ML community as someone who could explain complex ideas clearly — a reputation that later became the most important asset for launching a newsletter.

In 2018, he joined the University of Wisconsin-Madison's statistics department as an assistant professor, but taught deep learning. The gap between academia's pace and AI's explosive growth was enormous — he had far more to share than the formats of papers and courses could accommodate.

In 2022, he made two major moves: joining Lightning AI (the company behind PyTorch Lightning) as a Staff Research Engineer, and launching Ahead of AI on Substack.

In his launch blog post, he was straightforward about the motivation:

> "There are many smaller but exciting topics I'd love to share and write about that don't fit the blog format."

The newsletter became a third container — something between long-form blog posts and social media fragments.

## Growth Timeline

| Date | Milestone |
|---|---|
| Sep 2015 | Published *Python Machine Learning* (Packt), establishing ML educator reputation |
| 2018 | Joined UW-Madison statistics department as assistant professor |
| Oct 15, 2022 | Launched Ahead of AI on Substack; first issue: "A Diffusion of Innovations" |
| 2022 | Also joined Lightning AI as Staff Research Engineer |
| 2022 | Published *Machine Learning with PyTorch and Scikit-Learn* (Packt) |
| Apr 2023 (~6 months) | Passed 15K subscribers |
| Feb 2024 (~16 months) | Passed 50K subscribers |
| Oct 2024 | Published *Build a Large Language Model (From Scratch)* (Manning) |
| Jul 2026 | Passed 200K subscribers; published *Build a Reasoning Model (From Scratch)* (Manning) |
| Aug 2026 | LLMs-from-scratch GitHub repo surpassed 100K stars |

Unlike the explosive growth curves of daily newsletters, Ahead of AI grew on a steady slope — 15K at six months, 50K at sixteen months, 200K at four years. No "income exceeded my salary in five months" drama, but also no "I'm burning out and need a co-founder" anxiety.

## Content Strategy: Paper Translator, Not News Curator

Ahead of AI's core format is **one to two long-form articles per month, each requiring 30–90 minutes of reading time**, focused on LLM architectures, training methods, and inference optimization.

Compared to Daily Dose of Data Science's 150-word daily visuals or TLDR's five-minute news digest, Ahead of AI takes a fundamentally different approach. Sebastian isn't deciding "which news is worth reading" — he's reading a paper or cluster of papers deeply, then translating them into language engineers can follow, with diagrams and code references.

His workflow spreads across the entire month:

1. **Daily scanning**: Browse X and arXiv each morning, flagging interesting papers
2. **Topic filtering**: From 30–50 flagged papers, select the ones he genuinely wants to go deep on
3. **Per-paper breakdown**: Spend 30–60 minutes per paper reading, note-taking, and creating visuals
4. **Assembly**: On weekends, consolidate scattered notes into a coherent long-form piece

In an Interconnects interview, he emphasized his topic selection strategy: **only write about papers you're genuinely interested in**. This isn't marketing talk — his logic is that if he's not excited about a paper, readers will feel it. Low publishing frequency gives him the luxury of never writing filler.

The content scope has also evolved. Early issues covered a broader range (diffusion models, general AI trends); later issues focused almost entirely on LLMs — architecture variants, attention mechanisms, inference-time scaling, open-weight model comparisons. This narrowing wasn't deliberate planning — it tracked the field's center of gravity, and happened to overlap perfectly with his work maintaining LitGPT at Lightning AI.

## Business Model: Books First, Newsletter as Flywheel

Sebastian Raschka's monetization path looks nothing like most newsletter creators:

1. **Books** (primary): Five books spanning a decade — *Python Machine Learning* (2015/2017/2019, three editions), *Machine Learning with PyTorch and Scikit-Learn* (2022), *Machine Learning Q and AI*, *Build a Large Language Model (From Scratch)* (2024), and *Build a Reasoning Model (From Scratch)* (2026). Book royalties are his most stable income source.
2. **Substack paid tier** ($6/month): Paid subscribers unlock the full archive and deep-dive technical posts. Currently 1,000+ paid subscribers.
3. **Full-time job** (Lightning AI): He has never been a full-time newsletter creator — his day job as a Staff Research Engineer at Lightning AI is the primary income.
4. **Open source + GitHub**: The LLMs-from-scratch repo has 100K+ stars, serves as companion code for his books, and doubles as a reader discovery channel for the newsletter.

**He deliberately refuses sponsorships.** In the Interconnects interview, he positioned the newsletter as "community contribution" rather than a commercial product. This choice sacrifices short-term revenue but buys complete editorial independence — readers know his recommendations carry no commercial incentive.

This stands in sharp contrast to the ad-driven models of TLDR and Morning Brew. He doesn't need millions of subscribers to support an ad business because his revenue structure doesn't depend on subscriber count at all. The newsletter functions more as a **persistent marketing channel for book sales** and a **trust asset for his personal brand**.

## How He's Sustained Monthly Publishing for Four Years

Monthly publishing sounds easier than daily, but the per-article investment for technical deep dives far exceeds a curated digest. Several structural factors explain Sebastian's sustainability:

**His day job and side project cover the same territory.** At Lightning AI, his work involves researching LLM architectures and maintaining LitGPT — reading papers and understanding architectures is already part of the job. The newsletter is just those insights organized into prose. He doesn't spend extra time finding material.

**Low frequency reduces decision fatigue.** Daily creators face "what do I write today?" pressure every morning. Monthly publishing requires only one or two topic decisions per month. He can wait until something genuinely worth writing about shows up.

**Academic training provides writing discipline.** A decade of writing papers and textbooks gave him a mature workflow for explaining complex concepts through diagrams and step-by-step breakdowns.

**Intrinsic motivation outweighs external incentives.** In interviews, he's said: "There's like a reward in a sense" — reader feedback and discovering his own knowledge gaps through writing are the main forces keeping him going. This parallels Daily Dose's Avi Chawla maintaining a file of positive reader feedback to fight impostor syndrome.

**LLMs assist but don't replace the writing.** He uses LLMs for rephrasing and evaluation, but maintains human editorial control. The value of technical deep dives lies in the author's judgment — which papers to cover, which details matter, which claims to be skeptical about — and that can't be outsourced.

## His Lessons

**Books and newsletters feed each other.** Long-time newsletter readers are the first buyers of each new book. Book readers discover the newsletter through GitHub repos and references. He doesn't need to do marketing — the content *is* the marketing.

**Refusing sponsorships is a positioning strategy.** In an AI newsletter landscape saturated with sponsored content, "this person never takes sponsorships" is itself a differentiator. Readers trust his recommendations because there's no commercial motive behind them.

**Academic training is a moat, not baggage.** Many people leaving academia assume their training has no industry value. But Sebastian's paper-reading ability, diagram-making skills, and capacity for systematic explanation of complex concepts all come from academic training — and these are exactly the skills a technical newsletter demands most.

## The Big Picture

Ahead of AI's success rests on several specific conditions: Sebastian already had a decade of writing reputation in the ML community (not starting from zero), his full-time work and newsletter topics overlap completely (no extra time cost), LLMs happened to be the hottest technical topic from 2022–2026 (ever-expanding demand), and he has bestselling books as an income source independent of subscriber count (no need for the newsletter to pay the bills).

But the truly noteworthy part is his **counterintuitive choices**: when everyone else was chasing daily publishing and ad revenue, he chose monthly cadence and zero sponsorships. This worked because he positioned the newsletter as one component of a book flywheel, not as a standalone business.

For anyone considering technical content creation, the biggest takeaway from this case is: **not every newsletter needs to monetize through subscriber count.** If you have other income sources (books, courses, a full-time job), a newsletter can be a pure trust asset — building reader confidence in your professional judgment, then monetizing through books, courses, or career opportunities. Low frequency and high depth isn't a compromise. It's a strategy.

## References

- [Ahead of AI — Substack](https://magazine.sebastianraschka.com/)
- [Ahead of AI launch post (Sebastian Raschka's blog)](https://sebastianraschka.com/blog/2022/ahead-of-ai-and-whats-next.html)
- [Sebastian Raschka — 15K subscriber milestone (Substack Note)](https://substack.com/@rasbt/note/c-15347818)
- [Sebastian Raschka — 50K subscriber milestone (Substack Note)](https://substack.com/@rasbt/note/c-50030862)
- [Interviewing Sebastian Raschka on the state of open LLMs, Llama 3.1, and AI education (Interconnects)](https://www.interconnects.ai/p/interviewing-sebastian-raschka)
- [LLMs From Scratch at 100,000 GitHub Stars (Sebastian Raschka's blog)](https://sebastianraschka.com/blog/2026/llms-from-scratch-reaches-100000-github-stars.html)
- [rasbt/LLMs-from-scratch — GitHub](https://github.com/rasbt/LLMs-from-scratch)
- [Build a Large Language Model (From Scratch) — Manning](https://www.manning.com/books/build-a-large-language-model-from-scratch)
- [Build a Reasoning Model (From Scratch) — Manning](https://www.manning.com/books/build-a-reasoning-model-from-scratch)
- [Lex Fridman Podcast #490 — State of AI in 2026 (with Sebastian Raschka & Nathan Lambert)](https://lexfridman.com/ai-sota-2026-transcript/)
- [Sebastian Raschka — personal website](https://sebastianraschka.com/)
