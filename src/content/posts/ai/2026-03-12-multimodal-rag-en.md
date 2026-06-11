---
title: "Multimodal RAG: Bringing Images into the Knowledge Base"
date: 2026-03-12
type: guide
category: ai
tags: [rag, multimodal, vision, image-embedding, clip]
lang: en
tldr: "Climbing routes carry a ton of visual information (topos, wall photos) that text-only RAG misses entirely. Multimodal RAG makes images searchable and understandable."
description: "A guide to multimodal RAG design: image embeddings with CLIP, mixed text+image indexing, caption generation strategies, and their potential in a climbing community context."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-multimodal-rag)

Climbing communities are rich with visual information: route topos, wall photos, screenshots from technique videos. These images carry things that text descriptions struggle to fully convey — the shape of a wall, the line a route takes, the exact body position at a crux move.

Standard RAG only processes text, so all of that visual content gets left out. Ask the system "what's the crux move on Longdong 5.11a?" and it can only answer from written descriptions — but what would actually help is that diagram showing where to put your hand.

Multimodal RAG brings images into the knowledge base, so queries can search across both text and visual content at the same time.

## Image Embeddings: The CLIP Model

CLIP (Contrastive Language-Image Pre-Training, OpenAI) is the backbone of multimodal RAG. It's trained so that a text description and its corresponding image end up close together in the same vector space:

```
"A climber doing a sidepull on an overhang" → [0.2, -0.5, 0.8, ...]
[the corresponding image]                   → [0.21, -0.48, 0.79, ...]

cosine similarity between the two vectors is high
```

This means you can **search for images using a text query**, or **find visually similar images using an image query**.

## Three Indexing Strategies

**Strategy 1: Image → Caption → Text Embedding**

Use a Vision LLM (GPT-4V, LLaVA) to automatically generate a detailed caption for each image, then index it with a standard text embedding:

```typescript
async function indexImage(imageUrl: string, env: Env): Promise<void> {
  // Generate a caption with a Vision LLM
  const description = await describeImage(imageUrl, env);
  // Caption: "Topo of Longdong north wall showing a 5.11a route,
  //           trending up and right, with a key sidepull move
  //           at the third bolt..."

  // Index the caption text with a standard embedding
  const embedding = await embed(description, env);
  await vectorize.upsert([{ id: imageUrl, values: embedding, metadata: { type: 'image', url: imageUrl } }]);
}
```

**Pros**: No multimodal embedding model needed — your existing text embedding works.
**Cons**: Caption quality depends on the Vision LLM; generation cost is high; visual details can slip through the cracks.

**Strategy 2: Image → Multimodal Embedding (CLIP)**

Embed images directly with CLIP, placing them in the same vector space as your text embeddings:

```typescript
// Indexing: image → CLIP embedding
const imageEmbedding = await clipEmbed(imageBytes, env);
await vectorize.upsert([{ id: imageId, values: imageEmbedding }]);

// Search: text query → CLIP text embedding → search images
const queryEmbedding = await clipTextEmbed(query, env);
const results = await vectorize.query(queryEmbedding);
// Results can include both text documents and images
```

**Pros**: Visual features are encoded directly in the vector.
**Cons**: Requires a CLIP model; CLIP's Chinese language support is weaker than English; text and image embeddings must share the same vector space to be searched together.

**Strategy 3: Hybrid (Caption + CLIP Embedding)**

Store both types of embeddings, run parallel searches at query time, and merge with RRF:

```
Image index:
  Caption embedding     (for text-query hits)
  CLIP image embedding  (for visual similarity queries)

Search:
  Text query → caption embedding search
             + CLIP text embedding search
  → RRF fusion
```

## Using Images in Responses

Once you've retrieved relevant images, there are two ways to use them:

**Direct reference**: Include image links or thumbnails in the response and let the user look for themselves:

```
Answer: The crux of Longdong 5.11a comes right after the third bolt — you need a sidepull...

[Related images]
📷 Route topo → [link]
📷 Crux move diagram → [link]
```

**Feed to a Vision LLM**: Pass the retrieved images along with the query to a Vision LLM so it can extract relevant details from the visuals and weave them into the answer:

```typescript
const response = await visionLlm.generate({
  messages: [
    { role: "user", content: [
      { type: "text", text: query },
      { type: "image_url", url: relevantImage.url },
    ]},
  ],
});
```

The second approach is more powerful but requires Vision LLM support and comes at a higher cost.

## Concrete Applications in Climbing

The highest-value multimodal use cases for a climbing context:

**Route topo search**: A user uploads a photo of a wall; the system finds the matching topo and explains the route line.

**Movement questions**: "How do I do this move?" + an uploaded photo; the system finds explanations or videos of similar movements.

**Crag identification**: Upload a wall photo; the system identifies which crag and route it is (given a sufficiently large image database).

## Engineering Reality

Current limitations worth keeping in mind:
- Cloudflare Workers AI provides a CLIP model (`@cf/openai/clip-vit-base-patch32`), but its representation of non-English text (including Chinese) is noticeably weaker
- Vision LLM caption generation costs significantly more than text-only LLM calls
- Image indexing requires managing consistency between image storage (R2) and embeddings

For a climbing community, multimodal RAG is genuinely valuable — but the engineering complexity is real. It makes sense to stabilize your text RAG first, then evaluate whether to expand to multimodal.

## The Bottom Line

Multimodal RAG expands the knowledge boundary of a RAG system beyond text to include visual knowledge. For a visually rich domain like climbing, that expansion has real value. The technology is there (CLIP + Vision LLM); engineering cost is the main constraint.

---

## References

- [MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text (2022)](https://arxiv.org/abs/2210.02928)
- [A Survey of Multimodal Retrieval-Augmented Generation (2025)](https://arxiv.org/abs/2504.08748)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
