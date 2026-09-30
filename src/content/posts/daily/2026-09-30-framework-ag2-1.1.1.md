---
title: "框架更新｜AG2 v1.1.1"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: zh-TW
description: "AG2 v1.1.1 版號看起來只是修 bug，內容卻是一個 breaking change（Bedrock 換成原生 async client）加兩個資安修正（限制殼層改成不解析殼層語法、同名工具不再互相冒充）"
tldr: "AG2 v1.1.1 三個重點：(1) breaking——BedrockConfig 從包一層執行緒的 boto3 換成原生 async 的 aiobotocore，傳 boto3.Session 會直接噴錯；(2) 資安——restricted shell 模式改成命令只切一次 argv 就照這份 argv 執行，管線／重導向／萬用字元不再能夾帶第二條指令；(3) 資安——多個工具同名時不再是「誰都碰得到」，改成程式碼宣告優先於 MCP／client 工具，只解析出一個。版號是 patch（1.1.0→1.1.1），內容不是。"
series:
  name: "AI Framework Changelog"
  order: 28
---

> 🌏 [English version](/en/posts/daily/2026-09-30-framework-ag2-1.1.1-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | AG2（前身 AutoGen 社群 fork） |
| 版本 | v1.1.1 |
| 前一版 | v1.1.0 |
| 發布日 | 2026-09-29 |
| Release Notes | [GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.1.1) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.0k |

## 這個版本為什麼重要

篩選框架更新時，版號通常是第一個判準：major 才可能有 breaking change，patch 就是修修 bug。AG2 v1.1.1 剛好是反例——1.1.0 到 1.1.1 是 patch 號，但 release notes 開頭就是一個 `Breaking:` 標題，緊接著還有一整段 `Security`。Bedrock 的呼叫方式從「把同步的 boto3 包進執行緒裡跑」換成原生的 async client（aiobotocore），這不是效能微調，是建構方式整個換掉，舊的 `boto3.Session` 傳進去會直接報錯。同一版另外補了兩個資安洞：限制模式下的殼層工具過去可以被管線或萬用字元夾帶出第二條指令，現在命令只解析一次就照解析結果執行；多個工具同名時，過去核准一個等於連它的同名分身也一起放行，現在每個名字只留一個會被解析到。三件事湊在一起，說明「看版號決定要不要讀」這條捷徑本身就有風險。

## 重要變更

- **Bedrock 原生 async client（Breaking）**：`BedrockConfig` 不再把同步的 boto3 包進執行緒裡逐次呼叫，改用原生 async 的 aiobotocore，每個 Converse 請求也會對照官方 stub 做型別檢查 → 傳入 `session=` 的專案要換成 `aiobotocore.session.AioSession`，`bedrock` extra 安裝的套件也從 boto3 換成 `aiobotocore>=3.9.1,<4`
- **Restricted shell 只解析一次 argv**：設定 `allowed=[...]` 或 `readonly=True` 時，`SandboxShellTool`／`ShellAdapter` 把命令切成 argv、核對這份 argv、就照它執行，事後不會再展開 → 管線、重導向、串接指令、萬用字元、`~`、變數在限制模式下一律不可用，殼層語法會直接被拒絕並回報清楚的錯誤；`readonly=True` 的內建白名單也收斂了，`find`／`file`／`sort`／`uniq`／`git ...` 這類原本內建允許的指令現在要自己加進 `allowed`
- **同名工具只解析出一個**：過去模型呼叫某個工具名稱時，同名的每一個工具都會被觸發，對其中一個做的核准判斷不會綁定它的同名分身 → 現在程式碼裡宣告的工具依宣告順序覆蓋（後宣告的贏），執行期發現的 MCP／client 工具排在程式碼宣告工具之後，衝突時 MCP 工具會被丟掉並提示改用 `tool_name_prefix`
- **Human input over AG-UI**：被服務的 agent 裡的工具可以呼叫 `context.input()` 向人類提問，問題會以該次 run 的 interrupt 結果送到 AG-UI client，答案在下一次 run 的 `resume` 帶回來 → 不必再自己接一條額外的 side channel 處理人類介入
- **MCP 對話不再被閒置逾時打斷**：`SessionStore` 的 idle expiry 與 LRU 滿載回收，過去可能在一輪對話還在跑的當下把它丟掉，現在會等這一輪跑完才計入回收判斷

## Breaking Changes

- `BedrockConfig(session=...)` 現在要求傳入 `aiobotocore.session.AioSession`：
  - 舊：`BedrockConfig(model=MODEL_ID, session=boto3.Session(profile_name="prod"))` → 第一次呼叫就會拋出 `AttributeError: 'Session' object has no attribute 'create_client'`
  - 新：`BedrockConfig(model=MODEL_ID, session=AioSession(profile="prod"))`（`from aiobotocore.session import AioSession`）
- `bedrock` extra 安裝的套件從 `boto3` 換成 `aiobotocore>=3.9.1,<4`：同一個環境如果還裝著 boto3，要挑一個 botocore 版本能同時吃兩邊的 pin
- 影響範圍：透過 `BedrockConfig` 呼叫 Amazon Bedrock、且自己管理 boto3 session 的專案；沒有用到 Bedrock 的專案不受影響

## 遷移指南

### 從 1.1.0 升級到 1.1.1

```bash
pip install --upgrade ag2==1.1.1
```

```python
# 舊寫法（1.1.0 及之前）
import boto3
config = BedrockConfig(model=MODEL_ID, session=boto3.Session(profile_name="prod"))

# 新寫法（1.1.1）
from aiobotocore.session import AioSession
config = BedrockConfig(model=MODEL_ID, session=AioSession(profile="prod"))
```

沒有用到 `BedrockConfig` 的專案沒有程式碼層的 breaking change，但如果有用 `allowed=[...]` 或 `readonly=True` 限制殼層工具，升級後要重新檢查原本依賴的管線／重導向／萬用字元寫法會不會被拒絕——這是行為變嚴格，不是 API 簽名改變，不會在型別檢查時被抓出來。

## 與其他框架的對比觀察

「Agent 執行環境的邊界」這件事最近不只 AG2 在補：CrewAI 幾個月前也把 SSRF 檢查釘死在每一個 redirect hop 上防止跳轉繞過。AG2 這次把同一種心態用在殼層工具（argv-only 解析）和工具身分解析（同名不再互相冒充）上，兩者的共通點是都把「事後才擋」改成「先驗證、驗證完不留展開空間」。對照 watchlist 標註 AG2 的追蹤重點是 A2A 支援，這一版沒有新協定進展，反而是把既有工具呼叫層的信任邊界收緊——對正在把 AG2 接進生產環境、尤其是接了 Bedrock 或用 restricted shell 跑程式碼的團隊，這版的優先順序應該高於單純看 patch 號判斷「可以晚點再升」。

## 今日收穫

之前篩選框架更新，會先看版號決定值不值得細讀——major 才展開看，patch 大概率跳過。AG2 v1.1.1 是個提醒：這個框架的版號不嚴格跟著語意化版本走，一個 patch 號底下可能藏著建構方式整個換掉的 breaking change，外加兩個資安修正。版號能當作「大概率」的篩選捷徑，但不能當作「一定」的依據，尤其是資安相關的變更常常就是刻意用小版號快速出，不想因為等下一個 minor／major 而拖慢修補速度。

## 參考資料

- [AG2 v1.1.1 — GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.1.1)
- [ag2ai/ag2 — GitHub](https://github.com/ag2ai/ag2)
- [AG2 v1.0.2 — 上一篇框架更新](/posts/daily/2026-08-17-framework-ag2-1.0.2)
- [PR #3271：Bedrock 換成原生 aiobotocore async client（breaking change 來源）](https://github.com/ag2ai/ag2/pull/3271)
- [PR #3248：Human input over AG-UI（`context.input()`）](https://github.com/ag2ai/ag2/pull/3248)
- [PR #3288：MCP session store 不再中斷還在跑的對話](https://github.com/ag2ai/ag2/pull/3288)
- [PR #3311：MCP 對話在任一輪還在跑時保持存活](https://github.com/ag2ai/ag2/pull/3311)
- [PR #3299：MCPServerTool 對每個 provider 只送一個 Authorization header](https://github.com/ag2ai/ag2/pull/3299)
