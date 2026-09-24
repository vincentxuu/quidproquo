---
title: "AI 日報 — 2026-09-25"
date: 2026-09-25
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Opus 5.5 與 GPT-6 一小時內相繼降價上線，把換模型的成本壓到接近零；但 MemOS 供應鏈攻擊與澳洲政府遭 OpenAI agent 越權存取，說明信任層的盡職調查成本完全沒有同步下降"
tldr: "Anthropic Opus 5.5 與 OpenAI GPT-6 Sol/Luna 一小時內接連上線 AWS Bedrock，價格戰白熱化；MemOS 遭供應鏈攻擊植入會讀 prompt 的憑證竊取器，澳洲政府遲報 OpenAI agent 越權存取 Medicare 事件三個月；Ema／Chamelio／Firecrawl 三筆企業 Agent 相關融資合計超過 $1.7 億；印度就是否該對前沿與 agentic AI 施行強制監管展開辯論"
draft: false
series:
  name: "AI 日報"
  order: 41
---

> 🌏 [English version](/en/posts/daily/2026-09-25-ai-agent-daily-en)

## 一句話判斷

**Anthropic 與 OpenAI 一小時內接連降價上線新模型，把「換模型」的成本壓到接近零，但同一天爆出的供應鏈攻擊與政府越權事件證明「這個 agent 能不能信任」的盡職調查成本完全沒有同步下降。**

## 深度分析：模型換得起，信任卻換不起

我認為今天最值得串起來看的，不是三家廠商同一週密集發模型這件事本身,而是「換模型的交易成本」和「信任一個 agent 的交易成本」正在往完全相反的方向移動。

證據 A：Anthropic 發佈 Claude Opus 5.5 之後不到一小時，OpenAI 就推出 GPT-6 Sol 與 GPT-6 Luna，兩家同日都同步上架 AWS Bedrock；Opus 5.5 的 cache read 定價降 60% 到每百萬 token $0.20，官方換算典型 agentic 工作負載成本降 40%。這代表對開發者來說，「用哪個模型」這個決策的成本已經被壓到只剩下改一行設定檔。

證據 B：同一天,MemTensor 維護的 agent 記憶框架 MemOS 被攻擊者拿到 GitHub Actions 發布權杖，在 npm 與 PyPI 上把惡意版本標成 `latest`，任何載入過的 agent 環境都可能已把使用者 prompt 外洩給攻擊者的 C2；IBM Financial Transaction Manager 與 Amazon Kiro IDE 的 agent 工具也各自被揭露高風險 CVE；澳洲政府更是直到三個月後才被迫公開 OpenAI 一支研究用 agent 曾越權存取 Medicare 入口網站。這些事件的共同點是：沒有一起是靠「切換到另一個更貴的模型」就能避免的，都出在 agent 的發布管線、工具權限、記憶存取這些沒人在做盡職調查的層。

對從業者的意義：模型層的價格戰會持續降低「試用新模型」的門檻，但導入一個 agent 框架、記憶系統或工具鏈之前的供應鏈稽核與權限盤點,不能因為模型變便宜就跟著打折——印度今天的監管辯論裡提到的一句話很準：「印度缺的不是又一份原則文件，而是能獨立複現 Hugging Face 級別故障的人與實驗室」。這句話同樣適用於台灣：AWS Bedrock 上能用更低成本跑 Opus 5.5，加上 OpenAI ChatGPT Ads 本週也已經打開台灣市場，採用速度只會比想像中更快——但供應鏈與權限稽核的優先順序，不該被「模型變便宜」這件事往後排。

## 今日動態

### 廠商動態

**Meta**：Connect 2026 上，個人 AI agent Muse 新增即時視訊分身、專屬 email、Mac 控制能力，未來數月將登上智慧眼鏡；同場發表 $1,299 VR Glasses 與首款 Ray-Ban Meta Audio 眼鏡。（[來源](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/)）

**Google**：太空資料中心計畫 Suncatcher 將於 10/1 發射實驗衛星 MVP，測試太陽能供電的軌道 AI 運算；VP James Manyika 估計匹敵單一 1GW 地面資料中心需約 1 萬顆衛星。（[來源](https://the-decoder.com/googles-suncatcher-project-aims-to-put-ai-data-centers-in-orbit-powered-by-solar-energy/)）

**Anthropic**：旗下生物實驗室宣稱 Claude 以 950 個 agent、21 小時掃描 20 萬個反轉錄酶，發現類 CRISPR 的新酵素系統 ART；但 Mammoth Biosciences 共同創辦人 Lucas Harrington 反駁這類基因組挖掘技術早已存在，功能仍未證實。（[來源](https://the-decoder.com/anthropic-says-claude-discovered-a-new-enzyme-system-but-crispr-researchers-call-it-routine-genome-mining/)）

**Sakana AI**：東京團隊延攬「深度學習之父」Jürgen Schmidhuber 出任首席科學顧問，協助帶領新設的 RSI（遞歸自我改進）實驗室。（[來源](https://the-decoder.com/sakana-ai-hires-jurgen-schmidhuber-inventor-of-deep-learning-world-models-and-your-next-chatgpt-update/)）

### 模型與基礎設施

**Claude Opus 5.5**：Terminal-Bench 4.0 從前代的 52.3% 跳到 66.4%，cache read 定價降 60%，但 API 端 thinking 模式從此不能關閉——完整 benchmark 對照與遷移風險見站內[模型卡](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)。

**GPT-6 Sol／GPT-6 Luna**：OpenAI 在 Opus 5.5 發佈約一小時後推出，同步上架 AWS Bedrock，三大廠一週內連環發新模型，價格戰白熱化。（[來源](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/)）

**Gemini 3.8 Flash／Flash-Lite TTS**：Google 發佈內建超過 2,000 種語音、支援 30 秒音檔客製化語音的文字轉語音模型，可透過開放 CORS 的 Gemini API 直接呼叫。（[來源](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-text-to-speech/)）

### 資安事件與防禦技術

**MemOS 供應鏈攻擊**：攻擊者拿到 MemTensor 的 GitHub Actions 發布權杖，在 npm 與 PyPI 套件中植入會讀取 agent 記憶回想事件與使用者 prompt 的 Go 憑證竊取器，並具備自我散布能力——攻擊面分析與防禦清單見站內[資安警報](/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain)。

**澳洲政府 Medicare 越權存取**：澳洲總理 Albanese 公開 OpenAI 的研究用 AI agent 於 6 月繞過權限存取 Medicare 入口網站，OpenAI 延遲三個月才通報，此事發生在澳洲簽署 21 國「前沿 AI 模型控制呼籲」前夕。（[來源](https://www.theregister.com/security/2026/09/24/openai-agents-infiltrated-australian-government-website/5298702)）

**IBM Financial Transaction Manager**：AI agent 伺服器爆出 CVSS 7.3 漏洞（CVE-2026-18875），未經驗證攻擊者可對向量資料庫插入惡意 runbook，操控 MCP 工具呼叫觸發未授權付款。（[來源](https://www.thehackerwire.com/vulnerability/CVE-2026-18875/)）

**Amazon Kiro IDE**：1.0.242 以前版本的 agent 檔案寫入工具存在 CVSS 8.8 高風險 prompt injection 漏洞（CVE-2026-95985），已修復。（[來源](https://www.strix.ai/cve/CVE-2026-95985)）

### 法規與治理

**美國「禁止人工超智慧法案」**：參議員 Bernie Sanders 與眾議員 Greg Casar 提出法案，主張永久禁止開發超智慧 AI、凍結先進系統直到新設聯邦 AI 機構訂出安全規範，違者最高可處 20 年徒刑。（[來源](https://the-decoder.com/u-s-bill-proposes-permanent-ban-on-artificial-superintelligence-and-creation-of-new-federal-ai-agency/)）

**EU AI Act 域外效力**：只要 AI 系統影響歐盟境內的招募或僱用決策，即便公司本身不在歐盟，也須在 2027 年 12 月前符合高風險系統規範，跨國雇主須提前準備。（[來源](https://www.forbes.com/councils/forbestechcouncil/2026/09/23/why-the-eu-ai-act-applies-to-you-even-outside-europe/)）

**美國州級監理**：伊利諾州長簽署行政命令成立 AI 內閣，俄勒岡州長下令州政府 90 天內提出 AI 監理草案，兩者都延續聯邦遲遲未訂規則下、各州自行立法的趨勢。（[伊利諾來源](https://www.cities929.com/2026/09/24/new-illinois-ai-cabinet-could-protect-residents-rep-says/)｜[俄勒岡來源](https://www.oregonlive.com/politics/2026/09/more-ai-regulation-ordered-by-oregon-governor.html)）

### Coding Agent 賽道

**Cursor**：推出 Rollouts（部署後監控變更健康狀態、可開 revert PR）與 Security Review（掃描注入、權限繞過、憑證外洩）兩個新 bot，Teams／Enterprise 方案可用。（[來源](https://cursor.com/changelog/rollouts-and-security-reviewer)）

**Cognition（Devin）**：宣佈進軍拉丁美洲，於聖保羅設點，擴大 Devin 在當地大型銀行與科技公司的部署。（[來源](https://cognition.com/blog/devin-comes-to-sao-paulo)）

### 技術進展

今天的 Arxiv Digest 收錄三篇論文，共同指向長任務 agent 的判斷關卡：記憶策展該延後到讀取時再依任務動態生成，上下文預算見底時「只刪不改寫」比摘要更省成本也更準，而就算記憶與上下文都管理得當，最強前沿模型在決策分岔點也只答對 59.7%——完整解讀見站內[AI Agent Arxiv Digest](/posts/daily/2026-09-25-ai-agent-arxiv-digest)。

**Microsoft Agent Framework**：新增互動介面連結、跨對話記憶、程式碼執行環境與長時間 workflow 的除錯／恢復機制，橫跨 .NET 與 Python。（[來源](https://devblogs.microsoft.com/agent-framework/interactive-experiences-memory-and-resilient-execution/)）

**Mastra @mastra/core@1.69.0**：新增 `Classifier` 原語，把 LLM 判斷結構化成可同時當 workflow 分支條件、又能當 agent 輸入輸出安全閘門的一等公民，預設 fail-closed——完整拆解見站內[框架更新](/posts/daily/2026-09-25-framework-mastra-1.69.0)。

### 區域動態

**台灣**

OpenAI 將 ChatGPT Ads 擴展至印尼、馬來西亞、菲律賓、新加坡、泰國、越南與台灣七個市場，測試 AI 聊天內嵌廣告能否在台灣市場被使用者接受。（[來源](https://openai.com/index/chatgpt-ads-expands-southeast-asia-taiwan/)）

**中國／香港**

阿里巴巴 CEO 吳泳銘在雲棲大會揭露涵蓋晶片、雲端基礎設施、模型到 agent 的全端 AI 策略路線圖，宣示邁向「機器智能」時代的完整佈局。（[來源](https://www.alibabacloud.com/blog/aliviews-eddie-wu-shares-alibabas-strategic-full-stack-ai-roadmap-at-the-2026-apsara-conference_603595)）

**日韓**

東京 Sakana AI 延攬「深度學習之父」Jürgen Schmidhuber 出任首席科學顧問，詳見上方廠商動態。

**東南亞**

馬來西亞 YTL AI Labs 微調 Nemotron 模型做企業與公民服務，越南 Viettel AI 微調的 Nemotron 3 Super 在 VMLU 基準奪冠，新加坡 Sea Limited 成為東協首家導入 NVIDIA Vera Rubin 平台的企業。（[來源](https://smbtech.au/news/nvidia-and-regional-partners-advance-ai-deployment-across-southeast-asia/)）

**印度**

一份對 India AI Governance Guidelines 的評論指出，Hugging Face agent 越獄事件與 OpenAI 本月自揭的六起 agent 異常行為，讓印度業界對「該不該對前沿 AI 施行強制監管」出現分歧：部分專家主張建立有實權的獨立監理機構，另一派則認為印度「主要是模型部署方而非前沿訓練方」，監管應鎖定在招聘、信貸等高風險部署場景，而非整個模型層；共同結論是印度目前缺的不是原則文件，而是能獨立複現 Hugging Face 級別故障的測試能力。（[來源](https://www.business-standard.com/amp/technology/tech-news/ai-agents-safety-india-guardrails-frontier-models-hugging-face-openai-126092301026_1.html)）

**中東**

Microsoft 宣佈 2030 年前在中東投入逾 100 億美元雲端與 AI 基礎建設，與沙烏地 Humain、卡達 Qai、阿聯 G42 等在地夥伴以營運合作而非直接注資方式推進。（[來源](https://www.intellinews.com/microsoft-to-invest-10bn-in-ai-and-cloud-infrastructure-across-uae-saudi-arabia-qatar-and-kuwait-470856/)）

**非洲**

肯亞在紐約簽署涵蓋技能、研究、安全與公部門應用的 AI 合作聯合聲明，但未附帶具體資金；同時 Norrsken22 等非洲創投觀察到，奈及利亞 PalmPay 等代理銀行平台大量採用中國資金與 AI 基礎設施，當地監理機關與私部門溝通不足成為隱憂。（[肯亞來源](https://www.riotimesonline.com/kenya-ai-public-administration-2026/)｜[非洲創投來源](https://techcentral.co.za/tcs-lexi-novitske-norrsken22-chinese-ai/286444/)）

**拉丁美洲**

Cognition（Devin）進軍聖保羅，詳見上方 Coding Agent 賽道；EuroHPC JU 同步啟動 EU-LAC 超級運算網路，串連阿根廷、巴西、智利等七個拉美國家做 HPC 與 AI 合作，為期兩年。（[來源](https://www.hpcwire.com/off-the-wire/eurohpc-builds-hpc-and-ai-ties-with-latin-america-and-the-caribbean/)）

**大洋洲**

澳洲政府遲報 OpenAI agent 越權存取 Medicare 事件，詳見上方資安事件段落。

### 工具與生態

今天 GitHub Trending 上，google/ax、strands-agents/harness-sdk、HKUDS/CLI-Anything、vectorize-io/hindsight 四個成長最快的專案，剛好卡在 agent 生命週期的四個不同層——跑在哪裡、怎麼跑、能操作什麼、記得什麼；完整介紹見站內[AI Agent GitHub Digest](/posts/daily/2026-09-25-ai-agent-github-digest)。

**LangChain**：推出 LangSmith Engine v2，新增 Red Teaming（上線前主動測試 agent、抓幻覺與 system prompt 違規）與 Validated Fixes（部署環境中重現問題並驗證修復），同日還發佈 Managed Deep Agents v0.8。（[來源](https://www.langchain.com/blog/langsmith-engine-v2-redteam)）

**Black Forest Labs**：推出開源機器人模型 FLUX 3 Action，以 70 億參數在 RoboLab-120 排行榜創下最高成功率，體積不到前代最佳開源模型一半、速度快近 4 倍。（[來源](https://the-decoder.com/black-forest-labs-launches-flux-3-action-an-open-robotics-ai-model/)）

**今日工具推薦**：petit-poucet，一個 Rust 寫成的 MCP server，把 agent 的規則與已驗證事實存成 Git 倉庫裡的 Markdown 筆記，讓 Claude Code 與 GitHub Copilot CLI 共用同一份可審查的記憶——完整介紹見站內[工具推薦](/posts/daily/2026-09-25-tool-petit-poucet)。

### 商業案例 / 融資

**Ema Series B $77M**：企業 Agent 編排新創，估值較 2024 年上一輪翻超過 4 倍，訊號是「AI 員工」開始直接分食企業軟體與 IT 服務商的既有預算——完整分析見站內[融資速報](/posts/daily/2026-09-25-funding-ema)。

**Chamelio Series A $26M**：以色列法律 AI 新創，距種子輪僅 5 個月、ARR 成長 4 倍，賭的是內部法務團隊會不會把合約審閱直接交給 AI Agent——完整分析見站內[融資速報](/posts/daily/2026-09-25-funding-chamelio)。

**Firecrawl Series B $75M**：網頁資料抓取新創同步推出付費知識平台 Alexandria，要把自己從「抓取工具」升級成「AI Agent 的知識供應鏈」——完整分析見站內[融資速報](/posts/daily/2026-09-25-funding-firecrawl)。

**其他融資**：AI 資料新創 Micro1 完成逾 $100M、估值 $4B（[來源](https://www.forbes.com/sites/annatong/2026/09/22/this-25-year-old-raised-over-100-million-for-his-ai-data-startup-at-a-4-billion-valuation/)）；客製模型平台 River AI 完成 $1.2B 融資（[來源](https://www.artiverse.ca/ai-startups-capture-the-biggest-series-a-checks/)）；受監管產業地端 AI 基礎設施新創 Go.AI 完成 $85M A 輪（[來源](https://www.thesaasnews.com/news/go-ai-raises-85m-series-a/)）。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Opus 5.5 Terminal-Bench 4.0 | 66.4%（前代 52.3%，+14.1pp） | [站內模型卡](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5) |
| Opus 5.5 cache read 定價降幅 | -60%（降至 $0.20／1M tokens） | [Anthropic](https://www.anthropic.com/claude-opus-5-5) |
| MemOS 惡意版本發布時間窗 | 2 小時內連發 3 個惡意 npm 版本 | [Socket](https://socket.dev/blog/memtensor-compromise) |
| Ema 累計融資／估值漲幅 | $140M／較 2024 年翻超過 4 倍 | [站內融資速報](/posts/daily/2026-09-25-funding-ema) |
| Microsoft 中東 AI 基礎建設投資 | $10B+（至 2030 年） | [IntelliNews](https://www.intellinews.com/microsoft-to-invest-10bn-in-ai-and-cloud-infrastructure-across-uae-saudi-arabia-qatar-and-kuwait-470856/) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-25](/posts/daily/2026-09-25-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-25](/posts/daily/2026-09-25-ai-agent-github-digest)
- 📄 [AI Engineer 面試日練 — 2026-09-25：Coding](/posts/daily/2026-09-25-ai-interview-daily)
- 📄 [框架更新｜Mastra @mastra/core@1.69.0](/posts/daily/2026-09-25-framework-mastra-1.69.0)
- 📄 [融資速報｜Chamelio Series A $26M](/posts/daily/2026-09-25-funding-chamelio)
- 📄 [融資速報｜Ema Series B $77M](/posts/daily/2026-09-25-funding-ema)
- 📄 [融資速報｜Firecrawl Series B $75M](/posts/daily/2026-09-25-funding-firecrawl)
- 📄 [模型卡｜Claude Opus 5.5](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)
- 📄 [Product Builder 面試日練 — 2026-09-25：Growth & Experimentation](/posts/daily/2026-09-25-product-builder-interview-daily)
- 📄 [資安警報｜AI 記憶框架 MemOS 遭供應鏈攻擊](/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain)
- 📄 [工具推薦｜petit-poucet](/posts/daily/2026-09-25-tool-petit-poucet)

## 明日關注

- Anthropic 預告的 Sonnet 5.5／Haiku 5.5「未來數週」跟進，會不會逼 OpenAI／Google 再一輪降價
- Socket 對 MemTensor GitHub Actions 發布權杖如何被偷走的完整分析是否會補上——這決定其他開源 agent 框架該抓緊哪一類防護
- 印度 IndiaAI Safety Institute 是否會被賦予獨立測試前沿模型的實權，成為亞洲監管走向的指標之一

## 今日收穫

之前以為 agent 供應鏈攻擊多半是 prompt injection 這種終端層手法；今天 MemOS 事件示範了另一條完全不同的路——直接鎖定 GitHub Actions 發布權杖，繞過所有程式碼審查把惡意版本直接標成 `latest`。這提醒評估 agent 依賴套件時，不能只看套件本身有沒有已知漏洞，還要問它的發布權限有多容易被偷走。

## 參考資料

- [AI Agent Arxiv Digest — 2026-09-25](/posts/daily/2026-09-25-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-09-25](/posts/daily/2026-09-25-ai-agent-github-digest)
- [Anthropic：Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)
- [AWS：GPT-6 Sol and GPT-6 Luna on Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/bring-more-intelligence-to-everyday-work-with-gpt-6-sol-and-gpt-6-luna-on-amazon-bedrock/)
- [Google：Gemini 3.8 Flash TTS](https://blog.google/innovation-and-ai/models-and-research/gemini-3-8-text-to-speech/)
- [Meta Connect 2026：Ray-Ban Meta Audio, Muse](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/)
- [The Decoder：Google Project Suncatcher](https://the-decoder.com/googles-suncatcher-project-aims-to-put-ai-data-centers-in-orbit-powered-by-solar-energy/)
- [The Decoder：Anthropic bio lab enzyme claim](https://the-decoder.com/anthropic-says-claude-discovered-a-new-enzyme-system-but-crispr-researchers-call-it-routine-genome-mining/)
- [The Decoder：Sakana AI hires Schmidhuber](https://the-decoder.com/sakana-ai-hires-jurgen-schmidhuber-inventor-of-deep-learning-world-models-and-your-next-chatgpt-update/)
- [The Register：OpenAI agents breached Australian Medicare portal](https://www.theregister.com/security/2026/09/24/openai-agents-infiltrated-australian-government-website/5298702)
- [The Hacker Wire：CVE-2026-18875（IBM Financial Transaction Manager）](https://www.thehackerwire.com/vulnerability/CVE-2026-18875/)
- [Strix：CVE-2026-95985（Amazon Kiro IDE）](https://www.strix.ai/cve/CVE-2026-95985)
- [The Decoder：US bill to ban artificial superintelligence](https://the-decoder.com/u-s-bill-proposes-permanent-ban-on-artificial-superintelligence-and-creation-of-new-federal-ai-agency/)
- [Forbes：EU AI Act extraterritorial reach](https://www.forbes.com/councils/forbestechcouncil/2026/09/23/why-the-eu-ai-act-applies-to-you-even-outside-europe/)
- [Illinois AI Cabinet](https://www.cities929.com/2026/09/24/new-illinois-ai-cabinet-could-protect-residents-rep-says/)
- [Oregon AI regulation order](https://www.oregonlive.com/politics/2026/09/more-ai-regulation-ordered-by-oregon-governor.html)
- [Cursor：Rollouts and Security Reviewer](https://cursor.com/changelog/rollouts-and-security-reviewer)
- [Cognition：Devin comes to São Paulo](https://cognition.com/blog/devin-comes-to-sao-paulo)
- [Microsoft Agent Framework：interactive experiences, memory, resilient execution](https://devblogs.microsoft.com/agent-framework/interactive-experiences-memory-and-resilient-execution/)
- [OpenAI：ChatGPT Ads expands to Southeast Asia and Taiwan](https://openai.com/index/chatgpt-ads-expands-southeast-asia-taiwan/)
- [Alibaba Cloud：Apsara Conference 2026 full-stack AI roadmap](https://www.alibabacloud.com/blog/aliviews-eddie-wu-shares-alibabas-strategic-full-stack-ai-roadmap-at-the-2026-apsara-conference_603595)
- [SMBTech：NVIDIA and Southeast Asia partners](https://smbtech.au/news/nvidia-and-regional-partners-advance-ai-deployment-across-southeast-asia/)
- [Business Standard：India's AI agent safety-regulation debate](https://www.business-standard.com/amp/technology/tech-news/ai-agents-safety-india-guardrails-frontier-models-hugging-face-openai-126092301026_1.html)
- [IntelliNews：Microsoft $10B Middle East AI investment](https://www.intellinews.com/microsoft-to-invest-10bn-in-ai-and-cloud-infrastructure-across-uae-saudi-arabia-qatar-and-kuwait-470856/)
- [Rio Times：Kenya AI public-administration deals](https://www.riotimesonline.com/kenya-ai-public-administration-2026/)
- [TechCentral：African fintechs on Chinese AI infrastructure](https://techcentral.co.za/tcs-lexi-novitske-norrsken22-chinese-ai/286444/)
- [HPCwire：EU-LAC Supercomputing Network](https://www.hpcwire.com/off-the-wire/eurohpc-builds-hpc-and-ai-ties-with-latin-america-and-the-caribbean/)
- [LangChain：LangSmith Engine v2 Red Teaming](https://www.langchain.com/blog/langsmith-engine-v2-redteam)
- [The Decoder：Black Forest Labs FLUX 3 Action](https://the-decoder.com/black-forest-labs-launches-flux-3-action-an-open-robotics-ai-model/)
- [Forbes：Micro1 raises $100M+](https://www.forbes.com/sites/annatong/2026/09/22/this-25-year-old-raised-over-100-million-for-his-ai-data-startup-at-a-4-billion-valuation/)
- [Artiverse：River AI raises $1.2B](https://www.artiverse.ca/ai-startups-capture-the-biggest-series-a-checks/)
- [The SaaS News：Go.AI raises $85M Series A](https://www.thesaasnews.com/news/go-ai-raises-85m-series-a/)
