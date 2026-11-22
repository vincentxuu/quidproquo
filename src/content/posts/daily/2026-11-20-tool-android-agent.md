---
title: "工具推薦｜android-agent — 讓 Agent 操作 Android 手機，比截圖便宜約 10 倍"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "android-agent 是一個 CLI + MCP server，讓 agent 用 Android 無障礙樹讀畫面內容（文字而非截圖）操作手機 app，實測比純截圖方式省約 10 倍 token"
tldr: "android-agent 是一個讓 agent 操作 Android 手機的 MCP server，用無障礙樹把畫面讀成文字清單，不送截圖。安裝：git clone 後跑 python setup.py。解決了手機自動化 agent 每次看畫面都要燒一大筆截圖 token 的問題。"
series:
  name: "AI Tool of the Day"
  order: 84
---

> :globe: [English version](/posts/daily/2026-11-20-tool-android-agent-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | android-agent |
| 類型 | CLI + MCP server |
| GitHub | [nebigoktug/android-agent](https://github.com/nebigoktug/android-agent) |
| Stars | 4（查核時；repo 建立於 2026-11-18，版本 v0.4） |
| 語言 | Python 3.10+ |
| 授權 | MIT（選用的 ADB Keyboard 元件為 GPL-2.0） |
| 安裝 | `git clone` 後 `python setup.py` |

## 解決什麼問題

你想請 agent 幫你操作手機——測一個 app 的某個流程、查個設定、在某個只有手機版才有的頁面裡找資料。目前多數手機自動化 agent 的做法是「看截圖、決定動作、再截圖確認」，每看一次畫面就要把一張圖丟給模型，一次大概 1,500 tokens。手機操作往往要來回看好幾十次畫面，token 帳單和延遲都隨著截圖張數線性往上疊。

android-agent 換了一種讀畫面的方式：它不截圖，而是讀 Android 原生的無障礙樹（accessibility tree），把畫面翻成一份編號的文字清單——「`[5] button "Wi-Fi · HomeNetwork"`」這種格式——agent 只要回「tap 5」。README 附的 BENCHMARK.md 給了實測數字：6 個日常任務（設定、YouTube 搜尋、計算機、時鐘、Play Store、地圖）總共 19 次畫面讀取，文字清單方式總共燒了約 2,700 tokens，同樣流程全部用截圖要燒約 28,500 tokens——差距接近 10 倍。只有在文字清單看不出東西的場合（遊戲、部分 Flutter app、地圖）才會退回截圖或 OCR。

適合場景：想幫手機 app 寫一個會自己操作的測試／客服／代辦 agent，但不想為了讀畫面燒掉大半 context；或者想在舊手機、沒有桌機的環境（例如純 Termux）跑一個能自己操作手機的 agent。

```diagram
title: android-agent 的點擊前重新確認（blind-tap guard）
desc: Agent 先讀畫面拿到編號清單，決定要點的項目後，android-agent 會在真正點擊前重新讀一次畫面，確認畫面沒變才執行點擊。
step: Agent 請求讀取目前畫面
step: android-agent 回傳編號文字清單
step: Agent 決定要點擊的項目編號
step: android-agent 點擊前重新讀一次畫面
step: 畫面與剛才一致，才送出點擊
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="376"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="376"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="376"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="108" text-anchor="middle" dominant-baseline="central">讀取目前畫面</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">回傳編號文字清單</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 208H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="196" text-anchor="middle" dominant-baseline="central">決定要點第 5 項</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 252H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="430" y="240" text-anchor="middle" dominant-baseline="central">點擊前重新讀一次畫面</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M540 296H328" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="434" y="284" text-anchor="middle" dominant-baseline="central">畫面一致，執行點擊</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="156" rx="2" data-step="3 4 5"/>
  <rect class="dg-box" x="540" y="240" width="8" height="68" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">android-agent</text>
  <rect class="dg-box dg-box--link" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Android 手機</text>
</svg>
```

## 快速上手

### 安裝

從電腦操作（最簡單）：

```bash
# 先裝 adb
winget install Google.PlatformTools    # Windows
brew install android-platform-tools     # macOS
sudo apt install adb                    # Linux

# 手機上：設定 → 關於手機 → 連點 7 次「版本號碼」開啟開發者選項
# 開發者選項裡打開「USB 偵錯」，接 USB 線並在手機上按「允許」

git clone https://github.com/nebigoktug/android-agent
cd android-agent
python setup.py
```

不用電腦、直接在手機上跑（Termux）：

```bash
# F-Droid 裝 Termux（不要用 Play Store 版，版本太舊）
pkg install -y git python android-tools
git clone https://github.com/nebigoktug/android-agent && cd android-agent
python setup.py
```

註冊成 Claude Code 的 MCP server：

```bash
claude mcp add phone -- python /path/to/android-agent/mcp_server.py
```

### 基本用法

```bash
python phone.py screen                 # 讀目前畫面（之後只回傳變化的部分）
python phone.py tap 5                  # 用上次讀到的編號點擊
python phone.py tap "Bluetooth"        # 或用畫面上即時比對的文字點擊
python phone.py find "開發者選項"       # 自動往下滑，直到找到這個項目
python phone.py type "hello" , key enter   # 用逗號串接多個指令
```

MCP 介面則是直接讓 agent 呼叫這些工具：`screen`、`tap`、`type`、`swipe`、`key`、`open_app`、`open_link`、`list_apps`、`wait`、`screenshot`、`rotation_lock`。

### 進階用法

不透過 agent harness，直接丟一句自然語言指令讓 `agent.py` 自己跑完整個操作迴圈：

```bash
pip install anthropic
export ANTHROPIC_API_KEY=...
python agent.py "打開藍牙，告訴我目前配對了哪些裝置"
```

遇到需要傳訊息、付款、刪除、安裝 app、改帳號設定的步驟，`agent.py` 會先在終端機裡問過你才動作。

## 與現有工具的比較

| | android-agent | 螢幕截圖式手機操作 agent | Appium |
|---|---|---|---|
| 畫面怎麼餵給模型 | 無障礙樹轉文字清單 | 截圖轉圖片 token | UI 元素樹（非 LLM 導向） |
| 每次讀畫面的 token 成本 | 低（實測約 150 tokens/次） | 高（實測約 1,500 tokens/次） | 不適用 |
| MCP 原生支援 | ✓ | 視專案而定 | ✗ 需自己接 bridge |
| 手機單機可跑（免 PC） | ✓ Termux | 通常需要電腦 | ✗ 需起 Appium server |
| 點擊前重新確認（blind-tap guard） | ✓ 內建 | 視專案而定 | 由測試腳本自己處理 |
| 設計目的 | 給 AI agent 操作手機 | 給 AI agent 操作手機 | QA 自動化測試 |

## 注意事項

- **還很早期（v0.4）**：作者只在一支 Xiaomi、Android 16（Termux、無線模式）上手動測過；CI 只在 Windows／macOS／Linux 跑無裝置的測試，沒有涵蓋到各廠牌 Android 機型的 UI 差異，正式排進自動化流程前先自己手動跑一輪。
- **啟用 USB／無線偵錯本身有風險**：這是 Android 開發者選項裡會暴露裝置控制權的設定，只在你信任要連接的電腦時打開，用完記得關掉。
- **選用的伴隨 App 需要無障礙權限**：伴隨 App 能讓讀畫面從約 3 秒降到約 0.4 秒，但無障礙權限本身能讀到畫面上幾乎所有內容，README 也直說「這是敏感權限」；只在信任這支 App 的來源時安裝。
- **授權混用**：主專案是 MIT，但選用安裝的 ADB Keyboard 元件是 GPL-2.0（第三方套件 by senzhk），商用整合前留意兩者授權邊界。

## 今日收穫

多數「讓 AI 操作螢幕」的工具預設都在解一個計算機視覺問題——截圖、辨識座標、再截圖確認。android-agent 的角度是反過來問：這台裝置本來就有一份給螢幕閱讀器用的無障礙樹，裡面已經是結構化文字了，為什麼還要先轉成圖片再讓模型辨識回來?把「讀畫面」這件事留在系統原生就有的資料結構裡，而不是繞一圈變成影像任務，才是 token 省下 10 倍的真正原因——省的不是模型效率,是少繞了一圈不必要的編碼與解碼。

## 參考資料

- [nebigoktug/android-agent — GitHub](https://github.com/nebigoktug/android-agent)
- [android-agent README（原始檔）](https://raw.githubusercontent.com/nebigoktug/android-agent/main/README.md)
- [android-agent BENCHMARK.md（token 成本實測數據）](https://raw.githubusercontent.com/nebigoktug/android-agent/main/BENCHMARK.md)
- [android-agent SKILL.md（agent 使用守則）](https://raw.githubusercontent.com/nebigoktug/android-agent/main/SKILL.md)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
