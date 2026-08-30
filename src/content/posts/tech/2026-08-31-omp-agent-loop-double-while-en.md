---
title: "OMP agent loop: Why two while loops? What the outer 'stopped but woken by steering' layer actually does"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, coding-agent, architecture, steering, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 1
tldr: "omp's runLoopBody uses a double while loop: the inner loop drives the core model call → tool execution rhythm; the outer loop, when the agent would stop, drains queued steering / follow-up / asides to decide whether to run another turn. This design solves delivery timing for 'user typing while model streams' and 'background tasks quietly queueing messages'."
description: "Deep dive into omp's agent-loop.ts runLoopBody, breaking down outer/inner while responsibilities, three steering poll points, pause gate's two parking spots, soft tool requirement cross-turn lifecycle, and why this beats a single loop."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 1. Previous posts ([v1 vs Pi](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en), [OMP 2 Rust rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)) were macro comparisons; here we start dissecting subsystems.

---

## TL;DR

- **Inner while** (`while (hasMoreToolCalls || pendingMessages.length > 0)`): core rhythm of model call → tool execution → result injection → next model call
- **Outer while** (`while (true)`): when agent would stop (`hasMoreToolCalls === false && pendingMessages.length === 0`), runs `onBeforeYield`, polls steering/follow-up/asides; if new messages arrive, pushes to `pendingMessages` and `continue`s back to inner loop
- **Three steering poll points**: start (line 1067), mid-batch (1509), outer drain (1538) — solves delivery timing for "user typing while model streams" and "background tasks quietly queueing messages"
- **Pause gate two parking spots**: before model call (1142), before tool call — lets `/pause` freeze all in-process agents without aborting anything
- **Soft tool requirement cross-turn state**: `softRequirementState` lives until next logical turn boundary; Harmony retry doesn't re-escalate

---

## Context

You're building a coding agent. Model returns tool calls, agent executes them, injects results back, asks model again. Model says "I'm done" (`stop_reason: "end_turn"`), agent prepares to end the turn.

But at this moment:

1. User typed a new instruction while model was streaming (steering message)
2. A background hook wants to inject a diagnostic (aside message)
3. Previous turn had a subagent yield leaving a follow-up message

**When should these messages be delivered?** If you stuff them into the next model call now, you might interrupt the "agent wanted to stop" semantics. If you don't, they only appear on the next manual prompt — too late.

This is exactly what omp's `runLoopBody` double-while solves.

---

## Problem

Naive single-loop approach:

```typescript
while (hasMoreToolCalls || pendingMessages.length > 0) {
  // model call → tool call → ...
  // when hasMoreToolCalls becomes false and pendingMessages empty → break
}
```

Issues:

- **Steering delivery timing ambiguous**: poll before model call → user typing while model streams; poll after → agent already decided to stop, steering waits for next manual prompt
- **Asides/follow-ups priority unclear**: background asides shouldn't force an extra model call (costs money), but steering (active user input) should
- **Pause/resume semantics hard to express**: single loop needs to park at "before model call" AND "before tool call" — logic scatters
- **Cross-turn state like Harmony leak retry / soft requirement escalate** hard to express cleanly in single loop: "this retry doesn't count as new turn", "soft requirement only escalates once"

omp's solution: separate "core rhythm" from "stop-boundary drain logic" into two layers.

---

## Attempts (visible in omp code evolution)

`git log --oneline packages/agent/src/agent-loop.ts` shows key evolution:

1. **Early**: single while, steering polled once at start
2. **Added mid-batch steering poll** (line 1509): discovered user keystrokes during long tool execution got stuck in queue until next turn
3. **Outer while wrapper** (line 1126): to run `onBeforeYield` + drain steering/asides/follow-ups at "agent would stop" boundary
4. **Pause gate extracted to separate module** (`pause.ts`): originally inline, later factored out because main session, subagent, advisor all share one process-wide gate
5. **Harmony leak handling** (1269-1296): GPT-5 Harmony format leaks thinking content; needs abort-retry and truncate-resume recovery, each with cross-turn counters (`harmonyRetryAttempt`, `harmonyTruncateResumeCount`) — these states would be messy in a single loop

Each step peeled a "cross-cutting concern" out of the core rhythm.

---

## Solution: Precise Division of Labor

### Inner Loop: Core Rhythm (model ↔ tool)

```typescript
// line 1130
while (hasMoreToolCalls || pendingMessages.length > 0) {
  // 1. pause gate parking
  if (agentPauseGate.paused) await agentPauseGate.waitUntilResumed(signal);

  // 2. consume pendingMessages (steering/asides promoted from queue to context)
  // 3. syncContextBeforeModelCall / beforeModelCall hooks
  // 4. streamAssistantResponse (model call)
  // 5. parse tool calls, execute executeToolCalls
  // 6. emitTurnEnd
  // 7. decide hasMoreToolCalls (based on stopReason, tool call count, deadline, soft requirement)
  // 8. mid-batch steering poll (1509) → decide pendingMessages
}
```

**Key points**:

- `hasMoreToolCalls` driven by `message.stopReason === "toolUse" || message.stopReason === "stop"` + tool calls present
- `pendingMessages` consumed at loop start into `turnMessages`, becoming part of this turn's context
- **Mid-batch steering poll** (1509-1518): after tools complete, before next model call. If `hasMoreToolCalls` true (more tools coming), merges steering + asides into `pendingMessages`; if false (agent wants to stop), keeps only steering, leaves asides for outer drain

### Outer Loop: Stop-Boundary Drain

```typescript
// line 1126
while (true) {
  // inner loop finishes → agent would stop here
  
  // 1. onBeforeYield (host can inject follow-ups, do cleanup)
  await config.onBeforeYield?.();
  
  // 2. three-source poll: lateSteering / asideMessages / followUpMessages
  const lateSteering = await config.getSteeringMessages?.(signal) || [];
  const asideMessages = resolveAsides(await config.getAsideMessages?.());
  const followUpMessages = await config.getFollowUpMessages?.(signal) || [];
  
  // 3. if any source has messages → push to pendingMessages, continue back to inner
  if (lateSteering.length > 0 || asideMessages.length > 0 || followUpMessages.length > 0) {
    pendingMessages = [...lateSteering, ...asideMessages, ...followUpMessages];
    continue; // ← key: back to inner loop for another turn
  }
  
  // 4. truly nothing → break
  break;
}
```

**Key design**:

- **Steering priority**: outer drain puts `lateSteering`, `asideMessages`, `followUpMessages` all into `pendingMessages`, but inner loop consumes without priority — priority logic lives in **mid-batch poll (1509-1518)**: only steering can force an extra turn when agent wants to stop; asides/follow-ups appearing at stop boundary get collected by outer drain but **don't** force an extra turn at mid-batch
- **`onBeforeYield` in outer loop**: ensures exactly once per logical turn end, not repeated on Harmony retry, soft requirement escalate, etc.
- **Abort safety**: every poll checks `signal?.aborted`, returns empty array on external abort — avoids stranding queue messages in a run about to die (line 1535 comment explains in detail)

---

## Why This Way: Three Poll Points Timeline

```
Timeline:
──────────────────────────────────────────────────────────────────►

[Run Start]
   │
   ├─► 1. Start steering poll (line 1067)
   │     Purpose: capture "user typed while waiting for model"
   │
   ├─► Inner loop turn 1
   │     model call → tool calls → emitTurnEnd
   │
   ├─► 2. Mid-batch steering poll (line 1509)
   │     Purpose: capture "user typed during tool execution" + asides
   │     Decision: hasMoreToolCalls=true → steering+asides merged
   │               hasMoreToolCalls=false → only steering kept, asides to outer
   │
   ├─► Inner loop turn N (if hasMoreToolCalls)
   │     ...
   │
   ├─► Inner loop ends (hasMoreToolCalls=false, pendingMessages=[])
   │
   ├─► onBeforeYield (line 1528)
   │
   ├─► 3. Outer drain (line 1538)
   │     lateSteering + asideMessages + followUpMessages
   │     Purpose: capture "everything background pushed at the moment agent decided to stop"
   │
   ├─► If messages → pendingMessages = [...], continue to inner turn 1
   │
   └─► Truly done
```

**Why not a single poll point?**

- Start poll too early: model hasn't run, user just typed → correct
- Mid-batch poll too late: sees steering after tools done → but still faster than next manual prompt
- Outer drain latest: agent already "decided to stop" → correct timing for asides/follow-ups (they shouldn't force extra turn)

Three points cover "waiting", "working", "stop boundary" — each with distinct semantics.

---

## Pause Gate: Process-Wide Freeze Switch

`pause.ts` (107 lines) defines `AgentPauseGate`, checked at inner loop line 1:

```typescript
if (agentPauseGate.paused) await agentPauseGate.waitUntilResumed(signal);
```

**Design details**:

- **Process-wide singleton**: `export const agentPauseGate = new AgentPauseGate()` (line 107), shared by main session, in-process subagent, advisor
- **Two parking spots**: before model call (1142), before tool call (`executeToolCalls` internals) — ensures "already-started provider streams / tool executions complete" before freezing
- **Abort penetration**: `waitUntilResumed(signal)` returns immediately on `signal.aborted` **without releasing gate** (line 78). Cancelling this run doesn't require resuming the whole process; other agents stay frozen
- **Epoch tracking**: `pausedAt` records pause start, `resume()` returns pause duration (ms)

Cleaner than scattering `if (paused) await ...` throughout the loop — gate logic concentrated in 107 lines, loop just two lines of invocation.

---

## Soft Tool Requirement: Cross-Turn "Force Model to Call Specific Tool"

Host (e.g., TUI) mechanism: `getToolChoice` returns `SoftToolRequirement`, demanding model **must** call a specific tool next turn (e.g., `read` to confirm file exists).

```typescript
// line 1166-1190
if (!directiveResolvedForTurn) {
  const directive = config.getToolChoice?.();
  const softReq = isSoftToolRequirement(directive) ? directive : undefined;
  // ...
  directiveResolvedForTurn = true;
}
```

**Cross-turn state management**:

- `softRequirementState` (line 1052) **host-owned**, lives until next logical turn boundary (outer while truly breaks)
- Harmony retry `continue` (1295) does **not** reset `directiveResolvedForTurn` — same turn retry won't re-escalate
- Normal turn end (`emitTurnEnd` then `directiveResolvedForTurn = false`, line 1312), next turn re-resolves
- Escalation counter `softRequirementState.escalations` max 3 (`MAX_SOFT_TOOL_ESCALATIONS`), then throws

Solves "model ignores hint, keeps calling other tools" without fully stripping autonomy like hard tool choice.

---

## Harmony Leak & GPT-5 Special Handling

GPT-5 Harmony format leaks thinking content (`analysis` channel) during streaming. omp detects in `streamAssistantResponse`, throws `HarmonyLeakInterruption`:

```typescript
// line 1269-1296
catch (err) {
  if (!(err instanceof HarmonyLeakInterruption)) throw err;
  if (err.recovered) {
    // truncate-resume: chop leak, reassemble message, continue
    if (harmonyTruncateResumeCount >= 2) throw ...;
    harmonyTruncateResumeCount++;
    recovered = err.recovered;
    // ...
  } else {
    // abort-retry: redo entire turn
    if (harmonyRetryAttempt >= 2) throw ...;
    harmonyRetryAttempt++;
    continue; // ← back to inner loop start, directiveResolvedForTurn stays true
  }
}
```

- **Abort-retry** (max 2): full turn redo, `harmonyRetryAttempt` counts, **does not** reset `directiveResolvedForTurn` (soft requirement not re-escalated)
- **Truncate-resume** (max 2): chops leak segment, reassembles message, treats as normal turn end, `harmonyTruncateResumeCount` counts, **resets** `harmonyRetryAttempt = 0`

Two independent paths, separate counters, no interference, both handled via `continue` inside inner loop — outer loop unaware.

---

## Lessons Learned

1. **Double while isn't for show** — separates "core rhythm" from "stop-boundary side-effect collection", each layer owns one concern
2. **Three steering polls aren't redundant** — start, mid-batch, outer drain map to "waiting", "working", "stop boundary" with different priorities
3. **Process-wide pause gate factored well** — 107 lines solves all agents' freezing, loop just two invocation lines
4. **Cross-turn state needs clear owner & lifecycle** — `softRequirementState` host-owned, `harmonyRetryAttempt` loop-owned, `directiveResolvedForTurn` per-turn; mixing causes chaos
5. **Abort safety at every poll point** — `signal?.aborted ? [] : await getX()` pattern repeats 6 times, each preventing queue messages stranded in dying run

---

## References

- `packages/agent/src/agent-loop.ts` — `runLoopBody` (1025–1563), `runLoop` (934–971), `streamAssistantResponse` (1642–1898)
- `packages/agent/src/pause.ts` — `AgentPauseGate`, `agentPauseGate` singleton
- `packages/agent/src/types.ts` — `AgentLoopConfig` (`getSteeringMessages`, `getAsideMessages`, `getFollowUpMessages`, `onBeforeYield`, `syncContextBeforeModelCall`, `beforeModelCall`, `getToolChoice`, `onTurnEnd`)
- `packages/agent/src/agent.ts` — `Agent` class wrapping `runLoop`, `prompt`, `abort`

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 1. Next: Append-only context: why sync conversation by byte-stable prefix? (forthcoming)*