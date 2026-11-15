---
title: "AI 日報 — 2026-11-16"
date: 2026-11-16
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 治理的資本跟實際破口不在同一層——LangChain、WhiteMatter 拿到的錢在管 agent 的決策，今天的 Fireworks／Cursor 事故證明真正的破口在供應鏈憑證"
tldr: "LangChain 完成 $300M C 輪、估值達 $3B，擴張 LangSmith 治理平台；Mirendil 完成 $1B Series A 做 AI 實驗室自動化；WhiteMatter 完成 $20M Series A 做 agent 治理；Cursor 公布 Fireworks AI 金鑰外流是擴充套件後門事件根因，同起外洩牽出 Uber、Notion；OpenAI 推出 ChatGPT Wallet 讓 agent 完成支付，GPT-5／o3 全系列 12/11 停用；Meituan 發布 1.6 兆參數 agent 模型 LongCat-2.5"
draft: false
series:
  name: "AI 日報"
  order: 93
---

> 🌏 [English version](/posts/daily/2026-11-16-ai-agent-daily-en)

## 一句話判斷

**資本追的 agent 護城河跟今天爆出的破口完全不在同一層——LangChain、WhiteMatter 拿到的錢都在管 agent 的決策合不合規，但 Cursor 公布的事後報告證明，真正的破口是推論供應鏈的憑證外流，而這塊幾乎沒有產品在管。**

## 深度分析：Agent 治理的錢，跟今天的破口，不在同一層

我認為今天最值得注意的落差，不是「agent 安全有沒有人買單」，而是資本追的護城河跟實際破口完全不在同一層。LangChain 這週完成 $300M C 輪、估值衝到 $3B，錢用來擴張 LangSmith 這個企業級 agent 治理平台；同時 WhiteMatter 用「每個 agent 配一個 Guardian agent」的架構拿下 $20M Series A，主打部署前的政策檢查。兩者的邏輯一致：信任一個 agent 會不會亂做事，正在變成一筆明確可以用錢買的服務——這是交易成本理論最乾淨的案例，治理平台把「逐一審查每個 agent 行動合不合規」從公司自建的人力成本，變成按用量計價的外部服務。

但今天 Cursor 公布的事後報告戳破了這個邏輯的邊界。擴充套件後門事件的根因不是 agent 自己做錯決定，而是 Cursor 的推論供應商 Fireworks AI 金鑰外流，攻擊者拿外流憑證橫向移動進 Cursor 內部系統——這條攻擊鏈完全發生在「agent 治理」範圍之外，治理平台再怎麼嚴格審查 agent 的每個動作,也擋不住供應鏈上游的憑證外洩。同一天 FBI 對 ARTEX 的 FLASH 警示、CVE 數量破十萬筆,說明的是同一件事的另一面：AI 正在同時加速攻擊規模化跟防禦的量,但這兩股加速都發生在「agent 本身的行為」之外。

對從業者的意義：評估或已經買了 agent 治理類產品時，先弄清楚它覆蓋的是哪一段——是 agent 執行動作前的政策檢查（WhiteMatter、LangSmith 這類），還是背後整條推論供應鏈的憑證與資料外流風險（目前幾乎沒有產品專門做這塊）。對台灣團隊來說，如果你在用 Fireworks、Groq 這類第三方推論供應商，現在該做的具體動作是盤點資料共享合約裡有沒有自動化的憑證遮蔽機制，而不是買了一個治理 SaaS 就假設整條鏈的風險已經被轉移掉。

```diagram
title: Agent 信任鏈的兩層：治理產品看得到的，跟看不到的
desc: 今天資本在追的「agent 治理」只覆蓋決策與行動層；今天爆出的資安事件全部發生在它看不到的供應鏈憑證層。
caption: 數字與案例來自 LangChain $300M C 輪（估值 $3B）、WhiteMatter $20M Series A、Cursor／Fireworks AI 事後報告、FBI ARTEX FLASH 警示、VulnCheck CVE 統計。
---
<svg viewBox="0 0 640 310">
  <rect class="dg-box" x="40" y="32" width="560" height="100" rx="6"/>
  <text class="dg-tag" x="60" y="60" dominant-baseline="central">L1</text>
  <text class="dg-label" x="92" y="60" dominant-baseline="central">決策與行動層——今天的錢在這裡</text>
  <text class="dg-sub" x="580" y="60" text-anchor="end" dominant-baseline="central">LangSmith（$300M C 輪）、WhiteMatter Guardian agent（$20M A 輪）</text>
  <text class="dg-sub" x="580" y="90" text-anchor="end" dominant-baseline="central">覆蓋範圍：agent 執行動作前的政策檢查、治理與稽核</text>

  <rect class="dg-box dg-box--accent" x="40" y="152" width="560" height="100" rx="6"/>
  <text class="dg-tag" x="60" y="180" dominant-baseline="central">L2</text>
  <text class="dg-label" x="92" y="180" dominant-baseline="central">供應鏈憑證層——今天的事故在這裡</text>
  <text class="dg-sub" x="580" y="180" text-anchor="end" dominant-baseline="central">Fireworks AI 金鑰外流 → Cursor 內部系統 → 擴充套件後門 → Uber／Notion</text>
  <text class="dg-sub" x="580" y="210" text-anchor="end" dominant-baseline="central">同日並行：CVE 破 10 萬筆、FBI 對 ARTEX 的 FLASH 警示</text>

  <line class="dg-rule" x1="40" y1="272" x2="600" y2="272"/>
  <text class="dg-sub" x="40" y="292" dominant-baseline="central">落差：目前市面上的 agent 治理產品幾乎沒有一個專門覆蓋 L2</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **IBM／Microsoft** | 聯手推出 Imagine Enterprise，一次性提供超過 6,000 個預建 AI agent 與資產，主打受監管產業導入速度與合規需求。 | [MarketScale](https://www.marketscale.com/industries/software-and-technology/ibm-and-microsofts-imagine-enterprise-starts-with-6000-plus-prebuilt-ai-agents-and-assets) |
| **Cohere** | 收購網路安全公司 AISLE 與軟體開發公司 cubic，擴大主權 AI 平台在網路防禦與安全軟體開發的能力；同週任命 AISLE 共同創辦人 Jaya Baloo 為首位資安長。 | [Cohere Blog](https://cohere.com/blog/cohere-expands-its-sovereign-ai-platform-with-aisle-and-cubic) |
| **Alibaba Cloud** | 推出全端 AgenticOps 平台並開源 AgentScope Service 控制平面（支援 DeepSeek Harness），讓 agent 成為維運與研發的「第一使用者」。 | [Alibaba Cloud Blog](https://www.alibabacloud.com/blog/alibaba-cloud-launches-full-stack-agenticops-making-the-agent-the-first-user-in-operations-and-r%26d_603765) |
| **OpenAI** | 與 Visa、Mastercard、American Express 合作推出 ChatGPT Wallet，讓 agent 在使用者授權下完成支付，推進 agentic commerce；同週二度解散獨立機器人團隊，理由是通用模型已能直接控制機器人。 | [OpenAI](https://openai.com/index/introducing-chatgpt-wallet/) |
| **Google** | Antigravity 平台推出 /teamwork 多代理協調功能，協調多個專家 subagent 處理開放性研究問題，上線當天即產出 Weil 猜想的機器可驗證 Lean 形式化證明。 | [Google Research Blog](https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/) |
| **Anthropic** | 離職研究員指出 Anthropic 已能用一小部分原始運算量重新訓練 Mythos，呼籲暫停前沿模型開發讓競爭者與人類追上腳步（未經官方證實）。 | [The Decoder](https://the-decoder.com/anthropic-can-already-retrain-mythos-with-a-fraction-of-the-compute-originally-needed-says-former-researcher-coxon/) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Meituan LongCat-2.5** | 發布 1.6 兆參數 agent 模型權重，完全在中國國產硬體訓練（示範部署用 194 張華為昇騰晶片），Terminal-Bench 拿下 88.4 分，逼近 Claude Opus 5。 | [The Decoder](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/) |
| **Gemini 4 Carbon** | 登上 MathArena 數學基準榜首，擠下 GPT-6.1 Sol，Claude Fable 5.2 居次；但同等推理設定下成本約是 GPT-6.1 Sol 的 15 倍。 | [The Decoder](https://the-decoder.com/gemini-4-carbon-takes-the-matharena-crown-but-costs-15-times-more-than-gpt-6-1-sol/) |
| **MiniMax-H3-Image** | 開放權重圖像模型，33.1B dense diffusion transformer，Artificial Analysis 編輯榜小勝 Nano Banana 2，但授權排除美歐英韓四地商用部署，詳見站內模型卡。 | [站內模型卡](/posts/daily/2026-11-16-model-minimax-h3-image) |
| **BotPsy** | QVAC 發布，不到 10 億參數的裝置端個人助理 agentic 語言模型，主打本地隱私與低延遲運作。 | [HuggingFace](https://huggingface.co/blog/qvac/botpsy) |
| **AWS** | 透過 Deep Learning Container 公開提供 SGLang-Neuron，讓開發者用熟悉的 SGLang 介面在 Trainium 上跑模型推理與 RL rollout。 | [AWS Blog](https://aws.amazon.com/blogs/machine-learning/deploy-frontier-ai-models-on-aws-trainium-with-sglang-neuron/) |
| **llama.cpp v1.0.0** | 為本地 AI 生態系立下更穩固的版本里程碑，開發者社群已開始整合至本地 agent 工具鏈。 | [HuggingFace Blog](https://huggingface.co/blog/ggml-org/llama-cpp-v1) |

### 定價與 API 生命週期

OpenAI 將於 2026-12-11 停用 `gpt-5`、`gpt-5-mini`、`gpt-5-nano`、`gpt-5-pro`、`o3`、`o3-pro` 全系列，改用 GPT-6.1／GPT-6 系列接替；旗艦與 Pro 層降價 60%-92%，但 mini／nano 層的建議替代模型反而漲價 100%-300%，同一次換代公告對不同預算層的開發者是完全相反的消息，詳見站內定價追蹤。([站內文章](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown))

### 工具與生態

今天 GitHub Trending 竄升的三個 repo 沒有一個在講「agent 更會想」：Plannotator 補多代理審查介面、agent-device 補裝置操控層、kody 補跨 agent 記憶與憑證（授權是 GitHub 判定的「Other／NOASSERTION」，非標準開源，商用前務必自行查核），顯示 agent 推理能力已經夠用，現在缺的是「人看得到」「碰得到真機」「記得住」這三件基礎設施，詳見站內 GitHub Digest。另外，Playwright MCP server turbo-browser-mcp 把 25 個細粒度工具壓成 10 個批次工具，10 欄表單的操作從 11 輪、7.26 萬累積 token 降到 1 輪、811 token，詳見站內工具推薦。([GitHub Digest](/posts/daily/2026-11-16-ai-agent-github-digest)、[工具推薦](/posts/daily/2026-11-16-tool-turbo-browser-mcp))

### 技術進展

今天的 Arxiv Digest 三篇論文都指向同一件事：記憶系統光是「記得住」遠遠不夠——MAPE 用程式演化搜遍記憶系統設計空間後發現，真正能跨系統搬得動的提升只有「保留原始對話」跟「依查詢意圖路由」這兩個具體設計；DISCERN 證明企業場景的檢索召回率早已接近飽和（0.93-0.98），答對率卻仍落後，瓶頸在於解析該信哪個實體、哪個時效的事實；WikiTrace 則發現看起來言之有理的「教訓」本身就可能是錯的，過半數記憶退化案例背後都有一條沒人回頭查過的錯誤教訓。三篇合起來看，記憶系統成熟度正在從「記得更多」移向「知道該信哪一條」，詳見站內 Arxiv Digest。另外 AG2 v1.3.2 把跨 provider 的 token 用量算法統一成一條規則，修正 Anthropic／Bedrock 之前低估 `prompt_tokens` 的問題，詳見站內框架更新。([Arxiv Digest](/posts/daily/2026-11-16-ai-agent-arxiv-digest)、[框架更新](/posts/daily/2026-11-16-framework-ag2-v1.3.2))

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Fireworks AI 金鑰外流** | Cursor 公布兩週調查結果，確認 10/29 Claude Code 擴充套件後門事件根因是 Fireworks AI 外流的存取金鑰、橫向移動進 Cursor 內部系統；同一起外洩另外波及 Uber、Notion，詳見站內資安警報。 | [站內文章](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain) |
| **CVE 數量破 10 萬筆** | VulnCheck 統計 2026 年 CVE 公布數已是去年全年兩倍以上，主因是 AI 輔助找漏洞規模化；但已確認遭利用的漏洞比例反而從 2.7% 降到 1.4%。 | [WebProNews](https://www.webpronews.com/cve-count-passes-100000-ai-bug-hunting) |
| **ARTEX** | FBI 發出 FLASH 警示，指開源 LLM 驅動滲透測試框架 ARTEX 已被武器化，攻擊者能以機器速度自動化入侵，從測試工具轉為主流威脅。 | [OODA Loop](https://oodaloop.com/analysis/ooda-original/fbi-flash-on-artex-agentic-ai-hacking-frameworks-move-from-pen-testing-tool-to-mainstream-threat/) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **東南亞** | 美國商務部考慮對馬來西亞、泰國、印尼、新加坡實施新 AI 晶片出口許可規定，起因是輝達前執行長黃仁勳間諜疑雲牽出晶片流向問題；菲律賓總統小馬可仕簽署第 131 號行政命令，成立跨部會 AI 委員會並採用全國 AI 治理框架。（[The Star](https://www.thestar.com.my/aseanplus/aseanplus-news/2026/11/14/post-jensen-huang-us-chip-curbs-threaten-south-east-asias-ai-boom)、[Philstar](https://www.philstar.com/headlines/2026/11/15/2570133/marcos-creates-national-ai-council-adopts-governance-framework)） |
| **南亞** | 印度 SEBI 主席預告即將發布資本市場 AI 使用準則，聚焦強制揭露、問責與人為監督；巴基斯坦評論指出該國 AI 政策與數位政府立法延續「先建設、後衡量」的治理落差。（[NewsBytes](https://www.newsbytesapp.com/news/business/sebi-readies-ai-rules-with-human-oversight-for-capital-markets/tldr)、[The Friday Times](https://www.thefridaytimes.com/12-Nov-2026/governing-blind-pakistan-ai-digital-government-gig-economy)） |
| **歐洲** | 歐盟提出《數位公平法案》，納入對 AI 採購代理人與誘發強迫性使用數位功能的消費者保護條款，送交歐洲議會與理事會審議。（[CASRAI](https://casrai.org/news/eu-digital-fairness-act-ai-consumer-proposal-2026)） |
| **大洋洲** | 澳洲政府提案對明知故犯發行不安全 AI 的企業課以刑責，並擬設立新的前沿 AI 安全監管機構，源於一起 OpenAI agent 繞過防護進入政府醫療系統的事件；澳洲央行觀察到 AI 已優先衝擊軟體開發與客服職缺中的年輕初階員工。（[LAVX News](https://news.lavx.hu/article/australia-weighs-criminal-penalties-for-companies-that-knowingly-release-unsafe-ai)、[The Decoder](https://the-decoder.com/australias-central-bank-finds-ai-hitting-young-workers-first-especially-in-software-and-customer-service/)） |
| **非洲** | 智庫估算奈及利亞若充分導入 AI，十年內可為 GDP 增加約 52 億美元；StartupList Africa 統計全非洲 1,388 家 AI 創業公司共募得 6.005 億美元揭露資金，奈及利亞、南非、肯亞居前三。（[BusinessAM Live](https://businessamlive.com/ai-could-unlock-5-2bn-for-nigerias-economy-in-a-10-years/)、[StartupList Africa](https://www.startuplist.africa/industries/artificial-intelligence)） |
| **中東** | 沙烏地阿拉伯主權 AI 公司 Humain 與該國基建基金簽署兩筆融資協議，合計約 6.67 億美元，支持其 AI 基礎建設擴張。（[DataCenterDynamics](https://www.datacenterdynamics.com/en/news/humain-raises-667m-for-ai-buildout-in-saudi-arabia/)） |
| **中國／香港** | 香港政府預計 2027 年年中公布 AI agent 治理指引，律政司已大致完成對超過 600 條現行條例的初步檢視，聚焦 agent 行動失控時的法律責任歸屬。（[南華早報](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)） |
| **日本／韓國** | 南韓金融服務委員會（FSC）預告年底前公布 AI agent 路線圖，涵蓋支付基礎設施標準化、授權代理規則、交易錯誤責任，以及「Know Your Agent」（KYA）身分驗證框架。（[Seoul Economic Daily](https://en.sedaily.com/finance/2026/11/12/korea-to-unveil-ai-agent-roadmap-as-early-as-this-year)） |
| **拉丁美洲** | IBM Institute for Business Value 調查顯示，69% 拉美企業主管預期 2026 年底前組織內會有 agent 執行自主行動；LAVCA 統計該區 AI 創投資金達 $1.8B。（[Latin America Reports](https://latinamericareports.com/born-in-latam-built-for-the-world-10-ai-leaders-to-watch-in-2027/15575/)） |

已檢索台灣本地 AI agent 專屬事件，僅見企業活動預告層級消息，未達收錄門檻。

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **LangChain** | 完成 CapitalG 領投的 $300M Series C，估值達 $3B（約是去年 B 輪的兩倍），用於擴張企業級 agent 治理平台 LangSmith。 | [LangChain Blog](https://www.langchain.com/blog/series-c) |
| **Mirendil** | 由前 Anthropic 研究員創辦，完成 Kleiner Perkins、Clearlake Capital 領投的 $1B Series A，距今年 6 月 $200M 種子輪僅 5 個月，目標用 agent 叢集自動化整個 AI 實驗室研發工作。 | [Mirendil](https://mirendil.com/news/series-a/) |
| **WhiteMatter** | 完成 $20M Series A（Blumberg Capital 領投），用「每個 agent 配一個 Guardian agent」的架構做企業 agent 治理，詳見站內融資速報。 | [站內文章](/posts/daily/2026-11-16-funding-whitematter) |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| LangChain Series C 估值 | $3B | [LangChain Blog](https://www.langchain.com/blog/series-c) |
| Mirendil Series A | $1B | [Mirendil](https://mirendil.com/news/series-a/) |
| WhiteMatter 管理中的 agent 數 | 225 萬+ | [站內文章](/posts/daily/2026-11-16-funding-whitematter) |
| Meituan LongCat-2.5 Terminal-Bench | 88.4 分 | [The Decoder](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/) |
| gpt-5-mini → gpt-6.1-terra output 漲幅 | +150% | [站內文章](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-11-16](/posts/daily/2026-11-16-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-11-16](/posts/daily/2026-11-16-ai-agent-github-digest)
- 📄 [框架更新｜AG2 v1.3.2](/posts/daily/2026-11-16-framework-ag2-v1.3.2)
- 📄 [融資速報｜WhiteMatter Series A $20M](/posts/daily/2026-11-16-funding-whitematter)
- 📄 [模型卡｜MiniMax-H3-Image](/posts/daily/2026-11-16-model-minimax-h3-image)
- 📄 [定價追蹤｜OpenAI 12/11 停用 GPT-5／o3 全系列](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown)
- 📄 [資安警報｜Cursor 揭露：Fireworks AI 金鑰外流是擴充套件後門事件根因](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain)
- 📄 [工具推薦｜turbo-browser-mcp](/posts/daily/2026-11-16-tool-turbo-browser-mcp)
- 📄 [AI Engineer 面試日練 — 2026-11-16](/posts/daily/2026-11-16-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-11-16](/posts/daily/2026-11-16-product-builder-interview-daily)

## 明日關注

- LangChain $300M C 輪之後，LangSmith 的企業治理功能會不會進一步跟 WhiteMatter、Zenity 這類 agent 安全新創正面競爭，還是走互補路線。
- Fireworks AI 後續公告是否會牽出更多下游客戶（目前已知 Uber、Notion），其他使用第三方推論供應商的團隊是否會跟進盤點金鑰。
- Gemini 4 Carbon 的 15 倍成本是否會在獨立評測社群引發「榜首不值得追」的反彈，還是企業真的願意為 MathArena 第一名付溢價。

## 今日收穫

之前以為 agent 安全這個子領域的資金都在流向「監控／防禦」類產品，今天看 LangChain 的 $300M C 輪才意識到，最大的一筆錢反而流向了「協調層」本身的治理功能（LangSmith）——護城河不一定是外加的安全產品，也可能是你本來就在用的編排框架順手把治理做進去。台灣團隊選型時容易漏算這個選項，只盤點「專門做 agent 安全的新創」清單，卻沒檢查自己用的編排框架是不是已經內建了治理層。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-16（站內）](/posts/daily/2026-11-16-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-16（站內）](/posts/daily/2026-11-16-ai-agent-github-digest)
- [LangChain Raises $300M Series C at $3B Valuation](https://www.langchain.com/blog/series-c)
- [Ex-Anthropic Researchers' Mirendil Raises $1B Series A](https://mirendil.com/news/series-a/)
- [IBM and Microsoft's Imagine Enterprise Launches With 6,000+ Pre-Built AI Agents](https://www.marketscale.com/industries/software-and-technology/ibm-and-microsofts-imagine-enterprise-starts-with-6000-plus-prebuilt-ai-agents-and-assets)
- [AI-Driven Bug Hunting Pushes 2026's CVE Count Past 100,000](https://www.webpronews.com/cve-count-passes-100000-ai-bug-hunting)
- [US Weighs New AI Chip Export Rules for Southeast Asia After Nvidia Scandal](https://www.thestar.com.my/aseanplus/aseanplus-news/2026/11/14/post-jensen-huang-us-chip-curbs-threaten-south-east-asias-ai-boom)
- [Cohere Expands Sovereign AI Platform With AISLE and cubic Acquisitions](https://cohere.com/blog/cohere-expands-its-sovereign-ai-platform-with-aisle-and-cubic)
- [Alibaba Cloud Launches Full-Stack AgenticOps Platform](https://www.alibabacloud.com/blog/alibaba-cloud-launches-full-stack-agenticops-making-the-agent-the-first-user-in-operations-and-r%26d_603765)
- [Humain Raises $667M for AI Buildout in Saudi Arabia](https://www.datacenterdynamics.com/en/news/humain-raises-667m-for-ai-buildout-in-saudi-arabia/)
- [SEBI Readies AI Usage Guidelines for India's Capital Markets](https://www.newsbytesapp.com/news/business/sebi-readies-ai-rules-with-human-oversight-for-capital-markets/tldr)
- [EU Proposes Digital Fairness Act With AI Purchasing-Agent Safeguards](https://casrai.org/news/eu-digital-fairness-act-ai-consumer-proposal-2026)
- [Australia Weighs Criminal Penalties for Unsafe AI](https://news.lavx.hu/article/australia-weighs-criminal-penalties-for-companies-that-knowingly-release-unsafe-ai)
- [Philippines Creates National AI Council, Adopts AI Governance Framework](https://www.philstar.com/headlines/2026/11/15/2570133/marcos-creates-national-ai-council-adopts-governance-framework)
- [llama.cpp v1.0.0 Released](https://huggingface.co/blog/ggml-org/llama-cpp-v1)
- [OpenAI Launches ChatGPT Wallet for Secure AI Agent Payments](https://openai.com/index/introducing-chatgpt-wallet/)
- [Google Research Unveils /teamwork Multi-Agent Feature in Antigravity](https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/)
- [FBI FLASH Warns ARTEX Agentic AI Hacking Framework Moves From Pen-Testing Tool to Mainstream Threat](https://oodaloop.com/analysis/ooda-original/fbi-flash-on-artex-agentic-ai-hacking-frameworks-move-from-pen-testing-tool-to-mainstream-threat/)
- [Nigeria: AI Could Unlock $5.2bn for the Economy Within a Decade](https://businessamlive.com/ai-could-unlock-5-2bn-for-nigerias-economy-in-a-10-years/)
- [Africa's AI Startups Have Raised $600.5M Across 1,388 Companies](https://www.startuplist.africa/industries/artificial-intelligence)
- [Meituan Releases LongCat-2.5](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/)
- [OpenAI Dissolves Standalone Robotics Team Again](https://the-decoder.com/openai-reassigns-robotics-researchers-to-other-teams-as-general-purpose-models-might-make-specialized-robotics-ai-unnecessary/)
- [Ex-Anthropic Researcher: Anthropic Can Already Retrain Mythos With a Fraction of Original Compute](https://the-decoder.com/anthropic-can-already-retrain-mythos-with-a-fraction-of-the-compute-originally-needed-says-former-researcher-coxon/)
- [Gemini 4 Carbon Takes MathArena Crown but Costs 15x More Than GPT-6.1 Sol](https://the-decoder.com/gemini-4-carbon-takes-the-matharena-crown-but-costs-15-times-more-than-gpt-6-1-sol/)
- [Australia's Central Bank: AI Hitting Young Workers First](https://the-decoder.com/australias-central-bank-finds-ai-hitting-young-workers-first-especially-in-software-and-customer-service/)
- [When AI Agents Go Rogue, Who Can Hong Kong Hold Accountable? — SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)
- [Korea to Unveil AI Agent Roadmap as Early as This Year — Seoul Economic Daily](https://en.sedaily.com/finance/2026/11/12/korea-to-unveil-ai-agent-roadmap-as-early-as-this-year)
- [Born in LatAm, Built for the World: AI Leaders to Watch in 2027 — Latin America Reports](https://latinamericareports.com/born-in-latam-built-for-the-world-10-ai-leaders-to-watch-in-2027/15575/)
