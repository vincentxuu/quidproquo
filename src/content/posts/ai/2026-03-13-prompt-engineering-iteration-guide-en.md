---
title: "Prompt Engineering in Practice: Iteration Methodology, Common Mistakes, and Few-shot Optimization"
date: 2026-03-13
type: guide
category: ai
tags: [prompt-engineering, few-shot, chain-of-thought, iteration, llm]
lang: en
tldr: "Good prompts aren't written in one go — they're iterated into existence. Start with the simplest prompt, test with real cases, classify error types, and make targeted fixes. This article covers the three-part System Prompt structure, reasoning framework selection, few-shot optimization, token budget management, and six common mistakes."
description: "A systematic iteration methodology for Prompt Engineering: the three-part System Prompt structure (Role/Guidelines/Format), CoT/Few-shot/ReAct reasoning framework selection, few-shot example optimization strategies, token budget management, a six-step iteration method, and common mistakes with fixes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-13-prompt-engineering-iteration-guide)

Most people write prompts like this: think of an instruction → feed it to the model → the result is wrong → rephrase it → keep guessing back and forth.

That's not engineering — that's trial and error.

The core of prompt engineering isn't "how to write the perfect sentence." It's **how to build a predictable, iterable, maintainable prompt system**. This article distills the most important practical lessons into an actionable methodology.

---

## 1. The Three-Part System Prompt Structure

A well-structured system prompt should contain three sections: **Role**, **Guidelines**, and **Format**.

```
┌─────────────────────────────────────┐
│           System Prompt             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Role                         │  │
│  │  Who you are, expertise, tone │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Guidelines                   │  │
│  │  Behavioral rules, boundaries │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Format                       │  │
│  │  Output structure, examples   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 1. Role — Specific > Abstract

The core principle for Role: **the more specific, the better**. The model's understanding of its role directly affects the quality and consistency of its output.

**Bad example:**

```
You are an AI assistant.
```

This says essentially nothing. "AI assistant" is the vaguest role description in the world — the model has no idea what level of expertise, tone, or depth to use.

**Good example:**

```
You are a PostgreSQL DBA with 10 years of experience, specializing in
performance tuning and query optimization. You prefer explaining problems
with concrete data and EXPLAIN ANALYZE output rather than speaking in
generalities. When a user's question involves architectural decisions,
you always ask about data volume and read/write ratios before giving advice.
```

What's the difference? The second version implies:

- **Domain expertise**: PostgreSQL, not MySQL, not MongoDB
- **Working style**: Data-driven, not theoretical hand-waving
- **Interaction mode**: Asks follow-up questions, doesn't jump straight to answers
- **Experience level**: Senior, so answers have depth

**More comparisons:**

| Bad | Good |
|-----|------|
| You are a customer service agent | You are a Tier-2 technical support engineer for a SaaS product, handling billing and API integration issues |
| You are a writing assistant | You are a tech media editor whose style resembles Ben Thompson's Stratechery — analytical rather than news-reporting |
| You are a programming expert | You are a senior Rust engineer who favors zero-cost abstractions and proactively flags memory safety issues |

### 2. Guidelines — Positive > Negative, Use Lists

Guidelines define the model's behavioral boundaries. Two principles:

**Principle 1: Tell the model what TO do, not what NOT to do.**

Both human brains and LLMs share the same trait — negative instructions are far less effective than positive ones.

**Bad example:**

```
Don't use overly technical jargon.
Don't answer questions outside your scope.
Don't make up uncertain information.
```

**Good example:**

```
- Explain technical concepts in language a middle schooler could understand
- When a question is outside the scope of PostgreSQL, state that it's outside
  your area of expertise and suggest the user consult a relevant specialist
- For uncertain information, explicitly note "I'm not sure — I recommend
  checking the official documentation"
```

The first version tells the model three things it "can't do," but the model doesn't know what it should do instead. The second version provides a **specific alternative behavior** for each rule.

**Principle 2: Use bulleted lists, not long paragraphs.**

```
# Bad: a wall of text
When answering questions you should use Traditional Chinese and maintain
a professional but friendly tone, and if you're not sure about the answer
you should say so, also every answer should first confirm you understood
the user's question before you start answering...

# Good: a list
## Guidelines
- Answer in Traditional Chinese
- Tone: professional but friendly
- Explicitly flag uncertain information
- Confirm your understanding of the question in one sentence before answering
- Attach a reason to every recommendation
```

LLMs follow structured formats noticeably better than free-form text. Lists have another advantage: you can add, remove, or adjust items individually without rewriting the entire paragraph.

### 3. Format — Structure + Examples

The Format section defines the output structure. If you don't define the format, the model will decide on its own — and it may choose differently each time.

**Bad example:**

```
Answer in JSON format.
```

**Good example:**

```
Answer in the following JSON format with no other text:

{
  "diagnosis": "One-sentence description of the root cause",
  "severity": "low | medium | high | critical",
  "suggestion": "Specific remediation steps",
  "sql_example": "Fixed SQL example (if applicable, otherwise null)"
}
```

Providing a complete schema with descriptions for each field dramatically improves output consistency. If your downstream system needs to parse this JSON, inconsistent formatting will break your pipeline.

**Advanced technique: Use XML tags to separate sections**

```
Please output in the following structure:

<analysis>
Problem analysis, 2-3 sentences
</analysis>

<recommendation>
Recommended action plan, as a numbered list
</recommendation>

<code>
Relevant code example
</code>
```

XML tags are semantically unambiguous — both the model and your code can clearly distinguish different sections. Anthropic's official documentation also recommends using XML tags to organize prompts for Claude.

---

## 2. Context Formatting Principles

The system prompt defines the model's behavior, but context is the basis for its decisions. Context quality directly determines answer quality.

### Semantic Clarity > Raw Concatenation

**Bad approach: concatenating a bunch of text together**

```
Here is the relevant information:
PostgreSQL's VACUUM mechanism reclaims space occupied by deleted or updated rows.
In high-write scenarios, the default autovacuum settings are usually insufficient.
It's recommended to adjust autovacuum_vacuum_cost_delay and
autovacuum_vacuum_cost_limit. Additionally, the n_dead_tup field in
pg_stat_user_tables can be used to monitor dead tuple counts.
According to a 2024 Percona article, for large tables it's recommended to set
autovacuum_vacuum_scale_factor to 0.01 instead of the default 0.2.
```

When the model receives this text, it doesn't know: Where did this information come from? Which parts are more reliable? How current is it?

**Good approach: label sources and relevance**

```
<context>
  <source name="PostgreSQL 16 Official Docs" relevance="high" date="2024-09">
    VACUUM reclaims space occupied by deleted/updated rows.
    autovacuum-related parameters:
    - autovacuum_vacuum_cost_delay (default 2ms)
    - autovacuum_vacuum_cost_limit (default 200)
    - autovacuum_vacuum_scale_factor (default 0.2)
  </source>

  <source name="Percona Blog" relevance="medium" date="2024-03">
    For large tables (>10GB), it's recommended to set
    autovacuum_vacuum_scale_factor to 0.01 to avoid excessive
    dead tuple accumulation before vacuum triggers.
  </source>

  <source name="pg_stat_user_tables" relevance="high" type="live_data">
    Target table orders n_dead_tup: 1,284,567
    last_autovacuum: 2024-09-12 03:22:15
  </source>
</context>
```

Each data source is labeled with its name, reliability, and date. The model can:
- Prioritize `relevance="high"` sources
- Recognize that live data is real-time while blog articles may be outdated
- Cite specific sources in its response

### Token Budget: Reserve 30% for Generation

A common mistake is stuffing the context window full and then complaining that the model's response is too short or quality has degraded.

```
Context Window Allocation Principle:

┌─────────────────────────────────────┐
│  System Prompt      ~5-10%          │
│  Context/RAG        ~50-60%         │
│  Conversation History ~5-10%        │
│  ────────────────────────────       │
│  Reserved for Generation ~30%       │
└─────────────────────────────────────┘
```

If your context window is 128K tokens, use at most ~90K for context, leaving ~38K for the model to generate. If you stuff in 120K of context, the model only has 8K of space to respond — it will either truncate or quality will drop significantly.

### Primacy Effect: Put the Most Important Content First

LLMs do not distribute attention evenly across different positions in the context. Research shows that LLMs have a clear **primacy bias** — they remember information at the beginning most clearly. (There is also a recency effect, but it's less stable than primacy.)

**Practical recommendations:**

1. Put the most important context at the beginning
2. Put the most recent conversation at the end (leveraging recency effect)
3. Put relatively less critical material in the middle

```
Ordering strategy:

[Most important document]    ← Model pays most attention here
[Second most important]
[Background material]
[Historical context]
...
[Most recent user message]   ← Model also pays attention here
```

This is the so-called **Lost in the Middle** problem — information in the middle is most likely to be overlooked. If your RAG pipeline places the most relevant results in the middle, the effect will be much worse than placing them at the beginning.

---

## 3. Confidence Mechanism: Teaching LLMs to Say "I Don't Know"

One of the most dangerous behaviors of LLMs is **confidently making things up**. They won't say "I don't know" — unless you explicitly teach them to.

### Why Do LLMs Hallucinate?

An LLM is a next-token predictor. Its objective is to generate the "most probable next token," not the "most correct next token." When it doesn't know the answer, it still generates plausible-sounding text — because that's the statistically most likely continuation.

### Confidence Mechanism Prompt Template

```
## Response Guidelines

Before answering each question, internally assess your confidence level:

1. **High confidence**: You're certain the answer is correct and can cite
   specific sources or principles
   → Answer directly

2. **Medium confidence**: You generally know the direction, but details
   might not be precise
   → Answer with: "Based on my understanding, [answer]. I recommend
     checking [specific source] to confirm the details."

3. **Low confidence**: You're unsure, or this is outside your training data
   → Answer: "I'm not certain about this. Here's what I do know:
     [related but confirmed information]. I recommend consulting
     [suggested resource]."

4. **Zero confidence**: You have no idea
   → Answer: "I don't know the answer to this question and cannot provide
     reliable information. I recommend consulting [domain expert/official docs]."

Never fabricate specific numbers, dates, version numbers, or API names.
If you can't remember the exact value, say "I'm not sure of the exact value."
```

### Advanced: Structured Confidence Output

If your system needs to programmatically process confidence levels, you can require the model to output structured confidence markers:

```
At the end of every response, append:

<confidence>
  <level>high | medium | low | none</level>
  <reasoning>Why you assigned this confidence level</reasoning>
  <sources>Sources you referenced (if any)</sources>
</confidence>
```

This lets your downstream system decide based on confidence level whether human review is needed, whether to add a disclaimer, or whether to trigger additional RAG retrieval.

### Practical Effect

Without a confidence mechanism:

```
User: What are the new VACUUM improvements in PostgreSQL 17?
Model: PostgreSQL 17 introduced incremental VACUUM, parallel index cleanup,
       and the new vacuum_buffer_usage_limit parameter...
       (may contain fabricated features)
```

With a confidence mechanism:

```
User: What are the new VACUUM improvements in PostgreSQL 17?
Model: I'm not entirely sure about the specific VACUUM improvements in
       PostgreSQL 17, as my training data may not include the latest
       release notes.

       What I can confirm is that PostgreSQL 16 introduced some VACUUM
       performance improvements. I recommend checking the PostgreSQL 17
       Release Notes (postgresql.org/docs/17/release-17.html)
       for the latest information.
```

The second response is longer, but **it won't mislead the user**.

---

## 4. Reasoning Framework Selection Guide

Different tasks require different reasoning approaches. Here are three major frameworks and their appropriate use cases.

### Chain-of-Thought (CoT)

**Core concept:** Make the model "think before answering." Unfold the reasoning process instead of jumping straight to the conclusion.

**Best for:**
- Mathematical calculations and logical reasoning
- Problems requiring multi-step analysis
- Complex conditional logic

**Template:**

```
Think step by step:

1. Understand the problem: What is the question asking?
2. Break it down: What sub-problems can this be split into?
3. Reason step by step: What is the reasoning at each step?
4. Verify: Check your reasoning for any gaps
5. Give the final answer
```

**Example — without CoT:**

```
Q: An API handles 500 requests per second, with each request averaging 200ms.
   What is the minimum number of worker threads needed?

A: 100.
```

**With CoT:**

```
Q: (same as above)

A: Let me calculate step by step:

1. Each request takes 200ms = 0.2 seconds
2. One worker can handle 1/0.2 = 5 requests per second
3. We need to handle 500 requests/second
4. Workers needed = 500 / 5 = 100
5. Considering that workers won't be 100% utilized in practice,
   I recommend provisioning 120-150

At minimum 100 worker threads are needed; I recommend 120-150
to handle traffic fluctuations.
```

### Few-shot Learning

**Core concept:** Use examples to show the model "what kind of output I want."

**Best for:**
- Formatted output (classification, extraction, transformation)
- Style mimicry
- Defining boundary cases

**Template:**

```
You are a customer support ticket classifier. Based on the user description,
classify into one of: billing, technical, feature_request, bug_report

## Examples

Input: "My credit card was charged twice"
Output: {"category": "billing", "urgency": "high", "reason": "Duplicate charge"}

Input: "API returns 500 error"
Output: {"category": "bug_report", "urgency": "high", "reason": "Server error"}

Input: "Would love dark mode support"
Output: {"category": "feature_request", "urgency": "low", "reason": "UI feature request"}

Input: "How do I set up a webhook?"
Output: {"category": "technical", "urgency": "medium", "reason": "Feature usage inquiry"}

## Now classify the following input:
```

### ReAct (Reasoning + Acting)

**Core concept:** The model alternates between "thinking" and "acting," reasoning before executing at each step.

**Best for:**
- Tasks requiring tools (search, API calls, database queries)
- Multi-step information retrieval
- Tasks that need strategy adjustments based on intermediate results

**Template:**

```
You can use the following tools:
- search(query): Search the knowledge base
- sql(query): Execute SQL queries
- calculate(expression): Mathematical calculations

At each step, use this format:

Thought: What do I need to do? Why?
Action: tool_name(parameters)
Observation: Result returned by the tool
... (repeat until sufficient information is gathered)
Answer: Final answer
```

**Example:**

```
Question: Who were the top 3 highest-spending customers last month,
and how much did each spend?

Thought: I need to query last month's order data, grouped by customer and sorted
Action: sql(SELECT customer_id, SUM(amount) as total
         FROM orders
         WHERE created_at >= '2024-08-01'
         AND created_at < '2024-09-01'
         GROUP BY customer_id
         ORDER BY total DESC LIMIT 3)
Observation:
| customer_id | total    |
|-------------|----------|
| C-1042      | $45,230  |
| C-0891      | $38,100  |
| C-1205      | $29,870  |

Thought: I have the amounts, but customer IDs aren't intuitive —
let me look up the names
Action: sql(SELECT id, name FROM customers
         WHERE id IN ('C-1042', 'C-0891', 'C-1205'))
Observation:
| id     | name           |
|--------|----------------|
| C-1042 | Acme Corp      |
| C-0891 | TechStart Inc  |
| C-1205 | Global Systems |

Answer: The top 3 highest-spending customers last month:
1. Acme Corp — $45,230
2. TechStart Inc — $38,100
3. Global Systems — $29,870
```

### Framework Comparison Table

| Feature | Chain-of-Thought | Few-shot | ReAct |
|---------|-----------------|----------|-------|
| **Best scenario** | Math/logical reasoning | Formatting/classification | Multi-step tool usage |
| **Token cost** | Medium (reasoning steps) | Medium (examples take space) | High (multi-turn interactions) |
| **Accuracy improvement** | Math +40-60% | Format compliance +70% | Complex queries +50% |
| **Latency** | Slightly higher | Close to baseline | Significantly increased |
| **Implementation difficulty** | Low | Low | Medium (requires tool integration) |
| **Explainability** | High (reasoning visible) | Medium | High (each step explained) |
| **Suitable task complexity** | Medium-High | Low-Medium | High |

**Decision tree for choosing:**

```
Does your task require external tools?
├── Yes → ReAct
└── No → Does the task require multi-step reasoning?
    ├── Yes → Chain-of-Thought
    └── No → Is output format important?
        ├── Yes → Few-shot
        └── No → Zero-shot (just ask directly)
```

**Mix and match:** In practice, the most effective prompts often combine frameworks. For example, **Few-shot + CoT** — demonstrate the reasoning process within examples so the model learns both format and reasoning approach simultaneously.

---

## 5. Few-shot Optimization Strategies

Few-shot seems simple — just drop in a few examples, right? But example quality and strategy dramatically affect results.

### 1. Example Selection: Diversity, Representativeness, Boundaries

**Diversity**: Examples should cover different cases.

```
# Bad: all examples are the same category
Example 1: "System is slow" → bug_report
Example 2: "Page takes forever to load" → bug_report
Example 3: "API response time too long" → bug_report

# Good: covers various categories
Example 1: "System is slow" → bug_report
Example 2: "There's an issue with my bill" → billing
Example 3: "Would love PDF export" → feature_request
Example 4: "How do I set up SSO?" → technical
```

If all examples are the same category, the model develops a bias — tending to classify all inputs into that category.

**Representativeness**: Examples should reflect the real data distribution.

If your actual cases are 60% technical, 20% billing, 15% bug_report, and 5% feature_request, your example proportions should roughly mirror this distribution — or at least not deviate severely.

**Boundary cases**: Include ambiguous examples that are easy to misclassify.

```
# Boundary case examples
Input: "Why am I being charged this API usage fee? I think the number is wrong"
Output: {"category": "billing", "urgency": "medium",
       "reason": "Although API is mentioned, the core issue is a billing dispute"}

Input: "The login page is super slow and I'm in a hurry to make a payment"
Output: {"category": "bug_report", "urgency": "high",
       "reason": "Although payment is mentioned, the root problem is a performance issue"}
```

Boundary case examples essentially tell the model: "When you encounter ambiguous situations, use this logic to decide."

### 2. Example Ordering: Easy → Hard

Put simple, intuitive examples first and complex ones later.

```
Example 1: (very clear billing case)              ← Easy
Example 2: (very clear bug_report case)            ← Easy
Example 3: (technical case requiring some judgment) ← Medium
Example 4: (ambiguous boundary case)               ← Hard
Example 5: (counter-intuitive case + explanation)   ← Hardest
```

This ordering lets the model build a basic understanding of the classification first, then learn to handle complex situations. It's like teaching — start with fundamentals, then advance.

### 3. Number of Examples: 3-5 Is Usually Optimal

Research and practical experience show:

- **0 examples (zero-shot)**: Suitable for simple tasks the model already handles well
- **1-2 examples**: Helps the model understand the format, but may lack diversity
- **3-5 examples**: Usually the sweet spot — enough diversity without consuming too many tokens
- **6-10 examples**: Only needed when the task is very complex or has many categories
- **10+ examples**: Usually not cost-effective on tokens — consider fine-tuning instead

```
Accuracy
  ↑
  │        ┌─── Diminishing returns
  │       ╱
  │      ╱
  │     ╱
  │    ╱
  │   ╱
  │  ╱
  │ ╱
  │╱
  └──────────────────→ Number of examples
  0  1  2  3  4  5  6  7  8  9  10
```

The improvement from 0 to 3 is usually the most significant. Beyond 5, the marginal benefit of each additional example drops rapidly.

### 4. Dynamic Few-shot: Select Examples Based on Input

The problem with static few-shot is that regardless of what the user asks, they always see the same set of examples.

**Dynamic few-shot** works like this: retrieve the most similar examples from an example library based on the user's input.

```
Flow:

User input → embedding → similarity search example library → take top-3 → assemble prompt

┌──────────────────┐     ┌─────────────────┐
│  User: "My credit │     │  Example Library  │
│  card was charged │────→│  (500+ examples)  │
│  three times"    │     │  Vector storage   │
└──────────────────┘     └────────┬────────┘
                                  │
                         Retrieve 3 most similar
                                  │
                    ┌─────────────┴──────────────┐
                    │  Example A: duplicate charge │
                    │  Example B: refund dispute   │
                    │  Example C: billing cycle     │
                    │             misunderstanding  │
                    └────────────────────────────┘
```

Dynamic few-shot typically outperforms static few-shot by 15-30%, because examples are more relevant to the user's question. The downside is that you need to maintain an example library and vector search infrastructure.

---

## 6. Token Budget Management

Tokens aren't free. Every token has both a monetary cost and an attention cost.

### How to Calculate the Budget

```
Total budget = context window size

Allocation formula (recommended):
┌────────────────────────────────────────────┐
│  System prompt          5-10%              │
│  Few-shot examples      10-15%             │
│  Context/RAG results    30-40%             │
│  Conversation history   10-15%             │
│  ─────────────────────────────             │
│  Reserved for generation 30-35%            │
│  (reserve more if the task needs long output)│
└────────────────────────────────────────────┘
```

**Concrete example (128K window):**

| Section | Percentage | Token Count |
|---------|-----------|-------------|
| System prompt | 8% | ~10K |
| Few-shot | 12% | ~15K |
| Context | 35% | ~45K |
| Conversation history | 15% | ~19K |
| **Reserved for generation** | **30%** | **~39K** |

### Compression Strategies

When context exceeds the budget, you need compression. Here are several strategies:

**Strategy 1: Summarization**

Summarize long documents into shorter versions. Suitable for scenarios where you need overall context but not granular detail.

```
# Before compression (800 tokens)
Full 10-turn conversation history including every tool call and return result...

# After compression (150 tokens)
<summary>
User is troubleshooting query performance on the orders table.
Already tried: added idx_orders_date index (30% improvement),
               adjusted work_mem to 256MB (no noticeable improvement).
Currently stuck on a JOIN performance bottleneck.
</summary>
```

**Strategy 2: Truncation**

Directly cut out less important parts. Suitable when information has a clear priority order.

```
# Truncation strategy
1. Drop the oldest conversations (keep the most recent 5 turns)
2. Drop full tool call outputs (keep only summaries)
3. Drop low-relevance RAG results (keep only top-3)
```

**Strategy 3: Layered Compression**

Use different compression strategies for different types of content:

```
System prompt      → Don't compress (core instructions)
Few-shot examples  → Reduce quantity (5 → 3)
RAG results        → Keep only the most relevant passages
Conversation history → Summarize old turns, keep recent ones in full
Tool outputs       → Keep only key data, remove formatting
```

### When to Summarize vs. Truncate?

| Scenario | Recommended Strategy |
|----------|---------------------|
| Conversation history exceeds 10 turns | Summarize old conversations, keep last 3-5 turns in full |
| Too many RAG results | First truncate low-relevance results, then summarize the rest |
| Single document too long | Summarize, or extract only relevant sections |
| Tool output too large | Truncate, keep only key fields |
| Need to preserve reasoning context | Summarize (preserves logic), don't truncate |

---

## 7. The Six-Step Iteration Method

Prompt engineering isn't a one-time task — it's an iterative process. Here is a systematic iteration methodology.

```
Six-Step Iteration Flow:

  ┌──────────────┐
  │ 1. Start     │
  │    Simple    │ ──── Start with the simplest prompt
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 2. Test with │
  │  Real Cases  │ ──── Test with 20-50 real cases
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 3. Classify  │
  │    Errors    │ ──── Classify error types
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 4. Targeted  │
  │    Fix       │ ──── Make targeted prompt modifications
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 5. Record    │
  │   Changes    │ ──── Record modifications and reasons
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 6. Evaluate  │
  │  with Judge  │ ──── LLM-as-Judge evaluation
  └──────┬───────┘
         │
         ▼
    Loop until target is met
```

### Step 1: Start Simple

Start with the simplest possible prompt — don't stack techniques from the beginning.

```
# Version 1 prompt (simple)
You are a customer service classifier. Based on the user's message,
classify it as billing, technical, bug_report, or feature_request.
Answer in JSON format.
```

Why not write a "perfect" prompt right away? Because you don't know where the model will make mistakes. Run one round first, observe real error patterns, then make targeted modifications.

### Step 2: Test with Real Cases

Prepare 20-50 real cases with ground-truth labels and run a round of testing.

```
Test set structure:

| input                            | expected_output       | actual_output         | correct? |
|----------------------------------|-----------------------|-----------------------|----------|
| "Credit card charged twice"      | billing / high        | billing / high        | ✓        |
| "API returns 500"                | bug_report / high     | technical / medium    | ✗        |
| "Can you add dark mode"          | feature_request / low | feature_request / low | ✓        |
| "How to set up webhook + overcharged" | billing / medium | technical / medium    | ✗        |
```

Don't only test "normal cases." Deliberately include:
- Ambiguous cases (could belong to multiple categories)
- Adversarial cases (intentionally misleading descriptions)
- Boundary cases (containing multiple issues at once)

### Step 3: Classify Errors

Categorize errors into three types — each has a different fix strategy:

**Understanding Error**
The model misunderstood the meaning of the question.

```
Issue: User said "API returns 500"
Expected: bug_report
Actual: technical
Analysis: Model classified "API usage" as technical, failing to
  understand that 500 is an error code
Fix: Add to guidelines "HTTP 4xx/5xx error codes → classify as bug_report"
```

**Format Error**
The model understood correctly but the output format is wrong.

```
Expected: {"category": "billing", "urgency": "high"}
Actual: The category is billing, urgency is high.
Analysis: Model answered in natural language instead of JSON
Fix: Add examples in the format section, or add "Output only JSON,
  do not include any other text"
```

**Knowledge Error**
The model lacks the knowledge needed to answer.

```
Issue: What discounts does our Enterprise plan have?
Expected: Answer based on internal pricing table
Actual: Model fabricated a discount percentage
Analysis: Model doesn't have internal pricing information
Fix: Inject pricing table into context, or enable the confidence
  mechanism so the model says "I don't know"
```

### Step 4: Targeted Fix

Based on the error type, make the smallest possible modification to the prompt.

**Key principle: Change only one thing at a time.**

If you simultaneously change the role, add examples, and modify the format definition — and performance improves — you don't know which change was responsible. If performance drops, you're even more in the dark.

```
# v1 → v2 modification

## Change: Added HTTP error code classification rule
## Reason: Step 3 found 5 cases that misclassified HTTP errors as technical

Added to Guidelines:
+ - HTTP 4xx/5xx error codes, server errors, service outages → classify as bug_report
+ - API usage methods, setup tutorials, integration issues → classify as technical
```

### Step 5: Record Changes

Record every modification. This is your prompt changelog.

```
# Prompt Changelog

## v1 (2024-09-01)
- Initial version, basic classification functionality
- Test results: 42/50 correct (84%)

## v2 (2024-09-02)
- Added HTTP error code classification rule
- Fixed: 5 bug_report cases misclassified as technical
- Test results: 47/50 correct (94%)

## v3 (2024-09-03)
- Added 2 boundary case examples
- Fixed: mixed-issue classification errors
- Test results: 49/50 correct (98%)

## v4 (2024-09-05)
- Attempted adding CoT reasoning
- Result: accuracy unchanged (98%), but latency increased 40%
- Decision: rolled back to v3, CoT not cost-effective for this task
```

With a changelog, you can:
- Track your progress trajectory
- Roll back to previous versions
- Understand the rationale behind every change

### Step 6: LLM-as-Judge Evaluation

Manually evaluating 50 cases is already exhausting. When your test set scales to 200-500 cases, use another LLM as the evaluator.

```
## Judge Prompt

You are a classification quality evaluator. You will receive:
- The user's original input
- The expected classification result
- The model's actual classification result

Evaluate the model's response:

1. **Correctness** (0-3): Is the classification correct?
   0=completely wrong, 3=completely correct
2. **Reasonableness** (0-3): Even if the classification differs,
   does the model's judgment make sense?
3. **Format** (0-1): Is the output format correct?

Answer in this format:
{
  "correctness": 0-3,
  "reasonableness": 0-3,
  "format": 0-1,
  "explanation": "One-sentence explanation"
}
```

**LLM-as-Judge caveats:**

- Use a stronger model than the one being evaluated as the judge (e.g., use Claude Opus to evaluate Haiku's output)
- The judge also needs calibration — first validate the judge's consistency with 50 human-labeled cases
- Don't completely replace human evaluation; periodically spot-check the judge's assessments

---

## 8. Six Common Mistakes

### Mistake 1: Too Many Rules

**Problem:** You wrote 30 rules and the model does nothing well.

LLM attention is finite. The more rules there are, the less attention each one gets. Beyond 10-15 rules, the model starts selectively ignoring them.

**Before:**

```
## Rules
1. Answer in Traditional Chinese
2. Maintain a professional tone
3. Don't use emojis
4. Keep each paragraph to 3 sentences max
5. Keep technical terms in English
6. Confirm the question before answering
7. State uncertainty when unsure
8. Structure your answers
9. Use bullet points
10. Attach a reason to every suggestion
11. Cite sources
12. Don't repeat the user's question
13. Avoid passive voice
14. Keep it under 500 words
15. End with a summary
... (15 more)
```

**After:**

```
## Core Rules (must follow)
1. Answer in Traditional Chinese; keep technical terms in English
2. Confirm your understanding in one sentence before answering
3. Use bullet-point structure; attach a reason to every suggestion
4. For uncertain information, note "Not sure — recommend checking [source]"

## Style Preferences (follow when possible)
- Professional but friendly tone
- Keep it under 500 words
- End with a one-sentence summary
```

Split rules into "must follow" and "follow when possible" tiers. Keep core rules to 5 or fewer.

### Mistake 2: Negative Instructions

**Problem:** Everything is "don't do X" and the model doesn't know what TO do.

**Before:**

```
Don't use technical jargon.
Don't make answers too long.
Don't fabricate data.
Don't ignore the user's question.
Don't use colloquial language.
```

**After:**

```
- Explain using language a middle schooler could understand (when technical
  terms are necessary, include a brief explanation)
- Keep answers to 200-300 words
- When citing specific data, include the source; for uncertain data,
  just say "I'm not sure"
- The first sentence of every answer must directly address the user's
  core question
- Use formal written language; professional but not stiff
```

Every negative instruction has been converted into a specific positive behavior.

### Mistake 3: No Examples

**Problem:** You only gave text descriptions without demonstrating "what good output looks like."

**Before:**

```
Classify user feedback and extract key information in a structured format.
```

"Structured format" could mean JSON, Markdown table, XML, YAML... the model might choose a different one each time.

**After:**

```
Classify user feedback and extract key information.

## Example

Input: "Your app is great, but the search is too slow, especially
when searching product names."

Output:
{
  "sentiment": "mixed",
  "positive": ["Good overall user experience"],
  "negative": ["Poor search performance"],
  "feature_mentioned": "search",
  "specific_scenario": "When searching product names",
  "priority": "medium"
}

## Now process the following feedback:
```

One example is worth ten sentences of description.

### Mistake 4: Prompt Too Long

**Problem:** You wrote every possible scenario into the system prompt, and the prompt itself takes up 30% of the context window.

**Before:**

```
(3000-word system prompt covering handling instructions for 15 scenarios,
 20 examples, a complete FAQ, company history...)
```

**After:**

```
# Core System Prompt (~500 words)
Role + core rules + output format + 2-3 key examples

# Dynamic injection (as needed)
- User asks about pricing → inject pricing table
- User asks a technical question → inject relevant documentation
- User asks about refunds → inject refund policy
```

Keep the system prompt lean. Put scenario-specific information into dynamically injected context that loads only when needed.

### Mistake 5: Over-engineering

**Problem:** The task is simple, but the prompt is over-designed.

**Before:**

```
You are a seasoned multilingual translation expert. Please use Chain-of-Thought
reasoning to first analyze the semantic structure, cultural background, and
context of the source text, then consider the target language's expression
habits and cultural differences, generate a preliminary translation, and
finally perform self-review and revision. Please output your analysis, draft,
review, and final translation in <analysis>, <draft>, <review>, and <final>
tags respectively.

[500 words of translation guidelines...]
[10 translation examples across different domains...]
```

This is just to translate a single sentence.

**After:**

```
Translate the following text into Traditional Chinese. Maintain the original
tone and level of expertise. If there are terms that can't be precisely
translated, keep the English and add a Chinese explanation in parentheses.
```

**Rule of thumb:** If zero-shot achieves 90% of the desired quality, you don't need few-shot. If few-shot achieves 95%, you don't need CoT. **Use the lowest-cost approach that meets your target accuracy.**

### Mistake 6: No Version Control

**Problem:** You keep modifying the prompt with no idea which version worked best or why.

**Before:**

```
# Vague memories in your head
"I think it got better after I added that rule last time... or did it get worse?"
"When was this example added? Why was it added?"
```

**After:**

```
prompts/
├── customer_classifier/
│   ├── v1.txt          # Initial version
│   ├── v2.txt          # Added error code rules
│   ├── v3.txt          # Added boundary case examples
│   ├── v4.txt          # Tried CoT (rolled back)
│   ├── current.txt     # → symlink to v3.txt
│   ├── CHANGELOG.md    # Changes and test results per version
│   └── test_results/
│       ├── v1_results.json
│       ├── v2_results.json
│       └── v3_results.json
```

Manage prompts like code:

- Save each version independently
- Record the reason and effect of every change
- Preserve test results
- Roll back at any time

An even better approach is to manage prompt files directly with git — every modification gets a commit message, a diff, and a complete history.

---

## Conclusion

The essence of prompt engineering is not creative writing — it's **engineering iteration**.

Core principles recap:

1. **Structured system prompt**: Role / Guidelines / Format three-part structure — be specific in each section
2. **Formatted context**: Label sources and relevance; put the most important content first
3. **Built-in confidence mechanism**: Teaching the model to say "I don't know" is a hundred times better than letting it guess
4. **Choose the right reasoning framework**: CoT, Few-shot, ReAct each have their place — don't blindly apply them
5. **Optimize few-shot**: Diversity, representativeness, boundary cases — 3-5 examples is usually enough
6. **Manage token budget**: Always reserve 30% for generation
7. **Systematic iteration**: Start simple → test → classify errors → fix → record → evaluate
8. **Avoid common mistakes**: Too many rules, negative instructions, no examples, too long, over-engineering, no version control

The most important takeaway: **Good prompts aren't written in one go — they're iterated into existence.**

Start with the simplest version. Let real cases expose your weaknesses. Classify the errors. Make targeted fixes. Record every step. Scale evaluation with LLM-as-Judge. Repeat this cycle until you hit your target.

That's prompt engineering.

---

## References

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Anthropic's official prompt design guide covering system prompt structure and best practices
- [OpenAI Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering) — OpenAI's prompt strategy guide including few-shot, CoT, and other techniques
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903) — The original CoT paper demonstrating how step-by-step reasoning improves LLM math and logic capabilities
- [ReAct: Synergizing Reasoning and Acting in Language Models (2022)](https://arxiv.org/abs/2210.03629) — The ReAct framework paper combining reasoning and tool use in a prompting methodology
- [Large Language Models Are Human-Level Prompt Engineers (2022)](https://arxiv.org/abs/2211.01910) — APE automated prompt optimization research
- [Judging LLM-as-a-Judge (2023)](https://arxiv.org/abs/2306.05685) — LLM-as-Judge evaluation methodology exploring the reliability of using LLMs to evaluate LLM outputs
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2023)](https://arxiv.org/abs/2310.03714) — A systematic prompt iteration and optimization framework
