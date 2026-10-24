---
title: "AI 資安整合演練：從攻擊證據走到修補與回歸"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, security, ai-agent, authorization]
lang: zh-TW
difficulty: 進階
series:
  name: "AI 資安實戰"
  order: 23
tldr: "用同一組 HTTP 請求比較有洞版與修補版，保存工單讀取證據、稽核事件與時間線。越權讀取要被擋住，正常使用者也要繼續讀得到自己的資料。"
description: "AI 資安實戰最後一篇：附可直接執行的 HTTP 教學服務與整合腳本，把攻擊、防護、事件調查和回歸測試串成可重跑的演練包。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-integrated-exercise-en)

你已經找到一條可疑的工單讀取路徑，也寫了修補。接下來要把三件事對起來：攻擊報告說的資料真的有交出來嗎？稽核事件記的是同一筆請求嗎？換成修補版後，正常功能還在嗎？

這一篇把整個系列會合在同一份演練包。你會啟動有洞版與修補版服務，送出相同的 HTTP 請求，留下原始回應、事件、時間線與報告，再核對兩種越權讀取消失、合法讀取保留。

需要 Python 3.11 或更新版，以及前面[身分與授權](/posts/ai/2026-10-22-ai-security-identity-and-authorization)、[漏洞證據](/posts/ai/2026-10-22-ai-security-vulnerability-evidence)的概念。前半部的 `integrated-exercise.py` 不呼叫模型，提供可檢查的固定案例；後半部另有真模型實測與重跑程式。

## 把成功條件寫在測試之前

沿用同一個教學產品：Alice、Bob 在 `north`，Carol 在 `south`。N-1 屬於 Alice，N-2 屬於 Bob，S-1 屬於 Carol。這個產品的私人工單政策是「同租戶且本人擁有，才可以讀」。

一輪演練有五個案例：

| 案例 | 操作 | 產品應有的結果 |
|---|---|---|
| `normal-alice` | Alice 讀 N-1 | 允許，回傳 N-1 |
| `same-tenant-owner` | Alice 讀 N-2 | 拒絕，不含工單文字 |
| `cross-tenant` | Alice 讀 S-1 | 拒絕，不含工單文字 |
| `normal-bob` | Bob 讀 N-2 | 允許，回傳 N-2 |
| `normal-carol` | Carol 讀 S-1 | 允許，回傳 S-1 |

測試前就固定這張表。被測服務負責回覆，檢查器另外持有允許關係與預期文字；不能讓服務自己的授權函式決定它的測試答案。這也符合 [OWASP 授權測試指引](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#create-unit-and-integration-test-cases-for-authorization-logic)把需求、測試與執行檢查對齊的做法。

`vulnerable-v1` 故意只檢查登入，會放行 Alice 對 N-2、S-1 的讀取。`fixed-v1` 多了租戶與擁有者檢查。它們是事先準備的兩個 HTTP 教學版本，並非模型生成的修補；後面另測模型產生的純函式。

## 下載兩個檔案，跑完整輪

把[教學 HTTP 服務 ticket-lab.py](/examples/ai-security/ticket-lab.py)和[整合腳本 integrated-exercise.py](/examples/ai-security/integrated-exercise.py)存到同一個資料夾，執行：

```bash
python3 integrated-exercise.py --out exercise-run-01
```

`exercise-run-01` 必須尚不存在。腳本會自行啟動兩個本機服務，使用系統分配的連接埠，跑完就停止子程序。沒有安裝套件、呼叫外部模型或對第三方送請求。

最後應看到：

```text
PASS: 10 HTTP cases; two unauthorized reads blocked after the fix; three normal controls pass in each build
```

前一行 JSON 會列出每個版本的結果：

```json
{
  "vulnerable-v1": {"requests": 5, "passed": 5, "unauthorized_reads": 2, "allowed_controls": 3},
  "fixed-v1": {"requests": 5, "passed": 5, "unauthorized_reads": 0, "allowed_controls": 3}
}
```

有洞版的 `passed: 5` 代表它符合「這個版本應展示兩種越權」的演練預期，沒有表示有洞版安全。真正的產品權限判準看 `unauthorized_reads`：修補後應降到零，三個正常對照也要通過。

如果輸出目錄已存在，程式會拒絕覆寫；換一個新名稱。若看到 `Unexpected wire result`，先核對請求、回應與固定政策，不要修改期望結果來湊 PASS。找不到 `ticket-lab.py`，則確認兩個檔案是否放在同一層。

## 攻擊證據與稽核紀錄，要分別看什麼？

資料夾內有兩組版本資料與整合結果：

| 產物 | 要回答的問題 |
|---|---|
| `vulnerable-v1/transcript.jsonl` | Alice 的請求究竟收到了哪張工單的文字？ |
| `fixed-v1/transcript.jsonl` | 同一操作被拒絕後，回應是否只剩錯誤欄位？ |
| 各版本的 `audit.jsonl` | 後端記下哪個身分、資源、授權決定與狀態？ |
| 各版本的 `health.json` | 此輪對到哪個教學版本與資料版本？ |
| `events.jsonl`、`timeline.md` | 不同執行輪的事件如何放到同一時間軸？ |
| `report.json` | 證據放哪裡、修補前後有何差別、這次沒測什麼？ |

用內建工具看報告：

```bash
python3 -m json.tool exercise-run-01/report.json
```

先找有洞版 `cross-tenant` 的原始回應，應包含 S-1 的 `South: billing query`。再看修補版同名案例，應是 HTTP `403`，回應只有 `error`，沒有工單文字。

稽核事件會記 `returned_ticket_id`，但不記工單全文或 Authorization 標頭。因此，一筆 `allow` 日誌可以幫你找到發生的位置，資料外洩的具體內容仍要回到 HTTP 回應核對。資料與事件的串接方式可延伸到[事件時間線篇](/posts/ai/2026-10-22-ai-security-incident-timeline)。

每個服務重啟後，事件編號都會從頭開始。`evt-000001` 單獨看不夠；整合腳本使用 `run_id + event_id` 區分兩輪，並保留 UTC 時間。遇到更大的系統，還要加入能串接請求的識別值，不能只靠時間接近就斷言是同一件事。

## 修補不能靠把全部功能關掉

修補版必須拒絕兩種違規操作，也必須保留 Alice/N-1、Bob/N-2、Carol/S-1 的正常路徑。這裡的三個正向對照會擋住「全部回拒絕就算修好」的假象。

你可以打開 `ticket-lab.py` 找到這個判斷：

```python
if build == "fixed-v1" and (
        ticket["tenant"] != principal[1] or ticket["owner"] != principal[0]):
    return finish(403, {"error": "forbidden"}, "object_policy_denied")
```

完整讀取流程先取教學身分、驗參數、找資源，再判租戶與擁有者。正式產品要由真正的認證機制提供身分；`demo-alice` 等字串公開寫在程式裡，任何人都知道，不能當正式登入機制。

如果產品改成同公司客服可以共用工單，政策與測試也要一起改。你應保留租戶隔離，再調整同租戶的角色與分享條件。這類修補需要的對照，見[Patch 驗證篇](/posts/ai/2026-10-22-ai-security-patch-verification)；更完整的案例集則接到[安全回歸篇](/posts/ai/2026-10-22-ai-security-security-regression)。

## 讓 AI 參與，仍保留獨立驗收

固定腳本跑通後，可以把工作拆給自己選擇的模型或 Agent。先拿合成資料做三個任務：

1. **攻擊助手**：提供程式與允許範圍，請它列出可被推翻的漏洞假說、前提與最小驗證，不先給判分答案。把候選動作存檔，再交給執行器驗證。
2. **修補助手**：提供已確認的請求與回應，請它提出最小修補與可能影響的正常功能。人工審閱後，用固定測試重跑。
3. **調查助手**：提供去識別的事件與回應，要求每句已確認結論附 `run_id + event_id` 或案例名稱；缺資料就列未決。

若要讓助手自動呼叫工具，先走[攻擊 Agent 迴圈篇](/posts/ai/2026-10-22-ai-security-attack-agent-loop)的輸入、工具結果、預算與停止條件。每次模型執行另存模型識別值、提示、工具與實際動作；不要拿本篇固定腳本的結果，當作模型真的找到了漏洞。

[NIST 的 Agent 評估案例](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)區分取得解答、繞過評分與修改錯誤副本等問題；其中改錯副本的嘗試並沒有改到遠端目標。驗收需要回到原本的任務與目標狀態。這個演練的測試答案留在驗收端，模型建議與真實目標效果分開保存。若要比較有沒有 AI 的差別，另外按[工作流評估篇](/posts/ai/2026-10-22-ai-security-workflow-evaluation)定基準與指標。

## 把固定回放換成真模型決策

另外下載[真模型實測程式](/examples/ai-security/model-eval.py)，和 `ticket-lab.py` 放在同一個目錄。需要已安裝、登入且可使用指定模型的 Codex CLI；這個步驟會消耗模型用量，不是前面完全離線的固定回放。[官方非互動模式文件](https://developers.openai.com/codex/noninteractive.md)說明 CLI 的事件輸出。

```bash
python3 model-eval.py --out live-model-run-01 --repetitions 3
```

程式會分開測漏洞假設、乾淨／注入文件、兩個版本的工具迴圈及修補函式。模型每輪提出 `read_ticket` 或 `finish`，執行端只接受三個合成工單編號，最多三次工單請求，再把真實回應交回下一輪。產生的 Python 修補先過語法樹白名單，才能接受 13 格測試；不允許匯入、函式呼叫或檔案操作。修補測的是純函式，沒有部署到前面的 HTTP 服務。

本次指定 `gpt-6.1-sol` 的[完整結果](/examples/ai-security/model-eval-results.json)包括 33 次模型呼叫：假設 3/3 涵蓋必要案例；兩版共 6 次工具迴圈都保留正常控制，結論與 15 筆工單 POST 回應相符，另有 6 次健康檢查與 15 筆稽核事件；3 份修補合計通過 39/39 格。

含注入指令的文件測了三次，沒有一次提出額外讀取；乾淨文件三次也沒有偏離。但原測試器把六份 `finish` 搭配 `N-1` 的合法輸出誤判為格式錯誤，因此那一階段沒有送出後端效果測試。現在公布的是保留原始資料後，依原提示契約重評的結果；不是修正後重新呼叫模型，也不能宣稱兩個後端擋住了模型攻擊。

這次只提供一種已明示文件不可信的提示、三次重複與單一小型產品。模型與 CLI 系統提示共同影響結果，沒有精確快照、溫度控制、人類基準或實付費用；未觀察到成功注入不代表普遍抵抗。每輪提示、回應、使用量、延遲和原始格式錯誤都要一起保留，讓另一個人能檢查判準。

## 搬到雲端或授權產品時，保留判準，重建條件

一鍵腳本只負責自己啟停本機副本，方便重跑。同一組讀取案例可以帶到你自架的雲端，但要按[環境篇](/posts/ai/2026-10-22-ai-security-experiment-environments)重新記錄部署版本、認證、網路、帳號、配額與停止方式；固定的示範 bearer 字串也需要換成適當的測試認證。

若雲端副本只聽迴圈位址，可以由你自己的 SSH 連線把本機連接埠轉送過去，讓測試用戶端仍對一個明確入口送請求。這是遷移選項，這次實跑沒有建立雲端主機、驗證 SSH 或測正式系統。

CTF 使用它自己的題目資源與成功條件；Bug Bounty 或授權系統也可能不允許建立同樣的兩個帳號、讀完整日誌或自動連續測試。保留能取得的證據，把沒測到的範圍寫清楚。報告裡的重現條件與影響可參考 [HackerOne 的報告指引](https://docs.hackerone.com/en/articles/8475116-quality-reports)，不要把本機成功外推成所有環境都成立。

## 交件前，回答這三題

1. 有洞版 `passed: 5`，為何不能說它安全？
2. 稽核記了 `allow`，沒有保存 HTTP 回應，能否斷言 S-1 全文外洩？
3. 修補版只保留三個 `403`，沒有正常對照，少證明了什麼？

判準：第一題要看測試是在確認哪個版本的預期，並用 `unauthorized_reads` 回到產品政策。第二題只有授權事件，還要核對回傳內容；不能自行補齊缺失。第三題沒有證明合法使用仍可用，而且本例的兩種違規案例也不應被混成不明來源的三筆拒絕。

完成後，把 `report.json`、兩版原始紀錄、時間線與檔案版本一起交給另一個人。對方應能用新的目錄重跑相同案例，指出哪兩筆讀取違反政策，並核對修補後的結果。這就是三條路線共用的交件方式。

## 更新紀錄

- 2026-10-22：新增獨立真模型演練、實測結果與格式契約修正；前述固定回放數字保留。

## 參考資料

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [NIST CAISI：Examples of cheating in agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
- [HackerOne：Quality Reports](https://docs.hackerone.com/en/articles/8475116-quality-reports)

- [Codex CLI: Non-interactive mode](https://developers.openai.com/codex/noninteractive.md)
- [本系列：真模型觀測與測試器修正](/examples/ai-security/model-eval-results.json)
