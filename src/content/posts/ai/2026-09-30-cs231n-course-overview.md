---
title: "Stanford CS231N 導讀：總覽與自學路線（Spring 2026）"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, course-guide]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 0
tldr: "CS231N 是 Stanford 的電腦視覺深度學習課，Spring 2026 版的 16 講投影片、三份作業的題目頁與起始碼、課程筆記與專題規範都公開，本系列評為 A3（足以自學）。缺口有三個：2026 錄影只放在 Canvas、L17 與 L18 沒有投影片、期中考不公開。可以拿 2026 的投影片和作業，配 2025 年的 YouTube 錄影，照官方課表排 10 週。"
description: "Stanford CS231N: Deep Learning for Computer Vision（Spring 2026）系列總覽：依官方首頁、課表、作業頁、專題頁、cs231n.github.io 筆記與 Spring 2025 YouTube 播放清單，整理課程定位、評分與先修、校外讀者拿得到哪些材料、2026 教材與 2025 錄影怎麼對照，以及照官方課表排的 10 週自學路線。"
draft: false
glossary:
  - term: "A3 足以自學"
    definition: "本站課程地圖的存取等級之一：系統化教材加上作業與必要檔案都公開，可以照順序自學。"
    context: "CS231N Spring 2026 被評為 A3，但錄影年份與 2026 教材不同。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-course-overview-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：投影片與作業依據 Spring 2026；錄影依據 Spring 2025（YouTube）。兩者可能有差異，下面逐項標出。本文是 Stanford CS231N 導讀系列的第 0 篇，也是入口。

[CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) 是 Stanford 的電腦視覺課。2026 年 9 月 30 日打開課程首頁，標題寫的是「Stanford - Spring 2026」，講者有五位：Fei-Fei Li、Ehsan Adeli、Justin Johnson、Zane Durante、Tiange Xiang。

首頁的課程描述把重點放在「端到端學習」：10 週內，學生要自己實作、訓練神經網路，並讀懂電腦視覺的前沿研究。課程首頁上還放了一個在瀏覽器裡即時分類 CIFAR-10 圖片的小型 CNN，旁邊寫著「By the end of the class, you will know exactly what all these numbers mean」。

這篇回答三個問題：這門課教什麼、校外讀者實際拿得到什麼、怎麼排 10 週把它讀完。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。2026-10-10 已即時重查：官方 Spring 2026 課表沒有列出錄影連結，也沒有找到 Spring 2026 的公開播放清單；Spring 2025 的公開播放清單沒有對應本文範圍的單一講次。查核日期：2026-10-10。

課程與錄影入口：

- [Stanford CS231N Deep Learning for Computer Vision I 2025（YouTube 播放清單）](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 這門課的硬事實

**上課時間與地點**：週二、週四 12:00–1:20 PM（太平洋時間），在 NVIDIA Auditorium。週五另有 discussion section。

**評分**（[首頁](https://cs231n.stanford.edu/) Coursework 一節）：

| 項目 | 權重 | 細項 |
|---|---|---|
| 作業 | 45% | A1 12%、A2 18%、A3 15%（[作業頁](https://cs231n.stanford.edu/assignments.html)） |
| 期中考 | 20% | 5 月 12 日課堂考，細節在 Ed 公告 |
| 期末專題 | 35% | Proposal 1%、三次 Milestone 各 3%、Final Report 20%、Poster 5%（[專題頁](https://cs231n.stanford.edu/project.html)） |
| 參與 | 最多 3% extra credit | 表現最好的學生拿滿 3%，其他人按比例 |

第一講投影片的評分頁把期中考標成「New」。遲交規則是整學期 4 天免費遲交日，每份作業最多用 2 天，用完之後每遲一天扣 25%；期末報告不能用遲交日。

**先修**（首頁 Prerequisites）：

- Python 熟練，作業用 numpy
- 微積分與線性代數（舉例 MATH 19、MATH 51），要會求導、看得懂矩陣向量記號
- 基礎機率統計（舉例 [CS109](/posts/learning/2026-08-21-stanford-cs109-probability)），要對高斯分佈、平均、標準差有直覺

**作業政策**：作業頁寫明「往年解答有人放在網路上，我們知道」，並要求每份作業都是自己的成果。生成式 AI 比照協作者處理，要註明用法；用它「substantially complete」作業段落就違反 Honor Code。第一講投影片說得更直接：Rule 4 是「Do not submit AI-generated responses」。

## 課表：18 講，三個單元

[官方課表](https://cs231n.stanford.edu/schedule.html)從 3 月 31 日排到 6 月 10 日，共 18 講，分成三個單元：

1. **Deep Learning Basics**（L2–L4）：影像分類與線性分類器、正則化與最佳化、神經網路與反向傳播
2. **Perceiving and Understanding the Visual World**（L5–L11）：CNN、CNN 架構、RNN、Attention 與 Transformer、偵測／分割／可視化、影片理解、大規模分散式訓練
3. **Generative and Interactive Visual Intelligence**（L12–L18）：自監督學習、兩講生成模型、3D 視覺、視覺與語言、World Modeling（客座 Gordon Wetzstein）、Human-Centered AI

單元的切法在官方材料裡並不一致。第一講投影片的概覽頁列了四塊（多一塊「Human-Centered Applications and Implications」），結尾頁又寫成 L2–4、L5–12、L13–17、L18 四段。本系列以課表為準。

Discussion section 有六次：Python/Numpy、Backprop、Final Project 說明、PyTorch、RNNs & Transformers、Midterm review。

## 校外讀者拿得到什麼：A3，附三個缺口

本站的[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)把公開程度分成 A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。CS231N Spring 2026 評為 **A3**，理由如下：

| 材料 | 公開狀態（2026-09-30 查核） |
|---|---|
| 投影片 | L1（兩份）到 L16 都能從課表下載，另有 Backprop、Project、RNNs & Transformers 三份 section 投影片 |
| 作業題目頁 | [A1](https://cs231n.github.io/assignments2026/assignment1/)、[A2](https://cs231n.github.io/assignments2026/assignment2/)、[A3](https://cs231n.github.io/assignments2026/assignment3/) 三頁都公開，各有 Colab 起始碼可下載 |
| 課程筆記 | [cs231n.github.io](https://cs231n.github.io/) 的長篇筆記，課表逐講連過去 |
| 專題規範 | [專題頁](https://cs231n.stanford.edu/project.html)列出每個繳交項目的權重與日期，附歷屆報告 |
| 錄影 | [Spring 2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)，Stanford Online 頻道，18 支 |

缺口有三個，每一篇都會再提一次：

- **2026 錄影只在 Canvas**。首頁寫明錄影放在 Canvas 的「Panopto Course Videos」分頁，只給選課學生看；往年錄影在 YouTube，但「not reflective of this offering」。
- **L17、L18 沒有 2026 投影片**。課表上這兩講沒有 slides 連結，照前面的網址格式猜也是 404。
- **期中考、Ed、Gradescope 都不公開**。考題、論壇討論、自動評分器與成績，校外讀者都看不到。

所以要自學，程式作業可以寫，但沒有官方自動評分可以對答案，只能靠 notebook 裡內建的檢查 cell 與數值梯度檢查。

## 2026 教材與 2025 錄影怎麼對照

[Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)的 18 講標題跟 2026 幾乎一樣，唯一明顯不同的是 L17：2025 是「Robot Learning」，2026 是「World Modeling」。

實際對照時要注意幾件事：

- **錄影是 2025 年的**。播放清單的影片標題寫著「Spring 2025」。本系列的內容整理以 2026 投影片為準，影片只當作聽講輔助。我沒有逐支比對影片與 2026 投影片的差異。
- **L17 主題完全不同**。看 2025 的 L17 影片學到的是 robot learning，不是 world modeling。本系列最後一篇會把兩者分開寫。
- **2026 投影片本身也有沿用痕跡**。例如 L7 投影片封面日期印著 2025 年，第一講 part 1 的第 1 頁頁尾也寫 2025。這只代表檔案沿用，不能拿來推論改了多少。
- **作業頁彼此有小出入**。作業總頁寫 A2 包含「Network Visualization」，但 A2 題目頁的五題是 BatchNorm、Dropout、CNN、PyTorch on CIFAR-10、RNN captioning，沒有 visualization。以題目頁為準。

## 10 週自學路線

官方學期從 3 月 31 日到 6 月 10 日，剛好 10 週。下面照官方課表的節奏排，作業日期是 2026 的官方 due date，自學時可以當作進度檢查點。

| 週 | 講次 | 作業與專題 | 本系列文章 |
|---|---|---|---|
| 1 | L1 課程導論、L2 影像分類 | 看 Python/Numpy 教學；開始 A1（4/2 發佈） | [L1](/posts/ai/2026-09-30-cs231n-intro-vision-history)、[L2](/posts/ai/2026-09-30-cs231n-image-classification-linear) |
| 2 | L3 正則化與最佳化、L4 反向傳播 | 跟著 Backprop section 算一次例題；A1 Q1–Q3 | [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization)、[L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) |
| 3 | L5 CNN、L6 訓練 CNN 與架構 | 完成 A1（官方 4/16 due）；想專題題目 | [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)、[L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification)、[L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures) |
| 4 | L7 RNN、L8 Attention 與 Transformer | 寫專題 proposal（官方 4/23 due）；開始 A2 | [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks)、[L8](/posts/ai/2026-09-30-cs231n-attention-transformers-vit) |
| 5 | L9 偵測／分割／可視化、L10 影片理解 | A2 Q1–Q3 | [L9](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)、[L10](/posts/ai/2026-09-30-cs231n-video-understanding) |
| 6 | L11 分散式訓練、L12 自監督學習 | 完成 A2（官方 5/8 due）；官方這週之後是期中考 | [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn)、[L11](/posts/ai/2026-09-30-cs231n-distributed-training)、[L12](/posts/ai/2026-09-30-cs231n-self-supervised-learning) |
| 7 | L13 生成模型（一）、L14 Diffusion | 開始 A3（5/14 發佈）；專題 Milestone 1 | [L13](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)、[L14](/posts/ai/2026-09-30-cs231n-generative-models-diffusion) |
| 8 | L15 3D 視覺、L16 視覺與語言 | A3 Q1–Q3；專題 Milestone 2 | [L16](/posts/ai/2026-09-30-cs231n-vision-language)、[L15](/posts/ai/2026-09-30-cs231n-3d-vision) |
| 9 | L17、L18（只有 2025 影片） | 完成 A3（官方 5/28 due）；專題 Milestone 3 | [A3](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip) |
| 10 | — | 期末報告與 poster | [收尾與專題](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project) |

本系列的文章順序和課表有三處不同。第一，作業篇放在它最後依賴的那一講之後。第二，L15 移到 A3 之後，讓「生成→多模態→A3」連成一串。第三，L17 和 L18 沒有 2026 投影片，併成一篇收尾。

**怎麼開始**：今晚先打開 [A1 題目頁](https://cs231n.github.io/assignments2026/assignment1/)，下載起始碼，照頁面說明把 Colab runtime 版本改成「2025.07」，跑通 knn.ipynb 的第一個 cell。跑得起來，就接著讀 [L1](/posts/ai/2026-09-30-cs231n-intro-vision-history)。

## 系列目錄

| order | 文章 |
|---|---|
| 0 | 總覽與自學路線（本文） |
| 1 | [L1：電腦視覺從哪裡來，這門課要走到哪裡](/posts/ai/2026-09-30-cs231n-intro-vision-history) |
| 2 | [L2：影像分類、kNN 與線性分類器](/posts/ai/2026-09-30-cs231n-image-classification-linear) |
| 3 | [L3：正則化與最佳化](/posts/ai/2026-09-30-cs231n-regularization-optimization) |
| 4 | [L4：神經網路與反向傳播](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) |
| 5 | [A1 導讀：kNN、Softmax、兩層網路與全連接網路](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) |
| 6 | [L5：用 CNN 做影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification) |
| 7 | [L6：訓練 CNN 與經典架構](/posts/ai/2026-09-30-cs231n-training-cnns-architectures) |
| 8 | [L7：循環神經網路與影像描述](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks) |
| 9 | [A2 導讀：BatchNorm、Dropout、CNN、PyTorch 與 RNN Captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn) |
| 10 | [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit) |
| 11 | [L9：物件偵測、影像分割與模型可視化](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization) |
| 12 | [L10：影片理解](/posts/ai/2026-09-30-cs231n-video-understanding) |
| 13 | [L11：大規模分散式訓練](/posts/ai/2026-09-30-cs231n-distributed-training) |
| 14 | [L12：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning) |
| 15 | [L13：生成模型（一）VAE、GAN 與自迴歸](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan) |
| 16 | [L14：生成模型（二）Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion) |
| 17 | [L16：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language) |
| 18 | [A3 導讀：Transformer Captioning、SSL、DDPM、CLIP & DINO](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip) |
| 19 | [L15：3D 視覺](/posts/ai/2026-09-30-cs231n-3d-vision) |
| 20 | [收尾：World Modeling／Robot Learning、Human-Centered AI 與期末專題](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project) |

## 延伸閱讀

- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：線性分類、softmax 與最大概似估計的機器學習背景
- [CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)、[MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)：不限於視覺的深度學習課
- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：Transformer 與大規模訓練的語言模型那一側
- [CS230：對抗樣本與生成模型](/posts/ai/2026-08-16-cs230-adversarial-and-generative)
- [Berkeley CS285 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)：想接著看 robot learning 的讀者

**系列導覽**：下一篇 [L1：電腦視覺從哪裡來，這門課要走到哪裡](/posts/ai/2026-09-30-cs231n-intro-vision-history)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方來源，確認仍無對應本文範圍的公開錄影，補上查核日期。

## 參考資料

- [CS231n 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231n 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html)
- [CS231n 作業總頁](https://cs231n.stanford.edu/assignments.html)
- [CS231n 期末專題頁](https://cs231n.stanford.edu/project.html)
- [Assignment 1（2026）](https://cs231n.github.io/assignments2026/assignment1/)
- [Assignment 2（2026）](https://cs231n.github.io/assignments2026/assignment2/)
- [Assignment 3（2026）](https://cs231n.github.io/assignments2026/assignment3/)
- [CS231n 課程筆記（cs231n.github.io）](https://cs231n.github.io/)
- [Lecture 1 Part 2 投影片：Overview（2026）](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf)
- [CS231n Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N Deep Learning for Computer Vision I 2025（YouTube 播放清單）](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
