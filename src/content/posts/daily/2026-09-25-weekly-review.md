---
title: "AI Agent 週回顧 — 2026-09-25"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "本週最大的認知變化：擋住 Agent 越權的從來不是審核、模型判斷或取消按鈕，是工具呼叫當下有沒有一層確定性政策——本週兩起真實資安事件與三篇論文從實測與形式化證明兩邊同時證實這件事"
tldr: "Anthropic Opus 5.5 上線一小時內 OpenAI 就推出 GPT-6 Sol/Luna，Grok 4.7 官方自測 38% 對第三方複測 26%，三大廠模型戰進入「發布即互打」階段；Anthropic／OpenAI／SpaceXAI／Google 首次同時被告反壟斷；AWS AgentCore、MaxKB CVSS 10.0、MemTensor MemOS 供應鏈攻擊三起真實事件，加上 Loopjacking／APort Vault／Authorization Revocation 三篇論文，一致指向「審核、模型判斷、取消都不是真的驗證」；Ema／Chamelio／Firecrawl／Enhans 一週內合計超過 2 億美元融資，資本已經在賭 Agent 直接接管企業原本外包的工作"
series:
  name: "AI Agent 週回顧"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-09-25-weekly-review-en)

## 本週最重要的 5 件事

### 1. Anthropic 與 OpenAI 一小時內接連發模型，Grok 4.7 官方自測與第三方複測落差擴大

Anthropic 在 9/22 發佈 Claude Opus 5.5（效能追平 Claude Fable 5.1、成本降 40%），約一小時後 OpenAI 同步在 AWS Bedrock 上架 GPT-6 Sol 與 GPT-6 Luna，前沿模型的發布節奏已經壓縮到「同一天互打」。同一週稍早，xAI 發佈 Grok 4.7，官方自測 Terminal-Bench 4.0 從 20.3% 跳到 38.0%，但 Artificial Analysis 獨立複測只有 26%——落差達 12 個百分點。三件事疊在一起說明兩件事：模型層的價格戰已經進入「發布即互打」的下半場，而官方自測分數與第三方複測的落差正在變成常態而非例外，選型時不能只看廠商自己公布的 benchmark。（[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5) · [Opus 5.5 完整分析](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5) · [GPT-6 Sol/Luna 上架 AWS Bedrock](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/) · [Grok 4.7 benchmark 落差](https://the-decoder.com/xai-launches-grok-4-7-at-bargain-prices-but-benchmarks-reveal-a-wide-gap-to-claude-and-gpt-6/) · [Grok 4.7 完整分析](/posts/daily/2026-09-23-model-xai-grok-4-7)）

### 2. Anthropic、OpenAI、SpaceXAI、Google 首次同時被告反壟斷

一項新的反壟斷訴訟指控四大實驗室非法協議放緩各自的 AI 開發進度，是這四家第一次同時成為同一宗反壟斷案的被告。過去針對 AI 大廠的反壟斷關注多半分散在個別公司的資料授權或市場壟斷行為，這次訴訟把「四家實驗室疑似協調放慢腳步」當成單一指控主體，代表監理機關（或至少原告律師）已經開始把前沿 AI 產業當成一個需要整體反壟斷審視的「聯合行為」市場，而不是四個各自獨立的公司。對任何依賴這四家 API 的 Agent 開發者，這是值得追蹤的長期監理風險，即使短期不影響服務可用性。（[反壟斷訴訟報導](https://apnews.com/article/antitrust-lawsuit-ai-slowdown-anthropic-openai-spacexai-google-960af4308161eaf4ed13c383b0ce1c1b)）

### 3. AWS AgentCore、MaxKB、MemTensor MemOS 三起真實事件加三篇論文，一致證明「審核」不等於「驗證」

本週最完整的一條主線橫跨真實資安事件與學術研究兩邊。真實事件端：Unit 42 揭露 AWS AgentCore Harness 預設開啟的 shell 工具以 root 權限跟 harness 主行程共用記憶體，讓 prompt injection 能讀出 Identity vault 解密後的明文憑證；MaxKB 只要 assistant 掛上任何工具就自動附贈一個沒有人工核准、以 root 執行的 shell 工具，CVSS 直接打到滿分 10.0；MemTensor 維護的記憶框架 MemOS 遭供應鏈攻擊，npm／PyPI 套件在 agent 啟動與每次記憶回想時偷跑會外洩 prompt 的憑證竊取器。論文端：Loopjacking 在 Agno AgentOS、LangGraph Agent Server、OpenClaw 三個真實產品裡重現「人審核操作 A、系統實際執行操作 B」的失效模式；APort Vault 用 22.6 萬次評測證明擋下 Agent 亂轉帳的是工具呼叫前的確定性政策層，不是換一個更聰明的模型；Authorization Revocation 用形式化證明指出「取消」在委派與非同步執行下可能根本不算真的撤銷授權。六件事合起來指向同一個工程結論：真正擋下風險的必須是工具呼叫當下的確定性檢查，而不是執行前的審核、模型自我判斷，或事後的取消動作。（[AWS AgentCore 完整分析](/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration) · [Unit 42 原始報告](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/) · [MaxKB 完整分析](/posts/daily/2026-09-23-security-maxkb-agent-shell-rce) · [GHSA-f36j-f34j-h3rx](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx) · [MemOS 供應鏈攻擊完整分析](/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain) · [The Hacker News 原始報導](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html) · [Loopjacking](https://arxiv.org/abs/2609.21081) · [APort Vault](https://arxiv.org/abs/2609.22076) · [Authorization Revocation](https://arxiv.org/abs/2609.21284)）

### 4. Meta Connect 2026：Muse 拿到 email 帳號與 Mac 控制權，個人 agent 開始長出真實動作能力

Meta Connect 2026 上，個人 AI agent Muse 新增即時視訊分身、專屬 email 地址與 Mac 控制能力，預計未來數月登上智慧眼鏡，同場發表 $1,299 的 VR Glasses 與首款 Ray-Ban Meta Audio 眼鏡。跟前幾週各家「個人助理型 agent」多半還停留在對話與排程層級不同，Muse 這次拿到的是「有自己的 email 帳號」與「能操作作業系統」這兩項實質動作能力——這代表消費端個人 agent 的能力邊界正在往企業 agent 常見的「可執行動作」靠攏，也意味著同一套授權與稽核問題（見上一件事）很快會從企業場景擴散到消費端產品。（[Meta Connect 2026 報導](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/)）

### 5. Ema、Chamelio、Firecrawl、Enhans 一週內合計超過 2 億美元，資本押注 Agent 直接接管企業預算

本週四筆企業 Agent 融資疊在一起看：Ema 完成 $77M Series B（AI 員工接管企業原本外包給 SaaS 與 IT 服務商的工作）、Chamelio 完成 $26M Series A（距種子輪僅 5 個月、ARR 成長 4 倍，AI Agent 接手法務合約審閱）、Firecrawl 完成 $75M Series B 並同步推出付費知識平台 Alexandria（從「網頁抓取工具」升級成「Agent 的知識供應鏈」）、Enhans 完成 $38M Series C（POSCO、LG、樂天三大財閥旗下投資公司首次以客戶集團策略投資人身分下注同一家 Agent 新創）。四筆案子的共同訊號是：資本已經不再把「企業導入 Agent」當成概念驗證階段的賭注，而是直接賭 Agent 會接管原本要花錢請人、請律師事務所或訂閱 SaaS 才能完成的工作——換句話說，Agent 現在搶的是企業既有的營運預算，不是新開的實驗預算。（[Ema](https://techcrunch.com/2026/09/23/ema-raises-77m-as-ai-starts-eating-into-enterprise-software-and-services/) · [Ema 完整分析](/posts/daily/2026-09-25-funding-ema) · [Chamelio](https://www.prnewswire.com/news-releases/chamelio-raises-26m-series-a-to-replace-legacy-clm-with-ai-native-in-house-legal-operations-302886011.html) · [Chamelio 完整分析](/posts/daily/2026-09-25-funding-chamelio) · [Firecrawl](https://www.firecrawl.dev/blog/introducing-alexandria-series-b) · [Firecrawl 完整分析](/posts/daily/2026-09-25-funding-firecrawl) · [Enhans](https://www.einnews.com/pr_news/942627211/enhans-raises-38-million-in-series-c-funding-to-advance-its-ai-native-enterprise-operating-system) · [Enhans 完整分析](/posts/daily/2026-09-21-funding-enhans)）

## 本週認知更新

- 之前以為「人工審核」「模型自己判斷該不該做」「按下取消」這三種機制能各自擋住 Agent 的越權行為，現在知道它們都只是「執行前的意圖聲明」，不是「執行當下的驗證」——AWS AgentCore、MaxKB 兩起真實事件從程式碼層證明這件事，Loopjacking、APort Vault、Authorization Revocation 三篇論文分別從真實產品重現、22.6 萬次評測、形式化證明三個角度證明同一個結論：真正擋下風險的是工具呼叫當下的確定性政策層。
- 之前以為前沿模型廠商自己公布的 benchmark 分數大致可信，現在看到 Grok 4.7 官方自測 Terminal-Bench 4.0 從 20.3% 跳到 38.0%、但 Artificial Analysis 獨立複測只有 26%，落差高達 12 個百分點，才知道官方自測與第三方複測的落差已經大到不能忽略——選型決策該優先看獨立評測，不是廠商自己的發布稿。
- 之前以為 Agent 記憶系統的技術瓶頸在「存什麼、存多少」，這週看 JitMem 把記憶策展延後到讀取時才決策（比最強基準多出最多 16.3 個百分點的成功率）、CliffCompaction 用「只刪不改寫」把成本砍最多 50%，才知道瓶頸其實在「什麼時候做決策」——把同一批決策從寫入時搬到讀取時，不用換模型、不用加資料就能多榨出兩位數的效能。
- 之前以為企業導入 Agent 還停留在概念驗證、各憑本事試水溫的階段，這週把 Ema、Chamelio、Firecrawl、Enhans 四筆合計超過 2 億美元的融資放在一起看才知道，資本已經把「Agent 直接接管企業原本外包給 SaaS 或服務商的工作」當成既定趨勢在下注，不是還在等驗證。

## 企業落地觀察

我認為本週最值得台灣企業借鏡的案例是 Ema 與 Chamelio 這兩筆融資背後的共同邏輯——AI Agent 不是在「幫忙做事」，是在直接取代原本要外包出去的整個服務關係。

從交易成本的角度分析：企業過去把法務合約審閱、IT 維運這類工作外包給律師事務所或 SaaS／服務商，本質上是在用「外部採購」取代「內部自建能力」，因為自建的協調與監督成本太高。Chamelio 的賭注是，當 AI Agent 能夠在「法律行動」這個特定領域自主完成審閱與執行，企業原本花在挑選外部供應商、對接合約流程、監督執行品質上的交易成本，可以被壓縮成一次性的 Agent 導入成本；Ema 的賭注邏輯相同，只是把範圍從法務擴大到 IT 服務全體。換句話說，這兩家公司在賭的不是「AI 比人便宜」，是「AI Agent 讓企業把原本必須外包的協調成本重新內部化」。

對台灣企業與中小型服務商的啟示：如果你的收入來源是替企業做這類「流程明確、可被拆解成規則加判斷」的服務型工作（合約審閱、財會流程、IT 維運），這輪融資潮代表的不是遙遠的威脅，而是你的客戶正在被說服「這件事可以不用外包」。台灣的服務型中小企業不該照搬矽谷這套「直接換成全自動 Agent」的打法——中文法律文本的判例基礎薄弱、跨國企業的合規要求複雜，短期內更務實的路徑是把自己的服務重新包裝成「Agent 加人工複核」的混合模式，而不是等著被國際玩家的通用 Agent 平台整碗端走。

## 下週值得追蹤的

- StepFun Step 5 開源權重預計 2026-10-15 釋出，屆時可驗證其官方公布的 Artificial Analysis Intelligence Index 44 分是否禁得起社群獨立複測（本週 Grok 4.7 才剛出現官方與第三方落差擴大的案例）
- MaxKB CVE-2026-77521（CVSS 10.0）已於 v2.10.5-lts 修補，但目前尚無證據顯示遭實際利用，值得追蹤是否有真實攻擊案例浮現
- Ema、Chamelio 兩輪新資金公布後，是否有具體新客戶或功能路線圖釋出，可驗證「Agent 接管企業外包工作」這個敘事是否轉化成實際出貨

## Watchlist 更新建議

### 🆕 建議加入

✅ 本週 signals 中出現的公司均已在 watchlist 內，無新增候選（以「本週 signals 中不在 watchlist 且出現 ≥ 3 次」為門檻檢核；本週各家新創的融資訊號多來自獨立的融資速報文章，未達 signals 內重複曝光的門檻，已在下方「本週新創雷達」中列出）

### ⚠️ 考慮移除

✅ 本週無符合移除條件的公司

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| Ema | 「AI 員工」型企業 Agent 編排平台 | Series B $77M（累計 $140M） | 估值較 2024 年上一輪翻超過 4 倍，直接分食企業軟體與 IT 服務商的既有預算 |
| Chamelio | AI Agent 取代法務的合約管理系統 | Series A $26M（累計 $36M） | 距種子輪僅 5 個月、ARR 成長 4 倍，賭內部法務願意把合約審閱外包給 Agent |
| Firecrawl | 網頁資料抓取 API，同步推出付費知識平台 Alexandria | Series B $75M（累計逾 $95M） | 從「抓網頁的工具」升級成「Agent 的知識供應鏈」，付費跟人類買知識再轉賣給 Agent |
| Enhans | 韓國企業 Agent 作業系統（AgentOS） | Series C $38M（累計 $60M） | POSCO、LG、樂天三大財閥旗下投資公司首次以客戶集團身分策略投資同一家 Agent 新創 |

## 我這週學到什麼

這週最大的認知更新是：擋住 Agent 越權從來不是靠「多一層審核」或「模型自己判斷該不該做」，是靠工具呼叫當下有沒有一層不靠模型判斷的確定性檢查。AWS AgentCore、MaxKB 兩起真實事件加上 Loopjacking、APort Vault、Authorization Revocation 三篇論文，從真實產品、大規模評測、形式化證明三個完全不同的角度得出同一個結論，這種跨證據來源的一致性比單一事件更值得重視。對台灣正在導入或開發 Agent 的團隊，實際的判斷是：稽核 Agent 系統時該問的不是「有沒有人審核」，是「工具真正被呼叫的那一刻，有沒有一層不會被 prompt 說服的規則在把關」——這條線同時也是這週企業融資潮（Ema、Chamelio）敢把整個服務流程交給 Agent 的前提：沒有這層確定性把關，交出去的不是效率，是風險。

## 參考資料

- [Anthropic — Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)
- [模型卡｜Claude Opus 5.5（quidproquo 站內文章）](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)
- [AWS — Bring more intelligence to everyday work with GPT-6 Sol and GPT-6 Luna on Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/)
- [The Decoder — xAI launches Grok 4.7 at bargain prices, but benchmarks reveal a wide gap to Claude and GPT-6](https://the-decoder.com/xai-launches-grok-4-7-at-bargain-prices-but-benchmarks-reveal-a-wide-gap-to-claude-and-gpt-6/)
- [模型卡｜Grok 4.7（quidproquo 站內文章）](/posts/daily/2026-09-23-model-xai-grok-4-7)
- [AP News — Antitrust lawsuit filed against Anthropic, OpenAI, SpaceXAI and Google over alleged coordinated AI slowdown](https://apnews.com/article/antitrust-lawsuit-ai-slowdown-anthropic-openai-spacexai-google-960af4308161eaf4ed13c383b0ce1c1b)
- [Unit 42 — A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/)
- [資安警報｜AWS AgentCore（quidproquo 站內文章）](/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration)
- [GitHub Security Advisory GHSA-f36j-f34j-h3rx — MaxKB](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx)
- [資安警報｜MaxKB（quidproquo 站內文章）](/posts/daily/2026-09-23-security-maxkb-agent-shell-rce)
- [The Hacker News — Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html)
- [資安警報｜MemTensor MemOS 供應鏈攻擊（quidproquo 站內文章）](/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain)
- [Loopjacking: Hijacking Human-in-the-Loop Approval](https://arxiv.org/abs/2609.21081)
- [APort Vault](https://arxiv.org/abs/2609.22076)
- [Authorization Revocation](https://arxiv.org/abs/2609.21284)
- [JitMem](https://arxiv.org/abs/2609.27334)
- [CliffCompaction](https://arxiv.org/abs/2609.26779)
- [Meta Newsroom — Introducing Ray-Ban Meta Audio Glasses, new styles, plus Muse](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/)
- [TechCrunch — Ema raises $77M as AI starts eating into enterprise software and services](https://techcrunch.com/2026/09/23/ema-raises-77m-as-ai-starts-eating-into-enterprise-software-and-services/)
- [融資速報｜Ema（quidproquo 站內文章）](/posts/daily/2026-09-25-funding-ema)
- [PR Newswire — Chamelio Raises $26M Series A to Replace Legacy CLM with AI-Native In-House Legal Operations](https://www.prnewswire.com/news-releases/chamelio-raises-26m-series-a-to-replace-legacy-clm-with-ai-native-in-house-legal-operations-302886011.html)
- [融資速報｜Chamelio（quidproquo 站內文章）](/posts/daily/2026-09-25-funding-chamelio)
- [Firecrawl — Introducing Alexandria and our $75M Series B](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)
- [融資速報｜Firecrawl（quidproquo 站內文章）](/posts/daily/2026-09-25-funding-firecrawl)
- [Enhans Raises $38 Million in Series C Funding to Advance Its AI-Native Enterprise Operating System](https://www.einnews.com/pr_news/942627211/enhans-raises-38-million-in-series-c-funding-to-advance-its-ai-native-enterprise-operating-system)
- [融資速報｜Enhans（quidproquo 站內文章）](/posts/daily/2026-09-21-funding-enhans)
