---
title: "Cross-attention 與 DiT：條件如何進入去噪器｜CMU 10-423 第 14 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 18
draft: false
description: "以完整數值例子與變式答案理解Cross-attention 與 DiT：條件如何進入去噪器。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 問題不是只有換成 Transformer

文字生圖要把「紅色小鳥」與正在去噪的影像位置接起來。本篇先備是[causal attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)與[latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion)。讀完要能說出 cross-attention 的 Q、K、V 來源，算出一次讀取，並分清 DiT、CFG 與 Prompt-to-Prompt 各改哪個部位。

Self-attention 的 Q/K/V 來自同一組表示；cross-attention 的 Q 來自要更新的表示，K/V 來自被讀取的條件。文字條件去噪器中，影像 latent 可以提供 Q，文字提供 K/V。輸出位置數跟 Q 一樣，並不因文字 token 數較多就直接擴成更多影像位置。

## 一個位置怎麼讀兩個詞

自擬例子把 head 維度設為 1，因此縮放 √d=1。某影像位置 q=1，兩個文字 key 是 [0,log 3]，value 是 [2,6]。attention logits 為 [0,log 3]，softmax 為 [1/4,3/4]，加權輸出為 0.25·2+0.75·6=5。若 q=0，權重變 [1/2,1/2]，輸出為 4。文字沒變，影像位置的 query 改變就會改讀取比例。

這個例子不是說模型真的以單一數值表示「紅」與「鳥」。真實多頭注意力包含投影、位置結構與後續層；我們只隔離加權讀取機制。Attention map 可以幫觀察詞與空間的關聯，但不能單靠一張 map 當成完整因果解釋。

## DiT 改骨幹，條件注入還要另外說

[DiT](https://arxiv.org/abs/2212.09748)把 diffusion 去噪骨幹改成處理 latent patches 的 Transformer。它比較包括 adaptive layer norm 等條件設計；不能把「用了 Transformer」直接等同「所有層都用文字 cross-attention」。原始 DiT 的類別條件與文字條件的擴充也需區分。

自擬 8×8×4 latent 切成 2×2 patch，得到 16 個 patch token；每個原始 patch 有 16 個值，先投影到模型寬度。處理後再映回 patch 並還原空間排列。若 patch 邊長改成 4，token 數降成 4；全注意力配對由 256 降成 16，但每個 patch 資訊與投影大小也改了，不能只報配對數就宣稱畫質不受影響。

## CFG 與 Prompt-to-Prompt 的兩種控制

Classifier-free guidance（CFG）結合有條件與無條件預測。用 ε_guided=ε_uncond+s(ε_cond−ε_uncond) 的慣例，自擬 ε_uncond=2、ε_cond=1、s=3，結果為 −1；s=1 才回到條件預測 1。增強差值不保證品質單調增加，可能犧牲多樣性或造成失真。不同文件有不同參數慣例，使用公式時要先定義 s。

[Prompt-to-Prompt](https://arxiv.org/abs/2208.01626)在修改文字時控制 cross-attention，以保留部分空間配置。把「紅色小鳥」改成「藍色小鳥」，可概念上保留「鳥」的注意力配置並調整颜色詞；實際 token 對齊、替換哪些層與 timestep 都重要。這不是保證所有像素、形狀與背景完全不動的局部編輯，也不是重新微調模型權重。

## 變式練習與答案

把 toy values 改成 [0,8]，原權重下輸出為 6；若文字有三個 token，單一 query 的輸出仍只有一個位置。CFG 的上例 s=0 時結果為 2，為無條件預測。P2P 若把整句改成長度不同的 token 序列，不能直接依欄位索引複製 attention，必須處理詞與 token 對應。下一篇[Q-Former](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws)則用固定數量 query 讀取較長的條件序列。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 14 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf)
- [Primary paper](https://arxiv.org/abs/2212.09748)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
