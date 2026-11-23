---
title: "Microsoft Autopilot 用自己的身分做事：Entra Agent ID、具名的負責人，以及稽核和撤權怎麼做"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, microsoft, copilot, entra]
lang: zh-TW
tldr: "Microsoft Autopilot（原名 Scout）是放在公司租戶裡的常駐型 agent，會自己盯 Teams 頻道、跟進信件、跑例行工作，屬於常駐型的 L3。它最大的差別是身分：每個 Autopilot 有自己的 Microsoft Entra Agent ID 和一位具名的負責人，登入和動作都用它自己的名字記錄，IT 可以限縮權限、隨時封鎖。Purview 的資料保護在送出前生效。它用 OpenClaw 的開源技術，目前只開放給加入 Frontier 計畫的合格客戶。"
description: "Microsoft 的常駐型 agent Autopilot：從 Scout 到 Autopilot、為什麼要讓 agent 有自己的身分、Entra Agent ID 怎麼記錄與封鎖、具名負責人離職時怎麼辦、跟 Devin Bots 和 Dots 專職 dot 的對照，以及導入前該問 IT 的問題。"
series:
  name: "常駐型 AI agent"
  order: 11
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-microsoft-autopilot-en)

| 四個條件 | Microsoft Autopilot |
|---|---|
| 你不在時繼續跑 | ✓ 在雲端執行，有自己的遠端電腦，不靠你的筆電開著 |
| 醒來後自己決定做什麼 | ✓ L3：盯 Teams 頻道、跟進討論串和信件、跑例行工作，不用等提示 |
| 跨對話記得你的目標 | ✓ 有持續的記憶，建立在 Microsoft IQ／Work IQ 的組織脈絡上 |
| 能代你對外做事 | ✓ 寄信、排會議、在群組裡接工作；關鍵動作前可設成先問你 |

Microsoft 的 Omar Shahine 寫了 Scout 和 Autopilot 的介紹文，他[替自己的 Autopilot 取名 Sebastian](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611)。

某次他不在辦公室，請 Sebastian 處理 Teams 上沒回的對話。Sebastian 準備了 40 份回覆草稿，依優先順序分組，放進一個只有他看得到、可以編輯的佇列，等他回來審。這些回覆一封都沒有寄出。Shahine 的說法是：

> The replies stayed as drafts. I remained responsible for what would be sent.

Sebastian 會用自己的信箱每週日寄一份「Sunday Reset」給他，他可以直接回信繼續對話；同事要約他開會，可以在 Teams 上直接跟 Sebastian 談。這些都是因為 Sebastian 有自己的身分。

這篇講 Microsoft Autopilot：讓 agent 用自己的身分、掛一位具名的負責人，對稽核和撤權有什麼差別。

## 從 Scout 到 Autopilot

- **2026 年 6 月 2 日，Microsoft Scout**：[Microsoft 提出「Autopilots」這個新類別](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/)，定義是常駐、自主、有自己的身分、替你做事的 agent。Scout 是第一個。它以實驗版本透過 Frontier 計畫開放，官方寫它「powered by OpenClaw open-source technology」。
- **2026 年 9 月 25 日，改名 Autopilot**：[成為新版 Copilot 的三項能力之一](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/)（另外兩項是 Home 和 Code），月底擴大到私人預覽。
- **2026 年 11 月 17 日，Ignite**：[開始對 Frontier 客戶推出](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)。

Microsoft 也說，它把「政策符合性」檢查直接貢獻回 OpenClaw 上游。自己跑 OpenClaw 的組織，可以驗證環境有沒有照安全與合規要求設定，並拿到可以給稽核看的答案。

## 它做什麼

Autopilot 住在公司的租戶裡，有自己的身分、記憶、電腦和工作空間。它出現在大家已經在用的地方：Teams、Outlook、對話、頻道、文件，你可以像 @ 同事一樣 @ 它。

官方舉的例子是一整套供應商審查流程：排時程和倒推計畫，自己處理準備、會議和跟進，一路追到向相關人員要進度。Shahine 的例子是「get me to Ignite and back」。出發前排時間、比航班和飯店，你核准後才訂；到了現場幫你準備會議、讓同事找得到你；回來後跟進漏掉的對話、整理報帳。

他也提到一個細節：請 Sebastian 清掉休假前的會議時，他選好會議，Sebastian 只刪掉那幾次的場次，保留整個週期會議。「Clear next week shouldn't accidentally become cancel this meeting forever.」

## 為什麼身分是重點

前幾篇的 agent，多半是用「你的帳號」去做事：你連 Gmail，它就用你的 Gmail 寄信。Autopilot 換了一個做法。[Scout 的發表文寫](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/)：

> Every agent operates under its own governed Entra identity, not a shared, anonymous service account, so the work it does is attributable to a known actor your directory already understands.

這帶來幾個具體差別：

| | agent 用你的身分 | agent 用自己的身分（Autopilot） |
|---|---|---|
| 稽核紀錄 | 看起來是你做的，分不出是你還是 agent | 登入和動作用 agent 自己的名字記錄 |
| 收信的人看到誰 | 你 | 你的 Autopilot（有自己的信箱） |
| 要停掉它 | 撤銷你給它的授權，或換你的密碼 | 封鎖它的身分，你的帳號不受影響 |
| 權限範圍 | 跟你一樣大 | 可以單獨限縮 |
| 負責人 | 你 | 一位具名的人類負責人 |

[Ignite 的公告](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)把它講得很短。每個 Autopilot 有自己的 Entra Agent ID 和一位具名的負責人，IT 可以限縮它的存取、隨時封鎖。它的登入和動作用它自己的名字記錄，資安團隊有清楚的稽核軌跡。

## Entra Agent ID 實際怎麼運作

[Microsoft Entra 的文件](https://learn.microsoft.com/en-us/entra/agent-id/manage-agent-identities-admin)說明了這套身分怎麼管。

**負責人（sponsor）**：每個 agent 身分都應該有一位負責它用途和生命週期決定的人類 sponsor。sponsor 離職時，Entra 會自動把 sponsorship 轉給這個人的主管，避免 agent 變成沒人管的孤兒。存取權快到期時，sponsor 會收到通知，可以申請延長（要重新核准）或讓它到期。

**紀錄**：

- [稽核紀錄](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents)裡，agent 的活動記在它對應的身分類型下，用一個 `agentType` 欄位標出是不是 agent、是哪一種。
- 登入紀錄有 `agentSignIn` 類型，可以在 Entra 管理中心用「Is Agent」篩選。

**封鎖分三個層級**：

| 範圍 | 效果 |
|---|---|
| 單一 agent | 停用某個 agent 身分，它就拿不到 token、無法登入；管理員在管理中心操作，負責人和擁有者可以在 My Account 頁面操作 |
| 藍圖（blueprint） | 停用一個 agent 範本，用它建的 agent 全部封鎖，也不能再建新的 |
| 整個租戶 | 用條件式存取政策封鎖所有 agent 身分的登入 |

**風險偵測**：Entra ID Protection 會監測 agent 的異常行為，例如存取不熟悉的資源、登入暴增、存取失敗。管理員可以確認它被入侵，把風險等級設為高，觸發條件式存取政策自動封鎖。

文件也提醒一件事：整個租戶一次停用所有 agent，可能讓既有的 agent 壞掉，還會逼團隊改用更不透明的應用程式或服務主體身分。建議用條件式存取只擋特定的 agent。

## 資料保護在送出前生效

身分管的是「誰在做」，存取控制管的是「能做什麼」。Scout 的發表文寫，agent 只能碰你核准過的資源和目的地，敏感動作可以要求人簽核才繼續。Microsoft Purview 的資料保護政策，包括敏感度標籤和資料外洩防護，會「enforced in the moment, before anything is sent or written」。它不繞過這些控制，而是在公司已經設好的保護裡運作。

憑證的處理是：只給這次任務需要的範圍，從紀錄和診斷資料裡遮掉。

## 跟 Devin Bots、Dots 專職 dot 對照

這條路線裡，三家都在處理「agent 替團隊做事時用誰的權限」，做法不同：

| | Devin Bots | OpenAI 專職 dot | Microsoft Autopilot |
|---|---|---|---|
| 身分 | bot 自己持有別人給的授權 | 有自己的身分、憑證和存取權（企業試行中） | 有自己的 Entra Agent ID |
| 誰管權限 | 分享 bot 的人和建立者 | 公司 | IT，透過公司目錄 |
| 負責人 | bot 的建立者 | 公司指定 | 具名的 sponsor，離職自動轉給主管 |
| 稽核 | Devin 裡的授權清單 | 未詳細公開 | Entra 稽核與登入紀錄 |
| 怎麼停掉 | 撤銷授權、封存或刪除 bot | 未詳細公開 | 停用身分、停用藍圖，或條件式存取 |

Devin Bots 是團隊自己設權限；Autopilot 把 agent 當成公司目錄裡的一個成員，用 IT 原本管人的工具管它。

## 現在誰能用

[Shahine 在 11 月 17 日的文章](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611)寫，要成為合格客戶，必須：

- 已加入 Frontier 計畫
- 有 Copilot 授權
- 啟用用量計費（usage-based billing）
- 具備必要的管理與安全功能

Autopilot 跟 Cowork、Code 一樣用用量計費，不在固定的每人訂閱裡。文章底下有讀者引用一則系統訊息 MC1557730，說 Frontier 版的 Autopilot「Availability is initially limited to eligible US customers」。這是讀者轉述，Microsoft 正文沒寫地區。

目前也還沒有 Microsoft 以外的上手評測。官方的例子都來自 Microsoft 內部和 Shahine 自己的使用經驗。

## 導入前該問 IT 的問題

如果公司在評估 Autopilot 或其他用自己身分做事的 agent，可以拿這幾個問題去問 IT：

1. **它的身分是誰建的、誰是 sponsor？** sponsor 離職時，Entra 會轉給他的主管；這位主管知道自己會接手嗎？
2. **它能碰哪些資源？** 是只給這份工作需要的信箱、頻道和網站，還是繼承了某人的整個權限？
3. **哪些動作要人簽核？** 寄給公司外部的信、刪除檔案、接受會議，有沒有設成先問？
4. **Purview 的標籤和外洩防護有沒有套用到它？** 標成機密的文件，它能不能寄出去？
5. **出事時怎麼找到它做了什麼？** 資安團隊知不知道怎麼在稽核紀錄裡用 `agentType` 篩出 agent 的動作？
6. **要停掉它時，停哪一層？** 只停這一個 agent、停整個範本，還是用條件式存取擋？誰有權限按？
7. **費用怎麼算、誰付？** 用量計費有沒有設上限？Agent 365 的成本管理有沒有開？

## 適合誰、不適合誰

**適合：**
- 已經用 Microsoft 365 和 Teams、有 IT 團隊管 Entra 的公司。
- 需要清楚稽核紀錄和撤權機制，才敢讓 agent 動手的組織，例如受監管的行業。
- 有大量跨人協調工作的人：排會議、跟進討論串、準備會前資料。

**不適合：**
- 個人或小團隊：要加入 Frontier、有 Copilot 授權和完整的管理與安全設定。
- 主要工作不在 Microsoft 生態系裡的人：文章留言裡就有人問，身分橫跨好幾個信箱和服務的人要怎麼用。
- 想先看獨立評測再決定的組織：目前還沒有。

在台灣，個人用不到；企業要先加入 Frontier，並確認自己的租戶符合資格。

身分管住的是「誰在做」。下一篇的 Salesforce long-horizon agents 處理另一件事：一份跨好幾週的計畫，怎麼管住「做到哪了、什麼時候偏離要回來問人」。

## 參考資料

- [Introducing Microsoft Scout: Your always-on personal agent](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/)（Microsoft，2026-06-02）
- [Introducing the new Copilot with Home, Code and Autopilot](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/)（Microsoft，2026-09-25）
- [Copilot at Microsoft Ignite: Expanding what's possible with intelligence built for work](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)（Microsoft，2026-11-17）
- [Autopilot: meet your trusted personal teammate](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/autopilot-meet-your-trusted-personal-teammate/4572611)（Microsoft Community Hub，2026-11-17）
- [Manage agent identities in your organization](https://learn.microsoft.com/en-us/entra/agent-id/manage-agent-identities-admin)（Microsoft Learn）
- [Microsoft Entra Agent ID logs](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents)（Microsoft Learn）
