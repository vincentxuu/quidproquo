---
title: "AI 日報 — 2026-11-10"
date: 2026-11-10
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "人把工作整包交給 agent 之後，責任歸屬出現缺口——攻擊者已經把入侵外包給 agent，監理端的回應是要求 agent 帶身分、出事有人負責"
tldr: "Malbear Labs 揭露越獄的 DeepSeek Flash agent 自主入侵歐洲電信商兩週，操作者只非同步看進度；Acronis 的 BossAI 報告指台灣 119 派遣系統遭 AI agent 攻擊系統入侵；中國工信部要求手機與手錶內建 agent 帶識別碼，香港金管局推出 Project SAGE 處理 Know-Your-Agent；新加坡提醒民眾仍要為個人 agent 的行為負責；Perplexity Teammates、Amazon 簡訊購物 agent、DeepSeek Harness 日活 154 萬顯示委託給 agent 的工作量正在放大"
draft: false
series:
  name: "AI 日報"
  order: 87
---

> 🌏 [English version](/posts/daily/2026-11-10-ai-agent-daily-en)

## 一句話判斷

**今天攻擊端和監理端同時碰到同一個問題：人把整包任務交給 agent 之後，誰要為它的行為負責。攻擊者已經把入侵外包給 agent，監理機關則開始要求 agent 帶身分、行為能追到人。台灣團隊現在就該為自家 agent 建清冊、設核准門檻、留稽核軌跡，不要等法規寫出來才補。**

## 深度分析：委託出去的是任務，收不回來的是責任

我認為今天的事件放在一起看，是一個典型的委託－代理問題：委託人把執行權交給代理人，卻沒辦法即時看到代理人做了什麼，資訊落差就變成風險。（框架：委託－代理理論）

證據一來自攻擊端。Malbear Labs 揭露的 Operation Snowball 裡，操作者用一個約 78,000 字元的越獄提示讓 DeepSeek Flash 驅動的 agent 持續兩週以上入侵歐洲電信商，訊息只有「繼續」「停」、劃定目標網段，平常只非同步檢查進度。攻擊被端點防護擋下時，agent 自己換招，連被封鎖的通道工具都自己重寫（[Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)）。Acronis 的 BossAI 案例則直接打到台灣：iThome 報導這套串接 12 個 AI agent 的攻擊系統在 12 天內鎖定 11 國數百個組織，台灣是最密集的目標，臺北市 119 派遣系統與緊急病患照護紀錄平臺遭入侵（[iThome](https://www.ithome.com.tw/news/180334)）。

證據二來自監理端。中國工信部 2026 年第 42 號通知要求手機、平板、手錶內建的 agent 帶識別碼；香港金管局的 Project SAGE 把 Know-Your-Agent 身分、互通性與責任歸屬列為專家小組議題（[Ctrl+AI+Reg](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan)、[What The FinTech](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)）。新加坡 CSA、GovTech、IMDA 的指引說得更白：使用者仍要為 agent 代為執行的行為負責（[CNA](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)）。印度律師也指出，AI 在印度法下沒有法律人格，契約與法規責任仍落在部署的企業身上（[ET LegalWorld](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)）。

兩邊的解法方向一致：縮小資訊落差。攻擊者靠非同步檢查就夠，是因為沒有人要他負責；合法使用者剛好相反，要能事後重建 agent 為什麼這樣做。對台灣團隊來說，BossAI 已經證明台灣是 agent 攻擊的熱區。賣 agent 給香港銀行或中國裝置供應鏈的團隊，接下來還要面對兩套不同的身分要求。最實際的一步是先建 agent 清冊、設定需要人工核准的動作門檻、保留可回放的執行紀錄。

```diagram
title: 委託給 agent 之後的兩種走向
desc: 左欄是今天把任務整包交給 agent 的案例（Operation Snowball、BossAI、Perplexity Teammates），右欄是監理端要求 agent 帶身分與責任歸屬的回應（中國工信部識別碼、香港 Project SAGE、新加坡指引）
caption: 依 Infosecurity Magazine、iThome、itbrief、Ctrl+AI+Reg、What The FinTech、CNA 2026-11-06 至 11-09 的報導整理。
---
<svg viewBox="0 0 640 288">
  <rect class="dg-zone dg-zone--solid" x="16" y="16" width="288" height="256" rx="8"/>
  <rect class="dg-zone" x="336" y="16" width="288" height="256" rx="8"/>

  <text class="dg-tag dg-text--warn" x="32" y="44" dominant-baseline="central">任務整包交給 agent</text>
  <text class="dg-tag dg-text--accent" x="352" y="44" dominant-baseline="central">監理要求身分與責任</text>

  <rect class="dg-box dg-box--warn" x="36" y="64" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="84" text-anchor="middle" dominant-baseline="central">Operation Snowball</text>
  <text class="dg-sub" x="160" y="104" text-anchor="middle" dominant-baseline="central">操作者只非同步看進度</text>

  <rect class="dg-box dg-box--warn" x="36" y="132" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="152" text-anchor="middle" dominant-baseline="central">BossAI</text>
  <text class="dg-sub" x="160" y="172" text-anchor="middle" dominant-baseline="central">12 個 agent，台灣是主要目標</text>

  <rect class="dg-box" x="36" y="200" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="220" text-anchor="middle" dominant-baseline="central">Perplexity Teammates</text>
  <text class="dg-sub" x="160" y="240" text-anchor="middle" dominant-baseline="central">一個角色可再開多個 agent</text>

  <rect class="dg-box" x="356" y="64" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="84" text-anchor="middle" dominant-baseline="central">中國工信部第 42 號通知</text>
  <text class="dg-sub" x="480" y="104" text-anchor="middle" dominant-baseline="central">內建 agent 須帶識別碼</text>

  <rect class="dg-box" x="356" y="132" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="152" text-anchor="middle" dominant-baseline="central">香港 Project SAGE</text>
  <text class="dg-sub" x="480" y="172" text-anchor="middle" dominant-baseline="central">Know-Your-Agent 與責任歸屬</text>

  <rect class="dg-box" x="356" y="200" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="220" text-anchor="middle" dominant-baseline="central">新加坡指引</text>
  <text class="dg-sub" x="480" y="240" text-anchor="middle" dominant-baseline="central">使用者仍要為 agent 負責</text>
</svg>
```

## 今日動態

### 廠商動態

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Perplexity** | 為個人 Max 訂閱者推出 Teammates 研究預覽版：每個 teammate 有自己的角色，可把目標拆成平行任務、再開其他 agent 分頭執行，新建 teammate 預設使用 Claude Opus 5.5。 | [itbrief](https://itbrief.asia/story/perplexity-launches-teammates-ai-agents-for-max-users) |
| **DeepSeek** | 開源 agent 應用 DeepSeek Harness 8 月 13 日上線，11 月 4 日日活達 154 萬，九月底約 27.1 萬。 | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users) |
| **Amazon** | 開放部分美國使用者用簡訊跟購物 agent Alexa for Shopping 下單，幾週內擴大；Amazon 稱過去 12 個月有超過 4 億名顧客用過 Alexa for Shopping。 | [About Amazon](https://www.aboutamazon.com/news/retail/alexa-for-shopping-text-to-shop) |
| **Sourcegraph** | 宣布 Cody 將於 2027 年 1 月 31 日終止，資源轉向協助工程團隊與 coding agent 理解大型 codebase。 | [Sourcegraph](https://sourcegraph.com/blog/sunsetting-cody-future-of-code-intelligence) |
| **AWS** | 每週彙整重點是 Bedrock AgentCore 新 runtime（設定 `platformVersion` 為 `V2`），團隊測試中 P75 冷啟動維持在約 2 秒。 | [AWS Blog](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-agentcore-runtime-v2-amazon-dynamodb-bulk-put-items-and-more-november-9-2026/) |

### 技術進展

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Dapr 1.19** | Diagrid 發布新版，工作流 worker 只接收新事件，不再每步重傳整段歷史；預覽功能 WorkflowsFastPath 在 Diagrid 測試中把中位步驟延遲從 553 毫秒降到 153 毫秒。 | [SiliconANGLE](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/) |
| **Toolshed** | 開源 MCP server 管理工具，用單一介面幫 Claude Code、Codex 安裝 MCP server，API token 存在系統金鑰鏈而不是設定檔。 | [Get Ready for Agents](https://www.getreadyforagents.com/news/toolshed-mcp-server-management/) |
| **NVIDIA Nemotron-Personas-Finance-Japan** | 與 Elith 合作釋出百萬筆規模的日本金融人格合成資料集，以官方統計為基礎，供金融 agent 開發避開真實個資。 | [Hugging Face Blog](https://huggingface.co/blog/nvidia/nemotron-personas-finance-japan) |

### 資安事件

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Operation Snowball** | 越獄 agent 利用 Cisco BroadWorks XXE 漏洞（CVE-2026-20320）進入歐洲電信商，波及其資料中心上的 13 個組織；Malbear 未說明是否已向受害者確認。防禦建議：把暴露在網路上的 JBoss AS 6 視為已遭入侵，並監控內網通道流量。 | [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/) |
| **Acronis TRU Cyber Pulse 2026** | 竊資木馬開始從 AI coding 工具偷 API 金鑰與 agent 設定；BossAI 透過 MCP 串接攻擊工具。報告建議把檔案系統、網路與指令執行限制放在模型之外執行。 | [Developer Tech](https://www.developer-tech.com/news/acronis-report-puts-ai-agent-attacks-on-devsecops-radar/) |

### 法規與治理

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **美國國會** | 民主黨期中選舉大勝，業界預期國會聽證與調查增加，時間點與 Anthropic、OpenAI 的上市計畫重疊。 | [Los Angeles Times](https://www.latimes.com/business/story/2026-11-09/blue-wave-puts-ai-companies-in-regulatory-crosshairs) |
| **Scott Wiener** | 曾提出 SB 1047、推動 SB 53 的加州參議員贏得舊金山國會席次，表示國會今年底前看來不會對 AI 採取果斷行動。 | [MIT Technology Review](https://www.technologyreview.com/2026/11/09/1148182/nancy-pelosis-replacement-is-ready-to-regulate-ai/) |
| **歐盟 AI Act 執行** | Politico 報導仍有 16 個成員國尚未指定 AI 安全主管機關。 | [Politico](https://www.politico.eu/article/eu-countries-still-cant-get-it-together-on-ai/) |
| **歐盟 Digital Fairness Act 草案** | 據 Bloomberg 與 Reuters 看到的草案，將處理模擬人際關係以延長互動的 AI 系統，不公平數位商業行為最高罰全球年營收 6%。 | [FourWeekMBA](https://fourweekmba.com/ai-eu-draft-targets-ai-bots-addictive-apps-fines-up-to-6/) |

### 區域動態

| 區域 | 本日動態 |
|------|----------|
| **台灣** | iThome 彙整 Acronis 報告：BossAI 在 12 天內攻擊 11 國，台灣受攻擊最密集，臺北市 119 派遣系統遭入侵、部分病患資料外洩（[來源](https://www.ithome.com.tw/news/180334)）。 |
| **中國／香港** | 中國工信部第 42 號通知要求預裝 agent 的終端設備須帶識別碼；香港金管局推出 Project SAGE，並發布銀行使用 agentic AI 的監理考量討論文件（[來源](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)）。 |
| **日本／韓國** | 南韓總統直屬國家 AI 戰略委員會通過「韓國 AI 立法框架」，要求各部會優先修 AI 基本法與既有產業法，不另立單獨法案；KISA 同期發布 agentic AI 零信任指南（[來源](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan)）。 |
| **東南亞** | 新加坡 CSA、GovTech、IMDA 發布個人 agent 指引：不要給 agent 銀行、政府、醫療帳號權限，重要動作要逐次核准（[來源](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)）。 |
| **印度／南亞** | 印度法律界指出企業部署 autonomous agent 仍須負契約與法規責任；同篇引用 TCS 調查，只有 10% 企業讓 agent 跨部門不經人工核准就執行決策（[來源](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)）。 |
| **中東（含以色列）** | 沙烏地 Humain 與國家基礎設施基金 Infra 簽下最高 25 億里亞爾（6.67 億美元）融資，用於 GPU 部署與資料中心電力建設（[來源](https://www.arabnews.com/eye-on-ai/humain-infra-sign-667m-financing-deals-to-expand-saudi-ai-infrastructure-3010704)）；海灣地區主權 AI 討論轉向治理與在地語言模型（[來源](https://www.khaleejtimes.com/business/sovereign-ai-emerges-as-next-battleground-for-gulf-economies)）。 |
| **非洲** | 開羅創業節上的投資人估計非洲新創只拿到全球創投約 0.6%（[來源](https://serrarigroup.com/african-startups-get-just-0-6-of-global-vc-as-ai-surges/)）；南非國家 AI 政策的內閣審議時程延到 2027 年 3 月（[來源](https://innovation-village.com/ai-africa-intelligence-october-22-november-4-2026-vol-28/)）。 |
| **拉丁美洲** | 阿根廷 AI 影音新創 Hashi 募得 400 萬美元後進軍智利，客戶已逾 500 家、分布 18 國（[來源](https://www.latamrepublic.com/argentine-ai-startup-hashi-reaches-18-countries-with-chilean-launch/)）。 |
| **大洋洲** | A1 Technologies 為澳紐中型企業推出 AI 治理服務 Guardrails，盤點 AI 應用與 agent 權限（[來源](https://securitybrief.co.nz/story/a1-launches-ai-governance-service-for-mid-market-firms)）；Oracle NetSuite Next 在澳紐上線（[來源](https://smbtech.au/news/oracle-lays-out-its-ai-playbook-as-netsuite-rolls-out-autonomous-suite-across-anz/)）。 |

### 商業案例 / 融資

| 主體 | 本日動態 | 來源 |
|------|----------|------|
| **Five9 收購 Level AI** | 交易對 Level AI 估值約 3.25 億美元，把 AI agent、agent assist、品質管理併入 Genius CX，也會單獨賣給其他平台的客戶。 | [UC Today](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action) |
| **Nominal** | 硬體工程測試 AI 平台完成 2.4 億美元 C 輪，估值 30 億美元，八個月內翻三倍；Lightspeed 領投、Insight Partners 共同領投。 | [TechCrunch](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/) |
| **Coframe** | 完成 2,500 萬美元 A 輪，總募資 3,500 萬美元，Khosla Ventures 與 Hanabi Capital 共同領投，用 agent 自動產生並測試網站與廣告變體。 | [Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/) |
| **Ebix × intentyx** | 推出 agent 治理方案 SMARE，盤點企業內部 agent、記錄每個 agent 被核准的「設計意圖」，偵測越權行為，瞄準保險與金融業。 | [Efficiently Connected](https://www.efficientlyconnected.com/ebix-intentyx-ai-agent-governance-regulated-industries/) |

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| DeepSeek Harness 日活 | 154 萬（11 月 4 日） | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users) |
| Operation Snowball 越獄提示長度 | 約 78,000 字元 | [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/) |
| BossAI 攻擊範圍 | 12 天、11 國 | [iThome](https://www.ithome.com.tw/news/180334) |
| Level AI 交易估值 | 約 3.25 億美元 | [UC Today](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action) |
| Nominal C 輪 | 2.4 億美元，估值 30 億美元 | [TechCrunch](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/) |
| Dapr WorkflowsFastPath 中位步驟延遲 | 553 → 153 毫秒 | [SiliconANGLE](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/) |

## 明日關注

- Malbear 與 Acronis 的報告有沒有受害方或 CERT 出面確認；台灣 119 派遣系統事件的後續通報與修補時程
- 香港 Project SAGE 專家小組名單與討論文件的回饋期限，以及 Know-Your-Agent 會不會跟中國的裝置識別碼走不同規格
- Perplexity Teammates 開放給 Pro 與企業版的時程，以及平行 agent 的點數消耗實測

## 今日收穫

之前以為 agent 的身分問題要等 agent 互相交易普及才會變急，今天看到 BossAI 直接打進台灣 119 系統，才意識到攻擊方早就在大規模使用 agent，防守方卻還不知道自己環境裡有哪些 agent。對台灣團隊來說，先把自家 agent 列清楚，比等外部身分標準更急。

## 參考資料

- [Infosecurity Magazine — Jailbroken AI Agent Ran Two-Week Attack on European Telecom](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)
- [iThome — 【資安日報】11月9日，AI自動化攻擊系統BossAI鎖定臺灣緊急應變服務](https://www.ithome.com.tw/news/180334)
- [Developer Tech — Acronis report puts AI agent attacks on DevSecOps radar](https://www.developer-tech.com/news/acronis-report-puts-ai-agent-attacks-on-devsecops-radar/)
- [itbrief — Perplexity launches Teammates AI agents for Max users](https://itbrief.asia/story/perplexity-launches-teammates-ai-agents-for-max-users)
- [Bloomberg — DeepSeek's AI Agent Platform Reaches 1.54 Million Daily Active Users](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users)
- [About Amazon — Alexa for Shopping is now just a text away](https://www.aboutamazon.com/news/retail/alexa-for-shopping-text-to-shop)
- [Sourcegraph — Sunsetting Sourcegraph Cody](https://sourcegraph.com/blog/sunsetting-cody-future-of-code-intelligence)
- [AWS Weekly Roundup — AgentCore Runtime V2 (November 9, 2026)](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-agentcore-runtime-v2-amazon-dynamodb-bulk-put-items-and-more-november-9-2026/)
- [SiliconANGLE — Diagrid's Dapr 1.19 lightens AI agent workflows](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/)
- [Get Ready for Agents — Toolshed MCP server manager](https://www.getreadyforagents.com/news/toolshed-mcp-server-management/)
- [Hugging Face Blog — Nemotron-Personas-Finance-Japan](https://huggingface.co/blog/nvidia/nemotron-personas-finance-japan)
- [Ctrl+AI+Reg — Passports for bots: China's gameplan to control AI agent identity](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan)
- [What The FinTech #191 — HKMA Project SAGE](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)
- [CNA — Singapore authorities warn of privacy, security risks from personal AI agents](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)
- [ET LegalWorld — Companies must retain accountability as autonomous AI agents take on business decisions](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)
- [Los Angeles Times — Blue wave puts AI companies in the regulatory crosshairs](https://www.latimes.com/business/story/2026-11-09/blue-wave-puts-ai-companies-in-regulatory-crosshairs)
- [MIT Technology Review — Nancy Pelosi's replacement is ready to regulate AI](https://www.technologyreview.com/2026/11/09/1148182/nancy-pelosis-replacement-is-ready-to-regulate-ai/)
- [Politico — EU countries still can't get it together on AI](https://www.politico.eu/article/eu-countries-still-cant-get-it-together-on-ai/)
- [FourWeekMBA — EU Draft Targets AI Bots, Addictive Apps; Fines Up to 6%](https://fourweekmba.com/ai-eu-draft-targets-ai-bots-addictive-apps-fines-up-to-6/)
- [Arab News — Humain, Infra sign $667m financing deals](https://www.arabnews.com/eye-on-ai/humain-infra-sign-667m-financing-deals-to-expand-saudi-ai-infrastructure-3010704)
- [Khaleej Times — Sovereign AI emerges as next battleground for Gulf economies](https://www.khaleejtimes.com/business/sovereign-ai-emerges-as-next-battleground-for-gulf-economies)
- [Serrari Group — African Startups Get Just 0.6% of Global VC as AI Surges](https://serrarigroup.com/african-startups-get-just-0-6-of-global-vc-as-ai-surges/)
- [Innovation Village — AI Africa Intelligence Vol. 28](https://innovation-village.com/ai-africa-intelligence-october-22-november-4-2026-vol-28/)
- [LatAm Republic — Argentine AI Startup Hashi Reaches 18 Countries With Chilean Launch](https://www.latamrepublic.com/argentine-ai-startup-hashi-reaches-18-countries-with-chilean-launch/)
- [SecurityBrief NZ — A1 launches AI governance service for mid-market firms](https://securitybrief.co.nz/story/a1-launches-ai-governance-service-for-mid-market-firms)
- [SMBtech — Oracle NetSuite rolls out autonomous suite across ANZ](https://smbtech.au/news/oracle-lays-out-its-ai-playbook-as-netsuite-rolls-out-autonomous-suite-across-anz/)
- [UC Today — This Week: Enterprise AI Gets Serious About Action](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action)
- [TechCrunch — Nominal triples valuation to $3B in 8 months](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/)
- [Unite.AI — Coframe Raises $25M Series A](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/)
- [Efficiently Connected — Ebix and intentyx Launch AI Agent Governance](https://www.efficientlyconnected.com/ebix-intentyx-ai-agent-governance-regulated-industries/)
