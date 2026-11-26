---
title: "AI Agent 週回顧 — 2026-11-27"
date: 2026-11-27
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "本週最大的認知變化：自主漏洞利用從『轉換已知 CVE』進化到『自己找 0day』，agent 的信任風險也從『被騙去做壞事』轉移到『忠實執行藏在供應鏈某一層的指令』"
tldr: "Cairn AI agent 僅用 11 分鐘自主找到並利用醫療影像軟體 MONAI Label 從未公開的零日漏洞，CISA 已列入 KEV；Anthropic 推出 Claude Ship 讓 agent 自己審查、修復、核准程式碼變更；Sierra 完成 17.5 億美元 D 輪，估值半年翻倍到 300 億美元；Ruflo MCP Bridge 零認證 RCE 與 AWS API MCP OAuth audience 驗證漏洞同週連爆，說明協定層信任正取代模型對齊成為新戰場；本週至少 3 篇記憶系統論文都把漂亮的數字建立在同一個沒被驗證的地基上——LLM 當裁判的可信度。"
series:
  name: "AI Agent 週回顧"
  order: 16
---

> :globe: [English version](/posts/daily/2026-11-27-weekly-review-en)

## 本週最重要的 5 件事

### 1. Cairn AI agent 11 分鐘自主找到從未公開的零日漏洞，CISA 列入 KEV

Amazon Threat Intelligence 公布：他們發現一台公開、無認證的 Cairn（開源自主滲透測試框架）伺服器，操作紀錄完全外露。攻擊者只給「取得 shell」這種極簡目標，agent 自己在醫療影像標註伺服器 MONAI Label 上摸清框架與 API，約 11 分鐘就從摸底走到能任意寫檔，隨後取得 root 權限。這和過去幾週揭露的「agent 把已知 CVE 自動轉成可用攻擊程式」不同——MONAI Label 的這個路徑穿越漏洞在此之前從未被公開記錄，是 agent 自己找出來的。CISA 於 11/23 把這個漏洞（CVE-2026-133968）列入已知遭利用漏洞（KEV）目錄，意味著威脅模型要從「修補已知漏洞要快」升級到「假設持續有自主代理在找全新漏洞」。（[Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/)、[CISA KEV 公告](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)）

```diagram
title: Cairn 自主找到零日的時間軸
desc: 從攻擊者下達極簡目標，到 agent 自己找到從未公開的漏洞，再到官方正式列管，整個週期被壓縮到以分鐘和天計算。
caption: 日期為 Amazon 揭露文件與 CISA 公告標註的時間。
---
<svg viewBox="0 0 760 220">
  <path class="dg-axis" d="M48 110H700"/>
  <path class="dg-axis" d="M110 110V116M330 110V116M480 110V116M650 110V116"/>
  <text class="dg-small" x="110" y="136" text-anchor="middle" dominant-baseline="central">9/8</text>
  <text class="dg-small" x="330" y="136" text-anchor="middle" dominant-baseline="central">9/10（~11 分鐘內）</text>
  <text class="dg-small" x="480" y="136" text-anchor="middle" dominant-baseline="central">11/20</text>
  <text class="dg-small" x="650" y="136" text-anchor="middle" dominant-baseline="central">11/23</text>

  <g>
    <line class="dg-rule" x1="110" y1="58" x2="110" y2="104"/>
    <circle class="dg-dot" cx="110" cy="110" r="4"/>
    <text class="dg-label" x="110" y="26" text-anchor="middle" dominant-baseline="central">攻擊者下達目標</text>
    <text class="dg-sub" x="110" y="48" text-anchor="middle" dominant-baseline="central">僅「取得 shell」一句</text>
  </g>
  <g>
    <line class="dg-rule" x1="330" y1="150" x2="330" y2="170"/>
    <circle class="dg-dot dg-dot--accent" cx="330" cy="110" r="6"/>
    <text class="dg-label" x="330" y="184" text-anchor="middle" dominant-baseline="central">agent 自主找到 0-day</text>
    <text class="dg-sub" x="330" y="206" text-anchor="middle" dominant-baseline="central">MONAI Label 路徑穿越，取得 root</text>
  </g>
  <g>
    <line class="dg-rule" x1="480" y1="58" x2="480" y2="104"/>
    <circle class="dg-dot" cx="480" cy="110" r="4"/>
    <text class="dg-label" x="480" y="26" text-anchor="middle" dominant-baseline="central">Amazon 揭露調查結果</text>
    <text class="dg-sub" x="480" y="48" text-anchor="middle" dominant-baseline="central">高信心判斷為 zero-day</text>
  </g>
  <g>
    <line class="dg-rule" x1="650" y1="150" x2="650" y2="170"/>
    <circle class="dg-dot" cx="650" cy="110" r="4"/>
    <text class="dg-label" x="650" y="184" text-anchor="middle" dominant-baseline="central">CISA 列入 KEV</text>
    <text class="dg-sub" x="650" y="206" text-anchor="middle" dominant-baseline="central">CVE-2026-133968</text>
  </g>
</svg>
```

### 2. Anthropic 推出 Claude Ship，讓 agent 自己審查、修復、核准程式碼變更

Anthropic 11/23 發布 Claude Ship，把程式碼審查、修復、核准三個原本需要人類工程師把關的步驟，整合進 agent 可以自己跑完的流程。這不只是新功能——它把「agent 寫程式碼」和「人類審查程式碼」這兩個原本分離的角色往同一個系統裡收，直接影響的是團隊要重新畫出「哪一類變更允許 agent 自己核准、哪一類一定要人盯著」的邊界，而不是繼續假設審查永遠有人類在場。（[TechCrunch](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)）

### 3. Sierra 完成 17.5 億美元 D 輪，估值半年翻倍到 300 億美元

客服 AI Agent 公司 Sierra 完成由 Greenoaks、Lightspeed 領投的 $1.75B D 輪，估值半年內從 $15.8B 翻倍到 $30B，年化營收突破 $400M。這代表客服 Agent 賽道的頭部效應正在加速拉開——同賽道的 XEBO.ai 本週也才完成 $10.5M A 輪，兩者之間的估值差距已經是三千倍量級，顯示資本正在用倍速把資源集中到已經證明規模化的少數玩家身上。（[funding-sierra](/posts/daily/2026-11-24-funding-sierra)）

### 4. MCP 協定層本週連爆兩起漏洞，信任戰場從模型對齊移到協定本身

Noma Security 發現開源 AI agent 協調平台 Ruflo（前身 Claude Flow，GitHub 8 萬+ star）的 MCP Bridge 預設零認證對外開放，單一 HTTP 請求即可取得容器 shell、竊取所有 LLM API 金鑰，還能毒化 AgentDB 持續操控該實例未來的 agent 輸出——升級修補版也清不掉已被植入的毒化資料，必須手動稽核。幾乎同一週，AWS 官方確認 API MCP Server 在 OAuth 模式下沒有驗證權杖的 audience 欄位，同租戶內核發給別的應用程式的權杖也會被接受，可能讓呼叫者借用 host 設定的 AWS 憑證執行操作；這起漏洞是資安公司用 AI 工具在 3 天內挖出的一批 MCP 相關漏洞之一。兩起事件都不是模型被騙去做壞事，是協定本身的身分驗證沒做對——說明 MCP 生態擴張的速度已經超過安全審查的速度。（[security-ruflo-mcp-bridge-rce](/posts/daily/2026-11-26-security-ruflo-mcp-bridge-rce)、[security-aws-api-mcp-oauth-audience-bypass](/posts/daily/2026-11-27-security-aws-api-mcp-oauth-audience-bypass)）

### 5. 企業導入進入「效益可量化、治理要跟上」階段

GE Appliances 用 800 個 Gemini Enterprise agent 把供應商缺貨訂單砍了 25%，BMW 則部署了一種不做事、專門盯著其他 agent 的治理型 agent。這兩個案例合起來說明，企業已經能把 agent 的生產力效益寫進財報，但同時也意識到規模化之後需要額外一層專職盯防。對照本週同時發生的 Cairn 零日事件和 MCP 協定層漏洞，這個治理層的投資不是合規作業，是跟模型選型同等重要的先決條件。（[TWARX：GE Appliances 案例](https://twarx.com/case-studies/ge-appliances-gemini-enterprise-agents-supplier-backorders)、[BMW 治理型 agent](https://thenextgentechinsider.com/pulse/bmw-deploys-governance-agent-to-secure-enterprise-ai-scale)）

## 本週認知更新

- 之前以為記憶系統論文的效能數字（砍半記憶還留 99% 效能、比全上下文基準高 5.77 個百分點）只要有完整的基準和消融實驗就站得住，現在知道本週至少 3 篇（MemFolder、MemOnce、Adobe 的 *Agentic Systems Need Multi-Run Evaluation*）的核心結果全部壓在同一個沒被驗證的地基上——答案對不對是由另一個 LLM 當裁判判定的，而這個裁判跟人類標註的一致性從未被獨立報告，意味著這些漂亮數字可能都需要打一個未知的折扣（[MemFolder](https://arxiv.org/abs/2611.26427)、[MemOnce](https://arxiv.org/abs/2611.27973)、[Multi-Run Evaluation](https://arxiv.org/abs/2611.31266)）
- 之前以為自主漏洞利用還停留在「把已經公開的 CVE 轉成可用攻擊程式」這個階段，現在看到 Cairn agent 11 分鐘自己找到一個從未被記錄的 MONAI Label 零日，意識到威脅模型已經要從「修補已知漏洞要快」升級到「假設持續有自主代理在找全新漏洞」
- 之前以為 agent 的安全風險主要來自「被提示注入騙去做壞事」，現在把 Ruflo MCP Bridge 零認證 RCE 和 AWS API MCP OAuth audience bypass 放在一起看才意識到，agent 完全沒被騙，它只是忠實執行了一個因為協定層身分驗證沒做對而被接受的指令——信任問題不在模型會不會被騙，在它連接的每一條 MCP 管道本身有沒有驗證清楚呼叫者是誰
- 之前以為 benchmark 分數和代理任務的實際可用性大致同步往前走，現在看 GPT-6.2 Astra 九項官方 benchmark 全面超越前代，卻被多位長期測試 OpenAI 旗艦模型的資深開發者公開批評長流程代理任務「幾乎不能用」，意識到官方 benchmark 已經追不上真實代理使用場景裡實際會出錯的那些細節

## 企業落地觀察

我認為本週最值得企業注意的信號，是 GE Appliances 和 BMW 這兩個案例放在一起看透露出的分工變化：GE Appliances 證明的是「agent 可以直接產生可量化的營運效益」，BMW 證明的是「規模化之後，盯著 agent 的 agent 本身自成一類，是獨立的服務」。（框架：互補資產）

用互補資產的角度分析：當核心能力（模型的推理與執行力）越容易被各家追平，真正稀缺、決定誰能把 agent 放進生產環境的互補資產，就會轉移到身分驗證與治理層——這點本週在 MCP 協定層的兩起漏洞上得到反向驗證：Ruflo 和 AWS API MCP Server 出事的地方都不是模型本身，是「誰有權呼叫這個工具」這一層沒做扎實。

對台灣企業導入的啟示：如果團隊正在評估要不要導入第三方 MCP server 或自建 agent 編排層，BMW 的治理型 agent 給了一個具體範本——先盯緊再放手，比先放手再補救便宜得多；而本週 Ruflo、AWS API MCP 的教訓是，來源審查不能只看「這家廠商可信嗎」，連自己團隊設定的身分驗證參數（audience、認證開關）有沒有照官方建議打開，都要列進上線前的檢查清單。

## 下週值得追蹤的

- Claude Sonnet 4.5 官方平台 11/30 退役，但 Amazon Bedrock 展延到 2027/4/8——同一個模型 ID 三種退役時程，下週是否有企業因為沒注意到這個分裂而踩雷
- OpenAI 的 GPT-5.6 Sol／Terra 將於 12/23 從 ChatGPT Chat／Work／Codex 停用，Codex 遷移到 GPT-6.2 Sol 後價格直接砍半——官方 API deprecations 頁面目前還沒把這兩個模型 ID 列進去，是否會在下週補上
- Ruflo MCP Bridge 升級修補版無法清除已被毒化的 AgentDB 資料，必須手動稽核——下週是否會有更多受害實例被確認仍在被操控輸出
- Inception 的 Mercury API 將於 12/28 關閉，NVIDIA 傳以逾 5 億美元併購案目前雙方都未證實，下週是否會有官方確認

## Watchlist 更新建議

### 建議加入

✓ 本週出現頻率最高的公司（openai、amazon、anthropic、alibaba-qwen、google、nvidia、microsoft、meta）皆已在 watchlist 中，無新增候選。

### :warning: 考慮移除

✓ 本週無符合移除條件的公司

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| Genesis AI | 用感測手套蒐集真人動作資料，訓練能跨機器人形態遷移的 AI 大腦 GENE | Series A $500M（估值 $3.5B） | Khosla Ventures、Premji Invest、Eclipse 共同領投，把「跨形態遷移的機器人大腦」當成下一個基礎模型級戰場 |
| Humyn Labs | 把工廠倉庫農場的真人工作轉成機器人訓練資料 | Series A $47M（$26M 股權 + $21M 創投債） | Accel、Lighthouse Canton 領投，六個月內自報年化營收破 $50M |
| Zipher | 用 AI agent 自主決定企業資料工作負載的運算資源、框架與排程 | Series A $45M（累計 $53M） | Maor Investments、Glilot Capital 領投，Hertz 等 Fortune 500 客戶回報運算成本降 25–40% |
| AidenAI | 用 1,000+ 人的 AI 工程團隊把企業 agent 部署進既有系統 | Series A $32M | A91 Partners 領投，成立三年來首次公開機構融資，賣的不只是平台還有駐點工程團隊 |
| XEBO.ai | 杜拜體驗管理平台，資金投入語音分析與 Agentic AI 並進軍北美 | Series A $10.5M | 阿聯成長基金 EGF 單獨領投（首位機構投資人），中東主權基金扶植可出海的 Agentic AI 賽道 |
| Agon | 打造歐洲國防 AI 實驗室 | Series A $70M（估值 $450M） | 前 Sequoia 高層領投，國防 AI 資金這週明顯加溫 |

## 我這週學到什麼

這週最大的認知差是「agent 安全問題正在從『被騙去做壞事』，變成『忠實執行一個不該被信任的指令』」。以前覺得防禦的重點是把模型對齊做好、擋住提示注入，這週看完 Cairn 自己找到從未公開的零日、再加上 Ruflo 和 AWS API MCP Server 都是因為身分驗證沒做對而出事之後才意識到，模型本身可能完全沒有被騙，問題出在它連接的那條管道有沒有先確認清楚呼叫者是誰。對台灣團隊的啟示是：導入 agent 或 MCP server 前，身分驗證參數要當成上線前的硬性檢查項目，不能假設廠商的預設值已經是安全的。

## 參考資料

- Watchlist 比對基準：`src/data/agent-watchlist.json`
- [Chinese-nexus actor's Cairn AI agents found a zero-day on their own — Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/)
- [CISA Adds Two Known Exploited Vulnerabilities to Catalog — CISA](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)
- [資安警報｜Cairn 自主 AI agent 在 MONAI Label 自行發現 0-day](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)
- [Anthropic launches Claude Ship — TechCrunch](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)
- [融資速報｜Sierra Series F $1.75B](/posts/daily/2026-11-24-funding-sierra)
- [資安警報｜Ruflo MCP Bridge 零認證遠端程式碼執行](/posts/daily/2026-11-26-security-ruflo-mcp-bridge-rce)
- [資安警報｜AWS API MCP Server OAuth 權杖稽核漏洞](/posts/daily/2026-11-27-security-aws-api-mcp-oauth-audience-bypass)
- [TWARX：GE Appliances 案例](https://twarx.com/case-studies/ge-appliances-gemini-enterprise-agents-supplier-backorders)
- [BMW 治理型 agent — thenextgentechinsider](https://thenextgentechinsider.com/pulse/bmw-deploys-governance-agent-to-secure-enterprise-ai-scale)
- [模型卡｜GPT-6.2 Astra](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra)
- [MemFolder: Structure-Guided Memory Folding for Efficient Agent Memory Management (arXiv:2611.26427)](https://arxiv.org/abs/2611.26427)
- [MemOnce: A Scalable Memory Architecture for Large Language Models (arXiv:2611.27973)](https://arxiv.org/abs/2611.27973)
- [Agentic Systems Need Multi-Run Evaluation (arXiv:2611.31266)](https://arxiv.org/abs/2611.31266)
- [定價追蹤｜Claude Sonnet 4.5 退役時程分裂](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence)
- [定價追蹤｜OpenAI 12/23 停用 GPT-5.6 Sol／Terra](/posts/daily/2026-11-26-pricing-openai-gpt-5-6-sol-terra-retirement)
- [定價追蹤｜Inception 的 Mercury API 將於 12/28 關閉](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown)
- [融資速報｜Genesis AI Series A $500M](/posts/daily/2026-11-23-funding-genesis-ai)
- [融資速報｜Humyn Labs Series A $47M](/posts/daily/2026-11-23-funding-humyn-labs)
- [融資速報｜Zipher Series A $45M](/posts/daily/2026-11-26-funding-zipher)
- [融資速報｜AidenAI Series A $32M](/posts/daily/2026-11-26-funding-aidenai)
- [融資速報｜XEBO.ai Series A $10.5M](/posts/daily/2026-11-27-funding-xebo-ai)
- [Agon A 輪 — Bloomberg](https://brp-prod-bcc.bloomberg.com/news/articles/2026-11-23/defense-ai-startup-agon-raises-70-million-series-a-from-vcs-ex-sequoia-boss)
