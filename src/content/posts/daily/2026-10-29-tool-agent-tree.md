---
title: "工具推薦｜agent-tree — 在終端機側邊即時看、停、換模型你的 Claude Code 子代理人"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, tool, daily, framework-plugin]
lang: zh-TW
description: "Claude Code plugin 在終端機側邊開一個即時樹狀面板顯示所有子代理人，還能直接點擊停止、換模型、插入新指令——不只是看，還能動手改"
tldr: "agent-tree 是一個 Claude Code plugin，在終端機側邊開一個即時樹狀面板顯示所有子代理人；跟同類的純觀察型工具不同，它讓你直接點擊停止某個子代理人、換它的模型、或插入新指令。安裝：`claude plugin install agent-tree --marketplace MikeGT4/agent-tree`。解決了多代理人工作流跑起來後「看不到裡面在幹什麼、也改不了」的問題。"
series:
  name: "AI Tool of the Day"
  order: 67
---

> 🌏 [English version](/posts/daily/2026-10-29-tool-agent-tree-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | agent-tree |
| 類型 | Claude Code plugin |
| GitHub | [MikeGT4/agent-tree](https://github.com/MikeGT4/agent-tree) |
| Stars | 9（2026-10-22 建立，仍在頻繁更新） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `claude plugin install agent-tree --marketplace MikeGT4/agent-tree` |

## 解決什麼問題

你讓 Claude Code 同時開好幾個子代理人分頭做事——一個改前端、一個跑測試、一個查文件。終端機裡能看到的只有一條滾動的 log，哪個子代理人正在卡住、哪個用掉的 token 特別多、哪個其實已經走錯方向，全都要等它跑完才知道，而等到那時候要改已經太晚。

agent-tree 把這個狀態攤開成一個即時更新的側邊面板：主框顯示整個 session 的 effort、context 用量和花費，底下每個子代理人各自一個框，顯示型號、正在做的任務類型、最新的一句回覆。它跟多數「子代理人監控工具」的差異在於不是唯讀——點一個正在跑的子代理人的模型就能換掉它的模型，點進任務欄位打字、按 Enter 就能在它下一步生效前插入新指令糾正方向，框上的 ■ 按鈕可以直接停掉這個子代理人，不用等它自己跑完或手動 Ctrl+C 整個 session。

適合的場景是本來就常開多個子代理人平行工作、又會不耐煩等它們全部跑完才發現某一支走偏的人；如果只偶爾開一兩個子代理人、每次都盯著終端機全程看完，這個面板帶來的差異不大。

```diagram
title: 從「只能看」到「邊看邊改」的差一步
desc: 多數子代理人監控工具停在左邊這條路；agent-tree 多走了右邊這一步，讓你在子代理人還在跑的時候介入。
caption: 依 agent-tree README 與 docs/GUIDE.md 的互動流程簡化。
step: 側邊面板即時顯示每個子代理人的模型、任務、最新回覆
step: 發現某個子代理人方向不對或模型不合用
step: 點擊換模型／打字插入新指令／按 ■ 直接停止——不用等它跑完
---
<svg viewBox="0 0 640 300">
  <circle class="dg-dot" cx="320" cy="8" r="6" data-step="1"/>
  <path class="dg-line" d="M320 14V40" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="100" y="40" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="59" text-anchor="middle" dominant-baseline="central">側邊面板即時樹</text>
    <text class="dg-sub" x="320" y="79" text-anchor="middle" dominant-baseline="central">每個子代理人一個框：模型 / 任務 / 最新回覆</text>
  </g>

  <path class="dg-line" d="M320 96V128" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="100" y="128" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="147" text-anchor="middle" dominant-baseline="central">發現某個子代理人走偏</text>
    <text class="dg-sub" x="320" y="167" text-anchor="middle" dominant-baseline="central">模型不合用、任務方向錯、卡住不動</text>
  </g>

  <path class="dg-line" d="M320 184V216" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="3">
    <rect class="dg-box" x="100" y="216" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="235" text-anchor="middle" dominant-baseline="central">換模型／插新指令／■ 停止</text>
    <text class="dg-sub" x="320" y="255" text-anchor="middle" dominant-baseline="central">子代理人還在跑的當下就能介入，不用等它跑完</text>
  </g>
</svg>
```

## 快速上手

### 安裝

```bash
# 在終端機執行（不是在 Claude Code session 裡）
claude plugin install agent-tree --marketplace MikeGT4/agent-tree

# 之後啟動 Claude Code，面板會自己打開
# 也可以在 session 裡面裝：
# /plugin install agent-tree --marketplace MikeGT4/agent-tree

# 需要 Claude Code 2.1.292 以上，README 標示測過 2.1.312
```

### 基本用法

安裝後不用額外設定，有子代理人啟動時面板會自動開啟；也可以用 slash command 手動控制：

```bash
/agent-tree                  # 手動重新打開面板
/agent-tree style braille    # 切換視覺風格（line / pixel / braille / HUD / ASCII）
/agent-tree clear            # 清空目前的樹，從頭開始記錄
/agent-tree stop             # 關閉面板
```

面板裡用滑鼠點（或 Tab 移焦點、按 Enter）：點一個跑著的子代理人的模型名稱可以換它的模型；點進它的任務欄位打字、按 Enter 會在它下一步生效前送出新指令；點框上的 ■ 直接停止這個子代理人；按 `a` 打開外觀設定（風格、顏色、光暈），`ctrl+x` + `tab` 把焦點移進面板。

### 進階用法（選填）

```bash
# 設定之後新開的子代理人預設用哪個模型（不是改現有某一個）
# 面板裡按 m，或點 "Sub-agent model"，從 0-4 選一個
```

面板上還有一個 advisor 開關（`/advisor`），可以設成預設開或關；它跟模型切換、停止、插入指令共用同一套 hook——只有在你在面板裡做出動作之後才會觸發，plugin 本身每天只做一次版本檢查（讀 `plugin list --json` 跟 GitHub 上的版本號比對，有新版就跑 `plugin update`），不會送出其他資料。

## 與現有工具的比較

同一個月內至少有三個人各自做了「把 Claude Code 子代理人畫成樹」的工具，名字都撞在一起：

| | agent-tree（MikeGT4） | agent-tree（SeanoChang） | cc-agent-tree（niemes） |
|---|---|---|---|
| 建立日期 | 2026-10-22 | 2026-10-07 | 2026-10-09 |
| 語言 | TypeScript | TypeScript | Python |
| 能不能互動 | 可以：換模型、插新指令、停止子代理人 | 唯讀，但能標出異常（失敗、卡住、兩個子代理人改同一檔案）並匯出 SVG/PNG | 唯讀，零外部依賴 |
| 資料來源 | Claude Code hook 事件（spawn／tool call／turn end） | hook 事件 + 讀 subagent transcript | 直接 tail `~/.claude/projects/*/*.jsonl` 既有 transcript |
| 安裝方式 | `claude plugin install` | `claude plugin install`（需要支援 function-hook mod 的版本） | 獨立執行，不透過 plugin 機制 |

三者都只需要幾分鐘裝好試用，差異主要在「只能看」還是「看完還能動手改」。cc-agent-tree 直接讀 Claude Code 自己寫的 transcript 檔，裝起來最輕，但 README 自己就寫明「transcript 格式是內部格式，可能會變」；agent-tree（SeanoChang）多做了異常偵測和匯出；只有 agent-tree（MikeGT4）把「看到問題」跟「當下處理掉」接在一起,這也是它被幾個科技媒體單獨寫文章報導的原因。安裝時務必認清 marketplace 參數是 `MikeGT4/agent-tree`,免得跟另外兩個同名專案搞混。

## 注意事項

- **需要夠新的 Claude Code 版本**：面板要吃 function-hook mod，README 標示最低 2.1.292，太舊的 CLI 裝了也不會顯示側邊欄。
- **新專案、單人維護**：2026-10-22 才建立，目前 9 stars、1 個貢獻者，跟 Claude Code 內部 hook API 綁得很緊——那層 API 本身可能會變,一旦變了這類 plugin 就需要跟著更新。
- **會自動更新**：互動式 session 裡每天會檢查一次版本並自動 `plugin update`，不想要背景自動更新的人要先讀過 [PRIVACY.md](https://github.com/MikeGT4/agent-tree/blob/main/PRIVACY.md) 再決定要不要裝。
- **名字容易搞混**：至少三個同期、同主題但互不相關的專案都叫「agent-tree」或近似名稱，裝之前確認 marketplace 參數指到正確的 repo。

## 今日收穫

同一個月內三個人各自做出「把 Claude Code 子代理人畫成即時樹」的工具,說明多代理人、子代理人並行的用法已經普遍到讓人覺得「看不到裡面發生什麼事」是個值得花時間解決的真問題。但三者裡只有一個把「看見問題」往前推了一步,接到「當場處理掉」——換模型、插指令、直接停止。可觀測性是基本功,能不能在看到問題的瞬間就動手改,才是這類工具真正分出高下的地方。

## 參考資料

- [MikeGT4/agent-tree — GitHub](https://github.com/MikeGT4/agent-tree)
- [agent-tree README（raw）](https://raw.githubusercontent.com/MikeGT4/agent-tree/main/README.md)
- [agent-tree 使用指南 docs/GUIDE.md（raw）](https://raw.githubusercontent.com/MikeGT4/agent-tree/main/docs/GUIDE.md)
- [agent-tree PRIVACY.md](https://github.com/MikeGT4/agent-tree/blob/main/PRIVACY.md)
- [Agent Tree: Live Terminal Monitor for Claude Code Agents — emergent.sh](https://emergent.sh/news/agent-tree-live-terminal-monitor-claude-code)
- [Agent Tree: Live Terminal Monitor for Claude Code Agents — byteiota](https://byteiota.com/agent-tree-live-terminal-monitor-for-claude-code-agents/)
- [SeanoChang/agent-tree — GitHub（同期、不相關的同名比較對象）](https://github.com/SeanoChang/agent-tree)
- [niemes/cc-agent-tree — GitHub（同期、不相關的同名比較對象）](https://github.com/niemes/cc-agent-tree)
