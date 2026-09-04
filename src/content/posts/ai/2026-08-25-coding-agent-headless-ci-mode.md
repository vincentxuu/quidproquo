---
title: "跟成熟 coding agent 學設計（21）：Headless 模式與 CI 使用——沒有人可以按 approve 的時候"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 21
tags: [coding-agent, ci, headless, approval, looplane, claude-code, codex]
lang: zh-TW
tldr: "agent 進 CI 後最大的問題是審批：沒有終端機、沒有人可以按 approve。五家的解法收斂成兩條路——把權限決策外包給呼叫端（claude-code 的 control protocol），或直接換掉審批語意（codex 預設 Never 配沙箱、opencode 預設自動拒絕）。looplane 用同一個 AgentRunner loop 注入不同的 ApprovalPolicy：headless 下用 HeadlessApprovalPolicy，不讀 stdin 所以不可能卡住 pipeline，EXECUTE 預設 fail closed。"
description: "對照 pi、omp、opencode、codex、claude-code 五家原始碼，拆解 headless／CI 模式的權限設計：預先授權、自動拒絕、fail closed，以及 looplane 為什麼堅持同一個 loop 兩種介面。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-headless-ci-mode-en)

上一篇談了[工具集設計](/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy)，這篇換一個場景：同一個 agent，從你的終端機搬進 CI pipeline 之後會發生什麼事。

本篇取證範圍：**pi**（badlogic/pi-mono）、**omp**（can1357/oh-my-pi）、**opencode**（sst/opencode）、**codex**（openai/codex 的 Rust workspace）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都是我在本地 clone 實際讀過的。

## 設計問題：進了 CI，誰來按 approve

互動模式下，審批的答案很簡單：跳出對話框，人類按下 allow 或 deny。這個設計隱含三個前提——有一個 TTY、有一個願意等的人類、而且人在現場。搬到 CI runner 上三個前提同時消失：stdin 不是終端機、pipeline 有 timeout、旁邊沒半個人。

所以 headless 模式真正的設計問題不是「怎麼把 UI 拿掉」，而是：**原本由即時對話承擔的審批決策，要搬到哪裡去？** 只有三個候選位置——事先宣告的授權（allowlist、沙箱設定）、即時外包給呼叫端的程式（SDK host）、或一律拒絕。選錯位置的代價很具體：全部預先放行就是等著被 prompt injection 打穿；全部拒絕則 agent 在 CI 裡什麼都做不了，跑了白跑。

## 五家怎麼做

### claude-code：跳過信任對話框，權限外包給 SDK host

`claude-code-source/src/cli/print.ts#runHeadless` 是 `-p` print 模式的入口。它保留了完整的權限系統，但把「問誰」換掉了：`getCanUseToolFn`（`claude-code-source/src/hooks/useCanUseTool.ts#getCanUseToolFn`）在 headless 下透過 control protocol 把權限請求送到 stdout，讓 SDK 呼叫端自己決定准不准——也就是說，審批決策被外包給包著它的那支程式。

最誠實的一段證據是 `main.tsx` 裡 `-p, --print` 的說明文字：「The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.」——print 模式連工作區信任對話框都直接跳過，官方文件也明講這點（[CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)）。真要無人值守還有一個更激進的 `--dangerously-skip-permissions`，help 文字自己就寫了使用前提：「Recommended only for sandboxes with no internet access」。另外 print 模式專屬的 `--max-turns` 和 `--max-budget-usd` 把步數與花費夾在上限內，結束時以 result 的 `is_error` 決定 exit code（`print.ts#runHeadless` 尾聲的 `gracefulShutdownSync`），讓 pipeline 判讀成敗不需要解析文字。

### codex：approval 預設 Never，安全交給沙箱

`codex/codex-rs/exec/src/cli.rs#Cli` 整個子指令就是為非互動而生：prompt 可從 stdin 讀、`--json` 吐 JSONL 事件流、`-o` 把最後訊息寫進檔案、`resume`/`fork` 都有子命令。關鍵決策在 `codex-rs/exec/src/lib.rs` 的 ConfigOverrides 組裝處，註解明寫：「Default to never ask for approvals in headless mode」，`approval_policy` 直接給 `AskForApproval::Never`。

但 approval never 不等於放行——codex 的賭注是另一層：OS 級沙箱。`--sandbox read-only/workspace-write/danger-full-access` 決定檔案系統和網路的實際邊界，審批問題被轉化成沙箱設定問題（[sandbox docs](https://github.com/openai/codex/blob/main/docs/sandbox.md)）。真想兩層全繞過，得顯式加上 `codex-rs/utils/cli/src/shared_options.rs#dangerously_bypass_approvals_and_sandbox`，它的 doc comment 是五家裡寫得最重的一句：「EXTREMELY DANGEROUS. Intended solely for running in environments that are externally sandboxed.」

### opencode：預設自動拒絕，fail closed

`opencode/packages/opencode/src/cli/cmd/run.ts#RunCommand` 的 handler 裡有一段最能代表 headless 預設立場的程式碼：收到 `permission.asked` 事件時，如果沒加 `--auto`，就印出警告「permission requested: ...; auto-rejecting」然後回覆 reject。也就是說 opencode 的非互動模式**預設什麼都不准**，要放行必須顯式加 `--auto`——它的 describe 也沒在客氣：「auto-approve permissions that are not explicitly denied (dangerous!)」。這是最保守的一種答案：CI 裡的 agent 預設只能做不需要審批的事。

### pi：非 TTY 就進 print mode，信任決策 fail closed

pi 的模式判斷在 `pi-mono/packages/coding-agent/src/main.ts#resolveAppMode`：`-p`、stdin 非 TTY、stdout 非 TTY，任一成立就進 print mode。print mode 本體 `pi-mono/packages/coding-agent/src/modes/print-mode.ts#runPrintMode` 很薄——送 prompt、輸出結果、以 stopReason 是否為 error/aborted 決定 exit code。有意思的是信任機制怎麼處理 headless：`pi-mono/packages/coding-agent/src/core/project-trust.ts#resolveProjectTrusted` 走到最後需要問人的時候，先檢查 `if (!options.projectTrustContext.hasUI) return false;`——沒有 UI 可以問，就直接判定不受信任，載入受限設定。跟 claude-code 相反，pi 選擇的不是跳過信任對話框，而是**沒得問就不信任**。

### omp：approval mode 變成 runtime override

omp 是 pi 的 fork，它在這件事上的增量是把審批等級變成一等參數：`--approval-mode always-ask|write|yolo`，以及 `--auto-approve`/`--yolo` 別名。`oh-my-pi/packages/coding-agent/src/main.ts#approvalMode` 一段把它寫進 settings override（註解特別強調是 runtime override、不會持久化），讓下游所有讀 `tools.approvalMode` 的地方——包括 ACP 權限橋接——都看到同一個意圖。另外 piped input 會自動觸發 print mode，不用手動加 `-p`。

## looplane 的選擇：同一個 loop、兩種 policy

looplane 的答案是五家的第四種組合：**審批不是被拿掉，而是被注入**。`src/looplane/loop.py#AgentRunner` 的建構子接受 `approval_policy`，沒給就用 `HeadlessApprovalPolicy`；interactive 路徑傳入 `TTYApprovalPolicy`。同一個 agent loop，兩種介面差異被壓縮成一個 policy 物件。

headless 那份 policy 的 docstring 就是整個設計：「A deterministic policy that never reads stdin and therefore cannot hang CI」（`src/looplane/approvals.py#HeadlessApprovalPolicy`）。它的決策表只有三行：READ 永遠允許、MODIFY 允許（但仍受 path policy 和累積 patch 上限約束）、EXECUTE 預設拒絕——fail closed，跟 opencode 同向。`src/looplane/cli.py#run` 再往上疊契約式邊界：`--check` 只收 exact argv、`--max-steps` 和 `--wall-time` 是硬預算、disposable workspace 釘在 base SHA、結束吐完整 artifacts 並以 status 非 completed 回 exit code 1。

跟五家最大的差異在於：looplane 的 headless **沒有**「預先全面授權」的選項。codex 有 danger-full-access、claude-code 有 skip-permissions、omp 有 yolo；looplane 最接近的是 `--unsafe-local-exec`，但它只放行任務契約裡宣告過的那幾條 exact argv 檢查指令，不是任意 shell。代價是彈性——很多 CI 任務它做不了；好處是 CI 使用邊界非常清楚：能跑的就是契約寫的那些，audit trail 裡每筆審批決策都有記錄可查。

## 工程依據

這些取捨不是憑空發明，各專案的官方文件把同樣的立場寫得更直白：

- [Claude Code Agent SDK 文件](https://docs.anthropic.com/en/docs/claude-code/sdk)描述 headless/programmatic 使用時的權限委派模型，正是 print.ts 裡 control protocol 的公開版本。
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference) 明列 `-p` 模式跳過 trust dialog 的警告。
- Anthropic 官方甚至提供[GitHub Actions 整合](https://docs.anthropic.com/en/docs/claude-code/github-actions)，把 headless 權限設定（allowed tools）做成 workflow 輸入。
- [Codex exec 文件](https://github.com/openai/codex/blob/main/docs/exec.md)直接把 `codex exec` 定位為「run Codex non-interactively」，並說明 approval/sandbox 的搭配。
- [OpenCode CLI 文件](https://opencode.ai/docs/cli)涵蓋 `opencode run` 的非互動用法。

共同模式值得抄下來：**headless 的安全性不靠少數幾個 flag，靠的是「預設值已經安全」**——codex 預設 Never + 沙箱、opencode 預設拒絕、pi 沒得問就不信任。危險能力永遠藏在顯式 opt-in 的長名字後面，且 help text 直接告訴你後果。

## 改善路線

looplane 目前已經拿到的：不 hang、fail closed、artifacts 齊全、exit code 可判讀。對照五家，還有四條值得走的路：

1. **Structured output schema**。codex 的 `--output-schema` 讓 CI 直接拿到可驗證的 JSON 而不是自然語言；looplane 的 result.json 已經是結構化的，缺的是讓使用者自訂 schema 約束最終回覆。
2. **穩定的串流事件合約**。claude-code 的 stream-json 加上 stdout guard（防止任何雜訊污染 JSON 流）是外部編排的基礎建設；looplane 的 events.jsonl 是 artifact 不是即時介面，CI 中途觀察目前做不到。
3. **沙箱配 EXECUTE 放行**。codex 的啟示是 approval Never 必須配 OS 級隔離才敢用；looplane 若要在 CI 放寬 execute，正確順序是先補沙箱（對應系列後續的 OS-level sandboxing 主題），而不是加一個更大的 allowlist flag。
4. **Resume 進 pipeline**。codex exec 有 `resume` 子命令，失敗的 job 可以接著跑而不必重頭來；looplane 的 session resume 已存在於 interactive 路徑，還沒接到 headless 契約上。

一句話總結：headless 模式不是把互動模式的 UI 拔掉，而是把「人類即時判斷」這個依賴，整個替換成事先宣告的契約與安全的預設值。

## 參考資料

- [Claude Code Agent SDK 文件](https://docs.anthropic.com/en/docs/claude-code/sdk) — headless CI、approve policy 與 looplane loop/policy 對照。
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [Claude Code GitHub Actions](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [Codex `codex exec` 文件](https://github.com/openai/codex/blob/main/docs/exec.md)
- [Codex sandbox design](https://github.com/openai/codex/blob/main/docs/sandbox.md)
- [OpenCode CLI 文件](https://opencode.ai/docs/cli)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
