---
title: "Devin Bots Hand an Agent a Responsibility: What It Does, and What Humans Still Have to Do"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, devin, cognition, coding-agent]
lang: en
tldr: "Devin Bots are Cognition's always-on agents for engineering teams: you hand one an outcome to keep owning, such as 'keep Android at parity with iOS', rather than just a ticket. It splits the work, runs several Devins in parallel, reviews results to decide what's next, and sends only decisions that need a human to its Needs You list, which puts it at L3 on the always-on ladder. The human job becomes three things: define success, build the feedback signals, and set permissions and budget. All three of the official case studies are Cognition reporting on itself, with no independent verification yet."
description: "Cognition's Devin Bots: the difference between a task and a responsibility, the three internal case studies and their limits, whose access a bot acts with, how budgets work, and how to rewrite an unowned long-running job into something a responsibility-owning agent can take."
series:
  name: "Always-On AI Agents"
  order: 9
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-devin-bots)

| Four tests | Devin Bots |
|---|---|
| Keeps running while you're away | ✓ Each piece of work runs on its own cloud machine while the bot keeps track |
| Decides what to do when it wakes | ✓ L3: finds the next thing to do from the outcome it owns; can also run on a schedule or event |
| Remembers your goals across conversations | ✓ Has its own memory and keeps context across sessions |
| Acts for you | ✓ Opens and merges PRs, reports in Slack; how far it goes depends on permissions and review rules |

Cognition's web app had a stubborn problem: when content arrived late, elements on the page jumped. These shifts are hard to catch in code review because they depend on request timing, connection speed and whether you've visited the page before; fix one, and the next new component can introduce another.

[Cognition created a "Layout Bot"](https://devin.ai/blog/introducing-devin-bots) and gave it this:

> your job is to keep the webapp's UI from shifting or lagging. Watch #alerts-bots, where a layout check posts every 3 hours. Take over that check and keep it working as the UI changes. When something regresses, find the cause and open a fix with a before and after video.

One evening it traced a new layout shift to a PR merged two hours earlier. By the time someone asked about it, it was already working on a fix. When an engineer asked who had requested another fix, it answered:

> Nobody asked. My scheduled layout check flagged main's tall grey block on first visit because it doesn't match what replaces it.

This post is about Devin Bots: when you hand an agent a long-running responsibility, what it does, and what humans still have to do.

## What Devin Bots are

Cognition [launched Devin Bots on November 17, 2026](https://devin.ai/blog/introducing-devin-bots). Devin is the coding agent it introduced in 2024; a Devin Bot sits a level above: a persistent agent with its own memory and tools that can lead several Devins at once.

The [docs](https://docs.devin.ai/work-with-devin/bots) list six parts:

| Part | What it does |
|---|---|
| Chat | One chat per bot; you tell it what it owns there, and its reports come back there |
| Sessions | Each piece of work runs in its own child session with its own machine; the bot starts and monitors them |
| Automations | Runs on a schedule or when something happens in your tools, without a message from you |
| Needs you | Approvals, decisions and PRs to review collected in one list |
| Memory | Preferences, corrections and project details it learns, used in later sessions |
| Access | Its own connections and secrets, separate from whoever messages it |

- **Where you use it**: the Devin web app, Slack (the bot gets its own Slack app and joins as a team member), and iMessage (not on Enterprise plans).
- **Models**: not tied to one lab. [Per Fortune](https://fortune.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/), a bot picks models for planning, design, computer use and other parts of the work, using faster, cheaper ones for routine code, including models Cognition trains itself.
- **Technology**: builds on the Interaction Company, maker of the personal assistant Poke, which Cognition acquired in July.
- **Price**: [The Inference reports](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days) seats of $80 to $200 a month, with extra usage billed at API rates.

The previous post's [Grok Bot](/posts/ai/2026-11-20-grok-bot-en) is one person running several bots for themselves. This post opens route 2: bots handed to a team to own an area of work.

## Tasks versus responsibilities

Cognition's core argument is that a coding agent can finish every task you give it while you stay responsible for moving the project forward. Someone still has to notice the next problem, investigate solutions and check whether changes helped. A Devin Bot is meant to take over that layer.

The announcement uses a table to show the two ways of assigning work:

| A task to complete | A responsibility to own |
|---|---|
| Port this feature to Android. | Keep Android at parity with iOS. |
| Fix the layout shift | Keep the web app smooth as it changes. |
| Fix this onboarding error. | Get new users through setup successfully. |

A task describes the change you want; a responsibility describes the outcome and leaves the how to the bot. The other benefit, Cognition says, is that an agent owning the goal watches everything that affects it, including parts no one is looking at, so it finds work you'd never have assigned. Layout Bot's "Nobody asked" is exactly that.

## The three official case studies

**Android Bot**: Cognition had an iOS app and iOS engineers, but no Android engineers and no Android plan. On September 28, engineer Samyok created an Android Bot and told it "your job is to product manage the android app." It began by surfacing blockers: where the code would live, how to test an Android build, how changes would merge. Once Samyok set direction and constraints, it filed tickets, started a Devin session for each, merged PRs that passed CI and Devin Review, and posted a daily Slack report with a screen recording.

| 44 days in numbers | |
|---|---|
| PRs merged | 1,134 |
| Lines of Kotlin | 344,651 |
| Screenshot tests | 2,841 |
| Tickets closed | 1,217 |
| Messages from Samyok | 183, about one per six PRs |
| Days with no message from him | 22 |

Most of his messages dealt with something that needed a human decision, such as a PR needing security review; others encouraged it or set direction, like "be more ambitious." The app is now in open testing on Google Play, and Android Bot updates it whenever a new feature lands on iOS.

**Layout Bot**: every three hours it builds the production version of the latest code on main and runs the full stack on its own machine. It simulates first visits, repeat visits and loads with individual requests deliberately delayed. When a previously passing check fails, it reruns it to rule out timing noise, traces the regression to the PR that caused it, and starts a Devin session to fix it, with before-and-after recordings for an engineer to review. In three weeks, Cognition merged 159 of its PRs and cut lag by 70%.

**Game studio**: Cognition colleague Jenny Xu runs a mobile game studio where she's now the only human employee. About 20 bots each own one job: development, Unity, releases, UI, iOS, Android, real-device testing and more. Above them sits "Super Jenny Bot," the only one she talks to: four times a day it gathers the decisions the other bots need from her into one Slack thread, and she answers with emoji. Weekly PRs went from about 50 to 1,900.

### How to read these numbers

[The Inference](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days) put it plainly: "Every number in the launch post is Cognition reporting on itself."

- All three cases are inside Cognition, or run by someone who then joined Cognition.
- Outside evidence is thinner: usage at early customers Decagon, Fireworks AI and Reducto grew tenfold in two weeks, and Citigroup says 14,000 of its engineers use Devin. Those are usage counts, not audited outcomes.
- PR counts aren't value. The Inference argues the number that would settle it is a public customer showing lower cost per accepted change than humans, with review time included. There's no such number yet.
- The older Devin was tested independently: in January 2025 Answer.AI found it failed 14 of 20 tasks and "couldn't discern any pattern" to predict which. That was a product from over a year earlier and doesn't transfer directly to Bots, but it shows tools like this need independent checks.

Three days after launch, there are no public accounts of using Devin Bots from outside Cognition.

## What humans still have to do

Cognition says engineers working with Devin Bots will spend less time specifying work and more time deciding what's worth owning, setting the bar and building systems to track the metrics they care about. Concretely, three things:

**1. Define success**: a bot responsible for making CI faster needs to know which checks must stay and whether spending more on compute is acceptable. Those decisions determine which improvements are worth pursuing.

**2. Build the feedback signals**: a bot needs a way to evaluate its work, and building that is the engineers' job. During development it's tests, benchmarks and running through user flows; in production it's real behavior, usage and customer feedback. As Cognition puts it, choosing what to measure, under which conditions, and what the results actually establish remains important engineering work.

**3. Set permissions and budget**: which systems it can reach, what it can change, and when spending or releases need approval. Fortune quotes CEO Scott Wu saying teams can set low-risk edits, such as changing a button's color, to be approved and merged automatically. The safeguards rely on rules companies set and monitor, "rather than relying on models themselves being smart enough to recognize a risky or malicious prompt."

He also says: "it's always up to the human where we're driving to."

## Whose access a bot acts with

This is the point to understand before handing a bot to a team. The [docs say](https://docs.devin.ai/work-with-devin/bots/access-and-security): "A Devin Bot works with its own access, not the access of whoever messages it."

- **Access belongs to the bot, not the asker**: sign-ins, secrets and sessions a bot holds apply to every session it starts, whoever sent the message. Share a bot, and everyone you add can use everything it holds by asking it.
- **Access never exceeds the giver**: a session you give a bot is at your level or below; if you leave or lose a connection, the bot loses it too.
- **Private and shared bots differ**: a bot only its creator uses takes the creator's resources without asking (each is still recorded as a grant). Once shared, using someone's resources needs that person to approve a card.
- **Access passes between bots**: if A can read B, everyone who can use A can see B's work through A. Connecting two bots can expose B's work to people it was never shared with.
- **Check before sharing**: anyone you add can read everything the bot has said and remembered so far. If the conversation holds something private, the docs suggest creating a new bot from the same template instead.

Access comes in three levels: Can use (message it, direct its sessions, read its conversation and memory), Can configure (change instructions, connections, secrets) and Can share (decide who can use it). None includes another, so whoever manages access doesn't necessarily read the conversation.

Fortune adds that bots run on separate cloud computers, away from passwords and keys on engineers' laptops, and that network controls aim to stop data leaving if a model follows malicious instructions hidden in content it reads.

## Budget

[Usage](https://docs.devin.ai/work-with-devin/bots/usage-limits) is paid by the bot's creator and counts its chat plus every session it starts:

| Plan | How it bills | Limits |
|---|---|---|
| Max | Like your own sessions: included quota first, then on-demand credits | No bot-specific limit |
| Teams | The creator's included quota first, then the team's on-demand credits | Creator or admins can set a dollar cap; admins can give the bot a separate limit |
| Enterprise | Counts toward the creator's own usage limit | ACU or dollar limits; only enforced once budgets are enabled for the enterprise |

Fortune reports that each bot can be given its own budget, measured against the results it delivers. On Max there's no bot-specific cap, so more background work means more spend.

## Rewriting an unowned job into something you can hand over

Every engineering team has worthwhile work that loses momentum between urgent projects. Some projects never start, Cognition notes, because taking them on means maintaining them, responding when they break and adapting them as requirements change.

To hand that kind of work to a responsibility-owning agent, write it in this shape:

| Field | What to write | Example: dependency updates |
|---|---|---|
| Outcome owned | One sentence starting with "keep" or "make sure", not a specific change | Keep every service's dependencies on supported versions with no known high-severity vulnerabilities |
| What counts as success | Measurable bar, plus what must not be sacrificed | High-severity vulnerabilities fixed within 7 days; all existing tests pass; no public API changes |
| Feedback signals | How it judges whether it got it right | CI results, vulnerability scan reports, error rates in the 24 hours after deploy |
| May do on its own | Low-risk, reversible actions | Open PRs, apply patch-version updates, run tests |
| Must ask first | Actions that affect others or are hard to undo | Major-version upgrades, config changes, anything touching production |
| Budget | Monthly cap and what happens at it | $200 a month; at the cap, stop and report in Needs You |
| Reporting | How often, where, what | A summary in #eng-deps every Monday; immediate alert on a high-severity vulnerability |

Then check two things:

- **Do the feedback signals already exist?** If there's no vulnerability scanning or error-rate monitoring yet, build those first. Without feedback signals, the bot can only tell you it did well.
- **Are the human decisions listed under "must ask first"?** Most of Android Bot's 183 messages handled things that needed a person, like security reviews. Those don't disappear; they just collect in Needs You.

## Who it suits, and who it doesn't

**Suits you if:**
- You're an engineering team with solid tests and CI already: the feedback signals exist, so the bot can tell whether it got things right.
- You have work you've always wanted done but no one can own long-term: cross-platform parity, performance regressions, dependencies, onboarding quality.
- You're willing to write success criteria and permission rules.

**Doesn't suit you if:**
- The project has no automated tests: the bot can't verify its own work.
- You need independent evidence before adopting: today's numbers are all Cognition's own.
- Your organization doesn't want one agent passing a shared identity's access among many people.

Devin Bots are available at devin.ai/bots, billed in US dollars; teams in Taiwan should confirm availability when signing up.

Next, [Perplexity teammates](/posts/ai/2026-11-20-perplexity-teammates-en) also take on work that spans weeks, but for knowledge workers instead of engineering teams: the feedback signal shifts from tests to human review.

## References

- [Introducing Devin Bots: from tasks to outcomes](https://devin.ai/blog/introducing-devin-bots) (Cognition, 2026-11-17)
- [Devin Bots](https://docs.devin.ai/work-with-devin/bots) (Devin Docs)
- [Devin Bot access and security](https://docs.devin.ai/work-with-devin/bots/access-and-security) (Devin Docs)
- [Devin Bot usage limits](https://docs.devin.ai/work-with-devin/bots/usage-limits) (Devin Docs)
- [Exclusive: Cognition bets on 'Devin Bots' coding agents in challenge to Anthropic's Duet and OpenAI's Dots](https://fortune.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/) (Fortune, 2026-11-17)
- [Cognition launches Devin Bots, AI managers that built an Android app in 44 days](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days) (The Inference, 2026-11-18)
