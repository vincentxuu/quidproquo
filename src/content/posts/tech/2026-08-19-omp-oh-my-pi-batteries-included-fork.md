---
title: "omp（Oh My Pi）：把 Pi 的極簡主義翻過來的 batteries-included 分支"
date: 2026-08-19
category: tech
type: deep-dive
tags: [omp, pi, coding-agent, cli, rust, open-source, ai-tools]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 16
tldr: "omp 是 Pi 的 fork，但不只是插件層堆疊：它多了約 80,000 行 Rust，把 grep／shell／AST／PTY 全部搬進 in-process。內建工具從 Pi 的 7 個變成 31 個，外加 14 個 LSP op、28 個 DAP op、60+ 供應商。同一份 codebase，兩個相反的賭注。"
description: "omp（Oh My Pi）與上游 Pi 的實質差異：工具數量、Rust 原生層、hashline 編輯格式的 benchmark 數據、advisor／TTSR／URI scheme 等特有機制，以及兩者的取捨與適用情境。"
draft: false
---

🌏 [English version](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en)

[Pi 是刻意做小的 coding harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)——只給模型 4 個工具，MCP、sub-agents、plan mode、權限彈窗全部明說不做。omp（Oh My Pi）是它的 fork，走的是完全相反的路：31 個內建工具、14 個 LSP 操作、28 個 DAP 操作、60+ 模型供應商，加上約 80,000 行 Rust。

這篇要講的不是「哪個比較好」，而是同一份 codebase 分岔之後，兩邊各自付了什麼代價。

## 先把數字擺出來

截至 2026-08-19，兩個 repo 的實測狀態：

| | Pi | omp |
|---|---|---|
| repo | `earendil-works/pi`（原 `badlogic/pi-mono`，會 301） | `can1357/oh-my-pi` |
| 作者 | Mario Zechner | Can Bölük |
| star / fork | 93,258 / 11,549 | 25,706 / 2,477 |
| 建立日期 | 2025-08-09 | 2025-12-31 |
| commits | — | 18,392（約 8 個月） |
| 語言組成 | TypeScript 8.5 MB、C 10 KB | TypeScript 50.1 MB、**Rust 5.2 MB**、Python 3.0 MB |
| 內建工具 | 7 個 | 31 個 |
| 授權 | MIT | MIT（版權雙掛 Mario Zechner 2025／Can Bölük 2025-2026） |

omp 的 README 自述得很清楚：

> omp is a fork of [pi-mono](https://github.com/badlogic/pi-mono) by Mario Zechner, extended with a batteries-included coding workflow.

值得注意的是 GitHub API 上 `oh-my-pi` 的 `fork` 欄位是 `false`——它是獨立 repo，不是 GitHub 意義上的分支關係。

## Pi 那些「沒有」，是立場不是落差

看比較表時很容易把 Pi 的空欄讀成「還沒做」。實際上 Pi 的 README 有一整段 Philosophy 逐條寫明拒絕理由，每條都附替代方案：

> **No MCP.** Build CLI tools with READMEs, or build an extension that adds MCP support.
> **No sub-agents.** There's many ways to do this. Spawn pi instances via tmux.
> **No permission popups.** Run in a container, or build your own confirmation flow.
> **No plan mode.** Write plans to files.
> **No built-in to-dos.** They confuse models. Use a TODO.md file.
> **No background bash.** Use tmux. Full observability, direct interaction.

工具清單最能說明這個立場：Pi 內建只有 `read`、`bash`、`edit`、`write`、`grep`、`find`、`ls` 七個，而且**預設只給模型前四個**。權限系統也是同一套邏輯——Pi 官方文件直說它「不包含限制檔案系統、行程、網路或憑證存取的內建權限系統」，要隔離請自己丟進容器或 micro-VM。

Pi 賭的是：核心越小，你越能塑形，而且極短的 system prompt 讓 1.7B 的本地模型也跑得動。

## omp 的分岔點不在插件層

最容易誤解 omp 的地方，是以為它只是「在 Pi 上外掛了一大包功能」。看語言組成就知道不是：Pi 幾乎純 TypeScript，omp 多出六個 Rust crate 加一份 vendored 的 brush bash fork。

| Crate | 做什麼 | ~LoC |
|---|---|---|
| `pi-shell` | 內嵌 bash 引擎、常駐 session、in-process coreutils 派發 | 38,000 |
| `pi-natives` | N-API 介面層（desktop、grep、text、diff、pty…） | 25,000 |
| `pi-walker` | 平行、遵守 ignore 規則的檔案走訪 + 掃描快取 | 5,200 |
| `pi-iso` | 工作區隔離：apfs／btrfs／zfs reflink／overlayfs／projfs | 3,300 |
| `pi-ast` | tree-sitter + ast-grep 比對、結構化摘要 | 2,900 |
| `pi-voice` | 音訊擷取播放、Opus、WebRTC | 1,000 |

README 對這件事的說法是：

> Other agents shell out to rg, grep, find, and bash. On many machines those binaries don't exist, and on the ones where they do, every call costs a fork-exec round-trip. omp links the real implementations into the process.

這是**工具層的重寫**，不是插件層的堆疊。也因此才有兩個推論成立：熱路徑上沒有 fork/exec；同一顆 binary 在 macOS、Linux、Windows 上跑，Windows 不需要 WSL 橋接。

（一個引用時要小心的坑：omp 自己的文件對內建 CLI utility 數量有三個互相打架的數字——README 正文寫 58 個、`bash` 工具說明寫「46 in-process coreutils」、crate 表的 `pi-builtins` 寫「67 in-process command-line utilities」。要引就引 crate 表，或標明不確定。）

## hashline：唯一變數是 harness

omp 最有實證支撐的一項是編輯格式。作者的〈The Harness Problem〉一文做了控制變數的 benchmark——180 個任務、每個模型跑 3 輪、每輪開新 session，只換編輯工具：

> We improved 15 LLMs at coding in one afternoon. Only the harness changed. In fact only the edit tool changed. That's it. **+15pts avg over patch, 16 models.**

hashline 的作法是：模型讀檔時每一行都帶一個 2-3 字元的內容 hash，編輯時引用這些錨點而不是重打整段內容。檔案若在讀取後被改過，hash 對不上，patch 在寫入前就被拒絕。

實測結果裡幾個可引用的點：

- hashline 在 16 個模型中有 **14 個**贏過 `apply_patch` 格式
- Grok Code Fast 1 的 Δ 最大：**+64.6 pts**
- Grok 4 Fast 的輸出 token **少 61%**——省下的是壞 diff 的重試迴圈
- 對照組的失敗率：Grok 4 用 patch 格式的失敗率 **50.7%**、GLM-4.7 **46.2%**

文章對現況的診斷也很直白：Codex 的 `apply_patch` 是 OpenAI 在 gateway 端偏置過 token 選擇的格式，換別的模型就崩；Claude Code 那類 `str_replace` 要求模型逐字重現包含縮排的原文，「String to replace not found in file」常見到有自己的 GitHub megathread；Cursor 甚至為此微調了一顆 70B 模型專門做 merge。

## 幾個上游確實沒有的機制

**Advisor**：第二顆模型跑在自己的 context 上，旁聽主 agent 每一回合，用 inline note 插入提醒——一句提示、一個疑慮，或一個硬性阻擋。主 agent 看到後修正路線，或說明為什麼不改。

**TTSR（Time-Traveling Stream Rules）**：規則平常休眠不佔 context。regex 命中時**在 token 中途中止串流**，把規則當 system reminder 注入，再從同一點重試。注入內容在 compaction 之後仍然保留。

**URI scheme 當檔案系統**：16 個內部 scheme（`pr://`、`issue://`、`agent://`、`skill://`、`ssh://`…）在所有 FS 形狀的工具裡透明解析。`read pr://1428` 回傳的形狀跟 `read src/foo.ts` 一樣，`grep` 可以像走目錄一樣走 diff。合併衝突也走同一套：把 `@theirs`／`@ours`／`@base` 寫進 `conflict://N` 就解掉，批次版 `conflict://*`。

**Subagent 回傳 typed output**：`task` 扇出到隔離的 worktree，最終 yield 的是通過 schema 驗證的物件，父 agent 直接讀欄位。README 對這點的動機說得很酸——Claude Code「到今天還會從 sub-agent 輸出漏出原始 JSONL，浪費幾十萬 token」。

**其他**：`/collab` 把 live session 丟上 relay 換一個連結加 QR code，frame 在 client 端封裝、relay 看不到你的金鑰；`web_search` 串 23 家供應商並對 GitHub、npm／PyPI／crates.io、arXiv、Stack Overflow 做站點感知的結構化抽取；ACP 讓 omp 在 Zed 裡跑成 first-class agent。

## 代價

omp 不是免費的升級。

**複雜度**。31 個工具、10 種模型角色（`default`／`smol`／`slow`／`plan`／`commit`／`vision`／`designer`／`task`／`advisor`／`tiny`）、fallback chain、path-scoped model、round-robin 憑證輪替——這些都要設定，也都是可能出錯的面。Pi 的整個賣點就是不用面對這些。

**沒有 sandbox 的問題原封不動繼承**。omp 有 approval mode（`always-ask`／`write`／`yolo`），但底層仍是拿啟動它的行程權限在跑，而且工具面大得多——`computer` 工具可以直接對真實桌面送原生輸入、讀 AX tree、動剪貼簿。要隔離一樣得靠容器。

**版本移動很快**。8 個月 18,392 個 commit，我本機裝的還是 v16.1.20，npm 上已經是 v17.3.7——跨一個 major。跟 Pi 那種刻意小、變動面也小的東西比，維護成本不同量級。

**Rust 原生層等於平台綁定**。預編譯 binary 只涵蓋 `linux-x64`／`linux-arm64`／`darwin-x64`／`darwin-arm64`／`win32-x64`。Alpine／musl 還得先 `apk add libstdc++ libgcc`，因為預編譯的 musl binary 是動態連結 `libstdc++`／`libgcc` 的。

## 怎麼選

```
                 你想自己決定疊什麼？
                    │
        ┌───────────┴───────────┐
       是                       否
        │                       │
       Pi                      omp
   7 個工具                 31 個工具
   純 TS，易讀              80k 行 Rust
   小模型跑得動             LSP / DAP / advisor
   缺的自己補               開箱即用
   維護面小                 設定面大
```

選 Pi 的情境：你要讀懂整個 harness、想用本地小模型、想把 agent 嵌進自己的流程而不是反過來，或者你根本就想要一份可以整個讀完的 codebase。

選 omp 的情境：你要的是 LSP 級的 rename、真的 debugger、平行 subagent 加 typed output 這些現成能力，而且不打算自己實作；或者你在 Windows 上工作、不想再繞 WSL。

一句話：**Pi 是刻意小的 harness，缺的東西是它明說不做的；omp 是把工具層用 Rust 重寫過的 batteries-included 分支。** 差別不在能不能疊起來，在於你想不想自己決定疊什麼。

## 參考資料

- [can1357/oh-my-pi（omp GitHub repo）](https://github.com/can1357/oh-my-pi)
- [omp.sh 官方網站](https://omp.sh)
- [omp CHANGELOG](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/CHANGELOG.md)
- [@oh-my-pi/pi-coding-agent（npm）](https://www.npmjs.com/package/@oh-my-pi/pi-coding-agent)
- [The Harness Problem（Can Bölük，2026-02-12）](https://blog.can.ac/2026/02/12/the-harness-problem/)
- [earendil-works/pi（上游 Pi repo）](https://github.com/earendil-works/pi)
- [pi.dev 官方網站](https://pi.dev)
- [Agent Client Protocol（ACP）](https://github.com/zed-industries/agent-client-protocol)
- [brush-shell（omp vendored 的 bash 實作）](https://github.com/reubeno/brush)
- 站內：[Pi Coding Agent：極簡主義的開源終端機 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)
- 站內：[Agent CLI 完整指南：設計邏輯、工具比較與使用原則](/posts/ai/2026-04-01-agent-cli-guidelines)
