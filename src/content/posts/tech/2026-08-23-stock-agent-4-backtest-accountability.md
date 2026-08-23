---
title: "台股研究 Agent 實戰系列（篇 4）：回測查核——為什麼回測會說謊"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, backtest, point-in-time, quant]
lang: zh-TW
tldr: "這個專案的核心規矩：任何 LLM 結論必須先通過同一組訊號的歷史回測，期望值為負時 synthesis 禁止樂觀；四個讓回測說謊的坑各有程式化對策。"
description: "為什麼回測看起來很美、上線卻賠錢？這個台股研究 Agent 用 causal 因子、次日開盤進場、台灣成本模型、不重疊持倉與小樣本警告四道防線，把回測查核做成結構而不是口號。"
draft: false
glossary:
  - term: "point-in-time"
    definition: "評估歷史時只使用當時已知的資料，不用到未來資訊的紀律"
  - term: "look-ahead bias"
    definition: "回測用了訊號發生時還不可能知道的資料，導致績效被灌水的偏差"
  - term: "期望值 (expectancy)"
    definition: "平均每筆交易扣除成本後的淨報酬，是策略能不能活的核心指標"
  - term: "ATR"
    definition: "Average True Range，衡量近期波動幅度的技術指標，用來定義停損距離"
---

> **台股研究 Agent 實戰系列（篇 4 / 9）**：[上一篇：LLM 分層與降級鏈](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback) ｜ [下一篇：評估方法學：walk-forward、run card 與 50% 的誠實 baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

「回測看起來很美，上線實盤卻一直賠錢」——這是量化圈最老的梗，老到變成面試考題。這篇講我怎麼在 stock-research-agent 裡回答它：不靠紀律口號，而是把「回測必須發生在 LLM 寫結論之前」做成 graph 的結構，讓 synthesis 只能解釋已經存在的回測證據，而不是先寫結論再找理由撐它。讀完你會知道這個系統怎麼擋四種最常見的回測謊言，以及它現在仍然誠實承認做不到什麼。

核心理念寫在 README "Why this project?" 裡，也是整個專案的定場詩：**歷史沒有驗證過的結論是意見，不是研究**（A conclusion that history has not validated is an opinion, not research）。

## 四個讓回測說謊的坑，以及對策

我把話說在前面：這些陷阱我自己全部踩過。README 裡有一張 "Why backtests lie" 表，四個坑各自對應一個實作上的處理，這裡逐個展開。

### 1. Look-ahead bias：你不能用明天的報紙做今天的決策

最常見、也最隱蔽。因子如果在「訊號日當天就收盤進場」，就假設了你在收盤前已經知道收盤價和全天資料算出來的因子值——訊號是收盤後才成立的，當時你根本進不了場。看起來只是差半天，累積起來足以把一個賠錢策略回測成印鈔機。

這個專案的處理：**所有因子都是 causal series**，只用到訊號日（含）以前的資料；收盤訊號一律在**下一交易日開盤**進場，entry session 計為持有第一天，第 20 個 session 收盤出場。這個規矩不只寫在回測引擎裡，後面的 golden eval、walk-forward、reflection 全部用同一套進出場規則，避免「每個模組各說各話」造成的不一致。

### 2. 忽略交易成本：紙上獲利，實盤虧光

不計手續費和稅，很多高週轉策略在紙上是賺的，實盤一扣成本直接翻負。台股的成本結構還有自己的個性，不能直接搬美股模型。

專案內建台灣成本模型：股票**買賣各 1.425‰ 手續費，賣出另收 3‰ 證券交易稅**；台指期貨則是**雙邊 0.002% 交易稅**、無證交稅、帶合約乘數（TXF=200、MXF=50）。期貨是獨立的資料源（FinMind TaiwanFuturesDaily 近月合約），股票回測路徑完全沒動——成本模型是分開的，不會因為加了期貨就污染股票回測。

### 3. 重疊持倉重複計算：同一段漲幅被算兩次

持倉 20 天的期間內如果又出現新訊號，很多天真的回測會再開一筆，於是同一段大漲被多筆交易重複計入，交易筆數和勝率一起灌水。

處理方式很簡單但必須是強制的：**持倉不重疊**，持有期間的新訊號直接忽略。walk-forward 更嚴一格：訊號如果沒辦法在 test window 內走完完整持有期，整筆不納入——被截斷的尾巴交易不算數，不讓半截交易美化末端績效。

### 4. 小樣本過度自信：5 筆交易的「80% 勝率」什麼都不是

統計上 10 筆以下的結果幾乎沒有顯著性，但報告上寫個百分比看起來就很像一回事。專案的處理：回測**少於 10 筆交易就產生明確警告，並且壓低 decision 的 confidence 上限**。這不是寫在文件裡的良心建議，是 deterministic 的 `build_decision` 規則——樣本不夠，信心就是會被 cap，不管你訊號多漂亮。

## 查核的整合點：期望值是負的，LLM 就不能說好話

四道防線攔的是回測引擎本身；下一層是「回測結果怎麼約束 LLM 的嘴」。這是整個專案我最得意的一刀：

**Synthesis 節點在期望為負時被禁止給出樂觀結論**（forbidden from optimistic verdicts when expectancy is negative）。再加上回測必須排在 synthesis 之前——LangGraph 的 graph topology 讓這個順序成為結構而非 prompt 裡的約定：technical → backtest → reflection 這條鏈走完，六個分析分支 fan-in 完成，synthesis 才拿到材料。LLM 進場時桌面已經只有結構化證據，它只能解讀、調整語氣，不能發明理由替沒有歷史背書的訊號站台。再加上小樣本 confidence cap，「訊號很強但樣本只有 6 筆」這種情況，系統給出的 verdict 天然會保守。

## ATR 價格政策：讓 LLM 碰不到數字

光有方向（buy/watch/avoid）還不夠，研究報告通常想要停損和目標價。這個專案的答案是 `atr_2r_v1` 價格政策，規矩全是 deterministic Python：

- **只有 `buy_candidate` 才產生價位**：進場規則是次一交易日開盤，停損距離 2 個 ATR，目標距離 2R。
- **ATR(14) 只用訊號日當天以前（含）的 OHLC 計算**——又一次 PIT 紀律，不偷看之後的波動。
- 政策 ID、訊號日、參考價、ATR 值、風報比全部寫進 `Decision.price_plan`，跟決策一起落盤。
- `watch` 和 `avoid` 不產生任何可執行價位。

效果是：**LLM 只能解讀這些價格，不能編造它們**。政策公式和 ID 一起落盤，未來重放歷史時可以用一模一樣的規則重算。這跟篇 6 會講的數字引用護欄是同一種思路：把「數字從哪裡來」從 prompt 搬到 schema。

## 實測數據（附帶免責）

README 的 measured baseline 給了一組單次研究的數字：2330、兩年資料，同一批因子訊號回測出 **12 筆交易、67% 勝率、3.14% expectancy（淨額）、最大回撤 -8.4%**；當天新產生的 3 個訊號裡只有 1 個成立，所以 verdict 是 `watch`，confidence 0.47——不是因為模型保守，是因為訊號強度、勝率、期望值沒有全部過線。

這些數字要連著免責條款一起讀：價格資料來自 Yahoo、是事後重抓的，**不是 PIT vintage snapshot**；12 筆是小樣本，不代表這個策略未來可行；單一股票單一時段的結果不代表任何 production 績效。這個專案的誠實度體現在：它連自己跑出來的正期望值都不敢打包票，walk-forward 的 baseline 是 -0.44% expectancy、8 筆 OOS 交易——下一篇會講那個更誠實（也更難看）的數字。

## 已知限制：這個回測仍然不是真的市場

誠實清單必須寫完，這些是目前回測明確沒建模的東西：

- **滑價、bid-ask spread、漲跌停無法成交、容量**——成本是固定費率。
- **股利現金流**與個別券商折扣不在模型裡。
- **最大回撤按已平倉交易的 equity 計算，不是逐日 mark-to-market**——持倉期間的浮盈浮虧看不到。
- ATR 政策還沒有逐日 high/low 觸價回測，也沒有下單、部位大小或 risk budget。

Yahoo 的 adjusted history 日後重抓可能改變，run card 的 hash 只能辨識「這份 DataFrame」，不能重建已經消失的 vendor 資料版本。

## 整體來說

我學到的唯一一件事是：**回測會說謊，不是因為回測壞，是因為我們讓它太容易說漂亮話**。對策不是更聰明的模型，而是更倔的結構：因子 causal、次日開盤、真實成本、不重疊、小樣本封口、回測先於敘事、價格不讓 LLM 碰。把這些釘進 graph 和 schema 之後，agent 產出的每一份結論才有資格被審計。至於怎麼用 walk-forward 和 golden eval 更嚴格地檢驗它——篇 5。

---

## 參考資料

- [stock-research-agent (GitHub repo)](https://github.com/vincentxuu/stock-research-agent) — 「Why backtests lie」對策表、Measured baselines 與 Capabilities at a glance
- [docs/architecture.md — 單次研究回測與已知限制](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md) — causal 因子、次日開盤、atr_2r_v1 價格政策、回測未建模項目
- [PLAN.md — M2 backtest accountability 里程碑](https://github.com/vincentxuu/stock-research-agent/blob/main/PLAN.md)
