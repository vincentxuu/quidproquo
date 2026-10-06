---
title: "工具推薦｜SpecStory CLI — 幫每一次 agent coding session 自動存成可搜尋的 markdown"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI，包住 Claude Code、Codex、Cursor CLI 等十幾種終端機 coding agent，把每一次對話自動存成本機 markdown，事後可搜尋、可分享，也能反過來煉成新的 agent skill"
tldr: "SpecStory CLI 是一個包住各家終端機 coding agent 的開源 CLI，啟動方式從 `claude` 換成 `specstory run claude`，對話就會自動存到 `.specstory/history/`。安裝：`brew tap specstoryai/tap && brew install specstory`。解決了「AI coding session 關掉就沒了、找不到也分享不出去」的問題。"
series:
  name: "AI Tool of the Day"
  order: 47
---

> 🌏 [English version](/en/posts/daily/2026-10-07-tool-specstory-cli)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | SpecStory CLI |
| 類型 | CLI（終端機 coding agent 的 session 自動存檔 wrapper） |
| GitHub | [specstoryai/getspecstory](https://github.com/specstoryai/getspecstory) |
| Stars | 1,347 |
| 語言 | Go |
| 授權 | Apache-2.0 |
| 安裝 | `brew tap specstoryai/tap && brew install specstory` |

## 解決什麼問題

你跟 Claude Code 或 Codex CLI 聊了一個小時，中間一起除錯出一個很刁鑽的 bug，講清楚了某個架構決定為什麼要那樣做。視窗一關，這些對話就只活在那次 terminal session 裡——下次遇到同樣的問題，你得重新跟 agent 解釋一次背景；想把那段除錯過程分享給同事，也只能截圖或複製貼上一大段文字，格式亂、也搜不到。

SpecStory CLI 的做法很直接：它是一支包住你原本就在用的 coding agent 的 wrapper。啟動指令從 `claude` 換成 `specstory run claude`，agent 該怎麼跑還是怎麼跑，差別只是 SpecStory 在旁邊把每一次互動都存成一份 markdown，放進專案裡的 `.specstory/history/`。預設完全留在本機，你可以選擇登入後同步到 SpecStory Cloud，取得跨機器、跨專案的全文搜尋和團隊分享；不登入就只是多了一份乾淨的本機紀錄。它還有一個叫 Lore 的延伸功能，能把你存下來的 session 歷史「煉」成新的 agent skill——不是憑印象寫規則，而是從你實際跑過、確實有效的操作裡提煉出來。

適合場景：習慣在終端機跑 Claude Code、Codex、Cursor CLI 等工具，常常事後想不起某次對話怎麼解的、或想把一次除錯過程完整留給團隊參考的開發者。如果你只偶爾用一次 agent、從不回頭查歷史，這工具就派不上用場。

## 快速上手

### 安裝

```bash
# macOS / Linux，透過 Homebrew
brew tap specstoryai/tap
brew install specstory

# 確認哪些 agent 已經裝在機器上，SpecStory 能接哪些
specstory check
```

### 基本用法

```bash
# 用 SpecStory 啟動 Claude Code，對話自動存檔
specstory run claude

# 換成 Codex CLI、Cursor CLI 也一樣，只是換個名字
specstory run codex
specstory run cursor

# 把專案裡所有歷史 session 重新渲染成 markdown
specstory sync
```

跑完之後，專案根目錄會多出 `.specstory/history/`，每次對話都是一個獨立的 markdown 檔，時間排序、可以直接用 grep 或任何全文搜尋工具查。

### 進階用法

```bash
# 選擇性登入，把本機 session 同步到 SpecStory Cloud
specstory login
specstory sync

# 用 npx 裝上 Lore skill，把過去的 session 煉成新 skill
npx skills add specstoryai/getspecstory --skill lore
```

裝好 Lore 之後，在 Claude Code 裡打 `/lore`（Codex 用 `$lore`，其他 agent 可以直接說「mine my lore」），它會回頭讀 `.specstory/history`，把你實際跑過、確實有效的操作歸納成證據充足的 skill 草案，經你核可後裝進機器上所有支援的 agent。

## 與現有工具的比較

| | SpecStory CLI | 手動複製貼上保存 | agent 本身的 session resume |
|---|---|---|---|
| 跨工具統一格式（Claude/Codex/Cursor CLI 等） | ✅ | 看個人習慣 | ❌ 各家互不相通 |
| 本機優先、不強制上雲 | ✅ | ✅ | 依工具而定 |
| 可全文搜尋歷史 session | ✅（本機或 Cloud） | ❌ | 大多不支援 |
| 從歷史自動煉成新 skill（Lore） | ✅ | ❌ | ❌ |
| 團隊共享同一份知識庫 | ✅（需登入 Cloud） | ❌ 檔案亂丟 | ❌ |

## 注意事項

- **CLI 開源，IDE 擴充套件不是**：README 裡標得很清楚，Cursor、GitHub Copilot 的擴充套件是 closed source，只有終端機用的 SpecStory CLI 和 Lore skill 這兩塊有公開原始碼。
- **雲端同步要自己決定要不要**：不登入就完全留在本機；一旦 `specstory login` 之後用 `specstory run` 跑，session 會自動推上雲端，記得這點再決定要不要登入。
- **多一層 wrapper 就多一個潛在失敗點**：它是攔截 agent 的輸入輸出來存檔，如果某天目標 agent 升級了 CLI 介面，存檔這塊可能會先壞掉——repo 本身開源，遇到新版本不支援時可以自己送 PR 補 provider。

## 今日收穫

多數「AI 開發記憶」的討論都聚焦在怎麼幫 agent 做長期記憶，SpecStory 反過來解決人的記憶問題——coding agent 的對話本身就是一份有價值的工程紀錄，只是預設沒有人把它存下來。把這份紀錄變成可搜尋的本機檔案，再用 Lore 把「怎麼做」提煉回 skill，等於是讓團隊的工作方式從一次次的對話裡自己長出來，而不是靠人事後手寫文件。

## 參考資料

- [specstoryai/getspecstory — GitHub](https://github.com/specstoryai/getspecstory)
- [SpecStory 官方網站](https://specstory.com/)
- [SpecStory 完整文件](https://docs.specstory.com/overview)
- [Lore：把 session 歷史煉成 agent skill](https://github.com/specstoryai/getspecstory/blob/dev/lore)
