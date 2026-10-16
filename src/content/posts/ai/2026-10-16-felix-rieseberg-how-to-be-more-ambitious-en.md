---
title: "How to Be More Ambitious with AI: Altitude, Depth, and Range"
date: 2026-10-16
type: guide
category: ai
tags: [ai-agent, prompt-engineering, claude, anthropic, workflow]
lang: en
tldr: "Anthropic engineering lead Felix Rieseberg splits 'being more ambitious' into Speed, Altitude, Depth, and Range, then uses one quarterly business review (QBR) to show how to prompt and verify for each of the last three."
description: "A guided reading of Felix Rieseberg's 'How to be more ambitious' (2026-10-13): concrete prompts for moving a QBR deck up, down, and across fields, and how to check each move."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-16-felix-rieseberg-how-to-be-more-ambitious)

"We're not ambitious enough with AI" is easy to repost and hard to act on. Felix Rieseberg, an engineering lead at Anthropic, tries to close that gap in [How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) (2026-10-13). He splits ambition into four types and shows how to prompt for each, using a single quarterly business review (QBR) deck.

This guide covers his three main directions, the concrete prompts for each, and what to watch for when reading. After it, you should be able to look at a routine task of your own and decide whether to push it up, down, or across.

## What the article is

The author has led engineering for Claude.ai, Cowork, and Code Desktop at Anthropic. It's an eight-minute read of shared practice: no controlled experiment and no measured results, just one running hypothetical and the habits he uses day to day. He says the advice isn't model-specific, though he mostly uses Claude.

## Who it's for

- People who use AI daily but mostly for "fix this email" or "make this deck"
- People designing AI workflows for a team
- Anyone who wants to know which moves "be more ambitious" actually refers to

No background needed. The examples are a slide deck and customer churn, not code.

## Four types of ambition

| Type | Meaning | How the author treats it |
|---|---|---|
| Speed | Same work in less time | Well established; skipped |
| Altitude | Go from the task to the outcome | Main topic |
| Depth | Work the way a field-leading expert would | Main topic |
| Range | Pull in more fields than the task seems to need | Main topic; where he sees "the most magic" |

These are directions, not levels. You can push one task along one direction or several.

## The running example: Acme's QBR

The author imagines you work at a fictional company, Acme Inc, and need a QBR deck. The typical move is to hand the data to Claude and ask for slides, or fill in a template. All three directions below start from there.

## Altitude: ask what should happen next

His self-check is: what's the goal beyond the goal? At the start of last year he still asked Claude to fix individual crashes; eventually he asked it to keep the apps crash-free.

For the QBR he gives three steps, each higher than the last:

1. **Don't just update the template's numbers.** Give Claude as much data as you can and ask: what changed this quarter, why, and what should we do about it?
2. **End on decisions.** Ask it to work out the three most urgent decisions given everything it has learned, and to draft directions with arguments for and against.
3. **Question the format itself.** In his words, roughly: the review exists so leadership catches problems early and moves money and people to the right places. Design a better way to do that than a quarterly deck, show from our own history that it would have caught things sooner, and run it beside the current one for a quarter.

He gives two signs that going higher fits: you're really after an end result (it works less well for creative work), and you'd otherwise hold meetings about the work.

Altitude often means changing your workflow first. Before Claude could keep the apps crash-free, it needed easy access to crash reports, a mapping from app version to git commit, and Windows, macOS, and Linux machines to reproduce and verify fixes on its own. He also notes the limits: asking Claude to "go make money" doesn't seem to work for most businesses in 2026.

## Depth: demand the expert's instruments, not just their vocabulary

Suppose Acme struggles with user churn. The author lists five techniques:

1. **Insist on the instruments the best in the field use.** Asked to act like a professional, models often switch vocabulary without switching methods. If Claude reaches for markdown tables, push for databases and statistical models. You don't need to know what experts use; Claude usually does.
2. **Pick unreasonable goals and say they're reasonable.** Need a site to load in 5 seconds instead of 10? Ask for 200ms.
3. **Challenge what you know.** Give it raw data and ask it to check assumptions adversarially: "We believe churn is an onboarding problem. Try to reproduce that from the raw data."
4. **Produce new knowledge.** Once it's deep in the data, have it build a simulation of your customers that reproduces the last year from your logs, then find the earliest churn signal you don't know about and show it predicts on unseen data.
5. **Use an outside judge.** Don't ask the model to grade itself. He expects this to improve with model intelligence, but his advice for October 2026 is outside validation, ideally a tool the model can run for immediate feedback.

He also shares a prompt he uses, opening with "a deeper version of this task, not a bigger one." It asks the model to answer four things, then rewrite your prompt:

- What would a top professional do here that I'm not asking for?
- What's the rawest material they'd start from, rather than what's already been digested?
- Which specific methods and tools would they use?
- What, other than you or me, would show the result is right?

That last question is technique 5 in practice.

## Range: swap nouns for verbs, then assemble a crew

Range means looking at your work from more fields than used to be economical. As multi-agent setups get easier to run, he reports interesting results from pushing Claude to bring in extra fields. His example: he never thought of using Claude for 3D environments until he saw colleague Alex Albert use Blender for interior designs, even though he'd made video games before. That led to his new homepage.

Two techniques:

- **Replace nouns with verbs.** An old trick from Tom Kelley and Jonathan Littman's *The Art of Innovation*. A quarterly review isn't "a deck"; it's "getting busy people to believe a story about cause and effect, and to decide under uncertainty, in 30 minutes." The verbs show which fields might help.
- **Assemble the crew.** If the deck must be amazing or aliens blow up Earth, who does humanity send? His list: an analyst, a journalist, an editor; a motion and audio designer if it will be presented; and a short seller and a forensic accountant as a red team.

One explicit warning: it's easy to slip into role play, which makes the transcript weirder without improving the outcome. Use the method to find fields and techniques. Don't ask the model to write a short seller; ask it to do what a short seller does to research a position.

## The prerequisite: give the model a computer

The author says every kind of ambition above needs a computer where the model can install software and reach relevant data, through MCP connectors or other means. Many tools make this possible, and he recommends using one.

## Why the article exists (the author's argument)

He closes on motivation: people are held back by what they believe is possible and tend to trust themselves only in narrow disciplines. He points to self-efficacy, the idea that believing in your abilities helps you accomplish more, and to Locke and Latham's review of 35 years of goal-setting research, which he reads as showing that specific hard goals beat "do your best." He lists three documented ways to accomplish hard things: believe they're possible, watch someone else do them, and give yourself permission to fail.

I haven't checked those citations individually, so treat them as the author's claims.

## What to watch for

1. **It isn't "ask AI to do more."** His core line is "deeper, not bigger." Altitude changes the workflow, Depth changes the method, Range changes the fields. Simply enlarging a task is none of the three.
2. **Almost every move comes with a check.** Running a new process beside the old for a quarter, predicting on unseen data, and using an outside judge all share one idea: ambition needs something that can show it's right. Without that, you just get bigger mistakes.
3. **It's shared experience, not experimental results.** The QBR steps and the Acme churn analysis are illustrative hypotheticals with no control group or measured effect. The author names limits himself: "go make money" doesn't work yet, and Altitude fits creative work less well.
4. **Some advice is dated.** "Don't ask the model to judge itself" is explicitly his October 2026 advice, and he expects it may change.

## How to use it

Pick a task you do every week or quarter and run one round tonight:

1. Ask the first Altitude question: what changed, why, and what should we do about it? Attach all the raw data you can find.
2. Paste his "deeper version" prompt with your original prompt inside, and see what it rewrites.
3. For its last question, find something other than you and the model that can show the result is right, such as a held-out dataset or a check you can run. If you can't find one, build that first.

## References

- [How to be more ambitious: A tutorial for humans with models — Felix Rieseberg (2026-10-13)](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
