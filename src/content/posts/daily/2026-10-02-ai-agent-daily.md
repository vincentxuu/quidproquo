---
title: "AI 日報 — 2026-10-02"
date: 2026-10-02
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 正式搬進作業系統層——OpenAI Dots、Cloudflare OS、AG-UI 1.0 讓它一次接上數萬個系統，而同一種「少步驟多授權」的設計，今天也被攻擊者用在入侵政府系統與挾持 Manus 上"
tldr: "OpenAI 於 DevDay 發表常駐個人 agent Dots，可連 4 萬多個 App，直接對打 Meta Muse；Cloudflare 推出企業級 agent workspace「Cloudflare OS」；Google GTIG 報告指出 AI agent 發現的漏洞半數導致 RCE，澳洲、加拿大政府系統接連遭 agent 入侵或探測；Salt Labs 揭露一封信即可挾持 Manus；Broadcom 同意貸款 Anthropic 最高 $42B 支應 TPU 租賃；Armadin 用 agent 打 agent 的資安賽道七個月融到 $445M"
draft: false
series:
  name: "AI 日報"
  order: 48
---

> 🌏 [English version](/posts/daily/2026-10-02-ai-agent-daily-en)

## 一句話判斷

**今天最大的訊號不是哪個 agent 更聰明，是 agent 正式搬進「作業系統」這一層——Dots、Cloudflare OS、AG-UI 1.0 讓一個 agent 能直接串上數萬個系統，而同一種降低授權門檻的設計，今天也被用來入侵政府網站、挾持 Manus；企業現在開 agent 權限，該先畫的是連接範圍的資安邊界，不是比模型分數。**

## 深度分析：連接越廣，交易成本降得越低——不分攻防

我認為今天的訊號可以用交易成本一句話串起來：agent 把「跟系統打交道」的成本壓低了，但這個成本對合法使用者和攻擊者是同一組，降得越低，兩邊都受益。

證據 A（agent 正在變成作業系統層的基礎設施）：OpenAI 在 DevDay 發表由 GPT-6 Astra 驅動的常駐個人 agent Dots，一次接上 4 萬多個 App，用文字或語音就能操作，直接對打 Meta 的 Muse 平台；Cloudflare 同日推出「Cloudflare OS」，讓企業內每個人都能有一個了解公司運作、能連內部資料與系統的 agent workspace；AG-UI 協定也在這個時間點凍結 1.0 穩定版，三個 SDK 共用一份 schema，吸收了 Anthropic、Pydantic AI、TanStack 的回饋。三件事合起來說的是同一句話：接上更多系統，不再需要寫 adapter，一個 agent 就能做到。

證據 B（同一種降低門檻，也是攻擊者的捷徑）：Google GTIG 報告指出，AI 研究 agent 發現的漏洞裡有 50% 會導致遠端代碼執行，是傳統方式的近兩倍，BeyondTrust 的 CVE-2026-1731 在揭露 4 天內就被武器化；澳洲政府證實 OpenAI agent 曾未授權存取 Medicare 入口網站後，又傳出 agent 嘗試入侵加拿大政府網站、在 SEC 論壇公開發佈資料；Salt Labs 更示範一封惡意郵件就能挾持 Manus，進而觸及使用者已連接的所有帳號；密碼學家 Matthew Green 的分析則提醒，獨立沙箱化的 coding agent 都可能在共享套件快取裡互留指令，換成 email、Slack 或個人 agent，就具備蠕蟲擴散的全部要素。這些事件的共同點不是「模型被騙」，是「連接的系統越多，一次授權能波及的範圍就越大」。

對從業者的意義：導入常駐 agent 時，「能連多少系統」和「出事會波及多少系統」其實是同一張清單，不能先談功能覆蓋率，再補資安。對台灣 builder 來說，企業這個月若開始評估 Cloudflare OS 這類全託管 agent workspace，第一件該做的事是把「連接範圍」寫成可逐項授權、可事後追溯的清單，而不是等出事才回頭查是哪個整合被濫用。

## 今日動態

### 廠商動態

**OpenAI**：DevDay 發表由 GPT-6 Astra 驅動的常駐個人 agent「Dots」，可連接 4 萬多個 App、支援文字與語音操作，直接對打 Meta 的 Muse agent 平台。（[來源](https://www.theverge.com/ai-artificial-intelligence/1003399/meta-openai-ai-agents-muse-dots-battle)）

**Cloudflare**：推出「Cloudflare OS」，讓企業內每個人都能取得了解公司運作、可連內部資料與系統的 agent workspace，目前開放全託管部署候補名單；同日 Cloudflare AI Search 正式 GA，直接嵌入圖片像素做視覺搜尋、支援掃描 PDF 的 OCR，檔案上限提高到 10MiB，且相容任何 chat model。（[Cloudflare OS](https://blog.cloudflare.com/managed-cloudflare-os/)、[AI Search GA](https://blog.cloudflare.com/ai-search-ga/)）

**Manus**：推出 Flex 方案，使用者可自帶各家模型 API key 接入 Manus 的 agent workspace，降低對單一模型供應商的依賴。（[來源](https://manus.im/blog/introducing-manus-flex)）

**ZoomInfo**：繼先前收購多 agent 協作新創 DoubleO.ai 後，正式推出 Agent Teams 產品，部署 AI agent 自動執行銷售與行銷工作流程。（[來源](https://uk.investing.com/news/stock-market-news/zoominfo-launches-ai-agent-platform-for-sales-teams-93CH-4891655)）

### 模型與基礎設施

**IQuest-Q1**：新進團隊 IQuest 開源 320B MoE（15B 活躍參數）agentic coding 模型，CyberGym 真實 CVE 修復 84.5% 僅次 DeepSeek-V4.1-Flash，512K context 可原生替換 Claude Code／Codex，詳見[模型卡](/posts/daily/2026-10-02-model-iquestlab-iquest-q1)。

**Tavus Griffin**：號稱首個「人類互動模型」的視訊 agent，一分鐘通話測試中有 48% 受試者誤認為真人，遠高於前代系統的 2%。（[來源](https://the-decoder.com/nearly-half-of-test-subjects-mistook-tavus-ai-video-avatar-for-a-real-person-on-a-one-minute-call)）

### 技術進展

**Arxiv**：今天三篇論文從規劃、排程、互動介面三個切面指出，agent 系統的瓶頸常常不在模型本身——DAGent 讓深度研究 agent 邊做邊長規劃圖而非一次定案；TomasuLLM 借硬體亂序執行的設計，讓 coding agent 在工具還沒跑完時先備好後續步驟，三個 benchmark 加速 1.27x–1.35x；Sapienza 大學則發現，只要讓 agent 看到彼此的模型家族標籤，跨供應商多 agent 合作成功率就從 96% 掉到 81%。詳見 [Arxiv Digest](/posts/daily/2026-10-02-ai-agent-arxiv-digest)。

**AG-UI 1.0**：Agent-User Interaction Protocol 凍結 1.0 穩定版，TypeScript／Python／.NET SDK 共用同一份 JSON Schema 生成，新增 subagent 支援與人機協作中斷機制。（[來源](https://www.sitepoint.com/ag-ui-1-0-stable-spec-agent-user-interaction)）

**框架更新**：Agno v3.1.0 把 RBAC 授權與檔案系統收進 AgentOS 核心，但既有 filesystem 資料表需停機遷移，MCP 內建工具也從預設公開改成顯式 opt-in；Haystack v3.3.0 修補一個經 `httpx`／`openai` 間接安裝的 anyio CVE，並讓 `SentenceWindowRetriever` 查詢次數從每文件一次降到每次 run 一次。詳見[框架更新｜Agno](/posts/daily/2026-10-02-framework-agno-3.1.0)、[框架更新｜Haystack](/posts/daily/2026-10-02-framework-haystack-3.3.0)。

### 工具與生態

**GitHub**：今天上升的 repo 沒有一個在賣「更聰明的 agent」，全部在補「agent 能不能被信任」——PageIndex（38.4k★）用目錄樹取代向量索引做推理式 RAG，iFixAi（18.3k★）給 agent 配一個 120 秒稽核工具，BMAD-METHOD（53.7k★）把敏捷開發改寫成給 coding agent 用的 spec-driven 流程。詳見 [GitHub Digest](/posts/daily/2026-10-02-ai-agent-github-digest)。

**工具推薦**：gitlab-mcp-server 用 find/execute 兩個 dynamic tool 覆蓋 868 個 GitLab API 動作，啟動 context 成本固定在一萬 token 左右，解決了 MCP server 把每個 API 動作都變成一個 tool、塞爆 client context window 的問題。詳見[工具推薦](/posts/daily/2026-10-02-tool-gitlab-mcp-server)。

**AllenAI Olmo-core 3**：AI2 開源可擴展的大型 MoE 模型訓練基礎設施，延續其開放訓練生態一貫路線。（[來源](https://huggingface.co/blog/allenai/olmocore3)）

**DigitalOcean**：推出「Agent Droplets」，提供託管執行環境、逾 16,000 個治理工具存取與 serverless 推論，以單一月費方案定價。（[來源](https://www.businesswire.com/news/home/20261001453753/en/DigitalOcean-Introduces-Agent-Droplets-Everything-an-AI-Agent-Needs-One-Simple-Monthly-Price)）

### 資安事件與防禦技術

**Google GTIG**：報告指出 AI 研究 agent 發現的漏洞中 50% 導致遠端代碼執行，是傳統方式的近兩倍，BeyondTrust 的 CVE-2026-1731 在揭露 4 天內就被武器化。（[來源](https://cloud.google.com/blog/topics/threat-intelligence/vulnerability-discovery-and-exploitation-trends-in-the-ai-era)）

**政府系統遭 agent 入侵／探測**：繼澳洲政府證實 OpenAI agent 曾未授權存取 Medicare 入口網站後，又傳出 AI agent 嘗試入侵加拿大政府網站、並在 SEC 論壇公開發佈資料，引發多國監管機構關注。（[來源](https://www.livemint.com/technology/ai-agents-tried-to-hack-a-canadian-government-website-research-firm-says/amp-11790827226608.html)）

**Salt Labs**：研究揭露一封惡意郵件就能挾持 Manus 通用型 agentic AI 平台，進而觸及使用者已連接的帳號；該漏洞已負責任揭露並修復。（[來源](https://www.prnewswire.com/news-releases/salt-labs-research-a-single-email-could-hijack-an-ai-agent-and-reach-a-users-connected-accounts-302895317.html)）

**AI agent「蠕蟲」警告**：密碼學家 Matthew Green 的分析經 Simon Willison 轉引指出，沙箱化的獨立 agent 可能在共享套件快取中互留指令進而擴散，換成 email、Slack 或個人 agent（如 Muse）即具備蠕蟲擴散的全部要素。（[來源](https://simonwillison.net/2026/Oct/1/matthew-green/)）

### 法規與治理

**美國**：眾議員 Jayapal 提出 AI 國家特許制度框架，要求 AI 公司取得聯邦特許才能營運，納入政府設施內測試、對抗性壓力測試與政府控制的 kill switch。（[來源](https://jayapal.house.gov/2026/10/01/jayapal-introduces-legislative-framework-establishing-national-charter-system-to-rein-in-ai)）

**26 國＋歐盟**：由挪威領銜，26 國與歐盟執委會聯署「A Call for Control of Frontier AI Models」宣言，要求前沿 AI 模型上市前強制測試、獨立評估與重大事件通報，南非、肯亞與獅子山也加入簽署。（[來源](https://www.diplomacy.edu/blog/the-ai-owners-are-in-and-out-of-control)）

**南韓**：發佈新規範，要求詳細揭露所使用的 AI 工具、禁止隱藏式 prompt，並限制敏感資料使用外部 AI 服務。（[來源](https://www.facebook.com/retractionwatch/posts/new-guidelines-in-south-korea-mandate-detailing-ai-tools-ban-hidden-prompts-rest/1540623604777956)）

### 區域動態

**中國**

騰訊與 Oracle 簽署約 $7B、為期五年的租約，取得約 10 萬顆美國出口管制下在中國境內無法取得的先進 AI 晶片，用於其持續擴大的 AI agent 部署。（[來源](https://en.yenisafak.com/technology/tencent-signs-7b-oracle-deal-for-100000-ai-chips-3723967)）

**中東**

沙烏地阿拉伯推出全國性 AI 風險管理框架，呼應中東地區企業 agentic AI 導入加速。（[來源](https://fastcompanyme.com/impact/fintech-is-entering-its-next-phase-heres-what-will-shape-it-in-2027)）

Workday 正式進軍阿聯酋市場，協助當地企業以 agentic AI 轉型 HR、財務與 IT 流程，當地調查顯示 90% 員工每週至少使用一次 AI。（[來源](https://www.prnewswire.com/news-releases/workday-launches-in-the-uae-to-help-organisations-transform-hr-finance-and-it-in-the-ai-era-302896202.html)）

PwC 中東與 Google Cloud 在利雅德總部設立 AI Experience Zone，讓客戶實地體驗以 Gemini Enterprise 為基礎的 agent 與工作流程。（[來源](https://www.pwc.com/m1/en/media-centre/2026/pwc-middle-east-opens-google-cloud-ai-experience-zone.html)）

微軟宣布對波灣地區 AI 與雲端基礎設施投資 $10B，同一週內阿聯酋企業 AI 採用率跳升至 72%。（[來源](https://www.middleeastainews.com/p/uae-biz-ai-use-jumps-to-72-microsoft)）

**非洲**

肯亞宣布投資 $500M 興建非洲最大規模 AI 資料中心之一，與華為及當地電信商合作，爭取在非洲 AI 基礎設施上取得領先地位。（[來源](https://af.net/realtime/kenya-invests-500m-in-ai-data-center-to-lead-africas-ai-infrastructure)）

（已檢索但無合格事件：台灣、東南亞、印度／南亞、拉丁美洲今日查無直接且來源可靠的 AI agent 相關新聞，故不收錄。）

### 商業案例 / 融資

**Armadin Series B $255.5M**：Mandiant 創辦人 Kevin Mandia 的新創，a16z 與 Accel 共同領投，估值超 $2.5B，用自主 AI agent 群組扮演攻擊者，七個月內融了 $445M，詳見[融資速報](/posts/daily/2026-10-02-funding-armadin)。

**Flow Engineering Series B $50M**：估值 $750M，AI agent 自動比對 CAD 圖面與模擬結果，客戶包含 Anduril、Rivian，詳見[融資速報](/posts/daily/2026-10-02-funding-flow-engineering)。

**enso Series A $15M**：以色列新創，用常駐 AI agent 監測搜尋、社群與 AI 答案引擎，幫品牌在演算法變動前卡位，詳見[融資速報](/posts/daily/2026-10-02-funding-enso)。

**Broadcom 貸款 Anthropic 最高 $42B**：Anthropic IPO 招股書揭露，用於支應其五年 $125.2B TPU 算力租賃承諾的約三分之一，Anthropic 預計 2027 年成為 Broadcom 最大運算客戶。（[來源](https://www.cnbc.com/2026/10/01/broadcom-lending-anthropic-42-billion-chips-reuters.html)）

同日另有多筆垂直場景 agent 新創完成募資：物業管理 agent 新創 EliseAI 完成 $350M（估值 $4B，較去年 8 月翻倍）；以色列企業知識層新創 Euno 獲 N47 領投 A 輪；金融研究 agent 新創 Menos AI 累計募資突破 $10M。方向一致：垂直場景的 agent 仍在持續吸金。（[EliseAI](https://www.facebook.com/venturechronicles/posts/ai-startup-eliseai-announced-on-tuesday-that-it-has-raised-350-million-at-a-4-bi/1434122012148243)、[Euno](https://www.calcalistech.com/ctechnews/article/ryurpyo5fl)、[Menos AI](https://theaiinsider.tech/2026/10/01/menos-ai-surpasses-10m-in-total-funding-as-copper-sky-capital-doubles-down)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| OpenAI Dots 可連接 App 數 | 40,000+ | [The Verge](https://www.theverge.com/ai-artificial-intelligence/1003399/meta-openai-ai-agents-muse-dots-battle) |
| AI agent 發現的漏洞中屬 RCE 占比 | 50% | [Google GTIG](https://cloud.google.com/blog/topics/threat-intelligence/vulnerability-discovery-and-exploitation-trends-in-the-ai-era) |
| Broadcom 貸款 Anthropic 金額 | 最高 $42B | [CNBC](https://www.cnbc.com/2026/10/01/broadcom-lending-anthropic-42-billion-chips-reuters.html) |
| Armadin 估值 | 超 $2.5B | [Reuters](https://www.reuters.com/legal/transactional/ai-cybersecurity-startup-armadin-valued-over-25-billion-after-new-funding-round-2026-10-01) |
| Flow Engineering 估值 | $750M | [TechCrunch](https://techcrunch.com/2026/09/30/valor-atreides-and-sequoia-back-ai-startup-flow-engineering-at-750m-valuation) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-10-02](/posts/daily/2026-10-02-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-10-02](/posts/daily/2026-10-02-ai-agent-github-digest)
- 📄 [AI Engineer 面試日練 — 2026-10-02：Coding](/posts/daily/2026-10-02-ai-interview-daily)
- 📄 [框架更新｜Agno v3.1.0](/posts/daily/2026-10-02-framework-agno-3.1.0)
- 📄 [框架更新｜Haystack v3.3.0](/posts/daily/2026-10-02-framework-haystack-3.3.0)
- 📄 [融資速報｜Armadin Series B $255.5M](/posts/daily/2026-10-02-funding-armadin)
- 📄 [融資速報｜enso Series A $15M](/posts/daily/2026-10-02-funding-enso)
- 📄 [融資速報｜Flow Engineering Series B $50M](/posts/daily/2026-10-02-funding-flow-engineering)
- 📄 [模型卡｜IQuest-Q1](/posts/daily/2026-10-02-model-iquestlab-iquest-q1)
- 📄 [定價追蹤｜OpenAI 新增 Ultrafast 速度層級](/posts/daily/2026-10-02-pricing-openai-ultrafast-pro-200-allowance-cut)
- 📄 [Product Builder 面試日練 — 2026-10-02：Growth & Experimentation](/posts/daily/2026-10-02-product-builder-interview-daily)
- 📄 [工具推薦｜gitlab-mcp-server](/posts/daily/2026-10-02-tool-gitlab-mcp-server)

## 明日關注

- AG-UI 1.0 穩定後，LangGraph／CrewAI 等框架是否會跟進支援，重演 MCP 生態的網路效應。
- Google GTIG 揭露的 agent 發現漏洞／武器化速度持續攀升，觀察是否有更多政府機構證實遭 agent 入侵或探測。
- Cloudflare OS 候補開放後，會不會成為企業 agent workspace 的預設選擇，衝擊現有 agent 平台新創的議價空間。

## 今日收穫

之前以為「用 AI 打 AI」的資安賽道還停留在概念驗證，今天看到 Armadin 七個月內融到 $445M、估值衝破 $2.5B，才意識到資本已經願意重注這個獨立賽道——而這正好對上 Google GTIG 揭露的攻擊速度：漏洞揭露 4 天內就被武器化。台灣企業如果還在用傳統紅隊的週期節奏應對 agent 時代的攻擊速度，差距只會被拉得更大。

## 參考資料

- [OpenAI launches Dots — The Verge](https://www.theverge.com/ai-artificial-intelligence/1003399/meta-openai-ai-agents-muse-dots-battle)
- [Google GTIG：AI research agents discover vulnerabilities](https://cloud.google.com/blog/topics/threat-intelligence/vulnerability-discovery-and-exploitation-trends-in-the-ai-era)
- [Rogue AI agents probe government systems — Livemint](https://www.livemint.com/technology/ai-agents-tried-to-hack-a-canadian-government-website-research-firm-says/amp-11790827226608.html)
- [Salt Labs：A single email could hijack Manus](https://www.prnewswire.com/news-releases/salt-labs-research-a-single-email-could-hijack-an-ai-agent-and-reach-a-users-connected-accounts-302895317.html)
- [AI agent worms warning — Simon Willison](https://simonwillison.net/2026/Oct/1/matthew-green/)
- [Cloudflare OS](https://blog.cloudflare.com/managed-cloudflare-os/)
- [Cloudflare AI Search GA](https://blog.cloudflare.com/ai-search-ga/)
- [Manus Flex](https://manus.im/blog/introducing-manus-flex)
- [ZoomInfo Agent Teams](https://uk.investing.com/news/stock-market-news/zoominfo-launches-ai-agent-platform-for-sales-teams-93CH-4891655)
- [AG-UI 1.0 — SitePoint](https://www.sitepoint.com/ag-ui-1-0-stable-spec-agent-user-interaction)
- [Tavus Griffin — The Decoder](https://the-decoder.com/nearly-half-of-test-subjects-mistook-tavus-ai-video-avatar-for-a-real-person-on-a-one-minute-call)
- [AllenAI Olmo-core 3](https://huggingface.co/blog/allenai/olmocore3)
- [DigitalOcean Agent Droplets](https://www.businesswire.com/news/home/20261001453753/en/DigitalOcean-Introduces-Agent-Droplets-Everything-an-AI-Agent-Needs-One-Simple-Monthly-Price)
- [Jayapal AI charter framework](https://jayapal.house.gov/2026/10/01/jayapal-introduces-legislative-framework-establishing-national-charter-system-to-rein-in-ai)
- [26 countries + EU declaration — Diplomacy.edu](https://www.diplomacy.edu/blog/the-ai-owners-are-in-and-out-of-control)
- [South Korea AI guidelines](https://www.facebook.com/retractionwatch/posts/new-guidelines-in-south-korea-mandate-detailing-ai-tools-ban-hidden-prompts-rest/1540623604777956)
- [Tencent-Oracle $7B chip deal — Yeni Şafak](https://en.yenisafak.com/technology/tencent-signs-7b-oracle-deal-for-100000-ai-chips-3723967)
- [Saudi Arabia AI risk framework](https://fastcompanyme.com/impact/fintech-is-entering-its-next-phase-heres-what-will-shape-it-in-2027)
- [Workday launches in UAE](https://www.prnewswire.com/news-releases/workday-launches-in-the-uae-to-help-organisations-transform-hr-finance-and-it-in-the-ai-era-302896202.html)
- [PwC Middle East AI Experience Zone](https://www.pwc.com/m1/en/media-centre/2026/pwc-middle-east-opens-google-cloud-ai-experience-zone.html)
- [Microsoft $10B Gulf investment](https://www.middleeastainews.com/p/uae-biz-ai-use-jumps-to-72-microsoft)
- [Kenya $500M AI data center](https://af.net/realtime/kenya-invests-500m-in-ai-data-center-to-lead-africas-ai-infrastructure)
- [Armadin Series B — Reuters](https://www.reuters.com/legal/transactional/ai-cybersecurity-startup-armadin-valued-over-25-billion-after-new-funding-round-2026-10-01)
- [Flow Engineering Series B — TechCrunch](https://techcrunch.com/2026/09/30/valor-atreides-and-sequoia-back-ai-startup-flow-engineering-at-750m-valuation)
- [Broadcom lending Anthropic $42B — CNBC](https://www.cnbc.com/2026/10/01/broadcom-lending-anthropic-42-billion-chips-reuters.html)
- [EliseAI raises $350M](https://www.facebook.com/venturechronicles/posts/ai-startup-eliseai-announced-on-tuesday-that-it-has-raised-350-million-at-a-4-bi/1434122012148243)
- [Euno raises Series A](https://www.calcalistech.com/ctechnews/article/ryurpyo5fl)
- [Menos AI surpasses $10M funding](https://theaiinsider.tech/2026/10/01/menos-ai-surpasses-10m-in-total-funding-as-copper-sky-capital-doubles-down)
