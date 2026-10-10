---
title: "李宏毅 ML 2026 HW4：用 decoder-only Transformer 接龍畫寶可夢"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, homework, transformer, image-generation, pytorch]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 10
tldr: "HW4 把「文字接龍」原封不動搬到圖片上：792 張 20×20 的寶可夢小圖，每個像素是 167 色裡的一個 token，一張圖就是 400 個 token 的序列。訓練時做 next-token prediction，測試時給你前 60%，讓模型畫完剩下的 40%。評分同時看 FID 與寶可夢偵測率（PDR），三級 baseline 的提示從「直接跑範例」「調超參數」一路到「換成 Llama、Mistral 架構」。題目、Colab、Kaggle 與資料集都公開，但 JudgeBoi 在 2026-09-30 回傳 502，校外拿不到 FID、PDR 的官方分數。"
description: "台大李宏毅《機器學習 2026 Spring》HW4「Training Transformers」導讀：任務設計、792 張寶可夢與 167 色 colormap、632/80/80 切分、給 60% 補完、FID 與 PDR 兩個指標、simple／medium／strong baseline 提示與超參數範圍、Colab 範例的 GPT-2 設定與存檔策略、繳交規則，以及校外讀者如何自己驗收。"
draft: false
glossary:
  - term: "FID"
    aliases: ["Fréchet Inception Distance"]
    definition: "用 Inception v3 抽出真實圖片與生成圖片的特徵，比較兩組特徵分佈（平均與共變異）之間的 Fréchet 距離；越低代表生成分佈越接近真實分佈。"
    context: "HW4 的主要指標之一，baseline 門檻是 FID ≤ 86／80／73。"
  - term: "PDR"
    aliases: ["Pokémon Detection Rate", "寶可夢偵測率"]
    definition: "助教訓練的分類器判定生成圖片「是寶可夢」的比例。"
    context: "HW4 要求 FID 與 PDR 同時過門檻才算通過 baseline。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW4。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 10 篇。上一篇 [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding) 講模型怎麼知道 token 的順序；這份作業讓你親手訓練一個 decoder-only Transformer，而且訓練對象不是文字，是圖片。

課程頁作業表寫 HW4 在 3/27 公告、04/16/2026 23:59 截止，助教是劉建蘴、馮柏翰、陳品睿。用到的官方材料：

- 作業說明 [hw4.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw4.pdf)（26 頁，首頁標註 Slide Credit: ML2025 spring HW4）
- [Colab 範例](https://colab.research.google.com/drive/1G9CgvnhqQ5AwHc6nbVzVGCoe-xUXdSWB?usp=sharing)（40 個 cells）與課程頁列出的 [Kaggle 版](https://www.kaggle.com/code/stevenlunar/ml2026-spring-hw4-training-transformer)
- 助教說明影片 [ML 2026 Spring HW4 -- Training Transformers](https://youtu.be/QrqdoGf35Iw)

存取等級：題目、範例程式、資料集都公開，屬於 **A3**；缺的是評分鏈，下面會說明。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=QrqdoGf35Iw
title: 影片：ML 2026 Spring HW4 -- Training Transformers
```

原始影片：[影片：ML 2026 Spring HW4 -- Training Transformers](https://www.youtube.com/watch?v=QrqdoGf35Iw)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 任務：把圖片當成一串 token

hw4.pdf 第 3 頁寫明目標：用 transformer decoder-only 模型，對寶可夢圖片做 next-token prediction，學會「現在的 LM 架構怎麼做下一個 token 預測」。

資料的設計很乾淨（第 7–9 頁）：

| 項目 | 內容 |
|---|---|
| 圖片數 | 792 張寶可夢小圖 |
| 切分 | train 632、validation 80、test 80 |
| 尺寸 | 20 × 20 = 400 個像素 |
| 詞彙 | 167 種顏色，每個像素是一個 token；colormap 把 token 對到 RGB，例如 token 0 是白色 |

訓練時，一張圖攤平成 400 個 token 的序列，照語言模型的方式預測下一個 token。測試時給你一張圖的前 60%，要模型生成剩下的部分（第 5–6 頁）。

Colab 的 `PixelSequenceDataset` 把這件事寫得很清楚：train 模式的輸入是 `sequence[:-1]`、標籤是 `sequence[1:]`；dev 模式的輸入是 `sequence[:-160]`、標籤是最後 160 個 token，也就是 400 的 40%。資料從 Hugging Face 載入，dataset 名稱是 `lca0503/ml2025-hw4-pokemon` 與 `lca0503/ml2025-hw4-colormap`，和首頁的 Slide Credit 一致：這份作業沿用 2025 年的 HW4。

把這份作業和上一篇連起來看，會發現一個細節：範例的 GPT-2 設定裡 `n_positions` 是 400，剛好等於一張圖的長度。模型只需要學 400 個位置，不會遇到「訓練短、測試長」的問題。

## 兩個指標，要同時過

- **FID（第 10 頁）**：用 Inception v3 抽真實圖片與生成圖片的特徵，計算兩個分佈之間的 Fréchet 距離。越低越好。
- **PDR（第 11 頁）**：Pokémon Detection Rate，用助教訓練的分類器判斷生成圖片是不是寶可夢。越高越好。

第 12 頁的 baseline 表：

| 級別 | FID | PDR | 預估訓練時間 |
|---|---|---|---|
| simple | ≤ 86.00 | ≥ 0.1 | 約 10 分鐘 |
| medium | ≤ 80.00 | ≥ 0.5 | 約 20 分鐘 |
| strong | ≤ 73.00 | ≥ 0.85 | 30–40 分鐘 |

public、private 各一組，每過一條加 1 分，程式碼繳交另給 4 分。表下註明：**FID 和 PDR 要同時達標**才算過。

## 三級提示

- **Simple（第 13 頁）**：直接執行範例，就能訓練一個 decoder-only 的 GPT-2 生成寶可夢。
- **Medium（第 14 頁）**：調範例裡的 epoch 數與 learning rate，再調模型設定的 attention head 數、embedding 維度、層數。
- **Strong（第 15–17 頁）**：推薦換成 Llama、Mistral 等架構，從 Transformers 套件匯入對應的 Config 類別並設好超參數。可選的做法是自己訓練一個判斷「像不像寶可夢」的分類器，類似 GAN 裡的 discriminator，用它挑 checkpoint。

最後一點值得多看一眼。範例程式存的是**訓練 loss 最低**的 checkpoint，理由寫在第 15、17 頁與 Colab 的 Train 段落：validation set 的重建準確率沒辦法直接反映生成品質。一張圖補完的方式有很多種，逐 token 猜中不等於畫得像。

第 18 頁給了超參數範圍：

| 超參數 | 範圍 | 預設 |
|---|---|---|
| epochs | 30–150 | 50 |
| learning rate | 1e-5–1e-2 | 1e-3 |
| batch size | 8–64 | 16 |
| weight decay | 0.1–1e-5 | 0.1 |
| attention heads | 1–12 | 2 |
| embedding 維度 | 32–512 | 64 |
| 層數 | 1–12 | 2 |

Colab 裡的預設 GPT-2 設定與這張表一致（`n_embd` 64、`n_head` 2、`n_layer` 2），推論時用 `model.generate(..., max_length=400)` 把每張圖補到 400 個 token，輸出成 `reconstructed_results.txt`。

## 繳交規則

- **JudgeBoi（第 19–20 頁）**：只能交一個 `.txt`，剛好 80 行，每行 400 個數字代表一張圖。每天 5 次，UTC+8 23:59 重置，每次評分限時 10 分鐘。
- **NTU COOL（第 21–22 頁）**：交 `ML2026Spring_hw4.ipynb`，不收遲交，不要附模型權重或資料集；程式不合理或無法重現，這份作業 0 分。
- **規定（第 24 頁）**：不准用 GPT-4、Gemini 這類閉源 LLM API，不准找額外資料訓練，不准手動修改預測檔，要固定 random seed 讓助教能重現。

## 校外讀者拿不到的部分

1. **官方分數**：JudgeBoi 的 `ml.ee.ntu.edu.tw` 在 2026-09-30 只回傳 502，FID 與 PDR 都在那裡算。PDR 用的是助教自己訓練的分類器，沒有公開，所以校外**無法重現 PDR**。
2. **COOL**：程式碼繳交與討論區需要台大帳號。
3. **private baseline**：只知道門檻數字，拿不到 private test 的實際結果。

**怎麼做**：用範例的 dev 模式當替代驗收。對 80 張 validation 圖只給前 240 個 token，讓模型補完，用 `pixel_to_image` 畫出來跟原圖並排看；FID 可以用任何公開的 FID 實作，拿 validation 真實圖和補完圖來算。先跑預設設定記下結果，再只改一個超參數，看 FID 往哪邊走。

## 延伸閱讀

- 站上 Stanford CME295 的 [Transformer 技巧導讀](/posts/ai/2026-09-29-cme295-transformer-tricks)與 CMU 11-785 的 [Transformer 架構導讀](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures)，可以補 decoder-only 架構的背景

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)｜下一篇 [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [hw4.pdf（ML 2026 Spring HW4：Training Transformers）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw4.pdf)
- [HW4 Colab 範例程式](https://colab.research.google.com/drive/1G9CgvnhqQ5AwHc6nbVzVGCoe-xUXdSWB?usp=sharing)
- [HW4 Kaggle 版](https://www.kaggle.com/code/stevenlunar/ml2026-spring-hw4-training-transformer)
- [影片：ML 2026 Spring HW4 -- Training Transformers](https://youtu.be/QrqdoGf35Iw)
- [Hugging Face 資料集 lca0503/ml2025-hw4-pokemon](https://huggingface.co/datasets/lca0503/ml2025-hw4-pokemon)
- [GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium（提出 FID，arXiv 1706.08500）](https://arxiv.org/abs/1706.08500)
