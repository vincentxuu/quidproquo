---
title: "AI Engineer 面試日練 — 2026-09-13：本週回顧與行為面試"
date: 2026-09-13
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『客服 agent 上線前，擋住 model 直接執行退款的授權漏洞』的真實情境，並回顧本週從 ML Fundamentals 到 Paper Reading 六個主題練了什麼。"
tldr: "2026 年的 AI Engineer 行為面試已經很少單純問『你怎麼解決衝突』，更常直接問『GenAI 安全你怎麼落地』『你自信滿滿的方案後來發現是錯的』。今天用『客服 agent 要上線，你怎麼擋住 model 直接執行退款這個授權漏洞，並只延後三天而不是整個重做』這個情境，走一輪完整 STAR，並回顧本週 ML Fundamentals 到 Paper Reading 六個主題練了什麼。"
series:
  name: "AI Engineer 面試日練"
  order: 25
---

> 🌏 [English version](/en/posts/daily/2026-09-13-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：客服 agent 上線前，擋住「model 直接執行退款」的授權漏洞

2026 年的 AI Engineer 行為面試已經很少停在「你怎麼解決團隊衝突」這種通用問題，招聘指南裡越來越常直接問「GenAI safety 你怎麼落地」「你曾經很有信心的方案，後來發現是錯的」，或者「你有沒有跟同事在技術做法上意見不合過」。這些問題背後的評分重點是同一件事：你能不能在有時程壓力的情況下，把「這個風險真的存在」講成有證據支撐的判斷，而不是憑直覺喊卡。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：團隊要把一個電商客服 agent 從內測推到全站上線，讓它能查訂單、判斷退款資格、直接呼叫退款 API。PM 已經承諾在下週的大促活動前上線，用來分流客服人力。

**任務**：我負責這個 agent 的工具呼叫架構，在上線前一週的設計覆核裡，發現原始設計是讓 LLM 的 tool call 直接觸發退款動作，中間沒有任何獨立的授權檢查層。

**行動**：我先沒有直接說「這樣不安全」，而是花了半天寫一個小型紅隊測試，用一系列刻意誘導的客服對話去試探原始設計——結果在 20 組測試對話裡，有 6 組成功讓 model 核准超過權限上限的退款金額，其中 2 組甚至是透過偽造「主管已同意」這種話術就讓 model 直接放行。我把這 6 個具體案例（連對話記錄跟退款金額）整理成一頁投影片，帶去跟 PM 跟工程主管開會，而不是只說「我覺得風險太高」。接著我提出一個「model 只提案、決定性系統才授權」的架構：LLM 負責判斷退款理由跟建議金額，但實際扣款要先過一個規則引擎——檢查金額上限、訂單狀態、24 小時內是否已退過款——只有通過才真正呼叫退款 API，否則轉人工審核。PM 一開始不想延期，我沒有堅持整套重做，而是拿紅隊測試的 6 個案例當籌碼，提出把上線範圍先縮到「只查訂單、退款一律轉人工確認」，授權層留一週補完，promotion 當天仍能如期上線分流查詢量。

**結果**：授權層在延後的三天內完成並補測，正式上線後的兩週內，規則引擎攔下 41 次超過金額上限或重複退款的請求，實際造成的誤退款金額是 0；客服人力分流的效果不受影響，因為查訂單這個大宗需求本來就沒被延後。這件事之後，「model 提案、規則引擎授權」變成我們團隊所有會觸發實際動作（不只是回答問題）的 agent 的預設架構，也被寫進團隊的 agent 上線檢查清單。

如果我當時只是口頭提出擔憂而沒有紅隊測試的具體案例，這個時程壓力下大概會被「先上線、之後再補」說服過去——這也是我現在看任何會執行動作的 agent 設計時的原則：授權漏洞不能靠信任模型的判斷力去賭，要有一個模型完全不參與決策的最後一道關卡。

### 怎麼講這個故事

- **Do**：先講你怎麼用具體測試把「這個風險存在」變成可驗證的證據，而不是直接講你的架構方案多好——面試官在意的是你怎麼發現問題，不只是你怎麼解決問題。
- **Do**：用具體數字（20 組測試裡 6 組被繞過、41 次攔截、0 元誤退款）撐住每個轉折，尤其是「風險有多大」跟「修好之後有多有效」這兩個數字都要有。
- **Do**：清楚講出你怎麼談成「只延三天、縮小上線範圍」而不是「全部重做」——這段談判細節正是把你跟只會喊停的候選人區分開的地方。
- **Don't**：不要把 PM 講成不重視安全的反派——面試官想聽的是你怎麼用證據跟對方站在同一邊解決問題，不是你多會對抗管理層。
- **Don't**：不要漏掉「這件事之後變成團隊標準」這一段，這是把個案經驗轉成系統性影響力的關鍵，缺了就只是一次性的救火故事。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | 用學習曲線的 train/val gap 判斷該加特徵還是該正則化、CV 分數跟上線分數不一致時該懷疑 GroupKFold/TimeSeriesSplit 有沒有做對、類別不平衡的四層排查順序（先重加權而不是先 SMOTE）、分類門檻該由 FP/FN 成本算出來而非預設 0.5 | （讀者自填） |
| Tue | Deep Learning & NLP | decoder-only transformer 的四層結構（embedding + RoPE、causal self-attention、MLP、線性頭）、self-attention 的 Q/K/V 直覺與 causal mask、decoding 為什麼是 memory-bandwidth bound 而非 compute bound、token 數量怎麼換算成 API 成本跟延遲 | （讀者自填） |
| Wed | ML System Design | feature store 怎麼保證 offline/online 特徵定義一致、推薦系統 candidate generation → ranking → re-ranking 三段式 serving、A/B testing 與 shadow deployment 怎麼降低上線風險、data drift 監控如何接成能自我強化的 data flywheel | （讀者自填） |
| Thu | LLM & Agent Engineering | RAG 跟 agent 不是二選一而是分工、guardrails 分成離線評估與線上攔截兩層、「model 只提案、決定性系統才授權與執行」的核心原則、agent 評估要做軌跡評估而不只看最終答案 | （讀者自填） |
| Fri | Coding | dynamic batching for token decoding 的 slot 管理與三種停止條件、continuous batching 在 GPU 利用率跟延遲之間的取捨、NumPy broadcasting/boolean mask 取代顯式迴圈、batch inference 該用 queue depth 驅動自動擴縮 | （讀者自填） |
| Sat | Paper Reading | 精讀《BenchShield》,拆解 LLM agent 評測的 reward hacking 偵測、taint analysis 怎麼分靜態掃描跟 runtime 歸因兩層、「可利用捷徑不算違規」這種灰色地帶為什麼特別難防 | （讀者自填） |
| Sun | Behavioral | 客服 agent 上線前用紅隊測試證據擋住「model 直接執行退款」的授權漏洞，練用具體案例談成「縮小範圍、只延三天」而非整個重做 | （讀者自填） |

這週的行為面試練習直接呼應了週四 LLM & Agent Engineering 的核心原則——「model 只提案、決定性系統才授權與執行」不只是一個架構概念，也是這週故事裡說服 PM 的關鍵論點。如果你發現自己準備行為面試故事時，講不出一個「用紅隊測試或具體漏洞案例說服非技術 stakeholder 延期」的例子，這是值得補的缺口：2026 年的 AI Engineer 面試官已經把「GenAI safety 你怎麼落地」當成常態問題，而不是加分題。

## 下週預告

下週主題輪替不變，一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序，但每天搜尋到的面試題與延伸閱讀會換新。這週如果你在自我核對清單上，週三 ML System Design 跟週四 LLM & Agent Engineering 的授權/監控相關概念答得不夠順，下週可以把 `src/data/interview-focus.json` 裡對應主題的權重調到 2-3，讓 routine 在固定排程之外額外加練——這週的行為面試故事已經證明，「授權層設計」這類概念在系統設計面試和行為面試都用得到。

## 參考資料

- [45+ AI Engineer Interview Questions & Answers (2026 Guide)](https://www.tryexponent.com/blog/ai-engineer-interview-questions) — 對應「故事框架」開頭提到的 2026 年新增熱門問題「How do you approach GenAI safety in consumer products」與「Tell me about a time you were confident in a solution and later realized it was wrong」
- [Every AI Engineer Interview Question You Need to Know in 2026 (From 100+ Real Interviews)](https://adilshamim8.medium.com/every-ai-engineer-interview-question-you-need-to-know-in-2026-from-100-real-interviews-b5b7ae4b961a) — 對應「你有沒有跟同事在技術做法上意見不合過」這類衝突類問題的出題頻率
- [Google AI Engineer Interview Questions & Guide 2026](https://dataford.io/interview-guides/google/ai-engineer) — 對應「怎麼講這個故事」中用 STAR 結構、明確量化個人貢獻的評分重點（Googleyness & Leadership 環節）
- [Amazon Behavioral Interview Questions STAR Plan](https://jobwizard.ai/blog/amazon-behavioral-interview-questions-star-ownership-plan) — 對應「行動」段落中 Action 要包含決策取捨、影響利害關係人的具體做法
- [25 STAR Job Interview Questions With Examples](https://www.jobfinder-ai.com/blog/star-job-interview-questions) — 對應「Don't」中「不要把對方講成阻礙者角色」、承擔自己該負責的部分而不歸咎他人的原則
