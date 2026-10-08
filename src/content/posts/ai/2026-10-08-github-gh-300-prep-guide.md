---
title: "GitHub Copilot 認證（GH-300）備考路徑：考的不只是自動補全，還有 CLI、agent mode 與組織政策"
date: 2026-10-08
type: guide
category: ai
tags: [certification, github, copilot, coding-agent, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 28
tldr: "GH-300 是 GitHub Copilot 的官方認證，2026 年 8 月 7 日改版後的考綱有六塊，最重的「使用 Copilot 功能」佔 25–30%，裡面包含 Copilot CLI、agent mode、MCP、sub-agent 委派，以及組織層級的政策、稽核記錄與 REST API。官方規格：美國 $99、台灣 $50、100 分鐘、60 題計分題、及格 700、效期 2 年，五種語言不含中文，有官方練習測驗。官方的權重清單多列了一行，照六個實際章節準備。"
description: "GitHub Copilot 認證（GH-300）備考指南，依官方 study guide 的六塊技能權重拆解，說明每塊考什麼、兩條官方學習路徑怎麼配、三週時程的換算依據、官方頁面的重複列項，以及 GitHub 認證兩年效期與續期制度的現況。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-github-gh-300-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)，所有「怎麼準備」都指回官方訓練，不含考古題。查證日期：2026-10-08，對照的是「Skills measured as of **August 7, 2026**」那一版。

每天在用 GitHub Copilot 的人，很容易覺得這張認證是白拿的。打開 2026 年 8 月改版後的考綱會發現範圍比「在編輯器裡按 Tab」大得多：Copilot CLI 有獨立的一組條目，agent mode 與 MCP 是明列的考點，還有一組在考組織管理員怎麼設政策、看稽核記錄。

GitHub 的認證現在掛在 Microsoft Learn 底下，報名與成績走微軟的系統，續期也正在轉過去。各家證照的規格對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)。

## 這張適合誰

官方 study guide 的 audience profile：

> Candidates for this exam should possess expertise in using GitHub Copilot to improve software development productivity, quality, and security. This includes responsible AI use, prompt engineering, Copilot features across various plans, and privacy safeguards.

並要求熟悉 GitHub 基礎、有至少一種程式語言的經驗。

**適合**：團隊已經導入 Copilot 的開發者，以及負責評估、採購或管理 Copilot 的技術主管。對後者來說，資料流向、內容排除、公開程式碼比對這幾塊正是內部最常被問的問題。

**不適合**：不用 GitHub Copilot 的人。這張完全綁定單一產品，學到的 prompt 觀念可以帶走，但功能、方案與設定的題目換一個工具就沒用了。想考「在開發流程裡營運與治理 agent」的人，該看的是 [GH-600](/posts/ai/2026-10-08-github-gh-600-prep-guide)。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | GH-300 |
| 認證名稱 | GitHub Copilot |
| 費用 | 美國 **$99 USD**、台灣 **$50 USD**（依考場所在國家定價，認證頁的國家選單可切換） |
| 時間 | **100 分鐘** |
| 題數 | **60 題計分選擇題**，另有約 10–15 題不計分的試題（GitHub 認證 FAQ 對旗下考試的通用說明；Microsoft Learn 的認證頁沒有列） |
| 及格 | **700**（[微軟技術類考試的通用及格線](https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports)，量尺 1–1,000；GitHub 自己的頁面沒有另外列） |
| 效期 | **2 年** |
| 語言 | 英文、西班牙文、巴西葡萄牙文、韓文、日文，**沒有中文** |
| 監考 | Pearson VUE |
| 先修 | 無 |

站內的總表文先前寫「官方頁面沒有列出金額」。認證頁的價格是依國家動態載入的，選美國顯示 $99、選台灣顯示 $50。

## 六塊技能權重

| 技能 | 比重 |
|---|---|
| Use GitHub Copilot responsibly | 15–20% |
| **Use GitHub Copilot features** | **25–30%** |
| Understand GitHub Copilot data and architecture | 10–15% |
| Apply prompt engineering and context crafting | 10–15% |
| Improve developer productivity with GitHub Copilot | 10–15% |
| Configure privacy, content exclusions, and safeguards | 10–15% |

**官方的清單其實列了七行。** study guide 的「Skills at a glance」與認證頁的「Assessed on this exam」在第二行之後都多了一行「GitHub Copilot features」（study guide 那邊還標了 25–30%，認證頁不列權重），但內文沒有對應的章節。六個實際章節的權重範圍加起來是 80–110%，包得住 100%；把多出的那行算進去會變成 105–140%，不可能成立。GitHub 自己的[認證頁](https://learn.github.com/certification/COPILOT)列的也是六個領域。所以那一行是重複列出，以六個章節為準。

## 逐塊準備

### Use GitHub Copilot responsibly（15–20%）

**官方考什麼**：生成式 AI 工具的風險與限制；倫理與負責任的使用；辨識可能的傷害與緩解方式；**說明為什麼要驗證 AI 的輸出**；怎麼負責任地操作 Copilot。

**怎麼準備**：觀念題。重點是「驗證」：Copilot 給的程式碼可能有安全漏洞、可能過時、可能和公開程式碼雷同，準備時把「什麼情境該做哪一種檢查」整理成對照。

### Use GitHub Copilot features（25–30%，最重）

**官方考什麼**，分四組：

| 子題 | 條目重點 |
|---|---|
| IDE 裡的 Copilot | 啟用；透過 inline 建議、chat、CLI、**agent mode** 觸發；為特定檔案或儲存庫設定內容排除 |
| **Copilot CLI** | 它是什麼、對開發者的好處；安裝步驟；主要功能與指令；互動式與 session 用法；產生腳本與管理檔案 |
| 功能與能力 | **Agent Mode、Copilot Edits、MCP**；**管理 agent session、把任務委派給 sub-agent 以節省 context**；程式碼審查；Spaces、Spark、PR 摘要；**用 instructions 檔自訂審查標準**；Copilot Chat 的限制、選項與指令；**重複使用 prompt file** |
| 組織層級的設定與政策 | 組織政策管理；啟用 Copilot Code Review 政策、管理各 IDE 與 github.com 的功能開放；**稽核記錄事件**；**用 REST API 管理訂閱** |

CLI 那組有五條，是這一塊四組裡最多的（IDE 三條、功能四條、組織設定三條）。只在編輯器裡用 Copilot 的人，這組要另外補。

**怎麼準備**：每個點名的功能都實際用過一次。最低限度的清單：裝 Copilot CLI 並用它產生一支腳本；在 agent mode 接一個 MCP server；寫一份 instructions 檔與一份 prompt file；如果你有組織管理權限，進設定頁看一次政策與稽核記錄，沒有的話讀官方的管理文件。

### Understand GitHub Copilot data and architecture（10–15%）

**官方考什麼**：資料的使用、流向與分享；輸入處理與 prompt 組裝；**proxy 過濾與後處理**；程式碼建議的生命週期；LLM 與 Copilot 的限制。

**怎麼準備**：把一次建議的流程從頭畫到尾：編輯器蒐集 context、組成 prompt、經過 proxy、模型回應、後處理過濾、顯示。每一步能說出「這裡會擋掉什麼」。

### Apply prompt engineering and context crafting（10–15%）

**官方考什麼**：prompt 的結構與 context；**context 是怎麼決定的**；zero-shot 與 few-shot；prompt 撰寫的最佳實務；prompt engineering 原則；prompt 的處理流程與對話紀錄的使用。

**怎麼準備**：這塊與站內的[prompt 與 context engineering 的考法](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains)重疊。Copilot 特有的是「context 怎麼決定」：開著哪些檔案、游標在哪、對話紀錄有多長，會直接影響建議。

### Improve developer productivity with GitHub Copilot（10–15%）

**官方考什麼**：產生程式碼、重構與寫文件；加速學習、減少 context 切換；產生樣本資料與翻新舊程式碼；**產生單元測試與整合測試**；找邊界情況、寫 assertion；建議安全性與效能改善。

**怎麼準備**：拿一段沒有測試的舊程式碼，用 Copilot 補測試、找邊界情況、重構，三件事各做一次。

### Configure privacy, content exclusions, and safeguards（10–15%）

**官方考什麼**：設定內容排除與編輯器設定；**輸出的所有權與限制**；**啟用公開程式碼比對過濾**；排除建議與內容排除的問題。

**怎麼準備**：讀官方的[內容排除設定文件](https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion)，並弄清楚內容排除在哪些功能上有效、哪些無效。內容排除在第二塊的 IDE 那組也出現了一次，兩處要一起準備。

## 三週時程與換算依據

**換算方式**：兩條官方學習路徑 [GitHub Copilot Fundamentals Part 1](https://learn.microsoft.com/en-us/training/paths/copilot/)（9 個模組）與 [Part 2](https://learn.microsoft.com/en-us/training/paths/gh-copilot-2/)（6 個模組），Microsoft Learn 課程目錄標示的時間合計約 8.7 小時；官方講師課 [GH-300T00-A](https://learn.microsoft.com/en-us/training/courses/gh-300t00) 是一天。以每週 5–6 小時估算是三週。每天在用 Copilot、也用過 CLI 與 agent mode 的人，一到兩週足夠。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + Part 1 學習路徑 | 涵蓋負責任使用、資料與架構、prompt |
| 第 2 週 | Part 2 學習路徑 + **功能實作清單** | 功能那塊 25–30%，條目點名的功能要實際用過 |
| 第 3 週 | 官方練習測驗 + 補弱 | 認證頁直接提供 practice assessment |

**失敗成本低**：認證頁連到微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，第一次沒過等 24 小時，之後每次間隔 14 天，12 個月內最多 5 次，每次重新付費。GitHub 的認證 FAQ 寫的規則相同。

## 這張的已知陷阱

1. **考綱會跟著產品改。** 現行版本是 2026 年 8 月 7 日生效，study guide 的變更紀錄標了三處小改（IDE 用法、功能與能力、防護與除錯）。變更紀錄沒有說明改了什麼。我自己的判斷法是看教材有沒有涵蓋現行條目點名的 sub-agent 委派、Spaces、Spark 與 Copilot CLI，沒有的話多半跟不上現行考綱。
2. **講師課頁面是舊的。** GH-300T00-A 的課程頁最後更新是 2025 年 6 月，適用對象還寫著「Policy Makers and Regulators」。它比現行考綱早了一年多，別拿它判斷考試範圍。
3. **官方清單多列一行。** 見上面權重表的說明。
4. **study guide 的續期說明是微軟的通用文字。** 「Useful links」表格寫「Microsoft associate, expert, and specialty certifications expire annually」，那是套用的範本；GitHub 認證的效期是兩年，以認證頁為準。

## 考完之後：兩年效期，續期制度還在轉換

認證頁的說明：

> GitHub certifications are valid for 2 years. GitHub is transitioning to Microsoft's recertification process, which will provide a new way for candidates to maintain their certifications without retaking the full certification exam.

也就是說，GitHub 認證以後會改走微軟那種「不用重考整張」的續期方式，但新流程還沒上線。過渡期間官方給了兩項保障：在新流程上線前到期的認證**延長 6 個月**（GitHub 的 FAQ 說快到期的人要聯絡 GitHub 認證團隊辦理）；已經過期的可以寫信到 learn@github.com 索取一張考試券，抵第一次續期的費用。

實際上該怎麼做：兩年內不用處理。快到期時先回認證頁看新流程是否上線；還沒上線就寫信給 GitHub 認證團隊辦延長，不要等它自己生效。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 技能目標版本 | Skills measured as of 2026-08-07 | 每季，Copilot 功能更新快 |
| 六塊權重 | 15–20 / 25–30 / 10–15 / 10–15 / 10–15 / 10–15 | 每次改版 |
| 費用 | 美國 $99、台灣 $50 | 每半年 |
| 續期流程 | 轉換中，尚未上線 | 每季 |
| 權重清單的重複列項 | study guide 與認證頁都有 | GitHub 修好時 |

## 參考資料

- [GitHub Copilot 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/)
- [GH-300 官方 study guide（技能目標全文、權重與變更紀錄）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [GH-300T00-A 講師課程頁](https://learn.microsoft.com/en-us/training/courses/gh-300t00)
- [學習路徑：GitHub Copilot Fundamentals Part 1 of 2](https://learn.microsoft.com/en-us/training/paths/copilot/)
- [學習路徑：GitHub Copilot Fundamentals Part 2 of 2](https://learn.microsoft.com/en-us/training/paths/gh-copilot-2/)
- [GitHub Docs：設定與稽核內容排除](https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion)
- [GitHub Docs：Copilot 方案與功能](https://docs.github.com/copilot/about-github-copilot/plans-for-github-copilot)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**站內相關**

- [GitHub Agentic AI Developer（GH-600）備考路徑](/posts/ai/2026-10-08-github-gh-600-prep-guide)
- [prompt 與 context engineering 的考法](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains)
- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
