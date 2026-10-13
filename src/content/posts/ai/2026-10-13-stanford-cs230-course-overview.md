---
title: "深度學習：翻轉教室怎麼排，九堂實體課怎麼讀｜Stanford CS230 課程總覽"
date: 2026-10-13
category: ai
type: guide
tags: [stanford-cs230, deep-learning, ai-course, stanford, course-guide]
lang: zh-TW
series:
  name: "Stanford CS230 導讀"
  order: 0
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 10
tldr: "CS230 是 Andrew Ng 與 Kian Katanforoosh 在 Stanford 教的深度學習課，採翻轉教室：神經網路、最佳化、CNN、序列模型與 Transformer 的基礎放在 Coursera 的五門線上課，每週一堂實體課講專案方法、對抗攻擊與生成模型、強化學習、LLM 應用與可解釋性。九堂實體課的錄影、多數投影片與兩份附解答的期中練習考公開；Stanford 專用的 Coursera 場次、助教課錄影與專案指導拿不到。"
description: "Stanford CS230: Deep Learning 系列總覽：依官方首頁、課表、專案頁、助教課頁與 Stanford Online 播放清單，整理翻轉教室的組成、先修、評分與 AI 工具政策、實體課和 Coursera 線上模組的逐週對應、校外讀者拿得到什麼，以及兩條閱讀路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-13-stanford-cs230-course-overview-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：課表、評分與政策依據官方網站 2026-10-13 的內容，頁面上掛的是 2025 年秋季課表。公開錄影是同一輪的九堂實體課。本文是 [Stanford CS230 導讀](/series/cs230)系列的第 0 篇，也是入口。

[CS230: Deep Learning](https://cs230.stanford.edu/) 由 Andrew Ng 與 Kian Katanforoosh 授課，每週二上午一堂實體課。官網對課程的描述是：學深度學習的基礎、怎麼建神經網路、怎麼帶一個機器學習專案做到成功，點名的內容包括卷積網路、RNN、LSTM、Adam、Dropout、BatchNorm、Xavier／He 初始化。

這篇回答五個問題：這門課由哪幾塊組成、要先會什麼、分數怎麼算、校外讀者拿得到什麼、九堂實體課要照什麼順序讀。

## 這門課由哪幾塊組成

CS230 是翻轉教室。基礎內容不在教室裡講，學生在家看線上影片、做測驗和程式作業；教室時間留給線上影片沒有深入處理的進階主題與業界客座。官網列的組成有五項：

| 組成 | 內容 | 頻率 |
|---|---|---|
| 線上模組 | DeepLearning.AI 的 [Deep Learning Specialization](https://www.deeplearning.ai/courses/deep-learning-specialization/) 全部五門課：影片、測驗、程式作業 | 每週約兩個模組 |
| 實體課 | 進階主題或客座演講 | 每週二一堂 |
| 助教課 | 專案實作技巧與理論補充 | 每週五一堂 |
| 期中考 | 三小時紙筆考，涵蓋學期前半 | 一次 |
| 期末專案 | 提案、期中進度、期末報告、海報展 | 整學期 |

一個線上模組等於 Coursera 課程裡的一「週」：大約十支各十分鐘的影片、一份 10 到 30 分鐘的測驗、一份約兩小時的程式作業。

所以讀這門課要先分清楚兩條線。**線上模組教的是深度學習的基本功**，從 logistic regression、反向傳播、初始化與正則化，到 CNN、RNN、attention 與 Transformer。**實體課教的是基本功之外的東西**：怎麼判斷專案卡在哪、模型為什麼會被騙、RLHF 放在強化學習的哪個位置、LLM 應用該疊到哪一層。本系列導讀的是後者。

## 先修

官網列了四項，並提供 Workera 的自我評量給選課學生：

| 先修 | 官方寫法 | 站內對應 |
|---|---|---|
| 機率 | 熟悉機率論（CS 109 或 STATS 116） | [CS109 課程總覽](/posts/learning/2026-08-21-stanford-cs109-probability) |
| 統計 | 熟悉基本統計與資料科學 | [CS109 課程總覽](/posts/learning/2026-08-21-stanford-cs109-probability)（後半涵蓋推論與估計） |
| 線性代數 | 熟悉線性代數（MATH 51） | [Harvard CS181 作業 0](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)（四題自測線代與微積分） |
| 程式 | 懂基本的電腦科學原理，能寫出有一定規模的程式 | — |

清單裡沒有機器學習課。線上模組從 logistic regression 講起，不預設你修過 [CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning)。

自我檢查可以用這一題：給你一個單層的 logistic regression，輸入是向量 x，輸出是 sigmoid(w·x + b)，損失是交叉熵。你能不能手推出損失對 w 的梯度？答案是：對單筆樣本，∂L/∂w = (ŷ − y)x，也就是預測誤差這個純量乘上輸入向量。推得出來，線上課程第一門的前兩個模組就不會卡住；推不出來，先讀 [CS229 第 8 堂的反向傳播導讀](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation)補鏈鎖律與向量微分再開始。

## 評分與 AI 工具政策

| 項目 | 比重 |
|---|---|
| 期末專案 | 45%（提案 2%、期中進度 7%、期末報告 30%、海報展 6%） |
| 期中考 | 35% |
| 程式作業 | 12% |
| 測驗 | 8% |

程式作業與測驗只看有沒有完成，不看分數。合起來兩成的分數是「做完就有」，其餘八成在專案與那場三小時的紙筆考。

遲交規則是每人六天免罰額度，單一作業最多晚三天；額度用完後每多一天扣學期總成績 2%。期末報告、海報與考試不收遲交。

AI 工具分兩種情況寫。作業可以把生成式 AI 當協作者，但不能直接要答案或照抄，而且要註明用了它。專案報告可以用 Claude Code、Codex 這類工具寫程式、除錯、找文獻、潤稿，但核心分析、結果詮釋與結論要自己寫；報告最後必須附一段 AI 使用揭露，列出用了哪些工具、各自做了什麼，這一段不算在頁數限制內。捏造的引用、站不住腳的主張、沒驗證的程式與沒查核的 AI 內容都可能被扣分。

## 實體課與線上模組的對應

官方課表把每一堂實體課和「上課前要完成的線上模組」排在同一列。模組代號的讀法：C1M2 是第一門課的第二個模組。

| 實體課 | 主題 | 上課前完成的線上模組 | 本站導讀 |
|---|---|---|---|
| 第 1 堂 | 課程介紹 | 無 | [Introduction to Deep Learning](/posts/ai/2026-08-16-cs230-when-prompting-stops-working) |
| 第 2 堂 | 用案例講監督、自監督與弱監督學習 | C1M1 深度學習導論、C1M2 神經網路基礎 | [Supervised, Self-Supervised & Weakly Supervised Learning](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained) |
| 第 3 堂 | 深度學習專案的完整週期 | C1M3 淺層網路、C1M4 深層網路 | [Full Cycle of a DL Project](/posts/ai/2026-08-16-cs230-full-cycle-dl-project) |
| 第 4 堂 | 對抗穩健性與生成模型 | C2M1 實務面、C2M2 最佳化演算法 | [Adversarial Robustness and Generative Models](/posts/ai/2026-08-16-cs230-adversarial-and-generative) |
| 第 5 堂 | 深度強化學習 | C2M3 超參數與 BatchNorm、C3M1–M2 專案策略 | [Deep Reinforcement Learning](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf) |
| 第 6 堂 | AI 專案策略 | C4M1 卷積網路基礎、C4M2 深層卷積模型 | [AI Project Strategy](/posts/ai/2026-08-16-cs230-ai-project-strategy) |
| （第 7 堂停課） | — | C4M3–M4 卷積網路應用 | — |
| 第 8 堂 | Agents、Prompts 與 RAG | C5M1 RNN | [Agents, Prompts, and RAG](/posts/ai/2026-08-16-cs230-agents-prompts-rag) |
| 第 9 堂 | AI 職涯建議與客座 | C5M2 詞嵌入、C5M3 序列到序列模型 | [Career Advice in AI](/posts/career/2026-08-16-cs230-career-advice-in-ai) |
| 第 10 堂 | 模型內部在做什麼 | C5M4 Transformer | [What's Going On Inside My Model?](/posts/ai/2026-08-16-cs230-inside-the-model) |

第 7 堂那一週是 Democracy Day 停課，課表把期中考列在同一天（日期欄的年份誤植成 2026），所以公開錄影的編號從 6 跳到 8。

對照課表與錄影時有三處會對不上，都以錄影為準：

- 第 2 堂在課表上叫「Key AI Concepts Through Case Studies」，錄影標題是「Supervised, Self-Supervised, & Weakly Supervised Learning」，是同一堂。
- 第 6 堂在課表上列的是職涯建議與讀論文，還連到前一年的投影片；實際錄影講的是 AI 專案策略。職涯那一堂是第 9 堂。
- 第 8 堂在課表上叫「Beyond the model: Enhancing LLM applications」，錄影標題是「Agents, Prompts, and RAG」。

這張表也說明實體課為什麼可以跳著看。第 4 堂講對抗攻擊時，學生才剛學完初始化與最佳化；第 5 堂講強化學習時，CNN 還沒教。從這個排法推斷，實體課的主題大多不依賴當週的線上模組，彼此也大多獨立。課表上標出的例外只有一處：第 2 堂那一列註明，先看 C2M3 的 Batch Normalization 影片會有幫助。

## 校外讀者拿得到什麼

**拿得到：**

- **九堂實體課的錄影。** Stanford Online 的 [YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X)收了第 1 到 6 堂與第 8 到 10 堂，每堂一到兩小時。
- **多數實體課的投影片。** 官方課表上，第 2、4、5、8、9、10 堂掛著當屆的 PDF，不用登入（檔名的編號比堂次少一，第 8 堂的檔案叫 lecture_7.pdf）。第 1 堂與第 6 堂連到的是前一年的檔案，第 3 堂沒有掛投影片。
- **線上模組的投影片。** 課表上每個模組旁邊都有 PDF，從 C1M1 到 C5M4。
- **線上課程本身。** 官方課表上五門課的連結直接指向 Coursera 的公開課程頁，校外讀者可以自己註冊 Deep Learning Specialization。費用與旁聽條件以 Coursera 頁面為準。
- **專案資源。** [專案頁](https://cs230.stanford.edu/project/)公開了專案說明、歷屆專案，以及助教整理的[程式範例 repo](https://github.com/cs230-stanford/cs230-code-examples)（電腦視覺與自然語言處理各一個，TensorFlow 與 PyTorch 兩種版本）。專案頁有一條限制值得先知道：只對 LLM 下 prompt、沒有額外訓練，不算合格的專案。
- **助教課的主題與講義頁。** [助教課頁](https://cs230.stanford.edu/section/)列了九次的題目，從專案起步、反向傳播、初始化與正則化，到除錯、評估指標與報告寫作。
- **期中考的複習材料。** [第 6 次助教課的頁面](https://cs230.stanford.edu/section/6/)掛著兩年的複習投影片，以及兩份練習考和各自的解答，不用登入。

**拿不到：**

- **當屆的正式考卷與複習課錄影。** 公開的只有上面那兩份練習考。
- **Stanford 專用的 Coursera 場次。** 選課學生用學校信箱收邀請，測驗與程式作業的期限跟著 Stanford 課表走。校外讀者只能自己註冊公開版本。
- **助教課的錄影**，放在 Canvas。
- **專案的評分與指導。** 提案、進度與報告交在 Gradescope，課表另外排了兩次跟助教的專案會議，這些都只給選課學生。

官網另外留了一張旁聽申請表，但沒有寫明申請條件與核准後能看到什麼。

## 兩條讀法

**完整路線：線上模組加實體課。** 照上面那張表一列一列走：先做完該列的線上模組，再讀那一堂的導讀或看錄影。這樣十週下來，基本功與判斷力兩條線都有。期末專案沒有人評分。專案頁目前只公開提案的要求，期中進度、期末報告與海報三項都還寫著待公布；報告怎麼寫可以看[第 9 次助教課](https://cs230.stanford.edu/section/9/)的材料。期中考前把兩份練習考各做一遍、對解答，是校外讀者唯一拿得到的客觀檢查。

**只讀實體課：依目的挑。** 已經會訓練模型的人，可以把九堂當成獨立的專題：

- 想把專案帶好：[第 3 堂](/posts/ai/2026-08-16-cs230-full-cycle-dl-project)和[第 6 堂](/posts/ai/2026-08-16-cs230-ai-project-strategy)。兩堂都在教同一件事的不同階段：先用最快的速度跑出一個能看的版本，再用錯誤分析決定下一步改哪裡。
- 想知道 embedding 是怎麼訓練出來的：[第 2 堂](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained)。
- 做 LLM 應用：[第 8 堂](/posts/ai/2026-08-16-cs230-agents-prompts-rag)，再往下接[第 5 堂](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf)最後講 RLHF 的那一段。
- 關心模型安全與可解釋性：[第 4 堂](/posts/ai/2026-08-16-cs230-adversarial-and-generative)和[第 10 堂](/posts/ai/2026-08-16-cs230-inside-the-model)。
- 在想職涯：[第 1 堂](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)後半和[第 9 堂](/posts/career/2026-08-16-cs230-career-advice-in-ai)。

怎麼判斷自己該走哪一條：看 Deep Learning Specialization 第二門課前兩個模組的四份程式作業：初始化、正則化、梯度檢查、最佳化。四份都能不查資料說出在做什麼、為什麼需要，就走第二條；說不出來，走第一條。判準舉例：說得出初始化不當會讓梯度消失或爆炸、梯度檢查是拿數值差分對照反向傳播算出的梯度，才算說得出來。

## 今晚可以做的事

1. 打開[官方課表](https://cs230.stanford.edu/syllabus/)，下載 C1M1 與 C1M2 的投影片，確認上面的先修自我檢查題推得出來。
2. 看[第 1 堂錄影](https://www.youtube.com/watch?v=_NLHFoVNlbg)，一小時，沒有數學，配[本系列第 1 堂導讀](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)。
3. 從上面「只讀實體課」的清單挑一個目的，把對應那一堂排進這週。

## 延伸閱讀

- [Stanford CS229 課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：Stanford 的機器學習課，數學推導比 CS230 多。
- [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)：CS230 在主線課程裡的位置。

**系列導覽**：下一篇 [Introduction to Deep Learning：光靠 prompt 走不遠的那兩個時刻](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)

## 課程影片來源

下方提供官方課程與錄影入口。公開播放清單是九堂實體課的錄影，各堂的單支影片嵌在對應的導讀裡；本文是總覽，不嵌入單支影片。官網的 [Lecture 頁](https://cs230.stanford.edu/lecture/)另外連到一份 2018 年秋季的舊播放清單，並註明當屆錄影放在 Canvas、只給選課學生。

課程與錄影入口：

- [Stanford CS230 Autumn 2025 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X)
- [官方課程／講次來源](https://cs230.stanford.edu/syllabus/)

查核日期：2026-10-13。

## 更新紀錄

- 2026-10-13：新增課程總覽，作為系列入口。

## 參考資料

- [CS230 課程首頁](https://cs230.stanford.edu/) — 課程描述、翻轉教室組成、先修、評分比重、遲交規則、榮譽準則與 AI 工具政策
- [CS230 官方課表](https://cs230.stanford.edu/syllabus/) — 各堂日期與主題、線上模組對應、投影片連結、期中考與專案期限
- [CS230 專案頁](https://cs230.stanford.edu/project/) — 專案類型、起步資源與交付項目
- [CS230 助教課頁](https://cs230.stanford.edu/section/) — 九次助教課的主題
- [CS230 第 6 次助教課](https://cs230.stanford.edu/section/6/) — 期中複習投影片、兩份練習考與解答
- [CS230 Lecture 頁](https://cs230.stanford.edu/lecture/) — 當屆錄影放在 Canvas 的說明與 2018 年秋季舊播放清單
- [Stanford CS230 Autumn 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — Stanford Online，九堂實體課錄影
- [Deep Learning Specialization](https://www.deeplearning.ai/courses/deep-learning-specialization/) — DeepLearning.AI，線上模組所屬的五門課
- [cs230-code-examples](https://github.com/cs230-stanford/cs230-code-examples) — 助教整理的專案程式範例
