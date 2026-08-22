---
title: "Promptfoo Red Team：把 Prompt Injection、Tool Misuse 與資料外洩變成 Regression Tests"
date: 2026-08-22
category: tech
type: deep-dive
tags: [promptfoo, red-team, ai-security, prompt-injection, evaluation]
lang: zh-TW
tldr: "Promptfoo 以 plugins 產風險 probes、strategies 變形攻擊、targets 執行系統、graders 判斷結果；有價值的 red team 必須測整個 agent application，而不只是 foundation model。"
description: "介紹 Promptfoo red-team plugins、strategies、targets、graders、agent/RAG/MCP testing、remote generation、CI baselines、false positives 與安全資料處理。"
series:
  name: "AI 時代的技術選擇"
  order: 120
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-promptfoo-ai-red-teaming-en)

[Promptfoo red teaming](https://www.promptfoo.dev/docs/red-team/quickstart/) 把生成式 AI 攻擊測試拆成四塊：plugin 定義要測的 weakness，strategy 決定如何包裝/迭代 payload，target 是模型或完整 application endpoint，grader 判斷是否突破 policy。這篇聚焦 security workflow；站上既有 Promptfoo 一般 evaluation 文章處理的是較廣的 prompt/model 比較。

## Plugin 要對應真實 attack surface

Foundation model 不會直接有 BOLA、SQL injection 或 SSRF；接了 user identity、RAG、database、browser、MCP/tool 才會產生 application-level risk。先畫 data/tool trust boundaries，再選 prompt injection、cross-session leak、excessive agency、RAG poisoning、tool poisoning、SSRF/BOLA 等 plugins。把所有 plugins 全開只會增加 inference cost 與難以判讀的 noise。

Strategies 從 base64、jailbreak templates 等 static transformation，到 iterative attacker model、多輪 coercion、indirect web injection。Dynamic/multi-turn attack 成功率較高，也有 nondeterminism、成本與 rate-limit。固定 config、model/version、seed（若 provider 支援）、attempt/token budget，保存原始 transcripts、tool calls 與 grader evidence。

## Target 必須包含 authorization 與 side effects

只把 system prompt 丟給模型，測不到 retrieval ACL、tool argument validation、user/tenant isolation 或 sandbox egress。Staging target 應使用 synthetic accounts/data、mock 或 reversible tools、最小 credentials；真實 send/delete/payment 不得被 red-team suite 觸發。Coding-agent test 要比對 protected file hash、filesystem diff、commands、network 與 verifier evidence。

Promptfoo 的 attack generation/grading provider 與 target provider 是分開的。部分 community plugins 可能使用 remote generation endpoint；敏感 system prompt、policy、attack transcript 或 customer data 是否外送要依 plugin/provider 設定查清，可配置自有 provider或禁止 remote generation。Scanner local execution 不等於所有 inference 都 local。

## Pass rate 不是安全分數

LLM grader 有 false positive/negative，先對一組人工標註 cases 校準。每個 confirmed exploit 固化成 deterministic regression case，PR 跑低成本高訊號 subset，nightly 跑 dynamic/multi-turn，release 前人工 attack。Gate 可用「已知 critical regression 不得復發」，不要因隨機 pass-rate 小幅波動封鎖全部部署。

Promptfoo 找得到 attack path，Model Armor 是 runtime filter，sandbox/authorization 限制成功攻擊的影響。修補後要問控制落在哪一層：prompt、retrieval filter、tool schema、permission、confirmation、network policy或 output filter，並用原 attack重跑。

## 參考資料

- [Promptfoo red-team quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)
- [Red-team architecture](https://www.promptfoo.dev/docs/red-team/architecture/)
- [Red-team configuration](https://www.promptfoo.dev/docs/red-team/configuration/)
- [Plugins](https://www.promptfoo.dev/docs/red-team/plugins/)
- [Strategies](https://www.promptfoo.dev/docs/red-team/strategies/)
- [Agent and RAG red-team guides](https://www.promptfoo.dev/docs/red-team/guides/)
- [Coding-agent plugins](https://www.promptfoo.dev/docs/red-team/plugins/coding-agent/)
