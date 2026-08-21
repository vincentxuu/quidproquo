---
title: "Berkeley AI／ML 課程導讀：從 CS61A 到 CS288，最新公開教材怎麼排"
date: 2026-08-21
category: learning
tags: [berkeley, ai-course, machine-learning, learning-path, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 4
type: guide
tldr: "Berkeley 沒有獨立的大學部 AI 學位；可行路線是在 CS BA 或 EECS BS 的共同基礎上，從 CS188 的廣義 AI 或 CS189 的數學型 ML 入口，再分流到深度學習、NLP、視覺與強化學習。2025–2026 有不少 A3 公開課，但最新班次、最新穩定網址與最好用的自學版本並不總是同一個。"
description: "以 Berkeley 官方學位要求、課程先修、2025–2026 實際開課與匿名存取測試，整理 CS188、CS189、CS182、CS285、CS288 與電腦視覺的自學路線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)

先處理最容易被「名校 AI 課程」這個標題帶歪的地方：**Berkeley 大學部沒有一個獨立的 AI 學士。**官方列出的相關學位是 Computer Science BA 與 Electrical Engineering and Computer Sciences BS；學生在共同的程式、理論與數學基礎上，用高年級選修組出 AI／ML 路線。

這和 MIT 的 Course 6-4 很不一樣。MIT 有正式的 Artificial Intelligence and Decision Making 學位；Berkeley 比較像一張可自行組合的網。你可以從 CS188 進入搜尋、推理與規劃，也可以從 CS189 進入數學較重的機器學習，之後再接深度學習、自然語言處理、電腦視覺或強化學習。

麻煩在於，課號和公開程度都會誤導人。CS185 與 CS285 是同一主題的大學部／研究所配對，CS180 與 CS280A 也是；但 CS C280 又是另一門研究所視覺課。某個學期曾公開的網址，隔年也可能變成 404。這篇因此同時檢查官方 prerequisites、2025–2026 實際課站，以及匿名讀者現在拿不拿得到講義、作業、程式碼與錄影。

## 先打地基：61A、61B、70 與數學

Berkeley 的 CS BA lower-division requirements 包含 CS61A、CS61B 或 61BL、CS61C、CS70，以及微積分與線性代數。若只看 AI／ML 課程的直接 prerequisites，可以壓成這個結構：

```text
程式設計：CS61A → CS61B
                    ├─ CS188：廣義 AI
離散數學：CS70 ────┘

微積分 + 線性代數 + CS70
                    └─ CS189：機器學習
```

CS61C 是完整 CS 學位的重要基礎，但不是本文多數 AI 課的直接先修，所以不硬塞進每條自學路線。反過來，不能因為 CS189 的 catalog 沒列 CS61B，就假設只會數學、不會實作也能順利完成作業；這是從課程形式得到的實務提醒，不是新增一條官方 prerequisite。

地基三門的公開程度其實很高：

- **CS61A Fall 2025** 有教材章節、投影片、影片、labs、homework、projects 與 starter files。
- **CS61B Fall 2025** 有課表、投影片、影片、討論、考題、作業與專案規格；主要缺口是當期完整公開 autograder。官方 GitHub 說明的最新完整公開 autograder 仍是 Spring 2021。
- **CS70 Fall 2025** 有整學期 notes、slides、討論與解答、作業與解答、歷屆考題。

三門都足以排成 A3 自學課，但 A3 只表示教材鏈完整，不包含 Berkeley 的 Ed 討論區、Gradescope 提交、助教與正式評分。

## CS188 和 CS189 是平行入口，不是上下集

很多自學清單會排成「CS188 → CS189」，看起來像先修完 AI 才能讀 ML。官方 prerequisites 並不支持這種嚴格順序。

**CS188 Introduction to Artificial Intelligence** 要求 CS61A、CS61B 與 CS70。它的範圍很廣：搜尋、對抗搜尋、constraint satisfaction、MDP、強化學習、機率推理，外加一部分機器學習。它回答的是「智慧系統怎麼表示問題、推理與行動」。

**CS189 Introduction to Machine Learning** 的正式地基是多變量微積分、線性代數，以及 CS70 或教師同意。它更集中在統計學習、最佳化、分類、降維與現代模型，回答的是「模型如何從資料學習」。

所以兩門課應該依目的選擇：

| 你想先建立什麼 | 入口 | 最適合的公開版本 |
|---|---|---|
| 搜尋、規劃、推理、不確定性與 agent 的全貌 | CS188 | Spring 2026 |
| 數學型 ML 與後續深度學習基礎 | CS189 | Spring 2025 |

CS188 Spring 2026 是這次盤點中最完整的當期課之一：slides、線上教材、影片、討論解答，以及 P0 到 P5 六個 projects 都能匿名取得，projects 還附 local autograder。Gradescope homework、Ed 與人工回饋仍然受限，但不妨礙把它排成一門完整的 A3 自學課。

CS189 的情況比較能說明「最新」為什麼不能只看年份。Fall 2025 與 Spring 2026 確實都有開課，但輪替課站的舊網址目前已回傳 404。仍穩定公開的 Spring 2025 版本則有完整 lecture notes、影片、HW1–7、code、data 與歷屆考題，因此本文把它列為**最新完整且目前可用的自學版**。搜尋結果曾經看得到，不等於今天仍然看得到。

## 先解開配對課號，才不會修錯課

Berkeley 近年的 AI 專題課常讓大學部與研究所學生共用主題與課站，再用不同課號或要求區分層級。

| 主題 | 大學部／研究所課號 | 2025–2026 狀態 | 不要搞混 |
|---|---|---|---|
| Deep Learning | CS C182／CS282A | Fall 2025 | C182 舊稱 CS182；catalog 的 cross-list metadata 仍有同步差異 |
| Deep Reinforcement Learning | CS185／CS285 | Spring 2026 同堂 | 185 沒有取代 285 |
| Natural Language Processing | EECS183／EECS283A | Fall 2025 同站 | CS288 是更進階的 NLP，不是 CS188 的續集 |
| Intro Computer Vision and Computational Photography | CS180／CS280A | Fall 2025 同站 | CS280A 不等於 CS C280 |
| Computer Vision | CS C280 | Spring 2026 | 獨立的研究所進階課 |

這裡最危險的是數字 280。**CS180/280A** 的公開站是一門 introduction，從成像、filters、feature matching 一路做到 neural radiance fields；**CS C280** 則是另一門研究所 Computer Vision。看到 requirement 頁或舊清單只寫「CS280」時，應回到正式 course entry 與該學期課站確認，不能自行補字母。

CS288 也不該直接排在 CS188 後面。Spring 2026 的課程準備說明要求 ML 經驗與 PyTorch，並建議先有 NLP 背景。比較合理的路線是先走 CS189，再用 EECS183/283A 或其他 NLP 入門補語言模型基礎，最後進 CS288。

## 2025–2026 公開教材盤點

以下沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 分級：A0 只有 catalog，A1 有 syllabus，A2 有部分實質教材，A3 才表示材料足以組成連貫自學課。這不是 Berkeley 官方評分，也不代表有學分、回饋或免費算力。

| 課程與版本 | 等級 | 匿名讀者拿得到什麼 | 主要缺口 |
|---|---:|---|---|
| **CS61A, Fall 2025** | **A3** | 章節、slides、影片、labs、HW、projects、starter files | Ed、提交與評分 |
| **CS61B, Fall 2025** | **A3** | slides、影片、討論、考題、HW 與 project specs | 當期完整 autograder |
| **CS70, Fall 2025** | **A3** | notes、slides、討論／作業解答、歷屆考題 | Ed、Gradescope |
| **CS188, Spring 2026** | **A3** | slides、教材、影片、討論、P0–P5、local autograder | Gradescope HW、Ed、人工回饋 |
| **CS189, Spring 2025** | **A3** | notes、影片、HW1–7、code/data、歷屆考題 | 非最新班次；無課堂評分 |
| **CS C182/282A, Fall 2025** | **A2** | syllabus、schedule、多份 assignment PDF／code | 當期影片限校內；部分 lecture resources 不完整 |
| **CS180/280A, Fall 2025** | **A3** | slides、readings、討論與解答、五個 programming projects | 刻意不錄影；無 project solutions／評分 |
| **EECS183/283A, Fall 2025** | **A2** | 完整主題表與多數 slides | assignments、starter code、解答、影片 |
| **CS185/285, Spring 2026** | **A3** | 25 份 lecture decks、9 份 discussions、五份 HW、starter code、final projects | 當期錄影與學生算力 |
| **CS288, Spring 2026** | **A3** | 17+ 份 slides、三份 assignments、starter repos、final project docs | 當期錄影、隱藏測試、solutions |
| **CS C280, Spring 2026** | **A3** | 24 份 slides、HW0–3、project | 無影片；Ed、Gradescope、CMT |

這張表也回答「沒有公開錄影，還能不能算公開課？」我的判準是：**錄影不是唯一條件，能否形成完整練習鏈才是。**CS180 沒有影片，但有整學期 slides、readings、十三份討論練習與解答，以及五個完整 programming projects；CS C280 也有講義、四份 homework 與 project。兩者仍可判 A3，只是讀法會更接近教科書加作業，而不是追劇式看課。

反過來，CS C182 有 assignment materials，卻缺公開當期影片與一部分完整 lecture resources，所以保守列 A2。A2 不是不能學，而是你需要自己補教材，不能把課站當成一條從第一週走到期末的完整路。

## 三條校外真的走得下去的路線

### 1. 廣義 AI 與 agent 基礎

```text
CS61A → CS61B
       + CS70
          ↓
      CS188 Spring 2026
```

如果你對 AI 的理解目前幾乎等於神經網路，先走這條。不要只看影片：從 Project 1 Search 開始實作，接著做 Multi-Agent Search、Reinforcement Learning 與 Bayes Nets。這條路會把「agent」拉回搜尋、狀態、效用、不確定性與決策，而不只是呼叫模型 API。

### 2. ML、深度學習與 NLP

```text
微積分 + 線性代數 + CS70
            ↓
       CS189 Spring 2025
          ├─ CS C182/282A：深度學習，公開材料較不完整
          └─ EECS183/283A → CS288 Spring 2026：NLP
```

CS189 是這條路的主幹。想讀最新 NLP，Spring 2026 CS288 已公開三份作業、starter repositories 與 final project 文件，足以做完整自學；但作業有隱藏測試，官方也禁止散布 solutions。A3 代表能練，不代表有人替你驗收全部結果。

### 3. 視覺、RL 與 embodied AI

```text
CS189
  ├─ CS180/280A Fall 2025 → CS C280 Spring 2026
  └─ CS185/285 Spring 2026
```

CS180/280A 是很好的 project-first 視覺入口，五個專案比錄影更有價值。要再往進階視覺走，才接 CS C280。若目標是 control、robotics 或 embodied AI，CS185/285 的五份 homework 與公開 starter code 能形成另一條 A3 路線。

但 CS185/285 的 enrolled students 有課程提供的 compute support，校外讀者沒有。這是實際成本，不是教材頁腳的小字。開始前應先閱讀每份 homework 的運算需求，決定要縮小實驗、租 GPU，或只完成較輕的部分。

## CSDIY 能幫忙，但不能替你確認「現在能不能上」

CSDIY 目前有 Berkeley **CS188、CS189、CS285** 的獨立頁面。它很適合補三件事：社群選了哪個歷史版本、建議哪些先修、學習者曾經怎麼安排作業。

但它不能單獨證明當期課站仍然可用：

- CS188 頁推薦 Spring 2024；那一版仍是完整 A3，但官方 Spring 2026 已有更新且同樣完整。
- CS189 頁連到輪替站；頁面存在不代表 Fall 2025／Spring 2026 的舊網址今天沒有失效。
- CS285 頁推薦 Fall 2022；官方另有更新的歷史影片，而 Spring 2026 的 slides、作業與 code 已公開。
- CSDIY 沒有 CS C182、CS288、CS180/280A 或 CS C280 的獨立頁，不代表這些課沒有公開教材。

可靠的順序是：先用 Berkeley catalog 或 Class Schedule 確認那學期真的開課，再匿名打開 syllabus、slides、影片、作業與 repository，最後才用 CSDIY 補自學者的歷史經驗。**CSDIY 是路線索引，不是即時存取監控器。**

## 如果今晚就開始

不要先收藏十一門課。用九十分鐘判斷自己在哪個入口：

1. 想學搜尋、規劃與 agent：打開 CS188 Spring 2026 的 Project 1，讀完規格並讓第一個 local autograder case 通過。
2. 想走 ML／LLM：打開 CS189 Spring 2025 HW1，標出不會的線代、機率與 coding 題，不用硬做完整份。
3. 如果兩邊都卡在 Python 與資料結構：回到 CS61B，選一個 mini-project 做，而不是繼續看更進階的課名。

Berkeley 最值得借用的不是一份官方 AI checklist，而是兩個入口加多條專題分支的結構。先決定你要補的是「智慧系統如何推理」還是「模型如何從資料學習」，再用公開程度挑版本，會比照著課號由小排到大有效得多。

延伸閱讀：[MIT AI／ML 課程導讀](/posts/learning/2026-08-21-mit-ai-ml-course-map)採的是另一種結構——正式 AI 學位先定義能力中心，再去找可公開自學的版本。兩篇對照著看，能更清楚分辨「學位課綱」與「校外可執行路線」不是同一件事。

## 參考資料

- [UC Berkeley EECS — Undergraduate Programs Comparison](https://eecs.berkeley.edu/academics/undergraduate/compare-majors/)
- [UC Berkeley EECS — CS Lower-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/)
- [UC Berkeley EECS — CS Upper-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-upperdiv/)
- [UC Berkeley EECS — EECS Upper-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/eecs-2/degree-reqs-upperdiv-2/)
- [CS61A — Fall 2025](https://www-inst.eecs.berkeley.edu/~cs61a/fa25/)
- [CS61B — Fall 2025](https://fa25.datastructur.es/)
- [CS70 — Fall 2025](https://fa25.eecs70.org/)
- [CS188 — Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS189 — Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [CS C182/282A — Fall 2025](https://berkeley-cs182.github.io/fa25/)
- [CS180/280A — Fall 2025](https://cal-cs180.github.io/fa25/)
- [EECS183/283A — Fall 2025](https://cal-nlp-class.github.io/fa25/)
- [CS185/285 — Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS288 — Spring 2026](https://cal-cs288.github.io/sp26/)
- [CS C280 — Spring 2026](https://cs280-berkeley.github.io/)
- [CSDIY — Berkeley CS188](https://csdiy.wiki/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/CS188/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)
- [CSDIY — Berkeley CS285](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/)
