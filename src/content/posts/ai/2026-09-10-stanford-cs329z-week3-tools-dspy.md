---
title: "工具接進來，框架拆開看——HW1 開工｜Stanford CS329Z 第 3 週"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 4
tldr: "Lecture 04 從工具學習、API 檢索走到 function calling、MCP 與可靠度評估；Lecture 05 比較 DSPy、LangGraph、harness、Temporal 與觀測。指定讀物再拆 MCP 協議及 DSPy 優化機制，HW1 則維持手刻 harness 的要求。"
description: "帶讀 Stanford CS329Z Week 3 兩篇主讀物：MCP 規範的主從架構與安全原則，DSPy 把 prompt 模板變成可編譯管線的設計，以及它們和不准用框架的 HW1 各自怎麼對上。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Week 3 是轉折週。週一（10/5，Tool Use & Function Calling）的主讀物是 [MCP 規範](https://modelcontextprotocol.io/specification/2025-06-18)：工具從此有統一插頭，不用每接一家重寫一遍。週三（10/7，Frameworks & Agent Design）的主讀物是 Khattab 等人的 [DSPy](https://arxiv.org/abs/2310.03714)（ICLR 2024）：prompt 模板從手工藝變成可編譯、可優化的程式。同一個週一，[HW1 發布](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)：Build an Agentic Harness，不准用任何 agent 框架，只給一個 chat-completion 呼叫，從零刻一個公司內部的 AI 助理，週五（10/9）還要交 project proposal。一邊手刻、一邊在課堂上讀框架論文，這週的張力就在這裡。

官方投影片與指定讀物分工不同。以下先依實體頁碼帶讀兩堂課，再保留主讀物與延伸閱讀的深入解說。本文提出的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 04 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="68" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf">
<p>共 68 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–14 頁：先補完 RAG 的證據問題

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=1" data-slide-page="1">投影片第 1–14 頁</a>

這堂先接續前週：檢索找得更多，生成不一定用得更好。Lost in the middle 與引用品質的圖分別問「模型是否讀到」及「引用是否支持主張」。畫面上有可點的來源，仍須逐句核對支持關係。最後又回到 retriever、reader、loop 三層失敗，讓工具課從具體缺口出發。

檢查一個答案時，可先保持模型不動，只改證據位置與無關段落數；另抽查引用指向的內容。這是本文自擬的診斷法，可以把檢索不足、使用不足與假引用分開。

### 第 15–21 頁：工具把計算與外部狀態交給程式

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=15" data-slide-page="15">投影片第 15–21 頁</a>

工具的定義是模型外部執行的程式介面：模型產生名稱與參數，harness 執行，再把結果交回模型。課堂用乘法示範，並把需求拆成算不準、訓練沒看過、以及根本接觸不到的狀態。計算器、搜尋與資料庫分別補不同缺口。

要驗收的不只是答案數字。檢查模型是否選對工具、執行器是否真的呼叫，以及回答是否使用回傳值；模型文字裡寫「我查過」不構成執行證據。

### 第 22–35 頁：Toolformer：先執行候選，再篩出有用呼叫

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=22" data-slide-page="22">投影片第 22–35 頁</a>

Toolformer 從少量示範出發，在文字中抽樣 API 呼叫候選，真的執行，再看結果是否降低後續 token 的預測損失。留下有幫助的呼叫，形成微調資料。這是用語言建模目標產生工具訓練訊號，不等於沒有資料處理，也不等於已證明多步任務可靠。

接著 ToolkenGPT 把工具當特殊 token，學工具 embedding，觸發後切到填參數的模式。兩者都在學呼叫，但訓練的部位不同。讀比較表時，先找「更新了模型權重還是工具 embedding」，再看能擴到多少工具。

### 第 36–45 頁：工具很多時，先找對 API 再生成呼叫

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=36" data-slide-page="36">投影片第 36–45 頁</a>

ToolLLM 與 Gorilla 把問題推向大工具庫。除了學呼叫格式，系統要先找到適用 API；Gorilla 的 retrieval-aware training 也放入不正確的檢索脈絡，訓練模型處理品質不一的文件。AST 子樹比對則用來檢查產生的呼叫與 API 是否吻合。

API 名稱存在、參數型別合法與使用後任務成功，是三道不同的檢查。可用自擬反例測試：給一份過期的 API 文件，觀察系統是否察覺不存在的參數，能否從真實錯誤回復，而非一再呼叫同一版本。

### 第 46–56 頁：REST、function calling、MCP 與兩段認證

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=46" data-slide-page="46">投影片第 46–56 頁</a>

REST 暴露服務端點，function calling 用 schema 描述模型可選的名稱與參數，MCP 再提供跨 host 的發現與呼叫協議。投影片用 tools/list 與 tools/call 逐步示範，並把 LMS 的查作業、查繳交與評分路由轉成工具。這些程式碼是課堂示意；實作仍應以採用版本的正式規範為準。

最值得停下來看的是 inbound／outbound auth：agent 是否能連 MCP server，與 server 是否能讀寫 LMS，是兩道權限。能連上 server 不代表可評所有學生的分數；執行器仍要檢查使用者、資源與操作範圍。下面 MCP 指定版本導讀再拆 host／client／server。

### 第 57–68 頁：從合法呼叫到可重複完成任務

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=57" data-slide-page="57">投影片第 57–68 頁</a>

BFCL 檢查函式選擇、參數與不該呼叫時能否拒絕；ToolBench 把真實 API 串成任務；τ-bench 加入使用者互動與政策限制。課堂的 add／mult 例子很直接：只有加法工具時，不能為了回應乘法問題就硬叫它。

pass@k 關心多次嘗試至少成功一次，[pass^k](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=64) 關心多次都成功。對內部助理，第一次成功、第二次誤改資料並不可靠。τ-bench 本身也在演進：[第 66 頁](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=66)列出 τ²-bench 加入使用者也要動手的電信情境，之後還有任務稽核修正、知識檢索與語音版本，引用分數時要寫明是哪一版。

[第 67 頁](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=67)把工具失敗分成三層，很適合直接拿來設計測例。單次呼叫：選錯工具或不該呼叫時硬叫、編造欄位或弄錯型別與單位、呼叫根本不存在的 API。多步串接：跳過前置呼叫或順序錯、失敗後一再重送同一個呼叫而不退一步。對話層：做了政策不允許的事、該問使用者時自行假設，以及這次過、重試就失敗的不穩定，pass^k 量的正是最後這種。每層至少放一題，並記錄最後環境狀態，而非只看回覆文字。

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

## 讀物｜MCP：協議統一介面，host 保留信任責任

[週一主讀物；本文採 2025-06-18 版](https://modelcontextprotocol.io/specification/2025-06-18)

### TL;DR

Host 管 client、context 與政策，client 連 server，server 提供 tools、resources、prompts。協議讓發現與呼叫可互通，沒有替應用決定使用者是否允許操作。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 正式版本規範，提供角色、能力協商、訊息格式與安全原則；不是模型工具能力 benchmark。 |
| 應保留的界線 | 所有能力與限制都依指定版本閱讀；規範原則不能當成每個 server 已實作的保證。 |
| 閱讀價值 | 實作 host／server 前應先理解的互通與信任契約。 |

### 領域背景

每個模型與服務各自整合會增加介面成本。MCP 在應用與外部能力間提供共通協議，但模型產生的決策、host 政策與服務自身權限仍是不同層。

### 中階導讀

**MCP：工具的統一插頭**

規範的靈感來自 LSP（Language Server Protocol）：當年每個編輯器配每種語言都要重寫一遍，LSP 統一之後生態才爆發。MCP 想對 AI 工具做同樣的事，角色拆三層。Host 是 LLM 應用，負責建 Client、收攏 context、執行同意與安全政策。Client 是裡面的連接器，一個 Client 只連一台 Server。Server 提供 context 與能力，全走 JSON-RPC 2.0。規範要求隔離：host 應限制 server 可取得的 context，server 不應自動讀取完整對話或其他 server。開什麼能力，初始化先做 capability negotiation，沒宣告就不能用。

Server 端三種能力各有控制者：Prompts 是使用者觸發的模板，Resources 由應用端掛載管理，[Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)由模型決定呼叫。[Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 的 ACI 在這裡有了標準形狀：工具定義不再是各家 API 的方言。Client 端反過來也能開三種能力給 server。[Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling)是 server 發起的 agent 行為，模型偏好只供參考，最後由 client 選型。[Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)用來提供檔案工作範圍，此版限 file:// URI；它不能取代 host 與作業系統的權限隔離。[Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)是向使用者要結構化資訊的本版新能力，只收扁平基本型別，禁收敏感資訊。

安全章節值得單獨讀。工具就是任意程式碼執行，規範開宗明義這麼處理。工具 annotations 一律視為不可信，除非來自可信 server。呼叫要留人類否決權，敏感操作先經使用者確認，參數送出前先攤開看。sampling 的請求與回應都要能攤開給人審，roots 暴露前也要先問過使用者。協議管格式，同意流是實作者的責任——這句話在 HW1 幫助理接上 terminal、設計人類把關那一步時會回來。

```diagram
title: MCP：一個 Host，分開的連線
desc: Host 中每個 Client 各連一台 Server，context 與同意政策由 Host 管理。
caption: 依既有 MCP 段落整理；線表示連線，省略 sampling、roots 與 elicitation 往返。
---
<svg viewBox="0 0 440 384">
<rect class="dg-zone dg-zone--solid" x="16" y="16" width="408" height="216" rx="6"/>
<text class="dg-label" x="220" y="44" text-anchor="middle" dominant-baseline="central">Host：LLM 應用</text>
<text class="dg-sub" x="220" y="68" text-anchor="middle" dominant-baseline="central">彙整 context、執行同意政策</text>
<path class="dg-line" d="M116 200V292" marker-end="url(#arrow)"/>
<path class="dg-line" d="M324 200V292" marker-end="url(#arrow)"/>
<rect class="dg-box" x="36" y="136" width="160" height="64" rx="6"/>
<text class="dg-label" x="116" y="160" text-anchor="middle" dominant-baseline="central">Client A</text>
<text class="dg-sub" x="116" y="180" text-anchor="middle" dominant-baseline="central">一對一連線</text>
<rect class="dg-box" x="244" y="136" width="160" height="64" rx="6"/>
<text class="dg-label" x="324" y="160" text-anchor="middle" dominant-baseline="central">Client B</text>
<text class="dg-sub" x="324" y="180" text-anchor="middle" dominant-baseline="central">一對一連線</text>
<rect class="dg-box" x="36" y="296" width="160" height="64" rx="6"/>
<text class="dg-label" x="116" y="320" text-anchor="middle" dominant-baseline="central">Server A</text>
<text class="dg-sub" x="116" y="340" text-anchor="middle" dominant-baseline="central">提供能力</text>
<rect class="dg-box" x="244" y="296" width="160" height="64" rx="6"/>
<text class="dg-label" x="324" y="320" text-anchor="middle" dominant-baseline="central">Server B</text>
<text class="dg-sub" x="324" y="340" text-anchor="middle" dominant-baseline="central">提供能力</text>
</svg>
```

### 深入要點

Resources、prompts 與 tools 的控制方式不同；client capabilities 也不是 server 想要就能取得。讀 sampling、roots 與 elicitation 時，要同時追請求方向、能力協商與使用者可見性。

### Reviewer 一句話評

最重要的閱讀成果，是能畫出請求與信任邊界，而不只是會呼叫 tools/call。

### 給你的 take-away

畫出一個查詢工具與一個寫入工具，分別列出身分、資源範圍、確認點與可回讀結果，再對照 host 的實際政策。

## 讀物｜DSPy：用資料與 metric 改善多階段程式

[週三主讀物](https://arxiv.org/abs/2310.03714)

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

寫法上，使用者只寫 signature 加一個目標指標，編譯器分三階段調校。先產生候選示範：跑管線、只留下通過指標的軌跡。再用隨機搜尋或 Optuna 挑示範組合，必要時改寫程式結構，例如把多份編譯結果 ensemble 投票。以下是論文在指定模型、資料與評估設定下報告的結果。[GSM8K](https://arxiv.org/abs/2110.14168) 上幾行 DSPy 讓 GPT-3.5 衝上八成二正確率。[HotPotQA](https://arxiv.org/abs/1809.09600) 的兩跳檢索管線 ensemble 後，在測試集答對四成五六（論文註明該格只評一半測試集）。以 200 條標註輸入與 800 條無標註問題蒸餾出的 770M T5 程式，在開發集得到 39.3% answer exact match。小模型加好系統，打大模型加爛系統——[Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems) 的論點在這裡有了可重現的數字。

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

## 兩篇的關係：抽象層級的選擇題

週三課程標題就點名了：what frameworks abstract vs. what you built from scratch。LangChain、LangGraph、LlamaIndex 各自選了不同的抽象位置；DSPy 把輸入輸出、模組與依 metric 優化的過程明確拆開。Week 2 Anthropic 的煞車皮在這裡依然有效：框架省的是起步時間，付的是除錯能見度。HW1 不准用框架，正好讓你先把每個零件親手刻過一遍；週三這堂則回頭問同一件事：同一個 agent，手刻版和 DSPy 版差在哪，框架替你藏了什麼、也替你決定了什麼。

## 怎麼做：拿手刻管線的一段換成 DSPy 對照看

**怎麼做**：這是自選練習，不算作業——HW1 本身不准用框架，這份 DSPy 版別交上去。拿 Week 2 的手刻 RAG（或 HW1 剛起步的 email 檢索管線），只抽其中一段（例如 query 生成）用 DSPy signature 重寫。給 20 個問題當驗證集、正確率當指標，編譯一次，對照手刻版的分數和你花的時間。重點不是分數贏多少，是寫下三行：框架替你做了什麼決定、哪個決定你不同意、什麼情況下你會換回去。這三行能幫你讀懂週三那堂，提案書（週五截止）的方法論段落也能用。

## 它在課程裡的位置

Week 3 發 HW1（10/30 截止），先做 email 檢索管線，再一路加上工具、terminal、記憶與人類把關，長成完整的 harness；Week 4 的 ReAct 與 memory 就是中段的零件。MCP 往後只會越來越重要：Week 5 的多智慧體協作、Week 9 的 coding agent（SWE-agent、Claude Code 架構），談的都是標準介面上的分工。讀規範時記住它的定位句：MCP 管格式，同意與信任是實作者的功課。

## 本週 Course Material 對照

- 官方課堂投影片（PDF）：[Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)、[Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- 週一 10/5 Tool Use & Function Calling：主讀物 MCP 規範（本文已導讀）；本週無 additional readings。
- 週三 10/7 Frameworks & Orchestration：主讀物 DSPy 論文（本文已導讀）；本週無 additional readings。
- 課表原文：[CS329Z 官網 Week 3](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：對照 Lecture 04／05 投影片重核各節頁碼；補上工具失敗三層分類與 τ-bench 版本演進（L04 第 64–67 頁）、同模型換 harness 的成功率差距與 Meta-Harness（L05 第 86–88 頁），以及需要 durable orchestration 的理由（L05 第 92–93 頁）。

- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。

- 2026-10-23：補入MCP 連線圖與 DSPy 層次對照表，只將既有解說視覺化，未重新查核事實。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 課堂投影片：[Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)、[Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- 站內：[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)、[Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
- 工具：[DSPy 官網](https://dspy.ai/)、[LangChain](https://www.langchain.com/)、[LlamaIndex](https://www.llamaindex.ai/)
