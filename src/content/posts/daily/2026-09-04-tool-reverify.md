---
title: "工具推薦｜reverify — 讓確定性位元組工具當裁判，抓 AI 逆向工程時的瞎掰"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "reverify 用確定性的反組譯／模擬／pattern scan 驗證 AI 對二進位檔案的每個主張，19 支 Windows 系統檔案的 benchmark 顯示 model 猜的進入點 prologue 100% 錯，而它抓到每一個且零誤報"
tldr: "reverify 是一個開源 MCP server + CLI，讓純 Python 寫成的確定性逆向工具（反組譯、CPU 模擬、pattern scan）當裁判，驗證 AI 對二進位檔案提出的每個主張。安裝：`pip install reverify`。解決了 agent 逆向工程時把猜測講得像事實、你沒辦法分辨真假的問題。"
series:
  name: "AI Tool of the Day"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-04-tool-reverify-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | reverify |
| 類型 | MCP server + CLI（二進位逆向工程驗證器） |
| GitHub | [2akouwu/reverify](https://github.com/2akouwu/reverify) |
| Stars | 728 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `pip install reverify` |

## 解決什麼問題

你有沒有讓 AI 讀一支陌生的 `.exe` 或 `.dll`，請它重建一個 struct、或說明某段程式碼在幹嘛？它會講得很篤定——這個 offset 是什麼、進入點的組合語言長怎樣——但那些細節有多少是真的從位元組讀出來的，有多少是從訓練資料背出來的「教科書答案」，你分辨不出來。逆向工程比讀原始碼更容易讓 AI 瞎掰，因為沒有編譯器幫你把謊言擋在錯誤訊息裡：程式碼讀錯了通常跑不動，但逆向猜錯了照樣講得頭頭是道。

reverify 把 AI 和一套純 Python 寫成的確定性逆向工具包接在一起，讓工具包當裁判。model 提出一個「主張」（claim）——某個 offset 有哪些指令、某段程式碼跑完暫存器會是什麼值——這個主張必須先被反組譯器、pattern scanner 或 CPU 模擬器實際驗證過，回傳 `VERIFIED`／`REFUTED`／`INCONCLUSIVE` 加上證據位元組，才算數。核心是純 Python，裝起來不需要 Ghidra；跑 `pip install "reverify[full]"` 才會就地升級到 capstone（反組譯）、unicorn（真的 CPU 模擬）和 lief（PE/ELF/Mach-O 解析）這些成熟引擎，沒裝就退回純 Python 核心繼續動。

適合場景：malware 分析、CTF 的 reverse/pwn 題、跟一支沒有原始碼的檔案做 interoperability research，任何你想讓 agent 幫忙讀二進位、但不敢直接信它嘴巴講的內容的場合。

## 快速上手

### 安裝

```bash
# 純 Python 核心
pip install reverify

# 含 capstone + unicorn + lief 的完整版
pip install "reverify[full]"

# 也可以直接從原始碼跑，純標準庫，不用裝任何東西
git clone https://github.com/2akouwu/reverify
python reverify/cli.py auto sample.bin --json
```

### 基本用法

```bash
# 自動判斷格式、架構、區段、抽字串
reverify auto sample.bin --json

# 驗證一個關於某個 offset 的主張
reverify verify sample.bin --claim '{
  "kind": "instructions",
  "offset": 4096,
  "mnemonics": ["push", "mov", "sub"],
  "note": "function prologue"
}'
```

回傳的不是「對」或「錯」一個字，而是 `VERIFIED`／`REFUTED`／`INCONCLUSIVE` 加上工具實際觀察到的位元組；`REFUTED` 的時候還會告訴你期望的位元組其實出現在哪裡。主張可以用 `--claims-file claims.json` 批次丟進去，只要有一個被 refute，CLI 就會以非零狀態碼結束——agent 或 CI job 都能拿這個當閘門。

### 進階用法

```bash
# 當 MCP server 跑，讓 Claude Code / Cursor 直接呼叫
python reverify/mcp_server.py
```

MCP 模式下多兩個工具：`re_verify_claim` 把驗證迴圈開放給 agent 呼叫，每個「有憑有據」的結果都會記進這支二進位專屬的 ledger（`.reverify/ledger/<hash>.json`）；`re_ledger` 則是在 host 自己做 context 壓縮或 `/clear` 之後，把「已驗證、已觀察、已證明、已推翻」的狀態原封不動撈回來——因為只有這些是曾經被工具驗證過的東西，其他 model 自己講的話從一開始就沒被信過，丟掉也不會少什麼。

## 與現有工具的比較

| | reverify | 直接問 AI（沒有驗證層） | Ghidra/IDA 手動分析 | 一般「AI 反組譯」wrapper |
|---|---|---|---|---|
| 主張經過確定性位元組驗證 | ✅ | ❌ | ✅（靠人工核對） | ❌ |
| 免裝 Ghidra 也能跑基本功能 | ✅（純 Python 核心） | — | ❌ | 視實作而定 |
| 有 MCP server，agent 原生可呼叫 | ✅ | — | ❌ | 部分 |
| context 被壓縮/清空後狀態不丟 | ✅（ledger 落地磁碟） | ❌ | ✅（人腦記得） | ❌ |
| 需要人工逐步操作 | ❌（可在 reconstruct 迴圈裡自動跑多輪） | — | ✅ | ❌ |

## 注意事項

- **授權前提**：README 自己寫明這是給「已授權」的逆向工程用——malware 分析、CTF、interoperability research，或你自己擁有／被允許分析的軟體，不是拿來破解別人東西的工具。
- **benchmark 數字不要過度推廣**：作者公布的「19 支 Windows 系統檔案、prologue 猜測 100% 錯、reverify 零誤報全部抓到」，量測的是「進入點 prologue」這一個特定、常見的 model 先驗，不是所有逆向推論場景的通用錯誤率，作者在 BENCHMARK.md 裡也講得很清楚。
- **完整功能要另外裝依賴**：純 Python 核心的反組譯／模擬能力比較陽春，capstone/unicorn/lief 沒裝的話覆蓋的架構和格式會少一截。
- **專案很新**：v0.8.0，2026-08-31 才創立，雖然 3 天內衝到 700+ stars、148 forks，但還在快速迭代，介面和 claim schema 之後可能會變。

## 今日收穫

一般的「AI agent 工具驗證」多半停在「這個 tool 能不能被呼叫」的准駁層，reverify 往前一步，驗的是「這個 tool 呼叫完之後，model 對結果講的話是不是真的」——把裁判權從 model 自己的信心值，徹底交給位元組本身。這個模式其實不限於逆向工程：任何 agent 產出可以被一個確定性檢查器覆核的領域（型別檢查、schema 驗證、單元測試），都可以套同一個「model 提案、工具裁決」的迴圈，而不是相信 model 自己說「我確定」。

## 參考資料

- [reverify GitHub repo](https://github.com/2akouwu/reverify)：專案介紹、README、安裝指令、MCP server 設計、授權（MIT）、stars/forks 數均出自官方 repo。
- [reverify BENCHMARK.md](https://github.com/2akouwu/reverify/blob/main/BENCHMARK.md)：19 支 Windows 系統 DLL 的 prologue 猜測 benchmark 原始數據與方法論。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
