---
title: "框架拆開看：DSPy、LangGraph 與 harness 的差距｜Stanford CS329Z 第 5 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 6
tldr: "Lecture 05 以資料、系統、評估三根支柱看 agent 工程，現場示範 DSPy 與 LangGraph，再比較開源 harness、Temporal 的 durable orchestration 與觀測工具。指定讀物 DSPy 把 prompt 模板變成可依 metric 優化的程式。"
description: "依實體頁碼帶讀 CS329Z Lecture 05 Frameworks & Orchestration 投影片，再深讀 DSPy 論文，並用一個自選練習比較手刻管線與 DSPy 版本。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 5 堂（10/7，Frameworks & Orchestration）在學生剛開始手刻 HW1 時，回頭看框架：DSPy 的 signature、module 與 optimizer，LangGraph 的 state、node 與 edge，再巡一遍 mini-SWE-agent、OpenHands、Pi 等開源 harness、Temporal 的 durable orchestration 與觀測工具。週五（10/9）要交 project proposal。

指定讀物有 Khattab 等人的 [DSPy](https://arxiv.org/abs/2310.03714)、LangGraph 文件與 Arena 的 HarnessTax。本文深讀 DSPy：prompt 模板從手工藝變成可編譯、可優化的程式。一邊手刻、一邊讀框架論文，這堂的張力就在這裡。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 05 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="132" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf">
<p>共 132 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–18 頁：工程的三根支柱：資料、系統與評估

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=1" data-slide-page="1">投影片第 1–18 頁</a>

開頭用手寫 backprop 與 PyTorch 的差異比喻框架：抽象能省工，仍要知道底層做了什麼。課堂把資料、system／model、evaluation／metric 畫成三根支柱，再依控制流程從 model、workflow 到 agent 排出框架位置。觀測與可靠執行工具又是另一層。

選型時先列出自己缺哪一層：是模型呼叫介面、可組合流程、agent harness，還是失敗後可恢復的執行？把這幾件事都叫「agent framework」，容易選到功能很多卻無法回答自己問題的工具。

### 第 19–51 頁：DSPy：契約、組合與可量測的優化

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=19" data-slide-page="19">投影片第 19–51 頁</a>

Signature 宣告輸入輸出，module 決定如何完成契約，optimizer 在資料與 metric 下改善程式。這段有大量 live demo 的備用畫面：先看欄位格式不一致的問題，再看模組組合、資料與評分函式如何進入 optimizer，最後銜接 agent module。它不是只教一個更短的 API 呼叫。

可先讀第 22 與 51 頁掌握結構，再回看中間程式圖。下面 DSPy 論文導讀用原論文的 teleprompter 名詞說明歷史方法；此處課堂用 optimizer。資料、評分標準與保留測試集仍要自己設計，框架不會替你定義產品成功。

### 第 52–77 頁：LangGraph：共享 state 與明確控制流

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=52" data-slide-page="52">投影片第 52–77 頁</a>

State 是節點共同讀寫的工作區，node 是讀寫 state 的函式，edge 決定下一步；conditional edge 讓結果導向不同分支。課堂先逐格畫出 start／end 與節點，再展示 LLM 和 tools 形成迴圈。Agent 的模型決策仍被放在程式定義的圖與狀態裡。

自擬練習可把查信、摘要、等待確認拆成節點，讓「未確認不得寄出」成為可檢查的 state 與分支條件。比較 DSPy 時應問哪種抽象更適合自己的控制需求，而非把兩者當成所有功能一一對應的替代品。

### 第 78–89 頁：Harness 把工具、歷史與執行方式定下來

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=78" data-slide-page="78">投影片第 78–89 頁</a>

Mini-SWE-agent、OpenHands、Pi 與 OpenClaw 展示不同取捨。投影片比較只有 bash 與多種工具、線性歷史與事件紀錄或樹狀歷史、獨立 subprocess 與持續 terminal，以及排程與記憶工作。這些是課堂採用的版本快照；重點是辨認設計維度，不是把清單當今日產品規格。

這些取捨會反映在分數上。[第 86 頁](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=86)引用 arena.ai 在 Terminal-Bench 2 的比較：同一個 Claude Haiku 4.5，套 Codex 的成功率是 31.1%，套 Pi 是 47.8%。比較模型之前先固定 harness，否則分不出進步來自哪一邊。[第 87–88 頁](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=87)的 Meta-Harness 更進一步，讓 agent 讀過往候選的程式碼、軌跡與分數，提出新 harness 再評估，把 harness 本身當成優化對象；Lecture 09 會回到這個做法。

例如持續 shell 會保留 cd 與環境變數，獨立執行則不能假設上次 shell 狀態還在。測 harness 時，連續執行兩個有狀態依賴的命令，就能確認你的心智模型是否符合實際執行方式。

### 第 90–122 頁：Temporal 與 telemetry：失敗後怎麼繼續

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=90" data-slide-page="90">投影片第 90–122 頁</a>

[第 92–93 頁](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=92)先交代為什麼需要這一層：agent 能連續工作的時間越來越長，跑到一半當機或 API 逾時，前面做完的步驟就白費；沒有紀錄，也無從除錯。這些是軟體工程早就學過的教訓，搬到 agent 上同樣成立。Temporal 把 workflow 與會失敗的 activity 分開，由 server 保存執行歷史、佇列與狀態，worker 執行工作。備用 demo 畫面接著示範 retry 與 server 管理的時間。MLflow、LangSmith 與 Langfuse 則放在觀測端，用來追查呼叫與狀態。

可靠重試仍要考慮副作用。本文自擬的寄信流程如果 API 已收件但回應遺失，直接重跑可能重複寄出；應保存操作識別與執行結果，確認可否安全重試。這是從課堂機制延伸的工程檢查，不是 Temporal 自動保證任何外部操作只發生一次。

### 第 123–132 頁：用 trace 與自己的任務評估選型

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=123" data-slide-page="123">投影片第 123–132 頁</a>

最後把工程循環收回 build、run、evaluate、improve：先簡單、讓失敗可見、設定 timeout／retry／budget，再用代表性任務和邊界情境比較。課堂提醒，除非在做通用 coding harness，否則不應只追 coding benchmark。

若產品是繁中企業助理，就需要繁中問題、內部詞彙、權限差異與真實工具錯誤的測例。每次改框架或加模組，保存原版 trace 與結果，說明改善了哪類失敗、增加多少耗時；這才把選框架變成可回頭檢查的工程決策。

## 讀物｜DSPy：用資料與 metric 改善多階段程式

[主讀物](https://arxiv.org/abs/2310.03714)

### TL;DR

Signature 說明輸入輸出，module 組合呼叫與推理，optimizer 根據資料與 metric 選示範或其他參數；優化單位可以是整條管線。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | ICLR 2024 論文，以數學與多跳問答比較 few-shot、bootstrap 與 ensemble 等設定。 |
| 應保留的界線 | 歷史成績依模型、樣本與分割而定；prompt 編譯仍會呼叫模型、有成本，且 metric 設計錯會優化錯目標。 |
| 閱讀價值 | 適合已經有資料與 metric，準備改善多階段程式的人。 |

### 領域背景

手寫 prompt 常把資料格式、示範與流程混在字串裡。DSPy 將任務意圖與執行策略拆開，讓同一份程式可由資料驅動地改善。

### 中階導讀

**DSPy：宣告式模組與可量測的優化**

DSPy 論文的開場白很嗆：現在的模型管線全是硬編碼提示模板，靠反覆試誤攢出來的長字串。它要的是系統化方法：把管線抽象成文字轉換圖，模型經由**宣告式模組**呼叫。機制有三層。signature 是自然語言的輸入輸出宣告（例如 `user_question -> search_query`），只說要什麼、不說怎麼哄模型。module 是帶參數的簽名實現：內建 ChainOfThought 其實就是在輸出前插一個 rationale 欄位再交給 Predict，論文只用十餘行寫完。teleprompter 是優化器，拿訓練輸入與驗證指標回填每個模組的示範。模組是帶參數的，會自己學——自己造示範、收集示範，把提示、微調、擴增、推理技巧組起來用。

寫法上，使用者只寫 signature 加一個目標指標，編譯器分三階段調校。先產生候選示範：跑管線、只留下通過指標的軌跡。再用隨機搜尋或 Optuna 挑示範組合，必要時改寫程式結構，例如把多份編譯結果 ensemble 投票。以下是論文在指定模型、資料與評估設定下報告的結果。[GSM8K](https://arxiv.org/abs/2110.14168) 上幾行 DSPy 讓 GPT-3.5 衝上八成二正確率。[HotPotQA](https://arxiv.org/abs/1809.09600) 的兩跳檢索管線 ensemble 後，在測試集答對四成五六（論文註明該格只評一半測試集）。以 200 條標註輸入與 800 條無標註問題蒸餾出的 770M T5 程式，在開發集得到 39.3% answer exact match。小模型加好系統，打大模型加爛系統——[Lecture 1](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems) 的論點在這裡有了可重現的數字。

| 層次 | 你描述什麼 | 它負責什麼 |
|---|---|---|
| Signature | 輸入與輸出欄位 | 宣告需要的文字轉換 |
| Module | Signature 的實作 | 組織模型呼叫與參數 |
| Teleprompter／優化器 | 訓練輸入與驗證指標 | 挑選示範以改善管線 |

### 深入要點

不能讓 compile 用過的例子再充當最後成績。保留測試集，查看模組失敗與端到端失敗是否一致，也要檢查示範是否洩漏答案。

### Reviewer 一句話評

這是一套可優化程式的抽象；效果來自資料與 metric 配合，並非 signature 本身會自動提高準確。

### 給你的 take-away

把手刻 RAG 的 query 生成換成一個 module，以獨立測試問題比較品質與成本；這是自選實驗，不作為禁止框架的 HW1 提交版。

## 框架的抽象層級是選擇題

這堂的標題就點名了：what frameworks abstract vs. what you built from scratch。LangChain、LangGraph、LlamaIndex 各自選了不同的抽象位置；DSPy 把輸入輸出、模組與依 metric 優化的過程明確拆開。Anthropic〈Building Effective Agents〉的煞車皮（[第 6 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)讀物）在這裡依然有效：框架省的是起步時間，付的是除錯能見度。HW1 不准用框架，正好讓你先把每個零件親手刻過一遍；這堂則回頭問同一件事：同一個 agent，手刻版和 DSPy 版差在哪，框架替你藏了什麼、也替你決定了什麼。

## 怎麼做：拿手刻管線的一段換成 DSPy 對照看

**怎麼做**：這是自選練習，不算作業——HW1 本身不准用框架，這份 DSPy 版別交上去。拿[第 3 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)的手刻 RAG（或 HW1 剛起步的 email 檢索管線），只抽其中一段（例如 query 生成）用 DSPy signature 重寫。給 20 個問題當驗證集、正確率當指標，編譯一次，對照手刻版的分數和你花的時間。重點不是分數贏多少，是寫下三行：框架替你做了什麼決定、哪個決定你不同意、什麼情況下你會換回去。這三行能幫你讀懂這堂，提案書（週五截止）的方法論段落也能用。

## 它在課程裡的位置

第 5 堂讓你知道框架替你做了哪些決定，HW1 則逼你先把每個零件親手刻過一遍。[第 6 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)回到設計模式：workflow 與 agent 各有哪些可組合的骨架。DSPy 的優化器會在第 9 堂再次出現。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- 指定閱讀：Khattab 等人〈DSPy〉（本文深讀）、LangChain〈LangGraph Overview〉、Arena.ai〈HarnessTax〉
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 5（10/7 週三）的內容，原屬「第 3 週：工具接進來，框架拆開看」導讀；以下保留拆分前的紀錄。
- 2026-10-29：對照 Lecture 04／05 投影片重核各節頁碼；補上工具失敗三層分類與 τ-bench 版本演進（L04 第 64–67 頁）、同模型換 harness 的成功率差距與 Meta-Harness（L05 第 86–88 頁），以及需要 durable orchestration 的理由（L05 第 92–93 頁）。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：補入MCP 連線圖與 DSPy 層次對照表，只將既有解說視覺化，未重新查核事實。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 4 堂：Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)、[第 6 堂：Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課堂投影片：[Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
