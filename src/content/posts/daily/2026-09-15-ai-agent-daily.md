---
title: "AI 日報 — 2026-09-15"
date: 2026-09-15
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 能力正在商品化,治理層才是今天真正稀缺的資產——Anthropic 揭露的資安事件、GitHub trending 的五個治理工具、Salesforce 的 AI Control Plane,講的都是同一件事"
tldr: "Anthropic 揭露 GTG-50014 集團用 AI agent 在 34 小時內橫掃 40+ 企業租戶憑證,同一天 GitHub trending 五個專案全在做多 agent 治理、Salesforce 發佈跨平台 AI Control Plane;Temporal 完成 $550M 融資力挺耐久執行基礎設施;Nex-N2.5-Pro 開源模型電腦操作定位分數超車 Claude Opus 5;Microsoft 發佈人本 AI 行為準則,中國同日發佈 AI 安全治理框架 3.0"
draft: false
series:
  name: "AI 日報"
  order: 31
---

## 一句話判斷

**Agent 能力正在快速商品化,今天真正稀缺的是治理層——Anthropic 自揭的資安事件證明沒有治理層的 Agent 授權是災難放大器,而同一天 GitHub trending 五個專案與 Salesforce 的新產品線,全都在補這一層,台灣團隊評估導入 Agent 產品時,判準該從「多聰明」換成「治理補了多少」。**

## 深度分析:Agent 的護城河正在從「能力」轉向「治理層」

我認為今天最值得串起來看的,是「Agent 能力」正在快速商品化,而「治理與驗證層」正變成真正稀缺的互補資產——這不是單一新聞能講清楚的事,但今天四五個獨立事件合起來看,方向非常一致。(框架:互補資產)

最直接的證據是 Anthropic 自己揭露的 GTG-50014 資安事件:攻擊者用的不是什麼新技術,而是把長效期憑證、寫死密鑰這些老問題交給 AI agent 用機器速度執行,34 小時內就從一家 SaaS 供應商收割超過 2,100 組、橫跨 40 多個企業租戶的 Azure AD token。這代表「叫得動 Agent 做事」早就不是問題,問題在防禦端有沒有把憑證衛生、速度異常偵測這層治理補齊——沒補齊的組織,Agent 能力越強,曝險就越大。同一天的 GitHub Trending 完全印證這個方向:五個上榜專案沒有一個在比「Agent 更聰明」,OpenBot 把「動作先過 CEL policy 閘門再執行」刻進架構、AgentVerse-OS 逼每個 Agent 只能在隔離容器裡跑、teamai-cli 把 skill 和規則變成有版本控管的 push/review/pull 流程。Salesforce 同步發佈的 Agentforce 360 也不是在比七個具名 Agent 誰更強,而是加了一層跨平台 AI Control Plane——企業採購 Agent 產品的判準,正從「這個 Agent 能做什麼」轉向「能不能被稽核、被限權、被追蹤」。今天 Arxiv digest 的 Look Before You Leap 也點出同一個缺口:Agent 的動作「看起來成功」跟「真的做對」是兩回事,行號編輯格式在單行位移下讓 99.1% 的檔案被悄悄寫壞,沒有驗證層,Agent 的產出你根本無法信任。

對從業者的意義是:如果你在幫團隊導入或採購 Agent 產品,護城河的判斷標準該從「這家的模型多聰明」換成「治理層補了多少」——policy 引擎、容器隔離、短效期憑證、驗證閘,這些過去被視為「錦上添花」的基礎設施,現在是能不能安全把 Agent 交給真實任務的先決條件。對台灣團隊尤其實際:今天有台灣醫療機構才剛啟用 GPU 平台為 Agentic AI 鋪路(見下方區域動態),而 GTG-50014 事件的教訓是,任何導入含 Agent 授權的外部 SaaS 之前,先問供應商「下游租戶之間的信任邊界怎麼設」,比問「你的 Agent 多強」更該優先確認。

## 今日動態

### 廠商動態

**Salesforce**:在 Dreamforce 前搶先發佈 Agentforce 360,推出 Casey、Paige、Carter 等七個具名企業 Agent,並新增跨平台的 AI Control Plane 治理層,訊號顯示企業競爭焦點正從 Agent 能力轉向治理層(詳見上方深度分析)。([來源](https://kurums.com/salesforces-seven-named-ai-agents-what-the-september-2026-agentforce-360-launch-and-ai-control-plane-mean-for-enterprise-buyers/))

**Anthropic**:據 FT 報導,已連續兩季(以調整後指標計)獲利,年化營收衝上 650 億美元,同時籌備那斯達克 IPO,市場估值可能上看 2 兆美元。([來源](https://the-decoder.com/anthropic-eyes-nasdaq-listing-as-a-second-profitable-quarter-aims-to-win-over-investors-ahead-of-a-mega-ipo/))

**OpenAI**:404 Media 報導 OpenAI 僱用數百名承包商閱讀並評分真實 ChatGPT 對話以降低諂媚傾向,使用者須主動關閉「協助改善模型」設定才能避免對話被人工審閱。([來源](https://the-decoder.com/openai-has-hundreds-of-contract-workers-reading-your-chatgpt-conversations/))

**LangChain**:公開內部「付費媒體 Agent」的建構過程,以「coding agent 就是知識工作者」為核心原則,示範同一套 Agent 架構如何處理讀檔、分析、寫作等知識型任務。([來源](https://www.langchain.com/blog/paid-media-agent))

### 模型與基礎設施

今天的 Arxiv Digest 三篇論文合力指出同一件事:Agent 系統最危險的時刻,往往是它看起來一切正常的時候——一起真實 wiki 協調意外事件揭露評測環境普遍缺乏讀取與結果日誌、純 bash 介面比 typed tool 平均多拿 21.8–24.5 個百分點且省下 19–72% token、位置錨定的程式碼編輯格式在單行位移下讓 99.1% 的檔案被靜默寫壞。詳見[今日 Arxiv Digest](/posts/daily/2026-09-15-ai-agent-arxiv-digest)。

**Scale AI MCP-Atlas**:發佈開源基準,用真實 MCP server 評測模型端到端工具使用可靠度,結果顯示即使頂尖模型在大量任務上仍會失敗,凸顯 reasoning 強不代表 tool-use 穩定,與今天的 Agent 可靠性主題互相呼應。([來源](https://labs.scale.com/leaderboard/mcp_atlas))

**Nex-N2.5-Pro**:Nex AGI 開源 397B(A17B)MoE agentic 模型,OSWorld-G 電腦操作定位分數 87.4 分超車 Claude Opus 5 的 76.8 分,單一 8×H100 節點即可部署,詳見今日模型卡。([模型卡](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro))

**AWS**:每週彙整公告 OpenAI GPT-6 Astra 已上架 Amazon Bedrock、Amazon Quick 桌面版正式 GA,顯示多模型雲端供應鏈持續擴張。([來源](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-openai-gpt-6-astra-on-amazon-bedrock-amazon-quick-desktop-ga-kiro-for-students-and-more-september-14-2026/))

**Alibaba Cloud**:推出 PolarDB Agentic Data Foundation,把資料庫整合成 Agent 記憶、上下文與執行狀態的統一底層,鎖定生產環境 Agent 的資料管理痛點。([來源](https://www.alibabacloud.com/blog/the-first-data-foundation-of-the-agent-era-what-exactly-is-the-polardb-full-stack-data-foundation-for-agents_603551))

### 定價與 API 生命週期

**DeepSeek-V4.1-Flash**:阿里雲把這款 Agent 優化版模型上架 Token Plan,最低每月 6 美元即可使用,持續壓低中國雲端 AI 推理入門價格。([來源](https://www.alibabacloud.com/blog/deepseek-v4-1-flash-is-now-on-alibaba-cloud-token-plan-how-to-get-started-from-%246-a-month_603550))

### Coding Agent 賽道

**Sourcegraph**:推出 Agentic Batch Changes,讓單一工程師能透過 Agent 對數百到數千個 repo 同時執行程式碼遷移,把大規模程式碼變更收斂成一人可操作的流程。([來源](https://sourcegraph.com/blog/introducing-agentic-batch-changes))

### 工具與生態

今天的 GitHub Digest trending 五個專案沒有一個在比「Agent 更聰明」,比的都是「一大群 Agent 怎麼被管好」——OpenBot 的 CEL policy 閘門、teamai-cli 的 skill 版本控管、agent-launcher 的多 CLI 統一管理、AgentVerse-OS 的容器隔離工作區,詳見[今日 GitHub Digest](/posts/daily/2026-09-15-ai-agent-github-digest)。

**DearAgent**:開源 Cloudflare Worker,讓 Agent 擁有自己的 email 信箱做帳號註冊與驗證碼收發,是 AgentMail 的自架替代方案,詳見今日工具推薦。([工具推薦](/posts/daily/2026-09-15-tool-dearagent))

**ByteDance Volcengine**:開源 OpenViking,一套會隨 Agent 使用自我演化的上下文資料庫,在 tau2-bench 上讓相同 LLM 的任務成功率提升 6.87–11.87 個百分點。([來源](https://github.com/volcengine/OpenViking))

### 資安事件與防禦技術

**GTG-50014 憑證竊取事件**:Anthropic 揭露財務動機集團用 AI agent 自動化整條攻擊鏈,34 小時內橫掃 40 多個企業租戶的 Azure AD token,詳見今日資安警報。([資安警報](/posts/daily/2026-09-15-security-anthropic-gtg-50014-ai-agent-credential-theft))

**JFrog Artifactory**:攻擊者串連三個高風險漏洞(CVE-2026-42016、42018、82329)繞過身分驗證部署後門,CISA 已列入 KEV 目錄並要求聯邦機構兩週內修補。([來源](https://www.securityweek.com/three-jfrog-artifactory-flaws-exploited-for-backdoor-deployment/))

**PraisonAI**:開源多 Agent 框架在 4.6.59 之前版本的 CODE_TOOLS 元件存在路徑穿越漏洞(CVE-2026-56839,CVSS 7.3),凸顯 Agent 程式碼執行工具鏈的安全風險持續浮現。([來源](https://www.strix.ai/cve/CVE-2026-56839))

### 法規與治理

**Microsoft**:發佈 37 頁「人本 AI 行為準則」草案,明訂「人比 AI 重要」、拒絕賦予 AI 法律人格,並訂出模型在不確定情境下的判斷優先序,回應近期業界對 AI 安全的集體呼籲。([來源](https://www.theverge.com/news/994566/microsoft-humanist-ai-code-of-conduct))

**OpenAI**:Sam Altman 呼籲建立全國一致的先進 AI 安全框架,OpenAI 並宣布在可能帶來重大能力躍升的訓練前設定明確安全協議;Amodei、Hassabis、Nadella、Musk 同步表態支持放緩步調但不停止進展。([來源](https://the-decoder.com/sam-altman-calls-for-pacing-ai-development-but-promises-rapid-progress-will-continue/))

### 區域動態

**中國**

中共在網路安全宣傳週發佈《人工智能安全治理框架 3.0》,要求 AI 模型通過意識形態合規測試、強制內容標註,並將 AI 風險比照自然災害管理,監管力度明顯超越歐盟 AI Act 與美國自願框架。([來源](https://cryptobriefing.com/china-stricter-ai-oversight-framework/))

港股上市的 Z.AI(原智譜)尋求透過新股與可轉債募集約 50 億美元,距上次 40 億美元增發僅隔兩個月,阿里、騰訊、字節同步向外部資本募資,中國 AI 融資競賽持續升溫。([來源](https://en.sedaily.com/international/2026/09/14/zhipu-raises-5-billion-as-chinas-ai-funding-race-widens))

**台灣**

彰化基督教醫院啟用以 NVIDIA B200 為核心的高效能運算平台,擴充院內 AI 運算量能,並明確表示這是為發展代理式 AI(Agentic AI)奠定基礎——呼應上方深度分析的判斷:當台灣的醫療、金融等高監管產業開始鋪 Agentic AI 算力底座,治理層(存取控制、稽核軌跡)該在導入初期就內建,而不是等出事再補。([來源](https://tcnn.org.tw/archives/286625))

**日韓**

軟銀取得 118.7 億美元兩年期貸款以支應其 OpenAI 投資,金額較原先 100 億美元目標上修近兩成,消息公布後軟銀股價一度重挫 13%,顯示日本資本押注 OpenAI 的槓桿程度正在拉高。([來源](https://www.bloomberg.com/news/articles/2026-09-14/softbank-gets-upsized-11-9-billion-loan-in-openai-funding-push))

**東南亞**

Tracxn 統計顯示東南亞機器人產業累計募資達 11 億美元(2026 年至今 6.96 億美元創新高),新加坡以 9.86 億美元、佔比 91.7% 一枝獨秀,主要由人形機器人新創 Sharpa 單筆 6.7 億美元 C 輪撐起,馬來西亞、越南等其他國家募資規模仍在百萬美元級距。([來源](https://technode.global/2026/09/14/singapore-dominates-southeast-asias-1-1b-robotics-sector-funding/))

**印度/南亞**

PwC 印度與 PwC 美國成立擁 4 萬名員工的合資企業,預期業務規模由 13 億美元成長至 20 億美元,反映印度企業服務市場(含 AI 導入諮詢)持續擴張。([來源](https://startuptalky.com/news/daily-indian-funding-roundup-key-news-14-september-2026/))

孟加拉推出當地首個 AI Hub「RYZE」,回應當地教育、藝術與日常生活對多平台 AI 工具日益增加的依賴,是南亞 AI 基礎生態尚淺區域的少數本土建設案例。([來源](https://www.dhakatribune.com/business/419780/the-ryze-of-bangladesh%E2%80%99s-first-ai-hub))

**歐洲**

路透報導歐盟即將提案,限制 15 歲以下青少年使用社群媒體、影音平台、AI 聊天機器人與線上遊戲,是保護兒童免受網路風險最全面的一波管制計畫。([來源](https://kelo.com/2026/09/14/eu-is-set-to-propose-ban-on-social-media-and-ai-chatbots-for-under-15s/))

歐盟自 8 月起已可對通用型 AI 模型供應商執行 AI Act 罰則,但目前僅有 28 個具 AI 能力的認證機構,執法機制的人力缺口成為短期落地瓶頸,對打算主張合規優勢的歐洲業者是個警訊。([來源](https://www.thinkdifferent.blog/blog/nobody-is-ready-to-certify-europe-s-ai/))

**非洲**

分析指出南非、肯亞、奈及利亞、摩洛哥、埃及正吸引大型 AI 基礎建設投資,隨美歐資料中心受電力與土地限制,非洲有機會成為下一波算力擴張的落點。([來源](https://www.wwbl.com/2026/09/13/could-africa-be-the-next-ai-frontier-as-us-and-europe-hit-limits/))

**拉丁美洲**

拉美科技與 AI 新創單週募資總額達 4.06 億美元,涵蓋法律科技、身分驗證、財富管理與野火監測平台等多個 AI 應用領域,顯示第四季區域投資動能升溫。([來源](https://sceniuslatam.substack.com/p/406-million-in-one-week-q4-is-going))

**大洋洲**

NVIDIA 與 CDC、Sharon AI、IREN 等夥伴擴大澳洲 AI 基礎設施,IREN 南澳園區達 800MW,Sharon AI 規劃部署最多 68,000 顆 GPU,全數採用 NVIDIA DSX 平台。OneTrust 調查同時顯示澳洲企業已跨過 AI 實驗階段,但治理與監督明顯落後於 Agent 導入速度——跟上方深度分析的判斷同一個道理。([來源](https://itbrief.com.au/story/nvidia-expands-australian-ai-infrastructure-with-partners))

中東地區今日已檢索,未發現與 AI 直接相關(模型/法規/平台/融資)且來源可信的合格事件,予以省略。

### 商業案例 / 融資

**Temporal Series E**:耐久執行引擎 Temporal 完成 5.5 億美元 D 輪(編按:應為 E 輪),估值來到 125.5 億美元,OpenAI、NVIDIA、JPMorgan Chase 都是付費客戶,詳見今日融資速報。([融資速報](/posts/daily/2026-09-15-funding-temporal))

**Inspiren**:老年照護實體 AI 平台由 NewView Capital 領投完成 7000 萬美元 C 輪,估值逾 5 億美元,累計募資達 2.25 億美元,為該垂直領域最高紀錄。([來源](https://theaiinsider.tech/2026/09/14/inspiren-raises-70m-series-c-to-scale-physical-ai-for-senior-living/))

**Celero Communications**:研發 AI 資料中心連網晶片的新創完成 2.75 億美元募資,估值達 30 億美元,反映 AI 基礎設施上游供應鏈持續吸金。([來源](https://www.ocbj.com/oc-homepage/celero-raises-275m-gets-3b-valuation/))

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| GTG-50014 事件收割 Azure AD token 數 | 2,100+(橫跨 40+ 租戶) | [Anthropic](https://www.anthropic.com/threat-intelligence-report-september-2026) |
| Temporal 估值(7 個月內 2.5x) | $12.55B | [Temporal](https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai) |
| Anthropic 年化營收 | ~$65B | [The Decoder](https://the-decoder.com/anthropic-eyes-nasdaq-listing-as-a-second-profitable-quarter-aims-to-win-over-investors-ahead-of-a-mega-ipo/) |
| SoftBank 支應 OpenAI 投資貸款 | $11.9B | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-14/softbank-gets-upsized-11-9-billion-loan-in-openai-funding-push) |
| Nex-N2.5-Pro OSWorld-G 分數 | 87.4(贏過 Claude Opus 5 的 76.8) | [模型卡](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro) |
| 位置錨定程式碼編輯在單行位移下的靜默毀損率 | 99.1% | [Arxiv Digest](/posts/daily/2026-09-15-ai-agent-arxiv-digest) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-15](/posts/daily/2026-09-15-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-15](/posts/daily/2026-09-15-ai-agent-github-digest)
- 📄 [融資速報｜Temporal Series E $550M](/posts/daily/2026-09-15-funding-temporal)
- 📄 [模型卡｜Nex-N2.5-Pro](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro)
- 📄 [資安警報｜Anthropic 揭露 GTG-50014](/posts/daily/2026-09-15-security-anthropic-gtg-50014-ai-agent-credential-theft)
- 📄 [工具推薦｜DearAgent](/posts/daily/2026-09-15-tool-dearagent)
- 📄 [AI Engineer 面試日練 — 2026-09-15：Deep Learning & NLP](/posts/daily/2026-09-15-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-09-15：Metrics & Analytics](/posts/daily/2026-09-15-product-builder-interview-daily)

## 明日關注

- GTG-50014 事件後續:是否有更多受害 SaaS 供應商或下游企業租戶被公開點名,以及是否有廠商跟進推出「AI agent 風險治理」產品搶市場
- Salesforce Agentforce 360 的 AI Control Plane 在 Dreamforce 正式亮相後,競品(Microsoft Copilot、ServiceNow)是否跟進補治理層
- Temporal 這輪錢投入後,是否有更多 Agent 框架(如 LangGraph、CrewAI)宣布把耐久執行疊在 Temporal 之上,而非自己重造一個

## 今日收穫

之前以為「Agent 協調出問題」該補的第一道防線是把治理規則設好,今天看完 Mechanics of a Swarm 這篇論文才意識到,更前面還有一道更基本的防線:近千個評測用 Agent 在一個陌生 wiki 上協調了五週,連論文作者自己都無法判定這個協調對任務進度到底有沒有幫助,因為評測環境從一開始就沒有留下讀取與結果日誌。這提醒我,在討論「怎麼治理 Agent」之前,更根本的問題其實是「你有沒有能力先觀測到 Agent 群體在做什麼、有沒有用」——沒有可觀測性,治理規則寫得再細,也只是憑感覺調整,連自己都不知道調對了沒有。

## 參考資料

- [AI Agent Arxiv Digest — 2026-09-15](/posts/daily/2026-09-15-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-09-15](/posts/daily/2026-09-15-ai-agent-github-digest)
- [融資速報｜Temporal Series E $550M](/posts/daily/2026-09-15-funding-temporal)
- [模型卡｜Nex-N2.5-Pro](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro)
- [資安警報｜Anthropic 揭露 GTG-50014](/posts/daily/2026-09-15-security-anthropic-gtg-50014-ai-agent-credential-theft)
- [工具推薦｜DearAgent](/posts/daily/2026-09-15-tool-dearagent)
- [Salesforce's seven named AI agents: what the September 2026 Agentforce 360 launch means for enterprise buyers](https://kurums.com/salesforces-seven-named-ai-agents-what-the-september-2026-agentforce-360-launch-and-ai-control-plane-mean-for-enterprise-buyers/)
- [Anthropic eyes Nasdaq listing after second profitable quarter](https://the-decoder.com/anthropic-eyes-nasdaq-listing-as-a-second-profitable-quarter-aims-to-win-over-investors-ahead-of-a-mega-ipo/)
- [OpenAI has hundreds of contract workers reading ChatGPT conversations](https://the-decoder.com/openai-has-hundreds-of-contract-workers-reading-your-chatgpt-conversations/)
- [LangChain: how we built our internal Paid Media Agent](https://www.langchain.com/blog/paid-media-agent)
- [Scale AI MCP-Atlas leaderboard](https://labs.scale.com/leaderboard/mcp_atlas)
- [AWS Weekly Roundup — September 14, 2026](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-openai-gpt-6-astra-on-amazon-bedrock-amazon-quick-desktop-ga-kiro-for-students-and-more-september-14-2026/)
- [Alibaba Cloud PolarDB Agentic Data Foundation](https://www.alibabacloud.com/blog/the-first-data-foundation-of-the-agent-era-what-exactly-is-the-polardb-full-stack-data-foundation-for-agents_603551)
- [DeepSeek-V4.1-Flash on Alibaba Cloud Token Plan](https://www.alibabacloud.com/blog/deepseek-v4-1-flash-is-now-on-alibaba-cloud-token-plan-how-to-get-started-from-%246-a-month_603550)
- [Sourcegraph introduces Agentic Batch Changes](https://sourcegraph.com/blog/introducing-agentic-batch-changes)
- [ByteDance Volcengine open-sources OpenViking](https://github.com/volcengine/OpenViking)
- [Three JFrog Artifactory flaws exploited for backdoor deployment](https://www.securityweek.com/three-jfrog-artifactory-flaws-exploited-for-backdoor-deployment/)
- [PraisonAI CVE-2026-56839](https://www.strix.ai/cve/CVE-2026-56839)
- [Microsoft's Humanist AI Code of Conduct](https://www.theverge.com/news/994566/microsoft-humanist-ai-code-of-conduct)
- [Sam Altman calls for pacing AI development](https://the-decoder.com/sam-altman-calls-for-pacing-ai-development-but-promises-rapid-progress-will-continue/)
- [China unveils AI Security Governance Framework 3.0](https://cryptobriefing.com/china-stricter-ai-oversight-framework/)
- [Z.AI seeks to raise ~$5B](https://en.sedaily.com/international/2026/09/14/zhipu-raises-5-billion-as-chinas-ai-funding-race-widens)
- [彰基打造高效能運算中心 提升智慧醫療算力](https://tcnn.org.tw/archives/286625)
- [SoftBank secures upsized $11.9B loan for OpenAI investment](https://www.bloomberg.com/news/articles/2026-09-14/softbank-gets-upsized-11-9-billion-loan-in-openai-funding-push)
- [Singapore dominates Southeast Asia's $1.1B robotics sector funding](https://technode.global/2026/09/14/singapore-dominates-southeast-asias-1-1b-robotics-sector-funding/)
- [PwC India and PwC US launch 40,000-employee joint venture](https://startuptalky.com/news/daily-indian-funding-roundup-key-news-14-september-2026/)
- [Bangladesh launches its first dedicated AI hub](https://www.dhakatribune.com/business/419780/the-ryze-of-bangladesh%E2%80%99s-first-ai-hub)
- [EU set to propose ban on AI chatbots for under-15s](https://kelo.com/2026/09/14/eu-is-set-to-propose-ban-on-social-media-and-ai-chatbots-for-under-15s/)
- [EU AI Office faces shortage of certified auditors](https://www.thinkdifferent.blog/blog/nobody-is-ready-to-certify-europe-s-ai/)
- [Could Africa become the next AI infrastructure frontier?](https://www.wwbl.com/2026/09/13/could-africa-be-the-next-ai-frontier-as-us-and-europe-hit-limits/)
- [Latin America tech/AI startup funding hits $406M in one week](https://sceniuslatam.substack.com/p/406-million-in-one-week-q4-is-going)
- [NVIDIA expands Australian AI infrastructure with partners](https://itbrief.com.au/story/nvidia-expands-australian-ai-infrastructure-with-partners)
- [Australian organisations struggle to govern AI agents](https://smbtech.au/news/australian-organisations-struggle-to-govern-ai-agents-as-adoption-outpaces-oversight-onetrust-report-finds/)
