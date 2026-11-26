---
title: "Claude 資安工作被擋住怎麼辦：Cyber Verification Program 三個層級怎麼選"
date: 2026-11-12
category: ai
type: guide
difficulty: 入門
tags: [anthropic, claude, security, ai-security, cyber-verification-program]
lang: zh-TW
tldr: "審自家程式、修已知漏洞、整理資安告警，一般 Claude 帳號就能做，不必申請。分析惡意程式、驗證漏洞、事件應變要申請 Defense Access（個人可申請）；授權滲透測試與攻擊工具開發要 Red Team Access（僅限組織）。2026-12-15 起 Defense Access 須用 passkey 等防釣魚 MFA，且不得再用 API Key。"
description: "Anthropic Cyber Verification Program（CVP）的 Defense、Red Team、Specialized 三個層級各自能做什麼、誰能申請、申請前要準備的帳號安全設定，以及資料保留等限制。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-11-12-cyber-verification-program-guide-en)

請 Claude 幫你看自家程式有沒有漏洞，現在就能做。但如果你要它分析一個可疑的惡意程式，或驗證某個漏洞能不能真的被利用，它很可能直接拒絕。Anthropic 為這類工作開了一條路：[Cyber Verification Program](https://support.claude.com/en/articles/14604842-cyber-verification-program)（簡稱 CVP），通過驗證的人可以使用資安限制較少的 Claude。這篇說明誰需要申請、三個層級怎麼選，以及申請前要先備妥的帳號安全設定。

## 先看你需不需要申請

```diagram
title: Claude 擋住資安工作時該用哪個帳號
desc: 先看工作是不是審自家程式或處理告警，是的話一般帳號就夠；否則再看是否要攻擊別人的系統，決定申請 Red Team Access 或 Defense Access。
caption: 簡化示意。測試電網、航管等關鍵基礎設施的高風險工作另屬 Specialized Access，見下一節的表。
step: 資安工作被 Claude 擋住，先判斷屬於哪一類
step: 只是審自家程式碼、修已知漏洞或處理告警，一般帳號就能做，不必申請
step: 不屬於前一類，再問是不是要攻擊別人的系統
step: 不攻擊別人的系統，也就是分析惡意程式、事件應變、驗證漏洞這類防守工作，申請 Defense Access
step: 有授權的滲透測試或紅隊演練，申請 Red Team Access，僅限組織
---
<svg viewBox="0 0 560 464">
  <path class="dg-line" d="M200 64V108" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line dg-line--accent" d="M320 160H352" marker-end="url(#arrow-accent)" data-step="2"/>
  <path class="dg-line" d="M200 208V244" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 296H352" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M200 344V380" marker-end="url(#arrow)" data-step="4"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="16" width="160" height="48" rx="6"/>
    <text class="dg-label" x="200" y="40" text-anchor="middle" dominant-baseline="central">資安工作被擋住</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M200 112L320 160L200 208L80 160Z"/>
    <text class="dg-label" x="200" y="150" text-anchor="middle" dominant-baseline="central">只審自家程式碼？</text>
    <text class="dg-sub" x="200" y="172" text-anchor="middle" dominant-baseline="central">修已知漏洞、處理告警</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="356" y="132" width="176" height="56" rx="6"/>
    <text class="dg-label" x="444" y="152" text-anchor="middle" dominant-baseline="central">一般帳號就夠</text>
    <text class="dg-sub" x="444" y="173" text-anchor="middle" dominant-baseline="central">不必申請 CVP</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M200 248L320 296L200 344L80 296Z"/>
    <text class="dg-label" x="200" y="286" text-anchor="middle" dominant-baseline="central">要攻擊別人的系統？</text>
    <text class="dg-sub" x="200" y="308" text-anchor="middle" dominant-baseline="central">有授權的滲透測試</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="356" y="268" width="176" height="56" rx="6"/>
    <text class="dg-label" x="444" y="288" text-anchor="middle" dominant-baseline="central">Red Team Access</text>
    <text class="dg-sub" x="444" y="309" text-anchor="middle" dominant-baseline="central">僅限組織申請</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="112" y="384" width="176" height="56" rx="6"/>
    <text class="dg-label" x="200" y="404" text-anchor="middle" dominant-baseline="central">Defense Access</text>
    <text class="dg-sub" x="200" y="425" text-anchor="middle" dominant-baseline="central">個人也能申請</text>
  </g>

  <text class="dg-edge" x="336" y="148" text-anchor="middle" dominant-baseline="central" data-step="2">是</text>
  <text class="dg-edge" x="210" y="226" text-anchor="start" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge" x="336" y="284" text-anchor="middle" dominant-baseline="central" data-step="5">是</text>
  <text class="dg-edge" x="210" y="362" text-anchor="start" dominant-baseline="central" data-step="4">否</text>
</svg>
```

Anthropic 對一般模型的說法很明確：資安安全閘設得保守，會擋掉大部分資安工作，但下面這幾類不受影響。

> Our generally available models can continue to be used for tasks such as code review, patching known issues, vulnerability finding in owned source code, and triage of security alerts.
> — [Anthropic：Expanding the Cyber Verification Program](https://www.anthropic.com/news/cyber-verification-program)

換成白話：審程式碼、修已知問題、在自家原始碼裡找漏洞、整理資安告警，用一般帳號就好。官方 Help Center 舉的「可能需要 CVP」的例子，是驗證漏洞利用程式（exploit）和執行授權的滲透測試。

## CVP 是什麼

Anthropic 在 2026 年 10 月把兩個原本分開的計畫併成一個。Project Glasswing 讓一批守護關鍵軟體的組織使用 Claude Mythos；舊版 CVP 讓審核過的資安團隊使用 Opus、Sonnet 的寬鬆版。合併後分成三個層級，每個層級都包含 Mythos、Opus、Sonnet 三個系列。

Help Center 目前列出的模型是 Mythos 5.2、Mythos 5.1、Opus 5.5 和 Sonnet 5.5，之後的新模型也會納入。

[Claude Mythos](https://www.anthropic.com/claude/mythos) 是 Anthropic 在資安與生命科學研究上能力最強的模型，只開放給通過驗證計畫的組織。Mythos 5.2 與一般使用者可用的 Fable 5.2 是同一個底層模型，差別在安全閘：Fable 的安全閘會在部分任務介入，所以兩者在資安與生物任務上的成績有落差。

CVP 只調整資安相關的安全閘。生物等其他領域的安全閘照舊，Usage Policy 在每個層級都完整適用。

會併成一個計畫，是因為 Glasswing 的成果夠大：夥伴組織找到至少 12.9 萬個已驗證的軟體漏洞。現在要把這種做法擴大給更多防守者。

## 三個層級怎麼選

| | Defense Access | Red Team Access | Specialized Access |
|---|---|---|---|
| 做得到什麼 | 資安維運、事件應變、惡意程式分析、偵測工程、漏洞檢視與驗證 | 授權的滲透測試、紅隊、對手模擬、攻擊工具與 exploit 開發 | 授權測試關鍵基礎設施，研究最高嚴重度的手法 |
| 適合誰 | 資安團隊、關鍵基礎設施營運者、開源維護者、賞金獵人、個人研究者 | 滲透測試公司、核心工作就是攻擊的內部紅隊 | 要測電網、航管、銀行間轉帳等系統的少數單位 |
| 誰能申請 | 組織與個人 | 僅限組織 | 僅限組織 |
| 可用方案 | Pro、Max、Ultra、Team、Enterprise、API | Team、Enterprise、API | Team、Enterprise、API |
| 人數上限 | 沒有預設上限（個人只涵蓋本人） | 75 人 | 25 人 |
| 審核回覆目標 | 2 天 | 2 週（目前因申請多而更久） | 沒有固定目標，與美國政府共同逐案深入審查 |

幾個選層級時容易搞混的地方：

- **多數防守工作選 Defense 就夠。** 地區醫院、市政公用事業這類關鍵基礎設施營運者，大多也屬於這一層。光是營運關鍵基礎設施，並不構成 Specialized 的資格。
- **Red Team 只能攻擊你被授權測試的系統。** 即使在這一層，會造成實體傷害或大規模中斷的行為（部署勒索軟體、破壞實體系統、對高風險安全系統做滲透測試）仍會被即時擋下。
- **Specialized 是少數單位的層級。** 既有的 Glasswing 成員會直接轉到這一層。
- **申請 Red Team 期間不會空手等。** 符合資格者會先被放進 Defense，等審核結果。

每個層級都禁止：大規模破壞資料或裝置、阻斷服務（DoS）攻擊、造成實體世界的傷害、勒索、干擾選舉，以及任何明講惡意目的的請求。

## 你是哪一種申請者

| 你是… | 申請哪一層 | 驗證方式 | 要注意的事 |
|---|---|---|---|
| 獨立研究者、開源維護者、賞金獵人 | Defense（個人） | 個人驗證：政府核發的實體證件，可能要用手機即時自拍 | 自己做的賞金研究與協同揭露算內部使用，不需額外核准；權限只涵蓋你本人 |
| 公司或機構的 SOC、事件應變、惡意程式分析團隊 | Defense（組織） | 企業驗證：組織的法定名稱、地址、商業登記號碼 | 由帳號的 Owner 或 Admin 代表申請；通過後還要由管理員指派 |
| 公司內部紅隊 | Red Team | 企業驗證，帳號須是 Team、Enterprise 或 API 方案 | 要附資安計畫與測試授權的證明（見下面的表） |
| 滲透測試公司 | Red Team；替客戶做事另需外部使用核准 | 同上 | 倚賴外部測試者的委託方，要由測試公司自己申請 |
| 要測電網、航管等系統的單位 | Specialized | 與美國政府共同審查 | 申請時要說明 Red Team 層做不到哪些事 |

## 內部使用與外部使用

官方把使用情境分成兩種，這個區分決定你能不能替客戶做事：

- **內部使用**：對自己組織的程式碼、產品與基礎設施做資安工作，也包括你獨立進行、不是替客戶做的賞金研究與協同揭露。每個通過的層級都涵蓋。
- **外部使用**：替客戶做資安工作，或做客戶會用到的產品。必須在內部使用通過之後，另外申請核准。

外部使用依型態分三種：

| 型態 | 說明 | 目前狀態 |
|---|---|---|
| 託管服務 | 你的員工操作 Claude，客戶只拿到審過的成果，碰不到模型也看不到原始輸出 | 受理申請，審核約 1 週 |
| 受限產品 | 客戶使用你做的東西，但不能操控模型、看不到原始輸出 | 只能登記興趣 |
| 不受限產品 | 其他面向客戶的產品，例如客戶可以自己下 prompt | 只能登記興趣 |

沒有經過核准就用 CVP 服務客戶，違反條款，會被移出計畫。申請由 Claude 帳號的 Owner 或 Console 帳號的 Admin，在 Verification Portal 的 Cyber productization 登記；送出後不能修改或撤回，每個服務或產品要各自申請。

## 申請流程走一遍

**先準備四件事**

1. **用對帳號。** 核准不會跨組織，Claude 和 Claude Console 是兩個獨立的組織。每個組織只送一份申請，由 Owner、Primary Owner（Claude）或 Admin（Console）送出，其他人不要另外申請。帳號的 Email 事後不能改，申請組織時要用組織網域。
2. **備好驗證資料。** 個人要有實體證件，組織要有法定名稱、地址與商業登記號碼。
3. **寫清楚你做什麼資安工作、打算怎麼用 Claude。**
4. **確認能做帳號安全聲明。** 見下面「帳號安全」一節。

**再照步驟操作**

直接使用 Anthropic 的 Claude、Claude Code 或 API：登入 Verification Portal，選「Cyber Verification Program」，按 Apply，填完後同意條款並送出。

使用 AWS、Google Cloud 或 Azure：要先把雲端帳號連結到 Portal，確認你是管理員（最多連結 10 個 GCP 專案或 AWS 帳號），再照上面的步驟申請。

**等結果**

官方的回覆時間目標是：Defense 兩天、Red Team 兩週（目前因為申請太多，會更久）。申請 Red Team 但只符合較低層級時，會先給你 Defense。被拒絕後 7 天可以重新申請，建議在有新證據時再申請。

**Red Team 要附哪些證明**

Red Team 的審核看證據，不同申請者要附的東西不一樣。符合其中一列不保證通過。

| 申請者 | 要準備 |
|---|---|
| 內部紅隊 | 組織資安計畫的證明：最新年報的資安章節、有效的 ISO/IEC 27001 證書或 SOC 2 Type II 報告，或營運滿 12 個月的付費賞金計畫（關鍵基礎設施營運者可用產業資安義務）。另外要有測試團隊名稱、負責人與約略人數，以及「每次測試事前都有權限者授權」的確認。再加下列任一項：成員有 OSCP、GPEN 或 CREST Registered Tester 等攻擊性資安證照、團隊工作的公開成果（研究或研討會演講）、去識別化的內部測試報告 |
| 資安或滲透測試公司 | 以公司名義取得的下列任一項：CVE Numbering Authority 名單、FIRST（資安事件應變團隊論壇）正式會員、近期 CVE 致謝、CREST／CHECK／FedRAMP 3PAO 等測試認證 |
| 沒有上述證明的小型測試公司 | 下列全部：成立滿一年的商業登記、測試服務的公開資訊、至少兩位有攻擊性資安證照的測試員、近 12 個月內去識別化的工作說明書、測試報告或客戶推薦 |
| 政府紅隊 | 測試團隊名稱、負責人與約略人數，事前授權的確認，再加證照、公開成果、去識別化測試報告三選一 |

**證據怎麼附，審核比較快**

- 附能獨立查證的連結，例如公開名錄、認證機構頁面。沒有公開連結時，上傳完整且有日期的文件。
- LinkedIn 個人頁或截圖通常不夠。自家網站的信任中心頁、測試服務說明頁，對部分項目可以用。
- 證據上的名稱，要和你被驗證的組織或個人一致。
- 每個連結都要公開可看，賞金平台的個人頁也一樣。

## 核准之後：開通與用量

多數產品上，核准不等於自動開通，管理員要先把計畫指派出去：

- Pro、Max、Ultra 是個人帳號，自動開通。
- Team 方案自動套用到全員，所以 Red Team、Specialized 若超過人數上限，在 Team 方案上會維持關閉。
- Enterprise 由管理員把計畫指派給自訂角色。
- Claude Console（API）由管理員指派給 workspace，而且不能是預設 workspace。

模型的用量規則不一樣：Mythos 比照 Fable。Pro 方案只能用額度（usage credits）使用 Mythos；Max 與 Ultra 方案的 Mythos 和 Fable 合計最多占每週用量上限的一半，而且這些用量也算進一般用量，用完後可以改用額度，或換別的模型。經由雲端夥伴使用 Mythos，約在核准後 5 個工作天開通。

核准之後，做被允許的資安工作仍可能遇到拒絕或誤擋，官方說還在持續降低誤判。

## 帳號安全：2026-12-15 前後差在哪

官方的 [Security Requirements](https://support.claude.com/en/articles/17202708-cyber-verification-program-security-requirements) 把 2026-12-15（文件裡叫 Cutoff Date）當分界，Defense Access 的帳號安全規定在這天變嚴。

| | 現在到 2026-12-15 | 2026-12-15 起 |
|---|---|---|
| MFA | 開啟多重驗證即可 | 必須用防釣魚 MFA：安全金鑰（FIDO2／WebAuthn）、passkey 或智慧卡 |
| 不算數的驗證方式 | — | 簡訊、語音、Email 驗證碼、驗證器 app 的一次性碼、推播核准；Email magic link 登入也要關掉 |
| API Key | 可以用，但要存在密碼管理員或 secrets manager、一把只給一個人或一個工作負載、不放進原始碼、至少每 7 天更換 | 不得使用長效或靜態憑證，包括 API Key |
| 替代做法（個人） | — | Claude Code、Console、claude.ai 走 OAuth 登入；程式存取用 Workload Identity Federation |

passkey 就是手機或密碼管理器裡，用指紋或臉部解鎖的登入金鑰。Anthropic 也保留把 Defense Access 的 API Key 壽命限制在 7 天、並從 Cutoff Date 起停用 API Key 的權利。

官方建議現在就開始改用 Workload Identity Federation（讓程式用雲端或身分系統發的短效憑證，而不是一把固定的 Key），不要等到期限。

今晚就能做的事：到申請用的帳號（個人申請者是你登入用的 Google 或同等身分提供者帳號）設定 passkey 或安全金鑰，確認 Email magic link 登入沒有在用。現有的 API Key 改成 OAuth 登入，或先排進每週更換。

## 限制與需要先知道的事

- **資料會被保留。** 加入 CVP 的流量要保留，讓 Anthropic 監控濫用；Mythos 預設保留 30 天。個人的 Defense Access 不提供零資料保留（ZDR）。你把客戶系統或自家網站的掃描內容貼給 Claude，這些內容會被 Anthropic 保存。已有 Fable 或 Mythos 的 ZDR 豁免的組織，可以在 CVP 下繼續用 ZDR。另一條路是 [Enterprise Frontier Safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards)，把監控用資料存在客戶自己的雲端，預計今年秋季起分階段推出。
- **Defense 仍會擋複雜的攻擊流程。** Anthropic 用 CyScenarioBench（多階段網路攻擊情境）測試 Opus 5.5，Defense 層 50 次有 46 次在過程中被擋，Red Team 層沒有任何一次被擋、完成 34 次。如果你的工作其實是攻擊測試，被擋是因為層級不對，申請 Red Team 才有用。
- **覺得被誤擋可以回報。** 官方提供[誤判回報表單](https://claude.com/form/cyber-block-false-positive-report-cvp-rejection-appeal)。
- **平台有差。** Claude Platform、Google Cloud 的 Vertex AI、Microsoft Foundry 可用；Amazon Bedrock 目前只開放給符合 Enterprise Frontier Safeguards 資格的客戶。
- **申請送出後不能修改。** 被拒絕的話，7 天後可以重新申請。Anthropic 保留隨時縮減或撤回權限的權利。

## 常見問題

**核准了還是被擋，怎麼辦？** 先確認管理員有把計畫指派給你（Console 是你所在的 workspace，Enterprise 是你的角色），再確認工作在你的層級之內。

**我有 Defense，可以升級嗎？** 組織可以申請更高層級，審核期間保留 Defense。

**公司不同部門可以用不同層級嗎？** 可以，但每個 Claude 組織要各自申請。同一個組織裡，Console 按 workspace 分、Enterprise 按角色分；Team 方案沒辦法把不同層級分給不同人。

**核准後可以加人嗎？** 可以，不用重新申請，把人加進已套用計畫的 workspace 或角色，在人數上限內即可。Red Team 與 Specialized 只能加申請書上列的團隊成員，而且每個人都要符合該層級的安全要求。

## 整體來說

多數人不需要申請：寫程式、審自己的程式碼、修漏洞，一般帳號就做得到。被擋住的人先分清楚是防守還是攻擊：防守工作（分析惡意程式、事件應變、驗證漏洞）申請 Defense Access，個人也能申請；授權的滲透測試與攻擊工具開發要 Red Team Access，只收組織。申請之前先把帳號改成 passkey，不要等到 12 月 15 日才發現自己的登入方式不合格。

## 參考資料

- [Expanding the Cyber Verification Program — Anthropic](https://www.anthropic.com/news/cyber-verification-program)
- [Cyber Verification Program — Claude Help Center](https://support.claude.com/en/articles/14604842-cyber-verification-program)
- [Cyber Verification Program Security Requirements — Claude Help Center](https://support.claude.com/en/articles/17202708-cyber-verification-program-security-requirements)
- [Claude Mythos — Anthropic](https://www.anthropic.com/claude/mythos)
- [Developing Enterprise Frontier Safeguards with our customers — Anthropic](https://www.anthropic.com/news/enterprise-frontier-safeguards)
- [Verification Portal — Anthropic](https://portal.anthropic.com/programs/cvp)
