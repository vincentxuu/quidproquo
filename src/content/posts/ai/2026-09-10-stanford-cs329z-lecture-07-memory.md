---
title: "讓 agent 記住該記的事：MemGPT、Letta、Mem0 與 Generative Agents｜Stanford CS329Z 第 7 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 8
tldr: "Lecture 07 把 agent 記憶分成 working、episodic、semantic、procedural 四類，比較技能庫、MemGPT 式分層、反思整併與記憶維護四種架構，並談記憶評測與遺忘、隱私、過度個人化。讀物從 MemGPT 的虛擬記憶體，延伸到 Letta、Mem0 與 Generative Agents。"
description: "依實體頁碼帶讀 CS329Z Lecture 07 Agent Memory Architectures 投影片，再深讀 MemGPT、Letta、Mem0 與 Generative Agents，並用一個摘要後是否還守得住舊限制的例子檢查記憶設計。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 7 堂（10/14，Agent Memory Architectures）問的是：context 有上限，跨 session 又會清空，agent 要怎麼記住真正有用的狀態？投影片把記憶分成四類，比較四種架構模式，最後談記憶評測，以及遺忘、隱私與過度個人化這些尚未解決的問題。

指定讀物是 Sumers 等人的 CoALA、Packer 等人的 [MemGPT](https://arxiv.org/abs/2310.08560) 與 Park 等人的 [Generative Agents](https://arxiv.org/abs/2304.03442)。本文深讀 MemGPT 與 Generative Agents，另讀 Letta 與 Mem0 兩個實作。MemGPT 把作業系統的分層記憶體搬進 LLM，用 function call 在有限視窗與外部儲存之間分頁。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 07 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="103" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf">
<p>共 103 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–13 頁：記憶要保存限制、程序與進度

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=1" data-slide-page="1">投影片第 1–13 頁</a>

課堂開頭的收件匣例子刻意保留「只提建議，等我說再動作」的限制。沒有記憶的長任務可能忘記程序、使用者知識與前面進度；記憶則支持個人化、從經驗學習，以及跨對話接續工作。這些好處各有不同驗收方式，不能只用「記住名字」代表全部。

自測題可以沿用同一條查信任務：下一個 session 是否知道哪些信已讀、哪些動作尚未獲准，以及使用者要的是建議還是執行？下面原創報價例子會把這個限制保留問題展開。

### 第 14–22 頁：記憶類型與儲存位置是兩個維度

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=14" data-slide-page="14">投影片第 14–22 頁</a>

Working memory 是當前工作 context，episodic memory 是過往軌跡，semantic memory 保存事實與偏好，procedural memory 保存如何做事。接著投影片把 parametric 與 context memory 另列一軸：權重裡學到的知識與外部取回的資料，不應因都叫「記憶」就混為一談。

例如「使用者偏好繁中回覆」是語意記憶，「上次整理報價的步驟」可能成為程序記憶，完整對話則是情節紀錄。先辨認要用什麼，再決定是否需要向量資料庫；儲存工具本身沒有回答這個問題。

### 第 23–29 頁：先問 what、when、how

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=23" data-slide-page="23">投影片第 23–29 頁</a>

What 決定要存與取哪些事實、程序和進度；when 決定工具按需、事件觸發或背景執行；how 才選 filesystem、database 或 knowledge graph。檔案可直接用層級與 grep 管理，資料庫可依向量或 metadata 查詢，圖則表達實體關係。它們可以組合。

對一份「下次回來繼續」的工作記憶，先寫來源、時間、未完成事項與限制，再決定檢索方式。只保存一段結論，後來發現結論過期時，系統就難以回到原始證據重判。這是本文延伸的資料設計檢查。

### 第 30–41 頁：從成功軌跡整理可重用程序

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=30" data-slide-page="30">投影片第 30–41 頁</a>

Voyager 的 skill library 保存可再利用的技能，AWM 從軌跡歸納 workflow，再放入後續任務的 context；skill files 則是把程序放在可按需讀取的文件中。共通問題是如何從一次成功提取可重用方法，而不把偶然條件寫死。

課堂也提醒動態環境的限制。若上一版網站的點擊流程已變，記憶應能回查與更新。自測時改變工具名稱或頁面結構，檢查 agent 是否把程序當可驗證假設，而非不管回饋繼續照做。

### 第 42–49 頁：分層記憶讓模型管理有限工作區

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=42" data-slide-page="42">投影片第 42–49 頁</a>

MemGPT 讓模型用工具寫入、替換與搜尋不同記憶區。Working context 已在視窗裡，不需再次搜尋；recall 與 archival 則在外部，必須透過對應介面取回。MemoryOS 再展示短期、中期與長期 persona 的分層。這些設計管理的是可見資訊，不是把模型 context window 變成物理上無限。

下方 MemGPT 原論文導讀保留控制流與實驗。讀架構圖時先追一件具體資訊：使用者更新偏好後，舊版本在哪裡，新版本何時會進 context，兩者衝突時由誰處理？

### 第 50–66 頁：反思整合與背景維護

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=50" data-slide-page="50">投影片第 50–66 頁</a>

Reflexion 與 Generative Agents 展示從事件形成較高層反思的路徑；maintenance 再處理記憶彼此的關係與時間變化。Sleep-time compute 在互動外做準備，A-Mem 由記憶管理流程連結筆記，Mem0 的圖則用 ADD、UPDATE、DELETE、NOOP 處理新舊內容。

自擬例子是使用者從「偏好早上開會」改成「這個月只能下午」。新記憶應帶範圍與時間，不能直接永久刪掉早上偏好，也不該把兩條無差別貼入 prompt。檢查維護策略是否保留來源與適用條件。

### 第 67–94 頁：從答對記憶題到完成有約束的任務

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=67" data-slide-page="67">投影片第 67–94 頁</a>

課堂的標準是 realistic、long-context、challenging、verifiable。LoCoMo 偏長對話，PersonaMem 加入偏好變化，LongMemEval-v2 以 agent 軌跡查細節，MemoryArena 進一步看多階段任務完成。每張結果圖都要連同資料來源、題型與基礎模型讀。投影片特別註記，一項 filesystem 與 retrieval 比較也有模型差異，不能只歸因儲存架構。

能找到正確記憶，仍可能用錯。多步任務失敗也可能來自工具與規劃。自測可分別保留「取回是否正確」與「最後行動是否合規」兩個分數，另測新偏好覆蓋舊偏好的情況。

### 第 95–103 頁：忘記、信任與過度個人化

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=95" data-slide-page="95">投影片第 95–103 頁</a>

未來相關性在寫入時未知，所以全部保留與過早刪除都有成本。記憶也可能被污染，或讓系統在不必要時揭露個資、過度套用偏好。最後的總結把類型、架構與評估接回這些未解問題，再銜接下一堂的 multi-agent systems。

一個可做的檢查是拿無關問題測試：記憶裡有使用者的私人行程，回答一般程式問題時是否能完全不使用它？另外測使用者更正與刪除要求能否反映到後續取用。記得多，必須和知道何時不取用一起驗收。

## 讀物｜MemGPT：有限 context 的記憶分層

[主讀物](https://arxiv.org/abs/2310.08560)

### TL;DR

MemGPT 把工作 context、對話 recall 與 archival storage 分層，讓模型以工具移入移出資訊，並用事件與警告控制有限視窗。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | ICLR 2024 論文：多 session 對話記憶、文件問答與巢狀 key-value 檢索。 |
| 應保留的界線 | 主要比較的是系統記憶管理，且各基線可見資訊不同；成績不能等同底層模型能力提升或任意長任務保證。 |
| 閱讀價值 | 適合設計跨 session 的可恢復記憶與控制流。 |

### 領域背景

固定視窗放不下所有歷史，單一摘要又可能失去日後需要的細節。MemGPT 借用作業系統分層概念，把完整資訊保留在外部，需要時再讀入。

### 中階導讀

**MemGPT：記憶體不夠，就跟作業系統借**

如果 ReAct 解決的是「怎麼動」，MemGPT 解決的是「記得住」。動機很實際：Transformer 的注意力成本隨長度平方成長，硬拉長 context 又貴又難用（模型還會搞丟中間的資訊）。MemGPT 換了一條路：把 context 視窗當成主記憶體，把外部儲存當成硬碟，讓模型自己當記憶體管理員，用 function call 把資訊分頁換入換出。

架構分兩層。主記憶體（main context）是 prompt 裡的三段。唯讀的系統指令、可讀寫的工作區（working context，放使用者偏好和人設等關鍵事實）、先進先出的訊息佇列。外部記憶是兩座資料庫：recall storage 存完整對話歷史，archival storage 存任意長的外部文件。快爆掉時，系統先發「記憶體壓力」警告。論文以水位七成為例，讓模型自己決定什麼值得寫進工作區；真的滿了才沖掉一半佇列，並留下遞迴摘要。控制流靠事件和中斷：使用者訊息、系統警告、定時器都會觸發推理，function chaining 讓模型一次做完多步檢索再回話。

兩個實驗各打一個痛點。多輪對話任務裡，基線 GPT-4 只能看到先前對話的壓縮摘要，深層記憶檢索準確率只有 32.1%。接上 MemGPT、用分頁檢索讀完整歷史後，同一個底層模型拉到 92.5%。文件問答任務裡，固定視窗基線塞越多文件越要截斷、準確率跟著掉，MemGPT 則靠分頁檢索幾乎不受影響。另一個實驗是巢狀鍵值檢索：值本身可能是下一層的鍵，要連跳多層才找得到答案；GPT-4 基線到第三層就歸零，MemGPT 在受測設定下仍能有效完成。

**怎麼做**：作為自選練習，把 agent 記憶拆成兩本帳。工作區只放「沒了它下一動就做錯」的東西（使用者目標、已確認的約束），其他一律寫外部儲存、用檢索拿回。再寫一條逐出規則：佇列超過幾則訊息就摘要，摘要只留事實不留寒暄。記錄規則與理由，再測使用者限制是否保存；這是本文建議的驗收方法，不是官方評分細則。

### 深入要點

檢索函式若拿錯資料、摘要若丟掉限制，分層本身也救不了。應把原始紀錄、目前事實與暫時推論分開，並測新舊版本衝突。

### Reviewer 一句話評

這篇的核心是把 context 管理寫成可執行控制流，讓外部記憶真的能被用回來。

### 給你的 take-away

在視窗變滿後重問一項早期限制，要求回到來源核對；記錄搜尋次數與最後動作是否仍合規。

## 讀物｜Letta：把 agent memory 拆成可建置的 context 元件

[延伸閱讀](https://www.letta.com/blog/agent-memory)

### TL;DR

Letta 用 message buffer、core、recall 與 archival memory 說明記憶如何進入 context，再討論模型自行寫入與背景整理。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 供應商工程文章，介紹設計概念與自家架構；不是獨立的效能比較。 |
| 應保留的界線 | 產品實作與 API 可能變動；記憶分層的說明不能推導成自動可靠、永久保存或一致隱私保證。 |
| 閱讀價值 | 適合把研究架構轉成可管理的 context 元件。 |

### 領域背景

MemGPT 提出控制流後，實作者仍要選擇哪些資料長駐、哪些按需取回，以及誰可以改它。Letta 把這些選擇說成明確的 context 元件，適合和研究論文一起讀。

### 中階導讀

**問題與方法。** 文章把 memory 視為 context engineering：模型這輪能用到什麼，取決於當下輸入了哪些 token。Message buffer 留近期對話；core blocks 長駐使用者、組織或任務等重點；recall 保存對話歷史；archival 放外部知識。把資料存進某處，與讓模型在正確時機讀到，是兩件事。

**控制如何運作？** 模型可用工具修改可寫 blocks，外部資料則透過檢索工具進來。Sleep-time agents 可在互動外整理與重寫記憶；它們改變的是之後的 context，沒有讓模型在當前看不見的檔案自動參與推理。

**讀到什麼程度？** 這是實作觀點，適合拿來問「誰管理這個 block」「滿了怎麼處理」「如何更正」。它沒有為所有儲存後端提供公平比較，所以不能從架構圖挑出效能冠軍。

### 深入要點

Pinned core blocks 會持續消耗視窗；外部記憶則增加檢索決策。背景整理也可能和前景互動同時改同一份資訊，應追版本、來源與使用者修正。

### Reviewer 一句話評

這篇適合當架構詞彙表與實作問題清單，實際效果仍要靠自己的任務驗證。

### 給你的 take-away

畫出一條偏好從原始訊息進 core block、被更正、再被刪除的路徑，測每一步後的模型輸入。

## 讀物｜Mem0：抽取、更新與檢索長期事實

[延伸閱讀](https://arxiv.org/abs/2504.19413)

### TL;DR

Mem0 先從對話抽出候選記憶，再和既有記憶比較以新增、更新、刪除或保留；graph 版本進一步保存實體關係。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 2025 研究預印本，以 LoCoMo 對話問答比較記憶系統、RAG 與 full-context，報告答案、延遲與 token 成本。 |
| 應保留的界線 | 26% 是相對於論文 OpenAI baseline 的 LLM judge 分數相對增幅，不是百分點；成本優勢另以 full-context 為對照，不能混用基準。 |
| 閱讀價值 | 適合研究對話事實的更新、檢索與成本權衡。 |

### 領域背景

聊天紀錄包含大量寒暄與反覆資訊，直接全塞成本高。Mem0 選擇先建立可檢索的事實層，並把「新資訊是否推翻舊資訊」放入更新流程。

### 中階導讀

**問題與方法。** 抽取流程同時看近期訊息與對話摘要，產生值得保存的候選事實；更新流程檢索相關舊記憶，再選 ADD、UPDATE、DELETE 或 NOOP。Graph 版本把實體與關係也放入表示，讓關係問題有額外結構可用。

**結果。** 論文在 LoCoMo 上依單跳、時間、多跳與開放域問題分析，摘要報告相對於其 OpenAI baseline 的 LLM-as-a-Judge 分數提升 26%。相較 full-context，另報 p95 延遲降低 91%、token 成本節省超過 90%。這些數字來自不同對照，且綁定論文的模型、題目與實作。

**為何要拆看？** 事實記憶可能省下大量重播，但抽取若漏掉「只限這個月」，查得再快也會用錯。應保留時間與來源，並測更正是否真的改變後續答案。

### 深入要點

Graph 版本提供關係表示，卻也增加維護與查詢成本。回答短對話記憶題得分較高，不能直接推出會在長期工具任務維持權限與進度；兩種需求要分開測。

### Reviewer 一句話評

它把「記住」具體化成可追查的更新操作，但 benchmark 成績必須連同對照與評分方式讀。

### 給你的 take-away

寫三輪會互相更正的偏好與期限，檢查 UPDATE／DELETE 後的檢索結果，再測與任務無關時是否不取用。

## 讀物｜Generative Agents：事件如何變成反思與計畫

[延伸閱讀](https://arxiv.org/abs/2304.03442)

### TL;DR

代理人保存自然語言 memory stream，依相關性、近期性與重要性取回經驗，再形成反思與計畫，讓模擬角色跨時間維持較一致的行為。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | UIST 2023 研究：Smallville 中 25 個代理人的互動展示、人類 believability 評估與架構消融。 |
| 應保留的界線 | 目標是行為可信度，不是證明模擬等同真實人類社會，也不是長任務可靠度、安全或經濟預測工具。 |
| 閱讀價值 | 適合理解記憶、反思與規劃如何支援持續模擬。 |

### 領域背景

單輪角色 prompt 很難維持跨事件的人際關係與目標。這篇把記憶、反思與規劃接成持續運作的模擬架構，並觀察角色之間能否出現連貫互動。

### 中階導讀

**問題與方法。** Memory stream 記錄代理人看到的事件。檢索時綜合近期性、重要性與對當前需求的相關性，再把相關經驗帶回模型。當累積到足夠重要的事件時，反思形成較高層推論；計畫再把目標排成可執行的行程，並依觀察調整。

**案例與結果。** Smallville 放入 25 個代理人，作者以一個角色想辦情人節派對作為種子，展示消息傳遞、邀請與赴會。這段故事說明互動可以從個別角色狀態長出來；正式評估另外請人比較角色回答的 believability，並用消融分析觀察、反思與計畫的貢獻。

**如何解讀？** 各元件在該模擬與評估中有貢獻，不等於缺任一元件的所有 agent 都不能工作。企業助理要借用的是經驗到計畫的連接方式，仍須用真實工作限制驗收。

### 深入要點

反思是由經驗推導的新記憶，仍可能錯誤；若再被反覆檢索，錯誤可能自我強化。應把直接觀察與推論分開保存，並允許回到原始事件核對。

### Reviewer 一句話評

最值得學的是記憶到規劃的資料流；小鎮故事的可讀性不能替代任務評估。

### 給你的 take-away

用簡單角色情境記錄一條觀察、一條反思與下一個計畫，追每個推論的來源，再加入互相衝突的新觀察。

## 本文教學例子：摘要後，還能遵守舊限制嗎？

以下是本文自擬例子，不是講者口述或官方作業解答。假設 email 助理收到：「整理供應商報價，只做草稿，等我確認再寄。」它查完多封信後視窗開始擁擠；下一次對話，使用者又說：「預算改成八萬元，繼續剛才的比較。」

先把兩次要求與工具結果寫入事件紀錄，讓原始證據可回查。工作記憶保留「比較報價、預算八萬元、只草稿、寄出需確認」及尚未補齊的供應商；舊信正文另存並保留來源 ID。摘要只需承接進度，過去冗長的工具輸出可以遮掉。等比較時再取回相關報價，而非每回合重放全部信件。

```diagram
title: 歷史不等於本次輸入
desc: 事件紀錄與記憶透過 context manager 組成本次輸入，原始證據仍可保留。
caption: 本文例子的簡化架構，省略寫入與維護路徑。
---
<svg viewBox="0 0 440 360">
  <path class="dg-line" d="M112 80V112Q112 120 120 120H172V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M328 80V112Q328 120 320 120H268V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 224V276" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="16" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="112" y="40" text-anchor="middle" dominant-baseline="central">完整事件紀錄</text>
  <text class="dg-sub" x="112" y="60" text-anchor="middle" dominant-baseline="central">要求與工具結果</text>
  <rect class="dg-box" x="232" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="328" y="40" text-anchor="middle" dominant-baseline="central">記憶儲存</text>
  <text class="dg-sub" x="328" y="60" text-anchor="middle" dominant-baseline="central">事實、程序、來源</text>
  <rect class="dg-box dg-box--accent" x="80" y="160" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="184" text-anchor="middle" dominant-baseline="central">Context manager</text>
  <text class="dg-sub" x="220" y="204" text-anchor="middle" dominant-baseline="central">篩選、摘要、取回</text>
  <rect class="dg-box" x="80" y="280" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="304" text-anchor="middle" dominant-baseline="central">本次模型輸入</text>
  <text class="dg-sub" x="220" y="324" text-anchor="middle" dominant-baseline="central">目標、限制、相關證據</text>
</svg>
```

跨 session 的 semantic memory 可把預算由舊值更新成八萬元；episodic log 仍保留改動經過。寄信程序則應在執行前檢查確認狀態。結果是：助理可以完成比較草稿，卻不能把「繼續」解讀為寄出授權。這個結果說明記憶的價值在於下一個動作是否正確，不在於資料存了多少。

**變式與判準**：若摘要只寫「已讀完報價，繼續比較」，漏掉「只做草稿」，測試是否通過？不通過。合格系統應取回或保留該限制，更新預算並引用報價來源，最後停在草稿。可以另外測偏好更新、找不到證據時不瞎猜，以及收到刪除要求後的記憶維護。這些是本文建議的測試，不是官方 HW1 評分細則。

## 評記憶，要看它能不能被正確使用

Lecture 07 要求評測兼具真實性、長 context、挑戰性與可驗證性。LoCoMo 測長對話的問答等能力，PersonaMem 加入會變動的使用者偏好，LongMemEval-v2 轉向 agent 軌跡細節，MemoryArena 再往實際任務完成推進。不要只比「檢索有沒有命中」：投影片指出，拿到對的記憶也可能用錯；完整任務失敗又未必全是記憶造成。

對上面的例子，應分開記錄：有沒有保存限制、找不找得到限制、模型有沒有遵守限制。若直接寄出，即使檢索成功，任務仍失敗。投影片也提醒未來用途難預測、記憶可能遭污染、隱私與使用者控制，以及過度個人化。對應的工程問題是：來源可否追溯、舊偏好可否更新、使用者可否刪除，以及不相關的記憶能否不使用。

## 它在課程裡的位置

第 7 堂補上 HW1 harness 的記憶層。下一週轉向分工與改善：[第 8 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent)問要不要拆成多個 agent，共享記憶也是其中的協調基礎。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Agent Memory Architectures — Lecture 07](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)
- 指定閱讀：Sumers 等人〈Cognitive Architectures for Language Agents〉、Packer 等人〈MemGPT〉（本文深讀）、Park 等人〈Generative Agents〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 7（10/14 週三）的內容，原屬「第 4 週：先學會邊想邊做，再學會記住」導讀；以下保留拆分前的紀錄。
- 2026-10-29：對照 Lecture 06／07 投影片重核各節頁碼；Pi 案例補上投影片列出的刻意缺席功能與權限說明（L06 第 78、82 頁）。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：依完整 Lecture 06／07 補入設計模式、context 管理、記憶分類與架構、評測及原創例題。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、記憶與人類介入納入作業要求），同步改寫開頭、ReAct／MemGPT 的「怎麼做」與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 6 堂：Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)、[第 8 堂：Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560)
