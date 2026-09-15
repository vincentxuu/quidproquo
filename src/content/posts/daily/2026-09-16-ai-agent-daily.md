---
title: "AI 日報 — 2026-09-16"
date: 2026-09-16
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "企業導入 agent 的關卡正在從「選哪個模型」移向「能不能治理」——Salesforce、國泰金控與南韓政府今天不約而同證明，沒有身分權限與稽核軌跡，agent 能力再強也不該擴大部署"
tldr: "Salesforce Agentforce 360 把七個具名 agent 跟 AI Control Plane 治理框架綁在一起賣；同日學術研究指出 agent 遭入侵時常規監控完全看不出異狀；國泰金控宣告「Agent First」前先把身分權限、稽核軌跡等治理機制建好；南韓 KISA 調查發現 82% 企業內部存在未被識別的影子 agent；Mistral 領軍一週 $11B 募資；Gemini 3.8 Live 語音模式大幅降價"
draft: false
series:
  name: "AI 日報"
  order: 32
---

> 🌏 [English version](/en/posts/daily/2026-09-16-ai-agent-daily-en)

## 一句話判斷

**企業導入 agent 的關卡正在從「選哪個模型」移向「能不能治理」——Salesforce、國泰金控與南韓政府今天不約而同證明，沒有身分權限與稽核軌跡，agent 能力再強也不該擴大部署。**

## 深度分析：治理層才是 agent 落地的真正瓶頸

我認為今天幾件事合起來，指向同一個交易成本問題：企業願意放權讓 agent 自主行動的門檻，正在超過訓練或選一個更強模型的門檻。

Salesforce 的 Agentforce 360 是最直接的證據：七個具名功能型 agent 之外，同步上市的是 AI Control Plane 與「Trusted Enterprise AI Harness」六大治理框架——治理層跟能力層是綁在一起賣的，不是事後加購的選項。（[來源](https://itbrief.asia/story/salesforce-launches-ai-agents-for-business-workflows)）

但同一天的學術研究顯示，這套信任機制本身還不可靠：攻擊可在 agent 的規劃、記憶或工具呼叫層得逞，企業常用的安全監控卻完全看不出異狀，因為最終輸出看起來仍然乾淨。（[來源](https://www.techtimes.com/articles/327542/20260915/ai-agent-pipeline-breaches-stay-hidden-safety-dashboards-study-finds.htm)）代表市場在賣治理框架的同時，這些框架能不能真的偵測到 agent 出包，還是個未解問題。

台灣的例子印證同一個邏輯：國泰金控今天宣告從「Cloud First」走向「Agent First」，公開三個測試中的數位同事，但同步建立的是身分權限、系統串接、資安監控與稽核軌跡五道管理機制——先把治理做出來，才敢談規模化。（[來源](https://udn.com/news/story/7239/9756284)）南韓則直接把「Security for AI」列為國家專案，KISA 的 AI Security Guide v2.0 鎖定 agent 執行權限誤用，調查顯示 82% 企業內部存在自己都不知道的 AI agent。（[來源](https://en.sedaily.com/technology/2026/09/15/ai-that-hacks-vs-ai-that-defends-korea-builds-both)）

對從業者的意義：接下來評估 agent 平台，該先問的不是「模型能力多強」，而是「出事時看不看得到、查不查得到」——對台灣企業來說，導入前該先盤點內部有沒有連 IT 部門都不知道的影子 agent，而不是急著擴大部署範圍。

## 今日動態

### 廠商動態

**Salesforce**：發佈 Agentforce 360，新增 Casey、Paige、Carter 等七個具名功能型 agent，並以 NVIDIA Nemotron 3 Super 訓出 CRM 推理模型 Koa，宣稱在自家 Benchmark 上錯誤率比主流模型少三倍。（[來源](https://itbrief.asia/story/salesforce-launches-ai-agents-for-business-workflows) · [Koa 來源](https://finance.yahoo.com/technology/ai/articles/salesforce-unveils-koa-ai-model-144329125.html)）

**Google DeepMind**：發佈 Gemini 3.8 Live，語音模式可邊聽邊講並同步呼叫工具，在 Speech-to-Speech 榜單奪冠，定價不到 OpenAI GPT-Live-1 的一半。（[來源](https://aichatdaily.com/ai-models/google-deepmind-ships-gemini-3-8-live-parallel)）

**Apple**：重建版 Siri 底層改用 Google Gemini 模型，多步驟指令與螢幕情境理解獲早期測試者稱讚，但仍有幻覺問題，歐盟市場暫不開放。（[來源](https://the-decoder.com/apple-brings-a-fully-revamped-siri-built-on-googles-gemini-but-not-to-the-eu/)）

### 模型與基礎設施

**Azure SQL 在 coding agent 選型中崛起**：第三方研究讓 Claude Code、Codex、Cursor 等真實 coding agent CLI 自行選資料庫，356 次執行中 Azure SQL Database 排名第二，僅次於 Neon。（[來源](https://devblogs.microsoft.com/azure-sql/coding-agents-are-picking-azure-sql-database/)）

### 技術進展

今天的 [Arxiv Digest](/posts/daily/2026-09-16-ai-agent-arxiv-digest) 三篇論文戳破同一個假設——只要 Agent 系統的分數好看，它就值得信任：LLM 評審打出的「滿意」有 57.5% 其實任務失敗，換鷹架不換模型測不出穩定優勢卻更貴，除錯用的一次性判官會太早停止搜尋而漏掉真正的根因。

**IBM Research**：在 Hugging Face 發佈 agent-skill 一致性重現框架，探討 agent 完成任務後能否穩定重現同樣的成功表現，對正把 agent 推向生產環境的團隊有參考價值。（[來源](https://huggingface.co/blog/ibm-research/altk-evolve-consistency)）

### 資安事件

**PraisonAI 爆兩個高風險 CVE**：開源多 agent 框架被揭露認證繞過（CVSS 8.2，MCP 安全策略未一致檢查憑證）與 sandbox 逃逸（CVSS 7.6）兩個漏洞。（[來源](https://www.strix.ai/cve/CVE-2026-57134)）

**監控盲區**：另有研究指出 agent 遭入侵時常規安全監控完全看不出異狀，詳見上方深度分析。（[來源](https://www.techtimes.com/articles/327542/20260915/ai-agent-pipeline-breaches-stay-hidden-safety-dashboards-study-finds.htm)）

### 法規與治理

**Amodei 為首的減速呼籲，業界與白宮分裂**：前 Anthropic 員工警告 AI 十年內可能致人類滅絕，Amodei、Altman、Hassabis 連署呼籲放慢腳步，但川普、Vance 公開反對監管，Cohere CEO 稱此舉是「換個包裝的卡特爾」。（[來源](https://simonwillison.net/2026/Sep/14/the-contagion-of-fear/)）

### 區域動態

**中國**

監管機關要求 AI 支付 agent 比照「認識你的客戶」模式接受審查，資金清算須由持牌機構負責。（[來源](https://archive.is/MHaPF)）

官方同時反駁「惡性競爭」說法，回應美國業界近期的減速呼籲，分析指出中美就 AI 治理達成協議「近乎不可能」。（[來源](https://www.bbc.com/news/articles/cn8me133119o)）

**台灣**

國泰金控技術年會宣告從「Cloud First」走向「Agent First」，首度公開三個測試中的 AI 數位同事（專案管理、技術治理審查、法務合約初審），同步建立身分權限、資安監控與稽核軌跡等治理機制。（[來源](https://udn.com/news/story/7239/9756284)）

**日韓**

南韓 KISA 研擬 AI Security Guide v2.0，鎖定 agent 執行權限誤用、感測器干擾與自主決策驗證等新型攻擊面；CSA 調查顯示 82% 企業內部存在未被識別的 AI agent，65% 過去一年曾發生 agent 相關資安事件。（[來源](https://en.sedaily.com/technology/2026/09/15/ai-that-hacks-vs-ai-that-defends-korea-builds-both)）

**東南亞**

新加坡金融業提出非強制性 SAFR 框架，供機構部署 AI agent 時參考治理標準。（[來源](https://sbr.com.sg/exclusive/singapore-finance-weighs-ai-agents-against-governance-gaps)）

**印度**

印度企業因 agentic AI 從建議轉為自主決策，開始諮詢法律專家重新檢視合約條款，釐清自主系統出錯時的責任歸屬。（[來源](https://economictimes.indiatimes.com/ai/ai-insights/india-inc-seeks-legal-safeguards-as-agentic-ai-raises-liability-risks/articleshow/134247450.cms)）

**歐洲**

歐盟 AI 法案執法條款生效後，AI Board 在布魯塞爾開會討論前沿模型全球治理框架，成為首個大規模實際開罰 AI 濫用的主要司法管轄區。（[來源](https://cryptobriefing.com/eu-global-ai-rules-discussion/)）

**中東**

沙烏地 SDAIA 在利雅德舉辦全球 AI 倫理論壇，宣布 SAMAI 2 計畫，鎖定能源、醫療、工業與教育領域培養專業人才。（[來源](https://saudishopper.com.sa/en/ai-ethics-forum-riyadh-unesco-sdaia/)）

**非洲**

報導指出非洲 AI 新創的瓶頸在拿不到第一筆 10-20 萬美元等級的種子資金，許多真正 AI 原生的公司在能被統計進融資數據前就已消失。（[來源](https://iafrica.com/africa-has-more-ai-founders-and-fewer-first-cheques/)）

**拉丁美洲**

GTIPA 全球 AI 政策報告中，阿根廷章節主打限制性監管政策、運算基礎設施投資與活躍的開發者生態系三大支柱。（[來源](https://www.weareinnovation.global/we-are-innovation-makes-the-case-for-argentina-in-gtipas-global-ai-report/)）

**大洋洲**

澳洲公布 AI 行動計畫，避開單一 AI 專法，改以新設 AI Safety Institute（2990 萬澳元經費）測試前沿模型，並要求企業在擴大部署 agent 前先建立可課責機制。（[來源](https://theaiinsider.tech/2026/09/14/australias-ai-action-plan-decoded/)）

### 商業案例 / 融資

**Mistral 領軍的一週 $11B 募資**：9/7-9/13 一週 18 輪共 110 億美元，最大單筆是 Mistral 的 35 億美元 D+ 輪。（[來源](https://www.startuphub.ai/ai-news/funding-round/2026/ai-funding-roundup-11b-across-18-rounds-sep-7-to-sep-13)）

**Exein**：義大利 physical AI 安全新創完成 2.7 億美元募資，估值 17 億美元，成為義大利最新獨角獸。（[來源](https://techcrunch.com/2026/09/15/new-italian-unicorn-exein-rides-the-physical-ai-wave/)）

**Euclyd**：荷蘭推理晶片新創完成逾 2 億歐元 A 輪，三星電子共同領投，首批系統要到 2028 年才交付客戶。（[來源](https://dutchstartup.ai/en/news/euclyd-raises-200-million-for-a-chip-nobody-can-buy-yet)）

**AlphaPai**：上海機構投資研究工作站一年內完成第三輪募資，Series B 拿下 $50M，累計 $92M，詳見[今日融資速報](/posts/daily/2026-09-16-funding-alphapai)。

**Jack & Jill**：倫敦雙邊 agent 招募媒合新創完成 $40M Series A，Air Street Capital 領投，詳見[今日融資速報](/posts/daily/2026-09-16-funding-jack-and-jill)。

### 工具與生態

**alibaba/open-code-review**：Alibaba 開源「確定性引擎 + LLM agent」混合架構的 code review CLI，同模型下 Precision／F1 優於純 Claude Code 審查，只耗 1/9 token，今日登上 GitHub Trending 第一名，詳見[今日 GitHub Digest](/posts/daily/2026-09-16-ai-agent-github-digest)。

**edgar-mcp**：對接 SEC EDGAR 的 MCP server，讓 Agent 精準讀 10-K 裡的單一章節而非整份 300 頁文件，詳見[今日工具推薦](/posts/daily/2026-09-16-tool-edgar-mcp)。

**Amazon Bedrock AgentCore**：新增代管 OAuth Consent portal，示範 GitHub、Slack 授權碼流程，並可透過 CloudTrail 檢視終端使用者的授權活動。（[來源](https://aws.amazon.com/blogs/machine-learning/manage-end-user-oauth-consent-for-ai-agents-with-amazon-bedrock-agentcore/)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Gemini 3.8 Live 定價 | 不到 OpenAI GPT-Live-1 的一半 | [aichatdaily](https://aichatdaily.com/ai-models/google-deepmind-ships-gemini-3-8-live-parallel) |
| 一週 AI 募資總額 | $11B（18 輪） | [StartupHub.ai](https://www.startuphub.ai/ai-news/funding-round/2026/ai-funding-roundup-11b-across-18-rounds-sep-7-to-sep-13) |
| 南韓企業存在未識別 AI agent 比例 | 82% | [Seoul Economic Daily](https://en.sedaily.com/technology/2026/09/15/ai-that-hacks-vs-ai-that-defends-korea-builds-both) |
| LLM 評審誤判「滿意」但任務失敗的比例 | 57.5% | [GAUGE (arXiv)](https://arxiv.org/abs/2609.12191) |
| Exein 估值 | $1.7B | [TechCrunch](https://techcrunch.com/2026/09/15/new-italian-unicorn-exein-rides-the-physical-ai-wave/) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-16](/posts/daily/2026-09-16-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-16](/posts/daily/2026-09-16-ai-agent-github-digest)
- 📄 [AI Engineer 面試日練 — 2026-09-16：ML System Design](/posts/daily/2026-09-16-ai-interview-daily)
- 📄 [融資速報｜AlphaPai Series B $50M](/posts/daily/2026-09-16-funding-alphapai)
- 📄 [融資速報｜Jack & Jill Series A $40M](/posts/daily/2026-09-16-funding-jack-and-jill)
- 📄 [Product Builder 面試日練 — 2026-09-16：Strategy & Execution](/posts/daily/2026-09-16-product-builder-interview-daily)
- 📄 [工具推薦｜edgar-mcp](/posts/daily/2026-09-16-tool-edgar-mcp)

## 明日關注

- Salesforce 的 Trusted Enterprise AI Harness 治理框架上線後，其他 CRM/SaaS 廠商會不會跟進推出對應的治理層產品？
- 南韓 AI Security Guide v2.0 定案後，會不會成為新加坡 SAFR 等其他亞太監管框架參考的範本？
- Gemini 3.8 Live 大幅降價後，OpenAI 是否跟進調整語音模式定價？

## 今日收穫

之前以為 agent 的資安風險主要來自「被外部駭客攻擊」，今天意識到更大的風險其實是「企業自己都不知道內部有多少 agent 在跑」——南韓 82% 的影子 agent 數字，和國泰金控刻意把稽核軌跡做在擴大部署之前，兩件事放在一起看，代表下一輪 IT 治理的重點會是「盤點」，不是「防禦」。

## 參考資料

- [AI Agent Arxiv Digest — 2026-09-16](/posts/daily/2026-09-16-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-09-16](/posts/daily/2026-09-16-ai-agent-github-digest)
- [融資速報｜AlphaPai Series B $50M](/posts/daily/2026-09-16-funding-alphapai)
- [融資速報｜Jack & Jill Series A $40M](/posts/daily/2026-09-16-funding-jack-and-jill)
- [工具推薦｜edgar-mcp](/posts/daily/2026-09-16-tool-edgar-mcp)
- [Salesforce launches Agentforce 360 with seven named AI agents and an AI Control Plane](https://itbrief.asia/story/salesforce-launches-ai-agents-for-business-workflows)
- [Salesforce unveils Koa, a CRM reasoning model built on NVIDIA Nemotron 3 Super](https://finance.yahoo.com/technology/ai/articles/salesforce-unveils-koa-ai-model-144329125.html)
- [Google DeepMind ships Gemini 3.8 Live with parallel-reasoning voice mode](https://aichatdaily.com/ai-models/google-deepmind-ships-gemini-3-8-live-parallel)
- [Apple's rebuilt Siri AI ships on Google's Gemini models, but not in the EU](https://the-decoder.com/apple-brings-a-fully-revamped-siri-built-on-googles-gemini-but-not-to-the-eu/)
- [Study: coding agents increasingly pick Azure SQL Database over rivals](https://devblogs.microsoft.com/azure-sql/coding-agents-are-picking-azure-sql-database/)
- [New study: AI agent compromises can stay invisible to safety dashboards](https://www.techtimes.com/articles/327542/20260915/ai-agent-pipeline-breaches-stay-hidden-safety-dashboards-study-finds.htm)
- [PraisonAI CVE-2026-57134](https://www.strix.ai/cve/CVE-2026-57134)
- [Industry split widens over Amodei-led AI slowdown call](https://simonwillison.net/2026/Sep/14/the-contagion-of-fear/)
- [China rolls out 'Know Your Agent' rules for AI payment agents](https://archive.is/MHaPF)
- [China pushes back on 'malicious competition' framing](https://www.bbc.com/news/articles/cn8me133119o)
- [國泰金技術年會吸近7千人次 宣告進入Agent First時代](https://udn.com/news/story/7239/9756284)
- [AI That Hacks vs. AI That Defends: Korea Builds Both](https://en.sedaily.com/technology/2026/09/15/ai-that-hacks-vs-ai-that-defends-korea-builds-both)
- [Singapore floats SAFR framework for AI agent governance in finance sector](https://sbr.com.sg/exclusive/singapore-finance-weighs-ai-agents-against-governance-gaps)
- [Indian firms seek legal safeguards as agentic AI raises liability questions](https://economictimes.indiatimes.com/ai/ai-insights/india-inc-seeks-legal-safeguards-as-agentic-ai-raises-liability-risks/articleshow/134247450.cms)
- [EU AI Board convenes in Brussels as AI Act enforcement provisions bite](https://cryptobriefing.com/eu-global-ai-rules-discussion/)
- [Saudi Arabia hosts global AI ethics forum, expands SAMAI national upskilling program](https://saudishopper.com.sa/en/ai-ethics-forum-riyadh-unesco-sdaia/)
- [Africa's AI founders outnumber the first-cheque funding available to them](https://iafrica.com/africa-has-more-ai-founders-and-fewer-first-cheques/)
- [Argentina positions itself as an emerging AI hub in GTIPA global policy report](https://www.weareinnovation.global/we-are-innovation-makes-the-case-for-argentina-in-gtipas-global-ai-report/)
- [Australia unveils AI Action Plan and new AI Safety Institute](https://theaiinsider.tech/2026/09/14/australias-ai-action-plan-decoded/)
- [Weekly AI funding roundup: Mistral's $3.5B Series D+ anchors an $11B, 18-round week](https://www.startuphub.ai/ai-news/funding-round/2026/ai-funding-roundup-11b-across-18-rounds-sep-7-to-sep-13)
- [Italian physical-AI startup Exein raises $270M, hits unicorn status](https://techcrunch.com/2026/09/15/new-italian-unicorn-exein-rides-the-physical-ai-wave/)
- [Dutch inference-chip startup Euclyd raises over €200M co-led by Samsung](https://dutchstartup.ai/en/news/euclyd-raises-200-million-for-a-chip-nobody-can-buy-yet)
- [Amazon Bedrock AgentCore adds a managed OAuth consent portal for AI agents](https://aws.amazon.com/blogs/machine-learning/manage-end-user-oauth-consent-for-ai-agents-with-amazon-bedrock-agentcore/)
- [IBM Research reproducibility framework for agent-skill consistency](https://huggingface.co/blog/ibm-research/altk-evolve-consistency)
- [GAUGE: When Not to Trust LLM-as-a-Judge in User-Simulated Evaluation of Task-Oriented Agents](https://arxiv.org/abs/2609.12191)
