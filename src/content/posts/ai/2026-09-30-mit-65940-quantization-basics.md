---
title: "MIT 6.5940 第 5 講：數字格式、K-means 量化與線性量化"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, quantization, model-compression, hardware]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 5
tldr: "MIT 6.5940 第 5 講從「8-bit 整數加法比 32-bit 浮點加法省 30 倍能量」出發，先複習 INT、定點數、FP32/FP16/BF16、FP8 與 FP4 的位元配置，再講兩種量化：K-means 量化只省儲存、計算仍是浮點；線性量化用 r = S(q − Z) 把矩陣乘法、全連接層與卷積都改成整數運算。"
description: "MIT 6.5940 EfficientML（Fall 2024）Lecture 5 Quantization Part I 導讀：低位元運算的能量成本、整數與浮點格式（FP32、FP16、BF16、FP8 E4M3/E5M2、INT4 與 FP4）、量化的定義、K-means 量化與 Deep Compression、線性量化的 scale 與 zero point、對稱量化與整數化的全連接層和卷積，附 Fall 2026 對照。"
draft: false
glossary:
  - term: "zero point"
    aliases: ["零點", "Z"]
    definition: "線性量化 r = S(q − Z) 中的整數參數，讓實數 0 能被某個量化整數精確表示；對稱量化時 Z = 0。"
    context: "6.5940 第 5 講用 Z = round(q_min − r_min / S) 算出它。"
  - term: "BF16"
    aliases: ["Brain Float 16", "bfloat16"]
    definition: "Google Brain 提出的 16-bit 浮點格式：8-bit exponent、7-bit fraction，範圍跟 FP32 一樣大，精度比 FP16 低。"
    context: "6.5940 第 5 講把它和 FP32、FP16 並排，說明 exponent 位元決定範圍、fraction 位元決定精度。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-quantization-basics-en)

> **版本說明**：本文以 [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)為主幹（最近一屆完整學期，理由見[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)）。主要材料是 [Lecture 5 投影片 Lec05-Quantization-I.pdf](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&st=zr1y81q7&dl=0)（70 頁，下文頁碼皆指 PDF 頁），[錄影](https://www.youtube.com/watch?v=ymAzUz3qlIA)一併列出但本文的主張都以投影片為準。事實於 2026-09-30 打開官方材料核對。存取等級：Fall 2024 **A3**；Fall 2026 **A2**（進行中）。

**系列位置**：上一篇 [Lab 1：Fine-grained 與 Channel Pruning 的九道題](/posts/ai/2026-09-30-mit-65940-lab1-pruning)｜下一篇 [第 6 講：PTQ、QAT、二值化與混合精度](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

剪枝是減少權重的「數量」，量化是減少每個權重的「位元數」。第 5 講是量化單元的上半，投影片第 2 頁的 Lecture Plan 列了三件事：複習數字格式、學量化的基本概念、學三種常見量化——K-means、線性、二值／三值。

實際上第 5 講只講完前兩種。第 69 頁的總結只列 K-means 與線性量化，第 68 頁的比較表在二值／三值那一欄打了問號；[第 6 講](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)的 Lecture Plan 才把二值與三值量化列為正式項目。本篇照投影片實際內容走，二值／三值留到下一篇。

## 為什麼位元數這麼重要

第 3 頁引用 [Horowitz 在 ISSCC 2014 的演講論文](https://doi.org/10.1109/ISSCC.2014.6757323)，列出 45nm 製程下各種運算的能量。最醒目的一組對比：8-bit 整數加法 0.03 pJ，32-bit 浮點加法 0.9 pJ，差 30 倍。乘法也是同樣方向，8-bit 整數乘法 0.2 pJ、32-bit 浮點乘法 3.7 pJ。

結論寫在標題上：位元數越少，能量越少。第 4 頁接著問：那我們該怎麼讓深度學習更有效率？這就是整個量化單元的動機。

## 數字在電腦裡長什麼樣

### 整數與定點數

第 6 頁把 n-bit 整數分成三種：

| 表示法 | 範圍 | 特點 |
|---|---|---|
| 無號整數 | $[0, 2^n - 1]$ | |
| 符號－大小 | $[-2^{n-1}+1, 2^{n-1}-1]$ | 000…0 和 100…0 都代表 0 |
| 二補數 | $[-2^{n-1}, 2^{n-1}-1]$ | 只有一個 0，100…0 代表 $-2^{n-1}$ |

第 7 頁的定點數把小數點固定在某個位置。投影片的例子是 8-bit 的 `00110001`，當作 4 位整數＋4 位小數讀是 3.0625，也可以看成整數 49 乘上 $2^{-4}$。後面這種讀法很重要：它就是線性量化的雛形。

### 浮點數：exponent 管範圍，fraction 管精度

第 8 頁以 IEEE 754 FP32 為例：1 個 sign bit、8 個 exponent bit、23 個 fraction bit，值是 $(-1)^{\text{sign}} \times (1 + \text{Fraction}) \times 2^{\text{Exponent} - 127}$。投影片示範 0.265625 = $1.0625 \times 2^{-2}$ 怎麼編碼。

<details>
<summary>第 10–16 頁：subnormal、INF 與 NaN</summary>

exponent 為 0 時不套「1 + Fraction」，改成 $(-1)^{\text{sign}} \times \text{Fraction} \times 2^{1-127}$，這叫 subnormal number，用來表示 0 以及非常接近 0 的數。FP32 最小的正 subnormal 是 $2^{-149}$，最小的正 normal 是 $2^{-126}$。exponent 全為 1（255）時，fraction 為 0 表示 ±INF，否則是 NaN。

</details>

第 17 頁的標題就是整段的重點：**Exponent Width → Range；Fraction Width → Precision**。

| 格式 | Exponent | Fraction | 總位元 |
|---|---|---|---|
| IEEE FP32 | 8 | 23 | 32 |
| IEEE FP16 | 5 | 10 | 16 |
| Google BF16 | 8 | 7 | 16 |

BF16 跟 FP32 一樣有 8 個 exponent bit，所以範圍一樣大，代價是 fraction 只剩 7 bit。第 18–19 頁各有一道練習：FP16 的 `1100011100000000` 是多少（答案 −7.0），以及 2.5 用 BF16 怎麼寫（答案 `0100000000100000`）。建議先蓋住答案自己算。

### FP8 與 4-bit 格式

第 20 頁加入 NVIDIA 的兩種 FP8：

- **E4M3**：4 bit exponent、3 bit mantissa，沒有 INF，最大 normal 值 448。
- **E5M2**：5 bit exponent、2 bit mantissa，有 INF 與 NaN，最大 normal 值 57344；投影片註明它用在反向傳播的梯度。

同樣是 8 bit，E5M2 範圍大、E4M3 精度高，這又是第 17 頁那句話的應用。

第 21 頁把 4 bit 也拆開比：INT4 表示 −8 到 7 的整數；FP4 有 E1M2、E2M1、E3M0 三種配法。以 E2M1 為例，正值只有 0、0.5、1、1.5、2、3、4、6 這八個，沒有 INF 也沒有 NaN。你會看到可表示的值不再等距，越靠近 0 越密。

## 什麼是量化

第 22 頁的定義：量化是把輸入從連續（或很大）的集合限制到一個離散集合的過程；原值跟量化值的差叫量化誤差。投影片放了一張 16 色圖片當例子，這種做法也叫 palettization。

第 24 頁用一張表預告三種方法的差別，重點在「存什麼」與「用什麼算」：

| | K-means 量化 | 線性量化 | 二值／三值量化 |
|---|---|---|---|
| 儲存 | 整數索引＋浮點 codebook | 整數權重 | （第 6 講） |
| 計算 | 浮點運算 | 整數運算 | （第 6 講） |

## K-means 量化：把相近的權重歸成一群

### 怎麼存

第 28 頁用一個 4×4 的 FP32 權重矩陣示範。對 16 個權重做 K-means 分成 4 群，每個權重只存 2-bit 的群索引，再另外存一份 4 個 centroid 的 codebook。

- 原本：32 bit × 16 = 64 B
- 之後：2 bit × 16（4 B）＋ 32 bit × 4（16 B）＝ 20 B，小 3.2 倍

權重數 $M$ 遠大於 $2^N$ 時，codebook 的成本可以忽略，壓縮倍數趨近 $32/N$。

### 量化之後還能 fine-tune

第 29–30 頁說明怎麼訓練量化後的權重：算出每個權重的梯度，按群索引分組、加總，再乘學習率去更新 centroid。第 34–36 頁的直方圖畫出權重從連續分布變成幾根離散的柱子，重新訓練後柱子的位置會移動。

### Deep Compression

第 31–33 頁比較 AlexNet on ImageNet 的準確率對壓縮率曲線：只剪枝、只量化、剪枝＋量化，其中剪枝＋量化在同樣準確率下壓得最小。

第 38–39 頁把整套流程收成 [Deep Compression（Han et al., ICLR 2016）](https://arxiv.org/abs/1510.00149)的三段管線：

1. 剪枝：權重數量變少，模型小 9–13 倍。
2. K-means 量化：每個權重位元變少，累計 27–31 倍。
3. Huffman 編碼：出現頻率高的值用較少位元，累計 35–49 倍。

第 40 頁的結果表中，AlexNet 從 240 MB 壓到 6.9 MB（35 倍），VGGNet 從 550 MB 壓到 11.3 MB（49 倍），準確率都沒掉。表下方留了一句問題：能不能一開始就設計小模型？第 42 頁接著引 [SqueezeNet](https://arxiv.org/abs/1602.07360)，把它再做 Deep Compression 後只剩 0.47 MB，相對 AlexNet 小 510 倍，準確率相當。

### K-means 量化的限制

第 43 頁把話講清楚：推論時要先用 codebook 查表把權重解碼回浮點，所以 **K-means 量化只省儲存成本，所有計算與記憶體存取仍然是浮點**。想連計算都省，就需要下一種方法。

## 線性量化：用一條直線對應整數與實數

### 基本式子

第 47–48 頁的定義：線性量化是整數到實數的仿射映射

$$
r = S(q - Z)
$$

$r$ 是浮點實數，$q$ 是量化後的整數，$S$ 是浮點的 scale，$Z$ 是整數的 zero point。$Z$ 的用途是讓實數 0 能被某個整數精確表示。投影片沿用同一個 4×4 矩陣，用 2-bit 有號整數、$Z = -1$、$S = 1.07$ 重建權重，並列出量化誤差矩陣。

### Scale 與 zero point 怎麼算

讓浮點範圍的兩端 $r_{\min}$、$r_{\max}$ 對到整數範圍的兩端 $q_{\min}$、$q_{\max}$（第 50、52 頁）：

$$
S = \frac{r_{\max} - r_{\min}}{q_{\max} - q_{\min}}, \qquad Z = \text{round}\left(q_{\min} - \frac{r_{\min}}{S}\right)
$$

### 矩陣乘法怎麼變成整數運算

<details>
<summary>第 54–57 頁：把 Y = WX 展開</summary>

把 $W$、$X$、$Y$ 都代成 $S(q - Z)$，整理得到

$$
q_Y = \frac{S_W S_X}{S_Y}\left(q_W q_X - Z_W q_X - Z_X q_W + Z_W Z_X\right) + Z_Y
$$

括號裡是 N-bit 整數乘法與 32-bit 整數加減，其中只跟權重有關的項可以預先算好。前面的 $\frac{S_W S_X}{S_Y}$ 投影片說經驗上永遠落在 (0, 1)，可以寫成 $2^{-n} M_0$（$M_0 \in [0.5, 1)$），用定點乘法加位移完成，不需要浮點。

</details>

第 57 頁留下一個問題：如果 $Z_W = 0$ 呢？這就引出對稱量化。

### 對稱量化

第 58 頁：令 $Z = 0$，浮點範圍取對稱的 $[-|r|_{\max}, |r|_{\max}]$。N-bit 有號整數的範圍是 $[-2^{N-1}, 2^{N-1}-1]$，例如 4-bit 是 −8 到 7。第 59 頁的 full range mode 取 $S = |r|_{\max} / 2^{N-1}$。

$Z_W = 0$ 之後，上面那條式子少掉兩項，權重這邊只剩 $q_W q_X - Z_X q_W$。

### 全連接層與卷積

第 62–64 頁把 bias 加進來。設定 $Z_W = 0$、$Z_b = 0$、$S_b = S_W S_X$，全連接層變成

$$
q_Y = \frac{S_W S_X}{S_Y}\left(q_W q_X + q_{\text{bias}}\right) + Z_Y, \qquad q_{\text{bias}} = q_b - Z_X q_W
$$

投影片註明 $q_b$ 與 $q_{\text{bias}}$ 都是 32 bit。第 66 頁的卷積版結構完全相同，只是把矩陣乘法換成 Conv，並畫成一張資料流圖：整數輸入與整數權重做卷積、加 int32 bias、乘 scale、加 zero point，輸出整數。

### 準確率代價

第 67 頁引用 [Jacob et al.（CVPR 2018）](https://arxiv.org/abs/1712.05877)的結果：ResNet-50 浮點 top-1 76.4%、8-bit 整數量化 74.9%；Inception-V3 從 78.4% 到 75.4%。同一頁還有 MobileNet 在 Snapdragon 835 上的延遲對準確率曲線。掉了兩三個百分點，這正是第 6 講要處理的問題。

## Fall 2026 對照

[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)的 Lecture 5（9 月 24 日）已放出[投影片](https://www.dropbox.com/scl/fi/1yvbg0dqcysee8hf61hjr/Lec05-Quantization-I.pdf?rlkey=kaxx0x1m67ruecnm07gtm6d78&st=xb9raxr5&dl=0)與[錄影](https://www.youtube.com/watch?v=Qg_3N8pdK9s)。比對兩份 PDF 的文字層：同樣 70 頁，差別是封面圖、課名，以及 subnormal 那幾頁把說明文字改成「Normal number／Subnormal number」標籤。內容架構相同。

Fall 2026 的 Lab 2 標為 Quantization，截至 2026-09-30 尚未放出；Fall 2024 的 [Lab 2](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP) 會要你實作本講的 K-means 與線性量化，本系列在第 6 講之後拆解。

## 讀完可以做的事

1. 把第 18–19 頁兩道格式換算題自己做一遍，再用同樣方法把 2.5 寫成 FP16，比較它和 BF16 的差別。
2. 拿任何一層真實權重，手算一次 $S$ 與 $Z$（非對稱與對稱各一次），量化再反量化，看誤差落在哪裡。
3. 今晚就能做的一件事：在 PyTorch 裡拿一個 `nn.Linear` 的權重，用 `torch.aminmax` 找出最小與最大值，照本篇公式自己算 $S$ 與 $Z$，再用 `torch.quantize_per_tensor(w, S, Z, torch.qint8)` 量化、`.dequantize()` 還原，看誤差分布。

## 延伸閱讀

- 從使用者角度看量化格式（GGUF、Q4/Q8）：[理解 AI 模型：量化](/posts/ai/2026-08-26-understanding-ai-models-quantization)
- LLM 系統課的量化講法：[CMU 11-868 導讀：模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)
- 同一套思路的上一站：[第 4 講：剪枝比例與系統支援](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support)

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 5（9 月 19 日）投影片與錄影連結
- [Lec05-Quantization-I.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&st=zr1y81q7&dl=0) — 本文所有頁碼出處
- [EfficientML.ai Lecture 5 錄影（Fall 2024）](https://www.youtube.com/watch?v=ymAzUz3qlIA)
- [Lec06-Quantization-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&st=f1oof15v&dl=0) — Lecture Plan 第 4 項為二值／三值量化
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 5 投影片與[錄影](https://www.youtube.com/watch?v=Qg_3N8pdK9s)
- [Horowitz, Computing's Energy Problem (and What We Can Do About It)（ISSCC 2014）](https://doi.org/10.1109/ISSCC.2014.6757323) — 能量表出處
- [Han, Mao & Dally, Deep Compression（ICLR 2016）](https://arxiv.org/abs/1510.00149)
- [Iandola et al., SqueezeNet（arXiv 2016）](https://arxiv.org/abs/1602.07360)
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference（CVPR 2018）](https://arxiv.org/abs/1712.05877)
