---
title: "MIT 6.S191 Lab 3：LoRA 微調與 LLM-as-a-Judge 評估"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 13
tldr: "2026 以 LFM2-1.2B 建立 chat template 與生成流程，用 LoRA 做風格調適，再透過 OpenRouter 與 Opik 組合 judge workflow。"
description: "MIT 6.S191 2026 Lab 3 雙語實作指南：執行順序、完成成果、帳號與服務限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-lab3-lora-evaluation-en)

[MIT 6.S191 官方 2026 repo](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab3) 的 Lab 3 是 **Lab 3：LoRA 微調與 LLM-as-a-Judge 評估**。以 LFM2-1.2B 建立 chat template 與生成流程，用 LoRA 做風格調適，再透過 OpenRouter 與 Opik 組合 judge workflow。本文固定使用 2026 branch，避免 master 後續更新造成內容漂移。

## 開始前

[官方 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)指定 Google Colab、Python 3 與 GPU runtime。先複製 notebook 到自己的 Drive，再從頭執行；API key 放在 notebook 的秘密管理介面，不要寫進可分享的 cell 或提交到 Git。

## 建議完成順序

1. 先固定三個 prompts，比較 base model 的輸出
2. 完成 LoRA 設定與訓練，只改 notebook 指定的 TODO
3. 先寫人工 rubric，再決定是否花費 API 額度跑 judge

每次只解一個 TODO。先寫下預期輸入／輸出 shape，再執行 cell；出錯時保存錯誤訊息與修正理由。公開 solution 適合最後核對，不適合一開始照抄。


預期輸出是固定 prompts 的 base／LoRA 模型對照、訓練紀錄，以及依同一 rubric 產生的人工或 judge 分數。常見失敗包括 chat template 與 tokenizer 格式不一致，以及在 rubric 尚未固定前就讓 judge 評分，導致結果無法比較。

## 完成標準

至少留下 notebook 副本、一次可重現的完整執行，以及一段短結論：模型做對了什麼、失敗在哪裡、下一次要改哪個變因。服務儀表板截圖不能取代模型輸出與實驗記錄。

## 限制

這是依賴最多的一份 lab：要 Colab GPU、Comet／Opik 與 OpenRouter key。[官方 Lab 3 notebook](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab3/LLM_Finetuning.ipynb)提醒強 judge 可能付費，免費模型可能受 rate limit；先查當日條款。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [官方 2026 Lab 3 程式與 notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab3)
- [官方 repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
