---
title: "OpenClaw 工具篇（一）：一個專屬瀏覽器、三種附著方式，與被標成「不可信」的搜尋結果"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, browser, web-search, automation, playwright, prompt-injection]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 20
tldr: "OpenClaw 的瀏覽器是一個獨立的 agent 專用 profile，跟你的個人瀏覽器完全隔離。而 web_search 的回傳結構裡有一個 externalContent.untrusted 標記——搜尋結果在型別層就被標成不可信的外部內容。"
description: "OpenClaw 的瀏覽器控制與網路搜尋：三種瀏覽器 profile 的差異、plugin 與 allowlist 的啟用陷阱、15 家搜尋供應商的選擇，以及搜尋結果被標記為不可信外部內容的設計。"
draft: false
---

這篇講 agent 怎麼看外面的世界——瀏覽器與搜尋。它們是同一類問題的兩種答案，而且**代價差很多**。

## 瀏覽器是一個獨立的 profile

OpenClaw 會跑一個**專屬的 Chrome／Brave／Edge／Chromium profile**，透過 Gateway 裡的一個小型本地控制服務（只綁 loopback）驅動，**與你的個人瀏覽器隔離**。

官方對它的定位很明確：**這不是你的日常瀏覽器，是一個給 agent 自動化與驗證用的安全隔離面。**

拿到的東西：獨立的 `openclaw` profile（預設橘色識別）、確定性的分頁控制、agent 動作（點擊／輸入／拖曳／選擇）、快照、截圖、PDF，以及**在不回傳整份快照的情況下對頁面可讀文字回答問題**的能力。

## 三種 profile，差別在「誰要在電腦前面」

| Profile | 附著到 | 前提 |
|---|---|---|
| `openclaw` | 受管理的隔離瀏覽器 | 不需要擴充套件 |
| `user` | 你**真正登入中的 Chrome**（走 Chrome DevTools MCP）| Chrome 第一次附著時會跳出「允許遠端偵錯？」的**阻擋式提示**，所以**必須有人在電腦前面** |
| `chrome` | 你真正登入中的 Chrome（走 OpenClaw 瀏覽器擴充套件）| **可以從手機操作、桌前沒人也行**，因為它用擴充套件驅動分頁而不是遠端偵錯埠 |

這張表其實回答了一個很實際的問題：**「我想讓 agent 用我已經登入的帳號，但我人不在」**——答案是 `chrome` profile，不是 `user`。

macOS 上還可以明確地把 Chrome 系列系統 profile 的 **cookie** 複製進受管理的 profile；受管理的瀏覽器仍用自己的使用者資料目錄，**只複製選定的 cookie，local storage 與 IndexedDB 留在原處**。

## 啟用它的兩個坑

**坑一：預設的工具 profile 不含 browser。** `tools.profile: "coding"` 包含 `web_search` 與 `web_fetch`，但**不含完整的 `browser` 工具**。要開得在 profile 階段加：

```json5
{ tools: { profile: "coding", alsoAllow: ["browser"] } }
```

而且有一條順序陷阱：**`tools.subagents.tools.allow: ["browser"]` 單獨不夠**，因為子 agent 政策是在 profile 過濾**之後**才套用的。

**坑二：`plugins.allow` 會讓整個瀏覽器消失。** 升級後 `openclaw browser` 指令不見了、`browser.request` 方法沒了、agent 說瀏覽器工具不可用——常見原因是 `plugins.allow` 清單裡沒有 `browser`，而且設定裡也沒有根層的 `browser` 區塊。

```json5
{ plugins: { allow: ["telegram", "browser"] } }
```

值得記的是替代路徑：**一個明確的根層 `browser` 區塊（任何 `browser.*` 的鍵）也會啟用內建的瀏覽器 plugin**，即使在限制性的 `plugins.allow` 底下——這跟內建頻道的設定行為一致。但 `plugins.entries.browser.enabled=true` 和 `tools.alsoAllow: ["browser"]` **都不能替代 allowlist 成員資格**。

另外：**瀏覽器設定改動需要重啟 Gateway**，plugin 才能重新註冊它的服務。

## 兩層 agent 指引：便宜的與昂貴的

瀏覽器 plugin 附了兩層指引，這個分層設計值得學：

- **`browser` 工具的描述**帶精簡的常駐契約：選對 profile、把 ref 保持在同一個分頁、用 `tabId` 或標籤指定分頁、多步驟工作要載入瀏覽器 skill
- **內建的 `browser-automation` skill** 帶較長的操作迴圈：先查狀態與分頁、替任務分頁貼標籤、動作前先快照、UI 變化後重新快照、過期的 ref 只恢復一次，**遇到登入／2FA／驗證碼或相機麥克風阻擋時回報為需要人工處理，而不是亂猜**

關鍵在於：**plugin 附帶的 skill 只會出現在可用清單裡，完整指令按需載入**——所以日常回合不必付那份 token 成本。這是「常駐的要短，詳細的要按需」的具體實作。

## 搜尋：15 家供應商，兩種結果形狀

`web_search` 用你設定的供應商搜尋並回傳正規化結果，**依查詢快取 15 分鐘**（可設定）。另外附 `x_search`（X 貼文）與 `web_fetch`（輕量 URL 抓取，**永遠在本地跑**）。

供應商大致分兩類：

**結構化片段**：Brave、DuckDuckGo（免金鑰）、Exa、Firecrawl、MiniMax、Ollama、Perplexity、SearXNG（自架、免金鑰）、Tavily

**AI 合成答案加引用**：Codex Hosted Search（用你的 Codex 帳號、不需另外的金鑰）、Gemini、Grok、Kimi、Parallel

有兩個免金鑰選項值得知道：**DuckDuckGo**（非官方的 HTML 整合）與 **SearXNG**（自架的元搜尋，聚合 Google、Bing、DuckDuckGo）。另外 **Parallel Search 有免費版**，走它的免費 Search MCP，給 LLM 最佳化過的密集摘錄。

官方也把 `web_search` 的定位講清楚：**它是輕量的 HTTP 工具，不是瀏覽器自動化**。JS 重的網站或需要登入的，走瀏覽器。

## 搜尋結果在型別層被標成不可信

這是我覺得整篇最值得帶走的設計。`web_search` 在**核心工具邊界**把每個內建與外部 plugin 供應商都正規化成封閉的形狀，而每個成功的形狀裡都帶著這個：

```typescript
externalContent: {
  untrusted: true;
  source: "web_search";
  wrapped: true;
  provider: string;
}
```

**「這是外部內容、不可信、已包裝」被寫進了回傳型別本身**，而不是留給下游自己記得。

這件事的意義在 prompt injection 的脈絡下很清楚：搜尋結果是最典型的注入載體之一，而把「不可信」變成資料結構的一部分，讓每個消費這份結果的地方都必須面對它，而不是靠慣例。

回傳形狀是**封閉的三選一**：`error`、`results`（結構化列表）、`answer`（合成內容加引用）——不會有第四種，呼叫端不用猜。

## 整體來說

瀏覽器與搜尋回答的是同一個需求，但**成本結構相反**：搜尋便宜、快、無狀態，但拿不到需要登入或 JS 渲染的東西；瀏覽器貴、慢、有狀態，但什麼都看得到。

選擇的判準因此不是「哪個比較強」，而是**「這件事需要身分嗎」**——需要登入才看得到的，只有瀏覽器做得到，而且要先決定用哪個 profile（有人在桌前用 `user`，沒人在用 `chrome`）。

至於安全，記住那個 `untrusted: true`。它提醒的事情在你自己寫 agent 時同樣成立：**外部抓回來的內容，最好在型別上就跟你自己的資料分開。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**三種瀏覽器 profile 的差異**（`openclaw` 隔離、`user` 走 DevTools MCP 需要有人在電腦前、`chrome` 走擴充套件可從手機操作）、macOS 的 cookie 匯入限制、**啟用瀏覽器的兩個坑**（`coding` 工具 profile 不含 browser、子 agent 政策在 profile 過濾之後套用、`plugins.allow` 缺 `browser` 會讓整組指令與工具消失，而根層 `browser` 區塊可作為替代啟用路徑）、瀏覽器 plugin 的兩層指引設計（常駐工具描述 + 按需載入的 `browser-automation` skill）、**15 家搜尋供應商**的分類與免金鑰選項、`web_search` 的 15 分鐘查詢快取，以及**搜尋結果在回傳型別裡帶 `externalContent.untrusted` 標記**與封閉的三種結果形狀。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Browser](https://docs.openclaw.ai/tools/browser) — 受管理瀏覽器、profile、plugin 控制與 agent 指引
- [Web search](https://docs.openclaw.ai/tools/web) — 供應商比較、結果形狀與不可信標記
- [Web fetch](https://docs.openclaw.ai/tools/web-fetch) — 輕量 URL 抓取
- [Chrome extension](https://docs.openclaw.ai/tools/chrome-extension) — `chrome` profile 的擴充套件路徑
- [Tools overview](https://docs.openclaw.ai/tools/) — 工具類別與政策入口
