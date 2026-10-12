---
title: "SFT 與 RLHF：示範、偏好與獎勵如何接起來｜CMU 10-423 第 11 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 15
draft: false
description: "以完整數值例子與變式答案理解SFT 與 RLHF：示範、偏好與獎勵如何接起來。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 三種資料，三種訓練訊號

[SFT 與 RLHF](https://arxiv.org/abs/2203.02155)不是兩個任意替換的模型名稱。SFT 用「問題、理想回答」教模型模仿；reward model 用「同一問題的兩個回答、哪個較好」學排序；強化學習階段用 reward model 評分模型新產生的回答。本篇需要[語言模型訓練](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)的條件機率觀念，讀完要能把同一任務的三種資料列分清楚。

SFT 的回答序列 y=(y₁,…,y_T)，loss 是 −Σ log π(y_t|x,y_<t)。常見指令微調只計回答 token 的 loss，prompt token 只提供上下文；這是資料與實作選擇，不是所有語言模型訓練都一律如此。padding 應排除，EOS 是否納入則要與訓練目的一致。若 shift 錯一格，模型可能直接看見要預測的答案。

## 同一個客服問題走三階段

以下是本站自擬例子。問題是「退款還沒入帳怎麼辦？」示範回答為「先核對退款日期，超過約定處理期再聯絡客服」，這可作 SFT 的目標。為方便手算，把回答壓成兩個教學 token，正確 token 的條件機率分別為 0.5 和 0.25。序列機率為 0.125，總負對數 likelihood 約為 2.079；若採每 token 平均，則是 1.040。這個差別是 reduction，不能拿兩者直接比較成品質進步。

偏好資料另有回答 A「請提供退款日期以便查詢」與 B「保證今天一定入帳」。標註者偏好 A，不代表把 A 的 reward 人工指定為 1、B 指定為 0。Reward model 輸出兩個任意實數，透過 σ(r_A−r_B) 表示 A 勝出的機率。若 r_A=2、r_B=0，機率約 0.881；loss 約 0.127。兩個分數同時加 100，差與 loss 完全不變，因此偏好對本身不識別絕對獎勵尺度的平移。

## Reference 為什麼留在流程裡

模型若只追高 reward，可能找到 reward model 沒學好的區域，例如用長篇客套掩蓋不確定，得到高分卻沒有解決退款問題。典型 RLHF 用固定 reference policy 約束偏離，目標包含 E[r]−β KL(π||π_ref)。Reference 常由 SFT 模型複製；正在訓練的 policy 與固定 reference 用途不同，不能讓它們一起更新就仍說有固定錨點。

對單次抽樣回答，可以記錄 log π(y|x)−log π_ref(y|x) 作為 KL 相關訊號；單筆值可為負，不能把它當成必定非負的完整 KL。KL 非負是對分布取期望後的性質。PPO 另用 rollout 時的 old policy 比率與 clipping 控制更新，old policy 也不能與 reference 混為一個角色。

## 能學到偏好，仍要另外驗證事實

偏好標註不等於真實性的證明。如果評審都喜歡有自信的承諾，流程也可能強化錯誤保證。資料應明定退款條件、未知資訊的處理方式與評分規則，測試則留出新情境。訓練 loss 下降只能說較符合訓練訊號；實際正確性、拒答比例與語氣仍需各自檢查。

## 變式練習與答案

把 reward 分數改成 5 與 3，偏好機率仍為 0.881，因差仍為 2。若一份資料只含單一最佳回答，能直接訓練 Bradley–Terry 的成對比較嗎？不能，還缺比較對象與偏好標籤；可先作 SFT。若 reference 與 policy 初始相同，完整 KL 起初為零，但第一步後可能改變。接著讀[DPO](/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo)，看偏好對如何省去獨立 reward model 與 rollout 迴圈。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2203.02155)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
