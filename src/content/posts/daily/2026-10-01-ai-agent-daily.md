---
title: "AI 日報 — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 的能力已經不是瓶頸，「怎麼信任一個 agent」才是——今天的攻擊能力擴散、網站收費閘道、FTC 調查與一連串融資，價格全標在信任這一層"
tldr: "Anthropic 紅隊測出開放權重的 GLM-5.3 寫漏洞利用的能力逼近 Claude Mythos Preview，防護 64%–100% 可被繞過；Google 發表 Gemini 4 Argon，先只開放給資安防禦夥伴；Cloudflare 指出過半網路流量已非人類、AI agent 請求一年成長逾 1,700%，並推出以 HTTP 402 向 agent 收費的 Monetization Gateway；FTC 對 OpenAI、Anthropic 等實驗室展開具強制力的消費者保護調查；OpenAI DevDay 推出全天候 agent dots、GPT-6.1 Sol 與 Agents API 公測；Restate、Comp AI 兩筆 A 輪都押在 agent 的復原與合規層"
draft: false
series:
  name: "AI 日報"
  order: 47
---

> 🌏 [English version](/posts/daily/2026-10-01-ai-agent-daily-en)

## 一句話判斷

**今天沒有一則新聞在說「agent 變更聰明了」，全部在說「agent 該怎麼被信任」——身分、權限、收費、復原這一層正在變成 agent 時代真正收錢的地方；台灣企業這個月開始大規模開 agent 權限，該先補的是授權追溯，不是挑模型。**

## 深度分析：從 GLM-5.3 到 Cloudflare，信任成本成了 agent 的主要交易成本

我認為今天的訊號可以用交易成本一句話串起來：跟 agent 打交道的成本，已經不在「它做不做得到」，而在「我怎麼確認它是誰、能做什麼、出事能不能還原」。

證據 A（攻擊能力的擴散）：Anthropic Frontier Red Team 測出智譜開放權重的 GLM-5.3，在 ExploitBench 上 410 次嘗試有 50 次寫出端到端漏洞利用，Claude Mythos Preview 是 56 次；更關鍵的是，用假的掩護故事、預填推理等簡單手法，GLM-5.3 的防護有 64% 到 100% 會被繞過。同一天 Google 發表 Gemini 4 Argon，也選擇先只交給受信任的資安夥伴。封閉模型還能靠「分階段釋出」控風險，開放權重就沒有這道閘門——防守方只能在 agent 動手的那一層補控制。

證據 B（網站端開始替 agent 定價）：Cloudflare 指出今年首次有過半網路流量不是人，過去一年 AI agent 的每日請求成長超過 1,700%。它的回應不是封鎖，而是三件事：用 Web Bot Auth 讓 agent 簽章證明身分、分開搜尋／agent／訓練的放行設定、用 HTTP 402 讓站主按次向 agent 收費。這正是在降低「跟陌生 agent 交易」的辨識與議價成本。

證據 C（資本與監管往同一層集中）：今天 Stage 1 的兩筆 A 輪——Restate 替 agent 工作流做失敗自動復原、Comp AI 讓 agent 全年執行合規——加上慕尼黑 Kontext、葡萄牙 Humanos 兩筆種子輪，全部押在「管住 agent」而不是「讓 agent 更強」。FTC 則對主要實驗室展開具強制力的調查，先前已表態要讓開發者為 agent 行為負責。反面教材也在同一天出現：Storm-3168 用一組外洩在 GitHub 編輯紀錄裡的 service principal 憑證，18 小時刪掉上百項 Azure 資源；Obot 的官方 quickstart 預設關閉驗證，CVSS 9.8。

對台灣 builder 的意義：KPMG 台灣所 10 月 1 日起全員開啟 Copilot 的 Agent 功能，接下來會有更多企業跟進。Delinea 的調查是一面鏡子——澳洲受訪組織 99.6% 曾發生 AI 存取超出授權範圍，只有 42% 能把敏感存取追回一位具名授權人。導入前先確認「每個 agent 動作能不能追到一個人」，比比較模型分數更值得花時間。

## 今日動態

### 廠商動態

**OpenAI**：9/29 DevDay 發表由 GPT-6 Astra 驅動的全天候 agent dots（每個 dot 配一台雲端電腦，Pro、Business Premium、Enterprise 方案先開放）、標準 token 價格為 Astra 四分之一的 GPT-6.1 Sol，以及 Agents API 公測；同時傳出洽談至少 300 億美元過渡輪、估值目標約 1.4 兆美元。（[DevDay](https://www.inside.com.tw/article/42519-openai-devday-2026-dots-chatgpt-space-gpt-6-1-sol)、[融資](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)）

**Anthropic**：路透取得的 IPO 招股資料顯示上半年營運費用 73.3 億美元，上市時程可能延到 11 月期中選舉後；Amazon Bedrock 同步在首爾開放 Claude Opus 5／Sonnet 5、在新加坡開放 Sonnet 5 的境內推論，請求全程不離開該區域。（[CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)、[AWS](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/)）

**Cloudflare**：除了上方的 agent 流量報告與 Monetization Gateway 封閉測試（以 Base 鏈上的 USDC 結算），也把 Containers 重建成啟動快 6 倍、給 agent 用的 sandbox。（[Agentic web](https://blog.cloudflare.com/agentic-web/)、[Monetization Gateway](https://blog.cloudflare.com/monetization-gateway-beta/)、[Sandboxes](https://blog.cloudflare.com/faster-agent-sandboxes/)）

### 模型與基礎設施

**Gemini 4 Argon**：Google 稱在真實世界軟體工程創新高、資安評測與 GPT-6 Astra、Grok 4.7 並列第一，先交給受信任的資安夥伴，並與美國政府做發布前安全評估。（[CNBC](https://www.cnbc.com/2026/09/30/google-gemini-4-argon-ai.html)）

**Naive-N0.5-Flash**：北京 NaiveAI 開源 309B MoE、拿掉全部全注意力層，官方自測 SWE-bench Pro 73.6，細節見[模型卡](/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash)。

**DeepSeek × 華為 Ascend**：9/30 把 TileLang、DeepGEMM、DeepEP、FlashMLA 移植到 Ascend，與既有 Nvidia 版本一一對應。（[Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)）

### 技術進展

**Arxiv**：今天三篇論文在辯論 agent 的鷹架該多厚——JAZ 用單一 invoke 原語打平專門的記憶系統，Harness-Zero 把鷹架行為蒸餾進權重後再拆掉；但 TraceDance 從 25 萬筆真實部署紀錄顯示，前沿模型送出合法工具呼叫的比率有 67.9%，動手前該做的檢查卻只有 8.1% 會做。這正好呼應今天的主題：模型不會自己守規矩，檢查得放在外面。詳見 [Arxiv Digest](/posts/daily/2026-10-01-ai-agent-arxiv-digest)。

**Pydantic AI v2.52.0**：修補 web_fetch 遇到深層巢狀 HTML 會耗盡資源的漏洞，並把 harness 能力收進統一的 Workspace 介面，見[框架更新](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0)。

### 工具與生態

**GitHub**：今天上升的 repo 全在補 agent 周邊——feder-cr/dots 用改過的 Firefox 引擎讓網頁 agent 不被偵測，跟 Cloudflare 推的「agent 簽章報身分」正好是同一場拉鋸的兩端；context-mode 把工具輸出砍 98%。見 [GitHub Digest](/posts/daily/2026-10-01-ai-agent-github-digest)。

**mcp-lint**：用 21 條規則在 agent 呼叫前檢查 MCP tool 的 schema 與描述裡的 prompt injection，可當 CI gate，見[工具推薦](/posts/daily/2026-10-01-tool-mcp-lint)。

### 資安事件

**GLM-5.3 攻擊能力擴散**：見上方深度分析；NIST CAISI 9/17 的評估也稱它是目前資安能力最強的開放權重模型。（[Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities)）

**Storm-3168（JADEPUFFER）**：外洩憑證接管 Azure 租戶並大量刪除資源，但「AI agent 親自下手」的說法證據不足，見[資安警報](/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction)。

**Obot CVE-2026-101065**：開源 agent／MCP 平台的 Docker quickstart 預設關閉驗證又掛載 docker.sock，未驗證請求直接拿到 Owner/Admin，修法是設 `OBOT_SERVER_ENABLE_AUTHENTICATION=true`。（[NVD 摘要](https://github.com/sattyamjjain/agent-audit-kit/issues/835)）

### 法規與治理

**FTC 調查主要 AI 實驗室**：主席 Ferguson 將以具法律約束力的 Civil Investigative Demands 要求 OpenAI、Anthropic 等交出文件與高層作證，METR 也在範圍內。（[The Decoder](https://the-decoder.com/ftc-launches-sweeping-probe-into-openai-anthropic-and-other-ai-labs-over-consumer-protection-concerns/)）

### 區域動態

**台灣**

KPMG 台灣所 10/1 起全體同仁使用付費版 Microsoft 365 Copilot 並啟用 Agent 功能，是四大會計師事務所在台首例全員導入。（[經濟日報](https://udn.com/news/story/7240/9775570)）

**日韓**

Amazon Bedrock 首爾區開放 Claude 境內推論（見廠商動態）；三星 9/30 舉辦第十屆 Samsung AI Forum，主題為「Agentic Shift」。（[Europe Says](https://www.europesays.com/3280251/)）

**印度**

IBM 與 Yotta 推出主權 agentic AI 平台，結合 watsonx Orchestrate 與 Shakti Cloud，資料、推論與治理控制都留在印度境內。（[Economic Times](https://economictimes.indiatimes.com/ai/ai-insights/ibm-yotta-launch-sovereign-agentic-ai-platform-for-indian-enterprises/articleshow/134557690.cms)）

**大洋洲**

Delinea 調查：澳洲 99.6% 受訪組織曾有 AI 工具或 agent 存取超出授權範圍的敏感資料，只有 12% 能即時偵測。（[IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules)）

東南亞、拉丁美洲、非洲、中東今天有檢索，但未找到當日且與 AI agent 直接相關的合格事件，故不收錄。

### 商業案例 / 融資

**Restate**：$20M A 輪，替 agent 工作流做耐用執行層，見[融資速報](/posts/daily/2026-10-01-funding-restate)。

**Comp AI**：$34M A 輪，讓 agent 直接執行合規工作，見[融資速報](/posts/daily/2026-10-01-funding-comp-ai)。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| GLM-5.3 防護被繞過率 | 64%–100% | [Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities) |
| AI agent 每日請求一年成長 | >1,700% | [Cloudflare](https://blog.cloudflare.com/agentic-web/) |
| 澳洲組織曾有 AI 越權存取 | 99.6% | [IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules) |
| TraceDance：動手前檢查通過率 | 8.1% | [Arxiv Digest](/posts/daily/2026-10-01-ai-agent-arxiv-digest) |
| Obot CVE-2026-101065 | CVSS 9.8 | [NVD 摘要](https://github.com/sattyamjjain/agent-audit-kit/issues/835) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-10-01](/posts/daily/2026-10-01-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-10-01](/posts/daily/2026-10-01-ai-agent-github-digest)
- 📄 [模型卡｜Naive-N0.5-Flash](/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash)
- 📄 [框架更新｜Pydantic AI v2.52.0](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0)
- 📄 [工具推薦｜mcp-lint](/posts/daily/2026-10-01-tool-mcp-lint)
- 📄 [資安警報｜Storm-3168（JADEPUFFER）](/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction)
- 📄 [融資速報｜Restate Series A $20M](/posts/daily/2026-10-01-funding-restate)
- 📄 [融資速報｜Comp AI Series A $34M](/posts/daily/2026-10-01-funding-comp-ai)
- 📄 [AI Engineer 面試日練 — LLM & Agent Engineering](/posts/daily/2026-10-01-ai-interview-daily)
- 📄 [Product Builder 面試日練 — AI Product Design](/posts/daily/2026-10-01-product-builder-interview-daily)

## 明日關注

- FTC 的 Civil Investigative Demands 預計數週內送出，具體要的是哪些文件——agent 行為紀錄會不會被列進去
- Gemini 4 Argon 從資安夥伴擴大到一般 API 的時程，以及 Google 說的四類防護（含 prompt injection）細節
- 台灣企業跟進 KPMG 開 agent 權限的速度，以及國內雲端是否推出類似 Bedrock 境內推論的 Claude／GPT 選項

## 今日收穫

之前以為 agent 安全主要是模型對齊問題，期待模型自己學會拒絕和自我檢查；GLM-5.3 被輕易繞過、TraceDance 的 8.1% 合起來看，比較實際的假設是模型不會自己守規矩。對台灣團隊來說，這代表 agent 專案的預算要預留一塊給權限、稽核與復原，而不是全部花在模型 API 上。

## 參考資料

- [GLM-5.3 and the spread of advanced cyber capabilities — Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities)
- [Google rolls out Gemini 4 Argon — CNBC](https://www.cnbc.com/2026/09/30/google-gemini-4-argon-ai.html)
- [The Internet has a second audience — Cloudflare](https://blog.cloudflare.com/agentic-web/)
- [Monetization Gateway beta: charge AI agents with HTTP 402 — Cloudflare](https://blog.cloudflare.com/monetization-gateway-beta/)
- [Faster agent sandboxes — Cloudflare](https://blog.cloudflare.com/faster-agent-sandboxes/)
- [FTC launches sweeping probe into OpenAI, Anthropic and other AI labs — The Decoder](https://the-decoder.com/ftc-launches-sweeping-probe-into-openai-anthropic-and-other-ai-labs-over-consumer-protection-concerns/)
- [CVE-2026-101065 (Obot) — agent-audit-kit](https://github.com/sattyamjjain/agent-audit-kit/issues/835)
- [OpenAI DevDay 2026 發表 dots 與 GPT-6.1 Sol — INSIDE](https://www.inside.com.tw/article/42519-openai-devday-2026-dots-chatgpt-space-gpt-6-1-sol)
- [OpenAI Targets $30 Billion in Funding at $1.4 Trillion Value — Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)
- [Anthropic's IPO prospectus shows sweeping AI vision, surging costs — CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)
- [Anthropic models on Amazon Bedrock for in-region inference in Seoul and Singapore — AWS](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/)
- [DeepSeek Open-Sources Ascend Versions of TileLang, DeepGEMM and More — Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)
- [KPMG 全面導入 AI！10月起全體員工開放使用 Copilot — 經濟日報](https://udn.com/news/story/7240/9775570)
- [Samsung Electronics Marks 10th AI Forum — Europe Says](https://www.europesays.com/3280251/)
- [IBM, Yotta launch sovereign agentic AI platform for Indian enterprises — Economic Times](https://economictimes.indiatimes.com/ai/ai-insights/ibm-yotta-launch-sovereign-agentic-ai-platform-for-indian-enterprises/articleshow/134557690.cms)
- [Australian firms struggle to enforce AI data rules — IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules)
