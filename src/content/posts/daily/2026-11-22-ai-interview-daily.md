---
title: "AI Engineer 面試日練 — 2026-11-22：Behavioral & Weekly Review"
date: 2026-11-22
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "星期日主題 Behavioral & Weekly Review：用一個「多個產品團隊同時塞需求給 AI 團隊」的真實情境練 STAR 敘事，再回顧本週七天練過的七個主題。"
tldr: "今天的核心故事是怎麼在不讓每個 stakeholder 需求都直接砸到工程師頭上的前提下，建立一個看得到優先序、講得出取捨的需求通道；面試官要聽的不是你多會說「不」，而是你有沒有一套讓大家看得見排序邏輯的機制。"
series:
  name: "AI Engineer 面試日練"
  order: 95
---

> :globe: [English version](/posts/daily/2026-11-22-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：在保護團隊產能的同時對齊多方 stakeholder 需求

**情境**：你是一個四人 AI 團隊的 lead engineer，團隊同時替三個產品線維護一套 RAG 檢索服務。某個 sprint 中，行銷、客服、產品三個團隊幾乎同時用 Slack 私訊直接跟你的工程師要功能——行銷要加一個摘要卡片、客服要調整检索的 recall、產品要一個新的 API 欄位。沒有人知道別人也在要東西，工程師手上原本排好的技術債修復全部被打斷。

**任務**：你被期待在不讓團隊陷入「誰先吼就先做」的狀態下，重新建立一個讓 stakeholder 看得到優先序、又不會讓工程師被動接需求的流程，同時這個 sprint 原訂的技術債修復還是要交出一部分成果。

**行動**：我做了三件事。第一，把所有需求收斂成一個單一的 intake 表單，要求每個請求寫清楚「這個需求的商業結果是什麼、受影響的使用者是誰、怎麼量化成功、期限是什麼」——沒填完整的需求先退回補件，不直接進工程師的待辦。第二，開一個雙週一次、固定時段的優先序會議，拉產品、客服、行銷三方的窗口一起看目前的佇列，講清楚「做了這個就會排擠哪一個」，讓取捨變成大家一起做的決定，不是我一個人擋掉。第三，對已經排進當週 sprint 的技術債修復，我公開佇列裡每一項的預期影響（例如「這個修完能讓檢索 p95 latency 降多少」），讓新需求插隊時，大家看得到插隊的真實代價，而不是默默被吃掉。

```diagram
title: 需求 intake 機制：從 stakeholder 請求到排進 sprint
desc: Stakeholder 需求統一先進 intake 表單，資訊不齊退回補件，齊了才進優先序佇列，經雙週會議取捨後才排進 sprint 待辦。
caption: 簡化示意：退回補件的需求會在補齊後重新送進表單。
---
<svg viewBox="0 0 640 508">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 108V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 232V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn" d="M376 188H428" marker-end="url(#arrow-warn)"/>
  <path class="dg-line" d="M280 316V346" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M280 410V440" marker-end="url(#arrow-accent)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <rect class="dg-box" x="184" y="60" width="192" height="48" rx="6"/>
  <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">需求先進 intake 表單</text>

  <path class="dg-box" d="M280 144L376 188L280 232L184 188Z"/>
  <text class="dg-label" x="280" y="178" text-anchor="middle" dominant-baseline="central">資訊填完整？</text>
  <text class="dg-sub" x="280" y="200" text-anchor="middle" dominant-baseline="central">商業結果與期限</text>

  <rect class="dg-box" x="184" y="264" width="192" height="48" rx="6"/>
  <text class="dg-label" x="280" y="288" text-anchor="middle" dominant-baseline="central">進入優先序佇列</text>

  <rect class="dg-box dg-box--warn" x="432" y="164" width="144" height="48" rx="6"/>
  <text class="dg-label" x="504" y="188" text-anchor="middle" dominant-baseline="central">退回補件</text>

  <rect class="dg-box" x="184" y="350" width="192" height="60" rx="6"/>
  <text class="dg-label" x="280" y="372" text-anchor="middle" dominant-baseline="central">雙週優先序會議</text>
  <text class="dg-sub" x="280" y="394" text-anchor="middle" dominant-baseline="central">跨團隊看佇列、公開取捨</text>

  <rect class="dg-box dg-box--accent" x="184" y="444" width="192" height="48" rx="6"/>
  <text class="dg-label" x="280" y="468" text-anchor="middle" dominant-baseline="central">排進 sprint 待辦</text>

  <text class="dg-edge" x="292" y="248" text-anchor="start" dominant-baseline="central">是</text>
  <text class="dg-edge dg-text--warn" x="402" y="176" text-anchor="middle" dominant-baseline="central">否</text>
</svg>
```

**結果**：兩週後，直接丢到工程師手上的臨時請求從每週平均 6-7 件降到 1 件以下，技術債佇列裡原本卡住三週的向量索引重建也在這個 sprint 排進去完成，檢索 p95 latency 降了 18%。更重要的是，三個 stakeholder 團隊後來反而主動在表單裡補更完整的商業理由，因為他們看到補得清楚的需求確實排得比較前面。

### 怎麼講這個故事

- **Dos**：先講清楚「沒有機制之前,大家怎麼痛」，再講你加了什麼結構性的東西（表單、固定會議、公開佇列），最後用具體數字收尾——面試官要驗證的是你解決的是系統性問題,不是單次救火。
- **Dos**：強調你讓 stakeholder 自己參與取捨,而不是你一個人扮演「擋需求的人」——這個角色定位能同時展現技術判斷力跟跨團隊溝通力。
- **Don'ts**：別把故事講成「我很忙所以我拒絕了他們」,面試官聽到的會是你缺乏 stakeholder management 能力,而不是你保護了團隊。
- **Don'ts**：別省略失敗或摩擦的部分——如果流程一開始推動時有人不配合,誠實講出來,比講一個毫無阻力的版本更可信。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | 資料洩漏（data leakage）拆成 target／preprocessing／temporal／group 四種來源，練的是怎麼把模糊警訊收斂成可驗證的排查步驟 | 待自填 |
| Tue | Deep Learning & NLP | RoPE（旋轉位置編碼）怎麼用旋轉角度讓 Q、K 內積只跟相對距離有關,為什麼取代 sinusoidal／learned 絕對位置編碼 | 待自填 |
| Wed | ML System Design | 模型上線後的監控訊號分層：服務健康、資料品質、母體位移、模型結果,練的是紅燈亮起時先分類再決定要不要重新訓練 | 待自填 |
| Thu | LLM & Agent Engineering | agent 跨 session 恢復工作時,durable context 跟 per-call context 怎麼分開,以及 tool 執行授權為什麼必須留在 application 層 | 待自填 |
| Fri | Coding | 手刻 BPE tokenizer 的 train／encode／decode,練的是 vocab size 跟序列長度的 trade-off,以及 encode 階段為什麼必須照訓練時的 merge 順序套用 | 待自填 |
| Sat | Paper Reading | HEAMS（arXiv:2611.20144）把 agent 記憶系統的評測拆成效能、效率、隱私、使用者主權、安全五個獨立維度,練的是重新設計上線門檻 | 待自填 |
| Sun | Behavioral & Weekly Review | 多方 stakeholder 需求衝突下,怎麼建立看得見優先序的 intake 機制,同時守住既定的技術債交付 | 待自填 |

## 下週預告

下週主題輪替維持不變（一到日依序是 ML Fundamentals、Deep Learning & NLP、ML System Design、LLM & Agent Engineering、Coding、Paper Reading、Behavioral & Weekly Review），`src/data/interview-focus.json` 目前七個主題權重都是 1,沒有特別加練的方向。如果這週練下來,某個主題的核對清單你老是漏同一個項目(例如系統設計題常漏監控、coding 題常漏邊界條件),可以把那個主題的權重調到 2-3,下週就會在固定日之外額外抽到它。

## 參考資料

- [Mastering Behavioral Interviewing: A Comprehensive Guide for 2026](https://eva.ulanzi.com/report/article/behavioral-interviewing-2pyw65n) — 2026 年行為面試現況,含 AI 如何改變初篩階段的 STAR 結構辨識
- [Interview advice – 10 ways to excel in your AWS in-person interview – Life at AWS](https://aws.amazon.com/careers/life-at-aws-recruiters-share-10-ways-to-excel-in-your-aws-in-person-interview) — AWS 招募人員對 STAR 敘事的具體建議：每個 Leadership Principle 用一個敘事,搭配數據跟具體細節
- [STAR method for IT interviews, with worked examples](https://kbytechnologies.com/careers/star-method-it-interviews) — STAR 架構的具體寫作範例,說明情境要精簡、重點放在行動與結果
