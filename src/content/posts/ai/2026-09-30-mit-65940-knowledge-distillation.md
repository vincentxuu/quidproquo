---
title: "MIT 6.5940 L9 知識蒸餾：讓大模型教小模型，要對齊的不只是輸出機率"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, knowledge-distillation, efficient-ml, ai-course, mit]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 11
tldr: "MIT 6.5940 Fall 2024 第 9 講分五段：知識蒸餾（KD）的定義與 temperature、六種可以對齊的東西（logits、權重、特徵、梯度、稀疏模式、關係）、不需要固定大老師的 self／online 蒸餾、偵測／分割／GAN／NLP／LLM 上的 KD，以及專為小模型設計的 Network Augmentation。溫度從 T=1 調到 T=10，老師對「貓 vs 狗」的輸出從 0.982／0.017 變成 0.599／0.401，這一步就是 KD 能傳遞「暗知識」的起點。"
description: "MIT 6.5940（Fall 2024）Lecture 9 Knowledge Distillation 導讀：Hinton KD 與 temperature softmax、matching logits／intermediate weights（FitNets）／features（NST）／attention maps／sparsity patterns／relational information（FSP、RKD）、Born-Again Networks、Deep Mutual Learning、Be Your Own Teacher、物件偵測與語意分割的 KD、GAN Compression、MobileBERT、Minitron，以及 NetAug 為什麼對小模型比資料增強有效。"
draft: false
glossary:
  - term: "knowledge distillation"
    aliases: ["KD", "知識蒸餾", "蒸餾"]
    definition: "訓練一個小的學生模型，除了原本的標籤 loss，也讓它對齊一個大的老師模型的輸出（或中間表徵），把老師學到的資訊傳給學生。"
    context: "MIT 6.5940 L9 的主題；投影片以 Hinton et al. 2014 的定義為起點。"
    links:
      - label: "Hinton et al., Distilling the Knowledge in a Neural Network"
        url: "https://arxiv.org/abs/1503.02531"
  - term: "softmax temperature"
    aliases: ["temperature", "溫度"]
    definition: "softmax 裡把 logits 先除以 T 再取指數；T 越大，輸出的機率分佈越平滑，非最大類別的機率越看得出來。"
    context: "L9 投影片第 9–10 頁；一般訓練時 T=1。"
  - term: "Network Augmentation"
    aliases: ["NetAug"]
    definition: "訓練小模型時，把它加寬成幾個較大的模型並讓小模型當它們的子模型，額外的 loss 提供監督；推論時只留小模型，沒有額外成本。"
    context: "L9 最後一段，Cai et al. ICLR 2022。"
    links:
      - label: "Network Augmentation for Tiny Deep Learning"
        url: "https://arxiv.org/abs/2110.08890"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en)

這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 11 篇，對應 [Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940)上的 **Lecture 9：Knowledge Distillation**，2024 年 10 月 3 日上課，講者 Song Han。材料有兩份，都公開：

- 投影片 [Lec09-Knowledge-Distillation.pdf](https://www.dropbox.com/scl/fi/fjgnue7z3mi1ynxbd0y5k/Lec09-Knowledge-Distillation.pdf?rlkey=cup1qhlpx3vx0nrs7wuwj6m0d&st=jzhogqwp&dl=0)（84 頁，下文頁碼都指 PDF 頁）
- 錄影 [EfficientML.ai Lecture 9 - Knowledge Distillation](https://www.youtube.com/watch?v=Ubj3QXv4rjw)

存取等級是 [課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) 的 **A3 足以自學**，但這一講沒有對應的 lab。**Fall 2026 對照**：截至 2026-09-30，[Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940)只放出 L1–L6，這一講還沒上線。

## 為什麼這門課要講蒸餾

前幾講的工具，pruning、quantization、[NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware)，都在改模型本身：砍掉參數、降低位元、換一個更省的架構。這一講問的是另一件事：架構定了、模型很小，**怎麼把它訓練得更好？**

第 3–4 頁先把落差攤開：Cloud AI 的算力是 19.5 TFLOPS（fp32）、記憶體 80GB；Tiny AI 只有 MFLOPs 等級的算力與 256kB 記憶體。能在後者上跑的只能是 MCUNet、MobileNetV2-Tiny 這種小網路。第 5 頁再補一個觀察：小模型在大資料集上會 underfit。投影片對照 ResNet50 與 MobileNetV2-Tiny 的訓練曲線，然後問：

> "Can we help the training of tiny models with large models?"

第 2 頁列出的講次計畫就是這個問題的五個答案：

1. What is knowledge distillation
2. What to match
3. Self and online distillation
4. Distillation for different tasks
5. Network augmentation

## 一、KD 是什麼：溫度讓老師把「次佳答案」說出來

第 6 頁的架構圖：同一個輸入同時餵給老師（大）與學生（小），學生的 loss 有兩項，一項是針對標籤的 classification loss，另一項是對齊老師輸出的 distillation loss。出處是 [Hinton et al.（NeurIPS Workshops 2014）](https://arxiv.org/abs/1503.02531)。

第 7–9 頁用一個兩類例子說明為什麼要對齊「機率」而不只是標籤：

| | logits（貓, 狗） | 機率 T=1 | 機率 T=10 |
|---|---|---|---|
| 老師 | 5, 1 | 0.982, 0.017 | 0.599, 0.401 |
| 學生 | 3, 2 | 0.731, 0.269 | — |

學生比老師「沒那麼有把握」。T=1 時老師的輸出幾乎是 one-hot，「狗」只有 0.017，學生從它學不到多少額外資訊；把溫度調到 10，分佈變平，「這張圖其實有點像狗」這種資訊才浮上來。第 9 頁的原話：

> "A larger temperature smooths the output probability distribution."

<details>
<summary>正式定義（第 10 頁）</summary>

softmax 把 logits zᵢ 轉成類別機率：

p(zᵢ, T) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T)，i, j = 0, 1, …, C − 1

C 是類別數，T 是溫度，一般設為 1。KD 的目標是讓老師與學生的類別機率分佈對齊。第 13 頁給了兩種對齊 logits 的 loss：cross entropy −p_t log p_s，或 L2 loss E‖p_t − p_s‖²（後者出自 [Ba and Caruana, NeurIPS 2014](https://arxiv.org/abs/1312.6184)）。

</details>

## 二、要對齊什麼：六個選項

第 12 頁列出六種可以從老師傳給學生的東西。這一段是整講的主體：

| 對齊對象 | 直覺 | 投影片引用 |
|---|---|---|
| 1. Output logits | 對齊最後的機率分佈 | Hinton et al.；Ba and Caruana（第 13 頁） |
| 2. Intermediate weights | 在 cross-entropy 蒸餾之外，再加一項老師與學生權重之間的 L2 loss；形狀不同就用線性轉換對齊 | [FitNets](https://arxiv.org/abs/1412.6550)（第 16 頁） |
| 3. Intermediate features | 老師與學生不只輸出分佈要像，特徵分佈也要像；做法是最小化 feature map 之間的 maximum mean discrepancy | [Neuron Selectivity Transfer](https://arxiv.org/abs/1707.01219)（第 18 頁） |
| 4. Gradients（attention maps） | 用 ∂L/∂x 定義 CNN 的「注意力」：這個值大，代表位置 (i, j) 的小擾動會大幅改變輸出；讓學生對齊老師的注意力圖 | [Attention Transfer](https://arxiv.org/abs/1612.03928)（第 20–22 頁） |
| 5. Sparsity patterns | ReLU 之後哪些神經元的輸出大於 0（ρ(x) = 1[x > 0]），老師與學生應該相似 | [Heo et al., AAAI 2019](https://arxiv.org/abs/1811.03233)（第 24 頁） |
| 6. Relational information | 對齊「關係」而不是個別輸出：層與層之間，或樣本與樣本之間 | FSP、RKD（第 26–28 頁） |

第 4 項有一個支持它的觀察（第 21 頁）：表現好的 ImageNet 模型，注意力圖彼此相似；ResNet-34（73%）與 ResNet-101（77.3%）的注意力圖很像，表現較差的 Network-In-Network（62%）則很不一樣。

第 6 項有兩種：

- **層與層之間**（[Yim et al., CVPR 2017](https://openaccess.thecvf.com/content_cvpr_2017/html/Yim_A_Gift_From_CVPR_2017_paper.html)）：兩層特徵做內積，得到一個 C_in × C_out 的矩陣（空間維度被消掉），再讓學生的矩陣對齊老師的。所以老師與學生的層數可以不同。
- **樣本與樣本之間**（[Relational KD](https://arxiv.org/abs/1904.05068)）：取 n 個樣本的特徵，算兩兩距離，得到長度 n(n−1)/2 的向量 ψ，讓學生的 ψ 對齊老師的。傳的是「哪些樣本彼此接近」的結構，不是個別輸出。

## 三、一定要有一個固定的大老師嗎？

第 31 頁把一般 KD 的前提講出來：老師通常比學生大，而且固定不動。然後在投影片上丟出討論題：固定大老師有什麼缺點？一定要有嗎？接下來三種做法都在鬆綁這個前提。

**Self distillation：[Born-Again Networks](https://arxiv.org/abs/1805.04770)**（第 32–33 頁）。架構完全相同：T = S₁ = S₂ = … = Sₖ。第一代用標籤訓練，之後每一代用上一代當老師，同時保留分類目標。投影片寫的結果是準確度 T < S₁ < S₂ < … < Sₖ，把各代集成起來還能再好一點。

**Online distillation：[Deep Mutual Learning](https://arxiv.org/abs/1706.00384)**（第 35–36 頁）。兩個網路（可以相同也可以不同）一起從零訓練，各自的 loss 是 CrossEntropy(S(I), y) + KL(S(I), T(I))，互相當對方的老師。第 36 頁的表裡，兩個 ResNet-32 互學，在 CIFAR-100 上分別從 68.99% 升到 71.19% 與 70.75%。

**兩者結合：[Be Your Own Teacher](https://arxiv.org/abs/1905.08094)**（第 38–39 頁）。把 ResNet 依深度切成四段，每段後面接一個分類器，用較深的分類器蒸餾較淺的。直覺是後段的預測比較可靠。推論時可以只留需要的分類器，其他部分拿掉。

## 四、不同任務怎麼蒸餾

分類之外，投影片走過五種任務，每種都有自己要處理的麻煩：

- **物件偵測：feature imitation**（[Chen et al., NeurIPS 2017](https://papers.nips.cc/paper_files/paper/2017/hash/e1e32e235eee1f970470a3a6658dfdd5-Abstract.html)，第 41–44 頁）。用 1×1 conv 對齊形狀；前景與背景用不同權重，處理類別不平衡；把老師的預測當成學生的上限，學生超過老師一定幅度後，這項 loss 歸零。
- **物件偵測：localization distillation**（[Zheng et al., CVPR 2022](https://arxiv.org/abs/2102.12252)，第 45–48 頁）。把 bounding box 回歸改成分類：把座標軸切成若干 bin（投影片畫的是 6 個），老師與學生各自預測一個機率分佈，再對分佈做蒸餾。
- **語意分割**（[Liu et al., CVPR 2019](https://openaccess.thecvf.com/content_CVPR_2019/html/Liu_Structured_Knowledge_Distillation_for_Semantic_Segmentation_CVPR_2019_paper.html)，第 49–50 頁）。除了 feature imitation，再加一個 discriminator，學生要騙過它，形成 adversarial loss。
- **GAN**（[GAN Compression](https://arxiv.org/abs/2003.08936)，第 51–54 頁）。在 NVIDIA Jetson Nano GPU 上，原本的 CycleGAN 是 56.8G MACs、1.6 FPS、FID 24.2；壓縮後 4.81G MACs（11.8 倍）、3.9 FPS（2.5 倍）、FID 26.6（越低越好）。
- **NLP**（[MobileBERT](https://arxiv.org/abs/2004.02984)，第 55–56 頁）。除了 feature imitation，也讓學生模仿老師的 attention map。
- **LLM／VLM**（第 57–58 頁）。投影片的判斷是「pruning 與 distillation 已經是取得小型 LLM 的常見做法」，引用 Meta 2024 年的 Llama 3.2 公告與 [Minitron（NeurIPS 2024）](https://arxiv.org/abs/2407.14679)：先剪枝，再在重新訓練時用 KD。

## 五、Network Augmentation：小模型需要的是更多容量，不是更多正則化

最後一段翻轉了一般訓練技巧的直覺。第 60–66 頁先回顧兩類常見的防 overfitting 手段：資料增強（Cutout、Mixup、AutoAugment）與 dropout（SpatialDropout、DropBlock）。

第 67–69 頁的對照：這些手段能提升 ResNet50（4.1G MACs）在 ImageNet 上的表現，卻會**傷害** MobileNetV2-Tiny（23.5M MACs）。原因在第 69 頁：小模型缺的是容量。它本來就 underfit，再加正則化只會更糟。

[NetAug](https://arxiv.org/abs/2110.08890)（Cai et al., ICLR 2022，第 70–80 頁）反過來做：訓練時把小模型**加寬**成較大的模型，讓小模型當它的子模型，多一項輔助監督。第 75 頁引用論文的 loss：

L_aug = L(W_base) + α · L([W_base, W_aug])

第一項是小模型本身的 loss，第二項是「作為加寬模型的一部分」時的 loss。論文寫訓練時的額外成本是 16.7%，推論時是零，因為部署的只有原本的小模型。

投影片列的結果：

- 小模型（MobileNetV2-Tiny）用 NetAug 後，訓練與驗證準確度都提升；ResNet50 這種大模型本來就沒有 underfitting，套用 NetAug 反而加重 overfitting：訓練準確度變高、驗證準確度變低（第 76–77 頁的學習曲線與圖說）。
- NetAug 與 KD 互不衝突，可以疊加（第 78 頁）。
- 遷移學習上，NetAug 比 KD 與「訓練 4 倍 epoch」表現更好，雖然三者在 ImageNet 上的準確度相近（第 79 頁）。
- 在 YOLOv3 + MobileNetV2 w0.35 的偵測任務上，圖中標出 Pascal VOC 與 COCO 分別省下 38% 與 41% MACs（第 80 頁）。

這一段跟 NAS 那兩講用到同一個點子：一個大網路裡包含小網路、共享權重。OFA 用它來搜架構，NetAug 用它來幫小網路訓練。

## 讀完這一講，接下來怎麼接

第 81 頁的總結重申五段內容，並預告下一講：[L10 MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml)，一個在微控制器上跑 TinyML 的演算法與系統共同設計框架。

如果要挑重點讀：第一段的溫度例子（第 7–10 頁）與第二段的六種對齊對象（第 12–28 頁）是 KD 的核心；第五段的 NetAug（第 67–80 頁）是這門課特有的角度，直接回答「小模型為什麼難訓練」。

如果你是從 [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 過來的：lab 裡直接從 OFA super network 抽出子網路，沒有再訓練；這一講提供的是另一條路，架構定下來之後，還能靠蒸餾或 NetAug 把它訓練得更好。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lec09-Knowledge-Distillation.pdf（Fall 2024 投影片）](https://www.dropbox.com/scl/fi/fjgnue7z3mi1ynxbd0y5k/Lec09-Knowledge-Distillation.pdf?rlkey=cup1qhlpx3vx0nrs7wuwj6m0d&st=jzhogqwp&dl=0)
- [EfficientML.ai Lecture 9 - Knowledge Distillation（YouTube）](https://www.youtube.com/watch?v=Ubj3QXv4rjw)
- [Hinton et al., Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Ba and Caruana, Do Deep Nets Really Need to be Deep?](https://arxiv.org/abs/1312.6184)
- [Romero et al., FitNets（ICLR 2015）](https://arxiv.org/abs/1412.6550)
- [Huang and Wang, Like What You Like: Neuron Selectivity Transfer](https://arxiv.org/abs/1707.01219)
- [Zagoruyko and Komodakis, Attention Transfer（ICLR 2017）](https://arxiv.org/abs/1612.03928)
- [Heo et al., Distillation of Activation Boundaries（AAAI 2019）](https://arxiv.org/abs/1811.03233)
- [Yim et al., A Gift from Knowledge Distillation（CVPR 2017）](https://openaccess.thecvf.com/content_cvpr_2017/html/Yim_A_Gift_From_CVPR_2017_paper.html)
- [Park et al., Relational Knowledge Distillation](https://arxiv.org/abs/1904.05068)
- [Furlanello et al., Born-Again Neural Networks（ICML 2018）](https://arxiv.org/abs/1805.04770)
- [Zhang et al., Deep Mutual Learning（CVPR 2018）](https://arxiv.org/abs/1706.00384)
- [Zhang et al., Be Your Own Teacher（ICCV 2019）](https://arxiv.org/abs/1905.08094)
- [Chen et al., Learning Efficient Object Detection Models with Knowledge Distillation（NeurIPS 2017）](https://papers.nips.cc/paper_files/paper/2017/hash/e1e32e235eee1f970470a3a6658dfdd5-Abstract.html)
- [Zheng et al., Localization Distillation（CVPR 2022）](https://arxiv.org/abs/2102.12252)
- [Liu et al., Structured Knowledge Distillation for Semantic Segmentation（CVPR 2019）](https://openaccess.thecvf.com/content_CVPR_2019/html/Liu_Structured_Knowledge_Distillation_for_Semantic_Segmentation_CVPR_2019_paper.html)
- [Li et al., GAN Compression（CVPR 2020）](https://arxiv.org/abs/2003.08936)
- [Sun et al., MobileBERT（ACL 2020）](https://arxiv.org/abs/2004.02984)
- [Muralidharan et al., Compact Language Models via Pruning and Knowledge Distillation（Minitron, NeurIPS 2024）](https://arxiv.org/abs/2407.14679)
- [Cai et al., Network Augmentation for Tiny Deep Learning（ICLR 2022）](https://arxiv.org/abs/2110.08890)
- [全球 AI／CS 課程地圖（A0–A3 分級）](/posts/learning/2026-08-21-global-ai-cs-course-map)
