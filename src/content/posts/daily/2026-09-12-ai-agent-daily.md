---
title: "AI 日報 — 2026-09-12"
date: 2026-09-12
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "OpenAI 把驅動 Codex 的 agent harness 開放成公開 beta 的同一週,資安研究證實攻擊者用同一套 harness 搭配 DeepSeek 模型 7 分鐘拿下網域控制——agent 基礎設施降低的門檻沒有方向性"
tldr: "OpenAI 開放 Agents API 公開 beta,同週 PaperCut 漏洞遭數百個 OpenAI Codex harness + DeepSeek 驅動的 AI Agent 協同攻陷 48 國 395 個組織;WeWorm 展示 AI 兩天寫出 RCE、一週做出零點擊蠕蟲;Cognition 發表 SWE-2 並完成 $2B 融資衝上 $48B 估值;Mistral 完成 €3B Series D、估值破 €21B,從模型公司轉型主權雲端供應商;DeepSeek-V4.1-Flash 發佈,9/14 起取代自家旗艦 V4-Pro。"
draft: false
series:
  name: "AI 日報"
  order: 28
---

## 一句話判斷

**當 OpenAI 把驅動 Codex 的 agent harness 開放成公開 beta 讓開發者用時,同一週的資安研究證實,攻擊者用同一套「OpenAI Codex harness + DeepSeek 模型」組合,最快 7 分鐘就拿下一個組織的網域控制、48 小時內橫掃 48 國 395 個組織——agent 基礎設施降低的建置門檻沒有方向性,台灣企業導入 agent 之前,得先確認自己的偵測與應變速度跟得上攻擊者的自動化速度。**

## 深度分析：Agent 基礎設施降低的門檻,沒有方向性

我認為今天最值得串起來看的,不是單一產品發表,而是「同一種能力同時出現在攻防兩端」這個訊號,而這正好可以用交易成本的框架解釋。

OpenAI 這次把 Agents API 開放公開 beta,本質是把過去只有 Codex 內部團隊用得到的 session 管理、跨 sandbox 編排、context compaction 與復原能力,包裝成開發者可以直接呼叫的介面——這是典型的「降低交易成本」動作:過去要自己組一套 agent harness 才能做長時序自主任務,現在變成調用一組 API。但同一天,資安媒體揭露 PaperCut NG/MF 的兩個 CVE 被攻擊者拿來指揮結合 OpenAI Codex harness 與 DeepSeek 模型的 AI Agent 群,數小時內攻陷 48 國、395 個組織,部分案例最快 7 分鐘取得網域管理權。Calif Research 展示的 WeWorm 案例則從另一個方向印證同一件事:研究團隊用 AI 兩天寫出 RCE exploit、一週內做出透過 WeChat 語音通話零點擊傳播、iOS 與 Android 通吃的蠕蟲。

三個事件疊在一起說明:agent harness 把「建置自主系統」的交易成本降到人人可用的門檻,這件事本身沒有方向性——它同樣降低了「發動大規模自動化攻擊」的交易成本。過去需要一整個團隊、數週時間才能完成的橫向移動與漏洞利用,現在可以壓縮到幾分鐘到幾天。

對從業者、尤其正在評估導入 agent 的台灣企業而言,這代表威脅模型必須更新:不能只把 agent 安全當成「防止 prompt injection」這種模型層問題,更要假設攻擊者手上有跟你一樣好用的 harness 與模型,對手的攻擊速度會用「分鐘」計算而不是「天」。導入 agent 的同時,內部的偵測、隔離與應變流程也得往同樣的自動化程度升級,否則會出現「防守方還在用人工節奏,攻擊方已經用 agent 節奏」的速度差。

## 今日動態

### 廠商動態

**OpenAI**：除了 Agents API 公開 beta,同步為 ChatGPT Work 推出 Data agent,讓企業儀表板能直接連結公司資料來源;另外針對金融業推出 ChatGPT for Financial Services,提供產業垂直的 AI 助理與 agent 工作流程方案。([來源](https://openai.com/index/introducing-the-agents-api/))

**Ant International**：把 Agentic Mobile Protocol（AMP）推廣到 AlipayHK、Starryblu、KakaoPay、Toss 等亞洲錢包,並與 Visa、Mastercard 合作訂出 Know-Your-Agent（KYA）身分驗證框架,鎖定跨境 AI 代理支付。支付寶同步推出 AI 錢包 agent,新增 VibePay、SkillPay、MachinePay 三項「AI Collect」能力。([來源](https://www.scmp.com/tech/big-tech/article/3367183/ant-international-let-ai-agents-shop-across-alipayhk-starryblu-kakaopay-and-toss))

**xAI**：持續擴大 Grok 4.6 通路,陸續上架 Microsoft Foundry、Amazon Bedrock 與 Google Gemini Enterprise Agent Platform,並開放 Grok Bot 給 Cursor Pro/Teams 使用者。([來源](https://x.ai/news))

**Anthropic**：歐盟資安機構 ENISA 在數月談判後取得 Mythos 5 資安 AI 的獨立測試權限,但仍無法接觸 Anthropic 最新模型。([來源](https://www.techrepublic.com/article/news-enisa-anthropic-mythos-5-cyber-ai-access-europe-emea/))

### 模型與基礎設施

**DeepSeek-V4.1-Flash**：552B 總參數 MoE 換上 Causal Encoder-Decoder 架構,Terminal-Bench 4.0 從前代 7.0 分衝到 31.2 分,DeepSWE v1.1 追平 Claude Opus 5;定價比前代更便宜,官方宣布 9/14 起自家旗艦 V4-Pro 全部流量轉發給這隻 Flash 版並按 Flash 計價。詳見[模型卡](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash)。

**Cognition SWE-2**：在 FrontierCode 1.1 上贏過 SWE-1.7 與 Grok 4.6、成本更低,是首個支援 effort levels 的模型,已上線 Devin Desktop/CLI。([來源](https://cognition.com/blog/swe-2))

**OpenAI GPT-5.6 Sol**：預告中,強調在長時程資安任務（漏洞研究與利用）上的效能與效率前緣表現——與同日曝光的 PaperCut 攻擊事件對照,顯示模型廠與攻擊者關注的都是同一種「長時程自主任務」能力。([來源](https://openai.com/index/previewing-gpt-5-6-sol/))

### 工具與生態

**mcp-bi**：開源 Rust MCP server,用同一組工具呼叫統一讀取 Superset、Metabase 到 Power BI 等七種 BI 平台的儀表板,圖表回傳時附上背後的統計數字而非只給截圖。詳見[工具推薦](/posts/daily/2026-09-12-tool-mcp-bi)。

**agentgateway**：開源 vendor-neutral HTTP/gRPC gateway,同時處理傳統流量與 MCP、A2A 等 AI-native 協定,支援角色權限控管與流量可視化。([來源](https://agentgateway.dev/))

### 技術進展

**Temporal v1.32.0**：Standalone Activities 正式 GA,新增獨立暫停/恢復/重置的 operator API 與批次操作,同時把 Nexus 回呼路由改成預設依 URL scheme 走（安全性驅動的 breaking change）。詳見[框架更新](/posts/daily/2026-09-12-framework-temporal-1.32.0)。

### 資安事件

**PaperCut 大規模 AI Agent 協同攻擊**：攻擊者利用 CVE-2026-81578 與 CVE-2026-82078,指揮 OpenAI Codex harness + DeepSeek 模型組成的 AI Agent 群,數小時內攻陷 48 國 395 個組織,最快 7 分鐘取得網域管理權。([來源](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm))

**WeWorm 零點擊蠕蟲**：Calif Research 展示首個透過 WeChat 語音通話零點擊傳播、iOS 與 Android 通吃的蠕蟲,研究團隊用 AI 兩天內寫出 RCE exploit、一週內完成整個蠕蟲。([來源](https://simonwillison.net/2026/Sep/10/calif-research/))

**MCP 工具與自動化框架漏洞**：code.find MCP 工具（CVE-2026-88938,中度風險）未把路徑限制在專案根目錄,可讓 agent session 讀取範圍外原始碼;AutoAgent 存在未驗證遠端程式碼執行漏洞（CVE-2026-86124）,只要連上其 TCP port 就能以 root 身份下指令。([來源](https://netfoundry.io/ai/reachability-watch-cve-kev-tracker-2026-09-11/))

### 法規與治理

**加州簽署 AI 監管法案**：州長 Newsom 簽署兩項法案,回應近日一名離職 Anthropic 研究員對 AI 失控風險的公開警告（該言論獲逾 1.5 億次瀏覽）,促使國會議員重提聯邦 AI 安全法案;OpenAI 同時呼籲國會訂定聯邦級規範。([來源](https://gizmodo.com/newsom-signs-ai-industry-approved-ai-regulation-bills-into-law-in-california-2000809702))

### 區域動態

**中國**

支付寶推出 AI 錢包 agent,恰逢中國推出 AI 支付「Know Your Agent」規範,監理與產品同步跟進代理支付場景。深圳具身智能新創超維動力（Kinetix AI）累計完成逾人民幣 5 億元融資,聚焦人形機器人。([來源](https://www.techinasia.com/news/alipay-to-launch-wallet-agent-for-ai-payments))

**日韓**

南韓機器人新創 AIDIN Robotics 完成 KRW16B 策略輪,由現代機器人與三星創投參與,推動人形機器人從展示走向工廠與造船廠實際應用。([來源](https://techstartups.com/2026/09/11/startup-funding-news-today-september-11-2026-kinetix-ai-aidin-robotics-enigmata-more))

**東南亞**

菲律賓政府公布 $34.4B 的 AI+ Infrastructure Masterplan 最終草案,目標成為區域 AI 基礎設施樞紐。([來源](https://indopacificinsights.substack.com/p/indo-pacific-5x5-september-11th-2026))

**印度**

印度支付主管機關建置集中式登記制度,驗證與監控代表使用者執行交易的 AI agent,從 UPI 系統開始導入。([來源](https://www.archynewsy.com/india-to-launch-registry-for-ai-payment-agents/))

**歐洲**

Improbable 旗下新創 Bolter 獲 $10M 投資,打造給人類與 AI agent 混合團隊使用的訊息平台,強調歐洲數位主權定位——與同日 Mistral 完成 €3B Series D 轉型主權雲的敘事互相呼應,詳見[融資速報](/posts/daily/2026-09-12-funding-mistral)。

**中東**

路透社報導,阿聯官員在伊朗對波灣國家發動飛彈與無人機攻擊後,重新檢視 AI 資料中心佈局計畫;同期中東北非新創 8 月募資達 $375M,年增 117%,主要集中在兩筆 UAE 大型交易。([來源](https://www.usnews.com/news/world/articles/2026-09-11/exclusive-uae-revises-ai-data-center-plan-after-iranian-attacks-sources-say))

**非洲**

埃及宣布投入 $1B 加入 AI 基礎建設競賽;奈及尼亞 AI 新創數量居非洲之冠,但募資僅約 $47M,遠低於肯亞與南非。非洲與中東新創單週募資達 $141.3M。([來源](https://innovation-village.com/ai-africa-intelligence-september-3-9-2026-vol-22/))

**拉丁美洲**

拉丁美洲新創單週募資 $140M,由 Kapital 的 $125M 金融科技輪帶動,同時有 AI、法律科技與財富科技新創獲得資金。([來源](https://www.techloy.com/latin-america-startup-funding-week-37-2026/))

**大洋洲**

調查顯示紐西蘭 81% 企業已用或計畫在 12 個月內導入 AI 資安工具,但多數事件仍靠人工處理,僅 19% 認為資料已準備好讓 AI agent 可靠使用——與今天 PaperCut／WeWorm 事件對照,顯示企業導入速度與資安整備落差仍大。([來源](https://www.reseller.co.nz/article/4220544/most-nz-organisations-using-ai-for-cyber-security-still-rely-on-manual-responses.html))

台灣今日經檢索,未見與 AI agent 直接相關且有可信來源佐證的事件,故省略。

### 商業案例 / 融資 / 併購

**Cognition（Devin）**：完成超過 $2B 融資,估值達 $48B,由 a16z 與 Accel 領投,年化營收從 5 月的 $492M 成長到近 $900M;同日迎來 Dioxus 開發者工具團隊加入,延續近期併購節奏。([來源](https://sacbee.com/news/business/article317209651.html))

**Mistral**：完成 €3B（約 $3.5B）Series D,由 Samsung Electronics 領投,估值從一年前的 €11.7B 衝上超過 €21B,策略從賣模型轉向賣主權雲端算力。詳見[融資速報](/posts/daily/2026-09-12-funding-mistral)。

**Clay**：完成 $115M 融資擴大 AI 銷售 agent 產品線,估值站上先前 $3.1B 的兩倍以上,資金用於 GTM Engineer 獎學金計畫。([來源](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams))

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Cognition 估值 | $48B（融資 $2B） | [sacbee.com](https://sacbee.com/news/business/article317209651.html) |
| PaperCut 攻擊規模 | 48 國 395 個組織、最快 7 分鐘取得網域控制 | [Tech Times](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm) |
| Mistral 估值 | 超過 €21B（一年內近乎翻倍） | [今日融資速報](/posts/daily/2026-09-12-funding-mistral) |
| DeepSeek-V4.1-Flash 定價 | Output 尖峰 $1.20／1M tokens（前代 $1.32） | [今日模型卡](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash) |
| Clay 融資 | $115M,估值逾 $6.2B | [VentureBurn](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams) |

## 今日 Digest 一覽

- 📄 [框架更新｜Temporal v1.32.0](/posts/daily/2026-09-12-framework-temporal-1.32.0)
- 📄 [融資速報｜Mistral Series D €3B](/posts/daily/2026-09-12-funding-mistral)
- 📄 [模型卡｜DeepSeek-V4.1-Flash](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash)
- 📄 [工具推薦｜mcp-bi — 讓 Agent 用同一組工具呼叫讀懂 Superset、Metabase 到 Power BI 的儀表板](/posts/daily/2026-09-12-tool-mcp-bi)
- 📄 [AI Engineer 面試日練 — 2026-09-12：Paper Reading](/posts/daily/2026-09-12-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-09-12：Technical PM](/posts/daily/2026-09-12-product-builder-interview-daily)

## 明日關注

- OpenAI Agents API 公開 beta 後,開發者實際採用速度與第三方 agent 框架（LangGraph、CrewAI）的回應
- PaperCut 事件後續:是否有更多受害組織通報,其他印表機／列印管理系統廠商是否跟進資安體檢
- Cognition SWE-2 與 $48B 估值之後,Devin 的定價策略是否調整,以及 Mistral Samsung 戰略合作的下一步進展

## 今日收穫

之前以為 AI 基礎設施燒錢只能靠股權融資撐,今天看 Mistral 這輪才意識到,「歐洲運算單位」（ECU）多年期採購承諾其實是把雲端銷售合約提前變現——讓大型客戶預付款去蓋資料中心,等於把未來的營收拉到現在當資本支出用,這跟單純融資燒錢是兩種不同的財務邏輯,也可能是資本密集的 AI 基礎設施公司接下來會複製的模式。

## 參考資料

- [OpenAI：Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)
- [OpenAI：Put data to work](https://openai.com/index/put-data-to-work/)
- [OpenAI：Introducing ChatGPT for Financial Services](https://openai.com/index/introducing-chatgpt-financial-services/)
- [OpenAI：Previewing GPT-5.6 Sol](https://openai.com/index/previewing-gpt-5-6-sol/)
- [Cognition：SWE-2](https://cognition.com/blog/swe-2)
- [Cognition Series E $2B at $48B — Sacramento Bee (AP)](https://sacbee.com/news/business/article317209651.html)
- [Cognition：Welcoming Dioxus](https://cognition.com/blog/welcoming-dioxus)
- [Clay raises $115M — VentureBurn](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams)
- [PaperCut AI Agent Mass Exploit — Tech Times](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm)
- [WeWorm — Simon Willison](https://simonwillison.net/2026/Sep/10/calif-research/)
- [CVE/KEV Tracker 2026-09-11 — NetFoundry](https://netfoundry.io/ai/reachability-watch-cve-kev-tracker-2026-09-11/)
- [Newsom 簽署 AI 監管法案 — Gizmodo](https://gizmodo.com/newsom-signs-ai-industry-approved-ai-regulation-bills-into-law-in-california-2000809702)
- [Ant International KYA 框架 — SCMP](https://www.scmp.com/tech/big-tech/article/3367183/ant-international-let-ai-agents-shop-across-alipayhk-starryblu-kakaopay-and-toss)
- [支付寶 AI 錢包 agent — Tech in Asia](https://www.techinasia.com/news/alipay-to-launch-wallet-agent-for-ai-payments)
- [印度 UPI AI Agent 登記制度](https://www.archynewsy.com/india-to-launch-registry-for-ai-payment-agents/)
- [菲律賓 AI+ Infrastructure Masterplan](https://indopacificinsights.substack.com/p/indo-pacific-5x5-september-11th-2026)
- [AIDIN Robotics KRW16B — TechStartups](https://techstartups.com/2026/09/11/startup-funding-news-today-september-11-2026-kinetix-ai-aidin-robotics-enigmata-more)
- [UAE 重新檢視 AI 資料中心佈局 — US News/Reuters](https://www.usnews.com/news/world/articles/2026-09-11/exclusive-uae-revises-ai-data-center-plan-after-iranian-attacks-sources-say)
- [埃及 $1B AI 基礎建設 — Innovation Village](https://innovation-village.com/ai-africa-intelligence-september-3-9-2026-vol-22/)
- [拉丁美洲新創單週募資 $140M — Techloy](https://www.techloy.com/latin-america-startup-funding-week-37-2026/)
- [紐西蘭企業 AI 資安工具導入調查 — Reseller News](https://www.reseller.co.nz/article/4220544/most-nz-organisations-using-ai-for-cyber-security-still-rely-on-manual-responses.html)
- [ENISA 取得 Anthropic Mythos 5 測試權限 — TechRepublic](https://www.techrepublic.com/article/news-enisa-anthropic-mythos-5-cyber-ai-access-europe-emea/)
- [Bolter $10M 歐洲 AI 訊息平台](https://datatech.disruptsmedia.com/ai-ml/bolter-exits-stealth-10m-build-european-ai-messaging-platform)
- [xAI 擴大 Grok 4.6 通路](https://x.ai/news)
- [agentgateway](https://agentgateway.dev/)
