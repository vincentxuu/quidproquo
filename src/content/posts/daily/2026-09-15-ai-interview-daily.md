---
title: "AI Engineer 面試日練 — 2026-09-15：Deep Learning & NLP"
date: 2026-09-15
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "今天練 Transformer 面試最常被追問的五個概念——self-attention 的 Q/K/V 機制、位置編碼為什麼需要、BERT 與 GPT 的架構差異、靜態與情境化詞向量的差別、fine-tuning 策略怎麼選——搭配一題「把 2K token 的模型擴充到 100K token」的長文件擴展設計題。"
tldr: "今天的 Deep Learning & NLP 輪練涵蓋 self-attention 的 Q/K/V 運算與 O(n²) 複雜度來源、positional encoding(sinusoidal 到 RoPE/ALiBi)為什麼是 Transformer 必要的一環、BERT(encoder,雙向)與 GPT(decoder,因果)的架構與訓練目標差異、Word2Vec/GloVe 等靜態詞向量與 BERT/GPT 情境化詞向量的本質不同,以及 full fine-tuning、freeze 上層、LoRA 這幾種微調策略該怎麼挑。練習題是把一個只支援 2K token 的 Transformer 擴充到能處理 100K token 長文件,面試官想看你能不能把「複雜度」「位置外推」「生產環境成本」三條線同時講清楚。"
series:
  name: "AI Engineer 面試日練"
  order: 27
---

> 🌏 [English version](/en/posts/daily/2026-09-15-ai-interview-daily-en)

## 今日主題

星期二輪到 Deep Learning & NLP,這個主題在 2026 年的面試中幾乎等同於「Transformer 面試」——不管職缺名稱是 ML Engineer、NLP Engineer 還是 AI Engineer,面試官都會預期你能把 self-attention、位置編碼、BERT/GPT 架構差異講到能在白板上畫出來,而不是只會背「Attention Is All You Need」這篇論文的標題。今天練的內容對應面試中段最常見的深挖環節:先問你「解釋一下 attention」,確認你懂了之後,再往「那如果序列長度變成 10 萬 token 呢」這種需要你連結複雜度分析與生產環境權衡的追問去逼近。

## 核心概念速記

### Self-attention:Q、K、V 怎麼運作

每個 token 會產生三個向量:Query、Key、Value,都是靠可學習的線性投影算出來的。Token i 對 token j 的注意力分數是 `softmax(Qᵢ · Kⱼ / √d_k)`,除以 `√d_k` 是為了避免高維度下點積數值過大導致 softmax 梯度消失。Token i 的輸出是所有 value 向量的加權和。Multi-head attention 平行跑 h 組不同投影的 attention,再把結果串接、投影回去,讓模型能同時捕捉不同「表示子空間」裡的關係。面試時最容易被追問的是複雜度:`Q×Kᵀ` 產生一個 n×n 的注意力矩陣,序列長度 n 每翻一倍,記憶體與運算量就變四倍。

### 位置編碼:為什麼 Transformer 需要它

跟 RNN 不同,Transformer 平行處理所有 token,本身沒有序列順序的概念——「狗咬人」跟「人咬狗」如果不加位置資訊,attention 的計算結果會一樣。原始 Transformer 用正弦函式位置編碼:`PE(pos, 2i) = sin(pos/10000^(2i/d_model))`,加到 token embedding 上;也有可學習的絕對位置嵌入。這兩種的共同問題是無法外推到訓練時沒看過的序列長度。現代 LLM 改用 RoPE(旋轉位置編碼)或 ALiBi 這類相對位置編碼,泛化到更長序列的能力好很多,這也是 GPT-4、Llama 能處理長 context 的關鍵之一。

### BERT 與 GPT:架構與訓練目標的差異

兩者都是 Transformer,但用的是不同的一半。BERT 用 encoder,雙向 attention,每個 token 能看到左右兩邊所有 token,訓練目標是 masked language modelling(隨機遮住 15% 的 token,80% 換成 [MASK]、10% 換成隨機 token、10% 保持不變,逼模型學到雙向表示)加上 next sentence prediction。適合理解型任務:分類、NER、QA。GPT 用 decoder,因果(從左到右)attention,每個 token 只能看到前面的 token,訓練目標是自回歸的下一個 token 預測。適合生成型任務。2026 年主流的通用助理都是 GPT 架構加上 RLHF/DPO 指令微調。

### 靜態詞向量與情境化詞向量的差別

Word2Vec、GloVe、FastText 給每個詞一個固定向量,不管上下文是什麼——「bank」在「河岸」跟「銀行」兩種語境下向量完全一樣,這對多義詞是硬傷。ELMo(用雙向 LSTM)是第一個做出情境化表示的模型,BERT、GPT 這類用 self-attention 產生的向量,同一個「bank」在不同句子裡的 768 維向量會明顯不同,真正捕捉到它在當下語境的意思。面試時如果被問「為什麼現在都不用 Word2Vec 了」,答案的核心就是靜態向量沒辦法處理多義詞跟語境依賴。

### Fine-tuning 策略怎麼選

Full fine-tuning 更新全部參數,效果通常最好但成本最高、資料需求也最大,學習率要壓得很低(BERT 通常 2e-5 到 5e-5)避免破壞預訓練學到的知識。Linear probing 凍結預訓練層、只訓練新加的分類頭,資料少的時候比較不容易 overfitting,但天花板較低。LoRA 這類參數高效微調方法,不直接更新權重矩陣 W,而是加一個低秩分解 `ΔW = AB`,只訓練 A、B 兩個小矩陣,可把可訓練參數量壓低 10 到 1000 倍,是目前微調 LLM 的主流做法。三種策略的取捨核心是:資料量、算力預算、跟預訓練任務的差異程度。

## 今日練習題

### 題目

你手上有一個支援 2K token context window 的 Transformer 模型,現在產品需求要處理最長 100K token 的長文件。你會怎麼設計這個擴充?

**來源**：綜合改編自 goodspace.ai《LLM Interview Questions》位置編碼外推段落與 DataExpertise《Deep Learning Interview Questions 2026》Q18 attention 複雜度段落　**難度**：進階　**環節**：onsite / system design 混合題

### 拆解思路

1. **先釐清問題**：先問清楚這 100K token 是要「訓練時就支援」還是「推論時零訓練外推」;文件內容的存取模式是一次讀完整篇做摘要,還是需要在文件內做精準檢索(這決定要不要考慮 RAG 分流,而不是硬堆長度);延遲跟成本預算多少,因為 attention 從 2K 擴到 100K,`n²` 的記憶體跟運算量是 2500 倍。
2. **建立框架**：把問題拆成三層——第一層是位置編碼要不要換掉(如果原模型用絕對位置嵌入,天生就沒辦法外推到訓練長度以外,必須換成 RoPE 或 ALiBi 這類相對位置編碼,或做位置內插/NTK-aware 縮放);第二層是 attention 本身的複雜度(標準 self-attention 在 100K token 下記憶體會爆,要上 Flash Attention 減少 HBM 讀寫,或改用 sliding window / 稀疏 attention 只算局部加少數全域 token);第三層是要不要用工程手段繞開,而不是硬撐長 context,例如用 RAG 先檢索出最相關的段落再餵給模型,而不是整篇塞進 context。
3. **深入核心**：面試官最想聽到的是你能不能講清楚「換位置編碼」跟「換 attention 實作」是兩件獨立的事,常見誤區是以為裝了 Flash Attention 就能自動支援更長序列——Flash Attention 只解決記憶體牆,沒解決模型「有沒有見過這麼長的位置」這個外推問題;反過來只換 RoPE 不動 attention 實作,推論時記憶體還是會爆。兩者要一起處理,而且通常還需要在目標長度上做一段 continued pretraining 或 long-context fine-tuning,不能只靠架構改動就指望模型自然理解百倍長度的依賴關係。
4. **收尾**：提出怎麼驗證這個擴充有沒有真的有效,不能只看能不能跑——用「needle in a haystack」這類長文件檢索測試,確認模型在 100K token 中間插入的關鍵資訊真的能被抓到,而不是只有頭尾附近的內容有效;同時報告延遲與成本的變化,讓產品端知道長 context 不是免費的。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我會先確認這 100K token 是訓練時就要支援,還是希望零訓練直接外推,以及使用情境是整篇摘要還是精準檢索——如果是後者,我會先問「有沒有考慮用 RAG 分流,只把最相關的段落塞進 context,而不是把整份文件都丟進去」,因為很多時候真正需要的不是更長的 context,而是更好的檢索。
>
> **架構層面**：假設確定要硬擴 context,我會先看原模型用的是哪種位置編碼——如果是絕對位置嵌入,天生就有訓練長度上限,必須換成 RoPE 或 ALiBi 這類支援外推的相對位置編碼,或做 position interpolation 讓模型在沒見過的長度上不至於完全崩潰。接著處理 attention 本身的 O(n²) 問題,上 Flash Attention 減少記憶體讀寫瓶頸,如果 100K 還是太貴,會考慮 sliding window 加少數 global token 的稀疏 attention,犧牲一點點理論上的全域關聯換取可行的推論成本。
>
> **驗證與收尾**：光是架構改動不夠,我會在目標長度上做一段 continued pretraining 或至少 long-context fine-tuning,再用 needle-in-a-haystack 這類測試驗證模型真的能在 10 萬 token 中間找到關鍵資訊,不是只有頭尾附近表現正常。最後會把延遲跟成本的變化量化出來,讓產品端決定這個投資值不值得,而不是預設「context 越長越好」。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清是要訓練支援還是零訓練外推,以及是否該考慮 RAG 分流 | |
| 正確解釋 attention O(n²) 的來源(Q×Kᵀ 產生 n×n 矩陣) | |
| 提到位置編碼外推問題(絕對位置嵌入的上限 vs RoPE/ALiBi) | |
| 區分「換位置編碼」跟「換 attention 實作」是兩件獨立的事 | |
| 提到驗證方法(如 needle-in-a-haystack)而不是只看能不能跑起來 | |
| 加分項：量化延遲與成本變化,幫產品端做決策 | |

## 延伸閱讀

- [LLM Interview Questions and Answers for Freshers & Experienced (2026) — goodspace.ai](https://goodspace.ai/interview-questions/llm) — 位置編碼外推、KV cache、長 context 相關的追問整理得很完整,適合補強今天練習題沒展開的細節。
- [AI Fundamentals: Attention Mechanisms in Transformers (Part 1) — Towards AI](https://pub.towardsai.net/ai-fundamentals-attention-mechanisms-in-transformers-part-1-a91cce62fbab) — 把 Q/K/V 的直覺講得很白話,「每個 token 都在問其他人跟我有多相關」這個比喻適合拿來練口頭表述。
- [ai-engineering-interview-questions — amitshekhariitbhu (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 題庫形式整理的 AI Engineering 面試問答,涵蓋位置編碼、Q/K/V 等今天主題的延伸題目。

## 參考資料

- [Deep Learning Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — Self-attention、位置編碼、BERT/GPT 架構差異、attention O(n²) 段落的來源。
- [NLP Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/nlp-interview-questions-answers-2026/) — 靜態與情境化詞向量、fine-tuning 策略段落的來源。
- [LLM Interview Questions and Answers for Freshers & Experienced (2026) — goodspace.ai](https://goodspace.ai/interview-questions/llm) — 今日練習題「長文件擴展」中位置編碼外推部分的參考來源。
