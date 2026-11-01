---
title: "先分清 workflow 和 agent，再學會邊想邊做｜Stanford CS329Z 第 6 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 7
tldr: "Lecture 06 比較 workflow 與 agent：五種可組合的 workflow 模式、ReAct／Reflexion／CodeAct／ReWOO 等推理與行動模式，以及事件紀錄、壓縮、觀察遮蔽、context 隔離等管理手法，並以 Pi harness 為案例。指定讀物 ReAct 與 Anthropic 的 Building Effective Agents 各補一半。"
description: "依實體頁碼帶讀 CS329Z Lecture 06 Agent Design Patterns & Scaffolds 投影片，再深讀 Yao 等人的 ReAct 與 Anthropic 的 workflow／agent 分類指南。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

想像你請一個助理查資料：他要嘛坐在位子上憑記憶硬答，要嘛悶頭一直點連結卻從不說明在找什麼。前者答錯時你無從除錯，後者失控時你不知他要去哪。第 6 堂（10/12，Agent Design Patterns & Scaffolds）處理的正是這個兩難：什麼該寫成固定 workflow，什麼才交給 agent 自己決定下一步，以及長任務的 context 該怎麼管。

指定讀物是 Yao 等人的 [ReAct](https://arxiv.org/abs/2210.03629)、Anthropic 的 [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) 與 LangChain 的 Context Engineering，延伸閱讀是 Reflexion 與 CodeAct。本文深讀前兩篇：ReAct 讓模型把想（Thought）和做（Action）交錯寫出來，每做一步都回頭看環境回了什麼；Anthropic 則提醒先想清楚什麼值得做成 agent。這時 HW1 正走到中段，迴圈長什麼樣，是 harness 往上長之前得先定案的事。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

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

這堂把 Anthropic 的 workflow 讀物變成系統設計練習。可畫一條自己的研究流程，標出各 pattern，量出最慢與最常出錯的階段，再決定是否增加一輪評審。

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

投影片中的 Pi 以 read、write、edit、bash 為基本工具，使用 ReAct 風格迴圈、樹狀歷史、skill 按需載入與 compaction。這是本次課堂版本的案例，不應把它當作未來版本的固定功能清單。少量工具降低定義負擔，卻沒有自動限制 bash 能做什麼。[第 78 頁](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=78)直接列出它刻意不做的事：沒有 subagent、沒有權限檢查、沒有 plan mode、沒有待辦清單，也不能在背景跑 bash；其他主流 harness 的功能，交給社群擴充補上。

[第 82 頁](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=82)特別指出，它以啟動程序的權限執行、不跳出確認視窗，等於一直開著自動模式。評估 harness 時，除了工具數，也要問狀態如何保存、失敗如何停止，以及使用者限制由哪一層執行。最後回顧 workflow、reasoning 與 context 三組設計，銜接下一堂的 memory。

## 讀物｜ReAct：交錯推理與環境行動

[主讀物](https://arxiv.org/abs/2210.03629)

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

## 讀物｜Anthropic：何時需要 workflow，何時交給 agent？

[主讀物](https://www.anthropic.com/engineering/building-effective-agents)

### TL;DR

先建立可工作的簡單版本，再依控制流程需求選擇串接、分流、並行、動態發包或評審迴圈；每增加一層都要證明值得。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 第一方實務指南，依客戶與作者建置經驗整理模式，沒有統一 benchmark 對照。 |
| 應保留的界線 | 原文的模式可用來分類設計；不能據此承諾某模式對所有任務都較準，頁面的工具舉例也會更新。 |
| 閱讀價值 | 適合先做架構選型，釐清何時需要動態控制。 |

### 領域背景

LLM 可以放在固定程式管線，也可以依環境結果選下一步。兩者都有模型呼叫，真正差異是誰掌握控制權，以及失敗如何回復。對企業助理，明確的報表流程通常先由程式安排，探索式查錯才可能需要更自由的行動。

### 中階導讀

**先分清：workflow 不是 agent**

Anthropic 的第一刀切在定義上。Workflow 是 LLM 和工具照**預先寫好的路徑**走；agent 則是 LLM 自己決定流程和工具怎麼用。名字都叫 agentic systems，選型邏輯完全不同。任務切得開、用固定路徑就夠穩，選 workflow。步驟數預測不了、要模型臨場判斷，agent 才划算。而且多數應用其實連這兩者都不需要——單次 LLM 呼叫加檢索和範例通常就夠了。這段話是整篇的煞車皮，後面每個 pattern 都要回來對它。

| 設計問題 | Workflow | Agent |
|---|---|---|
| 誰決定下一步？ | 程式預先安排的路徑 | 模型依觀察決定 |
| 何時適合？ | 可重複、切得開的任務 | 步驟難以事先預測 |
| 要檢查什麼？ | 分支、輸入與輸出 | 工具決策、回饋與停止條件 |

**五個 pattern：選型工具箱**

基礎件是 augmented LLM：會自己寫搜尋 query、選工具、決定記什麼的模型，能力要為你的場景裁、介面要好寫。往上五個 pattern 按複雜度排：

**串接（prompt chaining）**：上一步輸出餵下一步，中間可加程式檢查點。任務切得乾淨時用，拿延遲換準確。

**分流（routing）**：先分類再送專門流程。不同輸入值得不同 prompt 時用；分類錯會全盤錯是前提。

**並行（parallelization）**：切成獨立子任務同時跑（sectioning），或同一任務跑多次投票（voting）。要速度或要信心時用；Anthropic 建議讓不同呼叫聚焦不同考量點；實際是否改善仍需依任務比較。

**orchestrator-workers**：中央 LLM 臨場拆任務、發包、彙整。和並行差在子任務不是預先定好的。適合拆法隨輸入變的任務，例如多檔案改 code。

**評審-優化（evaluator-optimizer）**：一通生成、一通批改，迴圈打磨。評分標準清楚、且來回改真的會變好時用，例如文學翻譯。

**Agent** 留到最後：環境回饋驅動的工具迴圈，配檢查點和步數上限。開放式問題、步驟數不可預測、且你信得過模型判斷時用。成本高、錯誤會複利，沙盒加護欄是基本配備。

**框架建議：先直接調 API**

Anthropic 的框架觀很硬：框架只是把調模型、定義工具、串呼叫變簡單，但多一層抽象就多一層除錯黑箱，還會誘惑你加不需要的複雜度。先直接用 LLM API，同樣的 pattern 幾行程式就寫得出來；真要用框架，先搞懂底層在幹嘛。附錄二把這句話做到工具定義上。工具格式要好寫：diff 比整檔重寫難寫，JSON 轉義比 markdown 累。給模型留思考 token，寫給 junior engineer 看得懂的 docstring。SWE-bench 實作裡，他們花在調工具上的時間比調總 prompt 還多。相對路徑害模型在換目錄後出錯，改成強制絕對路徑就好了。這就是 ACI（agent-computer interface）：花在 HCI 上的心力，工具介面也值得一份。

### 深入要點

工具介面也是 prompt 的一部分。名稱、描述、邊界與參數若讓模型容易誤用，換框架不會自動修好；應用實際錯誤例子改善工具定義，再量結果。

### Reviewer 一句話評

這篇最有用的是把增加自主性的理由說清楚，而非提供一張 agent 功能清單。

### 給你的 take-away

拿一項固定工作，先畫出最簡單流程，再挑一個失敗例子說明哪一步需要模型判斷；量新增步驟的延遲與修復率。

## 它在課程裡的位置

第 6 堂把迴圈的形狀定下來，[第 7 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)接著問迴圈跑久了要記住什麼。兩堂合起來，就是 HW1 從檢索管線長成完整 harness 的施工藍圖。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Agent Design Patterns & Scaffolds — Lecture 06](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)
- 指定閱讀：Yao 等人〈ReAct〉（本文深讀）、Schluntz 與 Zhang〈Building Effective AI Agents〉（本文深讀）、LangChain〈Context Engineering〉
- 延伸閱讀：Shinn 等人〈Reflexion〉、Wang 等人〈Executable Code Actions Elicit Better LLM Agents〉
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 6（10/12 週一）的內容，原屬「第 4 週：先學會邊想邊做，再學會記住」導讀；以下保留拆分前的紀錄。
- 2026-10-29：對照 Lecture 06／07 投影片重核各節頁碼；Pi 案例補上投影片列出的刻意缺席功能與權限說明（L06 第 78、82 頁）。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：依完整 Lecture 06／07 補入設計模式、context 管理、記憶分類與架構、評測及原創例題。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、記憶與人類介入納入作業要求），同步改寫開頭、ReAct／MemGPT 的「怎麼做」與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 5 堂：Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks)、[第 7 堂：Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629)、[Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- 專案與資料：[ALFWorld](https://alfworld.github.io/)、[WebShop](https://webshop-pnlp.github.io/)、[FEVER](https://fever.ai/)、[HotpotQA](https://hotpotqa.github.io/)
- 原文：[Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents)
