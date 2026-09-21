---
title: "AI Engineer 面試日練 — 2026-09-22：Deep Learning & NLP"
date: 2026-09-22
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二輪到 Deep Learning & NLP——self-attention 的 QKV 機制、positional encoding 為什麼必要、子詞切法 tokenization、fine-tuning 跟 RAG 怎麼二選一、embeddings 的語意相似度,加一題 Google agentic AI 面試題:attention 機制跟 context compression 怎麼影響 retrieval 準確度。"
tldr: "今天的 Deep Learning & NLP 輪練涵蓋五個核心概念:self-attention 怎麼用 Query/Key/Value 算相關性、positional encoding 為什麼是 self-attention 的必要補丁、子詞切法(BPE/WordPiece)怎麼解決 OOV 問題、fine-tuning 跟 RAG 這組面試常見二選一該怎麼答、embeddings 怎麼用向量距離表示語意相似度。練習題來自 Google agentic AI engineer 職缺的面試指南:解釋 attention 機制的運作原理,以及 context compression 技術如何影響 retrieval 準確度,拆解思路把 attention 的計算複雜度跟壓縮/準確度的 trade-off 串成一套完整回答。"
series:
  name: "AI Engineer 面試日練"
  order: 34
---

> 🌏 [English version](/en/posts/daily/2026-09-22-ai-interview-daily-en)

## 今日主題

星期二輪到 Deep Learning & NLP,這是 LLM 時代幾乎所有 AI Engineer 職缺都會考的底層知識——不管你面的是傳統 ML 職位還是 agentic AI 職位,面試官都預期你能把 transformer 內部在做什麼講清楚,而不是只會呼叫 API。今天選的練習題直接把 attention 機制跟現在很紅的 context compression、retrieval 準確度接在一起,這正是 onsite technical deep dive 常見的延伸問法:先考基礎機制,再看你能不能把它跟生產環境的取捨連起來。

## 核心概念速記

### Self-attention 怎麼算相關性,不是背公式而是講直覺

Self-attention 讓序列裡每個 token 都能直接看到所有其他 token,不用像 RNN 那樣一步步傳遞資訊。做法是把每個 token 的向量分別投影成 Query、Key、Value 三組矩陣:Query 代表「我在找什麼」,Key 代表「我能提供什麼」,兩者做內積算出相關性分數,再拿這個分數去加權平均所有 token 的 Value。面試時與其背矩陣公式,不如講成「每個 token 都在問其他 token『你跟我有多相關』,再依相關程度混合資訊」,這個講法更接近面試官想聽的理解深度。

### Positional encoding 是 self-attention 天生沒有順序感的補丁

Self-attention 本身是 permutation-invariant 的——把輸入序列打亂,attention 分數的計算方式不會變,模型完全不知道「誰在誰前面」。這就是為什麼 transformer 一定要額外加 positional encoding,把位置資訊編碼成向量加進 token embedding 裡。原始論文用固定的 sine/cosine 函數,後來的模型(如 RoPE)改用旋轉矩陣把相對位置直接編碼進 attention 計算本身,面試官常追問「為什麼不讓模型自己學位置」,答案是絕對位置編碼在序列長度超出訓練範圍時會泛化得不好,這也是長 context 模型偏好相對位置編碼的原因。

### Tokenization 用子詞切法解決 OOV 問題

英文或中文都不是直接餵給模型的,要先切成 token。字元級切法序列太長、單詞級切法遇到沒看過的字就變成 unknown token(OOV 問題),子詞切法(BPE、WordPiece)是介於兩者之間的折衷:高頻詞保留完整,罕見詞拆成常見的子詞片段,既控制了字彙表大小,又幾乎不會遇到真正的 OOV。面試官會考「同一個 tokenizer 訓練出來的字彙表,換一個語言模型還能用嗎」,答案是理論上可以但效率會變差,因為子詞切法是針對訓練語料的統計特性優化的。

### Fine-tuning 跟 RAG,先問「知識會不會變」再決定

這是面試常見的二選一追問。Fine-tuning 是把知識直接調進模型權重,適合需要改變模型「行為模式」的場景(語氣、格式、特定任務的推理風格),缺點是知識更新要重新訓練,而且容易 overfit 到訓練資料的分布。RAG 是把知識放在外部檢索系統,推論時動態抓相關文件塞進 context,適合知識會頻繁更新、或需要可追溯來源的場景,缺點是準確度依賴檢索品質,而且會拉長 context、增加延遲。面試時比較好的答法是兩者不互斥,很多生產系統會同時用:fine-tuning 調整輸出格式跟推理習慣,RAG 負責提供最新、可驗證的事實。

### Embeddings 是把語意壓進一個向量空間

Embeddings 把詞、句子或文件轉成一個固定維度的向量,語意相近的內容在向量空間裡的距離也相近,通常用 cosine similarity 衡量。這是 word2vec、BERT embedding 到現在的 sentence embedding 模型一路沿用的核心假設,也是 RAG 檢索、推薦系統、語意搜尋背後共用的機制。面試官常見的追問是「embedding 維度怎麼選」,答案沒有標準值,是準確度(維度越高語意保留越多)跟儲存/計算成本之間的取捨,實務上會用 downstream 任務的評估指標去挑,而不是憑經驗設一個數字。

## 今日練習題

### 題目

解釋 transformer 架構裡 attention 機制的運作原理,以及 context compression 技術如何影響 retrieval 準確度。

**來源**：Google agentic AI engineer 面試指南（整理自 Dataford）　**難度**：進階　**環節**：onsite technical deep dive

### 拆解思路

1. **先釐清問題**：這題範圍很廣,先問面試官是想聽 self-attention 本身的機制,還是想聽你延伸到 RAG pipeline 裡的檢索流程,兩層深度差很多,先確認範圍再往下講。
2. **建立框架**：從 QKV 三個矩陣講起 attention 的基本運作,再往上接到 multi-head attention,最後接到「為什麼 context compression 這個技術會存在」。
3. **深入核心**：attention 的計算量隨序列長度平方成長,這是 context compression 存在的根本原因;把長 context 壓縮成更少的 token(摘要、KV cache eviction、sliding window)一定會犧牲一些資訊,壓掉的資訊剛好是檢索需要的細節,retrieval 準確度就會掉。
4. **收尾**：講清楚 trade-off 而不是只挑一邊——壓縮比越高,推論速度跟成本越好,但準確度風險越高,生產環境要靠固定的評估集去抓一個可接受的甜蜜點,不能憑感覺調參數。

### 範例回答（面試時可以這樣講）

> **先講 attention 的機制**：self-attention 讓序列裡每個 token 都能直接看到所有其他 token,用 Query、Key、Value 三個矩陣算出每一對 token 的相關性分數,再依這個分數把 Value 加權平均起來,這樣長距離依賴不用像 RNN 那樣一步步傳遞,一次就能捕捉到。Multi-head attention 是讓模型同時用好幾組不同的 QKV 去看不同的語意角度,有的 head 專注語法關係、有的專注指代消解。
>
> **再談 context compression 對 retrieval 的影響**：attention 的計算量隨序列長度平方成長,這也是為什麼實務上會做 context compression——像是用 summarization 把檢索回來的文件先壓縮、或用 KV cache eviction 丟掉不常被 attend 到的 token。這裡的 trade-off 很直接:壓縮比越高,推論速度跟成本越好,但如果壓縮演算法把關鍵細節(數字、人名、時間點)當成不重要的 token 丟掉,retrieval 準確度就會明顯下降。
>
> **收尾**：我會說在生產環境裡,我會用固定的 QA benchmark 去測不同壓縮比下的 retrieval accuracy,抓一個成本跟準確度都能接受的甜蜜點,而不是憑感覺調壓縮參數。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有解釋 Query/Key/Value 三個矩陣各自的角色 | |
| 有講到 multi-head attention 的用意 | |
| 有提到 attention 計算量隨序列長度平方成長,這是 compression 存在的原因 | |
| 有點名至少一種 context compression 技術（summarization / KV cache eviction / sliding window） | |
| 有提到用固定 benchmark 評估壓縮比對 retrieval accuracy 的影響 | |
| 加分項：提到 positional encoding 在壓縮後被打亂順序的風險 | |

## 延伸閱讀

- [Deep Learning Interview Questions and Answers – Top 40 for 2026](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — self-attention、CNN、RNN 基礎題的完整整理,適合考前快速複習
- [Neural Network Architectures Explained – MLP, CNN, RNN, LSTM, Attention and Transformers](https://www.dataexpertise.in/neural-network-architectures-explained-mlp-cnn-rnn-lstm-transformer/?noamp=mobile) — 從 MLP 一路講到 Transformer 的架構脈絡,把今天分散的概念串成一條線
- [Tokenization and Tokenizers for Machine Learning](https://arize.com/blog-course/tokenization/) — 子詞切法怎麼跟 embeddings 銜接,補今天「Tokenization」那段的細節

## 參考資料

- [Attention Is All You Need — Wikipedia](https://en.wikipedia.org/wiki/Attention_Is_All_You_Need) — 對應「Self-attention 怎麼算相關性」段落
- [Deep Learning Interview Questions and Answers – Top 40 for 2026](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — 對應核心概念與練習題拆解思路
- [Tokenization and Tokenizers for Machine Learning](https://arize.com/blog-course/tokenization/) — 對應「Tokenization 用子詞切法解決 OOV 問題」段落
- [RAG Vs Fine-Tuning for Enhancing LLM Performance](https://www.geeksforgeeks.org/nlp/rag-vs-fine-tuning-for-enhancing-llm-performance/) — 對應「Fine-tuning 跟 RAG」段落
- [Google Agentic AI Engineer Interview Questions & Guide 2026](https://dataford.io/interview-guides/google/agentic-ai-engineer) — 今日練習題原始出處
