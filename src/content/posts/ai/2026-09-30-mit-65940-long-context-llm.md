---
title: "MIT 6.5940 第 15 講：長上下文 LLM——上下文拉長時，先爆的是 KV cache"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, long-context, kv-cache, attention, mamba]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 19
tldr: "第 15 講分四段。延長上下文：RoPE 內插可以把 LLaMA 從 2k 拉到 32k，LongLoRA 用 shifted sparse attention 讓長上下文微調變便宜。評估：lost-in-the-middle、Needle-in-a-Haystack 與 LongBench。高效 attention：KV cache 隨長度線性長大，StreamingLLM 發現開頭幾個 token 是 attention sink，保留它們加上最近視窗就能穩定生成；DuoAttention 只讓少數 retrieval head 保留完整 KV cache；Quest 保留全部 KV、依 query 只讀最關鍵的幾頁。最後一段跳出 Transformer：Mamba 用選擇性 SSM 取代 attention，Jamba 把兩者混在一起。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 15 講 Long-Context LLM 導讀：RoPE 與 position interpolation、LongLoRA、lost-in-the-middle、NIAH 與 LongBench、KV cache 大小估算、StreamingLLM 與 attention sink、DuoAttention 的 retrieval／streaming head、Quest 的 query-aware sparsity，以及 Mamba 與 Jamba。附 Fall 2026 對照。"
draft: false
glossary:
  - term: "attention sink"
    aliases: ["注意力匯聚點"]
    definition: "序列開頭的幾個 token 不論語意為何，都拿到特別高的 attention 分數的現象。因為 softmax 的分數必須加總為 1，而自迴歸模型裡開頭的 token 對後面每個位置都看得到，多餘的注意力就堆在它們身上。"
    context: "第 15 講 StreamingLLM 段的核心觀察；把它們從 KV cache 丟掉，window attention 的 perplexity 會暴衝。"
  - term: "retrieval head"
    aliases: ["檢索頭"]
    definition: "DuoAttention 的分類：需要看完整上下文、從很早的位置找回關鍵資訊的 attention head。另一類 streaming head 只看 attention sink 和最近的 token，只需要固定長度的 KV cache。"
    context: "第 15 講第 43–49 頁；DuoAttention 用可訓練的 gate 找出哪些 head 屬於 retrieval head。"
  - term: "query-aware sparsity"
    definition: "Quest 的做法：不丟任何 KV cache，而是依當下的 query 估計每一頁 KV 的最大可能 attention 分數，只把分數最高的幾頁讀進來算 attention。"
    context: "第 15 講第 55–66 頁，用來修正依歷史分數丟 token 的方法可能丟掉未來會用到的資訊。"
  - term: "Mamba"
    definition: "以選擇性 state space model（SSM）取代 attention 來處理 token 之間溝通的序列模型。狀態轉移矩陣會依輸入改變，處理長度為 n 的序列只需線性時間。"
    context: "第 15 講第 68–72 頁的「Beyond Transformers」段。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-long-context-llm-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 19 篇。

**系列位置**：上一篇 [L14 LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training)｜下一篇 [L16–L17 高效 ViT、GAN、影片與點雲](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lec15-Long-Context-LLM.pdf](https://www.dropbox.com/scl/fi/aorbruqhmbu3cpqtnbuyo/Lec15-Long-Context-LLM.pdf?rlkey=i7d5urg0m4mm96wc82nx76lgs&st=nssefmxf&dl=0)（78 頁，以下頁碼皆指這份 PDF）、[第 15 講錄影](https://youtu.be/kgTWKjbnrBA)。F24 課頁把這講排在 2024 年 10 月 29 日。存取等級 **A3**：投影片與錄影公開，這一講沒有對應的 lab。2026-09-30 核對。

**Fall 2026 對照**：[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)同樣排了「Long Context LLM」（11 月 3 日，第 15 講），截至 2026-09-30 投影片與錄影還沒上線。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=kgTWKjbnrBA
title: EfficientML.ai Lecture 15 - Long-Context LLM (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 15 - Long-Context LLM (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=kgTWKjbnrBA)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了開頭與結尾總結並抽查中段：RoPE 與上下文長度（2k 到 32k 的微調）、LongLoRA、lost-in-the-middle 與 needle-in-a-haystack 評估、StreamingLLM 的 attention sink、DuoAttention、Quest、Mamba／SSM 與混合架構。主題與講次和本文相符。第 75–78 頁的 WorldModelBench 公告在字幕裡沒有出現，本文已標明那幾頁和本講內容無關。頁碼與投影片數字以投影片為準，未逐句比對影片。

## 這一講在解什麼

想讓 LLM 讀一整本書、一小時的影片，或跟你聊上幾百輪，會同時撞上三道牆：模型在訓練長度之外會壞掉、它不一定真的用得上長上下文、KV cache 大到放不下。第 2 頁的 Lecture Plan 剛好對應這三道牆，再加一段跳出 Transformer 的替代方案：

| 段落 | 投影片頁 | 內容 |
|---|---|---|
| 1. 延長上下文 | 4–12 | 複習 RoPE、LongLoRA |
| 2. 評估長上下文 | 14–17 | Lost-in-the-middle、Needle-in-a-Haystack、LongBench |
| 3. 高效 attention | 19–66 | 複習 KV cache、StreamingLLM 與 attention sink、DuoAttention、Quest |
| 4. Transformer 之外 | 68–73 | Mamba（SSM）、Jamba（混合模型） |

第三段佔了將近 50 頁，其中 StreamingLLM 與 Quest 在投影片上直接標成「ours／our insight」，是本文的重心。

## 第一段：把上下文拉長

### RoPE 與內插

第 4 頁複習 [RoPE](https://arxiv.org/abs/2104.09864)：把 d 維 embedding 兩兩一組看成 d/2 個 2D 座標，依位置 m 旋轉。兩個向量內積的相位差只跟 m−n 有關，所以編碼的是相對位置。

第 5 頁點出 RoPE 的好處：LLM 通常有訓練長度上限（投影片舉 LLaMA 2k、Llama-2 4k、GPT-4 8k），超過就失敗。把旋轉角度縮小（[position interpolation](https://arxiv.org/abs/2306.15595)），就能把 LLaMA 從 2k 延伸到 32k。投影片特別標註：**延長之後通常還是要微調**。

### LongLoRA：讓長上下文微調變便宜

要微調，就得在長序列上訓練，而長上下文下 attention 是瓶頸。[LongLoRA](https://arxiv.org/abs/2309.12307)（第 7–12 頁）有兩個零件：

- **Shifted sparse attention（S²-Attn）**，只在訓練時用：把 attention head 分成兩半，token 分組後在組內做 attention；其中一半的 head 把分組位移半組，讓資訊能跨組流動。推論時換回完整 attention。
- **加強版 LoRA**：除了 LoRA 分支，還要訓練 input embedding 和 normalization 層。多出來的參數很少：norm 不到 0.004%，embedding 不到 2%。

第 12 頁用 topic retrieval 和 passkey retrieval 驗證，在微調過的長度內都做得到。

## 第二段：模型真的用得上長上下文嗎

- **Lost in the middle**（第 14 頁）：[Liu et al.](https://arxiv.org/abs/2307.03172) 用多文件問答和 key-value 檢索測試，發現相關資訊放在不同位置，表現會明顯改變。
- **Needle-in-a-Haystack**（第 16 頁）：在長文件的不同深度塞一句「舊金山最好的事是在晴天吃三明治、坐在 Dolores Park」，最後問模型舊金山最好做什麼。測試程式來自 [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)。
- **LongBench**（第 17 頁）：只測合成任務和真實應用關係有限。[LongBench](https://arxiv.org/abs/2308.14508) 有 21 個資料集、6 類任務（問答、摘要、few-shot 等），中英雙語，上下文可到 13,000 多個 token。

這三個測試在後面反覆出現：LongLoRA、DuoAttention、Quest 都拿 passkey／NIAH 或 LongBench 證明自己沒弄壞長上下文能力。

## 第三段：KV cache 問題與三個解法

### 先算 KV cache 有多大

第 19 頁的公式（假設 Llama-2-70B 用 MHA）：

$$
\underbrace{BS}_{\text{batch}}\times\underbrace{80}_{\text{layers}}\times\underbrace{64}_{\text{kv heads}}\times\underbrace{128}_{d}\times\underbrace{N}_{\text{length}}\times\underbrace{2}_{K\&V}\times 2\,\text{bytes}=2.5\,\text{MB}\times BS\times N
$$

batch 1、長度 512 要 1.25 GB；長度 4096 要 10 GB；batch 16、長度 4096 要 160 GB，得用兩張 A100。第 20 頁的圖顯示 batch 一放大，KV cache 很快就超過模型權重本身。

### StreamingLLM：保留開頭，丟掉中間

**場景**（第 22–26 頁）。多輪對話這類串流應用要一直生成下去，有兩個問題：decode 階段記憶體一直長，而且模型在超過訓練長度後就不行了。投影片比較了幾種做法（以 perplexity 衡量，越低越好）：

| 做法 | 複雜度 | PPL |
|---|---|---|
| Dense attention | $O(T^2)$ | 5641 |
| Window attention（只留最近 L 個） | $O(TL)$ | 5158 |
| Sliding window + 每次重算 | $O(TL^2)$ | 5.43 |
| **StreamingLLM** | $O(TL)$ | **5.40** |

Window attention 很省，但**開頭的 token 一被踢出 cache，模型就崩潰**。為什麼開頭那幾個 token 這麼重要？

**直覺**（第 27–29 頁）。觀察發現開頭的 token 拿到特別大的 attention 分數，即使它們沒有語意上的重要性，這就是 **attention sink**。原因有兩個：softmax 的分數必須加總為 1，多餘的注意力總要有地方放；在自迴歸模型裡，開頭的 token 對後面每一個位置都看得到，最容易變成堆放處。實驗上，把開頭換成四個「\n」也能救回 perplexity，所以重要的是**位置**，不是語意。第 28 頁提到，他們 2021 年在 SpAtten 專案裡就看過這個現象，到 2023 年才解釋清楚。

**機制**（第 30–31 頁）。[StreamingLLM](https://arxiv.org/abs/2309.17453) 保留 attention sink 的 KV，再加上最近一段滑動視窗，中間的全部丟掉。位置編碼用 token **在 cache 裡的位置**，而不是在原文中的位置。不需要額外訓練。

**結果**（第 32–37 頁）：

- Llama-2、MPT、Falcon、Pythia 都能穩定建模到 400 萬個 token。
- 相對「滑動視窗＋重算」快最多 22.2 倍。
- 一般來說保留 4 個 attention sink 就夠。
- 如果預訓練時在每筆資料開頭加一個專用的可學習 sink token，之後只要保留這一個。
- ViT 與 BERT 也有 attention sink：ViT 出現在低語意的背景像素，BERT 是句尾的 [SEP]。

第 38 頁自己點出限制：**不停聊天 ≠ 無限上下文**。被踢出 cache 的 token 再也看不到。後面兩個方法就是在補這一塊。

### DuoAttention：不是每個 head 都需要完整上下文

**場景**（第 40–41 頁）。一張 224×224 的圖是 256 個 token，一小時、每秒 1 幀的影片是 100 萬個 token。投影片的數字：Llama-3-8B 在 100 萬 token 的上下文下，KV cache 要 137 GB。

**直覺**（第 43–44 頁）。[DuoAttention](https://arxiv.org/abs/2410.10819) 把 head 分成兩種：

- **Retrieval head**：要從序列很前面抓回關鍵 token，需要完整 KV cache，壓縮它會明顯掉分。
- **Streaming head**：只看最近的 token 和 attention sink，用固定長度的 cache 就夠。

所以只給 retrieval head 完整 KV cache，其餘用 StreamingLLM 式的小 cache。

**機制**（第 45–48 頁）：

1. 每個 head 配一個可訓練的 gate 值 α，混合完整 attention 與 streaming attention 的輸出，目標是讓輸出盡量接近原本的完整 attention 模型。
2. 訓練資料是合成的：長文裡埋十組 passkey，要模型回想，藉此找出負責長距離檢索的 head。
3. 要訓練的只有約 1000 個 gate 值（例如 Llama-2-7B 是 32 層 × 32 head），8 張 A100 幾個小時就跑完。
4. 部署時把 α 二值化，決定每個 head 屬於哪一類，再重排 head，讓兩類各自連續存放、方便切割 KV cache。

**結果**（第 49–53 頁）：NIAH 上，MHA 模型只要 25% 的 head 用完整 attention、GQA 模型 50%，準確率就接近完整 attention。decode 記憶體最多省 2.45 倍（MHA）與 1.65 倍（GQA），延遲快 2.13 倍與 1.5 倍。搭配 8-bit 權重與 4-bit KV cache 量化，單張 A100 可以處理 330 萬個 token。

### Quest：什麼都不丟，只挑著讀

**問題**（第 55–57 頁）。SpAtten、H2O 這類方法依歷史 attention 分數決定丟哪些 token，但被丟掉的 token 可能對**未來的** query 很重要。第 57 頁的例子：token「B」在最後一個 query「is」出現之前，對誰都不重要；到了「is」才變成關鍵。token 重不重要，取決於當下的 query。

**機制**（第 58–59 頁）。[Quest](https://arxiv.org/abs/2406.10774) 保留**全部** KV cache，但把它分頁，每次 decode 只讀 K 個最關鍵的頁。怎麼快速判斷哪一頁關鍵？用每一頁 attention 權重的**上界**來估計該頁可能的最高分數。

**結果**（第 60–66 頁）：

- Passkey 測試用約 1% 序列長度的 KV 預算就接近滿分。
- LongBench 上，2k token 的預算就能接近完整 KV cache 的表現。
- 序列長度 32k、預算 2048 時，self-attention 比 FlashInfer 快 7.03 倍；搭配 4-bit AWQ 權重，30K 長度下端到端快 2.23 倍。

三個方法放在一起看：StreamingLLM 丟掉中間（省、但會忘），DuoAttention 依 head 分工（部分 head 不忘），Quest 全部保留、依 query 挑著讀（不忘、但省的是搬運而不是容量）。

## 第四段：跳出 Transformer

### Mamba：用 SSM 取代 attention

第 68 頁把 LLM 的運算拆成兩類：token 之間的溝通（Transformer 用 attention）和 token 內部的計算（MLP）。[Mamba](https://arxiv.org/abs/2312.00752) 把前者換成 state space model，處理長序列只要線性時間。

- **SSM 是什麼**（第 69 頁）：狀態 h 代表目前對序列的理解；A 決定狀態怎麼遺忘與更新，B 決定新輸入要記住哪些，C 決定怎麼用狀態做預測。
- **選擇性**（第 70 頁）：一般 SSM 的 A、B、C 是跟輸入無關的固定參數；Mamba 讓它們隨輸入 x 改變，每個 token 可以依自己的需要寫進狀態。
- **代價與解法**（第 71–72 頁）：參數不隨輸入變時，可以把整段運算預先算成卷積核來加速訓練；有了選擇性就不能這樣做，逐步遞迴又太慢。解法是注意到狀態計算跟求陣列的 prefix sum 很像，用 parallel scan 平行化。

### Jamba：混著用

[Jamba](https://arxiv.org/abs/2403.19887)（第 73 頁）把 Transformer 層和 Mamba 層交錯排列以降低記憶體需求，再加 MoE 層增加容量、同時讓每次啟用的參數維持在低水位。投影片的數字是：單張 80GB GPU 放得下，支援 256K token。

> 第 75–78 頁是 2024 年課堂上的 WorldModelBench 標註競賽公告（10/29–11/4，限 MIT 信箱），和本講內容無關，校外讀者可以跳過。

## 自學怎麼做

1. 先用第 19 頁的公式算一次你常用的模型：查它的層數、KV head 數（GQA 模型比 MHA 少很多）、head 維度，看 32K 上下文每個請求要幾 GB。
2. 把第 26 頁的四列表格和第 30 頁的圖並排讀，確認自己能說出「為什麼 window attention 會崩、StreamingLLM 只多保留 4 個 token 就不崩」。
3. 今晚就能做的一件事：打開第 22 頁引用的 [tomaarsen/attention_sinks](https://github.com/tomaarsen/attention_sinks) repo。先看 README 裡 `transformers`、`windowed`、`attention_sinks` 三種載入方式的 perplexity 與無限生成紀錄（windowed 在開頭 token 離開視窗後失去流暢度），再用它可直接替換 `transformers` 的 API，拿自己的小模型跑一次。

## 延伸閱讀

- 同系列：[L12 Transformer 與 LLM](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)（KV cache 第一次出現）、[L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)（SpAtten、H2O、PagedAttention）、[L14 LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training)（LoRA）
- KV cache：[CMU 11-868 大規模服務與 KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)、[台大李宏毅 ML 2026：KV Cache 與瘦身法](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)
- 長上下文與 SSM：[CMU 10-423 L19 + L21：長上下文與 State Space／Hybrid 模型](/posts/ai/2026-09-30-cmu10423-long-context-ssm)
- 推論系統：[CS336 推論](/posts/ai/2026-08-22-cs336-inference)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。L15 影片主題與講次相符，抽樣未發現與本文矛盾，正文未改。

## 參考資料

- [Lec15-Long-Context-LLM.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/aorbruqhmbu3cpqtnbuyo/Lec15-Long-Context-LLM.pdf?rlkey=i7d5urg0m4mm96wc82nx76lgs&st=nssefmxf&dl=0) — 本文所有頁碼、數字與段落劃分
- [第 15 講錄影（YouTube）](https://youtu.be/kgTWKjbnrBA)
- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 排程與日期
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 第 15 講排程與上線狀態
- [Su et al., RoFormer（RoPE）](https://arxiv.org/abs/2104.09864)、[Chen et al., Position Interpolation](https://arxiv.org/abs/2306.15595)、[Chen et al., LongLoRA](https://arxiv.org/abs/2309.12307)
- [Liu et al., Lost in the Middle](https://arxiv.org/abs/2307.03172)、[gkamradt/LLMTest_NeedleInAHaystack（GitHub）](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)、[Bai et al., LongBench](https://arxiv.org/abs/2308.14508)
- [Databricks, LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — 第 19–20 頁 KV cache 算式的出處
- [Xiao et al., StreamingLLM（Efficient Streaming Language Models with Attention Sinks）](https://arxiv.org/abs/2309.17453)
- [Xiao et al., DuoAttention](https://arxiv.org/abs/2410.10819)、[Tang et al., Quest](https://arxiv.org/abs/2406.10774)
- [Gu & Dao, Mamba](https://arxiv.org/abs/2312.00752)、[Lieber et al., Jamba](https://arxiv.org/abs/2403.19887)
