---
title: "MIT 6.5940 第 16–17 講：高效視覺——ViT、GAN、影片與點雲各自在浪費什麼"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, vision-transformer, computer-vision, gan, efficient-ml]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 20
tldr: "第 16 講談 ViT：高解析度下 attention 成本隨解析度平方成長，window attention（Swin）把計算限制在局部視窗，EfficientViT 用 ReLU linear attention 把複雜度降到線性再補回局部與多尺度能力，SparseViT 剪掉不重要的視窗；自監督（對比學習、CLIP、MAE）解決 ViT 需要大量標註的問題；最後 HART 用離散 token 加殘差 diffusion，比 diffusion 模型高出數倍吞吐量。第 17 講針對三種冗餘：GAN 的 2D 空間冗餘（GAN Compression、AnyCost GAN、DiffAugment）、影片的時間冗餘（TSM 零 FLOPs 的時間建模）、點雲的 3D 稀疏（PVCNN、SPVCNN、BEVFusion）。Fall 2026 排程已拿掉第 17 講。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 16 講 Vision Transformer 與第 17 講 GAN、Video、Point Cloud 合併導讀：ViT 基礎、window／linear／sparse attention、EfficientViT、SparseViT、對比學習與 MAE、VAR 與 HART；GAN Compression、AnyCost GAN、DiffAugment、TSM、PVCNN、SPVCNN、BEVFusion。附 Fall 2026 排程變化。"
draft: false
glossary:
  - term: "linear attention"
    aliases: ["ReLU linear attention", "線性注意力"]
    definition: "把 softmax 換成 ReLU 之類的核函數後，利用矩陣乘法結合律先算 KᵀV（d×d）再乘 Q，使 attention 成本從 token 數的平方降到線性。代價是無法產生尖銳的注意力分布，擅長全域資訊、不擅長局部細節。"
    context: "第 16 講第 29–33 頁，EfficientViT 的核心運算。"
  - term: "TSM"
    aliases: ["Temporal Shift Module", "時間位移模組"]
    definition: "把 2D CNN 特徵圖的一部分 channel 沿時間軸往前或往後位移一格，讓相鄰影格交換資訊。不增加任何 FLOPs 或參數，就能讓 2D CNN 具備時間建模能力。"
    context: "第 17 講第 61–79 頁；雙向版用於離線影片，單向版（只從過去往未來位移）用於即時串流。"
  - term: "HART"
    aliases: ["Hybrid Autoregressive Transformer"]
    definition: "Song Han 實驗室的自迴歸影像生成模型。tokenizer 同時能解碼離散與連續 token，把連續 token 拆成離散 token 加殘差；離散部分由自迴歸 Transformer 生成，殘差部分由小的 residual diffusion（MLP）補上。"
    context: "第 16 講第 65–84 頁，投影片宣稱在相近畫質下吞吐量是 diffusion 模型的 4.5–7.7 倍。"
  - term: "point-voxel convolution"
    aliases: ["PVConv", "PVCNN"]
    definition: "處理 3D 點雲的雙分支卷積：voxel 分支把點轉成規則網格做卷積、負責聚合鄰域資訊；point 分支對每個點做 MLP、保留高解析度，兩者再融合。"
    context: "第 17 講第 88–98 頁；SPVConv 把 voxel 分支換成稀疏卷積。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 20 篇，合併第 16 與第 17 講。

**系列位置**：上一篇 [L15 長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm)｜下一篇 [L18 Diffusion 加速](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：

- 第 16 講 Vision Transformer（2024-10-31）：[Lec16-Vision-Transformers.pdf](https://www.dropbox.com/scl/fi/lr3jlbzoa1du3og22wbiw/Lec16-Vision-Transformers.pdf?rlkey=6ejlatw4kpfzxgxg7zx2a6zo2&st=7btq6r53&dl=0)（85 頁）、[錄影](https://www.youtube.com/watch?v=v0jYDgaVzlk)
- 第 17 講 GAN, Video, and Point Cloud（2024-11-05）：[Lec17-Efficient-GANs-Video-PointCloud.pdf](https://www.dropbox.com/scl/fi/6o45qs8xm20qhzkc192bv/Lec17-Efficient-GANs-Video-PointCloud.pdf?rlkey=71hrp50kjtl8zz8w7jntvbwn0&st=ywq378y5&dl=0)（106 頁）、[錄影](https://www.youtube.com/watch?v=o_60Yhb79W8)

以下「L16 第 N 頁」「L17 第 N 頁」分別指這兩份 PDF 的頁碼。存取等級 **A3**：投影片與錄影公開，這兩講沒有對應的 lab。2026-09-30 核對。

**Fall 2026 對照**：[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)保留「Vision Transformer」（11 月 5 日，第 16 講），但 **GAN、Video、Point Cloud 這一講被拿掉**，第 17、18 講改成 Diffusion Model Part I／II。截至 2026-09-30 這幾講都還沒上線。想學第 17 講的內容，目前只能用 Fall 2024 的材料。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=v0jYDgaVzlk
title: EfficientML.ai Lecture 16 - Vision Transformer (MIT 6.5940, Fall 2024)
```

```youtube
url: https://www.youtube.com/watch?v=o_60Yhb79W8
title: EfficientML.ai Lecture 17 - GAN, Video, Point Cloud (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 16 - Vision Transformer (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=v0jYDgaVzlk)、[EfficientML.ai Lecture 17 - GAN, Video, Point Cloud (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=o_60Yhb79W8)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

## 為什麼這兩講放在一起

前面十五講的主角是 CNN 分類器和 LLM。這兩講換成「視覺任務的特殊結構」：高解析度影像、生成模型、影片、3D 點雲。L17 第 2 頁把思路講得很清楚：每種資料都有自己的冗餘，GAN 有 2D 空間冗餘，影片有時間冗餘，點雲有 3D 空間冗餘（而且極度稀疏）。找到冗餘，就知道從哪裡省。

| 講次 | 段落 | 代表技術 |
|---|---|---|
| L16 | ViT 基礎 | patch embedding、資料量與 CNN 的比較 |
| L16 | 高效 ViT | window attention（Swin）、linear attention（EfficientViT）、sparse attention（SparseViT） |
| L16 | ViT 的自監督 | 對比學習、CLIP、MAE |
| L16 | ViT 與自迴歸生成 | VQ、VAR、HART |
| L17 | 高效 GAN | GAN Compression、AnyCost GAN、DiffAugment |
| L17 | 高效影片理解 | 2D／3D CNN 的取捨、TSM |
| L17 | 高效點雲 | PVCNN、SPVCNN、BEVFusion |

## 第 16 講：Vision Transformer

### ViT 基礎：一張圖切成幾個 token

[ViT](https://arxiv.org/abs/2010.11929) 把圖切成 patch，每個 patch 當一個 token（L16 第 4–8 頁）。投影片的小例子：96×96 的圖、32×32 的 patch，得到 3×3=9 個 token，每個 token 攤平是 3×32×32=3072 維，線性投影到 ViT 的 hidden size 768，這一層有 3072×768≈2.36M 參數。實作上就是一個 32×32、stride 32 的卷積。

第 10–11 頁是 ViT 論文的經典結論：資料量有限時 ViT 輸給 CNN，用大資料集預訓練後才超越 CNN。這個結論會在自監督那段再用到。

### 為什麼高解析度是問題

分割、超解析度、自駕這類 dense prediction 任務需要高解析度，低解析度會丟掉細節與小物體（L16 第 14–21 頁）。問題是 ViT 的計算量**隨輸入解析度平方成長**（第 16 頁）。第 17 頁給了一個對照：在 Jetson AGX Orin（TensorRT、fp16、batch 1）上做 Cityscapes 分割，SegFormer 1.6 FPS、82.4 mIoU，EfficientViT 21.8 FPS、82.7 mIoU。

接下來三種 attention 就是三種省法。

### Window attention：只在局部視窗算

[Swin Transformer](https://arxiv.org/abs/2103.14030)（L16 第 23–26 頁）把 attention 限制在固定大小（例如 7×7）的局部視窗內。每個視窗 token 數固定，所以總計算量對影像大小是線性的；特徵圖再逐層降採樣。問題是視窗之間不交換資訊，解法是下一個 block 把視窗位移（shifted window）。第 27 頁延伸到點雲：[FlatFormer](https://arxiv.org/abs/2301.08739) 處理 99.9% 稀疏的 3D 點雲，用等大小分組的稀疏視窗。

### Linear attention：換個乘法順序

**直覺**（L16 第 29–30 頁）。Softmax attention 要先算 $QK^\top$，得到 n×n 的矩陣，所以是 $O(n^2)$。如果把 softmax 換成 ReLU，就可以利用矩陣乘法的結合律 $(ab)c = a(bc)$，先算 $K^\top V$（只有 d×d），再乘 Q，成本變成 $O(n)$。

**代價**（第 31–32 頁）。天下沒有白吃的午餐：ReLU linear attention 產生不了尖銳的注意力分布，擅長抓全域資訊，但抓不好局部細節，也缺少多尺度學習能力。

**EfficientViT 的補法**（第 33 頁）。[EfficientViT](https://arxiv.org/abs/2205.14756) 做兩件事：用小卷積把鄰近 token 聚合成多尺度的 Q/K/V，再做 linear attention；在 FFN 裡加 depthwise convolution 補局部資訊。第 34–39 頁的結果涵蓋 Cityscapes 分割、超解析度（最多快 6.4 倍）、Segment Anything 與 ImageNet 分類。

### Sparse attention：不是每個視窗都值得算

[SparseViT](https://arxiv.org/abs/2303.17605)（L16 第 41–46 頁）的問題是：高解析度加稀疏，會不會比低解析度加稠密更好？做法分三步：以視窗為單位剪掉 activation（每層稀疏度可以不同）、做稀疏感知的訓練調整、在資源限制下搜尋每層的稀疏度。第 46 頁把不同延遲預算（24 ms、19 ms）下保留的視窗畫出來。這和 [L3–L4 的剪枝](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)是同一套想法，只是剪的是 activation 而不是權重。

### 自監督：ViT 需要大資料，但標註很貴

L16 第 48–49 頁把前面的結論接回來：ViT 要大資料才好，標註大資料又很貴，那就用沒有標註的資料。

- **對比學習**（第 51–53 頁）：同一張圖的兩個隨機視角是正樣本，其他圖是負樣本。引用 [Chen et al.（MoCo v3）](https://arxiv.org/abs/2104.02057) 的結果：在小資料上直接監督訓練大 ViT，模型越大準確率反而多半下降；自監督的 ViT 則是模型越大越好。
- **CLIP**（第 54–56 頁）：[CLIP](https://arxiv.org/abs/2103.00020) 用大量圖文配對做對比學習，推論時可以 zero-shot、開放詞彙分類，不必微調、類別數不限。
- **MAE**（第 57–61 頁）：[MAE](https://arxiv.org/abs/2111.06377) 隨機遮住 patch 再預測回來，類似 BERT 的 masked language model。兩個設計：非對稱的 encoder-decoder（重的 encoder 只處理沒遮的 token，輕的 decoder 處理全部）；遮蔽比例 75%，遠高於 BERT 的 15%，因為影像的資訊密度比語言低。第 61 頁顯示 MAE 在部分與完整微調設定下都比 MoCo v3 好。

MAE 只處理沒遮的 25% token，本身就是一個效率設計。

### 自迴歸影像生成與 HART

L16 最後一段問：ViT 會「看」視覺 token，那能不能「生成」視覺 token？

- **VQ 把影像變離散 token**（第 67–68 頁）：vector quantization 用一個 codebook 把每個 patch 對應到最近的碼字。第 68 頁特別指出，VQ 是 [Deep Compression](https://arxiv.org/abs/1510.00149) 裡 codebook 量化的推廣，也就是 [L5 講過的 k-means 量化](/posts/ai/2026-09-30-mit-65940-quantization-basics)。
- **VAR**（第 69–70 頁）：[VAR](https://arxiv.org/abs/2404.02905) 把「預測下一個 token」改成「預測下一個尺度」，一次生成一整個解析度層級，比逐 token 生成快。
- **離散 tokenizer 的問題**（第 71–72 頁）：重建品質差，高解析度下細節糊掉。

**HART 的做法**（第 73–81 頁）。[HART](https://arxiv.org/abs/2410.10812) 的 tokenizer 能同時解碼離散與連續 token，並把連續 token 拆成「離散 token + 殘差 token」。生成時分兩部分：

1. 離散 token 由可擴展解析度的自迴歸 Transformer 生成（沿用 VAR 的做法）。
2. 殘差 token 由一個小 MLP 做的 residual diffusion 補上。

**為什麼快**（第 65 頁）：diffusion 模型通常要在最高解析度上跑完整 Transformer 約 20 步；HART 用 10–14 步取樣，而且只有最後一步在最高解析度。第 82 頁的結論是在相近畫質下吞吐量是 diffusion 模型的 4.5–7.7 倍（1024px），第 65 頁在 512px 下最多 9.6 倍。第 84 頁展示它在搭載 4090 mobile GPU 的筆電上以互動速度執行。

## 第 17 講：GAN、影片與點雲

### 高效 GAN

**背景**（L17 第 5–11 頁）。GAN 由生成器 G 和判別器 D 對抗訓練；D 只在訓練時用，推論時真正要加速的是 G。第 11 頁的比較重點是：生成模型比辨識模型貴得多。

**GAN Compression**（第 13–17 頁）。[GAN Compression](https://arxiv.org/abs/2003.08936) 壓縮 conditional GAN，流程是：用預訓練的 teacher 生成器蒸餾一個 super student 生成器（配合 L2 特徵匹配），再用 NAS 自動決定每層 channel 數，從候選池裡評估、挑選後微調。第 15–16 頁的壓縮倍數：pix2pix 11.8 倍、CycleGAN 21.2 倍、GauGAN 8.8 倍。這一招把 [L7–L8 的 NAS](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy) 和 [L9 的蒸餾](/posts/ai/2026-09-30-mit-65940-knowledge-distillation)接在一起。

**AnyCost GAN**（第 19–33 頁）。**場景**：用 GAN 修圖時，每次調整都要等完整生成，很難互動。**直覺**：光線追蹤會用較少光線先出快速預覽，GAN 能不能也這樣？**機制**：[AnyCost GAN](https://arxiv.org/abs/2103.03243) 訓練一個能在不同解析度、不同 channel 數下產生一致結果的生成器，編輯時用小子網路即時預覽，最後用完整模型輸出。訓練時隨機取樣 channel 數會遇到兩個問題：子網路輸出不一致（加蒸餾 loss 解決）；單一判別器無法同時給不同子生成器有效回饋（改用依生成器架構條件化的判別器）。

**DiffAugment**（第 35–45 頁）。問題換成資料量：FFHQ 有 7 萬張精選人臉，收集與標註要花很久。第 37 頁的數字是 StyleGAN2 在 100%、20%、10% 訓練資料下的 FID 分別是 11.1、23.1、36.0（越低越好），資料一少就明顯變差，原因是判別器過擬合。資料增強是對付過擬合的老辦法，但 GAN 要怎麼增強？

| 做法 | 問題 |
|---|---|
| 只增強真實圖 | 生成圖也學到增強造成的假影（第 40 頁） |
| 真假圖都增強，但只在更新 D 時 | 最佳化失衡，訓練崩壞（第 41 頁） |
| **[DiffAugment](https://arxiv.org/abs/2006.10738)**：真假圖都增強，D 與 G 更新時都用，且增強可微分 | 資料少時明顯改善，100 張圖也能生成（第 42–45 頁） |

### 高效影片理解：TSM

**2D 與 3D CNN 的取捨**（L17 第 51–59 頁）：

- **2D CNN**：取樣影格各自過 2D CNN 再彙總分數，或加光流做 two-stream，或後接 LSTM。好處是計算省、能重用影像模型；壞處是無法建模時間資訊，光流比網路本身還慢，後期融合抓不到低階時間關係。
- **3D CNN**（C3D、I3D）：在時間維度也做卷積，能同時建模時空資訊；代價是多一個維度，模型大小與計算量都大。I3D 用「膨脹」把 2D 權重沿時間複製來初始化。

第 59 頁的問題：能不能用 2D CNN 的成本拿到 3D CNN 的表現？

**TSM 的做法**（第 61–64 頁）。[TSM](https://arxiv.org/abs/1811.08383) 把一部分 channel 沿時間軸位移：雙向版一部分往前、一部分往後，讓相鄰影格交換資訊，用於離線影片；單向版只從過去往未來位移，用於即時串流。插進現成的 2D CNN，**零 FLOPs、零參數**。第 64 頁的實作只有幾行：

```python
# shape of x: [N, T, C, H, W]
out = torch.zeros_like(x)
fold = c // fold_div
out[:, :-1, :fold] = x[:, 1:, :fold]  # shift left
out[:, 1:, fold: 2 * fold] = x[:, :-1, fold: 2 * fold]  # shift right
out[:, :, 2 * fold:] = x[:, :, 2 * fold:]  # not shift
return out
```

**結果**（第 65–76 頁）：

- Something-Something 資料集上，計算量是 ECO 家族的 1/3、Non-local I3D 家族的 1/6，表現更好。
- Tesla P100、batch 1：I3D 每支影片 164.3 ms、準確率 41.6%；TSM 17.4 ms、43.4%。
- 放大到 SUMMIT 超級電腦：8 幀 ResNet-50 TSM 在 Kinetics 上訓練，1 個節點（6 GPU）要 49 小時 50 分，256 個節點（1536 GPU）只要 14 分鐘，準確率維持在 74% 左右。

### 高效點雲：PVCNN、SPVCNN、BEVFusion

**挑戰**（L17 第 82–86 頁）。點雲是一組無序的 3D 點（x, y, z 加特徵），極度稀疏（有時密度不到 0.1%），在記憶體中不規則存放，一般 CNN 處理不了。模型又常要部署在自駕車、AR 頭盔這類資源有限的裝置上。

**PVCNN**（第 88–93 頁）。兩種既有做法各有瓶頸：voxel 方法在 8GB GPU 記憶體下會損失 40% 以上資訊；point 方法有大量不規則記憶體存取，而第 89 頁提醒，晶片外 DRAM 存取比算術運算貴得多，隨機存取還可能撞到 bank conflict。[PVCNN](https://arxiv.org/abs/1907.03739) 兩者並用：voxel 分支規則、沒有不規則存取，適合聚合鄰域資訊；point 分支保留高解析度，減少 voxel 化的資訊損失。第 93 頁的室內分割示範：PointNet 用 1.9 GB 記憶體、1.9 秒，PVCNN 用 1.2 GB、1.0 秒。

**SPVCNN**（第 94–98 頁）。[SPVConv](https://arxiv.org/abs/2007.16100) 把 voxel 分支換成稀疏卷積，處理大場景時不必付出稠密網格的代價；再配合 3D NAS（super network、演化搜尋、延遲預測器）在延遲目標下找架構。

**BEVFusion**（第 100–105 頁）。自駕車同時有多顆相機（透視視角）和 LiDAR（3D 視角），融合前需要一個共同空間：所有感測器資料都能低損失轉換過去，而且適合不同 3D 任務。[BEVFusion](https://arxiv.org/abs/2205.13542) 選鳥瞰圖（BEV）：相機走稠密分支、LiDAR 走稀疏分支，各自轉到 BEV 後融合，再接偵測、地圖分割等任務頭。第 105 頁寫著截至 2022 年 11 月 9 日在 Waymo 排行榜排名第一。

## 兩講共用的想法

整理完會發現兩條線：

- **找到結構性的冗餘再省**：ViT 的局部性（window attention）、影片相鄰幀的相似（TSM）、點雲的稀疏（SPVConv）、影像 token 的低資訊密度（MAE 遮 75%）。
- **前面各講的技術被重新組合**：SparseViT 是剪枝，GAN Compression 是 NAS 加蒸餾，VQ 是 k-means 量化，PVCNN 的論證回到記憶體存取成本。F24 課頁把這兩講排在「Chapter II: Domain-Specific Optimization」底下，指的就是這種依資料特性重組既有工具的做法。

## 自學怎麼做

1. L16 第 30 頁的結合律圖是整講最值得停下來的一頁：自己寫出 $QK^\top V$ 兩種乘法順序的矩陣形狀，確認哪一種是 $O(n)$。
2. 把 L17 第 64 頁的 TSM 程式碼抄進 notebook，用一個隨機 `[N, T, C, H, W]` tensor 跑一次，印出位移前後某個 channel 在時間軸上的值。
3. 今晚就能做的一件事：用 L16 第 5 頁的算法，算 patch size 16 的 ViT 在 224×224 與 1024×1024 輸入下各有幾個 token（(224/16)² 與 (1024/16)²），再平方一次估計 attention 矩陣大小差幾倍，對照第 16 頁的 GMACs 曲線。

## 延伸閱讀

- 同系列：[L15 長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm)、[L14 LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training)（VILA-U 的影像 token 化）、[L18 Diffusion 加速](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency)
- ViT 與自監督：[CS231N L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)、[CS231N L12：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning)
- GAN：[CS231N L13：自迴歸、VAE 與 GAN](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)
- 影片與 3D：[CS231N L10：影片理解](/posts/ai/2026-09-30-cs231n-video-understanding)、[CS231N L15：3D 視覺](/posts/ai/2026-09-30-cs231n-3d-vision)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。

## 參考資料

- [Lec16-Vision-Transformers.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/lr3jlbzoa1du3og22wbiw/Lec16-Vision-Transformers.pdf?rlkey=6ejlatw4kpfzxgxg7zx2a6zo2&st=7btq6r53&dl=0)、[第 16 講錄影](https://www.youtube.com/watch?v=v0jYDgaVzlk)
- [Lec17-Efficient-GANs-Video-PointCloud.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/6o45qs8xm20qhzkc192bv/Lec17-Efficient-GANs-Video-PointCloud.pdf?rlkey=71hrp50kjtl8zz8w7jntvbwn0&st=ywq378y5&dl=0)、[第 17 講錄影](https://www.youtube.com/watch?v=o_60Yhb79W8)
- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 排程與日期
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 第 16 講保留、第 17 講改為 Diffusion Part I
- [Dosovitskiy et al., ViT](https://arxiv.org/abs/2010.11929)、[Liu et al., Swin Transformer](https://arxiv.org/abs/2103.14030)、[Liu et al., FlatFormer](https://arxiv.org/abs/2301.08739)
- [Cai et al., EfficientViT](https://arxiv.org/abs/2205.14756)、[Chen et al., SparseViT](https://arxiv.org/abs/2303.17605)
- [Chen et al., An Empirical Study of Training Self-Supervised ViTs（MoCo v3）](https://arxiv.org/abs/2104.02057)、[Radford et al., CLIP](https://arxiv.org/abs/2103.00020)、[He et al., MAE](https://arxiv.org/abs/2111.06377)
- [Han et al., Deep Compression](https://arxiv.org/abs/1510.00149)、[Tian et al., VAR](https://arxiv.org/abs/2404.02905)、[Tang et al., HART](https://arxiv.org/abs/2410.10812)
- [Li et al., GAN Compression](https://arxiv.org/abs/2003.08936)、[Lin et al., AnyCost GAN](https://arxiv.org/abs/2103.03243)、[Zhao et al., DiffAugment](https://arxiv.org/abs/2006.10738)
- [Lin et al., TSM](https://arxiv.org/abs/1811.08383)
- [Liu et al., PVCNN](https://arxiv.org/abs/1907.03739)、[Tang et al., SPVNAS／SPVConv](https://arxiv.org/abs/2007.16100)、[Liu et al., BEVFusion](https://arxiv.org/abs/2205.13542)
