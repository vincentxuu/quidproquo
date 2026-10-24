---
title: "資安警報｜Storm-0940 用 agentic AI 工具 ARTEX 把 ConnectWise 供應鏈攻擊打到機器速度——2,250+ 租戶遭自動登入"
date: 2026-10-24
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "中國國家級攻擊者 Storm-0940 用開源 agentic AI 滲透測試工具 ARTEX，自 2026 年 9 月起自動化攻擊全球數百家組織，並藉此加速入侵 ConnectWise Cloud Backup 應用程式，對 2,250+ 租戶發動機器速度登入，部分組織在 3 小時內就被取得雲端特權存取。"
tldr: "Microsoft 於 2026-10-21 揭露，中國國家級攻擊者 Storm-0940 用開源 agentic AI 滲透測試工具 ARTEX（原於南韓銀行事件後轉為閉源，但程式碼已流出、被多方攻擊者沿用）自 9 月起自動化攻擊橫跨國防、能源、金融等產業的數百個組織；10/10–14 對 8 家組織的 327 個帳號密碼噴灑產生 15.1 萬次失敗登入，10/15 起利用竊得的 ConnectWise Cloud Backup 多租戶 app 憑證，對 2,250+ 租戶以每分鐘 2,900 次嘗試自動登入，部分組織在 3 小時內就被取得雲端特權存取並修改身分與角色做持久化。Wiz 於 10/23 更新指出攻擊已擴散到其他軟體供應商。防禦：稽核並輪換任何曾授權 ConnectWise 應用的憑證、檢查 Entra 服務主體登入與目錄變更紀錄、對多租戶 app 套用最小權限。"
series:
  name: "AI Security Alert"
  order: 62
---

> 🌏 [English version](/posts/daily/2026-10-24-security-storm-0940-artex-connectwise-supply-chain-en)

## 事件概述

Microsoft 於 2026 年 10 月 21 日發布分析，將近期 ConnectWise Cloud Backup 應用程式的供應鏈入侵事件歸因於中國國家級攻擊組織 **Storm-0940**（活躍於 2021 年至今，先前以 Quad7／CovertNetwork-1658 殭屍網路進行密碼噴灑攻擊聞名）。這次事件的關鍵不是新的軟體漏洞，而是攻擊者用開源 agentic AI 滲透測試工具 **ARTEX** 把原本需要人力逐步操作的攻擊流程壓縮到「機器速度」：自 9 月起針對全球數百個組織自動化攻擊，10 月中旬進一步濫用 ConnectWise 多租戶應用程式既有的信任關係，對 2,250 個以上租戶發動每分鐘近 3,000 次的自動登入嘗試，部分組織從被鎖定到取得雲端特權存取只花不到 3 小時。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Agentic AI 工具武器化 + 供應鏈信任濫用（Supply Chain / Privilege Escalation） |
| 影響範圍 | 全球數百個組織（國防、航太、能源、金融、政府、半導體等產業）；ConnectWise Cloud Backup 多租戶 app 波及 2,250+ 租戶 |
| 嚴重程度 | Critical |
| CVE | 無（濫用既有 OAuth 信任與竊得的應用程式憑證，非單一軟體漏洞） |
| 來源 | [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/)、[The Hacker News](https://thehackernews.com/2026/10/china-linked-hackers-use-artex-ai.html)、[CyberScoop](https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/)、[Wiz 後續分析](https://www.wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors) |

## 攻擊面分析

```diagram
title: Storm-0940 用 ARTEX 把 ConnectWise 供應鏈攻擊打到機器速度
desc: Storm-0940 用 agentic AI 工具 ARTEX 自動化密碼噴灑取得 ConnectWise 多租戶 app 的憑證，再利用該 app 已有的信任對 2,250+ 租戶自動登入，部分組織在 3 小時內就被取得雲端特權存取。
caption: 時間順序依 Microsoft Security Blog（2026-10-21）揭露的攻擊鏈重建。
step: Storm-0940 用 ARTEX 對 8 家組織的 327 個帳號密碼噴灑，產生 15.1 萬次失敗登入
step: ARTEX 加速掃描、密碼噴灑與 OAuth 應用程式濫用，取得 ConnectWise 多租戶 app 的憑證
step: 用該 app 已有的信任，以機器速度對 2,250+ 租戶自動登入，部分組織 3 小時內取得特權存取
---
<svg viewBox="0 0 740 320">
  <line class="dg-rule" x1="100" y1="76" x2="100" y2="260"/>
  <line class="dg-rule" x1="280" y1="76" x2="280" y2="260"/>
  <line class="dg-rule" x1="460" y1="76" x2="460" y2="260"/>
  <line class="dg-rule" x1="640" y1="76" x2="640" y2="260"/>

  <g data-step="1">
    <path class="dg-line" d="M100 132H276" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="190" y="120" text-anchor="middle" dominant-baseline="central">密碼噴灑</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M280 180H456" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="370" y="168" text-anchor="middle" dominant-baseline="central">竊得 app 憑證</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--accent" d="M460 228H636" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="550" y="216" text-anchor="middle" dominant-baseline="central">機器速度登入</text>
  </g>

  <rect class="dg-box" x="25" y="20" width="150" height="56" rx="6"/>
  <text class="dg-label" x="100" y="40" text-anchor="middle" dominant-baseline="central">Storm-0940</text>
  <text class="dg-sub" x="100" y="58" text-anchor="middle" dominant-baseline="central">中國國家級攻擊者</text>

  <rect class="dg-box" x="205" y="20" width="150" height="56" rx="6"/>
  <text class="dg-label" x="280" y="40" text-anchor="middle" dominant-baseline="central">ARTEX agent</text>
  <text class="dg-sub" x="280" y="58" text-anchor="middle" dominant-baseline="central">自動密碼噴灑</text>

  <rect class="dg-box" x="385" y="20" width="150" height="56" rx="6"/>
  <text class="dg-label" x="460" y="40" text-anchor="middle" dominant-baseline="central">ConnectWise</text>
  <text class="dg-sub" x="460" y="58" text-anchor="middle" dominant-baseline="central">租戶信任遭濫用</text>

  <rect class="dg-box dg-box--accent" x="565" y="20" width="150" height="56" rx="6"/>
  <text class="dg-label" x="640" y="40" text-anchor="middle" dominant-baseline="central">2,250+ 租戶</text>
  <text class="dg-sub" x="640" y="58" text-anchor="middle" dominant-baseline="central">特權存取 &lt;3hr</text>
</svg>
```

**ARTEX 是誰、怎麼來的**：ARTEX 是以 Go 語言寫成、搭配 Next.js 前端的 multi-agent LLM 滲透測試框架，可以接任何 AI 模型（本案與先前南韓銀行事件都觀察到搭配 DeepSeek、GLM、Grok 使用），能自動跑完從偵察到資料外洩的整條滲透測試流程，介面可切換英、韓、中、西、日文。這個框架今年 10 月因為被用於攻擊南韓金融機構（本系列 10/8 文章）曝光後，作者已轉為閉源並停止維護——但程式碼顯然已經流出，Microsoft Threat Intelligence 明確表示「觀測到多個不同地緣區域的攻擊者在使用 ARTEX 框架」，Storm-0940 只是其中之一。

**攻擊鏈怎麼走的**：2026 年 10 月 10 日至 14 日，Storm-0940 的基礎設施（IP `144.172.64.99`）對 8 個組織的 327 個帳號發動跨租戶密碼噴灑，Microsoft 觀測到超過 15.1 萬次失敗登入，10 月 11 日單日高峰達每分鐘 2,900 次失敗，但這波攻擊本身沒有成功驗證、沒有拿到 token，也沒有造成目錄變更。真正的突破發生在 10 月 15 日：攻擊者取得多個 ConnectWise 雲端應用程式（Cloud Backup、MS Teams 整合、MS Graph 整合）的身分憑證後，用同一組 IP 段利用這些應用程式「已經被租戶授予的信任」直接認證進入下游客戶環境——不需要互動式使用者登入，等於直接繼承了 app 原本的存取範圍。Microsoft 說 Storm-0940 用 ARTEX 嘗試對 2,250 個以上租戶登入，速度達每分鐘 2,900 次嘗試；在部分環境中，AI agent 進一步做了偵察、修改應用程式憑證、變更身分／群組／特權角色等「持久化」動作，從初次鎖定到取得特權存取最快不到 3 小時。

Microsoft 把這起事件對應到的 MITRE ATT&CK 技術包括 **T1195 供應鏈入侵**（入侵多租戶 OAuth 應用程式波及下游客戶）、**T1199 信任關係**（透過既有信任的第三方應用程式取得下游存取）、**T1098.001／T1098.003 帳戶操縱**（新增或修改應用程式憑證、自我指派特權角色）、以及 **T1528 竊取應用程式存取 token**。值得注意的是，這類事件同樣很難對應到 OWASP LLM Top 10 的單一條目——不是目標系統裡的 LLM 被注入或奪權，而是攻擊者把 agentic AI 當成攻擊基礎設施，用來把原本受限於人力速度的掃描、密碼噴灑、OAuth 濫用全部自動化、全天候執行。

## 防禦做法

**立即動作**
- 若環境中裝過或曾授權 ConnectWise Cloud Backup 或其他 ConnectWise 雲端應用程式：依官方與 Microsoft 的containment 指引，在收到正式恢復說明前維持停用，**不要先刪除應用程式**——保留設定與證據是後續調查的前提
- 盤點三個關鍵 ConnectWise app ID 是否出現在自己租戶（含已經不再使用的）：`506e08f9-6e9a-4da4-942b-a099a03644ae`（Cloud Backup）、`24205314-2b89-4e07-a2a4-579e898a5640`（MS Teams 整合）、`0de14c77-b9b0-4137-9360-34878a929827`（MS Graph 整合），用 app ID 搜尋而不是顯示名稱
- 檢查 Entra 服務主體（service principal）登入紀錄與 Microsoft Graph 稽核紀錄，至少回溯到 10 月 15 日，有紀錄可查就延伸到 10 月 1 日，留意應用程式憑證新增、新增 owner、特權角色指派、Conditional Access 變更等異常
- 確認異常後再輪換受影響應用程式的憑證、撤銷不必要的權限；動作前先保存 Entra 登入與稽核紀錄、Purview 稽核紀錄、SIEM 資料，不要為了止血先清掉證據

**長期架構**
- 對多租戶應用程式的權限與同意授予套用最小權限原則，監控任何高權限 app 的憑證新增與角色自我指派——這次事件的核心弱點正是「一個被信任的第三方應用程式權限超出它實際需要的範圍」
- 這類事件提醒防禦方：工具被作者下架或轉閉源，不代表威脅消失——同一套 ARTEX 程式碼已經流出並被多個不同動機、不同地緣的攻擊者沿用，供應鏈風險評估不能只看「官方維不維護」
- 關鍵不在修補單一漏洞，而在能不能把偵測與回應的時間窗壓到跟攻擊者的自動化速度同等級（本案最快 3 小時內取得特權），單靠人工事後比對登入紀錄已經追不上
- watchlist B7 中的 Noma Security、WitnessAI 等專注在 SaaS／OAuth 應用程式風險與 AI 治理可視性的工具，適合用在偵測「已授權但異常使用」的第三方應用程式這類情境，可以作為既有 SIEM／XDR 之外的補充視角

## 影響範圍

Microsoft 並未公開確切有多少租戶實際遭入侵，並特別強調「應用程式存在、甚至服務主體成功驗證」都不代表資料已被存取或外洩——但同時表示在多個客戶環境中觀察到驗證後的目錄操作、憑證修改等後續行為，顯示至少部分組織的風險不只是被掃到。ConnectWise 已暫時關閉受影響服務，10 月 21 日起分階段恢復，官方預期整個復原過程需要數天；受影響的客戶需要依照 Microsoft 與 ConnectWise 公告的技術調查與補救指南逐一排查自己的租戶，而不是等待廠商端單方面宣布「已解決」。更值得留意的是，Wiz 在 10 月 23 日的後續分析指出，Storm-0940 已經把同樣的手法（探測 SSO／M365 端點、對 Okta 與 Entra ID 密碼噴灑、濫用密碼重設與帳號啟用流程、被封鎖後立刻換 IP）擴散到其他軟體與 IT 供應商，部分攻擊 session 持續 24 到 30 小時——這代表這起事件不是單次已結束的入侵，而是一場仍在進行、持續測試更多廠商多租戶信任鏈的行動。

## 今日收穫

過去看供應鏈攻擊的防禦時間窗大多以天或週計算，這次 Microsoft 公開的數字是「最快 3 小時從鎖定目標到拿到雲端特權」。這提醒我：agentic AI 帶來的改變不只是「攻擊自動化、省人力」，而是把防禦方賽跑的計時器從人類反應速度整個壓縮到機器速度——仰賴人工事後覆核登入紀錄、隔天才排查異常的既有 SOC 流程，面對這種節奏基本上是結構性地追不上，真正該問的問題不是「要不要裝這個 patch」，而是「我的告警到回應流程，能不能在 3 小時內完成」。

## 參考資料

- [AI-driven, large-scale nation-state campaign using ARTEX enables supply chain compromise — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/)
- [China-Linked Hackers Use ARTEX AI Agents in ConnectWise Supply Chain Attack — The Hacker News](https://thehackernews.com/2026/10/china-linked-hackers-use-artex-ai.html)
- [Microsoft pins ConnectWise supply-chain attack to China-state aligned threat group — CyberScoop](https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/)
- [Microsoft says China-aligned hackers used AI agents in ConnectWise supply chain attack — Tom's Hardware](https://www.tomshardware.com/tech-industry/cyber-security/microsoft-says-china-aligned-hackers-used-ai-agents-in-connectwise-supply-chain-attack-agents-attempted-sign-ins-at-more-than-2-250-microsoft-365-tenants-with-some-of-the-groups-attacks-reaching-privileged-access-in-under-three-hours)
- [ARTEX in the wild: Storm-0940 expands targeting of IT and software vendors — Wiz](https://www.wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors)
- [ConnectWise Trust Center — Cloud Backup advisories](https://www.connectwise.com/company/trust/advisories)
- [本系列 10/8：中國開源 agentic 滲透測試工具 ARTEX 遭濫用——南韓多家銀行客戶資料外洩](/posts/daily/2026-10-08-security-artex-ai-pentest-korea-banks)
