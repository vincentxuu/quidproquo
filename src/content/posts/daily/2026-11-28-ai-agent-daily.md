---
title: "AI 日報 — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "身分與人工核准正在從『最佳實務建議』變成多國監管機關與資安廠商同步在補的治理基礎設施——瑞士官方證實國家級 agentic 攻擊的同一週，Kenya、美國銀行監管機關都在要求 agent 要有獨立身分"
tldr: "瑞士 NCSC 證實國家級 agentic 攻擊、5 起中 4 起得手，同一週 Kenya、美國銀行監管機關要求 agent 要有獨立身分與人工核准；Cognition SWE-2.1 把 Terminal-Bench 從 24.2 推到 50.0；Claude Opus 4.5 明年 1/22 退役，Opus 5.5 降價 20% 但新 tokenizer 可能讓部分帳單不降反升；GigaChat 4 以 MIT 授權開源 708B 旗艦模型；UAE 啟動國家級 Agentic AI 生態系 FedAI"
draft: false
series:
  name: "AI 日報"
  order: 105
---

## 一句話判斷

**身分與人工核准正在從「最佳實務建議」變成多國監管機關與資安廠商同步在補的治理基礎設施——瑞士官方證實國家級 agentic 攻擊的同一週，Kenya、美國銀行監管機關都在要求 agent 要有獨立身分，產品端也同時冒出對應的身分控制平面。**

## 深度分析：Agent 身分與核准層正在變成規模化部署的必要互補資產

我認為今天最值得串起來看的不是哪個模型又刷新了榜，而是「誰能代表 agent 行動、誰能核准它做什麼」這件事，正快速從設計細節升級成獨立的治理基礎設施。（框架：互補資產）

證據 A：瑞士 NCSC 本週證實首批「Agentic Offensive Framework」攻擊，5 起中 4 起入侵成功、2 起鎖定關鍵基礎設施得手；義大利、英國官方同週發出近乎相同結論的警告。攻擊鏈不新（弱密碼、已知漏洞、暴露系統），AI 只是改變了速度——「人力攻擊節奏」這個防禦假設正在失效。

證據 B：監管與產品端幾乎同步收斂到同一處方。Kenya 要求能自主付款的 agent 先經人工核准並留紀錄；美國銀行監管機關建議每個 agent 要有獨立非人類身分與短期憑證。HYPR AgentPass 為 agent 發身分、NVIDIA SkillSpector 掃 agent skill 供應鏈風險、Mastra 幫環境變數加密，都在補同一塊缺口。Sokin 刻意讓 AI 財務連結器維持唯讀，是企業端最誠實的鏡像：能力早就夠了，缺的是信任的基礎設施。

對從業者的意義：Cognition SWE-2.1、GPT-6 Astra 這類頭條亮眼，但 agent 若會轉帳、改設定、碰內部系統，該補的不是更強的模型，而是獨立身分、限縮權限與人工核准節點。台灣企業同樣適用：導入前先把身分與核准層列進採購清單，不要等出事才補。

```diagram
title: 今天三股訊號收斂到同一個治理層
desc: 由下往上依序是瑞士官方證實的攻防現場、HYPR／NVIDIA／Mastra 的產品補位，與 Kenya／美國銀行監管機關要求的治理基礎設施層；三層分別對應今天的資安、工具與法規信號。
caption: 示意：三個獨立事件分別對應治理基礎設施化的三個層級，不是技術依賴關係，只是編輯上把今天的身分／核准訊號拆成由現場到規範的三層。
---
<svg viewBox="0 0 640 248">
  <path class="dg-axis" d="M36 220V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">抽象</text>
  <text class="dg-tag" x="36" y="232" text-anchor="middle" dominant-baseline="central">具體</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="60" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="42" dominant-baseline="central">治理基礎設施層</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">Kenya、美國銀行監管機關：agent 要有獨立身分</text>
  <text class="dg-sub" x="124" y="84" dominant-baseline="central">與人工核准，並留存紀錄</text>

  <rect class="dg-box" x="72" y="104" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="132" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="120" dominant-baseline="central">產品補位層</text>
  <text class="dg-sub" x="124" y="144" dominant-baseline="central">HYPR AgentPass、NVIDIA SkillSpector、Mastra 加密機密</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="184" dominant-baseline="central">攻防現場</text>
  <text class="dg-sub" x="124" y="208" dominant-baseline="central">瑞士 NCSC：5 起 agentic 攻擊、4 起得手、2 起鎖定關鍵基礎設施</text>
</svg>
```

## 今日動態

### 廠商動態

- **[阿里雲](https://www.alibabacloud.com/blog/alibabas-full-stack-ai-drives-continued-cloud-growth-acceleration-as-adoption-deepens_603826)**（Alibaba Cloud Blog）：公布全棧 AI 策略帶動雲端營收加速成長與獲利能力提升，官方歸因於企業客戶對 AI 全棧方案的採用程度持續加深。
- **[SAP](https://news.sap.com/2026/11/build-first-agentic-use-case-new-whitepaper-road-map-enterprise-ai/)**（SAP News）：發布白皮書，強調企業 agentic AI 成功關鍵在於可信資料、商業情境、人為責任歸屬與對自主程度的紀律管理。

### 模型與基礎設施

- **[GigaChat 4（708B-A41B）](/posts/daily/2026-11-28-model-sber-gigachat-4-708b)**（Sber）：MIT 授權全開源旗艦模型，1M context、同一 checkpoint 切 instant/reasoning，BFCL v4 工具呼叫 79.55 分是對照表最高，但長程軟體工程 DeepSWE 僅 35.40%，明顯落後 DeepSeek 4.1。完整評測見站內模型卡。
- **[Yandex AliceAI-Foundation 80B](https://aiweekly.co/alerts/yandex-open-sources-aliceai-foundation-80b-moe-trained-on-175t-tokens-under)**（aiweekly.co）：以 Apache 2.0 開源 80B／3B 活躍參數 MoE，技術報告新增兩個俄語 benchmark 評測事實檢索與多跳問答。
- **[KRAFTON Raon-1 Mini 28.8B](https://aiweekly.co/alerts/krafton-releases-raon-1-mini-a-288b43b-active-moe-hitting-967-on-aime-2026)**（aiweekly.co）：南韓遊戲公司以 Apache 2.0 開源，AIME 2026 達 96.7，20GB VRAM 可跑 256K context。
- **[OpenAI GPT-6 Astra 登頂 DeepSWE](https://benchleader.com/benchmarks/deepswe)**（BenchLeader）：DeepSWE v1.1 拿下 74.1%，領先 Gemini 3.8 Flash 的 73.8%，69 組設定中僅此兩者過 73%。
- **[Google DeepMind「Humanity's First Exam」](https://gcn.com/google-deepmind-launches-humanity-first-exam/23561)**（GCN）：要求同題四種變體都答對才算過關，18 個前沿模型評測中前五名 pass@1 達 96-98%，但 family pass⁴ 平均只有 85.6%。
  - **為什麼重要**：單題正確率高不代表模型穩定，一致性落差本身就是今天 Opus 5.5 定價、GigaChat 長程任務落後這類「宣傳數字不代表所有情境都強」訊號的另一個版本。
- **[Sakana AI Namazu Small 30B](https://ncijnetwork.com/sakana-ai-releases-namazu-small-a-30b-model-built-on-nemotron-3-nano)**（ncijnetwork.com）：基於 NVIDIA Nemotron 3 Nano 打造，BrowseComp 拿下 73.5 分，大幅領先同量級對手。

### 定價與 API 生命週期

- **[Claude Opus 4.5 退役，Opus 5.5 定價](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement)**（Anthropic）：Opus 4.5 於 2027-01-22 退役，Opus 5.5 牌價降 20%、快取讀取降 60%，但新 tokenizer 讓未快取工作負載的 token 數最多多 35%，剛好跨過 20% 降價的損益平衡點（1.25x），部分使用者帳單可能不降反升。完整試算見站內定價追蹤。

### Coding Agent 賽道

- **[Cognition SWE-2.1](https://thenewstack.io/cognition-swe21-coding-model)**（The New Stack）：以純強化學習在 Kimi K3 上訓練，Terminal-Bench 4.1 從 24.2 分跳到 50.0 分，同步推出跑在 Cerebras 上的 Ultrafast 版與資安導向的 Cyber 版。
  - **為什麼重要**：在通用模型打榜的同時，窄域 coding 模型靠純 RL 持續拉開差距，說明「專用模型」在 coding agent 賽道仍有獨立的進步空間，不會被通用模型吃掉。

### 工具與生態

- **[Claude-BugHunter](/posts/daily/2026-11-28-ai-agent-github-digest)**（GitHub Trending）：把 681 筆 HackerOne 公開漏洞報告拆成 85 個技能，單日 +1,597 星全站第一；同日 obra/superpowers 的跨工具開發方法論 +854 星。完整亮點見站內 GitHub Digest。
- **[NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector)**（GitHub）：開源掃描工具，檢測 AI agent skill 裡的 prompt injection、資料外洩與供應鏈風險。
  - **為什麼重要**：跟 Claude-BugHunter 的技能包方向正好相反也互補——skill 生態一邊在長，一邊也開始需要專門掃描 skill 本身的供應鏈風險，呼應今天身分與治理層補洞的主軸。
- **[HYPR AgentPass](https://www.cybersecurity-insiders.com/hypr-introduces-agentpass-to-bring-identity-security-and-human-oversight-to-ai-agents/)**（Cybersecurity Insiders）：為每個 AI agent 發放獨立憑證並綁定指定人類監督者，提供身分優先的控制平面。
- **[Mastra Encrypted Secrets](https://mastra.ai/blog/announcing-encrypted-secrets)**（Mastra Blog）：Agent 框架新增加密機密管理，環境變數只在伺服器啟動時解密，降低憑證外洩風險。
- **[INE MCP](/posts/daily/2026-11-28-tool-ine-mcp)**（西班牙國家統計局）：官方自己發布的 MCP server，伺服器端強制五步查詢順序擋住亂猜統計代碼。完整介紹見站內工具推薦。
- **[StackAI Auto Agents](https://ycombinator.com/launches/P7T-stackai-embedded-ai-agents)**（YC Launches）與 **[Epsilla](https://ycombinator.com/launches/Ls3-epsilla-ship-production-ready-ai-agents-on-day-1)**（YC Launches）：兩款企業 agent 建置平台同日上架，分別主打自然語言自動產生多步驟 agent、以及私有知識庫整合。
- **[Hugging Face：Swarms, Flocks, Gangs](https://huggingface.co/blog/rl-multi-agents)**（Hugging Face Blog）：系統整理多 agent 系統的建置、訓練與評估方法，屬開發者社群常見的技術資源文。

### 技術進展

今天的 Arxiv Digest 把「Agent 記憶管理」拆成三個常被混為一談的獨立問題：TASK Memory 指出就算檢索到了正確記憶，模型自己的舊知識仍可能蓋過它；MGMem 用確定性解析器取代生成式索引，反而在對話記憶測試上贏過三個生成式記憶系統；Contexture 則把問題拉到 GPU 伺服層，發現清掉已被取代的執行歷史能提升 20-73% 吞吐量，但現場實驗顯示最差情況下任務準確率會掉 3.7 個百分點。三篇證據都紮實，但也都誠實揭露了自己的邊界，完整導讀見 [AI Agent Arxiv Digest](/posts/daily/2026-11-28-ai-agent-arxiv-digest)。

- **[Pydantic AI v2.76.0](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0)**（Pydantic AI）：Realtime session 新增 `UpdateTools`，讓語音／即時 agent 不斷線就能解鎖或收回工具；同時補上跨 sub-agent 的成本歸戶，`FileSystem.read_file` 的 offset 改為從 1 起算是最容易漏看的 breaking change。完整遷移指南見站內框架更新。

### 商業案例 / 融資 / 併購

- **[nextesy Seed $10.4M](/posts/daily/2026-11-28-funding-nextesy)**（Swisscom Ventures 領投）：瑞士記帳自動化新創距上輪 pre-seed 僅 21 個月、估值躍升 3.4 倍，用「誠實標出自動化邊界、agent 逐步接手」的敘事對照 bexio。完整分析見站內融資速報。
- **[Blackletter Seed $600 萬](https://dealroom.co/news/176745-ex-cohere-founders-ai-law-firm-blackletter-raises-6m-seed)**（Dealroom）：前 Cohere 共同創辦人成立的 AI 法律事務所，由 Lerer Hippeau 領投，主打 AI 搭配真人律師處理跨境法務。
- **[XEBO.ai A 輪 $1050 萬](https://peepalsglobal.com/global/article/xebo-ai-10-5-million-series-a-emirates-growth-fund-2026-11-27)**（Emirates Growth Fund）：杜拜客戶體驗分析公司完成首輪機構融資，擴充通話分析與 agentic AI 功能並進軍美國市場。
- **[Kaszek Ventures 第七期基金 $6.5 億](https://latinfinance.com/daily-brief/2026/11/26/kaszek-raises-funds-for-early-stage-start-ups)**（LatinFinance）：拉丁美洲早期創投史上最大單期募資，聚焦 AI 相關投資。
- **[Everful A 輪 $4850 萬](https://theaiinsider.tech/2026/11/27/everful-secures-48-5m-series-a-to-scale-ai-powered-factory-direct-sourcing/)**（The AI Insider）：AI 驅動的工廠直採平台，資金將用於擴展美國與歐洲市場。
- **[南非 570 萬美元 AI 新創基金提案](https://africa.businessinsider.com/local/lifestyle/south-africa-set-to-join-ai-race-against-us-and-china-with-dollar57-million-fund/h7j2805)**（Business Insider Africa）：總統 Ramaphosa 訪矽谷後提議設立公私合資基金，協助本地 AI 新創取得運算基礎設施，時程尚未確定。

### 資安事件

- **[瑞士 NCSC 證實國家級 agentic 攻擊](/posts/daily/2026-11-28-security-switzerland-critical-infrastructure-agentic-attack)**（瑞士 NCSC）：境內首批「Agentic Offensive Framework」攻擊，5 起確認案例 4 起得手，3 起目標關鍵基礎設施、2 起成功；義大利、英國官方同週發出相同結論警告。完整攻擊面分析見站內資安警報。
- **[modelcontextprotocol/servers v2.6.0](/posts/daily/2026-11-28-ai-agent-github-digest)**（官方 MCP reference server）：一次修掉 8 個安全漏洞，集中在 `mcp-server-git` 的 Git LFS 任意執行、憑證洩漏等問題，正在跑官方 reference server 的人應立即升級。
- **[DB-GPT CVE-2026-137681](https://www.cve.org/CVERecord?id=CVE-2026-137681)**（CVE.org）：開源 agent 框架 DB-GPT（0.8.2 及之前）的 `_react_agent_stream_impl` 函式被發現高風險漏洞。

### 法規與治理

- **[Kenya ODPC 新版 AI 指引](https://ppc.land/kenyas-privacy-regulator-says-ai-agents-need-human-approval-before-paying)**（ppc.land）：新增專章規範能自主付款、轉帳或停用帳戶的 AI agent，要求留存書面人工核准紀錄。
- **[美國銀行業監管機關建議](https://www.artificialintelligence-news.com/news/us-banks-ai-agent-security-controls/)**（AI News）：建議銀行為每個 agent 指派獨立非人類身分、限制權限並發放短期憑證，以強化可追蹤性。
- **[Sokin 的 AI 財務連結器刻意維持唯讀](https://asianbankingandfinance.net/videos/sokin-retains-human-approval-ai-assisted-payments)**（Asian Banking & Finance）：跨境支付公司的 AI 連結器只做分析，所有動用資金的操作都需人工核准,反映企業端對 agent 自主付款的審慎態度。
- **[澳洲 ACCC 黑五警告](https://ppc.land/businesses-stay-liable-for-what-their-ai-agents-tell-shoppers-accc-says)**（ppc.land）：點名 Meta Muse、OpenAI ChatGPT dots、Google Tasks 三款購物 agent，重申企業對 agent 的錯誤回答仍須負責。
- **[歐盟延後 AI Act 高風險系統部分義務](https://2eu.brussels/en/news/ai-omnibus-rapporteurs-say-delaying-some-ai-act-obligations-prevents-regulatory-mess-for-companies)**（2eu.brussels）：義務延後至 2027/2028 上路是為避免標準未就位前造成企業合規混亂，法案本身已正式生效。
- **[Bloomberg 追查 NVIDIA 晶片流入上海遭制裁數據中心](https://the-decoder.com/us-spies-tracked-nvidia-scandal-figures-ties-to-chinese-intelligence-for-over-a-year/)**（the-decoder.com）：兩家上海公司以 NVIDIA GB300、GB200 伺服器機架作貸款抵押，供應鏈可追溯至美國貿易黑名單公司，涉及違規出口管制晶片。

### 全球區域動態

中國／香港、日韓、歐洲、大洋洲的當日動態已分別併入上方法規／模型/資安段，不重複列出；以下是其他地區沒有更適合段落可放的區域新聞。

- **[中東：UAE 啟動國家級 Agentic AI 生態系 FedAI](https://thenationalnews.com/news/uae/2026/11/27/sheikh-hamdan-oversees-expansion-of-government-ai-ecosystem-as-17-partners-join)**（The National）：內閣核准全球首個國家級 Agentic AI 策略，首批納入 G42、Microsoft、AWS、Google Cloud、IBM、Oracle、Cohere 等 17 家夥伴，目標兩年內把 50% 政府作業轉為 agent 執行。
- **[非洲：三家奈及利亞新創入選 Google 首屆非洲應用 AI 實驗室](https://vanguardngr.com/2026/11/three-nigerian-startups-make-first-africa-applied-ai-lab-cohort)**（Vanguard）：首屆 10 家入選新創中 3 家來自奈及利亞，將與 Google 工程師合作並優先取得 Gemini、Gemma 存取，12 月於阿克拉辦 Demo Day。
- **[台灣：主權 AI 策略聚焦小型本地化模型](https://www.computerweekly.com/news/366655559/Inside-Taiwans-sovereign-AI-strategy)**（ComputerWeekly）：報導分析台灣方向是打造反映在地語言、價值與法規的小型專用模型，而非直接比照國際大型通用模型。
- **[東南亞／南亞：五分之四開發者已受企業 AI 使用規範約束](https://www.bignewsnetwork.com/news/279464682/four-in-five-developers-in-southeast-asia-and-india-now-work-under-ai-usage-limits-agoda-report-finds)**（Big News Network）：Agoda 調查顯示，東南亞與印度逾 800 名開發者與工程主管中有五分之四表示企業已設下 AI 使用規範，一年前多數人仍是自訂規則。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| 瑞士 NCSC 確認 agentic 攻擊 | 5 起中 4 起得手 | [瑞士 NCSC](https://www.bacs.admin.ch/en/26-ki-agenten-1-en) |
| Cognition SWE-2.1 Terminal-Bench 4.1 | 24.2 → 50.0 | [The New Stack](https://thenewstack.io/cognition-swe21-coding-model) |
| GigaChat 4 SWE-bench Verified | 80.89%（前代 64.70%） | [站內模型卡](/posts/daily/2026-11-28-model-sber-gigachat-4-708b) |
| Opus 5.5 Input 定價 | $4.00/1M tokens（↓20%） | [站內定價追蹤](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement) |
| nextesy Seed 輪金額 | $10.4M（21 個月內估值躍升 3.4 倍） | [站內融資速報](/posts/daily/2026-11-28-funding-nextesy) |

## 今日 Digest 一覽

- [AI Agent Arxiv Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-github-digest)
- [AI Engineer 面試日練 — 2026-11-28：Paper Reading](/posts/daily/2026-11-28-ai-interview-daily)
- [Product Builder 面試日練 — 2026-11-28：Technical PM](/posts/daily/2026-11-28-product-builder-interview-daily)
- [框架更新｜Pydantic AI v2.76.0](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0)
- [融資速報｜nextesy Seed $10.4M](/posts/daily/2026-11-28-funding-nextesy)
- [模型卡｜GigaChat 4（708B-A41B）](/posts/daily/2026-11-28-model-sber-gigachat-4-708b)
- [定價追蹤｜Claude Opus 4.5 退役](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement)
- [資安警報｜瑞士關鍵基礎設施 agentic 攻擊](/posts/daily/2026-11-28-security-switzerland-critical-infrastructure-agentic-attack)
- [工具推薦｜INE MCP](/posts/daily/2026-11-28-tool-ine-mcp)

## 明日關注

- Kenya、美國銀行監管機關的 agent 身分建議，會不會被其他國家的金融監管機關引用為範本？
- HYPR AgentPass、NVIDIA SkillSpector 這類身分與 skill 掃描工具，會不會在接下來幾週看到第一批企業採用案例？
- Cognition SWE-2.1 Ultrafast（Cerebras）版的實測延遲數字公開後，會不會帶動其他窄域 coding 模型跟進推專用推理硬體版本？

## 今日收穫

之前以為攻下關鍵基礎設施需要高超的 zero-day，看完瑞士 NCSC 的描述才發現，agentic 攻擊用的全是老問題——弱密碼、已知漏洞、暴露在網路上的系統，AI 改變的只是尋找與利用這些漏洞的速度。這代表防禦的優先順序應該倒過來看：先把縮小暴露面、24 小時內修補、強制 MFA 這些基本功做好，再談要不要買「AI 專屬」的防禦產品——多數組織離「輸給厲害的 AI」還很遠，先輸給的是「沒做好的基本功」。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-github-digest)
- [UAE 國家級 Agentic AI 生態系 FedAI 上線](https://thenationalnews.com/news/uae/2026/11/27/sheikh-hamdan-oversees-expansion-of-government-ai-ecosystem-as-17-partners-join)
- [Kenya 個資會新版 AI 指引](https://ppc.land/kenyas-privacy-regulator-says-ai-agents-need-human-approval-before-paying)
- [澳洲 ACCC 黑五警告](https://ppc.land/businesses-stay-liable-for-what-their-ai-agents-tell-shoppers-accc-says)
- [歐盟延後 AI Act 高風險系統部分義務](https://2eu.brussels/en/news/ai-omnibus-rapporteurs-say-delaying-some-ai-act-obligations-prevents-regulatory-mess-for-companies)
- [Sber GigaChat 4 官方公告](https://giga.chat/blog/en/posts/gigachat-4)
- [Yandex 開源 AliceAI-Foundation 80B](https://aiweekly.co/alerts/yandex-open-sources-aliceai-foundation-80b-moe-trained-on-175t-tokens-under)
- [Cognition SWE-2.1 — The New Stack](https://thenewstack.io/cognition-swe21-coding-model)
- [OpenAI GPT-6 Astra 登頂 DeepSWE — BenchLeader](https://benchleader.com/benchmarks/deepswe)
- [Google DeepMind Humanity's First Exam — GCN](https://gcn.com/google-deepmind-launches-humanity-first-exam/23561)
- [Sakana AI Namazu Small 30B](https://ncijnetwork.com/sakana-ai-releases-namazu-small-a-30b-model-built-on-nemotron-3-nano)
- [KRAFTON Raon-1 Mini](https://aiweekly.co/alerts/krafton-releases-raon-1-mini-a-288b43b-active-moe-hitting-967-on-aime-2026)
- [Blackletter Seed $600 萬 — Dealroom](https://dealroom.co/news/176745-ex-cohere-founders-ai-law-firm-blackletter-raises-6m-seed)
- [XEBO.ai A 輪 $1050 萬](https://peepalsglobal.com/global/article/xebo-ai-10-5-million-series-a-emirates-growth-fund-2026-11-27)
- [NVIDIA SkillSpector — GitHub](https://github.com/NVIDIA/SkillSpector)
- [DB-GPT CVE-2026-137681](https://www.cve.org/CVERecord?id=CVE-2026-137681)
- [南非 570 萬美元 AI 新創基金提案](https://africa.businessinsider.com/local/lifestyle/south-africa-set-to-join-ai-race-against-us-and-china-with-dollar57-million-fund/h7j2805)
- [三家奈及利亞新創入選 Google 非洲應用 AI 實驗室](https://vanguardngr.com/2026/11/three-nigerian-startups-make-first-africa-applied-ai-lab-cohort)
- [拉美創投 Kaszek 募得 6.5 億美元新基金](https://latinfinance.com/daily-brief/2026/11/26/kaszek-raises-funds-for-early-stage-start-ups)
- [阿里雲全棧 AI 驅動雲端營收加速成長](https://www.alibabacloud.com/blog/alibabas-full-stack-ai-drives-continued-cloud-growth-acceleration-as-adoption-deepens_603826)
- [SAP 企業 Agentic 用例路線圖白皮書](https://news.sap.com/2026/11/build-first-agentic-use-case-new-whitepaper-road-map-enterprise-ai/)
- [HYPR AgentPass](https://www.cybersecurity-insiders.com/hypr-introduces-agentpass-to-bring-identity-security-and-human-oversight-to-ai-agents/)
- [Mastra Encrypted Secrets](https://mastra.ai/blog/announcing-encrypted-secrets)
- [美國銀行業監管機關 AI agent 身分建議](https://www.artificialintelligence-news.com/news/us-banks-ai-agent-security-controls/)
- [Sokin AI 財務連結器維持唯讀](https://asianbankingandfinance.net/videos/sokin-retains-human-approval-ai-assisted-payments)
- [Everful A 輪 $4850 萬](https://theaiinsider.tech/2026/11/27/everful-secures-48-5m-series-a-to-scale-ai-powered-factory-direct-sourcing/)
- [台灣主權 AI 策略 — ComputerWeekly](https://www.computerweekly.com/news/366655559/Inside-Taiwans-sovereign-AI-strategy)
- [東南亞與印度開發者 AI 使用規範調查 — Big News Network](https://www.bignewsnetwork.com/news/279464682/four-in-five-developers-in-southeast-asia-and-india-now-work-under-ai-usage-limits-agoda-report-finds)
- [Bloomberg：NVIDIA 晶片流入上海遭制裁數據中心](https://the-decoder.com/us-spies-tracked-nvidia-scandal-figures-ties-to-chinese-intelligence-for-over-a-year/)
- [StackAI Auto Agents — YC Launches](https://ycombinator.com/launches/P7T-stackai-embedded-ai-agents)
- [Epsilla — YC Launches](https://ycombinator.com/launches/Ls3-epsilla-ship-production-ready-ai-agents-on-day-1)
- [Hugging Face：Swarms, Flocks, Gangs](https://huggingface.co/blog/rl-multi-agents)
