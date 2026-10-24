---
title: "給 AI 讀的知識庫差在哪：動手前先寫測試題"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, evaluation, test-set, retrieval]
lang: zh-TW
tldr: "人看得懂的 wiki，AI 還是可能答錯：它看到的是被切出來的幾段文字，看不到導覽、標題層級和前後文。所以動手建 RAG 之前，先寫一份測試題：每題附上答案和出處段落，並刻意放幾題文件答不了的。Azure 的 RAG 指南把這一步跟內容分析平行做；一項研究發現，只用 AI 生成的題目評估，會高估檢索表現 29 到 37 個百分點，所以要混入真實使用者的問題。知識庫小於約 500 頁時，也可以先不做 RAG，整份放進提示裡。"
description: "知識庫怎麼建 order 11：AI 讀文件跟人有什麼不同、RAG 的七個失敗點、AI 段九個步驟的流程總圖、測試題的三個欄位與四種題型、合成題和真實題差在哪、LLM 當評審的限制，以及一頁 wiki 被切塊後模型實際看到的樣子。"
series:
  name: "知識庫怎麼建"
  order: 11
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en)

團隊把 wiki 接上 AI 助理。有人問：「超過三天的假要誰核准？」〈請假與休假政策〉寫得清清楚楚：部門主管。AI 卻回答「直屬主管核准即可」。這頁文件沒有寫錯，人看了也不會答錯，問題出在 AI 讀到的不是這一頁，而是這一頁被切開後的其中一段。

這篇是「知識庫怎麼建」AI 段的第一篇，讀者從同事換成 AI。[order 0](/posts/learning/2026-10-22-knowledge-base-three-readers) 說過，每段的第一篇只假設你讀過總覽；讀過團隊段（order 6 到 10）會更好，因為前面寫好、有人維護、找得到的文件，正是這一段最好的原料。這篇談 AI 讀文件跟人有什麼不同，以及動手之前要先做的一件事：寫測試題。每一步怎麼做，留給 order 12 到 19。讀完你能在動手前寫出 20 題附出處與答案的測試題。

## AI 看到的跟人不一樣

多數接上公司文件的 AI 助理用的是檢索增強生成（RAG）：先把文件切成小段、建好索引；有人提問時，找出最相關的幾段，跟問題一起交給模型回答（概念見 [Fine-tuning vs RAG](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag)）。所以模型看到的不是整份 wiki，是被挑出來的幾段文字。

人讀 wiki 時用得上的東西，這幾段文字裡多半沒有：頁面標題、上一層的分類、左邊的導覽、前一段在講什麼。Anthropic 2024 年舉過一個例子：一段寫著「公司營收比上一季成長 3%」的文字，單獨拿出來，看不出是哪家公司、哪一季（[Anthropic 2024](https://www.anthropic.com/news/contextual-retrieval)）。

Barnett 等人 2024 年整理三個實際 RAG 專案的經驗，列出七個失敗點，前三個都發生在答案交到模型手上之前（[Barnett et al. 2024](https://arxiv.org/abs/2401.05856)）：

1. **內容根本沒有**：問的事情文件裡沒寫，系統卻可能被騙著編一個答案。
2. **有，但沒排到前面**：答案在文件裡，但排名沒進前幾名，沒被交給模型。
3. **找到了，但沒放進去**：取回的段落太多，整併成提示時被刷掉。

後四個是模型沒從段落裡抽出答案、格式錯、回答得太籠統或太細、答得不完整。作者的兩個結論很直接：RAG 系統只有在實際運作時才驗證得了；它的穩定度是一路調出來的，不是一開始就設計好的。站內也整理過更完整的[失敗模式清單](/posts/ai/2026-03-12-rag-failure-modes)，以及一次[檢索靜默失敗的排查紀錄](/posts/ai/2026-09-19-retriever-silent-failure)。

另外一提：知識庫很小時，可以先不做 RAG。Anthropic 同一篇寫道，知識庫小於 20 萬個 token（約 500 頁）時，可以把整份放進提示裡，不需要檢索。20 萬 token 正好是當時 Claude 一次能讀的長度，換模型就要重算。

## AI 段的九個步驟

下面是這一段要走的流程。測試題放在第一步，因為最後一步要用它來驗收：

```diagram
title: 建一個給 AI 讀的知識庫：九個步驟
desc: 從寫測試題開始，依序盤點來源、解析清洗、處理安全、加結構與 metadata、切塊索引、設權限、訂更新規則，最後用同一份測試題評估上線。
caption: 虛線：最後一步用第一步寫的測試題驗收。數字是本系列的 order。
---
<svg viewBox="0 0 420 704">
  <path class="dg-line" d="M160 76V92" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 152V168" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 228V244" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 304V320" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 380V396" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 456V472" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 532V548" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 608V624" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M300 48H372Q380 48 380 56V648Q380 656 372 656H304" marker-end="url(#arrow)"/>

  <g>
    <rect class="dg-box dg-box--accent" x="20" y="20" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="39" text-anchor="middle" dominant-baseline="central">11 先寫測試題</text>
    <text class="dg-sub" x="160" y="59" text-anchor="middle" dominant-baseline="central">問題、出處段落、答案</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="96" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="115" text-anchor="middle" dominant-baseline="central">12 盤點來源</text>
    <text class="dg-sub" x="160" y="135" text-anchor="middle" dominant-baseline="central">收哪些、信哪個版本</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="172" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="191" text-anchor="middle" dominant-baseline="central">13 解析與清洗</text>
    <text class="dg-sub" x="160" y="211" text-anchor="middle" dominant-baseline="central">PDF、表格、掃描檔</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="248" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="267" text-anchor="middle" dominant-baseline="central">14 安全</text>
    <text class="dg-sub" x="160" y="287" text-anchor="middle" dominant-baseline="central">個資、藏在文件裡的指令</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="324" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="343" text-anchor="middle" dominant-baseline="central">15 結構與 metadata</text>
    <text class="dg-sub" x="160" y="363" text-anchor="middle" dominant-baseline="central">標題、日期、負責人</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="400" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="419" text-anchor="middle" dominant-baseline="central">16 切塊與索引</text>
    <text class="dg-sub" x="160" y="439" text-anchor="middle" dominant-baseline="central">切多大、怎麼搜</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="476" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="495" text-anchor="middle" dominant-baseline="central">17 權限</text>
    <text class="dg-sub" x="160" y="515" text-anchor="middle" dominant-baseline="central">誰能查到哪份文件</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="552" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="571" text-anchor="middle" dominant-baseline="central">18 更新與刪除</text>
    <text class="dg-sub" x="160" y="591" text-anchor="middle" dominant-baseline="central">怎麼不過時</text>
  </g>
  <g>
    <rect class="dg-box dg-box--accent" x="20" y="628" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="647" text-anchor="middle" dominant-baseline="central">19 評估與上線</text>
    <text class="dg-sub" x="160" y="667" text-anchor="middle" dominant-baseline="central">用測試題驗收</text>
  </g>
</svg>
```

## 為什麼先寫測試題

Microsoft 的 Azure 架構中心有一套 RAG 設計指南，第一個階段是準備：收集文件、分析內容、收集測試題，三件事平行做，因為彼此有關係（[Azure: RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)）。內容分析告訴你該收哪些測試題；測試題告訴你哪些內容一定要收進來。

先寫測試題有三個好處：

- **知道要收什麼。** 寫不出答案出處的題目，要嘛是文件還沒收進來，這是 order 12 盤點來源的起點；要嘛是本來就沒有文件，那就歸到「知識庫沒有」的題型。
- **之後每一步都能量。** Azure 的指南說，同時有題目和回答它的段落，就能在嘗試各種做法時，評估 RAG 的每一個階段。
- **分得出壞在哪。** 微軟的 Kulkarni 和 Savelieva 指出，題庫附上出處段落，才能把錯誤拆成三種：正確的段落沒被找回來、找回來了但資訊不夠、資訊都在但模型沒答好（[Kulkarni & Savelieva 2024](https://medium.com/data-science-at-microsoft/the-path-to-a-golden-dataset-or-how-to-evaluate-your-rag-045e23d1f13f)）。

## 一題測試題長什麼樣子

Azure 的格式是三個欄位：

- **問題**：真實使用者可能會問的話。
- **出處**：文件裡回答這個問題的原文段落，附上頁碼或位置。
- **答案**：正確的回答，可以直接引原文，也可以整合幾段改寫。

常被簡化成「問題加答案」，但出處段落是必要的欄位：沒有它，就只能看最後答案對不對，看不出是檢索的問題還是模型的問題。

**要刻意放文件答不了的題。** Azure 指南特別提醒，要收集文件沒有回答的問題，因為你得決定系統遇到這種題目時該怎麼回應：說不知道，或者說不知道並給一個可能找得到答案的地方。Peng 等人 2024 年把這類題目分成六類；我會先放其中三類：缺了關鍵資訊、需要追問的；前提就錯的；知識庫裡根本沒有的（[Peng et al. 2024](https://arxiv.org/abs/2412.12300)）。他們也發現，只追求可回答題的正確率，會把系統拒答的能力調壞：在 TriviaQA 上，可回答題正確率並列最高的一個設定，遇到不可回答題時只有 49% 回得恰當，在 27 種組合裡接近墊底。

所以一份測試題至少要有四種題型：

| 題型 | 例子 | 期待的回答 |
|---|---|---|
| 可回答 | 超過三天的假要誰核准？ | 部門主管（出處：〈請假與休假政策〉第 3 節） |
| 要追問 | 我可以請幾天假？ | 先問是哪一種假、年資多久 |
| 前提錯 | 為什麼年假不能跨年使用？ | 指出政策其實允許遞延，附出處 |
| 知識庫沒有 | 約聘人員請五天假要誰核准？ | 說明正職規定不適用，請對方看〈約聘人員請假規定〉或問人資；不能套用正職的答案 |

## 合成題可以用，但要混入真實問題

自己寫題目很慢。Kulkarni 和 Savelieva 記錄的一個專案裡，客戶的領域專家花了八到十天才寫出 10 題。所以常見的做法是讓 LLM 從文件生成題目：Azure 的指南建議每段先生成兩題，再由領域專家審過。

**合成題一定要有人審。** Kulkarni 和 Savelieva 讓 LLM 從一份財報逐字稿生成 100 題，一位財務專家逐題審，有 27 題不合格，常見的問題是答案正確但不完整。

**只用合成題，會高估系統。** Kucia 和 Gawlik 2026 年在一所學院比較了 AI 生成的題目和學生真實提出的問題（[Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)）。合成題平均比真實題長一倍多，涵蓋的文件也廣得多；真實題則集中在少數幾頁，例如課表和學年行事曆。同樣的檢索系統，換成真實題（能對應到頁面的那些）後，前五名命中率掉了 29 到 37 個百分點。更麻煩的是，只看合成題，會選到混合檢索這個架構；但在真實題上它沒有比較準，卻比同一個資料庫的純向量檢索慢 1.7 倍。

還有一件事：真實題裡將近一半，對應不到任何一頁固定的文件，因為它們要個人資料、要即時資料，或問得太模糊。合成題是從文件生出來的，定義上一定答得出來，這種題目它永遠生不出來。

作者建議在上線前，向目標使用者收 50 到 100 題真實問題，跟合成題比一比，再決定架構。真實問題的來源，Azure 的指南也點了幾個：客服單、常見問題、工單系統。order 10 的搜尋紀錄也是。

## LLM 當評審，要看它在評什麼

題目多了，自然會想讓 LLM 來判斷答案對不對。這在比較整體系統時可以，逐題判斷時要小心。Thakur 等人 2025 年讓 GPT-4o 和人工評審判斷同一件事：答案有沒有被引用的段落支持（[Thakur et al. 2025](https://arxiv.org/abs/2504.15205)）。拿來排系統，兩者相當一致。逐筆對，就差多了：各自從零標，只有 56% 完全一致，而且 GPT-4o 比人寬鬆。另一批題目改成人先看 GPT-4o 的標籤再修改，一致率升到 72%；作者觀察到，除非錯得明顯，人多半會同意它。

NVIDIA 分享建三個內部聊天機器人的經驗時也提醒，LLM 當評審會強化它自己的偏差，自動化工具應該補人工審查，不是取代（[Akkiraju et al. 2024](https://arxiv.org/abs/2407.07858)）。

所以我的做法是：比較兩個版本哪個好，可以先讓 LLM 跑；要判斷「這一題到底答對沒」，至少抽一部分給人看。

## 例子：一頁 wiki 被切開後，模型看到什麼

原本的頁面：

> **請假與休假政策**（人資，最後確認 2026-09-01）
>
> **1. 適用範圍**：全體正職員工。約聘人員另見〈約聘人員請假規定〉。
>
> **2. 假別**：年假、病假、事假、婚假、喪假。年假依年資計算，未休完可遞延至隔年 6 月底。
>
> **3. 申請與核准**：請假須在系統送出申請。三天以內由直屬主管核准；超過三天由部門主管核准。
>
> **4. 舊制說明**：2025 年以前，所有假別一律由直屬主管核准。

假設切塊工具照固定長度切，模型可能拿到其中三段：

> 段 A：「……年假依年資計算，未休完可遞延至隔年 6 月底。3. 申請與核准：請假須在系統送出申請。三天以內由直屬主管核准；」
>
> 段 B：「超過三天由部門主管核准。4. 舊制說明：2025 年以前，所有假別一律由直屬主管核准。」
>
> 段 C：「1. 適用範圍：全體正職員工。約聘人員另見〈約聘人員請假規定〉。2. 假別：年假、病假、事假……」

問「超過三天的假要誰核准」時，段 B 的前半句是答案，後半句卻是舊制；如果檢索剛好只拿到段 A，或模型把舊制當成現行規定，就會答出開頭那個錯誤的「直屬主管」。三段都沒有頁面標題，看不出這是哪一份政策、適用誰、什麼時候確認過。這些問題分別是 order 15（結構與 metadata）、order 16（切塊）、order 18（舊內容怎麼處理）要處理的。

這一題寫進測試題時，出處要標「〈請假與休假政策〉第 3 節」；答錯時，看檢索拿到的是哪幾段，就知道該修哪一步。

## 研究的限制

Barnett 的七個失敗點來自三個專案的經驗，Akkiraju 是 NVIDIA 的經驗分享，都不是對照實驗。Azure 的指南和 Kulkarni 的部落格是實務建議，題數也是經驗值：Kulkarni 說常見起點約 100 題，Kucia 建議 50 到 100 題真實問題；這篇的 20 題是第一輪手寫的起步，比這些都小。Kucia 是單一學院、單一語言的研究；Peng 的實驗用的是維基百科問答資料，不是企業文件；Thakur 只評「答案有沒有被引用支持」這一個面向。Anthropic 那句是廠商自己的說法，門檻也會隨模型改變。

## 今晚可以做的事

1. **列出 20 個同事最常問的問題。** 從群組、客服單或 order 10 的搜尋紀錄找，不要自己想像。
2. **每題找出答案和出處段落。** 找不到出處的先標起來：有文件但沒收的，交給 order 12；根本沒有文件的，改成第 3 步的題型。
3. **再補 5 題文件答不了的**（出處欄留空，改寫期待的回應）。 要追問的、前提錯的、知識庫沒有的，各至少一題，並寫下你希望系統怎麼回。
4. **把這份表存成試算表。** 欄位是：問題、出處、答案、題型、來源（真實或合成）。之後每一篇都會用到它。

## 自我檢查

**問：** 同一個問題，人在 wiki 上找得到答案，AI 卻答錯了。可能壞在哪三個地方？

**判準：** 第一，內容根本沒收進知識庫，例如那頁在另一個系統、沒被匯入（Barnett 的第一個失敗點）。第二，切塊讓段落失去上下文，例如答案和舊制被切在同一段、頁面標題沒跟著段落走。第三，正確的段落有被找到，但沒排進前幾名，所以沒交給模型（第二個失敗點）。測試題附了出處段落，就能逐一檢查：出處那段在不在索引裡、被切成什麼樣子、這次檢索排在第幾名。

## 參考資料

- [Anthropic 2024, Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (CAIN 2024)](https://arxiv.org/abs/2401.05856)
- [Microsoft Azure Architecture Center, RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)
- [Microsoft Azure Architecture Center, Design and develop a RAG solution](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)
- [Kulkarni & Savelieva 2024, The path to a golden dataset, or how to evaluate your RAG? (Data Science at Microsoft)](https://medium.com/data-science-at-microsoft/the-path-to-a-golden-dataset-or-how-to-evaluate-your-rag-045e23d1f13f)
- [Peng, Choubey, Xiong & Wu 2024, Unanswerability Evaluation for Retrieval Augmented Generation (arXiv)](https://arxiv.org/abs/2412.12300)
- [Kucia & Gawlik 2026, Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation (CIKM 2026, arXiv)](https://arxiv.org/abs/2609.14579)
- [Thakur et al. 2025, Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges (arXiv)](https://arxiv.org/abs/2504.15205)
- [Akkiraju et al. 2024, FACTS About Building Retrieval Augmented Generation-based Chatbots (NVIDIA, arXiv)](https://arxiv.org/abs/2407.07858)
- 站內：[Fine-tuning vs RAG：什麼時候該教模型、什麼時候該幫模型查資料](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag)
- 站內：[RAG 常見失敗模式：10 種問題和對應的解法](/posts/ai/2026-03-12-rag-failure-modes)
- 站內：[10% 的對話在編答案：Retriever 靜默失敗的排查紀錄](/posts/ai/2026-09-19-retriever-silent-failure)
