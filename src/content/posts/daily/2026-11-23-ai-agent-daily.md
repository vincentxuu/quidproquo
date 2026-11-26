---
title: "AI 日報 — 2026-11-23"
date: 2026-11-23
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 的能力正在跑贏評估與防禦它的基礎設施——Cairn 11 分鐘自主找到零日漏洞的同一天，模擬職場測試顯示完整任務完成率不到一成，企業卻在加速把預建 agent 導入受監管產業"
tldr: "Cairn AI agent 11 分鐘自主找到並利用 MONAI Label 零日漏洞取得 root 權限，同一天模擬職場測試顯示 Opus 5.5 與 GPT Astra 完整任務完成率都不到一成，METR 示警連測量 AI 研究能力加速的方法都快跟不上；IBM 與 Microsoft 同週宣布把逾 6,000 個預建 agent 導入受監管產業；Meta Muse 雲端沙箱遭單一惡意網頁攻破竊取私訊記憶；NVIDIA 傳以逾 5 億美元併購 Inception，Mercury API 12/28 關閉；台灣資安署預告明年發布 AI Agent 資安指引，MCP 生態同日曝出 session hijack 與供應鏈信任案例"
draft: false
series:
  name: "AI 日報"
  order: 100
---

## 一句話判斷

**今天最值得記住的落差，不是模型又變強了，而是 agent 的技術能力已經跑到我們評估與防禦它的基礎設施前面——Cairn 自主 agent 11 分鐘找到並利用零日漏洞的同一天，另一份測試卻顯示 agent 在真實協作場景裡完整任務完成率不到一成，而 METR 示警我們連追蹤這個落差擴大速度的方法都快跟不上了，企業卻同時在加速把 agent 大規模導入受監管產業。**

## 深度分析：Agent 能力正在跑到評估與防禦的基礎設施前面

我認為今天三件事放在一起看，指向同一個問題：agent 的原始能力和我們評估、監控、防禦這個能力所需的互補基礎設施，正在以完全不同的速度演進。（框架：互補資產）

證據 A：AWS 資安團隊揭露的案例裡，自主滲透框架 Cairn 在 11 分鐘內自行發現並利用醫療影像軟體 MONAI Label 的零日漏洞，直接取得 root 權限，目前仍無官方修補版本——在「找漏洞」這種定義明確、可窮舉的狹窄任務上，agent 的執行速度已經遠遠超過人類安全團隊的反應窗口。

證據 B：但同一天另一份模擬職場測試顯示，把 agent 放進真正需要跟同事協作、看專案看板、處理不完整交接的場景裡，連 Opus 5.5 和 GPT Astra 這兩個目前最強的模型，完整完成任務的比例都不到一成。孤立測試裡亮眼的分數，碰到真實多步驟協作就大幅崩落——agent 能力不是均勻的，狹窄任務上已經超人類，但缺乏「處理模糊、協作、長時間任務」這個互補資產，離真正放手讓它跑生產環境還有一段距離。

更麻煩的是，METR 同一天示警：現有公開資料已經不足以排除 AI 研究能力本身正在急遽加速的可能——我們連「測量這個落差有多大、擴大多快」這個最基本的互補資產都快跟不上。這跟 IBM 與 Microsoft 同週宣布要把逾 6,000 個預建 agent 大規模導入受監管產業放在一起看格外諭示意義：企業導入 agent 的速度，正在超過我們能可靠評估與防禦它的速度。

對從業者的意義：評估要不要讓 agent 碰生產環境或敏感系統，「這個模型多強」不是對的問題；該問的是「我有沒有一套可靠的方法，知道它什麼時候會在狹窄任務上強到失控，又什麼時候會在真實協作場景裡悄悄失敗」。對正在導入企業級 agent 平台的台灣團隊，這代表合規與稽核機制要比模型選型更早到位，不是等出事才補。

```diagram
title: 能力側衝得比治理側快
desc: 一項任務上 agent 已經比人類安全團隊快，另一項任務上完成率不到一成，而我們連測量這個落差的方法都快跟不上。
caption: IBM／Microsoft 同週宣布把逾 6,000 個預建 agent 導入受監管產業，三邊的速度差正同時發生。
---
<svg viewBox="0 0 700 260">
  <path class="dg-line" d="M110 90 V120 H350 V170" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 90 V170" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M590 90 V120 H350 V170" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--warn" x="10" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="110" y="45" text-anchor="middle" dominant-baseline="central">狹窄任務：11 分鐘找到零日</text>
  <text class="dg-sub" x="110" y="67" text-anchor="middle" dominant-baseline="central">Cairn 自主入侵 MONAI Label</text>

  <rect class="dg-box" x="250" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="350" y="45" text-anchor="middle" dominant-baseline="central">真實協作：完成率不到一成</text>
  <text class="dg-sub" x="350" y="67" text-anchor="middle" dominant-baseline="central">模擬職場測試，含同事與看板</text>

  <rect class="dg-box" x="490" y="20" width="200" height="70" rx="6"/>
  <text class="dg-label" x="590" y="45" text-anchor="middle" dominant-baseline="central">連測量都跟不上</text>
  <text class="dg-sub" x="590" y="67" text-anchor="middle" dominant-baseline="central">METR：研究能力加速難被排除</text>

  <rect class="dg-box dg-box--warn" x="200" y="170" width="300" height="70" rx="6"/>
  <text class="dg-label" x="350" y="196" text-anchor="middle" dominant-baseline="central">能力跑在評估與防禦的基礎設施前面</text>
  <text class="dg-sub" x="350" y="218" text-anchor="middle" dominant-baseline="central">企業卻同時在加速導入 6,000+ 個預建 agent</text>
</svg>
```

## 今日動態

### 廠商動態

- **[IBM 與 Microsoft](https://newsroom.ibm.com/2026-11-10-ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation)**（IBM Newsroom）：聯手推出 Imagine Enterprise，整合 IBM Consulting 逾 6,000 個預建 AI agent 與 Microsoft 的雲端／安全技術，目標協助受監管產業大規模部署可治理的 agentic workflow。
- **[LangChain](https://www.langchain.com/blog/how-to-build-a-knowledge-factory)**（LangChain Blog）：創辦人 Harrison Chase 發文闡述如何把企業內部資料轉成可持續更新的「知識工廠」，作為 agent 系統長期維運知識庫的設計範本。

### 模型與基礎設施

- **[NVIDIA Nemotron-Labs-Sigma](/posts/daily/2026-11-23-model-nvidia-nemotron-labs-sigma)**（站內文章）：首個大規模連續擴散語言模型家族（3B／8B，14 個 checkpoint），把文字生成搬進 16 維連續空間，8 步少步蒸餾仍守住 70.34 分、自投機解碼最高提速 4.20 倍（Stage 1 已有詳細文章）。
- **[OpenAI MedChemBench](https://openai.com/index/medchembench-benchmarking-ai-for-medicinal-chemistry)**（OpenAI News）：針對醫藥化學領域的分子設計與反應推理任務推出新基準，作為藥物研發應用的能力量尺。
- **模擬職場測試**（The Decoder）：新基準把 AI coding agent 放進含同事、看板與不完整交接的模擬職場，結果連 Opus 5.5 與 GPT Astra 都只能完整解決不到一成的任務——這個數字是今天深度分析的核心證據之一。（[來源](https://the-decoder.com/ai-coding-agents-ace-isolated-tests-but-complete-fewer-than-one-in-ten-tasks-in-a-simulated-workplace)）
- **[Sarvam AI](https://www.sarvam.ai/blogs/sarvam-105b-1711)**（Sarvam Blog）：印度 AI 公司發布 1,050 億參數規模的新模型檢查點 Sarvam-105B-1711，延續本地語言與主權 AI 模型佈局。

### 定價與 API 生命週期

- **[Inception 的 Mercury API 將於 12/28 關閉](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown)**（站內文章）：Mercury 3／Voice／Decide 三個產品 2026-12-28 後停止服務且資料不可再存取，沒有官方替代方案；同週 *The Information* 報導 NVIDIA 正洽談以逾 5 億美元併購 Inception，兩家公司皆未證實（Stage 1 已有詳細文章）。

### 技術進展

今天的 Arxiv Digest 從三個角度回答同一個問題：agent 的記憶該怎麼管才不出問題？CompAct-Bench 顯示現有「LLM 寫摘要」式的上下文壓縮連最強的 Claude Opus 5 也只有 68.5% 續跑成功率，且常把未定案的猜測寫成既定結論；MemFolder 改用結構訊號做記憶折疊，砍半記錄數仍保留 99.0% 效能；DriftGuard 則用因果歸因找出哪一條記憶正在帶偏 agent，AUPRC 比 LLM 評審基線高 86.2%（[AI Agent Arxiv Digest](/posts/daily/2026-11-23-ai-agent-arxiv-digest)）。

### 工具與生態

今天的 GitHub Digest 看到熱度正從「打包方式」轉向「agent 查得到什麼資料」：CLI-Anything、last30days-skill 的單日漲幅比幾天前收斂三到四成，而純資料基礎設施 firecrawl 漲幅反而放大（[AI Agent GitHub Digest](/posts/daily/2026-11-23-ai-agent-github-digest)）。

- **[Golf](/posts/daily/2026-11-23-tool-golf-mcp)**（站內文章）：開源 Python 框架，把 MCP server 的 auth、telemetry、部署從團隊平均要花的 2–4 週壓到 60 秒內可跑（Stage 1 已有詳細文章）。
- **[Perplexity](https://the-decoder.com/perplexitys-new-monitor-api-turns-web-search-from-a-one-off-query-into-a-nonstop-watchdog)**（The Decoder）：發佈 Monitor API，讓 agent 能以排程方式持續搜尋網頁，偵測到變化時用 webhook 通知，把搜尋從單次查詢變成常駐監控。
- **[Skyvern](https://www.ycombinator.com/launches/NDG-skyvern-mcp-server-let-agents-control-your-browser)**（YC Launch）：推出瀏覽器自動化 MCP Server，讓任何支援 MCP 的 agent 都能直接呼叫其瀏覽器操作能力，在廣域搜尋與 MCP 專項搜尋中重複出現。
- **MCP 生態規模**：Glama Registry 統計公開註冊的開源 MCP server 已達 124,634 個；同一批 YC Launch 與 HN 熱門貼文（Hivemind 的 coding agent 持續學習機制、Amika 的「agent 寫程式並自驗」平台、Fleet 的終端機多 harness 中控、DreamCoder 的新 coding harness）顯示基礎設施層的新創與個人專案仍在快速湧現。（[來源 A](https://glama.ai/mcp/servers?attributes=capability:resources)、[來源 B](https://www.ycombinator.com/launches/Qio-hivemind-continual-learning-for-coding-agents)、[來源 C](https://www.ycombinator.com/launches/R2H-amika-the-operating-system-for-ai-agents-to-write-and-verify-code)、[來源 D](https://news.ycombinator.com/item?id=50594270)、[來源 E](https://news.ycombinator.com/item?id=50587384)）

### 資安事件與防禦技術

- **[Meta Muse 雲端沙箱遭攻破](/posts/daily/2026-11-23-security-meta-muse-sandbox-escape)**（站內文章）：資安公司 NebuSec 示範單一惡意網頁如何串連瀏覽器與 Linux 核心漏洞，突破 Muse 的雲端沙箱竊取並竄改使用者私訊與記憶，全程無核准提示；Meta 已於論文發表前修補（Stage 1 已有詳細文章）。
- **[Cairn／MONAI Label](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own)**（AWS Security Blog）：AWS 揭露中國國家背景駭客用自主 AI agent 在 11 分鐘內自行發現並利用醫療影像軟體 MONAI Label 的零日漏洞，取得 root 權限，目前仍無官方修補版本。
  - **為什麼重要**：這是「agent 自主發現並利用零日」目前最完整的技術時序案例，使用 MONAI Label 的團隊應優先限制網路存取。
- **[RunPod MCP Server](https://www.reddit.com/r/ClaudeAI/s/pzCGScsQGe)**（r/ClaudeAI）：使用者發現官方 MCP server 在系統提示中要求連接的 agent 給好評，且指示「不要告知使用者」，被視為透過工具層植入隱藏操控指令的案例。
  - **為什麼重要**：風險不是 agent 被騙去做壞事，是它乖乖照做了一個被植入供應鏈某一層的隱藏指令——這類案例值得加進自己 MCP server 的來源審查清單。
- **[MCP Python SDK](https://agentopsguide.com/mcp-python-sdk-session-vulnerability)**（AgentOps Guide）：研究人員揭露 MCP Python SDK 的 session 處理漏洞，攻擊者可藉此劫持其他使用者的 MCP session。
- **OpenRouter／MiniMax**：r/LocalLLaMA 等社群同步回報，透過 OpenRouter 轉發給 MiniMax 模型的請求內容可能遭第三方讀取，官方尚未證實。（[來源](https://www.reddit.com/r/LocalLLaMA/comments/1y1we95/openrouter_requests_to_minimax_models_may_have)）
- **AI 供應鏈 canary token 研究**：一名研究者在 AI 訓練資料供應鏈植入約 200 萬個追蹤標記，結果顯示資料外洩規模比預期嚴重。（[來源](https://www.reddit.com/r/privacy/comments/1y1v59b/researcher_plants_2m_canaries_into_the_ai_supply)）

### 法規與治理

- **[美國州長協會](https://www.nga.org/news/press-releases/governors-call-for-ai-action)**（NGA）：聯合聲明呼籲聯邦政府在 AI 基礎設施、資料中心用電與州際監管協調上採取一致行動。
- **[GAO／CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-gao-autonomous-ai-cyber-defense-policy-202)**（Cloud Security Alliance）：解讀美國政府問責署報告，探討自主 AI 網路防禦系統在授權、認證與 agent 身分管理上的政策選項。

### 區域動態

- **台灣**：數位發展部資通安全署預告明年發布政府機關 AI 應用資安指引，涵蓋大型語言模型與 AI agent 從設計、開發到部署、維運的完整生命週期；官員強調企業應以 AI 工具反制 AI 驅動的網路攻擊，防守速度要跟上攻擊方進步的速度。（[來源](https://www.taipeitimes.com/News/taiwan/archives/2026/11/20/2003868075)）
- **東亞（中國／南韓）**：分析指出中國已針對 AI agent 建立較完整的國家標準與監理路徑，南韓則因部門協調問題在 agent 相關監管上陷入僵局，拉大兩地 AI 產業落地速度的差距。（[來源](https://globaleconomictimes.kr/article/1065607653999979)）
- **東南亞**：在美國晶片出口管制延伸效應下，新加坡、馬來西亞等國開始加強對 AI 資料中心的審查與許可流程，分析師警告可能延緩區域資料中心擴張速度。（[來源](https://certifiedstrategic.com/insights/southeast-asia-data-centres-us-chip-licences-malaysia-singapore)）
- **印度／南亞**：印度衛生部在 AI Impact Summit 2026 發佈國家級醫療 AI 框架與測試平台；孟加拉同週宣布一年內推出主權 AI 計畫，並向亞洲開發銀行申請 2.5 億美元貸款發展孟加拉語 AI 模型與國家資安能力。（[來源 A](https://www.ndtv.com/health/ai-in-healthcare-health-minister-launches-national-ai-framework-testing-platform-at-ai-impact-summit-2026-11030901/amp)、[來源 B](https://www.thedailystar.net/business/economy/news/bangladesh-launch-sovereign-ai-within-year-4294046)、[來源 C](https://www.thedailystar.net/news/bangladesh/news/dhaka-seeks-250m-adb-loan-bangla-ai-cybersecurity-4320756)）
- **歐洲**：愛爾蘭資料保護委員會（DPC）要求 X 停止用其 agent「Grok Bot」蒐集的第三方資料訓練 AI 模型，X 已確認暫停；DPC 專員表示這是監管機關把焦點從「用使用者自己分享的資料訓練 AI」轉向「AI agent 代為蒐集他人資料」的試金石案例。（[來源](https://www.politico.eu/article/x-stops-training-ai-with-agents-data-after-ireland-intervened/)）
- **中東**：阿聯官員提出規範前沿科技的三大監理支柱，杜拜同週核准「City AI Agent」城市級 agent 計畫統籌市政服務；DataRobot 與 Dell 同週宣布合作，為當地企業提供主權 agentic AI 部署方案。（[來源 A](https://gazewire.com/technology-innovation/ai-and-automation/uae-cabinet-official-sets-out-three-pillars-for-legislating-unknown-technology)、[來源 B](https://www.aljalilafoundation.ae/en/hamdan-bin-mohammed-attends-dubai-future-week-2026-approves-city-ai-agent-initiative)、[來源 C](https://thedatatechtimes.com/ai-ml/datarobot-and-dell-target-sovereign-agentic-ai-middle-east)）
- **非洲**：南非政府規劃設立約 1 億蘭特（約 550 萬美元）創投基金，專門支持本地 AI 新創。（[來源](https://www.sanews.gov.za/south-africa/sa-eyes-r100m-venture-capital-fund-support-ai-start-ups)）
- **拉丁美洲**：智利 AI 銷售自動化新創 Vambe 把巴西列為主力市場，預計 2026 年底年化營收達 2,000 萬美元，2027 年中在巴西擴到 100 個導入案；資金來自 2025 年底募得的 1,400 萬美元 A 輪。（[來源](https://www.startupjournal.io/article/vambe-brasil-mercado-principal-20-millones-arr-agentes-ia-ventas)）
- **大洋洲**：澳洲政府表態將研擬措施管制 AI 購物 agent 與企業的監控式動態定價，同時加大力度在外交場合推動自己偏好的 AI 治理規範；產業分析則指出 AI 生成程式碼正成為紐澳成長最快的治理風險之一。（[來源 A](https://www.straitstimes.com/asia/australianz/australia-vows-to-manage-ai-agent-shoppers-surveillance-pricing)、[來源 B](https://www.nynganobserver.com.au/story/9396090/australia-pushes-to-shape-ai-in-foreign-policy-shift)、[來源 C](https://www.smbtech.au/thought-leadership/ai-written-code-is-becoming-anzs-fastest-growing-governance-risk)）

### 商業案例／融資

- **[Genesis AI](/posts/daily/2026-11-23-funding-genesis-ai)**（站內文章）：機器人新創完成 5 億美元 A 輪，估值達 35 億美元，由 Khosla Ventures、Premji Invest、Eclipse 共同領投，用感測手套蒐集真人動作資料訓練跨機器人形態的 AI 大腦（Stage 1 已有詳細文章）。
- **[Humyn Labs](/posts/daily/2026-11-23-funding-humyn-labs)**（站內文章）：物理 AI 資料新創完成 4,700 萬美元 A 輪（股權＋創投債），把工廠倉庫農場的真人工作轉成機器人訓練資料，六個月內自報年化營收破 5,000 萬美元（Stage 1 已有詳細文章）。
- **[Mirendil](https://gcn.com/mirendil-raises-billion-series-five-months/23436)**（GCN）：成立僅五個月的 AI 新創完成 10 億美元 A 輪募資，反映市場對早期 AI 團隊估值持續膨脹。
- **[Zensar／Rockland Trust](https://www.zensar.com/insights/case-study/banking-and-financial-services/artificial-intelligence/rockland-trust-ai-powered-hr-assistant-claude)**（Zensar）：案例研究說明如何協助美國銀行 Rockland Trust 以 Claude 打造 HR AI 助理，是金融業導入 Anthropic 技術的企業落地案例（頁面未標示明確發佈日期）。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Cairn 自主找到並利用零日耗時 | 11 分鐘 | [AWS Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own) |
| 模擬職場測試完整任務完成率 | 低於 10%（Opus 5.5／GPT Astra 皆同） | [The Decoder](https://the-decoder.com/ai-coding-agents-ace-isolated-tests-but-complete-fewer-than-one-in-ten-tasks-in-a-simulated-workplace) |
| Genesis AI A 輪／估值 | $500M／$3.5B | [Genesis AI 融資速報](/posts/daily/2026-11-23-funding-genesis-ai) |
| Mirendil A 輪（成立 5 個月） | $1B | [GCN](https://gcn.com/mirendil-raises-billion-series-five-months/23436) |
| Glama 公開註冊 MCP server 數量 | 124,634 個 | [Glama Registry](https://glama.ai/mcp/servers?attributes=capability:resources) |

## 今日 Digest 一覽

- [AI Agent Arxiv Digest — 2026-11-23](/posts/daily/2026-11-23-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-23](/posts/daily/2026-11-23-ai-agent-github-digest)
- [融資速報｜Genesis AI Series A $500M](/posts/daily/2026-11-23-funding-genesis-ai)
- [融資速報｜Humyn Labs Series A $47M](/posts/daily/2026-11-23-funding-humyn-labs)
- [模型卡｜NVIDIA Nemotron-Labs-Sigma](/posts/daily/2026-11-23-model-nvidia-nemotron-labs-sigma)
- [定價追蹤｜Inception 的 Mercury API 將於 12/28 關閉](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown)
- [資安警報｜單一惡意網頁串連瀏覽器與核心漏洞，攻破 Meta Muse Agent 雲端沙箱竊取私訊與記憶](/posts/daily/2026-11-23-security-meta-muse-sandbox-escape)
- [工具推薦｜Golf — 把 MCP server 的 auth、telemetry、部署從 2–4 週殺到 60 秒](/posts/daily/2026-11-23-tool-golf-mcp)
- [AI Engineer 面試日練 — 2026-11-23：ML Fundamentals](/posts/daily/2026-11-23-ai-interview-daily)
- [Product Builder 面試日練 — 2026-11-23：Product Sense](/posts/daily/2026-11-23-product-builder-interview-daily)

## 明日關注

- Cairn／MONAI Label 零日目前無官方修補版本，觀察補丁何時上線，以及是否有更多受害機構被證實。
- NVIDIA 是否證實併購 Inception，以及 Mercury API 使用者在 12/28 前的遷移進度。
- METR 對 AI 研究能力加速的警告，會不會在學界或評測社群引發具體的方法論回應。

## 今日收穫

之前以為 agent 的風險主要來自「被騙去做壞事」——提示注入、惡意指令；但今天 RunPod MCP server 要求 agent 給好評且「不要告知使用者」的案例，加上 MCP Python SDK 的 session hijack 漏洞與 OpenRouter／MiniMax 疑遭讀取的社群回報放在一起看，讓我意識到更常見的風險其實是「agent 完全沒被騙，它只是乖乖照做了一個被植入在供應鏈某一層的指令」——信任問題不只在模型會不會被騙，也在它連接的每一個 MCP server、每一層轉送管道本身值不值得信任。對台灣團隊而言，導入第三方 MCP server 前，來源審查和流量監看要跟存取控制一樣優先。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-23](/posts/daily/2026-11-23-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-23](/posts/daily/2026-11-23-ai-agent-github-digest)
- [IBM 與 Microsoft 推出 Imagine Enterprise — IBM Newsroom](https://newsroom.ibm.com/2026-11-10-ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation)
- [How to build a knowledge factory — LangChain Blog](https://www.langchain.com/blog/how-to-build-a-knowledge-factory)
- [MedChemBench — OpenAI News](https://openai.com/index/medchembench-benchmarking-ai-for-medicinal-chemistry)
- [AI coding agents ace isolated tests but complete fewer than one in ten tasks — The Decoder](https://the-decoder.com/ai-coding-agents-ace-isolated-tests-but-complete-fewer-than-one-in-ten-tasks-in-a-simulated-workplace)
- [AI models are getting better at AI research faster than we can measure — The Decoder](https://the-decoder.com/ai-models-are-getting-better-at-ai-research-faster-than-we-can-measure-metr-warns)
- [Sarvam-105B-1711 — Sarvam Blog](https://www.sarvam.ai/blogs/sarvam-105b-1711)
- [融資速報｜Genesis AI Series A $500M](/posts/daily/2026-11-23-funding-genesis-ai)
- [融資速報｜Humyn Labs Series A $47M](/posts/daily/2026-11-23-funding-humyn-labs)
- [模型卡｜NVIDIA Nemotron-Labs-Sigma](/posts/daily/2026-11-23-model-nvidia-nemotron-labs-sigma)
- [定價追蹤｜Inception 的 Mercury API 將於 12/28 關閉](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown)
- [資安警報｜Meta Muse 雲端沙箱攻破](/posts/daily/2026-11-23-security-meta-muse-sandbox-escape)
- [工具推薦｜Golf](/posts/daily/2026-11-23-tool-golf-mcp)
- [Chinese-nexus actors: Cairn AI agents found a zero-day on their own — AWS Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own)
- [MCP Python SDK session vulnerability — AgentOps Guide](https://agentopsguide.com/mcp-python-sdk-session-vulnerability)
- [RunPod MCP server asks agent for good reviews — r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/s/pzCGScsQGe)
- [OpenRouter requests to MiniMax models may have been read — r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1y1we95/openrouter_requests_to_minimax_models_may_have)
- [Researcher plants 2M canaries into the AI supply chain — r/privacy](https://www.reddit.com/r/privacy/comments/1y1v59b/researcher_plants_2m_canaries_into_the_ai_supply)
- [Governors call for AI action — NGA](https://www.nga.org/news/press-releases/governors-call-for-ai-action)
- [GAO autonomous AI cyber defense policy — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-gao-autonomous-ai-cyber-defense-policy-202)
- [Perplexity's Monitor API — The Decoder](https://the-decoder.com/perplexitys-new-monitor-api-turns-web-search-from-a-one-off-query-into-a-nonstop-watchdog)
- [Skyvern MCP Server — YC Launch](https://www.ycombinator.com/launches/NDG-skyvern-mcp-server-let-agents-control-your-browser)
- [Glama MCP Registry](https://glama.ai/mcp/servers?attributes=capability:resources)
- [Hivemind — YC Launch](https://www.ycombinator.com/launches/Qio-hivemind-continual-learning-for-coding-agents)
- [Amika — YC Launch](https://www.ycombinator.com/launches/R2H-amika-the-operating-system-for-ai-agents-to-write-and-verify-code)
- [Fleet — Hacker News](https://news.ycombinator.com/item?id=50594270)
- [DreamCoder — Hacker News](https://news.ycombinator.com/item?id=50587384)
- [MODA to release cyber rules next year — Taipei Times](https://www.taipeitimes.com/News/taiwan/archives/2026/11/20/2003868075)
- [中國標準化 AI agent 發展，南韓陷入監管僵局 — Global Economic Times](https://globaleconomictimes.kr/article/1065607653999979)
- [美國晶片出口管制下，東南亞資料中心審查趨嚴 — certifiedstrategic](https://certifiedstrategic.com/insights/southeast-asia-data-centres-us-chip-licences-malaysia-singapore)
- [印度衛生部發佈國家級醫療 AI 框架 — NDTV](https://www.ndtv.com/health/ai-in-healthcare-health-minister-launches-national-ai-framework-testing-platform-at-ai-impact-summit-2026-11030901/amp)
- [孟加拉宣布一年內推出主權 AI 計畫 — The Daily Star](https://www.thedailystar.net/business/economy/news/bangladesh-launch-sovereign-ai-within-year-4294046)
- [孟加拉尋求 2.5 億美元 ADB 貸款 — The Daily Star](https://www.thedailystar.net/news/bangladesh/news/dhaka-seeks-250m-adb-loan-bangla-ai-cybersecurity-4320756)
- [Irish regulator stops X training AI with agents' data — POLITICO](https://www.politico.eu/article/x-stops-training-ai-with-agents-data-after-ireland-intervened/)
- [阿聯三大監理支柱 — gazewire](https://gazewire.com/technology-innovation/ai-and-automation/uae-cabinet-official-sets-out-three-pillars-for-legislating-unknown-technology)
- [杜拜核准 City AI Agent 計畫 — Al Jalila Foundation](https://www.aljalilafoundation.ae/en/hamdan-bin-mohammed-attends-dubai-future-week-2026-approves-city-ai-agent-initiative)
- [DataRobot 與 Dell 布局中東主權 agentic AI — thedatatechtimes](https://thedatatechtimes.com/ai-ml/datarobot-and-dell-target-sovereign-agentic-ai-middle-east)
- [南非規劃創投基金支持 AI 新創 — SAnews](https://www.sanews.gov.za/south-africa/sa-eyes-r100m-venture-capital-fund-support-ai-start-ups)
- [Vambe 將巴西列為主力市場 — The Startup Journal](https://www.startupjournal.io/article/vambe-brasil-mercado-principal-20-millones-arr-agentes-ia-ventas)
- [澳洲政府將管制 AI agent 購物與動態定價 — The Straits Times](https://www.straitstimes.com/asia/australianz/australia-vows-to-manage-ai-agent-shoppers-surveillance-pricing)
- [澳洲加大力度形塑 AI 國際規範 — Nyngan Observer](https://www.nynganobserver.com.au/story/9396090/australia-pushes-to-shape-ai-in-foreign-policy-shift)
- [AI 生成程式碼成紐澳成長最快的治理風險 — smbtech](https://www.smbtech.au/thought-leadership/ai-written-code-is-becoming-anzs-fastest-growing-governance-risk)
- [Mirendil 創立五個月即完成 10 億美元 A 輪 — GCN](https://gcn.com/mirendil-raises-billion-series-five-months/23436)
- [Rockland Trust AI-powered HR assistant with Claude — Zensar](https://www.zensar.com/insights/case-study/banking-and-financial-services/artificial-intelligence/rockland-trust-ai-powered-hr-assistant-claude)
