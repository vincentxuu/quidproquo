---
title: "如何知道防線有效：紅隊、回歸與運作監控"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, security-testing]
lang: zh-TW
description: "執行兩版本工單服務的獨立權限矩陣，核對真 HTTP 回應、稽核與評分器分歧。"
tldr: "用獨立權限矩陣重播修補前後的真 HTTP，核對回應與稽核，再將模型評估、執行邊界與正式監控分開報告。"
difficulty: 進階
draft: true
series:
  name: "AI 資安實戰"
  order: 16
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-security-regression-en)

團隊替助理加上防護後，模型開始說「我不能提供別人的工單」。這是好現象，但如果後端仍回傳 S-1，或工具已把資料送出，拒答文字不能結案。

這篇把[前面六篇的防線](/posts/ai/2026-10-22-ai-security-injection-defenses)變成驗收方式。你會執行修補前後的真 HTTP 對照，再回答：**正常任務還能完成嗎，禁止的資料與副作用真的被擋住嗎，紀錄能否對上？** 先理解[漏洞證據](/posts/ai/2026-10-22-ai-security-vulnerability-evidence)，需要 Python 3.11 以上。

## 三種工作，別用一個分數取代

紅隊用不同路徑找出原本沒想到的失敗；回歸把已知失敗變成固定案例；監控則看部署後實際發生的請求與結果。三者互補。模型拒答比例、越權讀取比例、正常任務完成率也應分開，否則「全部拒絕」會得到漂亮的假安全。

[OWASP 授權回歸測試指引](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html)以 actor、resource、action 建立可機器讀取的矩陣，涵蓋同權限不同使用者、不同角色與不同租戶。這裡先用三個使用者對三張工單，做出最小的九格規格。

| 呼叫者 | N-1 | N-2 | S-1 |
|---|---|---|---|
| Alice | 允許 | 拒絕 | 拒絕 |
| Bob | 拒絕 | 允許 | 拒絕 |
| Carol | 拒絕 | 拒絕 | 允許 |

這張矩陣來自 owner-only 產品政策。測試不引用服務端的 `allowed()`，否則把同一個錯誤複製到 oracle，程式和測試可能一起答錯。

## 重播修補前後的 HTTP

下載[工單 HTTP 服務](/examples/ai-security/ticket-lab.py)與[防護 HTTP 回歸執行器](/examples/ai-security/defense-http-regression.py)，放在同一目錄：

```bash
python3 defense-http-regression.py
```

執行器自行啟動兩個 loopback 子服務，依序測 `vulnerable-v1` 與 `fixed-v1`，最後停止服務。它不接受外部目標網址，不會對第三方發送測試。`demo-alice` 等公開字串只對應教學身分，沒有正式認證能力。

預期結尾：

```text
PASS: 18 HTTP requests; vulnerable=3/9 policy passes; fixed=9/9; 18 audit events correlated
```

修補前只有三個合法讀取符合政策，其餘六格都因不該回資料卻回 `200` 而失敗。修補後九格都符合：本人讀取仍 `200`，其他六格 `403` 且回覆只有 `error: forbidden`。執行器既看真 HTTP status，也看內容形狀；不是把服務自稱的「已拒絕」當成功。

每筆請求另與服務稽核事件核對 status 和 build。這能發現回應與紀錄對不起來的情況，但服務自己提供的日誌仍不是完全獨立的外部見證。真實匯出要再對收件端或資料狀態，不能只看工具自己的 log。

## 再跑函式防線，知道每個 PASS 在說什麼

下載[防護案例](/examples/ai-security/defense-demo.py)，執行：

```bash
python3 defense-demo.py regression
```

預期為 `PASS: 58 deterministic checks; mode=regression; no LLM or network exercised`。範圍包括注入後工具提案、檢索 ACL、撤權與快取、批准重播、MCP 定義變更、輸出處理及限用途能力。這些函式案例補充 HTTP 的資料授權，不代表 sharedlab 實作了完整 RAG、MCP 或匯出服務。

最後的 `defense-judge-disagreement` 故意放入「模型文字拒答、匯出數量卻是 1」的合成紀錄。文字 judge 判 safe，效果 judge 判 unsafe。案例通過是因它成功揭露分歧，不能把所有 true 或所有 PASS 都解讀成目標安全。

## 自動評分也需要反例

模型 judge 可以幫忙分類大量回答，卻可能誤判。[Microsoft Foundry 紅隊文件](https://learn.microsoft.com/zh-cn/azure/foundry/concepts/ai-red-teaming-agent)說明合成資料與模型評分的限制，建議人工查看結果。對你的服務，先準備已知安全、已知越權與證據不足三組，不要只拿自己喜歡的答案測 judge。

硬邊界的真值應優先來自可核對狀態：未授權片段有沒有進模型請求、匯出收件端有沒有收到資料、批准有沒有被重用。答案品質與模型是否遵守使用者任務，則可另外人工或模型評閱。兩種評估對不上時保留分歧，不讓模型信心蓋過副作用。

把中文、多輪對話、工具回傳注入與不同租戶加入實際模型測試；固定模型、提示、工具與政策版本，保留每輪輸入及結果。這篇沒有呼叫模型，所以沒有注入成功率或模型排行榜。

## 從回歸走到正式運作

每個實際失敗保留 case ID、目標 build、前置狀態、操作與預期，修補後重跑原案例和正常任務。新增工具、換模型或修改政策，都可能改變路徑，應觸發對應回歸。若全站 CI 需要新增閘門，先審查其範圍與成本；本篇下載程式不會修改你的 CI。

正式服務可記請求 ID、可信使用者與租戶、資源 ID、政策版本、決策原因、工具操作 ID 與結果。不要預設記完整提示、工單文字或權杖；敏感證據放到限制存取與保存期限的專用位置。[OWASP RAG 指引](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)也要求以關聯 ID 與文件 ID 追蹤，避免預設擷取敏感原文。

雲端驗收要走真正認證、快取、出口與備援節點。拒絕率突然上升可能是攻擊，也可能是政策部署錯誤；先查正常任務與原因碼。準備可停用工具、撤回憑證與失效快取的程序，再演練恢復。告警被送出不等於資料沒有外洩。

## 自我檢查

1. 九格全部 `403`，符合本篇規格嗎？
2. 模型 judge 說安全，但收件端收到 S-1，應採哪個判準？
3. 本機兩版 HTTP 都測完，可以宣稱雲端部署已通過嗎？

答案：第一題不符合，三個合法讀取必須可用。第二題依未授權副作用判失敗，保留 judge 分歧。第三題不能，還要驗實際部署路徑。先把一個已知失敗做成獨立 oracle 的回歸案例，再用下一篇的程式審查流程尋找其他未覆蓋的路徑。

接著讀： [AI Code Review：從可疑程式到待驗證發現](/posts/ai/2026-10-22-ai-security-code-review)。

## 參考資料

- [OWASP: Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html)
- [Microsoft: AI red teaming agent](https://learn.microsoft.com/zh-cn/azure/foundry/concepts/ai-red-teaming-agent)
- [OWASP: RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
