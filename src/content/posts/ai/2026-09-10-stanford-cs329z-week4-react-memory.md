---
title: "先學會邊想邊做，再學會記住——ReAct 與 MemGPT｜Stanford CS329Z 第 4 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 5
tldr: "Week 4 從 ReAct 迴圈與 MemGPT 分層記憶出發，接上 Lecture 06／07 的設計模式、context 管理與記憶評測。透過一個 email 助理例子，學會區分原始紀錄與模型輸入，並檢查摘要後是否仍遵守使用者限制。"
description: "帶讀 Stanford CS329Z Week 4 兩篇主讀物：Yao 等人的 ReAct 如何交錯推理與行動，Packer 等人的 MemGPT 如何用虛擬記憶體管理突破 context 上限，以及它們如何對應 HW1 的 agent harness。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

想像你請一個助理查資料：他要嘛坐在位子上憑記憶硬答，要嘛悶頭一直點連結卻從不說明在找什麼。前者答錯時你無從除錯，後者失控時你不知他要去哪。這個兩難，就是 Week 4 兩篇主讀物要解決的事。

週一（10/12，Agent Patterns）的主讀物是 Yao 等人的 [ReAct](https://arxiv.org/abs/2210.03629)（ICLR 2023）。它讓模型把「想」（Thought）和「做」（Action）交錯寫出來，每做一步都回頭看環境回了什麼（Observation）。週三（10/14，Agent Memory Architectures）的主讀物是 Packer 等人的 [MemGPT](https://arxiv.org/abs/2310.08560)（ICLR 2024）。它把作業系統的分層記憶體搬進 LLM，用 function call 在有限視窗和外部儲存之間分頁。這一週 [HW1](https://cs329z.stanford.edu/) 正好走到中段：迴圈長什麼樣、記憶放哪裡，就是 harness 要往上長之前得先定案的兩件事。

先把位置說清楚：[Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy) 發了 HW1：替一家公司做內部 AI 助理。不准用任何 agent 框架，只有一個 chat completion 呼叫和你自己寫的程式。先做在真實企業 email 封存上檢索、推理的 pipeline，再長成帶工具、terminal、記憶和人類介入的完整 harness。Week 4 給你兩篇論文當施工藍圖。[總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)把整門課定位成「工程學」，而這週就是工程圖攤開的那一週。

本文依已公開的 Lecture 06／07 完整投影片與指定論文整理，涵蓋兩份投影片的主題結構；沒有取得的課堂口述不另行補造。

官方投影片與指定讀物分工不同。以下先依實體頁碼帶讀兩堂課，再保留主讀物與延伸閱讀的深入解說。本文提出的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 06 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="86" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf">
<p>共 86 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–12 頁：設計模式要依任務補完

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=1" data-slide-page="1">投影片第 1–12 頁</a>

課堂先提醒 design pattern 需要依環境補完，再以控制流程的位置區分 workflow 與 agent。固定分類、檢索、擬稿可以由程式控制；需要探索問題與依回饋決定下一步時，才把決策交給模型。實際系統常把兩者組合。

自測題是把客服流程的每個分支寫出來：哪條是業務規則，哪條需要模型判斷？如果全部都能事先列出，先做可重現的 workflow 就能建立比較基線。

### 第 13–30 頁：五種 workflow 如何組成完整系統

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=13" data-slide-page="13">投影片第 13–30 頁</a>

串接、分流、並行、orchestrator-workers 與 evaluator-optimizer 先各自說明，再用 STORM 與 Archon 展示組合。STORM 的寫作流程同時有拆解、搜尋、整合與批改；圖上的區塊要對照誰決定子任務，不能只因多個呼叫同時執行就稱為動態發包。Archon 則把推論技巧組合本身當搜尋對象。

這堂把 Week 2 的 Anthropic 讀物變成系統設計練習。可畫一條自己的研究流程，標出各 pattern，量出最慢與最常出錯的階段，再決定是否增加一輪評審。

### 第 31–42 頁：ReAct 與 Reflexion：行動回饋如何改變下一步

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=31" data-slide-page="31">投影片第 31–42 頁</a>

ReAct 交錯推理、行動與觀察；Reflexion 再把評估與失敗反思存成下次可讀的文字。課堂接著指出，自評如果缺乏外部依據，可能只是重複原來的錯誤；CRITIC 把工具接進 verifier，補上可以核對的訊號。這些研究圖表屬於各自實驗設定，不是任何模型加上反思都會提升的保證。

檢查軌跡時，把「知道工具失敗」與「根據失敗改變策略」分開。下方 ReAct 論文導讀再拆 HotpotQA 與互動環境實驗，避免把課堂總覽當成完整實驗結論。

### 第 43–54 頁：CodeAct、ReWOO 與 LLMCompiler

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=43" data-slide-page="43">投影片第 43–54 頁</a>

CodeAct 把行動改成可執行程式，課堂用跨國手機價格比較示範迴圈與資料處理，比逐項 JSON 呼叫更容易表達組合操作；代價是程式執行環境與權限必須設計清楚。ReWOO 先產生計畫與工具依賴，LLMCompiler 再強調並行執行與動態重規劃。

自擬測試可以讓其中一家價格 API 失敗：哪些步驟可繼續平行跑，哪些必須等待？程式把過期價格算得完全正確，仍可能得到錯誤購買建議，所以驗收要包含資料時間與缺漏狀態。

### 第 55–75 頁：完整事件與當前 context 分開管理

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=55" data-slide-page="55">投影片第 55–75 頁</a>

這段的兩個原則是聚焦與延續：context 只保留當下需要的資訊，同時不能丟掉目標、限制與進度。OpenHands 的 event log 保存原始事件，每次再建模型輸入；offloading 把內容移到外部，compaction 壓縮文字，observation masking 隱藏舊工具輸出，isolation 讓子任務只回傳所需結果。Progressive disclosure 則等需要時才讀工具或 skill 細節。

這些可以組合，不必選一個通吃。若刪掉長測試輸出，可保留指令、exit code、結論與原檔路徑；如果摘要後遺失「先別寄出」的限制，就算省了很多 token 仍算失敗。這個約束檢查銜接下一堂 memory。

### 第 76–86 頁：Pi 案例：簡單工具仍有 harness 決策

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=76" data-slide-page="76">投影片第 76–86 頁</a>

投影片中的 Pi 以 read、write、edit、bash 為基本工具，使用 ReAct 風格迴圈、樹狀歷史、skill 按需載入與 compaction。這是本次課堂版本的案例，不應把它當作未來版本的固定功能清單。少量工具降低定義負擔，卻沒有自動限制 bash 能做什麼。

課堂特別指出其執行權限沿用程序權限。評估 harness 時，除了工具數，也要問狀態如何保存、失敗如何停止，以及使用者限制由哪一層執行。最後回顧 workflow、reasoning 與 context 三組設計，銜接週三 memory。

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

未來相關性在寫入時未知，所以全部保留與過早刪除都有成本。記憶也可能被污染，或讓系統在不必要時揭露個資、過度套用偏好。最後的總結把類型、架構與評估接回這些未解問題，再銜接下週 multi-agent systems。

一個可做的檢查是拿無關問題測試：記憶裡有使用者的私人行程，回答一般程式問題時是否能完全不使用它？另外測使用者更正與刪除要求能否反映到後續取用。記得多，必須和知道何時不取用一起驗收。

## 讀物｜ReAct：交錯推理與環境行動

[週一主讀物](https://arxiv.org/abs/2210.03629)

### TL;DR

ReAct 讓模型交錯產生推理與工具動作，再用觀察更新下一步；它在問答與互動環境的取捨不同，與 CoT 組合也要依任務測試。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | ICLR 2023 研究，涵蓋 HotpotQA、FEVER、ALFWorld、WebShop 與人工軌跡分析。 |
| 應保留的界線 | 少量人工分析中的零幻覺分類不是普遍零幻覺率；步數上限與 fallback 是研究設定，不是通用產品規則。 |
| 閱讀價值 | 適合學會分析工具迴圈與環境回饋。 |

### 領域背景

只靠內部推理可能編出事實，只做動作又可能重複失敗。ReAct 將環境觀察帶回決策，讓下一步可以依新證據調整。

### 中階導讀

**ReAct：想、做、看的交錯迴圈**

ReAct 的定義只有一句話：把語言空間併進動作空間。模型原本只能輸出動作，現在還可以輸出「想法」——想法不碰外部環境，只負責整理目前為止的脈絡，幫下一步的行動做決策。任務軌跡於是長成 Thought → Action → Observation 的重複序列，推理用來決定查什麼，行動用來把外部資訊餵回推理。

為什麼需要這個？此前的兩條路各有絕症。純推理（[Chain-of-Thought](https://arxiv.org/abs/2202.03629)）是靜態黑箱：模型只用內部表徵生成想法，不接地氣，錯了就一路錯下去。純行動（直接生成動作）則沒有工作記憶：論文裡的 Act 基線會忘記水槽裡沒有胡椒罐，原地重複幻覺動作。ReAct 的論點是，人類做菜時本來就這樣：切完菜想一下該燒水了，缺鹽就換醬油，食譜忘了就翻書——想與做本來就是互相服務的。

做法上，問答任務用的是陽春 [Wikipedia](https://www.wikipedia.org/) API，只有三種動作：search 查條目、lookup 在頁內找字串、finish 交答案。刻意做得這麼弱，是為了逼模型用顯式語言推理來檢索，而不是靠強檢索器作弊。決策任務（[ALFWorld](https://alfworld.github.io/) 文字遊戲、[WebShop](https://webshop-pnlp.github.io/) 網購導航）則反過來：想法只稀疏出現，什麼時候想、什麼時候做，讓模型自己決定。

**怎麼做**：今晚就把你的 HW1 迴圈凍結成這個形狀。每次迭代只做三件事：寫一行 Thought（為什麼選這個行動）、發一個 Action（調工具）、記一筆 Observation（工具回了什麼）。再加兩條護欄：步數上限（HotpotQA 取 7 步、FEVER 取 5 步，超限退回 CoT-SC），以及 finish 動作必須附答案。交卷前檢查每一條失敗軌跡屬於哪一種：推理錯、檢索空、還是鬼打牆重複——這個分類表論文附錄有現成的。

**對照實驗：幻覺去哪了**

ReAct 最值得細讀的不是分數，是 Table 2 的人工錯誤分析。作者在 HotpotQA 的兩種方法中，各抽 50 條正確與 50 條錯誤軌跡，合計 200 條人工分析。結果發現 [CoT](https://arxiv.org/abs/2202.03629) 答錯的案例裡，幻覺佔了 56%。同一套抽查下，ReAct 在抽查失敗軌跡中的幻覺分類是 0%；這不代表所有情境的幻覺率都是零。代價是結構限制換來的僵硬：ReAct 的推理錯誤率比 CoT 高，常見死法是同一組想法和動作無限重播，跳不出迴圈。

分數上兩邊互有勝負：在 [FEVER](https://fever.ai/) 事實查核任務，ReAct 以 60.9 對 56.3 贏過 CoT；在 [HotpotQA](https://hotpotqa.github.io/) 多跳問答，ReAct 以 27.4 對 29.4 小輸。最強的是混血版。HotpotQA 由 ReAct 先答、失敗再退回 CoT-SC，衝到 35.1。FEVER 則反過來，由 CoT-SC 先答、共識不足再退回 ReAct，拿到 64.6。內部知識負責結構，外部檢索負責事實——分工寫在這裡，後面 multi-agent 還會回來。

決策任務的分數更乾脆：只用一兩個 in-context 範例，ReAct 在 ALFWorld贏過模仿學習基線 34 個百分點。在 WebShop 贏過當時最佳方法 10 個百分點。微調實驗則給小模型一條活路：只用 3000 條正確軌跡微調，8B 模型的 ReAct 反超所有 62B 的 prompting 成果。教模型「如何查」，比教它「背答案」更通用——翻到 email 助理上，就是與其把整批信塞進 prompt，不如讓它學會怎麼查信。

**怎麼做**：給你的 agent 加一個 CoT 退路。ReAct 走到步數上限還沒答案，就退回純 CoT 答一次；反之 CoT 多次採樣共識太低，就切去 ReAct 查外部資料。記錄兩種路徑各救回幾題，作為自己的錯誤分析；這是自選實驗，不是官方指定的 fallback。

### 深入要點

可讀軌跡不等於完整解釋模型內部原因。驗收要看動作是否真的改變環境、觀察是否正確回傳，以及停止條件能否避免無限循環。

### Reviewer 一句話評

它把 agent 的可檢查單位從單次答案改成一條會接收回饋的軌跡。

### 給你的 take-away

保存一條失敗軌跡，標出第一個缺證據、選錯工具或重複動作的位置，再改一個環節做比較。

## 讀物｜MemGPT：有限 context 的記憶分層

[週三主讀物](https://arxiv.org/abs/2310.08560)

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

[週三延伸閱讀](https://www.letta.com/blog/agent-memory)

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

[週三延伸閱讀](https://arxiv.org/abs/2504.19413)

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

[週三延伸閱讀](https://arxiv.org/abs/2304.03442)

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

Week 4 是承先啟後的一週。往前，它給 [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 的 workflow/agent 之辨補上可運轉的形狀：ReAct 與記憶分層提供了一組可組合的 agent 設計。往後，多智慧體協作（分工、通訊與湧現行為）是 Week 5 的主菜。ReAct 論文結尾那句「人類可以直接改 Thought 來即時糾正 agent」，正是人類介入協作的起點，也是 HW1 要你在 harness 裡留給人類的那個接口。

時間線上，HW1（10/30 截止）這週該把骨架定下來：迴圈形狀和記憶設計都定案。接下來兩週才有空間接 terminal、補人類介入、跑分和寫錯誤分析。作業全程不准用框架，[Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy) 的 DSPy 留在課堂上讀，看它把你手寫的這些零件抽象成什麼樣。回到 Week 1 的問題：除了模型，哪些系統設計能改善任務？這週的論文提供了迴圈與記憶兩種可測的方向。

## 本週 Course Material 對照

- 週一：Lecture 06 與主讀物 ReAct，本文分開帶讀。
- 週三：Lecture 07 與主讀物 MemGPT；Letta、Mem0、Generative Agents 為延伸閱讀，本文各有獨立導讀。
- [官方課表](https://cs329z.stanford.edu/)。

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。

- 2026-10-23：依完整 Lecture 06／07 補入設計模式、context 管理、記憶分類與架構、評測及原創例題。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、記憶與人類介入納入作業要求），同步改寫開頭、ReAct／MemGPT 的「怎麼做」與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- [Letta: Agent Memory](https://www.letta.com/blog/agent-memory)
- [Chhikara et al.: Mem0](https://arxiv.org/abs/2504.19413)
- [Park et al.: Generative Agents](https://arxiv.org/abs/2304.03442)

- [Lecture 06: Agent Design Patterns and Scaffolds](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)
- [Lecture 07: Agent Memory Architectures](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)

- 站內：[Week 3：工具接進來，框架換上去](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy)、[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629)、[Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560)、[Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- 專案與資料：[ReAct 專案頁](https://react-lm.github.io/)、[MemGPT 研究站](https://research.memgpt.ai/)、[ALFWorld](https://alfworld.github.io/)、[WebShop](https://webshop-pnlp.github.io/)、[FEVER](https://fever.ai/)、[HotpotQA](https://hotpotqa.github.io/)
