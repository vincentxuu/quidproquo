---
title: "把工具接進來：function calling、MCP 與工具失敗｜Stanford CS329Z 第 4 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 5
tldr: "Lecture 04 從 Toolformer 的工具學習、Gorilla 與 ToolLLM 的 API 檢索，走到 function calling、MCP 與 BFCL、τ-bench 等可靠度評估。指定讀物 MCP 規範的重點是：協議統一介面，信任責任仍留在 host。"
description: "依實體頁碼帶讀 CS329Z Lecture 04 Tool Use & Function Calling 的 68 頁投影片，再深讀 MCP 規範的主從架構與安全原則；HW1 同日發布。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 4 堂（10/5，Tool Use & Function Calling）回答模型為什麼需要工具、又怎麼學會用：從 Toolformer、Gorilla 與 ToolLLM，到 REST、function calling 與 MCP 這些標準介面，再用 BFCL、ToolBench 與 τ-bench 評估工具使用。同一天 [HW1 發布](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)：不准用任何 agent 框架，只給一個 chat-completion 呼叫，從零刻一個公司內部的 AI 助理。

指定讀物有 Toolformer、Gorilla 與 [MCP 規範](https://modelcontextprotocol.io/specification/2025-06-18)。本文深讀 MCP：工具從此有統一插頭，不用每接一家重寫一遍。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

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

## 讀物｜MCP：協議統一介面，host 保留信任責任

[主讀物；本文採 2025-06-18 版](https://modelcontextprotocol.io/specification/2025-06-18)

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

Server 端三種能力各有控制者：Prompts 是使用者觸發的模板，Resources 由應用端掛載管理，[Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)由模型決定呼叫。[第 6 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)讀過的 ACI 在這裡有了標準形狀：工具定義不再是各家 API 的方言。Client 端反過來也能開三種能力給 server。[Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling)是 server 發起的 agent 行為，模型偏好只供參考，最後由 client 選型。[Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)用來提供檔案工作範圍，此版限 file:// URI；它不能取代 host 與作業系統的權限隔離。[Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)是向使用者要結構化資訊的本版新能力，只收扁平基本型別，禁收敏感資訊。

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

## 它在課程裡的位置

工具是 HW1 harness 的第一塊零件。[第 5 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks)緊接著看框架替你抽象了什麼，但 HW1 仍要求手刻。MCP 往後只會更重要：第 8 堂的多智慧體協作、第 17 堂的 coding agent，談的都是標準介面上的分工。讀規範時記住它的定位：MCP 管格式，同意與信任是實作者的功課。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- 指定閱讀：Schick 等人〈Toolformer〉、Patil 等人〈Gorilla〉、Model Context Protocol Specification 2025-06-18（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 4（10/5 週一）的內容，原屬「第 3 週：工具接進來，框架拆開看」導讀；以下保留拆分前的紀錄。
- 2026-10-29：對照 Lecture 04／05 投影片重核各節頁碼；補上工具失敗三層分類與 τ-bench 版本演進（L04 第 64–67 頁）、同模型換 harness 的成功率差距與 Meta-Harness（L05 第 86–88 頁），以及需要 durable orchestration 的理由（L05 第 92–93 頁）。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：補入MCP 連線圖與 DSPy 層次對照表，只將既有解說視覺化，未重新查核事實。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 3 堂：RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)、[第 5 堂：Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課堂投影片：[Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)
