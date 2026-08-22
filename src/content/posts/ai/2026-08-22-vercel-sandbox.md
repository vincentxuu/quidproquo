---
title: "Vercel Sandbox 深入介紹：把 Agent 執行層放進 Vercel 生態"
date: 2026-08-22
category: ai
tags: [vercel, sandbox, ai-agent, fluid-compute, firecracker, security]
lang: zh-TW
type: deep-dive
tldr: "Vercel Sandbox 用 Firecracker microVM 隔離不受信任的程式碼，搭配 Fluid compute、Active CPU 計價與 Vercel OIDC；它最適合已在 Vercel 上運行的 Agent，但網路預設值、記憶體計費與持久化生命週期仍要自己設計。"
description: "從建立、執行、網路隔離到停止與持久化，拆解 Vercel Sandbox 的架構、最小用法、定價、安全邊界，以及與其他 Agent sandbox 的選型差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-vercel-sandbox-en)

[Vercel Sandbox](https://vercel.com/docs/sandbox) 是一個按需建立的 Linux 執行環境，讓應用程式透過 SDK 或 CLI 跑 AI Agent 產生的程式碼、使用者上傳的腳本與測試工作。它不是把 Vercel Function 加上一層權限提示，而是把不受信任的工作移到另一個 Firecracker microVM。Agent 的控制迴圈可以留在 Vercel Function，真正執行 shell、安裝套件與啟動預覽伺服器的部分則進 Sandbox。

產品在 2026 年 1 月正式 GA；Vercel 當時公開的生產使用者包括 v0、Blackbox AI 與 RooCode。這篇不評整套 Vercel Agent Stack，只沿著一個 sandbox 的生命週期，判斷它何時比自行維護容器更合理。

## 一個 Sandbox 從哪裡開始

典型架構有兩個不同的運算邊界：

```text
Browser
   │ request / streamed result
   ▼
Vercel Function ── LLM / AI Gateway
   │ trusted control plane
   │ create, runCommand, stop
   ▼
Vercel Sandbox (Firecracker microVM)
   ├─ generated code
   ├─ isolated filesystem
   └─ controlled outbound network
```

上層 Function 持有身分、資料庫連線與模型金鑰；下層 Sandbox 只拿完成工作所需的檔案與網路能力。Vercel 的安全架構說明特別強調：若把 Agent harness 與生成程式碼放在同一個 VM，兩者仍共享安全脈絡，惡意程式碼還是能讀 harness 的憑證。真正的隔離要把兩者放進不同運算環境。

這也是 [Fluid compute](https://vercel.com/blog/fluid-how-we-built-serverless-servers) 在這套設計裡的位置。Fluid 適合上層等待 LLM、資料庫或 Sandbox 回應的 I/O 密集控制迴圈；Sandbox 則處理短暫、不可預測、可能有害的程式執行。Fluid 會在等待 I/O 時停止計收 CPU，但 Sandbox 不是「Function 內的一個 process」：microVM 隔離、檔案系統與生命週期仍是另一個產品邊界。

## 建立、執行、停止：最小用法

TypeScript SDK 的基本流程很短。部署在 Vercel 時可自動使用專案的 OIDC；本機先執行 `vercel link` 與 `vercel env pull`，外部 CI 才改用 access token。

```ts
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create({
  runtime: 'node24',
  timeout: 5 * 60 * 1000,
  networkPolicy: 'deny-all',
});

try {
  const result = await sandbox.runCommand({
    cmd: 'node',
    args: ['-e', 'console.log(6 * 7)'],
  });

  console.log(result.stdout);
} finally {
  await sandbox.stop();
}
```

底層預設是 Amazon Linux 2023，內建 Node.js 與 Python runtime，也能匯入 OCI image。microVM 內可使用 `sudo`，甚至跑 Docker 或 FUSE；這聽來權限很大，但權限只存在 microVM 裡，不等於取得 Vercel 專案或宿主機權限。這個區分正是產品價值。

Sandbox 預設 session 長度為 5 分鐘；截至 2026 年 8 月，Hobby 最長 45 分鐘，Pro 與 Enterprise 最長 24 小時。需要更久的工作，不該只把 timeout 拉滿：應把可重試的工作切成階段，並把狀態留在 snapshot、persistent sandbox 或獨立儲存。

## 隔離不等於安全設定完成

每個 sandbox 有自己的檔案系統與網路，且不會自動繼承 Function 的環境變數、資料庫連線或雲端資源。這能降低爆炸半徑，卻沒有替應用程式決定哪些外連是合理的。

目前網路 policy 有 `allow-all`、`deny-all` 與自訂規則。產品文件的預設是 `allow-all`，所以「用了 microVM」不代表資料外洩管道已關閉。實務上可先開網路安裝相依套件，再用 `update()` 收緊成 API 網域白名單；若程式碼必須呼叫帶憑證的 API，使用 egress credential brokering，把 header 在離開 sandbox 時注入，別把金鑰放進環境變數。

還有三個邊界不能省略：限制 timeout 與 vCPU 避免失控消耗、不要把 production 資料整包複製進 workspace、把輸出當成不受信任內容重新驗證。Sandbox 降低任意程式碼執行的傷害，不會解決 prompt injection，也不會判斷生成的 SQL 是否符合商業規則。

## 停止之後，狀態去了哪裡

生命週期其實有兩個時鐘：session 決定這次 VM 能跑多久，persistence 決定檔案能不能跨 session 留下。Snapshot 會保存檔案系統與已安裝套件，建立 snapshot 時會停止原 sandbox；預設 30 天到期，也能指定其他期限。這很適合把安裝完成的 `node_modules` 做成起始映像，避免每次重跑套件安裝。

2026 年 3 月推出的 persistent sandbox 仍是 beta。它把具名 sandbox 視為持久身分，停止時自動 snapshot，下一次取回名稱就用新 session 還原。這比手動管理 snapshot 方便，但不要把 beta 功能當資料庫：需要跨 sandbox 分享、獨立備份或長期保存的資料，仍應放到外部儲存。

## 定價要看 CPU 與記憶體兩條線

[Vercel 公開定價](https://vercel.com/pricing)將 Sandbox 拆成 Active CPU、provisioned memory、建立次數、網路與 snapshot storage。截至 2026 年 8 月，起始費率為每 vCPU 小時 0.128 美元、每 GB 小時記憶體 0.0212 美元；方案內含額度與區域價格可能不同。

Active CPU 的好處是等待 LLM 或外部 API 時不收 CPU 費，並不代表整台 sandbox 暫停計價：記憶體仍按 session 的 wall-clock 時間計收。對 I/O 密集 Agent 很有利；對長時間配置大量記憶體、CPU 又幾乎滿載的編譯或資料處理，則要用真實的 active CPU 比例估算，不能直接套 Vercel 宣稱的「最高節省 95%」。

## 怎麼選：生態整合才是分水嶺

| 選項 | 優先考慮的情境 | 主要取捨 |
|---|---|---|
| [Vercel Sandbox](https://vercel.com/sandbox) | Next.js／Vercel Function 已是控制面，需要 OIDC、Observability、預覽 URL 與 Agent Stack 一起運作 | Active CPU 對 I/O 等待友善；平台與持久化抽象綁得較深 |
| [E2B](https://e2b.dev/docs) | 想要以 sandbox 為核心、跨雲端框架呼叫的 Agent 執行 API | 生態較中立；需另接應用部署、身分與觀測系統 |
| [Modal Sandboxes](https://modal.com/docs/guide/sandboxes) | Sandbox 只是更大規模 Python／GPU／批次運算平台的一部分 | 運算選項廣；若只是 Vercel web app 跑短腳本，整合路徑較長 |
| [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) | 控制面已在 Workers／Durable Objects，想沿用 Cloudflare Containers | 貼近 Cloudflare 網路；截至 2026-08，新專案仍面對 1.0 preview 的 API 選擇 |

最實用的判斷不是「哪家 microVM 最安全」，而是誰負責控制面。若應用已部署在 Vercel，`@vercel/sandbox` 省掉一套認證、專案歸屬與觀測整合；若 Agent 必須跨雲端、需要自行排程 GPU，或要求 on-premises，這種便利就不足以主導選型。

## 結論

Vercel Sandbox 的定位很清楚：讓 Vercel 上的受信任應用，把不受信任的程式執行送進獨立 microVM。它的優勢不是發明了 sandbox，而是把 OIDC、Fluid compute、Active CPU 計價、SDK、網路 policy、snapshot 與 Observability 接成同一條產品路徑。

今晚可以做的驗證很具體：在測試專案建立一個 `deny-all` sandbox，跑最小 Node.js 指令，再嘗試讀取上層 Function 的一個測試環境變數與外連網域。確認兩者都拿不到之後，才逐項開放真正需要的檔案、網域與憑證代理。安全邊界應從拒絕開始，不是從便利的預設開始。

## 參考資料

- [Vercel Sandbox 文件](https://vercel.com/docs/sandbox)
- [Vercel Sandboxes 正式推出公告](https://vercel.com/changelog/vercel-sandboxes-ga)
- [Vercel Sandbox 產品頁與定價規格](https://vercel.com/sandbox)
- [Vercel 公開定價](https://vercel.com/pricing)
- [Vercel：Agent 架構的安全邊界](https://vercel.com/blog/security-boundaries-in-agentic-architectures)
- [Vercel Sandbox snapshots](https://vercel.com/docs/vercel-sandbox/concepts/snapshots)
- [Vercel Sandbox automatic persistence beta](https://vercel.com/changelog/vercel-sandbox-persistent-sandboxes-beta)
- [Vercel：Fluid compute 的底層架構](https://vercel.com/blog/fluid-how-we-built-serverless-servers)
- [E2B 文件](https://e2b.dev/docs)
- [Modal Sandboxes 文件](https://modal.com/docs/guide/sandboxes)
- [Cloudflare Sandbox SDK 文件](https://developers.cloudflare.com/sandbox/)
