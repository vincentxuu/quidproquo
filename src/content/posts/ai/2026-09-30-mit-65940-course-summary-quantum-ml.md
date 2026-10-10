---
title: "MIT 6.5940 L22–L23 課程總結與量子機器學習：把剪枝、NAS、裝置端訓練搬到量子電路上"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantum-computing, neural-architecture-search, pytorch]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 24
tldr: "MIT 6.5940 Fall 2024 的最後兩講分成兩半。L22 前半是 13 頁的 Course-Summary.pdf：用推論、訓練、特定應用三塊加上 System／Algorithm 兩軸重畫整門課，再交代期末專題的 7 項評分。L22 後半的 Quantum ML Part I 只有錄影、沒有投影片。L23（Hanrui Wang 主講，99 頁）講參數化量子電路（PQC）：資料編碼、parameter-shift 梯度、雜訊下的機率式梯度剪枝（QOC）、TorchQuantum 函式庫，以及用 SuperCircuit 搜尋加閘剪枝的 QuantumNAS。讀起來像把前面學的 supernet 和 magnitude pruning 在量子電路上重演一次。Fall 2026 已把這兩講換成 Guest Lecture。"
description: "MIT 6.5940 Fall 2024 第 22、23 講導讀：Course-Summary.pdf 的三大塊課程架構、相關 MIT 課程地圖、Lab 0–5 清單與期末專題評分；Quantum ML Part II 的 PQC 表達力與糾纏能力、四種資料編碼、finite difference／parameter-shift／backprop 梯度、SPSA 與 barren plateau、量子分類器與 VQE／QAOA、QOC 雜訊感知晶片上訓練與機率式梯度剪枝、TorchQuantum，以及 QuantumNAS 的 SuperCircuit、雜訊自適應演化搜尋與迭代閘剪枝，並對照 Fall 2026 的排程變更。"
draft: false
glossary:
  - term: "參數化量子電路"
    aliases: ["PQC", "Parameterized Quantum Circuit", "variational quantum circuit"]
    definition: "同時包含固定量子閘與帶可調參數（通常是旋轉角度）量子閘的電路。參數可以像神經網路權重一樣用資料訓練，是 VQE、量子神經網路（QNN）、QAOA 等混合古典–量子方法的共同骨架。"
    context: "MIT 6.5940 L23 投影片第 5、77 頁。"
  - term: "parameter-shift rule"
    aliases: ["參數平移法則", "parameter shift"]
    definition: "在量子硬體上計算 PQC 梯度的方法：把某個參數 θ 分別往正、負方向平移一個固定量，各跑一次電路，用兩次結果的差算出該參數的梯度。和 finite difference 不同，它不依賴一個很小的 epsilon。"
    context: "MIT 6.5940 L23 投影片第 27–31 頁。"
  - term: "barren plateau"
    aliases: ["貧瘠高原"]
    definition: "量子電路變大時梯度的變異數急遽下降、梯度幾乎消失的現象，是 PQC 版本的梯度消失問題。"
    context: "MIT 6.5940 L23 投影片第 41–42 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml-en)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 22 講（2024-11-21，Course Summary + Quantum Machine Learning I）與第 23 講（2024-11-26，Quantum Machine Learning II）。主要材料是 [Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)（13 頁）、[Lec23-Quantum-ML-II.pdf](https://www.dropbox.com/scl/fi/wxpnpwkrl6pw7lb4n4vrg/Lec23-Quantum-ML-II.pdf?rlkey=21msd9zdilhry5pydlkvbn7n4&st=aoyc9pzv&dl=0)（99 頁），以及 [L22 錄影](https://youtu.be/svjjD2uthhQ)與 [L23 錄影](https://youtu.be/ZDk-GsyInt8)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影都公開。缺口是 **Quantum ML Part I 沒有投影片**，L22 課頁的 Slides 連結只指向 Course-Summary.pdf，所以本文不寫 Part I 的內容。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)的 Chapter IV 只剩一場 Guest Lecture（12 月 1 日），講題未公布，已經沒有課程總結與量子 ML。

**系列位置**：上一篇 [L21 裝置端訓練](/posts/ai/2026-09-30-mit-65940-on-device-training)｜本篇是系列最後一篇｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

走完 22 講之後，Song Han 用 13 頁投影片把整門課收起來，接著花了一講半講一個看似離題的主題：量子機器學習。本篇先整理課程總結說了什麼，再照 L23 投影片的六個段落走一遍量子 ML。最後回答規劃時的問題：這個主題為什麼收在一門講效率的課最後面。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=svjjD2uthhQ
title: EfficientML.ai Lecture 22: Course Summary + Quantum Machine Learning Part 1（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=ZDk-GsyInt8
title: EfficientML.ai Lecture 23: Quantum Machine Learning Part 2（YouTube）
```

原始影片：[EfficientML.ai Lecture 22: Course Summary + Quantum Machine Learning Part 1（YouTube）](https://www.youtube.com/watch?v=svjjD2uthhQ)、[EfficientML.ai Lecture 23: Quantum Machine Learning Part 2（YouTube）](https://www.youtube.com/watch?v=ZDk-GsyInt8)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## L22 前半：13 頁課程總結

[Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) 很短，但它是整門課唯一一份「俯瞰圖」，值得在開始讀系列之前先翻一遍。

**一句話定位（第 2 頁）。** 這門課介紹讓深度學習能在資源受限裝置上跑的高效 AI 計算技術。學生要親手實作模型壓縮技巧與高效 LLM 推論函式庫，把 Llama2-7B 部署到筆電上。

**三大塊加兩條軸（第 3–7 頁）。** 投影片逐頁疊出一張圖：

| 區塊 | 投影片列出的內容 |
|---|---|
| Efficient Inference | pruning、quantization、neural architecture search、distillation |
| Efficient Training | distributed training、on-device learning、federated learning |
| Application-Specific Optimizations | LLM、VLM、diffusion model |

第 6 頁在圖的左右加上 System 與 Algorithm 兩軸，第 7 頁再標上 EE、CS、AI+D 三個學系。意思是這門課同時站在系統與演算法兩邊。

**相關 MIT 課程（第 8 頁）。** 這頁在三塊周圍列出可以接著修或先修的課。先修是 Computation Structures（6.1910）與 Introduction to Machine Learning（6.3900）。EE 側有 Hardware Architecture for Deep Learning（6.5930）與 Microcomputer Project Lab（6.2060）。CS 側有 Computer System Architecture（6.5900）、Software Performance Engineering（6.1060）、Mobile and Sensor Computing（6.1820）。AI+D 側有 Deep Learning（6.S898）與 Advances in Computer Vision（6.8300）。想自己排延伸學習的人，這頁就是 MIT 內部的官方路線圖。

**講次結構與 lab（第 9–10 頁）。** 第 9 頁把講次分成 Efficient Inference（Pruning、Quantization、NAS、Knowledge Distillation）、Efficient Training（Distributed Training、On-Device Learning、TinyEngine on MCU）、Domain-Specific Optimization（LLM、Diffusion Models、Autonomous Driving）三欄。第 10 頁列出 Lab 0 到 Lab 5：PyTorch 入門、Pruning、Quantization、NAS、LLM Compression、LLM Deployment on Laptop。

注意這裡和[課頁](https://hanlab.mit.edu/courses/2024-fall-65940)的分法不完全一致。課頁排程用四個 Chapter（I Efficient Inference、II Domain-Specific Optimization、III Efficient Training、IV Advanced Topics），總結投影片則是三塊，而且把 TinyEngine on MCU 放在 Efficient Training 欄。本系列的篇目順序跟課頁排程走，四章對應見[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)。

**期末專題（第 11 頁）。** 海報發表在 12 月 3、5、10 日，鼓勵現場 demo。海報與書面報告 12 月 14 日截止：PDF 至少 4 頁、用 NeurIPS 模板、附開源程式碼的 GitHub 連結，建議附 demo 影片。評分表有 7 項，各 10 分：

| Motivation | Technical Soundness | Novelty | Evaluation | Poster Presentation | Written Report | Open Source |
|---|---|---|---|---|---|---|
| 10 | 10 | 10 | 10 | 10 | 10 | 10 |

校外自學的人沒有人幫你打分數，但這張表可以直接拿來自評一個 side project。開源是其中一項，跟 Motivation 同樣 10 分。

**規模與課程評鑑（第 12–13 頁）。** 第 12 頁的長條圖顯示修課人數從 26、89 成長到 222（2022–2024），YouTube 觀看數從 126,515 成長到 240,653。第 13 頁提醒修課生填期末課程評鑑，填完可拿 4 分 participation bonus，這就是課頁評分裡那 4% 的來源。

## L22 後半：Quantum ML Part I 只有錄影

L22 的標題是「Course Summary + Quantum Machine Learning I」，[錄影](https://youtu.be/svjjD2uthhQ)涵蓋兩部分，但課頁只放了 Course-Summary.pdf，Part I 沒有對應的投影片檔。本文只寫有投影片可核對的內容，所以 Part I 的細節請直接看錄影。L23 的投影片從 PQC 開始講，想先補量子計算基礎的人，看完 L22 錄影後半再進 L23 會比較順。

## L23：Quantum ML Part II

L23 由 Hanrui Wang 主講（封面寫 Incoming Assistant Professor, UCLA CS；PhD, MIT）。第 2 頁的 Lecture Plan 有六項，本節照這個順序走。

### 1. 參數化量子電路（PQC）

第 4 頁先把量子機器學習分成四種組合：

| | 古典演算法 | 量子演算法 |
|---|---|---|
| **古典資料** | CC：前面 21 講學的東西 | CQ：這講要介紹的 |
| **量子資料** | QC：qubit 控制、校正、讀出 | QQ：用量子機器處理量子資訊 |

所以這講的範圍是 CQ：資料是古典的，模型是量子電路。

PQC 是「同時有固定閘與參數化閘」的電路（第 5 頁）。怎麼判斷一個 PQC 設計得好不好？投影片給三個角度：

- **表達力（expressivity，第 6–9 頁）**：電路產生的量子態能覆蓋多少 Hilbert space，以偏離均勻分布的程度衡量。
- **糾纏能力（entanglement capability，第 10–13 頁）**：用 Meyer-Wallach measure 衡量一個量子態糾纏多深，範圍 0 到 1，未糾纏是 0、完全糾纏是 1，對電路取平均當作它的糾纏能力。這兩個指標的圖都引自 [Sim et al. 的論文](https://arxiv.org/abs/1905.10876)。
- **硬體效率（第 14 頁）**：設計有沒有考慮 qubit 之間的連接方式、用的閘是不是硬體原生閘。

第三點跟整門課的主旨一致：MACs 少不等於延遲低，電路在紙上漂亮也不等於在真機上跑得好。

**資料編碼（第 15–22 頁）。** 古典資料要先變成量子態。投影片列了四種：

- **Basis encoding**：像二進位，x = 2 對應到 |10⟩。單筆資料很浪費，但可以用疊加同時表示多筆。
- **Amplitude encoding**：把數字放進量子態向量的振幅，N 個特徵只需要 log N 個 qubit。
- **Angle encoding**：把數值當作旋轉閘的角度。
- **Arbitrary encoding**：自己設計一個 PQC，讓輸入資料當旋轉角度。

### 2. PQC 訓練

訓練 PQC 跟訓練神經網路一樣要梯度。第 25–32 頁比較三種算法：

- **Finite difference**（第 25–26 頁）：不管函數結構都能用，但準確度取決於 epsilon 取多大。
- **Parameter-shift**（第 27–31 頁）：把 θ 往兩個方向各平移一次，跑兩次電路算出梯度。第 30–31 頁附了證明。
- **Back-propagation**（第 32 頁）：模擬器裡所有運算都是可微的線性代數，所以可以直接反向傳播，但**只能在古典模擬器上用**。

第 33–37 頁把它們組成一個混合流程：先在量子電路上跑出 f，接著在古典端算 loss，反向傳播得到 ∂Loss/∂f，再用 parameter-shift（或 finite difference）在量子電路上算 ∂f/∂θᵢ，最後用 chain rule 合起來。量子裝置上只需要做前向。

<details>
<summary>訓練技巧：SPSA 與 barren plateau</summary>

第 39–40 頁介紹 SPSA（Simultaneous Perturbation Stochastic Approximation）。投影片的提問是原本的方法要跑幾次電路，答案是 2N（N 個參數各平移兩次）；SPSA 同時擾動所有參數，收斂行為和梯度下降相近。

第 41–42 頁講 barren plateau：電路變大時梯度的變異數急遽下降，相當於量子版的梯度消失。

</details>

### 3. 量子分類器

第 44–45 頁把 PQC 當成量子神經網路做分類，並示範訓練過程。第 46 頁補充 PQC 的其他用途：Variational Quantum Eigensolver（VQE）與 Quantum Approximate Optimization Algorithm（QAOA）。

### 4. 雜訊感知的晶片上訓練（QOC）

這一段開始出現熟悉的味道。問題是：在真實量子硬體上算梯度，雜訊會讓梯度不可靠（第 48 頁），而且**數值小的梯度相對誤差特別大**（第 51 頁以 Santiago、Casablanca 兩台裝置的數據畫出這個趨勢）。

解法叫 probabilistic gradient pruning（第 51–58 頁），出自 [QOC 論文](https://arxiv.org/abs/2202.13239)。訓練時交替兩種窗口：

1. **Accumulation window**：記錄每個參數累積的梯度大小。
2. **Pruning window**：把累積的梯度大小正規化成機率分布，依這個分布跳過一部分梯度的計算。

跳過的主要是小梯度，也就是最不可靠的那些。第 60 頁的結果是分類準確率提升 2%～4%，收斂加快，訓練時間減半。第 61 頁顯示 VQE 上也縮小了量子與古典模擬之間的差距，第 63 頁指出機率式剪枝能帶來更好的結果。

### 5. TorchQuantum

要做這類研究，得先有好用的模擬器。第 66–67 頁列出 [TorchQuantum](https://github.com/mit-han-lab/torchquantum) 的設計目標：在 PyTorch 裡快速模擬量子電路、自動算 PQC 梯度、GPU 加速並支援 batch、有 density matrix 與 state vector 兩種模擬器、動態計算圖、容易組混合古典–量子網路、支援 gate level 與 pulse level 模擬，並能轉換到 IBM Qiskit 等框架。

第 70–72 頁示範 state vector 模擬的寫法。狀態存在 `tq.QuantumDevice` 或 `tq.QuantumState`，套用閘有好幾種寫法：

```python
import torchquantum as tq
import torchquantum.functional as tqf

q_dev = tq.QuantumDevice(n_wires=5)
tqf.h(q_dev, wires=1)        # 函式寫法
h_gate = tq.H()
h_gate(q_dev, wires=3)       # 模組寫法
```

第 73 頁說明 state vector 與量子閘都是用 PyTorch 原生資料結構實作的，模擬就是閘矩陣乘上狀態向量。第 74 頁有 `tq.AmplitudeEncoder()` 與 `tq.PhaseEncoder()` 兩種編碼器，第 75 頁用 `tq2qiskit` 把模型轉成 Qiskit 電路。

### 6. 抗雜訊的量子電路架構搜尋

最後一段是 [QuantumNAS](https://arxiv.org/abs/2107.10845)。第 78–79 頁點出兩個挑戰：雜訊會讓參數越多的電路在無雜訊時越準、實測時反而越差，所以電路架構很關鍵；而閘的種類、數量、位置組成的設計空間又很大。

第 81 頁把 QuantumNAS 拆成四步：

1. 建構並訓練 SuperCircuit
2. 雜訊自適應演化搜尋，同時找 SubCircuit 與 qubit mapping
3. 訓練搜出來的 SubCircuit
4. 迭代式量子閘剪枝

SuperCircuit 是設計空間裡閘最多的電路，每個候選 SubCircuit 都是它的子集（第 82 頁）。SubCircuit 直接繼承 SuperCircuit 的參數，不必各自訓練；投影片指出用繼承參數排出來的好電路，從頭訓練後也是好電路（第 83、86 頁）。每一步訓練抽一個子集、只更新子集的參數（第 84–85 頁）。第 87 頁在目標裝置上搜尋最佳 SubCircuit 與 qubit mapping。

剪枝那一步（第 88–92 頁）的理由是：旋轉角度接近 0 的閘對結果影響很小，所以迭代地剪掉小角度的閘，再 fine-tune 剩下的參數。

第 93–98 頁簡介其他搜尋框架：用 graph transformer 估計電路保真度的 [QuEst](https://arxiv.org/abs/2210.16724)、neural predictor、強化學習、可微分搜尋等。

## 為什麼量子 ML 收在最後

投影片沒有明說理由。以下是對照前面篇目後的讀法：L23 的後三段幾乎是把這門課的工具換到量子電路上再用一次。

| L23 的做法 | 前面對應的講次 |
|---|---|
| QuantumNAS 的 SuperCircuit、繼承參數、演化搜尋 | [L8 hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware) 的 Once-for-All 與繼承權重、[Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 的 evolutionary search |
| 剪掉角度接近 0 的閘，再 fine-tune | [L3 pruning](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria) 的 magnitude-based pruning 與 iterative pruning |
| 搜尋時一起考慮 qubit mapping 與原生閘 | [L4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support) 的硬體支援、L8 的「MACs 不等於延遲」 |
| 在雜訊硬體上直接訓練、跳過不可靠的梯度 | [L21 裝置端訓練](/posts/ai/2026-09-30-mit-65940-on-device-training)：在受限硬體上訓練 |

換句話說，這講適合當作期末複習：如果你能說出 QuantumNAS 每一步對應前面哪一講，這門課的核心工具就算掌握了。

## Fall 2026 對照

[F26 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)的排程在 11 月 30 日標 Chapter IV: Advanced Topics，12 月 1 日是 Lecture 22 Guest Lecture，之後直接進入期末專題發表（12 月 3、8、10 日）。課程總結與兩講量子 ML 都不在 F26 排程上，Guest Lecture 的講者與題目截至 2026-09-30 未公布。想讀量子 ML 這段，只能用 F24 的材料。

## 讀完這講可以做什麼

- **今晚能做的事**：打開 [Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) 第 11 頁的評分表，拿自己手上一個 side project 逐項打分。7 項裡最常拿不到分的通常是 Evaluation 與 Open Source。
- 對量子 ML 有興趣：clone [TorchQuantum](https://github.com/mit-han-lab/torchquantum)，照 L23 第 70–72 頁建一個 5 條線的 `QuantumDevice`，套上 H 閘，印出狀態向量確認結果。
- 想回頭把整門課串起來：從[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)的三條閱讀路線挑一條重讀。

## 延伸閱讀

- 系列入口與四章地圖：[MIT 6.5940 導讀總覽](/posts/ai/2026-09-30-mit-65940-course-overview)
- NAS 的搜尋空間與搜尋策略：[L7 NAS Part I](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)
- 各校公開課程與 A0–A3 存取分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L22／L23 日期、投影片與錄影連結、四個 Chapter 的排程
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Chapter IV 改為 12 月 1 日 Guest Lecture
- [Course-Summary.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) — 課程架構、相關課程、lab 清單、期末專題評分
- [Lec23-Quantum-ML-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/wxpnpwkrl6pw7lb4n4vrg/Lec23-Quantum-ML-II.pdf?rlkey=21msd9zdilhry5pydlkvbn7n4&st=aoyc9pzv&dl=0) — 本文 L23 所有頁碼與結果的出處
- [EfficientML.ai Lecture 22: Course Summary + Quantum Machine Learning Part 1（YouTube）](https://youtu.be/svjjD2uthhQ)
- [EfficientML.ai Lecture 23: Quantum Machine Learning Part 2（YouTube）](https://youtu.be/ZDk-GsyInt8)
- [mit-han-lab/torchquantum（GitHub）](https://github.com/mit-han-lab/torchquantum)
- [Wang et al., QuantumNAS: Noise-Adaptive Search for Robust Quantum Circuits（arXiv 2107.10845）](https://arxiv.org/abs/2107.10845)
- [Wang et al., QOC: Quantum On-Chip Training with Parameter Shift and Gradient Pruning（arXiv 2202.13239）](https://arxiv.org/abs/2202.13239)
- [Sim et al., Expressibility and entangling capability of parameterized quantum circuits for hybrid quantum-classical algorithms（arXiv 1905.10876）](https://arxiv.org/abs/1905.10876) — L23 表達力與糾纏能力圖的出處
- [Wang et al., QuEst: Graph Transformer for Quantum Circuit Reliability Estimation（arXiv 2210.16724）](https://arxiv.org/abs/2210.16724)
