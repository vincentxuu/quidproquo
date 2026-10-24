---
title: "工具推薦｜photoshop-mcp — 讓 Claude 操作本機 Photoshop，每個編輯都自動留回滾點"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "新發布的開源 MCP server 讓 Claude Code／Cursor／Codex 直接操作 Mac 上的 Photoshop：每次編輯是一個可回滾的 undo step，第一次改動前自動存檔，同一個 session 只會動到同一份文件"
tldr: "photoshop-mcp 是一個 MCP server，讓 Claude（或 Cursor、Codex）透過 AppleScript 直接驅動本機 Photoshop 做分層、調色、去背、匯出。安裝：`git clone` 後跑 `./scripts/install.sh --client claude-code`。解決了「agent 改圖時怎麼不把原始檔案弄壞」的問題——內建自動 checkpoint、文件釘選、逐步回滾。"
series:
  name: "AI Tool of the Day"
  order: 64
---

> 🌏 [English version](/posts/daily/2026-10-25-tool-photoshop-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | photoshop-mcp |
| 類型 | MCP server（stdio） |
| GitHub | [kathan3009/photoshop-mcp](https://github.com/kathan3009/photoshop-mcp) |
| Stars | 0（2026-10-23 剛發布，本文發布時尚無社群採用紀錄） |
| 語言 | JavaScript（Node.js，ESM） |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/kathan3009/photoshop-mcp.git && cd photoshop-mcp && ./scripts/install.sh --client claude-code` |

## 解決什麼問題

你請 Claude 幫忙在 Photoshop 裡做一批調色、去背、裁切，最怕的不是「agent 不會用 Photoshop」，而是它改壞了你沒備份的原始 PSD、或是切換文件時把編輯動作套到你手上正在看的另一張圖上。多數「讓 AI 控制 Photoshop」的方案都停在「能呼叫幾個 API」這一層，沒有處理這類會真的毀掉工作成果的邊界情況。

photoshop-mcp 透過 AppleScript 橋接本機跑的 Photoshop，把每一次操作包成 ExtendScript 交易：失敗就自動回滾成一個 undo step，不會留下半套改動。更關鍵的是三層安全機制——每個 MCP session 會「釘住」第一次動到的文件，就算你後來手動切到別的檔案，agent 的下一步仍對準原本那份；第一次編輯前自動存一份歷史快照加上磁碟上的分層備份（`~/Library/Application Support/photoshop-mcp/checkpoints`，預設留最新 20 份或 7 天）；儲存既有檔案需要明確傳 `overwrite: true`，關閉未儲存的文件需要 `discard: true`。工具呼叫前會先用 `ps_render` 把畫面轉成 sRGB 圖片讓 agent「看到」結果，而不是憑空猜 Photoshop 的狀態。作者在 README 裡列了一整張「Photoshop 這版本的怪癖」對照表（例如在選取群組內建圖層會被吃進群組、300 ppi 文件的像素單位換算），都是實測 Photoshop 27.11 跑出 40 份文件的真實編輯流程後修掉的。

適合場景：攝影師或設計師想讓 agent 幫忙跑一批調色、去背、裁切、轉檔的重複工作，但不想冒著毀掉原始檔案的風險；也適合想研究「MCP 工具怎麼設計安全邊界」的人——它把回滾、釘選、驗證這幾件事做得比「能動就好」細很多。

```diagram
title: 一次編輯請求經過幾層安全檢查
desc: agent 的編輯請求先鎖定目標文件，第一次動到就先建立 checkpoint，執行失敗時自動回滾成一個 undo step。
caption: 簡化示意；省略 ps_exec 的額外 checkpoint 與逾時偵測。
step: agent 發出編輯請求，先鎖定目標文件
step: 是這份文件第一次被編輯，就先建立 checkpoint
step: 不是第一次，直接進入執行
step: 把整個操作包成一個 ExtendScript 交易執行
step: 成功就用 render 驗證結果並回傳；失敗就自動回滾成一個 undo step
---
<svg viewBox="0 0 640 576">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 112V144" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M376 192H428" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 236V268" data-step="3"/>
  <path class="dg-line" d="M520 216V260Q520 268 512 268H288" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 272V292" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 348V372" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M376 416H428" marker-end="url(#arrow-accent)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="196" y="60" width="168" height="52" rx="6"/>
    <text class="dg-label" x="280" y="80" text-anchor="middle" dominant-baseline="central">鎖定目標文件</text>
    <text class="dg-sub" x="280" y="98" text-anchor="middle" dominant-baseline="central">docId pinning</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 148L376 192L280 236L184 192Z"/>
    <text class="dg-label" x="280" y="182" text-anchor="middle" dominant-baseline="central">第一次編輯？</text>
    <text class="dg-sub" x="280" y="204" text-anchor="middle" dominant-baseline="central">這份文件</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="432" y="168" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="188" text-anchor="middle" dominant-baseline="central">建立 checkpoint</text>
    <text class="dg-sub" x="520" y="206" text-anchor="middle" dominant-baseline="central">快照＋分層備份</text>
  </g>

  <circle class="dg-dot" cx="280" cy="270" r="4" data-step="2 3"/>

  <g data-step="4">
    <rect class="dg-box" x="192" y="292" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="312" text-anchor="middle" dominant-baseline="central">執行 ExtendScript 交易</text>
    <text class="dg-sub" x="280" y="332" text-anchor="middle" dominant-baseline="central">整段操作算一個 undo step</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
    <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">執行成功？</text>
    <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">ps_history 回報</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="432" y="392" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="416" text-anchor="middle" dominant-baseline="central">render 驗證＋回傳</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="192" y="492" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="512" text-anchor="middle" dominant-baseline="central">自動回滾</text>
    <text class="dg-sub" x="280" y="532" text-anchor="middle" dominant-baseline="central">還原成一個 undo step</text>
  </g>

  <text class="dg-edge" x="402" y="180" text-anchor="middle" dominant-baseline="central" data-step="2">是</text>
  <text class="dg-edge" x="290" y="256" text-anchor="start" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge dg-text--accent" x="402" y="404" text-anchor="middle" dominant-baseline="central" data-step="5">是</text>
  <text class="dg-edge dg-text--warn" x="290" y="480" text-anchor="start" dominant-baseline="central" data-step="5">否</text>
</svg>
```

## 快速上手

### 安裝

```bash
# 僅支援 macOS，需要已安裝並授權的 Photoshop、Node.js 18+
git clone https://github.com/kathan3009/photoshop-mcp.git
cd photoshop-mcp
./scripts/install.sh --client claude-code   # 或 claude-desktop / cursor / codex

# 重啟 client、打開 Photoshop，請 agent 執行一次 ps_status
# 畫面會跳出 macOS 自動化授權請求，允許即可
```

### 基本用法

```bash
# 透過內建的 psctl CLI 直接測試（不經過 agent）
psctl status                                    # 文件、歷史、EXIF
psctl snapshot depth=2                          # 圖層樹（含穩定 id）
psctl render out=/tmp/look.jpg maxSize=1200     # sRGB 預覽圖，agent 可以「看」
psctl adjustment type=hueSaturation \
  params='{"reds":{"saturation":25}}'           # 建一個色相/飽和度調整層
psctl history action=undo                       # 回滾上一步
```

Agent 透過 MCP 拿到的是同一組 `ps_*` 工具（`ps_status`、`ps_snapshot`、`ps_render`、`ps_adjustment`、`ps_mask`、`ps_history`…），行為完全一致，只是換成自然語言下指令。

### 進階用法

```bash
# 把多個操作包成一個原子 undo step（任一步失敗全部復原）
psctl batch @grade.json

# 預設關閉的 ExtendScript 逃生口，只有明確開啟才能跑任意腳本
PS_MCP_ALLOW_EXEC=1 ./scripts/install.sh --client claude-code --exec
```

## 與現有工具的比較

Photoshop 的 MCP 整合不是新點子，社群裡已經有 [alisaitteke/photoshop-mcp](https://github.com/alisaitteke/photoshop-mcp)（128 個工具、跨平台、內建聊天 UI）這類更成熟的方案。photoshop-mcp 選的是不同的切入點：犧牲平台覆蓋率，把力氣放在「改壞檔案」這個最痛的邊界情況上。

| | photoshop-mcp | alisaitteke/photoshop-mcp |
|---|---|---|
| 平台 | 僅 macOS | Windows + macOS |
| 工具數量 | ~20 個（涵蓋常見編輯操作） | 128 個（含一步到位的「食譜」） |
| 編輯前自動 checkpoint | ✅（歷史快照＋分層磁碟備份） | 依賴 Photoshop 原生 undo |
| 文件釘選（防止切錯檔案） | ✅ | 未見於文件 |
| 預設遙測／分析 | 無 | 預設開啟匿名使用分析（可關閉） |
| 內建聊天 UI | 無，需接 MCP client | 有（`npx ... ui`） |
| 社群採用程度 | 剛發布，0 star | 已上架 MCP Registry，有多語系文件與貢獻者 |

## 注意事項

- **目前只有 1 個發布後的 commit、0 星**：這是本週才上線的新專案，雖然 CHANGELOG 顯示從 2026-10-08 就有實測迭代記錄，但還沒經過大量社群使用驗證，正式環境或重要檔案建議先用拋棄式檔案測過一輪。
- **僅支援 macOS**：靠 AppleScript 驅動 Photoshop，Windows 需要等作者提到的 UXP 外掛方案。
- **`ps_exec`（任意 ExtendScript 執行）預設關閉**：這是刻意的安全邊界，除非你完全信任傳入的腳本，不建議開啟 `PS_MCP_ALLOW_EXEC=1`。
- **只驗證過 Photoshop 27.11**：其他版本未測試，`ps_status`／`doctor` 會標記「此版本未驗證」而不是直接失敗。

## 今日收穫

多數「讓 AI 控制 OO 軟體」的 MCP server 比的是工具數量和功能覆蓋，photoshop-mcp 選的是另一條路：先把「編輯失敗時怎麼不毀掉使用者的檔案」這個最容易被忽略、卻是生產環境裡最致命的問題解完，再對外發佈。工具數量少不一定是缺點，有時候代表作者先把安全邊界想清楚了。

## 參考資料

- [kathan3009/photoshop-mcp — GitHub](https://github.com/kathan3009/photoshop-mcp)
- [photoshop-mcp CHANGELOG](https://github.com/kathan3009/photoshop-mcp/blob/main/CHANGELOG.md)
- [Claude AI Now Controls Photoshop via MCP Integration — emergent.sh](https://emergent.sh/news/claude-ai-now-controls-photoshop-via-mcp)
- [alisaitteke/photoshop-mcp — GitHub（跨平台比較對象）](https://github.com/alisaitteke/photoshop-mcp)
