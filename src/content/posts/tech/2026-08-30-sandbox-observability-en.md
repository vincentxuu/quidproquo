---
title: "Sandbox Observability & Audit Trails"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, observability, audit, logging, trace, ai-agent, security]
lang: en
tldr: "The security post (order 23) of the Sandbox Series. How tool calls, file operations, and network requests inside sandbox execution build auditable trails, trace-level visibility, immutable logs, SIEM integration, and the delegation-chain identity gap."
description: "Sandbox observability and audit trails: trace-level visibility, immutable logs, SIEM integration, delegation-chain identity, compliance audit."
series:
  name: "Sandbox Series"
  order: 23
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-sandbox-observability)

## What This Post Is

This post is the "security" post (order 23) of the Sandbox Series. It doesn't cover sandbox technical details (in order 2–18), but covers **"what happened after sandbox execution"**:

1. **Observability vs. audit trail** — the difference
2. **What should be recorded in sandbox execution?** — tool calls, file operations, network requests, process lifecycle
3. **How to do trace-level visibility?** — streams, logs, metrics
4. **How to implement immutable logs?** — HMAC signatures, SIEM integration
5. **How to solve the delegation-chain identity gap?** — propagating original user identity through tool call chains

---

## Observability vs. Audit Trail: The Difference

These two concepts are often confused, but they solve different problems:

| Dimension | Observability | Audit Trail |
|-----------|--------------|-------------|
| Question | What is the agent doing now? | What did the agent do before? |
| Focus | Real-time state, performance, errors | Historical records, accountability, compliance |
| Data | traces, logs, metrics, events | immutable records, signed logs |
| Users | Engineers, SREs | Security engineers, compliance officers, auditors |
| Output | Dashboards, alerts, traces | Reports, evidence, audit records |

Simply put: **observability answers "what is happening now," audit trail answers "what happened before, who is responsible, can it be proven to regulators."**

---

## What Should Be Recorded in Sandbox Execution?

Every agent code execution inside the sandbox should record the following five event types:

### 1. Tool Calls

| Field | Description |
|-------|-------------|
| tool_name | Tool name (e.g., `run_python_code`) |
| tool_input | Tool input parameters |
| tool_output | Tool output result |
| start_time | Start timestamp |
| end_time | End timestamp |
| duration | Execution duration |
| sandbox_id | Sandbox instance ID |
| agent_id | Agent ID |

### 2. File Operations

| Field | Description |
|-------|-------------|
| operation | read/write/delete/create |
| path | File path (absolute path inside sandbox) |
| size | File size |
| user_id | Executing user ID |
| timestamp | Timestamp |

### 3. Network Requests

| Field | Description |
|-------|-------------|
| method | HTTP method |
| url | Target URL |
| status_code | Response status code |
| response_size | Response size |
| duration | Duration |
| user_id | Executing user ID |

### 4. Process Lifecycle

| Field | Description |
|-------|-------------|
| event | create/pause/resume/destroy |
| pid | Process ID |
| sandbox_id | Sandbox ID |
| timestamp | Timestamp |

### 5. Authorization Decisions

| Field | Description |
|-------|-------------|
| action | allow/deny |
| resource | Resource path |
| reason | Decision reason |
| policy_id | Policy ID |

---

## Trace-Level Visibility: How to Do It

Trace-level visibility requires chaining every action inside the sandbox into a complete trace chain, from "user input prompt" to "final tool output," with every decision in between traceable.

### Trace Chain Example

```
User input: "Analyze this project's config file"
    │
    ▼
Tool Call: read_file(path="/workspace/config.yaml")
    │
    ▼
Tool Call: run_python_code(code="import yaml; ...")
    │
    ▼
Tool Call: network_request(url="https://api.example.com/validate")
    │
    ▼
Final output: analysis report
```

Each node should record: input, output, duration, sandbox ID, user ID, decision reason.

---

## Immutable Logs: How to Implement

The core requirement of audit trails is "immutability." If logs can be modified, they cannot serve as evidence.

### HMAC Signature

Each log record should have an HMAC signature to ensure records are not tampered with:

```python
import hmac
import hashlib
import json
from datetime import datetime

def sign_log_entry(entry: dict, secret_key: bytes) -> str:
    """Sign a log entry with HMAC"""
    entry_copy = entry.copy()
    entry_copy.pop("signature", None)
    canonical = json.dumps(entry_copy, sort_keys=True, separators=(",", ":"))
    signature = hmac.new(secret_key, canonical.encode(), hashlib.sha256).hexdigest()
    return signature

def verify_log_entry(entry: dict, secret_key: bytes) -> bool:
    """Verify log entry signature"""
    expected = sign_log_entry(entry, secret_key)
    return hmac.compare_digest(entry.get("signature", ""), expected)
```

### Log Entry Example

```json
{
  "timestamp": "2026-10-27T10:30:00Z",
  "sandbox_id": "sbx-abc123",
  "agent_id": "agent-456",
  "user_id": "user-789",
  "event": "tool_call",
  "tool_name": "run_python_code",
  "tool_input": {"code": "print('hello')"},
  "tool_output": "hello",
  "duration_ms": 125,
  "signature": "a1b2c3d4e5f6..."
}
```

### SIEM Integration

Logs should be exportable to enterprise SIEM (Splunk, Datadog, Microsoft Sentinel) for centralized monitoring and alerting by security teams.

---

## Delegation-Chain Identity Gap

This is an important 2026 security finding: **when an agent calls a tool, and that tool calls another tool, the original user's identity is often lost.**

### Problem Statement

```
User A ──► Agent X ──► Tool Y ──► Tool Z
  (identity)    (identity?)    (identity?)     (identity?)
```

When Tool Z finally executes an operation, it may only know "Agent X called me," not "Original user is A." This leads to:
- **No accountability**: When something goes wrong, don't know which user caused it
- **No audit**: Compliance reports can't list "who did what"
- **No authorization**: Tool Z can't make decisions based on original user A's permissions

### Solution

1. **Pass original user ID**: Each tool call should carry the original user ID, not just the agent ID
2. **Identity chain recording**: Logs should record the complete call chain: user → agent → tool → tool
3. **Permission inheritance**: Tool Z's permissions should be limited by original user A's permissions, not just agent X's permissions

### Identity Chain Log Example

```json
{
  "identity_chain": [
    {"type": "user", "id": "user-789", "role": "analyst"},
    {"type": "agent", "id": "agent-456", "delegated_by": "user-789"},
    {"type": "tool", "id": "tool-101", "delegated_by": "agent-456"},
    {"type": "tool", "id": "tool-102", "delegated_by": "tool-101"}
  ]
}
```

---

## Alignment with Compliance Frameworks

Sandbox audit trails should support common compliance frameworks:

| Compliance Framework | Related Requirements | How Sandbox Audit Trail Meets Them |
|---------------------|---------------------|-----------------------------------|
| SOC 2 | Logical access control, monitoring, change management | Record all tool calls and authorization decisions |
| HIPAA | Audit controls, unique user identification | Delegation-chain identity, immutable logs |
| GDPR | Data processing records, consent management | Record personal data access and transfer |
| ISO 27001 | A.12.4 Logging and monitoring | Systematic log collection and retention |
| EU AI Act | Risk management, transparency | Agent behavior traceable |

---

## What You Should Understand After Reading

1. Difference between observability and audit trail, and each one's purpose.
2. Five event types that sandbox execution should record: tool calls, file operations, network requests, process lifecycle, authorization decisions.
3. What trace-level visibility is, and how to chain into a complete trace.
4. How to implement immutable logs with HMAC signatures and export to SIEM.
5. Delegation-chain identity gap problem, and how to solve it with identity chain recording.
6. How sandbox audit trails support SOC 2, HIPAA, GDPR, ISO 27001, EU AI Act compliance frameworks.

---

## References

- [AI agent observability and audit logging for the enterprise](https://witness.ai/blog/ai-agent-observability)
- [AI Agent Audit Trails Explained: The Missing Layer of Enterprise AI Governance](https://www.miniorange.com/blog/ai-agent-audit-trail)
- [AI Agent Observability: A Complete Guide for 2026 & Beyond](https://atlan.com/know/ai-agent-observability)
- [Top 8 AI Agent Observability Platforms for 2026 - Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-agent-observability-tools-2026)
- [6 Best AI Agent Observability Tools for Production in 2026 | Splunk](https://www.splunk.com/en_us/blog/learn/best-agent-observability-platforms.html)
- [Coalition for Secure AI: Treat Your Agent Like an Insider Threat](https://www.coalitionforsecureai.org/treat-your-agent-like-an-insider-threat-why-ai-sandboxing-cant-wait)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：AI Agent 沙箱逃逸與權限邊界（order 21）](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries-en)
- [本站：金融/醫療合規與沙箱審計（order 24）](/posts/tech/2026-08-30-sandbox-compliance-en)
