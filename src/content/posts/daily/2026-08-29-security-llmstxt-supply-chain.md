---
title: "資安警報｜llms.txt 供應鏈缺口——AI 代理讀廠商官方文件就把未註冊套件裝進財星 500 大公司網路"
date: 2026-08-29
category: daily
type: digest
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "以色列資安新創掃描 6,214 個網域的 llms.txt／llms-full.txt 檔案，發現 237+ 個安裝指令指向從未被註冊的套件與網域；註冊其中幾個掛上回呼信標後，4 分鐘內就有財星 500 大公司的 Claude、Codex、Hermes 代理主動裝進來執行，同時發現 Clerk 官方文件已被真實掛上惡意套件"
tldr: "研究者掃描 6,214 個網域的 8,565 份 llms.txt／llms-full.txt（AI 代理專用的 robots.txt），發現 237+ 個安裝指令指向從未註冊的 PyPI／npm／RubyGems 套件或已過期網域；把幾個名字註冊起來、放進單純回呼信標後，4 分鐘內第一個財星 500 大公司的機器主動執行，之後陸續有數十個回呼，追蹤到 parent process 是 Claude、Codex、Hermes 等代理，全程無需 prompt injection 或攻擊者介入。同時發現 Clerk 官方 llms.txt 文件已被真實掛上惡意套件（MAL-2026-11069），任何照文件執行的代理都會中招；Clerk 已下架修復。防禦：套件安裝前做 ownership 稽核與白名單、shell 指令一律要求人工核准、把廠商文件視為攻擊面而非天然可信來源。"
series:
  name: "AI Security Alert"
  order: 15
---

> 🌏 [English version](/en/posts/daily/2026-08-29-security-llmstxt-supply-chain-en)

## 事件概述

以色列一家匿蹤資安新創（研究者 Alon Hertz 主導）掃描了 6,214 個網域——涵蓋國防承包商、財星 500 大企業與科技巨頭——找到 8,565 份 `llms.txt`／`llms-full.txt` 檔案，這是新興的「AI 代理專用 robots.txt」，OpenAI、Anthropic、Google 都各自發布，用來告訴 AI 代理該讀什麼文件、呼叫哪些 API、安裝哪些套件。研究者發現其中 237+ 個安裝指令（PyPI、npm、RubyGems、NuGet、crates.io、Packagist）與網域指向的目標從未被註冊。他們註冊了幾個空缺套件名稱、埋入單純的「回呼信標」（僅回報安裝事實，不含任何惡意功能），4 分鐘內就有第一個財星 500 大公司的機器主動安裝並執行；一小時內累積多個回呼，事後追蹤 parent process 鏈確認是 Claude、OpenAI Codex、Nous Research Hermes 等代理裝的。整個過程不需要 prompt injection、不需要攻擊者介入，代理只是照著廠商官方文件做它被設計要做的事。研究者同時發現一起「已經在野」的真實案例：驗證服務商 Clerk 的官方 `llms.txt` 文件裡有一行指令，指向的套件名稱已被第三方註冊並植入惡意程式碼，任何照文件執行的代理都會安裝到真的惡意套件。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（llms.txt 未註冊套件／網域 + npx 套件混淆） |
| 影響範圍 | 已知至少數十家財星 500 大企業與新創的 AI 代理環境；Clerk 官方文件曾指向已被註冊的惡意套件 |
| 嚴重程度 | High（已有 1 起確認在野惡意套件案例；研究者的財星 500 回呼僅為良性 PoC，尚無公開證實的實際入侵損害） |
| CVE | 無公開 CVE；惡意套件已由 Google OSV.dev 與 Amazon Inspector 編號 MAL-2026-11069（CWE-506：嵌入式惡意程式碼） |
| 來源 | [Ars Technica](https://arstechnica.com/security/2026/08/claude-codex-and-hermes-installed-unowned-code-inside-corporate-networks/)、[Alon Hertz 原始研究（Medium）](https://medium.com/@alonhertz1/data-became-code-we-ran-code-inside-fortune-500s-using-files-they-published-for-ai-agents-0cd67ffbbffc) |

## 攻擊面分析

攻擊路徑分成兩層。第一層是研究者自己做的控制實驗：`llms.txt` 是新興慣例，廠商在網站根目錄公開一份給 AI 代理讀的「指令清單」——讀哪些文件、裝哪些套件、信任哪些網域。研究者發現大量這類文件裡寫的套件名稱是正確拼寫、但從未被任何人在對應的套件註冊平台上申請，形同公開昭告一個空位。他們申請下來、放進僅回報安裝事實的信標，結果不只財星 500 大公司的代理主動裝了,連只給代理一句「用某廠商的文件建置一個 Node.js 專案」這種完全不提 URL、不提 `llms.txt` 的極簡提示,代理都會自己找到官方文件、讀到安裝指令、裝進從未存在的套件——100 次測試裡每次都成功。第二層是研究者在分析過程中意外撞見的真實案例：Clerk 官方文件裡一行 `npx clerk-next-fix-auth-protection`，用意是執行 Clerk 官方套件 `@clerk/eslint-plugin` 內建的執行檔；但若代理在本機尚未安裝該套件就直接執行這行指令，`npx` 的名稱解析機制會轉而向公開的 npm registry 查找同名的獨立套件——而這個名字已經被第三方註冊並植入惡意程式碼，一旦安裝就會在每次觸發時把安裝者的使用者名稱、機器名稱、工作目錄與時間戳外送到外部伺服器。

為什麼現有的資安控制看不到這個問題？研究者的解釋很直接：代理看到的是一份用 HTTPS 從廠商官方網域發出、格式標準、專為 AI 消費設計的文件——它沒有理由懷疑內容,不會去查套件名稱是否真的屬於這家公司,也不會注意到文件裡的連結網域其實三個月前就過期了。這條信任鏈還會遞移：代理讀的不必是被攻擊公司自己的 `llms.txt`,只要它信任的第三方（合作夥伴文件、SDK 參考、社群專案的安裝指南）裡有同樣的問題,鏈條照樣成立。而站在端點防護的角度,這整個過程完全合規——`pip install` 打去 `pypi.org` 是每個企業代理伺服器都放行的網域，執行者是公司自己裝的、被授權執行 shell 指令的代理，沒有異常、不會觸發任何告警。問題出在指令與執行之間的空隙,而不是端點本身。

對照 OWASP LLM Top 10，這起事件核心命中 **LLM03 Supply Chain Vulnerabilities**（供應鏈完整性缺失延伸到代理消費的第一方文件本身），也牽涉 **LLM06 Excessive Agency**——代理被賦予「讀文件、跑安裝指令」的自主權限，卻沒有機制驗證文件裡指名的套件命名空間是否真的屬於發布文件的廠商。研究者的核心論點是：這類事件標誌著「資料與程式碼的邊界正在消失」——過去二十年網頁內容只給人類讀、沒有完整性要求，現在代理會把讀到的任何內容當成潛在指令來執行，這使得整個公開網路的內容語料，事實上已經默默變成一個執行面。

## 防禦做法

**立即動作**
- 稽核公司網站是否發布了 `llms.txt`／`llms-full.txt`，逐行檢查裡面列出的套件名稱、網域是否真的由公司自己（或已知合作夥伴）註冊擁有，不要假設「官方文件裡的名字」等於「已驗證的來源」
- 若你的組織使用會自動安裝套件、執行 shell 指令的 coding agent（Claude Code、Codex、各類 agentic CLI），在安裝執行前加一道 ownership 稽核：套件是否存在、發布者是否與文件所屬廠商相符，而不是「registry 裡查得到就裝」
- 特別留意 `npx`／`npm exec` 這類「先查快取再回退到公開 registry」的執行方式——即使文件指的是一個已安裝的 scoped package 內建執行檔，只要本機尚未安裝，就有可能被同名的公開套件劫持
- 檢查是否曾照著廠商官方文件安裝過近期才註冊的套件，若有，比照供應鏈入侵處理：稽核該套件行為、視情況輪換受影響機器上的憑證

**長期架構**
- 把「代理消費的任何文件（llms.txt、README、SDK 參考文件、第三方文件）」正式納入攻擊面模型，比照程式碼供應鏈要求完整性驗證，而不是預設可信
- 對代理的 shell 執行與套件安裝設人工核准關卡，尤其是首次安裝、或安裝來源與已知專案依賴清單不一致的情況
- 考慮 watchlist B7 中 Protect AI 這類專攻 AI／ML 供應鏈安全的工具做套件命名空間與模型供應鏈掃描；用 Netzilo 的 agent governance 對代理可執行的安裝行為設 allowlist
- 若你自己是發布 `llms.txt` 的廠商，把文件裡引用的每個套件名稱、網域當成需要持續監控的資產——先搶註冊下來，比等別人搶註冊、植入惡意程式碼再處理便宜得多

## 影響範圍

研究者強調自己的財星 500 大公司回呼是良性 PoC（信標僅回報安裝事實，未做任何額外動作），目前沒有公開證實的實際入侵損害；但 Clerk 案例是唯一已確認的在野惡意案例，任何在 Clerk 官方文件更新前照文件執行過那行指令的使用者，都可能已經把惡意套件裝進本機或 CI 環境，執行者的使用者名稱、機器名稱、工作目錄與時間戳可能已外洩給攻擊者。Clerk 已下架修復，惡意套件也已由 OSV.dev 與 Amazon Inspector 編號記錄（MAL-2026-11069）。研究者指出這個問題目前規模有限（`llms.txt` 目前僅約 7.4% 的財星 500 大企業有發布），但隨著 Google Lighthouse 已把「發布 llms.txt」納入 Agentic browsing 稽核項目、更多廠商跟進發布，這條攻擊面只會擴大。如果你的組織用 coding agent 做開發或維運自動化，這起事件說明廠商官方文件本身已經是需要驗證完整性的攻擊面，不能再假設「HTTPS + 官方網域」等於安全。

## 今日收穫

這起事件最顛覆認知的地方是：它完全不需要 prompt injection，甚至不需要攻擊者主動介入——代理只是照著廠商自己發布、格式正確、HTTPS 送出的官方文件做它被設計要做的事，就把從未存在的套件安裝進了財星 500 大公司的網路。這把我對「供應鏈風險」的認知從「惡意套件冒充合法套件名稱（typosquatting）」往前推了一步：這裡連冒充都不需要，因為合法名稱本身就從未被合法擁有者註冊過。當「資料變成程式碼」變成常態，內容完整性就不再是可有可無的加分項，而是每一份會被代理讀取的公開文件都要納入的基本資安預算。

## 參考資料

- [Ars Technica：Claude, Codex, and Hermes installed unowned code inside corporate networks](https://arstechnica.com/security/2026/08/claude-codex-and-hermes-installed-unowned-code-inside-corporate-networks/)
- [Alon Hertz 原始研究報告（Medium）：Data Became Code](https://medium.com/@alonhertz1/data-became-code-we-ran-code-inside-fortune-500s-using-files-they-published-for-ai-agents-0cd67ffbbffc)
