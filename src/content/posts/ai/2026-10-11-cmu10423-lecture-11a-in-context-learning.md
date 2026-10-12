---
title: "In-context learning：示例如何改變預測｜CMU 10-423 第 11 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 14
draft: false
description: "以完整數值例子與變式答案理解In-context learning：示例如何改變預測。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 同一個模型，為什麼換提示就換答案

In-context learning（ICL）把任務說明與示例放進推論上下文，讓模型依目前看到的內容回答。與[LoRA](/posts/ai/2026-10-11-cmu10423-peft)不同，普通 ICL 不執行 optimizer step；權重相同，條件機率 p(y|prompt) 卻因 prompt 改變而不同。本篇接續[解碼](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)，目標是設計能分辨格式效應、示例效應與洩漏的比較，而不是背 prompt 名稱。來源包含第 9 堂末段的 zero/few-shot 與第 11 堂 ICL。

[GPT-3 論文](https://arxiv.org/abs/2005.14165)使用 zero-shot、one-shot、few-shot 的任務設定。shot 數的是提供多少個完成的任務示例，不是 prompt 有幾句話。指令很長仍可能是 zero-shot；提供一組輸入與答案才是 one-shot。Chain-of-thought 又是另一個軸：示例是否包含推理過程，而非所有 few-shot 都是 CoT。

## 一個可控制的分類例子

以下自擬任務用虛構標籤，降低「模型早已知道正負標籤」的混淆。要求把影評分類成 A（喜歡）或 B（不喜歡），測試句固定為「節奏很慢，但我喜歡人物的細節」。Zero-shot prompt 只有標籤規則與測試句。Few-shot 加入「無聊到離場→B」與「雖然慢，角色很動人→A」。第二個示例把「慢」不必然等於負評的判斷放進上下文。

我們不能不跑模型就宣稱它一定回答 A。能確定的是：few-shot prompt 增加了一個與測試句相關的判斷示例。如果輸出由 B 變 A，還要做變式，才知道是否只是追隨最近標籤。把兩個示例的順序互換，其他內容不變；再保留 A/B 數量、換成不相似的影評。記錄預測、答案格式與每個 prompt 的 token 數，才能分開順序、相關性與成本。

## 為何示例可以有用，也可能誤導

Causal attention 讓測試位置讀到前面的示例。預訓練學到的模式辨識、格式延續與任務關聯都可能參與；「像在學」不能直接證明內部正在跑某個梯度演算法。提示文字也佔上下文與 prefill 計算，每次請求仍要付這個成本，除非系統有合法且有效的快取。

若示例都用「答案：A」結尾，模型可能學到輸出 A 的偏好，而不是影評判準。若示例包含測試集的原句與答案，那是資料洩漏，不是泛化提升。若檢索出最相似的已解題目，也要說明檢索與測試資料的分界，不能把最近鄰記憶誤稱為全新推理能力。

## 推理示例不是正確性的保證

CoT 示例可展示中間步驟，例如先指出「慢」是節奏、再看整體喜好。但模型產生流暢理由仍可能先猜答案再合理化。驗收應看答案是否符合事先定義的任務判準，並用反例測試：把句子改成「人物很細膩，但我看得很痛苦」，正確分類依整體不喜歡應為 B。若它只抓「細膩」就答 A，示例沒有教會所需規則。

## 變式練習與答案

固定權重，用十組示例提示測試同一批未見影評，這是微調嗎？不是；沒有參數更新。把示例答案換成互相矛盾的標籤，應期待什麼？無法預先保證某個輸出，合理的判準是敏感度與錯誤率變化，並檢查模型是否承認歧義。若要比較 ICL 與 SFT，必須使用相同測試資料，分開計算訓練成本與每次推論成本。接著讀[SFT 與 RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf)，了解參數真的更新時，資料形式如何改變。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2005.14165)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
