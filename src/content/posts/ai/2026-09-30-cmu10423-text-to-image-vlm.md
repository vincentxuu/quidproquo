---
title: "CMU 10-423 L12–L13：文生圖、latent diffusion 與視覺語言模型"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, text-to-image, latent-diffusion, vision-language-model, clip]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 13
tldr: "CMU 10-423 用兩堂課把生成模型接上兩種模態。L12 後半講文字怎麼控制圖片：GAN、自迴歸（Parti）、diffusion（DALL-E 2、Imagen）三條路線，最後落在 latent diffusion——先把圖片壓進自編碼器的潛在空間，再在那裡跑 DDPM，用 cross-attention 讀提示詞。L13 反過來，讓語言模型讀圖：用 CLIP／SigLIP 或 VQ-VAE 把圖片變成向量或整數，送進 decoder-only Transformer；只讀不畫的 VLM（PaliGemma、Qwen-VL）和能輸出圖片的 VLM（LWM、Gemini）差在影像是不是離散 token。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 12 講後半與第 13 講導讀：條件式影像生成的任務、文生圖的三條技術路線、latent diffusion 的自編碼器／提示模型／cross-attention 設計與算力動機；視覺語言模型的任務、CLIP 對比損失與 SigLIP、PaliGemma 與 Qwen-VL 的架構與訓練、VQ-VAE 與 straight-through estimator，以及能同時輸出文字和圖片的 VLM。"
draft: false
glossary:
  - term: "VQ-VAE"
    definition: "Vector-Quantized VAE：編碼器輸出的每個向量被換成碼本裡最近的向量，所以圖片變成一串離散索引（影像 token），解碼器再把它還原成圖片。"
    context: "L13 用它說明 VLM 為什麼能把圖片當 token 生成。"
  - term: "SigLIP"
    definition: "CLIP 的變體，把對比損失裡的 softmax 換成逐對的 sigmoid，讓大 batch 分散到多台機器時不必交換整個相似度矩陣。"
    context: "PaliGemma 的影像編碼器。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 13 篇，進入「多模態基礎模型」單元。主要材料是 [Lecture 12 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)的後半（Conditional Image Generation 以後；前半的 DPO 在[第 11 篇](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)）和 [Lecture 13 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf)（另有 [inked 版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm-ink.pdf)）。L13 有不少頁標註「Slide from Henry Chai」。

錄影只放在 CMU 的 Panopto，校外看不到，所以本文只依投影片撰寫；inked 版上的手寫筆記我沒有逐字轉錄。講次表這兩講沒有列 readings。事實皆於 2026-09-30 打開官方材料核對。

上一篇 [HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2) 還在處理純文字的 LLM。這一篇回到 [L7](/posts/ai/2026-09-30-cmu10423-diffusion-models)、[L8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae) 的 diffusion，然後加上一個新問題：**文字要怎麼控制圖片生成，圖片又怎麼被語言模型讀懂？**

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## L12 後半：條件式影像生成

投影片先列出五種「給條件生成圖片」的任務：

- **Class-conditional**：給類別標籤，生成該類圖片。投影片的說法是，影像分類在學 p(y|x)，這個任務反過來學 p(x|y)
- **Super resolution**：從低解析度圖片重建高解析度版本
- **Image editing**：inpainting（補缺漏像素）、colorization（灰階上色）、uncropping（補出圖片外側）
- **Style transfer**：把一張圖的語意內容用另一張圖的風格呈現
- **Text-to-image**：給一段文字描述，生成符合的圖片

文生圖是這一講的主角。投影片用 Bie et al. (2023) 的時間軸，把技術路線分成三條。

### 路線一：GAN

條件式 GAN 的做法很直接：把標籤的 embedding 同時接到生成器和判別器的輸入。訓練方式跟 [L6](/posts/ai/2026-09-30-cmu10423-gans) 一樣，固定一邊、更新另一邊，輪流進行。投影片接著放了 Reed et al. (2016) 的文字生成圖片結果。

### 路線二：自迴歸（Parti）

[Parti](https://arxiv.org/abs/2206.10789) 把文生圖當成序列到序列的翻譯：

1. **影像 tokenization**：先預訓練 ViT-VQGAN，把圖片轉成一串離散的影像 token
2. **訓練**：文字提示進 encoder（預訓練 BERT），decoder 輸出影像 token 序列
3. **生成**：ViT-VQGAN 把生成的 token 還原成高品質圖片

這條路的好處是可以直接沿用語言模型的整套訓練方法。

### 路線三：Diffusion（DALL-E 2、Imagen）

- **DALL-E 2**：先預訓練 CLIP。文字編碼器訓練後凍結，影像編碼器只用來產生 CLIP 影像 embedding。接著訓練兩個 diffusion 模型：**prior** 根據 CLIP 文字 embedding 生成 CLIP 影像 embedding，**decoder** 再根據影像 embedding 生成圖片
- **Imagen**：一個文生圖 diffusion 模型接上 super-resolution diffusion 模型，全部在像素空間運作。投影片的評語是有效，但算力需求非常高

這句「算力需求非常高」就是下一節的起點。

## Latent Diffusion：把 diffusion 搬到潛在空間

### 動機

投影片列了在像素空間跑 diffusion 的代價。以 Guided Diffusion（Dhariwal & Nichol, 2021）為例，訓練要 150–1000 個 V100 天；推論也慢，同一個模型生成 5 萬張圖要在 A100 上跑 5 天。

[LDM](https://arxiv.org/abs/2112.10752) 的核心想法是：

1. 訓練一個自編碼器，學到一個在感知上等價於原圖、但維度低得多的潛在空間
2. 固定自編碼器，在真實圖片的潛在表示 `z₀ = encoder(x)` 上訓練 diffusion 模型
3. 生成時從雜訊 z_T 開始反向去噪到 z₀，再用 decoder 還原成圖片
4. 透過潛在空間裡的 cross-attention 讀取提示詞

### 三個元件

投影片把 LDM 拆成三塊，對應「提示空間、潛在空間、像素空間」：

| 元件 | 做什麼 | 怎麼訓練 |
|---|---|---|
| **自編碼器** | 把高維圖片（例如 1024×1024）壓到低維潛在空間，還能忠實還原 | 事先只用圖片訓練（不需要文字），然後凍結，之後所有 LDM 訓練都可以重用 |
| **提示模型 τθ** | 一個 Transformer LM，把提示詞變成表示 | 投影片寫的是和 diffusion 模型一起學 |
| **雜訊模型** | 帶 cross-attention 的 UNet，預測雜訊 | 和提示模型同時最佳化 |

自編碼器的部分，原論文試了兩類：類似 VAE、把潛在變數往高斯分布正則化的模型，以及在 decoder 裡做向量量化的 VQGAN。試過一整批選項後，選了壓縮率夠、資訊損失又不大的那個。

### Cross-attention 放在哪

LDM 的反向過程就是 [L7–L8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae) 的 DDPM，只是把 x 換成 z，並多一個條件 τθ(y)。投影片停在一個問題上：平均值 µθ(z_t, t, τθ(y)) 要怎麼依賴提示？

答案是 UNet 裡的 cross-attention：

- cross-attention 放在 UNet 內部一個較大的 Transformer 層裡
- **query 來自 UNet 當前這一層**
- **key 和 value 換成提示的表示**

訓練演算法跟 DDPM 幾乎一樣：隨機抽 t 和雜訊 ε，最小化 `‖ε − ε_θ(x_t, t, τθ(y))‖²`，唯一差別是雜訊預測多了提示這個輸入。cross-attention 的公式細節留到[下一篇](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)。

投影片對結果的總結：LDM 用少得多的參數拿到很好的 FID／IS，而且因為最貴的步驟在低維潛在空間進行，比原版 diffusion 有效率得多。

## L13：視覺語言模型

L13 開頭就把方向講清楚：文生圖是讓**生成圖片的模型**聽懂語言，輸出仍是圖片；VLM 是讓**生成文字的模型**看得懂圖片，輸出通常仍是文字。

投影片列的常見評測任務有四類：

- **Visual reasoning**：判斷一句描述對一張（或一對）圖片是否成立
- **Visual grounding**：依文字描述在圖中找到物體
- **Visual question answering**：回答關於圖片內容的開放式問題
- **Caption generation**：替圖片寫描述

架構的高階想法只有一句：把圖片和文字都轉成 embedding 向量，送進 decoder-only Transformer，做下一個 token 的預測。差別在圖片怎麼編碼，投影片給了兩種：**CLIP 編碼器**直接學連續 embedding，**VQ-VAE 編碼器**先把圖片變成離散 token 再查 embedding。

### CLIP：用對比學習對齊兩種模態

[CLIP](https://arxiv.org/abs/2103.00020) 有兩個編碼器：文字端是 encoder-only Transformer，影像端是 ResNet 類 CNN 或 ViT，兩邊都線性投影到同一個維度的多模態 embedding 空間。

投影片先給一個「直覺但錯誤」的目標：直接最大化配對的 cosine 相似度、減去所有不配對的相似度。接著給正確版本，也就是帶溫度 τ 的雙向 softmax 對比損失。

<details>
<summary>正確目標的兩種讀法</summary>

投影片把正確目標解讀成兩個條件分布：

- **Image-to-Text**：給定圖片 I_i，在 N 段文字裡挑出配對的那段（對欄做 softmax）
- **Text-to-Image**：給定文字 T_i，在 N 張圖片裡挑出配對的那張（對列做 softmax）

損失就是在這兩個分布下，最大化正確配對的 log-likelihood 總和。

</details>

同一套機率也能直接做 **zero-shot 分類**：把 N 個類別名稱當成 N 段文字，選機率最高的那個。

**SigLIP** 是針對規模的改良。CLIP 的 softmax 需要整個 batch 的相似度矩陣；batch 小到一台機器放得下時沒問題，但要分散到多台機器時就有通訊成本。SigLIP 把 softmax 換成逐對的 sigmoid，部分解決了這個問題。

### 只輸出文字的 VLM

- **PaliGemma**：SigLIP 影像編碼器接一層線性投影，把影像 embedding 放進和詞向量同一個高維空間，再交給 Gemma（2B 參數的 LLM）。投影片強調，**怎麼用這些影像 embedding，是 LLM 自己為了最大化正確回答的 likelihood 而學會的**
- **Qwen-VL**：示範訓練時常見的凍結策略——先凍結 LLM，讓影像 embedding 學會對齊詞向量空間；再全部解凍訓練一段；最後只凍結 ViT 影像編碼器
- **Llama 3.2 Vision**：投影片用它說明，VLM 和 LLM 一樣要在一整組圖文 benchmark 上評估

**解析度**是另一個設計點。原版 Qwen-VL 把每張圖縮到 448×448，轉成固定長度的 256 個 embedding，用絕對位置編碼。Qwen2-VL 改成支援動態解析度：ViT 仍以 28×28 的 patch 處理，所以長寬會被調整成 28 的倍數，位置編碼改成 2D-RoPE。

### VQ-VAE：讓圖片變成可以生成的 token

CLIP 的 embedding 是連續的，VLM 沒辦法自然地對它定義「生成圖片」的損失。要讓 VLM 也能畫圖，影像就得先變成離散 token，這就回到 Parti 用過的影像 tokenization。

[VQ-VAE](https://arxiv.org/abs/1711.00937) 的運作：

1. 碼本有 K 個 D 維向量，訓練中學出來；索引 1…K 就是「影像 token」
2. 編碼器（例如 ResNet 類 CNN）把圖片變成 N 個 D 維向量
3. 每個向量換成碼本裡最近的那一個
4. 解碼器用這些量化後的向量重建圖片

問題是第 3 步的 argmin 不可微。投影片的解法是 **straight-through estimator**：把對量化後向量的梯度，直接當成對編碼器輸出的梯度估計。兩者越接近，估計越準。

<details>
<summary>VQ-VAE 的目標函數在做什麼</summary>

投影片的直覺是兩個方向的拉力：碼本向量要靠近編碼器實際輸出的位置，編碼器也要「尊重」碼本、不要過擬合訓練資料。做法是在標準 VAE 目標外加兩個正則項，用 stop-gradient 運算子 sg 讓每一項只更新其中一方：一項只更新碼本，另一項（乘上 β）只更新編碼器。

</details>

投影片引用的原論文結果：ImageNet 上 128×128×3 的圖片被壓成 32×32×1 的索引（K=512），重建品質接近原圖。

投影片的小結：用 VQ-VAE 類編碼器的 VLM 可以對影像碼本 token 定義損失，所以能生成圖片；CLIP 類編碼器只能輸出文字，但 CLIP embedding 比離散碼更有表達力，在某些情境下表現更好。

### 能同時輸出文字和圖片的 VLM

- **Large World Model（LWM）**：先預訓練 VQGAN 影像 tokenizer／detokenizer，把資料裡所有圖片事先轉成離散 token，然後像訓練一般 LM 一樣訓練 Transformer；測試時遇到影像 token 序列就轉回圖片
- **Gemini**、**Qwen2.5-Omni**、**Qwen3-Omni**：投影片用它們示範「any-to-any」的方向。Qwen3-Omni 那頁列的輸入涵蓋文字、圖片、音訊與影片，輸出包括文字（含 Thinking 模式）與語音

## 這兩講和作業、評量的關係

- **HW4**（L12–L14）的書面題有 LDM（7 分）、VQ-VAE（8 分）、CLIP（4 分）和 VLM（18 分，以 PaliGemma2 為例）四大題，都直接對應本篇內容。程式題見 [HW4 那篇](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)
- **Quiz 4**（3 月 16 日）範圍是「L12 只含文生圖部分」到 L15，題目拿不到

## 怎麼讀這兩講

1. 先讀 L12 的「Latent Diffusion Model」動機頁（Motivation／Key Idea 兩欄）和那張橫跨提示、潛在、像素三個空間的全圖，再回頭看三條路線。知道終點在哪，前面的 GAN、Parti、DALL-E 2 才不會像一份模型清單。
2. L13 的 CLIP 正確目標那兩頁，自己用 N=3 的小矩陣寫一次欄 softmax 和列 softmax。對比損失只要算過一次就不會忘。
3. 最後比較 PaliGemma 和 LWM：一個把影像變成連續向量，一個變成整數 token。問自己，哪一個能直接拿來生成圖片？為什麼？

**今晚可以做的一件事**：打開 L12 投影片「LDM: Cross-Attention in Noise Model」那頁，用一句話寫下 query、key、value 各自從哪裡來。寫得出來，下一篇的 cross-attention 公式就只是把這句話翻成矩陣。

## 延伸閱讀

- Diffusion 與 latent diffusion 的數學和實作：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)、[Lab 3：DiT、VAE 與 latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)
- 另一門課怎麼講視覺語言模型：[CS231n：Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language)
- 存取等級 A0–A3 的定義：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

系列導覽：上一篇 [HW3：用 LoRA 微調 GPT-2](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2)｜下一篇 [L14–L15：Cross-attention、DiT、Prompt-to-Prompt 與 Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L12（2 月 23 日）、L13（2 月 27 日）、Quiz 4 範圍
- [Lecture 12 投影片：DPO / Text-to-image / Latent diffusion](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Lecture 13 投影片：Vision-language models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf)（[inked 版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm-ink.pdf)）
- [HW4 handout（hw4.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — 書面題配分
- [Bie et al. 2023：RenAIssance: A Survey into AI Text-to-Image Generation in the Era of Large Model](https://arxiv.org/abs/2309.00810) — 投影片的時間軸來源
- [Yu et al. 2022：Scaling Autoregressive Models for Content-Rich Text-to-Image Generation（Parti）](https://arxiv.org/abs/2206.10789)
- [Rombach et al. 2022：High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Radford et al. 2021：CLIP](https://arxiv.org/abs/2103.00020)
- [van den Oord et al. 2017：Neural Discrete Representation Learning（VQ-VAE）](https://arxiv.org/abs/1711.00937)
- [Beyer et al. 2024：PaliGemma](https://arxiv.org/abs/2407.07726)
- [Bai et al. 2023：Qwen-VL](https://arxiv.org/abs/2308.12966)
- [Liu et al. 2024：World Model on Million-Length Video And Language With Blockwise RingAttention（LWM）](https://arxiv.org/abs/2402.08268)
