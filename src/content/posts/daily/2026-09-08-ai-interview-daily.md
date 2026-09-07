---
title: "AI Engineer 面試日練 — 2026-09-08：Deep Learning & NLP"
date: 2026-09-08
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "今日練 Transformer/LLM 面試的核心追問：decoder-only 架構怎麼從 embedding 一路講到 next-token 機率、self-attention 的 Q/K/V 直覺、為什麼 decoding 是 memory-bandwidth bound，以及 tokenization 對成本與 context window 的實際影響。"
tldr: "這輪 Deep Learning & NLP 聚焦 2026 年面試官最愛追問的『從架構講到工程後果』：decoder-only transformer 的四層結構（embedding + RoPE、causal self-attention、MLP、線性頭）、self-attention 的 Q/K/V 直覺與為什麼要 causal mask、decoding 為什麼是 memory-bandwidth bound 而不是 compute bound，以及 token 數量怎麼直接換算成 API 成本、context window 容量與生成延遲。練習題是一道 MAANG 等級的『解釋 Transformer 架構』開放題，練的是怎麼在 5 分鐘內講完架構又能延伸到推論成本。"
series:
  name: "AI Engineer 面試日練"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-08-ai-interview-daily-en)

## 今日主題

今天是 Deep Learning & NLP 主題輪，2026 年的版本已經不太問「RNN 跟 CNN 差在哪」這種純架構題,而是把 Transformer 架構題當成一個入口,追問到底層工程後果:為什麼推論延遲跟輸出長度成正比、為什麼同樣的模型在不同硬體上吞吐差很多、tokenization 怎麼變成一筆看得見的帳單。這類題目常出現在 phone screen 的暖身環節,也是 onsite 判斷候選人「懂不懂自己在用什麼」的分水嶺——能不能從矩陣乘法一路講到「為什麼這個 API 呼叫比較貴」。

## 核心概念速記

### Decoder-only Transformer 的四層結構

一個 decoder-only transformer 是一疊相同的 block,疊在 token embedding 序列上運作。輸入先查表變成向量,再加上位置資訊——2026 年主流模型多半用 RoPE(rotary position embedding)取代舊式的可學習絕對位置編碼。序列接著流過 N 個 block(小模型幾十層,前沿模型上百層),每個 block 有兩個子層:causal self-attention(讓每個 token 從自己與更早的 token 蒐集資訊)與 feed-forward MLP(對每個位置獨立做非線性轉換,佔了模型大部分參數量)。兩個子層都包著殘差連接與正規化(多半是 RMSNorm),這正是深層堆疊能訓練起來的關鍵。最後一層線性頭把每個位置的向量投影到詞彙表大小,再用 softmax 得到 next-token 機率分布。

### Self-Attention 的 Q/K/V 直覺與 Causal Mask

Self-attention 讓每個 token 用「內容」而非「固定位置」來決定要跟誰互動。每個 token 的向量會被投影成三份:query(我在找什麼)、key(我提供什麼)、value(如果被選中,我要傳遞什麼資訊)。用 query 跟所有 key 算內積再做 softmax,得到一組權重,再拿這組權重對 value 做加權平均,就是這個 token 的新表示。Decoder-only 模型會加上 causal mask,強制每個 token 只能看到自己與更早的 token,這是自回歸訓練與生成能一致的原因——訓練時每個位置同時被當成「預測下一個 token」的樣本,推論時才不會偷看未來。

### Decoding 是 Memory-Bandwidth Bound,不是 Compute Bound

面試官很愛追問「為什麼輸出越長,回應越慢」。關鍵在於自回歸生成是逐 token 進行的:每產生一個新 token,就要把整個模型的權重(以及 KV cache)重新載入一次做一次前向傳播,而這個動作的瓶頸是把資料從顯示記憶體搬到運算單元的頻寬,不是矩陣乘法本身的運算量。這解釋了三個工程現象:批次推論(batching)能大幅提高吞吐,因為同一次記憶體搬運可以攤提到多個請求上;KV cache 用顯存換取重複計算,但顯存吃緊時反而變成新瓶頸;而 TTFT(time to first token)跟 inter-token latency 是兩個不同的指標,前者受 prompt 長度影響大,後者受 decoding 的記憶體頻寬瓶頸主導。

### Tokenization 對成本與 Context Window 的實際影響

Token 是 LLM 真正讀寫的單位——通常是 subword,透過 BPE(byte-pair encoding)之類的演算法從固定詞彙表映射成整數 ID。模型不直接操作字元或單字,tokenizer 負責把文字轉成 ID、再把 ID 轉回文字。Token 數量在三個地方變成實際成本:計費上,商業 API 依 input/output token 分開計價,冗長的 system prompt 如果每次請求都重複帶入,會變成長期的固定開銷;容量上,「128K context」指的是 128K 個 token 而不是 128K 個字,塞太多檢索內容會悄悄把早期指令擠出視窗;延遲上,輸出 token 是逐一生成的,所以要求模型精簡回答是真的能降低延遲,不只是省字數。

### 微調前該先窮盡 Prompt Engineering 與 RAG

面試官常問「什麼時候該微調,而不是加 RAG」。2026 年比較成熟的答案是排序:先窮盡 prompt engineering 跟 RAG,因為兩者能在幾分鐘內迭代;只有在任務夠穩定、且模型行為(語氣、格式、特定領域慣例)是靠大量範例才能穩定校正時,才輪到微調。微調也能省下長 few-shot prompt 的 token 開銷,量大時本身就能回本。比較有說服力的答案通常是把兩者合併:微調一個小模型專精「用檢索到的內容,以固定格式回答」,再放進 RAG pipeline 裡跑——行為靠微調,知識靠檢索。

## 今日練習題

### 題目

請解釋 Transformer 架構,重點放在 self-attention 機制,並說明它對 NLP 任務(以及後續的大型語言模型)帶來了什麼影響。

**來源**：改編自 MAANG 等級公司常見的 Transformer 架構開放題（多篇 2026 年面試整理文章,如 Consigli《Machine Learning Engineer Interview Questions》,均將此題列為 Hard 難度的必考題）　**難度**：進階　**環節**：onsite technical / system design 暖身題

### 拆解思路

1. **先釐清問題**：先跟面試官確認想聽的深度——是要從頭推導 attention 的數學公式,還是著重架構直覺與工程後果(延遲、成本、為什麼取代 RNN)?這決定你接下來 5 分鐘要往哪個方向深挖。
2. **建立框架**：用「輸入 → 表示層 → 互動層 → 輸出」的順序講:embedding + 位置編碼、self-attention(token 之間互動的唯一場所)、feed-forward MLP(每個位置獨立計算)、殘差與正規化(讓深層堆疊可訓練)、最後的線性頭與 softmax。
3. **深入核心**：技術上最關鍵的 trade-off 是「並行訓練 vs. 序列推論」——self-attention 讓同一層內所有位置的計算可以平行(這是訓練在 GPU 上能吃滿吞吐的原因),但自回歸生成天生是序列的,每個新 token 都依賴前一個,這是它跟 RNN 在訓練效率上根本不同、卻在推論延遲上仍有硬限制的地方。也可以提到 causal mask 如何讓訓練與生成保持一致。
4. **收尾**：把技術細節收斂成一句面試官會記住的話——「attention 是 token 之間唯一互動的地方,MLP 做逐位置運算,這個分工加上完全並行的訓練,是 Transformer 取代 RNN/CNN 成為 LLM 骨幹的根本原因;但推論時序列生成的本質,決定了 KV cache 跟 memory bandwidth 會是接下來所有效能優化要處理的瓶頸」。

### 範例回答（面試時可以這樣講）

> Transformer 的核心想法是把「token 之間怎麼互動」跟「每個 token 自己要做什麼運算」拆成兩個獨立的子層。**輸入端**,文字先被 tokenizer 切成 subword,查表變成 embedding 向量,再疊加位置資訊——現在主流模型大多用 RoPE 而不是舊式的可學習絕對位置編碼。這個向量序列接著流過 N 層相同的 block。
>
> **每個 block 裡**,self-attention 讓每個 token 把自己的向量投影成 query、key、value 三份,用 query 對所有 key 做內積再 softmax,得到一組權重,拿這組權重加權平均 value,就是這個 token 吸收上下文之後的新表示——這是整個架構裡唯一一個「token 跟 token 互相看」的地方。緊接著的 feed-forward MLP 則是對每個位置獨立做非線性轉換,不看其他位置,卻佔了模型大部分參數。兩個子層都包著殘差連接跟 RMSNorm,這是讓上百層堆疊還能訓練起來的關鍵。
>
> **這個設計對 NLP 帶來兩個直接影響**:一是訓練時同一層內所有位置的計算可以完全並行,不像 RNN 要一步步展開,這是 Transformer 能吃滿 GPU 吞吐、進而把模型規模推到現在量級的根本原因;二是 attention 讓模型直接對任意距離的 token 建立關聯,不會像 RNN 那樣隨距離增加而訊號衰減,這解決了長距依賴問題。代價是推論時自回歸生成天生是序列的,每個新 token 都要重新載入權重跟 KV cache 做一次前向傳播,瓶頸是記憶體頻寬而不是運算量——這也是為什麼 batching 跟 KV cache 管理會變成後續推論優化的重點。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 講清楚 embedding + 位置編碼(RoPE)+ N 層 block 的整體結構 | |
| Self-attention 的 Q/K/V 直覺,而不是只說「attention 讓模型看整句話」 | |
| 提到 causal mask 讓自回歸訓練與生成一致 | |
| 提到殘差連接與正規化是深層堆疊可訓練的關鍵 | |
| 講出訓練並行 vs. 推論序列生成的 trade-off | |
| 加分：連到 memory-bandwidth bound 或 KV cache 這類推論工程議題 | |

## 延伸閱讀

- [LLM Interview Questions and Answers for Freshers & Experienced (2026) - Goodspace](https://goodspace.ai/interview-questions/llm) — 今天四個核心概念的主要來源,從 decoder-only 架構、tokenization 到微調時機都有可直接背誦的完整解說
- [Consigli Machine Learning Engineer Interview Questions 2026 - Dataford](https://dataford.io/interview-guides/consigli/machine-learning-engineer) — 今日練習題「解釋 Transformer 架構與 attention 機制」的原始出處,列為 Hard 難度必考題
- [OpenAI AI Engineer Interview Questions & Guide 2026 - Dataford](https://dataford.io/interview-guides/openai/ai-engineer) — 補充 embedding space、tokenization、context management 這類「工程後果」導向的追問方向

## 參考資料

- [LLM Interview Questions and Answers for Freshers & Experienced (2026) - Goodspace](https://goodspace.ai/interview-questions/llm) — 對應「Decoder-only Transformer 的四層結構」「Self-Attention 的 Q/K/V 直覺與 Causal Mask」「Decoding 是 Memory-Bandwidth Bound」「Tokenization 對成本與 Context Window 的實際影響」「微調前該先窮盡 Prompt Engineering 與 RAG」五個段落
- [Consigli Machine Learning Engineer Interview Questions 2026 - Dataford](https://dataford.io/interview-guides/consigli/machine-learning-engineer) — 對應「今日練習題」的原始題目與難度標注
- [OpenAI AI Engineer Interview Questions & Guide 2026 - Dataford](https://dataford.io/interview-guides/openai/ai-engineer) — 對應「拆解思路」中面試官對 embedding space、context management、推論成本的追問方向
