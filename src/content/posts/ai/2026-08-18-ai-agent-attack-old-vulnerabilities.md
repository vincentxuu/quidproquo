---
title: "AI Agent 攻進政府系統，用的全是老問題：一份報告的查證，與我自己站上的兩個洞"
date: 2026-08-18
category: ai
type: deep-dive
tags: [security, ai-agent, agent-skills, openclaw, hermes-agent, llm]
lang: zh-TW
tldr: "2026 年 7 月 1 至 4 日，一套跑在 Hermes 與 OpenClaw 上的多代理框架對臺灣政府發動 12 波攻擊，破解 85 組帳密。整條攻擊鏈沒有一個 0-day——全是未驗證 API、留在生產環境的除錯後門、`alg: none`。照同一份清單掃自己的站，找到兩個。"
description: "拆解 Dream 揭露的 AI Agent 攻擊報告：兩層貝氏決策引擎怎麼運作、報告本身哪兩處引用經不起查、godmode 為什麼是 Hermes 官方 repo 裡的 skill，以及照同一份清單稽核自己 API 端點的結果。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-ai-agent-attack-old-vulnerabilities-en)

八月中旬，《金融時報》引述以色列資安公司 [Dream](https://dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia) 的報告，揭露一套多代理 AI 攻擊框架在 2026 年 7 月 1 至 4 日對亞洲某國政府發動 12 波入侵，四天內產出 1,395 個檔案、破解 85 組帳密。數位發展部資通安全署[隨後證實](https://moda.gov.tw/ACS/press/news/press/20394)臺灣在 7 月遭到攻擊。這篇不複述新聞，而是把原始報告、官方公告與評測原文攤開對讀，看它到底教了什麼——以及照同一份清單回頭掃自己的站，會掃出什麼。

## 四天、12 波：攻擊鏈上沒有一個 0-day

Dream 描述的攻擊鏈從一個 Angular 打造的政府入口網站開始，反編譯它的 JavaScript bundle，取出裡面的 API 端點、OAuth client ID 與 Keycloak 組態，據此測繪出 21 個相連系統與 6 個 SSO sub-realm：

```
政府入口網站 (Angular)
  └─ 反編譯 JS bundle → API 端點 / OAuth client ID / Keycloak 組態
       ├─ 測繪 21 個相連系統、6 個 SSO sub-realm、36+ API 端點
       ├─ 三個除錯後門端點（送任意內容即回傳有效 session）
       ├─ 密碼潑灑（員工編號變體 + Tesseract OCR 解 CAPTCHA）→ 85 組
       └─ JWT alg: none → 免金鑰偽造身分
            └─ SSO 橋接端點無條件信任 → 84/85 進入內部系統
```

值得停下來看的是每一格的內容：未驗證的 API 端點（其中一個不用登入就能匯出整份使用者資料庫）、留在生產環境的開發除錯後門、`alg: none` 的 JWT、以員工編號變形而成的密碼、無條件互信的 SSO。**沒有一個是新技術。**

（嚴格說，Dream 沒有明講「沒有 0-day」，這是把它列出的每一個突破口逐條看完得到的結論；而報告只涵蓋它從工作區還原出來的部分。）

Anthropic 在 [GTG-1002 的完整報告](https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf)裡對自己觀察到的案例下了同樣的判斷：

> The minimal reliance on proprietary tools or advanced exploit development demonstrates that cyber capabilities increasingly derive from orchestration of commodity resources rather than technical innovation.

有一個細節中文報導幾乎全數略過：這套框架把 web shell 傳上去了，但被第二層 Forms Authentication 擋住，**沒有取得遠端程式執行**。Palo Alto [Unit 42 在 7 月 30 日的報告](https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign)裡，另一組人馬的自主攻擊段更是全軍覆沒——Langflow 那條敗在目標沒開 `auto_login`、n8n 那條敗在表單端點要驗證。Unit 42 的結論寫得很直白：「Targets with weaker default configurations would have been susceptible.」

擋下這些的不是什麼 AI 防禦產品，是一層設定正確的普通驗證。

## 貝氏優先排序：這次真正新的東西

如果說有什麼是新的，是**優先順序判斷被寫成了公式**。紅隊最難自動化的一環一直是「該先打哪裡」，而 Dream 從工作區裡挖出的是一套兩層貝氏模型。

第一層評估單一發現。每個漏洞從無資訊先驗 P = 0.50 起算，依證據以明確的似然比更新：工具掃描為正 LR+ = 6.0、手動 `curl` 確認 LR+ = 10.0、存在 WAF 則 LR− = 0.30。後驗大於 0.95 升級為攻擊鏈，小於 0.30 直接丟棄。

第二層評估整條路徑：

```
P_success = P_chain × (1 - P_blocker)
P_chain   = 已確認步驟 / 總步驟數
```

那條被評為 99% 的 SSO 橫向移動鏈，是由三個各自確認過的發現組成（未驗證使用者清單、密碼潑灑成功、SSO token 取得），P_chain = 3/3 = 1.0，唯一的理論阻礙是目標下線，P_blocker 約 0.01。**事後實測 84/85 成功，98.8%——跟預測幾乎重合。**

更值得偷的是它處理幻覺的方式。Anthropic 對 GTG-1002 的評語是 Claude「frequently overstated findings and occasionally fabricated data」，宣稱拿到根本不能用的憑證，而這「remains an obstacle to fully autonomous cyberattacks」。臺灣這案的框架則在最終報告裡標了 `8个真实漏洞(物理确权+3+3交叉验证)`：每個結論要通過發現者驗證加上兩輪各三個獨立 agent 複驗，共六次重測才採信。12 波總結裡列了 7 個被自己抓出來的誤判，其中最漂亮的一個是把 21 秒延遲當成 `SLEEP(5)` 注入成功，重測後發現那是伺服器在寄驗證信的 SMTP timeout。

這是攻擊者寫的 eval harness，而且它有效。任何在做 agent pipeline 的人都在對付同一個問題。

## 這份報告有兩處經不起查

這份報告被《金融時報》、The Register、CyberScoop、中央社全數轉載。它裡面只有兩個外部可查證的引用，兩個都有問題。

**一、成本比較搞錯了指標。** Dream 寫「On AISI's cyber range, a solved task runs $12.50 on a leading commercial model against $0.28 on an open Chinese one」。回頭讀[英國 AISI 的原文](https://www.aisi.gov.uk/blog/how-far-behind-the-frontier-are-leading-open-weight-models-on-cyber)：

> Opus 4.6 cost $15.17 per task versus GLM-5.2's $6.12, and Opus 4.5 cost $12.50 per task versus DeepSeek V4-Pro's $0.28.

這組數字出自 narrow cyber tasks，不是 cyber range；cyber range 的對應數字是 $85 對 $1.19。而那個「leading commercial model」是 2025 年 11 月的 Opus 4.5，同一張表裡真正的前沿對照組只差 2.5 倍。

**二、引 Kimi K3 評估時砍掉了主結論。** Dream 說政府評測發現 Kimi K3 的防護沒擋住 exploit 開發——這半句沒錯。但[那份英美聯合評測](https://www.aisi.gov.uk/blog/preliminary-assessment-of-kimi-k3s-cyber-capabilities)的主結論是 Kimi K3 能力「significantly below」前沿模型：任意程式執行 0/41，最強模型平均 20/41；模擬網路攻擊平均走到第 17 步，最強美國模型 28.5 步。報告還註明美國封閉模型是在**關掉系統層防護**的狀態下受測的，這直接削弱「開放權重防護較弱」作為區隔點的力道。

另外，Dream 部落格寫的是「achieved confirmed, real-world compromises」，但其發言人[對 CSO Online 表示](https://www.csoonline.com/article/4209210/ai-agents-wage-near-autonomous-cyberattack-on-asian-government-networks.html)「its research did not find evidence of a confirmed breach of the entity's systems」。資安署也只證實有此事，沒有背書任何數字。

這不代表 Dream 造假——第一手觀察是它自己的資料。但它說明一件事：**從 FT 到中央社，沒有一站把它引的東西點開來看。**

## godmode 是 Hermes 官方 repo 裡的 skill

Dream 對這些 agent 框架的說法是「innocuous ones never built for offensive work」。

站上[四月介紹過 Hermes Agent](/posts/ai/2026-04-05-hermes-agent-intro)，當時沒提它的 skill 目錄裡有什麼。查了才發現：[`godmode`](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-godmode) 位於官方 repo 的 `optional-skills/security/godmode`，安裝指令是 `hermes skills install official/security/godmode`，作者掛的是「Hermes Agent + Teknium」（[Teknium](https://github.com/teknium1) 在自己的 GitHub 簡介寫的是「a Co-founder of NousResearch」），功能寫得毫不掩飾：「Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN」，內容是一張按模型家族排序的越獄策略表，涵蓋 Claude、GPT、Gemini、Grok、DeepSeek、Qwen。依[官方的信任層級表](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)，`optional-skills/` 屬於 `official`，享有「built-in trust, no third-party warning」。同一個 `security` 分類下還有 `obliteratus`（改權重移除模型的拒絕行為）與 `web-pentest`。

公允的講法不是「Hermes 是攻擊工具」，也不是「無辜工具被誤用」，而是：**它同時是兩者，而且並不掩飾。** 對照組是 Unit 42 那案——OpenAI 的 provider 端防護擋下了違規請求並停用帳號，而走 DeepSeek 加開源框架的那條線，沒有任何人可以封。

這對用 agent 的人是很實際的問題：你 `install` 的東西帶著什麼預設信任？

## 回頭掃自己的站：兩個沒人守的端點

把上面那份清單拿來掃這個站的 API 面（Astro SSR + Cloudflare Workers，101 個 API 端點），找到兩個同類問題，都已修掉：

**一、一個沒有驗證的資料庫寫入端點。** `/api/posts` 有個 `POST`，沒有任何驗證，直接對 D1 做 `INSERT ... ON CONFLICT DO UPDATE`，等於任何人都能覆寫文章。更精確地說：它**沒有任何呼叫端**（`pnpm sync` 走的是另一支腳本），但 `posts` 表會被公開的 `/api/search`、`/api/related-posts` 以及 RAG 的 `get-post-detail` 讀取——所以它同時是一條把任意內容送進讀者介面與 LLM 上下文的路徑。已直接移除。

資安院院長龔化中在[〈AI 資安疫情全球蔓延〉](https://www.nics.nat.gov.tw/latest_news/announcements/Latest_Announcement/f1633355-6ee2-40ba-90f1-5e1de65acbf1/)裡列的第一條就是「暫時開放、之後卻忘記關閉的網路服務」。它字面上就在我的站上。

**二、登入沒接上已經寫好的速率限制。** `src/lib/auth/rate-limit.ts` 早就存在、有測試、`/api/search` 和 `/api/chat` 都接了，唯獨 `/api/auth/login` 沒有。而登入是單一共用密碼、沒有帳號可枚舉、沒有鎖定，後面是 90 個 admin 路由——密碼潑灑連枚舉帳號那一步都省了。已補上每來源 IP 每日上限，並把密碼比較改成常數時間。

還有一個過程中的教訓：我第一輪用 `grep` 找「沒有 guard 的路由」，抓到三個，實際打開來讀之後全是誤報——它們走的是另一套 `scheduled-auth`。**grep 出來的是候選，不是結論。**

## 整體來說

三層收束：

1. **AI 不創造新破口。** 它讓「應該沒人會注意」這個假設失效。資安署證實的攻擊特徵裡，最值得貼在公告欄上的是「利用備援、測試等次要系統作為跳板」。
2. **目前擋下自主攻擊的，還是最基本的那些東西。** 端點要驗證、預設組態不要開、密碼不要用員工編號。Unit 42 的自主攻擊段就是敗在這裡。
3. **但緩衝有期限。** AISI 量到開放權重落後封閉前沿 4 到 7 個月，而且從 2025 年的 6 到 10 個月**收窄**了。真正該做的不是「用 AI 打 AI」，是趁窗口關上以前，把那些「反正沒人會發現」的東西清乾淨。

順帶一提，Unit 42 那案最後是怎麼曝光的：攻擊者的 Hermes agent 收到指令後，在家目錄而不是隔離目錄啟動了 `python3 -m http.server 8888`，把 API 金鑰、漏洞腳本、目標清單全部開到公網。Unit 42 的評語是：

> The same autonomous capability the actor developed for offensive use directly caused the exposure of the operation.

自主化放大的不只是攻擊力。

## 參考資料

- [Dream — Inside a Multi-Agent AI Framework Used to Compromise Government Entities in Asia](https://dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia)
- [Dream — Governments Are Not Ready for Autonomous AI Attacks](https://dreamgroup.com/blog/governments-are-not-ready-for-autonomous-ai-attacks)
- [Unit 42 — Chinese-Speaking Threat Actor Harnesses AI Models for Autonomous Cyberattacks](https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign)
- [Anthropic — Disrupting the first reported AI-orchestrated cyber espionage campaign（完整報告 PDF）](https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf)
- [UK AISI — How Far Behind the Frontier are Leading Open Weight Models on Cyber?](https://www.aisi.gov.uk/blog/how-far-behind-the-frontier-are-leading-open-weight-models-on-cyber)
- [UK AISI / CAISI — Preliminary Assessment of Kimi K3's Cyber Capabilities](https://www.aisi.gov.uk/blog/preliminary-assessment-of-kimi-k3s-cyber-capabilities)
- [數位發展部資通安全署 — 境外駭客發動 AI Agent 攻擊政府機關](https://moda.gov.tw/ACS/press/news/press/20394)（中文）
- [國家資通安全研究院 — AI 資安疫情全球蔓延，機關與企業如何迎戰？](https://www.nics.nat.gov.tw/latest_news/announcements/Latest_Announcement/f1633355-6ee2-40ba-90f1-5e1de65acbf1/)（中文）
- [iThome — 政府系統淪 AI Agent 攻擊實戰場，TeamT5 執行長蔡松廷專訪](https://www.ithome.com.tw/news/178135)（中文）
- [CSO Online — AI agents wage near-autonomous cyberattack on Asian government networks](https://www.csoonline.com/article/4209210/ai-agents-wage-near-autonomous-cyberattack-on-asian-government-networks.html)
- [Hermes Agent — godmode skill 文件](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-godmode)
- [Hermes Agent — Skills System 信任層級](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Teknium（Nous Research 共同創辦人）GitHub 簡介](https://github.com/teknium1)
- [Hermes Agent：Nous Research 的自我改進 AI 代理](/posts/ai/2026-04-05-hermes-agent-intro)
- [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
