---
title: "台大李宏毅 ML 2026 導讀：HW9 Flow Matching——從 VAE 走到 MeanFlow，再用一個 Swiss roll 比推論步數"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, flow-matching, diffusion-model, generative-models]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 19
tldr: "HW9 共 19 題、10 分，只在 NTU COOL 作答、不交程式。前 16 題讀四篇論文：DDPM、Flow Matching、Rectified Flow、MeanFlow，最後幾題要你橫向比較訓練訊號與少步生成；後 3 題要跑 Colab：在 2D Swiss roll 上訓練兩個小 MLP，一個是學瞬時速度的 Flow Matching（固定用 Euler 50 步評估，Histogram JS ≤ 0.10 才算收斂），一個是學平均速度的 MeanFlow（固定 1 步生成，≤ 0.40），再比較 1 步對 1 步、Euler 不同步數、Euler 與 RK4 在相同步數與相近算力下的差別。作業 PDF 附了一份省略大部分數學的生成模型教學，題目中英雙語全部公開；校外拿不到的只有 COOL 上的評分與解答。"
description: "台大李宏毅《機器學習 2026 Spring》HW9「Flow Matching」導讀，依 hw9.pdf、作業 Colab 與助教說明影片：三支先備影片、作業 PDF 的生成模型教學（VAE → Diffusion → Score-based → Flow Matching → MeanFlow）、19 題的分配與各論文考什麼、Colab 的 Swiss roll 資料、FlowNet 與 MeanFlowNet、MeanFlow 的 JVP 訓練目標、Histogram JS 指標與收斂標準、Euler 與 RK4 的算力比較，以及校外自學的限制。"
draft: false
glossary:
  - term: "NFE"
    aliases: ["number of function evaluations", "模型呼叫次數"]
    definition: "生成一個樣本時呼叫神經網路的次數。Euler 每步呼叫 1 次，RK4 每步約 4 次。"
    context: "HW9 用它說明 diffusion／flow 模型的品質與效率取捨，也用它設計 Euler 20 步對 RK4 5 步的公平比較。"
  - term: "MeanFlow"
    aliases: ["Mean Flows", "平均速度場"]
    definition: "不學某一瞬間的速度，而是學一段時間區間 [r, t] 內的平均速度 u(z, r, t)，因此可以一步從噪聲跨到資料。"
    context: "HW9 Colab 用 JVP 算出 u 對時間方向的導數，組成訓練目標 v − (t − r)·du/dt。"
  - term: "Histogram JS"
    aliases: ["Jensen-Shannon divergence", "JSD"]
    definition: "把目標點雲和生成點雲都畫到同一個 64×64 網格上數點、正規化成機率分布，再算兩者的 Jensen-Shannon divergence。越低越好。"
    context: "HW9 的收斂標準：Flow Matching ≤ 0.10，MeanFlow 1 步 ≤ 0.40。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW9。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 19 篇。上一篇是正課最後一講 [AI 自我成長（下）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)。這份作業和本學期任何一講都沒有直接對應，生成模型的觀念要靠先備影片補。

用到的官方材料：作業說明 [hw9.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw9.pdf)（前 23 頁是說明，後面是中英兩版題目）、[作業 Colab](https://colab.research.google.com/drive/1R1CNujj6-kVPkl53RQLt5kE7tYVS-Zmp?usp=sharing)（57 個 cell），以及課程頁列出的助教說明影片 [ML 2026 Spring HW9 - Flow Matching](https://youtu.be/wAAeuMQ9r5c)。課程頁寫 5/22 公告，截止時間 2026/06/11 23:59:59（UTC+8），不收遲交，成績在 2026/06/14 前公布。助教是林育正、吳岳霖、林禹融、蘇炳揚、陳品睿、江履方。

## 存取等級：A3，但沒有官方解答

- **拿得到**：作業 PDF、Colab 起始碼，以及 19 題的完整題目，中英兩版都印在 PDF 裡。
- **拿不到**：作答在 NTU COOL，需要台大帳號，校外看不到評分，也拿不到解答。本文不提供任何題目的答案。
- **硬體**：Colab 開頭要你開 T4 或其他 GPU。資料是 2D 點、模型是小 MLP，負擔很輕。

## 先備：三支舊影片

PDF 第 3–5 頁要求先看三支李宏毅的影片，本學期沒有新的對應講次：

1. [Flow-based Generative Model](https://www.youtube.com/watch?v=uXY18nzdSsM)（ML2019 Spring）
2. [【生成式AI】Diffusion Model 原理剖析](https://www.youtube.com/watch?v=ifCDXFdeaaM)
3. [【生成式人工智慧與機器學習導論2025】第 9 講：影像和聲音上的生成策略](https://www.youtube.com/watch?v=ccqCDD9LqCA)

站上可以替代的中文導讀：[MIT 6.S184 L2：Flow matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching) 從條件路徑推到邊際向量場，[CMU 11-785 Lecture 23：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)則講 DDPM 這一側。

## 作業 PDF 附的教學：一條從 VAE 到 MeanFlow 的線

PDF 第 6 頁寫明作業目標：認識以 diffusion 和 flow 為基礎的主流生成模型，再**比較它們推論時的效率**。建議讀四篇論文取得全貌：[DDPM](https://arxiv.org/abs/2006.11239)、[Flow Matching](https://arxiv.org/abs/2210.02747)、[Rectified Flow](https://arxiv.org/abs/2209.03003)、[MeanFlow](https://arxiv.org/abs/2505.13447)。接著第 7–16 頁給了一份「省略大部分數學」的教學，順序本身就是一條好讀的線：

1. **生成模型的目標**（第 7 頁）：學會把一個容易取樣的分布（例如高斯）搬運到資料分布。
2. **VAE**（第 8 頁）：學一個接近高斯的 latent，再 decode 回資料。ELBO 的推導省略，PDF 指向 [ML 2025 Fall HW4 的數學題](https://ntueemlta2025.github.io/homeworks/hw4/ml-2025fall-hw4-math.pdf)（P4）和 [Tutorial on Diffusion Models for Imaging and Vision](https://arxiv.org/abs/2403.18103)。
3. **從 VAE 到 Diffusion**（第 9–11 頁）：一步 encode 對模型太難，那就一步步加噪聲，讓 scheduler 取代 encoder。加噪是 forward process，要學的是逐步去噪的 reverse process。每一步可以看成先預測乾淨的圖，再估下一個比較不吵的狀態，細節看 DDPM 與 [DDIM](https://arxiv.org/abs/2010.02502)。
4. **Score-based**（第 12 頁）：把步數推到無限多，模型變成連續的，接上隨機微分方程（[Score-Based Generative Modeling through SDEs](https://arxiv.org/abs/2011.13456)）。PDF 註明作業不考這篇。
5. **Flow Matching**（第 13–14 頁）：從這個角度看，去噪路徑可能偏離 conditional optimal transport 路徑，讓 diffusion 取樣 overshoot。那何不直接建一條線性的搬運路徑，回歸它的速度？訓練完用 ODE solver（例如 Euler）積分速度場就能生成。引用 [Flow Matching Guide and Code](https://arxiv.org/abs/2412.06264)。
6. **MeanFlow**（第 15–16 頁）：diffusion 與 flow 都得多次呼叫模型，NFE 很高，品質與效率有取捨。如果改學**平均速度**，就能少步生成；MeanFlow Identity 提供了精確少步推論的訓練目標。

## 19 題怎麼分

PDF 第 17 頁：**19 題、總分 10 分**。

| 部分 | 題號 | 配分 | 內容 |
|---|---|---|---|
| Part 1：Paper Reading | Q1–Q16 | 每題 0.5 | 四篇論文 |
| Part 2：Coding | Q17–Q19 | 0.5／0.5／1.0 | 跑 Colab、看結果 |

只要在 NTU COOL 完成測驗，不用交程式碼。測驗沒有次數限制，取最高分。PDF 建議先跑一遍 Colab 再回答論文題。

依題目文字，Part 1 大致這樣分：

- **Q1–Q3 Flow Matching**：核心概念（time-dependent velocity field、和 continuous normalizing flow 的關係）、論文為什麼特別討論 Optimal Transport path、哪些情境下 Flow Matching 的效果或效率會受限。
- **Q4–Q6 MeanFlow**：為什麼瞬時速度不一定是一步生成最自然的目標、MeanFlow 和其他快速取樣方法（例如蒸餾）差在哪、什麼部署情境下它的優勢明顯。
- **Q7–Q9 DDPM**：原始論文的核心貢獻、預測噪聲的觀點、progressive lossy decompression 是什麼意思。
- **Q10–Q12 Rectified Flow**：直線路徑和取樣效率的關係、reflow 在做什麼、方法定位（例如兩個 empirical distribution 之間的搬運）。
- **Q13–Q16 橫向比較**：從訓練訊號、少步生成、「1 步很差但 50 步很好」的解釋、以及「宣稱比 DDPM 快」時該報告哪些比較，四個角度把四篇放在一起看。

Q16 值得先想一下，它其實是整份作業的主旨：說一個方法「比較快」，要比相同品質下的 NFE、相同 NFE 下的品質、有沒有用 distillation 或額外訓練成本，以及 solver 的設定。

## Colab：兩個小 MLP，把高斯噪聲變成 Swiss roll

Colab 開頭說明要訓練兩個 flow-based 生成模型，把高斯噪聲轉成 2D 的 **Swiss roll**，再用結果回答 COOL 上的題目，並且「請不要改評估設定」。

**資料**：`make_swiss_roll` 不用 sklearn，自己在角度 1.5π 到 4.5π 之間取樣畫出螺旋，加上 0.15 的高斯噪聲，置中、標準化後縮放到大致落在 [-4, 4] 的範圍，共 20000 個點。batch size 是 512。

**路徑的方向要先看清楚**：Colab 的慣例是 **t = 0 是資料、t = 1 是噪聲**，路徑是 x_t = (1 − t)·x_0 + t·x_1，要學的速度是 v = x_1 − x_0；生成時從 t = 1 的噪聲出發，往 t = 0 積分回去。讀論文時留意各篇的時間方向不一定相同。

**兩個網路**都是 hidden 128、三層 SiLU 的 MLP，輸出一個 2D 向量，意思是「這個點該往哪裡移動」。時間用 sinusoidal embedding 編碼，Colab 直接說這個想法和 Transformer 的位置編碼類似（本系列的 [Positional Embedding 篇](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)講過）。

| | FlowNet（Flow Matching） | MeanFlowNet（MeanFlow） |
|---|---|---|
| 輸入 | 點 x_t、時間 t | 點 z、區間起點 r、終點 t |
| 輸出 | 瞬時速度 | 區間 [r, t] 的平均速度 |
| 評估設定 | Euler、固定 50 步 | 固定 1 步 |
| 收斂標準 | Histogram JS ≤ 0.10 | Histogram JS ≤ 0.40 |

**訓練**都用 AdamW（lr 1e-3、weight decay 1e-4）與 MSE loss，預設 50 個 epoch。Flow Matching 的目標很單純：在隨機的 t 取 x_t，預測 x_1 − x_0。MeanFlow 比較有意思，它要用到模型輸出對時間方向的導數。

<details>
<summary>展開：Colab 裡 MeanFlow 的訓練目標怎麼組</summary>

每個 batch 先抽兩個時間，排序成 r ≤ t，取 z = (1 − t)·x_0 + t·x_1、v = x_1 − x_0。

接著用 `torch.func.jvp` 同時算出模型輸出 u = u(z, r, t) 和它沿著切向量 (v, 0, 1) 的方向導數 du/dt。這個切向量的意思是：z 以速度 v 移動、r 不動、t 以速度 1 前進。

訓練目標是

u_target = v − (t − r) · du/dt

loss 是 MSE(u, u_target)，而且 target 會先 `detach()`，當成固定的標籤。另外加了 gradient clipping（max norm 1.0）。

生成時，1 步就是直接從 t = 1 跨到 r = 0：z_0 = z_1 − (1 − 0)·u(z_1, 0, 1)。多步則把 [0, 1] 切成幾段重複這個動作。

</details>

**調參的規矩**：Flow Matching 沒達標，就加 `FLOW_EPOCHS` 重訓，**不准改 50 步的推論步數**去湊分數；MeanFlow 沒達標也是加 `MEANFLOW_EPOCHS`，不准增加推論步數。Colab 也提醒除了看數字還要看圖，因為圖能抓到數字漏掉的明顯失敗。

**Histogram JS**：在 [-4, 4] 的正方形上畫 64×64 的網格，數目標點和生成點各落在哪一格、正規化成機率分布，再算 Jensen-Shannon divergence。螺旋變糊、變粗或少了一條臂，都會被懲罰。收斂標準和模型大小、樣本數、網格大小綁在一起，只在這份作業裡有意義。

## Q17–Q19：三組比較

**Q17** 要截圖 Colab 的 Summary Histogram JS Table，而且兩個數字都達到收斂標準才算有效。

**Q18** 是看訓練曲線與中間樣本回答的選擇題：兩條 loss 曲線的樣子、loss 波動是否代表品質變差、MeanFlow 是否比較難最佳化、只看 loss 夠不夠、訓練越久是否一定越好。Colab 會把兩條 loss 畫在同一張圖上，也會定期畫出當下的生成樣本，這些都是判斷依據。

**Q19**（1 分）是 100–200 字的簡答，依據 Colab 最後的 Final Inference Comparison，至少討論下面兩項：

1. **1 步對 1 步**：Flow Matching 用 1 個 Euler step 對上 MeanFlow 用 1 步。這組比較是在展示 MeanFlow 的貢獻。
2. **Euler 步數掃描**：Flow Matching 用 1、5、10、20、50 步。
3. **相同步數**：Euler 20 步對 RK4 20 步。
4. **相近算力**：Euler 20 步對 RK4 5 步。RK4 每步約呼叫模型 4 次，所以 RK4 20 步的成本大約等於 Euler 80 步；只比相同步數對 RK4 不公平，Colab 的表格同時列出約略的模型呼叫次數和實測取樣時間。

題目明說不用回報精確數字，要以生成樣本的觀察為主，說明推論步數、solver 選擇和算力預算如何影響品質。MeanFlow 不參加 solver 與步數掃描，因為它在這份作業裡的角色就是一步生成。

## 規定與資源

- 不准抄襲，引用其他資源要註明；不准和任何人（PDF 原文是 any living creatures）分享程式或預測檔。第一次違規該次作業 0 分、學期成績乘 0.9；超過一次學期成績 F。
- 問題優先發在 NTU COOL 的 HW9 討論區；寄信標題要以 `[ML 2026 Spring HW9]` 開頭。助教時間是每週五上課前後，地點博理 112。
- PDF 第 2 頁另外附了 [PyTorch Tutorial](https://youtu.be/6dEp6oRN2NE)。

## 想深入

- **先讀哪一篇**：如果只有時間讀一篇，讀 [MeanFlow](https://arxiv.org/abs/2505.13447)。它的摘要就說明了 average velocity 與 instantaneous velocity 之間的 identity，對照上面折疊區塊裡的 `u_target` 最有感。
- **今晚就能做**：跑完 Colab 後，把 Flow Matching 的 1 步、5 步、50 步三張圖並排，再用手指沿著螺旋描一次。你會很直觀地看到「路徑彎曲時，大步 Euler 為什麼會走偏」，這正是 Rectified Flow 想把路徑拉直的理由。
- **延伸閱讀**：站上完整的 flow matching 課程導讀是 [MIT 6.S184 系列](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)；[CME295 Diffusion LLM 導讀](/posts/ai/2026-09-29-cme295-diffusion-llms)把 diffusion 搬到文字生成；[Berkeley CS189 HW2](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)也有一題 flow matching 可以對照著做。

## 這一篇可以確認與不能確認的

可以確認：hw9.pdf 全文與內嵌連結、Colab 的 markdown 與程式（資料生成、網路結構、訓練目標、收斂標準、比較設定）、課程頁的公告日與助教名單、助教影片與三支先備影片的標題與上傳者（YouTube oEmbed）、四篇指定論文與 PDF 引用論文的標題（arXiv API 核對）。PDF 裡 Flow Matching、Rectified Flow、MeanFlow 連到 OpenReview，本文改用同一篇論文的 arXiv 頁。

不能確認：助教影片沒有字幕可抓，本文沒有逐字聽寫，影片中額外的提示沒有寫進來。Colab 存檔裡有部分執行輸出，本文刻意不引用任何數值，避免變成答案。官方解答沒有公開。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [AI 自我成長（下）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)｜下一篇 [HW10：Spoken Language Model](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model)

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [hw9.pdf（ML 2026 Spring HW9：Flow Matching）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw9.pdf)
- [HW9 Colab 起始碼](https://colab.research.google.com/drive/1R1CNujj6-kVPkl53RQLt5kE7tYVS-Zmp?usp=sharing)
- [助教影片：ML 2026 Spring HW9 - Flow Matching](https://youtu.be/wAAeuMQ9r5c)
- [先備影片：Flow-based Generative Model（ML2019）](https://www.youtube.com/watch?v=uXY18nzdSsM)
- [先備影片：【生成式AI】Diffusion Model 原理剖析](https://www.youtube.com/watch?v=ifCDXFdeaaM)
- [先備影片：【生成式人工智慧與機器學習導論2025】第 9 講：影像和聲音上的生成策略](https://www.youtube.com/watch?v=ccqCDD9LqCA)
- [Denoising Diffusion Probabilistic Models（arXiv 2006.11239）](https://arxiv.org/abs/2006.11239)
- [Flow Matching for Generative Modeling（arXiv 2210.02747）](https://arxiv.org/abs/2210.02747)
- [Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow（arXiv 2209.03003）](https://arxiv.org/abs/2209.03003)
- [Mean Flows for One-step Generative Modeling（arXiv 2505.13447）](https://arxiv.org/abs/2505.13447)
- [Denoising Diffusion Implicit Models（arXiv 2010.02502）](https://arxiv.org/abs/2010.02502)
- [Score-Based Generative Modeling through Stochastic Differential Equations（arXiv 2011.13456）](https://arxiv.org/abs/2011.13456)
- [Flow Matching Guide and Code（arXiv 2412.06264）](https://arxiv.org/abs/2412.06264)
- [Tutorial on Diffusion Models for Imaging and Vision（arXiv 2403.18103）](https://arxiv.org/abs/2403.18103)
- [Auto-Encoding Variational Bayes（arXiv 1312.6114）](https://arxiv.org/abs/1312.6114)
- [ML 2025 Fall HW4 數學題（NTU EE ML TA）](https://ntueemlta2025.github.io/homeworks/hw4/ml-2025fall-hw4-math.pdf)
- [【機器學習 2023】PyTorch Tutorial](https://youtu.be/6dEp6oRN2NE)
