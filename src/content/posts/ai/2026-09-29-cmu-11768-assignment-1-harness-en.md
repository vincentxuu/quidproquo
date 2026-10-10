---
title: "Reading CMU 11-768 A1: Build an Agent Harness by Hand — One ReAct Loop to Fix Bugs, Compact Context, and Play Chess"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-harness, compaction, agent-skills]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 7
tldr: "CMU 11-768's first assignment starts from an empty ReAct loop: a bash-only CodeAgent fixes a bug in a chess app, context compaction is added to solve a SWE-bench task, and the same loop becomes a ChessAgent that runs a two-ply search with simulate_move, run_python, and a skill. All 100 points are graded by replaying submitted patches and trajectories offline."
description: "A guide to CMU 11-768 Assignment 1 (Build an Agent Harness): how its three parts connect, the Modal sandbox and model setup, what each TODO tests, the 100-point rubric, the design trade-offs, and how it maps back to L1–L6 concepts of tool use, context management, skills, planning, and coding agents. No solutions included."
draft: false
glossary:
  - term: "ReAct"
    aliases: ["Reason + Act"]
    definition: "An agent loop in which the model interleaves reasoning and actions in one context and reads back each action's result."
    advanced: "Proposed by Yao et al. in 2022; modern tool-calling APIs structure actions as tool calls and observations as tool messages."
    context: "All three agents in A1 share a single ReAct loop."
  - term: "progressive disclosure"
    definition: "Give the agent only each skill's name and short description up front, and load the full content on demand."
    advanced: "Lets an agent hold many skills without flooding its context; the Agent Skills spec uses the YAML frontmatter of SKILL.md as the catalog."
    context: "A1 Part 1 puts the skill catalog in the system prompt and serves full content through invoke_skill."
  - term: "programmatic tool calling"
    aliases: ["code mode"]
    definition: "Letting the model write a program that calls tools directly, instead of issuing one tool call at a time."
    advanced: "Loops, branches, and intermediate results stay in the sandbox; only the final output returns to the context."
    context: "In A1 Part 3, run_python lets a chess search make hundreds of simulate_move calls in one step."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)

The first assignment in [CMU 11-768 AI Agents](https://www.cmu-agents.com/) ([series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en)) is **Build an Agent Harness**. The [starter code is on GitHub](https://github.com/cmu-agents/assignment-1), it was due Monday, September 14, 2026 (per the [course's Assignments page](https://www.cmu-agents.com/#/assignments)), and it was written by TAs Weiwei Sun and Saujas Vaduguru. The handout opens with a precise definition: a harness is the interface that lets a language model — something that produces probable strings — **observe and act in an environment**. You build that interface from scratch in the [ReAct](https://arxiv.org/abs/2210.03629) framework.

What makes the assignment interesting is its structure: one `Agent` base class and one ReAct loop have to carry three very different agents. You see firsthand that a harness's skeleton is generic; only the prompts, tools, and observation formats change with the domain. That is exactly the definition on the [L6 Coding Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en) slides: Harness = prompts + tools + agent loop + context management.

This post covers only the requirements, architecture, grading, and design trade-offs, and maps each TODO back to concepts from L1–L6. **It gives no solutions** and shows no TODO implementations.

## Course video sources

The official schedule is at the SPA route #/schedule. Groundlane and Exa did not retrieve the full schedule in this update, so the article’s direct recording sources were not reverified. Check the official schedule for the lecture recording.

Course and recording entries:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

## How the three parts connect

```text
                SWE-Bench issue
                      |
                      v
buggy chess app -> CodeAgent -> fix.patch -> repaired chess server
                                              ^
                                              |
                                    ChessAgent tools
```

- **Part 1**: write the shared ReAct loop, instantiate it as a `CodeAgent` that works in a terminal, and have it fix a bug in a chess app.
- **Part 2**: add **context compaction** to the loop and use it on a longer SWE-bench task.
- **Part 3**: instantiate the same loop as a `ChessAgent` that plays a rule-based bot on the app fixed in Part 1, adding simulation, programmatic tool calling, and a skill step by step.

The parts form a causal chain: if the Part 1 patch does not work, the Part 3 chess server will not run.

## Environment and rules

- **Packages**: managed with [uv](https://docs.astral.sh/uv/); `make setup` installs everything and checks that the target `chess_app` submodule is at the pinned commit.
- **Sandbox**: every command the agent produces runs in a remote [Modal](https://modal.com/) sandbox, not on your machine. The handout warns that a sandbox left running after a bad shutdown keeps billing; check with `modal container list`.
- **Models**: an OpenAI-compatible endpoint, defaulting to `deepseek/deepseek-v4-flash-0731`; the Part 3 experiment also uses `openai/gpt-oss-120b`. Enrolled students receive model and Modal credits.
- **Check before you spend**: anything that consumes credits is called billable; `make doctor` validates submodules, Modal auth, and the model endpoint without starting a sandbox or generating tokens.
- **Public tests are not proof**: `make test` is offline and free, but the starter deliberately fails the TODO tests. Private tests also cover cleanup on failure, duplicate or malformed skills, parallel chess calls, transport errors, artifact consistency, patch replay, and real Modal integration.

Five rules: do not modify `tests/`, `tasks/`, or `chess_app/`; do not change the provided logging and cleanup, and do not duplicate the ReAct loop in a subclass; do not hard-code solutions; never expose API keys; use only the intended tools for each agent at each stage. The second rule is the spirit of the whole assignment: **there is exactly one loop**.

## Part 1: the shared loop and CodeAgent (30 points)

### 1.1 Build the prompt

`Agent.build_prompt` assembles the system prompt, task prompt, and prior interaction into a message list for the provided `query_language_model`. The handout spells out the OpenAI Chat Completions message rules:

- Exactly one `system` message first (standing instructions: domain, environment, rules, general strategies), followed by a `user` message (the task).
- Each `assistant` message is followed only by `tool` messages (tool results) or a `user` message.
- One assistant response can issue several tool calls, and each needs its own tool message.

Two hard requirements on top. The `CodeAgent` system prompt must contain a `<system_information>` block verbatim, filled with the machine, release, system, and version reported by the sandbox. And `build_prompt` must be **domain-agnostic**, because Part 3's `ChessAgent` reuses it unchanged.

A detail hides in a footnote: some providers reuse tool call IDs like `call_0`, so you cannot assume IDs are unique across a trajectory; match them within the same assistant action.

### 1.2 Run the loop

`Agent.run` is [L1](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en)'s definition of an agent made concrete: ask the model for reasoning and actions, extract tool calls, execute them, feed back observations, repeat until done. Completion is signaled by setting `Agent.finished`; exceeding `step_limit` (100 steps by default for CodeAgent, 200 for ChessAgent) raises `StepLimitError`. The rubric row also says "text-only recovery": when the model replies with text and no tool call, the loop must not hang or crash, and you have to decide how to steer it back.

### 1.3 Execute tools

`CodeAgent` has just two tools: `execute` (run a bash command) and `send_message` (report to the user, which also means submitting). This is the bash-only toolset from L6, the same idea as [mini-SWE-agent](https://mini-swe-agent.com/latest/). The starter's `execute` description is worth reading, because it writes L6's lessons straight into the model-facing text: every command runs in a fresh subshell so `cd` does not persist; read files with `head`, `tail`, or `sed -n` rather than printing them whole; edit with `sed -i` or a heredoc.

The hard requirement: **malformed JSON and unknown tools must become recoverable observations the agent can see and correct, not exceptions**. That is the core of [L2 Tool Use](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en) — error messages are feedback for the model.

The starter already does one thing for you: any tool output over 10,000 characters keeps 4,900 characters from each end and replaces the middle with "N characters elided; read a narrower range." That is [L3](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en)'s observation truncation, and the notice itself nudges the agent's next action.

### 1.4 Load skills

Fixing the bug is not enough; the agent needs to know how to submit. The assignment teaches this with an [Agent Skills](https://agentskills.io/home)-format `submit-task` skill: write changes as a `git diff` into `patch.txt`, check that the diff contains only source changes, then call `send_message` — three separate steps.

You implement the simplest form of **progressive disclosure**:

- Scan each child directory of `skills_path` for a `SKILL.md`, parse its YAML frontmatter, and key it by `name`.
- Produce two things per skill: a short `metadata` string (the catalog in the system prompt) and the full `content` (served only when the agent calls `invoke_skill`).
- Duplicate names and missing or malformed frontmatter raise a clear `ValueError`.
- The inverse requirement: **with no skills loaded, nothing in the prompt may mention `patch.txt` or give submission instructions**.

This maps directly to [L4 Skills and Memory](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en). The inverse requirement is good design: it forces the submission protocol to live entirely inside the skill instead of being quietly hard-coded in the system prompt.

### 1.5 Fix the bug

The task is `chess-terminal-move`: when White plays a legal move that ends the game immediately (checkmate, say), `POST /api/move` returns HTTP 500. A game-ending move should return the final state normally, report the result, and include no engine reply; non-terminal moves must still get a deterministic engine response. The agent works in `/testbed` and must reproduce, fix, and verify — L6's localize–edit–verify.

`make run-code-agent` produces `artifacts/fix.patch` and a trajectory; `make check-part1` applies the patch to a **fresh** testbed and runs the regression test and the app's test suite. Editing `chess_app/` directly is not allowed.

## Part 2: context compaction (28 points)

Long ReAct transcripts drive up cost, eventually crowd out useful context, and can hit the model's context window. Part 2 has you implement a **model-generated working memory** in the shared `Agent`, and explicitly forbids provider-specific compaction endpoints.

The `compact_context` requirements are specific:

- The compaction system prompt must ask for **concise, factual** working memory that preserves the objective, constraints, files, commands, edits, concrete results, failed approaches, tests, blockers, and next action.
- Summarize only an **old prefix**; keep the original system and task messages verbatim; keep at least the latest complete assistant action with all its linked tool observations.
- After compaction, `build_prompt` output must actually change and actually get shorter.
- Do not touch `api_prompt` and `api_responses`; those are the grader's ledger.

The trigger logic, `maybe_compact_context`, is provided (token estimation, threshold check, compaction event logging); you call it before every new action request. Token estimation is a rough "JSON characters divided by four," independent of any tokenizer.

The test task is SWE-bench's `django__django-15368`: `bulk_update()` with a plain `F('...')` expression writes the string `'F(name)'` to the database instead of resolving the column. You run once with a 6,000-token threshold (at least one compaction must trigger, and the patch must pass FAIL_TO_PASS and PASS_TO_PASS), then once with `COMPACT_THRESHOLD=0` as a full-context baseline, compare token usage, and write it up in `token-usage-analysis.md`. The handout notes that generation is stochastic, so the compacted run need not use fewer steps than every baseline sample.

This maps to L3 Context Management. The trade-offs to think through: each compaction costs a model call of its own; shorter summaries save more but drop "failed approaches" and invite repeating them; and where you cut determines whether the message sequence still satisfies the API's rules.

## Part 3: ChessAgent (40 points)

`ChessAgent` reuses the loop from the first two parts unchanged. It plays White; the server's deterministic bot plays Black and replies automatically after every legal White move.

### 3.1 `play_move`

First define the tool per the [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling) spec: exactly one required string argument `move`, described as [UCI notation](https://en.wikipedia.org/wiki/Universal_Chess_Interface) (for example `e2e4`, or `e7e8q` for promotion), rejecting extra arguments. The implementation POSTs to `/api/move`, and on success formats the state, updates `last_state`, and sets `finished` from `game_over`.

The error list is thorough: malformed JSON, non-object arguments, wrong types, moves the server rejects, and transport failures all become `<chess_error>...</chess_error>` observations for the agent to handle. One very practical rule: **when the model issues several parallel `play_move` calls, execute at most one** and reject the rest recoverably, because the board changes after the first move.

### 3.2 The observation A/B experiment

This is the most research-like part. Compare two observations — board only, and board plus all legal moves — across two models (DeepSeek-V4-Flash and gpt-oss-120b), for four runs. For each, record total `play_move` calls, calls rejected as illegal, the invalid-move rate, and whether the game reached `game_over`, then write `observation-experiment.md`. Grading is on the experiment and evidence, **not on winning**.

This maps to observation design from L2: what a tool returns directly shapes which mistakes the agent makes.

### 3.3 `simulate_move`

Add a simulation tool that **never touches the live board**: pass a complete six-field [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) to get that position and its legal moves; add a UCI move to get the position after exactly one ply, for either side. It is the smallest version of [L5 Planning](/en/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en)'s "roll it out in a model or simulator before committing," and echoes the world models at the end of L6 — except this simulator is exact.

### 3.4 `run_python`

Finally, **programmatic tool calling**: the model writes a Python snippet that can call `simulate_move` and `play_move` as ordinary synchronous functions. The code is base64-encoded and sent via `env.execute` to `/opt/assignment/sandbox_python.py` in the sandbox. **Model-written code must never run in the local agent process.**

Errors come in two layers. A failing sandbox command (non-zero return code) is a `<chess_error>`; a Python exception in the model's code is a successful run, reported in the returned JSON's `error` field. After every snippet, re-read the live board and append the state to the observation; otherwise the model may replay a move the snippet already committed.

### 3.5 The chess skill

Having `run_python` does not mean the model will use it. So the assignment adds a `select-move` skill: play fixed opening preferences, then use Python to run a two-ply minimax over each candidate (my move, Black's reply, evaluate), sorting candidates by UCI string to break ties, and commit with a single `play_move` at the end. You give `ChessAgent` `invoke_skill` support (reimplemented, since its tool execution path differs) and register the tool only when skills are loaded.

The submitted trajectory must show `invoke_skill`, followed by `run_python` code that calls `simulate_move` to search and `play_move` once to commit. Reading the skill and then calling `play_move` directly each turn does not count.

## Grading

The total is 100 points, and each row is graded independently; a failed stochastic model run does not erase unrelated implementation credit.

| Part | What is graded | Points | Evidence |
|---|---|---|---|
| Part 1 | Prompt construction; ReAct lifecycle, text-only recovery, step limit, cleanup, trajectory; tool dispatch and recoverable errors; skill loading and `invoke_skill` | 22 | Private unit tests |
| Part 1 | Chess patch applies and passes private and regression tests | 8 | Patch replay in a fresh testbed |
| Part 2 | Compaction trigger and model-generated summary; original instructions and latest tool step preserved; context materially reduced | 16 | Private tests, trajectory, compaction events |
| Part 2 | Token usage analysis report | 4 | Report |
| Part 2 | SWE-bench patch passes FAIL_TO_PASS and PASS_TO_PASS | 8 | Patch replay |
| Part 3 | `play_move` schema, state updates, and errors; `simulate_move`; `run_python` | 22 | Private unit / integration tests |
| Part 3 | Basic game reaches a terminal state; four A/B runs complete; A/B report | 12 | Trajectories, results, report |
| Part 3 | Trajectory combining skill, programmatic search, and a live move | 6 | Trajectory replay |
| — | Complete, parseable, rule-compliant submission | 2 | Archive validation |

The key grading design: **the grader only replays your submitted patches and trajectories and makes no new LLM calls**. Trajectories are the evidence, and missing or inconsistent evidence costs only the affected row. The submission is a ZIP with your modified `src/assignment/agent/`, seventeen artifacts, and an `AI_USAGE.md` describing any AI tools you used. That file is not graded, but a quiz checks that you understand the code you submitted.

## Design trade-offs: what the assignment is really testing

Read the spec closely and you can see it lays out a harness's core judgment calls:

- **Where state lives.** `build_prompt` reassembles the prompt every step, so you decide what the agent remembers — without touching the grader's `api_prompt`. That is L3's distinction between the context shown to the model and the record of what actually happened.
- **Errors as exceptions or observations.** The assignment keeps insisting that errors become observations: bad JSON, unknown tools, illegal moves, network failures, Python exceptions. Much of a harness's robustness is translating failures into feedback the model can read.
- **Tool granularity.** CodeAgent gets only bash; ChessAgent grows from a single `play_move` to `run_python`. Compare L6: fewer tools are more general but leave composition to the model; wrapping frequent actions in dedicated tools reduces mistakes.
- **How much to observe.** A legal-move list can sharply cut illegal moves but costs context. The A/B experiment makes you answer with numbers, not intuition.
- **Knowledge in the prompt or in a skill.** Both the submission protocol and the chess strategy live in skills, with only the catalog in the system prompt. As skills multiply, the difference becomes obvious.

## Mapping to L1–L6

| Assignment section | Lecture | Concept |
|---|---|---|
| 1.1 build the prompt, 1.2 ReAct loop | L1 What Is an Agent? | An agent is a loop that observes and acts in an environment |
| 1.3 tool dispatch and errors, 3.1 `play_move` schema | L2 Tool Use | Tool schemas, errors as feedback, parallel tool calls |
| Starter observation truncation, Part 2 compaction | L3 Context Management | Truncation, summarization, cost of long tasks |
| Skills in 1.4 and 3.5 | L4 Skills and Memory | Progressive disclosure, reusable workflows |
| 3.3 `simulate_move`, 3.5 two-ply search | L5 Planning | Roll out before acting, search |
| 1.5 bug fix, Part 2 SWE-bench | L6 Coding Agents | Localize–edit–verify, bash-only toolset, SWE-bench grading |

## Try it: three exercises without enrolling

The assignment depends on Modal and course-provided model credits; outside the course you would need your own sandbox and OpenAI-compatible endpoint, at your own cost. Even without running the full assignment, you can do these on your own agent:

1. **Turn every tool error into an observation**: find every exception path that can crash your agent's loop (bad JSON, unknown tool, network timeout), return an explanatory tool message instead, and see whether the model self-corrects.
2. **Run an observation A/B test**: pick one tool and compare "return the result only" with "return the result plus the available next options," recording call counts and error rates.
3. **Measure tokens before and after compaction**: using the same rough estimate as the assignment (JSON characters divided by four), chart per-step context length for your longest trajectory, and see how much compaction would save — and what it would lose.

## Further reading

- Previous in series: [L6 Coding Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en)
- On this site: [Reading Stanford CS329Z Week 4: ReAct and MemGPT](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en)
- On this site: [Context compaction in coding agents](/en/posts/ai/2026-08-25-coding-agent-context-compaction-en)
- On this site: [Code mode in coding agents](/en/posts/ai/2026-08-25-coding-agent-code-mode-en) (design trade-offs of programmatic tool calling)
- On this site: [Hooks, skills, and plugins in coding agents](/en/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- Course: [CMU 11-768 AI Agents Assignments page (A1 due date)](https://www.cmu-agents.com/#/assignments), [Course Staff page (TA list)](https://www.cmu-agents.com/#/staff)
- Assignment: [cmu-agents/assignment-1 (GitHub; this post checks ASSIGNMENT.md, the README, and the starter code at commit 67498d8, 2026-09-11)](https://github.com/cmu-agents/assignment-1)
- Paper: [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) (authors and 2022 publication date)
- Spec: [Agent Skills specification](https://agentskills.io/specification) (SKILL.md YAML frontmatter and progressive disclosure)
- Task source: [SWE-bench](https://arxiv.org/abs/2310.06770), [mini-SWE-agent](https://mini-swe-agent.com/latest/)
- Spec: [OpenAI function calling guide](https://developers.openai.com/api/docs/guides/function-calling) (JSON schema `parameters` and `required`; strict mode requires `additionalProperties: false`)
- Tools: [uv](https://docs.astral.sh/uv/) (a Python package and project manager), [Modal](https://modal.com/) (the [Sandboxes guide](https://modal.com/docs/guide/sandbox): secure containers for running untrusted LLM-generated code; [`modal container list`](https://modal.com/docs/reference/cli/container) lists currently running containers)
- Chess notation: [Universal Chess Interface](https://en.wikipedia.org/wiki/Universal_Chess_Interface) (UCI moves use a variant of long algebraic notation, e.g. `e2e4` and `e7e8q` for promotion), [Forsyth–Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) (a FEN record has six space-separated fields)
