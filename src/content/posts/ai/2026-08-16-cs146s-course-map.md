---
title: "Stanford CS146S 兩版大綱對照：一年之間，這門 AI 開發課改掉了什麼"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agentic-coding
  - ai-agent
  - claude-code
  - context-engineering
  - ai-course
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 1
tldr: "Stanford CS146S 的 Fall 2026 大綱把 prompting 從整整一週壓成一節，砍掉終端機與 UI 生成兩週，換上 Agent Skills、Agent-Ready Codebases、Background Agents、AI-Native Team。評分也動了：Final Project 從 80% 降到 50%，多出 30% 的 open source 貢獻。這個系列照十週逐篇讀。"
description: "對照 Stanford CS146S: The Modern Software Developer 的 Fall 2025 與 Fall 2026 大綱，逐項列出十週主題、客座講者與評分比重的差異，並說明沒有 Fall 2026 reading list 時要怎麼自學。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-course-map-en)

Stanford 有一門叫 [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) 的正式學分課，教的不是寫程式，是怎麼指揮 coding agent 寫程式。它在 2025 秋季首開，2026 秋季（9/22 開課）的大綱已經公布——而且**改動幅度大到可以當成一份產業訊號來讀**。

這個系列會照 Fall 2026 的十週逐篇拆。這是第一篇，先把課程本身講清楚，再把兩版大綱擺在一起比。

## 這門課的硬事實

課程官網把 syllabus 塞在前端 chunk 裡，不在 HTML 原始碼中，所以以下數字是從課程網站實際資料物件讀出來的：

- **3 學分**，十週，週二／週四各一堂（Fall 2025 是週一／週五）
- 先修：CS111/CS161 等同的程式經驗，建議修過 CS221/229
- 課程 FAQ 寫每週投入 **10–12 小時**：「Expect approximately 10-12 hours per week including lectures, assignments, and project work.」
- 語言不限，範例以 Python 與 JavaScript 為主
- 開放 Stanford 學生與教職員旁聽，但「we won't be able to grade your homework or give advice on final projects」
- 講師 Mihail Eric，[LinkedIn 上的現職](https://www.linkedin.com/in/mihaileric/)是 Monaco 的 Head of AI，Stanford 兼任講師

Fall 2025 那一版的教材全部公開：每週的 slides、reading list、[GitHub 作業 repo](https://github.com/mihail911/modern-software-dev-assignments) 都能直接點開。這是這門課值得追的主要原因——它不是一份要你報名才看得到的課綱。

站上先前的 [2026 年 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)已經用一節介紹過這門課，但那時只寫到 Fall 2025。以下是新版的部分。

## 十週主題，兩版並排

| 週 | Fall 2025 | Fall 2026 |
|---|---|---|
| 1 | Introduction to Coding LLMs and AI Development | **The Internals of Coding Agents** |
| 2 | The Anatomy of Coding Agents | **Advanced Context Engineering** |
| 3 | The AI IDE | **Agent Skills and CLI** |
| 4 | Coding Agent Patterns | **Customizing Your Agent and Repository** |
| 5 | The Modern Terminal | **Agent-Ready Codebases** |
| 6 | AI Testing and Security | **Agentic Code Review** |
| 7 | Modern Software Support | Security |
| 8 | Automated UI and App Building | **Background Agents** |
| 9 | Agents Post-Deployment | **Building an AI-Native Team** |
| 10 | What's Next for AI Software Engineering | **The Software Factory + The Future** |

粗體是新的或實質重寫的。十週裡只有「安全」這一格兩版都在，其他八格全動過。

## 三個值得注意的改動

**一、prompting 從一週降級成一節。**

Fall 2025 的第一週有整整一堂課叫「Power prompting for LLMs」，reading list 裡有 Google 的 prompt engineering 介紹、[Prompting Guide](https://www.promptingguide.ai/techniques) 的技巧頁、Karpathy 的 LLM 深入影片。Fall 2026 的第一週變成「Course intro + build Claude Code in 200 lines」，第二堂是「deep dive into the system prompts that define the agent」。

prompting 沒有消失，它被併進 Week 2 的「Advanced prompting techniques and when each applies」，跟 RePPIT、spec-driven development、MCP 擠在同一週。一年之間，「怎麼問」從課程的起點變成 context 工程的一個子題。

**二、工具導覽被換成基礎設施。**

Fall 2025 有兩週是繞著特定產品轉的：Week 5「The Modern Terminal」的 reading list 三條全是 Warp 的文件，客座是 Warp CEO Zach Lloyd；Week 8「Automated UI and App Building」客座是 Vercel 的 AI 研究主管。這兩週在 Fall 2026 都不見了。

補上來的是 **Agent-Ready Codebases**（你的 repo 夠不夠格讓 agent 動）、**Background Agents**（非同步、雲端、成群跑的 agent）、**Building an AI-Native Team**（MCP portal、LLM gateway、model routing、成本）。這三個主題有個共同點：它們談的不是你手上那個編輯器，是你周圍那套系統。

**三、評分把「上游貢獻」變成硬指標。**

| 項目 | Fall 2025 | Fall 2026 |
|---|---|---|
| Final Project | 80% | **50%** |
| Weekly Assignments | 15% | 15% |
| Open Source Contributions | — | **30%** |
| Class Participation | 5% | 5% |

期末專案的比重被砍掉 30 個百分點，原封不動地移到「open source contributions」。一門教你用 agent 寫 code 的課，把三成的分數押在「你有沒有把改動推回別人的 repo」——這比任何一句課程描述都更直接地說明它想訓練什麼。

## 客座名單也換了方向

Fall 2025 的客座偏「開發者工具的 CEO」：Warp CEO、Semgrep CEO、Graphite CPO、Vercel AI 研究主管，最後一堂是 a16z 的 Martin Casado。

Fall 2026 目前公布的名單是 [Lee Robinson](https://leerob.com/cursor)（2025 年 7 月從 Vercel 轉去 Cursor 做開發者教育）、Boris Cherny（Claude Code 的作者，這次掛 Anthropic）、Eno Reyes（[Factory](https://factory.ai/) 共同創辦人兼 CTO，講 agent readiness）、Silas Alberti（Cognition）、Isaac Evans（Semgrep）。Week 8、9、10 的客座還寫著 TBD。

Silas Alberti 與 Isaac Evans 兩版都在，但講的東西換了：Alberti 從 Week 3 的「AI IDE」移到 Week 6 的「agentic code review」。

## 沒有 Fall 2026 reading list，怎麼補

寫這篇的時間點（2026 年 8 月中）距離開課還有一個多月，Fall 2026 的 syllabus 只有 topics 與講題，**沒有指定讀物**。Fall 2025 那一版有 45 條 reading，但主題已經對不太上。

但 Fall 2025 的教材是完整公開的，數量如下：

| 材料 | 數量 |
|---|---|
| 指定讀物 | 45 條 |
| 課堂投影片 | 18 份 |
| GitHub 作業 | 8 份 |

所以這個系列的做法是兩層：**Fall 2026 的十週主題當骨架，課堂內容取自 Fall 2025 同主題的公開投影片，主題在 Fall 2025 沒有對應的（Skills、Agent-Ready Codebases、Background Agents、AI-Native Team）才自己去找一手材料**，並且每一段都標清楚是課程說的還是外部來源說的。

投影片不是首頁點得到的東西，但它在 syllabus 分頁的每一堂課旁邊都有連結，是 `docs.google.com/presentation` 的公開檔。實際讀下來，裡面有不少東西在官方文件與部落格上找不到——例如 Week 1 那堂列的四條「Claude 底下實際在做什麼」、Week 3 給的八欄位 design doc 模板、Week 4 那張人／agent 分工表。

自己找的部分則包括：Week 2 的 RePPIT 有講師本人寫的[完整說明](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster)（MLOps Community，2026 年 6 月），Week 5 的 agent readiness 有 [Factory 公開的八柱五級框架](https://factory.ai/news/agent-readiness)，Week 3 的 skills 有 Anthropic 的[官方工程文](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。

## 這個系列怎麼排

十週一週一篇，加這篇總覽共十一篇：

1. 本篇——課程與兩版大綱對照
2. Week 1 agent 內部構造：200 行的 agent loop 與 production system prompt
3. Week 2 context 工程：RePPIT、spec-driven、MCP 與工具設計
4. Week 3 Agent Skills 與 CLI
5. Week 4 客製 agent 與 repo：CLAUDE.md / AGENTS.md、hooks、subagent
6. Week 5 agent-ready codebase
7. Week 6 agentic code review
8. Week 7 安全
9. Week 8 background agents
10. Week 9 AI 原生團隊
11. Week 10 software factory 與未來

## 會過期的東西

- Fall 2026 開課後才會補上的 reading list、slides、作業 repo——課程網站的 Fall 2025 頁面是這些東西最後長什麼樣的參考
- Week 8、9、10 的客座講者目前是 TBD
- 課程行銷語言裡的「世界第一門這類課」「10x productivity」、以及電子報宣稱的「trusted by 32K developers globally」都屬於課程自述，沒有獨立第三方查證
- 兩版大綱的比較是我從課程網站的資料物件逐項對出來的；官方沒有發布 changelog
- 本系列引用的課堂內容全部來自 Fall 2025 投影片。Fall 2026 開課後那幾堂可能講得不一樣

## 參考資料

- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — Fall 2026 課程官網（overview / syllabus / FAQ 三個分頁）
- [CS146S Fall 2025](https://themodernsoftware.dev/fall2025) — 含完整 reading list、slides 與客座名單的舊版
- [CS146S Course | Stanford University Bulletin](https://bulletin.stanford.edu/courses/2274401) — 學校端的課程條目
- [modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments) — Fall 2025 作業 repo（8 份）
- Fall 2025 課堂投影片（18 份）掛在 [fall2025 頁](https://themodernsoftware.dev/fall2025)的 syllabus 分頁，每堂課旁邊的 Slides 連結
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric，MLOps Community，2026-06-02
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，2026-01-20
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering，2025-10-16
- [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide) — 本站，含 CS146S 與其他平台的橫向比較
