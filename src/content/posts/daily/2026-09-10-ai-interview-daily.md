---
title: "AI Engineer 面試日練 — 2026-09-10：LLM & Agent Engineering"
date: 2026-09-10
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "今日練 LLM & Agent Engineering 面試最愛考的架構判斷題：什麼時候該用 RAG、什麼時候才需要 agent、guardrails 怎麼分成離線評估與線上攔截兩層，以及 LLM-as-a-Judge 跟軌跡評估怎麼撐起整套生產環境的品質把關。"
tldr: "這輪 LLM & Agent Engineering 聚焦 2026 年面試官最愛拆的架構決策：RAG 跟 agent 不是二選一而是分工——RAG 負責有引用來源的政策問答，agent 只在任務需要跨系統多步驟操作時才上場；guardrails 要分成離線評估（release 前抓 regression）跟線上攔截（即時擋掉不安全輸出）兩層，核心原則是「模型只提案，決定性系統才授權與執行」；評估上除了傳統的 LLM-as-a-Judge，agent 還要做軌跡評估（trajectory-based evaluation）去檢查每一步決策，不能只看最終答案。練習題是一道 PracHub 整理的『設計企業客服 agent』系統設計題，練的是怎麼把 RAG 路徑跟 agent 路徑講清楚，並且把授權層講成整題的關鍵。"
series:
  name: "AI Engineer 面試日練"
  order: 22
---

> 🌏 [English version](/en/posts/daily/2026-09-10-ai-interview-daily-en)

## 今日主題

今天輪到 LLM & Agent Engineering。這一輪考的不是「你會不會接 API」，而是「你知不知道什麼情境該用 RAG、什麼情境才需要上 agent，以及怎麼確保模型輸出不會直接變成生產環境的動作」。2026 年的生成式 AI 系統設計面試,已經很少單獨問「怎麼做一個聊天機器人」,取而代之的是「設計一個能回答政策問題、又能幫使用者查訂單跟辦退款的客服系統」這種題型,考的是你能不能把 RAG、agent、guardrails、evaluation 四塊拼成一個有授權邊界的系統。這種題型會出現在 onsite 的系統設計環節,也是區分「會串 LLM API 的工程師」跟「敢把 agent 放進生產環境的工程師」的分水嶺。

## 核心概念速記

### RAG 與 Agent 的分工邊界

RAG 跟 agent 不是同一種東西的兩個名字,而是兩種不同任務型態的解法——RAG 負責用檢索到的、有存取控制的最新文件來回答政策類問題,而且答案要附引用來源；agent 只有在請求真的需要多個步驟時才派上用場,例如查訂單狀態、確認退款資格、再發起退款。面試官很愛用這題來測你會不會「什麼都上 agent」——一個只需要查資料回答的問題,硬要包成 agent 只會增加延遲跟失敗點。

### Agentic RAG：把檢索當成可重複呼叫的工具

傳統 RAG 是檢索一次、生成一次;agentic RAG 則是把檢索當成模型可以主動呼叫的工具——模型先判斷這個問題需不需要更多證據,不夠就用改寫過的 query 再檢索一次,直到證據夠了才生成最終答案。這個設計在多跳(multi-hop)問題上能大幅降低幻覺,代價是更多 token 消耗跟更高的延遲,面試官會很想聽你怎麼權衡這個 trade-off。

### Guardrails 分兩層：離線評估與線上攔截

Guardrails 不是單一一道關卡,而是要分成離線評估(release 前用測試集抓 regression)跟線上攔截(即時偵測並擋掉或改寫不安全的輸出)兩層。更關鍵的是一條貫穿整個系統的原則:模型輸出只是提案,真正的授權與執行要交給決定性的系統——應用層要驗證 schema、檢查使用者權限、套用政策規則、指派 idempotency key,並且記錄結果,模型自己不能直接觸發會改變狀態的動作。

### LLM-as-a-Judge 與軌跡評估

人工審查太貴太慢,所以生產環境常用 LLM-as-a-Judge——用另一個語言模型依照你定義好的準則,大規模地為輸出打分。但對 agent 系統來說,只看最終答案不夠,還要做軌跡評估(trajectory-based evaluation),逐步檢查 agent 每一次工具呼叫跟中間決策是否合理——因為 agent 有可能用錯誤的路徑巧合地得到正確答案,這種「歪打正著」在生產環境會是不定時炸彈。

## 今日練習題

### 題目

設計一套生成式 AI 系統,支援企業內部客服情境:使用者可以詢問公司政策問題(例如退貨規則、會員權益),系統要用 RAG 從最新、且經過權限控管的內部文件回答,並附上引用來源;當使用者的請求需要多個步驟才能完成時(例如查詢訂單狀態、確認退款資格、實際發起退款),系統要切換成 agent 模式,自行規劃並執行這些步驟。請說明:(1) 什麼判斷邏輯決定走 RAG 路徑還是 agent 路徑,(2) RAG 的 ingestion 與檢索 pipeline 怎麼設計,(3) agent 呼叫工具(查訂單、發退款)時,guardrails 跟授權層怎麼設計以避免模型直接執行未經授權的動作,(4) 怎麼評估整套系統的品質與安全性。

**來源**：PracHub Knowledge Hub（Generative AI System Design 題庫整理）　**難度**：中等　**環節**：onsite system design

### 拆解思路

1. **先釐清問題**：先確認內部文件的更新頻率跟存取權限模型(不同使用者看得到的政策文件是否不同)、agent 可以執行的動作清單有沒有金額或風險上限、退款動作需不需要人工覆核、以及整體延遲跟成本預算。
2. **建立框架**：把系統拆成兩條路徑——RAG 路徑(檢索 + 引用生成)跟 agent 路徑(規劃 + 工具呼叫),中間加一層共用的 guardrails/授權層,所有會改變狀態的動作都必須先經過這一層,再決定要不要真正執行。
3. **深入核心**：這題最關鍵的 trade-off 是授權層的設計——模型輸出只是「提案」,決定性系統要驗證 schema、檢查使用者是否有權限對這筆訂單操作、套用政策規則(例如退款金額上限)、指派 idempotency key 避免重複退款,並且把整個決策鏈記錄下來供事後稽核,而不是讓 LLM 的輸出直接呼叫退款 API。
4. **收尾**：用「這套系統要怎麼證明它是安全的」收尾——離線 eval suite 抓 regression、線上 guardrails 即時攔截、agent 的軌跡評估檢查每一步工具呼叫是否合理,加上完整的審計紀錄,這正是面試官會追問的「你怎麼知道它沒有偷偷做壞事」。

### 範例回答（面試時可以這樣講）

> **問題框定**：在畫架構之前,我想先確認幾個假設——內部政策文件會即時更新,不同角色的使用者能看到的文件範圍不同;agent 可以執行的動作僅限查詢訂單狀態、確認退款資格、發起退款,而且退款金額超過一定門檻要轉人工覆核。基於這個範圍,我會把系統拆成 RAG 跟 agent 兩條路徑,共用同一層 guardrails/授權層。
>
> **核心架構**：政策問答走 RAG——文件經過權限標記後進 ingestion pipeline,切塊、embedding、存進支援 metadata filter 的向量資料庫,查詢時先依使用者權限過濾,再檢索、生成帶引用的答案。需要多步驟操作的請求則交給 agent——LLM 規劃步驟、呼叫工具查訂單、判斷退款資格,但每一次工具呼叫都先送進授權層:驗證輸入 schema、檢查使用者對這筆訂單的權限、套用政策規則(金額上限、次數限制)、指派 idempotency key,通過才真正呼叫退款 API,沒通過就回傳給 agent 重新規劃或升級給人工。
>
> **評估與防護**：上線前用離線 eval suite 針對政策問答的正確率跟引用率跑 regression,agent 路徑則額外做軌跡評估,逐步檢查每個工具呼叫的參數跟順序是否合理,而不只看最後有沒有退款成功。線上再加一層即時 guardrails 攔截明顯不合理的輸出(例如金額超出範圍還嘗試執行),所有經過授權層的決策都留下完整紀錄,方便事後稽核跟使用者申訴。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 明確講出 RAG 路徑跟 agent 路徑的判斷邏輯 | |
| RAG 的 ingestion／權限過濾／引用生成怎麼設計 | |
| 授權層：模型提案 vs. 決定性系統執行（schema 驗證、權限檢查、idempotency key） | |
| agent 工具呼叫的失敗與升級路徑（例如轉人工覆核） | |
| 評估設計：離線 eval + 線上 guardrails + 軌跡評估 | |
| 加分項：審計紀錄與使用者申訴機制 | |

## 延伸閱讀

- [RAG Architecture in 2026: Patterns + Eval — FutureAGI](https://futureagi.com/blogs/rag-architecture-llm-2025) — 把 classic RAG 跟 agentic RAG 的差異、multi-hop retrieval 的取捨講得很具體，適合拿來補強今天核心概念的第二點。
- [AI System Design Interview Questions: ChatGPT, RAG, LLM Inference, and Agents — DEV Community](https://dev.to/arslan_ah/ai-system-design-interview-questions-chatgpt-rag-llm-inference-and-agents-1doi) — 額外整理了 LLM 推論平台跟 agent 平台的系統設計題型，可以當作今天練習題之外的延伸練習。

## 參考資料

- [Generative AI System Design Interview Questions: RAG, Agents, Evals, and Guardrails — PracHub Knowledge Hub](https://prachub.com/resources/generative-ai-system-design-interview-questions-rag-agents-evals-and-guardrails) — 今日練習題與「模型提案、決定性系統執行」核心原則的來源。
- [AI Engineer Interview Questions 2026: RAG, Agents, Evals, and Production Systems — PracHub Knowledge Hub](https://prachub.com/resources/ai-engineer-interview-questions-2026-rag-agents-evals-and-production-systems) — LLM-as-a-Judge 信任度與 release gate 設計討論的來源。
- [RAG Architecture in 2026: Patterns + Eval — FutureAGI](https://futureagi.com/blogs/rag-architecture-llm-2025) — Agentic RAG 定義與多跳檢索 trade-off 的來源。
