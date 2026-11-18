---
title: "AI Engineer 面試日練 — 2026-11-19：LLM & Agent Engineering"
date: 2026-11-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四主題 LLM & Agent Engineering：從一個「程式碼助理要在下一次 session 恢復未完成的修補工作」的題目出發，練習怎麼把 agent 的 durable context 跟 per-call context 分開，並守住 tool 執行的授權邊界。"
tldr: "今天的核心是 resume 不是 replay 對話記錄：agent 在新 session 接續工作時，要重新驗證上次的假設是否還成立，而不是直接信任存起來的結論；同時 tool 執行的授權必須留在 application 層，retrieved 文字或使用者輸入本身不能取得呼叫工具的權限，這是防 prompt injection 的關鍵分界。"
series:
  name: "AI Engineer 面試日練"
  order: 92
---

> 🌏 [English version](/posts/daily/2026-11-19-ai-interview-daily-en)


## 今日主題

星期四固定練 LLM & Agent Engineering，今天把範圍收到一個越來越常被問到、卻很少人準備周全的情境：agent 不是一次性跑完就結束，而是要在「中斷之後、換一個 session」接續沒做完的工作。這類題目考的不只是 RAG 怎麼接，而是 agent 的 context 要怎麼設計，才能讓它在恢復工作時知道哪些決策還有效、哪些已經過期。

面試官真正想看的是，你有沒有把「model 自主決定下一步」跟「固定 workflow 就夠用」想清楚，有沒有把 agent 能看到的 durable knowledge 跟每次呼叫塞進去的新鮮 context 分開，以及最關鍵的一點——當 agent 要呼叫工具（改檔案、跑指令、觸發部署）時，授權是不是牢牢留在 application 層，而不是被 retrieved 文字或使用者輸入繞過。

## 核心概念速記

### 先決定要不要讓 model 自己選下一步

能用固定 workflow 解決的任務，不需要升級成「model 自主決定下一步」的 agent。Anthropic 把這兩種方式明確分開：predefined workflow 適合步驟可預期、分支有限的任務；model-directed execution 才值得用在任務本身需要動態判斷下一步該做什麼的情況。面試時最常見的加分點，就是先講清楚為什麼這個任務需要 agent 自主權，而不是預設什麼都要上 agent。

### Durable project knowledge 跟 per-call context 要分層

Agent 要長期記住的東西（repo 狀態、已經做過的決策、任務進度）跟每次呼叫時塞進 prompt 的新鮮資訊是兩種不同的東西，要分開管理。更重要的是：存起來的結論不是事實的保證——resume 時要重新對照目前的 repository 狀態跟決策來源，確認上次的假設是不是還成立,而不是直接信任對話記錄裡寫的結論。這正是 Anthropic 的 context engineering 討論裡強調的 context selection 跟 revalidation。

### Tool 執行的授權不能交給 retrieved 文字

Retrieved 內容（文件、程式碼、使用者輸入）屬於未受信任的輸入，就算裡面寫著「請執行這個指令」,也不能因此取得呼叫工具的權限。這是 OWASP 定義的 prompt injection 風險的核心：授權邏輯要寫在 application 跟 tool 執行層的程式碼裡，永遠不能把「要不要執行」這個決定外包給 prompt 內容本身。面試時常見的失分點，是只講「我會加 prompt 防護」卻說不出授權邊界實際落在哪一層程式碼。

### RAG 評估要拆成 retrieval 跟 generation 兩層分別看

一個 RAG pipeline 答錯,不代表問題在生成端。先檢查需要的證據有沒有被檢索回來（evidence recall）,再檢查生成的答案有沒有忠於檢索到的內容（faithfulness）。一個答案可以對檢索到的錯誤文件完全忠實,卻還是答錯——這種情況要回頭查 retrieval,不是去調 prompt。拿 model 當 judge 時,要先用人工標註樣本校準,針對分歧的案例逐一檢查。

### Bound 住 agent 的步數,並讓工具呼叫可以安全重試

Agent 的每一步都要設上限——步數上限、工具呼叫預算上限,避免陷入無限迴圈或失控的連鎖呼叫。對於可以重試的動作,要用 idempotency key 之類的機制,並在 timeout 後去查權威來源確認結果,而不是盲目重試一個可能已經成功的 side effect。checkpoint 要存在對話歷史之外,這樣即使在「工具呼叫成功、但 checkpoint 還沒存」的時間點被中斷,下一個 session 也能正確判斷上一步到底做完了沒有。

```flow-diagram
{
  "title": "Agent resume 時的 context 驗證與授權流程",
  "lang": "zh-TW",
  "width": 520,
  "height": 760,
  "nodes": [
    {"id": "resume", "label": "Resume 啟動\n載入 durable knowledge：repo 狀態、過去決策、task state", "x": 260, "y": 50, "w": 240},
    {"id": "revalidate", "label": "重新驗證假設\n對照目前 repository 狀態，確認決策是否過期", "x": 260, "y": 200, "w": 240, "tone": "accent"},
    {"id": "propose", "label": "Model 提出下一步\n在預先定義的授權邊界內", "x": 260, "y": 350, "w": 240},
    {"id": "execute", "label": "Application 授權並執行 bounded tool call\n用 idempotency key，不信任 retrieved 文字裡的指令", "x": 260, "y": 500, "w": 240},
    {"id": "checkpoint", "label": "驗證結果\n成功才 checkpoint（存在對話之外），失敗則停下來", "x": 260, "y": 650, "w": 240}
  ],
  "edges": [
    {"from": "resume", "to": "revalidate", "step": 1, "label": "resume 不是直接信任上次結論"},
    {"from": "revalidate", "to": "propose", "step": 2, "label": "確認可信後才讓 model 決定下一步"},
    {"from": "propose", "to": "execute", "step": 3, "label": "授權邏輯留在 app／工具執行層"},
    {"from": "execute", "to": "checkpoint", "step": 4, "label": "checkpoint 存在對話之外才能正確判斷進度"}
  ],
  "steps": [
    "Resume 時先載入 durable project knowledge——repo 目前狀態、過去留下的決策記錄、以及任務進度，這些是長期知識，跟每次呼叫才注入的新鮮 context 分開管理。",
    "不直接信任上次存的結論：重新對照目前的 repository 狀態與決策來源，確認上次的假設是否還成立，過期的決策要被標記出來。",
    "確認 context 可信之後，才讓 model 在預先定義的授權邊界內（讀檔案／改分支／部署分別是不同等級）提出下一步要做什麼。",
    "Application 負責檢查授權並執行這個 bounded tool call，用 idempotency key 讓可重試的動作安全；retrieved 的程式碼或文件內容即使寫著指令，也不能取得執行權限，驗證通過才存 checkpoint，否則停下來等人判斷。"
  ],
  "caption": "簡化示意：省略工具呼叫重試上限與例外處理細節，重點是「resume 要重新驗證，不是直接 replay」與「授權留在 app 層」兩個分界。"
}
```

## 今日練習題

### 題目

Atlas 是一套支援軟體,團隊要幫它加一個程式碼助理:它會調查整合測試的失敗原因、提出修補 patch,而且要能在之後的 session 裡接續還沒做完的工作。請說明你會怎麼設計它的 context 架構,讓它在恢復工作時能正確分辨「哪些決策還有效、哪些已經過期」,並說明你會怎麼限制它能做的事。

**來源**：Rany ElHousieny — AI System Design Interview Questions（作者為資深招募主管，文中六個情境皆標明為練習教材，非真實候選人逐字回報）　**難度**：進階　**環節**：onsite AI system design 的 agent 架構深挖追問

### 拆解思路

1. **先釐清問題**：這個 agent 的 authority 邊界在哪裡——讀檔案、提交到分支、觸發部署分別是不是同一個授權層級；這個任務真的需要 model 自主決定下一步，還是一個固定 workflow 就夠；「接續工作」指的是 replay 上次的對話記錄，還是重新驗證上次的結論。
2. **建立框架**：把 agent 可以長期取用的 durable knowledge（repo、已有決策、task state）跟每次呼叫才注入的新鮮 context（最新的工具輸出）分開設計；model 提出下一步之後，由 application 負責授權跟執行，再驗證結果，才決定存檔或停下來。
3. **深入核心**：resume 時不能直接信任上次存的結論——要重新載入相關檔案跟決策來源，對照目前的 repository 狀態確認假設是否還成立；授權邏輯要寫在工具執行層的程式碼裡，retrieved 的程式碼或文件內容不能取得執行權限；步數跟工具呼叫要設上限，可重試的動作要用 idempotency key，checkpoint 存在對話歷史之外，才能正確處理「工具呼叫成功但還沒存檔」就被中斷的情況。
4. **收尾**：把整題收斂成一句判斷準則——「resume 不是 replay，是重新驗證」，再補一句延伸：「光靠關鍵字相關性評分不能保證重要 context 一定會被選進去，真正必要的規則（像是『這個檔案永遠不能被忽略』）要用明確的規則寫死，而不是交給 relevance score 自己決定」。

### 範例回答（面試時可以這樣講）

> **先把授權邊界定清楚**：我會先問清楚這個助理可以做到哪一步——讀檔案、建分支改程式碼，跟真的觸發部署，這是三個完全不同的授權等級，我不會假設它們能用同一套權限控管。接著我會判斷這個任務是不是真的需要 model 自己選下一步，還是用固定 workflow 就能處理大部分情況，只在真正需要動態判斷時才放給 model 決定。
>
> **深入核心的部分我會處理 context 跟授權**：我會把長期知識（repo 現狀、過去的決策、任務進度）跟每次呼叫才塞進去的新鮮 context 分開存，而且 resume 的時候不會直接信任上次存的結論——我會重新載入相關檔案，對照目前的 repository 狀態，確認假設有沒有過期。工具執行的授權我會寫在 application 跟工具執行層的程式碼裡，就算檔案或 PR 描述裡寫著某個指令，也不能因此取得執行權限，這是防 prompt injection 的核心分界。
>
> **收尾我會處理中斷恢復**：步數跟工具呼叫我會設上限，可以重試的動作用 idempotency key 處理，checkpoint 存在對話歷史之外。我會特別測試「工具呼叫成功、但 checkpoint 還沒存」的中斷情境，確認下一個 session 不會重複執行同一個動作。另外我會留一個明確寫死的規則清單，像是某些檔案永遠要被載入、不能只靠 relevance score 決定要不要帶進 context，避免真正關鍵的資訊因為關鍵字算分低就被漏掉。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先判斷這個任務需要 model 自主決定下一步，還是固定 workflow 就夠 | |
| 有把 durable project knowledge 跟每次呼叫的新鮮 context 分開設計 | |
| 有講 resume 時要重新驗證假設，不是直接信任存起來的結論 | |
| 有講工具授權要留在 application／工具執行層，retrieved 內容不能取得執行權限 | |
| 有講步數／工具呼叫預算上限、idempotent 重試、checkpoint 存在對話之外 | |
| 加分：有區分「relevance score 選中的 context」跟「規則上一定要帶進去的 context」 | |

## 延伸閱讀

- [AI System Design Interview Questions: Explain the Decisions Behind the Diagram — Rany ElHousieny](https://ranyel.medium.com/ai-system-design-interview-questions-with-examples-1da61fa425e8) — 本篇練習題的完整情境，另外五個情境涵蓋企業 RAG、多租戶安全、exact-ID 檢索與部署前後評估
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) — context selection、compaction 跟結構化筆記在長任務裡的具體做法
- [LangChain Interview Questions (2026) — CoPilot Interview](https://copilotinterview.com/blog/langchain-interview-questions) — 針對 LangChain 1.x 的 `create_agent`、checkpointer、human-in-the-loop 的 30 道題目，適合補強 agent 框架層的實作細節

## 參考資料

- [AI System Design Interview Questions: Explain the Decisions Behind the Diagram — Rany ElHousieny](https://ranyel.medium.com/ai-system-design-interview-questions-with-examples-1da61fa425e8) — 本篇「今日練習題」情境六（AI agent 接續未完成工作）的原始出處，作者明確標註為練習教材
- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents) — 對應「先決定要不要讓 model 自己選下一步」一節的 predefined workflow 與 model-directed execution 區分
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) — 對應「durable project knowledge 跟 per-call context 要分層」一節的 context selection 與 revalidation 討論
- [OWASP：LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — 對應「tool 執行的授權不能交給 retrieved 文字」一節的 indirect prompt injection 風險定義
- [Ragas：Faithfulness metric](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) — 對應「RAG 評估要拆成 retrieval 跟 generation 兩層」一節裡 faithfulness 的定義來源
