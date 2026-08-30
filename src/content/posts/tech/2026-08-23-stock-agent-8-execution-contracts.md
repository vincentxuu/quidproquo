---
title: "台股研究 Agent 實戰系列（篇 8）：研究到模擬單的邊界：content-addressed 執行合約"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, ai-agent, pydantic, content-addressing, audit]
lang: zh-TW
tldr: "用三個 frozen Pydantic 合約把「研究成果」和「下單權限」之間焊死：內容定址、八道硬性閘門、paper-only，agent 永遠摸不到憑證。"
description: "stock-research-agent 的 M7 執行邊界設計：content-addressed StrategyArtifact、八道 hard gate 的 fail-closed 評估、結構性禁止 live 的 ApprovalDecision，以及憑證永不進 agent context 的 capability matrix。"
draft: false
glossary:
  - term: "content-addressing"
    definition: "用內容的雜湊值（SHA-256）當作物件 ID，內容一改 ID 就變，天然防竄改。"
  - term: "fail-closed"
    definition: "出錯或證據不足時預設拒絕，而不是放行。"
  - term: "frozen"
    definition: "Pydantic 模型的不可變設定，實例建立後欄位不能再改。"
  - term: "hard gate"
    definition: "不通過就直接擋下的強制檢查，沒有人工覆核可以繞過。"
  - term: "capability"
    definition: "權限能力清單，角色能進行哪些操作明確定義。"
---

> 🌏 [English version](/posts/tech/2026-08-23-stock-agent-8-execution-contracts-en)

> **台股研究 Agent 實戰系列（篇 8 / 9）**：[上一篇：Copilot loop：計畫合約、可驗證來源與人類審查](https://quidproquo.cc/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop) ｜ [下一篇：部署邊界：Docker 到 Cloudflare Containers 的公開 API](https://quidproquo.cc/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment) ｜ [完整目錄在篇 1](https://quidproquo.cc/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

研究 agent 幫你寫策略、跑回測、出報告，這些都還算安全——直到它要碰到真錢。這篇講我在 stock-research-agent 裡畫下的那條線：從「研究產出」到「模擬單下單」之間，我用三個不可變的 Pydantic 合約串成一條鏈，讓 LLM 永遠摸不到憑證、永遠改不動評估結果、永遠拿不到 live 權限。這是專案裡我寫得最不妥協的一段程式碼，也希望你看完能理解為什麼。

## 三個合約串成一條鏈

整個設計的核心在 `src/stock_agent/execution/contracts.py`，三個 frozen Pydantic v2 模型：

```text
StrategyArtifact ──(artifact_id)──▶ ApprovalDecision ──(environment)──▶ ExecutionGateway
       \                                /
        \──── (EvaluationReport.evaluation_id) ────/
```

StrategyArtifact 是「可以跑的策略包」：程式碼、參數、universe、資料 snapshot id、依賴版本。EvaluationReport 是 deterministic 評估器對這份 artifact 跑的八道硬閘門結果。ApprovalDecision 是人類審查者簽核後產生的限時授權，這是 ExecutionGateway 唯一接受的授權形式。

三個模型共同的不變式：

- `frozen=True` + `extra="forbid"`：建了就不能改，多一個欄位直接建構失敗。
- `artifact_id` 和 `evaluation_id` 是 canonical JSON（鍵排序、無空白、UTF-8、不允許 NaN/Inf）的 SHA-256。id 由系統算，caller 給了不同的 id 就是 validation error。
- 整個模組零 I/O：不讀環境變數、不連網路，`_now_utc()` 都可被測試 mock。它是一個 dependency-free 的葉節點，Gateway 可以直接 import 用。

## Content addressing 的威力

為什麼要搞 content addressing？因為它讓「改東西」變成一件藏不住的事。

StrategyArtifact 的 hash 涵蓋 code、language、parameters、universe、data_snapshot_id、dependencies 六個欄位。你改一個參數、調一個 universe 的 symbol、換一個資料 snapshot——hash 就變了，舊的 ApprovalDecision 指向的還是那個舊 hash，當場死亡。而且 Gateway 在**每次 dispatch 前**重新驗算兩個 hash（artifact + evaluation），外加檢查 `decision.artifact_id == report.artifact_id`，所以一份評估永遠不能偷渡給另一份 artifact 用。

還有一個我特別堅持的細節：`metadata` 欄位刻意**不進 hash**。它是資訊性的標註，標註不該改變「你批准了什麼」。反之，想改任何會進 hash 的欄位，唯一合法路徑是 `with_field_replaced(**patch)`——回傳一個新 id 的新物件，舊的原封不動，舊的批准一起陪葬。近似的策略不是現在的策略，這就是內容定址想保證的。

另外一個防呆：universe 裡有空白 symbol 或重複依賴版本在建構時直接 raise，不是 logging 之後靜靜丟掉。before-validator 會先把 universe/deps 正規化到 canonical form，所以兩個邏輯上等價的 caller 會得到完全相同的 hash。

## 八道閘門，fail-closed，LLM 改不動

EvaluationReport 有八個 hard gate：citation valid、point-in-time、out-of-sample、cost realistic、sample size adequate、drawdown within limits、reproducible、code policy ok。每個 gate 是 boolean 加一條 reason 字串，由 deterministic evaluator 產生——**不是 LLM 寫的**。

設計上最狠的一刀：`passed` 永遠是八個 gate 的 AND，由 validator 自己算。如果有人（LLM critic、reviewer UI、手賤的工程師）建構時塞了 `passed=True` 但有任何一個 gate 是 False，建構直接 raise ValueError。任何 fail 都沒有覆寫路徑，唯一合法的恢復方式是改 artifact、重跑評估。`metrics` 和 `warnings` 是 soft 欄位，純資訊性，永遠不影響 `passed`。`hard_failures()` 用固定順序回傳失敗的 gate 名稱，讓 log 是 deterministic 的。

這呼應專案前面幾篇的精神：證據不足就 fail，不 fail 才需要證據。Cold truth：LLM 很會寫「看起來合理」的評估，所以我不讓它寫。

## Paper-only 是結構性保證，不是設定

M7.1 階段，`ApprovalDecision.environment` 只接受 `"paper"`。試圖建構任何 `"live"` 決策——包括想用 parent chain 偷渡 promotion——直接 raise `PromotionForbiddenError`。也就是說 live 授權在這個版本是**結構上不可能存在**的物件，不是「預設關閉的開關」。未來要上 live（M7.4）也要走全新的雙重審查流程，一個 fresh decision，不是升級舊的。

Paper 授權本身也有邊界：期限 ≤24 小時、capability-scoped、綁定 evaluation/approval 的 hash。過期就是 `ExpiredApprovalError`，解法是新跑一次審查，不是 retry。

Capability matrix 切成三個角色：Research Agent 只持有 `compile`、`backtest`、`read` 三個能力，永遠不會拿到 `deploy_paper` 或任何 live-mutating 能力；`stop`、`cancel_orders`、`liquidate` 這些都是 Gateway-only。憑證只活在 Execution Gateway 裡，永遠不進 agent 的 context、prompt 或 trace。Agent 可以**請求**操作，但 capability 檢查發生在 Gateway 內部，擋下來就是 `InsufficientCapabilityError`。Timeout 一律走 reconciliation 流程查實際狀態，不盲目 retry——盲目 retry 在下單系統裡就是重複下單的另一種說法。

## 兩個 adapter 與它們的誠實限制

第一個 adapter 是 `QuantConnectAdapter`，只做 compile 和 backtest——這兩個操作不需要憑證進 agent，回測紀錄落在本地 `runs/qc/`。另外配了一個 PaperMonitor 做 paper 交易結果 vs 回測 envelope 的對比。我在 `docs/quantconnect-api-notes.md` 裡把 QC paper 的限制寫得很白：DefaultBrokerageModel 預設**沒有滑價**，market order 立即全額成交，而且 QC 的雲端券商清單裡沒有任何台灣券商。這些不是小字，是它能不能代表台股實盤的大前提。

第二個是 `ShioajiSimulationAdapter`：用 SDK seam 設計（shioaji 本身不是專案依賴），行情和成交只走 callback，配上獨立 ledger 做對帳，憑證和錯誤訊息都會 redact。

M7.2 的 `approval_gate` 也已經接進 graph 了：它是一個 sanitized interrupt——payload 只有 id 和 metrics，不含程式碼也不含報告全文；resume 值必須是一個 paper-only 的 ApprovalDecision，而且綁定這次 run 的 `artifact_id` + `evaluation_id`，不符合就 fail closed。沒有注入 dispatcher 時整張圖就是純研究模式（`evaluation_gate → END`），Gateway dispatch 永遠是 backend 端的一條獨立 seam。

## 整體來說

這一層合約學到的事：對於「agent 碰到錢」這件事，不要相信 prompt、不要相信流程圖上的虛線、不要相信「我們之後會加檢查」。要讓違規**在建構時就炸掉**。Content addressing 讓竄改藏不住，frozen + forbid 讓變形不可能，gate 的 AND 由 validator 算讓 LLM 碰不到結果，`PromotionForbiddenError` 讓 live 根本不存在。這些都是幾十行程式碼的事，但它們換來的是審計軌跡上每一個 hash 都可信。Open question 也還有：universe 的 ticker 正規化（`2330.TW` vs `2330` 現在會 hash 出不同結果）該歸哪層管、`limits` 什麼時候要正式長成一個 model——這些等第一個 adapter 真正落地再說。

---

## 參考資料

- [stock-research-agent：M7.1 Execution Contracts](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/m7.1-contracts.md)
- [stock-research-agent README：Research-to-Paper execution boundary (M7)](https://github.com/vincentxuu/stock-research-agent#research-to-paper-execution-boundary-m7)
- [QuantConnect API notes（paper 限制與端點語義）](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/quantconnect-api-notes.md)
- [QuantConnect Cloud Platform API Reference](https://www.quantconnect.com/docs/v2/cloud-platform/api-reference)
