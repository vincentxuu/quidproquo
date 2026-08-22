---
title: "Stanford CS329Z 導讀：先用 litellm 手刻一遍 agent，再讓 DSPy 把它收走"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 16
tldr: "CS329Z 是 Stanford 2026 年秋季新開的三學分 agent 工程課，第一份作業要求先用 litellm 從零刻出 RAG、工具呼叫與 ReAct 迴圈，再用 DSPy 把同一批元件重寫一次並交出對照。課程網站架在公開的 GitHub repo 上，commit 紀錄顯示 8 月中作業從三份砍成兩份，被砍掉的那份是「Data for Agents」。"
description: "Stanford CS329Z: Engineering AI Agents 完整導讀——授課者、先修、22 個上課時段與 49 篇閱讀的分組、兩份作業的實際內容、課程網站 git 紀錄裡的課綱變動，以及 CS329Z / CS329A / CS224V 三門 agent 課在 2026-27 學年的開課狀態與分工。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)

[CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) 是 Stanford 電腦科學系 2026 年秋季第一次開的三學分課。名字裡的關鍵字是 **Engineering**。它不是把最新的 agent 論文排成十週讀完，而是要學生把一套 agentic 系統從零做出來、量出來，然後在 Demo Day 上把它演一遍。

課程官網開宗明義給的框架是「compound AI systems」：由 LLM、檢索器、工具、優化器多個元件組成、彼此互動的系統。官網說這代表 AI 應用建構方式的一次根本改變。整學期的三條軸線寫在第一堂的描述裡——拆解（decomposition）、資料（data）、評估（evaluation）。

這篇對過三邊的一手資料：課程官網、它背後那個公開的 GitHub repo、以及 ExploreCourses。涵蓋這門課實際怎麼運作、作業長什麼樣、課綱在開學前一個月被改了什麼，以及它跟另外兩門也叫 agent 的 Stanford 課差在哪。**不包含**逐堂內容拆解——課程要到九月底才開始，講義一份都還沒放出來。

## 這門課的硬事實

授課者三位，都掛在課程官網的 Instructors 區塊。[Diyi Yang](https://cs.stanford.edu/~diyiy/) 是 Stanford CS 助理教授，研究主軸是 socially aware NLP 與人機互動，2024 年拿到 Sloan Research Fellowship。[Michael Ryan](https://michryan.com/) 是 Diyi Yang 與 Percy Liang 共同指導的博士生、Knight-Hennessy 學者，也是 [DSPy](https://dspy.ai/) 的核心貢獻者。[John Yang](https://john-b-yang.github.io/) 是 Ludwig Schmidt 與 Diyi Yang 指導的二年級博士生，SWE-agent 與 [SWE-smith](https://arxiv.org/abs/2504.21798) 的第一作者。

有一件事只有把兩個官方頁面擺在一起才看得出來：**註冊系統上的授課者只有兩位**。[ExploreCourses 的 CS329Z 條目](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog)列的是 Ryan, M. (PI) 與 Yang, D. (PI)，沒有 John Yang——而課程網站 repo 裡的每一個 commit 都是他推的。

其餘登記在案的資訊：三學分，Letter 或 Credit/No Credit 皆可。秋季學期實體授課，每週一三下午在 Packard 101 上課。班級代碼、學期起訖與期末考時段收在附錄。

先修條件寫在課程官網的 Logistics 區，四門課擇一：[CS224N](https://web.stanford.edu/class/cs224n/)、[CS224U](https://web.stanford.edu/class/cs224u/)、[CS224V](https://web.stanford.edu/class/cs224v/)、[CS336](https://stanford-cs336.github.io/)，或等同的 NLP 背景。**ExploreCourses 的條目裡完全沒有先修欄位**——只看註冊系統會以為這門課沒有門檻。

至於旁聽，課程官網沒有寫任何規定，也沒有 SCPD／Stanford Online 的對應頁面。這一項我查不到明確答案。

## 課程的主張：先手刻一遍，再讓框架把它收走

這門課最值得記的一句話，就寫在官網歡迎詞的第二段：

> Students first build core components (RAG, tool use, agent loops) from scratch, then learn how frameworks like DSPy abstract these patterns.

順序是刻意的，而且不只是口號——它被寫進了課表與作業的結構裡。RAG 排在第三堂，描述裡標了 hands-on「build a RAG pipeline from scratch」；工具呼叫排在第四堂，同樣標 hands-on。兩堂都在框架那一堂之前。[DSPy 論文](https://arxiv.org/abs/2310.03714)與 LangChain／LlamaIndex 的比較放在第五堂，主題直接叫「what frameworks abstract vs. what you built from scratch」。

這個安排解決的是一個很具體的問題：先學框架的人，通常說不出框架替他做掉了什麼。你會用 `dspy.ReAct`，但講不出 ReAct 迴圈裡哪一步是模型輸出、哪一步是你的程式碼在解析、失敗時是誰在重試。手刻過一次之後，抽象層才變成一個你能評價的東西，而不是一個你只能相信的東西。

**這條對自學者是可以照抄的**：不要從 `pip install` 開始學 agent。先用 [litellm](https://github.com/BerriAI/litellm) 這種只包薄薄一層的 SDK，把檢索、工具呼叫、迴圈控制自己寫一遍，跑起來之後再換框架重寫。課程的第一份作業就是照這個順序設計的，下面會講。

## DSPy 是這門課的落點，但它的作者已經不在 Stanford

DSPy 出自 Stanford NLP。[Omar Khattab](https://omarkhattab.com/) 在 Stanford 讀博（指導教授 Christopher Potts 與 Matei Zaharia），論文題目是 foundation model programming，DSPy 與 ColBERT 都是那條線的產物。但他[2025 年 7 月已經到 MIT EECS 任助理教授](https://www.eecs.mit.edu/people/omar-khattab/)，在那之前是 Databricks 的研究科學家。

所以「Stanford 的課教 Stanford 的框架」這句話今天只對一半。真正的連結在授課者這一端。Michael Ryan 是 [MIPROv2 論文](https://arxiv.org/abs/2406.11695)的共同第一作者，也是 [GEPA](https://arxiv.org/abs/2507.19457) 的共同作者。這兩篇都是 DSPy 的優化器論文，而且都排在 Optimization 那一堂的閱讀裡。教框架的人，就是寫了框架裡那幾支優化器的人。

DSPy 本身現在的狀態：[MIT 授權、持續發版](https://github.com/stanfordnlp/dspy)，官網首頁掛的最新版是 3.3.0。星數、貢獻者數與下載量收在附錄。

它解決的問題可以用官網那句標語概括——「Program, don't prompt」。把任務宣告成有型別的 signature，模組決定執行策略（`Predict`、`ChainOfThought`、`ReAct`），優化器再拿一個指標把提示詞自動編譯到收斂。

值得注意的是，這門課沒有把 DSPy 當成終點。第五堂的描述最後一句是「choosing the right level of abstraction」，同一堂還放了 LangChain／LangGraph 與 LlamaIndex。作業要求的也不是「改用 DSPy」，是「用 DSPy 重寫，然後說出它抽掉了什麼」。

## 三門都叫 agent，該修哪一門

這是很多人真正想問的問題。Stanford 現在同時有三門課掛著 agent，官方描述放在一起看，分工其實很清楚——而且 2026-27 學年的開課狀態差很多。

| 課號 | 官方定位（依官方描述） | 官方先修 | 形態 | 2026-27 學年狀態 |
|---|---|---|---|---|
| [CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) | 工程 compound AI systems：拆解問題、選元件、蒐集資料、建評估 | CS224N / CS224U / CS224V / CS336 擇一（只寫在課程官網） | 兩份作業 ＋ 季度專案 ＋ 論文影片 | 秋季開，一三 1:30–2:50 |
| [CS329A: Self-Improving AI Agents](https://cs329a.stanford.edu/) | 研究 seminar：讓模型透過與自己和環境互動持續改進 | CS224N 或 CS229S；Python 流利；有呼叫 LLM API 的經驗 | 讀論文 ＋ 原創研究專案 ＋ 客座 | ExploreCourses 顯示 **Last offered: Autumn 2025** |
| [CS224V: Agentic AI](https://web.stanford.edu/class/cs224v/) | 專案課：用 RAG 與形式化任務描述把幻覺壓到最低，做可用的領域 agent | LINGUIST 180/280、CS124、CS224N、CS224S、CS224U 擇一 | 兩份作業 ＋ 季度專案 | 秋季開，一三 3:00–4:20 |

三件從這張表讀出來、但單看任何一門的官網都看不到的事：

**CS329A 今年沒排。** 在[當前學年的 ExploreCourses 條目](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog)上，它不再有 Terms 欄位，取而代之的是一行 `Last offered: Autumn 2025`。切到上一個學年的分頁，才看得到它完整的秋季排課與助教名單。想修這門的人今年只能等，或者去看[本站的 CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)——它公開了九支錄影。

**CS329Z 與 CS224V 是連著的兩節課，不衝堂。** 一個下午一點半開始，另一個接在後面，同樣週一週三、同樣秋季學期。兩門都要交季度專案，所以同時修的代價不在課表上，在專案上。

**CS224V 今年換了課名。** 上一個學年它叫 *Conversational Virtual Assistants with Deep Learning*，這個學年的條目改成 *Agentic AI*。課程網站首頁到現在還掛著舊名。找資料時兩個名字都要試。

分工用一句話講：**CS329A 問「模型怎麼變強」，CS224V 問「這個領域的助理怎麼不說謊」，CS329Z 問「這套系統怎麼被工程化地做出來並量測」。** 另外還有一門 [CS329T](https://web.stanford.edu/class/cs329t/)，官方描述同樣是「building and evaluating agentic AI applications」，重心在把原型迭代成可靠系統；它的先修走的是 CS229／CS230 那條機器學習線，不是 NLP 線。

## 作業長什麼樣

兩份，各占一成，而且各自綁一場十分鐘的隨堂測驗。

**HW1: Build an Agentic System**（第 3 到 6 週）。給一批研究論文，要做出一個能回答科學問題的 agent。它明確拆成兩半：Part A 用 litellm 從零刻——RAG、工具呼叫、加上一個帶推理模式（例如 [ReAct](https://arxiv.org/abs/2210.03629)）的 agent 迴圈；Part B 用 DSPy 把關鍵元件重寫一次，並反思框架抽掉了什麼。**這是整門課的分水嶺**，因為課程的核心主張整個壓在這一份上。

**HW2: Evaluate an Agent**（第 6 到 9 週）。給一個做好的 agent，要設計一整套評估：程式判分器、至少一個 LLM-as-judge、依課程的四元組框架（request、environment、stopping criteria、scorer）建 benchmark 任務，加上錯誤分析。

作業之外還有兩件事。每個學生要錄一支十分鐘的論文影片，評分欄位寫得很細：選題與講解、你自己的批評或洞見、以及「added value」。官方替 added value 舉的例子包括重現一個結果、跑一個小實驗、跟另一個方法比較、或做一個實作示範。然後看三支別人的影片寫同儕回饋，官方要求「超過『講得很好』」，具體到一個優點、一個弱點或問題、一個可執行的建議。

季度專案占一半，主題被鎖死成 **Making Life at Stanford Better with Agents**。官方舉的四個例子是課綱閱讀器（把截止日期抽出來加進行事曆）、選課排程優化器、論文探索與摘要 agent、校園活動聚合推薦。對校外自學者來說，這一半是複製不了的——但把主題換成「讓我的工作日更好過」，作業結構完全可以照搬。

## 課程網站的 git 紀錄：開學前一個月改了什麼

課程官網 `cs329z.stanford.edu` 是一個 GitHub Pages 站，原始碼在[公開 repo `cs329z/cs329z.github.io`](https://github.com/cs329z/cs329z.github.io) 裡，用 Flask + Flask-FlatPages 產靜態頁，內容全在 `data/*.json` 與 `pages/*.md`。這代表課綱的每一次修改都留著 diff。

最有訊息量的是 8 月 16 日那個 commit，訊息一句話說完：`Two homeworks, add paper video, rebalance grading to 100%`。diff 顯示**被刪掉的是原本的 HW2**，原文是這樣寫的：

> **HW2: Data for Agents** (Weeks 6–8). Given a staff-provided agent, collect and curate data to optimize its performance — data selection, quality filtering, finding maximally informative examples, synthetic data generation, and building optimization data (SFT or preference pairs). Deliverable: a curated dataset, a data card, and an analysis.

課程沒有說明為什麼刪。可以確認的只有兩件事：資料那兩堂課還在課表上（第 11、12 堂，Data for Agentic Systems），現在沒有作業掛在它們後面；以及論文影片與同儕互評是在同一個 commit 裡補進來的，剛好補上被砍掉的那一成。

接下來三十小時內，評分表被連改四次。方向很一致：專案的比重一路往上加，最後定案時吃掉整整一半；作業與隨堂測驗則往下讓。原本叫 oral exam 的那兩場也在這輪改名成 HW-based quiz，權重跟著降。逐次的百分比變動收在附錄。

還有一個對不上的地方留在網站上。專案頁的里程碑寫著期中報告與期中 demo 在第六週、最終繳交在第十週，但截止日期表把期中那兩項排在第七週、最終繳交放到期末週。以截止日期表為準比較安全，因為它是後來才填上具體日期的那一份。

順帶一提，[ExploreCourses 的課程描述到今天仍然寫著 `three fully applied homework assignments`](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog)，跟課程官網的 `two` 對不上。同一所學校的兩個官方頁面對不上是常態，以課程官網為準。

## 自學者實際拿得到什麼

先講結論：**現在拿得到的只有課綱和閱讀清單，而閱讀清單意外地完整。**

**拿得到：整份閱讀清單，而且每一條都是可點的連結。** 指定閱讀加補充閱讀共 49 篇，大半指向 arXiv，其餘指向 [BAIR 那篇 compound AI systems 部落格文](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)、[MCP 規格](https://modelcontextprotocol.io/specification/2025-06-18)、[Anthropic 的 Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) 等公開頁面。沒有一條鎖在 Canvas 後面。

**拿得到：完整的評分表、作業描述與專案要求。** 你知道 HW1 要做什麼、HW2 要交什麼、報告要多長（正文一到兩頁，附錄放結構化內容例如 agent 的失敗模式範例），也知道每一項占幾分。

**拿得到：課程網站的原始碼與修改史。** 上一節那些課綱變動就是從這裡讀出來的。

**拿不到：講義。** 課表的「Course Material」欄目前只有閱讀連結，沒有任何投影片；網站上寫著「Lecture materials will be linked here as they are released」，repo 的 README 也把「Add lecture-material links as released」列在待辦清單裡。

**拿不到：錄影。** 課程官網沒有提到任何錄影安排。

**拿不到：作業的起始碼與評分器。** 官網沒有給任何 repo 連結。

**拿不到：兩場客座。** 課表上有兩格寫著「📺 Guest Lecture (TBA)」，講者到現在還沒公布。助教名單也還是空的——`data/staff.json` 裡的 `cas` 陣列是空的。

還有一件跟教材無關但值得看的東西：這門課的誠信條款花了一整段講怎麼用 AI 工具，語氣跟大多數學校的禁令很不一樣。

> This is a course about building with AI, so we expect you to use it. Treat generative AI tools as collaborators you think alongside — asking them to explain a concept, debug your code, or critique a design is fair game and encouraged. What isn't: soliciting finished answers or copying solutions.

配套是那兩場隨堂測驗：十分鐘、個人、閉書，要你解釋自己的設計決策與取捨。用 AI 幫你寫可以，但你得能當場說清楚你為什麼那樣寫。

## 怎麼開始

今晚就能做的一件事，就是把 HW1 的兩半自己跑一遍。

抓五到十篇你熟的領域論文當語料，用 litellm 寫一個最小的問答 agent：切塊、嵌入、檢索、一個 `search_papers` 工具、一個最多跑三輪的 ReAct 迴圈。跑得動之後，**不要優化它**，直接開新檔案用 `dspy.ReAct` 把同一個任務重寫一次，然後逐項寫下：重試邏輯現在誰在做、輸出解析誰在做、提示詞被誰改寫過。

那份對照清單就是這門課第五堂要教的東西，而你會在讀到它之前就先有答案。

## 附錄：數字與查證方式

- **登記在案的細節**：班級代碼 27855、Session 2026-2027 Autumn 1、學期區間 2026-09-22 至 2026-12-04、每週一三 1:30–2:50 p.m.、Packard 101、期末考時段 2026-12-09 3:30–6:30 p.m.（以上出自 ExploreCourses 與課程官網 Logistics 區）。
- **截止日期**：HW1 10/5 出、10/30 交；專案提案 10/9 交；HW2 10/26 出、11/20 交；期中 demo 11/4 在課堂上、期中報告 11/6 交；論文影片 11/13 交；同儕互評 11/30 交；最終繳交與系統 demo 在 12/7–12/11 的期末週，時間未定。皆為晚間 11:59（太平洋時間）。
- **課表規模**：`data/schedule.json` 裡共 22 個時段，扣掉兩格 TBA 客座、兩格感恩節停課、一格 Demo Day，實際有內容的講次 17 堂。指定閱讀 23 篇、補充閱讀 26 篇，合計 49 篇；去重後的 arXiv 連結 31 條。以上為 2026-08-21 抓取的版本。
- **評分表的演變**（皆出自公開 repo 的 commit diff，時間為 commit 的作者時區時間）：8/16 22:29 `Two homeworks, add paper video, rebalance grading to 100%`，專案 39%→35%、作業三份各 10%→兩份各 15%；8/17 09:38 `Grading updates`，改成巢狀清單；8/17 15:11 `Update grading breakdown`，專案 35%→50%、作業兩份各 15%→各 10%、oral exam 改名 HW-based quiz 且各 10%→7.5%；8/17 22:29 `Adjust project grading weights`，期中 demo 5%→7%、期末系統 demo 20%→18%；8/18 之後只有格式與 logistics 的更動。
- **學分數的更動**：8/18 的 `Some updates` 把 logistics 頁的 `Units: 3–4` 改成 `Units: 3`，同時補上班級代碼、時段與教室。ExploreCourses 上同樣是 3 學分。
- **ExploreCourses 的查法**：`https://explorecourses.stanford.edu/search?q=<課號>&view=catalog` 預設顯示當前學年（2026-2027）。CS329Z 在 2025-2026 與 2024-2025 兩個學年分頁都是 0 筆結果，因此判定為新課；CS329A 在當前學年顯示 `Last offered: Autumn 2025`，切到 2025-2026 才看得到排課。這個站需要帶 `jsenabled=1` cookie 才會回傳內容，直接抓會拿到一頁「Loading…」。
- **DSPy 的數字**：GitHub 星數約 37,400（2026-08-21 讀取），官網首頁自述 444 位以上貢獻者、每月 660 萬次以上下載、最新版 3.3.0，MIT 授權。這些是專案自己公布的數字。
- **未能確認**：這門課能不能旁聽（官網未提，也沒有 SCPD／Stanford Online 對應頁面）；助教名單；兩場客座的講者；作業起始碼是否會公開；Stanford Bulletin 是否已收錄 CS329Z 條目（其課程目錄是動態載入的前端應用，未能以一手方式確認）。

## 參考資料

- [Stanford CS329Z: Engineering AI Agents 課程官網](https://cs329z.stanford.edu/) — 授課者、課表、兩份作業內容、評分表、專案主題、先修與誠信條款的一手來源
- [cs329z/cs329z.github.io（課程網站原始碼與 commit 紀錄）](https://github.com/cs329z/cs329z.github.io) — 課綱變動、被刪掉的 HW2 原文、評分表演變、README 的待辦清單
- [ExploreCourses：CS329Z](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog) — 註冊系統版的課程描述（仍寫三份作業）、學分、班級代碼、上課時段、期末考時段、授課者名單
- [ExploreCourses：CS329A](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog) — 顯示 `Last offered: Autumn 2025`，證明 2026-27 學年未排課
- [ExploreCourses：CS224V](https://explorecourses.stanford.edu/search?q=CS224V&view=catalog) — 2026-27 秋季開課、3-4 學分、官方先修，以及課名從 Conversational Virtual Assistants 改成 Agentic AI
- [Stanford CS329A 課程官網](https://cs329a.stanford.edu/) — CS329A 的官方描述與 Autumn 2025 課表
- [Stanford CS224V 課程官網](https://web.stanford.edu/class/cs224v/) — CS224V 的課程主題、作業形態與 Fall 2025 資訊
- [Stanford CS329T 課程官網](https://web.stanford.edu/class/cs329t/) — 第四門 agent 相關課的官方描述與先修
- [Diyi Yang 個人頁](https://cs.stanford.edu/~diyiy/) — 職稱、研究方向、獲獎紀錄
- [Michael Ryan 個人頁](https://michryan.com/) — 指導教授、DSPy 核心貢獻者身分、MIPROv2 與 GEPA 的作者列
- [John Yang 個人頁](https://john-b-yang.github.io/) — 指導教授與研究方向
- [Omar Khattab 個人頁](https://omarkhattab.com/) — DSPy 與 ColBERT 的來歷、Stanford 博士與 MIT 教職
- [MIT EECS：Omar Khattab](https://www.eecs.mit.edu/people/omar-khattab/) — 2025 年加入 MIT 的官方紀錄
- [DSPy 官方文件](https://dspy.ai/) — 版本、貢獻者數、下載量、signature／module／optimizer 的官方說明
- [stanfordnlp/dspy GitHub repo](https://github.com/stanfordnlp/dspy) — 授權、星數、論文列表
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines](https://arxiv.org/abs/2310.03714) — 第五堂的指定閱讀
- [MIPROv2: Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs](https://arxiv.org/abs/2406.11695) — 第九堂的補充閱讀，Michael Ryan 共同第一作者
- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning](https://arxiv.org/abs/2507.19457) — 第九堂的指定閱讀
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — 第六堂的指定閱讀，也是 HW1 Part A 舉的推理模式
- [SWE-smith: Scaling Data for Software Engineering Agents](https://arxiv.org/abs/2504.21798) — 第 12 堂的指定閱讀，授課者 John Yang 的第一作者論文
- [The Shift from Models to Compound AI Systems（BAIR Blog）](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) — 第一堂的指定閱讀，課程主張的出處
- [Model Context Protocol 規格](https://modelcontextprotocol.io/specification/2025-06-18) — 第四堂的指定閱讀
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — 第二堂的指定閱讀
- [litellm](https://github.com/BerriAI/litellm) — HW1 Part A 指定使用的 SDK
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)
