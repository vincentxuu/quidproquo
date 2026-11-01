---
title: "Product Builder Interview Drill — 2026-10-28: Strategy & Execution"
date: 2026-10-28
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Using a six-step strategy framework, practice a real Google interview question — you're Zoom's CPO facing Google Meet's full-court press — with a case built on Google's own real choice when it got cornered by ChatGPT: not a standalone chatbot, but AI folded straight into Search."
tldr: "Strategy questions don't test whether you can recite SWOT or Porter's Five Forces. They test whether, within six steps, you can land on a specific, defensible call and say out loud why the strongest counter-argument doesn't change your mind — starting with pinning down the time horizon the question is actually asking about, then going back to what the company really makes money from (not its mission statement), locating exactly where this threat or opportunity is coming from, setting guiding principles sharp enough to actually eliminate options, narrowing a pile of ideas down to two or three, and finally picking one, naming its strongest counter-argument, and explaining why you'd still hold your ground. The practice question is a real one from Google's interview loop: 'Imagine you're Zoom's CPO, facing heavy competition from Google Meet — what would you do?' The walkthrough demonstrates running five lenses — market positioning, brand loyalty, distribution, organizational capability, and product/tech — across Zoom and Google Meet, instead of jumping straight to a list of feature ideas. The case is Google's own real move when ChatGPT started eating into Search: instead of building a separate chatbot to fight ChatGPT head-on, Google folded AI Mode directly into the search box it already owned, because users were already opening Google Search every day — a distribution advantage ChatGPT couldn't build from zero."
series:
  name: "Product Builder Interview Daily"
  order: 70
---

> 🌏 [中文版](/posts/daily/2026-10-28-product-builder-interview-daily)

## Today's Focus

Strategy questions show up less often in PM interviews than root-cause-analysis, growth, or product-design questions, but when they do, they're the most lethal of the bunch — not because the frameworks are hard to memorize, but because they test whether you can land on a specific, opinionated call within fifteen minutes and actually name the strongest argument against your own pick. The AI era has made this harder in a specific way: it's now trivial to produce a balanced, "on one hand, on the other hand, it depends on the team's priorities" answer, and that's exactly the pattern interviewers have recalibrated to reject. Today's drill uses a six-step framework to work through a real question asked at Google.

## Framework Cheat Sheet

### Framework 1: The six-step strategy framework

The six steps are scaffolding, not the answer. Two candidates can run the identical six steps and produce completely different responses — one brings an opinion, the other brings a template.

| Step | What to do | The common failure mode |
|---|---|---|
| ① Clarify the question | Pin down the time horizon (a 6-month tactical move vs. a 3-year strategy), who measures success, and what constraints exist (budget, regulation, existing product bets) | Firing off a dozen clarifying questions without ever stating where you're headed — the interviewer loses the thread |
| ② Anchor to business goals | Work out what the company actually makes money from and where it's really putting its money — revealed preference is more honest than a mission statement | Treating the mission statement as a business analysis — "Facebook connects the world" is a slogan, not an analysis |
| ③ Map the landscape | Define exactly what this threat or opportunity is and where it comes from; read competitors' moves as strategic posture; ask why this is a question now | Settling for "AI is disrupting everything" — a sentence that says nothing |
| ④ Set guiding principles | Turn the insights from steps ②–③ into constraints that actually eliminate options; each principle should kill at least one direction | Writing a principle like "prioritize user trust" — it doesn't rule anything out, so it does no work |
| ⑤ Generate and filter options | Spend 60–90 seconds brainstorming without judging, write down more options than you'll use, then run each against the principles from step ④ | Walking out with seven surviving options on the table — that means the filtering step never actually happened |
| ⑥ Argue and close | Pick one, state it in two sentences, name the strongest counter-argument, explain why you'd still land there, and flag the signal that would change your mind | Stopping at "it depends" — an answer with no point of view doesn't survive the first follow-up |

### Framework 2: The five-lens analysis

When the question is "Company A vs. Company B, what's your strategy," run both companies through these five lenses before reaching for a solution. Strengths and weaknesses answer a different question than opportunities and threats: **strengths/weaknesses tell you how to attack, opportunities/threats tell you where to attack.**

| Lens | What it's really asking | Example |
|---|---|---|
| Market positioning | How the company wants the market to see it, relative to competitors | Zoom positions as "easy for everyone"; Webex positions as "secure, built for large institutions" |
| Brand loyalty | Do people recognize the brand, and will they follow it into a new product | Apple's users follow it into almost any new category |
| Distribution | Can the company reach users directly, without going through a gatekeeper | Apple decides the default browser on a billion iPhones; Microsoft already sits inside nearly every office |
| Organizational capability | How much money, headcount, and partnership leverage can back a move | Zomato can afford big exclusive deals with top restaurants; a startup can't |
| Product and tech | Is the underlying technology still a real differentiator | For about 18 months, ChatGPT's model itself was the biggest edge; that edge is much smaller today |

The same strength can flip into a weakness in a different market: Zomato's distribution is a huge edge in India and close to zero in Singapore.

## Today's Practice Question

### The question

"Imagine you're the CPO of Zoom, facing heavy competition from Google Meet. What would you do?"
(Source: a real Google PM interview question, documented in aced.io's collection of verified candidate interview experiences)

### How to break it down

1. **Clarify the question**: Ask whether this is a 3-year play to defend enterprise accounts or a 6-month tactical response to Google Meet eating share this quarter — the two horizons point to completely different answers, so leaving this unasked is a gamble.
2. **Anchor to business goals**: What does Zoom actually get paid for? Not "meetings are easy," but enterprise subscriptions and per-seat licensing — which means the real question is "would this feature make enterprise IT procurement switch away from Zoom," not "which feature feels more exciting."
3. **Run the five lenses across Zoom vs. Google Meet**: positioning (Zoom = broadly easy to use across any team size; Google Meet rides on Workspace — companies already live in Gmail and Calendar, so Meet is the convenient default); distribution (Google's edge is "users are already in a Google account," a card Zoom doesn't hold); brand loyalty (Zoom became a verb during the pandemic — that habit is sticky); organizational capability (Google can afford to subsidize for free, Zoom can't); product/tech (both sides' AI meeting-summary features have largely converged, shrinking that differentiation).
4. **Set guiding principles, then generate and filter**: principles like "don't fight a free-tier price war, because we can't outspend Google," "don't chase deeper Workspace integration, because that's Google's home turf," and "prioritize options that compound into a moat over time, not one-off feature wins" — running "launch a free tier to match Meet" against the first principle kills it immediately.
5. **Argue and close**: pick a direction (for example, deepening roots in non-Google-ecosystem enterprise verticals with workflow-specific needs), name the strongest counter-argument ("this shrinks the addressable market"), explain why you'd still choose it, and flag a signal that would change your mind (for example, "if retention in those verticals isn't meaningfully higher than general enterprise accounts, this direction never actually built a moat").

### Sample answer (how this could actually sound in the room)

> I'd frame this as a 12-month strategic call with enterprise retention — not install count — as the success metric, because Zoom's revenue runs on subscriptions, and holding existing accounts matters more than chasing new ones. **Starting from the business reality**: Zoom doesn't get paid for being pleasant to use, it gets paid when enterprise IT renews. Google Meet's biggest weapon isn't a better product — it's that it rides inside Workspace, where companies are already living in Gmail and Calendar, so Meet arrives almost as a free add-on. That tells me Google is fighting a distribution war, not a feature war, and if I just try to out-build their AI summaries, I've picked the wrong battlefield.
>
> **Running the five lenses**, the cards Zoom actually holds are brand loyalty — "let's Zoom" became a verb during the pandemic — and a cross-industry, neutral positioning that spans large enterprises, individual coaches, and small teams, something Google Meet can't match while it's tethered to Workspace. My guiding principles: don't race Google on free-tier pricing, because we can't outspend them; don't chase deeper Workspace integration, because that's their home court.
>
> **The direction I'd pick** is deepening roots in enterprise verticals outside the Google ecosystem — healthcare, education, legal — industries with real data-isolation and workflow requirements that already sit outside Workspace, and building the AI meeting features around those specific workflows rather than a generic summarizer. **The strongest counter-argument** is that this shrinks Zoom's addressable market and makes the company smaller on purpose. I'd still choose it, because Zoom's balance sheet can't survive a generalist free-tier war against Google, while vertical depth compounds switching costs year over year into a real moat, rather than a one-off feature highlight. **If I saw that retention in these verticals wasn't meaningfully higher than general enterprise accounts**, that would tell me this direction never actually built a moat, and I'd revisit it.

### Self-check

| Check item | Covered? |
|---|---|
| Set a time horizon and success metric before answering, rather than diving straight in | |
| Anchored to the company's real business model, not its mission statement or tagline | |
| Used a concrete lens (five-lens or equivalent) to scan both sides before jumping to feature ideas | |
| The guiding principles actually eliminated at least one option | |
| Narrowed to 2–3 options, not a long list | |
| Ended with a clear pick + the strongest counter-argument + the reason it still holds | |
| Bonus: named the signal that would change your mind | |

## Today's Case

**Google: cornered by ChatGPT, it didn't build a separate chatbot — it folded AI straight into the search box**

When ChatGPT launched, it threatened Google's core search business directly — users started asking ChatGPT questions instead of searching Google. But Google's primary response wasn't a standalone conversational AI app built to go head-to-head with ChatGPT. It was "AI Mode," folded directly into the existing search box. The logic is simple: users were already opening Google Search every single day — a distribution advantage ChatGPT had to build from zero. Rather than ask users to adopt a new app and a new habit, Google let the new AI capability ride on top of an existing behavior it already owned. It's a clean demonstration of how to use the "distribution" lens from the five-lens framework: strengths and weaknesses decide how you attack, and Google played the strongest card it actually held.

**Interview angle**: this case is a ready-made reference for "Company X faces threat Y, how would you respond" strategy prompts — it demonstrates not abandoning your own core advantage (here, distribution and existing user habits) just to chase a new competitor head-on, and instead letting the new capability grow on top of the advantage you already have.

## Further Reading

- [Product Strategy Interview Questions (2026 Guide) - Aced](https://www.aced.io/blog/product-strategy-interview-questions) — The full version of the six-step framework, with real question types from Google, Meta, and OpenAI interviews and the most common ways candidates lose points
- [The basics of Product Strategy Problems - DailyDoseOfPM](https://sreeragpanat.substack.com/p/the-basics-of-product-strategy-problems) — Original source of the five-lens analysis, with worked examples including Zomato's Singapore go-to-market and Webex vs. Zoom
- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions - PRACHub](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — Covers the other half of Strategy & Execution: when a decision has to land cross-functionally, what "I aligned stakeholders" actually needs to show about decision ownership

## References

- [Product Strategy Interview Questions (2026 Guide) - Aced](https://www.aced.io/blog/product-strategy-interview-questions) — Source of today's practice question (Zoom vs. Google Meet) and the six-step strategy framework
- [The basics of Product Strategy Problems - DailyDoseOfPM](https://sreeragpanat.substack.com/p/the-basics-of-product-strategy-problems) — Source of the five-lens analysis, the Google AI Mode case, and the Webex vs. Zoom breakdown
- [Product Leader Interview Questions - PRACHub](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — Source for the stakeholder/decision-ownership angle in Further Reading
