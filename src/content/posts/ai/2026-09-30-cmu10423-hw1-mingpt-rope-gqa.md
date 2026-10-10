---
title: "CMU 10-423 HW1：在 minGPT 加上 RoPE 與 GQA——題目結構、要改的檔案與算力"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, transformer, attention, pytorch]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 4
tldr: "CMU 10-423 Spring 2026 的 HW1 總分 62：書面題考 RNN LM（7 分）、Transformer LM（19 分）、sliding window attention（11 分），程式題（22 分）要你在 Karpathy 的 minGPT 上實作 RoPE 與 GQA，用莎士比亞全集訓練字元級模型並畫出損失與注意力時間。只需上傳 model.py；handout 附 5 個單元測試，官方估計所有實驗在 Colab T4 上合計約 40 分鐘。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）HW1「Generative Models of Text」導讀：配分表、書面題各大題在考什麼、minGPT 起始碼的檔案與 TODO、chargpt.py 的旗標、七個實驗題與 Colab／Kaggle 的算力估計、Slot A／B 的 AI 使用規則，以及校外能拿到與拿不到的材料。不附解答。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 4 篇，也是文字單元的收尾。前一篇 [L4：現代 Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa) 講了 RoPE、GQA 與 sliding window 的原理，這一篇看作業怎麼要你把它們做出來。

用到的官方材料：[Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)上的 [hw1.zip](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)（內含 27 頁的 hw1.pdf、起始碼與 LaTeX 模板）、[Overleaf 唯讀模板](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1)、1 月 30 日的 [HW1 recitation 投影片](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing)（Google Slides，公開），以及課綱的作業規則。**本文只寫題目結構與設定，不附任何解答。**

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 基本資料

| 項目 | 內容 |
|---|---|
| 名稱 | Homework 1: Generative Models of Text（Coursework 頁標為「Large Language Models」） |
| 範圍 | L1–L4（講次表） |
| 發下 | hw1.pdf 寫 2026-01-27；講次表把「HW1 out」標在 1 月 26 日 |
| 截止 | 2026-02-09 晚上 11:59（Slot A）；[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)把回饋標在 2 月 14 日、Slot B 標在 2 月 17 日，兩者都註明 tentative |
| 繳交 | Gradescope：書面 PDF 一份、程式只交 `model.py` |
| 總分 | 62 |

配分表（hw1.pdf 第 1 頁）：

| 大題 | 分數 |
|---|---|
| LaTeX Template Alignment | 0 |
| Recurrent Neural Network (RNN) Language Models | 7 |
| Transformer Language Models | 19 |
| Sliding Window Attention | 11 |
| Programming: RoPE and GQA | 22 |
| Code Upload | 1 |
| Collaboration Questions | 2 |

書面題占 37 分，比程式題多。只想練寫程式的人，別直接跳到第 5 大題。

### 先搞懂 Slot A 與 Slot B

[課綱](https://www.cs.cmu.edu/~mgormley/courses/10423/)規定每份作業有兩個截止點：

- **Slot A**：只能交純人工作答，不准用 AI 輔助。助教批改後告訴你哪幾題錯了。
- **Slot B**：收到回饋三天後截止，可以用 AI、也可以和同學完整合作，但只重改 Slot A 做錯的題目。

每題取兩次的較高分，總分是 0.95 × 各題最高分的總和，再加上「Slot A 超過一半分數」的 0.05 獎勵。把 AI 輔助的作品交到 Slot A 算學術倫理違規。Slot A 不能用 grace days，助教也只在 Slot A 開放期間回答作業問題。

handout 裡因此放了 `.cursorignore`、`.aiderignore` 和 `.vscode/settings.json`（關掉 GitHub Copilot 與行內建議）。hw1.pdf 說明這些檔案是要讓你在 Slot A 期間比較容易不用 AI 寫作業。

## 書面題在考什麼

### 第 2 大題：RNN 語言模型（7 分）

- **2.1**：給一個激活函數為 slide(a) = min(1, max(0, a)) 的 Elman RNN，W_hh 固定為單位矩陣，要你自己設定其他參數，讓輸出滿足一個指定的邏輯條件。
- **2.2**：兩小題都在問雙向 RNN 能不能拿來定義自回歸語言模型。差別在於雙向 RNN 是跑在整個序列上，還是只跑在前綴 x₁:ₜ₋₁ 上。

這題回扣 [L1 的 RNN LM](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff) 與自回歸分解的定義。

### 第 3 大題：Transformer 語言模型（19 分）

- **3.1**：先用概念題問為什麼需要 query、key、value 三者；再用「birds fly away」三個 one-hot token，給定 W_q、W_k、W_v，分步手算 Q、K、V、分數矩陣、注意力矩陣與輸出。每一小步都給了獨立的固定矩陣，前一步算錯不會連帶影響後面。
- **3.2**：比較 multiplicative、concatenated、additive 三種注意力分數的表達能力，例如能不能學到兩向量夾角或 cos 值。
- **3.3**：問多頭注意力的分數矩陣是否一定對稱；再問把兩個 head 的參數串接成一個單頭注意力，輸出會不會和原本的雙頭相同。

### 第 4 大題：Sliding window attention（11 分）

這一大題只有書面題，沒有程式。recitation 投影片也註明 sliding window 是「only written, no programming」。

- **4.1**：題目給了 N = 6、w = 4 的遮罩矩陣範例，問直接用矩陣乘法加遮罩時的時間與空間複雜度。
- **4.2**：給一份 `SlidingWindowAttention(Q, K, V, w)` 的虛擬碼骨架，挖了 7 個空格（區域分數向量的形狀與初值、窗口迴圈範圍、區域索引到 token 索引的對應、邊界判斷、分數公式、加權累加），要求填完後的漸進計算量低於直接矩陣乘法。最後再問你這份虛擬碼的時間與空間複雜度。

它對應的是 L4 投影片上「for 迴圈實作：漸進上更快、更省記憶體」那一列。

## 程式題：把 minGPT 升級成「自己的 Llama-2」

hw1.pdf 的說法是：完成後你還不能說自己訓練了一個大型語言模型，因為資料集只有莎士比亞全集，但可以合理地說你做出了自己的 Llama-2 模型。

### 資料與起始碼

- **資料**：`input.txt`，莎士比亞全集，約 1.1 MB，字元級，詞彙量 65。
- **起始碼**：改自 Andrej Karpathy 的 [minGPT](https://github.com/karpathy/minGPT)，課程版做了簡化。

| 檔案 | 用途 | 要不要改 |
|---|---|---|
| `chargpt.py` | 訓練進入點，用旗標調整設定 | 換生成提示詞時要改 |
| `mingpt/model.py` | GPT 模型本體 | **主要修改對象** |
| `mingpt/trainer.py` | 訓練迴圈 | 不用 |
| `mingpt/utils.py` | 存 log 與設定的工具 | 不用 |
| `test_model.py` | 單元測試，與 Gradescope 上的相同 | 不用 |

`model.py` 裡標了 TODO 的地方有三塊：

1. `RotaryPositionalEmbeddings`：`__init__`、`_build_cache`、`forward`。hw1.pdf 要求 forward 第一步先檢查快取建了沒。
2. `CausalSelfAttention`：初始化 RoPE，並補上開啟 RoPE 時的 forward 路徑。
3. `GroupedQueryAttention`：從初始化（檢查嵌入維度能否整除 head 數、Q／K／V 與輸出投影、dropout、因果遮罩、RoPE 整合）到 forward 全部自己寫。hw1.pdf 另外要求記錄注意力運算前後的 CUDA 記憶體用量，`CausalSelfAttention` 裡有參考寫法。

`Block` 類別會在 `n_query_head != n_kv_head` 時自動改用 `GroupedQueryAttention`，否則用原本的 `CausalSelfAttention`。

### 預設模型與旗標

預設模型有 6 層、每層 h = 6 個注意力 head、最大序列長度 N = 16、d_model = 192、d_k = 32。`chargpt.py` 裡的學習率是 5e-4，`trainer.py` 的預設是 batch size 64、600 iterations。

常用旗標（hw1.pdf 表 1）：

```bash
python chargpt.py --data.block_size=16        # 序列長度
python chargpt.py --model.n_query_head=6 --model.n_kv_head=3   # GQA，query head 數須能被 kv head 數整除
python chargpt.py --model.rope=True           # 開啟 RoPE
python chargpt.py --model.pretrained_folder=out/chargpt3       # 從前一次的模型接著訓練
python chargpt.py --trainer.max_iters=200 --trainer.device=cpu
```

訓練時每 200 iterations 會以「O God, O God!」為開頭生成 500 個字元，並把模型、訓練損失、注意力時間與記憶體寫進 `work_dir` 下的 JSON 檔，畫圖就靠這些檔案。

### 七個實驗題

| 題號 | 分數 | 要交什麼 | 官方估計（Colab T4） |
|---|---|---|---|
| 5.1 | 2 | RoPE 模型訓練 600 iterations（長度 16）後的生成樣本 | 約 3 分鐘 |
| 5.2 | 2 | 再用長度 256 接著訓練 600 iterations 後的生成樣本 | 約 5 分鐘 |
| 5.3 | 2 | 讀 `GPT.generate()`，判斷它有沒有 KV cache 並說明 | — |
| 5.4 | 4 | RoPE 與原版 minGPT 在上述 1,200 iterations 的損失曲線 | 約 10 分鐘 |
| 5.5 | 4 | key head 數為 {1, 2, 3, 6} 時的平均注意力計算時間 | 約 1 分鐘 |
| 5.6 | 4 | GQA（2 個 key head）與原版的損失曲線，200 iterations | 約 6 分鐘 |
| 5.7 | 4 | 原版、只有 RoPE、只有 GQA、RoPE + GQA 四條曲線 | 約 16 分鐘 |

5.1、5.2 要用你最喜歡的一齣莎劇的第一行當提示詞，不能用預設那句。5.5–5.6 用絕對位置編碼，不開 RoPE。整份程式題照官方估計合計約 40 分鐘 GPU 時間。

### 單元測試

`test_model.py` 有 5 個測試：T01 檢查上傳檔案（只在 Gradescope 上生效）、T02 GQA、T03 RoPE、T04 GQA 的 dropout、T05 GQA 加 RoPE。hw1.pdf 特別說明，程式分數的大部分仍由助教人工批改，測試通過不等於拿滿分。

## 環境與算力：今天還跑得動嗎

hw1.pdf 列了三條路：

- **Colab**：免費 T4 GPU，但有時間限制；GPU 額度用完可以等、換帳號、買 Colab 付費方案，或改用 Kaggle、GCP、AWS。
- **Kaggle**：每週 30 小時免費 T4 或 V100，hw1.pdf 說足夠完成本作業，並附了開 GPU、開網路、上傳檔案的步驟。
- **本機**：建議拿 `test_model.py` 在本機除錯，不建議用 CPU 訓練。

我在 2026-09-30 下載 hw1.zip 實測（macOS、PyTorch 2.13、CPU）：

- `python test_model.py` 可以跑，T02–T05 在未實作時丟 `NotImplementedError`，這是預期行為。
- 未修改的原版 `chargpt.py` 在 CPU 上跑 20 iterations 約 28 秒，loss 從 3.83 降到 2.94。照這個速度，600 iterations 就要十幾分鐘，確實該上 GPU。

這份作業不需要下載任何外部資料或權重，資料集就在 zip 裡，依賴也只有 PyTorch 與 einops，是四份作業裡最容易在校外重現的一份。

有兩處 handout 與 zip 對不上，照實記下：

- hw1.pdf 的檔案清單列了 `requirements.txt`（torch、einops），zip 裡實際附的是 `environment.yaml`（Python 3.10、pytorch、einops）。
- hw1.pdf 提到可以匯入 Kaggle 用的 notebook，但 zip 裡沒有 `.ipynb`；`model.py` 的 docstring 說 RoPE 公式在「writeup 第 13 頁」，本版 PDF 在第 18–19 頁。

## Recitation 投影片可以補什麼

1 月 30 日的 recitation 投影片公開，順序是 minGPT 簡介、RoPE、GQA、einops、sliding window：

- **RoPE**：用「Your cat is a lovely cat」逐字示範旋轉角度隨位置增加，從 2 維旋轉矩陣推到 d 維的區塊版本，最後給出作業要用的矩陣版公式，並點明要套用 RoPE 的是 key 和 query。
- **GQA**：從 MHA、MQA 的記憶體與速度取捨講到 GQA，畫出分組、各組共用 K／V、串接後投影回 n_embd 的步驟。
- **PyTorch 工具**：`torch.unsqueeze`、`torch.cat`、`torch.arange`、`torch.sin`／`torch.cos`，以及 `einops.rearrange`。

講次表同一列的「Supplemental Material」是 Google Drive 連結，校外打開回 401，拿不到。

**怎麼做**：今晚下載 hw1.zip，建好只有 PyTorch 與 einops 的環境，跑一次 `python test_model.py`，確認看到 4 個 `NotImplementedError`。接著打開 `model.py`，只讀 `CausalSelfAttention.forward`，把每個張量的形狀寫在旁邊的註解裡。GQA 的實作幾乎就是在這個形狀表上改 head 數。

## 這一篇可以確認與不能確認的

可以確認：hw1.zip 裡的 PDF、起始碼與測試，recitation 投影片，課綱的 Slot A／B 規則，以及本機測試結果。不能確認：Gradescope 的自動評分與人工批改標準、講次表暫定的 Slot B 日期（2 月 17 日）當學期是否照表執行、HW1 Supplemental Material 的內容（401），以及官方解答。

延伸閱讀：想從零寫一個 LM 並自己決定架構，可以看 [Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)；Karpathy 原版的 [minGPT repo](https://github.com/karpathy/minGPT) 也值得對照，看課程版簡化了哪些地方。

系列導覽：上一篇 [L4：預訓練、微調與現代 Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)｜下一篇 [L5：CNN、encoder-only Transformer 與 ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁與課綱](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW1 handout（hw1.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW1 Overleaf 唯讀模板](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1)
- [HW1 Recitation 投影片（2026-01-30）](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [karpathy/minGPT](https://github.com/karpathy/minGPT)
- [Su et al. 2021：RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Ainslie et al. 2023：GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)
