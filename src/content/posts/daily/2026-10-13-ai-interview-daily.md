---
title: "AI Engineer 面試日練 — 2026-10-13：Deep Learning & NLP"
date: 2026-10-13
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二輪到 Deep Learning & NLP——self-attention 為什麼用內積算相似度、causal mask 跟 padding mask 差在哪、subword tokenization（BPE/WordPiece）怎麼解決 OOV，加一題面試常考的場景題：GPT 用的是 Transformer 的哪個部分、為什麼只用 decoder 就能做生成。"
tldr: "今天的 Deep Learning & NLP 輪練涵蓋四個核心概念：self-attention 用 Query/Key 內積算相似度再乘 Value 做加權，複雜度隨序列長度成平方成長；causal mask 跟 padding mask 是兩種完全不同用途的遮罩，一個管「能不能看未來」一個管「要不要理會填充值」；subword tokenization（BPE/WordPiece）靠拆成已知子詞單元解決 OOV，但 token 數會隨語言的 fertility 而不同；RNN 跟 Transformer 的根本差異是序列狀態用「固定大小隱狀態」還是「可隨時回看任一位置」來處理長距依賴。練習題是面試常考的場景題：GPT 只用了 Transformer 的 decoder、靠 causal attention 做自回歸生成，拆解思路把「為什麼只用一半的架構」到「KV cache 怎麼讓推論變快」串成一套完整推理鏈。"
series:
  name: "AI Engineer 面試日練"
  order: 55
---

> 🌏 [English version](/posts/daily/2026-10-13-ai-interview-daily-en)

## 今日主題

星期二輪到 Deep Learning & NLP，今天選的四個概念圍繞「Transformer 為什麼長這樣，而不是長成別的樣子」。Self-attention、mask、tokenization、RNN vs Transformer 這些名詞每個候選人都聽過，但面試官真正要測的是你能不能講出每個設計選擇背後要解決的具體問題——為什麼要用內積、為什麼要遮未來、為什麼要拆子詞。今天的練習題也刻意選一個會把「架構選擇」跟「推論效能」串起來的場景題。

## 核心概念速記

### Self-Attention：Query/Key 內積算相似度，複雜度隨長度平方成長

Self-attention 的核心做法是把每個 token 投影成三個向量：Query（我在找什麼）、Key（我是什麼）、Value（如果被選中要貢獻什麼內容）。相似度是用 Query 跟所有 Key 做內積算出來的，內積越大代表兩個 token 的方向越一致、越「相關」，再除以 √d_k 做縮放避免內積值隨維度變大而爆掉，過 softmax 轉成權重分布，最後用這組權重對所有 Value 做加權平均。這個機制讓每個 token 可以直接看到序列中任何位置的資訊，不用像 RNN 一路傳遞，但代價是算相似度要算完整的 n×n 矩陣，複雜度隨序列長度平方成長——這就是為什麼長文本場景會另外發展 sparse attention、linear attention 等變體。

### Causal Mask vs Padding Mask：管「看不看未來」vs 管「理不理填充值」

這兩種 mask 常被面試官放在一起問，但解決的是完全不同的問題。Causal mask（也叫 look-ahead mask）用在自回歸生成場景，強制每個位置的 attention 只能看到自己跟之前的 token，看不到未來——做法是把未來位置對應的 attention score 設成負無窮，softmax 之後權重變成零，這樣訓練跟推論的行為才會一致（訓練時雖然看得到完整序列，但必須假裝看不到未來，否則模型會學會「作弊」）。Padding mask 解決的是另一個問題：一個 batch 裡的句子長度不一樣，要補零對齊成相同長度才能平行運算，但這些補零的位置不該被當成真實內容參與 attention 計算，所以也要把對應的 attention score 設成負無窮排除掉。兩者可以同時套用在同一個模型上，一個管時間方向、一個管有效內容範圍。

### Subword Tokenization：BPE/WordPiece 怎麼解決 OOV，但 token 數因語言而不同

早期 NLP 用 word-level tokenization，一旦遇到字典外的詞（OOV）就只能用一個 `<UNK>` token 代替，等於直接丟掉資訊。Subword tokenization（BPE、WordPiece 這類方法）的做法是先統計訓練語料裡最常出現的字元組合，反覆合併成更大的子詞單元，最後得到一個固定大小、但涵蓋常見詞根詞綴的詞表——沒見過的詞就拆成已知的子詞片段拼起來，理論上不會再出現完全未知的 token。這個機制的副作用是「tokenizer fertility」：同一句話，英文可能拆成較少的 token，另一種語言結構差異大的語言（例如形態變化豐富的語言）可能被拆成更多子詞片段，直接影響 context window 的有效使用量跟 API 計價成本——面試被問到多語言場景時，這點常是加分的細節。

### RNN vs Transformer：固定大小隱狀態 vs 可隨時回看任一位置

RNN 處理序列的方式是維護一個固定大小的隱狀態，每個時間步讀入新的輸入、更新隱狀態，資訊要跨越多少個時間步，就要在這個固定大小的向量裡「擠」過多少次更新——這是為什麼 RNN 對長距依賴天生吃力，梯度在反向傳播時會隨距離指數級消失或爆炸（LSTM/GRU 的 gate 機制緩解了這個問題，但沒有根本解決）。Transformer 用 self-attention 取代了這個遞迴結構，任何兩個位置之間的資訊傳遞都是一步到位（直接算內積），不需要像 RNN 一樣逐步傳遞，長距依賴的學習難度不會隨距離增加而變難。代價則是前面提過的 O(n²) 計算複雜度，以及自回歸推論時需要靠 KV cache 把已經算過的 Key/Value 存起來，否則每生成一個新 token 都要重新算一次完整的 attention。

## 今日練習題

### 題目

GPT 系列模型只用了 Transformer 架構裡的 decoder，為什麼只用一半的架構就能做生成任務？這跟 encoder-decoder 架構（例如翻譯模型）的差異在哪？

**來源**：Cloud Soft Solutions「Deep Learning Interview Questions and Answers 2026」與 DataExpertise「Deep Learning Interview Questions and Answers – Top 40 for 2026」整理的高頻面試題，標注為 LLM 相關職缺常見的架構理解題　**難度**：中等　**環節**：technical screen / onsite system design

### 拆解思路

1. **先釐清問題**：面試時該先問——面試官想聽的是架構層面的差異（decoder-only vs encoder-decoder），還是想延伸問到推論效能（KV cache、latency）？這題通常兩者都會追問，可以先從架構講起再往效能延伸。
2. **建立框架**：先把原始 Transformer 的兩個部分的分工講清楚——encoder 負責把輸入序列編碼成帶有雙向上下文的表示（每個 token 可以看到整句話的前後文），decoder 負責自回歸生成輸出，靠 causal attention 保證每一步只看得到已經生成的部分，再透過 cross-attention 去讀 encoder 的輸出。
3. **深入核心**：技術上最關鍵的 trade-off 是——GPT 類模型的任務目標本身就是「給定前文，預測下一個 token」，這跟 decoder 的 causal attention 機制完全對齊，所以不需要額外的 encoder 來產生雙向上下文；反過來說，翻譯這種「輸入輸出是兩個不同序列、且輸入端需要雙向理解」的任務，才需要用 encoder 先完整讀懂輸入，再用 decoder 配合 cross-attention 逐步生成輸出。
4. **收尾**：往推論效能延伸——decoder-only 架構在自回歸生成時可以用 KV cache 把每一步算過的 Key/Value 存起來，之後每生成一個新 token 只需要算這個新 token 對所有已存 Key/Value 的 attention，不用重算整個序列，這是 GPT 類模型能做到互動式對話延遲可接受的關鍵工程細節。

### 範例回答（面試時可以這樣講）

> GPT 只用 decoder，不是因為 encoder 不重要，是因為它的訓練目標跟 decoder 的機制天生就是同一件事。**先講架構分工**：原始 Transformer 的 encoder 負責把輸入序列編碼成雙向上下文表示——每個位置都看得到整句話的前後文；decoder 則是自回歸生成，靠 causal mask 保證每一步只能看到已經生成的 token，再用 cross-attention 讀 encoder 的輸出，拼出翻譯這種「輸入輸出是兩個不同序列」的任務。GPT 的訓練目標是「given 前文，預測下一個 token」，這個目標本身就要求每個位置只能看到前面——這跟 decoder 的 causal attention 完全對齊，所以不需要另外一個 encoder 來產生雙向上下文。
>
> **接著講跟 encoder-decoder 架構的差異**：翻譯模型需要先完整讀懂輸入語言（雙向上下文），再逐步生成輸出語言，輸入跟輸出是兩個不同的序列，所以需要 encoder 跟 decoder 分工、再靠 cross-attention 把兩邊接起來。GPT 的輸入跟輸出其實是同一條序列的延續，沒有「先讀懂一段再生成另一段」的結構性需求，decoder-only 加上 causal attention 就足夠。
>
> **最後講這個選擇對推論效能的影響**：decoder-only 架構可以搭配 KV cache——把每一步算過的 Key、Value 向量存起來，下一個 token 只需要跟這些已存的 Key/Value 做一次 attention，不用把整句話重新算一遍，這是讓 GPT 類模型可以用在互動式對話、延遲可接受的關鍵工程細節，也是面試官問到「為什麼這個架構選擇重要」時最容易被忽略、但其實最實務的一點。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚 encoder 的雙向上下文 vs decoder 的 causal attention | |
| 有點出 GPT 的訓練目標（預測下一個 token）跟 decoder 機制天生對齊 | |
| 有提到 cross-attention 在 encoder-decoder 架構裡的作用 | |
| 有延伸講到 KV cache 對推論延遲的影響 | |
| 有舉出 encoder-decoder 架構真正需要的場景（例如翻譯） | |
| 加分項：有點出這是工程效能考量，不只是理論架構選擇 | |

## 延伸閱讀

- [Deep Learning Interview Questions and Answers 2026 (65 Qs) | Cloud Soft Solutions](https://cloudsoftsol.com/blog/deep-learning-interview-questions) — 把 attention 的計算成本跟 RNN 的固定狀態拿來對比，講清楚為什麼長序列場景會考慮換架構。
- [NLP Interview Questions and Answers 2026 (60 Questions) | Cloud Soft Solutions](https://cloudsoftsol.com/blog/nlp-interview-questions) — 從 tokenization、embedding 到多語言 NLP 場景的 60 道題，適合把今天「tokenizer fertility」的講法再練熟。
- [Deep Learning Interview Questions and Answers – Top 40 for 2026 | DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — 針對 GPT decoder-only 架構的 causal attention 機制有額外的圖解說明。

## 參考資料

- [Deep Learning Interview Questions and Answers 2026 (65 Qs) | Cloud Soft Solutions](https://cloudsoftsol.com/blog/deep-learning-interview-questions) — 核心概念「Self-Attention」與「RNN vs Transformer」段落的佐證來源，含 attention 計算成本與 RNN 固定狀態的對比說明。
- [Deep Learning Interview Questions and Answers – Top 40 for 2026 | DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — 今日練習題「GPT 為什麼只用 decoder」的主要佐證來源，含 causal attention 與自回歸生成的機制說明。
- [NLP Interview Questions and Answers 2026 (60 Questions) | Cloud Soft Solutions](https://cloudsoftsol.com/blog/nlp-interview-questions) — 核心概念「Subword Tokenization」段落的來源，含 BPE/WordPiece 機制與 tokenizer fertility 在多語言場景的影響說明。
- [NLP Interview Questions (Beginner to Advanced) | DataCamp](https://www.datacamp.com/blog/nlp-interview-questions) — 核心概念「Causal Mask vs Padding Mask」段落的佐證來源，確認這兩種 mask 在面試中常被放在一起考的出題慣例。
