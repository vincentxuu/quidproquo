---
title: "工具推薦｜AI Slop Meter — 幫你的網站量出「一看就是 AI 做的」有多嚴重"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server + CLI 用 60 多條可解釋規則，從文案、版型、未完成細節三個角度幫網站打「AI slop」分數，每條發現都附 file:line 和可以直接貼給 AI 的修復 prompt"
tldr: "AI Slop Meter 是一個本機執行的 MCP server + CLI，幫網站／專案資料夾打「AI slop」分數並給出修復步驟。安裝：`npx -y aislopmeter https://your-site.com --open` 或 `claude mcp add --scope user aislopmeter -- npx -y aislopmeter mcp`。解決了大家都用同一批 AI 建站工具，做出來的網站長得一模一樣，卻說不出哪裡有問題的窘境。"
series:
  name: "AI Tool of the Day"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-18-tool-aislopmeter-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | AI Slop Meter |
| 類型 | MCP server + CLI（另附瀏覽器 bookmarklet） |
| GitHub | [omergocmen/aislopmeter](https://github.com/omergocmen/aislopmeter) |
| Stars | 2（2026-10-17 剛發布的新專案） |
| 語言 | JavaScript（Node.js ≥ 20） |
| 授權 | MIT |
| 安裝 | `npx -y aislopmeter https://your-site.com --open` |

## 解決什麼問題

這一年大家用 Lovable、Bolt、v0、Replit 這類工具生站的速度變快了，但副作用也很明顯：紫色漸層 hero、發光卡片、Tailwind 預設配色、「不只是 X，更是 Y」的標題句型，到處都長一樣。你自己心裡知道哪裡不對，卻說不出具體是哪一行、哪一個元素，更別說怎麼跟接手修改的 AI 講清楚要改什麼。

AI Slop Meter 把這種「說不出哪裡怪」的直覺拆成 60 多條可解釋的規則，分五大類打分：內容有沒有實質（可查證的事實、真的作品）、文案有沒有陳腔濫調、版型是不是模板臉、有沒有 `href="#"` 和 lorem ipsum 之類沒收尾的細節、以及是不是帶著 Lovable／Bolt／v0 這類建站工具留下的痕跡。它會先讀網站自己的 CSS／JS，裝了 Chrome 或 Edge 的話還會真的打開頁面量對比度、字體、置中比例，而不是憑空猜。每一條發現都附上確切的 `file:line`、一段可以直接貼給你用的 AI 的修復 prompt，也能跑在整包 Claude Code 的 `/mcp__aislopmeter__rescue` 流程裡：掃描、列計畫、動手改、重新掃描、直到分數達標。

適合場景：接手一個用 AI 建站工具生出來的 landing page，想知道具體要改哪裡才不會讓人一看就出戲；或是在 CI 裡加一道門檻，擋掉明顯沒收尾就要上線的頁面。它連 `localhost` 開發中的頁面和專案資料夾都能掃，不是只能對外公開的網站。

## 快速上手

### 安裝

```bash
# 不裝任何東西，先試一次
npx -y aislopmeter https://your-site.com --open

# 裝進 Claude Code，之後每個專案都能用
claude mcp add --scope user aislopmeter -- npx -y aislopmeter mcp
```

### 基本用法

```bash
# 掃整個網站（預設最多 30 頁），寫出視覺化報告並打開
npx -y aislopmeter https://example.com --open

# 掃本機開發中的 app
npx -y aislopmeter localhost:3000 --open

# 掃專案資料夾，發現會附上 AI 可以直接改的 file:line
cd my-app
npx -y aislopmeter . --plan
```

MCP 模式下，對你的 AI 說一句話即可：

> Scan my project for AI slop and show me what to fix.

### 進階用法

```json
// .aislopmeter.json：關掉一條不適用的檢查，保留品牌色不被誤判
{
  "disable": ["purple-gradient"],
  "keep": "我們 logo 的紫色和首圖",
  "pages": 30,
  "failAbove": 40
}
```

```yaml
# GitHub Action：PR 裡自動檢查，分數超過門檻就擋下來
- uses: omergocmen/aislopmeter@v0
  with:
    target: .
    fail-above: 40
```

## 與現有工具的比較

| | AI Slop Meter | Lighthouse / PageSpeed | 人工 QA checklist |
|---|---|---|---|
| 針對「AI 建站感」評分 | ✅ | ❌（只看效能／SEO 技術指標） | 看人的經驗 |
| 給出可直接貼給 AI 的修復 prompt | ✅ | ❌ | ❌ |
| 可掃 localhost／專案資料夾 | ✅ | 部分支援 | ✅ 但要手動 |
| 不需要 API key、本機執行 | ✅ | ✅ | — |
| 可接進 CI 擋 PR | ✅（GitHub Action） | ✅ | 需自行規範 |

## 注意事項

- **不是 AI 著作偵測器**：作者自己在 README 說明，完全由 AI 生成的頁面也可能拿到低分，手工頁面也可能分數偏高——它量的是「像不像沒收尾的模板」，不是「是不是 AI 寫的」。
- **校準樣本還小**：目前只在 34 個真實網站上校準過（AI 建站工具做的頁面中位數 25 分，手工頁面約 12 分），土耳其語的檢查規則更新也還不多，規則覆蓋面會隨時間變。
- **瀏覽器量測需要本機裝 Chrome/Edge**：沒有瀏覽器時會退回只看 HTML/CSS，單頁應用（Vite、CRA）那種先吐出空白 `<div id="root">` 的頁面，沒開瀏覽器量測的話分數會失真。

## 今日收穫

一直以為「這個網站看起來很 AI」是主觀感受，看完這個工具才發現它背後其實有清楚、可拆解的訊號——陳腔濫調的標題句型、Tailwind 預設色、`href="#"` 沒收尾——而且作者引用的研究顯示，讓 LLM 自己當裁判判斷「是不是 slop」，跟人類編輯的一致性幾乎等於隨機（κ ≈ 0），反而是這種寫死的、可解釋的規則比讓 AI 自由判斷更準。

## 參考資料

- [omergocmen/aislopmeter — GitHub](https://github.com/omergocmen/aislopmeter)
- [AI Slop Meter 官方網站](https://aislopmeter.netlify.app)
- [aislopmeter — npm](https://www.npmjs.com/package/aislopmeter)
- [CRITERIA.md — 60+ 條檢查規則與來源](https://github.com/omergocmen/aislopmeter/blob/main/docs/CRITERIA.md)
- [CALIBRATION.md — 34 個網站的校準資料](https://github.com/omergocmen/aislopmeter/blob/main/docs/CALIBRATION.md)
