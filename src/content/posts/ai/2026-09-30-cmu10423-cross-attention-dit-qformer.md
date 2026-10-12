---
title: "條件注入：attention、DiT與Q-Former怎麼分工｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, attention, diffusion-transformer, diffusion-model, image-generation]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 40
tldr: "Cross-attention是讀取另一組表示的運算；DiT是擴散模型的骨幹選擇；Q-Former是用可學query抽取或橋接資訊的模組。它們可以組合，但不是三個互斥的產品。這篇只比較角色，Prompt-to-Prompt與classifier-free guidance的操作細節放回第14堂教學。"
description: "Cross-attention是讀取另一組表示的運算；DiT是擴散模型的骨幹選擇；Q-Former是用可學query抽取或橋接資訊的模組。它們可以組合，但不是三個互斥的產品。這篇只比較角色，Prompt-to-Prompt與classifier-free guidance的操作細節放回第14堂教學。"
draft: false
glossary:
  - term: "Q-Former"
    definition: "BLIP-2 提出的 Querying Transformer：用一小組可學習的 query 向量，透過 cross-attention 從凍結的影像編碼器抽出固定數量的特徵，再接到凍結的 LLM。"
    context: "L15 的主題，也是 HW4 程式題要實作的模組。"
  - term: "Prompt-to-Prompt"
    definition: "Hertz et al. 2022 的影像編輯法：修改提示詞時控制 cross-attention 權重，盡量保留部分空間配置；實際效果依 token 對齊、替換的層與 timestep 而異，不能保證所有像素或背景不變。"
    context: "L14 用它展示 cross-attention 權重的用途。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Cross-attention是讀取另一組表示的運算；DiT是擴散模型的骨幹選擇；Q-Former是用可學query抽取或橋接資訊的模組。它們可以組合，但不是三個互斥的產品。這篇只比較角色，Prompt-to-Prompt與classifier-free guidance的操作細節放回第14堂教學。

## 先讀哪一篇

- [Cross-attention與DiT](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)：依該篇的完整例子與答案自我檢查。
- [Q-Former橋接](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws)：依該篇的完整例子與答案自我檢查。
- [作業4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬shape例子：影像latent有4個位置、文字有3個token，hidden寬度2。若Q來自影像、K/V來自文字，QKᵀ是4×3，softmax後乘3×2的V，得到4×2輸出。換成Q-Former，以2個learned query讀4個影像特徵，attention圖是2×4，讀取輸出是2×2。兩者都做attention，但輸出位置數由query一側決定。BLIP-2的影像→LLM與作業4的文字→DiT是不同資料流，不可把兩張圖接成同一段。

## 自我檢查

把文字token數從3改5，第一個例子的輸出位置數會從4改5嗎？

<details>
<summary>答案與判準</summary>

不會。attention圖成4×5，V為5×2，輸出仍4×2。輸出位置由Q的4個位置決定。

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
