---
title: "Stanford CS229 導讀：講義每年重編，公開作業停在 2020，官方自測題是 2008 年的"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, self-study]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 9
tldr: "CS229 的自學三件套不在同一個時鐘上：講義 278 頁、2026 年 8 月才重編過；公開拿得到的作業是 2020 年夏季那批；Stanford Online 叫你入學前先做的自測題，PDF 建立於 2008 年。2026 春季錄影公開 17 支，最後三支的標題跟內容對不上。"
description: "Stanford CS229: Machine Learning 完整導讀——講義 278 頁的實際涵蓋範圍與第一章難在哪、2018 版與 2026 版課綱的落差、還拿得到的三份 problem set、CS229 與 CS230 官方怎麼定位，以及自學者實際拿得到什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

[CS229: Machine Learning](https://cs229.stanford.edu/) 是 Stanford 電腦科學系的機器學習主課，三到四學分，跨掛在統計系底下叫 STATS 229。它不是「AI 概論」，也不是「深度學習」——它是把監督式學習、非監督式學習、學習理論、強化學習這四塊的**數學推導**攤開來走一遍的那門課。

它同時是全 Stanford 自學材料最完整的一門：講義是公開 PDF、錄影在 YouTube、連作業和起始碼都還在伺服器上。這也是為什麼它值得單獨寫一篇——**材料多不等於材料一致**。這四份材料分別停在四個不同的年份，而且沒有任何一頁告訴你這件事。

這篇是把講義 PDF 逐章翻過、把 2018 與 2026 兩版課綱擺在一起比、把還抓得到的作業下載下來讀完之後寫的。涵蓋課程涵蓋什麼、第一章難在哪、兩版之間差了什麼、作業長什麼樣、以及沒有 Stanford 帳號的人實際拿得到多少。**不包含**逐堂錄影精聽——那是另一個量級的工作，本系列的 [CS329A 那篇](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)才是那種做法。這門課在整條先修階梯上的位置，見[系列入口的地圖文](/posts/learning/2026-08-20-stanford-cs-course-map)。

## 這門課的硬事實

先修條件官網寫得很具體，三條。能用 Python/NumPy 寫出不算 trivial 的程式（CS106A 或 CS106B 等級）；機率論到 CS109 或 MATH151 等級；多變數微積分與線性代數到 MATH51 或 CS205L 等級。三條都是「等同於」的寫法，不要求你真的修過那些課號。

比較少人注意的是**它一年開四次，而且每次是不同的人教**。查 [ExploreCourses 的 CS 229 條目](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog)，2025–2026 學年秋冬春夏都有。秋季是 Moses Charikar、Carlos Guestrin 與 Andrew Ng，冬季是 Sanmi Koyejo，春季是 Tengyu Ma 與 Chris Ré，夏季是 Jehangir Amjad 與 Anand Avati。所以「CS229 教什麼」這個問題，嚴格講要先問你指的是哪一季。網路上流通的那些課程整理，通常沒有標。

旁聽這件事，官網給了一句沒有模糊空間的話：

> All links will require you to be logged into your Stanford email to access. Course documents are only shared with Stanford University affiliates.

當期的課綱、作業、FAQ 全部在 Google Drive 與 Canvas 後面，鎖在 Stanford 帳號上。非學位生的正式管道是 SCPD，而 [Stanford Online 的 CS229 頁面](https://online.stanford.edu/courses/cs229-machine-learning)寫著要先有學士學位、大學 GPA 3.0 以上才能申請。這學期還多了一條：課程參加了 Stanford 學術誠信工作小組的實體考試監考試辦。

## 講義：278 頁，兩天前才重新編過

[main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) 是這門課最有價值的公開資產。它現在是 278 頁，標題頁署名 Tengyu Ma 與 Andrew Ng，日期印著 August 18, 2026——寫這篇的三天前。伺服器回的 `Last-Modified` 也是同一週。這不是一份被放著長灰的舊講義。

它分成六部：監督式學習、深度學習、泛化與正規化、非監督式學習、生成模型與基礎模型、強化學習與控制，後面接一份高斯與 KL 的公式附錄和參考書目。地圖文說它「一路寫到自監督學習與基礎模型」——**這個描述現在已經保守了**。第五部裡有擴散模型、LoRA、對比學習、語意檢索與 RAG、tokenization、transformer 架構、attention 變體、MoE、in-context learning 與 SFT。最後一章叫 Reasoning in LLMs，講思維鏈與 RLVR 底下的長推理訓練。強化學習那一部的 policy gradient 章也從只有 REINFORCE 變成 REINFORCE 加 PPO。

這些不是零星補充。把 2022 年秋季那份[凍結版講義](https://cs229.stanford.edu/notes2022fall/main_notes.pdf)拉下來對照就很清楚：當年整個「自監督學習與基礎模型」只有一章、八頁。今天同樣的題材佔掉五章、將近五十頁。**四年之間多出來的六十幾頁，幾乎全部落在同一個區塊。** 前面那些線性迴歸、GLM、SVM、EM、PCA 的章節，頁碼位移之外幾乎沒動。

順帶一提，2026 版目錄頁的頁首還印著「CS229 Spring 2022」，那是舊排版模板留下的字串，跟正文內容無關——別拿它當版本判斷。

### 第一章在講什麼、難在哪

地圖文把「讀不讀得動講義第一章」當成 CS229 與 CS230 的分流判準。具體一點講，第一章是**線性迴歸**，十二頁，從 Portland 那 47 棟房子的坪數與售價開始。內容有四塊：LMS 更新規則與批次／隨機梯度下降、normal equations 的封閉解、最小平方的機率解釋、局部加權線性迴歸。

真正卡人的不是梯度下降，那一節誰都讀得動。卡人的是接下來兩處。

**第一處是 1.2.1 矩陣微分。** 講義為了不「write reams of algebra and pages full of matrices of derivatives」，先定義一個把矩陣映到實數的函數對矩陣的梯度。接著它直接用 `∇x bᵀx = b` 和「A 對稱時 `∇x xᵀAx = 2Ax`」這兩條，五行之內把 `J(θ)` 的梯度化簡成 `XᵀXθ − Xᵀy`。這兩條它不證，只丟你一句「for more details, see Section 4.3 of Linear Algebra Review and Reference」。那份[線性代數複習講義](https://cs229.stanford.edu/section/cs229-linalg.pdf)也在同一台伺服器上，公開的。你如果沒辦法自己驗那五行，後面每一章都會用同樣的密度往下走。

**第二處是 1.3 機率解釋。** 這一節假設誤差項獨立同分布服從零均值高斯，寫出 likelihood，取對數，然後讓最小平方成本函數自己掉出來。它要你在同一頁裡同時處理條件機率的記號、`p(y|x; θ)` 為什麼是分號不是逗號、以及最大概似為什麼可以改成最大化對數。這是整門課的語法課：後面的 GLM、GDA、EM、擴散模型全都是這一套的變奏。

**今晚就能做的事**：打開講義翻到 1.2.2，拿張紙自己把 `∇θ J(θ)` 從 `½(Xθ − y)ᵀ(Xθ − y)` 推到 `XᵀXθ − Xᵀy`。推得出來，這門課的數學密度你扛得住；推不出來，先去把 CS230 或線性代數補完再回來。這比任何自我評估量表都準。

## 2018 版與 2026 版：不是同一門課

很多人自學 CS229 看的還是 Andrew Ng 那版。[Stanford CS229: Machine Learning led by Andrew Ng](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU) 是 2018 年秋季的播放清單，光第一堂就累積了超過四百萬次觀看。它是很好的錄影，但它教的東西跟今天的 CS229 落差比一般人想像的大。

把 [Autumn 2018 的課綱](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html)（Wayback 存檔）和 [Spring 2026 的播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)擺在一起：

| | Autumn 2018 | Spring 2026 |
|---|---|---|
| 神經網路 | 2 堂（基礎、訓練） | 2 堂（架構、backprop） |
| 生成模型 | 無 | 擴散模型 1 堂 |
| 表徵學習 | 無 | 1 堂 |
| 大型語言模型 | 無 | 至少 3 堂（次詞預測、transformer 與 in-context learning、attention 變體與 SFT） |
| 強化學習 | 4 堂，收在 POMDP | 2 堂，收在 PPO 與長思維鏈的 RLVR |
| 決策樹與集成 | 1 堂 | 無 |
| 因素分析 | 1 堂 | 無 |
| 課外資源區 | 還在列 Matlab 與 Octave 教學 | — |

八年前的 CS229 是一門「機器學習演算法巡覽」，深度學習是其中兩堂客。今天的 CS229 前半段幾乎沒變，後半段換成了一條從表徵學習走到 transformer、再走到用強化學習訓練推理模型的線。**決策樹、集成方法、因素分析從課綱和講義裡一起消失了**——如果你是為了 gradient boosting 來的，這門課現在不教。

那堂講 attention 變體的錄影裡，講者對後面幾堂的安排有個很誠實的說法：「the rest of the lectures are a bunch of small topics which are pretty kind of almost trivial but I have to mention all of them in some sense to clarify the concept」（引自 YouTube 自動字幕，未加標點；春季由 Ma 與 Ré 兩人分堂授課，錄影標題與說明沒有標出每堂是誰上，這句出自哪一位無法從公開資訊確認。）

### 那份 2026 錄影有兩個坑

第一，**它不完整**。播放清單只有 17 支，標題編號是 1 到 14，然後跳成 16、18、20。中間那幾堂沒有公開。

第二，**最後三支的標題跟內容對不上**。清單裡有三支同名「GMM (EM), PCA」——第 10 支確實是講 GMM 與 PCA，另外兩支不是。點開標成「Lecture 18: GMM (EM), PCA」的那支，開場第一句是「Starting from this week, we're going to talk about reinforcement learning」。點開標成「[Lecture 20: GMM (EM), PCA](https://www.youtube.com/watch?v=J7CossjMvEg)」的那支，講者說這是這學期最後一堂，內容是 PPO 加上用強化學習訓練長思維鏈。而標成「Lecture 16: Basic Concept in RL, Policy Gradient」的那支，開場在複習上週的 attention。標題整體往後滑了一格左右。Stanford Online 沒有說明為什麼會這樣。

實務上的意思是：**這份清單不能照標題排讀書計畫，要點進去聽開場三十秒確認。** 另外值得知道的是觀看數的分布：transformer 那堂快十萬次，k-means 那堂連零頭都不到。同一門課、同一批人上傳、同一週發佈。

## 作業長什麼樣

當期作業拿不到。但伺服器上還留著 2019 與 2020 兩個夏季的三份 problem set，PDF 和起始碼壓縮檔都能直接下載，裡面連資料集、`util.py`、LaTeX 作答模板都齊。以 [Summer 2020 那批](https://cs229.stanford.edu/summer2020/ps1.pdf)為準：

- **PS1（五題）**：線性分類器（logistic regression 與 GDA 各推導再各實作一次）、只有正標籤的不完整標註問題、Poisson regression、證明 GLM 的負對數概似是凸的、以及用不同 feature map 做多項式迴歸。
- **PS2（六題）**：logistic regression 的訓練穩定性、垃圾簡訊分類（naive Bayes）、證明八種 kernel 組合的合法性、kernel 化 perceptron、MNIST 手寫數字辨識、正規化的貝氏詮釋。
- **PS3（六題）**：倒單擺的強化學習、KL 散度與最大概似、k-means 影像壓縮、半監督 EM、PCA、以及用 ICA 解雞尾酒會問題。

每份都是「先推導、再實作」的雙軌結構，寫的部分和寫程式的部分分開給分。**分水嶺是 PS2 的第五題**：那是唯一一題要你從零寫出單隱藏層網路的 forward 與 backprop，在五萬張 MNIST 訓練圖上跑起來，還要再做一次加 L2 正規化的對照。前面幾題的實作大多是把封閉解或迭代式翻成 NumPy，這一題是你自己導鏈鎖律。

之所以躲不掉，是因為作業首頁那條硬規定：「For the coding problems, you may not use any libraries except those defined in the provided environment.yml file. In particular, ML-specific libraries such as scikit-learn are not permitted.」而 `environment.yml` 裡只有 NumPy、SciPy、matplotlib、Pillow。**沒有 scikit-learn，沒有 PyTorch，沒有 TensorFlow。** 這是 CS229 跟 CS230 在體感上最大的差別，不在講義裡，在作業的相依套件清單裡。

一個要先知道的坑：那份 `environment.yml` 釘的是 Python 3.6.6 和 NumPy 1.15.0，兩者都早就過了維護期。起始碼本身沒有用到什麼冷僻 API，用現代版本跑通常沒事，但你得自己處理，沒有人會幫你更新。

## CS229 與 CS230：官方講的是互補，不是二選一

地圖文說這兩門「不是二選一，是互補」。這句話有兩層官方證據撐著，而且比一般轉述的更明確。

**第一層在 ExploreCourses 的先修欄。** CS 230 的先修寫的是：「Familiarity with programming in Python and Linear Algebra (matrix / vector multiplications). CS 229 may be taken concurrently.」注意它的措辭——不是「建議先修 CS229」，是「CS229 可以同時修」。課號分工是寫進課程目錄裡的。

**第二層在 CS230 自己的公開錄影裡。** [Autumn 2025 第一堂](https://www.youtube.com/watch?v=_NLHFoVNlbg)的問答，有學生直接問能不能兩門一起修。Ng 的回答依錄影逐字稿是可以，並且說「we designed the two curricula to be relatively low in overlap」。同一段問答裡他還把三門入門課排了個序：CS129 最應用、最好上手；CS229「much more mathematical and theoretical, very high-paced, very intense」；CS230 只做深度學習一件事，整學期幾乎不做數學證明。

所以互補是真的，但**互補的方式跟很多人想的相反**。不是「CS229 教理論、CS230 教實作」那種上下游關係——CS229 涵蓋的演算法種類廣得多，CS230 只挑一類往深處鑽。兩門課的重疊之所以小，是因為它們切的是不同的軸。本站另有一篇[從 CS230 出發談提示工程失效的文章](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)可以對照。

順帶修正一個常見誤讀：CS229 不是 CS230 的先修。反過來也不是。

## 官方的分流判準跟地圖文的不一樣

地圖文建議用「讀不讀得動講義第一章」自我評估。Stanford 自己給的判準更硬——Stanford Online 的 CS229 頁面在先修條件底下直接寫著：

> Please review the first problem set before enrolling. If this material looks too challenging, you may find this course too difficult.

那個「first problem set」是一條連到 [see.stanford.edu 的四頁 PDF](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf)。這份 PDF 的建立時間是 **2008 年 10 月**。也就是說，Stanford Online 現在還在用一份十八年前的公開課作業，當作二十六年份課程的入學自測。

有意思的是，它其實仍然是個好判準。那份 PS1 第一題要你證明「用牛頓法解最小平方，一次迭代就收斂到最佳解」——需要你自己算出成本函數的 Hessian；第二題要你實作局部加權 logistic regression 的 Newton-Raphson 迭代。這兩題打到的正是講義第一章那兩個難點：矩陣微分和機率化的目標函數。**十八年沒換，是因為那道門檻本來就沒移動過。**

兩個判準可以合起來用：讀第一章判斷你**跟不跟得上**，做那份 2008 年的 PS1 判斷你**自己動不動得了手**。後者比較痛，也比較準。

## 自學者實際拿得到什麼

逐項講，拿得到和拿不到分得很開：

| 材料 | 狀態 | 停在哪一年 |
|---|---|---|
| 主講義 PDF | ✅ 公開，278 頁 | 2026（持續更新） |
| 線性代數／機率／凸優化／高斯複習講義 | ✅ 公開 | 舊版，但內容不會過期 |
| 2018 年 Andrew Ng 版錄影 | ✅ 完整 | 2018 |
| 2026 春季錄影 | ⚠️ 只有 17 支，後段標題錯置 | 2026 |
| Problem set 1–3＋起始碼＋資料集 | ✅ 公開 | 2020 |
| Problem set 4 與期中考 | ❌ | — |
| 官方解答 | ❌ | — |
| 自動評分器 | ❌ 當年跑在 Gradescope 的私有測試集上 | — |
| 當期課綱、進度表、專案說明 | ❌ 鎖 Stanford 帳號 | — |
| 期末專案的學生作品集 | ❌ 找不到公開的當期入口 | — |

最痛的一項是**沒有解答也沒有評分器**。CS229 的作業有大量推導題，而推導題最需要的就是「我這一步對不對」的回饋。你能拿到題目和資料，但你的證明沒有人會看。實作題還好一點——資料集裡有 valid 和 test 的切分，起始碼會把預測結果寫檔，你至少能看見自己的準確率是不是合理。

第二痛的是**課程的另一半整個不在**。期末專案佔的分量在課綱裡從來不小，而且是 CS229 真正把知識變成能力的地方。自學者拿到的是講義加作業，等於這門課的一半。

## 怎麼開始

如果你今晚只有一小時，做這件事：下載那份 [2008 年的四頁 PS1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf)，把第一題做完——算出 `J(θ)` 的 Hessian，然後證明牛頓法第一次迭代就給出 `θ* = (XᵀX)⁻¹Xᵀy`。做得出來就直接進 CS229；卡在 Hessian 那步就先補矩陣微積分，那份[線性代數複習講義](https://cs229.stanford.edu/section/cs229-linalg.pdf)的第四節就是為這件事寫的。

決定要走之後，路線這樣排：講義從第一部讀到第四部，配 2018 年 Ng 那版錄影——**前半段那八年幾乎沒變，Ng 的口述講解仍然是最好的**。讀到第五部（生成模型與基礎模型）就切換到 2026 春季那份清單，因為 2018 版完全沒有這些內容。作業就做 2020 年那三份，每讀完講義的一部就回頭把對應的題目做掉，MNIST 那題不要跳過。

一句話版本：**舊錄影配新講義，作業配起始碼，自測用 2008 年那份。**

## 附錄：數字與查證方式

- **講義版本**：`https://cs229.stanford.edu/main_notes.pdf` 於 2026-08-21 抓取，`Last-Modified: Wed, 19 Aug 2026`，PDF 內部 `CreationDate` 為 2026-08-18（PDT），278 頁，pdfTeX-1.40.21 產生。標題頁署名順序是 Tengyu Ma and Andrew Ng；被搜尋引擎快取到的舊版署名為 Andrew Ng and Tengyu Ma、日期 June 11, 2023。目錄頁頁首字串為「CS229 Spring 2022」。
- **2022 對照版**：`https://cs229.stanford.edu/notes2022fall/main_notes.pdf`，216 頁，`CreationDate` 2022-05-18。其第 14 章「Self-supervised learning and foundation models」佔 pp.167–174。2026 版對應的第五部「Generative models and Foundation Models」佔 pp.179–225，含第 14 章擴散模型、15 章基礎模型概覽（含 LoRA）、16 章表徵學習（含語意檢索與 RAG）、17 章大型語言模型、18 章 LLM 推理（思維鏈與 RLVR）。
- **第一章頁碼**：2026 版第 1 章 Linear regression 為 pp.9–20，四節分別是 LMS algorithm、The normal equations、Probabilistic interpretation、Locally weighted linear regression。房價範例為 Portland 的 47 筆資料。
- **開課紀錄**：ExploreCourses 2025-2026 學年顯示 CS 229 秋冬春夏四季皆開，3–4 學分，跨掛 STATS 229。2026-2027 學年目前掛冬季（Emily Fox）與春季（Tengyu Ma、Chris Ré）。課程官網當前掛的是 Summer 2026（Jehangir Amjad、Anand Avati）。
- **2026 春季播放清單**：`PLaqpC4kq8Gpw`，17 支，最後更新 2026-07-31。標題編號為 1–14、16、18、20。三支標題為「GMM (EM), PCA」，分別是清單第 10、16、17 位。觀看數落差取自 2026-08-21 的清單頁：Lecture 14 (Transformers) 約 99K，Lecture 9 (K-Means and GMM) 約 1.5K。
- **2018 課綱**：Wayback Machine 於 2019-07-04 存下的 `syllabus-autumn2018.html`。20 堂，分區為 Introduction (1)、Supervised learning (6)、Learning theory (2)、Deep Learning (2)、Unsupervised learning (5)、Reinforcement learning and control (4)。作業為 ps0 加 ps1–ps4，另有 take-home midterm 與期末專案（proposal、milestone、poster、final writeup 四個交件點）。
- **作業可得性**：`summer2019/ps1–ps3.pdf`、`summer2020/ps1–ps3.pdf` 與同名 `.zip` 皆回 200；`ps0`、`ps4`、`ps5` 回 404。PS1 14 頁 / 5 題 / 135 分，PS2 13 頁 / 6 題 / 120 分，PS3 14 頁 / 6 題 / 125 分。`environment.yml` 內容為 python=3.6.6、numpy=1.15.0、matplotlib=2.2.2、scipy、pillow。MNIST 那題的資料切分是 50,000 訓練／10,000 dev，另有 10,000 測試。
- **仍可下載的複習講義**：`section/cs229-linalg.pdf`、`section/cs229-prob.pdf`、`section/cs229-cvxopt.pdf`、`section/cs229-gaussians.pdf` 皆回 200；`notes/cs229-notes1.pdf` 等 2018 課綱上的舊分冊講義已全部 404。
- **自測題**：`https://see.stanford.edu/materials/aimlcs229/problemset1.pdf`，4 頁，PDF `CreationDate` 為 2008-10-06。標頭寫「CS 229, Public Course」。
- **未能確認的項目**：(1) 2026 春季錄影為何缺 15、17、19 三堂，以及後三支標題錯置的原因，Stanford Online 頁面與播放清單說明都沒有交代；(2) CS229 各季的成績配比（作業／期中／專案）——當期課綱鎖在 Stanford 帳號後，本篇未取得任何一季的正式配比，因此全篇不談分數比重；(3) 是否有公開的近期期末專案作品集入口，未找到；(4) 2019 與 2020 兩批作業以外，是否還有其他年份的 pset 留在伺服器上，本篇只逐一測試了 summer2019 與 summer2020 兩個路徑。

## 參考資料

- [CS229: Machine Learning 課程官網（Summer 2026）](https://cs229.stanford.edu/) — 先修條件原文、材料只給 Stanford affiliates 的聲明、歷屆開課頁索引
- [CS229 Spring 2026 課程頁](https://cs229.stanford.edu/index.html-spr26) — Tengyu Ma 與 Chris Ré 的授課季，2026 錄影對應的就是這一季
- [CS229 Fall 2022 課程頁](https://cs229.stanford.edu/syllabus-fall2022.html) — 舊版課程描述，以及指向 2022 凍結版講義的連結
- [CS229 講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) — 278 頁，六部結構、第一章內容與難點、第五部的 LLM 章節
- [CS229 2022 秋季凍結版講義](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) — 216 頁，用來對照四年之間多出來的內容落在哪
- [Linear Algebra Review and Reference](https://cs229.stanford.edu/section/cs229-linalg.pdf) — 講義第一章矩陣微分那幾行所指向的補充材料
- [ExploreCourses：CS 229](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog) — 一年四季開課、四組不同授課團隊、跨掛 STATS 229、以及 CS 230「CS 229 may be taken concurrently」的先修原文
- [Stanford Online：CS229 課程頁](https://online.stanford.edu/courses/cs229-machine-learning) — SCPD 入學門檻，以及「先看 problem set 1 再決定要不要修」那條官方自測建議
- [SEE 公開課 Problem Set 1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf) — 官方自測題本身，4 頁，2008 年建立
- [CS229 Summer 2020 Problem Set 1](https://cs229.stanford.edu/summer2020/ps1.pdf) — 題目結構與「不准用 scikit-learn」那條硬規定的原文
- [CS229 Summer 2020 Problem Set 2](https://cs229.stanford.edu/summer2020/ps2.pdf) — MNIST 手寫 backprop 那一題
- [CS229 Summer 2020 Problem Set 3](https://cs229.stanford.edu/summer2020/ps3.pdf) — 倒單擺 RL、半監督 EM、ICA 雞尾酒會
- [CS229 Autumn 2018 課綱（Wayback 存檔）](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html) — 20 堂的完整分區與作業安排，2018／2026 對照的來源
- [Stanford CS229 Machine Learning｜Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw) — 17 支、編號跳號、三支同名標題
- [Spring 2026「Lecture 20: GMM (EM), PCA」](https://www.youtube.com/watch?v=J7CossjMvEg) — 實際內容是最後一堂的 PPO 與長思維鏈 RLVR
- [Stanford CS229: Machine Learning led by Andrew Ng｜Autumn 2018 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU) — 自學者最常看的那一版
- [Stanford CS230 Autumn 2025 Lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg) — 問答段落裡 Andrew Ng 對 CS129／CS229／CS230 的定位，以及「兩門可以一起修」的回答
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[CS230：當提示工程失效](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
