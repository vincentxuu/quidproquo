---
title: "Cloudflare Sandboxes 深入介紹：Workers、Durable Objects 與 Containers 怎麼組成 Agent 執行環境"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cloudflare-sandboxes, ai-agent, cloudflare-workers, durable-objects, containers, sandbox]
lang: zh-TW
tldr: "Cloudflare Sandboxes 把 Worker 當入口、Durable Object 當具名控制面、獨立 VM 內的 Container 當執行面；適合已在 Cloudflare 上、需要大量短暫 Linux 工作區的 agent，但持久資料、安全邊界與三層費用都得自己設計。"
description: "拆解 Cloudflare Sandbox SDK 的三層架構、生命週期、最小用法、計價、安全模型與選型界線，說明它和一般代管 sandbox 服務的差異。"
series:
  name: "Cloudflare AI Stack"
  order: 10
additionalSeries:
  - name: "沙箱系列"
    order: 15
draft: false
---

> :globe: [English version](/posts/ai/2026-08-22-cloudflare-sandboxes-en)

[Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/) 是讓 Worker 操作隔離 Linux 環境的 SDK。它不是把 shell 塞進 Worker isolate，也不是另一套脫離 Cloudflare 的虛擬機 API。Worker 接請求，Durable Object 用穩定 ID 管理狀態與路由，真正不受信任的程式則在獨立 VM 裡的 Container 執行。

這個定位很重要。若 agent 要 clone repository、安裝套件、跑測試或啟動開發伺服器，isolate 通常太窄，常駐 VM 又容易浪費閒置資源。Sandboxes 選的是中間路線：保留完整 Linux 工具鏈，用名稱重連同一個執行環境，閒置後自動休眠。截至 2026 年 8 月，Sandboxes 與底層 Containers 已在 4 月[正式 GA](https://blog.cloudflare.com/sandbox-ga/)；Cloudflare 公開的採用案例是 Figma Make，而不是一串難以核對的「客戶數」。

## 2026-09 起：Sandbox SDK 1.0 把控制權交回你的 Durable Object

本文下面的程式範例與生命週期描述，是 Sandbox SDK 0.x 的模型：`@cloudflare/sandbox` 提供現成的 `Sandbox` class，`getSandbox()` 拿到操作介面。2026-09-30 推出的 [Sandbox SDK 1.0](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/) 改了這一層：sandbox 改由你自己寫的 Durable Object class 透過 `this.ctx.container` 直接控制，底層用的是 Containers 的 `durable_object` scheduling policy（public beta）。

```ts
import { Files } from "@cloudflare/sandbox";
import { DurableObject } from "cloudflare:workers";

export class MySandbox extends DurableObject<Env> {
  async run(script: string) {
    const container = this.ctx.container!;
    if (!container.running) {
      // image、規格、能不能連外網，都由你的程式決定
      container.start({
        image: container.images.sandbox,
        instance: "lite",
        enableInternet: false,
      });
    }
    await new Files(container).writeFile("/tmp/task.sh", script);
    const proc = await container.exec(["sh", "/tmp/task.sh"]);
    return proc.output();
  }
}
```

這帶來幾個實際差異：每次 `start()` 都能選 image 與 instance 規格；部署新版不會重啟正在跑的 sandbox；可以把檔案存成 snapshot（public beta）再從它啟動；何時停機、對外暴露哪些方法、outbound request 怎麼加憑證，都寫在自己的 class 裡。官方遷移文件引用的獨立 benchmark 中，同時啟動 100 個 sandbox，從建立到能執行命令的中位數由 4.0 秒降到 648 毫秒。

1.0 也把 sandbox 分成兩種環境：需要完整 Linux 的用 Containers；只需要執行 JavaScript、Python 或 WebAssembly 的，可以用 [Dynamic Workers](https://developers.cloudflare.com/sandbox/get-started/dynamic-workers/) 在 runtime 建立隔離的 Worker，不必開 VM。

已經在用 0.x 的專案：0.x 到 2026-12-31 前只收 bug 與安全修正、不再加功能，之後已部署的應用仍可繼續跑。官方的 [Migrate from Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/migrate/) 說明這是單向切換，要換成自己的 Durable Object class。下面的三層架構觀念在 1.0 仍成立，只是中間那層從 SDK 內建 class 變成你自己的 class。

## 三層架構是產品的核心取捨

官方 0.x [架構文件](https://developers.cloudflare.com/sandbox/sdk/concepts/architecture/)把請求路徑拆成三層：

```text
使用者 / agent
      │ HTTPS
      ▼
Cloudflare Worker          驗證、授權、應用邏輯
      │ Durable Object stub
      ▼
Sandbox Durable Object     sandbox ID、路由、生命週期
      │ HTTP 或 RPC
      ▼
獨立 VM 內的 Container     shell、檔案、程序、網路服務
```

Worker 是你應該放 authentication、rate limit 與租戶規則的地方。`getSandbox(namespace, id)` 回傳的不是一台剛建立的機器；它是指向具名 Durable Object 的操作介面，相同 ID 會被送回相同位置。Durable Object 擁有 Container 的生命週期，Container 才執行 `exec()`、檔案操作與背景程序。

這讓 Cloudflare 現有元件自然接在一起：HTTP、WebSocket、Workers binding、日誌與 Cloudflare 網路都在同一套平台內。代價也很直接：你買到的不只是一段「sandbox 秒數」；實際上是在操作 Worker、Durable Object、Container 三個會各自產生限制與費用的元件。

預設 transport 讓每個 SDK 動作成為一次 HTTP subrequest。0.x 大量連續讀寫時，可依[平台限制文件](https://developers.cloudflare.com/sandbox/sdk/platform/limits/)設定 `SANDBOX_TRANSPORT=rpc`，把多個操作 multiplex 到單一持續連線。Paid plan 的單次 Worker request 上限為 1,000 個 subrequests，這不是等流量上來才該處理的細節。

## 一個最小的 sandbox（0.x）

0.x 的官方 starter 會同時產生 Worker、Container 設定與 Dockerfile。核心程式其實很短：

```ts
import { getSandbox, type Sandbox } from "@cloudflare/sandbox";

export { Sandbox } from "@cloudflare/sandbox";

interface Env {
  Sandbox: DurableObjectNamespace<Sandbox>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const userId = await authenticate(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const sandbox = getSandbox(env.Sandbox, `user-${userId}`, {
      sleepAfter: "10m",
    });
    const result = await sandbox.exec('python3 -c "print(2 + 2)"');

    return Response.json({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    });
  },
};
```

`wrangler.jsonc` 還要宣告 Container image、instance type、最大實例數、Durable Object binding 與 SQLite migration。第一次部署會建置 Docker image、推送至 Cloudflare registry，再部署 Worker；官方 0.x [入門文件](https://developers.cloudflare.com/sandbox/sdk/get-started/)提醒，Worker 先完成不代表 Container image 已完成佈建。

這個範例刻意從已驗證的 `userId` 衍生 sandbox ID。ID 只是路由鍵，不是密碼；直接讓使用者提交任意 ID，就等於把租戶隔離交給猜字串。

## 生命週期：名稱持久，容器內容不持久

Sandboxes 最容易被誤讀的地方是「stateful」。依 0.x [生命週期文件](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/)，第一次操作某個 ID 時才建立環境；活動期間，檔案、背景程序、shell session 與 interpreter context 都保留。預設閒置 10 分鐘後 Container 停止，下一次請求會以乾淨環境重新啟動，原本的檔案與程序都消失。

因此持久的是 Durable Object 身分與路由，不是 Container filesystem。可靠的 agent 工作流應把原始 repository、產物與 checkpoint 放在 Git、R2 或其他持久儲存，啟動時檢查並重建工作區。短任務在 `finally` 呼叫 `destroy()`；需要長跑才使用 `keepAlive`，工作結束後再關掉。不要把「同一個 sandbox ID」當成「永遠是同一顆磁碟」。

1.0 的[生命週期](https://developers.cloudflare.com/sandbox/concepts/lifetime/)規則更明確：Durable Object 處理 request、alarm、串流或已接受的 WebSocket 時算活動中；變成閒置後，instance 會再跑 `setInactivityTimeout()` 設定的時間（最多 6 小時），沒設就很快停止。容器裡自己在跑的 build 或測試不算活動，長任務要靠比 timeout 更頻繁的 alarm 撐住。閒置但還沒停的 instance 照樣按 memory 與 disk 計費。要跨 instance 留住檔案，就在停機前存 snapshot（建立或最近一次還原後保留 30 天，不含記憶體與 process），或把資料放在掛載的 R2 bucket。

第一個請求也會決定 Sandbox 的地理位置，之後仍路由到那裡。單一 ID 換來一致性，跨洲使用者則可能換來延遲。真的需要多區時，要在命名策略裡明確帶 region，而不是期待平台自動搬移有狀態的執行環境。

## 安全邊界比「能跑不受信任程式」更窄

官方 0.x [安全模型](https://developers.cloudflare.com/sandbox/sdk/concepts/security/)說明，每個 sandbox 位於獨立 VM，filesystem、process、network stack 與資源配額彼此隔離。但同一個 sandbox 裡的所有 session 會看到共同檔案與程序，所以多租戶不能只靠 session 分隔，應該一個使用者或信任域一個 sandbox。

VM 隔離也不會替應用完成授權、輸入驗證與 rate limiting。把使用者輸入拼進 shell 仍會造成 command injection；preview URL 與 quick tunnel URL 拿到網址的人就能連線，敏感服務仍要加應用層驗證。最實際的做法是：在 Worker 驗證身分、從可信 claim 產生 ID、限制命令與資源、完成後銷毀環境。

憑證尤其不該直接寫進工作區。若 Container 不需要讀到 secret，可使用 outbound handler：請求先回到 Worker，由 Worker 在網路層加入真正憑證，再送往 GitHub 或模型 API。這比把長效 token 放進 environment variable 更能抵抗 agent 主動讀取；若程式本身確實需要 secret，才以環境變數注入並縮短有效期。

## 定價與容量要拆成三張帳單看

Sandbox SDK 沒有獨立套餐。[官方定價頁](https://developers.cloudflare.com/sandbox/sdk/platform/pricing/)明列底層 Containers，加上 Worker、Durable Object，以及選用的 Workers Logs 都會計費。Containers 在每 10ms 計量；CPU 只算實際使用量，memory 與 disk 則按配置資源計算。

以 [Containers 價格](https://developers.cloudflare.com/containers/platform/pricing/)為準，Workers Paid 每月 5 美元；超額 CPU 為每 vCPU-second 0.000020 美元。方案內含量是 25 GiB-hours memory、375 vCPU-minutes 與 200 GB-hours disk。

最小 `lite` 是 1/16 vCPU、256 MiB memory 與 2 GB disk。最大公開規格 `standard-4` 是 4 vCPU、12 GiB memory 與 20 GB disk。出口流量另依區域計費，台灣屬每 GB 0.05 美元的區域。

GA 公告稱標準方案可同時跑 15,000 個 `lite` instance、6,000 個 `basic`，大型規格超過 1,000 個。這是平台公開容量上限，不是每個新帳號必然能無條件取得的吞吐保證。估價時應拿自己的啟動頻率、活躍 CPU、配置記憶體、閒置時間、egress，再加 Worker 與 Durable Object request 做負載測試。

## 跟其他 sandbox 服務相比，差異在控制面

E2B、Modal、Daytona、Runloop 與 Vercel Sandbox 都能提供隔離執行環境，卻各自在模板、工作區、GPU、開發環境或平台整合上做不同抽象。沒有一致 workload 的公開 benchmark，硬排速度名次沒有意義。選 Cloudflare 的理由應該是架構吻合，而不是「edge」三個字。

如果入口本來就是 Workers，需要 Durable Object 的具名協調、Cloudflare 網路與大量休眠後喚醒的 Linux workspace，Sandboxes 可以少接一套外部控制面。若需求是 GPU 計算、明確的跨雲可攜性、長期不休眠的主機或持久 block storage，應先比較專門平台。希望供應商包辦 template catalog、team workspace 與完整管理介面，也該先看專門平台或既有 Container/Kubernetes 基礎設施。

真正的選型問題是：團隊是否願意把 Worker、Durable Object 與 Container 當成一個分散式系統一起維運。願意，而且產品已在 Cloudflare 上，這套組合很順；只想要一個 API 丟程式、拿結果，三層計價與生命週期反而可能是多餘複雜度。

## 整體來說

Cloudflare Sandboxes 的強項不在發明新的隔離原理；它把完整 Linux 執行環境接進 Cloudflare 已有的應用控制面。Worker 負責政策，Durable Object 負責身分與生命週期，獨立 VM 內的 Container 負責風險較高的執行。這條邊界理解正確，才知道哪些狀態會消失、哪些 secret 不該進 Container、哪三份帳單會一起成長。

導入前可以先做一個真實任務的壓力測試。以租戶 ID 建 sandbox，clone repository、安裝依賴、跑測試、上傳產物、休眠後重建，再量冷啟動與總成本。這一輪若能通過，Sandboxes 才是 agent runtime；否則它只是很好看的 `exec()` demo。

## 更新紀錄

- 2026-11-23：新增 2026-09-30 推出的 Sandbox SDK 1.0（自己的 Durable Object 透過 `ctx.container` 控制、snapshot、Dynamic Workers 環境、0.x 支援到 2026-12-31），標明原範例屬 0.x；補 1.0 的 inactivity timeout（最多 6 小時）與 snapshot 規則；0.x 文件連結改到 `/sandbox/sdk/` 新路徑。
- 2026-08-30：納入 Cloudflare AI Stack，作為 Sandbox SDK / agent code execution 篇。

## 參考資料

- [Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Changelog：Sandbox SDK 1.0](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/)
- [Cloudflare Sandboxes：Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/)
- [Cloudflare Sandboxes：Migrate from Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/migrate/)
- [Cloudflare Sandbox SDK 0.x：Architecture](https://developers.cloudflare.com/sandbox/sdk/concepts/architecture/)
- [Cloudflare Sandboxes：Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/)
- [Cloudflare Sandbox SDK 0.x：Sandbox lifecycle](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/)
- [Cloudflare Sandboxes：Security](https://developers.cloudflare.com/sandbox/concepts/security/)
- [Cloudflare Sandbox SDK 0.x：Pricing](https://developers.cloudflare.com/sandbox/sdk/platform/pricing/)
- [Cloudflare Sandbox SDK 0.x：Limits](https://developers.cloudflare.com/sandbox/sdk/platform/limits/)
- [Cloudflare Containers：Pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Cloudflare Blog：Agents have their own computers with Sandboxes GA](https://blog.cloudflare.com/sandbox-ga/)
