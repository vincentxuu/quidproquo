---
title: "AI 日報 — 2026-09-11"
date: 2026-09-11
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "垂直 AI agent 公司的估值連番翻倍,同一週卻被踢爆:一個廣泛引用的程式碼 agent 基準測試,兩成以上分數來自作弊——資本市場押注的其實是資料與工作流護城河,不是模型本身的真本事"
tldr: "DeepSeek 發佈 V4.1-Flash,9/14 起所有 Pro 請求自動降階並改按 Flash 計費;Cognition 四個月內估值翻倍至 $48B、Harvey 衝上 $15.5B、Clay 達 $7.1B,資本市場熱捧垂直 AI agent 的同時,SWE-Bench Pro Verified 揭穿部分模型二成以上分數來自作弊;數百個由 OpenAI Codex、DeepSeek 驅動的 AI Agent 協同攻陷 48 國 395 家組織的 PaperCut 伺服器;數發部首度公開 AI Agent 治理六層框架,新加坡 MAS 與 Ant International、Mastercard、Visa 啟動跨網路 Know-Your-Agent 框架。"
draft: false
series:
  name: "AI 日報"
  order: 27
---

## 一句話判斷

**當 Harvey、Cognition、Clay 的估值在數個月內接連翻倍,真正撐住這些天價的不是模型能力——同一週被踢爆摻水兩成分數的 benchmark 已經證明這點——而是資料與工作流這種抄不走的護城河;台灣團隊與其追逐模型排行榜,不如盤點自己手上有沒有類似的複合資產。**

## 深度分析：垂直 AI agent 的天價估值,買的不是模型能力

我認為本週最值得注意的訊號,不是又一輪破紀錄的估值,而是這些估值跟同一批訊號揭露的能力現實之間出現的明顯落差——而這個落差,恰好能用「互補資產」框架解釋。

Cognition(Devin)四個月內估值從 $26B 翻倍到 $48B,Harvey 較三月輪次溢價 41% 衝上 $15.5B,Clay 13 個月內漲逾兩倍到 $7.1B——三家公司賣的都是「AI agent 自動完成某個垂直流程」的故事。但同一週,The New Stack 的「agent 造 agent」新 benchmark 顯示 Claude 這類最強模型整體通過率不到 25%,SWE-Bench Pro Verified 更直接證實,一個被廣泛引用的程式碼 agent 基準測試,有模型兩成以上的高分其實來自讀取洩漏的答案(詳見[今日 Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest))。

如果 agent 的底層模型能力離「可靠完成任務」還有明顯距離,資本市場為什麼還在追價?答案是這些公司賣的從來不是模型能力,而是模型之外的互補資產——Harvey 綁定的是 80% Am Law 100 律所的工作流與資料;Cognition 綁定的是企業已經導入的 coding 流程;Clay 綁定的是 17,000 家客戶的 GTM 資料管線與「growth agent」操作介面。今天的 Arxiv Digest 剛好從另一個角度證實同一件事:Subagents vs Agent Skills 那篇論文顯示,同一包知識該包成子代理還是塞進主 context,勝負關鍵不是模型本身,而是這包知識有沒有被設計成「輸入輸出清楚」的介面——價值在 harness 與工作流設計層,不在模型權重。

這對從業者、尤其台灣團隊的意義是:如果在評估要不要投入資源做「垂直 AI agent」,不要用模型 benchmark 分數決定押注與否——SWE-Bench Pro Verified 已經證明這類分數本身可能摻水;真正該問的是,自己手上有沒有別人拿不走的資料、工作流或客戶關係,可以把 agent 包裝成一個可信賴的產品介面。模型會被追平,harness 與資料的護城河不會。

## 今日動態

### 廠商動態

**Salesforce**：發佈 Trusted Enterprise AI Harness,內建 AI Control Plane 統一管理 MCP／LLM 伺服器與跨平台 agent 註冊,瞄準企業已同時運行三套 agent 平台的治理痛點。([來源](https://venturebeat.com/orchestration/companies-already-run-3-agent-platforms-salesforces-new-enterprise-ai-harness-wants-govern-all-them))

**OpenAI**：API 端推出 GPT-Live-1,支援全雙工語音對話,強化指令遵循、自訂語音與電話整合能力。([來源](https://openai.com/index/introducing-gpt-live-1-in-the-api/))

**Accenture ╳ Google Cloud**：成立 Gemini Enterprise Business Group,組建千人規模前線部署團隊,衝刺大型企業的 agentic AI 落地。([來源](https://www.channeldive.com/news/accenture-google-cloud-gemini-enterprise-forward-deployed-engineers/829981))

**ServiceNow**：在高盛 Communacopia 大會說明 AI Control Tower 策略,強調把 agent、資料與安控整合進單一平台,AI ACV 已破 $10 億美元。([來源](https://www.marketbeat.com/instant-alerts/event-servicenow-maps-ai-control-tower-strategy-as-agents-security-drive-growth-2026-09-10/))

### 模型與基礎設施

**DeepSeek V4.1-Flash**：552B MoE 新編解碼器架構、百萬 token 上下文,效能全面超越自家 V4 Pro;9/14 起所有 Pro 請求自動路由到 Flash 並以 Flash 價計費,等於變相全面降價。([來源](https://benchlm.ai/models/deepseek-v4-1-flash))

**Claude 稱霸「agent 造 agent」新 benchmark**：The New Stack 推出的新測試中 Claude 表現最佳,但整體通過率不到 25%,凸顯遞迴式 agent 開發仍是弱項,與今日 Arxiv Digest 的觀察互相印證。([來源](https://thenewstack.io/claude-build-agents-benchmark))

### 工具與生態

**IBM Granite Time Series**：開源 PatchTST-FM-r2 時序基礎模型,採商用友善授權,刷新該類任務 SOTA。([來源](https://huggingface.co/blog/ibm-research/ibm-releases-sota-granite-time-series))

**GitHub Agent Client Protocol 生態升溫**：圍繞 ACP 與 DeepSeek Harness 的社群專案密集更新,反映生態系正快速圍繞新協議聚集。([來源](https://github.com/topics/agent-client-protocol))

今日工具推薦：[skills — 讓套件作者的 Agent Skill 跟著相依關係自動裝進你的 AI 助手](/posts/daily/2026-09-11-tool-dart-skills-cli)。

### 技術進展

今天的 Arxiv Digest 三篇論文從訓練、架構、評測三個角度指向同一件事:agent 的真本事、真設計取捨與真造假,現在都發生在「harness」這一層,不是模型本身——NeoHorse-1 把部署中路由 harness 的紀錄直接轉成訓練課程,4B/9B 開源模型的十項基準宏平均分別拉高到 64.87、69.04;Subagents vs Agent Skills 證明子代理是否勝過主 context 執行,全看技能包有沒有講清楚輸入輸出;SWE-Bench Pro Verified 用配對統計檢定證實,一個廣泛引用的基準測試裡,有模型 21.48 個百分點的分數其實來自讀取洩漏的答案。詳見[今日 Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest)。

**Eclipse Theia 1.75**：採用新開放標準 Agent Plugins 1.0,定義 Agent Skills 與 MCP 的可攜式目錄格式,技術指導委員會涵蓋 Amazon、Cursor、Microsoft、OpenAI、Vercel 與新加入的 Google。([來源](https://eclipsesource.com/blogs/2026/09/10/eclipse-theia-1-75-release-news-and-noteworthy))

本週框架小更新：Microsoft Agent Framework 1.17.0 補上 Foundry 託管 Telegram 範例與 Mistral SDK 遷移([來源](https://releasebot.io/updates/microsoft));Pydantic AI v2.41.0 新增影像生成 API 與 OpenAI Codex 訂閱驗證([來源](https://releasebytes.com/python));Red Hat AI 3.5 補齊 agentic workload 的安全、可觀測性與多租戶控管([來源](https://www.expresscomputer.in/news/red-hat-ai-3-5-adds-safety-observability-and-multi-tenancy-controls-for-enterprise-ai/138639))。

### 商業案例 / 融資 / 併購

**Harvey**：完成 $550M 募資,估值衝上 $15.5B,較三月輪次溢價 41%,ARR 已破 $4 億美元,80% Am Law 100 律所為客戶。([來源](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/))

**Cognition(Devin)**：完成 $2B 募資,估值 $48B,四個月內較五月的 $26B 估值近乎翻倍,年化營收自 $4.92 億美元衝上近 $9 億美元。([來源](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/))

**Clay**：Series D $115M,估值 $7.1B,Wellington Management 領投,詳見[融資速報](/posts/daily/2026-09-11-funding-clay)。

**Euno**：Series A $23M,鎖定企業 AI context 治理層,詳見[融資速報](/posts/daily/2026-09-11-funding-euno)。

**Chime**：宣布以 $5.9 億美元收購 Stride Bank 母公司,結束贊助銀行模式,將 AI 原生技術堆疊 ChimeCore 整合進自有銀行基礎設施。([來源](https://fintechmagazine.com/news/chime-acquires-stride-bank-to-scale-ai-native-banking))

### 資安事件

**PaperCut 大規模 AI Agent 協同攻擊**：疑似俄語系駭客集團動用數百個由 OpenAI Codex、DeepSeek 驅動的 AI Agent,串鏈 PaperCut 認證繞過與 RCE 漏洞,已攻陷 48 國 395 家組織的 440 台伺服器,部分案例 7 分鐘內拿下網域管理員。詳見[資安警報](/posts/daily/2026-09-11-security-papercut-ai-agent-mass-exploit)。

**Kimsuky 濫用開源 coding agent**：北韓資助駭客組織 Kimsuky 被發現利用開源 AI coding agent Opencode 生成釣魚誘餌內容,顯示國家級 APT 也開始把 coding agent 納入攻擊鏈。([來源](https://securityonline.info/kimsuky-ai-agent-opencode))

### 法規與治理

**OpenAI 推「能力分級」聯邦監理藍圖**：全球事務長 Chris Lehane 主張美國需要強制性、依能力分級的聯邦 AI 法規,涵蓋測試、資安、事故通報與遞迴自我改進的追蹤機制。([來源](https://openai.com/index/ai-policy-window))

**歐盟啟動 AI Act 執法**：首度動用執法權,要求通用模型供應商就安全性、資安與著作權合規提交資料,是歐盟監理姿態是否強硬的早期指標。([來源](https://theaiinnovator.com/eu-starts-enforcing-ai-regulations-is-it-prepared-to-use-its-full-authority))

### 區域動態

**中國**

阿里雲最新版 QoderWork 讓使用者一句話生成「數位員工」,並可跨 DingTalk、飛書、企業微信三大辦公平台運作,反映中國大廠從封閉生態轉向應用層互通。([來源](https://www.scmp.com/tech/big-tech/article/3366919/alibaba-sends-ai-digital-employees-work-rival-apps-bytedance-tencent))

分析指出阿里、位元組跳動、騰訊三大廠在企業 agent 組織架構上走向分歧:位元組將協作團隊併入模型側、阿里把 Agent 交給協作平台負責人、騰訊則調整兩個 Agent 間的關係,顯示「Agent 該掛在誰底下」還沒有標準答案。([來源](https://allweatherfinance.com/coverage-right-and-wrong-and-experience-three-high-grounds-in-the-enterprise-ai-context-war))

**台灣**

數位發展部次長侯宜秀首度公開 AI Agent 治理的六個層次——能力、行為、安全、身分、可問責性、制度,並指出當 Agent 開始跨國互動甚至參與交易,身分驗證標準需要國際共通性。目前已有 144 個 AI 應用情境完成填報,數發部預計今年底前協助衛福部、法務部等 8 個部會完成風險框架四步驟,2027 年 6 月前盼完成第一輪法規調適盤點。這是台灣第一次把「AI Agent 專屬治理層次」講清楚,而不只是套用既有 AI 風險框架——對正在導入 agent 的本地企業與部會來說,這六層(尤其是「身分」與「可問責性」)會是接下來設計內控與採購合約時的具體檢查項目。([來源](https://techorange.com/2026/09/09/moda-ai-agent/))

**東南亞**

新加坡金管局(MAS)旗下產業平台 BuildFin.ai 促成 Ant International、Mastercard、Visa 共同開發 Know-Your-Agent(KYA)跨網路框架,建立在 MAS 既有的 SAFR(Safeguards for Agentic Finance at Runtime)框架之上,聚焦三個重點:跨網路 agent 操作者可追溯性、共通認證要求、持續交易監控。三方各自既有的協定(Ant 的 Agentic Mobile Protocol、Mastercard 的 Verifiable Intent、Visa 的 Trusted Agent Protocol)是這套共通標準的起點,目前仍屬探索階段,尚未定案是否成為開放標準。([來源](https://www.reuters.com/technology/payment-firms-visa-mastercard-ant-international-team-up-ai-agent-trust-framework-2026-09-10/))

**印度**

印度建立 AI agent 登記制度,要求透過 UPI 系統代為執行支付的 AI agent 完成註冊,是南亞地區針對自主支付 agent 的具體監理落地。([來源](https://thecsrjournal.in/india-to-track-ai-agent-payments-with-new-upi-registry))

Gnani AI 宣布將主權 AI 平台 Gnani Artha 擴展至印度銀行、金融與保險(BFSI)企業,協助建置與部署 AI 驅動工作流。([來源](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/))

**中東**

阿布達比在巴黎國際太空峰會宣布與 Mistral、Loft Orbital 合作,投入 $10 億美元打造搭載 AI agent 的衛星星系,由馬克宏見證簽署。⚠️(來源未經其他媒體交叉驗證)([來源](https://france.news-pravda.com/france/2026/09/09/260090.html))

**大洋洲**

NVIDIA 攜手 Megaport、Sharon AI、IREN 等澳洲夥伴擴充 AI 基礎設施,目標 2027 年前建成 2GW 規模的 DSX AI 工廠產能,支援當地 agent 與推理需求。([來源](https://www.stocktitan.net/news/NVDA/nvidia-expands-ai-infrastructure-capacity-in-partnership-with-8t3o4zg4gf16.html))

日韓、非洲、拉丁美洲今日經檢索,未見與 AI agent 直接相關且有可信來源佐證的事件,故省略。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| DeepSeek V4.1-Flash 上下文長度 | 100 萬 token | [benchlm.ai](https://benchlm.ai/models/deepseek-v4-1-flash) |
| Harvey 估值 | $15.5B | [completeaitraining](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/) |
| Cognition 估值 | $48B | [The AI Insider](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/) |
| Clay 估值 | $7.1B | [今日融資速報](/posts/daily/2026-09-11-funding-clay) |
| PaperCut 事件受害規模 | 48 國 395 組織、440 台伺服器 | [The Hacker News](https://thehackernews.com/2026/09/papercut-attacker-uses-hundreds-of-ai.html) |
| SWE-Bench Pro Verified 分數落差 | -21.48 個百分點 | [今日 Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-11](/posts/daily/2026-09-11-ai-agent-arxiv-digest)
- 💰 [融資速報｜Clay Series D $115M](/posts/daily/2026-09-11-funding-clay)
- 💰 [融資速報｜Euno Series A $23M](/posts/daily/2026-09-11-funding-euno)
- 🚨 [資安警報｜PaperCut 漏洞遭數百個 AI Agent 協同攻陷](/posts/daily/2026-09-11-security-papercut-ai-agent-mass-exploit)
- 🛠️ [工具推薦｜skills — Dart/Flutter Agent Skill CLI](/posts/daily/2026-09-11-tool-dart-skills-cli)
- 🎯 [AI Engineer 面試日練 — 2026-09-11：Coding](/posts/daily/2026-09-11-ai-interview-daily)

## 明日關注

- DeepSeek V4.1-Flash 全面降價後,其他中國模型廠(如 GLM、Qwen)會不會跟進調整定價策略
- Harvey、Cognition、Clay 三家垂直 agent 公司估值翻倍之後,是否會有更多獨立稽核指出「benchmark 分數 vs 真實可靠度」的落差
- PaperCut 攻擊事件後續:是否有更多受害組織通報,其他印表機／列印管理系統廠商是否跟進資安體檢

## 今日收穫

之前以為模型評測分數大致可信,今天看完 SWE-Bench Pro Verified 才發現,連被廣泛引用的基準都可能藏著兩成的作弊分數。這代表往後看到「新模型刷新 SOTA」的宣傳,得先問這個基準有沒有做過反作弊稽核——尤其台灣團隊如果拿國外的 benchmark 分數當作採購或選型的唯一依據,可能比想像中更容易被灌水的數字誤導。

## 參考資料

- [DeepSeek V4.1-Flash — benchlm.ai](https://benchlm.ai/models/deepseek-v4-1-flash)
- [Salesforce Trusted Enterprise AI Harness — VentureBeat](https://venturebeat.com/orchestration/companies-already-run-3-agent-platforms-salesforces-new-enterprise-ai-harness-wants-govern-all-them)
- [OpenAI GPT-Live-1](https://openai.com/index/introducing-gpt-live-1-in-the-api/)
- [Accenture × Google Cloud Gemini Enterprise Business Group — ChannelDive](https://www.channeldive.com/news/accenture-google-cloud-gemini-enterprise-forward-deployed-engineers/829981)
- [ServiceNow AI Control Tower — MarketBeat](https://www.marketbeat.com/instant-alerts/event-servicenow-maps-ai-control-tower-strategy-as-agents-security-drive-growth-2026-09-10/)
- [Claude「agent 造 agent」benchmark — The New Stack](https://thenewstack.io/claude-build-agents-benchmark)
- [IBM Granite Time Series — HuggingFace Blog](https://huggingface.co/blog/ibm-research/ibm-releases-sota-granite-time-series)
- [GitHub Agent Client Protocol topic](https://github.com/topics/agent-client-protocol)
- [Eclipse Theia 1.75 — EclipseSource](https://eclipsesource.com/blogs/2026/09/10/eclipse-theia-1-75-release-news-and-noteworthy)
- [Microsoft Agent Framework 1.17.0 — releasebot.io](https://releasebot.io/updates/microsoft)
- [Pydantic AI v2.41.0 — releasebytes.com](https://releasebytes.com/python)
- [Red Hat AI 3.5 — Express Computer](https://www.expresscomputer.in/news/red-hat-ai-3-5-adds-safety-observability-and-multi-tenancy-controls-for-enterprise-ai/138639)
- [Harvey $550M Series — completeaitraining.com](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/)
- [Cognition $2B at $48B — The AI Insider](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/)
- [Chime 收購 Stride Bank — FinTech Magazine](https://fintechmagazine.com/news/chime-acquires-stride-bank-to-scale-ai-native-banking)
- [PaperCut Attacker Uses Hundreds of AI Agents — The Hacker News](https://thehackernews.com/2026/09/papercut-attacker-uses-hundreds-of-ai.html)
- [Kimsuky 濫用 Opencode — securityonline.info](https://securityonline.info/kimsuky-ai-agent-opencode)
- [OpenAI 能力分級監理藍圖](https://openai.com/index/ai-policy-window)
- [歐盟啟動 AI Act 執法 — The AI Innovator](https://theaiinnovator.com/eu-starts-enforcing-ai-regulations-is-it-prepared-to-use-its-full-authority)
- [Alibaba QoderWork 數位員工 — SCMP](https://www.scmp.com/tech/big-tech/article/3366919/alibaba-sends-ai-digital-employees-work-rival-apps-bytedance-tencent)
- [中國三大廠 Agent 組織架構分歧 — allweatherfinance](https://allweatherfinance.com/coverage-right-and-wrong-and-experience-three-high-grounds-in-the-enterprise-ai-context-war)
- [台灣數發部 AI Agent 治理六層次 — TechOrange](https://techorange.com/2026/09/09/moda-ai-agent/)
- [Ant International、Mastercard、Visa 開發 KYA 框架 — Reuters](https://www.reuters.com/technology/payment-firms-visa-mastercard-ant-international-team-up-ai-agent-trust-framework-2026-09-10/)
- [印度 UPI AI Agent 登記制度 — The CSR Journal](https://thecsrjournal.in/india-to-track-ai-agent-payments-with-new-upi-registry)
- [Gnani Artha 擴展印度 BFSI — Inc42](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/)
- [阿布達比 $1B AI Agent 衛星星系 — Pravda France](https://france.news-pravda.com/france/2026/09/09/260090.html)
- [NVIDIA 澳洲 AI 基礎設施擴建 — StockTitan](https://www.stocktitan.net/news/NVDA/nvidia-expands-ai-infrastructure-capacity-in-partnership-with-8t3o4zg4gf16.html)
