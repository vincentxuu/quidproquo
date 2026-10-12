---
title: "Latent diffusion：文字與壓縮各做什麼｜CMU 10-423 第 12 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 18
draft: false
description: "以完整數值例子與變式答案理解Latent diffusion：文字與壓縮各做什麼。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 先把兩條資料流分開

[Latent diffusion](https://arxiv.org/abs/2112.10752)把去噪搬到壓縮後的空間，文字條件則告訴去噪器要生成什麼。兩者解決不同問題：autoencoder 減少空間成本，文字 encoder 表示提示語意。先備是[diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models)與[VAE](/posts/ai/2026-10-11-cmu10423-lecture-09-vae)。本篇讀完要能畫出訓練與生成兩條路，指出何時可拿到真實圖片。

訓練 autoencoder 時，encoder E 把圖片 x 壓成 z₀，decoder D 重建 D(E(x))。壓縮可能丟失細節，重建 loss 與正則化決定它保留什麼。之後 latent diffusion 通常固定 autoencoder，把 z₀ 加噪成 z_t，讓 εθ(z_t,t,c) 預測所加噪聲。文字 embedding c 進入去噪器，不是塞進 decoder 就自然獲得文字控制。

## 一張小圖片的形狀與數值

以下是自擬教學設定，不是特定產品規格。圖片為 32×32×3，encoder 下採樣四倍，latent 是 8×8×4。原始有 3072 個值，latent 有 256 個；空間位置減少 16 倍，但總值數因通道數不同只減少 12 倍。不能把「空間壓縮倍率」直接當成全部顯存或運算加速倍率。

取 latent 的一個座標 z₀=2，累積係數 ᾱ_t=0.64，噪聲 ε=−1。z_t=√0.64·2+√0.36·(−1)=1。文字條件是「一隻紅色小鳥」。若去噪器預測 ε̂=−0.5，該座標的噪聲平方誤差為 0.25；還原的 ẑ₀=(1−0.6·(−0.5))/0.8=1.625。這只是某個 timestep 的估計，不是完成的生成圖片，也不是說可以略過其他逆向步驟。

## 訓練見真圖，生成從噪聲開始

訓練時先取得真圖 latent，再抽 t 與 ε；同一張圖可在不同噪聲強度提供訊號。生成時沒有 z₀，先抽隨機 z_T，再沿採樣器的時間表反覆去噪，最後由 D 解碼。模型參數在生成期間通常不更新。每步是否加入隨機噪聲取決於採樣器，不能把一種 DDPM 步驟當成所有 diffusion 的唯一流程。

同一 seed、改文字 c，可以檢查條件是否作用；同一文字、改 seed，可以看生成多樣性。兩者都要控制採樣器與步數。若 encoder 重建已模糊小字，diffusion 很難只靠多跑幾步就保證恢復原始細字；autoencoder 的表示瓶頸與生成模型的品質需分別驗收。

## 文字條件還有其他設計

第 12 堂後半也放入其他文字生圖路線：自回歸 token 生成、影像 embedding 或像素空間擴散等。不能把所有文字生圖統稱為 LDM。Latent 是資料表示的選擇，diffusion 是生成學習與採樣方法，cross-attention 是條件注入手段；這三個維度可重新組合。下一篇[VLM](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)則反向問如何讀圖片，不是另一個文生圖採樣器。

## 變式練習與答案

若下採樣改成兩倍且 latent 仍有四通道，形狀為 16×16×4，共 1024 個值，僅比原圖少三倍。若噪聲預測精確為 −1，上例還原 ẑ₀=2。若生成程式先把真實目標圖片 encode 再開始，測的可能是重建或 image-to-image，不能當成純 text-to-image。驗收時明列輸入，才能知道模型到底完成什麼任務。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Primary paper](https://arxiv.org/abs/2112.10752)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
