---
title: "Q-Former：固定查詢如何橋接兩個凍結模型｜CMU 10-423 第 15 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 21
draft: false
description: "以完整數值例子與變式答案理解Q-Former：固定查詢如何橋接兩個凍結模型。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 先問橋接方向，再問 query 數量

[BLIP-2](https://arxiv.org/abs/2301.12597)用 Q-Former 連接凍結影像 encoder 與凍結 LLM；[作業 4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)則讓 query 讀文字表示，再送進 DiT。兩者可共用 querying 的想法，輸入輸出方向卻不同。需要先讀[VLM](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)與[cross-attention](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)。本篇讀完要能畫出兩條資料流，分辨哪些模組在訓練。

Query 是可學習的向量，不是使用者輸入的問題句。固定 q 個 query 可以透過 cross-attention 從 m 個來源 token 擷取資訊，再以 self-attention 交換 query 間的訊號。它提供固定大小的接口，不保證所有來源資訊無損保留；q、寬度與任務目標共同決定瓶頸。

## 自擬的兩個 query 讀取

假設影像 encoder 產生四個寬度 6 的 patch 表示。兩個寬度 4 的 query 透過投影讀取它們，輸出是 2×4；再投影到 LLM 寬度 8，成為 2×8 的視覺前綴。來源四個位置沒有直接變成四個 LLM token，因為輸出數由 query 數決定。

為隔離讀取機制，令第一個 query 的 attention 權重是 [0.7,0.1,0.1,0.1]，第二個是 [0.1,0.1,0.1,0.7]；某個 value 座標依序為 [2,0,0,6]。第一個 readout=2，第二個=4.4。這顯示兩個 query 可以抽出不同資訊，不代表它們必然等同「左上」與「右下」；位置與語意分工是學出來的，仍需驗證。

## BLIP-2 的兩階段不是同一個 loss

第一階段用凍結影像 encoder，讓 Q-Former 學習影像與文字關係，包括影像文字對比、匹配與以影像為條件的文字生成目標。不同目標使用不同 attention mask，控制 query 與文字如何互相看見。不能因投影片畫了文字 token 就假設每個目標都採完全雙向注意力。

第二階段把 query 輸出投影成 LLM 能讀的前綴，訓練以影像為條件的語言生成；LLM 權重凍結，Q-Former 與連接投影仍可更新。凍結 LLM 不表示它完全不參與 backward：前綴要收到 loss 訊號，通常需要梯度穿過 LLM 對輸入的路徑。

## HW4 則把箭頭反過來

HW4 的文字由 GPT-2 產生表示，Q-Former query 讀這串文字，再經投影與 DiT 的條件接口相接，輸出去噪所需條件。這是「文字→query→影像生成」，不是「影像→query→語言回答」。不能把 BLIP-2 的三個第一階段 loss 直接搬來說就是 HW4 的訓練；作業依噪聲預測等原任務設定驗收。

在兩條路中，可訓練 query 和注意力模組都是小橋接器；但「小」不能只憑 query 數判斷，Transformer 層與投影也有參數。比較時要列完整 trainable count，並檢查移除或打亂條件後，模型是否真的失去對應能力。

## 變式練習與答案

若來源 token 從四個增加到十六個，但 query 仍為兩個，輸出仍是 2×4，注意力權重矩陣則由 2×4 變 2×16。若所有 query 權重相同，上例兩個 readout 就相同，query 數變多不必然提供更多有用資訊。若回答 loss 能下降但 projector 沒有梯度，可能由其他 trainable 部分代償；仍需查梯度路徑與凍結設定。下一篇用[HW4 的自擬驗收](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)追完一次訓練步驟。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Primary paper](https://arxiv.org/abs/2301.12597)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
