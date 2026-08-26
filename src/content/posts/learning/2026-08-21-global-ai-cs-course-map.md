---
title: "世界名校 AI／CS 課程地圖：哪些課真的能公開自學？"
date: 2026-08-21
category: learning
tags: [ai-course, cs-course, learning-path, self-study, open-course]
lang: zh-TW
series:
  name: "世界名校 AI／CS 課程地圖"
  order: 0
type: guide
tldr: "這份地圖盤點 Stanford、CMU、MIT、UC Berkeley 在 2025–2026 年的 AI／CS 課程，將公開程度拆成 A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。課程官網存在、YouTube 播放清單存在，都不代表校外讀者真的拿得到當期影片、作業與起始碼。"
description: "以 2025–2026 官方課程網站、課表與教材入口為依據，整理 Stanford、CMU、MIT、UC Berkeley 的 AI／CS 課程地圖，說明哪些能完整自學、哪些只有講義或歷史影片，以及如何判讀 LMS、YouTube 與 CSDIY 資源。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

搜尋「Stanford CS229」、「Berkeley CS188」或「MIT deep learning」，很快就能找到課程網站、YouTube 影片和別人整理的筆記。真正麻煩的問題在下一步：**這些東西是不是同一個學期？現在不用學校帳號還打得開嗎？作業只有題目，還是連起始碼與必要檔案都有？**

這份地圖先盤點 Stanford、Carnegie Mellon University（CMU）、MIT 與 UC Berkeley，時間範圍是 **2025–2026**。2026 年版本完整就優先；如果新學期只有課表、錄影鎖在校內系統，而 2025 年官方版本更完整，2025 也會正式列入。每篇單課導讀都會標明採用學期，不把 2025 影片與 2026 作業包裝成同一套課。

這不是大學排名，也不是「哪間學校最好」。它只回答兩件事：這間學校如何安排 AI／CS 課程，以及校外讀者現在到底拿得到多少。

## 公開課不是 yes／no，而是四個等級

「課程公開」至少可能指七件不同的事：課程描述、課綱、投影片、作業題目、起始碼、解答與錄影。一個網站只要公開其中一項，搜尋引擎就可能把它送到你面前，但這不等於你能照著修完整門課。

本站使用四個編輯標籤。這不是學校官方分級，而是用來約束文章能承諾到哪裡：

| 等級 | 校外讀者拿得到什麼 | 文章可以承諾什麼 |
|---|---|---|
| A0 課表可見 | 課名、學分、簡介 | 只說它在課程地圖上的位置 |
| A1 課綱可見 | syllabus、週次、閱讀清單 | 可以分析範圍，不能評論作業體驗 |
| A2 教材部分開放 | 講義、部分作業或錄影 | 可以做選題式導讀，必須列出缺口 |
| A3 足以自學 | 系統化教材，加上作業與必要檔案 | 可以提供完整自學路線 |

錄影不是 A3 的必要條件。一門課若有完整講義、作業、起始碼與清楚的評量順序，仍可能足以自學。反過來，只有 YouTube 播放清單，沒有練習材料，也不會自動升成 A3。

**怎麼做**：以後看到一門「公開課」，先別按播放。用五分鐘找出 syllabus、第一份作業與 starter code。三樣找得到，再決定是否投入幾十小時。

## 第一層：真的能從頭跟到尾

目前最乾淨的例子之一是 [MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/)。2026 年官方頁公開九講影片、投影片與三個 software labs；[2025 封存版](https://introtodeeplearning.com/2025/index.html)則保留十講影片與三個 labs。它很適合自學，但要記得它是密集 bootcamp，不是完整一學期的深度學習課。

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)也接近完整公開：投影片、教材章節、discussion materials、六個 Pacman projects 與逐講影片都能從課站取得。正式課程的 Ed、成績與教學人員支援仍限修課生，但校外讀者至少能走完主要學習路徑。本站的 [CS188 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)已盤點 P0–P5 六個 projects 與建議修課順序。

Stanford 的情況不是只有零散影片。[Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)已按官方先修關係整理從 CS106A 到 CS336 的階梯；其中 [CS336 Spring 2026](https://cs336.stanford.edu/)公開講義與五份 GitHub 作業，Spring 2025 也有 Stanford Online 官方錄影。它的限制不在網址，而在算力：教材公開不代表完成每份作業都免費。

這一層最適合直接寫單課導讀，因為文章可以把「學什麼、做什麼、從哪裡開始」接成一條真正走得通的路。

## 第二層：教材夠新，但校外體驗少一塊

[Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/)公開 post-training、RAG、reasoning、agents 等主題的投影片，也公開三份作業與專案說明。缺口是錄影：當期 YouTube playlist 確實存在，但匿名載入會回傳 `UNPLAYABLE`，課站也明寫需要 Berkeley login。這門課仍能做教材導讀，不能宣稱「影片也全公開」；[CS288 導讀系列總覽](/posts/learning/2026-08-22-berkeley-cs288-overview)已按這個邊界完成。

[Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)公開二十五講投影片、五份作業與 GitHub 起始碼，當期錄影卻放在 bCourses。官方另連到較舊的公開影片，因此可行的做法是：主文分析 2026 教材，把歷史影片放在獨立替代資源區，清楚標出年份。[CS285 導讀系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)就是照這個原則寫的。

[MIT 6.7960 Fall 2025](https://deeplearning6-7960.github.io/)公開完整 schedule、投影片、readings 與 PyTorch Colab，但題目在 Gradescope、解答在 Canvas。本系列會把它列為 A2：可以深入讀教材設計，不能承諾完整重現修課體驗。

**怎麼做**：選 A2 課程時，先寫下你要的成果。如果目標是理解一個主題，投影片與 readings 可能已經夠；如果目標是做完整作業，缺少題目、資料集或評分器就是停止訊號。

## 第三層：最新課程正在改制或還沒把材料放出來

CMU 是最不能只看舊課號的一間。新的 [07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)把搜尋、機器學習、LLM 與強化學習放進共同入口，後面接 07-380 AI & ML II。官方 FAQ 說明這組新課要取代 15-281 與 10-315；因此 15-281 的 Spring 2026 公開教材仍有價值，卻不能再代表 CMU 最新主線。[CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)整理了新制下的完整自學路線，改制的細節另外寫在[〈CMU AI 核心改制〉](/posts/learning/2026-08-22-cmu-ai-core-redesign)。

截至 2026 年 8 月 21 日，07-280 Fall 2026 課表已上線，但多數逐講材料與作業連結尚未發布。這時最誠實的處理不是搶著寫「最新完整導讀」，而是先在 CMU 課程地圖中說明改制，等開課後再重新稽核。

同校的 [11-785 Introduction to Deep Learning](https://deeplearning.cs.cmu.edu/S26/index.html)則是另一種情況：Spring 2026 與 [Fall 2025](https://deeplearning.cs.cmu.edu/F25/index.html)都逐講提供官方 YouTube，投影片也公開；作業卻混用 Autolab、Kaggle 與 Piazza。影片已確認能看，能否完整自學仍要逐份檢查 starter assets。

進行中或尚未開課的學期，只有 schedule 不算「最新公開課」。本站會等材料真的出現再升級，不用年份的新換掉內容完整的舊。

## 四間學校應該怎麼讀

| 學校 | 課程地圖的主問題 | 目前最適合的公開入口 |
|---|---|---|
| [Stanford](/posts/learning/2026-08-20-stanford-cs-course-map) | 先修關係如何從系統與數學地基一路接到研究級 AI？ | CS221、CS336 |
| [CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map) | 07-280／07-380 新制如何接到 ML、DL、NLP 與 systems？ | 10-301/601、11-785；07-280 等 Fall 2026 材料 |
| [MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map) | 現行課號、當期課站與歷史 OCW 如何對齊？ | 6.S191；6.7960 做 A2 教材導讀 |
| [Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map) | CS188／CS189 之後如何分流到 NLP、RL 與視覺？ | CS188；CS288、CS285 做教材型導讀 |

系列後來也補上了 Harvard：[Harvard AI／ML 課程導讀](/posts/learning/2026-08-22-harvard-ai-ml-course-map)檢查了 CS50 AI 的錄影版本與 CS181／CS182 的作業開放狀況。

學校地圖與單課導讀是兩種文章。即使一間學校的教材全鎖在 LMS，仍可以靠現行 catalog、program requirements 與 schedule 重建課程路線；只是文章只能承諾「看懂怎麼選課」，不能承諾「不用入學也能修完」。

## CSDIY 應該放在哪裡

[CSDIY](https://csdiy.wiki/)很適合回答「社群實際跟過哪個版本」。例如它會保存歷史影片、作業經驗與補充資源，這些資訊常比學校課表更接近自學現場。

但它不能單獨證明三件事：課程在 2026 年仍開、當期入口仍允許匿名存取、第三方影片具有官方身分或開放授權。反過來，CSDIY 沒收錄一門課，也不表示官方材料不能自學。

因此這個系列固定用雙軌：官方來源判斷當期課程與權限，CSDIY 補歷史版本與社群實修經驗。兩者不互相取代。Berkeley CS188 與 CMU 15-281 共用同一套 Pacman projects 的歷史，就是靠社群紀錄才拼得完整，這段血統另寫成[〈Pacman AI project 血統〉](/posts/learning/2026-08-22-pacman-ai-project-lineage)。

## 這個系列已經寫到哪裡

四篇學校地圖已完成：[Stanford](/posts/learning/2026-08-20-stanford-cs-course-map)、[CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map)、[MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map)、[Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)，外加 Harvard 一篇。單課深讀也開跑了：

- [Berkeley CS188 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)，含搜尋、MDP、Bayes Nets 到機器學習的完整導讀
- [Berkeley CS285 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)，含模仿學習、policy gradient 到 offline RL 的分段導讀
- [Berkeley CS288 總覽](/posts/learning/2026-08-22-berkeley-cs288-overview)，從 foundations、transformers 到 agents
- [CMU 10-301／601 總覽](/posts/learning/2026-08-22-cmu-10301-overview)，用九份作業走完整門機器學習
- [CMU 07-280 完整課程導讀](/posts/ai/2026-08-22-cmu-07280-course-overview)：24 講逐講深拆，另有[全課總結與選課路線](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)
- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：28 講全覆蓋，並標出作業鏈不完整的缺口
- [MIT 6.S191 導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)：九講與三個 labs 全公開的實際跑法
- Stanford CS336 與 CS221 也各有系列：[CS336 從 tokenization 開始的主題深拆](/posts/ai/2026-08-22-cs336-overview-tokenization)、CS221 的 20 講逐講導讀

還沒寫的是 MIT 6.7960、Berkeley CS189，以及 Harvard CS50 AI／CS181／CS182 的單課深讀；CMU 07-380 則等材料公開後再稽核。

如果你現在只想選一門開始，做一個很小的測試：打開 MIT 6.S191 的第一個 lab，或 Berkeley CS188 的第一個 project，給自己九十分鐘。九十分鐘後還能說清楚環境缺什麼、下一步要做什麼，這門課才真的進入你的自學清單。收藏一個播放清單不算開始。

## 更新紀錄

- 2026-08-26：查核後發現 MIT 6.S191、CMU 11-785、07-280、CS336、CS221 的導讀已在本站 `ai` 分類上線，把「還沒寫」清單修正為 6.7960、CS189 與 Harvard 三門課。
- 2026-08-26（稍早）：系列後續文章（四篇學校地圖、Harvard、CS188／CS285／CS288／10-301 導讀、CMU 改制與 Pacman 血統）已上線，補上內文連結，並把「接下來怎麼走」改寫為現況清單。

## 參考資料

### 本站系列文章

- [Stanford CS 課程導讀](/posts/learning/2026-08-20-stanford-cs-course-map)
- [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)
- [MIT AI／ML 課程導讀](/posts/learning/2026-08-21-mit-ai-ml-course-map)
- [Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
- [Harvard AI／ML 課程導讀](/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [CMU AI 核心改制：15-281＋10-315 到 07-280＋07-380](/posts/learning/2026-08-22-cmu-ai-core-redesign)
- [Pacman AI project 血統](/posts/learning/2026-08-22-pacman-ai-project-lineage)
- [Berkeley CS188 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)
- [Berkeley CS285 Spring 2026 導讀總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)
- [Berkeley CS288 Spring 2026 導讀總覽](/posts/learning/2026-08-22-berkeley-cs288-overview)
- [CMU 10-301／601 機器學習導讀總覽](/posts/learning/2026-08-22-cmu-10301-overview)
- [CMU 07-280 完整課程導讀](/posts/ai/2026-08-22-cmu-07280-course-overview)
- [CMU 07-280 全課總結](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)
- [CMU 11-785 深度學習完整課程導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)
- [MIT 6.S191 導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
- [Stanford CS336 主題深拆系列](/posts/ai/2026-08-22-cs336-overview-tokenization)

### 官方課程網站與外部資源

- [Stanford CS336 Spring 2026](https://cs336.stanford.edu/)
- [CMU 07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)
- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [MIT 6.S191 Introduction to Deep Learning](https://introtodeeplearning.com/)
- [MIT 6.S191 2025 archive](https://introtodeeplearning.com/2025/index.html)
- [MIT 6.7960 Deep Learning Fall 2025](https://deeplearning6-7960.github.io/)
- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/)
- [CSDIY](https://csdiy.wiki/)
