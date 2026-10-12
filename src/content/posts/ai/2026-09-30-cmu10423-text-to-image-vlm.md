---
title: "文生圖與VLM：生成影像和讀懂影像的兩條路｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, text-to-image, latent-diffusion, vision-language-model, clip]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 44
tldr: "「文字加圖片」不能描述清楚模型的工作。文生圖要產生影像，文字是條件；VLM可能接受影像，產生文字回答。資料流方向、輸出目標與驗收不同。原第12–13堂的內容在這裡保留關係地圖，兩條路各有完整例子與檢查。"
description: "「文字加圖片」不能描述清楚模型的工作。文生圖要產生影像，文字是條件；VLM可能接受影像，產生文字回答。資料流方向、輸出目標與驗收不同。原第12–13堂的內容在這裡保留關係地圖，兩條路各有完整例子與檢查。"
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

「文字加圖片」不能描述清楚模型的工作。文生圖要產生影像，文字是條件；VLM可能接受影像，產生文字回答。資料流方向、輸出目標與驗收不同。原第12–13堂的內容在這裡保留關係地圖，兩條路各有完整例子與檢查。

## 先讀哪一篇

- [文字條件生成](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion)：依該篇的完整例子與答案自我檢查。
- [視覺語言模型](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)：依該篇的完整例子與答案自我檢查。
- [條件注入機制](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬例子：prompt是「桌上一個紅杯子」。文生圖從噪聲latent開始，文字向量進入條件路徑，去噪後解碼成圖。VLM則拿到一張現有圖片，影像encoder產生特徵，橋接到LLM，回答「杯子是紅色」。即使兩者文字都說紅色，第一條要檢查圖中是否真的有杯子、顏色與位置；第二條要檢查回答是否由輸入影像支持。把原圖換成藍杯而文字提示不變，是VLM的有用反例測試；它不等於文生圖的生成測試。

## 自我檢查

VLM答對顏色，是否證明它也能生成對應圖片？

<details>
<summary>答案與判準</summary>

不能。讀取與生成使用不同輸出空間及訓練目標。多模態系統可能同時支持兩者，但必須各自測試。

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
