---
title: "CS231N L10：影片理解——多了時間維度，模型要怎麼改"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, cnn, vision-transformer, multimodal]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 12
tldr: "CS231N 第 10 講把影片看成「2D＋時間」的 T×3×H×W 張量，再沿著一條效率主線往下走：先在短片段上訓練、測試時平均多個片段；架構從逐幀 2D CNN、late fusion、3D CNN，到用光流分出動作的 two-stream 與把 2D 權重「充氣」成 3D 的 I3D；2021 年後換成 Transformer，但 token 數會爆炸，於是有 divided space-time attention、Video Swin、MViT 與 tubelet。最後一段擴展到時序定位、影音多模態、VideoLLM 與長影片理解，並用 HourVideo 指出這塊還差得遠。"
description: "Stanford CS231N Spring 2026 Lecture 10（Video Understanding）導讀：影片分類的短片段訓練、single-frame 與 late/early fusion、3D 卷積、光流與 two-stream、I3D 權重膨脹、影片 ViT 的 token 爆炸與 TimeSformer／Video Swin／MViT／tubelet 對策、時序動作定位、影音分離與長影片問答。投影片 Spring 2026，錄影 Spring 2025。"
draft: false
glossary:
  - term: "optical flow"
    aliases: ["光流"]
    definition: "兩張相鄰影格之間的位移場 F(x, y) = (dx, dy)，描述每個像素在下一幀移到哪裡。"
    context: "two-stream 網路用堆疊的光流當時間流的輸入。"
  - term: "tubelet"
    definition: "把影片切成橫跨數個影格的 3D 小方塊，每塊當成一個 token，取代逐幀切 2D patch。"
    context: "ViViT、VideoMAE 等影片 Transformer 用它減少 token 數，並讓 token 帶有動作資訊。"
  - term: "divided space-time attention"
    definition: "把時空聯合的 self-attention 拆成兩步：先讓每個 token 只看其他影格同一位置（時間），再只看同一影格的其他位置（空間）。"
    context: "TimeSformer 的做法，每個 token 的計算量從 O(NT) 降到 O(N+T)。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-video-understanding-en)

> **來源年份**：投影片依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Lecture 10 投影片](https://cs231n.stanford.edu/slides/2026/lecture_10.pdf)（92 頁，封面日期 2026-04-30）；錄影是 [Spring 2025 的 Lecture 10](https://www.youtube.com/watch?v=wElqklprhPE)（YouTube，約 1 小時 8 分，2025 課表列的講者是 Ruohan Gao）。2026 錄影只放在 Canvas，限修課生，兩個年份的內容可能有差異。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 12 篇。

[上一篇](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)把輸出從「整張圖一個標籤」推到每個物件、每個像素。這一講換一個方向擴展：**輸入多了一條時間軸**。投影片開頭一句話定調：影片就是一串影像，也就是形狀為 T×3×H×W 的 4D 張量。

整講可以用一個問題串起來：**多出來的 T 要在網路的哪裡、用什麼代價處理？** 每一種架構都是對這個問題的不同答案。

## 任務與資料：從「認物件」到「認動作」

影像分類認的是狗、貓、卡車；影片分類認的是游泳、跑步、跳躍、吃東西。投影片用的範例資料集是 [Sports-1M](https://cs.stanford.edu/people/karpathy/deepvideo/)：100 萬支 YouTube 影片，標註了 487 種運動（Karpathy et al., CVPR 2014）。

第一個障礙是體積。影片常見 30 fps，未壓縮時每像素 3 bytes，SD（640×480）每分鐘約 1.5 GB，HD（1920×1080）每分鐘約 10 GB。GPU 記憶體放不下。

課程的解法很務實：

- **訓練**：在低 fps 的短片段上訓練，分類一小段
- **測試**：在同一支影片的多個片段上跑模型，再平均預測

後面所有架構都建立在這個「短片段」假設上。

## 第一代答案：CNN 怎麼吃時間

| 做法 | 時間在哪裡被融合 | 投影片的評語 |
|---|---|---|
| Single-frame CNN | 不融合，每幀獨立分類，測試時平均機率 | 常常是非常強的 baseline |
| Late fusion（FC） | 每幀跑 2D CNN，把 T×D×H'×W' 攤平接 MLP | 抓得到每幀的高階外觀；長度不固定時怎麼辦 |
| Late fusion（pooling） | 每幀跑 2D CNN，再對時空做平均池化 | 適合高階場景資訊，但難以比較幀與幀之間的低階動作 |
| Early fusion／3D CNN | 從第一層就用 3D 卷積與 3D 池化，讓時間資訊在網路中逐步融合 | 每層的 activation 是 D×T×H×W 的 4D 張量 |

**先試 single-frame。** 這是這一段最實用的一句話。做影片專題前，先用普通 2D CNN 逐幀分類再平均，當作要打敗的底線。

**3D 卷積跟 2D 差在哪。** 投影片逐項比較。濾波器多了時間維度（例：2×3×5×5）；滑動視窗機制不變，只是多一個方向；在時間上也可以設 stride；輸出的 activation map 變成 T'×28×28。概念上沒有新東西，只是把你在 [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification) 學過的卷積多推一個維度。

## 兩個提升效果的技巧

### 技巧一：把動作單獨拿出來（two-stream）

投影片引用 Johansson 1973 年的 biological motion 實驗：人只看幾個移動的光點，就認得出是什麼動作。動作本身就帶有大量資訊。

量化動作的工具是**光流**：它給出兩幀之間的位移場 F(x, y) = (dx, dy)，滿足 I_{t+1}(x+dx, y+dy) = I_t(x, y)。可以用演算法算，也可以用較快的神經網路近似。

[Two-stream 網路](https://arxiv.org/abs/1406.2199)（Simonyan & Zisserman, NeurIPS 2014）把外觀和動作分開：

- **空間流**：輸入單張影像，3×H×W
- **時間流**：輸入堆疊的光流，[2×(T−1)]×H×W，第一層 2D 卷積就處理所有光流圖（early fusion）

投影片的 UCF-101 長條圖裡，只用時間流（83.7）就比只用空間流（73）高，兩者融合後用 SVM 合併達到 88，而對照的 3D CNN 是 65.4。

投影片也補了一句現況：**近年光流很少直接用在影片理解**，主要變成其他任務的中間表示，例如機器人控制（引用 Ko et al., ICLR 2024）。

### 技巧二：把 2D 網路充氣成 3D（I3D）

影像架構已經累積大量研究，能不能直接拿來用？[I3D](https://arxiv.org/abs/1705.07750)（Carreira & Zisserman, CVPR 2017）的做法：

1. 拿一個 2D CNN 架構，把每個 K_h×K_w 的卷積或池化層換成 K_t×K_h×K_w 的 3D 版本
2. 用 2D 權重初始化 3D 權重：在時間方向複製 K_t 份，再除以 K_t

<details>
<summary>為什麼要除以 K_t</summary>

如果輸入是「靜止影片」，也就是同一張圖在時間上複製 K_t 次，那麼 3D 卷積沿時間方向把 K_t 份相同的結果加起來，除以 K_t 之後剛好等於原本的 2D 卷積輸出。這保證膨脹後的網路在起點就跟 ImageNet 預訓練的 2D 網路行為一致，再從這裡學時間資訊。

</details>

投影片附上 Kinetics-400 的 top-1 比較，全部用 Inception 架構，分成從頭訓練與 ImageNet 預訓練兩組，比較逐幀 CNN、CNN+LSTM、two-stream、膨脹的 3D CNN 與 two-stream 膨脹 3D CNN。

## 第二代答案：Transformer 與 token 爆炸

投影片把這個領域分成兩個時代：2014–2021 是 3D CNN＋RNN，2021–2026 是 Transformer。

換成 [ViT](https://arxiv.org/abs/2010.11929) 的問題在於數字：224×224 的影像切成 16×16 patch 是 14×14＝196 個 token。影片就開始爆炸：

| 輸入 | token 數 | 投影片的比喻 |
|---|---|---|
| 一張圖 | 196 | |
| 16 幀短片段 | 3,136 | 約一章書 |
| 5 分鐘、1 fps | 5.88 萬 | 約一本短篇小說 |
| 5 分鐘、24 fps | 1,411,200 | 接近當前模型的 context 上限 |

self-attention 的成本隨 token 數平方成長，所以投影片提出兩大改善方向：**改 attention 運算子**，或**減少 token 數**。

### 方向一：改 attention

- **Divided space-time attention**（[TimeSformer](https://arxiv.org/abs/2102.05095)，Bertasius et al., ICML 2021）：把聯合時空 attention 拆成兩步。「時間」步驟裡，每個 token 只看其他影格的同一空間位置；「空間」步驟裡，只看同一影格的其他 token。每個 token 的計算量從 O(NT) 降到 O(N+T)，而疊了很多個 block 之後，資訊仍能在時空之間傳開。
- **[Video Swin Transformer](https://arxiv.org/abs/2106.13230)**（CVPR 2022）：把 self-attention 限制在局部的時空小方塊裡，很像 3D CNN，只是方塊內換成 attention；每層之間平移方塊，讓資訊跨越邊界。
- **[MViT](https://arxiv.org/abs/2104.11227)**（Multiscale Vision Transformers, ICCV 2021）：在算 attention 前先用卷積把 K 和 V 序列聚合、縮短，輸出長度不變。整個網路像 ResNet 一樣逐步把空間尺寸減半、通道加倍，例如從 56×56、96 維到 14×14、384 維。

### 方向二：減少 token（tubelet）

[ViViT](https://arxiv.org/abs/2103.15691)（Arnab et al., ICCV 2021）把 patch 換成 **tubelet**：橫跨數幀的 3D 方塊。投影片給的直覺有兩點：patch 不含動作資訊，tubelet 有；token 數大幅減少，跨 4 幀的 tubelet 就少 4 倍。ViViT、VideoMAE、Video Swin、MViT、V-JEPA 都用了這個做法。其他減 token 的方法（adaptive token selection、token merging、learned compression）投影片說留到 [L16](/posts/ai/2026-09-30-cs231n-vision-language) 再談。

## 分類之外：定位、多模態與長影片

到這裡為止都是「分類短片段」。後半講往三個方向擴展。

**時間與時空定位。** Temporal action localization 是在一支很長、沒剪輯的影片裡，找出每個動作對應的影格，可以沿用類似 Faster R-CNN 的做法：先產生時間上的候選區段，再分類。Spatio-temporal detection 更進一步，要在空間和時間上都偵測出所有人並分類他們的動作，範例資料集是 [AVA](https://arxiv.org/abs/1705.08421)。

**影音多模態。** 投影片用 McGurk 效應（同一段聲音配上不同嘴型，聽起來是「Ba」或「Fa」）說明視覺會改變我們聽到的內容。接著舉幾類研究：

- 視覺引導的語音分離：VisualVoice（Gao et al., CVPR 2021）把混在一起的語音分成左右兩位說話者
- 樂器聲源分離：Gao & Grauman（ICCV 2019）在 10 萬支無標註的多聲源影片上訓練，再分離新影片的聲音
- 影音融合的動作辨識、用音訊當預覽加速長影片的動作辨識
- 第一人稱多模態影片，例如 Ego-Exo 對話圖預測（Jia et al., CVPR 2024）

**Video LLM 與長影片。** 投影片列了 Video-LLaVA、VideoLLaMA 3、Video-ChatGPT，然後問：現在的電腦視覺系統能理解長影片嗎？評測方式是對影片提問，例如一段 1 小時 10 分的第一人稱影片裡「我健身後把 AirPods 放在哪？」範例取自 HourVideo，題型包括「配戴者互動過幾個不同的人」「從廚房怎麼走到後院」，以多選題測試。投影片的結論是：**長影片理解的能力差距還很大，有很多工作要做。**

## 自學建議

- **先把張量形狀寫在紙上。** 這一講每個架構的差別都在「T 放在哪一維、在第幾層被融合」。每看到一張架構圖，寫下輸入、中間 activation、輸出的形狀，比背模型名稱有用。
- **token 數要會自己算。** 196 × T 這個乘法決定了為什麼影片 Transformer 的設計全都在省 token 或省 attention。
- **缺口**：這一講沒有專屬作業；A1–A3 都不含影片題。2026 錄影不公開，想對照口頭講解只能看 2025 錄影。

## 延伸閱讀

- ViT 與 attention 的基礎：本系列 [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)
- 影片 token 的減量與多模態模型：本系列 [L16：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)
- 為什麼長序列很貴、要怎麼切到多張 GPU：本系列下一篇 [L11：大規模分散式訓練](/posts/ai/2026-09-30-cs231n-distributed-training)

**系列導覽**：上一篇 [L9：物件偵測、影像分割與模型可視化](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)｜下一篇 [L11：大規模分散式訓練](/posts/ai/2026-09-30-cs231n-distributed-training)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 10: Video Understanding 投影片（Spring 2026, PDF）](https://cs231n.stanford.edu/slides/2026/lecture_10.pdf)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 10: Video Understanding（YouTube）](https://www.youtube.com/watch?v=wElqklprhPE)
- [Stanford CS231N 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Karpathy et al. (2014). Large-scale Video Classification with Convolutional Neural Networks（Sports-1M）](https://cs.stanford.edu/people/karpathy/deepvideo/)
- [Simonyan & Zisserman (2014). Two-Stream Convolutional Networks for Action Recognition in Videos](https://arxiv.org/abs/1406.2199)
- [Carreira & Zisserman (2017). Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset（I3D）](https://arxiv.org/abs/1705.07750)
- [Dosovitskiy et al. (2020). An Image is Worth 16x16 Words（ViT）](https://arxiv.org/abs/2010.11929)
- [Bertasius et al. (2021). Is Space-Time Attention All You Need for Video Understanding?（TimeSformer）](https://arxiv.org/abs/2102.05095)
- [Liu et al. (2022). Video Swin Transformer](https://arxiv.org/abs/2106.13230)
- [Fan et al. (2021). Multiscale Vision Transformers](https://arxiv.org/abs/2104.11227)
- [Arnab et al. (2021). ViViT: A Video Vision Transformer](https://arxiv.org/abs/2103.15691)
- [Gu et al. (2018). AVA: A Video Dataset of Spatio-temporally Localized Atomic Visual Actions](https://arxiv.org/abs/1705.08421)
