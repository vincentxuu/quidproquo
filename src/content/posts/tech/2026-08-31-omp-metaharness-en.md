---
title: "OMP Internals (14): metaharness & Benchmark Infrastructure"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, coding-agent, benchmark, metaharness, vibemon, typescript-edit-benchmark, stats]
lang: en
description: "Deep dive into why OMP built its own benchmark harness: experiment→run→trace three-layer model, Vibemon microVM isolation, auth gateway routing, SQLite local persistence, local observability dashboard."
tldr: "OMP's metaharness isn't just a benchmark runner—it's experiment-grade infrastructure for hardware-isolated microVMs, unified auth gateway, and baseline-controlled experimental design."
series:
  name: "OMP Internals Deep Dive"
  order: 14
---

## TL;DR

OMP's benchmark infrastructure consists of three packages:

| Package | Role | Key Capabilities |
|---------|------|------------------|
| `metaharness` | Core harness | **Experiment→run→trace three-layer model**, Vibemon microVM hardware isolation, per-trial auth gateway rewrite, SQLite persistence, REST + SSE dashboard |
| `typescript-edit-benchmark` | Edit-task benchmark | Input/expected dual-dir fixtures, Post-format comparison, blank-line tolerance (code) vs. strict (Markdown/YAML), indent score measurement |
| `stats` | Local observability | `omp stats` launches local dashboard, parses session JSONL into SQLite, multi-dimensional aggregation (token/cost/error rate/model/folder/provider) |

**Why not existing frameworks?** Because coding agent benchmarks need: **identical hardware-isolated environments, unified auth gateway routing, baseline-controlled experimental design**—capabilities that neither CI/CD pipelines nor general LLM benchmark harnesses (LM Evaluation Harness, HELM) provide natively.

---

## Context

OMP (oh-my-pi) is a locally-running coding agent supporting multiple models, providers, and tool-calling modes. To iteratively improve agent capabilities (edit success rate, tool-calling accuracy, token efficiency, cost control), the team needed **repeatable, comparable, auditable** benchmark infrastructure.

Gaps in existing solutions:

- **LM Evaluation Harness / HELM**: Target single-turn QA, multiple-choice, generation tasks; don't support "multi-turn tool calls, file writes, test runs in isolated microVMs" coding agent workflows.
- **SWE-bench / Terminal-Bench official runners**: Single task, single model only; lack **experiment/arm comparison**, **baseline management**, **cost/token tracking**, **local dashboard**.
- **CI/CD pipelines**: Designed for deployment, unsuitable for "run 50 tasks × 7 models × 3 attempts, watch live pass-rate projections, cancel/resume/retry individual trials mid-run."

OMP therefore built `metaharness`, extended with `typescript-edit-benchmark` (edit-focused) and `stats` (local observability).

---

## Problem

The core problem decomposes into four layers:

1. **Environment isolation**: Each trial must run in a clean, resource-constrained, reproducible environment—no leftover files, processes, or network state from previous trials.
2. **Auth & model routing isolation**: Different trials may use different models, providers, OpenRouter variants (floor/nitro/exacto...); tokens must not mix, API keys must not leak to guests.
3. **Experimental design**: Define "baseline (n4p2) vs. variant (n4p2-rewrite)", auto-inherit identical task samples, support `-fix`/`-backfill` retries with result merging, view **calibrated pass-rate projections** (difficulty-adjusted final pass rate estimates) mid-run.
4. **Observability**: Local, zero-external-dependency, no-account-needed dashboard showing token consumption, cost estimates, error distributions, model/folder/provider trend charts.

---

## Attempts

### Attempt 1: Terminal-Bench official runner

```bash
tb run --task adaptive-rejection-sampler --model openrouter/anthropic/claude-3.5-sonnet
```

**Issues**: Single task, single model, stateless, no comparison, no cost tracking, no dashboard. Running 50 tasks × 7 models × 3 attempts requires custom scripts for concurrency, result storage, comparison.

### Attempt 2: GitHub Actions matrix

**Issues**: Expensive minutes, slow cold starts, no live progress, can't cancel individual trials, artifacts need post-processing for comparison.

### Attempt 3: Custom Python wrapper around Docker

```python
# pseudocode
for model in models:
    for task in tasks:
        container = docker.run(image, env={"MODEL": model})
        result = container.exec("omp --prompt ...")
        save_result(model, task, result)
```

**Issues**:
- Docker ≠ true hardware isolation (shared kernel, escapable)
- No precise CPU/memory/disk quota control
- How does auth gateway enter container? Each trial needs rewritten `models.yml` + tunnel
- No "experiment/arm" concept; baseline comparison requires custom SQL

---

## Solution: metaharness Three-Layer Model + Vibemon microVM + Local Full-Stack

### 1. Experiment → Run → Trace Three-Layer Model

`packages/metaharness/src/experiments.ts#L58-L68` defines the core layering:

```typescript
// Experiment id = first `-`-delimited token of job name
// e.g. "sb2-n8", "sb2-gemini" → experiment "sb2"
export function experimentOf(jobName: string): string {
  const dash = jobName.indexOf("-");
  return dash > 0 ? jobName.slice(0, dash) : jobName;
}

// Arm label = job name minus experiment prefix
// "sb2-n8" → "n8", "sb2-gemini" → "gemini"
export function armOf(jobName: string): string { ... }
```

**RunRow** (`packages/metaharness/src/store.ts`) records one benchmark execution's metadata:

```typescript
interface RunRow {
  jobName: string;           // "sb2-n8"
  benchmark: "harbor" | "edit" | "snapcompact";
  dataset: string;           // "terminal-bench@2.0"
  models: string;            // "openrouter/anthropic/claude-3.5-sonnet"
  nTotal: number;            // Total tasks
  done: number;              // Completed trials
  pass: number;              // Passed
  fail: number;              // Failed (verifier reward < 1)
  error: number;             // Infra errors (agent produced zero turns)
  costUsd: number;           // Cumulative cost
  status: "running" | "complete" | "cancelled" | "failed";
  role: "baseline" | "variant" | "";  // Key: marks baseline for dashboard sorting
  prewalk: string | null;    // JSON: prewalk model + trigger conditions
  config: object;            // Full launch request provenance
}
```

**TraceRow** maps to a single trial (one task attempt):

```typescript
interface TraceRow {
  jobName: string;
  task: string;              // "adaptive-rejection-sampler"
  attempt: number;
  status: "pass" | "fail" | "error" | "running";
  reward: number | null;     // Verifier output 0..1
  costUsd: number;
  durationMs: number;
  tracePath: string;         // Relative artifact path
  updatedAt: number;
}
```

**Key design**: `pickMergedTrials` (`experiments.ts#L265-L278`) merges `-fix`/`-backfill`/`-retry` retries into the same task:
- Reward-decided (pass/fail) always beats undecided (error/running)
- Same class: latest `updatedAt` wins
- Baseline runs once; variants only re-run errored tasks with `-fix`, results auto-merge

### 2. Vibemon microVM: Hardware-Level Isolation

`packages/metaharness/src/tb/vmon.ts#L172-L338` `TrialVm` wraps the Vibemon SDK:

```typescript
// Launch a KVM/HVF microVM running the specified OCI image
static async start(opts: {
  config: VmonConfig;        // vmond URL + token + arch
  image: string;             // Task-specified docker image
  name: string;              // "tb-adaptive-rejection-sampler-a1b2c3"
  cpus: number;              // From task.toml [environment].cpus
  memoryMb: number;          // [environment].memory_mb
  storageMb: number;         // [environment].storage_mb
  timeoutSec: number;
  env: Record<string, string>;
}): Promise<TrialVm>
```

**Why not Docker?**
- Vibemon uses **KVM/HVF (macOS)** to launch true microVMs with independent kernel, init, network stack
- CPU/memory/disk quotas enforced at **hypervisor level**, not cgroups
- `block_network: false` + `allow_host_gateway: true` restricts guest egress to host gateway only (see next section)

Each trial gets a **fresh microVM**, destroyed via `vm.rm()` on completion—zero residue.

### 3. Auth Gateway: Per-Trial Model Routing

This is metaharness's most distinctive design. `packages/metaharness/src/tb/trial.ts#L131-L134`:

```typescript
// 1. Establish host gateway tunnel to guest
const gatewayUrl = await beforeDeadline(vm.startGateway(opts.gateway.url));

// 2. Install omp binary, write gateway-only config
const entrypoint = await beforeDeadline(installAgent(vm, opts.binaries, { 
  ...opts.gateway, 
  url: gatewayUrl  // ← Guest-visible tunnel endpoint
}));
```

`installAgent` (`packages/metaharness/src/tb/agent.ts#L89-L126`) writes `~/.omp/agent/models.yml` in guest:

```yaml
# Generated by metaharness — auth via host pm2 gateway.
providers:
  openrouter:
    baseUrl: http://10.0.2.2:4000   # Guest-visible tunnel endpoint
    auth: oauth
    transport: pi-native
    apiKey: "vmon-gateway-token-xyz"  # Short-lived bearer token
```

**Key points**:
- Host runs `omp auth-gateway` (pm2-managed) on `127.0.0.1:4000`
- Each trial's microVM builds a tunnel via Vibemon `hostGateway`; **guest sees isolated localhost endpoint**
- Gateway does **provider-level routing** based on `providers` list, supports OpenRouter variants (`floor`/`nitro`/`exacto`/`online`/`default`)
- **API keys never enter guest**—guest only holds short-lived gateway token; real provider keys stay on host

This solves "multiple models, providers, variants running simultaneously with precise token/cost attribution."

### 4. runTrial: Complete Trial Lifecycle

`packages/metaharness/src/tb/trial.ts#L61-L307` is the core execution flow:

```typescript
export async function runTrial(opts: {
  task: TbTask;              // Parsed task.toml + instruction.md
  model: string;             // "openrouter/anthropic/claude-3.5-sonnet"
  binaries: AgentBinaries;   // Prebuilt omp linux binaries
  gateway: GatewayConfig;    // Host gateway URL + token + providers
  vmon: VmonConfig;          // vmond connection info
  trialDir: string;          // Artifact output directory
}): Promise<TrialResult>
```

Flow diagram:

```
runTrial
├── 1. Launch microVM (TrialVm.start)
│   └── Vibemon sandboxes.create({image, cpus, memory, disk, arch, allow_host_gateway})
├── 2. Create host gateway tunnel (vm.startGateway)
├── 3. Install omp binary + write gateway config (installAgent)
├── 4. Connect RpcClient to guest omp (RpcClient + vibmon exec transport)
├── 5. Agent execution phase
│   ├── client.start() → client.prompt(task.instruction)
│   ├── waitForIdle(agentTimeout) or timeout → agentTimedOut
│   ├── Collect usage (input/output/cacheRead/cacheWrite/cost/turns)
│   └── Save transcript.json
├── 6. Calibrate guest time (prevent agent clock tampering from poisoning verifier networking)
├── 7. Verifier execution phase
│   ├── Copy tests/ to guest
│   ├── chmod +x /tests/test.sh
│   ├── Run verifier, capture stdout/stderr
│   └── Read /logs/verifier/reward.txt (0..1)
├── 8. Determine TrialResult
│   ├── reward === null → "error" (verifier produced no reward)
│   ├── reward >= 1 → "pass"
│   ├── reward < 1 → "fail"
│   └── agentCollectionError && turns === 0 → "error" (harness failure, not model failure)
└── 9. Cleanup: vm.rm(), client.stop()
```

**Notable details**:
- `deadline` mechanism (`trial.ts#L81-L110`): Hard trial deadline, auto `vm.rm()` + `client.stop()` on timeout—no hangs
- `agentTimedOut` distinction: agent times out but verifier still runs, reward still counted
- `error` status = **harness/infra failure only**, excluded from model pass rate
- All artifacts (transcript, verifier stdout, ctrf.json) written to `trialDir` for full reproducibility

### 5. CLI Scheduler: Concurrency + Epochs + Budget

`packages/metaharness/src/tb/cli.ts#L380-L454` implements production-grade scheduling:

```typescript
// Semaphore controls concurrency
const semaphore = new Semaphore(config.concurrency);

await Promise.all(work.map(async item => {
  await semaphore.acquire();
  try {
    // Budget check: stop scheduling new trials if epoch spend exceeds limit
    if (config.budget !== null && store.epochSpend(epoch) >= config.budget) ...
    
    const result = await runTrial({...});
    store.insertTrial(trialRow(...));
    completed++;
    console.log(`[e${epoch} ${completed}/${total}] ${result.status} ...`);
  } finally {
    semaphore.release();
  }
}));

// Epoch mechanism: same task set runs multiple rounds, each independently summarized
store.finishEpoch(epoch);
printSummary(epoch, store.epochSummary(epoch), store.overallSummary());
if (config.forever) epoch = store.beginEpoch();
```

**Epoch** design enables:
- Multi-round experiments (e.g., daily runs tracking model drift)
- `resumeEpoch()` continues from incomplete epoch
- `overallSummary()` accumulates stats across all epochs

### 6. SQLite Store: Local Persistence + Live Queries

`packages/metaharness/src/tb/store.ts#L20-L174`:

```sql
CREATE TABLE trials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  epoch INTEGER NOT NULL,
  model TEXT NOT NULL,
  task TEXT NOT NULL,
  attempt INTEGER NOT NULL,
  status TEXT NOT NULL,        -- pass/fail/error
  reward REAL,                 -- 0..1
  agent_timed_out INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cache_read_tokens INTEGER,
  cache_write_tokens INTEGER,
  cost_usd REAL,
  turns INTEGER,
  agent_ms INTEGER,
  verifier_ms INTEGER,
  wall_ms INTEGER,
  error TEXT,
  trial_dir TEXT NOT NULL,     -- Relative artifact path
  started_at INTEGER,
  finished_at INTEGER,
  UNIQUE(epoch, model, task, attempt)
);
```

- `ON CONFLICT ... DO UPDATE` supports resumable runs, retry overwrites
- `epochSummary()` / `overallSummary()` use direct SQL aggregation—**no full-table memory loading**
- WAL mode + busy_timeout = multi-process concurrency safety

### 7. Server + Dashboard: REST + SSE + Embedded React

`packages/metaharness/src/server.ts` runs everything in one Bun process:

- **API**: `/api/experiments`, `/api/runs`, `/api/events` (SSE), `/api/runs/:name/traces/:trace`
- **Dashboard**: Embedded React + TSX (`web/index.html`), HMR in dev, Bun-bundled in prod
- **Managed children**: `launch()` / `resume()` / `cancel()` manage runner subprocesses, `detached: true` ensures manager restarts don't kill running trials

**Experiment Detail API** (`experiments.ts#L280-L374`) returns:

```typescript
interface ExperimentDetail {
  id: string;
  goal: string;
  arms: ArmSummary[];           // Per-arm stats + projections
  tasks: string[];              // Union of all tasks
  matrix: Record<string,        // arm → task → {status, reward}
    Record<string, { status: string; reward: number | null }>
  >;
}
```

**Calibrated pass rate projection** (`experiments.ts#L147-L190`) is a highlight:

> Naive extrapolation (project observed pass% directly) overestimates when early tasks are easier.  
> Uses **Rasch-style difficulty calibration**:
> 1. Task difficulty = sibling arms' smoothed pass rate `p_t = (passes+1)/(n+2)`
> 2. Arm skill = single log-odds shift `b`, moment-matched so Σ σ(logit(p_t)+b) = actual passes
> 3. Projection = apply σ(logit(p_t)+b) to remaining tasks; tasks without sibling signal use mean difficulty

This makes "mid-run final pass rate projection" credible.

---

## typescript-edit-benchmark: Micro-Benchmark for Edit Tasks

`packages/typescript-edit-benchmark/` targets "given a prompt, edit a set of files" tasks.

### Fixture Structure

```
fixtures/
  add-type-annotation/
    prompt.md           # "Add type annotations to this function"
    input/
      utils.ts          # Source code
    expected/
      utils.ts          # Expected result
    metadata.json       # { "file_path": "utils.ts", "mutation_type": "type-annotation", ... }
```

`tasks.ts#L64-L107` `loadTasksFromDir` auto-discovers and loads.

### Verification: Post-Format Comparison + Semantic Blank-Line Handling

`verify.ts#L81-L183` core logic:

```typescript
// 1. Read expected + actual
// 2. Prettier-format both
// 3. Comparison strategy:
//    - Code: compare after stripBlankLines (blank count irrelevant)
//    - Markdown/YAML: exact post-format comparison (blanks semantic)
const formattedEquivalent = blankLineSensitive(file)
  ? expectedFormatted === actualFormatted
  : stripBlankLines(expectedFormatted) === stripBlankLines(actualFormatted);
```

**Indent score** (`verify.ts#L149-L150`, `#L202-L240`) measures "how far agent's raw output indentation is from formatted":

```typescript
// diffLines agent raw output vs formatted output
// Average indent distance of corresponding lines
function computeIndentDistanceForDiff(expected: string, actual: string): number
```

This quantifies "edit correct but formatting messy."

---

## stats: Local Observability Dashboard (`omp stats`)

`packages/stats/` is a **zero-dependency, zero-account, local-first** observability stack.

### Data Flow

```
~/.omp/sessions/*.jsonl  (session logs)
    ↓ syncAllSessions()  (incremental parse, file_offsets tracks position)
SQLite (messages, user_messages, tool_calls, file_offsets, meta)
    ↓ SQL aggregation
REST API (/api/stats, /api/stats/model-dashboard, /api/stats/tools, ...)
    ↓
React Dashboard (embedded client bundle)
```

### Core Capabilities

| Endpoint | Purpose |
|----------|---------|
| `/api/stats` | Overall summary: requests, error rate, tokens, cache rate, cost estimate, premium requests |
| `/api/stats/model-dashboard` | Per-model: requests, cost, cache rate, tokens/s, TTFT |
| `/api/stats/tools` | Tool call stats: calls per tool, error rate, args/result sizes |
| `/api/stats/providers` | Per-provider: token burn, hourly heatmap |
| `/api/stats/gain` | **Gain analysis**: subagent/advisor vs main agent token allocation |
| `/api/sync` | Manual incremental sync trigger |

### Key Engineering Details

**Fork deduplication** (`db.ts#L524-L591`): `SessionManager.fork()` deep-copies parent session entries to new JSONL (same `entry_id`, `timestamp`, `responseId`). Uses `WHERE NOT EXISTS (SELECT 1 WHERE entry_id=? AND timestamp=? AND session_file<>?)` to ensure **same request across session_files counts once**.

**Cost backfill mechanism** (`db.ts#L423-L481`): Historical data may lack `cost_*` columns, or subscription models (Grok) missed `orchestration` tokens. `backfillMissingCatalogCosts`, `backfillReingestCosts`, `backfillNoCacheInputCosts` use meta sentinels (`messages_cost_reingest_v1`, etc.) for **one-time full recomputation** without disrupting incremental sync.

**Embedded client bundle** (`server.ts#L34-L48`, `#L50-L102`): Compiled binary / npm bundle **has no dashboard sources**; build-time gzips `dist/client` into archive embedded in binary. At runtime, extracts to temp dir and serves. Single binary → `omp stats` launches full dashboard.

---

## Why Not Existing Frameworks?

| Requirement | Existing Solutions | metaharness Approach |
|-------------|-------------------|---------------------|
| Hardware-isolated trial env | Docker (shared kernel) | **Vibemon KVM/HVF microVM** |
| Per-trial model routing + auth isolation | Env vars / shared proxy | **Host gateway + per-trial tunnel + short-lived tokens** |
| Experiment/arm comparison + baseline mgmt | Custom scripts / spreadsheets | **Three-layer model + canonical arm merge + calibrated projection** |
| Resumable + budget control + epochs | CI/CD pipelines | **SQLite + Semaphore + epoch + in-scheduler budget check** |
| Local observability (no external deps) | Grafana / Datadog / Langfuse | **SQLite + embedded React dashboard, single binary runs everywhere** |
| Coding-agent-specific metrics (edit success, tool calls, turns) | General LLM benchmarks | **typescript-edit-benchmark + harbor verifier + full trace recording** |

---

## Lessons Learned

1. **Benchmark infrastructure is fundamentally an experiment management system**, not a test runner. Experiment/arm/trace layers, baseline/variant roles, calibrated projection, retry merging—these are standard experimental science practices, and applying them to coding agent evaluation works remarkably well.

2. **Hardware isolation is non-negotiable**. Docker seems convenient, but shared kernel means leftover processes, file locks, port conflicts contaminate results. Vibemon microVMs start slower (~3-5s), but **clean-environment result credibility** far outweighs startup cost.

3. **Auth gateway design is pivotal**. Concentrating "model routing, auth, metering" on host, giving guests only tunnel endpoints + short-lived tokens. This simultaneously solves: API key security, provider routing, variant switching, precise cost attribution.

4. **Local-first observability transforms dev loops**. `omp stats` zero-config, zero-account, offline-capable, embedded in binary—developers stay in terminal, no SaaS signup, no data egress concerns, instant token burn / error distribution / model comparison views. This "runs on my machine" experience beats any cloud dashboard for daily use.

5. **SQLite + WAL + proper indexes handles millions of trials**. Neither metaharness's `trials` nor stats' `messages` tables needed PostgreSQL. Single-file, zero-ops, embedded, concurrent-read-safe—with `PRAGMA busy_timeout=5000` and `journal_mode=WAL`, production running for months with zero corruption.

---

## References

- [metaharness: tb/types.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/types.ts) — Shared contract definitions
- [metaharness: tb/trial.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/trial.ts) — Complete trial lifecycle
- [metaharness: tb/vmon.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/vmon.ts) — Vibemon microVM wrapper
- [metaharness: tb/agent.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/agent.ts) — omp binary build + gateway config injection
- [metaharness: tb/store.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/store.ts) — SQLite schema & aggregation queries
- [metaharness: tb/cli.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/cli.ts) — Scheduler: concurrency/epoch/budget
- [metaharness: experiments.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/experiments.ts) — Experiment/arm model, calibrated projection, retry merging
- [metaharness: server.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/server.ts) — REST + SSE + Dashboard + Managed children
- [typescript-edit-benchmark: verify.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/typescript-edit-benchmark/src/verify.ts) — Post-format comparison, blank-line semantics, indent score
- [stats: db.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/stats/src/db.ts) — SQLite schema, fork deduplication, cost backfill, embedded client
- [stats: server.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/stats/src/server.ts) — REST API, port conflict recovery, embedded client serving
- [Vibemon SDK](https://github.com/stencil-hq/vibemon) — KVM/HVF microVM SDK
- [Terminal-Bench 2.x](https://github.com/harbor-framework/terminal-bench-2-1) — Task dataset format