---
title: "資安警報｜BragJack：一個瀏覽器擴充功能劫持 Chrome、Comet、Edge、Opera Neon 與 Claude in Chrome 五套內建 AI Agent"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation, data-exfiltration]
lang: zh-TW
description: "資安研究團隊 Forever Security 用同一套技巧，靠一個只有兩個常見權限的瀏覽器擴充功能，劫持了 Chrome、Comet、Edge、Opera Neon、Claude in Chrome 五套內建 AI agent，兩項漏洞已列 CVE"
tldr: "Forever Security 研究員 Gal Weizman 發現：瀏覽器內建 AI agent 的『大腦』（雲端 AI）與『身體』（能操作螢幕、檔案、鏡頭的瀏覽器本體）之間，只認一個信任來源網域；擴充功能雖不能改網頁程式碼，卻能靠內容腳本與 declarativeNetRequest 兩個常見權限劫持那個信任來源，冒充大腦對身體下指令——不是 prompt injection，而是完整偽造指令的『Prompt-Forcing』。Chrome（CVE-2026-0628，CVSS 8.8）與 Edge（CVE-2026-55945，CVSS 4.2）已修補，Comet、Opera Neon、Claude in Chrome 三家已付賞金但未公布修補時程。防禦重點是把擴充功能視為高風險資產，並改用能在 runtime 監控 agent 實際動作的工具，而非只看程式碼有沒有惡意內容。"
series:
  name: "AI Security Alert"
  order: 30
---

> 🌏 [English version](/en/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en)

## 事件概述

資安研究公司 Forever Security 的研究員 Gal Weizman 在 2026 年 9 月 16 日發布代號 **BragJack** 的研究，示範用同一套技巧、透過一個只需要兩個極常見權限的瀏覽器擴充功能，劫持了五套內建 AI agent：Google Chrome 的 Gemini Live、Perplexity 的 AI 瀏覽器 Comet、Microsoft Edge、Opera 的 Opera Neon，以及 Claude in Chrome 擴充功能。攻擊全程零點擊，受害者只要瀏覽器裡裝了那個惡意擴充功能（前提已存在）就會中招。研究已從 Google、Microsoft、Perplexity、Opera、Anthropic 五家廠商合計拿到約 2 萬美元賞金，其中 Chrome 與 Edge 的漏洞已各自取得 CVE 編號並修補，Comet、Opera Neon、Claude in Chrome 三項發現則尚無 CVE，僅由 Forever Security 單方說明並經廠商認證付款。目前無跡證顯示這五種手法已被用於真實攻擊。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 瀏覽器擴充功能劫持內建 AI Agent（Privilege Escalation / Confused Deputy） |
| 影響範圍 | Google Chrome（Gemini Live）、Perplexity Comet、Microsoft Edge、Opera Neon、Claude in Chrome 擴充功能 |
| 嚴重程度 | High（Chrome CVSS 8.8）／Medium（Edge CVSS 4.2；Comet、Opera Neon、Claude in Chrome 無官方評分，Anthropic 內部列為 Medium） |
| CVE | CVE-2026-0628（Chrome，已於 143.0.7499.192 修補）、CVE-2026-55945（Edge，已於 150.0.4078.48 修補）；Comet／Opera Neon／Claude in Chrome 無 CVE |
| 來源 | [Forever Security 官方研究](https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants)、[The Hacker News](https://thehackernews.com/2026/09/one-extension-could-hijack-ai.html)、[Dark Reading](https://www.darkreading.com/endpoint-security/bragjack-browser-agentic-ai) |

## 攻擊面分析

這五套產品的架構幾乎一模一樣：瀏覽器裡有一個「身體」（能截圖、讀檔、開鏡頭麥克風、代替使用者操作）與一個跑在廠商伺服器上的「大腦」（實際的 AI 模型），身體只聽從單一信任網域（如 gemini.google.com、opera.com、copilot.microsoft.com）傳來的指令。Weizman 發現，瀏覽器擴充功能雖然被明文禁止直接控制瀏覽器本體，卻普遍擁有兩個幾乎沒人設防的權限：內容腳本（content script，廣告攔截器都要用）與 declarativeNetRequest（可以改寫瀏覽器對外的網路請求）。把這兩個權限組合起來，就能讓擴充功能偽裝成那個受信任的網域，直接對「大腦」下指令，再由大腦轉譯成「身體」在使用者機器上執行的動作——等於是擴充功能繞過了「只能改網頁、不能控制瀏覽器」這條瀏覽器安全的基本假設。

五套產品的實際破口各不相同：Chrome 擋掉了擴充功能對 Gemini 頁面注入腳本，卻忘了擋網路請求改寫，讓攻擊者能把頁面載入的 JavaScript 換成自己的；Opera Neon 乾脆沒擋任何擴充功能在 opera.com 上跑程式碼；Microsoft Edge 專門為行銷頁面開了一個「只有這一頁能對大腦下指令」的特殊權限，且把 agent 拆成「Think」與「Do」兩個模式互斥執行，結果被一個 race condition——在切換模式的瞬間同時塞進提示詞與觸發動作——繞過；Claude in Chrome 同樣因為行銷頁面權限沒收緊而被攻破；Comet 則是防護最嚴（連廣告攔截器都不准在 perplexity.ai 上跑），卻因為開發過程遺留一個沒鎖好的測試網域 testing.perplexity.com，被攻擊者用改寫回應標頭的方式繞過重導向、載入該網域後直接對整個瀏覽器等級的 agent 下指令，因而被列為五者中最嚴重、影響最大的一起——可讀取任意本機檔案、瀏覽紀錄、代替使用者操作，等同一次完整的資料外洩（data exfiltration）事件。

研究團隊特別強調這**不是 prompt injection**——沒有在既有指令裡夾帶惡意結尾，而是攻擊者完整寫出並送出整段指令、再持續追加後續指令，稱為「Prompt-Forcing」。這個區別很關鍵：傳統 EDR 只偵測惡意程式碼，但這裡整個攻擊過程沒有任何惡意程式碼，只是一個被信任的合法元件（擴充功能）在做它被允許做的事（改網頁、改網路請求），最終驅動另一個被信任的合法元件（AI agent）去做正常但被濫用的任務（如「整理我的信件並寄給我」）。對照 OWASP LLM Top 10，這起事件最貼近 **LLM06 Excessive Agency**（agent 一旦被劫持指令來源就能無限制代替使用者行動）與傳統資安裡的 **confused deputy** 問題（瀏覽器把「來自信任網域」錯當成「指令合法」的唯一判準），而不是典型的 LLM01 Prompt Injection。

## 防禦做法

Forever Security 在文中直接點出核心結論：**只要軟體開始內建 AI，攻擊面就會變得難以預測**，因為傳統資安工具是為了偵測「惡意程式碼」設計的，而這類攻擊完全沒有惡意程式碼、只有被濫用的合法指令與合法權限。

**立即動作**
- 盤點組織內所有裝有瀏覽器內建 AI agent（Chrome Gemini、Edge Copilot、Comet、Opera Neon、Claude in Chrome）的端點，確認 Chrome 已更新至 143.0.7499.192 以上、Edge 已更新至 150.0.4078.48 以上以套用兩個已修補的 CVE
- 稽核使用者已安裝的瀏覽器擴充功能清單，特別留意同時要求「修改網頁」與「宣告式網路請求控制」兩種權限的擴充功能——這正是 BragJack 系列攻擊的最小必要條件
- 對於 Comet、Opera Neon、Claude in Chrome 三項尚未公開修補時程的發現，先假設風險存在，暫停或限制這些工具在高敏感資料環境（如財務、人資系統）的存取權限

**長期架構**
- 把瀏覽器擴充功能當成高權限第三方軟體治理，而非預設信任的小工具：企業可考慮導入擴充功能白名單機制，只允許安全團隊審核過的擴充功能安裝
- 傳統 EDR 無法偵測「合法元件執行合法但被濫用的指令」這類攻擊，需要能在 runtime 監看 agent 實際動作、依情境判斷是否合理的工具；watchlist B7 中的 Lakera、Invariant Labs 等 runtime guardrail 廠商的產品方向與此類似，可評估其對瀏覽器 agent 場景的涵蓋度
- 對外開放能「代替使用者操作」的 AI agent（尤其是 Comet 這類全 AI 驅動瀏覽器），應比照特權帳號做最小權限與行為稽核，而非只信任單一網域來源這種可被繞過的判準

## 影響範圍

截至 2026 年 9 月 16 日，兩個已取得 CVE 的漏洞（Chrome、Edge）都未被列入美國 CISA 已知遭利用漏洞（KEV）清單，Forever Security 與各家廠商也都表示沒有證據顯示這五種手法已在真實攻擊中被使用——這是一份研究揭露（responsible disclosure），不是進行中的資安事件。但因為觸發條件只需要「受害者已安裝惡意擴充功能」，攻擊門檻遠低於多數瀏覽器層級漏洞，任何依賴瀏覽器擴充功能生態（廣告攔截器、優惠券外掛等）且同時使用上述五套 AI agent 產品之一的使用者，都在潛在影響範圍內。Comet、Opera Neon、Claude in Chrome 三項發現目前僅依賴 Forever Security 單方技術說明，廠商雖已認證付款但未公布明確修補版本與時間，建議持續關注三家廠商後續公告。

對正在評估或已部署瀏覽器內建 AI agent 的團隊而言，這起事件的意義不只是「裝了對的擴充功能」，而是點出一個更根本的問題：一旦某個軟體元件被賦予「能操作整台機器」的能力，決定要不要信任一則指令的判準，如果只靠「這則指令來自哪個網域」，就永遠會有辦法被繞過。

## 今日收穫

過去看瀏覽器擴充功能的風險，多半聚焦在「擴充功能本身夾帶惡意程式碼、竊取資料」；BragJack 提醒的是另一條路徑——擴充功能完全不需要做任何壞事，只要利用它被允許做的兩個平凡權限（改網頁、改網路請求），劫持瀏覽器與內建 AI agent 之間原本設計來建立信任的那條「單一網域」通道，就能讓合法的 AI agent 變成攻擊者的代理人。這也是為什麼研究團隊要特別區分它跟 prompt injection 不同：防禦重點不是「濾掉惡意提示詞」，而是「這則指令真的來自它聲稱的來源嗎、agent 現在做的事在這個情境下合理嗎」。

## 參考資料

- [Forever Security — BragJack: How We Hijacked 5 Of The World's Most Popular Browsers Using Their Built-In AI Assistants（2026-09-16）](https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants)
- [The Hacker News — One Extension Could Hijack AI Assistants Across Chrome, Comet, Edge, Opera Neon and Claude（2026-09-16）](https://thehackernews.com/2026/09/one-extension-could-hijack-ai.html)
- [Dark Reading — BragJack Attack Can Turn a Browser's Agentic AI Against It](https://www.darkreading.com/endpoint-security/bragjack-browser-agentic-ai)
- [NVD — CVE-2026-0628（Chrome / GlicJack，CVSS 8.8）](https://nvd.nist.gov/vuln/detail/CVE-2026-0628)
- [NVD — CVE-2026-55945（Microsoft Edge，CVSS 4.2）](https://nvd.nist.gov/vuln/detail/CVE-2026-55945)
- [OffSeq Threat Radar — BragJack: $20K in bounty rewards from Anthropic, Perplexity, Google, Microsoft and Opera](https://radar.offseq.com/threat/bragjack-20k-in-bounty-rewards-from-anthropic-perplexity-google-microsoft-and-opera-81ed18b31bb595b4)
