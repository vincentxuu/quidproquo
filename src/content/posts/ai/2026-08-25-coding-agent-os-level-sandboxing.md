---
title: "跟成熟 coding agent 學設計（29）：OS 級沙箱"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 29
tags: [coding-agent, harness-engineering, sandbox, landlock, seatbelt, bubblewrap]
lang: zh-TW
description: "拆解成熟 coding agent 的 OS 沙箱邊界，並核對 Rivumi macOS sandbox-exec、Linux Landlock/seccomp 與 fail-closed verification baseline。"
tldr: "OS 沙箱是 path policy 之外的核心防線。rivumi 已落地 fail-closed `CommandSandbox`：macOS 包 sandbox-exec，Linux 用 Landlock 加 seccomp，verification 預設在能證明 containment 時進沙箱；不支援時回 exit 126。剩餘限制是目前主要只包 verification、外部 CI 結果仍待確認。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-os-level-sandboxing-en)

## 能力問題

上一篇〈[Workspace 隔離與 path policy](/posts/ai/2026-08-25-coding-agent-workspace-isolation)〉結尾留了一句話：disposable workspace 解決的是「不要弄髒你的 repo」，OS 沙箱解決的才是「不要弄壞你的機器」。這篇正面處理這個已承認的差距。

問題具體是這樣：rivumi 在 workspace 裡跑 verification 指令時，那個 process 擁有使用者的完整權限——讀得到 `~/.ssh`、連得到外網、寫得掉 shell 設定檔。`SafePathPolicy` 只管模型給的路徑參數，管不住指令自己 spawn 出來的子行程。任何純應用層檢查都有一個共同的結構性弱點：它們全是字串處理，parser 有 bug 就是逃脫口。核心級的隔離沒有這個問題，因為 syscall 層不看字串，看的是實際開啟的檔案描述子。

所以這篇問的是：如果 rivumi 要在純 Python、不引入 daemon 架構的前提下補上 OS 級防線，該抄誰的作業？

## 五家怎麼做

### Codex：一個抽象層，三套平台機制

第一部已經詳查過 Seatbelt policy 與 Landlock fail-closed，這裡只補架構面。Codex 把「選哪種沙箱」集中在一個分派點：`codex/codex-rs/sandboxing/src/manager.rs#get_platform_sandbox` 回傳 `MacosSeatbelt`、`LinuxSeccomp` 或 `WindowsRestrictedToken` 三選一，上層程式碼完全不碰平台細節。Windows 不是二等公民：`codex/codex-rs/windows-sandbox-rs/src/lib.rs#run_windows_sandbox_capture` 用 restricted token 加 ACL 做出一套完整的拒絕預設沙箱。

兩個值得單獨記下來的細節：

- **執行前的 process 硬化**：`codex/codex-rs/process-hardening/src/lib.rs#pre_main_hardening` 在 main 之前就 `PR_SET_DUMPABLE 0`（擋同 UID 行程 ptrace）、core dump 歸零、清掉所有 `LD_*` 環境變數。這些不是沙箱本身，而是讓沙箱外的攻擊面縮小。
- **bubblewrap 的依賴偵測**：Linux 上除了 Landlock 還有 bubblewrap 路線，`codex/codex-rs/sandboxing/src/bwrap.rs#system_bwrap_warning` 會主動探測系統 bwrap 有没有 user namespace 權限，没有就警告並退回內建版本——依賴存在不等於依賴可用。

### Claude Code：要不要沙箱是一道獨立決策

Claude Code 的有趣之處是把「這條指令該不該進沙箱」抽成自己的函式：`claude-code-source/src/tools/BashTool/shouldUseSandbox.ts#shouldUseSandbox` 先看全域開關，再看使用者有沒有顯式要求跳過（且政策允許跳過），最後比對排除清單——三關全過才回 true。底層適配在 `claude-code-source/src/utils/sandbox/sandbox-adapter.ts#convertToSandboxRuntimeConfig`，macOS 用 Seatbelt、Linux 用 bubblewrap（設定錯誤時提示 `apt install bubblewrap socat`），平台不支援就明確回報不可用而不是默默放行。

### OpenCode 與 OMP：誠實的對照組

這兩家正好用來說明「容易混淆的近似物」。OpenCode 的 `opencode/packages/containers/base/Dockerfile` 是一排 CI 用 Dockerfile——給 GitHub Actions 預裝 build tools 用的，README 自己說是 speed up jobs，不是執行期安全邊界。OMP 的 `oh-my-pi/crates/pi-iso/src/lib.rs#default_backend` 更接近但同樣不是：它在 APFS clonefile、btrfs snapshot、ZFS clone、NTFS block clone 之間探測最快的 copy-on-write 快照機制——解決的是「快速造出可拋棄的資料副本」，process 該有的權限一點不少。快照是效率工程，沙箱是安全邊界，兩者常被混為一談。

## 學術／工程依據

Codex 的 macOS policy 第一行 `(deny default)` 直接註明致敬 [Chrome renderer sandbox](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac_sandboxing.md)——瀏覽器花了十幾年證明「解析不受信內容的行程必須預設全拒、逐項開放」。Linux 側的 [Landlock](https://docs.kernel.org/userspace-api/landlock.html) 是 5.13 起內建的非特權存取控制：不需要 root、不需要額外 daemon、由 process 自己疊加規則，這正是無 daemon 架構等了多年的拼圖。[seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html) 補上網路與 syscall 面。SWE-agent 的 ACI 框架則提醒我們：這些機制的「介面設計」——什麼時候啟用、失效時怎麼表現——和機制本身一樣重要（[Yang et al., 2024](https://arxiv.org/abs/2405.15793)）。五家的共識可以濃縮成一句話：**沙箱必須 fail-closed**。Codex 在 `restrict_self()` 後檢查 `RulesetStatus::NotEnforced` 就直接報錯拒絕執行；Claude Code 平台不支援就回報不可用。没有一家把「沙箱起不來」翻譯成「那就裸奔吧」。

## 原始設計草案（2026-08-25）

目標：一個 `LocalSandbox` 包裝層，包住現有的 `run_bounded_command`，純標準庫，不引入 daemon。

**macOS：sandbox-exec，絕對路徑。** 學 Codex 寫死 `/usr/bin/sandbox-exec`，避免 PATH 劫持。由 writable roots（workspace 目錄＋tempdir＋Python site-packages）動態生成 `.sbpl`：`(deny default)` 基底、workspace 讀寫、其餘唯讀或拒絕。Apple 官方雖未正式背書 sandbox-exec，但它至今仍在出貨且是 Codex 與 Claude Code 共同的 macOS 選擇——跟著兩家走風險最低。

**Linux：ctypes 直掛 Landlock，優先於 bubblewrap。** Landlock 的 API 是四個 syscall（`landlock_create_ruleset`、`add_rule`、`restrict_self` 等），ctypes 可以直接呼叫，零新依賴——這對 rivumi 的啟動效能紀律很重要。bubblewrap 當 fallback：外部 binary 探測可用性（user namespace probe，學 `bwrap.rs`），找不到就不假裝有。網路隔離第一版先不做 seccomp BPF（Python 手寫太脆），改用 `unshare(CLONE_NEWNET)` 或明確列為已知限制。

**fail-closed 是驗收條件，不是附註。** Landlock `restrict_self()` 後檢查 enforced status；kernel 太舊、sandbox-exec 不存在、bwrap 没有 namespace 權限——一律回到今天的行為：拒絕執行 verification，除非顯式 `--unsafe-local-exec`。換句話說，「没有沙箱」從隱含的意外變成明確的、需要使用者簽名的例外。

**process 硬化先落地。** 這部分其實已有雛形：`src/rivumi/sandbox_entry.py#_harden_linux_process` 已經在做 `PR_SET_DUMPABLE 0`。把它泛化到本地執行路徑、加上 core dump rlimit 歸零與環境變數清理，成本一小時，收益是即使沙箱缺席也少一半攻擊面。

## 與現有架構的銜接

四點，按相依順序：

1. **SafePathPolicy 降級為第二道牆，不刪除。** 它仍然攔 prompt injection 導出的路徑幻覺，而且它的錯誤訊息比 EPERM 友善得多。OS 沙箱接住漏網的，policy 接住常見的。
2. **Cloudflare Sandbox 路線（M6）不變，本地是其鏡像。** M6 文件明講「checks 與 agent 同容器且有外網時，不做 hostile code 收容宣稱」，本地沙箱草案採用同一份誠實聲明模板：能宣稱什麼、不能宣稱什麼，寫進文件而非藏在 flag 名稱裡。
3. **approval 分級吃沙箱狀態。** 未來 approval 分級應該把「本次執行有無沙箱」納入風險計算——同一條指令，sandboxed 可 auto-approve，unsandboxed 必須 ask。
4. **保留 pinned SHA、no-hardlinks、HEAD 重驗證。** 這些是資料完整性措施，與 process 隔離正交，沙箱進場後依然是對的。

一句話收尾：第一部說「後者是下一戰」，這篇就是把戰場畫好——機制選型、fail-closed 契約、與既有三層（policy、workspace、cloud sandbox）的位置關係。剩下的就是照著寫。

## rivumi 現在的實作

截至 `2ed5efb`，這份草案已有 baseline。`runtime.py#CommandSandbox` 會依平台產生 wrapper：macOS 使用 `sandbox-exec` profile；Linux 由 `landlock_run.py` 套用 filesystem rules，並串接 seccomp backend。named profile 與 read roots 可由 CLI config 傳入 verification runner；無法證明沙箱可用時 fail-closed，以 exit 126 拒絕啟動 repo code。

Linux Landlock/seccomp 有本機 smoke 與 CI workflow，macOS 包裝也有單元測試。不過目前 containment 主要涵蓋 native verification commands，還不是任意 agent process 的全面沙箱；外部 CI run 結果與更廣平台矩陣也仍待確認。因此能宣稱的是「沙箱設定鏈與拒絕預設已落地」，不是「所有執行都已 production 隔離」。

## 參考資料

- [Rivumi CommandSandbox（固定 commit）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/runtime.py)
- [Rivumi Linux Landlock runner（固定 commit）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/landlock_run.py)

- [Landlock: unprivileged access control (kernel docs)](https://docs.kernel.org/userspace-api/landlock.html) — rivumi OS sandbox 草案的 Linux 核心機制依據。
- [landlock_create_ruleset(2) — Linux man page](https://man7.org/linux/man-pages/man2/landlock_create_ruleset.2.html)
- [seccomp(2) — Linux man page](https://man7.org/linux/man-pages/man2/seccomp.2.html)
- [Chromium macOS sandboxing design](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac_sandboxing.md)
- [bubblewrap — unprivileged sandboxing tool](https://github.com/containers/bubblewrap)
- [openai/codex — codex-rs/sandboxing](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/agents/api-reference/sandbox/)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv)](https://arxiv.org/abs/2405.15793)
