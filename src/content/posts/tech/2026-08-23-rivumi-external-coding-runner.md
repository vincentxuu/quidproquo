---
title: "Rivumi 的 ExternalCodingRunner：為什麼 Codex/Claude Code CLI 是外部 runtime,不是 ModelProvider"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, codex-cli, claude-code, orchestration]
lang: zh-TW
tldr: "Rivumi 同時有自家 loop(AgentRunner)跟外部 runtime 的整合路徑(ExternalCodingRunner)。後者不是把 Codex CLI / Claude Code CLI 當成 ModelProvider 用——它們有自己的 model loop,Rivumi 不該插手;它只做幾件事:用同一套 LocalGitWorkspace 建 disposable clone、把 `allowed_paths` 跟 verification 指令明確餵給外部 CLI、跑完後用 SafePathPolicy + ToolExecutor 重新驗證整個 patch、再用 source-invariant 對比確認 source repo 完全沒被動。整個設計的關鍵斷言是「ExternalCodingRunner 永遠不會變成 ModelProvider,也不會讀它的 credential store」。"
description: "深入 Rivumi 的 ExternalCodingRunner 設計：跟 AgentRunner 的分工、為什麼 Codex/Claude Code CLI 不是 ModelProvider、disposable clone + patch boundary + final verification + source invariant 四道關卡、codex_conversation.py / claude_agent_session.py / opencode_backend.py / omp_backend.py 各自的整合策略。"
series:
  name: "Rivumi 架構拆解"
  order: 5
draft: false
---

前四篇拆的是 Rivumi 自家 loop 怎麼跑。這一篇拆它的「鏡像路徑」——同樣要解同一個任務,但 loop 是別人家的:Codex CLI / Claude Code CLI / OpenCode / Pi / OMP,它們各有自己的 model loop。Rivumi 不接管那些 loop,只做 orchestration:送任務過去、收回 patch、自己重新驗證。

`src/rivumi/backends.py` 的 module docstring 第一句話就把這條界線寫死:

> External agent backends own their model loop and are deliberately separate from `ModelProvider`. They are not a way to forward provider credentials.

這句話有三個 claim:**(a) 它們有自己的 loop,Rivumi 不接管**;**(b) 它們不被當成 model transport**;**(c) 它們絕對不是拿來偷渡 provider credentials 的管道**。第三個 claim 對應的是 M4 階段那個「subscription-backed」的決策:Rivumi 不會去讀 Codex CLI 的 `~/.codex/auth.json`、不會去讀 Claude Code 的 `~/.claude/.credentials.json`,這些 CLI 是「被整合的合作對象」,不是「被搶走的資源」。

## 為什麼不用 ModelProvider 包裝外部 CLI

最直覺的整合方式是把 Codex CLI 包成一個 `ModelProvider`,這樣 Rivumi 自己的 loop 就能直接用——provider 從 OpenAI 切到 Codex,API 介面完全一樣,零程式碼改動。

Rivumi 不這樣做,理由至少有四個:

- **loop 不能合併**:Codex CLI 內部有自己的 tool loop、自己的 approval、自己的 retry、自己對 prompt injection 的對策。把這些抽象成 `ModelProvider.complete(messages, tools) -> ModelTurn` 會丟掉所有這些語意——`complete` 只回一個非串流 `ModelTurn`,沒地方放「Codex CLI 跑了三輪才決定打 read_file」這種 stream。
- **tool set 不一樣**:Codex CLI 預設能跑 shell、能讀 MCP server、能 push commit;Rivumi 自家 loop 的 tool set 是七個(前一篇拆的)—把兩者合併成一個 tool 介面,模型會同時看到「可以跑 shell」跟「不能跑 shell」的矛盾指令,反而更不安全。
- **auth model 不一樣**:Codex CLI 用 ChatGPT 訂閱 OAuth,Rivumi 自家 loop 用 canonical API key。同一個 `ModelProvider` 介面要同時對應兩種 auth,程式碼會被 if-else 淹沒。
- **verification boundary 不能變**:前一篇講的 verification-as-gate 是「Rivumi 跑完 verification 才算 COMPLETED」。如果 loop 在外部 CLI 裡、verification 也由外部 CLI 跑,那 Rivumi 就只是在當 broker,所有 M1 的安全保證(workspace 不被改、argv 嚴格化、process group timeout)都不再適用。

所以 Rivumi 開了第二條路徑:**外部 CLI 是 `ExternalAgentBackend`,跑在 Rivumi 準備的 disposable clone 裡,跑完後 patch 回到 Rivumi 自己驗**。Loop 是它的,boundary 是我的。

## ExternalCodingRunner.run() 的四道關卡

`src/rivumi/external_runner.py:553-810` 的 `run()` 是這條路徑的執行者。整個流程分四個關卡,每一個關卡失敗都會把整個 run 標成特定 `terminal_reason`:

**關卡 1:approval gate**。第一件事是要求使用者同意「讓 Codex/Claude 去改我的 disposable clone」(line 560-576)。這跟自家 loop 的 approval flow 用同一套 `ApprovalRequest` / `ApprovalPolicy`,只是 preview 訊息改成:

> Allow `codex` to edit Rivumi's disposable clone. The source repository remains read-only to the delegated workflow.

這句話是設計上的關鍵:它明確告訴使用者「codex 會改東西,改的是 clone 不是 source」,把責任歸屬跟邊界都寫進 prompt。`allow_external_modify` 是顯式 escape hatch——只有在 headless / CI 環境才該設。

**關卡 2:disposable clone + source invariant**。Approval 通過後,Rivumi 用**同一個 `LocalGitWorkspace`**(第二篇拆的那個)建 disposable clone——這意味著外部 CLI 跑在跟 AgentRunner 完全相同的 workspace 邊界裡。同時 `_capture_source_invariant(source, base_sha, ...)` 對 source repo 做一次 snapshot(HEAD SHA、porcelain status、每個檔案 bytes 的 hash),這份 snapshot 留到 run 結束時比對。

接下來還做一件特別的事:`_isolate_git_metadata(workspace, run_dir, ...)` 把 disposable clone 的 `.git` 目錄「搬走」到 `run_dir/.git-isolated/`,再讓 `.git` 變成指向那個隔離位置的相對 symlink。原因是:Codex CLI / Claude Code CLI 內部可能會去讀 `.git/config`、`git remote -v`,看到 origin 是使用者的 source repo 就可能嘗試 `git push` 或 `git fetch`——把 `.git` 移出 workspace 等於把它跟 source 物理隔開,即使 prompt injection 讓它想 push,它對那個隔離位置做的操作完全不會影響 source。

**關卡 3:patch boundary validation**。外部 CLI 跑完後,Rivumi 用 `executor.reviewable_patch(...)` 取出 unified diff,然後用 `_validate_external_patch(workspace, patch, changed_paths)` 跑四條獨立檢查(line 495-521):

```python
@staticmethod
def _validate_external_patch(
    workspace: Path,
    patch: str,
    changed_paths: tuple[str, ...],
) -> None:
    forbidden = (
        "GIT binary patch",
        "Binary files ",
        "new file mode 120000",
        "old mode 120000",
        "rename from ",
        "rename to ",
        "copy from ",
        "copy to ",
    )
    if any(line.startswith(forbidden) for line in patch.splitlines()):
        raise ToolExecutionError(
            "external patch contains a binary, symlink, rename, or copy change"
        )
    for relative in changed_paths:
        target = workspace / relative
        if not target.exists():
            continue
        mode = target.lstat().st_mode
        if not stat.S_ISREG(mode):
            raise ToolExecutionError(f"external patch leaves a non-regular file: {relative}")
```

四條對應四種「外部 CLI 不應該能動」的東西:**binary patch**(不讓外部 CLI 偷偷塞二進位檔案繞過檔案大小預算)、**symlink**(不讓它建 `120000` mode 的 symlink 指向 source 之外的檔案)、**rename / copy**(M3 的工具介面就是 `replace_text` + `apply_patch`,兩者都不支援 rename/copy——允許外部 CLI 做 rename 等於繞過 Rivumi 的 path policy)。這條檢查比自家 loop 的驗證還嚴:自家 loop 寫的 patch 我們知道來源,外部 CLI 寫的我們要當 untrusted 處理。

**關卡 4:final verification + source invariant**。`_validate_external_patch` 通過後,Rivumi 用**自家 `ToolExecutor.run_check`** 跑 `task.verification` 全部 argv(line 733-757)——完全跳過外部 CLI 跑過的 check,從 disposable clone 直接重跑。每跑完一條還要 `_require_approval`,因為 verification 是 host-side code execution,跟 AgentRunner 用同一條 approval policy。

verification 全 pass 之後還有兩個收尾動作:**再一次 `reviewable_patch`** 比對「final patch 跟 verification 跑之前的 patch 一模一樣」(line 759-774)。如果 verification 跑完後 patch 被改了——例如 verification 是個 pytest 而 pytest 副作用寫了 `.pyc`、或者 verification 用 `git apply` 自己的修改——就 raise `ToolExecutionError("final verification changed the external workspace patch")`。這條保證把「verification 是 read-only」的 contract 從 hint 升成 invariant。

最後是 `_source_invariant_matches(source, source_invariant, 30.0)`,把關卡 2 留的 snapshot 跟現在的 source repo 比對——HEAD、status、bytes 必須一致。失敗就 `terminal_reason="source_repository_changed"`,這個 terminal reason 在整套系統裡只有這條路徑會用到,**表示 source repo 在 delegation 過程中被動過,即使 patch 本身成功也不能接受**。`_SOURCE_INVARIANT_TIMEOUT = 30.0` 是寫死的(line 88-93),故意不用 `task.limits.wall_time_seconds`,因為這是「快速、local 的 git / filesystem 檢查」,不該被 backend 的 wall-time 預算擠壓——否則 backend timeout 會讓 source check 也 timeout,誤把 terminal reason 報成 `source_repository_changed`。

## 跟 AgentRunner 共用 artifact layout

跑完之後,`ExternalCodingRunner` 留下跟 AgentRunner 一樣的 6 個 artifact(`request.json` / `events.jsonl` / `checkpoint.json` / `changes.patch` / `test.log` / `result.json`),多一個 `backend-result.json` 記外部 CLI 自己的結果(sequence / event_type / text / data)。`RunResult.artifacts` 把多出的那條加進去,這樣下游 UI 拿到 result 就能決定「要不要顯示『Codex CLI 說了什麼』那段」。

`RunResult.terminal_reason` 在 external 路徑多了一些自家 loop 沒有的值:

- `verified` — 跟 AgentRunner 一樣,verification 全 pass 且 source invariant 沒變。
- `verification_failed` — external CLI 跑完但 verification 沒過。
- `no_changes` — external CLI 說完成但沒產生 diff(可能是它誤判、可能根本沒做事)。
- `source_repository_changed` — patch OK 但 source repo 被動了,run 不被接受。
- `external_agent_error` / `policy_or_artifact_error` / `timeout` / `user_cancelled` — 對應 backend 報錯、patch 驗證擋下、超時、使用者取消。

`external_failure_hint(terminal_reason, backend_name)` 拿 terminal reason 對到一個 human-readable hint 字典(例如 `executable_unavailable` → 「The codex executable was not found on your PATH. Install codex...」)。這個 hint 寫進 `RunResult.error` 欄位,UI 拿到可以直接顯示。

## 具體 backend 怎麼接

Rivumi 把「怎麼跟某個 CLI 對接」拆成兩個檔案:

- `src/rivumi/backends.py` 提供 `ExternalAgentBackend` Protocol,定義 `async def run(task, working_directory, event_sink) -> ExternalAgentResult`。這是契約,所有 backend 都實作它。
- `src/rivumi/external_cli_base.py` 是共用 base class,處理「spawn subprocess → capture JSONL stream → parse event → call event_sink.emit」的 boilerplate。每個具體 backend 只負責「把 CLI 啟動、把 CLI 的輸出 parse 成 `ExternalAgentEvent`」。

具體四個 backend 各自有自己的檔案:

- `src/rivumi/codex_conversation.py`(168 行)——包 Codex CLI 用 ChatGPT OAuth 訂閱,輸出是 JSONL streaming,parse 成 sequence / event_type / text。
- `src/rivumi/claude_agent_session.py`(764 行)——包 Claude Code CLI,根據 M5 文件「the narrowest policy-compatible Claude Code path」,只用 file tools(`read_file` / `write_file` / `edit`),不開 shell / network / MCP。這個限制比 Claude Code 預設還窄,但 Claude Code CLI 本身支援「自訂 tool set」flag,所以 Rivumi 直接傳一個縮減的 tool list 進去。
- `src/rivumi/opencode_backend.py`(106 行)——包 OpenCode,local-only,experimental。
- `src/rivumi/omp_backend.py`(24 行)——包 OMP(quidproquo 自己的編輯器模式),local-only。

`backend_name` 跟 `local_only` 跟 `experimental` 是 `ExternalAgentBackend` Protocol 的 attribute,UI 用 `local_only` 標記哪些 backend 不能在 Cloudflare Sandbox 跑、`experimental` 標記哪些還沒在 production 用過。`codex_conversation` 是 `local_only=False` 但 `experimental=True`(M5 仍標 experimental),`opencode` / `omp` 都是 `local_only=True experimental=True`,`claude_agent_session` 是 `local_only=False experimental=True`。

## 為什麼這不是「provider credential 偷渡管道」

回到 backends.py 那句 docstring。它不是單純的姿態——是因為 M4 階段那個時候,Rivumi 面臨一個實際的誘惑:很多 user 已經登入 Codex CLI / Claude Code CLI 了,如果 Rivumi 能「讀他們的 credential 檔 → 拿去當 ModelProvider 的 API key」,就可以零成本支援所有訂閱模型。

Rivumi 不這樣做的理由很具體:

- **license / ToS**:Codex CLI 的 OAuth token 是給 Codex CLI 用的,不是給 arbitrary 第三方程式用的;從 `~/.codex/auth.json` 偷 token 出去,即使技術上能跑,在 OpenAI 的 ToS 下是 account compromise。
- **isolation boundary 會破壞**:同一個 token 被兩個程式同時用,Codex CLI 自己 revoke 的時候 Rivumi 就完全沒轍;反過來,Rivumi 的 loop bug 把 token 寫進 log,Codex CLI 那邊的 session 也要跟著 rotate。互相耦合。
- **verification gate 失去意義**:如果 Rivumi 拿訂閱 token 直接打 OpenAI API,那跟「把外部 CLI 當 ModelProvider」沒差別——整個 disposable clone + external patch validation + source invariant 這套 boundary 全部退化。

所以 `ExternalCodingRunner` 的設計契約是:**backend 自己讀自己的 credential,跑自己的 loop,回結果給 Rivumi**。Rivumi 從來不碰 OAuth flow、從來不讀 `~/.config` 下的 token、從來不把任何 auth 字串寫進自己的 `events.jsonl`。如果 backend 報錯需要使用者重新登入,Rivumi 只能印一句「please run `codex login` again」(透過 `external_failure_hint`),不能幫使用者登入。

## 整體來說

ExternalCodingRunner 解決的是「我想用 Codex 訂閱但不想失去 Rivumi 的安全保證」這個矛盾。答案是:**loop 給它,boundary 留給我**。所有 Rivumi 的核心 invariant——disposable clone、SafePathPolicy、verification-as-gate、source-isolation E2E——在 external 路徑裡全部保留;外部 CLI 只是 Rivumi 借來的「自動駕駛」,但方向盤跟煞車還是 Rivumi 自己握的。

下一篇拆 `ModelProvider` 多閘道——這是跟 ExternalCodingRunner 的鏡像對照:Rivumi 自己有 loop,模型只是被呼叫的元件。下一篇看 OpenAI / Anthropic / Gemini / Workers AI / Ollama 五個 transport 怎麼用同一個 `ModelProvider` Protocol 接到同一個 loop。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M4 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m4-provider-completion.md)——subscription-backed 路徑的官方里程碑
- [Rivumi M5 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m5-subscription-backed-external-coding.md)——`ExternalCodingRunner` 的契約定義
- [OpenAI Codex CLI](https://github.com/openai/codex)——`codex_conversation.py` 整合的對象
- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code)——`claude_agent_session.py` 整合的對象,看它的 custom tool set flag
- [OpenCode](https://opencode.ai/)——`opencode_backend.py` 整合的對象
- [Anthropic Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)——理解 Claude Code CLI 怎麼被包成可審計 subprocess 的背景知識
- [Process spawning patterns for untrusted CLIs](https://docs.python.org/3/library/asyncio-subprocess.html)——`asyncio.subprocess` 在處理外部 CLI JSONL stream 時的注意事項
