---
title: "跟成熟 coding agent 學設計（13）：CLI 人體工學——讓新工具長得像使用者已經會用的工具"
date: 2026-08-25
category: ai
tags: [coding-agent, cli, developer-experience, codex, claude-code, opencode, rivumi]
lang: zh-TW
type: deep-dive
description: "比對 Claude Code、Codex、Pi、OMP、OpenCode 五家 CLI 的指令表面，解釋 positional prompt、exec/resume、-p print 等慣例，以及 rivumi 如何吸收這些慣例而不犧牲安全邊界。"
tldr: "成熟的 coding agent CLI 都收斂到同一套慣例：positional prompt、-p 是 print、exec 是 headless、resume 是一級指令、-C 換目錄；rivumi 直接繼承這套詞彙，把學習成本壓到接近零。"
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 13
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-cli-ergonomics-en)

## 設計問題：肌肉記憶是最大的既有資產

寫一個新的 coding agent，功能再強都會撞上同一道牆：使用者得先學你的介面。每多一個自創 flag、每多一次「咦，這裡的意思跟我以為的不一樣」，就有一些人放棄。反過來說，如果一個全新工具的第一印象是「這跟我每天在用的東西同一套玩法」，學習成本幾乎歸零——手指自己會動。

這就是 CLI 人體工學的核心：**不要發明詞彙，要繼承詞彙**。Nielsen 的可用性啟發式裡，「一致性與標準」（consistency and standards）排第四，講的就是這件事：平台慣例屬於使用者，不屬於你。[clig.dev](https://clig.dev/) 也把「遵循既有命令列慣例」列為第一原則。

問題是，「慣例」到底是什麼？空談沒有意義，所以我實際讀了五家成熟 coding agent 的原始碼，把它們的指令表面攤開來比對。

## 五家怎麼做

### Claude Code：positional prompt 加四個關鍵 flag

Claude Code 的 commander 定義直接寫明預設行為：「starts an interactive session by default, use -p/--print for non-interactive output」：

- 根指令接受 `[prompt]` positional argument（`claude-code-source/src/main.tsx` 的 program 定義）
- `-p, --print`：「Print response and exit (useful for pipes)」
- `-c, --continue`：續聊當前目錄最近一次對話
- `-r, --resume [value]`：用 session ID 續聊，或開互動選擇器

互動是預設、headless 是 opt-in，而且 headless 模式還疊了一整組只在那裡生效的選項（`--output-format`、`--max-turns`）。

### Codex：usage 字串就是宣言

Codex 用 clap，root usage 寫成 `codex [OPTIONS] [PROMPT]` 與 `codex [OPTIONS] <COMMAND> [ARGS]`（`codex/codex-rs/cli/src/main.rs` 的 `MultitoolCli`）。子指令表裡：

- `Exec(ExecCli)` 帶 visible alias `"e"`——「Run Codex non-interactively」
- `Resume(ResumeCommand)`、`Fork(ForkCommand)` 都是獨立一級指令
- `codex-rs/exec/src/cli.rs` 的 `Cli` 接受 `[PROMPT]` positional，沒給就讀 stdin
- 目錄切換用 `-C/--cd`（`codex-rs/utils/cli/src/shared_options.rs` 的 `SharedCliOptions`）——這是從 `git -C`、`tar -C` 一路傳下來的 POSIX 血統

### Pi：手寫 parser，但詞彙一致

Pi 不用框架，自己 parse，但慣例完全對齊：`--print/-p`、`--continue/-c`、`--resume/-r` 全在 `pi-mono/packages/coding-agent/src/cli/args.ts` 的 `parseArgs` 裡；`--` 之後的參數全部進 `messages` positional。模式拆成 `modes/interactive`（TUI）與 `modes/print-mode.ts`（非互動），互動與 headless 是同一棵樹的兩個 mode，不是兩套程式。

### OMP：fork 連人體工學一起繼承

OMP 是 Pi 的 fork，`oh-my-pi/packages/coding-agent/src/cli/args.ts` 的 parse 邏輯同樣有 `--print/-p`。這件事本身就是論點的一部分：連 fork 別人的專案時，CLI 表面是最不需要動的部分——因為它本來就長對了。

### OpenCode：bare 指令開 TUI，run 才是非互動

OpenCode 的 yargs 定義裡，default command（`$0`）是 `cmd/tui.ts` 的 `$0 [project]`——打 `opencode` 直接進 TUI。非互動路徑是 `cmd/run.ts` 的 `RunCommand`：`"run [message..]"`，message 是 array 型別的 positional，model 用 `-m provider/model` 格式。值得注意的是它的 `run` 子指令裡 `-p` 被讓給了 `--password`（attach 遠端 server 用）——子指令可以有自己的局部詞彙，但 root 層級的慣例仍然清晰。

### 收斂出來的共同詞彙

| 慣例 | Claude Code | Codex | Pi | OMP | OpenCode |
|------|-------------|-------|----|----|----------|
| positional prompt | ✓ | ✓ | ✓ | ✓ | ✓ |
| 互動是預設 | ✓ | ✓ | ✓ | ✓ | ✓ |
| `-p` = print/headless | ✓ | （exec） | ✓ | ✓ | root 無此用法 |
| continue/resume | ✓ | ✓ | ✓ | ✓ | `-c`/`-s` |
| `-C/--cd` 換目錄 | （cwd 即所在） | ✓ | — | — | `--dir` |

五家各自獨立演化，卻收斂在同一組答案上——這不是巧合，是命令列四十年的沉澱。

## rivumi 的選擇與差異

rivumi 是我自己用 Python 寫的 coding agent。M7 stage 的目標就一句話：讓它感覺像日常在用的 coding CLI，但不換掉 loop、不弱化安全邊界（stage doc：rivumi/docs/stages/m7-familiar-cli-ergonomics.md）。

具體做法分三層。

**第一層：預設路由。** Typer 的 command group 預設要求子指令，但 rivumi 要的是「`rivumi 修好這個 bug`」直接能跑。所以有一個自訂的 `DefaultCommandGroup`：第一個參數若不是已知子指令，就悄悄插入隱藏的 `chat` 指令（`src/rivumi/cli.py` 的 `DefaultCommandGroup.parse_args`）。這樣 `rivumi resume`、`rivumi auth` 正常分派，任意文字則變成初始 prompt——和 Codex 的 usage 宣言同一種形狀，只是用 Python 實作。

**第二層：詞彙對齊。** `chat()` 上掛著 `--cd/-C/--repo` 三個 alias（`-C` 學 Codex/git，`--repo` 相容舊自動化）、`--print/-p` 表示非互動輸出 JSON（`src/rivumi/cli.py` 的 `chat`）。`exec` 是 `run` 的 alias，都是 headless 路徑；`resume` 是一級指令，預設值 `"last"`，對應 Claude Code 的 `-c` 心智模型。原本 `-p` 曾經指 provider，M7 特意改掉並留下 migration 錯誤訊息——因為 Claude Code 和 Pi 的使用者會期待 `-p` 是 print。

**第三層：config 不存秘密。** `rivumi config` 只存 `provider`、`model`、`api_url` 三個非秘密欄位（`src/rivumi/cli_config.py` 的 `CliConfig`），schema `extra="forbid"`、原子寫入、權限 0600，API key 一律走環境變數或 credential store。便利性不能換走安全性：省下的是打字，不是審批。

和五家相比，rivumi 刻意**不做**的事也值得記錄：不做全螢幕 TUI、不做 slash command、不做 fuzzy 拼字修正——拼錯子指令時，那個字就照 Codex 的邏輯被當成 prompt。每一項都是有意識的取捨，不是缺工。

## 工程／UX 依據

- **一致性與標準**：Nielsen Norman Group 把「跟平台慣例走」列為十大可用性啟發式的第四條——使用者的時間花在你的任務上，不在你的介面上（[Consistency and Standards](https://www.nngroup.com/articles/consistency-and-standards/)）。
- **命令列慣例總綱**：[clig.dev](https://clig.dev/)（Command Line Interface Guidelines）系統性整理了 exit code、stdin/stdout、flag 命名等慣例，五家的行為幾乎都能對號入座。
- **POSIX 目錄切換血統**：`git -C`、`tar -C` 到 Codex 的 `-C/--cd`，同一個字母服務同一個心智模型三十年。
- **各專案自己的文件**也是佐證：Claude Code 的 [CLI reference](https://docs.claude.com/en/docs/claude-code/cli-reference) 明載 `-p`、`--continue`、`--resume` 的語意；[Codex CLI 文件](https://developers.openai.com/codex/cli/)與 [OpenCode docs](https://opencode.ai/docs/) 同樣把 `exec`／`run` 定位成非互動路徑。

值得強調：這些慣例不是美學偏好。對 agentic CLI 來說，`-p` 是否代表 print，直接決定 CI pipeline 裡一行腳本能不能跑——介面即 API。

## 改善路線

rivumi 已經拿到「看起來熟悉」的分數，下一階段可以往三個方向推：

1. **補齊 continue**：目前只有 `resume [session]`，可加無參數的「續聊最近 session」路徑，對齊 Claude Code 的 `-c`。
2. **session picker**：Claude Code 和 Codex 的 resume 都內建互動選擇器（picker by default）；rivumi 目前只接受 ID 或 `last`。
3. **fork 語意**：Codex 的 `Fork`、Claude Code 的 `--fork-session` 顯示「從舊 session 分岔出新分支」已是公認需求，但 rivumi 的 stage doc 刻意 deferred——改動 durable task 需要 protocol 決策，不該只是 parser 糖。

CLI 人體工學最誠實的檢驗方式：找一個每天用 Claude Code 或 Codex 的人，不看任何文件直接敲你的工具。他們的手指會告訴你答案。

## 參考資料

- [Nielsen Norman Group — Consistency and Standards](https://www.nngroup.com/articles/consistency-and-standards/)
- [Command Line Interface Guidelines (clig.dev)](https://clig.dev/)
- [Claude Code CLI reference](https://docs.claude.com/en/docs/claude-code/cli-reference)
- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)
- [OpenCode documentation](https://opencode.ai/docs/)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（原始碼取證：packages/coding-agent/src/cli/args.ts）
- [openai/codex](https://github.com/openai/codex)（原始碼取證：codex-rs/cli/src/main.rs、codex-rs/exec/src/cli.rs）
- [sst/opencode](https://github.com/sst/opencode)（原始碼取證：packages/opencode/src/index.ts、src/cli/cmd/run.ts）
