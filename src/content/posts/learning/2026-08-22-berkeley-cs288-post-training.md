---
title: "Pre-training、Post-training、Generation 與 Evaluation｜Berkeley CS288 Spring 2026 主題單元"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, llm, post-training, evaluation, prompting]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "08–12 組教材把 base model 變成可互動系統：預訓練決定基礎能力，post-training 改變行為，generation 與 evaluation 決定輸出如何被使用與判讀。"
description: "導讀 CS288 的 pre-training、fine-tuning、prompting、post-training、generation、evaluation 與 benchmarking。"
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 3 }
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-post-training-en)

[08–12 組教材](https://cal-cs288.github.io/sp26/)處理的是模型完成架構後，如何經過 pre-training、fine-tuning、prompting 與 post-training，成為可以部署與評估的系統。Generation 和 evaluation 不是附錄：同一組 logits 經不同 decoding policy，會形成不同品質、成本與風險。

## 把不同階段與方法分開

Pre-training 從大量資料學通用預測能力；fine-tuning 用較窄資料改變任務行為；prompting 在不更新參數時提供上下文與輸出約束。Post-training 是更大的行為調整層，不能簡化成「再訓練一次」。讀者應為每個階段記錄資料來源、objective、更新哪些參數、以及用什麼 held-out evidence 驗證。

[A2 的 bonus](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) 把這些概念縮成可跑的 mini-study：用自己寫的 tokenizer 與 Transformer pre-train，再比較 fine-tuned QA classifier 與 prompting。小模型結果不能外推成所有 LLM 的規律，但很適合練習控制變因。

## Generation 是決策，不只是呼叫函式

Greedy、sampling 與 top-k 類方法改變探索程度；停止條件、長度與溫度也會改變輸出分布。實驗時固定 model checkpoint 與 prompts，一次只改一個 decoding 參數，保存 raw outputs，而不是只留下主觀偏好的範例。

## Evaluation 要拆模型、資料與人

官方課表把 inference/evaluation 和 experimental design/human annotation 排在一起。這提醒讀者：benchmark score 只有在資料定義、切分與 annotation procedure 清楚時才有意義。先寫 evaluation contract：任務、資料時間點、metric、失敗類型與人工複核抽樣，再開始跑分。

錄影與課堂討論不公開，因此本文不還原教師對特定 benchmark 的口頭評價，只沿公開 slides 與作業建立檢查框架。

## 先固定模型，再比較生成

以下是本文自編的教學例子，不是官方作業答案。

自編的下一詞分布是 A:0.6、B:0.3、C:0.1。Greedy 每次選 A；sampling 依這個分布抽樣，可能得到 B 或 C。權重未變，答案卻可能改變，因此不能把一次輸出差異直接歸因為訓練改善。

**檢查與答案：** 若只保留 top-2 並重新正規化，A、B 的機率是多少？答案是 0.6/0.9=2/3 與 0.3/0.9=1/3。比較品質時仍需固定題目、評分方式與抽樣設定。

## 更新紀錄

- 2026-10-11：補上自編例子、完整計算或推理，以及理解檢查答案。

## 參考資料

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 2 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf)
- [Course information](https://cal-cs288.github.io/sp26/course_info/)
