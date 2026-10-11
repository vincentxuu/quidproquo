---
title: "CMU 11-768 AI Agents 導讀：沒訓練過語言模型就不能選的 agent 課，三份作業從 harness、評測一路做到 RL"
date: 2026-09-29
category: ai
type: guide
tags: [cmu-11768, ai-course, cmu, ai-agent, harness-engineering, self-study]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 0
tldr: "CMU 11-768 是 Graham Neubig 和 Daniel Fried 在 2026 秋季新開的 agent 研究所課：先修嚴格要求訓練過語言模型，23 講從工具呼叫、context、記憶、規劃講到 SFT、RL、沙盒與人機互動。前半學期三份個人作業依序做 harness、評測、訓練，後半學期是團隊研究專題；投影片已公開，前 10 講影片也已公開。"
description: "CMU 11-768 AI Agents（Fall 2026）系列導讀：課程定位、先修門檻、評分與 AI 工具政策、23 講課表的七個模組、三份作業與研究專題，以及這個 27 篇系列的讀法與目前進度。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[11-768 AI Agents](https://www.cmu-agents.com/) 是 Carnegie Mellon 語言技術研究所（[LTI](https://lti.cs.cmu.edu/)）在 2026 秋季新開的研究所課，授課者是 [Graham Neubig](https://www.phontron.com/) 和 [Daniel Fried](https://dpfried.github.io/)。Neubig 在第一講講到 harness 時說他在開發 [OpenHands](https://github.com/All-Hands-AI/OpenHands)；Fried 自介的研究方向是 grounded agent、人和 agent 的互動，以及近來的 agent 和系統的互動。

官網一句話定義這門課研究的對象：用大型語言模型去感知、推理、規劃、並在多步驟中行動的系統。它跟一般「教你用框架搭 agent」的課不一樣的地方在於，它要你**自己訓練 agent**。第一講 Neubig 講得很直接：做一個 agent 不難，難的是讓它真的做得好，而會把 agent 訓練好的人很少，他們希望修完這門課的人都在那一小群裡。

這篇是整個導讀系列的入口：先講課程形式和門檻，再把 23 講課表、三份作業和專題攤開，最後是這個系列的 27 篇怎麼排、現在寫到哪裡。

## 課程影片來源

已核對 CMU 11-768 Fall 2026 第 1 講的公開錄影；影片由課程教師 Graham Neubig 的頻道發布，影片標題與說明對應本課程。本篇是課程總覽，以下為第 1 講介紹影片。

```youtube
url: https://www.youtube.com/watch?v=UwfjzyLnvMg
title: CMU AI Agents 2026: 1. What are Agents and How Do They Work?
```

原始影片：[CMU AI Agents 2026: 1. What are Agents and How Do They Work?](https://www.youtube.com/watch?v=UwfjzyLnvMg)

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：本篇是總覽，嵌入第 1 講影片；通讀該講全程字幕，核對文章引用的講者說法（兩位授課者的自介與研究方向、「做 agent 不難、難的是做好」、約一成人做過 agent RL 的舉手估計、作業合計 40%／專題 50% 與專題 2–3 人、AI 工具政策與「一千行垃圾」說法、slack days 規則、先修門檻 4–7B）皆有依據。修正一處：Neubig 說他開發 OpenHands 是在講 harness 時，不是自介時。官網課表、highlights 的 24 小時規則等不在影片內，仍以官網為準。另依 L10 錄影已上架（2026-10-10）更新進度表。

## 課程形式：先修會被嚴格執行

每週二、四下午上課，一次 80 分鐘，秋假（10/12–16）和感恩節（11/25–27）停課，12/1–3 是期末海報發表。溝通走 Piazza，作業交 Canvas；校外讀者能用的是官網公開的投影片、YouTube 錄影和作業 repo。

**先修是這門課最大的門檻。** 官網寫的是「有訓練神經語言模型的經驗」，建議背景是 11-667、11-711、10-202 或同等經驗。[第一講投影片](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)講得更硬：開學第一週要填表，寫出你修過哪門有語言模型訓練作業的課、作業連結、學期和成績；沒修過的要說明同等經驗，例如做過預訓練或後訓練、或發表過訓練 4–7B 以上模型的研究。達不到的會被請退。

理由也很實際：課程目標是學期結束時每個人都能用強化學習訓練 agent。第一講現場舉手調查時，Neubig 的印象是做過語言模型 RL 的人不多，問到拿 RL 訓練過 agent 的，他估計大約一成（這是講者看台下舉手的口頭估計，不是正式統計）。

### 評分

官網的評分表：

| 項目 | 比重 | 形式 |
|---|---|---|
| Assignment 1：Harness | 10% | 個人 |
| Assignment 2：Eval | 15% | 個人 |
| Assignment 3：Training | 15% | 個人 |
| Lecture highlights | 10% | 個人 |
| 專題提案 | 5% | 2–4 人 |
| 專題期中檢查 | 5% | 2–4 人 |
| 期末發表 | 10% | 2–4 人 |
| 期末報告 | 30% | 2–4 人 |

Lecture highlights 是每講結束後 24 小時內，交一則你自己寫的心得，幾句話就好，重點是一個你真的有想過的收穫。全學期有 22 次機會、算 20 次。Neubig 在第一講說，如果你覺得這講全是先修課教過的東西，也可以照寫，對他們一樣有用。

### AI 工具政策

這門課大多數作業允許用 AI 工具，除非該份作業另外註明。例外只有一條：lecture highlights 必須自己寫。另外兩條規則比較少見：

- **你交出去的每一句主張、引用、結果和每一行程式碼都要負責，而且會被考。** Neubig 說他們也會用 agent 讀你的程式碼、針對你的實作出考題，所以「交一千行 agent 生出來的垃圾」是壞主意，寧可交精簡、自己真的懂的東西。
- **遲交有 slack days。** 三份作業各附兩天、不能轉讓；用完後每多一天（不足一天也算）扣該份作業 5%。專題提案和報告也各有兩天，期末發表沒有。

## 課表：23 講、七個模組

依官網課表（2026-09-29 查看），把各講在官網標註的模組歸併一下，23 講可以分成這幾段（七段是本文的歸併，官網的模組標籤更細）：

| 模組 | 講次 | 主題 |
|---|---|---|
| 導論與 agent 能力 | L1–L5 | 什麼是 agent、工具使用、長 context 管理、技能與記憶、規劃與多 agent 協調 |
| 應用領域 | L6、L7、L10 | Coding agent、computer use agent（JY Koh）、deep research agent（Akari Asai） |
| 訓練方法 | L8、L9、L11、L12 | SFT（Yueqi Song）、RL 基礎、進階 RL 演算法、RL 系統（Apurva Gandhi） |
| 安全 | L13、L16 | Agent 安全（red teaming、沙盒、憑證代管、監控入門、評測）、可觀測性與監控（Eric Wallace） |
| 框架 | L14、L15 | OpenHands、LangGraph |
| 互動 | L17–L19 | Agent 與未來的工作（Zora Wang）、多 agent 互動（Saujas Vaduguru）、人與 agent 互動（Valerie Chen） |
| 搜尋與進階主題 | L20–L23 | Reranking 與 critic model、樹搜尋（JY Koh）、客座 Karthik Narasimhan、客座 Sasha Rush |

11 月初另有兩堂 project hours，不上新內容。

這張表有兩個讀法。第一，它的骨架是第一講提出的「六種能力 × 兩條路」：前五講從 harness 那一側補能力，訓練模組從模型那一側補同一批能力，安全和框架再回到系統工程。第二，課表裡**沒有獨立的評測講次**，評測設計只出現在 Assignment 2；L11 會講 reward hacking 和 benchmark 汙染，到時候你會發現評測寫得好不好，直接決定 RL 學到什麼。

每講在官網都附了大量指定讀物，例如第二講就列了 30 條（不含投影片與錄影），從 [Toolformer](https://arxiv.org/abs/2302.04761) 到 MCP 規格。這個系列每篇會挑跟該講論證直接相關的讀物附連結，不會全部搬過來。

## 三份作業和研究專題

前半學期是三份個人作業，後半學期是團隊研究專題。三份作業剛好對應第一講說的「建構 → 評測 → 訓練」。

**[Assignment 1：Harness](https://github.com/cmu-agents/assignment-1)**（9/14 截止）。在開源 LLM 上自己寫一個 ReAct 迴圈：先做一個在終端機裡修 bug 的 `CodeAgent`，拿它修好一個有問題的西洋棋 app；再替它加上 context 壓縮；最後把同一套迴圈實例化成 `ChessAgent`，自己定義工具去跟規則型 bot 下棋，並試試讓 agent 寫 Python 來呼叫工具。

**[Assignment 2：Eval](https://github.com/cmu-agents/assignment-2)**（10/1 截止）。對象是資料視覺化 agent：給它資料和使用者規格，它畫圖。你要寫一個 validator，只看 agent 的軌跡和最後的圖（沒有標準答案）判斷它對不對、錯在哪裡，再自己設計新的評測任務，最後拿一組你看不到的軌跡評分。

**Assignment 3：Training**（暫定 10/29 截止，尚未公開）。官網只寫「實作用來調整和改進 agent 的訓練流程」。

**研究專題**：挑一個進階 agent 主題，交提案、期中檢查、海報和期末報告。組員人數各處寫法不一：官網的評分表和作業頁寫 2–4 人，但官網課程政策的「Individual and team work」段落和第一講投影片（及講者口述）都寫 2–3 人；實際以 Canvas 和助教公告為準。課程有 Fireworks AI、Modal、Prime Intellect 和 Sail 贊助算力給作業和專題用（第一講投影片第 8 頁與官網贊助商列表）。

作業日期以官網為準：第一講投影片上的日期是「暫定」，A1 原本寫 9/10、A2 寫 9/24、A3 寫 10/22，之後都往後延了（官網目前是 9/14、10/1、10/29，其中 A3 仍標為暫定）。

## 跟其他課的關係

官網自己列了四門內容重疊的 CMU 課，重疊程度都不大：

| 課 | 跟 11-768 重疊的部分 |
|---|---|
| [11-711 Advanced NLP](https://cmu-l3.github.io/anlp-spring2026) | 約兩週 RL 與 agent，偏重 RL 方法 |
| [11-766 LLM Applications](https://cmu-llms.org/schedule/) | 約兩週，工具呼叫、安全、多 agent、程式助理 |
| [11-891 Neural Code Generation](https://cmu-codegen.github.io/f2025/) | 約兩週 code generation agent |
| [11-777 Multimodal ML](https://cmu-mmml.github.io/) | 約一週 GUI agent |

換成本站讀者比較熟的課來定位：[Stanford CS329Z](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents) 也從零寫 agent harness，但重心在系統工程和評測，不碰訓練；[Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 教你從零訓練語言模型，剛好是 11-768 先修要的那種經驗。11-768 站在兩者中間：拿你會訓練模型的能力，去訓練會用工具、會在環境裡行動的 agent。

## 這個系列怎麼讀

系列照官方課序排，每講一篇，作業依官方截止日插在對應位置，一共 27 篇。每篇以該講的逐字稿和投影片為主要來源，完整導讀該講內容；只有投影片的講次會在文中註明，影片上架後補充。作業篇只講要求、架構和設計取捨，不給解答。

目標讀者是會用 LLM API、做過或正在做 agent 的工程師。沒訓練過模型也能讀前半段；訓練模組會用「先講直覺、公式放折疊區」的寫法，並附上本站 CS336 相關篇章當前置。

| 篇次 | 對應 | 主題 | 狀態 |
|---|---|---|---|
| 0 | — | 系列總覽 | 本篇 |
| 1 | L1 | [What Is an Agent?](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent) | 已上線 |
| 2 | L2 | [Tool Use](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use) | 已上線 |
| 3 | L3 | [Context Management for Long-Context Agents](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management) | 已上線 |
| 4 | L4 | [Skills and Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory) | 已上線 |
| 5 | L5 | [Planning, Task Decomposition, Multi-Agent Coordination](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning) | 已上線 |
| 6 | L6 | [Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents) | 已上線 |
| 7 | A1 | [Assignment 1：Harness](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness) | 已上線 |
| 8 | L7 | [Computer Use Agents（JY Koh）](/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents) | 已上線 |
| 9 | L8 | [SFT（Yueqi Song）](/posts/ai/2026-09-29-cmu-11768-lecture-08-sft) | 已上線 |
| 10 | L9 | [RL Basics](/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics) | 已上線 |
| 11 | L10 | [Deep Research Agents（Akari Asai）](/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents) | 已上線 |
| 12 | L11 | [Advanced RL Algorithms](/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl) | 已上線（依投影片，待影片補充） |
| 13 | L12 | [RL Systems（Apurva Gandhi）](/posts/ai/2026-10-10-cmu-11768-lecture-12-rl-systems) | 已上線（依投影片，待影片補充） |
| 14 | A2 | [Assignment 2：Eval](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval) | 已上線 |
| 15 | L13 | [Agent Safety：沙盒、憑證、監控與評測](/posts/ai/2026-10-10-cmu-11768-lecture-13-agent-safety) | 已上線（依投影片，待影片補充） |
| 16 | L14 | [OpenHands](/posts/ai/2026-10-10-cmu-11768-lecture-14-openhands) | 已上線（依投影片，待影片補充） |
| 17 | L15 | LangGraph | 待課程上架 |
| 18 | L16 | Observability & Monitoring（Eric Wallace） | 待課程上架 |
| 19 | L17 | Agents and the Future of Work（Zora Wang） | 待課程上架 |
| 20 | L18 | Multi-Agent Interaction（Saujas Vaduguru） | 待課程上架 |
| 21 | A3 | Assignment 3：Training | 待課程上架 |
| 22 | L19 | Human-Agent Interaction（Valerie Chen） | 待課程上架 |
| 23 | L20 | Reranking & Critic Models | 待課程上架 |
| 24 | L21 | Tree Search（JY Koh） | 待課程上架 |
| 25 | L22 | 客座：Karthik Narasimhan | 待課程上架 |
| 26 | L23 | 客座：Sasha Rush | 待課程上架 |

2026-10-10 的材料狀態：L1–L10 有投影片和錄影，L11–L14 目前只有投影片，L15 之後尚未公開；Assignment 3 的 repo 也還沒公開（截止日 10/29）。

如果只打算讀幾篇，建議順序是：[第 1 講](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent)建立「六種能力 × 兩條路」的地圖，接著讀 A1 看 harness 實際長什麼樣，再讀 A2 和 RL 那幾講，看評測怎麼變成訓練訊號。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：官網新上架第 12–14 講投影片，新增 RL Systems、Agent Safety、OpenHands 三篇導讀並更新進度表。官方把原本的「Sandboxing & Credential Management」改名為 Agent Safety（10/6），第 13 講的內容因此涵蓋 red teaming、沙盒、憑證代管、監控與安全評測；課表模組也改為 Agent Safety、Agent Frameworks 等標籤。
- 2026-10-10：依字幕核對影片內容。一處修正：Neubig 提到開發 OpenHands 的時機；並把 L10 狀態改為已有錄影。

## 參考資料

- [11-768 AI Agents 官網](https://www.cmu-agents.com/)（課程總覽、課表、作業、評分與政策；2026-09-29 查看）
- [第 1 講投影片](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)（先修門檻、評分、AI 工具政策、學期時程）
- [第 1 講錄影](https://www.youtube.com/watch?v=UwfjzyLnvMg)
- [cmu-agents/assignment-1](https://github.com/cmu-agents/assignment-1)（Assignment 1：Build an Agent Harness）
- [cmu-agents/assignment-2](https://github.com/cmu-agents/assignment-2)（Assignment 2：Evaluating a Data-Visualization Agent）
- 站內：[Stanford CS329Z 導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 站內：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)
