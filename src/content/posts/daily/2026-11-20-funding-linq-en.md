---
title: "Funding Alert｜Linq Raises $90M New Round (a16z leads, Ben Horowitz joins board)"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, funding, daily, linq, agent-infrastructure]
lang: en
description: "AI agent communication infrastructure startup Linq raised $90M in new funding led by Andreessen Horowitz, with Ben Horowitz joining the board, after processing over 1 billion messages"
tldr: "Linq raised $90M in new funding led by Andreessen Horowitz, with outside reporting pegging the valuation near $1B (unconfirmed by the company). The signal: competition in agent infrastructure is moving down the stack into the communication channels agents actually use — messaging, voice, and computer use."
series:
  name: "AI Agent Funding"
  order: 145
---

> :globe: [中文版](/posts/daily/2026-11-20-funding-linq)

## Funding details

| Item | Value |
|---|---|
| Company | Linq (San Francisco, US) |
| Round | New funding round (reported by Dealroom and others as Series B; the company's own release does not name a round) |
| Amount | $90M |
| Lead | Andreessen Horowitz |
| Participants | TQ Ventures, Mucker Capital, Abstract, Anthos, Left Lane Capital |
| Valuation | Reported near $1B by Dealroom (:warning: unconfirmed by the company) |
| Total raised | Not officially disclosed; Series A was $20M (Feb 2026, led by TQ Ventures) plus this $90M round — media estimates put the total above $120M |
| Founded | Undisclosed (founded by former Shipt executives) |
| Headcount | Undisclosed |

## What the company does

Linq builds communication infrastructure for AI agents — it helps developers build agents that get things done using the tools humans already use, talking to people over iMessage, RCS, SMS and voice.

The company started as a digital business card and CRM automation platform before pivoting to agent infrastructure. Its product now spans three pieces: messaging (it has processed more than 1 billion messages and serves hundreds of companies including DoorDash), computer use (giving agents access to real computing infrastructure so they can operate software directly), and HD Calling for Agents (voice calling). Linq is also an Apple Messaging Service Provider, making it one of the few infrastructure providers that let enterprises run customer-facing agents on iMessage.

Current customers include DoorDash, Town, Tomo and hundreds of others — DoorDash uses Linq to let customers find food, build a cart and check out in a single message thread. The company hasn't disclosed revenue, but the billion-message figure suggests meaningful scale. Within agent infrastructure, Linq sits in a different lane from sandbox/compute providers like E2B or Modal: it owns the communication layer between agents and humans, not the execution environment.

## What this funding signals

### What it means for the agent ecosystem

The funding will go toward continued investment in messaging infrastructure and expanding the product line through Linq's own software, hardware infrastructure, and strategic partnerships. That points to agent infrastructure competition pushing further down the stack into communication channels with real distribution lock-in — the question isn't just which model an agent calls, but whether it can text, call, or operate a screen the way a person would.

### What investors are betting on

Andreessen Horowitz's Ben Horowitz is joining the board directly, framing the bet as "agents will communicate and get work done just like people do" — consistent with a16z's broader agent-infrastructure thesis (it's also an early investor in Boltz). The round size jumping from $20M to $90M in nine months suggests investors see messaging-layer agent infrastructure moving from proof-of-concept into scale-up mode.

```diagram
title: Linq's two funding rounds compared
desc: Linq's Series A was $20M in February 2026; by November 2026, its new round had grown to $90M — 4.5x in nine months.
caption: Round size grew 4.5x in nine months. Conversion: k≈3.5px/$M, bar widths scaled proportionally to amount. Figures from Linq's official release (PR Newswire, 2026-11-19) and FinSMEs.
---
<svg viewBox="0 0 640 200">
  <text class="dg-small" x="40" y="24" dominant-baseline="central">Round size ($M)</text>
  <line class="dg-grid" x1="40" y1="40" x2="40" y2="160"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="52" width="70" height="36"/>
    <text class="dg-sub" x="118" y="70" dominant-baseline="central">Series A $20M (2026-02)</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="40" y="108" width="315" height="36"/>
    <text class="dg-label dg-text--accent" x="363" y="126" dominant-baseline="central">New round $90M (2026-11)</text>
  </g>

  <line class="dg-axis" x1="40" y1="40" x2="40" y2="160"/>
</svg>
```

### Numbers worth watching

- Linq has processed more than 1 billion messages — one of the largest usage figures reported in the agent-communication-infrastructure space so far.
- Round size grew 4.5x in nine months ($20M → $90M), suggesting capital is concentrating post-validation rather than chasing early-stage exploration.
- Dealroom's reported $1B valuation is unconfirmed by Linq. If accurate, it would mean the company went from Series A to near-unicorn in under a year — but it remains an outside estimate, not a confirmed figure.

## Watchlist status

Linq is not yet on the watchlist. Recommend adding it under section C4 (computer use / human-agent interaction infrastructure) or a new "agent communication infrastructure" subcategory, tracking: messaging, computer use, and voice calling combined into one agent infrastructure platform, led by a16z, with more than 1 billion messages processed.

## Today's takeaway

The surprising part of this round isn't the dollar amount — it's Linq's path from "digital business card tool" to agent communication infrastructure provider. It's a reminder that in the agent-infrastructure race, owning the communication channels people already trust (iMessage, phone calls) may matter as much as having the smartest model.

## References

- [Linq Raises $90 Million in New Funding Led by Andreessen Horowitz to Build the Infrastructure Platform for AI Agents - PR Newswire](https://www.prnewswire.com/news-releases/linq-raises-90-million-in-new-funding-led-by-andreessen-horowitz-to-build-the-infrastructure-platform-for-ai-agents-302944728.html)
- [Linq Raises $90M in Funding - FinSMEs](https://www.finsmes.com/2026/11/linq-raises-90m-in-funding.html)
