---
title: "Learning Design from Mature Coding Agents (32): Subagents and Worktree Isolation — Teaching the Main Loop to Delegate"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 32
tags: [coding-agent, subagent, multi-agent, git-worktree, rivumi, claude-code]
lang: en
tldr: "Mature subagents need roles, bounded fan-out, narrowed permissions, and a result contract. rivumi now has native named-role schedules, parallel fan-out, child allowed_paths constrained by the parent, unsafe execution disabled by default, and parent-approved transaction proposals. Persistent background lifecycles, recursion trees, and automatic worktree merging remain open."
description: "Comparing subagent orchestration and isolation, then checking Rivumi's named roles, bounded fan-out, narrowed permissions, and transaction-proposal baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-subagent-worktree-isolation)

Seventh post in part two of the series. Scope note: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community decompiled v2.1.88; symbol names may differ from the original). Every citation was actually grepped in local clones. Worktrees themselves were covered in part one's "workspace isolation" post via EnterWorktreeTool — this post focuses on **subagent orchestration**, where a worktree is just one isolation option.

## The capability problem: three moments when one loop isn't enough

A single-loop agent eventually hits all three of these:

1. **Context pollution**. Ask the main agent to "scan these 20 files and find the relevant ones," and every line it reads stays in the main conversation. Exploratory garbage mixes with real decisions, and by the time compaction summarizes it away, important details get flattened too.
2. **Serial bottleneck**. "Run the tests, check the docs, and review three candidate approaches simultaneously" can only happen one item at a time in a single loop.
3. **Blurred responsibilities**. One context serves as both researcher and implementer, so the system prompt compromises into something that does neither well.

Subagents answer all three at once: open a clean child session, give it a dedicated system prompt and tool pool, and bring back only the **conclusion** to the parent conversation. Spawning isn't the hard part — the hard parts around it are: can a subagent spawn its own subagents? How do permissions inherit? After files change, how do results merge back? Who owns a failure?

## How the five do it

### pi: none. That itself is the answer

Grepping pi-mono's packages, "subagent" appears exactly once, in an RPC client. Pi's core deliberately does no orchestration — it provides the minimal loop and tool protocol and leaves assembly to the host. This is the key to reading omp: **everything below was added by the fork**, and the two-generation evolution is itself design documentation.

### omp: subagents as first-class citizens with lifecycles

The entry point is `oh-my-pi/packages/coding-agent/src/task/index.ts#TaskTool`. Decisions worth stealing:

- **Batch shape**: one call can carry `tasks[]`, with a required shared `context` injected into every spawned child's system prompt — forcing the model to write down shared background once instead of letting N children re-read it.
- **Termination protocol**: a subagent must call a hidden `yield` tool to finish. If it forgets, you wake it up — `MAX_YIELD_RETRIES = 3` in `oh-my-pi/packages/coding-agent/src/task/executor.ts`, with the final retry forcing `toolChoice = yield`.
- **Output caps**: `task/types.ts#MAX_OUTPUT_BYTES` sets 500,000 bytes; overflows get truncated but the full text lands on disk as an artifact, retrievable via the internal `agent://<id>` protocol.
- **Concurrency control**: `task/parallel.ts#Semaphore` bounds session-level fan-out, hot-reloaded from settings — changing `maxConcurrency` affects even queued work.
- **Lifecycle**: `registry/agent-registry.ts#AgentStatus` distinguishes `running | idle | parked | aborted`. Finished children aren't destroyed; after idling seven minutes they park into revivable shells — ask a follow-up via hub messaging and it wakes up, saving the cost of re-laying context.
- **Recursion gate**: at `task.maxRecursionDepth`, the task tool is removed from the child's tool list outright — not politely requested away via prompt.

On isolation, the interesting bit: `task/worktree.ts#parseIsolationMode` maps `none/auto/apfs/btrfs/zfs/reflink/overlayfs/projfs/block-clone/rcopy` onto the native PAL (`crates/pi-iso`). Auto mode walks the candidate list, falling back on failure — worst case, a recursive copy. Isolated results choose one of two exits: captured as a patch file, or committed to a branch and cherry-picked back to the parent — and isolated agents are explicitly marked non-revivable, since their workspace is gone.

One honest detail: headless subagents have no UI for approval prompts, so `runSubprocess` forces approvalMode to yolo. That holds inside omp's trust model (the child's tool set was already pruned), but copying it requires thinking through your own approval semantics.

### claude-code: per-spawn isolation matrix

The schema of `claude-code-source/src/tools/AgentTool/AgentTool.tsx#AgentTool` is itself documentation: `subagent_type` picks a specialized agent, `model` overrides the model, `run_in_background` detaches, `isolation: 'worktree'` requests a private repo copy, and `cwd` swaps the working directory (mutually exclusive with worktree). Each child gets its own agent definition's system prompt, and its tool pool is assembled independently via `assembleToolPool` — permission mode decoupled from the main loop.

The worktree lifecycle is finer than expected: `utils/worktree.ts#createAgentWorktree` creates a temporary worktree named after an agent-id slug, then `hasWorktreeChanges` decides at cleanup — no changes means `removeAgentWorktree` deletes it immediately; with output, the worktree survives and `worktreePath`/`worktreeBranch` go into the completion notification. **Garbage auto-collects; results report a path** — the main agent never has to guess what happened.

Background execution registers tasks via `tasks/LocalAgentTask/LocalAgentTask.tsx#registerAsyncAgent`; synchronous waiting is provided by the `block=true` parameter in `tools/TaskOutputTool/TaskOutputTool.tsx`. Tool results cap at `maxResultSizeChars: 100_000`.

### opencode: one session per subagent

`opencode/packages/opencode/src/tool/task.ts#TaskTool` has the cleanest model: each subagent is a real session with a `parentID` — transcripts are naturally inspectable, and passing a prior `task_id` resumes the same child for follow-ups. Two guards:

- Depth counting walks up the parent chain against `cfg.subagent_depth`, which **defaults to 1** — children can't spawn children unless you explicitly allow it.
- `agent/subagent-permissions.ts#deriveSubagentSessionPermission` derives permission rules from the parent session and the child's agent definition, and denies `todowrite` and `task` by default — no granted authorization, no todo lists, no reproduction.

Background mode still sits behind an experimental flag (`OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true`), injecting completions as synthetic messages into the parent conversation. Its prompt guidance is also refreshingly practical: "DO NOT sleep, poll for progress, or duplicate this task's work" — coordination landmines written straight into model instructions.

### codex: parallelism on another axis

codex's `codex-rs/cloud-tasks` isn't in-process subagents; it dispatches tasks to cloud environments (with best-of-n comparison). It's included here as contrast: the endpoint of parallelization is upgrading "spawn a subprocess" to "spawn an environment," but the protocol questions — dispatch, waiting, result retrieval — are the same set.

## Academic grounding

Both the value and the risk of multi-agent collaboration have empirical backing. [MetaGPT](https://arxiv.org/abs/2308.00352) shows that assigning roles and passing structured artifacts along SOPs significantly reduces hallucination cascades — the academic version of `subagent_type` plus output schemas. [CAMEL](https://arxiv.org/abs/2303.17760) demonstrated role-playing dual-agent cooperation even earlier, but also recorded how agent conversations drift and need mid-course intervention — echoing opencode writing "don't touch each other's files" into prompts. Anthropic's own engineering post ([How we built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system)) delivers the engineering lessons: lead agents learn to decompose tasks and parallel children save wall-clock time, but token consumption runs roughly an order of magnitude above single-agent chat — parallelism isn't free.

## Original design draft (2026-08-25)

This draft records the starting point on 2026-08-25: the native path had no subagent mechanism, and child agents inside external runtimes were outside Rivumi's visibility. The interface and isolation rules below were design hypotheses at that time. A later section checks them against the named-role fan-out and transaction-proposal baseline shipped by `2ed5efb`, so the historical draft is not mistaken for current status.

The draft:

**Interface location**: add `src/rivumi/subagent.py` defining `SubagentRunner.spawn(task, *, agent_profile, isolation) -> SubagentResult`. `SubagentResult` is a fixed contract: `final_text` (truncation-capped), `patch_path` (if files changed), `usage`, `status` — the merger of omp's `yield` and claude-code's worktree notification. **Results are always "text + artifact path," never the full transcript.**

**Isolation comes almost free**: this is an unexpected dividend of rivumi's architecture. `runtime.py#LocalGitWorkspace.prepare` and `conversation_workspace.py#ConversationWorkspace.create` already build a pinned-SHA disposable clone per run — a subagent is simply "one more workspace." No need for omp's ten filesystem backends or claude-code's temporary worktree management; the isolation boundary already exists.

**Orchestration rules** (stealing the consensus):

- Depth gate defaults to 1 (following opencode); past the limit, remove the spawn tool from the child's tool list.
- Session-level Semaphore bounds fan-out.
- Approvals fail closed: when a headless child hits an operation needing approval, **deny by default** and report — unlike omp forcing yolo. rivumi's trust model lacks the premise that "the child's tool set was sufficiently pruned," so the direction must invert.
- Child events land in the existing JSONL event stream tagged with `parent_run_id`, letting the transcript draw nested boundaries.

**Risks and trade-offs**:

- **Multiple children writing the same repo conflicts**. Forbid it in v1: either each subagent gets its own workspace with human-ordered patch merging afterwards (rivumi patches require human review anyway), or serialize write-type tasks.
- **Cost**: Anthropic itself reports order-of-magnitude token overhead for multi-agent. The spawn tool's description should say explicitly: exploration-type tasks only.
- **External backends out of scope**: under the omp adapter, omp spawns its own children — invisible to rivumi and rightly so; mark as runtime-managed.

## Fitting the existing architecture

At draft time, exploratory native work polluted the main conversation and "dispatch three directions and scout each once" meant manually launching three processes. Bounded dispatch now closes that first gap; persistent background lifecycle, recursive depth management, and automatic worktree merge remain outside the baseline.

Artifacts, event attribution, and parent approval are now connected through `subagents.py` and the planner tool rather than waiting for assembly. What remains is production trace validation, role override/inheritance hardening, and integration strategy for multiple write proposals.

One-line summary: mature projects agree a subagent needs **an explicit termination protocol, output caps, a depth gate, and an isolation boundary**. Rivumi's baseline now ships roles, bounded fan-out, narrowed authority, and parent-approved transactions; persistent lifecycle and automatic merge remain open, not subagents as a whole.

## Rivumi's current implementation

As of `2ed5efb`, the native path has a subagent baseline. `subagents.py` defines named roles and role instructions, normalizes schedules, derives child tasks from the parent `TaskContract`, and rejects any child `allowed_paths` expansion beyond the parent. The planner tool in `loop.py` accepts multiple agent specs, the executor performs bounded parallel fan-out, and results return to the parent as summaries plus artifact information.

Safe defaults are implemented too: child runners disable unsafe local execution, and modify/execute approval does not silently inherit. Write-oriented work can propose a transaction that the parent path approves before application. A schedule-event analyzer checks overlap, sequencing, and role distribution so coordination is not purely a prompt convention.

This is not yet omp-style park/revive lifecycle management. Full background tasks, recursion-tree depth management, and automatic worktree merge/cherry-pick remain absent. Disposable workspaces provide an isolation substrate, but safely reconciling each child's branch still needs a stronger conflict and approval protocol.

## References

- [Rivumi subagent scheduling and task derivation (fixed commit)](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/subagents.py)
- [Rivumi subagent tests (fixed commit)](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_subagents.py)

- [MetaGPT: Meta Programming for Multi-Agent Collaborative Framework (Hong et al., 2023)](https://arxiv.org/abs/2308.00352)
- [CAMEL: Communicative Agents for "Mind" Exploration (Li et al., 2023)](https://arxiv.org/abs/2303.17760)
- [How we built our multi-agent research system (Anthropic Engineering)](https://www.anthropic.com/engineering/built-multi-agent-research-system)
- [can1357/oh-my-pi — docs/tools/task.md](https://github.com/can1357/oh-my-pi/blob/main/docs/tools/task.md)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
