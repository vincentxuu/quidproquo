---
title: "MIT 6.5940 L1–L2＋Lab 0：模型「大」要怎麼量？參數、activation、MAC 與 latency 各在量什麼"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, deep-learning, cnn, pytorch, edge-ai]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 1
tldr: "6.5940 的前兩講先證明問題存在，再給量尺。L1 用一張圖說明模型參數量的成長遠快於 GPU 記憶體，並指出雲端 GPU 有 80GB 記憶體、微控制器只有 320kB。L2 把效率指標分成記憶體與運算兩類：#Parameters、model size、peak activations，以及 MAC、FLOP、OP。以 AlexNet 為例，它有 61M 參數、724M MACs；在微控制器上真正先爆掉的常常是 activation，不是參數。Lab 0 用 CIFAR-10 上的 VGG 變體（9.2M 參數、606M MACs）當之後幾個 lab 的起點。"
description: "MIT 6.5940 Fall 2024 第 1–2 講與 Lab 0 導讀：效率為什麼是問題、雲端到微控制器的硬體落差、FC／Conv／Grouped／Depthwise 層的參數量與 MAC 公式、peak activation、FLOP 與 FLOPS 的差別、latency 與 throughput，並對照 Fall 2026 多出的 CNN 架構回顧與 Lab 0 題目。"
draft: false
glossary:
  - term: "MAC"
    aliases: ["multiply-accumulate", "MACs"]
    definition: "乘加運算 a ← a + b·c，算一次乘法加一次累加。一個 MAC 等於 2 個 FLOP。"
    context: "6.5940 L2 用 MAC 當運算量的主要單位，AlexNet 共 724M MACs。"
  - term: "peak activation"
    aliases: ["峰值 activation", "Peak #Activations"]
    definition: "推論過程中同一時間必須放在記憶體裡的中間特徵最大量，通常約等於某一層的輸入加輸出。"
    context: "L2 引 MCUNet 的資料指出，在微控制器上的記憶體瓶頸是 activation，不是參數。"
  - term: "FLOPS"
    aliases: ["FLOP/s"]
    definition: "每秒可做的浮點運算數，是硬體速度的單位；FLOP（或複數 FLOPs）則是模型的運算量。"
    context: "L2 第 74 頁用 FLOPS = FLOPs / second 區分兩者。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列的第 1 篇，依據 Fall 2024 版。為什麼不用 Fall 2026，[系列入口](/posts/ai/2026-09-30-mit-65940-course-overview)有說明。

本篇涵蓋的官方材料：

- Lecture 1 Introduction：[投影片](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)（93 頁）、[錄影](https://youtu.be/U7EPZv8Kh9w)
- Lecture 2 Basics of Neural Networks：[投影片](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0)（77 頁）、[錄影](https://youtu.be/I0nKjPpZmMU)
- [Lab 0：PyTorch Tutorial](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)（Colab）

以下頁碼都是 PDF 的頁數，投影片角落印的頁碼有時差一兩頁。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=U7EPZv8Kh9w
title: EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)
```

```youtube
url: https://www.youtube.com/watch?v=I0nKjPpZmMU
title: EfficientML.ai Lecture 2 - Basics of Neural Networks (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=U7EPZv8Kh9w)、[EfficientML.ai Lecture 2 - Basics of Neural Networks (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=I0nKjPpZmMU)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：抽樣核對兩支影片。L1 的開場、HAN Lab 專案預告（含微控制器偵測、TinyChat、AWQ、Jetson Orin、BEVFusion）與課務；L2 的神經網路術語、參數量與 model size、activation 才是記憶體瓶頸、MAC／FLOP、latency 與 throughput、AlexNet 逐層計算。主題與講次都和本文對應，沒發現矛盾。頁碼與投影片數字以投影片為準，未逐句比對影片。

## 問題：模型長得比硬體快

第一講開頭（第 3 頁）是一張雙線圖。一條線是語言模型的參數量：Transformer 0.05B、BERT 0.34B、GPT-2 1.5B、GPT-3 175B、MT-NLG 530B。另一條是 GPU 記憶體：從 V100 的 32GB 到 A100 的 80GB。兩條線越拉越開，圖上的註解是「Model compression bridges the gap」。第二講第 3 頁把這個落差講成一句話：摩爾定律大約每兩年 2 倍，深度學習模型每兩年 4 倍。

雲端之外，落差更大。第一講第 78 頁比較三種平台：

| 平台 | Activation 記憶體 | 權重儲存 |
|---|---|---|
| Cloud AI | 80GB | ~TB/PB |
| Mobile AI | 4GB | 256GB |
| Tiny AI（微控制器） | 320kB | 1MB |

雲端 GPU 和微控制器的記憶體差了五個數量級。這門課後面講的 pruning、quantization、NAS、MCUNet，都在處理同一個問題：怎麼把模型塞進右邊那兩欄。

第一講中段用大量 HAN Lab 的研究當例子，包括手機上的影像辨識、微控制器上的人物偵測（MCUNet）、EfficientViT-SAM、GAN Compression、TinyChat，以及用 AWQ 量化在 Jetson Orin 上跑 LLaMA-2。這些研究之後各有專講，這裡先當預告看就好。最後一頁（第 93 頁）列了課程目標：認識深度學習運算的關鍵效率指標、會在資源受限的平台上加速推論與訓練、理解不同最佳化技術之間的取捨，以及親手把 LLM 部署到筆電上。

## 第二講的四件事

第二講第 5 頁的 Lecture Plan 列了四項：

1. 複習神經網路術語：neuron、synapse、activation、feature、weight、parameter
2. 複習常見的層：fully-connected、convolution、grouped convolution、depthwise convolution、pooling、normalization、transformer
3. 介紹效率指標：#Parameters、Model Size、Peak #Activations、MAC、FLOP、FLOPS、OP、OPS、Latency、Throughput
4. Lab 0：PyTorch 教學

術語這段只有一個重點要記：課程之後講「剪 synapse」就是剪權重，「剪 neuron」就是剪掉整個輸出通道。這兩個對應在下一講的 pruning 會一直出現。

Transformer 在這一講只佔兩頁（第 39–40 頁），投影片寫明完整架構留到第 12 講。

## 層的形狀決定一切

後面每一個指標都從張量形狀算出來，所以要先把符號記熟。投影片用的符號是：n 為 batch size，cᵢ、cₒ 為輸入與輸出通道數，hᵢ／wᵢ、hₒ／wₒ 為輸入與輸出的高寬，k_h、k_w 為 kernel 高寬，g 為 group 數。

| 層 | 權重形狀 | 說明 |
|---|---|---|
| Fully-connected | (cₒ, cᵢ) | 每個輸出連到所有輸入 |
| 2D Convolution | (cₒ, cᵢ, k_h, k_w) | 每個輸出只連到 receptive field 內的輸入，權重共享 |
| Grouped Convolution | (g·cₒ/g, cᵢ/g, k_h, k_w) | 通道切成 g 組，各組分開做較窄的卷積 |
| Depthwise Convolution | (c, k_h, k_w) | g = cᵢ = cₒ，每個通道一個獨立的 filter |
| Pooling | 無 | 沒有可學參數，通常 stride 等於 kernel 大小 |

卷積的輸出大小公式是 hₒ = (hᵢ + 2p − k_h) / s + 1，其中 p 是 padding、s 是 stride（第 33 頁）。第 32 頁還給了 receptive field 的算法：L 層、kernel 大小 k 的卷積，receptive field 是 L·(k − 1) + 1。所以大影像需要很多層才能「看到」整張圖，網路內部才要 downsample。

Normalization 那頁（第 37 頁）把 Batch Norm、Layer Norm、Instance Norm、Group Norm 畫成同一個公式，差別只在「對哪一組像素算平均與標準差」。之後講 pruning 時會用到 Batch Norm 的縮放係數 γ。

## 效率指標：兩大類

第 42 頁把效率指標分成兩類：

- **記憶體相關**：#parameters、model size、total／peak #activations
- **運算相關**：MAC、FLOP／FLOPS、OP／OPS

兩類再共同決定 latency 與 energy。下面依序看。

### #Parameters 與 model size

參數量就是權重張量的元素個數（bias 忽略）：

| 層 | #Parameters |
|---|---|
| Linear | cₒ·cᵢ |
| Convolution | cₒ·cᵢ·k_h·k_w |
| Grouped Convolution | cₒ·cᵢ·k_h·k_w / g |
| Depthwise Convolution | cₒ·k_h·k_w |

投影片用 AlexNet 逐層算（第 56 頁），總共約 61M 參數。最大的一層是第一個全連接層：4096 × (256×6×6) = 37,748,736，一層就佔六成。

Model size 是儲存權重需要的空間。所有權重用同一種資料型別時，model size = #Parameters × bit width（第 58 頁）。AlexNet 用 32-bit 儲存約 244MB，改用 8-bit 就只剩 61MB。這就是第 5–6 講 quantization 的起點。

### #Activations：真正的瓶頸常在這裡

第 60 頁的標題是：「#Activation is the memory bottleneck in CNN inference, not #Parameters」。

投影片引用 [MCUNet](https://arxiv.org/abs/2007.10319) 的比較。ResNet-18 與 MobileNetV2-0.75 的 ImageNet top-1 準確率都約 70%。MobileNetV2 的參數量少了 4.6 倍，但 peak activation 沒有跟著變小（第 61 頁的標題是「#Activation didn't improve from ResNet to MobileNet-v2」）。第 62 頁畫出 MobileNetV2 每個 block 的記憶體用量：峰值 1372kB，微控制器的限制是 256kB，而且峰值集中在前面幾個 block。

訓練時情況更明顯。第 63 頁引 [TinyTL](https://arxiv.org/abs/2007.11622)：從 ResNet-50 換到 MobileNetV2-1.4，參數量少了 4.3 倍，activation 記憶體只少 1.1 倍。

AlexNet 的例子（第 65 頁）示範兩種算法：

- **Total #activations**：所有層的輸出特徵加總，AlexNet 為 932,264
- **Peak #activations**：約等於某一層的輸入加輸出。AlexNet 的峰值在第一個卷積層：輸入 3×224×224 = 150,528，輸出 96×55×55 = 290,400，合計 440,928

AlexNet 的參數主要在全連接層，activation 卻集中在前面的卷積層。兩個指標在不同地方爆，這是本篇最值得記住的一件事。

### MAC、FLOP、OP

一個 MAC 是 a ← a + b·c。矩陣乘向量的 MAC 數是 m·n，矩陣乘矩陣是 m·n·k（第 67 頁）。

<details>
<summary>各層的 MAC 公式（batch size = 1，忽略 bias）</summary>

| 層 | MACs |
|---|---|
| Linear | cₒ·cᵢ |
| Convolution | cᵢ·k_h·k_w·hₒ·wₒ·cₒ |
| Grouped Convolution | cᵢ/g·k_h·k_w·hₒ·wₒ·cₒ |
| Depthwise Convolution | k_h·k_w·hₒ·wₒ·cₒ |

卷積的 MAC 等於參數量乘上輸出特徵圖的面積 hₒ·wₒ，因為同一組權重要在每個輸出位置重複用一次。

</details>

AlexNet 總共 724M MACs（第 72 頁）。跟參數量對照：第一個卷積層只有 96×3×11×11 = 34,848 個參數（第 56 頁印成 24,848，照乘式算是 34,848），卻有 105,415,200 個 MAC；第一個全連接層有 37.7M 參數，MAC 數也是 37.7M。卷積層參數少、運算多，全連接層參數多、運算少。

接下來的三個名詞最容易混：

- **FLOP**：一次乘法算一個浮點運算，一次加法也算一個，所以 1 MAC = 2 FLOP。AlexNet 約 724M × 2 = 1.4G FLOPs（第 74 頁）
- **FLOPS**：每秒可做的浮點運算數，FLOPS = FLOPs / second。這是硬體的速度，不是模型的運算量
- **OP／OPS**：activation 與權重不一定是浮點數（量化後可能是整數），所以用 OP 泛指運算數，OPS 是每秒運算數（第 75 頁）

FLOP 與 FLOPS 只差一個 S，一個描述模型、一個描述硬體。論文與硬體規格表常混用，讀的時候要看上下文。

### Latency 與 throughput

Latency 是完成一個任務的延遲，throughput 是單位時間處理的資料量。第 45 頁用兩個設計對比：

| | Latency | Throughput |
|---|---|---|
| 設計 1 | 50 ms | 20 image/s |
| 設計 2 | 100 ms | 40 image/s |

設計 2 的延遲比較長，吞吐量卻比較高。投影片留了兩個問題：高 throughput 是否代表低 latency？低 latency 是否代表高 throughput？答案是兩者都不必然，平行處理可以提高 throughput，但單一任務不會因此變快。

第 46 頁給了一個估算 latency 的式子：

> Latency ≈ max(T_computation, T_memory)

T_computation 約等於模型的運算數除以處理器每秒可做的運算數；T_memory 約等於搬權重和搬 activation 的時間，分別是 model size 與 activation 大小除以記憶體頻寬。取最大值的前提是運算與搬資料可以重疊，Fall 2026 版第 51 頁把這點畫成了時序圖。這個式子把前面所有指標串起來：參數和 activation 決定 T_memory，MAC 決定 T_computation。

### Energy：搬資料比算更貴

[第 47 頁](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0)引用 Horowitz 在 ISSCC 2014 的資料，列出 45nm 製程下各種操作的能耗：32-bit 整數加法 0.1 pJ、32-bit 浮點乘法 3.7 pJ、讀 32-bit SRAM cache 5 pJ、讀 32-bit DRAM 640 pJ。一次 DRAM 存取的能耗是一次整數加法的幾千倍。所以壓縮模型不只是為了放得下，少搬一次 DRAM 就是省電。

## Lab 0：之後每個 lab 的起點

[Lab 0](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6) 是一份 Colab notebook，分成 Setup、Data、Model、Optimization、Training、Visualization 六段：

- **資料**：CIFAR-10，10 類、3×32×32 彩色影像，batch size 512
- **模型**：VGG-11 的變體（downsample 較少、classifier 較小），backbone 是 8 個 conv-bn-relu block 穿插 4 個 maxpool
- **效率檢查**：用參數量估 model size，用 [TorchProfile](https://github.com/zhijian-liu/torchprofile) 算 MAC。notebook 寫明這個模型有 9.2M 參數、推論需要 606M MACs，並說「接下來幾個 lab 會一起提升它的效率」
- **訓練**：cross entropy loss、SGD with momentum、自訂 learning rate scheduler；約 10 分鐘，順利的話準確率超過 92.5%

Lab 0 本身不難，重點是認識這個模型。Fall 2024 的 [Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) 就是對同一個 CIFAR-10 上的 VGG 做 pruning。

## Fall 2026 對照

Fall 2026 的 [L1 投影片](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)（91 頁，[錄影](https://youtu.be/tY75czj43_4)）結構與 Fall 2024 相同，差別在最後的課務頁，lab 與評分改動見[系列入口](/posts/ai/2026-09-30-mit-65940-course-overview)。

[L2 投影片](https://www.dropbox.com/scl/fi/42vwbruge0kz3yiuc5un4/Lec02-Basics-of-Neural-Networks.pdf?rlkey=r7o3vatbn8wv5o1n44n2dxizt&st=72q7v2zc&dl=0)（86 頁，[錄影](https://www.youtube.com/watch?v=CzGTQseaM38)）有三處新內容：

- **Lecture Plan 多一項**：「Review convolutional neural networks' architecture: AlexNet, VGG-16, ResNet-50, MobileNetV2」，對應第 40–44 頁。ResNet-50 那頁畫出 bottleneck block（1×1 → 3×3 → 1×1，中間通道數為 N/4），MobileNetV2 那頁畫出 inverted bottleneck（先 1×1 擴到 N×6，再 3×3 depthwise，再 1×1 壓回 N）
- **Latency 頁加了時序圖**（第 51 頁），畫出 load input、load weight、compute、store output 的重疊，說明為什麼取 max
- **結尾多了三頁「Today's AI is too BIG」**（第 81–83 頁），其中第 81 頁的模型與 GPU 記憶體對照圖延伸到 2026 年

[Fall 2026 Lab 0](https://colab.research.google.com/drive/1PfVYxikSaVpCSD-cnmNLN4l7yx_4odmg) 和 Fall 2024 版內容幾乎相同，差別是多了兩題：Question 1.1 要補完模型的 forward，Question 1.2 要回報模型的最佳準確率。開頭也改成要先連接 Google Drive、切到 lab 資料夾。

## 今晚可以做的事

1. 打開 [Lab 0 的 Colab](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)，跑到 Model 段，確認印出的參數量與 MAC 數跟 notebook 寫的 9.2M、606M 一致。
2. 手算 AlexNet 第一個卷積層（96 個 11×11 filter、輸入 3 通道、輸出 55×55）的參數量和 MAC 數，再跟第 56、72 頁對答案。算得出來，下一講的 pruning 比例就知道要怎麼換算成省下多少運算。

## 延伸閱讀

- [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)、[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：反向傳播與 CNN 的完整原理
- [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)：卷積網路架構的演進
- [Stanford CS336 導讀：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)：從記憶體頻寬看 latency

**系列導覽**：上一篇 [系列入口](/posts/ai/2026-09-30-mit-65940-course-overview)｜下一篇 [Pruning I：剪枝的粒度與準則](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。L1、L2 的主題與講次相符，抽樣未發現與本文矛盾，正文未改。

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [Lecture 1 投影片：Introduction（Fall 2024）](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Lecture 1 錄影（Fall 2024）](https://youtu.be/U7EPZv8Kh9w)
- [Lecture 2 投影片：Basics of Neural Networks（Fall 2024）](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0)
- [Lecture 2 錄影（Fall 2024）](https://youtu.be/I0nKjPpZmMU)
- [Lab 0：PyTorch Tutorial（Fall 2024，Colab）](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lecture 2 投影片（Fall 2026）](https://www.dropbox.com/scl/fi/42vwbruge0kz3yiuc5un4/Lec02-Basics-of-Neural-Networks.pdf?rlkey=r7o3vatbn8wv5o1n44n2dxizt&st=72q7v2zc&dl=0)
- [Lab 0（Fall 2026，Colab）](https://colab.research.google.com/drive/1PfVYxikSaVpCSD-cnmNLN4l7yx_4odmg)
- [Lin et al. (2020). MCUNet: Tiny Deep Learning on IoT Devices. NeurIPS](https://arxiv.org/abs/2007.10319)
- [Cai et al. (2020). TinyTL: Reduce Activations, Not Trainable Parameters for Efficient On-Device Learning. NeurIPS](https://arxiv.org/abs/2007.11622)
- [TorchProfile](https://github.com/zhijian-liu/torchprofile)
