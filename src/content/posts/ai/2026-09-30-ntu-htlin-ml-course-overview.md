---
title: "林軒田機器學習基石與技法導讀：總覽與自學路線"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 0
tldr: "林軒田的機器學習基石（16 講）與技法（16 講）是兩門中文 MOOC，130 支 YouTube 影片與 32 份投影片全部免費。只看 MOOC 是 A2：Coursera 自 2025 年 8 月起只讓免費帳號看第一單元，練習題被擋在付費牆後。補上 Fall 2024 課程頁公開的 HW0–HW7 與期末專題說明，就能到 A3，只差評分鏈：沒有官方解答，Gradescope 與 NTU COOL 限修課生，Kaggle 競賽頁回傳 404。Fall 2026 正在進行，是翻轉教室，第 4 週以前的投影片與 hw0、hw1 已公開。"
description: "台大林軒田《機器學習基石》《機器學習技法》系列入口：兩門 MOOC 的 32 講結構與七個問題、MOOC／Fall 2024／Fall 2026 三層版本基準、A0–A3 存取分級與缺口、YouTube 與 Coursera 預覽制的差別、Fall 2026 翻轉教室的課前必看清單，以及三條自學路線與本系列 19 篇的篇目。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

台大資工系林軒田老師的[機器學習基石](https://www.csie.ntu.edu.tw/~htlin/mooc/)與機器學習技法，是很多中文讀者學機器學習理論的第一門課。兩門課都是 2015–2016 年在 Coursera 上開的中文 MOOC，教科書是他和 Yaser Abu-Mostafa、Malik Magdon-Ismail 合著的 [Learning from Data](http://amlbook.com)（下稱 LFD）。基石問的是「機器為什麼學得會」，一路講到 VC 維度與正則化；技法接著講 SVM、boosting、決策樹與神經網路。

十年後，林軒田自己的台大課程仍然以這兩門 MOOC 為骨架：[Machine Learning, Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 採翻轉教室，每週的「required watching (before class)」就是 MOOC 影片。

這篇是系列入口，只講課程結構、校外讀者拿得到什麼、該照什麼順序讀。各講內容留給後面各篇。

**本文依據**：[MOOC 頁](https://www.csie.ntu.edu.tw/~htlin/mooc/)（頁尾最後更新 2024-08-30）、[基石](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)與[技法](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)兩份 YouTube 播放清單、[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)與 [policy.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf)、[Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)與各份作業 PDF、[Coursera 基石上課頁](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)、[臺大開放式課程的 Coursera 政策說明](https://ocw.aca.ntu.edu.tw/courses/mooc0016)，全部在 2026-09-30 打開核對。

## 兩門 MOOC：七個問題、32 講、130 支影片

[01_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf) 第 2 頁把基石定位成「foundation oriented」而且「story-like」的課，用四個問題串起來。技法再用三種處理特徵的方式分段。Fall 2026 課程頁把這七段編成 topic 1 到 topic 7：

| 段 | 問題（投影片原文） | 講次 | 本系列 |
|---|---|---|---|
| 基石 1 | When Can Machines Learn? | L1–L4 | [第 1 篇](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)、[第 2 篇](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning) |
| 基石 2 | Why Can Machines Learn? | L5–L8 | [第 3 篇](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)、[第 4 篇](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error) |
| 基石 3 | How Can Machines Learn? | L9–L12 | [第 5 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)、[第 6 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform) |
| 基石 4 | How Can Machines Learn Better? | L13–L16 | [第 7 篇](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)、[第 8 篇](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles) |
| 技法 1 | embedding numerous features（kernel 模型） | T1–T6 | [第 9 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)、[第 10 篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)、[第 11 篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression) |
| 技法 2 | combining predictive features（aggregation 模型） | T7–T11 | [第 12 篇](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)、[第 13 篇](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt) |
| 技法 3 | distilling hidden features（extraction 模型） | T12–T15 | [第 14 篇](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)、[第 15 篇](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization) |
| 收尾 | finale（happy learning!） | T16 | [第 16 篇](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning) |

每一講在 MOOC 頁上列 4 個小節標題，每個小節對應一支影片。基石 L1 與技法 T1 各多一支「Course Introduction」，所以兩份播放清單各是 65 支，合計 130 支。基石第一支影片上傳於 2015-12-09，技法第一支上傳於 2016-02-14。

投影片分兩種：handout（講義版）與 presentation（逐步動畫版），檔名是 `01`–`16`（基石）與 `201`–`216`（技法）。兩門課各有一份 handout 全集 zip（[基石](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip)、[技法](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mltech_handout.zip)）。MOOC 頁寫明投影片以 CC-BY-NC 3.0 分享，但圖的版權仍屬原作者，多數情況是 LFD 的作者群。另有[勘誤頁](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)。

授課是中文，投影片是英文。本系列提到四大問題與各講標題時保留投影片原文，方便你對照影片。

## 三層版本基準

同一套內容現在有三個版本，每篇都會寫清楚引用的是哪一層：

| 層 | 是什麼 | 狀態 | 本系列拿來做什麼 |
|---|---|---|---|
| MOOC | 基石 16 講＋技法 16 講的錄影與投影片 | 錄影 2015–2016，MOOC 頁最後更新 2024-08-30 | 核心教材 |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | 台大校內課，週一 13:20–16:20，課程頁寫「English teaching」；評分 70% homework、30% project（tentative） | 已結課 | 作業基準：HW0–HW7 與期末專題的 PDF 都公開 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | 台大校內課，週三 9:10–12:10，「Mandarin teaching」；評分 30% homework、30% exam、40% project（tentative） | 進行中，今天是 W4 | 當期對照：課前必看清單、extended slides、hw0 與 hw1 |

Fall 2024 的作業放在課程頁的 `hwN/` 子頁，例如 [hw1 子頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/)下的 `hw1_red.pdf`。每份作業 12 題加 1 題 bonus，前 4 題自動批改，後 8 題由助教批改。程式題用的資料大多來自 [LIBSVM datasets](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/)，例如 HW1 的 `rcv1_train.binary`。

[期末專題說明 final.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf) 是一個虛構的棒球聯盟 HTMLB：預測主場球隊輸贏，分兩個 stage 在 Kaggle 上繳交，報告要用英文寫。

Fall 2026 的 [policy.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf) 寫的規則：

- 約 6 份作業，雙週一份，交出後兩週截止；遲交每 12 小時扣 10%，每人有 4 個免罰的半天（gold medals）。
- 作業是選擇題自動批改，但推導過程要上傳給助教抽改，程式題要附原始碼；沒有推導或沒有原始碼的答案一律零分。
- 可以用 AI 工具輔助，但不可直接交出 AI 的輸出。程式若由生成式 AI 產生，要逐段用自己的話寫註解。
- 沒有期中考，有期末考（課程頁排在 12/09）。

## 存取分級：只看 MOOC 是 A2，加上 Fall 2024 作業是 A3

分級沿用[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的定義：A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。

| 組合 | 分級 | 理由 |
|---|---|---|
| 只看 MOOC | A2 | 錄影與投影片全開，但練習題在 Coursera 付費牆後 |
| MOOC＋Fall 2024 課程頁 | A3（評分鏈除外） | HW0–HW7 題目與期末專題說明都公開，資料集多數可下載 |
| Fall 2026 當期 | A2（進行中） | W1–W4 投影片、hw0、hw1 與 `hw1_train.dat` 已公開；W5 以後的投影片連結目前 404 |

校外讀者拿不到的部分，後面每篇作業相關段落都會再寫一次：

1. **沒有官方解答**。Gradescope 自動批改與助教批改只限修課生。
2. **NTU COOL 要台大帳號**。Fall 2024 是 [課程 40495](https://cool.ntu.edu.tw/courses/40495)，Fall 2026 是 [課程 63348](https://cool.ntu.edu.tw/courses/63348)。
3. **Kaggle 期末競賽頁回傳 404**。final.pdf 列的 [stage 1](https://www.kaggle.com/competitions/html-2024-fall-final-project-stage-1) 在 2026-09-30 打開是 404，可能是私人競賽或已下架。資料還拿不拿得到、能不能遲交，本系列沒有確認。
4. **Fall 2026 還在進行**。hw2–hw6、期末專題與 W5 以後的投影片都還沒公開。

## YouTube 與 Coursera：2025 年 8 月以後差在哪

MOOC 頁為兩門課各給了 Coursera 與免費 YouTube 兩種入口。基石在 Coursera 上拆成兩門：[基石上（Mathematical Foundations）](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)與[基石下（Algorithmic Foundations）](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)；技法是[另一門](https://www.coursera.org/learn/machine-learning-techniques)。基石上的課頁寫「There are 8 modules in this course」。

差別在練習題。[臺大開放式課程](https://ocw.aca.ntu.edu.tw/courses/mooc0016)的說明是：Coursera 已把「旁聽（Audit）」改成「預覽（Preview）」，自 2025 年 8 月起全球實施，免費帳號只能看課程的第一個單元，要修完整課程（含所有單元、作業與評量）就要付費訂閱或購買。這段說明掛在臺大 OCW 的另一門課上，屬於平台層級的政策；林軒田的 Coursera 課頁本身沒有寫。

所以現在的實際選擇是：

- **只想看課**：YouTube 播放清單就夠，影片與 Coursera 版相同，而且沒有單元限制。
- **想要練習題與證書**：Coursera 要付費。本系列沒有打開付費牆後的題目，不描述它們的內容。
- **想要免費練習題**：改用 Fall 2024 課程頁的作業 PDF，這是本系列採用的基準。

## Fall 2026 翻轉教室：前四週的課前必看

Fall 2026 課程頁每週列出「required watching (before class)」：一份 MOOC 投影片、LFD 章節與 3–5 支 YouTube 影片。已經公開的四週如下：

| 週次 | 課前必看 | LFD 章節 | 另外公開 |
|---|---|---|---|
| W1（09/09） | 無，課堂是 course introduction | — | 00_handout、hw0 公布 |
| W2（09/16） | L1 四支、L2 四支、L3 第一支 | 1.0、1.1.1、1.2.4；1.1.2、3.1；1.2、1.3 | 01e／02e／03e extended slides |
| W3（09/23） | L3 後三支、L4 四支、L5 第一支 | 1.2、1.3；1.3；2.0、2.1.1 | 03e／04e、Wolpert 論文、hw1 公布 |
| W4（09/30） | L5 後三支、L7 四支、L8 三支；L6 四支列為「suggested watching (anytime)」 | 2.0、2.1.1；2.2；1.4 | 05e／07e |

W5 以後的列目前只有投影片連結（例如 `09u_handout.pdf`），打開是 404，也還沒有影片清單。課程計畫裡有幾個和 MOOC 不同的地方：T5–T6、T14–T15 沒排進課表；W13（12/02）停課，改放 `mlmai.ics` 投影片；W14 期末考；W16 講 modern deep learning 與 finale。

課堂有對 TAICA 與公開的[同步直播](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/screencast.php)，另有旁聽申請表單。直播有沒有留下完整錄影，本系列沒有逐支核對。

## 三條自學路線

**路線 A：只看影片（A2）**。照 YouTube 播放清單順序看，每講配 handout 投影片。每個小節結尾都有一題「Fun Time」選擇題，可以當作最低限度的自我檢查。適合只想建立直覺、不打算推導的人。

**路線 B：影片＋Fall 2024 作業（A3，本系列主線）**。先做 [Fall 2024 HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf) 當先修檢測，組合機率、線代、微積分卡住的部分先補。之後一講一篇讀本系列，每篇最後列出 Fall 2024 哪幾題作業練得到這個主題。沒有官方解答，所以程式題要自己設驗收方法，例如用 scikit-learn 的同名模型對照數值。

**路線 C：跟 Fall 2026 直播**。照課程頁每週的課前必看清單看影片，再做當期作業。hw0 與 hw1 都在 2026-10-21 截止，旁聽生可以自己照時程練，但拿不到批改。

先修方面，這門課需要大一微積分、線性代數與機率。機率不熟的話，可以先讀站內的 [Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)，或看[統計與 ML 系列](/series/statistics-ml-ai)。

## 本系列篇目

| order | 篇目 | 講次 |
|---|---|---|
| 1 | [學習問題、PLA 與學習的種類](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron) | 基石 L1–L3 |
| 2 | [學習可行嗎：Hoeffding 與「出了資料之外」](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning) | 基石 L4 |
| 3 | [訓練與測試：有效假說數、成長函數與 break point](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function) | 基石 L5–L6 |
| 4 | [VC 維度、雜訊與誤差衡量](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error) | 基石 L7–L8 |
| 5 | [線性迴歸與邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression) | 基石 L9–L10 |
| 6 | [線性分類模型、SGD、多類別與非線性轉換](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform) | 基石 L11–L12 |
| 7 | [過擬合與正則化](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization) | 基石 L13–L14 |
| 8 | [驗證與三個學習原則](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles) | 基石 L15–L16 |
| 9 | [線性 SVM 與對偶 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm) | 技法 T1–T2 |
| 10 | [Kernel 技巧與軟邊界 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) | 技法 T3–T4 |
| 11 | [Kernel 邏輯迴歸與支援向量迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression) | 技法 T5–T6 |
| 12 | [Blending、Bagging 與 AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost) | 技法 T7–T8 |
| 13 | [決策樹、隨機森林與梯度提升樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt) | 技法 T9–T11 |
| 14 | [神經網路與深度學習](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning) | 技法 T12–T13 |
| 15 | [RBF 網路、k-means 與矩陣分解](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization) | 技法 T14–T15 |
| 16 | [總結：三大技巧與現代深度學習補充](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning) | 技法 T16＋Fall 2024 補充投影片 |
| 17 | [基石作業導讀：Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide) | 對應 L1–L16 |
| 18 | [技法作業與期末專題：HW6–HW7 與 HTMLB](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project) | 對應 T1–T12 |

## 今晚可以做的事

1. 打開 [Fall 2024 HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf)，限時一小時做完組合機率那一段。卡住兩題以上，先補機率再開始看影片。
2. 下載[基石 handout zip](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip)，看完 [Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0) 這支影片。
3. 決定你走哪一條路線，然後讀[第 1 篇](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)。

## 延伸閱讀

以下課程和本系列有重疊，但本系列每篇都自己講完整，這裡只放連結：

- [台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)：把林軒田的課放進台大課程版圖比較。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：台大的平行路線，從 AI Agent 切入，偏深度學習與生成式 AI。
- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：SVM、kernel 與學習理論的另一種講法。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：Abu-Mostafa 用同一本教科書開的英文課。Fall 2024 課程頁在 L6 旁邊直接並列他的英文 Lecture 6 與林軒田的中文版。
- [CMU 10-301 導讀](/posts/learning/2026-08-22-cmu-10301-overview)、[Berkeley CS189 導讀](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)：其他學校的 ML 入門課。

下一篇：[學習問題、PLA 與學習的種類](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 兩門 MOOC 的 32 講大綱、投影片、授權說明
- [機器學習基石 handout 全集（zip）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip)
- [機器學習技法 handout 全集（zip）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mltech_handout.zip)
- [MOOC 勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)（65 支）
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)（65 支）
- [Lecture 1 投影片 01_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf) — Course Introduction 與課程設計
- [Coursera：機器學習基石上（Mathematical Foundations）](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)
- [Coursera：機器學習基石下（Algorithmic Foundations）](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)
- [Coursera：機器學習技法](https://www.coursera.org/learn/machine-learning-techniques)
- [臺大開放式課程：Coursera 平台課程資訊提醒](https://ocw.aca.ntu.edu.tw/courses/mooc0016) — 2025 年 8 月起的預覽制
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — 課程資訊、課前必看清單、課程計畫
- [Fall 2026 Course Policies（policy.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf)
- [Fall 2026 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf)、[Homework 1 子頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — 作業時程與投影片
- [Fall 2024 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf)
- [Fall 2024 Final Project（final.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf)
- [LIBSVM Data](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) — Fall 2024 程式題資料集來源
- [Learning from Data 教科書網站](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- 站內：[全球 AI／CS 課程地圖（A0–A3 分級定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
- 站內：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
