---
title: "Fixing \"It's Not X, It's Y\": Three Forms of Contrast Framing, How Common It Is, and When to Keep It"
date: 2026-10-28
category: ai
type: deep-dive
tags: [llm-writing, llm, writing-process]
lang: en
tldr: "Ask two questions of every contrast: do readers actually hold X, and does rejecting X tell them anything new? If either answer is no, drop X and state Y. 'Rather than' became about seven times as frequent in NLP papers from 2019 to 2026, and five commercial models writing Chinese use the equivalent construction 2.5–9.2 times as densely as a human reference corpus. Models almost never misuse it, but more than half the uses are unnecessary, and with eight in one paper, at least one tends to annoy the reader."
description: "The contrast construction LLMs overuse (rather than; not X but Y; X, not Y): its three forms, what 2026 studies measured, why mostly correct sentences still annoy readers, and two tests for deciding whether each one stays, with rewrites."
series:
  name: "AI Common Failures"
  order: 1
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-28-ai-contrast-framing)

## What the construction is

Contrast framing defines a claim by first rejecting another one: "The four entry points are not four features; they are four arrangements of who runs the loop." It is the first failure in the [AI Common Failures series](/posts/ai/2026-10-28-ai-common-failures-overview-en), and the one with the most evidence: corpus counts in both English and Chinese, plus experiments tracing it back to training data.

[Zamaraeva et al. (2026)](https://arxiv.org/abs/2610.10092) split the family into three types:

| Type | Forms | Example |
|---|---|---|
| Substitution | rather than, instead of | "It manages state rather than connections." |
| Negation | not X but Y; X, not Y | "The problem is the data, not the model." |
| Emphatic | not only/just X but Y | "It's not just faster, it's cheaper." |

All three do the same job: they define Y through a rejected X. They differ only in which comes first and how hard X is rejected.

## How common it is

Zamaraeva et al. compared 4,744 ACL 2019 papers with 1,821 ACL-style arXiv papers from 2026:

- `rather than` rose from 0.134 to 0.993 occurrences per 1,000 words, about sevenfold.
- Postposed "X, not Y" rose from 0.049 to 0.201.
- `instead of` and `as opposed to` actually fell. The rise is concentrated in `rather than` and the postposed negation, not spread across the family.

They also had models write full papers from the titles and abstracts of real ones. GPT-5.6-sol and GPT-6-sol used `rather than` in every paper; Claude Haiku 4.5, Sonnet 5.5 and Opus 5.5 used it in nearly every paper, at lower rates than those two GPT models.

For Chinese, [Peng et al. (2026)](https://arxiv.org/abs/2610.22249) found five commercial models use 不是X，而是Y ("not X, but Y") 2.5 to 9.2 times as densely as a human reference corpus.

### A misquoted "three times"

A figure circulates in Chinese-language posts: AI writes 不是A而是B ("not A but B") three times as often as humans, attributed to the AI-detection company Pangram ([one example on Zhihu](https://zhuanlan.zhihu.com/p/2065864387496251506), in Chinese). [Pangram's own page](https://www.pangram.com/signs-of-ai-writing) measured the English "Not just X but Y", the emphatic type, at 1 per 10,000 words for humans and 3 for AI. Both the language and the construction were changed in transit. For the Chinese negation type, use Peng et al.'s 2.5–9.2×.

## Most sentences are fine; use enough and one will grate

What makes this construction hard to deal with is that most instances are correct on their own.

Peng et al. sorted 307 model-written uses of 不是X，而是Y into three classes (labels produced by Claude Sonnet 5.5, then reviewed by humans):

- **Substantive**: someone in context could plausibly believe X, and rejecting it tells the reader something. About 46%.
- **Optional**: correct, but removing X loses nothing. 52.8%.
- **Defective**: misused. Only 1.3%.

So the models' problem is overuse; their error rate is low.

Zamaraeva et al. had two researchers who regularly review for ACL conferences label each `rather than` as annoying or not, blind to its source. Almost no 2019 use annoyed them; about one in ten 2026 uses did. The two rarely agreed on which sentence, but a 2026 paper uses the construction about eight times on average, so roughly half of 2026 papers contain at least one use that annoys a given annotator.

The annoying uses had one thing in common: the rejected X was presented less favorably, and other coders more often judged it a straw man, a position nobody actually holds.

## The test: two questions

Peng et al. classify each use with a decision tree. Condensed for writing, it comes down to two questions:

1. **Do readers actually hold X?** Something said earlier in the text, a common misconception, or a claim someone made all count. A position the writer imagined does not.
2. **Does rejecting X tell readers something new?** For example, correcting a misconception that would lead them to do the wrong thing.

Keep the sentence only if both answers are yes. If either is no, drop X and state Y.

There is a third question that applies to the whole text: **how many times has this section used it already?** One contrast is reasonable; three in a section and readers start noticing the pattern instead of the content. My rule is at most one per section.

## Rewrites

**Example 1: nobody holds X, so drop it**

> The four entry points are not four features; they are four arrangements of who runs the loop.

No reader thought the four classes were four features. Without X, "four arrangements of who runs the loop" is still abstract, so the rewrite has to go all the way to the answer:

> If you already have a harness, use PiHarness. For chat where you assemble each model call yourself, use AIChatAgent, or Think if the framework should run it. If it isn't chat but needs state, scheduling or MCP, use Agent.

(The rewrite says "if it isn't chat", but that is a routing condition, not a contrast: it tells readers when to take this path.)

**Example 2: X exists only to prop up Y**

[Wikipedia's guide to signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) records this edit to the article on a Yayoi Kusama self-portrait:

> The viewer is presented with a self-image that is not grounded in visual mastery, but in what Amelia Jones terms "the performative enactment of subjectivity".

Nobody argued the painting is about technique; the negation only makes the second half sound weightier. Rewrite: "The self-portrait is a performance of subjectivity, in Amelia Jones's term."

**Example 3: X is a real misconception, so keep it**

> HTTPS encrypts what you send, not which domain you're connecting to: the SNI field in the TLS handshake is plaintext by default (unless both sides support ECH).

Many people believe HTTPS hides which sites they visit. That X is real, and rejecting it changes what readers conclude, so it stays.

## Same family: groups of three

Contrast framing often travels with another habit: bundling things in threes ("past, present and future"). In Pangram's corpus counts, triads appear 19 times per 10,000 words in AI text and 5 in human text, about four times as often. The test is the same: keep the three if each item adds something; if the third is only there for rhythm, cut it.

## When models revise, the contrast changes form

Zamaraeva et al. had models revise their own papers in response to a review (the prompts said nothing about contrast constructions). After revision by Claude Sonnet 5.5, Opus 5.5 and GPT-6-sol, `rather than` did not consistently increase, but postposed "X, not Y" rose clearly. Checking sentence by sentence, the authors also found that a removed `rather than` being replaced by another contrast form was the exception, not the rule.

No ban was involved, but the result is a warning: suppressing one phrasing may not suppress the habit behind it. A steadier instruction says what to write, such as "state the conclusion directly; use a contrast only to correct something the reader may actually believe". When bans help is the subject of Part 7.

## Why models like it

Both studies trace it to training data:

- Zamaraeva et al. found that human raters in open preference datasets favor responses containing `rather than`, as do four open reward models, and that a system prompt asking the model to be honest increases the construction.
- Peng et al. found several reward models favor the Chinese construction even over quality-matched rewrites, and an LLM judge favors it even where the context doesn't call for a contrast.

Zamaraeva et al. conjecture that preference comparisons look at one answer at a time: they see the benefit of a sentence that draws a careful line, but not the cost of the same move eight times in one text. That remains a conjecture.

The two studies also disagree on one result. Zamaraeva et al. tested the SFT, DPO and final stages of Tülu 3 8B and saw no rise in the construction at any stage; Peng et al., working with the same model family, saw its frequency rise after SFT and preference optimization. Which training stage introduces it is still open; Part 5 brings the evidence together.

## When to keep it

Contrast is a useful rhetorical tool, and human writing has always used it: Peng et al.'s human reference corpus contains the construction too, just far less densely. Pangram itself says on the same page that no single tell proves a text was written by AI.

So judge the construction by whether X exists and whether rejecting it helps, not by whether it looks like AI. A straw-man contrast written by a person is just as empty; a contrast written by a model that corrects a real misconception should stay.

## What you can do tonight

1. Open a draft you (or an AI) wrote and search for `rather than`, `not just`, `instead of` and `, not`.
2. Start with the title, the TL;DR and the first sentence of each section, where filler costs the most.
3. Ask the two questions of every hit; if either can't be answered, rewrite it as a direct statement.
4. If more than one survives in a section, keep the most useful one.

## Self-check

Keep or rewrite? If rewrite, how?

1. "This tool isn't just an editor, it's a complete development platform."
2. "`git reset --hard` doesn't delete commits; it throws away uncommitted changes. Commits it moves away from can still be recovered from the reflog (kept for 30 days by default)."
3. "The key to success isn't technology, it's team culture."
4. "We chose PostgreSQL rather than MongoDB because order data needs cross-table transactions."
5. "This post isn't about teaching you to code; it's about helping you understand the thinking behind it."

<details>
<summary>Suggested answers</summary>

1. Rewrite. Nobody thought it was only an editor; X is a straw man. Say what it adds: "It has a built-in terminal, debugger and deployment pipeline."
2. Keep. Many people think reset loses commits; rejecting that changes what readers do.
3. Rewrite. X and Y are both abstract, so readers get nothing. Name a concrete practice, or cut it.
4. Keep. Both options are ones readers actually weigh, and "rather than" comes with a reason.
5. Rewrite. It is an indicative self-description (the failure in Part 3), and nobody holds X. Say what readers can do after reading.

</details>

## References

- [Zamaraeva et al. (2026). I would rather quit NLP than read another paper like this: The rise of antithesis in NLP papers. arXiv:2610.10092](https://arxiv.org/abs/2610.10092)
- [Peng et al. (2026). Not X, but When: Diagnosing a Mandarin LLM Writing Tic through Contextual Appropriateness. arXiv:2610.22249](https://arxiv.org/abs/2610.22249)
- [Pangram: 9 Signs of AI Writing, Backed by Data](https://www.pangram.com/signs-of-ai-writing)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [Zhihu: "不是，而是" has become AI's catchphrase](https://zhuanlan.zhihu.com/p/2065864387496251506) (in Chinese; an example of the misquoted Pangram figure)
