---
title: "OMP 內部設計導讀（14）：metaharness 與 benchmark 基礎設施"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, coding-agent, benchmark, metaharness, vibemon, typescript-edit-benchmark, stats]
lang: zh-TW
description: "深入解析 OMP 為什麼自製 benchmark harness：experiment→run→trace 三層模型、Vibemon microVM 隔離、auth gateway 路由、SQLite 本地儲存、ocal observability dashboard。"
tldr: "OMP 的 metaharness 不是單純跑分工具，而是為了在硬體隔離的 microVM 裡、統一 auth gateway、可對照 baseline 的實驗級基礎設施。"
series:
  name: "OMP 內部設計導讀"
  order: 14
---

## TL;DR

OMP 的 benchmark 基礎設施由三個 package 組成：

| Package | 角色 | 關鍵能力 |
|---------|------|----------|
| `metaharness` | 核心 harness | **experiment→run→trace 三層模型**、Vibemon microVM 硬體隔離、每 trial 重寫 auth gateway、SQLite 存證、REST + SSE dashboard |
| `typescript-edit-benchmark` | 編輯任務基準 | input/expected 雙目錄 fixture、Prettier 格式化後比對、空行容忍（代碼）vs. 嚴格（Markdown/YAML）、indent score 量測 |
| `stats` | 本地可觀測性 | `omp stats` 啟動本地 dashboard、解析 session JSONL 入 SQLite、token/成本/錯誤率/模型/資料夾/提供商多維聚合 |

**為什麼不直接用現成框架？** 因為 coding agent benchmark 的核心需求是：**同一個模型在完全相同的硬體隔離環境、統一的 auth gateway 路由、可對照 baseline 的實驗設計**——這些既不是 CI/CD pipeline，也不是通用 benchmark harness（如 LM Evaluation Harness、HELM）能原生提供的。

---

## 情境

OMP（oh-my-pi）是一個在本地跑的 coding agent，支援多模型、多提供商、多種工具呼叫模式。為了迭代改進 agent 能力（編輯成功率、工具呼叫正確率、token 效率、成本控制），團隊需要一套**可重複、可對照、可追溯**的 benchmark 基礎設施。

現成方案的缺口：

- **LM Evaluation Harness / HELM**：針對單輪 QA、多選題、生成任務；不支援「在隔離 microVM 裡跑多輪工具呼叫、寫檔案、跑測試」這類 coding agent 流程。
- **SWE-bench / Terminal-Bench 官方 runner**：只跑單一任務、單一模型；缺乏 **experiment/arm 對照**、**baseline 管理**、**成本/token 追蹤**、**本地 dashboard**。
- **CI/CD pipeline**：為了部署設計，不適合「同一組任務跑 7 個模型、每模型 3 次、要即時看 pass rate 投影、要能中途取消/續跑/重跑失敗 trial」。

OMP 因此自製了 `metaharness`，並延伸出 `typescript-edit-benchmark`（專注編輯任務）與 `stats`（本地可觀測性）。

---

## 問題

核心問題可拆解為四層：

1. **環境隔離**：每個 trial 必須在乾淨、資源受限、可重現的環境跑——不能讓上一個 trial 的殘留檔案、進程、網路狀態污染下一個。
2. **Auth 與模型路由隔離**：不同 trial 可能用不同模型、不同提供商、不同 OpenRouter variant（floor/nitro/exacto...）；不能讓 token 混算、不能讓 API key 洩漏給 guest。
3. **實驗設計**：要能定義「baseline（n4p2）vs. variant（n4p2-rewrite）」、自動繼承同一組 task sample、支援 `-fix`/`-backfill` 重跑並合併結果、跑著跑著能看 **calibrated pass rate 投影**（難度校準後的最終通過率預測）。
4. **可觀測性**：要在本地、無外部依賴、無帳號就能看到 token 消耗、成本估算、錯誤分佈、模型/資料夾/提供商維度的趨勢圖。

---

## 嘗試過程

### 嘗試 1：直接用 Terminal-Bench 官方 runner

```bash
tb run --task adaptive-rejection-sampler --model openrouter/anthropic/claude-3.5-sonnet
```

**問題**：單任務單模型、無狀態、無對照、無成本追蹤、無 dashboard。跑 50 個任務 × 7 模型 × 3 attempts 要手寫腳本、自己管並發、自己存結果。

### 嘗試 2：用 GitHub Actions matrix 跑 benchmark

**問題**：Actions 分鐘數貴、冷啟動慢、無法即時看進度、無法中途取消單一 trial、artifact 下載後還要二次處理才能對照。

### 嘗試 3：自己寫 Python 腳本包裝 Docker

```python
# 伪代码
for model in models:
    for task in tasks:
        container = docker.run(image, env={"MODEL": model})
        result = container.exec("omp --prompt ...")
        save_result(model, task, result)
```

**問題**：
- Docker 不是真正的硬體隔離（共享 kernel、可逃逸）
- 無法精確控制 CPU/memory/disk quota
- auth gateway 怎麼進 container？每個 trial 都要重寫 `models.yml`、建 tunnel
- 沒有「experiment/arm」概念，baseline 對照要自己寫 SQL

---

## 解法：metaharness 三層模型 + Vibemon microVM + 本地全棧

### 1. Experiment → Run → Trace 三層模型

`packages/metaharness/src/experiments.ts#L58-L68` 定義了核心分層：

```typescript
// Experiment id = job name 第一個 `-` 前的 token
// e.g. "sb2-n8"、"sb2-gemini" → experiment "sb2"
export function experimentOf(jobName: string): string {
  const dash = jobName.indexOf("-");
  return dash > 0 ? jobName.slice(0, dash) : jobName;
}

// Arm label = 去掉 experiment prefix
// "sb2-n8" → "n8"、"sb2-gemini" → "gemini"
export function armOf(jobName: string): string { ... }
```

**RunRow**（`packages/metaharness/src/store.ts`）記錄一次 benchmark 執行的元資料：

```typescript
interface RunRow {
  jobName: string;           // "sb2-n8"
  benchmark: "harbor" | "edit" | "snapcompact";
  dataset: string;           // "terminal-bench@2.0"
  models: string;            // "openrouter/anthropic/claude-3.5-sonnet"
  nTotal: number;            // 總任務數
  done: number;              // 已完成 trial 數
  pass: number;              // 通過數
  fail: number;              // 失敗數（verifier reward < 1）
  error: number;             // 基礎設施錯誤（agent 沒跑出任何 turn）
  costUsd: number;           // 累積成本
  status: "running" | "complete" | "cancelled" | "failed";
  role: "baseline" | "variant" | "";  // 關鍵：標記 baseline 供 dashboard 排序
  prewalk: string | null;    // JSON：prewalk 模型與觸發條件
  config: object;            // 原始 launch request 完整存證
}
```

**TraceRow** 對應單一 trial（一個 task 的一次嘗試）：

```typescript
interface TraceRow {
  jobName: string;
  task: string;              // "adaptive-rejection-sampler"
  attempt: number;
  status: "pass" | "fail" | "error" | "running";
  reward: number | null;     // verifier 產出的 0..1
  costUsd: number;
  durationMs: number;
  tracePath: string;         // artifact 相對路徑
  updatedAt: number;
}
```

**關鍵設計**：`pickMergedTrials`（`experiments.ts#L265-L278`）把 `-fix`/`-backfill`/`-retry` 重跑的 trial **合併到同一個 task**，規則是：
- 有 reward 決定的（pass/fail）永遠贏過未決定的（error/running）
- 同等級取 `updatedAt` 較新者
- 這樣 baseline 跑完後，variant 只需針對 error 任務加 `-fix` 重跑，結果自動合併

### 2. Vibemon microVM：硬體級隔離

`packages/metaharness/src/tb/vmon.ts#L172-L338` 的 `TrialVm` 類別封裝了 Vibemon SDK：

```typescript
// 啟動一個 KVM/HVF microVM，跑指定 OCI image
static async start(opts: {
  config: VmonConfig;        // vmond URL + token + arch
  image: string;             // 任務指定的 docker image
  name: string;              // "tb-adaptive-rejection-sampler-a1b2c3"
  cpus: number;              // 來自 task.toml [environment].cpus
  memoryMb: number;          // [environment].memory_mb
  storageMb: number;         // [environment].storage_mb
  timeoutSec: number;
  env: Record<string, string>;
}): Promise<TrialVm>
```

**為什麼不用 Docker？**
- Vibemon 用 **KVM/HVF（macOS）** 啟動真正的 microVM，有獨立 kernel、獨立 init、獨立網路堆疊
- CPU/memory/disk quota 是 **hypervisor 層級** 強制，不是 cgroup
- `block_network: false` + `allow_host_gateway: true` 讓 guest 只能通過 host gateway 連外網（見下節）

每個 trial **獨立一個 microVM**，跑完 `vm.rm()` 徹底銷毀，零殘留。

### 3. Auth Gateway：每個 trial 獨立的模型路由

這是 metaharness 最獨特的設計。`packages/metaharness/src/tb/trial.ts#L131-L134`：

```typescript
// 1. 啟動 host gateway tunnel 到 guest
const gatewayUrl = await beforeDeadline(vm.startGateway(opts.gateway.url));

// 2. 安裝 omp binary，寫入 gateway-only config
const entrypoint = await beforeDeadline(installAgent(vm, opts.binaries, { 
  ...opts.gateway, 
  url: gatewayUrl  // ← 這是 guest 可見的 tunnel endpoint
}));
```

`installAgent`（`packages/metaharness/src/tb/agent.ts#L89-L126`）在 guest 寫入 `~/.omp/agent/models.yml`：

```yaml
# Generated by metaharness — auth via host pm2 gateway.
providers:
  openrouter:
    baseUrl: http://10.0.2.2:4000   # guest 看到的 tunnel endpoint
    auth: oauth
    transport: pi-native
    apiKey: "vmon-gateway-token-xyz"  # 短時效 bearer token
```

**關鍵點**：
- Host 跑 `omp auth-gateway`（pm2 管理），綁定 `127.0.0.1:4000`
- 每個 trial 的 microVM 通過 Vibemon `hostGateway` 建 tunnel，**guest 看到的是獨立的 localhost endpoint**
- Gateway 根據 `providers` 列表做 **provider-level routing**，支援 OpenRouter variant（`floor`/`nitro`/`exacto`/`online`/`default`）
- **API key 永不進 guest**——guest 只拿短時效 gateway token，真正的 provider key 留在 host

這解決了「多模型、多提供商、多 variant 同時跑、token 成本精確歸屬」的問題。

### 4. runTrial：一個 trial 的完整生命週期

`packages/metaharness/src/tb/trial.ts#L61-L307` 是核心執行流程：

```typescript
export async function runTrial(opts: {
  task: TbTask;              // 解析後的 task.toml + instruction.md
  model: string;             // "openrouter/anthropic/claude-3.5-sonnet"
  binaries: AgentBinaries;   // 預建好的 omp linux binary
  gateway: GatewayConfig;    // host gateway URL + token + providers
  vmon: VmonConfig;          // vmond 連線資訊
  trialDir: string;          // artifact 輸出目錄
}): Promise<TrialResult>
```

流程圖解：

```
runTrial
├── 1. 啟動 microVM (TrialVm.start)
│   └── Vibemon sandboxes.create({image, cpus, memory, disk, arch, allow_host_gateway})
├── 2. 建立 host gateway tunnel (vm.startGateway)
├── 3. 安裝 omp binary + 寫 gateway-only config (installAgent)
├── 4. 建立 RpcClient 連接 guest omp (RpcClient + vibmon exec transport)
├── 5. Agent 執行階段
│   ├── client.start() → client.prompt(task.instruction)
│   ├── waitForIdle(agentTimeout) 或 timeout → agentTimedOut
│   ├── 統計 usage（input/output/cacheRead/cacheWrite/cost/turns）
│   └── 存 transcript.json
├── 6. 校準 guest 時間（防 agent 改 clock 影響 verifier 網路）
├── 7. Verifier 執行階段
│   ├── copy tests/ 到 guest
│   ├── chmod +x /tests/test.sh
│   ├── 執行 verifier，捕獲 stdout/stderr
│   └── 讀取 /logs/verifier/reward.txt (0..1)
├── 8. 判定 TrialResult
│   ├── reward === null → "error"（verifier 沒產出 reward）
│   ├── reward >= 1 → "pass"
│   ├── reward < 1 → "fail"
│   └── agentCollectionError && turns === 0 → "error"（harness 故障，非模型失敗）
└── 9. 清理：vm.rm()、client.stop()
```

**細節亮點**：
- `deadline` 機制（`trial.ts#L81-L110`）：整體 trial 有硬性 deadline，超時自動 `vm.rm()`、`client.stop()`，不會卡死
- `agentTimedOut` 區分：agent 超時但 verifier 仍跑、仍算 reward
- `error` 狀態專指 **harness/infra 失敗**，不計入模型 pass rate
- 所有 artifact（transcript、verifier stdout、ctrf.json）寫入 `trialDir`，事後可完整重現

### 5. CLI 排程器：concurrency + epochs + budget

`packages/metaharness/src/tb/cli.ts#L380-L454` 實作了生產級排程：

```typescript
// Semaphore 控制並發
const semaphore = new Semaphore(config.concurrency);

await Promise.all(work.map(async item => {
  await semaphore.acquire();
  try {
    // budget 檢查：epoch 累積成本超過上限停止排程新 trial
    if (config.budget !== null && store.epochSpend(epoch) >= config.budget) ...
    
    const result = await runTrial({...});
    store.insertTrial(trialRow(...));
    completed++;
    console.log(`[e${epoch} ${completed}/${total}] ${result.status} ...`);
  } finally {
    semaphore.release();
  }
}));

// Epoch 機制：同一組任務跑多輪，每輪獨立統計
store.finishEpoch(epoch);
printSummary(epoch, store.epochSummary(epoch), store.overallSummary());
if (config.forever) epoch = store.beginEpoch();
```

**Epoch** 設計允許：
- 同一實驗分多輪跑（如每天跑一輪追蹤模型漂移）
- `resumeEpoch()` 從未完成的 epoch 繼續
- `overallSummary()` 累積所有 epoch 的統計

### 6. SQLite Store：本地持久化 + 即時查詢

`packages/metaharness/src/tb/store.ts#L20-L174`：

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
  trial_dir TEXT NOT NULL,     -- artifact 相對路徑
  started_at INTEGER,
  finished_at INTEGER,
  UNIQUE(epoch, model, task, attempt)
);
```

- `ON CONFLICT ... DO UPDATE` 支援斷點續傳、重跑覆蓋
- `epochSummary()` / `overallSummary()` 直接用 SQL 聚合，**無需載入全表記憶體**
- WAL mode + busy_timeout = 多進程並發安全

### 7. Server + Dashboard：REST + SSE + 靜態 React

`packages/metaharness/src/server.ts` 一個 Bun process 同時服務：

- **API**：`/api/experiments`、`/api/runs`、`/api/events` (SSE)、`/api/runs/:name/traces/:trace`
- **Dashboard**：內嵌 React + TSX（`web/index.html`），開發時 HMR、生產時 Bun bundle
- **Managed children**：`launch()` / `resume()` / `cancel()` 管理 runner 子進程，`detached: true` 確保 manager 重啟不殺掉正在跑的 trial

**Experiment Detail API**（`experiments.ts#L280-L374`）回傳：

```typescript
interface ExperimentDetail {
  id: string;
  goal: string;
  arms: ArmSummary[];           // 每個 arm 的統計 + 投影
  tasks: string[];              // 所有 task union
  matrix: Record<string,        // arm → task → {status, reward}
    Record<string, { status: string; reward: number | null }>
  >;
}
```

**Calibrated pass rate projection**（`experiments.ts#L147-L190`）是亮點：

> Naive extrapolation（觀察到的 pass% 直接投影）會在「前面跑的都是簡單任務」時高估。  
> 這裡用 **Rasch-style 難度校準**：
> 1. 任務難度 = sibling arms 的平滑通過率 `p_t = (passes+1)/(n+2)`
> 2. Arm skill = 單一 log-odds shift `b`，moment-matched 使 Σ σ(logit(p_t)+b) = 實際通過數
> 3. 投影 = 對剩餘任務套用 σ(logit(p_t)+b)；無 sibling 訊號的任務用平均難度

這讓「跑到一半就能看最終預期 pass rate」變得可信。

---

## typescript-edit-benchmark：專注編輯任務的微基準

`packages/typescript-edit-benchmark/` 針對「給一個 prompt，編輯一組檔案」這類任務設計。

### Fixture 結構

```
fixtures/
  add-type-annotation/
    prompt.md           # "為這個函數加上型別標註"
    input/
      utils.ts          # 原始碼
    expected/
      utils.ts          # 期望結果
    metadata.json       # { "file_path": "utils.ts", "mutation_type": "type-annotation", ... }
```

`tasks.ts#L64-L107` `loadTasksFromDir` 自動掃描載入。

### Verification：格式化後比對 + 空行語意區分

`verify.ts#L81-L183` 的核心邏輯：

```typescript
// 1. 讀取 expected + actual
// 2. Prettier 格式化兩邊
// 3. 比對策略：
//    - 代碼：stripBlankLines 後比對（空行數不重要）
//    - Markdown/YAML：完整格式化後逐字比對（空行有語意）
const formattedEquivalent = blankLineSensitive(file)
  ? expectedFormatted === actualFormatted
  : stripBlankLines(expectedFormatted) === stripBlankLines(actualFormatted);
```

**Indent score**（`verify.ts#L149-L150`, `#L202-L240`）量測「agent 輸出的縮排離格式化後有多遠」：

```typescript
// diffLines 比對 agent raw output vs formatted output
// 計算對應行的縮排距離平均
function computeIndentDistanceForDiff(expected: string, actual: string): number
```

這給了「編輯正確但格式亂」一個可量化指標。

---

## stats：本地可觀測性 Dashboard（`omp stats`）

`packages/stats/` 是 **零依賴、零帳號、本地優先** 的可觀測性堆疊。

### 資料流

```
~/.omp/sessions/*.jsonl  (session logs)
    ↓ syncAllSessions()  (增量解析，file_offsets 記錄位移)
SQLite (messages, user_messages, tool_calls, file_offsets, meta)
    ↓ SQL 聚合
REST API (/api/stats, /api/stats/model-dashboard, /api/stats/tools, ...)
    ↓
React Dashboard (embedded client bundle)
```

### 核心能力

| 端點 | 用途 |
|------|------|
| `/api/stats` | 整體摘要：請求數、錯誤率、token、cache rate、成本估算、premium requests |
| `/api/stats/model-dashboard` | 模型維度：requests、cost、cache rate、tokens/s、TTFT |
| `/api/stats/tools` | 工具呼叫統計：每工具 calls、error rate、args/result 大小 |
| `/api/stats/providers` | 提供商維度：token burn、hourly heatmap |
| `/api/stats/gain` | **Gain 分析**：subagent/advisor vs main agent 的 token 分配 |
| `/api/sync` | 手動觸發增量同步 |

### 關鍵工程細節

**Fork 去重**（`db.ts#L524-L591`）：`SessionManager.fork()` 會 deep-copy parent session entries 到新 JSONL（相同 `entry_id`、`timestamp`、`responseId`）。用 `WHERE NOT EXISTS (SELECT 1 WHERE entry_id=? AND timestamp=? AND session_file<>?)` 確保**跨 session_file 的同一請求只算一次**。

**成本回補機制**（`db.ts#L423-L481`）：歷史資料可能缺 `cost_*` 欄位、或 subscription 模型（Grok）的 `orchestration` tokens 沒算進去。`backfillMissingCatalogCosts`、`backfillReingestCosts`、`backfillNoCacheInputCosts` 透過 meta sentinel（`messages_cost_reingest_v1` 等）做 **一次性全量重算**，不影響增量同步。

**Embedded client bundle**（`server.ts#L34-L48`, `#L50-L102`）：編譯後的 binary / npm bundle **沒有 dashboard 源碼**，打包時把 `dist/client` 壓成 gzip archive 嵌入 binary，運行時解壓到 temp 目錄服務。這讓單一 binary 就能 `omp stats` 啟動完整 dashboard。

---

## 為什麼不直接用現有框架？

| 需求 | 現成方案 | metaharness 解法 |
|------|----------|------------------|
| 硬體隔離 trial 環境 | Docker (共享 kernel) | **Vibemon KVM/HVF microVM** |
| 每 trial 獨立模型路由 + auth 隔離 | 環境變數 / 共享 proxy | **Host gateway + per-trial tunnel + 短時效 token** |
| Experiment/arm 對照 + baseline 管理 | 手寫腳本 / 試算表 | **三層模型 + canonical arm 合併 + calibrated projection** |
| 斷點續傳 + budget 控制 + epoch | CI/CD pipeline | **SQLite + Semaphore + epoch + budget check in scheduler** |
| 本地可觀測性（無外部依賴） | Grafana / Datadog / Langfuse | **SQLite + embedded React dashboard，單 binary 即跑即用** |
| Coding agent 專用指標（edit success、tool calls、turns） | 通用 LLM benchmark | **typescript-edit-benchmark + harbor task verifier + trace 完整記錄** |

---

## 學到的事

1. **Benchmark 基礎設施本質上是實驗管理系統**，不是測試跑分器。Experiment/arm/trace 三層、baseline/variant 角色、calibrated projection、re-run 合併——這些都是實驗科學的標準作法，套用在 coding agent evaluation 上效果顯著。

2. **硬體隔離不可妥協**。Docker 看起來方便，但共享 kernel 意味著殘留進程、檔案鎖、網路端口衝突會污染結果。Vibemon microVM 雖然啟動慢（~3-5 秒），但**乾淨環境帶來的結果可信度**遠超過啟動時間成本。

3. **Auth gateway 設計是關鍵**。把「模型路由、auth、計費」集中在 host，guest 只拿 tunnel endpoint + 短時效 token。這同時解決了：API key 安全、provider routing、variant 切換、成本精確歸屬。

4. **本地優先的可觀測性改變開發循環**。`omp stats` 零配置、零帳號、離線可用、嵌在 binary 裡——開發者不用跳出終端機、不用申請 SaaS、不用擔心資料外洩，隨時能看 token burn、錯誤分佈、模型對照。這種「就在我機器上」的體驗，比任何雲端 dashboard 都更容易被日常使用。

5. **SQLite + WAL + 適當索引 足夠支撐百萬筆 trial**。metaharness 的 `trials` 表、stats 的 `messages` 表都沒上 PostgreSQL。單檔、零運維、嵌入式、支援並發讀寫，配合 `PRAGMA busy_timeout=5000` 和 `journal_mode=WAL`，生產環境跑了幾個月零資料損壞。

---

## 參考資料

- [metaharness source: tb/types.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/types.ts) — 共享契約定義
- [metaharness source: tb/trial.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/trial.ts) — 單 trial 完整生命週期
- [metaharness source: tb/vmon.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/vmon.ts) — Vibemon microVM 封裝
- [metaharness source: tb/agent.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/agent.ts) — omp binary 建置與 gateway config 注入
- [metaharness source: tb/store.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/store.ts) — SQLite schema 與聚合查詢
- [metaharness source: tb/cli.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/tb/cli.ts) — 排程器：concurrency/epoch/budget
- [metaharness source: experiments.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/experiments.ts) — Experiment/arm 模型、calibrated projection、re-run 合併
- [metaharness source: server.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/metaharness/src/server.ts) — REST + SSE + Dashboard + Managed children
- [typescript-edit-benchmark source: verify.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/typescript-edit-benchmark/src/verify.ts) — 格式化後比對、空行語意、indent score
- [stats source: db.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/stats/src/db.ts) — SQLite schema、fork 去重、成本回補、embedded client
- [stats source: server.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/stats/src/server.ts) — REST API、port conflict recovery、embedded client serving
- [Vibemon SDK](https://github.com/stencil-hq/vibemon) — KVM/HVF microVM SDK
- [Terminal-Bench 2.x](https://github.com/harbor-framework/terminal-bench-2-1) — 任務資料集格式