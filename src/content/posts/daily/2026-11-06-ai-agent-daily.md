---
title: "AI 日報 — 2026-11-06"
date: 2026-11-06
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "一個人租 GPU 跑 12 個 AI agent 就打穿台灣消防與派遣系統，跟 OpenAI 自動修補 948 個 Linux kernel 漏洞一樣快——AI agent 正同時砍半攻防兩端的交易成本"
tldr: "OpenAI 自動化 pipeline 耗資 $1.21M 修補 Linux kernel 948 個權限提升漏洞；Acronis 揪出 BOSSAI，台灣花蓮一人操作 12 個 AI agent 打穿 11 國數百組織含台北消防急救系統；華為騰訊阿里等 20 家中國企業在烏鎮簽署 AI agent 安全自律公約；百度開源 280B 參數 ERNIE-5.5-Flash-Base，Cognition 發布美國製低成本 coding model SWE-2 Flash；Sand.ai 完成 2 億美元 A+輪躍升獨角獸，Kalepa 取得 7500 萬美元 B 輪"
draft: false
series:
  name: "AI 日報"
  order: 83
---

> 🌏 [English version](/posts/daily/2026-11-06-ai-agent-daily-en)

## 一句話判斷

**BOSSAI 案例證明一個人租 GPU 跑 12 個 AI agent 就能打穿台灣消防與派遣系統，跟 OpenAI 花 $1.21M 自動修補 948 個 Linux kernel 漏洞的速度一樣快——AI agent 正在同時砍半攻防兩端的交易成本，防守方過去靠的「規模經濟」護城河正在消失，只能換成治理機制重建。**

## 深度分析：AI agent 同時砍半攻防兩端的交易成本

我認為今天三件事放在一起看，指向同一個結構性轉變：讓多步驟攻擊或多步驟防禦可行的交易成本，正在被 AI agent 同時砍半——而且不分陣營。（框架：交易成本）

OpenAI 用一條自動化 pipeline、花費約 $1.21M，找出並驗證修補了 Linux kernel 948 個本地權限提升漏洞——這種規模的漏洞獵捕過去需要整個資安團隊耗時數月，現在壓縮成一筆可編列預算的研究支出。同一週，資安公司 Acronis 揪出代號 BOSSAI 的攻擊行動：一名在台灣花蓮的操作者，靠租用 GPU 跑 12 個 AI agent（部分負責建伺服器、部分負責掃描與寫 exploit），不需要讓 agent 互相對話，自己手動把輸出貼來貼去，就打穿了 11 國數百個組織，包括台北市一個消防病患照護平台（暴露 2018 年以來的心電圖與救護車影像）、某縣市 119 派遣系統，以及泰國大學與墨西哥電信資料。一個人跟一家研究室，現在用的是同一種工具。

這兩件事合起來說明，過去保護防守方的「規模經濟」——只有大型組織才養得起漏洞獵捕或攻擊團隊——正在消失，而且消失的方向是雙向的。這也是為什麼 CrowdStrike 持續加碼 agent 行為監控、Cloudflare 要網站先學會分辨「這是不是一個 agent」、而華為騰訊阿里等 20 家中國企業在烏鎮峰會簽署 agent 安全自律公約：大家都在用治理機制搶著重建那個正在消失的規模經濟護城河。

對從業者的意義：如果你的資安假設是「我們規模小，沒人會花力氣打我們」，BOSSAI 案例直接推翻這個假設——它打的正是台灣地方消防、派遣系統這類過去被認為「不值得攻擊」的中小型公共基礎設施，原因只是它們還有預設密碼與未修補的舊開放 port。台灣團隊這週該做的具體動作，是盤點對外服務是否還有預設帳密與未關閉的舊服務，而不是等對手證明自己值得被盯上。

```diagram
title: AI agent 正在同時砍半攻防兩端的交易成本
desc: 過去只有大型組織才養得起漏洞獵捕或攻擊團隊；今天 OpenAI 與 BOSSAI 兩個案例顯示，同一套 AI agent 工具正在讓防守端與攻擊端的規模門檻一起消失。
caption: 左側為 OpenAI 自動化漏洞獵捕（$1.21M 修補 948 個 Linux kernel 漏洞），右側為 BOSSAI 一人操作 12 個 AI agent 攻陷 11 國數百組織，包含台灣消防與派遣系統。
---
<svg viewBox="0 0 640 300">
  <rect class="dg-box" x="32" y="40" width="248" height="220" rx="8"/>
  <text class="dg-tag" x="52" y="68" dominant-baseline="central">防守端</text>
  <text class="dg-label" x="156" y="100" text-anchor="middle" dominant-baseline="central">OpenAI 自動化漏洞獵捕</text>
  <text class="dg-sub" x="156" y="130" text-anchor="middle" dominant-baseline="central">研究預算 $1.21M</text>
  <text class="dg-sub" x="156" y="154" text-anchor="middle" dominant-baseline="central">修補 948 個 Linux kernel 漏洞</text>
  <text class="dg-sub" x="156" y="178" text-anchor="middle" dominant-baseline="central">規模等同整個資安團隊</text>

  <path class="dg-line" d="M280 150H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="360" y="40" width="248" height="220" rx="8"/>
  <text class="dg-tag" x="380" y="68" dominant-baseline="central">攻擊端</text>
  <text class="dg-label" x="484" y="100" text-anchor="middle" dominant-baseline="central">BOSSAI 一人操作</text>
  <text class="dg-sub" x="484" y="130" text-anchor="middle" dominant-baseline="central">12 個 AI agent 分工</text>
  <text class="dg-sub" x="484" y="154" text-anchor="middle" dominant-baseline="central">攻陷 11 國數百組織</text>
  <text class="dg-sub" x="484" y="178" text-anchor="middle" dominant-baseline="central">規模不輸國家級團隊</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **OpenAI** | 發佈 Images 2.6，為 ChatGPT、Codex 與 API 帶來更快圖片生成速度、GIF 製作、更精確編輯與新 API 控制項 | [OpenAI](https://openai.com/index/introducing-images-2-6/) |
| **Meta** | 個人 AI agent app Muse 新增語音互動與表情化虛擬形象，提供更自然的人機互動方式 | [Meta](https://about.fb.com/news/2026/11/introducing-muse-ai-voice-expressive-avatars/) |
| **Google** | Research 團隊提出 Agile Deliberation 框架，協助人類團隊用 AI 快速界定政策與內容的模糊判斷地帶 | [Google Research](https://research.google/blog/agile-deliberation-how-ai-helps-humans-define-the-gray-areas/) |
| **NVIDIA** | 分享內部如何用 AI agent 整合運算、網路、硬體與排程多個儀表板，簡化 SRE 對 GPU 叢集的巡檢工作 | [NVIDIA](https://developer.nvidia.com/blog/how-nvidia-uses-ai-agents-to-streamline-ai-factory-operations/) |
| **Cloudflare** | 同日發兩篇：提出框架協助網站識別、管理代表使用者行動的 AI agent 流量；另推出工具讓網站擁有者看見個人 AI agent 的存取並設定規則 | [Cloudflare 1](https://blog.cloudflare.com/trusted-agent-delegation/)、[Cloudflare 2](https://blog.cloudflare.com/personal-agents-visibility-control/) |
| **Google Cloud** | 基於內部跑 Gemini for work 的基礎設施，推出 Agent Compute Engine 與配套治理工具，服務企業 AI agent 部署 | [SecurityBrief Asia](https://securitybrief.asia/story/google-cloud-launches-ai-agent-engine-governance) |
| **阿里雲** | AI Gateway 新增 FinOps Session Observability，用 session 層級成本細分協助企業優化 agent 使用成本 | [阿里雲](https://www.alibabacloud.com/blog/ai-gateway-launches-finops-session-observability-to-help-enterprises-optimize-agent-costs_603734) |

### 模型與基礎設施

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **NVIDIA** | 在 Hugging Face 發佈 Cosmos 3 開放模型，新增互動式世界模擬能力，為 physical AI 與機器人訓練提供模擬環境 | [Hugging Face](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation) |
| **百度** | 釋出 ERNIE-5.5-Flash-Base 及 BF16 版本，280B 參數的開源基礎模型刻意不含微調，留給開發者自行後訓練 | [Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| **Visa** | 推出業界首個 AI 購物 Agentic Commerce Benchmark，測試 22 個模型完成 15 項購物任務，整體通過率僅 57.2% | [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html) |
| **Phonon TTS** | 新發佈的裝置端語音合成模型主打高品質 on-device 語音合成，在多項語音 benchmark 上取得領先成績 | [Hugging Face](https://huggingface.co/blog/phonon-tts) |

### 定價與 API 生命週期

Google DeepMind 將 Gemini Omni 1.2 Flash 影片生成模型片長延長到 15 秒並降價 30%，每秒 720p 僅 $0.07——是今年第三波影片生成降價，持續把影片生成成本推向跟文字生成同一個量級。（[The Decoder](https://the-decoder.com/googles-gemini-omni-1-2-flash-stretches-ai-video-clips-to-15-seconds-and-cuts-pricing-by-30-percent/)）

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **OpenAI** | 自動化 pipeline 找出、驗證並修補 Linux kernel 948 個本地權限提升漏洞，耗資約 $1.21M research run | [OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/) |
| **BOSSAI（台灣）** | Acronis 揪出一名台灣花蓮操作者用 12 個 AI agent 組成的攻擊 mesh，打穿 11 國數百組織，包括台北消防病患照護平台與縣市 119 派遣系統 | [Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/) |

### 法規與治理

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **華為／騰訊／阿里等 20 家中國企業** | 在世界互聯網大會烏鎮峰會簽署自願公約，強化 AI agent 安全防護、保留使用者對關鍵決策的控制權，並推動跨廠商 agent 互通 | [MLex](https://www.mlex.com/mlex/articles/2546595/huawei-tencent-back-ai-agent-pact-on-safety-user-control) |
| **美國國防部** | 技術長表示聯邦政府將在本月公布適用於國內 AI 實驗室的完整法規清單，釐清監管範圍 | [Reuters](https://www.reuters.com/legal/litigation/pentagon-chief-tech-officer-says-government-will-detail-laws-that-apply-ai-labs-2026-11-04) |

### Coding Agent 賽道

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Cognition（Devin）** | 發佈 SWE-2 Flash，標榜為「完全美國製」coding model，在低成本與高速度間取得新平衡 | [Cognition](https://cognition.com/blog/swe-2-flash) |
| **Cursor** | 提出「自駕程式碼庫」願景：agent 自動合併 PR、管理上線並監控生產環境 | [Cursor](https://cursor.com/blog/self-driving-codebases) |
| **Microsoft Agent Framework** | 新增可安裝的 builder skills，讓 coding agent 取得官方維護的 .NET／Python 開發指引 | [Microsoft](https://devblogs.microsoft.com/agent-framework/give-your-coding-agent-a-head-start-with-microsoft-agent-framework-skills-for-net-and-python/) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **台灣** | Acronis 揪出 BOSSAI 攻擊 mesh——一名花蓮操作者用 12 個 AI agent 打穿台北消防病患照護平台與縣市 119 派遣系統，暴露 2018 年以來的病患資料，詳見上方資安事件段 |
| **中國／香港** | Zetrix AI 與中國信通院在烏鎮世界互聯網大會推出跨境 AI agent 身分驗證服務 KYA，規劃提交 ITU 國際標準；同場華為騰訊阿里等 20 家企業簽署 agent 安全自律公約（詳見上方法規段） |
| **東南亞** | 越南科技部主辦的 AI4VN 2026 峰會在河內開幕，首次將「Agentic AI 與學習的未來」設為大會主軸，Viettel、FPT、VNPT 等企業同步加速 AI 原生資料中心建設 |
| **中東（含以色列）** | 阿聯副總理謝赫穆罕默德宣布推出年度 Government Challenge，獎金 AED 900 萬，邀請聯邦公務員設計 agentic AI 解決方案；阿布達比 AIREV 的主權 agentic AI 平台取得新加坡 Terra Invest 戰略投資 |
| **非洲** | INSEAD 背景的奈及利亞電信基礎設施新創 KrosAI 取得 13.5 萬美元種子資金，簡化新興市場部署 AI 語音 agent 的難度 |
| **拉丁美洲** | 哥倫比亞 Celes 完成 500 萬美元 A 輪，由巴西 SP Ventures 領投，用 AI agent 替零售商做需求預測與補貨自動化，正式進軍巴西市場 |

已檢索但未收錄：日本／韓國、印度／南亞、大洋洲（澳紐）——日韓今天查到的多是小額募資（如日本 Intentia 約 6.4 萬美元債權輪）與展會層級的周邊新聞，沒有跟 AI agent 直接相關、達到單日事件門檻的消息；大洋洲查到的多是人事任命與泛治理評論，沒有合格的平台／法規／融資事件；印度／南亞本輪補掃額度已用於上述四區，母集信號本身亦無相關事件，一併省略。

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Sand.ai** | 北京影片生成新創完成 Series A+ 延伸輪 2 億美元，估值突破 10 億美元躍升獨角獸，10 個月內累計募資達 3 億美元 | [DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283) |
| **Kalepa** | AI 保險核保新創完成 7500 萬美元 B 輪，估值 4.7 億美元，客戶回報核保工時減少三到六成 | [Reuters](https://www.reuters.com/legal/transactional/ai-powered-insurance-startup-kalepa-valued-470-million-new-funding-round-2026-11-05) |

## 技術進展

今天沒有 Arxiv Digest，框架更新方面，Mastra 為 agent 框架的 Observability 新增 TTFT（首個 token 時間）與 TTFC 延遲指標追蹤，協助團隊掌握使用者體感速度，是繼知識庫、MCP Events 等功能後本月又一次 observability 補強（[Mastra](https://mastra.ai/blog/introducing-latency-metrics)）。

## 工具與生態

今天沒有 GitHub Digest，工具動態方面：Mistral 推出 Studio，讓企業用 Le Chonk 系列模型建置、部署 agent、workflow 與應用，並掌控自己的模型、資料與基礎設施；阿里雲說明如何用 durable execution 技術讓 AI agent 在中斷後能透過狀態持久化可靠地恢復任務；Zep 推出 Agent Skills，把 agent 的執行歷程轉換成可驗證的程序，讓較小模型在商業任務 benchmark 上接近 Claude Opus 5.5 的表現。

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Mistral** | Studio 企業 agent 建置與部署平台 | [Mistral](https://mistral.ai/news/build-with-studio/) |
| **阿里雲** | Durable Agent，讓 agent 在雲端長時間可靠運行 | [阿里雲](https://www.alibabacloud.com/blog/durable-agent-explained-how-to-keep-an-agent-running-reliably-in-the-cloud-over-the-long-term_603735) |
| **Zep** | Agent Skills，把執行歷程轉為可驗證程序 | [Zep](https://www.getzep.com/blog/introducing-zep-agent-skills) |
| **Kong** | 開源 Volcano SDK，結合 LLM 推理與透過 MCP 工具採取真實世界行動的 TypeScript agent SDK | [Kong](https://konghq.com/blog/product-releases/kong-ai-registry) |
| **Dharma Field Extractor** | 將任意文件輸入轉換為結構化 JSON 欄位輸出的開源模型，適合 agent 處理非結構化文件的前處理任務 | [Hugging Face](https://huggingface.co/blog/Dharma-AI/dharma-field-extractor) |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| OpenAI 修補 Linux kernel 漏洞數 | 948 個，耗資約 $1.21M | [OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/) |
| Visa Agentic Commerce Benchmark 通過率 | 57.2% | [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html) |
| 百度 ERNIE-5.5-Flash-Base 參數量 | 280B | [Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| Sand.ai A+ 輪金額／估值 | $200M／估值突破 $1B | [DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283) |
| BOSSAI 攻擊規模 | 12 個 AI agent／11 國數百組織 | [Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/) |

## 明日關注

- Acronis 揪出 BOSSAI 之後，台灣消防與縣市派遣系統的修補進度，以及是否出現第二個模仿者
- 阿里雲 Durable Agent、Google Cloud Agent Compute Engine 等雲端長時執行 agent 基建相繼出現，下一步會不會是跨雲遷移與鎖定成本的競爭
- 20 家中國企業簽署的 AI agent 安全自律公約，後續是否會轉成有約束力的跨廠商互通標準

## 今日收穫

之前以為多 agent 協同作案需要寫好一套 orchestration 框架讓 agent 互相溝通；看完 BOSSAI 才意識到，根本不需要——操作者自己手動把一個 agent 的輸出複製貼到下一個 agent 的輸入框，就能串起 12 個角色分工的攻擊鏈。這代表「有沒有自動化 orchestration」不是判斷威脅規模的可靠指標，人力複製貼上就能達到類似的協同效果，防守端不能只用「這看起來需要很強的工程能力」來評估對手。

## 參考資料

- [A thousand fewer paths to root — OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/)
- [BOSSAI: Inside the AI attack mesh that targeted Taiwan's emergency services — Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/)
- [Introducing Images 2.6 — OpenAI](https://openai.com/index/introducing-images-2-6/)
- [Agile Deliberation: How AI helps humans define the gray areas — Google Research](https://research.google/blog/agile-deliberation-how-ai-helps-humans-define-the-gray-areas/)
- [Introducing Muse AI voice & expressive avatars — Meta](https://about.fb.com/news/2026/11/introducing-muse-ai-voice-expressive-avatars/)
- [How NVIDIA uses AI agents to streamline AI factory operations](https://developer.nvidia.com/blog/how-nvidia-uses-ai-agents-to-streamline-ai-factory-operations/)
- [Trusted agent delegation — Cloudflare](https://blog.cloudflare.com/trusted-agent-delegation/)
- [Personal agents visibility & control — Cloudflare](https://blog.cloudflare.com/personal-agents-visibility-control/)
- [Google Cloud launches AI Agent Engine & governance — SecurityBrief Asia](https://securitybrief.asia/story/google-cloud-launches-ai-agent-engine-governance)
- [AI Gateway launches FinOps Session Observability — 阿里雲](https://www.alibabacloud.com/blog/ai-gateway-launches-finops-session-observability-to-help-enterprises-optimize-agent-costs_603734)
- [NVIDIA Cosmos interactive world simulation — Hugging Face](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation)
- [ERNIE-5.5-Flash-Base — 百度 / Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [Visa releases first-of-its-kind Agentic Commerce Benchmark — Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html)
- [Phonon TTS — Hugging Face](https://huggingface.co/blog/phonon-tts)
- [Google's Gemini Omni 1.2 Flash stretches AI video clips to 15 seconds and cuts pricing by 30% — The Decoder](https://the-decoder.com/googles-gemini-omni-1-2-flash-stretches-ai-video-clips-to-15-seconds-and-cuts-pricing-by-30-percent/)
- [Huawei, Tencent back AI agent pact on safety, user control — MLex](https://www.mlex.com/mlex/articles/2546595/huawei-tencent-back-ai-agent-pact-on-safety-user-control)
- [Pentagon chief technology officer says government will detail laws that apply to AI labs — Reuters](https://www.reuters.com/legal/litigation/pentagon-chief-tech-officer-says-government-will-detail-laws-that-apply-ai-labs-2026-11-04)
- [SWE-2 Flash — Cognition](https://cognition.com/blog/swe-2-flash)
- [Self-driving codebases — Cursor](https://cursor.com/blog/self-driving-codebases)
- [Give your coding agent a head start with Microsoft Agent Framework skills — Microsoft](https://devblogs.microsoft.com/agent-framework/give-your-coding-agent-a-head-start-with-microsoft-agent-framework-skills-for-net-and-python/)
- [Zetrix AI, China Academy of Information launch cross-border agent identity service KYA — Yahoo Finance SG](https://sg.finance.yahoo.com/news/zetrix-ai-china-academy-information-085600223.html)
- [Vietnam AI4VN 2026 summit opens in Hanoi](https://dev.to/vuhung16au/vietnam-ai-llm-daily-briefing-nov-05-2026-130d)
- [UAE launches AED 9M government AI challenge — Middle East AI News](https://www.middleeastainews.com/p/uae-launches-government-ai-challenge)
- [Abu Dhabi's AIREV secures backing of Singapore's Terra Invest — Arabian Business](https://www.arabianbusiness.com/abnews/abu-dhabis-airev-secures-backing-of-singapores-terra-invest-for-strategic-funding-round)
- [INSEAD-backed KrosAI raises $135K to wire AI voice agents into Africa's PH — Dealroom](https://dealroom.co/news/169763-insead-backed-krosai-raises-135k-to-wire-ai-voice-agents-into-africas-ph)
- [Colombia's Celes raises $5M Series A to enter Brazil's retail market — Dealroom](https://dealroom.co/news/167686-colombias-celes-raises-5m-series-a-to-enter-brazils-retail-market)
- [Sand.ai enters unicorn club — DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283)
- [AI-powered insurance startup Kalepa valued at $470 million in new funding round — Reuters](https://www.reuters.com/legal/transactional/ai-powered-insurance-startup-kalepa-valued-470-million-new-funding-round-2026-11-05)
- [Introducing latency metrics for Mastra agents](https://mastra.ai/blog/introducing-latency-metrics)
- [Build with Studio — Mistral](https://mistral.ai/news/build-with-studio/)
- [Durable Agent explained — 阿里雲](https://www.alibabacloud.com/blog/durable-agent-explained-how-to-keep-an-agent-running-reliably-in-the-cloud-over-the-long-term_603735)
- [Introducing Zep Agent Skills](https://www.getzep.com/blog/introducing-zep-agent-skills)
- [Kong launches AI Registry / Volcano SDK](https://konghq.com/blog/product-releases/kong-ai-registry)
- [Dharma Field Extractor — Hugging Face](https://huggingface.co/blog/Dharma-AI/dharma-field-extractor)

以上來源檢索於 2026-11-06。
