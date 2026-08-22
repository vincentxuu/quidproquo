---
title: "用 Python 寫私人 coding agent：M8 不要再問空白的 Model"
date: 2026-08-22
category: ai
tags: [coding-agent, python, cli, onboarding, ollama, harness-engineering]
lang: zh-TW
type: project
description: "Python coding agent 的第八個里程碑：把 raw Model 輸入改成 provider-aware onboarding，並保持 headless 與 credential 邊界。"
tldr: "第一次執行不是一般 task state；先完成可理解、可取消、可重跑的 provider/model setup，才把任務交給 agent loop。"
draft: true
glossary:
  - term: "onboarding"
    definition: "工具第一次使用時，協助完成必要設定並說明下一步的引導流程。"
  - term: "headless"
    definition: "不依賴互動終端或人工輸入，可由腳本與 CI 穩定執行的模式。"
---

## TL;DR

M7 已讓指令變成 `pca "fix tests"`，但第一次執行仍出現：

```text
What should I change?:
Model:
```

這不是模型壞掉，而是產品層把 adapter 的必要欄位直接丟給使用者。M8 將首次啟動拆成獨立狀態：先選 provider，再選本機偵測到的 Ollama model，保存非機密設定，最後才問 coding task。

## 為何主流 coding agent 不直接問 Model ID

我用隔離設定實跑本機 Claude Code、Codex、Pi 與 OpenCode。它們的畫面不相同，但都把首次使用視為 onboarding：Claude 先進 welcome/theme/auth；Codex 顯示登入方式；Pi 讓 `/login`、`/model` 處理缺少 provider；OpenCode 把 providers、models 與執行命令分開。

共同原則不是「一定要全螢幕」，而是不要讓使用者先理解內部 adapter 名稱，才有辦法交代任務。

## 有界的 Ollama discovery

本機 Ollama 已提供 `qwen3:4b` 與 `qwen3:0.6b`。PCA 只查固定的 loopback endpoint：

```text
http://127.0.0.1:11434/api/tags
```

這條路徑有 1.5 秒 timeout、256 KiB response 上限、最多 100 筆 model、名稱長度與去重限制。HTTP client 不讀 proxy 環境，名稱若含換行、ESC 等 terminal control character 就丟棄。Discovery 失敗只代表沒有建議清單，不會執行 repository code，也不會掃描其他 CLI 的 credential。

## Setup 與 agent loop 必須分層

完成選擇後，設定檔仍只有：

```json
{"provider":"ollama","model":"qwen3:4b","api_url":null}
```

它沿用 atomic `0600` 寫入；API key、OAuth token 與 account secret 不在 schema。若 command line 明確指定 Anthropic，picker 也不能偷換成偵測到的 Ollama；CLI/environment 的 provider 是鎖定條件，不只是預設值。

真正的 `AgentRunner`、tool approval、disposable clone、verification 和 artifacts 完全沒改。這是很重要的 harness 邊界：UI 負責取得有效設定與任務，agent core 只接 provider-neutral contract。

## `-p` 必須永遠不互動

一個容易漏掉的 bug 是：自動化有時仍連著 pseudo-TTY。若只用 `stdin.isatty()` 判斷，`pca -p` 可能突然跳出 setup picker，讓 CI 永遠等待。

M8 把 `--print` 本身定義為 headless。無論是否連著 TTY，只要缺 model 或 prompt 就立即回傳可操作的錯誤：先跑 `pca config --interactive`，或明確傳入 `--provider` 與 `--model`。互動性是 command contract，不是 file descriptor 的偶然狀態。

## 為何全螢幕 TUI 留到下一階段

Provider picker 解決首次啟動，但真正的全螢幕 coding agent 還要同時處理 live events、tool approval、取消、session resume、結果與非互動 fallback。若只畫一個漂亮輸入框，底層仍用同步 prompt，畫面很快就會和 durable state 分裂。

因此 M8 先固定 onboarding contract；M9 再讓裸 `pca` 使用 Textual application，而 `pca -p` 與 `pca exec` 保持穩定的 headless 入口。

## 學到的事

第一次使用不是一般聊天訊息。Onboarding 應先把缺失狀態補齊，並能取消而不留下半份設定；headless 則必須永遠 prompt-free。當 UI、config、provider 與 agent loop 的責任分清楚，畫面升級成 TUI 才不需要重寫核心。

---

## 參考資料

- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [OpenAI Codex CLI reference](https://developers.openai.com/codex/cli/reference/)
- [Pi coding agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
- [Ollama model discovery API](https://docs.ollama.com/api/tags)
- [從模型元件到 Agent Harness](https://quidproquo.cc/ai/2026-08-10-model-component-harness-system/)
