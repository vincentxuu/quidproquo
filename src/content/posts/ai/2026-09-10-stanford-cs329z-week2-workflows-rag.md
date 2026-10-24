---
title: "先分清 workflow 和 agent，再手刻第一個 RAG｜Stanford CS329Z 第 2 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 3
tldr: "Week 2 把模型內部接到檢索工程：Lecture 02 拆解解碼、注意力、訓練、推論與 context 預算；Lecture 03 從 chunk、索引、稀疏／稠密檢索講到 reranking 與 agentic RAG。另以指定讀物補足 workflow 選型、RAG 與 ColBERT 實驗。"
description: "逐段對照 CS329Z Lecture 02／03 實體頁碼，解釋模型與 RAG 的工程取捨，再深入讀 Anthropic 的 agent 與 context 指南、RAG 和 ColBERT 論文。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Week 2 的兩堂課是刻意排成先後手的。週一主讀物是 Anthropic 的 [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)：先想清楚什麼值得做成 agent，免得一開工就過度工程。週三主讀物是 Lewis 等人的 [RAG 論文](https://arxiv.org/abs/2005.11401)：第一個複合系統的完整配方，課堂投影片再補上索引、檢索、reranking 與 agentic RAG。兩篇合起來，[HW1](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents) 第一段 email 檢索管線的施工圖就齊了。

官方投影片與指定讀物分工不同。以下先依實體頁碼帶讀兩堂課，再保留主讀物與延伸閱讀的深入解說。本文提出的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 02 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="176" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf">
<p>共 176 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–23 頁：從機率分布到解碼策略

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=1" data-slide-page="1">投影片第 1–23 頁</a>

開頭先把本課放在 LLM application 層，再回到模型到底輸出什麼：一串 token 的機率可以拆成逐步條件機率。投影片用「The class was about…」逐格展開，說明下一個 token 有許多候選；生成時的選擇方式才是 decoding。Greedy 每次取最高機率，top-k／top-p 縮小抽樣集合，beam search 同時保留候選序列。

做 agent 時，這會影響工具選擇與參數是否穩定。低 temperature 可以減少抽樣變化，卻不能替代參數驗證。自測時固定同一個工具 schema，重跑相同輸入，分開記錄「選錯工具」與「格式不合法」，別把兩種失敗都算成模型不夠聰明。

### 第 24–62 頁：Transformer：每個位置如何讀取前文

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=24" data-slide-page="24">投影片第 24–62 頁</a>

這段用多張逐步動畫拆 decoder-only Transformer。Token 先變成 embedding，加入位置資訊，再經過 attention 與 feed-forward 層，最後由 LM head 給出下一個 token 的分布。Attention 的 query 與 key 決定要讀哪些位置，再用權重混合 value；causal mask 擋住訓練時不應看見的未來 token。多頭注意力讓模型在不同子空間處理關係。

圖中箭頭值得逐步看，不必把每張視為新概念。讀到這裡應能回答：模型正在生成工具參數時，工具定義與使用者限制如何影響這個位置？它們必須真的出現在可讀的 context 中。架構提供存取路徑，沒有保證每次都會抓對限制。

### 第 63–91 頁：線性注意力以壓縮狀態換取效率

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=63" data-slide-page="63">投影片第 63–91 頁</a>

完整 softmax attention 保留過去位置的 key／value；線性注意力則逐步更新壓縮狀態，讓新 token 與狀態互動。投影片先畫出狀態保存與更新，再比較序列長度增加時的計算與記憶體需求，接著指出長 context 的取用能力仍要實測，並展示混合兩類注意力的設計。

不要從「視窗很長」直接推論「能找回所有細節」。挑一份實際會交給助理的繁中長文件，把同一條限制移到前、中、後段，檢查答案與延遲。這是本文的自擬測法；它把架構比較轉成選模型時可用的證據。

### 第 92–118 頁：訓練階段決定模型學過什麼

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=92" data-slide-page="92">投影片第 92–118 頁</a>

從 next-token cross-entropy 出發，這段依序介紹 pretraining 的清理、去重與資料混合，midtraining 的領域分布調整，以及 post-training 的指令遵循與偏好學習。人類偏好不是客觀真值：標註可能不可靠，偏好也可能互相衝突。可驗證獎勵則把測試、證明或環境狀態當回饋，仍須檢查 verifier 是否真的代表任務成功。SWE-smith 是 agent 軌跡訓練的課堂案例。

因此，會寫自然語言與會在你的工具環境完成工作，是兩項需要分別驗收的能力。給模型一個會失敗的工具結果，觀察它是否改參數、改策略或要求協助；這比只考一次正常呼叫更貼近 harness 的需求。

### 第 119–137 頁：Prefill、decode 與 KV cache

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=119" data-slide-page="119">投影片第 119–137 頁</a>

Prefill 先處理輸入，decode 再逐步產生輸出。圖中保留下來的 key／value 就是 KV cache：後續生成可重用既有計算。這解釋了為何長 prompt 的首次等待、逐字輸出速度與整段耗時應分開觀察。Speculative decoding 則讓較小的 draft model 提議續文，再交由 target model 驗證。

對多輪 agent，可先檢查工具結果是否過長、穩定前綴是否一直改寫。投影片提供的是推論機制；實際供應商的快取條件與費率仍需看其文件。不要把 KV cache、應用層答案快取與保存使用者記憶混成同一件事。

### 第 138–148 頁：多花推論算力，需要選出好答案的方法

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=138" data-slide-page="138">投影片第 138–148 頁</a>

這段把更長的 reasoning 與 repeated sampling 放在一起比較。多生成候選可能增加找到好答案的機會，但還需要可靠的 verifier 或彙整方法；self-consistency 用多條推理結果的共識做選擇，也會受共同錯誤影響。投影片的外套漲價再打折例子，提醒讀者檢查百分比的基準，而非只看推理文字的長度。

自擬練習可把相同預算分成「一次較長推理」與「多次較短生成」。固定評分規則，同時記錄成功率、成本與延遲，才能判斷多花的 token 是否值得。

### 第 149–159 頁：結構化輸出是元件間的契約

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=149" data-slide-page="149">投影片第 149–159 頁</a>

複合系統不能只靠「看起來像答案」的字串連接。這段從欄位契約談到 constrained decoding，並展示 DSPy signature 與工具呼叫。限制可生成的 token，有助於維持結構；schema 合法仍不代表內容正確，更不代表操作已獲授權。

例如繁中郵件寫「週四可以談」，抽出 meeting intent 合法，卻沒有時區、日期與收件人確認。先驗證結構，再查語意與必要欄位，最後才交給執行器。這個例子是本文延伸，不是投影片中的作業解答。

### 第 160–176 頁：Context engineering：保留決策需要的資訊

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=160" data-slide-page="160">投影片第 160–176 頁</a>

最後把 system prompt、歷史、記憶、工具結果與附件列成同一份 context 預算。重點包括避免肥大、按需檢索、盡量維持可重用的前綴、用 eval 比較取捨，以及 compaction 時保存關鍵限制。Recursive LM 是另一種把大量材料放在外部、按需操作的課堂方向。結尾回顧全課並銜接 RAG。

自測時先保存完整事件，再製作送入模型的精簡版本。檢查任務目標、未完成步驟與使用者禁止事項是否還在。這讓「減少 token」有明確的驗收條件，也銜接下面 Anthropic 的延伸閱讀。

## Lecture 03 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="63" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf">
<p>共 63 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–9 頁：從 project 問題開始，而非先選框架

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=1" data-slide-page="1">投影片第 1–9 頁</a>

課務與 project 說明先要求定義任務、研究問題、資料來源與成功條件。課堂列出課程表、研究搜尋與 coding agent 等題目，但強調只成功一次的 demo 不足以說明品質。比較基線、測多種任務、交代失敗原因，才有可討論的結果。

本文自擬的繁中內部知識助理可以先收集同事真正問過的問題，標出證據所在與無法回答的情況，再決定檢索器。這能避免做到最後才發現沒有可用資料或沒有評分標準。

### 第 10–22 頁：RAG 的動機與原始生成配方

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=10" data-slide-page="10">投影片第 10–22 頁</a>

「哪場 office hour 最不擠？」的例子把一般常識與即時紀錄分開：模型猜週三可能安靜，查排隊紀錄後才知道哪個時段人少。Retriever 先找證據，reader／generator 再回答。原始 RAG 用 DPR 找段落、BART 生成，並以檢索機率加權；Sequence 與 Token 的差別在於整段答案或各 token 如何對檢索文件做邊際化。

讀效能表時要分清原始論文的聯合訓練架構，與今天常見的「固定檢索器加 chat model」。下面論文導讀保留實驗細節，這裡先確認一件事：回答能否指出支持它的原始段落？

### 第 23–31 頁：Chunk 的邊界決定證據是否完整

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=23" data-slide-page="23">投影片第 23–31 頁</a>

同一段評分規則被切成不同 chunk，會影響截止時間與 late-day 限制能否一起被找到。固定大小容易實作，卻可能切斷語意；按句子或結構切分可保存邊界，但長度更不均勻。Contextual retrieval 為片段加上文件脈絡，late chunking 則先編碼較長文件，再形成片段表示。

課堂的 ACME 營收例子說明，只有「成長了多少」而沒有公司與季度，片段離開原文件後就難以辨識。自測可問同一個數值屬於哪家公司、哪一期，並保留原始文件 ID，避免補進的脈絡被誤當原文證據。

### 第 32–38 頁：跨段問題與近似向量搜尋

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=32" data-slide-page="32">投影片第 32–38 頁</a>

RAPTOR 用分層摘要讓檢索跨越單一片段，灰姑娘的主旨與結局例子用來區分局部事實和全篇問題。GraphRAG 則先形成實體與關係、社群與摘要。這些表示法會增加建索引成本，也可能把摘要錯誤帶進檢索，因此應先確認自己的問題真的需要全篇整合。

向量搜尋接著處理規模：精確掃描逐一比對，HNSW 透過多層近鄰圖導航，加速找候選但採近似結果。索引近似誤差與 embedding 是否表達對語意，是兩層不同的失敗，測試時應分開。

### 第 39–54 頁：BM25、dense、hybrid 與 reranker 各解一種問題

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=39" data-slide-page="39">投影片第 39–54 頁</a>

BM25 依詞彙重疊、詞頻飽和與長度校正打分；DPR 將問題與段落各編成向量。前者能抓錯誤碼和罕見字面值，後者能找到不同措辭，因此 hybrid search 用兩邊候選合併，RRF 依排名融合。Cross-encoder 再看 query 與候選段落的互動，通常留到較小候選集合；ColBERT 則保存 token 層級向量，以 late interaction 做細粒度比對。

評估也要配問題：Hit@k 問是否至少命中一份，Recall@k 問相關證據找回多少，MRR 看第一份相關結果的位置，nDCG 評排名與相關程度。若題目需要兩份證據，單看 Hit@k 容易掩蓋缺漏；這是選指標時必須先寫清楚的需求。

### 第 55–63 頁：讓 agent 決定何時查、查什麼與何時停

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=55" data-slide-page="55">投影片第 55–63 頁</a>

前面的元件回答「給定 query 怎麼找」，agentic RAG 再決定要不要查、要改問什麼。Self-RAG 把檢索與自評訊號納入生成，CRAG 先評估檢索品質，Search-R1 用多輪搜尋互動學習策略。它們處理的控制問題不同，不能只因都有迴圈就當成同一做法。

最後一頁把失敗分成 retriever、reader 與 loop：缺證據、過期或越權資料；位置偏差、干擾或衝突；以及早期錯誤擴散、缺停止條件與注入。測一個查不到答案的問題，確認系統會停止並交代缺口，而非一直換 query 直到拼出看似合理的答案。

## 讀物｜Anthropic：何時需要 workflow，何時交給 agent？

[週一主讀物](https://www.anthropic.com/engineering/building-effective-agents)

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

## 讀物｜Anthropic：每輪應該讓模型看見什麼？

[週一延伸閱讀](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### TL;DR

Context engineering 管理整輪輸入：指令、工具、歷史與外部資料共同競爭有限注意力；用按需讀取、摘要與隔離保存高訊號內容。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 第一方工程指南，提供長任務與工具設計經驗及策略分類。 |
| 應保留的界線 | 策略有資訊流失、額外檢索與協調成本；文章不提供套用後必然改善的效果量。 |
| 閱讀價值 | 適合長任務的 context 與工具輸入設計。 |

### 領域背景

Prompt engineering 常以單次輸入措辭為中心；長任務每輪又會加入新觀察，因此必須管理持續變化的輸入。長視窗放得下，不代表每一段都會被正確使用。

### 中階導讀

**延伸閱讀：context 是預算，不是水桶**

Anthropic 的 [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 把設計單位從 prompt 擴到整個推論狀態。每一輪塞進模型的不只系統指令，還有工具定義、外部資料、訊息歷史與工具結果。目標不是把視窗填滿，而是留下最少、訊號最強、足以引出正確行為的 token。靜態內容要精簡：工具邊界不要重疊，回傳不要肥大，few-shot 範例寧可少而典型。

動態內容則按需取回。先留路徑、查詢或 URL 等輕量索引，等下一個決策真的需要時才讀全文。長任務另有三種手段：compaction 壓縮過長軌跡、結構化筆記把重要狀態寫到視窗外、subagent 把深入探索隔離後只回傳結論。代價也不同：壓太兇會丟掉後來才變重要的細節，自主檢索則會增加延遲，也可能追錯線索。這是第一方實務指南，不是提供效果量的 benchmark；適合拿來做檢查表，不適合承諾用了就會漲幾分。

對本週 RAG 練習，重點是別停在「抓 top-k 全貼上去」。固定檢索器後，分別改 top-k、chunk 長度、工具回傳格式與 history pruning，同時量答案品質、token 與延遲。另一版可以先只給來源索引，再讓 agent 按需讀段落，看看 progressive disclosure 是否真的省下成本。

### 深入要點

壓縮前先定義不能丟的欄位：使用者限制、進度、未決問題與來源指標。子任務摘要要能回到證據，否則父流程只能相信結論，無法核對。

### Reviewer 一句話評

它把 context 從文字收納問題，改成有成本與驗收條件的狀態設計。

### 給你的 take-away

固定模型與題目，分別比較全文重播、摘要與按需檢索；另外檢查舊限制是否仍被遵守。

## 讀物｜Lewis 等人：讓檢索文件參與生成與訓練

[週三主讀物](https://arxiv.org/abs/2005.11401)

### TL;DR

原始 RAG 把 DPR 檢索與 BART 生成接起來，對文件機率做邊際化，並共同訓練 query encoder 與 generator；換索引可以改變外部知識。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | NeurIPS 2020 研究論文：開放域問答、抽象問答、題目生成與事實分類，附消融與索引更換實驗。 |
| 應保留的界線 | 結果屬論文模型與資料設定；現代固定 retriever 加 chat model 不等於重現原始聯合訓練，也不自動避免幻覺或越權。 |
| 閱讀價值 | 適合建立檢索與生成共同建模的研究基礎。 |

### 領域背景

參數記憶不容易即時更新與提供出處。RAG 把可替換的外部索引加入生成模型，讓回答可以使用訓練後才更新的資料；檢索品質因此成為答案品質的上限之一。

### 中階導讀

**RAG：第一個複合系統的配方**

[上一週](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)說系統時代來了，這週直接給配方。RAG 論文的問題意識很準。大模型把知識存在參數裡，下游微調成績好看，但**拿知識出來用的能力**不行。出處交代和知識更新仍有困難。解法是參數記憶加非參數記憶：seq2seq 模型（[BART](https://arxiv.org/abs/1910.13461)）配 Wikipedia 稠密向量索引，用神經檢索器（[DPR](https://arxiv.org/abs/2004.04906)）去查。

兩種做法：RAG-Sequence 對每份檢索文件下的整段答案機率做邊際化；RAG-Token 則在每個輸出 token 對文件做邊際化。 Jeopardy 生成任務最能看出差別：答案常由兩段不相干事實拼成，Token 版可以前半看一份文件、後半換一份。

訓練方式值得單獨記：檢索器和生成器一起練，不需要標好的檢索答案也能學；文件編碼器凍結，只調 query 編碼器和生成器。檢索器是 DPR 雙編碼器：文件和問題各過一個 BERT，相似度用內積，top-K 用 MIPS 近似搜尋。生成器是 BART-large，輸入和檢索段落直接串接餵進去。

實驗以同一套架構涵蓋四種任務。開放域問答拿下當時最佳，而且是生成式答案打贏抽取式前輩。檢索段落裡沒有原文答案也能生對，NQ 這個子集的正確率是 11.8%，抽取式是零分。抽象問答（MS-MARCO）贏 BART 兩個多 BLEU。Jeopardy 出題請人類盲測，RAG 比 BART 更貼事實的比例是42.7% 對 7.1%。FEVER 查核看檢索命中：以文章標題重疊衡量，首筆來自 gold article 的比例是 71%；前十筆包含 gold article 的比例是 90%。

消融實驗回答 HW1 一定會問的問題。檢索器凍結不練，每個任務都掉分。把稠密檢索換成 BM25，只有 FEVER 這種實體密集任務 BM25 反而贏。詞語重疊在專有名詞戰場仍有優勢。檢索文件數訓練用五到十篇，測試時 Sequence 版越多越好，Token 版十篇封頂。

知識更新更直接：換索引檔就行。作者拿新舊兩版 Wikipedia 建索引考世界領袖，年份配對的正確率分別為 70% 與 68%；錯配則降到 12% 與 4%。不用重訓模型——Week 1「動態」理由的機制版。相關工作定位一次說清：REALM 和 ORQA 只做抽取式問答，RAG 是第一個把混合記憶做成通用生成配方的。

對課程的意義：RAG 提供具體的複合系統範本。 Week 1 的三個設計問題（控制邏輯、資源分配、端到端優化）第一次有了可以動手的具體形狀。

```diagram
title: RAG 把兩種知識來源接在一起
desc: 問題與檢索段落進入生成，模型權重中的知識也參與回答。
caption: 依正文整理的概念圖；省略編碼器內部與 Sequence／Token 的邊際化差異。
---
<svg viewBox="0 0 440 448">
<path class="dg-line" d="M200 48H212Q220 48 220 56V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M108 80V116" marker-end="url(#arrow)"/>
<path class="dg-line" d="M108 184V216Q108 224 116 224H172V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M332 184V216Q332 224 324 224H268V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 328V364" marker-end="url(#arrow)"/>
<rect class="dg-box" x="16" y="16" width="184" height="64" rx="6"/>
<text class="dg-label" x="108" y="40" text-anchor="middle" dominant-baseline="central">問題</text>
<text class="dg-sub" x="108" y="60" text-anchor="middle" dominant-baseline="central">查詢輸入</text>
<rect class="dg-box" x="16" y="120" width="184" height="64" rx="6"/>
<text class="dg-label" x="108" y="144" text-anchor="middle" dominant-baseline="central">檢索</text>
<text class="dg-sub" x="108" y="164" text-anchor="middle" dominant-baseline="central">外部文件索引</text>
<rect class="dg-box" x="240" y="120" width="184" height="64" rx="6"/>
<text class="dg-label" x="332" y="144" text-anchor="middle" dominant-baseline="central">模型權重</text>
<text class="dg-sub" x="332" y="164" text-anchor="middle" dominant-baseline="central">參數記憶</text>
<rect class="dg-box dg-box--accent" x="80" y="264" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="288" text-anchor="middle" dominant-baseline="central">結合兩者生成</text>
<text class="dg-sub" x="220" y="308" text-anchor="middle" dominant-baseline="central">問題與檢索段落</text>
<rect class="dg-box" x="80" y="368" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="400" text-anchor="middle" dominant-baseline="central">答案</text>
</svg>
```

### 深入要點

邊際化是機率模型上的機制，不是把多份文件直接貼進同一段 prompt 的同義詞。索引更換實驗也只證明外部記憶能影響答案，不能推出每次更新都完整覆蓋參數中的舊知識。

### Reviewer 一句話評

最適合拿來學元件如何一起訓練與消融，而非當成所有 RAG 產品的效能宣傳。

### 給你的 take-away

準備會更新答案的兩版文件索引，同時測命中、答案正確與引用支持；記錄更新失敗發生在哪一層。

## 讀物｜Khattab 與 Zaharia：延後互動，保存 token 細節

[週三延伸閱讀](https://arxiv.org/abs/2004.12832)

### TL;DR

ColBERT 分開編碼 query 與文件，保留 token 向量，再用 MaxSim 做細粒度打分；它在完整互動與單向量檢索之間調整品質、延遲與索引空間。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | SIGIR 2020 檢索實驗：MS MARCO 與 TREC CAR，分別報告 reranking 與全庫搜尋。 |
| 應保留的界線 | 排名指標不是答案正確率；延遲綁定論文硬體、候選數與實作，token 索引有額外儲存成本。 |
| 閱讀價值 | 適合需要細粒度檢索並評估索引代價的工程者。 |

### 領域背景

Bi-encoder 的單向量便於先算好文件，卻壓縮掉細節；cross-encoder 讓每對 query 與文件完整互動，成本高。Late interaction 嘗試保留細節又重用文件編碼。

### 中階導讀

**延伸閱讀：ColBERT 把細粒度比對留到最後**

[ColBERT](https://arxiv.org/abs/2004.12832) 卡在兩種檢索器中間。Bi-encoder 把 query 與 passage 各壓成一個向量，方便離線建索引，卻丟掉細粒度對應。Cross-encoder 把每一組 query–passage 一起送進 BERT，保留完整互動，但每個候選都得重跑模型。ColBERT 分開編碼兩邊，卻保留每個 token 的 contextualized vector。打分時，每個 query token 去找文件 token 中最高的相似度，再把這些 MaxSim 分數加總。

文件 token 可以預先計算，所以同一套機制既能 rerank，也能配向量索引做全庫檢索。論文在 MS MARCO 的設定下，rerank 得到 34.9 MRR@10、延遲 61 ms；同表引用的 BERT-base 是 34.7 與 10,700 ms。

端到端搜尋 880 萬段落時，ColBERT 得到 36.0 MRR@10、96.8 Recall@1000 與 458 ms。這些是 2020 年論文在特定資料、硬體與實作下的結果，不是今天部署時的延遲保證。一篇文件要存多個 token vector，索引空間也明顯變重。

它跟 RAG 的接點不是「換上去答案一定更準」，因為論文量的是 passage ranking，不是生成答案。真正的練習是把 retriever 當成可替換零件。在同一組 query 上比較 BM25、single-vector dense retrieval 與 ColBERT，先量 Recall@k 或 MRR。再把相同數量的段落餵給 generator，確認檢索排名改善有沒有一路傳到最終答案。

### 深入要點

MaxSim 讓每個 query token 在文件中找最相近 token，再加總。這個不對稱打分機制值得和向量庫的近似搜尋分開理解：模型打分與快速找候選是兩項工程工作。

### Reviewer 一句話評

它示範如何用表示法與計算位置改變檢索取捨，沒有宣稱免費取得 cross-encoder 品質。

### 給你的 take-away

同一批問題比較 BM25、dense 與 ColBERT，先量檢索再量生成，另記索引體積與查詢耗時。

## 怎麼做：把上週的 RAG 拿來改

**怎麼做**：拿 Week 1 手刻的兩段式 RAG，用本週五 pattern 挑一個改寫。最順手的是 evaluator-optimizer：加第二通 LLM 呼叫，檢查第一通的輸出有沒有貼著檢索段落。這正是 compound AI 原文舉的例子。量三件事：準確有沒有漲、延遲貴多少、什麼例子修好、什麼例子修壞。結論寫成一句選型理由：這個任務值得多付一通呼叫嗎？這就是 Anthropic 要你每次加複雜度之前回答的問題。

## 它在課程裡的位置

Week 2 是 HW1 的備料週：作業下週一才發，但週三的 RAG 材料就是檢索底座——HW1 要你不靠任何 agent 框架，只用 chat-completion 呼叫加自己的程式碼，先做出能在企業 email 封存裡檢索、推理的管線。Week 3 的 tool use（[MCP](https://modelcontextprotocol.io/) 在那週進場）把工具接進來，Week 4 的 ReAct 與 memory 把迴圈和記憶的形狀定下來，管線就一步步長成完整的 agent harness。讀 Anthropic 那篇時記住它的煞車皮：每加一個 pattern，先證明簡單版不夠。

## 本週 Course Material 對照

- 官方課堂投影片（PDF）：[LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)、[RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- 週一 9/28 LLMs for Builders：主讀物 Anthropic Building Effective Agents、延伸閱讀 [Rajasekaran 等人 Effective Context Engineering for AI Agents（Anthropic, 2025）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，本文均已導讀。
- 週三 9/30 RAG：主讀物 Lewis 等人 RAG、延伸閱讀 [Khattab 等人 ColBERT](https://arxiv.org/abs/2004.12832)，本文均已導讀。
- 課表原文：[CS329Z 官網 Week 2](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。

- 2026-10-23：補入workflow／agent 對照表與 RAG 架構圖，只將既有解說視覺化，未重新查核事實。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-09-12：補上 Effective Context Engineering 與 ColBERT 兩篇延伸閱讀的實質導讀。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 課堂投影片：[LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)、[RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- 站內：[Stanford CS329Z 導讀 Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[Stanford CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents)、[Anthropic, Effective Context Engineering for AI Agents (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)、[Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401)、[Khattab & Zaharia, ColBERT, SIGIR 2020](https://arxiv.org/abs/2004.12832)
- 工具：[litellm 文件](https://docs.litellm.ai/)、[MCP 規範](https://modelcontextprotocol.io/)
