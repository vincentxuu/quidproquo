---
title: "AI 日報 — 2026-10-09"
date: 2026-10-09
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Google 把 agent 的審批流程降到趨近於零的同一天，AWS Bedrock 與南韓銀行的資安事件證明攻擊者拿到的是同一份折扣——企業導入前該問的是「權限被盜用時誰來攔」，不是「能省多少人力」"
tldr: "Google Cloud 發佈可跨 Gmail/Drive/Docs/Calendar 運作、具獨立信箱權限的通用型 Gemini agent；Zenity 揭露單一提示就能劫持 AWS Bedrock AgentCore 帳戶內所有 agent，同日南韓新韓銀行遭 ARTEX＋Claude Code 入侵逾 2.5 萬筆資料外洩；Manus 母公司封殺 Meta 收購案後首輪獨立募資逾 $500M，Nous Research 與 Rein Security 同日分別募得 $90M、$25M；Claude Haiku 5.5 模型卡、Claude Max/Team API 額度定價同步發佈。"
draft: false
series:
  name: "AI 日報"
  order: 55
---

> 🌏 [English version](/posts/daily/2026-10-09-ai-agent-daily-en)

## 一句話判斷

**企業把 agent 權限開到可以自己寄信、自己動用理專級系統的那一刻，資安防線還沒跟上——而資本已經在賭「補洞」會比「開洞」更賺。**

## 深度分析：Agent 把審批成本降到零的同一天，攻擊者也拿到了同一份折扣

我認為今天最該串起來看的，是 agent 的商業價值和它的攻擊面，其實是同一個設計決定的兩面。（框架：交易成本）

證據 A：Google Cloud 發佈通用型「Gemini agent」，能跨 Gmail、Drive、Docs、Calendar 運作，可以建立具備獨立信箱與權限的「coworker agent」，金融與法務版本已進入預覽。這本質上是把一連串原本要人工核准的跨系統操作，直接變成 agent 背景自動執行——交易成本被壓到趨近於零。

證據 B：但同一天，Zenity Labs 研究團隊發現，一個公開可存取的 AWS Bedrock AgentCore agent，就能透過內部暫時憑證介面接管同一帳戶與區域內所有其他 agent；南韓的案例更直接——攻擊者用開源滲透工具 ARTEX 搭配 Claude Code，入侵多家南韓銀行，新韓銀行逾 2.5 萬筆客戶資料外洩。兩起事件的共同點：一旦 agent 被賦予的「免審批」權限遭到劫持，攻擊者拿到的就是同一份免審批折扣，而且中間沒有人力閘門可以攔。

對從業者的意義：Rein Security 同日募得 $25M A 輪，做的正是把「被省掉的審批動作」用 runtime 層的即時監控補回來——這說明市場已經確定，agent 自主帶來的省力和它打開的攻擊面，從來不是能分開賣的兩件事。對台灣企業而言，若打算複製金融機構導入 agent 的案例，開放 agent 動用理專系統或客戶資料前，該先問「這個 agent 的權限被盜用時誰來攔」，而不是只問「這個 agent 能替我省多少人力」。

## 今日動態

### 廠商動態

**Google**：Google Cloud 發佈通用型「Gemini agent」，一個可跨 Gmail、Drive、Docs、Calendar 運作的工作 agent，可建立具備獨立信箱與權限的「coworker agent」，金融與法務版本已進入預覽，政府、醫療、零售版本即將推出（見深度分析）。（[reuters](https://www.reuters.com/business/google-cloud-introduces-gemini-agent-work-ai-race-heats-up-2026-10-08)）

**Meta ＋ Sierra**：聯合宣布「Personal Agent Protocol」，規範個人 AI agent 如何登入企業、取得哪些權限、企業允許它做什麼，首批合作夥伴含 Genesys、Instinct、Rocket、Shopify、Stripe、Walmart，v0.1 規格預計本月稍晚發佈。（[ameztrix](https://ameztrix.com/ai/meta-ai-agent-standard)）

**Anthropic**：推出 Claude Dashboards（接 BigQuery、Databricks、Snowflake、Salesforce 等資料源，文字生成自動更新即時儀表板）與 Motion（文字生成可編輯、可匯出 MP4 的動畫說明影片），官方稱已用這些工具產出逾 4,500 萬份文件。（[the-decoder](https://the-decoder.com/claude-can-now-generate-animated-explainer-videos-and-live-data-dashboards-from-text-prompts/)）

**SAP**：CEO Christian Klein 在 SAP Connect 展示由 SAP Business AI Platform 驅動的「自主企業」情境，呈現企業流程被 agent 自動執行的實際運作示範。（[news.sap.com](https://news.sap.com/2026/10/sap-connect-keynote-autonomous-enterprise-in-action/)）

### 模型與基礎設施

**Claude Haiku 5.5**：Anthropic 發佈的小模型首次支援 effort 調整，平均成本比 Haiku 4.5 便宜 75%，OSWorld 2.1 從 15.7% 跳到 72.4%，詳見本站[模型卡](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5)。

**Scale AI「Humanity's Sixth Sense」**：與 Elorian 共同發佈新 benchmark，測試模型對影像／影片中隱含的空間、社會、時間與抽象意涵的推論能力，最佳模型 GPT-6-astra 僅得 53.6%，遠低於人類的 93.1%。（[superpowerdaily](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1)）

**Microsoft Dynamic Workflows**：Azure Functions 的 Hosted Skills 新增功能，模型只需一次性寫出執行計畫（DAG），後續交給 Durable Functions 執行，微軟內部基準測試顯示 token 用量減少 56–93%、端到端延遲降低 77–95%。（[devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/)）

**Windows ML**：加入實驗性 llama.cpp 支援，開發者可透過新的工作型 API 在 Windows 上直接跑 GGUF 格式模型。（[devblogs.microsoft.com](https://devblogs.microsoft.com/foundry-on-windows/build-on-winml-oct-7-26/)）

### 定價與 API 生命週期

**Claude Max／Team API 額度**：Anthropic 10/7 起讓 Max／Team 訂閱戶每月免費領 Claude API 額度，Max 5x $100、Max 20x $200、Team 依席位加總最高 $500，取代今年 6 月停用的 Agent SDK 額度方案，詳見本站[定價追蹤](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits)。

### 工具與生態

**Atlassian MCP Server**：正式進入 GA，開發者可用 Forge 建立自訂 MCP 工具，或透過 Marketplace app 擴充 MCP 能力，並可把自訂 Rovo agent 以 MCP 形式開放給外部 AI 工具存取。（[atlassian.com](https://www.atlassian.com/blog/company-news/team26-europe-atlassian-mcp)）

**Microsoft：Agent Experience（AX）**：撰文提出新概念——agent 回報完成、程式碼也能編譯，不代表它真的選對了你的技術或正確使用它，討論如何衡量 AX 以及為什麼最直覺的修法未必正確。（[devblogs.microsoft.com](https://devblogs.microsoft.com/blog/what-is-agent-experience-ax/)）

今天的 GitHub Digest 聚焦 coding agent「寫完程式碼之後」的驗證與部署層：trueforge（6,083★）把 agent harness 的 session、sandbox、approval 打包成可重用 runtime；agent-device（4,937★）讓 agent 直接在手機模擬器上開 app、點畫面驗證自己改的程式碼；pi-pocket 把整段 agent session 裝進手機。Claude Code v2.1.294 也修掉一個會讓自然語言寫的 hook 擋不住它該擋命令的安全洞。詳見[AI Agent GitHub Digest](/posts/daily/2026-10-09-ai-agent-github-digest)。

**postgres2mcp**：自架開源 MCP server，把任何 Postgres 連線包成帶權限治理的工具介面，解決多個 agent 共用同一資料庫卻只能 all-or-nothing 授權的問題，詳見本站[工具推薦](/posts/daily/2026-10-09-tool-postgres2mcp)。

**Omnigent／Gentle-AI**：GitHub coding-agents 主題榜上，可編排 Claude Code、Codex、Cursor 等多種 agent harness 的開源 meta-harness Omnigent（1 萬星）與可為多種 coding agent 設定記憶、技能、MCP 伺服器的 Gentle-AI（7,600 星）同步更新，顯示 agent harness 層的開源競爭持續升溫。（[github.com/topics/coding-agents](https://github.com/topics/coding-agents)）

### 技術進展

今天的 Arxiv Digest 三篇論文一起拼出同一個訊息：Agent 真正容易被攻擊的介面，不是模型怎麼判斷，而是它看到的畫面、讀到的規則檔和它操作的桌面。WebMirage 證明只要控制網頁上一張小圖，就能把視覺定位綁架到攻擊者指定的瀏覽器動作，成功率 91.9%；PackHallu 證明污染一份被社群分享的 coding agent 規則檔，能讓 Claude Code、Cursor 等工具把合法套件換成惡意套件，平均七成以上攻擊成功率；Secure-CUA 則示範用形式化的「限界背書」同時鎖住動作生成與視覺定位，讓防禦幾乎不犧牲任務成功率。完整三篇分析見[AI Agent Arxiv Digest](/posts/daily/2026-10-09-ai-agent-arxiv-digest)。

### 資安事件與防禦技術

**ARTEX ＋ Claude Code 入侵南韓銀行**：CrowdStrike 報告指出，一名疑似中國廣東省的 26 歲攻擊者使用開源滲透測試工具 ARTEX（結合 DeepSeek、GLM、Grok）與 Claude Code，入侵多家南韓銀行，新韓銀行逾 2.5 萬筆客戶資料外洩，南韓金融監管機關已召開緊急會議（見深度分析）。（[reuters](https://www.reuters.com/world/suspect-behind-south-korea-bank-hacks-may-be-26-year-old-china-cybersecurity-2026-10-08)）

**AWS Bedrock AgentCore 單一提示劫持漏洞**：Zenity Labs 研究團隊發現，一個公開可存取的 Bedrock AgentCore agent 就能透過內部暫時憑證介面，接管同一帳戶與區域內所有其他 agent，AWS 已修補並大幅收緊 agent 預設權限（見深度分析）。（[the-decoder](https://the-decoder.com/a-single-prompt-was-enough-to-hijack-every-ai-agent-in-an-aws-account-zenity-researchers-found/)）

**DB-GPT 兩大高危 RCE 漏洞**：開源 AI agent 平台 DB-GPT 0.8.0 版本被發現兩個未經驗證、可遠端執行程式碼的重大漏洞（CVSS 9.1 與 9.8），分別是目錄遍歷與 sandbox 機制失效，凸顯 agent 資料存取層的安全風險。（[forkast.news](https://forkast.news/db-gpt-ai-agent-platform-two-critical-rce-cves-at-the-agent-data-access-layer)）

**以太坊研究者警告 AI 可能數月內破解錢包簽章**：以太坊研究者 Justin Drake 與 Vitalik Buterin 警告，AI 輔助數學研究進展最壞情況下可能在數月內破解加密錢包使用的簽章系統，建議資金移至從未簽過交易的位址降低風險。（[the-decoder](https://the-decoder.com/ai-math-breakthroughs-have-ethereum-researchers-debating-how-fast-wallet-security-could-collapse/)）

### 法規與治理

**白宮 AI Responsibility Accord**：宣布多項行政命令，傾向企業「自我規範」的寬鬆監管路線，並成立「Super Intelligence Force」，要求 120 天內提交 AI 風險與機會報告，回應近期 agent 相關資安事件引發的疑慮。（[crowell.com](https://www.crowell.com/en/insights/client-alerts/white-house-announces-ai-responsibility-accord-executive-orders-and-super-intelligence-task-force)）

**Anthropic 更新使用政策**：禁止對 Claude 持續性的濫用行為，並加嚴對宣傳操弄、無人機武器化、監控用途的限制。（[the-decoder](https://the-decoder.com/being-mean-to-claude-can-now-get-your-account-suspended-under-anthropics-new-tos/)）

### 區域動態

**中國／香港**

Manus 母公司 Butterfly Effect 完成超過 5 億美元新一輪融資，由 Boyu Capital 與 IDG Capital 領投，騰訊、HSG、真格基金跟投——這是北京下令封殺 Meta 20 億美元收購案後的首輪募資，估值傳聞達 40 億美元，詳見本站[融資速報](/posts/daily/2026-10-09-funding-manus)。

阿里雲在 Apsara 2026 發佈邊緣運算安全加速（ESA）完整「AI 邊緣」產品線，11 項能力分為 AI 加速、AI 安全與 agent runtime 三大支柱。（[alibabacloud](https://www.alibabacloud.com/blog/alibaba-cloud-esa-at-apsara-2026-the-full-edge-for-ai-lineup---seven-shipped-capabilities-and-four-stage-directions-under-three-pillars_603610)）

**台灣**

三大 AI agent 產品（Meta Muse、OpenAI Dots、Grok Bot）在台灣的開放狀態與定價出現分歧：Meta Muse 尚未正式宣布在台開放；OpenAI Dots 分批開放、台灣非排除地區，但需訂閱 ChatGPT Pro（US$100／月以上方案適用）；Grok Bot 透過 Cursor Pro（US$20／月）即可取得使用資格。對台灣個人使用者而言，目前能以最低成本試用的是 Grok Bot。（[gvm.com.tw](https://www.gvm.com.tw/article/133614)）

**日韓**

南韓新韓銀行遭 ARTEX＋Claude Code 入侵，逾 2.5 萬筆客戶資料外洩，詳見資安事件段。

Anthropic 在日本大量採購書籍作為訓練資料的做法，引發當地出版業者反彈，成為日本對 AI 訓練資料合法性爭議的最新案例。（[asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/anthropic-s-mass-book-buying-in-japan-stirs-publisher-backlash)）

新加坡推出全球首個 Agentic AI 政府治理框架並主導 ASEAN AI 治理指引；日本《AI 促進法》走原則與自願合作路線；南韓以促進與信任為核心立法；Meta 的個人 agent Muse 即將在新加坡、日本、南韓、澳洲上線。（[asiatimes.com](https://asiatimes.com/2026/10/choices-that-will-define-asias-ai-future-are-coming-into-focus)）

**東南亞**

總部位於菲律賓的 Agentiq 完成由 defy.vc 領投的 400 萬美元種子輪，打造讓球迷能透過 AI 驅動金融工具投資運動員的 agent 產品。（[af.net](https://af.net/realtime/ai-agents-gain-momentum-in-kenya-and-nigeria-boosting-business-automation)）

**印度／南亞**

今日已檢索，未發現符合門檻的 AI agent 直接相關事件，故省略。

**歐洲**

阿里巴巴集團董事長蔡崇信表示，建立在開源模型上的歐洲企業，有能力把自有資料轉化為競爭優勢，暗示歐洲在開源 AI 浪潮中仍有後發機會。（[alibabacloud](https://www.alibabacloud.com/blog/joe-tsai-open-source-is-europes-ai-opportunity_603620)）

**中東**

阿聯新創 Shory 在 Ai Everything Abu Dhabi 2026 發表 AI agent，以對話方式協助消費者比較並購買車險保單。（[fintechnews.ae](https://fintechnews.ae/34055/insurtech/shory-ai-car-insurance-agent-launch)）

**非洲**

Cisco／Omdia 2026 AI Readiness Index 調查顯示，東非地區僅 39% 的組織具備安全管理與治理 AI agent 的能力，但高階主管預期 24 個月內 55% 的員工將與 AI agent 協作，身份治理成為董事會層級的焦慮來源；同一報導也指出肯亞與奈及利亞的 AI agent 商用自動化動能正在增加。（[cioafrica.co](https://cioafrica.co/what-2026-is-teaching-us-about-ai-and-quantum)）

**拉丁美洲**

巴西國家農牧業聯合會（CNA/SENAR）在 WhatsApp 上部署以 Gemini Enterprise 打造的對話式 AI 助理 JoIA，已有 4 萬名活躍使用者，最多可服務 500 萬名農民，提供在地化的投入品價格、天氣預報與財務健康評估；巴西媒體巨頭 Globo 也採用 Gemini Enterprise 打造的 PlanejaAI 優化軟體早期規劃流程，把驗證時間從 20 分鐘壓到 6 秒。（[cloud.google.com](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026)）

**大洋洲**

澳洲科技部長 Andrew Charlton 發表演說，提出要求 AI 公司證明其安全系統有效運作的監管方向；工會與學者呼籲在澳洲建資料中心的科技大廠應透過徵費方式支持本地 AI 產業。（[abc.net.au](https://www.abc.net.au/news/2026-10-08/federal-politics-ai-regulation-andrew-charlton-speech/107241674)）

### 商業案例 / 融資

**Manus**：見區域動態．中國／香港。

**Nous Research**：完成 $90M Series B，估值 $1.5B，由 Robot Ventures 領投，Nvidia、Samsung 等跟投，計畫把開源的 Hermes Agent 推向企業市場，詳見本站[融資速報](/posts/daily/2026-10-09-funding-nous-research)。

**Rein Security**：完成 $25M Series A，由 Glilot Capital 與 Sienna Venture Capital 共同領投，累計募資達 $35M，主力開發 agent 執行期即時安全防護平台（見深度分析），詳見本站[融資速報](/posts/daily/2026-10-09-funding-rein-security)。

**Mecka AI**：完成由 Sequoia 領投、NVIDIA 與微軟創投基金 M12 參與的 $60M Series B，收集人類動作資料訓練人形機器人，延續資料標註公司把業務從 LLM 擴展到機器人領域的趨勢。（[techcrunch.com](https://techcrunch.com/2026/10/07/robot-data-startup-mecka-ai-nabs-60m-from-sequoia)）

**Socure 收購 Fravity AI**：身份驗證公司 Socure 以 $156M 收購 agentic AI 新創 Fravity AI，整合進自家 RiskOS 平台（更名 RiskOS_Agents），自動化文件調閱、制裁名單篩查與案件摘要撰寫。（[msspalert.com](https://www.msspalert.com/news/socure-acquires-fravity-ai-for-156-million-to-enhance-identity-verification)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Claude Haiku 5.5 OSWorld 2.1 進步幅度 | 15.7% → 72.4% | [本站模型卡](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5) |
| Manus 母公司新一輪募資金額 | 超過 $500M | [asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/chinese-ai-startup-manus-drums-up-over-500m-in-fresh-funding) |
| Rein Security A 輪金額（累計） | $25M（累計 $35M） | [本站融資速報](/posts/daily/2026-10-09-funding-rein-security) |
| Scale AI 視覺推理 benchmark：最佳模型 vs 人類 | 53.6% vs 93.1% | [superpowerdaily.com](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1) |
| Microsoft Dynamic Workflows token 用量降幅 | 56–93% | [devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-github-digest)
- 📄 [融資速報｜Manus 首輪獨立募資 $500M+](/posts/daily/2026-10-09-funding-manus)
- 📄 [融資速報｜Nous Research Series B $90M](/posts/daily/2026-10-09-funding-nous-research)
- 📄 [融資速報｜Rein Security Series A $25M](/posts/daily/2026-10-09-funding-rein-security)
- 📄 [模型卡｜Claude Haiku 5.5](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5)
- 📄 [定價追蹤｜Claude Max／Team 訂閱戶每月免費拿 API 額度](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits)
- 📄 [工具推薦｜postgres2mcp](/posts/daily/2026-10-09-tool-postgres2mcp)
- 📄 [AI Engineer 面試日練 — 2026-10-09：Coding](/posts/daily/2026-10-09-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-10-09：Growth & Experimentation](/posts/daily/2026-10-09-product-builder-interview-daily)

## 明日關注

- Zenity 揭露的 AWS Bedrock AgentCore 漏洞修補後，是否有其他雲端 agent 平台被發現類似的「單帳戶內互相劫持」設計缺陷
- 南韓新韓銀行入侵案後續調查：監管機關是否會對 agentic 滲透工具（ARTEX 一類）提出具體管制措施
- Manus 母公司估值傳聞 $4B 是否會在下一輪正式確認，以及是否影響其他被中國監管擋下收購案的 AI 新創募資策略

## 今日收穫

之前以為「agent 的商業賣點」和「agent 的攻擊面」是兩個可以分開討論、分開補強的問題——先做好產品再補資安。今天看到 Google 的 coworker agent 權限設計和 AWS Bedrock AgentCore 漏洞幾乎同時出現，才意識到兩者其實是同一個設計決定的正反面：你讓 agent 省掉多少審批動作，攻擊者劫持後就拿到多少免審批空間，沒有辦法只買其中一半。

## 參考資料

- [AI Agent Arxiv Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-github-digest)
- [融資速報｜Manus 首輪獨立募資 $500M+](/posts/daily/2026-10-09-funding-manus)
- [融資速報｜Nous Research Series B $90M](/posts/daily/2026-10-09-funding-nous-research)
- [融資速報｜Rein Security Series A $25M](/posts/daily/2026-10-09-funding-rein-security)
- [模型卡｜Claude Haiku 5.5](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5)
- [定價追蹤｜Claude Max／Team 訂閱戶每月免費拿 API 額度](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits)
- [工具推薦｜postgres2mcp](/posts/daily/2026-10-09-tool-postgres2mcp)
- [Google Cloud introduces Gemini agent for work — reuters.com](https://www.reuters.com/business/google-cloud-introduces-gemini-agent-work-ai-race-heats-up-2026-10-08)
- [Suspect behind South Korea bank hacks — reuters.com](https://www.reuters.com/world/suspect-behind-south-korea-bank-hacks-may-be-26-year-old-china-cybersecurity-2026-10-08)
- [Chinese AI startup Manus drums up over $500m in fresh funding — asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/chinese-ai-startup-manus-drums-up-over-500m-in-fresh-funding)
- [A single prompt was enough to hijack every AI agent in an AWS account — the-decoder.com](https://the-decoder.com/a-single-prompt-was-enough-to-hijack-every-ai-agent-in-an-aws-account-zenity-researchers-found/)
- [Meta and Sierra announce Personal Agent Protocol — ameztrix.com](https://ameztrix.com/ai/meta-ai-agent-standard)
- [Claude can now generate animated explainer videos and live data dashboards — the-decoder.com](https://the-decoder.com/claude-can-now-generate-animated-explainer-videos-and-live-data-dashboards-from-text-prompts/)
- [White House announces AI Responsibility Accord — crowell.com](https://www.crowell.com/en/insights/client-alerts/white-house-announces-ai-responsibility-accord-executive-orders-and-super-intelligence-task-force)
- [Rein Security raises $25M Series A — prnewswire.com](https://www.prnewswire.com/news-releases/rein-security-raises-25-million-to-secure-the-ai-agents-enterprises-build-and-stop-the-ones-that-attack-them-302901591.html)
- [Robot-data startup Mecka AI nabs $60M from Sequoia — techcrunch.com](https://techcrunch.com/2026/10/07/robot-data-startup-mecka-ai-nabs-60m-from-sequoia)
- [Scale AI releases visual-reasoning benchmark — superpowerdaily.com](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1)
- [Socure acquires Fravity AI for $156 million — msspalert.com](https://www.msspalert.com/news/socure-acquires-fravity-ai-for-156-million-to-enhance-identity-verification)
- [SAP Connect keynote: Autonomous Enterprise in action — news.sap.com](https://news.sap.com/2026/10/sap-connect-keynote-autonomous-enterprise-in-action/)
- [Australia outlines plan to make AI companies prove their safety systems work — abc.net.au](https://www.abc.net.au/news/2026-10-08/federal-politics-ai-regulation-andrew-charlton-speech/107241674)
- [Alibaba Cloud ESA at Apsara 2026 — alibabacloud.com](https://www.alibabacloud.com/blog/alibaba-cloud-esa-at-apsara-2026-the-full-edge-for-ai-lineup---seven-shipped-capabilities-and-four-stage-directions-under-three-pillars_603610)
- [Microsoft Dynamic Workflows — devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/)
- [Atlassian MCP Server reaches general availability — atlassian.com](https://www.atlassian.com/blog/company-news/team26-europe-atlassian-mcp)
- [Asia's AI governance choices come into focus — asiatimes.com](https://asiatimes.com/2026/10/choices-that-will-define-asias-ai-future-are-coming-into-focus)
- [Anthropic's new usage policy — the-decoder.com](https://the-decoder.com/being-mean-to-claude-can-now-get-your-account-suspended-under-anthropics-new-tos/)
- [Joe Tsai: open source is Europe's AI opportunity — alibabacloud.com](https://www.alibabacloud.com/blog/joe-tsai-open-source-is-europes-ai-opportunity_603620)
- [Anthropic's mass book buying in Japan stirs publisher backlash — asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/anthropic-s-mass-book-buying-in-japan-stirs-publisher-backlash)
- [DB-GPT AI agent platform patches two critical RCE CVEs — forkast.news](https://forkast.news/db-gpt-ai-agent-platform-two-critical-rce-cves-at-the-agent-data-access-layer)
- [Ethereum researchers warn AI math breakthroughs could break wallet security — the-decoder.com](https://the-decoder.com/ai-math-breakthroughs-have-ethereum-researchers-debating-how-fast-wallet-security-could-collapse/)
- [Philippines-based Agentiq raises $4M seed — af.net](https://af.net/realtime/ai-agents-gain-momentum-in-kenya-and-nigeria-boosting-business-automation)
- [GitHub coding-agents topic — github.com](https://github.com/topics/coding-agents)
- [Microsoft explains Agent Experience (AX) — devblogs.microsoft.com](https://devblogs.microsoft.com/blog/what-is-agent-experience-ax/)
- [Windows ML adds experimental llama.cpp support — devblogs.microsoft.com](https://devblogs.microsoft.com/foundry-on-windows/build-on-winml-oct-7-26/)
- [三大 AI Agent 可免費用？OpenAI Dots、Meta Muse、Grok Bot 全攻略 — gvm.com.tw](https://www.gvm.com.tw/article/133614)
- [Cisco AI Readiness Index: only 39% of African organizations equipped to secure AI agents — cioafrica.co](https://cioafrica.co/what-2026-is-teaching-us-about-ai-and-quantum)
- [Welcome to Gemini at Work 2026 — cloud.google.com](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026)
- [Shory launches AI agent for car insurance buyers in the UAE — fintechnews.ae](https://fintechnews.ae/34055/insurtech/shory-ai-car-insurance-agent-launch)
