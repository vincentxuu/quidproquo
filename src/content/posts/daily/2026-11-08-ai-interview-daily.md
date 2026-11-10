---
title: "AI Engineer 面試日練 — 2026-11-08：Behavioral（本週回顧）"
date: 2026-11-08
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：你沒有職位權力去指揮別的團隊優先做你要的事，怎麼讓 Infra／Backend 團隊主動把你的改動排進去，再回顧這週練過的四個主題。"
tldr: "AI Engineer 的行為面試常考「影響力不靠職位」：你要說服別的團隊幫你做事，但你不是他們的 manager。今天的故事框架是「推動跨團隊合作，讓 retrieval 改動真正上線」——核心是把你的需求翻譯成對方團隊在意的指標，並主動降低對方的執行成本，而不是單靠「多溝通」這種抽象說法。再回顧本週練過的 ML Fundamentals、Deep Learning & NLP、ML System Design、LLM & Agent Engineering，以及週五 Coding 這天意外中斷的紀錄。"
series:
  name: "AI Engineer 面試日練"
  order: 81
---

> 🌏 [English version](/posts/daily/2026-11-08-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：推動跨團隊合作，讓一個沒人負責的改動真正上線

**情境**：你是負責推薦系統 retrieval 層的 AI Engineer，做出一個能把排序準確率提升一截的改動。問題是這個改動要上線，必須讓 Infra 團隊調整 serving 的資源配置，也要讓 Backend 團隊在 feature store 多暴露一個欄位。這兩個團隊都不歸你管，各自有自己那個季度排滿的 roadmap，你的需求對他們來說就是「別人丟過來的額外工作」。這種「技術上行得通，但卡在別的團隊不想排」的情境，是面試官用來測試「影響力不靠職位」最愛用的設定——因為它逼你展示的不是技術能力，是你怎麼讓別人願意動。

**任務**：你被期待在不動用管理權力、也不越級施壓的前提下，讓這兩個團隊把你的需求排進他們近期的工作，同時不能燒掉你跟他們長期合作的信任。

**行動**：先講你怎麼把「我要什麼」翻譯成「對方在意什麼」——不是拿你的模型準確率數字去敲 Infra 的門，而是先搞清楚 Infra 團隊那個季度被盯的是什麼（例如 serving 成本或 P99 延遲），再把你的改動重新包裝成「這個改動能讓某條熱門路徑的推論運算量降低一截」，讓對方一看就知道這跟他們自己的 KPI 直接相關，不是你單方面在要資源。接著講你怎麼主動降低對方的執行成本：你沒有只丟一張需求單過去，而是先自己寫好那個 feature store 欄位的草稿 PR 跟 schema migration 計畫，讓 Backend 團隊要做的事從「幫我生一個新欄位」變成「review 一份已經寫好、風險評估也附上的改動」。最後講你怎麼找到共同的利害關係人——你發現負責這個產品線的 PM 同時也在追蹤轉換率指標，於是讓 PM 一起站出來替這個改動背書，把它從「AI Engineer 的個人請求」變成「產品線的共同目標」，這樣兩個團隊排優先序時,就不是在幫你一個人的忙。

**結果**：量化這個改動從「提案」到「上線」實際花了多久（例如「原本預估要排到下個季度，實際兩週內就上線」），以及上線後的業務指標變化（例如「轉換率提升 X%，Infra 成本反而因為 serving 優化下降 Y%」），並講清楚你為這類跨團隊合作留下了什麼可複用的機制（例如一份「跨團隊改動請求範本」，裡面固定要附對方團隊的指標影響跟一份降低對方工作量的草稿）。

### 怎麼講這個故事

- **Dos**：先講你怎麼「翻譯需求」而不是直接講你想要什麼——面試官在意的是你有沒有先搞清楚對方團隊的 KPI，這是能不能跨團隊推動事情的分水嶺。
- **Dos**：主動講你怎麼「降低對方的執行成本」（草稿 PR、風險評估、migration 計畫），而不是把「溝通」講成抽象的開會或信件往來。
- **Dos**：把「找共同利害關係人」講成具體操作（誰、為什麼他在意、怎麼讓他背書），不要只說「我拉了 PM 一起推」。
- **Don'ts**：不要把對方團隊講成「擋你的人」，面試官在聽你怎麼跟人合作，不是在聽你怎麼繞過別人。
- **Don'ts**：不要省略時間與數字——「後來就上線了」沒有說服力，「原本要排到下季度、兩週內上線」才有。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | bias-variance tradeoff 在「規模變大」條件下的變化、L1/L2 正則化的幾何差異、bagging 降 variance／boosting 降 bias，取自 Apple MLE 真實面試題 | {待自填} |
| Tue | Deep Learning & NLP | scaled dot-product self-attention 完整推導、為什麼除以 √d_k、多頭注意力、BERT（MLM）vs GPT（next-token）預訓練目標差異，取自 Amazon 技術篩選輪真實題 | {待自填} |
| Wed | ML System Design | 留言可能性預測系統：serving-path 延遲預算拆段、批次打分、canary／shadow deployment、drift 三分類監控，取自 Reddit MLE onsite 真實題 | {待自填} |
| Thu | LLM & Agent Engineering | 可靠工具呼叫 agent 設計：格式驗證、迭代與 token 上限、read／write 分級、state 持久化，取自 OpenAI 公開面試準備資源整理的代表性考題 | {待自填} |
| Fri | Coding | {本週五未產出，系列中斷一天，無紀錄} | {待自填} |
| Sat | Paper Reading | 精讀 ARCBench（arXiv:2611.03223）：context compaction 後規則違規率從 9.6% 衝到 37.8%，但 70.1% 被壓縮對話其實仍保留規則文字——留著規則不代表會被遵守 | {待自填} |

## 下週預告

下週輪替主題不變（Mon ML Fundamentals → Tue Deep Learning & NLP → Wed ML System Design → Thu LLM & Agent Engineering → Fri Coding → Sat Paper Reading → Sun Behavioral），但每天搜尋到的題目和資源都會換新。本週五的 Coding 練習意外中斷，如果你也覺得手刻題（batch inference、tokenizer、numpy 向量化這類）是弱項，可以趁下週五補回來，或把 `src/data/interview-focus.json` 裡 `coding` 的權重調到 2-3，讓 routine 在固定日之外額外加練。目前其他主題權重都還是 1，沒有特別加練哪個。

## 參考資料

- [The STAR Method: how to answer behavioural questions without rambling](https://dev.to/gowthampotureddi/the-star-method-how-to-answer-behavioural-questions-without-rambling-3cpp) — 對應「怎麼講這個故事」中「不要只說抽象的溝通，要講具體機制」與「小故事庫、一個故事對應多個主題」的建議
- [Engineering Manager Interview Questions: leadership stories under the microscope](https://dev.to/gowthampotureddi/engineering-manager-interview-questions-leadership-stories-under-the-microscope-h7h) — 對應「影響力不靠職位」這個主題在 2026 年面試loop 中被追問細節（follow-up）的方式
- [Amazon Interview Questions & Answers (2026 Guide)](https://www.dayone.careers/blog/amazon-interview-questions/) — 今日故事框架的「找共同利害關係人」改編自文中 Cross-Functional Collaboration 的真實 STAR 範例，這類 AI Engineer behavioral 面試題常以此為原型
