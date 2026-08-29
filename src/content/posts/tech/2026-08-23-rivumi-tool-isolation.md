---
title: "Rivumi 的工具隔離：path allowlist、argv 嚴格化、process group 與 credential-free subprocess"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, sandbox]
lang: zh-TW
tldr: "上一篇拆了 Rivumi 的 provider-neutral loop,這篇拆它真正危險的那一層:tool 邊界。一個 coding agent 的執行表面不是模型,是「檔案系統 + 子行程」;只要這兩條邊界守住,prompt injection 沒有槓桿可以放大傷害。Rivumi 的做法是三層收斂:路徑層用 `SafePathPolicy` 做 segment-aware glob + 符號連結逸出偵測 + `.git` 永久屏蔽;argv 層讓 `VerificationCommand` 只能是預先 allowlist 的 tuple、執行時 `shell=False`;子行程層用 `sanitized_subprocess_env` 清掉所有 host credential、用 `start_new_session=True` 開 process group、`SIGTERM` 0.5s 後升 `SIGKILL`,輸出用 `_BoundedCapture` 同時 cap head 與 tail。外部 CLI runtime 走自己的工具集,但回來的 patch 仍要再過同一套 path-bounded audit 與 verification。"
description: "深入拆解 Rivumi coding agent 的工具隔離設計:SafePathPolicy 路徑 allowlist、VerificationCommand argv 嚴格化、sanitized_subprocess_env credential 清空、process group timeout 與 _BoundedCapture 輸出 cap,以及為什麼 prompt injection 在這層沒有槓桿。"
series:
  name: "Rivumi 架構拆解"
  order: 3
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-tool-isolation-en)

[上一篇](2026-08-23-rivumi-provider-neutral-agent-loop.md)拆了 Rivumi 的 loop——`AgentRunner` 對模型宣告「你給 tool_calls,我幫你跑;什麼時候結束,我跑過 verification 算數」。但那段敘事一直把「我幫你跑」當作黑盒子。事實上,**「幫你跑」才是整個系統最危險的部分**:一個 coding agent 的執行表面不是模型,是檔案系統 + 子行程;只要這兩條邊界守住,prompt injection 沒有槓桿可以放大傷害。Rivumi 把這個觀念變成三層收斂——路徑層、argv 層、子行程層——每一層都用 Python 型別系統而不是 prompt 來執行。

## 為什麼 tool 邊界比 model 重要

模型可以被 prompt injection。檔案系統不會。子行程在 `execvp` 之後的行為可以被 POSIX signal 中斷。換句話說,**最容易出事的不是模型講錯話,是模型被注入後請系統「幫我讀 `~/.ssh/id_rsa`」或「幫我跑 `curl … | sh`」**。任何 coding agent 的安全性,最後都會塌縮到「檔案系統呼叫與子行程呼叫有沒有被 allowlist」。

Rivumi 的工具表面只有七個:`list_files` / `read_file` / `search_text` / `replace_text` / `apply_patch` / `run_check` / `git_diff`(定義在 `src/rivumi/tools.py:130-217`)。前五個走檔案系統,`run_check` 走子行程,`git_diff` 是 workspace 內 git 的讀取入口。每個都通過同一個守門員:**`SafePathPolicy`**(路徑)+ **`VerificationCommand` 預先 allowlist**(argv)+ **`sanitized_subprocess_env` + process group**(子行程)。

## 路徑層:SafePathPolicy,segment-aware glob 與符號連結逸出

`SafePathPolicy` 的責任很明確:給定一個 workspace root 與 `allowed_paths` tuple,把所有 model-supplied 的相對路徑收斂成「workspace 內、`allowed_paths` 內、不是 `.git`、不能跨過符號連結」。第一道牆在 `_validate_relative_input`(`policy.py:42-57`):

```python
@staticmethod
def _validate_relative_input(path: str | Path) -> str:
    raw = str(path)
    if not raw or "\x00" in raw:
        raise PathPolicyError("path must be a non-empty relative path")
    if "\\" in raw:
        raise PathPolicyError("backslashes are not accepted in tool paths")

    posix_path = PurePosixPath(raw)
    windows_path = PureWindowsPath(raw)
    if posix_path.is_absolute() or windows_path.is_absolute() or windows_path.drive:
        raise PathPolicyError(f"absolute paths are forbidden: {raw!r}")
    if ".." in posix_path.parts:
        raise PathPolicyError(f"path traversal is forbidden: {raw!r}")
    if any(part == ".git" for part in posix_path.parts):
        raise PathPolicyError("the workspace .git directory is never tool-accessible")
    return raw
```

五條拒絕條件分別對應五種攻擊向量:NUL byte(早期 C 字符串截斷)、backslash(Windows path 注入)、絕對路徑(`/etc/passwd`)、`..`(目錄穿越)、`.git`(寫壞 git 元數據)。五條都先於檔案系統接觸,在純字串階段就 raise,不會到 `Path.resolve()` 才發現。

`resolve()`(`policy.py:94-113`)處理更狡猾的情境——**workspace 內的符號連結指向 workspace 外**。`Path.resolve(strict=False)` 會一路跟到實體路徑,所以「`workspace/link → /etc/passwd`」這種攻擊可以繞過 naive 的 `startswith` 檢查。Rivumi 用 `candidate.relative_to(self.workspace_root)` 來驗證 resolved 路徑仍然在 root 內,如果不在就視同逸出:

```python
def resolve(
    self,
    path: str | Path,
    *,
    allow_workspace_root: bool = False,
) -> Path:
    raw = self._validate_relative_input(path)
    candidate = (self.workspace_root / raw).resolve(strict=False)
    try:
        relative = candidate.relative_to(self.workspace_root).as_posix()
    except ValueError as exc:
        raise PathPolicyError(f"path escapes workspace through a symlink: {raw!r}") from exc
    ...
```

`_walk_files`(`tools.py:219-237`)用 `followlinks=False` 進一步確保遍歷不會被符號連結牽引到外部目錄。**這層不只是「不讀到 `/etc/passwd`」,而是「不會被惡意 symlink 引導到任何非 workspace 檔案」**——包括執行過程中新建的 symlink。

`allowed_paths` 不是 glob 簡寫,而是**segment-aware**。`_match_path_glob`(`policy.py:70-92`)只把**完整的 `**` segment** 當作跨目錄匹配符,其他 `*` 跟 `?` 走 `fnmatchcase`,逐 segment 比對:

```python
@staticmethod
def _match_path_glob(relative: str, pattern: str) -> bool:
    """Match path segments; only a complete ``**`` segment crosses directories."""

    path_parts = tuple(PurePosixPath(relative).parts)
    pattern_parts = tuple(PurePosixPath(pattern).parts)

    @cache
    def match(path_index: int, pattern_index: int) -> bool:
        if pattern_index == len(pattern_parts):
            return path_index == len(path_parts)
        current = pattern_parts[pattern_index]
        if current == "**":
            return match(path_index, pattern_index + 1) or (
                path_index < len(path_parts) and match(path_index + 1, pattern_index)
            )
        return (
            path_index < len(path_parts)
            and fnmatch.fnmatchcase(path_parts[path_index], current)
            and match(path_index + 1, pattern_index + 1)
        )

    return match(0, 0)
```

這個差別很關鍵:用 `fnmatch('*', 'a/b/c')` 在 Python 會回 `False`(因為 `*` 不吃 `/`),所以「`**` 才是跨目錄匹配」是必要的,但很多 glob library 預設就把 `*` 當 `**`——Rivumi 不踩這個坑。配合 `TaskContract.validate_allowed_paths`(`contracts.py:81-93`)在合約層把 pattern 正規化(去 `./`、strip trailing slash、拒絕絕對路徑跟 `..` 跟 NUL),整條鏈從「caller 寫 allowed_paths」到「walker 進入目錄」每一站都有 guard。

## argv 層:VerificationCommand 是 tuple,shell=False,enum 注入

第二層收斂在 `VerificationCommand`(`contracts.py:20-40`):

```python
class VerificationCommand(ContractModel):
    """An exact argv allowlist entry; it is never interpreted by a shell."""

    name: str = Field(min_length=1)
    argv: tuple[str, ...] = Field(min_length=1)
    timeout_seconds: float = Field(default=300.0, gt=0)

    @field_validator("argv")
    @classmethod
    def validate_argv(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        if any(not part or "\x00" in part for value):
            raise ValueError("verification argv entries must be non-empty and NUL-free")
        return value
```

三個關鍵詞:**`tuple`**(不可變)+ **`min_length=1`**(非空)+ **NUL-free**。型別層就拒絕 list-of-str-with-shell-metachars 的概念。然後在 `ToolExecutor.__init__`(`tools.py:76-103`)把整組 verification 編成 dict,並且把 dict 的 keys 注入 `run_check` 的 JSON schema `enum`:

```python
self.verification_commands: dict[str, VerificationCommand] = {}
...
for command in verification_commands:
    ...
    self.verification_commands[name] = command
definitions = list(self._tool_definitions())
run_check_index = next(
    index for index, definition in enumerate(definitions) if definition.name == "run_check"
)
run_check_definition = definitions[run_check_index]
run_check_schema = dict(run_check_definition.input_schema)
run_check_properties = dict(run_check_schema["properties"])
run_check_name = dict(run_check_properties["name"])
run_check_name["enum"] = sorted(self.verification_commands)
...
```

意思是**模型看到的 `run_check` 工具簽章是「name 必須是 allowlist 的 key,沒別的選項」**。模型不能傳 `"name": "curl … | sh"`,因為 adapter 會在翻成 provider 請求前就被 schema validator 擋下;就算 adapter 漏掉,`ToolExecutor.run_check`(`tools.py:594-597`)還會再查一次 dict,model 不在 allowlist 直接 raise `ToolExecutionError`。

執行那一側是 `run_bounded_command(...)`(`tools.py:607-613`),其中 `shell=False` 強制 argv 走 `execvp`,不會經過 `/bin/sh -c` 的字串解析。**整個鏈沒有一個字節會被當作 shell metacharacter 解釋**。

## 子行程層:sanitized env、process group、bounded capture

第三層把焦點放在 subprocess 本身。`run_bounded_command`(`runtime.py:246-358`)是所有外部指令的單一入口,從 `run_check` 到 `apply_patch` 的 `git apply --check`、到 `LocalGitWorkspace` 的 `git clone`,全部走它。它的設計原則是:**環境要清掉 host credentials、process 要有獨立 session、輸出要同時 cap head 跟 tail、超時要走 process group 而不是單行程**。

### Credential-free 環境

`sanitized_subprocess_env`(`runtime.py:71-96`)從 `os.environ` 只挑一份白名單:

```python
_SAFE_ENV_KEYS = {
    "LANG", "LC_ALL", "LC_CTYPE",
    "PATH", "SYSTEMROOT",
    "TEMP", "TERM", "TMP", "TMPDIR", "TZ",
}
_SENSITIVE_ENV_MARKERS = ("API", "AUTH", "CREDENTIAL", "GITHUB", "PASSWORD", "SECRET", "TOKEN")

def sanitized_subprocess_env(*, task_home: Path | None = None) -> dict[str, str]:
    env = {key: value for key, value in os.environ.items() if key in _SAFE_ENV_KEYS}
    env["PATH"] = env.get("PATH", os.defpath)
    env.update(
        {
            "GIT_ASKPASS": "/usr/bin/false",
            "GIT_CONFIG_GLOBAL": os.devnull,
            "GIT_CONFIG_NOSYSTEM": "1",
            "GIT_TERMINAL_PROMPT": "0",
            "PYTHONDONTWRITEBYTECODE": "1",
        }
    )
    ...
    assert not any(marker in key.upper() for key in env for marker in _SENSITIVE_ENV_MARKERS)
    return env
```

兩個關鍵設計:第一,**白名單制**——只接受 11 個安全的 locale / path / tmp 變數;不是黑名單,所以 `MY_APP_TOKEN`、`ANTHROPIC_API_KEY`、`GH_TOKEN` 等「環境裡有的敏感變數」全部不會被繼承。第二,**assert 守門**——白名單套完之後再掃一次所有 key,如果哪個 key 名字含敏感 marker,就讓進程直接 crash 而不是悄悄漏出去。配合 `GIT_ASKPASS=/usr/bin/false` 跟 `GIT_TERMINAL_PROMPT=0`,git 不會跳出密碼 prompt 或讀 `~/.git-credentials`;`PYTHONDONTWRITEBYTECODE=1` 避免子行程把 bytecode 寫到 `__pycache__`。

如果是 workspace 內的呼叫,還會把 `task_home` 注入 `XDG_CACHE_HOME` / `XDG_CONFIG_HOME` / `PIP_CACHE_DIR` / `UV_CACHE_DIR` / `TMPDIR`——所有 cache 跟 temp 都走 `run_dir/.task-env`,不會汙染 home 目錄(下一篇 disposable clone 篇會詳談這個 `task_home` 是怎麼準備的)。

### Process group + 真超時

子行程不能假裝「超時」是「送個 SIGTERM 然後等」——很多指令會 fork grandchild(`make -j`、`pytest --forked`、`npm test` 啟動 webpack daemon),送 SIGTERM 給 process group leader 會殺掉 leader 但 grandchild 還活著,接著繼續寫檔、繼續吃 CPU。Rivumi 用 POSIX `start_new_session=True`(`runtime.py:278`)把子行程放到新 session 與新 process group,然後 `_signal_process_group`(`runtime.py:219-228`)用 `os.killpg(process.pid, sig)` 對整個 group 送信號:

```python
def _signal_process_group(process: subprocess.Popen[bytes], sig: int) -> None:
    if os.name == "posix":
        with suppress(ProcessLookupError):
            os.killpg(process.pid, sig)
        return
    if process.poll() is None:
        if sig == signal.SIGTERM:
            process.terminate()
        else:
            process.kill()

def _stop_process_tree(process: subprocess.Popen[bytes]) -> None:
    """Best-effort process-tree cleanup, with a real process group on POSIX."""

    _signal_process_group(process, signal.SIGTERM)
    with suppress(subprocess.TimeoutExpired):
        process.wait(timeout=0.5)
    _signal_process_group(process, getattr(signal, "SIGKILL", signal.SIGTERM))
    try:
        process.wait(timeout=1.0)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
```

兩段式清理:先 SIGTERM 給整個 group 0.5 秒優雅退出,還沒死透就 SIGKILL 整個 group。Windows 路徑因為沒有 process group,用 `CREATE_NEW_PROCESS_GROUP` 加上 `TerminateProcess`,效果近似但無法遞迴殺 grandchild——Rivumi 在 docstring 把這點當作 best-effort 而非 hard guarantee。

### 輸出 cap:head + tail,不是 tail-only

輸出隔離也是攻擊面:模型如果在某個檔案塞了 10 MB 的二進位,然後用 `cat` 印出來,沒 cap 的話整個塞進下一輪 prompt,token 預算一秒燒光,loop 也跟著爆。Rivumi 用 `_BoundedCapture`(`runtime.py:99-136`)同時保留 head 跟 tail,各占一半配額:

```python
class _BoundedCapture:
    """Drain a pipe fully while retaining only bounded head and tail bytes."""

    def __init__(self, max_bytes: int) -> None:
        self.max_bytes = max_bytes
        self._head_limit = max_bytes // 2
        self._tail_limit = max_bytes - self._head_limit
        self._head = bytearray()
        self._tail = bytearray()
        self.total_bytes = 0

    def add(self, chunk: bytes) -> None:
        self.total_bytes += len(chunk)
        remaining_head = self._head_limit - len(self._head)
        if remaining_head > 0:
            self._head.extend(chunk[:remaining_head])
            chunk = chunk[remaining_head:]
        if chunk and self._tail_limit:
            self._tail.extend(chunk)
            if len(self._tail) > self._tail_limit:
                del self._tail[: len(self._tail) - self._tail_limit]
```

這個設計比「保留最後 N 行」聰明——測試錯誤訊息通常在 stderr 前段(stack trace 開頭),也可能在後段(failure summary);保留兩端能讓模型同時看到錯誤的「徵狀」跟「結論」。`_drain_pipe`(`runtime.py:139-147`)會持續從 pipe 讀到 EOF,所以 child process 不會因為 pipe 滿而死鎖——「output 不被保留」跟「pipe 要被清乾淨」是兩件事,Rivumi 把兩件事解耦。

## 寫入層:read-version hash、atomic replace、git-tracked

檔案寫入是攻擊面另一個軸。`replace_text`(`tools.py:475-571`)展示了一個完整的寫入前 / 寫入中 / 寫入後流程:

```python
relative = target.relative_to(self.workspace).as_posix()
read_version = self._read_versions.get(relative)
current_version = hashlib.sha256(original).hexdigest()
if read_version is None:
    raise ToolExecutionError("read_file must be called before replace_text")
if read_version != current_version:
    raise ToolExecutionError("file changed after read_file; read it again before editing")
```

這個 `read_version` 是 `read_file`(`tools.py:251-265`)在成功讀檔時記下的 SHA-256,寫入時比對:模型必須先 `read_file` 看到 hash A,然後在同一次 run 內 `replace_text` 帶 hash A 才能寫入。如果中間檔案被外部改過(罕見但可能:另一個 process、`git pull`、模型自己兩次 read_file 之間的 race),hash 對不上就 raise。**這把「讀寫一致性」變成跨工具呼叫的不變量**,而不是 prompt 裡的「please read before write」建議。

寫入本身走 `_atomic_replace_file`(`tools.py:452-473`):寫到 `target.name.rivumi-replace-<uuid>` 暫存檔、`fsync`、`os.replace` 原子替換、再 `fsync` 目錄;全程 `O_NOFOLLOW` 拒絕符號連結、`O_EXCL` 拒絕搶佔。如果中途失敗,還會用原始 bytes 把檔案回滾(`tools.py:554-569`)。

最後一道 gate 是 `git ls-files --error-unmatch`(`tools.py:534-541`):只有 git 已追蹤的檔案才能用 `replace_text` 改。新檔案必須走 `apply_patch`,因為新檔案需要 `git add --intent-to-add`(`tools.py:427-442`)才能進入 reviewable diff,這在下一篇 disposable clone 篇會接著拆。

## 執行面的最後一塊:工具 dispatch 的 timeout 守門

`ToolExecutor.execute`(`tools.py:684-744`)是統一入口。它做了兩件容易被忽略的事:

```python
if "timeout_seconds" in call_arguments:
    raise ToolExecutionError("timeout_seconds is controlled by the harness")
if name in {"replace_text", "apply_patch", "run_check", "git_diff"}:
    result = handler(**call_arguments, timeout_seconds=timeout_seconds)
else:
    result = handler(**call_arguments)
```

**模型不能自己指定 `timeout_seconds`**——這個欄位是 harness 從外層 `_effective_timeout(default, override)` 算下來的,結合 `Limits.wall_time_seconds`、`max_tool_output_bytes` 與 `VerificationCommand.timeout_seconds`。模型如果塞 `timeout_seconds=86400` 想繞過超時,會在 dispatch 階段就被拒絕。對應的例外類型只列了五個:`PathPolicyError` / `ToolExecutionError` / `OSError` / `TypeError` / `UnicodeError`——`ValueError` / `RuntimeError` / 任意 Exception 不在內,讓真正的 bug 不會被靜默吞成 tool observation。

## 整體架構

```
                       ┌────────────────────────────────────┐
                       │        AgentRunner (loop.py)       │
                       │  limits + verification-as-gate     │
                       └─────────────────┬──────────────────┘
                                         │
                                         ▼
                       ┌────────────────────────────────────┐
                       │   ToolExecutor.execute(call)       │
                       │   rejects "timeout_seconds" arg    │
                       │   maps name → handler              │
                       └─────────────────┬──────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────┐               ┌─────────────────┐               ┌──────────────────┐
│ SafePathPolicy│              │ replace/apply/   │              │  run_check / git │
│ _validate_    │◄────────────│   _patch policy  │              │  → run_bounded_  │
│  relative_    │              │   .resolve()     │              │     command      │
│  input()      │              │  + read-version  │              │                  │
│ + segment glob│              │  + atomic replace│              │  shell=False     │
│ + symlink     │              │  + git-tracked   │              │  start_new_session│
│   escape det. │              │                  │              │  + killpg SIGTERM│
└──────┬───────┘               └────────┬─────────┘              │    → SIGKILL     │
       │                                │                         │  + _BoundedCapture│
       ▼                                ▼                         │    (head+tail)   │
┌──────────────┐               ┌─────────────────┐               │                  │
│ .git 永久    │               │ read-version    │               │ env:             │
│  屏蔽        │               │  hash 比對      │               │  sanitized_sub-  │
│ NUL/backslash│               │  atomic rename  │               │  process_env     │
│ /absolute/   │               │  fsync parent   │               │  (whitelist+assert│
│ ".." 拒絕    │               │                  │               │   sensitive      │
└──────────────┘               └─────────────────┘               │   markers)       │
                                                              └──────────────────┘
```

## 整體來說

Rivumi 的「loop 屬於 harness」這個斷言,在 tool 這層會翻譯成:**任何 prompt 能觸發的副作用,都先被 Python 型別系統靜態驗證,再被 runtime guard 動態驗證**。`SafePathPolicy` 讓模型看到的「檔案系統」是一個白名單的子集,而且這個白名單不能含 `.git`、不能含 `..`、不能含符號連結逸出;`VerificationCommand` 讓模型看到的「執行指令」是一個 allowlist 的 key 集合,argv 是 tuple 而且走 `shell=False`;`sanitized_subprocess_env` + `_BoundedCapture` + process group timeout 讓子行程是 credential-free、輸出有界、整棵 process tree 一定會死。

最新的外部 CLI runtime 不改這條原則,只是把邊界往後移:Claude Code / Codex CLI / OpenCode / Pi / OMP 可以在自己的 loop 裡使用自己的工具,但它們只在 Rivumi 準備的 disposable clone 裡動作;回到 Rivumi 時,patch 仍要被 `SafePathPolicy`、二進位 / symlink / rename / copy 檢查、final verification 與 source invariant 擋一次。Cloudflare 切片也是同樣邏輯:Worker ingress 先擋路徑與 argv,Sandbox 裡跑 native bounded toolset,provider credential 留在 Worker model proxy。

這層一旦守住,prompt injection 的攻擊面就被壓縮成「讓模型講錯話」——但講錯話的後果頂多是多浪費幾輪 token,**不會是讀到 `~/.aws/credentials`** 或 **`curl … | sh` 拿到主機 shell**。下一篇拆 `LocalGitWorkspace`:為什麼 workspace 是 disposable clone 而不是 source repo 的 alias,為什麼 HEAD 必須 detach,為什麼 `.task-env` 是 sandbox 與 host 的實際接縫。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M1 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md)——harness 設計說明
- [Pydantic v2 — `field_validator` 與 `ConfigDict`](https://docs.pydantic.dev/latest/concepts/validators/)——`VerificationCommand.validate_argv` 與 `TaskContract.validate_allowed_paths` 行為文件
- [POSIX `killpg(3)` — process group signaling](https://man7.org/linux/man-pages/man3/killpg.3.html)——`_signal_process_group` 行為依據
- [Python `subprocess` — `start_new_session` 與 process group](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)——`run_bounded_command` 啟動參數文件
- [OpenAI Codex CLI](https://github.com/openai/codex)——Rivumi 採用「sandbox capability 與人為 approval 分離」的參考對象
- [SWE-ReX](https://github.com/SWE-bench/SWE-ReX)——Rivumi 採用「agent / runtime 分離」概念的參考對象
- [Aider](https://aider.chat/)——Rivumi 採用 unified diff 與 git 作為 review boundary 的參考對象
