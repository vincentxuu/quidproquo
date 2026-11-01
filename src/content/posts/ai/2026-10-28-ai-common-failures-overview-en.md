---
title: "AI Common Failures: Contrast Framing, Significance Inflation, Indicative Summaries, Overgeneralization"
date: 2026-10-28
category: ai
type: guide
tags: [llm-writing, llm, writing-process]
lang: en
tldr: "LLM prose has four recurring failures: contrast framing (refuting an X nobody said), significance inflation (dressing a plain fact up as a turning point), indicative summaries (announcing the topic, withholding the conclusion) and overgeneralization (summaries that drop conditions and scope). Fix the first three by cutting the filler and writing the answer; fix the fourth by checking each sentence against the source. Contrast framing has been traced to preference data, and models revising a draft move it into another contrast form, so banning a phrase in the prompt may not stop it."
description: "Overview of the AI Common Failures series: using one TL;DR that was rejected three times, how to spot and fix contrast framing, significance inflation, indicative summaries and overgeneralization, and which post to read first."
series:
  name: "AI Common Failures"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-28-ai-common-failures-overview)

## One TL;DR, rejected three times

This site has a post comparing [the four entry points of the Cloudflare Agents SDK](/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points-en). Its "how I'd choose" section gives a clear answer:

- If you already have a harness you want to use and can live with its experimental API: `PiHarness`.
- For a chat interface where you assemble every model call yourself: `AIChatAgent`; if the framework should run it: `Think`.
- If it isn't chat but needs state, scheduling or MCP: `Agent`.

An AI wrote the TL;DR. It was sent back three times:

| Version | TL;DR (excerpt, translated) | What the reader gets |
|---|---|---|
| 1 | "…one SDK, four entry points that own the loop in different places. This post uses a layer diagram, four conditions and three delegation mechanisms to show where a first version should start." | A list of the post's sections |
| 2 | "Cloudflare's docs tell you to start with the Pi harness; the repo README's first example is Agent. Both are right — the difference is who owns the agent loop…" | A tension, no answer |
| 3 | "The four entry points are not four features. They are four arrangements of who runs the loop…" | A position nobody held, refuted |
| Rewrite | "Already have a harness: PiHarness. Chat where you assemble each model call: AIChatAgent; let the framework run it: Think. Not chat but need state, scheduling or MCP: Agent." | Which class to pick |

The first three are grammatical and on topic. A reader who sees them still doesn't know which class to pick. The answer sat in the post's decision section the whole time; the last row just carries it out.

This series calls this kind of writing an **AI common failure**: it reads as if it carries information, yet the reader gets no answer, or an answer with the wrong scope. Humans write this way too. For three of the four (contrast framing, significance inflation, overgeneralization), studies have measured LLMs doing it more often than people; and each sentence holds up on its own, so "this sounds off" rarely catches it.

## The four failures

| Failure | What it looks like | Fix | Post |
|---|---|---|---|
| Contrast framing | "It's not X, it's Y", where nobody holds X | Drop X and state Y; keep X only if readers really believe it | [Part 1](/posts/ai/2026-10-28-ai-contrast-framing-en) |
| Significance inflation | "marking a pivotal moment", "reflecting broader trends" | Replace with a checkable fact, or delete | Part 2 |
| Indicative summary | "This post explores…", "We look at three aspects of…" | Put the conclusion itself in the summary | Part 3 |
| Overgeneralization | "associated under condition C" becomes "X improves Y" | Check subject, conditions and tense against the source | Part 4 |

The first two are sentence-level problems; the last two are summary-level.

### Contrast framing

Version 3 above: it denies "four features" and then offers "four ways of owning the loop". No reader thought the four classes were four features; the X was set up by the writer.

`rather than` became about seven times as frequent in NLP papers over seven years ([Zamaraeva et al., 2026](https://arxiv.org/abs/2610.10092)). For the Chinese 不是X，而是Y ("not X, but Y"), five commercial models use it 2.5 to 9.2 times as densely as a human reference corpus; almost none of the uses are wrong, but more than half are unnecessary ([Peng et al., 2026](https://arxiv.org/abs/2610.22249)).

### Significance inflation

[Wikipedia's guide to signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) records this 2024 edit to an article:

> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain.

The first half is a fact a reader can check (founded in 1989). The second half is a verdict that adds nothing.

[Reinhart et al. (2025, PNAS)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/) compared Llama 3 before and after instruction tuning and found the tuned version's style further from human writing. They also found GPT-4o uses present participial clauses at 5.3 times the human rate; that figure covers every participial clause, and a trailing verdict like ", marking…" is only one kind.

### Indicative summary

Version 1: the reader learns there is a diagram and four conditions, but not the conclusion. Abstracting research has long split summaries in two: an **indicative** summary says what a document covers; an **informative** one states the results and conclusions. The US abstracting standard [ANSI/NISO Z39.14](https://www.oregon.gov/ODOT/Programs/ResearchDocuments/Abstract-Guidelines.pdf) says documents reporting experiments or survey results get informative abstracts, and reserves indicative ones for editorials, books, directories and other documents with no single result to report.

So an indicative summary isn't wrong in itself. The failure is a text that has a conclusion and a summary that gives only the table of contents.

### Overgeneralization

Here the summary does state a conclusion, just with the wrong scope. An illustration: the source says "in participants over 65 with mild hypertension, group A's systolic pressure was lower than group B's after twelve weeks"; the summary says "A lowers blood pressure". The population, the condition and the comparison are gone.

[Peters and Chin-Yee (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12042776/) tested 10 models on 4,900 science summaries. In one comparison, they set four models (two GPT-4 Turbo interfaces, ChatGPT-4o and DeepSeek) against expert summaries from NEJM Journal Watch, and the LLM summaries were about five times as likely to overgeneralize.

Asking the model to be accurate roughly doubled overgeneralization. Models also differ a lot: Claude 2, 3.5 and 3.7 showed no significant difference from the source texts, while GPT-4o, LLaMA 3.3 and DeepSeek were the worst.

## The cause: contrast framing, at least, is traced to training data

When LLMs are trained on preference data, a person or a model picks the better of two answers (see [this overview of training stages](/posts/ai/2026-08-26-understanding-ai-models-training-stages-en) for the pipeline). Contrast framing has direct evidence: Zamaraeva et al. found both the raters in preference datasets and open reward models favor sentences with `rather than`, and Peng et al.'s reward-model experiments point the same way.

Zamaraeva et al. conjecture that a pairwise comparison sees the benefit of the construction in one answer but cannot see the cost of repeating it throughout a text. That conjecture hasn't been tested yet. The other three failures have only indirect signs so far, such as Reinhart's before-and-after comparison of instruction tuning; Part 5 collects the evidence and counterexamples.

## Banning the phrase may not stop the habit

The obvious fix is to write "don't use 'not X but Y'" in the prompt. Nobody has run a controlled experiment that bans a construction, but there are signs: Zamaraeva et al. had models revise their own papers in response to a review (the prompts mention no contrast construction at all). After revision by Claude Sonnet 5.5, Opus 5.5 and GPT-6-sol, `rather than` didn't consistently increase, but the postposed "X, not Y" rose clearly. The authors also checked sentence by sentence: a removed `rather than` being replaced by another contrast form was the exception, not the rule.

This site's TL;DR went down a similar path: each rewrite avoided the problem flagged last round and landed in another one. What finally worked was specifying **what the TL;DR must say** (the conclusion the reader needs, taken from the post's decision section), which produced the last row of the table. Parts 6 and 7 cover guardrails and when bans help.

## Don't overcorrect

People use all four forms. How well someone can tell AI prose by eye varies a lot: in [Russell et al. (2025)](https://arxiv.org/abs/2501.15654), four annotators who don't use LLMs for writing flagged about half of the human-written articles as AI, while a majority vote of five experts who use LLMs heavily for writing got only 1 of 300 wrong. An untrained reader who uses "does this look like AI" as the test will wrongly accuse many human writers.

So every test in this series asks one thing: what information is missing from this sentence. Part 8 is about exactly this.

## Where to start

- **If you write or edit drafts**: read Parts 1–4 in order; each has rewrites and a self-check.
- **If you design writing pipelines, prompts or checkers**: TL;DRs are what this site sends back most, so start with Part 3, which covers them, then Parts 6, 7 and 8.
- **If you want to know why this happens**: Part 5.
- **If you use coding agents and keep seeing "Done"**: Part 9 looks at the same failure outside prose, when an agent claims to have finished work it hasn't.

## Self-check

Here are four TL;DRs for the same (fictional) post on RAG chunking. Which failure does each have?

1. "This post reviews five chunking strategies for RAG and the pros and cons of each."
2. "Chunk size isn't a technical detail — it's the core of retrieval quality."
3. "Research shows smaller chunks improve retrieval accuracy." (Source: on one legal QA dataset, 256-token chunks had higher recall@5 than 1,024-token chunks.)
4. "Use 256-token chunks for short-answer queries; for summarization tasks that need whole-section context, use 1,024 tokens with overlap."

<details>
<summary>Answers</summary>

1. Indicative summary: the reader learns there are five strategies, not which one to use.
2. Contrast framing plus significance inflation: nobody claimed chunking is a mere detail, and "the core of quality" gives nothing usable.
3. Overgeneralization: "one legal QA dataset" and "recall@5" are gone, and a single result became a rule.
4. None: a reader can act on it. The content is a made-up example; don't take the numbers as advice.

</details>

Then open the summary of your latest post or PR, cover the body and read only the summary: could a reader make a decision from it? If not, go back to the body's decision section and move the conclusion up.

## References

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing): Wikipedia editors' catalogue of LLM writing patterns, each with real article revisions
- [Zamaraeva et al. (2026). I would rather quit NLP than read another paper like this: The rise of antithesis in NLP papers. arXiv:2610.10092](https://arxiv.org/abs/2610.10092)
- [Peng et al. (2026). Not X, but When: Diagnosing a Mandarin LLM Writing Tic through Contextual Appropriateness. arXiv:2610.22249](https://arxiv.org/abs/2610.22249)
- [Reinhart et al. (2025). Do LLMs write like humans? Variation in grammatical and rhetorical styles. PNAS 122(8)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/)
- [Peters & Chin-Yee (2025). Generalization bias in large language model summarization of scientific research. Royal Society Open Science](https://pmc.ncbi.nlm.nih.gov/articles/PMC12042776/)
- [ANSI/NISO Z39.14-1997 (R2009) Guidelines for Abstracts](https://www.oregon.gov/ODOT/Programs/ResearchDocuments/Abstract-Guidelines.pdf)
- [Russell et al. (2025). People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text. ACL 2025](https://arxiv.org/abs/2501.15654)
