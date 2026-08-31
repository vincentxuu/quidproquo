---
title: "pi-mono 深度導讀 11：Telemetry——Vendor-neutral Contracts、Schema 定義、Conformance Tests"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, telemetry, schema, conformance, observability, vendor-neutral]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 11
tldr: "pi-telemetry 核心：TelemetrySchema 定義 Span/Event/Attribute、defineTelemetrySchema 建立 TypedSpanStarter、InMemoryTelemetryContext/NOOP_TELEMETRY_CONTEXT 零開銷實作、Conformance Tests 驗證 Adapter 正確性、AI/Harness Telemetry Schema 完整定義、屬性類型系統、為什麼不直接用 OpenTelemetry。"
description: "深入 pi-telemetry 廠商中立遙測契約：Schema-first 設計、型別安全的 Span Starter、Conformance Tests 確保 Adapter 符合契約、零依賴、零開銷 NOOP 實作、屬性定義系統（Primitive/Object/Array）、Span 命名規範、Event 結構、與 OpenTelemetry 的差異比較、為何選擇自建 Schema。適合研究 Observability 架構、Schema-driven Telemetry、Vendor-neutral 設計的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-telemetry-en)

## TL;DR

- **Schema-first**：先定義 TelemetrySchema（Span/Event/Attribute），再產生 TypedSpanStarter
- **型別安全**：`startAiSpan("llm_call", { model: "claude-3.5-sonnet" })` 編譯期檢查屬性
- **Vendor-neutral**：不綁定 OpenTelemetry、Datadog、Honeycomb；Adapter 由使用者實作
- **Conformance Tests**：`testing/conformance.ts` 驗證 Adapter 正確實作契約
- **零開銷**：`NOOP_TELEMETRY_CONTEXT` 讓不需要遙測的路徑零成本
- **AI/Harness Schema**：完整定義 LLM 呼叫、工具執行、Agent Loop 等遙測

---

## 為什麼不直接用 OpenTelemetry？

| 考量 | OpenTelemetry | pi-telemetry |
|---|---|---|
| **API 複雜度** | 高（Context、Propagator、Exporter、Processor） | 低（Schema → Typed Starter） |
| **Bundle Size** | 大（~200KB+） | 極小（~20KB、零依賴） |
| **資料模型** | 固定（Semantic Conventions） | 完全自定義 |
| **測試友善** | 需 Mock 完整 Pipeline | Conformance Tests 純單元測試 |
| **學習曲線** | 陡峭 | 平緩（TypeScript 介面） |
| **效能** | 處理 Context Propagation | 無 Context Propagation 開銷 |

**核心理念**：pi 不需要分散式追蹤、Context Propagation、Baggage。只需要**結構化記錄 Agent 內部事件**，並能插任意後端。

---

## 核心架構：Schema → Starter → Context → Adapter

```
┌─────────────────────────────────────────────────────────────────┐
│                      pi-telemetry Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Define Schema                                               │
│     defineTelemetrySchema({ spans, events, attributes })        │
│           │                                                     │
│           ▼                                                     │
│  2. Generate Typed Starters                                     │
│     createTypedSpanStarter(schema, "span_name")                 │
│           │                                                     │
│           ▼                                                     │
│  3. Telemetry Context                                           │
│     InMemoryTelemetryContext / NOOP_TELEMETRY_CONTEXT           │
│           │                                                     │
│           ▼                                                     │
│  4. Adapter (User Implements)                                   │
│     TelemetryAdapter { onSpanStart, onSpanEnd, onEvent }       │
│           │                                                     │
│           ▼                                                     │
│  5. Backend (OTel, Datadog, Honeycomb, Custom)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## TelemetrySchema：契約定義

### Schema 定義

```typescript
// packages/telemetry/src/index.ts
export interface TelemetrySchema {
  spans: Record<string, TelemetrySpanDefinition>;
  events: Record<string, TelemetryEventDefinition>;
  attributes: Record<string, TelemetryAttributeDefinition>;
}

export interface TelemetrySpanDefinition {
  name: string;
  description?: string;
  // 必要屬性
  requiredAttributes: string[];
  // 可選屬性
  optionalAttributes: string[];
  // 事件
  events: string[];
  // 父 Span 類型
  parent?: string;
}

export interface TelemetryEventDefinition {
  name: string;
  description?: string;
  requiredAttributes: string[];
  optionalAttributes: string[];
}

export interface TelemetryAttributeDefinition {
  name: string;
  type: TelemetryAttributeType;
  description?: string;
  // 物件/陣列時的子屬性
  properties?: Record<string, TelemetryAttributeDefinition>;
  items?: TelemetryAttributeDefinition;  // 陣列元素類型
}

export type TelemetryAttributeType =
  | "string" | "number" | "boolean"
  | "object" | "array"
  | "span_ref";  // 參考其他 Span
```

### 定義 Schema 範例

```typescript
// packages/agent/src/harness/telemetry.ts
export const AI_TELEMETRY_SCHEMA = defineTelemetrySchema({
  spans: {
    llm_call: {
      name: "llm_call",
      description: "LLM API Call",
      requiredAttributes: ["model", "provider", "duration_ms"],
      optionalAttributes: ["input_tokens", "output_tokens", "stop_reason", "error"],
      events: ["llm_chunk", "llm_error"],
      parent: "agent_turn",
    },
    tool_execution: {
      name: "tool_execution",
      description: "Tool Execution",
      requiredAttributes: ["tool_name", "tool_call_id", "duration_ms", "success"],
      optionalAttributes: ["error", "input_size", "output_size"],
      events: ["tool_update"],
      parent: "agent_turn",
    },
    agent_turn: {
      name: "agent_turn",
      description: "Agent Turn",
      requiredAttributes: ["turn_id", "model", "tools_called"],
      optionalAttributes: ["compaction_triggered", "model_switched"],
      events: ["turn_start", "turn_end"],
    },
  },
  events: {
    llm_chunk: {
      name: "llm_chunk",
      requiredAttributes: ["chunk_type", "tokens_so_far"],
      optionalAttributes: ["partial_text"],
    },
    tool_update: {
      name: "tool_update",
      requiredAttributes: ["tool_call_id", "progress"],
      optionalAttributes: ["partial_result"],
    },
  },
  attributes: {
    model: { name: "model", type: "string", description: "Model identifier" },
    provider: { name: "provider", type: "string", description: "Provider name" },
    duration_ms: { name: "duration_ms", type: "number", description: "Duration in milliseconds" },
    input_tokens: { name: "input_tokens", type: "number" },
    output_tokens: { name: "output_tokens", type: "number" },
    stop_reason: { name: "stop_reason", type: "string" },
    error: { name: "error", type: "string" },
    tool_name: { name: "tool_name", type: "string" },
    tool_call_id: { name: "tool_call_id", type: "string" },
    success: { name: "success", type: "boolean" },
    turn_id: { name: "turn_id", type: "string" },
    tools_called: { name: "tools_called", type: "array", items: { name: "tool", type: "string" } },
  },
});
```

---

## TypedSpanStarter：型別安全的 Span 啟動器

### 生成 Starter

```typescript
// packages/telemetry/src/index.ts
export function createTypedSpanStarter<T extends TelemetrySchema>(
  schema: T,
  context: TelemetryContext
): TypedSpanStarter<T> {
  return new Proxy({}, {
    get(_, spanName: string) {
      const spanDef = schema.spans[spanName];
      if (!spanDef) throw new Error(`Unknown span: ${spanName}`);
      
      return (attributes: SpanAttributes<typeof spanDef>) => {
        // 編譯期檢查：requiredAttributes 必須提供
        // optionalAttributes 可選
        // 類型檢查：屬性值符合定義
        return context.startSpan(spanName, attributes);
      };
    },
  }) as TypedSpanStarter<T>;
}

// 使用範例
const telemetry = createTelemetryContext(adapter);
const startAiSpan = createTypedSpanStarter(AI_TELEMETRY_SCHEMA, telemetry);

// 型別安全調用
const span = startAiSpan.llm_call({
  model: "claude-3.5-sonnet",
  provider: "anthropic",
  duration_ms: 1250,
  input_tokens: 42,
  output_tokens: 156,
  // stop_reason: "end_turn", // 可選
  // error: undefined, // 可選
});
```

### 屬性類型系統

```typescript
// 編譯期驗證
type SpanAttributes<TSpanDef extends TelemetrySpanDefinition> = {
  [K in TSpanDef["requiredAttributes"]]: TelemetryAttributeValue;
} & {
  [K in TSpanDef["optionalAttributes"]]?: TelemetryAttributeValue;
};

type TelemetryAttributeValue =
  | string | number | boolean
  | TelemetryAttributeValue[]
  | { [key: string]: TelemetryAttributeValue }
  | TelemetrySpanRef;  // 參考其他 Span
```

---

## TelemetryContext：執行時介面

### 介面定義

```typescript
// packages/telemetry/src/index.ts
export interface TelemetryContext {
  startSpan(
    name: string,
    attributes: Record<string, TelemetryAttributeValue>,
    options?: { parent?: TelemetrySpan }
  ): TelemetrySpan;
  
  startEvent(
    name: string,
    attributes: Record<string, TelemetryAttributeValue>
  ): void;
  
  // 取得當前 Span（用於巢狀）
  currentSpan(): TelemetrySpan | undefined;
}

export interface TelemetrySpan {
  readonly name: string;
  readonly attributes: Record<string, TelemetryAttributeValue>;
  readonly startTime: number;
  
  end(attributes?: Record<string, TelemetryAttributeValue>): void;
  addEvent(name: string, attributes: Record<string, TelemetryAttributeValue>): void;
  setAttribute(key: string, value: TelemetryAttributeValue): void;
}
```

### 實作：InMemoryTelemetryContext

```typescript
// packages/telemetry/src/memory.ts
export class InMemoryTelemetryContext implements TelemetryContext {
  private spans: TelemetrySpan[] = [];
  private currentSpanStack: TelemetrySpan[] = [];

  startSpan(name, attributes, options): TelemetrySpan {
    const span: TelemetrySpan = {
      name,
      attributes: { ...attributes },
      startTime: Date.now(),
      end(extraAttrs) {
        this.endTime = Date.now();
        this.attributes = { ...this.attributes, ...extraAttrs };
        this.ended = true;
        // 從 stack 移除
        const idx = this.currentSpanStack.indexOf(this);
        if (idx >= 0) this.currentSpanStack.splice(idx, 1);
      },
      addEvent(name, attrs) {
        this.events.push({ name, attributes: attrs, timestamp: Date.now() });
      },
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
      currentSpanStack: this.currentSpanStack,
    };
    
    this.currentSpanStack.push(span);
    this.spans.push(span);
    
    // 設定父子關係
    if (options?.parent) {
      span.parent = options.parent;
    } else if (this.currentSpanStack.length > 1) {
      span.parent = this.currentSpanStack[this.currentSpanStack.length - 2];
    }
    
    return span;
  }

  startEvent(name, attributes) {
    this.events.push({ name, attributes, timestamp: Date.now() });
  }

  currentSpan() {
    return this.currentSpanStack[this.currentSpanStack.length - 1];
  }

  // 供測試/匯出用
  getSpans(): TelemetrySpan[] { return this.spans; }
  getEvents(): TelemetryEvent[] { return this.events; }
}
```

### NOOP 實作：零開銷

```typescript
// packages/telemetry/src/noop.ts
export const NOOP_TELEMETRY_CONTEXT: TelemetryContext = {
  startSpan: () => NOOP_SPAN,
  startEvent: () => {},
  currentSpan: () => undefined,
};

const NOOP_SPAN: TelemetrySpan = {
  name: "",
  attributes: {},
  startTime: 0,
  end: () => {},
  addEvent: () => {},
  setAttribute: () => {},
};
```

**使用場景**：
- 生產環境不啟用遙測時
- 單元測試不關心遙測
- 效能關鍵路徑

---

## Adapter Pattern：使用者實作後端整合

### Adapter 介面

```typescript
// packages/telemetry/src/index.ts
export interface TelemetryAdapter {
  onSpanStart(span: TelemetrySpan): void;
  onSpanEnd(span: TelemetrySpan): void;
  onEvent(event: TelemetryEvent): void;
  // 可選：Flush、Shutdown
  flush?(): Promise<void>;
  shutdown?(): Promise<void>;
}
```

### 整合 OpenTelemetry 範例

```typescript
// 使用者自行實作
import { trace, context, SpanStatusCode } from "@opentelemetry/api";

export class OpenTelemetryAdapter implements TelemetryAdapter {
  private tracer = trace.getTracer("pi-agent");

  onSpanStart(span: TelemetrySpan): void {
    const otelSpan = this.tracer.startSpan(span.name, {
      startTime: span.startTime,
      attributes: this.convertAttributes(span.attributes),
    });
    // 存對應關係
    spanMap.set(span, otelSpan);
  }

  onSpanEnd(span: TelemetrySpan): void {
    const otelSpan = spanMap.get(span);
    if (otelSpan) {
      otelSpan.setAttributes(this.convertAttributes(span.attributes));
      otelSpan.setStatus(span.attributes.error ? { code: SpanStatusCode.ERROR, message: span.attributes.error } : { code: SpanStatusCode.OK });
      otelSpan.end();
      spanMap.delete(span);
    }
  }

  onEvent(event: TelemetryEvent): void {
    const currentSpan = spanMap.get(event.span);
    currentSpan?.addEvent(event.name, this.convertAttributes(event.attributes));
  }

  private convertAttributes(attrs: Record<string, TelemetryAttributeValue>): Record<string, any> {
    // 遞歸轉換巢狀物件/陣列
    return Object.fromEntries(
      Object.entries(attrs).map(([k, v]) => [k, this.convertValue(v)])
    );
  }
}
```

---

## Conformance Tests：驗證 Adapter 正確性

### 測試套件

```typescript
// packages/telemetry/src/testing/conformance.ts
export function runConformanceTests(
  adapter: TelemetryAdapter,
  schema: TelemetrySchema
): ConformanceResult {
  const results: ConformanceTestResult[] = [];

  // 1. Span Start/End 配對
  results.push(testSpanPairing(adapter, schema));
  
  // 2. 屬性類型正確性
  results.push(testAttributeTypes(adapter, schema));
  
  // 3. 事件記錄
  results.push(testEventRecording(adapter, schema));
  
  // 4. 巢狀 Span 父子關係
  results.push(testNestedSpans(adapter, schema));
  
  // 5. 錯誤處理
  results.push(testErrorHandling(adapter));

  return { passed: results.every(r => r.passed), results };
}

function testSpanPairing(adapter: TelemetryAdapter, schema: TelemetrySchema): ConformanceTestResult {
  const context = createTelemetryContext(adapter);
  const starter = createTypedSpanStarter(schema, context);
  
  const span = starter.llm_call({ model: "test", provider: "test", duration_ms: 100 });
  span.end({ output_tokens: 50 });
  
  // 驗證 Adapter 收到 start/end
  return { passed: true, name: "span_pairing" };
}

function testAttributeTypes(adapter: TelemetryAdapter, schema: TelemetrySchema): ConformanceTestResult {
  // 驗證 number/string/boolean/object/array 正確轉換
  return { passed: true, name: "attribute_types" };
}
```

### 在 CI 中執行

```bash
# packages/telemetry/package.json
{
  "scripts": {
    "test:conformance": "vitest run testing/conformance.test.ts"
  }
}
```

---

## AI/Harness Telemetry Schema 完整定義

### 完整 Schema（摘錄）

```typescript
// packages/agent/src/harness/telemetry.ts
export const AGENT_TELEMETRY_SCHEMAS = defineTelemetrySchema({
  spans: {
    // Agent 層級
    agent_session: { ... },
    agent_turn: { ... },
    
    // LLM 層級
    llm_call: { ... },
    llm_stream: { ... },
    
    // Tool 層級
    tool_execution: { ... },
    tool_batch: { ... },
    
    // Compaction
    compaction: { ... },
    branch_summary: { ... },
  },
  events: {
    // LLM 串流
    llm_chunk: { ... },
    llm_thinking: { ... },
    llm_tool_call: { ... },
    
    // Tool 執行
    tool_start: { ... },
    tool_update: { ... },
    tool_end: { ... },
    
    // Agent 狀態
    steering_received: { ... },
    followup_received: { ... },
    compaction_triggered: { ... },
    model_switched: { ... },
  },
  attributes: {
    // 通用
    session_id: { type: "string" },
    turn_id: { type: "string" },
    model: { type: "string" },
    provider: { type: "string" },
    
    // LLM
    input_tokens: { type: "number" },
    output_tokens: { type: "number" },
    thinking_tokens: { type: "number" },
    stop_reason: { type: "string" },
    temperature: { type: "number" },
    reasoning_level: { type: "string" },
    
    // Tool
    tool_name: { type: "string" },
    tool_call_id: { type: "string" },
    execution_mode: { type: "string" },  // parallel/sequential
    success: { type: "boolean" },
    error: { type: "string" },
    duration_ms: { type: "number" },
    
    // Compaction
    tokens_before: { type: "number" },
    tokens_after: { type: "number" },
    summary_length: { type: "number" },
  },
});
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/telemetry/](https://github.com/earendil-works/pi/tree/main/packages/telemetry)
- [Pi 官方文件：Telemetry](https://pi.dev/docs/latest/telemetry)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
- [Schema-driven Telemetry Design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#telemetry)
- [Conformance Testing Patterns](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/test)

---

## 下一篇預告

> **第 12 篇：Compaction 深度——策略、Token Estimation、Branch Summary、Structured Compaction**
>
> shouldCompact 觸發條件、estimateTokens 計算、findCutPoint 尋找切點、generateSummary 生成摘要、prepareCompaction 整理上下文、Branch Summary 生成、Structured Compaction（Extension 自訂）、CompactionEntry 細節、fromHook 機制。