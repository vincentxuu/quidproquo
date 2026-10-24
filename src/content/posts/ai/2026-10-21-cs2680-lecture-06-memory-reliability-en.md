---
title: "Agent Memory and Reliability: What to Write, How Long to Keep It, and Which Layer Failed | Harvard CS2680 Lecture 6"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-memory, agent-reliability, agent-harness, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 8
tldr: "The first half of CS2680 Lecture 6 (2026-09-28) is about agent memory. Keeping one fact means deciding, in order, whether to write it, what form it takes, where it lives, when to retrieve it, whether to generalize from it, and whether it still holds, plus who owns the memory. Don't simply delete outdated facts; record when they were true and where they came from. The second half is about reliability: at 95% success per step, a 20-step run is fully correct only about 36% of the time. Failures can be traced to five layers (task spec, harness, model, tool, environment), each with its own fixes. The two halves meet at one harness-layer failure: treating a stale note as fact."
description: "Guide to Lecture 6 of Harvard CS2680 Modern AI Systems (Fall 2026): six design decisions for memory plus ownership, four representations and four kinds of storage, valid time and provenance, Mem0, Graphiti, and supermemory, eight memory failures and the traps in memory benchmarks, then compounding errors, five-layer fault attribution, and designing for failure. Based on the public slides, with product behavior checked against official docs and numbers checked against the original papers."
draft: false
glossary:
  - term: "valid time"
    aliases: ["validity window"]
    definition: "The interval during which a fact is true in the real world. When a fact changes, the old fact isn't deleted; it gets an end time and is marked as superseded, so queries can tell \"what is true now\" from \"what was true then\"."
    context: "Lecture 6 illustrates it with \"vLLM in April, switched to SGLang in June.\""
  - term: "provenance"
    aliases: ["source"]
    definition: "Where a memory came from: which conversation, which document, and how confident you are in it. With provenance you can go back and check when memories contradict each other, and you can find untrusted content that got written in."
    context: "Lecture 6 lists it next to valid time as the two fields every memory needs."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability)

**Video status: The course is not recorded.** This post is based on the public slides; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 6 of [CS2680](https://cs2680.com/) met on September 28, 2026, under the title "Agent design III: memory and reliability" ([slides](https://cs2680.com/slides/6_agent_design_3.pdf)). [Lecture 5](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture-en) covered how to put several agents together. This lecture comes back to a single agent and asks two things: how does it remember what it learned last time, and when it fails, where did it go wrong?

The lecture answers two questions: how should you make each memory decision, and when an agent fails, how do you tell which layer broke? By the end you should be able to answer a memory design checklist for an agent. You should also be able to assign a failure case to one of five layers and name the matching fix.

The slides have two parts: memory (p5–21) and reliability (p22–30). The outline on p3 says it will continue Lecture 5's multi-agent material, but p4 is blank and that part never appears. The background comes from two earlier lectures: [CLAUDE.md and auto memory in Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en#claudemd-and-auto-memory), and [the ways to manage context in Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en#four-ways-to-manage-context).

## Memory: six decisions to keep one fact

### The context window is not memory

The slides start by separating two things (p5):

- The **context window** is temporary working state. When the conversation ends, or the context gets compacted, what was in it is gone.
- The **memory store** is state kept across interactions. The harness stores it outside the context and brings it back when needed.

Lecture 2 said the context is a kind of memory that disappears; Lecture 4's offloading puts things outside the context and reads them back when needed. This lecture turns "put it outside, bring it back" into a pipeline, where every step is a policy you have to decide.

### Six decisions, plus a question of ownership

The slides walk through a memory's life with six questions (p6):

| Stage | The question |
|---|---|
| Write or skip | Is it worth keeping? |
| Encode / organize | What should it become? |
| Store | Where should it live? |
| Retrieve | Does this task need it? |
| Reflect / generalize | What broader lesson follows? |
| Keep / update / delete | Is it still valid? |

There is one more question beyond the six: who owns the memory? The agent can keep its own files, or it can hand memory to a dedicated service. Slide p17 gathers the six steps into a design checklist, a reminder that each step is a policy decision; the final self-check in this post uses it for practice.

Let's walk through the same sentence the slides use from start to finish: in conversation 28, the user says, "We moved serving from vLLM to SGLang."

### Write or skip: recall versus noise

If you write every interaction, you miss less but collect more noise; if you write selectively, what you keep is more precise but you may miss something useful (p7). The slides list four ways to trigger a write:

- The user explicitly says "remember this."
- Fixed rules, such as detecting sentences like "we switched to…"
- A small classifier decides whether something is worth keeping.
- An LLM periodically reviews a batch of conversations and picks what to keep.

[Claude Code's auto memory](https://code.claude.com/docs/en/memory#auto-memory) is one example. It doesn't write every time; it first judges whether the information will be useful in a future conversation, and it skips anything it can derive from the code or git history. If you say "remember to use pnpm," it saves that too.

### What form it takes

The same sentence can be stored in four forms (p8):

| Representation | Example | Trade-off |
|---|---|---|
| Raw events / episodes | "We moved serving from vLLM to SGLang." | Most complete, but large and redundant |
| Unstructured summary | "Uses SGLang for model serving." | Compact, but may lose context (what was replaced?) |
| Structured state | `{"serving_engine": "SGLang"}` | Queryable, but the fields must be defined in advance |
| Knowledge graph | Project → USES → SGLang | Links entities, and can record how relationships change over time |

Look at the summary row: the fact that the project moved over from vLLM is gone. If someone later asks "what did we use before?", a system that only stored the summary can't answer.

### Where it lives: what each kind of storage is good at

One slide lists four kinds of storage and ten product names (p9). If you don't know databases well, start with one idea: **each kind of storage is good at answering different questions**. The "questions it can answer" column below is this post's addition:

| Storage | Examples on the slide | Good at | Questions it can answer about the SGLang memory |
|---|---|---|---|
| Plain files | CLAUDE.md, scratchpad | Human-readable, diffable, greppable | "Do the notes mention SGLang?" (keyword search) |
| Key-value or relational database | Redis, SQLite, Postgres JSONB | Exact lookup, filtering, transactions (several writes either all succeed or none count) | "What is project A's serving_engine field right now?" |
| Vector store | pgvector, Chroma, Pinecone | Finding content with similar meaning | "Which inference engine do we use?" It finds the answer even though the question never says "SGLang" |
| Graph database | Neo4j, FalkorDB (used by Graphiti) | Following relationships several hops | "Which projects use the same serving stack as project A?" |

A vector store relies on embeddings: a piece of text becomes a list of numbers, and texts with similar meanings get similar numbers, so you can find related content by "distance" ([Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en#finding-code-four-approaches) introduced this under semantic search). A graph database stores "project" and "SGLang" as nodes and "uses" as an edge, which suits multi-hop questions like "A connects to B; what does B connect to?"

### When to read and when to write

There are three ways to time reads and writes (p10):

- **Automatic**: every turn, search memory first, then call the model, then write back. Simple and predictable, but each turn adds latency and often pulls in irrelevant memories.
- **Runtime-controlled**: the harness uses rules or a classifier to decide whether to search or store this turn. Cheaper, but someone has to write the rules.
- **Model-controlled**: give the model tools like `search_memory` and `add_memory` and let it decide. The most flexible, but the model may skip reads or writes it should have made.

The slides note that many systems are hybrids, and that reads and writes can follow different policies. Claude Code is a hybrid. The `MEMORY.md` index loads automatically at the start of every conversation, up to its first 200 lines or 25KB. Details live in separate topic files, which the model reads with its file tools when needed ([official docs](https://code.claude.com/docs/en/memory#how-it-works)).

### Retrieval: semantic similarity is only one signal

The most basic retrieval pipeline runs the query through vector search, takes the top k matches, and puts them in the prompt (p11). This is what [RAG](https://arxiv.org/abs/2005.11401) (2020), on the reading list, does: it moves knowledge out of the model's weights into an external index you can edit. The slides point out that semantic similarity is just one of five signals:

- **Semantic match**: the meaning matches the query.
- **Scope**: the same user, project, entity, or task.
- **Importance**: the cost of missing it or including it.
- **Validity**: is it still true for this task at this time?
- **Provenance**: where it came from, how confident you are, what the evidence is.

Relying on meaning alone causes trouble. "We use vLLM" and "We use SGLang" are equally similar to the query; only validity tells you which one is out of date.

### Generalizing: from a few events to a rule

The user has asked about vLLM, SGLang, TRT-LLM, and LLM scheduling, so the system can generalize to a hypothesis: "this person has an ongoing interest in LLM inference systems," with medium confidence (p12). The slides suggest generalizing at two kinds of moments: after enough new evidence (for example every N events, or when the context fills up), or when facts conflict or repeat. Do it in a background job when possible, so it doesn't block the main flow.

Mark generalized conclusions with a confidence level, because turning one event into a lasting preference is exactly the "overgeneralization" failure that comes later.

### Forgetting, and "when it was true, where it came from"

The slides call forgetting a first-class operation that needs as much design as writing (p13). There are four reasons to forget: the information is stale, it is wrong or conflicting, privacy and security, and storage and retrieval cost. There are also four mechanisms: mark it invalid, erase it permanently, let it expire after a TTL (time to live), or move it into tiers and evict it from active memory.

Marking something invalid is very different from erasing it. Slide p14 uses the SGLang example to show that a memory needs two fields:

- **Valid time**: when the fact was true. In April 2026, "the project serves models with vLLM," now marked superseded; from June, "the project serves models with SGLang," marked current.
- **Provenance**: where the fact came from. The relation "Project → SERVES_WITH → SGLang" traces back to the original words in conversation 28.

Keeping the old fact and only marking its time lets you answer both "what do we use now?" and "what did we use in April?" Real products do this. [Graphiti](https://github.com/getzep/graphiti) says that when information changes, old facts are "invalidated — not deleted," and every fact can be traced back to the episodes that produced it. Claude Code's approach is much lighter, but it points the same way. When a memory file starts with frontmatter, it records the write time, so both you and the model can see how fresh the entry is. When the index nears its limit, Claude is reminded to merge or drop stale entries ([official docs](https://code.claude.com/docs/en/memory#how-it-works)).

### Who owns the memory

The last question is ownership (p15):

- **Agent-owned**: memory is files in the harness, such as CLAUDE.md, a scratchpad, or task notes, which the harness writes to disk.
- **A dedicated memory system**: memory is an API that can be shared across agents and sessions.

The slides compare three dedicated systems (p16). The "status" column is this post's addition, checked against the official docs:

| System | The slide's description | Status (2026-10) |
|---|---|---|
| [Mem0](https://docs.mem0.ai/core-concepts/memory-types) | Fact-centric; scoped by user, agent, or run; vector search with filters, optional graph memory | The platform version now ranks with four signals together (semantic, keyword, entity, time); graph memory is on automatically and no longer connects to an external graph database; the April 2026 algorithm only adds memories and never overwrites old ones |
| [Graphiti](https://github.com/getzep/graphiti) | Temporal knowledge graph; extracts entities and time-aware facts from conversations; hybrid semantic, keyword, and graph search | Matches the slide; it is the core component of the [Zep](https://arxiv.org/abs/2501.13956) memory service |
| [supermemory](https://github.com/supermemoryai/supermemory) | Maintains a user profile alongside memory and document search | Matches the slide; it also claims to handle contradictions and expire outdated information automatically |

Mem0's change is a useful contrast with the forgetting section. Its automatic writes no longer overwrite old facts: "I moved to Seattle" sits alongside "I live in Austin," and retrieval uses time signals to tell which is newer. To actually change or remove a memory, the application has to call update or delete explicitly ([Mem0 docs](https://docs.mem0.ai/core-concepts/memory-types)).

Slide p21 draws the two kinds of ownership as two stacks. On the left, memory is its own layer, with vector, SQL, graph, and other stores underneath; on the right, memory management lives inside the runtime, and storage is just markdown files. A question mark sits between the two columns; the slide doesn't say which is better. Both stacks list Claude Code, Letta, and Codex at the top, meaning the same agent can be wired either way. According to the official docs, Claude Code currently uses the right-hand approach.

[MemGPT](https://arxiv.org/abs/2310.08560), on the reading list, is where a different line of work starts: letting the model manage its own memory. It treats the context window as an operating system's main memory and external storage as disk. When the context nears full, it issues a warning, and the model moves data in and out with function calls. The MemGPT team later built [Letta](https://github.com/letta-ai/letta); the slide places Letta's built-in memory in the memory-management layer of the left-hand stack.

### Eight memory failures

The slides list eight ways memory goes wrong (p18). The "decision to revisit" column is this post's addition, pointing to which design decision to check:

| Failure | The slide's description | Decision to revisit |
|---|---|---|
| Retrieval miss | A relevant memory exists but isn't found | Retrieve |
| Context pollution | Too many irrelevant memories enter the context | Retrieve, read/write timing |
| Memory hallucination | An inference is stored as fact: "studying at Harvard" becomes "visiting student at Harvard" | Encode, provenance |
| Staleness | An old fact overrides newer information | Keep/update/delete, valid time |
| Isolation failure | Memory crosses a user boundary | The "scope" in retrieval, ownership |
| Overgeneralization | One event becomes a durable preference | Generalize |
| Persistent prompt injection | Untrusted content is stored and later retrieved as instructions | Write or skip, provenance |
| Unbounded growth | Size grows with lifetime, so retrieval gets slower and worse | Forget |

Persistent prompt injection is not hypothetical. The [MINJA](https://arxiv.org/abs/2503.03704) study shows that an attacker who never touches the memory bank can, just by sending ordinary queries to the agent, get the agent to write malicious records into its own memory. Later, when another user sends a query, those records get retrieved.

### How to evaluate memory

The slides group memory metrics into four sets (p19):

- **Retrieval**: precision and recall: how many retrieved memories are correct, and how many of the ones that should be retrieved are.
- **Writes and updates**: precision, recall, plus the rate of stale memories.
- **Governance**: whether deletion requests are honored and scope isolation holds.
- **System**: latency, extra tokens, and how fast storage grows.

Whole memory components are often tested with three benchmarks (p20), which mainly test whether an agent can remember and reason over a long history of user–assistant conversation:

| Benchmark | Scale |
|---|---|
| [LoCoMo](https://aclanthology.org/2024.acl-long.747/) (ACL 2024) | 10 long conversations, the commonly used 1,540 questions |
| [LongMemEval](https://arxiv.org/abs/2410.10813) (ICLR 2025) | 500 questions covering 5 memory abilities |
| [BEAM](https://arxiv.org/abs/2510.27246) (ICLR 2026) | 100 conversations, 2,000 questions, conversations up to 10 million tokens |

Read these scores with three cautions:

- **1,540 is not every question.** LoCoMo's 10 public conversations have 1,986 questions in total; the common 1,540 is what's left after removing 446 adversarial questions. Those questions test whether a system says "I don't know" when it doesn't.
- **The judge may be too lenient.** LoCoMo-Refined, listed in the corner of p20, is a third-party recalibration. Its authors found that the original scoring counted answers that were right on topic but wrong in detail as correct, so they revised 337 questions and switched to a stricter LLM judge ([README](https://github.com/mem-eval-suite/LoCoMo_refined)).
- **Look at the full-context baseline.** An independent audit fed the whole conversation straight to the model and scored 92.62%, higher than EverMemOS (92.32%), the system claiming the top score. The auditor argues the gap comes from the answering prompt, not the memory system ([locomo-audit](https://github.com/dial481/locomo-audit)). The audit isn't a peer-reviewed paper, but it makes a point: a memory system is only useful if it beats "put everything in the context."

The READMEs of both [Mem0](https://github.com/mem0ai/mem0) and [supermemory](https://github.com/supermemoryai/supermemory) claim to lead on these benchmarks (Mem0, for instance, reports 92.5 on LoCoMo), and the numbers are their own.

> **Self-check**: three weeks ago, the user said in a conversation, "run `make check` before deploying." Yesterday the team renamed that command to `make verify` and mentioned it once in a conversation. Both sentences are already in memory. Now the agent runs `make check` before deploying again. Which of the eight failures is this? Which of the six decisions need to change?
> Answer: staleness: an old fact overrode newer information. Two things need to change. First, keep/update/delete: when yesterday's sentence came in, the old rule should have been marked superseded, not just joined by a new entry. Second, retrieval: use valid time as a ranking signal, so when both entries come back, the currently valid one wins.

## Reliability: which layer failed

### The bridge: treating a stale note as fact

The two halves meet at p26. The harness failure table has a row called "memory error": the harness recalls a stale note as fact, and the agent edits a file that has moved. The fix is to date memories and re-check them before use. The first half was about designing memory well; the second half steps back: memory is only one place an agent can go wrong, so what about the others?

> **Self-check**: following a note it saved three weeks ago, an agent calls an API that was deleted last week. Which layer failed? How do you fix it?
> Answer: by the slides' classification, this is a harness-layer "memory error": the harness recalled a stale note as fact (p26). The fix is to date memories and re-check them before use; in the first half's terms, memories need valid time and provenance, and when the API is deleted the old note should be marked invalid, or a forgetting policy should let it expire. The model acted on what was in its context, so the problem isn't at the model layer.

### Errors compound

Why is reliability hard? The slides explain with a simple model (p22): assume each step independently has a 95% chance of being right, and a run succeeds only if every step does.

| Steps | Chance every step is right |
|---|---|
| 1 | 95% |
| 5 | 77% |
| 10 | 60% |
| 20 | 36% |
| 50 | 8% |

For a 50-step task, roughly 1 run in 13 finishes with no errors.

These numbers point to two directions for improvement; the arithmetic below is this post's addition. At 20 steps and 0.95 per step, the success rate is 0.95²⁰ ≈ 0.36:

- **Halve the steps**: at 10 steps, 0.95¹⁰ ≈ 0.60.
- **Raise each step to 0.99**: at 20 steps, 0.99²⁰ ≈ 0.82.

Just 4 more percentage points per step takes the overall success rate from about a third to over four-fifths. That is also the shared goal of every layer's fixes later on: make each step more reliable, or use fewer steps.

```diagram
title: At 0.95 versus 0.99 per step, the gap widens as steps add up
desc: At 0.95 per step, the chance of getting every step right drops to about 36% at 20 steps and about 8% at 50; at 0.99 per step, it is still about 82% at 20 steps and about 61% at 50.
caption: Computed under p22's assumption that each step is independent and a run succeeds only if every step does. Mapping: y = 300 − probability(%) × 2.4, x = 80 + 8.4 × steps, y-axis starts at 0. The 0.95 line matches p22; the 0.99 line is this post's addition.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Chance every step is right (%)</text>
  <line class="dg-grid" x1="72" y1="60" x2="508" y2="60"/>
  <line class="dg-grid" x1="72" y1="120" x2="508" y2="120"/>
  <line class="dg-grid" x1="72" y1="180" x2="508" y2="180"/>
  <line class="dg-grid" x1="72" y1="240" x2="508" y2="240"/>
  <line class="dg-grid" x1="248" y1="60" x2="248" y2="300"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">75</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">25</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="508" y2="300"/>

  <g class="dg-c-s1">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,60.0 122,71.8 164,82.9 206,93.6 248,103.7 290,113.3 332,122.5 374,131.2 416,139.4 458,147.3 500,154.8"/>
    <text class="dg-sub dg-text--series" x="512" y="154.8" dominant-baseline="central">0.99/step: 61%</text>
    <text class="dg-sub dg-text--series" x="256" y="88" dominant-baseline="central">20 steps: 82%</text>
  </g>
  <g class="dg-c-accent">
    <polyline class="dg-plot-line" points="80,60.0 122,114.3 164,156.3 206,188.8 248,214.0 290,233.4 332,248.5 374,260.1 416,269.2 458,276.1 500,281.5"/>
    <circle class="dg-point" cx="80" cy="60.0" r="4"/>
    <circle class="dg-point" cx="122" cy="114.3" r="4"/>
    <circle class="dg-point" cx="164" cy="156.3" r="4"/>
    <circle class="dg-point" cx="206" cy="188.8" r="4"/>
    <circle class="dg-point" cx="248" cy="214.0" r="4"/>
    <circle class="dg-point" cx="290" cy="233.4" r="4"/>
    <circle class="dg-point" cx="332" cy="248.5" r="4"/>
    <circle class="dg-point" cx="374" cy="260.1" r="4"/>
    <circle class="dg-point" cx="416" cy="269.2" r="4"/>
    <circle class="dg-point" cx="458" cy="276.1" r="4"/>
    <circle class="dg-point" cx="500" cy="281.5" r="4"/>
    <text class="dg-label dg-text--series" x="512" y="281.5" dominant-baseline="central">0.95/step: 8%</text>
    <text class="dg-label dg-text--series" x="256" y="196" dominant-baseline="central">20 steps: 36%</text>
  </g>

  <text class="dg-small" x="80" y="320" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="164" y="320" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="248" y="320" text-anchor="middle" dominant-baseline="central">20</text>
  <text class="dg-small" x="332" y="320" text-anchor="middle" dominant-baseline="central">30</text>
  <text class="dg-small" x="416" y="320" text-anchor="middle" dominant-baseline="central">40</text>
  <text class="dg-small" x="500" y="320" text-anchor="middle" dominant-baseline="central">50 steps</text>
</svg>
```

The slides themselves note that this assumes each step is independent, and they add that real runs are worse because errors propagate. Later research backs this up: [Sinha et al. (2025)](https://arxiv.org/abs/2509.09677) found that when the context contains the model's own earlier mistakes, it is more likely to make the next one, so per-step accuracy falls as the number of steps grows. On the other hand, [Toby Ord (2025)](https://arxiv.org/abs/2505.05115) fit METR's suite of research-engineering tasks and found that an exponential model explains them well: for each extra minute a human would need for the task, the agent picks up a constant extra chance of failing. He also says it is unknown whether this holds for other task suites.

> **Self-check**: an agent needs 30 steps to finish a task, succeeds 0.97 of the time per step, and has to rerun on failure. You can pick one option: raise each step to 0.99, or split the task into two 15-step halves, with a person checking after each half (assume errors are caught at the end of a half and only that half is redone). For each option, what is the chance of getting the whole task right in one go? On average, how many steps does it take to finish?
> Answer: the baseline is 0.97³⁰ ≈ 0.40; a failure means starting over, so on average about 30 ÷ 0.40 ≈ 75 steps. At 0.99: 0.99³⁰ ≈ 0.74, about 41 steps on average. Split in two: each half is 0.97¹⁵ ≈ 0.63, so the whole task is still right in one go only 0.63² ≈ 0.40 of the time, but a failure only redoes that half, about 2 × 15 ÷ 0.63 ≈ 47 steps on average. Splitting doesn't raise the chance of a clean first run; it saves rework. Raising per-step reliability improves both. You can use the two together.

### Five sources of failure

The slides divide the origin of a fault into five layers (p24), each with one question:

| Layer | The question | The failure is called |
|---|---|---|
| User / task spec | Was the goal unambiguous? | Specification failure |
| Agent harness | Did context, the loop, or scheduling go wrong? | Harness failure |
| LLM | Did reasoning or planning go wrong? | Model failure |
| Tool layer | Did the shell, browser, or an API go wrong? | Tool failure |
| Environment | Did the repo, OS, web, or a service go wrong? | Environment failure |

This series assigns every failure to one of these five layers. The six decomposition failures in [Lecture 5](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture-en) count as harness failures here, because the harness decides how work is split. The five failures in [Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en) are spread across the model, harness, tool, and environment layers, yet all their fixes are written in the harness. The layer that failed and the place you fix it aren't always the same.

The five tables below are taken from p25–29; each row is one case from the slides.

**Task specification** (p25):

| Failure | The spec said | The agent did | The fix |
|---|---|---|---|
| Ambiguous goal | "Fix the login bug" | Of three possible bugs, fixed one the user didn't mean | Name the file, symptom, and repro steps |
| Proxy objective | "Make the tests pass" | Deleted the failing test | Forbid test edits; review the diff |
| Unstated constraint | "Speed up search" | Broke the public API | State what must not change |
| No definition of done | "Clean up the parser" | Never stopped refactoring | Give an exit test and a stop rule |
| Conflicting goals | "Minimal diff, every edge case" | Silently dropped the edge cases | Rank the goals explicitly |

**Agent harness** (p26):

| Failure | The harness did | The effect | The fix |
|---|---|---|---|
| Context truncation | Trimmed the oldest turns | Forgot the "keep the API" rule | Pin key rules outside the window and put them back every time |
| Memory error | Recalled a stale note as fact | Edited a file that had moved | Date memories; re-check before use |
| State corruption | Kept a half-applied edit | Later steps built on broken files | Checkpoint; roll back failed steps |
| Control loop error | Set no step or cost budget | 200 steps, no progress | Cap steps, cost, and time |
| Blocking fan-out (several sub-agents dispatched at once) | Waited on every sub-agent | One slow child stalled the run | Set timeouts; use partial results |

**Model** (p27):

| Failure | The model reasoned | The agent did | The fix |
|---|---|---|---|
| Hallucination | "`requests.fetch()` exists" | Called a nonexistent function | Check calls against the real docs |
| Instruction violation | "Speed matters more than the API" | Changed a signature it was told to keep | Restate constraints; check the diff |
| Faulty reasoning | "A timeout means the network is down" | Added retries to a deadlock | Test the hypothesis before fixing |
| Reasoning–action mismatch | "I'll only touch parser.py" | Rewrote three other files | Compare each action to the plan |
| Unverified success | "Tests probably pass now" | Declared done, ran nothing | Require test output as proof |
| Long-horizon degradation | "The config still needs fixing" | Undid its own fix from step 12 | Re-read state; split into short tasks |

**Tool** (p28):

| Failure | The tool returned | The agent did | The fix |
|---|---|---|---|
| Truncated output | The first 100 lines of a log | Missed the error on line 4,000 | Return errors first; allow paging |
| Silent failure | Exit 0, empty result | Assumed there were no matches | Separate "empty" from "failed" |
| Ambiguous schema | A date with no time zone | Scheduled the job 8 hours off | Use typed, explicit schemas |
| Flaky call | A timeout on the first try | Declared the service down | Retry with backoff before judging |
| Misleading error | "Permission denied" on a typo | Retried with sudo | Return precise, actionable errors |

**Environment** (p29):

| Failure | The environment had | The agent did | The fix |
|---|---|---|---|
| Stale state | Yesterday's cached build | Passed tests on old code | Build clean from a fresh cache |
| Version mismatch | Python 3.8, not 3.12 | Shipped code that crashed | Pin versions in a lockfile |
| Random failure | Success depends on the environment | Failed because of a leap year | Rerun failures; quarantine flaky tests |
| Changed web page layout | A redesigned checkout page | Clicked the wrong button | Re-read the page before acting |
| Rate limit | HTTP 429 after 50 calls | Stopped mid-migration | Throttle and checkpoint long jobs |

As you read these tables, notice that one symptom can come from different layers. "The agent says the service is down" could be a flaky timeout at the tool layer, or the model misreading a timeout as a network problem. To tell them apart, you have to go back to the execution trace. [Where LLM Agents Fail](https://arxiv.org/abs/2509.25370), on the reading list, makes exactly this point: one root-cause error propagates downstream. The step that looks wrong at the end is often not the step that actually went wrong, so what you're looking for is the **first** step that failed. That is also why [Assignment 1](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens-en) has you draw the trace.

Once you have found the first step that failed, you can work backward through these questions in order (an order this post put together; the slides don't give one):

1. Was the task spec clear?
2. Did the tool handle and report things correctly? For example, should a transient failure have been retried before being reported?
3. Did the harness put the information the model needed into the context?
4. Was the environment what everyone expected?
5. Only if all of the above check out and the model still got it wrong is it a model-layer failure.

Take "the service is down" as an example. If the timeout was only transient and a retry would have succeeded, but the tool handed that one timeout to the agent without retrying with backoff, it is a tool-layer flaky call (p28). If the tool's message was accurate but the agent concluded the network was down (it was actually a deadlock), it is a model-layer reasoning error (p27).

> **Self-check**: an agent uses `grep` to find the callers of a function, gets an empty result, reports "nothing calls it," and deletes the function. Later you find the `grep` path was mistyped, and the exit code was 2. Which layer failed? How do you fix it?
> Answer: the first step that went wrong is the tool's return: it packaged a failure as an empty result and handed it to the agent, a tool-layer silent failure (p28). The fix is to have the tool report "empty" and "failed" separately, for example by including the exit code and stderr. The model then treated the empty result as evidence; you can also require it to confirm with a second method before deleting anything, but the root cause is at the tool layer.

### Designing for failure

The slides end by collecting each layer's fixes in one table (p30):

| Layer | Principle | Practices |
|---|---|---|
| Task spec | Write "done" as a test | Acceptance tests up front; list what must not change |
| Harness | Bound every run | Step, cost, and time caps; checkpoint and roll back |
| Model | Demand evidence | Proof for every claim; verify; use stronger models when needed |
| Tool | Fail loudly | Typed schemas; errors distinct from empty results |
| Environment | Pin and isolate | Fresh, pinned sandboxes; retry flakes before judging |

The last line of the slides is: we do not yet understand agents at scale, and there is little formal best practice. [Beyond the Leaderboard](https://arxiv.org/abs/2607.05775), on the reading list, synthesizes 27 papers, and one of its conclusions is that adding more scaffolding (the supporting machinery around the model) does not consistently make agents more reliable. These fixes are a starting point; whether to use them, and whether they work, is something to measure with the evaluation methods in the next lecture.

## Final self-check

1. You are designing memory for a coding agent that should "remember this repo's conventions." Using the six decisions plus ownership, answer each one: what is worth remembering, what form it takes, where it lives, when it is retrieved, when to generalize, when to forget, and who owns it.
   Criterion: give at least the points below, each with a reason.
   - Write or skip: remember only what can't be derived from the code, such as team preferences and past pitfalls, with an explicit write condition, for example only when the user corrects the agent.
   - Representation and storage: one entry per line in plain text or a structured format, in a file next to the repo that can be diffed and reviewed.
   - Retrieval timing: load only a short index at the start, and read details when a task needs them.
   - Generalizing: promote a correction to a convention only after it comes up two or three times, and mark a confidence level; turning a single correction into a lasting rule is overgeneralization.
   - Forgetting: record the write date and source for every entry, and mark old entries superseded when a convention changes.
   - Ownership: the agent owns it; there's no need for a separate memory service, since only this repo uses it.
2. An agent fixing a bug in CI reports "done," but the PR's tests are red. The trace shows it ran `pytest`, the tool truncated the output to the first 100 lines, and the error was on line 4,000; it saw PASSED at the top and declared success. Which layer failed?
   Criterion: name at least two layers. "Truncated output" counts as the tool layer if the tool truncated it, or the harness layer if the harness truncated it when putting it back into history. Either way the fix is to return errors first and allow paging. The model layer is "unverified success," fixed by requiring the full test result, such as the exit code or summary line. The first step that failed is the truncation.
3. A 50-step task succeeds 0.95 of the time per step. What is the chance of getting it right in one run? If better tool design cuts it to 25 steps at the same per-step rate, what then?
   Criterion: 0.95⁵⁰ ≈ 0.08; 0.95²⁵ ≈ 0.28, about three and a half times higher. Also explain that the independence assumption overestimates the real success rate, because errors propagate.

## Further reading

- [Lecture 2: How Claude Code works](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en): CLAUDE.md and auto memory from the user's side.
- [CMU 11-768 Lecture 4: Skills and memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en): another course's take on the same ideas.
- [Series guide: AI Agent Memory Engineering](/posts/ai/2026-09-19-agent-memory-engineering-series-intro-en): the entry point to this site's memory series and the design space of memory systems.
- [Letta and MemGPT complete guide](/posts/ai/2026-08-22-letta-memgpt-agent-memory-en), [Mem0 complete guide](/posts/ai/2026-08-22-mem0-agent-memory-en), [Zep complete guide](/posts/ai/2026-08-22-zep-agent-memory-en): how the three systems mentioned in this lecture each work.
- [The attack surface of agent memory](/posts/ai/2026-09-19-agent-memory-attack-surface-en): more examples of persistent prompt injection and how to defend against it.
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657): MAST from the reading list, which sorts multi-agent failures into 14 types.
- [Cuadron et al., The Danger of Overthinking](https://arxiv.org/abs/2502.08235): another reading-list paper, on models that think too much and act too little.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)).
- Source: [Lecture 6 slides](https://cs2680.com/slides/6_agent_design_3.pdf) (PDF pages p5–30) and the [9/28 reading page](https://cs2680.com/readings/sep-28), read on 2026-10-22. Page numbers always follow PDF page order; the numbers printed in the slide corners run one higher than the PDF page from p19 on.
- Product descriptions were checked against the official docs and READMEs as of 2026-10: the Claude Code memory docs, the Mem0 docs, and the Graphiti and supermemory READMEs; places that differ from the slides are flagged in the text. Benchmark numbers were checked against the original papers and LoCoMo's public data. LoCoMo-Refined, locomo-audit, Sinha et al., Ord, and MINJA are sources this site added.
- The SGLang example comes from the slides. The "make check" and CI examples, the extended compounding-error arithmetic, the "questions it can answer" and "decision to revisit" columns, and the answers to the self-checks are this site's additions, not lecture content.

## References

- [CS2680 Lecture 6 slides: Agent design III: memory and reliability](https://cs2680.com/slides/6_agent_design_3.pdf)
- [CS2680 readings: 9/28](https://cs2680.com/readings/sep-28)
- [Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Packer et al., MemGPT: Towards LLMs as Operating Systems (2023)](https://arxiv.org/abs/2310.08560)
- [Zhu et al., Where LLM Agents Fail and How They can Learn From Failures (2025)](https://arxiv.org/abs/2509.25370)
- [Beyond the Leaderboard: A Synthesis of Tool-Use, Planning, and Reasoning Failures in Large Language Model Agents (2026)](https://arxiv.org/abs/2607.05775)
- [Claude Code docs: How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Mem0 docs: How Mem0 Works](https://docs.mem0.ai/core-concepts/memory-types)
- [Graphiti (GitHub)](https://github.com/getzep/graphiti)
- [Rasmussen et al., Zep: A Temporal Knowledge Graph Architecture for Agent Memory (2025)](https://arxiv.org/abs/2501.13956)
- [supermemory (GitHub)](https://github.com/supermemoryai/supermemory)
- [Maharana et al., Evaluating Very Long-Term Conversational Memory of LLM Agents (ACL 2024)](https://aclanthology.org/2024.acl-long.747/)
- [Wu et al., LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory (ICLR 2025)](https://arxiv.org/abs/2410.10813)
- [Tavakoli et al., Beyond a Million Tokens: Benchmarking and Enhancing Long-Term Memory in LLMs (ICLR 2026)](https://arxiv.org/abs/2510.27246)
- [LoCoMo-Refined (GitHub)](https://github.com/mem-eval-suite/LoCoMo_refined)
- [locomo-audit (GitHub)](https://github.com/dial481/locomo-audit)
- [Dong et al., Memory Injection Attacks on LLM Agents via Query-Only Interaction (2025)](https://arxiv.org/abs/2503.03704)
- [Sinha et al., The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2025)](https://arxiv.org/abs/2509.09677)
- [Toby Ord, Is there a half-life for the success rates of AI agents? (2025)](https://arxiv.org/abs/2505.05115)
