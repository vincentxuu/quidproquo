---
title: "AI Engineer 面試日練 — 2026-10-18：Behavioral & Weekly Review"
date: 2026-10-18
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "星期日輪到 Behavioral & Weekly Review：用一個『擋下沒評測完就要上線的 agent 功能』的 STAR 故事，練習 2026 年結構化面試最常見的評分重點，再回顧這週從 bias-variance 到 PROBE 論文走過的七個主題。"
tldr: "2026 年的行為面試越來越照標準化 rubric 評分：用第一人稱講「我做了什麼」而非「我們」、每段故事要收在量化 Result、且技術職的行為輪通常獨立計分（如 Google 的 Leadership and Rapport、Amazon 的 Leadership Principles）。今天練的故事是「頂住壓力，擋下一個只過了 demo 但沒做多輪評測就要上線的 agent 功能」，呼應本週六讀的 PROBE 論文：評測不足的 agent 上線後才出包，代價遠高於多花一週把評測補齊。本週回顧從 bias-variance 一路走到 agent 政策合規評測共七個主題。"
series:
  name: "AI Engineer 面試日練"
  order: 60
---

> 🌏 [English version](/posts/daily/2026-10-18-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：頂住上線壓力，擋下一個評測不足的 agent 功能

2026 年的結構化面試，行為輪通常是獨立計分的環節——Google 叫它「Leadership and Rapport」，考的是「在模糊情境下怎麼思考」「能不能挑戰現狀把系統變好」；Amazon 則直接對照 Leadership Principles 裡的 Ownership 跟 Have Backbone, Disagree and Commit。對 AI Engineer 來說，最常被問到、也最貼近日常工作的情境之一，就是「評測還沒做完，但業務方急著要上線」——這正好也是本週六讀的 PROBE 論文點出的核心問題:agent 能把 demo 跑得很順,不代表它在真實的多輪對話裡不會悄悄違反政策。

**情境**：團隊做的客服 agent 在內部 demo 跑得很順,PM 跟業務方都急著搶在月底前上線,但評測只跑過一組固定的黃金問題集,沒測過「使用者東拉西扯幾輪之後,agent 會不會忘記先確認就直接改單」這類多輪情境。

**任務**：我是負責這個 agent 評測的工程師,需要在不變成「唱反調拖進度的人」的前提下,說服 PM 跟業務方把上線往後推,先補上多輪政策合規測試。

**行動**：我沒有直接說「不能上線」,而是先花一天時間,用團隊現有的對話日誌手動模擬了 20 組容易被忽略的多輪情境(例如使用者先聊別的事,幾輪之後才提改票),量化出一個具體數字:固定題庫只測到 5% 的這類情境,但手動模擬就抓到 3 個會跳過確認步驟的真實案例。我把這個數字跟一句話一起帶進會議:「demo 過不代表生產環境過,我們現在的風險是看不見的,不是沒有。」然後提出一個折衷方案——不是整套評測重做,而是先用一週時間補上針對「確認動作」這個高風險政策的自動化多輪測試,其他部分照原計畫上線。

**結果**：業務方同意把「確認改票」這個功能的上線往後推一週。補測之後,在正式上線前又抓到 2 個新案例,修完之後才上線。上線後三個月,這個功能的客訴率是同期其他未經加強測試功能的三分之一。

### 怎麼講這個故事

- **Dos**：用第一人稱「我」講自己具體做了什麼(手動模擬、量化數字、提折衷方案),不要講成「我們團隊決定」;把 Result 量化到具體數字(3 個案例、一週、客訴率三分之一),2026 年的 rubric 式評分跟 AI 輔助的面試評分系統,對「有沒有量化結果」特別敏感。
- **Don'ts**：不要把故事講成「我据理力争,最後證明我是對的」這種對立敘事——面試官在聽的是你怎麼用數據跟折衷方案說服人,不是你多堅持己見;也不要省略「為什麼業務方一開始會抗拒」,略過阻力會讓故事顯得太順,缺乏「在模糊情境下怎麼思考」的訊號。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | bias-variance tradeoff 怎麼從 train/validation 差距判斷、L1/L2 regularization 的梯度差異、cross-validation 依資料型態選策略、AUC-ROC 高但 precision 低的診斷題 | {待自填} |
| Tue | Deep Learning & NLP | self-attention 的 Query/Key/Value 機制、causal mask 跟 padding mask 的用途差異、subword tokenization 解決 OOV、GPT 只用 decoder 做自回歸生成 | {待自填} |
| Wed | ML System Design | feature store 的 point-in-time correctness、serving 端延遲預算拆分、data drift 跟 concept drift 的偵測差異、三層監控架構 | {待自填} |
| Thu | LLM & Agent Engineering | 多 agent 拆分的成本判斷(單步成功率連乘)、工具邊界要少而精、MCP 管工具／資料、A2A 管 agent 間委派 | {待自填} |
| Fri | Coding | 手刻 k-means from scratch、向量化思維取代巢狀迴圈、數值穩定性(softmax 先減最大值)、邊界情況處理 | {待自填} |
| Sat | Paper Reading | PROBE 論文:政策合規是獨立於能力測試的評測維度、用小模型當稽核員、涵蓋率不等於命中次數、LLM-as-judge 可信度要先驗證 | {待自填} |
| Sun | Behavioral & Weekly Review | 用 STAR 練「頂住上線壓力,擋下評測不足的 agent 功能」,呼應本週 Paper Reading 的評測主題 | {待自填} |

## 下週預告

下週主題輪替不變(週一 ML Fundamentals 到週六 Paper Reading,週日再做一次行為與週回顧),但每天搜尋到的面試題與論文都會是當週最新的內容。目前 `interview-focus.json` 的七個主題權重都還是預設值 1——如果這週練下來覺得某個主題特別卡(例如 system design 的延遲預算拆分,或是 agent 架構的拆分判斷),可以把對應主題的權重調到 2 或 3,下週就會在固定排程之外額外加練。

## 參考資料

- [STAR Method Interview Examples 2026: Answers That Land — CVWon](https://cvwon.com/blog/star-method-interview-examples-2026) — 對應「怎麼講這個故事」裡「用第一人稱、Result 要量化」的 2026 年 rubric 評分依據。
- [Googleyness & Google Behavioral Interview Questions (2026) — PracHub](https://prachub.com/resources/googleyness-what-it-is-and-how-to-pass-the-google-behavioral-interview-2026) — 對應「頂住上線壓力」故事裡「在模糊情境下思考、挑戰現狀」這類評分面向,以及 STAR-L 結構。
- [Storytelling for Leadership-Track Engineering Candidates — Bugfree.ai](https://bugfree.ai/knowledge-hub/storytelling-for-leadership-track-engineering-candidates) — 對應故事框架裡「衝突解決、關鍵決策」兩類故事的結構建議。
- [PROBE: Learning to Audit Policy Compliance in Tool-Using LLM Agents — arXiv 2610.22124](https://arxiv.org/abs/2610.22124) — 本週六 Paper Reading 的核心論文,也是今天行為故事情境設計的靈感來源。
