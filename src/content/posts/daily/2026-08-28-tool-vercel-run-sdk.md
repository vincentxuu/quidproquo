---
title: "工具推薦｜Vercel Run SDK — 讓 agent 生成的程式碼在沙盒裡跑，卡在核可也不用重來"
date: 2026-08-28
category: daily
tags: [ai-agent, tool, daily, sdk]
lang: zh-TW
description: "Vercel 開源的 QuickJS 沙盒執行環境，讓 agent 生成的 JS/TS 只能呼叫你明確開放的 host function，中斷等人核可後還能從斷點續跑、不重跑已完成的呼叫"
tldr: "Run SDK 是 Vercel 開源的 QuickJS 沙盒，讓 agent 生成的 JS/TS 只能呼叫你開放的 host function。安裝：pnpm add run。解決了 agent 執行動態程式碼時「要嘛裸用 eval、要嘛上整台虛擬機」的兩難。"
series:
  name: "AI Tool of the Day"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-08-28-tool-vercel-run-sdk-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Run SDK |
| 類型 | SDK（JavaScript/TypeScript 沙盒執行環境） |
| GitHub | [vercel-labs/run](https://github.com/vercel-labs/run) |
| Stars | 61 |
| 語言 | TypeScript |
| 授權 | Apache-2.0 |
| 安裝 | `pnpm add run` |

## 解決什麼問題

你想讓 agent 自己寫一段程式碼跑邏輯——像是 AI SDK 的 code mode、code interpreter，或是讓模型直接組一段 JS 呼叫你的工具函式而不是逐次來回 tool call。問題是執行「模型生成的程式碼」通常只有兩個選項：裸用 `eval` 或 Node 的 `vm` 模組，讓那段程式碼理論上碰得到你整個 process；或是上一整台虛擬機/容器做隔離，啟動慢、資源重，殺雞用牛刀。Node.js 官方文件對 `vm` 模組講得很直白：「`node:vm` 不是安全機制，不要用它跑不受信任的程式碼」。

Run SDK 把 guest 程式碼丟進一個獨立 worker thread 裡的 QuickJS context，預設沒有 Node.js、檔案系統、環境變數、網路模組——只能呼叫你在 `hostFunctions` 裡明確列出的函式，引數和回傳值透過序列化格式跨界拷貝，guest 和 host 不共享 JS 物件。更特別的是它支援「中斷－核可－續跑」：host function 可以在執行到一半時呼叫 `context.interrupt()` 暫停整個 run，把狀態序列化成一個 continuation token 存起來；等人工核可或外部驗證完成，用同一個 token 續跑時，先前已經成功呼叫過的 host function 不會重跑一次，只有中斷點之後的邏輯繼續往下走。

適合場景：AI SDK 的 code-mode 模式、想讓 agent 自己組邏輯呼叫你 API 但要卡權限的場景、或是「這段程式碼能不能碰資料庫」需要細粒度授權的地方。如果 agent 需要裝套件、跑 shell 指令、或碰作業系統層級的東西，這個工具管不到，那是 Vercel Sandbox 的範圍。

## 快速上手

### 安裝

```bash
pnpm add run
# 需要 Node.js 22.13+ 或 Bun
```

### 基本用法

```ts
import { run } from 'run';

const result = await run({
  source: `
    const total = await tools.sum(1, 2, 3, 4);
    return { total };
  `,
  hostFunctions: {
    tools: {
      sum: (...values: number[]) =>
        values.reduce((total, value) => total + value, 0),
    },
  },
});

if (result.status === 'completed') {
  console.log(result.value); // { total: 10 }
}
```

`hostFunctions` 裡的每一組會變成 guest 程式碼裡的一個全域物件；`source` 支援 top-level `await` 和 `return`，每次呼叫都拿到全新的 QuickJS context，不會殘留上一次的變數。

### 進階用法：中斷等核可，續跑不重來

```ts
// host function 內部
const context = getHostFunctionContext();

if (context.resume === undefined) {
  context.interrupt({ kind: 'approval', message: 'Send this message?' });
}

if (context.resume.resolution !== true) {
  return { sent: false };
}
return { sent: true };
```

```ts
// host 收到中斷結果後，把 continuation 存起來等人核可
if (result.status === 'interrupted') {
  await continuationStore.set(approvalId, {
    continuation: result.continuation,
    interruptions: result.interruptions,
  });
}
```

等外部決定出爐，host 讀回同一個 continuation token 傳給下一次 `run()`，之前已經結算過的 host function 呼叫（包含它們的回傳值或錯誤）會從 ledger 重放，不會重新執行副作用。

## 與現有工具的比較

| | Run SDK | vm2 / Node `vm` | isolated-vm | Vercel Sandbox |
|---|---|---|---|---|
| 隔離邊界 | QuickJS worker thread | 包在 `node:vm` 之上做 contextify | V8 isolate | 完整虛擬機/容器 |
| 官方定位為安全沙盒 | ✅ | ❌（Node 官方文件明講 `vm` 不是安全機制） | 部分（isolate 邊界仍需自行把關） | ✅（OS 層隔離） |
| 中斷等核可、續跑不重跑已完成呼叫 | ✅ | ❌ | ❌ | ❌ |
| 啟動開銷 | 低（worker thread） | 低 | 低 | 高（開整台機器/容器） |
| 可裝套件 / 跑作業系統指令 | ❌ | ❌ | ❌ | ✅ |

## 注意事項

- **只解決「跑一段 JS/TS 邏輯」，不是通用沙盒**：需要檔案系統、套件安裝或跑作業系統指令的工作，README 自己就寫明要換用 Vercel Sandbox。
- **Node.js 22.13+ 門檻不低**：還在用較舊 LTS（如 Node 20）的專案要先升級才能裝。
- **continuation token 只簽章不加密**：官方文件特別提醒，預設的 signed codec 只保證完整性、不做加密，token 內容是 base64，不要把敏感資料放進 continuation context、host function 參數或中斷 payload 裡。

## 今日收穫

過去談「讓 agent 跑動態程式碼」多半只討論隔離夠不夠強，Run SDK 提醒了另一個常被忽略的維度：agent 執行的流程常常需要卡在「等人核可」這一步，如果沙盒本身不支援暫停/續跑，你只能自己在應用層外掛一套重跑去重的邏輯，還很容易把已經產生副作用的呼叫重複執行一次。把「中斷—核可—續跑不重放副作用」做進沙盒的執行語意裡，比事後在外面補一層冪等檢查更貼近 agent 實際會卡住的地方。

## 參考資料

- [vercel-labs/run GitHub repo](https://github.com/vercel-labs/run)：README、授權（Apache-2.0）、stars 數字均出自官方 repo。
- [content/docs/foundations/interruptions.mdx](https://github.com/vercel-labs/run/blob/main/content/docs/foundations/interruptions.mdx)：中斷／continuation／resolution／replay 語意說明與程式碼範例。
- [Introducing Run SDK: secure eval for your agents — Vercel Blog](https://vercel.com/blog/introducing-run)：2026-08-25 發佈公告。
- [run — npm](https://www.npmjs.com/package/run)：套件安裝方式與版本紀錄。
- [Node.js VM (executing JavaScript) 官方文件](https://nodejs.org/api/vm.html)：「`node:vm` 不是安全機制，不要用它跑不受信任的程式碼」原文出處。
