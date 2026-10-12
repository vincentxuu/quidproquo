---
title: "Scaling與MoE：算力預算與條件計算｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, scaling-laws, mixture-of-experts, moe, llm, training-data]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 41
tldr: "Scaling laws問固定預算下模型與資料怎麼配置；MoE問如何有更多expert容量、卻只啟用少數expert。前者是配置與經驗模型，後者是架構與路由，不能合稱「把模型變大」就跳過其中一方的機制。"
description: "Scaling laws問固定預算下模型與資料怎麼配置；MoE問如何有更多expert容量、卻只啟用少數expert。前者是配置與經驗模型，後者是架構與路由，不能合稱「把模型變大」就跳過其中一方的機制。"
draft: false
glossary:
  - term: "活躍參數"
    aliases: ["active parameters", "active params"]
    definition: "MoE 模型處理一個 token 時，被 router 選中、實際參與計算的參數量。計入所選 expert 與共享部分的活躍參數量，可粗略比較每個 token 的算術成本；實際 FLOPs 還受 attention、router 等運算影響，速度另受通訊影響。總參數是權重儲存的起點，記憶體還取決於精度、分片與快取。"
    context: "L16 投影片舉 Mixtral（8 個專家選 2 個）與 OLMoE（64 個專家選 8 個）說明兩者的差別。"
  - term: "router z-loss"
    aliases: ["z-loss", "Router Z-loss"]
    definition: "加在 MoE 訓練目標上的正則項，懲罰 router 輸出過大的 logit，讓訓練更穩定。"
    context: "L16 投影片以 OLMoE 的做法為例，把它和 load balance loss 一起加進總 loss。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Scaling laws問固定預算下模型與資料怎麼配置；MoE問如何有更多expert容量、卻只啟用少數expert。前者是配置與經驗模型，後者是架構與路由，不能合稱「把模型變大」就跳過其中一方的機制。

## 先讀哪一篇

- [模型與資料配置](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws)：依該篇的完整例子與答案自我檢查。
- [MoE路由](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts)：依該篇的完整例子與答案自我檢查。
- [分散式訓練](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬預算例子：先用簡化C∝N×D，只計算相對量。配置A為N=10、D=20，乘積200；配置B為N=20、D=10，同樣200。它們預算相同，不代表loss相同。另設MoE有4個expert，每個100個玩具參數，top-2一次用200個expert參數而總expert容量400；還沒計入shared層、router和通信。把兩個200相比也不能說算力相等：一個是訓練配置乘積，一個是每次路由的參數數量，單位都不同。

## 自我檢查

top-2改成top-1，總expert容量會減半嗎？

<details>
<summary>答案與判準</summary>

不會，仍有400個expert參數；此例每次啟用的expert參數變100。效果、負載與通信仍要另測。

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
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L15、L16 日期與 Quiz 4／5 範圍
- [Lecture 15 投影片：Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 16 投影片：Mixture of Experts](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf)、[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf)
- [Lecture 18 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — 考試範圍 L1–L15
- [Spring 2026 練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)、[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Kaplan et al. 2020：Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Hoffmann et al. 2022：Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Gunasekar et al. 2023：Textbooks Are All You Need](https://arxiv.org/abs/2306.11644)
- [Li et al. 2023：Textbooks Are All You Need II: phi-1.5 technical report](https://arxiv.org/abs/2309.05463)
- [Goyal et al. 2024：Scaling Laws for Data Filtering](https://arxiv.org/abs/2404.07177)
- [Cai et al. 2024：A Survey on Mixture of Experts in Large Language Models](https://arxiv.org/abs/2407.06204)
- [Muennighoff et al. 2024：OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)
- [Jiang et al. 2024：Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Clark et al. 2022：Unified Scaling Laws for Routed Language Models (ICML)](https://proceedings.mlr.press/v162/clark22a.html)
