---
title: "高效 AI：從模型壓縮到硬體部署的學習路線｜MIT 6.5940 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantization, edge-ai, llm-inference]
lang: zh-TW
math: true
series:
  name: "MIT 6.5940 導讀"
  order: 0
tldr: "MIT 6.5940 教怎麼讓模型變小、變快、塞進筆電與微控制器，分四章：高效推論（pruning、quantization、NAS、distillation、MCUNet 與 TinyEngine）、特定領域最佳化（LLM 部署與後訓練、長上下文、ViT、diffusion）、高效訓練（分散式與裝置端訓練），以及量子 ML。同時講演算法與系統，最後要把 Llama2-7B 跑在自己的筆電上。本系列以 Fall 2024 為主幹，23 講的錄影與 Lab 0–5 都公開，投影片只缺第 22 講的量子 ML 部分。"
description: "MIT 6.5940 系列入口：四章各講在學什麼、一個手算 LLM 記憶體與 4-bit 線性量化的例子、先備與自我檢查、三條閱讀路線與校外拿得到的材料，以及 25 篇的系列目錄。"
draft: false
glossary:
  - term: "sabbatical"
    aliases: ["學術休假"]
    definition: "教授暫停授課一段時間做研究的休假制度。"
    context: "6.5940 在 Fall 2025 因 Song Han 休假停開，所以本系列以 Fall 2024 為主幹。"
  - term: "EfficientML.ai"
    aliases: ["efficientml.ai"]
    definition: "MIT 6.5940 的課程品牌與網址，實際導向 MIT HAN Lab 的課程頁；每講錄影標題也以「EfficientML.ai Lecture N」開頭。"
    context: "本系列引用的投影片封面與錄影標題都用這個名字。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**影片狀態：已附影片。** 導言附第 1 講錄影（1 小時 6 分），各講錄影在各篇導讀。[影片來源與說明](#課程影片來源)

[MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940)（TinyML and Efficient Deep Learning Computing）是 [Song Han](https://songhan.mit.edu) 開的研究所課，課程網址 [efficientml.ai](https://efficientml.ai)。它處理一個很實際的問題：模型長得比硬體快。雲端 GPU 有 80GB 記憶體，微控制器只有幾百 KB，要怎麼把模型壓小、加速，放進筆電、手機和微控制器？

這門課和一般深度學習課最大的不同，是同時講演算法和系統：剪掉哪些權重、用幾個位元存數字，是演算法的問題；剪完能不能真的變快、記憶體怎麼排，是系統的問題。兩邊都要對，模型才會在硬體上真的變小變快。課程的實作目標很具體：把 Llama2-7B 部署到自己的筆電上。

這篇是系列入口：先講四章各講在學什麼，再手算一次 LLM 的記憶體與 4-bit 量化，最後給先備檢查與閱讀路線。下面是第 1 講錄影，講為什麼需要高效 AI，以及整門課的地圖，和本文「主線」一節講的是同一張地圖；可以先看影片再讀，或讀完再看。

```youtube
url: https://www.youtube.com/watch?v=U7EPZv8Kh9w
title: EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)
```

## 主線：量尺加四章

### 量尺（第 1–2 講）

[第 1–2 講](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)先給量尺：記憶體看參數量、模型大小與峰值 activation，運算看 MAC 與 FLOP。AlexNet 有 61M 參數、724M MACs；在微控制器上，真正先爆掉的常常是 activation，不是參數。後面每一講都用這些量尺衡量「省了多少」。

### 第一章：高效推論（第 3–11 講）

- **Pruning**（[第 3 講](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)、[第 4 講](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support)）：把不重要的權重拿掉。剪得越規則（整個 channel）越容易在硬體上變快，但能剪的比例越小；介於中間的 2:4 sparsity 在 NVIDIA Ampere GPU 上最多快 2 倍。每層剪多少用敏感度分析決定，剪完用小學習率 fine-tune。
- **Quantization**（[第 5 講](/posts/ai/2026-09-30-mit-65940-quantization-basics)、[第 6 講](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)）：用更少的位元存數字。線性量化 $r = S(q - Z)$ 讓矩陣乘法改用整數運算；精度掉了，先換更細的 scale 粒度（per-channel、group）或裁掉離群值，不夠再用 QAT 重訓。
- **NAS**（[第 7 講](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)、[第 8 講](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware)）：第 7 講先看人工設計的架構怎麼省運算，例如 ResNet 的 bottleneck 先用 1×1 卷積把通道數降下來再做 3×3，比直接在 2048 通道上做少 8.5 倍 MAC；接著讓搜尋代替人工，在深度、寬度、解析度、kernel size 組成的搜尋空間裡，用隨機、強化學習、梯度或演化找出又小又準的架構。第 8 講處理最貴的一步：評估候選架構。Once-for-All 一次訓練一個超網路，裡面的 $10^{19}$ 個子網路不用再各自訓練。
- **Distillation**（[第 9 講](/posts/ai/2026-09-30-mit-65940-knowledge-distillation)）：讓小模型學大模型的輸出分布。溫度調高後，老師「貓 vs 狗」的輸出從 0.982／0.017 變成 0.599／0.401，小模型才學得到類別之間的相似度。
- **TinyML**（[第 10 講](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml)、[第 11 講](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)）：微控制器的 SRAM 只有約 256–320kB。MCUNet 先挑搜尋空間再搜子網路，patch-based inference 把峰值記憶體從 1372kB 壓到 172kB；TinyEngine 在系統層再榨一次：調整迴圈順序與分塊（loop reordering、tiling）讓資料留在快取裡，in-place depthwise 讓輸出直接覆寫輸入、省下一份 activation 記憶體。

### 第二章：特定領域最佳化（第 12–18 講）

- **LLM**（[第 12 講](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)、[第 13 講](/posts/ai/2026-09-30-mit-65940-llm-deployment)）：attention 是 $O(N^2)$，KV cache 隨長度線性長大，GQA 與 MQA 讓多個 head 共用 KV。部署分三條路：量化（SmoothQuant 把 activation 的離群值難度搬到權重，AWQ 用縮放保護約 1% 的重要權重做 4-bit）、稀疏（只用一部分參數或 token）、serving（PagedAttention、speculative decoding）。
- **後訓練與長上下文**（[第 14 講](/posts/ai/2026-09-30-mit-65940-llm-post-training)、[第 15 講](/posts/ai/2026-09-30-mit-65940-long-context-llm)）：LoRA 用可併回權重的低秩分支微調，QLoRA 再把主幹量化成 4-bit；StreamingLLM 發現開頭幾個 token 是 attention sink，保留它們加最近的視窗就能穩定生成很長的文字。
- **視覺與生成**（[第 16–17 講](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud)、[第 18 講](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency)）：ViT 的成本隨解析度平方成長，window attention 與 linear attention 把它壓下來；第 17 講針對三種冗餘：GAN 的生成器在空間上做很多重複的運算（GAN Compression 用蒸餾加 NAS 決定每層要留幾個 channel）、影片相鄰幀幾乎一樣（TSM 只把特徵沿時間軸位移，不增加 FLOPs 就能建模時間）、點雲大多是空的（只在有點的地方計算）。diffusion 慢在要跑幾十到上千步，加速方法是少跑幾步、每步少算、多卡分攤。

### 第三章：高效訓練（第 19–21 講）

[第 19–20 講](/posts/ai/2026-09-30-mit-65940-distributed-training)：GPT-3 的 fp16 權重就要 350GB，一張 80GB 的卡放不下，所以要切：資料平行、ZeRO 把優化器狀態分散到各卡、pipeline 與 tensor parallelism，再處理切完之後的通訊瓶頸（梯度壓縮）。[第 21 講](/posts/ai/2026-09-30-mit-65940-on-device-training)在裝置上訓練：訓練比推論貴，是因為要存 activation；做法有只調 bias 加輕量殘差（TinyTL）、只更新重要的層與通道（sparse update），PockEngine 再把這些和 int8 訓練、編譯期最佳化疊在一起，在 256KB 的微控制器上把訓練記憶體壓到 141KB。

### 第四章：總結與量子 ML（第 22–23 講）

[最後一篇](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml)用推論、訓練、特定應用三塊加上演算法／系統兩軸重畫整門課，再把前面學的超網路與 magnitude pruning 在量子電路上重演一次。

## 手算一次：Llama2-7B 怎麼塞進 8GB 筆電

這是本文的教學例子，用來看第 2 講的量尺和第 5、13 講的量化怎麼接起來。

**先算記憶體。** Llama2-7B 約 70 億個參數。用 fp16 存，每個參數 2 bytes，光權重就是 $7 \times 10^9 \times 2 = 14$ GB。課程 Lab 5 的最低需求是 8GB 記憶體的筆電，放不下。改用 4-bit，每個參數 0.5 byte，權重剩 $7 \times 10^9 \times 0.5 = 3.5$ GB，再加上 KV cache 和執行時的 activation，仍有機會放進 8GB。

**再量化一個數。** 用對稱的 4-bit 量化（$Z = 0$；4-bit 整數範圍是 −8 到 7，這裡捨棄 −8、只用 −7 到 7，讓正負對稱），某組權重的最大絕對值是 1，所以 scale $S = 1/7 \approx 0.143$。權重 0.3 量化成 $q = \text{round}(0.3 / 0.143) = \text{round}(2.1) = 2$，還原回 $2 \times 0.143 \approx 0.286$，誤差約 0.014。

**離群值的問題。** 如果同一組裡有一個權重是 8，scale 變成 $8/7 \approx 1.143$。這時 0.3 量化成 $\text{round}(0.26) = 0$，整個資訊都不見了，組裡其他小權重也一樣。

**這個例子的意思：** 4-bit 把記憶體壓到四分之一，但一個離群值就能讓整組小數值全變成 0。第 6 講的 per-channel、group 量化把 scale 切細，讓離群值只影響自己那一組；第 13 講的 AWQ 和 SmoothQuant 則是專門處理 LLM 裡的離群值。量化不只是「少用幾個位元」，難的是決定誰共用一個 scale。

## 先備與自我檢查

- **Python 與 PyTorch**：Lab 0 就是 PyTorch 教學，跟不上先補。
- **反向傳播與 CNN**：第 2 講只複習術語和層的形狀，不教訓練原理。沒學過的話先讀 [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)或 [CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)。
- **計算機結構的基本概念**：先修 6.191 是計算機結構課，後面的 TinyEngine、SIMD、記憶體階層都會用到。
- **一個 Google 帳號**：Lab 0–4 都在 Colab 上跑；Lab 5 要在自己的電腦上跑（macOS、Linux 或 Windows，8GB 記憶體、5GB 可用空間）。

讀完這篇，試著回答：

1. 為什麼 channel pruning 比 fine-grained pruning 容易在 GPU 上真的變快？
   答：剪掉整個 channel 後，矩陣直接變小，一般的密集運算就能加速；任意位置的零需要專門的稀疏硬體或 kernel 才省得到時間。
2. Llama2-13B 用 4-bit 存，權重大約多大？
   答：$13 \times 10^9 \times 0.5 = 6.5$ GB。
3. 上面的例子如果改成 8-bit（整數用 −127 到 127），0.3 量化後還原成多少？
   答：同樣捨棄最小值、用 −127 到 127，$S = 1/127$，$q = \text{round}(38.1) = 38$，還原約 0.299，誤差約 0.001。
4. 知識蒸餾為什麼要把溫度調高？
   答：溫度高會把老師的輸出分布攤平，小模型才看得到「錯的類別裡哪個比較像」這種資訊。
5. 在微控制器上跑模型，為什麼常常是 activation 而不是參數先爆掉？
   答：參數可以放在 Flash，activation 要放在小得多的 SRAM 裡，而且峰值出現在解析度最高的前幾層。

## 怎麼讀：路線與材料

本系列以 Fall 2024 為主幹：Fall 2025 因 Song Han 休假停開，Fall 2024 是最近一屆完整的學期，23 講的錄影與 Lab 0–5 都公開，投影片只缺第 22 講的量子 ML 部分。課程沒有考試，評分是 5 個 lab 共 75% 加期末專題 25%；lab 沒有公開解答，要自己對照講義與 notebook 的檢查點。Fall 2026 正在上，每篇另有「Fall 2026 對照」一節；它的 Lab 1 換成 GPU profiling，本系列另寫成一篇補充篇。Fall 2026 的 lab 清單對 Lab 2 是 pruning 還是 quantization 前後寫得不一致，想練 pruning 先用 Fall 2024 的 Lab 1。

**完整路線。** 照 order 0–24 讀，每篇配該講的投影片與錄影，lab 篇讀完就動手。Fall 2024 的 lab 排程是每兩到三講一個，照這個節奏大約一學期。

**只想做 LLM 效率。** 讀 order 1（量尺）→ 5、6（量化基礎，AWQ 的前置知識）→ 14 → 15 → 16 → 18 → 19（想看 GPU 層的量測再加 17）。Pruning 與 NAS 可以先跳過，遇到 LLM 稀疏化時再回頭讀 order 2。

**TinyML 與邊緣裝置。** 讀 order 1 → 2、3、4 → 5、6、7 → 8、9、10 → 12 → 13 → 23。這條線就是第一章加裝置端訓練，重點在 KB 級記憶體限制下的設計。

## 系列目錄

本系列共 25 篇。篇數比講次多，是因為 pruning、quantization、NAS 三個 lab 題量大，各自獨立成篇。

| order | 篇目 | 對應材料 |
|---|---|---|
| 0 | 本篇：系列入口 | 兩屆課頁 |
| 1 | [為什麼要高效、怎麼量模型大小與運算量](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics) | L1、L2、Lab 0 |
| 2 | [Pruning I：剪枝的粒度與準則](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria) | L3 |
| 3 | [Pruning II：每層剪多少、硬體怎麼支援](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support) | L4 |
| 4 | [Lab 1：fine-grained 與 channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning) | F24 Lab 1 |
| 5 | [Quantization I：數字格式與基本量化](/posts/ai/2026-09-30-mit-65940-quantization-basics) | L5 |
| 6 | [Quantization II：PTQ、QAT 與混合精度](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat) | L6 |
| 7 | [Lab 2：k-means 與 linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization) | F24 Lab 2 |
| 8 | [NAS I：搜尋空間與搜尋策略](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy) | L7 |
| 9 | [NAS II：hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware) | L8 |
| 10 | [Lab 3：在限制下搜子網路](/posts/ai/2026-09-30-mit-65940-lab3-nas) | F24 Lab 3 |
| 11 | [Knowledge Distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation) | L9 |
| 12 | [MCUNet：在微控制器上跑神經網路](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml) | L10 |
| 13 | [TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing) | L11 |
| 14 | [Transformer 與 LLM 橋接篇](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer) | L12 |
| 15 | [LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment) | L13 |
| 16 | [Lab 4＋Lab 5：AWQ 與筆電上的 LLM](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop) | F24 Lab 4、Lab 5 |
| 17 | [Fall 2026 補充：Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics) | F26 Lab 1 |
| 18 | [LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training) | L14 |
| 19 | [長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm) | L15 |
| 20 | [高效視覺：ViT、GAN、影片、點雲](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud) | L16、L17 |
| 21 | [Diffusion 加速](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency) | L18 |
| 22 | [分散式訓練](/posts/ai/2026-09-30-mit-65940-distributed-training) | L19、L20 |
| 23 | [裝置端訓練](/posts/ai/2026-09-30-mit-65940-on-device-training) | L21 |
| 24 | [課程總結與量子 ML](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml) | L22、L23 |

## 今晚可以做的事

1. 打開 [Lab 0 的 Colab](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)，跑完 PyTorch 教學。
2. 把「手算一次」的記憶體換成你自己的筆電記憶體算一次：哪個大小的 LLM 用 4-bit 放得下？
3. 讀[第 1–2 講導讀](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)。

## 延伸閱讀

- [MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map)：6.5940 在 MIT 課程體系裡的位置
- [Stanford CS336 導讀：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)、[推論](/posts/ai/2026-08-22-cs336-inference)：從語言模型訓練課的角度看硬體與推論
- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CME295 導讀](/posts/ai/2026-09-29-cme295-course-overview)：Transformer 與 LLM 的完整原理
- [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)：ViT 與電腦視覺
- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)：diffusion 與 flow matching 的理論

**系列導覽**：下一篇 [為什麼要高效、怎麼量模型大小與運算量](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)

## 課程影片來源

本文是課程總覽，導言嵌入 Fall 2024 第 1 講錄影；其餘各講錄影附在各篇導讀，也可以從官方課頁或 [live.efficientml.ai](https://live.efficientml.ai/) 查找。Fall 2024 課頁列有第 1–23 講的公開錄影，期末專題發表沒有錄影。

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)
- [mit-6-5940 Fall 2026 — official course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [第 1 講錄影](https://www.youtube.com/watch?v=U7EPZv8Kh9w)（導言嵌入，1 小時 6 分）

查核日期：2026-10-14。

## 更新紀錄

- 2026-10-14：正文改寫成導讀：四章逐講講出機制，補 LLM 記憶體與 4-bit 量化的手算例子與自我檢查，導言嵌入第 1 講錄影；兩屆比較、公開程度、評分與 lab 結構縮成閱讀路線裡的一段。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)
- [MIT 6.5940 Fall 2023 課頁](https://hanlab.mit.edu/courses/2023-fall-65940)
- [EfficientML.ai 錄影入口（MIT HAN Lab YouTube）](https://live.efficientml.ai/)
- [Fall 2024 Lecture 1 投影片：Introduction](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Fall 2024 Course Summary 投影片](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)
- [Fall 2026 Lecture 1 投影片：Introduction](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)
- [Fall 2026 Lab 1 壓縮檔（lab1_gpu_basics.zip）](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1)
- [Fall 2024 期末專題題目清單](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA)
- [Fall 2024 Lab 0：PyTorch Tutorial（Colab）](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [Fall 2024 Lab 5 資料夾（Google Drive）](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0)
