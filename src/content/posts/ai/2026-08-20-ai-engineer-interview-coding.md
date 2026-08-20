---
title: "Coding 面試攻略：ML-flavored 程式題的準備策略"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, coding, python, algorithms]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 Coding 環節——與 SWE 面試的差異、ML-flavored 題型分類、numpy/pandas 實作技巧、以及準備策略。"
tldr: "AI Engineer 的 coding 面試和 SWE 不完全一樣——除了 LeetCode medium，還會出 ML-flavored 的題（實作 tokenizer、寫 batch inference pipeline、處理稀疏矩陣）。準備策略：LeetCode medium 練到 70% 通過率就夠，剩下的時間花在 numpy/pandas 操作、資料處理 pipeline、以及 ML 相關的程式題。"
series:
  name: "AI Engineer 面試準備"
  order: 7
---

## AI Engineer Coding 面試和 SWE 面試差在哪

大廠的 AI Engineer coding 面試和 SWE 面試有大約七成重疊——都考資料結構和演算法，都用 LeetCode 風格的題目。但剩下三成的差異決定了你怎麼分配準備時間。

第一個差異是**題目口味**。SWE 面試出 hard 的比例高，AI Engineer 面試通常停在 medium，但會多出一類「ML-flavored」的題——不是純演算法，而是跟機器學習工作流直接相關的程式問題。例如「實作一個簡化版的 BPE tokenizer」或「寫一個 memory-efficient 的 batch inference pipeline」。

第二個差異是**語言偏好**。SWE 面試通常接受任何語言，AI Engineer 面試幾乎都預期你用 Python，而且會考你對 numpy、pandas 這類科學計算庫的熟練度。用 for loop 遍歷一個百萬行的 DataFrame 在面試中會被扣分——面試官期待你用向量化操作。

第三個差異是**評分權重**。在大廠 SWE 面試裡 coding 佔總分的 40-50%，AI Engineer 面試裡通常只佔 20-30%，因為 ML depth 和 system design 吃掉了更多比例。這意味著你不需要把 LeetCode hard 全部啃完，但 medium 必須穩。

## LeetCode 題型分佈

根據面試回報和公開題庫，AI Engineer coding 面試最常考的題型分佈大致是：

| 題型 | 出現頻率 | 典型題目 |
|------|----------|---------|
| Array / Hash Map | 高 | Two Sum、Group Anagrams、Top K Frequent |
| String 處理 | 高 | Longest Substring、Valid Parentheses |
| Sliding Window | 中高 | Maximum Subarray、Minimum Window Substring |
| Tree / Graph 遍歷 | 中 | BFS/DFS、Topological Sort |
| Dynamic Programming | 中低 | 大廠偶爾出 medium DP，新創幾乎不考 |
| Sorting / Searching | 中 | Merge Sort、Binary Search 變體 |
| Linked List / Stack | 低 | 偶爾出現，不是重點 |

關鍵觀察：Array、Hash Map、String 三個類型加起來佔了超過一半的題目。如果準備時間有限，先把這三類的 medium 做到閉眼能寫。

## ML-Flavored 題型

這是 AI Engineer coding 面試獨有的類別，大致分成三種：

### 文字處理與 Tokenization

「實作一個簡化版的 BPE tokenizer」是經典題。面試官不會要你寫完整的 Hugging Face tokenizer，但會要你展示你理解 BPE 的 merge 邏輯——找到頻率最高的 byte pair、合併、重複直到達到目標詞彙量。這類題考的是你能不能把演算法描述翻成可跑的程式。

### Batch Inference Pipeline

「給你一個模型和一百萬筆資料，寫一個 batch inference 函式，要求 memory 不能超過 2GB。」這類題考的是你對 batching、generator、memory management 的理解。好的答案會用 generator 做 lazy loading，用固定大小的 batch 送進模型，並處理最後一個不足 batch size 的尾巴。

### Feature Processing

「給你一個 user event log（CSV，十億行），計算每個用戶過去 7 天的活躍天數。」這類題考的是你能不能用 pandas 或 SQL 風格的操作高效處理大量資料。面試官會追問：如果資料大到放不進記憶體怎麼辦？（答案：chunked reading、Dask、或 streaming processing。）

## numpy/pandas 實作技巧

AI Engineer coding 面試有一個隱性評分標準：你寫的 Python 像不像一個每天在處理資料的人。幾個關鍵技巧：

**向量化優先。** 任何看到 for loop 遍歷 array 或 DataFrame 的地方，都應該先想能不能用向量化操作。numpy 的 broadcasting 和 pandas 的 `.apply()` 雖然也是逐行操作，但至少比 Python for loop 快一個數量級。面試時用 `np.where()` 取代 if-else loop、用 `pd.groupby().agg()` 取代手動聚合，會讓面試官知道你有實務經驗。

**善用 broadcasting。** numpy 的 broadcasting 規則是：shape 從右邊對齊，維度為 1 的自動擴展。面試時如果需要計算兩個向量之間的所有 pairwise 距離，用 `a[:, None] - b[None, :]` 一行搞定，不需要雙重 for loop。

**pandas 的 merge/join。** 很多 feature engineering 的題目本質上是 SQL join。用 `pd.merge()` 做 left join、用 `pd.DataFrame.groupby().transform()` 做 window function，比手動迴圈更清楚也更快。

**矩陣運算取代迴圈。** 如果題目涉及距離計算、相似度、或任何線性代數操作，用 `np.dot()`、`np.linalg.norm()` 這些內建函式。面試官出「計算 cosine similarity」這種題，期待的答案是兩行 numpy，不是二十行 for loop。

## 資料處理 Pipeline

面試中常見的 follow-up 是「如果資料量大到放不進記憶體怎麼辦？」幾個標準答案：

**Generator / Iterator pattern。** 用 `yield` 建立 lazy pipeline，每次只處理一個 batch。這是最基本的答案，面試官至少期待你知道這個。

**Chunked reading。** `pd.read_csv(path, chunksize=10000)` 回傳一個 iterator，每次讀 10000 行。對每個 chunk 做處理後聚合結果。面試時能寫出這個 pattern 就算及格。

**Memory mapping。** numpy 的 `np.memmap()` 可以把一個大 array 映射到磁碟，只在存取時才載入對應的 page。適合需要隨機存取大型 embedding matrix 的場景。

**Streaming aggregation。** 如果只需要聚合統計量（mean、count、sum），不需要把所有資料載入。用 running average 的公式 `new_mean = old_mean + (x - old_mean) / n` 就能在 O(1) memory 下計算。

## 準備策略與時間分配

假設你有 8 週準備時間，coding 部分建議的分配：

**前 4 週（60% 的 coding 時間）：LeetCode 基礎。** 目標是 medium 的通過率達到 70%。每天做 2 題，按題型分類練。不要隨機刷——先把 Array/HashMap 做完，再做 String，再做 Sliding Window。每題限時 30 分鐘，超時就看解答，但要能在隔天不看解答重做一次。

**後 4 週（40% 的 coding 時間）：ML-flavored 題。** 練習實作常見的 ML 工具：BPE tokenizer、mini batch DataLoader、cosine similarity search、streaming feature aggregation。這些題沒有 LeetCode 那種標準答案，但有標準的「好答案應該長什麼樣」——用向量化、處理 edge case（空輸入、最後一個 batch 不足）、寫清楚的函式簽名。

**整個 8 週：每週一次模擬。** 找一個朋友或用 Pramp 做 45 分鐘模擬面試。重點不是解題，而是練「邊寫邊講」——面試時沉默寫 code 是大扣分項，面試官想聽你的思考過程。

## 面試技巧

**先講再寫。** 拿到題目後花 2-3 分鐘確認理解、問 clarifying questions、口述你的 approach。面試官寧可你花 3 分鐘對齊方向，也不要你花 15 分鐘寫完一個錯的方向。

**處理 edge case 要主動。** 不要等面試官問「空陣列怎麼辦」——在寫 code 之前就列出 edge cases：空輸入、單一元素、重複值、溢位。這是 senior 和 junior 的分水嶺。

**時間管理。** 45 分鐘的 coding round，理想分配是：5 分鐘理解和討論、25 分鐘寫 code、10 分鐘測試和優化、5 分鐘 follow-up 討論。如果 20 分鐘還沒開始寫 code，就算你最後寫對了也會被認為效率太低。

**卡住時要講出來。** 面試官不會因為你卡住而直接淘汰你，但會因為你沉默五分鐘而淘汰你。卡住時說「我目前的想法是 X，但我覺得 Y 的部分可能有問題，讓我想一下有沒有其他方式」——這比沉默好一百倍，而且面試官通常會給提示。

## 參考資料

- [LeetCode Patterns for ML Engineers](https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/) — Tech Interview Handbook 的演算法分類整理，適合 AI Engineer 按題型準備 coding 面試
- [Chip Huyen — ML Interviews Book](https://huyenchip.com/ml-interviews-book/) — ML 面試準備指南中的 coding 章節，涵蓋 ML-flavored 題型分類與準備策略
- [NumPy Documentation — Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — numpy broadcasting 規則的官方文件，面試中向量化操作的基礎
