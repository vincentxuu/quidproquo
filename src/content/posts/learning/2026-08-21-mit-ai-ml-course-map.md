---
title: "MIT AI／ML 課程導讀：6-4 是正式 AI 學位，公開教材卻分散在三個年代"
date: 2026-08-21
category: learning
tags: [mit, ai-course, machine-learning, learning-path, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 3
type: guide
tldr: "MIT 自 2022 年已有正式的 6-4 Artificial Intelligence and Decision Making 學位；但校外自學時，現行學位要求、2025–2026 課站與最好用的 OCW 版本往往不是同一套。真正可行的路線，是先照 6-4 的程式、演算法、線代與機率骨架打底，再依公開程度選 6.S191、6.3900、6.4110、6.7960、電腦視覺或機器人分支。"
description: "以 MIT Course 6-4 正式學位要求、2025–2026 實際開課紀錄與匿名教材測試，整理 AI／ML 先修路線、新舊課號、CSDIY 收錄與 A0–A3 公開程度。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-mit-ai-ml-course-map-en)

先更正一個最容易從舊資料得到的錯誤：[**MIT 有正式的 AI 學位。**](https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-4-artificial-intelligence-and-decision-making/)Course 6-4 的全名是 **Artificial Intelligence and Decision Making**，學生自 2022 年秋季起就能申報。它不是在 Computer Science 學位裡偷偷塞幾門機器學習選修，而是一套獨立的學士學位要求。

但這不代表打開 MIT 網站，就會看到一條從第一堂 Python 到最新大型模型的完整公開課。實際盤點後，MIT 的 AI／ML 資源分成三層，而且經常對不起來：

1. **現行學位要求**告訴你 MIT 認為 AI 學生必須會什麼。
2. **2025–2026 課程網站**告訴你最近真的教了什麼，但教材可能在 Canvas、Piazza、Panopto 或 Gradescope 後面。
3. **OCW、Open Learning Library 與歷史課站**通常最適合自學，卻可能使用舊課號或前一年的內容。

這篇把三層拆開。目標不是假裝校外讀者能「線上讀完 MIT 學位」，而是排出一條真的打得開、知道缺什麼的 AI／ML 路線。本站的 [6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)已經深入單一課程；這篇處理它在整個 MIT 骨架裡的位置。

## 先讀懂兩個編號：6-4 不是 6.4

**Course 6-4** 是學位代號；**6.3900、6.4110** 才是單門課的 subject number。另一個常見混亂來自 MIT EECS 在 Fall 2022 全面換號：小數點後三位的舊課號，多數改成四位新課號。

幾組 AI／ML 搜尋時一定會遇到的對照是：

| 舊課號 | 現行課號 | 關係 |
|---|---|---|
| 6.0001 | 6.100A | Python 入門 |
| 6.042 | 6.1200 | Mathematics for Computer Science |
| 6.006 | 6.1210 | Introduction to Algorithms |
| 6.041 | 6.3700 | Probability |
| 6.036 | 6.3900 | Introduction to Machine Learning |
| 6.034 | 6.4100 | Artificial Intelligence；現行 catalog 標示不固定開課 |
| 6.038 | 6.4110 | Representation, Inference, and Reasoning in AI |
| 6.867 | 6.7900 | 研究所 Machine Learning |

這張表有兩個陷阱。第一，經典 OCW **6.034 不是 6.4110 的舊版**；它改成 6.4100，而 6.4110 承接的是 6.038。第二，**6.7960 Deep Learning 不是 6.867 的改號**；6.867 的新號是 6.7900，兩門課現在同時存在。

所以看到 YouTube 標題、CSDIY 頁面或十年前的讀書清單時，不能只憑主題相似就把課號接起來。

## MIT 的 AI 骨架不是「Python → ML → Deep Learning」

Course 6-4 的 2025 版要求先放六門基礎：程式、軟體、離散數學、演算法、線性代數，以及機率或推論。實際選課有替代組合，壓成學習能力就是：

```text
程式設計：6.100A + 6.100B，或整合版 6.1000
        ↓
軟體與演算法：6.1010 + 6.1200 → 6.1210
        ↓
AI 數學：18.06／18.C06 線性代數 + 6.3700／6.3800／18.05 機率與推論
        ↓
核心分岔：6.3900 機器學習｜6.4110 表徵、推論與規劃
```

這個順序是依官方 prerequisites 合成的可修路線，不是 MIT 發布的學期課表。它重要的地方在於：6.3900 並不是起點。沒有基本程式能力、演算法、線代與機率，直接看深度學習影片，很容易把「能跑 notebook」誤認成理解模型。

6-4 接著要求學生在五個 **Centers** 各選至少一門：

- **Data-centric**：資料如何產生、估計與學習，6.3900 是典型入口。
- **Model-centric**：如何表示世界、推論與處理不確定性，6.4110 是現行主線之一。
- **Decision-centric**：如何在不確定環境中規劃、控制與行動。
- **Computation-centric**：演算法、計算資源與系統限制。
- **Human-centric**：AI 進入社會系統後的因果、回饋與風險，例如 6.3950。

同一門課不能同時填兩個 required-subject slots。這個設計刻意阻止學生把五格全部用「看起來像 ML」的課填滿。除此之外，學位還要求 Application CI-M、進階 AI+D 課、EECS／數學選修，並至少涵蓋一門 SERC。**社會責任不是學完模型後才補的附錄，而是正式結構的一部分。**

如果你更想先打完整的系統與 CS 底座，再把 AI 當其中一條深度路線，Course 6-3 Computer Science and Engineering 也容許這樣走。MIT 的選擇不是「讀 6-4 才算學 AI」。

## 2025–2026 的課，校外到底能讀到哪裡

以下沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的編輯分級：A0 只有課表，A1 有課綱，A2 有部分教材，A3 才代表材料足以排成自學課。這不是 MIT 官方評等，也不代表有學分、助教、評分或免費算力。

| 課程與版本 | 等級 | 匿名讀者實際拿得到什麼 | 缺口 |
|---|---:|---|---|
| **6.S191, Spring 2026** | **A3** | 3 月 30 日至 5 月 25 日的九講影片與投影片、三個 labs、官方 GitHub | 沒有 MIT 回饋、學分與雲端額度 |
| **6.3900, Spring 2026** | **A2** | 部分靜態講義仍可開 | 學期結束後首頁與作業封存；錄影、Shimmer、Piazza 受限 |
| **6.4110, Spring 2026** | **A2** | info、calendar、slides、多份 CAT-SOOP 作業與 code stubs | Panopto 錄影在 Canvas，沒有完整公開解答 |
| **6.7960, Fall 2025** | **A2** | schedule、投影片、閱讀、部分 PyTorch Colab | 錄影與解答在 Canvas，作業透過 Gradescope |
| **6.7960, Fall 2024 OCW** | **A3** | 24 講影片／講義、五份作業、程式檔、final project | 不是 2025 班次，沒有課堂回饋 |
| **6.S058 Computer Vision, Spring 2026** | **A3** | 投影片、公開教科書、四份 problem set、Colab、project requirements | 錄影與課堂 notes 在 Canvas |
| **6.4210, Fall 2025** | **A2** | 教科書式講義、reading 與完整 schedule | 錄影在 Canvas；作業需 Gradescope／Deepnote 權限 |
| **6.5940, Fall 2026** | **A0** | catalog 與開課預告 | 文章查證時尚未開始，不能把預告當已發布教材 |
| **6.5940, Fall 2024 archive** | **A3** | lectures、影片、公開 labs | 無正式解答與課堂回饋 |
| **6.7900, Fall 2025** | **A1** | syllabus、calendar、主題與閱讀 | notes、作業與 project 在 Piazza |
| **6.7920, Fall 2025** | **A1** | schedule、閱讀與零星投影片 | 主要 slides、作業與解答在 Canvas |
| **6.8610, Spring 2026** | **A1** | 新課綱與 schedule | slides、Panopto 錄影、作業與 code 在 Canvas |

這張表最值得注意的不是哪門課分數最高，而是**同一門課的公開程度會隨時間倒退**。6.3900 Fall 2026 的預告頁說多數材料將公開，但已結束的 Spring 2026 首頁與作業現在只讓 staff 存取。網址過去能看、現在不能看，可能不是搜尋結果錯了，而是課站封存政策改了。

另一種情況是最新班次只公開一半，前一版反而完整。6.7960 Fall 2025 把錄影與解答放在 Canvas；MIT OCW 的 Fall 2024 版卻有完整影片、講義、五份作業與 final project。若目標是自學，**選 2024 OCW 比硬追 2025 課站更誠實**。最新年份應優先查，但不該凌駕於材料完整度。

## 三條真的走得下去的路線

### 1. 現代 AI 工程入門

先補 Python、線代與機率，再用 6.3900 的公開 notes 建立監督學習與建模語言。接著選：

```text
6.3900 公開 notes
  ├─ 6.S191 Spring 2026：九週現代深度學習入口
  └─ 6.7960 Fall 2024 OCW：一學期進階深度學習
```

[6.S191 Spring 2026](https://introtodeeplearning.com/)適合快速看見卷積網路、Transformer、生成模型與 AI for science 如何串起來；它從 3 月 30 日到 5 月 25 日每週上課，不是 IAP 一週 bootcamp，也不是 6.7960 的前身或等價替代。要練理論、讀二十四講並完成較長作業，走 6.7960 OCW。

### 2. AI 不只神經網路

走 6.4110，學 constraint satisfaction、logic、graphical models、MDP／POMDP 與 planning。它的公開作業比錄影完整，適合「先看 slides，再做 CAT-SOOP 題目」的讀法。

經典 6.034 Fall 2010 OCW 仍有影片、作業與考試，可以補搜尋、符號 AI 與傳統方法的歷史脈絡；但它不能代表 2025–2026 的前沿內容，也不能冒充現行 6.4110。

### 3. 視覺、機器人與效率系統

Spring 2026 的 Computer Vision 實際以 special subject **6.S058** 開課，公開投影片、書、problem sets、Colab 與專題要求，是當期少數接近 A3 的完整分支。正式課表裡的 6.4300 是相關的 regular subject 編號，但不要把兩個標籤在未說明下混用。

想往 embodied AI 走，可在 6.3900、線代與機率後接 6.4110，再讀 6.4210 Robotic Manipulation 的公開教材。只是它的 Gradescope／Deepnote 作業與 Canvas 錄影不開放，校外版應把重點放在 lecture notes、Drake 範例與自行設計的小專案。

效率系統則看 6.5940。它在 2025–2026 學年沒有開，Fall 2026 才恢復；截至查證日，新班次仍只是即將開始。要現在動手，應直接使用 Fall 2024 的 pruning、quantization、NAS、distributed training 與 TinyML 公開 labs。

## CSDIY 可以確認什麼，不能確認什麼

CSDIY 很適合回答「自學社群曾把哪個版本整理成可走的路線」，但不適合單獨回答「MIT 今年有沒有開」或「現在匿名點進去是否仍可用」。

目前 CSDIY 在上述清單中有獨立頁面的只有：

- **MIT 6.7960**：連到 MIT OCW Fall 2024，估計約 90 小時，放在有 ML 基礎後的進階 DL。
- **MIT 6.5940**：整理 2023／2024 課站與 labs，放在機器學習系統進階位置。

它沒有收錄 6.S191、6.3900、6.4100 或 6.7900，不代表這些課不存在或不能學。反過來，6.5940 有 CSDIY 頁面，也不代表它在 2025–2026 有開課。可靠的確認順序應該是：

1. 用 MIT Registrar archive 或當期課站確認該學期是否實際開課。
2. 匿名打開 syllabus、講義、影片、作業與程式碼，不只看首頁。
3. 再用 CSDIY 判斷社群怎麼安排歷史版本、預估工時與先修。

## 如果今天只做一件事

先不要收藏十門課。花半小時做這三步：

1. 打開 Course 6-4 degree requirements，把六門 foundation 與五個 Centers 抄成自己的 checklist。
2. 在 6.S191、6.4110、6.S058 三條 A3／A2 路線裡選一條，打開第一份 lab 或 homework，而不是只看第一支影片。
3. 寫下缺的先修：Python、演算法、線代或機率。缺哪一個，就先回去補哪一個。

MIT 真正值得借來的不是一串名課，而是它對 AI 能力的切法：資料、模型、決策、計算與人，缺一塊都不完整。公開教材能讓你借到其中很大一部分；學分、回饋、同儕、受管制平台與研究環境，仍然借不到。

## 更新紀錄

- 2026-08-22：修正 6.S191 2026 為 Spring 九週課程，不再誤標成 IAP 一週 bootcamp。

## 參考資料

- [MIT EECS — Course 6-4: Artificial Intelligence and Decision Making](https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-4-artificial-intelligence-and-decision-making/)
- [MIT EECS — 6-4_2025 Degree Requirements](https://eecsis.mit.edu/degree_requirements.pcgi?program=6-4)
- [MIT Catalog — Course 6-4 Degree Chart](https://catalog.mit.edu/degree-charts/artifical-intelligence-decision-making-course-6-4/)
- [MIT EECS — New Subject Numbering](https://www.eecs.mit.edu/academics/subject-numbering/)
- [MIT EECS — Old and New Subject Number Crosswalk](https://eecsis.mit.edu/numbering.html)
- [MIT 6.S191 — Introduction to Deep Learning 2026](https://introtodeeplearning.com/)
- [MIT 6.3900 — Introduction to Machine Learning, Spring 2026](https://introml.mit.edu/spring26/)
- [MIT 6.4110 — Representation, Inference, and Reasoning in AI, Spring 2026](https://airr.mit.edu/spring26)
- [MIT 6.7960 — Deep Learning, Fall 2025](https://deeplearning6-7960.github.io/)
- [MIT OpenCourseWare — 6.7960 Deep Learning, Fall 2024](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- [MIT 6.S058 — Introduction to Computer Vision, Spring 2026](https://introtocv.github.io/)
- [MIT 6.4210 — Robotic Manipulation, Fall 2025](https://manipulation.mit.edu/Fall2025/index.html)
- [MIT Han Lab — 6.5940 TinyML and Efficient Deep Learning Computing, Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.7900 — Machine Learning, Fall 2025](https://gradml.mit.edu/)
- [MIT 6.7920 — Reinforcement Learning: Foundations and Methods, Fall 2025](https://web.mit.edu/6.7920/www/)
- [MIT 6.8610 — Quantitative Methods for Natural Language Processing, Spring 2026](https://mit-6861.github.io/)
- [CSDIY — MIT 6.7960](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/MIT6-7960/)
- [CSDIY — MIT 6.5940](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F/EML/)
