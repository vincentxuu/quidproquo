---
title: "MIT 6.S184 Lab 3：DiT、VAE 到 latent diffusion"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, diffusion-transformer, vae, latent-diffusion]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 8
tldr: "Lab 3 在 MNIST 上從零組出一個有條件的 latent diffusion model，分四段：先用 label dropout 寫 CFG 訓練（在三群高斯混合上驗證），再一塊一塊寫 diffusion transformer（Fourier 時間嵌入、patchify、多頭注意力、adaLN-Zero、depatchify），接著寫一個 VAE，最後把 DiT 搬進 VAE 的 latent 空間訓練。題目與官方解答都公開；繳交走 Canvas 裡的 Gradescope，只有 MIT 修課生能用。"
description: "MIT 6.S184（IAP 2026）Lab 3 導讀，依 GitHub 上的 lab_three.ipynb 與官方解答：Part 0–1 的共用元件與 MNIST、Part 2 CFG（Question 2.2 訓練 loss、2.3 MLPConditionalVectorField、Sanity Check 2.4）、Part 3 DiT（Question 3.1–3.5）、Part 4 VAE（Question 4.1–4.7，compute_loss 對應講義 eq. 83）、Part 5 LatentCFGTrainer，以及題目與講義的幾處出入。"
draft: false
glossary:
  - term: "adaLN-Zero"
    aliases: ["adaLN zero"]
    definition: "adaptive layer norm 的一種初始化方式：把產生 scale／shift／gate 的條件 MLP 最後一層初始化為 0，讓每個 DiT block 一開始近似恆等映射，訓練較穩定。"
    context: "MIT 6.S184 Lab 3 Question 3.3 的建議做法。"
  - term: "patchify"
    aliases: ["切 patch", "patchifier"]
    definition: "把一張圖切成固定大小的小塊，每塊映成一個 d 維 token，讓 transformer 能把圖當成序列處理；depatchify 是反向操作。"
    context: "MIT 6.S184 Lab 3 Question 3.2、3.4。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的 Lab 3。題目用 [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) 的 [`labs/lab_three.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_three.ipynb)，對照官方解答 [`solutions/lab_three_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_three_complete.ipynb)。理論部分引用[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §5–6。存取等級 A3：題目、解答、講義、錄影全部公開；缺的是評分回饋。2026-09-30 核對。

**系列位置**：上一篇 [L4：U-Net、DiT 與 latent space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)｜下一篇 [L5：離散擴散，用 CTMC 生成語言](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion)｜[系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

這是這門課的最後一個 lab，也是課程網站簡介那句話的兌現：「課程結束時，學生會從零建出一個 latent diffusion model」。課程網站把它叫「Lab 3: Diffusion Transformer and VAEs」，notebook 的標題則是「A Conditional Generative Model for Images」。

前兩個 lab 都在 2D 玩具分佈上做無條件生成。Lab 3 一次升級兩件事：

- **有條件**：指定「生成數字 8」，而不只是「生成一個數字」。這要用 [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance) 的 CFG。
- **圖片**：MNIST 被縮放成 32×32，每張圖是 1024 維。MLP 不夠用，要換成 [L4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures) 的 diffusion transformer。

所以先讀完 L3B 和 L4 再開這個 lab。

## 課程影片來源

請由官方課程入口核對本文對應講次；本次未核實可直接嵌入的該篇公開錄影。

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 怎麼拿、怎麼做、怎麼對答案

課程網站 Labs 區的步驟：打開題目、從 GitHub 下載 `.ipynb`、用自己喜歡的 Jupyter 環境做（網站推薦 Google Colab，Lab 3 也附了 Colab 連結），做完匯出 PDF，透過 Canvas 交到 Gradescope，而且**不要清掉 cell 輸出**。

校外讀者卡在最後一步：Canvas 只有 MIT 修課生能進。替代做法是拿官方解答自己對。課程網站在 Labs 區底下直接寫「Stuck? Solutions can be found here」，連到同一個 repo。

兩個實務提醒：

- **需要 GPU。** notebook 在兩個大型訓練 cell 的註解都寫「約 15 分鐘 A100 就有合理結果」。Colab 免費方案的 GPU 會慢很多，先把步數調小試跑。
- **notebook 自己說這個 lab 是 optional**，並強烈建議不要叫 ChatGPT、Gemini、Claude 之類的 LLM 替你寫程式碼，否則就浪費了一次「親手做機器學習」的機會。這篇導讀也照這個精神：只講每題在考什麼，不貼完整解答。

repo README 的 changelog 有兩筆 Lab 3 的修正：3/12/25 修了 guidance embedding 的維度 bug，3/13/25 修了官方解答取樣條件變數時的 bug。兩筆都早於 IAP 2026，從 branch `2026` 下載的版本已經包含。

## Part 0–1：把舊元件升級，先看一眼 MNIST

**Part 0** 不用寫程式，但值得讀，因為它說明了「有條件」在程式裡長什麼樣：

- `Sampleable` 升級成 `LabeledSampleable`，`sample()` 同時回傳樣本和標籤。notebook 的說法是：每個分佈都被正式當成資料和標籤的**聯合分佈**。這對應講義 eq. (58) 從 `(z, y) ~ p_data(z, y)` 取樣。
- 機率路徑、ODE／SDE、模擬器都改成接受任意形狀 `b ...`（圖片是 `b c h w`），並用 `**kwargs` 把條件 y 一路傳下去。
- 高斯混合 `GMM` 的標籤就是它來自哪一群，用來在上圖片之前先驗證 CFG。

**Part 1** 載入 MNIST（縮放到 32×32 並標準化），然後沿著 `LinearAlpha`／`LinearBeta` 的高斯路徑，把幾張數字從 t=0 到 t=1 畫出來。這個 lab 沿用整門課的時間慣例：t=0 是純雜訊，t=1 是資料。

## Part 2：CFG

Part 2 開頭的 markdown 把 L3B 的推導重走一遍：vanilla guidance、分類器那一項、放大 w 倍、換成 `(1−w)·u(x|∅) + w·u(x|y)`。對照講義讀時注意一件事：**notebook 的 `a_t`、`b_t` 跟講義的角色對調了。** notebook 寫 `u_t(x|y) = a_t x + b_t ∇log p_t(x|y)`，講義 eq. (59) 寫 `a_t ∇log p_t(x|y) + b_t x`。符號名稱不同，數學一樣。

空標籤 ∅ 在程式裡就是一個額外的整數：MNIST 有 0–9，所以 notebook 建議直接把 ∅ 硬寫成 10。

### Question 2.2：CFG 的訓練 loss

這題把講義 eq. (63)–(64) 和 Algorithm 5 寫成 `get_train_loss`。notebook 的白話版五步：

1. 從 `p_data` 取圖片 z 和標籤 y。
2. 以機率 η 把 y 換成 ∅。
3. 取 t ~ U[0,1]。
4. 從條件機率路徑 `p_t(x|z)` 取 x。
5. 拿 `u_t^θ(x|y)` 去回歸條件向量場。

提示裡最容易踩的坑是第 3 步：notebook 特別提醒**不要把 `torch.rand` 和 `torch.randn` 搞混**。前者才是 [0,1] 均勻分佈。

注意一個名稱出入：題目文字要你填 `CFGFlowTrainer.get_train_loss`，但 code cell 裡的類別叫 `CFGTrainer`。填的是同一個方法。

**對答案時看什麼**：官方解答用一個 `torch.rand(...) < eta` 的遮罩改標籤；t 乘上 `(1 − eps)`，所以不會正好取到 1；loss 是逐元素平方誤差取平均。

### Question 2.3：`MLPConditionalVectorField`

實作 `forward`：網路要同時吃 x、t、y。y 是整數標籤，要先過一個嵌入層再跟 x、t 一起送進 MLP。這就是講義 §6.1 說的「低維時把 x、y、t 串起來丟進 MLP 就夠」。

### Sanity Check 2.4：三群高斯混合

把 `CFGTrainer`、`CFGVectorFieldODE`、`MLPConditionalVectorField` 組起來，在三群高斯（排成三角形）上訓練，η=0.25，空標籤是 3。結果畫三張圖：目標分佈、每群各自條件生成、空標籤的無條件生成。

`CFGVectorFieldODE` 已經寫好了，值得讀一下它的 `drift_coefficient`：每一步呼叫網路**兩次**，一次餵 y、一次餵空標籤，再照 `(1−w)·unguided + w·guided` 加權。L3B 講的「CFG 的代價是網路呼叫次數變兩倍」，在這裡看得一清二楚。

**怎麼做**：這一格有個 `guidance_strength` 參數，註解寫「try changing me!」。從 1.0 改到 3.0、5.0 各跑一次，觀察每一群的點是不是越來越集中。這就是 L3B「CFG 把分佈往眾數擠」的 2D 版本。

## Part 3：從零寫一個 diffusion transformer

notebook 說這部分是「in the spirit of banging your head against a wall」，整個 transformer 都要自己寫。對照講義 §6.1.2 與 Remark 29。

| 題號 | 元件 | 要做什麼 |
|---|---|---|
| 3.1 | `FourierEncoder` | 把純量 t 映成 cos／sin 特徵 |
| 3.2 | `Patchifier` | `b c 32 32` → 卷積 → 重排成 `b n d` 的 token 序列 |
| 3.3 | `MHA`、`DiffusionTransformerLayer`、`DiffusionTransformer` | 多頭自注意力、一層 DiT block、疊 depth 層並加位置編碼 |
| 3.4 | `Depatchifier` | `b n d` → 正規化 → MLP → 重排 → 卷積 → `b 1 h w` |
| 3.5 | `DiffusionTransformerFlowModel` | 嵌入 t 和 y、相加、patchify、過 DiT、depatchify |

幾個值得停下來的地方：

- **3.1 的頻率跟講義不一樣。** 講義 eq. (69) 的頻率是 `w_min` 到 `w_max` 之間的等比數列；notebook 的頻率 `w_i` 取自標準常態，官方解答把它設成可學參數。講義本來就說 TimeEmb 的確切形式不是必要的，這是一個現成的例子。
- **3.2 的卷積就是 patchify。** 講義把 patchify 寫成「重排再乘矩陣」；notebook 用一個卷積層達成同樣效果。題目也預告：之後在 latent 空間訓練時，輸入通道數 c 就不再是 1。
- **3.3 的建議順序是由上往下。** 先寫 `DiffusionTransformer`（用 `nn.Parameter(torch.randn(n_tokens, dim))` 學位置編碼），再寫一層 block，最後才寫注意力。block 用 **adaLN-Zero**：把條件 MLP 的最後一層初始化成 0，讓殘差連接一開始幾乎不作用，訓練較穩定；scale／shift 用 `x * (1 + γ) + β` 調變，另有一個 gate α 乘在殘差分支上；前饋層建議用 `[dim, 4*dim, dim]`。這個 DiT 只用類別當條件，所以**沒有 cross-attention**，跟講義 Remark 29 最後那句「類別條件的 DiT 通常省掉 cross-attention」一致。
- **3.5 的條件怎麼合併。** 提示建議 `nn.Embedding` 用 11 類（10 個數字＋空標籤），把時間嵌入和類別嵌入**相加**當成條件，再交給每一層的 adaLN。

<details>
<summary>訓練設定（notebook 預設值）</summary>

```text
pixel-space DiT：img_size=32, patch_size=4, num_layers=8, dim=256, heads=8, final_dim=10, n_classes=11
trainer：η=0.35, null_label=10, num_steps=20000, lr=0.4e-3, batch_size=256
視覺化：每類 10 張、100 步 Euler、guidance scale w ∈ {1.0, 3.0, 5.0}
```

patch_size=4 代表 32×32 的圖被切成 8×8 = 64 個 token。

</details>

訓練完，notebook 會把每個數字在 w=1、3、5 下各生一排。這就是講義 Figure 13（MNIST 在 w=1、2、4）的自製版。

## Part 4：寫一個 VAE

架構照 notebook 的說明：encoder 把 `b 1 32 32` 映成 `z_mean`（形狀 `b c h w`）和一個**可學的純量** `z_logvar`；decoder 對稱地輸出 `x_mean` 和純量 `x_logvar`。這正是講義說的「很多實作（包括 lab）把變異數固定成可學的常數，避免學變異數時的病態行為」。

| 題號 | 元件 | 食譜 |
|---|---|---|
| 4.1 | `ResidualBlock` | 存 skip → GroupNorm → 3×3 卷積 → 激活 → 1×1 卷積 → 加回 skip |
| 4.2 | `AttnBlock` | 重排成 `b (h w) c` → norm＋`MHA`＋殘差 → norm＋前饋＋殘差 |
| 4.3 | `EncoderBlock` | 兩個殘差塊 → 一個注意力塊 → （可選）stride 2 卷積降採樣 |
| 4.4 | `Encoder` | 初始卷積 → 每個 hidden channel 一個 encoder block，最後一個不降採樣 → norm＋1×1 卷積出 `z_mean` |
| 4.5 | `DecoderBlock` | 兩個殘差塊 → 一個注意力塊 → （可選）上採樣＋卷積 |
| 4.6 | `Decoder` | 每個 hidden channel 一個 decoder block，最後一個不上採樣 → norm＋1×1 卷積出 `x_mean` |
| 4.7 | `VAE.compute_loss` | 實作 VAE loss |

4.2 直接重用 Part 3 寫的 `MHA`，所以 Part 3 沒做完，Part 4 也卡住。

### Question 4.7：compute_loss 對的是講義哪一條

題目寫「實作主文 display (85) 的 `L_VAE(φ, θ)`」，官方解答的 docstring 也寫「See display 85」。但**在 2026 版講義裡，eq. (85) 是第 7 節 CTMC rate matrix 的條件**，跟 VAE 無關。內容對得上的是講義 **eq. (83)**：重建誤差、decoder 信心、latent 變異數項、latent 平均項那四項。編號大概是講義改版後沒有同步。

對照官方解答時的兩個觀察：

- 解答的重建項是 `(x − x_mean)² / exp(x_logvar) + x_logvar`，KL 項是 `β · (z_mean² + exp(z_logvar) − z_logvar − 1)`，每一項各自 `.mean()`。結構和 eq. (83) 一樣，但常數（½、d/2 等）和加總方式不同，所以**對結構，別對常數**。
- β 的值有三個版本：`VAE` 類別預設 0.1，Part 4 訓練 cell 用 10.0，Part 5 一行註解寫 1.0。講義的實務提醒說現代 autoencoder 的 β 都非常小（β≪1）。你可以把這當成實驗：改 β，看重建品質和 latent 內插哪個先壞。

<details>
<summary>訓練設定（notebook 預設值）</summary>

```text
VAE：data_channels=1, hidden_channels=[16, 32, 64, 128], beta=10.0
trainer：batch_size=64, num_steps=5000, lr=1e-3, warmup_steps=500
```

四個 hidden channel、前三個 block 降採樣，32×32 會變成 4×4，latent 形狀是 `128×4×4`。

</details>

訓練完，notebook 會在兩張 MNIST 的 latent 之間做 10 步線性內插並解碼。這是檢查 latent 空間「好不好走」最直觀的方式，也就是 L4 說的「bad latent space」問題的實測。

## Part 5：LatentCFGTrainer

最後一題只有一個方法：`LatentCFGTrainer.get_train_loss`。提示是：從 `CFGTrainer.get_train_loss` 改，但不要從 `path.p_data` 取樣，而是直接從 MNIST 取圖，**在 `torch.no_grad()` 裡**過 encoder。VAE 已經訓練好、這時是凍結的，不該有梯度流回去。

這一步就是 L4 Remark 32 與 Slides 4 的五步配方：資料 → 編碼成 latent → 在 latent 上做 CFG flow matching → 取樣 → 解碼。

對照官方解答：

- 編碼後用 reparameterization 取一個 latent 樣本（`z_mean + exp(0.5·z_logvar)·ε`），再把它當成資料點 z 走原本的 CFG 流程。講義 Remark 32 寫的也是訓練時從 `q_φ(z|x)` 取樣。
- 取樣時解碼用 `vae.decode` 回傳的**平均**，符合 Remark 32「取平均、不另外取樣，避免雜訊瑕疵」。

<details>
<summary>訓練設定（notebook 預設值）</summary>

```text
latent 路徑：p_simple_shape=[128, 4, 4]
latent DiT：img_size=4, patch_size=1, num_layers=8, c=128, dim=256, heads=8, final_dim=10, n_classes=11
trainer：η=0.35, null_label=10, num_steps=10000, lr=0.4e-3, batch_size=256
```

patch_size=1 代表 4×4 的 latent 切成 16 個 token，每個 token 是一個 128 維的位置。

</details>

一個值得自己算一下的地方：這個 latent 有 128×4×4 = 2048 個數，比 32×32 = 1024 個像素還多。token 數從 64 降到 16，但總數字量沒有變少。MNIST 本來就很小，這個 lab 的重點是**把整條 latent diffusion 管線跑通**；L4 講的「壓縮省記憶體」要在高解析度圖片上才會明顯。

## 做完這個 lab，你應該能

- 用一個遮罩實作 label dropout，並說出 CFG 取樣每一步為什麼要呼叫網路兩次。
- 不看參考實作，寫出多頭自注意力、adaLN-Zero 的 DiT block、patchify／depatchify。
- 說出 VAE 的 encoder 輸出什麼、loss 由哪幾項組成，以及 β 在拉扯什麼。
- 把一個訓練好的 VAE 接到 flow matching 訓練裡，並說出為什麼 encoder 要包在 `torch.no_grad()` 裡。

**今晚就能做的事**：先只做 Part 2。寫完 Question 2.2 和 2.3，跑 Sanity Check 2.4，把 `guidance_strength` 從 1 改到 5，截兩張圖比較。這一段只是 2D 資料上的小 MLP（預設 3000 步），用不到 notebook 說的 A100 等級資源，可以先做。

## 延伸閱讀

- Transformer 與 attention 從頭講：[Stanford CS224N：Transformers](/posts/ai/2026-08-22-cs224n-transformers)、[CMU 11-785 L18：Attention 與 Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)
- VAE 的 ELBO 推導：[CMU 11-785 L22：Variational Autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders)
- 前一個 lab：[Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — Labs 區：繳交方式、Lab 3 Colab 連結、解答連結
- [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) — README changelog（3/12/25、3/13/25 的 Lab 3 修正）
- [lab_three.ipynb（題目）](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_three.ipynb) — Part 0–5、Question 2.2–5.1、訓練設定
- [lab_three_complete.ipynb（官方解答）](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_three_complete.ipynb)
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — eq. (58)、(59)、(63)–(65)、Algorithm 5；§6.1 eq. (68)–(69)、Remark 29；§6.2 eq. (83)、Remark 32；§7 eq. (85)
- [Peebles & Xie (2023), Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748) — notebook 參考文獻 [1]，DiT 架構圖來源
- [Rombach et al. (2022), High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) — notebook 參考文獻 [2]
