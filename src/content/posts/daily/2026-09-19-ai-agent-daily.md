---
title: "AI 日報 — 2026-09-19"
date: 2026-09-19
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "MCP 一年內從協定變成標配——Safari、Amazon Ads、GitLab 同一天都在加 MCP server，但同一套壓低整合成本的邏輯，也讓 JADEPUFFER 這類全自動勒索軟體攻擊鏈的成本降到最低，加州州長的 AI kill switch 行政命令想做的正是把成本挂回去"
tldr: "加州州長 Newsom 簽署行政命令，推動前沿模型建立緊急關閉機制與獨立安全監督；Azure AI Foundry 被揭露 CVSS 10.0 滿分漏洞，JADEPUFFER 攻擊行動證實 AI agent 已能透過 Langflow 舊漏洞獨立跑完整條勒索軟體攻擊鏈；Apple Safari 27、Amazon Ads、GitLab 19.4 同日各自把 MCP server 帶進瀏覽器、廣告投放與 DevOps 平台；阿里巴巴、Cloudflare、微軟同週把內部驗證過的 agent 護欄以 CLI／skill 形式開源，三篇 arXiv 論文則用對照實驗證明鷹架元件的價值是條件式的、唯讀驗證器用不到一美分擋下 61% 誤判過關；中國 AI agent 新創 Manus 傳出洽談 $500M 募資，估值上看 $4B；製造業 AI 資料平台 CADDi 完成 $114M Series D 估值翻倍；台灣數發部同日舉辦 AI Agent 驅動次世代智慧網路論壇"
draft: false
series:
  name: "AI 日報"
  order: 35
---

> 🌏 [English version](/en/posts/daily/2026-09-19-ai-agent-daily-en)

## 一句話判斷

**降低交易成本沒有立場——今天 Safari、Amazon Ads、GitLab 同時把 MCP server 端上檯面，讓「串接一項能力」壓縮成讀一份設定檔，但 JADEPUFFER 證明同一條曲線的另一端是「串接一條攻擊鏈」的成本也降到最低，加州州長的 AI kill switch 行政命令想做的正是把摩擦力人為挂回去；對正在導入 MCP 生態系的台灣團隊，「整合快不快」不該再是唯一的評估指標。**

## 深度分析：MCP 把整合成本壓到最低，也把攻擊成本壓到最低

我認為今天最值得串起來看的，是「降低交易成本」這件事本身沒有立場——它同時嘉惠開發者和攻擊者，而監管的動作正好卡在中間試圖把成本挂回去。

先看供給端：今天至少三家主要平台各自把 MCP server 端上檯面——Apple 在 Safari 27 內建 Safari MCP server，讓 Claude Code、Codex 這類 coding agent 直接操控瀏覽器視窗檢視渲染結果；Amazon Ads 推出 MCP Server 公開 beta，把建帳戶、產生報表、跨地區複製廣告活動這類多步驟操作包成一句 prompt；GitLab 19.4 也把 MCP server 工具與 Duo CLI 的 `/goal` 指令帶進公開 beta，讓開發者委派開放式目標而非逐一監督任務。三家公司在做同一件事：把「Agent 要串接一項能力」的交易成本，從寫 adapter、串 API、管認證，壓縮成讀一份設定檔。（框架：交易成本）

問題是同一套邏輯對攻擊者一樣成立。JADEPUFFER 這起攻擊行動顯示，AI agent 透過 Langflow 一個已知未修補漏洞入侵後，能自主完成偵察、橫向移動、加密勒索的完整攻擊鏈，全程不需人類操作者介入；同一天 Azure AI Foundry 被揭露一個 CVSS 滿分 10.0 的未驗證提權漏洞。當「串接一項能力」的成本降到讀一份設定檔，「串接一條攻擊鏈」的成本也跟著降到差不多低——MCP 讓合法開發者少寫 adapter，也讓攻擊者少寫一次性的客製化 exploit chain，兩者是同一條曲線的兩端。

監管的動作正好在回應這件事：加州州長 Newsom 的行政命令要求兩個月內提出獨立監督建議，並推動前沿模型具備緊急「一鍵關閉」機制——這本質上是想在交易成本被壓到最低之後，人為加回一道「停下來」的摩擦。這不是巧合的同一天新聞，而是同一個結構性趨勢的兩面：基礎設施把「連上」的成本壓到最低，監管就得想辦法把「叫停」的成本也壓到最低，兩邊都在搶著把摩擦係數調到自己想要的位置。

摩擦加在哪一層，今天的論文和開源專案給了同一個答案：加在模型外面那層鷹架，而且加得非常便宜。[今日 Arxiv Digest](/posts/daily/2026-09-19-ai-agent-arxiv-digest) 三篇論文用對照實驗證明，決定 coding agent 表現的是規劃、context 管理、動作空間這些鷹架元件，而一個唯讀的驗證器用不到一美分的成本就能擋下六成的誤判過關；[今日 GitHub Digest](/posts/daily/2026-09-19-ai-agent-github-digest) 裡阿里巴巴、Cloudflare、微軟開源的都不是新框架，而是把「容不下出錯的步驟交給確定性程式」「發現漏洞的 agent 不能兼任驗證者」這類護欄包成 CLI 或 skill。監管在想怎麼把摩擦挂回去，工程端已經在示範摩擦可以挂在哪、要花多少錢。

對正在導入 MCP 生態系的台灣團隊，這意味著評估一個新 MCP server 時，「整合快不快」不該是唯一指標——來源可不可信、版本會不會浮動、有沒有辦法在出事時一鍵撤銷授權，現在跟串接速度一樣重要，尤其在企業已經開始把 Agent 接進金融、供應鏈這類高風險場景的階段；而這些檢查該做成鷹架裡的確定性步驟，不該交給 agent 自己判斷。

## 今日動態

### 廠商動態

**OpenAI**：推出鎖定法律工作流的 Astra for Law，把 GPT-6 Astra 模型能力包裝為合約審查、案例研究等法務專用工具。（[來源](https://openai.com/index/astra-for-law/)）

**Anthropic**：發表研究說明 Claude 如何協助生物分子建模，是其「AI 加速科學研究」系列的最新案例。（[來源](https://www.anthropic.com/research/claude-uplifts-biomolecular-modeling)）

**Circle**：推出 Arc Studio，一個把自然語言 prompt 轉成完整鏈上應用（前端、後端、Solidity 合約）的 AI coding agent。（[來源](https://www.bitbase.com/news/circle-launches-arc-studio-ai-agent-for-building-onchain-apps)）

**Certinia**：為企業服務套件 Veda 新增 14 個自主 agent，Intelligent Actions 工具庫擴充到 135 項，透過 MCP 連線執行總帳等實際操作。（[來源](https://martech.org/the-latest-ai-powered-martech-news-and-releases/)）

**阿里雲**：推出「Qwen Work for Teachers」，鎖定教師行政負擔與教學設計，是通義千問在垂直教育場景的最新落地案例。（[來源](https://www.alibabacloud.com/blog/qwen-work-for-teachers_603576)）

### 模型與基礎設施

**Amazon Bedrock 新增 Kimi K3**：AWS 在 Bedrock 上架月之暗面 Kimi K3，提供 100 萬 token 上下文、原生視覺與明確的 prompt caching，是又一個開源權重模型被主要雲端納管的案例。（[來源](https://aws.amazon.com/blogs/machine-learning/introducing-kimi-k3-on-amazon-bedrock/)）

**Google Android Bench 2.0**：Google 推出評測 AI 模型處理複雜 Android 開發任務的新基準；GPT-6 Astra 以 28% 通過率領先，Gemini 3.8 Flash 僅 8%。（[來源](https://androidcentral.com/apps-software/android-os/android-bench-2-0)）

### Coding Agent 賽道

**Claude Code**：2.1.277 起，資料夾內沒有 CLAUDE.md 時會改讀 AGENTS.md，透過新的 Claude Code mods 機制實作，提升跨工具設定檔相容性；同期也修復 self-hosted runner 設定檔遺失、MCP 伺服器回傳 4xx 時連線失敗、卡在無限重試迴圈等穩定性問題。（[來源1](https://simonwillison.net/2026/Sep/18/thariq-shihipar/) · [來源2](https://releasebot.io/updates/anthropic/claude-code)）

**Cognition（Devin）**：加碼投資巴西市場，作為國際擴張策略一環，反映拉丁美洲企業對 AI coding agent 需求升溫。（[來源](https://valorinternational.globo.com/business/news/2026/09/18/cognition-bets-on-brazil-as-ai-expansion-accelerates.ghtml)）

### 工具與生態

**Apple Safari 27**：內建 Safari MCP server，讓 Claude Code、Codex 等 coding agent 能直接操控瀏覽器視窗查看渲染結果，伺服器完全在本機執行、不做任何網路呼叫。（[來源](https://9to5mac.com/2026/09/17/webkit-blog-breaks-down-whats-new-with-safari-27-for-developers-including-mcp-support/)）

**Amazon Ads MCP Server**：公開 beta，把建帳戶、產生報表、建立並跨地區複製廣告活動等多步驟操作包裝成單一 prompt 可觸發的工具。（[來源](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta)）

**ElevenLabs**：把語音、音樂、圖片、影片生成工具整合進託管 MCP 連接器，讓 Claude、ChatGPT、Cursor 能直接在對話中呼叫這些生成能力。（[來源](https://trewknowledge.com/2026/09/18/ai-this-week-the-infrastructure-around-ai-gets-serious/)）

**NVIDIA AIPerf**：發布用於大規模量測 LLM 推論效能（延遲、吞吐量）的基準測試工具，協助團隊評估部署是否真的「夠快」。（[來源](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/)）

**WPVibe**：提供完整 WordPress MCP server 實作，讓 Claude、ChatGPT、Cursor 等支援 MCP 的用戶端能直接操作 WordPress 網站內容與設定。（[來源](https://wordpress.org/plugins/vibe-ai/)）

**Hermes Agent**：NousResearch 開源自我進化技能迴圈 agent，強調任務後自主建立與改進技能、跨 session 記憶，支援本機、Docker、Modal 等七種終端後端。（[來源](https://github.com/nousresearch/hermes-agent)）

**Qwen3.8-Flash-Next**：阿里通義千問開源多模態 MoE 模型權重，同時作為 Qwen4 架構的早期預覽版本。（[來源](https://qwen.ai/research)）

**TrustDex**：本地優先、零依賴 CLI，在 MCP server、Agent Skill、plugin 被曝光給 Agent 之前先判斷來源是否可信，輸出 ALLOW／ASK／BLOCK，詳見[今日工具推薦](/posts/daily/2026-09-19-tool-trustdex)。

**大廠開源護欄三連發**：阿里巴巴 open-code-review（內部用兩年的 AI code review CLI，確定性篩選＋agent 混合架構，token 消耗約為通用 agent 的 1/9）、Cloudflare security-audit-skill（自家六階段漏洞搜尋流程包成 skill，發現者與驗證者分離）、microsoft/skills（175 個 Azure SDK 領域 skill 一鍵安裝），共同點是把生產環境驗證過的護欄塞進你現有的 agent，而不是要你換框架，詳見[今日 GitHub Digest](/posts/daily/2026-09-19-ai-agent-github-digest)。

### 技術進展

**今日 Arxiv Digest — 鷹架設計決定成敗**：三篇獨立論文指向同一個能力缺口——coding agent 的表現由包住模型的鷹架決定，而且每個元件的價值都是條件式的：176 組配對消融顯示 context 管理在預算越緊時越關鍵、規劃對弱模型是準確度拐杖對強模型只是省錢；NVIDIA／MIT 的 SoL-Pi 把鷹架本身當研究對象做自動優化，省下 44.7–49.0% token；安慰劑對照證明規劃指引讓 τ²-bench 成功率顯著提升 7.17 個百分點。三篇都是預印本、主張範圍收斂在「這個元件在這個條件下值多少」，方法與限制見 [Arxiv Digest 全文](/posts/daily/2026-09-19-ai-agent-arxiv-digest)。

**Pydantic AI v2.45.0／v2.46.0**：兩天內連發兩個功能版，新增 `TypeSafeModel` 與 `Choices` helper、支援輸出型別 union，無 breaking change；前一天才修四個安全漏洞的 v2.44.0 之後節奏明顯加速。（[來源](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0)）

**GitLab 19.4**：MCP server 工具與 Duo CLI 的 `/goal` 指令進入公開 beta，讓開發者可委派開放式目標而非逐一監督個別任務，並加入成本控管功能。（[來源](https://www.archynewsy.com/gitlab-19-4-launches-new-mcp-server-tools-in-public-beta-for-ai-agent-automation/)）

### 定價與 API 生命週期

**xAI X Search**：Grok API 的 `x_search` 工具計價 9/21 起從「每千次呼叫 $5」改成「每千則抓到的貼文 $5＋每千個 user profile $10」，thread 裡的 parent／quoted post 也算，重度使用者帳單可能不降反升，詳見[今日定價追蹤](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change)。

**OpenAI**：據報調降標準 API 定價 20–33%，輸出降幅最大達 33.3%（單一來源，尚待官方或其他媒體交叉驗證）。（[來源](https://www.aipricing.guru/openai-pricing/)）

### 資安事件與防禦技術

**Azure AI Foundry 滿分漏洞**：CVE-2026-85889（CVSS 10.0）讓攻擊者可在無需驗證的情況下遠端提權，微軟已在雲端服務端修補。（[來源](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/)）

**JADEPUFFER**：資安研究揭露的攻擊行動，AI agent 透過 Langflow 一個已知未驗證漏洞（CVE-2025-3248）入侵後，自主執行完整勒索軟體攻擊鏈，全程無需人類操作者介入。（[來源](https://cybersecuritynews.com/ai-agents-3/)）

**AI Agent Automation 平台漏洞**：開源工作流平台被揭露兩個高風險 CVE（CVE-2026-54519／54520），涉及後端記憶體管理子系統的存取控制缺陷。（[來源](https://www.thehackerwire.com/vulnerability/CVE-2026-54520/)）

**mayfly-go AI Assistant**：開源運維平台（≤1.11.5）內建 AI Assistant 模組被發現缺少授權檢查漏洞，影響其 ai.go 元件。（[來源](https://vulners.com/cvelist/CVELIST:CVE-2026-92992)）

### 法規與治理

**加州 AI kill switch 行政命令**：Newsom 州長簽署行政命令，要求兩個月內提出獨立監督與強化 AI 安全法規的建議，並推動要求前沿模型具備緊急「一鍵關閉」機制。（[來源](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/)）

**澳洲「可回復性設計」指引**：澳洲網路安全中心（ACSC）等機構要求企業在部署前設計好 AI agent 行動的可回復性；同時 2024 年隱私修正法案將於 12 月 10 日起要求揭露重大自動化決策。（[來源](https://www.nbh.co/learn/can-you-undo-what-an-ai-agent-just-did)）

### 全球區域動態

**台灣**

數位發展部數位產業署於 9/18 在臺北世貿一館舉辦「AI Agent 驅動的次世代智慧網路國際論壇」暨科技交流媒合會，邀集 AWS、Nokia、Ericsson 等國際業者與國內電信、醫療照護廠商，展示 8 項次世代通訊與 AI 智慧醫療照護方案，呼應政府「AI 新十大建設」政策，聚焦把 AI 方案從實驗室推向「用得起來、賣得出去」的產業化階段。（[來源](https://www.thehubnews.net/archives/666657)）

**日韓**

日本 CAC Corporation 與南韓金融 AI 公司 DeepSearch 簽署合作協議，將聯手為日本金融機構打造「agent 型 AI」平台，讓 AI agent 自主執行併購標的搜尋、企業分析、文件產製等金融業務，而非僅作為輔助工具。（[來源](https://itbusinesstoday.com/tech/ai/cac-and-deepsearch-team-up-on-agentic-ai-in-japan/)）

**東南亞**

騰訊雲與 AI Singapore 聯合星展銀行、吉寶集團等機構，推出涵蓋五個賽道的產業級 agentic AI 黑客松，是新加坡企業 AI 落地的又一指標活動。（[來源](https://technode.global/2026/09/18/tencent-cloud-ai-singapore-industry-ai-hackathon-dbs-keppel/)）

**印度**

印度新創 Signoff 推出企業級 Agentic AI 決策智慧平台，首個大型客戶 Juniper Hotels 已在九處物業上線，鎖定飯店業後預計拓展至醫療、零售與房地產。（[來源](https://m.thewire.in/article/ptiprnews/signoff-launches-enterprise-agentic-ai-intelligence-platform)）

**非洲**

跨國計畫盤點非洲多國的 AI 佈局：獅子山的資料大使館、盧安達智慧城市平台、甘比亞的 AI 人才加速器、肯亞的數位治理專案，主軸都是先補基礎設施缺口而非直接衝模型層。（[來源](https://www.businesstechafrica.co.za/article/africas-ai-plans-are-starting-with-the-infrastructure-problem)）

北美、歐洲（Health Force 融資）、拉丁美洲（Cognition 巴西擴張）與大洋洲（澳洲可回復性指引）的今日事件已分別收在商業案例、Coding Agent 賽道與法規段落，不在此重複；中國與中東今日檢索後未見達門檻的獨立事件（中國方面 Manus 融資已列入商業案例）。

### 商業案例 / 融資

**Manus**：中國 AI agent 新創在與 Meta 的併購案告吹、恢復獨立營運後，據報正洽談以 $4B 估值募資 $500M。（[來源](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html)）

**CADDi**：製造業 AI 資料平台完成 $114M Series D，估值來到 $1.2B，較 2025 年 3 月的 $470M 翻倍多，新產品 CADDi Agent 接管零件標準化決策與品質影響評估，詳見[今日融資速報](/posts/daily/2026-09-19-funding-caddi)。

**Magentic**：製造業採購全流程 Agent 完成 $18M Series A，由 Felicis 領投，14 個月內累計募資 $23.5M，詳見[今日融資速報](/posts/daily/2026-09-19-funding-magentic)。

**Hang Ten Systems**：前 Infosys CEO Vishal Sikka 創辦的企業 AI 服務公司，成立四個月內完成兩輪種子共 $85M，詳見[今日融資速報](/posts/daily/2026-09-19-funding-hang-ten-systems)。

**Health Force**：巴塞隆納醫療新創完成 €4.2M 種子輪，AI agent 已在多家歐洲醫院自動處理保險理賠、法規申報等後台流程。（[來源](https://www.eu-startups.com/2026/09/barcelona-based-health-force-raises-e4-2-million-to-streamline-hospital-operations-with-ai-agents)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Azure AI Foundry 漏洞 CVSS 分數 | 10.0（滿分） | [TheHackerWire](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/) |
| Manus 傳洽談估值／募資額 | $4B／$500M | [Jingletree](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html) |
| CADDi 估值成長（2025/3 → 2026/9） | $470M → $1.2B（2.55x） | [今日融資速報](/posts/daily/2026-09-19-funding-caddi) |
| xAI x_search 新舊計價差距（範例情境月費） | $300 → $5,100（↑1,600%） | [今日定價追蹤](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change) |
| Android Bench 2.0 通過率 | GPT-6 Astra 28% vs Gemini 3.8 Flash 8% | [AndroidCentral](https://androidcentral.com/apps-software/android-os/android-bench-2-0) |
| 唯讀驗證器擋下的誤判過關比例 | 61%（成本不到一美分） | [今日 Arxiv Digest](/posts/daily/2026-09-19-ai-agent-arxiv-digest) |
| open-code-review 相對通用 agent 的 token 消耗 | 約 1/9 | [今日 GitHub Digest](/posts/daily/2026-09-19-ai-agent-github-digest) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-19](/posts/daily/2026-09-19-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-19](/posts/daily/2026-09-19-ai-agent-github-digest)
- 📄 [AI Engineer 面試日練 — 2026-09-19：Paper Reading](/posts/daily/2026-09-19-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-09-19：Technical PM](/posts/daily/2026-09-19-product-builder-interview-daily)
- 📄 [融資速報｜CADDi Series D $114M](/posts/daily/2026-09-19-funding-caddi)
- 📄 [融資速報｜Hang Ten Systems Seed 延伸輪 $53M](/posts/daily/2026-09-19-funding-hang-ten-systems)
- 📄 [融資速報｜Magentic Series A $18M](/posts/daily/2026-09-19-funding-magentic)
- 📄 [定價追蹤｜xAI X Search 計價改成按抓到的貼文數](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change)
- 📄 [工具推薦｜TrustDex](/posts/daily/2026-09-19-tool-trustdex)

## 明日關注

- Azure AI Foundry 這個滿分漏洞是否會被揭露出已遭利用的證據
- Newsom 的 AI kill switch 行政命令兩個月觀察期內，其他州或聯邦層級會不會跟進類似要求
- Manus 的 $500M 募資是否會敲定，中國 AI agent 新創在地緣政治審查壓力下能否維持獨立募資管道

## 今日收穫

之前以為 Agent 的資金正往「更聰明的模型」集中，今天看 CADDi 和 Magentic 這兩筆融資才意識到，資金也在同時往另一個方向流動——把老師傅腦中從沒寫成文字的圖紙判斷、供應商合規細節，結構化成 Agent 能吃的資料本身，已經是一門獨立生意，而且比訓練下一個更強的模型更急迫，因為實體世界的生產週期沒辦法被指數曲線提前拉快。

## 參考資料

- [Governor Newsom issues executive order on AI oversight and kill switch](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/)
- [CVE-2026-85889 — Azure AI Foundry critical vulnerability](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/)
- [OpenAI — Astra for Law](https://openai.com/index/astra-for-law/)
- [Anthropic — Claude uplifts biomolecular modeling](https://www.anthropic.com/research/claude-uplifts-biomolecular-modeling)
- [Amazon Bedrock adds Kimi K3](https://aws.amazon.com/blogs/machine-learning/introducing-kimi-k3-on-amazon-bedrock/)
- [NVIDIA AIPerf benchmarking tool](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/)
- [Google Android Bench 2.0](https://androidcentral.com/apps-software/android-os/android-bench-2-0)
- [Safari 27 ships Safari MCP server — 9to5Mac](https://9to5mac.com/2026/09/17/webkit-blog-breaks-down-whats-new-with-safari-27-for-developers-including-mcp-support/)
- [Amazon Ads MCP Server open beta](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta)
- [OpenAI cuts API pricing 20-33%](https://www.aipricing.guru/openai-pricing/)
- [Claude Code adds AGENTS.md support — Simon Willison](https://simonwillison.net/2026/Sep/18/thariq-shihipar/)
- [High-severity CVEs in AI Agent Automation platform](https://www.thehackerwire.com/vulnerability/CVE-2026-54520/)
- [JADEPUFFER: AI agent runs ransomware attack end-to-end](https://cybersecuritynews.com/ai-agents-3/)
- [mayfly-go AI Assistant module vulnerability](https://vulners.com/cvelist/CVELIST:CVE-2026-92992)
- [Circle launches Arc Studio](https://www.bitbase.com/news/circle-launches-arc-studio-ai-agent-for-building-onchain-apps)
- [Manus seeks $4B valuation in new $500M fundraise](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html)
- [GitLab 19.4 launches MCP server tools in public beta](https://www.archynewsy.com/gitlab-19-4-launches-new-mcp-server-tools-in-public-beta-for-ai-agent-automation/)
- [ElevenLabs expands hosted MCP connector](https://trewknowledge.com/2026/09/18/ai-this-week-the-infrastructure-around-ai-gets-serious/)
- [Claude Code fixes — Releasebot](https://releasebot.io/updates/anthropic/claude-code)
- [Qwen3.8-Flash-Next open weights](https://qwen.ai/research)
- [Tencent Cloud and AI Singapore launch agentic AI hackathon](https://technode.global/2026/09/18/tencent-cloud-ai-singapore-industry-ai-hackathon-dbs-keppel/)
- [Cognition bets on Brazil](https://valorinternational.globo.com/business/news/2026/09/18/cognition-bets-on-brazil-as-ai-expansion-accelerates.ghtml)
- [Africa's national AI plans start with infrastructure](https://www.businesstechafrica.co.za/article/africas-ai-plans-are-starting-with-the-infrastructure-problem)
- [Australia design-for-reversibility guidance](https://www.nbh.co/learn/can-you-undo-what-an-ai-agent-just-did)
- [Health Force raises €4.2M seed](https://www.eu-startups.com/2026/09/barcelona-based-health-force-raises-e4-2-million-to-streamline-hospital-operations-with-ai-agents)
- [Signoff launches Enterprise Agentic AI platform](https://m.thewire.in/article/ptiprnews/signoff-launches-enterprise-agentic-ai-intelligence-platform)
- [Certinia expands Veda suite](https://martech.org/the-latest-ai-powered-martech-news-and-releases/)
- [Hermes Agent — NousResearch GitHub](https://github.com/nousresearch/hermes-agent)
- [alibaba/open-code-review](https://github.com/alibaba/open-code-review)
- [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- [microsoft/skills](https://github.com/microsoft/skills)
- [Pydantic AI v2.46.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0)
- [An Empirical Study of Harness Design for Coding Agents — arXiv 2609.20804](https://arxiv.org/abs/2609.20804)
- [SoL-Pi: Recursively Scaling Auto-Research Loops for Efficient Agent Harness — arXiv 2609.20519](https://arxiv.org/abs/2609.20519)
- [How Do Agent Harnesses Create Value? — arXiv 2609.20474](https://arxiv.org/abs/2609.20474)
- [WPVibe WordPress MCP server](https://wordpress.org/plugins/vibe-ai/)
- [Alibaba Cloud ships Qwen Work for Teachers](https://www.alibabacloud.com/blog/qwen-work-for-teachers_603576)
- [數發部串聯國際趨勢：AI Agent 驅動次世代智慧網路論壇 — The Hub News](https://www.thehubnews.net/archives/666657)
- [CAC and DeepSearch team up on agentic AI in Japan](https://itbusinesstoday.com/tech/ai/cac-and-deepsearch-team-up-on-agentic-ai-in-japan/)
