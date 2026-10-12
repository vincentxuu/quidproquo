---
title: "DPO 與 latent diffusion：偏好如何更新模型，文字如何控制去噪｜CMU 10-423 第 12 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 15
draft: false
description: "推導 DPO loss 並重算數值例子，再追 latent diffusion 的形狀與條件路徑"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

第 12 堂前後兩半處理兩個不同的問題。前半接續第 11 堂的偏好訓練：DPO 怎麼不經 reward model 與強化學習，直接用偏好對更新語言模型。後半轉到文字生圖：latent diffusion 怎麼把去噪搬到壓縮空間，再用文字控制生成。兩半的共同點是都要分清「哪個模組在學、拿什麼當訓練訊號」。

## DPO：偏好對如何直接更新語言模型

### 把兩階段流程改寫成一個 loss

先備是第 11 堂的[SFT 與 RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf)：偏好對不是示範回答，reference 也不是每步一起更新的 policy。[DPO 論文](https://arxiv.org/html/2305.18290v3)從帶 KL 懲罰的獎勵最大化出發，將 reward 以 policy/reference 的機率比重寫，直接對偏好資料訓練 policy。這一部分要算出一筆 loss，並分清「相對 reference 更偏好」與「絕對機率較高」。

固定 prompt x，令 y_w 是較受偏好的完整回答、y_l 是另一個回答。對獎勵 r 的理想 policy 是 π*(y|x)=π_ref(y|x)exp(r(x,y)/β)/Z(x)。取 log 並整理，得到 r=β log(π*/π_ref)+β log Z(x)。這個閉式解仍含難算的 Z，不能宣稱任意 reward model 都能直接照公式生成。

### 為什麼 Z 可以不算

Bradley–Terry 模型只看同一 prompt 下的 reward 差。把上述式子代入 r_w−r_l，兩邊的 β log Z(x) 抵消。定義 s=β[(log πθ(y_w|x)−log π_ref(y_w|x))−(log πθ(y_l|x)−log π_ref(y_l|x))]，DPO 單筆 loss 是 −log σ(s)。這是以政策參數表示的偏好 likelihood，不是把人類標籤直接當 reward 數值。

Reference 必須在訓練時固定。兩個 sequence log probability 都是在各自回答的 prefix 下，把回答 token 的 log probability 相加；prompt 與 padding 排除，EOS 政策保持一致。若任意改成平均 log probability，便改了目標的長度行為，不能仍說完全是原式。

### 一筆可重算的數值例子

以下是自擬教學例子。Reference 給 winner 的機率 0.2、loser 0.1；policy 給 winner 0.3、loser 0.1，β=0.5。winner 相對增幅為 1.5，loser 為 1，因此 s=0.5 log(1.5)=0.2027。σ(s) 約 0.5505，loss 約 0.5969，低於初始相同 policy/reference 時的 log 2≈0.6931。這表示模型較符合該筆偏好，不是說 winner 的完整生成機率變成 55%。55% 是偏好模型對這一對回答的勝率。

再看一個反例：reference 的 winner/loser 機率是 0.4/0.1，policy 是 0.3/0.15。雖然 winner 絕對機率仍較高，相對增幅卻是 0.75/1.5，s=0.5 log(0.5)=−0.3466，loss 約 0.8814。模型相對 reference 更偏向 loser，不能只比較 0.3 與 0.15 就宣布改善。

### 梯度說了什麼，也沒有說什麼

對 s 的導數是 σ(s)−1。當 s 很負，梯度幅度大；已很正時，權重變小。對 log 機率差的梯度傾向增加 winner 相對 loser 的比例。共享參數與其他訓練例子會互相影響，所以不能保證一步後每個 loser token 的無條件機率全部下降。

DPO 的推導依賴 KL 正則化、reference 支援與所選偏好模型等條件。離線偏好資料只涵蓋有限回答，沒有消除標註偏誤或事實錯誤；β 也不是「越大越好」。實作應分開監看 loss、相對 log-ratio、獨立偏好評估與原能力退化。

### 變式練習與答案

若 policy 與 reference 完全相同，s=0，loss=log 2，不論這對回答的絕對機率如何。若 winner 與 loser 都相對增加兩倍，增幅抵消，loss 也不變。若把兩份回答分別配到不同 prompt，Z 就未必能抵消，因此資料列必須維持同一 prompt 的成對比較。用[作業 3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2)的自擬驗收，進一步分開調適機制與偏好目標。

## Latent diffusion：文字與壓縮各做什麼

### 先把兩條資料流分開

[Latent diffusion](https://arxiv.org/abs/2112.10752)把去噪搬到壓縮後的空間，文字條件則告訴去噪器要生成什麼。兩者解決不同問題：autoencoder 減少空間成本，文字 encoder 表示提示語意。先備是[diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models)與[VAE](/posts/ai/2026-10-11-cmu10423-lecture-09-vae)。這一部分讀完要能畫出訓練與生成兩條路，指出何時可拿到真實圖片。

訓練 autoencoder 時，encoder E 把圖片 x 壓成 z₀，decoder D 重建 D(E(x))。壓縮可能丟失細節，重建 loss 與正則化決定它保留什麼。之後 latent diffusion 通常固定 autoencoder，把 z₀ 加噪成 z_t，讓 εθ(z_t,t,c) 預測所加噪聲。文字 embedding c 進入去噪器，不是塞進 decoder 就自然獲得文字控制。

### 一張小圖片的形狀與數值

以下是自擬教學設定，不是特定產品規格。圖片為 32×32×3，encoder 下採樣四倍，latent 是 8×8×4。原始有 3072 個值，latent 有 256 個；空間位置減少 16 倍，但總值數因通道數不同只減少 12 倍。不能把「空間壓縮倍率」直接當成全部顯存或運算加速倍率。

取 latent 的一個座標 z₀=2，累積係數 ᾱ_t=0.64，噪聲 ε=−1。z_t=√0.64·2+√0.36·(−1)=1。文字條件是「一隻紅色小鳥」。若去噪器預測 ε̂=−0.5，該座標的噪聲平方誤差為 0.25；還原的 ẑ₀=(1−0.6·(−0.5))/0.8=1.625。這只是某個 timestep 的估計，不是完成的生成圖片，也不是說可以略過其他逆向步驟。

### 訓練見真圖，生成從噪聲開始

訓練時先取得真圖 latent，再抽 t 與 ε；同一張圖可在不同噪聲強度提供訊號。生成時沒有 z₀，先抽隨機 z_T，再沿採樣器的時間表反覆去噪，最後由 D 解碼。模型參數在生成期間通常不更新。每步是否加入隨機噪聲取決於採樣器，不能把一種 DDPM 步驟當成所有 diffusion 的唯一流程。

同一 seed、改文字 c，可以檢查條件是否作用；同一文字、改 seed，可以看生成多樣性。兩者都要控制採樣器與步數。若 encoder 重建已模糊小字，diffusion 很難只靠多跑幾步就保證恢復原始細字；autoencoder 的表示瓶頸與生成模型的品質需分別驗收。

### 文字條件還有其他設計

第 12 堂後半也放入其他文字生圖路線：自回歸 token 生成、影像 embedding 或像素空間擴散等。不能把所有文字生圖統稱為 LDM。Latent 是資料表示的選擇，diffusion 是生成學習與採樣方法，cross-attention 是條件注入手段；這三個維度可重新組合。第 13 堂的[VLM](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)則反向問如何讀圖片，不是另一個文生圖採樣器。

### 變式練習與答案

若下採樣改成兩倍且 latent 仍有四通道，形狀為 16×16×4，共 1024 個值，僅比原圖少三倍。若噪聲預測精確為 −1，上例還原 ẑ₀=2。若生成程式先把真實目標圖片 encode 再開始，測的可能是重建或 image-to-image，不能當成純 text-to-image。驗收時明列輸入，才能知道模型到底完成什麼任務。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Primary paper](https://arxiv.org/abs/2305.18290)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Primary paper](https://arxiv.org/abs/2112.10752)
