---
title: "融資速報｜Twin1 AI $20M 種子輪"
date: 2026-08-21
category: daily
tags: [ai-agent, funding, daily, twin1-ai, agent-memory]
lang: zh-TW
description: "Eigen Technologies 原班人馬成立的 Twin1 AI 帶著 $20M 種子輪離開隱身期，Bessemer、Tribeca、Aramco Ventures 共同領投，為每個專業工作者建一個數位分身"
tldr: "Twin1 AI 完成 $20M 種子輪，由 Bessemer Venture Partners、Tribeca Venture Partners、Aramco Ventures 共同領投，估值未揭露。這筆錢賭的是企業知識的原子單位不是文件而是人——當 Agent 都在搶接企業的文件庫，Twin1 反過來去接每個人腦裡沒寫下來的脈絡。"
series:
  name: "AI Agent Funding"
  order: 8
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Twin1 AI（美國聖馬刁 ＋ 英國倫敦雙據點） |
| 輪次 | 種子輪（Seed，離開隱身期同步公布） |
| 金額 | $20M |
| 領投 | Bessemer Venture Partners、Tribeca Venture Partners、Aramco Ventures（三方共同領投） |
| 跟投 | EJF Ventures、Tin Alley Ventures、AGI House Ventures、Neo、F-Prime、Btech Consortium、Antiportfolio Ventures、Lakestar、Notion Capital、Insiders，Orrick 策略投資；天使包含 Dawn Capital 共同創辦人 Haakon Overli、Wiz 共同創辦人 Roy Reznick、Notable Capital 管理合夥人 Hans Tung、前 McKinsey 資深合夥人 Kevin Buehler、氣候科技投資人 Robert Trezona、前 Macquarie Capital 全球共同主管 Dan Wong |
| 估值 | 未揭露 |
| 累計融資 | $20M |
| 成立年份 | 2025 |
| 員工數 | ~5 人（LinkedIn，離開隱身期前的數字） |

## 這家公司做什麼

Twin1 AI 是做「個人層級知識分身」的公司——它為組織裡的每一個專業工作者建一個 AI twin，保存這個人的判斷、關係與工作脈絡，讓專業能力能在組織內被調用，而不需要把私人資料全部開放給所有人。

產品從個人的工作系統取材：Slack、Microsoft Teams、Outlook、Gmail、Google Drive、SharePoint。Twin 能代替本人回答問題、執行部分任務，也能把分散在不同部門的知識串起來。關鍵的架構選擇是它不試圖建一個「整間公司的分身」，而是以個人為單位建 twin 再組成網路，權限與隱私邊界跟著人走。對 Agent 生態最直接的介面是它的 enterprise MCP server：既有的 AI agent 與法律工具可以透過它取得受治理的脈絡，包含單一 twin 或整個 twin network 的知識。模型層刻意做成 model-agnostic，公司說護城河在受治理的脈絡層而非模型。

團隊是 Eigen Technologies 的原班人馬。共同創辦人 Dr. Lewis Z. Liu、Tom Cahn、Huiting Liu、Dr. Jonathan Budd 中有三位來自 Eigen，Eigen 累計募資逾 $100M，服務全球半數最大銀行與 20% 的 AmLaw 100 律所，處理過超過 $100 兆美元的金融合約，2024 年 5 月被 Sirion 收購。Liu 的說法是這次算「未竟之事」——Eigen 在 ChatGPT 之前做企業 AI，做得早但沒吃到後來的紅利。目前公司未公布客戶數或營收。

## 這筆融資的信號

### 對 Agent 生態的意義

Twin1 的切入點正好戳在當前企業 Agent 部署的空缺上。Liu 講的原始洞察來自 Eigen 的一個案子：某全球前十大律所想把 M&A 律師談過的股權購買協議數位化，Eigen 成功把文件變成結構化資料庫，associate 可以查「買方多常在某條款上讓步」——但律所真正想知道的是「為什麼讓步、在什麼情況下、經過什麼談判路徑」，而那些知識散在合夥人的信件、通話、筆記與記憶裡，從來不在文件上。

換句話說，多數企業 Agent 現在能接的是文件庫這個「結果層」，接不到決策的「過程層」。Twin1 把賭注放在後者，而且用 MCP server 把自己定位成別人的補給線而非替代品——現有的法律研究、文件審閱、起草、redline 工具接上 Twin1 就能拿到個人層級的 know-how，而不是產出一份平均值答案。Liu 引用 Kirkland & Ellis 宣布投入 $500M 自建 AI 技術、目標是把律師的「集體智慧」放進平台，作為需求存在的證據；他的商業論點是連 AmLaw 100 與 Magic Circle 裡也很少有律所出得起這種錢。

### 投資人在賭什麼

三家共同領投的組合本身就是通路設計，不是財務配置。Bessemer 提供企業 SaaS 的成長方法論；Tribeca Venture Partners 是紐約在地網路；Aramco Ventures 則直接對應能源業這個垂直。跟投名單同樣照垂直切：法律有 Antiportfolio Ventures（創辦人是前 Kirkland & Ellis 管理合夥人 David Fox）與 Orrick 律所的策略投資，金融服務有 Fidelity 的策略創投臂 F-Prime、EJF Ventures 與 BTech Consortium。對一家產品需要進入律所與銀行這類治理最嚴、採購最慢的客戶的公司來說，這種「投資人即通路」的名單比估值數字更能說明這輪的邏輯。

另一層是團隊 pattern-matching：多位 Eigen 的原始投資人再投一次。Eigen 曾是第一家獲聯準會與 FDIC 核准在無人介入下處理金融合約的 AI 公司——這個資歷在合規敏感的客戶面前是可交易的資產，也是一支 5 人團隊能在種子輪拿到 $20M 的主因。

### 值得觀察的數字

- $20M 種子輪對上 ~5 人的團隊，人均約 $4M。這是典型的「二次創業溢價」定價，不是靠營運指標定出來的。
- 相比之下 Eigen 花了 9 年（2015 成立、2024 被收購）累計募到 $100M+；Twin1 成立第一年單輪就拿到 $20M，說明同一批投資人對同一支團隊的風險定價在 ChatGPT 前後差了一個量級。
- 三方共同領投在種子輪相對少見，通常代表沒有單一投資人拿到主導權，也代表創辦人在議價上佔優勢。
- 未揭露項目偏多：估值、客戶數、營收、ARR 全部沒有公布，離開隱身期的公告目前只能當作團隊與論述的評估，不能當作牽引力的評估。

## Watchlist 狀態

Twin1 AI 尚未在 watchlist 中。建議加入 section B4（Agent 記憶 / Context），與 Mem0、Zep、Letta、LangMem、Cognee 同組追蹤，追蹤重點：以個人而非組織為單位的脈絡層、enterprise MCP server 對外供給受治理脈絡、$20M 種子輪由 Bessemer／Tribeca／Aramco Ventures 共同領投；同時與 section D4（法律 AI）交叉參考，因為首個明確主打的垂直是律所。

## 今日收穫

Agent memory 這個賽道我原本的預設分類是「按資料類型切」——對話記憶、向量記憶、圖記憶。Twin1 提醒了另一條切法：按權限主體切。當記憶層的單位是組織，你必然要處理「誰能看什麼」的授權矩陣，而且矩陣會隨組織成長爆炸；當單位是個人，權限邊界天然跟著人走，跨人調用變成 twin 之間的協商而不是中央權限表的查詢。這個差別在 demo 階段看不出來，但在律所這種「合夥人之間本來就有資訊牆」的組織裡，決定的是產品能不能被買。

## 參考資料

- [Twin1 AI Raises $20 Million Seed Round Co-Led by Bessemer Venture Partners, Tribeca Venture Partners and Aramco Ventures](https://www.morningstar.com/news/business-wire/20260820540841/twin1-ai-raises-20-million-seed-round-co-led-by-bessemer-venture-partners-tribeca-venture-partners-and-aramco-ventures-to-build-digital-ai-twins-for-professional-knowledge-workers) — Business Wire 官方新聞稿
- [AI startup raises $20m to build 'digital twins' of office workers](https://www.cityam.com/ai-startup-raises-20m-to-build-digital-twins-of-office-workers/) — City AM
- [Interview with Twin1 CEO Lewis Liu](https://www.artificiallawyer.com/2026/08/20/interview-with-twin1-ceo-lewis-liu/) — Artificial Lawyer（創辦人專訪）
- [Twin1 AI emerges from stealth with $20M in funding to give every professional an AI-powered digital twin](https://techstartups.com/2026/08/20/twin1-ai-emerges-from-stealth-with-20m-in-funding-to-give-every-professional-an-ai-powered-digital-twin/) — Tech Startups
- [Twin1 AI Raises $20M Seed Round to Scale Enterprise Digital Twins](https://www.citybiz.co/article/892271/twin1-ai-raises-20m-seed-round-to-scale-enterprise-digital-twins/) — citybiz
