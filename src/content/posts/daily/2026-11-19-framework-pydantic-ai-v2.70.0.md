---
title: "框架更新｜Pydantic AI v2.70.0"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.70.0 修了 pydantic-ai-harness 兩個 high severity 的 ReDoS 漏洞，同時新增 ToolSearch、PruneToolResults、StreamGuardrail 等 harness 原語"
tldr: "Pydantic AI v2.70.0 最關鍵的是兩個 high severity 安全公告：ToolOutputLimits 的 ANSI 清除與 secret redaction 的 jwt pattern 都有 ReDoS 風險，攻擊者能用工具輸出內容把 event loop 卡住數十秒到數分鐘，請立即升級 pydantic-ai-harness 到 0.70.0。"
series:
  name: "AI Framework Changelog"
  order: 70
---

> 🌏 [English version](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.70.0 |
| 前一版 | [v2.69.0](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0) |
| 發布日 | 2026-11-17 |
| Release Notes | [v2.70.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## 這個版本為什麼重要

這版的頭條不是新功能，是兩個官方標成 high severity 的安全公告：`pydantic-ai-harness` 裡「清除 ANSI 逃脫序列」和「用正規表達式找 JWT 來遮罩」的程式碼，都用了一個時間複雜度是輸入長度平方的 pattern。只要攻擊者能影響工具回傳的內容（例如 shell 指令、讀檔、抓網頁、MCP server），送幾百 KB 刻意construct 的文字就能讓 event loop 卡住數十秒到數分鐘，這段時間內同一個 process 上的其他 request 和 agent run 全部被卡住。對任何把 agent 接到「輸出內容攻擊者可影響」的工具上的團隊來說，這不是要不要升級的功能選擇，是要馬上處理的資安問題。功能面則延續上一版的方向，往「harness 裡的 agent 要怎麼互相管理對方的輸出與失敗」繼續補洞。

## 重要變更

- **ToolOutputLimits 的 ANSI 清除 ReDoS（GHSA-m4cr-m4qc-9hh3，high）**：`strip_ansi=True` 時用來清除 ANSI 逃脫序列的 pattern 是平方時間複雜度 → 幾百 KB 含大量未結束逃脫序列的工具輸出就能讓 event loop 卡住數十秒到數分鐘，影響所有把 `strip_ansi` 設成 `True`（舊名 `OverflowingToolOutput`）且工具輸出內容可被攻擊者影響的應用
- **Secret redaction 的 jwt pattern ReDoS（GHSA-5m5q-5qj4-gx9h，high）**：`redact_secrets` / `secret_data()` 預設啟用的 `jwt` pattern 用了會回溯（backtrack）的正規表達式，一樣是平方時間複雜度 → 同步 guard 跑在 event loop 上，幾百 KB 刻意構造的文字（使用者 prompt 或工具回傳內容）就能卡住整個 process
- **ToolSearch**：新增工具選擇器，可以把工具定義延後到真正要用時才查詢載入（pre-search deferral）→ 工具數量很多時不用把所有 schema 一次全塞進 context
- **PruneToolResults**：讓 model 可以把剛收到的工具結果替換成自己寫的摘要 → 長對話裡舊的工具輸出不用一直佔著 context
- **StreamGuardrail**：在呼叫端看到串流的文字、thinking、tool-call 片段之前先過一層檢查 → guardrail 不用等整個 response 跑完才能介入
- **SubAgent(on_model_error=)**：子 agent 遇到 model 錯誤時可以單獨指定要重試還是直接回傳，和 `on_failure` 分開設定 → 子 agent 的錯誤處理不用再和整體失敗邏輯綁在一起

下圖示意這條攻擊鏈：攻擊者藏在工具輸出裡的字串觸發平方時間掃描，連其他 agent run 的請求都被一起拖住。

```diagram
title: pydantic-ai-harness 的 ReDoS 攻擊鏈
desc: 攻擊者在工具輸出裡夾帶刻意構造的字串，harness 用平方時間的正規表達式處理時卡住 event loop，連其他 agent run 的請求都被拖住。
caption: 簡化示意，實際卡住時間依輸入大小與伺服器負載而不同
step: 攻擊者對工具送出夾帶未結束逃脫序列或 JWT-like 字串的輸入
step: 工具把這段內容原封不動回傳給 harness
step: harness 用平方時間的正規表達式掃描，event loop 被佔住
step: 另一個 agent run 同時送出新的呼叫
step: 那個呼叫等到逾時，沒有收到回應
step: 原本送出工具呼叫的那一端，數十秒後才拿到回應
---
<svg viewBox="0 0 640 416">
  <line class="dg-rule" x1="88" y1="72" x2="88" y2="392"/>
  <line class="dg-rule" x1="248" y1="72" x2="248" y2="392"/>
  <line class="dg-rule" x1="408" y1="72" x2="408" y2="392"/>
  <line class="dg-rule" x1="568" y1="72" x2="568" y2="392"/>

  <g data-step="1">
    <path class="dg-line" d="M88 120H244" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="166" y="108" text-anchor="middle" dominant-baseline="central">夾帶惡意字串</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M248 164H400" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="324" y="152" text-anchor="middle" dominant-baseline="central">回傳工具輸出</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--accent" d="M412 208H440Q448 208 448 216V224Q448 232 440 232H416" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="460" y="220" text-anchor="start" dominant-baseline="central">平方時間掃描</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M568 264H416" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="492" y="252" text-anchor="middle" dominant-baseline="central">送出新呼叫</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M412 308H564" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="488" y="296" text-anchor="middle" dominant-baseline="central">逾時無回應</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--dashed" d="M404 352H252" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="328" y="340" text-anchor="middle" dominant-baseline="central">延遲數十秒後回應</text>
  </g>

  <rect class="dg-box dg-box--warn" x="404" y="152" width="8" height="212" rx="2" data-step="2 3 4 5 6"/>

  <rect class="dg-box" x="24" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="88" y="48" text-anchor="middle" dominant-baseline="central">攻擊者</text>
  <rect class="dg-box" x="184" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="248" y="48" text-anchor="middle" dominant-baseline="central">工具</text>
  <rect class="dg-box dg-box--accent" x="344" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="408" y="48" text-anchor="middle" dominant-baseline="central">Harness</text>
  <rect class="dg-box" x="504" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="568" y="48" text-anchor="middle" dominant-baseline="central">其他 Agent</text>
</svg>
```

## Breaking Changes

本版沒有函式改名或簽名異動，但有幾個行為變嚴格的相容性注意事項：

- `OpenAIChatModel` 在 GPT-6 系列模型開啟 reasoning 時，若還是送工具定義過去，現在會直接丟 `ModelRequestRejectedError`，不再悄悄送出讓模型自己決定要不要用
  - 影響範圍：對 GPT-6 reasoning 模型呼叫時仍帶 tools 的程式碼
- `GroqModel` 同時使用 `NativeOutput` 和 function tools 時，現在會丟 `UserError`
  - 影響範圍：在 Groq 上混用 `NativeOutput` 和 function tools 的程式碼
- OpenRouter 的 `qwen/qwen3.8-flash` 在 reasoning 開啟時強制指定 `tool_choice`，現在會 fallback 成 `'auto'` 或丟 `ModelRequestRejectedError`（該模型本身拒絕在 reasoning 時被強制指定工具）
  - 影響範圍：對該模型強制設定 `tool_choice` 的程式碼

## 遷移指南

### 從 2.69.x 升級到 2.70.0

```bash
pip install --upgrade pydantic-ai==2.70.0 pydantic-ai-harness==0.70.0
```

兩個安全公告都「预设行為不變，但建議立即處理」：

```python
# 1. 若有設定 strip_ansi=True（或舊名 OverflowingToolOutput）
# 升級前的暫時規避：改回預設值 False
ToolOutputLimits(strip_ansi=False)

# 2. 若用 redact_secrets() 或 secret_data() 且依賴預設的 jwt pattern
# 升級前的暫時規避：明確列出需要的 pattern，排除 jwt
secret_data(only=["aws_key", "api_key"])  # 不含 jwt
```

這兩個規避方式都只是「升級前暫時用」，正式修法是把 `pydantic-ai-harness` 升到 0.70.0 以上。另外要注意：Pydantic AI v1 的 harness 卡在 0.4.0 無法再升，要吃到這個修正必須先升到 Pydantic AI v2。

## 與其他框架的對比觀察

同一週 [CrewAI 1.15.42](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42) 把 soupsieve 依賴版本拉高修掉 CVE-2026-126190，Pydantic AI 這版則是自己 harness 程式碼裡的 ReDoS。兩者合在一起看出一個趨勢：agent 框架的安全公告已經不只是「依賴套件有洞」這種轉手問題，愈來愈多是框架自己處理「LLM／工具輸出內容」這類天生不可信輸入時寫出來的程式碼本身就有洞——這正好呼應了 [Agno v3.2.1](/posts/daily/2026-11-18-framework-agno-v3.2.1) 和上一篇 Pydantic AI v2.69.0 文章提到的觀察：框架之間的競爭已經延伸到執行環境層，而執行環境層的安全強度，現在也開始變成要看的指標之一。

## 今日收穫

之前以為 ReDoS 只是「正規表達式沒寫好」的效能 bug，頂多讓單次 request 變慢。這次看到官方特地為兩個字串處理函式（清 ANSI、找 JWT）各發一個 high severity 的 GHSA 公告才意識到：agent harness 處理的是「內容可能被攻擊者操控」的工具輸出，看起來人畜無害的字串清理邏輯，本身就是攻擊面——而且因為它們跑在 event loop 上，一次觸發卡住的不是一個 request，是同一個 process 上所有正在跑的 agent。

## 參考資料

- [Pydantic AI v2.70.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)
- [GHSA-m4cr-m4qc-9hh3：Harness ToolOutputLimits ANSI stripping ReDoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m4cr-m4qc-9hh3)
- [GHSA-5m5q-5qj4-gx9h：Harness JWT redaction ReDoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5m5q-5qj4-gx9h)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.69.0...v2.70.0](https://github.com/pydantic/pydantic-ai/compare/v2.69.0...v2.70.0)
- [PR #13139：ToolSearch tools selector](https://github.com/pydantic/pydantic-ai/pull/13139)
- [PR #13634：PruneToolResults](https://github.com/pydantic/pydantic-ai/pull/13634)
- [PR #13667：StreamGuardrail](https://github.com/pydantic/pydantic-ai/pull/13667)
- [PR #13738：SubAgent(on_model_error=)](https://github.com/pydantic/pydantic-ai/pull/13738)
- [CrewAI 1.15.42 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)
- [Pydantic AI v2.69.0 深入介紹（上一版：沙箱後端與 Peers）](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0)
