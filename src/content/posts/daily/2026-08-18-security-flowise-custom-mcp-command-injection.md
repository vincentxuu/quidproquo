---
title: "資安警報｜Flowise Custom MCP 節點命令注入——一年內第四個 RCE CVE（CVE-2026-73601）"
date: 2026-08-18
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: zh-TW
description: "開源 AI Agent 建構平台 Flowise 的 Custom MCP 節點被揭露新一輪命令注入漏洞 CVE-2026-73601，已認證使用者可透過環境變數與工作目錄手法在 stdio 模式下取得主機層級任意指令執行，這已是同一功能一年內第四次被回報 RCE。"
tldr: "資安團隊 elttam 發現 Flowise Custom MCP 節點在 CUSTOM_MCP_PROTOCOL=stdio（預設值）時，已認證使用者可濫用 PYTHONWARNINGS／BROWSER 環境變數或利用 StdioClientTransport 的根目錄 cwd 繞過既有的指令與路徑驗證，在主機執行任意指令，CVSS v4.0 評為 9.0 Critical，已在 3.1.3 修補（CVE-2026-73601）。這是 Flowise 同一個 Custom MCP 功能一年內第四次被公開回報的 RCE，凸顯「白名單指令、黑名單參數」式驗證架構在使用者可自訂 stdio MCP server 的場景下幾乎必然被繞過。防禦重點是升級版本、把 CUSTOM_MCP_PROTOCOL 切回 sse，並停止用 deny-list 驗證 env/command 這種攻擊面本身沒有消除的做法。"
series:
  name: "AI Security Alert"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-18-security-flowise-custom-mcp-command-injection-en)

## 事件概述

資安研究機構 elttam 向 FlowiseAI 揭露 Flowise 開源 AI Agent／工作流建構平台的 Custom MCP 節點存在命令注入漏洞，追蹤編號 **CVE-2026-73601**。當部署採用預設的 `CUSTOM_MCP_PROTOCOL=stdio` 設定時，已通過身份驗證的使用者可以透過操縱 MCP server 設定中的環境變數與路徑，繞過 Flowise 既有的指令與參數驗證機制，在跑 Flowise 的主機上執行任意作業系統指令。GitHub Security Advisory（GHSA-g98q-rm45-q9h8）已於 7 月底發佈，CVE 於 8 月 13 日正式登錄 NVD 與 CVE.org，修補版本為 3.1.3。這是 Flowise 的 Custom MCP 功能在過去一年內第四次被公開回報 RCE 等級漏洞。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Command Injection（CWE-95，經 Custom MCP 節點取得主機層級 RCE） |
| 影響範圍 | Flowise（FlowiseAI/Flowise）< 3.1.3，且 Custom MCP 節點設定為 `CUSTOM_MCP_PROTOCOL=stdio`（此為預設值） |
| 嚴重程度 | Critical（CVSS v4.0 9.0） |
| CVE | CVE-2026-73601 |
| 來源 | [GitHub Security Advisory GHSA-g98q-rm45-q9h8](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)、[NVD / CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-73601)、[VulnCheck Advisory](https://www.vulncheck.com/advisories/flowise-before-remote-code-execution-via-custom-mcp)、[Halo Security 通報](https://cve.halosecurity.com/cve-advisory/cve-2026-73601-flowise-remote-code-execution-via-custom-mcp-node) |

## 攻擊面分析

Flowise 的 Custom MCP 節點讓使用者連接自訂的 MCP server，底層透過 `@modelcontextprotocol/sdk` 的 `StdioClientTransport` 以子行程方式啟動該 server。Flowise 團隊其實已經意識到「讓使用者定義要啟動的本機行程」本身很危險，因此加了一層 `validateMCPServerConfig` 驗證：只允許 `node`、`npx`、`python`、`python3`、`docker` 幾個指令，並對參數與環境變數做黑名單檢查。CVE-2026-73601 證明這層防護不夠：

- 攻擊者可以濫用 `PYTHONWARNINGS` 與 `BROWSER` 這兩個原本不在危險清單裡的環境變數組合，讓 `python3` 進程啟動時觸發任意指令執行；
- 另一條路徑是利用 `StdioClientTransport` 啟動子行程時的工作目錄固定為 `/` 這件事，搭配 `node` 指令讀取 `/proc/self/environ`，繞過原本用來擋絕對路徑檔案存取的檢查，改寫 `HOME` 環境變數注入可執行的程式碼。

兩條路徑的共通根因，是驗證邏輯停在「指令名稱在不在白名單」與「已知危險參數擋不擋得住」這一層，卻沒有處理「指令＋環境變數＋工作目錄」組合出來的間接執行路徑——這正是黑名單式（deny-list）輸入驗證的結構性弱點：防得住已知的攻擊手法，防不住還沒被想到的下一種組合。這也不是 Flowise 第一次在同一功能上栽在同一個模式：CVE-2025-59528（`Function()` 動態求值）、CVE-2025-71336（`x-request-from: internal` 繞過未授權存取）、CVE-2026-40933（另一組指令注入路徑）都出在 Custom MCP／MCP 相關程式碼上，CVE-2026-73601 是這條攻擊面第四次被公開回報。

對照 OWASP LLM Top 10，這屬於 **LLM06 Excessive Agency**（Custom MCP 節點被賦予「啟動任意本機行程」的能力，遠超過「連接外部工具」實際需要的最小權限）疊加 **LLM05 Supply Chain Vulnerabilities** 的變體——使用者可控的 MCP server 設定，本質上是把未經信任的輸入直接送進執行層。這也呼應 OX Security 今年稍早發佈的「MCP STDIO 命令注入」系統性研究：只要一個平台允許使用者自行定義 stdio 型 MCP server 的 command／args／env，這類漏洞幾乎是可預期會反覆出現的一類問題，而不是單一實作疏漏。

## 防禦做法

**立即動作**
- 檢查 Flowise 版本：確認是否 < 3.1.3（`docker exec <container> npm ls flowise` 或檢查部署所用的 image tag），未達 3.1.3 者立即升級
- 若暫時無法升級，先把環境變數 `CUSTOM_MCP_PROTOCOL` 從 `stdio` 改為 `sse`——這是官方目前建議的較安全預設，可直接關掉整條攻擊路徑
- 盤點所有啟用 Custom MCP 節點的 Flowise 實例，特別是網路可達（尤其是可從網際網路連到管理介面）的部署，優先處理

**長期架構**
- 不要對使用者可控的 command／args／env 用 deny-list 驗證——黑名單只能擋已知手法，白名單能執行的整個 MCP server 定義（而非只白名單指令名稱）才是可持續的做法
- 讓 Custom MCP／任何「使用者自訂 stdio 子行程」類功能都跑在隔離的沙箱或容器內，限制檔案系統存取與對外連線（egress allowlist），即使繞過驗證也不會直接拿到主機層級的執行權
- 導入 watchlist B7 中聚焦 MCP／Agent 執行期治理的工具（如 **Invariant Labs** 的 MCP 掃描與可視性工具、**Lasso Security** 的 Agent 執行期監控）協助偵測異常的 MCP tool 呼叫模式，補上「修補永遠慢半拍」這段空窗期的偵測能力

## 影響範圍

Flowise 是相當熱門的開源 low-code AI Agent／工作流建構平台，常見於企業內部開發環境或對外提供服務的部署，其技術也曾被 Workday 收購整合。由於 Custom MCP 功能在過去一年內已累積四個獨立 CVE，這代表「讓使用者自訂 stdio MCP server」這個設計本身的攻擊面，遠比單一 bug 更值得正視——每次修補都精準堵住上一版被回報的手法，但只要攻擊面（使用者可控的 command/args/env 組合）沒有從根本上收斂，後續出現第五個繞過並不令人意外。目前公開資料未指出這項漏洞在揭露前已遭在野利用，是透過協調揭露流程回報並修補後才公開。如果你的 Agent 系統中有任何功能允許使用者自訂 stdio 型 MCP server 的啟動指令（不限 Flowise），這次揭露的兩條繞過路徑都值得拿來對照自己的驗證邏輯是否有同樣的黑名單式漏洞。

## 今日收穫

先前幾篇資安警報報導的多半是「某平台有一個漏洞」，但 Flowise Custom MCP 這條攻擊面一年內出現四個獨立 CVE，讓認知差變得更明確：當一個功能的本質是「讓使用者定義要在主機上啟動什麼行程、帶什麼參數與環境變數」，補丁式的黑名單修法注定只是在跟攻擊者比誰先想到下一個環境變數組合，而不是真的關掉風險。評估任何 Agent 平台的 MCP 整合安全性時，比起問「這個已知漏洞修了沒」，更該問的是「這個功能的攻擊面本身有沒有收斂，還是只是又補了一塊黑名單」。

## 參考資料

- [Flowise RCE via Custom MCP Config Node — GitHub Security Advisory GHSA-g98q-rm45-q9h8](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)
- [CVE Record: CVE-2026-73601 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-73601)
- [Flowise before 3.1.3 Remote Code Execution via Custom MCP — VulnCheck Advisory](https://www.vulncheck.com/advisories/flowise-before-remote-code-execution-via-custom-mcp)
- [CVE-2026-73601: Flowise Remote Code Execution via Custom MCP Node — Halo Security](https://cve.halosecurity.com/cve-advisory/cve-2026-73601-flowise-remote-code-execution-via-custom-mcp-node)
- [MCP Supply Chain Advisory: RCE Vulnerabilities Across the AI Ecosystem — OX Security](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/)
