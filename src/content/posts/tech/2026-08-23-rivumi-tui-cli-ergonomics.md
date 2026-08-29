---
title: "Rivumi 的 TUI 與 CLI 人因工程：approval flow、geometry test、resume、daily-driver UX"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cli, tui, ux, terminal]
lang: zh-TW
tldr: "Rivumi 把 daily-driver UX 切成兩個 mode:`interactive`(有 TTY、有 TUI、走 approval prompt)跟 `headless`(CI / 排程、純 stdout)。approval policy 不是寫死 y/n——`ApprovalDecision` 有四個值:ALLOW_ONCE / ALLOW_SESSION / DENY / CANCEL,搭配 `TTYApprovalPolicy` 的 session-scoped grants,使用者在一次 session 內允許某類 effect 後就不再問。最新 TUI 已改成 runtime-first：bare `rivumi` 進互動畫面,可選 Rivumi Agent / Claude Code / Codex CLI / OpenCode / Pi / OMP,並有 statusline usage、`/usage`、`/context`、`/model`、`/new`、`/resume`、`/history`。整個 TUI layout 變更還要跑 geometry test + wide/narrow/loading screenshot 才算完成。"
description: "深入 Rivumi 的 TUI/CLI 設計:_terminal_supports_tui 偵測、_stdin_is_tty 切 mode、TTYApprovalPolicy 的 session-scoped grants、ApprovalDecision 四值、AgentRunner.resume 怎麼還原 in-memory state、scripts/render_tui_screenshot.py 的 wide/narrow 渲染測試流程。"
series:
  name: "Rivumi 架構拆解"
  order: 7
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-tui-cli-ergonomics-en)

前六篇拆的核心都是「loop 怎麼跑」、「workspace 怎麼保護」、「驗證怎麼強制」。這一篇拆「這套系統怎麼變成 daily-driver CLI」——approval prompt 不能 spam、resume 不能讓使用者 panic、wide 跟 narrow terminal 都要能看。

`src/rivumi/cli.py` 的 module docstring 第二行寫得很直白:**interactive CLI 跟 headless harness 是兩個 mode 共用同一個 AgentRunner**,差別只在 routing。整個 CLI 設計的斷言是:**AgentRunner 是 async 純函式**(`async def run(self) -> RunResult`),CLI 層負責把它變成「人用的東西」——TUI 包裝、approval 互動、resume hook、onboarding flow。loop 自己不知道有 TTY 存在。

## 兩種 mode,從 `_stdin_is_tty()` 分岔

`cli.py:230-240`:

```python
def _stdin_is_tty() -> bool:
    return sys.stdin.isatty()


def _terminal_supports_tui() -> bool:
    return (
        _stdin_is_tty()
        and sys.stdout.isatty()
        and os.environ.get("TERM", "").lower() != "dumb"
        and (os.environ.get("RIVUMI_NO_TUI") or os.environ.get("PCA_NO_TUI")) != "1"
    )
```

兩個 helper 把「這次執行該走哪個 mode」分成三層:**(a) stdin 是 TTY 嗎**(`rivumi run < file.json` 直接走 headless);**(b) stdout 也是 TTY 嗎**(輸出被 pipe 走的時候也不該走 TUI);**(c) 環境變數有沒有禁用 TUI**(`RIVUMI_NO_TUI=1` 或 legacy `PCA_NO_TUI=1` 都強制進 plain mode)。

判定後的 routing 邏輯散在多處,但核心是 `headless = print_mode or not _stdin_is_tty()`(`cli.py:708`)。`print_mode` 對應 `--print` / `-p` flag,即使有 TTY 也強制走 non-interactive,適合「我想用 Rivumi 的 agent 但要可預期的 stdout 輸出」這種 CI-adjacent 場景。

`interactive_setup` 函式(line 405-)是另一條路徑:**首次使用、沒有 config 檔、TTY 可用時自動跑 onboarding**——它列五個 provider(`Ollama local` / `OpenAI or compatible API` / `Anthropic` / `Gemini` / `Workers AI`),讓使用者選、讓它探測本地 Ollama 模型、寫進 `~/.config/rivumi/config.json`。這個 onboarding 寫在 README 的「Daily use」段落第一句:`rivumi [PROMPT] | rivumi -p [PROMPT] | rivumi exec [PROMPT] | rivumi resume`。

## ApprovalDecision 四值:不是只有 yes/no

第一篇提過 `_approval` 從 `ApprovalPolicy.decide(request)` 拿決策,但沒展開決策有什麼值。`approvals.py:29-33`:

```python
class ApprovalDecision(StrEnum):
    ALLOW_ONCE = "allow_once"
    ALLOW_SESSION = "allow_session"
    DENY = "deny"
    CANCEL = "cancel"
```

四個值,不是三個:`ALLOW_ONCE`(這次 OK)、`ALLOW_SESSION`(整個 session 內對這個 effect 類別都 OK)、`DENY`(這次不行,但 conversation 繼續,tool observation 帶 error 塞回)、`CANCEL`(整個 run 結束,terminal_reason="approval_cancelled" 或 "user_cancelled")。`DENY` 跟 `CANCEL` 的差別是「模型能不能從這次拒絕學到東西」——`DENY` 把 denial 訊息塞回 messages,模型下一輪可以調整;`CANCEL` 是 hard stop,連訊息都不塞。

`TTYApprovalPolicy.decide()`(line 108-132)是 daily-driver 看到的那個 prompt:

```python
async def decide(self, request: ApprovalRequest) -> str:
    if request.effect == ToolEffect.READ or request.effect in self._grants:
        return ApprovalDecision.ALLOW_ONCE
    if not self._input.isatty():
        return ApprovalDecision.DENY

    self._output.write(
        f"\nApproval required: {request.effect.value} ({request.reason.value})\n"
    )
    if request.preview:
        self._output.write(f"{request.preview}\n")
    self._output.write("Allow? [y] once / [a] session / [n] deny / [c] cancel: ")
    self._output.flush()
    answer = self._input.readline().strip().lower()
    decision = {
        "y": ApprovalDecision.ALLOW_ONCE,
        "yes": ApprovalDecision.ALLOW_ONCE,
        "a": ApprovalDecision.ALLOW_SESSION,
        "always": ApprovalDecision.ALLOW_SESSION,
        "c": ApprovalDecision.CANCEL,
        "cancel": ApprovalDecision.CANCEL,
    }.get(answer, ApprovalDecision.DENY)
    if decision == ApprovalDecision.ALLOW_SESSION:
        self._grants.add(request.effect)
    return decision
```

三個設計細節很關鍵:

- **`READ` effect 永遠不需要 prompt**——`if request.effect == ToolEffect.READ or request.effect in self._grants: return ALLOW_ONCE`。`list_files` / `read_file` / `search_text` / `git_diff` 都是純讀,不需要每次都問。`tool_effects` 字典(approvals.py:135-143)明確分類:`list_files` / `read_file` / `search_text` / `git_diff` → READ;`replace_text` / `apply_patch` → MODIFY;`run_check` → EXECUTE。新增的 tool 必須在 `TOOL_EFFECTS` 登記,沒登記就 raise——「fail closed when a newly added tool has no explicit effect classification」。
- **`ALLOW_SESSION` 把 effect 加入 `_grants` set**——下次同 effect 的 action 自動 ALLOW_ONCE,不會再問。例如使用者回答「always」允許 `replace_text`,那整個 session 內所有 `MODIFY` 動作都不再 prompt。對 debug 跟長 task 友善,不會被 spam。
- **非 TTY stdin 直接 `DENY`**——這條保證 headless / CI 跑 `rivumi run < file.json` 時如果使用者忘了設 `HeadlessApprovalPolicy(allow_modify=True)`,prompt 會被 silent DENY 而不是 hang 整個 CI,prompt 變成「action denied by user」tool observation。

`HeadlessApprovalPolicy` 是另一個獨立 policy(approvals.py:80-93),跟 `TTYApprovalPolicy` 是同一個 Protocol 的兩個實作——CI 預設只允許 READ 跟 MODIFY,不允許 EXECUTE;`AgentRunner.__init__` 預設拿 `HeadlessApprovalPolicy(allow_modify=True, allow_execute=allow_unsafe_local_exec)`。

## Resume:把 manifest 還原成 in-memory 狀態

`rivumi resume <session>` 是一個獨立的 typer command(`cli.py:1427-1470`):

```python
@app.command()
def resume(
    session: Annotated[str, typer.Argument(help="Session id or 'last'")] = "last",
    run_root: Annotated[Path, typer.Option("--run-root")] = DEFAULT_RUN_ROOT,
    api_url: Annotated[...],
    ...
) -> None:
    ...
    try:
        run_dir = _resolve_resume_dir(run_root, session)
        manifest = asyncio.run(SessionStore(run_dir).load())
        _, _, api_url = _resolve_cli_settings(
            provider=manifest.provider_name,
            ...
        )
        ...
        result = asyncio.run(
            _resume_and_close(
                run_dir,
                selected_model,
                approval_policy=TTYApprovalPolicy(sys.stdin, sys.stderr),
                ...
            )
        )
```

關鍵點:**`resume` 必須用同一個 provider / model / protocol 跑**——`AgentRunner.resume()` 開頭就 check `manifest.provider_name != model.provider_name` 直接 raise `SessionValidationError("resume provider/protocol/model must match the persisted session")`。原因是 manifest 裡存的 conversation history 是用某個 provider 的 wire 寫的,換 provider 等於換 wire,history 就讀不懂。

`_resume_and_close` 是 thin wrapper(line 1711-1733),呼叫 `AgentRunner.resume()` 然後 `runner.run()`。`AgentRunner.resume()`(`loop.py:153-209`)做的事是:

```python
manifest, task = await store.claim_and_validate_resume(lease)
if (
    manifest.provider_name != model.provider_name
    or manifest.model_id != model.model_id
    or manifest.protocol != str(model.protocol)
):
    raise SessionValidationError(...)
runner = cls(task, model, resolved.parent, run_id=resolved.name, ...)
runner._session_store = store
runner._session_lease = lease
runner._manifest = manifest
runner._sequence = manifest.last_event_sequence + 1
runner._messages = list(manifest.messages)
runner._usage = manifest.usage
runner._step = manifest.step
runner._last_fingerprint = manifest.last_action_fingerprint
runner._repeat_count = manifest.repeat_count
runner._last_verification = manifest.verification
runner._run_dir_initialized = True
workspace = resolved / "workspace"
runner._executor = ToolExecutor(...)
runner._resume_ready = True
return runner
```

`_resume_ready = True` 是關鍵旗標——`AgentRunner.run()` 開頭 `if self._resume_ready:` 會走 resume 路徑(跳過 `LocalGitWorkspace.prepare()`、跳過新 run 的 manifest 初始化、直接從 `manifest.messages` 繼續 conversation)。所有 guard state 全部從 manifest 還原:`_step` 從 0 開始但計數已經是上次中斷時的值、`_last_fingerprint` 跟 `_repeat_count` 讓 repetition guard 跨 resume 持續、`_sequence` 從 `last_event_sequence + 1` 接續確保新事件不會跟舊事件 sequence 撞號。

`claim_and_validate_resume` 內部做了更細的事(上一篇文章提過):用 `manifest.last_event_sequence` 對 JSONL 做 reconciliation,停在 `tool.started` / `verification.started` 必須 hard fail。**這個檢查在 resume 進入 UI 之前就完成**,所以使用者打 `rivumi resume last` 不會看到「看起來 resume 了但跑到一半才發現停在 side effect 中間」的 panic。

## Lazy import 保護 startup time

`cli.py:21-25` 的註解值得單獨看:

```python
# NOTE: heavy, route-specific modules (provider SDKs, vendor backends, gateway,
# Textual, conversation controllers, runtime discovery) are imported lazily inside
# the command/helper that needs them so `rivumi --help`, `config`, and other
# lightweight routes never load the OpenAI/Anthropic SDKs, uvicorn, Textual, or
# external runtime implementations. See docs/startup-performance-playbook.md.
```

意思是 `from rivumi.openai_compatible import ...` 不會在 `cli.py` 模組頂層出現——這些 heavy import 全都被搬進各個 command function 裡面,讓 `rivumi --help` / `rivumi config --show` / `rivumi status` 這類輕命令**不需要載入 OpenAI SDK / Anthropic SDK / Textual / uvicorn**。

這個 lazy import 策略跟 `docs/startup-performance-playbook.md` 配套——README 寫的 `rivumi --help` 要在 100ms 內完成是 daily-driver UX 的底線。如果每次打 `rivumi --help` 都先 import openai SDK 跟 Textual,help 文字出來前要先付 500-800ms cold start,使用者會明顯感覺到「卡了一下」。

## TUI layout:geometry test + screenshot render

README 對 TUI layout 變更有嚴格要求:

```bash
uv run pytest tests/test_tui.py -q
uv run python scripts/render_tui_screenshot.py --width 120 --height 36 --name wide
uv run python scripts/render_tui_screenshot.py --width 60 --height 22 --name narrow
uv run python scripts/render_tui_screenshot.py --state thinking --name loading
for frame in 0 1 2 3 4 5; do
  uv run python scripts/render_tui_screenshot.py \
    --state thinking --loading-frame "$frame" --name "loading-frame-$frame"
done
```

這不是「順便驗證一下」,是 **layout 變更必跑**。流程是:

- **geometry test** (`tests/test_tui.py`) 確認 TUI 元件在不同 width / height 下不會 overflow、不會被截斷、不會把狀態列擠出可見範圍。
- **wide screenshot** (120x36) 確認大螢幕(IDE 內嵌 terminal、橫向 monitor)顯示正確。
- **narrow screenshot** (60x22) 確認小螢幕(SSH 進 server、樹莓派 terminal)顯示正確。
- **loading state** 確認 model thinking 時的 loading indicator 看得到、不會被文字蓋住。
- **loading frame 0-5** 確認 loading 動畫本身每個 frame 真的在動——位置 cell width 跟 status-label 必須保持固定,不然動畫就不是「動」而是「跳」。

`.artifacts/tui/*.png` 是產出,reviewer 在 merge 前必須看過——包括 active state 的 loading 跟 tool feedback。SVG 也會產出,PNG 透過 macOS Quick Look 或 ImageMagick 轉檔。

這個 workflow 是 TUI 開發的「CRA 測試」(component review artifact):純 unit test 抓不到「layout 在 60-column 變成兩行把 status 列擠出去」這種問題,只能靠實際 render + 人工 review。`scripts/render_tui_screenshot.py` 把 render 流程從「開 terminal 看」變成「CI artifact」,讓 TUI 變更跟功能變更走同一條 review pipeline。

## 整體架構

```
rivumi command (Typer)
├── bare (no subcommand) → interactive TUI mode
├── rivumi exec <PROMPT>  → headless agent run
├── rivumi run <PROMPT>   → alias for exec
├── rivumi resume [id]    → restore non-terminal session
├── rivumi config         → show / interactive / write CLI config
├── rivumi gateway        → start ModelGateway on loopback
├── rivumi status         → list runs in run_root
├── rivumi sessions       → list resumable / completed sessions
├── rivumi export-otel    → export run events as OTel-style telemetry
└── interactive runtime selector
    ├── Rivumi Agent      → native AgentRunner
    ├── Claude Code       → official CLI runtime
    ├── Codex CLI         → official CLI runtime
    ├── OpenCode          → local-only runtime
    ├── Pi                → local-only runtime
    └── OMP               → local-only runtime

AgentRunner (pure async) ←— ApprovalPolicy (TTY | Headless | Callback)
       ↑
       └── EventSink → CompositeEventSink(JsonlEventSink, TUI sink)
                      └── TUI slash commands: /usage /context /model /new /resume /history
```

## 整體來說

CLI / TUI 層的核心斷言:**AgentRunner 是純 async,harness 不知道有 TTY**。所有 daily-driver UX 的責任都在 `cli.py` + `approvals.py` + TUI module——approval 是 prompt 還是自動、resume 怎麼還原狀態、TUI layout 怎麼跨 terminal size、onboarding 怎麼探測本地模型、config 怎麼分 secret / non-secret。最新的方向是 runtime-first:使用者在同一個互動畫面切 Rivumi Agent / 官方 Claude Code / 官方 Codex CLI / local-only OpenCode / Pi / OMP,狀態列直接顯示用量與 context,需要查帳或排查時再用 `/usage`、`/context`、`rivumi sessions`、`rivumi export-otel` 往下鑽。

這個分工的代價:CLI 程式碼量比 loop 還大(`cli.py` 1733 行 vs `loop.py` 1051 行)、onboarding / resume / TUI 三條 path 各自有自己的 edge case 需要被 spec。回報是:**AgentRunner 可以直接被 `AgentRunner.resume()` / `ModelGateway` / Cloudflare Worker 拿來用,不需要任何「互動模式」分支**——所有需要人拍板的決策都收斂在 `ApprovalPolicy` Protocol 裡,實作可以換 TTY prompt / callback / headless 自動放行,但 AgentRunner 完全不感知。

下一篇拆 Cloudflare 部署切片——把同一個 AgentRunner 包進 Sandbox container、Worker 控制面 + Capability DO 怎麼保存 credentials 跟 per-run capability,讓本地這套 daily-driver UX 也能在 cloud 跑。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi README 的 TUI workflow 段落](https://github.com/vincentxuu/rivumi#set-up-with-uv)——geometry test + screenshot render 的官方流程
- [Typer CLI framework](https://typer.tiangolo.com/)——`cli.py` 用的 command routing library
- [Textual TUI framework](https://textual.textualize.io/)——Rivumi TUI 的底層,支援 layout / async / screen
- [Python `asyncio` event loop](https://docs.python.org/3/library/asyncio-eventloop.html)——AgentRunner 跟 CLI 互動的 async 原語
- [PEP 492 — async/await 語法](https://peps.python.org/pep-0492/)——理解 `async def run` 怎麼被 typer 包成 sync CLI command 的背景知識
- [Rich console library](https://rich.readthedocs.io/)——Rivumi CLI 終端機輸出的底層,支援 progress / spinner / table render
- [Pydantic v2 — frozen + extra=forbid](https://docs.pydantic.dev/latest/concepts/strict_mode/)——`ApprovalRequest` 跟 `ApprovalDecision` 的不可變保證從哪來
