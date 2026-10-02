---
title: "CS189 有三個版本：Spring 2026 底本、Spring 2025 經典版、Fall 2026 進行中"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 2
tldr: "Berkeley CS189 在網路上同時有好幾個學期的版本。本系列之後的講次與作業導讀以 Spring 2026（Listgarten／Dimakis）為底本：講義、25 支講課影片、附解答的 discussion、HW1–5 題目與期中考解答都能匿名取得，判為 A3。Spring 2025（Shewchuk）是另一條經典路線，SVM、決策樹、PCA、boosting 只有它講；Fall 2025 的作業資料夾匿名打開是空的，所以不選；Fall 2026 還在進行中，只拿來對照。"
description: "Berkeley CS189 版本地圖：為什麼選 Spring 2026 當底本、它的 syllabus（先修、評分、兩段式作業、hidden tests、Bishop 課本）、每種教材放在哪、校外讀者怎麼自評，以及只有 Spring 2025 講的主題要去哪裡補。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en)

[Berkeley CS189/289A Introduction to Machine Learning](https://eecs189.org/sp26/) 是 Berkeley 的機器學習入門課。問題在於，網路上搜得到的 CS189 不只一個：Shewchuk 教的 Spring 2025、Norouzi 與 Gonzalez 教的 Fall 2025 和 Fall 2026、Listgarten 與 Dimakis 教的 Spring 2026。四個學期的課序、課本、作業都不一樣。本系列的 [order 1 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)寫於 Spring 2026 課站重新上線之前；這篇重新盤點版本，決定後面的講次與作業導讀要以哪一個學期為準。

結論先講：**從本篇開始，講次與作業導讀一律以 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）為底本。** 它是目前唯一同時公開講課影片、講義、附解答的 discussion，而且作業完整公開到 notebook 的版本。

## 四個版本並排看

以下每一格都是 2026-09-29 匿名打開官方頁面核對的結果。等級用本站[全球課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 定義：A0 只看得到課表、A1 看得到課綱、A2 教材部分開放、A3 足以自學。

| 版本 | 講者 | 匿名拿得到什麼 | 缺口 | 等級 |
|---|---|---|---|---|
| [Spring 2026](https://eecs189.org/sp26/) | Listgarten、Dimakis | 27 講排程；講義 PDF 或 Notes 放在 Google Drive；官方站連結的 YouTube 播放清單有 25 支講課影片；Discussion 1–12 各有題目、解答與 walkthrough 影片；HW1–5 的 Drive 資料夾（PDF、LaTeX 模板、notebook，HW5 附解答） | Gradescope、hidden tests、Ed；HW1–4 解答；期末考；Lec 1 錄影 | **A3（底本）** |
| [Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/) | Jonathan Shewchuk | 每講 lecture notes、整本 [machlearn.pdf](https://people.eecs.berkeley.edu/~jrs/papers/machlearn.pdf)、HW1–7（zip 或 PDF）、歷屆期中與期末考 | 正式錄影在 bCourses，要登入；公開的只有 Drive 上的 screen-only 備份錄影 | A3，但路線不同 |
| [Fall 2025](https://eecs189.org/fa25/) | Narges Norouzi、Joseph Gonzalez | 排程、slides、講課播放清單、discussion | HW 的 Drive 資料夾匿名打開是空的；首頁連的 `BerkeleyML/fa25-student` repo 回 404 | A2 |
| [Fall 2026](https://eecs189.org/fa26/) | Norouzi、Gonzalez | 進行中（首頁寫 Week 6）；已上的講有教材；`BerkeleyML/fa26-student` repo 可以打開 | HW 在首頁沒有公開連結；學期還沒結束 | A1→A2 |

Spring 2026 首頁的 [Past Offerings](https://eecs189.org/sp26/past-offerings/) 頁列出更早的學期，從 Spring 2016 到 Fall 2025，多數是 Shewchuk 的 `~jrs/189sXX` 頁面。

**今晚就能做的事**：打開 [Spring 2026 首頁](https://eecs189.org/sp26/)，往下捲到排程表，確認你看得到每一列的 PDF 和 Video 連結。

## 為什麼不選 Fall 2025

Fall 2025 的課序跟 Spring 2026 很像，講義也都在。問題出在練習鏈。首頁每份作業都連到 Drive 的 materials 資料夾，匿名打開卻是空的；首頁另外連到 `github.com/BerkeleyML/fa25-student` 當 Content Repository，那個網址回 404。

沒有作業的課只剩講義和影片。這種課可以拿來理解主題，卻沒辦法照著練。所以 Fall 2025 只判 A2，不當底本。

## Spring 2026 的 syllabus 重點

以下整理自 [Spring 2026 Syllabus](https://eecs189.org/sp26/syllabus/)。

**先修**：MATH 53（多變數微積分）、MATH 54（線性代數）、COMPSCI 70（機率與離散數學），或同等程度。Syllabus 具體點名要會的東西：梯度與多變數連鎖律、矩陣運算、條件機率與貝氏定理，以及寫得出、除錯得了複雜的 Python 程式。

**評分**：

| 項目 | CS 189 | CS 289A |
|---|---|---|
| Homework | 30% | 20% |
| 期中考 | 30% | 25% |
| 期末考 | 40% | 35% |
| 研究所期末專題 | — | 20% |

期中考在 3 月 17 日晚上，期末考在 5 月 11 日，都要到場考。

**作業是兩段式**。整學期 5 份作業，每份跨三週，分成 Part 1 Warmup 和 Part 2 Main Homework。Warmup 先介紹工具和觀念，Main 做更深的應用，兩段同時發、同一天截止。作業混合數學推導與程式，繳到 Gradescope。

**autograder 有公開和隱藏兩層**。Syllabus 寫明：public tests 主要是 sanity check，例如確認你填的是數字而不是文字；hidden tests 才檢查正確性，學生做作業時看不到。這點對校外讀者很重要：你能跑的只有 sanity check，對不對要自己驗。

**遲交規則有兩個版本**。Syllabus 寫「分數最低的一份作業自動不計」；[Lecture 1 投影片](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)的 Assessment Cadence 頁卻寫「No HW drops」，改給 10 天 slip days，每份最多 4 天。兩份官方文件互相矛盾，本文照原文並列。對校外讀者來說，這條規則不影響自學。

**AI 使用**：Lecture 1 寫的是開放使用 GenAI，但「No Vibe Coding/Writing」，你交出去的每一行都要懂。[Lecture 3](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link) 給了更具體的準則：能輕易驗證的事（視覺化、查文件）可以交給 AI；沒辦法驗證、自己寫不出測試或設計文件的東西，就不要讓 AI 代寫。

**課本**：Christopher M. Bishop 與 Hugh Bishop 的《Deep Learning: Foundations and Concepts》（Springer，2024）。Syllabus 給的 Springer PDF 連結要 CalNet 登入，校外讀者打不開。替代方案在 [bishopbook.com](https://www.bishopbook.com)：官方頁面放了一個 free-to-use 的線上閱讀版（issuu 嵌入），也提供第 2–10 章的習題解答下載。排程表每一講都列出建議閱讀的章節，本系列每篇會照抄。

[Resources 頁](https://eecs189.org/sp26/resources/)另外列了三本免費的補充教材：Murphy 的 [Probabilistic Machine Learning: An Introduction](https://probml.github.io/pml-book/book1.html)、Goodfellow 等人的 [Deep Learning](https://www.deeplearningbook.org/)、Prince 的 [Understanding Deep Learning](https://udlbook.github.io/udlbook/)。

## 每種教材放在哪

| 教材 | 位置 | 備註 |
|---|---|---|
| 講義 | 排程表每列的 PDF 或 Notes 連結（Google Drive） | Lec 13 起有些改成 Notes 資料夾 |
| 講課影片 | 官方站連結的 [Spring 2026 Lectures 播放清單](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE) | 25 支；Lec 1 只有 PDF，Lec 26 guest lecture 沒有教材 |
| Discussion | 排程表 Sections 欄，每週 PDF + Solutions + Walkthrough | 12 份 |
| 作業 | 排程表 HW 欄的 Drive 資料夾 | HW1 的 coding 放在 Modal notebook；HW5 標為選修 |
| 考古題 | Resources 頁的 [Past Exams 資料夾](https://drive.google.com/drive/folders/1jmkYiwFCEjhFmMTipTh7KMx-l9lbdDuZ) | 期中含 `sp26-midterm.pdf` 與解答；期末只到 sp25、fa25 |

Lecture 3 投影片提到課程內容也放在 `BerkeleyML/sp26-student` repo，但這個 repo 今天匿名打開是 404。Drive 上的檔案不受影響，本系列只引用 Drive 與課站連結。

**今晚就能做的事**：打開 [HW1 Part 1 資料夾](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)，確認看得到 `hw1.pdf` 和 `hw1_student.tex`。看得到，就代表你拿得到這門課的練習鏈。

## 校外讀者怎麼自評

你沒有 Gradescope，也沒有 hidden tests。能做的自評有三層：

1. **Discussion 解答**：每週先自己做 worksheet，再對 Solutions，卡住再看 walkthrough 影片。這是整門課回饋最完整的一層。
2. **期中考與解答**：做完前 16 講後，限時兩小時寫 `sp26-midterm.pdf`，再對 `sp26-midterm-sol.pdf`。首頁排程也連了期中考的 walkthrough 播放清單。
3. **期末考**：Spring 2026 期末考沒有公開，改用 `sp25-final` 或 `fa25-final` 加解答。注意 sp25 是 Shewchuk 版，範圍跟 Spring 2026 不完全重疊。

作業部分，HW1–4 沒有官方解答，只能靠自己寫測試。HW5 資料夾附了 `solutions/hw5-sol.pdf`。

## 只有 Spring 2025 講的主題

Spring 2026 是「從資料到 LLM」的現代路線。Shewchuk 的 Spring 2025 走的是另一條經典路線：perceptron、SVM、決策理論、高斯判別分析、回歸、決策樹、神經網路、PCA、boosting、最近鄰。以下幾個主題在 Spring 2026 排程裡沒有出現或只一筆帶過，想補要去 [Spring 2025 課站](https://people.eecs.berkeley.edu/~jrs/189s25/)：

| 主題 | Spring 2025 講次 |
|---|---|
| Hard-margin 與 soft-margin SVM | Lec 3–4 |
| 高斯判別分析（QDA／LDA） | Lec 7、9 |
| 決策樹、bagging、隨機森林 | Lec 14–15 |
| PCA、SVD、階層式聚類 | Lec 20–21 |
| AdaBoost、最近鄰與 Bayes risk | Lec 24 |
| 加速最近鄰查詢、Voronoi 圖、k-d tree | Lec 25 |

Spring 2026 的 syllabus 開頭提到 PCA，但排程表 27 講裡沒有獨立的 PCA 講次。本系列以排程表為準。

Spring 2025 的講課 notes 和整本 `machlearn.pdf` 都能匿名下載，作業 HW1–7 也在課站上。它自己是一門完整的 A3 課，適合當成 Spring 2026 的平行讀物，不是替代品。

## Fall 2026：下一學期長什麼樣

[Fall 2026](https://eecs189.org/fa26/) 由 Norouzi 與 Gonzalez 主授，今天首頁顯示 Week 6。排程也是 27 講，順序跟 Spring 2026 大致同構：KNN/K-Means → 密度估計與 GMM → 線性回歸 → logistic → 梯度下降 → 神經網路 → CNN → Transformer → LLM。差異有兩處：Lec 3 是獨立的 Dimensionality Reduction，後段多了 MDP/RL、post-training 與 diffusion。

本系列每篇末段會附一行「Fall 2026 對應講次」。學期結束後，如果 Fall 2026 的作業也完整公開，會再評估要不要換底本。

## 本系列接下來的路線

照 Spring 2026 官方課序排，作業導讀插在它涵蓋的講次之後：

- 下一篇：[Lec 1–3：ML 問題框架、資料工具、術語與技巧](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)
- 再下一篇：[Lec 4–7：K-means、機率複習、MLE、多變量高斯與 GMM](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm)
- 之後依序是線性回歸、HW1、分類與 logistic、梯度下降、MLE/MAP 與期中自評、HW2、神經網路、HW3、CNN、Transformer、HW4、LLM 與自監督、完課，最後是選修的 HW5。

## 延伸閱讀

- [Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)：CS189 在 Berkeley 課程地圖上的位置
- [Stanford CS109 機率導讀](/posts/learning/2026-08-21-stanford-cs109-probability)：先修機率不熟時的補課路線
- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：另一門數學型 ML 入門課，可以對照

## 參考資料

- [CS 189/289A Spring 2026 首頁與排程](https://eecs189.org/sp26/)
- [CS 189/289A Spring 2026 Syllabus](https://eecs189.org/sp26/syllabus/)
- [CS 189/289A Spring 2026 Resources](https://eecs189.org/sp26/resources/)
- [CS 189/289A Spring 2026 Past Offerings](https://eecs189.org/sp26/past-offerings/)
- [CS 189 Spring 2026 Lectures 播放清單](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [CS 189 歷屆考古題資料夾（Google Drive）](https://drive.google.com/drive/folders/1jmkYiwFCEjhFmMTipTh7KMx-l9lbdDuZ)
- [Spring 2026 Lecture 1 投影片](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)
- [Spring 2026 Lecture 3 投影片](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link)
- [CS 189 Spring 2025（Shewchuk）課站](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [CS 189 Fall 2025 課站](https://eecs189.org/fa25/)
- [CS 189 Fall 2026 課站](https://eecs189.org/fa26/)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts 官方頁面](https://www.bishopbook.com)
