---
title: "沙箱可觀測性與審計軌跡"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, observability, audit, logging, trace, ai-agent, security]
lang: zh-TW
tldr: "沙箱系列的安全篇（order 23）。沙箱執行的工具呼叫、檔案操作、網路請求如何建立可審計軌跡，trace-level 可見度、immutable 日誌、SIEM 整合，以及委譲鏈身份落差。"
description: "沙箱可觀測性與審計軌跡：trace-level 可見度、不可篡改日誌、SIEM 整合、委譲鏈身份、合規審計。"
series:
  name: "沙箱系列"
  order: 23
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-sandbox-observability-en)

## 本文定位

這篇是沙箱系列的「安全篇」（order 23）。它不講沙箱技術細節（在 order 2–18），而是講「沙箱執行後怎麼知道發生了什麼」：

1. **可觀測性與審計軌跡的差異** —— observability vs audit trail
2. **沙箱執行要記錄什麼？** —— 工具呼叫、檔案操作、網路請求、行程生命週期
3. **trace-level 可見度怎麼做？** —— 串流、日誌、指標
4. **immutable 日誌怎麼實作？** —— HMAC 簽章、SIEM 整合
5. **委譲鏈身份落差怎麼解決？** —— 原始使用者身份在工具呼叫鏈中的傳遞

---

## 可觀測性 vs 審計軌跡：兩者的差異

這兩個概念常被混用，但它們解決不同的問題：

| 維度 | 可觀測性 (Observability) | 審計軌跡 (Audit Trail) |
|------|------------------------|----------------------|
| 問題 | 代理程式現在在做什麼？ | 代理程式之前做了什麼？ |
| 重點 | 即時狀態、效能、錯誤 | 歷史記錄、歸責、合規 |
| 資料 | traces、logs、metrics、events | immutable records、signed logs |
| 使用者 | 工程師、SRE | 安全工程師、合規官、稽核員 |
| 輸出 | 儀表板、警報、追蹤 | 報告、證據、稽核紀錄 |

簡單來說：**可觀測性回答「現在發生了什麼」，審計軌跡回答「之前發生了什麼，誰負責，能否證明給監管機構看」。**

---

## 沙箱執行要記錄什麼？

沙箱內的每一個代理程式執行，應該記錄以下五類事件：

### 1. 工具呼叫 (Tool Calls)

| 欄位 | 說明 |
|------|------|
| tool_name | 工具名稱（例如 `run_python_code`） |
| tool_input | 工具輸入參數 |
| tool_output | 工具輸出結果 |
| start_time | 開始時間戳 |
| end_time | 結束時間戳 |
| duration | 執行耗時 |
| sandbox_id | 沙箱實例 ID |
| agent_id | 代理程式 ID |

### 2. 檔案操作 (File Operations)

| 欄位 | 說明 |
|------|------|
| operation | 讀取/寫入/刪除/建立 |
| path | 檔案路徑（沙箱內絕對路徑） |
| size | 檔案大小 |
| user_id | 執行使用者 ID |
| timestamp | 時間戳 |

### 3. 網路請求 (Network Requests)

| 欄位 | 說明 |
|------|------|
| method | HTTP 方法 |
| url | 目標 URL |
| status_code | 回應狀態碼 |
| response_size | 回應大小 |
| duration | 耗時 |
| user_id | 執行使用者 ID |

### 4. 行程生命週期 (Process Lifecycle)

| 欄位 | 說明 |
|------|------|
| event | 建立/暫停/恢復/銷毀 |
| pid | 行程 ID |
| sandbox_id | 沙箱 ID |
| timestamp | 時間戳 |

### 5. 權限決策 (Authorization Decisions)

| 欄位 | 說明 |
|------|------|
| action | 允許/拒絕 |
| resource | 資源路徑 |
| reason | 決策原因 |
| policy_id | 策略 ID |

---

## Trace-level 可見度：怎麼做？

trace-level 可見度要求將沙箱內的每一個動作串成完整的追蹤鏈，從「使用者輸入提示詞」到「最後一個工具輸出」，中間的每一個決策都可追溯。

### 追蹤鏈範例

```
使用者輸入：「幫我分析這個專案的設定檔」
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
最終輸出：分析報告
```

每個節點都應該記錄：輸入、輸出、耗時、沙箱 ID、使用者 ID、決策原因。

---

## Immutable 日誌：怎麼實作？

審計軌跡的核心要求是「不可篡改」。如果日誌可以被修改，它就無法作為證據。

### HMAC 簽章

每條日誌記錄應該附上 HMAC 簽章，確保記錄未被竄改：

```python
import hmac
import hashlib
import json
from datetime import datetime

def sign_log_entry(entry: dict, secret_key: bytes) -> str:
    """對日誌記錄進行 HMAC 簽章"""
    entry_copy = entry.copy()
    entry_copy.pop("signature", None)
    canonical = json.dumps(entry_copy, sort_keys=True, separators=(",", ":"))
    signature = hmac.new(secret_key, canonical.encode(), hashlib.sha256).hexdigest()
    return signature

def verify_log_entry(entry: dict, secret_key: bytes) -> bool:
    """驗證日誌記錄簽章"""
    expected = sign_log_entry(entry, secret_key)
    return hmac.compare_digest(entry.get("signature", ""), expected)
```

### 日誌範例

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

### SIEM 整合

日誌應該能輸出到企業 SIEM（Splunk、Datadog、Microsoft Sentinel），供安全團隊集中監視與警報。

---

## 委譲鏈身份落差 (Delegation-Chain Identity Gap)

這是 2026 年安全領域的一個重要發現：**當代理程式調用工具，而該工具又調用另一個工具時，原始使用者的身份往往會丟失。**

### 問題說明

```
使用者 A ──► 代理程式 X ──► 工具 Y ──► 工具 Z
  (身份)         (身份?)        (身份?)       (身份?)
```

工具 Z 最終執行操作時，可能只知道「是代理程式 X 呼叫的」，而不知道「原始使用者是 A」。這導致：
- 無法歸責：出了問題，不知道是哪個使用者造成的
- 無法審計：合規報告無法列出「誰做了什麼」
- 無法授權：工具 Z 無法根據原始使用者的權限做決策

### 解決方案

1. **傳遞原始使用者 ID**：每個工具呼叫應該攜帶原始使用者 ID，而不只是代理程式 ID
2. **身份鏈記錄**：日誌中記錄完整的呼叫鏈：user → agent → tool → tool
3. **權限繼承**：工具 Z 的權限應該受限於原始使用者 A 的權限，而不只是代理程式 X 的權限

### 日誌中的身份鏈範例

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

## 與合規框架的對照

沙箱審計軌跡應該能支援常見合規框架：

| 合規框架 | 相關要求 | 沙箱審計軌跡如何滿足 |
|----------|----------|---------------------|
| SOC 2 | 邏輯存取控制、監控、變更管理 | 記錄所有工具呼叫與權限決策 |
| HIPAA | 審計控制、唯一使用者識別 | 委譲鏈身份、不可篡改日誌 |
| GDPR | 資料處理記錄、同意管理 | 記錄個資存取與傳輸 |
| ISO 27001 | A.12.4 記錄與監控 | 系統化日誌收集與保留 |
| EU AI Act | 風險管理、透明度 | 代理程式行為可追溯 |

---

## 讀完本文你應該理解

1. 可觀測性與審計軌跡的差異，以及兩者各自的用途。
2. 沙箱執行應該記錄的五類事件：工具呼叫、檔案操作、網路請求、行程生命週期、權限決策。
3. 什麼是 trace-level 可見度，以及如何串成完整追蹤鏈。
4. 如何用 HMAC 簽章實作不可篡改日誌，並輸出到 SIEM。
5. 委譲鏈身份落差問題，以及如何透過身份鏈記錄解決。
6. 沙箱審計軌跡如何支援 SOC 2、HIPAA、GDPR、ISO 27001、EU AI Act 等合規框架。

---

## 參考資料

- [AI agent observability and audit logging for the enterprise](https://witness.ai/blog/ai-agent-observability)
- [AI Agent Audit Trails Explained: The Missing Layer of Enterprise AI Governance](https://www.miniorange.com/blog/ai-agent-audit-trail)
- [AI Agent Observability: A Complete Guide for 2026 & Beyond](https://atlan.com/know/ai-agent-observability)
- [Top 8 AI Agent Observability Platforms for 2026 - Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-agent-observability-tools-2026)
- [6 Best AI Agent Observability Tools for Production in 2026 | Splunk](https://www.splunk.com/en_us/blog/learn/best-agent-observability-platforms.html)
- [Coalition for Secure AI: Treat Your Agent Like an Insider Threat](https://www.coalitionforsecureai.org/treat-your-agent-like-an-insider-threat-why-ai-sandboxing-cant-wait)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：AI Agent 沙箱逃逸與權限邊界（order 21）](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries)
- [本站：金融/醫療合規與沙箱審計（order 24）](/posts/tech/2026-08-30-sandbox-compliance)
