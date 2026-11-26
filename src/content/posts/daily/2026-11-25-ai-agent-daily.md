---
title: "AI 日報 — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "模型能力正在加速商品化，真正稀缺的是信任層：同一天五個模型發布、三家廠商同時卡位審批、隔離與資料留存，而攻擊者的 AI agent 已能自己找到零日漏洞"
tldr: "GPT-6 Cyber、SWE-2.1、Hy3、ERNIE 5.5 Flash Preview、Ling-3.2-air 同週發布，能力差距持續縮小；Anthropic Claude Ship、OpenAI 與 Cisco 的 Shirudo、AWS Bedrock Trusted Access API 同時把審批、執行期防護與資料留存做成產品；Amazon 揭露攻擊者的 AI agent 約 11 分鐘自主找到 MONAI Label 零日漏洞；Meta Muse 在英國上線同日，英國 FCA 警告提供金融服務的 AI agent 可能需要授權"
draft: false
series:
  name: "AI 日報"
  order: 102
---

## 一句話判斷

**模型能力的差距正在被快速抹平，能不能把 agent 放進生產環境，越來越取決於審批、隔離與資料留存這一層「信任」；對台灣團隊來說，選模型的重要性正在下降，選能被稽核的部署方式的重要性正在上升。**

## 深度分析：模型變商品，信任層變入場券

我認為今天最值得串起來看的，是能力層與信任層往相反方向移動，這是互補資產框架的典型畫面：當核心資產（模型能力）越來越容易被追平，決定誰能把它變成可用產品的，是那些稀缺且難以複製的互補資產。（框架：互補資產）

證據 A：同一個週期內，[OpenAI 的 GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/)、[Cognition 的 SWE-2.1](https://cognition.com/blog/swe-2-1)、[騰訊 Hy3](https://huggingface.co/tencent/Hy3-FP8)、[百度 ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview) 與螞蟻的 [Ling-3.2-air](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation) 相繼發布。後三者是開放權重，Hy3 與 ERNIE 的 Hugging Face 頁面標示 Apache 2.0，Ling 為 MIT；這些成績多為廠商自報，但開放權重那三個都宣稱在辦公、前端或多工具任務上追上或超過同級對手，資安與程式碼能力也不再只有少數封閉模型做得到。能力不再是單一廠商的專屬優勢。

證據 B：同一天，信任層被三家同時做成產品。[Claude Ship](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes) 讓 agent 依放在 repo 裡的核准政策審批程式碼變更，並建議先用觀察模式跑；[OpenAI 與 Cisco 的 Shirudo](https://openai.com/index/introducing-shirudo/) 用 eBPF 簽章防護罩在不重啟服務的情況下擋下攻擊；[AWS Bedrock Trusted Access API](https://aws.amazon.com/blogs/machine-learning/introducing-the-amazon-bedrock-trusted-access-api-with-anthropics-enterprise-frontier-safeguards-and-enterprise-data-controls/) 讓客戶在自己的帳號內留存資料，並由 IAM 政策控管誰能加入。對照 [Amazon 揭露的案例](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)：攻擊者的 AI agent 約 11 分鐘就自主找到零日漏洞，防守端要靠的已經不是人工盯防。

對從業者的意義：模型可以換，但審批政策、稽核紀錄與資料留存位置換不了，這才是轉換成本所在。對台灣團隊而言，開放權重讓自架變得可行，可是自架之後這一層信任要自己補；採購與導入評估時，先問「出事時誰能證明 agent 做了什麼」，再比較模型分數。

```diagram
title: 能力層與信任層的相反走向
desc: 同一天五個模型發布讓能力層差距縮小，三家廠商同時把審批、防護與資料留存做成產品，使信任層成為新的差異點。
caption: 簡化示意，呼應深度分析的互補資產框架；內容為今日信號的歸納，不代表量化比較。
---
<svg viewBox="0 0 680 280">
  <text class="dg-sub" x="170" y="24" text-anchor="middle" dominant-baseline="central">能力層</text>
  <rect class="dg-box dg-box--ghost" x="30" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="170" y="58" text-anchor="middle" dominant-baseline="central">五個模型同週發布</text>
  <text class="dg-sub" x="170" y="78" text-anchor="middle" dominant-baseline="central">含三個開放權重</text>

  <path class="dg-line" d="M170 94V140" marker-end="url(#arrow)"/>
  <rect class="dg-box dg-box--ghost" x="30" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="170" y="160" text-anchor="middle" dominant-baseline="central">差距縮小</text>
  <text class="dg-sub" x="170" y="180" text-anchor="middle" dominant-baseline="central">換模型的成本下降</text>

  <text class="dg-sub" x="510" y="24" text-anchor="middle" dominant-baseline="central">信任層</text>
  <rect class="dg-box" x="370" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="510" y="58" text-anchor="middle" dominant-baseline="central">三家同時卡位</text>
  <text class="dg-sub" x="510" y="78" text-anchor="middle" dominant-baseline="central">Claude Ship／Shirudo／Bedrock</text>

  <path class="dg-line dg-line--accent" d="M510 94V140" marker-end="url(#arrow-accent)"/>
  <rect class="dg-box dg-box--accent" x="370" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="510" y="160" text-anchor="middle" dominant-baseline="central">審批、防護、資料留存</text>
  <text class="dg-sub" x="510" y="180" text-anchor="middle" dominant-baseline="central">難以複製的互補資產</text>

  <text class="dg-small" x="170" y="252" text-anchor="middle" dominant-baseline="central">趨向商品化</text>
  <text class="dg-small dg-text--accent" x="510" y="252" text-anchor="middle" dominant-baseline="central">成為新的入場券</text>
</svg>
```

## 今日動態

### 廠商動態

- **[Anthropic Claude Ship](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)**（TechCrunch）：由 Code Review（已 GA）、PR Steward 與 Claude Approvals（beta）組成，核准政策以檔案形式放在 repo 內，開放給 GitHub 上的 Claude Team 與 Enterprise 方案。
  - **為什麼重要**：把「誰有權核准變更」從人轉給政策，台灣團隊試用時應先照官方建議用觀察模式，並限制在單一 repo。
- **[Meta Muse（英國）](https://about.fb.com/news/2026/11/introducing-muse-in-the-uk-a-personal-ai-agent-you-control/)**（Meta）：個人 AI agent 在英國上線，可代為處理購物、訂票與 email，重要動作先經使用者核准，付款走 Stripe 的 Onelink 或 Shopify 的 Shop Pay。
- **[群環智行與 IBM Bob](https://n.yam.com/Article/20261124209913)**（Yam 天空新聞）：台灣群環科技以 IBM Bob 為核心推出企業 agent 方案，主打治理內建與可部署在地端；報導中的 IBM 台灣總經理指出，企業從試行走向全面導入時，卡住的是權責與運作軌跡不清。
  - **為什麼重要**：這是台灣本地廠商把「信任層」當賣點的實例，與上面的論點同向。

### 模型與基礎設施

- **[GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/)**（OpenAI）：ExploitGym 得分 48.5%，前代 GPT-5.6 Cyber 為 32.1%；在刻意設下誘餌的範圍測試中，未使用部署提示時有 99.93% 避開範圍外服務。OpenAI 自評在其 Preparedness Framework 中屬 Critical 等級。
- **[Cognition SWE-2.1](https://cognition.com/blog/swe-2-1)**（Cognition）：以 Kimi K3 為基礎做純強化學習，官方報告 ExploitBench 80%、ExploitGym 27.3%；訓練期間模型四次在沙盒中發現新漏洞，另推出較寬鬆防護的 SWE-2.1 Cyber 給 Devin Security。
- **[騰訊 Hy3](https://huggingface.co/tencent/Hy3-FP8)**（Hugging Face）：295B 參數、21B 活躍的 MoE；官方稱 270 位專家盲測中得分 2.67/4，高於 GLM-5.1 的 2.51/4。為廠商自報。
- **[ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview)**（站內模型卡）：百度開源權重，多工具協調與辦公自動化兩項略勝 Claude Opus 5.5，一般知識推理仍落後。
- **[螞蟻 Ling-3.2-air](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation)**（i10X）：MIT 授權，124B 參數、5.5B 活躍；AutomationBench-AA 由前代 15.7% 升到 61%（廠商自報），但法律評測 LAB-AA 的全題答對率只有 8.3%，扣除重大幻覺後僅 0.8%。
  - **為什麼重要**：辦公類任務分數好看，不等於可以免審，文件流程仍要保留人工覆核。

### 技術進展

- **[Arxiv Digest](/posts/daily/2026-11-25-ai-agent-arxiv-digest)**：三篇預印本的共同方向是模型不變、鷹架決定結果。論文指出，在即時遊戲中同一個模型的成功率可從 38.3% 升到 68.6%，工具故障時 6–26% 的執行以捏造答案收場；這些是作者自建基準的結果，適合用來決定先驗證什麼，不宜當成上線後的預期值。
- **[Pydantic AI v2.73.0](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0)**：對已棄用模型發出警告，並讓 SubAgents 能把待確認的工具呼叫交還呼叫端。

### 工具與生態

- **[GitHub Digest](/posts/daily/2026-11-25-ai-agent-github-digest)**：新 repo 多半替既有 agent 補一塊它做不到的事，例如只改寫最慢的那一段程式碼，或在 Linux 上操作 iOS 模擬器。
- **[agentscan](/posts/daily/2026-11-25-tool-agentscan)**：本機 CLI，掃描 MCP 設定檔裡寫死的金鑰、未鎖版本的套件與明文傳輸。

### 資安事件

- **[Cairn 自主找出 MONAI Label 零日](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)**（站內資安警報）：Amazon 揭露攻擊者用開源滲透框架 Cairn，約 11 分鐘從摸清 API 到能任意寫檔；CISA 已將 CVE-2026-133968 列入 KEV，修補版本為 0.8.6。
- **[Shirudo](https://openai.com/index/introducing-shirudo/)**（OpenAI）：BSD 2-Clause 開源，防護罩經簽章並可用 TPM 留下載入紀錄；官方示範中由 Codex 產生的防護罩擋下對運行中 Elasticsearch 的 Java4Shell 攻擊，且不需重啟。

### 法規與治理

- **[英國 FCA](https://finextra.com/newsarticle/48807/as-metas-muse-arrives-in-the-uk-fca-issues-agentic-ai-warning-to-tech-firms)**（Finextra）：FCA 警告，把自己定位成科技供應商不會豁免金融監管；agent 若涉及付款、金融推廣或建議，可能需要授權。Meta 表示英國版 Muse 不會存取銀行帳戶餘額或投資資料。
- **[澳洲國會聯合調查](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3)**（AFR）：跨黨派委員會提出 46 項建議，包含要求部署 AI agent 的企業負法律責任、大幅增加 AI Safety Institute 經費。
- **[歐盟 AI Act 第 50(2) 條](https://mean.ceo/tpost/ai-act-watermark-deadline)**（mean.ceo）：依該文整理，2026 年 8 月前已上市的系統，機器可讀的 AI 內容標記義務寬限到 12 月 2 日。
  - **為什麼重要**：若台灣團隊的產品以自有品牌服務歐盟使用者，標記義務通常落在提供者身上，不能只靠上游模型。

### 區域動態

- **馬來西亞**：數位部長表示，《人工智慧治理法案》將設立事件通報機制，並依開發者與部署者的角色界定責任。（[來源](https://urgent.news/2026/11/24/ai-governance-bill-will-introduce-incident-reporting-mechanism-to)）
- **拉丁美洲**：Kaszek 募得 6.5 億美元新基金，預計投資 20 至 30 家公司，多數資金鎖定應用層。（[來源](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/)）
- **中東**：卡達 Dukhan Bank 與 Anthropic 簽約，分階段導入 Claude，先從少數員工與研究、知識整合等用途開始。（[來源](https://www.zawya.com/en/press-release/companies-news/dukhan-bank-signs-an-agreement-with-anthropic-to-build-enterprise-ai-capability-with-claude-2498818)）

日本／韓國與非洲在這個時間窗內沒有找到合格的事件，印度與新加坡的信號未能回到原始來源查證，因此不收錄。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| GPT-6 Cyber ExploitGym | 48.5%（前代 32.1%） | [OpenAI](https://openai.com/index/introducing-gpt-6-cyber/) |
| SWE-2.1 ExploitBench | 80% | [Cognition](https://cognition.com/blog/swe-2-1) |
| Ling-3.2-air 法律評測全題答對率 | 8.3%（扣除重大幻覺後 0.8%） | [i10X](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation) |
| Kaszek 新基金 | 6.5 億美元 | [Dealroom](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/) |
| 澳洲委員會建議數 | 46 項 | [AFR](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3) |

## 今日 Digest 一覽

- [AI Agent Arxiv Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-github-digest)
- [模型卡｜ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview)
- [資安警報｜Cairn 自主 AI agent 在 MONAI Label 自行發現 0-day](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)
- [框架更新｜Pydantic AI v2.73.0](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0)
- [工具推薦｜agentscan](/posts/daily/2026-11-25-tool-agentscan)
- [AI Engineer Interview Drill — 2026-11-25](/posts/daily/2026-11-25-ai-interview-daily)
- [Product Builder Interview Daily — 2026-11-25](/posts/daily/2026-11-25-product-builder-interview-daily)

## 明日關注

- Claude Ship 的核准 agent 進入 beta 後，社群會不會公開出現「放行了不該放行的變更」的案例，以及團隊實際採用觀察模式的比例。
- 12 月 2 日歐盟標記義務到期前，各模型 API 的浮水印預設值是否有變動。
- 英國 FCA 與 Meta Muse 的互動：Muse 之後若開放存取銀行資料，是否會被認定需要授權。

## 今日收穫

我原本以為開放權重模型一路追上來，主要衝擊的是模型廠商的定價。今天看 Ling 的法律評測才修正：分數追上來的同時，全題答對率仍然只有個位數，這表示真正沒被商品化的，是「怎麼證明這個輸出可以被信任」的那套流程。對台灣團隊來說，自架模型省下的是 API 費用，省不掉的是審批與稽核的工程。

## 參考資料

- [Anthropic launches Claude Ship — TechCrunch](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)
- [GPT-6 Cyber — OpenAI](https://openai.com/index/introducing-gpt-6-cyber/)
- [OpenAI and Cisco introduce Shirudo — OpenAI](https://openai.com/index/introducing-shirudo/)
- [Amazon Bedrock Trusted Access API — AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/introducing-the-amazon-bedrock-trusted-access-api-with-anthropics-enterprise-frontier-safeguards-and-enterprise-data-controls/)
- [Introducing SWE-2.1 — Cognition](https://cognition.com/blog/swe-2-1)
- [tencent/Hy3-FP8 — Hugging Face](https://huggingface.co/tencent/Hy3-FP8)
- [Ling-3.2-air — i10X](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation)
- [Introducing Muse in the UK — Meta](https://about.fb.com/news/2026/11/introducing-muse-in-the-uk-a-personal-ai-agent-you-control/)
- [As Meta's Muse arrives in the UK, FCA issues agentic AI warning — Finextra](https://finextra.com/newsarticle/48807/as-metas-muse-arrives-in-the-uk-fca-issues-agentic-ai-warning-to-tech-firms)
- [群環智行攜手 IBM Bob — Yam 天空新聞](https://n.yam.com/Article/20261124209913)
- [Parliamentary inquiry push to hold companies legally liable for their AI agents — AFR](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3)
- [AI Act Watermark Deadline — mean.ceo](https://mean.ceo/tpost/ai-act-watermark-deadline)
- [AI Governance Bill incident reporting — urgent.news（轉述 New Straits Times）](https://urgent.news/2026/11/24/ai-governance-bill-will-introduce-incident-reporting-mechanism-to)
- [Kaszek closes $650M Fund VII — Dealroom](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/)
- [Dukhan Bank and Anthropic — Zawya](https://www.zawya.com/en/press-release/companies-news/dukhan-bank-signs-an-agreement-with-anthropic-to-build-enterprise-ai-capability-with-claude-2498818)
- [AI Agent Arxiv Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-github-digest)
- [資安警報｜Cairn 自主 AI agent 在 MONAI Label 自行發現 0-day](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)
