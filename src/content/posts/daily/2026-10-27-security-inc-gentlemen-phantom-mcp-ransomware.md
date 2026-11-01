---
title: "資安警報｜INC／Gentlemen 勒索軟體曝光 AI 共同操作全紀錄——8,257 則訊息、32 個 MCP 伺服器、62 家受害組織"
date: 2026-10-27
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "SOCRadar 揪出 7 台曝露的 C2 伺服器，完整還原 INC／Gentlemen 勒索軟體共同使用的 AI 操作基礎設施：OpenCode + 32 個 MCP 伺服器的 Phantom 框架，橫跨偵察、入侵、勒索全流程，受害組織達 62 家。"
tldr: "SOCRadar 10/20 發布報告，揭露 INC 與 Gentlemen 兩個勒索軟體集團的共用操作者因 OPSEC 失誤曝露 7 台伺服器，裡面是 8,257 則 AI 對話紀錄（133 個 OpenCode session）、自製的 Phantom 自動化紅隊框架（32 個 MCP 伺服器串接工具）、46 支已打包的 INC 加密器，以及 62 家受害組織的完整案件檔案。攻擊者靠 FortiClient EMS（CVE-2026-35616）、SimpleHelp（CVE-2024-57727）、cPanel（CVE-2026-41940）等邊緣裝置漏洞大規模取得入口，再讓 AI 在「人核准每一步」的前提下規劃偵察、產生指令、整理竊得資料、撰寫勒索信。防禦：稽核任何對外暴露的 EMS／RMM／VPN 管理介面，並把「MCP exec_in_session 之類的工具執行介面」當成需要存取控制與稽核紀錄的高風險通道，不是單純的開發輔助功能。"
series:
  name: "AI Security Alert"
  order: 64
---

> 🌏 [English version](/posts/daily/2026-10-27-security-inc-gentlemen-phantom-mcp-ransomware-en)

## 事件概述

威脅情資公司 SOCRadar 的 Threat Research Unit（STRU）在 2026 年 10 月 20 日發布報告，說明他們如何透過一台公開目錄曝露的命令控制伺服器（`45.227.254[.]43`），一路追出另外 6 台伺服器，完整還原了 **INC Ransomware** 與 **The Gentlemen Ransomware** 兩個集團的共用操作者如何用 AI 跑完整個入侵流程。曝露的內容包括 8,257 則橫跨 133 個 OpenCode session 的 AI 對話紀錄、一套名為 Phantom 的自製「自主紅隊攻擊鏈框架」（原始碼與執行檔都在）、串接 32 個 MCP 伺服器的工具庫、46 支已針對 6 家受害者客製化打包的 INC 加密器，以及 62 家受害組織的完整案件檔案。這是目前為止對「AI 代理在真實勒索軟體行動中實際怎麼被操作」最詳細的一次公開還原，而且證據量遠遠超過單一事件的推測——攻擊者自己留下的 AI 使用記憶體，變成了讓防守方還原整條攻擊鏈的鐵證。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI 代理被用於勒索軟體全鏈路操作（偵察→入侵→橫向移動→勒索，經 MCP 工具串接） |
| 影響範圍 | 62 家命名受害組織（36 家在美國），工業製造／能源（16.1%）與醫療／製藥（14.5%）佔比最高；入口集中在 FortiClient EMS、SimpleHelp、cPanel 等邊緣裝置 |
| 嚴重程度 | Critical |
| CVE | CVE-2026-35616（FortiClient EMS 身分驗證繞過）、CVE-2024-57727（SimpleHelp 路徑穿越）、CVE-2026-41940（cPanel/WHM 身分驗證繞過） |
| 來源 | [SOCRadar 原報告](https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/), [hackread.com](https://hackread.com/inc-the-gentlemen-ransomware-affiliates-ai-messages/) |

## 攻擊面分析

```diagram
title: SOCRadar 揭露的 INC／Gentlemen AI 共同操作時間線
desc: 從伺服器 OPSEC 失誤曝光，到加密器實際落地，再到完整報告公開，橫跨 25 天。
caption: 時間以 2026-09-25（曝露被 STRU 發現）為 T+0；報告另指出相關 Ghost C2 植入活動最早可追溯到 2026 年 7 月中，早於本圖比例尺範圍，未按比例標點。
---
<svg viewBox="0 0 640 220">
  <path class="dg-axis" d="M40 124H600"/>
  <path class="dg-axis" d="M64 124V130M234 124V130M404 124V130"/>
  <text class="dg-small" x="64" y="144" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="234" y="144" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="404" y="144" text-anchor="middle" dominant-baseline="central">20</text>
  <text class="dg-small" x="618" y="124" dominant-baseline="central">天</text>

  <g>
    <line class="dg-rule" x1="64" y1="76" x2="64" y2="118"/>
    <circle class="dg-dot" cx="64" cy="124" r="4"/>
    <text class="dg-label" x="64" y="40" text-anchor="middle" dominant-baseline="central">OPSEC 失誤曝光</text>
    <text class="dg-sub" x="64" y="62" text-anchor="middle" dominant-baseline="central">09-25・7 台伺服器全露</text>
  </g>
  <g>
    <line class="dg-rule" x1="158" y1="130" x2="158" y2="172"/>
    <circle class="dg-dot" cx="158" cy="124" r="4"/>
    <text class="dg-label" x="158" y="186" text-anchor="middle" dominant-baseline="central">加密器打包＋已有實況</text>
    <text class="dg-sub" x="158" y="208" text-anchor="middle" dominant-baseline="central">09-30/10-01・46 支 INC 建置</text>
  </g>
  <g>
    <line class="dg-rule" x1="489" y1="76" x2="489" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="489" cy="124" r="6"/>
    <text class="dg-label" x="489" y="40" text-anchor="middle" dominant-baseline="central">SOCRadar 公開報告</text>
    <text class="dg-sub" x="489" y="62" text-anchor="middle" dominant-baseline="central">10-20・62 家受害組織曝光</text>
  </g>
</svg>
```

這次曝露的運作方式分成三層，值得拆開來看。

**第一層是入口**：操作者沒有用任何新奇手法，就是大規模打邊緣裝置的已知漏洞。知識庫裡的記錄顯示，他們對 FortiClient EMS（CVE-2026-35616）掃了 2,236 個目標、建立 108 個管理員帳號、接觸 4,140 台受管端點；對 SimpleHelp（CVE-2024-57727）掃了 4,922 台伺服器、挖出 427 組管理員密碼，影響 242 個不同 IP；對 cPanel/WHM（CVE-2026-41940）宣稱入侵 49 家以上的小型主機業者，再拿這些業者當跳板打進它們代管的信箱與網頁伺服器。這些數字是攻擊者自己記錄的，SOCRadar 特別註明「未經獨立驗證」，但光是規模就足以說明「邊緣裝置」仍是最便宜的入口。

**第二層是 AI 怎麼被接進整條鏈**：操作者用 OpenCode（一套 AI coding 介面）當操作主控台，串接 OpenRouter 上的商用模型（Claude Opus 4.6、Kimi K3，不是什麼地下模型），外加一個自製的「WormGPT」角色提示和一套持久知識庫。真正把 AI 變成「可以動手」的是 **Phantom**——一個有 18 個技能模組、自己的路由引擎和 autopilot 協調器的模組化框架，透過 32 個 MCP 伺服器把 AI 接到從偵察到勒索談判的每一種工具上，其中還包括一個專門做勒索定價與談判的「ransom-ops」伺服器。報告用「exec_in_session」這個詞來描述這種 MCP 工具執行介面被操作性濫用的狀態——AI 不是在旁邊給建議，而是直接透過 MCP 呼叫去執行偵察指令、分析竊得的憑證、草擬勒索信。

**第三層是為什麼人類還留在迴圈裡**：8,257 則訊息顯示，每個案子開頭都有一份「受害者專屬主提示」，AI 在每一步之前都要等操作者核准，其中一條指令明寫「每個動作都要跟我協調」。更值得注意的是，當商用模型拒絕要求時，操作者的應對不是換成地下模型，而是把請求改寫成「Authorized Red Team Assessment Request」這種授權紅隊評估的模板，靠話術繞過安全護欄，而不是繞過模型本身。這代表「WormGPT」這個名字其實是行銷用的角色提示，底層跑的仍然是一般商用 LLM——護欄繞過的瓶頸不在模型供應商那一端，而在應用層怎麼包裝請求。

對照 OWASP LLM Top 10，這是 **LLM06 Excessive Agency** 的教科書案例：串接 32 個 MCP 伺服器給 AI 的，是遠超過「寫程式碼」需要的能力（直接執行指令、操作滲透工具、起草勒索文件），而「人核准每一步」這道防線在犯罪場景裡恰好反過來變成「免責聲明」——操作者清楚知道自己在做什麼，AI 只是把原本要花人力做的偵察、整理、草稿工作自動化到更快的節奏。這也呼應 2026 年 10 月初 CloudSEK 揭露的「The Gentlemen」另一名附屬 Azazel 把反向殼登記成 AI coding assistant 裡的 MCP 工具、直接驅動攻擊的案例——兩起事件都指向同一個模式：**MCP 的工具執行介面，一旦接上真正有系統存取權的工具，安全邊界就不再是模型的對話護欄，而是誰能註冊工具、工具能做什麼。**

## 防禦做法

**立即動作**
- 稽核任何對外暴露的 FortiClient EMS、SimpleHelp、cPanel/WHM 管理介面：確認已套用 CVE-2026-35616、CVE-2024-57727、CVE-2026-41940 的修補，移除管理介面的直接網路曝露，檢查 EMS 有沒有不明的管理員帳號或被改過的 VPN 連線腳本
- 盤點公司內部有哪些 AI coding assistant（如 OpenCode、Claude Code、Cursor）設定了 MCP 伺服器，逐一確認每個 MCP 工具的實際權限範圍——尤其是任何能執行 shell 指令、開反向連線、存取憑證的工具，不應該在沒有額外存取控制與稽核紀錄的情況下掛上去
- 若有 MSP／RMM 平台（SimpleHelp、MeshCentral、N-central 等）對外服務客戶，強制 MFA、IP allowlist，並要求上游 MSP 本身也套用同等控制——這次事件裡，偷到的 MSP 技師憑證直接等於打開該技師管理的所有客戶
- 備份系統要做到不可變或氣隔（immutable／air-gapped），並隔離、修補 Veeam 一類的備份管理主控台——報告裡攻擊者會優先停掉備份與資料庫服務、刪除陰影複製再動手加密

**長期架構**
- 把「誰能在企業環境裡註冊 MCP 工具、工具有什麼權限」當成正式的治理問題，不是開發團隊自行決定的小事；watchlist 中 Netzilo 的跨平台 agent runtime governance（含 kill switch）這類方案，核心訴求正是「未經核准的 MCP 伺服器不能被接上」
- 對內部 AI 代理的使用模式做行為監控，watchlist 中 Zenity 專注的「企業 Agent 行為監控」方向，目標就是在正常開發使用之外，抓出異常的工具呼叫模式（例如短時間內大量掃描型指令、對外連線的反向殼註冊）
- 這次事件最大的諷刺是「AI 的記憶變成攻擊者自己的證據鏈」——企業防守方也該反過來利用這個特性：若能在合法的 agent 平台上留存完整的工具呼叫紀錄並集中稽核，一旦內部帳號被盜用來跑 agent，異常的 MCP 呼叫模式會比傳統端點紀錄更快被看出來

## 影響範圍

SOCRadar 的分級顯示 62 家命名組織裡，4 家已進入公開勒索（L5）、4 家處於加密或勒索階段（L4）、14 家被攻破到網域層級（L3）、28 家僅有立足點（L2）、12 家還在偵察階段（L1）。46 支已打包的 INC 加密器對應 6 家受害者，原定 2026 年 10 月 1 日部署，聊天紀錄裡有一句「明天莫斯科時間 6 點，對吧？」確認了時程；9 月 30 日的 SimpleHelp 畫面截圖證實至少一家受害者的工作站已經真的被加密，但報告沒有確認全部 6 起是否都成功落地。對任何已經在用 AI coding assistant 搭配 MCP 伺服器做日常開發的團隊，這起事件說明的不是「AI 會自己學壞」，而是「MCP 把 AI 接上有實際破壞力的工具之後，它跟任何其他特權存取一樣，一旦被盜用，殺傷力會跟著工具的權限範圍放大」——而且這個放大倍率，企業內部往往比攻擊者更晚才盤點清楚。

## 今日收穫

過去關於「AI 被用在勒索軟體」的報導大多停留在單一環節的個案（像 10 月初 CloudSEK 揭露的單一附屬者用 MCP 註冊反向殼），這次 SOCRadar 的 8,257 則對話紀錄第一次讓人看到「AI 共同操作」在真實犯罪行動裡長什麼樣子——不是科幻片裡的全自動入侵，而是一個相對保守的操作模式：人核准每一步，AI 負責把偵察、整理、草稿這些本來要花最多人力的環節自動化。最讓我意外的是「WormGPT」只是個角色提示，底層模型全是正常商用 LLM——這代表護欄被繞過的那一刻，問題從來不在模型廠商那一端，而是應用層的請求怎麼被包裝成看起來正當的樣子。這點對任何在幫 agent 接工具權限的團隊都是警訊：護欄不是用來防「惡意模型」，是用來防「惡意請求包裝」，而後者永遠可以換個話術重試。

## 參考資料

- [INC and The Gentlemen Ransomware: Exposed AI Infrastructure - SOCRadar](https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/)
- [INC and The Gentlemen Ransomware Affiliates Expose 8,257 AI Messages - hackread.com](https://hackread.com/inc-the-gentlemen-ransomware-affiliates-ai-messages/)
- [Caught in 4K: The Gentlemen Files - CloudSEK](https://www.cloudsek.com/blog/caught-in-4k-the-gentlemen-files)
- [MITRE ATT&CK G1032 (GOLD IONIC / INC Ransomware)](https://attack.mitre.org/groups/G1032/)
- [SimpleHelp 路徑穿越漏洞 CVE-2024-57727 - NVD](https://nvd.nist.gov/vuln/detail/cve-2024-57727)
- [FortiClient EMS 漏洞 CVE-2026-35616 - NVD](https://nvd.nist.gov/vuln/detail/cve-2026-35616)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk/llm06-excessive-agency/)
