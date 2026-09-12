---
title: "AI-Native SDLC Playbook L13：用監控閉環讓 SDLC 自己轉起來"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, monitoring, metrics, autonomous-agent, devops]
lang: zh-TW
tldr: "Stage 6 是整個 AI-Native SDLC 的收尾也是起點：監控腳本偵測異常 → Claude 自動寫診斷報告為 intent.md → 走完整個開發流程。人從「發起工作」變成「分類和審查工作」。"
description: "Claude Academy 第 13 堂課導讀：監控閉環如何讓 AI agent 自主偵測異常、產出 intent.md 並驅動整個 SDLC 管線，附 Western Electric 規則與分級回應的實作方式。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 13
---

前面 12 堂課建立的每一個機制——intent.md、spec.md、plan mode、CLAUDE.md、Skills、Hooks、CI evals、PR review——到這堂課全部串成一個迴圈。Stage 6: Maintain 的核心論點是：**當所有階段都有 agent 參與，監控系統偵測到的異常可以直接變成 intent.md，自動走完整個管線**。人不再需要發起工作，只需要分類和審查 agent 產出的結果。

這是整門課最有野心的一堂，也是最需要前面所有基礎設施到位才能執行的一堂。

## 課程教了什麼

### 從被動回應到主動閉環

傳統維運是被動的：凌晨三點收到告警、工程師爬起來看 dashboard、手動排查、寫 post-mortem、把修正排進下個 sprint——如果還有時間的話。很多 post-mortem 的 action item 永遠躺在 backlog 裡。

AI-native 的做法是讓監控腳本在偵測到異常時自動呼叫 Claude。依課程的說法：「People triage and review that work, and no longer have to start it.」人的角色從「發起工作」轉移到「分類和審查工作」。

### 偵測腳本：確定性的，不用模型

課程特別強調偵測腳本本身是**完全確定性的**——用 mean + standard deviation 計算 rolling baseline，搭配 [Western Electric rules](https://en.wikipedia.org/wiki/Western_Electric_rules) 判斷是否偏離。沒有任何 LLM 介入。這很重要：你不會想讓一個機率模型來決定要不要觸發另一個機率模型。

偵測的對象可以是任何有穩定 baseline 的指標：
- CI 測試失敗率
- 部署後 5xx 錯誤率
- PR 合併週期時間

### 分級回應：bands.yaml

課程定義了三個回應層級，寫在版控的 config 檔裡：

```yaml
metric: ci_test_failure_rate
baseline: rolling_30d
rules: western_electric
tiers:
  1sigma: { action: log }
  2sigma: { action: diagnose,
            tools: "Read,Grep,Bash(gh run view *)" }
  3sigma: { action: propose,
            routes: [pull_request, runbook:rollback-deploy] }
```

- **1σ**：只記 log，不做任何事
- **2σ**：Claude 以唯讀模式做診斷，看 log、讀程式碼、找原因
- **3σ**：Claude 可以採取行動——開 PR 或觸發預先核准的 runbook（例如 rollback）

這個設計的精髓在於：**低信號時不要浪費 token，高信號時才讓 agent 動手**。而且 agent 能做的事仍然受 hooks 限制——它開的 PR 要通過 review gate，觸發的 runbook 是預先核准的。

### Agent 的產出：intent.md

不管哪個層級被觸發，Claude 最終的產出都是一份 intent.md——跟 L2 教的格式一樣：異常是什麼、證據是什麼、建議的處理方式、受影響的系統、還有哪些開放問題。這份 intent.md 進入分類佇列，由 service owner 或 on-call 工程師決定：立即修、排程修、還是關掉（關掉的決定會回饋去調整 band 的閾值，減少未來的雜訊）。

如果決定修，intent.md 就走完整個管線：spec.md → plan.md → 實作 → 測試 → PR review → 部署。**同一套流程，只是觸發點不是人，是監控系統**。

### Claude Tag：Slack 裡的即時回應

課程另外介紹了 Claude Tag（目前公測中，支援 Slack）——把 Claude 加進 Slack 頻道成為成員。事件發生時，Claude 可以在 thread 裡做即時的第一回應：查指標、驗證假設、寫 post-mortem。頻道歷史本身就成為可稽核的記錄。

## 實戰對照

老實說，我們還沒做到課程描述的「全自動監控閉環」。但我們有一個手動版的 Stage 6。

我們的做法是定期執行一個 skill，撈最近幾天三個 repo 的 PR review 痕跡——reviewer 擋下了什麼、漏了什麼、誤判了什麼——分類成證據表，然後把結論回寫成三種修正：

1. **PR 狀態收斂**：哪些 PR 還卡著需要處理
2. **Repo 的規則檔案**：更新 CLAUDE.md 或 lint 規則
3. **開發工具自己的 gate/reviewer**：調整 hook 的判斷邏輯

這跟 Stage 6 的邏輯完全一致：**從產出的結果裡找到模式，把修正回饋到產生這些結果的系統**。差別在於我們是手動觸發，課程教的是用偵測腳本自動觸發。

從手動版走到自動版，缺的不是技術（偵測腳本不難寫），而是**對 agent 產出的信任度**。當你的 feedback loop（L8）和 CI evals（L9）還不夠成熟，讓 agent 在 3σ 時自動開 PR 風險太高。Stage 6 的前提是前面 12 堂課的基礎設施都到位。

## 給讀者的起步建議

### 第一步：選一個指標

不要試圖一次監控所有東西。選一個有穩定 rolling baseline 的指標——CI 測試失敗率通常是最好的起點，因為資料乾淨、基線穩定、false positive 容易辨別。

### 第二步：先做 1σ + 2σ

先不要開 3σ 的自動行動。讓偵測腳本跑一陣子，驗證：
- 1σ 的 log 是不是真的在捕捉有意義的信號
- 2σ 的 Claude 診斷是不是準確

依課程的量測方式：追蹤從 band breach 到 intent.md 出現在分類佇列的時間，跟歷史上從事件發現到 post-mortem action item 的時間做比較。

### 第三步：手動版先跑

在開自動化之前，先手動做「撈 PR review 痕跡 → 分類 → 回寫規則」的迴圈。這能幫你建立直覺：哪些 pattern 會反覆出現、哪些規則修正真的有效、哪些只是噪音。有了這個直覺，你才知道 bands.yaml 的閾值該怎麼設。

### 第四步：量測閉環效率

課程給的 lagging indicator 很實用：**修正的存活率**——多少 finding 最終變成合併的 PR，以及同類事件的再發生率是否下降。如果 finding 變成 PR 的比率很低，代表偵測腳本產出太多噪音；如果同類事件持續發生，代表修正沒有真的解決問題。

## 參考資料

- [The AI-Native SDLC Playbook — L13: Closing the loop on metrics](https://academy.claude.com/courses/ai-native-sdlc-playbook/closing-the-loop-on-metrics)
- [Western Electric rules — Wikipedia](https://en.wikipedia.org/wiki/Western_Electric_rules)
- [Claude Code Monitoring (OpenTelemetry) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/monitoring)
- [Claude Tag — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-tag)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
