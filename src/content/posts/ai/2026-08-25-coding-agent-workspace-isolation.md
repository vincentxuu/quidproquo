---
title: "跟成熟 coding agent 學設計（3）：Workspace 隔離與 path policy"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 3
tags: [coding-agent, harness-engineering, sandbox, path-traversal, git-worktree, tool-use]
lang: zh-TW
description: "拆解 Codex、Claude Code、OpenCode、Pi、OMP 五家的 workspace 隔離與路徑校驗設計，對照 rivumi 的 disposable Git workspace：pinned SHA、SafePathPolicy、以及還缺的 OS 級沙箱。"
tldr: "成熟 agent 的共識是「模型給的路徑一律不可信」，但防線位置不同：Codex 用 OS 級沙箱收尾、Claude Code 在 permission 層逐筆校驗、OpenCode 劃 project 邊界；rivumi 選了 disposable Git workspace 加純 Python 的 SafePathPolicy——保得住來源 repo，保不住主機本身，這個差距就是下一篇 OS 沙箱的主題。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-workspace-isolation-en)

## 設計問題

Coding agent 的每個檔案工具，第一個參數幾乎都是路徑。這條路徑是 LLM 生成的字串——可能拼錯、可能幻覺、也可能被 prompt injection 推著去讀 `.env`、寫 `~/.ssh/authorized_keys`。所以每個 agent 都得回答同一組問題：

1. 模型能不能碰到 workspace 以外的東西？
2. 路徑校驗做在哪一層——工具程式碼、permission 系統、還是作業系統？
3. 就算校驗被繞過，最壞情況的爆炸半徑是什麼？

這三題答案的組合，決定了一個 agent 是「方便」還是「可信」。這篇把五個成熟專案的答案攤開來比，再對照我在 rivumi 上的選擇。

## 五家怎麼做

### Codex：OS 級沙箱才是最後防線

OpenAI Codex 的態度最明確：path 校驗可以做很多層，但真正的保證來自核心的 sandboxing 模組。macOS 上走 Apple Seatbelt——`codex/codex-rs/sandboxing/src/seatbelt.rs#create_seatbelt_command_args` 把工作目錄轉成 `sandbox-exec` 的 policy 參數；底層 policy 寫在 `codex/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl`，第一行實質規則就是 `(deny default)`，註解直接說明靈感來自 Chrome 的 renderer sandbox。

Linux 上走 Landlock + seccomp：`codex/codex-rs/linux-sandbox/src/landlock.rs#install_filesystem_landlock_rules_on_current_thread` 把整個 `/` 設為唯讀、只把 `writable_roots` 加上讀寫權限，再掛 seccomp filter 擋網路 syscall。最值得學的是 fail-closed 那一行——`restrict_self()` 之後檢查 `RulesetStatus::NotEnforced`，如果核心根本不支援 Landlock、policy 沒有真正生效，就直接回 `SandboxErr::LandlockRestrict` 拒絕執行。「沙箱沒生效」不等於「可以不沙箱」。

### Claude Code：permission 層的精細路徑解析

Claude Code 的防線主要在工具與 permission 層。`claude-code-source/src/tools/BashTool/pathValidation.ts#validatePath` 對 Bash 指令裡出現的每個路徑做展開 tilde、resolve、比對 allowed working directories。有個細節很誠實：原始碼註解明說刻意**不做 symlink resolve** 再檢查——因為 macOS 的 `/tmp` 是 `/private/tmp` 的 symlink，先 resolve 反而會讓危險路徑漏掉。同一個檔案裡的 `checkPathConstraints` 和 `validateOutputRedirections` 連輸出重導向都攔。

檔案工具側，`FileEditTool/FileEditTool.ts#validateInput` 先驗絕對路徑與 settings 檔案的特殊限制，再交給 `checkWritePermissionForTool` 走 permission 判定；讀取走 `FileReadTool/FileReadTool.ts` 的 `checkReadPermissionForTool`。另外它有一個很有意思的設計：`EnterWorktreeTool/EnterWorktreeTool.ts#createWorktreeForSession` 可以整個 session 切進一個獨立 git worktree——用版本控制做工作區隔離，而不是硬擋路徑。

### OpenCode：project 邊界 + allow/ask/deny

OpenCode 把邊界定義在 project instance 上。`opencode/packages/opencode/src/project/instance-context.ts#containsPath` 回答「這個路徑算不算專案內」：在 `ctx.directory` 或 `ctx.worktree` 內就算，而且特別處理了非 git 專案 worktree 設為 `/` 會匹配所有絕對路徑的地雷。超出邊界的操作會觸發 `tool/external-directory.ts` 的 external directory 許可流程，最終由 `permission/index.ts` 的 allow / ask / deny 規則評估決定放行、詢問或拒絕。

### Pi：把邊界留給 ExecutionEnv

badlogic/pi-mono 的做法最極簡：工具層只負責把相對路徑正規化成絕對路徑——`pi-mono/packages/agent/src/harness/tools/path-utils.ts#resolveToolPath` 全部委派給 `pi-mono/packages/agent/src/harness/types.ts` 定義的 `ExecutionEnv.absolutePath()` 介面。也就是說 Pi 本體不內建沙箱，邊界由宿主環境（嵌入 Pi 的應用）自己決定。這是刻意的取捨：core 保持小而可測，隔離責任外移。

### OMP：繼承 Pi，加上 worktree 基線

oh-my-pi 作為 Pi 的 fork，沿用同一套 ExecutionEnv 路徑模型，但在 autoresearch 工作流補上了 worktree 基線：`oh-my-pi/packages/coding-agent/src/autoresearch/index.ts` 會記住 baseline commit，discard 時 reset worktree 回基準點，並在不在專用分支上時警告使用者 revert 安全性不完整。

## rivumi 的選擇與差異

rivumi M1 的隔離策略是**disposable Git workspace**，兩個模組撐起來：

**第一層：workspace 本身是拋棄式的固定 commit clone。** `src/rivumi/runtime.py#LocalGitWorkspace.prepare` 要求 base_sha 必須是完整 40 字元 SHA，先 `rev-parse --verify` 確認 commit 存在，再用 `clone --no-hardlinks --no-checkout` 複製（no-hardlinks 確保實體檔案分離），detach HEAD 後還要重新驗證 `rev-parse HEAD` 等於 base_sha 才肯交付。run_dir 也被禁止放在來源 repo 內部。來源 worktree 從頭到尾不被碰，最後產出的是 unstaged patch，由人類審查。

**第二層：所有模型給的路徑過 `src/rivumi/policy.py#SafePathPolicy.resolve`。** 它拒絕絕對路徑、反斜線、NUL byte、`..` traversal、任何段落的 `.git`，最後 resolve 完還要 `relative_to(workspace_root)` 確認沒有從 symlink 逃出去。glob 是 segment-aware 的——`*` 不跨目錄，只有完整的 `**` segment 才會跨，避免 `src/*.py` 意外涵蓋 `src/deep/x.py`。

跟五家比起來，差異很清楚，而且必須誠實講：

- **我沒有 OS 級沙箱。** Codex 的 Landlock/Seatbelt 能限制 process 的 syscall 和檔案系統視野；rivumi 的 clone 只保護來源 repo，workspace 裡跑的檢查命令仍然擁有使用者權限，看得到 host 檔案、能連網路。M1 文件自己就寫明了這條 known limitation，也因此 local verification 預設拒絕執行，必須顯式加 `--unsafe-local-exec`。
- **fail-closed 學到了，但只用在能力宣告上。** Codex 在 kernel 不支援時拒絕執行的精神，rivumi 對應到「未知 provider 的 tool calling 預設停用、需明確斷言能力」；但執行環境本身的 fail-closed 要等 OS 沙箱進來才完整。
- **path policy 比 Pi 嚴、比 Codex 淺。** Pi 把邊界外包，rivumi 和 OpenCode 一樣在應用層劃界，但 rivumi 多了 `.git` 全面禁入和 symlink escape 的 resolve 檢查——代價是這些檢查全是 Python 字串處理，理論上任何 parser bug 都是逃脫口。OS 沙箱沒有這個問題，因為核心不看字串。

## 學術依據

SWE-agent 團隊提出的 ACI（agent–computer interface）概念指出：介面設計直接影響 agent 的成功率與安全性，工具邊界不是實作細節而是設計變數（[Yang et al., 2024](https://arxiv.org/abs/2405.15793)）。Path policy 正是最基礎的 ACI 決策——五家都在「模型表達意圖」與「意圖被執行」之間插了一道程式碼關卡，差別只在關卡的強度。OpenAI 官方也把 sandbox 與 approval 明確列為 Codex 的兩個獨立安全控制（[Codex security docs](https://developers.openai.com/codex/security)），呼應 defense in depth：應用層校驗降低事故機率，OS 沙箱限制事故傷害。

## 改善路線

按優先順序：

1. **OS 級沙箱是最大缺口，也是伏筆。** Codex 的 Landlock（Linux）/Seatbelt（macOS）雙軌、fail-closed 檢查、seccomp 網路過濾，是 rivumi 第二部 #29〈OS 級沙箱〉的直接藍圖；短期替代方案是容器後端（Cloudflare Sandbox 或本地 Docker），M1 文件本來就把它列為 hostile code 的前提。
2. **網路 egress policy。** 目前檢查命令能自由連網，連 secrets 外洩的通道都沒堵。
3. **artifact 秘密掃描。** Patch 和 log 進 artifact bundle 前應掃過 credential 樣式。
4. **保留現有的強項。** Pinned full-SHA、no-hardlinks、HEAD 重驗證、segment glob——這些是五家裡也不常見的嚴謹度，OS 沙箱進來之後仍值得留著當第二道牆。

一句話總結：disposable workspace 解決的是「不要弄髒你的 repo」，OS 沙箱解決的才是「不要弄壞你的機器」。rivumi 已經做到前者，後者是下一戰。

## 參考資料

- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv)](https://arxiv.org/abs/2405.15793)
- [OpenAI Codex — Sandbox & approvals](https://developers.openai.com/codex/security)
- [openai/codex — codex-rs/sandboxing](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [Landlock: unprivileged access control (kernel docs)](https://docs.kernel.org/userspace-api/landlock.html)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
