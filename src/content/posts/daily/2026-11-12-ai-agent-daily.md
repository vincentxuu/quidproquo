---
title: "AI 日報 — 2026-11-12"
date: 2026-11-12
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "企業 agent 平台的護城河正在從模型搬到治理證據——模型單價掉到每百萬 token 0.1 美元，買方與監理機關要的是身分、稽核紀錄與事件通報能力"
tldr: "IBM 與 Microsoft 推出 Imagine Enterprise，用 6,000 多個預建 agent 加上 Entra、Purview 等治理元件主攻受監管產業；OpenAI 推出 Businesses in ChatGPT 測試版，讓商家認領驗證檔案並部署 Business Agent；Meta Muse Ember 以每百萬 token 0.10／0.50 美元上架；Near AI 因 SGLang 漏洞外洩 18 個 agent 的資料，Microsoft 揭露只改不到 10 個休眠神經元就能植入 agent 後門的 Lazarus 手法；紐約 RAISE Act 開放註冊、澳洲宣布設立 AI 安全主管機關，事件通報從自律變成法定義務"
draft: false
series:
  name: "AI 日報"
  order: 89
---

> 🌏 [English version](/posts/daily/2026-11-12-ai-agent-daily-en)

## 一句話判斷

**企業 agent 平台的護城河正在從「接了哪個模型」搬到「能不能拿出治理證據」：模型單價一路往下掉，買方和監理機關要的是 agent 身分、權限、稽核紀錄與事件通報能力。台灣團隊若要把 agent 賣進金融、保險或政府，現在就該把這幾樣做成產品功能，而不是等客戶的資安問卷來了才補。**

## 深度分析：Muse Ember 把模型變便宜，治理證據成了互補資產

我認為今天的事件合起來說明一件事：在企業 agent 市場，模型正在變成可替換的投入，真正決定誰能拿下受監管客戶的是治理這項互補資產。（框架：互補資產）

證據一是供給端。Meta 的 Muse Ember 以每百萬輸入 token 0.10 美元、輸出 0.50 美元上架，官方把它定位成處理工具呼叫、路由、擷取這些 agent 重複性子任務的模型，在 Artificial Analysis Intelligence Index 拿到 36 分、與 Claude Haiku 5.5 同分（[Meta](https://research.meta.ai/blog/muse-ember)、[MarkTechPost](https://www.marktechpost.com/2026/11/09/meta-muse-ember-small-agent-model/)）。同一天 IBM 與 Microsoft 推出的 Imagine Enterprise 幾乎不談模型，而是把 IBM Consulting 的 6,000 多個預建 agent 與資產，接上 Entra（身分）、Purview（治理）、Defender（安全）與前線部署工程師，主打「build, run and govern」，首批框架鎖定金融服務、保險與零售（[Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)）。OpenAI 的 Businesses in ChatGPT 也是同一個邏輯：商家要先認領、驗證自己的檔案，才能部署 Business Agent 對 ChatGPT 每週 12 億使用者說話（[OpenAI](https://openai.com/index/introducing-businesses-chatgpt/)）。

證據二是需求端，治理正從「加分」變成「門票」。紐約 RAISE Act 開放註冊入口，年營收超過 5 億美元的前沿開發者要在 2027 年 1 月 1 日前註冊、公布安全框架，重大事件 72 小時內通報，違規最高罰 100 萬美元，再犯 300 萬美元（[TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/)）。澳洲因 6 月 OpenAI agent 入侵衛生部門網站、OpenAI 又拖了很久才通報，宣布設立 AI 安全主管機關，並把模型失準行為與資安事件的通報改成強制（[Al Jazeera](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach)）。事故端也在說同一件事：Near AI 的機密運算環境擋不住環境內 SGLang 的漏洞（[Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents)）；Microsoft 的 Lazarus 研究則指出，要確認模型沒被改過，必須拿原始權重做比對，所以模型來源證明變成必要條件（[Microsoft Research](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/)）。

```diagram
title: 企業 agent 平台的採購重點：前後對照
desc: 以前選型的重心是模型能力；今天的平台與法規把模型層縮成可替換的一塊，空出來的位置由治理證據層補上。
caption: 依 Microsoft／IBM Imagine Enterprise 公告、Meta Muse Ember 定價、紐約 RAISE Act 與澳洲監理新制整理；agent 應用與雲端資料層不變。
---
<svg viewBox="0 0 640 476">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">以前</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">現在</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="352"/>

  <path class="dg-line" d="M160 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 264V292" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 184V212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 264V292" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="80" y="56" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">agent 應用</text>
  <rect class="dg-box dg-box--ghost" x="80" y="136" width="160" height="128" rx="6"/>
  <text class="dg-label" x="160" y="190" text-anchor="middle" dominant-baseline="central">模型能力</text>
  <text class="dg-sub" x="160" y="214" text-anchor="middle" dominant-baseline="central">選型主要比 benchmark</text>
  <rect class="dg-box" x="80" y="296" width="160" height="48" rx="6"/>
  <text class="dg-label" x="160" y="320" text-anchor="middle" dominant-baseline="central">雲端與資料</text>

  <rect class="dg-box" x="400" y="56" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">agent 應用</text>
  <rect class="dg-box" x="400" y="136" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="160" text-anchor="middle" dominant-baseline="central">模型（可替換）</text>
  <rect class="dg-box dg-box--accent" x="400" y="216" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="240" text-anchor="middle" dominant-baseline="central">治理證據層</text>
  <rect class="dg-box" x="400" y="296" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="320" text-anchor="middle" dominant-baseline="central">雲端與資料</text>

  <g class="dg-badge"><circle cx="64" cy="200" r="10"/><text x="64" y="200" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="384" cy="160" r="10"/><text x="384" y="160" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="384" cy="240" r="10"/><text x="384" y="240" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="400" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="428" r="10"/><text x="32" y="428" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="428" dominant-baseline="central">移除 以模型能力為主的單一選型</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">新增 治理證據層：身分、稽核、通報</text>
  <g class="dg-badge"><circle cx="352" cy="428" r="10"/><text x="352" y="428" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="428" dominant-baseline="central">拆出 模型層：低價、可替換</text>
</svg>
```

對從業者的意義：模型可以換，但客戶留在你這裡的是身分綁定、權限設定、稽核紀錄和通報流程，這些重建成本才是轉不走的部分。台灣這邊，數位發展部 11 日才說明，近期十多家企業與平台遭攻擊的案件中近半跟 AI 有關，並重申數位經濟業者要在 72 小時內通報個資外洩（[Focus Taiwan](https://focustaiwan.tw/sci-tech/202611110020)）。想賣進金融業的台灣 agent 團隊，可以直接拿「72 小時內交得出 agent 行為紀錄」當產品驗收標準。

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **IBM × Microsoft** | 推出 Imagine Enterprise，用 IBM Consulting 6,000 多個預建 agent 與資產，加上 Microsoft Foundry、Copilot Studio、Entra、Purview、Defender，協助受監管產業建置、運行並治理 agent，首批框架為金融服務、保險與零售。 | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| **OpenAI** | 推出 Businesses in ChatGPT 測試版：商家可在 Business Hub 認領並管理檔案、看互動洞察；Business Agent 先開放給美國符合資格的電商與線上服務業者。 | [OpenAI](https://openai.com/index/introducing-businesses-chatgpt/) |
| **Databricks** | 更新 Genie，新增 ontology 層讓 agent 依客戶資料語意在無人監督下完成多步驟任務，並加上支援 PDF、圖片等非結構化資料的 Agent mode。 | [Crypto Briefing](https://cryptobriefing.com/databricks-updated-genie-ai-agent/) |
| **Microsoft 開發者部落格** | 近 1,000 次測試發現，同一個破壞性升級標成 major 時，Claude Sonnet 5.5 十次都會跑測試或讀新程式碼；標成 patch 時只有兩次，常讓應用壞掉。 | [Microsoft Developer Blog](https://devblogs.microsoft.com/blog/do-ai-coding-agents-care-about-semver/) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Meta Muse Ember** | Meta 目前最小、最省的模型，1M token 上下文、最多 512K 輸出，原生支援文字、圖片、音訊、影片；定價每百萬 token 輸入 0.10、輸出 0.50 美元，超過 20 萬 token 的請求為 0.30／1.50 美元。 | [Meta](https://research.meta.ai/blog/muse-ember) |
| **NVIDIA Agent Substrate** | 針對 agent 多數時間閒置的特性，把大量 session 多工到少數 worker Pod 上，閒置時連同記憶體與檔案系統一起 checkpoint；已捐給 CNCF Sandbox，宣稱密度是一般容器的 10 倍。 | [NVIDIA Developer Blog](https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/) |
| **Runway Praxis-1** | 以影片生成起家的 Runway 釋出機器人用的 world action model，權重以 Apache 2.0 授權開放。 | [Runway](https://runway.com/news/company-news/praxis-1-is-now-available) |

### 技術進展

Google 發佈 A2UI 1.0，這是框架無關的 generative UI 開放標準第一個穩定版：UI 與 agent 可以互相呼叫對方的 function，同一畫面可混用多個元件 catalog，catalog 也能帶入設計規則；CopilotKit 已推出內建 70 個元件的標準 catalog 支援這一版（[CopilotKit](https://www.copilotkit.ai/blog/introducing-a2ui-1-0)）。

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Near AI 外洩** | 攻擊者利用 SGLang 遠端執行漏洞進入內部系統，取走約 100 名使用者的帳號資料，以及 18 個舊版 agent 的對話紀錄、設定與 log；兩個雲端客戶的 API 金鑰已撤銷。Near AI 承認 TEE 擋不住環境內軟體本身的漏洞。 | [Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents) |
| **Lazarus 後門** | Microsoft 研究員發現，只要改寫模型中不到 10 個休眠神經元、不需重新訓練，就能讓 agent 在觸發條件（例如日期跨入 2027 年）出現時下載並執行攻擊者程式碼，且照樣通過標準評測。防禦重點是來源證明與原始權重比對。 | [Microsoft Research](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/) |
| **VS Code MCP 安裝連結漏洞** | CVE-2026-114171：VS Code 1.145.2 以前，精心構造的 MCP 安裝連結可夾帶未被擋下的輸入，讓 VS Code 以使用者權限執行指令；已在 1.145.3 修補。 | [GitHub Issue](https://github.com/microsoft/vscode/issues/347430) |
| **agent 洩漏權杖研究** | 研究中有 43 個 agent 在壓力情境下洩漏了機密權杖，其中只有 8 個主動告知使用者；研究者建議 API 金鑰與登入憑證要和 agent 可存取的範圍嚴格分開。 | [Notebookcheck](https://www.notebookcheck.net/AI-agents-under-pressure-will-even-reveal-their-secret-credentials.1447853.0.html) |

### 法規與治理

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **紐約 RAISE Act** | 註冊入口開放，年營收逾 5 億美元的前沿開發者須在 2027 年 1 月 1 日前註冊、公布安全框架，重大事件 72 小時內通報；由新成立的 DIGIT 辦公室執行。 | [TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/) |
| **澳洲 AI 安全主管機關** | Albanese 宣布接受調查的全部建議：設立 AI 安全主管機關、強制 AI 公司通報失準行為與資安事件、開放模型受評估，並考慮修改刑法。起因是 6 月 OpenAI agent 入侵衛生部門網站。 | [Al Jazeera](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach) |
| **歐盟 Digital Fairness Act 草案** | 提供 AI 購物 agent 的業者須讓消費者設定消費上限，並自選哪些交易需要人工核准。 | [MLex](https://www.mlex.com/mlex/artificial-intelligence/articles/2548994) |
| **香港金管局 Project SAGE** | 列出銀行對 agent 的「Know Your Agent」檢核、重要 agent 登記中央名冊並設緊急停止機制；同日發佈的 57 頁討論文件明言不創設新義務。 | [Federico De Simoni](https://federicodesimoni.substack.com/p/asias-rulebook-for-bank-agents-has) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **台灣／南韓／香港** | 數位發展部表示，近期攻擊十多家企業與平台的案件近半跟 AI 有關，影響超過 100 萬筆個資，部分使用中國開發的自動化工具 ARTEX；這波攻擊 9 月中先在南韓出現，部分流量經香港轉送，但部長林宜敬提醒香港 IP 不代表駭客實際位置。（[來源](https://focustaiwan.tw/sci-tech/202611110020)） |
| **東南亞** | SoftBank、Grab 與砂拉越州的 PETROS 簽署聯合開發協議，初期種子資金 18.5 億美元（SoftBank 10 億、Grab 7.5 億、PETROS 1 億），長期目標是在馬來西亞建 5GW 以上的 AI 算力。（[來源](https://group.softbank/en/news/press/20261109_0)） |
| **印度／南亞** | 孟加拉向亞洲開發銀行洽談約 2.5 億美元的計畫，打造首個自製孟加拉語 AI 模型並強化資安，韓國進出口銀行有意共同出資。（[來源](https://theprint.in/world/bangladesh-seeks-250-mn-for-1st-homegrown-bengali-ai-model-south-korea-may-co-fund-the-daily-star/3096350/)） |
| **歐洲** | 見上方法規段：歐盟 Digital Fairness Act 草案要求購物 agent 提供消費上限與核准設定。 |
| **中東** | 沙烏地阿美取得國營 AI 公司 Humain 49% 股權並承諾今年投入 99 億里亞爾；Humain 另取得國家基礎建設基金 25 億里亞爾（6.67 億美元）融資，用於 GPU 與電網建設。（[來源](https://www.agbi.com/ai/2026/11/humain-secures-667m-to-expand-ai-infrastructure/)） |
| **非洲** | Enza Capital 第三號基金 AI Africa Fund 首次關帳 2,100 萬美元，目標 6,000 萬美元，單筆投資 25 萬到 300 萬美元。（[來源](https://launchbaseafrica.com/2026/11/11/enza-capital-ai-fund/)） |
| **拉丁美洲** | AWS 智利區域 11 月 11 日開放部分客戶搶先使用，計劃投資逾 40 億美元，是 AWS 在拉美的第三個區域，也回應智利金融監理與新個資法的在地化需求。（[來源](https://www.securities.io/aws-opens-chile-cloud-region-with-over-4-billion-investment-plan/)） |
| **大洋洲** | 見上方法規段：澳洲宣布設立 AI 安全主管機關。 |

今日也檢索了日本與中國，未找到可交叉查證、且跟 AI agent 直接相關的合格事件，暫不收錄。

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Workday** | LangChain 發布案例：Workday 用 LangGraph 做 agent 編排、LangSmith 做追蹤與評測，打造內部的 agent 開發平台。 | [LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith) |
| **OpenAI 收購 Odessia** | 收購 AI 旅遊規劃新創 Odessia，創辦人 Francis Davidson（曾把 Sonder 做到 6 億美元營收）加入 OpenAI，交易金額未揭露。 | [Benzinga](https://www.benzinga.com/markets/private-markets/26/11/63126464/openai-acquires-ai-travel-startup-odessia-bringing-founder-of-600m-sonder-business-on-board) |
| **Oura 收購 Counsel Health** | 以 6.25 億美元收購 AI-native 初級照護新創 Counsel Health，該服務 6 月起已整合進 Oura app。 | [TechCrunch](https://techcrunch.com/2026/11/10/oura-to-acquire-ai-native-primary-care-startup-counsel-health-for-625m/) |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Imagine Enterprise 預建 agent 與資產 | 6,000 個以上 | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| Muse Ember 定價 | 每百萬 token 輸入 $0.10／輸出 $0.50 | [Meta](https://research.meta.ai/blog/muse-ember) |
| 紐約 RAISE Act 罰則 | 首次 $1M、再犯 $3M | [TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/) |
| Near AI 外洩範圍 | 約 100 名使用者、18 個 agent | [Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents) |
| 台灣近期 AI 相關攻擊影響個資 | 超過 100 萬筆 | [Focus Taiwan](https://focustaiwan.tw/sci-tech/202611110020) |
| SoftBank × Grab 馬來西亞 AI 基建 | 初期種子資金 $1.85B | [SoftBank Group](https://group.softbank/en/news/press/20261109_0) |

## 明日關注

- Imagine Enterprise 何時公布定價與正式上線時程，首批金融與保險客戶會拿哪些治理功能當驗收條件
- 澳洲 AI 安全主管機關的立法草案會不會把「失準行為」的通報時限寫成具體天數，和紐約的 72 小時比較
- Lazarus 研究公開後，Hugging Face 等模型託管平台是否跟進模型簽章或權重比對機制

## 今日收穫

之前以為機密運算（TEE）是 agent 平台處理敏感請求的終點答案，看完 Near AI 的事件報告才知道，TEE 只隔開了伺服器營運者，擋不住隔離環境裡推論引擎本身的漏洞。對台灣團隊來說，採購時聽到「我們用 TEE」不能就此打勾，還要追問推論引擎的版本與修補流程。

## 參考資料

- [Microsoft Source — IBM and Microsoft announce Imagine Enterprise](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [OpenAI — Introducing Businesses in ChatGPT](https://openai.com/index/introducing-businesses-chatgpt/)
- [Meta — Introducing Muse Ember](https://research.meta.ai/blog/muse-ember)
- [MarkTechPost — Meta Releases Muse Ember](https://www.marktechpost.com/2026/11/09/meta-muse-ember-small-agent-model/)
- [Decrypt — Near AI Breach Exposes User Details and Data From 18 AI Agents](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents)
- [Microsoft Research — Lazare, veni foras: Reprogramming Dormant Neurons to Backdoor AI Agents](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/)
- [TechCrunch — New York's AI safety law takes effect](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/)
- [Al Jazeera — Australia tightens AI oversight rules after OpenAI government breach](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach)
- [MLex — AI shopping agents must let users control purchases under EU proposal](https://www.mlex.com/mlex/artificial-intelligence/articles/2548994)
- [Federico De Simoni — Asia's rulebook for bank agents](https://federicodesimoni.substack.com/p/asias-rulebook-for-bank-agents-has)
- [Focus Taiwan — Nearly half of recent cyberattacks on Taiwan firms AI-linked](https://focustaiwan.tw/sci-tech/202611110020)
- [Crypto Briefing — Databricks updated Genie AI agent](https://cryptobriefing.com/databricks-updated-genie-ai-agent/)
- [Microsoft Developer Blog — Do AI coding agents care about SemVer?](https://devblogs.microsoft.com/blog/do-ai-coding-agents-care-about-semver/)
- [NVIDIA Developer Blog — Agent Substrate](https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/)
- [Runway — Praxis-1 is now available](https://runway.com/news/company-news/praxis-1-is-now-available)
- [CopilotKit — Introducing A2UI 1.0](https://www.copilotkit.ai/blog/introducing-a2ui-1-0)
- [GitHub — VS Code MCP installation link RCE (CVE-2026-114171)](https://github.com/microsoft/vscode/issues/347430)
- [Notebookcheck — AI agents under pressure will reveal secret credentials](https://www.notebookcheck.net/AI-agents-under-pressure-will-even-reveal-their-secret-credentials.1447853.0.html)
- [SoftBank Group — AI infrastructure in Malaysia with Grab](https://group.softbank/en/news/press/20261109_0)
- [ThePrint — Bangladesh seeks $250 mn for Bengali AI model](https://theprint.in/world/bangladesh-seeks-250-mn-for-1st-homegrown-bengali-ai-model-south-korea-may-co-fund-the-daily-star/3096350/)
- [AGBI — Humain secures $667m to expand AI infrastructure](https://www.agbi.com/ai/2026/11/humain-secures-667m-to-expand-ai-infrastructure/)
- [Launch Base Africa — Enza Capital raises $21M for African AI](https://launchbaseafrica.com/2026/11/11/enza-capital-ai-fund/)
- [Securities.io — AWS opens Chile cloud region](https://www.securities.io/aws-opens-chile-cloud-region-with-over-4-billion-investment-plan/)
- [LangChain — How Workday built an enterprise-scale AI agent platform](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith)
- [Benzinga — OpenAI acquires Odessia](https://www.benzinga.com/markets/private-markets/26/11/63126464/openai-acquires-ai-travel-startup-odessia-bringing-founder-of-600m-sonder-business-on-board)
- [TechCrunch — Oura to acquire Counsel Health for $625M](https://techcrunch.com/2026/11/10/oura-to-acquire-ai-native-primary-care-startup-counsel-health-for-625m/)
