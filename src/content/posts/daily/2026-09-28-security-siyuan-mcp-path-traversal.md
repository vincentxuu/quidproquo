---
title: "資安警報｜SiYuan MCP 檔案工具路徑穿越漏洞群——「補丁補一半」讓 Agent 繞過敏感路徑防護"
date: 2026-09-28
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "開源筆記工具 SiYuan 的 MCP 檔案工具在遞迴操作（grep／copy／unzip）上漏檢查每一個解析後路徑，讓已通過驗證的管理者透過 in-app Agent 或外部 MCP server 讀出或覆寫本應被封鎖的機敏檔案，凸顯『補丁只補入口、沒補每一層』的常見根因。"
tldr: "SiYuan（自架個人知識管理系統）v3.8.0–3.8.3 的 MCP 檔案工具只在遞迴操作的『根路徑』做敏感路徑檢查，沒有對每個解析後的子路徑重複檢查，導致 file.grep／file.copy／unzip 可以讀出或覆寫 conf.json、TLS 金鑰等本應被擋下的檔案（CVE-2026-100633，同日還有三個相關路徑穿越 CVE）。已於 v3.8.4 修補，官方認定影響僅限已通過驗證的管理者，不構成任意程式碼執行。"
series:
  name: "AI Security Alert"
  order: 40
---

> 🌏 [English version](/en/posts/daily/2026-09-28-security-siyuan-mcp-path-traversal-en)

## 事件概述

開源自架個人知識管理系統 SiYuan 在 2026-09-26 被揭露一組 MCP（Model Context Protocol）檔案工具的路徑穿越漏洞（CVE-2026-100633，及同批公開的 CVE-2026-100636／100637／100638）。核心問題是：SiYuan 先前已經修過一次「敏感路徑防護」漏洞（GHSA-c8r8-95hg-mp34），但這次修補只檢查了遞迴操作的「允許根目錄」，沒有對遞迴過程中解析出的每一個子路徑重複套用同一組檢查。結果是已通過驗證的管理者，透過 SiYuan 內建的 Agent 或外部 MCP server，可以用 `file.grep`、`file.copy`、`unzip` 三個工具讀出或覆寫 `conf/conf.json`、TLS 金鑰、發佈存取設定等本應被直接封鎖的檔案。官方已在 v3.8.4 修補，且明確排除「越過作業系統權限」或「任意程式碼執行」的可能性。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Privilege Escalation（MCP 工具授權檢查繞過 / 敏感路徑防護不完整） |
| 影響範圍 | SiYuan（自架 PKM 系統）v3.8.0–3.8.3，透過 in-app Agent 或外部 MCP server 呼叫檔案工具 |
| 嚴重程度 | High（VulnCheck CVSS v4.0 評 8.5；GitHub 官方 advisory 以 CVSS v3.1 評為 Moderate 6.5） |
| CVE | CVE-2026-100633（主漏洞），同批相關：CVE-2026-100636、CVE-2026-100637、CVE-2026-100638 |
| 來源 | [GitHub Security Advisory GHSA-9g6v-r3xf-673q](https://github.com/siyuan-note/siyuan/security/advisories/GHSA-9g6v-r3xf-673q)、[VulnCheck Advisory](https://www.vulncheck.com/advisories/siyuan-3.8.0-through-3.8.3-path-traversal-via-mcp-file-operations)、[NVD CVE-2026-100633](https://nvd.nist.gov/vuln/detail/CVE-2026-100633) |

## 攻擊面分析

SiYuan 的 MCP 檔案工具原本有一道「敏感路徑防護」：`kernel/mcp/tools/file.go` 的 `resolvePath()` 會呼叫 `util.IsForbiddenAbsPath()`，直接擋下對 `conf/conf.json`、TLS 金鑰、`data/.siyuan/publishAccess.json` 等檔案的存取。問題出在三個**遞迴類**操作只把這道檢查套用在「呼叫者指定的根路徑」上，之後遞迴展開出來的每一個子路徑就不再重複驗證：

1. `file.grep` 遞迴掃描目錄內容時，底層函式庫（Gulu）不提供授權回呼，掃到受保護檔案就直接把內容回傳給呼叫者。
2. `file.copy` 只驗證來源／目的地根目錄，複製時會把隱藏目錄（如 `.siyuan`）內的受保護檔案一併複製到一個「不受保護」的路徑，之後用正常的 `file.read` 就能讀到。
3. `unzip` 只驗證 ZIP 檔本身與解壓目的地根目錄，展開時每個檔案成員（archive member）沒有再逐一授權檢查，可用一個合法命名的 ZIP 成員覆寫受保護設定檔。

根本原因是**「容器路徑的授權」被誤當成「容器內每個後續路徑的授權」**——這是 MCP 工具設計中一個具有代表性的模式：入口檢查做了，但工具本身在遞迴／批次操作時繞過了同一個檢查點。對應 OWASP LLM Top 10 可歸類為 **LLM06 Excessive Agency**（Agent 工具被賦予了比預期更大的檔案存取範圍），也呼應近期 MCP 生態一連串 CVE 揭露中反覆出現的根因：授權判斷只做一次、沒有對每個實際開啟／建立的路徑重新檢查。需要注意的是，此漏洞要求攻擊者已經是通過驗證的管理者身分（`PR:H`），本質上比較接近「Agent 工具越權讀寫本不該碰的檔案」，而非外部未授權攻擊。

## 防禦做法

**立即動作**
- 檢查 SiYuan 版本：`SiYuan 版本 < 3.8.4` 就有風險，升級到 **v3.8.4** 修補三個遞迴操作的授權缺口。
- 升級前先限制 MCP server 與 in-app Agent 介面的存取對象，只留必要管理者帳號可用，降低攻擊面。
- 檢查是否曾經透過 Agent 或 MCP 執行過大範圍的 `grep`／`copy`／`unzip` 操作，若有，比對 `conf/conf.json`、TLS 金鑰、發佈存取設定是否曾被異常讀取或覆寫，必要時輪換其中的存取碼與金鑰。

**長期架構**
- 設計 MCP 工具時，敏感路徑檢查要放在**每一個實際開檔／建檔的呼叫點**，而不是只放在遞迴操作的入口參數上——這正是本次漏洞与其「前一版修補」共同踩到的坑。
- 對 Agent 工具做能力宣告分級（`ToolEffects`），把 `grep`、`copy`、`unzip` 這類會觸及大量檔案的操作單獨標記，而不是套用一個全域的「安全動作」分類，避免像本例中 `file.grep` 因為被歸類為「安全」而完全跳過人工確認與快照。
- 對 MCP server 做最小權限限制與治理：watchlist 中的 Netzilo 提供 MCP server runtime governance（可設定 allowlist、記錄工具呼叫），Invariant Labs 則專注在偵測 MCP 工具描述與呼叫行為的異常，兩者都適合作為「工具本身邏輯有漏洞」之外的第二層防線。

## 影響範圍

SiYuan 是自架個人知識管理系統，受影響對象僅限**自行部署、且開啟了 in-app Agent 或外部 MCP server 功能**的使用者；官方雲端服務或未啟用 Agent/MCP 功能的安裝不受影響。目前沒有證據顯示此漏洞已被實際利用，這是研究人員以私下漏洞回報管道揭露、附完整可重現的合成測試（syntetic proof），未公開任何 issue、PR 或公開漏洞細節。官方已在 v3.8.4 修補，且同批一次公開了另外三個路徑穿越 CVE（`exportBrowserHTML`、`checkoutRepo`、`setNotebookIcon` 端點），顯示這次是針對同一套系統做過一輪完整的 MCP/Agent 工具安全審查後的批次揭露。

如果你的 Agent 系統也提供「遞迴型」檔案工具（批次搜尋、批次複製、解壓縮），這次事件是一個很具體的檢查清單：確認每一個工具在遞迴展開路徑後，是否仍然對最終路徑重新做過一次授權檢查，而不是只信任一開始傳進來的根目錄參數。

## 今日收穫

過去看 MCP 安全事件多半聚焦在「未驗證的 MCP server」或「工具描述裡藏惡意指令」，但這次事件提醒我還有第三種模式：**驗證做對了、工具描述也乾淨，但工具的遞迴／批次邏輯本身沒有把授權檢查貫徹到底**。修補一次「敏感路徑防護」不代表所有呼叫路徑都被涵蓋——同一道防護牆，可能在遞迴、複製、解壓縮這些「看起來只是效能最佳化」的程式碼路徑上留了後門。

## 參考資料

- [GitHub Security Advisory GHSA-9g6v-r3xf-673q — Incomplete fix for GHSA-c8r8-95hg-mp34](https://github.com/siyuan-note/siyuan/security/advisories/GHSA-9g6v-r3xf-673q)
- [VulnCheck Advisory: SiYuan 3.8.0 through 3.8.3 Path Traversal via MCP File Operations](https://www.vulncheck.com/advisories/siyuan-3.8.0-through-3.8.3-path-traversal-via-mcp-file-operations)
- [NVD — CVE-2026-100633](https://nvd.nist.gov/vuln/detail/CVE-2026-100633)
- [VulDB — CVE-2026-100633](https://vuldb.com/cve/CVE-2026-100633)
- [Strix.ai — CVE-2026-100636](https://www.strix.ai/cve/CVE-2026-100636)
