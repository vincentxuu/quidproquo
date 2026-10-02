---
title: "台大 AI／ML 課程導讀：李宏毅、林軒田、陳縕儂的課，校外到底拿得到哪些？"
date: 2026-09-30
category: learning
tags: [ntu, ai-course, machine-learning, learning-path, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 97
type: guide
tldr: "台大的 AI／ML 課散在電機系與資工系，官方用「機器學習與人工智慧」領域專長把它們排成四層。校外最完整的是李宏毅：ML 2026 Spring 與生成式 AI 與機器學習導論 2025 Fall 都公開投影片、錄影、作業 PDF 與 Colab，只差評分平台。林軒田的錄影齊全，Fall 2024 的 HW0–HW7 題目也留在課程頁；陳縕儂的課錄影齊全，作業大多只公開說明影片；Coursera 自 2025 年 8 月起改為只能免費看第一單元。"
description: "盤點台灣大學李宏毅 ML 2026、生成式 AI 課、林軒田機器學習基石／技法、陳縕儂 ADL 與人工智慧導論、電腦視覺與深度強化學習的最新公開學期、公開資產與校內限定部分，並依 A0–A3 分級。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)

前五篇學校地圖都在處理英文課。台大不一樣：它是中文讀者最常自學的一間。李宏毅每年把整學期的課放上 YouTube，林軒田的機器學習基石錄影也在網路上流傳了十年。問題是「看得到影片」和「能完整修一次」差很多。影片之外，作業題目、起始碼、評分平台和旁聽身分，各自有不同的開放程度。

這篇沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 分級。A0 只有課表，A1 有課綱，A2 有部分實質教材，A3 則是教材加作業足以排成連貫自學路線。這是本站的編輯分級，不是台大的評鑑，也不代表有學分或助教批改。以下公開狀態以 **2026 年 9 月 30 日**的查核為準。

## 台大怎麼組織 AI／ML 課：看領域專長，不是看系名

台大沒有一個叫「AI 系」的大學部。AI／ML 課主要開在電機系與資工系，研究所端則由資工所、資訊網路與多媒體研究所（網媒所）、電信所、資料科學學位學程等共同選課。資工系另設有[人工智慧碩士班](https://www.csie.ntu.edu.tw/zh_tw/Admission/Announcement13/%E4%BA%BA%E5%B7%A5%E6%99%BA%E6%85%A7%E7%A2%A9%E5%A3%AB%E7%8F%AD-%E4%B8%80%E8%88%AC%E7%94%9F-%E8%80%83%E8%A9%A6%E5%85%A5%E5%AD%B8%E8%A6%8F%E5%AE%9A-50477470)。從[臺大課程網](https://course.ntu.edu.tw/)查一門課，常會看到同一門課掛在好幾個系所底下。例如林軒田 113-1 的[機器學習](https://course.ntu.edu.tw/courses/113-1/26214)同時列給資工系、資料科學學程、網媒所、智慧醫療學程與 AI 學程聯盟，備註寫著「人工智慧碩士班必修」。

想看課程之間的先後關係，最好用的官方文件是資工系主責的[「機器學習與人工智慧」領域專長](https://specom.aca.ntu.edu.tw/Domain/program?program=902002&lang=zh)。它把課排成四層：

```text
先修：機率、線性代數、程式設計
  ↓
Level 1：資料結構與演算法
  ↓
Level 2：人工智慧導論 或 機器學習基石
  ↓
Level 3–4：機器學習技法、機器學習
           深度學習之應用、高等人工智慧、機器學習專論
```

這張圖漏了一條校外讀者最常走的路：電機系李宏毅的課。李宏毅的[機器學習 114-2](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696)課號 EE5184，4 學分，與吳沛遠合授。課綱明講這門課不從頭教 ML 基礎，要學生先看完《生成式人工智慧與機器學習導論》的錄影。也就是說，李宏毅自己的兩門課已經是一組上下集，和資工系那條「基石 → 技法」是平行的兩條路。

## 一張表看完：九門課的公開程度

| 課程與學期 | 分級 | 校外拿得到什麼 | 校內限定或缺口 |
|---|---:|---|---|
| **李宏毅 ML 2026 Spring** | **A3** | 投影片 pdf／pptx、錄影、HW1–10 題目 PDF、Colab 起始碼、作業說明影片 | JudgeBoi 與 NTU COOL 評分；三場演講沒有公開材料 |
| **李宏毅 生成式 AI 與機器學習導論 2025 Fall** | **A3** | 10 講投影片與錄影、HW1–10 投影片、Colab、說明影片 | 評分走 JudgeBoi／NTU COOL，旁聽生作業不批改 |
| **李宏毅 生成式 AI 導論 2024 Spring**（歷史版） | **A3** | 投影片、錄影、HW1–10 說明投影片與 Colab | 部分作業需要課程發放的平台帳號 |
| **林軒田 機器學習基石／技法 MOOC** | **A2** | 兩份 65 支影片的 YouTube 播放清單、全套 handout 投影片 | Coursera 免費預覽只開第一個模組（含該模組評量），其餘作業需付費或申請助學金 |
| **林軒田 機器學習 Fall 2026**（進行中） | **A2** | 課程投影片、課前指定影片、hw0–hw1、公開同步直播 | 後續作業隨進度公開；Gradescope 與 NTU COOL 限修課生 |
| **林軒田 機器學習 Fall 2024** | **A3**（配 MOOC） | HW0–HW7 題目 PDF、期末專題說明 | 沒有官方解答；評分平台與 Kaggle 競賽頁限修課生 |
| **陳縕儂 深度學習之應用（ADL）Fall 2025** | **A2** | 逐講投影片與錄影、HW1 規格投影片、各作業說明影片 | 作業繳交走 NTU COOL；HW2／HW3 規格未全部公開 |
| **陳尚澤、陳縕儂 人工智慧導論 Spring 2026**（兩班） | **A2** | 33 支錄影的播放清單、兩班各自的課程大綱 | 沒有公開課程網站；程式作業與期末專題規格未公開 |
| **傅楸善 電腦視覺（一）Fall 2026** | **A3** | 11 章講義、HW1–10 題目頁、測試影像、DCCV Lab 頻道的課堂錄影 | 內容是傳統電腦視覺，不含深度學習 |
| **李濬屹 深度強化學習 113-2** | **A1** | 臺大課程網上的完整課綱 | 未找到公開投影片、錄影或作業 |

## 李宏毅：兩門課一組，評分平台之外幾乎全開

### ML 2026 Spring：最新一版，重心在「調整模型行為」

[ML 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)從 3 月 6 日開到 6 月，每一講正課都附 YouTube 錄影與 pptx／pdf。前半學期講 AI Agent（以 OpenClaw 為例）、Context Engineering 與推論加速（Flash Attention、KV Cache）。後半學期講 Positional Embedding、Harness Engineering、Self-Correction 與 Self-Improving。

作業區列出 HW1 到 HW10。前五份練的是防禦惡意指令、用 AI Agent 寫作業、加速推論、訓練 Transformer 與微調而不遺忘。後五份是 Model Editing、Model Merging、Test-Time Scaling、Flow Matching 與語音語言模型。每份都有題目 PDF 和 Colab 連結，部分另有 Kaggle 版。

缺口在評分。作業表的「Platform」欄寫的是 JudgeBoi（`ml.ee.ntu.edu.tw`）或 NTUCOOL。[JudgeBoi 使用說明](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)要求把台大信箱綁到 GitHub 帳號才能登入，本文查核當天這個網址也只回傳 502。校外讀者做得完每份作業，但拿不到排行榜分數和測驗解答。另外，課表上 5/15、5/29、6/05 的三場演講只有標題，沒有投影片也沒有錄影。

本站的[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列逐講、逐份作業拆解這個學期，共 21 篇。

### 生成式 AI 與機器學習導論 2025 Fall：先修課，也是最友善的入口

[GenAI-ML 2025 Fall 課程頁](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)的最新公告寫得很直接：學期已結束，不再加旁聽生進 NTU COOL。想旁聽的人「可以在本課程網站上取得所有教學內容和學習素材，包含上課影片與完整作業」。十講從 LLM 原理、Context Engineering、評估、機器學習基本概念一路講下去。十份作業從 RAG、惡意指令防禦、回歸、影像分類、LLM 微調、擴散模型到語音生成，都有投影片、Colab 與說明影片。

課程 FAQ 說它的目標受眾是初學者，不需要額外先備知識。作業設計成用 Colab 免費 GPU 就能拿到及格以上的分數。ML 2026 的課綱要求先看完它的[錄影播放清單](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT)，所以校外讀者照「2025 Fall → 2026 Spring」的順序走，就是李宏毅自己設計的路線。

### 舊版本還能用嗎

李宏毅的課程選單列出 [ML 2025 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2025-spring.php) 以及更早的機器學習，另有 [生成式 AI 導論 2024 Spring](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)。2024 年沒有機器學習版，`ml/2024-spring.php` 這個網址不存在。2025 年以前的各版如下，錄影數以課程頁上的 YouTube 連結計，包含作業說明影片：

| 版本 | 課程頁 YouTube 連結 | 作業 | 公開的作業資產 | 評分平台 | 分級 |
|---|---:|---|---|---|---:|
| [2023 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php) | 97 | HW1–15 | 每份有投影片與 Colab 程式碼 | 9 份 Kaggle，其餘 JudgeBoi、Gradescope、NTU COOL | A3 |
| [2022 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2022-spring.php) | 154 | HW1–15 | 每份有投影片與 Colab 程式碼 | 9 份 Kaggle，HW5、6、10、12 走 JudgeBoi | A3 |
| [2021 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2021-spring.php) | 111（中英雙語） | HW1–15 | 每份有投影片與 Colab 程式碼 | 8 份 Kaggle，其餘 JudgeBoi 與 NTU COOL | A3 |
| [2020 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2020-spring.php) | 80 | HW1–15 | 每份有 Colab 範例與說明投影片 | 課程頁沒有列評分平台 | A3 |
| [2019 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2019-spring.php) | 49 | HW1–8 | 6 份連到助教的 GitHub Pages 作業頁，HW5 與 HW8 沒有連結 | 課程頁沒有列評分平台 | A2 |
| 2017 Fall、2017 Spring、2016 Fall | 2–35 | 課程頁沒有作業 | 只有投影片與錄影 | 無 | A2 |

2021 到 2023 三版的 Kaggle 競賽頁今天仍打得開，可以看到資料與排行榜。JudgeBoi（`ml.ee.ntu.edu.tw`）今天回傳 502，Gradescope 與 NTU COOL 則要台大帳號。所以校外讀者拿得到題目和起始碼，約一半的作業還有 Kaggle 排行榜可以參照。

這些都是歷史版，內容每年大改，2026 年的課綱也明說過去講過的內容本學期不再講。想補經典 ML／DL（CNN、RNN、自注意力、GAN、強化學習）的讀者，2021 或 2022 版最完整。記得在筆記上寫明年份，不要把 2021 的作業和 2026 的評分規則混在一起。

今晚可以做的事：打開 GenAI-ML 2025 Fall 課程頁，看第 0 講與第 1 講，接著在 Colab 開 HW1 跑一遍。跑得動，就照十份作業的順序走完這門課。

## 林軒田：MOOC 練習題在收費牆後，Fall 2024 作業補上了缺口

林軒田的 [MOOC 頁面](https://www.csie.ntu.edu.tw/~htlin/mooc/)把兩門課的資源集中在一起：機器學習基石（Mathematical 與 Algorithmic Foundations 兩段）和機器學習技法。每門都有全套 handout 投影片壓縮檔與免費 YouTube 播放清單，教材以他合著的 [Learning from Data](http://amlbook.com) 為本。[基石](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)與[技法](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)兩份播放清單各 65 支影片，第一支分別上傳於 2015 年 12 月與 2016 年 2 月。這是十年前錄的課，理論部分（VC 維度、正則化、SVM、boosting）不會過時，但沒有 Transformer 與 LLM。

練習題是缺口。[基石上](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)、[基石下](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)與[技法](https://www.coursera.org/learn/machine-learning-techniques)三門 Coursera 課程頁都還掛著「Enroll for free」，但頁面 FAQ 寫明要取得課程教材與作業，得購買證書方案。Coursera 在 [2025 年 8 月的官方公告](https://blog.coursera.org/introducing-courseras-new-course-preview-experience/)裡用「預覽」取代了舊的旁聽。依[說明中心的 Enrollment options](https://www.coursera.support/s/article/learner-000001306)，預覽只開放第一個模組，包含該模組的計分評量，後面的模組全部鎖住。少數課程另有「Full Course, No Certificate」選項，可以做完所有評量但不給證書。這三門課有沒有這個選項，只有登入後在報名視窗裡才看得到，公開頁面無法確認。不付費的話，還可以申請 Coursera 的助學金（financial aid）。只走免費路線，這組課是 A2：影片、投影片與教科書完整，計分作業只拿得到第一個模組。

林軒田現行的校內課是[機器學習 Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)，採翻轉教室，課前指定看 MOOC 影片與課程投影片。課堂透過 TAICA（臺灣大專院校人工智慧學程聯盟）對外同步直播。課程頁目前放到 hw1，後續作業隨進度公開，學期中先列 A2。上一輪完課的 [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 則把 hw0 到 hw7 的題目 PDF 與期末專題說明都留在課程頁上，配合 MOOC 影片就能排成 A3 的自學路線，只缺官方解答與評分。本站的[林軒田機器學習基石與技法導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)就用這個組合：內容跟 MOOC，練習跟 Fall 2024 作業。

## 陳縕儂：頻道上的播放清單比課程網站完整

陳縕儂的 YouTube 頻道 [陳縕儂 Vivian NTU MiuLab](https://www.youtube.com/@VivianMiuLab/playlists)是資工系機器智慧與理解實驗室（MiuLab）的頻道，簡介寫著「陳縕儂授課內容錄影」。播放清單依學期整理，和台大 AI／ML 有關的有：

| 播放清單 | 影片數 |
|---|---:|
| 2026 Fall 深度學習之應用（ADL，進行中） | 24 |
| 2026 Spring 人工智慧導論（FAI） | 33 |
| 2025 Fall 深度學習之應用 | 77 |
| 2025 Spring 人工智慧導論 | 39 |
| 2024 Fall 深度學習之應用 | 91 |
| 高等深度學習（AvDL，未標學期） | 16 |

更早還有 2017 到 2023 年的 ADL、2023 與 2024 年的人工智慧導論，以及 2017 Fall 電機系 MLDS 的清單。

**ADL**（深度學習之應用）的課程網站固定在 [adl.miulab.tw](http://adl.miulab.tw/)，目前轉到 [Fall 2026 版](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)。最近一個完整學期是 [Fall 2025](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)，範圍從神經網路基礎、Transformer、BERT 一路到 RAG、LoRA 與 Language Agents。每個單元都有 PDF 投影片和分段錄影。作業方面，HW1（中文抽取式問答）的規格投影片公開，排行榜放在 Kaggle，程式碼與報告則交到 NTU COOL。HW2、HW3 在課表上只有說明影片。課程頁下方的作業區仍停在 2022 年的連結，不要照那裡的截止日。因此 ADL Fall 2025 列 A2：講課端很完整，作業端只有一份規格可以確定是當期版本。

**人工智慧導論**（FAI，CSIE3005）Spring 2026 在課程網上其實是兩個班：[01 班陳尚澤](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=01&dpt_code=9020&ser_no=55080&semester=114-2&lang=CH)收單號學生，[02 班陳縕儂](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=02&dpt_code=9020&ser_no=11206&semester=114-2&lang=CH)收雙號學生。兩班同在週三上午上課，進度表不完全相同。陳尚澤班從搜尋、CSP、賽局一路講到 MDP、強化學習與貝氏網路。陳縕儂班則加了命題邏輯與規劃，強化學習排在後半。兩班都以 AIMA 第 4 版為主要教材，陳縕儂班的評量是 Python 程式作業、期中考、以競賽方式進行的期末專題與課堂參與。[2026 Spring 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7lTGzNejZoLHRBF4X2mJfI)有 33 支影片，第一支的說明欄寫的是「Lectured by Shang-Tse Chen & Yun-Nung Vivian Chen」。清單裡另有一支期末專題「Game Agent 誰是牛頭王」的說明影片。

這門課沒有公開課程網站。我找過 MiuLab 網站（`~miulab/s115-fai/` 等學期路徑都是 404）、陳縕儂個人頁的 Teaching 頁（只列到 2020 年）、兩班的課程大綱（課程網頁欄位空白）、TAICA 114 學年下學期的課程清單（沒有這門課），以及 GitHub 上 MiuLab 組織的公開 repo。GitHub 上只找得到修課學生自己上傳的作業，沒有官方版本。因此 FAI 只能依錄影與課綱判 A2。

## 其他公開程度較高的課

**電腦視覺（一）**：傅楸善的[課程網站](https://cv2.csie.ntu.edu.tw/CV/)公開依 Haralick 與 Shapiro 教科書編排的 11 章講義，多數章節有逐年更新的 pptx。HW1–10 的題目頁也公開，內容是二值化、形態學、Yokoi 連通數、細線化、雜訊去除與邊緣偵測，另附作業用的測試影像。作業規定不能用現成函式庫，只能自己寫演算法。錄影放在傅楸善實驗室的 YouTube 頻道 [DCCV Lab](https://www.youtube.com/@DCCVLab/playlists)，課程網站頁尾署名 DCCV Lab，「Videos」連結也指向這個頻道。頻道共 43 支影片、5 份播放清單，從 114-1（2025 秋）開始上傳：114-1 電腦視覺 14 支、114-1 計算機概論 10 支、114-2 高等電腦視覺 14 支，115-1 的電腦視覺與計算機概論目前各 3 支。這是 A3，但它教的是傳統電腦視覺，想學 CNN 或 ViT 的人要另外找課。

**人工智慧：機器學習與理論基礎**：電機系于天立在[臺大開放式課程](https://ocw.aca.ntu.edu.tw/courses/mooc0016)上的 MOOC，授課日期 2018 年 6 月，OCW 上有 5 講影片。範圍涵蓋 VC 理論、決策樹、SVM、神經網路與深度強化學習。完整作業在 Coursera，同樣受到 2025 年 8 月的預覽制影響，列 A2。

**深度強化學習**：李濬屹 113-2 的[課綱](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=922+U4960&dpt_code=9220&semester=113-2&ser_no=10169)很完整，寫了先修、GPU 需求和從 MDP 到 policy optimization 的範圍。不過本次沒找到公開投影片或錄影，只能判 A1。

## 校外最穩的三條路線

### 1. 從零開始，想跟上現在的 AI：李宏毅兩門連修

先走 GenAI-ML 2025 Fall 的十講十作業，再接 ML 2026 Spring。全程中文，只需要 Colab。接受兩件事就好：沒有人幫你改作業，排行榜也看不到。

### 2. 想把 ML 理論打穩：林軒田基石 → 技法

看 YouTube 影片配 handout 投影片，練習題改用 Fall 2024 課程頁的 HW0–HW7，或 Learning from Data 的章末習題；[本站系列](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)已把每份作業對到講次。想要自動批改，再付費或申請 Coursera 助學金。之後再接李宏毅或 ADL 補深度學習。

### 3. 想做 NLP 與 LLM 應用：陳縕儂 ADL

跟 Fall 2025 的投影片與錄影，HW1 照公開規格做，其餘作業用說明影片推回題目；[本站的 ADL 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)逐講整理了這條路線。這條路比李宏毅的課更偏工程實作。Fall 2026 正在進行，學期末可以回來看作業是否公開更多。

台大和前五間學校最大的差別，是公開教材的中心在老師個人，不在學校。領域專長告訴你課程怎麼接，真正能自學的材料卻散在三位老師的個人網頁與 YouTube 頻道上，每位的開放方式也不一樣。李宏毅開放作業但不開放評分；林軒田開放影片，練習題要回到 Fall 2024 課程頁找；陳縕儂開放完整錄影，作業只公開一部分。先確認你缺的是影片、題目還是回饋，再挑那位老師的課。

## 參考資料

- [世界名校 AI／CS 課程地圖（本系列總覽與 A0–A3 定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
- [Harvard AI／ML 課程導讀](/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
- [2026 AI 課程總覽（含李宏毅段落）](/posts/ai/2026-07-10-ai-courses-2026-guide)
- [臺大課程網](https://course.ntu.edu.tw/)
- [臺大領域專長：機器學習與人工智慧](https://specom.aca.ntu.edu.tw/Domain/program?program=902002&lang=zh)
- [臺大課程網：機器學習 113-1（林軒田）](https://course.ntu.edu.tw/courses/113-1/26214)
- [臺大資工系人工智慧碩士班考試入學規定](https://www.csie.ntu.edu.tw/zh_tw/Admission/Announcement13/%E4%BA%BA%E5%B7%A5%E6%99%BA%E6%85%A7%E7%A2%A9%E5%A3%AB%E7%8F%AD-%E4%B8%80%E8%88%AC%E7%94%9F-%E8%80%83%E8%A9%A6%E5%85%A5%E5%AD%B8%E8%A6%8F%E5%AE%9A-50477470)
- [李宏毅 Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [機器學習 114-2 課程大綱（EE5184）](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696)
- [JudgeBoi Guide（ML 2025）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [生成式人工智慧與機器學習導論 2025 Fall 課程頁](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
- [生成式人工智慧與機器學習導論 YouTube 播放清單](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT)
- [李宏毅 Machine Learning 2025 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2025-spring.php)
- [生成式 AI 導論 2024 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)
- [李宏毅 Machine Learning 2023 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php)
- [李宏毅 Machine Learning 2022 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2022-spring.php)
- [李宏毅 Machine Learning 2021 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2021-spring.php)
- [李宏毅 Machine Learning 2020 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2020-spring.php)
- [李宏毅 Machine Learning 2019 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2019-spring.php)
- [林軒田 MOOCs 頁面](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [Machine Learning Foundations YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning Techniques YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Coursera：機器學習基石上](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)
- [Coursera：機器學習基石下](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)
- [Coursera：機器學習技法](https://www.coursera.org/learn/machine-learning-techniques)
- [Coursera Blog：Introducing Coursera's new course preview experience（2025-08-08）](https://blog.coursera.org/introducing-courseras-new-course-preview-experience/)
- [Coursera Learner Help Center：Enrollment options](https://www.coursera.support/s/article/learner-000001306)
- [林軒田 Machine Learning, Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [林軒田 Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [陳縕儂 Vivian NTU MiuLab YouTube 播放清單](https://www.youtube.com/@VivianMiuLab/playlists)
- [人工智慧導論 2026 Spring YouTube 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7lTGzNejZoLHRBF4X2mJfI)
- [人工智慧導論 114-2 課程大綱（01 班，陳尚澤）](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=01&dpt_code=9020&ser_no=55080&semester=114-2&lang=CH)
- [人工智慧導論 114-2 課程大綱（02 班，陳縕儂）](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=02&dpt_code=9020&ser_no=11206&semester=114-2&lang=CH)
- [陳縕儂個人頁 Teaching](https://www.csie.ntu.edu.tw/~yvchen/teaching.html)
- [TAICA 114 學年度下學期開設課程清單](https://taicatw.net/spring-114/)
- [ADL Fall 2026 課程網站](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)
- [ADL Fall 2025 課程網站](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [電腦視覺（一）課程網站](https://cv2.csie.ntu.edu.tw/CV/)
- [DCCV Lab YouTube 播放清單](https://www.youtube.com/@DCCVLab/playlists)
- [臺大開放式課程：人工智慧：機器學習與理論基礎](https://ocw.aca.ntu.edu.tw/courses/mooc0016)
- [深度強化學習 113-2 課程大綱](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=922+U4960&dpt_code=9220&semester=113-2&ser_no=10169)
