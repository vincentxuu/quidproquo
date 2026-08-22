---
title: "用 Python 寫私人 coding agent：M5 讓 Codex 與 Claude 訂閱只改隔離副本"
date: 2026-08-21
category: ai
tags: [coding-agent, python, codex, claude-code, sandbox, agent-harness]
lang: zh-TW
type: project
tldr: "不要把已經有 agent loop 的 Codex／Claude CLI 硬塞成 ModelProvider；讓它們只改 disposable working copy，再由自己的 Python harness 驗路徑、patch、來源完整性與測試。"
description: "Python coding agent M5 實戰：如何善用既有 Codex 與 Claude 訂閱，同時保留自己的 harness、source isolation、patch review 與 verification 邊界。"
draft: true
glossary:
  - term: disposable working copy
    definition: "從固定 Git commit 建立、任務結束後只保留 patch 與稽核 artifact 的一次性工作副本；不直接修改來源 repository。"
---

## TL;DR

M4 只證明 Claude Code 的登入與受限 subprocess 能通，離 coding 還很遠。M5 新增 `ExternalCodingRunner`：官方 Codex CLI 或 Claude Code 可以在一次性副本裡完成自己的 agent loop，但 PCA 會先把 Git metadata 移出 child cwd，結束後重新檢查 source、allowlist、完整 patch 與 exact verification。兩條真實訂閱路徑都修好 tiny calculator 並通過 `pytest -q`；它們仍是 local/private external backend，不是可搬到 Cloudflare 的消費者訂閱代理。

## 情境

我已經有自己的 Python `AgentRunner`，也有 Ollama 與遠端 API 的完整 coding E2E。但日常開發時，官方 Codex CLI 與 Claude Code 已登入，若完全不用很可惜。問題是它們本身就有 loop、工具、權限與 context；把它們假裝成一次 `complete()` 的模型 adapter，會變成 agent 包 agent，最後連「誰改了檔案」都說不清楚。

所以 M5 不做 token 搬運，也不反代理 consumer subscription。新的目標很窄：**外部 CLI 可以改一次性副本，但接受或拒絕結果的權力留在 PCA harness。**

## 問題

最初版本看似合理：clone repo、讓 child 改檔、跑 `git diff`、最後 pytest。獨立 review 很快找到三個洞。

第一，child 若先 `git add forbidden.txt`，一般 `git diff` 只看 unstaged change，PCA 可能只看到允許檔案。第二，child 若改 `.git/config` 的 `core.fsmonitor`，PCA 自己執行 `git status` 時反而會觸發 child 指定的 hook。第三，Codex 的 workspace-write sandbox 在某些平台也允許 temp root；若 source 恰好放在 `/tmp`，只保護 clone 並不足以證明 source 沒被動過。更隱蔽的是 ignored `.env`：Git status 仍乾淨，但檔案內容可能已變。

這些都不是 prompt 能解決的問題。「只改這個檔案」是意圖，不是 enforcement。

## 嘗試過程

Codex 的第一個 live run 就提供了很好的反例。fixture 不小心帶著已追蹤 `.pyc`，agent 執行測試後改動 bytecode，path policy 立即拒絕。清掉 fixture 後又產生 untracked `__pycache__`，第二次仍被拒絕。最後把 `PYTHONDONTWRITEBYTECODE=1` 放進 child 的受控環境，第三次才產生單一、可審的 calculator patch。

這段失敗比一次成功更有價值：它證明限制真的在 harness，而不是文章裡。

## 解法

最終資料流如下：

```text
clean source repo
  ├─ hash every entry except .git, including ignored files
  └─ clone exact HEAD → disposable working copy
                       ├─ move .git to PCA-only sibling directory
                       ├─ official Codex or Claude CLI edits files
                       └─ PCA validates source + git control + path + patch
                                              └─ exact check → recheck patch
```

Codex 使用官方 `codex exec --json --ephemeral`，忽略 user config/rules，開 `workspace-write`，並因 child 看不到 `.git` 而加 `--skip-git-repo-check`。Claude Code 只開 `Read,Glob,Grep,Edit`，不開 Bash、Write、WebFetch、WebSearch、MCP 或 subagent；官方 child 仍透過 `HOME` 使用自己擁有的登入，所以這條路明確標成 local/private experimental。

PCA 另外要求兩個 opt-in：`--allow-external-modify` 只允許 child 改 working copy；`--unsafe-local-exec` 才允許最後在 host 跑 trusted repository 的 exact argv。兩者不能混成一個「我同意所有事」。

Git metadata 被搬走後，child 無法靠 staging 藏檔。PCA 在任何 post-run Git 指令前先比對 `HEAD`、index、config 等 control hash，並關閉 fsmonitor/hooks。source 則用 deadline-bound streaming SHA-256 掃描 `.git` 以外所有檔案、目錄與 symlink；ignored `.env` 也在範圍內。verification 後再取一次完整 patch，若測試偷偷改檔就 fail closed。

## 為什麼會這樣

外部 coding CLI 不是不可信模型的一次回覆，而是另一個能讀檔、執行工具、改狀態的 runtime。安全邊界若只畫在 prompt 或 Python protocol 上，就會漏掉 Git index、config hook、temp writable root 與 ignored file。

真正可組合的介面不是「大家都回 JSON」，而是：child 只產生候選 working tree；parent harness 決定候選能不能變成 reviewable artifact。

## 學到的事

善用訂閱不等於把 token 抽出來，也不等於放棄自己的 agent。M5 的 Codex 與 Claude live run 都完成同一個修正、得到相同 patch、通過同一個 pytest，來源 repository 也維持原 SHA 與乾淨狀態。但這只能證明本機 delegated coding；Cloudflare 仍應使用正式 API credential，加上 Container／Sandbox 的 OS 與網路邊界，不能把 consumer login 搬上雲端。

---

## 參考資料

- [OpenAI — Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [OpenAI — Codex authentication](https://developers.openai.com/codex/auth)
- [Anthropic — Claude Code permissions](https://code.claude.com/docs/en/permissions)
- [QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：prompt injection 只能在 harness 層做損害控制](https://quidproquo.cc/posts/ai/2026-08-10-agent-security-harness-layer)
