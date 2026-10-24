---
title: "AI Agent 工程：不靠框架，從一個 chat-completion 呼叫做出 agent harness｜Stanford CS329Z 課程總覽"
date: 2026-08-21
updated: 2026-10-23
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
tldr: "CS329Z 是 Stanford 的 AI agent 工程課：先不靠框架手刻 RAG、工具呼叫與 agent 迴圈，再看 DSPy 這類框架抽掉了什麼，兩份作業分別是做 agent harness 與設計 agent 評估。課綱、指定閱讀、前九堂投影片與第一份作業的起始碼、資料和公開測試都拿得到；錄影要以選課身分登入 Canvas。"
description: "Stanford CS329Z Engineering AI Agents 自學路線：從 RAG、工具與迴圈走到 context、記憶、多智慧體協調與優化，整理前九堂官方投影片、HW1 起始碼及 Terminal-Bench 客座指定閱讀。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

[CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) 是 Stanford 電腦科學系 2026 年秋季的三學分課。名字裡的關鍵字是 **Engineering**。它不是把最新的 agent 論文排成十週讀完，而是要學生把一套 agentic 系統從零做出來、量出來，然後在 Demo Day 上把它演一遍。

課程官網開宗明義給的框架是「compound AI systems」：由 LLM、檢索器、工具、優化器多個元件組成、彼此互動的系統。官網說這代表 AI 應用建構方式的一次根本改變。整學期的三條軸線寫在第一堂的描述裡——拆解（decomposition）、資料（data）、評估（evaluation）。

自學這門課，可以沿著「先做出來，再讓它可靠」讀下去：前段手刻檢索與工具，中段管理 context、記憶與多智慧體，接著用資料和評估決定如何優化。本文整理材料入口與起步方式；第 4、5 週導讀已補入實際投影片，第 6 週接上 Terminal-Bench 指定閱讀。錄影仍須課程 Canvas 權限。

## 把系列讀成一次接得起來的工程練習

[官方課程](https://cs329z.stanford.edu/)的路徑很清楚：先做核心元件，再組 agent harness，接著用資料改善，最後證明它真的有效。本系列依第一堂導讀的方式重整：分清官方材料與本文解釋，沿機制展開，以例子連起來，再給出有答案判準的理解檢查。對要做繁中公司助理的讀者，每週都可以接回同一個工作問題。

### 從請求開始，把證據一路留下來

先用本文自擬任務：「從公司信件說明為什麼交付延期。」檢索要找支持與反例，工具要回傳實際結果，記憶要保存有用狀態，不能把猜測變成事實。從[第一堂](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)開始，沿系列順序讀後續週次。每增加一個元件，都問下一次模型呼叫看得到什麼，以及哪項證據證明動作確實發生。

### 找到失敗位置，再決定改哪一層

漏掉原信，先查檢索與索引；交接後語意變形，先查交接契約；答案正確但太貴，才談成本優化。多 agent、長 context 與增加推理都是有成本的實驗。留下一條可重播軌跡，做一項有界修改，在同一任務與評分器下比較，才知道改動有沒有對準問題。

### 先讀材料狀態，再決定怎麼使用導讀

截至 2026-10-23，官網連出 Lecture 01–09。後續週次目前是依課表與指定閱讀寫的預習，不能當成尚未發生的課堂紀錄；閱讀 Digest 也與主線解釋分開。自學者可用公開投影片與論文，[錄影則需課程 Canvas 權限](https://cs329z.stanford.edu/logistics.html)。有文章導讀，不表示有公開影片。

**理解檢查**：助理找到正確信件，寫出合理解釋，並說已寄信，還缺什麼證據？**答案判準**：先確認解釋有保留原信的不確定性；寄送則要有實際工具結果與對應授權。「已完成」一句話無法證明這兩件事。

## 這門課的硬事實

授課者三位，都掛在課程官網的 Instructors 區塊。[Diyi Yang](https://cs.stanford.edu/~diyiy/) 是 Stanford CS 助理教授，研究主軸是 socially aware NLP 與人機互動，2024 年拿到 Sloan Research Fellowship。[Michael Ryan](https://michryan.com/) 是 Diyi Yang 與 Percy Liang 共同指導的博士生、Knight-Hennessy 學者，也是 [DSPy](https://dspy.ai/) 的核心貢獻者。[John Yang](https://john-b-yang.github.io/) 是 Ludwig Schmidt 與 Diyi Yang 指導的二年級博士生，SWE-agent 與 [SWE-smith](https://arxiv.org/abs/2504.21798) 的第一作者。


其餘登記在案的資訊：三學分，Letter 或 Credit/No Credit 皆可。秋季學期實體授課，每週一三下午上課，現行Logistics列出的教室是Skilling Auditorium。

先修條件寫在課程官網的 Logistics 區，四門課擇一：[CS224N](https://web.stanford.edu/class/cs224n/)、[CS224U](https://web.stanford.edu/class/cs224u/)、[CS224V](https://web.stanford.edu/class/cs224v/)、[CS336](https://stanford-cs336.github.io/)，或等同的 NLP 背景。第一堂的投影片講得更直白：train/dev/test、pretraining、fine-tuning、alignment、prompting 這些概念預設你已經懂，「We will not cover these in this course!」。




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

[DSPy 的官方專案](https://github.com/stanfordnlp/dspy)提供程式與發版紀錄；實作時應依所用版本查文件，本文不把首頁版本號當成固定的課程要求。

它解決的問題可以用官網那句標語概括——「Program, don't prompt」。把任務宣告成有型別的 signature，模組決定執行策略（`Predict`、`ChainOfThought`、`ReAct`），優化器再拿一個指標把提示詞自動編譯到收斂。

值得注意的是，這門課沒有把 DSPy 當成終點。第五堂的描述最後一句是「choosing the right level of abstraction」，同一堂還放了 LangChain／LangGraph 與 LlamaIndex。DSPy 也提早在第二堂露面：投影片講結構化輸入輸出時，拿 DSPy signature 當例子，打開來給你看它最後組出來的 system prompt 長什麼樣。它在這門課裡的角色是「被拆開來看的東西」，不是交作業用的工具。

## 先按學習問題選課，再查當期開課

幾門課的名字很像，先比較官方定位。[CS329Z](https://cs329z.stanford.edu/)重工程元件、資料與評估；[CS329A](https://cs329a.stanford.edu/)是研究seminar，關心模型如何透過與自己和環境互動改進；[CS224V](https://web.stanford.edu/class/cs224v/)聚焦可用的領域助理；[CS329T](https://web.stanford.edu/class/cs329t/)則把原型迭代成可靠的agentic應用。

公開課程頁可能屬於不同學年，適合拿來選題，不能直接證明當期仍有開課。要註冊時，另查學校註冊系統的開課、先修與時段。本導讀不把舊首頁的時間當成今天可修課的承諾。

## 作業長什麼樣

**截止日期**：HW1 10/5 出、10/30 交；專案提案 10/9 交；HW2 10/26 出、11/20 交；期中 demo 錄影 11/4 交、期中報告 11/6 交；論文影片 11/13 交；論文影片互評（兩支）11/30 交；期末報告與系統 demo 在 12/7–12/11 的期末週，時間未定。有明列時間的提交截止為晚間11:59（太平洋時間）；發布日沒有公告時間，期末展示與報告時段仍待公告。

兩份作業合計一成半，各自綁一場口頭測驗。[現行Logistics](https://cs329z.stanford.edu/logistics.html)寫十分鐘、閉書；第一堂投影片曾寫十五分鐘，兩份材料有差異。實際安排應依教學團隊最新公告，不自行指定投影片優先。

**HW1: Build an Agentic Harness**（第 3 到 6 週）。做一個公司內部用的 AI 助理，而且**不准用任何 agent 框架**：只有一個 chat-completion 呼叫，其餘全是你自己寫的程式碼。語料是一份真實的企業 email 封存。你先寫能在上面檢索與推理的 LLM 管線，再一路長成完整的 agent harness：工具、終端機、記憶、加上人類審核（human in the loop）。**這是整門課的分水嶺**，因為課程的核心主張整個壓在這一份上。

這份作業在九月初改過版。八月底的版本語料是研究論文，要回答科學問題，而且分成兩半：Part A 用 litellm 手刻 RAG、工具呼叫與 [ReAct](https://arxiv.org/abs/2210.03629) 類迴圈，Part B 用 DSPy 重寫並反思框架抽掉了什麼。新版拿掉了 Part B，把省下的力氣花在記憶、終端機與人類審核上。這三樣正是「harness」跟「會呼叫工具的 prompt」之間的距離。

**HW2: Evaluate an Agent**（第 6 到 9 週）。給一個做好的 agent，要設計一整套評估：程式判分器、至少一個 LLM-as-judge、依課程的四元組框架（request、environment、stopping criteria、scorer）建 benchmark 任務，加上錯誤分析。

作業之外還有兩件事，合起來占三成。第一件是一支十分鐘的論文影片，要挑一篇課堂上沒講過的 agent 論文。第二件是互評，占兩成，比兩份作業加起來還重。整學期有四輪：看論文影片、看期中 demo、看 HW2 的評估設計、看期末 demo，每輪審兩份。投影片說互評的分數看兩件事：你的回饋有沒有用，以及對方有沒有採納。

季度專案占四成，主題原本鎖死成 Making Life at Stanford Better with Agents，九月中改成自選。唯一的限制是要跟課程核心主題之一扯得上關係：建 agent（檢索、工具、記憶、多 agent、優化）、agent 需要的資料，或者評估與安全。官方範例清單保留了課綱閱讀器、選課排程、論文探索、校園活動推薦，另外加了兩個：針對特定 codebase 的 coding agent，以及對一個現成 agent 做嚴謹評估、找出它的失敗模式。

專案規則裡最值得抄的是評估那段：「只做出一個工具、示範它跑通一次，不會拿高分。」你得在一開始就定好任務範圍、資料來源、什麼算成功、怎麼量，然後跟 baseline 比、做錯誤分析。期末報告 8 頁、ICLR 格式，Results 一節就占 25 分裡的 10 分。

其餘規則也很像一場小型投稿。每隊一到三人，官方建議三人，每隊配一位教學團隊的 mentor。期中與期末都要交 GitHub repo，README 要寫到沒看過你程式碼的同學也跑得起來。助教會照著 README 跑一個簡單例子，這占 5 分。每個階段的報告都要附一段 AI 使用揭露，格式仿 ICLR 2026 的 LLM 政策；沒用 AI 也要寫「沒用」，漏寫會扣分。

對校外自學者來說，專案這一塊少了 mentor 和互評，但評估要求與 README 標準完全可以照搬。

## 背景 Digest：課程網站沿革

<details>
<summary>展開歷史背景</summary>

### 課程網站的 git 紀錄：開學前後改了什麼

課程官網 `cs329z.stanford.edu` 是一個 GitHub Pages 站，原始碼在[公開 repo `cs329z/cs329z.github.io`](https://github.com/cs329z/cs329z.github.io) 裡，用 Flask + Flask-FlatPages 產靜態頁，內容全在 `data/*.json` 與 `pages/*.md`。這代表課綱的每一次修改都留著 diff。

最有訊息量的是 8 月 16 日那個 commit，訊息一句話說完：`Two homeworks, add paper video, rebalance grading to 100%`。diff 顯示**被刪掉的是原本的 HW2**，原文是這樣寫的：

> **HW2: Data for Agents** (Weeks 6–8). Given a staff-provided agent, collect and curate data to optimize its performance — data selection, quality filtering, finding maximally informative examples, synthetic data generation, and building optimization data (SFT or preference pairs). Deliverable: a curated dataset, a data card, and an analysis.

課程沒有說明為什麼刪。可以確認的只有兩件事：資料那兩堂課還在課表上（第 11、12 堂，Data for Agentic Systems），現在沒有作業掛在它們後面；以及論文影片與同儕互評是在同一個 commit 裡補進來的。

接下來三十小時內，評分表被連改四次，專案的比重一路加到一半。原本叫 oral exam 的那兩場也在這輪改名成 HW-based quiz。

但這還不是定案。開學前後又有三輪改動，每一輪都動到課程的骨架：

- **9 月 9 日，HW1 整份重寫。** commit 訊息是 `Update HW1 description to match the restructured assignment`。研究論文換成企業 email，DSPy 那一半拿掉，改成全程禁用框架。
- **9 月 20 日，專案規則從一份內部文件整段搬上來。** 主題改成自選，加上 ICLR 格式、AI 使用揭露、GitHub README 與可重現性配分。期中 demo 也從課堂現場改成錄影繳交。
- **9 月 22 日，第一堂課前一天，評分表再翻一次。** 互評從 3% 暴漲到 20%，專案從五成降回四成，作業降到一成半，課堂參與那 5% 直接刪掉。

三輪的方向是一致的：分數從「你交了什麼」移向「你能不能評、能不能被別人重現」。互評要評別人的評估設計，專案要附可重現的 repo，Results 一節是期末報告裡最重的一塊。這門課的第三條軸線「評估」，最後變成評分表本身的形狀。

八月版還有一個對不上的地方：專案頁寫期中在第六週，截止日期表寫第七週。九月那輪重寫之後，兩邊都統一成第七週了。

[ExploreCourses 的課程描述到今天仍然寫著 `three fully applied homework assignments`](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog)，跟課程官網的 `two` 對不上。同一所學校的兩個官方頁面對不上是常態，以課程官網為準。

</details>

## 自學者實際拿得到什麼

先講結論：**拿得到課綱、閱讀清單，以及一堂一堂放出來的投影片；HW1 起始碼與測試也已公開；錄影仍需登入 Canvas。**

**拿得到：前九堂投影片，而且不用登入。** 截至 2026-10-23，[官方課表](https://cs329z.stanford.edu/)已連到 10/21 的 Optimization。自學可以照下面的順序讀：

| 日期 | 講次 | 官方投影片 |
|---|---|---|
| 9/23 | Lecture 1: Introduction — What Are Agentic Systems? | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) |
| 9/28 | Lecture 2: LLMs for Builders | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf) |
| 9/30 | Lecture 3: Retrieval-Augmented Generation (RAG) | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf) |
| 10/5 | Lecture 4: Tool Use & Function Calling | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf) |
| 10/7 | Lecture 5: Frameworks & Orchestration | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf) |
| 10/12 | Lecture 6: Agent Design Patterns & Scaffolds | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf) |
| 10/14 | Lecture 7: Agent Memory Architectures | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf) |
| 10/19 | Lecture 8: Multi-Agent Systems | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf) |
| 10/21 | Lecture 9: Optimization | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf) |

第二堂實際講的是給開發者的模型內部知識；同週指定的 Anthropic workflow 分類是另一份閱讀。第三到第五堂接著走 RAG、工具與框架。新公開的第六、七堂把迴圈延伸成 context 與記憶設計，第八、九堂再回答要不要分工、該優化哪一層。

| 自學階段 | 要回答的工程問題 | 本站導讀 |
|---|---|---|
| 做出元件：Lecture 1–5 | 哪一步是檢索、模型判斷或程式控制？ | [第 1 週](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[第 2 週](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[第 3 週](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy) |
| 留住進度：Lecture 6–7 | 工具輸出太長時保留什麼？跨 session 記住什麼？ | [第 4 週：context 與記憶](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory) |
| 分工與改善：Lecture 8–9 | 平行收益能否抵過協調成本？資料與評估足以支持優化嗎？ | [第 5 週：協調與優化](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization) |
| 驗收成果：Week 6 指定閱讀 | agent 說完成之後，環境真的符合要求嗎？ | [第 6 週：Terminal-Bench 與資料飛輪](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel) |

這張表是本文安排的閱讀路線。第 6 週客座尚未開講，該週新增內容依公開論文與指定閱讀撰寫；第 7 週以後仍以課表指定閱讀導讀為主，不當作已取得的課堂口述。

**拿得到：整份閱讀清單，而且每一條都是可點的連結。** 指定閱讀與補充閱讀，大半指向 arXiv，其餘指向 [BAIR 那篇 compound AI systems 部落格文](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)、[MCP 規格](https://modelcontextprotocol.io/specification/2025-06-18)、[Anthropic 的 Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) 等公開頁面。沒有一條鎖在 Canvas 後面。

**拿得到：完整的評分表、作業描述與專案要求。** 你知道 HW1 要做什麼、HW2 要交什麼、提案與報告各要幾頁、期末報告每一節幾分，也知道每一項占幾分。

**拿得到：課程網站的原始碼與修改史。** 上一節那些課綱變動就是從這裡讀出來的。

**拿不到（至少現在）：錄影。** 課堂有錄，但官網寫的是錄影放在 Canvas，要用選課生身分登入。第一堂投影片則寫「Lecture slides and videos will be posted online」。兩個說法還沒對上，公開錄影會不會出現，要再等等看。

**拿得到：HW1 起始碼、資料與公開測試。** 官網 Logistics 頁已連到[官方 starter repo](https://github.com/cs329z/assignment1-harness)，裡面有作業講義、壓縮的企業郵件封存、Cardinal Energy 文件、待實作的 adapter、確定性與 live 測試，以及模擬使用者評估。Cardinal Energy 是虛構公司；講義把另一份 email archive 說明為真實企業郵件。這已足夠讓自學者照正式介面開工，但 starter 並不是完成的解答。

**客座閱讀：10/26 主題已確定為 Terminal-Bench。** [官方課表](https://cs329z.stanford.edu/)已列講者 Ryan Marten、Alex Shaw，指定閱讀為專案站與論文；11/16 仍標 TBA。10/26 尚未開講，公開論文可先讀，但不能當作客座錄影或講授紀錄。

還有一件跟教材無關但值得看的東西：這門課的誠信條款花了一整段講怎麼用 AI 工具，語氣跟大多數學校的禁令很不一樣。

目前的 [AI 使用規則](https://cs329z.stanford.edu/logistics.html)更明確：作業與專案可以使用 AI 生成的程式碼，但學生必須能驗證、解釋，並接受口試；專案報告不能由 AI 代寫，可以用它腦力激盪或取得寫作回饋。

配套是那兩場口頭測驗：個人、閉書，要你解釋自己的設計決策與取捨。用 AI 幫你寫可以，但你得能當場說清楚你為什麼那樣寫。

第一堂投影片把理由講得更具體。它引了 [Anthropic 2026 年的一個隨機對照實驗](https://www.anthropic.com/research/AI-assistance-coding-skills)：52 位工程師學一個新的 Python 函式庫，用 AI 輔助的那組在後測低了 17%，差距最大的是除錯。下一頁的標題是「Use AI to learn how to learn」。這門課要你用 AI，但它量的是你自己學會了什麼。

## 怎麼開始

今晚就能做的一件事，就是照 HW1 的規則開工：不裝框架，只留一個 chat-completion 呼叫。

先讀[官方 HW1 講義](https://github.com/cs329z/assignment1-harness/blob/main/cs329z_assignment1_harness.pdf)，再 clone 起始碼。資料、介面與測試都已備妥，不必另外找一份 email 語料猜作業怎麼做。

```bash
git clone https://github.com/cs329z/assignment1-harness.git
cd assignment1-harness
cp .env.example .env
uv run python data/download.py
uv run pytest
```

起始碼需要 Python 3.11 以上與 uv。預設測試不會呼叫模型；一開始出現 `NotImplementedError` 是預期狀態，代表對應的 adapter 還沒實作。要跑 live 測試，再到 `.env` 填入自己的 `OPENROUTER_API_KEY`，執行 `uv run pytest -m live -s`。

Part 1 先做 email 優先級分類、每日摘要、從零寫 BM25，以及多跳 email 問答。Part 2 才把這些管線包成 Cardinal Agent 的工具，加入文字格式的工具呼叫協定、文件檢索、終端機、context 壓縮、跨 session 記憶、使用者審核與護欄。課程提供的 LM 只回傳字串，工具呼叫怎麼解析、迴圈怎麼控制，都由你自己寫。

最後的評估會讓模擬使用者真的跟 agent 多輪對話，回答追問、批准或拒絕動作。先把測試與 design memo 一起看，再一次實作一個 adapter：機制跑得對，以及能解釋設計取捨，是作業分開檢查的兩件事。

## 讀物 1｜官方課表與 Logistics

原文：[CS329Z 課表](https://cs329z.stanford.edu/)、[Logistics](https://cs329z.stanford.edu/logistics.html)。

### TL;DR

課程用兩份實作與季度專案，把元件建置、agent設計、資料與評估接成同一條學習路徑。

### 編輯判斷

| 面向 | 判斷 |
| --- | --- |
| 來源權威 | 當期課程範圍與已公告截止日的一手來源 |
| 取得方式 | 公開材料可讀，錄影另需Canvas權限 |
| 證據邊界 | 課表仍可能變更，未發布投影片不代表內容已講授 |

### 領域背景

單篇論文解釋一種方法，課程還要安排先備、實作與理解檢查。CS329Z提供這種次序，讓框架和研究不再只是互不相連的工具清單。

### 中階導讀

歡迎詞先把agent放進複合系統，再要求學生手刻RAG、工具與迴圈，之後回看框架抽象。HW1把元件接成harness；HW2則用不同grader與四元組規格評估既有agent。口試要求學生說明自己交出的程式；Logistics允許經驗證的AI生成程式碼，但不允許AI代寫專案報告。

課表也是材料發布地圖：投影片發布後才掛連結。未來主題描述證明的是計畫範圍，不能當作講師已說過的內容。因此，後續週次會明示目前是指定閱讀預習。

### 深入要點

- 課堂討論範圍與作業實作規則不同：課堂可以拆解框架，作業仍可禁止使用框架。
- 公開文件與錄影權限分開；看得到課程頁，不表示影片也公開。

### Reviewer 一句話評

把官方頁當成學習契約與發布地圖，日期真正要用時再核對一次。

### 給你的 take-away

挑一週的學習目標，做出一個能證明理解的最小產物，並準備解釋它有效的證據。

## 讀物 2｜官方專案要求

原文：[CS329Z Project Guide](https://cs329z.stanford.edu/project.html)。

### TL;DR

專案需要清楚任務、有意義的評估、比較、錯誤分析與可重現執行；一次成功展示不足以支持系統有效。

### 編輯判斷

| 面向 | 判斷 |
| --- | --- |
| 證據 | 官方報告與可重現性配分規格 |
| 有用分界 | 工具跑得動與系統經過評估，是不同產物 |
| 邊界 | 配分屬於這次開課，不是所有專案的通用標準 |

### 領域背景

Agent展示容易隱藏選題、失敗與安裝條件。專案規格要求把這些選擇寫進可檢查產物，讓別人能評估，而非只相信展示者。

### 中階導讀

官方允許一到三人組隊，並安排教學團隊mentor。題目連到建agent、agent資料或評估與安全。期末報告需交代環境、方法、結果、限制與揭露，並採指定格式。

期末提交共二十五分，其中報告二十分、可重現性五分；Results占十分，要求在有意義的任務上比較baseline並分析失敗。GitHub README則要讓其他人能執行系統、重現結果。這些要求把「曾經跑通」轉成可以核對的主張。

### 深入要點

- Baseline協助辨認新增元件的貢獻；單一成功展示無法隔離該貢獻。
- 可重現性查執行契約，結果評估查系統行為，兩者都不能省。

### Reviewer 一句話評

這份規格最有教學價值的地方，是把證據與重現明確寫進配分。

### 給你的 take-away

開發前先寫任務、baseline、驗收指標，以及另一個人重現結果所需的一條命令。


## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)說明錄影由課程 Canvas 提供，需登入取得。本次投影片地圖與週導讀更新依公開教材撰寫，未取得需認證的錄影或逐字稿。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-23。

## 更新紀錄

- 2026-10-23：將上課資訊與截止日期併回相關段落，歷史統計與查證紀錄移入研究筆記。

- 2026-10-23：擴充至前九堂官方投影片，補第 4–6 週閱讀路線與 Terminal-Bench 客座閱讀；本次未重驗附錄的歷史統計與跨課比較。




- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：更新前五堂官方 PDF 投影片，補上已公開的 HW1 起始碼、講義、資料、測試與自學指令，並核對 AI 使用規則與錄影取得方式。
- 2026-09-29：依課程網站 9 月的改版與前兩堂投影片更新——HW1 改為禁用框架的 Agentic Harness（Part B 的 DSPy 重寫移除）、專案主題改自選並加入 ICLR 格式與可重現性、評分表改為互評 20%、補上助教、教室、算力補助、旁聽與錄影說明、投影片內容，並同步改寫標題與 tldr
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

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
- [CS329Z Lecture 1 投影片：Intro to Agentic Systems](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) — 先修、算力補助、評分、互評計分方式、旁聽與錄影說明
- [CS329Z Lecture 2 投影片：LLMs for Builders](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf) — 模型內部速成與 DSPy signature 範例
- [Anthropic: How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) — 第一堂投影片引用的 RCT
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825) — 評估那堂 8/23 換上的指定閱讀
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)

- [CS329Z Logistics](https://cs329z.stanford.edu/logistics.html) — HW1 起始碼入口、AI 使用規則與 Canvas 錄影方式
- [CS329Z HW1: Building an Agentic Harness](https://github.com/cs329z/assignment1-harness) — starter, datasets, tests, and setup
- [HW1 handout](https://github.com/cs329z/assignment1-harness/blob/main/cs329z_assignment1_harness.pdf) — Part 1/2 and design memo
- [CS329Z Lecture 3: Retrieval-Augmented Generation (RAG)](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- [CS329Z Lecture 4: Tool Use & Function Calling](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- [CS329Z Lecture 5: Frameworks & Orchestration](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)

- [CS329Z Lecture 6: Agent Design Patterns & Scaffolds](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)

- [CS329Z Lecture 7: Agent Memory Architectures](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)

- [CS329Z Lecture 8: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)

- [CS329Z Lecture 9: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
