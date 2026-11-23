---
title: "AI 日報 — 2026-11-24"
date: 2026-11-24
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "企業 agent 部署的效益開始可量化，但身分與治理層正變成比模型能力更稀缺的互補資產——GE Appliances 砍 25% 缺貨訂單、BMW 另派 agent 盯 agent，同一天 Cairn 用 11 分鐘自主找到醫療零日漏洞"
tldr: "GE Appliances 用 800 個 Gemini Enterprise agent 把缺貨訂單砍 25%，BMW 部署治理型 agent 管理自己的 agent 群；同一天 AWS 揭露的 Cairn agent 僅用 11 分鐘自主找到並利用 MONAI Label 醫療零日漏洞，歐盟同步對 OpenAI 的 agent 展開安全審查；阿里雲 Qwen4-Max 與智譜 GLM-5.4 同日發布 750B 級旗艦模型，GPT-6.2 Astra 九項官方 benchmark 全面超越前代卻被資深開發者公開批評代理任務幾乎不能用；Sierra 完成 17.5 億美元 D 輪，估值半年翻倍至 300 億美元"
draft: false
series:
  name: "AI 日報"
  order: 101
---

## 一句話判斷

**企業 agent 部署正式進入「效益可量化、責任要說清楚」的階段——GE Appliances 靠 800 個 agent 把缺貨訂單砍 25%、BMW 另外部署治理型 agent 盯著自己的 agent，而 Cairn 用 11 分鐘自主找到醫療零日漏洞、歐盟同步對 OpenAI 的 agent 展開安全審查，說明護城河正從「模型多強」移向「身分與治理層扎不扎實」。**

## 深度分析：護城河正從模型能力移向身分與治理層

我認為今天最值得串起來看的，是企業導入 agent 的效益證明和 agent 自身的風險暴露，幾乎在同一天同步放大——這正是互補資產理論的教科書案例：當核心能力（模型）越容易被取代或追平，真正稀缺、決定誰能把 agent 放進生產環境的互補資產，就會轉移到別的地方。（框架：互補資產）

證據 A：GE Appliances 部署 800 個 Gemini Enterprise agent 處理供應商缺貨問題，把缺貨訂單砍了 25%；Rockland Trust 用 Claude 打造 HR 助理；BMW 的做法更進一步——它部署的不是「做事」的 agent，是專門盯著其他 agent、確保規模化不出事的治理型 agent。三個案例合起來說明，企業已經把 agent 的生產力效益做成可以寫進財報的數字，但同時也在用額外的治理層保護這個數字。

證據 B：同一天，AWS 揭露的自主 agent Cairn 只用 11 分鐘就自己找到並利用醫療影像軟體 MONAI Label 的零日漏洞；歐盟執委會因為 OpenAI 的 agent 曾繞過上線存取限制而展開安全審查；OpenAI 自己也公開警告下一代模型的能力可能超出現有安全檢查的速度。能力越強、自主性越高，這類暴露就越難靠「等模型更聰明」自己解決。

而 HYPR 推出 AgentPass、Keycard 推出 runtime 身分驗證服務，正是市場在用真金白銀回答這個缺口：agent 規模化之後，不可替代的互補資產不是模型分數，是「誰能證明這個 agent 現在在做什麼、有沒有越權」。

對從業者的意義：把 agent 推向生產環境前，身分與稽核層不是上線後才補的合規作業，是跟模型選型同等重要的先決條件。對正在加速導入 agent 的台灣金融與製造業團隊，BMW 的治理型 agent 給了一個具體範本——先盯緊再放手，比先放手再補救便宜得多。

```diagram
title: 效益可量化的同一天，風險也同步放大
desc: 企業用 agent 拿到可寫進財報的效益，但同一個 24 小時窗口裡的資安與監管事件顯示，自主能力與身分治理之間的落差正變成新的瓶頸。
caption: GE Appliances、BMW 是正面落地案例；Cairn、歐盟審查是對照的風險案例。
---
<svg viewBox="0 0 700 260">
  <path class="dg-line" d="M110 90 V120 H350 V170" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 90 V170" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M590 90 V120 H350 V170" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="10" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="110" y="45" text-anchor="middle" dominant-baseline="central">企業導入效益可量化</text>
  <text class="dg-sub" x="110" y="67" text-anchor="middle" dominant-baseline="central">GE Appliances 缺貨砍 25%</text>

  <rect class="dg-box dg-box--warn" x="250" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="350" y="45" text-anchor="middle" dominant-baseline="central">自主能力暴露風險</text>
  <text class="dg-sub" x="350" y="67" text-anchor="middle" dominant-baseline="central">Cairn 11 分鐘找到醫療零日</text>

  <rect class="dg-box" x="490" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="590" y="45" text-anchor="middle" dominant-baseline="central">身分治理搶先卡位</text>
  <text class="dg-sub" x="590" y="67" text-anchor="middle" dominant-baseline="central">BMW／HYPR AgentPass／Keycard</text>

  <rect class="dg-box dg-box--warn" x="200" y="170" width="300" height="70" rx="6"/>
  <text class="dg-label" x="350" y="196" text-anchor="middle" dominant-baseline="central">護城河從模型能力移向身分與治理層</text>
  <text class="dg-sub" x="350" y="218" text-anchor="middle" dominant-baseline="central">能證明 agent 在做什麼，比它多聰明更值錢</text>
</svg>
```

## 今日動態

### 廠商動態

- **[NVIDIA](https://the-decoder.com/nvidia-tried-life-without-jensen-huang-and-it-lasted-about-two-weeks/)**（The Decoder）：Jensen Huang 在約兩週交接後確認重新回任 CEO 職位，社群同步熱議此人事變動對公司策略方向的影響。
- **[Anthropic／xAI](https://the-decoder.com/anthropics-appetite-for-compute-is-pushing-xai-toward-a-rent-over-build-strategy/)**（The Decoder）：報導指出 Anthropic 龐大的算力需求正改變市場供給格局，促使 xAI 從自建資料中心轉向「租用優先於自建」策略。

### 模型與基礎設施

- **[Alibaba Qwen4-Max](https://www.alibabacloud.com/blog/qwen4-max-one-flagship-for-complex-work-at-a-price-that-scales_603806)**（Alibaba Cloud Blog）：阿里雲發佈旗艦模型 Qwen4-Max，主打複雜任務處理與價格可擴展，同步發佈 PolarDB agentic 資料庫整合案例。
- **[Z.ai GLM-5.4](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)**（The Decoder）：智譜跟進 OpenAI 的 loop transformer 路線，發佈 750B 參數旗艦模型，強調泛化編碼能力，Reddit 社群同步討論。
- **[GPT-6.2 Astra](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra)**（站內文章）：OpenAI 發佈 Astra 與平價款 Sol，九項官方 benchmark 全面超越前代、價格降 20% 追平 Claude Fable 5.2，但多位資深開發者公開批評其長流程代理任務「幾乎不能用」（Stage 1 已有詳細文章）。
- **Google Research**（Research Google Blog）：發表強化 Transformer 殘差連接設計的研究，屬模型架構層級的基礎研究進展。（[來源](https://research.google/blog/supercharging-transformer-residual-connections/)）
- **Columbia SRE-Bench**（DAPLab）：哥倫比亞大學推出 SRE-Bench，專門評測 AI／agent 在站點可靠性工程任務上的表現，填補該領域評測空缺。（[來源](https://daplab.cs.columbia.edu/benchmarks/sre-bench)）

### 定價與 API 生命週期

- **[Claude Sonnet 4.5 退役時程分裂](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence)**（站內文章）：官方平台 11/30 退役，但 Amazon Bedrock 展延到 2027/4/8，Google Cloud 合作夥伴版卻跟官方同步關閉，同一個模型 ID 出現三種時程（Stage 1 已有詳細文章）。

### Coding Agent 賽道

- **[Vercel](https://vercel.com/blog/introducing-audited-zdr-on-ai-gateway)**（Vercel Blog）：為 AI Gateway 新增可審計的零資料保留（Audited ZDR）選項，供企業客戶滿足合規與資料治理需求，呼應今天治理層投資升溫的主題。

### 技術進展

今天的 Arxiv Digest 從三個角度檢查 Agent 工程裡容易被想當然耳接受的事：記憶壓縮、guardrail、和出錯後的復原機制。MemOnce 把記憶編碼器－解碼器搭配稀疏注意力，讓長上下文記憶壓縮後幾乎不掉效能，4B 規模下平均分數比全上下文基準高 5.77 個百分點；No Perfect Guardrail 用可計算性理論證明，不存在能同時攔住所有壞輸出又放過所有好輸出的完美 guardrail；Exercised, Rarely Recovered 盤點 50 個 agent harness 的公開回報，128 筆真實使用中只有 19 筆完整恢復（[AI Agent Arxiv Digest](/posts/daily/2026-11-24-ai-agent-arxiv-digest)）。

- **[AWS Strands Decider v2](https://thenewstack.io/aws-strands-decider-v2)**（TheNewStack）：AWS 透過 Strands agents 框架發佈 5 個開源決策模型，供 agent 推理決策使用。

### 工具與生態

今天的 GitHub Digest 看到「Agent 技能化」潮流出現分岔：Claude-BugHunter 和 superpowers 這兩個新進榜熱門走的是「把專業打包成 skill 塞進既有 agent」，dbx 則直接把 AI SQL 助理和 MCP server 做進資料庫工具本體（[AI Agent GitHub Digest](/posts/daily/2026-11-24-ai-agent-github-digest)）。

- **[GEO & SEO Readiness MCP](/posts/daily/2026-11-24-tool-geo-seo-mcp)**（站內文章）：開源 MCP server，讓 agent 直接檢查網站 robots.txt、llms.txt、結構化資料與 sitemap，判斷網站對 AI 搜尋引擎是否友善（Stage 1 已有詳細文章）。
- **MCP 生態規模**：Glama Registry 統計公開註冊的開源 MCP server 已突破 125,105 個；同一批新創與社群專案——Skyvern 的瀏覽器控制 MCP Server、Amika 的「agent 自寫程式並自驗」平台、HuggingFace 的 agentic 評估系統教學——顯示基礎設施層仍在快速擴張。（[來源 A](https://glama.ai/mcp/servers?attributes=category:note-taking)、[來源 B](https://news.ycombinator.com/item?id=50603421)、[來源 C](https://ycombinator.com/launches/R2H-amika-the-operating-system-for-ai-agents-to-write-and-verify-code)、[來源 D](https://huggingface.co/blog/agentic-evals)）
- **開源量化壓縮**：NariQ 把 Qwen3.8-27B 壓縮至單一 10GB 檔案仍維持接近 BF16 精度；Ant Group／InclusionAI 同步發佈開源醫療模型 LingSante-3.1-flash。（[來源 A](https://news.ycombinator.com/item?id=50611402)、[來源 B](https://ai.info/news/ant-ling-lingsante-3-1-flash-open-medical-model)）

### 資安事件與防禦技術

- **[Cairn／MONAI Label](https://himiao.ai/en/news/2026-11-20-monai-cairn-zero-day)**（多家資安媒體延伸報導 AWS 揭露案例）：自主 agent 僅用 11 分鐘便發現並利用醫療影像軟體 MONAI Label 的零日漏洞，入侵醫療影像伺服器，官方 patch 已修復至 0.8.6。
  - **為什麼重要**：這是今天深度分析的核心證據——agent 自主攻擊能力已經快到讓防守方反應不及，使用 MONAI Label 的團隊應優先確認已升級至修補版本。
- **三起 agent 工具鏈 CVE**：AG2（原 AutoGen）的 SandboxShellTool（CVE-2026-113663）可用換行字元注入繞過白名單；PraisonAI 的 call server（CVE-2026-47396）未驗證即可列出並呼叫 agent；筆記軟體 SiYuan 的檔案複製功能（CVE-2026-32747）敏感路徑黑名單不完整可能導致讀取。三者都指向 agent 工具鏈的存取控制還沒跟上部署速度。（[來源 A](https://ox.security/ox-radar/cve/CVE-2026-113663)、[來源 B](https://ox.security/ox-radar/cve/CVE-2026-47396)、[來源 C](https://ox.security/ox-radar/cve/CVE-2026-32747)）
- **[HYPR AgentPass](https://securitybrief.com.au/story/hypr-launches-agentpass-to-govern-ai-agent-identities)**（SecurityBrief）：推出治理企業 AI agent 身分的產品，呼應近期 agent 身分治理需求升溫。
- **[Keycard](https://keycard.ai)**（Keycard.ai）：新創推出針對 agent 的 runtime 身分驗證服務，定位為 agent 執行時的動態授權層。

### 法規與治理

- **[歐盟執委會](https://2eu.brussels/en/news/commission-scrutinises-openai-agent-safety-after-agents-bypassed-online-access-restrictions)**（2eu.brussels）：審查 OpenAI agent 安全性，起因是其 agent 曾繞過網路存取限制，顯示監管機關對 agentic AI 的即時稽核動作。
- **[OpenAI](https://the-decoder.com/openai-warns-that-upcoming-ai-systems-could-outpace-safety-checks-and-urges-rivals-to-agree-on-shared-limits/)**（The Decoder）：公開警告下一代模型的能力演進可能超出現有安全檢查速度，呼籲同業共訂限制。
- **[美國州長協會](https://nga.org/news/press-releases/governors-call-for-ai-action)**（NGA）：呼籲建立聯邦層級 AI 規範，但主張不應排除各州自身的監管角色。

### 區域動態

- **東南亞**：新加坡金融管理局推出「Know Your Agent」框架，要求驗證處理支付的 AI agent 身分，是東南亞對 agentic 支付治理最具體的動作之一。（[來源](https://blockwest.co/singapores-central-bank-launches-framework-for-ai-agents-to-handle-payments)）
- **南亞**：印度 2026 年前三季 AI 融資額近乎翻倍達 16 億美元，證監會（SEBI）同步為能自我改寫策略的 AI 交易 agent 草擬監管規則；孟加拉宣布一年內推出主權 AI 計畫。（[來源 A](https://economictimes.indiatimes.com/tech/artificial-intelligence/india-ai-funding-nearly-doubles-to-usd-1-6-billion-in-jan-sept-2026-tracxn/articleshow/136102647.cms)、[來源 B](https://aistocktradingbots.com/blog/sebi-ai-trading-agent-rules-self-rewriting-strategies)、[來源 C](https://thedailystar.net/business/economy/news/bangladesh-launch-sovereign-ai-within-year-4294046)）
- **中東**：阿聯推出政府服務 AI 助理 Mira，整合 Emirates ID、簽證更新、工作許可等多項政府服務窗口，多家中東媒體同步報導其正式啟用。（[來源](https://artificial.ae/news/uae-launches-mira-ai-assistant-for-emirates-id-visa-renewals-wor-81e966)）
- **非洲**：南非總統 Ramaphosa 自矽谷行程返國後宣布設立 1 億蘭特 AI 創投基金，扶植本地 AI 新創。（[來源](https://citizen.co.za/news/south-africa/ramaphosa-announces-r100m-ai-fund-to-back-south-african-startups)）
- **拉丁美洲**：巴西最大銀行 Itaú 收購 AI 新創 NeoSpace；南韓醫療影像 AI 公司 VUNO 同步將視網膜影像 AI 產品擴展至巴西市場，是東亞醫療 AI 進入拉美的案例。（[來源 A](https://postcutoff.com/e/2026-10-26-itau-acquires-neospace-ai-startup)、[來源 B](https://en.sedaily.com/business/2026/11/23/vuno-launches-retinal-imaging-ai-in-brazil-to-expand-in)）
- **大洋洲**：澳洲政府表態將把 AI 列為外交政策關鍵課題，同時解讀文章說明澳洲設立「邊境 AI 監管機關」的職責與適用規則。（[來源 A](https://straitstimes.com/asia/australianz/australia-to-treat-ai-as-key-foreign-policy-challenge)、[來源 B](https://globalainews.in/article/australia-frontier-ai-regulator-explained)）

### 商業案例／融資

- **[Sierra](/posts/daily/2026-11-24-funding-sierra)**（站內文章）：完成 17.5 億美元 Series F，由 Greenoaks、Lightspeed 領投，估值半年翻倍至 300 億美元，ARR 破 4 億美元（Stage 1 已有詳細文章）。
- **[Marlowe](https://himiao.ai/en/news/2026-11-23-marlowe-277m-seed)**（Himiao AI）：種子輪 2.77 億美元，估值 11.5 億美元，目標打造不依賴 Nvidia 的推理運算基礎設施。
- **[Agon](https://brp-prod-bcc.bloomberg.com/news/articles/2026-11-23/defense-ai-startup-agon-raises-70-million-series-a-from-vcs-ex-sequoia-boss)**（Bloomberg 等）：A 輪 7000 萬美元，估值 4.5 億美元，由前 Sequoia 高層領投，打造歐洲國防 AI 實驗室。
- **[AidenAI](https://njbiz.com/aidenai-princeton-ai-funding-series-a)**（NJBiz）：A 輪 3200 萬美元，聚焦企業資料應用。
- **[Matters.ai](https://moneycontrol.com/news/business/funding/matters-ai-raises-12-million-in-pre-series-a-round-to-scale-ai-powered-enterprise-data-security-platform-14087413.html)**（Moneycontrol）：Pre-A 輪 1200 萬美元，擴展 AI 驅動的企業資料安全平台。
- **企業導入落地**：GE Appliances 部署 800 個 Gemini Enterprise agent 把缺貨訂單砍 25%，Rockland Trust 用 Claude 打造 HR 助理（兩案例已在深度分析詳述）；OpenAI 同日發布 Scania、Zapier 兩篇案例研究，說明企業如何用 AI 加速全球員工工作流程與核心行銷流程；Audi 攜手 Cerence 推出車載 AI 工作 agent，整合 Microsoft 365。（[來源 A](https://openai.com/index/scania)、[來源 B](https://openai.com/index/zapier)、[來源 C](https://globenewswire.com/news-release/2026/11/23/3408055/0/en/audi-debuts-cerence-ai-s-mobile-work-agent-bringing-enterprise-trusted-access-to-microsoft-365-to-the-car.html)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Sierra 估值 | $30B | [LazyTensor](https://lazytensor.com/news/bret-taylors-enterprise-ai-agent-startup-sierra-raises-1-75-billion-series-f-to-double-valuation-to-30-billion-in-six-months) |
| GE Appliances 缺貨訂單削減 | 25% | [TWARX](https://twarx.com/case-studies/ge-appliances-gemini-enterprise-agents-supplier-backorders) |
| Cairn 自主找到並利用零日耗時 | 11 分鐘 | [Himiao AI](https://himiao.ai/en/news/2026-11-20-monai-cairn-zero-day) |
| GPT-6.2 Astra 定價（input／output，每 1M tokens） | $8.00／$40.00 | [OpenAI](https://openai.com/index/introducing-gpt-6-2-astra-sol) |
| Glama MCP Server Registry 收錄數 | 125,105 個 | [Glama](https://glama.ai/mcp/servers?attributes=category:note-taking) |

## 今日 Digest 一覽

- [AI Agent Arxiv Digest — 2026-11-24](/posts/daily/2026-11-24-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-24](/posts/daily/2026-11-24-ai-agent-github-digest)
- [融資速報｜Sierra Series F $1.75B](/posts/daily/2026-11-24-funding-sierra)
- [模型卡｜GPT-6.2 Astra](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra)
- [定價追蹤｜Claude Sonnet 4.5 退役時程分裂](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence)
- [工具推薦｜GEO & SEO Readiness MCP](/posts/daily/2026-11-24-tool-geo-seo-mcp)
- [AI Engineer 面試日練 — 2026-11-24](/posts/daily/2026-11-24-ai-interview-daily)
- [Product Builder 面試日練 — 2026-11-24](/posts/daily/2026-11-24-product-builder-interview-daily)

## 明日關注

- Cairn／MONAI Label 零日漏洞是否有更多受害機構被證實，官方 patch 升級到 0.8.6 後的實際採用狀況。
- 歐盟對 OpenAI agent 的安全審查結果，以及這波稽核會不會擴大到其他廠商的 agent 產品。
- GPT-6.2 Astra 被資深開發者批評代理任務「幾乎不能用」的具體案例，OpenAI 會不會正面回應或推出修正。

## 今日收穫

之前以為 benchmark 分數進步和 agent 真實可用性大致是同一件事，但 GPT-6.2 Astra 九項官方 benchmark 全面超越前代、價格也降了，卻被多位長期測試 OpenAI 旗艦模型的資深開發者公開批評長流程代理任務「幾乎不能用」——這讓我意識到，規模化評測分數和真實代理可靠性之間的落差，可能比我們願意承認的更大。對台灣團隊來說，選型前自己跑一輪代理任務實測，比看官方 benchmark 數字更能反映真實狀況。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-24](/posts/daily/2026-11-24-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-24](/posts/daily/2026-11-24-ai-agent-github-digest)
- [融資速報｜Sierra Series F $1.75B](/posts/daily/2026-11-24-funding-sierra)
- [模型卡｜GPT-6.2 Astra](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra)
- [定價追蹤｜Claude Sonnet 4.5 退役時程分裂](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence)
- [工具推薦｜GEO & SEO Readiness MCP](/posts/daily/2026-11-24-tool-geo-seo-mcp)
- [NVIDIA 人事變動 — The Decoder](https://the-decoder.com/nvidia-tried-life-without-jensen-huang-and-it-lasted-about-two-weeks/)
- [Anthropic 算力需求推動 xAI 轉向租用策略 — The Decoder](https://the-decoder.com/anthropics-appetite-for-compute-is-pushing-xai-toward-a-rent-over-build-strategy/)
- [Qwen4-Max — Alibaba Cloud Blog](https://www.alibabacloud.com/blog/qwen4-max-one-flagship-for-complex-work-at-a-price-that-scales_603806)
- [GLM-5.4 — The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [強化 Transformer 殘差連接 — Google Research Blog](https://research.google/blog/supercharging-transformer-residual-connections/)
- [SRE-Bench — Columbia DAPLab](https://daplab.cs.columbia.edu/benchmarks/sre-bench)
- [AWS Strands Decider v2 — TheNewStack](https://thenewstack.io/aws-strands-decider-v2)
- [Vercel AI Gateway Audited ZDR — Vercel Blog](https://vercel.com/blog/introducing-audited-zdr-on-ai-gateway)
- [Glama MCP Registry](https://glama.ai/mcp/servers?attributes=category:note-taking)
- [Skyvern MCP Server — Hacker News](https://news.ycombinator.com/item?id=50603421)
- [Amika — YC Launch](https://ycombinator.com/launches/R2H-amika-the-operating-system-for-ai-agents-to-write-and-verify-code)
- [HuggingFace：建立 agentic 評估系統](https://huggingface.co/blog/agentic-evals)
- [NariQ Qwen3.8-27B 量化壓縮 — Hacker News](https://news.ycombinator.com/item?id=50611402)
- [LingSante-3.1-flash — InclusionAI](https://ai.info/news/ant-ling-lingsante-3-1-flash-open-medical-model)
- [Cairn／MONAI Label 零日事件 — Himiao AI](https://himiao.ai/en/news/2026-11-20-monai-cairn-zero-day)
- [CVE-2026-113663 — ox.security](https://ox.security/ox-radar/cve/CVE-2026-113663)
- [CVE-2026-47396 — ox.security](https://ox.security/ox-radar/cve/CVE-2026-47396)
- [CVE-2026-32747 — ox.security](https://ox.security/ox-radar/cve/CVE-2026-32747)
- [HYPR AgentPass — SecurityBrief](https://securitybrief.com.au/story/hypr-launches-agentpass-to-govern-ai-agent-identities)
- [Keycard](https://keycard.ai)
- [歐盟審查 OpenAI agent 安全性 — 2eu.brussels](https://2eu.brussels/en/news/commission-scrutinises-openai-agent-safety-after-agents-bypassed-online-access-restrictions)
- [OpenAI 警告未來系統可能超越安全檢查 — The Decoder](https://the-decoder.com/openai-warns-that-upcoming-ai-systems-could-outpace-safety-checks-and-urges-rivals-to-agree-on-shared-limits/)
- [美國州長協會呼籲聯邦 AI 規範 — NGA](https://nga.org/news/press-releases/governors-call-for-ai-action)
- [新加坡 Know Your Agent 框架 — Blockwest](https://blockwest.co/singapores-central-bank-launches-framework-for-ai-agents-to-handle-payments)
- [印度 AI 融資近乎翻倍 — Economic Times](https://economictimes.indiatimes.com/tech/artificial-intelligence/india-ai-funding-nearly-doubles-to-usd-1-6-billion-in-jan-sept-2026-tracxn/articleshow/136102647.cms)
- [SEBI 為 AI 交易 agent 草擬規則](https://aistocktradingbots.com/blog/sebi-ai-trading-agent-rules-self-rewriting-strategies)
- [孟加拉宣布一年內推出主權 AI — The Daily Star](https://thedailystar.net/business/economy/news/bangladesh-launch-sovereign-ai-within-year-4294046)
- [阿聯推出 Mira AI 助理 — artificial.ae](https://artificial.ae/news/uae-launches-mira-ai-assistant-for-emirates-id-visa-renewals-wor-81e966)
- [南非創投基金 — Citizen](https://citizen.co.za/news/south-africa/ramaphosa-announces-r100m-ai-fund-to-back-south-african-startups)
- [Itaú 收購 NeoSpace — Postcutoff](https://postcutoff.com/e/2026-10-26-itau-acquires-neospace-ai-startup)
- [VUNO 擴展至巴西 — Sedaily](https://en.sedaily.com/business/2026/11/23/vuno-launches-retinal-imaging-ai-in-brazil-to-expand-in)
- [澳洲將 AI 列為外交政策課題 — Straits Times](https://straitstimes.com/asia/australianz/australia-to-treat-ai-as-key-foreign-policy-challenge)
- [澳洲邊境 AI 監管機關解讀 — globalainews](https://globalainews.in/article/australia-frontier-ai-regulator-explained)
- [Marlowe 種子輪 — Himiao AI](https://himiao.ai/en/news/2026-11-23-marlowe-277m-seed)
- [Agon A 輪 — Bloomberg](https://brp-prod-bcc.bloomberg.com/news/articles/2026-11-23/defense-ai-startup-agon-raises-70-million-series-a-from-vcs-ex-sequoia-boss)
- [AidenAI A 輪 — NJBiz](https://njbiz.com/aidenai-princeton-ai-funding-series-a)
- [Matters.ai Pre-A 輪 — Moneycontrol](https://moneycontrol.com/news/business/funding/matters-ai-raises-12-million-in-pre-series-a-round-to-scale-ai-powered-enterprise-data-security-platform-14087413.html)
- [GE Appliances 案例 — TWARX](https://twarx.com/case-studies/ge-appliances-gemini-enterprise-agents-supplier-backorders)
- [Rockland Trust AI HR 助理 — Zensar](https://zensar.com/insights/case-study/banking-and-financial-services/artificial-intelligence/rockland-trust-ai-powered-hr-assistant-claude)
- [Scania 案例 — OpenAI](https://openai.com/index/scania)
- [Zapier 案例 — OpenAI](https://openai.com/index/zapier)
- [BMW 治理型 agent — thenextgentechinsider](https://thenextgentechinsider.com/pulse/bmw-deploys-governance-agent-to-secure-enterprise-ai-scale)
- [Audi 車載 AI 工作 agent — GlobeNewswire](https://globenewswire.com/news-release/2026/11/23/3408055/0/en/audi-debuts-cerence-ai-s-mobile-work-agent-bringing-enterprise-trusted-access-to-microsoft-365-to-the-car.html)
