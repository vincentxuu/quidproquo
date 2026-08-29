---
title: "Rivumi 的 disposable clone 與 run bundle：為什麼源 repo 不能被改、run bundle 又該長什麼樣"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, git, sandbox, artifacts]
lang: zh-TW
tldr: "Rivumi 永遠不編輯源 repo——它在 `LocalGitWorkspace.prepare()` 用 `--no-hardlinks` 跟 detached HEAD 從 pinned base commit 複製出一個 disposable clone,所有 patch、test、verification 都在 clone 裡跑。跑完後留下 request.json / events.jsonl / checkpoint.json / session.json / changes.patch / test.log / result.json / verification.json；`rivumi resume` 與 `rivumi sessions` 也是從這組 bundle 找回狀態。這套 disposable clone + run bundle 設計讓 review、resume、patch audit 可以同時存在,而且源 worktree 的 HEAD、status、bytes 在 run 之後完全沒變。"
description: "深入 Rivumi 的 workspace 隔離設計：LocalGitWorkspace 的 full SHA 驗證、no-hardlinks、detached HEAD、run_dir-not-inside-source 檢查;run bundle、session manifest 與 artifact 的寫入時機;為什麼這個 disposable clone 不是真的 OS sandbox。"
series:
  name: "Rivumi 架構拆解"
  order: 2
draft: false
---

上一篇拆了 loop,這篇拆 loop 跑之前的第一個動作——workspace 怎麼準備。Rivumi 的斷言很硬:**agent 永遠不編輯源 repo**。所有 patch、test、verification 都在一個 disposable clone 裡跑,源 worktree 的 HEAD、status、bytes 在 run 結束後完全沒變。這個保證靠兩個東西的組合:`LocalGitWorkspace` 從 pinned base commit 複製出一個 detached-HEAD clone,以及 run 結束後留下 6 個 artifact 讓審計者能「回到那個 run」檢視任何時刻的狀態。

## 為什麼一定要 disposable

「在源 repo 上直接改、跑測試、看結果」聽起來很自然,但在 production 環境會撞三個牆:

- **可審計性**:如果 agent 在源 repo 上直接 patch,要回答「這次 run 改了哪些檔案」必須靠 `git diff HEAD~` 或 `git status`,而這兩個都依賴「跑完之後還沒被 reset」。一旦跑了 `git reset --hard` 之類的指令(例如修了重複 fingerprint 想重新驗證),所有線索就消失。
- **可重現性**:`pip install -e .`、`pnpm install` 之類的副作用會污染 source tree 裡的 `__pycache__` / `node_modules` / `.venv`——這些在第二次跑同一個 run 時可能影響結果,而且無法靠 Git 還原。
- **可取消性**:中途想放棄這次 run 怎麼辦?最便宜的方式是「整個 workspace 直接砍掉」,但如果 agent 在源 repo 上工作,放棄就意味著「手動把 agent 改的東西 revert 回 base commit」——萬一 agent 已經在多個檔案做了一連串編輯,revert 本身就有出錯風險。

disposable clone 把這三個問題一次解掉:**audit 靠 clone 裡的 artifact 檔,reproduce 靠重新 clone 同一個 SHA,cancel 靠 `rm -rf workspace/`**。

## LocalGitWorkspace:把每一條保險都寫進 `prepare()`

`src/rivumi/runtime.py:361-466` 的 `LocalGitWorkspace` 是這個保證的執行者。先看建構子:

```python
@dataclass
class LocalGitWorkspace:
    source_repo: Path
    run_dir: Path
    base_sha: str
    workspace_name: str = "workspace"
    git_timeout_seconds: float = 30.0

    def __post_init__(self) -> None:
        self.source_repo = Path(self.source_repo).resolve(strict=False)
        self.run_dir = Path(self.run_dir).resolve(strict=False)
        if not self.workspace_name or Path(self.workspace_name).name != self.workspace_name:
            raise ValueError("workspace_name must be one path segment")
        if not _FULL_SHA.fullmatch(self.base_sha):
            raise ValueError("base_sha must be a full 40-character Git commit SHA")
```

兩個 invariant 在物件建立時就 enforce:**`base_sha` 必須是完整的 40 字元 hex SHA**(短 SHA、branch 名稱、tag 都拒絕——這避免「上游 force-push 後舊 SHA 還能用」的問題),**`workspace_name` 必須是單一 path segment**(避免「`../foo`」或絕對路徑穿透)。

接下來看 `prepare()`——這是把 source repo 變成 disposable clone 的實際步驟(`runtime.py:398-466`):

```python
def prepare(self, *, timeout_seconds: float | None = None) -> Path:
    deadline = time.monotonic() + timeout_seconds if timeout_seconds is not None else None

    def remaining() -> float | None:
        if deadline is None:
            return None
        value = deadline - time.monotonic()
        if value <= 0:
            raise WorkspacePreparationError(
                "workspace preparation exceeded the harness timeout"
            )
        return value

    source = self.source_repo.resolve(strict=True)
    if not source.is_dir():
        raise WorkspacePreparationError(f"source repository is not a directory: {source}")

    run_dir = self.run_dir.resolve(strict=False)
    try:
        run_dir.relative_to(source)
    except ValueError:
        pass
    else:
        raise WorkspacePreparationError("run_dir must not be inside the source repository")

    if self.workspace_path.exists():
        raise WorkspacePreparationError(f"workspace already exists: {self.workspace_path}")
    self.run_dir.mkdir(parents=True, exist_ok=True)

    resolved = self._git(
        ("-C", str(source), "rev-parse", "--verify", f"{self.base_sha}^{{commit}}"),
        cwd=self.run_dir,
        timeout_seconds=remaining(),
    )
    if not resolved.ok or resolved.stdout.strip().lower() != self.base_sha.lower():
        raise WorkspacePreparationError(
            "base_sha is not an exact commit in the source repository"
        )

    cloned = self._git(
        (
            "clone",
            "--no-hardlinks",
            "--no-checkout",
            "--",
            str(source),
            str(self.workspace_path),
        ),
        cwd=self.run_dir,
        timeout_seconds=remaining(),
    )
    if not cloned.ok:
        raise WorkspacePreparationError(f"git clone failed: {cloned.stderr.strip()}")

    checked_out = self._git(
        ("checkout", "--detach", self.base_sha),
        cwd=self.workspace_path,
        timeout_seconds=remaining(),
    )
    if not checked_out.ok:
        raise WorkspacePreparationError(f"git checkout failed: {checked_out.stderr.strip()}")
    head = self._git(
        ("rev-parse", "HEAD"),
        cwd=self.workspace_path,
        timeout_seconds=remaining(),
    )
    if not head.ok or head.stdout.strip().lower() != self.base_sha.lower():
        raise WorkspacePreparationError("disposable workspace HEAD does not match base_sha")
    return self.workspace_path
```

這段做了幾件事,每一件都有對應的攻擊面:

- **`source.resolve(strict=True)`** 解析 symlink,確保後續所有 `relative_to` 比對是解析後的真實路徑。
- **`run_dir.relative_to(source)`** 主動檢查「run_dir 不能在 source 裡」——如果 user 把 `--run-root` 設成 source repo 內的某個子目錄,clone 會在 source 裡建一個新目錄,意外覆蓋或污染 source tree。`ValueError` 例外被 `pass` 吃掉、`else` 才 raise,所以這個檢查只有在「run_dir 真的在 source 裡」時才 reject。
- **`rev-parse --verify base_sha^{commit}`** 先驗證 SHA 真的存在於 source,避免「SHA 寫錯導致 clone 出來是空 repo」這種靜默錯誤。
- **`git clone --no-hardlinks --no-checkout`** 兩個關鍵旗標:`--no-hardlinks` 強制走檔案複製而不是 hard link,確保 clone 跟 source 之間沒有共用 inode,source 的檔案系統層級變化(例如 reflink、cow)不會直接反映到 workspace;`--no-checkout` 先不 checkout,讓後續的 `git checkout --detach base_sha` 把 HEAD 設在指定 SHA。
- **`git checkout --detach base_sha`** 強制 detached HEAD,workspace 不在任何 branch 上——後續任何 `git checkout <branch>` 嘗試會 fail,保證 agent 不會「不小心切到 main 然後把 patch commit 上去」。
- **最後再一次 `git rev-parse HEAD` 比對** 是防呆:確認 checkout 真的落在 base_sha 上,避免「clone 成功但 checkout 沒生效」之類的 Git 內部狀態錯誤。

這套準備流程**完全沒有寫到 source repo 的任何檔案**——所有 git 操作都是 read-only 或在 workspace 內。`_git()` 還用了 `sanitized_subprocess_env`(下一篇細講),把 subprocess 環境清空、避免 Git 從父行程繼承任何設定。

## Run bundle:artifact 對應不同讀者

Loop 結束後留下的檔案結構,在 `loop.py:691-697` 可以看到核心路徑表:

```python
artifacts={
    "request": str(self.run_dir / "request.json"),
    "events": str(self.run_dir / "events.jsonl"),
    "checkpoint": str(self.run_dir / "checkpoint.json"),
    "patch": str(self.run_dir / "changes.patch"),
    "test_log": str(self.run_dir / "test.log"),
    "result": str(self.run_dir / "result.json"),
},
```

加上 `verification.json`(在 `_verify_all` 寫入)與 `session.json` manifest,每個都對應不同的「審計者或 CLI 想問的問題」:

| 檔案 | 寫入時機 | 回答的問題 |
|---|---|---|
| `request.json` | run 開始時(`loop.py:770`)| 我們這次打算做什麼?TaskContract 的 frozen snapshot,instruction / allowed_paths / verification 全部在裡面 |
| `events.jsonl` | 每次事件 append | 「每一步發生過什麼」的時間序,append-only,前一篇講過 |
| `checkpoint.json` | 每次 status 變更(`loop.py:428`)| 我們現在到哪個 phase?run.state 的快照,但不像 session.json 那樣是 source of truth |
| `changes.patch` | 每次有 diff 更新 + run 結束時 | 「最終改了什麼」的人類可讀 unified diff,即使 run 失敗也會寫空字串 |
| `test.log` | 每次 verification 跑完 + run 結束時 | 每條 verification 命令的 stdout / stderr,失敗時也寫空檔保證存在 |
| `result.json` | run 結束時(`loop.py:704`)| `RunResult` 的 frozen snapshot,含 status / terminal_reason / verification outcomes / artifacts 路徑 |
| `verification.json` | `_verify_all` 結束時(`loop.py:608`)| 純粹是 `VerificationOutcome` list 的 JSON dump,給快速查驗用 |
| `session.json` | 每次狀態提交 | resume 的 state-of-record,保存 messages / usage / step / event sequence / writer lease |

注意 `RunResult.artifacts` 是個路徑字典——**它把「這個 run 的所有產出在哪裡」本身當作 result 的一部分記下來**。意思是審計者拿到 `result.json` 就知道「要看 events 在這、看 patch 在那」,不用再開 loop 才知道檔案 layout。

## 為什麼這不是真的 sandbox

`LocalGitWorkspace` 的 docstring 直接寫明它是「workspace isolation, not a hostile-code OS sandbox」(M1 文件的 known limitations)。它保護的東西是:

- source repo 的工作樹(不會被 agent 寫到)
- source repo 的 `.git` 目錄(完全沒被 clone 進 workspace,後面 `SafePathPolicy` 還會擋)
- workspace 之間的互相影響(每個 run 自己的 workspace_path)

它**不**保護的東西:

- **host 檔案系統**:agent 透過 `replace_text` 改的只能是 workspace 內的檔案,但 `apply_patch` 如果被 prompt injection 餵一個絕對路徑,policy 會擋;但如果 agent 真的有辦法繞過 policy,workspace 跟 host 之間沒有任何 OS-level 隔離。
- **網路**:workspace 內的 subprocess 仍然能打 internet(除非後面接 cloudflare sandbox / Docker),如果 prompt injection 讓 verification 跑某個惡意測試,可能會 leak 資料。
- **process privilege**:agent 在 run 時用的就是當前使用者的權限,任何能跑 `sudo` 的環境對它都開放。
- **`.pyc` 重用**:M1 文件提到的「同秒、同大小的 Python edit 可能 reuse stale `.pyc`」是另一個不是 sandbox 的 bug——`sanitized_subprocess_env` 設 `PYTHONDONTWRITEBYTECODE=1` 解掉這個,但這是針對 Python bytecode 的特殊處理,不代表整個 workspace 有 OS sandbox 等級的隔離。

所以 Rivumi 的定位是:本地跑時,disposable clone + SafePathPolicy + sanitized env 對「已知、不敵意的程式碼」已經夠了(例如開發者自己的 repo);對「真的不信任的程式碼」必須接 cloudflare sandbox / Docker(`LocalGitWorkspace` 在 cloudflare/ 子專案被包進 Sandbox container,後續第八篇會拆)。

## Source isolation E2E:驗證保證真的有效

M1 文件裡寫的 release-gate verification 包含一條「source isolation E2E」:

> Source-isolation E2E compares source HEAD, porcelain status, and file bytes before and after.

意思是 release-gate 跑的時候,Rivumi 在 agent 跑之前 snapshot source repo 的三個屬性:`HEAD` 是哪個 commit、`git status --porcelain` 的輸出、每個檔案的 SHA-256 bytes;agent 跑完整個 loop 之後再 snapshot 一次,兩個必須完全一致。這條測試是「disposable clone 真的沒有寫到 source」的 OS-level 證據——比 unit test「有呼叫到 git clone」強很多。

後續 milestone 引入 live provider eval(`scripts/eval_live_provider.py`)時,這條 source isolation 也帶進去了:每個 eval 跑完都會 cross-check source repo 的 HEAD / status / bytes,任何不一致就把整個 eval 標記成失敗。所以「disposable clone 真的沒污染」這個保證是**每一次跑都驗證一次**,不是「設計上應該這樣但沒測試」。

## 整體架構

```
TaskContract ──► AgentRunner
                  │
                  ├── LocalGitWorkspace.prepare() ──► detached HEAD clone in run_dir/workspace/
                  │                                     │
                  │                                     │ (所有 patch / test / verification 都在這)
                  │
                  ├── events.jsonl  ◄── append-only, fsync
                  ├── checkpoint.json ◄── atomic_write_json
                  ├── request.json  ◄── atomic_write_json (immutable snapshot of TaskContract)
                  ├── changes.patch ◄── 每次 diff 更新寫一次,終態寫一次
                  ├── test.log    ◄── 每條 verification 的 stdout/stderr
                  ├── verification.json ◄── atomic_write_json
                  └── result.json ◄── atomic_write_json (RunResult + artifacts map)
```

## 整體來說

disposable clone + run bundle 是一組配套設計:**前者保證 source 不被改,後者保證改的過程被記得**。前者靠的是 LocalGitWorkspace 的 `prepare()` 把每一個攻擊面都 explicit reject;後者靠的是固定 artifact path、`session.json` manifest、append-only events 與 RunResult artifact map。最新的 external runtime 也吃同一條邊界:Codex CLI、Claude Code、OpenCode、Pi、OMP 都在 disposable clone 裡工作,跑完之後由 Rivumi 做 path-bounded patch audit 與 final verification,不讓外部 CLI 直接把 source repo 當工作區。

這個保證的代價是顯而易見的:每次 run 都多一次完整 clone(`--no-hardlinks` 強制檔案複製,在大型 repo 上可能數秒到數分鐘)。回報是:**審計不需要 trust agent**,審計者只要讀 `result.json` 跟 `changes.patch` 就能完整回答「這次 run 做了什麼、為什麼這樣做、結果是什麼」;需要繼續做時,`rivumi resume` 從 `session.json` 找回 state,不需要重放整個 loop。

下一篇拆工具隔離(`SafePathPolicy` / `ToolExecutor` / `sanitized_subprocess_env`)——disposable clone 保證了 workspace 之外不會被改,但 workspace 之內的「哪些路徑 / 哪些指令 / 哪些環境變數」可以動,還要靠更細的 boundary。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M1 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md)——`LocalGitWorkspace` 跟 source-isolation E2E 的官方說明
- [Git — `git clone --no-hardlinks` 行為](https://git-scm.com/docs/git-clone)——為什麼這個旗標在 disposable clone 是必要的
- [Git — `git checkout --detach`](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---detach)——detached HEAD 的語意跟保護作用
- [Aider 的 Git 整合](https://aider.chat/docs/repomap.html)——另一個用 Git 作為 review boundary 的 coding agent,對照組
- [mini-SWE-agent 的 Environment 設計](https://github.com/SWE-bench/mini-SWE-agent)——Rivumi 的「agent / runtime 分離」概念來源
- [SWE-ReX: reproducible agent execution](https://github.com/SWE-bench/SWE-ReX)——另一個把 execution 跟 model 解耦的 runtime
- [Reproducible builds](https://reproducible-builds.org/)——「同樣的 input 永遠產生同樣的 output」的工程原則,disposable clone 的精神對齊
