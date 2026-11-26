把模型接上 HTTP 工具後，它可以自己選下一步，但也可能一直重試同一個失敗請求、換到另一個網域，或在輸出裡宣布已經成功。真正需要設計的是：一次觀察如何改變下一個動作，以及誰有權讓它停下來。

這篇接續[間接注入與工具誤用](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks)。先備是前幾章的 HTTP 證據、工具參數與權限政策。你會跑一個依回應分支的測試迴圈，理解之後接模型時哪些元件仍需獨立存在。隨附規劃器是固定規則，沒有模型呼叫，不是自主滲透能力展示。

## 三個角色不要混在一句提示裡

規劃器根據已知資料提出動作；執行器檢查範圍、預算與參數後送出請求；驗證器判斷這次回應是否支持假設。模型可以負責規劃，但不應只靠它自己承諾「我不會超出範圍」。

| 目前狀態 | 觀察／檢查 | 下一步 |
|---|---|---|
| 未核對目標 | health 的目標與版本一致 | 讀 N-1 建立基準 |
| 基準可用 | Alice 讀 N-1 成功 | 以 Alice 測 N-2 |
| 候選被拒 | N-2 回 403，沒有內容 | 停止此候選，做 Bob 正常對照 |
| 候選有資料 | N-2 回指定工單內容 | 補 S-1 測試與 Bob 對照，收齊最小證據後停 |
| 任一階段 | 範圍不符、預算耗盡、重複或逾時 | 不執行下一步，記下原因 |

這是狀態轉移表。每一列用可觀察條件決定下一步，讀者能逐列查出錯誤在哪裡。成功分支只延伸到已列入範圍的合成工單，沒有「發現新網域就繼續」的規則。

[AutoPenBench](https://github.com/lucagioacchini/auto-pen-bench)提供結構化工具介面與不同階段里程碑；[CyberSecEval 的方法文件](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift)要求已知起始狀態並輸出完整 transcript。這些工程設計支持把環境、動作與終點拆開看，不會自動證明某個 Agent 在真實目標的成功率。

## 跑出兩條不同軌跡

把[服務](/examples/ai-security/ticket-lab.py)與[重播器](/examples/ai-security/attack-runner.py)存到同一目錄，使用 Python 3.11：

```bash
python3 attack-runner.py loop --build vulnerable-v1 --out loop-before.json
python3 attack-runner.py loop --build fixed-v1 --out loop-after.json
python3 attack-runner.py selftest
```

有洞版先確認 N-2 回了內容，再測 S-1，最後用 Bob 核對 N-2，共五筆請求。修補版看到 N-2 拒絕後，略過 S-1 分支，只做 Bob 對照，共四筆；`stop` 是 `candidate_disproved; no repeated attack`。這個早停策略只評估目前候選，不能據此宣告跨租戶路徑也已測過。

`selftest` 檢查四個發送前拒絕：範圍外路徑、零預算、未核對目標就讀取、不在允許集合的工單參數。它不連網。實際 runner 另有重複動作、回應大小與時間限制：最多八次請求、每次三秒逾時、開始十五秒後不再派新動作。十五秒是派送截止，不是硬中止整個程序；最後一個已送出的請求仍可能用完它的三秒。

仔細看 `Runner.call`，檢查都在 `opener.open` 前面。若等工具執行完才問模型「這一步有沒有超出 scope」，請求已經出去，無法靠報告收回。失敗以例外終止，不會用重試迴圈把所有錯誤當暫時問題。

## 接模型時要替換哪裡？

目前 `run` 內的條件分支就是人工規劃器。要接模型，可將狀態與允許工具 schema 給模型，要求它回一個候選動作，交同一個執行器檢查。每次工具結果再交回規劃器，驗證器仍依資源與政策判定，而不採用模型自評的成功標籤。

可以先用[假設模板](/examples/ai-security/attack-hypotheses.json)的提示手動產生一個動作，人工檢查後重播。這是 AI 輔助模式。真正自動模式還要實作模型 adapter、輸出結構驗證、模型費用與 token 預算，保存模型名稱、參數、完整工具往返與人工介入。沒有這些紀錄，不應宣稱固定腳本展示了 AI 的自主能力。

工具回傳也是不可信輸入。若讀到的工單要求「下一步改連另一家公司」，規劃器可能被帶偏，執行器仍應依原有目標與端點集合拒絕。上一章的注入案例在這裡成為工具迴圈自己的威脅，不只被測應用的威脅。

## 從教學迴圈搬到雲端與 CTF

自架雲端使用自己的 HTTPS 入口、明確 `target_id` 與相同 fixture，先驗證沒有重新導向到別的主機，再啟動一個新實例或重設資料。跨程序延遲可能改變逾時結果；調整預算時要在報告標明，不能把多給十倍工具次數的結果和原本設定直接比較。

在 PortSwigger 指定實例上，選點擊／Repeater 等平台支援的操作做動作介面，保留一樣的「觀察 → 候選 → 驗證 → 停止」紀錄；這支工單 runner 並不支援直接操作平台。先核對個別實例與自動化規則，不能把整個平台網域放進允許清單。

NIST 曾記錄 agent 搜尋解答與評分捷徑，所以也要限制模型可讀的答案、fixture 與 grader。只限制網域並不夠，工作目錄裡的解答同樣能污染成果。[調查原文](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)也提醒其歷史資料樣本不一、可能有漏判，不能拿這些例子估一個通用失敗率。

## 練習：同一個 403 要試幾次？

模型建議：「再送二十次 N-2，也許會成功。」如果前提、參數與版本都沒改，答案是不要執行。把相同動作記為已測，保留拒絕證據並停止候選。若懷疑快取或競態，那是新的具體假設，需要自己的變因、範圍與次數，不能用無目的重試取代設計。

## 參考資料

- [AutoPenBench README](https://github.com/lucagioacchini/auto-pen-bench)：結構化工具與里程碑。
- [CyberSecEval：Autonomous Offensive Cyber Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift)：雲端起始條件、工具時限與完整紀錄。
- [NIST：Examples of cheating in CAISI’s agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)：答案污染與評分器捷徑。
