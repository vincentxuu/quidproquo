---
title: "Harness Engineering 進階模式：Tool Registry、Guard System 與 Checkpoint-Resume"
date: 2026-03-30
category: ai
tags: [harness-engineering, tool-registry, guard-system, checkpoint-resume, agent]
lang: zh-TW
tldr: "Harness 不只是呼叫 LLM 的 wrapper。Tool Registry 管理工具的動態載入與選擇、Guard System 建立四層防護網、Checkpoint-Resume 讓長時間任務可以中斷恢復。這三個模式是生產級 Agent 系統的關鍵基礎設施。"
description: "Harness Engineering 三個進階模式的深入設計：Tool Registry 的動態載入與 MCP 整合、四層 Guard System（Input/Output/Tool/Budget）、Checkpoint-Resume 的狀態快照與恢復機制，以及 Escalation 模式的分層降級策略。"
draft: false
---

前幾篇我們從不同角度看了 Harness Engineering 的概念：[三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)拉出了從 Prompt 到 Context 到 Harness 的時間線，[Anthropic 的實戰](/posts/ai/2026-03-28-anthropic-harness-design)示範了雙 Agent 架構和跨 session 狀態管理，[Phil Schmid 的觀點](/posts/ai/2026-03-28-phil-schmid-agent-harness)把 Harness 定位為 AI 系統的作業系統。

這篇要往下鑽：Harness 裡面具體要建什麼？

答案是三個核心子系統加上幾個保護機制。每一個都不難理解，但組合起來就是生產級 Agent 系統和 demo 之間的差距。

---

## 1. Harness 核心回顧

先把架構圖放好，後面所有討論都基於這張圖：

```
┌─────────────────────────────────────────────────┐
│                  Application                     │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │  Input    │  │  Tool    │  │  Output   │     │
│   │  Guards   │→ │  Guards  │→ │  Guards   │     │
│   └──────────┘  └──────────┘  └──────────┘     │
│        │              │              │           │
│        ▼              ▼              ▼           │
│   ┌─────────────────────────────────────────┐   │
│   │            HARNESS LAYER                │   │
│   │                                         │   │
│   │  ┌─────────────┐  ┌─────────────────┐  │   │
│   │  │   Tool      │  │   Checkpoint    │  │   │
│   │  │   Registry  │  │   Manager       │  │   │
│   │  └─────────────┘  └─────────────────┘  │   │
│   │                                         │   │
│   │  ┌─────────────┐  ┌─────────────────┐  │   │
│   │  │   Budget    │  │   Escalation    │  │   │
│   │  │   Tracker   │  │   Controller    │  │   │
│   │  └─────────────┘  └─────────────────┘  │   │
│   │                                         │   │
│   └─────────────────────────────────────────┘   │
│                      │                           │
│                      ▼                           │
│              ┌──────────────┐                    │
│              │     LLM      │                    │
│              │   Provider   │                    │
│              └──────────────┘                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

Harness 是 LLM 和 Application 之間的控制層。它不做推理，它管推理的方式——決定什麼工具可用、什麼輸入合法、什麼輸出可信、什麼時候該存檔、什麼時候該升級。

如果你剛接觸 Harness 的概念，建議先看 [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) 和 [Anthropic 的 Harness Design](/posts/ai/2026-03-28-anthropic-harness-design) 打底，再回來看這篇的實作細節。

---

## 2. Tool Registry 設計

### 問題：工具越多，選擇越差

Agent 最常見的能力來源就是工具呼叫。但這裡有一個反直覺的事實：**給模型的工具越多，它選對工具的機率越低。**

經驗法則是把單次可用的工具控制在 **20 個以下**。超過這個數字，模型開始出現：

- 選錯工具（工具描述語義重疊）
- 忘記某些工具的存在（注意力稀釋）
- 發明不存在的工具名稱（幻覺）

所以你不能把所有工具一股腦塞進 context。你需要一個 **Tool Registry**——集中管理所有可用工具，並根據任務類型動態選擇該載入哪些。

### Tool Definition Schema

每個工具需要四個東西：

| 欄位 | 說明 |
|------|------|
| `name` | 唯一識別名，snake_case |
| `description` | 給 LLM 看的自然語言說明，描述何時該使用這個工具 |
| `parameters` | JSON Schema 格式的參數定義 |
| `execute` | 實際執行函式 |

這個結構跟 OpenAI function calling 和 Anthropic tool use 的格式一致，也跟 MCP（Model Context Protocol）的 tool definition 對齊。

### MCP 整合

MCP 是 Anthropic 提出的工具標準化協議，讓不同工具伺服器用統一格式暴露工具定義。Tool Registry 天然適合作為 MCP 的消費端：

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  MCP     │     │  MCP     │     │  Local   │
│  Server  │     │  Server  │     │  Tools   │
│  (DB)    │     │  (API)   │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     └────────────────┼────────────────┘
                      │
              ┌───────▼───────┐
              │  Tool         │
              │  Registry     │
              │               │
              │  - register() │
              │  - get()      │
              │  - list()     │
              │  - filter()   │
              └───────────────┘
```

### TypeScript 實作

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  tags: string[];                       // 用於動態篩選
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * 根據 tags 篩選工具——這是動態載入的核心
   * 例如：registry.filterByTags(['database', 'read'])
   * 只回傳同時有 'database' 和 'read' tag 的工具
   */
  filterByTags(tags: string[]): ToolDefinition[] {
    return this.list().filter((tool) =>
      tags.every((tag) => tool.tags.includes(tag))
    );
  }

  /**
   * 根據任務類型取得建議的工具子集
   * 這個 mapping 可以是 hardcoded，也可以讓 LLM 動態決定
   */
  getToolsForTask(taskType: string): ToolDefinition[] {
    const taskToolMap: Record<string, string[]> = {
      'data-analysis': ['sql_query', 'csv_parse', 'chart_create', 'file_read'],
      'code-generation': ['file_read', 'file_write', 'shell_exec', 'grep_search'],
      'research': ['web_search', 'web_fetch', 'summarize', 'file_write'],
      'customer-support': ['kb_search', 'ticket_create', 'ticket_update', 'email_send'],
    };

    const toolNames = taskToolMap[taskType] ?? [];
    return toolNames
      .map((name) => this.tools.get(name))
      .filter((t): t is ToolDefinition => t !== undefined);
  }

  /**
   * 轉換為 LLM API 所需的格式（以 Anthropic 為例）
   */
  toApiFormat(tools: ToolDefinition[]): Array<{
    name: string;
    description: string;
    input_schema: Record<string, unknown>;
  }> {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }
}
```

### 動態載入實戰

實際運作流程是這樣的：

1. 啟動時，所有工具向 Registry 註冊（包含 MCP server 回傳的工具）
2. 收到任務時，先判斷任務類型
3. 用 `getToolsForTask()` 或 `filterByTags()` 取得該任務需要的工具子集
4. 只把這些工具傳進 LLM 的 API call
5. LLM 選工具 → Registry 取出對應的 `execute` 函式 → 執行 → 回傳結果

這樣做的好處：

- **減少幻覺**：工具少了，模型不容易搞混
- **降低 token 消耗**：工具定義本身佔 context 空間，少掛幾個省不少 token
- **權限隔離**：不同任務類型只看到自己該用的工具，減少誤操作

---

## 3. Guard System 四層防護

工具有了，下一個問題是：**怎麼確保進出 Harness 的每一筆資料都是安全的？**

Guard System 是四道門，每一道攔截不同層級的問題：

```
使用者輸入
    │
    ▼
┌──────────────────┐
│  Input Guards    │  ← PII 偵測 / 注入防護 / 長度限制
│  (進場檢查)       │
└────────┬─────────┘
         │ ✓ 通過
         ▼
┌──────────────────┐
│  LLM 推理        │
│  + Tool Calls    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Tool Guards     │  ← 權限檢查 / 參數驗證 / 頻率限制
│  (工具層攔截)     │
└────────┬─────────┘
         │ ✓ 通過
         ▼
┌──────────────────┐
│  工具執行結果      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Output Guards   │  ← 格式驗證 / 幻覺偵測 / 毒性過濾
│  (出場檢查)       │
└────────┬─────────┘
         │ ✓ 通過
         ▼
┌──────────────────┐
│  Budget Guards   │  ← Token 用量 / API 成本 / 時間限制
│  (資源總控)       │  （貫穿全程，每一步都檢查）
└──────────────────┘
         │
         ▼
    回傳給使用者
```

### 3.1 Input Guards：進場檢查

在使用者輸入送進 LLM 之前攔截問題。

| Guard | 做什麼 | 為什麼需要 |
|-------|--------|-----------|
| PII 偵測 | 掃描輸入中的個資（姓名、電話、身分證號） | 防止個資進入 LLM，特別是用第三方 API 時 |
| Injection 防護 | 偵測 prompt injection 嘗試 | 惡意使用者可能嘗試覆寫系統指令 |
| 長度限制 | 拒絕過長的輸入 | 避免 context window 被單一輸入吃滿 |
| 語言偵測 | 確認輸入語言在支援範圍內 | 某些 Agent 只針對特定語言最佳化 |

### 3.2 Output Guards：出場檢查

LLM 回覆送出去之前的最後一道防線。

| Guard | 做什麼 | 為什麼需要 |
|-------|--------|-----------|
| 格式驗證 | 確認回覆符合預期格式（JSON、Markdown 等） | 下游系統需要結構化輸出 |
| 幻覺偵測 | 比對回覆與已知事實或來源文件 | LLM 可能自信地胡說八道 |
| 毒性過濾 | 偵測有害、偏見或不當內容 | 品牌保護和法規合規 |
| 引用驗證 | 確認引用的來源確實存在且內容一致 | 防止假引用（RAG 系統常見問題） |

### 3.3 Tool Guards：工具層攔截

Agent 呼叫工具時的權限和安全檢查。

| Guard | 做什麼 | 為什麼需要 |
|-------|--------|-----------|
| 權限檢查 | 確認當前使用者/角色有權使用該工具 | 不是所有使用者都該能 `shell_exec` |
| 參數驗證 | 用 JSON Schema 驗證工具參數 | 防止模型傳入畸形參數導致系統錯誤 |
| 頻率限制 | 限制同一工具的呼叫次數 | 防止無限迴圈或資源耗盡 |
| 敏感操作確認 | 寫入/刪除類操作要求二次確認 | 防止不可逆的錯誤操作 |

### 3.4 Budget Guards：資源總控

貫穿整個任務生命週期，持續追蹤資源消耗。

| Guard | 做什麼 | 為什麼需要 |
|-------|--------|-----------|
| Token 預算 | 追蹤累計 token 使用量，超過閾值停止 | 單一任務不該吃掉整月的 API 額度 |
| 成本追蹤 | 即時計算 API 呼叫成本（含不同 model 價差） | 財務可控 |
| 時間限制 | 超時強制中止 | 防止 Agent 跑到天荒地老 |
| 步數限制 | 限制推理/工具呼叫的總步數 | 最基本的死迴圈保護 |

### TypeScript 實作

```typescript
type GuardResult =
  | { passed: true }
  | { passed: false; reason: string; action: 'block' | 'warn' | 'modify' };

interface Guard {
  name: string;
  type: 'input' | 'output' | 'tool' | 'budget';
  check(context: GuardContext): Promise<GuardResult>;
}

interface GuardContext {
  input?: string;
  output?: string;
  toolCall?: { name: string; params: Record<string, unknown> };
  session: {
    totalTokens: number;
    totalCost: number;
    startTime: number;
    stepCount: number;
  };
}

class GuardPipeline {
  private guards: Guard[] = [];

  /**
   * 鏈式添加 guard
   */
  add(guard: Guard): GuardPipeline {
    this.guards.push(guard);
    return this;
  }

  /**
   * 依序執行指定類型的所有 guards
   * 任何一個 guard 回傳 block，整條 pipeline 中止
   */
  async run(
    type: Guard['type'],
    context: GuardContext
  ): Promise<{ passed: boolean; failures: Array<{ guard: string; reason: string }> }> {
    const relevant = this.guards.filter((g) => g.type === type);
    const failures: Array<{ guard: string; reason: string }> = [];

    for (const guard of relevant) {
      const result = await guard.check(context);
      if (!result.passed) {
        failures.push({ guard: guard.name, reason: result.reason });
        if (result.action === 'block') {
          return { passed: false, failures };
        }
        // 'warn' 和 'modify' 繼續執行後續 guards
      }
    }

    return { passed: failures.length === 0, failures };
  }
}

// ── 使用範例 ────────────────────────────────────────

// PII 偵測 guard
const piiGuard: Guard = {
  name: 'pii-detector',
  type: 'input',
  async check(ctx) {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,     // SSN
      /\b[A-Z]\d{9}\b/,             // 台灣身分證字號
      /\b09\d{8}\b/,                // 台灣手機號碼
    ];
    const hasPii = piiPatterns.some((p) => p.test(ctx.input ?? ''));
    if (hasPii) {
      return { passed: false, reason: 'Input contains PII', action: 'block' };
    }
    return { passed: true };
  },
};

// Token 預算 guard
const tokenBudgetGuard: Guard = {
  name: 'token-budget',
  type: 'budget',
  async check(ctx) {
    const MAX_TOKENS = 500_000;
    if (ctx.session.totalTokens > MAX_TOKENS) {
      return {
        passed: false,
        reason: `Token budget exceeded: ${ctx.session.totalTokens}/${MAX_TOKENS}`,
        action: 'block',
      };
    }
    return { passed: true };
  },
};

// 工具頻率限制 guard
const toolRateLimitGuard: Guard = {
  name: 'tool-rate-limit',
  type: 'tool',
  callCounts: new Map<string, number>(),
  async check(ctx) {
    const toolName = ctx.toolCall?.name ?? '';
    const count = (this.callCounts.get(toolName) ?? 0) + 1;
    this.callCounts.set(toolName, count);

    const MAX_CALLS_PER_TOOL = 50;
    if (count > MAX_CALLS_PER_TOOL) {
      return {
        passed: false,
        reason: `Tool "${toolName}" called ${count} times (limit: ${MAX_CALLS_PER_TOOL})`,
        action: 'block',
      };
    }
    return { passed: true };
  },
} as Guard & { callCounts: Map<string, number> };

// 組裝 pipeline
const pipeline = new GuardPipeline()
  .add(piiGuard)
  .add(tokenBudgetGuard)
  .add(toolRateLimitGuard);

// 執行檢查
const inputCheck = await pipeline.run('input', {
  input: userMessage,
  session: currentSession,
});

if (!inputCheck.passed) {
  console.error('Guards blocked:', inputCheck.failures);
  return;
}
```

Guard 的設計重點是：**每一層獨立、可插拔、可測試。** 你可以在開發階段只開 `warn`，在生產環境切成 `block`。你也可以根據使用者等級載入不同的 guard 組合——付費用戶的 token 預算可以比免費用戶高。

---

## 4. Checkpoint-Resume 模式

### 問題：長任務一定會失敗

任何跑超過幾分鐘的 Agent 任務都面臨一個殘酷的現實：它**一定會**在某個時刻中斷。

原因太多了：

- API rate limit 觸發
- 網路暫時斷線
- Token 預算用完需要人類審批追加
- 部署更新導致重啟
- 模型回傳格式異常需要重試

如果沒有 Checkpoint 機制，中斷 = 從頭來過。對於一個已經跑了 30 分鐘、呼叫了 200 次工具的任務來說，從頭來過不只浪費錢，還可能因為外部狀態已經改變（例如已經寫入了部分資料）而產生不一致。

### Checkpoint 要存什麼

一個有效的 checkpoint 至少需要四個東西：

| 資料 | 說明 |
|------|------|
| 任務進度 | 哪些子任務已完成、當前進行到哪一步 |
| 累積的 context | 到目前為止的關鍵發現和中間結論 |
| 中間結果 | 已經產生的輸出（檔案、資料庫寫入紀錄等） |
| Session 狀態 | Token 使用量、成本、已呼叫的工具紀錄 |

### 方法一：檔案系統

最簡單的方式，也是 Anthropic 在自己的 Agent 系統中使用的方式（`claude-progress.txt`）。

```
project/
├── .agent/
│   ├── progress.txt          # 當前進度的人類可讀描述
│   ├── checkpoints/
│   │   ├── cp-001.json       # 第一個 checkpoint
│   │   ├── cp-002.json       # 第二個 checkpoint
│   │   └── cp-003.json       # 最新的 checkpoint
│   └── results/
│       ├── step-01-output.md # 各步驟的中間產出
│       └── step-02-output.md
```

好處是：你可以直接 `cat` 來看進度，也可以手動修改 checkpoint 來影響 Agent 的下一步。壞處是：多 Agent 併發時需要自己處理 file lock。

### 方法二：資料庫

適合多用戶、多 Agent 的生產環境。

```sql
CREATE TABLE sessions (
  id           UUID PRIMARY KEY,
  task_type    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'running',  -- running | paused | completed | failed
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE checkpoints (
  id           UUID PRIMARY KEY,
  session_id   UUID REFERENCES sessions(id),
  step_number  INT NOT NULL,
  state        JSONB NOT NULL,       -- 完整的任務狀態快照
  metadata     JSONB DEFAULT '{}',   -- token 用量、成本等
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_checkpoints_session
  ON checkpoints(session_id, step_number DESC);
```

### TypeScript 實作

```typescript
interface CheckpointData {
  stepNumber: number;
  taskProgress: {
    completedSteps: string[];
    currentStep: string;
    remainingSteps: string[];
  };
  context: {
    keyFindings: string[];
    intermediateResults: Record<string, unknown>;
  };
  session: {
    totalTokens: number;
    totalCost: number;
    toolCallCount: number;
    elapsedMs: number;
  };
}

class CheckpointManager {
  constructor(
    private sessionId: string,
    private storageDir: string
  ) {}

  /**
   * 儲存 checkpoint
   * 每 N 步或每個重要里程碑呼叫一次
   */
  async save(data: CheckpointData): Promise<string> {
    const checkpointId = `cp-${String(data.stepNumber).padStart(4, '0')}`;
    const filePath = `${this.storageDir}/checkpoints/${checkpointId}.json`;

    await fs.mkdir(`${this.storageDir}/checkpoints`, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // 同步更新人類可讀的進度檔
    const progressText = [
      `Session: ${this.sessionId}`,
      `Step: ${data.stepNumber}`,
      `Current: ${data.taskProgress.currentStep}`,
      `Completed: ${data.taskProgress.completedSteps.join(', ')}`,
      `Remaining: ${data.taskProgress.remainingSteps.join(', ')}`,
      `Tokens used: ${data.session.totalTokens}`,
      `Cost: $${data.session.totalCost.toFixed(4)}`,
      `Updated: ${new Date().toISOString()}`,
    ].join('\n');

    await fs.writeFile(`${this.storageDir}/progress.txt`, progressText);

    return checkpointId;
  }

  /**
   * 恢復到最新的 checkpoint
   */
  async restore(): Promise<CheckpointData | null> {
    const checkpoints = await this.list();
    if (checkpoints.length === 0) return null;

    // 取最新的
    const latest = checkpoints[checkpoints.length - 1];
    const filePath = `${this.storageDir}/checkpoints/${latest}.json`;
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CheckpointData;
  }

  /**
   * 列出所有 checkpoints，依照 step number 排序
   */
  async list(): Promise<string[]> {
    try {
      const files = await fs.readdir(`${this.storageDir}/checkpoints`);
      return files
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace('.json', ''))
        .sort();
    } catch {
      return [];
    }
  }

  /**
   * 清理舊的 checkpoints，只保留最近 N 個
   */
  async prune(keepCount: number = 5): Promise<void> {
    const all = await this.list();
    const toDelete = all.slice(0, -keepCount);
    for (const cp of toDelete) {
      await fs.unlink(`${this.storageDir}/checkpoints/${cp}.json`);
    }
  }
}
```

### 使用模式

```typescript
const checkpointMgr = new CheckpointManager(sessionId, '.agent');

// 嘗試從上次中斷處恢復
const lastCheckpoint = await checkpointMgr.restore();
let currentStep = lastCheckpoint?.stepNumber ?? 0;
let completedSteps = lastCheckpoint?.taskProgress.completedSteps ?? [];

// Agent 主迴圈
for (const step of taskSteps.slice(currentStep)) {
  // 執行步驟...
  const result = await executeStep(step);
  completedSteps.push(step.name);
  currentStep++;

  // 每完成一步就存 checkpoint
  await checkpointMgr.save({
    stepNumber: currentStep,
    taskProgress: {
      completedSteps,
      currentStep: step.name,
      remainingSteps: taskSteps.slice(currentStep).map((s) => s.name),
    },
    context: {
      keyFindings: accumulatedFindings,
      intermediateResults: { [step.name]: result },
    },
    session: getSessionMetrics(),
  });
}

// 任務完成後清理舊 checkpoints
await checkpointMgr.prune(3);
```

Checkpoint 的粒度需要權衡：太頻繁浪費 I/O，太稀疏則恢復時損失太多進度。一般來說，**每完成一個有意義的子任務**存一次是合理的起點。

---

## 5. Escalation 模式

### 問題：不是所有任務都需要最強的模型

在生產環境中，用最便宜能完成任務的模型是基本的成本紀律。但問題是：你事先不知道一個任務需要多強的模型。

Escalation 模式的策略是：**從便宜的開始試，失敗了再往上升級。**

```
Level 0: 快速模型（Haiku / GPT-4o-mini）
    │
    │ 失敗或品質不足
    ▼
Level 1: 換策略重試（增加 context / 拆解任務）
    │
    │ 仍然失敗
    ▼
Level 2: 強模型（Sonnet / GPT-4o）
    │
    │ 仍然失敗
    ▼
Level 3: 最強模型（Opus / o3）
    │
    │ 仍然失敗
    ▼
Level 4: Human-in-the-Loop（通知人類介入）
```

重點不只是升級，而是**紀錄升級的原因**。這些紀錄是最寶貴的資料——它們告訴你哪些任務類型需要強模型、你的 prompt 在哪裡不夠好、你的工具定義是否有歧義。

### TypeScript 實作

```typescript
interface EscalationLevel {
  name: string;
  model: string;
  maxRetries: number;
  strategy?: (task: Task) => Task; // 可選的任務轉換策略
}

interface EscalationRecord {
  fromLevel: string;
  toLevel: string;
  reason: string;
  taskType: string;
  timestamp: number;
}

class EscalationController {
  private levels: EscalationLevel[] = [
    {
      name: 'fast',
      model: 'claude-haiku',
      maxRetries: 2,
    },
    {
      name: 'retry-with-strategy',
      model: 'claude-haiku',
      maxRetries: 1,
      strategy: (task) => ({
        ...task,
        // 增加 few-shot examples 或拆解子任務
        prompt: addFewShotExamples(task.prompt),
      }),
    },
    {
      name: 'standard',
      model: 'claude-sonnet',
      maxRetries: 2,
    },
    {
      name: 'powerful',
      model: 'claude-opus',
      maxRetries: 1,
    },
  ];

  private records: EscalationRecord[] = [];

  async execute(task: Task): Promise<TaskResult> {
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      const effectiveTask = level.strategy ? level.strategy(task) : task;

      for (let retry = 0; retry < level.maxRetries; retry++) {
        try {
          const result = await this.runWithModel(level.model, effectiveTask);

          // 品質檢查——不是跑完就算，還要確認品質達標
          if (await this.qualityCheck(result, task)) {
            return result;
          }
        } catch (error) {
          // 重試或升級
          continue;
        }
      }

      // 紀錄升級原因
      if (i < this.levels.length - 1) {
        this.records.push({
          fromLevel: level.name,
          toLevel: this.levels[i + 1].name,
          reason: `Level "${level.name}" failed after ${level.maxRetries} retries`,
          taskType: task.type,
          timestamp: Date.now(),
        });
      }
    }

    // 所有等級都失敗 → human-in-the-loop
    return this.escalateToHuman(task);
  }

  private async escalateToHuman(task: Task): Promise<TaskResult> {
    // 傳送通知（Slack、Email 等），暫停任務等待人類回應
    await notify({
      channel: 'agent-escalation',
      message: `Task ${task.id} requires human intervention`,
      context: {
        taskType: task.type,
        attempts: this.records.filter((r) => r.taskType === task.type),
      },
    });

    // 暫停，等待人類在 checkpoint 中恢復
    throw new EscalationError('Escalated to human', task.id);
  }

  /**
   * 取得升級紀錄用於分析
   * 定期看這些紀錄，就知道哪裡需要改善
   */
  getRecords(): EscalationRecord[] {
    return [...this.records];
  }
}
```

Escalation 跟 Checkpoint-Resume 是天然的搭檔：升級到 human-in-the-loop 時，先存 checkpoint，等人類處理完再從 checkpoint 恢復繼續。

---

## 6. 死迴圈防護

Agent 系統最常見的事故模式就是**死迴圈**——模型一直重複同樣的動作，或者在兩個狀態之間無限震盪。

三道防線：

### 6.1 最大步數限制

最簡單、最可靠的防線。

```typescript
const MAX_ITERATIONS = 100;
let iterations = 0;

while (!task.isComplete()) {
  if (++iterations > MAX_ITERATIONS) {
    throw new Error(`Task exceeded max iterations (${MAX_ITERATIONS})`);
  }
  await executeNextStep();
}
```

### 6.2 相似度偵測

偵測連續幾步的輸出是否高度相似，判斷是否卡在同一個地方。

```typescript
class SimilarityDetector {
  private recentOutputs: string[] = [];
  private windowSize = 5;
  private threshold = 0.9;

  /**
   * 回傳 true 表示偵測到迴圈
   */
  check(output: string): boolean {
    this.recentOutputs.push(output);
    if (this.recentOutputs.length > this.windowSize) {
      this.recentOutputs.shift();
    }

    if (this.recentOutputs.length < 3) return false;

    // 檢查最近幾次輸出的相似度
    const last = this.recentOutputs[this.recentOutputs.length - 1];
    const similarCount = this.recentOutputs
      .slice(0, -1)
      .filter((prev) => this.cosineSimilarity(prev, last) > this.threshold)
      .length;

    // 如果最近的輸出跟之前超過一半相似，判定為迴圈
    return similarCount >= Math.floor(this.recentOutputs.length / 2);
  }

  private cosineSimilarity(a: string, b: string): number {
    // 簡化版：用 character n-gram 計算
    // 生產環境可以用 embedding 比對
    const ngramA = this.getNgrams(a, 3);
    const ngramB = this.getNgrams(b, 3);
    const intersection = ngramA.filter((ng) => ngramB.includes(ng));
    return intersection.length / Math.max(ngramA.length, ngramB.length);
  }

  private getNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  }
}
```

### 6.3 Circuit Breaker

借鑑微服務架構的 Circuit Breaker 模式。連續失敗達到門檻時，暫時停止嘗試，等待冷卻後再恢復。

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold: number = 5,
    private cooldownMs: number = 60_000
  ) {}

  /**
   * 在執行動作前檢查
   */
  canProceed(): boolean {
    if (this.state === 'closed') return true;

    if (this.state === 'open') {
      // 檢查冷卻時間是否已過
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = 'half-open';
        return true; // 允許一次嘗試
      }
      return false;
    }

    // half-open: 允許嘗試
    return true;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }
}
```

三道防線的關係：

```
每一步
  │
  ├─ 步數檢查（硬性上限，不可覆寫）
  │
  ├─ 相似度偵測（軟性判斷，觸發後可嘗試不同策略）
  │
  └─ Circuit Breaker（連續失敗保護，觸發後暫停冷卻）
```

---

## 7. 可觀測性指標

Harness 跑起來之後，你需要知道它跑得好不好。以下是生產環境建議追蹤的六個核心指標：

| 指標 | 衡量什麼 | 健康基準 | 告警條件 |
|------|---------|---------|---------|
| **Steps per Task** | 完成一個任務平均需要幾步 | 依任務類型而定 | 突然增加 >50% |
| **Tool Error Rate** | 工具呼叫失敗的比率 | < 5% | > 10% |
| **Loop Detection Count** | 相似度偵測觸發次數 | 0 | > 0（每次都該調查原因） |
| **Token Efficiency** | 每完成一個子任務消耗的 token 數 | 持續下降或穩定 | 持續上升 |
| **Task Completion Rate** | 任務成功完成的比率 | > 95% | < 90% |
| **Cost per Task** | 每個任務的 API 成本 | 依業務 ROI 而定 | 超過 ROI 門檻 |

額外建議追蹤但不直接告警的：

| 指標 | 用途 |
|------|------|
| **Escalation Rate** | 升級到更強模型的頻率——高代表 prompt 或工具定義需要改善 |
| **Checkpoint Restore Count** | 從 checkpoint 恢復的頻率——高代表基礎設施不夠穩定 |
| **Guard Block Rate** | 各層 guard 攔截的頻率——突然升高可能代表攻擊或模型行為漂移 |
| **P95 Latency per Step** | 單步延遲的長尾——排除基礎設施問題 |

這些指標用 [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide) 或類似的 LLM observability 平台追蹤最方便。每個 Agent 步驟作為一個 span，整個任務作為一個 trace，Guard 結果和 Checkpoint 事件作為 event 附加上去。

---

## 小結

把這篇的四個模式拉回架構圖來看：

```
                     ┌────────────────────┐
                     │   Observability    │
                     │   (指標收集)        │
                     └────────┬───────────┘
                              │ 觀測所有層
    ┌─────────────────────────┼─────────────────────────┐
    │                         │          HARNESS         │
    │                         │                          │
    │  ┌──────────┐   ┌──────┴──────┐   ┌───────────┐  │
    │  │ Guard    │   │ Escalation  │   │ Loop      │  │
    │  │ System   │   │ Controller  │   │ Protection│  │
    │  │ (四層)   │   │ (分級升級)   │   │ (三道防線) │  │
    │  └──────────┘   └─────────────┘   └───────────┘  │
    │                                                    │
    │  ┌──────────────┐   ┌──────────────────────────┐  │
    │  │ Tool         │   │ Checkpoint               │  │
    │  │ Registry     │   │ Manager                  │  │
    │  │ (動態載入)    │   │ (中斷恢復)               │  │
    │  └──────────────┘   └──────────────────────────┘  │
    │                                                    │
    └────────────────────────────────────────────────────┘
```

每個模式單獨拿出來都不複雜。但缺了任何一個，你的 Agent 系統就只是一個 demo——能跑，但不能上線。

- **Tool Registry** 讓模型只看到該看的工具
- **Guard System** 確保進出的資料都是安全的
- **Checkpoint-Resume** 讓長時間任務不怕中斷
- **Escalation** 在成本和品質之間找到平衡
- **死迴圈防護** 避免最常見的失控模式
- **可觀測性指標** 讓你知道什麼時候該介入

這些不是理論。如果你正在建 Agent 系統，從 Guard System 和 Checkpoint 開始——它們的 ROI 最高、實作最直接、出事時最感謝自己當初有做。
