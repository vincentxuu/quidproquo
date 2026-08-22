---
title: "CS224N 第 17 講：Multimodality 的官方閱讀地圖"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, multimodal-ai, vision-language-model, foundation-model, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 18
tldr: "第 17 講由 Luke Zettlemoyer 客座談 multimodality，但官網沒有公開投影片或 agenda；官方閱讀清單可確認三條主線：視覺推理介面、early-fusion token 模型、文字自回歸加影像 diffusion。"
description: "CS224N Winter 2026 Lecture 17 的材料缺口與官方閱讀導圖：Visual Sketchpad、Chameleon、Transfusion 與 multimodal evaluation。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-multimodality-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)確認第 17 個正規單元在 2026 年 3 月 3 日由 Luke Zettlemoyer 客座主講，官方題名是 **Guest Lecture: Multimodality**。課程頁沒有公開本季投影片或 agenda，並列出四篇 suggested readings 與七篇 optional readings；本文只整理實際讀過並列於文末的五項公開來源，不把其餘六篇描述成已讀，也不重建講者實際內容。

## 視覺可以是推理工作區

[Visual Sketchpad](https://visualsketchpad.github.io/) 把畫圖、標記與視覺工具放進推理迴圈。重點不只是「模型看得懂圖片」，而是模型能生成中間視覺狀態，再讀回來繼續推理。這和純文字 chain-of-thought 的差別，在於外部工作區可以承載空間關係。

評估時要分開工具本身的能力與模型決定何時使用工具的能力；工具成功不代表規劃一定可靠。

## 一個 token stream 容納多種模態

[Chameleon](https://arxiv.org/abs/2405.09818) 採 mixed-modal early fusion，把文字與影像表示放進同一序列，由單一自回歸模型處理交錯輸入與輸出。[Mixture-of-Transformers](https://arxiv.org/abs/2411.04996) 則探索在共享序列架構裡，讓不同模態使用稀疏、專門化參數。

統一介面降低任務切換摩擦，卻不代表所有模態應共用完全相同的表示或 loss。影像壓縮、token 數與連續細節會改變成本。

## 不同模態可以保留不同生成目標

[Transfusion](https://arxiv.org/abs/2408.11039) 對離散文字做 next-token prediction，對連續影像使用 diffusion loss，讓兩種目標在同一模型中協作。這條路不強迫影像完全離散化，但訓練與 sampling 管線更複雜。

本文讀取的 optional subset 只有 [Multimodal RewardBench](https://arxiv.org/abs/2502.14191)。它提醒我們，multimodal 系統除了生成品質，也要分開測試一般能力與安全偏好，並檢查文字、影像或兩者共同觸發時，reward model 的判斷是否一致。課表所列其他 optional readings 不在本文摘要範圍。

## 可確認與不可確認

可確認的是日期、講者、題名，以及官方頁共列十一篇閱讀；本文實際讀取並摘要的是文末五項來源。其餘六篇只存在於課表清單，不作內容主張。不可確認的是實際 agenda、講者比較了哪些架構、現場 demo 與結論。本文沒有把論文排列順序當成授課順序；若公開投影片補上，才應按 slide agenda 改寫。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Visual Sketchpad](https://visualsketchpad.github.io/)
- [Chameleon](https://arxiv.org/abs/2405.09818)
- [Transfusion](https://arxiv.org/abs/2408.11039)
- [Mixture-of-Transformers](https://arxiv.org/abs/2411.04996)
- [Multimodal RewardBench](https://arxiv.org/abs/2502.14191)
