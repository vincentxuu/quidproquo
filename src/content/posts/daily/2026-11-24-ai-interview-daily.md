---
title: "AI Engineer 面試日練 — 2026-11-24：Deep Learning & NLP"
date: 2026-11-24
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二主題 Deep Learning & NLP：從 Mistral 7B 的真實面試題拆解 KV cache 為什麼會變成 decode 階段的記憶體頻寬瓶頸，以及 GQA／MQA 怎麼靠共享 KV head 解決它。"
tldr: "今天的核心是 KV cache 怎麼從「省算力的好東西」變成「decode 階段的頻寬瓶頸」：prefill 是一次處理整段 prompt 的大矩陣乘法，受算力限制；decode 是一次只算一個 token，但每步都要把整份 KV cache 讀回來，受記憶體頻寬限制，而且 cache 大小隨 batch×context 線性成長。GQA／MQA 的解法是讓多個 query head 共享同一組 KV head，直接等比例縮小要存、要讀的資料量；練習題問的是 Mistral 7B 的 GQA 跟 sliding-window attention 分別解決哪個問題、各自的代價是什麼，陷阱是把兩者混成同一招。"
series:
  name: "AI Engineer 面試日練"
  order: 97
---

> :globe: [English version](/posts/daily/2026-11-24-ai-interview-daily-en)

## 今日主題

星期二固定練 Deep Learning & NLP。前幾週已經練過 self-attention 的推導、位置編碼（RoPE）、LoRA／QLoRA 微調，今天把範圍移到推論階段一個幾乎每個 LLM 系統設計面試都會碰到的環節——KV cache。這題的陷阱不是「背出 KV cache 是什麼」，而是講不清楚它為什麼會從一個加速技巧,反過來變成生產環境裡最吃記憶體、最容易成為瓶頸的東西，以及 GQA／MQA 這類「共享 KV head」的設計到底省在哪一步。

## 核心概念速記

### KV cache 存在的理由：decode 不該重算歷史 token 的 K、V

自迴歸生成每一步都要讓新 token 的 Query 跟「所有先前 token」的 Key、Value 做內積。如果每步都重新跑一次完整序列，計算量會隨序列長度二次成長。KV cache 的做法是：每個 token 的 K、V 一旦算出來就不會再變，所以只需要算一次、存進快取，之後每一步只算新 token 自己的 Q、K、V，再把新算出的 K、V 接到快取尾端，拿新 Q 跟快取裡所有 K 做內積。這把每步的計算量從 O(序列長度) 壓到 O(1)（相對於重算而言）。

### Prefill 算力密集，decode 吃記憶體頻寬——兩個階段的瓶頸完全不同

這是面試官最愛追問的區分。Prefill 階段一次處理整段 prompt，Query 是一整批 token 疊起來的高矮矩陣，跟權重做的是大型矩陣乘法，GPU 算力能被打滿，所以是 compute-bound，決定的是 time-to-first-token。Decode 階段每一步只處理一個新 token，Query 變成只有一行的向量，矩陣乘法退化成矩陣乘向量，算術強度很低——真正花時間的不是算,是把整份 KV cache 從顯存搬到計算單元,這就是 memory-bandwidth-bound,決定的是 inter-token latency。這也是為什麼生產系統要把大量 decode 請求湊成一批一起跑：用同一次權重讀取分攤給更多請求,才能把頻寬用在真正該花的地方。

### KV cache 的大小公式：為什麼它會比模型權重本身更先爆記憶體

單一層、單一 token 的快取大小是 `2 × KV head 數 × 每個 head 的維度 × 每個元素的 byte 數`（2 代表 K 跟 V 各存一份）。把它乘上層數、batch size、序列長度,就是整個系統要吃的顯存。這個數字是 batch × context 的線性函數——context 越長、同時服務的請求越多,快取就越大,在大 batch、長 context 的場景下,快取佔用的顯存常常超過模型權重本身,變成真正卡住吞吐量的東西,不是算力不夠,是沒有多的顯存放快取、也沒有多的頻寬讀快取。

### GQA／MQA：讓多個 Query head 共享同一組 KV head，直接縮小要存跟要讀的資料量

標準 multi-head attention（MHA）的 KV head 數跟 Query head 數相等，每個 head 各自存一份 K、V。multi-query attention（MQA）走到另一個極端：所有 Query head 共享同一組 KV head,KV head 數變成 1,快取縮到最小,但不同 head 失去各自觀察序列的能力,品質會掉。grouped-query attention（GQA）取中間值:KV head 數比 Query head 數少但不只 1,例如 32 個 Query head 分成 8 組,每組 4 個 Query head 共享 1 組 KV head——快取大小直接按 KV head 數的比例縮小（這個例子是 4 倍）,2023 年的原始論文發現這種中間分組能在大部分留住 MHA 的品質,同時拿到接近 MQA 的推論效益,這就是為什麼 Llama 3、Qwen3、Mistral 系列幾乎都預設用 GQA。

```flow-diagram
{
  "title": "Decode 一步：KV cache 怎麼被讀，GQA 怎麼縮小它",
  "lang": "zh-TW",
  "width": 560,
  "height": 700,
  "nodes": [
    {"id": "token", "label": "新 token 進來", "x": 280, "y": 40, "w": 260},
    {"id": "qkv", "label": "算這一個 token 的\nQ、K、V", "x": 280, "y": 150, "w": 260},
    {"id": "append", "label": "把新 K、V\n接到快取尾端", "x": 280, "y": 260, "w": 260},
    {"id": "read", "label": "讀回整份 KV cache\n（頻寬瓶頸發生在這）", "x": 280, "y": 370, "w": 260, "tone": "accent"},
    {"id": "attn", "label": "新 Q 跟快取裡所有 K\n做內積、softmax", "x": 280, "y": 480, "w": 260},
    {"id": "gqa", "label": "GQA：多個 Q head\n共享同一組 KV head\n→ 快取按比例縮小", "x": 280, "y": 600, "w": 260, "tone": "accent"}
  ],
  "edges": [
    {"from": "token", "to": "qkv", "step": 1, "label": "只算新 token，不重算歷史"},
    {"from": "qkv", "to": "append", "step": 2, "label": "K、V 算完就不會再變"},
    {"from": "append", "to": "read", "step": 3, "label": "下一步要讀回全部歷史"},
    {"from": "read", "to": "attn", "step": 4, "label": "矩陣乘向量，算術強度低"},
    {"from": "attn", "to": "gqa", "step": 5, "label": "KV head 數決定讀多少資料"}
  ],
  "steps": [
    "每生成一個新 token，模型只算這個 token 自己的 Q、K、V，不重算歷史 token。",
    "新算出的 K、V 被接到 KV cache 尾端——K、V 一旦算完就不會改變，這是能被快取的前提。",
    "下一步要產生下一個 token 時，必須把整份 KV cache（所有歷史 token 的 K、V）從顯存讀回計算單元。",
    "這一步是矩陣乘向量，算術強度低，真正的成本在搬資料，不在算，這就是 decode 的 memory-bandwidth-bound。",
    "GQA 讓多個 Query head 共享同一組 KV head，KV head 數變少，要存、要讀的資料量就按比例縮小。"
  ],
  "caption": "簡化示意：單一 decode 步驟裡 KV cache 的讀寫路徑，真實系統還有 PagedAttention 等批次管理機制。"
}
```

### 更進一步的生產優化：PagedAttention 跟 DeepSeek 的 MLA

GQA／MQA 是在架構設計時就決定的選擇,屬於訓練前的決策。生產系統還有兩個推論時的優化值得知道。第一個是 PagedAttention（vLLM 的核心設計）：不把每個請求的快取預先配置成連續的 `max_len` 大小區塊,而是切成固定大小的 page,用類似作業系統虛擬記憶體的 block table 動態配置,解決了「請求長度不一、提早結束留下空洞」造成的內部碎片化,還能讓共用的 system prompt 在多個請求間共享同一批 page（prefix sharing）。第二個是 DeepSeek 的 multi-head latent attention（MLA）:比 GQA 更激進,不存完整的 K、V,只存一個低秩投影出來的共享 latent 向量,推論時再投影回去——DeepSeek-V2 用 MLA 把 KV cache 大小比同等級的 dense 模型砍掉 93.3%。

## 今日練習題

### 題目

Mistral 7B 同時採用了 grouped-query attention 跟 sliding-window attention，這兩個設計各自解決什麼問題？各自的代價又是什麼？

**來源**：ombharatiya/AI-Engineer-Interview-Questions（GitHub，Mistral AI 公司面試題庫）　**難度**：中等　**環節**：onsite architecture deep-dive

### 拆解思路

1. **先釐清問題**：面試官把兩個技術放在一起問,很可能是想確認你不會把它們混成「同一招用來省記憶體」,可以先主動拆解——「這兩個解決的是不同的瓶頸,我先分開講各自買到什麼、付出什麼代價,再講它們怎麼一起用在同一個模型上」。
2. **建立框架**：GQA 攻的是 KV cache 本身的大小（快取裡存了幾組 KV head）,sliding-window attention 攻的是快取需要存多久的歷史（每個 token 只需要記得最近 W 個位置）,兩個是正交的優化,一個決定「存多粗」,一個決定「存多久」。
3. **深入核心**：技術上最關鍵的一步是把兩者的代價講具體——GQA 的代價是不同 Query head 共享 KV head 後,表達能力比完整 MHA 弱一點,但實證上在這個分組比例幾乎沒有品質損失;sliding-window 的代價是真正的長距離直接注意力消失了,只能靠疊多層讓資訊間接傳遞到更遠的位置,對需要精確回想遠距離內容的任務（像是要精確複述 3 萬 token 前的一句話）可能會掉分。
4. **收尾**：把兩者收斂成一句判斷準則——「GQA 跟 sliding-window 都是把『推論時的經濟性』提前做進架構設計裡的決策,不是推論時才能切換的開關;GQA 幾乎沒有免費午餐的代價,所以幾乎所有新模型都預設開;sliding-window 是用長距離精確回想的能力換頻寬跟記憶體上限,所以近期模型更常看到的是全注意力層跟窗口注意力層混用,而不是整個模型都用窗口。」

### 範例回答（面試時可以這樣講）

> **先分開講這兩個技術打的是哪個瓶頸**：GQA 打的是 KV cache 本身的大小。Mistral 7B 原本如果用完整 multi-head attention,32 個 Query head 就要存 32 組 K、V;GQA 讓這 32 個 Query head 分成 8 組,每組共享 1 組 KV head,快取大小直接變成四分之一。這個數字直接換成兩個東西：同一張 GPU 能同時服務的請求數變多（因為每個請求佔用的快取變小）,以及 decode 每一步要從顯存讀回來的資料量也變少——decode 是記憶體頻寬瓶頸,讀得少就跑得快。代價是共享 KV head 讓這幾個 Query head 看到的「被加權的內容」是同一份,表達能力比完整 MHA 弱一點,但實證上在這個 4 倍分組比例幾乎沒有看到品質掉。
>
> **Sliding-window attention 打的是完全不同的瓶頸**：它限制每個 token 只能看最近的 W 個位置（Mistral 7B 設 4096）,把每個 token 的計算量從跟整個序列長度成正比壓成固定的 O(W),快取也可以做成固定大小的環狀緩衝區,不管生成到第幾萬個 token,快取都不會再長大。代價是真正的長距離直接注意力不見了——一個 token 沒辦法直接看到 4096 個位置以外的內容,只能靠疊很多層、讓資訊透過層層傳遞間接傳到更遠的位置,如果任務需要精確回想很久以前的細節,這個間接傳遞不一定夠。
>
> **這兩個是同一套設計哲學,但解決的是正交的兩個問題**：GQA 決定「要存幾組 KV head」,sliding-window 決定「要存多久的歷史」,Mistral 7B 把兩個一起用,是因為它們的代價不會互相疊加放大,而是各自換到各自的收益——這也是為什麼後來的模型更常看到的是「全注意力層+窗口注意力層混搭」,而不是整個模型統一用窗口。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚 decode 階段為什麼是 memory-bandwidth-bound，跟 prefill 的 compute-bound 做對比 | |
| 有正確寫出或描述 KV cache 大小跟 KV head 數、層數、batch、序列長度的線性關係 | |
| 有分開講 GQA（KV head 數量）跟 sliding-window（歷史長度）打的是正交的兩個瓶頸 | |
| 有講出 GQA／MQA 各自的代價，不是只背「共享 KV head 省記憶體」這句話 | |
| 加分：有提到 PagedAttention 或 DeepSeek MLA 作為推論時／架構時的進一步優化 | |

## 延伸閱讀

- [Grouped-Query Attention (GQA) in Modern LLMs — Sebastian Raschka](https://sebastianraschka.com/faq/docs/grouped-query-attention.html) — 用 Qwen3、Llama 3、Gemma 3 的實際 head 數字算出快取公式,適合核對自己手算的 KV cache 大小有沒有算對。
- [Decoding Multi-Head Latent Attention: The KV Cache Memory Bottleneck, Solved — Vizuara](https://vizuara.substack.com/p/decoding-multi-head-latent-attention) — 從 KV cache 的記憶體牆講到 DeepSeek 的 MLA 怎麼用低秩投影再往下砍一次,適合想知道 GQA 之後還能往哪個方向優化的人。

## 參考資料

- [Mistral AI — AI Engineer Interview Questions (ombharatiya/AI-Engineer-Interview-Questions, GitHub)](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/mistral.md) — 本篇練習題的原始問法來源,收錄於這個 GitHub AI Engineer 面試題庫的 Mistral AI 專章。
- [Explain KV cache in Transformer inference — prachub.com](https://prachub.com/interview-questions/explain-kv-cache-in-transformer-inference) — 對應「核心概念速記」第一、二節關於 prefill／decode 角色區分與 KV cache 記憶體公式的系統性拆解。
- [Grouped-Query Attention (GQA) in Modern LLMs — Sebastian Raschka](https://sebastianraschka.com/faq/docs/grouped-query-attention.html) — 對應第三、四節關於 MHA／MQA／GQA 的定義與快取大小換算。
- [Decoding Multi-Head Latent Attention: The KV Cache Memory Bottleneck, Solved — Vizuara](https://vizuara.substack.com/p/decoding-multi-head-latent-attention) — 對應第五節 PagedAttention 與 DeepSeek MLA 的延伸優化說明。
