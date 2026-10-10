---
title: "台大李宏毅 ML 2026 導讀：HW3 LLM Fast Inference——讀七篇加速論文，再在 GPU 上量 speculative decoding、FlashAttention 與 vLLM"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, llm-inference, speculative-decoding, flashattention, kv-cache, vllm]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 8
tldr: "HW3 是 20 題選擇題（每題 0.5 分），不交程式，只在 NTU COOL 上作答。前 10 題讀論文：四篇 speculative decoding（Leviathan、DeepMind 的 Speculative Sampling、Inference with Reference、SpecInfer）加上 FlashAttention 1–3；後 10 題照 Colab 填 TODO 後分析結果：手寫 speculative decoding 的接受率、兩種 prompt regime 下 assistant 模型與 n-gram 的加速曲線、用 T4 規格估 FlashAttention 的 HBM 讀取量與理論加速、vLLM 的 prefix caching 多輪測試與失效實驗，以及 CPU offload 對 throughput 的影響。題目中英雙語全部印在作業 PDF 裡，校外可以完整自學，只是拿不到官方解答。"
description: "台大李宏毅《機器學習 2026 Spring》HW3 導讀，依 hw3.pdf、作業 Colab 與助教說明影片：作業格式、先備影片、七篇指定論文各考什麼、Manual Speculative Decoding 的 TODO、Benchmark with Two Prompt Regimes、FlashAttention 的讀寫量公式與 T4 run time 估算、vLLM KV Cache Multi-turn 與 Invalidation、CPU offload，以及校外自學的限制。"
draft: false
glossary:
  - term: "Speculative Decoding"
    aliases: ["speculative sampling", "投機解碼"]
    definition: "先用小的 draft／assistant 模型自回歸地猜 γ 個 token，再讓大的 target 模型一次平行算出 γ+1 個分布，依機率比例決定接受到哪裡；被拒絕的位置從修正後的分布重新抽樣。"
    context: "在理論上輸出分布與只用 target 模型相同，代價是多跑一個小模型。"
  - term: "接受率 alpha"
    aliases: ["acceptance rate", "alpha"]
    definition: "HW3 Colab 定義為 accepted / drafted，也就是 draft 模型猜的 token 中被 target 模型接受的比例。"
    context: "作業要比較 normal prompt 與 simple prompt 下的 alpha 與執行時間。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW3。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 8 篇。前兩篇講了 [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention) 和 [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)，這份作業要你真的在 GPU 上量看看，也把課堂上跳過的 Speculative Decoding 補回來。

用到的官方材料：作業說明 [hw3.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw3.pdf)（63 頁，後半是中英兩版題目）、[作業 Colab](https://colab.research.google.com/drive/1vZNo6_PlaP2fvMqr3g5KoQA0rN79m24O?usp=sharing)（40 個 cell），以及課程頁列出的助教說明影片 [ML 2026 Spring HW3 LLM Fast Inference](https://youtu.be/rXfp9Yo5HwU)。課程頁寫 3/20 公告，PDF 寫截止時間是 2026/04/09 23:59:59（UTC+8），不收遲交。助教是馮柏翰、吳岳霖、蘇炳揚。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=rXfp9Yo5HwU
title: 助教影片：ML 2026 Spring HW3 LLM Fast Inference
```

原始影片：[助教影片：ML 2026 Spring HW3 LLM Fast Inference](https://www.youtube.com/watch?v=rXfp9Yo5HwU)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 存取等級：A3，但沒有官方解答

- **拿得到**：作業 PDF、Colab 起始碼，以及 20 題的完整題目。PDF 寫明「給沒修課也沒旁聽的人」，題目和 NTU COOL 上的一模一樣，中英兩版都有。
- **拿不到**：作答與評分在 NTU COOL，需要台大帳號。PDF 說解答與解析的連結會在 2026/04/12 之後放上，但我在 PDF 的連結裡沒有找到這份文件。所以校外自學可以把題目全做完，只是沒辦法對答案。
- **硬體**：題目以 Colab 的 T4 為主要情境（Q15、Q17 都指定 T4），PDF 的 Q14 另外附了 T4、A100、L4、G4 VM 跑出來的圖供對照，因為 GPU 不同、加上部分隨機性，你的圖可能不一樣。Speculative decoding 與 vLLM 兩段都要 Hugging Face token；vLLM 那段用 `meta-llama/Llama-3.2-3B-Instruct`，要先申請授權。

## 格式與先備

作業共 **20 題選擇題，每題 0.5 分，總分 10 分**：

| 部分 | 題號 | 怎麼答 |
|---|---|---|
| Part 1：Paper Reading | Q1–Q10 | 讀指定論文 |
| Part 2：Coding | Q11–Q20 | 填 Colab 裡標 `# TODO` 的 cell，分析執行結果 |

Colab 開頭把 coding 題再分三段：Q11–Q15 是 Speculative Decoding，Q16–Q17 是 FlashAttention，Q18–Q20 是 vLLM。不用交程式碼，NTU COOL 的測驗可以無限次作答，取最高分。

先備影片是 [【生成式人工智慧與機器學習導論2025】第3講：解剖大型語言模型](https://youtu.be/8iFvM7WUUs8)。Speculative Decoding 的觀念則看 [【生成式AI導論 2024】第16講](https://youtu.be/MAbGgsWKrg8)，這學期的講課沒有重講。

## Part 1：七篇論文各考什麼

PDF 建議先粗讀整篇，再回到和題目相關的段落細看；也明講可以用 LLM 幫忙找段落或驗證自己的答案。

**Speculative Decoding 四篇：**

- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)（Q1–Q2）：把一個 speculative decoding step 的五個步驟排序，以及判斷哪些是「一定要承擔的後果」，例如一步可能一個新 token 都沒有，最多產生 γ+1 個。
- [Accelerating Large Language Model Decoding with Speculative Sampling](https://arxiv.org/abs/2302.01318)（Q3）：挑 draft model 要注意什麼，例如 random sampling 與 greedy decoding 下接受率的差別、target model 平行驗證時算力不夠的問題。
- [Inference with Reference](https://arxiv.org/abs/2304.04487)（Q4）：判斷哪些應用情境不符合論文 Figure 1 的描述。這篇不用小模型，而是拿參考文件與輸出之間的文字重疊來加速。
- [SpecInfer](https://arxiv.org/abs/2305.09781)（Q5）：Learning-based Speculator 怎麼建 token tree（expansion-based 與 merge-based），以及 Token Tree Verifier 如何共用 prefix 的 KV cache。

**FlashAttention 三篇：**

- [FlashAttention](https://arxiv.org/abs/2205.14135)（Q6–Q7）：forward pass 步驟排序，以及 backward pass 為什麼要用存下的 l、m 重算 S、P。
- [FlashAttention-2](https://arxiv.org/abs/2307.08691)（Q8）：相對初代多做了哪些平行化與 work partitioning 的優化。
- [FlashAttention-3](https://arxiv.org/abs/2407.08608)（Q9）：Hopper GPU 的 thread 階層、warpgroup 之間讓 softmax 與矩陣乘法重疊，以及 FP8 的處理。

Q10 是綜合題，要結合上課內容、作業投影片與所有論文判斷敘述對錯。PDF 另外列了不出題的延伸材料：[SpeculativeDecodingPapers](https://github.com/hemingkx/SpeculativeDecodingPapers) 論文清單與 [FlashAttention-4](https://arxiv.org/abs/2603.05451)。

## Part 2-1：Speculative Decoding 實驗（Q11–Q15）

Colab 用 `google/gemma-3-1b-it` 當 target model、`google/gemma-3-270m-it` 當 assistant model，而且程式會先檢查兩者的詞彙表完全相同，不同就直接報錯。

**Manual Speculative Decoding（TODO）**：依 Speculative Sampling 論文補完核心邏輯。Colab 給的路線是：

1. 用 assistant 模型草擬 `gamma` 個 token。
2. target 模型對草擬後的序列跑一次 forward。
3. 算每個草擬 token 的接受比例。
4. 被拒絕時，從修正後的分布抽一個新 token。
5. 統計 `alpha = accepted / drafted`。

注意 Colab 的符號和論文相反：`q()` 是 assistant 模型的分布，`p()` 是 target 模型的分布。Q11 問修正分布那一行 `diff` 該填什麼，Q12 問 `ratio = torch.clamp(p_x / (q_x + eps), max=1.0)` 這一行在做什麼。Q13 要你分別用 normal prompt 與 simple prompt 跑，比較執行時間與 alpha。

**Benchmark with Two Prompt Regimes**：比較低使用率（短而簡單的 prompt，`max_new_tokens=64`）和高使用率（長而複雜的 prompt，`max_new_tokens=128`）兩種情況，gamma 從 1 掃到 10，畫出 assistant 模型和 n-gram（Hugging Face 的 `prompt_lookup_num_tokens`）兩條加速曲線。Colab 要你用接受品質、額外開銷、工作量大小三個面向解釋差異。Q14 要你根據畫出的圖選出正確敘述，Q15 問的是：用 T4 時，某些設定下 speculative 反而比一般生成慢，可能的原因是什麼。

**怎麼做**：先跑 simple prompt，看 alpha 有多高；再換 normal prompt，確認加速主要來自 alpha 還是 prompt 長度，這正是 Q13 在分辨的事。

## Part 2-2：FlashAttention 實驗（Q16–Q17）

Colab 用 Python 實作 Standard Attention 與 FlashAttention 兩種演算法，但特別註明：**Python 版不會真的變快**，實際加速要靠 CUDA 或 C++ 這類低階實作。所以這段要數的是讀寫量，再用硬體規格估出理論時間。

作業 PDF 列出兩種算法對 HBM 的讀寫量（N 是序列長度，d 是每個 head 的維度，N 遠大於 d）：

| | 讀取 | 寫入 | 總量 |
|---|---|---|---|
| Standard Attention | Q、K、V 各 N×d；S、P 各 N×N | S、P 各 N×N；O 為 N×d | N(4d+4N) |
| FlashAttention | Q、K、V、O 各 N×d；l、m 各 N×1 | O 為 N×d；l、m 各 N×1 | N(5d+4) |

N×N 的項消失了，這就是[上一篇](/posts/ai/2026-09-30-ntu-ml2026-flash-attention)說的「不把 attention weight 寫回倉庫」。

**Run Time Calculation（TODO）**：Colab 給 T4 的規格（FP32 8.1 TFLOPS、記憶體頻寬 320 GB/s）和一個範例公式，要你改寫成對不同序列長度計算：

```python
run_time = flops / (8.1 * 1e12) + 4 * total_memory_floats / (320 * 1e9)
```

`4 *` 是每個 FP32 數佔 4 bytes。Q16 問 N=1024 時從 HBM 讀了多少浮點數，Q17 問 N=2048 時 FlashAttention 相對 Standard Attention 在 T4 上的理論加速倍率。

## Part 2-3：vLLM 實驗（Q18–Q20）

PDF 介紹 [vLLM](https://github.com/vllm-project/vllm) 是結合多種技術的高吞吐推論引擎，參考論文是 [PagedAttention](https://arxiv.org/abs/2309.06180)。三個實驗都用 `meta-llama/Llama-3.2-3B-Instruct`。

**KV Cache Multi-turn Test**：開啟 `enable_prefix_caching=True`，把一份長文件當共同前綴，連問四個問題。Q18 要截圖，並判斷第 2、3、4 輪變快是省了哪一段時間。回想 [KV Cache 那篇](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)的 Prefill 與 Decode，答案就在其中一段。

**KV Cache Invalidation**：同一個 prompt 跑四次：

1. 第一次推論，建立 cache（較慢）。
2. 完全相同的 prompt，cache hit（較快）。
3. 在長文件**之前**多加一個空格，cache miss（較慢）。
4. 在長文件**之後**多加一個空格，cache hit（較快）。

這就是講課時「只有完全相同的前綴才能共用」的實測版。Q19 要截圖，並解釋為什麼一個空格就讓 cache 失效。

**vLLM CPU RAM/Speed Trade-off（TODO）**：把 `OFFLOAD_GB` 設成兩個不同的值（對應 vLLM 的 `cpu_offload_gb`），觀察 KV cache 可用空間與 throughput 的變化。Q20 要截兩種設定的圖，並解釋為什麼把模型權重搬到 CPU 會讓 throughput 變慢。

**怎麼做**：Invalidation 實驗跑完後，自己再加一個 Run 5，把空格加在整個 prompt 的最開頭，預測結果再跑，確認你真的理解命中條件。

## 規定與資源

- 不准抄襲，不准和任何人（PDF 原文是 any living creatures）分享程式或答案。第一次違規該次作業 0 分、學期成績乘 0.9；超過一次學期成績 F。
- 問題先發在 NTU COOL 討論區，也可以寄信到助教信箱，標題要以 `[ML 2026 Spring HW3]` 開頭。助教時間是每週五課前與課後，地點博理 112。
- PDF 參考資料列了 [GenAI-ML 2025 的 HW3](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall-course-data/hw3.pdf)，可以對照前一版作業。

## 延伸閱讀

站上的 [Stanford CS336 推論導讀](/posts/ai/2026-08-22-cs336-inference)有 speculative decoding 與 KV cache 的另一種講法，[CME295 LLM 系統導讀](/posts/ai/2026-09-29-cme295-llm-systems)也整理了推論最佳化；vLLM 本身的架構見 [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)。

## 這一篇可以確認與不能確認的

可以確認：hw3.pdf 全文與內嵌連結、Colab 的 markdown 與程式（模型 ID、TODO 位置、實驗參數）、課程頁的公告日、助教影片的標題與上傳者（YouTube oEmbed）、七篇論文與 FlashAttention-4 的標題（在 arXiv 核對過）。

不能確認：助教影片沒有字幕可抓，本文沒有逐字聽寫，影片中額外的提示沒有寫進來。官方解答沒有公開，本文刻意不提供任何題目的答案。n-gram 加速的實作細節只依 Colab 程式裡的 `prompt_lookup_num_tokens` 參數描述。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [加快生成（下）：KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)｜下一篇 [Positional Embedding 與超長輸入](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [hw3.pdf（ML 2026 Spring HW3：LLM Fast Inference）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw3.pdf)
- [HW3 Colab 起始碼](https://colab.research.google.com/drive/1vZNo6_PlaP2fvMqr3g5KoQA0rN79m24O?usp=sharing)
- [助教影片：ML 2026 Spring HW3 LLM Fast Inference](https://youtu.be/rXfp9Yo5HwU)
- [先備影片：【生成式人工智慧與機器學習導論2025】第3講：解剖大型語言模型](https://youtu.be/8iFvM7WUUs8)
- [【生成式AI導論 2024】第16講：Speculative Decoding](https://youtu.be/MAbGgsWKrg8)
- [Fast Inference from Transformers via Speculative Decoding（arXiv 2211.17192）](https://arxiv.org/abs/2211.17192)
- [Accelerating Large Language Model Decoding with Speculative Sampling（arXiv 2302.01318）](https://arxiv.org/abs/2302.01318)
- [Inference with Reference: Lossless Acceleration of Large Language Models（arXiv 2304.04487）](https://arxiv.org/abs/2304.04487)
- [SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification（arXiv 2305.09781）](https://arxiv.org/abs/2305.09781)
- [FlashAttention（arXiv 2205.14135）](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2（arXiv 2307.08691）](https://arxiv.org/abs/2307.08691)
- [FlashAttention-3（arXiv 2407.08608）](https://arxiv.org/abs/2407.08608)
- [FlashAttention-4: Algorithm and Kernel Pipelining Co-Design for Asymmetric Hardware Scaling（arXiv 2603.05451）](https://arxiv.org/abs/2603.05451)
- [Efficient Memory Management for Large Language Model Serving with PagedAttention（arXiv 2309.06180）](https://arxiv.org/abs/2309.06180)
- [vLLM（GitHub）](https://github.com/vllm-project/vllm)
- [hemingkx/SpeculativeDecodingPapers（GitHub）](https://github.com/hemingkx/SpeculativeDecodingPapers)
- [GenAI-ML 2025 HW3](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall-course-data/hw3.pdf)
