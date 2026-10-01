---
title: "AI Engineer 面試日練 — 2026-10-01：LLM & Agent Engineering"
date: 2026-10-01
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四輪到 LLM & Agent Engineering，這次不重複練過的 RAG vs Agent 決策框架跟 context engineering，改聚焦 agent 系統最容易在面試被問倒的一段：三種常見失敗模式怎麼防、termination condition 怎麼設計、評估指標怎麼量化，練習題是「agent 系統最主要的失敗模式有哪些，你怎麼處理」。"
tldr: "今天換個角度練 LLM & Agent Engineering，不再重複前幾週練過的 RAG vs Agent 決策框架跟 context engineering，改聚焦 agent 一旦真的跑起來之後最容易出包、也最容易在面試被追問到詞窮的一段：infinite loop、選錯工具、參數格式錯這三種失敗模式要怎麼分開防；一個長時間跑的 agent 光靠 max_turns 不夠，termination condition 要疊 step budget、cost ceiling、goal-completion 判斷三層；agent 的評估不能只看「有沒有做完」，業界現在會拆成 tool selection quality（選對工具了嗎）、action advancement（有沒有往目標前進）、context adherence（有沒有守住給定的限制）三個獨立指標；guardrail 設計要用信心或金額門檻分流，低風險自動執行、高於門檻轉人工審核。練習題來自候選人回報的真實 AI Engineer 面試題「What are the main failure modes of agents and how do you handle them?」，拆解思路把失敗模式、termination、guardrail 串成一套完整答案。"
series:
  name: "AI Engineer 面試日練"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-10-01-ai-interview-daily-en)

## 今日主題

星期四輪到 LLM & Agent Engineering，但這個主題過去幾週已經把「RAG vs Agent 什麼時候該升級」「context engineering 不等於 prompt engineering」這兩條主線練得很扎實，今天換一個候選人常常沒準備、面試官卻最愛深挖的角度：agent 系統真的跑起來之後會怎麼壞，以及你怎麼設計防線。這個角度在 2026 年的面試報告裡出現頻率很高，因為越來越多團隊已經把 demo 階段的 agent 推到生產環境，面試官想確認的不是你會不會串 LLM 呼叫工具，而是你有沒有真的被 agent 在生產環境搞砸過、學到什麼防禦手段。今天練的內容適合 onsite 的系統設計深挖環節，也適合被問到「你維運過 agent 系統嗎」這類追問時，有具體的技術細節可以接。

## 核心概念速記

### Agent 三種常見失敗模式，要用三種不同的手段防

Agent 系統最常見的失敗不是模型「不夠聰明」，而是三種具體、可以個別防守的模式：第一種是無限規劃迴圈，agent 在沒有新資訊的情況下反覆呼叫同一個工具或反覆重寫同一個計畫，靠的是 step budget（單一任務的最大步數上限）跟迴圈偵測（比對連續幾步的工具呼叫跟參數是否重複）來擋。第二種是選錯工具，尤其工具數量一多，模型容易在語意相近的工具之間選錯，靠的是把工具描述寫清楚職責邊界、或先做一層工具分類路由，而不是丟一長串工具定義讓模型自己猜。第三種是參數格式錯誤（malformed arguments），像呼叫 API 時漏了必填欄位或型別不對，靠 schema 驗證加上帶退避的重試（retry with backoff）解決，而不是讓錯誤直接讓整個任務失敗。面試官想聽到的是這三種失敗模式要分開診斷、分開防守，而不是籠統地說「加 try-catch 就好」。

### Termination condition：max_turns 只是防線的第一層，不是全部

一個長時間執行的 agent 光靠「跑滿 N 輪就停」是不夠的，面試時常被追問的是你還會疊哪幾層判斷。第一層是 step budget，單純限制步數，防止最壞情況失控；第二層是 cost ceiling，用 token 或 API 呼叫成本設一個金額上限，因為有些失敗模式是每一步都「合理」但整體成本爆炸；第三層、也是最容易被漏掉的一層，是 goal-completion 判斷——要有一個獨立的檢查點去問「這個任務真的做完了嗎」，而不是假設 agent 說「完成了」就是真的完成了。三層疊在一起的理由是它們攔截的失敗型態完全不同：step budget 攔的是失控，cost ceiling 攔的是效率低落，goal-completion 攔的是 agent 自己誤判進度。

### Agent 評估：拆成三個獨立指標，而不是單一的「成功或失敗」

傳統軟體測試看輸出對不對，agent 評估要拆得更細，因為過程本身就是要被檢驗的對象。業界常用的三個獨立指標是 tool selection quality（每一步選的工具是不是對的工具，跟最終有沒有達成目標是兩回事）、action advancement（這一步有沒有讓任務往目標推進，用來抓「一直在做事但沒有進展」的空轉）、context adherence（agent 有沒有遵守給定的限制跟指示，例如不能超出授權範圍呼叫某些工具）。這三個指標可以各自獨立壞掉——一個 agent 可能每一步都選對工具、也確實在推進，但某一步違反了使用者給的限制；面試官想確認你知道「任務有沒有成功」不足以診斷問題出在哪一層。

### Guardrail 設計：用信心或金額門檻分流，而不是全部自動或全部人工

2026 年的面試越來越愛問「你怎麼決定哪些 agent 動作要自動執行、哪些要轉人工」，好的答案是用信心分數或影響範圍（尤其是金額）設一道門檻：低於門檻的動作自動執行，高於門檻的一律路由給人工審核，因為一次錯誤的自動核可代價可能很高。這個設計背後的邏輯是「模型能不能做」跟「模型該不該自動做」是兩個問題，後者取決於錯誤的代價而不是模型能力本身。同一套邏輯也適用在沙箱化工具執行——risky 的操作（寫入、刪除、對外發送）預設跑在隔離環境並記錄，而不是給 agent 跟人類工程師一樣的預設權限。

## 今日練習題

### 題目

What are the main failure modes of agents and how do you handle them?（agent 系統最主要的失敗模式有哪些，你會怎麼處理？）

**來源**：候選人回報的真實 AI Engineer 面試題（收錄於社群整理的面試題庫）　**難度**：中等　**環節**：technical screen / onsite 深挖

### 拆解思路

1. **先釐清問題**：先問清楚這個 agent 系統的操作範圍是什麼——它能呼叫哪些工具、動作是否可逆（唯讀查詢 vs 會寫入或花錢的操作）、目前有沒有任何監控或日誌。這會決定接下來該優先講哪種失敗模式；一個只能查資料的唯讀 agent 跟一個能下單的 agent，失敗代價完全不同。
2. **建立框架**：把失敗模式拆成三類分開講——無限迴圈／規劃失控、工具選錯、參數格式錯——每一類都配一個具體的防守手段，避免籠統地說「做好錯誤處理」。
3. **深入核心**：真正的取捨在「防守手段設得太嚴會不會誤傷正常任務」，例如 step budget 設太低會讓真正需要多步驟的任務中途被砍斷；這裡可以帶出 termination condition 要疊三層（step budget、cost ceiling、goal-completion）而不是只靠一個硬性上限，以及評估要拆成 tool selection quality / action advancement / context adherence 三個指標才看得出問題出在哪一層。
4. **收尾**：總結成「失敗模式防守」加「termination 設計」加「評估指標」三塊拼起來才是完整答案，並主動提出如果任務允許寫入或金流操作，還要補一層信心／金額門檻的 guardrail 分流，把高風險動作路由給人工審核。

### 範例回答（面試時可以這樣講）

> 我會把 agent 的失敗模式拆成三種、各自配一個具體防守手段。**第一種是無限迴圈或規劃失控**，agent 在沒有新資訊時反覆呼叫同一個工具，我會用 step budget 限制單一任務的最大步數，再加一層迴圈偵測比對連續幾步的工具呼叫跟參數是否重複。**第二種是工具選錯**，尤其工具數量一多，模型容易在語意相近的工具間選錯，我會把每個工具的職責邊界寫清楚，工具數量大的話再加一層路由分類，而不是讓模型直接在一長串工具裡猜。**第三種是參數格式錯誤**，我會在呼叫前做 schema 驗證，失敗就用帶退避的重試，而不是讓整個任務因為一次格式錯誤就直接失敗。
>
> 光防失敗模式還不夠，我還會設計三層 termination condition：step budget 防最壞情況失控、cost ceiling 防每一步都合理但整體成本爆炸、goal-completion 判斷防 agent 自己誤判「已經做完了」。評估的時候我不會只看任務成功與否，而是拆成 tool selection quality、action advancement、context adherence 三個獨立指標，因為一個 agent 可能每步都選對工具也確實在推進，卻在某一步違反了使用者給的限制，這種問題只看「任務有沒有成功」是看不出來的。如果這個 agent 能做寫入或金流操作，我還會加一層信心或金額門檻的 guardrail，低於門檻自動執行、高於門檻一律轉人工審核。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 三種失敗模式（無限迴圈／工具選錯／參數格式錯）分開講，各自配具體防守手段 | |
| termination condition 講出至少兩層以上（不是只靠 max_turns） | |
| 評估指標拆成 tool selection quality / action advancement / context adherence 三個獨立面向 | |
| 提到防守手段太嚴可能誤傷正常任務的取捨 | |
| guardrail 用信心或金額門檻分流自動執行 vs 人工審核 | |
| 加分項：提到沙箱化工具執行，risky 操作預設隔離環境並記錄 | |

## 延伸閱讀

- [AI Engineer Interview Theory Questions（候選人回報真實題彙整）](https://adilshamim8.medium.com/ai-engineer-interview-theory-questions-8bf23b08fafd) — 「Agents and Tool Use」與「Testing and Evaluation」兩節收錄了今天所有核心概念的原始面試題，含 tool selection quality / action advancement / context adherence 的出處
- [The AI Engineer Interview Playbook](https://dev.to/truongpx396/the-ai-engineer-interview-playbook-45pb) — 今天練習題「What are the main failure modes of agents」的原始問法與參考答案結構
- [45+ AI Engineer Interview Questions & Answers (2026 Guide)](https://mckelveyconnect.washu.edu/blog/2026/09/17/45-ai-engineer-interview-questions-answers-2026-guide/) — guardrail 用信心或金額門檻分流自動執行與人工審核的討論，對應「Guardrail 設計」段落

## 參考資料

- [AI Engineer Interview Theory Questions](https://adilshamim8.medium.com/ai-engineer-interview-theory-questions-8bf23b08fafd) — 三種失敗模式、termination condition 三層設計、評估三指標的原始問題來源
- [The AI Engineer Interview Playbook](https://dev.to/truongpx396/the-ai-engineer-interview-playbook-45pb) — 「無限迴圈、選錯工具、參數格式錯、budget/step limits、schema validation、retries with backoff」對應段落的出處
- [45+ AI Engineer Interview Questions & Answers (2026 Guide)](https://mckelveyconnect.washu.edu/blog/2026/09/17/45-ai-engineer-interview-questions-answers-2026-guide/) — guardrail 信心或金額門檻分流設計的出處
