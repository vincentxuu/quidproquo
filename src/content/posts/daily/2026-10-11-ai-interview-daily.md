---
title: "AI Engineer 面試日練 — 2026-10-11：本週回顧與行為面試"
date: 2026-10-11
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『內部維運 agent 在第三方告警 API 異常時卡進無限重試迴圈，一晚建出 327 張重複 Jira 工單、燒掉平常一週的 LLM API 預算』的真實情境，怎麼先止血再揪出三個同時缺失的防護層，並回顧本週從 ML Fundamentals 到 Paper Reading 七天全數產出、沒有缺口的完整一週。"
tldr: "2026 年多篇追蹤 AI agent 生產事故的報告都指出同一種失敗模式：agent 一旦拿到『能動手』的能力（建工單、發通知、寫資料庫），卻缺一層強制的執行邊界，detection 永遠發生在傷害造成之後。今天用『alert-to-ticket agent 遇到第三方 API 回傳格式異常的 5xx，判斷成可重試錯誤，從凌晨 2 點重試到早上 7 點，建出 327 張重複工單、帳單是平常同期的 38 倍』走一輪完整 STAR——核心是先用 feature flag 止血、再把根因拆成『沒有 step limit、沒有 idempotency key、沒有 cost alert』三層分開修，而不是重啟服務草草結案。並回顧本週 ML Fundamentals、Deep Learning、ML System Design、LLM & Agent Engineering、Coding、Paper Reading 六天的練習重點——這週七天全數產出，沒有缺口。"
series:
  name: "AI Engineer 面試日練"
  order: 53
---

> 🌏 [English version](/en/posts/daily/2026-10-11-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：alert-to-ticket agent 卡進無限重試迴圈，一晚建出 327 張重複 Jira 工單

2026 年 AI Engineer 跟 Forward Deployed Engineer 的行為面試指南，把「Tell me about a production incident you handled」列成固定題型，而且特別點出面試官在意的不是你多快修好 bug，而是你有沒有「先止血、再找根因、最後做成系統性檢查」這套完整順序。幾篇追蹤 2026 年 AI agent 生產事故的報告也指出同一個模式反覆出現：agent 一拿到「能動手」的能力（建工單、發通知、寫資料庫），只要缺一層強制的執行邊界，detection 幾乎都發生在傷害已經造成之後——帳單被燒穿、重複工單灌爆 on-call 頻道，都是先看到結果才回頭查原因。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：我們有一個內部維運 agent，職責是監看告警平台丟來的事件，判斷嚴重度之後自動在 Jira 建對應工單。某天凌晨，上游的第三方告警 API 進維護窗口，開始回傳帶 body 但格式跑掉的 5xx——agent 的重試邏輯只看 HTTP 狀態碼，判斷「5xx＝可重試」，卻沒有判斷「這是同一個事件還是新事件」，於是從凌晨 2 點開始，每次重試都因為格式錯誤解析失敗、又觸發下一輪重試，一路跑到早上 7 點值班工程師上線才被發現。

**任務**：我是當天的 on-call，要先把損害止住，再找出讓它一次燒穿一週預算的根本原因，而不是單純重啟服務草草結案。

**行動**：我沒有先去重啟整個服務，因為同一個 agent 身上還有查詢系統狀態、讀 runbook 這些工具要繼續運作，重啟會連帶中斷這些沒出問題的功能。我先用 feature flag 把「建立 Jira 工單」這一個工具單獨關掉，止住重複工單繼續灌入；同時在 incident channel 貼出狀態更新，講清楚「已止血、正在查根因」，不是等修完才發聲。接著跟 Jira admin 一起把當晚建出的工單批次關閉，標註「duplicate, auto-generated, see INC-xxx」方便之後追溯。查根因的時候我發現這不是單一個漏洞，是三層防護同時缺失：第一，agent 沒有 max steps per run，重試次數沒有上限；第二，沒有以「告警來源＋錯誤內容」做 fingerprint 的 idempotency key，所以每次重試都被當成全新事件去建新單；第三，沒有 hourly cost alert，LLM API 帳單燒穿一整晚都沒人被通知。我把修法拆成對應這三層分開做：加 max_steps 限制、用告警 fingerprint 當 idempotency key（同一個 fingerprint 在時間窗內只能觸發一次建單）、加設 cost alert 閾值，並且找了當初寫這段重試邏輯的同事一起開了一場 blameless review，把這三項寫進我們團隊的 agent production checklist。

**結果**：三週後，同一個第三方 API 又發生一次類似的格式異常，這次因為有 max_steps，agent 在第 5 次重試後自動停止；因為有 idempotency key，整個事件只建出 1 張工單；因為有 cost alert，就算真的燒到門檻也會在觸發當下就通知到人，不用等到隔天看帳單才發現。「任何會呼叫寫入型工具（建單、發通知、動資料庫）的 agent，上線前都要過 max_steps、idempotency key、cost alert 這三項檢查」現在是我們團隊 agent 上線前的硬性清單項目。

如果我當時只是重啟服務讓它先別鬧，三週後同一個第三方 API 故障大概會原封不動重演一次——這也是我現在看任何「會動手」的 agent 時的習慣：先問它有沒有強制的執行邊界，而不是先問它判斷得準不準，判斷再準,沒有邊界的 agent 遲早會在某次上游異常時把自己的能力用在不該用的地方。

### 怎麼講這個故事

- **Do**：先講「怎麼止血」再講「怎麼找根因」——面試官在意的是你有沒有把 contain 跟 diagnose 分成兩個動作做，不是你多快修好程式碼。
- **Do**：用具體數字撐住每個轉折（凌晨 2 點到早上 7 點、327 張重複工單、帳單是平常同期的 38 倍、修完後第 5 次重試自動停、只建 1 張工單），尤其要把三個根因跟對應的三個修法一一配對講清楚，不要混成一團。
- **Do**：提到你找了原本寫那段邏輯的同事一起開 blameless review——這是在展示你知道事故覆盤的重點是系統性修補，不是抓戰犯。
- **Don't**：不要把這個故事講成「我一個人半夜扛下來修好了」的英雄敘事，重點是你怎麼把損害控制、根因拆解、系統性檢查三件事分開、有順序地做完。
- **Don't**：不要跳過「先在 incident channel 發狀態更新」這段——招聘指南反覆強調，事故處理裡「邊修邊噤聲」跟「技術上修好了」是兩件分開的失分項。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | Grid Search、Random Search、Bayesian Optimization 三種超參數搜尋在「記不記得過去試驗」上的效率差距、Huber Loss 用轉折點縫合 MSE 的平滑跟 MAE 的穩健、維度詛咒讓距離度量在高維空間先失效、梯度消失的連鎖律乘積機制（Pinterest 面試題） | （讀者自填） |
| Tue | Deep Learning & NLP | Self-Attention 的 scaled dot-product 為什麼要除以 sqrt(d_k)、tokenizer fertility 怎麼決定多語言 LLM 的成本結構、BERT 的 attention mask 跟 loss label 是兩個獨立機制、CNN 跟 RNN 的取捨（Sarvam AI 風格面試題） | （讀者自填） |
| Wed | ML System Design | feature store 怎麼消除 training-serving skew、先定 baseline 再談複雜模型的設計哲學、PSI 與 KS test 兩種飄移偵測方法、shadow deployment 到 canary rollout 的漸進上線順序（A10 Networks 面試題） | （讀者自填） |
| Thu | LLM & Agent Engineering | workflow 跟 agent 的分界是「agency 是成本不是功能」、agent loop 的組件跟 natural／forced stop conditions、context engineering 把 prompt 當 API 設計、agent 評估要做到 span-level scoring（企業知識庫客服 agent 情境題） | （讀者自填） |
| Fri | Coding | token bucket rate limiter 的 lazy refill 設計、LLM API 的限流單位是 token 不是請求數、check-then-deduct 的 race condition、單次請求 cost 超過桶子容量時的邊界處理 | （讀者自填） |
| Sat | Paper Reading | 精讀《Accurate but Not Humble》提出的 ISE（Identify/Solve/Escalate）框架，拆解準確率跟誠實度常常互相抵觸的反直覺發現 | （讀者自填） |
| Sun | Behavioral | alert-to-ticket agent 遇到上游 API 格式異常卡進無限重試，一晚建出 327 張重複工單，練用「先止血、再拆三層根因、最後做成上線檢查清單」把一次事故變成可複製的防護機制 | （讀者自填） |

這週七天主題全數依照固定排程產出，沒有缺口。今天的行為面試故事跟週四 LLM & Agent Engineering 的「agent loop 組件跟 stop conditions」其實是同一個問題的兩個切面：週四講的是設計時就該想清楚 forced stop 要怎麼判準，今天這題講的是「沒設計好 stop conditions 的 agent 真的上線後會出什麼事、你怎麼事後補救」，如果這兩天都練過，面試時能把「設計階段」跟「事故處理階段」串成一套完整的 agent 可靠性論述。

## 下週預告

下週主題輪替不變，一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序，但每天搜尋到的面試題與延伸閱讀會換新。這週七天全數產出沒有缺口，如果你想針對性加練某個主題，可以把 `src/data/interview-focus.json` 裡對應主題的權重調到 2-3，讓 routine 有機會在非固定日額外加練——例如今天的行為面試故事牽涉到 agent 的執行邊界跟上線前檢查清單，剛好跟週四 LLM & Agent Engineering 的內容互相呼應，如果這塊是弱項，調高 `llm-engineering` 權重會比單獨練更有效率。

## 參考資料

- [Behavioral Interview Questions for AI Engineers and FDEs, with STAR Answers — Cloudsoft Solutions](https://cloudsoftsol.com/blog/behavioral-interview-questions-ai-engineers) — 對應「本週行為面試練習」故事框架的主要出處：第 32 題「Tell me about a production incident you handled」的 agent 重試迴圈建出重複工單的模型 STAR 答案，以及「怎麼講這個故事」中 contain-first、blameless review、避免英雄敘事的作答原則
- [The State of AI Agent Incidents (2026) — Cycles](https://runcycles.io/blog/state-of-ai-agent-incidents-2026) — 對應故事情境的真實模式確認：Category B6「Jira ticket storm」記錄同一種失敗模式（agent 解析錯誤後建出大量重複工單），根因同樣是「沒有 per-run cap」，修法同樣是 idempotency 跟 handler quota
- [Agents Fail, Loop, Spend — Agent Brief](https://news.agentcommunity.org/issues/2026-10-06-agents-fail-loop) — 對應故事裡「無限迴圈、未設 token 上限」的財務風險框架：引用 SupraWall 的 cost-control 指南，把這類事故的財務風險定在每次 $100 至 $10,000 以上
- [The $50K Runaway Agent: What Cloud Cost Explosions Reveal About Agent Rate-Limiting and Budget Enforcement — DEV Community](https://dev.to/mech_app_ai/the-50k-runaway-agent-what-cloud-cost-explosions-reveal-about-agent-rate-limiting-and-budget-5cnn) — 對應「這不是單一事件」的產業規模佐證：引用 Google Mandiant 企業 AI 安全報告記錄的單一 runaway agent 燒出 5 萬美元雲端帳單事故
