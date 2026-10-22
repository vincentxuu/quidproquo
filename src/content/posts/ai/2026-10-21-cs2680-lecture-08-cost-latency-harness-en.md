---
title: "Making Agents Cheap and Fast: Cost Breakdown, the Critical Path, and Harness Architecture | Harvard CS2680 Lecture 8"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-harness, prompt-caching, cost-optimization, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 10
tldr: "CS2680 Lecture 8 (2026-10-07) has two halves. The first takes apart an agent's bill: cost is a product of users × sessions per user × turns per session × steps per turn × tokens per step × price per token, and the last four are the ones you can cut. The students' own Claude Code logs show 97.6% of tokens are cached re-reads, so keeping the prefix stable matters more than keeping the prompt short. Speed is set by the critical path, not the sum of every step. The second half compares three harness architectures (monolithic, modular, microkernel) and the design choices of eight open-source and commercial harnesses. This post works one bill by hand: put a timestamp at the start of the system prompt and the same task goes from 23.6 units back to 65 or more."
description: "Guide to Lecture 8 of Harvard CS2680 Modern AI Systems (Fall 2026): the cost product and its four levers (turns, steps, tokens, price), when a prefix cache hits, counter-costs and budget caps, the critical path and speculative actions, monolithic, modular, and microkernel harness architectures, and the design choices of eight harnesses. Based on the public slides and the course note, with pricing checked against Anthropic and OpenAI documentation on 2026-10-22."
draft: false
glossary:
  - term: "critical path"
    definition: "The longest chain of steps in a task where each one waits on the one before. It sets how fast the task can finish; speeding up any step not on this chain does not shorten completion time."
    context: "Lecture 8 uses it to explain why parallelism cuts waiting but does not necessarily save money."
  - term: "speculative action"
    aliases: ["speculative actions", "speculative execution"]
    definition: "Guessing the next action cheaply and running it early while the main model is still thinking; a correct guess skips the wait, a wrong one is thrown away. The idea comes from speculative execution in CPUs."
    context: "Lecture 8 lists it as the last way to make an agent faster, and warns that it only suits actions that can be undone."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness)

**Video status: The course is not recorded.** This post is based on the public slides and the course note; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 8 of [CS2680](https://cs2680.com/) met on October 7, 2026, under the title "Agent design V: cost-effective agents" ([slides](https://cs2680.com/slides/8_agent_design_5.pdf)), with the course note "[Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)" as its companion. Earlier lectures taught you to build an agent and measure whether it's any good; this one asks why the agent you built is so expensive and so slow, and what to change.

The lecture answers three questions: where does an agent's cost come from, and which part should you cut first? Where is the latency? And what structure should the harness have? By the end you should be able to take the token bill for an agent session, point out the biggest cost factor, and propose a change that won't lower the success rate.

The slides come in two parts with no transition slide between them: cost and speed (p5–38), then harness architecture and a comparison of eight harnesses (p39–53). This post follows that order in two halves, joined by one idea: once you know how to save money and time, the next question is what kind of program structure those techniques belong in. The lecture only counts the cost of model calls, not other compute (p5).

## First half: cost and speed

### Cost is a product

Start with how a session is structured. A session has several turns; a turn runs from when you send a message to when the agent replies. A turn has several steps, and each step is one model call or one tool call ([p6](https://cs2680.com/slides/8_agent_design_5.pdf#page=6)). The slides write total cost as a product ([p7](https://cs2680.com/slides/8_agent_design_5.pdf#page=7)):

```text
cost = users × sessions per user
     × turns per session × steps per turn × tokens per step
     × price per token
```

The first two terms grow when the product is good and more people use it; you want them bigger. The last four describe how the agent runs each time; you want them smaller. The rest of the lecture goes through those four one at a time.

### The students' own bill

The instructor uses the Claude Code session logs that students submitted with Assignments 1 and 2. These are the most convincing numbers in the lecture:

| What's measured | Assignment 1 | Assignment 2 | Page |
|---|---|---|---|
| Share of sessions with a single prompt | 68% | 75% | [p8](https://cs2680.com/slides/8_agent_design_5.pdf#page=8) |
| Steps per turn (median) | 3 | 4 | [p10](https://cs2680.com/slides/8_agent_design_5.pdf#page=10) |
| Main-agent tokens per step (median) | 208K | 301K | [p13](https://cs2680.com/slides/8_agent_design_5.pdf#page=13) |
| Context size around step 500 | 670K | 650K | [p14](https://cs2680.com/slides/8_agent_design_5.pdf#page=14) |

The last chart matters most ([p15](https://cs2680.com/slides/8_agent_design_5.pdf#page=15)): it breaks down every token across all Assignment 1 steps. The first two columns below are the slide's numbers; the last is this post's conversion, multiplying each share by its price ratio. It uses the 1 : 10 : 50 ratio from the slide and leaves out the cache-write premium; at Anthropic's 1.25× for a 5-minute cache, writes come to about 18% and cache reads still about 68%:

| Category | Token share | Price ratio | Share of spend |
|---|---|---|---|
| Cached re-reads (cache read) | 97.6% | 1 | about 71% |
| New content sent for the first time (cache write) | 2.0% | 10 | about 15% |
| Model output | 0.4% | 50 | about 15% |

Even at a tenth of the price, cache reads are the biggest part of the bill. It's the same point [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en) made: most of the spend lands on cached re-reads.

### Four levers

**Fewer turns.** Turn k re-reads turns 1 through k−1, so total cost grows roughly with the square of the turn count ([p9](https://cs2680.com/slides/8_agent_design_5.pdf#page=9)). Caching makes re-reading cheaper, but the amount re-read still grows with the square; only the coefficient shrinks. Users come back mostly because there was no plan, the agent stopped halfway, or it handed over without checking. The fixes: confirm the goal and plan before acting, split the task into subtasks that each have a done check, and run the tests before handing back.

**Fewer steps.** Every model call re-reads the full context, so fewer calls cost less ([p11](https://cs2680.com/slides/8_agent_design_5.pdf#page=11)). The slide's example does three actions: one at a time takes 4 model calls, while planning first and then issuing 3 parallel tool calls in one step takes 2. The other two moves are reusing plans and skills that worked before, and loading the files you need at the start instead of one per step.

**Fewer tokens per step.** Tokens that stay in context are paid for again on every later step ([p16](https://cs2680.com/slides/8_agent_design_5.pdf#page=16)). On the input side, most of the techniques are the context management from [Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en): truncate tool outputs you've already used, summarize old turns into state, keep the error rather than the full log. Large outputs can go to a file with only the path passed along, and exploration can go to a subagent that returns a summary. On the output side there are three moves ([p18–19](https://cs2680.com/slides/8_agent_design_5.pdf#page=18)):

- State length and format in the prompt, such as "answer in 100 words or fewer" or "return only JSON."
- Set a `max_tokens` cap in the API call. The catch is that it can cut an answer mid-sentence, and reasoning can use up the cap first.
- Require a schema with only the fields you need, and match reasoning effort to the step: low effort for lookups, high effort for planning and debugging.

**A lower price per token.** There are three routes:

- **Caching and batching.** The slides list Claude API prices relative to base input ([p21](https://cs2680.com/slides/8_agent_design_5.pdf#page=21)): output 5×, base input 1×, batch input 0.5×, cached input 0.1×, batch plus cached 0.05×. The matching practice is to keep the prefix (the part at the start of every request that stays the same) stable, such as the system prompt, tool definitions, and early history, and to batch work that can wait (evals, backfills, bulk jobs).
- **Model routing** ([p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)) comes in three types. The first chooses up front: a router picks the model before each turn. The second escalates on failure: try a cheap model first and move up when a check fails. The third re-routes each step, based on the trajectory so far and the remaining budget. The hard part is that one planning mistake from a cheap model can waste many later steps.
- **System techniques**: MoE, quantization, distillation, speculative decoding, KV cache optimization, faster kernels, and so on. The slides only name them and leave them for Part II ([p23](https://cs2680.com/slides/8_agent_design_5.pdf#page=23)).

The p21 multipliers need checking against current prices. The table below is from [Anthropic's pricing page](https://platform.claude.com/docs/en/about-claude/pricing) on 2026-10-22:

| Item | Slide p21 | Price on 2026-10-22 |
|---|---|---|
| Output | 5× | 5×, the same on every model |
| Batch input | 0.5× | 0.5×, and it stacks with the cache discount |
| Cached input | 0.1× | 0.1× on most models; 0.05× on Opus 5.5 and Sonnet 5.5, 0.025× on Fable 5.1 and Mythos 5.1 |
| Cache write | not listed | 1.25× for a 5-minute cache, 2× for a 1-hour cache |

The slide's ratios still hold on most models, and the newest ones cache even more cheaply. Watch the last row: writing to the cache costs extra the first time, so marking content you'll only use once for caching loses money.

### A gap to fill first: when a prefix cache hits

How caching works is a Part II topic, but this lecture's bill analysis rests on it, so here are the conditions for a hit.

Every time a model processes some input, it computes intermediate results (the KV cache). If the next request **starts exactly the same way**, the serving side can reuse what it already computed instead of recomputing it, and the price drops too (the hand-worked example in the [course overview](/posts/ai/2026-10-21-cs2680-course-overview-en) shows why an agent re-reads everything at each step). The key word is "starts": compare from the first token onward, and once you reach the first difference, nothing after it counts as a hit.

API billing, though, doesn't compare token by token. Anthropic has you mark "cache up to here" in the request with `cache_control`; that position is called a cache breakpoint. The cache is stored only at breakpoints. The next request looks backward from its own breakpoint for a position that a previous request stored and that is identical up to that point ([prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#how-automatic-prefix-checking-works)). What hits is "the whole stretch up to some breakpoint"; even if part of the content before a breakpoint matches, it doesn't count unless something was stored there. If you don't want to place breakpoints yourself, automatic caching puts one on the last cacheable block.

Both providers' documentation is direct about this:

- **The order is fixed.** Anthropic lines the request up as `tools` → `system` → `messages` before comparing. Tool definitions come first, so changing them invalidates the whole cache; changing the system prompt leaves the tool definitions alone but invalidates the system prompt and every message after it ([prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#what-invalidates-the-cache)).
- **Timestamps are the number one killer.** Anthropic's documentation uses this example: five blocks that never change, then a sixth block that carries a timestamp and the user message on every request, with the breakpoint on the sixth block. When the time changes, the content up to the breakpoint is different; looking backward, nothing was ever stored at the first five positions. So every request pays for a cache write and never gets a read. The fix is to move the breakpoint to the fifth block, the last stretch that doesn't change. Automatic caching has the same problem, because its breakpoint lands on the block that changes. OpenAI also compares only at specific boundaries, and its advice is to move timestamps, user-specific content, and other changing material to the end, or into later conversation messages ([OpenAI prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching)).
- **Too short won't cache; too long expires.** [Anthropic's](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#cache-limitations) minimum is 512 to 4,096 tokens depending on the model, with a default lifetime of 5 minutes that resets on each hit; [OpenAI's](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences) minimum on GPT-5.6 and later is 1,024 tokens, with a default of 30 minutes. If an agent waits on a long-running tool, the cache may have expired by the time it comes back; in that case you can switch to the 1-hour cache, at 2× to write.

The [course note](https://cs2680.com/notes/cost-effective-agents#serving) puts it in one line: a shorter prompt is not necessarily a cheaper one, and shortening or reordering a stable prefix can remove the discount along with it (the section "Lower serving cost without confusing it with fewer tokens"). An independent 2026 evaluation ([Don't Break the Cache](https://arxiv.org/abs/2601.06007)) measured this across three providers and more than 500 agent sessions: used well, caching cuts API costs by 41–80%. But marking the entire context for caching without discrimination sometimes made latency worse.

### Working a bill by hand

This is a teaching example from this post. It continues the 5-step "fix the failing test" task from the overview: the opening context is 10,000 tokens, each step's tool result and model output adds 1,000 tokens to the context, and each model output is 200 tokens. Prices use the p21 ratios, with 1 unit = the price of 1,000 base input tokens; to keep the arithmetic simple, the cache-write premium is left out for now.

| Call | Context read this call | No cache | Stable prefix, cached |
|---|---|---|---|
| 1 | 10,000 | 10.0 | 10.0 (all new) |
| 2 | 11,000 | 11.0 | 10,000×0.1 + 1,000×1 = 2.0 |
| 3 | 12,000 | 12.0 | 11,000×0.1 + 1,000×1 = 2.1 |
| 4 | 13,000 | 13.0 | 2.2 |
| 5 | 14,000 | 14.0 | 2.3 |
| Input subtotal | | 60.0 | 18.6 |
| Output (5 calls × 200 tokens × 5) | | 5.0 | 5.0 |
| Total | | 65.0 | 23.6 |

With a stable prefix, the bill is 36% of the uncached one. Now put "Current time: 2026-10-07 14:03:27" on the first line of the system prompt. The system prompt differs on every call, so the comparison breaks right after the tool definitions; the tool definitions have no breakpoint of their own, so none of the five calls hits, and the bill goes back to 65 units. If the harness still marks the whole thing for caching, every call also pays the write premium: at Anthropic's 1.25× that's 80 units, more than not caching at all.

With the write premium included, the stable-prefix version comes to 27.1 units, still less than half. On Opus 5.5, where cache hits cost 0.05×, the stable prefix comes to 21.3 units.

```diagram
title: The same 5-step task: stable prefix vs a timestamp at the start
desc: With a stable prefix, only the 1,000 new tokens in calls 2 to 5 pay full price, for 18.6 units of input; with a timestamp at the start of the system prompt nothing hits the cache, for 60.0 units.
caption: Teaching example from this post. Bar length is proportional to the context read on that call; number on the right = input cost of that call, where 1 unit = the price of 1,000 ordinary input tokens. Cache hits use p21's 0.1×; the cache-write premium is left out.
---
<svg viewBox="0 0 640 352">
  <text class="dg-label" x="96" y="36" dominant-baseline="central">Stable prefix, cached</text>
  <text class="dg-label" x="380" y="36" dominant-baseline="central">Timestamp at the top</text>
  <text class="dg-sub" x="84" y="76" text-anchor="end" dominant-baseline="central">Call 1</text>
  <rect class="dg-bar dg-c-accent" x="96" y="64" width="142.9" height="24"/>
  <text class="dg-sub" x="246.9" y="76" dominant-baseline="central">10.0</text>
  <rect class="dg-bar dg-c-accent" x="380" y="64" width="142.9" height="24"/>
  <text class="dg-sub" x="530.9" y="76" dominant-baseline="central">10.0</text>
  <text class="dg-sub" x="84" y="116" text-anchor="end" dominant-baseline="central">Call 2</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="104" width="142.9" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="238.9" y="104" width="14.3" height="24"/>
  <text class="dg-sub" x="261.1" y="116" dominant-baseline="central">2.0</text>
  <rect class="dg-bar dg-c-accent" x="380" y="104" width="157.1" height="24"/>
  <text class="dg-sub" x="545.1" y="116" dominant-baseline="central">11.0</text>
  <text class="dg-sub" x="84" y="156" text-anchor="end" dominant-baseline="central">Call 3</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="144" width="157.1" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="253.1" y="144" width="14.3" height="24"/>
  <text class="dg-sub" x="275.4" y="156" dominant-baseline="central">2.1</text>
  <rect class="dg-bar dg-c-accent" x="380" y="144" width="171.4" height="24"/>
  <text class="dg-sub" x="559.4" y="156" dominant-baseline="central">12.0</text>
  <text class="dg-sub" x="84" y="196" text-anchor="end" dominant-baseline="central">Call 4</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="184" width="171.4" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="267.4" y="184" width="14.3" height="24"/>
  <text class="dg-sub" x="289.7" y="196" dominant-baseline="central">2.2</text>
  <rect class="dg-bar dg-c-accent" x="380" y="184" width="185.7" height="24"/>
  <text class="dg-sub" x="573.7" y="196" dominant-baseline="central">13.0</text>
  <text class="dg-sub" x="84" y="236" text-anchor="end" dominant-baseline="central">Call 5</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="224" width="185.7" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="281.7" y="224" width="14.3" height="24"/>
  <text class="dg-sub" x="304.0" y="236" dominant-baseline="central">2.3</text>
  <rect class="dg-bar dg-c-accent" x="380" y="224" width="200.0" height="24"/>
  <text class="dg-sub" x="588.0" y="236" dominant-baseline="central">14.0</text>
  <text class="dg-label dg-text--accent" x="96" y="276" dominant-baseline="central">Input subtotal 18.6</text>
  <text class="dg-label" x="380" y="276" dominant-baseline="central">Input subtotal 60.0</text>
  <line class="dg-rule" x1="20" y1="304" x2="620" y2="304"/>
  <text class="dg-tag" x="20" y="328" dominant-baseline="central">Legend</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="320" width="16" height="16"/></g>
  <text class="dg-small" x="120" y="328" dominant-baseline="central">Cache hit (0.1×)</text>
  <rect class="dg-bar dg-c-accent" x="300" y="320" width="16" height="16"/>
  <text class="dg-small" x="324" y="328" dominant-baseline="central">Full price (1×)</text>
</svg>
```

Put the bill back into the product from earlier: 1 user, 1 session, 1 turn, 5 steps, with an average of 12,000 tokens read per step. The first four terms (users, sessions per user, turns per session, and steps per turn) are already small, so the drop from 65 to 23.6 comes from the last term: price per token. For a student session like the ones on p13, reading 200,000 tokens per step, the biggest factor becomes tokens per step.

The single biggest item in this bill is the first call sending 10,000 tokens in full. At the growth rate in this example, the cumulative cache reads pass those 10 units from about the 9th call on; as with the student logs on p15, the longer the task, the more re-reading dominates. So there are two directions for a fix. The first doesn't touch the success rate: move whatever changes out of the prefix so the cache hits. The second is to make the context grow more slowly, for example by keeping only the fields you need from each tool output, so each step has less to re-read; this one needs care because of the counter-costs in the next section, since a field you cut has to be read again if you need it later.

> **Self-check**: to let the model know today's date, someone puts the current time at the start of the system prompt. What happens, and how do you fix it?
> Answer: the prefix differs every time, the cache misses every time, and every step goes back to full input price; if it's still marked for caching, every call also pays the write premium. Fix it by putting the time at the end of the prompt or in the user message, or by giving only the date so requests on the same day start the same way.

### Every saving has a counter-cost

The slides then warn that every technique has a price: net saving = gross saving − counter-cost, and you measure both on the same tasks ([p25](https://cs2680.com/slides/8_agent_design_5.pdf#page=25)):

| Saving | Counter-cost |
|---|---|
| Compacting context | Dropped files get re-read; the summary itself rewrites the cache |
| A cheaper model | One bad plan can add many steps, or fail the whole task |
| Handing work to subagents | Each subagent re-reads the shared files and instructions |
| Speculative execution | Wrong guesses burn tokens and compete for the same tools as normal work |

The [course note](https://cs2680.com/notes/cost-effective-agents#objective) gives an example of comparing cost per success: on the same 100 tasks, the baseline spends $120 and succeeds 80 times, $1.50 per success; the candidate spends $90 and succeeds 75 times, $1.20 per success. That looks better, but it completes 5 fewer tasks. If the deployment requires at least 80% success, the candidate is ineligible (the section "Measure the whole episode"). [Lecture 1](/posts/ai/2026-10-21-cs2680-lecture-01-agents-systems-problem-en) said to look at cost per success; this adds the limit: read it together with a success-rate threshold. The Pareto frontier in [Lecture 7](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation-en) is the multi-metric version of the same idea.

The next two slides are two habits. First, set a budget cap for each task, for example $10, 80 model calls, 15 minutes of tool time, and at most 2 retries per step; set the caps from past successful runs, such as twice the p95 (the slowest 5%) ([p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26); the slide notes the numbers are illustrative). Other stopping conditions are the verifier passing, no new passing test in N steps, and the same error repeating. A task that stops with a summary costs less than a runaway one. Second, ask whether you need an LLM at all ([p27](https://cs2680.com/slides/8_agent_design_5.pdf#page=27)): if the steps are the same every time, write a script; if the input format is fixed, parse it with rules; if you only need a label or a score, train a small classifier. Send only the steps that need reasoning to a model.

### Making the agent faster: completion time follows the critical path

Faster agents are usually cheaper too, but not always ([p28](https://cs2680.com/slides/8_agent_design_5.pdf#page=28)). When steps run in sequence, completion time is roughly the sum of every step; when they run in parallel, it's roughly the critical path, the longest chain of steps that wait on each other ([p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)). The same slide adds two warnings: a cheap small model may take more steps and end up slower, and parallelism means less waiting but more total tokens. It's the same idea as the granularity formula in [Lecture 5](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture-en).

The ways to speed up fall into five groups:

- **Model serving**: every cost technique from the first half also saves time ([p30](https://cs2680.com/slides/8_agent_design_5.pdf#page=30)).
- **Orchestration** ([p31](https://cs2680.com/slides/8_agent_design_5.pdf#page=31)) has four moves:
  - Async: prepare the next step while a tool runs.
  - Persistent sessions: keep the shell or browser open instead of restarting it.
  - Stream and pipeline: start the tool call before the model has finished its response.
  - Colocate: run tools on the same machine as the model.
- **The tools themselves** ([p32](https://cs2680.com/slides/8_agent_design_5.pdf#page=32)): builds, tests, and page loads often take longer than the model call. Cache repeated reads and searches, move heavy compute to a server, and put timeouts on calls that hang. Measure the tool time in each step before tuning the model.
- **Parallelism** ([p33](https://cs2680.com/slides/8_agent_design_5.pdf#page=33)): issue independent tool calls together in one step, and give independent subtasks to parallel subagents. Only independent work can run in parallel; shared state needs a merge step.
- **Speculative execution** ([p34](https://cs2680.com/slides/8_agent_design_5.pdf#page=34)): guess the next action cheaply and run it while the main model is still thinking; a correct guess skips the wait, a wrong one is discarded at the cost of one wasted call. The slide says it pays off when guesses are often right and actions can be undone.

Speculative execution borrows its intuition from CPUs: at a branch, the processor doesn't wait for the result; it keeps computing along its guess and backs out if the guess was wrong. The flagship paper, [Speculative Actions](https://arxiv.org/abs/2510.04371) (ICLR 2026), reached up to 55% next-action prediction accuracy across games, e-commerce, and web search, cutting latency by up to 20%. Slide p37 contrasts two kinds of guessing with two 2026 papers: [PASTE](https://arxiv.org/abs/2603.18897) learns patterns from past traces, so seeing `search(q)` it fires `visit(results[0].url)` early; [SPORK](https://arxiv.org/abs/2607.03333) has the same model fork partway through its reasoning and issue the tool call it already looks set to make. The [course note](https://cs2680.com/notes/cost-effective-agents#latency) adds a rule: read-only or idempotent actions (doing them again gives the same result) are easy to cancel, while actions that write need snapshots and rollback (the section "Reduce waiting with a separate money budget").

The last slide is the method ([p38](https://cs2680.com/slides/8_agent_design_5.pdf#page=38)): log every call, every token, every tool and wait; find where cost and latency come from; change one thing at a time; then re-measure success, spend, and p95 latency on the same tasks. This slide says "Remember this for your Assignment 4!"; [Assignment 3](/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt-en), which started the same week, asks for exactly this: treat the model as a black box, optimize everything around it, and don't let the success rate drop.

## Second half: harness architecture

Once you know what to do, the next question is where it lives. Which file changes when you switch model routing? If the sandbox moves off Docker, do you have to touch the agent's main loop? The slides answer with three names borrowed from operating systems. An operating system can put every function in a "monolithic kernel," or keep a "microkernel" that only handles scheduling and communication while outside services provide everything else; the slides lay harnesses out on the same spectrum ([p40](https://cs2680.com/slides/8_agent_design_5.pdf#page=40)).

### Three architectures

| | Monolithic | Modular | Microkernel |
|---|---|---|---|
| How it's built | Memory, tools, context, planning, and execution all live in one program | The agent still owns the loop but reaches each component through an interface | A small runtime handles only state, scheduling, and security; outside services provide the capabilities |
| The slides' example | A `CodingAgent` class that creates its own Memory, Tools, and Planner | `memory_provider=RedisMemory()`; moving the sandbox from Docker to Firecracker swaps one provider | Memory, tools, and execution are separate services that can run in different containers or machines |
| Advantages | Simple to write and debug, internal state is easy to share, low overhead | Components are easy to replace and test; third-party implementations plug in | Services scale independently, faults are isolated, infrastructure can be shared |
| Costs | Hard to replace one component, components get tightly coupled, isolation is hard | The controller still owns the lifecycle, and coordination logic keeps growing | Higher communication overhead, more failure modes, harder end-to-end debugging, needs standard protocols |
| Fits | A standalone agent | Agent frameworks | Multi-agent infrastructure |

(Summarized from [p41–45](https://cs2680.com/slides/8_agent_design_5.pdf#page=41).)

Slide p44 compares the three by running one Python snippet. The monolith executes it locally, with the fewest hops but isolation that's hard to enforce. The modular harness calls `SandboxProvider.run(code)`, so you swap the provider without changing the agent. The microkernel sends an execution request, and the execution service allocates the sandbox, runs the code, and returns the result; it owns the sandbox's lifecycle. This slide also shows why a single-file harness like the one in [Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en) is easy to start with but stops being enough when many agents need to share sandboxes.

### Design choices of eight harnesses

Slide p46 lists eight harnesses, each with a one-line summary of its approach; the next seven slides each give three mechanisms unique to one harness. Claude Code appears only in the overview and has no slide of its own.

| Harness | Built by | The slide's one-liner | One signature mechanism |
|---|---|---|---|
| Claude Code | Anthropic (closed) | A policy layer and typed hooks around Claude | (no slide of its own) |
| [Codex CLI](https://github.com/openai/codex) | OpenAI | Sandbox first, ask second | Commands run in a sandbox with no network; the agent asks for approval only to leave it. A Lark grammar (a format for writing syntax rules) defines the patch format |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | DeepSeek | Everything is a plugin, even the loop | Compare-and-swap edits: an edit fails if the file changed after the model last read it |
| [OpenCode](https://github.com/anomalyco/opencode) | Anomaly (SST) | A session server with thin clients | The TUI, SDKs, and web app all talk to the same OpenAPI server; a snapshot at each step lets `/undo` restore files |
| [Pi](https://github.com/earendil-works/pi) | Mario Zechner / Earendil | A small core you extend in TypeScript | The core has four tools and no MCP, subagents, or approvals; extensions provide everything else |
| [oh-my-pi](https://github.com/can1357/oh-my-pi) | Can Bölük / Stencil Labs | A Pi fork with native tools and the IDE wired in | Hashline edits: lines are tagged by content hash, so the model doesn't retype the old text |
| [OpenClaw](https://github.com/openclaw/openclaw) | OpenClaw Foundation | An assistant gateway for chat channels | Before compacting context, a silent turn first writes dated notes |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Nous Research | An agent that writes its own skills | A background fork edits memory and skills; compaction starts at half the window, the earliest of the eight |

(Summarized from [p46–53](https://cs2680.com/slides/8_agent_design_5.pdf#page=46).)

The table ties back to the first half (the mapping below is this post's own): Hermes compacting early and OpenClaw writing notes before compaction address the context cost from the first half; Codex going into a sandbox first and DeepSeek Harness's compare-and-swap address p44's execution isolation and concurrent writes. The slides don't rank the eight harnesses; the point is to see which problem each design solves.

## Final self-check

1. A session has only 1 turn, but that turn takes 40 steps; the main agent reads 200K tokens per step, and 97.6% of them are cache reads. Of the six factors in the cost product, which do you move first?
   Criterion: you leave the first two (users, sessions) alone; turns are already 1. Look first at steps (issue independent tool calls together, plan before acting) and tokens per step (truncate used tool outputs, hand exploration to a subagent). Price is already low thanks to caching; pushing it lower means switching models, and that requires measuring the success rate first.
2. Last week an agent's cache reads were 95% of input tokens; this week they're 20%, and total spend doubled. What's the most likely cause, and where do you look first?
   Criterion: you identify a changed prefix. Diff the system prompt and tool definitions between the two weeks and look for a newly added timestamp, a random id, a tool list whose order changes each time, or someone editing a tool description. Any change to the tool definitions invalidates the whole cache.
3. You want to switch every step of an agent from Opus to a cheaper model. What's the biggest risk the slides point out, and what do you measure before deciding?
   Criterion: you say one planning mistake from a cheap model can add many steps or fail the task (p22, p25). Compare success rate, total spend including failures and retries, and p95 latency on the same tasks, and confirm success stays above the threshold; don't look only at the price per token.
4. Three agents fix three bugs in parallel; completion time drops from 50 minutes to 20, but the bill is 30% higher. Is that a successful optimization?
   Criterion: you say this buys time with money rather than saving it (the course note: "20% faster but 30% more expensive" has purchased latency). Whether it's a success depends on the requirement: worth it under a response-time requirement, not otherwise. Report latency and spend separately.

## Further reading

- [How prompt caching shapes Claude Code's speed and bill](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en): product-level detail on prefix matching and when the cache is invalidated.
- [Managing Claude Code costs](/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage-en): tracking tokens, choosing models, and setting effort in practice.
- [LLM serving: scheduling, RadixAttention, and PagedAttention | CMU 11-868](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en): how the serving side implements prefix caching, a preview of Part II.
- [Learning design from mature coding agents: series overview](/posts/ai/2026-08-30-coding-agent-design-series-overview-en): source-code teardowns of five coding agents, to set against this lecture's architecture comparison.
- [Context compaction](/posts/ai/2026-08-30-coding-agent-context-compaction-en): when compaction triggers and what it costs.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)).
- Source: [Lecture 8 slides](https://cs2680.com/slides/8_agent_design_5.pdf) (PDF pages p5–53) and the course note "[Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)," read on 2026-10-22. Page numbers always follow PDF page order.
- Pricing and caching rules were checked against Anthropic's pricing page, Anthropic's prompt caching documentation, and OpenAI's prompt caching guide on 2026-10-22; places that differ from the slides are flagged in the text. The eight harnesses' mechanisms were checked against each repo and its official documentation, and the paper numbers cited on the slides against the originals. "Don't Break the Cache" is a source this site added.
- The hand-worked bill and its chart, the conversion of cache shares into shares of spend, and the answers to the self-checks are this site's additions, not lecture content.

## References

- [CS2680 Lecture 8 slides: Agent design V: cost-effective agents](https://cs2680.com/slides/8_agent_design_5.pdf)
- [CS2680 course note: Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)
- [CS2680 assignments](https://cs2680.com/assignments)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Anthropic: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [Lumer et al. (arXiv 2601.06007), Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks (2026)](https://arxiv.org/abs/2601.06007)
- [Speculative Actions: A Lossless Framework for Faster Agentic Systems (ICLR 2026)](https://arxiv.org/abs/2510.04371)
- [PASTE: Parallelizing Tool Execution and LLM Generation for Low-Latency Agent Serving (2026)](https://arxiv.org/abs/2603.18897)
- [SPORK: Self-Speculative Forking to Accelerate Agentic LLM Inference (2026)](https://arxiv.org/abs/2607.03333)
- [Codex: Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [OpenCode: Server](https://opencode.ai/docs/server)
- [Codex CLI](https://github.com/openai/codex) · [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [OpenCode](https://github.com/anomalyco/opencode) · [Pi](https://github.com/earendil-works/pi) · [oh-my-pi](https://github.com/can1357/oh-my-pi) · [OpenClaw](https://github.com/openclaw/openclaw) · [Hermes Agent](https://github.com/NousResearch/hermes-agent)
