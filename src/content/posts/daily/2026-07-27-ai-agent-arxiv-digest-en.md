---
title: "AI Agent Arxiv Digest — 2026-07-27"
date: 2026-07-27
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, agent-rag, agent-evaluation]
lang: en
description: ""
tldr: ""
series:
  name: "AI Agent Arxiv Digest"
  order: 64
---
> 🌏 [中文版](/posts/daily/2026-07-27-ai-agent-arxiv-digest)

[!info] 📌 **Today's Overview**
Today's three papers converge on a single theme: the reliability crisis of AI Agents. From memory architecture and security attacks to skill lifecycle management, they expose fundamental pain points in long-term memory design, data injection vulnerabilities, and reusable skill governance. NapMem (Alibaba/Qwen) upgrades memory from "passive retrieval" to "active navigation of the action space," offering a new design paradigm for personalized agents. The ADI attack paper demonstrates live bypasses of Claude Code and Codex defenses, achieving remote code execution. SkillSec-Eval systematically maps security vulnerabilities across the entire lifecycle of MCP-like skill ecosystems, finding exploitable weaknesses at every stage among 327 real-world skills. Read together, it's clear that as agent platforms push deeper into capabilities, their security and memory infrastructure have reached a point that demands serious attention.

## Terms to Know Before Reading


| Term | Plain Explanation |
|---|---|
| Indirect Prompt Injection (IPI) | An attacker hides instructions in external data (web pages, documents) that an agent processes, causing it to unknowingly execute malicious actions |
| Agent Data Injection (ADI) | A new IPI subtype proposed in this paper: disguising malicious content as "trusted data" (e.g., resource IDs, tool call formats) rather than as instructions |
| Memory Pyramid | NapMem's layered memory structure: raw conversations → structured memory records → topic tracks → user profile, from coarse to fine |
| Skill Lifecycle | The complete lifecycle of a reusable agent skill: "published to repository" → "discovered via search" → "selected by planner" → "executed" → "version updated" |
| RL for Tool Use | Using reinforcement learning to let agents learn "when to call which memory tool" instead of hard-coding rules |


---


## Paper 1 | From Passive Retrieval to Active Memory Navigation: Learning to Use Memory as a Structured Action Space

**Authors**: Yue Xu, Yutao Sun, Yihao Liu, Mengyu Zhou et al. · Alibaba Qwen Team / ShanghaiTech / Zhejiang University / Peking University / NUS　·　**arxiv**: 2607.05794
**Links**: [arxiv](https://arxiv.org/abs/2607.05794) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05794)
[!tip] 🎯 
### TL;DR

Let agents actively navigate memory as a tool instead of passively receiving system-injected fragments; Alibaba Qwen's RL-trained 9B model beats all memory baselines.
[!success] ⭐ 
### Read Priority

Must-read
If your product has long-term memory or personalization features, this paper provides a directly implementable architectural blueprint; benchmark results are best-in-class across three mainstream memory test sets.
[!quote] 🧭 
### Domain Background

Most agent memory systems use "passive retrieval": the system selects a few memory fragments based on the query and stuffs them into the context, leaving the agent to work with whatever it gets. The problem is the agent has no ability to "request more detail" or "jump to a higher-level summary" — when retrieval is imprecise, it's stuck with bad results. How to let the agent decide "which granularity of memory to query" has been a persistent challenge.

### Intermediate Guide


#### Problem

Imagine you're a personal assistant and your boss says "prepare materials for the meeting with Alex." A good assistant doesn't just look up "what we last discussed with Alex" — they first check Alex's company overview (high-level summary), then drill into recent contract details (low-level raw text). Current memory systems, however, just shove a few semantically similar text chunks at you, and the assistant has to answer from just that.

#### Method

NapMem organizes memory into a four-layer pyramid: **raw conversations** → **structured memory records** (typed memory records) → **topic tracks** → **user profile**, with provenance links between layers for traceability. The agent navigates this pyramid through "memory tools" — it can choose to view summaries first, then decide which details to drill into based on intermediate findings. This navigation capability is trained via RL: the agent sees a query and decides which memory tool to call and at which granularity, receiving a reward only when it answers correctly.

#### Why It Matters

One of a personalized agent's core competitive advantages is "remembering you." NapMem's architecture lets a 9B model achieve an average score of 62.74, beating industry-standard solutions like Mem0, Zep, and MemOS — without requiring a massive model. For agent platform teams, this means the memory module can use a smaller dedicated model (rather than stuffing all memories into the context for the main model to process), achieving better cost-effectiveness.

### Deep Dive

- **Four-layer pyramid**: raw conversations → typed memory records → topic tracks → user profile, connected by provenance links at each layer; the agent can enter from any layer and jump across layers
- **Memory Tools design**: each granularity has a corresponding query tool; the agent decides which layer to search via tool calls, similar to a file system's `ls` / `cat` / going up to read a `README`
- **RL training**: uses pure RL to learn when to call which tool, requiring no human annotation of "correct memory paths," reducing reward hacking issues
- **Benchmark results**: NapMem-9B achieves **62.74** average across PersonaMem-v2 + LongMemEval + LoCoMo, higher than NapMem-397B's 59.85 (⚠️ the larger model actually loses to the smaller one — possibly indicating RL training matters more than scale for navigation ability, though benchmark representativeness should be considered)
- **Baselines**: compared against Mem0, Zep, MemOS, MemoryOS, and AgeMem — all outperformed by NapMem-9B
- **No degradation in general capabilities**: tested on non-memory tasks, the RL-trained policy largely preserved the base model's reasoning and tool use capabilities
- **Limitation**: currently tested only on text-based conversational tasks; extension to multimodal or structured database memory is unverified; RL training data coverage may affect generalization
[!bug] 🧐 
### Reviewer's One-Line Take

Solid direction — the four-layer pyramid design is convincing, and RL for memory navigation is a sensible training strategy; however, the 9B beating 397B result warrants reader scrutiny of baseline fairness, and all three benchmarks lean toward conversational memory, leaving generalization to tool-heavy or coding agent scenarios unproven.
[!warning] 🎬 
### Your Take-away

- If you're designing an agent memory module: layering memory (raw / structured / topic / profile) is an architecture worth adopting directly — it handles "queries needing different granularities" better than a single vector store
- If you're evaluating off-the-shelf solutions like Mem0 / Zep: NapMem's benchmarks can serve as a baseline framework for your own testing, especially since LongMemEval is an industry-recognized evaluation set

---


## Paper 2 | Agent Data Injection Attacks are Realistic Threats to AI Agents

**Authors**: Multiple researchers · Seoul National University / University of Illinois Urbana-Champaign / Largosoft　·　**arxiv**: 2607.05120
**Links**: [arxiv](https://arxiv.org/abs/2607.05120) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05120)
[!tip] 🎯 
### TL;DR

A new attack vector: instead of disguising payloads as "instructions," just disguise them as "trusted data formats" and agents will comply — Claude Code, Codex, Gemini CLI, and three web agents all fell victim, enabling remote code execution.
[!success] ⭐ 
### Read Priority

Must-read
Directly names vulnerabilities in Claude Code / Codex / Gemini CLI and proposes a new attack taxonomy; essential for engineers working on agent security or deploying coding agents. Already widely covered on Hacker News and other outlets, creating public disclosure pressure.
[!quote] 🧭 
### Domain Background

Previous Indirect Prompt Injection (IPI) research focused primarily on "instruction injection": hiding fake instructions in documents an agent reads, hoping the agent mistakes them for user instructions. Existing defenses (such as input sanitization, instruction filtering) target this pattern. But researchers discovered that if attackers don't masquerade as instructions but instead as the "data format itself" that agents should trust (such as JSON keys, tool response schemas, resource IDs), defenses are nearly ineffective.

### Intermediate Guide


#### Problem

Imagine a coding agent reading GitHub issue comments and submitting fixes. If an attacker posts a comment that looks like a "maintainer instruction," the agent might recognize the social engineering and refuse. But if the attacker posts a payload disguised as a legitimate JSON response format, making the agent think it's a valid tool call response, the agent will execute the malicious commands in that "response."

#### Method

The paper defines **Agent Data Injection (ADI)** as a new category, with two techniques:
1. **Security-critical metadata injection**: forging resource identifiers and data origin markers to make the agent believe it's reading a trusted source
1. **Agent context data injection**: masquerading as tool call / response formats to make the agent misjudge that it just received a legitimate tool execution result
The paper experiments on real systems, including web agents (Claude in Chrome, Antigravity, Nanobrowser) and coding agents (Claude Code, Codex, Gemini CLI).

#### Why It Matters

This attack vector applies to every scenario where an agent reads external data — web content, GitHub issues, database returns, API responses. It bypasses existing IPI defenses and is hard to solve with simple filters because the malicious payload inherently "looks like legitimate data." For agent platforms, this means prompt-level defenses alone are insufficient — protection must extend to the data pipeline layer.

### Deep Dive

- **ADI vs. instruction injection**: instruction injection hides text saying "do X"; ADI hides content that "looks like a system-returned result, telling the agent X is done / X is legitimate," bypassing the defense logic that recognizes "this is an external instruction"
- **Web Agent attacks**: launched fake UI element attacks against Claude in Chrome, Antigravity, and Nanobrowser, making agents click attacker-specified elements
- **Coding Agent attacks**: attackers placed JSON payloads disguised as maintainer approvals in GitHub issue comments, triggering Claude Code / Codex / Gemini CLI to execute malicious commands (**RCE**)
- **Attack success rates**: JSON delimiter injection success rate **31.3%–43.3%**; web data format **33.3%–100.0%**; ⚠️ the 100% success rate for some agents may reflect cherry-picked scenarios
- **Bypassing defenses**: against purpose-built IPI defenses, ADI still achieves **50%** success rate, while traditional order-smuggling attacks are almost completely blocked
- **Supply-chain dimension**: if attackers can manipulate npm/PyPI package READMEs or changelogs, they can trigger RCE through coding agents' package reading behavior — this supply chain scenario is especially dangerous
- **Limitation**: experiments were run on specific agent versions; vendor updates may partially mitigate; the paper doesn't discuss defense possibilities at the framework layer (LangGraph / AutoGen)
- **Mitigation strategies**: structural format sandboxing at the data parsing layer, plus source signature verification at the tool response layer
[!bug] 🧐 
### Reviewer's One-Line Take

Well-posed problem with real-world harm — achieving RCE on mainstream coding agents is convincing; however, the 33.3%–100% success rate range is too wide, and the lack of a unified evaluation protocol (such as AgentDojo) makes cross-paper comparison difficult. Reads more like a vulnerability report than systematic research.
[!warning] 🎬 
### Your Take-away

- If your agent reads external data (web pages, GitHub, APIs): audit your tool response parsing paths now, ensuring structural delimiters (JSON keys, XML tags) cannot be overwritten by external data
- If you're deploying coding agents: scenarios like reading issue comments / PR reviews should include context isolation — explicitly mark code or comments the agent reads as "untrusted data layer" rather than "system instruction layer"

---


## Paper 3 | Agent Skill Security: Threat Models, Attacks, Defenses, and Evaluation

**Authors**: Sanket Badhe, Priyanka Tiwari　·　(Affiliation not explicitly disclosed)　·　**arxiv**: 2607.13987
**Links**: [arxiv](https://arxiv.org/abs/2607.13987) · [alphaxiv](https://www.alphaxiv.org/abs/2607.13987)
[!tip] 🎯 
### TL;DR

Every stage of an MCP tool / Agent Skill's journey — from "published to repository" to "executed" to "version updated" — has security vulnerabilities; tested on 327 real-world skills, exploitable weaknesses were found at every lifecycle stage.
[!success] 📖 
### Read Priority

Skim
If you're using or maintaining MCP servers / Claude Skill ecosystems, this paper's threat taxonomy is worth bookmarking as a security design checklist; however, the authors' affiliation is unclear and data validation is limited — don't cite specific numbers directly.
[!quote] 🧭 
### Domain Background

Reusable agent skills (skill / tool / MCP server) let agent capabilities be packaged, shared, and composed like npm packages. This ecosystem is growing rapidly — OpenAI Plugin, Claude Skill, LangChain Hub, and MCP Registry are all heading this direction. But security research on "skills" has almost exclusively focused on runtime, neglecting whether the search, review, and post-update evolution stages can be attacked.

### Intermediate Guide


#### Problem

Suppose your agent searches a public skill repository (like MCP Registry) for "an email-sending tool." An attacker can: (1) upload a skill whose description says "super safe, super useful" but contains hidden malicious logic; (2) optimize the skill's description embedding to rank first in semantic search; (3) wait until the skill is widely adopted, then push a "security update" that introduces a backdoor. These attacks happen before runtime, but current defenses don't account for them at all.

#### Method

The paper proposes **SkillSec-Eval**, a lifecycle-perspective security evaluation framework. The threat taxonomy covers five stages:
1. **Repository admission**: how malicious skills pass review to enter the repo
1. **Semantic retrieval**: manipulating embeddings to prioritize malicious skills in search
1. **Planner selection**: using misleading metadata / descriptions to trick the planner into selecting them
1. **Execution**: unexpected behaviors from cross-skill interactions in multi-step workflows
1. **Skill evolution**: silently introducing malicious logic through version updates
Experiments were conducted on 327 real-world skills, verifying that vulnerabilities exist at every stage.

#### Why It Matters

As the MCP ecosystem expands, agent platforms increasingly depend on third-party skills. The issues this paper reveals aren't about "runtime prompt injection" but systemic supply-chain risks. This is very similar to dependency confusion and typosquatting attacks in software engineering, but agents' "automatic skill selection" behavior makes these problems harder to solve through manual review.

### Deep Dive

- **Five-stage threat taxonomy**: Repository → Retrieval → Planning → Execution → Evolution, each stage with corresponding attack techniques and defense recommendations
- **327 real-world skills**: the experimental scale is among the largest in comparable research, using real-world skills rather than synthetic data
- **Embedding manipulation**: attackers can optimize skill descriptions to rank higher than legitimate skills in semantic search — similar to SEO poisoning
- **Planner deception**: modifying a skill's name / description / examples to bias LLM planners toward selecting the malicious skill
- **Multi-step combination attacks**: in complex workflows, a malicious skill can exploit "the previous skill's output" to trigger malicious behavior — hard to detect during single-skill review
- **Version update backdoors**: a skill's semantic similarity remains stable across versions (so search still hits it), but execution logic silently changes
- **LangGraph / AutoGen / MCP relevance**: the lifecycle threats described directly map to MCP Registry's architecture, and AutoGen's skill hub has similar exposure
- **⚠️ Limitations**: authors' affiliation undisclosed; some defense recommendations (e.g., "admission-time static analysis") are vague and lack concrete implementation; benchmark designed by the authors without third-party test set validation
[!bug] 🧐 
### Reviewer's One-Line Take

Systematic threat taxonomy that hits real pain points of the MCP ecosystem; the framework design deserves industry adoption. However, opaque author affiliation, conceptual-level defenses, and lack of external validation place it closer to an industry white paper than top-venue research quality.
[!warning] 🎬 
### Your Take-away

- If you maintain MCP servers or an agent skill ecosystem: use SkillSec-Eval's five-stage threat checklist as a security review checklist, running through it for every skill onboarding and version update
- If you use third-party skills (MCP tools): prioritize skills with clear maintainers, public changelogs, and version hash verification; avoid adopting skills that rank first in semantic search but have thin documentation


## References

- [arxiv:2607.05794](https://arxiv.org/abs/2607.05794)
- [arxiv:2607.05120](https://arxiv.org/abs/2607.05120)
- [arxiv:2607.13987](https://arxiv.org/abs/2607.13987)
