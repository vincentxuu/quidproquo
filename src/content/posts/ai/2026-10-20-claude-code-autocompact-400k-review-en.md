---
title: "11 Days with /autocompact 400k in Claude Code: 16–22% Less Usage, No More Rework"
date: 2026-10-20
category: ai
type: guide
tags: [claude-code, context-window, compaction, cost-optimization]
lang: en
tldr: "On 1M-context models, Claude Code waits until about 967K tokens to auto-compact, so late messages each carry nearly a million tokens of history. I set /autocompact 400k as Lydia Hallie suggested and used it for 11 days: roughly 16–22% less usage, and no noticeable increase in rework or corrections from lost details. This is one person's observation on one kind of work, not a general finding."
description: "What Lydia Hallie's /autocompact 400k does, how to set it, why it saves usage, plus my 11-day results and when to raise the threshold."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-20-claude-code-autocompact-400k-review)

If you run Claude Code on a 1M-context model, this post answers one question: should you lower the auto-compact threshold to 400K? My answer is yes. Eleven days in, I saw none of the side effects I feared. There are two cases where you shouldn't, covered below.

## Why the default is expensive

On 1M-context models, Claude Code by default waits until about 967K tokens before it compacts automatically. The cost isn't the compaction itself but everything before it: every message resends the whole conversation history, so even a one-line reply at 900K tokens is a request of nearly a million tokens.

Claude Code team member [Lydia Hallie explained this in a post on October 9](https://x.com/lydiahallie/status/2108624109538291901), and cleared up some common confusion:

- Auto-compact does summarize. When it runs, the whole conversation is replaced by a short summary; it does not keep the last 1M tokens.
- The ~967K figure applies only to 1M models.
- Compaction itself is one request that reads about as many tokens as the message you sent right before it, mostly cache reads when the cache is warm.
- History is mostly read from cache, which is much cheaper, so it's usually fine while the cache is warm. But those tokens still count toward your usage and add up as the conversation grows.

`/autocompact 400k` makes the summary happen at 400K, so no single message gets more than about half as large. She credits @rohit3a with finding the problem; her post is the follow-up explanation.

## How to set it

In Claude Code, type:

```text
/autocompact 400k
```

Details you'll run into:

- Valid values range from 100K to 1M; `200000`, `500k` and `1M` all work. Anything outside the range errors out.
- 400K only matters on 1M models. Claude Code uses the smaller of your setting and the model's context window, so it changes nothing on a 200K model ([SpecWeave's write-up](https://spec-weave.com/docs/guides/claude-code-auto-compact/)).
- The command saves the value to your user settings, per model (since v2.1.288; before that it was one value for all models).
- `/autocompact auto` returns to the default.
- For a single launch, use the flag: `claude --autocompact 400k`.

When several sources are set, precedence from highest to lowest is the `CLAUDE_CODE_AUTO_COMPACT_WINDOW` environment variable, the launch flag, `/autocompact` and settings files, then the model default. The environment variable is the confusing one: while it has a value, `/autocompact` only reports that it's overridden and changes nothing, and it accepts bare integers only, so `500k` gets read as 500 and clamped to the minimum. If you set it and see no effect, run `/autocompact` with no argument; it shows the current window and where it came from. See [wmedia.es's breakdown](https://wmedia.es/en/tips/claude-code-auto-compact-window) and the [official docs](https://code.claude.com/docs/en/context-window).

## My 11 days

I switched to 400k after Lydia's post as she suggested, used it for 11 days straight, then looked back at the numbers. Two conclusions:

1. **Side effects were small.** On the kind of work I do, there was no noticeable increase in cases where the model redid work or needed my correction because details got compressed away.
2. **The savings were clear.** About 16–22% less usage.

One data point to compare: [@wholyv's post](https://x.com/wholyv/status/2108393422658908495) estimates that setting 400k earlier would have saved about 29% of their weekly usage. The two numbers were measured differently and can't be compared directly, but the direction agrees and the magnitude is close.

## Limits of this result

**This is one person and one kind of task.** I had no control group and only 11 days, so "no significant side effects" really means "none I noticed," not proof. If your work involves chasing one complex bug for hours, or needs to look back at verbatim output from hundreds of turns ago, your results may differ.

**Claude Code itself recommends `auto`.** The `/autocompact` help text says auto is a window tuned for your model and "strongly recommended for the best cost and performance," and when it detects an override it warns "Overriding auto may result in high token usage, especially when resuming long sessions" ([source](https://wmedia.es/en/tips/claude-code-auto-compact-window)). The logic: compacting earlier means compacting more often, and each compaction is a request that reads the entire history. If the cache has gone cold by then (say you were away for a long break), that one costs more than it would with a warm cache. So 400k isn't always a win; it pays off when your sessions are long and regularly pass 400K. Community accounts also say the Claude Code team treats 400K as an experimental threshold, to start from and then adjust per task ([relayed here](https://x.com/hqmank/status/2108852709205876971)).

**Summaries always lose something.** Verbatim content becomes a summary; tool output and intermediate reasoning are not kept.

## What to do

1. Run `/autocompact` first to see your current value and its source before changing anything.
2. If you work on everyday tasks and your sessions often run long, set `/autocompact 400k` and watch usage and rework for a week or two.
3. For investigations that need to look back at earlier output, temporarily raise it to 600k–700k and switch back afterward.
4. Don't keep requirements and architecture decisions only in the conversation. Put them in CLAUDE.md or task docs and lock critical behavior with tests, so the model can recover from the project itself when a summary drops details.
5. If the setting seems to have no effect, check whether `CLAUDE_CODE_AUTO_COMPACT_WINDOW` is set somewhere else.

## References

- [Lydia Hallie: explanation of auto-compact and /autocompact 400k (X, 2026-10-09)](https://x.com/lydiahallie/status/2108624109538291901)
- [Kai: relaying the Claude Code team's 400K experiment threshold (X)](https://x.com/hqmank/status/2108852709205876971)
- [Lxyv: estimate of 29% weekly usage saved (X)](https://x.com/wholyv/status/2108393422658908495)
- [SpecWeave: Claude Code auto-compact — compact at 400K to save usage](https://spec-weave.com/docs/guides/claude-code-auto-compact/)
- [wmedia.es: Claude Code auto-compact — who decides your context window](https://wmedia.es/en/tips/claude-code-auto-compact-window)
- [Claude Code docs: Explore the context window](https://code.claude.com/docs/en/context-window)
