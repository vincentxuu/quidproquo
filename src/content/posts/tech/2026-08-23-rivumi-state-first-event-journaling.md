---
title: "Rivumi 的 state-first event journaling：為什麼 manifest commit 跟 JSONL append 之間的 crash 要靠 state 修"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, crash-recovery, journaling, file-locking]
lang: zh-TW
tldr: "Rivumi 同時維護兩份寫入路徑:append-only 的 `events.jsonl` 跟原子替換的 `session.json` manifest。當 process 在兩者之間 crash,單靠任何一份都會誤判狀態——只看 JSONL 會以為某個 side effect 沒跑,只看 manifest 會以為某個 tool call 已經完成。所以 Rivumi 把 manifest 當作 state-of-record、events 當作 audit trail,resume 時先用 `manifest.last_event_sequence` 對 JSONL 做 reconciliation,再用 `last_event_type` 決定能不能自動續跑。停在哪個事件決定恢復策略——停在前半段可以 resume,停在 `tool.started` 或 `verification.started` 必須 hard fail；TUI 的 `/new`、`/resume`、`/history` 與 `rivumi sessions` 都是建立在這個 state-first contract 上。"
description: "深入 Rivumi 的 crash-safe 設計：atomic_write_json 用同目錄 temp file + fsync,EventWriter 用 O_APPEND + fsync,SessionWriterLease 用 fcntl.flock + O_NOFOLLOW,claim_and_validate_resume 的 manifest_was_ahead 邏輯,以及為什麼 tool.started / verification.started 不能自動 resume。"
series:
  name: "Rivumi 架構拆解"
  order: 4
draft: false
---

前一篇拆了 loop,前兩篇拆了 disposable clone 跟 run bundle。這一篇拆它們能 crash-safe 的原因——也是 Rivumi 把 audit 跟 state 拆成兩份不同檔案的理由:append-only 的 `events.jsonl` 跟原子替換的 `session.json` manifest。同時維護兩份寫入路徑不是冗餘,是因為**單靠任何一份都無法正確判定「process 在哪一步 crash」**。

這個斷言聽起來抽象,放進具體情境就清楚:假設 AgentRunner 正在跑 `replace_text`,這個 tool call 已經寫進 `events.jsonl`(`tool.started` 事件已經 append),但 tool 還沒真的執行就被 SIGKILL。manifest 上還是上一輪的快照,JSONL 卻已經多了一行「started」。下次重啟時,光是讀 manifest 會以為「這個 tool 還沒開始」,光是讀 JSONL 會以為「這個 tool 已經跑了但結果沒寫回來」。兩種判讀都不對。

Rivumi 的解法不是「retry 一次就好」,而是讓 manifest 自帶 `last_event_sequence` 跟 `last_event_type`,resume 時拿這兩個欄位去跟 JSONL 對齊——對得上就 resume,對不上就依情況 hard fail 或 partial-resync。

## 兩種寫入,兩個保證

`events.jsonl` 的寫入在 `src/rivumi/events.py:46-57`:

```python
def _append_bytes(path: Path, payload: bytes, *, durable: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(path, os.O_APPEND | os.O_CREAT | os.O_WRONLY, 0o600)
    try:
        view = memoryview(payload)
        while view:
            written = os.write(descriptor, view)
            view = view[written:]
        if durable:
            os.fsync(descriptor)
    finally:
        os.close(descriptor)
```

幾個關鍵選擇:`O_APPEND` 保證 POSIX 層級的 append 原子性(同一個行程內不會被別的寫入切開),`0o600` 限制權限,`fsync` 在 durable 模式下把資料真的推到磁碟。**沒有 truncate、沒有 rewrite、沒有 seek**——每一行一旦寫進去就再也讀不到「之前的版本」。`EventWriter.append` 再加一個 `asyncio.Lock` 把同一個 process 內的 append 序列化,所以 `events.jsonl` 永遠是「曾經發生過的事」的精確時間序。

`session.json` 的寫入路徑完全相反,在 `events.py:60-83`:

```python
def _atomic_write(path: Path, payload: bytes, *, durable: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent,
            prefix=f".{path.name}.",
            delete=False,
        ) as file:
            temporary_path = Path(file.name)
            file.write(payload)
            file.flush()
            if durable:
                os.fsync(file.fileno())
        os.replace(temporary_path, path)
        if durable:
            directory = os.open(path.parent, os.O_RDONLY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
    finally:
        if temporary_path is not None and temporary_path.exists():
            temporary_path.unlink()
```

這是經典的「write-temp-then-rename」:在同目錄下建一個 `.{name}.{rand}` temp file,寫完 + flush + fsync,然後用 `os.replace` 把它 rename 成正式檔。**讀者永遠只看到完整檔或不存在兩種狀態**——不會看到「寫到一半」的版本。最後對 parent directory 也 fsync 一次,確保 rename 的 metadata 也落到磁碟,不然下次開機有可能看到 temp file 還在、原檔是舊版本。

兩個寫入路徑合在一起,Rivumi 才能同時說兩句話:**「events.jsonl 紀錄的每一行都是真實發生過的」** 跟 **「session.json 永遠是某個一致狀態的快照」**。前者是審計,後者是控制;它們各自用最適合的檔案語意。

## SessionManifest:resume 用的最小 state-of-record

`session.py:72-104` 的 `SessionManifest` 是 resume 真正會讀的東西:

```python
class SessionManifest(ContractModel):
    schema_version: Literal[1] = _SCHEMA_VERSION
    run_id: str = Field(min_length=1)
    task_id: str = Field(min_length=1)
    provider_name: str = Field(min_length=1)
    model_id: str = Field(min_length=1)
    protocol: str = Field(min_length=1)
    prompt_version: str = Field(default="m2-unversioned-patch", min_length=1)
    base_sha: str = Field(pattern=r"^[0-9a-fA-F]{40}$")
    phase: SessionPhase = SessionPhase.CREATED
    step: int = Field(default=0, ge=0)
    messages: tuple[ConversationItem, ...] = ()
    usage: Usage = Field(default_factory=Usage)
    final_summary: str = ""
    last_action_fingerprint: str | None = None
    repeat_count: int = Field(default=0, ge=0)
    last_event_sequence: int = Field(default=-1, ge=-1)
    verification: tuple[VerificationOutcome, ...] = ()
    pending_action: ApprovalRequest | None = None
    approval_history: tuple[ApprovalAuditRecord, ...] = ()
    granted_effects: frozenset[ToolEffect] = frozenset()
    active_wall_time_seconds: float = Field(default=0.0, ge=0)
    active_started_at: datetime | None = None
    terminal: bool = False
    active_writer_token: str | None = None
    writer_claimed_at: datetime | None = None
    writer_heartbeat_at: datetime | None = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
```

兩個欄位是 crash recovery 的核心:

- **`last_event_sequence`**——manifest 寫入時,`events.jsonl` 已經寫到哪個 sequence。Resume 對齊用的錨點。
- **`active_writer_token`** + `writer_claimed_at`——OS-level writer fencing 用,後面詳述。

其他欄位也值得一提:`step` / `repeat_count` / `last_action_fingerprint` 三個對應前一篇講的 repetition guard,讓 guard 跨 resume 持續;`pending_action` 是「等使用者按 y/n」的中斷狀態,互動 CLI 可以在 SIGINT 後用這個恢復 approval prompt;`active_wall_time_seconds` 跟 `active_started_at` 是 wall-time budget 跨 resume 累計用的,保證「一個 run 不管被切幾次,總時間不會超過 `task.limits.wall_time_seconds`」。

注意 `messages` 跟 `approval_history` 是 `tuple` 不是 `list`——跟 `ContractModel` 的 `frozen=True` 一致,所以 manifest 一旦寫出去就不會被 in-memory mutation 偷偷改掉。如果改了,要重新走 atomic_write。

## Writer lease:fcntl.flock 是真正的 fence

`session.py:194-212` 的 `acquire_writer` 是 Rivumi 怎麼防止「兩個 process 同時寫同一個 session」的:

```python
def acquire_writer(self) -> SessionWriterLease:
    if self.run_dir.is_symlink():
        raise SessionValidationError("session run directory cannot be a symlink")
    self.run_dir.mkdir(parents=True, exist_ok=True)
    flags = os.O_CREAT | os.O_RDWR
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    descriptor = os.open(self.run_dir / ".writer.lock", flags, 0o600)
    try:
        fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError as exc:
        os.close(descriptor)
        raise SessionBusyError("session already has an active writer") from exc
    token = uuid4().hex
    os.ftruncate(descriptor, 0)
    os.write(descriptor, f"pid={os.getpid()} token={token}\n".encode())
    if self.durable:
        os.fsync(descriptor)
    return SessionWriterLease(self.run_dir.resolve(), token, descriptor)
```

關鍵點是 **`fcntl.flock` 是 advisory lock**,只在同一個檔案描述符上有效——但因為 `SessionWriterLease` 把 descriptor 包進物件且整個 run 不關(`lease.release` 只在 finally 跑),同一個 process 的後續 save 一定看到自己的 token。同時另一個 process 嘗試 acquire 同一個 `.writer.lock` 會拿到 `BlockingIOError` → `SessionBusyError`,所以「兩個 rivumi run 同時搶同一個 session」在 OS 層就被擋下來。

`O_NOFOLLOW` 是 macOS / Linux 上的「不解析 symlink」旗標,搭配前面的 `is_symlink` 檢查,擋下「run_dir 是 symlink → flock 跟到別處」的攻擊面。`_writer.lock` 本身沒內容,只是 flock 的載體;真正記 writer 是 `token`(隨機 UUID)寫進 lock 檔案的開頭。

`SessionStore.save` 在寫 manifest 前還會 double-check `manifest.active_writer_token == lease.token` 跟 `on_disk.active_writer_token == lease.token`——這是「就算我 lease 還在,manifest 也不能被另一個 process 偷改」的第二層保險。

## 為什麼 tool.started 不能 auto-resume

`session.py:288-309` 的 `claim_and_validate_resume` 是整個 crash recovery 邏輯的心臟:

```python
async def claim_and_validate_resume(
    self, lease: SessionWriterLease, *, allow_terminal: bool = False
) -> tuple[SessionManifest, TaskContract]:
    manifest = await self.claim(lease)
    task = await self._validate_request(manifest)
    actual_last, last_event_type = await self._validate_events(manifest)
    manifest_was_ahead = manifest.last_event_sequence == actual_last + 1
    if manifest_was_ahead:
        manifest = manifest.model_copy(update={"last_event_sequence": actual_last})
        manifest = await self.save(manifest, lease)
    if not manifest_was_ahead and last_event_type in {
        "tool.started",
        "verification.started",
    }:
        raise SessionValidationError(
            "session stopped during a side effect; automatic resume cannot prove whether "
            "the action completed"
        )
    return manifest, task
```

兩個關鍵觀察。

**第一個:`manifest_was_ahead` 處理「manifest commit 後 JSONL 還沒 append 就 crash」**。如果 manifest 說「我已經寫到 sequence 42」但 JSONL 實際只到 sequence 41,代表 manifest 寫盤成功、`tool.started` 還沒 flush 到磁碟就被 kill。這種情況其實是「無副作用」——因為 tool 真的執行是要寫在 `tool.completed` 事件之後,而 `tool.started` 本身只標記「AgentRunner 準備執行」,所以可以把 manifest 的 `last_event_sequence` 修回 41 然後正常 resume。

**第二個:`tool.started` / `verification.started` 出現在 JSONL 末尾時不能 resume**。條件是 `not manifest_was_ahead` 且 `last_event_type in {"tool.started", "verification.started"}`——意思是「JSONL 是最新的,manifest 還沒追上來,且最後一個事件是 side effect 的開始」。這時候我們**沒辦法靠 state 證明 side effect 是否真的執行完**。`tool.started` 已經寫進 JSONL 但 `tool.completed` 沒有——到底是「tool 真的跑了、寫完結果正要回 AgentRunner 時被 kill」還是「tool 根本還沒啟動就被 kill」?純 state 無法分辨。

這個選擇是 deliberate 的:與其可能重複執行一個 side effect(`replace_text` 寫了兩次、`run_check` 跑了兩遍、verification 又重跑一次),不如直接 raise `SessionValidationError` 讓使用者決定。對 production 環境來說,**重複 side effect 比「run 卡住」糟糕得多**——patch 已經寫進去了,再跑一次 `apply_patch` 可能會因為找不到要替換的字串而 fail,更糟的是把整個 run 標記成 COMPLETED 卻留下一個被破壞的 workspace。

## 整體:state-first 是結果不是方法

回頭看,Rivumi 不是「先決定要 state-first 才這樣寫」,而是把所有需要 atomic 的欄位放進 `SessionManifest`、把所有需要 audit 的事件放進 `events.jsonl` 之後,**自然就變成 state-first 了**。原因是:

- events.jsonl 是「已經發生」的事——append-only,所以任何一行都不會被改;但它**不知道現在進行到哪一步**,只看它無法決定「下一步該怎麼做」。
- session.json 是「現在狀態」——原子替換,所以隨時可以讀到一致快照;但它**不知道這狀態是怎麼走到這裡的**,只看它無法決定「這次執行到底算不算數」。

Resume 時兩者合在一起:manifest 提供「現在進行式」的 state-of-record,events 提供「已經發生過」的 history-of-record;拿 manifest 的 `last_event_sequence` 對 events 對齊,再拿 `last_event_type` 決定恢復策略。如果對得起來,manifest 為主;如果停在 side effect 的「started」事件,寧可 hard fail 也不 auto-resume。

這個設計的 trade-off 很明顯:**session.json 會越來越大**——`messages` 跟 `approval_history` 都直接放進 manifest,一個長 conversation 的 message 累積起來可能比 events.jsonl 還肥。但對這個專案來說,單一 run 的 message 量本來就被 `max_steps`(預設 12)綁住,且每次 save 是 atomic 寫整份,效能瓶頸在 I/O 而非序列化——所以用「大檔 + 簡單一致語意」換「保證 resume 永遠有一份 snapshot 可讀」是值得的。

## 整體來說

State-first journal 不是「多加一層保險」,是 append-only 跟 atomic-rename 兩種檔案語意各有局限時的**強迫分工**:audit 跟 control 不能用同一個檔案,因為它們的寫入模式根本相反(append vs replace);寫在一起不是冗餘,是把「發生過什麼」跟「現在到哪裡」拆清楚。

這也是最新 TUI / session 工具能成立的原因:`/resume` 不是從螢幕文字猜狀態,`/history` 不是倒放 vendor transcript,`rivumi sessions` 也不是掃一堆臨時 log。它們共同讀的是 versioned `session.json` 與 append-only events。外部 CLI runtime 的 vendor session id 不必變成 Rivumi 的 source of truth;Rivumi 只保存自己能驗證的狀態、patch、usage 與 event sequence。

下一篇拆 `ExternalCodingRunner`——這個設計在 Rivumi 裡的角色特別刁鑽:Rivumi 同時又是 orchestration,讓 Codex CLI / Claude Code CLI 跑它們自己的 loop,然後回頭用同一份 verification 跟 patch audit 驗證結果——這套「兩個 loop 共用一份 verification」要怎麼不踩到「state-first journal 寫進去的東西跟 external runtime 寫進去的東西會打架」的雷,是這篇之後會拆的。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M3 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m3-reliable-editing-real-provider-eval.md)——checkpoint / resume 的官方里程碑紀錄
- [POSIX `fcntl.flock` advisory locks](https://man7.org/linux/man-pages/man2/flock.leases.5.html)——Rivumi 的 writer lease 用的系統呼叫
- [Linux `O_APPEND` atomicity guarantee](https://man7.org/linux/man-pages/man2/open.2.html)——為什麼 `events.jsonl` 的 append 在同行程內不會被切開
- [SQLite WAL mode](https://www.sqlite.org/wal.html)——另一個用「append-ahead + state-from-state」的 crash-safe 設計,概念對照
- [Crash-only software: designing for recovery](https://lwn.net/Articles/191059/)——「crash 是常態不是例外」的工程典範,Rivumi 的設計哲學對齊
- [Pydantic v2 — frozen models 與 extra=forbid](https://docs.pydantic.dev/latest/concepts/strict_mode/)——`SessionManifest` 的不可變保證從哪來
- [filesystem `fsync(2)` 與 durability](https://man7.org/linux/man-pages/man2/fsync.2.html)——Rivumi 在 `durable=True` 時多處顯式 fsync 的系統呼叫文件
