---
title: "Seven Answers to a Full Context Window, and No Consensus"
date: 2026-08-21
type: deep-dive
category: ai
tags: [context-engineering, ai-agent, harness-engineering, claude-code, agent-cli, llm]
lang: en
tldr: "Chroma's controlled study shows that even when it fits, a full context degrades performance. Coding agent vendors have landed on seven different responses: compact, hand off, prune, defer loading, isolate, train it into the model, or change the unit of work. Amp removed /compact outright, Atlassian argues summarization should be a last resort, and Cursor's A/B test measured a 46.9% token reduction. The three real disagreements come down to what each team is measuring."
description: "A comparison of how Anthropic, Amp, Cursor, Factory, Atlassian, Cognition, Manus, and AWS handle a full agent context window, including each vendor's published numbers, three genuine technical disagreements, and the controlled experiment nobody has run."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-context-full-seven-answers)

You spend an afternoon coding with Claude Code, Cursor, or Codex, and at some point the interface tells you the context is nearly full and asks whether to compact. Behind that prompt sits an unsolved engineering problem. Every time the agent takes a turn, it resends the entire conversation to the model. Every file it read, every command output, every dead end it walked down is still in there.

The question is what to do with all of it. Over the past eighteen months at least eight companies building coding agents have published their answer, and **they disagree with each other**. Amp removed compaction from the product entirely. Atlassian published a table arguing against LLM-based summarization. Manus says don't add or remove tools dynamically, while dynamic tool loading is the whole design of Cursor and Factory.

This piece covers what each of the seven answers claims, the numbers published, the bet being made, and the cost. Scope is limited to **vendors who have published technical reasoning** — plenty of tools ship a feature without explaining why, and those aren't here.

## The window isn't too small

First, a correction to the obvious intuition: this is not a "context window is too small" problem.

Chroma's [Context Rot](https://www.trychroma.com/research/context-rot) study, published in July 2025, did something rare: it **held task difficulty constant and varied only input length**. Earlier long-context benchmarks had a structural flaw — longer inputs usually meant harder tasks (bigger graphs, longer lists), so you couldn't separate length from difficulty. Chroma locked difficulty down and let only the irrelevant content grow.

Eighteen models all degraded with length. And not only on hard tasks. They built a "reproduce this text exactly" task with a single odd word inserted into a run of repeated ones. Something this trivial ought to be as reliable as a program, but as length grew, models started refusing, started asking the user whether they'd like the discrepancy corrected, started emitting garbage.

A more counterintuitive finding: even the *arrangement* of the irrelevant content matters. Shuffle the sentences of the background text so the topic stays the same but the logical flow disappears, and how the models handle the long input changes with it.

Their conclusion is the foundation for this whole topic:

> Whether relevant information is present in a model's context is not all that matters; what matters more is **how that information is presented**.

Another figure is closer to daily use. They used LongMemEval, a conversational memory benchmark, to compare two inputs. One contained only the passages needed to answer, averaging about 300 tokens; the other contained the full conversation, averaging about 113,000 tokens. The answer is present in both. The only difference is noise. Every model did clearly better on the focused version.

Chroma flags a detail worth remembering: the Claude family shows the widest gap, and the main driver isn't failing to find the answer — it's a **tendency to abstain under ambiguity**. The injected noise creates ambiguity, and the model says it cannot determine the answer.

## Why context compounds

The second layer is money.

Per Anthropic's [Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions) (August 2026), every agent turn resends the whole conversation. So anything that enters the context — a file it read, four hundred lines of PASS from a test run — **isn't billed once, it's billed for the rest of the session**.

The mechanism that saves you is prompt caching: if a request starts with exactly the same tokens as the last one, the server reuses the state it already computed. Manus illustrates the gap with Claude Sonnet list prices — cached input tokens run $0.30 per million against $3 uncached, a tenfold difference.

But the cache has a brutal property: it matches from the very start of the request forward, and **one differing token invalidates everything after it**. That explains why the position of tool definitions matters so much — they sit near the front, so touching them voids everything behind. This mechanism shows up again later, in the disagreements.

## Seven answers

Ordered by verdict, not by date or by vendor. Each gets four things: the claim, one representative number, the bet, and one action you can take tonight.

### 1. Compact: turn the old stuff into a summary

Claude Code's `/compact`, Cline's `/smol`, Kilo Code, and the OpenHands condenser all belong here. The model reads the whole conversation, writes a summary, and the summary replaces the original.

The bet is that the summary is good enough. Anthropic adds a cost argument: summarizing costs money, but **it's cheap while the cache is still warm**. So compacting before you step away beats compacting when you come back tomorrow.

The cost is that it's lossy, and it accumulates — summaries stacked on summaries.

OpenHands is one of the few in this camp to have run a comparison. On a subset of SWE-bench Verified, the condensed version solved slightly more instances than the uncondensed baseline (54% against 53%) at less than half the per-turn API cost. Their point is that the savings matter less than the growth curve: without condensation, context cost scales quadratically with conversation length; with it, the scaling becomes linear.

**What to do**: run `/compact` before you leave your desk, and say in the same command what to keep (for example, "keep the API design decisions and the three unfixed bugs").

### 2. Hand off: don't compress, start a new thread

In October 2025 Amp [removed compaction from the product](https://ampcode.com/news/handoff) and replaced it with handoff.

The key design isn't technical, it's about **order**. A summary looks backward, condensing what already happened. Handoff asks you to state what you're doing next, then extracts from the old thread against that goal. You type `/handoff now implement this for teams as well`, and it produces the opening prompt for a new thread as a draft you can edit before sending.

Amp's reasoning goes beyond "it's lossy." They argue compaction **encourages a bad habit**: you just squeeze whenever you run out of room, so threads keep sprawling and drifting. The Amp team instead splits a feature into a dozen or so short independent threads, the largest around 151k tokens and the average around 80k.

The cost is that you become the dispatcher. Someone has to decide where the seam goes.

**What to do**: next time you finish investigating and start implementing, don't just keep typing. Open a new thread and carry only the conclusion across.

### 3. Prune: mechanically cut the fattest part

Atlassian's Rovo Dev [takes another route](https://www.atlassian.com/blog/development/rovo-dev-keeps-long-sessions-useful): don't ask a model to summarize, delete by rule.

The design is a **cascade**, starting with the least destructive operation and stopping as soon as it's enough. Large tool outputs go first, then tool inputs, then assistant responses and intermediate scaffolding get compressed, with summary collapse last. Both edges are protected: the beginning holds the task framing and constraints, and the most recent turns carry local coherence. They condense it into a line worth remembering — keep the task definition, keep the current thread of work, and compact the bulky middle first.

Their rebuttal to the summarization camp deserves the full quote:

> If the expensive part of the session is mostly bulky machine-generated text, the best first move is usually to prune that text mechanically rather than asking another LLM to rewrite the whole session.

Mechanical pruning is instant (no extra model call), free, and preserves the original conversation structure. LLM summarization, by contrast, rewrites tool-call JSON into prose and message boundaries disappear. And most of the tokens it saves came from cutting bulky tool results anyway — which pruning does too.

The cost is mechanical: what's pruned is gone, not rewritten into some other form.

**What to do**: put the two or three commands you run daily into `CLAUDE.md` or `AGENTS.md` with quiet flags (for example `npx vitest run <file> --reporter=dot`). This is the cheapest pruning there is — those four hundred lines never enter in the first place.

### 4. Defer loading: pull it in only when needed

The first three deal with what's already in. The fourth deals with keeping it out.

Cursor calls the pattern [dynamic context discovery](https://cursor.com/blog/dynamic-context-discovery). Five techniques all revolve around one primitive: **files**. Long tool outputs get written to a file the agent can `tail`, rather than truncated, because truncation loses data. During summarization the chat history is also a file, so the agent can search back when the summary is missing something. MCP tool descriptions sync into folders, leaving only names up front.

They A/B tested that last one: in runs that called an MCP tool, the strategy reduced total agent tokens by 46.9%. That's their own measurement, and they note the variance is high depending on how many MCP servers are installed.

Factory's [Deferred Context Engine](https://factory.ai/news/deferred-context-engine) does the same thing in three named steps. Discover keeps only a compact capability index up front, promote loads the full schema when a task needs it, and reuse keeps loaded capabilities available. Their production telemetry shows sessions with 100+ hidden tools saving 50.8% of input tokens on average.

Factory adds a line that matters: **this holds even with caching**. Irrelevant tool definitions still occupy the model's working set, and the model still has to read them enough to decide they're unrelated.

**What to do**: run `/context` once in a fresh session and look at what loaded before you typed anything. Turn off MCP servers you don't need this session.

### 5. Isolate: let it happen in a different context

The subagent logic is simple: dirty work happens in a separate context window, and the main conversation only receives the conclusion. For grinding through a three-thousand-line log, nothing beats it.

But this camp has a public opponent. Cognition's [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents), from June 2025, offers two principles. First, share context, and share **full agent traces**, not individual messages. Second, actions carry implicit decisions, and conflicting decisions carry bad results.

Their example is easy to follow. You want a Flappy Bird clone, split into "build the background with pipes" and "build a bird that moves up and down." Subagent 1 misunderstands and builds a Super Mario-style background; subagent 2 builds a bird that doesn't look like a game asset. Copying the original task to every subagent isn't enough either — they **can't see what the others are doing**, so the styles still clash.

There's also a bill. LangChain cites Anthropic's engineering report on their multi-agent research system: this architecture can use up to fifteen times the tokens of ordinary chat.

Date this one. The article says "Claude Code never does work in parallel with the subtask agent, and the subtask agent is usually only tasked with answering a question, not writing any code," which no longer holds in 2026. The two principles still stand.

Cognition later offered a fix for this. The retrieval subagent they trained, [SWE-grep](https://cognition.com/blog/swe-grep), deliberately **reports file paths and line ranges rather than a summary**. The reasoning: a fast model's summary can draw the wrong conclusion and mislead the smart model, whereas a file list has a ground truth and can be scored. Constrain the subagent's output to a verifiable form and the "you only get what it chose to report" problem goes away.

**What to do**: before running two things in parallel, ask whether they need to be stylistically consistent. If yes, don't parallelize.

### 6. Train it into the model: this shouldn't be the user's job

Cursor [trained self-summarization into Composer](https://cursor.com/blog/self-summarization) by folding compaction into the reinforcement learning loop, so the summaries themselves get rewarded or penalized. Meta's [Code World Model](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/) goes further, mid-training on observation-action trajectories from Python interpreters and agentic Docker environments so the model can simulate code execution step by step. No need to read it to know what happens.

The claim here is that the previous five all require users to learn context management, and that requirement is itself a design failure.

Cursor published a comparison, and the gap is not small. The control was a heavily tuned prompt-based compaction whose summarization prompt alone ran to thousands of tokens across a dozen carefully worded sections. A trained Composer needs roughly "Please summarize the conversation," and **cut compaction error in half while using a fifth of the tokens**.

The cost is that you can't wait for it. This moves at the pace of model generations, not tonight's settings.

**What to do**: nothing. But it should affect how much effort you invest in a manual workflow — if these techniques get absorbed into the tools in six months, that investment is wasted.

### 7. Change the unit: more than one context

The last answer steps outside the context window. Instead of managing one conversation, open several, each with its own git worktree. Tools like cmux, Conductor, and Orca do exactly this, while cloud agents (Devin, Jules, Codex cloud) change the unit to a task and a PR.

The cost is honest: the problem shifts from token efficiency to attention management. That's why this category of tool always ships the same feature list — notifications, unread state, a sidebar showing what each agent is doing. What they solve isn't tokens, it's your attention.

**What to do**: `git worktree add ../myproject-bugfix -b bugfix`, then start a second agent there. Two agents sharing one working directory will step on each other.

## Three disagreements, and what each side is measuring

These seven aren't seven parallel options. Three points are genuinely contradictory, and what's interesting is **the root of the contradiction**.

**First: should tool schemas load dynamically?** Manus is explicit in [Context Engineering for AI Agents](https://manus.im/en/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus): avoid dynamically adding or removing tools mid-iteration. The reason is the caching mechanism above. Tool definitions sit near the front of the context, so a change invalidates everything after it. And when history references tools that no longer exist, the model hallucinates actions. Their fix is masking token logits, using a state machine to constrain which tools are selectable at each state, leaving the definitions untouched.

Yet dynamic loading is the entire design at Cursor and Factory, carrying 46.9% and 50.8% behind it.

This is **reconcilable**, and the reconciliation is the point: both sides agree the prefix must stay stable. Cursor moves tool descriptions into the filesystem and keeps only a stable name index up front. The actual load becomes a tool result appended at the **end**, which is the ideal cache position because nothing sits behind it. What Manus objects to is changing the front, not saving tokens. This is the gap between mid-2025 and mid-2026 engineering, not a clash of values.

**Second: keep errors or prune them?** Manus has a section titled "Keep the Wrong Stuff In." Erasing failure removes evidence, and a model that sees a failed action and its stack trace is less likely to repeat it. They go as far as calling error recovery the clearest indicator of true agentic behavior. But the first thing Atlassian prunes is "large machine-generated tool output," which is exactly what a failed stack trace is.

Partly reconcilable (Atlassian protects recent turns, and Manus mostly means recent failures), but the tension is real.

**Third: should you compact at all?** Anthropic says it's cheap while the cache is warm, Amp says it encourages bad habits and removed it, Atlassian says it should be a last resort.

All three are right, because **they're measuring different things**: Amp measures output quality, Anthropic measures the bill, Atlassian measures information loss. Which one to listen to depends on which one hurt most this afternoon.

## The argument can be abstracted

The abstraction happens at two levels.

The first is vocabulary. The write / select / compress / isolate vocabulary comes from [LangChain](https://www.langchain.com/blog/context-engineering-for-agents) and is the common way to talk about this topic; this site's earlier [Context Engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en) breaks the four down in full.

The second is an API, and AWS's [Strands Agents SDK](https://strandsagents.com/docs/user-guide/concepts/agents/conversation-management/) is the only one to get there. It turns the argument above into three swappable classes: `NullConversationManager` (does nothing), `SlidingWindowConversationManager` (the default), and `SummarizingConversationManager`.

Several details suggest the designers read the same debate. On overflow, the sliding window **truncates the oldest tool results first** rather than the messages themselves — Atlassian's principle in code. Both managers support message pinning to protect the first N messages from eviction, which is "protect the beginning" as an API. And proactive compression triggers reduction once projected input crosses 70% of the window, instead of waiting for an overflow error to come back.

If you're writing your own agent, this document is worth reading before any blog post — you don't have to pick a side, you can import a strategy.

## Which one to pick

| Situation | Pick |
|---|---|
| Same task, still in progress, just more talk | Prune before compact |
| Phase change (research → implement, implement → review) | Hand off to a new thread |
| Several MCP servers installed but unused this session | Turn them off, or use a tool with deferred loading |
| Grinding through a noisy log | Subagent |
| Two independent tasks that need no consensus | Parallel worktrees |
| Two tasks that must stay stylistically consistent | Don't parallelize |
| Before stepping away from the keyboard | Compact while the cache is warm |

## The experiment nobody has run

The strongest impression after reading all of this isn't that someone is right. It's a gap.

Chroma measured whether long context degrades performance; it does. Vendors measured how many tokens their own strategy saves, with numbers from 15.1% to 50.8%. But **no independent third party has run this experiment: same task, same model, swap only the context strategy, and see which one actually finished the job.**

Saving tokens is not the same as doing the work well. Atlassian's pruning and Amp's handoff may each win on different task shapes, but nobody knows, because nobody has tested it. Academia measures models, vendors measure their own products, and the cell in between is empty.

Until then, the most honest description may be Manus's. They call their own process Stochastic Graduate Descent — architecture searching, prompt fiddling, empirical guesswork, with the agent framework rebuilt four times. In their words: it's not elegant, but it works. That's the state of this field, including the vendors publishing clean numbers.

## Appendix: methodology figures

The body keeps one number per claim. The rest of the methodology sits here.

**Chroma Context Rot**: 18 models (closed-source and open-weights), 8 input lengths, 11 needle positions, temperature=0, scored by an aligned GPT-4.1 judge (>99% agreement with human judgment), across 194,480 total LLM calls with a 0.035% refusal rate. The LongMemEval portion filtered down to 306 prompts, averaging ~113k tokens for the full version and ~300 tokens for the focused one. Needle-question similarity was averaged across five embedding models for robustness. Across the four controlled experiments: lower needle-question similarity accelerates degradation, distractors have non-uniform impact, needle-haystack similarity shows no uniform effect, and haystack structure consistently does. The [full codebase is open source](https://github.com/chroma-core/context-rot).

**OpenHands**: on a subset of SWE-bench Verified, the condensed agent averaged 54% solved against the baseline's 53%. Condensation only fires once context reaches a set size, so the cost of rebuilding the cache is amortized across turns. They report per-turn cost settling below half the baseline, at the cost of occasionally spending a turn on condensation itself.

**Cursor self-summarization**: the control was prompt-based compaction with a summarization prompt of several thousand tokens producing summaries averaging over 5,000 tokens; Composer's self-summaries average around 1,000 tokens, halve compaction error, and reuse the KV cache. Tested at both 80k and 40k trigger thresholds with consistent results. Case study: solving Terminal-Bench 2.0's make-doom-for-mips took 170 turns, compressing over 100,000 tokens down to roughly one thousand.

**SWE-grep**: 4 serial turns with up to 8 parallel tool calls each, against the 10–20 serial turns typical of agentic search. On Cerebras, SWE-grep-mini serves at 2,800 tokens/second and SWE-grep at 650, against Haiku 4.5's 140. Scoring uses a weighted F1 favoring precision, because they found polluting the main agent's context more damaging than omitting some. Windsurf and Devin observed agent trajectories spending over 60% of the first turn on retrieval alone.

**Cursor**: an A/B test of dynamic MCP loading reduced total agent tokens by 46.9% in runs that called an MCP tool, noted as statistically significant with high variance depending on the number of MCP servers installed.

**Factory**: five days of production telemetry, restricted to sessions that triggered MCP tools, reporting estimated input tokens rather than billed amounts. Overall average reduction 15.1%, p90 39.4%. Bucketed by hidden tool count, sessions with 20–50 tools saw 21.0% and those with 100+ saw 50.8%. Two more figures: 16.6% of telemetry sessions started MCP servers but only 5.4% executed an MCP tool, and they estimate a typical enterprise stack at roughly 330 MCP tools or about 47K schema tokens.

**Anthropic multi-agent system**: token usage up to 15× ordinary chat, from the engineering report on their multi-agent research system, cited by LangChain.

**Amp**: the author reports one feature spanning 13 interconnected threads, the largest at 151k output tokens across four user messages, averaging around 80k. A separate post mentions their longest thread has been compacted over 68 times and would exceed 21 million tokens uncompacted.

Every figure above was measured by a party with a commercial stake, Chroma included — retrieval infrastructure is what they sell. The difference is reproducibility: Chroma published the full experimental design and the code, while everyone else published only the conclusion.

## References

- [Context Rot: How Increasing Input Tokens Impacts LLM Performance — Chroma](https://www.trychroma.com/research/context-rot) ([source code](https://github.com/chroma-core/context-rot))
- [Maximizing the value of your Claude Code sessions — Anthropic](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- [Handoff (No More Compaction) — Amp](https://ampcode.com/news/handoff)
- [200k Tokens Is Plenty — Amp](https://ampcode.com/notes/200k-tokens-is-plenty)
- [Dynamic context discovery — Cursor](https://cursor.com/blog/dynamic-context-discovery)
- [Training Composer for longer horizons — Cursor](https://cursor.com/blog/self-summarization)
- [Agent Context Pruning: How Rovo Dev keeps long sessions useful — Atlassian](https://www.atlassian.com/blog/development/rovo-dev-keeps-long-sessions-useful)
- [Deferred Context Engine — Factory](https://factory.ai/news/deferred-context-engine)
- [Don't Build Multi-Agents — Cognition](https://cognition.com/blog/dont-build-multi-agents)
- [SWE-grep: RL for Multi-Turn, Fast Context Retrieval — Cognition](https://cognition.com/blog/swe-grep)
- [Context Engineering for AI Agents: Lessons from Building Manus — Manus](https://manus.im/en/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Context Engineering — LangChain](https://www.langchain.com/blog/context-engineering-for-agents)
- [Conversation Management — AWS Strands Agents SDK](https://strandsagents.com/docs/user-guide/concepts/agents/conversation-management/)
- [CWM: An Open-Weights LLM for Research on Code Generation with World Models — Meta AI](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/)
- [How to Think about Context Engineering in Cline](https://cline.bot/blog/how-to-think-about-context-engineering-in-cline)
- [Context Condensation for More Efficient AI Agents — OpenHands](https://www.openhands.dev/blog/openhands-context-condensensation-for-more-efficient-ai-agents)
- On this site: [Context Engineering: Why Your AI Agent's Problem Is Information, Not the Model](/posts/ai/2026-03-24-context-engineering-guide-en)
