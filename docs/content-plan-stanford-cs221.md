# 內容規劃：Stanford CS221 逐講系列

- 來源：Stanford CS221, **Autumn 2025**（官方課表 20 lectures）
- Canonical manifest：[課程網站](https://stanford-cs221.github.io/autumn2025/)與[可執行講義 repo](https://github.com/stanford-cs221/autumn2025-lectures)
- 規模：20 篇 × zh-TW/en = 40 個新 Markdown；既有雙語總覽為 order 1，不改 slug/date
- 資料成熟度：L3。Lecture 1–18 有官方公開講義與 Stanford Online 影片；Lecture 19 以官方 Google Slides（deck author / credited presenter: Rishi Bommasani；不推定現場講者）與課表為主；Lecture 20 以官方影片與可辨認的字幕內容為主
- Fidelity-complete：**20/20**（Lecture 1–20 已依 official video/PDF/executable artifacts 深度重寫；L19 的逐段 editorial/source parity 與全系列 lecture-specific TLDR 已完成，L19/L20 材料邊界亦明示）。
- Publishable：**0/20**（全部維持 `draft: true`，等待獨立 review；fidelity-complete 不等於已核准發布）。

## 編輯契約

1. 一篇對應課表的一個 lecture，series reading order 為 2–21。
2. 全系列只使用 Autumn 2025，不以 Spring 2025 舊模組填補新學期內容。
3. 每篇開頭列課號、學期、講次、日期、講者、官方材料與缺口。
4. Lecture 1–18 以 executable lecture 或 PDF 為主要書面證據；影片用來補足口頭脈絡。Lecture 19–20 明示書面材料較少。
5. 課程內容與站方補充分開；公式、演算法、例子與限制在中英文稿保持一致。
6. 中文目標 6,000–9,500 字元；若 executable lecture 本身是短單元，寧可忠實短寫，不跨講灌水。

## Manifest

| Order | Lecture | Date | Official title | Core artifact | Planned slug |
|---:|---:|---|---|---|---|
| 2 | 1 | 2025-09-22 | Overview | welcome, history, tensors | `overview-intelligence-tensors` |
| 3 | 2 | 2025-09-24 | Learning I | backpropagation, linear regression | `learning-backprop-regression` |
| 4 | 3 | 2025-09-29 | Learning II | linear classification | `learning-linear-classification` |
| 5 | 4 | 2025-10-01 | Learning III | deep learning | `learning-deep-networks` |
| 6 | 5 | 2025-10-06 | Search I | search | `search-modeling-dp` |
| 7 | 6 | 2025-10-08 | Search II | UCS and A* | `search-ucs-astar` |
| 8 | 7 | 2025-10-13 | MDPs I | mdp | `mdp-value-iteration` |
| 9 | 8 | 2025-10-15 | MDPs II | reinforcement learning | `reinforcement-learning-q-learning` |
| 10 | 9 | 2025-10-20 | MDPs III | policy gradient | `policy-gradient` |
| 11 | 10 | 2025-10-22 | Games I | games | `games-minimax-alpha-beta` |
| 12 | 11 | 2025-10-27 | Games II | TD learning, simultaneous games | `games-td-nash` |
| 13 | 12 | 2025-10-29 | Bayesian Networks I | bayes | `bayes-joint-inference` |
| 14 | 13 | 2025-11-03 | Bayesian Networks II | Gibbs sampling | `bayes-gibbs-sampling` |
| 15 | 14 | 2025-11-05 | Bayesian Networks III | Bayes learning | `bayes-learning-em` |
| 16 | 15 | 2025-11-10 | Logic I | propositional logic | `logic-propositional-sat` |
| 17 | 16 | 2025-11-12 | Logic II | first-order logic | `logic-first-order` |
| 18 | 17 | 2025-11-17 | Language Models | PDF | `language-models` |
| 19 | 18 | 2025-11-19 | AI & Society | society | `ai-society` |
| 20 | 19 | 2025-12-01 | AI Supply Chains | official Google Slides; Rishi Bommasani deck author / credited presenter only | `ai-supply-chains` |
| 21 | 20 | 2025-12-03 | Fireside Chat, Conclusion | official video | `fireside-conclusion` |

## 驗證

- 每批：`pnpm check:references`、`pnpm check:lang-parity`、中文 `pnpm check:tw`
- 系列：order 1–21 連續；20 個 lecture IDs 各出現一次
- 最終：`pnpm verify`

## Draft audit（2026-08-22）

第一版 20 組文章只有摘要骨架，平均中文字元約 1,703，不符合 agenda-complete，已全部改為 `draft: true`，完成度歸零。機械品質閘門通過不代表內容完成。

Lecture 1–5 必須依下列 agenda 重寫，不能沿用共用模板段落：

| Lecture | Official artifact agenda | Current coverage verdict |
|---:|---|---|
| 1 | `welcome`: AI 定義、perceive/reason/act/learn、計算與資訊限制、課程目標與改版；`history`: pretrained LMs、scaling、reasoning、industrialization；`tensors`: rank/shape、建立與 slicing、batch/sequence/image shapes、einsum | 不完整：只有世界觀與 tensor 概述，缺改版、完整歷史段、einsum 與 shape 操作 |
| 2 | `backpropagation`: einsum 暖身、objective、有限差分、計算圖、chain rule、reverse-mode；`linear_regression`: model、squared loss、gradient descent、training loop、泛化 | 不完整：只有 backprop 與 regression 概述，缺有限差分、圖上推導、完整訓練與泛化 |
| 3 | `linear_classification`: score、argmax、softmax、cross-entropy、maximum likelihood、gradient、multiclass、bag-of-words 與 sentiment | 不完整：缺最大概似推導、gradient 與 artifact 的 operations／representation agenda |
| 4 | `deep_learning`: 手寫 computation graph、PyTorch autograd、detach、linear layer、cross-entropy、optimizer、完整 loop、hidden layers／nonlinearity | 不完整：缺 artifact 中逐步 computation graph 與完整訓練迴圈細節 |
| 5 | `search`: problem components、state design、solution/cost、exhaustive search、重複子問題、memoization／DP、複雜度與 modeling failures | 不完整：缺 executable example 的展開順序、memoization 推導與複雜度 |

Lecture 1–5 沒有「材料很短」的篇幅例外：每講都有足以支撐完整長文的 executable artifacts。未達 6,000 中文字元前維持 draft；英文稿需相同 agenda 與例子後才可計完成。
