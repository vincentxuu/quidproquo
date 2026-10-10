---
title: "Harvard AI／ML 課程導讀：CS50 AI、CS181、CS182 的影片與作業是不是同一版？"
date: 2026-08-22
category: learning
tags: [harvard, ai-course, machine-learning, learning-path, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 95
type: guide
tldr: "Harvard 校外最完整的入口是 CS50 AI，但 Summer 2026 實際沿用 2020 錄影與作業資產，OCW 作業又已更新到不同版本；CS181 Spring 2026 公開當期作業與講義、沒有當期錄影，CS182 Fall 2026 則尚未完成開課。"
description: "盤點 Harvard CS50 AI、CS1810、CS1820 與後續 RL／視覺課程的實際開課、先修、影片、作業、程式碼和匿名存取狀態。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)

搜尋 Harvard 的公開 AI 課，最先看到的通常是 **CS50’s Introduction to Artificial Intelligence with Python**。七週影片、逐講 notes、Python projects、`check50`，看起來像一門可以從頭做到尾的最新公開課。問題是頁面上的「2026」、影片的錄製年份與作業使用的 distribution 並不是同一件事。

CSCI S-80 Summer 2026 確實是 Harvard Summer School 的正式 2026 班次，但這不代表底層教材也在 2026 年重錄。Lecture 0 仍指向 2020 Spring 的錄影、投影片與 transcript，正式班的 Degrees project 也下載 2020 Spring distribution。

另一邊，沒有學期標籤的 [CS50 AI OpenCourseWare](https://cs50.harvard.edu/ai/) 已把同一題換成 2023 distribution，並使用 2024 的 `check50` slug。以下公開狀態均以 **2026 年 8 月 22 日**的查核結果為準。

所以這篇不會把畫面年份當教材版本。我會把 **正式開課、講授資產、作業資產與回饋系統**拆開，再回答 Harvard 的校內 AI／ML 主幹如何接起來。

## 課程影片來源

本文是課程總覽或資源地圖，沒有單一對應講次；請從官方課程入口與播放清單查找影片。

課程與錄影入口：

- [CS50 AI OpenCourseWare](https://cs50.harvard.edu/ai/)
- [CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/)
- [Harvard CS advising](https://csadvising.seas.harvard.edu/concentration/courses/)
- [CSCI S-80 Summer 2026](https://cs50.harvard.edu/summer/ai/2026/)
- [Lecture 0](https://cs50.harvard.edu/summer/ai/2026/lectures/0/)
- [Degrees project](https://cs50.harvard.edu/ai/projects/0/degrees/)

## Harvard 的正式地基不是 CS50 AI

Harvard College 把主修稱為 concentration。現行 [CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/) 要求程式設計、formal reasoning、systems、computation and the world，以及線性代數和機率；honors 路線另要求一門帶 AI tag 的課。最常見的起點可以壓成：

```text
CS50／CS32 → CS51／CS61
     + 線性代數 + 機率 + formal reasoning
                       ↓
             CS1810 Machine Learning
             CS1820 Planning and Learning Methods in AI
                       ↓
        CS1840 RL／CS2831 Vision／其他進階專題
```

[Harvard CS advising](https://csadvising.seas.harvard.edu/concentration/courses/)把 CS1810 與 CS1820 都列為每年至少開一次的核心課。兩門不是難度上下集：CS1810 從機率觀點建立 ML，CS1820 則把 search、planning、games、不確定性與 learning 放在廣義 AI 問題裡。CS50 AI 適合先建立「演算法能跑起來」的直覺，卻不取代 CS1810 要求的線代、機率、微積分與非平凡 Python 實作。

## 三個入口其實是三種不同課

| 課程與版本 | 本文分級 | 匿名讀者拿得到什麼 | 主要缺口 |
|---|---:|---|---|
| **CS50 AI OCW，rolling edition** | **A3** | 七週影片、audio、slides、transcript、notes、project specs、distribution、部分 `check50`／提交路線 | 影片與作業跨年份；不是 Harvard College 當期修課 |
| **CSCI S-80, Summer 2026** | **A3*** | 正式七週節奏、2020 錄影、2020 project distribution、公開規格 | `*` 教材可自學，但 Gradescope、section、quiz、office hours 與正式回饋需修課身分 |
| **CS1810, Spring 2026** | **A3** | 當期 syllabus、七份 homework tree、course notes、section materials | 官方明寫 all learning in-person；無當期完整公開錄影，Gradescope／Ed 受限 |
| **CS1820, Fall 2026** | **A0** | catalog、主題範圍、教師與課程預覽站 | 9 月 2 日才開課，尚無 syllabus 或實際教材 |
| **CS182, Fall 2022 archive** | **A2** | 多份 lecture／section notes、exam 等歷史材料 | 非現行版本，沒有完整公開影音與一致的 starter／grader 鏈 |
| **CS1840 RL, Fall 2026** | **A0** | catalog 與主題描述 | 當期課尚未完成，不能預先判 A3 |
| **CS2831 Advanced Computer Vision, Fall 2026** | **A0** | catalog、教師與主題描述 | 當期教材尚未形成可稽核的公開課 |
| **CS 2881R AI Safety, Fall 2025** | **A3**（研討課標準） | 12 講閱讀清單、11 講 YouTube 錄影、可自己跑的 HW0 GitHub repo、期中與期末規格和評分表、學生專題論文與海報 | 沒有傳統習題；投影片只公開約一半講次；L5 沒有講課錄影、L8 只有開場 |

A0–A3 沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的編輯分級：A0 是 catalog、開課資訊或主題描述，A1 要有可取得的 syllabus，A2 有部分實質教材，A3 才表示材料足以排成連貫自學路線。這不是 Harvard 的教學評等，也不代表有學分、教師回饋或免費算力。

## CS50 AI：能完整自學，但不能說是「2026 全新版本」

[CSCI S-80 Summer 2026](https://cs50.harvard.edu/summer/ai/2026/)依序安排 Search、Knowledge、Uncertainty、Optimization、Learning、Neural Networks 與 Language，每週搭配 quiz、section 和 project。以課程骨架來說，影片和作業確實對應同一個七週主題順序。

但檔案版本不同。Summer 2026 的 [Lecture 0](https://cs50.harvard.edu/summer/ai/2026/lectures/0/)直接連到 `cdn.cs50.net/ai/2020/spring/`；正式班的 Degrees project 也下載 `2020/spring` distribution。OCW 的 [Degrees project](https://cs50.harvard.edu/ai/projects/0/degrees/)則下載 `2023/x` distribution，並執行 `check50 ai50/projects/2024/x/degrees`。

正確講法是：**Summer 2026 是新的正式班次，使用經典錄影與指定作業快照；OCW 是持續更新的公開版本。**兩邊概念高度對齊，但不要把 OCW starter 和 Summer 2026 Gradescope 規格混著提交。校外自學直接選 OCW；正式修 CSCI S-80 就只用該班連出的檔案。本站已寫了這門課的[完整導讀](/posts/ai/2026-08-26-harvard-cs50-ai-guide)，版本差異與自學路線在那邊展開。

今晚可以做的檢查很簡單：打開每個 project 的 download URL 和 `check50` 指令，把路徑中的年份記在筆記頂端。只要兩者不同，就把它視為「概念相同、執行版本不同」。

## CS1810：Spring 2026 作業是真的當期，影片不是公開資產

[CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)把課程定位成嚴謹的 ML 基礎：學生要推導演算法的數學，也要在真實資料上寫程式。先修要求包括超過 CS50 的 Python 能力、機率、微積分與線性代數；Homework 0 直接被官方用來檢查準備程度。

這門課的公開度和 CS50 AI 正好相反。[Spring 2026 homework repo](https://github.com/harvard-ml-courses/cs181-s26-homeworks)公開當期 HW0–HW6，課程站也連到 notes 與 sections；但 syllabus 明寫 **all learning will be in-person**。Gradescope 負責繳交與成績，Ed 負責討論，解答回饋也屬於正式課程流程。

因此 CS1810 可以判 A3，但 A3 的理由是「當期講義、section、作業與 textbook 能形成自學閉環」，不是有公開錄影。校外讀者應以 homework 為節拍：先做 HW0，缺線代或機率就回補，再逐份作業讀對應章節。不要找一套舊 YouTube playlist，然後宣稱它就是 Spring 2026。本站的 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)就是照這個節拍寫的：從 HW0 到 HW6 逐份拆解 Spring 2026 作業，另有期中與期末兩篇複習檢查點。

## CS1820：最新班次還沒完成，歷史 notes 只能當替代品

[Harvard SEAS course listing](https://seas.harvard.edu/computer-science/courses)顯示 CS1820 將於 Fall 2026 由 Stephanie Gil 授課，範圍包含 search and planning、optimization and games、uncertainty and learning，另處理 AI ethics 與社會應用。這是最新正式課程，但在本文查核日距離 9 月 2 日開課還有十一天。

目前能看到 catalog 和預覽站，不足以判斷整學期影片、作業、starter 與解答是否公開，所以只能列 **A0**（[Locator 2026 Fall](https://locator.tlt.harvard.edu/course/colgsas-110661/2026/fall/14315) 明載 `This Canvas course site has not been published yet`；[Locator 2025 Spring](https://locator.tlt.harvard.edu/course/colgsas-110661) 僅課號條目，無公開 syllabus/hw repo）。Ariel Procaccia 的 [Fall 2022 archive](https://procaccia.info/courses/CS182-F22/)保留 **22 lectures + pset0–4 + section1–12 + midterm/final** 等 60+ PDF（可補 CS50 AI 沒展開的 classical AI），[Fall 2018 syllabus](https://www.haifeng-xu.com/files/cs182_syllabus_fall18.pdf)（Ariel Procaccia / Goran Radanovic / Haifeng Xu）與 `Harvard-CS182-F18/psets`（P0–P5）亦為同系譜；**它們是歷史 A2，不是 Fall 2026 的替身**。2023/2024 當期同樣無公開 pset repo（僅 `Embedded EthiCS` 快照與 `Berkeley CS182` 同號課程易混淆，勿混用）。

> **系列免責邊界**：本站若寫 CS182 逐週導讀，2026/2025 當期將標 **A0 不可承諾**，僅以 **Fall 2022（或 Fall 2018）歷史版 A2** 為主並標年份；Fall 2026 發布後再發當期對照篇。[CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)以 **2026 hw0–6 七份作業 A3** 為主線（`all learning will be in-person`，無當期錄影，`Google Sheet schedule` 已刪，以 hw 編號為節拍），外加期中、期末兩篇檢查點。

這也代表「只選最新」有時反而不能開始。想今天學，使用標明年份的歷史 notes；想介紹 Harvard 現行設計，等 Fall 2026 實際材料發布後再重判。兩件事不能合成一句「CS182 公開」。

## 校外最穩的三段路線

### 1. 先做得出來：CS50 AI OCW

適合已有一年 Python 經驗、想用 projects 建立 search、logic、probability、optimization、ML、neural networks 與 language 全景的人。只跟 OCW 自己的 download／`check50` 路徑，不跨去 Summer 2026。

### 2. 再把數學補實：CS1810 Spring 2026

先做 HW0。若卡在機率、矩陣微分或 Python，就只補那個缺口；通過後把六份主要 homework 當里程碑。沒有錄影時，notes、section problems 與作業比隨機找影片更能維持版本一致。

### 3. 最後補廣義 AI 或專題分支

想補 planning／games／multiagent systems，現在就從 CS182 Fall 2022 archive 的第一組 problem-solving notes 開始，等 Fall 2026 完課再換料。CS1840 與 CS2831 目前只是未來追蹤項，不是現行自學路線；在 syllabus 與作業公開前，不要預約它們尚不存在的完整教材。

想往 AI 安全走，現在就能用的是 Boaz Barak 在 Fall 2025 首開的研究所研討課 **CS 2881R AI Safety**。它已完整結束，12 講的閱讀清單全公開，YouTube 有 11 講錄影，HW0 是能自己跑的 GitHub repo，期中與期末的規格也放出來，以研討課標準可列 A3。先修是 CS 181 程度，所以排在 CS1810 之後。課站掛在 Boaz 的 GitHub Pages，根目錄現在是 Fall 2026，Fall 2025 搬到 `/fall2025/`；Fall 2026 正在上，只能當預覽。它沒有傳統習題，自學節拍要靠閱讀清單與期中、期末專題規格自己排。本站的 [CS 2881R 導讀系列](/posts/ai/2026-09-30-cs2881r-course-overview)以 Fall 2025 為主線。

Harvard 最清楚的教訓不是哪門課最好，而是**公開頁面很漂亮，仍要查看底層資產年份**。CS50 AI 告訴你影片和作業可能跨版；CS1810 告訴你沒有影片仍可形成 A3；CS1820 則提醒最新課表不等於已存在的公開課。把這三種狀態分開，才有一條今天能走、未來也容易更新的路線。

## 更新紀錄


- 2026-10-10：補上課程影片來源與錄影取得方式。
- 2026-10-01：入口表與「補廣義 AI 或專題分支」路線補上 CS 2881R AI Safety（Fall 2025 完整結束，閱讀清單、11 講錄影、HW0 repo 與專題規格公開，以研討課標準列 A3）與站內導讀連結；參考資料補上 Fall 2025 課站。
- 2026-09-30：CS1810 段落與系列免責邊界加上本站 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)的連結（Spring 2026 HW0–HW6 與期中／期末檢查點），參考資料同步列入。
- 2026-08-27：補上六輪稽核後的免責邊界 — CS182 2026/2025/2024/2023 當期皆 A0（Locator Canvas 未發布、無公開 hw repo，僅 F22 22講+F18 P0–5 為歷史 A2）；CS181 2026/2025/2024/2023 對照表（成績從雙期中到 midterm+final、hw3–5 重組、practical 存廢）與 Google Sheet 已刪註記，逐週導讀以 hw 編號為節拍。
- 2026-08-26：回補站內連結——[CS50 AI 導讀](/posts/ai/2026-08-26-harvard-cs50-ai-guide)上線，版本比較段落加上連結。
- 2026-08-22：統一 A0／A1 邊界，將只有 catalog 的 Fall 2026 課程重評為 A0，並把未來追蹤與現行自學路線分開。

## 參考資料

- [CS50’s Introduction to Artificial Intelligence with Python — OpenCourseWare](https://cs50.harvard.edu/ai/)
- [CSCI S-80 Introduction to Artificial Intelligence with Python — Summer 2026](https://cs50.harvard.edu/summer/ai/2026/)
- [CSCI S-80 Summer 2026 Lectures](https://cs50.harvard.edu/summer/ai/2026/lectures/)
- [CSCI S-80 Summer 2026 Projects](https://cs50.harvard.edu/summer/ai/2026/projects/)
- [CS1810 Spring 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS1810 Spring 2026 homework repository](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [Harvard CS181 逐週導讀總覽](/posts/tech/2026-08-27-harvard-cs181-overview)
- [Harvard CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/)
- [Harvard CS course tags](https://csadvising.seas.harvard.edu/concentration/courses/tags/)
- [Harvard SEAS computer science course listing](https://seas.harvard.edu/computer-science/courses)
- [COMPSCI 1820 Locator 2026 Fall — Canvas 未發布](https://locator.tlt.harvard.edu/course/colgsas-110661/2026/fall/14315)
- [COMPSCI 1820 Locator 2025 Spring](https://locator.tlt.harvard.edu/course/colgsas-110661)
- [CS182 Fall 2022 archive](https://procaccia.info/courses/CS182-F22/)
- [CS182 Fall 2018 syllabus (A. Procaccia / H. Xu)](https://www.haifeng-xu.com/files/cs182_syllabus_fall18.pdf)
- [Harvard-CS182-F18 psets P0–P5](https://github.com/Harvard-CS182-F18/cs182-f18-psets)
- [CS 2881R AI Safety — Fall 2025 archive](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS 2881R 導讀總覽](/posts/ai/2026-09-30-cs2881r-course-overview)
