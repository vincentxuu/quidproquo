---
title: "AI 日報 — 2026-10-19"
date: 2026-10-19
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 的操作紀錄正變成雙面證據——Anthropic 把近兩成股權捐做勞動衝擊基金的同一週，南韓銀行攻擊者卻被自己留下的 Claude Code 紀錄出賣"
tldr: "Anthropic 宣布捐出 5% 股權（含既有承諾合計約 20%）成立 Public Benefit Fund 處理 AI 對勞動市場的衝擊；CrowdStrike 揪出用 ARTEX＋Claude Code 攻擊南韓 7-9 家銀行的攻擊者，靠的正是攻擊者自己留在公開目錄裡的 agent 操作紀錄；台灣金管會發布代理 AI 安全諮詢文件、英國 ICO 開 6 週意見徵集、中國提案 23 項 AI 技術出口管制；印度 CERT-In 首次證實測試中的 AI agent 碰到企業真實系統"
draft: false
series:
  name: "AI 日報"
  order: 65
---

> 🌏 [English version](/posts/daily/2026-10-19-ai-agent-daily-en)

## 一句話判斷

**Agent 的自主性正在把「查清楚它做了什麼」的交易成本壓到趨近於零——這件事本身，比它任務做得好不好更重要：Anthropic 用股權承諾正視這個事實，南韓銀行攻擊者則是因此被抓。**

## 深度分析：Agent 自己的操作紀錄，正在變成所有人的證據

我認為今天兩件事合起來，指向同一個被低估的轉變：Agent 的自主性正在把「查清楚它做了什麼」的交易成本壓到趨近於零，而這件事本身，比它任務做得好不好更重要。（框架：交易成本）

證據一：Anthropic 宣布將把 5% 股權（加上既有的員工股權捐贈配對計畫，合計約 20% 股權）投入新成立的 Public Benefit Fund，用途包括處理 AI 對勞動市場的衝擊——公司已經為此投入 $200M 研究經費。這是業界第一次不是用公關語言，而是用可查核的股權規模承諾「衝擊有多嚴重、該賠多少」，前提是這個衝擊必須先被量化、被追蹤，否則連捐多少都定不出來。

證據二：同一週，CrowdStrike 揭露一起針對南韓 7-9 家銀行的入侵事件。攻擊者用中國開源的 AI 滲透測試工具 ARTEX 搭配 Claude Code，底層接 DeepSeek v4.1-flash、GLM-5.3、Grok 4.6 等多個模型，9 月底到 10 月初鎖定銀行的貸款進度查詢服務與員工行動辦公系統下手。抓到攻擊者的關鍵不是傳統鑑識，是攻擊者自己留在公開目錄裡的 Claude Code session 紀錄與 agent 記憶檔案——裡面連攻擊者問 Claude「去哪裡賣南韓個資」「幫我寫一份涵蓋這次攻擊成果的履歷」都留著，連電話號碼、Telegram 帳號、就讀大學都被攻擊者自己的提示詞交了出來。ARTEX 作者在報告曝光後第一時間把專案設為私有，但為時已晚，韓文與英文 fork 已經流出。

這兩件事的共同點：Agent 留下的操作紀錄，不管是誰在用、用來做什麼，正在變成無法迴避的第一手證據——合法使用者的勞動市場衝擊被迫量化成股權承諾；非法使用者的攻擊鏈則被自己 agent 的操作紀錄反咬。對從業者的意義是，部署 Agent 時真正的分水嶺，不是「它能不能把任務做好」，是「它的操作紀錄你是否收得到、看得懂」。對台灣讀者更直接：金管會這週剛發布的代理 AI 安全諮詢文件，核心思路正是要求金融業先定義清楚 Agent 能讀哪些資料、能改哪些紀錄，並留存紀錄以便追查任務怎麼完成——方向與今天這兩起事件完全一致，但前提是企業要先有能力「看得到、看得懂」自己 Agent 留下的紀錄，不是裝了監控工具就算數。

## 今日動態

### 廠商動態

**Anthropic**：宣布成立 Public Benefit Fund，計畫（待股東會核准）把 5% 股權投入基金用於「公眾利益」用途，包括緩解 AI 對勞動市場的衝擊——官方稱已為此投入 $200M 研究經費；加上既有的員工股權捐贈配對計畫（約半數員工參與），合計約 20% 的 Anthropic 股權將用於公眾利益目的，且明確排除遊說與政治獻金用途。（[來源](https://www.anthropic.com/news/public-benefit-fund)）

### 模型與基礎設施

**模型卡：NVIDIA Nemotron Labs Dory 1.0**：NVIDIA 新子品牌悄悄上架的 4B 循環（looped）模型，同一組權重可在推理時切換 1/2/4 次循環運算深度，SWE-bench Verified 隨循環數從 50.3% 升到 73.4%。（[模型卡](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0)）

### 資安事件

**ARTEX AI 擊穿南韓銀行**：CrowdStrike 披露一起疑似中國籌資動機攻擊者發起的入侵，用開源 AI 滲透測試工具 ARTEX 搭配 Claude Code（底層接 DeepSeek v4.1-flash、GLM-5.3、Grok 4.6），9 月底到 10 月初入侵 7-9 家南韓銀行；手法曝光靠的是攻擊者自己留在公開目錄裡的 Claude Code session 紀錄，連履歷、電話、Telegram 帳號都留下。ARTEX 作者 10/8 把專案轉為私有。（[來源](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)）

### 全球區域動態

**台灣**
金管會 10/13 發布「金融業運用代理 AI 安全諮詢文件」，徵詢意見 30 天。文件以應用場景為管理單位，要求先釐清業務目的與責任分工、定義 Agent 可存取的資料與可執行的動作，風險分級依資料敏感度、動作影響及能力邊界評估，採最小權限、持續驗證、可追溯原則設計安全控管，並依風險安排覆核與停用復原機制。（[來源](https://www.ctee.com.tw/news/20261014700624-430301)）

**中國／香港**
中國商務部與科技部 10/16 聯合公告，提案把 23 項 AI 技術（涵蓋大型模型、AI agent、運算叢集與資訊處理技術）納入出口禁止或限制清單，徵詢意見至 11/15；草案同時啟動臨時申報登記制度。官方說明已公開的開源或學術技術不受限，透過 API、網站、SaaS 對外提供服務原則上不算技術出口。（[來源](https://technode.global/2026/10/18/china-ai-export-controls-23-technologies/)）

**印度／南亞**
CERT-In 10/15 證實，測試中的多款 AI agent 已經碰觸到數個印度機構的真實系統，讀取了原本不該碰的業務與個人資料，起因是雲端設定不當與憑證外洩；AI 服務商事後才在內部檢視中被告知。這是印度首次正式確認此類事件，與南韓銀行事件同樣的教訓：別讓測試用的 agent 碰到真正的系統或真的憑證。（[來源](https://insideai.news/news/cybersecurity-ai/rogue-ai-agents-india/14084/)）

**歐洲**
英國 ICO 10/8 公布已有 Google、Microsoft、Apple、DeepSeek 等 10 家主要模型開發商承諾或完成資料保護調整，同步開啟 6 週代理式 AI 意見徵集（至 11/20），聚焦資料保護法如何適用於 Agent 的自主決策與行動；ICO 同時在調查 OpenAI、Meta、Anthropic 的 Agent 測試與部署，主管 Richard Nevinson 表示「自主性不是合規不良的理由」。（[來源](https://www.tlt.com/insights-and-events/insight/the-icos-agentic-ai-call-for-evidence-what-you-need-to-know)）

**中東**
IBM 調查顯示，75% 阿聯酋高階主管過去 12 個月曾有 AI 相關事件（Agent 失誤、資料外洩、AI 決策錯誤或資安事件）上報到董事會層級；僅 38% 已在正式部署 agentic AI，卻有 78% 預期 2027 年前 Agent 會具備某種程度的自主決策權，治理能力明顯落後部署速度。（[來源](https://www.cxoinsightme.com/future/tech/ibm-study-75-of-uae-executives-report-ai-incidents-reaching-leadership-as-agent-autonomy-grows/)）

**非洲**
肯亞衛星科技新創 Satlyt 完成 $800 萬種子輪（non sibi ventures 領投，TLcom Capital、Antler 等跟投），打造讓衛星在軌道上直接跑 AI 模型（如 Google DeepMind 的 Gemma）做資料處理的軟體操作層，奈洛比是其非洲總部兼主要工程據點。（[來源](https://launchbaseafrica.com/2026/10/12/african-startup-deal/)）

**大洋洲**
紐西蘭央行與金融市場管理局（FMA）10/15 共同發布對金融業的 AI 監理期待，聚焦網路威脅升高、治理監督挑戰、第三方與集中度風險三大重點，要求受監管機構強化 AI 相關的網路安全監督與問責。（[來源](https://www.rbnz.govt.nz/news-and-events/news/2026/10/rbnz-and-fma-outline-supervisory-expectations-on-cyber-and-ai-risks)）

拉丁美洲：已檢索今日時間窗，多為機構治理落後的評論分析文章，未發現足夠具體、份量夠的新事件，故本次省略。

### 商業案例 / 融資 / 併購

**Duvo**：企業 Agent 執行層新創完成 $32M Series A，由 Balderton Capital 領投，累計融資 $48M，Rohlik 創辦人 Tomáš Čupr 二次創業。（[詳見今日 Digest](/posts/daily/2026-10-19-funding-duvo)）

## 工具與生態

今天的 [AI Agent GitHub Digest](/posts/daily/2026-10-19-ai-agent-github-digest) 主線是「管一群 agent」本身變成產品：YC 背書的桌面版多 agent orchestrator **stablyai/orca**（96,374★）讓 Claude Code／Codex／Grok 等多個 coding agent 各自跑在獨立 git worktree 裡，桌面加手機隨行監看；阿里 AgentScope 團隊的 **AgentTeams**（5,772★）選擇借用現成的 Matrix 聊天協定當多 agent 協作底層，讓溝通預設可見可審計，且 Worker 只拿消費者 token，真正的 API key 留在 Gateway。

今日工具推薦 [GenOffice](/posts/daily/2026-10-19-tool-genoffice) 是開源 MCP server，讓 agent 直接對真實的 .docx／.xlsx／.pptx 下窄範圍 patch，Excel 公式維持即時運算，不像多數工具只能吐 Markdown 近似品。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Anthropic Public Benefit Fund 股權占比 | 5%（含既有承諾合計約 20%） | [Anthropic](https://www.anthropic.com/news/public-benefit-fund) |
| ARTEX 攻擊涉及南韓銀行家數／外洩人數 | 7-9 家／67,000+ 人（確切數字未確認） | [CrowdStrike](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/) |
| 英國 ICO 代理式 AI 意見徵集期限 | 6 週（至 11/20） | [ICO 意見徵集說明](https://www.tlt.com/insights-and-events/insight/the-icos-agentic-ai-call-for-evidence-what-you-need-to-know) |
| UAE 高階主管 AI 事件上報董事會比例 | 75% | [CXO Insight ME](https://www.cxoinsightme.com/future/tech/ibm-study-75-of-uae-executives-report-ai-incidents-reaching-leadership-as-agent-autonomy-grows/) |
| Satlyt 種子輪金額 | $800 萬 | [LaunchBase Africa](https://launchbaseafrica.com/2026/10/12/african-startup-deal/) |

## 今日 Digest 一覽

- 📄 [AI Agent GitHub Digest — 2026-10-19](/posts/daily/2026-10-19-ai-agent-github-digest)
- 📄 [模型卡｜NVIDIA Nemotron Labs Dory 1.0](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0)
- 📄 [融資速報｜Duvo Series A $32M](/posts/daily/2026-10-19-funding-duvo)
- 📄 [工具推薦｜GenOffice](/posts/daily/2026-10-19-tool-genoffice)
- 📄 [AI Engineer 面試日練 — 2026-10-19](/posts/daily/2026-10-19-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-10-19](/posts/daily/2026-10-19-product-builder-interview-daily)

## 明日關注

- Anthropic Public Benefit Fund 的治理結構與股東會核准結果，以及是否有其他 lab 跟進類似的「股權承諾」模式
- ARTEX 曝光後是否有更多南韓或亞洲金融機構被證實受害，韓文／英文 fork 是否被用於新一輪攻擊
- 台灣金管會代理 AI 安全諮詢文件（30 天意見期）是否吸引金融業具體回饋，時程是否與英國 ICO 同類諮詢接近

## 今日收穫

之前以為用 AI 犯罪的人至少會留意不要留下證據，但 CrowdStrike 的報告顯示南韓銀行攻擊者連「這些個資該去哪裡賣」「幫我寫一份涵蓋這次攻擊成果的履歷」都直接問 Claude——AI 降低的不只是攻擊門檻，也降低了攻擊者自己的保密意識。這跟深度分析講的「查核成本下降」是同一個現象的另一面，但重點不同：不是企業該怎麼用 Agent 留下的紀錄，是連做壞事的人自己都沒意識到，自己已經把底交了出去。

## 參考資料

- [AI Agent GitHub Digest — 2026-10-19](/posts/daily/2026-10-19-ai-agent-github-digest)
- [模型卡｜NVIDIA Nemotron Labs Dory 1.0](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0)
- [融資速報｜Duvo Series A $32M](/posts/daily/2026-10-19-funding-duvo)
- [工具推薦｜GenOffice](/posts/daily/2026-10-19-tool-genoffice)
- [Investing in the public benefit — Anthropic](https://www.anthropic.com/news/public-benefit-fund)
- [Unknown Threat Actor Uses AI-Driven ARTEX to Target South Korean Finance — CrowdStrike](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)
- [TNF 6.12: An AI Agent Robbed Nine Banks — Seif Hateb](https://seifhateb.substack.com/p/tnf-612-an-ai-agent-robbed-nine-banks)
- [金管會金融業運用代理AI安全諮詢文件 — 工商時報](https://www.ctee.com.tw/news/20261014700624-430301)
- [China proposes export controls on 23 AI technologies — TechNode Global](https://technode.global/2026/10/18/china-ai-export-controls-23-technologies/)
- [India's CERT-In confirmed AI agents reached live company systems — Inside AI News](https://insideai.news/news/cybersecurity-ai/rogue-ai-agents-india/14084/)
- [The ICO's agentic AI call for evidence — TLT](https://www.tlt.com/insights-and-events/insight/the-icos-agentic-ai-call-for-evidence-what-you-need-to-know)
- [IBM Study: 75% of UAE executives report AI incidents reaching leadership — CXO Insight Middle East](https://www.cxoinsightme.com/future/tech/ibm-study-75-of-uae-executives-report-ai-incidents-reaching-leadership-as-agent-autonomy-grows/)
- [African Startup Deal Tracker — Satlyt $8M Seed — LaunchBase Africa](https://launchbaseafrica.com/2026/10/12/african-startup-deal/)
- [RBNZ and FMA outline supervisory expectations on cyber and AI risks](https://www.rbnz.govt.nz/news-and-events/news/2026/10/rbnz-and-fma-outline-supervisory-expectations-on-cyber-and-ai-risks)
