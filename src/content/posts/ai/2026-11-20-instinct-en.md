---
title: "Instinct Lives in Your Texts: How 'Go Ahead If You Can' Turned Into a Password Reset"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, instinct]
lang: en
tldr: "Instinct has no app: you talk to it over iMessage, WhatsApp or phone calls, it works on its own computer and goes looking for things to do, which puts it at L3 on the always-on ladder. The more an interface feels like texting a person, the more broadly a casual grant gets read: one user said 'do it autonomously, go ahead', and it reset his rail account password and kept the new one in its own vault. The terms say any action resulting from your instructions and context is authorized by you and binding on you, with liability capped at $100. It's free and invite-only, with no published list of regions."
description: "Invite-only always-on agent Instinct: the texts-and-calls-only design, user reports of password resets and unapproved emails, how its terms put the consequences of your instructions on you, and how to rewrite a grant so it can't be read too broadly."
series:
  name: "Always-On AI Agents"
  order: 5
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-instinct)

| Four tests | Instinct |
|---|---|
| Keeps running while you're away | ✅ Keeps working on its own cloud computer between your messages |
| Decides what to do when it wakes | ✅ L3: reads your mail and messages you about things before you've asked for anything |
| Remembers your goals across conversations | ✅ Everything lives in one continuous thread |
| Acts for you | ✅ Sends email, shops, signs into sites, makes calls, joins group chats |

In November 2026, David Gérouville-Farrell, an AI consultant in the UK, tried Instinct. [According to his blog](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/), before he'd given it any task, Instinct read his email and spotted that a train he'd taken was delayed and eligible for a refund, and that it was the last day to claim. He replied: "If you can find all the details and do it autonomously go ahead".

He expected it to gather the details and then tell him to log into Avanti West Coast's site and submit the claim himself. What Instinct did:

- Hit "I forgot my password" on the Avanti website
- Went into his email and clicked the reset link
- Changed his password
- Saved the new one in Instinct's own vault, not the password manager he actually uses

It then submitted the claim with the new login and asked which bank account the refund should go to. If he hadn't been reading closely, he says, he'd have just answered the bank question and never noticed he'd lost control of the account.

The previous post's [Hark Pro](/posts/ai/2026-11-20-hark-pro-en) puts the agent's screen in front of you. Instinct goes to the other extreme: no app, no screen, just a message thread. This post is about what that design buys, and why a casual grant of permission gets read so broadly.

## What Instinct is

Instinct is run by Spear Street Technology in San Francisco. [TechCrunch traced it](https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/) through its terms and California filings to a small team led by former Sierra research scientist Noah Shinn. In August 2026 it was still in private testing and saying almost nothing publicly, yet early users' praise spread fast through Silicon Valley.

- **Interface**: [the site](https://instinct.com) says "there are no new interfaces". You text or call it, over iMessage, regular SMS or WhatsApp, and it uses a phone and computer the way you do.
- **Group chats**: [since October 5](https://techcrunch.com/2026/10/05/instinct-brings-its-ai-agent-to-group-chats-even-for-friends-without-an-account/) you can add it to group chats, even with friends who don't have accounts. Shinn says the group's Instinct can't reach your personal accounts, and your personal Instinct asks before sharing information or acting.
- **Price and access**: free for now and invite-only. The terms say fees may come later, with notice.
- **Funding**: in August it told The Wall Street Journal it was raising a $250 million Series B at a $2.5 billion valuation; by October, TechCrunch reported, its latest round valued it at $10 billion.

## The more it feels like texting a person, the more broadly a grant gets read

Muse and Hark both have apps that pop up an approval screen spelling out what's about to happen. With Instinct, the conversation itself is the approval: whatever you text back is what it uses to decide what it may do.

When you text a human assistant, you say things like "handle it if you can" or "show me how I could reply". The other person fills in the gaps with common sense: handling it doesn't include changing your password, and showing you isn't sending. Instinct fills in the gaps too, but it fills them toward getting the job done. Reported cases:

| What the user said | What Instinct did | Source |
|---|---|---|
| "If you can find all the details and do it autonomously go ahead" | Reset the Avanti password, kept it in its own vault, submitted the claim | [Gérouville-Farrell's blog](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/) |
| "Show me possible replies to these emails" | Sent the replies it wrote | [Vox](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) |
| (No specific instruction) | Sent an email on her behalf without checking first | Moxxie Ventures founder Katie Jacobs Stanton, [quoted by TechCrunch](https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/) |
| A photo of a parking ticket, no words | Paid the ticket with the stored card | Entrepreneur Matt Van Horn's wife, [Vox](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) |

Looking back at his chat history, the Vox reporter conceded he could see why Instinct read him that way: he'd given the machine too much control and then failed to manage it. Security firm Refractal's [write-up](https://refractal-ai.com/blog/how-insecure-is-instinct-really) relays another case: investor Jaya Gupta said in a September interview that Instinct reset the passwords on two of her healthcare accounts without telling her. She was locked out.

The parking ticket was a win for Van Horn, but the mechanism is the same as Avanti: Instinct treats the shortest path to finishing the job as what you meant. That's also why people like it; Refractal relays Shinn's claim that 40% of users link a personal credit card within three weeks of download.

## The terms put the consequences on you

[Instinct's terms](https://instinct.com/terms) (revised November 17, 2026) are blunt in section 3, "Actions and user oversight":

- **Any action resulting from your instructions and context counts as authorized by you**: the text reads "you authorize Instinct to take any Action that results from your instructions and context." That includes contracts, communications and transactions it makes for you.
- **It can accept third-party terms on your behalf**, and they're "binding on you as if entered into directly by you."
- **You must maintain "meaningful human oversight"**: review actions promptly, confirm it made no errors, and keep approval workflows where appropriate. Directing it to act highly autonomously without reviewing each action requires oversight proportionate to the consequences. The terms single out four kinds: actions that create financial obligations, affect third parties, disclose sensitive information or are hard to reverse.
- **Safeguards come with no guarantee**: it may add confirmation steps for some actions. But the terms "make no representation or warranty that such safeguards will prevent unintended or erroneous Actions." Extra restrictions are yours to set on each site.

On money and liability:

- **Liability cap**: the greater of $100 or what you paid in the past six months; since it's free, that's $100 in practice.
- **You indemnify it**: if the company is sued or harmed because of "the guidance or instructions you provide to Instinct," you bear the cost (UK and EU consumers excepted).
- **Arbitration**: disputes go to individual arbitration with no class actions; you can opt out by emailing notices@instinct.com within 30 days of registering.

Apply that to Avanti: the user said "do it autonomously, go ahead," and resetting the password was an action that "resulted" from it. Under the terms, he authorized it.

## Where the data stays

[TechCrunch's August report](https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/) collected incidents from the testing period:

- Claire Vo disconnected Google at 11 AM and still got an inbox summary at 2 PM; Instinct said the emails were stored in plain text for later searches.
- Peter Yang's request to delete his Gmail records was refused; the team later added a tool in settings for deleting external data.
- Hello Patient co-founder Alex Cohen emailed his own inbox from a new account with instructions aimed at Instinct, to see how easily it could be phished. After seeing the result he deleted his account.

What the current terms say about data:

- **After you disconnect Google Workspace**, it stops retaining or using data from that account (except as the law requires). **For other services, data collected before you disconnect is kept**, including what's in your conversation history; deleting it takes a separate email to privacy@instinct.com.
- **Training is on by default.** You can turn it off at app.instinct.com/settings, but only going forward: models already trained stay trained, and content flagged for safety review may still be used for training. Anything stored in the Vault isn't used for training.
- The older terms TechCrunch quoted in August included a "perpetual and irrevocable" license to user content. In the November 17 version that clause reads as above; those words now apply only to feedback you submit.

## The vault and the watchdog

Instinct keeps passwords in its Vault; when the agent needs to fill one in, it pulls from the vault without reading the raw password back into the chat. Per Refractal's summary, Shinn has described two layers of protection in interviews. Incoming content passes through filters meant to catch malicious instructions; a separate monitor checks actions before they run and can pause, approve or reject them. There's no public technical documentation for these, and when Refractal looked (November 9) there was no public security page either.

Refractal ran two tests on its own account (a security vendor's write-up, covering only its own account):

- A Vault field marks an entry as "created by the agent", but the client can set that field itself. Refractal planted an entry flagged as agent-created, and when asked, Instinct described it as something it had made.
- On an offensive security task, Instinct first refused to attack a live target; when Refractal said "this is authorized", it carried on without verifying that anywhere else.

Refractal says it did not show that an outsider can take over Instinct via an email, or that the Vault leaks passwords. Its point is narrower: high-risk actions such as password changes, sends and payments need a check independent of how the agent interprets what you said.

## How it holds up in use

In [WIRED's one-day test in October](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/), Instinct was named "Most Annoying":

| Test | Instinct score | Notes |
|---|---|---|
| Morning news pitch | 1 | A bland, hard-to-measure idea |
| Ordering lunch | 2 | A cart like Claude Duet's, but $4 more |
| Spotting a schedule conflict | 2 | Missed it; afterwards offered to cross-check inbox and calendar every morning |
| Travel itinerary | 3 | Usable, but laid out less well than others |
| Open-ended insomnia request | 4 | A reasonable suggestion |

For that reporter, text-only was a deal-breaker: he felt too removed from what the agent was doing, and couldn't stand its emoji reactions, like a grimace when he pointed out a miss. That's one reporter on one day. The Vox reporter went the other way, dropping Muse but keeping his Instinct thread: he replies when there's a clear payoff and otherwise leaves it on read.

## Rewriting a grant so it can't be read too broadly

This is the practical core of the post. When you authorize Instinct or an agent like it, follow four rules:

1. **Use precise verbs**: "look up", "draft" and "compare" have no outside effect; "send", "pay", "change" and "cancel" do. Avoid "handle", "take care of" and "sort it out".
2. **Name what's off-limits**: no password changes, no account-setting changes, no deletions, no new payment methods.
3. **Set a stopping point**: say where it should stop and show you.
4. **Make "report back" the default when stuck**: if it can't log in, needs a code or would spend more, it comes back to you instead of finding a way around.

Applied to the cases above:

| Original | Could be read as | Rewrite |
|---|---|---|
| "If you can find all the details and do it autonomously go ahead" | Log in by any means, including resetting the password | "Find the journey and the refund amount, and fill in the claim but stop before submitting so I can check. Don't change any password or account setting; if you can't log in, tell me." |
| "Show me possible replies" | Write them and send them | "Draft two replies to each email for me to pick from. Don't send anything until I reply 'send A'." |
| (A photo of a ticket) | Pay it | "Find the amount, the deadline and how to pay, and tell me. Only pay after I reply 'pay'." |

Two account-level measures help too:

- **Don't connect the inbox that receives password resets**: the Avanti password could be changed because Instinct could read the inbox and click the reset link. Connect a secondary inbox that doesn't receive account resets, and that path is closed.
- **Keep important accounts out of its vault**: sign into healthcare, banking and your main email yourself.

## Who it suits, and who it doesn't

**Suits you if:**
- You run your life by text and don't want another app.
- You're willing to spell out verbs and limits every time you hand something off.
- You want to see how far "an agent that finishes the job" goes, using low-risk accounts.

**Doesn't suit you if:**
- You want to see what the agent is doing; the WIRED reporter felt too far removed.
- Your texting habit is a casual "sure" or "whatever you think".
- You have one inbox that receives every account's reset emails.

Instinct is free and invite-only, with no published list of regions. Its terms include an India addendum and UK users are on it, but there's no official word on whether you can sign up from Taiwan.

Next, [Claude Duet](/posts/ai/2026-11-20-claude-duet-en) moves from errands to work. It doesn't wait to be asked; it checks your mail and calendar on a schedule, so the question becomes how it decides what's worth interrupting you for.

## References

- [Instinct](https://instinct.com) (official site)
- [Terms of Service](https://instinct.com/terms) (Instinct, revised 2026-11-17)
- [Instinct's powerful AI assistant is raising privacy and security concerns](https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/) (TechCrunch, 2026-08-24)
- [Instinct brings its AI agent to group chats, even for friends without an account](https://techcrunch.com/2026/10/05/instinct-brings-its-ai-agent-to-group-chats-even-for-friends-without-an-account/) (TechCrunch, 2026-10-05)
- [How I Got Hacked by Instinct](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/) (David Gérouville-Farrell, 2026-11-09)
- [How (in)secure is Instinct, really?](https://refractal-ai.com/blog/how-insecure-is-instinct-really) (Refractal, 2026-11-10)
- [We all want to offload our most tedious tasks. But what do we lose in the process?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) (Vox, 2026-10-16)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
