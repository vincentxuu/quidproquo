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
tldr: "這份地圖盤點 Stanford、CMU、MIT、UC Berkeley、Harvard 與台大在 2025–2026 年的 AI／CS 課程，將公開程度拆成 A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。課程官網存在、YouTube 播放清單存在，都不代表校外讀者真的拿得到當期影片、作業與起始碼。"
description: "以 2025–2026 官方課程網站、課表與教材入口為依據，整理 Stanford、CMU、MIT、UC Berkeley、Harvard 與台大的 AI／CS 課程地圖，說明哪些能完整自學、哪些只有講義或歷史影片，以及如何判讀 LMS、YouTube 與 CSDIY 資源。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

搜尋「Stanford CS229」、「Berkeley CS188」或「MIT deep learning」，很快就能找到課程網站、YouTube 影片和別人整理的筆記。真正麻煩的問題在下一步：**這些東西是不是同一個學期？現在不用學校帳號還打得開嗎？作業只有題目，還是連起始碼與必要檔案都有？**

這份地圖盤點 Stanford、Carnegie Mellon University（CMU）、MIT、UC Berkeley、Harvard 與國立臺灣大學（台大），時間範圍是 **2025–2026**。2026 年版本完整就優先；如果新學期只有課表、錄影鎖在校內系統，而 2025 年官方版本更完整，2025 也會正式列入。每篇單課導讀都會標明採用學期，不把 2025 影片與 2026 作業包裝成同一套課。

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

目前最乾淨的例子之一是 [MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/)。2026 年版（3/30–5/25，已結課）公開九講影片、投影片與三個 software labs；[2025 封存版](https://introtodeeplearning.com/2025/index.html)則保留十講影片與三個 labs。它很適合自學，但要記得它是密集 bootcamp，不是完整一學期的深度學習課。

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)也接近完整公開：投影片、教材章節、discussion materials、六個 Pacman projects 與逐講影片都能從課站取得；這個學期已結束，課站仍完整保留。當期的 [Fall 2026](https://inst.eecs.berkeley.edu/~cs188/fa26/) 已開課，`~cs188/` 也改為直接導向 fa26，投影片與錄影隨進度逐講放出。正式課程的 Ed、成績與教學人員支援仍限修課生，但校外讀者至少能走完主要學習路徑。本站的 [CS188 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)已盤點 P0–P5 六個 projects 與建議修課順序。

Stanford 的情況不是只有零散影片。[Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)已按官方先修關係整理從 CS106A 到 CS336 的階梯；其中 [CS336 Spring 2026](https://cs336.stanford.edu/)（3/30–6/3 已結課）公開講義與五份 GitHub 作業、[YouTube 完整播放清單](https://www.youtube.com/watch?v=JuoVZkPBiKk&list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV)，Spring 2025 也有 Stanford Online 官方錄影。它的限制不在網址，而在算力：教材公開不代表完成每份作業都免費。

這一層最適合直接寫單課導讀，因為文章可以把「學什麼、做什麼、從哪裡開始」接成一條真正走得通的路。

## 第二層：教材夠新，但校外體驗少一塊

[Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/)公開 post-training、RAG、reasoning、agents 等主題的投影片，也公開三份作業與專案說明。缺口是錄影：當期 YouTube playlist 確實存在，但匿名載入會回傳 `UNPLAYABLE`，課站也明寫需要 Berkeley login。這門課仍能做教材導讀，不能宣稱「影片也全公開」；[CS288 導讀系列總覽](/posts/learning/2026-08-22-berkeley-cs288-overview)已按這個邊界完成。

[Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)公開二十五講投影片、五份作業與 GitHub 起始碼，當期錄影卻放在 bCourses。官方另連到較舊的公開影片，因此可行的做法是：主文分析 2026 教材，把歷史影片放在獨立替代資源區，清楚標出年份。[CS285 導讀系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)就是照這個原則寫的。

[MIT 6.7960](https://deeplearning6-7960.github.io/)的課站已切到 Fall 2026，投影片隨進度公開，Fall 2025 則移到「Previous years」。兩個學期的缺口相同：作業透過 Gradescope 發放，錄影放在 MIT Canvas。本系列把它列為 A2：可以深入讀教材設計，不能承諾完整重現修課體驗。本站的 [6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)因此改用錄影完整的 Fall 2024 OCW 版，並標明年份。

**怎麼做**：選 A2 課程時，先寫下你要的成果。如果目標是理解一個主題，投影片與 readings 可能已經夠；如果目標是做完整作業，缺少題目、資料集或評分器就是停止訊號。

## 第三層：最新課程正在改制或還沒把材料放出來

CMU 是最不能只看舊課號的一間。新的 [07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)把搜尋、機器學習、LLM 與強化學習放進共同入口，後面接 07-380 AI & ML II。官方 FAQ 說明這組新課要取代 15-281 與 10-315；因此 15-281 的 Spring 2026 公開教材仍有價值，卻不能再代表 CMU 最新主線。[CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)整理了新制下的完整自學路線，改制的細節另外寫在[〈CMU AI 核心改制〉](/posts/learning/2026-08-22-cmu-ai-core-redesign)。

截至 2026 年 8 月 27 日，07-280 Fall 2026 已是完整課站：24 講 schedule（8/25–12/3）、逐講投影片與 notes、週五 recitation、12 份作業（HW0–HW11，含 Building AlexNet／GPT-2／AlphaZero）與每週 pre-reading checkpoint 皆已上線。先前「多數材料尚未發布」的狀態已結束；本站的 [CMU 07-280 完整課程導讀](/posts/ai/2026-08-22-cmu-07280-course-overview)（24 講逐講＋3 篇階段複習＋[結業路線](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)）即按此當期版完成。

同校的 [11-785 Introduction to Deep Learning](https://deeplearning.cs.cmu.edu/S26/index.html)則是另一種情況：Spring 2026（已結課）與 [Fall 2025](https://deeplearning.cs.cmu.edu/F25/index.html)都逐講提供官方 YouTube，投影片也公開，[Fall 2026](https://deeplearning.cs.cmu.edu/F26/index.html)正逐講放出投影片與 YouTube 影片；作業卻混用 Autolab、Kaggle 與 Piazza。影片已確認能看，能否完整自學仍要逐份檢查 starter assets。

CMU 在 Fall 2026 還新開了 [11-768 AI Agents](https://www.cmu-agents.com/)，由 Graham Neubig 與 Daniel Fried 授課。它是研究所課，先修要求訓練過語言模型；投影片與前幾講錄影已隨進度公開，三份作業依序做 harness、評測與訓練。本站的 [11-768 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)跟著當期進度寫，後半學期的講次與作業要等官方上架才補。

進行中或尚未開課的學期，只有 schedule 不算「最新公開課」。本站會等材料真的出現再升級，不用年份的新換掉內容完整的舊。

## 六間學校應該怎麼讀

| 學校 | 課程地圖的主問題 | 目前最適合的公開入口 |
|---|---|---|
| [Stanford](/posts/learning/2026-08-20-stanford-cs-course-map) | 先修關係如何從系統與數學地基一路接到研究級 AI？ | CS221、CS229、CS224N、CS336、CME295；地基五門與 AI 分支課已有逐講導讀 |
| [CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map) | 07-280／07-380 新制如何接到 ML、DL、NLP 與 systems？ | 07-280 Fall 2026（24 講課站）、10-301/601、11-785（F26 逐講上片中）、11-768（Fall 2026 新開） |
| [MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map) | 現行課號、當期課站與歷史 OCW 如何對齊？ | 6.S191（2026 已結課）；6.7960（課站已切 Fall 2026）做 A2 教材導讀 |
| [Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map) | CS188／CS189 之後如何分流到 NLP、RL 與視覺？ | CS188（sp26 完整保留，當期為 fa26）；CS288、CS285 做教材型導讀 |
| [Harvard](/posts/learning/2026-08-22-harvard-ai-ml-course-map) | 通識 CS50 系列如何銜接 CS181／CS182？ | CS50 AI 錄影版本；CS181 以作業為節拍自學；CS182 尚無當期公開教材 |
| [台大](/posts/learning/2026-09-30-ntu-ai-ml-course-map) | 學程分層與李宏毅的電機系路線如何並行？ | 李宏毅 ML 2026 Spring（A3，中文授課）；林軒田、陳縕儂課程的公開程度差異 |
| [台灣其他學校](/posts/learning/2026-09-30-taiwan-ai-course-map) | 台大以外，哪些課透過 TAICA 公開直播、能校外自學？ | 清大高宏宇 NLP（A3）、政大蔡炎龍生成式 AI（A3）；成大、北科、陽明交大多為 A2 以下 |

> Harvard 於 2026-08-22、台大與台灣其他學校於 2026-09-30 補上地圖，見上表。台灣的課以中文授課，對中文讀者而言省下的不只是翻譯，而是可以直接對照原始術語與講者的解釋。

學校地圖與單課導讀是兩種文章。即使一間學校的教材全鎖在 LMS，仍可以靠現行 catalog、program requirements 與 schedule 重建課程路線；只是文章只能承諾「看懂怎麼選課」，不能承諾「不用入學也能修完」。

## AI 資安課

這裡的 AI 資安指保護 AI 系統本身：對抗樣本、資料投毒與後門、prompt injection、jailbreak、agent 被劫持，以及從模型裡偷出訓練資料或模型本身。AI safety 與 alignment 不算在內，像 [Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview) 就屬於後者。

2026 年 10 月掃過 Stanford、CMU、Berkeley 的課目錄之後，名校的情況是這樣：

| 課程 | 學校與教師 | 最近學期 | 分級 | 說明 |
|---|---|---|---:|---|
| [CS 253 Securing AI Systems](https://explorecourses.stanford.edu/search?q=CS253) | Stanford，Boneh、Mitchell | 2027 Spring | A0 | 沿用原 Web Security 課號改名重開，目前只有課表 |
| [15-783 Trustworthy AI](https://www.cs.cmu.edu/~aditirag/teaching/15-783F25.html) | CMU，Raghunathan | Fall 2025 | A2 | jailbreak、prompt injection、隱私攻擊各有一個模組，逐講講義公開 |
| ML for Cybersecurity（17-739／18-739C） | CMU，[Lujo Bauer](https://users.ece.cmu.edu/~lbauer) | Fall 2026 | A1 | 主軸是用 ML 做資安，兼談對抗樣本 |
| [CS 261 Computer Security](https://people.eecs.berkeley.edu/~daw/teaching/cs261-s26/) | Berkeley，Wagner | Spring 2026 | A2 | 一般資安研究所課，其中 4 堂講 LLM 攻防 |
| [6.S976 Cryptography and Machine Learning](https://mlcrypto.mit.edu/course/) | MIT | Spring 2026 | A2 | 偏理論 |

Harvard 的現行課表裡沒有這類課。能從頭自學到尾（A3）的 AI 資安課，目前都不在這六間學校：

- [中正大學阮文齡《人工智慧安全》](https://sites.google.com/view/nvlinh/teaching-awards/ai-security)（114-2，英文授課）：投影片、notebook 與作業都放在公開資料夾，是台灣唯一能完整自學的一門。
- [Cagliari 大學 Battista Biggio《Machine Learning Security》](https://unica-mlsec.github.io/mlsec/)（2025/26）：講義與 notebook 放在 GitHub。
- [復旦大學馬興軍《Trustworthy AI》](https://trust-ml.github.io/)：14 週投影片加上中文教材全文，沒有錄影。

這三門都以對抗樣本、投毒、隱私攻擊為主，幾乎不碰 LLM 與 agent。要補這一塊，目前最接近的組合是李宏毅[生成式 AI 導論 2024](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)第 13–14 講與 HW10，再讀 CMU 15-783 第一個模組的講義。

**怎麼做**：先用 Cagliari 的 notebook 親手做一次對抗樣本攻擊，再進 LLM 的 prompt injection。Stanford CS 253 在 2027 年 3 月開課，到時再回來看它會不會放出教材。

## CSDIY 應該放在哪裡

[CSDIY](https://csdiy.wiki/)很適合回答「社群實際跟過哪個版本」。例如它會保存歷史影片、作業經驗與補充資源，這些資訊常比學校課表更接近自學現場。

但它不能單獨證明三件事：課程在 2026 年仍開、當期入口仍允許匿名存取、第三方影片具有官方身分或開放授權。反過來，CSDIY 沒收錄一門課，也不表示官方材料不能自學。

因此這個系列固定用雙軌：官方來源判斷當期課程與權限，CSDIY 補歷史版本與社群實修經驗。兩者不互相取代。Berkeley CS188 與 CMU 15-281 共用同一套 Pacman projects 的歷史，就是靠社群紀錄才拼得完整，這段血統另寫成[〈Pacman AI project 血統〉](/posts/learning/2026-08-22-pacman-ai-project-lineage)。

## 這個系列已經寫到哪裡

六篇學校地圖已完成：[Stanford](/posts/learning/2026-08-20-stanford-cs-course-map)、[CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map)、[MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map)、[Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)、[Harvard](/posts/learning/2026-08-22-harvard-ai-ml-course-map)與[台大](/posts/learning/2026-09-30-ntu-ai-ml-course-map)，另有一篇[台灣其他學校](/posts/learning/2026-09-30-taiwan-ai-course-map)。單課深讀也已大幅展開：

- [Berkeley CS188 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)，含搜尋、MDP、Bayes Nets 到機器學習的完整導讀（sp26 已結課，當期為 fa26）
- [Berkeley CS285 Spring 2026 總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)，含模仿學習、policy gradient 到 offline RL 的分段導讀
- [Berkeley CS288 總覽](/posts/learning/2026-08-22-berkeley-cs288-overview)，從 foundations、transformers 到 agents
- [CMU 10-301／601 總覽](/posts/learning/2026-08-22-cmu-10301-overview)，用九份作業走完整門機器學習
- [CMU 07-280 完整課程導讀](/posts/ai/2026-08-22-cmu-07280-course-overview)：24 講逐講深拆（對應 Fall 2026 完整課站），另有[全課總結與選課路線](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)
- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：28 講全覆蓋，並標出作業鏈不完整的缺口（S26 已結課，F26 逐講上片中）
- [CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)：Fall 2026 新開的 agent 研究所課，從 harness、評測寫到訓練，跟著當期進度更新
- [MIT 6.S191 導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)：九講與三個 labs 全公開的實際跑法（2026 版 3/30–5/25 已結課）
- Stanford AI 課程逐講系列：[CS221](/posts/ai/2026-08-21-stanford-cs221-ai-principles)、[CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning)、[CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[CS224W](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs)、[CS224V](/posts/ai/2026-08-21-stanford-cs224v-agentic-ai)、[CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)、[CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)、[CS329Z](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)、[CS224U](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)（Spring 2023 歷史版 16 篇），以及 [CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)（另有[從 tokenization 開始的主題深拆](/posts/ai/2026-08-22-cs336-overview-tokenization)）；各課的版本與先修關係見 [Stanford 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)：電腦視覺深度學習，Spring 2026 投影片與 A1–A3 作業，錄影對照 Spring 2025
- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)：IAP 2026 的 flow matching 與擴散模型，講義、錄影與三個 lab 全公開
- [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)：從 CUDA kernel、分散式訓練到 serving 與 RLHF 的七份作業，沒有錄影、需要 GPU
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：中文授課，從解剖 OpenClaw、context engineering 到 KV cache 與 harness engineering
- [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)：深度強化學習，Spring 2026，從模仿學習到 RLHF、LLM 推理與機器人 VLA
- [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)：強化學習理論，Winter 2026 投影片與作業，錄影對照 Spring 2024
- [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)：平行計算，Fall 2025，含 GPU／CUDA 與 AI 加速器作業，錄影對照 2023
- [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)：高效深度學習，以最近一屆完整的 Fall 2024 為底本（Fall 2025 未開課），對照進行中的 Fall 2026
- [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)：生成式 AI，Spring 2026，以 HW1–HW4 為主線
- [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)：AI 安全，Fall 2025，錄影、閱讀清單與作業公開
- 台灣中文課：[台大陳縕儂 ADL 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview)、[台大林軒田 機器學習基石與技法](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)（內容跟 2013 年錄製的 MOOC，練習用 Fall 2024 作業）、[清大高宏宇 自然語言處理](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)、[政大蔡炎龍 生成式 AI](/posts/ai/2026-09-30-nccu-genai-course-overview)
- [Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)：兩學分、沒有作業的 Transformer 與 LLM 課，2025 版全部公開，2026 版新增 LLM 系統、強化學習與 Diffusion LLM
- Stanford 地基課逐講系列：[CS103 數學基礎 28 講](/posts/learning/2026-08-21-stanford-cs103-math-foundations)、[CS107 系統 30 講](/posts/learning/2026-08-21-stanford-cs107-computer-systems)、[CS109 機率 22 講](/posts/learning/2026-08-21-stanford-cs109-probability)、[CS111 作業系統 28 講](/posts/learning/2026-08-21-stanford-cs111-operating-systems)、[CS161 演算法 18 講](/posts/learning/2026-08-21-stanford-cs161-algorithms)皆已完成中英對照
- [Berkeley CS189 導讀](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)：總覽以 Spring 2025 為起點，逐講與 HW1–5 則依重新上線的 Spring 2026 課站寫成，另對照 Fall 2026（eecs189.org/fa26）行事曆
- [CMU 07-380 導讀](/posts/learning/2026-08-22-cmu-07380-fall-2026-overview)：Fall 2026 首開，已公開的第 1–10 講與 HW1–3 已逐篇寫完，後半學期隨課站進度補上；對照 [07-280](/posts/ai/2026-08-22-cmu-07280-course-overview)

Harvard 這邊，[CS50 AI 導讀](/posts/ai/2026-08-26-harvard-cs50-ai-guide)與 [CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)（HW0–HW6 全部作業）都已上線；還沒寫的只剩 CS182，它 Fall 2026 雖列在 SEAS 課表上，但目前找不到公開課站，要等教材出現再寫。

如果你現在只想選一門開始，做一個很小的測試：打開 MIT 6.S191 的第一個 lab，或 Berkeley CS188 的第一個 project，給自己九十分鐘。九十分鐘後還能說清楚環境缺什麼、下一步要做什麼，這門課才真的進入你的自學清單。收藏一個播放清單不算開始。

## 更新紀錄

- 2026-10-05：新增「AI 資安課」一節：Stanford、CMU、Berkeley、MIT 的現行 AI 資安課與分級，以及台灣與海外能完整自學的三門課。
- 2026-10-01：「已寫到哪裡」補上 Stanford CS224R、CS234、CS149，MIT 6.5940，CMU 10-423 與 Harvard CS2881R 六個新系列。
- 2026-09-30（3）：新增[台灣其他學校 AI 公開課地圖](/posts/learning/2026-09-30-taiwan-ai-course-map)；「已寫到哪裡」補上台大 ADL、林軒田、清大 NLP、政大生成式 AI 四個中文課系列。
- 2026-09-30（2）：新增[台大 AI／ML 課程地圖](/posts/learning/2026-09-30-ntu-ai-ml-course-map)為第六所學校；「已寫到哪裡」補上 Stanford CS231N、MIT 6.S184、CMU 11-868 與台大李宏毅 ML 2026 四個新系列。
- 2026-09-30：系列擴寫回填：Berkeley CS189 補上 Spring 2026 逐講與 HW1–5、CMU 07-380 補上第 1–10 講與 HW1–3、Harvard CS181 補齊 HW0–HW6、Stanford CS224U 補上 Spring 2023 版 16 篇，清單描述同步更新。
- 2026-09-29：Fall 2026 狀態稽核：Berkeley CS188 當期改為 fa26（`~cs188/` 已導向 fa26）、MIT 6.7960 課站已切 Fall 2026、CMU 11-785 F26 逐講上片中；新增 CMU 11-768 AI Agents 段落與導讀連結；「已寫到哪裡」補上 Stanford CS229／CS224N／CS224W／CS224V／CS124／CS230／CS329Z／CME295 與 Harvard CS181 系列；「還沒寫」清單修正為只剩 Harvard CS182。
- 2026-08-27（3）：新增 [CMU 07-380 Fall 2026 總覽](/posts/learning/2026-08-22-cmu-07380-fall-2026-overview)（首開 26 講 A2→A3 過渡版，Lec01 已公開，對照 07-280），「還沒寫」清單移除 07-380。
- 2026-08-27（2）：新增 [Berkeley CS189 Spring 2025 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)（HW1–7 A3，對照 Fall 2026 eecs189.org/fa26 27 講行事曆），「還沒寫」清單移除 CS189 與 MIT 6.7960／Harvard CS50 AI（後兩者已在 `ai`/`tech` 上線）；原 2026-08-27 條目保留。
- 2026-08-27：複核 Spring 2026 學期已結束：MIT 6.S191（3/30–5/25）、Stanford CS336（3/30–6/3）、Berkeley CS188 sp26（已封存，現為 su26）、CMU 11-785 S26（F26 已上線）皆改為「已結課」表述；CMU 07-280 Fall 2026 從「多數材料尚未發布」更新為 24 講／12 份作業／每週 checkpoint 皆已上線，並對應本站 07-280 逐講導讀；表格補上 Harvard 第五列並補齊 Stanford CS103／CS107／CS109／CS111／CS161 逐講完成狀態；07-380 改為「Fall 2026 首開」待稽核。
- 2026-08-26：查核後發現 MIT 6.S191、CMU 11-785、07-280、CS336、CS221 的導讀已在本站 `ai` 分類上線，把「還沒寫」清單修正為 6.7960、CS189 與 Harvard 三門課。
- 2026-08-26（稍早）：系列後續文章（四篇學校地圖、Harvard、CS188／CS285／CS288／10-301 導讀、CMU 改制與 Pacman 血統）已上線，補上內文連結，並把「接下來怎麼走」改寫為現況清單。

## 參考資料

### 本站系列文章

- [Stanford CS 課程導讀](/posts/learning/2026-08-20-stanford-cs-course-map)
- [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)
- [MIT AI／ML 課程導讀](/posts/learning/2026-08-21-mit-ai-ml-course-map)
- [Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
- [Harvard AI／ML 課程導讀](/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [台大 AI／ML 課程地圖](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
- [台灣其他學校 AI 公開課地圖](/posts/learning/2026-09-30-taiwan-ai-course-map)
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
- [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)
- [Harvard CS50 AI 導讀](/posts/ai/2026-08-26-harvard-cs50-ai-guide)（[逐週 W00–W06 與綜合篇](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)）
- [Berkeley CS189 導讀](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)
- [CMU 07-380 導讀](/posts/learning/2026-08-22-cmu-07380-fall-2026-overview)
- [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)
- [Stanford CS336 主題深拆系列](/posts/ai/2026-08-22-cs336-overview-tokenization)
- [Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- [CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)
- [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)
- [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)
- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)
- [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)
- [台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)
- [台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)
- [清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)
- [政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)
- [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)
- [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)
- [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)
- [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)
- [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)
- [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)

### 官方課程網站與外部資源

- [Stanford CS336 Spring 2026](https://cs336.stanford.edu/)（[YouTube 完整播放清單](https://www.youtube.com/watch?v=JuoVZkPBiKk&list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV)）
- [CMU 07-280 AI & ML I Fall 2026](https://www.cs.cmu.edu/~07280/)
- [CMU 07-380 AI & ML II Fall 2026](https://www.cs.cmu.edu/~07380/)
- [CMU 11-768 AI Agents Fall 2026](https://www.cmu-agents.com/)
- [Stanford CME295 Transformers & LLMs](https://cme295.stanford.edu/syllabus/)
- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)（[Fall 2026](https://deeplearning.cs.cmu.edu/F26/index.html) 已上線）／[Fall 2025](https://deeplearning.cs.cmu.edu/F25/index.html)
- [MIT 6.S191 Introduction to Deep Learning](https://introtodeeplearning.com/)（[2025 archive](https://introtodeeplearning.com/2025/index.html)）
- [MIT 6.7960 Deep Learning Fall 2026](https://deeplearning6-7960.github.io/)（Fall 2025 列於 Previous years）
- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)／[Fall 2026 當期](https://inst.eecs.berkeley.edu/~cs188/fa26/)
- [Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/)
- [CSDIY](https://csdiy.wiki/)
- [Stanford CS 253 Securing AI Systems（ExploreCourses）](https://explorecourses.stanford.edu/search?q=CS253)
- [CMU 15-783 Trustworthy AI Fall 2025](https://www.cs.cmu.edu/~aditirag/teaching/15-783F25.html)
- [CMU 17-739／18-739C ML for Cybersecurity（Lujo Bauer 教學頁）](https://users.ece.cmu.edu/~lbauer)
- [Berkeley CS 261 Spring 2026](https://people.eecs.berkeley.edu/~daw/teaching/cs261-s26/)
- [MIT 6.S976 Cryptography and Machine Learning](https://mlcrypto.mit.edu/course/)
- [中正大學 人工智慧安全（阮文齡）](https://sites.google.com/view/nvlinh/teaching-awards/ai-security)
- [Cagliari Machine Learning Security](https://unica-mlsec.github.io/mlsec/)
- [復旦 Trustworthy AI（馬興軍）](https://trust-ml.github.io/)
- [李宏毅 生成式AI導論 2024](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)
