---
title: "AI Engineer 面試日練 — 2026-08-24：ML Fundamentals"
date: 2026-08-24
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "今日練 ML 基礎面試：bias-variance 診斷、L1/L2 正則化的幾何直覺、loss function 選型，以及 AdamW 為什麼跟 Adam 加 L2 不一樣。"
tldr: "ML fundamentals 面試考的不是背定義，而是拿到一個 train/val 落差時能不能走出一套診斷流程。今天聚焦四個高頻考點：bias-variance decomposition 與 learning curve 判讀、L1/L2 正則化的幾何直覺與選擇邏輯、loss function 要對齊商業目標而非預設值，以及 AdamW 為什麼把 weight decay 和 L2 正則化拆開處理。"
series:
  name: "AI Engineer 面試日練"
  order: 5
---

> 🌏 [English version](/en/posts/daily/2026-08-24-ai-interview-daily-en)

## 今日主題

ML Fundamentals 是每一輪 ML 面試的地基，不管後面考不考 system design 或 LLM，面試官都會先確認你對 bias-variance、正則化、loss function 這些基本功有沒有紮實理解。junior 候選人能背出定義，senior 候選人能在拿到一個具體的 train/val 數字落差時，馬上說出診斷步驟和下一步要調的旋鈕。

今天不只複習定義，而是練「診斷 → 下藥 → 驗證」這條完整路徑——這正是 Google、Meta、Amazon 這類公司在 phone screen 和 onsite 技術輪最常考的形式。

## 核心概念速記

### Bias-Variance Decomposition

期望測試誤差可以拆成 `Bias² + Variance + 不可約噪音`三項。High bias 代表模型太簡單，training 和 validation 誤差都高且接近；high variance 代表模型太複雜，training 誤差低但 validation 誤差高，兩者差距大。面試時光說「這是 overfitting」不夠，要能講出你會用 learning curve（training/validation 誤差隨資料量或訓練輪數的變化）來確認，而不是直接下結論。

### L1 vs L2 正則化的幾何直覺

L2（ridge）的懲罰是圓形等高線，讓權重平滑地縮向零但很少剛好等於零，適合你相信多數特徵都有一點貢獻、且特徵之間相關時。L1（lasso）的懲罰是菱形，等高線的角落落在座標軸上，所以最佳解常常剛好把某些權重壓成零——這就是自動特徵選擇的來源，但代價是面對高度相關的特徵群組時，選誰、丟誰會不穩定（換一次抽樣結果可能翻盤）。Elastic net 用兩者的加權組合換取「有稀疏性、又不會亂選」。

### Loss Function 要對齊商業目標，不是預設值

多數人直接套用 cross-entropy（分類）或 MSE（迴歸），但這只是起點。目標分布長尾（如營收預測）該用 MAE 或 Huber，因為 MSE 對離群值的懲罰是平方成長，會讓模型把整個梯度預算都花在少數極端值上。類別極度不平衡（如詐欺偵測 1% 正例）該考慮 focal loss，因為標準 cross-entropy 在 99:1 的情況下，模型只要無腦預測負類就能拿到 99% 準確率的局部最優解。面試時的加分句是「先講清楚 loss 要優化什麼商業目標，再選函數」，而不是把 loss function 當成無腦預設。

### AdamW 為什麼跟 Adam + L2 不一樣

這是資深候選人才知道的細節。傳統 L2 正則化把 `λ·w` 加進梯度，但 Adam 會用梯度的二階動量（RMS）去做逐參數的縮放——結果是 L2 懲罰也被這個縮放稀釋了，梯度大的參數反而懲罰變弱，跟正則化「壓制大權重」的初衷相反。AdamW 把 weight decay 從梯度更新中解耦出來，讓每個參數不管梯度大小都乘上同樣的衰減係數。這也是為什麼現在幾乎所有 transformer 訓練都用 `torch.optim.AdamW` 而不是 `Adam(weight_decay=...)`——後者的正則化行為其實是錯的。

## 今日練習題

### 題目

「你的模型在 training set 上的準確率是 92%，但在 validation set 上只有 78%，請走一遍你的診斷流程。」

**來源**：Meta ML Engineer 面試風格題（AI Architect Manoranjan Rajguru 整理分享）　**難度**：中等　**環節**：phone screen / onsite technical

### 拆解思路

1. **先釐清問題**：這是分類還是迴歸任務？train/validation 怎麼切的——隨機切、time-based split，還是有 group 結構（同一使用者的資料會不會同時出現在兩邊）？資料量多大？

2. **建立框架**：先排除「假性 variance」——data leakage、split 方式錯誤（例如時間序列資料用隨機切分導致未來資訊洩漏）、或 train/validation 分布本身就不一致。排除這些之後，才進入 bias-variance decomposition 的正式診斷。

3. **深入核心**：92% vs 78% 是明顯的大缺口，第一直覺是 high variance（overfitting）。用 learning curve 驗證：如果 training 誤差持續低、validation 誤差隨訓練輪數上升，就是典型 overfitting 訊號。下藥要照順序來——先動「capacity」這個最快的旋鈕（減少模型複雜度、減少特徵），再上顯式正則化（L2、dropout、early stopping），最後才考慮蒐集更多資料（成本最高但最可靠）。

4. **收尾**：強調每一步都要用實驗驗證假設，而不是直接套公式；並補一句「如果模型是深度學習模型且已經過了 interpolation threshold，更大的模型反而可能讓誤差再度下降（double descent），所以『變複雜一定會過擬合』不是放諸四海皆準的規則」，這種話會讓面試官知道你跟得上最新的理論進展。

### 範例回答（面試時可以這樣講）

> 看到這個落差，我不會直接說「這是 overfitting，加正則化」，先確認資料切分方式——如果是時間序列資料卻用隨機切分，或是同一個使用者的樣本同時出現在 train 和 validation，這種假性 variance 很常見，得先排除。
>
> 排除掉之後，我會畫 learning curve：training 誤差隨資料量增加會不會持續下降、validation 誤差有沒有隨訓練輪數先降後升。如果確認是真的 high variance，我的下藥順序是：先減模型複雜度（少幾層、少幾個特徵），再上顯式正則化——如果是線性模型用 L2，如果是神經網路先試 dropout 0.3 到 0.5，同時加 early stopping 當作幾乎零成本的安全網。如果這些都做了缺口還在，才考慮蒐集更多資料，這是最可靠但成本最高的做法。
>
> 每一步我都會重跑一次 learning curve 驗證假設，而不是調完參數就直接上線。如果模型是大型神經網路，我還會留意會不會已經過了 interpolation threshold——過度參數化的模型有時候繼續加大反而誤差會再降，這時候「模型太複雜」的直覺可能是錯的。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先排除 data leakage / split 方式錯誤 | |
| 用 learning curve 而非直覺下診斷 | |
| Bias 對應的處置（加特徵、放寬正則化）跟 variance 對應的處置（正則化、更多資料）分清楚 | |
| 下藥有先後順序（capacity → 顯式正則化 → 更多資料） | |
| 每個假設都提到怎麼驗證 | |
| 加分：double descent／過度參數化的例外情況 | |

## 延伸閱讀

- [LastRound AI — Machine Learning Engineer Interview Guide 2026](https://lastroundai.com/blog/ai-ml-engineer-interview-guide) — 完整拆解 Google、Meta、Waymo、Two Sigma 等公司對 bias-variance 和正則化的考法深度差異
- [techinterview.org — Bias-Variance Tradeoff: Underfitting, Overfitting, and How to Fix Both](https://www.techinterview.org/post/3233459969/bias-variance-tradeoff/) — 逐步拆解 learning curve 判讀法，附高 bias／高 variance 的具體修法對照表
- [CalibreOS — Loss Functions: Choosing the Right Objective for Every ML Problem](https://www.calibreos.com/learn/ml-loss-functions) — 涵蓋 MSE/MAE/Huber/focal loss 的選擇框架，以及 AdamW 與 Adam+L2 的差異細節

## 參考資料

- [The Bias-Variance Tradeoff: What Senior ML Engineers Actually Know — Manoranjan Rajguru](https://www.linkedin.com/posts/manoranjan-rajguru_machinelearning-biasvariance-mlinterview-activity-7417073441456959488-sfAM) — 今日練習題來源：Meta 面試風格的 92% vs 78% 診斷題
- [techinterview.org — Bias-Variance Tradeoff](https://www.techinterview.org/post/3233459969/bias-variance-tradeoff/) — 核心概念速記中 bias-variance decomposition 與診斷表的依據
- [prachub.com — List regularization methods and trade-offs (Google Interview Question)](https://prachub.com/interview-questions/list-regularization-methods-and-trade-offs) — L1/L2 正則化選擇邏輯與正則化階層（capacity → 顯式 → 隱式）的依據
- [CalibreOS — Loss Functions](https://www.calibreos.com/learn/ml-loss-functions) — Loss function 對齊商業目標的段落，以及 AdamW 與 Adam+L2 差異的技術細節
