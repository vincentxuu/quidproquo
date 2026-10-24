---
title: "讓 agent 便宜又快：成本拆解、關鍵路徑與 harness 架構｜Harvard CS2680 第 8 堂"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-harness, prompt-caching, cost-optimization, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 10
tldr: "CS2680 第 8 堂（2026-10-07）分兩半。前半拆 agent 的帳單：成本是一條乘式，使用者數 × 每人 session 數 × 每個 session 的 turn 數 × 每個 turn 的 step 數 × 每個 step 的 token 數 × 每個 token 的價格，後四項是你能砍的。學生自己的 Claude Code 紀錄顯示，97.6% 的 token 是命中快取的重讀，所以「prefix 要穩定」比「prompt 要短」更重要。速度看的是關鍵路徑，不是每一步加總。後半比較三種 harness 架構（單體、模組化、微核心）與八個開源或商用 harness 的設計取向。本文用一張手算帳單示範：把時間戳放進 system prompt 開頭，同一個任務的帳單會從 23.6 單位變回 65 單位以上。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）第 8 堂導讀：成本乘式與四個槓桿（turns、steps、tokens、單價）、prefix cache 命中條件、反成本與預算上限、關鍵路徑與 speculative actions、單體／模組化／微核心三種 harness 架構、八個 harness 的設計取向。依據公開投影片與課程筆記，計價對照 2026-10-22 的 Anthropic 與 OpenAI 官方文件。"
draft: false
glossary:
  - term: "關鍵路徑"
    aliases: ["critical path"]
    definition: "一個任務裡，前後互相等待、最長的那一串步驟。它決定任務最快多久能做完；不在這條路上的步驟再怎麼加速，完成時間也不會變短。"
    context: "第 8 堂用它說明平行化為什麼能縮短等待，卻不一定省錢。"
  - term: "speculative action"
    aliases: ["推測執行", "speculative actions"]
    definition: "趁主模型還在思考時，先用便宜的方法猜下一個動作並提早執行；猜中就省下等待，猜錯就丟掉結果。概念借自 CPU 的推測執行。"
    context: "第 8 堂把它列為讓 agent 變快的最後一招，並提醒只適合能撤銷的動作。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness-en)

**影片狀態：課程不錄影。** 本文依公開投影片與課程筆記整理，數值例子為本站補充。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 第 8 堂在 2026 年 10 月 7 日上課，題目是〈Agent design V: cost-effective agents〉（[投影片](https://cs2680.com/slides/8_agent_design_5.pdf)），配套的課程筆記是〈[Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)〉。前幾堂教你把 agent 做出來、量它好不好；這堂問的是，做出來的 agent 為什麼這麼貴、這麼慢，又該怎麼改。

這堂要回答三個問題：agent 的成本從哪來、該先砍哪一項？延遲卡在哪？harness 要組成什麼結構？讀完之後，你應該能拿一段 agent session 的 token 帳單，指出最大的成本因子，並提出一個不會拉低成功率的改法。

投影片分兩段，中間沒有過渡頁：成本與速度（p5–38），harness 架構與八個 harness 的比較（p39–53）。本文照這個順序分成兩半，用一句話接起來：省錢、加速的手段想清楚之後，下一個問題是這些手段要放進什麼樣的程式結構裡。這堂只談模型呼叫的花費，不算其他運算成本（p5）。

## 前半：成本與速度

### 成本是一條乘式

先回想 session 的結構：一個 session 有好幾個 turn，一個 turn 是你送出一句話到 agent 回覆你；一個 turn 裡又有好幾個 step，每個 step 是一次模型呼叫或一次工具呼叫（[p6](https://cs2680.com/slides/8_agent_design_5.pdf#page=6)）。投影片把總成本寫成一條乘式（[p7](https://cs2680.com/slides/8_agent_design_5.pdf#page=7)）：

```text
成本 = 使用者數 × 每人 session 數
     × 每個 session 的 turn 數 × 每個 turn 的 step 數 × 每個 step 的 token 數
     × 每個 token 的價格
```

前兩項是產品做得好、用的人多，要讓它長大。後四項是 agent 每次怎麼跑，要讓它變小。這堂接下來就是逐項看後四項。

### 學生自己的帳

講師拿修課學生在作業 1、作業 2 交上來的 Claude Code session 紀錄當例子，這是整堂最有說服力的數字：

| 量什麼 | 作業 1 | 作業 2 | 頁 |
|---|---|---|---|
| 只有一句 prompt 的 session 比例 | 68% | 75% | [p8](https://cs2680.com/slides/8_agent_design_5.pdf#page=8) |
| 每個 turn 的 step 數（中位數） | 3 | 4 | [p10](https://cs2680.com/slides/8_agent_design_5.pdf#page=10) |
| 主 agent 每個 step 的 token 數（中位數） | 208K | 301K | [p13](https://cs2680.com/slides/8_agent_design_5.pdf#page=13) |
| 第 500 步左右的 context 大小 | 670K | 650K | [p14](https://cs2680.com/slides/8_agent_design_5.pdf#page=14) |

最後一張圖最重要（[p15](https://cs2680.com/slides/8_agent_design_5.pdf#page=15)），它拆開作業 1 全部 step 的 token。前兩欄是投影片的數字，最後一欄是本文把份額乘上價格比換算出來的。價格比照投影片寫的 1 : 10 : 50，沒算寫入快取的加價；照 Anthropic 5 分鐘快取的 1.25× 算，寫入的份額約 18%，cache read 仍約 68%：

| 類別 | token 份額 | 價格比 | 換算成金額的份額 |
|---|---|---|---|
| 命中快取的重讀（cache read） | 97.6% | 1 | 約 71% |
| 第一次送進去的新內容（cache write） | 2.0% | 10 | 約 15% |
| 模型輸出 | 0.4% | 50 | 約 15% |

cache read 打了一折，仍是帳單最大的一塊。這和[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)說的「花費大多落在命中快取的重讀上」是同一件事。

### 四個槓桿

**少一點 turn。** 第 k 個 turn 要重讀前面 k−1 個 turn，所以總成本大約隨 turn 數的平方成長（[p9](https://cs2680.com/slides/8_agent_design_5.pdf#page=9)）。快取讓重讀變便宜，但重讀的量還是平方成長，只是係數變小。使用者回頭追問，多半是因為沒有計畫、做到一半停了、或沒檢查就交差。對應的做法是：動手前先確認目標與計畫、把任務拆成各有完成條件的子任務、交回之前先跑測試。

**少一點 step。** 每一次模型呼叫都要重讀整份 context，所以呼叫次數少就便宜（[p11](https://cs2680.com/slides/8_agent_design_5.pdf#page=11)）。投影片的例子是同樣做三個動作：一次做一個要 4 次模型呼叫，先規劃、再一次發出 3 個平行工具呼叫只要 2 次。另外兩招是重用以前成功過的計畫與 skill，以及一開始就把需要的檔案讀進來，不要每步讀一個。

**每個 step 少一點 token。** 留在 context 裡的 token，之後每一步都要再付一次錢（[p16](https://cs2680.com/slides/8_agent_design_5.pdf#page=16)）。input 這邊的做法，大多是[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)講過的 context 管理。例如截掉用過的工具輸出、把舊對話摘要成狀態、只保留錯誤訊息而不是整份 log。大檔可以存到檔案裡只傳路徑，探索可以交給 subagent，只拿回一段摘要。output 這邊有三招（[p18–19](https://cs2680.com/slides/8_agent_design_5.pdf#page=18)）：

- 在 prompt 裡講清楚長度與格式，例如「100 字以內」「只回 JSON」。
- 在 API 設 `max_tokens` 上限。缺點是會在句子中間截斷，推理也可能先把額度用完。
- 用只含必要欄位的 schema，並依步驟調整推理強度：查資料用低 effort，規劃與除錯用高 effort。

**每個 token 便宜一點。** 這裡有三條路：

- **快取與批次。** 投影片列出 Claude API 相對一般 input 的價格（[p21](https://cs2680.com/slides/8_agent_design_5.pdf#page=21)）：output 5×、一般 input 1×、批次 input 0.5×、命中快取的 input 0.1×、批次加快取 0.05×。對應的做法是讓 prefix（每次請求開頭那段相同的內容）保持穩定，例如 system prompt、工具定義、早期對話，等得起的工作（評估、回填、大量作業）丟批次。
- **模型路由**（[p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)）有三型。第一型是事先選：每個 turn 開始前用一個路由器挑模型。第二型是失敗才升級：先用便宜模型，檢查沒過再換強的。第三型是每步重選：依目前的軌跡與剩餘預算決定。難處在於，便宜模型的一個規劃錯誤，可能讓後面浪費很多步。
- **系統面的技術**：MoE、量化、蒸餾、speculative decoding、KV cache 最佳化、更快的 kernel 等，投影片只列名稱，留到 Part II（[p23](https://cs2680.com/slides/8_agent_design_5.pdf#page=23)）。

p21 的倍率要對照現價看。下表是 2026-10-22 查 [Anthropic 定價頁](https://platform.claude.com/docs/en/about-claude/pricing) 的結果：

| 項目 | 投影片 p21 | 2026-10-22 現價 |
|---|---|---|
| output | 5× | 5×，各模型一致 |
| 批次 input | 0.5× | 0.5×，可以和快取折扣疊加 |
| 命中快取的 input | 0.1× | 多數模型 0.1×；Opus 5.5、Sonnet 5.5 是 0.05×，Fable 5.1、Mythos 5.1 是 0.025× |
| 寫入快取 | 沒列 | 存 5 分鐘付 1.25×，存 1 小時付 2× |

投影片的比例在大多數模型上仍然成立，最新幾款的快取更便宜。最後一列要特別注意：第一次存進快取要多付錢，所以只用一次的內容，標了快取反而虧。

### 先補一塊：prefix cache 什麼時候命中

快取的機制在 Part II 才講，但這堂的帳單分析都建立在它上面，這裡先講命中的條件。

模型每處理一段輸入，都會算出一份中間結果（KV cache）。下一次請求如果**開頭一模一樣**，服務端就能直接拿上次算好的那段，不必重算，計價也跟著打折（[總覽](/posts/ai/2026-10-21-cs2680-course-overview)的手算例子講過為什麼 agent 每步都要重讀）。關鍵字是「開頭」：從第一個 token 往後比，比到第一個不同的地方，後面就全部不算命中。

但 API 計價不是逐 token 比的。Anthropic 要你在請求裡用 `cache_control` 標出「快取到這裡」，這個位置叫快取標記（breakpoint）。快取只存在標記的位置；下一次請求從自己的標記往回找，看哪個位置有上次存過、而且到那裡為止完全相同的內容（[Prompt caching 文件](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#how-automatic-prefix-checking-works)）。命中的單位是「到某個標記為止的整段」，標記之前就算有一部分相同，沒在那裡存過也不算。不想自己放標記，可以開自動快取，它會把標記放在最後一個能快取的區塊上。

兩家的官方文件都寫得很直接：

- **順序固定。** Anthropic 把請求依 `tools` → `system` → `messages` 的順序排成一串再比對。工具定義排在最前面，所以改工具定義會讓整份快取失效；改 system prompt，工具定義那段不受影響，system 和後面的對話全部失效（[Prompt caching 文件](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#what-invalidates-the-cache)）。
- **時間戳是頭號殺手。** Anthropic 文件舉的例子是：前五個區塊固定不變，第六個區塊每次都附上時間戳和使用者訊息，快取標記放在第六個區塊。時間一變，到標記為止的內容就不同；往回找時，前五個位置又從來沒存過，所以每次都在付寫入快取的錢，卻從來沒讀到過。解法是把標記移到第五個區塊，也就是最後一段不會變的內容上。自動快取有同樣的問題，因為它的標記正好落在會變的那段。OpenAI 也只在特定的邊界比對，它的建議是把時間戳、使用者專屬內容這類會變的東西放到最後，或移到後面的對話訊息裡（[OpenAI Prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching)）。
- **太短不快取，太久會過期。** [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#cache-limitations) 的最短長度依模型是 512 到 4,096 token，預設存 5 分鐘、每次命中會重新計時；[OpenAI](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences) 在 GPT-5.6 以後的模型最短是 1,024 token，預設存 30 分鐘。agent 等一個跑很久的工具，回來時快取可能已經過期；這時可以改用 1 小時的快取，寫入價是 2×。

[課程筆記](https://cs2680.com/notes/cost-effective-agents#serving)把這件事講成一句話：較短的 prompt 不一定較便宜，縮短或重排穩定的 prefix，可能把折扣一起拿掉（〈Lower serving cost without confusing it with fewer tokens〉一節）。一篇 2026 年的獨立評測（[Don't Break the Cache](https://arxiv.org/abs/2601.06007)）在三家廠商、500 多個 agent session 上量過：用對快取，API 費用省 41–80%。但不加區分地把整份 context 都標成快取，延遲有時反而變長。

### 手算一張帳單

這是本文的教學例子，接著總覽那個「修好失敗測試」的 5 步任務：開場 context 10,000 token，每一步工具結果與模型輸出讓 context 多 1,000 token，每次模型輸出 200 token。價格用 p21 的比例，1 單位 ＝ 1,000 個一般 input token 的價錢；為了好算，先不計寫入快取的加價。

| 第幾次呼叫 | 這次讀的 context | 不用快取 | prefix 穩定、有快取 |
|---|---|---|---|
| 1 | 10,000 | 10.0 | 10.0（全部是新的） |
| 2 | 11,000 | 11.0 | 10,000×0.1 ＋ 1,000×1 ＝ 2.0 |
| 3 | 12,000 | 12.0 | 11,000×0.1 ＋ 1,000×1 ＝ 2.1 |
| 4 | 13,000 | 13.0 | 2.2 |
| 5 | 14,000 | 14.0 | 2.3 |
| input 小計 | | 60.0 | 18.6 |
| output（5 次 × 200 token × 5 倍） | | 5.0 | 5.0 |
| 合計 | | 65.0 | 23.6 |

prefix 穩定時，帳單是不用快取的 36%。現在把「現在時間：2026-10-07 14:03:27」放進 system prompt 的第一行。每次呼叫的 system prompt 都不同，比對在工具定義之後就斷了；工具定義那段沒有另外放快取標記，所以五次都沒有命中，帳單回到 65 單位。如果 harness 照樣把整段標成要快取，每次還要多付寫入的錢，以 Anthropic 的 1.25× 計是 80 單位，比完全不用快取還貴。

把寫入加價算進去，穩定 prefix 的版本是 27.1 單位，仍然不到一半。換成快取只收 0.05× 的 Opus 5.5，穩定 prefix 是 21.3 單位。

```diagram
title: 同一個 5 步任務：prefix 穩定 vs 開頭放時間戳
desc: prefix 穩定時，第 2 到 5 次呼叫只有新增的 1,000 token 付全價，input 合計 18.6 單位；system prompt 開頭放時間戳時每次都沒命中，合計 60.0 單位。
caption: 本文教學例子。長條長度與這次讀進的 context 成正比；右側數字＝這次的 input 費用，1 單位＝1,000 個一般 input token 的價錢。快取命中照 p21 的 0.1× 計，未計寫入加價。
---
<svg viewBox="0 0 640 352">
  <text class="dg-label" x="96" y="36" dominant-baseline="central">prefix 穩定，有快取</text>
  <text class="dg-label" x="380" y="36" dominant-baseline="central">system prompt 開頭放時間戳</text>
  <text class="dg-sub" x="84" y="76" text-anchor="end" dominant-baseline="central">第 1 次</text>
  <rect class="dg-bar dg-c-accent" x="96" y="64" width="142.9" height="24"/>
  <text class="dg-sub" x="246.9" y="76" dominant-baseline="central">10.0</text>
  <rect class="dg-bar dg-c-accent" x="380" y="64" width="142.9" height="24"/>
  <text class="dg-sub" x="530.9" y="76" dominant-baseline="central">10.0</text>
  <text class="dg-sub" x="84" y="116" text-anchor="end" dominant-baseline="central">第 2 次</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="104" width="142.9" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="238.9" y="104" width="14.3" height="24"/>
  <text class="dg-sub" x="261.1" y="116" dominant-baseline="central">2.0</text>
  <rect class="dg-bar dg-c-accent" x="380" y="104" width="157.1" height="24"/>
  <text class="dg-sub" x="545.1" y="116" dominant-baseline="central">11.0</text>
  <text class="dg-sub" x="84" y="156" text-anchor="end" dominant-baseline="central">第 3 次</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="144" width="157.1" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="253.1" y="144" width="14.3" height="24"/>
  <text class="dg-sub" x="275.4" y="156" dominant-baseline="central">2.1</text>
  <rect class="dg-bar dg-c-accent" x="380" y="144" width="171.4" height="24"/>
  <text class="dg-sub" x="559.4" y="156" dominant-baseline="central">12.0</text>
  <text class="dg-sub" x="84" y="196" text-anchor="end" dominant-baseline="central">第 4 次</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="184" width="171.4" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="267.4" y="184" width="14.3" height="24"/>
  <text class="dg-sub" x="289.7" y="196" dominant-baseline="central">2.2</text>
  <rect class="dg-bar dg-c-accent" x="380" y="184" width="185.7" height="24"/>
  <text class="dg-sub" x="573.7" y="196" dominant-baseline="central">13.0</text>
  <text class="dg-sub" x="84" y="236" text-anchor="end" dominant-baseline="central">第 5 次</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="224" width="185.7" height="24"/></g>
  <rect class="dg-bar dg-c-accent" x="281.7" y="224" width="14.3" height="24"/>
  <text class="dg-sub" x="304.0" y="236" dominant-baseline="central">2.3</text>
  <rect class="dg-bar dg-c-accent" x="380" y="224" width="200.0" height="24"/>
  <text class="dg-sub" x="588.0" y="236" dominant-baseline="central">14.0</text>
  <text class="dg-label dg-text--accent" x="96" y="276" dominant-baseline="central">input 小計 18.6</text>
  <text class="dg-label" x="380" y="276" dominant-baseline="central">input 小計 60.0</text>
  <line class="dg-rule" x1="20" y1="304" x2="620" y2="304"/>
  <text class="dg-tag" x="20" y="328" dominant-baseline="central">圖例</text>
  <g class="dg-c-muted"><rect class="dg-bar dg-bar--soft" x="96" y="320" width="16" height="16"/></g>
  <text class="dg-small" x="120" y="328" dominant-baseline="central">命中快取（0.1×）</text>
  <rect class="dg-bar dg-c-accent" x="300" y="320" width="16" height="16"/>
  <text class="dg-small" x="324" y="328" dominant-baseline="central">付全價（1×）</text>
</svg>
```

把這張帳單代回前面的乘式：1 個使用者、1 個 session、1 個 turn、5 個 step，每個 step 平均讀 12,000 token。前四項（使用者數、每人 session 數、每個 session 的 turn 數、每個 turn 的 step 數）都已經很小，帳單從 65 降到 23.6，靠的是最後一項：每個 token 的價格。換成 p13 那種每步讀 20 萬 token 的學生 session，最大的因子就變成每個 step 的 token 數。

這張帳單裡最大的一項，是第一次呼叫把 10,000 token 完整送進去。照這個例子的成長速度，大約從第 9 次呼叫起，cache read 的累計就超過這 10 單位，就像 p15 的學生紀錄那樣，任務越長，重讀越占大宗。所以改法有兩個方向。第一個不碰成功率：把會變的東西移出 prefix，讓快取命中。第二個是讓 context 長得慢一點，例如工具輸出只留需要的欄位，讓每一步要重讀的量變少；這一招要小心下一節講的反成本，砍掉的欄位之後若要用，得再讀一次。

> **自我檢查**：有人為了讓模型知道「今天幾號」，把現在時間寫進 system prompt 的開頭。會有什麼後果？要怎麼改？
> 答：prefix 每次都不同，快取每次都失效，每一步都回到完整的 input 價格；如果還標了快取，每次都要付寫入的加價。改法是把時間放到 prompt 最後、放進使用者訊息，或只精確到日期，讓同一天的請求開頭相同。

### 每一項省錢都有反成本

投影片接著提醒，每一招都有代價，淨節省 ＝ 省下的 － 反成本，兩者要在同一批任務上量（[p25](https://cs2680.com/slides/8_agent_design_5.pdf#page=25)）：

| 省錢手段 | 反成本 |
|---|---|
| 壓縮 context | 被丟掉的檔案之後要重讀；摘要本身也會改寫快取 |
| 用便宜模型 | 一個爛計畫可能多出很多步，或整個任務失敗 |
| 交給 subagent | 每個 subagent 都要重讀共用的檔案和指令 |
| 推測執行 | 猜錯會燒 token，還會和正常工作搶同一批工具 |

[課程筆記](https://cs2680.com/notes/cost-effective-agents#objective)舉了一個比 $/成功任務 的例子：同樣 100 題，原版花 120 美元、成功 80 題，每次成功 1.50 美元；新版花 90 美元、成功 75 題，每次成功 1.20 美元，看起來比較好，但少完成 5 題。如果部署要求至少 80% 成功率，新版就不合格（〈Measure the whole episode〉一節）。[第 1 堂](/posts/ai/2026-10-21-cs2680-lecture-01-agents-systems-problem)說要看每次成功的花費，這裡補上限制：它要和成功率門檻一起看。[第 7 堂](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation)的柏拉圖前緣，是同一件事的多指標版本。

另外兩頁是兩個習慣。第一，每個任務設預算上限，例如 10 美元、80 次模型呼叫、15 分鐘工具時間、每步最多重試 2 次；上限從過去成功任務的紀錄訂，例如 p95（最慢的 5%）的兩倍（[p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26)，投影片註明數字只是示意）。停止條件還包括驗證通過、連續 N 步沒有新的測試通過、同一個錯誤一再出現。帶著摘要停下來的任務，比失控的任務便宜。第二，先問需不需要 LLM（[p27](https://cs2680.com/slides/8_agent_design_5.pdf#page=27)）：每次步驟都一樣就寫成腳本，輸入格式固定就用規則解析，只要一個標籤或分數就訓練小分類器。只有需要推理的步驟才交給模型。

### 讓 agent 變快：完成時間看關鍵路徑

快的 agent 通常也比較便宜，但不一定（[p28](https://cs2680.com/slides/8_agent_design_5.pdf#page=28)）。依序執行時，完成時間約等於每一步加總；平行執行時，完成時間約等於關鍵路徑，也就是最長的那串互相等待的步驟（[p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)）。同一頁的兩個提醒是：便宜的小模型可能要多走幾步，反而更慢；平行化讓你少等，但總 token 變多。這和[第 5 堂](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture)的粒度公式是同一個想法。

加速的手段分五類：

- **模型服務**：前半所有省錢的手段，也都省時間（[p30](https://cs2680.com/slides/8_agent_design_5.pdf#page=30)）。
- **編排**（[p31](https://cs2680.com/slides/8_agent_design_5.pdf#page=31)）有四招：
  - 非同步：工具在跑時先準備下一步。
  - 常駐 session：shell、瀏覽器一路開著不重開。
  - 串流接力：模型還沒講完就先發工具呼叫。
  - 放在一起：工具和模型跑在同一台機器上。
- **工具本身**（[p32](https://cs2680.com/slides/8_agent_design_5.pdf#page=32)）：build、測試、載入網頁常常比模型呼叫還久。重複的讀取與搜尋可以快取，重的運算丟到伺服器，卡住的呼叫設逾時。調模型之前，先量每一步花在工具上的時間。
- **平行**（[p33](https://cs2680.com/slides/8_agent_design_5.pdf#page=33)）：互不相依的工具呼叫在同一步一起發，互不相依的子任務交給平行的 subagent。只有互相獨立的工作能平行，共用狀態就需要合併步驟。
- **推測執行**（[p34](https://cs2680.com/slides/8_agent_design_5.pdf#page=34)）：用便宜的方法猜下一個動作，趁主模型還在想時先跑；猜中就省下等待，猜錯就丟掉，代價是一次白跑的呼叫。投影片說它適合「常猜中、而且動作能撤銷」的情況。

推測執行借的是 CPU 的直覺：處理器遇到分支時不等結果，先照猜測往下算，猜錯再退回。代表作 [Speculative Actions](https://arxiv.org/abs/2510.04371)（ICLR 2026）在遊戲、電商、網頁搜尋三類環境裡，下一個動作最多猜中 55%，延遲最多降 20%。投影片 p37 拿兩篇 2026 年的論文對照兩種猜法：[PASTE](https://arxiv.org/abs/2603.18897) 從過去的軌跡學規律，看到 `search(q)` 就預先發 `visit(results[0].url)`；[SPORK](https://arxiv.org/abs/2607.03333) 讓同一個模型在推理途中分出一支，提早發出它看起來就要呼叫的工具。[課程筆記](https://cs2680.com/notes/cost-effective-agents#latency)補了一條規則：只讀或冪等（重做一次結果也一樣）的動作容易撤銷，會寫入的動作需要快照與回滾（〈Reduce waiting with a separate money budget〉一節）。

最後一頁是方法（[p38](https://cs2680.com/slides/8_agent_design_5.pdf#page=38)）：記錄每次呼叫、每個 token、每次工具與等待，找出成本與延遲的來源，一次只改一件事，再在同一批任務上重測成功率、花費與 p95 延遲。投影片這頁寫「Remember this for your Assignment 4!」；同一週開始的[作業 3](/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt)要做的也是這件事：模型當黑盒，優化它周圍的一切，成功率不能掉。

## 後半：harness 架構

前半的手段想清楚了，下一個問題是它們要放在哪裡。換模型路由要改哪個檔？sandbox 從 Docker 換成別的，要動到 agent 的主迴圈嗎？投影片用三個借自作業系統的名字回答。作業系統有把所有功能放在核心裡的「單體核心」，也有核心只管排程與通訊、其他功能交給外部服務的「微核心」；投影片把 harness 排成同樣的光譜（[p40](https://cs2680.com/slides/8_agent_design_5.pdf#page=40)）。

### 三種架構

| | 單體（monolithic） | 模組化（modular） | 微核心（microkernel） |
|---|---|---|---|
| 怎麼組 | 記憶、工具、context、規劃、執行全在同一個程式裡 | agent 仍然掌控迴圈，但透過介面取用各元件 | 小小的 runtime 只管狀態、排程與安全，能力由外部服務提供 |
| 投影片的例子 | 一個 `CodingAgent` class 自己 new 出 Memory、Tools、Planner | `memory_provider=RedisMemory()`，sandbox 從 Docker 換 Firecracker 只換一個 provider | 記憶、工具、執行各是獨立服務，可以跑在不同容器或機器上 |
| 好處 | 好寫、好除錯、內部狀態好共享、開銷低 | 元件好替換、好測試、第三方實作能接進來 | 各服務獨立擴充、故障隔離、基礎設施可共用 |
| 代價 | 換一個元件很難、元件互相綁死、隔離難做 | 生命週期仍由主控者負責，協調邏輯會越來越複雜 | 通訊開銷高、故障種類多、端到端除錯難、需要標準協定 |
| 適合 | 單一 agent | agent 框架 | 多 agent 的基礎設施 |

（整理自 [p41–45](https://cs2680.com/slides/8_agent_design_5.pdf#page=41)。）

p44 用「跑一段 Python」對照三者。單體在本機直接執行，步驟最少，但隔離很難做；模組化呼叫 `SandboxProvider.run(code)`，換 provider 不必改 agent；微核心送出執行請求，由執行服務自己配置 sandbox、執行、回傳結果，sandbox 的生命週期歸它管。這一頁也說明了為什麼[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop) 那種一個檔案的 harness 好入門，但要讓很多 agent 共用 sandbox 時就不夠用。

### 八個 harness 的設計取向

p46 列了八個 harness，各用一句話說它的取向；之後七頁各講三個獨有的機制。Claude Code 只在總表出現，沒有自己的一頁。

| harness | 誰做的 | 投影片的一句話 | 一個代表機制 |
|---|---|---|---|
| Claude Code | Anthropic（不開源） | 包在 Claude 外面的政策層與型別化的 hook | （沒有獨立頁） |
| [Codex CLI](https://github.com/openai/codex) | OpenAI | 先 sandbox，再問人 | 指令在沒有網路的 sandbox 裡跑，要出 sandbox 才請你核准；patch 格式由一份 Lark 文法（一種描述語法規則的格式）規定 |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | DeepSeek | 什麼都是 plugin，連迴圈也是 | 編輯用 compare-and-swap：檔案在模型上次讀取後變過，這次編輯就失敗 |
| [OpenCode](https://github.com/anomalyco/opencode) | Anomaly（SST） | session 伺服器加上很薄的客戶端 | TUI、SDK、網頁版都打同一個 OpenAPI 伺服器；每一步拍一次快照，`/undo` 能還原檔案 |
| [Pi](https://github.com/earendil-works/pi) | Mario Zechner／Earendil | 小小的核心，用 TypeScript 擴充 | 核心只有四個工具，沒有 MCP、subagent 與核准流程，其他功能都靠擴充 |
| [oh-my-pi](https://github.com/can1357/oh-my-pi) | Can Bölük／Stencil Labs | Pi 的分支，把原生工具與 IDE 接進來 | hashline 編輯：用內容雜湊標記行，模型不必重打舊文字 |
| [OpenClaw](https://github.com/openclaw/openclaw) | OpenClaw Foundation | 接聊天頻道的助理閘道 | 壓縮 context 之前，先靜默地跑一輪，把帶日期的筆記寫下來 |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Nous Research | 會自己寫 skill 的 agent | 背景分出一支去改記憶與 skill；context 用到一半就開始壓縮，是八個裡最早的 |

（整理自 [p46–53](https://cs2680.com/slides/8_agent_design_5.pdf#page=46)。）

這張表和前半接得起來（以下對應是本文整理）：Hermes 提早壓縮、OpenClaw 壓縮前先記筆記，處理的是前半講的 context 成本；Codex 先進 sandbox、DeepSeek Harness 的 compare-and-swap，處理的是 p44 的執行隔離與並行寫入。投影片沒有替八個 harness 排名，重點是看懂每個設計在解哪個問題。

## 綜合自我檢查

1. 一個 session 只有 1 個 turn，但這個 turn 走了 40 步，主 agent 每步讀 200K token，其中 97.6% 是 cache read。成本乘式的六個因子裡，該先動哪個？
   判準：前兩項（使用者數、session 數）不砍；turn 已經是 1。先看 step 數（獨立的工具呼叫一次發、先規劃再動手）與每步 token 數（截掉用過的工具輸出、把探索交給 subagent）。單價已經靠快取壓得很低，再壓只能換模型，那要先量成功率。
2. 上週一個 agent 的 cache read 占 input token 的 95%，這週掉到 20%，總花費翻倍。最可能是什麼原因？先查哪裡？
   判準：答出 prefix 被改動了。先比對兩週 system prompt、工具定義的差異，看有沒有新加的時間戳、隨機 id、每次排序不同的工具清單，或有人改了工具描述。工具定義一變，整份快取都失效。
3. 你想把 agent 的每個 step 從 Opus 換成便宜的模型。投影片提醒的最大風險是什麼？要量哪些數字才能下結論？
   判準：答出便宜模型的一個規劃錯誤可能讓後面多走很多步、甚至任務失敗（p22、p25）。要在同一批任務上比成功率、總花費（含失敗與重試）、p95 延遲，並確認成功率沒有掉到門檻以下，不能只看每個 token 的單價。
4. 三個 agent 平行修三個 bug，完成時間從 50 分鐘降到 20 分鐘，但帳單多了三成。這算優化成功嗎？
   判準：答出這是用錢買時間，不是省錢（課程筆記：「快 20%、貴 30%」是買了延遲）。有沒有成功要看需求：有回應時間要求就值得，否則不划算。報告時要把延遲和花費分開寫。

## 延伸閱讀

- [Prompt caching 怎麼左右 Claude Code 的速度與帳單](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching)：prefix 匹配與快取作廢時機的產品面細節。
- [Claude Code 成本怎麼管](/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage)：token 追蹤、模型選擇與 effort 的實際操作。
- [LLM 服務：排程、RadixAttention 與 PagedAttention｜CMU 11-868](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)：prefix cache 在 serving 端怎麼做到，Part II 的預習。
- [跟成熟 coding agent 學設計：系列總覽](/posts/ai/2026-08-30-coding-agent-design-series-overview)：拆五個 coding agent 的原始碼，對照本堂的架構比較。
- [Context compaction](/posts/ai/2026-08-30-coding-agent-context-compaction)：壓縮的觸發時機與反成本。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。
- 底本：[第 8 堂投影片](https://cs2680.com/slides/8_agent_design_5.pdf)（PDF 頁序 p5–53）與課程筆記〈[Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)〉，2026-10-22 讀取。頁碼一律用 PDF 頁序。
- 計價與快取規則對照 2026-10-22 的 Anthropic 定價頁、Prompt caching 文件與 OpenAI Prompt caching 指南；與投影片不同之處已在正文標出。八個 harness 的機制對照各 repo 與官方文件；投影片引用的論文數字回原文核對。〈Don't Break the Cache〉是本站補充的來源。
- 手算帳單與它的圖、cache 份額換算成金額的比例、各自我檢查的答案是本站補充，不是課堂內容。

## 參考資料

- [CS2680 第 8 堂投影片：Agent design V: cost-effective agents](https://cs2680.com/slides/8_agent_design_5.pdf)
- [CS2680 課程筆記：Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)
- [CS2680 作業總覽](https://cs2680.com/assignments)
- [Anthropic：Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Anthropic：Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI：Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [Lumer et al.（arXiv 2601.06007），Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks (2026)](https://arxiv.org/abs/2601.06007)
- [Speculative Actions: A Lossless Framework for Faster Agentic Systems (ICLR 2026)](https://arxiv.org/abs/2510.04371)
- [PASTE：Parallelizing Tool Execution and LLM Generation for Low-Latency Agent Serving (2026)](https://arxiv.org/abs/2603.18897)
- [SPORK: Self-Speculative Forking to Accelerate Agentic LLM Inference (2026)](https://arxiv.org/abs/2607.03333)
- [Codex：Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [OpenCode：Server](https://opencode.ai/docs/server)
- [Codex CLI](https://github.com/openai/codex)・[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)・[OpenCode](https://github.com/anomalyco/opencode)・[Pi](https://github.com/earendil-works/pi)・[oh-my-pi](https://github.com/can1357/oh-my-pi)・[OpenClaw](https://github.com/openclaw/openclaw)・[Hermes Agent](https://github.com/NousResearch/hermes-agent)
