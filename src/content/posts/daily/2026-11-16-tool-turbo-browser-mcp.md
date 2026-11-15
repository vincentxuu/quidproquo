---
title: "工具推薦｜turbo-browser-mcp — 把 Playwright MCP 的 25 個零散工具壓成 10 個批次工具"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Playwright MCP server turbo-browser-mcp 用差異快照、單次填完整張表單、硬碟直傳檔案取代 Base64，把瀏覽器自動化常見的十幾輪工具呼叫壓成一兩輪"
tldr: "turbo-browser-mcp 是把 @playwright/mcp 的 25 個細工具合併成 10 個批次工具的 MCP server。安裝：npx -y turbo-browser-mcp。解決了 agent 做瀏覽器操作時每個小動作都要一輪 MCP round trip、對話歷史越滾越大的問題。"
series:
  name: "AI Tool of the Day"
  order: 80
---

> 🌏 [English version](/posts/daily/2026-11-16-tool-turbo-browser-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | turbo-browser-mcp |
| 類型 | MCP server |
| GitHub | [Tthanh2k6/turbo-browser-mcp](https://github.com/Tthanh2k6/turbo-browser-mcp) |
| Stars | 101（查核時；repo 建立於 2026-11-14） |
| 語言 | JavaScript（Node.js，僅依賴 `playwright-core`） |
| 授權 | MIT |
| 安裝 | `npx -y turbo-browser-mcp`（需 Node ≥ 20） |

## 解決什麼問題

你用 agent 做瀏覽器自動化時，有沒有發現「填一張表單」會吃掉十幾輪工具呼叫？標準做法是：先 snapshot 拿到整棵 ARIA tree，然後一個欄位一個 `fill`，下拉選單再一個 `select_option`，上傳檔案又要單獨一輪，每一輪都要把累積的對話歷史重新送回模型一次。10 個欄位的表單，實測跑了 11 輪、累積重送 7 萬多個 token——多數都是同一棵幾乎沒變的 DOM tree 被反覆原樣複述。

turbo-browser-mcp 的做法是把 `@playwright/mcp` 的 25 個細粒度工具（`browser_click`、`browser_type`、`browser_select_option`……）和 `chrome-devtools-mcp` 的 33 個工具，合併成 10 個批次工具。`inspect_compact` 預設回傳精簡後的互動元素清單，開 `onlyChanged: true` 之後只回傳「這次動作之後變了什麼」而不是整棵樹重新掃一次；`smart_fill_form` 一次吃進整個欄位列表（含 React controlled input、Shadow DOM、iframe 裡的欄位、`contenteditable` 編輯器），一輪填完並同步做完表單驗證；上傳檔案直接傳磁碟路徑，不用把整份 PDF 轉成 Base64 塞進 context。README 附的 benchmark 用 `tiktoken` 實測 token 數：同一張 10 欄表單從 11 輪、7.26 萬累積 token 降到 1 輪、811 token。

更關鍵的是它內建「人在迴圈」的送出防呆：`allowSubmit` 預設是 `false`，凡是看起來像 Submit / Publish / Send / 付款按鈕的動作都會被擋下來，要明確傳 `allowSubmit: true` 才會真的送出。適合場景：需要高頻率、多步驟操作網頁的 agent（資料擷取、自動化測試、表單填寫代理），尤其是 context window 或 token 成本吃緊時；也適合「agent 要先把表單填好但不能自己按送出」這類人工覆核流程。

```diagram
title: 把四段分開呼叫合併成兩次批次呼叫
desc: 標準做法要 snapshot、逐欄位 fill、select_option、upload 四段分開呼叫；turbo-browser-mcp 合併成差異快照與批次填表兩次呼叫。
caption: 輪數與 token 數出自 README benchmark（10 欄表單，tiktoken o200k_base 實測），呼叫段落為簡化示意。
---
<svg viewBox="0 0 640 500">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">改動前</text>
  <text class="dg-sub" x="20" y="44" dominant-baseline="central">11 輪・72,614 累積 token</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">改動後</text>
  <text class="dg-sub" x="340" y="44" dominant-baseline="central">1 輪・811 token</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="352"/>

  <path class="dg-line" d="M160 108V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 184V208" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 260V284" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 184V216" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--ghost" x="36" y="56" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="73" text-anchor="middle" dominant-baseline="central">snapshot</text>
  <text class="dg-sub" x="160" y="93" text-anchor="middle" dominant-baseline="central">全量 ARIA tree</text>

  <rect class="dg-box dg-box--ghost" x="36" y="132" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="149" text-anchor="middle" dominant-baseline="central">fill 欄位</text>
  <text class="dg-sub" x="160" y="169" text-anchor="middle" dominant-baseline="central">逐欄位呼叫 ×10</text>

  <rect class="dg-box dg-box--ghost" x="36" y="208" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="225" text-anchor="middle" dominant-baseline="central">select_option</text>
  <text class="dg-sub" x="160" y="245" text-anchor="middle" dominant-baseline="central">下拉選單另開一輪</text>

  <rect class="dg-box dg-box--ghost" x="36" y="284" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="301" text-anchor="middle" dominant-baseline="central">upload</text>
  <text class="dg-sub" x="160" y="321" text-anchor="middle" dominant-baseline="central">Base64 inline</text>

  <rect class="dg-box" x="356" y="56" width="248" height="128" rx="6"/>
  <text class="dg-label" x="480" y="111" text-anchor="middle" dominant-baseline="central">inspect_compact</text>
  <text class="dg-sub" x="480" y="131" text-anchor="middle" dominant-baseline="central">差異快照 onlyChanged</text>

  <rect class="dg-box dg-box--accent" x="356" y="216" width="248" height="120" rx="6"/>
  <text class="dg-label" x="480" y="267" text-anchor="middle" dominant-baseline="central">smart_fill_form</text>
  <text class="dg-sub" x="480" y="287" text-anchor="middle" dominant-baseline="central">批次填表＋磁碟直傳檔案</text>

  <g class="dg-badge"><circle cx="20" cy="82" r="10"/><text x="20" y="82" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="158" r="10"/><text x="20" y="158" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="234" r="10"/><text x="20" y="234" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="310" r="10"/><text x="20" y="310" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="340" cy="120" r="10"/><text x="340" y="120" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="340" cy="276" r="10"/><text x="340" y="276" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="400" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="428" r="10"/><text x="32" y="428" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="428" dominant-baseline="central">移除：snapshot／逐欄 fill／select／upload 四段分開呼叫</text>
  <g class="dg-badge"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">新增 inspect_compact：只回傳變動的差異快照</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="484" r="10"/><text x="32" y="484" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="484" dominant-baseline="central">新增 smart_fill_form：一次填完表單＋直傳磁碟檔案</text>
</svg>
```

## 快速上手

### 安裝

```bash
# 方式一：npx 直接用（最快）
npx -y turbo-browser-mcp

# 方式二：本機 clone，先跑環境檢查
git clone https://github.com/Tthanh2k6/turbo-browser-mcp.git
cd turbo-browser-mcp
npm install
npm run doctor   # 印出 Node / Playwright / Chromium / CDP 的診斷結果

# 系統沒有 Chrome/Edge/Brave 可用時，裝 Playwright 內建的 Chromium
npx playwright-core install chromium
```

MCP client 設定（Claude Code、Cursor、Codex 共用這個格式）：

```json
{
  "mcpServers": {
    "turbo-browser": {
      "command": "npx",
      "args": ["-y", "turbo-browser-mcp"]
    }
  }
}
```

### 基本用法

```
你：打開 example.com/signup，用這組資料填完註冊表單但先不要送出

Agent 實際會呼叫的工具：
1. tabs_batch { operations: [{ op: "open", url: "https://example.com/signup" }] }
2. inspect_compact { mode: "forms" }                      → 只回傳表單相關元素，約 1 千 token
3. smart_fill_form { fields: [...10 個欄位...], returnSnapshot: true }
   → 一輪填完文字欄位、下拉選單、checkbox，並回傳填完後的快照供確認
4. 真的要送出時才需要額外傳 allowSubmit: true，否則點 Submit 會被擋下
```

### 進階用法

```json
// 擷取網頁內容前先關掉圖片／媒體下載，省流量也省掉無關的 diagnostics 噪音
{
  "name": "network_session",
  "arguments": { "preset": "turbo" }
}
```

```json
// 遇到登入或機器人檢查卡住時，交給人類接手，條件達成後 agent 繼續同一個 tab
{
  "name": "wait_for_human",
  "arguments": {
    "message": "請完成登入或驗證後離開視窗，不要關掉。",
    "selector": "#account-menu",
    "timeoutMs": 120000
  }
}
```

## 與現有工具的比較

| | turbo-browser-mcp | `@playwright/mcp` | `chrome-devtools-mcp` |
|---|---|---|---|
| 工具數量 | 10（批次） | 25（細粒度） | 33（細粒度） |
| 差異快照（只回傳變動部分） | ✅ | ❌（每次全量 ARIA tree） | ❌ |
| 一輪填完整張表單（含 React/Shadow DOM/iframe） | ✅ | ❌（要拆成多輪） | 僅基本 `fill_form` |
| 檔案上傳免 Base64（直傳磁碟路徑） | ✅ | 需另開一輪 `browser_file_upload` | 需另開一輪 `upload_file` |
| 預設人在迴圈的送出防呆 | ✅ | ❌ | ❌ |
| Lighthouse／效能追蹤／heap snapshot | ❌ | ❌ | ✅ |

## 注意事項

- **還是新專案**：repo 建立於 2026-11-14，才 101 顆星，雖然有 CI（Node 20/22 跑 400 多個測試），但 issue 數少不代表沒有邊角案例，正式串接到會動真錢或真資料的流程前自己再測一輪。
- **送出防呆不是防偵測機制**：README 明寫不做 stealth、不 patch `navigator.webdriver`、不解 CAPTCHA。遇到會偵測自動化的網站，要靠 `--open-profile` 讓人類先用一般 Chrome 登入或過驗證，再讓 agent 接手同一個瀏覽器 profile。
- **網路送出防呆預設關閉**：`TURBO_BROWSER_NETWORK_GUARD` 預設是 `false`，因為多步驟 wizard 常常每按一次「下一步」就送一次 POST，打開可能會誤擋正常流程；要用就自己評估流程特性再開。

## 今日收穫

以前覺得 MCP 工具設計「切得越細越靈活」，agent 想做什麼就呼叫什麼。turbo-browser-mcp 的 benchmark 說明了另一面：工具呼叫的真正成本不只是那次呼叫本身的 token，還有每輪都要把整段對話歷史重新送進模型一次——10 輪操作等於 10 次「歷史重播」，累積起來比單輪的輸出 token 貴得多。把會連續發生的動作（填表單的每個欄位、開好幾個分頁）合併成一個批次工具，犧牲的是細粒度的呼叫自由度，換到的是跟輪數成正比省下來的重播成本。這對任何要設計 agent 工具介面的人都是個提醒：先想清楚「這組動作通常會不會連續發生」，而不是預設每個底層操作都該是獨立的一個工具。

## 參考資料

- [Tthanh2k6/turbo-browser-mcp — GitHub](https://github.com/Tthanh2k6/turbo-browser-mcp)
- [turbo-browser-mcp README（原始檔）](https://raw.githubusercontent.com/Tthanh2k6/turbo-browser-mcp/main/README.md)
- [turbo-browser-mcp — npm 套件](https://www.npmjs.com/package/turbo-browser-mcp)
- [MCP server registry 條目（server.json）](https://raw.githubusercontent.com/Tthanh2k6/turbo-browser-mcp/main/server.json)
