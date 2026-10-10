---
title: "Harvard CS181 期末檢核與系列收尾：checklist、practice 與 practical 備援"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, final-exam, practical, learning-path]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 15
type: guide
tldr: "CS181 2026 期末（5 月 9 日）能公開拿到的 final checklist、second-half practice 16 題與 final review 66 頁都是 2025 版，涵蓋 Bayes net、EM 等 2026 週表沒有的題目，卻缺 Transformer、VAE、GAN、自迴歸模型。先把 checklist 對上 2026 週表分三類，再用 hw 與 section 補新講題，最後拿 2025 practical 補一次端到端專案。"
description: "Harvard CS1810 Spring 2026 期末檢核：final checklist 十一大塊與 2026 週表逐項對照、second-half practice 16 題怎麼挑、2025 final review 定位、2025 Cable News Clips practical 作為專案備援，以及學完後接 CS1820 與站內其他課。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-09-29-harvard-cs181-final-checkpoint-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本**：2026 期末日期與週表以 [課站 schedule（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) 為準；期末複習材料放在 [cs181-web 的 `static/`](https://github.com/harvard-ml-courses/cs181-web/tree/main/static)，實際打開後全是 **2025 版**（final review 標頭 `CS 1810 Spring 2025`，其餘 PDF 產生於 2025 年 5–6 月）。本篇 2026-09-29 查核。

## 課程影片來源

已核對 CS1810 Spring 2026 官方課表與 syllabus：本文依據作業、section 或考試教材導讀，對應條目未列公開講課影片；官方提供講課投影片與 section 教材。這表示公開課表未提供對應影片，不代表課程從未錄影。

官方來源：

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

查核日期：2026-10-10。

## TL;DR

- **期末本身**：[CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) 期末在 **5 月 9 日（六）下午 2 點**，佔 `15%`；[syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus) 寫明閉卷，可帶一張 8.5×11 雙面筆記。
- **材料的坑**：公開的 final checklist、practice、review 都是 2025 版。其中 Bayes net、mixture model／EM 在 2026 週表找不到對應講題；2026 新增的 Transformer、VAE、對比學習、GAN、自迴歸模型則完全沒被覆蓋。
- **怎麼補**：checklist 分成「兩年共有／只有 2025／只有 2026」三類處理；新講題回頭用 [s26 hw](https://github.com/harvard-ml-courses/cs181-s26-homeworks) 與 section soln 自測；想做一次完整專案，就拿 [2025 practical](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical) 補。

## 先認清：你手上的期末材料是哪一年

本系列前 14 篇沿著 [2026 hw0–hw6](/posts/tech/2026-08-27-harvard-cs181-overview) 走完一學期，這篇收尾，做兩件事：用官方材料檢核下半學期，再補上 2026 缺掉的 practical。

課站 `static/` 底下有四份期末相關 PDF，但目前沒有任何 HTML 頁面連過去，要從 repo 目錄直接開：

| 檔案 | 內容 | 年份證據 |
|---|---|---|
| [`final_checklist.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_checklist/final_checklist.pdf) | 11 大主題，每塊分「要知道」「給公式要會算」「不考」 | 未標年；PDF 產生於 2025-06 |
| [`final_practice.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf)（＋[soln](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf)） | 標題 `CS 1810 Second Half Practice Problems`，16 題 | PDF 產生於 2025-05 |
| [`final_review_soln.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf) | 複習課投影片，10 大段 | 標頭 `CS 1810 Spring 2025 Final Review Session` |

Checklist 開頭說它「不是窮舉」，要你搭配 textbook、section、hw 和 practice 一起看，還強調期末考的是 conceptual 與 analytical understanding，不是背誦。這句話在 2026 更重要，因為它列的主題跟 2026 實際教的已經不一樣了。

## Checklist 十一大塊對上 2026 週表

下表左欄照 checklist 原本的章節順序，右欄對上 [2026 週表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) 的講題與 hw。「狀態」是我依週表講題名稱做的判斷，不是官方公告的考試範圍。

| Checklist 章節 | 2026 對應 | 狀態 |
|---|---|---|
| 1 Regression（含 Bayesian 線性迴歸、posterior predictive） | W1–2；[HW0](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)、[HW1](/posts/tech/2026-08-27-harvard-cs181-hw1-regression) | 共有；Bayesian 部分在 2026 週表沒有獨立講題 |
| 2 Classification（logistic、GD、perceptron、Naive Bayes） | W3；[HW2](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance) | 共有 |
| 3 Neural Networks & Model Selection | W2、W4–5；[HW3](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling) | 共有 |
| 4 SVM | W4 Richer Features、S4 Kernel methods；HW3 kernel 題 | 部分：2026 週表沒有 SVM 講題名稱 |
| 5 Clustering（K-means、HAC） | W9；[HW5 分群與 PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca) | 共有 |
| 6 Mixture Models & Topic Models（EM） | 無對應講題；HW4 VAE 用到 ELBO | 只有 2025 |
| 7 Dimensionality reduction（PCA、SVD） | W9；HW5 | 共有 |
| 8 Graphical models & Bayes nets | 無對應講題 | 只有 2025 |
| 9 HMM（forward-backward、Viterbi、Kalman） | W11；[HW6 HMM 與 Kalman](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman) | 共有 |
| 10 MDP（VI、PI） | W12；[HW6 MDP](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning) | 共有 |
| 11 RL（SARSA、Q-learning） | W12–13；[HW6 Q-learning](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics) | 共有 |

反過來看，2026 教了、checklist 卻一個字都沒提的有：CNN、Autoencoder 與 VAE（[HW4](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)）、[Transformer](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer)、[決策樹與隨機森林](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)、[對比學習與 GAN](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans)、[自迴歸模型](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding)。

**怎麼用這張表**：

- **共有**的八塊：直接照 checklist 的「要知道」逐條口頭解釋一遍，說不出來的回到對應 hw。
- **只有 2025** 的兩塊：自學者不必硬啃。2026 期末會不會考，官方材料沒說；如果你要的是完整 ML 地圖，Bayes net 和 EM 值得各花一個晚上。
- **只有 2026** 的六塊：沒有官方期末練習，只能靠 hw 本身和 2026 section soln 自測，下一節會講。

Checklist 也寫明哪些**不考**，例如 SVM dual 與 KKT 推導、二階最佳化方法、背 conjugacy 公式。這些可以放心跳過。

## Practice 16 題怎麼挑

`Second Half Practice Problems` 的 16 題依序是：HAC、Bayesian networks（兩題）、MDP 建模（電梯）、MDP 的替代 reward 函數、MDP planning（gridworld）、強化學習（SARSA）、K-Means、HMM、mixture model 的平均、EM、PCA、轉換後資料的 PCA、multinomial 資料上的 EM、毛毛蟲 MDP、Everything is a graphical model。

依 2026 週表分組：

- **優先做（2026 有教）**：第 1、4–9、12–13、15 題。HAC 要畫 min-linkage 與 max-linkage 兩張 dendrogram；gridworld 題要做一輪 policy improvement；SARSA 題要手算三步更新。三題都是「給公式、照步驟算」，正好對應 checklist 的第二層。
- **選做（只有 2025）**：第 2–3、10–11、14、16 題，Bayes net 與 EM 為主。

**今晚就能做的事**：挑 HAC、gridworld、SARSA 三題，限時 60 分鐘不看解答寫完，再對 [soln](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf)。卡住的題目，回去重讀對應的 hw 導讀。

## 2025 Final Review：當成索引，不是教材

[Final review](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf) 共 66 頁，目錄分 Regression、Classification、Model Selection、Neural Networks、SVM、Clustering and Mixture Models、PCA、Topic Models and Graphical Models、HMM、MDPs and RL 十段。它比 checklist 多一層：每段有公式摘要，例如 Lloyd's algorithm 的兩步更新、HAC 的四種 linkage（min、max、average、centroid）。

它最適合用來做那張可帶進考場的雙面筆記：把「共有」八塊的公式抄一遍，再自己補上 2026 新講題的核心式子，例如 attention 的 √d_k 縮放、VAE 的 reparameterization。2025 投影片裡沒有這些，要從 hw 題目自己整理。

## 2026 新講題：用 hw 與 section 自己檢核

官方期末材料沒有覆蓋的新講題，能用的官方練習只有兩種：

1. **hw 題目本身**：[s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks) 沒有公開解答，但每題的小題拆得很細。把 hw4 Transformer 題、hw5 SimCLR 與 GAN 題、hw6 自迴歸解碼題各挑一小題，蓋掉筆記重做。
2. **2026 section soln**：[sections 頁](https://harvard-ml-courses.github.io/cs181-web/sections)說明 section 講義與解答貼在週表上，檔案在 `static/secNN/`（例如 [S10 解答](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf)，標頭 `Spring 2026`）。S5（NN training and architectures）、S6（Transformers, Autoencoders, Decision Trees）、S7（Unsupervised Learning）、S8（Generative Modeling Medley）、S9（Autoregressive Models and HMMs）、S10（MDPs and RL）都有 `_soln.pdf`，是新講題唯一有解答可對的材料。

週表第 14 週（4 月 28 日）的講題是 `Practical DL / TBD`，只是一堂課的名稱，沒有連到作業或講義。

## Practical 備援：2025 的 Cable News Clips

2026 成績是 `hw0 4% + hw1–6 各 11% + midterm 15% + final 15%`，沒有 practical；[2025 版](https://harvard-ml-courses.github.io/cs181-web-2025/)則有 `practical 6%`。hw 都是拆好的小題，practical 是唯一一份「自己決定資料處理、模型、調參，再寫報告辯護」的作業，自學者很值得補做。

[2025 practical 說明](https://github.com/harvard-ml-courses/cs181-s25-homeworks/blob/main/practical/practical_instructions.pdf)（`Practical 2025: Classifying Cable News Clips`，原訂 2025 年 4 月 30 日截止，2–3 人一組）的內容：

- **任務**：只用逐字稿文字，預測新聞片段出自哪一家電視台。資料抓自 Internet Archive 的電視新聞存檔，篩選提到「ML」或「AI」的 2024 年片段。
- **切分**：依時間切，1–10 月是 `train.csv`，11–12 月是 `val.csv`，模擬真實預測情境。說明特別提醒類別可能嚴重不平衡。
- **Part A**：兩種文字表示（例如 `CountVectorizer`、`TfidfVectorizer`）各配一個 logistic regression，不調參。
- **Part B1**：至少一個不調參的非線性模型（隨機森林、kNN、NN 等），跟 Part A 比較。
- **Part B2**：至少兩類模型做超參數搜尋，至少一個超參數試 5 個以上的值，並說明驗證策略。
- **報告**：3–4 頁，第 4 節要求逐項反思八件事：data pipeline、model selection、tuning、bias-variance、評估指標、領域檢查、設計檢討、部署與倫理。
- **門檻**：建議驗證準確率至少 60%，但方法與報告紮實，沒達到也能拿滿分。另有選做的 Part C（例如 BERT、處理類別不平衡）與 Kaggle 加分賽，`test.csv` 不附標籤。

資料在 repo 的 [`practical/data`](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical/data)，`train.csv` 約 22 MB，直接 clone 就能開工。Kaggle 比賽屬於 2025 當期活動，本文沒有查證現在能否提交，自學時用 `val.csv` 評估即可。

**建議做法**：期末複習結束後找一個週末，照 Part A → B1 → B2 的順序做完，報告只寫第 4 節八題，每題 2–4 句。這八題幾乎就是整門課的應用版複習。

## 學完之後往哪走

- **Harvard 的下一門**：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)說明 CS1820（Planning and Learning Methods in AI）跟 CS1810 不是上下集，而是從 search、planning、games、不確定性切入 AI。Fall 2026 班次在該文查核時只到 **A0**，沒有可自學的教材。
- **同級 ML 課換個角度**：[Berkeley CS189 Spring 2025](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview) 的作業與歷屆考題都公開；[Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning) 的推導比較重。
- **往深度學習與 LLM 走**：CS181 的 Transformer 與自迴歸解碼只開了個頭，可以接 [Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)。
- **往強化學習走**：hw6 的 MDP 與 Q-learning 是起點，[CMU 07-280](/posts/ai/2026-08-22-cmu-07280-course-overview) 會一路走到 AlphaZero。
- **找其他課**：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)用 A0–A3 標出每門課能自學到什麼程度。

## 系列導覽

- 上一篇：[HW6（四）Q-learning 玩 Swingy Monkey＋Embedded EthiCS](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics)
- 回到起點：[Harvard CS181 導讀總覽](/posts/tech/2026-08-27-harvard-cs181-overview)
- 上半學期對照：[期中檢核](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Harvard CS181 2026 課程首頁](https://harvard-ml-courses.github.io/cs181-web/)
- [CS181 2026 Syllabus（成績配分、考試規則）](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [CS181 2026 Schedule（Google Sheet，第 14 週與 Final Exam May 9 2pm）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS181 Final Checklist（PDF）](https://harvard-ml-courses.github.io/cs181-web/static/final_checklist/final_checklist.pdf)
- [CS 1810 Second Half Practice Problems（PDF）](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf)、[解答](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf)
- [CS 1810 Spring 2025 Final Review Session 解答投影片（PDF）](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf)
- [CS181 2026 Sections](https://harvard-ml-courses.github.io/cs181-web/sections)、[S10 解答範例（PDF）](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf)
- [cs181-s26-homeworks（GitHub）](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [cs181-s25-homeworks practical（GitHub）](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical)、[Practical 2025 說明（PDF）](https://github.com/harvard-ml-courses/cs181-s25-homeworks/blob/main/practical/practical_instructions.pdf)
- [CS181 2025 課程站（practical 6% 配分）](https://harvard-ml-courses.github.io/cs181-web-2025/)
