---
title: "Berkeley CS288（五）：Inference-time Compute、Reasoning 與 Embodied Agents"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, ai-agent, reasoning, multimodal-ai, llm]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "15–18 組教材把 NLP 模型放進感知、推理、工具與環境迴圈；核心問題從下一個 token，轉成如何分配推論計算並驗證多步行動。"
description: "導讀 CS288 的 Embodied Perception、Inference-time Compute、Agent Reasoning 與 Embodied Agents，並說明公開教材邊界。"
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 5 }
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-agents-en)

[15–18 組教材](https://cal-cs288.github.io/sp26/)把語言模型放進更長的決策迴圈：Embodied Perception、Inference-time Compute、Agent Reasoning、Embodied Agents。此時輸入可能含視覺或環境狀態，輸出也不只是文字，而是下一個工具呼叫或行動。

## Inference-time compute 是資源分配問題

增加推論時計算，可以表現為產生更多候選、延長推理軌跡、搜尋、驗證或反覆修正。真正要比較的是固定任務與 budget 下，額外計算是否改善可驗證結果，而不是把較長輸出直接當成較深推理。

實驗時先定義 budget：tokens、wall-clock time、model calls 或金額擇一作主軸；再保存每一步 observation、action、tool result 與 final answer。沒有 trace，就很難區分模型推理錯誤、工具錯誤與環境回傳錯誤。

## Reasoning agent 多了狀態與工具

單輪 QA 的評估單位是一個答案；agent 的評估還要包含 task completion、無效步驟、工具失敗、成本與安全約束。比較兩個 agent 前，必須固定工具集合、權限、初始狀態與終止條件。否則差異可能只是某一方拿到更好的環境。

## Embodied agent 把錯誤帶進真實迴圈

Embodied perception 讓模型從環境觀察建立狀態；embodied agent 再將語言計畫轉成行動。感知錯誤會一路傳到規劃與執行，因此要保留可回放的 observation-action log，並在高風險動作前設人工作業閘門。

[官方課表](https://cal-cs288.github.io/sp26/)另列 computer-use agent safety、memory、continual learning 與 speech guest lectures。[Course Info](https://cal-cs288.github.io/sp26/course_info/) 說明當期錄影只提供修課生與 Berkeley 校內旁聽者，課表也沒有為部分場次列出匿名 slides。本系列因此不還原那些講座，只標示它們在課程收尾的問題版圖中存在。

## 用 final project 收尾

[Course Project](https://cal-cs288.github.io/sp26/project/) 依序要求 abstract、midpoint report、presentation 與 final report，將一次 demo 變成可審查的研究過程。校外版本也應保留四個 checkpoint：先寫問題與 baseline，再交中期失敗分析，最後才整理結果。課內的團隊媒合、教師回饋與雲端 credits 不對外提供，必須自行安排同儕 review 與算力上限。

## 參考資料

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Course project](https://cal-cs288.github.io/sp26/project/)
- [Course information and recording access](https://cal-cs288.github.io/sp26/course_info/)
