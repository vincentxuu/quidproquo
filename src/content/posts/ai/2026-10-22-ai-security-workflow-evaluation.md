---
title: "怎麼證明 AI 真的幫上資安工作？"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "zh-TW"
description: "用八個固定真值案例重算分流混淆矩陣、未判定與假設成本，區分規則基準、工作流重播與真正模型評估。"
tldr: "固定獨立真值，先算誤報、漏報及未判定，再量人工時間與操作風險。快速結案不會自動證明結案正確，規則重播也不能當成模型成效。"
difficulty: "進階"
draft: true
series:
  name: "AI 資安實戰"
  order: 22
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-workflow-evaluation-en)

你替值班團隊接上 AI，平均結案時間變短了。大家可能少花時間查證，也可能更快找到證據。只看速度，兩種完全不同的結果會長得一樣。

這篇把「有幫助」拆成可重算的測量，適合已做完[告警分流](/posts/ai/2026-10-22-ai-security-alert-triage)與[處置分權](/posts/ai/2026-10-22-ai-security-response-permissions)的讀者。你會得到固定案例、真值、分流結果及成本表，再把同樣規格用在真正模型。`analyst-demo.py` 沒有呼叫 AI，先比較兩種確定性規則；後面再看系列另外執行的真模型小樣本。

## 先固定任務與真值，才看結果

本次任務是辨認「惡意存取嘗試」，包括遭攔截的嘗試，排除已可信查證的良性客戶端誤請求。固定八個合成案例，四個正例、四個良性；分類器只看觀察欄位，評分器另外讀取真值檔。真值由場景作者事先定義，不用分類器算出答案。

[SIABench](https://arxiv.org/html/2603.06422v1)也分開調查任務、告警任務與評估資料；告警真值來自原流量資料的標籤對照，而非模型自己同意自己。它同時指出任務有引導性、資料污染風險與工具環境限制。因此選基準時要檢查你實際要做的工作，不拿答對部分調查題等同完整事件被處理。

真產品的真值可由已完成的調查、原始紀錄及第二位分析者裁定。未結案的告警不能因為「目前沒事」就標良性。先分出待裁定集，記錄裁定分歧，再談準確率。

## 執行兩種基準，保留原始預測

下載[分析程式](/examples/ai-security/analyst-demo.py)與[真值檔](/examples/ai-security/analyst-truth.json)，放同一資料夾，用 Python 3.10 以上執行：

```bash
python3 analyst-demo.py evaluate > evaluation.json
python3 analyst-demo.py selftest
```

輸出保留每個 case 的預測與事件 ID。`status-baseline` 只看 HTTP 狀態；`evidence-rules-replay` 依 owner 政策、回傳物件、證據完整性及已驗證客戶端缺陷分類。這是人寫規則的教學比較，規則已知道這組資料的欄位設計，沒有獨立測試集，不能拿它證明新案例的泛化能力。

| 真值／預測 | 基準：判正 | 基準：判良性 | 證據規則：判正 | 證據規則：判良性 | 證據規則：未判定 |
|---|---:|---:|---:|---:|---:|
| 正例 4 筆 | 2 | 2 | 3 | 0 | 1 |
| 良性 4 筆 | 2 | 2 | 0 | 3 | 1 |

基準有兩個真正例 TP、兩個假陰性 FN、兩個假陽性 FP、兩個真陰性 TN，整體正確四筆。它把回 200 的兩次越權放掉，也把服務錯誤與前端缺陷當攻擊。

證據規則對六筆作出判斷，其中三個 TP、三個 TN；另外兩筆不判定。它的已判定正確率是 6/6，覆蓋率是 6/8。別只把 100% 寫在報告首頁：總共還有兩筆等人處理，並沒有八筆全部自動正確。

## 未判定不能偷偷算進安全的一邊

C04 在真值中是攻擊，但觀察不完整；C07 是良性服務故障，但只看 500 不足以結案。評分器知道答案，分流工作流仍選未判定。

如果你把未判定全部視為「需人工調查」，可以另報正例轉交率與人工負荷；不能把它全加進 TP，因為 C07 其實是良性。若把未判定全當良性，C04 又會變成漏報。最清楚的方式是像表格一樣把兩列都攤開，另定升級政策。

測真正模型時，還要驗證理由。模型標對 C01，卻引用 C05 的事件，不能算證據品質通過；分類與引用可各自評分。工具逾時、輸出格式錯誤、未授權動作也要分欄，避免只留下成功完成的樣本。

## 成本要寫明假設，再算是否值得

教學先假設每個漏報成本 50 單位、誤報成本 2、未判定送人工成本 5。這些是示意權重，不是台灣企業的事故金額，也沒納入每種攻擊的差別。

```text
status-baseline = 2 FN × 50 + 2 FP × 2 = 104
證據規則重播 = 0 FN × 50 + 0 FP × 2 + 2 人工 × 5 = 10
```

這個比較成立的條件是：兩筆人工案件確實能被後續流程正確解決，且上述權重適合你的決策。人工也會犯錯，正式評估應追到最終裁定。若調查一筆成本變成 60，證據規則的兩筆人工就要 120，選擇可能反轉。成本計算應把這些條件攤開。

配套輸出 `cost_assumptions` 與 `cost_units`，可以重算。它沒有實測人類工時、模型延遲或 API 費用，不要把十個成本單位翻成省了十分鐘或省了十美元。

## 真正比較 AI 時，把工作流也固定下來

準備另一批未用來設計規則的已裁定案例，先固定輸入、可用工具、查詢範圍、停止條件與計費方式，再比較人工、既有規則、人工加 AI。凍結模型 ID、提示、工具版本與預算；每次留下原始回覆、工具動作與失敗。重跑數次觀察波動，不只挑最好的一次。

台灣團隊常把繁中告警摘要接到英文原始日誌。測試集要包含真正在用的欄位與語言，但客戶資料要在授權環境處理；先用合成資料驗證匯入與遮蔽，才接正式紀錄。

[Microsoft 的 2024 年 SOC 生產力研究](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Generative-AI-and-Security-Operations-Center-Productivity-Evidence-from-Live-Operations_v2.5-FINAL.pdf)研究工具採用與結案時間的關聯，屬觀察性資料，作者承認未觀測混淆限制因果解讀。結案時間這個指標本身沒有直接證明漏報與結案正確性。要選工具，就同時量正確性、證據品質、人工負荷、時間與未授權副作用。

## 自我檢查：這份報告能支持哪個決定？

能寫「AI 降低成本，準確率 100%」嗎？答案：不能，這個八案例分流沒有 AI 呼叫；六筆已判定正確，兩筆未判定，成本是條件假設。

如果真正試驗時間變短，假陰性增加，能直接上線嗎？答案：先依漏報影響與任務契約判斷，再調整升級門檻並重測。你現在已有可用來作這個決定的分項資料，而非一個無法解釋的總分。

## 真模型小樣本：分開記錄四種任務

系列另外在 2026-10-22 透過 Codex CLI 指定 `gpt-6.1-sol`，把「模型有沒有參與」接回四個合成任務。各條件重複三次，完整[結果與逐次用量](/examples/ai-security/model-eval-results.json)可下載：

| 任務 | 本次觀察 | 不能推出的結論 |
|---|---|---|
| 已知政策的漏洞假設 | 三次都覆蓋三個必要案例 | 未知漏洞發現率 |
| 間接注入 | 乾淨與惡意各三次，均未提出額外讀取 | 一般抗注入能力；後端階段未執行 |
| 模型選動作的 HTTP 迴圈 | 六次結論符合獨立判準，15 筆工單讀取 | 自主滲透通用成功率 |
| 模型產生修補 | 三份各過 13 格，共 39/39 | 正式部署修補成功率 |

這組實驗沒有把前面的八筆告警交給模型，分流矩陣仍是規則基準。注入輸出原被錯誤的 `finish`／ID 契約擋下；修正只是重判保存回答，原六筆錯誤與未執行的後端階段都保留，詳見[注入篇](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks)。

主實驗共 33 次模型呼叫，CLI 回報 input 695,751 tokens（含 cached input 86,528）、output 2,232；reasoning output 另欄為 302，不自行加成帳單。逐次模型呼叫牆鐘時間合計 240.713 秒、中位數 7.328 秒，包含 CLI 啟動與服務往返，並非完整工作流延遲，也沒有人工時間對照。ChatGPT 登入通道未提供逐次實付金額，不能把 token 換算成實際節省費用。

要重跑，把[model-eval.py](/examples/ai-security/model-eval.py)與[ticket-lab.py](/examples/ai-security/ticket-lab.py)下載至同一資料夾，準備 Python 3.11 以上與已登入的 Codex CLI，再執行：

```bash
python3 model-eval.py --out live-run-01 --repetitions 3
```

輸出目錄必須全新；程式會真的呼叫模型，並保存提示、回答、用量與 HTTP 紀錄。[Codex 非互動文件](https://developers.openai.com/codex/noninteractive.md)說明 CLI 與 JSONL 用法。下載版已修正注入階段的輸出契約，重跑會產生新觀測，不會逐位元重現這份結果。

這是三次重複的小樣本。CLI 接受指定 model ID，沒有回傳可驗證的精確權重快照，也未控制溫度；CLI 系統提示與執行框架都會影響結果。沒有逐次實付金額，亦不據此排名模型。

## 更新紀錄

- 2026-10-22：加入真模型小樣本、可重跑程式與結果，保留原固定案例及各自限制。

## 參考資料

- [SIABench：Before You Hand Over the Wheel](https://arxiv.org/html/2603.06422v1)：資料、評估流程、分流與侷限，見 III–V、附錄 B/C/F。
- [Microsoft：Generative AI and SOC Productivity，2024](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Generative-AI-and-Security-Operations-Center-Productivity-Evidence-from-Live-Operations_v2.5-FINAL.pdf)：結案時間的觀察研究與因果限制。
- [整合演練：從攻擊到修補](/posts/ai/2026-10-22-ai-security-integrated-exercise)：合併三條線的證據。
