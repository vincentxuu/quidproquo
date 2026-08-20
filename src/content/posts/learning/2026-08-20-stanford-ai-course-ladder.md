---
title: "Stanford AI 課程階梯：用先修關係排順序，順便查一下這門課還開不開"
date: 2026-08-20
category: learning
tags:
  - stanford
  - ai-course
  - learning-path
  - cs-course
  - llm
  - self-study
lang: zh-TW
type: guide
series:
  name: "Stanford CS 課程導讀"
  order: 2
tldr: "網路上的 Stanford AI 修課地圖大多按課號或印象排，但 Stanford 的 AI 課有官方先修鏈可查——CS221 的先修就明列 CS103、CS106B、CS109、CS161。這篇按先修關係排出從地基到研究級的階梯，並多做一件事：逐門查 ExploreCourses 的開課紀錄。結果是 CS324、CS329S、CS329D 的最後一次開課分別停在 2023、2022、2023，而熱門的 CS329A 停在 2025 秋，它指定的先修課 CS229S 自己也停在 2024 秋。"
description: "以 Stanford ExploreCourses 官方先修條件為依據，排出 CS221 到 CS336、CS329A 的 AI 修課階梯，涵蓋 NLP/LLM、視覺、強化學習與機器人、圖學四條分支，並附上每門課的最近開課紀錄與四條建議路線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-20-stanford-ai-course-ladder-en)

[上一篇](/posts/learning/2026-08-20-stanford-cs-course-map)排的是整個 Stanford CS 的公開課地圖，判準是「教材拿不拿得到」。這篇只處理 AI 那一線，判準換一個：**官方先修條件**。

換判準的理由是，AI 這一線的課多到光看課號會排錯。CS221 是 200 系列卻是入門課，CS124 是 100 系列卻要求你先修過 CS109 和接近 CS107 的程度。Stanford 官方自己也說過沒有標準編號系統，所以要排順序，就得去看每門課的 `Prerequisites` 欄位怎麼寫。

寫的過程中發現另一件更該先查的事，放在文章後半：**有些被廣泛引用的「進階 AI 課」已經好幾年沒開了。**

## 地基：CS221 的先修欄位直接寫死了四門

不必自己猜哪些課算基礎。CS221 的 ExploreCourses 條目把先修列成 CS103、CS106B、CS109、CS161，並補一句「我們強烈建議在修課前先熟悉這些概念」。這四門加上 CS106A 就是 AI 線的地基，上一篇已經逐門拆過。

值得單獨講的是 CS109。機率不是「有比較好」，它是後面每一門課的共用語言：CS224W 的先修是 CS109 加任一門入門 ML，CS234 要求基本機率，CS336 要求 CS109 等級的機率統計。**跳過 CS109 的代價不會在下一門課出現，會在你之後修的每一門課出現。**

CS107 的地位比較特別。它不在 CS221 的先修裡，但 CS124 的先修寫著「相當於 CS107 的程式成熟度與 UNIX 知識」，而 CS348K 直接要求 CS107。做 AI 工程而不只是讀模型的人，這門補得回本。

## 三個入口，建議至少走兩個

Stanford 的 AI 入門不是單一一門課，是三個方向不同的入口。

**CS221: Artificial Intelligence: Principles and Techniques** 是最標準的那個。它把 AI 定義成「在資訊不完整（所以需要機率）與計算有限（所以需要演算法）的情況下做出好決策」，涵蓋搜尋、約束滿足、賽局、馬可夫決策過程、圖模型、機器學習與邏輯。這是唯一一門會讓你看見「深度學習以外的 AI」的入門課。

**CS124: From Languages to Information** 是語言與資訊的入口，也是 NLP 線的正式起點。官方描述已經把方法從正規表達式、邏輯迴歸、梯度下降一路寫到 transformer 與大型語言模型，應用涵蓋聊天機器人、資訊檢索、社群運算與推薦系統。它的先修比課號看起來嚴格得多：CS106B、CS106A 等級的 Python、CS109，外加 CS107 等級的 UNIX 與程式成熟度。

**CS238: Decision Making under Uncertainty**（與 AA228 合開）是決策與不確定性的入口，走強化學習、規劃、自主系統的人從這裡進去最順。

## 主幹：CS229 與 CS230，中間可以插 CS228

過了入口就是建立模型能力的主幹。

**CS229** 是理論那一側，把統計假設攤開來推。**CS230** 是實作那一側，走翻轉教室，影片與程式作業在 Coursera 的深度學習專項課程上。兩門的關係不是二選一，是互補——上一篇提過 CS230 的核心教材反而是自學者最容易拿到的。

**CS228: Probabilistic Graphical Models** 補的是機率推理那條線：貝氏網路、馬可夫網路、隱藏馬可夫模型、動態貝氏網路、精確與近似推論。它的先修只寫「基本機率理論與演算法設計分析」，比大多數人以為的低，2026-27 學年冬季有開。

**CS229S: Systems for Machine Learning** 是想做基礎設施而不只做模型的人該修的，涵蓋資料準備、訓練、部署與推論在軟硬體堆疊各層的效率問題，先修是 CS224N 或 CS229。這門課有個狀況要注意，下一節會講。

**怎麼做**：如果你不確定自己該從 CS229 還是 CS230 開始，去讀 CS229 的公開講義 PDF 第一章，讀不動就先修 CS230。這比任何自我評估都準。

## 四條分支

### NLP / LLM / Agent

這條線的先修鏈是四條分支裡最完整的，可以一路串到底。

| 課號 | 課名 | 官方先修 |
|---|---|---|
| CS124 | From Languages to Information | CS106B、Python、CS109、CS107 等級 |
| CS224N | Natural Language Processing with Deep Learning | 微積分與線性代數；CS124、CS221 或 CS229 |
| CS224U | Natural Language Understanding | CS224N 或 CS224S |
| CS224V | Agentic AI | LINGUIST 180/280、CS124、CS224N、CS224S、CS224U 擇一 |
| CS329X | Human Centered NLP | — |
| CS329A | Self-Improving AI Agents | CS224N 或 CS229S |
| CS336 | Language Modeling from Scratch | Python、PyTorch、系統概念、微積分與線性代數、CS109 等級機率 |

**CS224V 現在叫 Agentic AI**，這是 2026 年才有的名字。課程內容直接處理 RAG 與形式化任務描述、跨資料庫與知識庫的混合推理、AI 驅動的科學知識探索、用形式方法提升決策 agent 的準確度與可解釋性、以及長時程 agent 的效率。想做 agent 又想要有正課可上的人，這門的優先序被低估了。

**CS329X: Human Centered NLP** 談的是人本設計、human-in-the-loop、公平性與可及性。這門課容易被當成軟性選修跳過，但它處理的正是把模型變成產品時最先炸開的那一類問題。

### 視覺

**CS231A: Computer Vision** 講的是相機與投影模型、濾波與邊緣偵測、分割與分群、立體重建、物體與場景辨識。它的舊課號是 CS223B，先修只要線性代數與基本機率統計。**CS231N: Deep Learning for Computer Vision** 才是深度學習那一側——順帶一提，它的課名已經不是很多整理裡寫的「Convolutional Neural Networks for Visual Recognition」，那是舊名字。

順序上，先有 CS229 或 CS230 的模型基礎再進 CS231N 會順很多，CS231A 則可以並行或之後補。

### 強化學習與機器人

`CS221 → CS238 → CS234 → CS223A → CS333`。

**CS234: Reinforcement Learning** 的先修寫得很直接：Python 熟練、CS229 或同等、線性代數、基本機率。**CS223A** 是機器人的基礎課，由 Oussama Khatib 授課。**CS333** 是專案導向的研究所課，把機器人、機器學習與控制理論拉到人機互動的場景，官方只寫「建議修過 AI 入門課」。

### 圖與網路

**CS224W: Machine Learning with Graphs** 的先修是 CS109 加任一門入門機器學習，門檻在這一階裡算低的。內容涵蓋表示學習與圖神經網路、Web 演算法、知識圖譜推理、影響力最大化、社群網路分析。

## 最高階：研究級的那一層

這一層的共同點不是「再教一次模型」，是要求你能做研究、建系統，或從零把整條流程走完。

**CS336: Language Modeling from Scratch** 是唯一標注 **Application required**（需要申請）的一門。內容從資料收集與清理、transformer 建構、訓練到評估，全部自己做過一遍。

**CS312** 走的是另一條路：它主張光有知識與數學能力不夠，發明下一代架構需要的是跑過非常多次實驗，所以整門課帶學生在可計算的領域裡練「高效實驗與預測實驗結果」的能力。授課的是 Tatsunori Hashimoto——也就是 CS336 的講師之一。

**CS329A: Self-Improving AI Agents** 是研究所研討課，主題涵蓋 constitutional AI、學習型驗證器、擴展測試時計算、把搜尋與 LLM 結合、工具使用與檢索、多模態網頁互動、多步推理與規劃，以及評估與編排框架。九講的錄影已經公開在 Stanford Online 的 YouTube 頻道上。

**CS329Z: Engineering AI Agents** 教的是複合式 AI 系統：學生先從零手刻 RAG、工具使用、agent loop 這些核心元件，再學 DSPy 這類框架怎麼把這些模式抽象掉。2026-27 學年秋季有開。

安全與可靠性那一組是這一層裡最值得注意的變化，因為它們已經不是外圍：**CS221M: Mechanistic Interpretability** 講探測、steering、因果抽象與稀疏自編碼器，特別強調因果方法與大型語言模型；**CS329H: Machine Learning from Human Preferences** 處理偏好異質性、偏好聚合、人類回饋的詮釋與隱私；**CS329T** 則從基礎模型、prompting、RAG 講到 agent 架構與評估。這三門在 2026-27 學年都有開。

## 先查有沒有開，再查先修

這節是整篇最實用的部分，也是我把資料逐門對過 ExploreCourses 之後最意外的發現。

網路上（包括餵給我的那份整理）常把一批進階 AI 課列成「本學年有開」。實際查下來，其中四門的最後一次開課紀錄是這樣：

| 課號 | 課名 | ExploreCourses 上的最後一次開課 |
|---|---|---|
| CS329S | Machine Learning Systems Design | 2022 冬 |
| CS324 | Advances in Foundation Models | 2023 冬 |
| CS329D | Machine Learning Under Distributional Shifts | 2023 春 |
| CS229S | Systems for Machine Learning | 2024 秋 |
| CS329A | Self-Improving AI Agents | 2025 秋 |

這裡面藏了一個小小的死結：**CS329A 指定的先修是 CS224N 或 CS229S，而 CS229S 自己已經兩年沒開。** 對校內學生來說這只是「走 CS224N 那條」，但對照著網路整理排計畫的自學者來說，這種細節就是計畫報廢的來源。

停開不等於材料沒用。CS324 的課程網站與 CS329A 的九講錄影都還在，內容也還沒過時到不能讀。但**「這門課還開不開」和「這門課的材料還能不能學」是兩個問題，混在一起就會排出一份修不到的課表。**

**怎麼做**：在 ExploreCourses 搜任何一個課號，看它顯示的是「2026-2027 Autumn/Winter/Spring」還是「Last offered: ⋯⋯」。前者代表這學年真的有開，後者就是停開，數字告訴你停了多久。這一步花不到十秒，可以省下整份計畫。

## 四條路線

**通用 AI 研究線**：地基四門 → CS221 → CS229 → CS230 → CS228 → 挑一條分支 → CS312 或 CS221M。這條最像先打全科底再走研究導向。

**NLP / LLM / Agent 線**：地基四門 → CS124 → CS221 → CS229 → CS224N → CS224U 或 CS224V → CS329X → CS329Z → CS336。衝 LLM、RAG、工具使用、AI agent 的人走這條最順，而且每一步都有官方先修關係撐著。

**視覺線**：地基四門 → CS229 → CS230 → CS231A → CS231N。

**強化學習與機器人線**：地基四門 → CS221 → CS238 → CS234 → CS223A → CS333。

最後一句提醒，跟上一篇的結論一樣但這裡更重要：**不要把 CS329A、CS329Z、CS336 當第一站。** 從先修結構看，這些課預設你已經有機器學習、深度學習、NLP 或 LLM、以及系統與評估的底子。CS336 甚至要申請才修得到。地基那四門看起來離 AI 很遠，但它們是唯一沒有捷徑的部分。

## 附錄：本文的查證方式與數字

課程資訊來自 2026-08-20 當天的 Stanford ExploreCourses 2026-2027 學年條目，先修條件與開課紀錄都以該頁面顯示的內容為準，不採信二手整理。

- **CS221 官方先修**：CS103（或 CS103B/X）、CS106B（或 CS106X）、CS109、CS161。
- **學分數**：CS221M、CS329H、CS329X、CS329T、CS329Z 各 3 學分；CS224V 3–4；CS224W 3–4；CS228 3–4；CS231A 3–4；CS234 3；CS312 3–5；CS336 3–5。
- **2026-27 學年有開的進階課**：CS221M（春）、CS224V（秋）、CS224W（秋）、CS224U（春）、CS228（冬）、CS231A（冬）、CS223A（冬）、CS329H（秋）、CS329T（春）、CS329X（秋）、CS329Z（秋）、CS312（秋）、CS336（春，需申請）、CS333（冬）、CS224N（冬）。
- **CS224N 授課者**：Tatsunori Hashimoto 與 Diyi Yang，與 LINGUIST 284 合開。
- **CS231A 舊課號**：CS223B。

有兩項標記為未能完全確認：CS312 的課程名稱在 ExploreCourses 的搜尋結果中沒有完整渲染出標題列，但以「Deep Learning Alchemy」為關鍵字搜尋會命中該條目；CS238 的獨立條目同樣沒有渲染成功，其存在與 AA228 的合開關係是從 CS239 的先修欄位「AA 228/CS 238 or CS 221」反推的。這兩項不影響階梯的排序結論。

## 參考資料

- [Stanford Explore Courses](https://explorecourses.stanford.edu/) — 本文所有先修條件、學分數與開課紀錄的來源
- [CS 221: Artificial Intelligence: Principles and Techniques](https://explorecourses.stanford.edu/search?q=Artificial+Intelligence+Principles+and+Techniques&view=catalog) — 四門先修課的官方明列
- [CS 124: From Languages to Information](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — 從正規表達式到大型語言模型的課程描述與先修
- [CS 224N: Natural Language Processing with Deep Learning](https://explorecourses.stanford.edu/search?q=Natural+Language+Processing+with+Deep+Learning&view=catalog) — 2026-27 冬季開課與先修
- [CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — 先修 CS224N 或 CS224S
- [CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — 更名後的課程描述與先修清單
- [CS 224W: Machine Learning with Graphs](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — 先修 CS109 加任一入門 ML
- [CS 228: Probabilistic Graphical Models](https://explorecourses.stanford.edu/search?q=Probabilistic+Graphical+Models&view=catalog) — 課程範圍與先修
- [CS 229S: Systems for Machine Learning](https://explorecourses.stanford.edu/search?q=CS+229S&view=catalog) — 課程描述與「最後一次開課：2024 秋」
- [CS 231A: Computer Vision](https://explorecourses.stanford.edu/search?q=CS+231A&view=catalog) — 舊課號 CS223B 與先修
- [CS 234: Reinforcement Learning](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — 先修與課程範圍
- [CS 312](https://explorecourses.stanford.edu/search?q=Deep+Learning+Alchemy&view=catalog) — 以實驗取得掌握度的課程立場與授課者
- [CS 324: Advances in Foundation Models](https://explorecourses.stanford.edu/search?q=CS+324&view=catalog) — 課程描述與「最後一次開課：2023 冬」
- [CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — 完整主題清單、先修 CS224N 或 CS229S、「最後一次開課：2025 秋」
- [CS 329D: Machine Learning Under Distributional Shifts](https://explorecourses.stanford.edu/search?q=CS+329D&view=catalog) — 「最後一次開課：2023 春」
- [CS 329H: Machine Learning from Human Preferences](https://explorecourses.stanford.edu/search?q=CS+329H&view=catalog) — 課程描述與 2026-27 秋季開課
- [CS 329S: Machine Learning Systems Design](https://explorecourses.stanford.edu/search?q=CS+329S&view=catalog) — 「最後一次開課：2022 冬」
- [CS 329T](https://explorecourses.stanford.edu/search?q=CS+329T&view=catalog) — 先修 CS229 等級 ML 加深度學習
- [CS 329X: Human Centered NLP](https://explorecourses.stanford.edu/search?q=CS+329X&view=catalog) — 課程描述與 2026-27 秋季開課
- [CS 329Z: Engineering AI Agents](https://explorecourses.stanford.edu/search?q=Engineering+AI+Agents&view=catalog) — 複合式 AI 系統與 DSPy 的課程描述
- [CS 333](https://explorecourses.stanford.edu/search?q=CS+333&view=catalog) — 人機互動場景的專案導向課程
- [CS 336: Language Modeling from Scratch](https://explorecourses.stanford.edu/search?q=Language+Modeling+from+Scratch&view=catalog) — 需申請的標注與 2026-27 春季開課
- [CS336 課程網站](https://cs336.stanford.edu) — 講次、作業與先修條件原文
- [CS229 講義 PDF](https://cs229.stanford.edu/main_notes.pdf) — 用來自我評估的第一章
- [Stanford CS329A Self-Improving AI Agents, Part 1（YouTube）](https://www.youtube.com/watch?v=6YnLB0XbTnI) — 公開的九講錄影
- 站內延伸：[Stanford CS 課程導讀](/posts/learning/2026-08-20-stanford-cs-course-map)、[CS230 導讀系列](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)、[CS146S 兩版大綱對照](/posts/ai/2026-08-16-cs146s-course-map)
