---
title: "手刻第一個 RAG：從切 chunk 到讓 agent 決定何時查｜Stanford CS329Z 第 3 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 4
tldr: "Lecture 03 從 project 問題出發，依序拆解 RAG 的動機、chunk 邊界、近似向量搜尋、BM25／dense／hybrid／reranker，以及讓 agent 決定何時查。指定讀物 Lewis 等人的 RAG 論文與 ColBERT 補上原始配方與 late interaction。"
description: "依實體頁碼帶讀 CS329Z Lecture 03 RAG 投影片，再深讀 Lewis 等人的 RAG 論文與 Khattab、Zaharia 的 ColBERT，最後把手刻 RAG 改成可比較的版本。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 3 堂（9/30，Retrieval-Augmented Generation）是第一個完整的複合系統：模型不知道的事，先檢索再生成。投影片從索引（chunking、contextual retrieval、RAPTOR、HNSW）講到檢索器（BM25、DPR、hybrid）、reranking、ColBERT 與 agentic RAG，也在這堂介紹了期末專案。

指定讀物是 Lewis 等人的 [RAG 論文](https://arxiv.org/abs/2005.11401)、Karpukhin 等人的 DPR，以及 Khattab 與 Zaharia 的 [ColBERT](https://arxiv.org/abs/2004.12832)。本文深讀 RAG 與 ColBERT 兩篇，它們合起來就是 [HW1](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents) 第一段 email 檢索管線的施工圖。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

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

## 讀物｜Lewis 等人：讓檢索文件參與生成與訓練

[主讀物](https://arxiv.org/abs/2005.11401)

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

[上一堂](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems)說系統時代來了，這堂直接給配方。RAG 論文的問題意識很準。大模型把知識存在參數裡，下游微調成績好看，但**拿知識出來用的能力**不行。出處交代和知識更新仍有困難。解法是參數記憶加非參數記憶：seq2seq 模型（[BART](https://arxiv.org/abs/1910.13461)）配 Wikipedia 稠密向量索引，用神經檢索器（[DPR](https://arxiv.org/abs/2004.04906)）去查。

兩種做法：RAG-Sequence 對每份檢索文件下的整段答案機率做邊際化；RAG-Token 則在每個輸出 token 對文件做邊際化。 Jeopardy 生成任務最能看出差別：答案常由兩段不相干事實拼成，Token 版可以前半看一份文件、後半換一份。

訓練方式值得單獨記：檢索器和生成器一起練，不需要標好的檢索答案也能學；文件編碼器凍結，只調 query 編碼器和生成器。檢索器是 DPR 雙編碼器：文件和問題各過一個 BERT，相似度用內積，top-K 用 MIPS 近似搜尋。生成器是 BART-large，輸入和檢索段落直接串接餵進去。

實驗以同一套架構涵蓋四種任務。開放域問答拿下當時最佳，而且是生成式答案打贏抽取式前輩。檢索段落裡沒有原文答案也能生對，NQ 這個子集的正確率是 11.8%，抽取式是零分。抽象問答（MS-MARCO）贏 BART 兩個多 BLEU。Jeopardy 出題請人類盲測，RAG 比 BART 更貼事實的比例是42.7% 對 7.1%。FEVER 查核看檢索命中：以文章標題重疊衡量，首筆來自 gold article 的比例是 71%；前十筆包含 gold article 的比例是 90%。

消融實驗回答 HW1 一定會問的問題。檢索器凍結不練，每個任務都掉分。把稠密檢索換成 BM25，只有 FEVER 這種實體密集任務 BM25 反而贏。詞語重疊在專有名詞戰場仍有優勢。檢索文件數訓練用五到十篇，測試時 Sequence 版越多越好，Token 版十篇封頂。

知識更新更直接：換索引檔就行。作者拿新舊兩版 Wikipedia 建索引考世界領袖，年份配對的正確率分別為 70% 與 68%；錯配則降到 12% 與 4%。不用重訓模型——第 1 堂「動態」理由的機制版。相關工作定位一次說清：REALM 和 ORQA 只做抽取式問答，RAG 是第一個把混合記憶做成通用生成配方的。

對課程的意義：RAG 提供具體的複合系統範本。 第 1 堂的三個設計問題（控制邏輯、資源分配、端到端優化）第一次有了可以動手的具體形狀。

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

[延伸閱讀](https://arxiv.org/abs/2004.12832)

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

## 怎麼做：把手刻的 RAG 拿來改

**怎麼做**：拿第 1 堂手刻的兩段式 RAG，從 Anthropic 的五種 workflow pattern（[第 6 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)細讀）挑一個改寫。最順手的是 evaluator-optimizer：加第二通 LLM 呼叫，檢查第一通的輸出有沒有貼著檢索段落。這正是 compound AI 原文舉的例子。量三件事：準確有沒有漲、延遲貴多少、什麼例子修好、什麼例子修壞。結論寫成一句選型理由：這個任務值得多付一通呼叫嗎？這就是 Anthropic 要你每次加複雜度之前回答的問題。

## 它在課程裡的位置

第 3 堂做出第一個能動的管線，[第 4 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)再把檢索以外的工具接進來。HW1 在 10/5 發布，第一段就是在企業 email 封存上做檢索；本文的 RAG 練習可以直接當成 HW1 的起點。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Retrieval-Augmented Generation — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- 指定閱讀：Lewis 等人〈Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks〉（本文深讀）、Karpukhin 等人〈Dense Passage Retrieval〉、Khattab 與 Zaharia〈ColBERT〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 3（9/30 週三）的內容，原屬「第 2 週：先分清 workflow 和 agent，再手刻第一個 RAG」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：補入workflow／agent 對照表與 RAG 架構圖，只將既有解說視覺化，未重新查核事實。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-09-12：補上 Effective Context Engineering 與 ColBERT 兩篇延伸閱讀的實質導讀。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 2 堂：LLMs for Builders](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders)、[第 4 堂：Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課堂投影片：[RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401)、[Khattab & Zaharia, ColBERT, SIGIR 2020](https://arxiv.org/abs/2004.12832)
