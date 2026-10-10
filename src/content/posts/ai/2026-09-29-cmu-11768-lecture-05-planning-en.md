---
title: "Reading CMU 11-768 L5: Planning — When an Agent Should Think It Through, and When It Should Revise as It Goes"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, planning, task-decomposition, multi-agent]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 5
tldr: "Lecture 5 of CMU 11-768 defines an agent's plan as an explicit, inspectable, revisable representation of intended behavior for this task, and gives four reasons to add planning structure: modularity, environment feedback, long horizons, and control. Fried's own MACU has a manager decompose tasks into a DAG and dispatch parallel sub-agents, raising Odysseys success from 8.5% to 34.0%; on an OSWorld subset, no planning scores 25.0%, an initial DAG with no revisions scores 27.8%, and allowing 10 revisions reaches 58.3%."
description: "A guided reading of CMU 11-768 AI Agents Lecture 5, Planning, Task Decomposition, and Multi-Agent Coordination (Daniel Fried): Plan Mode, chain-of-thought and Least-to-Most, classical STRIPS planning, programs as plans, the workflow-versus-adaptive-agent trade-off, planner/executor splits, SayCan, replanning, thinking versus doing, overthinking, long-horizon failures and self-conditioning, RAO, plans as security boundaries, TravelPlanner, and MACU."
draft: false
glossary:
  - term: "replanning"
    definition: "Revising the not-yet-executed part of a plan mid-execution based on environment feedback (failures, new information) — adding, canceling, or rewriting subtasks."
    context: "Used here as the middle ground between plan-then-execute and fully improvised agents."
  - term: "affordance"
    definition: "Whether an action is actually possible in the current environment state. Classical planning encodes it as preconditions; SayCan estimates it with a learned value function."
    context: "Used here to explain why an LLM can write a reasonable plan without knowing which steps are feasible right now."
  - term: "self-conditioning"
    definition: "The effect where a model becomes more likely to make mistakes after seeing its own earlier errors in the context."
    context: "Used here to explain why one temporary error propagates through the rest of a long-horizon task."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning)

**Video status: Videos included.** [Source details](#course-video-sources)

Lecture 5 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) (September 8, 2026, taught by Daniel Fried; [series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en)) covers planning and task decomposition, ending with a first look at multi-agent systems. Fried frames the topic as a trade-off from the start: the more an agent sticks to one plan, the easier it is for a person to understand and control; the more flexible it is, the better it copes with problems that surface mid-task. The whole lecture looks for positions along that axis.

Slides are on the [course site](https://www.cmu-agents.com/slides/lecture-05-planning.pdf) and the recording is on [YouTube](https://www.youtube.com/watch?v=S8v-dR4s29M&list=PLSN0qpDfUvTM&index=5).

## Course video sources

Verified public recording for CMU 11-768 Fall 2026 lecture 5, published on course instructor Graham Neubig’s channel; its title and description identify this course.

```youtube
url: https://www.youtube.com/watch?v=S8v-dR4s29M
title: CMU AI Agents 2026: 5. Planning, Task Decomposition, and Multi-Agent Coordination
```

Original videos: [CMU AI Agents 2026: 5. Planning, Task Decomposition, and Multi-Agent Coordination](https://www.youtube.com/watch?v=S8v-dR4s29M)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## Opening case: buying the lab a GPU workstation

Fried opens with a task his group actually ran into a few weeks earlier: compare workstation configurations and prices across vendors, check compatibility against the cluster requirements on the internal wiki, and file a purchase requisition.

A standard ReAct-loop agent would run like this:

1. Step 1: go to vendor A → workstations → spec sheet → GPU comparison
2. Step 15: configure 2× RTX 6000, 128 GB RAM, 850 W PSU
3. Step 31: check the wiki — "racks accept 4U chassis; each slot with 1600 W"
4. Along the way, the context gets compacted once, from 128k to 14k tokens
5. Four vendors searched: only D fits, but with a 20-week lead time
6. Step 201: pick D? look for a fifth vendor? relax a requirement?
7. Step 202: it picks one anyway and files the requisition

Three problems: four independent searches ran as one thread in one context; when none of the four vendors was good, there was no mechanism to go back; and the final irreversible action had no gatekeeper.

Drawn as a graph, it becomes clear: the four vendor searches can run in parallel, the compatibility check depends on their results, the requisition depends on the compatibility check — and **the graph itself changes**. When no vendor fits, a fifth search node has to be added. That's replanning.

The lecture poses four questions:

- **Value**: when is planning useful, and when can it hurt?
- **Representation**: how is a plan represented?
- **Commitment**: when is a plan made, and what may change it?
- **Oversight**: how and when should a person weigh in?

## Plan Mode, and what counts as a plan

Fried asks who has used Plan Mode in a coding agent; most of the class raises a hand. [Cursor](https://cursor.com/blog/plan-mode), [Claude Code](https://code.claude.com/docs/en/cli-usage), and Codex all offer something similar, roughly:

```text
read-only investigation → clarifying questions → written plan → human review → execution
```

Why does it help? Fried lists candidates: more compute, better context, an external artifact, decomposition, or the human approval itself. Students add concrete reasons:

- For tasks where you don't trust the agent, reviewing the plan builds trust. Claude Code presents plan mode as a permission mode where only information-gathering actions run first.
- Planning then executing can cost less in total than greedy execution: a strong model writes the plan and a cheaper model carries it out, and parallel subtasks save time.
- A plan is a structured record of what's done and what remains, helping the agent track progress. The motivation matches [L3](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en)'s context compaction, except a plan is explicit and human-editable.

The lecture's working definition:

> A plan is an explicit representation of intended future behavior: the actions or subgoals an agent will attempt, with any ordering or dependencies among them.

Three elaborations:

- **A plan is for this task.** [Last lecture](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en)'s skills are reusable guidance across tasks; a plan can be more specific, tied to a particular repository.
- **A plan organizes future work**, specifying actions or subgoals along with their ordering and dependencies.
- **A plan is a proposal, not a guarantee.** The user, another model, or interaction with the environment can inspect and revise it. The cost: an agent that can replan is harder to predict.

Fried quotes Mike Tyson: "Everybody has a plan until they get punched in the mouth."

Planning recurs across the course: this lecture covers prompted plans and harness structure; the [Coding Agents lecture](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en) covers fixed workflows like Agentless; the two Interaction lectures cover multi-agent communication and human approval; the two Search lectures cover search over plans and revisit this lecture's MACU and RAO.

## Decomposition before acting

### Chain-of-thought is a plan

[Kojima et al. (NeurIPS 2022)](https://arxiv.org/abs/2205.11916) found that "Let's think step by step" alone makes models answer better; [Plan-and-Solve (Wang et al., ACL 2023)](https://arxiv.org/abs/2305.04091) goes further and tells the model to "first understand the problem and devise a plan, then carry out the plan step by step."

Fried argues CoT provides two things: extra compute, and a scratchpad the model can refer back to. But the plan and the solution arrive in one generation, and nothing explicitly inspects the plan. Later, [STaR](https://arxiv.org/abs/2203.14465) and [DeepSeek-R1](https://arxiv.org/abs/2501.12948) trained CoT to raise the probability of a correct answer. Fried says agent planning is now reaching the same stage, with RAO later in the lecture as an example.

### Least-to-Most: decompose, then solve in order

[Least-to-Most Prompting](https://arxiv.org/abs/2205.10625) (Zhou et al., ICLR 2023) separates planning from solving: stage 1 writes subquestions, stage 2 answers them in order and passes answers forward. Models of that era struggled with complex questions but did better on subquestions; subquestions need less context; and improvements grew with problem length. Fried places [Recursive Language Models](https://arxiv.org/abs/2512.24601) in the same family.

The same motivations hold for today's agents: searching one vendor's GPUs doesn't require the other vendors' information, and results can be aggregated later.

### Decomposed Prompting: decomposition enables modularity

[Decomposed Prompting](https://arxiv.org/abs/2210.02406) (Khot et al., ICLR 2023) has a decomposer generate subtasks and route each to a dedicated handler. "What awards have movies produced by people born in 1910 won?" becomes "Who was born in 1910?" (simple QA), "For which movies was #1 the producer?" (positional QA), and so on.

Why use different models for different subtasks? A student answers: some models specialize. Fried adds efficiency: simple subquestions don't need an expensive model. Modularity also lets you improve each handler independently, via in-context examples or training. The paper includes simple programmatic control — defining the order of subtasks and passing one answer as the argument to the next — and Fried previews that RAO, RLM, and MACU hand this orchestration to code.

## Plans that act on the world

This section opens with the slide's joke: "We'll burn that bridge when we come to it."

### Reasoning versus acting

| A CoT reasoning step | An action in the world |
|---|---|
| Changes only text | Changes the state the agent meets next |
| Can be undone by writing more | Can reveal information |
| Every intermediate is visible | Can fail |
| Useful if the model conditions on it better | Can be irreversible: submit, send |

Once you act, plans must handle feasibility, consequences, information, and recovery.

### Classical planning: STRIPS

Classical AI planning represents the world in structured logic. In blocks world:

- **State** is a set of predicates: `on-table(x)`, `on(x, y)`, `clear(x)`, `holding(x)`, `hand-empty`
- **Actions** have preconditions and effects. `pick-up(x)` requires `on-table(x) ∧ clear(x) ∧ hand-empty` and yields `holding(x) ∧ ¬on-table(x) ∧ ¬hand-empty`
- **Planning** is search: find a sequence of actions, each satisfying its preconditions, that reaches the goal

This precondition-plus-effects representation comes from [STRIPS](https://doi.org/10.1016/0004-3702%2871%2990010-5) (Fikes & Nilsson, 1971); PDDL is its successor, and [PlanBench](https://arxiv.org/abs/2206.10498) uses it to evaluate LLM planning. The workhorses of classical planning are search algorithms like BFS, DFS, and A*.

The blocks-world example and predicate names above come from the slides; the original paper differs in the details. The paper itself presents STRIPS (STanford Research Institute Problem Solver) as a problem solver, a program developed as part of robot research at SRI, rather than as a planning language. The paper describes world models as first-order predicate calculus formulas, and its examples are a robot moving between locations and pushing boxes (`goto`, `push`), not blocks world. Each operator has a precondition plus an add list (formulas to add to the model) and a delete list (formulas that no longer hold); the slide's `¬on-table(x)` corresponds to putting that formula on the delete list. The search differs too: the paper says that applying every applicable operator and expanding breadth-first would be impractical, so it uses a resolution theorem prover to test whether the goal holds and a GPS-style means-ends analysis to pick operators that reduce the "differences."

### For LLMs, what's hard has changed

In the LLM world everything is implicit: you don't know exactly when an action applies or what it will do, and mostly you have to try it and see. On the other hand, LLMs have seen so much data that **writing a plausible plan is easy**. The hard part is knowing whether the model's picture of the world is correct.

So LLM agent design uses less deep search and more checking of the world: observation, verification, and recovery from errors. Search and action applicability remain useful concepts (the course's Search unit comes back to them).

### Plan representations: formal, natural language, code

Formal plans (STRIPS) are checkable; language plans (Plan Mode style) are general; programs sit in between.

Around 2023, a line of work had code LLMs write programs that call perception and control APIs as the plan: [Code as Policies](https://arxiv.org/abs/2209.07753) (Liang et al., ICRA 2023), [ProgPrompt](https://arxiv.org/abs/2209.11302) (Singh et al., ICRA 2023), and [Binder](https://arxiv.org/abs/2210.02875) for semi-structured QA. For "stack the blocks in the empty bowl," the LLM writes a program that calls an object detector and a manipulator.

A program runs and can be inspected, and a loop ("repeat until the block is stacked") partly implements search and postconditions. The limit is that it can only do what its APIs and structure allow — but an API can itself call an LLM or another neural model, giving you structured control plus learned flexibility. Fried notes this approach hasn't gained as much traction in robotics as end-to-end multimodal models, but remains very useful for coding agents (CodeAct, next lecture).

### Why replan while acting?

Fried lays out a spectrum by when decisions are made:

| | Developer-defined workflow | Plan-then-execute | Adaptive agent |
|---|---|---|---|
| When decided | Before execution | Before execution | During execution |
| GPU example | Developer hardcodes the vendor list | Model picks which vendors to check, then commits | After four vendors fail, feedback leads it to search for another |
| Example | Agentless (next lecture) | plan-then-execute | RAO, MACU |

The developer-defined version looks like this:

```python
for v in VENDORS:              # fixed list
    specs[v] = read_specs(v)   # model call
ok = [v for v in specs if fits(v)]
requisition(cheapest(ok))
```

Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) recommends finding the simplest solution possible and adding complexity only when needed — if a workflow like this does the job, don't reach for an agent. Committing up front is faster, cheaper, and more predictable, and each step can use a smaller model; replanning lets the model adapt when execution reveals new information. **Use replanning when that feedback is worth the extra cost and complexity.**

A student points out the blog post is now marked as outdated. Fried's response: newer models are much better at making good decisions without workflow constraints, and for coding agents Agentless is no longer the strongest approach. But if you're working on a new problem where agents haven't been trained to handle environmental changes, starting with a workflow is the safer path.

## Four reasons to add planning structure

Fried quotes Fred Brooks's *The Mythical Man-Month* — "Plan to throw one away; you will, anyhow." — then returns to the GPU case to name four pressures:

| Reason | Approach | GPU example |
|---|---|---|
| Modularity | Decompose and specialize | Search each vendor separately |
| Feedback | Replan when needed | None fits, so revise the plan |
| Long horizon | Limit context | Requirements and progress persist across the whole task |
| Control | Separate authority | A person approves before submitting |

The rest of the lecture's papers are organized under these four.

### Modularity: separating planner from executor

[UGround](https://arxiv.org/abs/2410.05243) (Gou et al., ICLR 2025) and [Agent S](https://arxiv.org/abs/2410.08164) tackle this problem: GPT-4o understands web pages and plans well, but is bad at clicking exact pixel coordinates. The fix: let GPT-4o describe the next action in language ("type the query into the search bar at the top of the page"), and train a separate 7B grounding model on synthetic data to map that description to screen coordinates.

Once split, each component can be optimized independently — fix whichever is the bottleneck. Fried notes that frontier labs later folded this kind of fine-grained web data directly into large-model training, so the split is less necessary for accuracy, but still valuable for efficiency.

### Training the planner

[Plan-and-Act](https://arxiv.org/abs/2503.09572) (Erdogan et al., ICML 2025) addresses the fact that "plans" as training data don't naturally exist. It takes trajectories judged successful, has a teacher model segment the actions and label each segment in natural language, then fine-tunes a planner (task description → list of steps) and an executor (step description → actual actions) on the annotated data. Fried points out that this resembles last lecture's workflow induction, except here it produces training data.

### Beware of fixed roles and multi-agent systems

Fried includes a slide from Graham Neubig. A series of papers had models simulate a software company, with separate roles for testing, editing, even a product manager (for example, [CodeR](https://arxiv.org/abs/2406.01304)). In [Don't Sleep on Single-agent Systems](https://www.openhands.dev/blog/dont-sleep-on-single-agent-systems), Neubig argues these role decompositions have had limited success on coding:

- Roles are fixed before the task arrives, so the verifier can't localize a fault or check its own answer
- Handoffs are summary reports, which can drop the context the next agent needs

A single agent that handles the full context of prior actions well has all of that information available. That's the trade-off between a single agent and planning-based decomposition.

### Affordances: can this step be done right now?

Classical planning has preconditions; LLMs don't. [SayCan](https://arxiv.org/abs/2204.01691) (Ahn et al., CoRL 2022) gives the example: the LLM might suggest "pick up the apple" when there's no apple in view. It learns a value function for each robot skill that predicts the probability of completing it from the current state, then multiplies that probability with the LLM's probability of producing the step to rescore candidate subtasks. [Language Models as Zero-Shot Planners](https://arxiv.org/abs/2201.07207) (Huang et al., ICML 2022) is related work from the same period.

### Feedback: replanning from the environment

[LLM-Planner](https://arxiv.org/abs/2212.04088) (Song et al., ICCV 2023) demonstrates this in the ALFRED simulated household. The task is "cook a potato and put it in the recycling bin" (Fried notes these tasks were auto-generated, so some are funny). Midway through the initial plan the agent reports "I can't find the potato, but I see a fridge"; feed that back to the LLM and the new plan becomes "open the fridge." [Inner Monologue](https://arxiv.org/abs/2207.05608) and [SwiftSage](https://arxiv.org/abs/2305.17390) follow the same line.

### Think more, or act more?

[Thinking vs. Doing](https://arxiv.org/abs/2506.07976) (Shen et al., NeurIPS 2025) matches compute across three ways to spend it: longer CoTs, sampling multiple candidates and picking one, or interacting more with the environment. At the same token budget, the more-interaction line usually does best. Its prompting trick is simple: when the agent signals completion, insert "You just signaled task completion. Let's pause and think again." Fried's conclusion: getting more information from the environment, as long as you don't put yourself in a bad state, usually helps a lot.

[The Danger of Overthinking](https://arxiv.org/abs/2502.08235) (Cuadron et al., 2025, with Neubig as a co-author) looks at the same thing from the other side and identifies three overthinking patterns:

- **Analysis paralysis**: too much thinking, too little acting
- **Rogue actions**: after hitting an error, firing off several actions at once without waiting for the environment to respond to the previous one
- **Premature disengagement**: declaring completion, or giving up, without checking with the environment

Fried says these behaviors can be detected from how many tokens were spent reasoning, without reading the reasoning itself, so the approach works for many API models. The paper's overthinking score, however, comes from an LLM judge (Claude 3.5 Sonnet) that reads the full trajectory and scores it 0–10, validated against four expert annotators. On SWE-bench, higher overthinking scores predict lower issue resolution, for both reasoning and non-reasoning models.

[Calibrate-Then-Act](https://arxiv.org/abs/2602.16699) (Ding, Tomlin, Durrett, 2026) is about thinking versus looking. The task: parse files with a hidden format — delimiter (`,` `;` `\t`), quote character (`"` `'`), header rows to skip (0 or 1) — twelve combinations, and the file only parses if all three are right. The only clue is the filename (`sales_fr.tsv` points to a tab). CTA puts estimated format likelihoods directly into the prompt, and the model then says something like "the delimiter is most likely ';' with probability ~0.85… but I'm not 100% sure, so maybe I should run some unit tests to confirm." Fried didn't have time to go into detail but recommends reading it. [PPP-Agent](https://arxiv.org/abs/2511.02208) is a related reference.

### Long horizons: one temporary error ruins every later decision

[Vending-Bench](https://arxiv.org/abs/2502.15840) (Backlund & Petersson, 2025) has an agent run a vending machine business — pricing, ordering, restocking. The difficulty is duration: each run is capped at 2,000 messages, about 25 million tokens; the longest-lasting model, o3-mini, made it to simulated day 222. One failure chain from the paper:

1. **Premature restock**: the agent tries to restock before the delivery arrives; the environment correctly reports "items unavailable"
2. **Wrong inference**: the agent reads "unavailable now" as "the business has failed," and never waits for the fulfillment email or checks again
3. **Error persists**: the daily fee later becomes "fraud," and it sends an email with the subject "EMERGENCY: Unauthorized Fees After Business Termination"

Fried asks: was this just a bad plan?

[The Illusion of Diminishing Returns](https://arxiv.org/abs/2509.09677) (Sinha et al., ICLR 2026) offers another angle. Long-task success is the product of per-step success, so even small gains in step accuracy dramatically lengthen the tasks a model can complete (Fried's example: going from 0.9 to 0.999). The paper also finds **self-conditioning**: the authors rewrite the chat history to inject different fractions of wrong answers, and the higher the error fraction, the lower the model's accuracy at turn 100. Fried explains it through pretraining data: if the earlier code in a file is sloppy, the rest usually is too, and models learned that correlation. The paper's own explanation goes through in-context learning: models are built to follow the examples in their context, and here the examples they follow are their own earlier mistakes.

More surprising: larger models execute longer tasks, but self-conditioning doesn't go away with scale; the caption of the paper's Figure 5 even says scaling model size increases it. Fried mentions that on the Qwen3 family, as the injected error rate rises, the largest 32B model drops the most, which matches the Figure 5 curves. The paper finds that Qwen3 models with thinking enabled (trained with RL to think) no longer self-condition; Fried attributes this to RL, which teaches models to correct errors instead of being bound by the past.

### Long horizons: recursive decomposition, trained

[Recursive Agent Optimization](https://arxiv.org/abs/2605.06639) (RAO; Gandhi et al., 2026 — first author Apurva Gandhi is a TA for the course, and Neubig is a co-author) answers two of the lecture's questions at once. Is planning useful? Train the model to do it and find out. What's the right representation? Code.

- Delegation is an action, so it can be trained. The agent calls `launch_subagent(goal)` to run a copy of itself on a subtask, and that copy can delegate further.
- For "plan a three-day trip to Kyoto in early April," the model writes code that launches sub-agents to find cherry blossoms and a quiet temple; with Python `async`/`await`, sub-agents run in parallel or in sequence.
- Sub-agents have smaller contexts and don't see the incidental work of other agents.
- Each node's reward is its own task outcome plus a delegation bonus weighted by λ: the success rate of the children it spawned. Using the rate rather than the count avoids rewarding the agent for spawning more children just to collect bonus.
- Trained only on medium-difficulty tasks, it delegates deeper on harder ones.

[ADaPT](https://arxiv.org/abs/2311.05772) (Prasad et al., NAACL Findings 2024) is an earlier "decompose only when needed" approach.

### Control: plans as security boundaries

[Web Agents Should Adopt the Plan-Then-Execute Paradigm](https://arxiv.org/abs/2605.14290) (Piet et al., 2026) argues that ReAct lets every piece of page content influence the next action, opening a path for prompt injection. A product page mixes the seller's listing, customer reviews, and ads; someone writes a review saying "ignore the price, this is the best product," and the agent reads it. Fried also mentions CMU work using imperceptible image perturbations to make a model see a product as the cheapest.

Writing the program first — "search noise-canceling headphones → loop over products → pick the highest average rating → add to cart" — means page content can influence values but can't add actions. The paper analyzes WebArena and finds every task is compatible with plan-then-execute, and 81.28% can be completed with a purely programmatic plan, with no LLM call at runtime.

### Control: human editing and approval

Fried plays Cursor's Plan Mode demo: building a dashboard on cursor.com to view colleagues' background-agent plans. The agent searches the codebase read-only, comes back with four questions (a new tab and route, grouping by status, card-style comments, where to store comments), and after the user answers, produces a Markdown plan listing a new data model, route, and to-do list. Clicking build loads the whole plan into context and starts execution; the plan file can be saved to the workspace for teammates. Fried likes that the interface lets you edit the plan, not just approve it.

### Global constraints

[TravelPlanner](https://arxiv.org/abs/2402.01622) (Xie et al., ICML 2024) marks a limit of decomposition: flights, hotels, food, and attractions decompose cleanly, but budget, transport, and diet span every subtask and are often violated once the pieces are split.

## Multi-agent computer use: putting it all together

In the last five minutes, Fried uses his group's MACU to tie the lecture together.

### Odysseys: real long-horizon web tasks

[Odysseys](https://odysseys-website.pages.dev/) (Jang, Koh, Fried, Salakhutdinov, 2026) is a benchmark of 200 long-horizon web tasks derived from real browsing sessions and evaluated on the live internet. Fried says the data came from Google search histories that volunteers chose to share, with tasks like "find surgeons for ACL surgery"; he also says a task takes hundreds of steps and half an hour to an hour of human time, and the demo task needs 93 steps just to visit the sites and fill in a spreadsheet. Its structure resembles the GPU case.

### How MACU works

[Multi-Agent Computer Use](https://arxiv.org/abs/2606.01533) (MACU; Koh, Salakhutdinov, Fried, 2026):

1. A **manager** decomposes the user's task into a DAG encoding dependencies and goals. Fried says the manager should be a strong model, "something like a recent Claude Sonnet"; the paper's main experiments actually use Claude Opus 4.6 as manager, and Sonnet 4.6 appears in the ablation, where it ranks second (52.8%)
2. Each round, the manager dispatches parallel computer-use sub-agents on the nodes whose dependencies are satisfied
3. When a sub-agent reports back, the manager checks the result: if wrong, it has the sub-agent redo it; if there's a new finding, it revises the graph — adding, canceling, or rewriting nodes
4. Repeat until the graph is complete

The paper emphasizes partial observability: information downstream agents may not be able to re-observe is carried forward through the manager and the DAG. The demo, "decide whether to go to brunch in San Francisco today," shows the manager adding a node mid-run when it realizes it needs more information.

### Results

Success rates, single agent versus MACU, on four benchmarks (the paper's Table 1; all sub-agents run Qwen3.6-27B and the MACU manager is Opus 4.6; the slides abbreviate Online-Mind2Web as Online-M2W):

| Benchmark | Single agent | MACU |
|---|---|---|
| OSWorld | 43.8% | 48.5% |
| Online-Mind2Web | 52.2% | 55.6% |
| WebTailBench | 20.8% | 29.5% |
| Odysseys | 8.5% | 34.0% |

The longer and more structured the task, the larger the gap.

Ablations on a 36-task OSWorld subset show three things:

- **Stronger managers coordinate better**: with a Qwen3.5-4B worker, the single agent scores 25.0%; with Opus 4.6 as manager it reaches 58.3% at about $0.46 per task. Fried's explanation: since the cheap worker does most of the actions, a stronger manager doesn't blow up the cost.
- **Weaker workers are lifted more**: with Opus 4.6 as manager, Qwen3.5-4B goes from 25.0% to 58.3% (+33.3), while Qwen3.6-27B goes from 47.2% to 66.7% (+19.5).
- **The gains depend on replanning**: the paper's planning budget B is how many times the manager may modify the DAG. B = 0 (no planning) gives 25.0%; B = 1 (an initial DAG, no modifications afterward) gives 27.8%, barely different; B = 5 gives 47.2% and B = 10 gives 58.3%. This is the lecture's most direct evidence that replanning helps.

On parallelism, on the Odysseys easy subset (45 tasks), going from 1 to 4 workers cuts wall-clock time from 25.4 to 7.9 minutes (3.2× faster), with success moving from 53.3% to 60.4% (48.9% with 2 workers, so not monotonic).

## Closing: four questions before adding planning

Adding planning is an architectural choice that adds complexity and isn't always worth it. Fried's checklist:

1. Are the subtasks separable? Would planner and executor benefit from different models or training?
2. Which failures or observations should change the plan?
3. How will the system stop errors and context from accumulating?
4. What information or authority stays separate — and who approves irreversible actions?

Four open problems:

- **Checking**: language plans and subgoal graphs have no general validator
- **Calibration**: agents misjudge when to think, look, ask, or revise
- **Global state**: cross-subtask constraints resist both decomposition and longer context
- **Scaffolding**: whether trained reasoning absorbs these structures remains open

## What you can do tonight

- **Circle the last step**: list the irreversible actions your agent can take (submit, send email, delete, pay) and confirm each has a human or rule in front of it.
- **Hardcode what you can**: if the steps are the same every time, write a workflow in code and hand only the real judgment calls to the model.
- **Consider plan-then-execute for web agents**: have the model generate a program first, and pass page content in only as values, never letting it choose the next action.
- **Budget and log retries and plan revisions**: MACU shows the number of graph revisions correlates with success, so your system should measure it too.
- **Watch for stale errors in long tasks**: old mistakes in context make new ones more likely; when compacting, consider summarizing failed attempts down to the lesson.

## Further reading

- [Reading Stanford CS329Z Week 5: One Agent or a Meeting — Multi-Agent Systems and the Three Optimization Axes](/en/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization-en)
- [AI-Native SDLC Playbook L4: Plan Mode — Write the Plan Before Writing Code](/en/posts/ai/2026-09-12-ai-native-sdlc-playbook-04-plan-mode-en)
- [Multi-Agent Error Propagation and Recovery](/en/posts/ai/2026-06-04-multi-agent-error-propagation-recovery-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-768 AI Agents course site](https://www.cmu-agents.com/)
- [Lecture 5 slides: Planning and Task Decomposition](https://www.cmu-agents.com/slides/lecture-05-planning.pdf)
- [Lecture 5 recording](https://www.youtube.com/watch?v=S8v-dR4s29M&list=PLSN0qpDfUvTM&index=5)
- Assigned readings
  - [Cursor: Introducing Plan Mode](https://cursor.com/blog/plan-mode)
  - [Least-to-Most Prompting (arXiv:2205.10625)](https://arxiv.org/abs/2205.10625)
  - [Decomposed Prompting (arXiv:2210.02406)](https://arxiv.org/abs/2210.02406)
  - [Code as Policies (arXiv:2209.07753)](https://arxiv.org/abs/2209.07753)
  - [SayCan (arXiv:2204.01691)](https://arxiv.org/abs/2204.01691)
  - [Plan-and-Act (arXiv:2503.09572)](https://arxiv.org/abs/2503.09572)
  - [Thinking vs. Doing (arXiv:2506.07976)](https://arxiv.org/abs/2506.07976)
  - [Calibrate-Then-Act (arXiv:2602.16699)](https://arxiv.org/abs/2602.16699)
  - [Recursive Agent Optimization (arXiv:2605.06639)](https://arxiv.org/abs/2605.06639)
  - [Multi-Agent Computer Use (arXiv:2606.01533)](https://arxiv.org/abs/2606.01533)
- Additional references
  - [Fikes & Nilsson, 1971. STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving](https://doi.org/10.1016/0004-3702%2871%2990010-5) (*Artificial Intelligence* 2, 189–208; [public copy on Nilsson's Stanford page](https://ai.stanford.edu/~nilsson/OnlinePubs-Nils/PublishedPapers/strips.pdf), a scan of the journal version)
  - [Claude Code CLI and permission modes](https://code.claude.com/docs/en/cli-usage)
  - [Large Language Models are Zero-Shot Reasoners (arXiv:2205.11916)](https://arxiv.org/abs/2205.11916), [Plan-and-Solve (arXiv:2305.04091)](https://arxiv.org/abs/2305.04091)
  - [STaR (arXiv:2203.14465)](https://arxiv.org/abs/2203.14465), [DeepSeek-R1 (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948)
  - [Recursive Language Models (arXiv:2512.24601)](https://arxiv.org/abs/2512.24601)
  - [PlanBench (arXiv:2206.10498)](https://arxiv.org/abs/2206.10498)
  - [ProgPrompt (arXiv:2209.11302)](https://arxiv.org/abs/2209.11302), [Binder (arXiv:2210.02875)](https://arxiv.org/abs/2210.02875)
  - [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
  - [UGround (arXiv:2410.05243)](https://arxiv.org/abs/2410.05243), [Agent S (arXiv:2410.08164)](https://arxiv.org/abs/2410.08164)
  - [Don't Sleep on Single-agent Systems](https://www.openhands.dev/blog/dont-sleep-on-single-agent-systems), [CodeR (arXiv:2406.01304)](https://arxiv.org/abs/2406.01304)
  - [Language Models as Zero-Shot Planners (arXiv:2201.07207)](https://arxiv.org/abs/2201.07207)
  - [LLM-Planner (arXiv:2212.04088)](https://arxiv.org/abs/2212.04088), [Inner Monologue (arXiv:2207.05608)](https://arxiv.org/abs/2207.05608), [SwiftSage (arXiv:2305.17390)](https://arxiv.org/abs/2305.17390)
  - [The Danger of Overthinking (arXiv:2502.08235)](https://arxiv.org/abs/2502.08235)
  - [PPP-Agent (arXiv:2511.02208)](https://arxiv.org/abs/2511.02208)
  - [Vending-Bench (arXiv:2502.15840)](https://arxiv.org/abs/2502.15840)
  - [The Illusion of Diminishing Returns (arXiv:2509.09677)](https://arxiv.org/abs/2509.09677)
  - [ADaPT (arXiv:2311.05772)](https://arxiv.org/abs/2311.05772)
  - [Web Agents Should Adopt the Plan-Then-Execute Paradigm (arXiv:2605.14290)](https://arxiv.org/abs/2605.14290)
  - [TravelPlanner (arXiv:2402.01622)](https://arxiv.org/abs/2402.01622)
  - [Odysseys](https://odysseys-website.pages.dev/)
