---
title: "Vision-language model：圖片如何成為語言模型的輸入｜CMU 10-423 第 13 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 17
draft: false
description: "以完整數值例子與變式答案理解Vision-language model：圖片如何成為語言模型的輸入。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 圖片不能直接當文字 token

Vision-language model（VLM）讓模型依圖片與文字回答問題。典型做法先以影像 encoder 取得視覺表示，再由橋接模組轉成語言模型可接受的 embedding。它不等於[latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion)：前者讀圖，後者生成圖。需要先理解[ViT 與 patch](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)。本篇要能追蹤 token 數、embedding 寬度與資料流，並定位看圖答錯可能發生在哪一段。

[LLaVA](https://arxiv.org/abs/2304.08485)展示了以視覺特徵接到語言模型、再作指令調適的路線；課程也比較其他視覺語言方法。影像 encoder、projector、LLM 的責任不同：encoder 抽出可用資訊，projector 對接空間，LLM 根據視覺與文字上下文生成回答。Projector 尺寸正確並不保證語意對齊，仍需要訓練訊號。

## 一張圖片走完形狀

以下自擬設定：8×8 RGB 圖片切成 4×4 patch，因此有四個 patch。每個 patch 展平成 48 個值，再映射為寬度 6 的視覺 embedding，得到 4×6 的特徵矩陣。Projector 的權重為 6×8，輸出是 4×8，與 LLM 寬度 8 一致。文字問題有三個 token，就可概念上組成七個輸入位置；實際模型還可能加入分隔符或特殊 token，不能把本例當所有 VLM 的固定長度。

問題是「左上角有什麼顏色？」假設左上 patch 包含紅色方塊，視覺 encoder 必須保留該 patch 的內容與位置。若只平均池化成一個全圖向量，四個位置資訊可能被混在一起。Projector 可以改寬度，但不會憑空還原 encoder 已經丟掉的細節。這也是高解析度、多 crop 或保留更多 token 各有成本的原因。

## 對比學習與生成回答不同

像 CLIP 的影像文字對比學習，把配對圖片與描述在表示空間拉近，適合相似度與檢索。它本身不等於能逐 token 回答問題的聊天模型。可先用對比表示作視覺底座，再接 LLM；也可以用 caption、圖文指令資料教生成。描述「紅方塊在左上」與只描述「有紅色」提供不同粒度的監督，不能因兩者都是文字就視為同樣訊號。

訓練時哪些模組凍結要明列。只訓練 projector 的成本較小，但對底座保留資訊的依賴較強；解凍 LLM 或視覺 encoder 可擴大可調空間，也提高成本與遺忘風險。梯度不存在與參數不更新不是永遠同義，因凍結模組仍可能需要傳回對其輸入的梯度。

## 答對一次不是圖像理解驗收

若資料中多數問題答案是「紅色」，模型可能忽略圖片也答對。自擬控制是固定問題，把紅色方塊從左上移到右下，另換成藍色，觀察回答是否依影像改變；再遮掉相關 patch。如果答案完全不變，可能是語言先驗、橋接失效或 encoder 資訊不足。這些需進一步定位，不能只由現象猜某一層壞了。

## 變式練習與答案

把 patch 邊長改成 2，8×8 圖片有 16 個 patch，LLM 視覺位置變多，未含特殊 token 的總位置是 19。Projector 從 6 映到 8 不會把 16 個 token 變成 8 個；改的是每個 token 的寬度。若輸入圖片换了而 logits 完全相同，先檢查影像 tensor 是否真的進到 forward，再檢查 conditioning 路徑。下一篇[cross-attention](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)教如何讓一組 token 讀另一組表示。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 13 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf)
- [Primary paper](https://arxiv.org/abs/2304.08485)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
