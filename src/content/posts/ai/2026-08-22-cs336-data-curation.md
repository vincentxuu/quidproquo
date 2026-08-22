---
title: "CS336 Lecture 14：Filtering、Dedup 與資料混合才把 raw web 變成訓練語料"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, training-data, deduplication, synthetic-data, llm]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 15
tldr: "第十四講把 raw documents 經語言辨識、品質與安全 filtering、exact/near dedup、source mixing 送進訓練；每一步都會改變模型分布，而 synthetic instruction 與 agent trajectories 又把資料管線延伸到可執行環境。"
description: "Stanford CS336 Spring 2026 Lecture 14 導讀：document filtering、PII/toxicity、exact/near dedup、MinHash、資料混合、epoch cap 與 synthetic reasoning/SWE data。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-data-curation-en)

本篇對應 **CS336 Spring 2026 Lecture 14: Data (filtering, deduplication, mixing, synthetic data)**，2026 年 5 月 13 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_14.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_14.py)。

Lecture 13 找 raw sources；這一講決定哪些內容真正進入 token stream。Filtering、dedup 與 mixing 常被叫做 preprocessing，實際上每一步都在定義模型會學到的分布。

## Filtering 是多個低精度判斷的組合

Raw web 先做格式解析、語言辨識與正文抽取，再處理極短頁面、模板、廣告、程式碼比例、重複符號與低品質文字。Heuristic filters 便宜可解釋；classifier 可學到更複雜品質訊號，卻會把 reference dataset 的偏好放大。

安全與隱私 filtering 會找 PII、惡意內容、成人內容與其他政策類別。False negative 讓風險內容留下，false positive 則可能系統性移除特定方言、社群或敏感議題。門檻需要分來源評估，不能只報全域保留率。

最可靠的管線保留每份 document 的 filter reasons 與 scores，而不是只輸出一個刪除後 corpus。這讓後續能重調 threshold、分析偏差並回到原始 provenance。

## Exact dedup 從 hash 開始

完全相同文件可正規化後 hash，再按 hash 分組只留一份。Hash 讓比較從完整內容縮成固定長度 key，適合 MapReduce；要保留 collision handling、canonical document 選擇與來源映射。

Exact dedup 抓不到只改空白、模板或少量句子的 copies。Near dedup 會把文件表示成 n-gram/shingle 集合，以 Jaccard similarity 比較。MinHash 用少量 signatures 近似集合相似度；locality-sensitive hashing 再把可能相似的文件聚到候選 buckets，避免全配對的平方成本。

Dedup 不只是省 tokens。重複內容會提高 memorization、造成 train/test leakage，也讓少數大量轉載頁在 mixture 中取得不成比例權重。但過度 dedup 也可能刪掉合理重複，例如引用、程式碼 boilerplate 或跨語翻譯。

## Mixing 決定每個來源被看幾次

Uniform mixing 對每個 source 給相同機率；proportional mixing 依 token 數取樣；temperature/α mixing 位在兩者之間。小型高品質 source 若權重過高，會被 epoch 多次而 overfit；大型 web source 若完全按比例，可能淹沒稀有語言或程式碼。

Epoch cap 為每個 source 設定最大重複次數。Regression-based mixing 則訓練許多小模型，學習 mixture weights 到 validation/downstream loss 的映射，再搜尋配置。關鍵是讓小規模實驗模擬大規模的 epoching，否則小模型偏好的高品質小資料會在大 run 被重複過度。

## Synthetic data 不等於無來源資料

Reasoning data 可從人類或合成 prompts 出發，讓 teacher 產生多個 responses，再依 correctness、format 或 reward 過濾。較大的 teacher 不一定是較好的 teacher；sampling diversity、題目品質與可驗證答案往往同樣重要。

Software-engineering data 更難。可從 GitHub PR 建真實 tasks、讓模型注入 bugs 建 semi-synthetic tasks，或產生完整 agent trajectories。Repository dependencies、Docker environments、tests 與防止讀到 future commits 都是資料內容的一部分。沒有可重現 environment，trajectory 只是看起來像解題的文字。

## 一條可稽核的資料管線

每個 stage 輸出 document ID、input snapshot、程式版本、scores/reasons、parent IDs 與 output hash。建立固定 audit samples：隨機保留、隨機刪除、各語言與各 source 的 threshold 邊界案例。Mixing manifest 再記錄 sampling probability、epoch cap 與實際 consumed tokens。

最後用 ablation 小模型比較，不只看 aggregate validation loss，也看語言、程式碼、安全、memorization 與 downstream slices。第十四講的核心是：資料品質不是一個 classifier score，而是一串可以回溯的決策。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義。本文依 filtering、dedup、mixing 與 synthetic data 四部分整理。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 14 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_14.py)
- [DataComp-LM](https://arxiv.org/abs/2406.11794)
- [Dolma](https://arxiv.org/abs/2402.00159)
