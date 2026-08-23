---
title: "台股研究 Agent 實戰系列（篇 7）：Copilot loop——計畫合約、可驗證來源與人類審查"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, human-in-the-loop, research-plan, eval]
lang: zh-TW
tldr: "研究請求先變成一份要人批准的 ResearchPlan，外部文件必須完整抓取並驗證逐字引用才能進報告，quant 的審查意見永遠 append-only、free-text 永不回流進 prompt——這是 M5 Copilot loop 的完整樣貌。"
description: "拆 stock-research-agent 的 M5 Copilot loop：為什麼計畫要先批准才准花錢、文件來源怎麼做到可驗證、審查迴圈為什麼是 append-only 且只用 sanitized aggregate。"
draft: false
glossary:
  fail-closed: "出錯或證據不足時預設拒絕而不是放行的設計原則。"
  content-addressed: "用內容的 SHA-256 雜湊當識別碼，內容一改 ID 就變，可防止偷換。"
  prompt injection: "把惡意指令藏在被餵給 LLM 的文字裡、讓模型聽它的而不是聽你的攻擊手法。"
---

> **台股研究 Agent 實戰系列（篇 7 / 9）**：[上一篇：讓 LLM 報告的每個數字都可稽核](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations) ｜ [下一篇：研究到模擬單的邊界：content-addressed 執行合約](/posts/tech/2026-08-23-stock-agent-8-execution-contracts) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

篇 1 到篇 6 講的是「一次研究怎麼不被幻覺污染」。篇 7 開始講另一個維度：這個系統不是給你一個問題就悶著頭跑到底的黑盒子，而是一個 **Copilot loop**——研究請求 → 計畫批准 → 可驗證來源 → 回測問責 → 人類審查回饋。M5 的核心是：花錢之前要先批准、證據進報告之前要先驗證、人的評語進系統之前要先消毒。

## 計畫合約：未核准的計畫一毛錢都不花

很多 agent 專案的「計畫」只是 prompt 裡的一段自言自語。這個專案的 `ResearchPlan` 是 schema-valid 的結構化合約：這次要跑哪些工具、為什麼、用哪段資料期間、預估多少 LLM 預算、每個環節失敗時的降級路徑。

兩個我覺得最重要的設計：

**1. Routing 是 deterministic 的。** 只有真的需要事件或新聞證據的問題才會排 documents 節點對外搜尋；一個純技術面的問題不會「順便」去叫輿情或基本面工具湊熱鬧。這避免了那種「反正都跑一遍比較保險」的浪費——多一個不需要的 tool call 就是多一份成本和多一個故障點。

**2. 邊界是 fail-closed 的。** 計畫裡包含外部搜尋或高成本模型？沒有 `--approve-plan` 就直接在邊界拒絕，理由寫進 error channel。不存在的工具、超出預算的計畫、未批准的計畫，三種死法一樣：拒絕，且留下記錄。「先跑了再說」在這個系統裡不存在。

實務上的用法：

```bash
STOCK_AGENT_NO_LLM=1 uv run stock-agent research 2330 \
  --objective "assess swing risk over the next 20 sessions" \
  --max-cost 0.5 --approve-plan
```

`--max-cost` 會變成計畫預算的上限，計畫超過就死，不是跑完才跟你說超支了。

## 可驗證文件來源：搜尋結果只是候選，不是證據

這一段是我私心最喜歡的設計，因為它直接打中了「LLM 引用來源」最常見的兩個謊言：

**謊言一：把搜尋 snippet 當證據。** 搜尋引擎回來的摘要只有幾十字，LLM 卻能講得好像讀過全文。這裡的規矩是：snippet 永遠只是候選。一份來源要進報告，必須被完整抓取、存成 content-addressed 的 `ResearchDocument`——內容的 SHA-256 就是它的身份，事後誰也換不掉。**而且失敗也記錄**：抓不到就抓不到，gap 留在報告裡可見，模型不被允許把缺口「補完」。一事無成也要誠實，這對研究產物比對人還重要。

**謊言二：把文件內容當可信輸入。** 從網路上抓回來的文字永遠被視為 untrusted。只有逐字驗證過的 quote span（能在來源原文裡對到位置的引文）才可以進 LLM 看得見的輸出；SSRF 和 prompt injection 的防線做在 adapter 層，不靠「prompt 裡提醒模型小心」。

## Append-only 審查迴圈：quant 說了算，但 quant 的話不進 prompt

跑完的研究可以送審：

```bash
uv run stock-agent review runs/2330-<timestamp>.json \
  --reviewer quant --verdict accept --score citation_correctness=1.0
uv run stock-agent reviews <run_id>
```

幾個刻意的設計：

- **verdict 只有 accept / revise / reject** 加上 reason codes 和分數——審查也是結構化的，不是一句「看起來不錯」。
- **原報告永不覆寫。** 修訂版透過 `parent_run_id` / `review_id` 串出 lineage，誰改了什麼、為什麼，全部可回放。Append-only 是這個專案從 decision log 到 review store 一貫的倔強。
- **最關鍵的一條：下一次對同一代號的研究，只讀 sanitized aggregate**——verdict 分布、常見 reject 原因這種統計量。quant 寫的 free-text 評語**永遠不會被提升進系統 prompt 或指令**。這條規矩擋的是兩種災難：一句隨手寫的評語污染之後每一次研究的行為，以及審查意見本身被當成注入管道。

## Eval harness：不讓 regression 躲在平均分後面

光有人審還不夠，agent 本身要有自己的考試。Golden cases 從單純的「方向有沒有猜對」擴充成五類：tool routing、citation validity、number groundedness、failure recovery、usefulness。

規矩很硬：**citation、權限、負期望值這三條不變式必須 100% 通過。** 不是「average 過了就好」——這三類有一條 regress 就是 regress，不能靠其他維度的高分把它平均掉。這跟篇 4 的回測問責、篇 6 的引用護欄是同一路哲學：有些錯誤是資格問題，資格問題沒有「瑕不掩瑜」。

## 整體來說

M5 把「人機協作」從一句口號落成三個合約：計畫要批准才花錢、來源要驗證才引用、評語要消毒才回流。它換掉的自由度是「agent 想到什麼做什麼」的流暢感，換回來的是每一步都可稽核、可回放、可拒絕。對研究這種「錯得振振有詞比不會更糟」的領域，我認為這個取捨是對的。

下一篇講 M7：當研究結論要跨過「模擬下單」這條線時，靠的不是更多 prompt，而是 content-addressed 的執行合約。

---

## 參考資料

- [stock-research-agent（GitHub）](https://github.com/vincentxuu/stock-research-agent)
- [Architecture：設計決策與信任邊界](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [PLAN.md：milestone 與 backlog](https://github.com/vincentxuu/stock-research-agent/blob/main/PLAN.md)
