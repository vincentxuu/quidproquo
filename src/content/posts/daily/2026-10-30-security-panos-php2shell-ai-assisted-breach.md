---
title: "資安警報｜PHP2Shell 串 Fragnesia 攻破 25 台 PAN-OS 防火牆——攻擊鏈本身用 AI 輔助開發，美國政府機構遭入侵"
date: 2026-10-30
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "安全公司 Dream 查到一起疑似中國關聯的攻擊行動，把兩組已知漏洞（PHP2Shell、Fragnesia）串成單次 HTTP 請求的無密碼 root 利用，攻破 25 台 PAN-OS 防火牆，三台屬美國政府機構環境；現場留下的 Claude Code 安裝痕跡與一套接 DeepSeek／Kimi 的攻擊平台，顯示攻擊鏈本身是用 AI 輔助開發出來的。"
tldr: "Dream 研究團隊 10/25 發現一起攻擊行動：把 PHP2Shell（CVE-2026-109618／109619）和 Linux kernel 的 Fragnesia（CVE-2026-46300）串成一次不需帳密的 HTTP 請求，15 分鐘內拿到 PAN-OS 防火牆的 root，全球掃到 25 台中招，3 台屬美國政府機構環境並往內網 Active Directory 打。現場的 Claude Code 安裝記錄、接 DeepSeek／Kimi 的 aiscan 攻擊平台、近 40 支腳本一致的程式風格，指向攻擊鏈開發過程本身用了 AI 輔助。Palo Alto Networks Unit 42 已獨立驗證並發布各分支修補版本，立即動作是把管理介面下線到信任網路，確認版本後跟著修補時程更新。"
series:
  name: "AI Security Alert"
  order: 67
---

> 🌏 [English version](/posts/daily/2026-10-30-security-panos-php2shell-ai-assisted-breach-en)

## 事件概述

安全公司 Dream 的研究團隊 10 月 25 日公開一份調查：他們在主動威脅狩獵中找到一起疑似中國關聯的攻擊行動留下的完整痕跡，包含攻擊腳本、目標清單、利用紀錄與約 40 支客製化後滲透腳本。攻擊者把兩組已知漏洞——PHP 的 PHP2Shell（CVE-2026-109618／CVE-2026-109619）和 Linux kernel 的 Fragnesia（CVE-2026-46300）——串成單一次不需帳密的 HTTPS 請求，對外曝露管理介面的 PAN-OS 防火牆可在 15 分鐘內被拿到 root。全球掃描後鎖定美、日、台、韓四地，共攻破 25 台伺服器，其中 3 台屬美國政府機構環境，攻擊者進一步往內網 Active Directory 發動攻擊，嘗試解密服務帳密並噴密碼。現場留下的 Claude Code 安裝紀錄、一套接了中國大型語言模型 DeepSeek 與 Kimi 的攻擊平台「aiscan」、以及近 40 支腳本高度一致的程式風格，顯示這條攻擊鏈的開發過程本身用了 AI 輔助。Palo Alto Networks 的 Unit 42 已獨立驗證 Dream 的發現並確認受影響產品，正在發布各分支的修補版本。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | PHP 記憶體毀損 RCE ＋ Linux kernel 權限提升鏈，攻擊鏈開發疑似借助 AI 工具 |
| 影響範圍 | 所有受支援的 PAN-OS（10.2／11.1／11.2／12.1／12.2）與 Panorama 版本的管理介面；已確認 25 台遭攻破，19,000 台對外曝露管理介面的目標已被攻擊者掃描建檔 |
| 嚴重程度 | Critical（CVE-2026-109618／109619 CVSS 9.2；CVE-2026-46300 CVSS 7.8） |
| CVE | CVE-2026-109618、CVE-2026-109619（PHP2Shell）、CVE-2026-46300（Fragnesia，Linux kernel XFRM ESP-in-TCP） |
| 來源 | [Dream Research 調查報告](https://dreamgroup.com/blog/chained-php2shell-exploit-roots-25-servers)、[The Hacker News](https://thehackernews.com/2026/10/php2shell-attack-roots-25-servers.html)、[Palo Alto Networks Unit 42 威脅說明](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/)、[Palo Alto Networks 官方公告 CVE-2026-109618](https://security.paloaltonetworks.com/CVE-2026-109618) |

## 攻擊面分析

攻擊鏈本身分兩段。第一段 PHP2Shell 利用的是 PHP 處理記憶體不足（OOM）錯誤時 `longjmp()` 的控制流缺陷：攻擊者先用帶超大檔名的 multipart POST 把 PAN-OS 管理網頁伺服器（appweb，跑 PHP 8.0.30）的記憶體配置器灌到接近極限，逼出一個可預期的記憶體佈局，再用第二個請求偽造過期的 session ID 長度製造越界讀取，從回應的 `Set-Cookie` header 洩漏 `libphp.so` 的基底位址；接著重複一次記憶體壓力，讓 `http_session_vars` 變成活的 `zend_reference` 並製造一個懸空參照，最後一個請求在這塊已釋放的記憶體裡偽造一個 PHP HashTable entry，把它的解構子（`pDestructor`）指向 `zif_system`，PHP 清理時呼叫這個偽造的解構子，等於用 `nobody` 權限執行任意指令。第二段 Fragnesia 利用 Linux kernel 的 XFRM ESP-in-TCP 子系統做 page-cache 寫入，把只有 774 bytes 的 `/etc/pam.d/su` 內容改寫成 `pam_permit.so`（全部放行），之後 `su root` 不需密碼就會成功。兩段利用合併在同一個 HTTP 請求裡執行，從未認證連線到拿到持久 root webshell 全程不到 15 分鐘。

攻擊者投入的工程量不小：recovered 的 artifacts 裡有 11 份針對不同 PAN-OS 版本校準的記憶體位移檔（含 `libphp.so` 的 SHA256、ELF build ID、heap 噴灌參數），9 個版本可用、1 個已在真實 VM 上完整驗證。掃描階段用中國的網路資產搜尋引擎 FOFA 找出約 19,000 台對外曝露管理介面的防火牆，版本指紋比對後篩到 5,000 台存活、依地緣與版本進一步篩到 240 台目標，自動化批次工具五台併發攻擊、每台 30 分鐘逾時，第一輪就攻破 24 台，其中兩台的設定檔顯示屬於美國政府機構（CAC 憑證驗證、政府風格命名規則），攻擊者專門為第二台另開一輪攻擊，拿下後架設一條跨開機存活的反向 SSH 通道回內網，再用同一條漏洞鏈往內打中央防火牆管理伺服器，從那裡解密 LDAP 服務帳密、列舉整個網域使用者，並利用網域沒設帳號鎖定門檻（`lockoutThreshold=0`）對所有帳號噴密碼、嘗試建立後門帳號。

真正值得記下來的是攻擊鏈「怎麼被做出來的」：現場留有 Claude Code 的安裝紀錄、一套名為 aiscan 的 AI 攻擊平台設定接了中國的 DeepSeek 與 Kimi 模型、以及中國偵察平台 FOFA 的 API 金鑰；aiscan 的 session log 裡還留有中文提示詞。Dream 明確說沒有直接證據證明這些 AI 工具被用來寫 exploit 或後滲透腳本本身，但近 40 支腳本的程式結構、註解風格高度一致，指向開發過程有 AI 輔助，而非每支腳本手工獨立寫成。對應 OWASP LLM Top 10：這起事件嚴格說不是攻擊 AI 系統，而是**AI 被當成攻擊工具鏈的一部分**——這正是近期資安界談的「living off the AI land」：攻擊者不需要繞過模型的安全護欄，只要把 AI 編碼助理當成提升攻擊開發效率的工具,用在傳統基礎設施漏洞利用上。

```diagram
title: PHP2Shell ＋ Fragnesia 攻擊鏈
desc: 單次 HTTP 請求內完成 RCE 與 kernel 權限提升，再透過反向通道打進內網 Active Directory
---
<svg viewBox="0 0 640 460">
  <path class="dg-line" d="M320 76V100" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 156V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 236V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M320 316V340" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--accent" d="M320 396V420" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="120" y="20" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="39" text-anchor="middle" dominant-baseline="central">A1 記憶體灌爆（~383MB）＋ B1 洩漏 libphp.so 位址</text>
  <text class="dg-sub" x="320" y="59" text-anchor="middle" dominant-baseline="central">PHP2Shell 第一階段</text>

  <rect class="dg-box" x="120" y="100" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="128" text-anchor="middle" dominant-baseline="central">A2 製造懸空參照 ＋ B2 偽造 HashTable 解構子</text>

  <rect class="dg-box dg-box--warn" x="120" y="180" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="199" text-anchor="middle" dominant-baseline="central">取得 nobody 權限任意指令執行</text>
  <text class="dg-sub" x="320" y="219" text-anchor="middle" dominant-baseline="central">同一個 HTTP 請求內完成</text>

  <rect class="dg-box" x="120" y="260" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="288" text-anchor="middle" dominant-baseline="central">Fragnesia：page-cache 改寫 /etc/pam.d/su</text>

  <rect class="dg-box dg-box--warn" x="120" y="340" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="368" text-anchor="middle" dominant-baseline="central">su root 免密碼成功，15 分鐘內拿到持久 root webshell</text>

  <rect class="dg-box" x="120" y="420" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="439" text-anchor="middle" dominant-baseline="central">反向 SSH 通道回內網 → 打中央管理伺服器 → 解密 LDAP 服務帳密</text>
</svg>
```

## 防禦做法

**立即動作**
- 確認防火牆管理介面（appweb／GlobalProtect portal 前端）**完全不對外曝露**——只能從信任內部網路或單一跳板機存取，這是 Dream 和 Palo Alto 兩邊都強調的第一道防線
- 用 `show system info` 檢查目前 PAN-OS／Panorama 版本，對照官方公告 [CVE-2026-109618](https://security.paloaltonetworks.com/CVE-2026-109618) 列出的各分支修補時程，修補版本一出立刻安排更新（部分分支已釋出，部分 ETA 落在本週內）
- 若短期內無法立即修補，啟用 TLS 流量解密讓既有偵測規則能看到走管理介面的流量，並比對 Unit 42 公開的 hunting query（PHP worker 衍生出的可疑 process 鏈、憑證存取、reverse shell 特徵）
- 若懷疑已暴露，不要只看防火牆本身：同時檢查 Active Directory 的 LDAP 服務帳密是否需要輪換、帳號鎖定門檻是否設成 0（這起事件裡網域沒鎖定門檻讓噴密碼攻擊可以無限次嘗試）

**長期架構**
- 管理介面類服務一律預設不對外，上線前走資產清查流程確認沒有意外曝露——這起事件裡攻擊者光是 FOFA 一次掃描就找到 19,000 台曝露目標，單一廠商的單一產品線就是這麼大的攻擊面
- 網域層級把 `lockoutThreshold` 設為非 0，並定期稽核 `MachineAccountQuota` 這類預設值寬鬆的設定，避免權限提升後的噴密碼／建後門帳號一路暢通
- 留意企業內部 AI 編碼工具（如 Claude Code）、AI 攻擊平台類工具的異常安裝與呼叫模式本身也可能是入侵指標；若已部署 WitnessAI 這類做 enterprise agent 流量可見性的工具，可將「非預期環境中出現 AI coding agent 安裝」納入告警規則，而不只是看傳統 IOC
- 這起事件再次證明「漏洞公開到被武器化」的視窗正在壓縮——PHP 修復版本 10/21 才發布，10/23 就觀測到攻擊者已在實戰中使用客製化 exploit；修補流程要能跟上這個速度，而不是按月排程

## 影響範圍

目前確認 25 台 PAN-OS 相關伺服器遭攻破，其中 22 台防火牆被植入 webshell 後維持「停泊」狀態（沒有進一步動作，但 webshell 仍在），另外 3 台屬美國政府機構環境，攻擊者已打進內網並對 Active Directory 發動攻擊——是否成功噴到有效密碼、是否成功建立後門帳號、是否成功從 Keycloak 取出 SAML 簽章金鑰，Dream 表示現有的 artifacts 無法判定，代表實際入侵範圍可能比目前確認的更深。攻擊者手上還有 19,000 台已建檔的潛在目標、以及持續在運作的反向通道，Palo Alto Networks 的裝置回傳資料顯示對外曝露的 PAN-OS 裝置仍持續遭受利用嘗試。這起事件對 Agent 系統維運者的意義是雙重的：一方面是提醒傳統基礎設施（防火牆管理介面）仍是國家級攻擊者的主要入口，修補紀律不能因為焦點都在 AI 應用層而鬆懈；另一方面是 AI 編碼工具被攻擊者拿去加速漏洞利用鏈開發這件事本身會越來越常見，資安團隊評估攻擊者能力時，該把「對方有沒有用 AI 輔助開發」當成提升攻擊速度與規模的變數,而不是單純的技術八卦。

## 今日收穫

一直以為「AI 資安事件」主要分兩類——AI 系統被攻擊（prompt injection、MCP 漏洞）、或 AI 系統被拿來做惡意的事（agentic ransomware）。這起事件是第三種：AI 被用在「開發傳統漏洞利用鏈」這個很枯燥、很工程化的環節上，讓單一攻擊者能在短時間內針對 9 個不同版本校準出可靠的記憶體利用鏈，還能寫出近 40 支風格一致的後滲透腳本。這提醒我評估威脅時不能只看「攻擊目標是不是 AI」，攻擊者的開發效率本身被 AI 放大，也該算進風險模型裡。

## 參考資料

- [Dream Research — Chained PHP2Shell Exploit Roots 25 Servers, including US Government Servers](https://dreamgroup.com/blog/chained-php2shell-exploit-roots-25-servers)
- [The Hacker News — PHP2Shell Attack Roots 25 Servers, Breaches U.S. Government-Affiliated Network](https://thehackernews.com/2026/10/php2shell-attack-roots-25-servers.html)
- [Palo Alto Networks Unit 42 — Threat Brief: Critical Vulnerabilities in PHP: CVE-2026-109618, CVE-2026-109619](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/)
- [Palo Alto Networks 官方公告 — CVE-2026-109618 Impact of Critical Vulnerabilities in PHP on Palo Alto Networks Products](https://security.paloaltonetworks.com/CVE-2026-109618)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
