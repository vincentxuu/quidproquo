---
title: "CMU 10-423 L14–L15：Cross-attention、DiT、Prompt-to-Prompt 與 Q-Former"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, attention, diffusion-transformer, diffusion-model, image-generation]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 14
tldr: "文字條件是從哪裡注入圖片生成模型的？CMU 10-423 L14 的答案是 cross-attention：query 來自影像的潛在表示，key 和 value 來自提示詞，所以每個潛在像素都有一個「看向哪些字」的機率分布。這張注意力圖可以拿來做很多事：classifier-free guidance 讓生成更貼近提示，Prompt-to-Prompt 在不重新訓練的情況下，把舊的注意力圖抄進新提示詞的生成，只改圖片的一部分。DiT 則把 UNet 換成 Transformer，用 adaLN-Zero 注入條件。L15 前半的 Q-Former 用一小組可學習的 query，把凍結的影像編碼器接上凍結的 LLM，也就是 HW4 要你實作的東西。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 14 講與第 15 講前半導讀：從 self-attention 到 cross-attention 的公式、LDM 裡 query／key／value 的來源、classifier-free guidance 的演算法、Diffusion Transformer 的 adaLN-Zero 與 GFLOPs 規模化結果、Prompt-to-Prompt 的注意力替換與對齊問題，以及 BLIP-2 Q-Former、MetaQueries、Perceiver IO 的 learnable query 設計與 HW4 的關係。"
draft: false
glossary:
  - term: "Q-Former"
    definition: "BLIP-2 提出的 Querying Transformer：用一小組可學習的 query 向量，透過 cross-attention 從凍結的影像編碼器抽出固定數量的特徵，再接到凍結的 LLM。"
    context: "L15 的主題，也是 HW4 程式題要實作的模組。"
  - term: "Prompt-to-Prompt"
    definition: "Hertz et al. 2022 的影像編輯法：用原提示詞生成時記下 cross-attention 權重，換成新提示詞重跑時把這些權重抄進去，讓構圖保持不變、只改對應的文字部分；不需要訓練，也不需要遮罩。"
    context: "L14 用它展示 cross-attention 權重的用途。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 14 篇。主要材料是 [Lecture 14 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf)（另有 [inked 版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p-ink.pdf)），以及 [Lecture 15 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)的前半 Querying Transformer 部分；後半的 scaling laws 放在[第 16 篇](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)。

錄影只放在 CMU 的 Panopto，校外看不到，所以本文只依投影片撰寫。L15 的 Q-Former 部分幾乎全是論文圖，沒有文字說明，下面的描述來自投影片引用的 BLIP-2、MetaQueries、Perceiver IO 圖說。講次表這兩講沒有列 readings。事實皆於 2026-09-30 打開官方材料核對。

[上一篇](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)說 LDM 用 cross-attention 讀提示詞，但沒拆開講。這一篇要回答：**文字條件是從模型的哪裡注入的？編輯提示詞時，為什麼能只改圖片的一部分？**

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；2026-10-10 重查：匿名開啟 Panopto 資料夾時沒有影片、提示登入；課程首頁與課表也沒有公開的 YouTube 錄影連結（講者 2026-04-08 的貼文說 YouTube 錄影「很快」會放上，但查核時官方頁面尚無連結）。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

查核日期：2026-10-10。

## Cross-attention：query 和 key/value 來自不同地方

L14 先複習 L2 的 scaled dot-product attention：同一串輸入 x 各自乘上 W_q、W_k、W_v，得到 query、key、value。cross-attention 只改一件事：**query 來自一串序列 y（長度 n），key 和 value 來自另一串序列 x（長度 m）**。

<details>
<summary>矩陣形式</summary>

- Q = Y·W_q ∈ ℝ^{n×d}
- K = X·W_k ∈ ℝ^{m×d}
- V = X·W_v ∈ ℝ^{m×d}
- S = QKᵀ/√d ∈ ℝ^{n×m}
- A = softmax(S)，Y′ = AV

</details>

投影片先用翻譯當例子：m 是來源語言（「estoy llegando tarde」）的 token 數，n 是目標語言（「I am running late」）的 token 數。每個目標詞的注意力權重，就是它在所有來源詞上的機率分布。

換到 LDM：

- **query** 來自 UNet 的某一層
- **key、value** 來自文字編碼器對提示詞的表示
- m 是提示詞的 token 數；n 是潛在空間的維度，如果沒壓縮就是圖片的像素數
- 每個（潛在）像素的注意力權重，是它在提示詞 token 上的機率分布

投影片最後補一句：實際的 attention 和 cross-attention 都是 multi-head。

這個「每個像素都有一張看向各個字的分布」的視角，是後面 Prompt-to-Prompt 的基礎。

## Classifier-free guidance：讓生成更聽話

投影片的動機是一個取捨：diffusion 模型（不像 GAN）很會生成多樣的樣本，但加上條件後，這份多樣性可能讓生成偏離提示。[Classifier-free guidance](https://arxiv.org/abs/2207.12598)（CFG）就是用來拉回來的。

做法是讓同一個雜訊模型學兩種模式：有條件的 ε_θ(z_t, t, c)，以及把條件換成 null embedding ∅ 的 ε_θ(z_t, t, ∅)，兩者共用參數。取樣時把兩者組合：

<details>
<summary>投影片上的取樣演算法</summary>

1. w = 7.5
2. c = tokenize("a cat with green eyes")，c∅ = tokenize("")
3. z_T ∼ N(0, I)
4. 每一步：ε_θ ← (1 + w)·ε_θ(z_t, t, c) − w·ε_θ(z_t, t, c∅)，再照 DDPM 的公式算 z_{t−1}

</details>

投影片給的規則：w 越大，生成越符合條件，多樣性越低。後面兩頁放了 Ho & Salimans 論文的圖，guidance scale 從 0 升到 3 時，樣本越來越像該類別。

## Diffusion Transformer：不一定要 UNet

投影片的時間軸從 2015 年 UNet 用於醫學影像分割講起，一路到 DDPM 和 Dhariwal & Nichol 都用 UNet，大家「因為它好像有效」就繼續用。[DiT](https://arxiv.org/abs/2212.09748) 則說明其實不需要 UNet。

DiT 的骨幹基本上是一個略作修改的 ViT（見 [L5](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)）：

- **輸入**：雜訊潛在表示、時間步、類別標籤（或其他條件）
- **輸出**：固定大小的平均值與共變異數
- 最後一層 LayerNorm 之後，用線性層把 T 個 token embedding 轉成固定大小的輸出

### 條件怎麼注入：adaLN-Zero

投影片說 DiT block 裡最有意思的部分是怎麼依賴標籤。原論文試了四種：

1. in-context conditioning
2. cross-attention block
3. adaptive LayerNorm（adaLN）
4. 零初始化的 adaLN（adaLN-Zero）

實驗上 adaLN-Zero 最好。關鍵是學一個 MLP，輸出 LayerNorm 和殘差連接的 scale、shift 參數。

注意這跟 LDM 不同：LDM 用 cross-attention 讀條件，DiT 最好的版本用 adaLN。這個差別在 HW4 很重要。

### 用 GFLOPs 而不是參數量衡量規模

投影片先定義兩個指標：**GFLOPs** 是一次前向傳遞需要的計算量，和硬體無關；**FID** 把真實和生成圖片都送進預訓練的 Inception-v3，取中間層特徵、各自擬合成多變量高斯，再算兩個高斯的 Fréchet 距離，越低越好。

縮小 DiT 的 patch size 會增加 GFLOPs，但參數量不變。所以 DiT 研究的是 FID 和 GFLOPs 的關係。投影片在這裡留了一題：patch size 從 4 降到 2，總計算量增加多少？

規模化結果有三點：

1. GFLOPs 和 FID 強相關，計算量越多，FID 越好
2. 相同的訓練計算量下，大的 DiT 比小的 DiT 更有效率
3. 在相近的計算量下，DiT 也贏過 UNet 骨幹的 LDM（投影片比的是 LDM-4 與 DiT-XL/2）

## Prompt-to-Prompt：只改提示詞，也只改那一部分

### 為什麼需要它

投影片列了兩個舊做法的問題：

- **固定隨機種子、改提示詞**：最簡單的基準，但整張圖的結構可能大幅改變，感覺像生成一張無關的新圖，不像「編輯」
- **遮罩式編輯**（例如 [Blended Diffusion](https://arxiv.org/abs/2111.14818)）：用遮罩指定哪些區域不動，再讓文字決定未遮罩的部分怎麼改，但使用者得自己畫遮罩

[Prompt-to-Prompt](https://arxiv.org/abs/2208.01626) 的目標是只用文字編輯，不需要遮罩。

### 做法

前提是已經有一個預訓練好的 LDM，**完全不需要訓練，只改取樣方式**：

1. 編碼原提示詞 y，跑一次 diffusion，記下每一步的注意力權重 A_{T−1}, …, A_1
2. 編碼修改後的提示詞 y*，再跑一次 diffusion：
   - 重用原本那次的初始雜訊 z_T
   - 到時間步 τ 之前，用原本那次的注意力權重
   - 之後換成這次自己算的注意力權重
   - 不管用哪組權重，attend 的對象都是 y*
3. 如果在潛在空間跑，最後用 decoder 還原成圖片

投影片在這裡問了一個問題：為什麼要先用原本的注意力權重一段時間，才換成新的？答案寫在 inked 版上，我沒有轉錄。可以對照 Prompt-to-Prompt 那頁「改變切換時間點」的結果圖自己推推看。

### 形狀對不上怎麼辦

如果 y 和 y* 的長度不同，A_t 和 A*_t 的形狀就對不上。投影片的解法是只替換對應的部分：

- 潛在空間的維度固定不變
- 如果用固定長度的文字編碼器（例如 CLIP 的 77 個位置，不足補 `<PAD>`），提示詞那一維也固定
- 但字可能對不齊。投影片的例子：把「orange cat sitting」改成「big tabby cat sitting」，就把「orange」的注意力權重複製給「big」和「tabby」兩個位置

結果頁說明，逐字替換 cross-attention 會自動找出圖片裡哪些區域該保持不變、哪些該跟著改。除了換字，Prompt-to-Prompt 也支援降低某個描述詞的權重、插入片語改變風格或內容，不同編輯對應不同的 cross-attention 操作。

## L15 前半：Querying Transformer

### 從 PaliGemma 的線性投影說起

L15 先回顧 [上一篇](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm) 的 PaliGemma：SigLIP 影像 embedding 經過一層線性投影就送進 LLM，要怎麼利用它，全靠 LLM 自己學。接下來的三頁展示另一種接法。

### BLIP-2 的 Q-Former

[BLIP-2](https://arxiv.org/abs/2301.12597) 在凍結的影像編碼器和凍結的 LLM 之間，放一個輕量的 Querying Transformer，分兩階段預訓練：

**第一階段：視覺–語言表示學習。** Q-Former 輸入一組可學習的 query。query 之間做 self-attention，並透過 cross-attention（每隔一個 block 一次）讀取影像編碼器的輸出。三個目標同時最佳化，每個用不同的 self-attention 遮罩控制 query 和文字的互動：

| 目標 | 遮罩 |
|---|---|
| Image-Text Matching | 雙向 |
| Image-Grounded Text Generation | 多模態因果 |
| Image-Text Contrastive Learning | 單模態 |

**第二階段：視覺到語言的生成學習。** Q-Former 輸出的 query 經過一層全連接層，轉成 LLM 的輸入維度，接在文字前面送進凍結的 LLM。decoder 型 LLM（例如 OPT）直接生成文字；encoder-decoder 型 LLM（例如 FlanT5）則把前綴文字給 encoder，由 decoder 生成後綴。

投影片接著放了一整頁 zero-shot 指令式圖生文的例子。

### MetaQueries 與 Perceiver IO

- **[MetaQueries](https://arxiv.org/abs/2504.06256)**：投影片標題是「Simpler yet effective」。它把 learnable query 直接接到凍結的多模態 LLM 上，查出生成用的條件，再經過一個 connector 送進 diffusion 模型；只用配對資料的去噪目標訓練。圖上那句話是「Render unto diffusion what is generative, and unto LLMs what is understanding」
- **[Perceiver IO](https://arxiv.org/abs/2107.14795)**：投影片標為「Historical Note」。一個較小的 latent array 用 cross-attention 讀取任意大小的輸入，在潛在空間裡做大部分計算，再用 output query array 解碼成任意大小的輸出

三者的共同點是：**用固定數量的可學習 query，從長度不定的另一個模態裡抽出需要的資訊。**

### 這就是 HW4 要你做的

HW4 程式題（40 分）把 L14 和 L15 串起來。hw4.pdf 的設定：

- **GPT-2（凍結）**：把文字變成每個 token 的特徵
- **DiT（凍結）**：在 CIFAR-10 上預訓練的類別條件 diffusion transformer，原本用 adaLN 讀取類別 embedding
- **Q-Former（訓練）**：用 2–8 個可學習的 query，透過 cross-attention 讀 GPT-2 的隱藏狀態，輸出每一層的條件向量，取代 DiT 原本的類別 embedding

起始碼已經實作 CFG，訓練時以 0.1 的機率丟掉文字條件。作業最後要你看 cross-attention maps，判斷 Q-Former 從 LLM 裡抽出了什麼。細節見 [HW4 那篇](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)。

## 評量

講次表把 Quiz 4 排在 3 月 16 日，範圍是 L12 的文生圖部分到 L15，題目拿不到。

## 怎麼讀這兩講

1. 先把 cross-attention 的五行矩陣式和「翻譯」例子對起來，再看 LDM 那頁。n 和 m 分別代表什麼搞清楚了，Prompt-to-Prompt 的形狀問題就很直觀。
2. 讀 DiT 時，把 adaLN-Zero 和 LDM 的 cross-attention 並排比較：兩者都在注入條件，一個調 LayerNorm 的參數，一個讓影像去讀文字。
3. Q-Former 那幾頁只有圖，建議打開 BLIP-2 論文的 Figure 2，對照三種遮罩逐格看。

**今晚可以做的一件事**：寫下 Prompt-to-Prompt 的 `Edit(A_t, A*_t, t)` 函式在 t ≥ τ 和 t < τ 時各回傳什麼，再想想投影片那個問題：如果從第一步就用新的注意力權重，構圖會怎樣？

## 延伸閱讀

- DiT、VAE 與 latent diffusion 的實作練習：[MIT 6.S184 Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)、[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)
- 另一門課的 diffusion 講法：[CS231n：生成模型——Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)
- 存取等級 A0–A3 的定義：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

系列導覽：上一篇 [L12–L13：文生圖、latent diffusion 與視覺語言模型](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)｜下一篇 [HW4：用 Q-Former 做文生圖](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。確認登入牆屬實（匿名開啟 Panopto 資料夾無影片並提示登入），官方頁面也沒有公開 YouTube 版本，狀態維持不變。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L14（3 月 9 日）、L15（3 月 11 日）、Quiz 4 範圍
- [Lecture 14 投影片：Cross-Attention / Diffusion Transformer / Prompt-to-Prompt](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf)（[inked 版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p-ink.pdf)）
- [Lecture 15 投影片：Querying Transformer / Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [HW4 handout（hw4.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — 程式題的 GPT-2／DiT／Q-Former 設定
- [Ho & Salimans 2022：Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Peebles & Xie 2022：Scalable Diffusion Models with Transformers（DiT）](https://arxiv.org/abs/2212.09748)
- [Hertz et al. 2022：Prompt-to-Prompt Image Editing with Cross Attention Control](https://arxiv.org/abs/2208.01626)
- [Avrahami et al. 2021：Blended Diffusion for Text-driven Editing of Natural Images](https://arxiv.org/abs/2111.14818)
- [Li et al. 2023：BLIP-2](https://arxiv.org/abs/2301.12597)
- [Pan et al. 2025：Transfer between Modalities with MetaQueries](https://arxiv.org/abs/2504.06256)
- [Jaegle et al. 2021：Perceiver IO](https://arxiv.org/abs/2107.14795)
