---
title: "台股研究 Agent 實戰系列（篇 5）：評估方法學：walk-forward、run card 與 50% 的誠實 baseline"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, backtesting, walk-forward, eval, ai-agent]
lang: zh-TW
tldr: "我不量測『感覺很準』，我用 walk-forward 凍結參數跑 OOS、run card 記錄每次輸入的 hash、golden eval 留下 5/10 = 50% 的誠實 baseline，讓這個 agent 承認自己還不準。"
description: "介紹 stock-research-agent 的評估三支柱：rolling walk-forward 驗證、附 SHA-256 的 run card、10 case 只對 5 個的 golden eval baseline，以及實現報酬反思——為什麼承認不準比假裝準有價值。"
draft: false
glossary:
  - term: "walk-forward"
    definition: "滾動式的策略驗證法：只用過去的 train 窗選參數，凍結後在未來的 out-of-sample 窗測試，不斷向前推進。"
  - term: "point-in-time"
    definition: "指資料只使用某時間點以前可得的部分，不使用未來資料，避免回測作弊。"
  - term: "run card"
    definition: "每次評估跑完後留下的 JSON 紀錄，包含參數、每個 fold 的結果、資料雜湊與警告，用來辨識『這次用的是哪一份資料』。"
  - term: "golden eval"
    definition: "固定歷史切點組成的評估集，用一致性標準重新跑決策並算正確率，作為長期追蹤的 baseline。"
  - term: "run-card hash"
    definition: "以 SHA-256 對當次輸入資料表計算的指紋，只能辨識同一份資料，不能重建第三方資料源已變動的歷史版本。"
---

> **台股研究 Agent 實戰系列（篇 5 / 9）**：[上一篇：回測查核：為什麼回測會說謊](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability) ｜ [下一篇：讓 LLM 報告的每個數字都可稽核](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

這篇講這個專案怎麼「量測自己」：walk-forward 驗證、run card 紀錄、golden eval baseline，以及舊決策的實現報酬反思。讀完你會知道為什麼我把 5/10 = 50% 這種難看的數字寫在 README 第一頁，以及為什麼那是我覺得整個專案最贵的部分。

上一篇說了單次回測容易被倖存偏差、成本忽略、過度擬合騙走。但「不騙」不只是把成本算對——你還得回答一個更難的問題：**參數是怎麼選的？** 如果你在整段歷史上挑出一個看起來最好的 threshold 再回測它，那不叫驗證，那叫考古。

## Walk-forward：參數只能住在他看過的時間裡

我選的方法學是滾動 walk-forward。`stock-agent walk-forward` 的預設配置：

```text
|---- 252 交易 train ----|-- 63 日 test --|
         |---- train ----|-- test --|      step = 63 日
                ...
```

規則是：score threshold 只在 train 窗內選，候選值是 `[15, 20, 25, 30, 35]`，選的準則是 train 裡的**單筆淨期望值**（扣掉成本之後）。選完凍結，拿去跑 non-overlapping 的 out-of-sample test 窗。test 窗不重疊，每個 fold 往前 step 一個 test 窗長度。

還有一個很小但很要命的細節：**訊號必須在 fold 內完成完整持有期**。單次回測是 next-open 進場、第 20 個 future session 收盤出場，所以 test 窗尾端那種「訊號出現了但持有期跨出 fold」的交易一概不算，不會拿一筆被截斷、還不知道結果的交易充業績。Truncated tail trades are never counted short——這意思是你永遠只對「已經走完」的交易負責。

跑一次 2330 五年的資料，實測結果是 15 folds、8 筆 OOS 交易、win rate 50%、單筆期望值 -0.44%（淨值）。難看嗎？難看。但這就是凍結參數後的真實世界。而且因為 OOS 交易數小於 10，run card 會自動把這段統計標示為不具代表性——不是我自己嘴砲說小樣本，是程式強制說。

## Run card：留下指紋，但不假裝能時光回溯

每次 walk-forward run 都會在 `run_cards/` 產生一個獨立的 JSON（schema v1）：config、每個 fold 的 train/test 指標、OOS 交易日期、資料 SHA-256 hash，和警告。

那個 hash 的存在本身就是一種誠實。它只能回答「這次 run 用的是哪一份 DataFrame」——它**不能**重建 Yahoo 事後重拉的 adjusted history。股利調整、權還原、企業行動這些會改變歷史價格的事，Yahoo 會說改就改，改完了我手邊的 hash 就只能指認「我當時看到的東西」，不能指認「今天再抓一次的東西」。這不是 PIT（point-in-time）vintage snapshot，這是一個邊界，run card 把這個邊界明寫出來。你寫回測系統很難避開這個，避不開就該標記，而不是假裝 hash 等於可重播。

## Golden eval：50% 的 baseline

第三支柱是 `evals/` 下的 golden eval：10 個固定歷史切點，每個 case 鎖定 symbol、`as_of` 跟 20-session horizon，決策端只能看到 `as_of` 當日之前的資料；label 端才用次日開盤到 horizon close 的實現淨報酬，`up/flat/down` 用 ±2% band 分類。

目前這份 artifact 的結果是：10 個 case、5 個對、**accuracy 50%**，10/10 個 label 跟重新以 Yahoo 價格重算的淨報酬一致。白話文：label 本身乾淨，但我的決策只對一半。

這數字我寫在 README 上叫「honest pre-improvement baseline, not a post-tuning performance claim」。為什麼幹這種自爆的事？因為一個 agent 說自己「可以幫你研究股票」，卻拿不出任何固定切點上的正確率，那他不過是一台很會寫報告的機器。50% 的意思是：「我現在還不準，但我能在同一把尺上量得出來。」這比「我覺得有用」有價值得多。

## 實現報酬反思：只算已經長大的決策

每次研究寫進 `runs/` 的是 timestamped append-only JSON——同一天重跑七遍就七個檔，不覆寫。Reflection 節點在下次跑同代號時，只挑**滿 20 個未來交易日**的舊決策來算績效：next-open 進場、第 20 個 future session 收盤出場，個股跟 0050 用**完全相同的進出日期、相同的台灣成本**。輸出是個股淨報酬、0050 淨報酬、alpha，以及當初的 `buy_candidate/watch/avoid` 在 absolute 和 alpha 兩個意義下有沒有命中。

還沒成熟的決策不碰、benchmark 缺日期跳過、無效日誌跳過——跳過的東西都會留下 notes。反思出來的東西**只准用來校正當次信心**，prompt 或規則都不可以被它當成「我對現在的未來知道更多」。反思是回頭看，不是預測器。

## 整體來說

這三個東西其實是同一個哲學：評估必須是 point-in-time、out-of-sample、留下可稽核紀錄，而且**承認自己還不準要比假裝準有價值**。

到頭來我覺得學到最大的一課跟交易無關：當你為一個 LLM agent 設計評估，最難的不是寫 metric——是逼自己把「沒有代表性」寫進 artifact、把 -0.44% 留在 README、把 50% 當起點而不是當羞恥。一個會炫耀好成績的 agent 很多；一個會把不及格的考卷貼在牆上的 agent，才有資格談改進。

下一篇換一個角度：報告裡的數字怎麼保證每個都可稽核、不是 LLM 腦補出來的。

---

## 參考資料

- [vincentxuu/stock-research-agent GitHub repo](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — Walk-forward / Golden eval / 已實現報酬反思](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [evals/golden_cases.jsonl](https://github.com/vincentxuu/stock-research-agent/blob/main/evals/golden_cases.jsonl)
