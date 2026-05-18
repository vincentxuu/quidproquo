---
title: "拆解 Anthropic Founder's Playbook：四階段、三條 moat、一個 Cowork 合規坑"
date: 2026-05-18
category: ai
type: deep-dive
tags: [anthropic, claude, startup, playbook, claude-cowork, compliance]
lang: zh-TW
tldr: "Anthropic 2026-05-14 發的 35 頁創業手冊，把 Idea/MVP/Launch/Scale 四階段按 agentic AI 重排。最值得學的是『build 越容易、validation 越重要』與 CLAUDE.md 當作 MVP 第一個 artifact；最該打折扣的是 Launch 章節把合規 workstream 跑在 Cowork 上 — Anthropic 自家文件說 Cowork 不寫 audit log。"
description: "解讀 Anthropic Founder's Playbook：四階段框架、moat 配方、產品分工矩陣，與一個跟自家 safety doc 矛盾的 Cowork 合規建議。"
draft: false
---

Anthropic 在 2026-05-14 推出 35 頁 eBook《The Founder's Playbook: Building an AI-Native Startup》，把傳統創業四階段（Idea → MVP → Launch → Scale）按 2026 年的 agentic AI 能力重排。這份文件同時是 Chat / Cowork / Claude Code / Claude Security 的銷售文件 — 它跟 Claude for Small Business（5/13 上線）是同一波 downmarket campaign 的一部分。文件值得讀，但有一處跟 Anthropic 自家 safety 文件直接矛盾的建議，照著做會在第一張企業合約來之前先吃 enforcement action。

## 四階段框架：每階段的 exit 條件變嚴格了

Playbook 的主架構不新 — Lean Startup 的 validation-first 邏輯還是主軸 — 但每階段「該做什麼／不該做什麼」按 2026 年現實重寫過。

**Idea**：目標是 problem-solution fit，工作主要是研究、客戶訪談、競品分析。Exit 條件：「能精確說出誰有這個問題、發生多頻繁、有多嚴重、目前怎麼解決」。Playbook 引述 CB Insights 的數據 — 「42% of startups failed because they built something nobody wanted」 — 然後直接點出新時代的失敗模式：

> Many first-time (and even experienced) founders mistakenly believe that AI short-circuits that requirement, turning the flow into *have an idea → immediately build a prototype → treat the existence of the prototype as validation*.

注意這個 42% 數字其實 2026-03 已經被 CB Insights 更新成 43%（樣本擴大到 431 家 2023 年之後關掉的公司），方向沒變但 footnote 沒跟上。

**MVP**：目標是 product-market fit。Playbook 對這階段最在意的不是「快」而是「兩件事一起做」— 把產品做到能驗證 PMF，同時不要累積會在 Launch 階段爆炸的「agentic technical debt」。它把 PMF measurement framework 強制前置 — retention benchmark、activation criteria、Day 7 / Day 30 目標必須在 MVP 上線**之前**就訂好，理由是「上線後才訂指標的 founder，會用『證明在 work』的指標、不會用『surface 哪裡沒 work』的指標」。

**Launch**：目標從「證明產品該存在」變成「證明公司該長大」。Exit 條件兩條：(1) 成長變 channel-driven、CAC/LTV/payback 算得出來；(2) 「Operations run without founder bottlenecks」— 創辦人不再是支援、triage、sprint planning、報表的單點。

**Scale**：目標是 defensible moat。Playbook 把 moat 拆成三條腿 — 後面單獨講。

## 三個反直覺主張

Lean Startup 已經講了 14 年的觀念，這份手冊新加的價值在於明確指出 agentic AI 把哪些舊風險放大、哪些新風險引進來：

**1. Build 越容易，validation 越重要**。傳統時代 build 成本本身就是煞車，現在沒了，「prototype 已存在」被當作 validation 的機率反而升高。Playbook 寫得很直白：「The prototype becomes a reason to believe the hypothesis was right all along, without ever testing whether it's actually true.」

**2. Confirmation bias 現在有研究引擎加持**。直接告訴 AI「幫我證明這個想法可行」會得到很有說服力的答案；要 AI 算 TAM 會給出剛好讓你的 deck 過關的數字。Playbook 的反制動作是把 Claude 當作結構性 devil's advocate，在每個關鍵節點問「最強的反論是什麼」、「哪些 disconfirming evidence 我漏看了」。

**3. Scope creep 變成 zero-friction**。「再加一個 edge case」「再做一個 workflow」傳統時代的煞車是 engineering cost，現在每個 feature 都「只要一個下午」。Playbook 要求在 MVP 開始之前就寫一份 scope doc，明確列出「我們做什麼、刻意不做什麼、什麼樣的真實證據才會觸發新 feature」。

這三條的共同特徵：傳統失敗模式沒消失，只是踩進去的速度變快、自己很難察覺。

## 產品分工矩陣：Chat / Cowork / Code

Playbook 給了一張很實用的決策表 —

| 任務 | 用 | 為什麼 |
|---|---|---|
| 問題、改寫、快速 brainstorm | Chat | 快、對話式、零設定 |
| 從多個檔案/系統做研究、分析、產出完整文件 | Claude Cowork | folder access、connectors、skills、scheduled runs |
| 寫、測、部署軟體 | Claude Code | codebase 存取、diffs、git、開發環境 |

底層是同一個 Claude，差別在「workspace 圍繞它的長相」。產品矩陣的真實狀態值得補一下背景：

- **Claude Cowork** 2026-01 才以 research preview 上線，2026-02-24 補上跟 Google Drive / Gmail / DocuSign / FactSet 的 connector 與 plugin
- **Claude Code Security** 在 Playbook 出版時還是 limited beta（文件腳註特別標注「check current availability」），實際上 2026-04-30 已改名 **Claude Security**、用 Opus 4.7、進入 Enterprise public beta，Team/Max 後續跟進

Playbook 沒提的是 Cowork 與 Claude.ai Enterprise 的合規能力差異 — 後面單獨講這個。

## Scale 階段：moat 的三條腿

Scale 章節是整份文件最值得抄筆記的部分。Playbook 把 AI-native startup 的可防禦性拆成三個來源：

**1. Domain expertise injection（把 founder 的領域知識變成 AI context）**。
透過長期對話、Projects、Memory、Skills 把行業術語、法規 gotchas、edge cases、為什麼明顯答案不 work 的理由全部餵進 Claude。Playbook 給的例子很具體：「一般醫療帳單工具會在 340B 藥物計畫的請款上出錯，你的工具有專屬邏輯」。練習題是「找一個通用競品一定會搞錯的 vertical edge case，跟 Claude Code 寫成一個專屬 test case，每次看到類似 case 就加進去 — 你的 test suite 變成 moat 的地圖」。

**2. User data flywheel（行為資料的時間鎖定優勢）**。
使用者接受／拒絕哪些輸出、用哪些功能、放棄哪些 — 這些 behavioral fingerprint 「時間鎖定、context-specific、抄不來」。Playbook 強調這條 moat 的關鍵不是「有多少資料」而是「有沒有設計成回饋迴圈」 — 把資料變成系統性的模型改進，比單純累積 dataset 重要。

**3. Workflow lock-in（嵌入越深越難換）**。
使用者在你的產品上建 automation、訓練同事、接資料來源、開發 prompts — 這些累積的不只是依賴，是組織內的「換軌成本」。Playbook 的具體建議：用 Claude 為 top 10 客戶做 workflow integration audit，估算每個客戶的 switching cost，找出哪些 integration 創造最深的 lock-in、缺哪些可以再深化。

三條腿的共通邏輯：moat 不是「有就有」，是要在 Scale 階段**主動設計**回饋迴圈、test suite、integration 深度，把每天使用累積成可量化的可防禦性。

## CLAUDE.md：MVP 的第一個 artifact

Playbook 把 `CLAUDE.md` 升格成「不是工程師的便利檔，是 MVP 第一個該存在的 artifact」。原文這段很直接：

> Without specs and architectural constraints written down somewhere the AI can read, each session re-derives foundational decisions from scratch, and those decisions drift.

它的建議流程：在打開 Claude Code 之前，先用 Claude 整理出你要 build 什麼、解決什麼問題、未來六個月預期的規模 — 把產出存成 `CLAUDE.md`。每個 Claude Code session 開頭重看一次 scope doc 與 architectural context，結尾用 5 分鐘加一條 log 記錄這次 session 做了什麼決定、引進什麼假設。

這條建議的價值在於它把「agentic technical debt」具體化了 — 不是程式碼層的 bad code，而是「session 之間缺乏 shared mental model」的結構性問題。沒有持續維護的 context 檔，每次 Claude Code 跑都是重新 derive 一次架構假設，最後 codebase「每塊都對，但合不起來」。

## 跟 Lean Startup 比，真新意是什麼

把 Playbook 跟 Eric Ries 的 Lean Startup（2011）並排比較：

| 維度 | Lean Startup | Founder's Playbook |
|---|---|---|
| Validate vs build 順序 | Build-Measure-Learn 迴圈，MVP 即測試 | Validation 強制前置，明確警告「prototype ≠ validation」 |
| 對團隊規模假設 | 小團隊 | 1 人即可，AI 補滿剩下角色 |
| Tooling 假設 | 不指定 | 預設 Claude Chat + Cowork + Code 全套 |
| Moat 來源 | 學習速度 | domain depth + user data flywheel + workflow lock-in |
| Bottleneck 認知 | 學習與假設驗證 | what to build（取捨判斷力） |

核心方法論 90% 沒變。真正的新意有三條：(a) 把 agentic coding 把 cost-to-build 砍到接近零後的失敗模式系統性分類；(b) 引進「persistent context」（如 CLAUDE.md）作為新基礎建設；(c) moat 配方加進 user-data flywheel。

## 一個跟自家 safety doc 矛盾的建議

Playbook 最大的內傷在 Launch 章節「Make security and compliance a product workstream」這節。原文建議：

> Build the compliance workstream into your development cycle rather than running it as a one-time project; compliance documentation needs to be continually maintained and updated.

實作方式：用 Claude Code 掃 SOC 2 / GDPR / HIPAA audit 常見問題、用 Claude Cowork 把合規流程嵌進開發週期。

問題在於：**Cowork 的活動不寫入 Anthropic 的 audit log、不在 Compliance API、不能 data export**。多家獨立安全廠商已經點名這個 gap — IRM Consulting 的說法很直接：「Anthropic is explicit: do not use Cowork for regulated workloads. This is not a grey area.」

依 TechTimes 2026-05-16 的對照文章：

> Claude Chat at the Enterprise tier includes full audit logs, Compliance API access, and 180-day export capabilities. Cowork does not. A founder who builds a compliance workstream on Cowork — precisely what the playbook recommends — would find that workstream invisible to the very auditors the compliance effort is meant to satisfy.

Playbook 唯一的免責是兩段之後一句「AI scans are an aid but not a substitute for qualified compliance review」 — 沒有講真正的 audit-log gap。對處理 SOC 2 / HIPAA / PCI-DSS / GDPR / CMMC / ISO 27001 範圍資料的 founder，這條建議照著做會出事。

這不是設定問題，是 Cowork 的架構限制。Cowork 是 Anthropic Labs 的 research preview 出身的產品，當初設計目標是個人生產力，不是企業合規 — 合規該用 Claude.ai Enterprise tier（有完整 audit log、Compliance API 與 180 天 export），不是 Cowork。

## 怎麼讀這份文件

| 角色 | 怎麼讀 |
|---|---|
| 第一次創業、想知道 AI 時代工作流 | 直接讀，特別看 Idea / MVP 兩章 |
| 有 domain expertise 無工程背景 | Scale 章節 moat 三條腿值得抄筆記 |
| 已過 PMF 的成長期團隊 | 跳到 Launch 章節看 founder-bottleneck audit 練習 |
| 處理 regulated data（醫療／金融／支付） | **不要照 Launch 章節做合規** — 用 Claude.ai Enterprise，不要用 Cowork |
| 找供應商中立建議 | 不是這份；整本書建議都圍繞 Claude 產品矩陣 |

## 整體來說

這份 Playbook 最有料的不是方法論本身 — Lean Startup 講過了 — 而是 Anthropic 直接點出 agentic coding 把哪些舊風險放大、哪些新風險引進來，並把對應的紀律寫成可執行的 exercise。「Build 越容易、validation 越重要」、「CLAUDE.md 是 MVP 第一個 artifact」、「moat 配方多了 user-data flywheel 這條」這三條是值得抄走的核心觀念。

該打折扣的地方也很明確：合規建議跟自家 safety doc 矛盾、「one-person unicorn」基調過度樂觀（最常被引用的 Medvi 案例同時也吃了 FDA warning letter、合作方資安外洩、客服 chatbot 編造藥價），整本文件是供應商角度的最佳實踐，不是中立的創業指南。

當作「一份知道內情的供應商寫的實戰建議」讀很有用；當作「這就是 AI 時代創業的全貌」讀會踩雷。

## 參考資料

- [The Founder's Playbook: Building an AI-Native Startup（原文 blog post）](https://claude.com/blog/the-founders-playbook)
- [The Founder's Playbook（PDF 全文）](https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/69fe2a55b93bb0732b1fe33c_The-Founders-Playbook-05062026_v3%20(1).pdf)
- [Anthropic's New Founder Playbook Argues AI Has "Rebooted" the Startup Lifecycle — Here's What Holds Up（TechTimes, 2026-05-16）](https://www.techtimes.com/articles/316740/20260516/anthropics-new-founder-playbook-argues-ai-has-rebooted-startup-lifecycle-heres-what-holds.htm)
- [Claude Security enters public beta with Opus 4.7 vulnerability scanning（Help Net Security, 2026-05-04）](https://www.helpnetsecurity.com/2026/05/04/anthropic-claude-security-public-beta/)
- [Anthropic's Claude Security emerges from closed preview（The New Stack, 2026-04-30）](https://thenewstack.io/anthropics-claude-security-beta/)
- [Anthropic updates Claude Cowork tool for the average office worker（CNBC, 2026-02-24）](https://www.cnbc.com/2026/02/24/anthropic-claude-cowork-office-worker.html)
- [Introducing Anthropic Labs（Anthropic, 2026）](https://www.anthropic.com/news/introducing-anthropic-labs)
- [How three YC startups built their companies with Claude Code（Anthropic blog）](https://claude.com/blog/building-companies-with-claude-code)
- [How Carta Healthcare gets AI to reason like a clinical abstractor（Anthropic blog）](https://claude.com/blog/carta-healthcare-clinical-abstractor)
- [Anthropic Startup Program Official Terms](https://www.anthropic.com/startup-program-official-terms)
- [CB Insights: Top reasons startups fail](https://www.cbinsights.com/research/report/startup-failure-reasons-top/)
- [Sonar: Thoughts on Claude Code Security](https://www.sonarsource.com/blog/thoughts-on-claude-code-security)
