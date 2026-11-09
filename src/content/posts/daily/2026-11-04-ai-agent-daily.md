---
title: "AI 日報 — 2026-11-04"
date: 2026-11-04
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "CrowdStrike 同時收購可觀測性公司 Fiddler AI 與紅隊公司 Dreadnode、推出 AI Kill Switch，跟 Gemini 4 Carbon 以一分之差超車 Claude Opus 5.5 放在一起看——模型能力的差距已經小到可忽略，真正的護城河正在往治理與安全層下沉"
tldr: "Gemini 4 Carbon 在 Artificial Analysis Intelligence Index V5 以一分之差超越 Claude Opus 5.5，並宣稱是最不容易產生幻覺的前沿模型；CrowdStrike 以約 4.95 億美元收購 agent 可觀測性公司 Fiddler AI 與紅隊公司 Dreadnode，在 Falcon Guardian 推出 AI Kill Switch；香港金管局啟動 Project SAGE 金融業 agent 治理框架，阿布達比 ADNOC 與 OpenAI、G42 簽約部署主權 agent 平台；Salesforce 同意收購客服 AI agent 公司 Cresta，Tutor Intelligence 完成 7,500 萬美元 Series B 把機器人工人按工時計費賣給工廠"
draft: false
series:
  name: "AI 日報"
  order: 81
---

> 🌏 [English version](/posts/daily/2026-11-04-ai-agent-daily-en)

## 一句話判斷

**模型能力的差距已經被壓縮到一分之內可忽略的範圍，今天同時發生的資安併購與主權治理佈局，說明 agent 產業的護城河正在從「誰的模型最聰明」搬去「誰掌控治理與安全層」。**

## 深度分析：模型只差一分時，護城河在治理層

我認為今天的模型新聞跟資安併購新聞合起來看，指向同一件事：模型能力差距正被壓縮到可忽略，護城河正搬去治理與安全層。（框架：轉換成本）

Gemini 4 Carbon 以一分之差超越 Claude Opus 5.5，還宣稱最不容易產生幻覺——頂尖模型差距已小到可忽略，換模型的轉換成本接近零。同一天，CrowdStrike 以約 4.95 億美元收購可觀測性公司 Fiddler AI 與紅隊公司 Dreadnode，整合進 Falcon Guardian 推出 AI Kill Switch。這比的不是模型聰明度，是誰能在 agent 失控時一鍵關掉——企業一旦把稽核、監控、緊急終止嵌進同一平台，要換掉的是整套治理關係，轉換成本遠高於換模型。

香港金管局 Project SAGE、阿布達比 ADNOC 與 OpenAI／G42 的主權 agent 協議，是同一邏輯的政府版：「認識你的 agent」機制與主權基礎設施，都在幫治理層築牆，不是在追模型分數。對從業者，agent 產品的護城河該往可觀測性、稽核軌跡、緊急終止這些治理原語紮根，接最新模型不再是持久優勢。

對台灣讀者：採購 agent 時該優先問「能不能稽核、能不能一鍵終止」，不是「benchmark 排第幾」——金融、醫療這類受監管產業，治理能力才是真正門檻，一分之差的模型分數在實務上幾乎沒意義。

```diagram
title: 安全能力被收編進同一個治理平台，護城河從「選模型」搬到「選治理層」
desc: 由上往下三格分別是模型選擇、Fiddler AI 的可觀測性、Dreadnode 的紅隊測試，原本各自獨立；CrowdStrike 的收購把後兩者一次性收進 Falcon Guardian，推出 AI Kill Switch，變成同一個鎖定點。
caption: 模型層的一分之差幾乎可忽略；安全層的轉換成本在收購後被整合進單一平台，反而升高。
---
<svg viewBox="0 0 440 330">
  <rect class="dg-box dg-box--warn" x="56" y="18" width="328" height="72" rx="6"/>
  <text class="dg-label" x="76" y="46" dominant-baseline="central">模型選擇</text>
  <text class="dg-sub" x="76" y="70" dominant-baseline="central">縫隙：Gemini 4 Carbon 僅贏 Opus 5.5 一分，可替換</text>
  <text class="dg-sub" x="368" y="46" text-anchor="end" dominant-baseline="central">表象：挑最聰明的模型</text>

  <rect class="dg-box dg-box--warn" x="56" y="100" width="328" height="72" rx="6"/>
  <text class="dg-label" x="76" y="128" dominant-baseline="central">Fiddler AI（可觀測性）</text>
  <text class="dg-sub" x="76" y="152" dominant-baseline="central">縫隙：被 CrowdStrike 收購，不再獨立</text>
  <text class="dg-sub" x="368" y="128" text-anchor="end" dominant-baseline="central">表象：獨立監控 agent 行為</text>

  <rect class="dg-box dg-box--warn" x="56" y="182" width="328" height="72" rx="6"/>
  <text class="dg-label" x="76" y="210" dominant-baseline="central">Dreadnode（紅隊）</text>
  <text class="dg-sub" x="76" y="234" dominant-baseline="central">縫隙：同日被收購，整合進同一平台</text>
  <text class="dg-sub" x="368" y="210" text-anchor="end" dominant-baseline="central">表象：獨立紅隊測試 agent 安全</text>

  <rect class="dg-box dg-box--accent" x="56" y="264" width="328" height="56" rx="6"/>
  <text class="dg-label dg-text--invert" x="76" y="292" dominant-baseline="central">Falcon Guardian + AI Kill Switch</text>
  <text class="dg-sub dg-text--invert" x="368" y="292" text-anchor="end" dominant-baseline="central">企業買的是能不能一鍵關掉</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| Snowflake | Expedition 2026 發表 Business Ontology 與 Cortex AI Gateway，讓 Glean、Kargo 等企業用統一業務定義與治理層約束所有 AI agent | [Snowflake](https://www.snowflake.com/en/news/press-releases/expedition-2026-business-ontology-ai-gateway) |
| AWS | 每週回顧：OpenAI GPT-6.1 Terra 上線 Amazon Bedrock，Step Functions 可作為 agent 工具 | [AWS Blog](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-gpt-6-1-terra-on-bedrock-step-functions-as-agent-tools-and-more-november-2-2026/) |
| OpenAI × Cathedral | 延續先前投入四分之一產品工程人力的安全衝刺，與資安研究公司 Cathedral 合作，用 Codex 調查漏洞並修補系統 | [Devdiscourse](https://www.devdiscourse.com/article/business/4001024-openai-partners-with-security-firms-to-strengthen-ai-powered-cyber-defence) |
| Apple | 計畫 11 月為 Creator Studio 訂閱者的 Keynote、Pages、Numbers 加入 AI 助理，並開放 Claude、ChatGPT 等外部 agent 在應用內運作 | [LinkedIn 週報](https://www.linkedin.com/pulse/ai-newsflash-october-26-november-1-2026-agents-out-its-mendiratta-4d8nc) |
| Honeycomb | 推出 Team Agents，依團隊設定目標主動監控發佈、觀測、成本與 agent 品質，依風險等級自主處理事故 | [Honeycomb Blog](https://www.honeycomb.io/blog/honeycomb-team-agents-ai-sre-done-right) |
| Teamily AI | 單季註冊使用者從 1 萬成長到 32 萬（32 倍），公開上線三個月即達成正毛利，服務逾 100 個國家使用者 | [AFP](https://www.afp.com/en/agency/inside-afp/external-press-releases/teamily-ai-reports-32-quarterly-user-growth-positive) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| Gemini 4 Carbon | 在 Artificial Analysis Intelligence Index V5 以一分之差超越 Claude Opus 5.5，宣稱是目前最不容易產生幻覺的前沿模型 | [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/google-reveals-new-gemini-4-carbon-ai-model-narrowly-beating-claude-opus-5-5-frontier-ai-model-is-also-the-least-likely-to-hallucinate-benchmarks-claim) |
| Ai2 StateBench | Allen Institute for AI 發佈新基準，評測語言模型在長任務中追蹤與維護狀態的能力 | [Ai2 Blog](https://allenai.org/blog/statebench) |

### 定價與 API 生命週期

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| Google Gemini | Developer API 補上 `gemini-2.5-pro`／`gemini-2.5-flash` 的停用日（2026-12-01），過期自動轉導新模型並按新費率計費，2.5 Pro 轉導後即使等促銷結束仍比原價省 12.7%，細節見[今日定價追蹤](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset) | [今日定價追蹤](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset) |

### 工具與生態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| GitHub Digest 焦點 | 今天四個 trending repo 一半擴張 agent 自主範圍（自動接 GitHub issue 的 coding agent、手機背景操控 App）、一半在收拾善後（裝 skill 前先掃漏洞、把工具輸出壓進 context），詳見[今日 GitHub Digest](/posts/daily/2026-11-04-ai-agent-github-digest) | [今日 GitHub Digest](/posts/daily/2026-11-04-ai-agent-github-digest) |
| Verdict | 197 KB 本地分類器讀 command／exit code／stdout／stderr 四項輸入，判斷一次 CLI 呼叫是否真的成功，訓練時未見過的 CLI 家族上準確率 93.2%（純 exit code 僅 47.9%），詳見[今日工具推薦](/posts/daily/2026-11-04-tool-verdict) | [今日工具推薦](/posts/daily/2026-11-04-tool-verdict) |
| Cohere Model Vault | 讓企業能在自己掌控的環境中部署開源模型，強調資料主權與可稽核性 | [Cohere Blog](https://cohere.com/blog/open-source-model-vault) |
| Agentgateway | 開源 Rust MCP 代理，依 CEL 規則與 JWT claims 控制不同 agent 能看到、呼叫哪些 MCP 工具 | [Towards AI](https://pub.towardsai.net/your-ai-agents-see-every-mcp-tool-agentgateway-lets-you-hide-them-0705d9511639) |
| cve-intel | 開源專案整合 40 個資料來源與 41 項工具，為 CVE 分級並提供 agent 可用的 MCP server，預設不外傳資料 | [GitHub](https://github.com/Fazmin/cve-intel) |
| NVIDIA Holoscan | SETI 研究所與 Breakthrough Listen 用 Holoscan 讓 AI agent 即時操控艾倫望遠鏡陣列，首次以 AI 即時偵測到蟹狀星雲脈衝星訊號 | [The Decoder](https://the-decoder.com/ai-agents-take-over-at-setis-allen-telescope-array-scanning-for-extraterrestrial-intelligence/) |

### 技術進展

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| NVIDIA Workload Map | DSX AI Factory 平台新增工具，協助生態系更快設計、建置並維運 AI 工廠，支援新框架 | [NVIDIA Developer Blog](https://developer.nvidia.com/blog/support-new-ai-frameworks-faster-using-nvidia-workload-map/) |
| Pydantic AI v2.65.0 | 新增 `ConversationStore` 把對話存成只寫一次的訊息日誌，`ModelFallback` 現在能接住模型拒答，詳見[今日框架更新](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0) | [今日框架更新](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0) |

### 商業案例 / 融資 / 併購

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| CrowdStrike | 以約 4.95 億美元收購 agent 可觀測性公司 Fiddler AI 與紅隊公司 Dreadnode，在 Falcon Guardian 推出 AI Kill Switch 緊急終止異常 agent | [CrowdStrike IR](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-delivers-ai-security-and-safety-enterprise) |
| Salesforce | 同意收購客服導向的 AI agent 公司 Cresta | [行銷科技日報](https://agilebrandguide.com/yesterdays-marketing-technology-ai-news-november-3-2026/) |
| 阿布達比 ADNOC × OpenAI × G42 | 簽署多年協議，在 G42 主權基礎設施上部署 OpenAI Frontier agent 平台，從油田作業延伸到商業決策 | [Forbes](https://www.forbes.com/sites/guneyyildiz/2026/11/03/adnocs-openai-deal-takes-ai-from-the-oilfield-into-commercial-decisions) |
| 卡達投資局 Qai | 推出 200 億美元 AI 基礎設施夥伴計畫，加上沙烏地、阿聯過去一年逾 1,200 億美元 AI 投資計畫 | [The National News](https://www.thenationalnews.com/business/markets/2026/11/03/exclusive-eqt-joint-deals-saudi-uae-sovereign-investors) |
| Fal | 圖像／影片／音訊推理服務商估值從 80 億美元翻倍至 160 億美元，Bessemer 領投 | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-03/ai-inference-startup-fal-raises-capital-at-16-billion-valuation) |
| Trajectory | 以持續學習（continual learning）技術完成 4,500 萬美元 A 輪，估值 3 億美元，Sequoia 領投 | [TechCrunch](https://techcrunch.com/2026/11/02/trajectory-raises-45m-to-make-ai-model-training-accessible-to-nontechnical-experts) |
| Tutor Intelligence | 完成 7,500 萬美元 Series B（累計 1.17 億美元），把機器人工人按工時計費賣給工廠與物流商，詳見[今日融資速報](/posts/daily/2026-11-04-funding-tutor-intelligence) | [今日融資速報](/posts/daily/2026-11-04-funding-tutor-intelligence) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| 中東 | 阿布達比 ADNOC 與 OpenAI、G42 簽約部署主權 agent 平台；卡達投資局 Qai 投入 200 億美元 AI 基建；杜拜 DIFC 進駐逾 2,000 家 AI 與金融科技公司（詳見上方商業案例） |
| 香港／中國 | 金管局 Project SAGE 規劃銀行 agentic AI 監理與「認識你的 agent」機制；EX.IO Lab 在銀行沙盒展示串接轉帳與投資的 agentic 支付概念（[PR Newswire](https://www.prnewswire.com/apac/news-releases/exio-lab-showcases-agentic-payment-proof-of-concept-at-hong-kong-fintech-week-linking-bank-transfers-to-investments-302927616.html)） |
| 非洲 | 南非 2026 年迄今核心 AI 輪次揭露金額約 5,500 萬美元，近埃及（約 2,200 萬美元）的 2.5 倍，兩國加肯亞、奈及利亞合計佔非洲揭露 AI 資金近全部（[LaunchBase Africa](https://launchbaseafrica.com/2026/11/03/south-africa-and-egypt-contest-africas-ai-funding-crown)） |
| 歐洲 | 歐盟將與擬議中 EU KIDS Act 重疊的各國草案延後 12 個月生效，同時就量子技術立法達成協議（[PAM Digest](https://pam.int/daily-digest-on-ai-and-emerging-technologies-3-november-2026)） |
| 日韓 | 南韓 2027 預算提案投入 21.3 兆韓元於半導體、physical AI 與資料中心，另編 4.7 兆韓元自研 AI 模型；Anthropic 傳將向日本投資人出售至多 35 億美元股份備戰 IPO（當日補掃，[Tech Startups](https://techstartups.com/2026/11/02/top-tech-news-today-november-2-2026-the-biggest-stories-in-ai-startups-and-big-tech)） |
| 拉丁美洲 | 歐盟—拉美（EU-LAC）超算網路計畫在 Global Gateway Forum 啟動，強化雙方 AI 與超算能力互通（當日補掃，[HPCwire](https://www.hpcwire.com/off-the-wire/bsc-leads-european-latin-american-ai-and-supercomputing-initiative)） |
| 東南亞／大洋洲 | 當日補掃未找到直接相關且達標的 AI agent 專屬新聞，暫缺 |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| CrowdStrike 收購 Fiddler AI + Dreadnode | 約 4.95 億美元 | [CrowdStrike IR](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-delivers-ai-security-and-safety-enterprise) |
| Fal 估值 | 80 億美元 → 160 億美元（翻倍） | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-03/ai-inference-startup-fal-raises-capital-at-16-billion-valuation) |
| 卡達 Qai AI 基建基金 | 200 億美元 | [The National News](https://www.thenationalnews.com/business/markets/2026/11/03/exclusive-eqt-joint-deals-saudi-uae-sovereign-investors) |
| Tutor Intelligence Series B | 7,500 萬美元（累計 1.17 億美元） | [今日融資速報](/posts/daily/2026-11-04-funding-tutor-intelligence) |
| Gemini 2.5 Pro 轉導 3.8 Flash 成本變化 | 12 月促銷降 56.4%／2027 起標準價仍降 12.7% | [今日定價追蹤](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset) |
| Verdict 分類器準確率 | 93.2%（純 exit code 基準僅 47.9%） | [今日工具推薦](/posts/daily/2026-11-04-tool-verdict) |

## 今日 Digest 一覽

- 📄 [AI Agent GitHub Digest — 2026-11-04](/posts/daily/2026-11-04-ai-agent-github-digest)
- 📄 [框架更新｜Pydantic AI v2.65.0](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0)
- 📄 [融資速報｜Tutor Intelligence Series B $75M](/posts/daily/2026-11-04-funding-tutor-intelligence)
- 📄 [定價追蹤｜Gemini 2.5 Pro／Flash 補上 Developer API 停用日](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)
- 📄 [工具推薦｜Verdict](/posts/daily/2026-11-04-tool-verdict)
- 📄 [AI Engineer 面試日練 — 2026-11-04](/posts/daily/2026-11-04-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-11-04](/posts/daily/2026-11-04-product-builder-interview-daily)

## 明日關注

- CrowdStrike 收購 Fiddler AI／Dreadnode 後，Palo Alto Networks、Microsoft 等對手是否跟進收購獨立的 agent 安全新創。
- 香港 Project SAGE「認識你的 agent」框架細節何時公布，會不會被其他亞洲監管機構（如台灣金管會）參考。
- Salesforce 收購 Cresta 後，客服 AI agent 賽道還剩多少獨立公司沒被整併。

## 今日收穫

之前以為「用真實使用訊號持續進步」只是軟體 agent 的玩法，今天看 Tutor Intelligence 的 7,500 萬美元 Series B 才意識到，這套邏輯已經被完整複製到機器人硬體上——先把機器人工人部署到產線按工時計費賺錢，再用每一次真實操作的資料回頭訓練機器人基礎模型，物理世界也開始有自己的訓練飛輪。

## 參考資料

- [AI Agent GitHub Digest — 2026-11-04](/posts/daily/2026-11-04-ai-agent-github-digest)
- [框架更新｜Pydantic AI v2.65.0](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0)
- [融資速報｜Tutor Intelligence Series B $75M](/posts/daily/2026-11-04-funding-tutor-intelligence)
- [定價追蹤｜Gemini 2.5 Pro／Flash 補上 Developer API 停用日](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)
- [工具推薦｜Verdict](/posts/daily/2026-11-04-tool-verdict)
- [Gemini 4 Carbon narrowly beats Claude Opus 5.5 — Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/google-reveals-new-gemini-4-carbon-ai-model-narrowly-beating-claude-opus-5-5-frontier-ai-model-is-also-the-least-likely-to-hallucinate-benchmarks-claim)
- [CrowdStrike delivers AI security and safety enterprise — CrowdStrike IR](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-delivers-ai-security-and-safety-enterprise)
- [Hong Kong Monetary Authority launches Project SAGE — AI Chat Daily](https://www.aichatdaily.com/ai-security/hong-kong-monetary-authority-launches-project-sage-govern)
- [ADNOC's OpenAI deal takes AI from the oilfield into commercial decisions — Forbes](https://www.forbes.com/sites/guneyyildiz/2026/11/03/adnocs-openai-deal-takes-ai-from-the-oilfield-into-commercial-decisions)
- [Qatar sovereign fund's $20B Qai AI infrastructure plan — The National News](https://www.thenationalnews.com/business/markets/2026/11/03/exclusive-eqt-joint-deals-saudi-uae-sovereign-investors)
- [South Africa and Egypt contest Africa's AI funding crown — LaunchBase Africa](https://launchbaseafrica.com/2026/11/03/south-africa-and-egypt-contest-africas-ai-funding-crown)
- [EU delays national laws overlapping with EU KIDS Act — PAM Digest](https://pam.int/daily-digest-on-ai-and-emerging-technologies-3-november-2026)
- [South Korea's 2027 budget AI investment, Anthropic's Japan share sale — Tech Startups](https://techstartups.com/2026/11/02/top-tech-news-today-november-2-2026-the-biggest-stories-in-ai-startups-and-big-tech)
- [BSC leads European-Latin American AI and supercomputing initiative — HPCwire](https://www.hpcwire.com/off-the-wire/bsc-leads-european-latin-american-ai-and-supercomputing-initiative)
- [EX.IO Lab showcases agentic payment proof of concept — PR Newswire](https://www.prnewswire.com/apac/news-releases/exio-lab-showcases-agentic-payment-proof-of-concept-at-hong-kong-fintech-week-linking-bank-transfers-to-investments-302927616.html)
- [Snowflake Expedition 2026: Business Ontology, Cortex AI Gateway](https://www.snowflake.com/en/news/press-releases/expedition-2026-business-ontology-ai-gateway)
- [AWS Weekly Roundup — GPT-6.1 Terra on Bedrock](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-gpt-6-1-terra-on-bedrock-step-functions-as-agent-tools-and-more-november-2-2026/)
- [OpenAI partners with security firms to strengthen AI-powered cyber defence — Devdiscourse](https://www.devdiscourse.com/article/business/4001024-openai-partners-with-security-firms-to-strengthen-ai-powered-cyber-defence)
- [AI Newsflash: Apple to add AI assistants to Keynote, Pages, Numbers — LinkedIn](https://www.linkedin.com/pulse/ai-newsflash-october-26-november-1-2026-agents-out-its-mendiratta-4d8nc)
- [Honeycomb Team Agents — Honeycomb Blog](https://www.honeycomb.io/blog/honeycomb-team-agents-ai-sre-done-right)
- [Teamily AI reports 32x quarterly user growth — AFP](https://www.afp.com/en/agency/inside-afp/external-press-releases/teamily-ai-reports-32-quarterly-user-growth-positive)
- [Ai2 StateBench — Allen Institute for AI](https://allenai.org/blog/statebench)
- [Cohere launches open-source Model Vault](https://cohere.com/blog/open-source-model-vault)
- [Agentgateway lets you hide MCP tools — Towards AI](https://pub.towardsai.net/your-ai-agents-see-every-mcp-tool-agentgateway-lets-you-hide-them-0705d9511639)
- [cve-intel — GitHub](https://github.com/Fazmin/cve-intel)
- [AI agents take over at SETI's Allen Telescope Array — The Decoder](https://the-decoder.com/ai-agents-take-over-at-setis-allen-telescope-array-scanning-for-extraterrestrial-intelligence/)
- [NVIDIA Workload Map — NVIDIA Developer Blog](https://developer.nvidia.com/blog/support-new-ai-frameworks-faster-using-nvidia-workload-map/)
- [Salesforce agrees to acquire Cresta — 行銷科技日報](https://agilebrandguide.com/yesterdays-marketing-technology-ai-news-november-3-2026/)
- [Fal raises capital at $16 billion valuation — Bloomberg](https://www.bloomberg.com/news/articles/2026-11-03/ai-inference-startup-fal-raises-capital-at-16-billion-valuation)
- [Trajectory raises $45M — TechCrunch](https://techcrunch.com/2026/11/02/trajectory-raises-45m-to-make-ai-model-training-accessible-to-nontechnical-experts)
