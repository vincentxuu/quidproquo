---
title: "CMU AI／ML 課程導讀：07-280 新主幹與校外可走的公開路線"
date: 2026-08-21
category: learning
tags: [cmu, ai-course, machine-learning, learning-path, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 2
type: guide
tldr: "CMU 現行 BSAI 已改成 07-280 → 07-380，再從 NLP／視覺核心與四個 AI clusters 延伸；但 07-380 要到 Fall 2026 才首開。07-280 Spring 2026 的殘留教材與 10-301/601 已能完整自學，15-281 則是仍有價值的退休舊路線。"
description: "以 CMU 官方 BSAI 要求、2026 課號改制、實際開課與匿名存取測試，整理 07-280、07-380、15-281、10-301、10-414、11-785 與 16-385 的自學路線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en)

CMU 的情況和前幾站都不一樣：它不只有正式的人工智慧學士（BSAI），還正在改寫這個學位的基礎課。Spring 2026 首次開出 **07-280 Artificial Intelligence and Machine Learning I**；Fall 2026 才會首次開出下集 **07-380**。舊的 15-281 Artificial Intelligence 與 10-315 Introduction to Machine Learning for SCS，則逐步退出常規路徑。

這會產生一個看似矛盾、其實很重要的答案：**想知道 CMU 現在認為 AI 學生該學什麼，要看 07-280／380；想在校外今天就完成一條公開課，要用已完成的 07-280 Spring 2026 殘留教材或持續開課的 10-301/601，不能直接照著尚未開學的 Fall 2026 頁面走。**

這篇因此不會拿一張「最新課號清單」冒充自學路線。我會先還原 BSAI 新主幹，再把 2025–2026 課站逐一用匿名視窗檢查。本文查核日是 **2026 年 8 月 21 日**；Fall 2026 課程尚未開始，未來課表不會被算成已完成教材。

## BSAI 新主幹：不是只學模型

CMU 在 Fall 2018 推出 BSAI。現行 curriculum 先要求完整的數學、統計與 CS 地基，包括 15-122、15-150、15-210、15-213、15-251，以及微積分、線性代數、離散數學和機率統計。AI 本身的核心則可以壓成：

```text
15-122 + 離散數學 + 線性代數
          + 微積分／機率
                 ↓
       07-280 AI & ML I
                 ↓
       07-380 AI & ML II
                 ↓
      11-411 NLP 或 16-385 視覺
                 ↓
四群各一門：決策／機器人｜ML｜感知／語言｜人機 AI 互動
```

這個結構比「先學 ML，再挑一門 LLM 課」寬很多。學生除了模型與感知，還要碰決策、機器人、人機互動，以及獨立的倫理選修。07-280 本身也把 search、constraint satisfaction、機率、機器學習、強化學習與 GPU 基礎放進同一門課；課程描述用 AlexNet、GPT-2 與 AlphaZero 等實作，把符號式 AI 與現代深度學習接在一起。

07-280 的正式地基包含 15-122、線性代數與 concepts／離散數學，另外還有微積分與機率要求。07-380 再要求 07-280、Calculus II 與指定機率課。這些是 CMU 對校內學生的嚴格 prerequisites；校外讀者雖然不會被系統擋課，缺掉同樣的能力仍會在作業裡付代價。

## 07-280／380 不是把舊課直接換號

舊路線常被寫成：

```text
15-281 Artificial Intelligence + 10-315 Machine Learning
```

新路線則是：

```text
07-280 AI & ML I → 07-380 AI & ML II
```

這不是把兩門舊課一對一改號，而是把 AI 與 ML 重新混合、再分配廣度與深度。07-280 FAQ 也直接比較它和 10-301：兩者都能建立 introductory ML 能力，但 07-280 額外放進搜尋、CSP、GPU 基礎與 Monte Carlo tree search；10-301 則保留 KNN、perceptron、PAC learning、PCA、clustering、bagging／boosting 與推薦系統等較專門的 ML 主題。

時間線要寫精確：

- **Fall 2025**：15-281 仍正常開課。
- **Spring 2026**：07-280 首次開課；15-281 另保留 permission-only 過渡班，服務已修舊 10-315、仍需完成舊配對的學生。
- **Fall 2026**：07-380 首次開課；官方規劃之後 07-280 與 07-380 每個 Fall／Spring 都開。

所以「15-281 已退休」不等於 Spring 2026 完全沒有這門課；比較準確的說法是它已退出常規入口，只留過渡安排。10-301 又是另一件事：它沒有退休，仍是 CMU Machine Learning Department 的通用 ML 入門。已修 10-301 的 BSAI 學生也不能自行認定它會自動抵 07-280 或取得 07-380 資格，官方要求個別討論替代路徑。

## 2025–2026 公開教材盤點

以下沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 編輯分級：A0 只有 catalog，A1 有課綱，A2 有部分實質教材，A3 才表示公開材料能排成連貫自學課。這不是 CMU 官方評分，也不包含學分、助教、正式評分、同儕或免費算力。

| 課程與版本 | 等級 | 匿名讀者拿得到什麼 | 主要缺口 |
|---|---:|---|---|
| **07-280, Spring 2026** | **A3** | lecture PDFs／notes、recitation 與解答、書面 HW、部分 programming notebooks | 首頁已切到 Fall 2026，缺穩定學期索引；無完整公開影片／autograder |
| **07-280, Fall 2026** | **A2** | 完整課綱、24 講主題、部分公開 notes | 8/25 才開課；當期 slides、作業與錄影尚未發布完整 |
| **07-380, Fall 2026** | **A0** | 11 行課程規格：描述、主題、先修與評量 | 首次開課；尚無 syllabus、schedule 或實際教材 |
| **15-281, Spring 2026** | **A3** | slides、course notes、recitation、P0–P5、書面作業、考試練習與解答 | 部分 Panopto、Canvas、Gradescope 功能需校內身分 |
| **10-301/601, Spring 2026** | **A3** | 27 講 slides／inked slides、readings、recitation 與解答、9 份 HW 與 starter、考試練習與解答 | Panopto、Piazza、Gradescope 與正式作業解答受限 |
| **16-385, Spring 2026** | **A2** | 26 講 slides／readings、notebooks、7 份 programming assignment 規格 | 帳號、提交、評分與部分 starter access 受限 |
| **11-785, Spring 2026** | **A3** | 29 講公開 YouTube／slides、notes、bootcamp／recitation notebooks | HW1–4 幾乎都依賴 Piazza／Autolab；無匿名 CMU compute |
| **10-414/714, current site** | **A3*** | 26 講 slides／notebooks、2022 官方影片與 implementation notebooks | `*` 是跨版組合；2025 HW0–3 repo 現為 404，`mugrade` 只供校內學生 |
| **10-708, Spring 2026** | **A2** | 約 25 組 slides 與 readings | 錄影限修課者；四份 HW 只在 Piazza |

07-280 必須拆成兩個版本看。網站首頁現在已切到 Fall 2026，當期課程要四天後才開始，lecture material 欄與多數作業尚未上線，所以只能算 A2 預覽；不過 Spring 2026 已完成班次的 lecture PDFs、notes、recitation worksheets／solutions、書面 HW，以及 AlexNet、GPT-2、AlphaZero 等部分 notebooks 仍能從 CMU 官方網址直接匿名取得，足以判 A3。問題是官方沒有保留穩定的 Spring 2026 學期首頁，這些直連未來可能失效。

07-380 更明確：目前有一份很有價值的課綱，能看到 ML theory、game theory、probabilistic graphical models、planning、distributed deep learning、generative AI、RLHF、vision transformers、diffusion 與 VAE 等範圍；但第一堂課都還沒發生，不能因為主題表很完整就判 A3。

## 校外真正走得下去的三條路

### 1. 廣義 AI：07-280 跟新主幹，15-281 當備用

如果你想補搜尋、規劃、不確定性與 agent 基礎，優先用 **07-280 Spring 2026**。它既是新 BSAI 的正式入口，殘留教材也已涵蓋 lecture notes、recitation、書面 HW 與部分 programming notebooks。缺點不是內容太少，而是學期索引已被 Fall 2026 覆寫，必須從現行頁面與官方直連拼回已完成版本。

**15-281 Spring 2026** 可當備用的舊式廣義 AI 路線：公開站保留講義、recitation、P0–P5、書面題與考試練習，教材鏈也是 A3。但不要把它當成 CMU 未來的正式順序；它是過渡班留下的完整歷史版本。若 07-280 的直連日後失效，或你想做傳統 AI projects，才優先回來使用它。

### 2. 機器學習：10-301/601 是仍在運作的穩定入口

如果目標是 ML、深度學習或後續研究課，選 **10-301/601 Spring 2026** 比等待新課更實際。它有完整 slides、readings、recitation、九份 homework starter、practice exams 與解答；即使影片平台與正式提交受限，仍能組成 A3 路線。

這門課與 07-280 是平行入口，不是上下集：

```text
想建立廣義 AI + ML 新主幹：07-280 → 07-380
想集中補統計式 ML：       10-301/601
```

校外讀者可以依目標二選一，不需要為了模仿學位而兩門全修。想往 10-414、進階 ML 或研究型課程走，10-301 的題目分布通常更直接；想理解 CMU 新 BSAI 如何把搜尋、決策與模型合在一起，07-280 才是正確的制度答案。

### 3. 深入一條分支：視覺、深度學習或系統

基礎完成後再挑一條，不要三門一起收藏：

- **16-385 Computer Vision Spring 2026**：它是 BSAI 的 NLP／視覺二選一核心之一。公開 slides、readings、notebooks 與七份作業規格足以深入視覺，但部分實作鏈仍依賴課程帳號，所以保守列 A2。
- **11-785 Introduction to Deep Learning**：Spring 2026 有 29 講公開 YouTube、slides、notes 與 bootcamp／recitation notebooks，足以排成 A3 的講授與實作路線；但 HW1–4 幾乎都移往 Piazza／Autolab。A3 在這裡不代表正式作業鏈也完整，更不包含 GPU。
- **10-414/714 Deep Learning Systems**：從自動微分一路做到 CPU／CUDA、CNN、RNN 與 transformers，公開 implementation notebooks 足以實作一個叫 Needle 的框架。它目前最像一個官方組裝包：Fall 2026 課表、2022 影片與標成 2025 的作業放在同一站，而且 HW0–3 的 GitHub 連結現已回傳 404。仍可用 A3 講義、影片和 notebooks 自學，但不能宣稱當期作業包完整。

**10-708 Probabilistic Graphical Models Spring 2026** 也確實有當期課站，約 25 組 slides 與 readings 能匿名讀；但錄影只供修課者，四份 HW 又只在 Piazza，缺少公開練習閉環，因此列 A2。想完整自學時，2019／2021 歷史站反而更自包含，但不該冒充 2026 教材。

## CSDIY 可以確認什麼，不能確認什麼

CSDIY 目前有 CMU **10-414/714、11-785、10-708** 的獨立頁面；沒有獨立收錄 07-280、15-281、10-301 或 10-315。這正好說明它的定位：它是社群挑選過的自學路線索引，不是 CMU 課務與存取狀態的鏡像。

它很適合回答：哪個歷史版本最常被學習者使用、預估要投入多少時間、有哪些社群解答或補充資源。它不能單獨回答：

- Fall 2026 是否真的已開課，而不是只排進未來課表；
- 15-281／10-315 是否已退出正式學位路徑；
- Panopto、Piazza、Autolab、Gradescope 或 `mugrade` 是否讓校外帳號使用；
- 畫面上有 assignment 連結，是否連 starter、資料、local tests 都能匿名取得。

可靠順序仍是：**先用 CMU program／registrar／當期課站確認開課與課號，再用匿名視窗打開每一類材料，最後用 CSDIY 補歷史版本和社群經驗。**只查 CSDIY 會漏課；只查 YouTube 會漏作業；只看課站標題又會把未來課誤寫成完整公開課。

## 如果今晚就開始

用九十分鐘做一次分流，不要等待 Fall 2026 全部上線：

1. 想跟最新 BSAI 主幹：先讀 07-280 syllabus，再下載一份 Spring 2026 書面 HW 與對應 notes，確認自己能不能接上數學與程式要求。
2. 想走 ML／LLM：打開 10-301/601 Spring 2026 的第一份 homework，標出自己缺的是 Python、線代還是機率，再回補最短的地基。
3. 想做深度學習系統：先跑 10-414 的 implementation notebook；目前作業 repo 是壞鏈，不要把排錯時間誤算成學習進度。

CMU 目前最值得學的，恰好不是一張固定清單，而是這次改制暴露出的兩層：**學位用新課定義未來，自學用已公開的材料完成今天。**把兩層分開，你就能追最新，也不必等最新課程全部釋出才開始。

延伸閱讀：[MIT AI／ML 課程導讀](/posts/learning/2026-08-21-mit-ai-ml-course-map)有一條較穩定的正式學位主幹；[Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)則是沒有獨立 AI 學士、由平行入口自行組路。三校放在一起看，會更清楚「學位結構」和「公開課可用性」是兩套不同問題。

## 參考資料

- [CMU SCS — BS in Artificial Intelligence](https://www.cs.cmu.edu/bs-in-artificial-intelligence/)
- [CMU SCS — BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [CMU SCS — BSAI Program Roadmap](https://www.cs.cmu.edu/bs-in-artificial-intelligence/program-roadmap)
- [07-280 Artificial Intelligence and Machine Learning I](https://www.cs.cmu.edu/~07280/)
- [07-380 Artificial Intelligence and Machine Learning II](https://www.cs.cmu.edu/~07380/)
- [15-281 Artificial Intelligence — Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU MLD — Introductory Machine Learning Classes](https://ml.cmu.edu/academics/ml-intro-classes)
- [10-301/601 Introduction to Machine Learning — Spring 2026](https://www.cs.cmu.edu/~mgormley/courses/10601/)
- [10-301/601 Spring 2026 Schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
- [10-301/601 Spring 2026 Coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
- [10-414/714 Deep Learning Systems](https://dlsyscourse.org/)
- [10-414/714 Lectures](https://dlsyscourse.org/lectures/)
- [10-414/714 Assignments](https://dlsyscourse.org/assignments/)
- [11-785 Introduction to Deep Learning — Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [16-385 Computer Vision — Spring 2026](https://16385.courses.cs.cmu.edu/spring2026/)
- [10-708 Probabilistic Graphical Models — Spring 2026](https://andrejristeski.github.io/10708S26/index.html)
- [CSDIY — CMU 10-414/714](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F/CMU10-414/)
- [CSDIY — CMU 11-785](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CMU11-785/)
- [CSDIY — CMU 10-708](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E8%BF%9B%E9%98%B6/CMU10-708/)
