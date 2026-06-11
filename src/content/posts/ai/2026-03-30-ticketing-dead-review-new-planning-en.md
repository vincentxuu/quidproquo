---
title: "Ticketing Is Dead — Review Is the New Planning"
date: 2026-03-30
type: guide
category: ai
tags: [code-review, software-engineering, ai-agent, adr, developer-workflow, ticketing]
lang: en
tldr: "When AI agents can turn intent into a PR in minutes, the bottleneck in software engineering flips from 'planning what to do' to 'evaluating whether the output is correct.' Artifacts of the ticketing era — sprints, story points, backlog grooming — are collapsing to zero, replaced by review as the core practice."
description: "A reading guide to Fayssal El Mofatiche's Ticketing Is Dead article. When AI coding agents compress implementation cost to near zero, the software engineering value chain flips from planning to review, and ADRs replace tickets as the core artifact."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-30-ticketing-dead-review-new-planning)

Fayssal El Mofatiche published [Ticketing Is Dead. Review Might Be the New Planning.](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be) in March 2026. The thesis is straightforward: for the past two decades, software engineering has been built on an implicit assumption — **the hard part comes before writing code**. AI coding agents are invalidating that assumption.

---

## Core Thesis: The Bottleneck Has Flipped

Old model:

```
Intent → Ticket → Assign → Decompose → Implement → Review → Ship
```

New model:

```
Intent → Agent implements → Review → Ship
```

The entire chunk that disappeared in the middle — planning, estimation, task decomposition, sprint ceremonies, assignment — existed only because **implementation was expensive**. When an AI agent can implement features across multiple files, write tests, and open a PR in minutes, this entire coordination layer compresses to near zero.

What's expanding is the other end: review, evaluation, architectural judgment, integration testing, outcome validation.

> We no longer spend most of our time figuring out "what to do" and "who does it." We spend time evaluating "whether the output is correct, coherent, and compatible with the system."

This isn't a tweak — it's a **value chain inversion**.

---

## What Died, What Survived

**Dead:**

- **Story points and estimation** — Implementation takes minutes; estimation becomes overhead
- **Sprint planning ceremonies** — Cadence was designed for human implementation speed
- **Ticket management as a profession** — The coordination layer between intent and code is disappearing
- **Backlog grooming** — You only need an infinite backlog when each item takes days; now you just try it

**Surviving and expanding:**

- **Architectural judgment** — Someone still needs to know what the system should look like
- **Code review and evaluation** — The quality gate moves from planning to review
- **Intent clarity** — Garbage in, garbage out — even more so when the agent executes instantly
- **Integration and systems thinking** — Individual features are cheap; coherent systems are not

**Transformed:**

- PMs shift from "planning work" to "evaluating output"
- Senior engineers shift from "designing solutions" to "judging solutions"
- Standups shift from "what are you working on" to "what did the agent produce, and is it correct"

---

## ADRs Replace Tickets as the Core Artifact

One of the most interesting arguments in the article: **Architectural Decision Records (ADRs) may be the core document of the review era.**

Jira tickets describe _what_ to build. ADRs describe _why we build it this way_.

Tickets become dead weight after implementation is done. ADRs persist and compound — useful during implementation, useful during review, useful for the next feature that touches the same boundary, useful for onboarding six months later.

More critically, agents can read ADRs. Reviewers can use ADRs to validate agent output: Did the agent respect the constraints we documented? Did it follow the patterns we chose? Did it violate trade-offs we explicitly considered?

> If tickets were the artifact of the planning era, ADRs may be the artifact of the review era.

---

## Context Must Follow the Agent into the Repo

AI coding agents live in the repo — they read files, write code, create branches, open PRs. But we still keep their task context (the what and why) in completely separate systems — SaaS boards, ticket databases, an API call away.

Humans need dashboards, drag-and-drop boards, notification emails. Agents don't. Agents need context **where they already are**: the repository.

`CLAUDE.md`, `TASKS.md`, ADRs in `/docs/decisions/` — these are all early signals of task context migrating into the repo.

> Tools followed humans into the browser. Now they need to follow agents into the repo.

---

## Implications for Engineering Careers

There's a counterintuitive flip here:

For the past few years, everyone has been asking "Will AI replace developers?" But what's actually happening is almost the opposite.

In the old model, developers were increasingly commoditized — ticket takers, spec implementers. The better PMs wrote requirements, the less developer judgment mattered. Agile made developers more replaceable, not less.

Now the commoditized part — implementation — is handed to agents. What remains is the part that was always undervalued: architectural judgment, system understanding, the ability to look at working code and say "this is wrong."

> AI isn't replacing developers. It's removing the parts that were never really engineering in the first place.

---

## The Shadow of the Bainbridge Paradox

The article closes with a critical risk, echoing a piece the author previously wrote on the [Bainbridge Paradox](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper): automation doesn't eliminate the need for expert skill, but it does eliminate the opportunity to develop it.

If engineers no longer plan, decompose, and estimate, they lose the practice that builds systems understanding. The muscle atrophies.

But there's a more optimistic reading: if the time saved is invested in review — deep, architecture-level, critical review — engineers may develop better judgment than the old planning rituals ever provided.

> Planning was always partly performance. Review, done well, is not.

The key question is: Will teams make this investment? Or will review devolve into the same "LGTM" rubber-stamp culture of the old era?

If review becomes a rubber stamp, the Bainbridge Paradox wins. If review becomes the primary venue for learning and quality, we head in a better direction.

---

## Overall Takeaway

The value of this article is that it articulates clearly what many people have vaguely sensed: **AI coding agents don't just make writing code faster — they invert the entire software engineering value chain.**

The most valuable skill used to be planning. Going forward, it will be judgment.

The core artifact used to be the ticket. Going forward, it may be the ADR.

The core process used to be sprint planning. Going forward, it will be code review.

The closing line is worth remembering:

> Teams that treat review as a core engineering practice will build things that work. Everyone else will ship fast and debug forever.

---

## Original Article

- [Ticketing Is Dead. Review Might Be the New Planning. — Fayssal El Mofatiche](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be)
- [AI, Jobs, and the 40-Year-Old Paper We Forgot to Read — Fayssal El Mofatiche](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper) (Extended reading on the Bainbridge Paradox mentioned in the article)

## References

- [Ticketing Is Dead. Review Might Be the New Planning.](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be) — Fayssal El Mofatiche's original article, the core thesis on the software engineering value chain inversion
- [AI, Jobs, and the 40-Year-Old Paper We Forgot to Read](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper) — Extended reading on the Bainbridge Paradox: the long-term risk of automation eliminating practice opportunities
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's agent design philosophy, positioning coding agents as software engineering tools
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Practical examples of AI agents completing complex tasks across sessions, with concrete cases of the review role
- [Architecture Decision Records (ADRs) — GitHub ADR Organization](https://adr.github.io/) — Official ADR documentation, the "core artifact of the review era" referenced in the article
- [Claude Code Overview](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — Claude Code official documentation, representative of AI coding agents as repo-native tools
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv paper, an academic survey of AI agent capabilities and limitations in software engineering
