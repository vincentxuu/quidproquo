---
title: "高效推論：FlashAttention、KV cache 與推測解碼｜CMU 10-423 第 18 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 26
draft: false
description: "以完整數值例子與變式答案理解高效推論：FlashAttention、KV cache 與推測解碼。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 三種方法，省的是不同成本

[FlashAttention](https://arxiv.org/abs/2205.14135)減少 attention 的記憶體 IO，KV cache 避免逐 token 重算歷史 key/value，[推測解碼](https://arxiv.org/abs/2211.17192)用便宜 draft model 提案，再由 target 驗證多個候選。先備是[attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)與[解碼](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)。本篇要算分塊 softmax 與接受／拒絕機率，不能把所有加速混稱少算 token。

一般 attention 建立 QKᵀ 分數與 softmax 權重，長度 n 會有 n² 個配對。FlashAttention 在較快的小記憶體中分塊計算並維護線上 softmax，不把完整 n×n 權重矩陣寫回 HBM。數學上仍是 exact attention，浮點結果可有誤差；它不是任意略掉部分 attention 邊的 sparse 近似，也沒有消除所有二次算術。

## 分塊讀取仍得到同一答案

自擬一個 query，logits 為 [0,log 3]，values 為 [2,6]，完整 softmax 輸出為 5。逐塊讀第一项，running max m=0、分母 l=1、未正規化加權和 o=2。第二項的新最大值 m'=log 3；旧累積要乘 exp(m−m')=1/3，新的項權重為 1。所以 l'=1/3+1=4/3，o'=2/3+6=20/3，最終 o'/l'=5。

關鍵是最大值更新時同步縮放分母與加權和。若只把第二個 value 加進來，再各塊自己正規化，會得到錯答案。這個例子展示 online normalization；實際 kernel 還包含 tiling、平行排程與 backward 的策略。

## Prefill 與 decode 的 KV 成本

Prefill 一次處理 prompt；decode 每步新增一個 token。Cache 儲存歷史 K/V，讓新 query 讀舊表示，而非每步重算歷史投影。自擬 2 層、4 個 KV heads、head dim 8、長度 10、FP16 的 cache 大小為 2(K/V)×2層×4heads×8×10×2bytes=2560 bytes，未含其他 tensor。長度翻倍，cache 也翻倍。

GQA 減少 KV heads，可降低這项記憶體；它不直接縮短上下文。[PagedAttention](https://arxiv.org/abs/2309.06180)改善 cache 的配置、共享與碎片问題，與 FlashAttention 的 IO 最佳化不是同一件事。Decode 常受權重或 KV 搬移影響；實際瓶頸依 batch、模型與硬體量測。

## 推測解碼為何不能直接信 draft

自擬 vocabulary 只有 a/b，target 分布 p=[0.6,0.4]，draft q=[0.8,0.2]。先由 q 抽候選，若抽到 a，接受機率 min(1,p(a)/q(a))=0.75；若抽到 b，接受機率為 1。接受 a 的總質量為 0.8×0.75=0.6，接受 b 為 0.2，剩餘拒絕質量為 0.2。

拒絕後從正部殘差 normalize(max(p−q,0)) 抽樣，本例只剩 b，所以拒絕質量全部補給 b。總輸出成為 [0.6,0.4]，與 target 一樣。若拒絕後仍從 q 抽，便破壞分布校正。此為標準採樣推測解碼的理想分布論證；greedy 變體的驗證規則不同。

## 變式練習與答案

若 draft 與 target 分布完全相同，每個提案都接受，但加速仍取決於 draft 成本、驗證與排程。若 q=[0.2,0.8]，a 接受率為 1、b 為 0.5，拒絕後只補 a，仍還原 p。若使用 temperature 或 top-p，p/q 必須對應實際採樣分布，不能用處理前的 logits 機率偷換。驗收同时看輸出分布／greedy 一致性與延遲、吞吐；速度快不能取代正確性。下一篇[長上下文](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context)再把長度與可用性分開。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 18 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Primary paper](https://arxiv.org/abs/2211.17192)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
