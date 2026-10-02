---
title: "清大 NLP RAG 助教課＋HW4：用 LangChain 和手刻兩種方式，做一個回答貓咪冷知識的 RAG"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, rag, langchain, ollama]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 17
tldr: "兩堂 RAG 助教課各做一個版本：第一堂在 Colab 裝 Ollama 跑 llama3.2:1b，用 LangChain 的 Chroma、MMR 和 retrieval chain 串出最小的 RAG；第二堂只在資料準備用 LangChain，其餘自己寫：切塊、存文字與向量資料庫、BM25 加 cosine 的混合檢索、用 RRF 合併排名，再拿 Llama-3.2-1B-Instruct 生成答案。HW4 把第一堂的骨架套到 150 則貓咪冷知識和 150 組 GPT-5 生成的問答上，生成器限定 Llama3.2-1b、embedding 限定 jina-embeddings-v2-base-en，要回報 recall@1、recall@5 與 exact match。程式占 45%，報告占 55%，報告要分析 prompt、資料格式、文件順序與反事實資訊的影響。"
description: "清大資工高宏宇《自然語言處理》Fall 2025 RAG 助教課 1/2 與作業四導讀：Colab 上的 Ollama 安裝流程、LangChain 版 RAG 的每個元件、不用 LangChain 的混合檢索與 RRF、檢索評估、HW4 的資料集、TODO1–5 配分、報告題目與繳交規則，以及教材裡前後不一致、要先弄清楚的地方。不提供解答。"
draft: false
glossary:
  - term: "Ollama"
    definition: "在本機（macOS、Linux、Windows）下載與執行開源 LLM 的工具，用 ollama pull 取得模型、ollama serve 啟動服務，可以接 LangChain 等框架。"
    context: "RAG 助教課 1 與 HW4 在 Colab 裡用 colab-xterm 開終端機來裝 Ollama，跑 llama3.2:1b。"
  - term: "exact match"
    aliases: ["EM"]
    definition: "問答評估指標：模型的答案和標準答案完全相同才算對，通常會先做小寫、去標點等正規化。"
    context: "HW4 的作業說明用 exact matching 評估生成結果；starter notebook 的註解則寫「答案出現在回覆中就算對」，兩者寬鬆程度不同。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en)

> **版本說明**：本文依據清大資工高宏宇《自然語言處理》Fall 2025（114-1）的 [rag_tutorial_1.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_1.pdf)（封面 2024/11/28）、[rag_tutorial_2.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_2.pdf)（封面 2024/12/05）、[RAG_tutorial_1.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/RAG_tutorial_1.ipynb)、[RAG_lab_2](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/RAG_lab_2)，以及 [Assignment4](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment4) 的說明 PDF、`main.ipynb`、`cat-facts.txt`、`questions_answers.txt`。兩份助教課投影片沿用 2024 年版。錄影是 W13 的 [RAG1](https://youtube.com/live/anCghHOjzV0)、[RAG2](https://youtube.com/live/RpLqfqR2OZI) 和 [HW4 說明影片](https://youtu.be/JvThEbeOZbs)，三支都沒有字幕軌，本文沒有逐段核對錄影內容。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：題目、starter code 與資料都公開；拿不到的是繳交用的 NTU COOL、評分腳本與解答。

**系列位置**：上一篇 [LLM API 助教課](/posts/ai/2026-09-30-nthu-nlp-llm-api)｜下一篇 [課程總結與 LLM Reasoning 筆記](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 時間線：作業比助教課先發

[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把 HW4 和說明影片放在 W12 那一列，說明影片的上傳日是 2025-11-20；兩堂 RAG 助教課在 W13（2025-11-24 與 11-26）。老師在 [W11 週四](https://www.youtube.com/live/cRSaBtoTDag)開頭說過，HW4 原本那週就要發，因為 RAG 內容和助教課影片還沒準備好，延後一週。作業說明寫的期限是三週。

所以實際順序是：先聽完 [RAG 講課](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers)，拿到作業，再上助教課學工具。自學時照本文的順序讀就好：助教課 1、助教課 2、HW4。

## 助教課 1：LangChain＋Ollama 的最小 RAG

### 在 Colab 上跑本地模型

投影片介紹兩個工具：[LangChain](https://www.langchain.com/) 是開發 LLM 應用的框架；[Ollama](https://ollama.com/) 在本機執行 LLM，投影片列的好處是容易安裝、支援很多模型、自動用 GPU、能接 LangChain，而且資料不會送到第三方。

環境設定的步驟：

1. Colab 選 Python 3 加 T4 GPU（投影片提醒免費 GPU 時數有限）
2. 到 Hugging Face 申請 [Llama-3.2-1B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) 的使用權，建立 access token 登入。notebook 另外註明：只用 Ollama 的話不需要登入
3. `pip install colab-xterm`、`%load_ext colabxterm`，再用 `%xterm` 在 cell 裡開終端機
4. 在終端機裡執行 `curl -fsSL https://ollama.com/install.sh | sh`、`ollama serve`、`ollama pull llama3.2:1b`。閒置太久連線會被切斷，要重跑 `ollama serve`

### 五個元件

notebook 用的模型是 `llama3.2:1b`（生成）和 `jinaai/jina-embeddings-v2-base-en`（embedding），知識庫只有 6 句關於佛羅里達與 Miami Dade College 的句子。元件依序是：

- **LLM 與 embedding**：`Ollama(model=MODEL)`、`HuggingFaceEmbeddings(...)`，`normalize_embeddings` 設 False。投影片旁註：cosine similarity 計算時本來就會正規化，事先正規化是多餘的
- **Prompt**：`ChatPromptTemplate`，system 是「用給定的 context 回答；不知道就說不知道；最多三句」，human 是 `{input}`
- **Vector store**：投影片比較 Chroma（向量資料庫，支援 metadata 過濾）和 FAISS（Meta 的相似度搜尋函式庫，IVF 或 HNSW 做近似最近鄰搜尋）。notebook 用 Chroma，再 `.as_retriever(search_type="mmr", search_kwargs={"k": 3, "fetch_k": 5})`：先抓 5 篇，用 MMR 挑出 3 篇
- **Chain**：`create_stuff_documents_chain` 把文件塞進 prompt，`create_retrieval_chain` 把檢索接在前面
- **執行**：`chain.invoke({"input": query})`，只要給問題

MMR 在站上有[專文](/posts/ai/2026-03-12-mmr-diversity-reranking)可以補。

## 助教課 2：不靠 LangChain，把檢索器拆開來看

第二堂的目的寫在投影片第 4 頁：除了資料準備，其餘不用 LangChain，看清楚資料庫、檢索器和生成各自在做什麼。

**資料準備**：用 `WebBaseLoader` 依 class name 爬一篇 LinkedIn 上介紹 RAG 的文章，清掉換行、重複標點、網址、HTML 標籤與特殊字元，再用 `TokenTextSplitter` 依 embedding 模型的 tokenizer 切成每塊 100 token、重疊 20 token。投影片說切塊的理由有兩個：top-k 塊加上問題要塞得進長度上限；段落太長會把不相關的內容帶進生成結果。

**建資料庫**：每塊給一個 id，存成 `text_db.json`（文字）和 `vector_db.json`（文字加向量）；BM25 那邊把文字轉小寫、斷詞，用 `rank_bm25` 的 `BM25Okapi` 建索引，存成 pickle。投影片強調，真實情境動輒上百萬塊，存檔和讀檔的效率很重要。

**三種檢索器**：

| 檢索器 | 做法 |
|---|---|
| Dense | 查詢向量和每塊向量算 cosine similarity，依分數排序 |
| Sparse | 用 BM25 對每塊打分，排序 |
| Hybrid | 用 RRF（Reciprocal Rank Fusion）合併兩份排名：每篇的分數是 1/(k + dense 名次) + 1/(k + sparse 名次)，k 預設 60；只出現在一邊的文件，另一邊的名次當作最後一名再加一 |

`personal_retriever()` 把三者包成一個函式，回傳混合排名的前幾名。站上的 [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 一文有更多工程細節。

**生成**：用 transformers 載入 `meta-llama/Llama-3.2-1B-Instruct`（float16），把問題和檢索到的塊填進 prompt（註明參考 LangChain hub 的 `rlm/rag-prompt`），`max_new_tokens=300` 生成。投影片提醒推論時間和 `max_new_tokens` 成正比。notebook 最後也跑一次不給 context 的版本，讓你對照有沒有 RAG 的差別。

**檢索評估**：換成 HW4 會用的 cat-facts 資料，逐題檢查標準答案那一句有沒有出現在前 3 名，算出 Recall@3 和一個叫 precision 的分數。投影片第 29 頁用例子解釋：唯一的正解排第一時，top1、top2、top3 的 recall 都是 1/1，precision 則分別是 1/1、1/2、1/3。

### 讀程式時要注意的兩處

- `personal_retriever()` 的參數有 `topk`，函式裡卻寫死 `topk = 3`，傳別的值不會生效。HW4 要回報 recall@5，自己改寫時要留意
- 評估迴圈裡的 precision 是在第 j 名命中時加 1/(j+1)，再取平均。這其實是 reciprocal rank 的平均（也就是 MRR@3），和一般定義的 precision@k 不同

## HW4：貓咪冷知識的 RAG

### 題目

作業說明 PDF 的設定：

- **任務**：用 RAG 做問答，答案是短答
- **資料庫**：[ngxson/demo_simple_rag_py](https://huggingface.co/ngxson/demo_simple_rag_py) 的 cat-facts，150 則，每則一句。例如「The technical term for a cat's hairball is a "bezoar."」
- **測試題**：150 組問答，說明寫由 GPT-5 生成，和 cat-facts 的順序一一對應。`questions_answers.txt` 每組是一行問題、一行答案，答案像「Two thirds」「Taste mutation」這種短片語
- **限制**：生成器是 Llama-3.2-1B（凍結），不能微調
- 這次**允許修改程式模板**

### TODO 與配分

| 項目 | 內容 | 配分 |
|---|---|---|
| TODO1 | 設定 Ollama 環境：colab-xterm、安裝 Ollama、pull llama3.2:1b、`ollama serve` | 5% |
| TODO2 | 讀入 cat-facts，用 `Document` 建立 Chroma 檢索資料庫 | 10% |
| TODO3 | 寫 system prompt | 10% |
| TODO4 | 建 stuff documents chain 與 retrieval chain 並執行。沒用 jina-embeddings-v2-base-en 加 Llama3.2-1b，這項打五折 | 10% |
| TODO5 | 改進系統，讓 LLM 正確回答 150 題（仍用 Llama3.2-1b） | 10% |
| 報告 | 見下 | 55% |

程式部分要交一個 JSON，每筆含 `Query`、`Ground_Truth`、`Prediction`；報告要附測試紀錄與正確率的截圖；檢索回報 recall@1 與 recall@5，生成回報 exact match。缺任何一項，TODO5 打五折。

報告題目：

- （5%）說明你的 RAG 系統：包含哪些元件、prompt 是什麼、和助教課的程式相比多做了什麼
- （10%）不同 prompt 對表現的影響
- （10%）給檢索器不同的資料格式，表現怎麼變
- （10%）檢索到的文件用不同順序餵給生成器，表現怎麼變
- （10%）在生成器的輸入裡加入反事實資訊，生成表現怎麼變
- （10%）其他能強化報告的內容

後面三題正好對應 [RAG（下）](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced)的雜訊類型與四種能力。反事實那一題，就是講課裡的 counterfactual robustness 換你自己動手量。

### 繳交規則

交一個 zip：程式（.py 或 .ipynb）、預測（.json）、`requirements.txt`、報告（.docx 或 .pdf），檔名格式 `NLP_HW4_學校_學號`。報告要寫執行環境與 Python 版本。用了生成式 AI 要在程式註解和報告裡都註明，引用網路程式要附連結；兩份繳交高度相似，兩人都扣 100 分。繳交走 NTU COOL，校外讀者無法使用。

### 教材裡前後不一致的地方

照著做之前，先知道這幾處對不上：

1. **評估標準**：PDF 寫 exact matching，`main.ipynb` 的註解卻寫「答案出現在回覆中就算對」，後者寬鬆得多。1B 模型很少只輸出「Two thirds」三個字，採用哪一種，分數會差很多。報告裡要寫清楚你用的是哪一種
2. **題數**：說明 PDF 有兩頁和 notebook 的 TODO5 註解寫「ten questions」，配分表寫 150 題，資料檔也是 150 組。以 150 為準
3. **罰則表**：那一頁的檔名範例寫的是 `NLP_HW3_...`，是沿用上一份作業的投影片，實際檔名以 HW4 那頁為準
4. **套件版本**：`main.ipynb` 把 LangChain 釘在 0.2 系列（`langchain>=0.2.0,<0.3.0` 等），助教課 notebook 則沒有釘版。照助教課程式寫、在 HW4 環境跑，可能遇到 import 路徑的差異

## 自學怎麼做

1. 先跑助教課 1 的 notebook，確認 Ollama 在 Colab 起得來，這是 HW4 最容易卡住的一步。
2. 讀助教課 2 的 `helper_functions.py`，它就是 HW4 檢索評估會用到的函式；順手修好 `topk` 寫死的問題。
3. HW4 先不改任何東西，跑出 baseline 的 recall@1、recall@5 和 EM，再一次只動一個變因（prompt、資料格式、文件順序），這剛好就是報告要的分析。

今晚可以做的一件事：下載 `cat-facts.txt` 和 `questions_answers.txt`，不用任何模型，只用 BM25 對 150 題做檢索，算出 recall@1。這個數字就是你的檢索下限，之後換 embedding 或混合檢索，都要贏過它才算有進步。

## 延伸閱讀

- 切塊策略：[Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)
- RAG 怎麼評估：[RAG 評估框架與工具選型](/posts/ai/2026-03-12-rag-evaluation-frameworks)
- 另一門課的 RAG 作業：[CS224U 作業二：OpenQA 與 DSPy](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy)

## 參考資料

- [rag_tutorial_1.pdf（封面 2024/11/28）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_1.pdf) — LangChain、Ollama、Colab 設定、Chroma／FAISS、MMR、retrieval chain
- [rag_tutorial_2.pdf（封面 2024/12/05）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_2.pdf) — 資料準備、切塊、dense／sparse／hybrid 檢索、RRF、生成、檢索評估
- [RAG_tutorial_1.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/RAG_tutorial_1.ipynb) — LangChain 版 RAG
- [RAG_lab_2（RAG_tutorial_2.ipynb、helper_functions.py）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/RAG_lab_2) — 手刻版 RAG 與 cat-facts 檢索評估
- [Assignment4](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment4) — NTHU_NLP_HW4_RAG.pdf、main.ipynb、cat-facts.txt、questions_answers.txt、報告模板
- [NTHU NLP 2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — HW4 在 W12 列，RAG 助教課在 W13 列
- [HW4 說明影片](https://youtu.be/JvThEbeOZbs) — 2025-11-20 上傳
- [W13 週二錄影：RAG1](https://youtube.com/live/anCghHOjzV0)、[W13 週四錄影：RAG2](https://youtube.com/live/RpLqfqR2OZI)
- [W11 週四錄影](https://www.youtube.com/live/cRSaBtoTDag) — 開頭宣布 HW4 延後一週
- [ngxson/demo_simple_rag_py（Hugging Face）](https://huggingface.co/ngxson/demo_simple_rag_py) — cat-facts 原始出處
- [meta-llama/Llama-3.2-1B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) — 需申請使用權
- [Ollama llama3.2](https://ollama.com/library/llama3.2) — HW4 指定的生成模型
