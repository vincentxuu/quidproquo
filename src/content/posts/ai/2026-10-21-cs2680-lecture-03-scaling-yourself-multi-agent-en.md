---
title: "Running Many Agents at Once: Subagents, Agent Teams, and Programming 3.0 | Harvard CS2680 Lecture 3"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, claude-code, coding-agent, multi-agent, subagent, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 4
tldr: "The first half of CS2680 Lecture 3 (2026-09-14) is about scaling yourself up. It uses two plugins, Superpowers and Caveman, to show how skills, hooks, and a proxy fit together, then covers three directions to scale: run agents in parallel to buy wall-clock time, delegate to subagents to buy focus, and let one agent run long to buy scope. The second half is about the cost of scaling: when you have an agent write code from natural language, uncertainty seeps in from four layers (meaning, context, model sampling, the tool environment), and the remedies are to define clearly, separate proposal from execution, and tighten verification. This post works through \"three bugs in three worktrees\" to show what parallelism actually saves."
description: "Guide to Lecture 3 of Harvard CS2680 Modern AI Systems (Fall 2026): Superpowers' process skills and SessionStart hook, Caveman's two-way compression and proxy, the three scaling axes, git worktrees, subagents, agent teams, dynamic workflows, /goal and /loop, plus the lecturer's Programming 3.0, the four layers of uncertainty, and OpenAI's usage data. Based on the public slides, with product behavior checked against the Claude Code docs as of 2026-10."
draft: false
glossary:
  - term: "git worktree"
    aliases: ["worktree"]
    definition: "Another working directory under the same git repo, each with its own branch checked out, all sharing one history. Two agents editing in separate worktrees can't step on each other's files."
    context: "Lecture 3 uses worktrees for parallelism by hand: one task, one session, one worktree."
  - term: "agent teams"
    aliases: ["agent team"]
    definition: "An experimental Claude Code feature: a lead session spawns several teammates that share a task list and can message each other directly. Off by default."
    context: "Lecture 3 contrasts it with subagents, which only hand their result back to the agent that called them."
  - term: "proxy"
    aliases: ["reverse proxy", "local proxy"]
    definition: "A small server sitting between the agent and the model provider. The agent points its API address at it; the proxy receives every request, can rewrite it, and forwards it to the real model provider."
    context: "In Lecture 3, Caveman uses one to compress tool output before the model reads it."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent)

**Video status: The course is not recorded.** This post is based on the public slides; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 3 of [CS2680](https://cs2680.com/) met on September 14, 2026. The slide deck is titled "Agent From a User's Perspective II: Multi-agent and Best Practice" ([slides](https://cs2680.com/slides/3_agent_use_2.pdf)). [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en) took apart one agent's loop, memory, and four kinds of extensions. This lecture still stands on the user's side and asks whether one person can run several agents at once.

The lecture has two halves. The first is about multiplying your output: it looks at how two plugins use skills, hooks, and a proxy to change an agent's behavior, then at three directions to scale and the tools Claude Code offers for each. The second is about what comes after: when you have an agent write code from natural language, the same request doesn't always produce the same result, and you have to manage that uncertainty.

By the end you should be able to pick the right way to scale a task (parallel, subagent, or long-running), and, when an agent's results swing between good and bad, say which layer the problem probably comes from.

Slide page numbers always follow PDF page order. The C compiler case on p47–50 and the CLI agent landscape from p70 on are optional; this post covers the former briefly. The slides include many Claude Code product details; this post goes by the official docs as of October 2026 and flags each place they differ.

## First half: scaling yourself up

### Superpowers: same model, different workflow

The first case is [Superpowers](https://github.com/obra/superpowers), a plugin for software development (p5). The problem it targets: hand an agent "add login," and it usually starts coding right away, then fixes its mistakes round after round. Superpowers reroutes this into clarifying the requirements, waiting for you to approve a design, writing a detailed plan, building test-first, reviewing and verifying, and only then wrapping up and merging the branch (p6). The line at the bottom of that slide is the point of the case: both agents use the same model and the same tools, and only the instructions differ.

Those instructions are written as skills. The slides list nine (p7); as of October 2026 the repo has 15, adding ones for executing plans with subagents, dispatching parallel work, and writing skills. They are "process skills": besides the procedure, each one spells out when it applies, what must be done, what is forbidden, where to wait for human approval, what evidence to produce before reporting done, and which skill comes next (p10). The last step of brainstorming, for example, is "invoke writing-plans" (p9).

The catch is that installing a skill doesn't mean the agent will use it. As the slides put it, installing only makes a skill available; it doesn't guarantee the agent will check it (p11). [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en) explained why: at session start a skill contributes only its description, and the model decides whether to load it. Superpowers attaches a SessionStart hook with the matcher `startup|clear|compact`, so it reruns when a new session starts, when you run `/clear`, and after the context is compacted (p11). The script the hook runs reads the full text of the bootstrap skill "using-superpowers" and returns it through `hookSpecificOutput.additionalContext`; Claude Code puts it into context (p12). That bootstrap skill tells the agent to check for an applicable skill before acting.

So the division of labor is: skills supply the behavior, the hook guarantees the entry point to that behavior is in context, and the plugin handles packaging and installation (p8, p14). This is exactly Lecture 2's "a skill is available, a hook is guaranteed."

> **Self-check**: If the Superpowers hook ran only on `startup`, what would happen in a long session that was auto-compacted partway through?
> Answer: Compaction summarizes the old conversation, so the bootstrap skill injected at the start may shrink to one sentence or disappear, and afterward the agent may stop checking for skills and just start coding. Adding `compact` to the matcher puts it back into context after compaction.

### Caveman: compressing both what the model writes and what it reads

The second case, [Caveman](https://github.com/JuliusBrussee/caveman), is about tokens (p15). The slides' example is one `npm test` run that prints 786 lines, of which the only useful part is one sentence: "3 tests fail, connection timeout at client.ts:88" (p16). Once those 786 lines are in context, every later model call reads them again, and compaction may squeeze out the details that actually mattered.

Caveman compresses in two directions (p17):

- **What the model writes (output)**: a response-style skill that tells the model to drop pleasantries, repetition, and hedging, while keeping technical terms, commands, paths, code, error messages, numbers, and negations exactly as they are (p20).
- **What the model reads (input)**: a local proxy that compresses tool output before it reaches the model. Different types keep different parts; logs keep errors, stack traces, and the head and tail, while diffs keep file names, hunk headers (the `@@` lines that mark where a change is), and changed lines (p24). The original stays on your machine, and the model can fetch it back byte for byte through the MCP tool `caveman_retrieve` when needed (p23).

Why use a proxy on the input side? Recall [the gap Lecture 2 filled in](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en#first-a-gap-to-fill-what-one-model-call-looks-like): every step an agent takes is one complete API request that sends the system prompt, tool definitions, and the whole `messages` list to the model provider. A proxy sits on that line. You point the agent's API address at the local proxy; it receives every request, rewrites the content, and forwards it to the real model provider ([proxy README](https://github.com/JuliusBrussee/caveman/blob/main/proxy/README.md)). An MCP tool runs only when the model calls it, so it can't change what the model reads next (p24).

The slides say hooks can't transparently rewrite the request sent to the model, which is why a proxy is needed (p24). The current [hooks docs](https://code.claude.com/docs/en/hooks) add another route: a PostToolUse hook can use `updatedToolOutput` to replace a single tool's result before it goes to Claude. A hook still can't touch the whole request, though, such as old tool output already in the conversation; to rewrite the entire request you still have to sit between the agent and the model provider. The slides add that if you write your own harness, you can do all of this directly in the loop.

How much does it save? The slides cite "65% fewer output tokens," while noting that the skill itself adds input tokens, so whole-session savings are lower (p17). Later measurements brought that number down a lot. [JetBrains](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) tested exactly this 65%: in a paired comparison on 86 SkillsBench tasks, output dropped by only 8.5%, with no measurable difference in scores. Their explanation is that an agent's output is mostly code, diffs, and tool calls, which Caveman leaves verbatim anyway; only the narration between tool calls gets compressed. So before you use a number like this, check what it's being compared against.

<details>
<summary>Caveman's own measurements in its README: the baseline becomes "answer concisely"</summary>

Caveman's [README](https://github.com/JuliusBrussee/caveman) has Opus 5.5 answer ten developer questions and measures output tokens under four instructions (totals across the ten):

| Instruction | Output tokens |
|---|---:|
| No instruction | 6,983 |
| "Answer concisely." | 4,334 |
| `/caveman` | 4,119 |
| `/ultracave` | 2,693 |

The single sentence "Answer concisely." already cuts about 38%, and nearly all of `/caveman`'s savings come from that sentence. The README's conclusion is that, by per-question median, `/caveman` cuts only 3% more than that sentence (the table shows totals, which work out to about 5%). The rules themselves also take about 1,160 input tokens.

</details>

Caveman uses all five mechanisms from Lecture 2 plus a proxy (p25):

| Mechanism | What it does in Caveman |
|---|---|
| skill | The terse response style, plus dedicated workflows for commit messages and reviews |
| command | Switches you flip explicitly, such as `/caveman ultra` and `/caveman off` |
| hook | SessionStart decides this session's mode; UserPromptSubmit detects when you say "back to normal mode" midway |
| MCP | Compression, fetching originals, statistics, and conversion between JSON and [TOON](https://github.com/toon-format/toon) (a format for LLMs that uses fewer tokens than JSON) |
| plugin | Packages all of the above into one install |
| proxy | Intercepts every request to the model provider and compresses tool output |

> **Self-check**: Why doesn't Caveman just ship one MCP tool and let the model decide whether to compress a log?
> Answer: An MCP tool runs only when the model calls it, and the 786-line log is already in context before the model decides to call anything; every later step reads it again. To compress it before the model reads it, you have to intercept on the path where tool output enters context. In current Claude Code, a PostToolUse hook can replace that one new result; to compress old output already in the conversation too, or to work with agents that don't support that field, you need a proxy.

### Three directions to scale

After the two plugins, the slides turn to "how to become a 100x engineer with multiple agents," and the cover slide says: agents fan out in parallel, and so does the invoice (p26). The lecturer splits scaling into three directions (p27):

| Direction | How | What it buys | What it doesn't buy |
|---|---|---|---|
| Parallel (breadth) | Several independent tasks run at once, each in its own working directory | Wall-clock time (the real time from start to finish) | Answer quality |
| Subagent (breadth and depth) | Hand a well-bounded job to a fresh context and get back only a summary | Time, plus focus in the main conversation: the main agent never sees the messy middle | Back-and-forth in the main conversation |
| Long-running (duration) | Let one agent carry a big job across many steps | Scope: more work for the same number of interventions | Someone watching every step |

Agent teams and dynamic workflows combine these directions (p27). The sections below go through them in order.

### Parallelism by hand: one task per worktree

The simplest parallelism is to open several terminals yourself, one Claude Code session per task. Each session lives in its own [git worktree](https://code.claude.com/docs/en/worktrees), another working directory of the same repo with its own branch and a shared history (p28–29). `claude -w bugfix-auth` creates a worktree at `.claude/worktrees/bugfix-auth/` on a new branch and starts Claude inside it. No stashing, no second clone, and files changed in one session never touch another.

The slides say every new session in the desktop app gets a worktree automatically (p28). The current [desktop docs](https://code.claude.com/docs/en/desktop) say it's off by default; you turn on the Worktree switch yourself before starting a session.

What does parallelism actually save? Here is a teaching example for this post, with made-up numbers. You have three unrelated bugs that take an agent 20, 35, and 50 minutes, and each change takes you 10 minutes to review.

| | All agents done | Your total review time | All three reviewed |
|---|---|---|---|
| One session in sequence, review each as it finishes | 20 + 35 + 50 = 105 min | 3 × 10 = 30 min | 105 + 10 = 115 min |
| Three worktrees at once, review each as it finishes | The slowest one, 50 min | Still 30 min | 50 + 10 = 60 min |
| Three worktrees that finish at the same time (say all take 50 min) | 50 min | Still 30 min | 50 + 30 = 80 min |

The slowest task sets the wall-clock time, so the agent phase drops from 105 to 50 minutes. When working in sequence, the agent is already on the next bug while you review the previous one, so only the last review adds 10 minutes. When working in parallel, if all three finish at once, the three reviews queue up; the more agents you run, the more likely they collide, and your review becomes the queue. Your total review time doesn't shrink by a minute, and you still decide the merge order of three branches. A repo-wide refactor can't be split this way at all: the three sessions would edit the same files, and every merge conflict would land on you.

That is also the limit of parallelism by hand (p30): the plan lives only in your head, sessions can't see each other's findings, you merge the branches yourself, and nothing about the run is written down, so it can't be rerun. In the slides' words, you can keep three sessions straight, but twenty needs a clone of yourself.

> **Self-check**: If the three bugs in the example were all in the same function in the same file, would three worktrees still make sense?
> Answer: No. The three changes would conflict in the same block of code, and merging could cost more than parallelism saved. Fix them in sequence in one session, or have one agent handle them together.

### Subagents: hand off the grunt work, get back a summary

A [subagent](https://code.claude.com/docs/en/sub-agents) is a specialized assistant with its own context window, tools, and permissions (p31). It has five benefits (p31):

- Bulky output such as search results and logs stays with the subagent and out of the main conversation.
- You can limit which tools it uses and which model it runs on.
- One definition can be reused across projects.
- Independent subtasks can run at the same time.
- Simple work can go to a cheap, fast model such as Haiku.

Claude Code has three built-in subagents (p32). Explore does read-only code search, with how thorough to be set on each call. Plan does research in plan mode. General-purpose handles multi-step work that mixes exploring and acting. Explore and Plan start without CLAUDE.md and the git status, to stay fast and cheap (p32).

Defining your own subagent means writing a Markdown file whose YAML frontmatter gives the name, description, tools, and model; the body becomes its system prompt (p33):

```markdown
---
name: code-reviewer
description: Reviews code for quality
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer. Analyze the code and give actionable feedback.
```

Put it in the project's `.claude/agents/` and it goes into version control for the whole team; put it in `~/.claude/agents/` and it's yours alone, but available in every project. The official docs add one point: a subagent receives only this system prompt plus basic environment details such as the working directory, not Claude Code's own system prompt.

A subagent can spawn subagents of its own, as long as `Agent` is in its `tools` (p34). The slides say up to five levels, with two to three as the sweet spot; the current docs say the default limit is three layers below the main conversation, adjustable with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`. A common split has the main agent own the plan, with a first layer of three subagents for implementation, debugging, and review. Under implementation sits a test writer, and under review a verifier. Every level starts with a clean context and passes only a summary upward (p35).

There are three ways to bring one in, each giving you more control than the last (p36):

1. Name it in natural language in your prompt, and Claude decides whether to delegate.
2. Use `@agent-code-reviewer`, which guarantees it runs this time.
3. Start with `claude --agent code-reviewer`, and the whole session takes on its prompt, tools, and model.

Not everything should be handed off (p37). A subagent starts from scratch, can't see the earlier conversation, and spends time gathering context again. Keep in the main conversation: work that needs back-and-forth, phases that share a lot of context, one-line changes, and anything where waiting time matters. Hand off: work that produces lots of output you won't reuse, work that needs restricted tools or permissions, work that only needs to return a summary, and work that can run in parallel. If what you want is a reusable workflow that runs in the main conversation, write a skill.

### Agent teams: letting several sessions discuss

[Agent teams](https://code.claude.com/docs/en/agent-teams) are several Claude Code sessions working together: one lead and several teammates (p38). A team has four parts (p39):

- **Lead**: your original session, which spawns teammates, assigns work, and synthesizes the results.
- **Teammates**: separate Claude Code instances, each with its own context window.
- **Task list**: shared work items that teammates claim and mark complete. The official docs add that tasks have three states (pending, in progress, completed) and can depend on each other: a task can't be claimed until the tasks it depends on are done.
- **Mailbox**: one inbox per agent, stored as a JSON file, which teammates use to message each other directly.

Teammates don't inherit the lead's conversation. They load CLAUDE.md and skills automatically at startup (the official docs also list MCP servers), so task details have to go in the prompt the lead gives them when spawning them (p39).

They suit four kinds of work (p38):

- Several teammates review the same code from different angles, then challenge each other's findings.
- Each person owns a separate module.
- Competing debugging hypotheses are tested in parallel.
- Frontend, backend, and tests each have an owner.

The cost is that coordination overhead and tokens grow with the team, so sequential work, work that edits the same file, and work with many dependencies still belong in one session or with subagents. The feature is experimental and off by default (p38); per the official docs, you turn it on by setting `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

Compared with subagents (p40–42):

| | Subagents | Agent teams |
|---|---|---|
| Context | Own window, result goes back to the caller | Own window, fully independent |
| Communication | Report back to the caller only | Teammates message each other directly |
| Coordination | The main agent manages all the work | Shared task list |
| Best for | Tasks where only the result matters | Work that needs discussion |
| Token cost | Lower | Higher |

The slides say "subagents report back to the caller only." The current docs add an exception: subagents that Claude named when spawning them can also message each other. The dividing line is still there, just less clean than the slides draw it.

> **Self-check**: What's the difference between subagents and agent teams?
> Criterion: You say that teammates can communicate through the shared task list and mailboxes and claim work themselves, while a subagent hands its result back to the agent that spawned it, and the main agent manages all the work. Bonus for noting that teams cost more tokens and are worth it only for work that needs discussion.

### Dynamic workflows, /goal, and /loop

In all the approaches so far, Claude decides turn by turn in the conversation what happens next. A [dynamic workflow](https://code.claude.com/docs/en/workflows) works differently: Claude writes a JavaScript script that a runtime executes in the background, and the script spawns many subagents and decides order and branching (p43). The official docs add that intermediate results live in the script's variables, and Claude's context receives only the final answer. That makes it fit for scale a single conversation can't coordinate, such as a codebase-wide bug sweep, a 500-file migration, or research that needs cross-checking. There are two ways to start one: put `ultracode` in your prompt to run this one task as a workflow, or set `/effort ultracode` so Claude plans a workflow for every substantial task in the session (p43).

The other direction is letting one agent run longer. The slides introduce two commands:

- **[`/goal`](https://code.claude.com/docs/en/goal)**: give a verifiable end state, such as `/goal "npm run lint exits with zero errors"` (p44). After each turn, another model checks whether the condition holds, and if not, Claude keeps going. "All integration tests pass" works as a condition; "refactor the code" doesn't, because nothing can show it's done. The current docs add two points. First, the check uses the small fast model from your settings, which reads only the conversation and doesn't run commands or read files itself, so write the condition as something Claude's own output can demonstrate. Second, the `--max-tries` flag the slides mention isn't in the docs; to cap the number of turns, put it in the condition, for example "or stop after 20 turns."
- **[`/loop`](https://code.claude.com/docs/en/scheduled-tasks)**: rerun the same prompt at a fixed interval, such as `/loop 5m "check CI, fix whatever broke"`, until you press Esc while it waits (p45). Without a prompt it runs a built-in maintenance prompt, which you can replace with your own default in `.claude/loop.md`. Without an interval, the current version has Claude pick a wait between one minute and one hour each time; scheduled tasks expire after seven days.

The difference is the slides' one-liner: `/goal` stops when the condition holds; `/loop` stops when you tell it to (p45).

> **Self-check**: What would you use for each of these? (1) Migrating 200 test files from Jest to Vitest; (2) checking deployment status every 10 minutes and reporting failures; (3) having the agent keep fixing until `pnpm build` succeeds.
> Answer: (1) Many independent files that should be rerunnable: a dynamic workflow (or several subagents at smaller scale). (2) A timed trigger: `/loop 10m`. (3) A verifiable end state: `/goal`.

### Optional: 16 agents write a C compiler

The slides include a large case (p47–50) from an Anthropic in-house experiment: 16 agents writing a C compiler in parallel. The takeaway in brief: only independent tasks can run in parallel; when everyone is stuck on the same thing, first find a way to split it up, and if you can't, don't add agents. The process and numbers are below.

<details>
<summary>Optional: 16 agents write a C compiler, where parallelism broke down and how it was rescued</summary>

Anthropic's Nicholas Carlini had 16 Claude instances work in parallel for two weeks. Across nearly 2,000 sessions and just under $20,000 in API costs, they wrote a roughly 100,000-line Rust C compiler from scratch that can build a bootable Linux 6.9 (p47, [original post](https://www.anthropic.com/engineering/building-c-compiler)).

The coordination was bare-bones (p48–49). It used a harness the author built himself: each agent ran Claude Code in an infinite loop inside its own Docker container. An agent claimed a task by writing a text file to `current_tasks/` and used git to merge and push; when two agents claimed the same task, git's synchronization pushed the second one to pick something else. There was no chat and no manager agent.

It didn't all succeed (p50):

- Merge conflicts were frequent.
- Once they started compiling the Linux kernel, all 16 agents hit the same bug, each fixed it, and they overwrote each other's changes; parallelism didn't help at all.
- The 16-bit x86 part still called out to GCC.
- The generated code was slower than GCC's.

The second problem was later fixed; the slides skip this, but the original post covers it. The author changed how testing worked, using GCC as a known-good reference. Each run randomly compiled most kernel files with GCC and handed only the rest to the new compiler. If the kernel worked, the problem wasn't in that batch; if it broke, switching some of those files back to GCC narrowed it down. One big task became many small "which of these files is wrong" tasks, and the 16 agents could again each fix their own. The manual parallelism example from earlier, at real scale.

</details>

## Second half: Programming 3.0, uncertainty, and delegation

### The lecturer's Programming 3.0

The tools in the first half produce more output; the second half asks whether you can trust it. The lecturer starts by defining a set of terms (p52):

- **Programming 1.0**: people write machine instructions or assembly directly for the hardware.
- **Programming 2.0**: people write a programming language, and a compiler translates it into machine instructions.
- **Programming 3.0**: people state a goal in natural language, an agent writes the program, and a compiler then translates it into machine instructions.

Each step up raises productivity and adds uncertainty (p52).

The lecturer stresses that this is not the same as Andrej Karpathy's Software 1.0/2.0/3.0 (p53). Karpathy classifies by what the program is: 1.0 is source code; [2.0 is neural network weights](https://karpathy.medium.com/software-2-0-a64152b37c35), made by collecting data and optimizing; 3.0 is LLM prompts, written in natural language ([talk](https://www.youtube.com/watch?v=LCEmiRjPEtQ)). The lecturer classifies by how people hand their intent to the machine, and the end product of 3.0 is still ordinary code. The slide closes by noting that knowing whether a job calls for 1.0, 2.0, or 3.0 is an important engineering skill (p53).

### Uncertainty isn't new

The same source code producing different results has always happened (p55). The 2.0 era already dealt with three sources:

| Source | 2.0 example | How 2.0 handles it | What 3.0 adds |
|---|---|---|---|
| Hardware | 32- vs. 64-bit, endianness | Fixed-width types, cross-compilation, virtualization | Nondeterministic GPU computation, floating-point variance |
| Environment | Concurrency, unreliable networks | Memory consistency models (rules for the order in which threads see writes), APIs that can be retried without taking effect twice | The agent acts on the environment while it writes code |
| Software | Compiler versions, dependency drift | Full testing before upgrading | The model itself, different GPU kernel implementations, sampling |

3.0 adds one more gap (p56). Going from a need to a program used to pass through a PM and a programmer; now there's often just one prompt, so the input itself is ambiguous. The slide marks this "more research needed."

### Four layers where uncertainty gets in

The lecturer breaks 3.0's uncertainty into four layers, plus the final product (p57):

| Layer | Uncertainty | Example |
|---|---|---|
| Natural language | Semantic | Does "make login faster" mean page load or the authentication flow? |
| Retrieval and context | Retrieval drift | Index updates, different chunking, a truncated context |
| Model generation | Probabilistic | Sampling is random by nature, on top of software and hardware nondeterminism |
| Agent and tool loop | Trajectory and environment nondeterminism | A tool fails; the environment changed between runs |
| Generated program | Usually deterministic | Unless it calls models or tools at runtime |

The last row is the good news: the uncertainty sits mainly in the generation process, and the generated code itself usually behaves the same on every run, so tests can pin it down.

### Three sets of practices

The matching practices come in three groups (p58):

- **DEFINE**: state your assumptions up front and have the model confirm anything ambiguous before it acts; give requirements, invariants, constraints, and acceptance tests rather than a single prompt.
- **CONTROL**: separate proposal from execution, so the agent proposes a plan and nothing lands until it's validated; manage context explicitly, owning what goes into memory, where it came from, and how it's retrieved, and expiring stale information.
- **VERIFY & GOVERN**: shorten the generate-verify loop, since frequent cheap checks beat one expensive review at the end; measure one level deeper with tests, multiple metrics, and synthetic workloads you can reason about (inputs you build yourself whose results you can predict).

Compared with the tools in the first half: Superpowers' design approval and plan are "define" and "separate proposal from execution," `/goal` asks you for a verifiable end state, and Caveman's retrieval of originals and Lecture 2's memory management are ways of managing context.

The slides end with two sentences (p59): don't expect the agent to be deterministic; make the surrounding system dependable. And match autonomy to risk: the more autonomy you give, the more uncertainty and risk you take on.

> **Self-check**: You run the same prompt, "add caching to this function," twice; one run uses Redis and the other an in-memory dict. Which layer does the uncertainty mainly come from, and how do you reduce it?
> Answer: Mainly the natural-language, semantic layer: the prompt didn't say which kind of cache, so both are reasonable when the model samples. Reduce it by writing constraints and acceptance criteria into the prompt or CLAUDE.md (for example "standard library only" and "include tests"), which is the DEFINE group.

### Field data: two OpenAI reports

The last section uses two reports OpenAI published to show what "one person, many agents" looks like in practice (p60–67). Both are written by OpenAI from its own product and its own employees' data, and the paper itself acknowledges that OpenAI is an unusually favorable environment for agents: employees know frontier models well, marginal usage is cheap, and the organization is fully on board ([paper](https://arxiv.org/abs/2606.26959)). Read them as "what people at the frontier are doing," not as what to expect for an ordinary team.

The first is a June 2026 study of Codex usage ([The Shift to Agentic AI: Evidence from Codex](https://arxiv.org/abs/2606.26959)):

- **Few people use it yet**: in the last 28 days, fewer than 1% of active individual-account users had used Codex, 17.3% of organizational-account users had, and nearly all OpenAI employees had (p61).
- **The work handed off is getting bigger**: in December 2025, 35.4% of individual users had sent at least one request that would take an experienced person an hour or more; by May 2026 it was 70.2% (p62). For eight hours or more, the share rose from 2.1% to 25.6%. Note that these are shares of users, and how long a request would take a person is itself a model's estimate.
- **One person, several agents at once**: about 28.6% of OpenAI users managed five or more agents at the same time in some week; the median employee had 2.5 hours of agent runtime a day (p63).

The second is the September 2026 post "[Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)." By mid-August, OpenAI's research organization used 3.1 agent-workdays for every human workday (p64; the slide's chart says 3.14x), and the median researcher used more than $600 of inference a day (p67). The chart on slide p66 puts numbers on the earlier line "match autonomy to risk" (p59). It groups tasks by how long they would take a human: 86% of tasks under 15 minutes succeed with no human intervention. For 64–128 hour tasks, only 16% succeed without intervention, 51% need at least one intervention, and 26% fail. The bigger the task, the less the person can step away.

The slides end by arranging all this into a "delegation ladder" (p68):

1. Chatbot: AI answers, the human does the work.
2. Assistant: human and AI work on the task together.
3. Agent: the human delegates a whole unit of work.
4. Multi-agent worker: the human coordinates several agents.
5. Systematized workflows: skills and agents run the processes.

The slide says OpenAI's workforce sits near the bottom of the chart; in the layout, the bottom rungs are levels 4 and 5, the two levels the first half of this lecture teaches.

### Evidence on the other side

Beyond vendor data, there is research that cools things down. In 2025, [METR](https://metr.org/blog/2025-07-10-early-2025-AI-experienced-os-dev-study) had 16 experienced open-source developers work on 246 real issues in large repos they knew well, randomly assigned to AI-allowed or AI-disallowed. With AI allowed they took 19% longer, yet afterward the developers still felt they had been faster. METR's [2026 follow-up](https://metr.substack.com/p/2026-02-24-uplift-update) estimates they may be faster now, but the people most eager to use AI didn't want to join the no-AI condition, which skewed the data so badly that METR decided to redesign the study. What these two studies tell you is to keep "feels faster" and "measured faster" apart.

Multi-agent setups have critics too. In 2025, [Cognition](https://cognition.ai/blog/dont-build-multi-agents) argued against building multi-agent systems, because every agent that acts carries implicit decisions (style, how edge cases are handled), and agents writing in parallel conflict. In a 2026 [follow-up](https://cognition.ai/blog/multi-agents-working), they said the original observation still holds for many agents writing together; what works now is a narrower class of patterns where several agents contribute intelligence but writes stay with one, such as one agent writing and another reviewing with a clean context. This matches the slides' advice on agent teams: "read" work such as reviews and testing hypotheses is the best to hand out, and work that edits the same file stays with one agent.

## Final self-check

1. You need to do three things at once: check 50 dependencies for known vulnerabilities, fix a flaky test that only fails in CI, and write a design doc for a new API. How would you scale each?
   Criterion: The dependency check is bulky, independent, result-only work, so use a subagent (or several in parallel). The flaky test may take many attempts, so give it a worktree and run `/goal` with the end state "passes ten runs in a row." The design doc needs back-and-forth with you, so keep it in the main conversation.
2. Your manager says, "Let's run 20 agents in parallel too, and we'll get 20x the output." Use this lecture to point out at least two problems.
   Criterion: Any two or more. Parallelism buys wall-clock time, not quality; review and merging still fall on people and grow with the number of agents; tasks with dependencies or shared files turn parallelism into conflicts (the C compiler agents stuck on one kernel bug); token costs grow with the number of agents; and METR's research warns that feeling faster isn't the same as measuring faster.
3. Why does the lecturer say "don't expect the agent to be deterministic; make the surrounding system dependable"? Give one concrete practice.
   Criterion: You say the uncertainty comes from meaning, retrieval, sampling, and the environment, and can't be removed at the model layer; but the generated program is usually deterministic, so tests, type checks, CI, or a verifiable `/goal` end state can lock the result down.

## Further reading

- [Claude Code multi-agent overview](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en): choosing among subagents, agent teams, and workflows from the product side.
- [Claude Code agent teams guide](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en): setting up and running an actual team.
- [Claude Code dynamic workflows](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en): what a workflow script looks like.
- [Subagents and worktree isolation](/posts/ai/2026-08-30-coding-agent-subagent-worktree-isolation-en): doing the same isolation in your own harness; worth reading before Assignment 2.
- [Skill vs. subagent](/posts/ai/2026-03-30-skill-vs-subagent-comparison-en): another take on "keep it in the main conversation with a skill, or hand it off."

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)).
- Source: [Lecture 3 slides](https://cs2680.com/slides/3_agent_use_2.pdf) (PDF pages p5–68, with p47–50 optional), read on 2026-10-22. Page numbers always follow PDF page order; the numbers printed in the slide footers differ from PDF page order.
- Product behavior was checked against the Claude Code docs as of 2026-10-22; Superpowers and Caveman were checked against their GitHub repos as of 2026-10-22. Places that differ from the slides are flagged in the text.
- The timings in "three bugs in three worktrees" are a teaching example added by this site, not lecture content.

## References

- [CS2680 Lecture 3 slides: Agent From a User's Perspective II](https://cs2680.com/slides/3_agent_use_2.pdf)
- [obra/superpowers (GitHub)](https://github.com/obra/superpowers)
- [JuliusBrussee/caveman (GitHub)](https://github.com/JuliusBrussee/caveman)
- [JetBrains: Speaking to AI Agents like Cavemen Saves 65% of Tokens. We Test.](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)
- [Claude Code docs: Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code docs: Worktrees](https://code.claude.com/docs/en/worktrees)
- [Claude Code docs: Desktop](https://code.claude.com/docs/en/desktop)
- [Claude Code docs: Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code docs: Agent teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code docs: Dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code docs: /goal](https://code.claude.com/docs/en/goal)
- [Claude Code docs: Scheduled tasks and /loop](https://code.claude.com/docs/en/scheduled-tasks)
- [Nicholas Carlini: Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [Andrej Karpathy: Software 2.0](https://karpathy.medium.com/software-2-0-a64152b37c35)
- [Andrej Karpathy: Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
- [The Shift to Agentic AI: Evidence from Codex (arXiv 2606.26959)](https://arxiv.org/abs/2606.26959)
- [OpenAI: Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)
- [METR: Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-AI-experienced-os-dev-study)
- [METR: We are Changing our Developer Productivity Experiment Design](https://metr.substack.com/p/2026-02-24-uplift-update)
- [Cognition: Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)
- [Cognition: Multi-Agents: What's Actually Working](https://cognition.ai/blog/multi-agents-working)
