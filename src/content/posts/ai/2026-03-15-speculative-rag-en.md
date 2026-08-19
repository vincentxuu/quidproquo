---
title: "Speculative RAG: Small Models Draft in Parallel, Large Model Verifies at Once"
date: 2026-03-15
updated: 2026-08-19
type: guide
category: ai
tags: [rag, speculative-rag, dual-model, latency-optimization, accuracy]
lang: en
tldr: "Speculative RAG uses small specialist models to generate multiple answer drafts from different document subsets in parallel, then a large model verifies and selects the best answer in one pass. The paper reports +12.97 points accuracy and -50.83% latency on PubHealth — but that is the best cell in the table; other benchmarks gain far less."
description: "The dual-model architecture of Speculative RAG: RAG Drafter generates drafts in parallel, RAG Verifier validates in a single pass, plus performance comparisons with standard RAG and an implementation guide."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 27
---

> 🌏 [中文版](/posts/ai/2026-03-15-speculative-rag)

The standard RAG pipeline is familiar to everyone: retrieve documents, assemble them into context, and send them to an LLM for generation. This pipeline is simple and effective, but it has a fundamental bottleneck: **all documents are stuffed into a single LLM call, the model must process all information in one generation pass, and the entire pipeline is sequential**.

The more documents, the longer the context, the higher the latency — and models tend to "get lost" in super-long contexts, with important information buried in massive walls of text. This is the problem Speculative RAG aims to solve.

## Three Bottlenecks of Standard RAG

### 1. Latency from Sequential Processing

Standard RAG follows a strictly sequential pipeline:

```
Query → Retrieve → [Concatenate all docs] → LLM generation → Answer
                                              ↑
                                    Single call, long wait
```

Document retrieval can be fast (millisecond-level), but LLM generation is the bottleneck of the entire pipeline. The longer the context, the longer the generation time. Ten documents concatenated together could easily reach 8,000 tokens, and a large model takes significant time to process that length.

### 2. Attention Dilution in Long Context

When all retrieved documents are packed into a single prompt, the model must simultaneously process multiple pieces of potentially contradictory information. Research has repeatedly shown that LLMs suffer from a "lost in the middle" problem in long contexts: information at the beginning and end is remembered, while the middle is ignored.

If the most relevant document happens to be ranked in the middle, the model may not fully utilize it at all.

### 3. The Single-Generation Gamble

Standard RAG generates only one answer. If the generation goes off course — picking up wrong information from documents, or following a flawed reasoning chain — there's no chance for correction. Unless you add an Agentic RAG loop-retry mechanism, but that introduces even more latency.

Speculative RAG's core insight: **Rather than having one large model struggle through all documents, have multiple small models each handle a small subset, then let a large model pick the best answer from multiple candidates**.

## Speculative RAG Architecture

The name borrows from the concept of Speculative Decoding: use small models to "speculate," use the large model to "verify."

### Overall Flow

```
                          ┌─────────────────┐
                          │     Query        │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │    Retriever     │
                          │ (Retrieve N docs)│
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │ Subset 1  │ │ Subset 2  │ │ Subset 3  │
              │ {D1, D3}  │ │ {D2, D5}  │ │ {D1, D4}  │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │  Drafter   │ │  Drafter   │ │  Drafter   │
              │(Small Model)│ │(Small Model)│ │(Small Model)│
              │  Draft 1   │ │  Draft 2   │ │  Draft 3   │
              │+ Rationale │ │+ Rationale │ │+ Rationale │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
                    │      ┌──────┴──────┐       │
                    └──────►             ◄───────┘
                           │  Verifier   │
                           │(Large Model)│
                           │Score+Select │
                           └──────┬──────┘
                                  │
                          ┌───────▼───────┐
                          │  Best Answer   │
                          └───────────────┘
```

Three key steps:

1. **Document grouping**: Cluster the N retrieved documents by their relation to the question, then draw one document per cluster to form each of K subsets (details in "Subset Sampling Strategy" below — this step is not random)
2. **Parallel draft generation**: K small RAG Drafter models process their respective document subsets in parallel, each generating an answer draft and reasoning process
3. **Single-pass verification**: One large RAG Verifier model receives all drafts, scores them in one pass, and selects the best answer

### Why Is This Faster?

The key is **parallelization**. Three small models run simultaneously, each processing only 2–3 documents (short context), generating quickly. The large model only needs to review a few drafts (not all raw documents), so the context is short and verification is fast.

Overall latency ≈ max(Drafter latency) + Verifier latency

Compared to standard RAG:

Overall latency ≈ Large model processing all documents latency

The former is typically significantly shorter because the small models are fast, the context is short, and execution is parallel.

## RAG Drafter Design

The RAG Drafter is the "workforce" of the architecture — small, specialized, and parallelizable.

### Model Selection

The paper uses Mistral-7B (v0.1) as the Drafter's base model, then instruction-tunes it for RAG (the appendix also tries an instruction-tuned Gemma-2 2B, with promising results). Reasons for choosing a small model:

- **Fast inference**: A 7B-parameter model has much lower inference latency on GPUs compared to 70B+ large models
- **Parallel deployment**: The same GPU memory can run multiple small model instances
- **Task specialization**: Drafters don't need broad world knowledge — they only need to extract and organize information from given documents

### Each Drafter Sees a Different Document Subset

This is the most clever design of Speculative RAG. Suppose the retriever returns 6 documents {D1, D2, D3, D4, D5, D6}. The system clusters them by perspective, then draws one document per cluster to form each subset:

```
Drafter 1 receives: {D1, D3, D5}
Drafter 2 receives: {D2, D4, D6}
Drafter 3 receives: {D1, D2, D4}
Drafter 4 receives: {D3, D5, D6}
```

Each Drafter sees only a portion of the documents, which brings several benefits:

1. **Shorter context per Drafter**: 3 documents vs. 6 documents means more focused attention
2. **Diversity from different subsets**: Different document combinations may lead to different answer perspectives
3. **Redundancy for fault tolerance**: Even if one subset's document quality is poor, other subsets may still contain the information needed for the correct answer

### Subset Sampling Strategy

Here is a detail that many secondhand summaries get wrong: **the paper's subsets are not sampled randomly.**

The actual method clusters the retrieved documents by their relation to the question — each cluster represents one perspective in the retrieval results — and then **draws one document from each cluster** to form a subset, minimizing redundancy and maximizing perspective diversity. The paper's ablation tests this directly: sampling from within the same cluster significantly underperforms, because the documents in a subset then echo each other and the drafts lose their diversity.

Subset size is a hyperparameter. Too small (1 document) may lack sufficient information; too large (close to N documents) loses the advantage of distributed processing. The paper's main configuration: for TriviaQA, PopQA, PubHealth, and ARC-Challenge, retrieve top-10 and generate 5 drafts per query (m=5) with 2 documents each (k=2); for MuSiQue, whose reasoning is more complex, retrieve top-15 and generate 10 drafts with 6 documents each.

Two practical findings from the paper's hyperparameter analysis: **more drafts keep improving performance, and because drafts are generated in parallel, they add no latency**; but **more documents per draft is not always better** — on TriviaQA and PubHealth the curve across 1, 2, 4, 6, and 10 documents is not monotonic.

### Rationale Generation

Each Drafter generates not just an answer but also a **rationale** (reasoning process). The Drafter's output format:

```
Draft: [Answer content]
Rationale: [Reasoning process for arriving at this answer from these documents]
```

The rationale serves as a basis for the Verifier's judgment. The Verifier doesn't just evaluate whether the answer is correct — it also assesses whether the reasoning is sound. One answer might happen to be correct but have flawed reasoning, while another might be less complete but have rigorous logic — the Verifier can make better judgments based on this.

### Drafter Training

The paper trains the Drafter using Knowledge Distillation:

1. Sample instruction-following pairs from Open-Instruct and knowledge-intensive datasets, augment them with up to 10 retrieved documents via a dense retriever, and use a large model to generate the rationale — the main line of the paper uses Gemini-Ultra, for 40k training instances in total
2. Fine-tune Mistral-7B (v0.1) on this data
3. The fine-tuned small model learns the ability to "read documents → write draft + reasoning"

The paper repeats the data generation with GPT-4o and finds Speculative RAG keeps its advantage, so the method isn't bound to one teacher model. An ablation also confirms that **removing the rationale from the fine-tuning data drops performance noticeably on all three benchmarks** — the rationale isn't decoration, it's the key input to the verification stage.

This training approach allows a 7B small model to approach large model quality on specific tasks while maintaining the speed advantage of a small model.

## RAG Verifier Design

The RAG Verifier is the "judge" of the architecture — large, general-purpose, and decisive in a single pass.

### Model Selection

This is another commonly mis-stated point: **the paper's Verifier is not GPT-4.** The experiments use Mistral-7B (v0.1) or Mixtral-8x7B (v0.1) with no fine-tuning at all, denoted M<sub>Verifier-7B</sub> and M<sub>Verifier-8x7B</sub>. GPT-4o and Gemini-Ultra appear only in the step that generates the Drafter's training data — never on the inference path.

That's arguably the more interesting result: an 8x7B Verifier is enough, and even a 7B Verifier paired with a 7B Drafter already beats every baseline. "Large model" here is relative.

Reasons for choosing a (relatively) larger model as the Verifier:

- **Broad world knowledge**: Can cross-verify draft accuracy
- **Strong reasoning ability**: Can evaluate logical consistency of reasoning chains
- **Comparative judgment**: Can review multiple candidate answers simultaneously and select the best one

### Verification Flow

The Verifier receives the following input:

```
Query: [Original question]

Draft 1:
Answer: [Draft 1's answer]
Rationale: [Draft 1's reasoning process]

Draft 2:
Answer: [Draft 2's answer]
Rationale: [Draft 2's reasoning process]

Draft 3:
Answer: [Draft 3's answer]
Rationale: [Draft 3's reasoning process]

Please evaluate each draft and select the best answer.
```

Note that the Verifier **does not see the original documents**. It only sees the Drafters' drafts and reasoning processes. This is an intentional design choice:

1. **Shorter context**: 3 drafts are far shorter than 6 raw documents
2. **Pre-processed information**: Drafters have already extracted relevant information from the raw documents
3. **Focused comparison**: The Verifier's task is to compare and judge, not extract information from scratch

### Scoring Mechanism

The paper's scoring is **not** "ask the Verifier to write a critique and assign points" — it reads conditional probabilities off the model directly. The confidence score is the product of three terms:

1. **ρ<sub>Draft</sub>**: the Drafter's own generation probability for the draft
2. **ρ<sub>Self-contain</sub>**: the Verifier's probability of generating the answer given the question and the rationale, i.e. Score(α | Q, β)
3. **ρ<sub>Self-reflect</sub>**: the Verifier's probability of answering "Yes" to a self-reflection statement

The ablation shows all three contribute. Removing ρ<sub>Draft</sub> costs the least (−0.19 on TriviaQA, −1.12 on PubHealth); removing ρ<sub>Self-contain</sub> or ρ<sub>Self-reflect</sub> costs roughly 2 points on TriviaQA and 0.8 on PubHealth each. And **skipping verification entirely — picking a draft at random — costs 5.69 (TriviaQA) and 5.37 (PubHealth)**. That gap is the value of the verification step.

Using probabilities rather than asking the model to grade has a clear upside: the Verifier needs no fine-tuning and no structured scoring output. The downside is that your inference stack must expose token logprobs, which text-only APIs do not.

### Why Doesn't the Verifier Need the Original Documents?

This is a counterintuitive design choice. We might wonder: how can the Verifier judge whether a draft is accurate without seeing the original documents?

The answer is: **the Verifier relies on the large model's own world knowledge and reasoning ability**.

- If a draft claims "the highest mountain in Taiwan is Yushan at 3,952 meters elevation," the Verifier's large model already knows whether this is correct
- If a draft's reasoning has logical contradictions (stating A earlier then concluding not A later), the Verifier can detect this through reasoning ability
- If multiple drafts give different answers, the Verifier can cross-reference to determine which is more credible

This design keeps the Verifier's context window short, further reducing latency.

## Performance Data

The paper tested Speculative RAG on five benchmarks, comparing it with standard RAG and other methods. Here are the main results.

### Accuracy Comparison

These are **the actual numbers from the paper's Table 1** (accuracy %; source in the references).

| RAG method | TriviaQA | MuSiQue | PopQA | PubHealth | ARC-C |
|---|---|---|---|---|---|
| Standard RAG — Mistral-7B | 54.15 | 16.71 | 31.38 | 34.85 | 42.75 |
| Standard RAG — Mixtral-8x7B | 59.85 | 19.16 | 34.02 | 37.08 | 48.72 |
| Standard RAG — Mistral-Instruct-7B | 67.11 | 17.99 | 42.17 | 42.15 | 47.70 |
| Standard RAG — Mixtral-Instruct-8x7B | 73.91 | 29.42 | 53.68 | 63.63 | 78.41 |
| CRAG (Mistral-7B) | 59.03 | — | 49.46 | 59.04 | 74.87 |
| Self-RAG (Mistral-7B) | 64.84 | 21.72 | 52.68 | 72.44 | 74.91 |
| Self-CRAG (Mistral-7B) | 65.43 | — | 56.11 | 72.85 | 75.26 |
| **Spec. RAG — Verifier-7B + Drafter-7B** | 73.91 | 31.03 | 56.75 | 75.79 | 76.19 |
| **Spec. RAG — Verifier-8x7B + Drafter-7B** | **74.24** | **31.57** | **57.54** | **76.60** | **80.55** |

Key observations:

- **PubHealth shows the largest improvement**: 76.60 versus 63.63 for the strongest Standard RAG baseline — a gap of 12.97 points. That is where the abstract's "up to 12.97%" comes from. It is PubHealth, not PopQA; plenty of secondhand write-ups attach that number to the wrong benchmark.
- **TriviaQA barely moves**: 74.24 versus Mixtral-Instruct-8x7B's 73.91, a difference of 0.33. When the baseline is already strong and the task doesn't especially reward multiple perspectives, the accuracy dividend of this architecture is close to zero and the remaining value is latency.
- **MuSiQue (multi-hop) gains about 2 points**: 31.57 versus 29.42. Real but not dramatic — and note MuSiQue runs different hyperparameters (10 drafts, 6 documents each).
- **Beats Self-RAG and CRAG**: on every column where those methods report numbers.

Two caveats: (1) every method in the table runs on the same Mistral-family backbones for fairness, so results won't necessarily transfer to other models; (2) the paper itself notes that **the Drafter alone, without verification, already beats most baselines** — the marginal contribution of the verification stage lands somewhere between 0.3 and 4 points.

### Latency Comparison

The paper's latency analysis samples 100 cases per dataset, processes them individually without batching, and compares against **the strongest baseline (Standard RAG: Mixtral-Instruct-8x7B)**. Actual reductions:

| Benchmark | Latency reduction |
|---|---|
| TriviaQA | −11.90% |
| MuSiQue | −15.07% |
| PopQA | −44.31% |
| PubHealth | −50.83% |
| ARC-Challenge | −22.77% |

So "50% lower latency" is the PubHealth cell, not the rule — TriviaQA drops by under 12%. The size of the reduction depends mostly on how long that dataset's retrieved documents are: the longer they are, the more Standard RAG is dragged down by long context and the bigger Speculative RAG's relative edge.

Note the hardware premise, too: on TriviaQA and similar datasets Speculative RAG **launches 5 Drafter endpoints in parallel** (10 for MuSiQue), with tensor parallelism of 4 to fit Mixtral-8x7B. Without that parallel capacity, these numbers do not reproduce.

Sources of latency reduction:

1. **Parallel Drafter execution**: Multiple small models run simultaneously — total latency depends on the slowest one (not the sum)
2. **Shorter context**: Each Drafter processes only 2–3 documents; the Verifier processes only a few drafts
3. **Fewer large model calls**: Standard RAG has the large model process all documents; Speculative RAG only uses the large model for verification (shorter context)

### Pareto Improvement in Accuracy vs. Latency

This is Speculative RAG's strongest point: **it simultaneously improves both accuracy and latency**.

Typically, we face this tradeoff:

- Want more accuracy? Use a larger model, process more documents → higher latency
- Want more speed? Use a smaller model, process fewer documents → lower accuracy

Under the paper's setup, Speculative RAG improves both dimensions at once, through architectural design rather than simply throwing hardware at the problem.

But discount the phrase "Pareto improvement" somewhat. From the actual numbers above, the accuracy dividend concentrates on PubHealth, PopQA, and ARC-C, and is nearly absent on TriviaQA; the latency dividend concentrates on datasets with longer retrieved documents. And it isn't free — you need (a) a distillation and fine-tuning round to produce the Drafter, (b) inference capacity to run 5–10 Drafter instances concurrently, and (c) a Verifier that exposes logprobs. Count those in and it looks less like a free lunch and more like trading engineering complexity for latency and some accuracy.

## Comparison with Other RAG Patterns

### vs Standard RAG

```
Standard RAG:
  Query → Retrieve ALL docs → [Big Model] → Answer
  Latency: High (large model processes long context)
  Accuracy: Medium (attention dilution)

Speculative RAG:
  Query → Retrieve docs → Split into subsets
        → [Small Model 1] → Draft 1 ─┐
        → [Small Model 2] → Draft 2 ──┤→ [Big Model] → Best Answer
        → [Small Model 3] → Draft 3 ─┘
  Latency: Low (parallel + short context)
  Accuracy: High (multiple perspectives + verification)
```

Core difference: Standard RAG is "one model does everything," Speculative RAG is "division of labor."

### vs Self-RAG

Self-RAG has the model self-reflect during generation, deciding whether more retrieval is needed. Its problems:

1. **Sequential reflection**: Reflect-retrieve-regenerate is a sequential process; each reflection adds latency
2. **One model wearing multiple hats**: The same model handles both generation and reflection — task conflict
3. **Single perspective**: Always starting from the same document set

Speculative RAG's advantages:

1. **Parallel, not sequential**: Multiple Drafters work simultaneously
2. **Dedicated roles**: Drafters focus on generation, Verifier focuses on verification
3. **Diverse perspectives**: Different document subsets bring different angles

| Dimension | Self-RAG | Speculative RAG |
|-----------|---------|-----------------|
| Architecture | Single model + reflection tokens | Dual model (Drafter + Verifier) |
| Execution | Sequential (generate → reflect → regenerate) | Parallel (multi-Drafter) + single verification |
| Latency | High (multiple iterations) | Low (parallel + short context) |
| Diversity | Low (same perspective for reflection) | High (different document subsets) |
| Training Cost | Requires special token training | Requires Drafter distillation training |

### vs CRAG (Corrective RAG)

CRAG's core approach is "retrieval quality detection + correction": if retrieval results are poor, correct the query and re-retrieve.

The two solve different problems:

- **CRAG addresses "poor retrieval quality"**: Retrieved documents are irrelevant, requiring query correction
- **Speculative RAG addresses "poor generation quality"**: Documents have already been retrieved; the issue is how to better utilize them

They are actually complementary. You can use CRAG first to ensure retrieval quality, then Speculative RAG to ensure generation quality:

```
Query → CRAG (ensure retrieval quality) → Speculative RAG (ensure generation quality) → Answer
```

| Dimension | CRAG | Speculative RAG |
|-----------|------|-----------------|
| Goal | Improve retrieval quality | Improve generation quality |
| Correction target | Query / retrieval results | Answer drafts |
| Additional cost | Multiple retrievals | Multiple Drafter inferences |
| Model requirement | Single model | Dual model (large + small) |
| Composability | Can combine with Speculative RAG | Can combine with CRAG |

### Applicability Overview of Each Method

```
                    Retrieval Quality
                    ↑
          High ┃  Standard RAG       Speculative RAG
               ┃  (Good enough)      (Need more accuracy+speed)
               ┃
          Low  ┃  CRAG               CRAG + Speculative RAG
               ┃  (Fix retrieval     (Need to fix both)
               ┃   first)
               ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━→
                    Low              High
                       Generation Complexity
```

## Implementation Guide

Below is a TypeScript implementation example demonstrating the Speculative RAG dual-model pattern.

### Core Type Definitions

```typescript
interface Document {
  id: string;
  content: string;
  score: number;        // Retrieval relevance score
  embedding: number[];  // For clustering (the paper precomputes these with a lightweight instruction-aware embedding model)
}

interface Draft {
  answer: string;
  rationale: string;
  sourceDocIds: string[];
  drafterId: number;
}

interface VerificationResult {
  selectedDraft: Draft;
  scores: Map<number, number>; // drafterId → score
  confidence: number;
}

interface SpeculativeRAGConfig {
  numDrafters: number;        // Number of Drafters (default 3-5)
  subsetSize: number;         // Documents per subset (default 2-3)
  drafterModel: string;       // Small model ID
  verifierModel: string;      // Large model ID
  maxDrafterTokens: number;   // Max Drafter output tokens
  maxVerifierTokens: number;  // Max Verifier output tokens
}
```

### Document Subset Sampling (Clustered, Not Random)

The paper's key move is **cluster first, then take one document per cluster**, so every subset spans multiple perspectives. Sampling within a single cluster measurably degrades results.

```typescript
/**
 * Build document subsets the way the paper does:
 * 1. Embed the retrieved documents and cluster them into k groups (k = subsetSize),
 *    each group representing one perspective
 * 2. Each subset draws one document per cluster → maximum perspective diversity,
 *    minimum redundancy
 * Do NOT simplify this to "randomly pick k documents": the paper's ablation shows
 * same-cluster sampling performs significantly worse.
 */
function sampleDocumentSubsets(
  documents: Document[],
  numSubsets: number,
  subsetSize: number,
): Document[][] {
  // kmeans() is your own implementation or any clustering library;
  // it takes doc.embedding and returns subsetSize clusters
  const clusters = kmeans(documents, subsetSize);
  const subsets: Document[][] = [];

  for (let i = 0; i < numSubsets; i++) {
    // Each subset: one document from each cluster, so different subsets
    // cover different documents
    const subset = clusters
      .map((cluster) => pickWithoutReplacement(cluster, i))
      .filter((doc): doc is Document => doc !== undefined);
    subsets.push(subset);
  }

  return subsets;
}

/** Round-robin pick of the i-th document from a cluster, wrapping when exhausted */
function pickWithoutReplacement(
  cluster: Document[],
  i: number,
): Document | undefined {
  if (cluster.length === 0) return undefined;
  return cluster[i % cluster.length];
}
```

(`kmeans` here is a pseudocode placeholder — the paper ships no reference implementation, so pick your own clustering method and distance metric, and measure.)

### RAG Drafter Implementation

```typescript
async function generateDraft(
  query: string,
  documents: Document[],
  drafterId: number,
  config: SpeculativeRAGConfig,
): Promise<Draft> {
  const docContext = documents
    .map((doc, i) => `[Document ${i + 1}] (ID: ${doc.id})\n${doc.content}`)
    .join('\n\n');

  const prompt = `You are a RAG specialist. Given the following documents, answer the query.
You MUST also provide your reasoning process (rationale).

Query: ${query}

Documents:
${docContext}

Respond in this exact format:
Answer: [Your answer based on the documents]
Rationale: [Step-by-step reasoning for how you arrived at this answer from the documents]`;

  const response = await callLLM({
    model: config.drafterModel,
    prompt,
    maxTokens: config.maxDrafterTokens,
    temperature: 0.7, // Slightly higher temperature for diversity
  });

  const { answer, rationale } = parseDraftResponse(response);

  return {
    answer,
    rationale,
    sourceDocIds: documents.map((d) => d.id),
    drafterId,
  };
}

function parseDraftResponse(
  response: string,
): { answer: string; rationale: string } {
  const answerMatch = response.match(/Answer:\s*([\s\S]*?)(?=Rationale:)/i);
  const rationaleMatch = response.match(/Rationale:\s*([\s\S]*)/i);

  return {
    answer: answerMatch?.[1]?.trim() ?? response,
    rationale: rationaleMatch?.[1]?.trim() ?? 'No rationale provided',
  };
}
```

### RAG Verifier Implementation

Note this is an **approximation**: the paper uses token conditional probabilities (ρ<sub>Draft</sub> × ρ<sub>Self-contain</sub> × ρ<sub>Self-reflect</sub>), while the code below prompts the model to grade itself so it can run on text-only APIs. If your inference stack exposes logprobs, following the paper will get you closer to the original results.

```typescript
async function verifyDrafts(
  query: string,
  drafts: Draft[],
  config: SpeculativeRAGConfig,
): Promise<VerificationResult> {
  const draftsContext = drafts
    .map(
      (draft, i) =>
        `[Draft ${i + 1}] (Drafter #${draft.drafterId})
Answer: ${draft.answer}
Rationale: ${draft.rationale}
Source Documents: ${draft.sourceDocIds.join(', ')}`,
    )
    .join('\n\n---\n\n');

  const prompt = `You are an expert answer verifier. Given a query and multiple draft answers,
evaluate each draft and select the best one.

Evaluation criteria:
1. Factual Accuracy: Is the answer factually correct?
2. Reasoning Quality: Is the rationale logical and complete?
3. Query Relevance: Does the answer directly address the query?
4. Self-Consistency: Are the answer and rationale consistent?

Query: ${query}

Drafts:
${draftsContext}

Respond in this exact format:
Selected: [draft number]
Confidence: [0.0-1.0]
Scores: [draft1_score, draft2_score, ...]
Justification: [Why you selected this draft]`;

  const response = await callLLM({
    model: config.verifierModel,
    prompt,
    maxTokens: config.maxVerifierTokens,
    temperature: 0.0, // Low temperature for verification to ensure consistency
  });

  return parseVerificationResponse(response, drafts);
}

function parseVerificationResponse(
  response: string,
  drafts: Draft[],
): VerificationResult {
  const selectedMatch = response.match(/Selected:\s*(\d+)/i);
  const confidenceMatch = response.match(/Confidence:\s*([\d.]+)/i);
  const scoresMatch = response.match(/Scores:\s*\[([\d.,\s]+)\]/i);

  const selectedIdx = (parseInt(selectedMatch?.[1] ?? '1') - 1);
  const confidence = parseFloat(confidenceMatch?.[1] ?? '0.5');
  const scoreValues = scoresMatch?.[1]?.split(',').map((s) => parseFloat(s.trim())) ?? [];

  const scores = new Map<number, number>();
  drafts.forEach((draft, i) => {
    scores.set(draft.drafterId, scoreValues[i] ?? 0);
  });

  return {
    selectedDraft: drafts[selectedIdx] ?? drafts[0],
    scores,
    confidence,
  };
}
```

### Complete Pipeline

```typescript
async function speculativeRAG(
  query: string,
  config: SpeculativeRAGConfig,
): Promise<{
  answer: string;
  confidence: number;
  selectedDrafterId: number;
  allDrafts: Draft[];
  verification: VerificationResult;
}> {
  // Step 1: Retrieve documents
  const documents = await retrieve(query);

  // Step 2: Create document subsets
  const subsets = sampleDocumentSubsets(
    documents,
    config.numDrafters,
    config.subsetSize,
  );

  // Step 3: Generate drafts in parallel (critical!)
  const draftPromises = subsets.map((subset, i) =>
    generateDraft(query, subset, i, config),
  );
  const drafts = await Promise.all(draftPromises);

  // Step 4: Large model verification
  const verification = await verifyDrafts(query, drafts, config);

  return {
    answer: verification.selectedDraft.answer,
    confidence: verification.confidence,
    selectedDrafterId: verification.selectedDraft.drafterId,
    allDrafts: drafts,
    verification,
  };
}
```

### Usage Example

```typescript
const config: SpeculativeRAGConfig = {
  numDrafters: 5,   // The paper's main setting: m=5
  subsetSize: 2,    // The paper's main setting: k=2
  // Always inject model IDs from the environment — hardcoded model names
  // get deprecated within months
  drafterModel: process.env.DRAFTER_MODEL!,
  verifierModel: process.env.VERIFIER_MODEL!,
  maxDrafterTokens: 512,
  maxVerifierTokens: 256,
};

const result = await speculativeRAG(
  'Which crag in Taiwan is best for beginner climbers?',
  config,
);

console.log(`Answer: ${result.answer}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Selected Drafter: #${result.selectedDrafterId}`);
console.log(`All drafts: ${result.allDrafts.length}`);
```

### Implementation Notes

**Drafter Model Selection**

No list of specific model names here — open small models turn over fast enough that any such list expires within months. The selection criteria are what stay stable:

- Small enough to run 5–10 instances concurrently (the paper uses a 7B; the appendix shows a 2B works too)
- Reliable at following an "Answer / Rationale" output format
- **Most importantly, fine-tunable**: the paper's results come from a distilled specialist Drafter, not from an off-the-shelf general small model. Skip the fine-tuning step and what you have is just a worse ensemble.

**Verifier Model Selection**

The paper uses an un-fine-tuned Mistral-7B or Mixtral-8x7B — "large" is relative to the Drafter, not "the biggest current flagship." The real hard requirement is that **your inference stack must return token logprobs**; otherwise the paper's probabilistic scoring is impossible and you fall back to the "ask the model to grade" approximation in the sample code above, with different quality and latency.

**Hyperparameter Tuning**

Start from the paper's settings, then measure:

- **Baseline**: retrieve top-10, `numDrafters: 5`, `subsetSize: 2`
- **Complex multi-hop questions**: the paper switches to top-15, `numDrafters: 10`, `subsetSize: 6` for MuSiQue
- **To raise accuracy**: add drafts first (parallel, so no added latency) rather than documents per draft (the paper's measurements are non-monotonic)

## Applicable Scenarios and Limitations

### Scenarios Where Speculative RAG Shines

**1. Latency-Sensitive Knowledge QA**

If your application has strict response time requirements (e.g., customer service chatbots, real-time search engines), Speculative RAG can significantly reduce latency without sacrificing accuracy.

**2. Large and Diverse Document Collections**

When the retriever returns many documents (10+) covering different aspects, Speculative RAG's subset distribution strategy is particularly effective. Different Drafters seeing different subsets makes it easier to capture different facets of information.

**3. Scenarios Requiring High Accuracy**

Medical claim verification (PubHealth is a true/false claim task, not QA), scientific reasoning (ARC-Challenge is multiple choice), and other scenarios requiring high accuracy. The diversity of multiple Drafters plus the Verifier's strict validation is more reliable than single-pass generation.

**4. GPU Resources Available for Parallel Inference**

Speculative RAG needs to run multiple Drafter instances simultaneously. If you have sufficient GPU resources (or use APIs that support batch inference), this architecture can leverage the parallelization advantage.

### Scenarios Where It's Not a Good Fit

**1. Simple Factual Queries**

For questions like "What is the capital of Taiwan?" standard RAG or even just letting the LLM answer directly works fine. Multi-Drafter verification for such questions is over-engineering and wastes resources.

**2. Limited GPU Resources**

If you have only one GPU or your API doesn't support batch/concurrent calls, the parallelization advantage of Drafters is lost. Running 4 Drafters + 1 Verifier sequentially would actually have higher latency than standard RAG.

**3. Consistently High-Quality Documents**

If your knowledge base is high quality and documents don't contradict each other, standard RAG's single-pass generation is usually good enough. Speculative RAG's diversity advantage is not significant in this case.

**4. Scenarios Requiring Real-Time Streaming**

Speculative RAG requires waiting for all Drafters to finish plus Verifier validation before outputting. If your application needs token-by-token streaming (e.g., ChatGPT-style progressive display), this architecture requires additional modifications.

One possible streaming approach: stream the highest-confidence Drafter's draft first while running the Verifier in the background. If the Verifier selects a different draft, swap the display. But this adds UX complexity.

**5. Very Few Documents**

If only 2–3 documents are retrieved, splitting them into multiple subsets makes little sense (each subset might have only 1 document). In this case, standard RAG processing directly is sufficient.

### Cost Considerations

Speculative RAG has a different cost structure from standard RAG:

| Item | Standard RAG | Speculative RAG |
|------|-------------|-----------------|
| Large model calls | 1 (long context) | 1 (short context) |
| Small model calls | 0 | K (parallel) |
| Large model input tokens | Many (all documents) | Few (only drafts) |
| Small model input tokens | 0 | K x subset document tokens |
| Total token cost | Medium | Medium-high |
| GPU requirement | Low | Medium-high |

In terms of token cost, Speculative RAG may be slightly higher (due to K additional Drafter calls), but the large model's input tokens are reduced (drafts vs. raw documents). If the price gap between large and small models is significant (e.g., GPT-4 vs. Mistral-7B), the total cost may break even or even be lower.

In terms of latency cost, Speculative RAG is clearly lower, which is highly valuable in latency-sensitive scenarios.

### A Failure Mode Found by Later Research

Here is an important gap the paper doesn't test but later work does: **when the question itself is ambiguous and has multiple simultaneously correct answers, Speculative RAG degrades.**

The 2025 paper *Retrieval-Augmented Generation with Conflicting Evidence* uses Speculative RAG as a baseline. On AmbigDocs — which requires presenting all valid answers for an ambiguous query — it reports:

| Backbone | Plain prompt concatenation | Speculative RAG |
|---|---|---|
| Llama3.3-70B-Instruct | 54.20 | 44.30 |
| Qwen2.5-72B-Instruct | 41.20 | 13.40 |
| GPT-4o-mini | 51.50 | 22.50 |

On the Qwen row, Speculative RAG falls to a third of the baseline. The reason isn't hard to see: the architecture's final step is **selecting one draft out of many**, which is a virtue when there is a single correct answer and a structural defect when multiple correct answers must be presented together. Distinct valid answers found by different Drafters from different document subsets get discarded at verification.

The same paper shows Speculative RAG is strong on FaithEval, which requires suppressing misinformation and has a single correct answer: 41.80 versus 27.30 for prompt concatenation on Llama3.3-70B, and 56.20 versus 38.50 on Qwen2.5-72B. That matches the reasoning exactly — **good for single-answer tasks, bad for multi-answer or ambiguous queries.**

Check your query distribution against that test before adopting it. If users routinely ask "what options are there" or "what are the different approaches," this architecture will systematically drop things.

## Future Outlook

Speculative RAG was published in July 2024 (arXiv:2407.08223) and accepted by ICLR in 2025. The architecture's core idea — **division of labor and parallelization** — is likely to be more broadly applied in other LLM pipelines.

Several possible directions:

1. **Adaptive Drafter count**: Dynamically adjust the number of Drafters based on question complexity. Use 2 for simple questions, 5 for complex ones.
2. **Intelligent subset allocation**: Instead of random document subset assignment, use strategic grouping based on document topic or type.
3. **Drafter specialization**: Different Drafters specialize in different question types (factual, reasoning, comparative), with routing based on question type.
4. **Combination with other RAG techniques**: CRAG + Speculative RAG, Graph RAG + Speculative RAG, and other combinations.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting (Wang et al., ICLR 2025)](https://arxiv.org/abs/2407.08223) — the source of every number in this article (note the correct arXiv ID is 2407.08223)
- [Retrieval-Augmented Generation with Conflicting Evidence (Wang et al., 2025)](https://arxiv.org/abs/2504.13079) — RAMDocs / MADAM-RAG; measures Speculative RAG's degradation on ambiguous queries
- [Fast Inference from Transformers via Speculative Decoding (Leviathan et al., ICML 2023)](https://arxiv.org/abs/2211.17192) — The original Speculative Decoding paper, conceptual source for Speculative RAG's dual-model design
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (Asai et al., ICLR 2024)](https://arxiv.org/abs/2310.11511) — Self-RAG comparison method
- [Corrective Retrieval Augmented Generation (Yan et al., AAAI 2024)](https://arxiv.org/abs/2401.15884) — CRAG comparison method, complementary to Speculative RAG
- [A Survey on Retrieval-Augmented Generation for Large Language Models (2024)](https://arxiv.org/abs/2312.10997) — Full landscape of RAG systems, covering the background of the Drafter-Verifier dual-model architecture
