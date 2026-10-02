---
title: "台灣其他學校 AI 公開課地圖：從 TAICA 課程清單找出清大、政大、成大、北科的公開課"
date: 2026-09-30
category: learning
tags: [taiwan, ai-course, learning-path, open-course, nthu, nccu]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 98
type: guide
tldr: "台大以外的台灣 AI 公開課，大多出自教育部成立的 TAICA 聯盟。每學期的課程清單會寫明每門主導課從哪裡直播，填 YouTube 的課，錄影通常校外也看得到。校外能完整自學的有兩門：清大高宏宇《自然語言處理》Fall 2025 與政大蔡炎龍《生成式 AI》Spring 2025，都是 A3。成大朱威達《人工智慧導論》、北科韓秉軒《智慧人機互動》、清大胡敏君《機器導航與探索》錄影齊全，作業留在 NTU COOL，列 A2。陽明交大的 TAICA 課都是英文授課，深度學習的錄影沒有公開列出，Physical AI 剛開學，都沒有進主表。"
description: "以 TAICA 臺灣大專院校人工智慧學程聯盟 113 上到 115 上的課程清單為索引，盤點清大高宏宇 NLP、政大蔡炎龍生成式 AI（含長庚楊智淵衛星班頁面）、成大朱威達人工智慧導論、北科韓秉軒智慧人機互動、清大胡敏君機器導航與探索、陽明交大深度學習與 Physical AI 等課的最新公開學期、公開資產與校內限定部分，並依 A0–A3 分級。"
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟", "Taiwan AI College Alliance"]
    definition: "教育部成立的臺灣大專院校人工智慧學程聯盟。由 AI 師資充足的大學開「主導課程」，其他聯盟學校的學生以同步遠距方式跨校修課，學分由各校採認。"
    context: "本文把 TAICA 每學期的課程清單當作找台灣公開 AI 課的索引。"
  - term: "鏡像課程"
    aliases: ["mirror course", "封閉型授權"]
    definition: "TAICA 的封閉型授權：盟校開一門對應的校內課，學生跟著主導課程上課，評量全部由主導課程教師負責。"
    context: "清大高宏宇《自然語言處理》在 115 學年上學期標為鏡像課程。"
  - term: "衛星課程"
    aliases: ["satellite course", "條件式授權"]
    definition: "TAICA 的條件式或開放式授權：盟校由協同教師開課並配置助教，考試與評分由協同教師辦理。條件式依主導教師的評量設計，開放式可以由協同教師自訂。"
    context: "長庚楊智淵的生成式 AI 課程頁就是政大蔡炎龍主導課的衛星班頁面。"
---

> 🌏 [English version](/posts/learning/2026-09-30-taiwan-ai-course-map-en)

[台大那篇地圖](/posts/learning/2026-09-30-ntu-ai-ml-course-map)處理的是李宏毅、林軒田、陳縕儂。台大以外，台灣其實還有好幾門中文授課、整學期錄影都放在 YouTube 的 AI 課。它們不好找，因為教材散在老師的 GitHub、Google Sites、實驗室網頁，甚至別校協同教師的網站上。

這篇用一份官方清單把它們串起來：TAICA 臺灣大專院校人工智慧學程聯盟每學期公布的開課清單。分級沿用[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3。A0 只有課表，A1 有課綱，A2 有部分實質教材或錄影。A3 則是教材加作業，足以排成連貫的自學路線。這是本站的編輯分級，不代表有學分或助教批改。台大的課請看台大那篇，這裡不重複。以下公開狀態以 **2026 年 9 月 30 日**的查核為準。

## TAICA 是什麼：一份會告訴你「課在哪裡直播」的清單

[TAICA 首頁](https://taicatw.net/)的「計畫緣起」說，這是教育部成立的聯盟。它用跨校的人工智慧學程整合教學資源，讓 AI 師資充足的大學輔佐師資不足的學校。聯盟自 113 學年度起運作，首頁寫到 113 學年度第 2 學期已有 55 所大專校院加入。學程分成探索應用、工業應用、自然語言技術、視覺技術等幾類，網站選單後來又多了資訊安全技術學程。

運作方式是「主導課程」。一所大學開課並同步遠距直播，其他盟校開對應的校內課讓學生選。[學校行政端開課](https://taicatw.net/course-info-for-admin/)頁把授權分成三種：

- **封閉型授權（鏡像課程）**：盟校學生的評量全部由主導課程教師負責。
- **條件式授權（衛星課程）**：評量照主導教師的設計，考試與評分由盟校協同教師辦理。
- **開放式授權（衛星課程）**：協同教師可以自訂評量。

對校外讀者來說，最有用的是每學期的開課清單。從 [113 上](https://taicatw.net/fall-113/)、[113 下](https://taicatw.net/spring-113/)、[114 上](https://taicatw.net/fall-114/)、[114 下](https://taicatw.net/spring-114/)到 [115 上](https://taicatw.net/fall-115/)，每門課都列出學校、教師、授課語言、課綱 PDF 和「遠距上課位置」。115 上共有 10 門主導課程，由六所大學開設。

「遠距上課位置」這一欄就是篩選器。填 YouTube 頻道的課，直播與錄影通常任何人都看得到；填 NTU COOL、Google Meet 或 Webex 的課，錄影多半只給選課學生。不過這一欄只是起點，實際情況要逐門核對：

- 清大高宏宇的 NLP 在清單上填 NTU COOL，錄影卻公開放在 YouTube，連結寫在 GitHub 課程頁。
- 政大蔡炎龍的課填 Facebook 直播社團，另外註明 YouTube 頻道是錄影存留處。
- 成大莊坤達 114 下的《生成式AI應用系統與工程》第一週填了 YouTube 直播連結，其餘週次走 NTU COOL。那支第一週影片今天已經設為私人。

## 一張表看完：台大以外值得自學的課

| 課程與學期 | 分級 | 校外拿得到什麼 | 校內限定或缺口 |
|---|---:|---|---|
| **清大 高宏宇 自然語言處理 Fall 2025** | **A3** | 講課與助教課投影片、課表上 36 個 YouTube 連結、HW1–4 題目 PDF、報告模板與 starter notebook | 解答、評分、期末專題規格 |
| 清大 高宏宇 自然語言處理 Fall 2026（進行中） | A2 | W1–W3 投影片與錄影、Syllabus、HW1 | 其餘週次尚未公開 |
| **政大 蔡炎龍 生成式 AI Spring 2025（1132）** | **A3** | 14 支錄影、14 份投影片 PDF、長庚衛星班頁面上的 12 份作業說明與評分標準、Demo notebook | 繳交與批改走各校平台；notebook repo 持續改版 |
| 政大 蔡炎龍 生成式 AI Fall 2025（1141） | A2 | 頻道直播區的 13 支講課錄影（第 3 到第 15 講） | 沒有公開的作業頁 |
| **成大 朱威達 人工智慧導論 Fall 2025** | **A2** | 26 支錄影的播放清單、Ch0–4 投影片 | 課程頁已切到 Fall 2026，後半投影片與作業規格未公開 |
| **北科 韓秉軒 智慧人機互動 114-1** | **A2** | 14 支講課錄影，另有期中與期末專題清單 | 作業是短文加線上測驗，都在 NTU COOL |
| 北科 韓秉軒 智慧人機互動 115-1（進行中） | A2 | 課表試算表、W1–W3 Google 簡報與錄影、5 份作業題目 | 繳交與測驗在 NTU COOL |
| **清大 胡敏君 機器導航與探索 Spring 2026** | **A2** | 15 支直播錄影（Week 1–13）、TAICA 課綱 PDF | Lab 規格與程式沒有官方公開版本 |

## 清大高宏宇《自然語言處理》：台大以外最完整的一門

高宏宇的課程頁就是 GitHub repo [IKMLab/NTHU_Natural_Language_Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing)。首頁目前是 2026 版，歷年教材放在年份資料夾裡。這是 TAICA 的研究所級主導課，中文授課，自 113 上就在清單上。115 上的 [TAICA 課綱](https://drive.google.com/file/d/1XHyNRHTGJPPpru90WbciVdDMrT-fFU7u/view)標為鏡像課程，週四上午同步遠距。

最近一個完整學期是 [Fall 2025](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)。課表從詞向量、語言模型、seq2seq 與 attention、Transformer、BERT 家族、解碼策略，一路排到 GPT-3、InstructGPT、RLHF、PEFT 與 RAG。每週附一到兩支 YouTube 錄影，課表上共 36 個不重複的影片連結。[作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)列出 4 份作業：Word Analogy、Arithmetic、Multi-output learning 與 RAG。每份都有說明影片、題目 PDF、報告模板和 `main.ipynb`。另有助教課的 PyTorch、Hugging Face 與 LLM API 範例 notebook。

所以 Fall 2025 是 A3。拿不到的是解答、分數和期末專題的完整規格。[Fall 2026](https://github.com/IKMLab/NTHU_Natural_Language_Processing) 正在進行，只放到 W3 和 HW1，課表最後新增了 Reasoning／Agent 單元。

本站的[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列逐週拆解 Fall 2025，入口篇整理了兩學期的評分與教材差異。

今晚可以做的事：打開 2025 資料夾的 Assignment 1，看完說明影片，在 Colab 跑一次 `main.ipynb` 的 Word Analogy。

## 政大蔡炎龍《生成式 AI》：網路上最完整的課程頁在長庚

課名是《生成式 AI：文字與圖像生成的原理與實務》，政大應數系蔡炎龍主講。它是 TAICA 的主導課程，[115 上清單](https://taicatw.net/fall-115/)標為衛星課程，難度兩顆星，是清單上最入門的 AI 課之一。

搜尋這門課時，最完整的頁面是 [GenerativeAI2025](https://yangchihyuan.github.io/courses/GenerativeAI2025)。它放在長庚大學人工智慧學系楊智淵的 CGU AICV Lab 網站上，是長庚**衛星班**的課程頁。頁面寫明「開設學校：政治大學／授課教師：蔡炎龍」，楊智淵列在「協同教師與答問時間」，另有兩位長庚助教。也就是說，錄影和投影片出自蔡炎龍，楊智淵負責長庚這一班的輔導與評分。這是 TAICA 衛星課程的正常分工，不是兩人合開同一門課。長庚班還調整了評分：12 次作業平均占 100%，期末專案改為 0%，原因是大四生要提早送成績。政大本校的評分以 [115 上課綱](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view)為準。

最完整的學期是 Spring 2025（1132）：

- [1132 播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)有 14 支錄影，從神經網路、GAN、Transformer、LLM、對話機器人、RAG、AI Agents，排到 VAE、Diffusion 與 ControlNet。
- 14 份投影片 PDF 放在蔡炎龍的[公開 Google Drive 資料夾](https://yenlung.me/1132GenAI)。
- 長庚衛星班頁面逐週列出作業說明與評分標準。
- 課堂 Demo 在 [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo)。這個 repo 是他各課程與工作坊共用的，學期結束後仍在更新，拿來對照時要記得它不是 1132 當時的版本。

Fall 2025（1141）沒有整理成播放清單。頻道 [Iveai – I've AI](https://www.youtube.com/@ive-iveai/streams) 的直播區還留著那學期的「【生成式 AI】」系列，從第 3 講到第 15 講。那個學期找不到公開的作業頁，所以列 A2。Fall 2026（1151）正在進行，播放清單裡已有前四講。

本站的[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列以 1132 為準逐講拆解。

## 成大朱威達《人工智慧導論》：錄影齊全，教材只留一半

朱威達的[人工智慧導論](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/index.html)是 TAICA 開辦第一學期就有的課，[115 上課綱](https://drive.google.com/file/d/1O-LjaMceSVCnJ1uIYfptRYLzRt--M6W7/view)寫的班級人數是 2850 人。直播就在他的 [YouTube 頻道](https://www.youtube.com/@WeiTaChu)，教材是 AIMA 第 4 版。

麻煩在網址。課程頁的路徑仍是 `2025f_AI`，內容卻已換成 Fall 2026，公告寫「Sep. 9, 2026 Website online」。[Lectures 頁](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/lectures.html)目前只連出 Lecture 0 到 Chapter 4 的投影片，後面的章節在原始碼裡被註解掉。作業頁只有 HW1，內容是期末專題提案。課綱寫的是五份作業，包括程式作業，其餘四份的規格沒有公開。

錄影端比較完整。[人工智慧導論2025 播放清單](https://www.youtube.com/playlist?list=PLSwYd_vsn-YuOTjvLOUA7ybRg1WWwe7P6)有 26 支影片：每週一支課堂錄影，另有一組單元影片，講 Attention、Transformer、CLIP、在本機架 LLM 與 RAG。[2024 版清單](https://www.youtube.com/playlist?list=PLSwYd_vsn-Yuu7Ce8FZypH1dR6aN_U7kO)有 15 支，[2024 課程頁](http://mmcv.csie.ncku.edu.tw/~wtchu/courses/2024f_AI/lectures.html)同樣只連出 Ch0–4 投影片。整體列 A2：想用中文看一輪 AIMA 式的 AI 導論很合適，想做作業就得自己找題目。

## 北科韓秉軒《智慧人機互動》：把 AI 當成互動設計問題

這門課的角度和其他課不同：它不教怎麼訓練模型，而是教人怎麼和 AI 系統互動。[課程網站](https://sites.google.com/view/human-ai-interaction)寫明研究所級、開放大三以上、中文授課，直播在韓秉軒實驗室的 [XRLab 頻道](https://www.youtube.com/@xrlabntut0411)。

114-1 的[講課播放清單](https://www.youtube.com/playlist?list=PL0I-in7ElVWamRM4VdMJpL1E2tISR3NqY)有 14 支，頻道上另有期中、期末提案與期末專題的清單。115-1 的課表放在一份公開試算表。前半學期講人機互動基礎、Human-AI Dialogue、人因與大型多模態模型，後半講虛擬人、啟發式評估與 Human-AI Co-Creation。前三週的 Google 簡報與錄影都已經連出，簡報可以直接匯出 PDF。

[作業頁](https://sites.google.com/view/human-ai-interaction/%E4%BD%9C%E6%A5%AD)列出 5 份題目，例如「當 AI 生成圖片不如預期」和「當MCP不在我掌控中」。每份是個人短文加線上測驗，都在 NTU COOL 上進行，校外讀者只能拿題目自己寫。列 A2。

## 清大胡敏君《機器導航與探索》：TAICA 清單裡找到的機器人課

這門課不在最初的候選名單上，是掃 [114 下清單](https://taicatw.net/spring-114/)時找到的。清單寫中文授課、研究所課程、衛星課程，遠距上課位置是 [NTHU RNE 頻道](https://www.youtube.com/@NTHURNE-l9v)。[TAICA 課綱](https://drive.google.com/file/d/1oSYXDvDiF_CAz-qw11YIZsGCB2o3sISI/view)把內容分成三塊：SLAM、以機器學習做場景理解，以及路徑規劃、導航與強化學習的動作控制。參考書是 Probabilistic Robotics 與 Sutton & Barto。

頻道直播區有 Spring 2026 的 15 支錄影，從 Week 1 到 Week 13。整理好的 [RNE 2026 播放清單](https://www.youtube.com/playlist?list=PLTnMPhAPz9jZUy33snHFrckiz5ABXuLj6)只收到 Week 5，要看後半請到直播區。課綱每週排了 Lab，但網路上只找得到修課學生自己整理的 repo，沒有官方的 Lab 規格或起始碼，所以列 A2。

## 陽明交大：為什麼沒有進主表

陽明交大從 113 下起每學期都有 TAICA 主導課，但本文查到的 AI 課都是英文授課，而且錄影公開程度不夠：

- **深度學習**（彭文孝、陳永昇、謝秉均，Spring 2026）：[114 下清單](https://taicatw.net/spring-114/)的上課位置以 Google Meet 為主，只連出一支 YouTube 影片。那支影片放在助教的個人頻道，狀態是「不公開」（unlisted），頻道本身沒有任何公開影片。校外能確定拿到的只有 [TAICA 課綱](https://drive.google.com/file/d/13oO9d8D8VCkAr4ZmyK2nojp1vEZ3h0hW/view)，列 A1。
- **實體人工智慧 Physical AI**（陳奕廷，Fall 2026）：[播放清單](https://www.youtube.com/playlist?list=PLQBINSduGuUw)是公開的，目前有 Lecture 1 到 4 共 6 支，[課綱](https://drive.google.com/file/d/1dgHk0w80-s-ujBbeAp1pk6O1oA0SRYp6/view)也公開。可是它才開學四週，也沒找到課程網站或作業，先列 A2（進行中），學期結束後再回來評估。
- **基礎程式設計（C++）**（温宏斌）：清單上填了 YouTube 播放清單，但它是程式設計課，不是 AI 課，而且清單顯示有 9 支影片被隱藏。

## TAICA 上其他課：看得到，但不是本站的主線

| 課程 | 學校與教師 | 授課語言 | 公開情況 | 分級 |
|---|---|---|---|---:|
| 人工智慧倫理（Spring 2026） | 東海 甘偵蓉 | 中文 | [頻道](https://www.youtube.com/@AI-Ethics_2026)上有 14 週直播存檔；[Spring 2025 清單](https://www.youtube.com/playlist?list=PL2wUUgdSGIefCX_sNm7Mv5LcJIcr9Ruva)有 13 支 | A2 |
| 智慧製造執行系統（Spring 2026） | 成大 陳裕民 | 中文 | TAICA 清單指向的頻道直播區有整學期錄影，但內容是製造系統，不是 AI 核心課 | A2 |
| 資料探勘與應用（Fall 2026） | 清大 陳宜欣 | 英文 | [課程頁](https://www.cs.nthu.edu.tw/~yishin/courses/ISA5810/ISA5810-2026.html)公開；[頻道](https://www.youtube.com/@NTHU_ISA5810_DataMining)的 2025 講課清單只有 4 支，另有兩份 Lab 清單 | A2 |
| 生成式AI應用系統與工程（Spring 2026） | 成大 莊坤達 | 中文 | 課綱公開；第一週直播已設為私人，其餘週次在 NTU COOL | A1 |
| 大型語言模型與資訊安全系統（Spring 2026） | 台科大 林俊叡 | 英文 | 課綱公開；上課走 NTU COOL | A1 |

## 校外最穩的三條路線

### 1. 想做 NLP 與 LLM 應用：清大高宏宇 NLP Fall 2025

四份作業從詞向量走到 RAG，每份都有題目、模板與 notebook。它和台大陳縕儂的 ADL 範圍接近，差別在作業端公開得更完整。

### 2. 程式基礎不多，想先做出東西：政大蔡炎龍 生成式 AI 1132

照長庚衛星班頁面的週次走，每週看一支錄影、做一份作業。深度不如李宏毅的課，但多數講次都搭配一份 Colab 作業，做完就有一個能動的小應用。

### 3. 想補 AI 概論或換個視角：成大朱威達、北科韓秉軒、清大胡敏君

朱威達適合用中文走一輪 AIMA，胡敏君補機器人與強化學習，韓秉軒則補「使用者怎麼跟 AI 互動」這一塊。三門都只有錄影和部分教材，要自己找練習題。

台大以外的公開課有個共同點：TAICA 要讓幾千名跨校學生同時上課，老師就把直播放上 YouTube，公開是順帶的結果。錄影因此很齊，作業和評分卻留在 NTU COOL。想追新課，最省力的方法是每學期初打開 TAICA 的最新課程清單，看「遠距上課位置」那一欄。

## 參考資料

- [世界名校 AI／CS 課程地圖（本系列總覽與 A0–A3 定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
- [台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
- [Harvard AI／ML 課程導讀](/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [清大高宏宇 自然語言處理 導讀：系列入口](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)
- [政大蔡炎龍 生成式AI 導讀：總覽與自學路線](/posts/ai/2026-09-30-nccu-genai-course-overview)
- [TAICA 臺灣大專院校人工智慧學程聯盟 首頁](https://taicatw.net/)
- [TAICA 關於聯盟學校](https://taicatw.net/about-taica/)
- [TAICA 學校行政端開課（授權類型）](https://taicatw.net/course-info-for-admin/)
- [TAICA 113 學年度上學期開設課程清單](https://taicatw.net/fall-113/)
- [TAICA 113 學年度下學期開設課程清單](https://taicatw.net/spring-113/)
- [TAICA 114 學年度上學期開設課程清單](https://taicatw.net/fall-114/)
- [TAICA 114 學年度下學期開設課程清單](https://taicatw.net/spring-114/)
- [TAICA 115 學年度上學期開設課程清單](https://taicatw.net/fall-115/)
- [IKMLab/NTHU_Natural_Language_Processing（GitHub）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [清大 NLP 2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [清大 NLP 2025 作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [清大 NLP 115-1 TAICA 課綱](https://drive.google.com/file/d/1XHyNRHTGJPPpru90WbciVdDMrT-fFU7u/view)
- [長庚衛星班：生成式AI：文字與圖像生成的原理與實務 2025](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [蔡炎龍 1132 生成式 AI 播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [蔡炎龍 1132 投影片資料夾](https://yenlung.me/1132GenAI)
- [yenlung/AI-Demo（GitHub）](https://github.com/yenlung/AI-Demo)
- [Iveai – I've AI 直播區](https://www.youtube.com/@ive-iveai/streams)
- [政大生成式 AI 115-1 課綱](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view)
- [成大朱威達 人工智慧導論 課程頁（目前為 Fall 2026）](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/index.html)
- [成大朱威達 人工智慧導論 Lectures](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/lectures.html)
- [成大朱威達 人工智慧導論 2024 Lectures](http://mmcv.csie.ncku.edu.tw/~wtchu/courses/2024f_AI/lectures.html)
- [成大人工智慧導論 115-1 TAICA 課綱](https://drive.google.com/file/d/1O-LjaMceSVCnJ1uIYfptRYLzRt--M6W7/view)
- [朱威達 YouTube 頻道](https://www.youtube.com/@WeiTaChu)
- [人工智慧導論2025 播放清單](https://www.youtube.com/playlist?list=PLSwYd_vsn-YuOTjvLOUA7ybRg1WWwe7P6)
- [人工智慧導論2024 播放清單](https://www.youtube.com/playlist?list=PLSwYd_vsn-Yuu7Ce8FZypH1dR6aN_U7kO)
- [北科 智慧人機互動 課程網站](https://sites.google.com/view/human-ai-interaction)
- [北科 智慧人機互動 作業頁](https://sites.google.com/view/human-ai-interaction/%E4%BD%9C%E6%A5%AD)
- [XRLab NTUT YouTube 頻道](https://www.youtube.com/@xrlabntut0411)
- [114-1 智慧人機互動 播放清單](https://www.youtube.com/playlist?list=PL0I-in7ElVWamRM4VdMJpL1E2tISR3NqY)
- [清大 機器導航與探索 TAICA 課綱](https://drive.google.com/file/d/1oSYXDvDiF_CAz-qw11YIZsGCB2o3sISI/view)
- [NTHU RNE YouTube 頻道](https://www.youtube.com/@NTHURNE-l9v)
- [RNE 2026 上課錄影 播放清單](https://www.youtube.com/playlist?list=PLTnMPhAPz9jZUy33snHFrckiz5ABXuLj6)
- [陽明交大 深度學習 TAICA 課綱](https://drive.google.com/file/d/13oO9d8D8VCkAr4ZmyK2nojp1vEZ3h0hW/view)
- [陽明交大 Physical AI Fall 2026 播放清單](https://www.youtube.com/playlist?list=PLQBINSduGuUw)
- [陽明交大 實體人工智慧 TAICA 課綱](https://drive.google.com/file/d/1dgHk0w80-s-ujBbeAp1pk6O1oA0SRYp6/view)
- [東海 人工智慧倫理 直播頻道](https://www.youtube.com/@AI-Ethics_2026)
- [東海 人工智慧倫理 1132 播放清單](https://www.youtube.com/playlist?list=PL2wUUgdSGIefCX_sNm7Mv5LcJIcr9Ruva)
- [清大 ISA5810 Data Mining 2026 課程頁](https://www.cs.nthu.edu.tw/~yishin/courses/ISA5810/ISA5810-2026.html)
- [清大 ISA5810 YouTube 頻道](https://www.youtube.com/@NTHU_ISA5810_DataMining)
