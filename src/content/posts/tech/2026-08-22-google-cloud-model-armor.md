---
title: "Google Cloud Model Armor：在 Prompt、Response 與 Agent Tool 前加 Runtime Filter"
date: 2026-08-22
category: tech
type: deep-dive
tags: [model-armor, prompt-injection, ai-security, google-cloud, guardrails]
lang: zh-TW
tldr: "Model Armor 能在 runtime 檢查 prompt injection、jailbreak、敏感資料、惡意 URL 與內容安全；它是 probabilistic detector，不是 authorization 或 sandbox boundary。"
description: "介紹 Google Cloud Model Armor templates、input/output filters、confidence thresholds、Sensitive Data Protection、floor settings、logging、failure modes 與 Agent 防護邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 119
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-google-cloud-model-armor-en)

[Google Cloud Model Armor](https://docs.cloud.google.com/model-armor/overview) 是放在生成式 AI request/response path 的 runtime screening service。Template 可啟用 prompt injection/jailbreak、harmful content、malicious URI、malware 與 Sensitive Data Protection 等 filters，並設定 confidence threshold 與 `INSPECT_ONLY` 或 `INSPECT_AND_BLOCK`。

## Input 與 output 要用不同 policy

User prompt、RAG chunk、web page、uploaded document 與 tool result 都可能帶 indirect prompt injection；input template 應聚焦不可信 instructions、malicious URI、上傳 secrets。Model output template 則聚焦 credential/PII leakage、harmful content 與惡意 link。官方也建議分開 templates，因兩側的 false-positive 成本與風險不同。

Confidence threshold 越低會攔更多可疑內容，也增加合法 request 被擋。先用 inspect-only 對 production-like traffic 建 confusion matrix，依 route/tool risk 設 threshold，不用一套全站數值。High-risk write/delete/payment tool 即使 detector 未命中，仍要 deterministic authorization 與 confirmation；low-risk FAQ 也不能因 false positive 變成不可用。

## Filter output 不是安全決策的唯一依據

Prompt-injection classifier 可能 false negative、被新語言/encoding/多模態繞過，也可能把合法 security discussion 判成攻擊。正確架構是 layered：隔離 instructions 與 untrusted data、限制 tool schema/arguments、per-user authorization、least privilege、side-effect confirmation、sandbox、egress policy、audit，再以 Model Armor 降低進入模型或離開模型的危險內容。

Templates 是 IAM-controlled policy objects；organization/folder/project floor settings 可要求最低 filters，避免某 team 建立更寬鬆 template。仍要測 local setting precedence、inline integration coverage 與繞過路徑，確保所有 model/provider/tool calls 都經過預期 template，而不是只保護一個 chat endpoint。

Logging prompt/response 能支援 incident/debug，卻可能把 PII、credentials 與 proprietary context複製到 log。`log_sanitize_operations` 應預設關閉或經明確 data governance，設定 retention、redaction、access與 region。Model Armor 可透過 REST 保護不同模型/雲，實際 latency、token/file limits、streaming、fail-open/fail-closed 與 service outage 需壓測。

## 參考資料

- [Model Armor overview](https://docs.cloud.google.com/model-armor/overview)
- [Create and manage templates](https://docs.cloud.google.com/model-armor/manage-templates)
- [Configure floor settings](https://docs.cloud.google.com/model-armor/configure-floor-settings)
- [Model Armor logging](https://docs.cloud.google.com/model-armor/configure-logging)
- [Model Armor audit logging](https://docs.cloud.google.com/model-armor/audit-logging-model-armor)
