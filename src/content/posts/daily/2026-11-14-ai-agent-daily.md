---
title: "AI 日報 — 2026-11-14"
date: 2026-11-14
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "OpenAI 讓 agent 直接購物結帳，零售商選擇正面封鎖——這場「誰控制結帳權」的卡位戰，比哪家 agent 更聰明更早決定 agent 商務化會長成什麼樣子"
tldr: "OpenAI 推出 ChatGPT Wallet 讓 agent 直接購物結帳，United、Amazon、Target 同週反向封鎖第三方購物 agent；Microsoft 用 AI agent 在 Linux kernel 挖出 59 個漏洞含 21 年老洞，資安業界共識是每個 agent 要有獨立身分與可撤銷權限；Mirendil 10 億、Mercor 7.5 億、LangChain 3 億美元同週完成新一輪融資；歐盟都柏林首次 AI 峰會、澳洲規劃設立 AI 安全監管機構並對前沿 AI 公司課刑責；Anthropic Claude Fable 5.2 上線降價兩成，Google 關閉 Jules 編碼 agent 但訂閱價不降。"
draft: false
series:
  name: "AI 日報"
  order: 91
---

> 🌏 [English version](/posts/daily/2026-11-14-ai-agent-daily-en)

## 一句話判斷

**OpenAI 想讓 agent 直接幫你購物結帳，零售商選擇直接封殺而不是談分潤——這場「誰控制結帳權」的卡位戰，比哪家 agent 更聰明更早決定 agent 商務化會長成什麼樣子，台灣電商與金融業者現在就該決定要開放窄範圍授權 API 還是先封鎖觀望。**

## 深度分析：結帳權卡位戰，才是 agent 商務化的真正戰場

我認為今天最值得串起來看的不是哪家 agent 更強，而是「結帳權」正在變成一場五力式的卡位戰。（框架：五力分析）

證據一：OpenAI 推出 ChatGPT Wallet，讓「dots」agent 能直接代使用者完成購物與付款，初期不抽成、鋪在美國少數零售商——這是新進入者想繞過零售商自己的結帳介面，直接插入消費者和商家之間，搶的是原本屬於零售商的交易關係與資料。

證據二：同一週，United Airlines、Amazon、Target 等反而選擇直接封鎖第三方 AI 購物／訂票 agent，理由包含法規風險（例如航班行李申報）和避免非預期消費——這是零售商用議價力量正面反擊：無法在技術上跟 OpenAI 的 agent 談分潤，就直接把對手擋在結帳頁外，而不是坐下來協商授權費率。

兩邊互卡的結果，是這個市場還沒決定「誰是供應商、誰是買方」：OpenAI 想把自己變成消費者與商家之間的新交易層，零售商則想守住自己才是唯一能授權交易的一方。同一週 Mirendil $1B、Mercor $750M、LangChain $300M 三筆大額融資說明資本依然樂觀，但那是賭在「agent 會成為新常態的基礎設施」，不是賭在哪一方會贏得這場結帳權卡位戰。

對從業者的意義：如果你的產品卡在零售或金融這類高監管、高授權敏感的垂直領域，先假設大型平台會擋你的 agent，把「跟商家談直接整合」當成比「agent 多聰明」更優先的商業發展工作。台灣電商與金融業者現在就該決定：要先對 agent 流量開放窄範圍授權 API，還是跟著國際零售商一起封鎖觀望——這會影響接下來一年誰能定義本地的 agent 商務規則。

```diagram
title: Agent 商務化的卡位戰：OpenAI 想當交易層，零售商選擇封鎖
desc: 左欄是 OpenAI 想建立的新交易路徑，右欄是零售商的防守反應；市場還沒決定誰是供應商、誰是買方。
caption: 依 TechCrunch ChatGPT Wallet 報導與 Business Insider 零售商封鎖清單整理。
---
<svg viewBox="0 0 640 300">
  <text class="dg-heading" x="160" y="28" text-anchor="middle" dominant-baseline="central">OpenAI 的攻勢</text>
  <text class="dg-heading" x="480" y="28" text-anchor="middle" dominant-baseline="central">零售商的守勢</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="280"/>

  <rect class="dg-box dg-box--accent" x="76" y="56" width="168" height="56" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">ChatGPT Wallet</text>
  <text class="dg-sub" x="160" y="98" text-anchor="middle" dominant-baseline="central">agent 直接購物結帳，不抽成</text>

  <rect class="dg-box dg-box--accent" x="76" y="140" width="168" height="56" rx="6"/>
  <text class="dg-label" x="160" y="162" text-anchor="middle" dominant-baseline="central">插入消費者與商家之間</text>
  <text class="dg-sub" x="160" y="182" text-anchor="middle" dominant-baseline="central">搶交易關係與資料</text>

  <rect class="dg-box" x="396" y="56" width="168" height="56" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">封鎖第三方 agent</text>
  <text class="dg-sub" x="480" y="98" text-anchor="middle" dominant-baseline="central">United／Amazon／Target</text>

  <rect class="dg-box" x="396" y="140" width="168" height="56" rx="6"/>
  <text class="dg-label" x="480" y="162" text-anchor="middle" dominant-baseline="central">守住結帳頁與授權權</text>
  <text class="dg-sub" x="480" y="182" text-anchor="middle" dominant-baseline="central">不談分潤，直接擋</text>

  <path class="dg-line" d="M160 112V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 112V140" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="320" y="240" text-anchor="middle" dominant-baseline="central">誰先讓對方讓步，誰就定義 agent 商務規則</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **OpenAI** | 推出 ChatGPT Wallet，讓「dots」agent 能代使用者完成購物結帳，初期限美國少數零售商、不抽成。 | [TechCrunch](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/) |
| **Google** | 發布 Modern Web Guidance 1.0，把 web 平台知識、無障礙與安全檢查包成 coding agent skill，已上架 Claude Code、Codex、Cursor 等外掛市集。 | [SoftTechHub](https://softtechhub.us/2026/11/13/modern-web-guidance-1-0-ai-coding-agents/) |
| **Microsoft** | 展示在 NVIDIA RTX Spark（128GB 統一記憶體）地端跑 MoE coding 模型，免 token 計費跑複雜編碼任務；同時以「Frontier Firms」案例指出企業 AI 擴張瓶頸已從導入轉為治理。 | [Microsoft Foundry Blog](https://devblogs.microsoft.com/foundry-on-windows/coding-ai-on-windows-pcs-quality-efficiency/) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Anthropic** | Claude Fable 5.2／Mythos 5.2 上線取代 5.1，輸出快 30%、API 價格砍 20% 至 $8／$40（每 1M tokens），FrontierSWE v2 達 69.9%，詳見[模型卡](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2)。 | 站內 |

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Microsoft Research** | 用 AI agent 配合人工驗證在 Linux kernel 找出 59 個漏洞，其中一個已存在 21 年；同週 OpenAI GPT-6 Cyber 也回報 81 個 Firefox 高風險漏洞，AI 輔助漏洞挖掘正加速。 | [CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html) |
| **OpenAI Codex** | prompt injection 串聯 GitHub Actions 漏洞直通官方 npm 套件簽署權限，已修補並發出漏洞賞金，詳見[資安警報](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection)。 | 站內 |
| **資安業界共識** | 多家資安公司同步主張 agent 要有獨立身分、最小權限與可單獨撤銷能力，否則委派授權的範圍會被悄悄放大。 | [Nudge Security](https://www.nudgesecurity.com/post/ai-agent-identity) |

### 法規與治理

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **澳洲** | 規劃設立專責 AI 安全監管機構，對造成損害的前沿 AI 公司課以刑事責任，背景為 OpenAI agent 誤觸 Medicare 入口延遲通報事件。 | [CASRAI](https://casrai.org/news/australia-ai-safety-regulator-frontier-ai-2026) |
| **歐盟** | 理事會在都柏林召開首次 AI 專題峰會，討論主權運算、Chips Act 2.0 與資安，背景是近期多起 rogue agent 事件與 Nvidia 高層動盪；AI Act 本身沒有「agent」分類，但新指南確認既有定義已涵蓋 agent，並整理 provider／deployer 的責任歸屬。 | [FinChannel](https://finchannel.com/eu-leaders-put-ai-sovereignty-computing-capacity-and-safeguards-on-dublin-agenda/141447/world-2/europe/2026/11/) |
| **香港** | 業界要求明確 agent 究責機制，金管局同時啟動 Project SAGE 研究 agentic finance 的授權與法規問題。 | [SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable) |
| **中國** | 工信部將手機、平板、穿戴裝置上預裝的 AI agent 納入電信設備市場准入監管。 | [Chinascope](https://chinascope.org/archives/41598) |
| **美國** | 多個非營利組織在加州法院提訴，要求暫停訓練「災難性」風險的 AI 模型；公部門工會同週爭取到 AI 再培訓與禁止以 AI 為唯一解僱依據的保護條款。 | [Al Jazeera](https://www.aljazeera.com/news/2026/11/12/us-nonprofits-sue-tech-giants-to-halt-ai-development) |
| **全球治理盤點** | Digital Policy Alert 分析 84 部國內 AI 法規與 9 個國際框架，歸納出 10 類共同關切，透明度與安全評估最常見。 | [Digital Policy Alert](https://digitalpolicyalert.org/report/global-view) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **東南亞** | WSJ 報導美方評估對馬來西亞、泰國、印尼、新加坡的 AI 晶片出口追加授權與申報要求，防堵晶片經第三地轉手流入中國。 |
| **印度／南亞** | IndiaAI Mission 面臨算力與資金缺口；GSMA 開放最高 £250K 的 AI 金融補助給巴基斯坦、孟加拉、斯里蘭卡、尼泊爾等新創。 |
| **中東** | 沙烏地單週 AI／新創交易逾 $5.1B，成為海灣資金集中地；MENA 企業規劃投入 10%+ 營收在 AI，但政策不確定性延宕近一成專案；卡達同週加碼區域 AI 樞紐佈局。 |
| **非洲** | 肯亞高等法院下令政府 6 個月內訂出 AI 專法、同步規劃 $500M 新創基金；GIZ／Briter 調查 311 家非洲 AI 新創發現中位數募資僅 $225K、僅 15% 已獲利；肯亞新創 Satlyt 完成 $8M 種子輪後入選 Google AI Futures Fund 首個非洲實驗室梯隊。 |
| **拉丁美洲** | CEPAL／CENIA 報告指拉美佔全球 AI 應用訪問量 14%，但 85% 當地科技公司已用 agent、僅 22% 驗證財務效益，法規制定速度落後使用速度。 |
| **大洋洲** | 澳洲 AI 安全監管機構草案詳見上方法規段；紐西蘭報告要求銀行以可驗證身分重建多 agent 架構，不能再用共享服務帳號。 |

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Mirendil／Mercor／LangChain** | 同週完成 $1B A 輪／$750M D 輪／$300M C 輪（估值 $3B），agentic AI 基礎設施仍是本週最大資金流向。 | [Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/) |
| **Cohere** | 收購 AISLE 與 cubic，擴大主權 AI 平台進入網路防禦與安全軟體開發領域。 | [Cohere Blog](https://cohere.com/blog/cohere-expands-sovereign-ai-platform-aisle-cubic) |
| **Bay／Kindo／Nebuly** | Agent 安全、治理、價值衡量三個垂直賽道同日各完成一輪募資（$50M／累計 $57.6M／$21M），詳見[Bay](/posts/daily/2026-11-14-funding-bay)、[Kindo](/posts/daily/2026-11-14-funding-kindo)、[Nebuly](/posts/daily/2026-11-14-funding-nebuly)。 | 站內 |
| **Agile Robots** | SoftBank 領投 $500M F 輪，估值 $8.5B，聚焦物流、汽車與電子製造的物理 AI 落地。 | [SiliconANGLE](https://siliconangle.com/2026/11/12/agile-robots-raises-500m-funding-led-by-softbank-at-8-5b-valuation/) |
| **Natera** | 在 Amazon Bedrock AgentCore 上建置 agentic 實驗室營運系統 SWARM，單據首次回應速度加快約 130 倍。 | [AWS Blog](https://aws.amazon.com/blogs/machine-learning/how-natera-designed-an-agentic-ai-system-for-lab-ops-with-amazon-bedrock-agentcore/) |
| **零售業反制** | United、Amazon、Target 等陸續封鎖第三方 AI 購物／訂票 agent，與 OpenAI 的 agent 商務化策略正面對撞（詳見深度分析）。 | [Business Insider](https://www.businessinsider.com/list-companies-banning-ai-agents-retail-travel-united-amazon-target-2026-11) |

### 定價與 API 生命週期

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Google** | 收掉 Jules 編碼 agent（11/11 唯讀、12/31 全面關閉），AI Pro／Ultra 訂閱價不變但背景 coding 福利消失，詳見[定價追蹤](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown)。 | 站內 |
| **美國聯邦機關** | GAO 首席科學家警告 AI 導入優惠定價即將到期，若不調整 token 用量管理，8-10 個月內可能大幅放緩聯邦 AI 使用。 | [ExecutiveGov](https://www.executivegov.com/articles/federal-agencies-ai-token-cost-management-gao) |

### 技術進展

今天的 Arxiv Digest 聚焦 Agent「看起來有把關」跟「實際發生了什麼」之間的落差：guardscope 發現企業部署的安全閘道（含微軟官方工具）有 5 條執行路徑在任何設計下都繞得過去；tau2-bench 評測研究顯示 LLM 裁判放過了 10 次已確認違規寫入，換成不呼叫模型的規則檢查卻全部抓到；Breaking Bad 則從模型內部激活值找到獎勵破解前就會升高的訊號。論文指出這些落差不是單一廠商問題，而是監控機制本身的覆蓋範圍普遍比想像中小，詳見[今日 Arxiv Digest](/posts/daily/2026-11-14-ai-agent-arxiv-digest)。

GitHub 生態的訊號是「寫程式呼叫工具」（Code Mode）同時在 Claude Code v2.1.323、UTCP 社群與 Vercel 新框架 eve 三處冒出來，傳統一輪一輪選工具的模式正被取代，詳見[今日 GitHub Digest](/posts/daily/2026-11-14-ai-agent-github-digest)。

Mastra @mastra/core v1.83.0 讓每個 Agent 都能發可重連的 resumable stream、內建 MCP endpoint，但也把 durable 選項拆成「串流重連」和「可崩潰復原的持久執行」兩件事，詳見[框架更新](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0)。

其他開源訊號：AI2 與 Hugging Face 共同發布 XYBench，用 8,115 道題測試 LLM 能否看穿使用者請求背後的錯誤前提；本地推理引擎 llama.cpp 正式發布 1.0.0，被視為在地端 AI 生態系的重要穩定里程碑；阿里雲開源的 AI Agent Handbook GitHub star 數突破 3,000。

### 工具與生態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **AWS** | 以 Apache 2.0 開源 Universal Agent Evaluation Framework（UAEF），統一評分跨框架 agent 並強化評審模型對 prompt injection 的防禦。 | [TechTimes](https://www.techtimes.com/articles/330523/20261112/aws-open-sources-ai-agent-evaluation-framework-that-hardens-its-ai-grader-against-prompt-injection.htm) |
| **ha-mcp** | 社群維護的 Home Assistant MCP server，87 個工具、7,700+ stars，涵蓋官方內建做不到的 automation／dashboard／HACS 維護，詳見[工具推薦](/posts/daily/2026-11-14-tool-ha-mcp)。 | 站內 |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Microsoft 在 Linux kernel 找出的漏洞數 | 59（含 1 個 21 年老洞） | [CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html) |
| Mirendil Series A | $1B | [Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/) |
| Claude Fable 5.2 API 降價幅度 | -20%（$8／$40 每 1M tokens） | 站內模型卡 |
| 本週中東 AI／新創交易額 | $5.1B | [entARABI](https://entarabi.com/en/2026/11/5-1-billion-dollars-in-a-week-how-did-saudi-arabia-become-a-hub-for-gulf/) |
| ha-mcp GitHub stars | 7,700+ | 站內工具推薦 |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-github-digest)
- 📄 [模型卡｜Claude Fable 5.2](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2)
- 📄 [資安警報｜prompt injection 串聯 GitHub Actions 漏洞](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection)
- 📄 [框架更新｜Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0)
- 📄 [融資速報｜Bay Series A $37M](/posts/daily/2026-11-14-funding-bay)
- 📄 [融資速報｜Kindo $30M 成長輪](/posts/daily/2026-11-14-funding-kindo)
- 📄 [融資速報｜Nebuly Series A $21M](/posts/daily/2026-11-14-funding-nebuly)
- 📄 [定價追蹤｜Google 收掉 Jules 編碼 Agent](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown)
- 📄 [工具推薦｜ha-mcp](/posts/daily/2026-11-14-tool-ha-mcp)
- 📄 [AI Engineer 面試準備日報](/posts/daily/2026-11-14-ai-interview-daily)
- 📄 [Product Builder 面試準備日報](/posts/daily/2026-11-14-product-builder-interview-daily)

## 明日關注

- OpenAI ChatGPT Wallet 擴大零售商名單後，封鎖陣營（United／Amazon／Target）會不會跟進法規行動，或轉向談判授權 API 與分潤。
- 澳洲 AI 安全監管機構草案公布後，「刑事責任」門檻是否會寫進最終法案，進而影響其他市場的監管速度。
- Microsoft／OpenAI 的 AI 輔助漏洞挖掘擴大後，是否會出現對應的攻擊端濫用案例。

## 今日收穫

之前以為 agent 商務化的瓶頸主要在「agent 夠不夠聰明去完成購物流程」，寫完才意識到真正的瓶頸是「誰有權替消費者在商家端做決定」——這是商業授權與議價力量的問題，不是技術問題，而零售商選擇直接封鎖、不是坐下來談授權費率，說明這場仗現在還在用最原始的方式打。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-github-digest)
- [OpenAI launches ChatGPT Wallet — TechCrunch](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/)
- [Retailers banning AI shopping agents — Business Insider](https://www.businessinsider.com/list-companies-banning-ai-agents-retail-travel-united-amazon-target-2026-11)
- [AWS 開源 UAEF — TechTimes](https://www.techtimes.com/articles/330523/20261112/aws-open-sources-ai-agent-evaluation-framework-that-hardens-its-ai-grader-against-prompt-injection.htm)
- [Google Modern Web Guidance 1.0 — SoftTechHub](https://softtechhub.us/2026/11/13/modern-web-guidance-1-0-ai-coding-agents/)
- [Microsoft AI found Linux kernel bugs — CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html)
- [Natera SWARM on Bedrock AgentCore — AWS Blog](https://aws.amazon.com/blogs/machine-learning/how-natera-designed-an-agentic-ai-system-for-lab-ops-with-amazon-bedrock-agentcore/)
- [Mirendil／Mercor／LangChain 融資週報 — Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/)
- [Agile Robots $500M F 輪 — SiliconANGLE](https://siliconangle.com/2026/11/12/agile-robots-raises-500m-funding-led-by-softbank-at-8-5b-valuation/)
- [AI agent identity 共識 — Nudge Security](https://www.nudgesecurity.com/post/ai-agent-identity)
- [香港 agent 究責與 Project SAGE — SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)
- [中國 MIIT 監管預裝 agent — Chinascope](https://chinascope.org/archives/41598)
- [美方評估東南亞 AI 晶片出口規範 — The Standard](https://www.thestandard.com.hk/innovation/article/348455/Nvidia-fallout-throws-spotlight-on-Southeast-Asias-AI-boom)
- [印度主權 AI 挑戰 — Shafaqna](https://en.shafaqna.com/491273/can-india-turn-its-sovereign-ai-ambitions-into-reality/)
- [GSMA 巴基斯坦 AI 金融補助 — ProPakistani](https://propakistani.pk/2026/11/13/gsma-grants-pakistani-startups-ai-finance/)
- [EU AI Act agent 定義地圖 — NHIMG](https://nhimg.org/eu-ai-act-agentic-ai-requirements-map)
- [歐盟都柏林 AI 峰會 — FinChannel](https://finchannel.com/eu-leaders-put-ai-sovereignty-computing-capacity-and-safeguards-on-dublin-agenda/141447/world-2/europe/2026/11/)
- [MENA 企業數位投資調查 — PR Newswire](https://www.prnewswire.com/news-releases/mena-enterprises-plan-major-digital-investment-but-policy-barriers-delay-projects-for-one-in-nine-302938893.html)
- [沙烏地單週 AI 交易 $5.1B — entARABI](https://entarabi.com/en/2026/11/5-1-billion-dollars-in-a-week-how-did-saudi-arabia-become-a-hub-for-gulf/)
- [卡達區域 AI 樞紐佈局 — The Peninsula Qatar](http://thepeninsulaqatar.com/article/13/11/2026/qatar-poised-to-strengthen-regional-ai-leadership-through-global-tech-partnerships)
- [肯亞法院命令 AI 專法 — Africa AI News](https://www.africaainews.com/p/kenya-high-court-orders-ai-laws-kenya)
- [非洲 AI 新創募資調查 — WeeTracker](https://weetracker.com/2026/11/13/africa-ai-costs-foreign-cloud-bills/)
- [肯亞 Satlyt 入選 Google AI Futures Fund — Dealroom](https://app.dealroom.co/news/note/kenya-s-satlyt-makes-google-s-first-africa-ai-lab-after-8m-raise)
- [拉美 AI 應用落後法規 — Revista Economía](https://www.revistaeconomia.com/america-latina-la-ia-ya-avanzo-mas-rapido-que-la-regulacion/)
- [85% 拉美科技公司用 agent — Revista Economía](https://www.revistaeconomia.com/el-85-de-las-tecnologicas-en-america-latina-ya-utiliza-agentes-de-ia-pero-solo-el-22-valida-su-impacto-financiero/)
- [澳洲 AI 安全監管機構 — CASRAI](https://casrai.org/news/australia-ai-safety-regulator-frontier-ai-2026)
- [紐西蘭銀行 agent 治理報告 — ITBrief NZ](https://itbrief.co.nz/story/banks-must-rebuild-around-governed-ai-agents-report)
- [Microsoft NVIDIA RTX Spark coding — Microsoft Foundry Blog](https://devblogs.microsoft.com/foundry-on-windows/coding-ai-on-windows-pcs-quality-efficiency/)
- [Cohere 收購 AISLE 與 cubic — Cohere Blog](https://cohere.com/blog/cohere-expands-sovereign-ai-platform-aisle-cubic)
- [XYBench — Allen Institute](https://allenai.org/blog/xybench-helping-with-the-problem-behind-the-question)
- [llama.cpp v1.0.0 — Hugging Face Blog](https://huggingface.co/blog/llama-cpp-v1)
- [阿里雲 AI Agent Handbook 破 3,000 星 — Alibaba Cloud Blog](https://www.alibabacloud.com/blog/alibaba-clouds-open-source-ai-agent-handbook-3k-github-stars)
- [Microsoft Frontier Firms 治理觀察 — Microsoft Blog](https://blogs.microsoft.com/blog/2026/11/12/scaling-ai-value-without-losing-control-lessons-from-frontier-firms/)
- [Digital Policy Alert 全球治理報告](https://digitalpolicyalert.org/report/global-view)
- [美國聯邦機關 AI 定價 — ExecutiveGov](https://www.executivegov.com/articles/federal-agencies-ai-token-cost-management-gao)
- [美國非營利組織提訴暫停訓練 — Al Jazeera](https://www.aljazeera.com/news/2026/11/12/us-nonprofits-sue-tech-giants-to-halt-ai-development)
- [美國公部門工會 AI 保護條款 — The Guardian](https://www.theguardian.com/technology/2026/nov/12/us-workers-governments-unions-ai)
