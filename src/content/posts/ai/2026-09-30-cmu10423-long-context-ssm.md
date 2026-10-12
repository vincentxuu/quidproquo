---
title: "長上下文與SSM：保留歷史的兩種取捨｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, long-context, attention, state-space-model, mamba, flashattention]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 48
tldr: "長上下文問模型能否處理、找到並使用很久以前的資訊；SSM問如何用狀態更新處理序列。SSM的效率不能直接證明長文件檢索可靠，attention的長窗口也不能直接證明重要資訊一定被使用。第19與21堂因此各自有獨立教學。"
description: "長上下文問模型能否處理、找到並使用很久以前的資訊；SSM問如何用狀態更新處理序列。SSM的效率不能直接證明長文件檢索可靠，attention的長窗口也不能直接證明重要資訊一定被使用。第19與21堂因此各自有獨立教學。"
draft: false
glossary:
  - term: "Ring Attention"
    aliases: ["RingAttention", "環狀注意力"]
    definition: "把長序列切塊分給多個裝置，各裝置用 blockwise 方式計算自己那塊 query 的注意力，同時把 key/value 區塊沿著環狀拓樸傳給下一個裝置；能放進記憶體的序列長度因此隨裝置數量增加。"
    context: "CMU 10-423 第 19 講「efficient full attention」一節的主角。"
    links:
      - label: "Ring Attention（Liu et al., 2023）"
        url: "https://arxiv.org/abs/2310.01889"
  - term: "selective SSM"
    aliases: ["selective state space model", "選擇性狀態空間模型"]
    definition: "Mamba 採用的 SSM 變體：讓參數 B、C 與離散化步長 Δ 隨每個時間步的輸入改變，而不是固定不變。代價是不能先算好一個卷積核，改用掃描（scan）實作。"
    context: "CMU 10-423 第 21 講從 S4 過渡到 Mamba 的關鍵差異。"
    links:
      - label: "Mamba（Gu & Dao, 2023）"
        url: "https://arxiv.org/abs/2312.00752"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

長上下文問模型能否處理、找到並使用很久以前的資訊；SSM問如何用狀態更新處理序列。SSM的效率不能直接證明長文件檢索可靠，attention的長窗口也不能直接證明重要資訊一定被使用。第19與21堂因此各自有獨立教學。

## 先讀哪一篇

- [長上下文](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context)：依該篇的完整例子與答案自我檢查。
- [狀態空間與混合模型](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models)：依該篇的完整例子與答案自我檢查。
- [推理模型](/posts/ai/2026-09-30-cmu10423-reasoning-models)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬SSM：h0=0，ht=0.5h(t−1)+xt，輸入[2,0,6,2]，令輸出等於狀態。逐步得到[2,1,6.5,5.25]。第一筆輸入到第4步的直接貢獻是2×0.5³=0.25，早期資訊在此玩具系統衰減。這不是所有SSM的固定行為，而是指定轉移係數的結果。要測長文件能力，另固定問題與證據文字，把證據移到文件開頭、中間、結尾，比較回答；只測一次成功不夠。

## 自我檢查

把第一筆輸入從2改4，其餘不變，第4步狀態增加多少？

<details>
<summary>答案與判準</summary>

增加2×0.5³=0.25，從5.25變5.5。能算出狀態影響，仍不能代替文字檢索的實證測試。

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
- [課程講次表（L19、L21 日期與 Quiz 範圍）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 19 投影片：Long Context in LLMs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lecture 19 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf)
- [Lecture 21 投影片：State Space Models + Hybrid Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [Fu et al. 2024：Data Engineering for Scaling Language Models to 128K Context](https://arxiv.org/abs/2402.10171)
- [Bertsch et al. 2024：In-Context Learning with Long-Context Models: An In-Depth Exploration](https://arxiv.org/abs/2405.00200)
- [Child et al. 2019：Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509)
- [Beltagy et al. 2020：Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Ding et al. 2023：LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486)
- [Li et al. 2021：Sequence Parallelism: Long Sequence Training from System Perspective](https://arxiv.org/abs/2105.13120)
- [Liu & Abbeel 2023：Blockwise Parallel Transformer for Large Context Models](https://arxiv.org/abs/2305.19370)
- [Liu et al. 2023：Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Liu et al. 2024：World Model on Million-Length Video And Language With Blockwise RingAttention](https://arxiv.org/abs/2402.08268)
- [Hazy Research：The Annotated S4 系列部落格（投影片圖片來源）](https://hazyresearch.stanford.edu/blog/2022-01-14-s4-3)
- [Gu & Dao 2023：Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)
- [Yang et al. 2024：Gated Delta Networks: Improving Mamba2 with Delta Rule](https://arxiv.org/abs/2412.06464)
- [Lieber et al. 2024：Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887)
- [NVIDIA 2025：Nemotron-H: A Family of Accurate and Efficient Hybrid Mamba-Transformer Models](https://arxiv.org/abs/2504.03624)
- [Qwen3-Next 官方部落格](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
