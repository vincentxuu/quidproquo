---
title: "工具推薦｜landmine — 讓 Coding Agent 先知道「這個版本有這個已知 bug」"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI 掃描 lockfile 裡每個套件的精確版本，比對 GitHub 上針對該版本開的 open issue，在 agent 要犯錯之前把已知 bug 和解法塞進它的 context"
tldr: "landmine 是一個 CLI／pre-edit hook／MCP server 三位一體的工具，掃描你的 lockfile 找出每個直接依賴的精確版本，比對 GitHub 上針對那個版本開的 open issue，把已知 bug 和社群解法寫進 AGENTS.md／CLAUDE.md 或在 agent 要犯錯時擋下一次。安裝：`npx landmines scan && npx landmines install --rules`。解決了 agent 不知道自己寫的程式碼撞上一個鎖定版本裡的已知 bug 的問題。"
series:
  name: "AI Tool of the Day"
  order: 62
---

> 🌏 [English version](/posts/daily/2026-10-23-tool-landmine-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | landmine |
| 類型 | CLI + pre-edit hook + MCP server |
| GitHub | [devanshranjan10/landmines](https://github.com/devanshranjan10/landmines) |
| Stars | 7 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx landmines scan && npx landmines install --rules` |

## 解決什麼問題

你的專案用 `package-lock.json` 鎖死 `drizzle-orm@0.36.0`。Agent 要幫你關掉資料庫連線池，很自然地寫出 `await db.$client.end()`——這是官方文件教的寫法，模型訓練時大概也見過。但剛好這個版本的 `drizzle-orm` 在這個呼叫上有個已知 bug，GitHub 上有人在 2024 年就開了 issue，留言裡還有人貼了繞過的寫法。Agent 不知道這件事，因為這不是「API 不存在」或「語法錯誤」，是一個只在這個精確版本才會踩到的坑,而且通常連 lint 和型別檢查都抓不到。

landmine 做的事很直接：讀你的 lockfile（npm／pnpm／yarn／bun／uv／poetry 都支援），對每個直接依賴的精確版本，去 GitHub 搜尋「標題或留言裡寫著就是這個版本」的 open issue,驗證版本真的對得上（排除「已在 X 修好」「升級到 X 後正常」這類反向提及),抽出 issue 在談的程式碼符號，挑一個留言裡被按讚最多的解法，寫進 `.landmine/index.json`。接下來有三種方式把這份「已知地雷清單」交給 agent：寫一段「已知開放 bug」區塊到 AGENTS.md／CLAUDE.md 讓 agent 被動讀到；裝一個 pre-edit hook，在 agent 真的要寫出撞雷的程式碼時擋下這次編輯一次,把 issue 和解法連結塞給它;或者開一個 MCP server，讓 agent 在遇到解釋不了的錯誤時主動查「這是不是我們鎖的版本裡的已知 bug」。

適合場景：團隊用 lockfile 鎖死套件版本、常用 agent 寫程式碼（Claude Code、Codex、Cursor 等）、尤其是依賴的套件版本在模型訓練截止日之後才冒出新 bug 的情況——這正是 agent 自己想不到要去查的地方。

```diagram
title: landmine 怎麼把已知 bug 交給 agent
desc: landmine 掃描 lockfile 比對 GitHub issue 建出索引，再用三種方式交給 agent：寫進 CLAUDE.md、裝 pre-edit hook、或讓 agent 透過 MCP 主動查。
caption: 簡化示意；省略版本比對與 trigger card 產生步驟。
---
<svg viewBox="0 0 800 340">
  <path class="dg-line" d="M120 172H136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M284 172H300" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H444Q452 172 452 164V56Q452 48 460 48H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H444Q452 172 452 180V280Q452 288 460 288H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 48H616Q620 48 620 56V164Q620 172 624 172H628" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 172H628" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 288H616Q620 288 620 280V180Q620 172 624 172H628" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="140" width="100" height="64" rx="6"/>
  <text class="dg-label" x="70" y="163" text-anchor="middle" dominant-baseline="central">Lockfile</text>
  <text class="dg-sub" x="70" y="183" text-anchor="middle" dominant-baseline="central">版本鎖定檔</text>

  <rect class="dg-box dg-box--accent" x="136" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="210" y="163" text-anchor="middle" dominant-baseline="central">landmine scan</text>
  <text class="dg-sub" x="210" y="183" text-anchor="middle" dominant-baseline="central">查 GitHub issue</text>

  <rect class="dg-box dg-box--store" x="300" y="140" width="140" height="64" rx="6"/>
  <text class="dg-label" x="370" y="163" text-anchor="middle" dominant-baseline="central">index.json</text>
  <text class="dg-sub" x="370" y="183" text-anchor="middle" dominant-baseline="central">已知 bug 清單</text>

  <rect class="dg-box" x="464" y="20" width="148" height="56" rx="6"/>
  <text class="dg-label" x="538" y="39" text-anchor="middle" dominant-baseline="central">CLAUDE.md</text>
  <text class="dg-sub" x="538" y="59" text-anchor="middle" dominant-baseline="central">寫入 rules 區塊</text>

  <rect class="dg-box" x="464" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="538" y="163" text-anchor="middle" dominant-baseline="central">pre-edit hook</text>
  <text class="dg-sub" x="538" y="183" text-anchor="middle" dominant-baseline="central">編輯前擋一次</text>

  <rect class="dg-box" x="464" y="260" width="148" height="56" rx="6"/>
  <text class="dg-label" x="538" y="279" text-anchor="middle" dominant-baseline="central">MCP server</text>
  <text class="dg-sub" x="538" y="299" text-anchor="middle" dominant-baseline="central">agent 主動查</text>

  <rect class="dg-box dg-box--accent" x="628" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="702" y="163" text-anchor="middle" dominant-baseline="central">Coding Agent</text>
  <text class="dg-sub" x="702" y="183" text-anchor="middle" dominant-baseline="central">Claude Code 等</text>
</svg>
```

## 快速上手

### 安裝

```bash
# 一次性試用
npx landmines scan                 # 找出目前鎖定版本有哪些 open issue
npx landmines install --rules      # 寫進 AGENTS.md / CLAUDE.md，並加 pre-edit hook

# 團隊用法：裝成 dev dependency，所有人跑同一份索引
npm i -D landmines
npx landmines scan && npx landmines install --rules
```

`scan` 需要一個 `GITHUB_TOKEN`（或 `GH_TOKEN`、`gh auth token`）來呼叫 GitHub 搜尋，查公開 repo 用無權限 token 就夠；`install` 裝好的 hook 本身完全不連網。

### 基本用法

README 裡記錄了一次真實的 Claude Code headless 執行：專案鎖 `drizzle-orm@0.36.0`,提示只說「幫 `src/db.ts` 加一個會關閉 Postgres 連線池的 `closeDb()` 函式」，完全沒提到 bug。Agent 第一次編輯就是 `db.$client.end()`，landmine 的 hook 擋下來：

```
landmine: this edit uses `$client.end` from drizzle-orm@0.36.0, and an open
GitHub issue filed against exactly that version describes a bug there.

drizzle-team/drizzle-orm#3402 · [BUG]: node-postgres client doesn't have end function
Workaround from @cluah (1 reaction):
> const pool = new pg.Pool(…); const db = drizzle(pool);
```

Agent 看到這個之後自己改成用 `pg.Pool` 建連線池再 `pool.end()`，並在回覆裡解釋「我原本想用 `$client.end()`，但 landmine 標出 drizzle-orm 0.36.0 的已知 bug #3402，所以改用建立自己的連線池來避開」。

### 進階用法

裝了 MCP server 之後，agent 遇到解釋不了的行為可以主動查，不需要等 hook 觸發：

```bash
npx landmines install --mcp        # 寫入 .mcp.json
```

```
使用者：「比較兩個 pydantic RootModel 實例時 == 結果不一致，幫我查一下這是不是我們鎖的 pydantic 版本裡的已知 bug」
Agent 呼叫 landmine_search → 回報 pydantic#10544，確實是對著目前鎖定的 2.9.2 版開的
```

CI 或 pre-commit 可以只檢查這次變動的那幾行：

```bash
npx landmines check --staged --exit-code   # 只看 staged 的程式碼，命中就 exit 1
```

## 與現有工具的比較

landmine 作者自己跑的 benchmark（21 個從訓練截止日之後才開的 GitHub issue 建成的任務，Claude Sonnet 5.5）：

| 介入方式 | 通過率 |
|---|---|
| 什麼都不做 | 35/42 |
| 開 Web search（WebSearch + WebFetch） | 36/42 |
| Context7 docs MCP | 35/42 |
| landmine 寫進 CLAUDE.md 的 rules 區塊 | **42/42** |

同一組任務裡，84 次有 web search／Context7 可用的執行，agent 一次都沒想到要用——沒人告訴它「這裡可能有已知 bug」，它就不會主動查。這正是 landmine 想補的洞：不是工具不夠多，是 agent 不知道該往哪個方向懷疑。

| | landmine | Context7（文件 MCP） | GitHub 官方 MCP 搜 issue |
|---|---|---|---|
| 讀你的 lockfile 比對精確版本 | ✅ | ❌ | ❌（需手動搜） |
| 把已知 bug 主動塞進 context（不用 agent 想到要查） | ✅（rules 模式） | ❌ | ❌ |
| 在 agent 寫出撞雷程式碼時攔一次 | ✅（hook 模式） | ❌ | ❌ |
| 涵蓋範圍 | 只有鎖定版本的 open issue | 官方文件（不含 bug 討論） | 依賴 agent 主動搜尋 |

## 注意事項

- **只認精確版本**：issue 裡寫「2.5 之後都有這個問題」或完全沒提版本號，landmine 抓不到；已經修好、但你還沒升級到修復版的 issue 則因為被關閉而被排除在搜尋之外。
- **pre-edit hook 實際上很少攔**：作者自己在 Accuracy 章節誠實列出,180 個真實原始碼檔案裡,未經交叉驗證的符號比對 28 次命中有 25 次不適用；交叉驗證後的 60 個 held-out 檔案裡只攔到 1 次,而且是「API 和選項都對、呼叫形式錯」的 near miss。真正有效的是寫進 CLAUDE.md 的 rules 區塊，不是這個 hook。
- **GitHub 留言是不可信文字**：issue 討論串裡的「解法」是陌生人貼的，landmine 有做 delimiter 隔離並標記可疑連結，但官方也提醒不要讓 agent 不經檢查就直接執行貼出來的指令。
- **`scan` 要連三個外部服務**：npm registry、PyPI、GitHub API，拿掉其中一個依賴的套件名稱和版本就會送出去查詢；`cards`（選用功能）還會把整段 issue 討論串送給你指定的模型供應商。

## 今日收穫

這個工具的 benchmark 結果有個反直覺的地方：作者投入最多工程心力做的 pre-edit hook（符號比對、trigger card、offline 判斷)，效果跟完全不做介入差不多（86% vs 86%）；真正把通過率從 86% 拉到 99% 的，是最簡單的那招——把已知 bug 清單寫成一段文字塞進 CLAUDE.md，讓 agent 在開始寫程式碼之前就被動讀到。對做 agent 工具的人來說，這點值得記下來：模型缺的往往不是「能力」或「查資料的工具」，是「要在對的時間點想到該去查」；主動把線索放進它一定會讀的地方，常常比造一個更聰明的攔截機制更有效。

## 參考資料

- [landmine 官方網站](https://landmine.tech)
- [devanshranjan10/landmines — GitHub](https://github.com/devanshranjan10/landmines)
- [README — Benchmark／Accuracy／How it works](https://raw.githubusercontent.com/devanshranjan10/landmines/main/README.md)
- [drizzle-team/drizzle-orm#3402 — 範例引用的 issue](https://github.com/drizzle-team/drizzle-orm/issues/3402)
- [Model Context Protocol](https://modelcontextprotocol.io)
