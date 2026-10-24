---
title: "MCP 的信任鏈：你到底信任了什麼？"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, mcp]
lang: zh-TW
description: "用定義變更與不變描述下的行為替換，理解 MCP 各層信任及版本差異。"
tldr: "分開驗證工具來源、完整定義、權杖受眾與下游動作；雜湊能發現描述變動，無法證明遠端程式維持相同行為。"
difficulty: 進階
draft: false
series:
  name: "AI 資安實戰"
  order: 13
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-mcp-trust-en)

你昨天審過一個 `read_ticket` 工具，描述說「只讀自己的工單」。今天描述完全相同，遠端伺服器卻在查詢時多做了一次匯出。昨天的批准能證明今天的什麼？

[Model Context Protocol（MCP）](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)定義 AI 應用與工具服務溝通的方式，沒有替你審查每個服務的程式。這篇接續[單次工具授權](/posts/ai/2026-10-22-ai-security-tool-authorization)，讀完要能拆開「我信任了哪個元件」與「哪個性質已被驗證」。

## 從工具來源走到真正資料

Alice 的應用連到工單 MCP server，server 再呼叫工單 API。這裡至少有兩個認證邊界：應用進 MCP、MCP 進工單 API。另有執行權限邊界：本機工具程式可能碰到檔案與網路，遠端工具程式可能持有比 Alice 更寬的服務帳號。

| 檢查 | 能證明什麼 | 不能證明什麼 |
|---|---|---|
| 套件來源與版本 | 取得哪一份已檢視程式 | 程式一定沒有漏洞 |
| 完整工具定義雜湊 | 名稱、schema、註記等是否改變 | 遠端實作沒有改變 |
| token 受眾 | 憑證是發給哪個服務使用 | 使用者能讀任意工單 |
| 執行時 owner 政策 | Alice 此次能否讀該物件 | 所有其他路徑都受相同控制 |

[OWASP 的 MCP 安全指引](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)特別指出，定義雜湊只能發現 metadata 變更；`readOnlyHint` 等註記是提示，沒有執行上的強制力。

## 跑一個「雜湊沒變，行為變了」的反例

下載[防護範例](/examples/ai-security/defense-demo.py)，以 Python 3.11 以上執行：

```bash
python3 defense-demo.py mcp
```

預期結尾：

```text
PASS: 6 deterministic checks; mode=mcp; no LLM or network exercised
```

`same_manifest` 為 true；只改 `annotations.readOnlyHint`，`annotation_drift` 就變成 false。這示範為何只雜湊 description 太少：批准介面可能根據註記調整流程，schema 也可能多出新參數。

接著 `unchanged_manifest_new_behavior` 為 true。它是刻意替換工具行為的受控函式情境：metadata 仍吻合，但不預期的匯出記號已出現。這一行的 true 是反例被重現，絕不是安全通過的意思。範例沒有啟動真的 MCP server，也沒有跑 OAuth 流程；它驗的是三種檢查各自能看到什麼。

## Token 不能隨便從一個服務轉交另一個

受眾（audience）決定 token 的預定接收者。[MCP 2026-07-28 授權安全要求](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)要求 server 驗證 token 是發給自己；若要存取上游 API，要使用該上游授權伺服器簽發的另一份 token，不得把收到的 MCP token 直接透傳。

所以 `expected_audience` 檢查 `ticket-mcp`，而 `wrong_audience_rejected` 拒絕 `other-mcp`。這只是已驗證憑證主張的政策示範，沒有實作簽章、issuer、有效時間、scope 與撤銷驗證。正式系統不能只 decode JWT 後比較一個字串。

即使受眾正確，Alice 讀 S-1 仍要被後端拒絕。MCP server 若拿自己的全域管理 token 查工單，再把內容交回 Alice，就可能成為濫用寬權限的代理。修補要把可信呼叫者帶到物件政策，而不只是把 token 換對。

## 新舊規格要分開談

系列前面的身分篇引用 2025-11-25 版安全指引。本篇傳輸與授權說明採 2026-07-28 版；[傳輸總覽](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)說明早期 revision 使用連線層 session 與 initialize，新版採每請求 metadata，並有舊版相容規則。不能把舊 session 流程直接描述成所有現行 MCP 部署。

無論採哪個 revision，連線或 session 識別值都不能取代受保護動作的使用者驗證。盤點部署時要記 client、server、SDK 版本與協定 revision，測試實際協商的路徑；不要只看「支援 MCP」的行銷標籤。

## 安裝與更新如何落實成檢查？

本機 server 是真的程式，使用 stdio 只改變通訊方式，不會限制檔案、網路與憑證。安裝前要知道啟動命令、套件來源、鎖定版本與預期能力；不要讓檢索到的網頁自動提供一段安裝指令並立即執行。

遠端 server 無法靠本機套件 lockfile 固定其行為。可以監看完整工具定義變更、將不同服務的憑證分開、限制每個工具可呼叫的 API 與目的地，並以合成帳號持續重跑 owner／跨租戶案例。定義改變要重審；定義未變也仍需執行邊界。

搬到雲端時，另測 OAuth discovery 的網路目的地、重新導向、服務身分與出站政策。通過 TLS 只證明通道的某些性質，不能授權雲端 metadata 端點存取或跨租戶資料。

## 自我檢查

1. 完整 manifest 雜湊吻合，能說遠端工具沒有新增副作用嗎？
2. token 對 `ticket-mcp` 有效，能直接拿去工單 API 嗎？
3. 工具註記是唯讀，執行層可以省略政策嗎？

答案全部是否定。第一題需要行為與能力邊界；第二題需要上游適用的獨立憑證；第三題仍要檢查資料與動作。你可以先替目前每個 MCP server 填完上方四列，空白處就是下一個實際查核點。

接著讀： [模型輸出如何變成 XSS、命令與資料外傳](/posts/ai/2026-10-22-ai-security-output-handling)。

## 參考資料

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
- [MCP 2026-07-28: Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
