---
title: "Sandbox Lifecycle Management: Pause, Resume, Snapshot, Hibernation"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, lifecycle, pause, resume, snapshot, hibernation, ai-agent]
lang: en
tldr: "The business post (order 28) of the Sandbox Series. Sandbox lifecycle management: pause/resume, snapshot/hibernation, resume concepts, implementation, and applicable scenarios for long-running tasks."
description: "Sandbox lifecycle management: pause/resume, snapshot/hibernation, long-running task scenarios, and cost optimization."
series:
  name: "Sandbox Series"
  order: 29
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-30-sandbox-lifecycle)

## What This Post Is

This post is the "business" post (order 28) of the Sandbox Series, also serving as the series appendix. It focuses on **sandbox lifecycle management**:

1. **Pause & Resume** — Release compute resources, retain state
2. **Snapshot** — Point-in-time state copy, create new sandbox
3. **Hibernation** — Long-term idle, zero compute cost state retention
4. **Long-running task scenarios** — When lifecycle management is needed
5. **Cost optimization** — Reducing costs through lifecycle management

---

## Lifecycle Stages

The complete sandbox lifecycle has six stages:

| Stage | Description | Resource Usage |
|-------|-------------|----------------|
| Create | Start sandbox from image | Full |
| Execute | Run agent code | Full |
| Pause | Release CPU, retain memory & process | Medium (memory) |
| Snapshot | Create state checkpoint | Low (storage) |
| Hibernate | Long-term idle, zero compute cost | Very low (storage) |
| Destroy | Release all resources | Zero |

```
Create → Execute → [Pause ↔ Resume] → [Snapshot → Create from snapshot] → [Hibernate → Wake] → Destroy
```

---

## Pause & Resume

### Concept

Pause temporarily freezes sandbox execution, releases CPU resources, but retains memory and process state. Resume continues execution from the paused state.

### Applicable Scenarios

- **Interactive agent workflows**: User-agent back-and-forth conversation, sandbox can pause between messages
- **Long tasks waiting for input**: Task waiting for external input, sandbox can pause during wait
- **Cost optimization**: No CPU charges during idle periods

### Implementation Differences

| Provider | Pause/Resume API | Resume Speed | Retained Content |
|----------|------------------|--------------|------------------|
| E2B | pause/resume API | ~1 second | Memory + process + files |
| Modal | Memory snapshot (no pause API) | Depends on image | Memory + process + files (expires in 7 days) |
| Vercel | Automatic snapshot on stop (persistent by default) | New session boots from snapshot | Files (memory rebuilt) |
| Cloudflare | SDK 1.0 snapshot before shutdown | New instance starts from snapshot | Files (memory rebuilt) |
| Azure Container Apps | auto-suspend / resume | Under 1 second (official) | Memory mode: memory + process + files; Disk mode: files |

### Caveats

- **Memory retention cost**: Memory still occupies resources during pause; some providers charge by memory size
- **Network disconnection**: Network connections drop during pause, need to reconnect after resume
- **External dependency expiration**: Tokens, leases, locks may expire during pause

---

## Snapshot

### Concept

Snapshot is a point-in-time copy of sandbox state, used for creating new sandboxes, backup, and restore.

### Difference from Pause

| Feature | Pause | Snapshot |
|---------|-------|----------|
| Continue execution | Original sandbox continues | Create new sandbox |
| Memory state | Retained | Mostly not retained (Azure and Modal memory snapshots are exceptions) |
| Process state | Retained | Mostly not retained (same exceptions) |
| File state | Retained | Retained |
| Applicable scenario | Short interruption | Long-term storage, cross-sandbox sharing |

### When to Use

- **Create checkpoints**: Create snapshots before important task steps, rollback on failure
- **Cross-sandbox sharing**: Copy one sandbox state to multiple new sandboxes
- **Long-term storage**: When pause cost is too high, convert to snapshot storage

---

## Hibernation

### Concept

Hibernation is a long-term idle state where the complete sandbox state (including memory) is stored to storage media, compute resources fully released, compute cost reduced to near zero.

### Applicable Scenarios

- **Long-term idle**: Sandbox not used for days or weeks
- **Cost-sensitive**: Zero compute cost state retention
- **Periodic workflows**: Agent workflows running weekly or monthly

### Implementation Differences

| Provider | Hibernation Support | Retention Time | Wake Speed |
|----------|---------------------|----------------|------------|
| Modal | Memory snapshot | 7 days | Depends on image |
| E2B | Yes | Unlimited | Seconds |
| Blaxel | Yes (standby) | Unlimited | 25 ms |
| Azure Container Apps | Yes (auto-suspend) | Set by auto-delete days | Under 1 second (official) |
| Freestyle | Yes | Unlimited | Seconds |

---

## Long-Running Task Scenarios

Sandbox lifecycle management is especially suitable for the following long-running task scenarios:

### Scenario 1: Multi-step Agent Workflow

```
Step 1: Analyze data (sandbox executes)
    ↓ Pause
Wait for user confirmation
    ↓ Resume
Step 2: Generate report (sandbox continues executing)
```

### Scenario 2: Parallel Evaluation

Create multiple snapshots from the same baseline state, launch multiple parallel evaluation sandboxes, compare different agent performance.

### Scenario 3: Long Training & Evaluation

ML model training or evaluation may take hours or days; sandbox can pause and resume during the process, avoiding restart from scratch after interruption.

---

## Cost Optimization Strategies

| Strategy | Description | Applicable Scenario |
|----------|-------------|---------------------|
| Auto-pause on idle | Sandbox auto-pauses after no activity | Interactive agents |
| Periodic snapshots | Periodic snapshots of important state, avoid recomputation | Long tasks |
| Hibernate long idle | Hibernate when not used for long period | Periodic workflows |
| Destroy on task completion | Destroy sandbox immediately after task completion | Short-lived tasks |
| Choose right billing model | Bursty → active-CPU, Long-running → wall-clock | All scenarios |

---

## What You Should Understand After Reading

1. Six sandbox lifecycle stages: create, execute, pause, snapshot, hibernate, destroy.
2. Difference between pause and snapshot, and applicable scenarios for each.
3. Hibernation concept and implementation differences (provider support varies).
5. Three long-running task scenarios: multi-step workflow, parallel evaluation, long training.
6. Five cost optimization strategies: auto-pause on idle, periodic snapshots, hibernate long idle, destroy on task completion, choose right billing model.

---

## Update Log

- 2026-11-23: Updated the pause and hibernation tables from each vendor's docs: Modal has no pause API, so it now lists memory snapshots (7-day expiry); Vercel now snapshots automatically when a persistent sandbox stops; Cloudflare now reflects SDK 1.0 snapshots; Azure now lists auto-suspend in Memory and Disk modes; the claim that snapshots never keep memory now notes the Azure and Modal exceptions.

## References

- [Azure Container Apps Sandboxes Documentation](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [E2B Sandbox Persistence](https://e2b.dev/docs/sandbox/persistence)
- [Modal Sandbox Snapshots](https://modal.com/docs/guide/sandbox-snapshots)
- [Vercel Sandbox persistent sandboxes](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes)
- [Cloudflare Sandboxes: Lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/)
- [Azure Container Apps Sandboxes: Snapshots and state management](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [Blaxel Sub-second Sandbox Startup 2026](https://blaxel.ai/blog/sub-second-sandbox-startup-2026)
- [Beam: Best Stateful Sandboxes for Code Execution in 2026](https://www.beam.cloud/blog/best-stateful-sandbox-code-execution-2026)
- [Kubernetes-sigs/agent-sandbox: Guest Agent Proposal](https://github.com/kubernetes-sigs/agent-sandbox/issues/1237)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [本站：沙箱成本模型（order 26）](/posts/tech/2026-08-30-sandbox-cost-model-en)
