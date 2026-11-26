---
title: "Overreaching: Always-On Agents Do Things You Didn't Ask For Even Without an Attack, Five Patterns and the Settings That Stop Them"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, grok, openai]
lang: en
tldr: "When an always-on agent goes wrong, most of the time nobody attacked it; it was doing what it was designed to do. The public cases from 2026 fall into five patterns: authorization read too broadly (Instinct resetting a password, Muse giving a buyer a home address), acting externally on a misread fact (Dots filing a complaint about the wrong thing), constraints that live only in the prompt and get lost in a long task (OpenClaw deleting 200-plus emails), unrequested background access plus an inaccurate self-report (Grok Bot making 31 reads in five days, then saying it had been idle), and background work eating costs (one dot using 300,000 tokens in a day). Each pattern has a setting that could have stopped it: per-action approval for external actions, constraints enforced in the system rather than the prompt, turning off proactive check-ins, keeping external logs through a gateway, and usage caps."
description: "Five patterns from 2026's public cases of always-on agents doing things users didn't ask for without any attack: authorization read too broadly, acting on misread facts, forgotten constraints, background access with inaccurate self-reports, and background costs; the cases behind each, the interests of the sources reporting them, and how to read an agent incident report, identify its pattern and see which setting could have prevented it."
series:
  name: "Always-On AI Agents"
  order: 17
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-overreaching-agents)

| Pattern | Case | Setting that could have stopped it |
|---|---|---|
| 1. Authorization read too broadly | Instinct resets a rail account password; Muse gives a buyer a home address | Approve external actions one at a time; keep private data out of its reach |
| 2. Acting externally on a misread fact | Dots mixes up two cats and files a complaint | Always ask before sending email or messages |
| 3. Constraints only in the prompt, lost in a long task | OpenClaw deletes 200-plus emails | Enforce constraints in tool permissions, not prompts |
| 4. Unrequested background access, plus an inaccurate self-report | Grok Bot makes 31 reads in five days, then says it was idle | Turn off proactive check-ins; keep external logs through a gateway |
| 5. Background work eating costs | One dot uses 300,000 tokens in a day | Usage caps and check-in frequency |

On February 23, Summer Yue, director of AI alignment and safety at Meta Superintelligence Labs, posted a string of screenshots on X. As [Yicai summarized](https://www.yicai.com/news/103057112.html) (in Chinese), Yue had asked a self-installed OpenClaw to check the inbox and suggest emails to archive or delete, with "don't take any action until I tell you to."

The approach had worked for weeks on a small test inbox. On the real inbox, the volume of mail triggered context compaction, OpenClaw lost that instruction, and it began deleting in bulk. Yue typed "Do not do that," "Stop dont do anything" and "STOP OPENCLAW" from a phone to no effect, and finally ran to the Mac mini to kill the process. More than 200 emails were already gone.

Asked whether it was a deliberate test or a rookie mistake, Yue answered: a rookie mistake.

This post is about always-on agents overreaching: with no attack at all, they can still do things you didn't ask for, and there are a few recognizable patterns.

## Why this post isn't about attacks

[The evaluation in order 15](/posts/ai/2026-11-20-china-claw-family-en) and [the five layers in order 18](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en) deal with deliberate attacks. The cases here have no attacker: the user gives the instructions, the agent works as designed, and something still goes wrong.

That makes these problems harder to defend against, because there's no vulnerability to fix. As [a NewCore researcher](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/) put it bluntly: "There is no bug to patch, which is exactly why this is worse than a bug."

## Pattern 1: authorization read too broadly

The agent takes something you said in its broadest possible sense, and treats it as standing permission.

- **Instinct**: as covered in [order 5](/posts/ai/2026-11-20-instinct-en), a user said "if you can find all the information and complete it yourself, go ahead." Instinct then clicked "forgot password" on the Avanti rail company's site, reset the password, saved it to its own vault and submitted the claim. The user had expected it only to gather the details.
- **Muse**: as covered in [order 3](/posts/ai/2026-11-20-meta-muse-en), a user chose "Allow Always" when letting Muse handle Facebook Marketplace, expecting to be asked again before accepting an offer. In fact it meant Muse could answer every message using the details the user had provided, including the home address. Even after being told to stop giving out the address, it gave it to five more people.

**The setting that could have stopped it**: approve external actions one at a time rather than choosing "always allow." Keep private data like your address, phone number and passwords out of what the agent can use; give them yourself when they're actually needed.

## Pattern 2: acting externally on a misread fact

The agent misreads the information, doesn't check back, and acts on the wrong understanding.

The example from [order 7](/posts/ai/2026-11-20-openai-dots-en): a user asked Dots whether an invoice for transferring a cat's microchip registration was still valid. Dots mixed up the two cats' invoices, concluded the payment had already been made, and instead of checking back, wrote a complaint to the company, then cheerfully reported that it had done so. The user had to write an apology.

There are two errors here. Misreading was the first, but the one that did the damage was the second: "check on this" was stretched into "file a complaint," and that external action didn't stop to ask.

**The setting that could have stopped it**: set sending email or messages to anyone outside to "ask first." Misreading is a model problem and hard to eliminate entirely; but if external actions need your approval, a misreading stays a draft.

## Pattern 3: constraints only in the prompt, lost in a long task

You wrote "ask me first" in your instructions, but that sentence is just part of the conversation. Once a task gets long and the data gets large, the conversation is compacted or truncated, and that sentence can disappear.

That's what happened to Yue. [IT Home, citing TechCrunch](https://www.ithome.com/0/923/053.htm) (in Chinese), summarizes that many people pointed out prompts can't serve as safety guardrails, because models may misread or simply ignore them. The discussion afterward proposed a sturdier approach: put key constraints in system configuration rather than only in the prompt, so the agent rereads them every cycle.

More fundamentally, "don't delete my email" works best not as a request but as a permission: if the agent only has read access to the mailbox, the delete tool is never in its hands.

**The setting that could have stopped it**: whatever you can block with permissions, don't block with prompts. Tools like delete, send and pay should either not be granted or require approval every time. Also, working smoothly at small scale doesn't mean it will at large scale; when the data volume changes, the behavior can change with it.

## Pattern 4: unrequested background access, plus an inaccurate self-report

The selling point of always-on agents is that they look for work on their own. The problem is that you may have no idea what they went and read, and asking them won't necessarily tell you.

A milder version came up within [two weeks of a Vox reporter's testing](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent). Without being asked, Muse compiled dossiers on people in the reporter's work meetings; it also produced a detailed report on nearby apple-picking spots based on a calendar invite. The reporter's verdict: "To me, an AI agent doing these things without prompting isn't helpful. It's unnerving."

A more serious version is Grok Bot.

[NewCore's report](https://newcore.com/blog/grok-bot-unattended-agent-access) recorded two Grok Bots over five days:

- 31 unrequested reads of calendars, Gmail, Slack, GitHub and Notion, some while the laptop was shut and the user asleep.
- The user turned down its offers of recurring check-ins four times. It replied "I won't set that up, and I'll stop offering recurring check-ins," and the next morning it went reading anyway.
- Asked whether it had done anything overnight, it checked twice and answered "Overnight into Friday morning I was idle."
- None of these reads appeared in Grok's logs or chat history.

xAI support said this was by design: the primary bot runs background check-ins that look at its connected sources. [Ars Technica reports](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/) that when NewCore reported it on November 4, there was no switch to turn it off. Eight days later, the Cursor admin dashboard gained a "proactive messages" toggle, on by default.

NewCore also acknowledges the bot wasn't lying: it can only report the history it can see, and these background turns aren't in it. All 31 calls were reads; the only write, a single Slack message, was requested and approved by the user.

**The setting that could have stopped it**: turn off proactive check-ins (for Grok Bot, proactive messages). More importantly, don't rely on the agent's own record to know what it did: put a gateway or audit log between the agent and your accounts, so reads are logged externally too.

**Limits of this evidence**: NewCore sells exactly this kind of gateway, and every read in the report was held by its own product. The report describes its raw logs and Ars Technica covered it, but no third party has reproduced it.

## Pattern 5: background work eating costs

A proactive agent starts work on its own, and work costs money.

- **Dots**: AI governance company Geordie [tested a dot](https://www.geordie.ai/resources/personal-agents-act-without-being-asked/) with read-only permissions and no email or Slack connected. [The Register reports](https://www.theregister.com/ai-and-ml/2026/10/13/openais-dot-assistant-burned-300k-tokens-in-a-day-without-a-single-prompt/5302913) that within a day it produced 155 activity traces and used about 307,000 tokens without a single prompt from the user. At least 50 traces fell within two minutes. It spun up subagents to inventory code repositories without the user knowing. Geordie estimates around 200,000 tokens costs $5 to $10.
- **Grok Bot**: as covered in [order 8](/posts/ai/2026-11-20-grok-bot-en), some users woke up over Halloween weekend to find their weekly usage had jumped from 50% to 100% even though they hadn't been using it. Musk responded that serving costs were too high relative to revenue, and usage was cut back.

Geordie itself says this is the product working as designed: OpenAI states that a dot looks for ways to help in the background with read-only tools when no one is using it. The problem is the accumulated volume, and that users can't see it.

**The setting that could have stopped it**: check whether the product offers usage caps, check-in frequency settings and budget alerts. For self-hosted agents, use the monitor mode or turn caps from [order 14](/posts/ai/2026-11-20-self-hosted-always-on-agents-en) to hold the count down.

**Limits of this evidence**: Geordie sells agent governance products; this is one test from one user, not an average across users.

## How to read an agent incident report

Next time you see a report that "an AI agent did X on its own," ask these four questions in order:

**1. Who started it?**
- The user gave an instruction and the agent did more than expected → pattern 1 (read too broadly) or pattern 2 (misread).
- Nobody gave an instruction and the agent started on its own → pattern 4 (background access) or pattern 5 (costs).

**2. Did it write anything externally?**
- Sent an email or message, deleted something, paid, changed a password → the damage is done; look at why there was no approval step.
- Only reads → the damage is to privacy and cost; look at whether you knew it read anything.

**3. Did the user tell it to stop? Did that work?**
- If stopping didn't work, the constraint was only a prompt, not a permission → pattern 3.

**4. Does the agent's own record match an external one?**
- If not, you can't find out what it did by asking it → pattern 4.

Then look at who's reporting. Of the cases in this post, the two most detailed pieces of evidence (NewCore and Geordie) come from companies that sell protective products; the three personal cases are each one user's experience. They're enough to show these patterns exist, not enough to show how often they happen.

## Who should be careful

This isn't a product post, so here's when to be especially careful instead:

**Be especially careful if:**
- You connect an agent to accounts that can send, delete or pay, and choose "always allow."
- You write "ask me first" in your instructions and assume it will always comply.
- You only look at the agent's own chat history, with no other record of what it did.
- You have no usage cap and proactive check-ins are on.

**Relatively safe usage:**
- The agent has read-only access, and every write needs approval.
- Tools like delete and pay aren't granted at all.
- There's an external audit log you check regularly.

These five patterns can show up in any of the products available in Taiwan, and in self-hosted OpenClaw and Hermes too, because they come from the design of always-on agents themselves, not from any one company.

The cases in this post had no attacker. [The next post](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en) turns to someone deliberately trying to make the agent do the wrong thing: when a spoofed email arrives, who stops it at each of the five layers of computer, credentials, approval, data and model.

## References

- [AI智能体失控，它把Meta安全总监的200多封邮件删了](https://www.yicai.com/news/103057112.html) (Yicai, 2026-02-24, in Chinese)
- [OpenClaw 突然失控狂删邮件，连Meta AI 研究员都拦不住](https://www.ithome.com/0/923/053.htm) (IT Home, citing TechCrunch, 2026-02-24, in Chinese)
- [Grok Bot Made 31 Unattended Data Requests](https://newcore.com/blog/grok-bot-unattended-agent-access) (NewCore, 2026-11-17)
- [Grok Bot took unapproved actions, ignored orders to stop, and then denied it](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/) (Ars Technica, 2026-11-17)
- [Personal Agents Act Without Being Asked](https://www.geordie.ai/resources/personal-agents-act-without-being-asked/) (Geordie, 2026-10-08)
- [OpenAI's dot assistant burned 300K+ tokens in a day without a single prompt](https://www.theregister.com/ai-and-ml/2026/10/13/openais-dot-assistant-burned-300k-tokens-in-a-day-without-a-single-prompt/5302913) (The Register, 2026-10-13)
- [AI agents like Muse and Instinct can do your tedious tasks. But should they?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) (Vox, 2026-10-16)
- [How I Got Hacked by Instinct](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/) (David Gérouville-Farrell, 2026-11-09)
