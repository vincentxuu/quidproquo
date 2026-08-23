---
title: "台股研究 Agent 實戰系列（篇 6）：讓 LLM 報告的每個數字都可稽核"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, llm, hallucination, evidence-manifest, opencc, eval]
lang: zh-TW
tldr: "LLM 寫報告時最容易幻覺的不是觀點而是數字，所以我把所有可信數字建成 SHA-256 定址的 evidence manifest，LLM 只能引用 {{fact.id}}，膽敢寫裸數字就整份丟棄回退規則模板。"
description: "stock-research-agent 如何用工程式 evidence snapshot + citation guard，讓研究報告裡的每個數字都能回溯到來源欄位，違規零容忍。"
draft: false
glossary:
  content-addressing: "用內容的 SHA-256 雜湊當作識別碼，內容一改 ID 就變，可用來驗證資料沒被偷換。"
  sha-256: "一種密碼學雜湊函數，可把任意資料壓成固定長度指紋，常用來驗證完整性。"
  opencc: "開放中文轉換工具，這裡用 s2twp 設定把簡體字與用詞轉成台灣正體。"
  fail-closed: "驗證不通過時預設拒絕，而不是預設放行。"
---

> **台股研究 Agent 實戰系列（篇 6 / 9）**：[上一篇：評估方法學：walk-forward、run card 與 50% 的誠實 baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval) ｜ [下一篇：Copilot loop：計畫合約、可驗證來源與人類審查](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

這篇講一個我以為很小、後來發現是整個系統可信度地基的東西：**研究報告裡的數字從哪來**。讀完你會知道為什麼我完全不讓 LLM 打阿拉伯數字進報告、什麼是「引用護欄會整份丟棄 LLM prose」，以及為什麼這個護欄只保證數字可稽核、不保證解讀正確。

## 問題：LLM 幻覺最嚴重的地方不是觀點，是數字

做研究 agent 的時候我最怕的不是 LLM 講錯方向——方向錯了我用人審抓。我怕的是它把「外資連三天買超」寫成「外資連三天買超 **12,458 張**」，或者把 f-score **7** 順手寫成 **8**。定性語言錯了讀者還會皺眉；數字錯了讀者會直接抄進筆記，然後我變成數字幻覺的共犯。

LLM 還有個毛病：把定性修飾包裝成虛假精確。「大幅上升」會被偷換成一個它編出來的百分比。這不是 prompt 工程能解的——你跟它說「不要編數字」，它還是會編，因為生成數字和生成形容詞對它來說是同一個機率動作。

所以我的結論很粗暴：**數字這件事，LLM 根本沒有資格寫**。它只能「引用」。

## Evidence manifest：先決定哪些東西配叫「可信事實」

解法分兩半。前半是在 synthesis 之前，由程式（不是 LLM）把 technical、sentiment、fundamental、chips、events、backtest、reflection、decision 和 price policy 這幾個來源的**可信結構化 scalar**收集起來，建成一份 canonical evidence manifest：

```
技術面 score          ──┐
法人籌碼數字            │
事件清單                ├──▶ canonical evidence manifest
回測 trades/win rate    │    （每個 fact: 穩定 ID + 來源欄位 + 顯示值 + 分類）
ATR 停損停利            ──┘            │
                                       ▼
                       manifest 與各來源各算一份 SHA-256
```

每個 fact 有穩定 ID、來源欄位、顯示值與分類；完整 manifest 和**各來源內容各自**都算 SHA-256。意思是事後任何人拿到這份 manifest，都能用雜湊驗證「這組數字」跟「那次的技術面快照」就是同一份東西，沒被修過。

反過來說，什麼**不進**可信 facts 也一樣重要：貼文 snippet、上游 error note、technical free-text detail、decision reason——這些是文字，文字是 LLM 可以亂引用的重災區。它們可以給模型當上下文，但沒有資格變成「被引用的數字」。界線劃在「結構化 scalar」這一層，之後所有東西都乾淨。

## Citation guard：`{{fact.id}}`，寫裸數字就整份丟

synthesis 給 LLM 的規則就一條：**你只能輸出 `{{fact.id}}` 這種 placeholder**，不能寫阿拉伯數字、不能寫中文數量詞（「三成」「很多」這種也算）、不能引用不存在的 ID。

聽起來像君子協定，但護欄是死的：output guard 會驗證整份 prose，**任何一處違規就丟棄整份 LLM prose，回退到 deterministic 的規則式 template**，而且違規原因會寫進 `ReportValidation`，跟著 artifact 和 API 一起吐回來。不是修一修繼續用；是這份 LLM 產出整份作廢。零容忍才有意義——你一旦開了「修一下就好」的門，護欄就變成機率而不是保證。

驗證通過之後，也不是 LLM 自己把值填進 placeholder。**數字展開由程式原子完成**：把 `{{fact.id}}` 換成 manifest 裡的顯示值，同時附 fact ID。LLM 從頭到尾沒碰過真正的數字位元組。最後成品上每個數字旁邊都背得出自己從哪個 fact 來。

README 把這條寫成一句話："Number citation stays out of the LLM"。這是整個專案我最滿意的一行。

## 界線要講清楚：這護欄**不**保證什麼

這段我在 repo 文件裡就直接寫明白了，這裡再強調一次：citation guard 保證的是「**被接受報告裡的數字從何而來**」可稽核；它**不保證**模型對定性語意、因果關係的解讀一定正確。

換句話說，如果外資籌碼那個 fact 顯示值是對的、引用 ID 是對的，護欄放行——但模型把「外資連買」解讀成「趨勢將反轉向上」是它的解讀，可能錯。數字誠實 ≠ 結論正確。這個界線對讀者很重要，也對我自己很重要：它不該被行銷成「報告不會錯」。

也因為解讀依然可能錯，後面才需要 review loop（篇 7）和 evaluation gate（篇 8）接著擋。

## 英文推理、繁中輸出，然後 OpenCC 強迫收尾

另一個小但影響品質的決定：synthesis **內部用英文推理**。理由很現實——在相同成本下，英文推理品質比較好。但輸出只能是繁體中文摘要加上必備的反方論點。

LLM 跑完之後，先過 citation 驗證，**再**做 OpenCC `s2twp` 後處理，把可能混進來的簡體字或對岸用語強制轉成台灣正體。簡體漂移這件事不是審美問題，是一致性問題——讀者看到「數據」兩個字就會開始懷疑整份報告的產地。

關鍵設計是：**ASCII 數字與 fact placeholder 的位元組在 OpenCC 之後完全不變**。OpenCC 只動中文字元，不會把已經驗證過的引用弄亂。所以管線順序是固定的——先守住數字，再做語言清理，順序反了會把護欄繞過去。

## 它只是八道門之一

citation gate 聽起來很硬，但它自己只是篇 8 會講的 evaluation gate **八道 hard gate 裡的第一道**（另外七道是 PIT、OOS、成本、樣本數、drawdown、可重播性、code policy）。這八道全部由 deterministic evaluator 判定、fail-closed：證據不足一律 False，LLM 或人工 reviewer 都不能把 fail 改成 pass，唯一合法路徑是改完重跑。

這呼應到整個系列的基調：這個 agent 不是「讓 LLM 自由發揮再祈禱」，是一層一層把可信邊界用程式碼鎖死，LLM 只負責剩下那點它真的擅長的事——組織語言。

## 整體來說

這套 citation guard 教我的事，比「怎麼防幻覺」更具體：**不要相信任何機率性系統能穩定遵守一條你用自然語言寫的規則**。你想讓 LLM 不寫裸數字，唯一可靠的做法是讓「寫裸數字」這個動作在結構上沒有意義——placeholder 一被程式接住，模型編的數字連進報告的管道都不存在。

代價也很真實：違規就整份丟棄，意味著最後報告常常不是 LLM 寫的，是規則式 template。這不是失敗，是設計──我寧可報告看起來平淡，也不要它看起來很聰明但裡面有個編出來的數字。讀者對數字的信任不能建立在模型的運氣上。

---

## 參考資料

- [vincentxuu/stock-research-agent — README](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md（Evidence snapshot 與數字引用護欄）](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [OpenCC 開放中文轉換](https://github.com/BYVoid/OpenCC)
