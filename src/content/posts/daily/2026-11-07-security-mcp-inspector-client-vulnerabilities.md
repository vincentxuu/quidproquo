---
title: "資安警報｜官方 MCP Inspector 三個用戶端漏洞曝光——惡意伺服器可讓沙箱逃逸、繞過 CSP、ReDoS 卡死介面（v2.14.0 修復）"
date: 2026-11-07
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "官方 @modelcontextprotocol/inspector 在 v2.14.0 修補三個由社群私下回報的漏洞：連上的惡意 MCP 伺服器可讓已核准的 App 沙箱逃逸、用 javascript: 網址與 HTML 注入繞過審查與 CSP、或用惡意 regex 讓介面卡死。"
tldr: "官方 MCP Inspector（@modelcontextprotocol/inspector）v2.14.0 修補三個社群私下回報的漏洞 GHSA-h9j8、GHSA-rwv7、GHSA-2fw8：連上的惡意 MCP 伺服器能讓 App 沙箱逃逸後仍收到訊息、用 javascript: 網址或 HTML 注入繞過審查與 CSP、或用惡意 regex 讓介面卡死。受影響版本是 v2.0.0 到 2.13.0，部分問題也回溯影響舊版 v1 到 1.0.3，請立刻升級到 v2.14.0（舊版 v1 升 1.0.4）。"
series:
  name: "AI Security Alert"
  order: 73
---

> 🌏 [English version](/posts/daily/2026-11-07-security-mcp-inspector-client-vulnerabilities-en)

## 事件概述

MCP 官方除錯工具 `@modelcontextprotocol/inspector`（開發者接上任何 MCP 伺服器測試工具、Resource、Prompt 時的標準介面）在 11 月 4 日發布的 v2.14.0 中，一口氣修補了三個由社群成員私下回報、走 GitHub Security Advisory 私有 fork 流程處理的漏洞。三者的共同主題是：Inspector 原本該把「連上的 MCP 伺服器」當成不可信任的輸入來源，卻在三個不同的用戶端程式碼路徑上漏掉了這個假設——結果是，只要開發者拿 Inspector 去接一個惡意或已失陷的 MCP 伺服器，對方就能讓已核准的 App 沙箱失效、在 Inspector 的瀏覽器原生環境裡跑任意 JavaScript、繞過本該保護 HTML 預覽的 CSP，或是用一個刻意設計的正規表達式讓整個介面卡死。目前沒有公開資料顯示任何一項已被在野利用；三者都是負責揭露後才公開，但技術細節與可重現步驟已經完整寫在對應的 GHSA 公告裡。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 用戶端信任邊界缺陷（惡意 MCP 伺服器攻擊開發者的 MCP 用戶端工具） |
| 影響範圍 | `@modelcontextprotocol/inspector` v2 系列 2.0.0–2.13.0；其中 ReDoS 一項回溯影響已停止維護的 v1 系列到 1.0.3 |
| 嚴重程度 | High（三項合併評估；個別攻擊面見下） |
| CVE | 無（登記為三個 GHSA：GHSA-h9j8-vj8g-v3gg、GHSA-rwv7-mh2c-ff2p、GHSA-2fw8-7jmw-r937） |
| 修補版本 | v2 系列 ≥ 2.14.0；v1 系列的 ReDoS 修補為 1.0.4（其餘兩項未回溯到 v1） |
| 來源 | [官方 2.14.0 Release Notes](https://github.com/modelcontextprotocol/inspector/releases/tag/2.14.0)、[GHSA-h9j8-vj8g-v3gg](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-h9j8-vj8g-v3gg)、[GHSA-rwv7-mh2c-ff2p](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-rwv7-mh2c-ff2p)、[GHSA-2fw8-7jmw-r937](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-2fw8-7jmw-r937)、[Penligent 技術分析](https://www.penligent.ai/hackinglabs/mcp-inspector-security-update/) |

## 攻擊面分析

攻擊者要站上這個位置並不難：Inspector 存在的目的，本來就是讓開發者在「還不確定要不要信任一個 MCP 伺服器」時先接上去摸一摸——可能是自己剛寫好、還沒稽核完的伺服器，也可能是從 MCP registry 找來試用的第三方套件，或是一個原本信任、但發布流程被供應鏈攻擊污染的伺服器。只要開發者把 Inspector 接上這類來源不明或已失陷的伺服器，對方就同時拿到攻擊三個獨立程式碼路徑的機會。

第一個路徑是 Apps 分頁的沙箱 iframe（GHSA-h9j8-vj8g-v3gg）：Inspector 讓伺服器提供的 App 內容渲染在一個依核准的 CSP 設定建出沙箱的 iframe 裡，但原本的實作沒有偵測「這個 iframe 被導覽到別的文件」這件事，導致中繼站（relay）繼續把後續的訊息、甚至工具呼叫結果，餵給已經被換掉的新文件——審查者以為自己核准的 CSP 一路管著這個互動，實際上從導覽那一刻起，管的早就是另一個頁面。第二個路徑是一組輸入處理缺陷（GHSA-rwv7-mh2c-ff2p），三個子問題疊在一起看：`server.json` 匯入時，伺服器提供的 `runtimeArguments` 會不經檢查直接塞進啟動指令（`npx`、`uvx`、`docker run`）的參數列，而審查介面只顯示看起來無害的套件名稱，不會顯示真正解析出來的完整指令——等於審查畫面與實際要跑的指令脫鉤；URL elicitation 彈窗把伺服器給的網址直接丟進 `window.open()`，沒有檢查協定，於是 `javascript:`、`data:` 這類網址一樣會被開啟，點下「在瀏覽器開啟」就等於在 Inspector 自己的來源執行攻擊者的 JavaScript，拿到 cookie 與 session 的存取權；HTML 預覽的 CSP 注入則用簡單的字串比對去找 `<head>` 標籤插入 CSP meta，只要文件裡藏一個 `<!-- <head> -->` 這樣的註解陷阱，真正的 CSP 標籤就會被插進註解裡失效，讓預覽頁面裡的任意 inline script 不受限制地執行。第三個路徑是工具結果的 schema 驗證（GHSA-2fw8-7jmw-r937）：連上的伺服器可以在工具輸出 schema 裡放一個刻意設計的正規表達式，等 Inspector 之後拿真正的工具輸出去做同步比對時，這個正則就會卡進災難性回溯（ReDoS），讓整個介面停止回應——不需要任何程式碼執行,只要連上一個惡意伺服器並呼叫它的某個工具就夠了。

三個洞背後是同一種結構性疏漏：專案裡其實已經有正確做法可以抄——像是別處用來檢查網址協定的 `isHttpUrl()`、正確解析 HTML 結構而非用正則比對字串的寫法——卻沒有被一致套用到每一個接收伺服器輸入的地方。對照 OWASP LLM Top 10，核心落在 **LLM05 Supply Chain Vulnerabilities**：一個開發者接上的 MCP 伺服器,本質上就是一條供應鏈,而這次證明連「用來稽核供應鏈的工具本身」也可能是攻擊面;同時也呼應 **LLM07 Insecure Plugin Design** 的精神——MCP 伺服器扮演的正是外部外掛的角色,用戶端對外掛提供的任何 URL、HTML、schema 都該當成不可信輸入來驗證,而不是信任審查介面顯示的摘要。

```diagram
title: 惡意 MCP 伺服器可攻擊的三個 Inspector 信任邊界
desc: 連上 Inspector 的惡意或失陷 MCP 伺服器，可透過三個獨立的用戶端信任邊界缺陷，影響開發者本機環境
caption: GHSA-h9j8-vj8g-v3gg／GHSA-rwv7-mh2c-ff2p／GHSA-2fw8-7jmw-r937，三者皆於 v2.14.0 修復（ReDoS 另於 v1.0.4 回溯修復）
---
<svg viewBox="0 0 680 360">
  <path class="dg-line dg-line--warn" d="M224,180 H232 Q240,180 240,172 V80 Q240,72 248,72 H256" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M224,180 H256" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M224,180 H232 Q240,180 240,188 V280 Q240,288 248,288 H256" marker-end="url(#arrow-warn)"/>

  <path class="dg-line" d="M456,72 H468 Q476,72 476,80 V172 Q476,180 484,180 H496" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456,180 H496" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456,288 H468 Q476,288 476,280 V188 Q476,180 484,180 H496" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--warn" x="16" y="148" width="208" height="64" rx="6"/>
  <text class="dg-label" x="120" y="172" text-anchor="middle" dominant-baseline="central">惡意 MCP 伺服器</text>
  <text class="dg-sub" x="120" y="192" text-anchor="middle" dominant-baseline="central">已連上 Inspector</text>

  <rect class="dg-box" x="256" y="40" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="64" text-anchor="middle" dominant-baseline="central">Apps 分頁沙箱</text>
  <text class="dg-sub" x="356" y="84" text-anchor="middle" dominant-baseline="central">逃逸後仍收發訊息</text>

  <rect class="dg-box" x="256" y="148" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="172" text-anchor="middle" dominant-baseline="central">匯入／URL／預覽</text>
  <text class="dg-sub" x="356" y="192" text-anchor="middle" dominant-baseline="central">繞過 CSP、藏指令</text>

  <rect class="dg-box" x="256" y="256" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="280" text-anchor="middle" dominant-baseline="central">輸出結果 schema 驗證</text>
  <text class="dg-sub" x="356" y="300" text-anchor="middle" dominant-baseline="central">惡意 regex 卡死介面</text>

  <rect class="dg-box" x="496" y="148" width="160" height="64" rx="6"/>
  <text class="dg-label" x="576" y="172" text-anchor="middle" dominant-baseline="central">開發者本機環境</text>
  <text class="dg-sub" x="576" y="192" text-anchor="middle" dominant-baseline="central">瀏覽器與本機行程</text>
</svg>
```

## 防禦做法

**立即動作**
- 升級 `@modelcontextprotocol/inspector` 到 ≥ 2.14.0：`npx @modelcontextprotocol/inspector@latest`；還在用已停止維護的 v1 系列者，至少升到 `1.0.4`（但 v1 只回溯修了 ReDoS 一項，另外兩項沒有修補，應盡快改用 v2）
- 不要只看終端機剛裝的版本號就相信全隊都升級了：用 `npm ls @modelcontextprotocol/inspector --depth=0`、`npm ls -g @modelcontextprotocol/inspector --depth=0` 或 `mcp-inspector --version` 對著「實際啟動這個服務的那個 process／container」檢查，確認舊的 Inspector 行程已經重啟或重建，瀏覽器也重新整理過
- 升級前，先盤點近期用 Inspector 連過哪些不完全受你控制的 MCP 伺服器（別人分享的範例伺服器、還沒稽核完的第三方套件、公開 registry 試裝的 server.json）；若曾經連過，依公告建議檢視當時 Apps 分頁渲染了什麼內容、匯入或啟動過什麼套件，必要時輪換那次 session 可能碰過的憑證

**長期架構**
- 把「拿 Inspector 去探測一個還不信任的 MCP 伺服器」這個開發流程本身當成有風險的操作來設計：優先在拋棄式容器或無本機掛載、無正式憑證的環境裡做，而不是直接在裝了正式金鑰的開發機上連
- 把 `server.json` 匯入當成跟「裝一個新的 npm 套件」同等級的供應鏈風險來稽核——先用 Snyk（前 Invariant Labs）的 Agent Scan 或 Netzilo 的 MCP server runtime governance 等工具建立允許清單、掃描伺服器實際行為，而不是只看審查介面顯示的套件名稱，這次 GHSA-rwv7 正好證明畫面顯示的名稱可以跟實際執行的指令脫鉤
- 替任何需要解析第三方 URL、HTML 或正規表達式的用戶端程式碼補上持續回歸測試，而不是修一次就假設守住了——Penligent 的分析文裡列出的沙箱導覽 smoke test、pattern-validator 測試就是可以直接參考的範本

## 影響範圍

受影響的是所有在 2.0.0–2.13.0 版本區間使用 `@modelcontextprotocol/inspector`（或舊版 v1 到 1.0.3）的開發者與團隊。因為 Inspector 是 MCP 生態公認的標準除錯與測試工具，幾乎所有在開發或稽核 MCP 伺服器的人手上都裝過它，潛在安裝基數相當大；但實際「中獎」的只有那些真的把 Inspector 接到惡意或已失陷伺服器、並與之互動（渲染 App、匯入 server.json、開啟 elicitation URL、呼叫工具）過的 session。三個漏洞都是研究者私下回報、走 GHSA 私有 fork 修補流程後才公開，目前沒有證據顯示已被用於真實攻擊；但 PoC 已經完整寫在公告裡，技術門檻不高——尤其是 URL elicitation 那一項，一旦被包進一個包裝成正常工具的 MCP 伺服器，就可能在開發者毫無察覺的情況下取得 Inspector 瀏覽器來源的 cookie 與 session。升級本身成本很低，一行 `npx` 指令就能拿到新版，沒有理由拖。

## 今日收穫

這次事件提醒我，MCP 生態討論安全時常把威脅模型想反：大家談的多半是「惡意用戶端騷擾伺服器」或「惡意伺服器騷擾被接上的 agent」，卻很少把「開發者拿去測試伺服器的工具本身」算進攻擊面——但 Inspector 存在的目的，正是讓人在還不信任一個伺服器時先摸它一下，這意味著它連到的每一個伺服器，定義上都該被當成可能是惡意的。這次三個漏洞剛好證明，連官方維護、被當成「安全基準線」的除錯工具，也不是每一條輸入路徑都照著這個假設去驗證；審查畫面顯示的東西和實際執行的東西可以脫鉤，這點在任何需要人工審查後再放行的工具（不只 MCP）都值得單獨拉出來檢查。

## 參考資料

- [modelcontextprotocol/inspector — Release 2.14.0](https://github.com/modelcontextprotocol/inspector/releases/tag/2.14.0)
- [GHSA-h9j8-vj8g-v3gg — App 沙箱 iframe 可被導覽逃逸](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-h9j8-vj8g-v3gg)
- [GHSA-rwv7-mh2c-ff2p — server.json 匯入、URL elicitation、HTML 預覽 CSP 注入](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-rwv7-mh2c-ff2p)
- [GHSA-2fw8-7jmw-r937 — 工具輸出 schema 驗證 ReDoS](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-2fw8-7jmw-r937)
- [Penligent — MCP Inspector 2.14.0: Security Fixes and Version Checks](https://www.penligent.ai/hackinglabs/mcp-inspector-security-update/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
