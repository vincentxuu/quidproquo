---
title: "pi-mono Deep Dive 11: Telemetry — Vendor-neutral Contracts, Schema Definition, Conformance Tests"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, telemetry, schema, conformance, observability, vendor-neutral]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 11
tldr: "pi-telemetry Core: TelemetrySchema Defines Span/Event/Attribute, defineTelemetrySchema Creates TypedSpanStarter, InMemoryTelemetryContext/NOOP_TELEMETRY_CONTEXT Zero-overhead Implementations, Conformance Tests Verify Adapter Correctness, AI/Harness Telemetry Schema Complete Definitions, Attribute Type System, Why Not Use OpenTelemetry Directly."
description: "Deep dive into pi-telemetry Vendor-neutral Telemetry Contracts: Schema-first Design, Type-safe Span Starters, Conformance Tests Ensure Adapter Compliance, Zero-dependency, Zero-overhead NOOP Implementation, Attribute Definition System (Primitive/Object/Array), Span Naming Conventions, Event Structure, Comparison with OpenTelemetry, Why Custom Schema. For Engineers Researching Observability Architecture, Schema-driven Telemetry, Vendor-neutral Design."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-telemetry)

## TL;DR

- **Schema-first**: Define TelemetrySchema (Span/Event/Attribute), Then Generate TypedSpanStarter
- **Type-safe**: `startAiSpan("llm_call", { model: "claude-3.5-sonnet" })` Compile-time Attribute Checking
- **Vendor-neutral**: Not Tied to OpenTelemetry, Datadog, Honeycomb; Adapter Implemented by User
- **Conformance Tests**: `testing/conformance.ts` Verifies Adapter Implements Contract Correctly
- **Zero-overhead**: `NOOP_TELEMETRY_CONTEXT` for Paths Not Needing Telemetry
- **AI/Harness Schema**: Complete Definitions for LLM Calls, Tool Execution, Agent Loop Telemetry

---

## Why Not Use OpenTelemetry Directly?

| Consideration | OpenTelemetry | pi-telemetry |
|---|---|---|
| **API Complexity** | High (Context, Propagator, Exporter, Processor) | Low (Schema → Typed Starter) |
| **Bundle Size** | Large (~200KB+) | Tiny (~20KB, Zero Dependencies) |
| **Data Model** | Fixed (Semantic Conventions) | Fully Customizable |
| **Test Friendliness** | Need Mock Full Pipeline | Conformance Tests Pure Unit Tests |
| **Learning Curve** | Steep | Gentle (TypeScript Interfaces) |
| **Performance** | Context Propagation Overhead | No Context Propagation Overhead |

**Core Philosophy**: pi Doesn't Need Distributed Tracing, Context Propagation, Baggage. Only Needs **Structured Recording of Agent Internal Events**, Pluggable to Any Backend.

---

## Core Architecture: Schema → Starter → Context → Adapter

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

## TelemetrySchema: Contract Definition

### Schema Definition

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
  // Required Attributes
  requiredAttributes: string[];
  // Optional Attributes
  optionalAttributes: string[];
  // Events
  events: string[];
  // Parent Span Type
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
  // Object/Array Child Properties
  properties?: Record<string, TelemetryAttributeDefinition>;
  items?: TelemetryAttributeDefinition;  // Array Element Type
}

export type TelemetryAttributeType =
  | "string" | "number" | "boolean"
  | "object" | "array"
  | "span_ref";  // Reference Other Span
```

### Defining Schema Example

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

## TypedSpanStarter: Type-safe Span Starters

### Generating Starters

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
        // Compile-time Check: requiredAttributes Must Be Provided
        // optionalAttributes Optional
        // Type Check: Attribute Values Match Definitions
        return context.startSpan(spanName, attributes);
      };
    },
  }) as TypedSpanStarter<T>;
}

// Usage Example
const telemetry = createTelemetryContext(adapter);
const startAiSpan = createTypedSpanStarter(AI_TELEMETRY_SCHEMA, telemetry);

// Type-safe Call
const span = startAiSpan.llm_call({
  model: "claude-3.5-sonnet",
  provider: "anthropic",
  duration_ms: 1250,
  input_tokens: 42,
  output_tokens: 156,
  // stop_reason: "end_turn", // Optional
  // error: undefined, // Optional
});
```

### Attribute Type System

```typescript
// Compile-time Validation
type SpanAttributes<TSpanDef extends TelemetrySpanDefinition> = {
  [K in TSpanDef["requiredAttributes"]]: TelemetryAttributeValue;
} & {
  [K in TSpanDef["optionalAttributes"]]?: TelemetryAttributeValue;
};

type TelemetryAttributeValue =
  | string | number | boolean
  | TelemetryAttributeValue[]
  | { [key: string]: TelemetryAttributeValue }
  | TelemetrySpanRef;  // Reference Other Span
```

---

## TelemetryContext: Runtime Interface

### Interface Definition

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
  
  // Get Current Span (for Nesting)
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

### Implementation: InMemoryTelemetryContext

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
        // Remove from Stack
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
    
    // Set Parent-Child Relationship
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

  // For Testing/Export
  getSpans(): TelemetrySpan[] { return this.spans; }
  getEvents(): TelemetryEvent[] { return this.events; }
}
```

### NOOP Implementation: Zero-overhead

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

**Use Cases**:
- Production Without Telemetry Enabled
- Unit Tests Not Caring About Telemetry
- Performance Critical Paths

---

## Adapter Pattern: User Implements Backend Integration

### Adapter Interface

```typescript
// packages/telemetry/src/index.ts
export interface TelemetryAdapter {
  onSpanStart(span: TelemetrySpan): void;
  onSpanEnd(span: TelemetrySpan): void;
  onEvent(event: TelemetryEvent): void;
  // Optional: Flush, Shutdown
  flush?(): Promise<void>;
  shutdown?(): Promise<void>;
}
```

### OpenTelemetry Integration Example

```typescript
// User Implements
import { trace, context, SpanStatusCode } from "@opentelemetry/api";

export class OpenTelemetryAdapter implements TelemetryAdapter {
  private tracer = trace.getTracer("pi-agent");

  onSpanStart(span: TelemetrySpan): void {
    const otelSpan = this.tracer.startSpan(span.name, {
      startTime: span.startTime,
      attributes: this.convertAttributes(span.attributes),
    });
    // Store Mapping
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
    // Recursive Convert Nested Objects/Arrays
    return Object.fromEntries(
      Object.entries(attrs).map(([k, v]) => [k, this.convertValue(v)])
    );
  }
}
```

---

## Conformance Tests: Verify Adapter Correctness

### Test Suite

```typescript
// packages/telemetry/src/testing/conformance.ts
export function runConformanceTests(
  adapter: TelemetryAdapter,
  schema: TelemetrySchema
): ConformanceResult {
  const results: ConformanceTestResult[] = [];

  // 1. Span Start/End Pairing
  results.push(testSpanPairing(adapter, schema));
  
  // 2. Attribute Type Correctness
  results.push(testAttributeTypes(adapter, schema));
  
  // 3. Event Recording
  results.push(testEventRecording(adapter, schema));
  
  // 4. Nested Span Parent-Child
  results.push(testNestedSpans(adapter, schema));
  
  // 5. Error Handling
  results.push(testErrorHandling(adapter));

  return { passed: results.every(r => r.passed), results };
}

function testSpanPairing(adapter: TelemetryAdapter, schema: TelemetrySchema): ConformanceTestResult {
  const context = createTelemetryContext(adapter);
  const starter = createTypedSpanStarter(schema, context);
  
  const span = starter.llm_call({ model: "test", provider: "test", duration_ms: 100 });
  span.end({ output_tokens: 50 });
  
  // Verify Adapter Received Start/End
  return { passed: true, name: "span_pairing" };
}

function testAttributeTypes(adapter: TelemetryAdapter, schema: TelemetrySchema): ConformanceTestResult {
  // Verify number/string/boolean/object/array Correctly Converted
  return { passed: true, name: "attribute_types" };
}
```

### Running in CI

```bash
# packages/telemetry/package.json
{
  "scripts": {
    "test:conformance": "vitest run testing/conformance.test.ts"
  }
}
```

---

## AI/Harness Telemetry Schema Complete Definition

### Complete Schema (Excerpt)

```typescript
// packages/agent/src/harness/telemetry.ts
export const AGENT_TELEMETRY_SCHEMAS = defineTelemetrySchema({
  spans: {
    // Agent Level
    agent_session: { ... },
    agent_turn: { ... },
    
    // LLM Level
    llm_call: { ... },
    llm_stream: { ... },
    
    // Tool Level
    tool_execution: { ... },
    tool_batch: { ... },
    
    // Compaction
    compaction: { ... },
    branch_summary: { ... },
  },
  events: {
    // LLM Streaming
    llm_chunk: { ... },
    llm_thinking: { ... },
    llm_tool_call: { ... },
    
    // Tool Execution
    tool_start: { ... },
    tool_update: { ... },
    tool_end: { ... },
    
    // Agent State
    steering_received: { ... },
    followup_received: { ... },
    compaction_triggered: { ... },
    model_switched: { ... },
  },
  attributes: {
    // Common
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

## References

- [GitHub - earendil-works/pi — packages/telemetry/](https://github.com/earendil-works/pi/tree/main/packages/telemetry)
- [Pi Official Docs: Telemetry](https://pi.dev/docs/latest/telemetry)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
- [Schema-driven Telemetry Design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#telemetry)
- [Conformance Testing Patterns](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/test)

---

## Next Up

> **Part 12: Compaction Deep Dive — Strategy, Token Estimation, Branch Summary, Structured Compaction**
>
> shouldCompact Trigger Conditions, estimateTokens Calculation, findCutPoint Finding Cut Point, generateSummary Generating Summary, prepareCompaction Preparing Context, Branch Summary Generation, Structured Compaction (Extension Custom), CompactionEntry Details, fromHook Mechanism.