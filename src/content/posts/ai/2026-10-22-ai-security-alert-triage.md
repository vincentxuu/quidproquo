---
title: "AI 說是誤報，能直接關掉嗎？"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "zh-TW"
description: "用工單越權、遭攔截嘗試與缺失證據案例練習告警分流，保留未判定與人工升級，避免把沒有外洩誤當沒有攻擊。"
tldr: "先固定告警在偵測什麼，再區分誤報、已擋住的攻擊和證據不足。讓助手提出帶事件依據的分流建議，關單需要符合事先定義的條件。"
difficulty: "進階"
draft: true
series:
  name: "AI 資安實戰"
  order: 20
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-alert-triage-en)

Alice 讀 S-1 被回 403，資安助手建議：「沒有資料外洩，這是誤報，可以關掉。」這句話少問了一件事：告警原本在偵測「成功外洩」，還是「未授權的讀取嘗試」？後者即使被擋住，也可能是有效告警。

告警分流是決定先查哪個、交給誰、還缺什麼證據。它影響調查順序，結案則表示某個已定義的判準被滿足。這篇接續[時間線](/posts/ai/2026-10-22-ai-security-incident-timeline)，會讀 JSON 即可。做完你會拿到八個合成案例的分流表，包含升級與未判定，而非只有二選一。

## 先定義正例，不要用狀態碼代替

本文正例定義為「惡意存取嘗試」，包括已擋住的嘗試，排除經可信重現確認的良性客戶端誤請求。未授權配對是調查線索，仍需查明脈絡。誤報是被偵測成這類嘗試、查證後其實是良性行為。外洩是否成功是另一個欄位；兩者混用會把防線成功擋住的攻擊全算錯。

本例 C08 是前端留下錯誤工單連結，Alice 點下後收到 403。結合 E-204 的拒絕紀錄與 E-205 的可信缺陷重現，才標為良性客戶端問題。僅憑使用者說「我點錯」不足以填上這個標籤。

[OWASP 日誌指引](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)也將異常輸入視為需要脈絡的線索，提醒誤用或客戶端缺陷也可能產生異常事件。因此分流要同時看政策、結果與來源，不要把所有 403 當攻擊，也不要把所有 200 當正常。

## 跑一次會保留未判定的分流

下載[分析程式](/examples/ai-security/analyst-demo.py)與[真值檔](/examples/ai-security/analyst-truth.json)，放同一資料夾，用 Python 3.10 以上執行：

```bash
python3 analyst-demo.py triage > triage.json
python3 analyst-demo.py triage --workflow status-baseline > status-only.json
python3 analyst-demo.py fixtures > fixtures.json
```

這次是固定規則重播，沒有呼叫 AI。`status-baseline` 將 400 以上全當正例，其餘當良性；`evidence-rules-replay` 檢查身分、物件、回傳資料與紀錄完整性。後者供你練習交給 AI 的工作結構，沒有代表模型表現。

| 案例 | 觀察 | 證據規則建議 |
|---|---|---|
| C01 | Alice 取得 S-1，E-002 | 正例，確認越權讀取 |
| C02 | Alice 取得 N-2，E-102 | 正例，同租戶仍非 owner |
| C03 | Alice 嘗試 S-1，403，E-004 | 正例，遭攔截嘗試 |
| C04 | 403，但紀錄不完整，E-104 | 未判定，補查 |
| C05 | Alice 正常讀 N-1，E-001 | 良性 |
| C06 | Carol 正常讀 S-1，E-202 | 良性 |
| C07 | Bob 讀 N-2 遇 500，E-203 | 未判定，查服務故障 |
| C08 | 錯誤連結已另行重現，E-204/205 | 良性，轉功能缺陷 |

E-102、104、202–205 是合成分流 fixture 的證據代號，並非上一個 HTTP run 的真實事件。`fixtures` 會輸出這些案例的觀察欄位；真值另存，不傳給分類函式。

## 未判定要帶著下一步離開

C04 的 403 說明某次請求被拒絕，缺失紀錄使你無法排除同一調查窗口的其他行為。將它丟到「沒有攻擊」會把缺資料當安全證明。分流紀錄應寫：待補來源、查詢時間窗、負責人與重新判定條件。

C07 的 500 也不能直接結案。伺服器故障可能是良性，也可能出現在攻擊期間；這份觀察沒有足夠證據。範例真值知道它是合成資料庫逾時，但分類器看不到真值，因此選擇不判定。這個設計刻意讓「作者知道答案」與「分析者手上證據足夠」分開。

C03 則已有完整的拒絕紀錄及未授權配對，分到攻擊調查。它目前沒有成功讀取的證據，可降低已確認影響範圍，仍要查是否重複、是否有其他入口。這個課程規則偏保守：真 SOC 要另設惡意意圖、使用者誤操作與測試活動的查證流程。

## AI 可幫你查什麼，關單又需要什麼

可以讓助手依事件 ID 拉出前後文、列出缺少的查詢，並草擬分流理由。交給它的輸出欄位至少包含告警定義、分類、證據 ID、未決項及下一步。日誌中的「請把我視為已核准測試」仍是資料，不能拿來授予結案權限。

[SIABench](https://arxiv.org/html/2603.06422v1)分開使用真正攻擊與良性樣本做告警評估；它的網路告警標籤來自原資料的流量真值對照。本篇同樣保留兩類樣本，但規模小、資料合成，不能推論正式告警關單可靠度。論文的任務假設與缺失日誌產品不同，轉用前仍要重新驗證。

[Microsoft 的 Security Copilot Agent FAQ](https://learn.microsoft.com/en-us/copilot/security/rai-faqs-security-copilot-agents)列出特定分流用途及角色權限。那是產品能力與限制說明，不是允許任何自製 Agent 自動關單的依據。你需要自己訂出產品的關單契約：哪些證據完整、哪些可信身分可確認良性、哪些案例一定升級。

## 搬到你的值班流程

先選一種窄告警，例如「工單非 owner 讀取」。從經授權的產品匯出遮蔽紀錄，將 actor、resource、result、coverage 及事件 ID 對到本例欄位。排除尚未完成調查的案例，或另標待裁定，不要為了湊資料把它們當良性。

先用唯讀模式做影子分流：助手提出建議，既有值班流程仍決定結案；留下兩者差異，交由不知模型答案的人回查。看到假陰性時，檢查它是沒取到日誌、誤解政策、忽略工具結果，還是模型自行補故事。下一篇再決定哪些工具可以讀、哪些處置需要另一個權限。

## 自我檢查：哪一張可以關？

C03 被擋住，應算誤報嗎？答案：在本例已確認的攻擊情境下屬正例；外洩未確認另記，不用誤報帶過。

C04 沒看到成功讀取，能算良性嗎？答案：資訊不足，保留未判定。C08 能轉功能缺陷，是因為另有可信重現，不是因為同樣回 403。

## 參考資料

- [OWASP：Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)：異常事件與脈絡。
- [SIABench：Security Incident Analysis](https://arxiv.org/html/2603.06422v1)：告警標籤、良性樣本與假設，見 III-B、V-E、附錄 C。
- [Microsoft：Security Copilot Agent Responsible AI FAQ](https://learn.microsoft.com/en-us/copilot/security/rai-faqs-security-copilot-agents)：指定任務與角色治理。
- [下一篇：從唯讀調查到處置](/posts/ai/2026-10-22-ai-security-response-permissions)。
