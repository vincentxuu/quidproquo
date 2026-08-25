---
title: "跟成熟 coding agent 學設計（28）：危險指令攔截與 shell escalation——在白名單和每次都問之間"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 28
tags: [coding-agent, shell-execution, security, approval, rivumi, codex, claude-code, omp]
lang: zh-TW
tldr: "五家對自由 shell 的風險處理收斂成同一個形狀：三層決策（放行／升級詢問／直接拒絕）、危險 pattern 清單、複合指令逐段檢查、使用者拒絕或逾時一律 fail-closed。codex 甚至把 escalation 做成攔截 execve 系統呼叫的獨立 server。rivumi 目前的 run_check 是 exact argv 白名單，安全但沒有中間層——只要跨出白名單一步就是全有或全無。"
description: "比對 codex、claude-code、omp、pi、opencode 五家的危險指令偵測與 escalation 機制，整理決策分層與 fail-closed 慣例，提出 rivumi 的風險分級設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-dangerous-command-interception-en)

系列第二部第三篇，照舊講一個「五家都有、rivumi 還沒有」的能力。取證範圍同前：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88）。所有引用都是我在本地 clone 實際 grep 過的。

## 能力問題：二元決策撐不起自由 shell

Agent 一旦能跑 shell，問題就從「能不能跑」變成「哪些指令可以不問就跑」。這件事的困難在於它是連續光譜被硬壓成離散決策：`ls` 和 `rm -rf /` 之間隔著幾千條指令，而審批機制只能給出「過／不過」。做太鬆，一條 `git push --force` 就足以毀掉遠端歷史；做太緊，每條指令都彈確認，使用者會開始無腦按同意——確認疲勞本身就是安全漏洞。

更麻煩的是複合指令：`cd x && rm -rf /` 把危險部分藏在中段；allow 規則如果只看整串字串的前綴，就會被 shell 控制語法走私。所以成熟專案要解的其實是三個子問題：**怎麼分級**（哪些指令可信到不用問）、**怎麼拆解**（複合指令的危險段藏哪裡）、**怎麼失敗**（使用者不在場或逾時時預設什麼）。

## 五家怎麼做

### codex：政策引擎加上系統呼叫級 escalation

codex 是唯一把這件事拆成兩個獨立 crate 的。第一層是政策引擎 `execpolicy`：`codex-rs/execpolicy/src/decision.rs#Decision` 定義三值決策——`Allow`（免審批直接跑）、`Prompt`（要求明確批准，且註解寫明在 `approval_policy="never"` 下直接拒絕）、`Forbidden`（不再考慮直接擋）。規則形狀是前綴匹配：`codex-rs/execpolicy/src/rule.rs#PrefixRule` 的 `matches_prefix` 對 argv 做逐 token 前綴比對，`RuleMatch` 還帶一個 `justification` 欄位讓規則附帶理由，可以在拒絕訊息裡呈現。整包策略由 `codex-rs/execpolicy/src/policy.rs#check` 統一評估，沒命中任何規則時 fallback 給 heuristics。

第二層是 `shell-escalation`，做法激進得多：它不是在工具入口檢查字串，而是透過 patched shell 攔截 `execve` 系統呼叫本身。`codex-rs/shell-escalation/src/unix/escalation_policy.rs#EscalationPolicy` 這個 trait 收到的參數是真實解析出的執行檔路徑和完整 argv，而不是模型宣稱的字串——繞過了「字串分析永遠猜不準 shell 語意」的根本限制。決策型別 `escalate_protocol.rs#EscalationDecision` 有三種：`Run`（沙箱內跑）、`Escalate(EscalationExecution)`（升級執行，可選 `Unsandboxed`／`TurnDefault`／`Permissions` 三種沙箱設定）、`Deny`。

最值得抄的是 fail-closed 的落點。`codex-rs/core/src/tools/runtimes/zsh_fork/unix_escalation.rs` 裡把使用者的 `ReviewDecision` 映射到 escalation 決策時，逾時（`TimedOut`）、取消（`Cancelled`）一律映射到 `deny`——只有明確同意才會升級，其他一切都不執行。

### claude-code：資訊性警告與沙箱分流

claude-code 的危險偵測走「警告歸警告、權限歸權限」的路線。`src/tools/BashTool/destructiveCommandWarning.ts#getDestructiveCommandWarning` 維護一份 `DESTRUCTIVE_PATTERNS` regex 清單，涵蓋 `git reset --hard`、`git push --force`、`DROP TABLE`、`terraform destroy` 等，檔案開頭註解寫得明白：「purely informational — it doesn't affect permission logic」——它的職責是在權限對話框裡多給一句人話提醒，不搶審批機制的權。真正影響執行方式的是 `src/tools/BashTool/shouldUseSandbox.ts#shouldUseSandbox`：預設把指令丟進沙箱，只有使用者明確設定的排除清單才豁免。

### omp：critical pattern 加上語意正確的 allow 語法

omp 的 fork 在 `packages/coding-agent/src/tools/bash.ts#CRITICAL_BASH_PATTERNS` 放了一份寫得非常認真的 regex 清單：`rm --no-preserve-root`、fork bomb、`dd if=… of=/dev/`、`curl | bash` 及其 process substitution 變體、`nc -e` 反彈 shell。註解說明了取捨原則——「false negative 的代價是資料遺失或主機淪陷，false positive 可以靠使用者政策救回來」，所以清單刻意收緊。

架構上更有意思的是 allow/deny/prompt 三種 pattern 規則的匹配語意（同檔案的 `bashApprovalRuleMatches`）：`deny` 和 `prompt` 只要有任一段命中就成立，而且用共享 tokenizer 把複合指令切成段落逐段查，`cd x && rm -rf /` 躲不掉；但 **`allow` 必須為整條指令背書**，只要含有任何 shell 控制語法就直接失效——因為「窄 allow 規則搭上走私段」正是最常見的繞過手法。工具的 `approval` 方法把這些整合成最終 tier 決策。

### pi：把風險判斷交給擴充 hook

pi 本體幾乎不做危險指令判斷。`pi-mono/packages/coding-agent/src/core/tools/bash.ts#BashSpawnHook` 提供的是一個 spawn 前的 hook：擴充功能可以拿到 `{command, cwd, env}` 並改寫或拒絕。這是把「什麼算危險」外包給社群——風險政策變成可組合的套件而非核心程式碼。代價也明顯：核心零保護，裝不裝、裝哪個 hook 全憑使用者。

### opencode：指令即資源，萬用字元規則

opencode 的 bash 工具（`packages/core/src/tool/bash.ts`）在執行前呼叫 `permission.assert({resources: [input.command], save: [input.command]})`——把整條指令字串當作權限資源，用 schema 層的 wildcard 規則評估（`packages/core/src/permission.ts#evaluate`），批准一次可以用 `save` 記住。另外它對指令引數掃描外部目錄，但註解誠實地標記為 advisory only——靜態掃描抓不到所有路徑，所以只警告、不攔截。

## 學術依據

這些設計的共同祖先是最小權限原則：Saltzer 和 Schroeder 在 1975 年的經典論文 [The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/) 裡定義的 "least privilege"——每個主體只應持有完成當前任務所需的最小權限。codex 的三值決策就是把這個原則工程化：預設沙箱內最小權限（`Run`），例外需要顯式授權（`Escalate`），明確禁止的不留協商空間（`Deny`）。「預設拒絕」則是同一份論文裡 "fail-safe defaults" 條目的直接實踐：逾時、取消、缺省一律落到 deny。Anthropic 自己的[安全文件](https://docs.anthropic.com/en/docs/claude-code/security)也把權限提示與沙箱並列為兩道獨立防線——警告系統（claude-code 的 destructive warning）負責讓人類決策有資訊，沙箱與審批負責強制邊界，兩者故意不分權責混在一起反而會兩頭落空。

## rivumi 設計草案

先如實描述現狀。rivumi 目前**沒有自由 shell 工具**，唯一的 EXECUTE 通道是 `tools.py#run_check`：從設定檔讀入 `verification_commands`，argv 完全固定，工具 schema 還把 name 限制成 enum（`tools.py` 的 `run_check_schema`）。效果分級靠 `approvals.py#ToolEffect`（READ/MODIFY/EXECUTE 三值），headless 下 `HeadlessApprovalPolicy` 的 `allow_execute` 預設 False，唯一放行方式是 CLI 層的 `--unsafe-local-exec` 布林旗標。

這個設計安全，但缺口很清楚：**決策是二元的**。白名單命中就跑，否則全部落到「問使用者」或整段關閉。一旦未來要加 bash 工具、或允許 trusted repo 自帶檢查指令（`--unsafe-local-exec` 的 help 文案已經暗示了這個方向），現有的 ToolEffect 三值根本表達不了「這條指令危險但可談判」的中間地帶。草案：

**第一層：三值決策引擎。** 新增 `src/rivumi/shell_policy.py`，定義 `ShellDecision = ALLOW | PROMPT | FORBIDDEN`（對齊 codex 的命名），輸入是解析後的 argv 與工作目錄。規則兩種來源：設定檔的 prefix 規則（沿用 `run_check` 已有的 exact argv 思路，放寬到前綴），加一份內建的 critical regex 清單（學 omp 的收緊原則：只放「幾乎不會在自動化裡合法出現」的形狀）。

**第二層：複合指令逐段檢查。** 用 `shlex` 切 `;`、`&&`、`||`、`|` 邊界，FORBIDDEN/PROMPT 任一段命中即成立；ALLOW 必須覆蓋全部段且不含任何控制語法——omp 用血淚換來的語意，直接抄。

**第三層：fail-closed 的 escalation。** PROMPT 走既有 `TTYApprovalPolicy`，但要把「本次 session 同意」從現在的全域 grant（`approvals.py` 的 `_grants` set）改成 per-pattern grant，避免「同意過一次 `pytest` 就等於同意一切」。逾時與拒絕一律 deny，對齊 codex。每次決策（含規則名稱與 justification）寫進 audit trail——事件流是 rivumi 既有的強項，正好接上。

## 與現有架構的銜接

好消息是地基都在：`ToolEffect` 分級、callback/headless/TTY 三種 `ApprovalPolicy`、exact argv 白名單、audit trail，缺的只是中間那層「風險語意」。具體銜接點有三個：`run_check` 的驗證指令改掛新引擎（白名單變成 ALLOW 規則的一個特例）；`--unsafe-local-exec` 從布林降級為「未匹配規則時的 fallback 決策」，讓 headless 模式也能吃到分級；`effect_for_tool` 保持不變，shell 政策作為 EXECUTE 效果內部的細化層疊上去。

順序上也該排在 OS 級沙箱（系列下一篇的主題）之前：pattern 分級便宜、純軟體、立刻有用；landlock/seatbelt 那層是給「分級錯了」的時候兜底的。先有分級，沙箱才有意義。

## 參考資料

- [openai/codex — codex-rs/execpolicy](https://github.com/openai/codex/tree/main/codex-rs/execpolicy)：Allow/Prompt/Forbidden 三值決策與前綴規則引擎
- [openai/codex — codex-rs/shell-escalation](https://github.com/openai/codex/tree/main/codex-rs/shell-escalation)：execve 攔截式 escalation server
- [Claude Code 文件 — Security](https://docs.anthropic.com/en/docs/claude-code/security)：權限提示與沙箱的雙防線定位
- [OpenCode 文件 — Permissions](https://opencode.ai/docs/permissions/)：以指令字串為資源的權限規則
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)：`CRITICAL_BASH_PATTERNS` 所在 repo
- [Saltzer & Schroeder, The Protection of Information in Computer Systems (1975)](https://www.cs.virginia.edu/~evans/cs551/saltzer/)：least privilege 與 fail-safe defaults 原始出處
