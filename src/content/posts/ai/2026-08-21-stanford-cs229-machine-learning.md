---
title: "從線性迴歸到訓練推理模型：課程地圖與閱讀路線｜Stanford CS229 課程總覽"
date: 2026-08-21
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, self-study]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 0
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 9
tldr: "CS229 是 Stanford 把機器學習的數學推導走一遍的主課。Spring 2026 的錄影公開了 17 堂，前十堂是線性模型、神經網路與非監督式學習，後七堂走到擴散模型、LLM 與用強化學習訓練推理模型。本系列一堂一篇，這篇是地圖：每堂實際教什麼、影片標題哪裡對不上、講義有而課堂沒教的去哪裡補。"
description: "Stanford CS229: Machine Learning 課程總覽：Spring 2026 公開錄影 17 堂的實際內容與講義章節對照、影片編號與標題的落差、先修與自測方式、還拿得到的作業，以及自學的閱讀路線。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

**影片狀態：已附影片。** 這篇是整門課的總覽，下方嵌入的是 Spring 2026 第 1 堂（課程介紹）；每一堂的錄影放在各堂導讀的開頭。

[CS229: Machine Learning](https://cs229.stanford.edu/) 是 Stanford 電腦科學系的機器學習主課，跨掛在統計系底下叫 STATS 229。它處理的是推導：一個模型的損失函數從哪個機率假設來、梯度怎麼算、演算法為什麼會收斂。會呼叫套件訓練模型的人很多，這門課要你能自己把式子寫出來。

這個系列跟著 Stanford Online 公開的 Spring 2026 錄影走，一堂一篇，共 17 堂。每篇開頭就是那一堂的影片，正文照課堂的順序把推導走完，補一個可以手算的例子，最後列出對應的講義章節。這篇總覽幫你決定三件事：這門課適不適合現在的你、17 堂各在教什麼、從哪裡開始。

```youtube
url: https://www.youtube.com/watch?v=DATnpGoGhM8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction
captions: en
```

## 這門課適合誰

課程官網列的先修有三條，都是「等同於」的寫法，不要求真的修過那些課號：

- 能用 Python 與 NumPy 寫出有點份量的程式（CS106A 或 CS106B 的程度）
- 機率論（CS109 或 MATH151 的程度）
- 多變數微積分與線性代數（MATH51 或 CS205L 的程度）

實際上最常卡住人的是矩陣微分與條件機率的記號。第 2 堂的講者把那堂課定位成「記號課」，並說之後每一堂都會直接假設你會。所以判斷自己能不能上，最快的方法是直接看[第 2 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)的 normal equations 那一節：從 $J(\theta) = \frac{1}{2}(X\theta - y)^T(X\theta - y)$ 推到 $X^TX\theta = X^Ty$，每一步都看得懂，數學密度就扛得住。

Stanford Online 另外給了一個官方自測：入學前先看一份 [2008 年公開課的 Problem Set 1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf)，覺得太難就代表這門課對你太難。那份題目第一題要你算出最小平方成本函數的 Hessian，再證明 Newton 法一步就收斂；Newton 法與 Hessian 在[第 3 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)會教。讀文章判斷的是跟不跟得上，做那份題目判斷的是自己動不動得了手，後者比較準。

如果你要的是「把深度學習模型訓練起來並除錯」的實作經驗，CS230 比較對路。兩門課的關係放在本文後段。

## 17 堂課各在教什麼

Spring 2026 由 Tengyu Ma 與 Chris Ré 兩位分堂授課。第 1 堂是 Ma 的開場；第 2 到 6 堂與第 9、10 堂由 Ré 主講，他在第 10 堂結尾說那是他這學期最後一堂課；其餘各堂是 Ma。

下表的「實際內容」是依每一堂的字幕整理的，跟 YouTube 上的影片標題不一定相同，落差在下一節說明。

| 堂次 | 導讀 | 實際內容 | 對應講義 |
|---|---|---|---|
| 1 | [機器學習在學什麼](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction) | 課程介紹、機器學習的定義、監督式／非監督式／強化學習 | 全書導覽 |
| 2 | [監督式學習設定與線性迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression) | 假設函數、最小平方成本、梯度下降、minibatch SGD、normal equations | 第 1 章 |
| 3 | [最大概似與邏輯斯迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression) | 線性迴歸的機率解釋、邏輯斯迴歸、Newton 法 | 第 1–2 章 |
| 4 | [指數族、廣義線性模型與 softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm) | 指數族、GLM、多類別 softmax、交叉熵與 label smoothing | 第 2–3 章 |
| 5 | [高斯判別分析與 Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis) | 生成式與判別式、多變數高斯、GDA、Naive Bayes | 第 4 章 |
| 6 | [偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization) | 偏差–變異分解、ridge regression、雙降、交叉驗證 | 第 8–9 章 |
| 7 | [神經網路的架構](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture) | 非線性模型的訓練框架、全連接網路、殘差連接、正規化層 | 第 7 章 |
| 8 | [反向傳播](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation) | 為什麼算梯度跟算一次前向一樣快、各模組的 backward | 第 7 章 |
| 9 | [k-means 與高斯混合模型](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm) | k-means、GMM、隱變數、Jensen 不等式 | 第 10–11 章 |
| 10 | [EM 演算法與 PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca) | ELBO 與 EM 的單調性、套回 GMM、PCA | 第 11–12 章 |
| 11 | [擴散模型](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models) | 前向加噪、反向去噪、用 ELBO 寫出訓練目標 | 第 14 章 |
| 12 | [擴散模型的雜訊預測損失、基礎模型與 LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora) | 擴散損失的化簡、預訓練加適應、linear probe、finetune、LoRA | 第 14–15 章 |
| 13 | [對比學習與語意檢索](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search) | 表徵學習、對比損失、語意檢索、RAG | 第 16 章 |
| 14 | [大型語言模型](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention) | 分詞、next-token 損失、attention 的計算 | 第 17 章 |
| 16 | [Attention 變體、MoE 與提示用法](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning) | KV cache、grouped-query attention、MoE、in-context learning、SFT | 第 17 章 |
| 18 | [強化學習基礎與 Policy Gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient) | MDP、價值函數、Bellman 方程式、policy gradient 的推導 | 第 19、21 章 |
| 20 | [Baseline、PPO 與可驗證獎勵](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning) | policy gradient 收尾、PPO、用強化學習訓練長思維鏈 | 第 18、21 章 |

整門課可以分成三段來看。

**第 2 到 6 堂是同一套做法的反覆練習。** 寫下資料的機率模型，取對數概似，求最大值。線性迴歸、邏輯斯迴歸、GLM、GDA 都是這個流程換一個分布。第 6 堂回頭問：在訓練集上做到最好，為什麼不保證在新資料上也好。

**第 7 到 10 堂換掉兩個假設。** 第 7、8 堂把線性模型換成神經網路，代價是沒有封閉解，只能靠反向傳播算梯度。第 9、10 堂把標籤拿掉，引進隱變數與 EM。第 10 堂推出來的 ELBO 是後面擴散模型的基礎。

**第 11 堂之後是近幾年才進入這門課的內容。** 擴散模型、基礎模型的預訓練與適應、對比學習、LLM 的訓練目標與架構，最後用兩堂強化學習收在「怎麼訓練會長時間推理的模型」。這一段的講義章節是近年新增的，[2022 年秋季的凍結版講義](https://cs229.stanford.edu/notes2022fall/main_notes.pdf)裡整個「自監督學習與基礎模型」只有一章八頁，現在同樣的題材是五章、將近五十頁。

## 影片的編號與標題

照播放清單自學會遇到兩個容易誤會的地方。

### 編號跳號，但正課沒有缺

[播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)有 17 支，標題上的編號是 1 到 14，接著是 16、18、20。缺的三個號碼各有原因：

- **第 15、17 堂是客座講座**，沒有放上 YouTube。第 14 堂開場時講者說接下來的課程除了兩場客座之外都是 LLM 與強化學習，並預告下週一由 Simran 來講 systems ML。
- **第 19 堂的時段是 Memorial Day**，沒有上課。這門課週一、週三上，第 18 堂的講者說「從這週開始講強化學習」，第 20 堂則說上一堂是「上週」。

所以 17 支影片的內容是連續的，第 20 堂的講者也明說那是這學期最後一堂。本系列的堂次沿用影片標題上的編號。

### 標題的主題文字常常對不上

編號是對的，但標題裡的主題有好幾支與內容不符。下表列出落差比較大的：

| 影片標題寫的主題 | 實際內容 |
|---|---|
| Lecture 3: Weighted Least Squares | 機率解釋、邏輯斯迴歸、Newton 法；整堂沒有講加權最小平方 |
| Lecture 6: Dataset Split, ML Advice | 主體是偏差–變異分解與 ridge regression，資料集切分只在最後幾分鐘 |
| Lecture 12: Representation Learning | 前半是擴散損失收尾，後半是基礎模型與 LoRA |
| Lecture 13: LLMs, Next-Word Prediction Loss | 表徵學習、對比學習、語意檢索 |
| Lecture 14: Transformers, In-Context Learning | 有 Transformer 的 attention，沒有 in-context learning |
| Lecture 16: Basic Concept in RL, Policy Gradient | attention 變體、MoE、in-context learning |
| Lecture 18: GMM (EM), PCA | 強化學習基礎與 policy gradient |
| Lecture 20: GMM (EM), PCA | PPO 與用強化學習訓練長思維鏈 |

從第 12 堂起，標題大致是「下一支影片的內容」；最後兩支則直接沿用了第 10 堂的標題。Stanford Online 沒有說明原因。實務上的結論是：**不要照影片標題排讀書計畫**，照上一節那張表，或直接看各堂導讀的開頭。

## 講義有、Spring 2026 課堂沒教的

課程的[主講義](https://cs229.stanford.edu/main_notes.pdf)是公開的 PDF，278 頁，署名 Tengyu Ma 與 Andrew Ng，分成六部。它比一學期的課涵蓋得多，以下這些章節在 Spring 2026 的錄影裡沒有出現：

| 講義章節 | 主題 | 去哪裡補 |
|---|---|---|
| 第 1 章 1.4 節 | 局部加權線性迴歸 | 講義 |
| 第 5 章 | Kernel 方法 | 講義；2018 年 Andrew Ng 版第 7 堂 |
| 第 6 章 | 支援向量機 | 講義；2018 年版第 6、7 堂 |
| 第 8 章 8.3 節 | Uniform convergence 與 VC 維度 | 講義 |
| 第 13 章 | 獨立成分分析（ICA） | 講義；2018 年版第 15、16 堂 |
| 第 19 章後段 | Value iteration 與 policy iteration | 講義；2018 年版第 17 堂 |
| 第 20 章 | LQR、DDP、LQG | 講義；2018 年版第 18、19 堂 |

第 18 堂的講者在課堂上交代過強化學習這樣取捨的原因：這學期的重心放在 LLM，所以講義裡那些訓練語言模型時不常用的演算法就不講，直接跳到 policy gradient，其餘請有興趣的人自己讀講義。

[2018 年秋季 Andrew Ng 主講的版本](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)是另一份完整的公開錄影，共 21 支。它的監督式學習部分跟今天差異不大，kernel、SVM、ICA、LQR 都有完整的堂次，適合用來補上表的缺口。反過來，擴散模型、基礎模型、LLM 這些內容 2018 年版完全沒有。兩個版本都不教的是決策樹與集成方法：2018 年的課綱還有一堂，現在的課綱和講義都沒有了。

## 自學拿得到什麼

| 材料 | 狀態 |
|---|---|
| 主講義 PDF | 公開，278 頁，持續更新 |
| 線性代數、機率、凸最佳化、高斯分布的複習講義 | 公開，在課程網站的 `section/` 底下 |
| Spring 2026 錄影 | 公開 17 支，正課完整，缺兩場客座 |
| 2018 年 Andrew Ng 版錄影 | 公開 21 支 |
| Problem set 1–3，含起始碼與資料集 | 公開，是 2019 與 2020 年夏季的版本 |
| 當期作業、課綱、進度表、專案說明 | 需要 Stanford 帳號 |
| 近年的官方解答與自動評分器 | 沒有公開 |

課程官網寫明當期的文件只分享給 Stanford 的成員。非學位生的正式管道是 SCPD，[Stanford Online 的課程頁](https://online.stanford.edu/courses/cs229-machine-learning)列有申請條件。

### 作業

伺服器上還留著 [Summer 2020 的三份 problem set](https://cs229.stanford.edu/summer2020/ps1.pdf)，PDF 與起始碼壓縮檔都能下載：

- **PS1**：邏輯斯迴歸與 GDA 各推導、各實作一次，另有 Poisson 迴歸與 GLM 的凸性證明。對應第 3 到 5 堂。
- **PS2**：Naive Bayes 垃圾簡訊分類、kernel 的合法性、從零寫出單隱藏層網路的前向與反向傳播來辨識 MNIST。對應第 5、7、8 堂，其中 kernel 的題目要靠講義第 5 章。
- **PS3**：倒單擺的強化學習、k-means 影像壓縮、半監督 EM、PCA、ICA。對應第 9、10 堂與強化學習的部分。

每份都是先推導、再實作。作業規定程式題只能用環境檔列出的套件，裡面是 NumPy、SciPy、matplotlib 與 Pillow，沒有 scikit-learn 也沒有 PyTorch。PS2 的 MNIST 那一題因此要自己寫鏈鎖律，讀完第 8 堂之後很適合拿它來驗收。

這些作業的內容比 Spring 2026 的課舊，擴散模型與 LLM 的部分沒有公開的作業可做。另外，推導題沒有解答可以對，這是自學這門課最大的缺口。

## 怎麼開始

**如果你有線性代數與機率的底子**，從第 2 堂開始依序讀。第 1 堂是課程介紹，沒有推導，想知道三類學習怎麼分再回頭看。每一堂的讀法都一樣：先看影片或讀導讀的正文，自己把推導在紙上走一遍，做完文末的自我檢查，再讀對應的講義章節看課堂跳過了什麼。

**如果你只想讀後半的現代內容**，最短的路徑是第 3 堂（最大概似）→ 第 7、8 堂（神經網路與反向傳播）→ 第 10 堂的前半（ELBO）→ 第 11 堂之後。第 11、12 堂的擴散模型需要 ELBO；第 20 堂需要第 18 堂的 policy gradient。

**如果第 2 堂的矩陣微分讓你卡住**，先讀課程網站上的[線性代數複習講義](https://cs229.stanford.edu/section/cs229-linalg.pdf)，它的第 4 節就是為這件事寫的。

作業的搭配方式是讀完第 5 堂做 PS1，讀完第 8 堂做 PS2，讀完第 10 堂做 PS3 裡非監督式學習的幾題。

## CS229 與 CS230

這兩門常被拿來二選一，官方的說法是它們重疊很少。[ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog) 上 CS230 的先修欄寫著 CS229 可以同時修。CS230 的 [Autumn 2025 第一堂](https://www.youtube.com/watch?v=_NLHFoVNlbg)問答裡，Andrew Ng 說兩門課的課綱刻意設計成重疊很低，並形容 CS229 數學與理論的比重高得多、步調很快，CS230 則只做深度學習這一件事，整學期幾乎不做數學證明。

所以兩門課切的是不同的方向：CS229 涵蓋的演算法種類廣，每一種都要你推導；CS230 只挑深度學習往實作與專案走。誰也不是誰的先修。本站另有 [CS230 的導讀](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)可以對照，這門課在整條先修階梯上的位置見 [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)。

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction](https://www.youtube.com/watch?v=DATnpGoGhM8)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng｜Autumn 2018 播放清單（21 支）](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [CS229 課程官網](https://cs229.stanford.edu/)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：17 支 Spring 2026 錄影的英文字幕都已取得並逐堂寫成導讀，本文的各堂內容、講者、跳號原因與標題落差依這些字幕整理；沒有看投影片與板書畫面。講者沒有在每一堂自報姓名，各堂講者是依字幕裡彼此的稱呼與交接說明判定的。

## 更新紀錄

- 2026-10-12：改寫為課程總覽。系列由「依 2026 主講義逐章」改為「依 Spring 2026 公開錄影一堂一篇」，影片移到各篇開頭；新增 17 堂的實際內容對照、影片標題落差表與講義未授章節的補充路線。原文的材料查證細節不再放在正文。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式；重查後確認公開的 Spring 2026 播放清單（17 支）存在，並依字幕核對嵌入的第 1 堂。

## 參考資料

- [CS229: Machine Learning 課程官網](https://cs229.stanford.edu/)：先修條件、材料只分享給 Stanford 成員的聲明
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：278 頁，六部結構與章節編號，各堂「對應講義」的依據
- [CS229 2022 秋季凍結版講義](https://cs229.stanford.edu/notes2022fall/main_notes.pdf)：對照基礎模型相關章節這幾年增加了多少
- [Stanford CS229 Machine Learning｜Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：17 支錄影的編號與標題，各堂內容依其英文字幕整理
- [Stanford CS229: Machine Learning led by Andrew Ng｜Autumn 2018 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)：補 kernel、SVM、ICA、LQR 的堂次
- [CS229 Autumn 2018 課綱（Wayback 存檔）](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html)：2018 年版的堂次分區，含決策樹與集成方法
- [Linear Algebra Review and Reference](https://cs229.stanford.edu/section/cs229-linalg.pdf)：矩陣微分的補充材料
- [SEE 公開課 Problem Set 1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf)：Stanford Online 建議的入學前自測題
- [Stanford Online：CS229 課程頁](https://online.stanford.edu/courses/cs229-machine-learning)：SCPD 申請條件與自測建議
- [CS229 Summer 2020 Problem Set 1](https://cs229.stanford.edu/summer2020/ps1.pdf)、[Problem Set 2](https://cs229.stanford.edu/summer2020/ps2.pdf)、[Problem Set 3](https://cs229.stanford.edu/summer2020/ps3.pdf)：題目內容與可用套件的規定
- [ExploreCourses：CS 229](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog)：跨掛 STATS 229，以及 CS 230 先修欄的原文
- [Stanford CS230 Autumn 2025 Lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg)：Andrew Ng 對 CS229 與 CS230 的定位
- 站內：[Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[CS230：當提示工程失效](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
