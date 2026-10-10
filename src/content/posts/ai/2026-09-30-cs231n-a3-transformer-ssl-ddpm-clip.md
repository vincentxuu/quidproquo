---
title: "CS231N A3 導讀：Transformer Captioning、自監督學習、DDPM、CLIP 與 DINO"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, homework, transformer, vision-transformer, self-supervised-learning, contrastive-learning, diffusion-model, clip]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 18
tldr: "CS231N Spring 2026 的 A3 占總成績 15%，四個 Colab notebook 把 L8、L12–L14、L16 各自落成一份實作：Q1 手寫 multi-head attention、Transformer decoder 做 COCO captioning，再組一個 ViT 在 CIFAR-10 上訓練；Q2 實作 SimCLR 的資料增強與對比損失，比較有無自監督預訓練的線性分類；Q3 寫 DDPM 的加噪、UNet、去噪損失、取樣與 classifier-free guidance，生成文字條件的 32×32 emoji；Q4 用預訓練 CLIP 做相似度、零樣本分類與檢索，再用 DINO 特徵只靠一幀標註做影片分割。本文只講題目結構、檔案與目標，不給解答。"
description: "Stanford CS231N Spring 2026 Assignment 3 導讀：Transformer_Captioning、Self_Supervised_Learning、DDPM、CLIP_DINO 四個 notebook 各自要補哪些檔案與函式、通過門檻、Inline Questions 問什麼、對應哪幾講，以及校外自學拿得到與拿不到的東西。作業 Spring 2026，錄影 Spring 2025。不提供解答。"
draft: false
glossary:
  - term: "NT-Xent loss"
    aliases: ["normalized temperature-scaled cross entropy"]
    definition: "SimCLR 用的對比損失：把同一張圖兩個增強版本的表示拉近，同時推開 batch 裡其他所有樣本，相似度用 cosine 並除以溫度 τ。"
    context: "A3 Q2 要先寫逐對版本，再寫向量化版本。"
  - term: "classifier-free guidance"
    aliases: ["CFG"]
    definition: "訓練條件擴散模型時隨機丟掉條件；取樣時把有條件與無條件的雜訊預測做加權外插，用一個係數 w 在保真度與多樣性之間取捨。"
    context: "A3 Q3 最後一段要在 `Unet.cfg_forward` 實作它。"
  - term: "zero-shot classification"
    aliases: ["零樣本分類"]
    definition: "不用任何標註樣本訓練分類器，而是把每個類別寫成一句自然語言描述，挑與影像在共同嵌入空間中最相似的那一句當預測。"
    context: "A3 Q4 用預訓練 CLIP 實作 `clip_zero_shot_classifier`。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：作業依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Assignment 3 頁面](https://cs231n.github.io/assignments2026/assignment3/)與 [assignment3.zip 起始碼](https://cs231n.github.io/assignments/2026/assignment3.zip)（2026-09-30 下載，notebook 最後修改時間是 2026 年 5 月）；對應講次的錄影是 [Spring 2025 的 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)。2026 錄影只放在 Canvas，限修課生，兩個年份的內容可能有差異。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 18 篇。

**系列位置**：上一篇 [L16：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)｜下一篇 [L15：3D 視覺](/posts/ai/2026-09-30-cs231n-3d-vision)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

A3 是 CS231N 三份作業的最後一份。前面幾篇講的 attention、自監督、擴散、CLIP 都還停在投影片上，這份作業逼你把它們寫成能跑、能通過數值檢查的程式碼。

它的四題剛好橫跨課程第三單元：

| 題目 | notebook | 主要對應講次 |
|---|---|---|
| Q1 Image Captioning with Transformers | `Transformer_Captioning.ipynb` | [L8 Attention 與 Transformer](/posts/ai/2026-09-30-cs231n-attention-transformers-vit) |
| Q2 Self-Supervised Learning for Image Classification | `Self_Supervised_Learning.ipynb` | [L12 自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning) |
| Q3 Denoising Diffusion Probabilistic Models | `DDPM.ipynb` | [L14 生成模型（二）](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)，背景在 [L13](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan) |
| Q4 CLIP and DINO | `CLIP_DINO.ipynb` | [L16 視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)（CLIP）、L12（DINO） |

本文只寫官方頁面與起始碼裡看得到的題目、檔案與目標。**不提供任何解答。**

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [CS231N Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 基本規格

[作業總頁](https://cs231n.stanford.edu/assignments.html)把 A3 列為總成績的 15%。2026 課表上它在 5 月 14 日（L13 那天）發佈，5 月 28 日晚上 11:59（太平洋時間）截止。

作業頁的目標寫成四條：理解並實作 Transformer，接上 CNN 特徵做 captioning；用自監督學習幫助影像分類；實作 DDPM 並用來生成影像；實作並理解 CLIP 與 DINO。大部分程式用 PyTorch 寫。

官方工作流程是 Google Colab。作業頁說不正式支援本機開發，但附了一份 `requirements.txt` 讓你自己建虛擬環境。四個 notebook 做完後，執行 `collect_submission.ipynb`，它會打包出 `a3_code_submission.zip`，並把所有 notebook 轉成一份 `a3_inline_submission.pdf`，兩個都交到 Gradescope。

每個 notebook 開頭都有一份「Student Declaration」，要填是否用了生成式 AI、怎麼用。作業總頁的政策是：生成式 AI 比照協作者處理，解答要自己獨立寫下；用它大幅完成作業內容違反 Honor Code。同一頁也寫明，網路上有往年的解答，課程知道這件事，仍要求交出自己的作品。

## Q1：從 captioning 到 ViT，一份 notebook 兩個 Transformer

notebook 開頭直接接 A2 的 RNN captioning：你已經用 vanilla RNN 做過 COCO 的影像描述，這次改用 Transformer decoder 做同一件事。跟 A2 不同，這份主要用 PyTorch 寫，不再用 NumPy。

要補的東西都在 `cs231n/transformer_layers.py` 與 `cs231n/classifiers/transformer.py`，順序是：

1. **`MultiHeadAttention`**：multi-head scaled dot-product attention，含對 attention weights 的 dropout。notebook 用公式寫清楚每個 head 的投影維度是 d/h，縮放項是 1/√(d/h)。
2. **`PositionalEncoding`**：sin/cos 位置編碼，加到詞嵌入上。
3. **`TransformerDecoderLayer`**：self-attention、對影像特徵的 cross-attention、逐位置的 feedforward 三個模組。
4. **`CaptioningTransformer.forward`**：把上面組成 captioning 模型，先在小資料上 overfit（notebook 要求最終訓練 loss 低於 0.05），再用已寫好的取樣程式跟 RNN 的結果對照。

後半段換成 [Vision Transformer](https://arxiv.org/abs/2010.11929)：補 `PatchEmbedding`、`TransformerEncoderLayer` 與 `VisionTransformer` 的 forward，最後調架構與超參數，目標是**在 CIFAR-10 上訓練 2 個 epoch 後 test accuracy 超過 0.45**。notebook 說明這個 ViT 對所有 patch 向量做 average pooling 再分類，位置編碼沿用同一個 1D sinusoidal 版本。

每一步都附數值檢查，門檻從 e-3 到 1e-6 不等，通過才往下。

**Inline Questions** 有三題：為什麼要多頭、為什麼除以 √(d/h)、為什麼 attention 輸出後要再接一個線性轉換；ViT 在小資料集上為什麼常輸給 CNN、有什麼補救辦法；以及把 hidden dimension、影像邊長、patch size、層數各自加倍時，self-attention 的計算量怎麼變。

最後這題值得先想再做。它其實是在問你有沒有把「token 數由影像大小與 patch size 決定」這件事吃進去。

## Q2：SimCLR，親手驗證預訓練有沒有用

作業頁提醒：打開 notebook 先把 runtime 換成 GPU。

notebook 用 [SimCLR](https://arxiv.org/abs/2002.05709) 當範本：同一張圖做兩次隨機增強，經過 encoder f 得到表示 h，再經過 projection head g 得到 z，對比損失讓同一張圖的兩個 z 靠近。訓練完丟掉 g，只留 f 給下游任務。

要補的東西集中在 `cs231n/simclr/`：

- **`data_utils.py`**：`compute_train_transform()` 依序做隨機裁切縮放到 32×32、機率 0.5 水平翻轉、機率 0.8 color jitter、機率 0.2 轉灰階；`CIFAR10Pair.__getitem__()` 產生一對增強影像。
- **`contrastive_loss.py`**：先寫 `sim` 與逐對的 `simclr_loss_naive`，再寫向量化的 `sim_positive_pairs`、`compute_sim_matrix`、`simclr_loss_vectorized`。檢查門檻都是 1e-7。notebook 特別註明，它把 batch 裡正樣本對的排列順序改過，公式的索引跟論文不同，目的是方便向量化。
- **`utils.py`**：補 `train()`，用你的向量化損失算 loss。

訓練本身不用從頭來。課程提供在 CIFAR-10 上訓練約 18 小時的預訓練權重，notebook 讓你載入後再多訓練一下（約 10 分鐘）。

最後是整份作業的重點實驗：拿掉 projection head、凍結前面所有層、只訓練一層線性分類器，跟一個沒做自監督預訓練、所有權重都訓練的 baseline 比 test accuracy，畫成圖。notebook 先打預防針：baseline 表現偏低但合理，不用緊張。

這一題沒有 Inline Question。它要你交出的是那張比較圖。

## Q3：DDPM，從加噪公式寫到文字條件生成

notebook 的任務是訓練一個 DDPM，生成**以文字提示為條件的 32×32 emoji**。文字用預訓練 CLIP 的 text encoder 編成 512 維向量；為了加速，訓練集的文字已經預先編碼好。

步驟照 [DDPM 論文](https://arxiv.org/abs/2006.11239)的公式走：

1. **`q_sample`**（`cs231n/gaussian_diffusion.py`）：前向加噪，依論文 Eq. (4)。檢查要求零相對誤差。
2. **`predict_start_from_noise` 與 `predict_noise_from_start`**：模型可以預測乾淨影像或雜訊，兩者可互推。
3. **`Unet.__init__` 與 `Unet.forward`**（`cs231n/unet.py`）：定義上下採樣區塊與前向傳遞，輸入 x_t、t 與文字嵌入，輸出同形狀的張量。
4. **`p_losses`**：去噪訓練目標。
5. **`p_sample`**：反向過程的一步取樣，依論文 Eq. (6)。外層迭代取樣的 `sample` 已經寫好。
6. **`Unet.cfg_forward`**：classifier-free guidance。notebook 給了更新式 ε ← (w+1)·ε(x_t, t, c) − w·ε(x_t, t, ∅)，條件在訓練時以一定機率被丟掉。

訓練程式在 `cs231n/ddpm_trainer.py`，不用寫。後半段直接用 `cs231n/exp/pretrained` 裡訓練好的模型取樣。notebook 說你也可以自己在 Colab GPU 上訓練，但在 T4 上可能要超過 12 小時才開始看到像樣的結果。

它也誠實寫了限制：emoji 資料集很小，不足以訓出能泛化的文字生成影像模型，沒見過的提示可能生成得很差，加大 guidance scale 也不保證忠於文字。

這一題同樣沒有 Inline Question。

## Q4：CLIP 與 DINO，兩種不用標註的表示

**CLIP 半段**用預訓練 CLIP 抽 COCO 影像與文字的特徵（沿用 captioning 的資料，但這次是配對而不是生成），然後在 `cs231n/clip_dino.py` 裡依序實作：

- `get_similarity_no_loop`：不用迴圈算文字與影像特徵的相似度矩陣。
- `clip_zero_shot_classifier`：把每個類別寫成一句描述，做零樣本分類。notebook 直接列出預期的 10 個預測結果讓你對照。
- `CLIPImageRetriever`：反過來用文字查影像，註解裡給了每個查詢預期的前兩名。

**DINO 半段**先講為什麼需要它：SimCLR 與 CLIP 這類對比學習需要很大的 batch。[BYOL](https://arxiv.org/abs/2006.07733) 改用 student–teacher 架構避開大量負樣本，[DINO](https://arxiv.org/abs/2104.14294) 沿用這個思路：student 用反向傳播更新，teacher 不走反向傳播，權重是 student 的指數移動平均。

接著三步：視覺化 DINO ViT 最後一層 [CLS] token 對各 patch 的 attention map；對 patch 特徵做 PCA，把前三個主成分畫成顏色；最後實作 `DINOSegmentation`，**只用 [DAVIS](https://davischallenge.org) 一支影片其中一幀的標註**訓練一個逐 patch 的輕量分類器，拿去分割同一支影片的其他幀。門檻是第一個測試幀 mean IoU 超過 0.45、最後一幀超過 0.50、整支影片超過 0.55。notebook 建議用線性層或兩層 MLP 加上適當的 weight decay，避免過擬合。

**Inline Questions** 有五題：CLIP 的學習為什麼依賴 batch size、batch 固定時怎麼補救；怎麼把影像–文字對齊推廣到兩種以上的模態；attention map 那段印出的張量形狀是怎麼來的；PCA 視覺化裡看到什麼結構、同色與異色區域代表什麼；以及用 CLIP ViT 的 patch 特徵訓練分割模型，會比 DINO 好還是差、為什麼。

最後一題把 L12 和 L16 接在一起：CLIP 與 DINO 都不用人工標籤，但它們的訓練目標讓 patch 特徵學到的東西不一樣。

## 起始碼裡的東西

`assignment3.zip` 約 24 MB，大部分是 DINO 示範用的一張 GIF。跟四題有關的檔案：

| 路徑 | 用在 |
|---|---|
| `cs231n/transformer_layers.py`、`cs231n/classifiers/transformer.py` | Q1 要補的層與模型 |
| `cs231n/captioning_solver_transformer.py`、`cs231n/classification_solver_vit.py` | Q1 訓練迴圈（已寫好） |
| `cs231n/simclr/`（`data_utils.py`、`contrastive_loss.py`、`utils.py`、`model.py`） | Q2 |
| `cs231n/gaussian_diffusion.py`、`cs231n/unet.py`、`cs231n/ddpm_trainer.py`、`cs231n/emoji_dataset.py` | Q3 |
| `cs231n/clip_dino.py` | Q4 要補的函式與類別 |
| `cs231n/datasets/get_datasets.sh` 等 | 下載 COCO 等資料 |

壓縮檔裡還留著 `images/styles/` 與 style transfer 範例圖，但 2026 作業頁的四題都沒有用到 style transfer。

## 校外自學拿得到什麼

**拿得到**：作業頁、四個 notebook 的完整題目與數值檢查、需要補的 `.py` 骨架、Q2 與 Q3 的預訓練權重下載流程（Q2 notebook 裡的 SimCLR 權重網址在 2026-09-30 仍回應 HTTP 200；Q3 走 `trainer.download_pretrained()`，我沒有實際跑過）。照 notebook 的設計，有 Colab GPU 就能把每一題跑到「通過檢查、看到結果」。存取等級依 [全球 AI 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分法屬於 **A3**。

**拿不到**：Gradescope 自動評分與 Inline Questions 的評分標準、Ed 上的助教說明，以及 2026 年的講課錄影。數值檢查只保證你的實作跟參考答案一致，Inline Questions 寫得好不好沒有人幫你看。

## 自學怎麼做

1. 照 Q1 → Q2 → Q3 → Q4 的順序做。Q1 的 attention 與 ViT 是 Q4 讀懂 DINO attention map 的前提，Q2 的對比損失是理解 CLIP 為什麼吃 batch size 的前提。
2. 每題動手前先看對應講次的投影片，數值檢查沒過時回頭對公式，不要直接搜往年解答。
3. Inline Questions 自己寫成兩三句話，再用實驗驗證：例如 Q1 第三題，實際把影像邊長加倍，量 attention 的耗時。
4. Q2 的比較圖與 Q4 的 IoU 是整份作業最像研究的地方，可以當成期末專題的暖身。

今晚可以做的一件事：打開 `Transformer_Captioning.ipynb`，只讀 Inline Question 3 的四個情境，在紙上寫下每個情境裡 token 數與計算量怎麼變。

## 延伸閱讀

- Transformer 與 attention 更深入的語言模型視角：[Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)、[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- 擴散與 flow matching 的完整數學：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)
- 生成模型的另一門課觀點：[CS230 對抗樣本與生成模型](/posts/ai/2026-08-16-cs230-adversarial-and-generative)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS231N Assignment 3（Spring 2026）作業頁](https://cs231n.github.io/assignments2026/assignment3/)
- [assignment3.zip 起始碼](https://cs231n.github.io/assignments/2026/assignment3.zip)
- [CS231N Assignments 總頁（配分、Honor Code、生成式 AI 政策）](https://cs231n.stanford.edu/assignments.html)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- Dosovitskiy et al., [An Image is Worth 16x16 Words (ViT)](https://arxiv.org/abs/2010.11929)
- Chen et al., [A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)](https://arxiv.org/abs/2002.05709)
- Ho et al., [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- Radford et al., [CLIP 官方 repo](https://github.com/openai/CLIP)
- Grill et al., [BYOL](https://arxiv.org/abs/2006.07733)
- Caron et al., [Emerging Properties in Self-Supervised Vision Transformers (DINO)](https://arxiv.org/abs/2104.14294)
