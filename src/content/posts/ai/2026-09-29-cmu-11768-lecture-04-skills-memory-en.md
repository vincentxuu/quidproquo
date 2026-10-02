---
title: "Reading CMU 11-768 L4: Skills and Memory — How Agents Stop Starting Over"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-skills, agent-memory, skill-induction]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 4
tldr: "Lecture 4 of CMU 11-768 sorts cross-task experience into episodes, facts, and skills, stored as external artifacts rather than in context or weights. Human-written skills load through SKILL.md and progressive disclosure, lifting the average SkillsBench pass rate from 33.9% to 50.5%. Skills an agent induces itself can be tested before admission when written as code, but break easily on a new website. The hard part is the lifecycle: imperfect judges, over-retrieval, and bloated skill libraries each eat into the gains."
description: "A guided reading of CMU 11-768 AI Agents Lecture 4, Skills and Memory (Daniel Fried): three kinds of experience, the Agent Skills standard and progressive disclosure, SkillsBench, MemGPT and Mem0, Reflexion, Agent Workflow Memory, Agent Skill Induction, SkillWeaver, PolySkill, ReasoningBank, TroVE, and SAGE, plus the lifecycle of a skill from induction to retirement."
draft: false
glossary:
  - term: "progressive disclosure"
    definition: "Loading a skill in three levels: the name and description always sit in the system prompt, the SKILL.md body is read only when the model decides to use it, and bundled scripts and references are opened only when needed."
    context: "Used here to explain why installing many skills does not flood the context window."
  - term: "skill induction"
    definition: "Having an agent extract reusable subroutines from its own successful (or failed) trajectories and store them as text workflows or code functions for later tasks."
    context: "AWM, ASI, and SkillWeaver in this post are different approaches to skill induction."
  - term: "trajectory"
    aliases: ["episode"]
    definition: "The full sequence an agent goes through on a task: observations, actions (tool calls), user messages, and sometimes its chain of thought."
    context: "Most memory methods in this post start from trajectories and then decide how much detail to keep."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory)

Lecture 4 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) (September 3, 2026, taught by Daniel Fried; [series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en)) asks one question: once an agent finishes a task, can the next one take fewer wrong turns?

The lecture opens with a shopping site. "Add Sony headphones to my wish list" and "find the price range for wireless keyboards" are different tasks, but their first half is identical: go to the store, find the search box, type a query, click search. If the agent spent several steps figuring out how this site's search works the first time, it should just know the second time.

Three questions organize the whole lecture:

- **Representation**: should the shared structure be stored as text or as code?
- **Induction**: how can the agent extract it from experience on its own?
- **Lifecycle**: when should a skill be retrieved, checked, revised, or forgotten?

The [previous lecture (L3)](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en) handled context management within a single task; this one handles memory across tasks. Slides are on the [course site](https://www.cmu-agents.com/slides/lecture-04-memory-and-skills.pdf) and the recording is on [YouTube](https://www.youtube.com/watch?v=6zigF2a-2Pw&list=PLSN0qpDfUvTM&index=4).

## Three places to update an agent

Fried starts by splitting "making an agent better" into three locations:

| Location | Pros | Cons | Where in the course |
|---|---|---|---|
| Context window | High fidelity to what happened | Costly, noisy, and does not decide what matters | L3 |
| External artifacts | Inspectable, editable, retrievable, portable | Must be induced, selected, and maintained | This lecture |
| Model weights | Faster inference, broad behavior change | Slower updates, opaque, model-specific | SFT lecture |

The main advantage of external artifacts is **portability**: a description of "how to search for products on this site" works with any model, while a weight update only helps that one model. The second advantage is that humans can read them — the agent proposes, a person edits, and you get a human–agent collaboration interface for free.

Even with million-token contexts, experience across many tasks eventually exceeds the limit, so it has to be written outside the context. The core question of the lecture: **what experience is worth turning into an external artifact?**

## Three kinds of experience, and memory versus skill

| Type | Example | Useful when |
|---|---|---|
| Episode | Every observation and action | The exact product, prices, or sequence will matter again |
| Fact | "This store shows prices only on the product page." | The fact recurs in future tasks, or can be updated |
| Skill | Fill the search box → click search → open a result | Later tasks will repeat the same pattern |

Episodes have the highest fidelity and the highest token cost. Facts were the focus of early memory systems; the "memory" ChatGPT and Claude show you in settings is exactly a model-generated compression of facts from your past conversations. Skills strip out the task details and keep only the "how."

Fried then separates **memory** from **skill**. Memory is what's saved from the agent's own interaction (for example, which product it bought before). A skill is reusable knowledge about how to act, stored as text, code, or both. They overlap in the "induced skill" — a search skill the agent extracts from its own successful searches.

Skills also come from two pathways:

- **Skills as instructions**: written by a person or organization from existing expertise, policy, or documentation. The strength is known intent and provenance; the burden is expert time to write and maintain them.
- **Skills as learning**: induced by the agent from its own episodes and outcomes. The strength is that it works where the right procedure has to be discovered through interaction; the burden is judging outcomes, verification, and curation.

Fried argues the two complement each other: the agent proposes best practices from experience and a person edits them, or a human-written skill gets refined by the agent based on what it runs into.

## Human-written skills: the Agent Skills standard

### When to write a skill

The lecture draws on the OpenHands post [How to Create Effective Agent Skills](https://www.openhands.dev/blog/20260227-creating-effective-agent-skills) (Michelini & Neubig, 2026). The scenario: every pull request, you type the same paragraph — format with Black at 88 characters, lint with Ruff, type hints on all public APIs, Google-style docstrings, Pytest for every new function.

When you want to **do something repeatedly following a fixed spec** (adding tests, reviewing PRs, upgrading dependencies), save it as a skill. The agent interprets the spec in context, but the spec itself stays the same.

### The structure of SKILL.md

Under the [Agent Skills specification](https://agentskills.io/specification), a skill is a folder:

```text
python-review/
├── SKILL.md      # Required: instructions + metadata
├── scripts/      # Optional: executable code
├── references/   # Optional: documentation
└── assets/       # Optional: templates, resources
```

SKILL.md begins with YAML metadata (`name`, `description`, and in some frameworks `triggers`), followed by a Markdown body. The `description` should say clearly *when* to use the skill, because that's what the model reads to decide whether to load it.

### Progressive disclosure: three levels

Installing many skills without flooding the context relies on [progressive disclosure](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):

| Level | Content | When it enters the context |
|---|---|---|
| 1 | SKILL.md YAML metadata | Always (system prompt) |
| 2 | SKILL.md body | When the model triggers the skill |
| 3 | Bundled files (text, scripts, data) | When the model reads those files |

Fried demonstrates the implementation with the open-source [Hermes Agent](https://github.com/NousResearch/hermes-agent). Its [prompt_builder.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py) puts an `<available_skills>` index in the system prompt and tells the model it MUST load a skill with `skill_view(name)` if it is even partially relevant. The flow:

1. The system prompt holds names and descriptions only — about 3k tokens for the whole index in Hermes
2. Calling `skill_view('python-review')` brings the SKILL.md body into context as a tool result
3. Running `python scripts/run_checks.py src/` in the terminal brings in the script's output; the script's source never enters the context
4. Only when docstring rules are needed does [skills_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skills_tool.py) read `references/docstring-style.md`

[Assignment 1](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en) asks you to implement exactly this (called `invoke_skill` in the assignment).

Two points from the Q&A are worth keeping:

- **Do too many skills hurt performance?** Yes. SkillsBench and ReasoningBank, covered later, both find that irrelevant material distracts the model, so keep the skill count modest and load on demand.
- **How sensitive are the triggers?** A trigger is just a tool call the model generates, so it depends entirely on the model and on the description you write. That is why evaluation is needed.

### SkillsBench: do skills actually help?

[SkillsBench](https://arxiv.org/abs/2602.12670) is one of the first systematic attempts to answer that. The pipeline: collect about 2.01 million deduplicated skills from the web, have 142 contributors submit 400 tasks, and filter (automated plus human review) down to 87 tasks across 8 domains. Each task comes with a human-chosen skill bundle (the slides say humans choose the bundle; the paper stresses that contributors author these skills independently, from public repositories or their own experience, and task instructions never name which skill to use). The main experiment compares "no skills" against "curated skills" across 18 model–harness configurations, with harnesses including OpenHands, Claude Code, Codex CLI, and Gemini CLI.

Three layers of results:

- Curated skills raise the average pass rate **from 33.9% to 50.5%**
- **Focused skills gain more**: tasks with 1 skill gain 18.0 points and tasks with 2–3 gain 19.0, while 4 or more gain only 10.1; grouped by SKILL.md length, compact and standard skills (+19.0, +21.5) beat detailed ones (+14.5), and the longest, comprehensive group gains just +0.7
- Skills **still hurt on 13 of the 87 tasks**: a skill can displace a better default strategy the model would have used

Fried's practical takeaway: once you've written a skill, check that it actually improves results. He also mentions that SkillsBench found that when models write a skill from the task description alone, it does poorly and can even lower performance. The experiment is in the paper's Appendix D.6: an agent first uses Anthropic's skill-creator to read the task instruction, inspect the environment, and author skill packs, then a fresh session solves the task with only those packs. On all three configurations tested (Claude Code + Opus 4.7, Codex + GPT-5.5, Gemini CLI + Gemini 3.1 Pro), self-generated skills land 8.1 to 11.5 points below the no-skills baseline, while curated skills add 18.2 to 24.8 on the same configurations. The paper treats this condition as a diagnostic, not part of the main results.

### Where skills come from, and how to maintain them

There are three sources: bundled skills that ship with the harness; skills a person writes for their own work and checks into the repo under `.agents/skills/`, or installs from another repository or registry; and skills the agent writes itself. Hermes exposes a `skill_manage` tool that lets the agent create, patch, or delete skills; OpenHands has a `/skill-creator` command that drafts one from the workflow the agent just finished.

OpenHands' advice is concrete: **don't write a skill from scratch**. Let the agent finish a workflow you want to repeat, save it as a skill right then, and test it a few times. Doing the work surfaces preferences you didn't know you had.

Fried then walks through how OpenHands maintains its own review skill, a python-review–style skill run on every PR in their repos:

1. **Log each run**
2. **Score each run**: after the PR merges, a model judge counts how many of the agent's suggestions the humans kept
3. **Find recurring failures**: a model reads the run notes and names what recurs — ignoring repo conventions (~15%) and approving PRs with a critical flaw (~10%)
4. **Patch SKILL.md**: the same model drafts the fix, such as "request changes whenever a critical issue is found" and "check a suggestion against the repo before posting it"

This loop is the manual version of the lifecycle covered in the second half of the lecture.

## Memory foundations: facts, lessons, and episodes

Before getting to skill induction, the lecture reviews several foundational memory papers.

### MemGPT: memory reads and writes as tool calls

[MemGPT](https://arxiv.org/abs/2310.08560) (Packer et al., 2023) borrows the operating-system memory hierarchy: the context window is the small, fast tier and external storage is the large, slow one. System instructions stay fixed; a working context pulls data in from external storage and writes data out — **and the reads and writes are function calls the model issues itself**. When the paper came out, context windows were around 8k tokens, but Fried argues the design still makes sense for agents today, because what we want to store has grown too.

### Mem0: memory must be updatable and deletable

Appending is not enough. If you once said "I work at X" and later change jobs, the system should use the newer fact. [Mem0](https://arxiv.org/abs/2504.19413) (Chhikara et al., 2025) runs an LLM over each new message to extract candidate facts, retrieves the top-K most similar stored memories via embeddings, and then has the LLM choose one of four operations:

| Operation | When |
|---|---|
| ADD | Nothing similar is stored yet |
| UPDATE | The message adds complementary information to an existing memory |
| DELETE | The message negates an existing memory (e.g., "I got laid off") |
| NOOP | Already stored, or irrelevant |

Fried ties this back to DeltaNet from the previous lecture: linear attention can only add to its memory, while DeltaNet can rewrite the vector stored for a key, which improves performance. Mem0 is the textual counterpart.

### Reflexion: turning a failure into written feedback

[Reflexion](https://arxiv.org/abs/2303.11366) (Shinn et al., NeurIPS 2023) loops: attempt → an evaluator predicts success → generate natural-language feedback → retry the same task. The example asks which series of battles was fought on October 28, 1776 near White Plains, New York. The first attempt answers a single battle, "Battle of White Plains," and is wrong; the reflection notes "the question asked for a series of battles, but I only provided the name of one," and the second attempt answers "The New York and New Jersey campaign" correctly.

Fried calls it simple and effective, and worth trying first if your project needs the agent to use past experience. It was designed for improvement within one task, but feedback that is general enough can carry across tasks.

### Similar-trajectory conditioning: RAG for agents

The last category stores whole trajectories. [ExpeL](https://arxiv.org/abs/2308.10144), [Agent S](https://arxiv.org/abs/2410.08164), [Synapse](https://arxiv.org/abs/2306.07863), and [ICAL](https://arxiv.org/abs/2406.14596) differ in details but share a skeleton:

- **What's stored**: whole trajectories, successes and failures, sometimes rewritten and annotated first
- **Where the pool comes from**: collected offline in a training phase, grown while the agent works, and/or hand-written
- **How it's used**: retrieve the runs most similar to the new task using text embeddings and include them as few-shot examples

A student asks how retrieval works: typically you embed the new task description and match it against other task descriptions, each attached to a trajectory, optionally restricted to the same domain.

## Skill induction: letting the agent write skills

### Prior work on program induction

Fried points to the roots of this line of work:

- [Voyager](https://arxiv.org/abs/2305.16291): controls a Minecraft agent through code; learned functions call each other, so simple skills compose into complex ones
- [DreamCoder](https://arxiv.org/abs/2006.08381): finds recurring patterns in a corpus of solved programs and abstracts them into functions that compress the corpus; later search reuses them
- [Stitch](https://arxiv.org/abs/2211.16605): fast symbolic compression that finds the functions capturing the most shared structure
- [LAPS](https://arxiv.org/abs/2106.11053): natural-language task descriptions guide which functions get induced
- [LILO](https://arxiv.org/abs/2310.19791): an LLM writes programs, Stitch compresses them into functions, and the LLM names and documents each one

### Evaluation setting: online learning

Skill induction is usually evaluated **online**: tasks arrive one at a time, a successful task updates memory before the next arrives, and you measure cumulative success over all tasks seen so far. For example, task 1, "add a Sony Bluetooth headphone to my wish list," induces "search for a product" and "add a product to the wish list"; task 3, "what is the price range for wireless keyboards?", can reuse "search for a product."

### Three stages of the lifecycle

Fried splits the pipeline into three stages, and every remaining paper in the lecture hangs off one of them:

```text
LEARN     episode → judge → induce → admit → memory
USE       memory → select/retrieve → act → outcomes
MAINTAIN  outcomes → add → repair → retire → memory
```

### Agent Workflow Memory: text workflows

[Agent Workflow Memory](https://arxiv.org/abs/2409.07429) (AWM; Zora Wang et al., with Fried and Neubig as co-authors; the slides say ICLR 2025, but the paper appears in the PMLR proceedings of ICML 2025) applies to web tasks:

1. The agent completes a task, such as "count the reviews that mention 'satisfied'," leaving a sequence of tool calls
2. **Judge**: a model predicts whether the final state looks correct; if not, nothing is admitted, because remembering the wrong thing will steer future tasks astray
3. **Induce**: an LM reads the trajectory and outputs "workflows" — a subtask description plus an action sequence, with concrete values replaced by variables (`{term}`)
4. Admit to memory and put it in the context later

The induction prompt (Appendix A.1) asks the model to find repetitive subsets of actions across tasks, avoid similar or overlapping workflows, require at least two steps per workflow, and use descriptive variable names for non-fixed elements.

The result: on a stream of tasks on a map site, the memoryless baseline stays low while AWM's cumulative success keeps climbing, with the gap widening to 22.5 points after 40 examples. AWM also completes composite tasks like "find a Hilton near this location, then show the shortest walking path to a nearby supermarket" that the baseline can't.

### Text versus code

The same "search for a product" skill can be written two ways:

| | Text + examples | Code |
|---|---|---|
| Form | A description plus an action trajectory | A function with a docstring, callable as a tool |
| Pros | Flexible: the agent adapts it to the page in front of it | Testable (run before storing), hierarchical (skills call skills), efficient (one call replaces many steps) |
| Cons | The agent still issues every low-level action itself | Rigid: it does exactly what it says even when the page has changed |

The first problem students raised in class: change the element IDs and a hardcoded skill stops working; move to a different site and everything breaks.

### Agent Skill Induction: code skills

[Agent Skill Induction](https://arxiv.org/abs/2504.06821) (ASI; Wang et al., COLM 2025) swaps AWM's text for code: the LM writes functions like `search_reviews(...)` and `open_marketing_reviews()` from the trajectory, and also rewrites the trajectory to call them.

The key benefit of code is that **it can be executed to verify it**. Instead of judging the original trajectory, the judge looks at the result of re-running the task with the new functions; only if that passes do they go into memory, where the model can call them as tools.

The efficiency difference is large. In one task from the paper — change the billing address and then the shipping address — the memoryless agent hits the 50-step cap without finishing; the agent with code skills calls `navigate_to_address_settings` and `update_address_details` twice and is done in 4 steps. Averaged over five WebArena sites:

| | No memory | Text skills | Code skills |
|---|---|---|---|
| Checkpoints reached | 41.3% | 59.5% | 80.2% |
| Steps per task | 24.5 | 20.6 | 15.0 |

Fried notes this comparison used tasks with highly repeated structure. Fewer steps matter especially for GUI agents: screenshots consume many tokens, and each step's chain of thought has to be generated too.

### SkillWeaver: gating with linters and practice

[SkillWeaver](https://arxiv.org/abs/2504.07079) (Zheng et al., 2025) writes "propose → practice → verify → revise" as a loop:

```python
candidates = propose_skill(task)
episode = practice(candidates, task)
if reward_model(episode.actions, episode.screenshots, task):
    memory.add(candidate)
else:
    candidate = revise(candidate, task)
```

It also runs a linter over skills. The paper's example is `identify_pill(page, imprint, color)` on a medication site: the linter flags that `color` is declared but never used, and the revision adds code to select the color dropdown. Only code skills can get this kind of check.

### Generalization: a new site breaks things

ASI also tested cross-site transfer: a `sort_listings` skill induced on WebArena expects to click a dropdown, but on target.com sorting opens a sidebar, so it fails.

[PolySkill](https://arxiv.org/abs/2510.15863) (Yu et al., ICLR 2026) fixes this with an old software-engineering trick: write an abstract class declaring methods like `search_product`, `add_to_cart`, and `checkout`; write compositions once against the abstract methods, and have each website implement only the primitive browser actions. On a new site, the model decides the old implementation doesn't fit and writes a new implementation of the same abstract class.

### The trade-offs of representation

| Representation | Strengths | Weaknesses |
|---|---|---|
| Retrieved episode | Preserves concrete behavior | Long, hard to transfer |
| Text skill | Flexible guidance | Doesn't improve efficiency |
| Code skill | Executable, composable, efficient | Can be brittle |

Fried sums it up as one question: **how much of the behavior is left to the model, and how much is fixed in the artifact?** The Agent Skills standard allows SKILL.md (text) and `scripts/` (code) side by side; how best to combine them is still open.

## The lifecycle: trouble after induction

### Learning from failures

Everything so far learns from successes. [ReasoningBank](https://arxiv.org/abs/2509.25140) (Ouyang et al., ICLR 2026) also induces **strategies** from failures. The appendix case (Figure 17): the user asks for the full names and price range of Sony Bluetooth headphones, and the agent keeps clicking "next page" until it runs out of steps without answering. The slides add the details: searching "Bluetooth headphones Sony" returns 5,578 results from every department, 12 per page; Fried explains verbally that the store's search uses OR logic. Reflection yields three strategies: tighten the query before browsing, increase items per page, and use the sidebar's category filters.

Failures help some memory types and not others (WebArena shopping, Gemini-2.5-flash, no-memory baseline 39.0):

| Memory type | Successes only | With failures |
|---|---|---|
| Synapse (trajectories) | 40.6 | 41.7 |
| AWM (workflows) | 44.4 | 42.2 |
| ReasoningBank (strategies) | 46.5 | 49.7 |

Fried's reading: "how to avoid the mistake" can be written as general guidance, but when the failed trajectory itself is shown as a demonstration, the model doesn't know what to do with it.

### How accurate does the judge need to be?

All these methods rely on a judge to decide what gets admitted. ReasoningBank flips true labels with a fixed probability to simulate judges of varying accuracy: 52.4 with a perfect judge; 49.7, 48.7 and 49.7 at 90%, 80% and 70%; and 47.6 at both 60% and 50% (a coin flip). There is a clear gap between a perfect judge and every other judge, but the 70–90% range is nearly flat rather than dropping step by step with accuracy. The slide's conclusion: performance depends on judge accuracy, but it still improves across a wide range of judge quality.

### Retrieving too much hurts

The same paper (Appendix C.1) varies how many experiences are retrieved: 0 gives 39.0, 1 gives 49.7, and 2, 3, 4 slide down to 46.0, 45.5, and 44.4. SkillsBench saw the same thing with human-written skills. Fried offers two explanations: the memory may simply contain nothing relevant, so retrieving more just adds noise; or the model gets distracted by extra context, which training might fix.

### Shrinking the skill library

Another option is to actively shrink memory. [TroVE](https://arxiv.org/abs/2401.12869) (Wang et al., ICML 2024) uses a cache-eviction-style rule: after n examples, drop any function used fewer than ½·log₁₀(n) times. On MATH (algebra subset), HiTab, and GQA the library shrinks by 74%, 83%, and 90% (the paper's Figure 8). Fried also points to [Not All Skills Help](https://arxiv.org/abs/2606.15390): a skill that helps one task type can hurt another.

### Training the skill inducer directly

So far, a prompted model "guesses" what will be useful later. Can we train it directly? The difficulty is the reward: task 1's reward says whether task 1 succeeded, not whether saving part of the solution was worthwhile — only a later task can show that.

Two ACL 2026 papers put the later task inside the training example: [SAGE](https://aclanthology.org/2026.acl-long.69/) runs two related tasks in one rollout, and [AgeMem](https://aclanthology.org/2026.acl-long.981/) uses one long trajectory. SAGE compares three rewards on AppWorld (Qwen2.5-32B):

| Reward | Scenario completion |
|---|---|
| Outcome only | 55.4 |
| Both tasks succeed | 56.6 |
| Successful skill reuse | 60.7 |

Fried notes that reinforcement learning doesn't care how complicated the pipeline is (multiple models, storing, retrieving, using) as long as there's a reward, and suggests you could add a term penalizing skill-library size as regularization.

## Discussion: what should persist?

The closing discussion lays out four tensions: exact episode ↔ general skill, flexible guidance ↔ committed execution, reuse what exists ↔ explore and replace, grow the memory ↔ update, merge, delete. Fried adds a table on who should own each decision:

| Decision | Human effort is valuable when… | Agent effort is valuable when… |
|---|---|---|
| Author or induce | The skill or policy is already known | It must be discovered through interaction |
| Verify and admit | Correctness is normative or high-stakes | Outcomes are executable and cheap to test |
| Select and use | Rare exceptions need judgment | Contextual routing repeats and produces feedback |
| Maintain | Accountability requires an owner | Drift is visible in outcomes and repairable |

## What you can do tonight

- **Do it first, then write it down**: pick a workflow you explain to your coding agent every week, let it finish once, ask it to save a SKILL.md on the spot, then run it two or three more times and see what needs changing.
- **Audit your descriptions**: list every skill's description and ask of each one, "would a model reading this know when to use it?" Hermes keeps its whole index around 3k tokens, which is a reasonable ceiling.
- **Move scriptable steps into `scripts/`**: fixed, verifiable steps belong in code; steps that need judgment stay in Markdown.
- **Give your memory a DELETE**: if your agent has long-term memory, make sure writes handle updates and negations, not just appends.
- **Track skill usage**: in the spirit of TroVE, move skills that haven't been used for a while out of the index.

## Further reading

- [Reading Stanford CS329Z Week 4: ReAct and MemGPT](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en)
- [The Skill Management Revolution for LLM Agents: From Voyager to MUSE-Autoskill](/en/posts/ai/2026-06-06-llm-agent-skill-lifecycle-en)
- [Memory and Skills in Hermes Agent](/en/posts/ai/2026-08-18-hermes-agent-memory-skills-en)
- [Agent Memory Systems: From RAG to Read-Write Memory](/en/posts/ai/2026-03-19-agent-memory-systems-en)

## References

- [CMU 11-768 AI Agents course site](https://www.cmu-agents.com/)
- [Lecture 4 slides: Memory and Skills](https://www.cmu-agents.com/slides/lecture-04-memory-and-skills.pdf)
- [Lecture 4 recording](https://www.youtube.com/watch?v=6zigF2a-2Pw&list=PLSN0qpDfUvTM&index=4)
- Assigned readings
  - [OpenHands: How to Create Effective Agent Skills](https://www.openhands.dev/blog/20260227-creating-effective-agent-skills)
  - [SkillsBench (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670)
  - [MemGPT (arXiv:2310.08560)](https://arxiv.org/abs/2310.08560)
  - [Agent Workflow Memory (arXiv:2409.07429)](https://arxiv.org/abs/2409.07429)
  - [Agent Skill Induction (arXiv:2504.06821)](https://arxiv.org/abs/2504.06821)
  - [ReasoningBank (arXiv:2509.25140)](https://arxiv.org/abs/2509.25140)
- Additional references
  - [Mem0 (arXiv:2504.19413)](https://arxiv.org/abs/2504.19413)
  - [Reflexion (arXiv:2303.11366)](https://arxiv.org/abs/2303.11366)
  - [ExpeL (arXiv:2308.10144)](https://arxiv.org/abs/2308.10144), [Agent S (arXiv:2410.08164)](https://arxiv.org/abs/2410.08164), [Synapse (arXiv:2306.07863)](https://arxiv.org/abs/2306.07863), [ICAL (arXiv:2406.14596)](https://arxiv.org/abs/2406.14596)
  - [Voyager (arXiv:2305.16291)](https://arxiv.org/abs/2305.16291), [DreamCoder (arXiv:2006.08381)](https://arxiv.org/abs/2006.08381), [Stitch (arXiv:2211.16605)](https://arxiv.org/abs/2211.16605), [LAPS (arXiv:2106.11053)](https://arxiv.org/abs/2106.11053), [LILO (arXiv:2310.19791)](https://arxiv.org/abs/2310.19791)
  - [SkillWeaver (arXiv:2504.07079)](https://arxiv.org/abs/2504.07079), [PolySkill (arXiv:2510.15863)](https://arxiv.org/abs/2510.15863)
  - [TroVE (arXiv:2401.12869)](https://arxiv.org/abs/2401.12869), [Not All Skills Help (arXiv:2606.15390)](https://arxiv.org/abs/2606.15390)
  - [SAGE (ACL 2026)](https://aclanthology.org/2026.acl-long.69/), [AgeMem (ACL 2026)](https://aclanthology.org/2026.acl-long.981/)
  - [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
  - [Agent Skills specification](https://agentskills.io/specification)
  - [Hermes Agent: prompt_builder.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py), [skills_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skills_tool.py)
