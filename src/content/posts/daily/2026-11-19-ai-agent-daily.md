---
title: "AI 日報 — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "台灣團隊導入 agent 架構前，先想清楚「這個 agent 歸誰管」——今天從供應鏈攻擊到 Nvidia 創辦人下台，都在說同一件事：AI 信任鏈的頂端一樣脆弱"
tldr: "Anthropic IPO 以每股 $70-78、8.25 億股定價，11/18 在 Nasdaq 掛牌；Microsoft Agent Framework 的 PyPI 套件遭植入憑證竊取程式，Google GTIG 報告指出已出現無人介入的自主攻擊 AI 代理，FBI 示警開源滲透測試框架已用於真實入侵；HYPR AgentPass 與 Oleria AI Gateway 同步把身分治理延伸到 AI 代理；Nvidia 在創辦人 Jensen Huang 醜聞下台後首次全員會議，財報優於預期但股價仍跌、董事會確認不會讓他回任；美國新規要求東南亞與巴西資料中心進口先進 AI 晶片須取得許可"
draft: false
series:
  name: "AI 日報"
  order: 96
---

> 🌏 [English version](/posts/daily/2026-11-19-ai-agent-daily-en)

## 一句話判斷

**當 Google 回報已有無人介入的自主攻擊代理、FBI 示警開源滲透測試框架已用於真實入侵，而 Nvidia 創辦人兼 CEO 也在醜聞中被拉下台時，今天這些事合起來說明的是：AI 產業最大的風險不再是模型夠不夠強，而是沒有人講得清楚該讓誰為一個自主決策的系統負責——台灣團隊導入 agent 架構前，先把「這個 agent 歸誰管」寫進合約，比選哪個框架更急迫。**

## 深度分析：當信任鏈的頂端也守不住，交易成本正在重新定價

我認為今天把幾件表面上不相關的事放在一起看，指向同一個結論：AI 產業正在為「誰該為一個自主系統的行為負責」這個問題，付出遠比想像中更高的交易成本——不管那個系統是一套程式碼套件，還是一位掌管全球最大晶片公司的創辦人。（框架：交易成本）

證據 A：攻擊端正在利用「沒人該為 agent 負責」這個空隙。Google GTIG 報告指出已出現無人介入、自主撰寫並發動漏洞攻擊的 AI 代理；FBI 示警 ARTEX 等開源 agentic 滲透測試框架已被用於真實入侵；Microsoft 自家的 Agent Framework PyPI 套件更直接被植入憑證竊取程式，而攻擊者拿到的不只是舊憑證，還能主動向 Azure、GitHub Actions 換發新代幣。三件事的共同點是：追責鏈條在「套件」「代理」「供應鏈發布權限」這幾個環節都還沒接上。

證據 B：市場正在用真金白銀替這個缺口定價。HYPR 推出 AgentPass，讓企業把每個 AI 代理綁定到一個可追責的人類負責人；Oleria 的 AI Gateway 用 72 億筆圖關係追蹤每個非人身分實際用到哪些權限。這兩家公司賣的不是更聰明的模型，是「把責任重新釐清」這件事本身——而這正是交易成本理論的核心：當協調與信任的成本高到讓人痛，市場就會長出專門消化這個成本的中介層。

把鏡頭拉到頂端更能看清這個邏輯：Nvidia 創辦人兼 CEO Jensen Huang 因醜聞請辭後，公司第一次全員會議上，董事長明確表態不會讓他回任，財報優於預期但股價仍跌、還遭多家券商降評——整個 AI 供應鏈最重要的單一決策者缺席超過一週，公司治理機制本身也在為「誰該負責、誰能復職」這個問題重新定價。對從業者的意義是：不管在哪個層級，複雜系統的風險從來不只是技術能力，而是「找得到人負責」這件事有沒有被設計進去。台灣團隊在接 PyPI／npm 上的高頻發版 agent 框架時，與其追新版本的速度，更該先問：這個套件的發布權限誰在管、出事了誰該被通知、哪個 agent 的動作有哪個人掛名核准。

```diagram
title: 可追責性缺口，從套件到創辦人同一天現形
desc: 左欄由上到下是今天同時出現的三層訊號：攻擊端利用治理真空、市場開始補上身分治理層、頂端的公司治理本身也卡在同一個問題。
caption: 案例與數字來自 Google GTIG、FBI／dev.to、HYPR、Oleria、CNBC。
---
<svg viewBox="0 0 640 300">
  <rect class="dg-box" x="40" y="24" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="52" dominant-baseline="central">L1</text>
  <text class="dg-label" x="92" y="40" dominant-baseline="central">攻擊端——利用治理真空</text>
  <text class="dg-sub" x="92" y="64" dominant-baseline="central">GTIG：自主攻擊代理已出現；FBI：開源滲透框架已用於真實入侵</text>

  <rect class="dg-box dg-box--accent" x="40" y="96" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="124" dominant-baseline="central">L2</text>
  <text class="dg-label" x="92" y="112" dominant-baseline="central">市場回應——身分治理層補位</text>
  <text class="dg-sub" x="92" y="136" dominant-baseline="central">HYPR AgentPass、Oleria AI Gateway 把責任綁回人類負責人</text>

  <rect class="dg-box dg-box--accent" x="40" y="168" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="196" dominant-baseline="central">L3</text>
  <text class="dg-label" x="92" y="184" dominant-baseline="central">頂端同樣真空——公司治理也卡住</text>
  <text class="dg-sub" x="92" y="208" dominant-baseline="central">Nvidia 創辦人下台後，決策權空窗逾一週仍未塵埃落定</text>

  <line class="dg-rule" x1="40" y1="236" x2="600" y2="236"/>
  <text class="dg-sub" x="40" y="260" dominant-baseline="central">共同落差：追責機制在套件、代理、董事會層級都還沒接上</text>
  <text class="dg-sub" x="40" y="280" dominant-baseline="central">市場補位的速度，目前還跟不上攻擊端與治理真空擴大的速度</text>
</svg>
```

## 今日動態

### 廠商動態

- **[Microsoft](https://aiagentsdirectory.com/news/ai-agents-news-brief-november-18-2026)**（aiagentsdirectory）：Ignite 2026 發布具獨立身分與推理層的自主代理 Copilot Autopilot，同時推出挑戰現有程式碼助理的 MAI Code 2 模型家族。
- **[Google Labs](https://www.testingcatalog.com/early-look-at-loop-new-autonomous-ai-agent-from-google/)**（testingcatalog）：發布 Stitch Loop，能持續監控上線資料並針對安全性、延遲、無障礙問題自動開 PR 的自主產品代理。
- **[Oleria](https://finance.yahoo.com/technology/ai/articles/oleria-extends-identity-governance-ai-170000479.html)**（yahoo finance）：推出 AI Gateway，將身分治理延伸到 AI 代理，用 72 億筆圖關係、520 億筆事件的 context graph 追蹤每個代理實際可及與已用的權限。
- **[Alibaba（Qwen）](https://www.alibabacloud.com/blog/qoderwake-digital-workers-take-the-initiative-%E2%80%94-no-need-to-%40-every-time_603789)**（alibabacloud）：發布 QoderWake，讓 AI 數字員工能主動且具成本效益地處理群聊請求，不需每次 @ 提及。
- **[Meta](https://www.smartcompany.com.au/artificial-intelligence/your-new-muse-meta-launches-ai-personal-assistant-in-australia/)**（smartcompany）：個人 AI 代理 Muse 正式在澳洲上線，是美國外最早取得的國際市場之一，執行敏感動作前會先向使用者確認。
- **[OpenAI](https://openai.com/index/advancing-chip-design-with-our-models/)**（openai）：發文說明如何用 GPT-6 Astra 等自家模型優化 Jalapeño 矽晶片電路與 RISC-V 核心設計。
- **[Nvidia](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html)**（cnbc）：Q3 財報優於預期但股價當日跌 2%；創辦人兼 CEO Jensen Huang 醜聞下台後首次全員會議，董事會確認不會讓他回任，仍在物色新任 CEO。

### 模型與基礎設施

- **[Tencent 混元](/posts/daily/2026-11-19-model-tencent-hy4-flash)**（站內文章）：開源 Hy4 flash：224B 總參數（含 64B Engram 查表模組）、12B 活躍參數、1M context，WorkIndex 任務成本只要旗艦 Hy4 的 1/20（Stage 1 已有詳細模型卡）

### 技術進展

今天的 Arxiv Digest 從三篇論文看多 Agent 共享記憶的交接設計缺陷：標準基準測不出記憶架構差異，委派調查時證據會卡在 worker 和 lead 之間，而把矛盾證據過濾乾淨反而更容易被下毒攻擊——三篇共同指出的方向是，Agent 記憶系統出問題的地方往往不是記得不夠多，而是「誰該完整看到什麼證據」的設計沒做對（[AI Agent Arxiv Digest](/posts/daily/2026-11-19-ai-agent-arxiv-digest)）。

- **[Mastra](https://mastra.ai/blog/introducing-built-in-mcp-server)**（mastra blog）：為代理框架加入內建 MCP Server，可直接連 Claude Code／Cursor／VS Code，同時推出 Custom Factory 與 Mastra Forward 代管代理工程服務。
- **[Pydantic AI](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0)**（站內文章）：v2.70.0 修了兩個 high severity ReDoS 漏洞，同時新增 ToolSearch、PruneToolResults 等 harness 原語（Stage 1 已有詳細文章）

### 資安事件

- **[Google GTIG](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/)**（helpnetsecurity）：威脅情報報告指出已觀察到無人介入、自主撰寫並發動漏洞攻擊的 AI 代理，今年 1-8 月攻擊事件近乎翻倍，8 月零日攻擊達 22 起。
- **[FBI](https://dev.to/humanbound_ai/attacker-agents-now-turn-fresh-patches-into-exploits-on-their-own-35l7)**（dev.to）：示警 ARTEX、CAIRN、CyberStrikeAI 等開源 Agentic 滲透測試框架已出現在真實入侵事件中，疑似北韓團夥並曾篡改 `.claude/settings.json` 植入後門。
- **[Sourcegraph](https://www.bankinfosecurity.com/ai-agent-finds-critical-java-flaw-in-just-3-hours-a-33427)**（bankinfosecurity）：資安新創 Calif 的 AI 模型 3 小時內發現 Java4Shell 關鍵漏洞（CVE-2026-114938）
- **[Microsoft Agent Framework](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer)**（站內文章）：PyPI 套件遭植入 .pth 啟動鉤子憑證竊取程式，Azure／GitHub Actions 憑證外洩（Stage 1 已有詳細文章）
  - **為什麼重要**：接 PyPI 上高頻發版的 agent 框架前，先確認誰握有發布權限、版本有沒有鎖住；這就是今天深度分析說的追責缺口。

### 工具與生態

今天的 GitHub Digest 主線是「安全補強追上框架擴張的速度」——Pydantic AI 和 CrewAI 同一天各修了自己與第三方依賴捅出的漏洞；工具鏈這邊 Claude-BugHunter 單日破千星、Google 把 Agent Skills 接上自家設計工具 Stitch、Mastra 跟進 Tencent LoopForge 推出自己的 issue 進、PR 出的 Factory 範本（[AI Agent GitHub Digest](/posts/daily/2026-11-19-ai-agent-github-digest)）。

- **[HYPR](https://www.globenewswire.com/news-release/2026/11/18/3405704/0/en/hypr-launches-agentpass-to-assign-every-ai-agent-to-an-accountable-human.html)**（globenewswire）：推出 AgentPass，讓企業為每個 AI 代理指定可追責的人類負責人。
  - **為什麼重要**：把「這個 agent 歸誰管」直接做成產品，對應一句話判斷：導入前先把負責人寫進合約。
- **[Vercel](https://vercel.com/blog/eve-is-now-generally-available)**（vercel blog）：eve 1.0 正式 GA，為開發者打包 AI 代理的 harness 與基礎設施。
- **[otpkit](/posts/daily/2026-11-19-tool-otpkit)**（站內文章）：免 API key 的臨時信箱／簡訊 MCP server，自動擷取 OTP 驗證碼（Stage 1 已有詳細文章）

### 法規與治理

- **[美國商務部](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html)**（cnbc）：新規要求新加坡、馬來西亞、泰國、印尼、巴西的資料中心業者，進口先進 AI 晶片前須取得許可，堵中國遠端存取運算力的漏洞。
- **[香港 AI 業界團體](https://www.crowdfundinsider.com/2026/11/323415-hong-kong-ai-group-calls-on-businesses-to-strengthen-controls-as-ai-agents-advance/)**（crowdfundinsider）：發布參考歐盟、新加坡、日韓、美國作法的自願性 AI 代理治理框架，呼籲企業強化控管，但不具法律強制力。
- **[美日印澳 Quad](https://www.nextgov.com/artificial-intelligence/2026/11/trump-touts-quad-initiative-expand-ai-access-indo-pacific/417286/)**（nextgov）：啟動印太 AI 倡議，協調資金與技術援助推動該區域採用可信賴的 AI 部署。
- **[德國官員](https://www.semafor.com/article/11/17/2026/europe-needs-innovation-friendly-regulation-to-catch-up-on-ai-german-official-says)**（semafor）：呼籲歐盟需要更友善創新的 AI 監管才能趕上競賽，直指現行 EU AI Act 墊高了歐洲企業的門檻。
- **[美國＋UAE 等多國](https://www.thenationalnews.com/opinion/editorial/2026/11/18/uae-us-france-ai-artificial-intelligence-regulation-anthropic/)**（thenationalnews）：簽署舊金山宣言，承諾保護支撐 AI 系統的敏感技術與關鍵基礎設施；以色列、卡達同步加入，沙烏地未列入。
- **[阿聯](https://www.fticonsulting.com/insights/articles/the-uaes-federal-authority-for-artificial-intelligence-and-data)**（fticonsulting）：成立聯邦 AI 與資料管理局，將 AI、資料治理與數位政府整合到單一機構統籌管理。

### 區域動態

- **中國／香港**：e27 整理 2026 年定義亞洲 AI 產業的 50 家公司，點出阿里、騰訊與中國國家基金背後的角色；香港監管機關與業界集會討論 agentic AI 快速滲入金融體系的新風險
- **日本／韓國**：Google 把 Gemini 的「Tasks」自主代理功能免費開放到日本、韓國、加拿大、澳洲、印度（由新模型 Gemini 4 Hydrogen 驅動）；JPMorgan 與韓國現代卡完成 AI 代理自主執行外匯交易的概念驗證，計畫 2027 上半年擴大測試更複雜的多代理交易
- **東南亞／南亞**：Visa 擴大亞太區 Agentic Ready 計畫，為代理發起的交易做好受理準備（另見法規段的晶片進口新規對東南亞衝擊）
- **歐洲**：巴黎新創 H Company 把企業代理平台部署到 AWS 歐洲主權雲，讓受管制產業與公部門客戶的資料不離開歐盟境內
- **非洲**：Cassava Technologies 計劃在非洲五國部署 1.2 萬張 NVIDIA GPU，投資達 $720M（另見商業案例段的 Google.org 奈及利亞資助）
- **拉丁美洲**：美洲開發銀行報告指出，廣泛採用 AI 有望十年內讓拉美與加勒比 GDP 成長 5.1%，烏拉圭已設立國家 AI 中心
- **大洋洲**：系統整合商 Insight 在澳洲、紐西蘭、新加坡等 14 國推出企業 Agent Store；Meta Muse 已在澳洲上線（另見廠商動態段）

檢索過台灣今日的 AI agent 直接新聞，未見合格事件；台灣讀者的判斷落點見本篇「一句話判斷」與「深度分析」。

### 商業案例 / 融資

- **[Anthropic](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html)**（yahoo finance）：更新 IPO 申報：以每股 $70-78 出售 8.25 億股 Class A 股票，11/18 定價，隨後在 Nasdaq 掛牌（代號 ANT）
- **[Model ML](https://techcrunch.com/2026/11/17/model-ml-raises-250m-to-automate-investment-banking-grunt-work/)**（techcrunch）：$250M C 輪，估值 $1.5B，General Atlantic 與 QED Investors 共同領投，打造投資銀行家專用 AI 代理。
- **[Arva AI](https://www.scommerce.com/arva-ai-funding/)**（scommerce）：$20M A 輪，Arthur Ventures 領投，Y Combinator、Gradient 跟投，打造銀行合規與後勤 AI 代理。
- **[Humyn Labs](https://www.business-standard.com/companies/news/ai-startup-humyn-labs-raises-47-million-in-series-a-funding-round-126111800765_1.html)**（business-standard）：$47M A 輪（Accel 領投股權部分），印度公司蒐集實體場域人類作業資料賣給 AI／機器人公司。
- **[Soket AI](https://timesofindia.indiatimes.com/business/india-business/bajaj-finance-pennant-technologies-invest-4mn-in-soket-ai/articleshow/135968881.cms)**（timesofindia）：Bajaj Finance、Pennant Technologies 共同投資 $4M 於印度 AI 新創。
- **[Google.org](https://iwajoo.substack.com/p/who-gets-to-shape-africas-ai-future)**（iwajoo）：3000 萬美元「AI for Government Innovation」計畫，奈及利亞 Helium Health 入選全球 15 家受助機構。
- **[Payhawk](/posts/daily/2026-11-19-funding-payhawk)**（站內文章）：Series C $280M，估值 $2B，Goldman Sachs Alternatives 領投，轉型打造「AI 時代的財務作業系統」（Stage 1 已有詳細文章）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Anthropic IPO 定價 | $70–78／股、8.25 億股 | [yahoo finance](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html) |
| Microsoft Agent Framework 受影響規模 | 月下載量約 19 萬次 | [資安警報文](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer) |
| Google GTIG 觀測到的攻擊增幅 | 1-8 月攻擊事件近乎翻倍，8 月零日 22 起 | [helpnetsecurity](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/) |
| 美國晶片出口新規涵蓋範圍 | 東南亞 5 國＋巴西資料中心須取得許可 | [cnbc](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html) |
| Nvidia 財報後股價 | Q3 優於預期但當日跌 2%，遭 Bernstein、Evercore 等券商降評 | [cnbc](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-11-19](/posts/daily/2026-11-19-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-11-19](/posts/daily/2026-11-19-ai-agent-github-digest)
- 📄 [框架更新｜Pydantic AI v2.70.0](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0)
- 📄 [模型卡｜Tencent Hy4 flash](/posts/daily/2026-11-19-model-tencent-hy4-flash)
- 📄 [融資速報｜Payhawk Series C $280M](/posts/daily/2026-11-19-funding-payhawk)
- 📄 [資安警報｜Microsoft Agent Framework PyPI 套件遭植入憑證竊取程式](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer)
- 📄 [工具推薦｜otpkit](/posts/daily/2026-11-19-tool-otpkit)
- 📄 [AI Engineer 面試日練 — 2026-11-19](/posts/daily/2026-11-19-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-11-19](/posts/daily/2026-11-19-product-builder-interview-daily)

## 明日關注

- Nvidia 下一任 CEO 人選的董事會搜尋進度，以及股價能否止跌
- Anthropic IPO 11/18 定價後在 Nasdaq 的首日交易表現，會不會成為其他 AI 實驗室 IPO 窗口的示範案例
- HYPR AgentPass、Oleria AI Gateway 這類「agent 身分治理」工具，是否會被更多企業採用，回應 Google GTIG 報告揭露的自主攻擊風險

## 今日收穫

之前以為 agent 的可追責性問題主要出在技術設計——像今天 Arxiv Digest 那三篇論文講的委派策略、記憶架構。今天意識到人類那一端的可追責性缺口一樣嚴重：Nvidia 一整個創辦人兼 CEO 可以因為個人醜聞被拉下台，全世界最重要的 AI 供應鏈一夕間失去決策核心，而公司治理機制讓決策權真空期長達一週以上還沒塵埃落定——這比任何 agent 的委派漏洞都更直接地提醒我：複雜系統的可追責性，從來不是只有 AI 那一半的問題。

## 參考資料

- [Anthropic IPO: what we know - Yahoo Finance](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html)
- [AI Agents News Brief: November 18, 2026 - aiagentsdirectory](https://aiagentsdirectory.com/news/ai-agents-news-brief-november-18-2026)
- [Microsoft's Agent Framework PyPI package compromised - Socket.dev](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer)
- [Early look at Loop, new autonomous AI agent from Google - testingcatalog](https://www.testingcatalog.com/early-look-at-loop-new-autonomous-ai-agent-from-google/)
- [AI-powered cyberattacks, GTIG report - helpnetsecurity](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/)
- [Attacker agents now turn fresh patches into exploits on their own - dev.to](https://dev.to/humanbound_ai/attacker-agents-now-turn-fresh-patches-into-exploits-on-their-own-35l7)
- [AI agent finds critical Java flaw in just 3 hours - bankinfosecurity](https://www.bankinfosecurity.com/ai-agent-finds-critical-java-flaw-in-just-3-hours-a-33427)
- [HYPR launches AgentPass - globenewswire](https://www.globenewswire.com/news-release/2026/11/18/3405704/0/en/hypr-launches-agentpass-to-assign-every-ai-agent-to-an-accountable-human.html)
- [Oleria extends identity governance to AI agents - Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/oleria-extends-identity-governance-ai-170000479.html)
- [eve is now generally available - Vercel](https://vercel.com/blog/eve-is-now-generally-available)
- [Introducing built-in MCP server - Mastra](https://mastra.ai/blog/introducing-built-in-mcp-server)
- [QoderWake: digital workers take the initiative - Alibaba Cloud](https://www.alibabacloud.com/blog/qoderwake-digital-workers-take-the-initiative-%E2%80%94-no-need-to-%40-every-time_603789)
- [Your new Muse: Meta launches AI personal assistant in Australia - smartcompany](https://www.smartcompany.com.au/artificial-intelligence/your-new-muse-meta-launches-ai-personal-assistant-in-australia/)
- [Advancing chip design with our models - OpenAI](https://openai.com/index/advancing-chip-design-with-our-models/)
- [Nvidia interim CEO Kress addresses staff after Jensen Huang exit - CNBC](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html)
- [US AI chip export controls on data centers - CNBC](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html)
- [Hong Kong AI group calls on businesses to strengthen controls - crowdfundinsider](https://www.crowdfundinsider.com/2026/11/323415-hong-kong-ai-group-calls-on-businesses-to-strengthen-controls-as-ai-agents-advance/)
- [Trump touts Quad initiative to expand AI access in Indo-Pacific - nextgov](https://www.nextgov.com/artificial-intelligence/2026/11/trump-touts-quad-initiative-expand-ai-access-indo-pacific/417286/)
- [Europe needs innovation-friendly regulation to catch up on AI - Semafor](https://www.semafor.com/article/11/17/2026/europe-needs-innovation-friendly-regulation-to-catch-up-on-ai-german-official-says)
- [UAE, US, France AI regulation declaration - The National](https://www.thenationalnews.com/opinion/editorial/2026/11/18/uae-us-france-ai-artificial-intelligence-regulation-anthropic/)
- [The UAE's Federal Authority for Artificial Intelligence and Data - FTI Consulting](https://www.fticonsulting.com/insights/articles/the-uaes-federal-authority-for-artificial-intelligence-and-data)
- [50 Asian AI companies that defined 2026 - e27](https://e27.co/cheques-bans-and-bell-ringing-50-asian-ai-companies-that-defined-2026-20261118/)
- [Agentic AI seeps into finance, concerns grow - SCMP](https://www.scmp.com/business/banking-finance/article/3374724/agentic-ai-seeps-finance-concerns-grow-over-new-risks-and-blind-spots)
- [You can now assign Gemini 'tasks' for free in six countries - 9to5google](https://9to5google.com/2026/11/17/gemini-tasks-free/)
- [JPMorgan is working on AI agent transactions that don't involve humans - CNBC](https://www.cnbc.com/amp/2026/11/18/jpmorgan-hyundai-card-ai-agents-payments.html)
- [Visa expands Agentic Ready in Asia Pacific - tribuneindia](https://www.tribuneindia.com/news/advertorial-disclaimer/visa-expands-agentic-ready-to-help-scale-trusted-ai-commerce-in-asia-pacific)
- [French AI startup H Company puts agents on AWS European sovereign cloud - actuia](https://www.actuia.com/en/news/french-ai-startup-h-company-puts-agents-on-aws-european-sovereign-cloud/)
- [Cassava Technologies plans $720M AI infrastructure rollout in five African countries - asaaseradio](https://asaaseradio.com/cassava-technologies-plans-720m-ai-infrastructure-rollout-in-five-african-countries/)
- [IDB weekly digest - puentelatam](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-58a)
- [Insight launches Agent Store, engineering program - arnnet](https://www.arnnet.com.au/article/4249944/insight-launches-agent-store-engineering-program-to-accelerate-enterprise-ai-adoption.html)
- [Model ML raises $250M to automate investment banking grunt work - TechCrunch](https://techcrunch.com/2026/11/17/model-ml-raises-250m-to-automate-investment-banking-grunt-work/)
- [Arva AI funding - scommerce](https://www.scommerce.com/arva-ai-funding/)
- [AI startup Humyn Labs raises $47 million in Series A - Business Standard](https://www.business-standard.com/companies/news/ai-startup-humyn-labs-raises-47-million-in-series-a-funding-round-126111800765_1.html)
- [Bajaj Finance, Pennant Technologies invest $4mn in Soket AI - Times of India](https://timesofindia.indiatimes.com/business/india-business/bajaj-finance-pennant-technologies-invest-4mn-in-soket-ai/articleshow/135968881.cms)
- [Who gets to shape Africa's AI future - iwajoo](https://iwajoo.substack.com/p/who-gets-to-shape-africas-ai-future)
