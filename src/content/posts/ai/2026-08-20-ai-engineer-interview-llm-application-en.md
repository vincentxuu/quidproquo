---
title: "LLM Application Design Interview Guide: From RAG to Agent Architecture"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, llm, rag, agent]
lang: en
type: deep-dive
description: "Breaking down the LLM application design interview — RAG pipeline, agent architecture, context engineering, guardrails, and evaluation."
tldr: "LLM Application Design is the hottest new interview topic in 2025-2026. Key focus areas: RAG pipeline chunking/retrieval/reranking design, agent tool-use and planning loops, context window management strategies, guardrails and safety design, and LLM application evaluation methods. Interviewers especially value whether you've hit real-world pitfalls."
series:
  name: "AI Engineer Interview Prep"
  order: 6
---

## Why This Is a New Interview Category

Two years ago, ML system design interviews tested recommendation systems and fraud detection. After 2025, more companies added a dedicated round for LLM application design — not testing how you train models, but how you assemble a production-ready system using LLM APIs. AI-native companies (Anthropic, OpenAI, Cohere) test this almost universally, and big tech AI teams are starting to include these questions too.

What makes this round distinctive is there's no standard answer. Interviewers want to hear what you've built, what pitfalls you've hit, and how you trade off between latency/cost/quality. If you can only speak in theory ("RAG is retrieve then generate") but can't articulate specific engineering decisions ("I used 512-token chunks with 100-token overlap because our technical documentation has strong inter-paragraph dependencies"), this round will be rough.

## RAG Pipeline Design

RAG is the most frequently tested LLM application topic. Interviewers typically ask "design a system that answers questions about internal company documents," then drill into details layer by layer.

### Chunking

You should be able to articulate the trade-offs of three mainstream strategies:

- **Fixed-length splitting** (e.g., 512 tokens): Simplest, works for uniformly structured documents. The problem is it breaks semantically complete paragraphs.
- **Semantic splitting** (by paragraph, section, or using embedding similarity to find breakpoints): Preserves semantic integrity, but produces uneven chunk sizes that can affect retrieval quality.
- **Recursive splitting** (split by major structure first, then split oversized chunks again): The most common practical compromise.

Bonus points: mentioning overlap design (typically 10-20%), metadata preservation (each chunk carries source document name, page number, section heading), and why chunk size should match the embedding model's training length.

### Embedding Selection

Interviewers may ask how you choose an embedding model. Core considerations:

- **Dimensionality vs. cost**: Higher-dimensional embeddings (e.g., 1536d) typically provide better retrieval quality but cost more to store and compute.
- **Multilingual capability**: If data includes Chinese, you need a model with multilingual support.
- **Domain adaptation**: General embeddings may perform poorly in specific domains (legal, medical) — consider whether to fine-tune.

### Retrieval + Reranking

Two-stage retrieval is a common interview topic: first use vector search (ANN) to quickly recall top-k (e.g., 50) from hundreds of thousands of documents, then use a cross-encoder reranker to precisely rank the final top-n (e.g., 5). Explain clearly why two stages are needed — vector search is fast but coarse (only looks at embedding similarity), cross-encoder is slow but precise (examines query-document interaction).

Advanced topic: hybrid search (combining vector search and BM25 keyword search, merging results with reciprocal rank fusion). Interviewers love hearing you explain when pure semantic search fails (e.g., searching for specific error codes or product model numbers).

## Agent Architecture

Agent questions typically ask you to "design a system that automatically completes X," such as auto-writing tests, automated customer support, or automated data analysis.

### Tool-use

The core of agents is letting the LLM decide when to call which tools. In interviews, be prepared to explain:

- **Tool definitions**: How to design tool schemas (name, description, parameters) so the LLM correctly understands when to use them. Poor descriptions lead to incorrect tool calls.
- **Tool count trade-offs**: More tools means higher probability of wrong selection. In practice, beyond 15-20 tools you need tool routing (classify first, then select from a subset).
- **Error handling**: Retry strategies and fallback mechanisms for failed tool calls.

### Planning Loop

Interviewers will probe how agents plan multi-step tasks. Two mainstream patterns:

- **ReAct** (Reasoning + Acting): The LLM alternates between reasoning and acting, deciding each step after seeing the previous result. Simple and reliable, but high token consumption.
- **Plan-then-execute**: The LLM generates a complete plan first, then executes sequentially. More efficient but the plan may become invalid during execution, requiring a replan mechanism.

### Memory Management

Long-running agents need memory management. Being able to explain the difference between working memory (current conversation context) and long-term memory (vectorized historical interactions), plus compression strategies when the context window fills up (summary, sliding window, importance-ranked eviction), is sufficient.

## Context Engineering

Context engineering is a concept that emerged in 2025-2026, referring to how to carefully assemble the context sent to an LLM. Interviews test this because it directly impacts application quality.

Key points include:

- **Prompt structure**: System prompt holds instructions and role definitions, user prompt holds specific requests, assistant prefill guides format. The division of labor must be clear.
- **Context window budget management**: Total tokens are limited — you need to allocate among system prompt, few-shot examples, retrieved documents, and conversation history. Being able to state a specific allocation plan (e.g., "system prompt 10%, retrieved docs 50%, history 30%, 10% reserved for output") is a strong plus.
- **Lost in the middle problem**: LLMs pay less attention to the middle of context. Place important information at the beginning and end, or use explicit XML/Markdown tags for structure.

## Guardrails & Safety

Interviewers increasingly ask about safety design, especially at AI-native companies.

- **Input validation**: Detecting prompt injection (users attempting to override the system prompt), PII filtering (personal data shouldn't enter the LLM). Mention layered defense — first use rules to filter obvious attack patterns, then use a lightweight classifier for more subtle injections.
- **Output validation**: Content filtering (harmful content detection), format validation (confirming JSON/structured output is correct), fact-checking (cross-referencing LLM answers with retrieval results).
- **Hallucination mitigation**: Three practical approaches — constrain the model to answer only based on provided context (grounded generation), require citation of sources, and run a faithfulness check after generation.

## Evaluation

LLM application evaluation is a commonly tested challenge because there are no clear metrics like traditional ML.

- **Offline evaluation**: Test with a golden dataset (human-annotated Q&A pairs). Measure retrieval quality (recall@k, MRR) and generation quality (faithfulness, relevance, completeness). LLM-as-judge (using another LLM to score) is increasingly common, but watch for position bias and self-preference bias.
- **Online evaluation**: A/B testing on user behavior (thumbs up/down, follow-up question rate, task completion rate). Distinguish between "the user thinks it's good" and "the answer is objectively correct."
- **Continuous monitoring**: Track retrieval hit rate, latency, token cost, and user-reported hallucination rate. Set alert thresholds to trigger warnings when quality drops.

## Common Question Types and Interview Strategy

The three most common question types:

1. **"Design a RAG system"**: Cover everything from chunking to serving, focusing on how you make decisions at each layer.
2. **"Design a customer support agent"**: Tests tool-use design, conversation management, and escalation logic.
3. **"Your LLM application's quality dropped after launch — how do you debug?"**: Tests your evaluation and monitoring thinking.

Interview strategy: Spend two minutes confirming requirements (who are the users, what's the QPS, latency budget, cost of errors), then start from the data flow (how data comes in → processing → sent to LLM → output validation → monitoring). Don't jump into "which model should I use" — interviewers want to see your systems thinking, not your familiarity with a specific API.

## Practice Question

### Question

"Design a RAG-based customer support system that handles multiple languages and product lines, and can automatically escalate to a human agent when the answer is uncertain."

**Source**: Anthropic interview (adapted)　**Difficulty**: Advanced　**Round**: onsite system design

### Approach

1. **Clarify the problem**: How many languages? Do product line knowledge bases need isolation or sharing? What's the QPS? What defines "uncertain" — low confidence score, or detected hallucination?
2. **Build the framework**: Start from data flow — document ingestion → chunking → embedding → retrieval → reranking → LLM generation → output validation → escalation trigger.
3. **Go deep on the core**: The key trade-off is **precision vs recall of escalation** — escalating too easily overwhelms human agents, too rarely lets incorrect answers through. Design a multi-signal confidence system here.
4. **Wrap up**: Mention how to evaluate (golden set + LLM-as-judge + human agent feedback loop), and what to monitor (escalation rate, resolution rate, CSAT).

### Sample Answer (How to say it in an interview)

> **Architecture overview.** I'd design a three-layer pipeline. The first layer is retrieval: each product line has an independent vector index (avoiding cross-product contamination), using hybrid search (BM25 + dense embedding) for initial retrieval, with a reranker for precision ranking. Multilingual handling goes on the query side — using a multilingual embedding model (like BGE-M3), letting users query in any language and hit English or Chinese source documents without translation.
>
> **Generation and validation.** The second layer is LLM generation, with a system prompt including product line context and answer guidelines (e.g., cannot fabricate refund policies). The third layer is output validation — I'd use three signals to decide whether to escalate: retrieval confidence (top-k similarity scores below threshold), LLM self-assessment (prompt requires the model to label confidence level), and guardrail check (hallucination that deviates from retrieved context). Three signals use weighted voting; any two flags trigger escalation.
>
> **Escalation and monitoring.** Escalation isn't simply "transfer to human" — pass the retrieval context, LLM generation process, and confidence signals to the human agent so they don't start from scratch. Monitoring focuses on escalation rate (target < 15%) and false negative rate (proportion sent out but flagged as errors by users). After launch, use A/B testing to tune confidence thresholds.

### Self-Check Checklist

| Checkpoint | Mentioned? |
|-----------|-----------|
| Product line knowledge base isolation strategy | |
| Multilingual handling approach (query-side vs document-side) | |
| Retrieval + reranking two-stage design | |
| Multi-signal escalation decision mechanism | |
| Passing context to human agents during escalation | |
| Monitoring metrics (escalation rate, false negative rate) | |
| Bonus: A/B testing to tune confidence thresholds | |

## References

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/agent-guidelines) — Official guidance on agent tool-use design, planning loops, and error handling
- [LangChain — RAG from Scratch](https://github.com/langchain-ai/rag-from-scratch) — RAG pipeline implementation tutorial from chunking to reranking, covering hybrid search and context engineering
- [Chip Huyen — Building A Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) — Full landscape of LLM application system design, covering evaluation, guardrails, and production monitoring
- [Anthropic — Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) — Official best practices for context engineering and prompt structure in LLM application design interviews
- [RAGAS — RAG Assessment Framework](https://docs.ragas.io/) — Open-source RAG pipeline evaluation framework covering faithfulness and relevancy metrics commonly asked in LLM application interviews
