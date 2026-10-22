---
title: "多 agent 架構：拓撲、任務切分與 agent 之間的通訊｜Harvard CS2680 第 5 堂"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, multi-agent, agent-harness, a2a, mcp, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 7
tldr: "CS2680 第 5 堂（2026-09-23）講多 agent 系統怎麼設計。拆成多個 agent 有四個理由：專長、隔離、平行、context 管理；每種架構都可以用三個問題描述：誰指揮、工作怎麼切、訊息怎麼傳。課堂列了八種架構，再講任務切分的六種方法、一條判斷拆不拆的粒度公式、六種常見的切分失敗，以及通訊為什麼其實是分散式系統問題：訊息會遺失、重送，兩個 agent 會同時改同一份東西。最後對照 A2A 與 MCP 的分工，並以「真的需要多 agent 嗎？」作為第一條設計原則。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）第 5 堂導讀：拆成多 agent 的四個理由、control／task／communication 三張圖、八種多 agent 架構、任務切分與粒度公式、六種切分失敗、通訊四維度與送達語意、A2A 與 MCP 的分工、四條設計原則。依據公開投影片，數字回 Anthropic、Cognition 與原論文核對。"
draft: false
glossary:
  - term: "idempotent"
    aliases: ["冪等", "idempotency"]
    definition: "同一個操作做一次和做很多次，結果一樣。例如「把狀態設成已付款」是冪等的，「餘額加 100」不是。訊息可能重送的系統，接收端要設計成冪等，或用一個 id 認出重複的請求。"
    context: "第 5 堂用「購買 8 台 GPU 機器」的逾時例子說明它為什麼重要。"
  - term: "A2A"
    aliases: ["Agent2Agent"]
    definition: "讓不同團隊、不同框架做的 agent 互相發現、委派任務、回報進度的開放協定。每個 agent 公開一張 agent card 說明自己能做什麼，任務有狀態，可以中途停下來等使用者補資訊。"
    context: "第 5 堂拿它和 MCP 對照：MCP 是 agent 接工具，A2A 是 agent 接 agent。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture-en)

**影片狀態：課程不錄影。** 本文依公開投影片整理，數值例子為本站補充。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 第 5 堂在 2026 年 9 月 23 日上課，題目是〈Agent Design II: Multi-Agent Systems〉（[投影片](https://cs2680.com/slides/5_agent_design_2.pdf)）。[第 3 堂](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent)站在使用者這邊，教你在 Claude Code 裡開 subagent 和 agent teams；這堂換到設計者這邊，問的是多個 agent 要怎麼組起來。

這堂要回答的問題是：什麼時候該把工作拆給多個 agent？拆了之後誰指揮誰，訊息怎麼傳？讀完之後，你應該能用一條粒度公式判斷一個任務值不值得拆，也能為選定的拆法指出最可能出錯的通訊環節。

投影片分三段：架構（p5–18）、任務切分（p19–25）、通訊（p26–43），最後是四條設計原則（p44）。p3 的大綱列了 agent memory，但這份投影片沒有講到，記憶移到第 6 堂。

## 為什麼要拆，拆了怎麼描述

### 四個理由

投影片列出拆成多個 agent 的四個理由（p6）：

- **專長**：不同 agent 用不同模型、prompt 與工具。
- **隔離**：不同 agent 給不同權限，例如只有一個 agent 能寫正式環境。
- **平行**：互不相依的子任務同時跑。
- **context 管理**：不讓每個 agent 都背著整條執行軌跡。

最後一點接的是[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)的結論：context 是有限資源，越長越貴，模型也越容易漏看。把搜尋交給另一個 agent，主 agent 只收到整理過的結果，自己的 context 就保持乾淨。

### 三張圖

講者用三個問題描述任何一種架構（p7）：

| 圖 | 問的是 | 可能的答案 |
|---|---|---|
| Control graph | 誰在協調？ | 一個 supervisor、一層層的階層，或沒有人；執行中會不會換手 |
| Task graph | 工作怎麼切？ | planner 事先切好、競標認領，或從局部規則自然長出來 |
| Communication graph | 怎麼溝通？ | 直接傳訊息、廣播，或共用一個工作區 |

這三張圖可以各自獨立變化。同樣是「一個 supervisor 指揮」，工作可以事先切好，也可以邊做邊切；訊息可以都經過 supervisor，也可以寫進共用的檔案。後面八種架構，投影片每一頁底下都用這三欄標註。

## 八種架構

| 架構 | 怎麼運作 | 例子 | 弱點 |
|---|---|---|---|
| Supervisor–worker | 一個 agent 規劃、派工、整合，worker 只看到自己的子任務 | 研究、寫程式、審查三個 worker | supervisor 要重讀每份結果，context 長得最快（p9） |
| Hierarchical | supervisor 底下再有 sub-supervisor | 功能開發：後端主管管 API 與資料庫，前端主管管 UI 與 E2E 測試 | 每一層要決定交多少 context 下去（p10） |
| Pipeline／DAG | 固定的幾個階段，每個交界有明確的資料格式。DAG 是有向無環圖：工作只往下游流，不會繞回來 | 發票：OCR → 抽欄位 → 對採購單 → 核准 → 入帳 | 最容易除錯，但不能回頭，第四站沒辦法要第一站重做（p11） |
| Blackboard | agent 不互傳訊息，透過共用狀態協調 | 多個 agent 共用一個 Git repo | 一致性、同時寫入、來源追蹤（p12） |
| Committee／debate | 各自提答案再討論，由裁判或投票定案 | 兩個評分者加一個裁判批改作文 | 同模型同 context，就有同一個盲點（p13） |
| Market／auction | agent 依能力、成本、延遲競標任務 | GPU 工作分派（見下方自我檢查） | 出價是自己報的，可以誇大（p14） |
| Swarm | 沒有常駐協調者，agent 直接互相協商 | 倉儲機器人協商誰撿哪張訂單 | 訊息量是 O(n²)，講者說產品裡很少用（p15） |
| Dynamic topology | 執行中加入、移除或重接 agent | 客服機器人在工單升級時才叫出帳務與 log agent | 每次跑的形狀都不同，失敗很難重現（p16） |

Pipeline 那頁有一句很實用的話：「多一條重試的邊，勝過多一個 agent」（p11）。本文的解讀是：階段之間出錯時，讓上一站重做一次，往往比再加一個 agent 便宜。

p18 的總表有一欄弱點。本文把它對到通訊上，看每種架構最容易壞在哪個環節：

- **Supervisor–worker**：壞在彙整，worker 交上來的摘要會丟細節。
- **Pipeline**：錯誤一路往下游傳。
- **Blackboard**：同時寫入，以及讀到過期的狀態。
- **Committee**：彼此不獨立，變成互相附和。
- **Swarm**：訊息量太大，問題繞來繞去。

後面講通訊時，這幾種失敗都會再出現。

實際系統大多是混合體（p17）。投影片的例子是：supervisor 底下一個 planner 產生任務 DAG，必要時重新規劃；程式、研究、測試三個 agent 共用一個 Git repo；最後由 reviewer 把關。這同時用到階層、共用記憶體與 pipeline。

拿第 3 堂的工具來對照（投影片沒有這樣比）：Claude Code 的 subagent 是 supervisor–worker，只把結果回報給主 agent。agent teams 的共享任務清單像 blackboard，teammate 之間的 mailbox 是點對點訊息。

> **自我檢查**：投影片 p14 的 GPU 競標規則是「5 秒內完成的出價中，最便宜的得標」。A100 報 0.20 美元、3 秒；T4 報 0.05 美元、10 秒；H100 報 0.40 美元、1 秒。誰得標？如果 T4 謊報成 4 秒呢？
> 答：A100。T4 最便宜但超過 5 秒，先被排除；剩下 A100 和 H100，A100 比較便宜。T4 謊報成 4 秒就會得標，任務實際要跑 10 秒，這就是這種架構「出價是自己報的」的弱點。

## 任務切分

### 六種切法與子任務規格

工作可以沿六個維度切（p20）：

- **資料**：每個 agent 處理一部分文件或紀錄。
- **專長**：資安、效能、正確性、法務各看一遍。
- **階段**：規劃、實作、測試、審查。
- **假設**：每個 agent 調查一種可能的解釋。
- **工具**：網頁、資料庫、程式執行、內部文件。
- **權限範圍**：不同 agent 在不同的管理領域行動。

切法可以疊用。投影片的例子是一個改了 200 個檔案的 PR：先按檔案切，再按資安、效能兩種專長切（p20）。

切出來的子任務要寫清楚八件事：目標、輸入與相關 context、邊界與排除項、可用工具與權限、輸出格式、怎樣算完成、預算與期限、依賴哪些其他任務（p21）。「研究儲存系統」是差的子任務；「找出 2026 年發表的儲存相關論文，回傳標題、日期、系統貢獻、評估規模與一手來源網址，排除資料庫查詢最佳化」才是好的。

[Anthropic 介紹自家 Research 功能](https://www.anthropic.com/engineering/multi-agent-research-system)時寫過同一件事：早期 lead agent 只給「研究半導體短缺」這種短指令，subagent 會重複彼此的工作、留下缺口。他們後來要求每個子任務都寫出目標、輸出格式、工具與來源的指引，以及清楚的邊界。

### 拆了會不會比較快：粒度公式

子任務切太大，平行度不夠，工作還是一件接一件做；切太小，排程與溝通的成本會蓋過省下的時間（p22）。投影片給了一條估算式：

```text
T_multi ≈ T_planning + T_critical_path + T_communication + T_merge
```

多 agent 完成的時間，大約是規劃、關鍵路徑、溝通、合併四項相加。關鍵路徑是互相依賴、必須依序完成的那條最長的工作鏈。平行化只有在「省下的循序工作」大於「規劃、溝通、整合的成本」時才划算。

用一個本文的例子算一次。一個任務交給單一 agent 要 30 分鐘。拆成三個子任務：

| | 規劃 | 關鍵路徑 | 溝通 | 合併 | 合計 | 划算嗎 |
|---|---|---|---|---|---|---|
| 三個子任務互不相依 | 2 | 10 | 3 | 5 | 20 分鐘 | 比 30 分鐘快，划算 |
| 子任務彼此依賴 | 2 | 25 | 3 | 5 | 35 分鐘 | 比 30 分鐘慢，不划算 |

第二列的關鍵路徑變成 25 分鐘：後兩個子任務要等前一個的結果，三段之中只有約 5 分鐘能重疊。這時候拆開，只是在原本的工作上多付了規劃、溝通與合併的成本。

這條公式只算完成時間，不算花費。三個 agent 平行跑，時間變短，token 卻比單一 agent 多：每個 agent 都要各自讀一次背景與指令，還要加上溝通與合併；[Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) 量到多 agent 系統用的 token 約是一般對話的 15 倍。值不值得，是另一筆帳。

> **自我檢查**：投影片 p22 的例子是把 20 個「一行就能查到」的查詢，合併成 4 個子任務。為什麼不開 20 個 agent？
> 答：每個查詢本身只要幾秒，開一個 agent 的規劃、溝通與合併成本比查詢本身還大。合成 4 批，每批的工作量才大到值得付這些固定成本。

### 事先切好，還是邊做邊切

切分的時機有四種（p23）：

- **靜態**：執行前就切好，可預測、好評估。例如上傳的五份 PDF 各摘要一份。
- **動態**：agent 發現新狀況時產生新任務。例如遇到失效的連結，就開一個查詢任務。
- **遞迴**：worker 自己再往下委派。例如審查 agent 為每個子領域開一個 sub-agent。
- **自取**：閒下來的 agent 自己領下一個任務。例如閒著的 agent 去拿下一份還沒標註的文件。

切分都要設上限，動態、遞迴、自取三種尤其需要：最多開幾個 agent、預算多少、能往下委派幾層、什麼時候停。沒有這些，委派會遞迴爆開（p23）。[Anthropic 的 Research 早期](https://www.anthropic.com/engineering/multi-agent-research-system)就出過這種錯：一個簡單的問題開了 50 個 subagent。

### 六種常見的切分失敗

| 失敗 | 例子 | 怎麼防 |
|---|---|---|
| 重疊 | 兩個 agent 摘要同一篇論文 | 子任務寫清楚邊界與排除項 |
| 缺口 | 一個查 2020–2023、一個查 2025–2026，漏了 2024 | 切完檢查範圍有沒有蓋滿 |
| 隱藏的依賴 | 定價要先知道規模，執行時才發現 | 子任務規格寫出依賴 |
| 輸出合不起來 | 一個回自由文字，一個回 JSON | 規格指定同一種輸出格式 |
| 丟失整體脈絡 | 每一節都沒問題，整份報告前後矛盾 | 合併時有人看整體，或把共同的假設寫進每個子任務 |
| 拖尾 | 六個 agent 20 秒完成，一個要 4 分鐘 | 設期限，逾時就重派或略過 |

例子都出自投影片 p24–25，「怎麼防」一欄是本文對照 p21 的子任務規格整理的。本系列把這六種失敗放在第 6 堂五層歸因的 harness 層底下，因為工作怎麼切是 harness 決定的；其中「拖尾」就是第 6 堂 harness 層列的 blocking fan-out。重疊、缺口、隱藏的依賴也可以看成子任務規格沒寫清楚。想看更完整的多 agent 失敗分類，可以讀 [MAST](https://arxiv.org/abs/2503.13657)：作者分析 7 個多 agent 框架的執行紀錄，整理出 14 種失敗，分成系統設計、agent 之間不一致、驗證三大類。

## 通訊

### 四個維度

agent 之間的通訊有四個設計維度（p27）：

- **拓撲**：誰能跟誰講話，由前面選的架構決定。
- **媒介**：用什麼交換資訊。可以透過佇列傳訊息、共用一個記憶體中的狀態物件，或交換檔案與資料庫裡的產出（p28）。
- **通道**：怎麼送。點對點、廣播、發布訂閱、共用黑板、一問一答，或交付一份產出物（p29）。
- **格式與語意**：訊息長什麼樣、表達什麼動作。

格式的建議是兩種都用（p30–31）：內容用自然語言，協調用結構化欄位。一則訊息帶著 `id`、`task_id`、寄件者、收件者，以及 DELEGATE、REPORT、CANCEL、ACK、ERROR 這類 runtime（負責轉送訊息的程式）認得的型別；真正的內容放在 payload（訊息本體）裡。這樣 runtime 不必問 LLM「這則訊息是什麼意思」，就能路由、重試、停止。投影片的經驗法則是：靠欄位路由，不要靠文字內容（p32）。

9/23 的閱讀還有兩個早期框架，本文沒有展開：[AutoGen](https://arxiv.org/abs/2308.08155) 把多 agent 寫成彼此對話；[MetaGPT](https://arxiv.org/abs/2308.00352) 把標準作業程序寫進 prompt，角色像生產線一樣分工，由具專長的角色檢查中間結果，做法接近前面的 pipeline。

### 通訊其實是分散式系統問題

投影片在 p33–34 只點了名詞與一個逾時場景。這一節用兩個例子展開：第一個是本文補的，第二個延伸 p33。

**例一：兩個 agent 同時改同一個檔案。** agent A 和 B 都讀了 `config.ts`。A 加了一個設定並寫回；B 根據自己讀到的舊版本改了另一行，也寫回。B 寫回的版本裡沒有 A 的改動，A 的工作就這樣消失了，沒有任何人報錯。這是 blackboard 架構「同時寫入」的問題（p12）。常見的處理方式有三種：同一時間只讓一個 agent 寫、寫之前先上鎖，或各自在分支上改再用 Git 合併。Cognition 在 2026 年的文章裡，也把「寫入維持單線」當成目前多 agent 能穩定運作的前提（見[設計原則](#四條設計原則與反方意見)）。

**例二：訊息逾時。** 投影片的例子是 agent A 請 B「購買 8 台 GPU 機器」，結果網路逾時，A 沒收到回覆（p33）。A 不知道 B 到底買了沒有。重送，可能買到 16 台；不重送，可能一台都沒買。A 也分不出 B 是很慢還是已經掛了，這就是下面會提到的「部分失敗」。重送就是下表的 at-least-once，不重送就是 at-most-once。分散式系統用三種送達語意描述這個取捨（定義引自 [Confluent 的 Kafka 文件](https://docs.confluent.io/kafka/design/delivery-semantics.html)）：

| 語意 | 意思 | 代價 |
|---|---|---|
| At-most-once（最多一次） | 送一次，失敗就不重送 | 可能遺失 |
| At-least-once（至少一次） | 沒收到確認就重送 | 可能重複 |
| Exactly-once（剛好一次） | 不遺失也不重複 | 要整個系統配合，很多環境做不到 |

實務上最常見的組合是「至少一次」加上冪等的接收端：重送沒關係，接收端認得出重複。投影片列的做法是在 `task_id` 上掛一個 idempotency key，B 看到同一個 key 就回傳上次的結果，不再買一次；真的做錯時要有補償或回滾的路徑（p33）。[Kafka 的冪等 producer](https://docs.confluent.io/kafka/design/delivery-semantics.html) 用的是同一個想法：每個送訊息的一方（producer）有一個 id，中間存訊息的伺服器（broker）用序號認出重複的訊息。

```diagram
title: 回覆遺失後重送，靠 idempotency key 不重複購買
desc: A 請 B 購買 8 台 GPU，B 買完的回覆在網路上遺失；A 逾時後帶同一個 key 重送，B 認出這個 key 已處理過，直接回傳上次的結果。
caption: 依投影片 p33 的情境畫，重送與去重的流程為本文補充。
step: A 請 B 購買 8 台 GPU，帶著 key t-17
step: B 向雲端供應商建立 8 台機器
step: 供應商回覆建立完成
step: B 的回覆在網路上遺失
step: A 等不到回覆，逾時
step: A 帶同一個 key 重送
step: B 查到 t-17 已處理過，不再購買
step: B 回傳上次的結果
---
<svg viewBox="0 0 640 504">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="488"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="488"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="488"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="108" text-anchor="middle" dominant-baseline="central">購買 8 台 GPU</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M324 160H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="148" text-anchor="middle" dominant-baseline="central">建立 8 台</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M540 200H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="188" text-anchor="middle" dominant-baseline="central">建立完成</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M316 248H196"/>
    <text class="dg-edge dg-text--warn" x="256" y="236" text-anchor="middle" dominant-baseline="central">回覆遺失</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M100 296H128Q136 296 136 304V312Q136 320 128 320H104" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-text--warn" x="148" y="308" dominant-baseline="central">逾時</text>
  </g>
  <g data-step="6">
    <path class="dg-line" d="M96 368H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="356" text-anchor="middle" dominant-baseline="central">重送（同一 key）</text>
  </g>
  <g data-step="7">
    <path class="dg-line" d="M324 396H352Q360 396 360 404V412Q360 420 352 420H328" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="372" y="408" dominant-baseline="central">t-17 已處理過</text>
  </g>
  <g data-step="8">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 456H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="208" y="444" text-anchor="middle" dominant-baseline="central">上次的結果</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="152" rx="2" data-step="1 2 3 4"/>
  <rect class="dg-box" x="540" y="148" width="8" height="64" rx="2" data-step="2 3"/>
  <rect class="dg-box" x="316" y="356" width="8" height="112" rx="2" data-step="6 7 8"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">agent A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">agent B</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">雲端供應商</text>
</svg>
```

投影片接著列出分散式系統本來就有的難處（p34）：

- 網路會延遲、遺失、亂序、重複。
- 各台機器的時鐘不一致。
- 很多方同時改同一份狀態。
- 分不出一個 agent 是很慢，還是已經掛了（部分失敗，partial failure）。
- 副本之間要在一致性與可用性之間取捨。
- log 分散在各處，時間還對不齊。

多 agent 系統全部繼承這些問題，還多了排程、資源分配、狀態管理三件事。而且沒有事先決定的請求流程，系統不知道誰要跑、跑多久、用多少資源（p35）。

LLM 再加一層難度（p36）：摘要會丟掉 worker 知道的細節；重要的東西被埋在長 context 裡；B 還在用 X=3，其實 X 已經改成 5；A 說安全、B 說有漏洞；每個 agent 都以為事情歸別人管；A 問 B、B 問 C、C 又問 A，繞成迴圈。

> **自我檢查**：worker 的完成回報送了兩次，supervisor 會怎樣？要怎麼設計才不會出事？
> 答：如果 supervisor 每收到一次回報就做一次後續動作（合併結果、扣預算、派下一個任務），重複的回報會讓這些動作做兩次。解法是讓處理回報這件事冪等：每則回報帶 `task_id` 或訊息 id，supervisor 記下已處理過的 id，同一個 id 再來就只回 ACK、不再處理。

### A2A 與 MCP：agent 接 agent、agent 接工具

[A2A](https://a2a-protocol.org/)（Agent2Agent）是讓 agent 互相合作的開放協定，現行規格是 1.0.0 版。流程是：A 先查 B 的能力，送訊息建立任務，收進度更新，最後拿回產出（p37）。

- **Agent card**：每個 A2A server 在 `/.well-known/agent-card.json` 公開一張機器可讀的名片，寫出它是誰、宣稱會做什麼、從哪裡呼叫、支不支援串流與推播，以及要用哪種認證（p38）。
- **三個抽象**：Message 是一輪對話；Task 是有 id、有狀態的一份工作；Artifact 是任務的產出，例如行程 PDF 與訂位資料（p39）。
- **任務狀態**：submitted、working，以及四個終態 completed、failed、rejected、canceled。中間可以停在 input required 或 auth required，等補齊資訊後回到 working。例如「訂一張去波士頓的機票」→「哪一天？」→「10 月 3 日」，三句話都屬於同一個任務（p39–40）。
- **追長任務**：短任務用輪詢，要即時輸出用串流，跑好幾個小時的用 webhook 推播（p41）。

講者的總結是：A2A 標準化的是通訊，不是編排（p41）。要不要委派、怎麼拆、什麼時候停，仍然是 harness 的事。[規格本身](https://a2a-protocol.org/latest/specification/)也強調「不透明執行」：agent 合作時不需要分享內部的想法、計畫或工具實作。

[MCP](https://modelcontextprotocol.io/)（[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)介紹過）處理的是 agent 和工具、資料之間的邊界（p42–43）：

| | MCP | A2A |
|---|---|---|
| 主要抽象 | 能力／工具 | agent／任務 |
| 關係 | agent → 服務 | agent → agent |
| 工作單位 | 一次工具呼叫 | 可能跑很久的任務 |
| 內部狀態 | 公開能力介面 | 最好不透明 |
| 類比 | 裝置或 API 介面 | 服務之間的 RPC |

MCP 標準化三種原語：tools 是可以呼叫的功能，resources 是 host 可以附加的資料，prompts 是可重用的互動範本。投影片寫「一個 client 跟很多 server 說話」，[現行 MCP 規格](https://modelcontextprotocol.io/specification/2026-07-28/architecture)的用詞是：一個 host（例如 Claude Code）開多個 client，每個 client 只連一個 server。哪些 server 能連、使用者同意了什麼，由 host 決定；工具什麼時候呼叫，則由模型決定。

兩者是疊著用的：一個透過 A2A 接到的遠端 agent，背後可能自己呼叫二十個 MCP server（p43，示意說法）。

## 四條設計原則與反方意見

投影片最後列了四條原則（p44）：

1. **真的需要多 agent 嗎？** 單一 agent 通常就夠，多 agent 常常只是多了成本與複雜度。
2. **照任務的依賴關係決定拓撲**，讓通訊越少越好。
3. **找出資訊會流失的地方**：每個彙整節點都會丟掉細節。
4. **劃出失敗的圍堵邊界**：一個 agent 卡住，整個系統不能跟著停。

投影片的結尾是：密集的網狀連接很少是好的預設，通訊變多會增加 context 壓力，有用的資訊卻不一定變多。

第一條是這堂的重點。課堂攤開八種架構之後，第一條原則卻是先問要不要拆，指定閱讀也放了一篇反方文章。

**反方：Cognition。** Cognition 的 Walden Yan 在 2025 年 6 月寫了〈[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)〉，提出兩條原則：第一，agent 之間要共享 context，而且要共享完整的執行軌跡，不能只傳單則訊息；第二，每個動作都隱含著決定，決定互相衝突就會產生壞結果。他的例子是做 Flappy Bird：一個 subagent 做背景，另一個做小鳥，結果背景像超級瑪利歐，小鳥的風格和動作也跟遊戲對不起來，最後負責合併的 agent 拿到兩份互相矛盾的東西。他的建議是：最簡單的做法就是一個單線的 agent。同一篇文章也提到，只回答問題、不動手寫程式的 subagent，他認為還可以接受，例子是當時的 Claude Code subagent。

10 個月後，他在〈[Multi-Agents: What's Actually Working](https://cognition.ai/blog/multi-agents-working)〉（2026-04）把可行的範圍說得更清楚：多個 agent 同時寫入的做法，原本的觀察仍然成立；但多個 agent 一起貢獻判斷、寫入維持單線的做法是行得通的。例子是讓寫程式的 agent 和審查 agent 來回迭代，而且審查 agent 事先不共享任何 context，反而抓得到更多錯。

**連做多 agent 的人也有但書。** [Anthropic 的 Research 功能](https://www.anthropic.com/engineering/multi-agent-research-system)用 Opus 4 當 lead agent、Sonnet 4 當 subagent，在自家內部的研究評測上比單一 Opus 4 好 90.2%。但同一篇文章也寫：多 agent 系統用的 token 約是一般對話的 15 倍，任務價值要高到付得起才划算；而且多數 coding 任務能真正平行的部分比研究少，需要所有 agent 共享同一份 context 的領域，目前也不適合多 agent。Cognition 2026 年的文章也說，Anthropic 這篇和他的第一篇結論其實相近：多 agent 最先用得上的是只讀不寫的 agent。

**控制變因的研究怎麼說。** [Kim 等人](https://arxiv.org/abs/2512.08296)（Google Research、MIT 等，arXiv 預印本）統一工具、prompt 與算力，比較單 agent 與四種多 agent 架構，共 260 種設定。結果看任務而定：

- 可以拆開的財務推理，用中央協調的多 agent，比單 agent 好 80.8%。
- 必須依序規劃的任務，讓 agent 各做各的，比單 agent 差 70%。
- 單 agent 正確率已經超過 45% 的任務，再加 agent 反而變差。
- 讓 agent 各自獨立、沒有中央驗證時，一個 agent 的錯誤會一路傳到最後的答案；有中央協調的架構，錯誤放大的程度約只有前者的四分之一。

[Tran 與 Kiela](https://arxiv.org/abs/2604.02460)（2026，arXiv 預印本）則把思考用的 token 預算固定住再比。在多跳推理題上，單 agent 打平或勝過多 agent。他們認為，很多研究報告的多 agent 優勢，其實來自沒算進去的算力與 context 效應。

綜合起來，這些來源給的判斷條件很一致：任務拆得開、子任務彼此依賴少、值得多花 token，才拆；有人負責驗證與合併，寫入集中在一個地方。這也是粒度公式（時間）與 token 帳（成本）要一起算的原因。

## 綜合自我檢查

1. 你要做一個「讀 50 份客戶訪談，整理出前五大痛點」的 agent。單一 agent 每份讀 1 分鐘，共 50 分鐘。改成 5 個 worker 各讀 10 份，估規劃 2 分鐘、溝通 3 分鐘、合併 6 分鐘。用粒度公式算拆了要多久，划不划算？用哪種切法與架構？最可能壞在哪個通訊環節？
   判準：答出 2＋10＋3＋6＝21 分鐘，比 50 分鐘快，划算；按資料切、子任務互不相依，適合 supervisor–worker。通訊上最可能壞在 supervisor 彙整時遺失細節（p36 的資訊流失、原則 3），所以要規定每個 worker 用同一種輸出格式，每個痛點附原文引述與訪談編號，supervisor 才能回頭查證、合併同類。
2. 兩個 coding agent 平行改同一個 repo，CI 時好時壞，查不出原因。從這堂的內容看，最可能是哪裡出問題？
   判準：答出這是 blackboard 架構的同時寫入（p12）：兩個 agent 各自讀到舊版本再寫回，誰後寫誰贏，所以 CI 結果看執行順序而定；也可能是兩邊互相衝突的隱含決定。建議改成寫入集中在一個 agent，或各自開分支再合併。
3. 你的 agent 要呼叫另一家公司做的報價 agent，報價可能要人工確認、花好幾個小時。該用 MCP 還是 A2A？要用哪種方式追進度？
   判準：答出 A2A，因為對方是不透明的 agent、任務會跑很久而且可能停在 input required；追進度用 push notification（webhook）。

## 延伸閱讀

- [第 3 堂：一個人帶多個 agent](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent)：本堂架構的使用者視角，subagent 與 agent teams 實際怎麼開。
- [Multi-Agent 編排模式：腳本、Model-Driven、混合](/posts/ai/2026-09-18-multi-agent-orchestration-patterns)：誰決定下一步，三種編排哲學的取捨。
- [Multi-Agent 通訊機制：Handoff、Delegate、Mailbox 與協定標準化](/posts/ai/2026-09-18-multi-agent-communication)：本堂通訊一節的實作面。
- [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)：A2A 與 MCP 之外的其他協定。
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)：MAST 的 14 種多 agent 失敗。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。
- 底本：[第 5 堂投影片](https://cs2680.com/slides/5_agent_design_2.pdf)（PDF 頁序 p5–44）與 [9/23 閱讀頁](https://cs2680.com/readings/sep-23)，2026-10-22 讀取。頁碼一律用 PDF 頁序。
- 閱讀與投影片引用的數字回原文核對：Anthropic Research 文、Cognition 兩篇、Kim 等人（arXiv 2512.08296 v3）、A2A 1.0.0 規格、MCP 2026-07-28 規格；與投影片不同之處已在正文標出。Tran 與 Kiela 的研究、Cognition 2026 年的文章與 Confluent 文件是本站補充的來源。
- 粒度公式的 30／20／35 分鐘例子、兩個 agent 同改一檔的例子、各自我檢查的答案是本站補充，不是課堂內容。

## 參考資料

- [CS2680 第 5 堂投影片：Agent Design II: Multi-Agent Systems](https://cs2680.com/slides/5_agent_design_2.pdf)
- [CS2680 閱讀：9/23](https://cs2680.com/readings/sep-23)
- [Anthropic：How we built our multi-agent research system (2025)](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Walden Yan (Cognition)：Don't Build Multi-Agents (2025)](https://cognition.com/blog/dont-build-multi-agents)
- [Walden Yan (Cognition)：Multi-Agents: What's Actually Working (2026)](https://cognition.ai/blog/multi-agents-working)
- [Kim et al., Towards a Science of Scaling Agent Systems (2025)](https://arxiv.org/abs/2512.08296)
- [Tran & Kiela, Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets (2026)](https://arxiv.org/abs/2604.02460)
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail? (2025)](https://arxiv.org/abs/2503.13657)
- [Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation (2023)](https://arxiv.org/abs/2308.08155)
- [Hong et al., MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework (2023)](https://arxiv.org/abs/2308.00352)
- [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/)
- [Model Context Protocol：Architecture（2026-07-28）](https://modelcontextprotocol.io/specification/2026-07-28/architecture)
- [Model Context Protocol：Server features（2026-07-28）](https://modelcontextprotocol.io/specification/2026-07-28/server/index)
- [Confluent：Message Delivery Guarantees for Apache Kafka](https://docs.confluent.io/kafka/design/delivery-semantics.html)
