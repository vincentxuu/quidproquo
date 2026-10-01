---
title: "CMU 10-423 HW4：用 Q-Former 接起凍結的 GPT-2 與 DiT 做文生圖——題目結構、要改的檔案與算力"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, multimodal, text-to-image, diffusion-transformer, vision-language-model]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 15
tldr: "CMU 10-423 Spring 2026 的 HW4 總分 79：書面題考 LDM（7 分）、VQ-VAE（8 分）、CLIP（4 分）、以 PaliGemma2 為例的 VLM（18 分），程式題（40 分）要你在凍結的 GPT-2 與凍結的 CIFAR-10 DiT 之間只訓練一個 Q-Former，讓類別條件的擴散模型改吃文字。要寫的程式只有三個函式，14 個單元測試；官方估計 25 個 epoch 在 T4 上要 2–3 小時、A100 約 1 小時，資料與 DiT 權重得用 download_data.sh 從 Google Drive 下載。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）HW4「Multi-Modal Foundation Models」導讀：配分表、書面題各大題在考什麼、Q-Former 文生圖管線的三個元件、三個 TODO 函式與 14 個單元測試、run_in_cloud.ipynb 的訓練指令與算力估計、實驗題清單、Drive 下載與 transformers==4.46.3 的環境細節，以及 handout 與 zip 對不上的地方。不附解答。"
draft: false
glossary:
  - term: "Q-Former"
    aliases: ["Querying Transformer", "Query Former"]
    definition: "用一組固定數量、可學習的 query 向量，透過 cross-attention 從另一個模型的任意長度輸出中抽取資訊，再投影成下游模型需要的格式。BLIP-2 用它把凍結的影像編碼器接到凍結的 LLM。"
    context: "HW4 反過來用：query 從 GPT-2 的文字隱藏狀態抽資訊，輸出給 DiT 當條件向量。"
    links:
      - label: "BLIP-2 (Li et al., 2023)"
        url: "https://arxiv.org/abs/2301.12597"
  - term: "adaLN"
    aliases: ["Adaptive LayerNorm", "AdaLN"]
    definition: "DiT 注入條件的方式：把條件向量（例如類別 embedding）送進一個小網路，輸出每一層 LayerNorm 的 scale 與 shift，而不是把條件當成 token 放進序列。"
    context: "HW4 的預訓練 DiT 原本用 10 個類別 embedding 驅動 adaLN，作業把它換成 Q-Former 輸出的逐層向量。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 15 篇，也是多模態單元的收尾。前一篇 [L14–L15：Cross-attention、DiT、Prompt-to-Prompt 與 Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer) 講了文字條件從模型的哪裡注入，這一篇看作業怎麼要你親手把一個只認得 10 個類別的擴散模型改成吃文字。

用到的官方材料：[Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)上的 [hw4.zip](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip)（內含 30 頁的「S26 10423 HW4.pdf」、起始碼與單元測試）、[Overleaf 唯讀模板](https://www.overleaf.com/read/fvnjnmymbzmt#bd53e3)、[課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)，以及 [Lecture 15 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)的 Querying Transformer 段。全部在 2026-09-30 下載核對。

本文只講題目結構、配分、要改的檔案、算力與環境。**不提供任何題目的解答。**

## 基本資料

| 項目 | 內容 |
|---|---|
| 名稱 | Homework 4: Multi-Modal Foundation Models |
| 範圍 | L12–L14（講次表寫「HW4 out (L12-L14)」） |
| 發下 | handout 寫 2026-03-13；講次表把「HW4 out」標在 3 月 12 日 |
| 截止 | 2026-03-23（Slot A）；講次表另列 3 月 30 日為 Slot B（tentative） |
| 繳交 | Gradescope：書面 PDF 一份；程式交 `train_qformer.py`、`dit.py`、`image_caption_data.py` |
| 總分 | 79 |

配分表（handout 第 1 頁）：

| 大題 | 分數 |
|---|---|
| LaTeX Template Alignment | 0 |
| Latent Diffusion Model (LDM) | 7 |
| VQ-VAEs | 8 |
| CLIP | 4 |
| VLMs | 18 |
| Programming: Text-to-Image Generation | 40 |
| Code Upload | 0 |
| Collaboration Questions | 2 |

Slot A 只准人工作答、Slot B 可以用 AI 的規則，[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)有完整說明。L18 投影片的提醒頁把 HW4 Slot A 標成「no AI assistance!」，並預告 3 月 27 日有涵蓋 HW3／HW4 的程式測驗（Programming Test）。

## 書面題在考什麼

四個書面大題對應 L12–L14 的四塊內容，題型以計算與簡答為主：

- **LDM（7 分）**：給定壓縮倍率 f = 8，算 512×512 圖片的 latent 大小；解釋為什麼要在 latent space 而不是 pixel space 做擴散；再把 cross-attention 的 value 改成由影像端計算，問數學上哪裡出錯、直覺上為什麼不合理。
- **VQ-VAE（8 分）**：比較有 stop-gradient 與沒有 stop-gradient 兩種目標函式，分別對 encoder 輸出與 codebook 向量求梯度，再用文字說明 stop-gradient 對兩個項的最佳化有什麼影響、codebook 在被最佳化成什麼。
- **CLIP（4 分）**：證明 CLIP 論文的對稱 cross-entropy 目標，等價於拉高配對圖文的 cosine 相似度、壓低其他組合。
- **VLM（18 分）**：以 [PaliGemma2](https://arxiv.org/abs/2412.03555) 為例，畫出 SigLIP 視覺編碼器、線性投影層、Gemma 2 語言模型之間的資料流並說明各自角色；計算解析度從 224×224 升到 448×448、patch 維持 14×14 時視覺 token 數怎麼變；最後要你拿一個商用 VLM（handout 舉 GPT 或 Gemini）先做一次密集描述，再找一組讓它答錯的對抗圖片與問題，附截圖。

最後一題是整份作業唯一需要操作外部服務的題目，今天仍然可以照做，但結果會隨模型版本不同。

## 程式題：只訓練中間那一層

程式題的設定寫在 handout 第 6 節。管線有三個元件：

| 元件 | 狀態 | 作用 |
|---|---|---|
| GPT-2 | 凍結 | 把文字轉成逐 token 的 768 維隱藏狀態 |
| DiT（Diffusion Transformer） | 凍結 | 在 CIFAR-10 上預訓練的類別條件擴散模型，原本用 10 個類別 embedding 透過 adaLN 調制每一層 |
| Q-Former | 訓練 | 用少量可學習 query 向 GPT-2 的輸出做 cross-attention，產生 DiT 每一層要的條件向量，取代原本的類別 embedding |

handout 給了兩個「為什麼不直接把 GPT-2 特徵丟給 DiT」的理由：GPT-2 輸出長度不定，DiT 只吃一個 768 維向量；兩者的表徵空間也沒有理由對齊。Q-Former 的設計引用 Perceiver IO，並提到 [BLIP-2](https://arxiv.org/abs/2301.12597) 與 MetaQueries 用過同樣的結構。L15 投影片的 Querying Transformer 段也是這個順序：PaliGemma 回顧、BLIP-2 的兩階段、MetaQueries、Perceiver IO。

最終產出是 32×32 的圖片，handout 特別提醒 CIFAR-10 解析度本來就低，圖糊不代表模型壞了。

### 三個 TODO 函式

所有訓練迴圈、cross-attention、推論與視覺化都已寫好，你只補三個函式：

| 檔案 | 函式 | 要做的事 |
|---|---|---|
| `image_caption_data.py` | `prompts_to_padded_hidden_states` | 對每個 prompt 呼叫 tokenizer 與 GPT-2（`output_hidden_states=True`），取出指定層的隱藏狀態，補齊到同長度，並回傳標示非 padding 位置的布林遮罩 |
| `train_qformer.py` | `setup_optimizer_and_scheduler` | 凍結 Q-Former 以外的所有參數；建 AdamW（betas 固定為 0.9、0.95）；`warmup_steps > 0` 時用 `LambdaLR` 做線性 warmup；loss 用 MSE |
| `dit.py` | `QueryEmbedder.forward` | 取出 query 表、展開到 batch，逐個 block 做 pre-norm 的 self-attention、cross-attention、FFN 殘差，最後用 `output_proj` 與 `query_to_layer` 投影成（batch, DiT 層數, 條件維度） |

第一個函式有個容易漏的細節：GPT-2 有 12 層，但第一層之前和最後一層之後各有一組隱藏狀態，所以合法的層索引有 13 個。單元測試另外要求索引小於 0 或超出範圍時要丟錯誤。

`run_in_cloud.ipynb` 的訓練指令用 `--gpt2_layer_index 12`，也就是取最後一層之後的狀態；Q-Former 預設 2 個 block、8 個 head，query 數 4。DiT 在訓練腳本裡的設定是 dim 256、10 層、8 個 head。

### 14 個單元測試

`test_all.py` 有 14 個測試，各 1 分權重，分三組：提交檔案檢查 1 個、隱藏狀態抽取 6 個（層索引選擇、先 tokenizer 再 GPT-2、padding、兩種非法索引、遮罩）、optimizer 設定 4 個、Q-Former forward 3 個（輸出形狀、有無 attention mask）。測試用假的 GPT-2 與 tokenizer，不需要下載任何權重。

我在 2026-09-30 本機實測（macOS、Python 3.11、PyTorch 2.13、CPU）遇到兩件事：

- 原版起始碼**無法直接 import**。`dit.py` 的 `QueryEmbedder.forward` 在 `BEGIN/END STUDENT SOLUTION` 之間是空的，Python 會丟 `IndentationError`，整個測試檔收集失敗。三個 TODO 都先補一行 `pass` 才跑得起來。
- `train_qformer.py` 在頂層 `import wandb`，沒裝 wandb 連測試都收集不到。

補上 `pass` 後結果是 13 個失敗、1 個通過（提交檔案檢查），這是預期行為。

## 訓練、推論與實驗題

`run_in_cloud.ipynb` 假設你在 Colab 上把 handout 放進自己的 Google Drive，流程是掛載 Drive、`pip install -r requirements.txt`、`bash ./download_data.sh`，再跑訓練：

```bash
python train_qformer.py \
    --pretrained_model_path ./data/ddpm_dit_cifar_100_epochs.pth \
    --dense_captions_path "./data/cifar10_dense_captions.jsonl" \
    --epochs 25 \
    --batch_size 128 --lr 1e-4 \
    --save_model_path ./models/trained_qformer.pth \
    --gpt2_layer_index 12 --num_query_tokens 4 --cfg 3.0 --data_dir ./data \
    --gpt2_cache_dir ./data --optimizer_ckpt_interval 5 \
    --cache_text_embeddings ./data/text_embeddings.pt
```

訓練資料是 CIFAR-10 配上四種 caption：只有類別名、類別名換成同義描述、加上場景的密集描述、同義描述加場景。GPT-2 的隱藏狀態會先快取到 `data/text_embeddings.pt`，handout 的註腳說原本可以讓你自己產生，但會讓已經很長的作業更花時間。訓練時以 0.1 的機率丟掉文字條件，為推論時的 classifier-free guidance 做準備。

推論用 `python eval_qformer.py --config_yaml inference.yaml`。zip 裡的 `inference.yaml` 附了兩個範例：用原本的類別條件 DiT 生成、以及用訓練好的 Q-Former 生成「a photo of a silver plane in a green grassy background」並存下 t = 1000、500、100 的 attention map。其他實驗要自己往 yaml 加設定。

實驗題（6.1–6.8）的內容：

| 題號 | 內容 | 分數 |
|---|---|---|
| 6.1 | GPT-2 `hidden_states` 的維度 | 2 |
| 6.2 | 讀 `QueryEmbedder.__init__`：query 表、各模組功能、Q／K／V 來源、pre-norm | 12 |
| 6.3 | 算 Q-Former 可訓練參數量與佔比；貼 3 組密集 caption 圖文對 | 4 |
| 6.4 | 只訓 Q-Former 與全部解凍兩種情境的漸近 loss、LLM 一般能力比較 | 4 |
| 6.5 | 訓練 25 epoch、`num_queries=4`，貼 EMA loss 曲線與取樣網格 | 5 |
| 6.6 | 原始 DiT 在「deer」類別上比較 CFG 尺度 w = 1、2、3、4 | 3 |
| 6.7 | 類別條件與文字條件各生成 8 張汽車；兩個分布外的模糊 prompt | 4 |
| 6.8 | 「a photo of a red airplane with a green field in the background」在 t = 500 的兩層 cross-attention map | 6 |

6.8 題的提示指向 [Darcet et al. 2023](https://arxiv.org/abs/2309.16588)（Vision Transformers Need Registers）與 [Xiao et al. 2023](https://arxiv.org/abs/2309.17453)（attention sink），要你解釋 map 上哪些 token 被注意、哪些完全被忽略。

## 環境與算力：今天還跑得動嗎

**算力**：handout 6.5 題標註 25 epoch 在 T4 上約 2–3 小時、A100 約 1 小時。handout 建議用 CMU 信箱驗證領 Colab Pro、優先選 A100，沒有的話 L4 或 T4 也可以。校外讀者拿不到 Colab Pro 教育方案，免費 T4 能不能撐完 2–3 小時不中斷，要看當下的配額。訓練腳本每 5 個 epoch 存一次權重與 optimizer 狀態，可以用 `--resume_optimizer_path`、`--resume_model_path`、`--start_epoch` 從 5 的倍數接續。

**下載**：`download_data.sh` 用 `gdown` 從 Google Drive 抓兩個檔案。我在 2026-09-30 測試：

- `cifar10_dense_captions.jsonl`（約 7.6 MB）可以直接下載，每行有 `index`、`split`、`label_index`、`label_name`、`caption`。
- `ddpm_dit_cifar_100_epochs.pth`（Drive 顯示 51M）因為太大，Drive 先回一個「無法掃毒」的確認頁；檔案本身仍公開。

這兩個檔案放在課程人員的 Drive 上，不是課站本身，哪天權限改掉作業就跑不起來，要自學的人建議先下載備份。

**依賴**：`requirements.txt` 列 torch、wandb、Pillow、torchvision、tqdm、`transformers==4.46.3`、gdown。只有 transformers 釘了版本；我本機的 4.57.6 沒有拿來跑完整訓練，無法確認新版是否相容。wandb 是必要的：取樣網格會存到 wandb，6.5 題要你從那裡貼圖。

**handout 與 zip 對不上的地方**，照實記下：

- handout 的檔案清單沒有 `test_all.py` 與 `inference.yaml`，zip 裡都有；清單上的 `handout/` 目錄在 zip 裡也沒有，檔案直接放在根目錄。
- 6.5 題說訓練 25 epoch，同一題卻要你貼第 5、25、49 個 epoch 的取樣網格；訓練腳本 `--epochs` 的預設值是 20，notebook 指令寫 25。
- Part 2 說 DiT 約 100M、GPT-2 約 117M 參數；6.3 題又說「假設 GPT-2 有 125M、DiT 有 18M」。做 6.3 題時照題目給的數字算。
- 配分表給 VLM 大題 18 分，但各小題標示的分數加起來是 11 分（5.1 的 7 分、第二個編號也是 5.1 的 2 分、5.2 的 2 分）；題號 5.1 重複出現。總分 79 是照配分表加的。

## 拿不到的東西

3 月 13 日的 HW4 recitation 是 Google Slides 連結，校外打開回 401。其他拿不到的：Gradescope 自動評分與人工批改標準、程式測驗、官方解答，以及錄影（Panopto 需要 CMU 登入）。

**怎麼做**：今晚下載 hw4.zip，在三個 TODO 的空白處各補一行 `pass`，裝好 wandb 後跑 `pytest test_all.py`，確認看到 13 個失敗。接著打開 `dit.py`，只讀 `QueryEmbedder.__init__`，把每個模組的輸入輸出形狀寫在旁邊。6.2 題的 12 分幾乎就是這張形狀表。

## 這一篇可以確認與不能確認的

可以確認：hw4.zip 裡的 handout、起始碼、單元測試與 notebook，講次表日期，L15／L18 投影片的提醒頁，Drive 檔案在 2026-09-30 的可下載狀態，以及本機單元測試結果。不能確認：完整訓練在免費 T4 上的實際時間、`transformers` 新版的相容性、recitation 內容（401）、講次表暫定的 Slot B 日期（3 月 30 日）當學期是否照表執行，以及官方解答。

延伸閱讀：擴散模型與 guidance 背後的數學，可以對照 [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)；LoRA 這類參數高效微調的系統面，見 [CMU 11-868 L23：大模型的高效微調](/posts/ai/2026-09-30-cmu11868-peft-lora)。

系列導覽：上一篇 [L14–L15：Cross-attention、DiT、Prompt-to-Prompt 與 Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)｜下一篇 [L15–L16：Scaling laws 與 Mixture of Experts](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁與課綱](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW4 handout（hw4.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — 配分表、題目、起始碼、單元測試、notebook、download_data.sh
- [HW4 Overleaf 唯讀模板](https://www.overleaf.com/read/fvnjnmymbzmt#bd53e3)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — HW4 發下、Slot A／B、recitation 與程式測驗日期
- [Lecture 15 投影片：Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 18 投影片：FlashAttention & Efficient Decoding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — HW4 Slot A 與程式測驗提醒
- [Li et al. 2023：BLIP-2](https://arxiv.org/abs/2301.12597)
- [Steiner et al. 2024：PaliGemma 2](https://arxiv.org/abs/2412.03555)
- [Peebles & Xie 2023：Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [Radford et al. 2021：Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020)
- [Ho & Salimans 2022：Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Darcet et al. 2023：Vision Transformers Need Registers](https://arxiv.org/abs/2309.16588)
- [Xiao et al. 2023：Efficient Streaming Language Models with Attention Sinks](https://arxiv.org/abs/2309.17453)
