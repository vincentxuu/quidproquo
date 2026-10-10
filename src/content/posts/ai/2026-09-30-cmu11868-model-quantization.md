---
title: "CMU 11-868 L19–L20 模型量化：GPTQ 省下的是記憶體，速度是順便換來的"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, quantization, llm-inference]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 15
tldr: "11-868 用兩講處理量化：L19 從 BF16、absmax／zero-point 講到 AdaQuant、ZeroQuant、LLM.int8()，L20 整講拆解 GPTQ。GPTQ 只量化權重，每次量化一欄就用二階資訊修正還沒量化的權重，再靠 lazy batch update 與 Cholesky 讓它跑得動 175B。它省下的主要是記憶體；推論變快，是因為單一 batch 的 decode 本來就卡在讀權重，運算量本身沒有減少。"
description: "CMU 11-868 LLM Systems（2026 春季版）L19 Model Quantization 與 L20 Model Quantization II 導讀：低精度格式、absmax 與 zero-point、訓練中量化與訓練後量化的取捨、ZeroQuant 與 LLM.int8() 的解法、GPTQ 從 OBS／OBQ 演變而來的三個關鍵改動，以及講義自己列出的限制。"
draft: false
glossary:
  - term: "GPTQ"
    aliases: ["GPT-Q"]
    definition: "一種一次性（one-shot）訓練後權重量化方法。逐層、逐欄量化權重，並用輸入資料算出的近似 Hessian 修正尚未量化的權重，以抵銷捨入誤差。"
    context: "11-868 L20 整講的主題；讀的論文是 Frantar et al., ICLR 2023。"
    links:
      - label: "GPTQ（arXiv 2210.17323）"
        url: "https://arxiv.org/abs/2210.17323"
  - term: "post-training quantization"
    aliases: ["PTQ", "訓練後量化"]
    definition: "模型訓練完之後，只用少量校準資料把權重或 activation 轉成低位元表示，不再重新訓練整個模型。"
    context: "L19 把量化方法分成「訓練中」與「訓練後」兩類，LLM 幾乎只能走後者。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-model-quantization-en)

**本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列第 15 篇，接在 [HW5：資料平行與管線平行](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training)之後。前面幾篇在問「模型太大，怎麼多放幾張卡」；從這篇開始換一個方向：能不能讓模型本身變小。

用到的官方材料是兩份投影片：3/25 的 [L19 Model Quantization](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-19-quantization-da7a2abad092c802b03672ce1cc7bee9.pdf)（25 頁）與 3/30 的 [L20 Model Quantization II](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-20-quantization2-ba573d7e5d82e68027bbd3a92c3cd819.pdf)（37 頁），講者都是 Lei Li。[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 在 L20 列的 reading 只有 [GPTQ](https://arxiv.org/abs/2210.17323)，L19 沒有列 reading；正在上課的 [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) 則替 L19 補上 NN Quantization、AdaQuant、LLM.int8() 三篇。本課講義公開、作業公開，存取等級是 **A3**，但沒有公開錄影，以下內容只來自投影片與論文。文中頁碼以 PDF 檔的頁數為準。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## 聚焦問題：量化省下的是記憶體，還是時間？

L19 第 3 頁先擺出成本：投影片寫 Llama-70B 推論需要 140GB GPU 記憶體。第 4 頁的定義很短：用低位元精度存參數與層輸出。好處列了兩條，缺點一條：

- 省記憶體，所以可以開更大的 batch。
- 加快運算，一個 cycle 能做更多運算。
- 代價是可能掉準確率。

這兩條好處不一定同時成立。讀完兩講會發現，GPTQ 主要拿到的是第一條，第二條是在特定條件下才出現的副產品。這是整篇要帶走的判斷。

## L19：低精度數字與最直接的量化

### BF16 為什麼快

第 6 頁用一個具體機制說明低精度怎麼換到速度：`HFMA2` 指令把兩個 BF16 數字塞進一個 32 位元暫存器，一個 cycle 做兩組 fused multiply-add，所以是 2 倍。投影片註明 A100／A6000 以後的 GPU 支援 BF16。第 7 頁列出對應的 CUDA API `__hadd2`、`__hfma2`。

這是「速度」那條好處的來源：**運算本身用低精度做**，硬體才有加速。記住這點，後面講 GPTQ 時會用到。

### absmax 與 zero-point

第 10 頁給了兩種把浮點數轉成 INT8 的程式：

- **absmax**：用張量的最大絕對值算 scale，把數值線性縮放到 −127～127。
- **zero-point**：用最大值與最小值的差算 scale，再算一個零點偏移，讓整個 −128～127 都用得上。資料分布不對稱時比較不浪費。

第 11 頁附了一個 Colab 連結，可以直接跑。

第 8 頁列出直接量化會出的三種錯：精度損失會累積雜訊、範圍對不上時數值被截斷、捨入誤差。第 18 頁的 MobileNet-v2 表格讓代價變具體：浮點模型 top-1 是 65.4%，**直接量化後只剩 1.7%**，用 AdaQuant 校正後回到 52.3%。

<details>
<summary>講義第 10 頁的兩個函式（PyTorch）</summary>

```python
import torch

def absmax_quantize(X):
    scale = 127 / torch.max(torch.abs(X))
    X_quant = (scale * X).round()
    X_dequant = X_quant / scale
    return X_quant.to(torch.int8), X_dequant

def zeropoint_quantize(X):
    x_range = torch.max(X) - torch.min(X)
    x_range = 1 if x_range == 0 else x_range
    scale = 255 / x_range
    zeropoint = (-scale * torch.min(X) - 128).round()
    X_quant = torch.clip((X * scale + zeropoint).round(), -128, 127)
    X_dequant = (X_quant - zeropoint) / scale
    return X_quant.to(torch.int8), X_dequant
```

</details>

### 訓練中量化 vs. 訓練後量化

第 13–15 頁畫了一張分類圖。在訓練中量化要重新訓練或微調，很貴。訓練後量化（post-training quantization）再分兩群：

| 群組 | 方法 | 講義的評語 |
|---|---|---|
| 保準確率 | AdaQuant、BRECQ、OBQ | 逐層或逐段量化，難擴展到數十億參數 |
| 能擴展 | ZeroQuant、LLM.int8() | 撐得住大模型，但低位元時會掉準確率 |

第 16 頁把共同的出發點寫成一個式子：逐層找量化後的權重 Ŵ，讓 ‖WX − ŴX‖² 最小，X 是這一層的輸入。限制是誤差仍會一層一層累積。

第 19 頁點出 LLM 的困難：要壓到 3 或 4 位元時，把每個權重四捨五入到最近的量化格點，準確率就會掉。GPTQ 要解的就是這一格。

### ZeroQuant 與 LLM.int8()

- **[ZeroQuant](https://arxiv.org/abs/2206.01861)**（第 20–21 頁）：逐層知識蒸餾，原模型當老師、量化模型當學生。投影片說它驗證到 20B（GPT-NeoX-20B），1.3B 模型約要 3 小時，並已整合進 DeepSpeed。同一頁拿它跟 GPTQ 比：GPTQ 處理大 100 倍的模型約 4 小時。
- **[LLM.int8()](https://arxiv.org/abs/2208.07339)**（第 22–23 頁）：矩陣乘法用 8 位元，但 activation 裡有極端的 outlier。做法是把 outlier 留在 FP16，其餘走 INT8。投影片給的 outlier 判準是：量級 ≥ 6.0、影響 ≥ 25% 的層、影響 ≥ 6% 的序列維度。

## L20：GPTQ 怎麼把二階方法做到 175B

### 兩個核心動作

第 5 頁回到同一個逐層目標 ‖WX − ŴX‖²，GPTQ 的關鍵想法只有兩條：

1. 一次量化一個欄區塊（column block）的權重。
2. 每量化一個權重，就更新所有**還沒量化**的權重，補償剛才產生的誤差。

第二條是它跟「直接四捨五入」（round-to-nearest）的根本差別：誤差不是被丟掉，而是被推給還能調整的權重吸收。

### 演算法四步

第 6–11 頁用一個 block size B = 4 的權重矩陣逐步畫出流程：

1. 預先算好輸入的 Hessian 反矩陣，並做 Cholesky 分解：G = Cholesky((2XXᵀ + λI)⁻¹)ᵀ。
2. 在目前的區塊裡，一次量化一欄，例如量化到 int8 或 int4。
3. 算出這一欄的捨入誤差，除以 G 的對角元素。
4. 用這個誤差更新同一區塊裡剩下的欄；整個區塊做完後，再一次更新區塊右邊所有剩下的權重。

第 7 頁拿 DeepSeek-V3 舉例說明 X 的形狀：batch × 128k 長度 × 7168 維，所以要算的 Hessian 是 7168 × 7168，跟序列長度無關。

### 為什麼它跑得動：從 OBS 到 GPTQ

第 13–20 頁是這一講最有內容的部分，解釋 GPTQ 為什麼不是另一個「準但慢」的方法。這條線有三代：

| 方法 | 做什麼 | 卡在哪 |
|---|---|---|
| Optimal Brain Surgeon（1993） | 用泰勒展開找出刪掉後損失增加最少的一個權重，並算出其餘權重的最佳補償 | Hessian 是 d × d，d = 列數 × 欄數；總成本 O(d⁴) |
| OBQ（2022） | 把 OBS 用在量化；逐列處理，每列只需要 d_col × d_col 的 Hessian | 成本仍是 O(d_row · d_col³) |
| GPTQ（2023） | 三個工程改動，見下 | — |

GPTQ 的三個改動：

1. **任意順序就夠好**（第 18 頁）。OBQ 依誤差大小挑下一個要量化的權重。GPTQ 觀察到，改成固定順序的損失通常很小：早期誤差大的權重，會被後面還能調整的權重平衡掉。所有列用同一個順序，Hessian 反矩陣對每一列都一樣，只需要更新 d_col 次，而不是 d_row · d_col 次。第 17 頁寫出成本從 O(d_row · d_col³) 降到 O(max(d_row · d_col², d_col³))。
2. **Lazy batch update**（第 19 頁）。逐欄更新的算術強度太低，GPU 吃不飽。第 i 欄的捨入決定只受這一欄的更新影響，後面的欄可以晚點再一起改。所以先在區塊內做完，再一次批次更新其餘權重。
3. **Cholesky 預先計算**（第 20 頁）。到了 LLM 的規模，反覆更新 Hessian 反矩陣會累積數值誤差，甚至變成不定矩陣。量化第 q 個權重時，只需要反矩陣第 q 列從對角線開始的元素，所以一開始用 Cholesky 分解就能把需要的資訊一次算好，也不增加多少記憶體。

第三條是系統課的典型觀點：演算法在數學上沒變，換一種計算順序，讓它在 GPU 上能跑、數值上也穩。

### 實驗設定與結果

第 22 頁列出設定：校準資料從 C4 隨機取樣（所以方法不針對特定任務）、每列非對稱的 min-max 均勻量化，以每個 transformer block 為單位，輸入用上一個已量化 block 的輸出。

第 24–28 頁的結果圖來自論文，投影片上只有圖、沒有可抄的數字。論文摘要給的數字是：175B 的 GPT 模型約 4 個 GPU 小時完成量化，壓到每個權重 3 或 4 位元，準確率損失可以忽略；相對 FP16 的端到端推論加速，在 A100 約 3.25 倍、A6000 約 4.5 倍；2 位元甚至三值量化仍有合理的準確率。

第 29–35 頁轉向實作：先帶讀 [GPTQ-for-LLaMa](https://github.com/qwopqwop200/GPTQ-for-LLaMa) 的 `gptq.py`（Hessian 初始化與更新、lazy batch update、Cholesky 重寫），再給一段 AutoGPTQ 範例，設定是 `bits=4, group_size=128`，校準資料一樣取自 C4。

## 回到聚焦問題：速度是從哪來的

第 23 頁的說明是整講最值得抄下來的一句：**單一 batch 的推論是 memory-bound，因為做的是 GEMV**。反量化雖然多花一點運算，自訂 kernel 減少了記憶體存取，所以端到端時間下降。

第 36 頁的限制把話說完：

- **理論運算量沒變**。權重存成 3／4 位元，算的時候仍要還原。
- **只量化權重，沒有處理 activation 的量化**。

合起來看：GPTQ 省下的是記憶體，這是確定的收益。速度來自「decode 本來就卡在搬權重」，搬的位元少了，時間就少了。換成大 batch、compute-bound 的情境，這份加速就不能直接套用。L19 開頭 `HFMA2` 那種「低精度運算本身變快」的加速，GPTQ 並沒有拿到。

## 延伸閱讀

- 本課講義把 FlashAttention 排在下一講，繼續處理「搬資料比算還貴」這件事：[L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention)。
- 推論端為什麼是 memory-bound，Stanford CS336 的[推論篇](/posts/ai/2026-08-22-cs336-inference)從算術強度推了一次。
- 量化在整個 LLM 服務堆疊中的位置：[CME295 LLM 系統篇](/posts/ai/2026-09-29-cme295-llm-systems)。

## 系列導覽

- 上一篇：[HW5：資料平行與管線平行](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training)
- 下一篇：[L21 FlashAttention（Tri Dao 客座）](/posts/ai/2026-09-30-cmu11868-flashattention)
- 系列總覽：[CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L19 Model Quantization 投影片（Lei Li, 2026-03-25）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-19-quantization-da7a2abad092c802b03672ce1cc7bee9.pdf)
- [L20 Model Quantization II 投影片（Lei Li, 2026-03-30）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-20-quantization2-ba573d7e5d82e68027bbd3a92c3cd819.pdf)
- [Frantar et al., GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers（arXiv 2210.17323）](https://arxiv.org/abs/2210.17323)
- [GPTQ 官方實作 IST-DASLab/gptq](https://github.com/IST-DASLab/gptq)
- [Dettmers et al., LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale（arXiv 2208.07339）](https://arxiv.org/abs/2208.07339)
- [Yao et al., ZeroQuant（arXiv 2206.01861）](https://arxiv.org/abs/2206.01861)
- [GPTQ-for-LLaMa（講義第 29 頁帶讀的程式碼）](https://github.com/qwopqwop200/GPTQ-for-LLaMa)
- [CMU 11-868 Fall 2026 Syllabus（對照用）](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
