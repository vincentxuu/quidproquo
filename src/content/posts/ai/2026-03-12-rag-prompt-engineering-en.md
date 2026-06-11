---
title: "RAG Prompt Engineering: How to Design System Prompts and Context"
date: 2026-03-12
type: guide
category: ai
tags: [rag, prompt-engineering, system-prompt, context, llm]
lang: en
tldr: "Search found the right documents, but the LLM's answers are still poor — often the problem lies in prompt design. System prompt structure, context formatting, and instruction placement all affect output quality."
description: "Prompt Engineering for RAG systems: structuring system prompts, formatting context, guiding LLM behavior with instructions, and common prompt issues with fixes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-prompt-engineering)

Your RAG search is working well, the context is accurate, but the LLM's answers are still underwhelming. The problem is usually in the prompt design — how you combine context and instructions to tell the LLM how to respond.

## Basic Structure of a System Prompt

A RAG system prompt typically has three parts:

```
1. Role definition: Who you are, what you can do
2. Behavioral guidelines: How to use context, how to handle uncertainty
3. Output format: Structure and tone of responses
```

```
You are the NobodyClimb climbing knowledge assistant, familiar with crags, routes, and climbing techniques in Taiwan and around the world.

[Behavioral Guidelines]
- Only answer based on the provided knowledge base; do not add information beyond the knowledge base
- If the knowledge base has no relevant data, say "No information available on this topic" — do not guess
- Difficulty information must be precise; avoid vague expressions (use "5.11a" instead of "moderate difficulty")
- Safety-related advice should be conservative; when uncertain, recommend consulting an experienced coach

[Output Format]
- Respond in Traditional Chinese
- When recommending routes, list name, difficulty, and type
- Use bullet points where appropriate, but don't over-structure
- Keep answers concise; avoid being verbose
```

The role definition helps the LLM understand its position; behavioral guidelines prevent hallucinations and off-topic responses; the output format ensures consistency.

## Context Formatting

How you format context affects how the LLM understands and cites information:

**Poor formatting**:

```
Context: Longdong North Wall 5.11a dense protection bolts clear fall zone Longdong South Wall 5.9 beginner route suitable for beginners Longdong Summit 5.12a technical route requires good footwork...
```

All documents are concatenated with no boundaries. The LLM struggles to distinguish content from different documents.

**Good formatting**:

```markdown
[Knowledge Base]

Document 1:
Route name: Some Route (Longdong North Wall)
Difficulty: 5.11a, sport climbing
Description: Dense protection bolts, clear fall zone, crux move after the third bolt...
---

Document 2:
Route name: Another Route (Longdong South Wall)
Difficulty: 5.9, sport climbing
Description: Beginner route, suitable for newcomers, evenly spaced bolts...
---
```

Clear document boundaries (`---`), structured fields (name, difficulty, description) — these enable the LLM to accurately cite information from specific documents.

## Document Relevance Hints

Adding relevance scores to context helps the LLM know which documents are more trustworthy:

```markdown
[Knowledge Base] (sorted by relevance)

Document 1 (relevance: high):
...

Document 2 (relevance: medium):
...

Document 3 (relevance: low, for reference):
...
```

The LLM will tend to cite "relevance: high" documents more heavily, reducing the influence of low-quality context.

## Instruction Placement

Research shows that LLMs pay more attention to instructions at the beginning and end of a prompt (the Lost in the Middle problem). Place important instructions at the start of the system prompt, or repeat them at the end of the user message:

```
[System Prompt — Beginning]
You are a climbing assistant. Only answer based on the provided knowledge base.

[Knowledge Base]
...(large volume of documents)...

[User Message — End]
Please answer based on the knowledge base above: {query}
If the knowledge base has no relevant information, say "No information available on this topic."
```

The critical "do not hallucinate" instruction appears at both the beginning and end, so it won't be diluted by the long context in the middle.

## Chain-of-Thought (CoT)

For complex queries, add CoT instructions to have the LLM show its reasoning process:

```
Before answering, please:
1. Identify the core requirement of the question
2. Confirm which relevant materials exist in the knowledge base
3. Organize the answer based on relevant materials

Then provide the final answer.
```

CoT makes the LLM's reasoning more structured, especially when comparing multiple options or making recommendations. The effect is more pronounced on smaller models (below 8B parameters).

## Common Issues and Fixes

**Issue: The answer includes too much content beyond the context**

Fix:
```
Strict constraint: Your answer must be 100% based on the provided knowledge base.
If the knowledge base lacks certain information, explicitly state that data is unavailable — do not supplement.
```

**Issue: Inconsistent answer formatting**

Fix: Provide a few-shot example:
```
Answer format example:
Q: What routes at Longdong are suitable for beginners?
A: Longdong has the following beginner-friendly routes:
1. **Some Route** - 5.9, sport climbing, dense protection bolts, suitable for first-time outdoor climbing
2. **Another Route** - 5.8, sport climbing, clear route, consistent difficulty

Please follow this format when answering.
```

**Issue: Imprecise difficulty information (saying "moderate difficulty" instead of 5.10b)**

Fix:
```
Difficulty must be expressed using precise climbing grade standards (e.g., 5.10b, V4).
Do not use vague terms like "moderate" or "fairly difficult."
```

**Issue: Answers are too long**

Fix:
```
Answer length limits:
- Simple questions (definitions, single facts): 1-2 sentences
- Recommendation questions: List 3-5 options with 1-2 sentence descriptions each
- Complex analysis: 200 words maximum
Avoid lengthy preambles and summaries.
```

## Prompt Version Management

Prompts are code — they need version control:

```typescript
const PROMPTS = {
  "v1.0": {
    system: "You are a climbing assistant...",
    contextTemplate: "Document {n}:\n{content}\n---",
  },
  "v1.1": {
    system: "You are a climbing assistant...(improved version)",
    contextTemplate: "Document {n} (relevance: {relevance}):\n{content}\n---",
  },
};

// Read the current version from ai_config
const currentVersion = config.prompt_version ?? "v1.1";
const prompt = PROMPTS[currentVersion];
```

Versioning makes A/B testing different prompts possible and makes rolling back to an older version easy.

## Key Takeaways

Prompt Engineering is undervalued in RAG systems. No matter how good your search is, if the LLM doesn't know how to use the context — or is confused by poor prompt structure — answer quality will suffer.

The most effective prompt improvements:
1. Clear role definition (let the LLM know its boundaries)
2. Well-formatted context (document boundaries, structured fields)
3. Explicit "say you're uncertain when uncertain" instructions (prevent hallucinations)
4. Output format examples (few-shot is the most direct approach)

Get these four points right, and answer quality improves noticeably — no complex techniques required.

---

## References

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903)
- [Lost in the Middle: How Language Models Use Long Contexts (2023)](https://arxiv.org/abs/2307.03172)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
