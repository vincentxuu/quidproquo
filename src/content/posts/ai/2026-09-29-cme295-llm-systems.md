---
title: "LLM 系統：模型怎麼塞進 GPU，又怎麼跑得快｜Stanford CME295 2026 版 第 5 堂"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cme295, llm-inference, kv-cache, distributed-training, gpu, stanford]
lang: zh-TW
math: true
series:
  name: "Stanford CME295 導讀"
  order: 10
tldr: "2026 版 CME295 第 5 講用兩個問題串起整堂：模型怎麼塞得下，怎麼跑得快。前半講單張 GPU 上的 FlashAttention（把 softmax 拆成可以逐塊累積的分子與分母，不必把 n×n 注意力矩陣寫回慢的記憶體）和多張 GPU 的五種平行；後半講推論：TTFT 與 TPOT、roofline、KV cache 的三個問題分別交給 PagedAttention、GQA、MLA，最後在黑板上證明 speculative decoding 的輸出分布跟只用大模型完全一樣。"
description: "Stanford CME295 2026 Lecture 5「LLM systems」導讀，依錄影與 156 頁投影片：GPU 的 HBM 與 SRAM、FlashAttention 的逐塊 softmax 與反向重算、資料平行與 ZeRO、張量／管線／context／expert 平行、TTFT 與 TPOT、arithmetic intensity 與 roofline、KV cache 與 PagedAttention、GQA、MLA、speculative decoding 的接受規則與證明、知識蒸餾與 multi-token prediction。"
draft: false
glossary:
  - term: "prefill / decode"
    aliases: ["prefill", "decode", "預填", "解碼階段"]
    definition: "LLM 推論的兩個階段。prefill 一次處理整段 prompt，可以平行算；decode 之後每一步只產生一個 token，必須一步接一步。"
    context: "課堂用這兩個階段解釋 TTFT 與 TPOT 為什麼要分開看。"
  - term: "TTFT / TPOT"
    aliases: ["time to first token", "time per output token", "首字延遲"]
    definition: "TTFT 是從送出請求到第一個輸出 token 的時間，包含排隊與 prefill；TPOT 是之後每產生一個 token 平均要多久。"
    context: "課堂說推論服務最常盯的就是這兩個數字。"
  - term: "arithmetic intensity"
    aliases: ["算術強度", "運算強度"]
    definition: "每從記憶體搬 1 byte 資料，平均做幾次浮點運算。數字低代表瓶頸在搬資料，數字高代表瓶頸在算。"
    context: "課堂用它畫 roofline，判斷 decode 為什麼卡在記憶體頻寬。"
  - term: "HBM"
    aliases: ["High Bandwidth Memory", "高頻寬記憶體"]
    definition: "GPU 上的主記憶體，容量是百 GB 等級，但比晶片內的 SRAM 慢一個數量級左右。模型權重與 KV cache 都放在這裡。"
    context: "FlashAttention 的目標就是減少對 HBM 的讀寫。"
  - term: "kernel fusion"
    aliases: ["融合 kernel", "operator fusion"]
    definition: "把原本要分好幾次在 GPU 上執行、每次都把中間結果寫回 HBM 的運算，合併成一次執行，中間結果留在晶片內。"
    context: "課堂在 FlashAttention 一段提到：分子分母能逐塊累積，就能把 attention 的幾個步驟融在一起。"
---

> :globe: [English version](/posts/ai/2026-09-29-cme295-llm-systems-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

本篇對應 Stanford [CME295](/posts/ai/2026-09-29-cme295-course-overview) 2026 版第 5 講「LLM systems」（2026 年 10 月 30 日），底本是課堂錄影的英文字幕與 [156 頁投影片](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf)。前半由 Afshine Amidi 講 FlashAttention 與分散式訓練，後半由 Shervine Amidi 講推論最佳化。這一講在 2025 版不存在，內容原本散在 2025 版第 3 講與第 4 講，本系列的[第 3 講導讀](/posts/ai/2026-09-29-cme295-large-language-models)和[第 4 講導讀](/posts/ai/2026-09-29-cme295-llm-training)畫過這些主題的地圖。

先備：知道 self-attention 的 Q、K、V 與 softmax（[第 1 講導讀](/posts/ai/2026-09-29-cme295-transformer)），以及訓練一步要算 loss、梯度、用 Adam 更新權重（[第 4 講導讀](/posts/ai/2026-09-29-cme295-llm-training)）。

全片 1 小時 47 分，本文涵蓋全部；每一節開頭有對應錄影的時間連結，某一段看不懂時可以直接跳過去聽講者的推導。

```youtube
url: https://www.youtube.com/watch?v=25KIyaeI_Fg
title: Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 5 - LLM Systems
```

## 這一講怎麼排：兩個問題、三段內容

[錄影 00:00–09:13](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=0s)

講者一開場就把整堂收斂成兩個問題，之後每一段都回來對答案：

1. **怎麼塞得下？**（How do we make it fit?）
2. **怎麼跑得快？**（How do we make it fast?）

[2026 課表](https://cme295.stanford.edu/syllabus/)列了 7 個主題：分散式訓練、推論最佳化、KV caching、speculative decoding、高效 kernel、FlashAttention、硬體取捨。實際上課的順序和分段不太一樣，是從單張 GPU 往外擴：

| 段落 | 錄影 | 塞得下靠什麼 | 跑得快靠什麼 |
|---|---|---|---|
| FlashAttention（單張 GPU） | 09:13–50:48 | 不把 n×n 注意力矩陣存出來 | 減少 HBM 讀寫 |
| 分散式訓練（多張 GPU） | 50:48–1:09:54 | 把參數、activations、梯度、優化器狀態分到多張卡 | 資料平行、模型平行 |
| 推論最佳化 | 1:09:54–1:45:54 | PagedAttention 管好記憶體；GQA、MLA 讓向量更少、更短 | speculative decoding、MTP 一次產生好幾個 token |

課表上的「高效 kernel」和「硬體取捨」沒有各自成段。前者出現在 FlashAttention 裡「把幾個運算融成一個」的說法；後者散在 GPU 規格、roofline 與平行化的代價裡。量化與混合精度這一講沒有講。

### 起點：一張 GPU 塞不下一個 LLM

講者先釐清兩個常被搞混的詞：**FLOPs**（小寫 s）是浮點運算的次數，用來算運算預算；**FLOPS**（或 FLOP/s）是每秒能做幾次浮點運算，用來衡量硬體多快。之前幾講只用過前者，這一講兩個都會用到。

接著拿 NVIDIA H200 的規格表來看。GPU 擅長矩陣乘法，因為結果矩陣的每一格都是一個獨立的內積，可以分給大量核心同時算；而 decoder 的兩層（masked self-attention 與前饋網路）本質上就是一堆矩陣乘法。規格表上有三類數字：運算速度（TFLOPS）、記憶體容量、資料傳輸速度（TB/s 等級）。問題出在容量：H200 的記憶體是 141 GB。

講者的餐巾紙算術：1,000 億參數的模型，每個參數用 FP16 存 2 bytes，光權重就是 200 GB，已經超過 141 GB。訓練時還要存 activations、梯度和優化器狀態，差距更大。另一個限制是成本：訓練要吃上兆個 token，推論要服務大量請求，兩邊都很貴。這就是開頭那兩個問題的由來。

**自我檢查**：一個 700 億參數的模型用 BF16 存權重，單張 H200 放得下嗎？訓練時呢？

<details>
<summary>答案</summary>

權重是 70e9 × 2 bytes = 140 GB，剛好壓在 141 GB 的邊緣，實際上還要留空間給 activations、KV cache 和執行時的暫存，一張放不下來跑。訓練還要再加梯度與 Adam 的兩份狀態，更不可能。判準：要算出權重大小，並指出訓練需要的不只權重。

</details>

## FlashAttention：不把 n×n 矩陣寫回慢的記憶體

[錄影 09:13–50:48](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=553s)

### GPU 裡有快慢兩種記憶體

self-attention 要算 $QK^\top$，序列長度 n 個 token 就是 n×n 個分數。講者舉的例子：只有 1,000 個 token，就已經是 100 萬個數字要算、要存。

GPU 上有兩種記憶體跟這件事有關：

- **HBM**（high bandwidth memory）：規格表上那個 141 GB 指的就是它。容量大，傳輸速度約 1 TB/s 等級；放在運算單元的晶片外。
- **SRAM**：在晶片上，傳輸速度約快一個數量級（數十 TB/s），但容量只有約 100 MB 等級，放不下大矩陣。

投影片把它畫成「小而快」與「大而慢」兩塊。FlashAttention 的出發點只有一句：**減少資料進出 HBM 的次數**。

### 標準做法要來回三趟

softmax 的定義是 $\text{softmax}(x)_i = e^{x_i} / \sum_j e^{x_j}$，分母要把整列加完才知道。所以標準的 attention 得這樣算（投影片第 19–29 頁一步一步畫）：

1. 從 HBM 讀 Q、K，算出分數矩陣 S，**把 S 寫回 HBM**
2. 讀回 S，算 softmax 得到 P，**把 P 寫回 HBM**
3. 讀 P 和 V，算出輸出 O，寫回 HBM

S 和 P 都是 n×n。問題的根源是 softmax「要看完整列」這個依賴。所以講者問：有沒有辦法不必先處理完整列？

### 把 softmax 拆成可以逐塊累積的分子與分母

這是全堂花最多時間的一段（約 30 分鐘），講者在黑板上推。只看 Q 的某一列，它跟每個 key 的分數排成列向量 $s = (s_1, \dots, s_n)$，values 是 $v_1, \dots, v_n$。要算的是：

$$
\text{softmax}(s)\,v = \sum_{i=1}^{n} \frac{e^{s_i}}{\sum_{j=1}^{n} e^{s_j}}\, v_i = \frac{\sum_{i} e^{s_i} v_i}{\sum_{j} e^{s_j}}
$$

把加總移到分子以後，整個式子就是「某個和」除以「另一個和」，而兩個和都可以一項一項加：

$$
N_{t+1} = N_t + e^{s_{t+1}} v_{t+1}, \qquad D_{t+1} = D_t + e^{s_{t+1}}
$$

最後算 $N_n / D_n$ 就是答案。不需要先把整列加完、再回頭除。

**數值穩定**。$e^{s_i}$ 可能大到溢位。講者的觀察是：分子分母同乘一個常數，比值不變，所以挑一個好的常數就行，挑的是「目前看過的最大分數」$m$。這帶出投影片第 46–47 頁的兩個量：

$$
m_{t+1} = \max(m_t, s_{t+1}), \qquad \alpha_t = e^{m_t - m_{t+1}}
$$

$$
N_{t+1} = \alpha_t N_t + e^{s_{t+1} - m_{t+1}} v_{t+1}, \qquad D_{t+1} = \alpha_t D_t + e^{s_{t+1} - m_{t+1}}
$$

$m_{t+1}$ 是新的縮放基準；$\alpha_t$ 負責把之前累積的和換算到新基準上。講者解釋 $\alpha_t$ 的來歷：原本用的常數是 $c_1 = e^{-m_t}$，新常數是 $c_2 = e^{-m_{t+1}}$，舊的和要乘上 $c_2 / c_1 = e^{m_t - m_{t+1}}$，兩個常數才一致。

有學生問：$e^{m_t - m_{t+1}}$ 很小、小到變成 0 怎麼辦？講者的回答是，小到表示不出來的數本來對總和就沒有貢獻，當成 0 沒關係；真正危險的是大到表示不出來的數，因為它對總和有貢獻。這也是為什麼常數要用最大值而不是隨便挑。

<details>
<summary>本文的例子：三個分數逐塊算一遍</summary>

取 $s = (1, 3, 2)$，values 用純量 $v = (10, 20, 30)$。

直接算：分母 $e^1 + e^3 + e^2 \approx 30.19$，加權和約 650.5，結果約 **21.547**。

逐塊算：

| 步 | 看到 | $m$ | $\alpha$ | $N$ | $D$ |
|---|---|---|---|---|---|
| 1 | $s_1 = 1$ | 1 | — | $e^0 \cdot 10 = 10$ | 1 |
| 2 | $s_2 = 3$ | 3 | $e^{1-3} \approx 0.135$ | $0.135 \cdot 10 + 20 \approx 21.35$ | $0.135 + 1 \approx 1.135$ |
| 3 | $s_3 = 2$ | 3 | $e^0 = 1$ | $21.35 + e^{-1} \cdot 30 \approx 32.39$ | $1.135 + e^{-1} \approx 1.503$ |

$32.39 / 1.503 \approx$ **21.547**，跟直接算一樣。過程中沒有任何一個指數超過 $e^0 = 1$。

</details>

**放回 attention 上**。每次只把 Q 的一小塊和 K、V 的一小塊搬進 SRAM，在 SRAM 裡更新 $m$、$N$、$D$，處理完所有 key 的塊，再把這一塊輸出 O 寫回 HBM。S 和 P 從頭到尾不進 HBM，投影片第 57 頁的結論是「far fewer reads and writes to HBM」。講者特別說，網路上很多地方直接丟出這組公式，但它背後只有兩個想法：分子分母可以逐步算；為了避免指數太大要重新縮放。因為能逐塊累積，原本分開的幾個步驟可以**融成一個運算**，這就是課表上「高效 kernel」的核心。

### 訓練時寧可重算

[錄影 42:21](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=2541s)

第二個想法用在訓練的反向傳播。算梯度需要 attention 矩陣，一般做法是前向時存在 HBM、反向時讀回來。FlashAttention 不存，反向時用同樣的逐塊技巧在 SRAM 裡重算一次。投影片第 58 頁的說法是「Sometimes, it is better to recompute instead of storing」。

投影片第 60 頁沿用論文的數據：

| | 標準 attention | FlashAttention |
|---|---|---|
| GFLOPs | 66.6 | 75.2 |
| HBM 讀寫（GB） | 40.3 | 4.4 |
| 執行時間（ms） | 41.7 | 7.3 |

運算量變多，時間卻少了很多，因為省下的是最貴的 HBM 讀寫。講者提醒這些數字只看數量級。

課後問答補了三點：

- **它是精確的，不是近似**。最後的 $N/D$ 跟原本的公式一模一樣，只是換了搬資料的順序。
- **重算只跟訓練有關**。推論時沒有反向傳播，但前向的逐塊技巧照樣能用。
- **FlashAttention 2、3、4** 是針對新一代 GPU 的進一步最佳化：3 對應 Hopper（H100、H200），4 對應 Blackwell（B100、B200）。講者說這些論文比較技術，要記住的是逐塊融合與重算這兩個想法。

**自我檢查**：FlashAttention 多做了運算，為什麼還比較快？如果某個 GPU 的 HBM 跟 SRAM 一樣快，FlashAttention 還有優勢嗎？

<details>
<summary>答案</summary>

它用多一點計算換掉大量 HBM 讀寫，而 HBM 讀寫比計算慢得多，所以總時間下降。若 HBM 跟 SRAM 一樣快，搬資料就不再是瓶頸，速度上的好處大部分會消失；但不必存出 n×n 矩陣這個省記憶體的好處仍在。判準：要點出「省的是搬資料，不是運算」。

</details>

## 分散式訓練：五種平行

[錄影 50:48–1:09:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3048s)

### 訓練時記憶體裝了什麼

講者把訓練一步拆開，逐項列出要存的東西：

| 項目 | 什麼時候需要 | 大小跟什麼有關 |
|---|---|---|
| 參數 | 一開始就要 | 模型大小（數十億到數兆） |
| activations | 前向算 loss、反向算梯度 | 模型大小、batch size、context 長度 |
| 梯度 | 反向傳播 | 跟參數一樣多 |
| 優化器狀態 | 更新權重（Adam 要存兩份動量） | 參數的倍數 |

activations 跟 context 長度有關，是因為每個 token 都要跟其他 token 互動，每個 token 都有自己的中間結果。141 GB 遠遠不夠，所以要用多張 GPU。

[ZeRO 論文](https://arxiv.org/abs/1910.02054)給過具體的數字：用混合精度加 Adam 訓練，每個參數要 16 bytes（FP16 參數 2、梯度 2，FP32 參數副本加兩份動量共 12）。

### 資料平行與 ZeRO

[錄影 54:34](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3274s)

**資料平行**（DP）把一個 batch 切給多張卡，每張卡各自算前向與反向，再同步梯度。最天真的做法是每張卡都放一份完整的參數、梯度和優化器狀態，大量重複。

**ZeRO**（Zero Redundancy Optimizer）的想法是不要存重複的東西，改成切開分給各張卡：

- ZeRO-1：切優化器狀態
- ZeRO-2：再切梯度
- ZeRO-3：連參數也切

代價是通訊：某張卡做前向時需要不在自己身上的參數，就得向其他卡要。有學生問這樣載參數不是很花時間嗎？講者的回答是會，但選項是「慢慢訓練」跟「根本訓練不了」。

另一個學生問：參數都切開了，這不就是模型平行嗎？講者的區分是：ZeRO 底下，一個子 batch 的**所有計算**都在同一張卡上做，缺的參數靠通訊拿來；梯度與優化器狀態跟著參數走，每張卡只存自己那份參數對應的部分。模型平行則是把**計算本身**分到不同卡上。

<details>
<summary>算式：ZeRO 每張卡要存多少（出自 ZeRO 論文）</summary>

記號：Ψ 是參數量，N_d 是資料平行的卡數。

```
一般資料平行：      2Ψ + 2Ψ + 12Ψ        = 16Ψ bytes
ZeRO-1（切優化器）：2Ψ + 2Ψ + 12Ψ / N_d
ZeRO-2（再切梯度）：2Ψ + 14Ψ / N_d
ZeRO-3（再切參數）：16Ψ / N_d
```

代入論文的例子（Ψ = 75 億、N_d = 64）：一般資料平行每張卡 120 GB，ZeRO-3 降到約 1.9 GB。這組公式不在投影片上，是從論文補的。

</details>

### 模型平行的四種切法

[錄影 58:01](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3481s)

| 種類 | 沿哪個方向切 | 課堂的說法 | 代價 |
|---|---|---|---|
| 張量平行（TP） | 一層裡的矩陣 | 多頭 attention 的每個 head 可以獨立算，分給不同卡；前饋網路照 [Megatron-LM](https://arxiv.org/abs/1909.08053) 的圖，第一個矩陣按欄切、第二個按列切 | 每一層都要交換結果 |
| 管線平行（PP） | 不同層 | 第 0 段在第一張卡、第 1 段在第二張卡，往下傳；反向時再傳回來（[GPipe](https://arxiv.org/abs/1811.06965)） | 卡在等上下游時閒著，叫 **bubble** |
| context 平行（CP） | 序列長度 | 每張卡負責一組 query，K、V 在卡之間輪流傳（投影片引 [Ring Attention](https://arxiv.org/abs/2310.01889)） | K、V 要一直傳 |
| expert 平行（EP） | MoE 的 expert | 不同 expert 放在不同卡，token 到了前饋網路那層再送去它被分配的 expert 所在的卡（投影片引 [GShard](https://arxiv.org/abs/2006.16668)） | token 要送過去再送回來 |

context 平行講者用兩個 token、兩張卡舉例：卡 1 算 $q_1, k_1, v_1$，卡 2 算 $q_2, k_2, v_2$；各自算完自己的 query 跟手上那組 key、value 的部分，再把 K、V 交給對方，再算一輪。token 一多，就是分組後一直把 K、V 傳給鄰居。

加上資料平行，總共五種，業界有人叫它「5D parallelism」。它們可以混著用，資料平行配張量平行完全沒問題。

### 為什麼不永遠切到最多

[錄影 1:08:38](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4118s)

投影片第 86 頁列了三個理由：GPU 使用率會變低、GPU 很貴（按小時租）、通訊有成本（例如 ZeRO-3 每次都要傳參數）。

這些做法怎麼用 all-reduce、all-gather 這類通訊原語組出來，[CS336 第 7 講](/posts/ai/2026-08-22-cs336-parallelism-mechanics)有完整推導；怎麼依機房的網路拓撲組合，看 [CS336 第 8 講](/posts/ai/2026-08-22-cs336-parallelism-strategies)。

**自我檢查**：ZeRO-3 跟張量平行都讓每張卡只存一部分參數，兩者的計算分工差在哪？

<details>
<summary>答案</summary>

ZeRO-3 是資料平行的變體：每張卡處理不同的資料，但都跑完整個模型的計算，缺的參數臨時從別張卡拿來。張量平行是同一筆資料的同一層計算被拆開，各張卡算矩陣的一部分再合併。判準：要講出「切資料、借參數」與「切計算」的差別。

</details>

## 推論的時間帳：TTFT 與 TPOT

[錄影 1:09:54–1:16:44](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4194s)

Shervine 用一題開場：輸入 10 個 token、要求輸出 1 萬個 token（「幫我的泰迪熊寫一個睡前故事」），跟輸入 1 萬個 token、只輸出 10 個（「描述這隻泰迪熊」），哪個快？答案是第二個。輸入的 token 可以一次全部丟進模型平行算（跟訓練時的 teacher forcing 一樣），輸出卻只能一個一個產生。

投影片第 92 頁把這個直覺寫成一條式子，O 是輸出 token 數：

$$
T_{\text{request}} = T_{\text{queue}} + T_{\text{prefill}} + (O - 1)\, T_{\text{per output token}}
$$

- $T_{\text{queue}}$：服務商不只你一個使用者，你的請求要排隊。這受 batching 策略影響，課堂沒有展開；常見做法是 [Orca](https://www.usenix.org/conference/osdi22/presentation/yu) 提出的以「每一步」為單位排程，也就是 continuous batching。
- $T_{\text{prefill}}$：把整段 prompt 跑一遍、算出所有 K、V。相對於 token 數是快的。
- 後面那一項是 decode，一個一個產生，慢。

由此定義三個指標：**TTFT**（time to first token）＝排隊＋prefill；**TPOT**（time per output token）；**TTLT**（time to last token）＝整個請求。講者說做基礎設施的人最盯前兩個：TTFT 反映排隊與 prefill 策略好不好，TPOT 決定使用者看到字流出來順不順。TTLT 比較少拿來評系統，因為它跟模型行為綁在一起：模型推理想得久，或使用者都在要長篇故事，TTLT 自然變長，不代表系統差。

有學生問：每個 token 的時間明明可能比 prefill 短，為什麼標「慢」？講者說快慢是以「每個 token」來比的；而且多輪對話時，之前的內容與 system prompt 常有快取，prefill 的實際時間還會更短。

**價格反映同一件事**。投影片第 94–95 頁截了 OpenAI、Google、Anthropic 的 API 價格頁，講者的觀察是輸出單價大約是輸入的 5 倍，並說沒有任何規則規定一定要 5 倍。

系統的目標是快、品質好、便宜。這一講處理其中的快與便宜，講者建議寫成具體的上限：例如要求 TTFT 不超過 $\tau_1$、TPOT 不超過 $\tau_2$，成本也設一個上限。

**自我檢查**：排隊 0.2 秒、prefill 0.3 秒、TPOT 20 毫秒，輸出 500 個 token。TTFT 與 TTLT 各是多少？如果把 prompt 加長一倍，主要影響哪一個？

<details>
<summary>答案</summary>

TTFT = 0.2 + 0.3 = 0.5 秒。TTLT = 0.5 + 499 × 0.02 = 10.48 秒。prompt 加長主要拉長 prefill，也就是 TTFT；TPOT 也會因為每一步要讀的 KV cache 變多而略增，但 500 個輸出 token 的大頭仍在 decode。判準：TTFT 只含排隊與 prefill，TTLT 要乘 (O − 1)。

</details>

## 算得快還是搬得快：arithmetic intensity 與 roofline

[錄影 1:16:44–1:22:51](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4604s)

這一段把「decode 為什麼慢」講成可以量的東西。三個定義：

- **運算吞吐量**（computational throughput）：每秒能做多少計算，就是規格表上的 TFLOPS。跟資料型別有關，數字用越少位元表示，每秒能算越多。
- **記憶體頻寬**（memory bandwidth）：每秒能從 HBM 搬多少資料到 SRAM 給運算單元。
- **算術強度**（arithmetic intensity）：做的計算量除以搬的資料量，單位是 FLOPs/byte。前兩個是硬體給的，這一個看你的工作負載。

投影片第 100 頁標了數量級：SRAM 約 100 MB、HBM 約 100 GB、頻寬約 1 TB/s、運算單元約 1,000 TFLOPS。講者特別說 TFLOPS 很看資料型別，別不帶條件地引用。有學生問：頻寬既然是瓶頸，為什麼不乾脆把它做快？講者的回答是這些元件做到晶片上很佔面積，設計 GPU 本來就是在取捨；理想上 SRAM、運算單元都越多越好，實際上做不到。

**roofline**。把算術強度當橫軸、實際達到的運算速度當縱軸，畫出來是一條先斜後平的線，看起來像屋頂，所以叫 roofline model。轉折點叫 **ridge point**：

$$
I^* = \frac{P_{\max}}{B_{\text{HBM}}}
$$

$P_{\max}$ 是峰值算力，$B_{\text{HBM}}$ 是 HBM 頻寬。算術強度低於 $I^*$ 時落在斜坡上，是 **memory bound**，算力閒著等資料；高於 $I^*$ 時落在平台上，是 **compute bound**。

講者把推論放上這張圖：decode 每一步要把整份權重讀一遍，卻只預測一個 token，落在 memory bound 區；prefill 有大量可以平行的計算，做得好（例如用了 FlashAttention）應該落在 compute bound 區。投影片上的線不從原點出發，講者說那是因為這類圖通常畫成對數座標，線性尺度下應該經過原點。

<details>
<summary>本文的例子：H100 的 ridge point，和 decode 的算術強度</summary>

依 [NVIDIA H100 規格頁](https://www.nvidia.com/en-us/data-center/h100/)，H100 SXM 的 BF16 稠密算力約 989 TFLOPS（頁面標的 1,979 是含 sparsity 的數字），記憶體頻寬 3.35 TB/s。

```
ridge point ≈ 989e12 FLOP/s ÷ 3.35e12 byte/s ≈ 295 FLOP/byte

decode 一個 token（batch = 1，BF16 權重）：
  每個參數讀 2 byte，做 1 次乘法 + 1 次加法 = 2 FLOP
  算術強度 ≈ 2 FLOP / 2 byte = 1 FLOP/byte

batch = B 時，同一份權重讀一次給 B 個請求共用：
  算術強度 ≈ B FLOP/byte
```

這是忽略 KV cache 讀取、只看權重的粗估。1 遠低於 295，所以單一使用者 decode 時 GPU 多數時間在等資料；把很多請求湊成一個 batch，是讓 decode 往 compute bound 移動的最直接辦法。

</details>

**自我檢查**：同一個模型，在 GPU A（算力加倍、頻寬不變）和 GPU B（頻寬加倍、算力不變）上跑 batch = 1 的 decode，哪一個比較快？

<details>
<summary>答案</summary>

GPU B。batch = 1 的 decode 落在 memory bound 區，速度取決於頻寬；算力加倍只是讓 ridge point 往右移，decode 仍在斜坡上，幾乎沒變快。判準：先判斷工作負載在 ridge point 哪一側，再看哪個規格是瓶頸。

</details>

## KV cache 與它的三個問題

[錄影 1:22:51–1:32:51](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4971s)

產生新 token 時，它要跟前面所有 token 做 attention，需要它們的 key 和 value。舊 token 的 K、V 不會變，所以算過就存起來，之後直接讀。投影片用「a cute teddy bear」一個字一個字示範：「teddy」的 K、V 之後會被「bear」和更後面的 token 重複使用。

**價格上的痕跡**。投影片第 110 頁截了三家的快取價格，講者說命中快取的輸入大約是新輸入的十分之一。他特別分清兩種快取：decode 時每一步讀 KV cache 的成本，已經算在輸出價格裡；價格頁上的「cached input」指的是跨輪的快取，例如你接著上一輪繼續問，之前的對話狀態服務商已經算過，不是新輸入。

接下來講者用一張「KV cache 三個毛病」的清單貫穿整段，投影片第 136–137 頁做前後對照：

| 毛病 | 解法 | 怎麼做 |
|---|---|---|
| 向量放得零零散散（碎片） | PagedAttention | 用查表把 K、V 放進固定大小的區塊 |
| 向量太多 | GQA | 多個 query head 共用一組 K、V |
| 向量太長 | MLA | 只存壓縮過的低維表示 |

### 碎片：PagedAttention

[錄影 1:24:52](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5092s)

假設你是推論服務商，GPU 上有一塊記憶體可以給 KV cache 用，想知道能同時接多少請求。每家 API 都有「最多輸出 x 個 token」的上限，最天真的做法是每來一個請求，就照 prompt 加上最大輸出長度預留一整塊連續空間。問題是實際的回答常常短得多：多預留的那段沒人用，又因為夾在中間，新請求也塞不進去。規模一大，就是一堆「沒在用、也用不了」的記憶體。

[PagedAttention](https://arxiv.org/abs/2309.06180) 的做法是維護一張查表：K、V 不必連續擺放，而是放進大小為 B 的區塊，查表記錄每個請求的 K、V 放在哪幾個區塊。浪費最多就是一個區塊沒填滿。

區塊大小是取捨（投影片第 118–119 頁）：B 太小，查表會很大、管理開銷高；B 太大，又回到原本的浪費。實務上常見的值是 **B = 16**。vLLM 論文量測，既有系統裡真正存 token 狀態的只佔預留空間的 20.4% 到 38.2%；vLLM 的實作細節在站上的 [vLLM 深入介紹](/posts/ai/2026-03-14-vllm-inference-engine)。

### 向量太多：GQA

[錄影 1:28:06](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5286s)

多頭 attention（MHA）有 h 個 head，每個 token 要存 h 組 key 和 h 組 value。**GQA**（grouped-query attention）讓 key、value 只有 G 組，G < h，每組讓好幾個 query head 共用。兩個極端：G = h 就是 MHA；G = 1 就是 **MQA**（multi-query attention），每個 token 只有一組 K、V。講者說 G = 1 通常不是你要的，因為 K、V 的表達力太弱，模型建不出夠好的特徵。

省下的比例是 $1 - G/h$。投影片第 125 頁的數量級：h = 24、G = 2，省下超過 90%（$1 - 2/24 \approx 91.7\%$），並引了一個實際採用 G = 2 的 Qwen 模型卡。

有學生問：這樣不會讓模型變弱嗎？講者說會，這是取捨。預訓練團隊會做 grid search 與消融實驗來挑 G；實務上 G 太接近 h 時，表現只多一點點，所以不會取 G = h。這部分的架構面在[第 2 講導讀](/posts/ai/2026-09-29-cme295-transformer-tricks)講過。

### 向量太長：MLA

[錄影 1:31:00](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5460s)

GQA 之後每個 token 還有 2G 個向量。講者說接下來這個方法不一定要跟 GQA 一起用，可以二選一：**MLA**（multi-head latent attention，出自 [DeepSeek-V2](https://arxiv.org/abs/2405.04434)）。

做法類似 LoRA 的低秩分解：先用一個矩陣把輸入投影成一個小的表示，再訓練一組「解碼」矩陣，需要時從它還原出各個 head 的 K、V。存進 KV cache 的只有那個小表示，還原出來的 K、V 不存。關鍵是第一個投影矩陣在所有 head、以及 K 和 V 之間**共用**，所以每個 token 只要存一個短向量。DeepSeek-V2 論文報告，跟自家 DeepSeek 67B 比，KV cache 少了 93.3%，最大生成吞吐量提升到 5.76 倍。

<details>
<summary>本文的例子：KV cache 有多大</summary>

```
KV cache bytes = 2 × 層數 × KV head 數 × 每個 head 的維度
                 × 序列長度 × batch × 每個數值的 bytes
（開頭的 2 = K 和 V 各一份）
```

代入 [Llama 3 論文](https://arxiv.org/abs/2407.21783)的 8B 設定（32 層、32 個 query head、8 個 KV head、每個 head 128 維），BF16：

```
每個 token：2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KiB
8,192 個 token：128 KiB × 8,192 = 1 GiB（單一請求）
```

如果不用 GQA、KV head 也是 32 個，同樣長度要 4 GiB。

</details>

**自我檢查**：一個模型 h = 32，從 MHA 改成 G = 8 的 GQA，KV cache 變成原本的幾分之幾？它解決的是三個毛病裡的哪一個，跟 PagedAttention 能不能一起用？

<details>
<summary>答案</summary>

變成 8/32 = 1/4，省下 75%。它解決「向量太多」；PagedAttention 解決「碎片」，兩者處理的是不同問題，可以一起用（KV 向量變少，再用區塊管理）。判準：比例算對，並指出兩個方法管的是不同毛病。

</details>

## Speculative decoding：讓大模型一次驗證好幾個字

[錄影 1:32:51–1:45:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5571s)

前面處理的是 attention 層，這一段看最後產生 token 的地方。講者的出發點：產生 token 很慢，因為要一個一個來；但**驗證** token 很便宜，因為可以像 prefill 或訓練時那樣，把它們一次全部丟進模型平行算。

做法（投影片第 139–145 頁，引 [Chen 等人](https://arxiv.org/abs/2302.01318)）：

1. 小的 **draft 模型**接著「[BOS] my teddy bear」快速猜出後面 k 個 token，例如「is cute and smart」
2. 把 prompt 加上這 k 個 token 一次丟進大的 **target 模型**，得到每個位置的機率
3. 從左到右逐一決定接受或拒絕

記 target 給某個 token 的機率為 $T_i(x)$，draft 給的機率為 $D_i(x)$。投影片第 144 頁的規則：

- 若 $T_i(x) \geq D_i(x)$（target 比 draft 更有信心）：接受
- 否則，以機率 $T_i(x) / D_i(x)$ 接受，以機率 $1 - T_i(x)/D_i(x)$ 拒絕
- 一旦拒絕，就從殘差分布 $[T_i - D_i]_+$（正規化後）重新抽一個 token，結束這一輪

還有一個附帶好處：如果 k 個都被接受，target 模型那一次前向本來就算出了第 k+1 個位置的分布，可以直接再抽一個，等於**免費多一個 token**。

### 為什麼輸出分布不變：黑板上的證明

[錄影 1:36:14](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5774s)

講者問全班：相信這個規則抽出來的分布跟只用 target 一樣嗎？有人點頭、有人懷疑，於是在黑板上證。令 X 是最後輸出的 token，目標是證明 $P(X = x) = T(x)$。

用全機率公式分成「接受 draft 的猜測」與「拒絕後重抽」兩種情況：

$$
P(X = x) = P(\text{draft 猜 } x \text{ 且被接受}) + P(\text{拒絕}) \cdot P(X = x \mid \text{拒絕})
$$

第一項：draft 以機率 $D(x)$ 猜出 x，被接受的機率是 $\min(1, T(x)/D(x))$，相乘得 $\min(D(x), T(x))$。

第二項：拒絕的機率是 1 減掉所有 token 被接受的機率，

$$
P(\text{拒絕}) = 1 - \sum_{x'} \min(D(x'), T(x')) = \sum_{x'} \max(0,\, T(x') - D(x'))
$$

這一步用到 $1 = \sum_{x'} T(x')$，以及 $T - \min(D, T) = \max(0, T - D)$。拒絕後從殘差分布抽，

$$
P(X = x \mid \text{拒絕}) = \frac{\max(0,\, T(x) - D(x))}{\sum_{x'} \max(0,\, T(x') - D(x'))}
$$

兩者相乘，分母正好消掉，剩下 $\max(0, T(x) - D(x))$。合起來：

$$
P(X = x) = \min(D(x), T(x)) + \max(0,\, T(x) - D(x)) = T(x)
$$

最後一個等號分兩種情況驗證：$D(x) \geq T(x)$ 時是 $T(x) + 0$；$T(x) > D(x)$ 時是 $D(x) + T(x) - D(x)$。所以 speculative decoding 不是近似，輸出分布跟只用大模型抽樣完全相同。

<details>
<summary>每輪期望產生幾個 token（出自 Leviathan 等人）</summary>

[Leviathan 等人](https://arxiv.org/abs/2211.17192)假設每個猜測被接受的機率大致固定為 α，每輪猜 γ 個：

```
每輪期望產生的 token 數 = (1 − α^(γ+1)) / (1 − α)
```

α = 0.8、γ = 4 時約 3.4 個 token，而大模型只跑了一次。這條式子不在投影片上。

</details>

### 讓 draft 跟 target 對齊：蒸餾與 MTP

[錄影 1:44:53](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=6293s)

被拒絕的位置是要極力避免的：一拒絕就結束這一輪，draft 之後猜的全部白做。所以投影片第 146–147 頁列了兩個條件：draft 要明顯比 target 快；draft 的下一個 token 分布要跟 target 接近。

讓分布接近的辦法是**知識蒸餾**（[Hinton 等人](https://arxiv.org/abs/1503.02531)）：讓小模型學大模型輸出的整個機率分布，而不只是正確答案。投影片引了 [DistillSpec](https://arxiv.org/abs/2310.08461)，專門用蒸餾來改善 speculative decoding。

另一條路是 **multi-token prediction**（MTP，[Gloeckle 等人](https://arxiv.org/abs/2404.19737)）：同一個 LLM 訓練 k 個輸出頭（linear 加 softmax），一次預測後面 k 個 token；這 k 個頭當 draft，第一個頭當驗證者。draft 和 target 就是同一個模型，不必另外養一個小模型。

它不是永遠划算。[vLLM 的 speculative decoding 文件](https://docs.vllm.ai/en/latest/features/speculative_decoding/)寫明它適合「medium-to-low QPS, memory-bound workloads」：請求量大時 batch 已經很大、GPU 本來就在全力計算，多出來的猜測反而佔用算力。這跟上一節的 roofline 是同一件事。

**自我檢查**：詞彙只有 A、B 兩個 token，target 是 $T = (0.6, 0.4)$，draft 是 $D = (0.9, 0.1)$。被接受的總機率是多少？拒絕後的殘差分布是什麼？驗證最後 $P(X = A) = 0.6$。

<details>
<summary>答案</summary>

A：$D > T$，接受機率 0.6/0.9 = 2/3；B：$T > D$，一定接受。總接受機率 $= \min(0.9, 0.6) + \min(0.1, 0.4) = 0.6 + 0.1 = 0.7$。殘差 $[T - D]_+ = (0, 0.3)$，正規化後是 (0, 1)，拒絕後一定抽 B。$P(X = A) = 0.6 + 0.3 \times 0 = 0.6$，$P(X = B) = 0.1 + 0.3 \times 1 = 0.4$，跟 target 一致。判準：用 min 算接受、用 max(0, T − D) 算殘差。

</details>

## 收尾：兩個問題的答案

[錄影 1:45:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=6354s)

投影片第 153–154 頁把推論這半的答案收成兩行：塞得下，靠把向量排得更好（PagedAttention）、讓向量更少更短（GQA、MLA）；跑得快，靠一次產生更多 token（speculative decoding、MTP）。講者最後放了 [Artificial Analysis](https://artificialanalysis.ai/) 首頁的截圖：這個評測彙整網站首頁約三分之二的版面是推論速度相關的圖表，用來說明這些題目是使用者真的在意的事。

把整堂的手法攤開，每一個都在拿一種資源換另一種。這張表是本文的整理：

| 手法 | 省下什麼 | 付出什麼 |
|---|---|---|
| FlashAttention 的反向重算 | HBM 讀寫與記憶體 | 多做一些運算 |
| ZeRO-3／張量平行 | 每張卡的記憶體 | 卡與卡之間的通訊 |
| KV cache | 重算過去 token 的計算 | 記憶體，隨對話長度成長 |
| PagedAttention 的區塊大小 | B 小：碎片少 | 查表開銷大 |
| GQA／MLA | KV cache 記憶體 | 表達力，要重新訓練並做消融 |
| speculative decoding | decode 的等待時間 | draft 的計算；負載高時可能變慢 |

## 連回你用的模型

- **用 API 時**：長 prompt 讓第一個字出現得比較慢，那是 prefill；字流出來的速度是 TPOT。比較推論服務時兩者分開看。多輪對話盡量讓開頭（system prompt、前幾輪）保持不變，才吃得到快取輸入的價格。
- **自架模型時**：先估 KV cache。用上面的算式代入你的模型設定、context 長度和同時連線數，常常會發現卡住你的是 KV cache，不是權重。站上的 [vLLM 自架決策](/posts/ai/2026-08-21-vllm-self-host-decision)算過 GPU 使用率怎麼影響每百萬 token 的成本。
- **考慮開 speculative decoding 時**：先看流量。低流量、重視單一使用者延遲時效果好；高流量時可能沒幫助。draft 模型最好是跟 target 同家族、或蒸餾過的。
- **訓練或微調時**：模型放不下，先試 ZeRO／FSDP，不用改模型程式；還是放不下才考慮張量平行或管線平行。

## 跟 2025 版比

| 2026 第 5 講的內容 | 2025 版在哪 | 2026 的變化 |
|---|---|---|
| FlashAttention | 第 4 講 | 黑板推導逐塊 softmax 更完整；補 FlashAttention 4（Blackwell） |
| 資料平行、ZeRO | 第 4 講 | 大致相同 |
| 模型平行 | 第 4 講只列名稱 | TP、PP、CP、EP 各有圖與例子 |
| TTFT／TPOT、價格、roofline | 無 | 新增 |
| KV cache、PagedAttention、GQA、MLA | 第 3 講 | 用「三個毛病」串起來；補區塊大小取捨 |
| speculative decoding、MTP | 第 3 講 | 新增黑板證明與知識蒸餾 |
| 量化、混合精度 | 第 4 講 | 這一講沒有 |

2025 版的錄影：[第 3 講](https://www.youtube.com/watch?v=Q5baLehv5So)、[第 4 講](https://www.youtube.com/watch?v=VlA_jt_3Qc4)。

## 綜合自我檢測

第 1、2、3、6 題改寫自 [2025 期中考](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf)第 III、IV 大題，答案在[解答 PDF](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf)。2026 版的期末考在 12 月 9 日。

1. 推論時 KV cache 的用途是什麼？它省下的是什麼成本？（第 III.5 題）
2. 跟 MHA 比，MQA／GQA 主要靠什麼降低延遲？（第 III.6 題）
3. PagedAttention 主要想解決什麼問題？（第 III.3 題）
4. FlashAttention 與 speculative decoding 都被說成「精確」的方法。各自是用什麼論證說明結果不變的？
5. 用 roofline 解釋：為什麼加大 batch 能讓 decode 更有效率，卻也會讓 speculative decoding 的好處變小？
6. 說明 FlashAttention 的核心想法，並舉一個實際觀察到的好處。（第 IV.10 題）
7. 用本文的 KV cache 算式，算出 Llama 3 8B 在 32K context、同時 4 個請求、BF16 下的 KV cache 大小，再說明三個毛病裡的哪幾個方法能把它壓小。

<details>
<summary>第 4、5、7 題的判準</summary>

- 第 4 題：FlashAttention 是代數恆等式，分子分母同乘常數、重新縮放後 $N/D$ 不變；speculative decoding 是機率論證，接受項 $\min(D, T)$ 加上拒絕重抽項 $\max(0, T - D)$ 恰好等於 $T$。
- 第 5 題：batch 越大，權重讀一次分給更多請求，算術強度上升，往 compute bound 走；speculative decoding 是在利用 decode 時閒置的算力，算力已經吃滿時，多驗證幾個 token 就不再是免費的。
- 第 7 題：128 KiB × 32,768 × 4 = 16 GiB。GQA（已經用了 8 個 KV head）、MLA 讓向量變少變短；PagedAttention 不縮小總量，但減少預留造成的浪費。

</details>

## 想深入

- 自己算 FLOPs、記憶體與 roofline：[CS336 第 2 講](/posts/ai/2026-08-22-cs336-resource-accounting)
- GPU 的記憶體階層與 FlashAttention 的原理：[CS336 第 5 講](/posts/ai/2026-08-22-cs336-gpu-tpu)
- 動手寫 fused kernel：[CS336 第 6 講](/posts/ai/2026-08-22-cs336-kernels-triton)、[Triton 的 fused softmax 教學](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html)
- 通訊原語與平行策略：[CS336 第 7 講](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 第 8 講](/posts/ai/2026-08-22-cs336-parallelism-strategies)、Hugging Face 的 [Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook)
- 量化與 continuous batching 的完整推論帳：[CS336 第 10 講](/posts/ai/2026-08-22-cs336-inference)
- 用滑桿感受 TTFT 與 speculative decoding：[Learn Inference 互動版推論工程網站介紹](/posts/ai/2026-09-29-learn-inference-interactive-guide)
- 同批的 2026 新講：[RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms)、[AI Agents](/posts/ai/2026-09-29-cme295-ai-agents)、[Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms)

## 課程影片來源

本文依 CME295 2026 版第 5 講的課堂錄影（[Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 5 - LLM Systems](https://www.youtube.com/watch?v=25KIyaeI_Fg)，1:47:01）與 [2026 版投影片](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf)寫成，播放器在導言。字幕是 YouTube 上的人工英文字幕；字幕把 ZeRO、MQA、LoRA 等專有名詞聽錯的地方，以投影片為準。

內容核對：已依字幕核對（2026-11-23）：讀完整份人工英文字幕（含時間戳），各節的時間連結取自字幕時間碼；正文的課堂說法、問答與黑板推導依字幕轉述，公式與數字依投影片（第 46–47、60、92、100–102、119、125、144 頁）。

課程與錄影入口：

- [官方 2026 課表](https://cme295.stanford.edu/syllabus/)
- [CME295 Autumn 2026 播放清單](https://www.youtube.com/playlist?list=PLakGfbKCei80)

查核日期：2026-11-23。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。2026 版第 5 講錄影尚未上架，把原本標成已附影片的 2025 版第 3、4 講改標為相關補充影片，並修正影片標題。
- 2026-10-10：依字幕核對影片內容。兩支 2025 影片（第 3、4 講）確實涵蓋推論加速／平行化／量化等相關主題，與本文「相關補充」標示相符；沒有需修正之處。
- 2026-11-09：重查影片狀態。2026 版第 5 講錄影已在官方課表上架，補上原錄影連結並改寫狀態行；正文依錄影對照更新待另做。
- 2026-11-23：依 2026 版第 5 講錄影字幕與 156 頁投影片改寫全文。改成課堂實際順序（FlashAttention → 分散式訓練 → 推論），補上 TTFT／TPOT 公式、roofline、context 與 expert 平行、KV cache 三個毛病的串法、speculative decoding 的完整證明、知識蒸餾；拿掉課堂沒講的 kernel 與硬體規格段落；錄影移到導言、狀態改為已附影片，各節加時間連結與自我檢查。

## 參考資料

- [CME 295 2026 版課表](https://cme295.stanford.edu/syllabus/)
- [2026 版第 5 講投影片（PDF）](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf)／[錄影](https://www.youtube.com/watch?v=25KIyaeI_Fg)
- [2025 版第 3 講投影片（PDF）](https://cme295.stanford.edu/slides/fall25-cme295-lecture3.pdf)／[錄影](https://www.youtube.com/watch?v=Q5baLehv5So)
- [2025 版第 4 講投影片（PDF）](https://cme295.stanford.edu/slides/fall25-cme295-lecture4.pdf)／[錄影](https://www.youtube.com/watch?v=VlA_jt_3Qc4)
- [2025 期中考](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf)／[解答](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf)
- [NVIDIA H100 Tensor Core GPU 規格](https://www.nvidia.com/en-us/data-center/h100/)
- [Dao et al., FlashAttention (2022)](https://arxiv.org/abs/2205.14135)
- [Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (2019)](https://arxiv.org/abs/1910.02054)
- [Shoeybi et al., Megatron-LM (2019)](https://arxiv.org/abs/1909.08053)
- [Huang et al., GPipe (2018)](https://arxiv.org/abs/1811.06965)
- [Liu et al., Ring Attention with Blockwise Transformers for Near-Infinite Context (2023)](https://arxiv.org/abs/2310.01889)
- [Lepikhin et al., GShard (2020)](https://arxiv.org/abs/2006.16668)
- [Hugging Face, The Ultra-Scale Playbook (2025)](https://huggingface.co/spaces/nanotron/ultrascale-playbook)
- [Yu et al., Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)](https://www.usenix.org/conference/osdi22/presentation/yu)
- [Kwon et al., Efficient Memory Management for LLM Serving with PagedAttention (2023)](https://arxiv.org/abs/2309.06180)
- [Ainslie et al., GQA (2023)](https://arxiv.org/abs/2305.13245)
- [Shazeer, Fast Transformer Decoding: One Write-Head is All You Need (2019)](https://arxiv.org/abs/1911.02150)
- [DeepSeek-AI, DeepSeek-V2 (2024)](https://arxiv.org/abs/2405.04434)
- [Llama Team, The Llama 3 Herd of Models (2024)](https://arxiv.org/abs/2407.21783)
- [Chen et al., Accelerating Large Language Model Decoding with Speculative Sampling (2023)](https://arxiv.org/abs/2302.01318)
- [Leviathan et al., Fast Inference from Transformers via Speculative Decoding (2022)](https://arxiv.org/abs/2211.17192)
- [Hinton et al., Distilling the Knowledge in a Neural Network (2015)](https://arxiv.org/abs/1503.02531)
- [Zhou et al., DistillSpec: Improving Speculative Decoding via Knowledge Distillation (2023)](https://arxiv.org/abs/2310.08461)
- [Gloeckle et al., Better & Faster Large Language Models via Multi-token Prediction (2024)](https://arxiv.org/abs/2404.19737)
- [vLLM 文件：Speculative Decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/)
- [Artificial Analysis](https://artificialanalysis.ai/)
- [Triton：Fused Softmax 教學](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html)
- [Stanford CME295 導讀（本系列總覽）](/posts/ai/2026-09-29-cme295-course-overview)
