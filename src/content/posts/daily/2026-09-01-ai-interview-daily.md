---
title: "AI Engineer 面試日練 — 2026-09-01：Deep Learning & NLP"
date: 2026-09-01
category: daily
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "今日練深度學習與 NLP：attention 機制的直覺、tokenization 為什麼是有損的設計決策，以及『embedding 是一個向量空間契約』這個常被忽略的核心觀念。"
tldr: "Deep Learning & NLP 面試考的不是你會不會畫 transformer 架構圖，而是你懂不懂每個設計決策背後在犧牲什麼。今天聚焦四個高頻考點：self-attention 的計算與 KV cache 的作用、tokenization 的 vocab size 取捨、『embedding 是向量空間契約、維度相同不代表相容』這個資深候選人才會講的細節，以及 fine-tuning 跟 prompting 該怎麼選、catastrophic forgetting 怎麼防。練習題則是 Scale AI 的『設計 embedding 生成與分類 API』，走一遍版本相容性、部分失敗與多租戶隔離的完整設計。"
series:
  name: "AI Engineer 面試日練"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-09-01-ai-interview-daily-en)

## 今日主題

Deep Learning & NLP 是 AI Engineer 面試裡最容易被考出「背了但沒懂」的一塊——很多人能畫出 transformer 架構圖、能背出 BPE 是 subword tokenization，但一被追問「vocab size 加倍會發生什麼事」或「兩個模型都輸出 1024 維向量，為什麼不能直接互換」，就答不出所以然。

今天不重複畫架構圖，而是練面試官真正想聽的東西：每個設計決策在犧牲什麼、什麼時候會踩到陷阱。這種題型常出現在 phone screen 的技術深挖，以及 ML infra 相關的 onsite 系統設計環節。

## 核心概念速記

### Self-Attention 在算什麼、KV Cache 省了什麼

Self-attention 讓每個 token 都能直接看到序列裡所有其他 token，不用像 RNN 一樣把資訊一步步傳遞過去，這解決了長距離依賴的梯度消失問題，但代價是計算複雜度是 O(n²·d)——序列長度平方成長。面試時要能講出 KV cache 的作用：生成階段每一步只有新 token 的 Q 要重算，之前所有 token 的 K、V 可以快取重用，這把自回歸生成從「每步重算全部」變成「每步只算新增的一格」，是所有 LLM inference 服務省 latency 的基礎機制。

### Tokenization 是有損的設計決策，不是免費午餐

Vocab size 不是越大越好。Vocab 加倍代表 embedding 和 unembedding 參數各多 250k×d_model（沒 tie 權重的話是兩倍），但壓縮率只呈對數成長——2.5 倍的 vocab 不會換來 2.5 倍的 bytes/token。更隱藏的陷阱是稀有 token：vocab 塞太滿會讓長尾 token 幾乎拿不到梯度訊號，變成功能上的雜訊。面試時的加分句是「vocab size 是一個參數預算和 decode latency 的稅，不是免費的壓縮率」，而不是單純講「vocab 越大 tokenizer 效率越好」。

### Embedding 是一個「向量空間契約」

這是資深候選人才會主動講的觀念：一個 embedding 模型定義了一個幾何空間，分類器是畫在這個特定幾何裡的決策邊界。把向量餵給不同模型（或同模型不同版本）訓練出來的分類器，維度照樣對得上、分數照樣看起來合理，但答案已經悄悄失去意義——**維度相同不代表相容**。這也是為什麼 preprocessing（正規化、大小寫、截斷長度）也該被當成版本的一部分：truncation 從 512 改成 1024，整批向量的分布就變了，快取也跟著失效。

### Fine-tuning vs Prompting 的取捨

Fine-tuning 適合需要穩定「品牌語氣」或行為模式、且這個模式要在每一次呼叫都套用的情境——把幾千字的 system prompt 燒進權重裡，省下每次呼叫都要重複付的 token 成本與延遲。但 fine-tuning 的風險是 catastrophic forgetting：模型在小範圍領域資料上微調後，可能失去原本的泛用能力。面試時該提到的緩解手法包含 LoRA（只調低秩子空間、保留原始權重）、rehearsal（訓練資料裡混入原始任務的樣本）、以及用較低的 learning rate 限制權重偏移幅度。

## 今日練習題

### 題目

「設計一個 embedding 生成與分類的 API：文字進去，回傳向量與分類標籤。系統要支援多租戶、要處理部分失敗（一批一千筆裡有幾筆格式錯誤怎麼辦）、要考慮 GPU 是稀缺資源，而且不同租戶的快取結果不能互相讀取。」

**來源**：Scale AI Machine Learning Engineer onsite 面試題　**難度**：進階（面試平台標示「easy」但實際四個部分都有陷阱）　**環節**：onsite system design（ML infra）

### 拆解思路

1. **先釐清問題**：題目會主動要你問「呼叫方能不能自己帶 embedding 進來？」——這個問題比聽起來重要。允許外部帶向量代表你要接受一個無法驗證的宣稱：向量宣稱自己是某個模型版本產出的，但數字本身完全無法證明這件事。除非有簽章機制或受信任的產生方，否則這等於把未經驗證的輸入直接餵給分類器。順著題目給的簡化，把 preprocessing 和 embedding 生成都收進服務內部，並說出「外部帶向量」為什麼更難，而不是直接跳過。

2. **建立框架**：把「vector space is a contract」當成整個設計的組織原則。API 要求呼叫方明確指定 `embedding_model` 和 `classifier` 版本（不能用 `latest`，因為那代表結果會在呼叫方沒改任何東西的情況下悄悄變化），並且把 preprocessing 也當成一個版本化的 artifact——這是多數候選人會漏掉的細節。

3. **深入核心**：最關鍵的 trade-off 藏在三個地方。第一，partial failure 用「HTTP 狀態描述的是整個 request，不是單一 item」來處理：一千筆裡有一筆格式錯，回 200 加上 per-item 的 status，而不是整批打回去逼呼叫方重送已經算完的九百九十九筆。第二，dynamic batching 要用具體數字說明理由，而不是空講「batching 能增加吞吐量」。第三，多租戶快取的 key 一定要包含 `tenant_id`——雖然共享快取命中率更高，但少了 tenant_id，一個租戶可以靠著送出同樣文字、觀察回應速度是否異常快，來推測另一個租戶是否已經 embedding 過同一份文件，這是一個真實的 timing side channel。

4. **收尾**：用一句話收斂全場——「matching dimensions 不代表 compatible，兩個都輸出 1024 維的模型可以把同一句話放在完全不同的位置，所以相容性不能靠 runtime 檢查向量形狀，只能靠一個經過人工驗證、記錄在 registry 裡的 (embedding 版本, classifier 版本) 配對」。這句話點出整個系統為什麼需要 registry、version pinning 和 rollout 流程,而不是隨口帶過。

### 範例回答（面試時可以這樣講）

> 開始設計之前我想先確認一件事：呼叫方能不能自己帶 embedding 向量進來，而不是每次都傳原始文字？這會決定整個信任模型——如果允許外部帶向量，我沒辦法驗證那個向量真的是宣稱的那個模型版本產出的，維度對得上不代表向量空間是同一個。除非有簽章或受信任的來源，不然這等於把一個沒辦法驗證的輸入直接餵給分類器。如果沒有這個限制，我會把 preprocessing 和 embedding 生成都收在服務內部處理。
>
> API 設計上，`embedding_model` 和 `classifier` 都要明確帶版本號，不接受 `latest`——因為那代表呼叫方的結果會在他們沒改任何東西的情況下悄悄漂移。更容易被忽略的是，preprocessing（正規化、大小寫、截斷長度）本身也要當成一個版本化的 artifact 存進 registry，因為截斷長度從 512 改到 1024，整批向量的分布就變了，快取也該跟著失效。partial failure 我會用「HTTP 狀態描述的是 request 本身」來處理：一批一千筆裡有格式錯誤的幾筆，回 200 加上 per-item 的 status 和 error code，而不是整批退回去逼對方重送已經花了 GPU 時間算完的部分。
>
> 效能上，我會做 dynamic batching：累積到 batch size 32 或等待窗口到期（例如 10 毫秒）就跑一次 forward pass，因為 accelerator 的固定成本很高、邊際成本很低，batch 到 32 大概能把單一 worker 的容量拉高八倍以上，但等待窗口不能無限拉長，過了某個門檻等待本身反而會拖累 tail latency。快取的 key 我會包含 `tenant_id`，即使這會犧牲一部分命中率——因為少了它，一個租戶可以靠著送出同樣的文字、觀察回應是不是快得不正常，去推測另一個租戶是不是已經 embedding 過同一份文件，這是題目明確要求要防的 timing side channel。最後，相容性判斷絕對不能只看向量維度，兩個模型都輸出 1024 維不代表它們是同一個向量空間，所以我會用一個記錄「哪些 embedding 版本和 classifier 版本經過人工驗證可以配對」的 registry，在請求時間就擋掉不合法的組合，而不是等模型跑完才發現結果是錯的。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 主動問「呼叫方能不能自己帶 embedding」並說明為什麼這很重要 | |
| 版本明確指定，不接受 `latest`，preprocessing 也當版本化 artifact | |
| Partial failure 用「HTTP 狀態描述 request 而非 item」處理 | |
| Dynamic batching 有具體數字（batch size、等待窗口）支撐論點 | |
| 快取 key 包含 tenant_id，並解釋 timing side channel 風險 | |
| 加分：明確講出「維度相同不代表相容」以及 registry 存人工驗證過的配對 | |

## 延伸閱讀

- [Deep Learning 200 Interview Questions & Answers — Part 2](https://atalupadhyay.wordpress.com/2026/08/25/deep-learning-200-interview-questions-answers-part-2-questions-101-200/) — 補齊 attention 機制與 Vision Transformer 的計算細節，適合搭配今天的 self-attention 概念一起複習
- [LLM System Design Interview #51 — The Tokenizer Swap Trap](https://aiinterviewprep.substack.com/p/llm-system-design-interview-51-the) — 深入拆解 tokenizer 換掉之後 fertility（每個字的 token 數）在不同語言上的失衡問題，補齊今天 tokenization 那段沒展開的細節
- [ai-engineering-interview-questions（GitHub）](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 收錄 catastrophic forgetting、chunking 策略、embedding 選型等一系列 AI engineering 面試題，適合延伸練習

## 參考資料

- [Scale AI Interview Question: Design an Embedding and Classification API](https://medium.com/@emilyhustlenyc/scale-ai-interview-question-design-an-embedding-and-classification-api-5af182d937d4) — 今日練習題的完整來源，含 API 設計、dynamic batching 數字與 registry 設計細節
- [LLM System Design Interview #51 — The Tokenizer Swap Trap](https://aiinterviewprep.substack.com/p/llm-system-design-interview-51-the) — 核心概念速記中 tokenization vocab size 取捨段落的依據
- [Deep Learning 200 Interview Questions & Answers — Part 2](https://atalupadhyay.wordpress.com/2026/08/25/deep-learning-200-interview-questions-answers-part-2-questions-101-200/) — 核心概念速記中 self-attention 與 KV cache 段落的依據
- [ai-engineering-interview-questions（GitHub）](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 核心概念速記中 fine-tuning 與 catastrophic forgetting 段落的依據
