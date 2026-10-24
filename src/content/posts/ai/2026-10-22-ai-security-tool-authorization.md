---
title: "工具能呼叫，不代表這次動作有權執行"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, authorization]
lang: zh-TW
description: "以可執行工單匯出案例，檢查單次批准的身分、參數、時限與重播風險。"
tldr: "用一次工單匯出綁定使用者、資源、動作、目的地與批准，並測試參數替換、撤權、過期與重播。"
difficulty: 進階
draft: false
series:
  name: "AI 資安實戰"
  order: 12
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-tool-authorization-en)

工單助理已經有 `export_ticket` 工具。Alice 點過一次「允許」，模型接下來把目的地改掉，或把 N-1 換成 Bob 的 N-2。畫面看起來仍是同一個工具，執行的卻是另一件事。

這篇要把「允許使用工具」拆成**這個人、對這個資源、用這些參數，這一次能不能做**。先讀[身分與授權](/posts/ai/2026-10-22-ai-security-identity-and-authorization)與[注入的防護層](/posts/ai/2026-10-22-ai-security-injection-defenses)。讀完會得到一組可重跑的授權與批准案例。

## 一個工具名稱包了多少權限？

`export_ticket` 若接受任意 ID 與任意網址，其權限很寬；放進工具清單，不會讓每次呼叫都合理。[OWASP 的 MCP 指引](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)要求依實際效果檢查工具操作，不能單靠「唯讀」「寫入」標籤判斷。讀取資料也可能是敏感動作，匯出更涉及另一個接收者。

本例允許 Alice 將自己的 N-1 匯出到預先設定的報表收件端。Bob 的 N-2 和 Carol 的 S-1 不在她的權限內。接收端由伺服器設定成固定目的地，不交給模型挑選。

| 欄位 | 可信來源 | 攻擊者能否自己宣告 |
|---|---|---|
| 使用者與租戶 | 驗證過的認證上下文 | 不能靠工具欄位換人 |
| 工單 owner 與 tenant | 後端資料 | 不能由模型指定 |
| 工具與參數 | 模型提出，伺服器驗證 | 可以提案，不能自行授權 |
| 批准 | 伺服器保存的具體動作紀錄 | 附件說「已批准」不算 |

## 跑一次正常匯出，再改一個條件

下載[防護範例](/examples/ai-security/defense-demo.py)，以 Python 3.11 以上執行：

```bash
python3 defense-demo.py tool
```

預期結尾：

```text
PASS: 17 deterministic checks; mode=tool; no LLM or network exercised
```

`normal_export` 得到 `export_recorded`；同一批准再使用一次得到 `approval_replay`。修改目的地得到 `forbidden_destination`，同公司不同 owner 與跨公司工單都得到 `forbidden_resource`。程式只記合成動作結果，沒有對外寄送。另有格式錯誤案例，確認 null、陣列、數字等工具提案及非字串目的地直接被拒絕，不讓驗證器崩潰。

注意 `wrong_user`：Bob 對自己的 N-2 原本有資源權限，卻不能使用 Alice 的批准，結果為 `approval_mismatch`。`changed_approved_arguments` 則保留一個目前合法的 N-1 請求，搭配原本批准 N-2 的雜湊，仍被拒絕。這讓測試不只靠前面的資源檢查碰巧擋住錯誤。

## 把批准綁到完整動作

範例把完整工具參數轉成固定格式後計算雜湊，批准紀錄包含使用者、動作雜湊、到期時間與單次 ID。執行前重新檢查資源、目的地與批准，再消耗 ID。

```text
認證身分 → 驗證參數 → 檢查目前權限
→ 比對具體批准 → 檢查過期／重播 → 記錄副作用
```

雜湊在這裡只用來比對參數，沒有建立批准的真實性。Python 字典是伺服器資料的教學替身，不能把客戶端隨便送來的同款 JSON 當批准。正式系統可用受保護的伺服器紀錄，或經完整驗證的簽章憑據；批准畫面顯示的內容也必須由同一份規範化參數產生。

批准不該只綁工單 ID。匯出欄位、接收者、格式、數量與目的環境若影響結果，也應納入。若工具可分頁匯出一千筆，批准一筆不等於批准整批；若批准內容可變動的文件，還要考慮文件版本。

## 撤權與重試，會把單次批准變成多次嗎？

`revoked_after_approval` 表示 Alice 批准後已失去 N-1 存取權，執行時仍要拒絕。批准不是永久豁免政策；`expired` 也不會因模型說事情急迫而延長。

單行程的 `used` 集合能展示重播檢查，卻沒有處理多節點並發與交易。正式系統需要原子地保留批准、執行動作與保存結果，或使用能辨識重試的冪等設計。若先把批准標成已用、之後寄送失敗，要能查明並回復；若寄送成功卻未保存結果，也不能重試就重寄一封。

不要以「POST 成功」當唯一證據。記下操作 ID、批准 ID 與真正副作用的收據，才能區分尚未執行、執行失敗、完成與結果未知。日誌不應放批准憑證、完整 token 或敏感工單文字。

## 接到雲端與既有 API

把可信身分放在服務端 adapter，不讓模型傳 `user_id`。將固定目的地改成伺服器持有的收件端 ID，再由後端解析成網址；少讓模型控制一段 URL，就少一個需要解讀的空間。

遠端服務還需驗證權杖受眾與權限範圍。[MCP 的授權安全規範](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)要求只接受發給該 MCP server 的 token；但受眾正確仍不代表 Alice 可匯出 S-1。認證、委派範圍與物件政策要各自成立。

實際接線時，先用自己的測試收件端完成一次正常匯出，之後逐一改工單、接收端、使用者、時間與批准 ID。只測全部拒絕，可能只是工具壞了；正常與拒絕都符合規格，才證明邊界有用。

## 自我檢查

1. 使用者批准「匯出 N-1」，模型能改接收者嗎？
2. Bob 能讀 N-2，能拿 Alice 的批准匯出 N-2 嗎？
3. 單行程拒絕第二次呼叫，證明多節點沒有重複副作用嗎？

答案：第一題不能，目的地也屬於批准內容。第二題不能，批准綁人與動作。第三題不能，還需並發、故障與重試測試。先挑一個目前最寬的工具，把這三個反例補進測試，比再加一句系統提示更容易驗收。

接著讀： [MCP 的信任鏈：你到底信任了什麼](/posts/ai/2026-10-22-ai-security-mcp-trust)。

## 參考資料

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
