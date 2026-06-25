---
title: "Why Does a Climbing Community Need AI? NobodyClimb's Experiment and What We Learned"
date: 2026-03-12
type: project
tldr: "NobodyClimb uses RAG to tackle scattered climbing route information, ties quota limits to community engagement, and leverages Cloudflare Workers AI to bring inference costs close to zero."
category: product
tags: [ai, climbing, rag, community, product]
lang: en
description: "The thinking behind NobodyClimb's AI Q&A feature: what problem it solves, how we decided to build it, how users actually use it, and whether AI is worth it for a small community platform."
draft: false
---

🌏 [中文版](/posts/product/2026-03-12-nobodyclimb-ai-why-and-what)

NobodyClimb is a Taiwanese climbing community platform. A few months ago, we added an AI Q&A feature. This post isn't about the technical implementation — it's about why this feature exists, how we decided to build it, and what happened after.

## Where the Problem Came From

Information about climbing routes is scattered. If you want to find "beginner-friendly routes at Longdong," you'd typically have to:

1. Search through old posts on the PTT climbing board
2. Ask experienced climbers
3. Just go and climb there yourself

Other sports have similar problems, but climbing is particularly tricky because route information is highly localized (place names, crag characteristics, seasonal differences), and Traditional Chinese resources are sparse — Google searches often return information about English-language crags overseas.

NobodyClimb already had route data, climber stories, and send records. This data would actually be very useful for answering these kinds of questions — it just lacked a good query interface.

## Why We Chose AI Q&A

Building a search feature was an option, but keyword search performs poorly on these kinds of questions. The phrase "beginner-friendly" rarely appears in route descriptions, but "5.9, easy to protect, friendly rock" does. This semantic gap is exactly what keyword search can't bridge.

RAG (Retrieval Augmented Generation) translates a question into a semantic vector, finds relevant data, and lets a language model compose an answer — that's precisely what it was designed for.

Cost was another consideration. Cloudflare Workers AI brings the infrastructure maintenance cost of AI inference close to zero — no need to spin up GPU machines. For a small platform, that difference is significant.

## A Few Design Decisions

**Quota System and Tier Structure**

Without quotas, a small number of users could consume unlimited inference, and costs would spiral out of control fast. But hard limits are frustrating for users.

The solution we landed on was tying quotas to a user's level of community participation: the more profile information you fill in, the more stories you share, the more sends you log — the higher your daily usage limit (four tiers: Foothold → Wall → Ridge → Summit). This design does two things: it encourages community participation, and it means the heaviest AI users tend to be the people contributing the most to the platform.

**Personalization**

Queries from logged-in users include two types of personal context: user memory (e.g., "climbing level around 5.11, prefers routes in the Taichung area") and send history.

The result is that the AI can say things like "You've already sent XX (5.10a) — you might be ready to try YY (5.11b)" instead of just listing generic routes. For users who are genuinely active on the platform, this makes a meaningful difference.

**Only Answer Questions That Are Grounded**

The biggest risk with AI is that it confidently makes things up. In the context of climbing, that's especially dangerous — incorrect route information can affect safety decisions.

So the system has several mechanisms to keep answers grounded: every response includes source links, there's a groundedness evaluation step, and answers are drawn from the platform's database rather than the LLM's training data. If you ask about something that isn't in the database, the AI should say it doesn't know — not fabricate an answer.

## After Launch

The feature is now open to all users. A few things we observed from actual usage:

The most common questions aren't "where can I climb" — they're more specific: difficulty distribution at a particular crag, seasonal recommendations, rock type characteristics of certain routes. These are questions that would take days to get answers to in the community; with AI, they're answered in seconds.

The personalization feature is used less than we expected — probably because users aren't aware that the AI knows their send history. That's a discoverability problem, not a feature design problem.

## Was It Worth It?

For a small platform, getting AI Q&A to this level took significant engineering time. Was it worth it?

I think the core question isn't "do we have AI or not," but "can the platform's existing interface answer the questions users are asking?" If the answer is no, then AI is worth investing in. For NobodyClimb, semantic search over climbing routes is a problem that search filters can't solve — so it was worth it.

If your platform's problems can be solved with good filters, build the filters first.

---

The technical architecture details of NobodyClimb's AI (13-step RAG pipeline, HyDE, self-reflection loop, etc.) are covered in a separate technical post.

## References

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [NobodyClimb RAG Pipeline Technical Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb: Why the Climbing Community Needs Its Own Platform](/posts/product/2026-03-12-nobodyclimb-product)
- [HyDE: Hypothetical Document Embeddings](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)
- [Self-Reflection: LLM-as-Judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge)
- [RAG Token Quota System](/posts/ai/2026-03-12-rag-token-quota-system)
