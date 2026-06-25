---
title: '"Recommend the next route" and "Recommend something similar" are not the same thing — Intent Disambiguation in RAG Recommendation Systems'
date: 2026-03-28
type: guide
category: tech
tags: [rag, intent-classification, nlp, recommendation-system, slot-filling]
lang: en
tldr: "In a climbing RAG system, 'recommend the next route' (progression) and 'recommend a similar route' (similarity) were conflated by a single hasSimilarRouteIntent() function, causing recommendation quality to collapse. The fix is a two-stage intent classification with a Regex Fast Path + LLM Fallback."
description: "A deep-dive analysis of how two semantically similar but intentionally distinct query types in a climbing route recommendation system can be correctly differentiated — from problem definition and academic grounding, to industry solutions and a concrete implementation on Cloudflare Workers."
draft: false
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-rag-intent-disambiguation-recommendation)

While building a RAG system for climbing route recommendations, I ran into a subtle but painful bug: when a user says "recommend the next route" versus "recommend a similar route," both look like recommendation requests on the surface — but the underlying intent is completely different. The system was handling both with a single keyword-matching function, and the result was poor recommendation quality across the board.

This post documents the root cause analysis, how academia approaches this kind of intent disambiguation, and the implementation approach I ended up choosing.

## The Problem: One Function Handling Two Intents

The system had a `hasSimilarRouteIntent()` function that used keyword matching to detect recommendation intent:

```typescript
// backend/src/services/query/nlp.ts
export function hasSimilarRouteIntent(query: string): boolean {
  return ['差不多', '類似', '相似', '爬完', '完攀', '爬過', '爬了', '攀了',
          '下一條', '下一個', 'rp', 'RP', 'redpoint', 'red point']
    .some((k) => query.includes(k));
}
```

What's the problem? "I just sent Tiantianlian Blue, recommend my next route" and "Recommend routes similar to Tiantianlian Blue" both trigger this function — but they want completely different things:

| Dimension | Progression Recommendation | Similarity Recommendation |
|-----------|---------------------------|--------------------------|
| **Difficulty direction** | Step up 0.5–1 sub-grade | Stay within ±1 sub-grade |
| **Skill focus** | Complementary or extending (face → crack) | Same type, same style |
| **Location preference** | Open, cross-crag is fine | Prefer same crag or same area |
| **Retrieval strategy** | Difficulty ascending + skill diversity | Vector similarity + difficulty filter |
| **User mindset** | "I'm ready for the next challenge" | "I love this feel — give me more of it" |

A climber who just redpointed 5.10d and asks for "the next route" is expecting something around 5.11a. If the system returns three 5.10c–5.10d "similar routes," the user will feel completely misunderstood. The reverse is just as bad — someone looking for the same style gets recommendations that are noticeably harder, which only leads to frustration.

In the climbing domain specifically, wrong recommendations aren't just a poor experience — they're a safety concern. Recommending a route above someone's ability can lead to injury.

## How Academia Approaches This

After surveying the literature, the core finding is consistent: **the granularity of intent modeling directly determines recommendation quality.**

Cai et al. (2024) analyzed 59 different intent models and found that fine-grained classification (distinguishing sub-intents like explore / exploit / compare / progress) improves recommendation acceptance rates by **15–25%** compared to coarse-grained classification (just recommend / not-recommend).

Zhang et al. (2025) demonstrated in the REIC paper that RAG-augmented intent classification handles semantically similar but intentionally different queries by retrieving annotated examples of similar historical queries as few-shot context — effectively disambiguating through retrieval. This maps directly to our scenario.

## Five Approaches and Their Trade-offs

### 1. Fine-Grained Intent Classification

Break the coarse "recommendation intent" into a sub-intent tree:

```
recommend_intent
├── progression     # "next route", "harder", "challenge"
├── similar         # "something like this", "same vibe", "same style"
├── exploration     # "what's good here", "show me some routes"
└── training        # "good for practice", "warm-up routes"
```

Wankmüller (2024) shows that GPT-4-class LLMs achieve over 85% accuracy on common intent recognition. The upside is that explicit labels map cleanly to retrieval strategies. The downside is that edge cases are hard to handle — "something like this but a bit harder" spans both progression and similar at the same time.

### 2. Slot-Filling (Intent + Slots)

Rather than just classifying intent, extract structured slots from the query:

```json
{
  "intent": "recommend_progression",
  "slots": {
    "reference_route": "Tiantianlian Blue",
    "difficulty_direction": "harder",
    "style_preference": null,
    "location_preference": "same_crag",
    "grade_offset": 1
  }
}
```

Chen & Yu (2021) in their ACM Computing Surveys paper show that joint intent detection and slot filling improves accuracy by 2–5% over independent models. Structured slots give precise control over retrieval parameters, but the schema requires domain expert design.

### 3. LLM Structured Output

Use prompt engineering + JSON mode to directly parse the query. Arora et al. (2024) at EMNLP Industry Track show that LLMs in zero-shot intent detection now match or exceed traditional fine-tuned models, especially in low-resource settings. Malkani (2024) proposes a Hybrid LLM + Intent Classification architecture — LLM for ambiguous queries, lightweight classifier for clear ones. Works without any labeled examples, but calling an LLM on every query introduces latency and cost.

### 4. Conversational Clarification

When the system is uncertain, ask the user directly:

```
User: "I just sent Tiantianlian Blue, recommend something"
System: "Would you like:
  A. Routes at a higher difficulty (you're currently on 5.10b)
  B. Routes with a similar style and difficulty
  C. Other routes at the same crag"
```

Highest accuracy, but adds an interaction turn that can feel like friction on mobile. Best suited as a fallback when confidence falls below a threshold.

### 5. Multi-Intent Detection

Liu et al. (2024) propose using contrastive learning to separate multiple intents within a single query. "Recommend something similar but a bit harder" can be decomposed into `[progression(0.6), similar(0.4)]` — use similarity as the base but shift the grade slightly upward. This is closest to real user needs, but the implementation complexity is high.

## Special Challenges in the Climbing Domain

Climbing isn't a typical product recommendation scenario. A few things make it unique:

**The YDS grade ladder.** Climbing has an explicit grade structure: `5.10a → 5.10b → 5.10c → 5.10d → 5.11a`. "Progression" can be quantified. But advancement isn't just about numbers — it also includes skill type transitions (face → crack), route length increases (single pitch → multi-pitch), and style shifts (sport → trad).

**theCrag's grAId system.** Uses the Whole-History Rating (WHR) algorithm to model both climbers and routes as dynamic ratings, predicting the probability that a climber will successfully complete a specific route at a given point in time. Recommending routes with a 50–70% success probability hits the sweet spot between challenge and achievability — a natural fit for progression intent.

**The linguistic specifics of Traditional Chinese.** This is the trickiest part:

| Expression | Intent | Challenge |
|------------|--------|-----------|
| "Climbed it, what's next" | Progression | Clear |
| "Recommend something similar" | Similar | Clear |
| "Sent it, ready to push harder" | Progression | "sent" triggers similar, but "push harder" implies progression |
| "After RP, recommend something" | Context-dependent | RP = redpoint/completion, but "next step" is semantically implied |
| "What else is worth climbing" | Exploration | Ambiguous |

## The Implementation: Regex Fast Path + LLM Fallback

The final architecture is a two-stage system that combines fine-grained classification with LLM structured output:

```
Query input
    │
    ▼
[Stage 1: Regex Fast Path]
    │
    ├── Matches "next / harder / challenge / improve" → progression
    ├── Matches "similar / same vibe / same style / like" → similar
    └── No match or conflict → move to Stage 2
    │
    ▼
[Stage 2: LLM Structured Output]
    │
    ├── Parse intent + slots + confidence
    └── confidence < 0.7 → trigger clarification
    │
    ▼
[Stage 3: Conversational Clarification (optional)]
    └── Return options for user to confirm intent
```

Core classification function:

```typescript
const PROGRESSION_KEYWORDS = ['下一條', '下一個', '更難', '挑戰', '進步', '提升', '突破'];
const SIMILAR_KEYWORDS = ['類似', '相似', '差不多', '同風格', '像'];
const COMPLETION_TRIGGERS = ['爬完', '完攀', '爬過', '爬了', '攀了', 'rp', 'RP', 'redpoint'];

export type RecommendIntent = 'progression' | 'similar' | 'exploration' | 'ambiguous';

export function classifyRecommendIntent(query: string): {
  intent: RecommendIntent;
  confidence: number;
} {
  const hasCompletion = COMPLETION_TRIGGERS.some(k => query.includes(k));
  const hasProgression = PROGRESSION_KEYWORDS.some(k => query.includes(k));
  const hasSimilar = SIMILAR_KEYWORDS.some(k => query.includes(k));

  // Clear progression intent
  if (hasProgression && !hasSimilar) {
    return { intent: 'progression', confidence: 0.95 };
  }
  // Clear similarity intent
  if (hasSimilar && !hasProgression) {
    return { intent: 'similar', confidence: 0.95 };
  }
  // Conflict: both progression and similarity keywords present → hand off to LLM
  if (hasProgression && hasSimilar) {
    return { intent: 'ambiguous', confidence: 0.5 };
  }
  // Completion trigger present but no clear direction → default to progression
  // "I sent it, recommend something" implies wanting to move up
  if (hasCompletion) {
    return { intent: 'progression', confidence: 0.7 };
  }

  return { intent: 'exploration', confidence: 0.6 };
}
```

Different intents map to different retrieval strategies, with the key differences in grade range and ranking logic:

```typescript
function buildRetrievalStrategy(intent: RecommendIntent, routeRef: RouteReference) {
  switch (intent) {
    case 'progression':
      return {
        gradeRange: progressionGradeRange(routeRef.gradeNumeric, +1, +4),
        cragFilter: null,              // No crag restriction, encourage exploration
        stylePreference: 'diverse',    // Prefer different styles for skill extension
        rankingStrategy: 'challenge-appropriate',
      };
    case 'similar':
      return {
        gradeRange: similarGradeRange(routeRef.gradeNumeric, 2),
        cragFilter: routeRef.cragId,   // Prefer same crag
        stylePreference: 'same',       // Same style
        rankingStrategy: 'similarity', // Rank by vector similarity
      };
    case 'exploration':
      return {
        gradeRange: similarGradeRange(routeRef.gradeNumeric, 4),
        cragFilter: null,
        stylePreference: 'diverse',
        rankingStrategy: 'popularity',
      };
  }
}
```

Grade offset calculation is straightforward:

```typescript
export function progressionGradeRange(
  gradeNumeric: number,
  minStepsUp: number = 1,
  maxStepsUp: number = 4
): { $gte: number; $lte: number } {
  const pos = gradeToPosition(gradeNumeric);
  return {
    $gte: positionToGrade(pos + minStepsUp),
    $lte: positionToGrade(pos + maxStepsUp),
  };
}
```

When integrating into `toolSelectionNode`, this replaces the original `if (hasSimRouteIntent)` check:

```typescript
const recommendResult = classifyRecommendIntent(query);
if (recommendResult.intent !== 'exploration' || hasCompletionTrigger(query)) {
  const routeRef = await state.queryService.extractRouteReference(query);
  const strategy = buildRetrievalStrategy(recommendResult.intent, routeRef);
  updates.recommendIntent = recommendResult.intent;
  updates.vectorFilter = buildVectorFilter(strategy, routeRef);
}
```

## Overall Takeaways

The core trade-off is **latency vs. accuracy**. The Regex Fast Path handles most clear-cut queries in under 1ms (estimated 70–80% of traffic). Only ambiguous or conflicting queries require an LLM call (an additional 200–500ms). On an edge runtime like Cloudflare Workers, every millisecond of avoidable latency matters.

The other trade-off is **choosing the default behavior**. When a user just says "I sent it, recommend something" without specifying direction, I default to progression rather than similar. The reasoning: when a climber mentions completing a route, the psychological implication is usually "I'm ready to move up." This assumption can be validated with A/B testing — track recommendation acceptance rates by intent type and adjust over time.

Future improvements could include integrating user history (consecutive RP's at the same grade is a stronger signal for progression), the WHR probability model (recommending routes with 50–70% success probability), and LLM structured output as a fallback when regex-stage confidence is insufficient.

---

## References

- [Cai et al. (2024) — Understanding User Intent Modeling for Conversational Recommender Systems](https://link.springer.com/article/10.1007/s11257-024-09398-x)
- [Zhang et al. (2025) — REIC: RAG-Enhanced Intent Classification at Scale](https://arxiv.org/pdf/2506.00210)
- [Wankmüller (2024) — User Intent Recognition and Satisfaction with Large Language Models](https://arxiv.org/html/2402.02136v2)
- [Weld et al. (2022) — A Survey of Intent Classification and Slot-Filling Datasets for Task-Oriented Dialog](https://arxiv.org/abs/2207.13211)
- [Chen & Yu (2021) — A Survey of Joint Intent Detection and Slot Filling Models in NLU](https://dl.acm.org/doi/10.1145/3547138)
- [Arora et al. (2024) — Intent Detection in the Age of LLMs (EMNLP Industry Track)](https://aclanthology.org/2024.emnlp-industry.114.pdf)
- [Malkani (2024) — Hybrid LLM + Intent Classification Approach](https://medium.com/data-science-collective/intent-driven-natural-language-interface-a-hybrid-llm-intent-classification-approach-e1d96ad6f35d)
- [Li et al. (2025) — A Survey on Recent Advances in LLM-Based Multi-turn Dialogue Systems](https://dl.acm.org/doi/10.1145/3771090)
- [Liu et al. (2024) — Multi-intent Aware Contrastive Learning for Sequential Recommendation](https://arxiv.org/html/2409.08733v1)
- [Wu et al. (2024) — C-LARA: Balancing Accuracy and Efficiency in Multi-Turn Intent Classification](https://arxiv.org/html/2411.12307v1)
- [theCrag — grAId Whole-History Rating System for Climbing](https://www.thecrag.com/en/article/graid)
- [Draper et al. (2022) — Content-Based Recommendations for Crags and Climbing Routes](https://link.springer.com/chapter/10.1007/978-3-030-94751-4_33)
- [Wen et al. (2025) — Beyond Item Dissimilarities: Diversifying by Intent in Recommender Systems (KDD)](https://arxiv.org/abs/2405.12327)
- [Yu et al. (2025) — MIND-RAG: Multimodal Context-Aware and Intent-Aware RAG](https://openaccess.thecvf.com/content/ICCV2025W/MRR%202025/papers/Yu_MIND-RAG_Multimodal_Context-Aware_and_Intent-Aware_Retrieval-Augmented_Generation_for_Educational_Publications_ICCVW_2025_paper.pdf)
- [IntentRec (2025) — Incorporating Latent User Intent via Contrastive Alignment for Sequential Recommendation](https://www.sciencedirect.com/science/article/abs/pii/S156742232500047X)
