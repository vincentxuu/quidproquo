---
title: "Harvard CS50 AI 綜論（二）：專案組合全景——十二個 Projects 逐一比較、難度分級與技能對照表"
date: 2026-10-22
category: tech
tags: [harvard-cs50ai, ai, projects, comparison, difficulty, portfolio, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 9
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 9
tldr: "綜論第二篇：十二個專案完整比較——算法核心、代碼量、難度、驗收重點、可遷移技能，附難度分級與學習建議。"
description: "Harvard CS50 AI 系列綜論第二篇：十二個專案（Degrees、Tic-Tac-Toe、Knights、Minesweeper、Heredity、PageRank、Crossword、Shopping、Nim、Traffic、Parser、Questions）逐一拆解。比較算法核心、預估代碼行數、難度分級、check50 驗收重點、可遷移技能，提供專案選修與學習順序建議。影片為 2020/2023 錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-22-harvard-cs50ai-synthesis-2-en)

> ⚠️ **版本提醒**：本系列涵蓋講課影片為 **2020 年春季錄製（Week 0–5）與 2023 年重錄（Week 6）**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準。

## TL;DR

十二專案涵蓋搜尋、邏輯、機率、優化、ML、RL、CNN、NLP 七大領域。按難度分三級：入門（Degrees、Shopping）、核心（Tic-Tac-Toe、Knights、Minesweeper、Heredity、PageRank、Nim、Parser、Questions）、挑戰（Crossword、Traffic）。建議嚴格按週序做，專案即時並行。

## 十二專案完整對照表

| # | 專案 | 週次 | 核心算法/技術 | 預估核心代碼行數 | 難度 | check50 關鍵驗收點 | 可遷移核心技能 |
|---|---|---|---|---|---|---|---|
| 1 | **Degrees** | 0 | BFS 圖搜尋、路徑重建 | 30-50 | ⭐ 入門 | 最短路徑正確性、大資料集效能 | 圖搜尋抽象、Frontier 模式、路徑重建 |
| 2 | **Tic-Tac-Toe** | 0 | Minimax + Alpha-Beta | 60-90 | ⭐⭐ 核心 | 不敗策略、深拷貝正確性、終局判定 | 對弈樹搜尋、剪枝、遞迴評估函數 |
| 3 | **Knights** | 1 | Model Checking (邏輯推理) | 40-60 | ⭐⭐ 核心 | 四謎題全解、邏輯編碼正確性 | 命題邏輯建模、模型檢查、知識工程 |
| 4 | **Minesweeper** | 1 | Sentence 知識庫 + 子集推論 | 80-120 | ⭐⭐ 核心 | 安全/地雷推論準確、AI 勝率 | 動態知識庫、前向推理、子集消解 |
| 5 | **Heredity** | 2 | Likelihood Weighting 取樣 | 70-100 | ⭐⭐ 核心 | 機率分佈收斂、先驗/遺傳切換 | 貝氏網路取樣、機率繼承計算 |
| 6 | **PageRank** | 2 | Power Iteration + Random Walk | 50-80 | ⭐⭐ 核心 | 迭代收斂、取樣近似一致、damping factor | 馬可夫鏈平穩分佈、隨機漫步、PageRank |
| 7 | **Crossword** | 3 | AC-3 + Backtracking (MRV/LCV) | 150-250 | ⭐⭐⭐ 挑戰 | 大型填字遊戲解出、約束傳播正確 | CSP 建模、弧一致性、啟發式回溯 |
| 8 | **Shopping** | 4 | k-NN + StandardScaler | 40-60 | ⭐ 入門 | Sensitivity/Specificity 達標、特徵編碼 | 監督式分類管線、特徵預處理、評估指標 |
| 9 | **Nim** | 4 | Q-learning (Table-based) | 60-90 | ⭐⭐ 核心 | 收斂最優策略、ε-greedy 平衡、Q-table 更新 | MDP 建模、表格型 RL、探索/利用 |
| 10 | **Traffic** | 5 | CNN (Keras/TensorFlow) | 80-120 | ⭐⭐⭐ 挑戰 | 測試集準確率、模型儲存/載入格式 | CNN 架構設計、訓練循環、正則化、遷移學習基礎 |
| 11 | **Parser** | 6 | CYK + 遞迴生成 | 60-90 | ⭐⭐ 核心 | 句法判定準確、生成句子合法 | CFG 解析、動態規劃、歧義處理 |
| 12 | **Questions** | 6 | TF-IDF + Cosine Similarity | 80-110 | ⭐⭐ 核心 | 文件/句子檢索準確、答案抽取 | 統計 NLP 管線、向量空間模型、資訊檢索 |

## 難度分級詳細說明

### ⭐ 入門級（適合熱身、建立信心）

**Degrees** - *BFS 最短路徑*
- **為什麼簡單**：distribution code 提供 `Node`、`QueueFrontier`、`neighbors_for_person`，只需實作標準 BFS 迴圈
- **關鍵陷阱**：`result` 不需深拷貝（單路徑）；目標檢查在 enqueue 時做可優化
- **驗收重點**：`check50` 測 small/large 兩資料集，大資料集需在時限內跑完

**Shopping** - *k-NN 分類*
- **為什麼簡單**：scikit-learn `KNeighborsClassifier` 一行搞定；重點在資料清洗與 `evaluate` 實作
- **關鍵陷阱**：`Month` 需轉數值、`VisitorType`/`Weekend` 需布林化；**必須用 `StandardScaler`** 否則距離失真
- **驗收重點**：`evaluate` 回傳 `(sensitivity, specificity)` 而非 accuracy

### ⭐⭐ 核心級（必須精通、面試常考）

**Tic-Tac-Toe** - *Minimax + αβ*
- **核心難點**：`result` **必須深拷貝**（`copy.deepcopy`），否則並行探索多棋盤會互相污染
- **Alpha-Beta 關鍵**：`alpha` 初始 `-inf`、`beta` 初始 `+inf`；剪枝條件 `v >= beta` / `v <= alpha`
- **驗收重點**：`check50` 測試所有合法棋局，AI 必須**永不輸**（平手或贏）

**Knights** - *邏輯謎題編碼*
- **核心難點**：Puzzle 3 最棘手——A 的發言內容未知，但邏輯約束仍可編碼
- **編碼模式**：身分約束 `Or(AKnight, AKnave) ∧ ¬(AKnight ∧ AKnave)` + 發言約束 `Implication(AKnight, statement) ∧ Implication(AKnave, ¬statement)`
- **驗收重點**：需 **100% 通過**（非 70%），四謎題全解

**Minesweeper** - *動態知識庫推理*
- **核心難點**：`add_knowledge` 迭代到無新推論；子集推論 `S1 ⊂ S2 → S2-S1 = c2-c1` 易漏
- **關鍵細節**：`mark_mine` 移除格子時 `count -= 1`；`mark_safe` 移除格子 `count` 不變
- **驗收重點**：AI 能在多種盤面自動推理安全格與地雷

**Heredity** - *貝氏網路取樣*
- **核心難點**：似然權重取樣權重計算：`weight = ∏ P(evidence | parents)`；先驗 vs 遺傳機率切換
- **突變處理**：父母傳遞基因時以 `mutation` 機率翻轉
- **驗收重點**：機率分佈收斂、邊際機率合理

**PageRank** - *馬可夫鏈平穩分佈*
- **核心難點**：無外鏈頁面視為連向所有頁面；迭代收斂門檻 `0.001`；取樣法需大樣本數
- **兩算法一致性**：`check50` 會比對 Iterative vs Sampling 結果接近度
- **驗收重點**：PageRank 值和為 1（正規化）

**Nim** - *Q-learning*
- **核心難點**：狀態用 `tuple(piles)` 作 Q-table 鍵；`update` 公式 `Q ← Q + α(R + γ max Q' - Q)`；γ=1（有限步遊戲）
- **探索策略**：訓練時 `ε=0.1` 探索，推論時 `ε=0` 純貪婪
- **驗收重點**：訓練後 AI 對戰人類/隨機策略勝率極高

**Parser** - *CYK 句法分析*
- **核心難點**：文法需轉 CNF（distribution 已處理）；CYK 表填充順序：長度 1→n，分割點 k
- **生成邏輯**：遞迴隨機選擇產生規則，終結符直接輸出
- **驗收重點**：判定合法/非法句子正確、生成句子符合文法

**Questions** - *TF-IDF 問答*
- **核心難點**：TF 正規化（除以 max TF）、IDF 用 `log(N/df)`、餘弦相似度稀疏向量計算
- **兩階段檢索**：先找文件，再找句子；句子級用「查詢詞覆蓋密度」作 tie-break
- **驗收重點**：對每問題輸出最佳答案句子

### ⭐⭐⭐ 挑戰級（耗時最長、綜合考驗）

**Crossword** - *CSP 完整求解器*
- **為什麼最難**：需正確串接 AC-3 → MRV → LCV → Forward Checking → Backtracking，任一環節錯誤導致指數爆炸
- **關鍵優化**：
  - `add_constraints` 建立所有重疊約束
  - `forward_check` 指派後立即過濾鄰居域
  - `count_conflicts` 實作 LCV 排序
- **驗收重點**：大型結構（如 `structure3.txt`）需在合理時間內解出

**Traffic** - *CNN 訓練*
- **為什麼難**：非演算法題、而是**深度學習工程題**——架構設計、超參數調整、訓練穩定性
- **關鍵決策**：
  - 幾層 Conv2D、多少 filters、kernel size
  - BatchNorm 位置（Conv 後、ReLU 前/後爭議）
  - Dropout 率、Learning Rate、Early Stopping patience
- **驗收重點**：`check50` 載入 `traffic_model.h5` 在隱藏測試集評分，**準確率門檻較高**（約 95%+）

## 學習順序與時間建議

```
Week 0: Degrees (2-4h) → Tic-Tac-Toe (4-6h)
Week 1: Knights (3-5h) → Minesweeper (6-10h)
Week 2: Heredity (4-6h) → PageRank (3-5h)
Week 3: Crossword (10-20h) ⚠️ 預留足夠時間
Week 4: Shopping (2-3h) → Nim (4-8h)
Week 5: Traffic (6-15h) ⚠️ 視 GPU/CPU 而定，含調參
Week 6: Parser (3-5h) → Questions (4-7h)
```

**總預估**：60-100 小時（含除錯、重構、check50 迭代）

## 專案技能遷移地圖

```
圖搜尋基礎 (Degrees)
    │
    ├─► 對弈搜尋 (Tic-Tac-Toe)
    │     │
    │     └─► MCTS、AlphaZero 思想源頭
    │
    ▼
邏輯推理 (Knights, Minesweeper)
    │
    ├─► SAT Solver、SMT Solver 基礎
    │
    ▼
機率推論 (Heredity, PageRank)
    │
    ├─► 變分推論、MCMC、貝氏優化
    │
    ▼
約束求解 (Crossword)
    │
    ├─► 排程、路徑規劃、組合優化
    │
    ▼
傳統 ML (Shopping)
    │     │
    │     └─► 特徵工程、模型選擇、評估
    │
    ▼
表格型 RL (Nim)
    │     │
    │     └─► Deep Q-Network (DQN)、Actor-Critic
    │
    ▼
深度學習 (Traffic)
    │     │
    │     └─► ResNet、EfficientNet、ViT、物件偵測
    │
    ▼
統計/符號 NLP (Parser, Questions)
          │
          └─► Transformer、BERT、GPT、RAG
```

## 常見卡關點與解法

| 專案 | 常見卡關 | 解法 |
|---|---|---|
| Tic-Tac-Toe | AI 有時輸 | 檢查 `result` 是否 `deepcopy`、Alpha-Beta 界限更新正確 |
| Minesweeper | 陷入無限迴圈 | `add_knowledge` 中 `inferred` 旗標邏輯、清理空句子 |
| Crossword | 跑太久/解不出 | 確認 AC-3 正確、MRV/LCV 啟發式生效、Forward Checking 剪枝 |
| Heredity | 機率不收斂 | 增加樣本數 N、檢查權重計算、先驗/遺傳邏輯 |
| Traffic | 準確率不達標 | 加深網路、增加 Dropout、調學習率、資料增強、確認正規化 |

## 系列連結

- [Overview 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) (order 0)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search) (order 1)
- [Week 1 Knowledge](/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge) (order 2)
- [Week 2 Uncertainty](/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty) (order 3)
- [Week 3 Optimization](/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization) (order 4)
- [Week 4 Learning](/posts/tech/2026-09-24-harvard-cs50ai-w04-learning) (order 5)
- [Week 5 Neural Networks](/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks) (order 6)
- [Week 6 Language](/posts/tech/2026-10-08-harvard-cs50ai-w06-language) (order 7)
- [綜論一：知識弧線](/posts/tech/2026-10-15-harvard-cs50ai-synthesis-1) (order 8)
- **本篇：綜論二（本文）**(order 9)
- [總結：永恆與變遷、下一步](/posts/tech/2026-10-29-harvard-cs50ai-wrapup) (order 10)

## 參考資料

- [CS50 AI Projects 總覽](https://cs50.harvard.edu/ai/projects/) — 十二專案規格連結
- 各專案規格頁：Degrees、Tic-Tac-Toe、Knights、Minesweeper、Heredity、PageRank、Crossword、Shopping、Nim、Traffic、Parser、Questions
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明