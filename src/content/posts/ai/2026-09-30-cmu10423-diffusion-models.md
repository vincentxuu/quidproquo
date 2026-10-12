---
title: "擴散模型入門：加噪為何能成為生成的訓練題｜CMU 10-423 第 7 堂"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, diffusion-model, deep-learning]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 9
tldr: "GAN 用判別器取得生成訊號，擴散模型則先定義一個會逐漸破壞資料的過程，再學習反方向的條件分佈。"
description: "Spring 2026 公開課程材料教學：擴散模型入門：加噪為何能成為生成的訓練題｜CMU 10-423 第 7 堂"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-diffusion-models-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

GAN 用判別器取得生成訊號，擴散模型則先定義一個會逐漸破壞資料的過程，再學習反方向的條件分佈。聽起來像「把噪聲擦掉」，但只有說出前向看到甚麼、訓練預測甚麼、生成從哪裡開始，才算真的理解。本篇只處理加噪與噪聲預測；逆向均值與參數化留給下一堂。

先備是高斯亂數、平方誤差，以及第 6 堂的機率圖與條件分佈。圖片可以看成很多實數畫素的向量；以下先用一維訊號，避免 shape 掩蓋機制。所有數字都是本站自擬教學例子。

## 前向鏈有訊號縮放，也有隨機噪聲

一步前向過程是 xₜ=√αₜ xₜ₋₁+√(1−αₜ)εₜ，其中 αₜ=1−βₜ，εₜ 是標準高斯。它不是單純在 x 上加固定雜訊：舊訊號也被縮小，讓很多步之後分佈可以接近標準高斯。

設 x₀=2、α₁=α₂=0.8，本次抽到 ε₁=1、ε₂=−1。第一步 x₁=√0.8×2+√0.2×1≈2.2361；第二步 x₂=√0.8×2.2361−√0.2≈1.5528。單次數值不必單調接近零：噪聲可能正也可能負，前向分佈的訊號佔比與個別路徑的數值是不同的概念。

展開兩步：x₂=0.8x₀+0.4ε₁+√0.2 ε₂。因為兩個噪聲獨立，總噪聲方差是 0.16+0.2=0.36；訊號係數是 0.8。因此條件分佈可直接寫成 x₂=0.8x₀+0.6ε，ε 仍是標準高斯。

這次路徑的有效 ε=(1.5528−1.6)/0.6≈−0.0787。它不是第二步抽到的 −1，而是前兩步噪聲的加權合成。把逐步 εₜ 跟閉式公式的一個總 ε 混用，會造成錯誤的訓練標籤。

## 任意時間點都可以直接取樣

定義 ᾱₜ=α₁⋯αₜ，閉式前向取樣為 xₜ=√ᾱₜ x₀+√(1−ᾱₜ)ε。這來自線性高斯鏈的展開，不需要真的從 x₀ 跑到第 t 步才取得一筆訓練輸入。前例 ᾱ₂=0.64，所以係數就是 0.8 與 0.6。

時間 t 不能省略。相同 xₜ 數值可能在不同噪聲尺度出現，去噪網路需要知道目前的 signal/noise 比例。實際模型通常把 t 編成 embedding，送進網路不同層。

## 噪聲預測怎麼形成 loss

訓練時從資料取 x₀、抽 t、抽 ε，用公式建構 xₜ。網路 εθ(xₜ,t) 預測此次加進去的總噪聲。以原始 DDPM 常用的 simplified MSE 為例，loss 是 ε 與 εθ 的平方差；batch 與畫素上通常再取平均。這是對論文目標的介紹，作業 2 的指定實作另有 L1 loss，不能照抄 MSE 取代作業規範。

用 x₀=2、ᾱₜ=0.64、ε=1，得到 xₜ=2.2。若網路預測 εθ=0.5，一維 MSE 為 (1−0.5)²=0.25。若預測變成 1，這筆噪聲 loss 為零。訓練標籤容易取得，因為噪聲由我們自己抽出，不需要人工標註每張噪聲圖的答案。

但是同一個 noisy value 可能由不同 x₀ 與 ε 形成，網路不可能僅憑一個數值辨認每次真實來源。平方損失的最優預測與條件期望有關；一筆自擬例子的零誤差不代表所有樣本都能完美還原。

## 生成與訓練的起點不同

訓練知道 x₀，才能製造噪聲與標籤。生成時沒有乾淨目標圖片，而是從近似標準高斯的 x_T 開始，多次使用學到的逆向分佈產生 xₜ₋₁。它不是把某張訓練圖加噪後再還原，就算完成無條件生成。

生成的噪聲預測也不等於知道當初真實加了甚麼；在沒有 x₀ 的情況下，模型提供與資料分佈相符的逆向訊號。取樣步數、噪聲日程與模型誤差都影響結果。下一篇會把「預測噪聲」轉成「逆向均值」，避免把簡單相減誤當完整 DDPM。

## 變式題與答案

固定 x₀=2、ᾱ=0.64，把 ε 改成 −1，xₜ=1。若網路仍預測 0.5，MSE=2.25；若它預測 −1，loss=0。資料來源與時間相同，也必須配合這次抽到的噪聲。

兩步例子若 α₁=0.9、α₂=0.8，ᾱ₂=0.72，訊號係數約 0.8485，總噪聲標準差約 0.5292。不是把 0.1 和 0.2 直接相加當成 0.3 的總噪聲方差。能算出這兩個係數，就能接下一堂的訓練與取樣資料流。

[上一篇](/posts/ai/2026-09-30-cmu10423-gans)｜[下一篇](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Lecture 7 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf)
- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [Nonequilibrium Thermodynamics](https://arxiv.org/abs/1503.03585)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Lecture 8 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW2 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models（NeurIPS 2020）](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html)
