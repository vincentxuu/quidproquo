---
title: "AI Agents: From Retrieval and Tool Calls to the Harness and Coding Agents | Stanford CME295 2026 Edition Lecture 6"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cme295, ai-agent, rag, tool-calling, harness-engineering, coding-agent, stanford]
lang: en
math: true
series:
  name: "Reading Stanford CME295"
  order: 12
tldr: "Lecture 6 of the 2026 CME295 starts from two limits of LLMs: their knowledge stops at the training data, and they cannot act. The first 40 minutes cover retrieval (chunking, bi-encoder candidate retrieval, cross-encoder re-ranking, metrics such as NDCG, and why coding uses grep instead). Next come the three steps of tool calling, conflicts between tools and tool selection, MCP, and why fixed content must go at the front of the prompt to hit the cache. The last 15 minutes define the harness as everything except the model, pass through ReAct, compaction and memory, and then look at coding agents: auto-approval, grep, AGENTS.md, skills and subagents."
description: "A guide to Stanford CME295 2026 Lecture 6, \"AI Agents\", based on the recording and the 152-slide deck: RAG chunking and two-stage retrieval (bi-encoder, BM25, HyDE, contextual retrieval, cross-encoder re-ranking), NDCG / RR / Recall@k / Precision@k, grep for code retrieval; the three steps of tool calling, teaching tools via SFT versus prompting, tool conflicts and tool selection, MCP, prompt caching and prompt ordering; the definition of a harness, ReAct, A2A, three kinds of context compaction, short- and long-term memory; and coding agents' auto-approval, AGENTS.md, skills, computer use, subagents and agent teams."
draft: false
glossary:
  - term: "harness"
    aliases: ["agent harness", "agentic harness"]
    definition: "Everything outside the model that turns it into an agent: tools, the ordering of actions, the compaction strategy, memory, all the surrounding prompting, and guardrails."
    context: "Slide 105 of the lecture cites Databricks for this definition; the speaker's analogy is that the model is the engine and the harness is the rest of the car."
  - term: "context compaction"
    aliases: ["compaction"]
    definition: "Ways to free up room when the context window fills: delete content that is no longer needed, keep only a recent sliding window, or summarize the conversation so far into fixed fields and continue from that."
    context: "The lecture places it in the harness section and lists deletion, sliding window and summarization."
  - term: "bi-encoder / cross-encoder"
    aliases: ["bi-encoder", "cross-encoder", "re-ranker"]
    definition: "A bi-encoder encodes the query and the document separately into vectors and compares them, so document vectors can be precomputed. A cross-encoder feeds the query and document together as one sequence and outputs a relevance score directly: more accurate, but nothing can be precomputed."
    context: "In the lecture's two-stage retrieval, stage one retrieves candidates with a bi-encoder and stage two re-ranks them with a cross-encoder."
  - term: "NDCG@k"
    aliases: ["NDCG", "Normalized Discounted Cumulative Gain"]
    definition: "A ranking-quality metric: relevant documents in the top k score higher the earlier they appear, and the result is divided by the score of a perfect ranking so it falls between 0 and 1."
    context: "The first metric the lecture introduces for evaluating retrieval."
  - term: "prompt caching"
    aliases: ["prompt cache", "cached input"]
    definition: "The provider stores the computation for the identical beginning of a prompt and reuses it when the next request starts the same way, billing it at a much lower rate. It only works for an exactly identical prefix."
    context: "The lecture uses it to explain why tool definitions belong at the very start of the prompt."
---

> :globe: [中文版](/posts/ai/2026-09-29-cme295-ai-agents)

**Video status: Videos included.** [Source details](#course-video-sources)

This post covers Lecture 6, "AI Agents," of the 2026 edition of Stanford's [CME295](/posts/ai/2026-09-29-cme295-course-overview-en) (November 6, 2026). It is based on the English captions of the lecture recording and the [152-slide deck](https://cme295.stanford.edu/slides/fall26-cme295-lecture6.pdf). Afshine Amidi teaches retrieval for the first 44 minutes; Shervine Amidi then covers tool calling, the harness and coding agents. About half the material (RAG, tool calling, tool selection, MCP, ReAct, A2A) is the same as the 2025 Lecture 7, which our [Lecture 7 guide](/posts/ai/2026-09-29-cme295-agentic-llms-en) already covers from the 2025 slides. This post walks through the 2026 recording again and explains the segments added this year.

Prerequisites: encoder-only models (BERT) and the CLS token ([Lecture 2 guide](/posts/ai/2026-09-29-cme295-transformer-tricks-en)), and the KV cache and cached-input pricing ([Lecture 5 guide](/posts/ai/2026-09-29-cme295-llm-systems-en)).

The video runs 1 hour 40 minutes and this post covers all of it; each section starts with a timestamp link into the recording.

```youtube
url: https://www.youtube.com/watch?v=nU2a2lm6vDE
title: Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 6 - AI Agents
```

## How the lecture is organized: two limits, five parts

[Recording 00:00–05:11](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=0s)

The speaker opens with how coding has changed (slides 3–6): in 2023 you copy-pasted code into a chat window, in 2024 you pressed tab for autocomplete in the IDE, in 2025 you handed over whole tasks, and in 2026 an agent writes the code, writes the tests, runs them and deploys. This lecture is about that gap.

The gap comes from two limits of LLMs:

1. **Knowledge stops at the training data.** The speaker uses the GPT-6 Astra model card as an example, with a knowledge cutoff of April 30, 2026; it would not know the results of the US midterm election held that week. It has never seen your private codebase either.
2. **It can only answer, not act.** Ask it to "order a 17-inch teddy bear for me" and it has no way to actually place the order.

Retrieval handles the first limit and tools handle the second. The agenda on slide 2 has five parts; here is how the time actually splits:

| Part | Recording | Speaker | What it addresses |
|---|---|---|---|
| Retrieval | 05:11–44:28 | Afshine | Knowledge that is not fresh or private enough |
| Tool calling | 44:28–1:22:54 | Shervine | Cannot act; conflicts and cost once there are many tools |
| Harness engineering | 1:22:54–1:33:33 | Shervine | The layer outside the model: ReAct, compaction, memory |
| Coding agents | 1:33:33–1:38:58 | Shervine | What all of the above looks like in a coding agent |
| Discussion | 1:38:58–1:40:43 | Shervine | Multiple agents, wins and risks |

The [2026 syllabus](https://cme295.stanford.edu/syllabus/) lists tool calling, MCP, memory/retrieval, context compaction, harness optimization, coding agents and skills/plugins. Against the recording: retrieval and tool calling take three quarters of the video; context compaction and memory together take about four minutes; the syllabus says harness *optimization* while the slides say harness *engineering*, and the lecture defines the harness without covering how to optimize it automatically or systematically; skills get about a minute in the coding-agent part, and plugins are not discussed on their own.

**Self-check**: Why doesn't "paste everything that happened after training into the prompt" work? The speaker gives three reasons.

<details>
<summary>Answer</summary>

One, the context window is finite: GPT-6 Astra has about a million tokens, nowhere near enough for everything since training. Two, even if it fit, models perform worse on longer inputs (the needle-in-a-haystack test). Three, input is billed per token, so longer is more expensive. Criteria: all three points, and the second must say "longer gets worse," not just "it doesn't fit."

</details>

## Retrieval: putting only what is relevant into the prompt

[Recording 05:11–15:54](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=311s)

### Why not stuff everything in

Slides 10–12 pair each of the three reasons with a figure. The second uses Kamradt's 2023 [needle in a haystack](https://github.com/gkamradt/needle-in-a-haystack) chart: the x-axis is input length and the y-axis is where the "needle" sits in the document. The speaker's reading: with short inputs the model almost always finds it; as inputs get long, facts placed toward the top of the document start to get lost.

The conclusion is to include only what is relevant to the task. That is **RAG** (retrieval-augmented generation, [Lewis et al. 2020](https://arxiv.org/abs/2005.11401)): retrieve relevant documents, augment the prompt with them, generate the answer.

The Q&A adds two cost points: retrieved documents count as input tokens, and a reasoning model's reasoning tokens are billed even when you are not shown them. So retrieval should be as precise as possible. Another student asks how the model knows which parts were retrieved; the speaker says they are usually wrapped in special tags.

Of the three steps, the first matters most: if retrieval is wrong, nothing downstream can fix it. The difficulty is that natural language can say the same thing in different words, so matching the literal words of the query is not enough.

### Building the knowledge base

[Recording 12:36](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=756s)

Collect documents, divide them into chunks, compute an embedding vector per chunk. Slide 25 lists three hyperparameters; the speaker's orders of magnitude:

| Hyperparameter | Typical size | The speaker's reasoning |
|---|---|---|
| Embedding size | Thousands | The harder or more nuanced the documents, the larger it can be |
| Chunk size | Hundreds of tokens | Too large defeats the point of keeping inputs short |
| Chunk overlap | About 10% | Avoids cutting a sentence in the middle so it loses its meaning |

A student asks whether the chunks change from one request to the next. The speaker says the chunks are fixed and only the query changes; the knowledge base itself is not fixed, though, and you can add documents any time, such as internal docs that arrive daily; the one thing to watch is to **use the same embedding model**, so similarity comparisons stay apples to apples.

## Two-stage retrieval: first recall, then precision

[Recording 15:54–35:02](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=954s)

| | Stage 1: candidate retrieval | Stage 2: ranking |
|---|---|---|
| Goal | Maximize recall | Maximize precision |
| Documents considered | Thousands to millions | About 100 candidates |
| Method | Cheap similarity comparison | A more expensive, more detailed model |

### Stage 1: bi-encoder, BM25 and hybrid

**Semantic search.** The query and each chunk go through an encoder separately to get vectors, then a similarity score is computed (the slides cite [Sentence-BERT](https://arxiv.org/abs/1908.10084)). This is a **bi-encoder**. It is cheap because chunk vectors can be computed ahead of time; at inference you only embed the query and use an approximate nearest-neighbor algorithm to find the closest chunks.

The speaker shows its blind spot with an example. The query is "Where is Cuddly?" (Cuddly is a teddy bear) and the knowledge base has four chunks:

1. Huggy likes to work downstairs
2. Where is Paris located?
3. he was in a cuddly mood
4. Cuddly spends most days surrounded by books

Semantic search might retrieve the first two: Huggy is close in meaning to Cuddly (cuddle, hug), and "Where is Paris located?" is also a where-question. But the answer is in chunk 4.

**BM25** compares the exact words the query and document share; in this example it retrieves chunks 3 and 4, which both contain "Cuddly." The speaker adds that he could just as well show examples where BM25 alone is not enough: matching only keywords misses rephrasings. In practice people combine the two, merging the semantic ranks and keyword ranks into a **hybrid rank** that usually beats either one alone.

**Narrowing the gap between query and document.** Queries are mostly questions and documents mostly statements, so embeddings from the same encoder may not land in the same "region." [HyDE](https://arxiv.org/abs/2212.10496) (hypothetical document embeddings) has an LLM write a fake answer document from the query and compares that against the chunks. The speaker also mentions another family: when a query packs several questions, rewrite it into sub-questions and retrieve for each.

**Contextual retrieval.** Even with overlap, a chunk can be unreadable on its own. Anthropic's [contextual retrieval](https://www.anthropic.com/research/contextual-retrieval) has an LLM read the whole document and write a sentence situating each chunk, then embeds the augmented chunk. Slides 36–37 show the prompt, and the speaker points out its layout: the whole document goes first and the chunk to process goes after, so every chunk from the same document shares the same opening and can use the cached-input price from last lecture. The OpenAI pricing page on slide 38 lists GPT-6 Astra at USD 10 per million input tokens and USD 1 for cached input, a 10× difference. Our [contextual retrieval post](/posts/ai/2026-03-12-contextual-retrieval-en) has the full method.

### Stage 2: cross-encoder re-ranking

[Recording 28:36](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=1716s)

With only about 100 candidates left, you can afford a more expensive model. A **cross-encoder** concatenates the query and a chunk into one sequence (separated by special tokens) and feeds it to an encoder, so tokens on both sides interact through self-attention; the CLS token's output is projected to a relevance score between 0 and 1, the same setup as BERT in Lecture 2. Training data is query–chunk pairs labeled relevant or not relevant.

The speaker's example: "find the teddy bear with the red scarf and blue socks" and "blue scarf and red socks" may compress to very similar single vectors; in one shared encoder, "red" and "blue" get a chance to line up with the matching spots in the document. Each candidate is scored once, and the scores give the final ranking.

Three points from the Q&A at the end of the retrieval part (from 42:46):

- **Where vector databases come in**: only in stage 1, to store chunks and their vectors. Stage 2 scores need the query and chunk computed together, so nothing can be stored ahead of time.
- **Do all top k go into the prompt?** Usually yes; you can also add a score threshold.
- **Do you tell the model which chunk is more relevant?** It depends on the implementation; usually they are ordered from most to least relevant.

### Measuring retrieval quality

[Recording 35:15](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=2115s)

You need a dataset labeled with which chunks are relevant to which query, and you compare the system's top k against it. The four metrics on slides 45–48, where $\text{rel}_i \in \{0, 1\}$ says whether rank i is relevant:

$$
\text{DCG@}k = \sum_{i=1}^{k} \frac{\text{rel}_i}{\log_2(i+1)}, \qquad \text{NDCG@}k = \frac{\text{DCG@}k}{\text{IDCG@}k}
$$

IDCG@k is the DCG@k of a perfect ranking. Dividing by it matters because DCG on its own has no fixed upper bound and is hard to interpret; normalized, it lies between 0 and 1, and closer to 1 is better. The $\log_2(i+1)$ in the denominator discounts relevant documents that appear lower.

$$
\text{RR} = \frac{1}{\text{rank of the first relevant chunk}}, \qquad
\text{Recall@}k = \frac{|\text{relevant in top } k|}{|\text{relevant}|}, \qquad
\text{Precision@}k = \frac{|\text{relevant in top } k|}{k}
$$

When the speaker asks who has heard of NDCG, no one raises a hand, so this part goes slowly.

<details>
<summary>This post's example: four metrics for one ranking</summary>

A query has 3 relevant chunks. The system's top 3 are: not relevant, relevant, relevant (the third relevant chunk is at rank 5). With k = 3:

```
DCG@3  = 0/log2(2) + 1/log2(3) + 1/log2(4) = 0 + 0.631 + 0.5 = 1.131
IDCG@3 = 1/log2(2) + 1/log2(3) + 1/log2(4) = 1 + 0.631 + 0.5 = 2.131
NDCG@3 = 1.131 / 2.131 ≈ 0.531

RR          = 1/2 = 0.5        (first relevant chunk at rank 2)
Recall@3    = 2/3 ≈ 0.667      (2 of the 3 relevant chunks retrieved)
Precision@3 = 2/3 ≈ 0.667      (2 of the top 3 are relevant)
```

Swap ranks 1 and 2 and NDCG@3 rises to $1.5 / 2.131 \approx 0.704$ and RR to 1, while Recall and Precision stay the same. That is what it means for NDCG and RR to care about order and for Recall and Precision not to.

</details>

### For code, use grep

[Recording 41:00](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=2460s)

The speaker returns to the opening coding-agent example. For code questions you usually want a particular function; semantically similar code is not much help, and what you want is an **exact match**. So coding agents use grep (global regular expression print): give it a string and it lists every location in the codebase where it occurs. The semantic and keyword search above mostly applies to natural-language problems.

**Self-check**: A query has 4 relevant chunks, and the system's top 5 have relevance (1, 0, 0, 1, 0). Compute RR, Recall@5 and Precision@5. What would happen if you replaced the bi-encoder with a cross-encoder scoring all one million chunks directly?

<details>
<summary>Answer</summary>

RR = 1 (rank 1 is relevant); Recall@5 = 2/4 = 0.5; Precision@5 = 2/5 = 0.4. A cross-encoder must run the query together with each chunk through the model and cannot precompute anything, so a million forward passes is far too slow and expensive; that is why a bi-encoder first narrows things to about 100 candidates. Criteria: correct metrics, and the point that a cross-encoder cannot be precomputed.

</details>

## Tool calling: letting the model act

[Recording 44:28–57:01](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=2668s)

### Problems RAG cannot solve

Shervine takes over and puts two questions side by side (slides 51–54). "Where is Cuddly?" works with RAG, because Cuddly does not move much and a knowledge base updated daily contains "Cuddly spends most days surrounded by books." "Find a bear near me!" does not: it needs **real-time** data (where bears are now) and needs to know **where you are** (a GPS lookup on your device). RAG would only retrieve stale, static data such as "Cuddle Bear spends his days at the library reading Persian poetry," and the model could only say "Not sure, but check at the library."

### Three steps

Slides 56–58:

1. **The LLM predicts what to call**: given the available function APIs, it does not answer directly but writes "get the location with `my_position()`, then call `find_teddy_bear()`"
2. **The backend executes it**: it actually calls the API and returns `{"name": "Teddy", ...}`. This step has nothing to do with the LLM
3. **The LLM reads the result and answers**: "A happy Teddy is in the room next door!"

The speaker says once you fully internalize these three steps, nothing about tools will scare you. A student asks whether you have to wait during the call: yes, but usually it is not the dominant latency; getting a GPS fix is nearly instant, and a web search is noticeable but typically still faster than generating the answer.

### What a tool looks like

[Recording 50:48](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=3048s)

Slides 59–61 show a full `find_teddy_bear.py`. The speaker highlights three things:

- **The model only sees the API description**: function name, parameters and types, docstring, return type. The code inside (which API it calls, how it computes distance) is not shown to the model, so a clear docstring matters.
- **Inputs should be interpretable**: the parameter is named `location` and its type says `(latitude, longitude)`.
- **Outputs should be interpretable too**: it returns a dataclass with `name`, `distance_meters`, `mood` and `message` fields. The result is fed back for the model to read, which is why tools often use structured types such as enums.

Common tools (slides 63–67) fall into three groups:

| Group | Examples | The speaker's notes |
|---|---|---|
| Real-time information | Web search, weather, stocks, codebase queries | "Searching the web" in the UI is a tool call, and also helps the user tolerate the wait |
| Computation | Calculator, code execution (often Python) | Next-token prediction is poor at arithmetic, so a deterministic program is most reliable; plots you see in a chat are the output of code execution |
| Action | Sending emails or messages, other computer actions | Turn your intent into an email, then send it on your behalf |

**Self-check**: Suppose `find_teddy_bear` has an excellent docstring but returns an unlabeled tuple such as `("Teddy", 12.3, "happy")`. Which step breaks?

<details>
<summary>Answer</summary>

Step 3. The model has to understand what the backend returned and turn it into natural language; without field names it has to guess whether 12.3 is a distance or something else. Criteria: identify "the output must be interpretable by the model" as a step-3 requirement, separate from the step-1 API description.

</details>

## How to teach a model to use tools

[Recording 57:01–1:02:49](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=3421s)

A student asks: is the set of tools a model can use fixed at training time? The speaker says that a year or two ago the answer would have been yes. The practice then was **SFT** with two kinds of examples: one teaching the model to predict the tool call and its arguments from the query and the API list, the other teaching it to turn the backend result back into natural language (slides 68–69).

Not anymore. The training pipeline teaches general tool-use skills (such as using Python), but specific tools are not baked into the weights; instead you use **prompting**, writing clear usage notes in places such as the docstring. The speaker adds that as these become native capabilities, the need for extra explanation keeps shrinking as long as the tool's inputs and outputs are well designed.

So how do you write those descriptions? The speaker asks the class. One student says "have another model write them," and the speaker says that works. Another says "use MCP," and the speaker says that is orthogonal: MCP standardizes where descriptions go, not what to write. His answer (slides 70–71):

1. Collect queries you care about and the **expected answers** (the hardest part to get; you need experts, and LLM-generated synthetic answers often do not match what you want)
2. Run the current prompt to get the **actual answers**
3. Have a reasoning model look at expected and actual answers side by side and iterate on the tool descriptions until the actual answers approach the expected ones

This uses the same kind of input/output pairs as SFT as an evaluation set, except what changes is the prompt, not the weights.

## Many tools: conflicts, tool selection and context bloat

[Recording 1:02:49–1:12:56](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=3769s)

An LLM provider's incentive is to offer as many useful tools as possible. The speaker asks what could go wrong, and a student says "conflicts."

**Benign conflicts.** For "show me my teddy bear's morning routine," either `get_drive` or `get_doc` might pick up the task. Their capabilities overlap, but the result is about the same, so the conflict is benign.

**Problematic conflicts.** For "can you find me my teddy bear?", `list_files` finds `teddy-profile-pic.jpg` on your computer while `find_teddy_bear` tells you it is in the next room. One sentence, two interpretations, completely different answers.

Students push back twice:

- **Isn't that the user's fault for being vague?** Partly, the speaker says, but users often do not know which tools are active, and the people who define the tools and the people who serve them are often different teams. If answers stop matching user intent, you may have enabled too many tools.
- **What about setting temperature to 0 for determinism?** It can help, but quality usually drops, and determinism might just make the vague question "always wrong."

### Tool selection

[Recording 1:08:21](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=4101s)

Instead of facing every tool, the model gets a subset. Slides 84–85 (citing Robert et al. 2024, *Automatic Tool Selection to Reduce Large Language Model Latency*) list four signals a router can use:

| Signal | The speaker's example |
|---|---|
| Conversation | If the chat has been about where a physical teddy bear is, "find my bear" should go to `find_teddy_bear` |
| Memory | Similar, more specific questions the user asked before can guide this one |
| User profile | In a company, finance staff use finance tools, engineers use another set |
| Settings | Which tools the user enabled; whether to suggest enabling one they turned off is a product call |

So tool selection has two steps: the router picks a subset and puts it in context, then the main model chooses within it. The router is usually a very light LLM, since the task is easy but latency matters; it has its own prompt too, for example a rule like "if A is selected, do not select B" to handle overlapping tools.

**Context bloat.** Even with no conflicts and perfect prediction, too many tools still hurt: as the needle-in-a-haystack chart showed, longer context means more misses, a phenomenon the speaker calls context rot. Providers are therefore careful about what goes into context and do not want users to carry a big bundle of tool definitions from the very first query.

## MCP: write a tool once, use it anywhere

[Recording 1:12:56–1:16:18](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=4376s)

Without a standard, giving the same tool to three LLMs means writing it three times in three formats. **MCP** (Model Context Protocol, introduced by Anthropic in 2024) standardizes this. Everyone in the room had heard of MCP, so this part goes quickly.

- **MCP server**: holds the tool implementations and business logic
- **MCP client**: the side that calls the server; the user interacts with the client (slide 89 also draws the host that contains the client, such as Claude Desktop)
- A server offers three kinds of things: **tools** (standardized arguments and outputs), **prompts** (shortcuts into specific workflows that use the tools), and **resources** (data the application layer can provide to the tools)

The speaker's example (slide 90): a book-provider server that recommends poetry to a teddy bear, with tools "find" and "recommend," prompts "find title" and "recommend by taste," and resources such as the bear's personal collection and top-book lists.

## Cost: put fixed content first

[Recording 1:16:18–1:22:54](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=4578s)

The speaker raises his own objection: if we keep stuffing tool instructions into the prompt, won't the bill explode? A student answers: prompt caching. Slide 91 shows the Gemini, Claude and OpenAI pricing pages under the heading "10–40x cheaper" for cached input; the speaker says it is on the order of 10×. He also points out that pricing pages now show "5-minute write" and "1-hour write" columns: the first time you send a prompt you pay a write fee to store it, and within its time to live you can reuse the same opening. For a high-volume flow that reuses it every minute, five minutes is enough.

Then comes a short exercise (slides 92–101). The prompt has three parts:

- **User prompt**: what you are asking this time
- **Tool definitions**: the ones selected by tool selection, or a fixed set
- **User context**: what the provider silently adds, for example "The user's IP address approximately corresponds to Stanford, CA. Today's date is 2026-11-06. It is 4:55 PM PT." Asking what day it is needs no tool; the model reads it from here

The speaker shows three orderings and asks which is good. The first two are "Bad" because the fixed part is not at the front; the right one is **tool definitions → user context → user prompt**. Slide 101's takeaway: "Frontload all fixed parts to the beginning of the prompt!" User context carries the time and changes every request; the user prompt obviously changes; tool definitions, if they are a fixed set or a batch of requests happens to select the same set, form a reusable prefix.

A student asks what happens when you change a tool description: the cache is gone and must be "reheated." The speaker says that is no big deal: you change descriptions at most once a day, while requests arrive by the hundreds every minute.

**Self-check**: An agent's prompt is, in order, "system rules (fixed) → current time → tool definitions (fixed) → user question." How much of it can the cache reuse? How would you fix it?

<details>
<summary>Answer</summary>

Only up to the system rules: the current time changes every request, so the tool definitions after it are no longer part of an identical prefix even though they are the same. Reorder to "system rules → tool definitions → current time → user question," putting both fixed parts before anything that varies. Criteria: say that caching only recognizes an exactly identical beginning.

</details>

## The harness: everything except the model

[Recording 1:22:54–1:33:33](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=4974s)

The speaker says the long time on tool calling was because it is the foundation of agentic systems. He asks who has heard of a harness; everyone raises a hand, and he calls it "the trendy keyword of 2026."

### Definition and analogy

Slides 103–105 cite Databricks' 2026 *What is an AI Agent Harness?*: an agent consists of a **model** and a **harness**, and the harness is everything except the model. Six items are listed:

- Tools
- The succession of actions
- The compaction strategy
- Memory
- All surrounding prompting
- Guardrails

The analogy is a car: the model is the engine and the harness is the rest. They are complementary; a weak model with a strong harness will not work, and neither will the reverse.

### ReAct: observe, plan, act

[Recording 1:24:41](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5081s)

[ReAct](https://arxiv.org/abs/2210.03629) (Yao et al., 2023) formalized what many people were doing in their own ways: given an input, **observe** (summarize what is currently known) → **plan** (decide what to do and which tool to call) → **act** (execute) → observe again, until satisfied, then output. Slides 108–122 walk through a thermostat example step by step:

| Round | Observe | Plan | Act |
|---|---|---|---|
| 1 | The bear is cold, possibly due to room temperature, which is unknown | Check the room temperature | `get_current_room_temperature()` |
| 2 | It is 65°F, about 5°F below a typical comfortable temperature | Raise it by 5°F | `increase_temperature(value=5)` |
| 3 | The thermostat is set to 70°F, which should be warm enough | — | Output: "The thermostat is now set to 70F. Your teddy bear should soon feel warmer." |

The input need not be typed by a user; it can be an external event, such as a metric crossing a threshold.

A student asks whether these three steps are learned in training. Yes: largely during training the model learns to use tools, and it becomes a native capability. Another asks whether reasoning is involved. The speaker says every tool execution needs a step that recaps what happened; that is **necessary** reasoning, different from the extra layer of thinking in reasoning models (see [order 6](/posts/ai/2026-09-29-cme295-llm-reasoning-en)), and non-reasoning models do these three steps too.

### A2A

[Recording 1:28:47](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5327s)

Besides a thermostat agent there could be occupancy, energy-management and air-quality agents, and they need to talk to each other. Tools have MCP; agents have Google's 2025 **A2A** (Agent2Agent). Slide 127 shows the structure: each agent has an `AgentCard` (name, URL, version, list of skills), each `AgentSkill` has an id, a description and examples, and an `AgentExecutor` handles execution and cancellation. The speaker says he will go faster here; this part takes under a minute.

### Context compaction: making room

[Recording 1:29:24](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5364s)

Keep calling tools and you eventually hit the context window limit, at which point you must do something or nothing more fits. Slides 130–132 list three approaches, which can be combined:

| Approach | Based on | The speaker's notes |
|---|---|---|
| Deletion | Whether content is still needed | Many tool outputs are only needed on the next turn and can be removed afterwards |
| Sliding window | Time | The longer ago something was said, the less it matters; keep only recent content |
| Summarization | Generation | The most popular. Structure everything so far into fixed fields and continue the conversation from that short summary |

For the summary fields the slides cite the format in the documentation of Pi, a coding agent: **current progress, constraints, remaining work, references**.

A student asks whether reasoning traces survive compaction. The speaker says it depends on whether they contribute to the fields, but they would usually not be the bulk of what remains; the summary is more a high-level description of what the user wanted, not the reasoning trace as is.

### Memory: information that outlives a conversation

[Recording 1:31:12](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5472s)

Compaction works within one conversation. Keeping information across conversations is memory:

- **Short-term memory**: the speaker says this is just a fancy name for the context window, what has been said so far.
- **Long-term memory**: for example, you once brainstormed holiday gifts and said "a teddy bear could be a great gift," and next time you ask for gift ideas you want it to remember.

Two ways to do long-term memory (slides 135–136):

1. **RAG**: retrieve from past conversations whatever is relevant to the current topic, the same method as the start of the lecture
2. **A memory tool**: in a structured way similar to compaction summaries, when the model notices a cue that something should be remembered, it calls a memory tool to store it, possibly somewhere that is included in the context window every time

**Self-check**: An agent has made 200 tool calls and its context is nearly full. What kind of information does deletion, a sliding window and summarization each drop? Which is most likely to lose a constraint like "the user said at the start not to change the database schema"?

<details>
<summary>Answer</summary>

Deletion drops tool outputs judged no longer needed, which usually does not include constraints. A sliding window keeps only recent content, so a constraint from the first turn is the first to go; this is the highest risk. Summarization with a fixed "constraints" field (as in Pi's format) deliberately keeps it. Criteria: point out that a sliding window drops by time, which conflicts with information whose importance does not decay over time.

</details>

## Coding agents: putting it all together

[Recording 1:33:33–1:38:58](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5613s)

Slides 138–143 use the overview figure from [Liu et al.'s 2026 paper analyzing Claude Code's architecture](https://arxiv.org/abs/2604.14228). The speaker says a coding agent is ReAct at its core: the agent loop in the middle is a series of tool calls and observations. The big difference from ordinary chat is that it touches your system directly, through an **execution environment**. He highlights four spots on the figure:

**Auto-approval.** Whether an action the agent wants to take is safe is a problem ordinary chat does not have. The speaker says about a year ago you had to click allow or deny on every action; that is largely no longer the case. A lighter model looks at everything so far and judges the safety of the proposed action independently.

**Agentic retrieval.** Echoing Afshine's part: coding agents largely skip traditional RAG. Guessing a few variants of what you are looking for and grepping for them is efficient and fast and feeds directly into the reasoning step, which is why you see grep everywhere.

**AGENTS.md: how the agent should behave.** Earlier, user context was something the provider adds and you cannot control; a coding agent lets you write rules it follows every session in [AGENTS.md](https://agents.md/), persisting your preferences.

**Skills: reusable recipes.** For workflows you repeat and do not want to re-describe each time, write a skill ([Agent Skills](https://agentskills.io/)): a folder with prompting and, when needed, the tool calls or scripts to run. The speaker notes that skills are usually not written from scratch: a more efficient way is to do the task end to end once, then ask the coding agent to turn that workflow into a skill.

### The main coding agents

[Recording 1:37:40](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5860s)

Slide 145 splits them into open and closed:

| Open | Closed |
|---|---|
| Codex, Pi, Hermes Agent, DeepSeek Harness (DSH) | Claude Code, Cursor, Antigravity |

The speaker singles out **Pi**: its harness is minimal, with the prompting around each ReAct step kept to a minimum, so you see the model close to its rawest form. That is also why it is often used to compare models under a single harness, which he says the class will see next week (Lecture 7, LLM evaluation).

**Computer use** (slide 146): letting agents control your computer. The speaker says it is currently very inefficient because it takes screenshots and predicts the next action from them, and anyone who has used it may have been frustrated; in two lectures there may be some hope about next steps.

**Self-check**: For "find where this function is called," why does grep beat the semantic retrieval from the first half of the lecture? Conversely, what kind of question does grep miss?

<details>
<summary>Answer</summary>

You are looking for an exact identifier; grep lists every exact match, quickly and without misses, while semantic retrieval returns code that is "similar in meaning" but not that function. grep misses questions phrased in natural language without the exact name, such as "where do we handle failed user logins?"; then the agent must guess possible names first and search for those. Criteria: state the difference between exact matching and similarity in meaning.

</details>

## Discussion: multiple agents, wins and risks

[Recording 1:38:58–1:40:43](https://www.youtube.com/watch?v=nU2a2lm6vDE&t=5938s)

Slides 148–149 cite two orchestration patterns from the Claude Code docs:

- **Subagents**: each has a specific task and they do not communicate. Used to spin off work that does not need much reasoning and can be delegated. The speaker says they have a cost: each one needs its own context, a full agent loop of its own, which is why minimal harnesses such as Pi boast of not supporting them or supporting them minimally.
- **Agent team**: the subagents become "teammates" with a communication channel to share progress and divide work. The speaker refers to this kind of multi-agent collaboration as agent swarms and says it is a growing use case.

The last two slides are a contrast. "Wins" shows OpenAI's September 8, 2026 announcement "On the Navier–Stokes Millennium Prize Problem"; the speaker mentions recent mathematical advances made this way. "Vulnerabilities" shows OpenAI's July 21, 2026 announcement "OpenAI and Hugging Face partner to address security incident during model evaluation," which the speaker calls the Hugging Face hack, recommending a Black Hat talk from August 2026 and a METR report from the same month. He closes on these two slides: the more power you give agents, the more they can do and the more vulnerabilities they expose.

## Syllabus topics the lecture did not expand on

This section is this post's own summary, not lecture content.

- **Harness optimization**: the lecture defined the harness but did not cover changing it systematically. Comparing harnesses by repeatedly scoring them on a fixed task set is exactly the agent evaluation of the next lecture (see [order 8](/posts/ai/2026-09-29-cme295-llm-evaluation-en)). Research that hands the harness itself to another agent for automated search is summarized in our post on [meta-harness layers](/posts/ai/2026-08-26-meta-harness-layers-en).
- **Plugins**: not mentioned. How skills, hooks and plugins layer in mature coding agents is covered in [this breakdown](/posts/ai/2026-08-30-coding-agent-hooks-skills-plugins-en).
- **Compaction details**: the lecture only lists three approaches. How various coding agents actually handle a full context is in [What to do when the context is full](/posts/ai/2026-08-21-context-full-seven-answers-en); the design space for memory systems is in [four kinds of memory and six design axes](/posts/ai/2026-09-19-agent-memory-taxonomy-en).

## Connecting back to the models you use

- **When building RAG**: build a small evaluation set labeled for relevance and compute Recall@k and NDCG@k before deciding whether to add BM25 hybrid search, HyDE or a re-ranker. Without one, tuning chunk size is guesswork.
- **When writing tools**: the docstring and parameter names are all the model sees; return structured outputs with named fields. If answers start missing user intent because there are many tools, consider tool selection before writing longer descriptions.
- **When assembling prompts**: put fixed content such as system rules and tool definitions first, and the time, user data and question after. A single changing timestamp at the start kills the cache.
- **When using coding agents**: put rules to follow every session in AGENTS.md; after doing a repeated workflow once, ask the agent to turn it into a skill; every subagent adds its own context cost.

## Compared with the 2025 edition

| 2026 Lecture 6 content | 2025 (Lecture 7) | What changed in 2026 |
|---|---|---|
| RAG, two-stage retrieval, evaluation metrics | Covered, nearly the same structure (contextual retrieval with prompt caching was already there) | Added "use grep for code" |
| Tool calling, teaching methods, use cases | Covered (with a one-line "use SFT pairs as evaluation + a reasoning model writes the description") | States that prompting has replaced SFT, and uses an expected/actual table to show how to iterate descriptions |
| Tool selection, MCP | Covered | Added context bloat, prompt caching and the prompt-ordering exercise |
| Agent definition | A quoted definition of an agent | Now "model + harness" |
| ReAct, A2A | Covered | Largely the same; A2A only mentioned briefly |
| Context compaction, memory | None | New |
| Coding agents, AGENTS.md, skills, computer use | Only "Personal favorite use case: coding!" on the last slide | A whole new segment |
| Subagents, agent teams | None | New |
| Agent safety (ToolSword, Agent-SafetyBench) | A section | Replaced by the final "vulnerabilities" slide |

The 2025 recording: [Lecture 7, Agentic LLMs](https://www.youtube.com/watch?v=h-7S6HNq0Vg).

## Cumulative self-check

Questions 1–8 are adapted from Part III, "Agentic LLMs," of the [2025 final exam](https://cme295.stanford.edu/exams/fall25-cme295-final.pdf), with answers in the [solutions PDF](https://cme295.stanford.edu/exams/fall25-cme295-final-solutions.pdf). Question 6 (a nonexistent tool) and the second half of question 8 (a tool returning an error) are not covered directly in the 2026 lecture and have to be inferred from tool descriptions, the router and ReAct's observe step; everything else they test is covered. Questions 9 and 10 are written by this post for the new 2026 segments. The 2026 final exam is on December 9.

1. Which limitation of frozen LLMs does RAG primarily solve? (Q III.1)
2. What does "contextual retrieval" mean in RAG? (Q III.2)
3. What is the ReAct framework? (Q III.3)
4. After an LLM outputs `find_teddy_bear(loc='Stanford')`, who executes the function? (Q III.4)
5. MCP standardizes the connection between which two ends? (Q III.5)
6. An agent hallucinates a tool that does not exist. What is a common remedy? (Q III.7)
7. Why might one use RAG even with a 1M-token context window? Name one challenge specific to RAG. (Q III.9)
8. Describe the three steps of a tool execution loop. What happens if the tool returns an error? (Q III.10)
9. Using the lecture's harness definition, place "the tool-selection router," "the compaction summary fields" and "AGENTS.md" under the six items.
10. A service sends 3,000 tokens of tool definitions with every request, and cached input costs 1/10 of normal input. What do those 3,000 tokens cost (normal input price = 1) when placed at the start of the prompt versus after the user question?

<details>
<summary>Criteria for questions 9 and 10</summary>

- Question 9: the router belongs under "tools" (it decides which tools the model gets this time), or arguably surrounding prompting; the compaction summary fields belong under "compaction strategy"; AGENTS.md belongs under "all surrounding prompting," and it also acts as cross-session memory. There is no single answer; give reasons.
- Question 10: at the start with a cache hit, about 3,000 × 0.1 = 300; after a user question that differs every time, the prefix differs, nothing is cached, and the cost is 3,000. This ignores the one-time cache write fee.

</details>

## Going deeper

- The full guide to the same topics in 2025 (with slide details on tool calling, MCP and A2A): [Lecture 7 guide](/posts/ai/2026-09-29-cme295-agentic-llms-en)
- How contextual retrieval works and how well: [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval-en)
- ReAct inside a RAG loop: [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop-en)
- A coding agent's full loop: [How Claude Code works](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en)
- Learning coding-agent design from source: [Learning from mature coding agents: series overview](/posts/ai/2026-08-30-coding-agent-design-series-overview-en)
- The other new 2026 lectures: [RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en), [LLM systems](/posts/ai/2026-09-29-cme295-llm-systems-en), [Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en)

## Course video sources

This post is based on the CME295 2026 Lecture 6 recording ([Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 6 - AI Agents](https://www.youtube.com/watch?v=nU2a2lm6vDE), 1:40:43) and the [2026 slides](https://cme295.stanford.edu/slides/fall26-cme295-lecture6.pdf); the player is in the introduction. The captions are YouTube's human-made English captions; names follow the slides.

Content check: verified against the video transcript (2026-11-23): read the full human-made English captions with timestamps; section timestamp links come from the caption timecodes; classroom explanations and Q&A are paraphrased from the captions, while formulas, numbers and examples follow the slides (pages 25, 45–48, 59–61, 84–85, 89–91, 101, 105, 108–122, 127, 130–136, 138–145, 148–151).

Course and recording entries:

- [Official 2026 syllabus](https://cme295.stanford.edu/syllabus/)
- [CME295 Autumn 2026 playlist](https://www.youtube.com/playlist?list=PLakGfbKCei80)

Checked: 2026-11-23.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The 2026 Lecture 6 recording is not yet published; the 2025 Lecture 7 video is included as related supplementary material.
- 2026-10-10: Checked the video content against its transcript. The video is 2025 Lecture 7 and does cover tool calling, MCP and retrieval, matching the post's "related supplement" label; there is no 2026 Lecture 6 video to check against.
- 2026-11-09: Rechecked video status. The official syllabus now lists the Lecture 6 slides; the recording is still not available, so the status is unchanged.
- 2026-11-23: Rewrote the whole post from the 2026 Lecture 6 captions and the 152-slide deck. It now follows the actual lecture order (retrieval → tool calling → harness → coding agents → discussion) and adds two-stage retrieval, NDCG and the other metrics, grep, tool conflicts and tool selection, the prompt-caching ordering exercise, the harness definition, three kinds of compaction, short- and long-term memory, auto-approval, AGENTS.md, skills, subagents and agent teams. Removed the sections on MCP spec changes, Meta-Harness and various engineering posts that the lecture did not cover. Moved the recording to the introduction, set the status to videos included, and added timestamp links and self-checks to each section.

## References

- [CME 295 2026 syllabus](https://cme295.stanford.edu/syllabus/)
- [2026 Lecture 6 slides (PDF)](https://cme295.stanford.edu/slides/fall26-cme295-lecture6.pdf) / [recording](https://www.youtube.com/watch?v=nU2a2lm6vDE)
- [2025 Lecture 7 slides (PDF)](https://cme295.stanford.edu/slides/fall25-cme295-lecture7.pdf) / [recording](https://www.youtube.com/watch?v=h-7S6HNq0Vg)
- [2025 final exam](https://cme295.stanford.edu/exams/fall25-cme295-final.pdf) / [solutions](https://cme295.stanford.edu/exams/fall25-cme295-final-solutions.pdf)
- [Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Kamradt, Needle in a Haystack (2023)](https://github.com/gkamradt/needle-in-a-haystack)
- [Reimers & Gurevych, Sentence-BERT (2019)](https://arxiv.org/abs/1908.10084)
- [Gao et al., Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE, 2022)](https://arxiv.org/abs/2212.10496)
- [Anthropic, Introducing Contextual Retrieval (2024)](https://www.anthropic.com/research/contextual-retrieval)
- [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models (2023)](https://arxiv.org/abs/2210.03629)
- [Liu et al., Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems (2026)](https://arxiv.org/abs/2604.14228)
- [AGENTS.md](https://agents.md/)
- [Agent Skills](https://agentskills.io/)
- [Reading Stanford CME295 (series overview)](/posts/ai/2026-09-29-cme295-course-overview-en)
