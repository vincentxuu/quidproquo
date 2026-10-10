---
title: "MIT 6.5940 L12 Transformer 與 LLM：從效率角度重看一次架構"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, transformer, llm, kv-cache]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 14
tldr: "6.5940 在第 12 講從 CNN 轉到 Transformer，但重點不在原理，而在哪裡會吃掉記憶體與算力：attention 是 O(N²)；Llama-2-70B 若用 MHA，batch 16、長度 4096 的 KV cache 要 160GB；GQA 把它縮 8 倍、MQA 縮 64 倍；MoE 讓總參數變多但每個 token 的計算不變。這篇是進入 L13 LLM 部署前的橋接。"
description: "MIT 6.5940 Fall 2024 第 12 講 Transformer and LLM 導讀，只取效率視角：tokenizer 與 attention 的 O(N²)、pre-norm 與 FFN、三種架構（T5、BERT、GPT）、絕對與相對位置編碼（ALiBi、RoPE、位置內插）、KV cache 的記憶體算式與 MQA／GQA、SwiGLU、OPT／LLaMA／Llama 2／Llama 3／Mistral 的設計選擇、Chinchilla 與推論成本的取捨，以及 Flamingo、PaLM-E 與 MoE。"
draft: false
glossary:
  - term: "GQA"
    aliases: ["grouped-query attention", "分組查詢注意力"]
    definition: "query 有 N 個 head，key/value 只有 G 個 head、由多個 query head 共用。KV cache 大小隨 kv-head 數等比縮小。L12 投影片寫 G 通常取 N/8；MQA 是 G=1 的極端情況。"
    context: "MIT 6.5940 L12 投影片第 55–57 頁，用來縮小長上下文下的 KV cache。"
  - term: "Chinchilla law"
    aliases: ["Chinchilla scaling law"]
    definition: "Hoffmann et al. 2022 的結論：訓練算力固定時，模型大小與訓練資料量要一起放大，才能得到最佳的算力與精度取捨。L12 提醒這是訓練端的最佳點，考慮推論成本時，把較小的模型訓練更久（如 LLaMA）更划算。"
    context: "MIT 6.5940 L12 投影片第 73 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 12 講（2024-10-17），主要材料是 [Lec12-Transformers-and-LLM.pdf](https://www.dropbox.com/scl/fi/4o87goykb0aoyopps02t4/Lec12-Transformers-and-LLM.pdf?rlkey=k97sdf3ls3xxz4fgvte6px279&dl=0)（90 頁）與 [課堂錄影](https://youtu.be/EV6xb4xY708)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影公開；這講沒有對應的 lab。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)把同名講次排在 10 月 22 日，截至 2026-09-30 投影片與錄影仍是空連結。

**系列位置**：上一篇 [L11 TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)｜下一篇 [L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

到 L11 為止，6.5940 的例子幾乎都是 CNN：剪 VGG、量化 ResNet、在 MCU 上塞 MobileNetV2。F24 課表在 L12 前插了一個「Chapter II: Domain-Specific Optimization」分隔，後面的 LLM 部署、後訓練、長上下文、ViT、diffusion 全都建立在 Transformer 上。L12 的任務是把這個架構交代清楚，好讓後面幾講有共同語言。

這篇只取**效率視角**：哪個設計吃記憶體、哪個吃算力、後來的變體各省了什麼。Transformer 的完整原理，本站有幾個更適合的起點：[CS224N 第 5 講：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)、[CME295 第 1 講](/posts/ai/2026-09-29-cme295-transformer)與[第 2 講](/posts/ai/2026-09-29-cme295-transformer-tricks)、[CS336 的架構與超參數](/posts/ai/2026-08-22-cs336-architectures-hyperparameters)。

第 6 頁的 Lecture Plan 有四段：Transformer 基礎、設計變體、LLM、進階主題（多模態 LLM）。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=EV6xb4xY708
title: EfficientML.ai Lecture 12 - Transformer and LLM (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 12 - Transformer and LLM (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=EV6xb4xY708)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

## Transformer 基礎：成本藏在哪

### 為什麼離開 RNN 與 CNN

第 9–13 頁先回顧 Transformer 之前的兩條路。RNN 難以建模長距離關係，兩個 token 要互動得走 O(seq_len) 步；而且第 n 個狀態依賴前 n−1 個，訓練很難平行。CNN 的 token 之間沒有依賴、擴展性好，但上下文有限，建模能力較弱。投影片還點出一個差別：影像有局部性，語言不一定有。

### 各元件的效率意涵

第 14 頁列出 Transformer 的組成：tokenizer、embedding、Multi-Head Attention（MHA）、Feed-Forward Network（FFN）、LayerNorm、residual、位置編碼、最後的 linear head。對效率來說，幾個點值得記下：

- **Tokenizer**（第 16 頁）：一個字可能被切成多個 token，投影片的例子是 110 個字變成 162 個 token。後面算 KV cache 與 attention 成本時，長度 N 指的是 token 數。
- **Self-attention**（第 21 頁）：Q 乘 K 得到 N×N 的注意力權重，所以 **attention 的計算量是 O(N²)**。投影片用 YouTube 搜尋比喻 Q/K/V：query 是搜尋框的文字，key 是影片標題與描述，value 是影片本身。
- **FFN**（第 27 頁）：attention 負責 token 之間的關係，但沒有逐元素的非線性，所以接一個兩層 MLP，中間層放大到 4d。投影片稱它為 inverted bottleneck，和 L11 提到 MobileNetV2 inverted residual block 展開 6 倍通道是同一種形狀。
- **LayerNorm 與 pre-norm**（第 29–30 頁）：Transformer 用 LayerNorm 而不是 CNN 的 BatchNorm，對每個 token 的 embedding 各自正規化。投影片註明 pre-norm 因為訓練較穩定，現在比 post-norm 更常見。
- **位置編碼**（第 31–32 頁）：attention 與 FFN 本身不分辨順序，等於把句子當成集合，所以要加位置資訊。原版用的是絕對位置編碼。

第 34 頁的結果：原版 Transformer 在機器翻譯上超越先前模型，而且訓練成本只是一小部分。

## 設計變體：每一個都在省某樣東西

第 36 頁列出原論文之後的四組主要變體：

1. Encoder-decoder（T5）、encoder-only（BERT）、decoder-only（GPT）
2. 絕對位置編碼 → 相對位置編碼
3. KV cache 最佳化：MHA → MQA → GQA
4. FFN → GLU

### 三種架構

第 38–41 頁快速走過。[T5](https://arxiv.org/abs/1910.10683) 把各種 NLP 任務統一成文字到文字，prompt 進 encoder、decoder 生成答案。BERT 是 encoder-only，預訓練用 masked language model（隨機遮 15% token）與 next sentence prediction。GPT 是 decoder-only，預訓練目標是預測下一個字；較小的模型（GPT-2）會再微調，更大的模型可以 zero-shot 或 few-shot。

### 相對位置編碼：train short, test long

第 43 頁比較兩種做法。絕對位置編碼把位置資訊融進輸入 embedding，所以會影響 Q、K、V，並傳遍整個網路。相對位置編碼只影響注意力分數（加 bias 或修改 Q、K），不動 V。好處是可能泛化到訓練時沒看過的長度，也就是「train short, test long」，投影片加註「不一定都成立」。

- **[ALiBi](https://arxiv.org/abs/2108.12409)**（第 44 頁）：在注意力矩陣上直接加一個依相對距離而定的偏移，而不是加到 token embedding 上。
- **[RoPE](https://arxiv.org/abs/2104.09864)**（第 45–46 頁）：LLaMA 用的做法。把 d 維 embedding 拆成 d/2 對，每對當成 2D 座標，依位置 m 旋轉。兩個向量內積的相位差就是 m−n，只跟相對位置有關。

RoPE 的效率價值在第 47 頁：LLM 訓練時有長度上限（LLaMA 2k、Llama 2 4k、GPT-4 8k），超過就失效。對 RoPE 做[位置內插](https://arxiv.org/abs/2306.15595)（用較小的 θ），可以把 LLaMA 的上下文從 2k 延伸到 32k。這是 [L15 長上下文](/posts/ai/2026-09-30-mit-65940-long-context-llm)的起點。

### KV cache：長上下文下最先爆的東西

第 49–51 頁。GPT 類模型逐 token 生成時，每一步只需要當前 token 的 query，但要跟**所有先前 token** 的 key、value 做 attention。把這些 K、V 存起來重用，就是 KV cache。

第 52 頁給了算式：

KV cache 大小 = batch size × 層數 × kv-head 數 × 每個 head 的維度 × 長度 N × 2（K 和 V）× 2 bytes（FP16）

套進實際模型：

| 模型 | 每個 token、每筆 batch 的 KV cache |
|---|---|
| Llama-2-7B（32 層 × 32 heads × 128） | 512KB |
| Llama-2-13B（40 層 × 40 heads × 128） | 800KB |
| Llama-2-70B，假設用 MHA（80 層 × 64 heads × 128） | 2.5MB |

第 53 頁把 70B 的數字放大：batch 1、長度 512 是 1.25GB；長度 4096 是 10GB；batch 16、長度 4096 就是 160GB，要兩張 A100。第 54 頁的圖顯示，長度 2048 時，batch 一變大，KV cache 很快就超過模型權重本身。

這張表是整講對後面最重要的一頁。[L13](/posts/ai/2026-09-30-mit-65940-llm-deployment) 的 KV cache 量化、H2O、PagedAttention，[L15](/posts/ai/2026-09-30-mit-65940-long-context-llm) 的 StreamingLLM、DuoAttention，要解的都是這個數字。

### MQA 與 GQA：少存幾個 head

第 55–57 頁的解法是減少 kv-head 數量：

- **MHA**：N 個 query head，N 個 key/value head。
- **[MQA](https://arxiv.org/abs/1911.02150)**：N 個 query head，只有 1 個 key/value head。
- **[GQA](https://arxiv.org/abs/2305.13245)**：N 個 query head，G 個 key/value head，投影片寫通常 G = N/8。

以 Llama-2-70B 的尺寸（64 個 head）為例，GQA 用 8 個 kv-head，KV cache 小 8 倍；MQA 用 1 個，小 64 倍。第 57 頁引 Llama 2 論文的實驗：模型夠大時，GQA 的精度可以追上 MHA。第 70 頁也提到 Llama 2 的 70B 版本正是 64 個 head、8 個 kv-head。

### GLU：換掉 FFN

第 59–60 頁：把原版 FFN 換成 [GLU 變體](https://arxiv.org/abs/2002.05202)（例如 SwiGLU，用 Swish 激活加上逐元素相乘的閘門）能改善 Transformer 的 perplexity。

## LLM：大模型的設計選擇

第 62–63 頁說明 LLM 就是把 Transformer 放大、用大量語料（自然語言、程式碼等）訓練。投影片把模型大小與 GPU 記憶體畫在同一張圖上：模型成長的速度遠超過單張 GPU 記憶體，這是整門課存在的理由之一。放大還帶來「emergent」能力，某些任務只在模型夠大時才出現。

第 64–66 頁的 GPT-3（175B）展示 in-context learning：不需要微調，靠任務描述（zero-shot）或示範例子（few-shot）就能做新任務，而且模型越大越能利用示範。

第 68–72 頁把幾個開源模型的設計選擇列成規格。對效率讀者來說，重點是這些選擇大多已經收斂：

| 模型 | 投影片列出的設計選擇 |
|---|---|
| [OPT](https://arxiv.org/abs/2205.01068) | decoder-only、pre-norm（350M 例外用 post-norm）、FFN 用 ReLU；125M 到 175B 共九種大小 |
| [LLaMA](https://arxiv.org/abs/2302.13971) | decoder-only、pre-norm、SwiGLU、RoPE；7B 到 65B；上下文 2048 |
| Llama 2 | 上下文 2k → 4k；訓練 token 從 1T/1.4T 增加到 2T；較大模型用 GQA；另有 Llama-2-chat |
| Llama 3 | 訓練 token 15.6T；算力是 Llama 2 的 50 倍；旗艦 405B；base 8K、instruct 版 128K；後訓練用 SFT、rejection sampling、DPO |
| Mistral-7B | GQA（8 個 kv-head）、上下文 8k、sliding window attention（v2 起不再使用）；7B 勝過 Llama-2-13B |

### Chinchilla 與推論成本

第 73 頁引 [Chinchilla](https://arxiv.org/abs/2203.15556)：訓練算力固定時，模型大小與資料量要一起放大，才能得到最佳的算力與精度取捨。接著投影片加了一句效率課特有的提醒：

> Note: the trade-off is different if we consider the inference computation trade-off

意思是如果你在乎推論成本，就該把較小的模型訓練更久，例如 LLaMA。投影片指出 Llama-2 7B 用 2T token 訓練，遠超 Chinchilla 建議的量。對部署端來說，這是個好消息：同樣能力的模型可以更小。

## 進階主題：多模態與 MoE

### 兩種讓 LLM 看得見的方法

第 76 頁把視覺語言模型分成兩類：

- **Cross-attention 注入視覺資訊**（[Flamingo](https://arxiv.org/abs/2204.14198) 風格，第 77–81 頁）：凍結 LLM，在中間層插入 cross-attention 層。Perceiver Resampler 用少量 learned query，把大小不一的影像特徵壓成固定數量的視覺 token。Gated cross-attention 用 tanh 閘門控制視覺資訊的份量，閘門初始化為 0，所以一開始不會破壞原本的 LLM。
- **視覺 token 直接當輸入**（[PaLM-E](https://arxiv.org/abs/2303.03378) 風格，第 82–83 頁）：影像、機器人狀態等模態都轉成 token 餵給 LLM；RT-2 更進一步直接輸出控制訊號。

Perceiver Resampler 的設計本身就是效率選擇：視覺 token 越少，LLM 要處理的序列越短。這條線在 [L14 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training)的多模態 LLM 會繼續。

### MoE：參數變多，每個 token 的計算不變

第 86–89 頁（引 [Switch Transformers](https://arxiv.org/abs/2101.03961)）：MoE 讓每個 token 只用到一部分參數。Router 把 token 分配給不同 expert；expert 越多，總參數越大，loss 越低，但每個 token 的推論成本不變。

第 88 頁用一個小例子解釋 capacity factor C：6 個 token、3 個 expert。C = 1 時每個 expert 最多處理 2 個 token，有一個 token 會被跳過；C = 1.5 時上限變成 3 個，expert 2、3 就有餘裕。這個參數決定了負載不均時要丟 token 還是多留空間。

## 讀完這講可以做什麼

- **今晚能做的事**：挑一個你會用的開源模型，從它的 config 讀出層數、kv-head 數、head 維度，用第 52 頁的算式算出 batch 1、長度 8192 的 KV cache，和模型權重大小比一比。這個比例決定了你的瓶頸在權重還是 KV cache。
- 接著讀 [L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)，看量化、稀疏、serving 三條路怎麼處理這些數字。

## 延伸閱讀

- Transformer 原理：[Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- 推論成本的另一種講法：[CS336 Lecture 10：LLM 推論](/posts/ai/2026-08-22-cs336-inference)
- KV cache 與 serving 系統：[CMU 11-868 大規模服務：prefill／decode 拆分與 KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)
- MoE 與模型平行：[CMU 11-868 L16–L17](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L12 日期、Chapter II 分隔、投影片與錄影連結
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — L12 排在 10 月 22 日，材料未放出
- [Lec12-Transformers-and-LLM.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/4o87goykb0aoyopps02t4/Lec12-Transformers-and-LLM.pdf?rlkey=k97sdf3ls3xxz4fgvte6px279&dl=0) — 本文所有頁碼、KV cache 數字與模型規格的出處
- [EfficientML.ai Lecture 12 - Transformer and LLM（YouTube）](https://youtu.be/EV6xb4xY708)
- [Vaswani et al., Attention Is All You Need（2017）](https://arxiv.org/abs/1706.03762)
- [Raffel et al., T5（2019）](https://arxiv.org/abs/1910.10683)
- [Press et al., ALiBi: Train Short, Test Long（2021）](https://arxiv.org/abs/2108.12409)
- [Su et al., RoFormer: Rotary Position Embedding（2021）](https://arxiv.org/abs/2104.09864)
- [Chen et al., Extending Context Window of LLMs via Positional Interpolation（2023）](https://arxiv.org/abs/2306.15595)
- [Shazeer, Fast Transformer Decoding: One Write-Head is All You Need（2019）](https://arxiv.org/abs/1911.02150) — MQA
- [Ainslie et al., GQA（2023）](https://arxiv.org/abs/2305.13245)
- [Shazeer, GLU Variants Improve Transformer（2020）](https://arxiv.org/abs/2002.05202)
- [Zhang et al., OPT（2022）](https://arxiv.org/abs/2205.01068)
- [Touvron et al., LLaMA（2023）](https://arxiv.org/abs/2302.13971)
- [Hoffmann et al., Training Compute-Optimal Large Language Models（2022）](https://arxiv.org/abs/2203.15556) — Chinchilla
- [Alayrac et al., Flamingo（2022）](https://arxiv.org/abs/2204.14198)
- [Driess et al., PaLM-E（2023）](https://arxiv.org/abs/2303.03378)
- [Fedus et al., Switch Transformers（2021）](https://arxiv.org/abs/2101.03961)
