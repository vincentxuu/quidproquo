---
title: "跟成熟 coding agent 學設計（4）：Approval 分級與 audit trail"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 4
tags: [coding-agent, approval, permissions, audit-trail, rivumi, claude-code, codex]
lang: zh-TW
tldr: "五家成熟 agent 都把「動作分級」做成程式碼而不是提示詞：claude-code 用 mode 加規則鏈，codex 把審批與沙箱分成兩個獨立控制、auto-approve 只在沙箱可執行時出現，omp 用 read/write/exec 三層 tier 對上三種 mode，opencode 的規則比對最後一筆命中且預設 ask。rivumi 每個工具必須宣告 effect（read/modify/execute）、未分類直接 fail-closed，審批事件先進 events.jsonl 再投影到畫面，grant 精確到「同一組檔案變更」或「特定 backend」。"
description: "對照 pi、omp、opencode、codex、claude-code 五家原始碼的 permission 分級、session grant 範圍與審批記錄機制，說明 rivumi 的 ToolEffect 分類、durable audit events、process-local scoped grant 怎麼取捨，以及危險指令攔截為什麼是下一步。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-approval-grading-en)

上一篇[總覽](/posts/ai/2026-08-25-coding-agent-design-series-overview)之後講完 loop 和 workspace 隔離，這篇處理第三個地基：哪些動作要問人、問完怎麼記錄、一次同意的範圍有多大。

## 設計問題

Approval 系統要回答三件事：

1. **分級**：哪些動作自動放行、哪些要問？分類放哪——每個工具自己宣告，還是一個中央表？
2. **記錄**：使用者按了 Allow 之後，這個決定去哪裡？事後能不能重現「當時模型要求了什麼、人答了什麼」？
3. **範圍**：「永遠允許」是允許到 session 結束、允許整類效果、還是允許精確到某個檔案？

第三點最容易被低估。太粗（一鍵全開）等於沒有防線，太細（每次都問）使用者會疲乏然後盲按 Yes——兩種都輸。

## 五家怎麼做

### claude-code：mode 為骨幹，規則為例外

反編譯源碼裡每個工具都要回答兩個方法：`claude-code-source/src/Tool.ts#isReadOnly` 宣告唯讀性，`#checkPermissions` 回傳 allow/ask 決策。模式集合在 `claude-code-source/src/types/permissions.ts`：`default`、`acceptEdits`、`plan`、`bypassPermissions`。

寫入決策的核心是 `claude-code-source/src/utils/permissions/filesystem.ts#checkWritePermissionForTool`，優先序固定：先查 deny 規則、再查 ask 規則，接著如果 mode 是 `acceptEdits` 且路徑在工作目錄內就放行，再查 allow 規則，最後 fallback 是 ask。值得注意的是 `#checkPathSafetyForAutoEdit`：就算在 `acceptEdits` 模式，`.claude` 設定檔、`.bashrc` 這類敏感檔案仍強制人工審批——mode 不是萬能通行證。

### codex：審批與沙箱是兩個控制面

`codex/codex-rs/protocol/src/protocol.rs#AskForApproval` 定義四檔：`untrusted`、`on-request`（模型決定何時問）、`granular`、`never`。使用者的回覆在 `protocol.rs#ReviewDecision`，不只是 yes/no：有 `ApprovedForSession`（本次 session 內快取）、`ApprovedExecpolicyAmendment`（順便把這條指令寫進政策）、`Abort`（拒絕並停工）。

最能代表它哲學的是 `codex/codex-rs/core/src/safety.rs#assess_patch_safety`：patch 只在「路徑都在 writable roots 內**且**平台沙箱真的存在」時才 auto-approve；沙箱不可用就退回 AskUser 或直接 Reject。「我判斷安全」不夠，「我有機制強制它安全」才算數。Session 級快取由 `codex-rs/core/src/tools/sandboxing.rs#with_cached_approval` 實作，以 approval key 為單位存進 in-memory store。

### omp：tier 排名對 mode 上限

`oh-my-pi/packages/coding-agent/src/tools/approval.ts#resolveApproval` 是最緊湊的一套：工具宣告自己的 `ToolTier`（`read` < `write` < `exec`），mode 是上限（`always-ask` 只准 read、`write` 准到 write、`yolo` 全開），tier 排名 ≤ mode 上限就放行。關鍵細節：工具沒宣告 approval 時預設 tier 是 `exec`——忘記分類等於最高警戒，不是最低。使用者的 `tools.approval.<tool>: allow|deny|prompt` 覆寫優先於 mode。

### opencode：規則比對，預設 ask

`opencode/packages/opencode/src/permission/index.ts#evaluate` 用 wildcard 規則比對 permission + pattern，`findLast` 取最後一筆命中，**完全沒命中時預設 `{action:"ask"}`**。`index.ts#ask` 先掃規則，任何 pattern 命中 `deny` 直接拒絕連問都不問；需要問時建立 pending request 發事件、用 Deferred 卡住等待回覆，批准的規則累積進 session 的 `approved` 清單。

### pi：核心不管，交給擴充

pi-mono 的核心刻意沒有內建 permission 系統，審批是 extension hook：`pi-mono/packages/coding-agent/examples/extensions/permission-gate.ts` 攔 `tool_call` 事件、用 regex 抓 `rm -rf`／`sudo`，有 UI 就彈 `ctx.ui.select` 確認。它的 fail-closed 在無 UI 分支：headless 模式直接 `{block:true}`——不能問人的環境一律擋下。

## rivumi 的選擇與差異

rivumi 的答案是三層：effect 分類、注入式 policy、durable audit。

**分類是硬性的。** `rivumi/src/rivumi/approvals.py#ToolEffect` 只有 read/modify/execute 三值，`TOOL_EFFECTS` 表逐工具宣告，`#effect_for_tool` 對未分類的新工具直接 raise——跟 omp 一樣 fail-closed，但 rivumi 連「忘了宣告就當最高級」都不給，是明確報錯。讀類自動放行；`apply_patch`、model 要求的 check、最終驗證全部過同一個 `ApprovalPolicy` 介面。

**Policy 是注入的。** `#TTYApprovalPolicy` 提供四個選項：once / session / deny / cancel，session 同意只累加 effect 到 grant 集合；`#HeadlessApprovalPolicy` 根本不接受 stdin，CI 不可能掛在等待輸入上。被拒絕的動作會變成一個 failed `ToolObservation` 讓模型自己調整，cancel 則產生可稽核的 terminal result。

**Audit 先落盤再投影。** `rivumi/src/rivumi/loop.py#_approval` 的順序是固定的：先把 phase 改成 `WAITING_APPROVAL` 存 manifest、發 `approval.requested` 事件，拿到決策後寫 `approval.resolved`，session grant 更新連同 `ApprovalAuditRecord`（request + decision + 時間戳）一起進 `SessionManifest.approval_history`（`rivumi/src/rivumi/session.py#ApprovalAuditRecord`）。重複使用既有 grant 也會記 `approval.reused`。事後重現「模型當時要求了什麼、人答了什麼、哪些是 reuse」，events.jsonl 就是答案。

**Grant 範圍經歷了一次收窄。** M2 時代的 session grant 是 effect 粒度：同意過一次 modify，之後所有 modify 都過。M10 外部 CLI 進來後改成 process-local、精確到 scope：`rivumi/src/rivumi/runtime_semantics.py#ProcessLocalGrant` 文件字串就寫著 non-persistent，且 read 不允許存成 grant；`#decide_permission` 保證 `READ_ONLY` mode 是硬天花板——殘留的 stale grant 不能在切模式後重新啟用 side effect。scope 由 `rivumi/src/rivumi/tui.py#_grant_scope` 決定：外部 backend 是 `external_agent:codex-cli` 這種形式，給 codex-cli 的同意不涵蓋 Claude Code；command grant 是完整 argv。最極端的是 Codex 檔案變更：`rivumi/src/rivumi/codex_app_server.py#_file_change_grant_scope` 把 proposed changes 做 SHA256 指紋，session grant 只涵蓋「一模一樣的那組變更」。

跟五家比起來，rivumi 沒有做的是規則語言（opencode 的 wildcard、claude-code 的 allow/deny rules）和沙箱聯動（codex 的「有沙箱才 auto-approve」）。前者是功能取捨，後者目前靠 disposable clone + 明確的 `--unsafe-local-exec` 承認頂著。

## 工程依據

學術圈沒有一篇經典論文叫「怎麼問人」，但工程端有清楚共識。[Anthropic 的 Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) 把 human-in-the-loop 列為 agent 的核心模式之一：高風險、不可逆的動作應該有人類確認節點，而且這個節點要在程式碼裡，不在提示詞裡。[OpenAI Codex 官方文件](https://developers.openai.com/codex/cli/)則明確把 approval policy 和 sandbox policy 當成兩個獨立維度讓使用者組合——「問不問」和「能不能擋住」互補而非互替。[Claude Code 的權限文件](https://docs.claude.com/en/docs/claude-code/iam)描述了同樣的分層：mode、per-tool rules、settings 階層各自獨立演進。[opencode 的 permissions 文件](https://opencode.ai/docs/permissions/)則把 `allow / ask / deny` 三值決策當成公開契約。

## 還能改善什麼

1. **危險指令攔截是最大缺口，也是第二部 #28〈危險指令攔截與 shell escalation〉的伏筆。** rivumi 目前沒有一般 shell 工具，所以攻擊面小；但外部 CLI backend 把任意指令帶回來了，而 rivumi 對那層只有「問一次」可用。Codex 已示範完整階梯：`codex-rs/core/src/exec_policy.rs` 的 `Decision::Prompt` 規則、`ReviewDecision::ApprovedExecpolicyAmendment` 讓「這次允許」可以升級成「這條規則永久允許」、`tools/runtimes/zsh_fork/unix_escalation.rs` 處理沙箱內失敗後的受控提權。這套值得拆成獨立一篇。
2. **審批事件的 UI 重放**：audit trail 已經在 events.jsonl 裡，但還沒有「給人看的審批歷史」視圖。
3. **規則語言**：等真實使用量證明「每次都問」太煩之前不急，但 opencode 的 findLast-wins 語意值得抄——簡單、可預測、預設 ask。

## 參考資料

- [Building Effective Agents — Anthropic Engineering](https://www.anthropic.com/engineering/building-effective-agents) — human-in-the-loop approval、audit trail 與 rivumi 對照的工程基準。
- [OpenAI Codex CLI 官方文件](https://developers.openai.com/codex/cli/)
- [Claude Code IAM 與權限設定文件](https://docs.claude.com/en/docs/claude-code/iam)
- [opencode Permissions 文件](https://opencode.ai/docs/permissions/)
- [openai/codex（GitHub）](https://github.com/openai/codex)
- [sst/opencode（GitHub）](https://github.com/sst/opencode)
- [badlogic/pi-mono（GitHub）](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi（GitHub）](https://github.com/can1357/oh-my-pi)
