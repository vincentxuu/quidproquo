---
title: "Harvard CS50 AI 綜論（一）：從搜尋到語言——七週 AI 知識弧線的完整圖譜"
date: 2026-10-15
category: tech
tags: [harvard-cs50ai, ai, synthesis, search, logic, probability, optimization, learning, neural-networks, language, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 8
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 8
tldr: "綜論第一篇：梳理七週主題如何從符號搜尋一路延伸到語言模型，揭示古典 AI 到現代 ML 的知識脈絡與設計哲學。"
description: "Harvard CS50 AI 系列綜論第一篇：從 Week 0 Search 到 Week 6 Language，七週主題如何構成一條完整的 AI 知識弧線。分析符號主義到連結主義的演進邏輯、每週核心抽象的遞進關係、專案設計如何對應理論重點。影片為 2020/2023 錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-15-harvard-cs50ai-synthesis-1-en)

> ⚠️ **版本提醒**：本系列涵蓋講課影片為 **2020 年春季錄製（Week 0–5）與 2023 年重錄（Week 6）**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準。

## TL;DR

七週主題不是孤立知識點，而是一條刻意設計的知識弧線：從確定性搜尋 → 邏輯推理 → 機率不確定性 → 組合優化 → 監督/強化學習 → 神經網路 → 語言模型。每週核心抽象層層遞進，專案精準對應理論重點。

## 知識弧線全景圖

```
Week 0: Search          ──►  狀態空間、目標導向、最優路徑
         │
         ▼
Week 1: Knowledge       ──►  符號表示、演繹推理、模型檢查
         │
         ▼
Week 2: Uncertainty     ──►  機率圖模型、貝氏推論、隨機過程
         │
         ▼
Week 3: Optimization    ──►  局部搜尋、約束滿足、組合爆炸應對
         │
         ▼
Week 4: Learning        ──►  從資料歸納、試錯學習、函數逼近
         │
         ▼
Week 5: Neural Networks ──►  分佈式表示、反向傳播、深度抽象
         │
         ▼
Week 6: Language        ──►  序列建模、注意力、Transformer 前夜
```

## 三大階段演進邏輯

### 階段一：符號主義與確定性推理（Week 0–1）

**核心問題**：在完全可觀測、確定性環境中，如何找到最優解？

| 週次 | 核心抽象 | 關鍵洞察 |
|---|---|---|
| Week 0 Search | **狀態空間圖** + **Frontier 策略** | 搜尋策略 = 資料結構選擇；Minimax 將對弈轉為樹搜尋 |
| Week 1 Knowledge | **命題邏輯** + **模型檢查/Resolution** | 世界 = 符號 + 規則；推理 = 語法操作保真語義 |

**設計哲學**：AI = 搜尋 + 知識表示。Degrees（BFS 圖搜尋）與 Tic-Tac-Toe（Minimax 樹搜尋）分別驗證無資訊/有資訊搜尋與對弈搜尋。Knights（模型檢查邏輯謎題）與 Minesweeper（Sentence 知識庫推理）驗證符號推理系統。

### 階段二：不確定性與優化（Week 2–3）

**核心問題**：現實世界不完全可觀測、有噪聲、組合爆炸，如何決策？

| 週次 | 核心抽象 | 關鍵洞察 |
|---|---|---|
| Week 2 Uncertainty | **貝氏網路** + **馬可夫模型** | 條件獨立 = 圖結構；推論 = 變數消去/取樣；PageRank = 平穩分佈 |
| Week 3 Optimization | **CSP** + **局部搜尋/退火** | 約束傳播縮減域；啟發式引導回溯；退火接受劣解跳脫局部最優 |

**設計哲學**：從「精確推理」轉向「近似推理與搜尋」。Heredity（似然權重取樣）驗證貝氏網路近似推論；PageRank（迭代/取樣）驗證馬可夫鏈平穩分佈；Crossword（AC-3 + MRV/LCV 回溯）驗證 CSP 求解完整流程。

### 階段三：從資料學習到表示學習（Week 4–6）

**核心問題**：不預設規則，直接從資料學習函數映射。

| 週次 | 核心抽象 | 關鍵洞察 |
|---|---|---|
| Week 4 Learning | **監督式分類** + **強化學習 MDP/Q-learning** | k-NN/SVM 記憶/邊界；Q-learning 從經驗學價值函數 |
| Week 5 Neural Networks | **反向傳播** + **CNN/分佈式表示** | 鏈式法則高效計算梯度；卷積捕捉平移不變性 |
| Week 6 Language | **N-gram/TF-IDF** + **Attention/Transformer** | 統計語言模型 → 神經語言模型；注意力實現動態上下文 |

**設計哲學**：「特徵工程」→「表示學習」→「注意力機制」。Shopping（k-NN 手工特徵）與 Nim（Q-table 表格型 RL）展示傳統 ML/RL；Traffic（CNN 端到端學習特徵）展示表示學習；Parser（CFG 符號文法）與 Questions（TF-IDF 統計檢索）展示符號/統計 NLP，為 Attention 鋪路。

## 核心抽象的遞進關係

```
搜尋問題五要素 (Week 0)
    │
    ├─► 狀態、動作、轉移、目標、代價
    │
    ▼
知識庫 + 推理規則 (Week 1)
    │
    ├─► 符號、連結詞、模型、蘊含
    │
    ▼
機率圖模型 (Week 2)
    │
    ├─► 隨機變數、條件獨立、聯合分佈
    │     │
    │     └─► 精確推論指數級 → 近似取樣
    │
    ▼
約束滿足問題 (Week 3)
    │
    ├─► 變數、域、約束 → 弧一致性縮減域
    │     │
    │     └─► 回溯 + 啟發式 = 實用求解器
    │
    ▼
監督式學習：假設空間搜尋 (Week 4)
    │
    ├─► k-NN：實例基礎、無參數
    ├─► SVM：最大間隔、核技巧
    │
    ▼
強化學習：序列決策 (Week 4)
    │
    ├─► MDP：狀態、動作、獎勵、轉移、折扣
    └─► Q-learning：無模型、離線策略、收斂
    │
    ▼
神經網路：可微分函數逼近器 (Week 5)
    │
    ├─► 反向傳播 = 鏈式法則自動微分
    ├─► CNN = 參數共享 + 區域感受野
    │
    ▼
語言模型：序列條件機率 (Week 6)
    │
    ├─► N-gram：馬可夫假設、計數統計
    ├─► TF-IDF：詞重要度加權
    └─► Attention：動態上下文、並行計算
```

## 專案設計映射理論重點

| 專案 | 對應週次 | 核心算法 | 教學目的 |
|---|---|---|---|
| Degrees | 0 | BFS | 圖搜尋最短路徑、Frontier 抽象 |
| Tic-Tac-Toe | 0 | Minimax + αβ | 對弈樹搜尋、剪枝優化 |
| Knights | 1 | Model Checking | 邏輯謎題 → 符號推理 |
| Minesweeper | 1 | Sentence + 推理 | 動態知識庫、子集推論 |
| Heredity | 2 | Likelihood Weighting | 貝氏網路近似推論 |
| PageRank | 2 | Power Iteration / Sampling | 馬可夫鏈平穩分佈 |
| Crossword | 3 | AC-3 + Backtracking | CSP 完整求解流程 |
| Shopping | 4 | k-NN + 標準化 | 監督式分類基線、特徵預處理 |
| Nim | 4 | Q-learning | 表格型 RL、探索/利用 |
| Traffic | 5 | CNN + Keras | 端到端表示學習、圖像分類 |
| Parser | 6 | CYK + 生成 | CFG 句法分析、歧義處理 |
| Questions | 6 | TF-IDF + Cosine | 統計檢索、問答管線 |

## 2020/2023 錄影在 2026 年的意義

| 主題 | 2020/2023 版本狀態 | 2026 年仍核心的部分 | 已演進/缺失的部分 |
|---|---|---|---|
| Search/Logic | 2020 錄影 | DFS/BFS/A*/Minimax/邏輯推理 | 無 |
| Probability/Optimization | 2020 錄影 | 貝氏網路/馬可夫/AC-3/退火 | 變分推論、MCMC 進階 |
| Supervised/RL | 2020 錄影 | k-NN/SVM/Q-learning 基礎 | 深度 RL、Off-policy evaluation |
| Neural Networks | 2020 錄影 | 反向傳播/CNN/優化器 | Transformer、ViT、擴散模型、LLM 微調 |
| Language | 2023 重錄 | N-gram/TF-IDF/Attention 基礎 | LLM、RAG、Agent、指令微調、RLHF |

**結論**：前五週的「古典 AI 核心」在 2026 年仍是必修內功；Week 6 的 Attention 引入雖晚，但奠定了理解現代 LLM 架構的最低門檻。缺口在應用層（Prompt Engineering、RAG、Agent、評測），需另行補充。

## 學習路徑建議

1. **必做順序**：Week 0 → 1 → 2 → 3 → 4 → 5 → 6（嚴格依賴關係）
2. **專案並行**：每週講課後立即做專案，不要囤積
3. **數學補強**：
   - Week 0–1：離散數學（圖論、邏輯）
   - Week 2：機率論（貝氏、馬可夫）
   - Week 3：組合優化、啟發式
   - Week 4–5：線性代數、微積分（梯度）、凸優化
   - Week 6：資訊理論、統計 NLP
4. **現代補充**：完成 CS50 AI 後，建議接著學習：
   - 《Deep Learning with Python》（Chollet）補 Keras 實戰
   - 《Dive into Deep Learning》補 Transformer/LLM 完整架構
   - Hugging Face Course 學習微調、RAG、Agent

## 系列連結

- [Overview 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) (order 0)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search) (order 1)
- [Week 1 Knowledge](/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge) (order 2)
- [Week 2 Uncertainty](/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty) (order 3)
- [Week 3 Optimization](/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization) (order 4)
- [Week 4 Learning](/posts/tech/2026-09-24-harvard-cs50ai-w04-learning) (order 5)
- [Week 5 Neural Networks](/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks) (order 6)
- [Week 6 Language](/posts/tech/2026-10-08-harvard-cs50ai-w06-language) (order 7)
- **本篇：綜論一（本文）**(order 8)
- [綜論二：專案組合比較](/posts/tech/2026-10-22-harvard-cs50ai-synthesis-2) (order 9)
- [總結：永恆與變遷、下一步](/posts/tech/2026-10-29-harvard-cs50ai-wrapup) (order 10)

## 參考資料

- [CS50 AI OpenCourseWare 主站](https://cs50.harvard.edu/ai/) — 所有週次、專案、影片、規格
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- 各週 Notes（2020 版 Week 0–5，2023 版 Week 6）
- 各專案規格頁與 check50 slug（`ai50/projects/2024/x/...`）
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
- 站內：[Harvard AI/ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) — CSCI S-80 版本對照