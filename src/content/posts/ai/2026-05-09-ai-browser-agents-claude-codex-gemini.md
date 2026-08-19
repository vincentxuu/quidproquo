---
title: "Claude、Codex、Gemini 都進瀏覽器了：三家 AI Agent 在 Chrome 的路線比較"
date: 2026-05-09
updated: 2026-08-19
category: ai
tags: [ai-agent, chrome-extension, claude, codex, chatgpt-atlas, gemini, browser-agent]
lang: zh-TW
type: deep-dive
tldr: "三家原本走三條路：Anthropic 做擴充、OpenAI 蓋自己的瀏覽器、Google 直接焊進 Chrome。到 2026-08 已經變成兩條——OpenAI 的 Atlas 在 8/9 停止運作，能力收回 ChatGPT 桌面版與 Codex。剩下的分歧是「寄生在 Chrome 上」對「Chrome 本身就是」。"
description: "Claude in Chrome、OpenAI 收掉 Atlas 之後的路線、Gemini in Chrome 三家 AI 瀏覽器 agent 的路線比較與選擇建議，含權限模型與已知安全問題。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 7
---

2026 年初，三家主要 AI 廠商都把 agent 帶進瀏覽器，而且走的路線完全不同：Anthropic 做 Chrome 擴充功能，OpenAI 蓋了自己的瀏覽器 Atlas，Google 直接把 Gemini 焊進 Chrome 本體。

**半年後，這場三方賽局已經收掉一條路。** OpenAI 在 7 月宣布終止 Atlas，並於 **2026-08-09 讓它停止運作**，把瀏覽器 agent 能力收回 ChatGPT 與 Codex。所以「自己蓋一個瀏覽器」這個答案，在市場上被自己的提出者收回了——這件事本身比任何比較表都值得記住。

以下整理現況、路線差異，以及目前該怎麼選。

## Claude in Chrome

Anthropic 走的是「擴充功能」路線，而且到現在仍然只做擴充功能：它是 Chrome 擴充，官方明說不支援其他 Chromium 系瀏覽器，也不支援行動裝置。使用門檻是付費方案（Pro / Max / Team / Enterprise），沒有免費層；Enterprise 預設關閉，要管理員開啟，還能限制只在核可的網域啟用。

設計哲學是 **「meet users where they already are」**：不要求換瀏覽器、不爭奪預設搜尋引擎，以 side panel 形式坐在 Chrome 旁邊。看見的內容跟你一樣，可以點擊、填表、跨 tab 操作、執行多步驟工作流。

**2026-08 的變化是側邊欄本身升級了**：Chrome side panel 現在會開成一個 Claude Cowork session，對話會存進歷史、可以跨桌面／網頁／行動裝置接續，skills 與 connectors 也能在瀏覽器裡用。舊的體驗保留為「classic side panel」，可從選單切回去（錄製工作流目前仍只在 classic 有）。

### 權限模型：名稱改過，要重新對照

這一段很容易照舊文章設定錯。目前是三種模式：

| 模式 | 行為 |
|---|---|
| Manual（手動核准） | 每個動作都問你——舊名是「Ask before acting」 |
| Auto（自動核准） | 逐動作跑安全檢查後自動執行；Cowork 側邊欄的預設值 |
| Skip（略過所有核准） | 不再詢問——**舊名就是「Act without asking」** |

不論哪種模式都禁止的動作是固定的：購買與金融交易、開帳號、處理信用卡／身分證件資料、永久刪除、下單交易，以及「聽從郵件或網頁內容裡的指示」。最後這條是針對 prompt injection 的硬性防線。

### 安全：ClaudeBleed 之後的事還沒完

2026-05，LayerX 揭露名為 **ClaudeBleed** 的漏洞：擴充功能透過 `externally_connectable` 信任 `claude.ai` 這個 **origin**，但不驗證實際的執行 context，所以任何 Chrome 擴充功能——即使零權限——都能注入指令劫持 Claude，代替使用者跨站操作 Gmail、Drive、GitHub。

Anthropic 在 **2026-05-06** 發布 v1.0.70。LayerX 的後續說法是這只是部分修補：新增的是核准 UI 層，而不是驗證訊息來源，切換到「不詢問」模式或走 side panel 初始化路徑仍可繞過。

**2026-07-14，Manifold Security 又公開兩個相關問題**（合成點擊未檢查 `Event.isTrusted`、side panel 的 `skipPermissions=true` 參數），指出他們在 2026-05-21 就回報、到 v1.0.80 仍可重現，而 Anthropic 把兩份回報都關掉了。

要不要用，這是必須自己權衡的一節：**把一個能代表你操作所有已登入服務的 agent 放進瀏覽器，攻擊面就是整個擴充功能生態**。至少該做的是：把權限模式留在 Manual、限制同一個 profile 裡還裝了什麼擴充、敏感工作用另一個 profile。

### 開發者場景：Claude Code 的瀏覽器整合

Claude Code 這條線是分開的：用 `claude --chrome` 啟動或在對談中打 `/chrome`，它會接上同一個擴充功能。支援 Chrome 與 Microsoft Edge，官方文件也提到 Brave、Arc、Vivaldi、Opera 等 Chromium 系瀏覽器會偵測到擴充並建立連線（跟上面「擴充本身只支援 Chrome」不衝突——那是講擴充的支援範圍，這是講 Claude Code 的連線路徑）。需要直接向 Anthropic 訂閱的方案並以 `/login` 登入（用 API key 會停用這個功能），WSL 不支援。

適合：想留在 Chrome、不想換生態系、已經是 Claude 付費使用者的人。
不適合：想要 agent 接管整個瀏覽工作流的重度使用者——Anthropic 故意把它限制在 side panel。

## OpenAI：Atlas 收掉之後

**ChatGPT Atlas 已經終止。** 官方在 2026-07-09 宣布，Atlas 於 **2026-08-09 停止運作**，理由是要把瀏覽器 agent 能力併回 ChatGPT 與 Codex；官方也直說「不希望使用者留在一個不再收安全更新的瀏覽器上」。書籤、開啟的分頁、瀏覽紀錄都不會自動轉移，要自己在期限前匯出。

現在 OpenAI 這條線分成三個入口：

- **ChatGPT 桌面版**：官方指定的「深度 agentic 瀏覽工作」去處，補上了多分頁、下載、導覽改善、帳號登入支援等原本只有瀏覽器才有的東西。
- **ChatGPT 的 Chrome 擴充／側邊欄**：要在 Chrome 裡就地取得協助時用。
- **Codex Chrome 擴充功能**：定位一直沒變，是給開發者的——讓 Codex 利用「你已經登入的瀏覽器 session」操作 LinkedIn、Salesforce、Gmail、公司內部工具，跨 tab 抓 context、用 DevTools，但刻意不接管整個瀏覽器。

值得注意的是設計哲學的轉向。原本 Atlas 押的是**控制整個瀏覽 surface**：agent 能做的事比寄生在別人瀏覽器裡多得多，代價是要使用者換瀏覽器。這個賭注沒有兌現——維護一個瀏覽器的成本（尤其是持續的安全更新）與說服使用者換掉 Chrome 的難度，最後蓋過了整合深度的好處。收回之後，OpenAI 實際上退回到跟 Anthropic 同一條路：**桌面 app + Chrome 擴充**。

適合：需要用 signed-in session 操作 SaaS 工具的開發者（Codex extension）、想要較完整 agentic 瀏覽的 ChatGPT 使用者（桌面版）。
不適合：原本就是衝著 Atlas 來的人——那個產品不在了。

## Gemini in Chrome

Google 是唯一不需要安裝任何東西的——**Gemini 已經內建在 Chrome 裡**。

基礎的 Gemini in Chrome 側邊欄鋪得很廣，支援地區清單很長，涵蓋北美、英國、印度、日本、台灣、澳洲、韓國、巴西、中東等；比較明顯的缺口是歐盟成員國不在清單上。2026-01-28 起在美國先上基於 Gemini 3 的新側邊欄，之後陸續擴到亞太、拉美、非洲與中東。

重點功能 **Auto Browse**（agentic 多步操作：比價、訂房、填表）的門檻則窄得多，而且到現在都沒放寬：**限美國、限 Google AI Pro / Ultra 訂閱、限個人帳號、限英文介面**，官方頁面的措辭是逐步釋出（*gradually releasing*，「可能還沒輪到你」），不是標為實驗性。2026-05 之後 Android 也拿到 auto browse。實際門檻與每日用量上限會變，**以[官方支援頁](https://support.google.com/chrome/answer/16821166)為準**。

設計哲學是 **first-party 整合**：Gemini 不是寄生在 Chrome 上，是 Chrome 的一部分。這帶來幾個別人做不到的事：跨 Google Apps 的深度整合、不需要額外的擴充功能授權步驟、以及像「讓 Gemini 用 Google 密碼管理員替你登入」（密碼不交給 Gemini，可隨時撤銷）這種只有瀏覽器廠商做得到的整合。安全設計上，任務開始前會先給你看一份計畫要你按「開始」，執行中可以隨時「接手／交還」。

代價是綁在 Google 生態裡，而且門檻卡在地區與訂閱。

適合：在美國、Google 重度使用者、AI Pro / Ultra 訂戶、想要零摩擦體驗的人。
不適合：美國以外想用 auto browse 的人、歐盟使用者、跨平台跨生態工作的人。

## 三家比較

| 廠商 | 形式 | 誰能用 | 主要限制 |
|---|---|---|---|
| Anthropic | Chrome 擴充（side panel，現為 Cowork session） | 付費方案（Pro / Max / Team / Enterprise） | 只支援 Chrome、不支援行動裝置；Enterprise 預設關閉 |
| OpenAI | ChatGPT 桌面版 + ChatGPT / Codex 的 Chrome 擴充 | 依方案與地區而定 | **Atlas 已於 2026-08-09 終止**；Codex extension 有地區限制 |
| Google | Chrome 內建 side panel | 側邊欄廣泛開放；Auto Browse 限美國 AI Pro / Ultra | Auto Browse 逐步釋出中；歐盟不在支援清單 |

精確的方案門檻、地區與配額變動頻繁，這裡只給輪廓——真要下決定前請看各家官方頁面（文末參考資料）。

## 整體來說

原本的三條路線代表三種對「agent 該住在哪裡」的答案。半年後，其中一個答案被市場淘汰了：

- **Anthropic**：寄生在使用者既有的瀏覽器，謹慎、漸進、安全模型優先——但外部研究者對「是否夠謹慎」仍有異議。
- **OpenAI**：試過自己蓋瀏覽器，收掉了，退回桌面 app + 擴充功能。用一年時間證明了「為了 agent 換掉整個瀏覽器」這個要求太貴。
- **Google**：用既有的 Chrome 通路把 AI 直接送到所有人桌面——鋪得最廣，但真正的 agentic 能力仍鎖在美國與付費訂閱後面。

選哪個的決策點：

1. **人在哪裡？** Auto Browse 目前只在美國；這一條先篩掉一半的人。
2. **已經付費哪一家？** 三家的 agent 能力都在付費層後面，先看現有訂閱。
3. **要做什麼任務？** 開發者場景、要 signed-in session → Codex extension 或 Claude Code 的 `--chrome`；個人助理、研究／訂行程 → Gemini Auto Browse 或 ChatGPT 桌面版；混在工作流中、保留主導權 → Claude in Chrome。
4. **你能承受多少風險？** 瀏覽器 agent 的攻擊面（惡意擴充、頁面內的 prompt injection）是真實且仍在被揭露的。處理敏感資料時，用專屬 profile、把權限模式調到最保守。

Atlas 的結局說明了一件事：這一輪競爭的勝負手不是「agent 能力多深」，而是「使用者願意改變多少習慣」。答案顯然是：很少。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「瀏覽器自動化與 MCP」系列

## 參考資料

- [Piloting Claude in Chrome – Anthropic](https://www.anthropic.com/news/claude-for-chrome)
- [Claude for Chrome](https://claude.com/claude-for-chrome)
- [Get started with Claude in Chrome – Claude 支援中心](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)
- [Claude in Chrome permissions guide – Claude 支援中心](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide)
- [Claude Cowork 進駐 Chrome side panel – Anthropic](https://claude.com/blog/cowork-chrome-side-panel)
- [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)
- [ClaudeBleed – LayerX（原文已下架，此為 Wayback 存檔）](https://web.archive.org/web/20260508132614/https://layerxsecurity.com/blog/a-flaw-in-claudes-browser-extension-allows-any-extension-to-hijack-it/)
- [Flaw in Claude's Chrome extension – CyberScoop](https://cyberscoop.com/claude-chrome-extension-allows-plugins-to-hijack-ai/)
- [Claude for Chrome extension bypass – Manifold Security（2026-08）](https://www.manifold.security/blog/claude-for-chrome-extension-bypass)
- [Evolving Atlas into ChatGPT for browser-based agentic work – OpenAI Help Center](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work)
- [OpenAI is discontinuing ChatGPT Atlas – 9to5Mac](https://9to5mac.com/2026/07/09/openai-is-discontinuing-chatgpt-atlas-its-standalone-desktop-browser/)
- [Codex Chrome extension – OpenAI Developers](https://developers.openai.com/codex/app/chrome-extension)
- [Putting Gemini to work in Chrome – Google Blog](https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/)
- [Bringing Chrome AI to Android – Google Blog](https://blog.google/products-and-platforms/products/chrome/bringing-chrome-ai-to-android/)
- [Auto browse in Chrome – Google 支援頁](https://support.google.com/chrome/answer/16821166)
- [Gemini in Chrome – Google](https://gemini.google/overview/gemini-in-chrome/)
