---
title: "Should Code Have Comments: Three Answers from Clean Code, A Philosophy of Software Design, and Redis"
date: 2026-09-25
type: deep-dive
category: tech
tags: [code-comments, clean-code, software-design, software-engineering, documentation, code-quality]
lang: en
tldr: "There is no 'never comment' school — only 'comment by exception' (Uncle Bob) versus 'comments are part of the design' (Ousterhout, antirez). In their 2024–2025 public debate, both agree on why-comments and against noise comments; the real fights are over interface comments for internal methods, long names as a substitute, and whether comments can be trusted. Controlled studies say quality decides: the same comments moved performance anywhere from -30% to +34% depending on the snippet."
description: "A map of the code-comments debate: Robert Martin's 'comments are always failures' in Clean Code, John Ousterhout's case for interface comments, the nine comment types antirez found in Redis, the four real disagreements in their public debate, what empirical studies show, and what changes when LLMs read comments as context."
draft: false
glossary:
  - term: "self-documenting code"
    aliases: ["self-describing code"]
    definition: "The idea that good names, short functions, and clear structure let code explain what it does by itself, reducing the need for comments."
    context: "The core claim of the 'fewer comments' camp in this article, most associated with Robert C. Martin."
  - term: "interface comment"
    aliases: ["header comment", "function comment"]
    definition: "A comment at the top of a function, class, or module that tells callers everything they need to use it — argument constraints, return value, side effects — without reading the implementation."
    context: "Ousterhout argues there is no real abstraction without interface comments; this is where he and Uncle Bob disagree most."
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-09-25-code-comments-debate)

Most engineers have heard both lines: "good code doesn't need comments" and "uncommented code is unreadable." They're usually framed as two schools, but once you read what the leading voices actually wrote, nobody argues for zero comments. The real disagreement is about the **default**: are comments an exception, or part of the design?

This piece draws on three primary sources: [Robert C. Martin (Uncle Bob)](https://en.wikipedia.org/wiki/Robert_C._Martin)'s *[Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)*, [John Ousterhout](https://web.stanford.edu/~ouster/)'s *[A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)* (APOSD), and Redis creator [antirez's essay classifying code comments](https://antirez.com/news/124). The most useful of these is the [public debate transcript](https://github.com/johnousterhout/aposd-vs-clean-code) Ousterhout and Martin produced between September 2024 and February 2025, where they argue point by point in a single document.

## The fewer-comments camp: Uncle Bob and self-documenting code

Chapter 4 of *Clean Code* covers comments. In the debate, Ousterhout quotes this passage from page 54 (Martin doesn't dispute the quote):

> The proper use of comments is to compensate for our failure to express ourselves in code. ... Comments are always failures.

Martin's reasoning: comments exist because the language, or the programmer, failed to express intent. With a perfect programming language, we'd never write another comment. So he moves comments *into* code, preferring long names like `isLeastRelevantMultipleOfLargerPrimeFactor` over short names plus explanation.

He gives two reasons. First, he doesn't trust comments to be maintained — the code changes, the comment doesn't, and it becomes misinformation. Second, he doesn't trust them to be read: many IDEs paint comments light grey, while names are hard to ignore. He sets his own IDE to paint comments fire-engine red.

Martin also points out that the chapter opens with "Nothing can be quite so helpful as a well placed comment." What he opposes, he says, is *gratuitous* comments. He wrote the chapter to push back on a habit left over from the '70s and '80s, when uncommented assembly and FORTRAN really were impenetrable and "write comments" became unconditional wisdom.

## The more-comments camp: Ousterhout's interface comments and antirez's nine types

Ousterhout gives two reasons comments are needed.

**The first is abstraction.** For a method to be usable without reading its code, it needs an interface comment telling callers what they need to know. He takes Martin's own example, `addSongToLibrary(String title, String[] authors, int durationInSeconds)`, and asks: What format should author names use? Does array order matter? If a title already exists, is it replaced or duplicated? Is the library in memory or on disk? The signature answers none of these.

**The second is non-obvious information.** His example is `PrimeGenerator` from *Clean Code*: the algorithm starts marking multiples at the square of each prime, which makes an orders-of-magnitude performance difference, and nothing in the code says why. He says students in his class usually can't figure it out in 30 minutes; with comments, they'd get it in a few.

antirez goes further. From the Redis source he identifies nine types of comments:

| Type | Purpose | antirez's verdict |
|---|---|---|
| Function | Interface docs; after reading, treat the implementation as a black box | Good |
| Design | File-level overview of algorithms chosen and alternatives rejected | Good |
| Why | What the code does is clear; why it does it isn't | Good |
| Teacher | Teaches the underlying domain (math, data structures) | Good |
| Checklist | "If you change this, also change that" | Good |
| Guide | Divides code into sections and sets reading rhythm | Good (he calls it the most subjective) |
| Trivial | Costs as much to read as the code itself | Bad |
| Debt | TODO, FIXME, XXX | Avoid where possible |
| Backup | Commented-out old code | Bad |

Guide comments are the most contested. Something like `/* Free the query buffer */` adds nothing the code doesn't already say — exactly what *Clean Code* would tell you to delete. antirez admits this category is subjective, but argues that comments aren't only for missing information: they also **reduce what the reader has to hold in their head**. In a Lua stack API sequence, he annotates each line with the current stack state so the reader doesn't have to simulate it mentally.

## The middle ground: code says how, comments say why

Stack Overflow co-founder Jeff Atwood's 2006 post [Code Tells You How, Comments Tell You Why](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/) is probably the most-cited compromise: first make the code as easy to understand as possible without comments; only when you can't simplify further, add comments. Code can explain *how*; only comments can explain *why*.

He quotes Jef Raskin's example: a comment explaining why Boyer-Moore was chosen over binary search. No amount of clean code can carry that information.

## The four real disagreements

Read the debate end to end and there's a lot both sides **agree** on: why-comments belong in the code, public APIs need documentation, noise like `array_len++; /* increment length */` should go, and commented-out code shouldn't be left behind. The disagreement comes down to four points:

**1. Interface comments on internal methods.** Martin agrees they're needed for public APIs or cross-team interfaces, but thinks a team familiar with its own system can usually rely on good method and argument names. Ousterhout says that requires everyone to keep the whole system loaded in their heads — and he forgets code he wrote a few weeks ago.

**2. Long names as a substitute for comments.** Martin prefers long names, with the rule that the smaller the scope, the longer the name. Ousterhout finds them awkward to read and notes that a name can't express something like `primes[n]`. On that example, Martin concedes that sometimes a comment is more precise.

**3. Whether comments can be trusted.** This is the sharpest exchange. Martin says he treats every comment as potential misinformation to be cross-checked against the code. Ousterhout responds that refusing to trust interface comments means recursively reading every method you call — an enormous cost. He estimates missing comments cost 10 to 100 times more than incorrect ones, though that's his personal experience, not a measurement.

**4. How much effort the reader should spend.** Martin explains the prime algorithm with an ASCII diagram and says readers will "stare at this for some time" before it clicks. Ousterhout's reply: suffering followed by catharsis is great for Greek tragedies, not for reading code. Every question a reader might have should be answered directly, in the code or in comments.

The fourth point is the root of the whole argument: they define good code differently. Martin wants concise code that asks a little effort of the reader. Ousterhout wants code that's **obvious** — a reader skimming in a hurry should guess right the first time.

## What the empirical research says

There are controlled experiments, and their conclusions are more cautious than either camp.

[Nielebock et al.'s 2018 experiment in *Empirical Software Engineering*](https://link.springer.com/article/10.1007/s10664-018-9664-z) had 277 participants, mostly professional developers, do small programming tasks. For small tasks, comments turned out to matter less than earlier studies — and the participants themselves — assumed. Participants rated good identifiers as more helpful than comments, while still stressing that some situations require comments. That leans toward Martin, but only within the scope of **small tasks**.

A [2026 eye-tracking study](https://link.springer.com/article/10.1007/s10664-025-10721-2) had 20 computer science students read 12 Java snippets with and without comments. The effect of comments varied widely by snippet, from a 30% drop in performance to a 34% gain. Participants generally *felt* comments helped, but that feeling didn't consistently show up in correctness or response time. Most read the code first, then the comments. With student participants and short snippets, generalizing to large codebases calls for caution.

Taken together: neither "more is better" nor "less is better" holds. The effect depends on what the comment says and what code it sits on. Both camps can claim support — bad comments really do slow people down, and good ones really do help.

## LLMs are now readers too

Comments used to have only human readers; now coding agents read them too. [A September 2026 paper accepted to Findings of EMNLP 2026](https://arxiv.org/abs/2609.09242) tested how comments affect LLM code generation, and the result matches the human studies: comment frequency on its own doesn't predict pass rates — content does. Prefilling a weaker model with comments from a stronger model's *correct* solution raised pass@1 by 17.2% on average; comments written for a different problem lowered it.

My inference (the paper doesn't test this directly): once agents read comments as instructions, a stale comment isn't just a waste of human time — it can lead an agent to edit code according to a wrong description. That strengthens both sides. Martin is right to worry about comments going stale, and Ousterhout is right that interfaces and intent need to be written down — an agent can't walk over and ask the original author.

## What to actually do

Combining the shared ground with the evidence gives a handful of concrete habits:

- **Try changing the code before writing the comment.** Before writing "this block computes X," try extracting a function or renaming a variable. If it still needs explaining, then write the comment.
- **Always write the why.** Wherever the code could look simpler but you deliberately didn't do that, write one line explaining why. The Redis `expire.c` comment on why the DB counter increments at the top of the loop is the textbook case.
- **Write interface comments for public interfaces**, focused on what the signature can't express: preconditions, side effects, edge cases.
- **Check the comment above when you change code.** Make "is this comment still true?" a code review item — more useful than arguing about whether to comment at all.
- **Clean up TODOs regularly.** antirez's advice: grep for them periodically, fix what you can, and move the rest into the file's design comment.
- **Don't leave commented-out code.** That's what git is for.

Whether to write guide comments is a call for each team — even antirez admits it's subjective.

## References

- [A Philosophy of Software Design vs Clean Code (Ousterhout × Martin debate transcript)](https://github.com/johnousterhout/aposd-vs-clean-code)
- [Writing system software: code comments — antirez](https://antirez.com/news/124)
- [Code Tells You How, Comments Tell You Why — Jeff Atwood, Coding Horror (2006)](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)
- [A Philosophy of Software Design — John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)
- [Clean Code: A Handbook of Agile Software Craftsmanship — Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Nielebock et al. (2018). Commenting source code: is it worth it for small programming tasks? Empirical Software Engineering](https://link.springer.com/article/10.1007/s10664-018-9664-z)
- [The Effect of Comments on Program Comprehension: An Eye-tracking Study. Empirical Software Engineering (2026)](https://link.springer.com/article/10.1007/s10664-025-10721-2)
- [Talking to Itself While Coding: What Makes Comments Help Code Generation? arXiv:2609.09242](https://arxiv.org/abs/2609.09242)
