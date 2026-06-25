---
title: "RAG Multi-Entity Queries: When the User Lists Five Routes and the System Only Sees the First"
date: 2026-03-28
type: guide
category: tech
tags: [rag, ner, query-decomposition, recommendation-system, multi-hop-qa]
lang: en
tldr: "The RAG system's extractRouteReference() used a for...return pattern that grabbed only the first match — so when a user provided five completed routes, only one was used. The fix evolves through three layers: rule-based multi-entity extraction, user profile aggregation, and embedding centroid."
description: "When a RAG recommendation system encounters a multi-entity query, extracting only a single anchor causes triple information loss: difficulty range, style preferences, and the exclusion list. This post surveys Multi-Entity NER, Query Decomposition, User Profile Aggregation, and Plan-and-Execute RAG as solutions, with references to 20 papers."
draft: false
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing)

The user says: "I recently completed Baihu 5.11d, Lightning 5.12a, Looks Like I Can 5.11c, Bubblegum 5.11b, and Hsinchu Hakka 5.10d — recommend 3 routes I haven't climbed." The system sees Baihu and returns. The other four routes? Gone.

This is a real bug that surfaced in the NobodyClimb climbing recommendation system. This post documents the root cause, how academia and industry handle similar problems, and the layered solution we ultimately chose.

## The Problem: The Cost of for...return

The logic in `extractRouteReference()` was simple: iterate over known route names, match against the query string, and return on the first hit. This works perfectly for single-entity queries like "recommend routes similar to Baihu." But when a user provides five routes at once, three kinds of information evaporate immediately:

**Difficulty range loss** — The five routes span 5.10d to 5.12a, meaning the user's ability covers three major grade levels. By grabbing only Baihu at 5.11d, the recommendation range gets pinned to 5.11a–5.12b (±3 steps), completely ignoring the fact that the user has already sent 5.12a.

**Style preference loss** — Multiple routes may be spread across different crags and types (sport / trad / boulder), and that distribution reflects climbing preferences. A single route cannot represent it.

**Incomplete exclusion list** — The user said "routes I haven't climbed," but `excludeRouteId` only excludes Baihu. The other four routes can still appear in the recommendation results.

In IR terminology, this is a *complex information need*. Metzler & Croft (2005) noted long ago that most retrieval systems assume queries are atomic, but in practice users frequently embed multiple entities and implicit preferences in a single query. In the recommendation context, this is a variant of the cold-start problem: the user has proactively provided rich preference signals, and the system is only consuming a fraction of them.

## Solution Landscape

After surveying the literature, five approaches emerged (pun intended).

### Multi-Entity Extraction

The most intuitive fix: change `extractRouteReference()` to `extractRouteReferences()` and return an array instead of a single result.

**Rule-based approach**: Replace `for...return` with `for...push`, adding a consumed-range mechanism to prevent overlapping matches (once "Looks Like I Can" is matched, "I Can" cannot match again). Aggregate the difficulty of all routes into a union range:

```
gradeFilter = {
  $gte: min(allGrades) - margin,
  $lte: max(allGrades) + margin
}
```

**LLM-based approach**: Have the LLM extract all routes at once via structured output:

```json
{
  "routes": [
    {"name": "Baihu", "grade": "5.11d"},
    {"name": "Lightning", "grade": "5.12a"},
    {"name": "Looks Like I Can", "grade": "5.11c"},
    {"name": "Bubblegum", "grade": "5.11b"},
    {"name": "Hsinchu Hakka", "grade": "5.10d"}
  ],
  "intent": "recommend_next_challenge",
  "exclude_mentioned": true
}
```

On the academic side, Li et al. (2020)'s FLAT (Flat-Lattice Transformer) achieved SOTA on Chinese NER and handles multiple overlapping entities within a single sentence. Yan et al. (2021) reframed NER as a reading comprehension task, which naturally supports multi-entity extraction. In industry, Amazon Alexa's Multi-slot NER and Rasa NLU's CRF + Transformer pipeline solve the same problem.

### Query Decomposition

Decompose a complex query into multiple sub-queries, retrieve independently, then merge. For this case:

1. **Profile Sub-query**: Extract all five routes → build a user capability profile
2. **Exclusion Sub-query**: Exclude all five routes → build an exclusion list
3. **Recommendation Sub-query**: Use the profile as a basis → execute recommendation retrieval

There are several relevant frameworks. Self-Ask (Press et al., 2023) has the LLM ask itself follow-up questions, breaking a complex question into independently answerable sub-questions. IRCoT (Trivedi et al., 2023) goes further by interleaving Chain-of-Thought reasoning with retrieval — each reasoning step generates new retrieval needs. LangChain's Multi-Query Retriever and LlamaIndex's Sub-Question Query Engine follow the same paradigm.

### User Profile Aggregation

Rather than treating each route as a separate retrieval anchor, aggregate them into a user preference profile:

| Dimension | Aggregation Method | Result for This Case |
|-----------|-------------------|----------------------|
| Ability ceiling | max grade | 5.12a → recommend 5.12a–5.12c |
| Comfort zone | median grade | 5.11c |
| Route type | sport/trad/boulder ratio | sport-leaning → weighted |
| Crag | crag distribution | multi-crag → no restriction |
| Exclusion | collect all route_ids | all 5 excluded |

At the embedding level, compute a centroid:

```
query_vector = mean([embed(Baihu), embed(Lightning), embed(Looks Like I Can), embed(Bubblegum), embed(Hsinchu Hakka)])
```

This is the classic average pooling of item embeddings from recommendation systems. The YouTube Recommendations paper (Covington et al., 2016) uses the average of watch-history embeddings as the user representation — the exact same concept.

### Plan-and-Execute RAG

Introduce a planning phase that analyzes the complete intent before executing step by step:

```
Query → Planner → [Step 1: Extract all routes]
                   [Step 2: Build user profile]
                   [Step 3: Determine search criteria]
                   [Step 4: Vector search with aggregated filter]
                   [Step 5: Re-rank and exclude]
               → Executor → Response
```

This connects to the existing LangGraph architecture's `multi_tool` path, but the key difference is that the planning phase in Plan-and-Execute is more structured (it doesn't just decide which tools to use — it also decides how to aggregate intermediate results), and the execution phase includes a feedback loop. Wang et al. (2023)'s Plan-and-Solve Prompting and Yao et al. (2023)'s ReAct point in this direction.

### Collaborative Filtering

Look at "what other users who climbed the same routes also climbed":

```sql
-- Find users with similar taste
SELECT user_id, COUNT(*) as overlap
FROM ascents
WHERE route_id IN ('baihu_id', 'lightning_id', 'looks_like_i_can_id', 'bubblegum_id', 'hsinchu_hakka_id')
  AND user_id != current_user_id
GROUP BY user_id
ORDER BY overlap DESC
LIMIT 10;

-- Find recommendations from similar users
SELECT route_id, COUNT(*) as popularity
FROM ascents
WHERE user_id IN (top_10_similar_users)
  AND route_id NOT IN (excluded_routes)
GROUP BY route_id
ORDER BY popularity DESC
LIMIT 3;
```

The concept is elegant, but the constraints are practical: it requires sufficient user records, the computation is too heavy for Cloudflare Workers' CPU time limits, and it's better suited to offline precomputation rather than real-time queries.

## Multi-Hop QA: The Academic Connection

Multi-entity queries are closely related to Multi-Hop QA. Key papers:

- **HotpotQA** (Yang et al., 2018) — Multi-hop QA benchmark requiring reasoning across multiple documents
- **MDR** (Xiong et al., 2021) — Iterative retrieval that adjusts each hop's query based on the previous hop's results
- **Baleen** (Khattab et al., 2021) — Condensed retrieval that compresses intermediate results across hops for efficiency
- **DSP** (Khattab et al., 2023) — Precursor to DSPy; demonstrate-search-predict pipeline

For Query Decomposition, Ma et al. (2023)'s Query Rewriting and Shao et al. (2023)'s ITER-RETGEN (iterative retrieval-generation) are worth studying. For multi-signal fusion in recommendation systems, SASRec (Kang & McAuley, 2018) uses self-attention over interaction sequences, and Li et al. (2023)'s GPT4Rec frames recommendation directly as a language task.

## Chosen Approach: Layered Implementation

Given the constraints of the Cloudflare Workers runtime, D1 SQLite, and the existing LangGraph architecture, a single big-bang rewrite wasn't feasible. The approach breaks into three layers:

**P0 (immediate): Multi-Entity Extraction**

Smallest change, biggest impact. `extractRouteReference()` → `extractRouteReferences()`, returning an array. The caller aggregates filters across multiple routes, and `excludeRouteId` becomes `excludeRouteIds`. No additional LLM calls, no latency increase. Estimated to resolve 80% of multi-entity query problems.

**P1 (short-term): User Profile Aggregation**

Add `buildUserProfile()` to compute the ability ceiling, comfort zone, preferred type, and crag distribution from multiple routes. The profile is injected into the LLM prompt's system context, giving the model complete user background when generating responses.

**P2 (medium-term): Embedding Centroid**

If multiple routes have embeddings, compute the centroid vector as the query vector. Results are then re-ranked: exclude mentioned routes, apply difficulty-appropriateness weighting, and apply diversity weighting. This depends on whether the Cloudflare Vectorize API supports custom query vectors.

Integration points with the existing architecture:

```
nlp.ts            → extractRouteReferences() returns array
tool-selection.ts → routeRefs: RouteReference[], aggregated filter
GraphState        → excludeRouteIds: string[]
filter-build.ts   → handles multiple crags ($in instead of $eq)
vector search     → post-filter excludes multiple routes ($nin instead of $ne)
```

## In Summary

The core trade-off is "maximize recommendation quality improvement with minimal additional computation, within edge runtime constraints." P0's rule-based multi-entity extraction is nearly zero-cost and resolves the majority of problems — the best return on investment. P1 adds profile aggregation so the LLM has fuller context, at the cost of a bit more string processing. P2's embedding centroid is where computation and API limits actually come into play, so feasibility validation is needed first.

Query Decomposition and Collaborative Filtering are deferred for now. The former overlaps with the existing LangGraph multi-tool path; the latter needs more user data. Once P0–P2 are live, the next step depends on where the recommendation quality bottleneck actually sits.

---

## References

- [FLAT: Chinese NER Using Flat-Lattice Transformer (Li et al., 2020)](https://aclanthology.org/2020.acl-main.611/)
- [A Unified Generative Framework for Various NER Subtasks (Yan et al., 2021)](https://aclanthology.org/2021.acl-long.451/)
- [Measuring and Narrowing the Compositionality Gap in Language Models (Press et al., 2023)](https://arxiv.org/abs/2210.03350)
- [Decomposed Prompting: A Modular Approach for Solving Complex Tasks (Khot et al., 2023)](https://arxiv.org/abs/2210.02406)
- [Interleaving Retrieval with Chain-of-Thought Reasoning (Trivedi et al., 2023)](https://aclanthology.org/2023.acl-long.557/)
- [Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)](https://dl.acm.org/doi/10.1145/2959100.2959190)
- [Matrix Factorization Techniques for Recommender Systems (Koren et al., 2009)](https://ieeexplore.ieee.org/document/5197422)
- [Plan-and-Solve Prompting (Wang et al., 2023)](https://aclanthology.org/2023.acl-long.147/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2023)](https://arxiv.org/abs/2210.03629)
- [Reflexion: Language Agents with Verbal Reinforcement Learning (Shinn et al., 2023)](https://arxiv.org/abs/2303.11366)
- [BPR: Bayesian Personalized Ranking from Implicit Feedback (Rendle et al., 2009)](https://arxiv.org/abs/1205.2618)
- [Neural Collaborative Filtering (He et al., 2017)](https://arxiv.org/abs/1708.05031)
- [HotpotQA: A Dataset for Diverse, Explainable Multi-hop QA (Yang et al., 2018)](https://arxiv.org/abs/1809.09600)
- [Answering Complex Open-Domain Questions with Multi-Hop Dense Retrieval (Xiong et al., 2021)](https://arxiv.org/abs/2009.12756)
- [Baleen: Robust Multi-Hop Reasoning at Scale via Condensed Retrieval (Khattab et al., 2021)](https://arxiv.org/abs/2101.00436)
- [Demonstrate-Search-Predict: Composing Retrieval and Language Models (Khattab et al., 2023)](https://arxiv.org/abs/2212.14024)
- [Query Rewriting for Retrieval-Augmented Large Language Models (Ma et al., 2023)](https://arxiv.org/abs/2305.14283)
- [ITER-RETGEN: Enhancing Retrieval-Augmented LLMs with Iterative Retrieval-Generation Synergy (Shao et al., 2023)](https://arxiv.org/abs/2305.15294)
- [Self-Attentive Sequential Recommendation (Kang & McAuley, 2018)](https://arxiv.org/abs/1808.09781)
- [GPT4Rec: A Generative Framework for Personalized Recommendation (Li et al., 2023)](https://arxiv.org/abs/2304.03879)
