---
title: "訓練與解碼：同一組 logits 為何生成不同句子｜CMU 10-423 第 3 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 4
tldr: "模型學會的下一 token 分佈，跟我們怎麼從分佈挑 token，是兩件接續發生的事。"
description: "Spring 2026 公開課程材料教學：訓練與解碼：同一組 logits 為何生成不同句子｜CMU 10-423 第 3 堂"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

模型學會的下一 token 分佈，跟我們怎麼從分佈挑 token，是兩件接續發生的事。這堂要讓你能用同一組 logits 比較 greedy、temperature 與 top-p，也能說清楚改抽樣規則為什麼不等於重新訓練模型。先備是 causal attention、softmax 與負對數概似。

## 訓練把正確續文變成訊號

對一段資料，模型根據每個正確字首預測下一個 token，最小化該 token 的負對數機率。假設三個候選 A、B、C 的 logits 是 [ln 4,ln 2,0]，softmax 的指數為 [4,2,1]，機率是 [4/7,2/7,1/7]。

以下是自擬例子。若正確標籤是 B，loss=−ln(2/7)=1.2528。對每個 logit 的 cross-entropy 梯度為 p−one_hot(y)，因此是 [4/7,−5/7,1/7]。梯度下降會傾向增加 B 的 logit、降低另外兩個；實際參數更新還要沿著 logits 的生成路徑回傳。

這個訊號來自參考資料，不是來自模型自行抽出的答案。一次看到 B 也不表示 A 永遠錯，因為語言有多種合理續文；最大概似把資料裡的相對頻率與上下文關係寫進參數。

## greedy 選的是當下最可能

greedy 對上面的分佈必選 A。它不抽籤，重複同一條件通常得到同一個選擇。可是每步最可能不保證整段最可能：假設選 A 之後最可能的下一步機率是 0.1，選 B 之後最可能下一步機率是 0.9。兩步路徑的機率分別是 (4/7)×0.1=0.0571 與 (2/7)×0.9=0.2571，B 開頭的那條反而高。

這也不表示找全句最大機率就一定最有用。對話可能需要多樣性、程式生成需要可驗證的正確性，任務品質不是一個孤立的序列機率數字。

## temperature 改變分佈的尖銳程度

temperature τ 先把 logits 除以 τ 再做 softmax。τ=1 保留原分佈；τ=2 時權重是 [2,√2,1]，正規化後約 [0.4531,0.3204,0.2265]；τ=0.5 時權重為 [16,4,1]，機率約 [0.7619,0.1905,0.0476]。

τ 越小，較大的 logit 優勢越明顯。這是改抽樣分佈，不是讓模型的知識更可靠。所有有限正 τ 都保留 logits 的排序；τ=0 不應直接拿去做除法，實作一般把它另處理為 greedy。

## top-p 先留下機率質量，再重新正規化

nucleus sampling 把候選按機率排序，取累積機率至少達 p 的最小字首。對原分佈 [4/7,2/7,1/7]，p=0.8 時 A 單獨只有 0.5714，不夠；A+B 為 0.8571，所以留下兩者。重新正規化後機率是 [2/3,1/3,0]。

若 p=0.5，只保留 A；若 p=0.95，三個都保留。top-p 的候選數會隨上下文分佈改變，跟永遠保留 k 個候選的 top-k 不同。不要把 p=0.8 解讀成「選出機率超過 0.8 的每一個 token」，那會在本例得到空集合。

temperature 與 top-p 若一起使用，順序會影響候選集合。先把 τ 設為 2，本例 A+B 機率約 0.7735，未到 0.8，因此 top-p 需保留三個。設定與比較實驗必須記錄完整抽樣流程，而不是隻報一個 temperature。

## 預訓練、微調與生成要分開觀察

預訓練在大量資料上更新參數，微調在另一套任務資料上繼續更新；解碼則用當下參數下的分佈挑選輸出。改提示詞、temperature 或停止條件會改變生成過程，但通常沒有 optimizer step。若模型在窄資料上過度擬合，只調 temperature 不會自動修補資料覆蓋。

評估時可分別記 held-out loss、同一提示的多次生成，以及任務判準。loss 比較需相同 tokenizer、資料與 reduction。生成比較需固定提示與參數，隨機策略則使用多個樣本；單次比較容易把運氣誤認成改善。

## 變式題與答案

原分佈若正確標籤改成 C，loss 是多少？答案是 −ln(1/7)=ln 7=1.9459；梯度為 [4/7,2/7,−6/7]。標籤改變會改訓練訊號，抽樣是否剛好選到 C 並不改這個計算。

原分佈 top-p=0.8 保留 A、B；τ=2 後再 top-p=0.8 呢？三個都保留，因為前兩個的累積質量只約 0.7735。能同時說出集合與重新正規化的分佈，才算真的理解解碼。下一堂再問：位置表示與 KV 共享如何改變產生 logits 的模型本身。

[上一篇](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)｜[下一篇](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Lecture 3 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [GPT-2 technical report](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751)
