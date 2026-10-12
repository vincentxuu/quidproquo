---
title: "分散式訓練與高效推論：先找成本在哪裡｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, distributed-training, parallelism, flashattention, pagedattention, speculative-decoding]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 47
tldr: "模型放不下一張GPU，和模型已放得下卻生成太慢，是不同故障。分散式策略重新分配資料、參數與狀態；FlashAttention主要改善attention的記憶體IO；KV cache避免decode時重算歷史K/V。先找成本的位置，再選方法。"
description: "模型放不下一張GPU，和模型已放得下卻生成太慢，是不同故障。分散式策略重新分配資料、參數與狀態；FlashAttention主要改善attention的記憶體IO；KV cache避免decode時重算歷史K/V。先找成本的位置，再選方法。"
draft: false
glossary:
  - term: "1F1B"
    aliases: ["one-forward-one-backward"]
    definition: "管線平行的一種排程：穩定狀態下，每張 GPU 交替做一次 microbatch 的前向與一次反向，減少管線的閒置時間。"
    context: "L17 投影片引 PipeDream 與 Megatron-LM 的圖說明 1F1B 與 pipeline flush。"
  - term: "online softmax"
    definition: "一邊掃過資料、一邊更新目前最大值與正規化分母的 softmax 算法，把 safe softmax 的三次記憶體掃描降成兩次，也讓 softmax 可以分塊計算。"
    context: "L18 用它解釋為什麼 attention 可以像矩陣乘法一樣做 tiling，這是 FlashAttention 的前提。"
    links:
      - label: "Milakov & Gimelshein 2018"
        url: "https://arxiv.org/abs/1805.02867"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

模型放不下一張GPU，和模型已放得下卻生成太慢，是不同故障。分散式策略重新分配資料、參數與狀態；FlashAttention主要改善attention的記憶體IO；KV cache避免decode時重算歷史K/V。先找成本的位置，再選方法。

## 先讀哪一篇

- [多GPU訓練](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training)：依該篇的完整例子與答案自我檢查。
- [FlashAttention與高效解碼](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬例子：兩個等大的local batch對一個scalar參數算出梯度2與6。data parallel平均後是4；兩張GPU各用同一個4更新，才能保持同步。若不通信，各用2與6會讓參數走向不同值。換到decode，已算好的歷史K/V保留在cache，下個token新增自己的K/V；這不會替你把訓練梯度平均。增加GPU也不會自動消除attention產生的大中間矩陣，需看實際partition與kernel。

## 自我檢查

兩個batch大小不同，仍可直接平均2與6嗎？

<details>
<summary>答案與判準</summary>

若2、6各是local平均梯度，就要按樣本數加權，否則不等於global batch平均。這個條件與推論cache無關。

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
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L17、L18 日期與 Quiz 5 範圍
- [Lecture 17 投影片：Distributed Training](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf)、[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf)
- [Lecture 18 投影片：Efficient Attention (FlashAttention) & Efficient Decoding Strategies](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Shoeybi et al. 2019：Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Harlap et al. 2018：PipeDream](https://arxiv.org/abs/1806.03377)
- [Narayanan et al. 2021：Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473)
- [Rajbhandari et al. 2019：ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Li et al. 2021：TeraPipe: Token-Level Pipeline Parallelism](https://arxiv.org/abs/2102.07988)
- [Lepikhin et al. 2020：GShard](https://arxiv.org/abs/2006.16668)
- [Fedus et al. 2021：Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Milakov & Gimelshein 2018：Online normalizer calculation for softmax](https://arxiv.org/abs/1805.02867)
- [Ivanov et al. 2020：Data Movement Is All You Need](https://arxiv.org/abs/2007.00072)
- [Dao et al. 2022：FlashAttention](https://arxiv.org/abs/2205.14135)
- [Dao 2023：FlashAttention-2](https://arxiv.org/abs/2307.08691)
- [Kwon et al. 2023：Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
