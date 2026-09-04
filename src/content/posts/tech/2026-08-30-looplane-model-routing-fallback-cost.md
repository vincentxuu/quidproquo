---
title: "Looplane 的 model roles、fallback、cache hints 與 estimated cost"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, llm-routing, prompt-caching, cost-tracking]
lang: zh-TW
tldr: "Looplane 用靜態 model role catalog 提供候選順序，只對 retryable provider error 重試與 fallback；cache 是 provider hint 加 trace，cost 是靜態價表估算。三者都留下訊號，但都不是即時營運路由或帳單。"
description: "追蹤 Looplane 如何選擇 model role 候選、處理 retry/fallback、產生 provider cache hint，以及用靜態價表留下 best-effort cost estimate。"
series:
  name: "Looplane 架構拆解"
  order: 6
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost-en)

[上一篇](/posts/tech/2026-08-23-looplane-model-provider-multigateway)處理的是 protocol：各家 API 怎麼收斂成 canonical `ModelTurn`。這篇才處理一次 request 遇到失敗時往哪裡走，以及 cache 與 cost 資訊到底代表什麼。

## Model role 是靜態候選表

`provider_catalog.py` 定義 model roles、route metadata、候選順序與價表。role 可以把「這次需要 coding model」轉成一組預先配置的候選，但它不會即時查詢供應商健康度、剩餘額度或最新價格，也不會根據上一輪品質自動競價。

`AgentRunner` 接收主要 model 與 fallback models，形成固定 candidate sequence。這是明確、可測的路由設定，不是 autonomous cost optimizer。若 catalog 不認識某個 model，執行仍可繼續，只是後面的 cost estimate 會是未知。

## 只有 retryable failure 會進重試

每個候選都有自己的 attempt budget。`_complete_model_with_retry()` 捕捉 canonical `ProviderError` 後，只對 `retryable=True` 的 transport／rate-limit 類型重試；等待時間會考慮 provider 的 Retry-After，再套用 bounded backoff。該候選用完次數才移到下一個 fallback。

AUTH 與 INVALID_REQUEST 不會靠換個時間再送同一份 request 解決，因此立即失敗。這個區分很重要：盲目 fallback 可能把 credential 或 request schema 問題藏起來，還產生更多無用請求。

每次 retry 與 fallback 都會寫 event，留下原 provider、model、attempt 與原因。最後看到另一個模型名稱時，仍能從 journal 還原整條失敗切換的 control flow。

## Cache hint 不是 Looplane response cache

`cache_strategy.py` 先把 prompt 拆成穩定與動態部分，再把穩定 prefix 和 tool schema 算成 cache key。不同 adapter 會收到不同提示：Anthropic 使用 stable-prefix cache control；OpenAI-compatible／Responses 使用 prompt cache key；Workers AI 目前不加 hint。

Looplane 不會把模型回答存起來，下一次遇到相同 prompt 就直接回傳舊答案。它做的是 provider hint mapping 與 trace：若 provider 回報 cache usage metadata，run bundle 會記錄 cache trace；沒有 metadata 時只能標示無法確認。改動動態 workspace context 不必然改變 stable key，但改動 tool schema 或穩定 prompt 會。

## Estimated cost 不是帳單

模型回傳 usage 後，`estimate_cost()` 用 repository 內的靜態單價表計算 `CostBreakdown`。contract 明寫這是 best-effort estimate，不能當 billing authority。價表未知就回傳 `None`，不拿零元代替不知道。

若同一個 run 經過多個 provider/model，Looplane 保留各 lane 的 usage 與 estimate，但不硬湊成單一 aggregate cost。這避免不同計價語意或缺漏資料被一個看似精確的總數掩蓋。

## 四條容易混淆的界線

| 訊號 | 可以說 | 不可以說 |
|---|---|---|
| model role | 靜態推薦與候選順序 | 即時最佳模型 |
| retry/fallback | retryable error 的受限切換 | 所有錯誤都會自動復原 |
| cache trace | provider hint 與回報訊號 | Looplane 自建 response cache |
| cost estimate | 依靜態價表推估 | 最終帳單或最新價格 |

下一篇是 [ExternalCodingRunner](/posts/tech/2026-08-23-looplane-external-coding-runner)：它不是這組 model fallback 的另一個 provider，而是擁有自己 loop 與 tools 的第二條 runtime lane。

---

## 參考資料

- [Looplane provider catalog](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/provider_catalog.py)
- [retry and fallback loop](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)
- [cache strategy](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/cache_strategy.py)
- [cache and cost tests](https://github.com/vincentxuu/looplane/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
