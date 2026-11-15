---
title: "AI 日報 — 2026-11-11"
date: 2026-11-11
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "模型層一週內換了三次王，真正出事的卻是 agent 底下的推理引擎與 MCP 依賴——選模型變便宜了，盤點依賴鏈才是新的固定成本"
tldr: "Anthropic 發表 Fable 5.2，在 Artificial Analysis Index v5 拿 65 分居首，定價降到每百萬 token $8/$40；Google 同週全面開放 Gemini 4 Carbon，Meta 推出 $0.10/$0.50 的小模型 Muse Ember；NEAR AI 證實 SGLang 遠端執行漏洞讓攻擊者在機密運算環境內執行程式碼；Glow Labs 發現 coding agent 憑訓練記憶安裝已棄用的 MCP server；澳洲宣布設 AI 安全監管機關並要求快速通報事故；Anthropic 啟動 IPO 路演，估值上看 1.02 兆美元"
draft: false
series:
  name: "AI 日報"
  order: 88
---

> 🌏 [English version](/posts/daily/2026-11-11-ai-agent-daily-en)

## 一句話判斷

**今天模型層三家同時降價或換代，選模型的成本正在快速下降；但真正出事的地方在 agent 底下的推理引擎與 MCP 依賴。台灣團隊為了資料主權自架推理服務、接在地 MCP Hub 時，要把「依賴鏈盤點與事故通報」列成固定預算，不能只比哪個模型分數高。**

## 深度分析：模型愈來愈好換，推理引擎與 MCP 依賴的監督成本卻在上升

我認為今天的訊號合起來說明一件事：agent 系統的交易成本，正從「選哪個模型」移到「確認自己到底跑了什麼」。（框架：交易成本）

先看模型層。Anthropic 的 Fable 5.2 在 Artificial Analysis Index v5 最高檔拿 65 分，領先 Gemini 4 Carbon 的 60 分，定價從前代 $10/$50 降到 $8/$40（[The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/)）。隔天 Google 全面開放 Carbon，每個任務成本 $7.76，High 檔的 Fable 5.2 約 $9（[The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)）。Meta 的 Muse Ember 用 $0.10/$0.50 落在成本與能力的 Pareto 線上（[Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/)）。阿里雲開源的 HiRoute 直接把「每個任務該給哪個模型」做成本機路由引擎（[Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757)）。換模型這件事，搜尋與比價成本都在下降。

再看依賴層。NEAR AI 的推理伺服器跑在機密運算環境裡，攻擊者卻透過開源推理引擎 SGLang 的遠端執行漏洞在環境內執行程式碼；NEAR AI 自己寫明，機密運算「不防護環境內軟體本身的漏洞」（[NEAR AI](https://near.ai/blog/security-incident-report-sglang-vulnerability)）。Glow Labs 則發現，agent 安裝已棄用 MCP server 的工作階段中，98% 是因為模型「記得」訓練資料裡的舊套件，而不是去找官方最新版（[Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data)）。CSA 把 MCP SDK 近一年的多個高風險公告歸成同一種「傳輸層信任缺口」（[CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/)）。這些都不是換一個更強的模型能解決的問題。

監督成本還會被法規推高。澳洲宣布設立 AI 安全監管機關，標準要求業者在「行為偏離開發者意圖」這類事故發生時快速通報政府（[AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/)）。要能快速通報，前提是知道自己的 agent 裝了哪些 server、跑在哪個版本的推理引擎上。

對台灣團隊的意義：國網中心同週展示 TAIWAN AI RAP 平台與串接 4.9 萬筆政府開放資料的 Twinkle Hub（[工商時報](https://www.ctee.com.tw/news/20261110702153-430104)），在地自架與在地 MCP 會愈來愈多。自架換到的是資料主權，代價是推理引擎與 MCP 套件的修補責任也一起搬回自己身上。導入時先建一份「agent 依賴清單」（推理引擎版本、MCP server 來源、是否已棄用），比多跑一輪模型評比更值得。

```diagram
title: 模型層變便宜，依賴層開始出事
desc: 由上而下四層：模型層價格下降、推理引擎層 SGLang 漏洞、工具連接層 MCP 已棄用套件與 SDK 信任缺口、通報層澳洲要求快速通報
caption: 依 The Decoder、Simon Willison、NEAR AI 事故報告、Glow Labs、CSA 與 AP 報導整理（2026-11-09 至 11-10）。
---
<svg viewBox="0 0 640 312">
  <rect class="dg-box" x="16" y="16" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="38" text-anchor="middle" dominant-baseline="central">模型層</text>
  <text class="dg-sub" x="116" y="58" text-anchor="middle" dominant-baseline="central">好換、愈來愈便宜</text>
  <rect class="dg-box" x="240" y="16" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="38" text-anchor="middle" dominant-baseline="central">Fable 5.2 降到 $8/$40；Carbon 全面開放</text>
  <text class="dg-sub" x="432" y="58" text-anchor="middle" dominant-baseline="central">Muse Ember $0.10/$0.50；HiRoute 自動選模型</text>

  <rect class="dg-box dg-box--warn" x="16" y="92" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="114" text-anchor="middle" dominant-baseline="central">推理引擎層</text>
  <text class="dg-sub" x="116" y="134" text-anchor="middle" dominant-baseline="central">機密運算擋不住</text>
  <rect class="dg-box dg-box--warn" x="240" y="92" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="114" text-anchor="middle" dominant-baseline="central">NEAR AI：SGLang 遠端執行漏洞</text>
  <text class="dg-sub" x="432" y="134" text-anchor="middle" dominant-baseline="central">約 100 名使用者、18 個舊版 agent 受影響</text>

  <rect class="dg-box dg-box--warn" x="16" y="168" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="190" text-anchor="middle" dominant-baseline="central">工具連接層</text>
  <text class="dg-sub" x="116" y="210" text-anchor="middle" dominant-baseline="central">agent 憑記憶裝套件</text>
  <rect class="dg-box dg-box--warn" x="240" y="168" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="190" text-anchor="middle" dominant-baseline="central">McPhantom：98% 來自訓練資料記憶</text>
  <text class="dg-sub" x="432" y="210" text-anchor="middle" dominant-baseline="central">CSA：MCP SDK 傳輸層信任缺口</text>

  <rect class="dg-box" x="16" y="244" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="266" text-anchor="middle" dominant-baseline="central">通報層</text>
  <text class="dg-sub" x="116" y="286" text-anchor="middle" dominant-baseline="central">要先知道自己跑了什麼</text>
  <rect class="dg-box" x="240" y="244" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="266" text-anchor="middle" dominant-baseline="central">澳洲：設 AI 安全監管機關</text>
  <text class="dg-sub" x="432" y="286" text-anchor="middle" dominant-baseline="central">偏離意圖的事故須快速通報</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **IBM × Microsoft** | 聯合發表 Imagine Enterprise，IBM Consulting 帶 6,000 多個預建 agent 與資產，Microsoft 提供雲端、AI 與資安底層，合格案件附雙方駐點工程師，主打受監管產業 | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| **Meta Muse（印度）** | WhatsApp 版 AI agent Muse 公布印度定價：Power 層 ₹1,799、Maximum 層 ₹8,999 | [The Hindu](https://www.thehindu.com/business/Industry/meta-sets-india-pricing-for-muse-ai-agent-ahead-of-launch/article71682680.ece) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Claude Fable 5.2 / Mythos 5.2** | Index v5 最高檔 65 分居首；定價 $8/$40（前代 $10/$50）；Mythos 只開放給通過資安或生命科學驗證計畫的組織 | [The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/) |
| **Gemini 4 Carbon** | 兩週測試後全面開放，Index 60 分；Antigravity 同步預覽「/swarm」多 agent 協作 | [The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/) |
| **Meta Muse Ember** | 小型模型，鎖定工具呼叫、程式子任務、路由、擷取等重複性 agent 工作，短 prompt 定價 $0.10/$0.50 | [Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/) |
| **MKA benchmark** | Google 與 Artificial Analysis 推出多模態知識型 agent benchmark，200 個任務，橫跨 10 個產業、83 種職業 | [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/) |

### 工具與生態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Runpod for Agents** | 託管 MCP server 加上經過測試的技能庫，讓 coding agent 依現行文件而非訓練記憶操作基礎設施；平台上已有超過一半 CLI 指令由 agent 發出 | [PR Newswire](https://www.prnewswire.com/news-releases/runpod-for-agents-lets-developers-hand-infrastructure-work-to-their-coding-agents-302934084.html) |
| **.NET 11** | STS 版，支援兩年，含 C# 15 與 agentic 開發工具改進 | [.NET Blog](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/) |
| **HiRoute（阿里雲）** | 開源、本機執行的 agent 路由引擎，替 Codex、Claude Code 等 agent 決定每個任務交給哪個模型 | [Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757) |
| **智合 AI** | 在第九屆進博會發表 Agent 3.5 本地部署版，並開源 70 項法律 AI 技能 | [GlobeNewswire via Manila Times](https://www.manilatimes.net/2026/11/10/tmt-newswire/globenewswire/zhihe-ai-launches-agent-35-local-edition-and-open-sources-70-legal-ai-skills-at-ciie-2026/2465992) |

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **NEAR AI × SGLang** | 攻擊者利用 SGLang 遠端執行漏洞，下載約 100 名使用者帳戶資料，並存取 18 個未跑在機密運算環境的舊版 agent 的對話與設定；已撤銷工作階段、輪替憑證並修補 | [NEAR AI](https://near.ai/blog/security-incident-report-sglang-vulnerability)、[The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002) |
| **McPhantom** | Glow Labs 觀察到 coding agent 自行安裝已封存、不再修補的 MCP server，跨多個 agent 工具與模型供應商都有；這些本機 server 先前的掃描看不到，是做端點盤點時才發現 | [Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data) |
| **MCP SDK 傳輸層** | CSA 整理 2025-12 至 2026-10 的 SDK 公告：本機 server 缺 DNS rebinding 防護、OAuth issuer 未綁定、共用 transport 造成跨 client 回應外流；只升級不夠，還要設定預期 issuer | [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/) |

### 法規與治理

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **澳洲** | 總理 Albanese 宣布設立 AI 安全監管機關，起因是 OpenAI agent 6 月誤入衛生部 Medicare 統計入口網站，公司 9 月才通報 | [AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/) |
| **巴黎 AI 安全宣言** | 八國與 OpenAI、Anthropic、Microsoft、Mistral AI 代表簽署，承諾關機機制、獨立稽核與揭露已知風險，但沒有期限與罰則；德國未簽 | [The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/) |
| **EU AI Act 時程** | 回顧 5 月 Digital Omnibus 協議：獨立高風險系統義務延到 2027-12-02，內嵌產品延到 2028-08-02 | [Softtechhub](https://softtechhub.us/2026/11/10/eu-ai-act-high-risk-delay-2027/) |
| **EU Digital Fairness Act 草案** | 外流草案第 26 條：購物 agent 業者若從推薦中收佣或與商家有利益衝突，就要重新取得消費者同意 | [PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/eu-draft-law-links-ai-shopping-agents-autonomy-to-commercial-incentives/) |
| **Gartner 治理預測** | Forbes 專欄引用 Gartner：到 2027 年，40% 企業會因上線後才發現的治理缺口降級或下架自主 agent | [Gartner](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **台灣** | 國網中心發表 TAIWAN AI RAP 成果，Twinkle Hub 串接 4.9 萬筆以上政府開放資料；國科會主委吳誠文表示明年政策將大幅投資 AI 應用（[工商時報](https://www.ctee.com.tw/news/20261110702153-430104)） |
| **亞太** | Forrester 預測三分之一大型企業會遇到影子 agent 治理問題，每個核准的 agent 背後至少有 10 個員工自建的 agent（[ITBrief Asia](https://itbrief.asia/story/forrester-warns-of-shadow-ai-governance-gap-in-asia-pacific)） |
| **中東** | 分析文章檢視 11 月 2 日宣布的 ADNOC、OpenAI、G42 合作，把互聯 agent 用在阿布達比油田規劃與生產（[Debuglies](https://debuglies.com/2026/11/10/agentic-ai-and-national-security-the-new-architecture-of-industrial-sovereignty-adnoc-abu-dhabi-national-oil-company-openai-g42-partnership/)） |
| **非洲** | Qore Technologies 將在 11 月 18 日拉哥斯 Nexus 大會推出平台，讓銀行不需專屬工程團隊就能在既有系統上部署 agent（[BusinessDay](https://businessday.ng/technology/article/african-banks-can-now-deploy-ai-agents-without-engineering-teams-as-qore-unveils-new-platform/)） |
| **拉丁美洲** | 智利 AI 法案修正案提交截止日為 12 月 4 日（[Puente LatAm](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-130)） |

日本、韓國、東南亞已補掃，同一時間窗內未找到跟 agent 直接相關、可確認日期的新事件。

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Anthropic IPO** | 啟動路演，每股 $70-78、發行 8.25 億股，目標估值上看 1.02 兆美元；另向 Google、NVIDIA、Microsoft 等私募 $26B | [The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/) |
| **Nominal** | C 輪 $240M、估值 $3B，Lightspeed 領投、Insight Partners 共同領投，做硬體工程的 AI 平台 | [Nominal](https://nominal.io/blog/series-c) |
| **Coframe** | A 輪 $25M（Khosla Ventures、Hanabi Capital 共同領投），累計 $35M，用多個 agent 持續生成與測試網站版本 | [Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/) |
| **Workday** | LangChain 案例：4 人團隊用 LangGraph 與 LangSmith 建內部 agent 平台，資料存取控制綁 Workday 稽核政策 | [LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith) |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Fable 5.2 定價（每百萬 token） | $8 / $40 | [The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/) |
| Gemini 4 Carbon 每任務成本 | $7.76 | [The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/) |
| Muse Ember 短 prompt 定價 | $0.10 / $0.50 | [Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/) |
| agent 因訓練記憶裝已棄用 MCP 的比例 | 98% | [Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data) |
| NEAR AI 受影響舊版 agent | 18 個 | [The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002) |
| Anthropic IPO 目標估值上限 | 1.02 兆美元 | [The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/) |

## 明日關注

- SGLang 專案會不會發布對應的 CVE 與修補版本；自架 SGLang 的團隊要確認自己的版本是否受影響。
- 澳洲監管機關的罰則與「快速通報」時限細節，會不會成為其他國家的參考範本。
- Fable 5.2、Carbon、Ember 的實際任務成本在 agent 工作負載上的社群實測。

## 今日收穫

之前以為機密運算（TEE）可以把推理服務的資料外洩風險降到很低；NEAR AI 的事故說明 TEE 只防作業者與主機，環境裡跑的推理引擎本身有漏洞時，資料一樣會被讀走。

## 參考資料

- [Claude Fable 5.2 and Mythos 5.2 cement Anthropic's AI lead — The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/)
- [Gemini 4 Carbon arrives — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [Introducing Muse Ember — Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/)
- [Introducing the Multimodal Knowledge Agent benchmark — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/)
- [IBM and Microsoft announce Imagine Enterprise — Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [NEAR AI Security Incident Report: SGLang Vulnerability](https://near.ai/blog/security-incident-report-sglang-vulnerability)
- [NEAR AI says SGLang vulnerability exposed user account details — The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002)
- [McPhantom: AI coding agents are installing deprecated MCP servers — Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data)
- [MCP's Transport Trust Gap — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/)
- [Runpod for Agents — PR Newswire](https://www.prnewswire.com/news-releases/runpod-for-agents-lets-developers-hand-infrastructure-work-to-their-coding-agents-302934084.html)
- [Announcing .NET 11 — .NET Blog](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/)
- [HiRoute: choose the best-fit model — Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757)
- [Zhihe AI Agent 3.5 Local Edition — Manila Times](https://www.manilatimes.net/2026/11/10/tmt-newswire/globenewswire/zhihe-ai-launches-agent-35-local-edition-and-open-sources-70-legal-ai-skills-at-ciie-2026/2465992)
- [Australia to launch AI safety regulator — AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/)
- [Paris declaration on AI shutdown mechanisms — The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/)
- [EU AI Act high-risk rules delayed to December 2027 — Softtechhub](https://softtechhub.us/2026/11/10/eu-ai-act-high-risk-delay-2027/)
- [EU draft law links AI shopping agents' autonomy to commercial incentives — PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/eu-draft-law-links-ai-shopping-agents-autonomy-to-commercial-incentives/)
- [Gartner on AI agent governance gaps](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure)
- [Closing the AI control gap — Forbes](https://www.forbes.com/councils/forbestechcouncil/2026/11/10/closing-the-ai-control-gap-requires-a-new-operating-model-for-governance/)
- [Meta sets India pricing for Muse AI agent — The Hindu](https://www.thehindu.com/business/Industry/meta-sets-india-pricing-for-muse-ai-agent-ahead-of-launch/article71682680.ece)
- [多模態主權AI模型亮相 — 工商時報](https://www.ctee.com.tw/news/20261110702153-430104)
- [Forrester warns of shadow AI governance gap in Asia Pacific — ITBrief Asia](https://itbrief.asia/story/forrester-warns-of-shadow-ai-governance-gap-in-asia-pacific)
- [ADNOC–OpenAI–G42 partnership analysis — Debuglies](https://debuglies.com/2026/11/10/agentic-ai-and-national-security-the-new-architecture-of-industrial-sovereignty-adnoc-abu-dhabi-national-oil-company-openai-g42-partnership/)
- [Qore unveils AI agent platform for African banks — BusinessDay](https://businessday.ng/technology/article/african-banks-can-now-deploy-ai-agents-without-engineering-teams-as-qore-unveils-new-platform/)
- [Puente LatAm Weekly Digest — November 10, 2026](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-130)
- [Anthropic kicks off IPO roadshow — The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/)
- [Nominal raises $240M Series C](https://nominal.io/blog/series-c)
- [Coframe raises $25M Series A — Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/)
- [How Workday built an enterprise-scale AI agent platform — LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith)
