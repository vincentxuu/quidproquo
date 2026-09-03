---
title: "AI 日報 — 2026-09-02"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, daily]
lang: zh-TW
description: "模型分數的領先位置正在跟採購決策脫鉤——Claude Fable 5.1 拿下 CursorBench 冠亞軍的同一天，五角大廈卻繞過 Anthropic，把 ChatGPT 與 Grok 加進軍用 AI 平台"
tldr: "Claude Fable 5.1 空降 CursorBench 冠亞軍、同步 GA 上架 Bedrock，Anthropic 官方卻尚未正式公告；五角大廈把 ChatGPT 與 Grok 加入軍用 AI 平台、報導稱繞過 Anthropic；METR 公布 API 金鑰遭竊燒掉約 60 萬美元推論額度，NVIDIA SkillSpector 與 AIR Security 兩輪 Seed 合計 $50M 同週點出 agent 供應鏈信任正成新戰場；南韓「AI for All」計畫 9 月啟動 beta、年底讓 5,200 萬公民免費用本土 AI agent，台灣金融業則還在解決 AI Agent 治理與究責的地基問題"
draft: false
series:
  name: "AI 日報"
  order: 18
---

> 🌏 [English version](/posts/daily/2026-09-02-ai-agent-daily-en)

## 一句話判斷

**模型分數的領先位置正在跟採購決策脫鉤——Claude Fable 5.1 拿下 CursorBench 冠亞軍的同一天，五角大廈卻把 ChatGPT 與 Grok 加進軍用 AI 平台、繞過 Anthropic，顯示企業與政府買家真正在乎的是供應鏈信任與多元化，不是排行榜名次。**

## 深度分析：模型贏了排行榜，不代表贏了採購

我認為，今天最值得注意的分裂，是「模型能力」與「採購決策」正在脫鉤——三個獨立事件從不同角度證實這件事。（框架：五力分析）

第一個證據來自 CursorBench：標示為 Fable 5.1 的兩個設定檔今天首次上榜就包辦冠亞軍，把上週冠軍 Grok 4.6 擠到第三，而且是「同時降成本又拉分數」的少見洗牌——Fable 5.1 Max 每題只要 9.64 美元，比前代便宜 44%，分數卻更高。照理說，這應該是一次教科書等級的模型優勢展示。

但同一天，第二個證據卻是五角大廈把 ChatGPT 與 Grok 加進軍用 AI 平台，報導指出這繞過了原本較倚重的 Anthropic。這說明買方（尤其是政府與大型企業）的採購邏輯不是「誰的模型分數最高就選誰」，而更接近五力分析裡的「買方議價力」——供應商多元化、既有關係與政治風險分散，權重往往高過零點幾分的排行榜差距。Anthropic 就算真的握有最強模型，也不代表能自動拿下最敏感的採購決策。

第三個證據把視角拉到「模型分數之外，買方到底在買什麼」：NVIDIA 同週發佈 SkillSpector，直接點名 26.1% 的 Claude Code／Codex／MCP skill 含漏洞、5.2% 疑似惡意；供應鏈安全新創 AIR Security 更誇張——公司還在匿蹤模式，Sequoia 就先給了第一輪 Seed，直接跳過通常要等到 Series A 甚至 B 輪才會出現的頂級基金背書。這代表當模型能力彼此追平，買方真正稀缺、也真正願意付錢的，是「這條 agent 供應鏈能不能被驗證信任」，而不是模型分數本身。

對從業者的意義：如果你在幫團隊做 Agent 平台選型，CursorBench 這類排行榜該看，但別當成唯一或最終依據——真正決定政府與大型企業會不會下單的，是供應鏈可審計性與多元化程度。對台灣要導入 Agent 的企業或公部門而言，這代表選型評估表上「有沒有可稽核的安全與治理層」應該跟模型分數並列，而不是分數領先就直接拍板採購。

## 今日動態

### 廠商動態

**Anthropic**：Claude Fable 5.1 正式 GA 上架 Amazon Bedrock 與 Claude Platform on AWS，官方部落格強調企業級 Frontier Safeguards（資料留在客戶自控雲環境）。（[來源](https://aws.amazon.com/blogs/machine-learning/introducing-claude-fable-5-1-on-aws/)）

**OpenAI**：ChatGPT 廣告業務年化營收達 10 億美元，上線僅約 200 天，被用來佐證 IPO 前營收多元化的說法。（[來源](https://the-decoder.com/openai-says-its-chatgpt-ad-business-hits-a-1-billion-annual-run-rate/)）同時，Apple 與 OpenAI 的商業機密訴訟持續升溫，指控被告取用電源轉換器電路圖並用來訓練 AI agent，消息伴隨 Apple CEO 交接（John Ternus 9/1 上任）一起浮上檯面。（[來源](https://uk.investing.com/news/stock-market-news/rosenblatt-raises-apple-stock-price-target-to-303-on-ceo-transition-93CH-4853821)）

**Google**：DeepMind 新任負責人 Koray Kavukcuoglu 強調公司唯一在意的就是站上前沿，坦言目前模型「略低於前沿」，並談到 Gemini Flash 系列正快速從語言模型轉型為程式編碼 agent。（[來源](https://the-decoder.com/google-deepminds-new-chief-says-frontier-ai-leadership-is-the-only-thing-that-matters/)）銀行業 agent 平台已與 Deutsche Bank 進入預覽階段上線，Amazon 的 AI agent 商品目錄則在愛爾蘭達到 GA。（[來源](https://buttondown.com/Horizonscan/archive/ai-pulse-daily-brief-2026-09-01)）另外，Gemini Omni 1.1 Flash 已從 preview 轉正（詳見「模型與基礎設施」）。

**Meta**：程式編碼工具 Muse Code 正式脫離 beta，新增跨 session 通訊、可編排 subagent 團隊的 workflow，以及開發者預覽版 SDK，並開始提供每月 5 美元起的訂閱方案。（[來源](https://www.facebook.com/MetaforDevelopers/posts/muse-code-is-now-out-of-beta-with-new-features-and-updates-designed-to-help-you-/1511739397653057)）

**Manus**：官方宣布恢復獨立營運，是繼去年底加入 Meta 生態系、今年 8 月發出「給使用者的說明」後的最新進展，暗示先前的合作依存關係已告一段落。（[來源](https://manus.im/blog/manus-resumes-independent-operations)）

### 模型與基礎設施

**Gemini Omni 1.1 Flash**：Google 將影片生成模型從 preview 轉正，scene extension 延伸到 10 秒上下文、新增 first/last frame 控鏡，4K 輸出以 upscale 提供，定價按解析度分層（詳見[模型卡](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash)）。

**CursorBench 洗牌**：標示為 Fable 5.1 的兩個設定檔首次上榜即包辦冠亞軍，把上週冠軍 Grok 4.6 Extra High 擠到第三，Anthropic 官方尚未正式公告（詳見[Benchmark 異動](/posts/daily/2026-09-02-benchmark-cursorbench)）。

**Benchmark 動態**：MLCommons 發佈 MLPerf Storage v3.0，新增衡量 LLM 推理 KV Cache 讀寫效能的測試項目（[來源](https://www.hpcwire.com/bigdatawire/this-just-in/mlcommons-releases-new-mlperf-storage-v3-0-benchmark-results)）；Optimizely 則推出開源行銷任務基準 Mark-Bench（285 項任務）並同步發佈專用模型家族（[來源](https://www.cmswire.com/digital-experience/optimizely-debuts-marketing-ai-models-open-benchmark)）。

### 工具與生態

GitHub Trending 今天聚焦「個人 Agent 生態擴張 + 供應鏈安全掃描器」，OpenClaw 破 38 萬星、NVIDIA SkillSpector 抓 skill 漏洞（26.1% 含漏洞、5.2% 疑似惡意）、以及不依賴向量資料庫的 PageIndex（詳見[GitHub Digest](/posts/daily/2026-09-02-ai-agent-github-digest)）。

**AWS Agent Registry**：正式推上 GA，提供組織內 agent、工具、skills 的統一治理型錄，支援發佈、審核與探索工作流程。（[來源](https://aws.amazon.com/blogs/machine-learning/manage-agents-tools-and-skills-at-scale-with-aws-agent-registry/)）

**CrowdStrike Falcon Guardian**：在 Fal.Con 2026 發表，一套在端點執行時期即時偵測與控管 AI agent 行為的方案，主打既有端點部署規模帶來的可視性優勢。（[來源](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unveils-falcon-guardian-secure-ai-agents-where-they)）

**Airrived**：發佈主權 AI 平台，讓政府與企業客戶能在自有環境中執行 agentic AI，鎖定資料主權與合規敏感的公部門市場。（[來源](https://securitybrief.asia/story/airrived-launches-sovereign-ai-platform-for-governments)）

**mcp-spend-guard**：一款包住任意 MCP server 的 proxy，補上花費上限、rate limit 與 kill switch（詳見[工具推薦](/posts/daily/2026-09-02-tool-mcp-spend-guard)）。

### 技術進展

今天三篇論文一起指向：Agent 的記憶與 context 管理不是加一層結構就變聰明，而是需要被實測、被訓練的具體工程問題——Hindsight Memory-PRM 用軌跡本身的稽核痕跡訓練出比 API 教師更準的記憶效用評判器；Selective Forgetting 用受控實驗證明知識圖記憶不一定比扁平向量檢索好；TRACER 則用強化學習逐工具決定該留多少輸出，在生產環境省下近三成到近半 token。三篇證據成熟度不一，作者也各自標明限制，不宜直接當通則（詳見[Arxiv Digest](/posts/daily/2026-09-02-ai-agent-arxiv-digest)）。

**Agno 3.0.5**：把 Knowledge ingestion 的嵌入失敗從「默默回報成功」改成「誠實回報失敗」，是修正 RAG pipeline 資料完整性契約的版本（詳見[框架更新](/posts/daily/2026-09-02-framework-agno-3.0.5)）。

### 資安事件與防禦技術

**METR API 金鑰遭竊**：內部研究員自架的 vibe-coded agent dashboard 因 fail-open 漏洞曝露，攻擊者直接對 agent 下指令騙出 API 金鑰，三週燒掉約 60 萬美元推論額度（詳見[資安警報](/posts/daily/2026-09-02-security-metr-api-key-theft)）。

**Langflow CVE-2026-0768**：開源 AI 應用框架 Langflow 的未驗證遠端程式碼執行漏洞正被實際利用，用來竊取受害者的 OpenAI 與 AWS API 金鑰。（[來源](https://www.bleepingcomputer.com/news/security/critical-langflow-flaw-exploited-to-steal-openai-and-aws-keys/)）

**CISA KEV 新增兩項漏洞**：CISA 把 Linux Kernel（CVE-2026-53362）與 JFrog Artifactory（CVE-2026-66384）漏洞列入已知遭利用清單，起因是一起由 OpenAI agent 觸發的漏洞利用事件。（[來源](https://www.yahoo.com/news/science/articles/cisa-adds-linux-kernel-jfrog-094143954.html)）

**AI agent 找零時差漏洞**：資安公司 Trail of Bits 展示 AI agent 能在數分鐘內找到過去需要人類研究員數天到數週才能發現的虛擬機逃逸零時差漏洞，凸顯「已修補」軟體仍可能因發行版尚未回移修補而遭利用。（[來源](https://www.techtimes.com/articles/326131/20260901/ai-agents-now-discover-zero-days-escape-virtual-machines-trail-bits-proves.htm)）

### 法規與治理

**G20「Carolina Principles」**：美國政府在北卡羅來納州的 G20 科技部長會議上，推動各國採取「不干預」的 AI 監管立場，OpenAI 與 Anthropic 是主要受益方。（[來源](https://www.usnews.com/news/top-news/articles/2026-09-01/us-to-urge-hands-off-ai-regulation-at-g-20-official-says)）

**EU DSA 雙重監管**：歐盟執委會將 ChatGPT 列入《數位服務法》最嚴格的平台監理層級，使其同時受 AI Act（模型層面）與 DSA（平台散布資訊層面）雙重規範，被視為對話式 AI 服務治理的先例。（[來源](https://www.pymnts.com/news/artificial-intelligence/2026/chatgpt-facing-dual-regulatory-regimes-under-new-eu-designation)）

### 區域動態

**中國**

長鑫存儲（CXMT）首次小量產出 HBM3E，技術上仍落後三星、SK 海力士與美光約 3-5 年，但被視為緩解中國 AI 晶片受美國出口管制限制的一步。（[來源](https://the-decoder.com/chinas-cxmt-makes-its-first-hbm3e-chips-closing-the-ai-memory-gap/)）

**台灣**

國發會指導、臺灣區塊鏈愛好者協會主辦的「可信AI黑客松」8 月 31 日舉行，金壹金融科技以 AI Agent 治理技術獲頒「可信AI治理創新貢獻獎」。執行長翁仲和指出，台灣金融業導入 AI Agent 卡在規模化的關鍵不是技術做不到，而是「出事之後，董事會、法遵與稽核沒有人敢負責」——沒有治理就沒有可信，沒有可信金融機構就不敢讓 AI Agent 規模化。（[來源](https://www.storm.mg/article/11160855)）這跟同一週南韓政府砸重金推「全民用 AI」形成對照：當其他國家在拚普及規模，台灣金融業還在解決信任與究責的地基問題，這是規模化前必須先補的一塊。

**日韓**

南韓政府公布「AI for All」（모두의 AI）計畫的三家得標團隊——SK Telecom、Kakao、KT——將於 9 月開始 beta 測試，年底前讓全體 5,200 萬公民免費、無用量上限使用主要基於本土模型的 AI 服務，範圍不只是聊天機器人，還包括能完成公共服務申請、跨業導航的 AI agent，政府今年先提供合計 512 顆 NVIDIA B200 GPU。（[來源](https://www.theinvestor.co.kr/article/10855841)）

同期，南韓 ITCEN Group 發佈 AgentGo Guard，一套支援企業與公部門導入生成式 AI 與 agent 生態時的整合防護方案，含個資去識別化與資料外洩防護，對應南韓個資法與國際規範。（[來源](https://biz.chosun.com/en/en-it/2026/09/01/U53QY3EKMJHZ7HYUZN57WIHT2Y?outputType=amp)）

**印度**

印度國家支付公司（NPCI）正籌備讓 AI agent 能在使用者設定的規則與額度內，直接透過 UPI 完成付款，並規劃支出上限、稽核軌跡與身分驗證框架，Pine Labs 的 P3P 協定已先行落地。（[來源](https://stratnewsglobal.com/technology/agentic-payments-upi)）

**中東**

沙烏地主權 AI 集團 HUMAIN 本週密集出手——投資阿拉伯語言科技公司 Arabic.AI 與 Tarjama，鎖定阿語優先的翻譯管理與可審閱合約、標案的 AI agent（[來源](https://www.fwdstart.me/p/humain-invests-in-arabic-ai-and-tarjama-to-expand-saudi-enterprise-ai-offering)）；並與推理基礎設施公司 Together AI 合作在沙國建置 AI 基礎設施（[來源](https://adgully.me/date/01-09-2026)）；另與 AMD 合作推出「AI in a Box」一體化方案，降低沙烏地企業導入 AI 的門檻（[來源](https://www.facebook.com/ArabNews/posts/humain-amd-launch-ai-in-a-box-to-expand-enterprise-ai-access-in-saudi-arabia/1501726225325720)）。三起合作合起來看，沙烏地正試圖用主權資金把「模型、算力、應用層」一次補齊，而非只買算力。

**非洲**

南非資安公司 NEWORDER 與以色列 Lasso Security 合作，把 AI agent 安全控管導入南非市場，並對照當地金融資安標準與個資法對自動化決策的限制。（[來源](https://techcentral.co.za/neworder-lasso-security-ai-agent-controls/285558)）

**大洋洲**

澳洲國防部長形容 AI 是二戰以來最大的主權轉折點，正赴美推動一項約 210 億美元、讓澳洲成為 Anthropic 前沿模型第二基地的建置案，版權與資料存取細節仍待談判。⚠️ 此消息目前僅單一來源、未經交叉驗證。（[來源](https://aspicts.substack.com/p/early-edition-australia-makes-its)）同一時間，在澳洲央行檢討支付系統規範之際，Commonwealth Bank、Westpac、ANZ 等銀行主張應立即規範 agentic AI 支付，NAB、Visa、Amex、Apple 等則認為現在規範言之過早，雙方立場在提交件中正面交鋒。（[來源](https://www.capitalbrief.com/article/battlelines-drawn-as-big-banks-and-big-tech-square-off-over-agentic-ai-regulation-be11f1f9-20a3-4a7c-b8b0-706e965b8aad)）

### 商業案例 / 融資

**AIR Security**：Agent 供應鏈安全新創出匿蹤，兩輪 Seed 合計 $50M，Sequoia 與 Greenoaks 分別領投（詳見[融資速報](/posts/daily/2026-09-02-funding-air-security)）。

**Tripo AI**：3D 原生基礎模型公司完成 Series B + B+ 合併輪，約人民幣 30 億元，MPCi 領投（詳見[融資速報](/posts/daily/2026-09-02-funding-tripo-ai)）。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| CursorBench Fable 5.1 Max 分數 | 73.4%（成本降 44%） | [Cursor](https://cursor.com/cursorbench) |
| METR 遭竊推論額度 | 約 $600,000 | [METR](https://metr.org/blog/2026-08-31-security-update/) |
| AIR Security 兩輪 Seed 融資 | $50M | [TechCrunch](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use) |
| SkillSpector 抓出的漏洞比例 | 26.1% skill 含漏洞、5.2% 疑似惡意 | [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) |
| 南韓 AI for All 首年 GPU 配額 | 512 顆 NVIDIA B200 | [The Investor](https://www.theinvestor.co.kr/article/10855841) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-02](/posts/daily/2026-09-02-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-02](/posts/daily/2026-09-02-ai-agent-github-digest)
- 📄 [Benchmark 異動｜CursorBench](/posts/daily/2026-09-02-benchmark-cursorbench)
- 📄 [框架更新｜Agno 3.0.5](/posts/daily/2026-09-02-framework-agno-3.0.5)
- 📄 [融資速報｜AIR Security](/posts/daily/2026-09-02-funding-air-security)
- 📄 [融資速報｜Tripo AI](/posts/daily/2026-09-02-funding-tripo-ai)
- 📄 [模型卡｜Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash)
- 📄 [Product Builder Interview Prep — 2026-09-02](/posts/daily/2026-09-02-product-builder-interview-daily)
- 📄 [資安警報｜METR API 金鑰遭竊](/posts/daily/2026-09-02-security-metr-api-key-theft)
- 📄 [工具推薦｜mcp-spend-guard](/posts/daily/2026-09-02-tool-mcp-spend-guard)

## 明日關注

- Anthropic 是否會正式公告 Claude Fable 5.1——目前僅有第三方榜單與社群觀察，官方頁面與模型文件仍只列出 Fable 5
- METR 事件後，其他 AI 安全／評測機構是否會跟進盤點「研究員個人帳號上的 vibe-coded agent 工具」
- 南韓 AI for All 9 月 beta 測試的早期回饋，以及這股「全民 AI」政策路線是否會牽動台灣或其他國家跟進討論

## 今日收穫

之前以為政府主導的「全民 AI」多半只是象徵性政策，但南韓一次撥 512 顆 B200 GPU、目標年底前讓 5,200 萬人免費用本土 AI agent，規模大到已經不是公關動作，而是把 AI 存取當公共建設在做——這跟台灣目前偏向「各機構自己導入、各自解決治理問題」的路線形成明顯落差，值得追問我們是不是也該有一個對等規模的政策討論。

## 參考資料

- [Claude Fable 5.1 GA on Amazon Bedrock — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/introducing-claude-fable-5-1-on-aws/)
- [OpenAI's ChatGPT ad business hits $1B run rate — The Decoder](https://the-decoder.com/openai-says-its-chatgpt-ad-business-hits-a-1-billion-annual-run-rate/)
- [Apple v. OpenAI trade-secret dispute escalates — Investing.com](https://uk.investing.com/news/stock-market-news/rosenblatt-raises-apple-stock-price-target-to-303-on-ceo-transition-93CH-4853821)
- [Google DeepMind's new chief on frontier AI leadership — The Decoder](https://the-decoder.com/google-deepminds-new-chief-says-frontier-ai-leadership-is-the-only-thing-that-matters/)
- [AI Pulse Daily Brief 2026-09-01 — Google banking agent, Amazon Ireland GA](https://buttondown.com/Horizonscan/archive/ai-pulse-daily-brief-2026-09-01)
- [Meta Muse Code exits beta — Meta for Developers](https://www.facebook.com/MetaforDevelopers/posts/muse-code-is-now-out-of-beta-with-new-features-and-updates-designed-to-help-you-/1511739397653057)
- [Manus Resumes Independent Operations — Manus Blog](https://manus.im/blog/manus-resumes-independent-operations)
- [MLPerf Storage v3.0 — HPCwire](https://www.hpcwire.com/bigdatawire/this-just-in/mlcommons-releases-new-mlperf-storage-v3-0-benchmark-results)
- [Optimizely debuts Mark-Bench — CMSWire](https://www.cmswire.com/digital-experience/optimizely-debuts-marketing-ai-models-open-benchmark)
- [AWS Agent Registry reaches GA — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/manage-agents-tools-and-skills-at-scale-with-aws-agent-registry/)
- [CrowdStrike unveils Falcon Guardian — CrowdStrike IR](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unveils-falcon-guardian-secure-ai-agents-where-they)
- [Airrived launches sovereign AI platform — SecurityBrief Asia](https://securitybrief.asia/story/airrived-launches-sovereign-ai-platform-for-governments)
- [Critical Langflow flaw exploited — BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-langflow-flaw-exploited-to-steal-openai-and-aws-keys/)
- [CISA adds Linux Kernel + JFrog Artifactory CVEs to KEV — Yahoo](https://www.yahoo.com/news/science/articles/cisa-adds-linux-kernel-jfrog-094143954.html)
- [Trail of Bits: AI agents discover zero-days to escape VMs — Tech Times](https://www.techtimes.com/articles/326131/20260901/ai-agents-now-discover-zero-days-escape-virtual-machines-trail-bits-proves.htm)
- [US to urge hands-off AI regulation at G20 — U.S. News](https://www.usnews.com/news/top-news/articles/2026-09-01/us-to-urge-hands-off-ai-regulation-at-g-20-official-says)
- [ChatGPT faces dual regulatory regimes under EU DSA — PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/chatgpt-facing-dual-regulatory-regimes-under-new-eu-designation)
- [China's CXMT makes its first HBM3E chips — The Decoder](https://the-decoder.com/chinas-cxmt-makes-its-first-hbm3e-chips-closing-the-ai-memory-gap/)
- [AI Agent 成金融業「數位員工」？沒有治理，就沒有可信 — 風傳媒](https://www.storm.mg/article/11160855)
- [Korea picks SK Telecom, Kakao, KT for free nationwide AI — The Investor](https://www.theinvestor.co.kr/article/10855841)
- [ITCEN Group debuts AgentGo Guard — Chosun Biz](https://biz.chosun.com/en/en-it/2026/09/01/U53QY3EKMJHZ7HYUZN57WIHT2Y?outputType=amp)
- [India's NPCI prepares agentic payments rollout on UPI — StratNews Global](https://stratnewsglobal.com/technology/agentic-payments-upi)
- [HUMAIN invests in Arabic.AI and Tarjama — fwdstart](https://www.fwdstart.me/p/humain-invests-in-arabic-ai-and-tarjama-to-expand-saudi-enterprise-ai-offering)
- [Together AI partners with HUMAIN — Adgully](https://adgully.me/date/01-09-2026)
- [HUMAIN and AMD launch "AI in a Box" — Arab News](https://www.facebook.com/ArabNews/posts/humain-amd-launch-ai-in-a-box-to-expand-enterprise-ai-access-in-saudi-arabia/1501726225325720)
- [NEWORDER brings Lasso Security's AI agent controls to South Africa — TechCentral](https://techcentral.co.za/neworder-lasso-security-ai-agent-controls/285558)
- [Anthropic in talks for ~US$21B Australia AI data-center buildout — ASPI ICTS](https://aspicts.substack.com/p/early-edition-australia-makes-its)
- [Australian banks and big tech clash over agentic AI payments regulation — Capital Brief](https://www.capitalbrief.com/article/battlelines-drawn-as-big-banks-and-big-tech-square-off-over-agentic-ai-regulation-be11f1f9-20a3-4a7c-b8b0-706e965b8aad)
- [AIR raises $50M — TechCrunch](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use)
- [Update on Security at METR — METR Blog](https://metr.org/blog/2026-08-31-security-update/)
- [Pentagon adds ChatGPT and Grok to military AI platform, bypassing Anthropic — The AI Insider](https://theaiinsider.tech/2026/09/01/pentagon-adds-chatgpt-and-grok-to-military-ai-platform-bypassing-anthropic)
