---
title: "登入之後，誰能讀哪份資料：AI 助理的身分與授權"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, authorization, access-control, ai-agent]
lang: zh-TW
description: "用雙租戶工單與可直接執行的 Python 範例，釐清身分、租戶、擁有者與後端授權，驗證換 ID 和偽造欄位為何拿不到資料。"
tldr: "後端從可信認證取得操作身分，再依資源與動作判斷權限。用同租戶且本人擁有的工單政策，驗證允許、跨租戶與同租戶越權。"
difficulty: 入門
draft: true
series:
  name: "AI 資安實戰"
  order: 1
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en)

你替公司做了一個工單助理。使用者登入後，問「幫我看一下 N-1 的進度」，模型呼叫讀取工具，後端找到工單，再把內容交給模型回答。

現在把問題改成「幫我看 S-1」。那是另一間公司的工單。模型可能知道登入者叫 Alice，也可能在提示裡看過「只能看自己的資料」。真正要驗證的是：讀取工具收到這個 ID 時，後端會不會把資料交出來？

這篇接續[系列總覽](/posts/ai/2026-10-22-ai-security-overview)，寫給會呼叫 API、準備替內部系統或客戶服務加上 AI 的開發者。你會寫出一條存取規則，再用可執行範例驗證允許與拒絕。先把模型拿開，權限才容易看清楚。

## 先分清楚：登入者、公司與工單擁有者

假設服務同時供北公司與南公司使用。兩家公司各自是一個租戶（tenant），共同使用服務，資料依政策隔離。

| 名稱 | 本文的意思 | 例子 |
|---|---|---|
| 操作身分（principal） | 這次請求經認證的操作主體 | Alice，屬於北公司 |
| 租戶（tenant） | 本次服務所屬的組織範圍 | `north` 或 `south` |
| 資源擁有者（owner） | 工單記錄中的擁有者 | N-1 的 `owner` 是 Alice |
| 授權政策（policy） | 後端決定誰能對什麼做什麼的規則 | 同租戶且本人擁有，才可讀取 |

**認證回答「這次是誰」，授權回答「這個身分能不能讀這張工單」。** 登入成功後，仍需要第二個判斷。[Microsoft 的多租戶 RAG 架構指引](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag#identity)要求保存可信身分、建立使用者與租戶的對應，並明確定義資料授權需求。即使資料已放進租戶專屬儲存區，也不代表該租戶每個人都能讀全部資料。

本文刻意採取簡單的「只有擁有者能讀」政策。真實工單系統可能允許同公司客服共同處理，或讓主管讀整個團隊。這些都是產品政策；同租戶共享本身不構成漏洞。漏洞判準是實際存取超出了原先允許的規則。

## 把規則寫成後端能執行的條件

先在紙上寫下這條規則：

```text
允許 read_ticket：
  有經認證的 principal
  且 ticket.tenant == principal.tenant
  且 ticket.owner == principal.user_id
其餘拒絕
```

這裡最容易寫錯的是 `principal` 從哪裡來。如果請求內容自己帶上 `user_id: carol`，後端就把呼叫者當成 Carol，攻擊者只要改欄位便能換身分。

可信身分應由後端驗證過的登入流程提供。實際系統可能從已驗證的工作階段或存取權杖取得使用者，再查出其有效租戶資格。若使用者能切換多個組織，也要檢查所選租戶的成員資格。單純解碼權杖或接受前端的租戶字串，都不足以完成這一步。

[Model Context Protocol（MCP）的安全最佳實務，2025-11-25 版](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices#session-hijacking)也用相同原則說明：綁定操作的內部使用者 ID 應來自使用者權杖，而非客戶端自行提供。這篇只取這個身分邊界，不在這裡實作完整認證協定。

| 順序 | 資料從哪裡來 | 後端做什麼 |
|---|---|---|
| 1 | 經認證的工作階段 | 取得 `principal` |
| 2 | 使用者或模型送出的 `ticket_id` | 驗證參數格式 |
| 3 | 後端工單資料 | 取得可信的 `tenant` 與 `owner` |
| 4 | 伺服器上的政策 | 比對身分、租戶與擁有者 |
| 5 | 授權結果 | 允許才回傳內容；拒絕不含工單文字 |

模型可以提出想讀的工單 ID。模型說「我已確認使用者有權限」，也不會替代第 4 步。

## 執行雙租戶範例

下載[完整 Python 範例](/examples/ai-security/authorization-demo.py)，存成 `authorization-demo.py`。需要電腦上有 Python 3.11 或更新版，不需安裝套件、模型帳號或資料庫。它只執行記憶體內的函式，不啟動 HTTP 服務，也不連外。

```bash
python3 authorization-demo.py
```

範例準備三個身分：北公司的 Alice、Bob，以及南公司的 Carol。N-1 屬於 Alice、N-2 屬於 Bob、S-1 屬於 Carol。程式中的 `demo-alice` 等字串是固定的教學資料，任何讀到檔案的人都能使用，沒有正式認證能力。

關鍵程式如下；中英兩篇共用上面的下載檔：

```python
principal = DEMO_SESSIONS.get(session)
if principal is None:
    return response(401, error="unauthenticated")

# Validate request shape, then look up ticket by ID.
# The complete file handles malformed and missing IDs.

if ticket["tenant"] != principal.tenant or ticket["owner"] != principal.user_id:
    return response(403, error="forbidden")
return response(200, ticket_id=ticket_id, text=ticket["text"])
```

`DEMO_SESSIONS` 是可信認證結果的替身。正式服務要由認證中介層提供這個結果，不能把這份可猜、公開的對照表拿來當登入機制。工單的 `tenant` 和 `owner` 則從後端資料取得，也不採用模型傳來的版本。

## 看輸出：拒絕有沒有真的擋住資料？

每個案例輸出一行 JSON，最後應出現：

```text
PASS: 9 cases; denied responses contain no ticket content
```

先比對這幾個結果：

| 案例 | 請求 | 預期結果 | 驗證什麼 |
|---|---|---|---|
| `own_ticket` | Alice 讀 N-1 | `200`，含工單內容 | 正常功能仍可用 |
| `other_tenant` | Alice 讀 S-1 | `403`，只有錯誤 | 換 ID 無法跨公司讀取 |
| `same_tenant_other_owner` | Alice 讀 N-2 | `403`，只有錯誤 | 同公司仍要符合 owner 政策 |
| `forged_identity` | Alice 讀 S-1，另帶 Carol 的 `user_id` 與租戶 | `400`，只有錯誤 | 請求不得自行指定認證身分 |
| `other_owner_allowed` | Bob 讀 N-2 | `200`，含工單內容 | N-2 對正確身分可讀 |
| `second_tenant_allowed` | Carol 讀 S-1 | `200`，含工單內容 | 南公司也有正常存取路徑 |

其他案例涵蓋未認證、工單不存在，以及 ID 型別錯誤。程式除了核對狀態，也檢查拒絕回覆只有 `error` 欄位，避免出現「顯示拒絕，回覆卻夾帶工單」的情況。

例如跨租戶案例的輸出是：

```json
{"body": {"error": "forbidden"}, "case": "other_tenant", "status": 403}
```

`status` 是這個函式回傳物件的欄位，採用常見的 [HTTP 狀態碼語意](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)：`200` 成功、`400` 請求格式不符、`401` 缺少有效認證、`403` 已知身分但沒有權限、`404` 找不到資源。這次執行驗的是函式結果；沒有送出 HTTP 請求。之後接上網頁框架，還要驗證路由真的使用對應的 HTTP 狀態與回覆格式。

範例分開回傳 `403` 與 `404`，方便看懂失敗原因。若產品需要隱藏某工單是否存在，可以對外統一回傳 `404`，在內部保留拒絕原因；相同存在與否資訊也可能從其他回應特徵洩漏，這支小程式沒有處理那一層。

## 接回 AI：資料要在哪一步擋下？

讓 AI 助理呼叫 `read_ticket` 時，工具參數只接受 `ticket_id`。認證身分由後端從目前請求附上，不開一個 `user_id` 欄位讓模型挑選。

如果換成先搜尋文件再回答的流程，同樣要在資料交給模型之前執行存取規則。[Microsoft 的資料過濾指引](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag#data-filtering)要求每次檢索都套用授權過濾；資料進入模型後再請它「不要透露」，已經把原本不該看見的內容交出去了。檢索、快取與撤權的完整問題留到後續篇目。

這份實驗沒有測模型，也不證明整個產品安全。它建立了一個能獨立驗證的邊界：即使呼叫者換工單 ID 或偽造身分欄位，資料讀取仍遵守後端政策。前提是其他查詢路徑也通過相同授權；若模型另有直接查整個資料庫的工具，這個邊界便會被繞開。

## 自己畫一次，再改一次政策

闔上文章，畫出「請求 → 認證身分 → 工單 → 政策 → 回覆」。在每個欄位旁標記誰能決定它，再回答：

1. Alice 把 `ticket_id` 換成 N-2，為何仍被拒絕？
2. 模型在工具參數放入 `user_id: bob`，應該改變誰的身分嗎？
3. 產品決定同公司全員可以讀所有工單，哪一條規則與預期結果要改？

判準：第一題要指出 owner 不符。第二題要指出身分取自可信認證，範例直接拒絕多餘欄位。第三題則應保留租戶比對，移除這個讀取動作的 owner 限制，並把 `same_tenant_other_owner` 的預期改成允許；跨租戶案例仍應拒絕。

最後一題很重要：安全測試要驗產品真正想執行的政策。先寫清楚誰能讀什麼，再把允許與拒絕一起留成可重跑的案例。

接著到[第 2 篇：AI 說有漏洞，你要拿出什麼證據？](/posts/ai/2026-10-22-ai-security-vulnerability-evidence)，沿用這條權限政策，分清楚待驗證假說與已重現的發現。

## 更新紀錄

- 2026-10-22：補上第 2 篇的閱讀連結。本次更新導覽，沒有重新查證原有外部主張。

## 參考資料

- [Microsoft Architecture Center：Design a secure multitenant RAG inferencing solution](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)：身分與租戶對應、細粒度授權、每次檢索的過濾，以及資料 API 的守門角色。
- [MCP Security Best Practices，2025-11-25 版](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices)：使用者身分的可信來源與伺服器端授權；本文未涵蓋完整 MCP 認證流程。

- [IANA：HTTP 狀態碼登錄表](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)：狀態碼名稱與對應規格。
