---
title: "Scaling Laws：模型要多大才夠，以及為什麼不是越大越好"
date: 2026-08-26
category: ai
type: deep-dive
tags: [scaling-laws, chinchilla, compute-optimal, training, ai-model, llm]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 8
tldr: "Scaling laws 說 loss 跟參數量、資料量、算力之間有可預測的冪次關係。Chinchilla 論文的關鍵發現：大多數模型都太大、訓練資料太少——同樣的算力預算，訓練一個較小但吃更多資料的模型反而更強。這改變了整個產業的訓練策略。"
description: "Scaling Laws 入門：Kaplan 的冪次定律、Chinchilla 的 compute-optimal 發現、怎麼讀 log-log 圖、以及這些定律如何影響 Llama 3 和 MoE 架構的設計決策。"
draft: false
glossary:
  - term: "Scaling Laws"
    def: "規模定律——模型效能跟參數量、資料量、算力之間的可預測冪次關係"
  - term: "Compute-Optimal"
    def: "算力最佳配置——在固定算力預算下，找到模型大小和訓練資料量的最佳比例"
  - term: "Chinchilla"
    def: "DeepMind 2022 年論文提出的 compute-optimal 訓練策略，證明大多數模型太大而訓練不足"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-scaling-laws-en)

GPT-4 據報有超過一兆個參數。Llama 3.1 有 8B、70B、405B 三種大小。為什麼要做這麼多尺寸？為什麼不直接做最大的就好？

因為「越大越好」有一個前提：你有無限的算力。現實世界裡沒有。Scaling laws 告訴我們，在有限的算力預算下，怎麼把錢花在刀口上。

## 冪次定律：可預測的進步

2020 年，OpenAI 的 Kaplan 等人發表了一篇關鍵論文，發現語言模型的 loss 跟三個變數之間存在**冪次關係（power law）**：

- **N**：模型參數量
- **D**：訓練資料量（token 數）
- **C**：訓練算力（FLOPs）

所謂冪次關係，就是 loss 隨著這些變數增加而**平滑、可預測地下降**。不是隨機的，不是階梯式的——是一條漂亮的曲線。

<details>
<summary>冪次定律的數學形式</summary>

Kaplan 等人發現的經驗公式大致長這樣：

$$L(N) \approx \left(\frac{N_c}{N}\right)^{\alpha_N}$$

$$L(D) \approx \left(\frac{D_c}{D}\right)^{\alpha_D}$$

其中 $\alpha_N \approx 0.076$，$\alpha_D \approx 0.095$，$N_c$ 和 $D_c$ 是常數。Loss 跟參數量、資料量的對數呈線性關係——這就是冪次定律。

</details>

這個發現為什麼重要？因為它意味著你可以**預測**：如果我把模型放大 10 倍，loss 大概會降多少。不需要真的花幾億美元訓練完才知道結果。

### 怎麼讀 log-log 圖

Scaling laws 的論文裡到處都是 log-log 圖，如果你沒見過可能會覺得奇怪。這裡快速說明。

普通圖表的 x 軸和 y 軸都是線性的：1、2、3、4…。**Log-log 圖的兩個軸都是對數刻度**：1、10、100、1000…。每一格代表的不是「加一」，而是「乘以十」。

為什麼要用對數刻度？因為 scaling laws 涵蓋的範圍太大了——從 1 千個參數到 1 千億個參數。線性軸上根本畫不下。

最關鍵的一點：**在 log-log 圖上，冪次關係會呈現為一條直線**。如果你看到一條直的斜線，那就是冪次定律在作用。斜率越陡，代表隨著規模增加，改善越快。

所以當你看到 scaling laws 論文裡那些漂亮的直線，它們不只是「好看」——它們是在說：**這個關係是可預測的，而且可以外推**。

## Chinchilla 的翻轉：大多數模型都訓練不足

2022 年，DeepMind 的 Hoffmann 等人發表了 *Training Compute-Optimal Large Language Models*——業界俗稱 Chinchilla 論文。這篇論文翻轉了整個產業的共識。

Kaplan 的論文有一個隱含結論：模型越大越好，資料不太重要。所以 2020-2022 年間，各家實驗室的策略是**拼命堆參數**——GPT-3 175B、PaLM 540B——然後只用「剛好夠」的資料訓練。

Chinchilla 論文說：**你們搞反了**。

Hoffmann 等人系統性地訓練了超過 400 個不同大小的模型，用不同量的資料，然後觀察哪個組合在同樣的算力預算下表現最好。結論：

> 在固定算力預算下，模型參數量和訓練 token 數應該**等比例擴展**。

<details>
<summary>Compute-optimal 的經驗法則</summary>

Chinchilla 論文的一個簡化結論：**訓練 token 數大約應該是參數量的 20 倍**。

也就是說，一個 10B 參數的模型，compute-optimal 的訓練資料量大約是 200B tokens。

他們用這個法則訓練了 Chinchilla——一個 70B 參數的模型，用 1.4T tokens 訓練。結果在同樣的算力預算下，Chinchilla 打敗了 280B 參數的 Gopher（只用了 300B tokens 訓練）。

模型小了 4 倍，表現卻更好。關鍵差異？Chinchilla 吃了更多資料。

</details>

用一句話總結 Chinchilla 的發現：**大多數大型語言模型都太大、訓練資料太少**。同樣的算力預算，訓練一個較小但吃更多資料的模型，效果更好。

### 為什麼這很重要

這不只是學術上的有趣發現，它直接影響了：

1. **訓練成本**：小模型不但訓練更便宜，推論（使用）也更快更省。
2. **資料需求**：產業從「堆更大的模型」轉向「找更多高品質的資料」。
3. **部署可行性**：一個 70B 模型比 280B 模型容易部署得多。

## 連回真實世界的模型

Chinchilla 之後，你可以清楚看到產業策略的轉變。

**Llama 3**（2024）是最好的例子。Llama 3 的 70B 模型用了超過 15 兆（15T）個 token 訓練——這遠遠超過 Chinchilla 的 20 倍法則。Meta 的策略是「就算超過 compute-optimal 點也繼續訓練」，因為推論成本才是長期的大頭。一個訓練過度但更小的模型，在實際部署時比一個 compute-optimal 但更大的模型更划算。

這是 Chinchilla 法則的延伸：**如果你在乎的不只是訓練成本，還有推論成本，那訓練更小的模型更久是合理的**。

**Llama 4 Scout** 則走向另一個方向：Mixture of Experts（MoE）。MoE 架構讓模型有大量的總參數，但每次推論只啟動其中一部分。這是 scaling laws 推動的另一種創新——既要模型夠大能學到足夠知識，又要推論時夠高效。

## Scaling Laws 的局限

Scaling laws 很強大，但不是萬能的。幾個值得注意的限制：

1. **它預測的是 loss，不是能力**。Loss 下降是平滑的，但模型的「能力」常常是突然出現的——所謂的 emergent abilities。一個模型可能在某個規模以下完全不會做某件事，超過之後突然可以。
2. **資料品質不在公式裡**。Scaling laws 假設資料品質固定。但現實中，用高品質資料訓練的小模型可以打敗用低品質資料訓練的大模型。
3. **架構改進可以改變曲線**。Transformer 之後的架構創新（如 MoE、State Space Models）可能會改變冪次定律的指數。

## 想深入？

- Kaplan et al. (2020). *Scaling Laws for Neural Language Models*. [arXiv:2001.08361](https://arxiv.org/abs/2001.08361)
- Hoffmann et al. (2022). *Training Compute-Optimal Large Language Models*. [arXiv:2203.15556](https://arxiv.org/abs/2203.15556)
- Stanford CS336 Lectures 9-11 深入探討 scaling laws 的理論與實務
- Meta (2024). *The Llama 3 Herd of Models*. [arXiv:2407.21783](https://arxiv.org/abs/2407.21783)

## 參考資料

- Kaplan, J. et al. (2020). [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361). arXiv:2001.08361.
- Hoffmann, J. et al. (2022). [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556). arXiv:2203.15556.
- Grattafiori, A. et al. (2024). [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783). arXiv:2407.21783.
