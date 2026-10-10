---
title: "MIT 6.5940 L18 高效 Diffusion 模型：步數、解析度、每一步的算力，三個地方都能省"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, diffusion, efficient-ml, quantization]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 21
tldr: "Diffusion 慢，是因為同一個大網路要從純雜訊一路跑幾十到上千步。L18 先把 DDPM、條件生成、latent diffusion、SDEdit、DreamBooth 講完，再分三條路加速：少跑幾步（DDIM 跳步、progressive distillation 每輪把步數減半）、每步少算（DC-AE 把圖壓 64 倍、只重算被編輯的 1.7% 區域省 8.2 倍 MACs、SVDQuant 把 FLUX 壓到 4-bit）、多卡分攤（DistriFusion 8 張 A100 最多快 6.1 倍）。"
description: "MIT 6.5940 Fall 2024 第 18 講 Diffusion Model 導讀：DDPM 的前向加噪與反向去噪、三種條件注入方式與 classifier-free guidance、latent diffusion 與 DC-AE／Sana、SDEdit 與 DreamBooth，接著是 DDIM、progressive distillation、SIGE 空間稀疏推論、SVDQuant 4-bit 量化與 DistriFusion 多 GPU 平行。"
draft: false
glossary:
  - term: "classifier-free guidance"
    aliases: ["CFG", "無分類器引導"]
    definition: "同一個 diffusion 模型每一步同時做有條件與無條件兩次預測，再用 (ω+1)ε(x,t,c) − ωε(x,t) 合成，ω 越大越貼條件、多樣性越低。不必另外訓練分類器，代價是每步算力加倍。"
    context: "MIT 6.5940 L18 投影片第 32–35 頁。"
  - term: "DDIM"
    aliases: ["Denoising Diffusion Implicit Models"]
    definition: "沿用 DDPM 訓練好的模型與損失，換成一個非馬可夫的前向過程，讓取樣變成確定性，並可以只在時間步的子序列上取樣（例如每 10 步取一次），大幅減少步數。"
    context: "MIT 6.5940 L18 投影片第 65–70 頁，出自 Song et al., ICLR 2021。"
  - term: "latent diffusion"
    aliases: ["潛空間擴散", "LDM"]
    definition: "先用預訓練的自編碼器把圖片壓成較小的 latent，diffusion 只在 latent 上加噪與去噪，最後再解碼回圖片。Stable Diffusion 系列都是這個架構。"
    context: "MIT 6.5940 L18 投影片第 37–39 頁，出自 Rombach et al., CVPR 2022。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 18 講（2024-11-07），主要材料是 [Lec18-Diffusion-Models.pdf](https://www.dropbox.com/scl/fi/f4end70haytw1nalboxp2/Lec18-Diffusion-Models.pdf?rlkey=emaxca812n2npb2rinq1nor64&st=ed3ziw4o&dl=0)（91 頁）與 [課堂錄影](https://youtu.be/LXrqmQrscf0)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影公開；這講沒有對應 lab，拿不到的只有 Canvas 與 Piazza。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)把 Diffusion 擴成兩講（Part I 11 月 10 日、Part II 11 月 12 日），並拿掉 F24 的 GAN／Video／Point Cloud 講。截至 2026-09-30 兩講的投影片與錄影都還是空連結。

**系列位置**：上一篇 [L16–L17 高效視覺模型：ViT、GAN、影片與點雲](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud)｜下一篇 [L19–L20 分散式訓練](/posts/ai/2026-09-30-mit-65940-distributed-training)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

想像你在筆電上用 Stable Diffusion 改一張照片，只想把角落的一匹馬塗掉。按下生成之後，模型會把整張圖從雜訊開始重畫四十遍，即使你只動了不到 2% 的像素。這一講問的就是：這些計算有多少是浪費的？

第 6 頁的 Lecture Plan 分三段。第一段是 diffusion 基礎：DDPM、條件生成、latent diffusion、影像編輯、個人化。第二段是快速取樣：DDIM 與 distillation。第三段是加速技巧：sparsity、quantization、parallelism。前兩段在其他課也講得到，第三段幾乎都是 MIT HAN Lab 自己的研究，是這門課獨有的部分。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=LXrqmQrscf0
title: EfficientML.ai Lecture 18 - Diffusion Models (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 18 - Diffusion Models (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=LXrqmQrscf0)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

## 先搞懂為什麼慢：DDPM 的兩個過程

第 9–18 頁講 [DDPM（Ho et al., NeurIPS 2020）](https://arxiv.org/abs/2006.11239)。它有兩個方向相反的過程：

- **前向過程（固定）**：對資料一步一步加一點高斯雜訊，加到第 T 步變成接近純雜訊。
- **反向過程（學出來）**：訓練一個網路，從雜訊一步一步去噪，還原出資料。

訓練很便宜。第 14–15 頁推導出前向過程有封閉解，可以從 x₀ 一步直接跳到任意 xₜ，所以每次只要隨機抽一個 t、加上對應的雜訊，讓網路預測「剛才加了什麼雜訊」，用 MSE 算損失（第 17 頁）。

取樣很貴。第 18 頁的取樣演算法是一個從 T 倒數到 1 的迴圈，**每一步都要跑一次完整的網路**。後面所有加速方法，都在對付這個迴圈：要不讓它少轉幾圈，要不讓每一圈便宜一點，要不讓好幾張卡一起轉。

<details>
<summary>前向過程的封閉解（第 14–15 頁）</summary>

每一步 q(xₜ | xₜ₋₁) = 𝒩(xₜ; √(1−βₜ) xₜ₋₁, βₜI)，βₜ 是預先定好的小數，控制加噪速度。

定義 αₜ = 1 − βₜ、ᾱₜ = α₁α₂…αₜ，把兩個獨立高斯相加仍是高斯這件事一路遞推，得到：

q(xₜ | x₀) = 𝒩(xₜ; √ᾱₜ x₀, (1 − ᾱₜ)I)

取樣時 xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε，ε ~ 𝒩(0, I)。βₜ 的設計讓 ᾱ_T 趨近 0，所以 x_T 近似標準高斯。
</details>

## 條件生成：把「貓」或一句話塞進網路

第 21 頁把條件分成三類，每類有不同的注入方式：

| 條件類型 | 例子 | 注入方式（頁碼） |
|---|---|---|
| 純量 | 類別 ID「cat」 | 編碼後廣播加到 feature map（22）；或用 adaptive normalization 產生 scale 與 bias（23） |
| 文字 | 「photo of a moon gate」 | cross attention，image 當 Q、text 當 K/V（24）；SD3 的 joint attention（25）；Black Forest Labs 的單一 self attention（26） |
| 像素 | 語意圖、Canny 邊緣 | ControlNet：複製一份 downsample 階段接條件，用零初始化的 1×1 卷積接回原網路（27–29） |

條件放進去之後，還要決定「多聽條件的話」。第 30–31 頁的 classifier guidance 另外訓練一個分類器，把它的梯度加進取樣；ω 從 1 調到 10，FID 從 33.0 降到 12.0，品質變好但多樣性下降。缺點是只能用在類別條件，而且要多訓練一個網路。

第 32–35 頁的 [classifier-free guidance（Ho & Salimans）](https://arxiv.org/abs/2207.12598) 用貝氏定理把分類器消掉，改成同一個模型做有條件、無條件兩次預測再合成。它能用在任何條件形式，也不用多訓練網路。第 34 頁在演算法旁邊標了一句 **double the FLOPs**：每一步的算力直接翻倍。這是這門課的視角，其他課講 CFG 通常只談品質。

## Latent diffusion：先把圖縮小再做

第 37–39 頁的 [latent diffusion（Rombach et al., CVPR 2022）](https://arxiv.org/abs/2112.10752) 是第一個真正的效率招：用預訓練的 VAE 把圖片壓成較小的 latent，diffusion 只在 latent 上跑，最後再解碼。投影片的總結是「simpler denoising, faster synthesis」。

HAN Lab 的下一步是壓得更狠。第 41–45 頁的 [DC-AE](https://arxiv.org/abs/2410.10733) 把空間壓縮從 SD-VAE 的 8 倍推到 64 倍。第 42 頁坦白說難點：空間壓縮率越高，自編碼器越難訓練，SD-VAE 在高壓縮率下重建品質會崩。DC-AE 用兩招解決：residual autoencoding（在 space-to-channel 轉換上加捷徑，第 43 頁）與分三階段的 decoupled high-resolution adaptation（第 44 頁）。

第 46–50 頁的 [Sana](https://arxiv.org/abs/2410.10629) 把這些拼起來：DC-AE、linear attention 的 DiT、用小型 LLM 當文字編碼器，訓練時用多個 VLM 重新寫 caption、依 CLIP score 挑選（第 49 頁）。第 50 頁的逐項拆解最值得看：

| 在 Sana baseline 上逐項加入 | 4096×4096 生成延遲（A100） |
|---|---|
| Sana baseline | 469 秒 |
| ＋DC-AE | 41 秒（11.4×） |
| ＋Linear DiT | 24 秒 |
| ＋Kernel fusion | 21 秒 |
| ＋Flow DPM-Solver | 9.6 秒 |

對照組 Flux-dev 是 1023 秒，所以標題寫 106 倍。1024×1024 時差距縮成 25 倍（0.9 秒對 23.0 秒）。最大的一刀來自自編碼器，不是 DiT 本身。

## 編輯與個人化：兩個會用到加速的應用

第 54–57 頁的 [SDEdit](https://arxiv.org/abs/2108.01073) 做筆觸編輯：在使用者塗過的圖上加一部分雜訊，再用反向過程去噪，得到自然的結果。記住這個場景，後面 SIGE 就是針對它加速。

第 59–61 頁的 [DreamBooth](https://arxiv.org/abs/2208.12242) 做個人化：給幾張特定物體的照片和類別名稱，微調文字生圖模型，讓它學會一個專屬識別詞（例如「a [V] clock」），之後可以把這個物體放進各種情境。第 61 頁點出限制：**一個微調模型只對應一個物體**。

## 少跑幾步：DDIM 與 progressive distillation

第 65–70 頁的 [DDIM（Song et al., ICLR 2021）](https://arxiv.org/abs/2010.02502) 從一個觀察出發：DDPM 訓練時只用到兩個東西，一是 q(xₜ | x₀) 這個 diffusion kernel，二是預測雜訊的損失。那能不能換一個**非馬可夫**的前向過程，保留這兩個東西，但反向過程不必一步一步走？

答案是可以。DDIM 的每一步先從目前的 xₜ 估出 x̂₀，再直接算出下一個時間點的 x，取樣變成確定性（第 68 頁）。既然不必相鄰，就可以只在子序列上走，例如 τ = [0, 10, 20, …, 1000]（第 69 頁）。關鍵是**不用重新訓練**，拿 DDPM 的模型直接換取樣器。第 70 頁補一句原因：DDPM 的反向高斯假設只在 βₜ 很小時成立，DDIM 不依賴這個假設；同頁也列出 DPM-Solver 等更新的取樣器。

第 72–73 頁的 [progressive distillation（Salimans & Ho, ICLR 2022）](https://arxiv.org/abs/2202.00512) 再往前一步：每一輪讓學生模型用一步學會老師的兩步，下一輪學生變老師。每輪步數減半。

## 每步少算：只重算改過的地方

回到開頭那匹馬。第 76 頁的數字：只編輯 1.7% 的區域，原版 Stable Diffusion 每步還是 1855G MACs、跑 40 步。沒被編輯的區域，feature map 幾乎不變。

[SIGE（Li et al., NeurIPS 2022）](https://arxiv.org/abs/2211.02048) 的做法是快取原圖的 activation，只對有變動的區塊重算，每步降到 225G MACs，少 8.2 倍。第 77 頁列出實作重點：用 tiling 的卷積只更新 active blocks，自己寫 gather／scatter，再做 kernel fusion 降低額外開銷。

MACs 少了，延遲不一定跟著少，所以第 78 頁在 RTX 3090 上量了真實延遲：

| 任務 | 改動比例 | MACs | 延遲 |
|---|---|---|---|
| 原版 Stable Diffusion | — | 1855G | 369ms |
| Inpainting | 11.6% | 514G（3.6×） | 95.0ms（3.9×） |
| SDEdit 編輯 | 2.9% | 353G（5.3×） | 76.4ms（4.8×） |

這跟 [L3 pruning](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria) 的教訓一樣：稀疏要變成加速，需要專門的 kernel。第 79 頁還展示了在 MacBook Pro（M1 Pro GPU）上的互動 demo。

## 每步少算：4-bit 的 diffusion

第 81–84 頁的 [SVDQuant](https://arxiv.org/abs/2411.05007) 把 diffusion 的權重與 activation 都壓到 4-bit。難點和 LLM 一樣是 outlier。[L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)講過 SmoothQuant 的思路：把 activation 的 outlier 搬到權重上。第 81 頁指出，搬完之後權重變得難量化。SVDQuant 再加一步：用 SVD 分出一條低秩分支（rank 32，保持 16-bit），吸收權重的大值，剩下的殘差就好量化了。

低秩分支會多出額外的記憶體存取，所以第 82 頁把它和 4-bit 運算融合進同一組 kernel。第 83 頁的結論是 3.5 倍加速、3.6 倍記憶體節省；第 84 頁展示量化後的 FLUX.1-dev 還能直接套用既有的 LoRA 風格。

## 多卡分攤：DistriFusion

最後一段（第 86–90 頁）處理單張高解析度圖的延遲。時間步之間有先後依賴，沒辦法平行；[Megatron-LM](https://arxiv.org/abs/2104.04473) 式的 tensor parallelism 又因為 activation 太大，通訊成本太高（第 86 頁）。

[DistriFusion](https://arxiv.org/abs/2402.19481) 把圖切成 patch，每張卡負責一塊。切開後 patch 之間還需要彼此的資訊，而它的觀察是**相鄰時間步的輸入非常相似**（第 87 頁）。所以每張卡直接用上一步的 activation 來做 patch 之間的互動，通訊改成非同步，和計算重疊（第 88 頁）。

第 89 頁的比較很有說服力。原版 1 張 GPU 要 12.3 秒。樸素的 4 卡切 patch 只要 3.14 秒，但會畫出重複的主體；DistriFusion 4 卡 4.16 秒（快 3.0 倍），沒有這個瑕疵。第 90 頁在 A100 上量到，解析度越高 GPU 利用率越好，3840×3840 時 8 張卡最多快 6.1 倍。

## 讀完這講可以做什麼

- **今晚能做的事**：拿你手上任何 diffusion pipeline，把 scheduler 換成 DDIM，步數從 1000 砍到 50，比較同一個 seed 的結果和耗時。你會直接感受到第 69 頁的跳步不需要重新訓練。
- 再試一次把 guidance scale 設成 1（等於關掉 CFG），看每步時間是否接近減半。這就是第 34 頁那句 double the FLOPs。
- 想看 diffusion 為什麼能生成、flow matching 與 score matching 的理論：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)，CFG 的推導在 [6.S184 Lecture 3b](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)，latent 空間與 DiT 在 [Lecture 4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)。

## 延伸閱讀

- Diffusion 入門視角：[CS231N L14：Diffusion 為什麼加噪再去噪就能生成圖片](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)
- 同一套 outlier 問題在 LLM 上的解法：[L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)、[L6 PTQ 與 QAT](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L18 日期、投影片與錄影連結
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Diffusion 擴成 Part I／II，材料未放出
- [Lec18-Diffusion-Models.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/f4end70haytw1nalboxp2/Lec18-Diffusion-Models.pdf?rlkey=emaxca812n2npb2rinq1nor64&st=ed3ziw4o&dl=0) — 本文所有頁碼與數字的出處
- [EfficientML.ai Lecture 18 - Diffusion Models（YouTube）](https://youtu.be/LXrqmQrscf0)
- [Ho et al., Denoising Diffusion Probabilistic Models（NeurIPS 2020）](https://arxiv.org/abs/2006.11239)
- [Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Rombach et al., High-Resolution Image Synthesis with Latent Diffusion Models（CVPR 2022）](https://arxiv.org/abs/2112.10752)
- [Chen et al., DC-AE: Deep Compression Autoencoder for Efficient High-Resolution Diffusion Models](https://arxiv.org/abs/2410.10733)
- [Xie et al., Sana: Efficient High-Resolution Image Synthesis with Linear Diffusion Transformer](https://arxiv.org/abs/2410.10629)
- [Meng et al., SDEdit（ICLR 2022）](https://arxiv.org/abs/2108.01073)
- [Ruiz et al., DreamBooth](https://arxiv.org/abs/2208.12242)
- [Song et al., Denoising Diffusion Implicit Models（ICLR 2021）](https://arxiv.org/abs/2010.02502)
- [Salimans & Ho, Progressive Distillation for Fast Sampling of Diffusion Models（ICLR 2022）](https://arxiv.org/abs/2202.00512)
- [Li et al., Efficient Spatially Sparse Inference for Conditional GANs and Diffusion Models（NeurIPS 2022）](https://arxiv.org/abs/2211.02048) — SIGE
- [Li et al., SVDQuant: Absorbing Outliers by Low-Rank Components for 4-Bit Diffusion Models](https://arxiv.org/abs/2411.05007)
- [Li et al., DistriFusion: Distributed Parallel Inference for High-Resolution Diffusion Models](https://arxiv.org/abs/2402.19481)
- [Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM（SC 2021）](https://arxiv.org/abs/2104.04473)
