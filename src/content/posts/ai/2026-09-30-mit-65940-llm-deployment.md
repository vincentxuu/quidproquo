---
title: "MIT 6.5940 第 13 講：LLM 部署——量化、稀疏與 serving 三條路"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, llm-inference, quantization, model-serving]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 15
tldr: "第 13 講把 LLM 推論變快的方法分成三條路。量化：SmoothQuant 把 activation 的離群值難度搬到權重做 W8A8，AWQ 依 activation 找出約 1% 的重要權重、用縮放保護它們做 W4A16，QServe 再合成 W4A8KV4。稀疏：Wanda 用 |W|·‖X‖ 剪權重，DejaVu 與 MoE 每個 token 只用一部分參數，SpAtten 與 H2O 丟掉不重要的 token。Serving：TTFT／TPOT 指標、PagedAttention、FlashAttention、speculative decoding 與 continuous batching。投影片上 OPT-6.7B 做 INT3 時，RTN 的 perplexity 是 43.16，把重要 channel 放大 2 倍就降到 14.07。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 13 講 Efficient LLM Deployment 導讀：為什麼 decode 是 memory-bound、SmoothQuant、AWQ 與 TinyChat、QServe W4A8KV4，Wanda、DejaVu、MoE、SpAtten、H2O，以及 serving 指標、PagedAttention、FlashAttention、speculative decoding、batching。附 Fall 2026 對照。"
draft: false
glossary:
  - term: "AWQ"
    aliases: ["activation-aware weight quantization"]
    definition: "只量化權重（常見設定是 4-bit、每 128 個一組）的方法。依校準資料的 activation 大小找出重要的權重 channel，量化前先把它們乘上縮放係數、再把倒數併進前一個運算，不必保留混合精度。"
    context: "MIT 6.5940 第 13 講的主角之一，也是 Lab 4 要實作的演算法。"
  - term: "W4A16"
    aliases: ["weight-only quantization", "權重量化"]
    definition: "權重存成 4-bit、activation 維持 16-bit 浮點的量化設定。省的是搬權重的記憶體頻寬，適合 batch 小、decode 受頻寬限制的情境。"
    context: "投影片把它對照雲端常用的 W8A8：邊緣推論用 W4A16，雲端批次 serving 用 W8A8。"
  - term: "TTFT"
    aliases: ["time to first token"]
    definition: "從送出請求到看見第一個輸出 token 的時間，主要由處理 prompt（prefill）決定。"
    context: "第 13 講 serving 段的四個指標之一，另三個是 TPOT、latency、throughput。"
  - term: "SmoothQuant"
    definition: "W8A8 量化方法。先用校準資料找出 activation 每個 channel 的最大值，把 activation 除以一個縮放向量、把權重乘上同一個向量，讓兩邊都容易量化。"
    context: "第 13 講量化段的第一個技術，對應 weight-activation quantization。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-llm-deployment-en)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 15 篇，接續[第 12 講：Transformer 與 LLM](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)。

**系列位置**：上一篇 [L12 Transformer 與 LLM](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)｜下一篇 [Lab 4＋Lab 5：AWQ 量化與筆電上的 LLaMA2-7B](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lec13-LLM-Deployment.pdf](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0)（93 頁，以下頁碼皆指這份 PDF）、[第 13 講錄影](https://youtu.be/sTz2tXG1T0c)。存取等級 **A3**：投影片與錄影公開，對應練習是 [Lab 4 與 Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)。以下內容以投影片為準，2026-09-30 核對。

**Fall 2026 對照**：[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)把第 13 講（10 月 27 日）改名為「LLM Quantization and Deployment」，截至 2026-09-30 投影片與錄影還沒上線，無法比對內容。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=sTz2tXG1T0c
title: 第 13 講錄影（YouTube）
```

原始影片：[第 13 講錄影（YouTube）](https://www.youtube.com/watch?v=sTz2tXG1T0c)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 這一講在解什麼

[第 12 講](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)留下一個事實：LLM 生成時一次只吐一個 token，每吐一個都要把整個模型的權重從記憶體搬一次。這一講把「讓它變快、變省」的方法整理成三條路，第 2 頁的 Lecture Plan 就是全講地圖：

| 主線 | 投影片頁 | 技術 |
|---|---|---|
| 1. 量化 | 4–59 | SmoothQuant（weight-activation）、AWQ 與 TinyChat（weight-only）、QServe（W4A8KV4） |
| 2. 剪枝與稀疏 | 60–68 | Wanda（權重）、DejaVu 與 MoE（contextual）、SpAtten 與 H2O（attention） |
| 3. Serving 系統 | 69–92 | 指標、PagedAttention（vLLM）、FlashAttention、speculative decoding、batching |

量化佔了超過一半篇幅，而且是 Lab 4 的主題，所以本文在量化上寫最細，另外兩條各挑一個代表講清楚，其餘列重點。

## 第一條路：量化

### 場景：CNN 的 W8A8 為什麼搬不過來

第 5 頁先丟出問題：W8A8（權重與 activation 都 8-bit）在 CNN 已經是業界標準，為什麼 LLM 不行？投影片的答案是，模型放大到 6.7B 以上，activation 會出現**系統性的離群值**，傳統 CNN 的量化方法會把準確率毀掉。

第 6–7 頁把權重和 activation 的數值畫在一起：權重分布平整，很好量化；activation 少數 channel 特別大，很難量化。好消息是，這些離群值**固定出現在同幾個 channel**。

### SmoothQuant：把難度從 activation 搬給權重

直覺很簡單：既然 activation 某個 channel 特別大，就把它除以一個數；為了讓結果不變，把權重對應的那一列乘上同一個數。第 8 頁的標語是「migrate the quantization difficulty」，搬完之後 activation 容易量化，權重稍微難一點，但仍然容易。

第 10–12 頁把流程拆成三步：離線校準（統計 activation 每個 channel 的最大絕對值）、離線平滑（算出縮放向量 $s$，併進權重），推論時直接跑已經平滑好的 $\hat{X}\hat{W}$。

<details>
<summary>縮放向量的公式與 α 的角色（第 13 頁）</summary>

$$
s_j = \frac{\max(|X_j|)^{\alpha}}{\max(|W_j|)^{1-\alpha}},\quad
Y = (X\,\mathrm{diag}(s)^{-1})\cdot(\mathrm{diag}(s)\,W) = \hat{X}\hat{W}
$$

$\alpha$ 是 migration strength，控制搬多少難度到權重。投影片的結論是：$\alpha$ 太大權重變難量化，太小 activation 還是難量化，中間有一個 sweet spot。

</details>

第 14 頁說明系統實作：SmoothQuant 整合進 FasterTransformer，所有計算密集的運算（Linear、BMM）都量化成 INT8。第 15 頁的結果是不需要微調就能維持準確率，同時加速推論、記憶體用量減半（圖中 FP16 用 8 張 GPU，SmoothQuant 用 4 張）。第 16 頁把 MT-NLG 530B 塞進單一節點，第 17 頁則顯示 LLaMA 7B 到 65B 的 Wikitext perplexity 幾乎不變。

### 為什麼 W8A8 還不夠：decode 被頻寬卡住

第 19 頁轉折：W8A8 適合**批次 serving**（例如 batch size 128），但單一使用者在本機跑 LLM 時，decode 仍然嚴重受記憶體頻寬限制。這時需要的是低位元的**只量化權重**，例如 W4A16。

第 20 頁用 RTX 4090 上的量測說明差距：處理 200 個 token 的 context 約 10 ms，生成 20 個 token 卻要約 310 ms。生成階段每一步只算一個 token，計算量很小，時間都花在讀權重。

如果你讀過 [Fall 2026 Lab 1 的 roofline](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics)，這就是 decode 落在 roofline 左側（memory-bound）的具體案例。

### AWQ：找出 1% 重要權重，用縮放保護它們

**場景**。把 OPT-6.7B 用最簡單的 round-to-nearest（RTN）量化到 INT3、每 128 個一組，第 21 頁顯示 Wiki-2 perplexity 明顯變差。

**觀察一：權重不是一樣重要**（第 22 頁）。只要讓約 1% 的重要權重 channel 維持 FP16，perplexity 就大幅改善。

**觀察二：重要性要看 activation，不是看權重本身**（第 24 頁）。用權重大小挑那 1%，改善很小；用 activation 大小挑，改善很大。這就是「activation-aware」的由來。

**問題**：保留 1% FP16 等於混合精度，硬體不好實作。

**解法：用縮放代替混合精度**（第 25–27 頁）。把重要 channel 的權重乘上 $s$（大於 1），對應的 activation 除以 $s$，這個 $1/s$ 可以併進前一個運算。第 25 頁的數字最能說明效果：同樣是 INT3，RTN 的 perplexity 是 43.16，把重要 channel 放大 2 倍後是 14.07，FP16 原本是 12.29。放大 4 倍反而回升到 14.42，因為放太大會傷到其他 channel。

<details>
<summary>為什麼放大能降低誤差（第 26、28 頁）</summary>

設量化為 $Q(w) = \Delta \cdot \mathrm{Round}(w/\Delta)$，$\Delta = \max(|w|)/2^{N-1}$。誤差約為 $\Delta \cdot \mathrm{Err}(\mathrm{Round}(\cdot)) \cdot x$，其中 Round 的誤差期望值約 0.25。

把一個 channel 乘上 $s$ 再除回來，誤差變成 $\Delta' \cdot \mathrm{Err}(\cdot) \cdot x \cdot \frac{1}{s}$。只要 $s$ 不太大，一組 128 個權重的最大值不太會變（$\Delta' \approx \Delta$），誤差就大約縮小 $s$ 倍。$s$ 太大時 $\Delta'$ 被撐大，其他非重要權重的誤差跟著變大。

實際的 $s$ 用搜尋決定（第 28 頁）：

$$
\mathcal{L}(s) = \lVert Q(W\cdot s)(s^{-1}\cdot X) - WX \rVert,\quad s = s_X^{\alpha},\quad \alpha^* = \arg\min_{\alpha}\mathcal{L}(s_X^{\alpha})
$$

$s_X$ 是 activation 的平均大小。投影片特別指出兩點：scale 只由 activation 大小決定；搜尋目標是**輸出**的誤差，不是權重本身的誤差（這是和 GPTQ 的差別）。

</details>

第 29 頁列 AWQ 的優點：簡單、硬體效率高、比 regression 類方法更不依賴校準資料，並能推廣到 instruction-tuned 與多模態模型。第 30 頁在 Llama-2 與 LLaMA 上比較 RTN、GPTQ、AWQ 的 INT3／INT4 perplexity；第 31–33 頁把 AWQ 用在 VILA 視覺語言模型，INT4 的平均分數與 FP16 相近。

### TinyChat：把量化模型真的跑快

量化只省了儲存空間，要變快還需要推論引擎。第 35 頁介紹 [TinyChat](https://github.com/mit-han-lab/llm-awq)：輕量、Python 原生、支援雲端與邊緣 GPU 以及筆電和手機 CPU。兩個關鍵技巧：

- **Hardware-aware packing**（第 36 頁）：離線重排 4-bit 權重的位置，讓執行時用一次 AND 與位移就能解開，減少解碼指令。
- **Kernel fusion**（第 37 頁）：把解量化和矩陣乘法融合，少寫一次中間結果到 DRAM。

第 38 頁的標題是比 Huggingface FP16 推論快 3 倍以上，測試平台包括 RTX 4090、RTX 4070 筆電 GPU 與 Jetson Orin。第 40 頁示範在只有約 7 GB 可用記憶體的 Jetson Orin Nano 上跑 7B 模型。這正是 [Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop) 在 CPU 上要你親手做的事。

### QServe：把雲端與邊緣的設定合起來

第 47–48 頁指出兩個世界用的設定不同：

| 情境 | 設定 | 細節 |
|---|---|---|
| 雲端 serving | W8-A8-KV8 | 權重 per-channel、activation per-token、KV per-tensor，都是 8-bit |
| 邊緣推論 | W4-A16-KV16 | 權重 4-bit per-group（group 128），activation 與 KV 維持 FP16 |

第 49 頁問能不能兩邊的好處都拿：4-bit 權重省頻寬，8-bit activation 提高峰值算力，這就是 W4A8KV4。第 50 頁說明現有的 W4A4 方法有兩個問題：準確率損失明顯，而且在現有 GPU 上跑不快。第 51–53 頁分析原因：量化 GEMM 的主迴圈裡，解量化要在 CUDA core 上做，而 CUDA core 很貴。

QServe 的兩個對策：

- **SmoothAttention**（第 54–55 頁）：把 K cache 的量化難度搬到 Q，公式與 SmoothQuant 同構。
- **Progressive quantization**（第 56–57 頁）：解量化時「先乘 scale 再減 zero point」，避免暫存器層級平行運算的溢位問題。

第 59 頁的標題是在 A100 與 L40S 上比 TensorRT-LLM 快 2.4 到 3.5 倍。

## 第二條路：剪枝與稀疏

這段只有 9 頁，每個技術一到兩頁。挑 **H2O** 當代表講，因為它直接處理第 12 講算出來的 KV cache 問題。

**場景**：生成越長，KV cache 越大。**直覺**：不是每個過去的 token 都一樣重要。**機制**：第 68 頁寫 H2O 在 KV cache 裡只留兩種 token，最近的 local token，以及累積 attention 分數高的 heavy hitter（H2），其餘丟掉。**連回模型**：這是在推論時對 attention 做 token 層級的剪枝，不動權重。

其他四個技術：

| 技術 | 頁 | 一句話 |
|---|---|---|
| [Wanda](https://arxiv.org/abs/2306.11695) | 61–62 | 跟 AWQ 同一個想法：剪權重也要看 activation，用 $\lvert W\rvert \cdot \lVert X\rVert$ 當重要性，穩定勝過只看權重大小 |
| [DejaVu](https://arxiv.org/abs/2310.17157) | 63 | 靜態稀疏在中高稀疏度會傷準確率；改用依輸入而定的 contextual sparsity，用非同步預測器挑每個 token 需要的 head 與 feature |
| MoE（[Switch Transformers](https://arxiv.org/abs/2101.03961)） | 64–66 | 每個 token 由 router 分給少數 expert，總參數變多但每個 token 的推論成本不變；第 65 頁用 capacity factor 說明 expert 容量滿了會跳過 token |
| [SpAtten](https://arxiv.org/abs/2012.09852) | 67 | 串接式剪掉累積 attention 小的 token 與 head；QK 小就不去抓 V；先用低精度算，不夠有把握再換高精度 |

## 第三條路：Serving 系統

### 先定義要量什麼

第 70 頁引用 [Databricks 的推論效能文章](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)，定義四個指標：

- **TTFT**（time to first token）：使用者多快看到第一個字，主要由 prompt 處理時間決定。
- **TPOT**（time per output token）：每個輸出 token 的時間。投影片舉例 100 ms/token 等於每秒 10 個 token，約每分鐘 450 個英文字。
- **Latency** = TTFT + TPOT × 要生成的 token 數。
- **Throughput**：伺服器每秒在所有請求上總共生成多少 token。

第 71 頁點出取捨：同時處理多個請求會提高 throughput，但拉長每個使用者的 TPOT；而輸出長度是延遲的主要來源。

### 代表：PagedAttention

**場景**（第 74 頁）：KV cache 很大。以 Llama-2-70B 為例（假設用 MHA），每個 token 每個序列要 2.5 MB；batch 16、序列長 4096 就要 160 GB，得用兩張 A100。

**問題**（第 75 頁）：KV cache 的浪費有三種。不知道會生成多長，只好多配（internal fragmentation）；先保留給未來才用的空間（reservation）；不同序列長度造成的空洞（external fragmentation）。

**直覺**（第 76 頁）：借用作業系統的虛擬記憶體與分頁。

**機制**（第 77–80 頁）：[PagedAttention](https://arxiv.org/abs/2309.06180) 讓邏輯上連續的 K、V 存在不連續的實體記憶體區塊。多個請求可以共用區塊，平行取樣時同一個 prompt 的區塊也能共用。

### 其他三項

- **FlashAttention**（第 82–83 頁）：用 tiling 避免把整個 $N\times N$ attention 矩陣寫到較慢的 HBM，並做 kernel fusion。[Fall 2026 Lab 1 Part 5](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics) 讓你實測它和標準 attention 的差距。
- **Speculative decoding**（第 85–87 頁）：用小的 draft model 先自迴歸生成 K 個 token，再一次平行餵給大的 target model 驗證，決定留下或拒絕。因為 target model 一次處理多個 token，緩解了頻寬瓶頸。投影片引用 [Leviathan et al.](https://arxiv.org/abs/2211.17192) 的結果：在輸出完全相同下加速 2–3 倍。
- **Batching**（第 89–91 頁）：no batching、static、dynamic、continuous（in-flight）四種。Dynamic batching 像「坐滿或時間到就開的公車」；continuous batching 以 token 為單位，有請求結束就讓新請求補位，適合輸出長度不一的 LLM。

第 92 頁以 NVIDIA [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) 收尾，標出哪些功能本講已經講過、哪些留給後面的課。

## 三條路共用一個想法

整理完會發現一條貫穿線：**看 activation**。SmoothQuant 依 activation 決定縮放、AWQ 依 activation 挑重要權重、Wanda 把 activation 放進剪枝分數、H2O 與 SpAtten 依 attention 分數丟 token。另一條線是**頻寬**：W4A16、TinyChat 的 kernel fusion、FlashAttention、speculative decoding，都在減少從記憶體搬資料的次數。

## 自學怎麼做

1. 先看第 19–20 頁，確認自己能說出「為什麼 decode 慢」。說不出來就先做 [Fall 2026 Lab 1](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics) 的 roofline 部分。
2. 把第 25 頁（縮放效果）和第 28 頁（搜尋目標）對照著讀，再開 [Lab 4](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)。Lab 4 的 Q1 與 Q2 基本上就是這兩頁的實作版。
3. 今晚就能做的一件事：用第 74 頁的公式，算你常用的模型（查它的層數、KV head 數、head 維度）在 8K context 下每個請求要多少 KV cache。

## 延伸閱讀

- 同系列：[L12 Transformer 與 LLM](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)、[L6 量化 II（PTQ 與 QAT）](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)、[L11 TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)
- 推論與 serving：[CS336 推論](/posts/ai/2026-08-22-cs336-inference)、[CMU 11-868 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)、[CMU 11-868 LLM serving（SGLang 與 vLLM）](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)、[CMU 11-868 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention)
- MoE：[CMU 11-868 模型平行與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Lec13-LLM-Deployment.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) — 本文所有頁碼、數字與技術分段
- [第 13 講錄影（YouTube）](https://youtu.be/sTz2tXG1T0c)
- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 排程、Lab 4 發出日期
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 第 13 講改名與上線狀態
- [Xiao et al., SmoothQuant（ICML 2023）](https://arxiv.org/abs/2211.10438)
- [Lin et al., AWQ（MLSys 2024）](https://arxiv.org/abs/2306.00978)、[llm-awq／TinyChat（GitHub）](https://github.com/mit-han-lab/llm-awq)
- [Lin et al., QServe: W4A8KV4 Quantization and System Co-design](https://arxiv.org/abs/2405.04532)
- [Sun et al., Wanda](https://arxiv.org/abs/2306.11695)、[Liu et al., Deja Vu](https://arxiv.org/abs/2310.17157)、[Fedus et al., Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Wang et al., SpAtten](https://arxiv.org/abs/2012.09852)、[Zhang et al., H2O](https://arxiv.org/abs/2306.14048)
- [Kwon et al., PagedAttention／vLLM](https://arxiv.org/abs/2309.06180)、[Dao et al., FlashAttention](https://arxiv.org/abs/2205.14135)、[Leviathan et al., Speculative Decoding](https://arxiv.org/abs/2211.17192)
- [Databricks, LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — 第 70–71 頁指標定義的出處
- [Baseten, Continuous vs dynamic batching for AI inference](https://www.baseten.co/blog/continuous-vs-dynamic-batching-for-ai-inference/) — 第 90–91 頁 batching 比喻的出處
- [NVIDIA TensorRT-LLM（GitHub）](https://github.com/NVIDIA/TensorRT-LLM)
