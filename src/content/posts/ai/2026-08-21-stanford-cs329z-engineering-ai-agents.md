---
title: "Stanford CS329Z 導讀：不准用框架，只給你一個 chat-completion 呼叫，從零長出 agent harness"
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
tldr: "CS329Z 是 Stanford 2026 年秋季新開的三學分 agent 工程課。第一份作業禁用任何 agent 框架，只准用一個 chat-completion 呼叫加自己的程式碼，在真實企業 email 封存上從 RAG 管線一路長成帶工具、終端機、記憶與人類審核的 agent harness。DSPy 還在課堂上，但已經不在作業裡。課程網站架在公開的 GitHub repo 上，commit 紀錄留下了每一次課綱改版：作業從三份砍成兩份，互評長成兩成分數，專案主題也從鎖死改成自選。"
description: "Stanford CS329Z: Engineering AI Agents 完整導讀——授課者與助教、先修與算力補助、22 個上課時段與 50 篇閱讀、已公開的前兩堂投影片、兩份作業與專案的實際要求、課程網站 git 紀錄裡的課綱變動，以及 CS329Z / CS329A / CS224V 三門 agent 課在 2026-27 學年的開課狀態與分工。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)

[CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) 是 Stanford 電腦科學系 2026 年秋季第一次開的三學分課。名字裡的關鍵字是 **Engineering**。它不是把最新的 agent 論文排成十週讀完，而是要學生把一套 agentic 系統從零做出來、量出來，然後在 Demo Day 上把它演一遍。

課程官網開宗明義給的框架是「compound AI systems」：由 LLM、檢索器、工具、優化器多個元件組成、彼此互動的系統。官網說這代表 AI 應用建構方式的一次根本改變。整學期的三條軸線寫在第一堂的描述裡——拆解（decomposition）、資料（data）、評估（evaluation）。

這篇對過四邊的一手資料：課程官網、它背後那個公開的 GitHub repo、ExploreCourses，以及已經公開的前兩堂投影片。涵蓋這門課實際怎麼運作、作業長什麼樣、課綱在開學前後被改了什麼，以及它跟另外兩門也叫 agent 的 Stanford 課差在哪。**不包含**逐堂內容拆解——課程 9 月 23 日才開始，逐週內容由[系列的週導讀](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)接手。

## 這門課的硬事實

授課者三位，都掛在課程官網的 Instructors 區塊。[Diyi Yang](https://cs.stanford.edu/~diyiy/) 是 Stanford CS 助理教授，研究主軸是 socially aware NLP 與人機互動，2024 年拿到 Sloan Research Fellowship。[Michael Ryan](https://michryan.com/) 是 Diyi Yang 與 Percy Liang 共同指導的博士生、Knight-Hennessy 學者，也是 [DSPy](https://dspy.ai/) 的核心貢獻者。[John Yang](https://john-b-yang.github.io/) 是 Ludwig Schmidt 與 Diyi Yang 指導的二年級博士生，SWE-agent 與 [SWE-smith](https://arxiv.org/abs/2504.21798) 的第一作者。

[ExploreCourses 的 CS329Z 條目](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog)一開始只列了 Ryan 與 Diyi Yang 兩位 PI，現在三位都在上面。開學前一週，課程網站也補上了四位助教：Owen Queen、Anusheh Chaudry、Shreyas Sharma、Houjun Liu。

其餘登記在案的資訊：三學分，Letter 或 Credit/No Credit 皆可。秋季學期實體授課，每週一三下午上課，教室在開學第一週從 Packard 101 改到 Skilling Auditorium。班級代碼、學期起訖與期末考時段收在附錄。

先修條件寫在課程官網的 Logistics 區，四門課擇一：[CS224N](https://web.stanford.edu/class/cs224n/)、[CS224U](https://web.stanford.edu/class/cs224u/)、[CS224V](https://web.stanford.edu/class/cs224v/)、[CS336](https://stanford-cs336.github.io/)，或等同的 NLP 背景。第一堂的投影片講得更直白：train/dev/test、pretraining、fine-tuning、alignment、prompting 這些概念預設你已經懂，「We will not cover these in this course!」。**ExploreCourses 的條目裡完全沒有先修欄位**——只看註冊系統會以為這門課沒有門檻。

同一頁投影片還寫了算力補助：每位學生可拿到 Laude Institute 的 200 美元加 Thinking Machines 的 250 美元額度。這對作業與專案的 API 花費是實質的補貼。

課程第一週就滿了。官網掛了一份 waitlist 表單和一份旁聽申請表，兩份都只能用 Stanford 信箱開，旁聽也只限 Stanford 學生。同一則公告接著寫「All course materials on this site are publicly available」——校外的人進不了教室，但網站上放出來的東西都拿得到。

## 課程的主張：先手刻一遍，再看框架抽掉了什麼

這門課最值得記的一句話，就寫在官網歡迎詞的第二段：

> Students first build core components (RAG, tool use, agent loops) from scratch, then learn how frameworks like DSPy abstract these patterns.

順序是刻意的，而且不只是口號——它被寫進了課表與作業的結構裡。RAG 排在第三堂，描述裡標了 hands-on「build a RAG pipeline from scratch」；工具呼叫排在第四堂，同樣標 hands-on。兩堂都在框架那一堂之前。[DSPy 論文](https://arxiv.org/abs/2310.03714)與 LangChain／LlamaIndex 的比較放在第五堂，主題直接叫「what frameworks abstract vs. what you built from scratch」。

這個安排解決的是一個很具體的問題：先學框架的人，通常說不出框架替他做掉了什麼。你會用 `dspy.ReAct`，但講不出 ReAct 迴圈裡哪一步是模型輸出、哪一步是你的程式碼在解析、失敗時是誰在重試。手刻過一次之後，抽象層才變成一個你能評價的東西，而不是一個你只能相信的東西。

作業把這個主張推得比課表更遠。第一份作業原本分兩半，前半手刻、後半用 DSPy 重寫。九月初改版之後，後半整個拿掉，改成全程禁用 agent 框架，只給你一個 chat-completion 呼叫。框架只在課堂上出現，作業裡一行都不准用。

**這條對自學者是可以照抄的**：不要從 `pip install` 開始學 agent。先用官方 SDK 或 [litellm](https://github.com/BerriAI/litellm) 這種只包薄薄一層的介面，把檢索、工具呼叫、迴圈控制、記憶自己寫一遍。跑起來之後，再拿框架對照看它替你做掉了哪些決定。

## DSPy 是這門課的落點，但它的作者已經不在 Stanford

DSPy 出自 Stanford NLP。[Omar Khattab](https://omarkhattab.com/) 在 Stanford 讀博（指導教授 Christopher Potts 與 Matei Zaharia），論文題目是 foundation model programming，DSPy 與 ColBERT 都是那條線的產物。但他[2025 年 7 月已經到 MIT EECS 任助理教授](https://www.eecs.mit.edu/people/omar-khattab/)，在那之前是 Databricks 的研究科學家。

所以「Stanford 的課教 Stanford 的框架」這句話今天只對一半。真正的連結在授課者這一端。Michael Ryan 是 [MIPROv2 論文](https://arxiv.org/abs/2406.11695)的共同第一作者，也是 [GEPA](https://arxiv.org/abs/2507.19457) 的共同作者。這兩篇都是 DSPy 的優化器論文，而且都排在 Optimization 那一堂的閱讀裡。教框架的人，就是寫了框架裡那幾支優化器的人。

DSPy 本身現在的狀態：[MIT 授權、持續發版](https://github.com/stanfordnlp/dspy)，官網首頁掛的最新版是 3.3.0。星數、貢獻者數與下載量收在附錄。

它解決的問題可以用官網那句標語概括——「Program, don't prompt」。把任務宣告成有型別的 signature，模組決定執行策略（`Predict`、`ChainOfThought`、`ReAct`），優化器再拿一個指標把提示詞自動編譯到收斂。

值得注意的是，這門課沒有把 DSPy 當成終點。第五堂的描述最後一句是「choosing the right level of abstraction」，同一堂還放了 LangChain／LangGraph 與 LlamaIndex。DSPy 也提早在第二堂露面：投影片講結構化輸入輸出時，拿 DSPy signature 當例子，打開來給你看它最後組出來的 system prompt 長什麼樣。它在這門課裡的角色是「被拆開來看的東西」，不是交作業用的工具。

## 三門都叫 agent，該修哪一門

這是很多人真正想問的問題。Stanford 現在同時有三門課掛著 agent，官方描述放在一起看，分工其實很清楚——而且 2026-27 學年的開課狀態差很多。

| 課號 | 官方定位（依官方描述） | 官方先修 | 形態 | 2026-27 學年狀態 |
|---|---|---|---|---|
| [CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) | 工程 compound AI systems：拆解問題、選元件、蒐集資料、建評估 | CS224N / CS224U / CS224V / CS336 擇一（只寫在課程官網） | 兩份作業 ＋ 季度專案 ＋ 論文影片 ＋ 互評 | 秋季開，一三 1:30–2:50 |
| [CS329A: Self-Improving AI Agents](https://cs329a.stanford.edu/) | 研究 seminar：讓模型透過與自己和環境互動持續改進 | CS224N 或 CS229S；Python 流利；有呼叫 LLM API 的經驗 | 讀論文 ＋ 原創研究專案 ＋ 客座 | ExploreCourses 顯示 **Last offered: Autumn 2025** |
| [CS224V: Agentic AI](https://web.stanford.edu/class/cs224v/) | 專案課：用 RAG 與形式化任務描述把幻覺壓到最低，做可用的領域 agent | LINGUIST 180/280、CS124、CS224N、CS224S、CS224U 擇一 | 兩份作業 ＋ 季度專案 | 秋季開，一三 3:00–4:20 |

三件從這張表讀出來、但單看任何一門的官網都看不到的事：

**CS329A 今年沒排。** 在[當前學年的 ExploreCourses 條目](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog)上，它不再有 Terms 欄位，取而代之的是一行 `Last offered: Autumn 2025`。切到上一個學年的分頁，才看得到它完整的秋季排課與助教名單。想修這門的人今年只能等，或者去看[本站的 CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)——它公開了九支錄影。

**CS329Z 與 CS224V 是連著的兩節課，不衝堂。** 一個下午一點半開始，另一個接在後面，同樣週一週三、同樣秋季學期。兩門都要交季度專案，所以同時修的代價不在課表上，在專案上。

**CS224V 今年換了課名。** 上一個學年它叫 *Conversational Virtual Assistants with Deep Learning*，這個學年的條目改成 *Agentic AI*。課程網站首頁到現在還掛著舊名。找資料時兩個名字都要試。

分工用一句話講：**CS329A 問「模型怎麼變強」，CS224V 問「這個領域的助理怎麼不說謊」，CS329Z 問「這套系統怎麼被工程化地做出來並量測」。** 另外還有一門 [CS329T](https://web.stanford.edu/class/cs329t/)，官方描述同樣是「building and evaluating agentic AI applications」，重心在把原型迭代成可靠系統；它的先修走的是 CS229／CS230 那條機器學習線，不是 NLP 線。

## 作業長什麼樣

兩份作業合計一成半，各自綁一場口頭測驗。官網寫十分鐘、閉書，第一堂投影片寫十五分鐘、可以問你繳交內容的任何一部分；以投影片為準比較保險。

**HW1: Build an Agentic Harness**（第 3 到 6 週）。做一個公司內部用的 AI 助理，而且**不准用任何 agent 框架**：只有一個 chat-completion 呼叫，其餘全是你自己寫的程式碼。語料是一份真實的企業 email 封存。你先寫能在上面檢索與推理的 LLM 管線，再一路長成完整的 agent harness：工具、終端機、記憶、加上人類審核（human in the loop）。**這是整門課的分水嶺**，因為課程的核心主張整個壓在這一份上。

這份作業在九月初改過版。八月底的版本語料是研究論文，要回答科學問題，而且分成兩半：Part A 用 litellm 手刻 RAG、工具呼叫與 [ReAct](https://arxiv.org/abs/2210.03629) 類迴圈，Part B 用 DSPy 重寫並反思框架抽掉了什麼。新版拿掉了 Part B，把省下的力氣花在記憶、終端機與人類審核上。這三樣正是「harness」跟「會呼叫工具的 prompt」之間的距離。

**HW2: Evaluate an Agent**（第 6 到 9 週）。給一個做好的 agent，要設計一整套評估：程式判分器、至少一個 LLM-as-judge、依課程的四元組框架（request、environment、stopping criteria、scorer）建 benchmark 任務，加上錯誤分析。

作業之外還有兩件事，合起來占三成。第一件是一支十分鐘的論文影片，要挑一篇課堂上沒講過的 agent 論文。第二件是互評，占兩成，比兩份作業加起來還重。整學期有四輪：看論文影片、看期中 demo、看 HW2 的評估設計、看期末 demo，每輪審兩份。投影片說互評的分數看兩件事：你的回饋有沒有用，以及對方有沒有採納。

季度專案占四成，主題原本鎖死成 Making Life at Stanford Better with Agents，九月中改成自選。唯一的限制是要跟課程核心主題之一扯得上關係：建 agent（檢索、工具、記憶、多 agent、優化）、agent 需要的資料，或者評估與安全。官方範例清單保留了課綱閱讀器、選課排程、論文探索、校園活動推薦，另外加了兩個：針對特定 codebase 的 coding agent，以及對一個現成 agent 做嚴謹評估、找出它的失敗模式。

專案規則裡最值得抄的是評估那段：「只做出一個工具、示範它跑通一次，不會拿高分。」你得在一開始就定好任務範圍、資料來源、什麼算成功、怎麼量，然後跟 baseline 比、做錯誤分析。期末報告 8 頁、ICLR 格式，Results 一節就占 25 分裡的 10 分。

其餘規則也很像一場小型投稿。每隊一到三人，官方建議三人，每隊配一位教學團隊的 mentor。期中與期末都要交 GitHub repo，README 要寫到沒看過你程式碼的同學也跑得起來。助教會照著 README 跑一個簡單例子，這占 5 分。每個階段的報告都要附一段 AI 使用揭露，格式仿 ICLR 2026 的 LLM 政策；沒用 AI 也要寫「沒用」，漏寫會扣分。

對校外自學者來說，專案這一塊少了 mentor 和互評，但評估要求與 README 標準完全可以照搬。

## 課程網站的 git 紀錄：開學前後改了什麼

課程官網 `cs329z.stanford.edu` 是一個 GitHub Pages 站，原始碼在[公開 repo `cs329z/cs329z.github.io`](https://github.com/cs329z/cs329z.github.io) 裡，用 Flask + Flask-FlatPages 產靜態頁，內容全在 `data/*.json` 與 `pages/*.md`。這代表課綱的每一次修改都留著 diff。

最有訊息量的是 8 月 16 日那個 commit，訊息一句話說完：`Two homeworks, add paper video, rebalance grading to 100%`。diff 顯示**被刪掉的是原本的 HW2**，原文是這樣寫的：

> **HW2: Data for Agents** (Weeks 6–8). Given a staff-provided agent, collect and curate data to optimize its performance — data selection, quality filtering, finding maximally informative examples, synthetic data generation, and building optimization data (SFT or preference pairs). Deliverable: a curated dataset, a data card, and an analysis.

課程沒有說明為什麼刪。可以確認的只有兩件事：資料那兩堂課還在課表上（第 11、12 堂，Data for Agentic Systems），現在沒有作業掛在它們後面；以及論文影片與同儕互評是在同一個 commit 裡補進來的。

接下來三十小時內，評分表被連改四次，專案的比重一路加到一半。原本叫 oral exam 的那兩場也在這輪改名成 HW-based quiz。

但這還不是定案。開學前後又有三輪改動，每一輪都動到課程的骨架：

- **9 月 9 日，HW1 整份重寫。** commit 訊息是 `Update HW1 description to match the restructured assignment`。研究論文換成企業 email，DSPy 那一半拿掉，改成全程禁用框架。
- **9 月 20 日，專案規則從一份內部文件整段搬上來。** 主題改成自選，加上 ICLR 格式、AI 使用揭露、GitHub README 與可重現性配分。期中 demo 也從課堂現場改成錄影繳交。
- **9 月 22 日，第一堂課前一天，評分表再翻一次。** 互評從 3% 暴漲到 20%，專案從五成降回四成，作業降到一成半，課堂參與那 5% 直接刪掉。

三輪的方向是一致的：分數從「你交了什麼」移向「你能不能評、能不能被別人重現」。互評要評別人的評估設計，專案要附可重現的 repo，Results 一節是期末報告裡最重的一塊。這門課的第三條軸線「評估」，最後變成評分表本身的形狀。逐次的百分比變動收在附錄。

八月版還有一個對不上的地方：專案頁寫期中在第六週，截止日期表寫第七週。九月那輪重寫之後，兩邊都統一成第七週了。

[ExploreCourses 的課程描述到今天仍然寫著 `three fully applied homework assignments`](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog)，跟課程官網的 `two` 對不上。同一所學校的兩個官方頁面對不上是常態，以課程官網為準。

## 自學者實際拿得到什麼

先講結論：**拿得到課綱、閱讀清單，以及一堂一堂放出來的投影片；拿不到錄影和作業程式碼。**

**拿得到：投影片，而且不用登入。** 課表每一堂的描述底下會掛一個 Google Drive 連結，到 9 月 29 日為止放了前兩堂。[第一堂 Intro to Agentic Systems](https://drive.google.com/file/d/1Wlf723d9-LBuTp56QYppaZwozOAetTsC/view) 71 頁，從 agent 的詞源與歷史講到記憶的三種類型，最後一段把可靠性、安全合規、彈窗攻擊、多 agent 共謀列成這門課要面對的挑戰。[第二堂 LLMs for Builders](https://drive.google.com/file/d/1kekt_p0n-_Q4Y2dKYEkH87NEx6mr8nRE/view) 176 頁，是給 agent 開發者的模型內部速成：解碼、注意力（含 linear 與混合架構）、預訓練到後訓練、推論與 test-time scaling、結構化輸出，最後落在 context engineering。這堂的課表描述在上完課當天被改寫過，原本寫的是 litellm、模型選型與成本延遲，改成跟實際投影片一致。

**拿得到：整份閱讀清單，而且每一條都是可點的連結。** 指定閱讀加補充閱讀共 50 篇，大半指向 arXiv，其餘指向 [BAIR 那篇 compound AI systems 部落格文](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)、[MCP 規格](https://modelcontextprotocol.io/specification/2025-06-18)、[Anthropic 的 Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) 等公開頁面。沒有一條鎖在 Canvas 後面。

**拿得到：完整的評分表、作業描述與專案要求。** 你知道 HW1 要做什麼、HW2 要交什麼、提案與報告各要幾頁、期末報告每一節幾分，也知道每一項占幾分。

**拿得到：課程網站的原始碼與修改史。** 上一節那些課綱變動就是從這裡讀出來的。

**拿不到（至少現在）：錄影。** 課堂有錄，但官網寫的是錄影放在 Canvas，要用選課生身分登入。第一堂投影片則寫「Lecture slides and videos will be posted online」。兩個說法還沒對上，公開錄影會不會出現，要再等等看。

**拿不到：作業的起始碼、email 語料與評分器。** 官網沒有給任何 repo 連結，HW1 用的是哪一份企業 email 封存也沒寫。

**拿不到：兩場客座。** 課表上 10 月 26 日與 11 月 16 日兩格仍寫著「📺 Guest Lecture (TBA)」，講者還沒公布。

還有一件跟教材無關但值得看的東西：這門課的誠信條款花了一整段講怎麼用 AI 工具，語氣跟大多數學校的禁令很不一樣。

> This is a course about building with AI, so we expect you to use it. Treat generative AI tools as collaborators you think alongside — asking them to explain a concept, debug your code, or critique a design is fair game and encouraged. What isn't: soliciting finished answers or copying solutions.

配套是那兩場口頭測驗：個人、閉書，要你解釋自己的設計決策與取捨。用 AI 幫你寫可以，但你得能當場說清楚你為什麼那樣寫。

第一堂投影片把理由講得更具體。它引了 [Anthropic 2026 年的一個隨機對照實驗](https://www.anthropic.com/research/AI-assistance-coding-skills)：52 位工程師學一個新的 Python 函式庫，用 AI 輔助的那組在後測低了 17%，差距最大的是除錯。下一頁的標題是「Use AI to learn how to learn」。這門課要你用 AI，但它量的是你自己學會了什麼。

## 怎麼開始

今晚就能做的一件事，就是照 HW1 的規則開工：不裝框架，只留一個 chat-completion 呼叫。

課程沒公布它用哪一份 email。自學的話，最順手的是匯出你自己信箱最近三個月的信；想要公開資料，[Enron email 資料集](https://www.cs.cmu.edu/~enron/)是這類研究最常用的一份真實企業郵件。先寫最小的一段管線：切信、檢索、讓模型回答「上個月誰答應了什麼」這種問題。跑得動之後，照作業描述的順序一次只加一樣：一個 `search_email` 工具、一個最多跑三輪的迴圈、一本記下使用者偏好的記憶、一個「寄信前先問我」的確認關卡。

每加一樣，就拿同一組十個問題重跑一次，記下哪幾題變好、哪幾題變差。等到第五堂講 DSPy 與其他框架時，你手上已經有一份「每一層我自己寫了什麼」的清單，可以一項一項對照框架替你做掉了哪些。

## 附錄：數字與查證方式

- **登記在案的細節**：班級代碼 27855、Session 2026-2027 Autumn 1、學期區間 2026-09-22 至 2026-12-04、每週一三 1:30–2:50 p.m.、Skilling Auditorium（開學前原排 Packard 101）、期末考時段 2026-12-09 3:30–6:30 p.m.（以上出自 ExploreCourses 與課程官網 Logistics 區）。
- **截止日期**：HW1 10/5 出、10/30 交；專案提案 10/9 交；HW2 10/26 出、11/20 交；期中 demo 錄影 11/4 交、期中報告 11/6 交；論文影片 11/13 交；論文影片互評（兩支）11/30 交；期末報告與系統 demo 在 12/7–12/11 的期末週，時間未定。皆為晚間 11:59（太平洋時間）。
- **課表規模**：`data/schedule.json` 裡共 22 個時段，扣掉兩格 TBA 客座、兩格感恩節停課、一格 Demo Day，實際有內容的講次 17 堂。指定閱讀 23 篇、補充閱讀 27 篇，合計 50 篇；去重後的 arXiv 連結 32 條。以上為 2026-09-29 抓取的版本；與 8/21 版相比，評估那堂的指定閱讀在 8/23 換成 Zhu 等人的 [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)，原本的 Ofir Press 部落格文降為補充閱讀。
- **評分表的演變**（皆出自公開 repo 的 commit diff，時間為 commit 的作者時區時間）：8/16 22:29 `Two homeworks, add paper video, rebalance grading to 100%`，專案 39%→35%、作業三份各 10%→兩份各 15%；8/17 09:38 `Grading updates`，改成巢狀清單；8/17 15:11 `Update grading breakdown`，專案 35%→50%、作業兩份各 15%→各 10%、oral exam 改名 HW-based quiz 且各 10%→7.5%；8/17 22:29 `Adjust project grading weights`，期中 demo 5%→7%、期末系統 demo 20%→18%；9/22 20:24 `Update grading`，改成專案 40%（提案 5、期中報告 5、期中 demo 5、期末繳交 15、期末系統 demo 10）、作業 15%（各 7.5）、HW-based quiz 15%（各 7.5）、論文影片 10%、互評 20%（四輪各 5%，每輪審兩份各 2.5%），課堂參與 5% 刪除。期末繳交 25 分的細項（報告 20＋可重現性 5）出自 9/20 的專案頁改寫。
- **學分數的更動**：8/18 的 `Some updates` 把 logistics 頁的 `Units: 3–4` 改成 `Units: 3`，同時補上班級代碼、時段與教室。ExploreCourses 上同樣是 3 學分。
- **ExploreCourses 的查法**：`https://explorecourses.stanford.edu/search?q=<課號>&view=catalog` 預設顯示當前學年（2026-2027）。CS329Z 在 2025-2026 與 2024-2025 兩個學年分頁都是 0 筆結果，因此判定為新課；CS329A 在當前學年顯示 `Last offered: Autumn 2025`，切到 2025-2026 才看得到排課。這個站需要帶 `jsenabled=1` cookie 才會回傳內容，直接抓會拿到一頁「Loading…」。
- **DSPy 的數字**：GitHub 星數約 37,400（2026-08-21 讀取），官網首頁自述 444 位以上貢獻者、每月 660 萬次以上下載、最新版 3.3.0，MIT 授權。這些是專案自己公布的數字。
- **投影片與官網的出入**：第一堂投影片寫 HW-based quiz 是「15-min oral check-in on any part of your submission」，官網寫 10 分鐘、閉書；投影片寫錄影會「posted online」，官網寫放在 Canvas。投影片以 Google Drive 公開連結發布，2026-09-29 下載，第一堂 71 頁、第二堂 176 頁。
- **ExploreCourses 授課者**：8/21 讀取時只列 Ryan, M. 與 Yang, D.；9/29 讀取時已列 Ryan, M.、Yang, D.、Yang, J. 三位 PI，教室也已顯示 Skilling。
- **未能確認**：兩場客座的講者；作業起始碼與 HW1 的 email 語料是否會公開；錄影最終是否公開；Stanford Bulletin 是否已收錄 CS329Z 條目（其課程目錄是動態載入的前端應用，未能以一手方式確認）。

## 更新紀錄

- 2026-09-29：依課程網站 9 月的改版與前兩堂投影片更新——HW1 改為禁用框架的 Agentic Harness（Part B 的 DSPy 重寫移除）、專案主題改自選並加入 ICLR 格式與可重現性、評分表改為互評 20%、補上助教、教室、算力補助、旁聽與錄影說明、投影片內容，並同步改寫標題與 tldr

## 參考資料

- [Stanford CS329Z: Engineering AI Agents 課程官網](https://cs329z.stanford.edu/) — 授課者、課表、兩份作業內容、評分表、專案主題、先修與誠信條款的一手來源
- [cs329z/cs329z.github.io（課程網站原始碼與 commit 紀錄）](https://github.com/cs329z/cs329z.github.io) — 課綱變動、被刪掉的 HW2 原文、HW1 改版、專案規則改寫、評分表演變
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
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — 第六堂的指定閱讀，也是八月版 HW1 舉的推理模式
- [SWE-smith: Scaling Data for Software Engineering Agents](https://arxiv.org/abs/2504.21798) — 第 12 堂的指定閱讀，授課者 John Yang 的第一作者論文
- [The Shift from Models to Compound AI Systems（BAIR Blog）](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) — 第一堂的指定閱讀，課程主張的出處
- [Model Context Protocol 規格](https://modelcontextprotocol.io/specification/2025-06-18) — 第四堂的指定閱讀
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — 第二堂的指定閱讀
- [litellm](https://github.com/BerriAI/litellm) — 八月版 HW1 指定的 SDK，本文建議的手刻起點之一
- [CS329Z Lecture 1 投影片：Intro to Agentic Systems](https://drive.google.com/file/d/1Wlf723d9-LBuTp56QYppaZwozOAetTsC/view) — 先修、算力補助、評分、互評計分方式、旁聽與錄影說明
- [CS329Z Lecture 2 投影片：LLMs for Builders](https://drive.google.com/file/d/1kekt_p0n-_Q4Y2dKYEkH87NEx6mr8nRE/view) — 模型內部速成與 DSPy signature 範例
- [Anthropic: How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) — 第一堂投影片引用的 RCT
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825) — 評估那堂 8/23 換上的指定閱讀
- [Enron Email Dataset（CMU）](https://www.cs.cmu.edu/~enron/) — 本文建議自學 HW1 時使用的公開企業郵件語料（非課程指定）
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)
