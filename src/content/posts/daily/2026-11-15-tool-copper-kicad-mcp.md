---
title: "工具推薦｜Copper — 讓 AI agent 直接在 KiCad 裡設計能下單的 PCB"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server Copper 讓 AI agent 操作 KiCad：找零件、排線、跑 ERC/DRC、產出 JLCPCB 生產檔，把「畫電路板」變成可以對話完成的工作"
tldr: "Copper 是 MIT 授權的 KiCad MCP server，31 個工具，覆蓋從零件搜尋到生產檔匯出的完整 PCB 設計流程。安裝：npx -y copper-kicad setup（需先裝 KiCad 10）。解決了 AI coding agent 碰不到硬體設計、PCB 佈線得自己手動跑 EDA 軟體的問題。"
series:
  name: "AI Tool of the Day"
  order: 79
---

> :globe: [English version](/posts/daily/2026-11-15-tool-copper-kicad-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Copper（copper-kicad-mcp） |
| 類型 | MCP server |
| GitHub | [claynicholson/copper-kicad-mcp](https://github.com/claynicholson/copper-kicad-mcp) |
| Stars | 84（查核時；repo 建立於 2026-11-12） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `npx -y copper-kicad setup`（需先裝 [KiCad 10](https://www.kicad.org/download/)） |

## 解決什麼問題

AI coding agent 現在能寫程式、跑測試、開 PR，但碰到「做一片電路板」就沒辦法了——畫 schematic、挑零件、排線、跑電氣規則檢查（ERC）/設計規則檢查（DRC）、輸出給 JLCPCB 這類工廠用的 Gerber 檔，全部還是得自己打開 KiCad 手動點。對硬體愛好者和小團隊來說，這段流程比寫程式更吃經驗——零件缺貨要換、走線寬度要配合電流、差分線要長度匹配，出錯了板子就是直接報廢。

Copper 用 MCP 把 KiCad 整段流程接給 AI agent：你說「設計一片 USB-C 供電的 ESP32-C3 板子，30×40mm，帶一顆狀態 LED」，agent 就照工程師的做法做——用 net 名稱接腳位（`U1.PA9 → USB_DP`,不是用座標瞎接）、去 LCSC/JLCPCB 搜有現貨的真實零件並帶入 symbol／footprint（EasyEDA 有 3D 模型的話一起帶）、每改一次就重跑 ERC/DRC 並附修法、用 staged router 排線（含長度匹配、差分線、線寬分類、覆銅）、最後產出 schematic／layer／3D 渲染圖供模型自己檢查成果，再打包 JLCPCB（或 PCBWay、OSH Park）要的 Gerber、鑽孔、BOM、置件檔。

Copper 本身不呼叫任何語言模型——用的是你 AI app 本來接的模型，Copper 只是把 KiCad 包成一組工具。適合場景：硬體愛好者想用自然語言跑完整個 PCB 設計迴圈、小型產品團隊要快速出原型、教學場景讓學生看 AI 怎麼一步步符合 ERC/DRC 做板子。

關鍵在這個迴圈怎麼跑：

```diagram
title: Copper 的設計迴圈：排線後先過 ERC/DRC 才匯出
desc: Agent 搜尋零件並匯入後進入佈局與自動排線，每次改動都重跑 ERC/DRC；沒過就帶著修法建議退回排線重做，過了才匯出生產檔。
caption: 簡化示意，實際流程還包含渲染與多次零件替換。
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 108V152" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 204V228" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn" d="M280 320V352" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--accent" d="M410 276H440" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M184 382H108Q100 382 100 374V186Q100 178 108 178H188" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="192" y="56" width="176" height="52" rx="6"/>
    <text class="dg-label" x="280" y="73" text-anchor="middle" dominant-baseline="central">搜零件並匯入</text>
    <text class="dg-sub" x="280" y="93" text-anchor="middle" dominant-baseline="central">LCSC／JLCPCB 現貨</text>
  </g>

  <g>
    <rect class="dg-box" x="192" y="152" width="176" height="52" rx="6"/>
    <text class="dg-label" x="280" y="169" text-anchor="middle" dominant-baseline="central">佈局與自動排線</text>
    <text class="dg-sub" x="280" y="189" text-anchor="middle" dominant-baseline="central">長度匹配・差分線・覆銅</text>
  </g>

  <g>
    <path class="dg-box" d="M280 232L410 276L280 320L150 276Z"/>
    <text class="dg-label" x="280" y="266" text-anchor="middle" dominant-baseline="central">ERC/DRC 全過？</text>
    <text class="dg-sub" x="280" y="288" text-anchor="middle" dominant-baseline="central">每次改動都重跑</text>
  </g>

  <g>
    <rect class="dg-box dg-box--warn" x="184" y="356" width="192" height="52" rx="6"/>
    <text class="dg-label" x="280" y="382" text-anchor="middle" dominant-baseline="central">回報錯誤＋修法建議</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="440" y="252" width="192" height="52" rx="6"/>
    <text class="dg-label" x="536" y="269" text-anchor="middle" dominant-baseline="central">匯出生產檔</text>
    <text class="dg-sub" x="536" y="289" text-anchor="middle" dominant-baseline="central">Gerber・BOM・置件檔</text>
  </g>

  <text class="dg-edge dg-text--warn" x="290" y="336" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="425" y="264" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge dg-text--warn" x="90" y="280" text-anchor="end" dominant-baseline="central">退回修正</text>
</svg>
```

## 快速上手

### 安裝

先裝好 [KiCad 10](https://www.kicad.org/download/)，再依你的 AI app 選一種方式：

```bash
# Cursor / VS Code / Windsurf / Codex / Zed 等（Node.js 18+）
npx -y copper-kicad setup

# Claude Code
claude plugin marketplace add claynicholson/copper-kicad-mcp
claude plugin install copper@copper

# macOS / Linux 一行安裝
curl -LsSf https://raw.githubusercontent.com/claynicholson/copper-kicad-mcp/main/installer/install.sh | sh
```

或手動在 MCP 設定裡加一筆（Cursor、Claude Desktop、Windsurf 共用這個格式）：

```json
{ "mcpServers": { "copper": { "command": "npx", "args": ["-y", "copper-kicad"] } } }
```

### 基本用法

安裝完成後，直接用自然語言下指令，agent 會依序呼叫 Copper 的 31 個工具：

```
你：設計一片 USB-C 供電的 ESP32-C3 板子，帶一顆狀態 LED，尺寸 30 x 40 mm

Agent 實際會做的事：
1. 搜尋 LCSC/JLCPCB 上有現貨的 ESP32-C3 模組、USB-C 座、LED，並匯入 symbol/footprint
2. 用 net 名稱把腳位接起來（而非手動拖座標）
3. 排版並自動佈線，跑 ERC/DRC，把每個錯誤連同修法回報
4. 產出 schematic、layer 渲染圖、3D 渲染圖供確認
5. 匯出 JLCPCB 需要的 Gerber、鑽孔、BOM、置件檔（打包成 zip）
```

### 進階用法

```bash
# 不想直接動到真實專案，先在暫存目錄跑一次體驗
npx -y copper-kicad setup --demo

# 環境有問題時，直接問 doctor 工具要怎麼修
npx -y copper-kicad doctor
```

## 與現有工具的比較

| | Copper | KiCAD-MCP-Server（社群其他方案） | tscircuit |
|---|---|---|---|
| 原生操作 KiCad 專案 | ✓ | ✓（讀寫為主，無自動排線/零件匯入） | ✗（電路用程式碼定義，非 KiCad 原生） |
| 自動搜零件＋匯入現貨零件 | ✓（LCSC/JLCPCB 即時庫存） | ✗ | 部分（需另查零件） |
| 自動排線（長度匹配/差分線/覆銅） | ✓ | ✗ | 需另外處理 |
| 每次改動自動跑 ERC/DRC | ✓ | 視實作而定 | — |
| 直接產出工廠生產檔（Gerber/BOM） | ✓ | 部分 | ✓（匯出 Circuit JSON/Gerber） |
| 綁定特定 AI 模型 | ✗（用你 AI app 原本接的模型） | 視實作而定 | ✗ |

## 注意事項

- **macOS/Linux 安裝路徑較新**：README 明寫 Windows 是「end to end tested」，macOS/Linux 的一行安裝是新加的，失敗要直接回報 issue。
- **會連外部服務**：零件搜尋查 LCSC/JLCPCB/EasyEDA（含 jlcsearch.tscircuit.com 備援），自動排線要下載 Freerouting 和一份 Java runtime（約 120MB，一次性）；設計檔本身不上傳、無 telemetry。
- **仍是新專案**：repo 建立於 2026-11-12，才 84 顆星，issue 數目少不代表沒有坑，正式投產（下單生產）前務必自己再檢查一次 Gerber 和 BOM。

## 今日收穫

一直以為「AI 做硬體」只能停在畫示意圖或寫韌體程式碼這一層，碰到「真正能下單生產的 PCB」就必須回到人工流程。Copper 說明了關鍵其實是把 ERC/DRC 這種強制回饋迴圈接進 agent 的工具呼叫裡——每一步改動都立刻被規則檢查打回來，agent 才能像人一樣反覆修正到「合法」為止，而不是一次生成就定案。這其實是 agent 做任何有硬約束（硬體、法規、資料庫 schema）工作時共通的模式：工具要能即時判定對錯，agent 才敢自動跑完整個迴圈。

## 參考資料

- [claynicholson/copper-kicad-mcp — GitHub](https://github.com/claynicholson/copper-kicad-mcp)
- [Copper README](https://raw.githubusercontent.com/claynicholson/copper-kicad-mcp/main/README.md)
- [coppereda.com — 範例板與生產檔](https://coppereda.com)
- [copper-kicad — npm 套件](https://www.npmjs.com/package/copper-kicad)
- [KiCad 10 官方下載頁](https://www.kicad.org/download/)
