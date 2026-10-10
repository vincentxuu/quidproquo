---
title: "CS231N L1：電腦視覺從哪裡來，這門課要走到哪裡"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, imagenet]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 1
tldr: "CS231N 2026 的第一講分成兩份投影片。第一份用一條時間軸講視覺與深度學習的歷史：從 Hubel & Wiesel 的貓實驗、Marr 的視覺表示階段，到 Neocognitron、backprop、LeNet，再到 ImageNet 與 AlexNet 把兩條線接起來。第二份講課程地圖、評分與規則，並把作業全面搬到 Colab。讀完這一講，你會知道後面 17 講各自在補哪一塊。"
description: "Stanford CS231N（Spring 2026）第一講導讀：依 lecture_1_part_1.pdf、lecture_1_part_2.pdf 與官方課表，整理投影片怎麼串起電腦視覺與神經網路兩條歷史線、ImageNet 與 AlexNet 為什麼是交會點、課程單元怎麼切、評分與 Honor Code 寫了什麼；錄影可參考 Spring 2025 YouTube 的 Lecture 1。"
draft: false
glossary:
  - term: "ImageNet"
    definition: "Deng 等人 2009 年發表的大規模影像資料集；CS231N 投影片列為約 1,500 萬張圖、2.2 萬類，分類挑戰賽使用其中 1,000 類。"
    context: "L1 把它當作電腦視覺與深度學習兩條歷史線的交會點。"
  - term: "Neocognitron"
    definition: "Fukushima 1980 年提出的視覺計算模型，受 Hubel & Wiesel 的簡單細胞與複雜細胞啟發，交錯使用類似卷積與池化的層，但沒有實用的訓練演算法。"
    context: "L1 時間軸上 CNN 的前身。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-intro-vision-history-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：投影片依據 Spring 2026；錄影可參考 [Spring 2025 Lecture 1](https://www.youtube.com/watch?v=2fq9wYslV0A)（YouTube）。兩者可能有差異，本文內容以 2026 投影片為準。本文是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 1 篇；課程定位、評分、存取缺口與 10 週路線，請看[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)。

[CS231N](https://cs231n.stanford.edu/) 2026 年的第一講在 3 月 31 日，由 Fei-Fei Li 與 Ehsan Adeli 主講。[課表](https://cs231n.stanford.edu/schedule.html)上它掛了兩份投影片：[part 1](https://cs231n.stanford.edu/slides/2026/lecture_1_part_1.pdf) 講電腦視覺與深度學習的簡史，[part 2](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf) 講課程概覽與規則。

這一講沒有公式。它的任務是讓你知道：這門課為什麼從「影像分類」開始，又為什麼一路走到生成模型、3D 與 world modeling。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=2fq9wYslV0A
title: Spring 2025 Lecture 1: Introduction（YouTube）
```

原始影片：[Spring 2025 Lecture 1: Introduction（YouTube）](https://www.youtube.com/watch?v=2fq9wYslV0A)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 一張文氏圖定位這門課

Part 1 前段用一張逐步長大的文氏圖定位課程（投影片註明靈感來自 Justin Johnson）。先有 Artificial Intelligence，裡面放進 Machine Learning，再把 Computer Vision 和 Deep Learning 放上去，最後標出「This class」：電腦視覺和深度學習的交集。

圖的外圍還放了數學、神經科學、物理、心理學、生物、電腦科學。這張圖的意思是：這門課會借用很多領域的想法，但主線只有一條，就是用深度學習解視覺問題。

更前面有一頁寫著三個詞：Big Data、Neural networks、GPUs，合起來叫「Modern AI Revolution」。這三個詞就是整段歷史的伏筆。

## 第一條線：電腦視覺怎麼一步步變成「辨識」問題

投影片從很遠的地方開始：5.3 到 5.4 億年前的寒武紀大爆發（投影片寫「Evolution's Big Bang」），然後是 camera obscura。接著才進入電腦視覺本身，下面按投影片時間軸的順序列：

- **1959 Hubel & Wiesel**：量測貓的大腦活動，發現簡單細胞對特定方向的邊緣有反應，複雜細胞對方向與移動有反應，並帶一點平移不變性
- **1963 Larry Roberts**：「Machine Perception of Three-Dimensional Solids」，從原圖取出邊緣、再選出特徵點
- **1970 年代 David Marr**：把視覺表示分成 primal sketch、2½-D sketch、3-D model 幾個階段
- **1970 年代**：用部件辨識物體，例如 generalized cylinders 與 pictorial structures
- **1986 Canny**、1987 Lowe：靠邊緣偵測做辨識
- **1997 Normalized Cuts**（Shi & Malik）：靠分群（grouping）做辨識
- **1999 SIFT**（David Lowe）：靠特徵匹配做辨識
- **2001 Viola & Jones 人臉偵測**：投影片稱它是機器學習最早成功應用在視覺上的例子之一
- **PASCAL VOC、Caltech101**：開始出現標準化的辨識資料集與挑戰

中間還穿插一段「AI winter」：專家系統沒有兌現承諾，經費縮水，但視覺、NLP、機器人等子領域仍在成長。同一時期認知科學與神經科學的研究，例如快速序列視覺呈現（RSVP）實驗，以及投影片以「150 ms !!」標出的 Thorpe 等人 1996 年 Nature 研究，讓投影片得出一句結論：「Visual recognition is a fundamental task for visual intelligence」。

這句話解釋了課程的起點。視覺研究走了幾十年，最後把重心放在「辨識」上，所以 L2 從影像分類開始。

## 第二條線：神經網路怎麼從失寵走回來

同一條時間軸上，投影片疊上神經網路的歷史：

- **1958 Perceptron**（Rosenblatt）
- **1969 Minsky & Papert**：證明感知器學不會 XOR，投影片說這讓整個領域大失所望
- **1980 Neocognitron**（Fukushima）：直接受 Hubel & Wiesel 啟發，交錯使用簡單細胞（卷積）與複雜細胞（池化），但沒有實用的訓練演算法
- **1986 Backprop**（Rumelhart、Hinton、Williams）：成功訓練多層感知器
- **1998 LeNet**（LeCun 等人）：把 backprop 用在類似 Neocognitron 的架構上辨識手寫數字，還被 NEC 部署去處理支票。投影片說它「跟現代的卷積網路非常像」
- **2006 起的「Deep Learning」**：大家試著訓練更深的網路，但投影片特別加了一行：「No good dataset to work on」

最後這行是兩條線交會的關鍵。演算法已經有了，缺的是資料。

## 交會點：ImageNet 與 AlexNet

投影片接著列出資料集的規模：Caltech101 約 9K 張、LabelMe 37K、PASCAL VOC 30K、SUN 131K，然後是 ImageNet 的 1,500 萬張、2.2 萬類（Deng 等人，CVPR 2009）。ImageNet 分類挑戰賽使用其中 1,000 類、1,431,167 張圖。

時間軸上的下一個節點就是 **2012 AlexNet**。從這裡開始，投影片用一張 ImageNet top-1 準確率逐年上升的圖，加上頂級電腦視覺會議投稿數暴增的圖，說明「2012 to Present: Deep Learning Explosion」。Part 2 也提到，2009 年的原始 ImageNet 論文在 CVPR 2019 拿到 IEEE PAMI Longuet-Higgins Prize，這個獎頒給十年前影響最大的一篇電腦視覺論文。

接下來十幾頁是「Deep Learning is Everywhere」的展示，大致對應後面的課程：

| 投影片展示 | 對應講次 |
|---|---|
| AlexNet（2012）→ ResNet（2015）→ ViT（2021）→ DiT（2023） | L5、L6、L8、L14 |
| Faster R-CNN 偵測、Segment Anything 分割 | L9 |
| 影片理解與行為辨識 | L10 |
| 早期影像描述（2015）對比 2026 年 Gemini 3 的詳細描述 | L7、L16 |
| GAN、DALL·E 與後續的影像生成 | L13、L14 |

最後幾頁轉向限制與責任：電腦視覺「still has a long way to go」、會造成傷害（刻板印象、影響求職結果），也能救命（醫院與居家照護的環境感測）。投影片把視覺智慧拆成 Understanding、Reasoning、Generation 三件事，並以 Spatial Intelligence 與 World Modeling 收尾。

## 課程地圖：官方材料的切法不完全一致

Part 2 的概覽頁把課程分成四塊：

1. Deep Learning Basics
2. Perceiving and Understanding the Visual World
3. Generative and Interactive Visual Intelligence
4. Human-Centered Applications and Implications

但同一份投影片的結尾頁寫成：Deep Learning Basics（L2–4）、Perceiving and Understanding the Visual World（L5–12）、Reconstructing and Interacting with the Visual World（L13–17）、Human-Centered Artificial Intelligence（L18）。[官方課表](https://cs231n.stanford.edu/schedule.html)則只有三個單元：L2–L4、L5–L11、L12–L18。

三份切法的差別在 L12（自監督學習）歸哪一塊，以及 L18 要不要獨立。本系列照課表的三單元走，L18 在最後一篇處理。

Part 2 對每一塊舉的例子，大致就是後面的講次：

- **基礎**：影像分類 → 線性分類器 → 正則化與最佳化 → 神經網路
- **感知與理解**：分類以外的任務（語意分割、物件偵測、實例分割、影片、可視化），MLP 以外的模型（CNN、RNN、Transformer），以及大規模分散式訓練（資料平行、模型平行、同步與非同步更新）
- **生成與互動**：自監督學習、風格轉換與影像生成、視覺語言模型（以 CLIP 的對比式預訓練為例）、3D 視覺、embodied intelligence。投影片寫明 A3 要實作一個「從文字生成 emoji」的生成模型

## 課程規則：Colab、Honor Code 與新增的期中考

Part 2 的後半是行政。跟自學者有關的幾點：

- **作業全部在 Google Colab 上做**。A1 在 4/2 發佈、4/16 截止，內容是 kNN、Softmax 線性分類器、兩層神經網路、影像特徵、深層網路與最佳化器
- **每份作業都有程式與書面兩部分**。程式部分自動評分，書面部分由助教批改
- **評分**：三份作業 12% + 18% + 15% = 45%，期中考 20%（投影片標為「New」），專題 35%，參與最多 3% extra credit
- **Honor Code 四條**：不看別人的解答或程式（包括 AI 工具產生的）、不分享自己的程式、註明合作者，以及「Do not submit AI-generated responses」
- **學習目標**：把視覺應用形式化成任務、學會寫程式除錯與訓練 CNN、使用 PyTorch 與 TensorFlow 等框架、了解領域現況與倫理考量

選修教材列了三本免費書：Goodfellow 等人的《Deep Learning》、《Mathematics of deep learning》（投影片建議看第 5、6、7 章補向量微積分與連續最佳化），以及《Dive into Deep Learning》。

## 讀完這一講，今晚可以做什麼

如果你打算跟完這個系列，今晚做兩件事：

1. 打開 [cs231n.github.io 的 Python/Numpy 教學](https://cs231n.github.io/python-numpy-tutorial/)，確認 broadcasting 和向量化運算都看得懂。A1 的 kNN 題會要求你寫出不用迴圈的距離計算
2. 把 part 1 的時間軸自己畫一次，在每個節點旁邊寫上它對應後面哪一講。L2 開始就會用到「data-driven」這個想法，它正是 ImageNet 那一段歷史的結論

2026 的錄影只在 Canvas，校外讀者看不到。想聽講的話，[Spring 2025 的 Lecture 1](https://www.youtube.com/watch?v=2fq9wYslV0A) 在 YouTube 上，長約 1 小時；它跟 2026 投影片的差異我沒有逐頁比對。

## 延伸閱讀

- [Stanford CS231N 導讀：總覽與自學路線](/posts/ai/2026-09-30-cs231n-course-overview)：存取等級、評分、2025 錄影對照與 10 週路線
- [CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：同一段神經網路史，從一般深度學習課的角度

**系列導覽**：上一篇 [總覽與自學路線](/posts/ai/2026-09-30-cs231n-course-overview)｜下一篇 [L2：影像分類、kNN 與線性分類器](/posts/ai/2026-09-30-cs231n-image-classification-linear)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS231n 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231n 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html)
- [Lecture 1 Part 1 投影片：Introduction（2026）](https://cs231n.stanford.edu/slides/2026/lecture_1_part_1.pdf)
- [Lecture 1 Part 2 投影片：Overview（2026）](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf)
- [Spring 2025 Lecture 1: Introduction（YouTube）](https://www.youtube.com/watch?v=2fq9wYslV0A)
- [CS231n Python/Numpy 教學](https://cs231n.github.io/python-numpy-tutorial/)
- [Deng et al. (2009). ImageNet: A large-scale hierarchical image database. CVPR](https://www.image-net.org/static_files/papers/imagenet_cvpr09.pdf)
- [Krizhevsky, Sutskever & Hinton (2012). ImageNet Classification with Deep Convolutional Neural Networks. NeurIPS](https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
