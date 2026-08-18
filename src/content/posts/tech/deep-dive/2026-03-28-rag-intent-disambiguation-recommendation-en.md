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
series:
  name: "The RAG Techniques Compendium"
  order: 34
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

Cai et al. (2024) ran a systematic literature review of user intent modeling in conversational recommender systems, cataloguing **59 distinct models and 74 commonly used features** and distilling them into a decision model for picking one. It reports no "fine-grained beats coarse-grained by X%" number — it is a literature review, not a controlled experiment — but it does establish that *how finely you model intent, and with which family of model*, is a design variable you have to decide deliberately. Skipping that decision is exactly how we ended up with one boolean function serving two intents.

Zhang et al. (2025)'s REIC is the engineering evidence that maps most directly onto our case: using RAG to inject relevant knowledge (intent descriptions and examples) at inference time, it beats fine-tuning, zero-shot, and few-shot on large-scale customer-service intent classification — and, more usefully, it absorbs taxonomy changes without retraining. For a system whose intent set grows with the product, that property matters more than the headline accuracy figure.

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

Bodonhelyi et al. (2024) ran a user study comparing two generations of GPT on fine-grained intent recognition, and the finding worth remembering is this: **the stronger model is clearly better on *common* intents, but is frequently beaten by the weaker one on infrequent intents.** Upgrading the model does not automatically fix the long tail. The upside of this approach is that explicit labels map cleanly to retrieval strategies; the downside is that edge cases are hard to handle — "something like this but a bit harder" spans both progression and similar at the same time — and edge cases *are* the long tail.

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

Weld et al. (2022)'s ACM Computing Surveys review traces how joint intent detection and slot filling developed: joint models avoid the error propagation of a pipeline and leave you with a single model to train and tune. The same survey also cautions that joint models may not generalize well to unseen phrasings, and that in real deployments the domains and label sets shift over time anyway. Structured slots give precise control over retrieval parameters, but the schema requires domain expert design — and it is not cheap to change later.

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

Huang et al. (2024) propose using contrastive learning to disentangle multiple intents within a single interaction sequence. "Recommend something similar but a bit harder" can be decomposed into `[progression(0.6), similar(0.4)]` — use similarity as the base but shift the grade slightly upward. This is closest to real user needs, but the implementation complexity is high.

## Special Challenges in the Climbing Domain

Climbing isn't a typical product recommendation scenario. A few things make it unique:

**The YDS grade ladder.** Climbing has an explicit grade structure: `5.10a → 5.10b → 5.10c → 5.10d → 5.11a`. "Progression" can be quantified. But advancement isn't just about numbers — it also includes skill type transitions (face → crack), route length increases (single pitch → multi-pitch), and style shifts (sport → trad).

**theCrag's grAId system.** It productizes Scarff (2020)'s adaptation of Whole-History Rating (WHR) to climbing: climbers and routes are both modeled as ratings that vary over time, route difficulty is inferred from ascent records, and the model estimates the probability that a given climber will send a given route at a given point in time. That probability is exactly the ranking signal progression intent needs. As for *which* probability band to target — we provisionally use 50–70%, on the theory that it is challenging without being demoralizing — the official documentation gives no recommended value. That number is our own assumption and needs A/B testing.

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

The core trade-off is **latency vs. accuracy**. The Regex Fast Path handles most clear-cut queries in under 1ms (estimated 70–80% of traffic). Only ambiguous or conflicting queries require an LLM call (one extra round trip, which in practice lands in the hundreds-of-milliseconds range depending on model and region). On an edge runtime like Cloudflare Workers, every millisecond of avoidable latency matters.

The other trade-off is **choosing the default behavior**. When a user just says "I sent it, recommend something" without specifying direction, I default to progression rather than similar. The reasoning: when a climber mentions completing a route, the psychological implication is usually "I'm ready to move up." This assumption can be validated with A/B testing — track recommendation acceptance rates by intent type and adjust over time.

Future improvements could include integrating user history (consecutive RP's at the same grade is a stronger signal for progression), the WHR probability model (recommending routes with 50–70% success probability), and LLM structured output as a fallback when regex-stage confidence is insufficient.

---

## References

- [Cai et al. (2024) — Understanding User Intent Modeling for Conversational Recommender Systems](https://link.springer.com/article/10.1007/s11257-024-09398-x)
- [Zhang et al. (2025) — REIC: RAG-Enhanced Intent Classification at Scale](https://arxiv.org/pdf/2506.00210)
- [Bodonhelyi et al. (2024) — User Intent Recognition and Satisfaction with Large Language Models: A User Study with ChatGPT](https://arxiv.org/abs/2402.02136)
- [Larson & Leach (2022) — A Survey of Intent Classification and Slot-Filling Datasets for Task-Oriented Dialog](https://arxiv.org/abs/2207.13211)
- [Weld et al. (2022) — A Survey of Joint Intent Detection and Slot Filling Models in NLU (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3547138)
- [Arora et al. (2024) — Intent Detection in the Age of LLMs (EMNLP Industry Track)](https://aclanthology.org/2024.emnlp-industry.114.pdf)
- [Malkani (2024) — Hybrid LLM + Intent Classification Approach](https://medium.com/data-science-collective/intent-driven-natural-language-interface-a-hybrid-llm-intent-classification-approach-e1d96ad6f35d)
- [Yi et al. (2025) — A Survey on Recent Advances in LLM-Based Multi-turn Dialogue Systems (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3771090)
- [Huang et al. (2024) — Multi-intent Aware Contrastive Learning for Sequential Recommendation](https://arxiv.org/abs/2409.08733)
- [Liu et al. (2024) — Balancing Accuracy and Efficiency in Multi-Turn Intent Classification for LLM-Powered Agents in Production](https://arxiv.org/abs/2411.12307)
- [theCrag — grAId Whole-History Rating System for Climbing](https://www.thecrag.com/en/article/graid)
- [Scarff (2020) — Estimation of Climbing Route Difficulty using Whole-History Rating](https://arxiv.org/abs/2001.05388)
- [Ivanova, Andrić & Ricci (2022) — Content-Based Recommendations for Crags and Climbing Routes](https://link.springer.com/chapter/10.1007/978-3-030-94751-4_33)
- [Wang et al. (2024) — Beyond Item Dissimilarities: Diversifying by Intent in Recommender Systems](https://arxiv.org/abs/2405.12327)
- [Yu et al. (2025) — MIND-RAG: Multimodal Context-Aware and Intent-Aware RAG](https://openaccess.thecvf.com/content/ICCV2025W/MRR%202025/papers/Yu_MIND-RAG_Multimodal_Context-Aware_and_Intent-Aware_Retrieval-Augmented_Generation_for_Educational_Publications_ICCVW_2025_paper.pdf)
- [Hwang & Lee (2025) — IntentRec: Incorporating Latent User Intent via Contrastive Alignment for Sequential Recommendation](https://doi.org/10.1016/j.elerap.2025.101522)
