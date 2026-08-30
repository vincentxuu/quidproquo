---
title: "Rivumi 的 TUI 與 CLI：一次 run 在終端機上怎麼被看見"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cli, tui, ux, terminal]
lang: zh-TW
tldr: "Rivumi 的 TUI 與 plain CLI 是同一套 runtime 的兩種使用者介面。CLI 先依 TTY 與旗標選擇呈現方式，runner 再送出事件；TUI 把事件投影成 thinking、tool、approval、verification 與終態。使用者能從畫面分辨 native 與 external runtime，但 UI 不替底層能力背書。"
description: "從使用者視角拆解 Rivumi 的 TUI/CLI：mode routing、runtime lane、事件投影、inline approval、slash command 與 geometry test。"
series:
  name: "Rivumi 架構拆解"
  order: 1
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-tui-cli-ergonomics-en)

打開 Rivumi，使用者先碰到的是終端機介面。你會在這裡輸入任務、選 runtime、看模型思考與工具執行，需要時核准動作，最後拿到成功或失敗的結果。這篇只追這層可見互動。prompt、workspace、tool policy、journal 與 provider protocol 都留給後續專篇。

## 一次互動從 mode routing 開始

`src/rivumi/cli.py` 的 `_terminal_supports_tui()` 先檢查 stdin、stdout、`TERM` 與停用 TUI 的環境變數。bare `rivumi` 在適合的終端機啟動 Textual TUI；`--plain`、`--print` 或被 pipe 的輸入則走純文字路徑。這個分岔只決定怎麼呈現，不會創造第二套 agent loop。

從使用者輸入到畫面，大致經過以下路徑：

```text
prompt / slash command
        │
        ├─ CLI mode routing ──► plain console projection
        │
        └─ RivumiApp ──► runtime selector
                           ├─ native Rivumi lane
                           └─ external CLI lane
                                  │
                                  ▼
                         run events / runtime events
                                  │
                                  ▼
                    transcript + status + approval block
```

`RivumiApp` 不直接猜 runtime 在做什麼。native runner 送出 `RunEvent`，external runner 送出 `ExternalAgentEvent`，conversation runtime 也有自己的事件；TUI 收到後才把它們投影成 transcript 與狀態列。plain CLI 則由 `LiveEventProjection` 把同類事件轉成文字。因此「看到 tool started」代表 runtime 已送出事件，不是 UI 根據 spinner 推測。

## 畫面要讓人分得出 native 與 external lane

互動畫面可選 Rivumi 自己的 native agent，也可把任務交給 Codex、Claude Code 等外部 CLI。兩條 lane 可以共用 transcript 外觀，ownership 卻不同：

- native lane 的 model turn、tool call、verification 與 terminal reason 由 Rivumi runner 產生。
- external lane 的對話與工具生命週期由外部 runtime 擁有，Rivumi 接收其事件並在返回後做 workspace review。

TUI 的責任是把目前 runtime、model、usage、context 與 run 狀態顯示清楚，不能因為外觀一致就把兩條路徑說成同一個 loop。想比較 Codex、Claude Code、Pi 等終端機產品，可從 [Agent CLI 選型指南的 Codex CLI 篇](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)開始。本系列後面的 ExternalCodingRunner 篇只追 Rivumi 的 handoff contract。

## Approval 是 transcript 裡的一次互動

當 runtime 發出 `ApprovalRequest`，`InlineApprovalBlock` 會把 effect、reason 與 preview 放進 transcript，並只顯示該 request 允許的決策。常見結果包括只允許這次、允許目前 session、拒絕與取消；選完後 block 會鎖定，不讓同一個 request 被回答兩次。

這條 failure boundary 很重要：沒有可互動的 TTY、approval block 已失效，或 request 不支援某種 scope 時，介面不能自行升級權限。拒絕是 runtime 可見的結果，取消則終止目前動作；兩者都不應被 UI 改寫成成功。

`tests/test_tui.py` 的 `test_tui_approval_is_attached_inline_and_maps_once_decision` 驗證 inline block 真的映射到一次性允許。`tests/test_cli.py` 的 `test_plain_flag_never_launches_full_screen_tui` 則守住另一側：明確要求 plain mode 時，不會意外開出全螢幕介面。

## Slash command 控制的是互動，不是能力總覽

command palette、completion、help 與 parser 共用 slash-command metadata。`/provider`、`/runtime`、`/usage`、`/context`、`/permissions`、`/compact`、`/remember`、`/rewind` 等入口，讓使用者切換或檢視目前 session；未知命令會在本機被拒絕，不會當作一般 prompt 送給模型。

這裡只應讀成「介面有入口」。`/permissions` 會改變可見的 approval mode，完整的 authority precedence 屬於 permission 專篇。`/compact` 會呈現壓縮結果，summary 與 reinjection 屬於 context 專篇。`/remember` 也不等於已經有語意檢索式長期記憶。TUI 是底層狀態的 projection，不是所有功能成熟度的清單。

## Geometry test 證明版面，沒有證明 daily-driver 穩定

TUI 變更除了 focused test，還要依 README 用 `scripts/render_tui_screenshot.py` 產生 wide、narrow 與 loading 畫面。這能抓出 60-column 終端機換行、status 被擠出畫面、approval preview overflow 等問題。

它證明的是 layout：`tests/test_tui.py` 能在固定 geometry 下看到正確元件，rendered artifact 能交給人檢查。它沒有證明 live provider、OAuth、長對話 rendering、所有 external runtime 或跨 session resume 都可靠。這些路徑必須各自有 focused test 或實際 runtime 證據。

## 接下來怎麼讀

從 UI 可以辨認一次 run 的階段，也能看出 native 與 external lane 的差別；但畫面背後的保證還沒展開。下一篇先追 disposable workspace 與 run bundle，確認任務實際在哪裡執行、最後留下哪些 artifact。之後才進 prompt、native loop、provider、external runtime、tools 與 state。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文 source 與 test path 的 ground truth
- [Rivumi README 的 TUI workflow](https://github.com/vincentxuu/rivumi#set-up-with-uv)——geometry test 與 screenshot review 流程
- [Textual](https://textual.textualize.io/)——Rivumi TUI 使用的終端機 UI framework
- [Typer](https://typer.tiangolo.com/)——CLI command routing framework
