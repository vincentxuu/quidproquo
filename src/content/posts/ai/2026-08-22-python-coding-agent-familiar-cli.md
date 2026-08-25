---
title: "用 Python 寫私人 coding agent：M7 讓 CLI 用起來像 Claude Code、Codex、Pi 與 OpenCode"
date: 2026-08-22
category: ai
tags: [coding-agent, python, cli, typer, developer-experience, harness-engineering]
lang: zh-TW
type: project
description: "Python coding agent 的第七個里程碑：positional prompt、cwd 預設、exec/resume 慣例與不保存 secrets 的 provider config。"
tldr: "Agent core 能跑還不代表每天會想用；CLI 要把常用路徑縮成 pca [PROMPT]，同時保留 approval、sandbox 與 verification 邊界。"
draft: false
glossary:
  - term: "positional prompt"
    definition: "不用先寫 --task，直接放在指令位置上的任務文字，例如 pca \"fix tests\"。"
  - term: "default command"
    definition: "沒有明寫子指令時自動採用的入口；這裡是互動 agent，而 resume 等已知子指令仍優先。"
---

## TL;DR

Agent loop、tools、approval、session 與 Cloudflare Sandbox 都做完後，我還是得打這串：

```bash
pca --repo /path/to/repo --provider ollama --model qwen3:4b \
  --task 'Fix the failing test.' --check 'pytest -q'
```

功能完整，但不像每天會用的 coding agent。M7 把主要路徑縮成：

```bash
pca config --provider ollama --model qwen3:4b
cd /path/to/repo
pca "Fix the failing test."
pca -p "Fix it and print JSON."
pca exec "Fix it in headless mode."
pca resume
```

舊的 `pca run`、`--task`、`--repo` 仍可用；縮短的是輸入，不是安全契約。

## 情境：四套 CLI 的共通語言

我直接比對本機安裝的 Claude Code、Codex、Pi 與 OpenCode。它們不是同一套 UI，卻有幾個穩定慣例：目前目錄就是 workspace、第一段自由文字是 prompt、`-m` 選 model、`resume` 延續 session，非互動執行則用 `-p` 或 `exec/run`。

這代表自己的 agent 不需要複製任何一套完整介面，但不該要求使用者每次重新學基本動作。最後採用：

- `pca [PROMPT]`：自己的互動 loop；
- `pca -p [PROMPT]`：Claude／Pi 風格的非互動輸出；
- `pca exec [PROMPT]`：Codex 風格的 headless 入口；
- `pca resume`：沿用既有 durable session；
- `pca -C PATH`：明確切換 repository；
- `pca -m ollama/qwen3:4b`：Pi／OpenCode 常見的 provider/model 短寫。

## 問題：Typer group 會把 prompt 當成 command

原本的 `pca` 是一個 Typer command group，底下已有 `resume`、`run`、`auth`、`backend`。如果直接把 positional argument 加到 group callback，`pca resume` 可能先被 callback 吃成 prompt；反過來，什麼都不改時，`pca "fix tests"` 又會得到 `No such command`。

解法不是把所有 parser 拆掉，而是加一個很窄的 routing layer：

```python
class DefaultCommandGroup(TyperGroup):
    def parse_args(self, ctx, args):
        if not args or first_argument_is_not_a_known_command(args):
            args.insert(0, "chat")
        return super().parse_args(ctx, args)
```

`chat` 是隱藏的 default command。已知的 `resume`、`exec`、`auth` 等永遠優先；其他輸入才進互動入口。Shell completion 與 help 也保留在 group 層，另外用測試鎖住，避免日後新增 command 時回歸。

## 設定可以保存，但 secret 不行

少打參數的另一半是 `pca config`。設定檔只有三個欄位：

```json
{"provider":"ollama","model":"qwen3:4b","api_url":null}
```

API key、OAuth token、account ID 都不在 schema，未知欄位直接拒絕。檔案以 atomic write 與 `0600` 權限保存；symlink、超過 64 KiB、帶帳密或 query 的 URL 也 fail closed。解析順序固定為 CLI、environment、config、built-in default。

還有一個容易忽略的細節：切換 provider 時，不能沿用上一個 provider 的 model 或 API URL。否則從 Ollama 臨時切到 Anthropic，可能把 request 指向錯誤 endpoint。M7 只在 provider 相同時套用成組的 config defaults。

## 短指令沒有放寬 agent harness

`pca "..."` 仍在 pinned disposable clone 工作；修改與 execute 仍要 approval；`pca -p` 與 `pca exec` 不會讀 TTY，也不會偷偷略過 `--unsafe-local-exec`。完成狀態仍必須通過 exact verification，artifact 與 source isolation 也沒有改。

既有 `pca run` 的 model capability 也保持 fail closed：`exec/run` 仍要明確加
`--tool-calling`，不因為換了一個比較順手的名稱就假設所有 endpoint 都支援 tools。

真實 Ollama `qwen3:4b` smoke 也直接使用新指令 `pca exec -C ... "PROMPT"`。模型讀取 calculator、以 `replace_text` 把 subtraction 改成 addition，`pytest -q` 一項測試通過，最終狀態是 `completed / verified`；來源 Git repo 的 HEAD 與 status 都未改。這是一個 tiny fixture 的真實完成證據，不是對任意 coding task 的可靠度宣稱。

## 學到的事

熟悉的 CLI 不是表面糖衣，而是 agent harness 的入口契約。好的捷徑應該移除重複輸入，不應移除 approval、verification 或 credential boundary。真正值得保留的相容性，是讓肌肉記憶可以沿用，同時讓舊 automation 不會突然壞掉。

---

## 參考資料

- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [OpenAI Codex CLI reference](https://developers.openai.com/codex/cli/reference/)
- [Pi coding agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
