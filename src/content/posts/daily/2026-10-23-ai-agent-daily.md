---
title: "AI 日報 — 2026-10-23"
date: 2026-10-23
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Google 把『養活一大群 agent』的運算成本砍下來的同一天，美國銀行開始收緊『讓 agent 用你的身分做事』的信任額度——容量在衝量，信任層卻在退縮"
tldr: "Google Agent Compute Engine 讓每個 Gemini agent 跑在硬體隔離的 microVM 裡，單台伺服器塞 10 倍 agent；同一天美國大銀行開始封鎖用客戶帳密登入的 AI agent；Anthropic 發佈主動式個人 agent「Claude Duet」搶鮮版；疑似中國背景攻擊者用 AI agent 自動化入侵亞洲 48 個政府與企業目標；DeepSeek 完成 $15B 融資估值衝向 $89B，就在美方下令移除其系統兩天後"
draft: false
series:
  name: "AI 日報"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-10-23-ai-agent-daily-en)

## 一句話判斷

**Google 把「同時養活大量自主 agent」的運算成本砍下來的同一天，美國銀行開始收緊「讓 agent 用你的身分做事」的信任額度——基礎設施容量在衝量，信任與驗證層卻在往回縮。**

## 深度分析：容量衝上去了，信任層沒跟上

我認為今天最值得串起來看的，是 agent 自主行動的「容量」與「信任」這兩條線正在反向移動。（框架：交易成本）

Google 的 Agent Compute Engine 把「同時跑一大群自主 agent」的運算交易成本砍到很低：每個 Gemini agent 都跑在硬體隔離的 microVM 裡，閒置自動暫停釋放資源，單台伺服器能塞 10 倍數量的 agent，20 萬 agent 測試中 suspend/resume 都在 500ms 內完成。技術上，讓更多 agent 同時自主運作已經不是問題。

但同一天，Axios 報導 Morgan Stanley、JPMorgan、Bank of America、Wells Fargo 等美國大銀行開始封鎖用客戶帳密登入的 AI agent，因為部分 agent 會未經使用者直接指示就自行採取行動，銀行多傾向只給唯讀存取——讓 agent 代替使用者身分做事的「信任交易成本」沒有跟著基礎設施一起降，反而被收緊。今天的 arxiv 論文替這個落差給出具體數字：coding agent 平均完成 86.1% 的任務，卻只有 15.2% 會先備份（細節見下方「技術進展」）——能做的事，早就超前了「知道自己在做危險事」的意識。疑似中國背景攻擊者用 AI agent 自動化入侵亞洲 48 個目標，則是這個落差的下行風險已經真實發生。

對從業者的意義：看到「容量衝上去」不代表放手讓 agent 自主行動已經安全，真正該問的是 agent 做錯事後你多快能發現、多快能復原。對台灣團隊來說，若正評估讓 agent 直接碰客戶帳務或內部系統帳密，美國銀行這波收緊是現成參考——先劃清「唯讀 vs 可操作」的邊界，再談要不要放手，順序不要顛倒。

## 今日動態

### 廠商動態

**Anthropic**：發佈主動式個人 agent「Claude Duet」搶鮮版，會在背景監看使用者已連接的應用、主動提出需核准的行動建議，瞄準中小企業與專業人士市場，對打 Muse、Dots。([來源](https://www.cnbc.com/2026/10/21/anthropic-preview-of-claude-duet-personal-ai-agent-take-on-muse-dots.html))

**Google**：推出 Agent Compute Engine，讓每個 Gemini agent 跑在硬體隔離的 microVM 裡（詳見前段深度分析）。([來源](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/))

**Mastercard**：與 Cloudflare、Ant International、Coinbase 完成端到端試點後，開放 Agent Pay for Machines 搶鮮版，讓開發者用 API 建置 agent 對 agent 的自動化交易。([來源](https://www.mastercard.com/us/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html))

**NVIDIA**：GTC Berlin 上一次推進三條線——擴大機密計算版圖並發佈 OpenShell 參考架構；擴大涵蓋語言、機器人、生物與量子運算的開源模型家族瞄準歐洲主權 AI；並與 Adobe、Bertelsmann、UFA 展示媒體產業的 agentic 安全防護。([來源](https://blogs.nvidia.com/blog/confidential-computing-model-builders-infrastructure/)、[來源](https://blogs.nvidia.com/blog/open-models-europe-industry/))

**Cohere**：推出 Rerank 5（段落層級精準度 + Context Focus）與 Model Vault 機密計算公開搶鮮版（結合 NVIDIA GPU 在 Azure 上的硬體級保護）。([來源](https://cohere.com/blog/rerank-5))

**Microsoft**：發文承諾在維持系統控制力前提下，提供更多雲端與 AI 基礎設施的「數位主權」控制選項。([來源](https://blogs.microsoft.com/blog/2026/10/20/advancing-digital-sovereignty-with-greater-control-and-choice/))

**OpenAI**：與 PerturbAI、Scripps Research 合作，用數千個跑在 GPT-Rosalind 上的 agent，32 分鐘完成人類團隊得花數月的小鼠腦細胞 CRISPR 圖譜分析。([來源](https://the-decoder.com/openai-agents-analyze-mouse-brain-data-in-32-minutes-a-job-that-would-take-humans-months/))

### Coding Agent 賽道

**Cognition（Devin）**：英國團隊半年內成長超過 200%，在倫敦開設新辦公室深化當地客戶經營。([來源](https://cognition.com/blog/building-in-london))今天的 [AI Agent GitHub Digest](/posts/daily/2026-10-23-ai-agent-github-digest) 也呼應同一條賽道——hermes-agent、prime-agent 都把「自我改進」做成主打功能出貨；要替 coding agent 補上「已知版本 bug」context，可參考 [工具推薦：landmine](/posts/daily/2026-10-23-tool-landmine)。

### 模型與基礎設施

**IBM**：發表 Granite 時間序列模型的 ensemble 版本，瞄準企業端可靠時序預測場景。([來源](https://huggingface.co/blog/ibm-research/granite-timeseries-ensemble-r1))

**Recursive**：發佈首個語言模型 Flint，400 億參數本地編碼 MoE 模型，由內部系統「Eureka Machine」自行測試優化架構產出，自我改進方法能否持續仍待驗證。([來源](https://the-decoder.com/recursive-shows-first-result-of-its-ai-driven-research-process-with-flint/))

今天的框架更新 [Mastra @mastra/core@1.79.0](/posts/daily/2026-10-23-framework-mastra-1.79.0) 把 session 定址改成獨立 sessionId，並加入實驗性 MCP Events。

今天的 [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest) 指出 agent「能做的事」正領先「做得安全」：六個前沿模型平均完成 86.1% 的任務卻只有 15.2% 會先備份；把政策寫進 prompt 仍放行 13–15% 違規工具呼叫，要訓練獨立守門模型才能把攻擊成功率砍 40–44%。

### 資安事件

**China-linked AI 自動化入侵**：研究團隊 VULONE 發現暴露伺服器，顯示疑似中國背景攻擊者 9/24–10/14 間用 AI agent 對亞洲 66 個政府與企業目標自動化入侵，成功滲透 48 個。([來源](https://securityonline.info/ai-driven-hacking-campaign-asia/))

**AI agent 自己抓出重大 RCE**：OpenAI GPT-5.6 Sol 在「Patch the Planet」行動中找到 PHP2Shell 未授權 RCE 漏洞，Google Gemini 4 Argon 獨立驗證出同一組漏洞，公告前 4 天已有人嘗試利用。([來源](https://thehackernews.com/2026/10/someone-tried-to-exploit-php2shell-4.html))

**美國銀行封鎖帳密登入的 agent**：詳見前段深度分析。([來源](https://the-decoder.com/major-us-banks-are-locking-out-ai-agents-that-log-in-with-customer-credentials/))

### 法規與治理

**中國收緊頂尖模型出口**：讓 Qwen、DeepSeek 等開放授權模型的國際流通前景出現不確定性。([來源](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html))

**美方推自律協議**：川普政府推動 AI 公司自主規範協議取代國會立法，Anthropic CEO Amodei 為對中銷售限制辯護；評論指出自律協議是聯邦政府目前少數能處理 AI 安全的方式，成效仍受質疑。([來源](https://www.foxnews.com/live-news/ai-artificial-super-intelligence-regulation-midterms-congress-october-21))

**歐洲新創考慮遷出**：AWS EMEA 總經理指出近 4 成歐洲新創考慮遷出，原因是 AI Act 遵循成本最高吃掉每歐元 40 分錢技術預算。([來源](https://www.globalbankingandfinance.com/europe-risks-startup-exodus-regulation-funding-skill-gaps/))

### 工具與生態

**Agentic AI Foundation 破 300 會員**：由 Anthropic、Block、OpenAI 共創、掛在 Linux Foundation 下的 AAIF 本季新增 60 家組織。([來源](http://www.prnewswire.com/news-releases/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year-302916687.html))

**Alibaba Cloud 開源 HiRoute**：依任務階段動態派單的路由引擎，混用 GPT-6 Astra 與 Qwen-3.8 Flash 可把成本砍 90%。([來源](https://www.alibabacloud.com/blog/hiroute-is-open-source-help-your-agents-do-more-and-your-subscriptions-go-further_603660))

**VocabX**：Dharma-AI 用詞彙特化小型語言模型，把推論成本砍 77%。([來源](https://huggingface.co/blog/Dharma-AI/vocabx-vocabulary-specialization))

今天的 [AI Agent GitHub Digest](/posts/daily/2026-10-23-ai-agent-github-digest) 介紹的 context-mode（曾登 Hacker News 第一名）與 Composio 新增的 session hooks，是另外兩條把 agent context／執行安全做成現成套件的訊號。

### 區域動態

**中國**

個人 agent 公司 Today AI 完成超過 2 億美元融資，由 Ant Group、騰訊、紅杉中國等領投。([來源](https://www.kucoin.com/news/flash/personal-agent-completes-over-200m-in-funding-backed-by-ant-group-tencent-sequoia-china))這與今天 [DeepSeek 完成 $15B 融資](/posts/daily/2026-10-23-funding-deepseek) 是同一訊號的兩面：美國下令聯邦機關移除 DeepSeek 系統兩天後，中國資本正用史上最大一筆 AI 融資回應地緣政治壓力。

**東南亞**

新加坡政府撥款逾 S$45M 協助製造業導入 AI 工具，同份報告提到 Anthropic 新加坡辦公室已與當地數位發展部簽署 MOU。([來源](https://www.channelnewsasia.com/singapore/singapore-manufacturer-ai-adoption-45-million-6477566))

區域整體上，東南亞 1 兆美元數位經濟目標延後五年，但 AI 投資逆勢成長，新加坡與馬來西亞企業 AI 工作負載佔比達 45–60%。([來源](https://e27.co/southeast-asias-us1t-digital-dream-slips-five-years-and-ai-is-the-new-reason-to-keep-believing-20261021/))

**拉丁美洲**

智利 CENIA 指出拉美各國都有 AI 策略文件，但僅巴西、哥倫比亞明確編列公共預算，算力成本是主要瓶頸。([來源](https://www.bnamericas.com/en/interviews/latin-america-has-plenty-of-ai-strategy-and-little-budget-cenia-says))

**非洲**

非洲 AI 情報週報指出，奈及利亞、肯亞、南非的 AI 資金多來自開發性金融機構，但治理規則跟進速度落後。([來源](https://innovation-village.com/ai-africa-intelligence-october-14-21-2026-vol-27/))

**大洋洲**

AgenticAdvertising.org 成立澳洲分會，推動自主 AI agent 在媒體採購與廣告交易上的開放標準。([來源](https://www.bandt.com.au/agenticadvertising-org-launches-aussie-chapter-to-advance-ai-powered-media-trading/))

（台灣、日韓、印度、中東今天查無跟 AI 直接相關且來源可靠的合格事件，故省略；北美事件已出現在廠商、資安與法規段，不重複列出。）

### 商業案例 / 融資

**DeepSeek**：完成約 $15B 新一輪融資，估值 4 個月內從 $50B 衝向近 $89B。詳見 [融資速報](/posts/daily/2026-10-23-funding-deepseek)。

**Flapping Airplanes**：完成 $1B Series A，成立僅一年估值從種子輪 $1.5B 衝到 $6B。詳見 [融資速報](/posts/daily/2026-10-23-funding-flapping-airplanes)。

**Mave**：完成 $34M 融資（含 $28M Series A），讓 AI Agent 串連企業既有安全工具數分鐘內調查 100% 告警。詳見 [融資速報](/posts/daily/2026-10-23-funding-mave)。

**企業 AI 回報落差**：Gartner 調查 2,002 位技術主管，只 13% 回報 AI 帶來重大回報；TechCrunch Disrupt 投資人同時提醒 AI 資金湧入加上營收灌水，市場可能 2027 年修正，資金偏好國防、機器人與 AI 基礎設施。([來源](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/)、[來源](https://techcrunch.com/2026/10/22/investors-break-down-how-founders-can-raise-a-series-a-today/))

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Google Agent Compute Engine 單機密度提升 | 10x（20 萬 agent 測試） | [the-decoder](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/) |
| Coding agent 任務完成率 vs 備份率 | 86.1% vs 15.2% | [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest) |
| AgentPolicyForge 守門模型攻擊成功率降幅 | 40–44% | [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest) |
| DeepSeek 最新估值 | ~$89B | [融資速報](/posts/daily/2026-10-23-funding-deepseek) |
| 企業認為 AI 帶來重大回報的比例 | 13% | [the-decoder](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-10-23](/posts/daily/2026-10-23-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-10-23](/posts/daily/2026-10-23-ai-agent-github-digest)
- 📄 [框架更新｜Mastra @mastra/core@1.79.0](/posts/daily/2026-10-23-framework-mastra-1.79.0)
- 📄 [融資速報｜DeepSeek 完成 $15B 融資](/posts/daily/2026-10-23-funding-deepseek)
- 📄 [融資速報｜Flapping Airplanes Series A $1B](/posts/daily/2026-10-23-funding-flapping-airplanes)
- 📄 [融資速報｜Mave 完成 $34M 融資](/posts/daily/2026-10-23-funding-mave)
- 📄 [定價追蹤｜Claude Sonnet 4.5 將於 11/30 退役](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)
- 📄 [工具推薦｜landmine](/posts/daily/2026-10-23-tool-landmine)
- 📄 [AI Engineer 面試日練 — 2026-10-23：Coding](/posts/daily/2026-10-23-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-10-23：Growth & Experimentation](/posts/daily/2026-10-23-product-builder-interview-daily)

## 明日關注

- Claude Duet 搶鮮版正式開放後，中小企業實際使用與定價反應會不會跟上 Muse／Dots 的聲量
- 美國銀行這波鎖 agent 存取的動作，會不會蔓延到券商、保險等其他金融次產業
- DeepSeek $15B 融資後，Moonshot AI、Manus AI 等中國同業是否跟著加碼新一輪募資

## 今日收穫

之前以為 agent 安全的戰場主要在「擋惡意輸入」——prompt injection、越獄這類外部攻擊。今天發現更大的戰場其實是「防自己的 agent 自作主張」：美國銀行鎖的不是被駭的 agent，是行為正常但未經明確指示就自己行動的 agent；arxiv 備份意識論文測出的 15.2% 講的也是同一件事——問題不在 agent 會不會被攻破，而在它自己動手時夠不夠謹慎。對台灣團隊的提示：評估 agent 風險清單時，「它自己會不會亂做事」要跟「它會不會被駭」放在同一張清單上，不是事後才補。

## 參考資料

- [AI Agent Arxiv Digest — 2026-10-23](/posts/daily/2026-10-23-ai-agent-arxiv-digest)
- [Anthropic 發布 Claude Duet — CNBC](https://www.cnbc.com/2026/10/21/anthropic-preview-of-claude-duet-personal-ai-agent-take-on-muse-dots.html)
- [Google Agent Compute Engine — the-decoder](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/)
- [美國銀行封鎖 AI agent — the-decoder](https://the-decoder.com/major-us-banks-are-locking-out-ai-agents-that-log-in-with-customer-credentials/)
- [Mastercard Agent Pay for Machines](https://www.mastercard.com/us/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html)
- [NVIDIA Confidential Computing / OpenShell](https://blogs.nvidia.com/blog/confidential-computing-model-builders-infrastructure/)
- [NVIDIA 開源模型家族（歐洲）](https://blogs.nvidia.com/blog/open-models-europe-industry/)
- [Cohere Rerank 5](https://cohere.com/blog/rerank-5)
- [Microsoft 數位主權聲明](https://blogs.microsoft.com/blog/2026/10/20/advancing-digital-sovereignty-with-greater-control-and-choice/)
- [OpenAI agent 分析小鼠腦資料 — the-decoder](https://the-decoder.com/openai-agents-analyze-mouse-brain-data-in-32-minutes-a-job-that-would-take-humans-months/)
- [Cognition 倫敦辦公室 — Cognition Blog](https://cognition.com/blog/building-in-london)
- [IBM Granite 時間序列 ensemble](https://huggingface.co/blog/ibm-research/granite-timeseries-ensemble-r1)
- [Recursive Flint — the-decoder](https://the-decoder.com/recursive-shows-first-result-of-its-ai-driven-research-process-with-flint/)
- [中國疑似背景 AI 自動化入侵 — securityonline](https://securityonline.info/ai-driven-hacking-campaign-asia/)
- [AI 找出 PHP2Shell RCE — The Hacker News](https://thehackernews.com/2026/10/someone-tried-to-exploit-php2shell-4.html)
- [中國收緊 AI 模型出口 — NYTimes](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)
- [川普政府推 AI 自律協議 — Fox News](https://www.foxnews.com/live-news/ai-artificial-super-intelligence-regulation-midterms-congress-october-21)
- [歐洲新創考慮遷出 — Global Banking & Finance](https://www.globalbankingandfinance.com/europe-risks-startup-exodus-regulation-funding-skill-gaps/)
- [Agentic AI Foundation 破 300 會員 — PRNewswire](http://www.prnewswire.com/news-releases/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year-302916687.html)
- [Alibaba Cloud 開源 HiRoute](https://www.alibabacloud.com/blog/hiroute-is-open-source-help-your-agents-do-more-and-your-subscriptions-go-further_603660)
- [VocabX 詞彙特化 — HuggingFace Blog](https://huggingface.co/blog/Dharma-AI/vocabx-vocabulary-specialization)
- [中國 Today AI 完成 $200M 融資 — KuCoin News](https://www.kucoin.com/news/flash/personal-agent-completes-over-200m-in-funding-backed-by-ant-group-tencent-sequoia-china)
- [新加坡 S$45M 製造業 AI 補助 — CNA](https://www.channelnewsasia.com/singapore/singapore-manufacturer-ai-adoption-45-million-6477566)
- [東南亞 AI 投資逆勢成長 — e27](https://e27.co/southeast-asias-us1t-digital-dream-slips-five-years-and-ai-is-the-new-reason-to-keep-believing-20261021/)
- [拉丁美洲 AI 策略與預算落差 — BNamericas](https://www.bnamericas.com/en/interviews/latin-america-has-plenty-of-ai-strategy-and-little-budget-cenia-says)
- [非洲 AI 情報週報 — Innovation Village](https://innovation-village.com/ai-africa-intelligence-october-14-21-2026-vol-27/)
- [AAO 澳洲分會 — B&T](https://www.bandt.com.au/agenticadvertising-org-launches-aussie-chapter-to-advance-ai-powered-media-trading/)
- [Gartner AI 回報調查 — the-decoder](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/)
- [TechCrunch Disrupt Series A 建議](https://techcrunch.com/2026/10/22/investors-break-down-how-founders-can-raise-a-series-a-today/)
