---
title: "CS231N L9：物件偵測、影像分割與模型可視化"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, cnn, object-detection, interpretability]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 11
tldr: "CS231N Spring 2026 第 9 講把「整張圖一個標籤」推到「每個像素、每個物件」：語意分割用全卷積網路先降採樣再升採樣（U-Net 再接回高解析特徵）；偵測從 R-CNN 的約 2000 次 CNN forward，一路優化到 Fast R-CNN、Faster R-CNN 的 RPN、單階段的 YOLO，再到不用 anchor 的 DETR；Mask R-CNN 在每個 RoI 上多預測一張 28×28 遮罩。最後一段講 saliency、CAM 與 Grad-CAM。課表列的對抗樣本、DeepDream 與風格轉換，2026 和 2025 的投影片都沒有。"
description: "Stanford CS231N（Spring 2026）Lecture 9 導讀：依 147 頁官方投影片整理分類、語意分割、物件偵測、實例分割四種任務的輸出差異，滑動視窗與全卷積網路、unpooling 與轉置卷積、U-Net，單物件定位的 multitask loss、R-CNN、Fast R-CNN、RPN 與 anchor、YOLO／SSD／RetinaNet、DETR、Mask R-CNN，以及第一層 filter、saliency map、CAM、Grad-CAM 與 ViT 特徵可視化；並標出課表主題與實際投影片的落差。"
draft: false
glossary:
  - term: "semantic segmentation"
    aliases: ["語意分割"]
    definition: "替影像的每個像素標上類別，不區分同類別的不同個體；兩頭相鄰的牛會被標成同一片「牛」。"
    context: "CS231N 第 9 講用它當第一個密集預測任務。"
  - term: "transposed convolution"
    aliases: ["轉置卷積", "deconvolution"]
    definition: "可學習的升採樣層：輸入的每個像素乘上 filter 後貼到輸出上，輸出重疊處相加；stride 決定輸出與輸入的移動比例。"
    context: "CS231N 第 9 講用 3×3、stride 2 的例子把 2×2 輸入升到 4×4。"
  - term: "anchor box"
    aliases: ["錨框"]
    definition: "在特徵圖每個位置預先放置的固定大小與比例的候選框；模型預測它是否含有物件，以及從它修正到真實框所需的偏移量。"
    context: "CS231N 第 9 講在 Region Proposal Network 一節引入。"
  - term: "Grad-CAM"
    aliases: ["Gradient-weighted Class Activation Mapping"]
    definition: "取任一層的特徵圖 A，算類別分數對 A 的梯度，在空間上平均得到每個通道的權重，用權重加總 A 再過 ReLU，得到該類別的熱度圖。"
    context: "CS231N 第 9 講用它解決 CAM 只能用在最後一個卷積層的限制。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en)

> **版本說明**：本文依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 課表連結的 [Lecture 9 投影片](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf)（147 頁，2026-09-30 下載核對），並比對 [Spring 2025 投影片](https://cs231n.stanford.edu/slides/2025/lecture_9.pdf)。錄影請看 Spring 2025 的 [Lecture 9](https://www.youtube.com/watch?v=PTypu6GqEd4)；2026 錄影只放在 Canvas，限修課生，兩年內容可能有差異。存取等級 **A3**。

**系列位置**：上一篇 [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)｜下一篇 [L10：影片理解](/posts/ai/2026-09-30-cs231n-video-understanding)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

到目前為止，CS231N 的模型都只回答一個問題：這張圖是什麼？第 9 講把問題拆細：圖裡有哪些東西、各在哪裡、每個像素屬於誰？最後再反過來問：模型做判斷時，到底在看哪裡？

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=PTypu6GqEd4
title: Spring 2025 Lecture 9 錄影
```

```youtube
url: https://www.youtube.com/watch?v=utxbUlo9CyY
title: 影片
```

原始影片：[Spring 2025 Lecture 9 錄影](https://www.youtube.com/watch?v=PTypu6GqEd4)、[影片](https://www.youtube.com/watch?v=utxbUlo9CyY)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 先講一個落差：課表和投影片不一樣

[2026 課表](https://cs231n.stanford.edu/schedule.html)替這一講列了六個主題：單階段偵測、兩階段偵測、語意／實例／全景分割、特徵可視化與 inversion、對抗樣本、DeepDream 與風格轉換。

實際的 147 頁投影片只講到前三類加上一部分可視化。投影片裡搜尋不到 adversarial、DeepDream、style transfer、panoptic、inversion 這些詞；2025 年的 178 頁版本也一樣。投影片自己的目錄（第 29 頁）是：Transformer 回顧 → 語意分割、物件偵測、實例分割 → 模型各層可視化、saliency map、CAM 與 Grad-CAM。

所以本文照投影片的範圍寫，不替缺的主題補內容。想看對抗樣本與生成相關的主題，可以讀本站的 [CS230 對抗樣本與生成模型](/posts/ai/2026-08-16-cs230-adversarial-and-generative)。

投影片前 28 頁是第 8 講的 Transformer 與 ViT 回顧，另外多了一頁 **RMSNorm**：用均方根取代 LayerNorm 的正規化，投影片說訓練會稍微穩定一點。這部分請見[上一篇](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)。

## 四種任務，四種輸出

投影片第 30 頁用一張圖把任務排成一排：

| 任務 | 輸出 | 投影片的描述 |
|---|---|---|
| 分類 | 一個標籤（CAT） | 沒有空間範圍 |
| 語意分割 | 每個像素一個標籤（GRASS、CAT、TREE、SKY） | 沒有物件，只有像素 |
| 物件偵測 | 每個物件一個類別加一個框（DOG、DOG、CAT） | 多個物件 |
| 實例分割 | 每個物件一張遮罩 | 多個物件 |

從左到右，輸出越來越細。這一講的主脊就是：每往右一格，網路結構要多做什麼改變。

## 語意分割：讓輸出跟輸入一樣大

**場景**：替每個像素標上類別。兩頭牛站在一起，語意分割只標「牛」，不分是哪一頭。

投影片試了三個想法，每一個都卡在一個問題上：

1. **滑動視窗**：對每個像素切一小塊，用 CNN 分類中心像素。問題是非常沒效率，重疊的小塊之間沒有共用特徵。
2. **整張圖丟進分類 CNN**：分類網路為了加深會一路縮小特徵圖，但分割要求輸出跟輸入一樣大。
3. **全卷積、不降採樣**：只用卷積層，一次預測所有像素（輸出 C×H×W 的分數，argmax 得到 H×W 的預測）。問題是在原始解析度上做卷積太貴。

解法是 [FCN](https://arxiv.org/abs/1411.4038)（Long、Shelhamer 與 Darrell，CVPR 2015）這類設計：網路**內部**先降採樣（pooling、strided convolution），再升採樣回原始大小。

升採樣有兩類做法：

- **固定規則的 unpooling**：nearest neighbor 把值複製到整個區塊；「bed of nails」只放在左上角、其餘補 0；max unpooling 記住先前 max pooling 選中的位置，把值放回那個位置。
- **可學習的轉置卷積**：輸入的每個像素乘上 filter，貼到輸出上，重疊的地方相加。投影片用 3×3、stride 2、pad 1 的例子，把 2×2 輸入升到 4×4，並附了一個一維例子：輸出就是「以輸入值加權的 filter 複本」相加。

### U-Net

[U-Net](https://arxiv.org/abs/1505.04597)（Ronneberger et al. 2015）在這個架構上多做一件事。投影片的說法是：降採樣階段擴大視野，但會失去空間資訊；升採樣階段要重建高解析度的輸出。U-Net 把降採樣階段的高解析特徵圖直接**接到**升採樣階段對應的層，把丟掉的細節補回來。A3 的 DDPM 題目起始碼也附了一個 `unet.py`，到[A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)會再遇到它。

## 物件偵測：輸出的數量不固定

### 單一物件：分類加迴歸

如果圖裡只有一個物件，事情很簡單。CNN 的特徵向量接兩個頭：一個輸出類別分數（softmax loss），一個輸出框的四個數字 (x, y, w, h)（L2 loss）。投影片的關鍵句是「把定位當成迴歸問題」，兩個 loss 相加成 multitask loss。

### 多個物件：麻煩在這裡

每張圖的物件數量不同：一隻貓要輸出 4 個數字，三隻動物就要 12 個。固定大小的輸出層放不下。

最直接的想法是切很多塊，逐塊分類成某個物件或背景。問題是位置、尺度、長寬比的組合太多，計算量爆炸。

### 兩階段：R-CNN 家族

**R-CNN**（[Girshick et al., CVPR 2014](https://arxiv.org/abs/1311.2524)）先用 region proposal 方法找出「看起來像物件」的區域。投影片舉 Selective Search 為例：在 CPU 上幾秒內產生約 2000 個候選。每個候選區域縮放成 224×224，各自過一次 ImageNet 預訓練的 CNN，用 SVM 分類，再預測四個修正量 (dx, dy, dw, dh) 微調框的位置。

投影片直接點出問題：非常慢，每張圖要做約 2000 次獨立的 forward。

**Fast R-CNN**（[Girshick, ICCV 2015](https://arxiv.org/abs/1504.08083)）的想法是：先把整張圖過一次 backbone（AlexNet、VGG、ResNet 等），再從特徵圖上裁切每個候選區域並調整大小，交給一個小的逐區域網路，輸出類別與框的偏移。

**Faster R-CNN**（[Ren et al.](https://arxiv.org/abs/1506.01497)）連 region proposal 都交給網路學，也就是 **Region Proposal Network（RPN）**。投影片的例子是：640×480 的輸入經過 CNN 變成 512×20×15 的特徵圖；在特徵圖每個位置想像一個固定大小的 **anchor box**，預測它是不是物件（二元分類），對正例再迴歸四個數字，修正到真實框。實務上每個位置放 K 個不同大小與比例的 anchor，把 K×20×15 個框依「objectness」分數排序，取前約 300 個當候選。

### 單階段：YOLO、SSD、RetinaNet

單階段偵測器把「找候選」和「分類」合成一步。投影片的描述是：把圖切成 7×7 的格子，每格放 B 個基準框，每個框迴歸 5 個數字 (dx, dy, dh, dw, confidence)，再預測 C 個類別的分數（背景也算一類），輸出是 7×7×(5B + C)。投影片說它很像 RPN，差別在於它直接預測類別。

[YOLO](https://arxiv.org/abs/1506.02640)（Redmon et al., CVPR 2016）的標題就是「Unified, Real-Time Object Detection」，投影片也把它標為即時物件偵測。投影片同一頁還列出 SSD 與 RetinaNet（Focal Loss）。

### DETR：不用 anchor

[DETR](https://arxiv.org/abs/2005.12872)（Carion et al., ECCV 2020）把第 8 講的 Transformer 帶進偵測。投影片的三句話：直接從 Transformer 輸出一組框；沒有 anchor，也不迴歸框的變換；用 bipartite matching 把預測框配對到真實框，再訓練模型迴歸框的座標。

## 實例分割：Mask R-CNN

實例分割要同時分出個體和像素。[Mask R-CNN](https://arxiv.org/abs/1703.06870)（He et al., ICCV 2017）的做法很省事：在 Faster R-CNN 上，對每個 RoI 多接一個小的遮罩網路，預測一張 28×28 的二元遮罩。投影片的架構圖裡，每個 RoI 經過 RoI Align 得到 256×14×14 的特徵，輸出 C 個類別分數、每個類別 4 個框座標，以及每個類別一張 C×28×28 的遮罩。投影片還提到它也能做姿態估計。

## 模型在看哪裡？

最後一段從「怎麼做任務」轉到「怎麼理解模型」。

- **可視化第一層 filter**：AlexNet 的第一層是 64 個 3×11×11 的 filter；ResNet-18、ResNet-101、DenseNet-121 都是 64 個 3×7×7。把它們畫成小圖，可以看到邊緣與顏色的偵測器。
- **Saliency map**（[Simonyan et al. 2014](https://arxiv.org/abs/1312.6034)）：算未正規化的類別分數對輸入像素的梯度，取絕對值，再在 RGB 三個通道上取最大值。亮的地方就是改動後最會影響分數的像素。
- **CAM**（[Zhou et al., CVPR 2016](https://arxiv.org/abs/1512.04150)）：網路最後是「卷積特徵 f → 全域平均池化 → 全連接層」時，類別分數可以改寫成「每個位置的特徵用全連接權重加總，再平均」。把平均之前的那張圖拿出來，就是類別熱度圖。限制是只能用在最後一個卷積層。
- **Grad-CAM**（[Selvaraju et al., CVPR 2017](https://arxiv.org/abs/1610.02391)）解決這個限制，步驟見下方。
- **ViT 特徵可視化**：投影片最後一頁引用兩篇 2022 年論文的圖，把同樣的想法用在 ViT。

<details>
<summary>Grad-CAM 的四個步驟（投影片第 140–143 頁）</summary>

```text
1. 任選一層，特徵 A ∈ R^{H×W×K}
2. 算類別分數 S_c 對 A 的梯度 ∂S_c/∂A ∈ R^{H×W×K}
3. 在空間上平均梯度，得到每個通道的權重
   α_k = (1/HW) Σ_{h,w} ∂S_c/∂A_{h,w,k}
4. 熱度圖 M^c_{h,w} = ReLU( Σ_k α_k A_{h,w,k} )
```

</details>

## 自學怎麼做

1. **先看錄影，再翻投影片**：2025 年錄影約 1 小時 13 分。投影片比 2025 版少了 31 頁，但目錄相同。
2. **畫一張表**：把 R-CNN → Fast R-CNN → Faster R-CNN → YOLO → DETR 各自省掉了什麼寫下來。這是本講最容易混淆的地方。
3. **親手算一次轉置卷積**：用投影片的一維例子，在紙上把兩個輸入值與三格 filter 的輸出算出來。
4. **課表建議閱讀**：[FCN](https://arxiv.org/abs/1411.4038)、[Fast R-CNN](https://arxiv.org/abs/1504.08083)、[Faster R-CNN](https://arxiv.org/abs/1506.01497)、[DETR 論文](https://arxiv.org/abs/2005.12872)，以及 DETR 的官方 [blog](https://ai.facebook.com/blog/end-to-end-object-detection-with-transformers/) 與[影片](https://www.youtube.com/watch?v=utxbUlo9CyY)。

## 延伸閱讀

- 對抗樣本、生成模型：[CS230 對抗樣本與生成模型](/posts/ai/2026-08-16-cs230-adversarial-and-generative)
- 同一套 Transformer 基礎：[L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)
- 更完整的深度學習理論課：[MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS231N Lecture 9 投影片（Spring 2026）](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) — 本文所有架構、數字與例子的出處
- [CS231N Lecture 9 投影片（Spring 2025）](https://cs231n.stanford.edu/slides/2025/lecture_9.pdf) — 比對用，同樣沒有對抗樣本與風格轉換
- [CS231N 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html) — 4/28 講次主題與建議閱讀
- [Spring 2025 Lecture 9 錄影](https://www.youtube.com/watch?v=PTypu6GqEd4)
- [Long, Shelhamer & Darrell, Fully Convolutional Networks for Semantic Segmentation（CVPR 2015）](https://arxiv.org/abs/1411.4038)
- [Ronneberger et al., U-Net（2015）](https://arxiv.org/abs/1505.04597)
- [Girshick et al., Rich feature hierarchies for accurate object detection and semantic segmentation（CVPR 2014）](https://arxiv.org/abs/1311.2524)
- [Girshick, Fast R-CNN（ICCV 2015）](https://arxiv.org/abs/1504.08083)
- [Ren et al., Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks](https://arxiv.org/abs/1506.01497)
- [Redmon et al., You Only Look Once（CVPR 2016）](https://arxiv.org/abs/1506.02640)
- [Carion et al., End-to-End Object Detection with Transformers（ECCV 2020）](https://arxiv.org/abs/2005.12872)
- [He et al., Mask R-CNN（ICCV 2017）](https://arxiv.org/abs/1703.06870)
- [Simonyan, Vedaldi & Zisserman, Deep Inside Convolutional Networks（ICLR Workshop 2014）](https://arxiv.org/abs/1312.6034)
- [Zhou et al., Learning Deep Features for Discriminative Localization（CVPR 2016）](https://arxiv.org/abs/1512.04150)
- [Selvaraju et al., Grad-CAM（CVPR 2017）](https://arxiv.org/abs/1610.02391)
