---
title: "AI Agent Arxiv Digest — 2026-08-23"
date: 2026-08-23
category: daily
type: digest
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers covering three stages of agent skill systems — how to teach models to use tools, how to generalize skills without hurting performance, and how to select skills at scale without wasting tokens — directly referencing production systems like Claude Code and Codex"
tldr: "MidTool uses 20.3B tokens of mid-training data to push 4B/8B models past official Qwen3 on MCP-Universe; Break It Down finds that task-level skill induction hurts agent performance on average — sub-task granularity is what works; Optimal Skill Selection proves skill selection can have provable approximation guarantees, achieving 0.73 success rate on a BigCodeBench variant with 28% fewer tokens (baselines: 0.20–0.52)"
series:
  name: "AI Agent Arxiv Digest"
  order: 91
---

> 🌏 [中文版](/posts/daily/2026-08-23-ai-agent-arxiv-digest)

## Today's Overview

Three papers neatly cover three stages of an agent's "skill system": how to teach a model to use tools (MidTool uses mid-training to build the foundation rather than dumping everything onto post-training), how to generalize skills so they actually transfer instead of hurting performance (Break It Down finds that task-level induction actually drops agent performance below the no-memory baseline), and how to select skills from a growing library without wasting tokens or picking the wrong ones (Optimal Skill Selection provides the first algorithm with provable guarantees). Together they outline a "skill lifecycle": training-phase foundation → usage-phase induction → retrieval-phase selection — and the third paper directly names Codex and Claude Code as the production systems it benchmarks against. This is exactly the research question behind the skill mechanisms we use every day.

## Terms to Know Before Reading

| Term | Plain Explanation |
|---|---|
| Agent | An AI system that can plan steps, call tools, and iterate on execution — not a simple Q&A chatbot |
| Mid-training | A training phase between general pre-training and task-oriented post-training (SFT/RL), used to strengthen specific foundational capabilities |
| Skill Induction | The process where an agent generalizes completed tasks into reusable "skill" documents, stored in a skill memory library for later retrieval |
| Submodular Function | A mathematical property of "diminishing marginal returns" — once you've already selected one item, selecting a similar one brings less additional benefit |
| Skill Router | The mechanism that picks which installed skills to load into context for a given query — the kind of mechanism used in Claude Code, Codex, etc. |
| Context Budget (Token Budget) | The upper limit on tokens an agent can fit into a model's input; skill documents and conversation history all compete for this space |

---

## Paper 1 | MidTool: Teaching Models to Use Tools via Mid-Training, Not Just Post-Training

### MidTool: Mid-training Data Synthesis for Agentic Tool Use
Fengqing Jiang, Yite Wang, Boyi Liu et al.(University of Washington, Snowflake)　·　arxiv: 2608.20314

Links: [arxiv](https://arxiv.org/abs/2608.20314) · [alphaxiv](https://www.alphaxiv.org/abs/2608.20314)

### TL;DR

Current agent tool-use capabilities are almost entirely trained through post-training (SFT/RL). MidTool proposes a "mid-training" alternative: using a 20.3B-token corpus to first teach models to recognize tools, compose multi-step calls, and recover from missing information. The resulting 4B/8B models surpass official Qwen3 models on MCP-Universe.

### Read Priority

Must-read — if you're building or fine-tuning coding / tool-use agent models. This paper offers a "build the foundation first, then refine" path instead of endlessly scaling SFT/RL data.

### Background

Progress in tool-use capability has mostly come from post-training — SFT and RL on curated trajectories. But this puts enormous pressure on post-training: the model has to learn tool recognition, schema-aligned parameter filling, information-gap recovery, and multi-step execution all from narrow supervision signals. More fundamentally, the knowledge supporting tool use is scattered across dev docs, manuals, PDFs, codebases, and API specs — most of which have never appeared as clean agentic demonstrations. Mid-training is an independent stage between general pre-training and post-training that has recently been shown to strengthen reasoning-intensive capabilities like math and science, as well as agentic capabilities in software engineering — but general tool use hasn't been systematically explored.

### Mid-Level Walkthrough

- **Problem**: Imagine training a new employee to use an internal system with 20 APIs. If you only give them 50 worked examples, they'll get stuck on the 51st scenario because the examples don't teach anything systematic — like how to infer parameters from API docs, or what to do when information is missing. What you really should do is have them read through the documentation, manuals, and codebase first to build a general intuition for "what tools look like," then refine with a small set of examples.
- **Method**: MidTool builds an open data construction pipeline that mixes large-scale web, PDF, and code data with synthesized supervision signals (from real tool APIs, MCP skills, and doc-aligned workflows) into a 20.3B-token MidTool-Mix corpus. The goal is to teach models four things: recognizing "a tool should be used here" signals, mapping parameters to schemas from context, composing multi-tool workflows, and recovering when information is incomplete. This corpus is used for mid-training on Qwen3-4B-Base and Qwen3-8B-Base, followed by SFT and RL post-training.
- **Why it matters**: This shows that tool-use capability — like other important LLM capabilities — shouldn't be left entirely to post-training. Mid-training can lay the "tool knowledge foundation" first, making post-training more efficient. For teams building their own coding/tool agent models, this is a viable alternative path.

### Key Details

- MidTool-Mix: 20.3B-token mid-training corpus mixing web, PDF, code, and synthesized agentic trajectories
- On Qwen3-4B-Base / Qwen3-8B-Base, MidTool mid-training + SFT/RL post-training consistently outperforms baselines without mid-training on BFCL, τ²-Bench, and MCP Universe ⚠️(author-tested, same-source comparison, pending external replication)
- On MCP-Universe, mid-trained 4B/8B models surpass officially released Qwen3 models
- Data and models are released (Hugging Face collection: MidTool/midtool-release)
- Barrier to adoption: building a 20.3B-token corpus and running mid-training requires substantial compute — smaller teams may find it hard to replicate the full pipeline, but the "web+PDF+code+synthetic" data composition approach can be adapted at smaller scale
- Limitation: only validated on Qwen3 family at 4B/8B scale; generalizability to larger models or other model families is unknown

### Reviewer's One-Line Take

Pragmatic framing of tool use as a mid-training concern, with clear data composition methodology and consistent gains across three benchmarks; but testing is limited to Qwen3 4B/8B, and whether training resources and data volume are comparable to the official models isn't fully accounted for — generalizability remains to be seen.

### Your Take-Away

- If you're fine-tuning your own coding/tool agent: don't put your entire budget into SFT/RL trajectory collection — consider a round of mid-training with docs, manuals, and codebases first to build the foundation
- If you're maintaining an MCP skill ecosystem: MidTool's data pipeline uses "MCP skills" as one source of synthesized supervision signals — this data pipeline approach is directly referenceable

---

## Paper 2 | Break It Down, Pass It On: Skill Induction at the Wrong Granularity Makes Agents Worse

### Break It Down, Pass It On: Cross-Task Skill Transfer in LLM Agents
Yiyang Feng, Biddut Sarker Bijoy, Niranjan Balasubramanian, Jiawei Zhou(Stony Brook University)　·　arxiv: 2608.20274

Links: [arxiv](https://arxiv.org/abs/2608.20274) · [alphaxiv](https://www.alphaxiv.org/abs/2608.20274)

### TL;DR

Having agents generalize completed tasks into reusable "skills" sounds obvious, but task-level skills on average drop agent performance below the no-memory baseline. Only sub-task-level skills improve performance, and text-format skills transfer better than code-format ones.

### Read Priority

Must-read — if you're building agent skill/memory induction mechanisms (including systems like Claude Code Skills that are already in production). This paper exposes an easy-to-miss assumption trap: "letting agents self-induce skills" doesn't automatically lead to improvement.

### Background

More and more agent systems let agents generalize skills from completed tasks, store them in a skill memory library, and retrieve them for reuse — theoretically making agents stronger with experience. But in practice, skill transfer is often unreliable. Skills induced from full task trajectories are inherently coupled to their source task; when transferred to new tasks, they are often irrelevant or misleading, causing the model to get distracted or import errors from the source task. Current research lacks systematic, controlled comparisons of "how to induce skills so they transfer well."

### Mid-Level Walkthrough

- **Problem**: Imagine two tasks — "order all exercise chairs in your shopping cart" and "move all food processors in your cart to the wishlist." If you summarize the entire task flow into one skill ("order {item} from cart"), it's useless for a completely different task next time. But if you decompose the task into sub-steps — log in, check cart, place order, move to wishlist — "log in" and "check cart" are shared sub-skills that can be directly reused across both tasks.
- **Method**: The authors design controlled experiments comparing skill induction along two axes: task-level vs. sub-task-level granularity, and text vs. code format. Using "specificity" (how well a skill matches a real task) and "abstractness" (whether relevance distributes evenly across multiple tasks) as two properties, they find neither alone predicts transfer success — but combining them into a "skill utility score" strongly correlates with post-transfer task success rate. This score only needs the skill text and task description; no actual task execution required.
- **Why it matters**: This punctures an easy-to-miss assumption — "letting agents self-induce skills" doesn't automatically improve performance. If you get the granularity or format wrong, the agent can end up worse than having no memory at all. For any team building a skill/memory system, this paper provides a concrete diagnostic tool that can filter out harmful skills before they're ever retrieved.

### Key Details

- Task-level skills on average pull agent performance below the no-memory baseline; sub-task-level skills on average raise performance above baseline ⚠️(author-tested, averages with per-task variance)
- Text-format skills systematically outperform code-format skills in transfer
- Skill utility score = combined effect of specificity and abstractness; neither alone predicts transfer success
- Sub-task-level + text-format skills systematically score higher on utility
- Utility score computation requires no task execution — only skill text and task description — serving as a lightweight pre-deployment diagnostic
- Code and data are open-sourced (GitHub: Zesearch/skill-transfer-llm-agents)
- Limitation: the study focuses on specific task families (e.g., multi-step shopping operations); generalizability to broader, longer-horizon real-world workflows is not covered

### Reviewer's One-Line Take

Decomposing the vague question of "does a skill transfer well" into two orthogonal properties (specificity, abstractness) is sharp, and the utility score's execution-free computation is the most practical contribution; but the experimental task types are narrow (mostly structured multi-step operations), and applicability to more open-ended task induction needs further validation.

### Your Take-Away

- If you're building agent skill/memory induction: don't assume "inducing a skill = progress" — prioritize sub-task-level induction, and use text rather than code as the storage format
- If you already have a skill memory library in production: consider implementing an offline "skill utility score" diagnostic to filter out low-utility skills before retrieval, rather than waiting for failures to reveal which skills are hurting performance

---

## Paper 3 | Optimal Skill Selection: Skill Selection Can Have Mathematical Guarantees, Not Just Semantic Similarity

### Optimal Skill Selection for LLM Agents with Provable Bicriteria Guarantees
Yu Chen, Ruishuo Chen, Xun Wang, Zhuoran Li, Longbo Huang(Tsinghua University, IIIS)　·　arxiv: 2608.19993

Links: [arxiv](https://arxiv.org/abs/2608.19993) · [alphaxiv](https://www.alphaxiv.org/abs/2608.19993)

### TL;DR

Current agents like Claude Code and Codex select skills by "scoring each one by semantic relevance, then top-k or greedy packing into context" — with no quality guarantees and no token cost awareness. This paper formalizes skill selection as "maximizing submodular utility under a token budget," proposes the BPS algorithm with provable approximation guarantees, and achieves 0.73 success rate on a BigCodeBench variant with 28% fewer tokens (baselines: 0.20–0.52).

### Read Priority

Must-read — this paper directly targets the skill selection mechanism in systems like Claude Code Skills, proposing a theoretically grounded alternative. Worth a close read for any team building or using a skill ecosystem.

### Background

Loading reusable skill documents into a limited context window is now the primary way LLM agents acquire task-specific capabilities, with public skill registries containing tens of thousands of installable skills. Production agents like Codex and Claude Code use a two-stage "select then execute" mechanism: the LLM first examines each installed skill's metadata (name, description) to select by query, then loads selected skill documents into context to solve the task. But as skill libraries grow to hundreds or thousands of entries, metadata alone can exceed the available context budget, making exhaustive LLM-based selection infeasible. And misselection has measured costs — as skill libraries grow, wrong skill choices can drop pass rates by up to 21%, and on 13 of 87 benchmark tasks, selecting skills actually performs worse than using no skills at all.

### Mid-Level Walkthrough

- **Problem**: Imagine an agent with a thousand available skills facing a new task. Most current systems score each skill independently on "how relevant is this to the task" and pick the top k to load into context. The problem is, if the top 5 highest-scoring skills heavily overlap in content, you've wasted 4 slots of token budget without gaining complementary capabilities. And nobody tells you how far this selection is from the theoretically optimal performance.
- **Method**: The authors formalize skill selection as an optimization problem — under a hard token budget, select a set of skills to maximize "monotone submodular utility minus context penalty." The submodular function captures exactly the "diminishing marginal returns" intuition: once you've selected one skill, selecting another that heavily overlaps brings less additional utility. For this optimization problem, they design Best Prefix Selection (BPS), a polynomial-time algorithm, and prove it is the first method with a performance guarantee for skill selection — a bicriteria (1-1/e, 1) approximation where the utility coefficient is optimal in polynomial time.
- **Why it matters**: This is the first time anyone has given skill selection a mathematical guarantee instead of relying on the theory-free heuristic of "semantic similarity + top-k." For any team building or using a skill/tool ecosystem, this means skill selection doesn't have to be black-box tuning — there's a guaranteed, more token-efficient alternative.

### Key Details

- On a contamination-controlled BigCodeBench variant, BPS achieves 0.73 task success rate vs. 0.20–0.52 from published skill routers, text retrievers, and executor-embedded selection mechanisms ⚠️(author-tested, single benchmark, pending external replication and broader validation)
- BPS achieves the above using ~72% of the tokens of the strongest baseline router (28% savings)
- Background data: as skill libraries grow, misselection can drop pass rates by up to 21%; on 13 of 87 benchmark tasks, selecting skills actually performs worse than using no skills at all (these figures are cited from prior work, not from this paper's experiments)
- BPS's core assumption is that the utility function is monotone submodular — whether this holds across all real-world skill libraries is not individually verified
- Adoption barrier: applying BPS requires the system to estimate submodular utility over skill subsets (not just score individual skills), adding an engineering complexity layer beyond existing top-k architectures
- The paper directly names Codex and Claude Code's skill selection mechanisms as the current-state reference, indicating this method targets exactly the pain points of these production systems
- Limitation: validation is currently limited to code generation tasks (BigCodeBench variant); whether it applies to more diverse skill types and task categories (e.g., document-based skills, multimodal skills) is unknown

### Reviewer's One-Line Take

Formalizing skill selection as a submodular utility optimization problem and providing the first provable approximation guarantee is a solid theoretical contribution, and BPS's empirical result of saving tokens while improving success rate is convincing; but validation is on a single code generation benchmark, and whether the submodularity assumption holds across more diverse real-world skill libraries remains to be tested.

### Your Take-Away

- If you're designing an agent's skill/tool selection mechanism: don't stop at "semantic similarity + top-k" — BPS's submodular utility modeling approach is worth direct reference, especially its consideration of inter-skill overlap (not just individual relevance)
- If you're managing a growing skill library (e.g., Claude Code Skills, MCP tool ecosystem): note the established finding that "larger library = higher misselection cost" — this paper provides one of the few theoretically guaranteed mitigation approaches currently available

## Today's Takeaway

I used to think "agents using skills/tools well" was primarily a model capability problem — if the model is strong enough, it'll naturally use tools well and learn skills. Today's three papers together made me realize this is actually an entire pipeline that needs to be designed stage by stage: MidTool says tool-use capability needs its foundation laid early in training, not left entirely to post-training; Break It Down says "letting agents self-induce skills" doesn't automatically lead to improvement — wrong induction granularity actively hurts; Optimal Skill Selection says even "which skills to load into context" can have mathematical guarantees rather than relying on semantic similarity alone. Viewed together, every step of the skill system — teach, store, select — has its own pitfalls, and we as daily users of Claude Code Skills are exactly the end users of this entire pipeline.

## References

- MidTool paper: [arxiv 2608.20314](https://arxiv.org/abs/2608.20314)
- Break It Down, Pass It On paper: [arxiv 2608.20274](https://arxiv.org/abs/2608.20274)
- Optimal Skill Selection paper: [arxiv 2608.19993](https://arxiv.org/abs/2608.19993)
