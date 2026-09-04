---
title: "跟成熟 coding agent 學設計（19）：Session 持久化與 crash recovery——agent 死掉之後，狀態怎麼救"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 19
tags: [coding-agent, session-persistence, crash-recovery, looplane, claude-code]
lang: zh-TW
tldr: "五家 agent 的 session 儲存幾乎都是 append-only JSONL 加上某種單寫者保護，但 crash recovery 的差別在細節：pi 會修 torn tail、codex 寫失敗會重開檔重試、looplane 選了「manifest 先落盤」讓唯一的 crash window 變成可修復的一格。這篇拆解每家的寫入順序與 fail-closed 條件，全部附 file#symbol 證據。"
description: "對照 pi、omp、opencode、codex、claude-code 五家原始碼的 session 持久化設計：事件格式、單寫者 fencing、crash window 分析，以及 looplane 為什麼選擇 manifest 先行加驗證式 resume。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en)

本篇取證範圍：**pi**（badlogic/pi-mono）、**omp**（can1357/oh-my-pi）、**opencode**（sst/opencode）、**codex**（openai/codex Rust workspace）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入），對照我自己的 **looplane**。所有引用都在本地 clone 實際讀過。

## 設計問題：agent 跑到一半死掉，狀態怎麼救

一個長跑的 coding agent session 是一大筆不可重來的成本：幾十輪模型呼叫、幾百 KB 的工具輸出、使用者中途給的授權決定。process 被 OOM killer 殺掉、終端機關掉、斷電——任何一種死法之後，「重跑一次」往往不是選項。

所以真正的設計問題有三層：

1. **寫什麼**：要存的是完整對話訊息，還是事件流？事件流可以事後重建狀態（[Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) 的思路），但每次 resume 都要 replay。
2. **怎麼寫才不會寫壞**：crash 如果發生在寫入的中間呢？append 到一半的行、改到一半的 manifest，resume 時讀到就是垃圾。
3. **誰有資格寫**：兩個 process 同時 resume 同一個 session，事件流就交錯了。你需要單寫者保證，而且這個保證本身不能依賴 process 活著。

第三點是最容易被忽略的：鎖如果只存在記憶體裡，crash 就把鎖一起帶走，殭屍 session 就誕生了。

## 五家怎麼做

### pi：JSONL 加 header，torn tail 自動修復

pi 的 harness 把每個 session 存成一個 JSONL 檔：第一行是版本化的 header（`version: 4`，含 id、cwd、`parentSessionId`），之後每一行是一個 mutation。目錄結構按 cwd 分類，檔名是時間戳加 id（`pi-mono/packages/agent/src/harness/session/jsonl/repo.ts#JsonlSessionRepo`）。

載入時的韌性處理很值得抄（`jsonl/storage.ts#JsonlSessionStorage.load`）：如果最後一行是語法錯誤——典型的 append 到一半被砍——它判定為 torn tail，把有效前綴用 temp file 加 rename 的方式原子化寫回（`jsonl/storage.ts#publishFileAtomically`）；如果檔案結尾少了換行符，直接補上。中間任何一行壞掉就不是 tail 了，直接報錯拒絕載入。

fork 語義也做在 mutation 層：`state.ts#createForkMutations` 支援「整棵樹複製」或「只複製 main lane 上到某個 entry 為止」，新 session 的 header 記錄 `parentSessionId`。fork 不是 copy file，而是把來源狀態重新編碼成新 session 的 mutation 序列。

pi 另有一套 SQLite backend（skill 路由表點名的 `packages/session-backends`），裡面的單寫者機制是租約加 fence token：`sqlite-node/src/sqlite/storage/writer-leases.ts#acquireWriterLease` 用一條 UPSERT 讓每次取得租約都把 `fence` 加一，過期租約才能被搶走。fence 單調遞增，舊持有者拿舊 fence 回來寫就會被拒——這是資料庫界用了幾十年的 fencing token 思路。

### omp：fork 之後把原子寫做更龜毛

omp 是 pi 的 fork，session 格式同源，但在儲存層加了幾層防護。最精彩的是 `packages/coding-agent/src/session/session-storage.ts#writeTextAtomic`：temp file 加 rename 之外，還要求一個 `commitGuard`——guard 檢查和 rename 之間**不准插入 await**，因為並發的同步改寫可能在檢查通過之後、rename 之前發佈了更新的內容，讓過期的 staged body 蓋掉新檔。Windows 上 rename 會遇到 EPERM，它還準備了 `.bak` 搬開再換、失敗就 rollback 的整套備援。

另外兩個務實細節：持久化層主動截斷超過 50 萬字的內容並外化圖片到 blob store（`session-persistence.ts#MAX_PERSIST_CHARS`）；`SessionStorage` 介面明確定義 `drain()`，讓 graceful shutdown 可以等非同步 backend（Redis/SQL）把排隊中的寫入清完（`session-storage.ts#SessionStorage.drain`）。

### opencode：從 JSON 檔搬進 SQLite

opencode 走過一條遷移路：早期是每則訊息一個 JSON 檔的目錄樹（`packages/opencode/src/storage/storage.ts`），靠一組版本化的 `MIGRATIONS` 陣列搬資料；新的核心已經改成 SQLite，schema 在 `packages/core/src/session/sql.ts`——`SessionTable`、`MessageTable`、`PartTable` 三張表，配上 `(session_id, time_created, id)` 這種複合索引。它的啟示是：**儲存格式一定會換**，把遷移寫成有序、可偵測（`parseMigration` 讀版本號）、冪等的步驟，比選對第一次的格式更重要。

### codex：rollout 是「錄製」，寫入失敗自己救

codex 把 session 持久化叫 rollout，定位是可回放的錄製檔。格式同樣是 JSONL，第一行是 `SessionMetaLine`（meta 加 git 資訊，deserializer 特別寫成向後相容舊格式，`codex-rs/protocol/src/protocol.rs#SessionMetaLine`），之後是 `RolloutItem` 判別聯集：`ResponseItem`、`Compacted`、`TurnContext`、`EventMsg` 等（`codex-rs/history/src/lib.rs#RolloutItem`）。

工程上最特別的是寫入端的自我修復：所有 items 先進 `pending_items` 佇列，由單一 writer task 序列化寫出；**寫成功才從佇列移除**。I/O 失敗時丟掉 file handle 但保留未寫的字尾，下次 barrier 重開檔重試（`codex-rs/rollout/src/recorder.rs#RolloutWriterState.write_pending_with_recovery`）。也就是說磁碟暫時滿了、檔案被鎖住，rollout 不會丟事件，只會晚寫。

單寫者用 per-thread lock file：`codex-rs/thread-store/src/local/writer_lock.rs#WriterLockCoordinator` 在 `thread-writer-locks/` 下建 `<thread_id>.lock`，取得前先掃掉 stale lock。fork/revert 語義是「thread id 不變、開新的 immutable rollout 檔」，檔名可以帶 `forked_from_id`（`recorder.rs#RolloutRecorderParams.Create`）。讀取端還有一個從檔尾往前掃的 `ReverseJsonlScanner`（`rollout/src/reverse_jsonl_scanner.rs`），找最近的事件不用讀整個檔。

### claude-code：append-only transcript 加 uuid 鏈

claude-code 的主 transcript 是每個專案目錄下一個 `<sessionId>.jsonl`，append-only，每則 entry 帶 `uuid` 和 `parentUuid` 形成鏈（`src/utils/sessionStorage.ts`）。session 檔是 lazy 的：第一則 user/assistant 訊息才 materialize（`sessionStorage.ts#materializeSessionFile`），沒實際對話就不留垃圾檔。

刪除很有意思：收到 tombstone 時不做全檔掃描，而是在最後 64KB 做 byte-level 搜尋 `"uuid":"..."`，找到就 ftruncate 再補回後面的行；太老的 entry 才退回全檔改寫，且有大小上限保護（`sessionStorage.ts#removeMessageByUuid` 一帶的 fast/slow path）。resume 時 `conversationRecovery.ts#loadConversationForResume` 會透過 UDS 列出還活著的背景 session 並跳過——避免 `--continue` 接上一個正在寫自己 transcript 的活人。

prompt history 是另一個檔（config 目錄下的 `history.jsonl`），寫入前用 lockfile 加鎖、失敗重試、cleanup hook 收尾（`src/history.ts#immediateFlushHistory`）。`src/migrations/` 目錄則展示了另一種遷移：不搬 session 資料本身，而是把設定和模型偏好逐版升級（例如 `migrations/migrateSonnet45ToSonnet46.ts`），舊的 inline history 欄位清掉指向新檔（`utils/config.ts#removeProjectHistory`）。

## looplane 的選擇與差異

looplane 的 session 目錄裡有三樣東西：`request.json`（任務契約）、`events.jsonl`（append-only 事件流）、`session.json`（manifest：完整可續跑狀態，含 messages、usage、step、授權歷史、事件序號）。

**寫入順序是核心決策**。每個事件的流程是：先把完整可續跑狀態和「意圖中的序號」原子寫進 manifest，再 append JSONL（`src/looplane/loop.py#_event`）。這個順序決定了唯一的 crash window：死在中間，manifest 會比事件流多一格。resume 時 `_validate_events` 重放整條事件流驗證序號連續，發現 manifest 恰好多一格就把它修回來（`src/looplane/session.py#claim_and_validate_resume` 的 manifest-ahead 修復）。一格以內可修、超過一格就是資料壞了直接 fail closed——修復路徑只有一種，且可證明。

單寫者用 OS 層的 `flock`：`session.py#SessionStore.acquire_writer` 以 `O_NOFOLLOW` 打開 `.writer.lock`、`LOCK_EX | LOCK_NB` 取得排他鎖，並把隨機 token 寫進鎖檔。之後每次 save 都先確認磁碟上的 manifest 還記著自己的 token 才准寫（`session.py#save`）——就算 lock 因為任何原因失效，stale writer 也過不了 token 檢查。flock 保護的是「兩個活著的 process 互踩」；它**不**保護 crash 中途的 torn write 或斷電，那部分靠 atomic write（temp file + `os.replace` + 檔案與目錄都 fsync，`src/looplane/events.py#_atomic_write`）和 resume 時的全量驗證兜底。

fail closed 的邊界畫在副作用上：如果最後一筆 durable 事件是 `tool.started` 或 `verification.started`，自動 resume 直接拒絕——你無法證明那個動作做完還是沒做完（`session.py#claim_and_validate_resume` 尾段的檢查）。pending approval 在 resume 時一律視為「未執行的動作」放棄，讓模型可以重新請求，而不是假設授權仍然有效。resume 還會驗 workspace 的 git HEAD 等於 manifest 記的 base SHA、拒絕 symlink、拒絕 terminal 狀態——寧可不動手，不要猜。

跟五家比起來：pi/codex/claude-code 都是純事件流、resume 靠 replay 重建狀態；looplane 多養一份 manifest 換到 O(1) hydration，代價是要維護 manifest 與 log 的一致性——而寫入順序加上一格修復就是把這個代價壓到只剩一個可推理的 case。fence/token 這點倒是殊途同歸：pi 的 SQLite fence counter、codex 的 lock file、looplane 的 flock 加 token，解的是同一個問題。

## 工程依據

- **原子替換**：temp file 寫完再 `rename` 是 POSIX 保證原子性的置換方式（[rename(2)](https://man7.org/linux/man-pages/man2/rename.2.html)，同一檔案系統內）。pi、omp、looplane 的 atomic write 都是這個模式。
- **fsync 不能省**：rename 原子性不含 durability，斷電後順序可能不如預期。[LWN 對 ext4 資料遺失事件的整理](https://lwn.net/Articles/457667/)講得很清楚：要讓資料在斷電後存在，必須明確 fsync 檔案（必要時連目錄）。looplane 的 `_atomic_write` 連目錄 fsync 都做了。
- **WAL 的啟示**：SQLite 用 append-only 的 write-ahead log 加 checkpoint 達到崩潰安全，正是「事件流為真相、snapshot 為加速」的工業級版本（[SQLite Atomic Commit](https://www.sqlite.org/atomiccommit.html)、[WAL 文件](https://www.sqlite.org/wal.html)）。looplane 的 manifest/checkpoint 加 JSONL 就是同一招的小型重演。
- **Fencing token**：單調遞增的租約編號防止失效的舊寫者回頭亂寫，出自分散式系統租約的標準做法（Kleppmann 在 [How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) 有完整論證）。pi 的 fence column 是教科書實作。
- 學術側，agent 的可恢復性少有專門論文，但 [ReAct](https://arxiv.org/abs/2210.03629) 式的 loop 每一步都有外部副作用，正是「exactly-once 無法免費拿到、只能 fail closed」的根本原因。

## 改善路線

looplane 目前缺的，照重要性排：

1. **Torn tail 修復**。現在 `events.jsonl` 最後一行若因 crash 寫到一半，resume 會解析失敗然後 fail closed——安全但不方便。pi 的做法（判定最後一行語法錯誤即為 torn tail，原子化截斷）可以直接抄，前提是 append 都是單行小 payload。
2. **寫入重試**。codex 的 pending queue 加 reopen-and-retry 讓暫時性 I/O 錯誤不丟事件；looplane 目前寫入失敗會直接讓 run 失敗。把 EventWriter 包一層 retry buffer 是低成本高回報的升級。
3. **Manifest 心跳與 stale 偵測**。looplane 已經記 `writer_heartbeat_at` 但沒有消費它；codex 的 stale lock 清掃和 pi 的租約過期都是現成的設計參考。加上去之後，殺掉殘留 writer 不需要人為判斷。
4. **Reverse scan**。事件流變長之後，resume 全量 replay 會變慢；codex 的 `ReverseJsonlScanner` 提示了一條路：配合定期 checkpoint，只需從尾部掃到最後一個 checkpoint。

## 參考資料

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — 本地 clone 對應 `pi-mono/packages/agent/src/harness/session/` 與 `packages/session-backends/`
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — `packages/coding-agent/src/session/session-storage.ts`
- [sst/opencode](https://github.com/sst/opencode) — `packages/opencode/src/storage/`、`packages/core/src/session/sql.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/rollout/`、`codex-rs/thread-store/`
- [SQLite: Atomic Commit](https://www.sqlite.org/atomiccommit.html)／[Write-Ahead Logging](https://www.sqlite.org/wal.html)
- [rename(2) — Linux man page](https://man7.org/linux/man-pages/man2/rename.2.html)
- [LWN: Ensuring data reaches disk](https://lwn.net/Articles/457667/)
- [Martin Kleppmann: How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
