---
title: "清大 NLP RAG（下）：檢索器接上生成器之後——從 ORQA、REALM 到 Self-RAG"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, rag, retrieval, self-rag]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 15
tldr: "W11_RAG.pdf 的後半從「From Retrievers to QA」那一頁開始，把檢索器和讀者（reader）接成完整的問答系統。先看 2019–2020 年用 BERT 當讀者的 ORQA 與 REALM，再看第一篇叫 RAG 的論文和凍結 LLM 的 REPLUG；接著用一張表整理七個近年修法：改寫查詢（Query Rewriting、HyDE）、讓生成器不怕雜訊（RetRobust、RAFT、RAAT）、決定何時檢索（FLARE、Self-RAG）。最後談雜訊的類型、LLM 在 RAG 裡該有的四種能力，以及生成式檢索（GR）與可靠回應生成（RRG）。錄影方面，W11 週四那支講到 RAG 論文為止，後面的頁數本文找不到對應的錄影片段。"
description: "清大資工高宏宇《自然語言處理》Fall 2025 RAG 單元後半導讀：BERT 閱讀理解、ORQA 與 Inverse Cloze Task、REALM、RAG 與 FiD、REPLUG／REPLUG LSR、Query Rewriting、HyDE、RetRobust、RAFT、FLARE、RAAT、Self-RAG、雜訊類型與四種能力、Generative Retrieval 與 RRG，並標明錄影涵蓋到哪裡。"
draft: false
glossary:
  - term: "Inverse Cloze Task"
    aliases: ["ICT", "反向克漏字"]
    definition: "從一段文章隨機抽出一句當查詢，其餘部分當正例文章，再配上其他文章當負例，訓練檢索器把句子對回它原本所在的段落。不需要人工標註。"
    context: "ORQA 用 ICT 當 BERT 的繼續預訓練任務，先把查詢編碼器與文章編碼器練到會檢索。"
  - term: "REPLUG LSR"
    aliases: ["LM-Supervised Retrieval"]
    definition: "LLM 保持凍結，只訓練檢索器：讓檢索器給文章的機率分布，去逼近「哪篇文章最能幫 LLM 產生正確答案」的分布。"
    context: "W11 投影片用它說明參數量太大、訓練不動的 LLM 要怎麼放進 RAG。"
  - term: "reflection token"
    aliases: ["反思 token"]
    definition: "Self-RAG 加進詞彙表的特殊 token，例如 [Retrieve]、[IsRel]、[IsSup]、[IsUse]，讓模型在生成過程中自己標出要不要檢索、文件相不相關、回答有沒有被文件支持、回答有沒有用。"
    context: "投影片說這些 token 的設定可以在推論時調整，在精確度與流暢度之間取捨。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en)

> **版本說明**：本文依據清大資工高宏宇《自然語言處理》Fall 2025（114-1）的 [W11_RAG.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W11_RAG.pdf) 第 60–125 頁，以及 [W11 週二](https://www.youtube.com/live/chIewpk4-q0)、[W11 週四](https://www.youtube.com/live/cRSaBtoTDag)兩支錄影的中文字幕軌。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影公開，本單元沒有對應作業（實作放在 [RAG 助教課與 HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4)）。

**系列位置**：上一篇 [RAG（上）：幻覺與檢索器](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers)｜下一篇 [LLM API 助教課](/posts/ai/2026-09-30-nthu-nlp-llm-api)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=chIewpk4-q0
title: W11 週二錄影（Fall 2025）
```

```youtube
url: https://www.youtube.com/watch?v=cRSaBtoTDag
title: W11 週四錄影（Fall 2025）
```

原始影片：[W11 週二錄影（Fall 2025）](https://www.youtube.com/watch?v=chIewpk4-q0)、[W11 週四錄影（Fall 2025）](https://www.youtube.com/watch?v=cRSaBtoTDag)、[W12 週二錄影（Fall 2025）](https://www.youtube.com/watch?v=XGWuVpVTwTQ)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 這一篇接在哪裡，錄影對到哪裡

[上一篇](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers)把檢索器講完：從 BM25 到 DPR，重點都是「怎麼找對文章」。投影片第 60 頁「From Retrievers to QA」換了一個問題：找到文章之後，誰來讀、怎麼讀，整條管線一起訓練又會怎樣。那一頁的例子是問「Oppenheimer 哪一年出生」，沒有檢索的 LLM 答 1967（其實是他過世那年），接上維基百科段落後答 1904。投影片也特別註明，生成器又叫 reader，因為問答本質上是閱讀理解。

錄影要先講清楚。這份投影片在 [2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)裡掛在 W10 那一列，W11 那一列沒有掛任何投影片，只有兩支錄影。我讀了 W11 兩支錄影的字幕軌，對照結果如下：

| 錄影 | 長度 | 內容（依字幕） |
|---|---|---|
| [W11 週二](https://www.youtube.com/live/chIewpk4-q0)（2025-11-11） | 1:42:39 | 期末專題換題公告，接著講檢索器：BoW、TF-IDF、BM25、CLS 夠不夠、Siamese、SimCSE、DPR、GTR，最後停在「檢索器與 reader」的分界 |
| [W11 週四](https://www.youtube.com/live/cRSaBtoTDag)（2025-11-13） | 48:53 | 前 19 分鐘是期末專題的 check point 與同儕互評規則，並宣布 HW4 延一週；約 20 分鐘起講 ORQA、ICT、REALM，最後幾分鐘開始講 RAG 論文，說下週再把後面講完 |

也就是說，本文前三節（BERT 閱讀理解到 RAG 論文）有錄影可以對照；從 REPLUG 以後的第 76–125 頁，W11 兩支錄影都沒講到。W12 週二那支（[XGWuVpVTwTQ](https://www.youtube.com/live/XGWuVpVTwTQ)）最有可能接著講，但它沒有字幕軌，我沒辦法確認內容，所以後半只根據投影片寫。

## 讀者是 BERT 的年代：ORQA 與 REALM

投影片把 open-domain QA 分成兩條：讀者是 encoder（BERT），或讀者是 generator（BART 之類）。先看第一條。

**BERT 做閱讀理解**（第 63 頁）：把問題和段落用 `[SEP]` 接起來餵進 BERT，段落每個位置的 hidden state 過一層線性層，輸出 start logits 和 end logits，各取 argmax，就是答案在段落裡的起點和終點。答案一定是段落裡的一段原文。

**ORQA**（[Lee et al., ACL 2019](https://arxiv.org/abs/1906.00300)，第 64–69 頁）把閱讀理解延伸成開放領域問答，用了三個 BERT：

- BERT_Q 編碼查詢，BERT_B 編碼文章區塊（evidence block），兩者做內積找出 top-k 區塊
- BERT_R 是 reader，在找到的區塊裡抽出答案。投影片的例子是問 ZIP code 的 ZIP 代表什麼，答案「Zone Improvement Plan」

關鍵在檢索器怎麼先練起來。ORQA 用 **Inverse Cloze Task**：一般的克漏字是挖掉一個字讓模型猜；ICT 反過來，從一段文章隨機抽一句話當查詢，讓模型從一堆區塊中找回它原本所在的那一段。這是從預訓練 BERT 出發的繼續預訓練，不需要標註。預訓練階段訓練 BERT_Q 和 BERT_B，微調階段訓練 BERT_Q 和 BERT_R。

老師在錄影裡把 ICT 連回今天的 RAG：你要檢索的資料，embedding 模型和 LLM 多半沒看過，裡面還有專有名詞。設計一個像 ICT 這樣的任務，是讓模型先熟悉你的資料長什麼樣。他同時提醒，自己微調 encoder 通常很難調好，調不好時效果可能比直接拿預訓練模型做 mean pooling 還差，所以以一般的資源來說，他們不會自己去微調。

**REALM**（[Guu et al., ICML 2020](https://arxiv.org/abs/2002.08909)，第 70–73 頁）把 ICT 換成 MLM 預訓練：輸入含 `[MASK]` 的句子，檢索器找出最相似的 5 篇文件接在後面，交給 knowledge-augmented encoder 去填空。MLM 的 loss 不只更新語言模型，梯度也會傳回檢索器的 encoder，讓檢索器慢慢學會「哪種文件對填空最有幫助」。

投影片列了三個難處：語料是整個維基百科，索引只能建在 embedding 層；輸入本身含 `[MASK]`；整條管線要端到端訓練。老師在錄影裡的說法是，流程串起來、按下訓練就會跑，但實際上不容易練好。

## 讀者換成生成器：RAG 與 REPLUG

**RAG**（[Lewis et al., NeurIPS 2020](https://arxiv.org/abs/2005.11401)，第 75 頁）是第一篇用「RAG」這個名字的論文。投影片的三個重點：沒有預訓練，只在開放領域問答上微調；檢索器和生成器一起微調；用 MIPS（Maximum Inner-Product Search）加速向量搜尋，FAISS 這類套件都支援。同一頁建議一併讀 [FiD（Fusion-in-Decoder）](https://arxiv.org/abs/2007.01282)。

老師在 W11 週四的最後幾分鐘講到這裡。他的評語是：檢索、再交給生成器的流程，前面那些論文早就有了，RAG 論文做的是換上更好的生成器和更好的檢索器。

**REPLUG**（[Shi et al., NAACL 2024](https://aclanthology.org/2024.naacl-long.463/)，第 76–79 頁）處理的是 LLM 參數太多、訓練不動的情況：

- **推論時**：每篇檢索到的文件各自和輸入接起來送進 LLM，得到各自的輸出機率分布，再把這些分布合併
- **REPLUG LSR**：LLM 凍結，只訓練檢索器。讓檢索器給文件的分布 P_R(d|x)，去逼近「哪篇文件最能幫 LLM 生成好答案」的分布 Q(d|x)

第 79 頁比較 REPLUG 與 REPLUG LSR 時留了一個問題：為什麼用 BPB（bits per byte）評估 REPLUG？投影片沒有給答案，適合讀完原論文再回來想。

## 七個近年修法，分三類

第 80 頁用一張表把後半的地圖畫出來：

| 類型 | 方法 | 出處（依投影片） |
|---|---|---|
| 強化檢索 | Query Rewriting | EMNLP 2023 |
| 強化檢索 | HyDE | ACL 2023 |
| 強化 RAG | RetRobust | ICLR 2024 |
| 強化 RAG | RAFT | COLM 2024 |
| 強化 RAG | Self-RAG | ICLR 2024 |
| 強化 RAG | RAAT | ACL 2024 |
| 持續檢索 | FLARE | EMNLP 2023 |

### 強化檢索：把查詢改得像文件

**Query Rewriting**（[Ma et al.](https://arxiv.org/abs/2305.14283)，第 81–84 頁）的動機是，輸入的文字和真正需要查的知識之間一定有落差。例子是「Nicholas Ray 和 Elia Kazan 有什麼共同的職業？」，直接拿去檢索效果不好；改寫成「Nicholas Ray profession」「Elia Kazan profession」兩個查詢，就能各自找到兩人的簡介。

**HyDE**（[Gao et al.](https://arxiv.org/abs/2212.10496)，第 85–86 頁）更進一步：讓 LLM（投影片寫 InstructGPT）先寫一篇「假的」答案文章，再用非監督對比學習訓練的 encoder 拿這篇假文章去找真文件。投影片在旁邊寫了一句「適合各種任務與 Query 嗎?」，下一頁引用 [Wang et al. 2024 的最佳實踐研究](https://arxiv.org/abs/2407.01219)，說在檢索任務上 HyDE 可以比 Query Rewriting 好。站上的 [HyDE 實作篇](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)有工程角度的細節。

### 強化生成器：讓它不被雜訊帶偏

**RetRobust**（[Yoran et al.](https://arxiv.org/abs/2310.01558)，第 87–91 頁）先指出問題：檢索增強可以提升表現，但在 StrategyQA 和 Fermi 上反而變差，隨機塞入的文章更會讓表現大跌。投影片花一頁解釋 [StrategyQA](https://arxiv.org/abs/2101.02235)：每題都需要幾個沒寫出來的推理步驟，例如「鱷魚能跑馬拉松嗎」要先知道馬拉松約 42 公里、鱷魚是半水生動物。RetRobust 的做法是檢索器固定，用混了相關與不相關文件的問答資料訓練生成器。

**RAFT**（[Zhang et al.](https://arxiv.org/abs/2403.10131)，第 92–93 頁）同樣固定檢索器、訓練 LLM，訓練時也放入正確和錯誤的文件。投影片點出它和 RetRobust 的差別：RAFT 的答案帶著推理過程（CoT answer）。

**RAAT**（[Fang et al.](https://arxiv.org/abs/2405.20978)，第 102–105 頁）把雜訊分成三種：相關但沒有答案的雜訊、不相關的雜訊、反事實的雜訊。方法是對抗式訓練，挑對模型最傷的雜訊來微調，再加一個偵測雜訊類型的輔助任務。投影片在這裡留了兩個問題：「這些標註怎麼來？」和「物理意義上學到了什麼？」

### 決定何時檢索：FLARE 與 Self-RAG

**FLARE**（[Jiang et al.](https://arxiv.org/abs/2305.06983)，第 94–101 頁，投影片標題寫「Active Retrieval Augmented Generation」）從一個觀察開始：傳統 RAG 在生成前就依查詢把文件找好，多餘的資訊會干擾模型。以「生成一篇 Joe Biden 的摘要」為例，檢索結果裡混著他前妻的生日，還有一段演講引言。FLARE 的主張是，只在模型缺知識時才檢索，而且查詢要反映接下來要寫的內容。判斷缺不缺知識的方法是：語言模型通常校準得不錯，下一個 token 的機率低於門檻 θ 就觸發檢索。投影片的例子是模型寫到「Joe Biden attended」時信心不足，就去查「Joe Biden University」，查完再寫出「the University of Pennsylvania」。

**Self-RAG**（[Asai et al.](https://arxiv.org/abs/2310.11511)，第 106–110 頁）讓模型自己批判、自己反思。訓練時先用 GPT-4 產生 reflection token 的標註，蒸餾成一個 critic model，再用 critic model 產生生成器的訓練資料。推論時模型會輸出 `[Retrieve]`、`[IsRel]`、`[IsSup]`（回答有沒有被文件支持）、`[IsUse]`（回答有沒有用），每一步保留 top-B 個候選片段。投影片強調，這些 token 的設定可以在推論時調整，用來取捨精確與流暢，或取捨正確率與檢索頻率。站上的 [Self-RAG 實作篇](/posts/ai/2026-09-03-self-rag-reflection-tokens)可以對照著讀。

## 現代 RAG 的挑戰：雜訊與四種能力

第 111–116 頁收斂成兩個挑戰：網路內容有大量雜訊甚至假新聞；我們還不夠理解每個模型能從檢索中得到多少好處。雜訊類型列了四種：語意相近但不含答案、反事實資訊、不相關資訊，以及「黑箱消化」（模型怎麼吸收文件看不到）。

接著用四個例子說明 LLM 在 RAG 裡該有的能力：

| 能力 | 投影片的例子 |
|---|---|
| 抗雜訊（Noise Robustness） | 問 2022 年諾貝爾文學獎，文件裡同時有 2022 與 2021 得主，要答 Annie Ernaux |
| 拒答（Negative Rejection） | 文件只有 2021、2020 得主，應回答「資訊不足，無法回答」 |
| 整合資訊（Information Integration） | 問 ChatGPT iOS app 與 API 各在何時推出，答案分散在兩篇文件 |
| 反事實抗性（Counterfactual Robustness） | 文件錯寫 2004 年奧運在紐約，模型被提醒可能有錯時，應指出錯誤並答雅典 |

## 最後一站：生成式檢索與 RRG

第 117–125 頁介紹 Generative Information Retrieval，引用 [2025 年的 GenIR 綜述](https://arxiv.org/abs/2404.14851)與 [生成式檢索能否擴展到百萬篇文章的 EMNLP 2023 論文](https://aclanthology.org/2023.emnlp-main.83.pdf)。幾頁圖由 NotebookLM 生成，重點是兩個新流程：

- **Generative Document Retrieval（GR）**：不再算向量相似度，而是訓練 LLM 直接學會「查詢 → DocID」的對應。投影片問：GR 和傳統檢索差在哪裡？
- **Reliable Response Generation（RRG）**：投影片把做法分成「強化內在知識」和「擴增外在知識」兩類

標題寫的是「We need solution, not just documents」：使用者要的是答案，而不只是文件。最後一頁是 RRG 的評估，只有圖，沒有文字說明。

## 自學怎麼讀

1. 先讀投影片第 60–75 頁，配 [W11 週四錄影](https://www.youtube.com/live/cRSaBtoTDag)約 20 分鐘之後的部分。ORQA → REALM → RAG 這條線是「誰被訓練」的演進，看懂了，後面的修法都能歸位。
2. 第 80 頁那張表當目錄。每讀一個方法，問自己：它動的是檢索器、生成器，還是兩者之間的介面？
3. 投影片留下的問題（BPB、HyDE 的適用範圍、RAAT 的標註來源、GR 和傳統檢索的差別）沒有官方解答，適合當讀書會題目。

今晚可以做的一件事：找一個你手邊的 RAG 或 ChatGPT 對話，照第 113–116 頁的四種能力各出一題，例如故意只給過時的文件，看它會不會拒答。四題答完，你會比讀完七篇論文更清楚自己的系統卡在哪裡。

## 延伸閱讀

- 另一門課怎麼講同一件事：[CS224N 第 10 講：RAG 與 Language Agents 的六個元件](/posts/ai/2026-08-22-cs224n-rag-language-agents)
- 檢索評估與 neural IR：[CS224U 資訊檢索](/posts/ai/2026-09-29-cs224u-information-retrieval)
- 工程實作全景：[RAG 系統模式完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [W11_RAG.pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W11_RAG.pdf) — 第 60–125 頁：BERT 閱讀理解、ORQA／ICT、REALM、RAG、REPLUG、第 80 頁方法總表、七種修法、雜訊與四種能力、GenIR
- [NTHU NLP 2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — W10 列掛 W11_RAG.pdf，W11 列只有兩支錄影
- [W11 週二錄影（Fall 2025）](https://www.youtube.com/live/chIewpk4-q0) — 檢索器部分，停在 retriever／reader 分界
- [W11 週四錄影（Fall 2025）](https://www.youtube.com/live/cRSaBtoTDag) — 期末專題與 HW4 延期公告，ORQA、ICT、REALM、RAG 論文開頭
- [W12 週二錄影（Fall 2025）](https://www.youtube.com/live/XGWuVpVTwTQ) — 無字幕軌，本文未確認內容
- [Lee et al. 2019, ORQA](https://arxiv.org/abs/1906.00300)
- [Guu et al. 2020, REALM](https://arxiv.org/abs/2002.08909)
- [Lewis et al. 2020, RAG](https://arxiv.org/abs/2005.11401)
- [Izacard & Grave, FiD](https://arxiv.org/abs/2007.01282)
- [Shi et al. 2024, REPLUG](https://aclanthology.org/2024.naacl-long.463/)
- [Ma et al. 2023, Query Rewriting](https://arxiv.org/abs/2305.14283)
- [Gao et al. 2023, HyDE](https://arxiv.org/abs/2212.10496)
- [Wang et al. 2024, Searching for Best Practices in RAG](https://arxiv.org/abs/2407.01219)
- [Yoran et al. 2024, RetRobust](https://arxiv.org/abs/2310.01558)
- [Geva et al. 2021, StrategyQA](https://arxiv.org/abs/2101.02235)
- [Zhang et al. 2024, RAFT](https://arxiv.org/abs/2403.10131)
- [Jiang et al. 2023, FLARE](https://arxiv.org/abs/2305.06983)
- [Fang et al. 2024, RAAT](https://arxiv.org/abs/2405.20978)
- [Asai et al. 2024, Self-RAG](https://arxiv.org/abs/2310.11511)
- [From Matching to Generation: A Survey on Generative Information Retrieval](https://arxiv.org/abs/2404.14851)
- [How Does Generative Retrieval Scale to Millions of Passages?](https://aclanthology.org/2023.emnlp-main.83.pdf)
