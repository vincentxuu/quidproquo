---
title: "Multimodal RAG: Bringing Images into the Knowledge Base"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, multimodal, vision, image-embedding, clip]
lang: en
tldr: "Climbing routes carry a ton of visual information (topos, wall photos) that text-only RAG misses entirely. Multimodal RAG makes images searchable and understandable."
description: "A guide to multimodal RAG design: image embeddings with CLIP, mixed text+image indexing, caption generation strategies, and their potential in a climbing community context."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 10
---

> 🌏 [中文版](/posts/ai/2026-03-12-multimodal-rag)

Climbing communities are rich with visual information: route topos, wall photos, screenshots from technique videos. These images carry things that text descriptions struggle to fully convey — the shape of a wall, the line a route takes, the exact body position at a crux move.

Standard RAG only processes text, so all of that visual content gets left out. Ask the system "what's the crux move on Longdong 5.11a?" and it can only answer from written descriptions — but what would actually help is that diagram showing where to put your hand.

Multimodal RAG brings images into the knowledge base, so queries can search across both text and visual content at the same time.

## Image Embeddings: CLIP-Style Dual Encoders

[CLIP](https://arxiv.org/abs/2103.00020) (Contrastive Language-Image Pre-Training) is the prototype for this approach. It's trained so that a text description and its corresponding image end up close together in the same vector space:

```
"A climber doing a sidepull on an overhang" → [0.2, -0.5, 0.8, ...]
[the corresponding image]                   → [0.21, -0.48, 0.79, ...]

cosine similarity between the two vectors is high
```

This means you can **search for images using a text query**, or **find visually similar images using an image query**.

Worth noting: "CLIP" today is more a name for a whole family than a specific model you should reach for. The original OpenAI CLIP was trained predominantly on English, and its representation of other languages (Chinese included) is noticeably weaker; later models such as [SigLIP 2](https://arxiv.org/abs/2502.14786) explicitly target multilinguality plus better localization and dense features to close that gap. **The question to ask isn't "should I use CLIP" — it's: does this model's training cover the language my users query in, and can my vector database hold its dimensionality?** For specific model names, check the current catalog of whatever inference platform you're deploying on; this article deliberately doesn't pin versions.

## Three Indexing Strategies

**Strategy 1: Image → Caption → Text Embedding**

Use an LLM with vision input to automatically generate a detailed caption for each image, then index it with a standard text embedding:

```typescript
async function indexImage(imageUrl: string, env: Env): Promise<void> {
  // Generate a caption with a vision-capable LLM
  const description = await describeImage(imageUrl, env);
  // Caption: "Topo of Longdong north wall showing a 5.11a route,
  //           trending up and right, with a key sidepull move
  //           at the third bolt..."

  // Index the caption text with a standard embedding
  const embedding = await embed(description, env);
  await vectorize.upsert([{ id: imageUrl, values: embedding, metadata: { type: 'image', url: imageUrl } }]);
}
```

**Pros**: No multimodal embedding model needed — your existing text embedding works. And if the captions are written in your users' language, hit rates often beat a vision model with weak multilingual coverage.
**Cons**: Caption quality depends on the generating model, generation cost is high, and **the caption freezes what is findable** — any visual detail that didn't make it into the text is permanently unsearchable.

**Strategy 2: Image → Multimodal Embedding**

Embed images directly, placing them in the same vector space as the text side of the same model:

```typescript
// Indexing: image → multimodal embedding
const imageEmbedding = await imageEmbed(imageBytes, env);
await vectorize.upsert([{ id: imageId, values: imageEmbedding }]);

// Search: text query → the same model's text tower → search images
const queryEmbedding = await textEmbed(query, env);
const results = await vectorize.query(queryEmbedding);
// Results can include both text documents and images
```

**Pros**: Visual features are encoded directly in the vector, instead of being filtered through a caption.
**Cons**: **The text and image vectors must come from the two towers of the same model** to be comparable — mixing CLIP image vectors and BGE text vectors in one index and querying across them is the classic mistake here. Multilingual coverage is also on you to verify (see above).

**Strategy 3: Hybrid (Caption + Multimodal Embedding)**

Store both types of embeddings, run parallel searches at query time, and merge with RRF:

```
Image index:
  Caption embedding      (for text-query hits, same space as text documents)
  Multimodal embedding   (for visual similarity, separate space / separate index)

Search:
  Text query → caption embedding search
             + multimodal text-tower search
  → RRF fusion
```

In practice this is the most robust option; the cost is keeping two indexes consistent.

## Aside: For Document-Like Images, Index the Whole Page

If your "images" are really scanned pages, slides, or charts — anything where **the layout is full of text** — there's a fourth path: skip OCR and hand the whole page image to a vision model for late-interaction retrieval. [ColPali](https://arxiv.org/abs/2407.01449) is the most-cited version of this approach: a vision-language model splits the page into patches, produces a multi-vector representation, and queries match via late interaction.

The upside is not maintaining an OCR + layout-analysis preprocessing chain. The downside is that each page stores many vectors instead of one, so storage and query cost jump an order of magnitude, and your vector database has to support multi-vector / late interaction. Climbing topos — images with annotated text baked into them — actually fit this setting well and are worth evaluating.

## Using Images in Responses

Once you've retrieved relevant images, there are two ways to use them:

**Direct reference**: Include image links or thumbnails in the response and let the user look for themselves:

```
Answer: The crux of Longdong 5.11a comes right after the third bolt — you need a sidepull...

[Related images]
📷 Route topo → [link]
📷 Crux move diagram → [link]
```

**Feed to a vision LLM**: Pass the retrieved images along with the query to a vision-capable model so it can extract details from the visuals and weave them into the answer. Message formats differ per provider (URL vs base64 vs file ID, and how the content parts are wrapped), so this is deliberately conceptual — check the API docs of whichever provider you use:

```
// Conceptual, not runnable: content-part shapes differ per provider
generate({
  messages: [
    { role: "user", content: [
        text part:  the user's question,
        image part: the retrieved image (URL / base64 / file reference),
    ]},
  ],
})
```

The second approach is more powerful but requires vision support and costs more — and be aware that **retrieving the wrong image is worse than retrieving none**: the model will confidently describe an irrelevant wall.

## Concrete Applications in Climbing

The highest-value multimodal use cases for a climbing context:

**Route topo search**: A user uploads a photo of a wall; the system finds the matching topo and explains the route line.

**Movement questions**: "How do I do this move?" + an uploaded photo; the system finds explanations or videos of similar movements.

**Crag identification**: Upload a wall photo; the system identifies which crag and route it is (given a sufficiently large image database).

## Engineering Reality

Current limitations worth keeping in mind:

- **Your platform may not offer an image embedding model at all.** On Cloudflare, the [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/) carries text embeddings, image classification, and image-to-text (vision-language) models — but **no CLIP-style dual-encoder embedding model that would give you a shared image/text vector space**. On a pure Workers architecture, Strategy 2 therefore requires an external inference service, and Strategy 1 (vision model generates captions, standard text embedding indexes them) is the path of least resistance.
- **Vector dimension caps constrain model choice.** Vectorize tops out at 1536 dimensions (float32) — check this before settling on an image embedding model.
- **Caption generation with a vision model costs much more than text-only LLM calls**, and it's an O(number of images) one-time bulk cost.
- **Image indexing means keeping storage (R2) and embeddings consistent**: when an image is deleted or replaced, the vector has to follow, or you'll retrieve images that no longer exist.

For a climbing community, multimodal RAG is genuinely valuable — but the engineering complexity is real. It makes sense to stabilize your text RAG first, then evaluate whether to expand to multimodal.

## The Bottom Line

Multimodal RAG expands the knowledge boundary of a RAG system beyond text to include visual knowledge. For a visually rich domain like climbing, that expansion has real value. The technology is there; the main constraints are engineering cost and whether your platform actually offers a suitable model.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Learning Transferable Visual Models From Natural Language Supervision (CLIP, 2021)](https://arxiv.org/abs/2103.00020)
- [SigLIP 2: Multilingual Vision-Language Encoders with Improved Semantic Understanding, Localization, and Dense Features (2025)](https://arxiv.org/abs/2502.14786)
- [ColPali: Efficient Document Retrieval with Vision Language Models (2024)](https://arxiv.org/abs/2407.01449)
- [MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text (2022)](https://arxiv.org/abs/2210.02928)
- [A Survey of Multimodal Retrieval-Augmented Generation (2025)](https://arxiv.org/abs/2504.08748)
- [Scaling Beyond Context: A Survey of Multimodal RAG for Document Understanding (2026)](https://arxiv.org/abs/2510.15253)
- [Cloudflare Workers AI - Models](https://developers.cloudflare.com/workers-ai/models/)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
