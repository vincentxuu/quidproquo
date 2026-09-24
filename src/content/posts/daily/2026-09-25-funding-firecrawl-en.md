---
title: "Funding Brief｜Firecrawl Raises $75M Series B to Pay Humans for Knowledge and Feed It to AI Agents"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, funding, daily, firecrawl, search-api]
lang: en
description: "Web data infrastructure startup Firecrawl closed a $75M Series B led by Smash Capital and launched Alexandria, a paid knowledge platform — a bet that the AI agent bottleneck is shifting from 'can't crawl the page' to 'can't find the right source'"
tldr: "Firecrawl raised a $75M Series B led by Smash Capital, exactly one year after its $20.7M Series A, bringing total funding to more than $95M. The real signal isn't the amount — it's the same-day launch of Alexandria, a platform that pays researchers, developers, and public institutions for their knowledge and resells access to AI agents, marking Firecrawl's shift from 'web-scraping tool' to 'knowledge supply chain for AI agents.'"
series:
  name: "AI Agent Funding"
  order: 48
---

> 🌏 [中文版](/posts/daily/2026-09-25-funding-firecrawl)

## Funding Details

| Field | Value |
|---|---|
| Company | Firecrawl (San Francisco, USA) |
| Round | Series B |
| Amount | $75M |
| Lead investor | Smash Capital |
| Follow-on | Altos Ventures, Nexus Venture Partners, Y Combinator, Freestyle, Offline Ventures |
| Valuation | Not disclosed |
| Total raised | About $95.7M ($20.7M Series A + this $75M round) |
| Founded | 2024 |
| Headcount | Not disclosed |

## What the company does

Firecrawl builds web data infrastructure — give it a URL and it handles everything from crawling and rendering to parsing and cleanup, turning any webpage into data an AI system can read directly. Co-founders Caleb Peffer, Eric Ciarla, and Nicolas Silberstein Camara previously built Mendable, an AI Q&A product for technical documentation, and discovered along the way that reliably extracting clean data from the web was the hardest part of the whole AI application stack — so they spun that piece out as Firecrawl.

The company used this funding round to simultaneously launch Alexandria, which brings official data providers, custom connectors, Firecrawl's own indexes, and the live web together into a single interface, so an AI agent can find a source, understand what it holds, and retrieve from it the same way every time. Three indexes are already live: a Research Index covering tens of millions of scientific paper abstracts, a Developer Index spanning documentation, READMEs, issues, and merged pull requests across 70 million codebases, and a Government Index covering laws, regulations, and court and SEC filings. Firecrawl already pays data providers like Wikimedia Enterprise directly for access, and part of this round will go toward extending that "pay for data, resell access to AI agents" model to more creators and institutions, along with opening a self-service system.

Firecrawl now serves more than 1.5 million developers and 150,000 companies, including Shopify, Apple, Lovable, and Canva. Growth has been especially steep in Brazil — the company grew 141% there in the first quarter of 2026, and its paying customer base there more than doubled in five months versus all of 2025, a roughly 290% annualized growth rate.

## What this round signals

### What it means for the agent ecosystem

Alexandria is aimed at a specific failure mode: AI agents that rely only on search and scraping will always miss information locked inside a specific data provider's or index's walls, and no matter how capable a model is, it can't reason correctly over information it never found. Firecrawl is spinning this layer out as shared infrastructure — turning "where should an AI agent look for data" from something every team figures out on its own into a service they can just call. This round's capital goes toward expanding index coverage and scaling the roster of paid data providers.

### What investors are betting on

This Series B landed just a year after the Series A and at nearly 4x its size — Dealroom describes it as sitting in the top 5% of all-time Series B rounds for US enterprise software startups. The logic is straightforward: as model capability keeps improving, the real bottleneck shifts to whether an AI agent can find and understand the right data source, and Firecrawl already has 1.5 million developers as a distribution channel — selling a new data layer through an existing pipeline carries much less risk than building a knowledge platform from zero.

### Numbers worth watching

- In internal testing across 845 tasks with blind AI judging, agents using Alexandria scored 21% higher on answer quality than agents using built-in web tools — one of the few public numbers that quantify the value of the data layer rather than the model layer
- Brazil grew 141% in a single quarter, with the paying customer base there exceeding all of 2025 in just five months — a clear sign that growth momentum is coming from outside the US, unlike most peer startups that lead with North American enterprise customers
- Just one year separates this round from the $20.7M Series A, and at $75M this round is nearly 3.6x the prior one — funding cadence and round size are accelerating together, not just hitting a new high in isolation

## Watchlist status

Firecrawl is already tracked in watchlist section C1 (Search API / Answer Engine), with tracking focus previously listed as "web scraping, structured search API." Recommend updating that focus to: whether the Alexandria paid knowledge platform (Research/Developer/Government indexes) can carry Firecrawl from a web-scraping tool into knowledge supply-chain infrastructure for AI agents.

## Today's takeaway

I used to file Firecrawl under "web-scraping tool," but Alexandria reframes what this round means: the company isn't trying to make scraping faster or more accurate — it's trying to turn "helping an information owner monetize their knowledge and reselling it to AI agents" into a business of its own. As more agents need reliable data sources, the data supply chain itself is moving from a free byproduct of crawling into an infrastructure layer with its own business model, worth raising capital for on its own terms.

## References

- [Introducing Alexandria and our $75M Series B](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)
- [Firecrawl raises $75M Series B to build a knowledge library for AI agents](https://dealroom.co/news/155341-firecrawl-raises-75m-series-b-to-build-a-knowledge-library-for-ai-agents/)
- [Firecrawl Raises $75M Series B, Launches Alexandria AI Agent Data Platform](https://phemex.com/news/article/firecrawl-raises-75m-series-b-launches-alexandria-data-platform-for-ai-agents-97562)
