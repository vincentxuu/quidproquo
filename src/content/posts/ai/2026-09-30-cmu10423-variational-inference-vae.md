---
title: "擴散與VAE：機率目標相連，生成流程不同｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, vae, variational-inference, elbo, diffusion-model]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 41
tldr: "擴散與VAE都能用機率模型的觀點理解，但「都有潛在變量」不代表它們是同一套生成流程。擴散把噪聲步驟串成鏈；VAE用encoder近似latent的後驗，decoder從latent重建資料。這篇是關係導覽，原第8–9堂的教學已拆成各自可檢核的內容。"
description: "擴散與VAE都能用機率模型的觀點理解，但「都有潛在變量」不代表它們是同一套生成流程。擴散把噪聲步驟串成鏈；VAE用encoder近似latent的後驗，decoder從latent重建資料。這篇是關係導覽，原第8–9堂的教學已拆成各自可檢核的內容。"
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower BOund", "證據下界"]
    definition: "ELBO(q) = E_q[log p(x, z)] − E_q[log q(z | x)]。log p(x) 與 ELBO 的差是 KL(q(z | x) ‖ p(z | x))；固定生成模型 p、只最佳化 q 時，最大化 ELBO 等於最小化此後驗 KL。VAE 同時訓練 p 與 q 時，log p(x) 也會改變，不能只用 KL 等價解釋整個訓練。"
    context: "10-423 L9 用它訓練 VAE，L8 用它推導 DDPM 的目標函數。"
  - term: "reparameterization trick"
    aliases: ["重參數化技巧"]
    definition: "把 z ~ N(μ_φ(x), σ_φ(x)²) 改寫成 z = μ_φ(x) + σ_φ(x) ⊙ ε、ε ~ N(0, I)，讓隨機性只來自與參數無關的 ε，梯度就能穿過 z 傳回編碼器。"
    context: "L9 用來降低 VAE 梯度估計的變異數；L7 的 x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε 是同一招。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

擴散與VAE都能用機率模型的觀點理解，但「都有潛在變量」不代表它們是同一套生成流程。擴散把噪聲步驟串成鏈；VAE用encoder近似latent的後驗，decoder從latent重建資料。這篇是關係導覽，原第8–9堂的教學已拆成各自可檢核的內容。

## 先讀哪一篇

- [擴散入門](/posts/ai/2026-09-30-cmu10423-diffusion-models)：依該篇的完整例子與答案自我檢查。
- [擴散訓練與採樣](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling)：依該篇的完整例子與答案自我檢查。
- [VAE與變分推論](/posts/ai/2026-10-11-cmu10423-lecture-09-vae)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬例子：一維x0=2，alpha-bar=0.25，噪聲epsilon=0。前向擴散xt=√0.25×2+√0.75×0=1。若模型正確預測噪聲0，就可由xt還原x0=2。換到VAE，設encoder給mu=1、sigma=0.5，重參數化的同一次epsilon=0得到z=1；假設教學decoder是D(z)=2z，重建也為2。兩者都得到2，不代表latent含義相同：擴散要知道噪聲時刻與schedule，VAE要解釋後驗、prior與KL項。

## 自我檢查

只因兩個模型都能重建這個輸入，能說它們學到一樣的資料分布嗎？

<details>
<summary>答案與判準</summary>

不能。單筆重建沒有檢查整個生成分布，兩者也有不同訓練目標、隨機變量與採樣程序。需要固定評估集合與明確的分布／品質指標。

</details>

## 怎麼使用這張地圖

先不看答案，用自己的話指出輸入、被改動的部分與輸出，再到上面的教學篇完成變式。如果把兩種機制混在一起，回到資料流，找出哪一步的條件不同。這篇只驗關係與分界；不能用它代替各堂的推導、實作或評估。

本文沿用Spring 2026公開教材；自擬例子不是官方考題或課堂口述。原課程錄影仍須依授權存取。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開文字教材整理，沒有重建未取得的課堂口述或提供原音逐字稿。

- [官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## 更新紀錄

- 2026-10-11：重整教學範圍、完整例子與理解檢查，保留原網址及發文日期。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。確認登入牆屬實（匿名開啟 Panopto 資料夾無影片並提示登入），官方頁面也沒有公開 YouTube 版本，狀態維持不變。

## 參考資料

- [CMU 10-423/623/723 Generative AI 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [講次表（Schedule）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)——L8、L9 日期、標題與 readings
- [Lecture 8 投影片：Diffusion Models（Part II）+ Intro to VAEs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [Lecture 9 投影片：VAEs + Zero-shot vs. Few-shot](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)與[手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl-ink.pdf)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)與 [HW2 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)——VAE 與 Diffusion 題的配分
- [Practice exam（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)與[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Blei, Kucukelbir & McAuliffe, Variational Inference: A Review for Statisticians](https://arxiv.org/abs/1601.00670)——講次表 reading
- [Jason Eisner, High-Level Explanation of Variational Inference（2011）](https://www.cs.jhu.edu/~jason/tutorials/variational.html)——講次表 reading
- [Carl Doersch, Tutorial on Variational Autoencoders（2016）](https://arxiv.org/abs/1606.05908)——講次表 reading
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models（NeurIPS 2020）](https://arxiv.org/abs/2006.11239)——L7 reading，L8 的 DDPM 目標函數出處
- [Kingma & Welling, Auto-Encoding Variational Bayes（ICLR 2014）](https://arxiv.org/abs/1312.6114)——投影片 VAE Results 引用
