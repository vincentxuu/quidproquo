---
title: "資安警報｜「Protocol Pivoting」跨協定攻擊——同一個 SSRF 漏洞同時出現在 Google、JPMorgan、法國政府的 MCP Server，美國聯邦系統仍未修"
date: 2026-10-07
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "獨立研究者 Syed Anas Mohiuddin 花五個月在 Google、JPMorgan Chase、法國 DINUM、Weaviate、印尼坦格朗市政府的 MCP server 中發現同一種結構性 SSRF 漏洞，並提出跨協定攻擊手法「Protocol Pivoting」；美國聯邦系統（包含退伍軍人福利系統）六週後仍未修補。"
tldr: "研究者 Mohiuddin 證明 MCP server 常見的 SSRF 漏洞不是單點失誤，而是協定本身缺乏規範性安全要求造成的結構性問題——五個互不相關的組織（Google、JPMorgan、法國政府、Weaviate、印尼坦格朗市）各自獨立犯了同一個錯。他把跨協定（MCP → A2A）傳遞惡意指令的攻擊手法稱為「Protocol Pivoting」。Google 的漏洞（CVE-2026-14540，CVSS 8.0）已修，但美國 GSA 旗下五個聯邦系統（包括退伍軍人福利申請系統）9 月 2 日通報至今仍未修補，其中一個會把退伍軍人的姓名、社會安全號碼、生日寫進未遮罩的錯誤日誌。防禦：稽核所有接受 agent 傳入 URL/路徑參數的 MCP tool，加白名單與目的地 IP 驗證，並把跨 agent 傳入的內容一律當作不可信輸入。"
series:
  name: "AI Security Alert"
  order: 48
---

> 🌏 [English version](/posts/daily/2026-10-07-security-mcp-protocol-pivoting-ssrf-en)

## 事件概述

獨立資安研究者 Syed Anas Mohiuddin（Chicago，AI 自動化工作室 Cognivators 創辦人）花五個月時間測試一個假設：如果 MCP（Model Context Protocol）server 裡常見的 SSRF（Server-Side Request Forgery）漏洞是協定本身的結構性問題，而不是單一團隊的失誤，那麼完全不相干的組織應該會各自獨立重蹈同一個錯。結果他在 Google、JPMorgan Chase、法國政府跨部門數位局 DINUM、向量資料庫公司 Weaviate、印尼坦格朗市政府的 MCP server 中都找到了同一類漏洞，五個組織都已確認並修補。他把跨協定（例如從 MCP 跳到 Google 的 Agent-to-Agent／A2A 協定）傳遞惡意指令、escalate 到另一個協定才能用的能力的攻擊手法稱為「Protocol Pivoting」。更嚴重的是：他 9 月 2 日通報的五個美國聯邦系統（含退伍軍人事務部福利申請 server）六週後仍未修補。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 跨協定攻擊（Protocol Pivoting）／MCP Server SSRF |
| 影響範圍 | Google `mcp-toolbox`、JPMorgan `jpmorgan-payments/ai`、法國 `datagouv-mcp`、Weaviate、印尼坦格朗 `Wazuh-MCP-Server`；美國 GSA 五個聯邦 MCP server（VA 福利、CMS Blue Button、regulations.gov、USASpending、CDC PLACES）未修 |
| 嚴重程度 | High（Google CVSS 8.0；美國聯邦系統含未遮罩 PII，風險更高） |
| CVE | CVE-2026-14540（Google mcp-toolbox，GHSA-3x3x-8ffg-ghcv）、CVE-2026-97228（Rapid7 Bulk Export MCP，CVSS 2.7） |
| 來源 | [Ars Technica](https://arstechnica.com/security/2026/10/vulnerability-in-agents-from-google-and-others-exposes-structural-flaw-in-mcp/)、[Unite.AI](https://www.unite.ai/researcher-discloses-same-mcp-flaw-at-google-jpmorgan-two-governments/)、[Tech Times](https://www.techtimes.com/articles/328621/20261006/six-weeks-after-google-jpmorgan-patched-mcp-flaw-us-servers-stay-exposed.htm) |

## 攻擊面分析

Mohiuddin 的 PoC 利用 MCP 的兩個設計假設：一是 MCP server 常常把 agent 傳入的 URL 或路徑參數直接拿去發出對外請求，卻不驗證目的地實際解析到哪裡；二是多 agent 架構裡，內網的每個 agent 被預設互相信任。在 Google 的 `mcp-toolbox`（給資料庫用的 MCP server）裡，Go 的 HTTP client 完全沒設 `CheckRedirect` 政策，也沒驗證目的地 IP——一個精心構造的路徑參數可以讓 toolbox 跟著 redirect 連去內部服務，甚至雲端 metadata endpoint（如 AWS/GCP/Azure 的 `169.254.169.254`，會吐出 IAM 憑證）。JPMorgan、法國 DINUM、印尼坦格朗的案例模式幾乎一致：工具函式接受呼叫端傳入的 URL，伺服器端直接 fetch，沒有 IP allowlist、沒有在連線當下重新解析位址，因此也擋不住 DNS rebinding（檢查時解析到允許的位址，連線時又變成內網位址）。

「Protocol Pivoting」指的是更進一步的跨協定升級：當系統同時用 MCP 做工具呼叫、用 A2A（Agent-to-Agent）做 agent 間委派時，攻擊者可以把偽裝成 A2A 任務指令的文字藏進 MCP tool 回傳的內容裡——例如一份要求翻譯的文件、一筆要求分析的資料。負責協調的主 agent 把這段內容當成一般委派工作轉給下游的子 agent，子 agent 因為「信任上游的主 agent」而直接執行，整條鏈路上每一個節點都做了它被設計要做的事，卻沒有人在檢查「跳協定」這個縫隫。Rapid7 的 Douglas McKee 對 Ars Technica 形容:「每個協定被設計時都只顧自己的前門，沒人盯著協定之間的走廊」。X41 D-Sec 的 Markus Vervier 則認為這本質上仍是 indirect prompt injection 的一種特例——惡意指令就是從別的協定、以別的管道偷渡進來的內容。

對應 OWASP LLM Top 10：**LLM01 Prompt Injection**（跨協定／indirect，MCP → A2A 的委派鏈被偷渡惡意指令）+ **LLM07 Insecure Plugin Design**（MCP tool 未驗證輸出目的地，造成經典 SSRF）；美國聯邦系統把上游 API 完整錯誤內容寫進未遮罩日誌，則額外踩到 **LLM06 Sensitive Information Disclosure**。

## 防禦做法

**立即動作**
- 稽核所有 MCP server 裡「接受 agent 傳入 URL／路徑／endpoint 參數」的 tool，確認是否驗證了解析後的目的地 IP（不是只驗證輸入字串）
- 對外呼叫設 IP allowlist／blocklist，並在**連線當下**（不是請求建立時）重新檢查位址，避免 DNS rebinding 在檢查與連線之間的窗口期被利用
- 檢查多 agent 架構裡的委派鏈：任何經由 MCP 或 A2A 傳進來、要求下游 agent 執行動作的內容，一律當成不可信輸入處理，不因為「是內網其他 agent 傳的」就預設信任
- 用 Mohiuddin 開源的 [mcp-safeguard](https://github.com/SyedAnas01/mcp-safeguard) 掃描現有 MCP server 的 SSRF、過度授權、prompt injection 曝險面、資訊洩漏、認證缺口、生命週期繞過六大類風險

**長期架構**
- 把「跨協定委派」納入威脅模型：MCP 負責工具呼叫、A2A 負責 agent 間委派時，兩者的信任邊界必須分開評估，不能假設過了 MCP 驗證的內容在 A2A 那端也安全
- 每個 agent 配獨立憑證（per-agent credential scoping），不要讓一個部署裡所有 agent 共用同一組憑證池，降低單點被攻陷後的擴散半徑
- 參考 watchlist 中 **Invariant Labs** 的 MCP server 掃描／runtime 防護思路，把 tool-poisoning 與跨協定委派偵測做進 CI 或 runtime gateway，而不是只做靜態程式碼掃描（因為惡意輸入是跑在傳輸層的 tool 參數裡，SCA／依賴掃描工具的 call graph 根本看不到）
- 推動 MCP 規格本身補上規範性安全要求——目前的協定規格不強制驗證目的地位址、不強制憑證範圍隔離，這正是五個互不相關組織各自獨立犯下同一個錯的根因

## 影響範圍

目前已確認修補的五個組織（Google、JPMorgan、法國 DINUM、Weaviate、印尼坦格朗市）涵蓋科技巨頭、金融機構、國家級政府平台與地方政府，證明這不是單一產業或單一程式語言的問題。更需要關注的是仍未修補的部分：Mohiuddin 9 月 2 日以私密 GitHub Security Advisory 通報美國 GSA 旗下五個聯邦 MCP server（退伍軍人事務部福利申請系統、CMS Blue Button 醫療保險 API、regulations.gov、USASpending、CDC PLACES），截至 10 月 6 日六週過去，五個都還在 triage、沒有修補時程。其中退伍軍人福利系統的風險特別具體：伺服器把上游福利 API 的完整錯誤回應寫進 ERROR 等級日誌、沒有遮罩任何欄位，而這些回應可能包含退伍軍人的姓名、社會安全號碼、生日與地址——**只要正常使用過程中發生一次驗證失敗就會觸發，不需要真的被攻擊**。如果你的 Agent 系統有任何 MCP server 會把 agent 傳入的 URL 或路徑參數直接拿去發對外請求，這個攻擊面現在就是開放的，而且修補五個已知案例並不會讓協定本身的信任假設消失——下一個用同樣方式串接 MCP 的新專案，一樣會從零開始繼承同樣的漏洞模式。

## 今日收穫

過去看 MCP 安全討論大多聚焦在「單一 agent 被 prompt injection 騙去執行惡意工具」，但這次事件讓我意識到更麻煩的是**協定之間的信任落差**：MCP 處理工具呼叫、A2A 處理 agent 委派，兩個協定各自做好自己的安全檢查，問題出在沒有人檢查「從 MCP 跳到 A2A」這個縫隙本身。而五個互不相關組織各自獨立犯下同一個 SSRF 錯誤，比起「某家公司的程式碼寫錯」更值得警惕——這代表只要還在用同樣缺乏規範性安全要求的協定規格，新專案會從零開始繼承同樣的漏洞模式，修補個案永遠追不上協定本身的結構性缺口。

## 參考資料

- [Ars Technica — Vulnerability in agents from Google and others exposes structural flaw in MCP](https://arstechnica.com/security/2026/10/vulnerability-in-agents-from-google-and-others-exposes-structural-flaw-in-mcp/)
- [Unite.AI — Researcher Discloses Same MCP Flaw at Google, JPMorgan, Two Governments](https://www.unite.ai/researcher-discloses-same-mcp-flaw-at-google-jpmorgan-two-governments/)
- [Tech Times — Six Weeks After Google and JPMorgan Patched MCP Flaw, US Servers Stay Exposed](https://www.techtimes.com/articles/328621/20261006/six-weeks-after-google-jpmorgan-patched-mcp-flaw-us-servers-stay-exposed.htm)
- [GitHub Advisory GHSA-3x3x-8ffg-ghcv（Google mcp-toolbox SSRF，CVE-2026-14540）](https://github.com/advisories/GHSA-3x3x-8ffg-ghcv)
- [Rapid7 CVE-2026-97228（Bulk Export MCP GraphQL injection）](https://www.rapid7.com/db/vulnerabilities/cve-2026-97228/)
- [Syed Anas Mohiuddin — Protocol Pivoting, four months later（研究更新原文）](https://anas-security-portfolio.vercel.app/protocol-pivoting-update.html)
- [mcp-safeguard（開源 MCP 安全掃描工具）](https://github.com/SyedAnas01/mcp-safeguard)
