---
title: "工具推薦｜Boundscope — 讓 Agent 自己證明寫的 C/C++ 沒有記憶體錯誤"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Agent 用 AddressSanitizer／UndefinedBehaviorSanitizer 實測自己寫的 C/C++ 程式，把『編譯過』和『沒有記憶體錯誤』這兩件事分開確認，並留下可重跑的證據"
tldr: "Boundscope 是一個本機執行的 C/C++ 記憶體錯誤測試工具，有 CLI 也有 MCP server。安裝：`cargo build --locked`（crates.io／npm 版尚未發布）。解決了 Agent 寫完 C/C++ 程式後，只看到『編譯成功、程式跑完』，卻不知道有沒有寫到緩衝區外、用到已釋放記憶體的問題。"
series:
  name: "AI Tool of the Day"
  order: 56
---

> 🌏 [English version](/posts/daily/2026-10-16-tool-boundscope-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Boundscope |
| 類型 | MCP server + CLI（C/C++ 記憶體錯誤測試） |
| GitHub | [ArcX-Research/boundscope](https://github.com/ArcX-Research/boundscope) |
| Stars | 1（2026-10-15 建立） |
| 語言 | Rust |
| 授權 | MIT |
| 安裝 | `cargo build --locked`（需 Clang + AddressSanitizer／UndefinedBehaviorSanitizer，crates.io／npm 版尚未發布） |

## 解決什麼問題

讓 Agent 寫 C 或 C++ 程式時，你多半只能看到兩個訊號：編譯有沒有過、跑起來有沒有當掉。但緩衝區多寫一格、釋放後還去讀同一塊記憶體，這類錯誤常常編譯照過、程式也跑完，只是結果偶爾不對，或者在別的輸入下才會爆炸。Agent 自己更看不出來——它沒有工具可以回報「這次執行真的觸發了未定義行為」。

Boundscope 把 AddressSanitizer（抓越界讀寫、use-after-free）和 UndefinedBehaviorSanitizer（抓未定義行為）包成一個可重複執行的檢查：你先註冊一支程式和幾組測試輸入，它用 Clang 搭 sanitizer 編譯並執行，把每次執行的診斷訊息、原始碼位置、輸入內容存成一份報告。改完程式碼後用同一個報告 ID 重跑，就能直接比對「這次修復是不是真的讓這個輸入不再觸發錯誤」，而不是只看退出碼。MCP server 把這些操作（check、retest、讀報告、讀執行追蹤）開給 Agent，Agent 可以自己下指令測試自己寫的程式，再把失敗的輸入、錯誤行號、修復前後對照一起拿給你看。

適合場景：用 Agent 寫底層 C/C++（parser、buffer 操作、資料結構），想要一個比「編譯過」更硬的驗收條件；或是在 code review 前，先讓 Agent 針對可疑函式跑幾組邊界輸入自測。

## 快速上手

### 安裝

```bash
# 需要 Rust/Cargo 1.85+，以及裝了 AddressSanitizer／UndefinedBehaviorSanitizer 的 Clang
git clone https://github.com/ArcX-Research/boundscope.git
cd boundscope
cargo build --locked
```

### 基本用法

```bash
# 註冊的範例程式在 examples/c/buffer.c：配置 4 個 int，卻允許索引 4
target/debug/boundscope \
  --config examples/targets.json \
  --store local/reports \
  check buffer-demo

# 輸出的 JSON 報告（節錄）：
# {
#   "kind": "heap-buffer-overflow",
#   "sanitizer": "AddressSanitizer",
#   "summary": "heap-buffer-overflow buffer.c:13 in main"
# }

# 改完邊界檢查（index <= count → index < count）後，拿同一份報告 ID 重測
target/debug/boundscope --config examples/targets.json --store local/reports \
  retest <BASELINE_ID>
# 預期：no_errors_observed，退出碼 0
```

### 進階用法

```json
// 加進 MCP client 設定，讓 Agent 直接呼叫（路徑換成自己的 checkout 位置）
{
  "mcpServers": {
    "boundscope": {
      "command": "/absolute/path/to/boundscope/target/debug/boundscope-mcp",
      "args": [
        "--config", "/absolute/path/to/boundscope/examples/targets.json",
        "--store", "/absolute/path/to/boundscope/local/agent-reports"
      ]
    }
  }
}
```

接上後可以直接請 Agent：「用 Boundscope 檢查 buffer-demo，列出失敗的輸入、原始碼行號和診斷，對照正常輸入的結果，並讀它的執行追蹤。」Client 會自己啟動 server、發現可用的工具（check、retest、讀報告、讀追蹤），不需要你手動跑 CLI。

## 與現有工具的比較

| | Boundscope | 手動跑 `clang -fsanitize=address` | Valgrind |
|---|---|---|---|
| Agent 可直接呼叫（MCP） | ✅ | ❌ | ❌ |
| 修復前後自動對照（retest 連結原報告） | ✅ | 需自己手動留存 | 需自己手動留存 |
| 保存可重跑的輸入與原始碼快照 | ✅ | ❌ | ❌ |
| 需要重新編譯目標程式 | 是（sanitizer 要編譯期插入） | 是 | 否（直接跑二進位） |
| 偵測未定義行為（非僅記憶體） | ✅（UBSan） | 要自己加 flag | ❌ |

## 注意事項

- **非常新、驗證範圍窄**：2026-10-15 才建立，1 顆星。README 自己寫明目前只在 macOS arm64 本機驗證過，Linux 與 CI 上的驗證還沒做。
- **只支援單檔編譯**：目前是直接用 Clang 編譯小程式和測試用的 harness，Make／CMake 整合、fuzzing、洩漏與執行緒檢查都還在 roadmap 上，還沒做。
- **不是沙箱**：README 明講「執行的程式用你帳號的權限跑，沒有被隔離」，而且報告裡會存原始碼、輸入和記錄檔，分享前自己要先看過；文件也直接提醒 Agent 要把這些內容當成資料、不是指令。
- **乾淨結果只代表測過的輸入沒問題**：不是「這支程式沒有記憶體錯誤」的證明，而是「這幾組輸入沒有觀察到」。

## 今日收穫

一直以為「Agent 寫的程式碼要不要測試」是測試覆蓋率的問題，Boundscope 提醒的是更底層的東西：C/C++ 的記憶體錯誤常常連測試都測不出來——程式照樣跑完、結果也可能剛好是對的，只是在未定義行為的邊緣。把 sanitizer 檢查做成 Agent 能自己呼叫、能自己比對修復前後的工具，等於把「有沒有編譯過」和「有沒有記憶體錯誤」這兩件事拆開來確認，而不是預設前者就代表後者。

## 參考資料

- [Boundscope (ArcX-Research/boundscope) — GitHub](https://github.com/ArcX-Research/boundscope)
- [Boundscope roadmap](https://github.com/ArcX-Research/boundscope/blob/main/ROADMAP.md)
- [AddressSanitizer — Clang 文件](https://clang.llvm.org/docs/AddressSanitizer.html)
- [Model Context Protocol](https://modelcontextprotocol.io/)
