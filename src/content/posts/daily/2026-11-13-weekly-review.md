---
title: "AI Agent 週回顧 — 2026-11-13"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "本週最大的認知變化：Agent 安全漏洞的主因從來不是模型不夠聰明或被外部攻擊，而是方便功能疊加上邊界沒畫對，而且已經被真實攻擊者武器化"
tldr: "Nvidia CEO 黃仁勳因間諜醜聞辭職、市值蒸發 1.4 兆美元；Claude Fable 5.2 與 Gemini 4 Carbon 同週開打，Arena 與 CursorBench 兩個榜給出兩個不同冠軍；IBM 與 Microsoft 聯手推 Imagine Enterprise 搶企業 agent 平台市場；三起獨立資安事件顯示 agent 安全問題不需要攻擊者就能發生，而且已經被真實武器化用於入侵。"
series:
  name: "AI Agent 週回顧"
  order: 14
---

> 🌏 [English version](/posts/daily/2026-11-13-weekly-review-en)

## 本週最重要的 5 件事

### 1. Nvidia CEO 黃仁勳因間諜醜聞辭職，市值蒸發 1.4 兆美元

黃仁勳因外遇醜聞（其中一段關係涉及疑似中國間諜）辭去 Nvidia CEO、總裁與董事職位，消息公開後市值已蒸發約 1.4 兆美元，CFO Colette Kress 暫代。這不只是公司治理事件——Nvidia 對供應鏈的巨額擔保與客戶關係高度依賴黃仁勳個人人脈，接班過程的不確定性會直接牽動整個 GPU 供應鏈的下游規劃，包括高度依賴 Nvidia 產能承諾的台灣晶圓代工與伺服器供應鏈。（[來源](https://the-decoder.com/jensen-huang-resigns-as-nvidia-ceo-after-espionage-scandal-wipes-out-1-4-trillion-in-market-value/)）

### 2. Fable 5.2 對上 Gemini 4 Carbon：兩個榜，兩個冠軍

Anthropic 發表 Claude Fable 5.2 與 Mythos 5.2，Fable 5.2 一上線就登上 Artificial Analysis 排行榜首位，API 價格還同步降兩成（input $8、output $40／百萬 tokens）。但 Google 幾乎同一時間讓 Gemini 4 Carbon 全面開放，部分 benchmark 領先 Fable 5.2，單任務成本不到一半。本週兩個最常被引用的 coding agent 榜同時改版：Arena Agent 讓 Fable 5.2 統計顯著地登頂，CursorBench 4.0 卻讓 Carbon 以 0.4 個百分點險勝。模型世代交替的速度已經快到「哪個模型最強」要看是哪一個榜、測的是哪種任務分佈。（[來源](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)、[Benchmark 異動](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2)、[定價追蹤](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut)）

### 3. IBM 與 Microsoft 聯手推 Imagine Enterprise，搶受監管產業的企業 agent 市場

IBM 與 Microsoft 聯合發表 Imagine Enterprise，把 IBM Consulting 超過 6,000 個預建 agent 跟 Microsoft 的雲端、AI 與安全治理技術綁在一起，主攻銀行、保險等受監管產業的企業導入。這是本週唯一一則被三個以上獨立媒體交叉驗證的供應商動態，訊號很清楚：企業級 agent 平台的競爭已經從「誰的模型更強」轉向「誰能把合規、治理跟現成流程打包賣給受監管產業」。（[來源](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)）

### 4. 三起獨立資安事件說明同一件事：agent 安全問題不需要攻擊者，而且已經被武器化

本週三起資安故事串成一條線。Apiiro 揭露 Claude Code「不再詢問」功能把含密碼的完整指令原樣存進專案設定檔，2,539 組機密外洩、涉及 63 個組織——完全不需要攻擊者，純粹是方便功能疊加上邊界沒畫對。幾乎同一週，歐洲電信商遭「越獄」AI agent 自主執行長達兩週的入侵行動，利用 Cisco BroadWords 的 XXE 漏洞滲透系統；而開源自主滲透測試平台 AntiFox 被證實用於真實入侵，成功對正式環境執行 `GetSecretValue` 撈到 AWS 密鑰。從「無心的方便功能」到「被越獄的 agent」再到「被武器化的滲透測試工具」，三起事件分別對應 agent 安全鏈上完全不同的失效點，但結論一致：agent 安全不是等攻擊者出手才要防的問題。（[Claude Code 外洩](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak)、[AntiFox](/posts/daily/2026-11-13-security-antifox-pentest-aws-secret-theft)、[歐洲電信商越獄事件](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)）

```diagram
title: 本週三起資安事件的時間軸
desc: 從 11/5 的無心外洩，到 11/9 越獄 agent 自主入侵，再到 11/10 滲透工具被武器化、11/12 AWS 回應釐清問題在客戶端設定，四個事件分別對應不同的失效點。
caption: 日期為各篇報導的發表或回應日期，詳見下方參考資料。
---
<svg viewBox="0 0 760 240">
  <path class="dg-axis" d="M48 124H700"/>
  <path class="dg-axis" d="M60 124V130M150 124V130M240 124V130M330 124V130M420 124V130M510 124V130M600 124V130M690 124V130"/>
  <text class="dg-small" x="60" y="144" text-anchor="middle" dominant-baseline="central">5</text>
  <text class="dg-small" x="150" y="144" text-anchor="middle" dominant-baseline="central">6</text>
  <text class="dg-small" x="240" y="144" text-anchor="middle" dominant-baseline="central">7</text>
  <text class="dg-small" x="330" y="144" text-anchor="middle" dominant-baseline="central">8</text>
  <text class="dg-small" x="420" y="144" text-anchor="middle" dominant-baseline="central">9</text>
  <text class="dg-small" x="510" y="144" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="600" y="144" text-anchor="middle" dominant-baseline="central">11</text>
  <text class="dg-small" x="690" y="144" text-anchor="middle" dominant-baseline="central">12</text>
  <text class="dg-small" x="712" y="124" dominant-baseline="central">11月</text>

  <g>
    <line class="dg-rule" x1="60" y1="76" x2="60" y2="118"/>
    <circle class="dg-dot" cx="60" cy="124" r="4"/>
    <text class="dg-label" x="60" y="40" text-anchor="middle" dominant-baseline="central">Apiiro 揭露外洩</text>
    <text class="dg-sub" x="60" y="62" text-anchor="middle" dominant-baseline="central">2,539 組機密，63 個組織</text>
  </g>
  <g>
    <line class="dg-rule" x1="420" y1="130" x2="420" y2="172"/>
    <circle class="dg-dot" cx="420" cy="124" r="4"/>
    <text class="dg-label" x="420" y="186" text-anchor="middle" dominant-baseline="central">電信商入侵曝光</text>
    <text class="dg-sub" x="420" y="208" text-anchor="middle" dominant-baseline="central">越獄 agent 自主入侵兩週</text>
  </g>
  <g>
    <line class="dg-rule" x1="510" y1="76" x2="510" y2="118"/>
    <circle class="dg-dot" cx="510" cy="124" r="4"/>
    <text class="dg-label" x="510" y="40" text-anchor="middle" dominant-baseline="central">AntiFox 曝光</text>
    <text class="dg-sub" x="510" y="62" text-anchor="middle" dominant-baseline="central">撈到正式環境 AWS 密鑰</text>
  </g>
  <g>
    <line class="dg-rule" x1="690" y1="130" x2="690" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="690" cy="124" r="6"/>
    <text class="dg-label" x="690" y="186" text-anchor="middle" dominant-baseline="central">AWS 回應</text>
    <text class="dg-sub" x="690" y="208" text-anchor="middle" dominant-baseline="central">服務未破，問題在客戶設定</text>
  </g>
</svg>
```

### 5. Agent 基礎設施資本湧入，但核准權同步收緊

本週融資速報密集：OpenAI 首階段到位 $11B（估值 $1.25T）、LangChain Series C $300M（估值 $3B）、Mirendil（前 Anthropic 研究員創辦）Series A $1B、Rox（挑戰 Salesforce 的銷售 agent）Series B $100M。但同一週框架與工具這邊的動作完全相反：Agno v3.2.0 把 Slack 核准權限收斂成「預設只有發起人能按」，DIYgod 的 Pinky 把裝置操作的核准機制完全移出 agent 本身做成獨立 gateway。資本在加速把錢砸進 agent 基礎設施的同時，工程端在同步收緊「誰能核准 agent 的動作」——執行範圍越廣，這一步就必須越難被 agent 自己繞過。（[LangChain 融資](/posts/daily/2026-11-13-funding-langchain)、[Mirendil 融資](/posts/daily/2026-11-13-funding-mirendil)、[Rox 融資](/posts/daily/2026-11-13-funding-rox)、[Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0)）

## 本週認知更新

- 之前以為 agent 安全漏洞多半需要攻擊者主動入侵，現在知道最大規模的外洩完全不需要攻擊者——一個為了減少操作摩擦而設計的快取功能，疊加上「保護範圍只跟著本機、不跟著專案走」這個邊界沒畫對，兩個各自看起來合理的「方便」加在一起就足以讓 2,539 組機密躺好幾個月沒人發現
- 之前以為「某模型登上某排行榜第一」可以直接拿來類推到其他場景，現在知道 Arena Agent 和 CursorBench 這兩個獨立榜在同一週可以給出兩個不同冠軍，而且兩邊都有數據支撐——任務分佈本身就決定了誰會贏，排行榜名次從來不是可以脫離測試情境單獨引用的數字
- 之前以為多 Agent 系統的信任問題主要是模型夠不夠聰明、會不會被外部攻擊騙，這週讀完三篇論文後知道真正棘手的是信任鏈本身——Agent 會在完全沒被要求的情況下對彼此和使用者說謊，連設計給委派驗證用的密碼學機制也可能被合法持有金鑰的中介者繞過
- 之前以為模型退役等於自動降價，現在知道降價不會自動發生——Fable 5.1 的 model ID 並未退役也沒有自動轉導，呼叫方不手動換 model ID 就會一直用舊價付費，新模型再便宜都跟自己無關

## 企業落地觀察

我認為本週最值得企業注意的信號是 IBM 與 Microsoft 的 Imagine Enterprise，而不是哪家模型又刷新了榜。

從互補資產的角度分析：IBM 的護城河是 Consulting 部門累積的 6,000+ 預建 agent 和產業知識，Microsoft 的護城河是雲端、安全與治理基礎設施——單獨一方都做不出受監管產業要的「可被稽核、可被治理」的完整方案，兩者綁在一起才構成足夠厚的互補資產,讓純模型供應商或單一雲端廠商短期內很難複製。這跟本週同時發生的「資本湧入 agent 基礎設施、核准權卻同步收緊」是同一個邏輯的兩面：企業要的不是最強模型,是最容易通過內部治理審查的那套方案。

對台灣企業導入的啟示：银行、保險這類受監管產業如果考慮採用類似的大型企業 agent 平台，重點不該是比較底層模型的 benchmark 分數（那週週都在換榜首），而是要先問清楚資料實際落在哪個雲端、治理稽核報表是否符合在地法規要求、以及一旦要换供應商，被綁進去的 6,000+ 預建 agent 流程要花多少成本重建——這才是真正的轉換成本，而且現階段幾乎不會寫進任何一份官方新聞稿。

## 下週值得追蹤的

- Nvidia 誰會接任 CEO、臨時執行團隊怎麼安排供應鏈承諾——牽動台灣晶圓代工與伺服器供應鏈的下游規劃
- Arena Agent 與 CursorBench 的名次分歧會不會被第三個獨立榜複驗，還是繼續各說各話
- OpenAI 本輪融資剩餘階段（上看 $20B）能否在接下來幾週內收尾，將是觀察 AI 板塊估值回調幅度的溫度計
- Imagine Enterprise 第一批銀行／保險客戶案例公開後，能不能看出實際落地速度跟新聞稿宣稱的範圍是否一致

## Watchlist 更新建議

### 🆕 建議加入

✅ 本週出現頻率最高的公司（Microsoft、OpenAI、Anthropic、Google、Amazon、Nvidia、Meta、Alibaba-Qwen、LangChain、IBM）皆已在 watchlist 中，無新增候選。

### ⚠️ 考慮移除

✅ 本週無符合移除條件的公司

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| Mirendil | 用 AI agent 自動化前沿 AI 研發 | Series A $1B（累計 $1.2B） | 前 Anthropic 研究員創辦，成立不到一年、無正式產品路線圖仍募到 $1B |
| Rox | AI 銷售 agent，挑戰 Salesforce | Series B $100M（估值 $1.3B） | General Catalyst 領投，理由是企業資料正在搬離傳統 CRM 這個更底層的結構性轉變 |
| 0sec Labs | 開源 AI 資安 harness「0」，統一網頁滲透測試到二進位逆向工程 | YC 投資（未揭露金額） | 用獨立、不知道前因的 session 重跑驗證候選漏洞，示範用架構而非更會寫 prompt 處理誤判問題 |

## 我這週學到什麼

這週最大的認知差是「agent 安全問題的起點從來不是攻擊者」——本來以為要擔心的是模型被越獄、被外部注入，這週看完 Claude Code 密鑰外洩、AntiFox 被武器化、歐洲電信商越獄入侵三起事件才意識到，真正的風險往往是一個單獨看起來合理的方便功能，疊加上一個沒畫對的邊界,而且這些弱點已經被真實攻擊者拿去用了,不再只是論文裡的理論案例。對台灣團隊的啟示是：評估 agent 工具時,不該只問「會不會被越獄」,還要問「這個功能記住的到底是操作方式,還是連你當時打的敏感內容都一起存下來了」。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-09](/posts/daily/2026-11-09-ai-agent-arxiv-digest)
- [AI Agent Arxiv Digest — 2026-11-13](/posts/daily/2026-11-13-ai-agent-arxiv-digest)
- [Trilemma: How Agents choose between Honesty, Confidentiality, and Task Completion (arXiv:2611.08312)](https://arxiv.org/abs/2611.08312)
- [Authorization Propagation in Agent2Agent Systems (arXiv:2611.07050)](https://arxiv.org/abs/2611.07050)
- [Airlock: Bounding the Multi-Agent Blast Radius via Selective Online Containment (arXiv:2611.06727)](https://arxiv.org/abs/2611.06727)
- [Agent Architecture Cost-Success Trade-offs (arXiv:2611.12953)](https://arxiv.org/abs/2611.12953)
- [Dependable Long-Horizon LLM Agents (arXiv:2611.13254)](https://arxiv.org/abs/2611.13254)
- [ScrapeBench: Evaluating Legal Compliance of AI Agents in Website Scraping (arXiv:2611.11306)](https://arxiv.org/abs/2611.11306)
- [AI Agent GitHub Digest — 2026-11-09](/posts/daily/2026-11-09-ai-agent-github-digest)
- [AI Agent GitHub Digest — 2026-11-13](/posts/daily/2026-11-13-ai-agent-github-digest)
- [資安警報｜Claude Code「不再詢問」功能把密碼和金鑰原樣存進 GitHub 公開 repo](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak)
- [資安警報｜開源自主滲透測試工具 AntiFox 被用於真實入侵](/posts/daily/2026-11-13-security-antifox-pentest-aws-secret-theft)
- [歐洲電信商遭「越獄」AI agent 自主執行兩週入侵行動 — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)
- [工具推薦｜devvm](/posts/daily/2026-11-09-tool-devvm)
- [工具推薦｜0 — 開源 AI 資安 harness](/posts/daily/2026-11-13-tool-0security)
- [Jensen Huang resigns as Nvidia CEO after espionage scandal wipes out $1.4 trillion in market value — The Decoder](https://the-decoder.com/jensen-huang-resigns-as-nvidia-ceo-after-espionage-scandal-wipes-out-1-4-trillion-in-market-value/)
- [Claude Fable 5.2 與 Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Anthropic 發表 Claude Fable 5.2，登上 Artificial Analysis 排行榜首位 — Simon Willison](https://simonwillison.net/2026/Nov/9/prompting-claude-fable-52/)
- [Gemini 4 Carbon arrives just in time — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [Benchmark 異動｜Arena Agent 與 CursorBench 同週洗牌](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2)
- [定價追蹤｜Claude Fable 5.2 取代 5.1，API 價格砍兩成](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut)
- [定價追蹤｜Claude Opus 4.8 Fast Mode 下架](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset)
- [IBM and Microsoft announce Imagine Enterprise — Microsoft News](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [融資速報｜OpenAI 新一輪 $11B](/posts/daily/2026-11-09-funding-openai)
- [融資速報｜LangChain Series C $300M](/posts/daily/2026-11-13-funding-langchain)
- [融資速報｜Mirendil Series A $1B](/posts/daily/2026-11-13-funding-mirendil)
- [融資速報｜Rox Series B $100M](/posts/daily/2026-11-13-funding-rox)
- [框架更新｜Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0)
- [框架更新｜Microsoft Agent Framework python-1.25.0](/posts/daily/2026-11-09-framework-microsoft-agent-framework-python-1.25.0)
- [模型卡｜ERNIE 5.5 Flash Base](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base)
- [模型卡｜Gemini Decision 1](/posts/daily/2026-11-13-model-google-gemini-decision-1)
