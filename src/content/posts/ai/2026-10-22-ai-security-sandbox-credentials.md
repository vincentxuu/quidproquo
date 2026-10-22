---
title: "Agent 的沙盒、憑證與網路邊界"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, sandbox]
lang: zh-TW
description: "實跑 macOS 檔案與網路拒絕探測，並區分環境繼承、API 能力與完整隔離。"
tldr: "用作業系統限制實測合成檔案與網路，再獨立檢查短效、限資源的授權；程式內允許清單不是 OS 沙盒，通訊方式也不會限制程序能力。"
difficulty: 進階
draft: true
series:
  name: "AI 資安實戰"
  order: 15
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en)

工單工具的參數政策寫得再好，若它執行的 Python 程式可以讀整個家目錄、連任意網址，甚至繼承部署管理金鑰，一個工具漏洞就可能越過原本的工單邊界。

這篇回答：**假設工具程式已經做錯事，執行環境還能限制它碰到什麼？** 先讀[工具授權](/posts/ai/2026-10-22-ai-security-tool-authorization)與[MCP 信任鏈](/posts/ai/2026-10-22-ai-security-mcp-trust)。你會分別測檔案、網路與憑證，避免把「程式自己說不可以」當成隔離。

## 沙盒與授權，是兩種控制

應用程式檢查 `ticket_id`，防的是正常工具入口被濫用；作業系統、容器或虛擬機的執行限制，則針對程式能直接呼叫的檔案與網路能力。若攻擊者已能改執行路徑，Python 裡的一個 `if` 未必還在。

[OWASP 的 MCP 安全指引](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)要求限制本機 server 的檔案與網路，並指出 stdio 不會做到這些隔離；單純 chroot 也不是完整程序沙盒。沒有開 TCP 監聽埠，不表示程序無法向外連線。

| 邊界 | 本例允許 | 本例拒絕 | 證據 |
|---|---|---|---|
| 檔案 | 讀合成輸入、寫結果 | 讀指定私有檔、改指定保護檔 | 真正 OS 權限錯誤 |
| 網路 | 未限制 baseline 可連 loopback | 受限程序不能連同一 listener | 連線權限錯誤 |
| 環境 | 狹窄教學標記 | 不繼承父程序合成秘密 | 子程序只看得到明列欄位 |
| API 授權 | Alice 讀 N-1 | 其他資源、寫入、過期與錯受眾 | 獨立政策案例 |

第三列的標記不是可用憑證。真正 token 的驗證在第四列的政策概念與正式認證服務，不能由任意環境字串建立身分。

## 先跑作業系統探測

下載[macOS 執行邊界探測程式](/examples/ai-security/defense-sandbox-probe.py)，存成 `defense-sandbox-probe.py`。需要 macOS、可用的 `/usr/bin/sandbox-exec` 與 Python 3.11 以上：

```bash
python3 defense-sandbox-probe.py
```

預期最後一行：

```text
PASS: 7 restricted checks and 4 baseline counterchecks
```

程式在暫存目錄建立合成檔案，先以一般子程序讀寫並連接本機 listener，確認原本做得到；再用 OS policy 拒絕指定檔案讀寫與所有網路操作。受限程序仍能讀工作輸入、寫摘要，拒絕項目則必須得到 `PermissionError`。單純連線逾時、連線被拒或服務沒開，不會被當成網路隔離成功。

這份 profile 使用 `allow default` 加上針對性拒絕，目的是單獨看清機制；**它沒有隔離其餘主機檔案，不能直接當正式 Agent 沙盒設定。** 範例真正實測的是列出的檔案與網路拒絕，沒有測核心逃逸或任意惡意程式。其他平台會回 `UNSUPPORTED`，不會把未執行寫成通過。

## 不要讓工具繼承整個工作階段

父程序準備的 `DEMO_PARENT_SECRET` 只是合成字串。一般 baseline 會看見它，受限子程序則使用明列的環境，只帶執行所需 PATH 與 `DEMO_CAPABILITY` 教學標記。這能示範避免環境自動繼承，不能證明所有秘密來源都被隔離。

正式環境還要盤點掛載的設定檔、雲端 metadata、Unix socket、容器管理 socket 與憑證代理。從 env 移除秘密，但仍掛載整個使用者目錄或 Docker socket，仍可能讓工具取得更高權限。工作目錄切換也不會禁止讀取絕對路徑。

對工單讀取，工具應透過代理取得限用途的短效能力；只允許 Alice、N-1、`read_ticket` 與工單 API，不能拿同一份能力去部署或查別家公司。下載[防護政策範例](/examples/ai-security/defense-demo.py)並執行：

```bash
python3 defense-demo.py capability
```

預期五個案例通過，最後顯示 `mode=capability`。正常讀取為 true，換資源、換動作、換受眾、到期後都為 false。這是對已驗證授權主張的函式模擬，沒有簽發 token，也不是 OS 沙盒。真實憑證要驗簽章、來源、生命週期與撤銷狀態。

## 將探測結果變成部署規格

要在自架雲端執行任意工具程式，先列出真正需要的能力：固定輸入掛載、獨立輸出目錄、可連的 API、可用的憑證與最長執行時間。採取預設拒絕的執行設定後，再把本篇的正反探測搬到部署裡。不要把這份針對性 macOS profile 原封不動當成雲端設定。

實際驗收至少分三步：工作輸入可讀與結果可寫；未掛載的合成私有檔不可讀、非輸出路徑不可寫；需要的 API 可連，不在允許範圍的測試端不可連。若工具需要網路，改以受控出口代理或網路政策限制目的地，包含重新導向與解析結果，不能只檢查使用者輸入的主機名。

另外測 CPU、記憶體、程序數、總時限與輸出量。沙盒可以降低存取範圍，卻不會自動限制重試費用，也不會判斷工單動作是否獲批准。程序被終止後，已發生的副作用仍需查收據與回復機制。

## 自我檢查

1. 工具只用 stdio，能說它無法上網嗎？
2. 移除環境中的管理金鑰，但掛載管理 socket，權限已縮小嗎？
3. 本篇七個受限探測通過，能宣布主機所有檔案都隔離嗎？

答案：第一題不能，stdio 是通訊方式。第二題不能直接下結論，socket 也可能授予管理能力。第三題不能，測試 profile 只拒絕指定路徑與網路。替自己的工具畫出一張「能讀、能寫、能連、能代表誰」表，再逐項用合成資源驗證。

接著讀： [如何知道防線有效：紅隊、回歸與運作監控](/posts/ai/2026-10-22-ai-security-security-regression)。

## 參考資料

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
